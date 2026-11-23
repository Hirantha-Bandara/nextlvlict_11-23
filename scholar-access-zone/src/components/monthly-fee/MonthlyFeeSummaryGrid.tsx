import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getMonthlyFeeStatusStyles, type MonthlyFeeSummary } from '@/lib/monthlyFee';

interface MonthlyFeeSummaryGridProps {
  summary: MonthlyFeeSummary;
  currency: string;
}

const MonthlyFeeSummaryGrid: React.FC<MonthlyFeeSummaryGridProps> = ({ summary, currency }) => {
  const cards = [
    { label: 'Pending Fees', value: summary.pendingFees, tone: 'text-nl-orange' },
    { label: 'Paid Fees', value: summary.paidFees, tone: 'text-nl-teal' },
    { label: 'Overdue Fees', value: summary.overdueFees, tone: 'text-nl-orange' },
    { label: 'Total Pending Amount', value: `${currency} ${summary.totalPendingAmount.toFixed(2)}`, tone: 'text-nl-ink' },
    { label: 'Total Paid Amount', value: `${currency} ${summary.totalPaidAmount.toFixed(2)}`, tone: 'text-nl-teal' },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label} className="nl-card border-0">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-nl-steel">{card.label}</p>
            <p className={`font-display mt-2 text-2xl font-bold ${card.tone}`}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default MonthlyFeeSummaryGrid;
