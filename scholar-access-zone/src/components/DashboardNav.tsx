import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, CreditCard, Play, BookOpen, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Class Timetable',
    path: '/timetable',
    icon: CalendarDays,
  },
  {
    label: 'Class Fee Payment',
    path: '/payment',
    icon: CreditCard,
  },
  {
    label: 'Join a Class',
    path: '/join-class',
    icon: Play,
  },
  {
    label: 'Class Materials',
    path: '/materials',
    icon: BookOpen,
  },
];

const DashboardNav = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = (path: string) =>
    cn(
      'flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all md:w-auto',
      location.pathname === path
        ? 'bg-gradient-to-r from-nl-blue to-nl-navy text-white shadow-soft'
        : 'text-nl-steel hover:bg-white hover:text-nl-blue',
    );

  return (
    <>
      {/* Mobile menu button - only visible on small screens */}
      <div className="nl-glass sticky top-16 z-20 flex items-center justify-between border-b border-nl-line p-3 md:hidden">
        <Button
          variant="ghost"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 rounded-xl text-nl-ink"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span>Menu</span>
        </Button>
      </div>

      {/* Mobile menu - only visible when toggled on small screens */}
      {mobileMenuOpen && (
        <nav className="nl-glass z-10 flex flex-col gap-2 border-b border-nl-line p-4 md:hidden">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              asChild
              className={linkClass(item.path)}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to={item.path}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      )}

      {/* Desktop navigation - hidden on mobile, visible on medium screens and up */}
      <nav className="nl-glass sticky top-16 z-10 hidden w-full flex-col gap-2 overflow-x-auto border-b border-nl-line p-4 md:top-20 md:flex md:flex-row md:items-center md:justify-start md:justify-between">
        {navItems.map((item) => (
          <Button key={item.path} variant="ghost" asChild className={linkClass(item.path)}>
            <Link to={item.path}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
    </>
  );
};

export default DashboardNav;
