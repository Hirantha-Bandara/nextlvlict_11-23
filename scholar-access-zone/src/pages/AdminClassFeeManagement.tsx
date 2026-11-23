import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  ArrowLeft, DollarSign, Edit, GraduationCap, Loader2, Plus, RefreshCw,
  Search, ToggleLeft, ToggleRight, Trash2, PowerOff, BookOpen,
} from 'lucide-react';
import { apiFetch } from '@/lib/utils';
import { AdminNavbar } from '@/components/AdminNavbar';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LookupItem {
  id: number;
  name: string;
}

interface GradeClassFee {
  id: number;
  gradeId: number;
  gradeName: string;
  classTypeId: number;
  classTypeName: string;
  monthlyFee: number;
  registrationFee: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

interface FeeFormData {
  gradeId: string;
  classTypeId: string;
  monthlyFee: string;
  registrationFee: string;
  status: string;
}

interface Grade {
  id: number;
  name: string;
  isActive: number;
  olOrAlId?: number;
  olOrAlName?: string;
}

interface GradeFormData {
  name: string;
  isActive: string;
  olOrAlId: string;
}

interface OlOrAlType {
  id: number;
  name: string;
}

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const EMPTY_FEE_FORM: FeeFormData = {
  gradeId: '', classTypeId: '', monthlyFee: '', registrationFee: '', status: '1',
};

const EMPTY_GRADE_FORM: GradeFormData = { name: '', isActive: '1', olOrAlId: 'none' };

/** Single servlet for both fee and grade management actions */
const FEE_ENDPOINT = 'ClassFeeManagement';

const isActive = (fee: GradeClassFee) => fee.status === 1 || (fee.status as unknown) === true;
const isGradeActive = (grade: Grade) => grade.isActive === 1 || (grade.isActive as unknown) === true;

const money = (value: number) =>
  `Rs.${Number(value || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const dateTime = (value?: string) => (value ? new Date(value).toLocaleString('en-LK') : '—');

const responseList = <T,>(data: unknown, keys: string[]): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const objectData = data as Record<string, unknown>;
    for (const key of keys) if (Array.isArray(objectData[key])) return objectData[key] as T[];
  }
  return [];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AdminClassFeeManagement: React.FC = () => {
  const navigate = useNavigate();

  const [fees, setFees] = useState<GradeClassFee[]>([]);
  const [grades, setGrades] = useState<LookupItem[]>([]);
  const [classTypes, setClassTypes] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editingFee, setEditingFee] = useState<GradeClassFee | null>(null);
  const [targetFee, setTargetFee] = useState<GradeClassFee | null>(null);
  const [formData, setFormData] = useState<FeeFormData>(EMPTY_FEE_FORM);

  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [classTypeFilter, setClassTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [gradeList, setGradeList] = useState<Grade[]>([]);
  const [olOrAlTypes, setOlOrAlTypes] = useState<OlOrAlType[]>([]);
  const [gradeLoading, setGradeLoading] = useState(false);
  const [gradeSaving, setGradeSaving] = useState(false);
  const [gradeActionInProgress, setGradeActionInProgress] = useState<number | null>(null);

  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [gradeDeleteDialogOpen, setGradeDeleteDialogOpen] = useState(false);

  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [targetGrade, setTargetGrade] = useState<Grade | null>(null);
  const [gradeForm, setGradeForm] = useState<GradeFormData>(EMPTY_GRADE_FORM);
  const [gradeSearch, setGradeSearch] = useState('');

  const [activeTab, setActiveTab] = useState('fees');

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      navigate('/admin');
      return;
    }
    void fetchAll();
    void fetchGrades();
    void fetchOlOrAlTypes();
  }, [navigate]);

  // Fetch all fee-related data
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [feesResponse, gradesResponse, classTypesResponse] = await Promise.all([
        apiFetch(`${FEE_ENDPOINT}?action=getAll`, { credentials: 'include' }),
        apiFetch(`${FEE_ENDPOINT}?action=getGrades`, { credentials: 'include' }),
        apiFetch(`${FEE_ENDPOINT}?action=getClassTypes`, { credentials: 'include' }),
      ]);
      const [feesData, gradesData, classTypesData] = await Promise.all([
        feesResponse.json(), gradesResponse.json(), classTypesResponse.json(),
      ]);
      if (!feesResponse.ok) throw new Error((feesData as { message?: string }).message || 'Failed to load fee records');
      if (!gradesResponse.ok) throw new Error((gradesData as { message?: string }).message || 'Failed to load grades');
      if (!classTypesResponse.ok) throw new Error((classTypesData as { message?: string }).message || 'Failed to load class types');
      
      setFees(Array.isArray(feesData) ? feesData : responseList<GradeClassFee>(feesData, ['fees', 'gradeClassFees', 'data']));
      setGrades(Array.isArray(gradesData) ? gradesData : responseList<LookupItem>(gradesData, ['grades', 'data']));
      setClassTypes(Array.isArray(classTypesData) ? classTypesData : responseList<LookupItem>(classTypesData, ['classTypes', 'data']));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load class fee data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch grades specifically for the grade management tab
  const fetchGrades = async () => {
    setGradeLoading(true);
    try {
      const response = await apiFetch(`${FEE_ENDPOINT}?action=getGrades`, { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error((data as { message?: string }).message || 'Failed to load grades');
      setGradeList(Array.isArray(data) ? data : responseList<Grade>(data, ['grades', 'data']));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load grades');
    } finally {
      setGradeLoading(false);
    }
  };

  // Fetch OL/AL types for grade creation/editing
  const fetchOlOrAlTypes = async () => {
    try {
      const response = await apiFetch(`${FEE_ENDPOINT}?action=getOlOrAlTypes`, { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error((data as { message?: string }).message || 'Failed to load OL/AL types');
      const types = Array.isArray(data) ? data : responseList<OlOrAlType>(data, ['olOrAlTypes', 'data']);
      setOlOrAlTypes(types);
    } catch (error) {
      console.error('Failed to load OL/AL types:', error);
      setOlOrAlTypes([]);
    }
  };

  // Fee CRUD operations
  const openCreateDialog = () => { setEditingFee(null); setFormData(EMPTY_FEE_FORM); setDialogOpen(true); };
  const openEditDialog = (fee: GradeClassFee) => {
    setEditingFee(fee);
    setFormData({ 
      gradeId: String(fee.gradeId), 
      classTypeId: String(fee.classTypeId), 
      monthlyFee: String(fee.monthlyFee), 
      registrationFee: String(fee.registrationFee), 
      status: isActive(fee) ? '1' : '0' 
    });
    setDialogOpen(true);
  };
  const closeDialog = () => { 
    if (saving) return; 
    setDialogOpen(false); 
    setEditingFee(null); 
    setFormData(EMPTY_FEE_FORM); 
  };
  const updateForm = (field: keyof FeeFormData, value: string) => setFormData(current => ({ ...current, [field]: value }));

  // Grade CRUD operations
  const openCreateGradeDialog = () => { 
    setEditingGrade(null); 
    setGradeForm(EMPTY_GRADE_FORM); 
    setGradeDialogOpen(true); 
  };
  const openEditGradeDialog = (grade: Grade) => { 
    setEditingGrade(grade); 
    setGradeForm({ 
      name: grade.name, 
      isActive: isGradeActive(grade) ? '1' : '0',
      olOrAlId: grade.olOrAlId ? String(grade.olOrAlId) : 'none'
    }); 
    setGradeDialogOpen(true); 
  };
  const closeGradeDialog = () => { 
    if (gradeSaving) return; 
    setGradeDialogOpen(false); 
    setEditingGrade(null); 
    setGradeForm(EMPTY_GRADE_FORM); 
  };
  const updateGradeForm = (field: keyof GradeFormData, value: string) => setGradeForm(current => ({ ...current, [field]: value }));

  // Validation functions
  const matchingFeeExists = () => fees.some(fee => fee.id !== editingFee?.id && fee.gradeId === Number(formData.gradeId) && fee.classTypeId === Number(formData.classTypeId));

  const validateForm = () => {
    if (!formData.gradeId || !formData.classTypeId) { toast.error('Grade and class type are required'); return false; }
    if (!Number.isFinite(Number(formData.monthlyFee)) || Number(formData.monthlyFee) < 0 || !Number.isFinite(Number(formData.registrationFee)) || Number(formData.registrationFee) < 0) {
      toast.error('Monthly and registration fees must be zero or a positive value'); return false;
    }
    if (matchingFeeExists()) { toast.error('A fee configuration already exists for this grade and class type'); return false; }
    return true;
  };

  const validateGradeForm = () => { 
    if (!gradeForm.name.trim()) { toast.error('Grade name is required'); return false; } 
    return true; 
  };

  // Fee save/update handler
  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      const editing = Boolean(editingFee);
      const params = new URLSearchParams({
        action: editing ? 'update' : 'save',
        gradeId: formData.gradeId,
        classTypeId: formData.classTypeId,
        monthlyFee: Number(formData.monthlyFee).toFixed(2),
        registrationFee: Number(formData.registrationFee).toFixed(2),
        status: formData.status,
      });
      if (editing && editingFee) params.set('id', String(editingFee.id));
      
      const response = await apiFetch(FEE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || result.error || !result.success) {
        throw new Error(result.error || result.message || 'Unable to save fee');
      }
      toast.success(editing ? 'Fee updated successfully' : 'Fee created successfully');
      closeDialog();
      await fetchAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save fee');
    } finally {
      setSaving(false);
    }
  };

  // Grade save/update handler
  const handleGradeSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateGradeForm()) return;
    setGradeSaving(true);
    try {
      const editing = Boolean(editingGrade);
      const params = new URLSearchParams({
        action: editing ? 'updateGrade' : 'saveGrade',
        name: gradeForm.name.trim(),
        isActive: gradeForm.isActive,
      });
      // Only add ol_or_al_id if it's not 'none'
      if (gradeForm.olOrAlId && gradeForm.olOrAlId !== 'none') {
        params.set('ol_or_al_id', gradeForm.olOrAlId);
      }
      if (editing && editingGrade) params.set('id', String(editingGrade.id));
      
      const response = await apiFetch(FEE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || result.error || result.success === false)
        throw new Error(result.error || result.message || 'Unable to save grade');
      toast.success(editing ? 'Grade updated successfully' : 'Grade created successfully');
      closeGradeDialog();
      await fetchGrades();
      await fetchAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save grade');
    } finally { 
      setGradeSaving(false); 
    }
  };

  // Fee deactivate handler
  const handleDeactivate = async () => {
    if (!targetFee) return;
    setActionInProgress(targetFee.id);
    try {
      const params = new URLSearchParams({ action: 'deactivate', id: String(targetFee.id) });
      const response = await apiFetch(FEE_ENDPOINT, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
        body: params.toString(), 
        credentials: 'include' 
      });
      const result = await response.json();
      if (!response.ok || result.error || result.success === false) 
        throw new Error(result.error || result.message || 'Unable to deactivate fee');
      toast.success('Class fee deactivated successfully');
      await fetchAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to deactivate class fee');
    } finally { 
      setActionInProgress(null); 
      setDeactivateDialogOpen(false); 
      setTargetFee(null); 
    }
  };

  // Fee delete handler
  const handleDelete = async () => {
    if (!targetFee) return;
    setActionInProgress(targetFee.id);
    try {
      const params = new URLSearchParams({ action: 'delete', id: String(targetFee.id) });
      const response = await apiFetch(FEE_ENDPOINT, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
        body: params.toString(), 
        credentials: 'include' 
      });
      const result = await response.json();
      if (!response.ok || result.error || result.success === false) 
        throw new Error(result.error || result.message || 'Unable to delete fee');
      toast.success('Class fee deleted successfully');
      await fetchAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete class fee');
    } finally { 
      setActionInProgress(null); 
      setDeleteDialogOpen(false); 
      setTargetFee(null); 
    }
  };

  // Grade delete handler
  const handleGradeDelete = async () => {
    if (!targetGrade) return;
    setGradeActionInProgress(targetGrade.id);
    try {
      const params = new URLSearchParams({ action: 'deleteGrade', id: String(targetGrade.id) });
      const response = await apiFetch(FEE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || result.error || result.success === false) {
        if (result.error && result.error.includes('fee configuration')) {
          throw new Error(result.error);
        }
        throw new Error(result.error || result.message || 'Unable to delete grade');
      }
      toast.success('Grade deleted successfully');
      setGradeDeleteDialogOpen(false);
      setTargetGrade(null);
      await fetchGrades();
      await fetchAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete grade');
    } finally { 
      setGradeActionInProgress(null); 
    }
  };

  // Filter functions
  const filteredFees = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return fees.filter(fee =>
      (!term || fee.gradeName.toLocaleLowerCase().includes(term) || fee.classTypeName.toLocaleLowerCase().includes(term)) &&
      (gradeFilter === 'all' || fee.gradeId === Number(gradeFilter)) &&
      (classTypeFilter === 'all' || fee.classTypeId === Number(classTypeFilter)) &&
      (statusFilter === 'all' || isActive(fee) === (statusFilter === 'active')),
    );
  }, [fees, search, gradeFilter, classTypeFilter, statusFilter]);

  const filteredGrades = useMemo(() => {
    const term = gradeSearch.trim().toLocaleLowerCase();
    return gradeList.filter(g => !term || g.name.toLocaleLowerCase().includes(term));
  }, [gradeList, gradeSearch]);

  const activeCount = fees.filter(fee => isActive(fee)).length;
  const inactiveCount = fees.length - activeCount;
  const activeGradeCount = gradeList.filter(g => isGradeActive(g)).length;

  return (
    <div className="min-h-screen bg-portal-background">
      <AdminNavbar />
      <div className="p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />Back
              </Button>
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-portal-blue">
                  <GraduationCap className="h-6 w-6" />Class Fee Management
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">Manage grades and fee configurations</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { void fetchAll(); void fetchGrades(); }} disabled={loading || gradeLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading || gradeLoading ? 'animate-spin' : ''}`} />Refresh
              </Button>
              {activeTab === 'fees' ? (
                <Button onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" />Add Class Fee</Button>
              ) : (
                <Button onClick={openCreateGradeDialog}><Plus className="mr-2 h-4 w-4" />Add Grade</Button>
              )}
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2"><DollarSign className="h-5 w-5 text-blue-600" /></div>
                  <div><p className="text-sm text-muted-foreground">Fee Combinations</p><p className="text-2xl font-bold">{fees.length}</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2"><BookOpen className="h-5 w-5 text-purple-600" /></div>
                  <div><p className="text-sm text-muted-foreground">Total Grades</p><p className="text-2xl font-bold">{gradeList.length}</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2"><ToggleRight className="h-5 w-5 text-green-600" /></div>
                  <div><p className="text-sm text-muted-foreground">Active Fees</p><p className="text-2xl font-bold text-green-600">{activeCount}</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2"><ToggleLeft className="h-5 w-5 text-gray-500" /></div>
                  <div><p className="text-sm text-muted-foreground">Inactive Fees</p><p className="text-2xl font-bold text-gray-500">{inactiveCount}</p></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="fees" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />Class Fees
              </TabsTrigger>
              <TabsTrigger value="grades" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />Grades
              </TabsTrigger>
            </TabsList>

            {/* Fees Tab */}
            <TabsContent value="fees">
              <Card>
                <CardHeader><CardTitle>Class Fees ({filteredFees.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="mb-4 grid gap-3 md:grid-cols-4">
                    <div className="relative md:col-span-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search grade or class type" />
                    </div>
                    <Select value={gradeFilter} onValueChange={setGradeFilter}>
                      <SelectTrigger><SelectValue placeholder="All grades" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All grades</SelectItem>
                        {grades.map(g => <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={classTypeFilter} onValueChange={setClassTypeFilter}>
                      <SelectTrigger><SelectValue placeholder="All class types" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All class types</SelectItem>
                        {classTypes.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                  ) : filteredFees.length === 0 ? (
                    <div className="py-16 text-center">
                      <GraduationCap className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                      <p className="text-lg text-muted-foreground">No class fee combinations found</p>
                      <Button className="mt-4" onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" />Add Class Fee</Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Grade</TableHead>
                            <TableHead>Class Type</TableHead>
                            <TableHead>Monthly Fee</TableHead>
                            <TableHead>Registration Fee</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead>Updated Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredFees.map(fee => (
                            <TableRow key={fee.id}>
                              <TableCell className="font-medium">{fee.gradeName}</TableCell>
                              <TableCell>{fee.classTypeName}</TableCell>
                              <TableCell>{money(fee.monthlyFee)}</TableCell>
                              <TableCell>{money(fee.registrationFee)}</TableCell>
                              <TableCell>
                                <Badge className={isActive(fee) ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}>
                                  {isActive(fee) ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{dateTime(fee.createdAt)}</TableCell>
                              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{dateTime(fee.updatedAt)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => openEditDialog(fee)}>
                                    <Edit className="mr-1 h-4 w-4" />
                                  </Button>
                                  {isActive(fee) && (
                                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-600 hover:bg-amber-50" disabled={actionInProgress === fee.id} onClick={() => { setTargetFee(fee); setDeactivateDialogOpen(true); }}>
                                      <PowerOff className="mr-1 h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button variant="destructive" size="sm" disabled={actionInProgress === fee.id} onClick={() => { setTargetFee(fee); setDeleteDialogOpen(true); }}>
                                    <Trash2 className="mr-1 h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                {fees.length > 0 && (
                  <CardFooter className="border-t bg-slate-50">
                    <p className="text-sm text-muted-foreground">{activeCount} active · {inactiveCount} inactive · {fees.length} total</p>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            {/* Grades Tab */}
            <TabsContent value="grades">
              <Card>
                <CardHeader><CardTitle>Grades ({filteredGrades.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" value={gradeSearch} onChange={e => setGradeSearch(e.target.value)} placeholder="Search grades..." />
                    </div>
                  </div>
                  {gradeLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                  ) : filteredGrades.length === 0 ? (
                    <div className="py-16 text-center">
                      <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                      <p className="text-lg text-muted-foreground">No grades found</p>
                      <Button className="mt-4" onClick={openCreateGradeDialog}><Plus className="mr-2 h-4 w-4" />Add Grade</Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">#</TableHead>
                            <TableHead>Grade Name</TableHead>
                            {/* <TableHead>OL/AL</TableHead>
                            <TableHead>Status</TableHead> */}
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredGrades.map((grade, index) => (
                            <TableRow key={grade.id}>
                              <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                              <TableCell className="font-medium">{grade.name}</TableCell>
                              {/* <TableCell>{grade.olOrAlName || '-'}</TableCell>
                              <TableCell>
                                <Badge className={isGradeActive(grade) ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}>
                                  {isGradeActive(grade) ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell> */}
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => openEditGradeDialog(grade)}>
                                    <Edit className="mr-1 h-4 w-4" />
                                  </Button>
                                  <Button variant="destructive" size="sm" disabled={gradeActionInProgress === grade.id} onClick={() => { setTargetGrade(grade); setGradeDeleteDialogOpen(true); }}>
                                    {gradeActionInProgress === grade.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1 h-4 w-4" />}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                {gradeList.length > 0 && (
                  <CardFooter className="border-t bg-slate-50">
                    <p className="text-sm text-muted-foreground">{activeGradeCount} active · {gradeList.length - activeGradeCount} inactive · {gradeList.length} total</p>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fee: Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={open => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingFee ? <><Edit className="h-5 w-5" />Edit Class Fee</> : <><Plus className="h-5 w-5" />Add Class Fee</>}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Grade <span className="text-red-500">*</span></Label>
              <Select value={formData.gradeId} onValueChange={value => updateForm('gradeId', value)} disabled={Boolean(editingFee)}>
                <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                <SelectContent>
                  {grades.length > 0 ? (
                    grades.map(g => <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>)
                  ) : (
                    <SelectItem value="no-grades" disabled>No grades available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Class Type <span className="text-red-500">*</span></Label>
              <Select value={formData.classTypeId} onValueChange={value => updateForm('classTypeId', value)} disabled={Boolean(editingFee)}>
                <SelectTrigger><SelectValue placeholder="Select class type" /></SelectTrigger>
                <SelectContent>
                  {classTypes.length > 0 ? (
                    classTypes.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)
                  ) : (
                    <SelectItem value="no-class-types" disabled>No class types available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="monthly-fee">Monthly Fee (LKR) <span className="text-red-500">*</span></Label>
                <Input id="monthly-fee" type="number" min="0" step="0.01" value={formData.monthlyFee} onChange={e => updateForm('monthlyFee', e.target.value)} placeholder="5000.00" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="registration-fee">Registration Fee (LKR) <span className="text-red-500">*</span></Label>
                <Input id="registration-fee" type="number" min="0" step="0.01" value={formData.registrationFee} onChange={e => updateForm('registrationFee', e.target.value)} placeholder="2500.00" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={value => updateForm('status', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingFee ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Fee: Deactivate Dialog */}
      <Dialog open={deactivateDialogOpen} onOpenChange={open => { if (!open && !actionInProgress) { setDeactivateDialogOpen(false); setTargetFee(null); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <PowerOff className="h-5 w-5" />Deactivate Class Fee
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Deactivate the fee for <span className="font-semibold text-foreground">{targetFee?.gradeName} — {targetFee?.classTypeName}</span>? The record will remain in the system but will be marked as inactive.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={Boolean(actionInProgress)} onClick={() => { setDeactivateDialogOpen(false); setTargetFee(null); }}>Cancel</Button>
            <Button variant="outline" className="border-amber-400 text-amber-600 hover:bg-amber-50" disabled={Boolean(actionInProgress)} onClick={() => void handleDeactivate()}>
              {actionInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fee: Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={open => { if (!open && !actionInProgress) { setDeleteDialogOpen(false); setTargetFee(null); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />Delete Class Fee
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Permanently delete the fee for <span className="font-semibold text-foreground">{targetFee?.gradeName} — {targetFee?.classTypeName}</span>?
            <span className="mt-1 block font-medium text-red-500">This action cannot be undone.</span>
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={Boolean(actionInProgress)} onClick={() => { setDeleteDialogOpen(false); setTargetFee(null); }}>Cancel</Button>
            <Button variant="destructive" disabled={Boolean(actionInProgress)} onClick={() => void handleDelete()}>
              {actionInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grade: Create / Edit Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={open => !open && closeGradeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingGrade ? <><Edit className="h-5 w-5" />Edit Grade</> : <><Plus className="h-5 w-5" />Add New Grade</>}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGradeSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="grade-name">Grade Name <span className="text-red-500">*</span></Label>
              <Input id="grade-name" type="text" value={gradeForm.name} onChange={e => updateGradeForm('name', e.target.value)} placeholder="e.g. Grade 10" required disabled={gradeSaving} />
            </div>
            <div className="space-y-1.5">
              <Label>OL/AL Type</Label>
              <Select value={gradeForm.olOrAlId} onValueChange={value => updateGradeForm('olOrAlId', value)} disabled={gradeSaving}>
                <SelectTrigger><SelectValue placeholder="Select OL/AL type (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {olOrAlTypes && olOrAlTypes.length > 0 ? (
                    olOrAlTypes.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)
                  ) : (
                    <SelectItem value="no-types" disabled>No OL/AL types available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Associate this grade with OL or AL level</p>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={gradeForm.isActive} onValueChange={value => updateGradeForm('isActive', value)} disabled={gradeSaving}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeGradeDialog} disabled={gradeSaving}>Cancel</Button>
              <Button type="submit" disabled={gradeSaving}>
                {gradeSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingGrade ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Grade: Delete Dialog */}
      <Dialog open={gradeDeleteDialogOpen} onOpenChange={open => { if (!open && !gradeActionInProgress) { setGradeDeleteDialogOpen(false); setTargetGrade(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />Delete Grade
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Permanently delete grade <span className="font-semibold text-foreground">"{targetGrade?.name}"</span>?
            </p>
            <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
              <p className="text-sm text-amber-700">
                <span className="font-medium">Note:</span> This grade cannot be deleted if it has associated fee configurations. 
                You must delete all fee configurations for this grade first.
              </p>
            </div>
            <p className="text-sm font-medium text-red-500">This action cannot be undone.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={Boolean(gradeActionInProgress)} onClick={() => { setGradeDeleteDialogOpen(false); setTargetGrade(null); }}>Cancel</Button>
            <Button variant="destructive" disabled={Boolean(gradeActionInProgress)} onClick={() => void handleGradeDelete()}>
              {gradeActionInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClassFeeManagement;