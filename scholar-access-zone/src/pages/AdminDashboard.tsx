import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Video, Calendar, Plus, Edit, Trash2, DollarSign, Download, GraduationCap, ArrowUpRight, ClipboardCheck, BookOpen, Search, Filter, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/utils';
import { clearAdminSession } from '@/lib/auth';
import { Globe } from 'lucide-react';
import PortfolioManagement from './PortfolioManagement';
import { AdminNavbar } from '@/components/AdminNavbar';
import { getVerificationStatusStyles } from '@/lib/monthlyFee';

interface ClassItem {
  id: number;
  grade: string;
  grade_id?: number | string;
  classTypeId?: number;
  classTypeName?: string;
  class_type_id?: number | string;
  day: string;
  day_id?: number | string;
  start_time: string;
  end_time: string;
  zoomLink: string;
  description: string;
  status?: string;
}

// Define type for class fee payments
type ClassFeePayment = {
  id: number;
  transactionId: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  description: string;
  createdAt: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verificationDate?: string;
  verificationNotes?: string;
  monthYear?: string;
  grade?: string;
};

type TuteApprovalRequest = {
  requestId: number;
  studentId: string;
  studentName: string;
  tuteId: number;
  tuteTitle: string;
  price: number;
  requestDate: string;
  status: string;
  statusId: number;
};

