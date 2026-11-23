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

// edu-bloom theme scope: student portal pages render inside this wrapper so the
// shadcn token tokens (primary, secondary, card, ...) resolve to the edu-bloom
// palette without touching the admin screens.
const THEME_CLASS = 'student-portal-theme';

interface StudentPageShellProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const StudentPageShell = ({ title, children, className = '' }: StudentPageShellProps) => {
  const navigate = useNavigate();

  return (
    <div className={`${THEME_CLASS} min-h-screen bg-nl-mist pb-24 text-nl-ink md:pb-8`}>
      <DashboardHeader title={title} />
      <motion.main
        variants={portalContainerVariants}
        initial="hidden"
        animate="show"
        className={`student-portal-container space-y-5 px-4 py-4 sm:space-y-6 md:px-6 ${className}`}
      >
        {children}
      </motion.main>

      <div className="nl-glass fixed inset-x-0 bottom-0 z-20 border-t border-nl-line p-3 md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <Button className="h-12 rounded-xl bg-nl-blue text-white shadow-soft hover:bg-nl-navy" onClick={() => navigate('/join-class')}>
            <PlayCircle className="h-4 w-4" />
            Join
          </Button>
          <Button variant="outline" className="h-12 rounded-xl border-nl-teal/40 bg-white/70 text-nl-teal hover:bg-nl-teal/10" onClick={() => navigate('/payment')}>
            <CreditCard className="h-4 w-4" />
            Pay
          </Button>
          <Button variant="outline" className="h-12 rounded-xl border-nl-line bg-white/70 text-nl-ink hover:bg-white" onClick={() => navigate('/materials')}>
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
  <motion.section
    variants={portalItemVariants}
    className="nl-hero-mesh relative overflow-hidden rounded-2xl bg-gradient-to-br from-nl-navy via-nl-blue to-nl-sky p-5 text-white shadow-lift sm:p-6"
  >
    <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-nl-orange/25 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-nl-teal/25 blur-3xl" />
    <div className="relative flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="nl-eyebrow mb-4 !border-white/20 !bg-white/10 !text-white">
          <Icon className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/75 sm:text-base">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  </motion.section>
);

export const StudentLoadingState = ({ title, message }: { title: string; message: string }) => (
  <div className={`${THEME_CLASS} min-h-screen bg-nl-mist`}>
    <DashboardHeader title={title} />
    <main className="student-portal-container flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="nl-card w-full max-w-xs rounded-2xl p-6 text-center"
      >
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-nl-line border-t-nl-sky" />
        <p className="font-semibold text-nl-ink">{message}</p>
        <p className="mt-1 text-sm text-nl-steel">This will only take a moment.</p>
      </motion.div>
    </main>
  </div>
);
