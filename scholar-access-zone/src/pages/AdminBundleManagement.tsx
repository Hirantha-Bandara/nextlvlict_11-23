import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { Package, Pencil, Trash, Plus, Search, Filter, Video, X, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { apiFetch } from '@/lib/utils';
import { getYouTubeEmbedUrl, extractYouTubeVideoId } from '@/lib/youtube';
import { AdminNavbar } from '@/components/AdminNavbar';
import AccessBadge from '@/components/ui/AccessBadge';
import { Badge } from '@/components/ui/badge';

type Recording = {
  id: number;
  title: string;
  description: string;
  youtube_url: string;
  accessType?: 'FREE' | 'PAID' | string;
  access_type?: 'FREE' | 'PAID' | string;
  price?: number;
  status?: string;
  created_at: string;
  grade: {
    id: number;
    name: string;
    fee: number;
  };
  thumbnail_url?: string | null;
};

type Bundle = {
  id: number;
  title: string;
  description: string;
  price: number;
  accessType?: 'FREE' | 'PAID' | string;
  access_type?: 'FREE' | 'PAID' | string;
  status?: string;
  created_at: string;
  grade: {
    id: number;
    name: string;
    fee: number;
  };
  thumbnail_url?: string | null;
  recordings?: Recording[];
};

type Grade = {
  id: number;
  name: string;
  fee: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

const getItemAccessType = (item: { accessType?: string; access_type?: string; price?: number }): 'FREE' | 'PAID' => {
  const at = (item.accessType || item.access_type || '').toUpperCase();
  if (at === 'FREE' || item.price === 0) return 'FREE';
  return 'PAID';
};

const AdminBundleManagement = () => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [currentBundleId, setCurrentBundleId] = useState<number | null>(null);
  const [previewLessons, setPreviewLessons] = useState<any[]>([]);

  // Bundle form state
  const [newBundle, setNewBundle] = useState<{
    title: string;
    description: string;
    access_type: 'FREE' | 'PAID';
    price: number;
    grade: { id: number; name: string; fee: number };
  }>({
    title: '',
    description: '',
    access_type: 'PAID',
    price: 0,
    grade: { id: 0, name: '', fee: 0 }
  });

  // YouTube URLs for the bundle
  const [youtubeUrls, setYoutubeUrls] = useState<Array<{ id: number; url: string }>>([
    { id: 1, url: '' }
  ]);

  // Filters
  const [search, setSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');

  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecordings, setSelectedRecordings] = useState<number[]>([]);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isAdminLoggedIn) {
      navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6");
      return;
    }

    fetchBundles();
    fetchRecordings();
    fetchGrades();
  }, [navigate]);

  const fetchRecordings = async () => {
    try {
      const response = await apiFetch('ClassRecordings?action=getAll', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setRecordings(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  const fetchBundles = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('RecordingBundleServlet?action=getAll', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setBundles(result.data);
        } else {
          toast.error(result.message || 'Failed to load bundles');
          setBundles([]);
        }
      } else {
        toast.error('Failed to load bundles');
        setBundles([]);
      }
    } catch (error) {
      console.error('Error fetching bundles:', error);
      toast.error('Failed to load bundles');
      setBundles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await apiFetch('ClassScheduling?action=getGrades', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const gradesData = await response.json();
        setGrades(gradesData);
      } else {
        toast.error('Failed to load grades');
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('Failed to load grades');
    }
  };

  const fetchBundleRecordings = async (bundleId: number) => {
    try {
      const response = await apiFetch(`RecordingBundleServlet?action=getBundleRecordings&bundle_id=${bundleId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.recordings)) {
          setSelectedRecordings(result.recordings.map((r: Recording) => r.id));
        }
      }
    } catch (error) {
      console.error('Error fetching bundle recordings:', error);
    }
  };

  const fetchBundleLessons = async (bundleId: number) => {
    try {
      const response = await apiFetch(`RecordingBundleServlet?action=getBundleLessons&bundle_id=${bundleId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const urls = result.data.map((lesson: any, index: number) => ({
            id: index + 1,
            url: lesson.youtubeUrl || ''
          }));
          setYoutubeUrls(urls.length > 0 ? urls : [{ id: 1, url: '' }]);
        }
      }
    } catch (error) {
      console.error('Error fetching bundle lessons:', error);
    }
  };

  const handlePreviewBundle = async (bundle: Bundle) => {
    try {
      const response = await apiFetch(`RecordingBundleServlet?action=getBundleLessons&bundle_id=${bundle.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setPreviewLessons(result.data);
          setIsPreviewDialogOpen(true);
        } else {
          toast.error('No lessons found in this bundle');
        }
      } else {
        toast.error('Failed to load bundle lessons');
      }
    } catch (error) {
      console.error('Error fetching bundle lessons for preview:', error);
      toast.error('Failed to load bundle lessons');
    }
  };

  const handleAddBundle = () => {
    setEditingBundle(null);
    setNewBundle({
      title: '',
      description: '',
      access_type: 'PAID',
      price: 0,
      grade: { id: 0, name: '', fee: 0 }
    });
    setSelectedRecordings([]);
    setIsDialogOpen(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    setEditingBundle(bundle);
    const accessType = getItemAccessType(bundle);
    setNewBundle({ 
      title: bundle.title || '',
      description: bundle.description || '',
      access_type: accessType,
      price: accessType === 'FREE' ? 0 : (bundle.price || 0),
      grade: bundle.grade || { id: 0, name: '', fee: 0 }
    });
    fetchBundleRecordings(bundle.id);
    // Fetch existing lessons to populate YouTube URLs
    fetchBundleLessons(bundle.id);
    setIsDialogOpen(true);
  };

  const handleManageRecordings = (bundle: Bundle) => {
    setCurrentBundleId(bundle.id);
    fetchBundleRecordings(bundle.id);
    setIsRecordingDialogOpen(true);
  };

  const handleDeleteBundle = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this bundle?')) {
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('id', id.toString());

      const response = await apiFetch('RecordingBundleServlet?action=delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include'
      });

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        toast.success('Bundle deleted successfully');
        fetchBundles();
      } else {
        toast.error(result.message || 'Failed to delete bundle');
      }
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast.error('Failed to delete bundle');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setNewBundle(prev => ({
        ...prev,
        price: value === '' ? 0 : parseFloat(value) || 0
      }));
    } else {
      setNewBundle(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'grade_id') {
      const gradeId = parseInt(value);
      const selectedGrade = grades.find(g => g.id === gradeId);
      setNewBundle(prev => ({
        ...prev,
        grade: selectedGrade || { id: 0, name: '', fee: 0 }
      }));
    } else if (name === 'access_type') {
      const accessType = value as 'FREE' | 'PAID';
      setNewBundle(prev => ({
        ...prev,
        access_type: accessType,
        price: accessType === 'FREE' ? 0 : prev.price
      }));
    }
  };

  const handleSaveBundle = async () => {
    if (!newBundle.title || !newBundle.grade?.id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newBundle.access_type === 'PAID' && (newBundle.price === undefined || newBundle.price < 0)) {
      toast.error('Please enter a valid price for PAID access');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('title', newBundle.title);
      formData.append('description', newBundle.description);
      formData.append('grade_id', newBundle.grade.id.toString());
      formData.append('access_type', newBundle.access_type);
      formData.append('accessType', newBundle.access_type);
      formData.append('price', (newBundle.access_type === 'FREE' ? 0 : newBundle.price).toString());
      formData.append('recording_ids', selectedRecordings.join(','));

      // Add YouTube URLs as lessons
      const lessons = youtubeUrls
        .filter(item => item.url.trim() !== '')
        .map((item, index) => ({
          title: `Recording ${item.id}`,
          description: '',
          youtube_url: item.url,
          thumbnail_url: null
        }));
      
      if (lessons.length > 0) {
        formData.append('lessons', JSON.stringify(lessons));
      }

      const url = editingBundle 
        ? `RecordingBundleServlet?action=update&id=${editingBundle.id}`
        : 'RecordingBundleServlet?action=save';

      const response = await apiFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include'
      });

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        toast.success(editingBundle ? 'Bundle updated successfully' : 'New bundle added successfully');
        fetchBundles();
        setIsDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to save bundle');
      }
    } catch (error) {
      console.error('Error saving bundle:', error);
      toast.error('Failed to save bundle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordingToggle = (recordingId: number) => {
    setSelectedRecordings(prev => {
      if (prev.includes(recordingId)) {
        return prev.filter(id => id !== recordingId);
      } else {
        return [...prev, recordingId];
      }
    });
  };

  const handleAddYoutubeUrl = () => {
    const newId = youtubeUrls.length + 1;
    setYoutubeUrls([...youtubeUrls, { id: newId, url: '' }]);
  };

  const handleRemoveYoutubeUrl = (id: number) => {
    if (youtubeUrls.length > 1) {
      setYoutubeUrls(youtubeUrls.filter(item => item.id !== id));
    }
  };

  const handleYoutubeUrlChange = (id: number, value: string) => {
    setYoutubeUrls(youtubeUrls.map(item => 
      item.id === id ? { ...item, url: value } : item
    ));
  };

  const handleSaveBundleRecordings = async () => {
    if (!currentBundleId) return;

    setIsLoading(true);
    try {
      // First, remove all existing recordings from the bundle
      const bundleResponse = await apiFetch(`RecordingBundleServlet?action=getBundleRecordings&bundle_id=${currentBundleId}`, {
        credentials: 'include'
      });
      
      if (bundleResponse.ok) {
        const result = await bundleResponse.json();
        if (result.success && Array.isArray(result.recordings)) {
          // Remove all existing recordings
          for (const recording of result.recordings) {
            const formData = new URLSearchParams();
            formData.append('bundle_id', currentBundleId.toString());
            formData.append('recording_id', recording.id.toString());
            
            await apiFetch('RecordingBundleServlet?action=removeRecordingFromBundle', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: formData.toString(),
              credentials: 'include'
            });
          }
        }
      }

      // Add selected recordings
      for (const recordingId of selectedRecordings) {
        const formData = new URLSearchParams();
        formData.append('bundle_id', currentBundleId.toString());
        formData.append('recording_id', recordingId.toString());
        
        await apiFetch('RecordingBundleServlet?action=addRecordingToBundle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
          credentials: 'include'
        });
      }

      toast.success('Bundle recordings updated successfully');
      setIsRecordingDialogOpen(false);
      fetchBundles();
    } catch (error) {
      console.error('Error updating bundle recordings:', error);
      toast.error('Failed to update bundle recordings');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered bundles
  const filteredBundles = useMemo(() => {
    return bundles.filter(bundle => {
      if (accessFilter !== 'ALL') {
        const itemAccess = getItemAccessType(bundle);
        if (itemAccess !== accessFilter) return false;
      }
      if (gradeFilter !== 'ALL') {
        if (bundle.grade?.id?.toString() !== gradeFilter) return false;
      }
      if (search.trim() !== '') {
        const query = search.toLowerCase();
        const matchesTitle = bundle.title?.toLowerCase().includes(query);
        const matchesDesc = bundle.description?.toLowerCase().includes(query);
        const matchesGrade = bundle.grade?.name?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesGrade) return false;
      }
      return true;
    });
  }, [bundles, accessFilter, gradeFilter, search]);

  return (
    <div className="min-h-screen bg-portal-background">
      <AdminNavbar />
      <div className="p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-portal-blue">Recording Bundles Management</h1>
              <p className="text-sm text-slate-500 mt-1">Create and manage class recording bundles (Free & Paid)</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard")}>
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-portal-blue" />
                <span>Recording Bundles ({filteredBundles.length})</span>
              </CardTitle>
              <Button onClick={handleAddBundle} disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bundle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters & Search */}
              <div className="grid gap-3 md:grid-cols-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search bundles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                  <Select
                    value={accessFilter}
                    onValueChange={setAccessFilter}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Access Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Access Types</SelectItem>
                      <SelectItem value="FREE">FREE Only</SelectItem>
                      <SelectItem value="PAID">PAID Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={gradeFilter}
                    onValueChange={setGradeFilter}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Grades</SelectItem>
                      {grades.map(g => (
                        <SelectItem key={g.id} value={g.id.toString()}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bundles Table */}
              {isLoading ? (
                <div className="text-center py-8 text-slate-500">
                  <p>Loading bundles...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Access Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBundles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Package className="h-12 w-12 mb-4 opacity-50" />
                            <p className="font-semibold">No bundles found</p>
                            <p className="text-sm mt-1">Try clearing filters or click "Add Bundle" to create one.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBundles.map((bundle) => (
                        <TableRow key={bundle.id}>
                          <TableCell className="font-medium">{bundle.title}</TableCell>
                          <TableCell>Grade {bundle.grade?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <AccessBadge accessType={getItemAccessType(bundle)} />
                          </TableCell>
                          <TableCell>
                            {getItemAccessType(bundle) === 'FREE' ? 'Free' : `LKR ${bundle.price?.toFixed(2) || '0.00'}`}
                          </TableCell>
                          <TableCell>
                            {bundle.created_at ? new Date(bundle.created_at).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePreviewBundle(bundle)}
                                disabled={isLoading}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                              </Button>
                              {/*<Button*/}
                              {/*  size="sm"*/}
                              {/*  variant="outline"*/}
                              {/*  onClick={() => handleManageRecordings(bundle)}*/}
                              {/*  disabled={isLoading}*/}
                              {/*>*/}
                              {/*  <Video className="h-4 w-4 mr-1" />*/}
                              {/*  Recordings*/}
                              {/*</Button>*/}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditBundle(bundle)}
                                disabled={isLoading}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteBundle(bundle.id)}
                                disabled={isLoading}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="bg-slate-50 flex justify-between">
              <p className="text-sm text-muted-foreground">Showing {filteredBundles.length} of {bundles.length} bundle{bundles.length !== 1 ? 's' : ''}</p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Add/Edit Bundle Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBundle ? 'Edit Bundle' : 'Add New Bundle'}</DialogTitle>
            <DialogDescription>
              {editingBundle ? 'Update bundle details and recordings' : 'Create a new recording bundle'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={newBundle.title}
                onChange={handleInputChange}
                placeholder="Bundle title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newBundle.description}
                onChange={handleInputChange}
                placeholder="Bundle description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade_id">Grade *</Label>
                <Select
                  value={newBundle.grade.id.toString()}
                  onValueChange={(value) => handleSelectChange('grade_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map(g => (
                      <SelectItem key={g.id} value={g.id.toString()}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="access_type">Access Type</Label>
                <Select
                  value={newBundle.access_type}
                  onValueChange={(value) => handleSelectChange('access_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">FREE</SelectItem>
                    <SelectItem value="PAID">PAID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {newBundle.access_type === 'PAID' && (
              <div className="space-y-2">
                <Label htmlFor="price">Price (LKR) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={newBundle.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>YouTube URLs for Recordings</Label>
              <div className="space-y-2">
                {youtubeUrls.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded text-sm font-medium text-slate-600">
                      {item.id}
                    </div>
                    <Input
                      value={item.url}
                      onChange={(e) => handleYoutubeUrlChange(item.id, e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1"
                    />
                    {youtubeUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveYoutubeUrl(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddYoutubeUrl}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another URL
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBundle} disabled={isLoading}>
              {isLoading ? 'Saving...' : editingBundle ? 'Update Bundle' : 'Create Bundle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Recordings Dialog */}
      <Dialog open={isRecordingDialogOpen} onOpenChange={setIsRecordingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Bundle Recordings</DialogTitle>
            <DialogDescription>
              Select which recordings to include in this bundle
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
              {recordings.length === 0 ? (
                <p className="text-sm text-slate-500">No recordings available</p>
              ) : (
                recordings.map(recording => (
                  <div key={recording.id} className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded">
                    <Checkbox
                      id={`bundle-recording-${recording.id}`}
                      checked={selectedRecordings.includes(recording.id)}
                      onCheckedChange={() => handleRecordingToggle(recording.id)}
                    />
                    <Label
                      htmlFor={`bundle-recording-${recording.id}`}
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{recording.title}</span>
                        <span className="text-xs text-slate-500">Grade {recording.grade?.name} • {getItemAccessType(recording)}</span>
                      </div>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBundleRecordings} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Bundle Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bundle Preview</DialogTitle>
            <DialogDescription>
              Preview the lessons and recordings in this bundle
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {previewLessons.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No lessons found in this bundle</p>
              </div>
            ) : (
              previewLessons.map((lesson, index) => {
                const videoId = extractYouTubeVideoId(lesson.youtubeUrl);
                const embedUrl = getYouTubeEmbedUrl(lesson.youtubeUrl);
                return (
                  <div key={lesson.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Lesson {index + 1}: {lesson.title || 'Untitled'}</h3>
                          {lesson.description && (
                            <p className="text-sm text-slate-600 mt-1">{lesson.description}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="ml-4 shrink-0">
                          Order: {lesson.displayOrder}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      {embedUrl ? (
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            title={lesson.title || `Lesson ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full rounded-lg bg-slate-100 flex items-center justify-center">
                          <div className="text-center text-slate-500">
                            <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Invalid or missing YouTube URL</p>
                            <p className="text-xs mt-1 font-mono">{lesson.youtubeUrl || 'No URL provided'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBundleManagement;