const AdminDashboard = () => {
  const [tuteApprovalRequests, setTuteApprovalRequests] = useState<TuteApprovalRequest[]>([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [classFeePayments, setClassFeePayments] = useState<ClassFeePayment[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [showClassForm, setShowClassForm] = useState(false);
  const [days, setDays] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [classTypeFilter, setClassTypeFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('classScheduling');
  const [formData, setFormData] = useState({
    grade_id: '',
    class_type_id: '',
    day_id: '',
    start_time: '',
    end_time: '',
    zoomLink: '',
    description: ''
  });
  
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['classScheduling', 'paymentVerifications', 'tuteApprovals', 'portfolioManagement'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const selectTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams(tab === 'classScheduling' ? { tab } : {});
  };

  const fetchTuteApprovalRequests = async () => {
    try {
      const response = await apiFetch('TutesServlet?action=getTuteRequests', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTuteApprovalRequests(data.tuteRequests || []);
        }
      }
    } catch (error) {
      console.error('Error fetching tute requests:', error);
    }
  };

  const handleApproveTute = async (requestId: number) => {
    try {
      const response = await apiFetch(
        `TutesServlet?action=updateTuteRequestStatus&requestId=${requestId}&statusId=2`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Tute request approved');
          fetchTuteApprovalRequests();
        }
      }
    } catch (error) {
      console.error('Error approving tute:', error);
      toast.error('Failed to approve tute');
    }
  };

  const handleRejectTute = async (requestId: number) => {
    try {
      const response = await apiFetch(
        `TutesServlet?action=updateTuteRequestStatus&requestId=${requestId}&statusId=3`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Tute request rejected');
          fetchTuteApprovalRequests();
        }
      }
    } catch (error) {
      console.error('Error rejecting tute:', error);
      toast.error('Failed to reject tute');
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isAdminLoggedIn) {
      navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6");
      return;
    }


    // Fetch dropdown data and classes
    fetchDropdownData();
    fetchClasses();
    fetchClassFeePayments();
  }, [navigate]);

  // Add this function to fetch class fee payments
  const fetchClassFeePayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await apiFetch('PaymentVerificationServlet', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setClassFeePayments(data.payments || []);
        } else {
          toast.error(data.message || 'Failed to load payments');
        }
      } else {
        toast.error('Failed to load payment verifications');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payment verifications');
    } finally {
      setLoadingPayments(false);
    }
  };

  // Load class fee payments when payment tab opens
  useEffect(() => {
    if (activeTab === 'paymentVerifications') {
      fetchClassFeePayments();
    }
  }, [activeTab]);

  // Add useEffect to fetch tute requests
  useEffect(() => {
    if (activeTab === 'tuteApprovals') {
      fetchTuteApprovalRequests();
    }
  }, [activeTab]);

  const fetchDropdownData = async () => {
    try {
      const [daysResponse, gradesResponse, classTypesResponse] = await Promise.all([
        apiFetch('ClassScheduling?action=getDays', { credentials: 'include' }),
        apiFetch('ClassScheduling?action=getGrades', { credentials: 'include' }),
        apiFetch('ClassScheduling?action=getClassTypes', { credentials: 'include' })
          .catch(() => apiFetch('ClassFeeManagement?action=getClassTypes', { credentials: 'include' }))
      ]);
      
      if (daysResponse.ok && gradesResponse.ok) {
        const daysData = await daysResponse.json();
        const gradesData = await gradesResponse.json();
        
        setDays(daysData);
        const gradesList = Array.isArray(gradesData)
          ? gradesData
          : gradesData.grades || gradesData.data || [];
        setGrades(gradesList);
      } else {
        toast.error('Failed to load form data');
      }

      if (classTypesResponse && classTypesResponse.ok) {
        const classTypesData = await classTypesResponse.json();
        const list = Array.isArray(classTypesData)
          ? classTypesData
          : classTypesData.classTypes || classTypesData.data || [];
        setClassTypes(list);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      toast.error('Failed to load form data');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await apiFetch('ClassScheduling?action=getAll', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const classesData = await response.json();
        const classesList = Array.isArray(classesData)
          ? classesData
          : classesData.classes || classesData.data || [];
        setClasses(classesList);
      } else {
        toast.error('Failed to load classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6");
    toast.success("Admin logged out successfully");
  };

  // Class scheduling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.grade_id || !formData.class_type_id || !formData.day_id || !formData.start_time || !formData.end_time) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const endpoint = editingClass 
        ? `ClassScheduling?action=update&id=${editingClass.id}`
        : 'ClassScheduling?action=save';
      
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('grade_id', formData.grade_id);
      formDataToSend.append('gradeId', formData.grade_id);

      formDataToSend.append('class_type_id', formData.class_type_id);
      formDataToSend.append('classTypeId', formData.class_type_id);
      formDataToSend.append('class_type', formData.class_type_id);
      formDataToSend.append('classType', formData.class_type_id);

      formDataToSend.append('day_id', formData.day_id);
      formDataToSend.append('dayId', formData.day_id);
      formDataToSend.append('days_id', formData.day_id);
      formDataToSend.append('daysId', formData.day_id);

      formDataToSend.append('start_time', formData.start_time);
      formDataToSend.append('startTime', formData.start_time);

      formDataToSend.append('end_time', formData.end_time);
      formDataToSend.append('endTime', formData.end_time);

      formDataToSend.append('zoomLink', formData.zoomLink);
      formDataToSend.append('zoom_link', formData.zoomLink);

      formDataToSend.append('description', formData.description);

      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend.toString(),
        credentials: 'include'
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', responseText);
        toast.error('Server returned invalid response');
        return;
      }
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(editingClass ? "Class updated successfully" : "New class scheduled successfully");
        // Refresh the class list
        fetchClasses();
        cancelEdit();
      }
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Failed to save class');
    }
  };

  const handleEdit = (classItem: ClassItem) => {
    setEditingClass(classItem);
    
    // Find grade, day, and class type IDs from dropdown data
    const grade = grades.find(g => g.name === classItem.grade || g.id.toString() === String(classItem.grade_id));
    const day = days.find(d => d.name === classItem.day || d.id.toString() === String(classItem.day_id));
    const classType = classTypes.find(ct => ct.name === classItem.classTypeName || ct.id.toString() === String(classItem.class_type_id || classItem.classTypeId));

    setFormData({
      grade_id: grade ? grade.id.toString() : (classItem.grade_id ? classItem.grade_id.toString() : ''),
      class_type_id: classType ? classType.id.toString() : (classItem.class_type_id ? classItem.class_type_id.toString() : (classItem.classTypeId ? classItem.classTypeId.toString() : '')),
      day_id: day ? day.id.toString() : (classItem.day_id ? classItem.day_id.toString() : ''),
      start_time: classItem.start_time,
      end_time: classItem.end_time,
      zoomLink: classItem.zoomLink || '',
      description: classItem.description || ''
    });
    setShowClassForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('id', id.toString());

      const response = await apiFetch('ClassScheduling?action=delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend.toString(),
        credentials: 'include'
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', responseText);
        toast.error('Server returned invalid response');
        return;
      }
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Class deleted successfully");
        // Refresh the class list
        fetchClasses();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class');
    }
  };

  const cancelEdit = () => {
    setEditingClass(null);
    setFormData({
      grade_id: '',
      class_type_id: '',
      day_id: '',
      start_time: '',
      end_time: '',
      zoomLink: '',
      description: ''
    });
    setShowClassForm(false);
  };

  const getClassTypeBadge = (name?: string) => {
    if (!name) return null;
    const lower = name.toLowerCase();
    if (lower.includes('theory') && lower.includes('revision')) {
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">{name}</Badge>;
    } else if (lower.includes('revision')) {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">{name}</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{name}</Badge>;
    }
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(item => {
      const term = searchQuery.toLowerCase().trim();
      const gradeStr = (item.grade || '').toLowerCase();
      const classTypeStr = (item.classTypeName || '').toLowerCase();
      const dayStr = (item.day || '').toLowerCase();
      const descStr = (item.description || '').toLowerCase();
      const matchesSearch = !term || gradeStr.includes(term) || classTypeStr.includes(term) || dayStr.includes(term) || descStr.includes(term);

      const matchesGrade = gradeFilter === 'all' || item.grade === gradeFilter || String(item.grade_id) === gradeFilter;
      const matchesClassType = classTypeFilter === 'all' || item.classTypeName === classTypeFilter || String(item.classTypeId || item.class_type_id) === classTypeFilter;
      const matchesDay = dayFilter === 'all' || item.day === dayFilter || String(item.day_id) === dayFilter;
      const matchesStatus = statusFilter === 'all' || (item.status || 'Active').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesGrade && matchesClassType && matchesDay && matchesStatus;
    });
  }, [classes, searchQuery, gradeFilter, classTypeFilter, dayFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    const styles = getVerificationStatusStyles(status);
    return <Badge variant="outline" className={styles.badgeClassName}>{styles.label}</Badge>;
  };

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Student ID', 'Student Name', 'Amount', 'Currency', 'Payment Method', 'Date', 'Status', 'Month/Year'];
    const csvData = classFeePayments.map(p => [
      p.transactionId,
      p.studentId,
      p.studentName,
      p.amount,
      p.currency,
      p.paymentMethod,
      p.createdAt,
      p.verificationStatus,
      p.monthYear || 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-fee-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        <section className="mb-7 overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Control centre</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Admin dashboard</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Manage teaching operations, student access and published content from one focused workspace.</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">Logout</Button>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Calendar className="mb-2 h-5 w-5 text-cyan-300" /><p className="text-2xl font-semibold">{classes.length}</p><p className="text-xs text-slate-400">Scheduled classes</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><DollarSign className="mb-2 h-5 w-5 text-emerald-300" /><p className="text-2xl font-semibold">{classFeePayments.filter(p => p.verificationStatus === 'pending').length}</p><p className="text-xs text-slate-400">Payments awaiting review</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><BookOpen className="mb-2 h-5 w-5 text-violet-300" /><p className="text-2xl font-semibold">{tuteApprovalRequests.filter(r => r.statusId === 1).length}</p><p className="text-xs text-slate-400">Tute requests pending</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><ClipboardCheck className="mb-2 h-5 w-5 text-amber-300" /><p className="text-2xl font-semibold">{grades.length}</p><p className="text-xs text-slate-400">Active grade options</p></div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <button type="button" onClick={() => navigate('/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/students')} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><User className="mb-5 h-5 w-5 text-blue-600" /><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-900">Student Management</h2><ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" /></div><p className="mt-2 text-sm text-slate-500">Accounts, access and recording requests.</p></button>
          <button type="button" onClick={() => navigate('/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/recordings')} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><Video className="mb-5 h-5 w-5 text-blue-600" /><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-900">Recordings Management</h2><ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" /></div><p className="mt-2 text-sm text-slate-500">Recordings and downloadable tutes.</p></button>
          <button type="button" onClick={() => navigate('/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/bundles')} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><Package className="mb-5 h-5 w-5 text-blue-600" /><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-900">Bundle Management</h2><ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" /></div><p className="mt-2 text-sm text-slate-500">Create and manage recording bundles.</p></button>
          <button type="button" onClick={() => navigate('/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/payment-verifications')} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><DollarSign className="mb-5 h-5 w-5 text-blue-600" /><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-900">Payment Verifications</h2><ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" /></div><p className="mt-2 text-sm text-slate-500">Review and action payment records.</p></button>
        </section>

        <Tabs value={activeTab} onValueChange={selectTab} className="mb-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-semibold text-slate-900">Workspace</p><p className="text-sm text-slate-500">Schedule classes, manage approvals and update your portfolio.</p></div>
            {activeTab === 'classScheduling' && (
              <Button size="sm" onClick={() => setShowClassForm(true)} className="sm:ml-auto">
                <Plus className="mr-2 h-4 w-4" /> Schedule class
              </Button>
            )}
            {/* <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
            <TabsTrigger value="classScheduling">Class Scheduling</TabsTrigger>
            <TabsTrigger value="paymentVerifications">Class Fee Payments</TabsTrigger>
            <TabsTrigger value="tuteApprovals">Tute Approvals</TabsTrigger>
            <TabsTrigger value="portfolioManagement">Portfolio Management</TabsTrigger>
          </TabsList> */}
          </div>
        <TabsContent value="portfolioManagement">
          <PortfolioManagement />
        </TabsContent>

          {/* Class Scheduling Tab */}
          <TabsContent value="classScheduling">
            {/* Class Scheduling Form */}
            {showClassForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingClass ? 'Edit Class' : 'Schedule New Class'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grade_id">Grade *</Label>
                      <Select 
                        value={formData.grade_id} 
                        onValueChange={(value) => handleSelectChange('grade_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade.id} value={grade.id.toString()}>
                              Grade {grade.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="class_type_id">Class Type *</Label>
                      <Select 
                        value={formData.class_type_id} 
                        onValueChange={(value) => handleSelectChange('class_type_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class type" />
                        </SelectTrigger>
                        <SelectContent>
                          {classTypes.map((type) => {
                            const typeId = type.id ?? type.classTypeId ?? type.class_type_id;
                            const typeName = type.name ?? type.classTypeName ?? type.class_type_name;
                            return (
                              <SelectItem key={typeId} value={String(typeId)}>
                                {typeName}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="day_id">Day *</Label>
                      <Select 
                        value={formData.day_id} 
                        onValueChange={(value) => handleSelectChange('day_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day.id} value={day.id.toString()}>
                              {day.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="start_time">Start Time *</Label>
                      <Input
                        id="start_time"
                        name="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="end_time">End Time *</Label>
                      <Input
                        id="end_time"
                        name="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="zoomLink">Zoom Meeting Link</Label>
                      <Input
                        id="zoomLink"
                        name="zoomLink"
                        value={formData.zoomLink}
                        onChange={handleInputChange}
                        placeholder="https://zoom.us/j/your-meeting-id"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief description of the class..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="md:col-span-2 flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingClass ? 'Update Class' : 'Schedule Class'}
                      </Button>
                      <Button type="button" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Scheduled Classes */}
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle>Scheduled Classes ({filteredClasses.length} of {classes.length})</CardTitle>
                </div>

                {/* Filters & Search Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                  <div className="relative md:col-span-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search classes..."
                      className="pl-8 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <Select value={gradeFilter} onValueChange={setGradeFilter}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All Grades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Grades</SelectItem>
                        {grades.map(g => (
                          <SelectItem key={g.id} value={g.name || String(g.id)}>
                            Grade {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={classTypeFilter} onValueChange={setClassTypeFilter}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All Class Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Class Types</SelectItem>
                        {classTypes.map(ct => {
                          const ctId = ct.id ?? ct.classTypeId ?? ct.class_type_id;
                          const ctName = ct.name ?? ct.classTypeName ?? ct.class_type_name;
                          return (
                            <SelectItem key={ctId} value={ctName || String(ctId)}>
                              {ctName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={dayFilter} onValueChange={setDayFilter}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All Days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Days</SelectItem>
                        {days.map(d => (
                          <SelectItem key={d.id} value={d.name || String(d.id)}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClasses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8 col-span-full">
                      {classes.length === 0 ? 'No classes scheduled yet' : 'No classes match your search and filter criteria'}
                    </p>
                  ) : (
                    filteredClasses.map((classItem) => (
                      <Card key={classItem.id} className="border">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Grade {classItem.grade}</CardTitle>
                              {classItem.classTypeName && (
                                <div className="mt-1">
                                  {getClassTypeBadge(classItem.classTypeName)}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(classItem)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(classItem.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {classItem.classTypeName && (
                              <div><strong>Class Type:</strong> {classItem.classTypeName}</div>
                            )}
                            <div><strong>Day:</strong> {classItem.day}</div>
                            <div><strong>Time:</strong> {classItem.start_time} - {classItem.end_time}</div>
                            {classItem.zoomLink && (
                              <div>
                                <a 
                                  href={classItem.zoomLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  Join Zoom Meeting
                                </a>
                              </div>
                            )}
                            {classItem.description && (
                              <div><strong>Description:</strong> {classItem.description}</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Class Fee Payments Tab */}
          <TabsContent value="paymentVerifications">
            {/* Class Fee Payments Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>Class Fee Payments ({classFeePayments.length})</CardTitle>
                  <Button variant="outline" onClick={exportToCSV} disabled={loadingPayments || classFeePayments.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingPayments ? (
                  <div className="text-center py-8">Loading payments...</div>
                ) : classFeePayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No class fee payments found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Date</TableHead>
                          {/* <TableHead>Month/Year</TableHead> */}
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classFeePayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-mono text-sm">
                              {payment.transactionId}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{payment.studentName}</div>
                                <div className="text-sm text-muted-foreground">ID: {payment.studentId}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {payment.currency} {payment.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{payment.paymentMethod}</TableCell>
                            <TableCell>
                              {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString()}
                            </TableCell>
                            {/* <TableCell>{payment.monthYear || 'N/A'}</TableCell> */}
                            <TableCell>{getStatusBadge(payment.verificationStatus)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50">
                <div className="flex justify-between w-full">
                  <p className="text-sm text-muted-foreground">
                    Showing {classFeePayments.length} payment records
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loadingPayments}
                    onClick={fetchClassFeePayments}
                  >
                    Refresh
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tute Approvals Tab */}
          <TabsContent value="tuteApprovals">
            
    <Card>
        <CardHeader>
            <CardTitle>Tute Purchase Approvals ({tuteApprovalRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
            {tuteApprovalRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No tute approval requests found
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Tute Title</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tuteApprovalRequests.map((request) => (
                            <TableRow key={request.requestId}>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{request.studentName}</div>
                                        <div className="text-sm text-muted-foreground">ID: {request.studentId}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{request.tuteTitle}</TableCell>
                                <TableCell>LKR {request.price.toFixed(2)}</TableCell>
                                <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge className={
                                        request.statusId === 2 
                                            ? "bg-green-100 text-green-800"
                                            : request.statusId === 3
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }>
                                        {request.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {request.statusId === 1 && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApproveTute(request.requestId)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleRejectTute(request.requestId)}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
    </Card>
</TabsContent>
        </Tabs>
      </main>

    </div>
  );
};

export default AdminDashboard;
