import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getMonthlyFeeStatusStyles, type MonthlyFeeSummary } from '@/lib/monthlyFee';

interface MonthlyFeeSummaryGridProps {
  summary: MonthlyFeeSummary;
  currency: string;
}

const MonthlyFeeSummaryGrid: React.FC<MonthlyFeeSummaryGridProps> = ({ summary, currency }) => {
  const cards = [
    { label: 'Pending Fees', value: summary.pendingFees, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Paid Fees', value: summary.paidFees, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Overdue Fees', value: summary.overdueFees, tone: 'bg-orange-50 text-orange-700' },
    { label: 'Total Pending Amount', value: `${currency} ${summary.totalPendingAmount.toFixed(2)}`, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Total Paid Amount', value: `${currency} ${summary.totalPaidAmount.toFixed(2)}`, tone: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.tone}`}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default MonthlyFeeSummaryGrid;
