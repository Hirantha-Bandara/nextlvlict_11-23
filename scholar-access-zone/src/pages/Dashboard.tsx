import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  FileVideo,
  Layers,
  Loader2,
  PlayCircle,
  Sparkles,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';
import MonthlyFeeRecordCard from '@/components/monthly-fee/MonthlyFeeRecordCard';
import MonthlyFeeSummaryGrid from '@/components/monthly-fee/MonthlyFeeSummaryGrid';
import { getMonthlyFeeSummary, type MonthlyFeeRecord } from '@/lib/monthlyFee';

interface DashboardStats {
  upcomingClasses: number;
  pendingPayments: number;
  availableRecordings: number;
  totalClasses: number;
}

interface UpcomingClass {
  id: number;
  subject: string;
  classTypeId?: number;
  classTypeName?: string;
  day: string;
  time: string;
  teacher: string;
  isNow: boolean;
  description?: string;
  zoomLink?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingClasses: 0,
    pendingPayments: 0,
    availableRecordings: 0,
    totalClasses: 0
  });
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [monthlyFees, setMonthlyFees] = useState<MonthlyFeeRecord[]>([]);
  const [feeCurrency, setFeeCurrency] = useState('LKR');
  const [feeMonthYear, setFeeMonthYear] = useState('Monthly Fees');
  const [feeGrade, setFeeGrade] = useState('');
  const [monthlyFeeError, setMonthlyFeeError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [hasFreeCard, setHasFreeCard] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    // Get student name from localStorage
    const firstName = localStorage.getItem("firstName") || '';
    const lastName = localStorage.getItem("lastName") || '';
    setStudentName(`${firstName} ${lastName}`.trim() || 'Student');

    void fetchDashboardData();

    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const orderId = urlParams.get('order_id');
    const studentId = localStorage.getItem("studentId");

    if (action === 'paymentReturn' && orderId && studentId) {
      // Determine if this is a tute payment, recording payment, or class fee payment
      const isTutePayment = orderId.startsWith('TUTE_');
      const isRecordingPayment = orderId.startsWith('REC_');
      let endpoint = 'ClassFee';
      let successMessage = 'Payment completed successfully!';

      if (isTutePayment) {
        endpoint = 'TutesPaymentServlet';
        successMessage = 'Tute payment completed successfully!';
      } else if (isRecordingPayment) {
        endpoint = 'RecordingsPaymentServlet';
        successMessage = 'Recording payment completed successfully!';
      }

      // Call backend to process payment completion
      apiFetch(`${endpoint}?action=paymentReturn&studentId=${studentId}&order_id=${orderId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
      }).then(data => {
        if (data && data.success) {
          toast.success(successMessage);
          // Refresh dashboard data to show updated payment status
          void fetchDashboardData();
        }
      }).catch(error => {
        console.error('Error processing payment return:', error);
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const refreshOnVisibility = () => {
      if (document.visibilityState === 'visible') {
        void fetchDashboardData();
      }
    };

    const refreshOnFocus = () => {
      void fetchDashboardData();
    };

    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void fetchDashboardData();
      }
    }, 30000);

    document.addEventListener('visibilitychange', refreshOnVisibility);
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      document.removeEventListener('visibilitychange', refreshOnVisibility);
      window.removeEventListener('focus', refreshOnFocus);
      window.clearInterval(refreshTimer);
    };

  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setMonthlyFeeError(null);
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        toast.error("Student ID not found");
        return;
      }

      const [dashboardResult, feeResult, studentResult] = await Promise.allSettled([
        apiFetch(
          `DashboardServlet?studentId=${studentId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json'
            }
          }
        ),
        apiFetch(
          `ClassFee?action=getFeeDetails&studentId=${studentId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json'
            }
          }
        ),
        apiFetch(
          `StudentManagement?action=getStudentDetails&studentId=${studentId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json'
            }
          }
        )
      ]);

      if (dashboardResult.status === 'fulfilled') {
        const response = dashboardResult.value;
        if (response.ok) {
          const data = await response.json();
          // console.log('Dashboard data:', data);
          if (data.success) {
            setStats(data.stats);
            setUpcomingClasses(data.upcomingClasses || []);
          } else {
            toast.error(data.message || "Failed to load dashboard data");
            setDefaultData();
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        throw dashboardResult.reason;
      }

      if (feeResult.status === 'fulfilled') {
        const response = feeResult.value;
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.feeDetails) {
            const records = Array.isArray(data.feeDetails.fees) ? data.feeDetails.fees : [];
            setMonthlyFees(records);
            setFeeCurrency(data.feeDetails.currency || 'LKR');
            setFeeMonthYear(data.feeDetails.monthYear || 'Monthly Fees');
            setFeeGrade(data.feeDetails.grade || '');
          } else {
            setMonthlyFees([]);
            setMonthlyFeeError(data.message || 'Failed to load monthly fees');
          }
        } else {
          setMonthlyFees([]);
          setMonthlyFeeError(`HTTP error! status: ${response.status}`);
        }
      } else {
        setMonthlyFees([]);
        setMonthlyFeeError('Failed to load monthly fees');
      }

      if (studentResult.status === 'fulfilled') {
        const response = studentResult.value;
        if (response.ok) {
          const data = await response.json();
          setHasFreeCard(data.freeCard || false);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Error loading dashboard data");
      setDefaultData();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultData = () => {
    setStats({
      upcomingClasses: 0,
      pendingPayments: 0,
      availableRecordings: 0,
      totalClasses: 0
    });
    setUpcomingClasses([]);
    setMonthlyFees([]);
    setFeeMonthYear('Monthly Fees');
    setFeeGrade('');
    setFeeCurrency('LKR');
  };

  const handleJoinClass = (classItem: UpcomingClass) => {
    if (classItem.zoomLink) {
      window.open(classItem.zoomLink, '_blank');
      toast.success(`Joining ${classItem.subject} class...`);
    } else {
      toast.error("No Zoom link available for this class");
    }
  };

  const quickActions = [
    {
      title: 'Tutes | Recordings | Question Papers',
      description: 'Watch recordings and notes',
      icon: FileVideo,
      to: '/materials',
      buttonText: 'Open',
      tone: 'nl-card nl-card-interactive text-nl-ink',
      iconTone: 'bg-nl-blue/10 text-nl-blue'
    },
    {
      title: 'Recording Bundles',
      description: 'Save with bundled recordings',
      icon: Layers,
      to: '/bundles',
      buttonText: 'View',
      tone: 'bg-gradient-to-br from-nl-blue to-nl-navy text-white shadow-lift',
      iconTone: 'bg-white/20 text-white'
    }
  ];

  const statItems = [
    {
      label: 'Classes',
      value: stats.upcomingClasses,
      icon: Calendar,
      bg: 'bg-nl-blue/10',
      text: 'text-nl-blue'
    },
    {
      label: 'Recordings',
      value: stats.availableRecordings,
      icon: FileVideo,
      bg: 'bg-nl-teal/10',
      text: 'text-nl-teal'
    },
    {
      label: 'Payments',
      value: stats.pendingPayments,
      icon: CreditCard,
      bg: 'bg-nl-orange/10',
      text: 'text-nl-orange'
    },
    {
      label: 'Total',
      value: stats.totalClasses,
      icon: BookOpen,
      bg: 'bg-nl-sky/10',
      text: 'text-nl-sky'
    }
  ];

  const currentClass = upcomingClasses.find((classItem) => classItem.isNow);
  const nextClass = currentClass || upcomingClasses[0];
  const firstName = studentName.split(' ')[0] || 'Student';
  const monthlyFeeSummary = getMonthlyFeeSummary(monthlyFees);

  if (loading) {
    return (
      <div className="student-portal-theme min-h-screen bg-nl-mist">
        <DashboardHeader title="Student Dashboard" />
        <main className="student-portal-container flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="nl-card w-full max-w-xs rounded-2xl p-6 text-center"
          >
            <Loader2 className="mx-auto mb-4 h-9 w-9 animate-spin text-nl-blue" />
            <p className="font-semibold text-nl-ink">Loading your dashboard</p>
            <p className="mt-1 text-sm text-nl-steel">Getting your classes and payment status ready.</p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="student-portal-theme min-h-screen bg-nl-mist pb-24 text-nl-ink md:pb-8">
      <DashboardHeader title="Student Dashboard" />

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="student-portal-container space-y-5 px-4 py-4 sm:space-y-6 md:px-6"
      >
        <motion.section
          variants={itemVariants}
          className="nl-hero-mesh relative overflow-hidden rounded-2xl bg-gradient-to-br from-nl-navy via-nl-blue to-nl-sky p-5 text-white shadow-lift sm:p-6"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-nl-orange/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-nl-teal/25 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Badge className="mb-4 border-white/20 bg-white/10 text-white hover:bg-white/10">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Today
              </Badge>
              <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
                Hi {firstName}, your learning day is ready.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                Start from your next class, then jump into payments or study materials when you need them.
              </p>
            </div>
            <div className="hidden rounded-2xl bg-white/10 p-3 backdrop-blur-sm sm:block">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statItems.map((item) => (
            <motion.div
              key={item.label}
              whileTap={{ scale: 0.98 }}
              className="nl-card rounded-2xl p-3 sm:p-4"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.text}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <p className="font-display text-2xl font-bold text-nl-ink">{item.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-nl-steel">{item.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {!hasFreeCard && (
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-nl-blue">Monthly fees</p>
                <h2 className="font-display mt-1 text-xl font-bold text-nl-ink">{feeMonthYear}</h2>
                {feeGrade && <p className="mt-1 text-sm text-nl-steel">{feeGrade}</p>}
              </div>
            </div>

            {monthlyFeeError ? (
              <Card className="nl-card border-0">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="mx-auto mb-3 h-10 w-10 text-nl-steel" />
                  <p className="font-semibold text-nl-ink">Unable to load monthly fees</p>
                  <p className="mt-1 text-sm text-nl-steel">{monthlyFeeError}</p>
                  <Button
                    className="mt-4 rounded-xl bg-nl-blue text-white hover:bg-nl-navy"
                    onClick={() => void fetchDashboardData()}
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : monthlyFees.length === 0 ? (
              <Card className="nl-card border-0">
                <CardContent className="p-6 text-center">
                  <DollarSign className="mx-auto mb-3 h-10 w-10 text-nl-steel" />
                  <p className="font-semibold text-nl-ink">No monthly fee records found</p>
                  <p className="mt-1 text-sm text-nl-steel">Monthly fee records will appear here when they are available.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* <MonthlyFeeSummaryGrid summary={monthlyFeeSummary} currency={feeCurrency} /> */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                  {monthlyFees.map((record) => (
                    <MonthlyFeeRecordCard
                      key={record.feeId}
                      record={record}
                      currency={feeCurrency}
                      compact
                      onPay={() => navigate('/payment')}
                      onReceipt={() => navigate('/payment?view=history')}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.section>
        )}

        <motion.section variants={itemVariants} className="">
          <div className="grid gap-5 lg:grid-cols-1">
            <Card className="nl-card overflow-hidden border-0">
              <CardContent className="p-0">
                <div className="border-b border-nl-line/70 bg-white p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-nl-blue">Next up</p>
                      <h2 className="font-display mt-1 text-xl font-bold text-nl-ink">Your class schedule</h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 rounded-xl text-nl-blue hover:bg-nl-blue/10"
                      onClick={() => navigate('/join-class')}
                    >
                      View all
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {nextClass ? (
                  <div className="space-y-3 p-4 sm:p-5">
                    <motion.div
                      whileTap={{ scale: 0.99 }}
                      className={`rounded-2xl border p-4 ${nextClass.isNow
                          ? 'border-nl-teal/30 bg-nl-teal/10'
                          : 'border-nl-line bg-nl-mist'
                        }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge className={nextClass.isNow ? 'bg-nl-teal text-white hover:bg-nl-teal' : 'bg-nl-blue text-white hover:bg-nl-blue'}>
                              {nextClass.isNow ? 'Live now' : nextClass.day}
                            </Badge>
                            {nextClass.classTypeName && (
                              <Badge variant="outline" className="border-nl-line bg-white text-nl-ink">
                                {nextClass.classTypeName}
                              </Badge>
                            )}
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-nl-steel">
                              <Clock className="h-4 w-4" />
                              {nextClass.time}
                            </span>
                          </div>
                          <h3 className="font-display text-lg font-bold text-nl-ink">
                            {nextClass.description || nextClass.subject || 'Scheduled class'}
                          </h3>
                          <p className="mt-1 text-sm text-nl-steel">
                            {nextClass.teacher ? `Teacher: ${nextClass.teacher}` : 'Class details are available in Join Class.'}
                          </p>
                        </div>
                        <Button
                          className={`h-12 w-full rounded-xl sm:w-auto ${nextClass.isNow
                              ? 'bg-nl-teal hover:bg-nl-teal/90'
                              : 'bg-nl-blue hover:bg-nl-navy'
                            } text-white shadow-soft`}
                          onClick={() => nextClass.isNow ? handleJoinClass(nextClass) : navigate('/join-class')}
                        >
                          {nextClass.isNow ? 'Join now' : 'Open class'}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>

                    {upcomingClasses.slice(nextClass === currentClass ? 1 : 0, 4).map((classItem) => (
                      <motion.div
                        key={classItem.id}
                        variants={itemVariants}
                        className="flex items-center gap-3 rounded-2xl border border-nl-line bg-white p-3"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-nl-blue/10 text-nl-blue">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-nl-ink">
                            {classItem.description || classItem.subject || 'Class'}
                          </p>
                          <p className="text-sm text-nl-steel">{classItem.day} at {classItem.time}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 rounded-xl text-nl-blue hover:bg-nl-blue/10"
                          onClick={() => navigate('/join-class')}
                          aria-label="View class"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-nl-blue/10 text-nl-blue">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <h3 className="font-display font-bold text-nl-ink">No upcoming classes</h3>
                    <p className="mx-auto mt-1 max-w-xs text-sm text-nl-steel">
                      When new classes are scheduled, they will appear here first.
                    </p>
                    <Button
                      className="mt-5 h-12 rounded-xl bg-nl-blue text-white shadow-soft hover:bg-nl-navy"
                      onClick={() => navigate('/join-class')}
                    >
                      Browse classes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
<br />
          <section className="grid gap-2 sm:grid-cols-2">
              {quickActions.map((action) => (
                <motion.button
                  key={action.title}
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate(action.to)}
                  className={`rounded-2xl p-4 text-left transition ${action.tone}`}
                >
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${action.iconTone}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display font-bold">{action.title}</h3>
                      <p className="mt-1 text-sm opacity-80">{action.description}</p>
                    </div>
                    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-black/10 px-2 text-sm font-semibold">
                      {action.buttonText}
                    </span>
                  </div>
                </motion.button>
              ))}
            </section>
        </motion.section>

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

export default Dashboard;
