import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BookOpen, ChevronDown, Home, LogOut, User, Edit } from "lucide-react";
import { toast } from "sonner";
import StudentProfile from './StudentProfile';
import WelcomeModal from './WelcomeModal';
import { apiFetch } from "@/lib/utils";
import { clearStudentSession, getStoredStudentId } from "@/lib/auth";

interface DashboardHeaderProps {
  title: string;
}

interface StudentData {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const studentId = getStoredStudentId();
      if (!studentId) {
        clearStudentSession();
        toast.error("Your login information is invalid. Please log in again.");
        navigate('/login');
        return;
      }

      const response = await apiFetch(
        "StudentProfileServlet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ studentId })
        }
      );

      const data = await response.json();

      if (data.success) {
        setStudentData(data.student);
      } else {
        toast.error("Failed to fetch student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Error loading student information");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearStudentSession();
    toast.success("Logout successful");
    navigate("/");
  };

  const handleProfileOpen = () => {
    setIsPopoverOpen(false);
    setIsProfileOpen(true);
  };

  const handleProfileUpdate = (updatedData: StudentData) => {
    setStudentData(updatedData);
    toast.success("Profile updated successfully");
  };

  const displayName = studentData
    ? `${studentData.firstName} ${studentData.lastName}`
    : localStorage.getItem("firstName") || "Student";

  return (
    <>
      <header className="nl-glass sticky top-0 z-30 border-b border-nl-line px-4 py-3 shadow-[0_1px_0_rgb(26_54_93/0.04)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-nl-blue to-nl-navy text-white shadow-soft">
              <Home className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="font-display block truncate text-base font-bold text-nl-ink sm:text-xl">{title}</span>
              <span className="hidden text-sm font-medium text-nl-steel sm:block">Student portal</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 shrink-0 gap-2 rounded-xl border-nl-line bg-white/70 px-3 text-nl-ink hover:bg-white hover:text-nl-blue"
              onClick={() => setIsResourcesOpen(true)}
            >
              <BookOpen className="h-4 w-4" />
              <span>Resources</span>
            </Button>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 shrink-0 gap-2 rounded-xl border-nl-line bg-white/70 px-3 text-nl-ink hover:bg-white hover:text-nl-blue"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{displayName}</span>
                  <ChevronDown className="hidden h-4 w-4 md:block" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="nl-card w-64 rounded-2xl p-3 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} align="end">
                <div className="space-y-4">
                  <div className="rounded-xl bg-nl-mist p-3">
                    <p className="text-sm font-medium text-nl-steel">
                      Signed in as
                    </p>
                    <p className="mt-1 text-sm font-bold text-nl-ink">
                      {displayName}
                    </p>
                    {studentData && (
                      <p className="mt-1 text-xs font-semibold text-nl-teal">
                        ID: {studentData.studentId}
                      </p>
                    )}
                  </div>

                  <Button
                    className="flex h-11 w-full items-center gap-2 rounded-xl bg-nl-teal text-white shadow-soft hover:bg-nl-teal/90"
                    onClick={handleProfileOpen}
                  >
                    <Edit className="h-4 w-4" />
                    Go to profile
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex h-10 w-full items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <WelcomeModal
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
      />

      {studentData && (
        <StudentProfile
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          studentId={studentData.studentId}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default DashboardHeader;
