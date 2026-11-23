import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Home,
  LogOut,
  Users,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AdminPageShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showBack?: boolean;
  onLogout?: () => void;
};

const adminNavItems = [
  { label: 'Dashboard', href: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard', icon: Home },
  { label: 'Students', href: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/students', icon: Users },
  { label: 'Materials', href: '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/recordings', icon: Video },
];

const AdminPageShell = ({
  title,
  description,
  children,
  actions,
  showBack = false,
  onLogout,
}: AdminPageShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('adminUsername') || 'Admin';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard')}
              className="flex items-center gap-3 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                <BookOpen className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Scholar Access
                </span>
                <span className="block text-lg font-bold leading-tight text-slate-950">
                  Admin Panel
                </span>
              </span>
            </button>

            <div className="flex items-center gap-2">
              <div className="hidden rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 sm:block">
                {username}
              </div>
              {showBack && (
                <Button variant="outline" size="sm" onClick={() => navigate('/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard')}>
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              )}
              {onLogout && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <section className="mb-5 flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </section>

        {children}
      </main>
    </div>
  );
};

export default AdminPageShell;
