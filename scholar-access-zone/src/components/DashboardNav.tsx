import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, FileText, FileVideo, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: 'Class Timetable',
    path: '/timetable',
    icon: Calendar
  },
  {
    label: 'Class Fee Payment',
    path: '/payment',
    icon: CreditCard
  },
  {
    label: 'Join a Class',
    path: '/join-class',
    icon: FileText
  },
  {
    label: 'Class Materials',
    path: '/materials',
    icon: FileVideo
  }
];

const DashboardNav = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button - only visible on small screens */}
      <div className="md:hidden flex justify-between items-center p-4 border-b bg-portal-background sticky top-16 z-20">
        <Button
          variant="ghost"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span>Menu</span>
        </Button>
      </div>

      {/* Mobile menu - only visible when toggled on small screens */}
      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-2 bg-portal-background p-4 border-b z-10">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              asChild
              className={cn(
                "flex items-center gap-2 w-full justify-start",
                location.pathname === item.path && "bg-portal-lightblue text-portal-blue font-medium"
              )}
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
      <nav className="hidden md:flex flex-col md:flex-row justify-start md:justify-between items-start gap-2 sticky top-16 md:top-20 z-10 bg-portal-background p-4 border-b overflow-x-auto w-full">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            asChild
            className={cn(
              "flex items-center gap-2 w-full md:w-auto justify-start",
              location.pathname === item.path && "bg-portal-lightblue text-portal-blue font-medium"
            )}
          >
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