import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Clock,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';
import AdminPageShell from '@/components/AdminPageShell';

interface Submission {
  id: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentMobile: string;
  monthlyFeeId: number;
  gradeName: string;
  classTypeName: string;
  monthYear: string;
  feeAmount: number;
  paymentMethod: string;
  amountPaid: number;
  paymentDate: string;
  transactionReference: string;
  bankName: string;
  submissionStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  rejectionReason: string;
  submittedAt: string;
  reviewedAt: string;
  reviewedBy: string;
  r2FileName: string;
  r2FileSize: number;
  r2ContentType: string;
  publicUrl: string;
}

const AdminOfflinePayments = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_REVIEW');
  const [studentIdFilter, setStudentIdFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Dialogs
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      navigate('/admin');
      return;
    }
    void fetchSubmissions();
  }, [navigate]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (studentIdFilter) {
        params.append('studentId', studentIdFilter);
      }

      const response = await apiFetch(
        `OfflinePayment?action=getReviewQueue&${params.toString()}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSubmissions(data.submissions || []);
        } else {
          setError(data.message || 'Failed to fetch submissions');
        }
      } else {
        setError('Failed to fetch submissions');
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionDetails = async (submissionId: number) => {
    try {
      setError(null);

      const response = await apiFetch(
        `OfflinePayment?action=getSubmissionDetails&submissionId=${submissionId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedSubmission(data.submission);
          setDetailDialogOpen(true);
        } else {
          setError(data.message || 'Failed to fetch submission details');
          toast.error(data.message || 'Failed to fetch details');
        }
      } else {
        setError('Failed to fetch submission details');
        toast.error('Failed to fetch details');
      }
    } catch (err) {
      console.error('Error fetching submission details:', err);
      setError('Failed to fetch submission details');
      toast.error('Failed to fetch details');
    }
  };

  const handleApprove = async (submissionId: number) => {
    setActionInProgress(submissionId);
    setError(null);

    try {
      const response = await apiFetch('OfflinePayment', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'approve',
          submissionId: String(submissionId)
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Payment approved successfully');
          setDetailDialogOpen(false);
          void fetchSubmissions();
        } else {
          setError(data.message || 'Failed to approve payment');
          toast.error(data.message || 'Approval failed');
        }
      } else {
        setError('Failed to approve payment');
        toast.error('Approval failed');
      }
    } catch (err) {
      console.error('Error approving payment:', err);
      setError('Failed to approve payment');
      toast.error('Approval failed');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionInProgress(selectedSubmission.id);
    setError(null);

    try {
      const response = await apiFetch('OfflinePayment', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'reject',
          submissionId: String(selectedSubmission.id),
          reason: rejectionReason.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Payment rejected successfully');
          setRejectDialogOpen(false);
          setDetailDialogOpen(false);
          setRejectionReason('');
          setSelectedSubmission(null);
          void fetchSubmissions();
        } else {
          setError(data.message || 'Failed to reject payment');
          toast.error(data.message || 'Rejection failed');
        }
      } else {
        setError('Failed to reject payment');
        toast.error('Rejection failed');
      }
    } catch (err) {
      console.error('Error rejecting payment:', err);
      setError('Failed to reject payment');
      toast.error('Rejection failed');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleViewSlip = (submissionId: number) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission?.publicUrl) {
      window.open(submission.publicUrl, '_blank');
    } else {
      // Fallback to servlet endpoint if publicUrl not available
      window.open(`OfflinePayment?action=viewSlip&submissionId=${submissionId}`, '_blank');
    }
  };

  const handleOpenRejectDialog = () => {
    setRejectDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return (
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            <Clock className="mr-1 h-3 w-3" />
            Pending Review
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (search && !sub.studentName.toLowerCase().includes(search.toLowerCase()) &&
        !sub.studentId.toLowerCase().includes(search.toLowerCase()) &&
        !sub.transactionReference?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <AdminPageShell
      title="Offline Payment Management"
      description="Review bank transfer and ATM payment submissions for monthly class fees."
    >
      {error && (
        <Alert variant="destructive" className="border-rose-200 bg-rose-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="statusFilter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="statusFilter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="studentIdFilter">Student ID</Label>
                <Input
                  id="studentIdFilter"
                  placeholder="Filter by student ID"
                  value={studentIdFilter}
                  onChange={(e) => setStudentIdFilter(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Name, ID, or reference"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button onClick={fetchSubmissions} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-muted-foreground">Loading submissions...</div>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="py-12 text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="text-slate-500">No submissions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Grade/Class</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{sub.studentName}</div>
                            <div className="text-xs text-slate-500">{sub.studentId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{sub.gradeName}</div>
                            <div className="text-xs text-slate-500">{sub.classTypeName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{sub.monthYear}</TableCell>
                        <TableCell>LKR {sub.amountPaid.toFixed(2)}</TableCell>
                        <TableCell>{sub.paymentMethod.replace('_', ' ')}</TableCell>
                        <TableCell>{sub.paymentDate}</TableCell>
                        <TableCell>{getStatusBadge(sub.submissionStatus)}</TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fetchSubmissionDetails(sub.id)}
                              disabled={actionInProgress !== null}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewSlip(sub.id)}
                            >
                              <Download className="h-4 w-4" />
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
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Submission Details</DialogTitle>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Student Info */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Student Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Name:</span> {selectedSubmission.studentName}</div>
                  <div><span className="text-slate-500">ID:</span> {selectedSubmission.studentId}</div>
                  <div><span className="text-slate-500">Email:</span> {selectedSubmission.studentEmail}</div>
                  <div><span className="text-slate-500">Mobile:</span> {selectedSubmission.studentMobile}</div>
                </div>
              </div>

              {/* Fee Info */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Fee Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Grade:</span> {selectedSubmission.gradeName}</div>
                  <div><span className="text-slate-500">Class Type:</span> {selectedSubmission.classTypeName}</div>
                  <div><span className="text-slate-500">Month:</span> {selectedSubmission.monthYear}</div>
                  <div><span className="text-slate-500">Fee Amount:</span> LKR {selectedSubmission.feeAmount.toFixed(2)}</div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Payment Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Payment Method:</span> {selectedSubmission.paymentMethod.replace('_', ' ')}</div>
                  <div><span className="text-slate-500">Amount Paid:</span> LKR {selectedSubmission.amountPaid.toFixed(2)}</div>
                  <div><span className="text-slate-500">Payment Date:</span> {selectedSubmission.paymentDate}</div>
                  <div><span className="text-slate-500">Reference:</span> {selectedSubmission.transactionReference || 'N/A'}</div>
                  <div><span className="text-slate-500">Bank:</span> {selectedSubmission.bankName || 'N/A'}</div>
                  <div><span className="text-slate-500">Status:</span> {getStatusBadge(selectedSubmission.submissionStatus)}</div>
                </div>
              </div>

              {/* File Info */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Payment Slip</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">File Name:</span> {selectedSubmission.r2FileName}</div>
                  <div><span className="text-slate-500">Size:</span> {(selectedSubmission.r2FileSize / 1024).toFixed(2)} KB</div>
                  <div><span className="text-slate-500">Type:</span> {selectedSubmission.r2ContentType}</div>
                </div>
                <Button
                  className="mt-3"
                  variant="outline"
                  onClick={() => {
                    if (selectedSubmission.publicUrl) {
                      window.open(selectedSubmission.publicUrl, '_blank');
                    } else {
                      handleViewSlip(selectedSubmission.id);
                    }
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Payment Slip
                </Button>
              </div>

              {/* Audit Info */}
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Audit Trail</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Submitted:</span> {new Date(selectedSubmission.submittedAt).toLocaleString()}</div>
                  <div><span className="text-slate-500">Reviewed:</span> {selectedSubmission.reviewedAt ? new Date(selectedSubmission.reviewedAt).toLocaleString() : 'N/A'}</div>
                  <div><span className="text-slate-500">Reviewed By:</span> {selectedSubmission.reviewedBy || 'N/A'}</div>
                  {selectedSubmission.rejectionReason && (
                    <div className="col-span-2">
                      <span className="text-slate-500">Rejection Reason:</span>
                      <p className="mt-1 text-rose-600">{selectedSubmission.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedSubmission.submissionStatus === 'PENDING_REVIEW' && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={handleOpenRejectDialog}
                    disabled={actionInProgress !== null}
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedSubmission.id)}
                    disabled={actionInProgress === selectedSubmission.id}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {actionInProgress === selectedSubmission.id ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Please provide a reason for rejecting this payment submission. This will be visible to the student.
            </p>
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason('');
              }}
              disabled={actionInProgress !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionInProgress !== null}
            >
              {actionInProgress !== null ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
};

export default AdminOfflinePayments;
