// PaymentVerifications.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Lock, Unlock, Check, X, Eye, Filter, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiFetch } from '@/lib/utils';
import { AdminNavbar } from '@/components/AdminNavbar';
import { getVerificationStatusStyles, formatMonthlyFeeDate } from '@/lib/monthlyFee';

type PaymentVerification = {
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
};

const PaymentVerifications = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentVerification | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    studentId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isAdminLoggedIn) {
      navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6");
      return;
    }

    fetchPayments();
  }, [navigate, filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.studentId) queryParams.append('studentId', filters.studentId);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      
      const response = await apiFetch(`PaymentVerificationServlet?${queryParams.toString()}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPayments(data.payments || []);
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
      setLoading(false);
    }
  };

  const handleVerifyPayment = (payment: PaymentVerification) => {
    setSelectedPayment(payment);
    setVerificationNotes('');
    setShowVerifyDialog(true);
  };

  const handleRejectPayment = (payment: PaymentVerification) => {
    setSelectedPayment(payment);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const confirmVerify = async () => {
    if (!selectedPayment) return;

    try {
      const response = await apiFetch('PaymentVerificationServlet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'verify',
          paymentId: selectedPayment.id.toString(),
          notes: verificationNotes
        }).toString(),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Payment verified successfully');
        fetchPayments();
        setShowVerifyDialog(false);
        setSelectedPayment(null);
      } else {
        toast.error(data.message || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    }
  };

  const confirmReject = async () => {
    if (!selectedPayment) return;

    try {
      const response = await apiFetch('PaymentVerificationServlet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'reject',
          paymentId: selectedPayment.id.toString(),
          reason: rejectReason
        }).toString(),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Payment rejected');
        fetchPayments();
        setShowRejectDialog(false);
        setSelectedPayment(null);
      } else {
        toast.error(data.message || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = getVerificationStatusStyles(status);
    return <Badge variant="outline" className={styles.badgeClassName}>{styles.label}</Badge>;
  };

  const visiblePayments = payments.filter((payment) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch = !search
      || payment.transactionId.toLowerCase().includes(search)
      || payment.studentName.toLowerCase().includes(search)
      || payment.studentId.toLowerCase().includes(search)
      || payment.description.toLowerCase().includes(search);

    const createdAt = new Date(payment.createdAt);
    const startDate = filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : null;
    const endDate = filters.endDate ? new Date(`${filters.endDate}T23:59:59.999`) : null;
    const matchesStartDate = !startDate || createdAt >= startDate;
    const matchesEndDate = !endDate || createdAt <= endDate;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Student ID', 'Student Name', 'Amount', 'Currency', 'Payment Method', 'Date', 'Status'];
    const csvData = payments.map(p => [
      p.transactionId,
      p.studentId,
      p.studentName,
      p.amount,
      p.currency,
      p.paymentMethod,
      p.createdAt,
      p.verificationStatus
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-verifications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      studentId: '',
      startDate: '',
      endDate: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <AdminNavbar />
      <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-portal-blue">Payment Verifications</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="searchTerm">Search</Label>
              <Input
                id="searchTerm"
                placeholder="Search transaction, student, or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                placeholder="Enter student ID"
                value={filters.studentId}
                onChange={(e) => handleFilterChange('studentId', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions ({visiblePayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading payments...</div>
          ) : visiblePayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payment transactions found
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
                    {/* <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visiblePayments.map((payment) => (
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
                        {formatMonthlyFeeDate(payment.createdAt)}
                      </TableCell>
                      {/* <TableCell>{getStatusBadge(payment.verificationStatus)}</TableCell> */}
                      {/* <TableCell>
                        <div className="flex gap-2">
                          {payment.verificationStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleVerifyPayment(payment)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectPayment(payment)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPayment(payment);
                              // Show details dialog
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell> */}
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
              Showing {visiblePayments.length} payment records
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={loading}
                onClick={fetchPayments}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Verify Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Verify payment for {selectedPayment?.studentName} ({selectedPayment?.studentId})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Transaction ID</Label>
                <div className="text-sm font-medium">{selectedPayment?.transactionId}</div>
              </div>
              <div>
                <Label>Amount</Label>
                <div className="text-sm font-medium">
                  {selectedPayment?.currency} {selectedPayment?.amount?.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="verificationNotes">Verification Notes (Optional)</Label>
              <Textarea
                id="verificationNotes"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add any notes about this verification..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={confirmVerify}>
              <Check className="h-4 w-4 mr-2" />
              Confirm Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Reject payment for {selectedPayment?.studentName} ({selectedPayment?.studentId})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Transaction ID</Label>
                <div className="text-sm font-medium">{selectedPayment?.transactionId}</div>
              </div>
              <div>
                <Label>Amount</Label>
                <div className="text-sm font-medium">
                  {selectedPayment?.currency} {selectedPayment?.amount?.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="rejectReason">Rejection Reason *</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this payment..."
                rows={3}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!rejectReason.trim()}>
              <X className="h-4 w-4 mr-2" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
};

export default PaymentVerifications;
