import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Mail, Phone, Calendar, MapPin, CreditCard, GraduationCap, Building, X, DollarSign, FileText, Video, CheckCircle, XCircle, Clock, Gift, Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/utils';
import { toast } from 'sonner';

interface PaymentTransaction {
  id: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  description: string;
  createdAt: string;
  verificationStatus: string;
  verifiedBy: string;
  verificationDate: string;
  verificationNotes: string;
}

 interface MonthlyFee {
  id: number;
  monthYear: string;
  feeAmount: number;
  grade: string;
  classType: string;
  status: string;
  dueDate: string;
  paidDate: string;
  transactionId: string;
  createdAt: string;
}

interface RecordingRequest {
  requestId: number;
  recordingId: number;
  recordingTitle: string;
  status: string;
  statusId: number;
  requestDate: string;
}

interface StudentDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  isActive: boolean;
  grade: string;
  gradeId: number;
  createdAt: string;
  dateOfBirth: string;
  school: string;
  nic: string;
  classType: string;
  classTypeId: number;
  freeCard: boolean;
  address?: {
    street: string;
    city: string;
    district: string;
    province: string;
  };
  paymentStatus: string;
  paymentTransactions: PaymentTransaction[];
  monthlyFees: MonthlyFee[];
  recordingRequests: RecordingRequest[];
}

interface ClassType {
  id: number;
  name: string;
}

