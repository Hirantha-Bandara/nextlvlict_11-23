import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CreditCard, FileVideo, PlayCircle } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';

export const portalContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const portalItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

interface StudentPageShellProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const StudentPageShell = ({ title, children, className = '' }: StudentPageShellProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-24 text-slate-950 md:pb-8">
      <DashboardHeader title={title} />
      <motion.main
        variants={portalContainerVariants}
        initial="hidden"
        animate="show"
        className={`student-portal-container space-y-5 px-4 py-4 sm:space-y-6 md:px-6 ${className}`}
      >
        {children}
      </motion.main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <Button className="h-12 bg-[#0f5f8f] text-white hover:bg-[#0b4d75]" onClick={() => navigate('/join-class')}>
            <PlayCircle className="h-4 w-4" />
            Join
          </Button>
          <Button variant="outline" className="h-12 border-[#00796b] text-[#00796b]" onClick={() => navigate('/payment')}>
            <CreditCard className="h-4 w-4" />
            Pay
          </Button>
          <Button variant="outline" className="h-12 border-slate-300 text-slate-700" onClick={() => navigate('/materials')}>
            <FileVideo className="h-4 w-4" />
            Study
          </Button>
        </div>
      </div>
    </div>
  );
};

interface StudentPageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

export const StudentPageHero = ({ eyebrow, title, description, icon: Icon = BookOpen, action }: StudentPageHeroProps) => (
  <motion.section variants={portalItemVariants} className="rounded-lg bg-[#102a43] p-5 text-white shadow-sm sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
          <Icon className="h-4 w-4" />
          {eyebrow}
        </div>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  </motion.section>
);

export const StudentLoadingState = ({ title, message }: { title: string; message: string }) => (
  <div className="min-h-screen bg-[#f7f9fc]">
    <DashboardHeader title={title} />
    <main className="student-portal-container flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xs rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm"
      >
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#0f5f8f]" />
        <p className="font-semibold text-slate-900">{message}</p>
        <p className="mt-1 text-sm text-slate-500">This will only take a moment.</p>
      </motion.div>
    </main>
  </div>
);
