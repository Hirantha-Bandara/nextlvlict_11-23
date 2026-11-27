import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';

interface EligibleFee {
  id: number;
  grade: string;
  classType: string;
  monthYear: string;
  amount: number;
  status: string;
}

interface PaymentSlipUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PaymentSlipUploadDialog: React.FC<PaymentSlipUploadDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [eligibleFees, setEligibleFees] = useState<EligibleFee[]>([]);
  const [loadingFees, setLoadingFees] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedFeeId, setSelectedFeeId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [transactionReference, setTransactionReference] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch eligible fees when dialog opens
  useEffect(() => {
    if (open) {
      void fetchEligibleFees();
      resetForm();
    }
  }, [open]);

  const fetchEligibleFees = async () => {
    try {
      setLoadingFees(true);
      setError(null);

      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        setError('Please login to continue');
        return;
      }

      const response = await apiFetch(
        `OfflinePayment?action=getEligibleFees&studentId=${encodeURIComponent(studentId)}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEligibleFees(data.fees || []);
          if (data.fees && data.fees.length > 0) {
            setSelectedFeeId(String(data.fees[0].id));
            setAmountPaid(String(data.fees[0].amount));
          }
        } else {
          setError(data.message || 'Failed to fetch eligible fees');
        }
      } else {
        setError('Failed to fetch eligible fees');
      }
    } catch (err) {
      console.error('Error fetching eligible fees:', err);
      setError('Failed to fetch eligible fees. Please try again.');
    } finally {
      setLoadingFees(false);
    }
  };

  const resetForm = () => {
    setSelectedFeeId('');
    setPaymentMethod('');
    setAmountPaid('');
    setPaymentDate('');
    setTransactionReference('');
    setBankName('');
    setFile(null);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Only JPEG, PNG images and PDF documents are allowed');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedFeeId) {
      toast.error('Please select a fee');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select payment method');
      return;
    }
    if (!amountPaid) {
      toast.error('Please enter amount paid');
      return;
    }
    if (!paymentDate) {
      toast.error('Please select payment date');
      return;
    }
    if (!file) {
      toast.error('Please upload payment slip');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        toast.error('Please login to continue');
        return;
      }

      const formData = new FormData();
      formData.append('action', 'submitSlip');
      formData.append('studentId', studentId);
      formData.append('monthlyFeeId', selectedFeeId);
      formData.append('paymentMethod', paymentMethod);
      formData.append('amountPaid', amountPaid);
      formData.append('paymentDate', paymentDate);
      formData.append('transactionReference', transactionReference);
      formData.append('bankName', bankName);
      formData.append('paymentSlip', file);

      const response = await apiFetch('OfflinePayment', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Payment slip submitted successfully! Waiting for admin approval.');
          onOpenChange(false);
          onSuccess();
        } else {
          setError(data.message || 'Failed to submit payment slip');
          toast.error(data.message || 'Submission failed');
        }
      } else {
        setError('Failed to submit payment slip');
        toast.error('Submission failed');
      }
    } catch (err) {
      console.error('Error submitting payment slip:', err);
      setError('Failed to submit payment slip. Please try again.');
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedFee = eligibleFees.find(f => f.id === parseInt(selectedFeeId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="student-portal-theme bg-white max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Upload Bank Transfer / ATM Payment Slip</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loadingFees ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-nl-steel">Loading eligible fees...</div>
          </div>
        ) : eligibleFees.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No unpaid fees available for submission. All fees may already have pending submissions or are already paid.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fee Selection */}
            <div className="space-y-2">
              <Label htmlFor="fee">Select Fee</Label>
              <Select value={selectedFeeId} onValueChange={setSelectedFeeId}>
                <SelectTrigger id="fee" className="rounded-xl border-nl-line">
                  <SelectValue placeholder="Select a fee" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleFees.map((fee) => (
                    <SelectItem key={fee.id} value={String(fee.id)}>
                      {fee.grade} - {fee.classType} ({fee.monthYear}) - LKR {fee.amount.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fee Details Display */}
            {selectedFee && (
              <div className="rounded-2xl bg-nl-mist p-3 text-sm text-nl-ink space-y-1">
                <div><strong>Grade:</strong> {selectedFee.grade}</div>
                <div><strong>Class Type:</strong> {selectedFee.classType}</div>
                <div><strong>Month:</strong> {selectedFee.monthYear}</div>
                <div><strong>Amount Due:</strong> LKR {selectedFee.amount.toFixed(2)}</div>
                <div><strong>Status:</strong> {selectedFee.status}</div>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod" className="rounded-xl border-nl-line">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="ATM_DEPOSIT">ATM Deposit</SelectItem>
                  <SelectItem value="ATM_TRANSFER">ATM Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Paid */}
            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Paid (LKR) *</Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Enter amount paid"
                required
              />
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Transaction Reference */}
            <div className="space-y-2">
              <Label htmlFor="transactionReference">Transaction Reference / Receipt Number</Label>
              <Input
                id="transactionReference"
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                placeholder="e.g., TXN123456789"
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g., Commercial Bank, Sampath Bank"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="paymentSlip">Payment Slip * (JPEG, PNG, or PDF - Max 10MB)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="paymentSlip"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                  required
                />
                {file && (
                  <div className="flex items-center gap-2 text-sm text-nl-teal">
                    <CheckCircle className="h-4 w-4" />
                    <span className="max-w-[200px] truncate">{file.name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-nl-steel">
                Upload a clear image or PDF of your payment slip/receipt. Ensure all details are visible.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Payment Slip'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSlipUploadDialog;
