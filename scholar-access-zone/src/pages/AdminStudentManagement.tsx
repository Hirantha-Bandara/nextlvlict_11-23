import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User, Search, X, Check, Eye, Filter, Loader2, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/utils';
import { AdminNavbar } from '@/components/AdminNavbar';
import StudentDetailsModal from '@/components/StudentDetailsModal';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  isActive: boolean;
  grade: string;
  gradeId: number;
  paymentStatus: string;
  totalRecordingRequests: number;
  approvedRecordingRequests: number;
  pendingRecordingRequests: number;
};

type RecordingRequest = {
  requestId: number;
  studentId: string;
  studentName: string;
  recordingId: number;
  recordingTitle: string;
  status: string;
  statusId: number;
  requestDate: string;
  grade: string;
};

type Grade = {
  id: number;
  name: string;
  isActive: number;
};

const AdminStudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [recordingRequests, setRecordingRequests] = useState<RecordingRequest[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isAdminLoggedIn) {
      navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6");
      return;
    }

    loadGrades();
    loadStudents();
    loadRecordingRequests();
  }, [navigate]);

  const loadGrades = async () => {
    try {
      const response = await apiFetch('ClassFeeManagement?action=getGrades', { credentials: 'include' });
      const data = await response.json();
      if (Array.isArray(data)) {
        setGrades(data);
      }
    } catch (error) {
      console.error('Error loading grades:', error);
      toast.error('Failed to load grades');
    }
  };

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (gradeFilter && gradeFilter !== "all") params.append('gradeFilter', gradeFilter);
      if (statusFilter && statusFilter !== "all") params.append('statusFilter', statusFilter);
      if (searchTerm) params.append('searchTerm', searchTerm);

      const response = await apiFetch(`StudentManagement?action=getAllStudents&${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecordingRequests = async () => {
    try {
      const params = new URLSearchParams();
      if (gradeFilter && gradeFilter !== "all") params.append('gradeFilter', gradeFilter);

      const response = await apiFetch(`StudentManagement?action=getRecordingRequests&${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRecordingRequests(data);
    } catch (error) {
      console.error('Error loading recording requests:', error);
      toast.error('Failed to load recording requests');
      setRecordingRequests([]);
    }
  };

  const handleChangeStatus = async (studentId: string, newStatus: boolean) => {
    try {
      setIsUpdating(true);
      const formData = new URLSearchParams();
      formData.append('studentId', studentId);
      formData.append('isActive', String(newStatus));

      const response = await apiFetch('StudentManagement?action=updateStudentStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Student status updated successfully`);
        loadStudents(); // Reload the data
      }
    } catch (error) {
      console.error('Error updating student status:', error);
      toast.error('Failed to update student status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateRecordingStatus = async (requestId: number, newStatusId: number) => {
    try {
      setIsUpdating(true);
      const formData = new URLSearchParams();
      formData.append('requestId', String(requestId));
      formData.append('newStatusId', String(newStatusId));

      const response = await apiFetch('StudentManagement?action=updateRecordingRequestStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Recording request status updated');
        loadRecordingRequests(); // Reload recording requests
        loadStudents(); // Reload students to update counts
      }
    } catch (error) {
      console.error('Error updating recording status:', error);
      toast.error('Failed to update recording status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApplyFilters = () => {
    loadStudents();
    loadRecordingRequests();
  };

  const handleClearFilters = () => {
    setGradeFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
    // Don't reload here, wait for user to click Apply Filters
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  const handleDownloadReport = async () => {
    try {
      const params = new URLSearchParams();
      if (gradeFilter && gradeFilter !== "all") params.append('gradeFilter', gradeFilter);
      if (statusFilter && statusFilter !== "all") params.append('statusFilter', statusFilter);
      if (searchTerm) params.append('searchTerm', searchTerm);

      const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      const url = `${baseUrl}StudentManagement?action=generateStudentReport&${params}`;

      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `students_report_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const handleViewStudentDetails = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsStudentModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
          <Button variant="outline" onClick={() => navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {/* Filter Section */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearch}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Grade</label>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade.id} value={String(grade.id)}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end space-x-2">
                <Button 
                  onClick={handleApplyFilters} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="students">
          <TabsList className="mb-4">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="recordings">Recording Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Students ({students.length})</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDownloadReport}
                      disabled={isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={loadStudents}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading students...</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No students found matching your criteria
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Mobile</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Recording Requests</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.id}</TableCell>
                            <TableCell>{student.firstName} {student.lastName}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.mobile || 'N/A'}</TableCell>
                            <TableCell>{student.grade}</TableCell>
                            <TableCell>
                              <Badge variant={student.isActive ? "default" : "secondary"}>
                                {student.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={student.paymentStatus === 'paid' ? "default" : "destructive"}>
                                {student.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col text-xs">
                                <span>Total: {student.totalRecordingRequests}</span>
                                <span className="text-green-600">Approved: {student.approvedRecordingRequests}</span>
                                <span className="text-orange-600">Pending: {student.pendingRecordingRequests}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant={student.isActive ? "destructive" : "default"}
                                  onClick={() => handleChangeStatus(student.id, !student.isActive)}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : student.isActive ? (
                                    <>Deactivate</>
                                  ) : (
                                    <>Activate</>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewStudentDetails(student.id)}
                                >
                                  <Eye className="h-4 w-4" />
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
            </Card>
          </TabsContent>

          <TabsContent value="recordings">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recording Requests ({recordingRequests.length})</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadRecordingRequests}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recordingRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No recording requests found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Recording</TableHead>
                          <TableHead>Request Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recordingRequests.map((request) => (
                          <TableRow key={request.requestId}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{request.studentName}</div>
                                <div className="text-sm text-muted-foreground">{request.studentId}</div>
                              </div>
                            </TableCell>
                            <TableCell>{request.grade}</TableCell>
                            <TableCell className="max-w-xs truncate">{request.recordingTitle}</TableCell>
                            <TableCell>{formatDate(request.requestDate)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                request.statusId === 2 ? "default" : 
                                request.statusId === 1 ? "secondary" : "destructive"
                              }>
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {request.statusId === 1 && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateRecordingStatus(request.requestId, 2)}
                                      disabled={isUpdating}
                                    >
                                      {isUpdating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        'Approve'
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleUpdateRecordingStatus(request.requestId, 3)}
                                      disabled={isUpdating}
                                    >
                                      {isUpdating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        'Reject'
                                      )}
                                    </Button>
                                  </>
                                )}
                                {request.statusId !== 1 && (
                                  <span className="text-sm text-gray-500">No actions available</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>

      <StudentDetailsModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        studentId={selectedStudentId}
      />
    </div>
  );
};

export default AdminStudentManagement;
