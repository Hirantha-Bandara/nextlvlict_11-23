export type MonthlyFeeStatus = 'PENDING' | 'PAID' | 'FAILED' | 'OVERDUE' | string;
export type MonthlyVerificationStatus = 'pending' | 'verified' | 'rejected' | string;

export interface MonthlyFeeRecord {
  feeId: number;
  classTypeId?: number;
  classTypeName?: string;
  feeAmount: number;
  status: MonthlyFeeStatus;
  monthYear?: string;
  dueDate?: string;
  paidDate?: string;
  transactionId?: string;
  verificationStatus?: MonthlyVerificationStatus;
  verifiedBy?: string;
  verificationDate?: string;
  verificationNotes?: string;
  description?: string;
  createdAt?: string;
  currency?: string;
}

export interface MonthlyFeeSummary {
  pendingFees: number;
  paidFees: number;
  overdueFees: number;
  failedFees: number;
  totalPendingAmount: number;
  totalPaidAmount: number;
  totalRecords: number;
}

export const normalizeMonthlyFeeStatus = (status?: string) => (status || '').toUpperCase();

export const formatMonthlyFeeDate = (dateValue?: string) => {
  if (!dateValue) return 'N/A';

  const normalizedDate = dateValue.includes(' ') ? dateValue.replace(' ', 'T') : dateValue;
  const parsedDate = new Date(normalizedDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleString();
};

export const getMonthlyFeeSummary = (records: MonthlyFeeRecord[]): MonthlyFeeSummary => {
  const summary = records.reduce<MonthlyFeeSummary>((accumulator, record) => {
    const status = normalizeMonthlyFeeStatus(record.status);
    const amount = Number(record.feeAmount) || 0;

    if (status === 'PAID') {
      accumulator.paidFees += 1;
      accumulator.totalPaidAmount += amount;
    } else if (status === 'OVERDUE') {
      accumulator.overdueFees += 1;
      accumulator.totalPendingAmount += amount;
    } else if (status === 'FAILED') {
      accumulator.failedFees += 1;
      accumulator.totalPendingAmount += amount;
    } else {
      accumulator.pendingFees += 1;
      accumulator.totalPendingAmount += amount;
    }

    accumulator.totalRecords += 1;
    return accumulator;
  }, {
    pendingFees: 0,
    paidFees: 0,
    overdueFees: 0,
    failedFees: 0,
    totalPendingAmount: 0,
    totalPaidAmount: 0,
    totalRecords: 0,
  });

  return summary;
};

export const getMonthlyFeeStatusStyles = (status?: string) => {
  const normalizedStatus = normalizeMonthlyFeeStatus(status);

  switch (normalizedStatus) {
    case 'PAID':
      return {
        badgeClassName: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        label: 'Paid',
      };
    case 'FAILED':
      return {
        badgeClassName: 'bg-rose-50 text-rose-700 border-rose-200',
        label: 'Failed',
      };
    case 'OVERDUE':
      return {
        badgeClassName: 'bg-orange-50 text-orange-700 border-orange-200',
        label: 'Overdue',
      };
    case 'PENDING':
      return {
        badgeClassName: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'Pending',
      };
    default:
      return {
        badgeClassName: 'bg-slate-50 text-slate-700 border-slate-200',
        label: normalizedStatus || 'Unknown',
      };
  }
};

export const getVerificationStatusStyles = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'verified':
      return {
        badgeClassName: 'bg-blue-50 text-blue-700 border-blue-200',
        label: 'Verified',
      };
    case 'rejected':
      return {
        badgeClassName: 'bg-rose-50 text-rose-700 border-rose-200',
        label: 'Rejected',
      };
    default:
      return {
        badgeClassName: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'Pending',
      };
  }
};
