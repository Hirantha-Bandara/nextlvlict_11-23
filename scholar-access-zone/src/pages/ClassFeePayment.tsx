// ClassFeePayment.tsx - FIXED PAYHERE INTEGRATION
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertCircle,
  Coins,
  History,
  ReceiptText
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';
import MonthlyFeeRecordCard from '@/components/monthly-fee/MonthlyFeeRecordCard';
import PaymentSlipUploadDialog from '@/components/monthly-fee/PaymentSlipUploadDialog';
import { getMonthlyFeeStatusStyles, getVerificationStatusStyles, normalizeMonthlyFeeStatus, type MonthlyFeeRecord } from '@/lib/monthlyFee';
import {
  portalItemVariants,
  StudentLoadingState,
  StudentPageHero,
  StudentPageShell
} from '@/components/StudentPortalLayout';

interface FeeEntry extends MonthlyFeeRecord {
  feeId: number;
  feeAmount: number;
  status: string;
}

interface FeeDetails {
  grade: string;
  currency: string;
  monthYear: string;
  fees: FeeEntry[];
}

interface PaymentHistory {
  id: number;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verificationDate?: string;
  verificationNotes?: string;
  studentName?: string;
  studentEmail?: string;
  studentMobile?: string;
  monthYear?: string;
  classTypeName?: string;
  feeAmount?: number;
  paymentStatus?: string;
  feeId?: number;
}

