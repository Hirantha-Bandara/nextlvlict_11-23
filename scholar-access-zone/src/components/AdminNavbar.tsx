import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, CreditCard, GraduationCap, LayoutDashboard, Users, Video, Globe2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'Overview', to: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard', icon: LayoutDashboard },
  { label: 'Students', to: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/students', icon: Users },
  { label: 'Recordings', to: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/recordings', icon: Video },
  { label: 'Class scheduling', to: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard?tab=classScheduling', icon: CalendarDays },
  { label: 'Payments', to: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/payment-verifications', icon: CreditCard },
  { label: 'Class fees', to: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/class-fees', icon: GraduationCap },
  { label: 'Offline Payments', to: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/offline-payments', icon: Upload },
  { label: 'Portfolio', to: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/portfolio', icon: Globe2 }
];

export const AdminNavbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 text-white shadow-lg shadow-slate-950/10 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 sm:px-6">
        <Link to="/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard" className="flex shrink-0 items-center gap-2.5" aria-label="Admin dashboard">
          {/* <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
            <GraduationCap className="h-5 w-5" />
          </span> */}
          <span className="hidden text-sm font-semibold tracking-wide sm:block">NextLevelICT <span className="text-cyan-300">ADMIN</span></span>
        </Link>
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Admin navigation">
          {navigation.map(({ label, to, icon: Icon }) => {
            const isActive = to.includes('?')
              ? location.pathname === '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard' && new URLSearchParams(location.search).get('tab') === 'classScheduling'
              : location.pathname === to && !(to === '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard' && new URLSearchParams(location.search).get('tab'));
            return (
              <Link key={to} to={to} className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white',
                isActive && 'bg-white/12 text-white ring-1 ring-white/10'
              )}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
