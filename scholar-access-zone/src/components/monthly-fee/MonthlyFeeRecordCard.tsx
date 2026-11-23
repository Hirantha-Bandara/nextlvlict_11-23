import React from 'react';
import { ArrowRight, CheckCircle2, CreditCard, ReceiptText, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  formatMonthlyFeeDate,
  getMonthlyFeeStatusStyles,
  getVerificationStatusStyles,
  normalizeMonthlyFeeStatus,
  type MonthlyFeeRecord,
} from '@/lib/monthlyFee';

interface MonthlyFeeRecordCardProps {
  record: MonthlyFeeRecord;
  currency: string;
  onPay?: (feeId: number) => void;
  onPaymentSlip?: (feeId: number) => void;
  onReceipt?: (record: MonthlyFeeRecord) => void;
  disabled?: boolean;
  processing?: boolean;
  compact?: boolean;
  showTransactionId?: boolean;
}

const MonthlyFeeRecordCard: React.FC<MonthlyFeeRecordCardProps> = ({
  record,
  currency,
  onPay,
  onPaymentSlip,
  onReceipt,
  disabled = false,
  processing = false,
  compact = false,
  showTransactionId = false,
}) => {
  const status = normalizeMonthlyFeeStatus(record.status);
  const statusStyles = getMonthlyFeeStatusStyles(status);
  const verificationStyles = getVerificationStatusStyles(record.verificationStatus);
  const isPaid = status === 'PAID';
  const isFailed = status === 'FAILED';
  const canAct = !!onPay || !!onReceipt;

  return (
    <Card className="nl-card overflow-hidden border-0">
      <CardContent className={compact ? 'p-4' : 'p-0'}>
        <div className={compact ? 'space-y-4' : 'bg-white p-5 sm:p-6'}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {/* <p className="text-sm font-semibold text-nl-ink">{record.monthYear || 'N/A'}</p> */}
              <p className="text-xs text-nl-steel">{record.classTypeName || 'Class Type'}</p>
              {showTransactionId && record.transactionId && (
                <p className="mt-1 break-all text-xs text-nl-steel">Transaction ID: {record.transactionId}</p>
              )}
            </div>
            <Badge variant="outline" className={`w-fit ${statusStyles.badgeClassName}`}>
              {isPaid && <CheckCircle2 className="mr-1 h-3.5 w-3.5" />}
              {statusStyles.label}
            </Badge>
          </div>

          <div className="mt-5 rounded-2xl bg-nl-mist p-4 sm:p-5">
            <p className="text-sm font-medium text-nl-steel">Amount</p>
            <p className="font-display mt-1 text-3xl font-bold text-nl-ink">
              {currency} {record.feeAmount.toFixed(2)}
            </p>
            <p className="mt-3 text-sm font-medium text-nl-steel">
              {isPaid
                ? `Paid: ${record.paidDate || formatMonthlyFeeDate(record.verificationDate || record.createdAt)}`
                : `Due: ${record.dueDate || 'N/A'}`}
            </p>
          </div>

          {record.verificationStatus && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-nl-line/70 bg-white px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-nl-steel">Verification</p>
                <Badge variant="outline" className={`mt-1 w-fit ${verificationStyles.badgeClassName}`}>
                  {verificationStyles.label}
                </Badge>
              </div>
              {record.verificationDate && (
                <p className="text-xs text-nl-steel">{formatMonthlyFeeDate(record.verificationDate)}</p>
              )}
            </div>
          )}

          {canAct && (
            <div className={`border-t p-4 sm:p-5 ${isPaid ? 'border-nl-teal/20 bg-nl-teal/10' : isFailed ? 'border-rose-100 bg-rose-50' : record.status === 'OVERDUE' ? 'border-nl-orange/20 bg-nl-orange/10' : 'border-nl-orange/20 bg-nl-orange/10'}`}>
              {isPaid ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-start gap-2 text-sm font-medium leading-6 text-nl-teal">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    Receipt available for this fee.
                  </p>
                  {onReceipt && (
                    <Button
                      variant="outline"
                      onClick={() => onReceipt(record)}
                      className="h-11 rounded-xl border-nl-teal/30 bg-white text-nl-teal hover:bg-nl-teal/10"
                    >
                      <ReceiptText className="h-4 w-4" />
                      Receipt
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className={`text-sm font-medium leading-6 ${isFailed ? 'text-rose-700' : record.status === 'OVERDUE' ? 'text-nl-orange' : 'text-nl-orange'}`}>
                    Payment {record.status === 'OVERDUE' ? 'overdue' : isFailed ? 'failed' : 'due'} by {record.dueDate || 'N/A'}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {onPaymentSlip && (
                      <Button
                        onClick={() => onPaymentSlip(record.feeId)}
                        disabled={disabled || processing}
                        variant="outline"
                        className="h-11 rounded-xl border-nl-line bg-white text-nl-ink hover:bg-nl-mist"
                      >
                        <Upload className="h-4 w-4" />
                        Bank Transfer
                      </Button>
                    )}
                    {onPay && (
                      <Button
                        onClick={() => onPay(record.feeId)}
                        disabled={disabled || processing}
                        className={`h-11 rounded-xl text-white ${isFailed ? 'bg-rose-600 hover:bg-rose-700' : record.status === 'OVERDUE' ? 'bg-nl-orange hover:bg-nl-orange/90' : 'bg-nl-blue hover:bg-nl-navy'}`}
                      >
                        {processing ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Preparing Payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4" />
                            {isFailed ? 'Retry' : 'Pay Online'}
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyFeeRecordCard;