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
        className={`border-nl-teal/25 bg-nl-teal/10 text-nl-teal font-semibold px-2.5 py-0.5 inline-flex items-center gap-1 ${className}`}
      >
        {showIcon && <Sparkles className="h-3 w-3 text-nl-teal" />}
        FREE
      </Badge>
    );
  }

  return (
      <Badge
        variant="outline"
        className={`border-nl-blue/30 bg-nl-blue/10 text-nl-blue font-semibold px-2.5 py-0.5 inline-flex items-center gap-1 ${className}`}
      >
        {showIcon && <DollarSign className="h-3 w-3 text-nl-blue" />}
        PAID
      </Badge>
  );
};

export default AccessBadge;
