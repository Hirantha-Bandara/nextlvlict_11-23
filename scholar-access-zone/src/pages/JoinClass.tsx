import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Video
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';
import {
  portalItemVariants,
  StudentLoadingState,
  StudentPageHero,
  StudentPageShell
} from '@/components/StudentPortalLayout';

interface ClassSchedule {
  id: number;
  startTime: string;
  endTime: string;
  zoomLink?: string;
  description?: string;
  grade?: {
    id: number;
    name: string;
  };
  classTypeId?: number;
  classTypeName?: string;
  classType?: {
    id: number;
    name: string;
  } | string;
  day?: {
    id: number;
    name: string;
  };
}

const JoinClass = () => {
  const navigate = useNavigate();
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentGrade, setStudentGrade] = useState<{ id: number; name: string } | null>(null);
  const [paymentRequired, setPaymentRequired] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    fetchClassSchedules();
  }, [navigate]);

  const fetchClassSchedules = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        toast.error("Student ID not found. Please log in again.");
        navigate("/");
        return;
      }

      const response = await apiFetch(`ClassScheduleServlet?studentId=${studentId}`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Expected JSON response from server');
      }

      const data = await response.json();

      if (data.success) {
        setClassSchedules(data.classSchedules || []);
        setPaymentRequired(data.paymentRequired || false);
        if (data.classSchedules && data.classSchedules.length > 0) {
          setStudentGrade(data.classSchedules[0].grade);
        }
        if (data.paymentRequired) {
          toast.info(data.message || "Please pay your monthly fee to view class schedule");
        }
      } else {
        toast.error(data.message || "Failed to load class schedules");
        setClassSchedules(getMockClassSchedulesForGrade());
      }
    } catch (error) {
      console.error("Error fetching class schedules:", error);
      toast.error("Error loading class schedules. Using demo data.");
      setClassSchedules(getMockClassSchedulesForGrade());
    } finally {
      setLoading(false);
    }
  };

  const getMockClassSchedulesForGrade = () => {
    const studentGradeName = localStorage.getItem("gradeName") || "Grade 10";

    const allMockSchedules = [
      {
        id: 1,
        startTime: "14:00",
        endTime: "16:00",
        zoomLink: "https://zoom.us/j/123456789",
        description: "Advanced calculus and linear algebra course covering differential equations and vector spaces.",
        grade: { id: 1, name: "Grade 10" },
        day: { id: 2, name: "Tuesday" }
      },
      {
        id: 2,
        startTime: "09:00",
        endTime: "11:00",
        zoomLink: "https://zoom.us/j/987654321",
        description: "Comprehensive organic chemistry with lab work and molecular structure analysis.",
        grade: { id: 2, name: "Grade 11" },
        day: { id: 1, name: "Monday" }
      },
      {
        id: 3,
        startTime: "13:00",
        endTime: "17:00",
        zoomLink: "https://zoom.us/j/456789123",
        description: "Full-stack web development with modern frameworks including React and Node.js.",
        grade: { id: 3, name: "Grade 12" },
        day: { id: 5, name: "Friday" }
      }
    ];

    return allMockSchedules.filter(schedule =>
      schedule.grade.name === studentGradeName
    );
  };

  const handleJoinZoom = (zoomLink: string | undefined, className: string | undefined) => {
    if (zoomLink) {
      window.open(zoomLink, '_blank', 'noopener,noreferrer');
      toast.success(`Joining ${className} class...`);
    } else {
      toast.error("No Zoom link available for this class");
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  if (loading) {
    return <StudentLoadingState title="Join a Class" message="Loading your class schedules" />;
  }

  return (
    <StudentPageShell title="Join a Class">
      <StudentPageHero
        eyebrow="Live classes"
        title="Join your scheduled online lessons."
        description="Your available classes are grouped here with clear times and one-tap access for mobile."
        icon={Video}
        action={studentGrade && (
          <Badge className="hidden border-white/20 bg-white/10 text-white hover:bg-white/10 sm:inline-flex">
            <BookOpen className="mr-1 h-3.5 w-3.5" />
            {studentGrade.name}
          </Badge>
        )}
      />

      <motion.section variants={portalItemVariants} className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-[#0f5f8f]">
              <Calendar className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-2xl font-bold text-slate-950">{classSchedules.length}</span>
              <span className="text-sm font-medium text-slate-500">Classes</span>
            </span>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-[#00796b]">
              <Users className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold text-slate-950">{studentGrade?.name || 'Grade'}</span>
              <span className="text-sm font-medium text-slate-500">Your level</span>
            </span>
          </CardContent>
        </Card>
      </motion.section>

      {classSchedules.length === 0 ? (
        <motion.section variants={portalItemVariants} className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-sky-50 text-[#0f5f8f]">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-950">
            {paymentRequired ? 'Monthly fee payment required' : 'No classes available'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {paymentRequired
              ? 'Please pay your monthly fee to view your class schedule. The due date is the 10th of each month.'
              : `There are currently no scheduled classes for ${studentGrade?.name || 'your grade'}. Check back later or contact your administrator.`
            }
          </p>
          {paymentRequired && (
            <Button
              className="mt-4 bg-[#0f5f8f] text-white hover:bg-[#0b4d75]"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard to Pay
            </Button>
          )}
        </motion.section>
      ) : (
        <motion.section variants={portalItemVariants} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classSchedules.map((schedule) => (
            <motion.article
              key={schedule.id}
              variants={portalItemVariants}
              whileTap={{ scale: 0.99 }}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <div className="bg-[#102a43] p-4 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-300">{schedule.grade?.name || 'Class'}</p>
                      {(schedule.classTypeName || (typeof schedule.classType === 'object' && schedule.classType?.name) || (typeof schedule.classType === 'string' && schedule.classType)) && (
                        <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs px-2 py-0.5">
                          {schedule.classTypeName || (typeof schedule.classType === 'object' ? schedule.classType?.name : schedule.classType)}
                        </Badge>
                      )}
                    </div>
                    <h2 className="mt-1 text-xl font-bold">{schedule.day?.name || 'TBA'}</h2>
                  </div>
                  <Badge className="bg-white/10 text-white hover:bg-white/10">
                    Available
                  </Badge>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold">
                  <Clock className="h-4 w-4" />
                  {schedule.startTime && schedule.endTime
                    ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`
                    : 'Time TBA'}
                </div>
              </div>

              <div className="space-y-4 p-4">
                <p className="min-h-16 text-sm leading-6 text-slate-600">
                  {schedule.description || 'Class details will be shared by your teacher.'}
                </p>
                <Button
                  className="h-12 w-full bg-[#0f5f8f] text-white hover:bg-[#0b4d75]"
                  onClick={() => handleJoinZoom(schedule.zoomLink, schedule.grade?.name)}
                  disabled={!schedule.zoomLink}
                >
                  <Video className="h-4 w-4" />
                  {schedule.zoomLink ? 'Join class now' : 'Link not available'}
                  {schedule.zoomLink && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </motion.article>
          ))}
        </motion.section>
      )}
    </StudentPageShell>
  );
};

export default JoinClass;