interface StudentClassType {
  id: number;
  classTypeId: number;
  classTypeName: string;
}

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ isOpen, onClose, studentId }) => {
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [studentClassTypes, setStudentClassTypes] = useState<StudentClassType[]>([]);

  useEffect(() => {
    if (isOpen && studentId) {
      loadStudentDetails();
      loadStudentClassTypes();
    }
  }, [isOpen, studentId]);


  const loadStudentDetails = async () => {
    if (!studentId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await apiFetch(`StudentManagement?action=getStudentDetails&studentId=${studentId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStudentDetails(data);
    } catch (err) {
      console.error('Error loading student details:', err);
      setError('Failed to load student details');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentClassTypes = async () => {
    if (!studentId) return;

    try {
      const response = await apiFetch(`StudentManagement?action=getStudentClassTypes&studentId=${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudentClassTypes(data || []);
      }
    } catch (error) {
      console.error('Error loading student class types:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
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

  const formatCurrency = (amount: number, currency: string = 'LKR') => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const handleIssueFreeCard = async () => {
    if (!studentId) return;

    try {
      const response = await apiFetch(`StudentManagement?action=issueFreeCard&studentId=${studentId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to issue free card');
      }

      const data = await response.json();
      toast.success(data.success || 'Free card issued successfully');
      loadStudentDetails();
    } catch (error) {
      console.error('Error issuing free card:', error);
      toast.error('Failed to issue free card');
    }
  };

  const handleRemoveFreeCard = async () => {
    if (!studentId) return;

    try {
      const response = await apiFetch(`StudentManagement?action=removeFreeCard&studentId=${studentId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to remove free card');
      }

      const data = await response.json();
      toast.success(data.success || 'Free card removed successfully');
      loadStudentDetails();
    } catch (error) {
      console.error('Error removing free card:', error);
      toast.error('Failed to remove free card');
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : studentDetails ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Status</p>
                      <Badge variant={studentDetails.isActive ? "default" : "secondary"} className="mt-1">
                        {studentDetails.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <User className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Payment</p>
                      <Badge variant={studentDetails.paymentStatus === 'paid' ? "default" : "destructive"} className="mt-1">
                        {studentDetails.paymentStatus}
                      </Badge>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Grade</p>
                      <p className="text-lg font-bold text-purple-700 mt-1">{studentDetails.grade}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className={`bg-gradient-to-br ${studentDetails.freeCard ? 'from-amber-50 to-amber-100 border-amber-200' : 'from-gray-50 to-gray-100 border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: studentDetails.freeCard ? '#b45309' : '#6b7280' }}>Free Card</p>
                      <Badge variant={studentDetails.freeCard ? "default" : "secondary"} className="mt-1" style={{ backgroundColor: studentDetails.freeCard ? '#f59e0b' : undefined }}>
                        {studentDetails.freeCard ? 'Active' : 'None'}
                      </Badge>
                    </div>
                    <Gift className="h-8 w-8" style={{ color: studentDetails.freeCard ? '#f59e0b' : '#9ca3af' }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Free Card Action Button */}
            <div className="flex justify-end">
              {studentDetails.freeCard ? (
                <Button
                  onClick={handleRemoveFreeCard}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Free Card
                </Button>
              ) : (
                <Button
                  onClick={handleIssueFreeCard}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: '#f59e0b', color: 'white' }}
                >
                  <Gift className="h-4 w-4" />
                  Issue Free Card
                </Button>
              )}
              {/*<Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">*/}
              {/*  <CardContent className="p-4">*/}
              {/*    <div className="flex items-center justify-between">*/}
              {/*      <div>*/}
              {/*        <p className="text-sm text-orange-600 font-medium">Class Type</p>*/}
              {/*        <p className="text-lg font-bold text-orange-700 mt-1">{studentDetails.classType}</p>*/}
              {/*      </div>*/}
              {/*      <Building className="h-8 w-8 text-orange-500" />*/}
              {/*    </div>*/}
              {/*  </CardContent>*/}
              {/*</Card>*/}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="fees">Monthly Fees</TabsTrigger>
                <TabsTrigger value="recordings">Recordings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Student ID</p>
                        <p className="font-semibold text-base">{studentDetails.id}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-semibold text-base">{studentDetails.firstName} {studentDetails.lastName}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </p>
                        <p className="font-semibold text-base">{studentDetails.email || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Mobile
                        </p>
                        <p className="font-semibold text-base">{studentDetails.mobile || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Grade
                        </p>
                        <p className="font-semibold text-base">{studentDetails.grade}</p>
                      </div>
                      {/*<div className="space-y-2">*/}
                      {/*  <p className="text-sm text-gray-500 flex items-center gap-2">*/}
                      {/*    <Building className="h-4 w-4" />*/}
                      {/*    Class Type*/}
                      {/*  </p>*/}
                      {/*  <p className="font-semibold text-base">{studentDetails.classType}</p>*/}
                      {/*</div>*/}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          School
                        </p>
                        <p className="font-semibold text-base">{studentDetails.school || 'N/A'}</p>
                      </div>
                    </div>

                    {/* All Class Types */}
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-500 flex items-center gap-2 mb-3">
                        <Building className="h-4 w-4" />
                        All Registered Class Types
                      </p>
                      {studentClassTypes.length === 0 ? (
                        <p className="text-sm text-gray-400">No class types registered.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {studentClassTypes.map((classType) => (
                            <Badge key={classType.id} className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {classType.classTypeName}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">NIC</p>
                        <p className="font-semibold text-base">{studentDetails.nic || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date of Birth
                        </p>
                        <p className="font-semibold text-base">{formatDate(studentDetails.dateOfBirth)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Registration Date
                        </p>
                        <p className="font-semibold text-base">{formatDate(studentDetails.createdAt)}</p>
                      </div>
                    </div>

                    {studentDetails.address && (
                      <div className="mt-6 pt-6 border-t space-y-2">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address
                        </p>
                        <p className="font-semibold text-base">
                          {studentDetails.address.street && `${studentDetails.address.street}, `}
                          {studentDetails.address.city && `${studentDetails.address.city}, `}
                          {studentDetails.address.district && `${studentDetails.address.district}, `}
                          {studentDetails.address.province && studentDetails.address.province}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!studentDetails.paymentTransactions || studentDetails.paymentTransactions.length === 0) ? (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No payment transactions found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Method</TableHead>
                              <TableHead>Transaction ID</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentDetails.paymentTransactions.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                                <TableCell className="font-semibold">{formatCurrency(payment.amount, payment.currency)}</TableCell>
                                <TableCell>{payment.paymentMethod}</TableCell>
                                <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      payment.verificationStatus === 'verified' ? 'default' :
                                      payment.verificationStatus === 'rejected' ? 'destructive' :
                                      'secondary'
                                    }
                                  >
                                    {payment.verificationStatus}
                                  </Badge>
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

              <TabsContent value="fees" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Monthly Fees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!studentDetails.monthlyFees || studentDetails.monthlyFees.length === 0) ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No monthly fees found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month/Year</TableHead>
                              <TableHead>Grade</TableHead>
                              <TableHead>Class Type</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Paid Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentDetails.monthlyFees.map((fee) => (
                              <TableRow key={fee.id}>
                                <TableCell>{fee.monthYear}</TableCell>
                                <TableCell>{fee.grade}</TableCell>
                                <TableCell>{fee.classType}</TableCell>
                                <TableCell className="font-semibold">{formatCurrency(fee.feeAmount)}</TableCell>
                                <TableCell>{formatDate(fee.dueDate)}</TableCell>
                                <TableCell>{formatDate(fee.paidDate)}</TableCell>
                                <TableCell>
                                  <Badge variant={fee.status === 'paid' ? 'default' : 'destructive'}>
                                    {fee.status}
                                  </Badge>
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

              <TabsContent value="recordings" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Recording Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!studentDetails.recordingRequests || studentDetails.recordingRequests.length === 0) ? (
                      <div className="text-center py-8 text-gray-500">
                        <Video className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No recording requests found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Recording</TableHead>
                              <TableHead>Request Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentDetails.recordingRequests.map((req) => (
                              <TableRow key={req.requestId}>
                                <TableCell className="font-medium">{req.recordingTitle}</TableCell>
                                <TableCell>{formatDate(req.requestDate)}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      req.statusId === 2 ? 'default' :
                                      req.statusId === 1 ? 'secondary' :
                                      'destructive'
                                    }
                                    className="flex items-center gap-1"
                                  >
                                    {req.statusId === 2 && <CheckCircle className="h-3 w-3" />}
                                    {req.statusId === 3 && <XCircle className="h-3 w-3" />}
                                    {req.statusId === 1 && <Clock className="h-3 w-3" />}
                                    {req.status}
                                  </Badge>
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
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
