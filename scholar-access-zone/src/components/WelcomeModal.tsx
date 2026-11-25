import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/utils';
import { getStoredStudentId } from '@/lib/auth';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Sparkles,
  Loader2,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Compass
} from 'lucide-react';
import { toast } from 'sonner';

export interface GradeOption {
  id: number;
  name: string;
  isActive?: number | boolean;
}

interface WelcomeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  studentGradeId?: number | string | null;
  studentGradeName?: string | null;
}

export const DONT_SHOW_TODAY_KEY = 'welcomeModal_dontShowToday';

/** Helper to check if "Don't show again today" is active */
export const isModalSkippedToday = (): boolean => {
  try {
    const savedDate = localStorage.getItem(DONT_SHOW_TODAY_KEY);
    if (!savedDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return savedDate === today;
  } catch (error) {
    return false;
  }
};

/** Helper to save "Don't show again today" preference */
export const saveModalSkippedToday = (enabled: boolean) => {
  try {
    if (enabled) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(DONT_SHOW_TODAY_KEY, today);
    } else {
      localStorage.removeItem(DONT_SHOW_TODAY_KEY);
    }
  } catch (error) {
    console.error("Failed to save welcome modal preference:", error);
  }
};

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  studentGradeId: initialGradeId,
  studentGradeName: initialGradeName
}) => {
  const navigate = useNavigate();

  const [grades, setGrades] = useState<GradeOption[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [registeredGradeName, setRegisteredGradeName] = useState<string | null>(
    initialGradeName || localStorage.getItem('gradeName') || null
  );
  const [registeredGradeId, setRegisteredGradeId] = useState<number | string | null>(
    initialGradeId || localStorage.getItem('gradeId') || null
  );

  const [dontShowToday, setDontShowToday] = useState(false);

  useEffect(() => {
    if (isOpen) {
      void loadGradesAndProfile();
    }
  }, [isOpen]);

  const loadGradesAndProfile = async () => {
    setLoadingGrades(true);
    setError(null);

    // 1. Fetch student profile if registered grade is not stored yet
    const studentId = getStoredStudentId();
    if (studentId && (!registeredGradeName || !registeredGradeId)) {
      try {
        const profileRes = await apiFetch('StudentProfileServlet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId })
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.student) {
            const st = profileData.student;
            const gName = st.gradeName || (typeof st.grade === 'string' ? st.grade : st.grade?.name) || null;
            const gId = st.gradeId || st.grade_id || (typeof st.grade === 'object' ? st.grade?.id : null) || null;
            if (gName) {
              setRegisteredGradeName(gName);
              localStorage.setItem('gradeName', gName);
            }
            if (gId) {
              setRegisteredGradeId(gId);
              localStorage.setItem('gradeId', String(gId));
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch student profile for registered grade check:", err);
      }
    }

    // 2. Load grades using the same public endpoints used in StudentRegistration.
    //    ClassFeeManagement?action=getGrades requires admin auth — never use it for students.
    //    Strategy: fetch all OL/AL types from OlAlServlet (public, no auth),
    //    then fetch grades per OL/AL type from GradeServlet (public, no auth),
    //    and merge the results.
    try {
      let gradesData: GradeOption[] = [];

      // Step A: get OL/AL type IDs
      const olAlRes = await apiFetch('OlAlServlet', {
        headers: { 'Accept': 'application/json' }
      });

      if (olAlRes.ok) {
        const olAlData = await olAlRes.json();
        const olAlOptions: Array<{ id: number | string; name: string }> =
          olAlData?.olAlOptions || olAlData?.data || (Array.isArray(olAlData) ? olAlData : []);

        if (olAlOptions.length > 0) {
          // Step B: fetch grades for each OL/AL type in parallel
          const gradeResults = await Promise.allSettled(
            olAlOptions.map(olAl =>
              apiFetch(`GradeServlet?olAlId=${olAl.id}`, {
                headers: { 'Accept': 'application/json' }
              })
                .then(r => r.ok ? r.json() : null)
                .then(d => {
                  if (!d) return [] as GradeOption[];
                  if (Array.isArray(d)) return d as GradeOption[];
                  if (Array.isArray(d.grades)) return d.grades as GradeOption[];
                  return [] as GradeOption[];
                })
            )
          );

          const seenIds = new Set<number | string>();
          gradeResults.forEach(result => {
            if (result.status === 'fulfilled') {
              result.value.forEach(g => {
                if (!seenIds.has(g.id)) {
                  seenIds.add(g.id);
                  gradesData.push(g);
                }
              });
            }
          });
        }
      }

      // Step C: if the parallel strategy yielded nothing, try GradeServlet without params
      if (gradesData.length === 0) {
        const fallbackRes = await apiFetch('GradeServlet', {
          headers: { 'Accept': 'application/json' }
        });
        if (fallbackRes.ok) {
          const rawData = await fallbackRes.json();
          if (Array.isArray(rawData)) {
            gradesData = rawData;
          } else if (Array.isArray(rawData?.grades)) {
            gradesData = rawData.grades;
          }
        }
      }

      if (gradesData.length > 0) {
        // Filter active grades if isActive flag is present
        const activeGrades = gradesData.filter(
          g => g.isActive === undefined || g.isActive === 1 || g.isActive === true
        );
        setGrades(activeGrades.length > 0 ? activeGrades : gradesData);
      } else {
        setError("Failed to load grades. Please check your connection.");
      }
    } catch (err) {
      console.error("Error fetching grades for Welcome Modal:", err);
      setError("Unable to load grades. Please try again.");
    } finally {
      setLoadingGrades(false);
    }
  };

  const handleSelection = (action: () => void) => {
    if (dontShowToday) {
      saveModalSkippedToday(true);
    }
    if (onClose) onClose();
    action();
  };

  /**
   * Check if a grade card matches the student's registered grade.
   * IMPORTANT: Only use the numeric gradeId for comparison.
   * Do NOT fall back to name-based numeric suffix comparison — names like
   * "2027 A/L" and "2027 O/L" share the same numeric suffix (2027) which
   * would falsely mark both cards as "Registered".
   */
  const isRegisteredGrade = (grade: GradeOption): boolean => {
    // Primary: strict ID comparison — the only reliable match
    if (registeredGradeId != null && registeredGradeId !== '') {
      return String(grade.id) === String(registeredGradeId);
    }
    // Fallback (only when gradeId is completely unknown): exact full-name match only.
    // Never strip digits — "2027 A/L" and "2027 O/L" must never cross-match.
    if (registeredGradeName) {
      return grade.name.toLowerCase().trim() === registeredGradeName.toLowerCase().trim();
    }
    return false;
  };

  const handleGradeClick = (grade: GradeOption) => {
    const matches = isRegisteredGrade(grade);

    if (matches) {
      // Student's own grade → go straight to their Dashboard
      handleSelection(() => navigate('/dashboard'));
    } else {
      // Different grade → open Free Resources filtered by the clicked gradeId
      const params = new URLSearchParams({
        access: 'FREE',
        gradeId: String(grade.id),
        gradeName: grade.name
      });
      handleSelection(() => navigate(`/materials?${params.toString()}`));
    }
  };

  const handleFreeQuestionPapersClick = () => {
    // Navigate to materials with Question Papers tab pre-selected and FREE filter.
    // No gradeId — backend returns all FREE papers; page groups them by grade.
    handleSelection(() =>
      navigate('/materials?type=Question%20Papers&access=FREE')
    );
  };

  const handleFreeResourcesClick = () => {
    // Navigate to free resources without a specific grade filter
    handleSelection(() =>
      navigate('/materials?access=FREE')
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="student-portal-theme nl-card sm:max-w-xl p-0 overflow-hidden backdrop-blur-sm rounded-2xl [&>button]:hidden"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header Section */}
        <div className="nl-hero-mesh relative bg-gradient-to-r from-nl-blue via-nl-sky to-nl-blue p-6 text-center text-white overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-nl-orange/30 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-nl-teal/30 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/20 shadow-inner backdrop-blur-md">
              <Compass className="h-8 w-8 animate-pulse text-nl-ink" />
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-nl-ink sm:text-3xl">
              Welcome to NextLevelICT
            </h2>
            <p className="mt-2 max-w-md text-sm font-medium text-nl-ink/75 sm:text-base">
              Please select where you would like to continue.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Dynamic Grades Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-nl-ink">
                <GraduationCap className="h-4 w-4 text-nl-teal" />
                <span>Select Your Grade</span>
              </div>
              {registeredGradeName && (
                <span className="flex items-center gap-1 rounded-full border border-nl-blue/25 bg-nl-blue/10 px-2.5 py-1 text-xs font-semibold text-nl-blue">
                  <CheckCircle2 className="h-3 w-3 text-nl-teal" />
                  Your Grade: {registeredGradeName}
                </span>
              )}
            </div>

            {loadingGrades ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-nl-line/70 bg-nl-mist py-8">
                <Loader2 className="h-8 w-8 animate-spin text-nl-teal" />
                <p className="text-xs font-medium text-nl-steel">Loading available grades...</p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-nl-orange/10 border border-nl-orange/30 text-nl-orange text-center space-y-3">
                <div className="flex items-center justify-center gap-2 font-medium text-sm">
                  <AlertTriangle className="h-4 w-4 text-nl-orange" />
                  <span>{error}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadGradesAndProfile}
                  className="bg-white border-nl-orange/40 hover:bg-nl-orange/15 text-nl-ink"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                {grades.map((grade) => {
                  const matches = isRegisteredGrade(grade);
                  return (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() => handleGradeClick(grade)}
                      className={`relative group flex h-20 flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                        matches
                          ? 'border-nl-teal bg-nl-teal/10 text-nl-ink shadow-soft ring-1 ring-nl-teal/50 hover:bg-nl-teal/15'
                          : 'border-nl-line bg-white text-nl-ink hover:border-nl-teal hover:bg-nl-blue/5 hover:shadow-lift'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-display font-bold text-sm sm:text-base group-hover:text-nl-blue">
                          {grade.name}
                        </span>
                        {matches && (
                          <Badge className="bg-nl-teal text-white text-[10px] px-1.5 py-0.5 font-bold">
                            Registered
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-between w-full text-xs text-nl-steel">
                        <span>{matches ? 'Go to Dashboard' : 'Resources'}</span>
                        <ArrowRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${matches ? 'text-nl-teal' : 'text-nl-teal'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-nl-line" aria-hidden="true" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-nl-steel font-semibold tracking-wider">
                Or Quick Access
              </span>
            </div>
          </div>

          {/* Quick Learning Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleFreeQuestionPapersClick}
              className="group flex items-start gap-3.5 rounded-2xl border border-nl-blue/25 bg-gradient-to-br from-nl-blue/5 to-nl-teal/5 p-4 text-left transition-all duration-200 hover:from-nl-blue/10 hover:to-nl-teal/10 hover:shadow-lift"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-nl-blue text-white flex items-center justify-center shadow-soft transition-transform group-hover:scale-105">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-sm font-bold text-nl-ink flex items-center gap-1.5">
                  Question Papers
                  {/* <Badge variant="outline" className="bg-nl-teal/10 text-nl-teal border-0 text-[10px]">
                    FREE
                  </Badge> */}
                </div>
                <p className="mt-0.5 text-xs text-nl-steel line-clamp-2">
                  View all free papers grouped by Grade
                </p>
              </div>
            </button>

          </div>
        </div>

        {/* Footer with Checkbox */}
        <div className="flex items-center justify-between border-t border-nl-line bg-nl-mist p-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShowToday"
              checked={dontShowToday}
              onCheckedChange={(checked) => setDontShowToday(Boolean(checked))}
              className="border-nl-steel data-[state=checked]:bg-nl-teal data-[state=checked]:border-nl-teal"
            />
            <Label
              htmlFor="dontShowToday"
              className="text-xs font-medium text-nl-steel cursor-pointer select-none"
            >
              Don't show again today
            </Label>
          </div>

          <span className="hidden text-[11px] font-medium text-nl-steel sm:inline">
            Select an option to continue
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
;
