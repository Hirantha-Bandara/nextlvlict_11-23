import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  Lock,
  Play,
  ShoppingCart,
  Unlock,
  Loader2,
  Package,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';
import AccessBadge from '@/components/ui/AccessBadge';

interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  accessType?: 'FREE' | 'PAID' | string;
  access_type?: 'FREE' | 'PAID' | string;
  gradeId?: number;
  gradeName?: string;
  thumbnail_url?: string | null;
  created_at?: string;
  recordings?: number;
}

interface BundleCardProps {
  bundle: Bundle;
  isPurchased: boolean;
  onPurchase: (bundle: Bundle) => void;
  onView: (bundle: Bundle) => void;
  processingId?: number | null;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, isPurchased, onPurchase, onView, processingId }) => {
  const isFree = bundle.accessType === 'FREE' || bundle.access_type === 'FREE' || bundle.price === 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
    >
      <div className="relative">
        <img
          src={bundle.thumbnail_url || "https://i.postimg.cc/tCBN16Dr/Untitled_1.jpg"}
          alt={`${bundle.title} thumbnail`}
          className="h-44 w-full object-cover sm:h-52"
        />
        {/*<div className="absolute left-3 top-3 flex items-center gap-2">*/}
        {/*  <AccessBadge accessType={isFree ? 'FREE' : 'PAID'} />*/}
        {/*  {isPurchased && (*/}
        {/*    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">*/}
        {/*      <CheckCircle className="h-3 w-3 mr-1" />*/}
        {/*      Purchased*/}
        {/*    </Badge>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="text-sm font-semibold text-[#0f5f8f]">{bundle.gradeName || 'All Grades'}</p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">{bundle.title}</h2>
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">{bundle.description}</p>
          {/*<p className="mt-2 flex items-center gap-2 text-sm text-slate-500">*/}
          {/*  <Package className="h-4 w-4" />*/}
          {/*  {bundle.recordings || 0} recordings included*/}
          {/*</p>*/}
          {bundle.created_at && (
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              {formatDate(bundle.created_at)}
            </p>
          )}
        </div>

        {!isFree && (
          <p className="text-2xl font-bold text-[#00796b]">
            {formatPrice(bundle.price || 0)}
          </p>
        )}

        {isFree ? (
          <Button 
            className="h-12 w-full bg-emerald-600 text-white hover:bg-emerald-700 font-semibold" 
            onClick={() => onView(bundle)}
          >
            <Play className="h-4 w-4 mr-1" />
            View Free Bundle
          </Button>
        ) : isPurchased ? (
          <Button 
            className="h-12 w-full bg-[#0f5f8f] text-white hover:bg-[#0b4d75]" 
            onClick={() => onView(bundle)}
          >
            <Play className="h-4 w-4 mr-1" />
            View Bundle
          </Button>
        ) : (
          <Button
            disabled={processingId === bundle.id}
            className="h-12 w-full bg-[#0f5f8f] text-white hover:bg-[#0b4d75]"
            onClick={() => onPurchase(bundle)}
          >
            {processingId === bundle.id ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Preparing Payment...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Buy Now - {formatPrice(bundle.price || 0)}
              </>
            )}
          </Button>
        )}
      </div>
    </motion.article>
  );
};

export default BundleCard;
