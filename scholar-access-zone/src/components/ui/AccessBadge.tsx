import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, DollarSign } from 'lucide-react';

interface AccessBadgeProps {
  accessType?: 'FREE' | 'PAID' | string;
  className?: string;
  showIcon?: boolean;
}

export const AccessBadge: React.FC<AccessBadgeProps> = ({
  accessType = 'PAID',
  className = '',
  showIcon = true,
}) => {
  const isFree = accessType?.toString().toUpperCase() === 'FREE';

  if (isFree) {
    return (
      <Badge
        variant="outline"
        className={`border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 inline-flex items-center gap-1 ${className}`}
      >
        {showIcon && <Sparkles className="h-3 w-3 text-emerald-600" />}
        FREE
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`border-blue-200 bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 inline-flex items-center gap-1 ${className}`}
    >
      {showIcon && <DollarSign className="h-3 w-3 text-blue-600" />}
      PAID
    </Badge>
  );
};

export default AccessBadge;