const ClassFeePayment = () => {
  const navigate = useNavigate();
  const [feeDetails, setFeeDetails] = useState<FeeDetails | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processingFeeId, setProcessingFeeId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(() => new URLSearchParams(window.location.search).get('view') === 'history');
  const [error, setError] = useState<string | null>(null);
  const [hasFreeCard, setHasFreeCard] = useState(false);
  const [showPaymentSlipDialog, setShowPaymentSlipDialog] = useState(false);
  const [selectedFeeForSlip, setSelectedFeeForSlip] = useState<number | null>(null);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      toast.error("Please login again");
      navigate("/");
      return;
    }

    void refreshMonthlyFeeData(studentId, true);

    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const orderId = urlParams.get('order_id');

    if (action === 'paymentReturn' && orderId) {
      void handlePaymentReturn(studentId, orderId);
    } else if (action === 'paymentCancel' && orderId) {
      void handlePaymentCancel(studentId, orderId);
    }

    const refreshFromFocus = () => {
      const currentStudentId = localStorage.getItem("studentId");
      if (currentStudentId) {
        void refreshMonthlyFeeData(currentStudentId);
      }
    };

    const refreshFromVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshFromFocus();
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshFromFocus();
      }
    }, 30000);

    window.addEventListener('focus', refreshFromFocus);
    document.addEventListener('visibilitychange', refreshFromVisibility);

    return () => {
      window.removeEventListener('focus', refreshFromFocus);
      document.removeEventListener('visibilitychange', refreshFromVisibility);
      window.clearInterval(intervalId);
    };
  }, [navigate]);

  const refreshMonthlyFeeData = async (studentId: string, showLoading = false) => {
    await Promise.all([
      fetchFeeDetails(studentId, showLoading),
      fetchPaymentHistory(studentId),
      fetchStudentDetails(studentId)
    ]);
  };

  const handlePaymentReturn = async (studentId: string, orderId: string) => {
    try {
      const response = await apiFetch(
        `ClassFee?action=paymentReturn&studentId=${studentId}&order_id=${orderId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("Payment completed successfully!");
          void refreshMonthlyFeeData(studentId);
        } else {
          toast.error(data.message || 'Payment return could not be processed');
        }
      } else {
        toast.error('Payment return could not be processed');
      }
    } catch (error) {
      console.error('Error processing payment return:', error);
      toast.error('Payment return failed. Please try again.');
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handlePaymentCancel = async (studentId: string, orderId: string) => {
    try {
      const response = await apiFetch(
        `ClassFee?action=paymentCancel&studentId=${studentId}&order_id=${orderId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.info(data.message || 'Payment was cancelled. You can try again.');
        void refreshMonthlyFeeData(studentId);
      } else {
        toast.error('Payment cancel could not be processed');
      }
    } catch (error) {
      console.error('Error processing payment cancel:', error);
      toast.error('Payment cancel failed. Please try again.');
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const fetchFeeDetails = async (studentId: string, showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      const response = await apiFetch(
        `ClassFee?action=getFeeDetails&studentId=${studentId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleSessionExpired();
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Fee details response:', data);

      if (data.success) {
        setFeeDetails(data.feeDetails);
      } else {
        setError(data.message || 'Failed to fetch fee details');
        if (data.errorCode === "NOT_LOGGED_IN") {
          handleSessionExpired();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch fee details. Please try again.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const fetchPaymentHistory = async (studentId: string) => {
    try {
      const response = await apiFetch(
        `PaymentHistoryServlet?studentId=${encodeURIComponent(studentId)}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPaymentHistory(data.payments || []);
          setTotalPayments(typeof data.totalPayments === 'number' ? data.totalPayments : (data.payments || []).length);
        } else if (data.errorCode === 'NOT_LOGGED_IN' || data.message === 'Not logged in') {
          handleSessionExpired();
        }
      } else if (response.status === 401 || response.status === 403) {
        handleSessionExpired();
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const fetchStudentDetails = async (studentId: string) => {
    try {
      const response = await apiFetch(
        `StudentManagement?action=getStudentDetails&studentId=${studentId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHasFreeCard(data.freeCard || false);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const formatServerDate = (dateValue?: string) => {
    if (!dateValue) return 'N/A';

    const normalizedDate = dateValue.includes(' ') ? dateValue.replace(' ', 'T') : dateValue;
    const parsedDate = new Date(normalizedDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return dateValue;
    }

    return parsedDate.toLocaleString();
  };

  const handleSessionExpired = () => {
    localStorage.clear();
    toast.error("Session expired. Please login again.");
    navigate("/");
  };

  const handlePaymentSlipUpload = (feeId: number) => {
    setSelectedFeeForSlip(feeId);
    setShowPaymentSlipDialog(true);
  };

  const handlePayFee = async (feeId: number) => {
    if (processingFeeId !== null) {
      return;
    }

    try {
      setProcessingFeeId(feeId);
      setError(null);

      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        toast.error("Please login again");
        navigate("/");
        setProcessingFeeId(null);
        return;
      }

      console.log('Initiating payment for student:', studentId, 'feeId:', feeId);

      const response = await apiFetch(
        `ClassFee?action=initiatePayment&studentId=${studentId}&feeId=${feeId}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      const data = await response.json();
      console.log('Payment initiation response:', data);

      if (data.success && data.paymentData) {
        const submitted = submitToPayHere(data.paymentData);
        if (!submitted) {
          setProcessingFeeId(null);
        }
      } else {
        setError(data.message || 'Failed to initiate payment');
        toast.error(data.message || 'Payment initiation failed');
        setProcessingFeeId(null);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to initiate payment. Please try again.');
      toast.error('Payment initiation failed');
      setProcessingFeeId(null);
    }
  };

  const submitToPayHere = (paymentData: any) => {
    try {
      console.log('Original payment data from backend:', paymentData);

      // Ensure all required PayHere parameters are present
      const requiredParams = [
        'merchant_id',
        'return_url',
        'cancel_url',
        'notify_url',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'order_id',
        'items',
        'currency',
        'amount',
        'hash'
      ];

      // Validate that all required parameters are present
      const missingParams = requiredParams.filter(param => !paymentData[param]);
      if (missingParams.length > 0) {
        console.warn('Missing required PayHere parameters:', missingParams);
        setError(`Payment configuration error. Missing: ${missingParams.join(', ')}`);
        toast.error('Payment configuration incomplete');
        return false;
      }

      // Create form dynamically - CORRECT PAYHERE INTEGRATION
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.payhere.lk/pay/checkout';
      // form.action = 'https://sandbox.payhere.lk/pay/checkout';
      form.style.display = 'none';

      // Add required PayHere parameters as hidden inputs
      requiredParams.forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);

        console.log(`Adding PayHere parameter: ${key} = ${paymentData[key]}`);
      });

      // Add to document and submit
      document.body.appendChild(form);
      console.log('Form created with all required PayHere fields. Submitting to PayHere...');
      console.log('Complete payment data being sent:', paymentData);

      // Small delay to ensure form is properly appended
      setTimeout(() => {
        form.submit();
      }, 100);
      return true;

    } catch (error) {
      console.error('Error submitting to PayHere:', error);
      setError('Error redirecting to payment gateway. Please try again.');
      toast.error('Payment redirect failed');
      return false;
    }
  };

  const currentCurrency = feeDetails?.currency || 'LKR';
  const currentMonthYear = feeDetails?.monthYear || 'Monthly Fees';
  const monthlyFeeRecords = feeDetails?.fees || [];

  if (loading) {
    return <StudentLoadingState title="Class Fee Payment" message="Loading fee details" />;
  }

  return (
    <StudentPageShell title="Class Fee Payment" className="max-w-4xl">
      <StudentPageHero
        eyebrow="Payments"
        title="Manage class fees without digging around."
        description="See the current fee first, then switch to previous payment records when you need a receipt trail."
        icon={Coins}
        action={
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="hidden border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:inline-flex"
          >
            <History className="h-4 w-4" />
            {showHistory ? 'Current Fee' : 'History'}
          </Button>
        }
      />

      <motion.div variants={portalItemVariants} className="sm:hidden">
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
          className="h-12 w-full rounded-xl border-nl-line bg-white text-nl-ink"
        >
          <History className="h-4 w-4" />
          {showHistory ? 'Show Current Fee' : 'Show Payment History'}
        </Button>
      </motion.div>

      {error && (
        <motion.div variants={portalItemVariants}>
          <Alert variant="destructive" className="border-rose-200 bg-rose-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {!showHistory ? (
        hasFreeCard ? (
          <motion.section variants={portalItemVariants} className="rounded-2xl border border-nl-orange/30 bg-nl-orange/10 p-8 text-center shadow-soft">
            <Coins className="mx-auto mb-4 h-12 w-12 text-nl-orange" />
            <h3 className="font-display mb-2 text-xl font-bold text-nl-ink">Free Card Active</h3>
            <p className="mb-4 text-nl-steel">You have a free card, so monthly fees are not applicable.</p>
            <Button
              variant="outline"
              className="rounded-xl border-nl-orange/40 text-nl-orange hover:bg-nl-orange/10"
              onClick={() => setShowHistory(true)}
            >
              <ReceiptText className="h-4 w-4 mr-2" />
              View Payment History
            </Button>
          </motion.section>
        ) : feeDetails ? (
          <motion.section variants={portalItemVariants} className="space-y-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-nl-blue">{feeDetails.grade}</p>
              <h2 className="font-display mt-1 text-2xl font-bold text-nl-ink">{currentMonthYear}</h2>
            </div>

            {monthlyFeeRecords.length > 0 ? (
              <div className="space-y-3">
                {monthlyFeeRecords.map((fee) => (
                  <MonthlyFeeRecordCard
                    key={fee.feeId}
                    record={fee}
                    currency={currentCurrency}
                    onPay={handlePayFee}
                    onPaymentSlip={handlePaymentSlipUpload}
                    onReceipt={() => setShowHistory(true)}
                    disabled={processingFeeId !== null && processingFeeId !== fee.feeId}
                    processing={processingFeeId === fee.feeId}
                  />
                ))}
              </div>
            ) : (
              <motion.section variants={portalItemVariants} className="nl-card p-8 text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-nl-steel" />
                <p className="mb-4 text-nl-steel">No fee records found for this month</p>
                <Button
                  className="rounded-xl bg-nl-blue text-white shadow-soft hover:bg-nl-navy"
                  onClick={() => {
                    const studentId = localStorage.getItem("studentId");
                    if (studentId) {
                      void refreshMonthlyFeeData(studentId, true);
                    }
                  }}
                >
                  Try Again
                </Button>
              </motion.section>
            )}
          </motion.section>
        ) : (
          <motion.section variants={portalItemVariants} className="nl-card p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-nl-steel" />
            <p className="mb-4 text-nl-steel">Unable to load fee information</p>
            <Button
              className="rounded-xl bg-nl-blue text-white shadow-soft hover:bg-nl-navy"
              onClick={() => {
                const studentId = localStorage.getItem("studentId");
                if (studentId) {
                  void refreshMonthlyFeeData(studentId, true);
                }
              }}
            >
              Try Again
            </Button>
          </motion.section>
        )
      ) : (
        <motion.section variants={portalItemVariants}>
          <Card className="nl-card border-0">
            <CardContent className="p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-5 w-5 text-nl-blue" />
                  <h2 className="font-display text-lg font-bold text-nl-ink">Payment History</h2>
                </div>
                <Badge variant="outline" className="border-nl-line bg-nl-mist text-nl-ink">
                  {totalPayments} records
                </Badge>
              </div>

              {paymentHistory.length > 0 ? (
                <div className="nl-card overflow-x-auto rounded-2xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Class Type</TableHead>
                        <TableHead>Fee Amount</TableHead>
                        <TableHead>Paid Date</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Verification Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map((payment) => {
                        const verificationStyles = getVerificationStatusStyles(payment.verificationStatus);
                        const paymentStatus = normalizeMonthlyFeeStatus(
                          payment.paymentStatus || (payment.verificationStatus === 'verified'
                            ? 'PAID'
                            : payment.verificationStatus === 'rejected'
                              ? 'FAILED'
                              : 'PENDING')
                        );
                        const paymentStatusStyles = getMonthlyFeeStatusStyles(paymentStatus);
                        const paymentStatusLabel = paymentStatus === 'PAID'
                          ? 'Paid'
                          : paymentStatus === 'FAILED'
                            ? 'Failed'
                            : paymentStatus === 'OVERDUE'
                              ? 'Overdue'
                              : 'Pending';

                        return (
                          <TableRow key={payment.id}>
                            <TableCell className="whitespace-nowrap font-medium text-nl-ink">
                              {payment.monthYear || payment.description || 'N/A'}
                            </TableCell>
                            <TableCell>{payment.classTypeName || 'N/A'}</TableCell>
                            <TableCell>
                              {payment.currency} {(payment.feeAmount ?? payment.amount).toFixed(2)}
                            </TableCell>
                            <TableCell>{formatServerDate(payment.paidDate || payment.createdAt)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={paymentStatusStyles.badgeClassName}>
                                {paymentStatusLabel}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-nl-steel">{payment.transactionId}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={verificationStyles.badgeClassName}>
                                {verificationStyles.label}
                              </Badge>
                              {payment.verificationDate && (
                                <p className="mt-1 text-[11px] text-nl-steel">{formatServerDate(payment.verificationDate)}</p>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <History className="mx-auto mb-4 h-12 w-12 text-nl-steel" />
                  <p className="text-nl-steel">No payment history found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Payment Slip Upload Dialog */}
      <PaymentSlipUploadDialog
        open={showPaymentSlipDialog}
        onOpenChange={setShowPaymentSlipDialog}
        onSuccess={() => {
          const studentId = localStorage.getItem("studentId");
          if (studentId) {
            void refreshMonthlyFeeData(studentId, true);
          }
        }}
      />
    </StudentPageShell>
  );
};

export default ClassFeePayment;
