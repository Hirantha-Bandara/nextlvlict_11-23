import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { Video, Pencil, Trash, Plus, Download, FileText, Search, Filter } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/utils';
import { AdminNavbar } from '@/components/AdminNavbar';
import AccessBadge from '@/components/ui/AccessBadge';
import { Badge } from '@/components/ui/badge';
import { ImageUploader } from '@/components/ImageUploader';
import { imageUploadService } from '@/services/imageUploadService';

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

type ResourceType = {
  id: number;
  name: string;
};

type Tute = {
  id: number;
  title: string;
  description: string;
  download_url: string;
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
  tuteTypeId?: number;
  tute_type_id?: number;
  tuteTypeName?: string;
  tute_type_name?: string;
  tuteType?: ResourceType | string;
  cover_image_url?: string | null;
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

const AdminRecordingsManagement = () => {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [tutes, setTutes] = useState<Tute[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTuteDialogOpen, setIsTuteDialogOpen] = useState(false);
  const [editingRecording, setEditingRecording] = useState<Recording | null>(null);
  const [editingTute, setEditingTute] = useState<Tute | null>(null);
  const [activeTab, setActiveTab] = useState('recordings');

  // Recording form state
  const [newRecording, setNewRecording] = useState<{
    title: string;
    description: string;
    youtube_url: string;
    access_type: 'FREE' | 'PAID';
    price: number;
    grades: { id: number; name: string; fee: number }[];
  }>({
    title: '',
    description: '',
    youtube_url: '',
    access_type: 'PAID',
    price: 0,
    grades: []
  });

  // Tute form state
  const [newTute, setNewTute] = useState<{
    title: string;
    description: string;
    download_url: string;
    price: number;
    access_type: 'FREE' | 'PAID';
    grades: { id: number; name: string; fee: number }[];
    tute_type_id: number;
    status: string;
  }>({
    title: '',
    description: '',
    download_url: '',
    price: 0,
    access_type: 'PAID',
    grades: [],
    tute_type_id: 0,
    status: 'ACTIVE'
  });

  // Filters for Recordings
  const [recSearch, setRecSearch] = useState('');
  const [recAccessFilter, setRecAccessFilter] = useState<string>('ALL');
  const [recGradeFilter, setRecGradeFilter] = useState<string>('ALL');
  const [recStatusFilter, setRecStatusFilter] = useState<string>('ALL');

  // Filters for Tutes
  const [tuteSearch, setTuteSearch] = useState('');
  const [tuteAccessFilter, setTuteAccessFilter] = useState<string>('ALL');
  const [tuteResourceTypeFilter, setTuteResourceTypeFilter] = useState<string>('ALL');
  const [tuteGradeFilter, setTuteGradeFilter] = useState<string>('ALL');
  const [tuteStatusFilter, setTuteStatusFilter] = useState<string>('ALL');

  const [isLoading, setIsLoading] = useState(false);
  const [recordingImage, setRecordingImage] = useState<File | null>(null);
  const [tuteImage, setTuteImage] = useState<File | null>(null);

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isAdminLoggedIn) {
      navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6");
      return;
    }

    fetchRecordings();
    fetchTutes();
    fetchGrades();
    fetchResourceTypes();
  }, [navigate]);

  const fetchResourceTypes = async () => {
    try {
      let response = await apiFetch('TutesUploading?action=getTuteTypes', { credentials: 'include' });
      if (!response.ok) {
        response = await apiFetch('TutesServlet?action=getTuteTypes', { credentials: 'include' });
      }
      if (!response.ok) {
        response = await apiFetch('TutesUploading?action=getTuteTypes', { credentials: 'include' });
      }
      if (response.ok) {
        const data = await response.json();
        let list: ResourceType[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && data.success && Array.isArray(data.resourceTypes)) {
          list = data.resourceTypes;
        } else if (data && data.success && Array.isArray(data.data)) {
          list = data.data;
        } else if (data && Array.isArray(data.tuteTypes)) {
          list = data.tuteTypes;
        }
        setResourceTypes(list);
      }
    } catch (error) {
      console.error('Error fetching resource types:', error);
    }
  };

  const getResourceTypeName = (tute: Tute): string => {
    if (typeof tute.tuteType === 'object' && tute.tuteType?.name) {
      return tute.tuteType.name;
    }
    if (typeof tute.tuteType === 'string' && tute.tuteType) {
      return tute.tuteType;
    }
    if (tute.tuteTypeName || tute.tute_type_name) {
      return tute.tuteTypeName || tute.tute_type_name || '';
    }
    const typeId = tute.tuteTypeId || tute.tute_type_id;
    if (typeId) {
      const found = resourceTypes.find(rt => rt.id === Number(typeId));
      if (found) return found.name;
    }
    return 'Tute';
  };

  const fetchRecordings = async (accessTypeFilter?: string) => {
    setIsLoading(true);
    try {
      const selectedAccess = accessTypeFilter !== undefined ? accessTypeFilter : recAccessFilter;
      let endpoint = 'ClassRecordings?action=getAll';
      if (selectedAccess && selectedAccess !== 'ALL') {
        endpoint += `&accessType=${encodeURIComponent(selectedAccess)}`;
      }

      const response = await apiFetch(endpoint, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result: ApiResponse = await response.json();
        
        if (result.success) {
          if (result.data && Array.isArray(result.data)) {
            setRecordings(result.data);
          } else if (Array.isArray(result)) {
            setRecordings(result);
          } else {
            toast.error('Invalid response format from server');
            setRecordings([]);
          }
        } else {
          toast.error(result.message || 'Failed to load recordings');
          setRecordings([]);
        }
      } else {
        toast.error('Failed to load recordings');
        setRecordings([]);
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
      setRecordings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTutes = async (accessTypeFilter?: string, resourceTypeFilter?: string) => {
    setIsLoading(true);
    try {
      const selectedAccess = accessTypeFilter !== undefined ? accessTypeFilter : tuteAccessFilter;
      const selectedResourceType = resourceTypeFilter !== undefined ? resourceTypeFilter : tuteResourceTypeFilter;
      let endpoint = 'TutesUploading?action=getAll';
      const params: string[] = [];
      if (selectedAccess && selectedAccess !== 'ALL') {
        params.push(`accessType=${encodeURIComponent(selectedAccess)}`);
      }
      if (selectedResourceType && selectedResourceType !== 'ALL') {
        params.push(`tuteTypeId=${encodeURIComponent(selectedResourceType)}`);
      }
      if (params.length > 0) {
        endpoint += '&' + params.join('&');
      }

      const response = await apiFetch(endpoint, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result: ApiResponse = await response.json();
        
        if (result.success) {
          if (result.data && Array.isArray(result.data)) {
            setTutes(result.data);
          } else if (Array.isArray(result)) {
            setTutes(result);
          } else {
            toast.error('Invalid response format from server');
            setTutes([]);
          }
        } else {
          toast.error(result.message || 'Failed to load tutes');
          setTutes([]);
        }
      } else {
        toast.error('Failed to load tutes');
        setTutes([]);
      }
    } catch (error) {
      console.error('Error fetching tutes:', error);
      toast.error('Failed to load tutes');
      setTutes([]);
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

  const handleAddRecording = () => {
    setRecordingImage(null);
    setEditingRecording(null);
    setNewRecording({
      title: '',
      description: '',
      youtube_url: '',
      access_type: 'PAID',
      price: 0,
      grades: []
    });
    setIsDialogOpen(true);
  };

  const handleAddTute = () => {
    setTuteImage(null);
    setEditingTute(null);
    setNewTute({
      title: '',
      description: '',
      download_url: '',
      price: 0,
      access_type: 'PAID',
      grades: [],
      tute_type_id: resourceTypes[0]?.id || 1,
      status: 'ACTIVE'
    });
    setIsTuteDialogOpen(true);
  };

  const handleEditRecording = (recording: Recording) => {
    setRecordingImage(null);
    setEditingRecording(recording);
    const accessType = getItemAccessType(recording);
    setNewRecording({
      title: recording.title || '',
      description: recording.description || '',
      youtube_url: recording.youtube_url || '',
      access_type: accessType,
      price: accessType === 'FREE' ? 0 : (recording.price || 0),
      grades: recording.grades && recording.grades.length > 0 ? recording.grades : (recording.grade ? [recording.grade] : [])
    });
    setIsDialogOpen(true);
  };

  const handleEditTute = (tute: Tute) => {
    setTuteImage(null);
    setEditingTute(tute);
    const accessType = getItemAccessType(tute);
    const typeId = tute.tuteTypeId || tute.tute_type_id || (typeof tute.tuteType === 'object' ? tute.tuteType?.id : 0) || resourceTypes[0]?.id || 1;
    setNewTute({
      title: tute.title || '',
      description: tute.description || '',
      download_url: tute.download_url || '',
      price: accessType === 'FREE' ? 0 : (tute.price || 0),
      access_type: accessType,
      grades: tute.grades && tute.grades.length > 0 ? tute.grades : (tute.grade ? [tute.grade] : []),
      tute_type_id: Number(typeId),
      status: tute.status || 'ACTIVE'
    });
    setIsTuteDialogOpen(true);
  };

  const handleDeleteRecording = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this recording?')) {
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('id', id.toString());

      const response = await apiFetch('ClassRecordings?action=delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include'
      });

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        toast.success('Recording deleted successfully');
        fetchRecordings();
      } else {
        toast.error(result.message || 'Failed to delete recording');
      }
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
    }
  };

  const handleDeleteTute = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this tute?')) {
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('id', id.toString());

      const response = await apiFetch('TutesUploading?action=delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include'
      });

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        toast.success('Tute deleted successfully');
        fetchTutes();
      } else {
        toast.error(result.message || 'Failed to delete tute');
      }
    } catch (error) {
      console.error('Error deleting tute:', error);
      toast.error('Failed to delete tute');
    }
  };

  const handleRecordingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setNewRecording(prev => ({
        ...prev,
        price: value === '' ? 0 : parseFloat(value) || 0
      }));
    } else {
      setNewRecording(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTuteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setNewTute(prev => ({
        ...prev,
        price: value === '' ? 0 : parseFloat(value) || 0
      }));
    } else {
      setNewTute(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRecordingSelectChange = (name: string, value: string) => {
    if (name === 'grade_ids') {
      const gradeIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      const selectedGrades = grades.filter(g => gradeIds.includes(g.id));
      setNewRecording(prev => ({
        ...prev,
        grades: selectedGrades
      }));
    } else if (name === 'access_type') {
      const accessType = value as 'FREE' | 'PAID';
      setNewRecording(prev => ({
        ...prev,
        access_type: accessType,
        price: accessType === 'FREE' ? 0 : prev.price
      }));
    }
  };

  const handleTuteSelectChange = (name: string, value: string) => {
    if (name === 'grade_ids') {
      const gradeIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      const selectedGrades = grades.filter(g => gradeIds.includes(g.id));
      setNewTute(prev => ({
        ...prev,
        grades: selectedGrades
      }));
    } else if (name === 'access_type') {
      const accessType = value as 'FREE' | 'PAID';
      setNewTute(prev => ({
        ...prev,
        access_type: accessType,
        price: accessType === 'FREE' ? 0 : prev.price
      }));
    } else if (name === 'tute_type_id') {
      setNewTute(prev => ({
        ...prev,
        tute_type_id: parseInt(value) || 0
      }));
    } else if (name === 'status') {
      setNewTute(prev => ({
        ...prev,
        status: value
      }));
    }
  };

  const handleSaveRecording = async () => {
    if (!newRecording.title || !newRecording.youtube_url || newRecording.grades.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newRecording.access_type === 'PAID' && (newRecording.price === undefined || newRecording.price < 0)) {
      toast.error('Please enter a valid price for PAID access');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('title', newRecording.title);
      formData.append('description', newRecording.description);
      formData.append('youtube_url', newRecording.youtube_url);
      formData.append('grade_ids', newRecording.grades.map(g => g.id).join(','));
      formData.append('access_type', newRecording.access_type);
      formData.append('accessType', newRecording.access_type);
      formData.append('price', (newRecording.access_type === 'FREE' ? 0 : newRecording.price).toString());

      const url = editingRecording
        ? `ClassRecordings?action=update&id=${editingRecording.id}`
        : 'ClassRecordings?action=save';

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
        const recordingId = editingRecording?.id || result.data?.id || (result as any).id;
        if (recordingImage && recordingId) await imageUploadService.uploadRecordingThumbnail(Number(recordingId), recordingImage);
        if (recordingImage && !recordingId) toast.warning('Recording saved. Reopen it to upload the thumbnail because the server did not return its ID.');
        toast.success(editingRecording ? 'Recording updated successfully' : 'New recording added successfully');
        fetchRecordings();
        setIsDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to save recording');
      }
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTute = async () => {
    if (!newTute.title || !newTute.download_url || newTute.grades.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newTute.access_type === 'PAID' && (newTute.price === undefined || newTute.price <= 0)) {
      toast.error('Price is required for PAID tutes');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('title', newTute.title);
      formData.append('description', newTute.description);
      formData.append('download_url', newTute.download_url);
      formData.append('access_type', newTute.access_type);
      formData.append('accessType', newTute.access_type);
      formData.append('price', (newTute.access_type === 'FREE' ? 0 : newTute.price).toString());
      formData.append('grade_ids', newTute.grades.map(g => g.id).join(','));
      formData.append('tute_type_id', (newTute.tute_type_id || 1).toString());
      formData.append('tuteTypeId', (newTute.tute_type_id || 1).toString());
      formData.append('status', newTute.status || 'ACTIVE');

      const url = editingTute
        ? `TutesUploading?action=update&id=${editingTute.id}`
        : 'TutesUploading?action=save';

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
        const tuteId = editingTute?.id || result.data?.id || (result as any).id;
        if (tuteImage && tuteId) await imageUploadService.uploadTuteCover(Number(tuteId), tuteImage);
        if (tuteImage && !tuteId) toast.warning('Tute saved. Reopen it to upload the cover because the server did not return its ID.');
        toast.success(editingTute ? 'Tute updated successfully' : 'New tute added successfully');
        fetchTutes();
        setIsTuteDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to save tute');
      }
    } catch (error) {
      console.error('Error saving tute:', error);
      toast.error('Failed to save tute');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered recordings
  const filteredRecordings = useMemo(() => {
    return recordings.filter(rec => {
      // Access Type Filter
      if (recAccessFilter !== 'ALL') {
        const itemAccess = getItemAccessType(rec);
        if (itemAccess !== recAccessFilter) return false;
      }
      // Grade Filter
      if (recGradeFilter !== 'ALL') {
        if (rec.grade?.id?.toString() !== recGradeFilter) return false;
      }
      // Status Filter
      if (recStatusFilter !== 'ALL') {
        if (rec.status && rec.status.toUpperCase() !== recStatusFilter.toUpperCase()) return false;
      }
      // Search Query
      if (recSearch.trim() !== '') {
        const query = recSearch.toLowerCase();
        const matchesTitle = rec.title?.toLowerCase().includes(query);
        const matchesDesc = rec.description?.toLowerCase().includes(query);
        const matchesGrade = rec.grade?.name?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesGrade) return false;
      }
      return true;
    });
  }, [recordings, recAccessFilter, recGradeFilter, recStatusFilter, recSearch]);

  // Filtered tutes
  const filteredTutes = useMemo(() => {
    return tutes.filter(tute => {
      // Access Type Filter
      if (tuteAccessFilter !== 'ALL') {
        const itemAccess = getItemAccessType(tute);
        if (itemAccess !== tuteAccessFilter) return false;
      }
      // Resource Type Filter
      if (tuteResourceTypeFilter !== 'ALL') {
        const typeId = tute.tuteTypeId || tute.tute_type_id || (typeof tute.tuteType === 'object' ? tute.tuteType?.id : undefined);
        if (typeId?.toString() !== tuteResourceTypeFilter) return false;
      }
      // Grade Filter
      if (tuteGradeFilter !== 'ALL') {
        if (tute.grade?.id?.toString() !== tuteGradeFilter) return false;
      }
      // Status Filter
      if (tuteStatusFilter !== 'ALL') {
        if (tute.status && tute.status.toUpperCase() !== tuteStatusFilter.toUpperCase()) return false;
      }
      // Search Query
      if (tuteSearch.trim() !== '') {
        const query = tuteSearch.toLowerCase();
        const matchesTitle = tute.title?.toLowerCase().includes(query);
        const matchesDesc = tute.description?.toLowerCase().includes(query);
        const matchesGrade = tute.grade?.name?.toLowerCase().includes(query);
        const matchesType = getResourceTypeName(tute).toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesGrade && !matchesType) return false;
      }
      return true;
    });
  }, [tutes, tuteAccessFilter, tuteResourceTypeFilter, tuteGradeFilter, tuteStatusFilter, tuteSearch, resourceTypes]);

  return (
    <div className="min-h-screen bg-portal-background">
      <AdminNavbar />
      <div className="p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-portal-blue">Learning Materials Management</h1>
              <p className="text-sm text-slate-500 mt-1">Manage class recordings and downloadable study tutes (Free & Paid)</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard")}>
              Back to Dashboard
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="recordings" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Class Recordings
              </TabsTrigger>
              <TabsTrigger value="tutes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tutes
              </TabsTrigger>
            </TabsList>

            {/* RECORDINGS TAB */}
            <TabsContent value="recordings">
              <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-portal-blue" />
                    <span>Class Recordings ({filteredRecordings.length})</span>
                  </CardTitle>
                  <Button onClick={handleAddRecording} disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recording
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters & Search */}
                  <div className="grid gap-3 md:grid-cols-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search recordings..."
                        value={recSearch}
                        onChange={(e) => setRecSearch(e.target.value)}
                        className="pl-9 bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                      <Select
                        value={recAccessFilter}
                        onValueChange={(val) => {
                          setRecAccessFilter(val);
                          fetchRecordings(val);
                        }}
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
                        value={recGradeFilter}
                        onValueChange={setRecGradeFilter}
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
                    <div>
                      <Select
                        value={recStatusFilter}
                        onValueChange={setRecStatusFilter}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Statuses</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Recordings Table */}
                  {isLoading ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>Loading recordings...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Access Type</TableHead>
                          <TableHead>YouTube URL</TableHead>
                          <TableHead>Date Added</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecordings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Video className="h-12 w-12 mb-4 opacity-50" />
                                <p className="font-semibold">No recordings found</p>
                                <p className="text-sm mt-1">Try clearing filters or click "Add Recording" to create one.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRecordings.map((recording) => (
                            <TableRow key={recording.id}>
                              <TableCell className="font-medium">{recording.title}</TableCell>
                              <TableCell>Grade {recording.grade?.name || 'N/A'}</TableCell>
                              <TableCell>
                                <AccessBadge accessType={getItemAccessType(recording)} />
                              </TableCell>
                              <TableCell>
                                <a 
                                  href={`${recording.youtube_url}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm truncate max-w-[200px] inline-block"
                                >
                                  {recording.youtube_url}
                                </a>
                              </TableCell>
                              <TableCell>
                                {recording.created_at ? new Date(recording.created_at).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditRecording(recording)}
                                    disabled={isLoading}
                                  >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteRecording(recording.id)}
                                    disabled={isLoading}
                                  >
                                    <Trash className="h-4 w-4 mr-1" />
                                    Delete
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
                  <p className="text-sm text-muted-foreground">Showing {filteredRecordings.length} of {recordings.length} recording{recordings.length !== 1 ? 's' : ''}</p>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* TUTES TAB */}
            <TabsContent value="tutes">
              <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-portal-blue" />
                    <span>Tutes ({filteredTutes.length})</span>
                  </CardTitle>
                  <Button onClick={handleAddTute} disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tute
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters & Search */}
                  <div className="grid gap-3 md:grid-cols-5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search tutes & resources..."
                        value={tuteSearch}
                        onChange={(e) => setTuteSearch(e.target.value)}
                        className="pl-9 bg-white text-xs sm:text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                      <Select
                        value={tuteAccessFilter}
                        onValueChange={(val) => {
                          setTuteAccessFilter(val);
                          fetchTutes(val, tuteResourceTypeFilter);
                        }}
                      >
                        <SelectTrigger className="bg-white text-xs sm:text-sm">
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
                        value={tuteResourceTypeFilter}
                        onValueChange={(val) => {
                          setTuteResourceTypeFilter(val);
                          fetchTutes(tuteAccessFilter, val);
                        }}
                      >
                        <SelectTrigger className="bg-white text-xs sm:text-sm">
                          <SelectValue placeholder="Resource Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Resource Types</SelectItem>
                          {resourceTypes.map(rt => (
                            <SelectItem key={rt.id} value={rt.id.toString()}>
                              {rt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select
                        value={tuteGradeFilter}
                        onValueChange={setTuteGradeFilter}
                      >
                        <SelectTrigger className="bg-white text-xs sm:text-sm">
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
                    <div>
                      <Select
                        value={tuteStatusFilter}
                        onValueChange={setTuteStatusFilter}
                      >
                        <SelectTrigger className="bg-white text-xs sm:text-sm">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Statuses</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tutes Table */}
                  {isLoading ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>Loading tutes...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Resource Type</TableHead>
                          <TableHead>Access Type</TableHead>
                          <TableHead>Price (LKR)</TableHead>
                          <TableHead>Download Link</TableHead>
                          <TableHead>Date Added</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTutes.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <FileText className="h-12 w-12 mb-4 opacity-50" />
                                <p className="font-semibold">No materials found</p>
                                <p className="text-sm mt-1">Try clearing filters or click "Add Tute" to create one.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTutes.map((tute) => (
                            <TableRow key={tute.id}>
                              <TableCell className="font-medium">{tute.title}</TableCell>
                              <TableCell>
                                {tute.grades && tute.grades.length > 0
                                  ? tute.grades.map((g: any) => g.name).join(', ')
                                  : tute.grade?.name || 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-[#0f5f8f]/10 text-[#0f5f8f] border-[#0f5f8f]/20 font-medium">
                                  {getResourceTypeName(tute)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <AccessBadge accessType={getItemAccessType(tute)} />
                              </TableCell>
                              <TableCell>
                                {getItemAccessType(tute) === 'FREE' ? (
                                  <span className="text-emerald-600 font-semibold">Free</span>
                                ) : (
                                  `LKR ${tute.price?.toFixed(2) || '0.00'}`
                                )}
                              </TableCell>
                              <TableCell>
                                <a 
                                  href={`${tute.download_url}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                >
                                  <Download className="h-4 w-4" />
                                  Download
                                </a>
                              </TableCell>
                              <TableCell>
                                {tute.created_at ? new Date(tute.created_at).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditTute(tute)}
                                    disabled={isLoading}
                                  >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteTute(tute.id)}
                                    disabled={isLoading}
                                  >
                                    <Trash className="h-4 w-4 mr-1" />
                                    Delete
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
                  <p className="text-sm text-muted-foreground">Showing {filteredTutes.length} of {tutes.length} item{tutes.length !== 1 ? 's' : ''}</p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recording Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingRecording ? 'Edit Recording' : 'Add New Recording'}</DialogTitle>
                <DialogDescription>
                  {editingRecording
                    ? 'Make changes to the recording details below.'
                    : 'Add the details for the new recording.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right font-medium">
                    Title*
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newRecording.title}
                    onChange={handleRecordingInputChange}
                    className="col-span-3"
                    placeholder="Enter recording title"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4"><Label className="text-right font-medium">Thumbnail</Label><div className="col-span-3"><ImageUploader currentImage={editingRecording?.thumbnail_url} uploading={isLoading} onFilesChange={files => setRecordingImage(files[0] || null)} onRemove={editingRecording?.thumbnail_url ? async () => { try { await imageUploadService.deleteRecordingThumbnail(editingRecording.id); toast.success('Thumbnail removed'); fetchRecordings(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Failed to remove thumbnail'); } } : undefined} /></div></div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="grade_ids" className="text-right font-medium mt-4">
                    Grades*
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="text-sm text-slate-500 mb-2">Select one or more grades:</div>
                    {grades.map((grade) => (
                      <div key={grade.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`rec-grade-${grade.id}`}
                          checked={newRecording.grades?.some(g => g.id === grade.id) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRecording(prev => ({
                                ...prev,
                                grades: [...prev.grades, grade]
                              }));
                            } else {
                              setNewRecording(prev => ({
                                ...prev,
                                grades: prev.grades.filter(g => g.id !== grade.id)
                              }));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#0f5f8f] focus:ring-[#0f5f8f]"
                        />
                        <label
                          htmlFor={`rec-grade-${grade.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {grade.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* ACCESS TYPE DROPDOWN FOR RECORDING */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rec_access_type" className="text-right font-medium">
                    Access Type*
                  </Label>
                  <Select 
                    value={newRecording.access_type} 
                    onValueChange={(value) => handleRecordingSelectChange('access_type', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="PAID">PAID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* PRICE FIELD FOR RECORDING (Hidden/Disabled when FREE) */}
                {newRecording.access_type === 'PAID' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rec-price" className="text-right font-medium">
                      Price (LKR)*
                    </Label>
                    <Input
                      id="rec-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={newRecording.price}
                      onChange={handleRecordingInputChange}
                      className="col-span-3"
                    />
                  </div>
                )}
                {newRecording.access_type === 'FREE' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rec-price-disabled" className="text-right font-medium text-slate-400">
                      Price (LKR)
                    </Label>
                    <Input
                      id="rec-price-disabled"
                      type="number"
                      value={0}
                      disabled
                      className="col-span-3 bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="youtube_url" className="text-right font-medium">
                    YouTube URL*
                  </Label>
                  <Input
                    id="youtube_url"
                    name="youtube_url"
                    placeholder="https://youtu.be/..."
                    value={newRecording.youtube_url}
                    onChange={handleRecordingInputChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right font-medium mt-2">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <ReactQuill
                      theme="snow"
                      value={newRecording.description}
                      onChange={(value) => setNewRecording(prev => ({ ...prev, description: value }))}
                      placeholder="Enter recording description..."
                      className="h-32 mb-12"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSaveRecording} disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingRecording ? 'Update' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Tute Dialog */}
          <Dialog open={isTuteDialogOpen} onOpenChange={setIsTuteDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingTute ? 'Edit Material' : 'Add New Material'}</DialogTitle>
                <DialogDescription>
                  {editingTute
                    ? 'Make changes to the resource details below.'
                    : 'Add details for the new learning resource.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* 1. Grade */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="tute-grade_ids" className="text-right font-medium mt-4">
                    Grades*
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="text-sm text-slate-500 mb-2">Select one or more grades:</div>
                    {grades.map((grade) => (
                      <div key={grade.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`tute-grade-${grade.id}`}
                          checked={newTute.grades?.some(g => g.id === grade.id) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewTute(prev => ({
                                ...prev,
                                grades: [...prev.grades, grade]
                              }));
                            } else {
                              setNewTute(prev => ({
                                ...prev,
                                grades: prev.grades.filter(g => g.id !== grade.id)
                              }));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#0f5f8f] focus:ring-[#0f5f8f]"
                        />
                        <label
                          htmlFor={`tute-grade-${grade.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {grade.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Access Type */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tute_access_type" className="text-right font-medium">
                    Access Type*
                  </Label>
                  <Select 
                    value={newTute.access_type} 
                    onValueChange={(value) => handleTuteSelectChange('access_type', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="PAID">PAID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Resource Type */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tute_type_id" className="text-right font-medium">
                    Resource Type*
                  </Label>
                  <Select 
                    value={newTute.tute_type_id?.toString() || ''} 
                    onValueChange={(value) => handleTuteSelectChange('tute_type_id', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Title */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tute-title" className="text-right font-medium">
                    Title*
                  </Label>
                  <Input
                    id="tute-title"
                    name="title"
                    value={newTute.title}
                    onChange={handleTuteInputChange}
                    className="col-span-3"
                    placeholder="Enter resource title"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4"><Label className="text-right font-medium">Cover Image</Label><div className="col-span-3"><ImageUploader currentImage={editingTute?.cover_image_url} uploading={isLoading} onFilesChange={files => setTuteImage(files[0] || null)} onRemove={editingTute?.cover_image_url ? async () => { try { await imageUploadService.deleteTuteCover(editingTute.id); toast.success('Cover image removed'); fetchTutes(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Failed to remove cover image'); } } : undefined} /></div></div>

                {/* 5. Description */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="tute-description" className="text-right font-medium mt-2">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <ReactQuill
                      theme="snow"
                      value={newTute.description}
                      onChange={(value) => setNewTute(prev => ({ ...prev, description: value }))}
                      placeholder="Enter description..."
                      className="h-32 mb-12"
                    />
                  </div>
                </div>

                {/* 6. Price */}
                {newTute.access_type === 'PAID' ? (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tute-price" className="text-right font-medium">
                      Price (LKR)*
                    </Label>
                    <Input
                      id="tute-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={newTute.price}
                      onChange={handleTuteInputChange}
                      className="col-span-3"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tute-price-disabled" className="text-right font-medium text-slate-400">
                      Price (LKR)
                    </Label>
                    <div className="col-span-3 flex items-center h-10 px-3 border rounded-md bg-slate-100 text-slate-600 font-semibold text-sm">
                      Free (0.00)
                    </div>
                  </div>
                )}

                {/* 7. File Upload / Download Link */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="download_url" className="text-right font-medium">
                    Download Link*
                  </Label>
                  <Input
                    id="download_url"
                    name="download_url"
                    placeholder="https://example.com/file.pdf"
                    value={newTute.download_url}
                    onChange={handleTuteInputChange}
                    className="col-span-3"
                  />
                </div>

                {/* 8. Status */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tute_status" className="text-right font-medium">
                    Status*
                  </Label>
                  <Select 
                    value={newTute.status} 
                    onValueChange={(value) => handleTuteSelectChange('status', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTuteDialogOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTute} disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingTute ? 'Update' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminRecordingsManagement;
