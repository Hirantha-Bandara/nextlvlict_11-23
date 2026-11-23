import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Book,
  Calendar,
  FileCheck,
  FileVideo,
  Lock,
  Play,
  ShoppingCart,
  Unlock,
  Loader2,
  Download,
  Sparkles,
  DollarSign,
  Filter,
  X,
  GraduationCap,
  FileText,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import VideoPlayer from '@/components/VideoPlayer';
import { apiFetch } from '@/lib/utils';
import {
  portalItemVariants,
  StudentLoadingState,
  StudentPageHero,
  StudentPageShell
} from '@/components/StudentPortalLayout';
import AccessBadge from '@/components/ui/AccessBadge';

interface Recording {
  id: number;
  title: string;
  subject: string;
  date: string;
  duration: string;
  size: string;
  youtubeUrl?: string;
  accessType?: 'FREE' | 'PAID' | string;
  access_type?: 'FREE' | 'PAID' | string;
  price?: number;
  isUnlocked: boolean;
  hasRequested: boolean;
  isExpired?: boolean;
  isPaid?: boolean;
  expiresAt?: string;
  thumbnail_url?: string | null;
}

interface Note {
  id: number;
  title: string;
  subject: string;
  date: string;
  pages: number;
  format: string;
  size: string;
}

interface ResourceType {
  id: number;
  name: string;
}

interface Recording {
  id: number;
  title: string;
  subject: string;
  date: string;
  duration: string;
  size: string;
  youtubeUrl?: string;
  accessType?: 'FREE' | 'PAID' | string;
  access_type?: 'FREE' | 'PAID' | string;
  price?: number;
  isUnlocked: boolean;
  hasRequested: boolean;
}

interface Note {
  id: number;
  title: string;
  subject: string;
  date: string;
  pages: number;
  format: string;
  size: string;
}

interface Tute {
  id: number;
  title: string;
  subject?: string;
  grade?: string | { id: number; name: string };
  gradeId?: number;
  grade_id?: number | string;
  gradeName?: string;
  grade_name?: string;
  date?: string;
  description?: string;
  price: number;
  link?: string;
  download_url?: string;
  accessType?: 'FREE' | 'PAID' | string;
  access_type?: 'FREE' | 'PAID' | string;
  tuteTypeId?: number;
  tute_type_id?: number;
  tuteTypeName?: string;
  tute_type_name?: string;
  tuteType?: ResourceType | string;
  isPurchased?: boolean;
  hasRequested?: boolean;
  cover_image_url?: string | null;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  recordings?: Recording[];
  notes?: Note[];
  tutes?: Tute[];
  questionPapers?: Tute[];
  data?: Tute[];
  resourceTypes?: ResourceType[];
  tuteTypes?: ResourceType[];
}

interface StudentPaymentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface PendingTutePurchase {
  tuteId: number;
  title: string;
}

interface PendingRecordingPurchase {
  recordingId: number;
  title: string;
}

const PENDING_TUTE_PURCHASE_KEY = 'pendingTutePurchase';
const PENDING_RECORDING_PURCHASE_KEY = 'pendingRecordingPurchase';

const isTuteFree = (tute: Tute): boolean => {
  const at = (tute.accessType || tute.access_type || '').toUpperCase();
  return at === 'FREE' || tute.price === 0;
};

const isRecordingFree = (recording: Recording): boolean => {
  const at = (recording.accessType || recording.access_type || '').toUpperCase();
  return at === 'FREE' || recording.price === 0;
};

const ClassMaterials = () => {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [materialsByType, setMaterialsByType] = useState<Record<number, Tute[]>>({});
  const [currentVideo, setCurrentVideo] = useState<{ id: number; title: string; youtubeUrl: string } | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingTuteId, setProcessingTuteId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Filter state: 'ALL' | 'FREE' | 'PAID'
  const [accessFilter, setAccessFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
  // Grade name for display / client-side filtering (e.g. "Grade 06")
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string | null>(null);
  // Grade ID passed to the API so the backend returns the right grade's materials
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const getResourceTypeName = (tute: Tute): string => {
    if (typeof tute.tuteType === 'object' && tute.tuteType?.name) {
      return tute.tuteType.name;
    }
    if (typeof tute.tuteType === 'string' && tute.tuteType) {
      return tute.tuteType;
    }
    if (tute.tuteTypeName || tute.tute_type_name) {
      return tute.tuteTypeName || tute.tute_type_name || '';
    }
    const typeId = tute.tuteTypeId || tute.tute_type_id;
    if (typeId) {
      const found = resourceTypes.find(rt => rt.id === Number(typeId));
      if (found) return found.name;
    }
    return 'Resource';
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const accessParam = urlParams.get('access');
    // WelcomeModal sends ?gradeId=<numeric id>&gradeName=<display name>
    // Legacy support: also accept ?grade= (plain name, no id)
    const gradeIdParam = urlParams.get('gradeId');
    const gradeNameParam = urlParams.get('gradeName') || urlParams.get('grade');

    let initialAccess: 'ALL' | 'FREE' | 'PAID' = 'ALL';
    if (accessParam && ['FREE', 'PAID', 'ALL'].includes(accessParam.toUpperCase())) {
      initialAccess = accessParam.toUpperCase() as 'FREE' | 'PAID' | 'ALL';
      setAccessFilter(initialAccess);
    }

    if (gradeIdParam) {
      setSelectedGradeId(gradeIdParam);
    }
    if (gradeNameParam) {
      setSelectedGradeFilter(gradeNameParam);
    }

    fetchClassMaterials(initialAccess, gradeIdParam || undefined);

    const action = urlParams.get('action');
    const orderId = urlParams.get('order_id');
    const studentId = localStorage.getItem("studentId");

    if (action === 'paymentReturn' && orderId && studentId) {
      const isTutePayment = orderId.startsWith('TUTE_');
      const isRecordingPayment = orderId.startsWith('REC_');

      if (isTutePayment) {
        apiFetch(`TutesPaymentServlet?action=paymentReturn&studentId=${studentId}&order_id=${orderId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
        }).then(data => {
          if (data && data.success) {
            toast.success("Payment completed successfully!");
            fetchClassMaterials();
          }
        }).catch(error => {
          console.error('Error processing payment return:', error);
        });
      } else if (isRecordingPayment) {
        apiFetch(`RecordingsPaymentServlet?action=paymentReturn&studentId=${studentId}&order_id=${orderId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
        }).then(data => {
          if (data && data.success) {
            toast.success("Payment completed successfully!");
            fetchClassMaterials();
          }
        }).catch(error => {
          console.error('Error processing payment return:', error);
        });
      } else {
        apiFetch(`ClassFee?action=paymentReturn&studentId=${studentId}&order_id=${orderId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
        }).then(data => {
          if (data && data.success) {
            toast.success("Payment completed successfully!");
            fetchClassMaterials();
          }
        }).catch(error => {
          console.error('Error processing payment return:', error);
        });
      }

      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (action === 'paymentCancel') {
      localStorage.removeItem(PENDING_TUTE_PURCHASE_KEY);
      localStorage.removeItem(PENDING_RECORDING_PURCHASE_KEY);
      toast.error('Payment was cancelled');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate]);

  useEffect(() => {
    if (resourceTypes.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const typeParam = urlParams.get('type');
      if (typeParam) {
        const lower = typeParam.toLowerCase();
        const found = resourceTypes.find(rt => rt.name.toLowerCase().includes(lower) || lower.includes(rt.name.toLowerCase()));
        if (found) {
          setActiveTab(`type-${found.id}`);
        }
      }
    }
  }, [resourceTypes]);

  // Update countdown timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  const getTimeRemaining = (expiresAt: string): { hours: number; minutes: number; seconds: number; isExpired: boolean } => {
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diff = expiration.getTime() - now.getTime();

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, isExpired: false };
  };

  const formatCountdown = (expiresAt: string): string => {
    const { hours, minutes, seconds, isExpired } = getTimeRemaining(expiresAt);
    if (isExpired) return 'Expired';
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const fetchResourceTypes = async (): Promise<ResourceType[]> => {
    try {
      let response = await apiFetch('TutesServlet?action=getTuteTypes');
      if (!response.ok) {
        response = await apiFetch('TutesUploading?action=getTuteTypes');
      }
      if (!response.ok) {
        response = await apiFetch('TutesServlet?action=getTuteTypes');
      }
      if (response.ok) {
        const data: ApiResponse = await response.json();
        let list: ResourceType[] = [];
        if (Array.isArray(data)) list = data;
        else if (data && data.resourceTypes) list = data.resourceTypes;
        else if (data && data.tuteTypes) list = data.tuteTypes;

        if (list && list.length > 0) {
          setResourceTypes(list);
          return list;
        }
      }
    } catch (error) {
      console.error('Error fetching resource types:', error);
    }

    const fallback: ResourceType[] = [
      { id: 1, name: 'Tutes' },
      { id: 2, name: 'Question Papers' }
    ];
    setResourceTypes(fallback);
    return fallback;
  };

  const fetchTutesForType = async (typeId: number, selectedAccess?: string, gradeId?: string) => {
    try {
      const studentId = localStorage.getItem("studentId");
      const filterType = selectedAccess !== undefined ? selectedAccess : accessFilter;
      const gid = gradeId !== undefined ? gradeId : selectedGradeId;

      // Check if this type is Question Papers by name or by typeId=2
      const type = resourceTypes.find(rt => rt.id === typeId);
      const isQuestionPapers = typeId === 2 || type?.name.toLowerCase().includes('question') || type?.name.toLowerCase().includes('paper');

      let url: string;

      // Use Free API when access is FREE (no studentId)
      if (filterType === 'FREE') {
        if (isQuestionPapers) {
          // Question Papers use dedicated getFreeQuestionPapers endpoint
          // Do NOT send studentId, accessType, tuteTypeId, or empty gradeId
          if (gid) {
            url = `TutesServlet?action=getFreeQuestionPapers&gradeId=${encodeURIComponent(gid)}`;
          } else {
            // Load all FREE Question Papers - no parameters
            url = `TutesServlet?action=getFreeQuestionPapers`;
          }
        } else {
          // FREE Tutes use getFreeTutes with gradeId, accessType=FREE, and tuteTypeId
          url = `TutesServlet?action=getFreeTutes&gradeId=${encodeURIComponent(gid || '')}&accessType=FREE&tuteTypeId=${typeId}`;
        }
      } else {
        // Use Student API for ALL or PAID (with studentId)
        url = `TutesServlet?action=getTutes&studentId=${studentId}&tuteTypeId=${typeId}`;
        if (filterType && filterType !== 'ALL') {
          url += `&accessType=${encodeURIComponent(filterType)}`;
        }
        // Pass gradeId to the backend so it returns resources for the correct grade,
        // not the student's own registered grade.
        if (gid) {
          url += `&gradeId=${encodeURIComponent(gid)}`;
        }
      }

      const response = await apiFetch(url);
      if (response.ok) {
        const responseData: ApiResponse = await response.json();
        // Handle both tutes and questionPapers fields from API response
        const items: Tute[] = responseData.questionPapers || responseData.tutes || responseData.data || (Array.isArray(responseData) ? responseData as unknown as Tute[] : []);
        setMaterialsByType(prev => ({ ...prev, [typeId]: items }));
      } else {
        setMaterialsByType(prev => ({ ...prev, [typeId]: [] }));
      }
    } catch (error) {
      console.error(`Error fetching materials for type ${typeId}:`, error);
      setMaterialsByType(prev => ({ ...prev, [typeId]: [] }));
    }
  };

  const fetchClassMaterials = async (selectedAccess?: string, gradeId?: string) => {
    try {
      setLoading(true);
      const studentId = localStorage.getItem("studentId");
      const filterType = selectedAccess !== undefined ? selectedAccess : accessFilter;
      const gid = gradeId !== undefined ? gradeId : selectedGradeId;

      let recUrl: string;

      // Use Free API for recordings when access is FREE (no studentId)
      if (filterType === 'FREE') {
        recUrl = `RecordingsServlet?action=getFreeRecordings&gradeId=${encodeURIComponent(gid || '')}`;
      } else {
        // Use Student API for ALL or PAID (with studentId)
        recUrl = `RecordingsServlet?action=getRecordings&studentId=${studentId}`;
        if (filterType && filterType !== 'ALL') {
          recUrl += `&accessType=${encodeURIComponent(filterType)}`;
        }
        // Pass gradeId to recordings API as well
        if (gid) {
          recUrl += `&gradeId=${encodeURIComponent(gid)}`;
        }
      }

      const recordingsResponse = await apiFetch(recUrl);
      if (recordingsResponse.ok) {
        const responseData: ApiResponse = await recordingsResponse.json();
        if (responseData.success && responseData.recordings) {
          setRecordings(responseData.recordings);
        } else {
          setRecordings([]);
        }
      } else {
        setRecordings([]);
      }

      const loadedTypes = await fetchResourceTypes();

      // Check if a specific type is requested via URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const typeParam = urlParams.get('type');

      if (typeParam && loadedTypes.length > 0) {
        // Only load the requested type
        const lower = typeParam.toLowerCase();
        const found = loadedTypes.find(rt => rt.name.toLowerCase().includes(lower) || lower.includes(rt.name.toLowerCase()));
        if (found) {
          await fetchTutesForType(found.id, filterType, gid || undefined);
        }
      } else {
        // Load all types if no specific type requested
        for (const type of loadedTypes) {
          await fetchTutesForType(type.id, filterType, gid || undefined);
        }
      }

      setNotes([
        {
          id: 1,
          title: 'Calculus Formulas',
          subject: 'Mathematics',
          date: '2025-04-15',
          pages: 12,
          format: 'PDF',
          size: '1.5 MB'
        }
      ]);

    } catch (error) {
      toast.error('Error loading materials');
      console.error('Error:', error);
      setRecordings([]);
      setMaterialsByType({});
    } finally {
      setLoading(false);
    }
  };

  const handleAccessFilterChange = (filter: 'ALL' | 'FREE' | 'PAID') => {
    setAccessFilter(filter);
    fetchClassMaterials(filter, selectedGradeId || undefined);
  };

  const handleStreamVideo = (recording: Recording) => {
    const isFree = isRecordingFree(recording);
    if (!isFree && !recording.isUnlocked) {
      toast.error(`This recording is locked. Please request access for ${recording.subject} to watch it.`);
      return;
    }

    if (!recording.youtubeUrl) {
      toast.error("Video source not found.");
      return;
    }

    setCurrentVideo({
      id: recording.id,
      title: recording.title,
      youtubeUrl: recording.youtubeUrl
    });
    setIsVideoModalOpen(true);
  };

  const handleRequestUnlock = async (recordingId: number, subject: string) => {
    try {
      const studentId = localStorage.getItem("studentId");

      const response = await apiFetch(
        `RecordingRequestServlet?action=createRequest&studentId=${studentId}&recordingId=${recordingId}`,
        {
          method: 'GET',
        }
      );

      if (response.ok) {
        const responseData: ApiResponse = await response.json();

        if (responseData.success) {
          toast.success(`Request sent for ${subject}. Waiting for admin approval.`);

          setRecordings(prev => prev.map(rec =>
            rec.id === recordingId ? { ...rec, hasRequested: true } : rec
          ));
        } else {
          toast.error(responseData.message || 'Failed to send request');
        }
      } else {
        toast.error('Failed to send request');
      }
    } catch (error) {
      toast.error('Error sending request');
      console.error('Error:', error);
    }
  };

  const fetchStudentPaymentProfile = async (studentId: string): Promise<StudentPaymentProfile | null> => {
    try {
      const response = await apiFetch('StudentProfileServlet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.student) {
        return null;
      }

      const student = data.student;
      const line1 = student.address?.line1 || '';
      const line2 = student.address?.line2 || '';
      const city = student.address?.city || '';

      if (!student.firstName || !student.lastName || !student.email || !student.mobile || !line1 || !city) {
        return null;
      }

      return {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.mobile,
        address: [line1, line2].filter(Boolean).join(', '),
        city,
        country: 'Sri Lanka'
      };
    } catch (error) {
      console.error('Error fetching student payment profile:', error);
      return null;
    }
  };

  const handleBuyTute = async (tute: Tute) => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        toast.error('Please login again');
        navigate('/');
        return;
      }

      setProcessingTuteId(tute.id);

      const studentProfile = await fetchStudentPaymentProfile(studentId);
      if (!studentProfile) {
        toast.error('Complete your profile before purchasing a material.');
        return;
      }

      const orderId = `TUTE-${studentId}-${tute.id}-${Date.now()}`;
      const response = await apiFetch('TutesPaymentServlet?action=initiatePayment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          studentId,
          tuteId: String(tute.id),
          first_name: studentProfile.firstName,
          last_name: studentProfile.lastName,
          email: studentProfile.email,
          phone: studentProfile.phone,
          address: studentProfile.address,
          city: studentProfile.city,
          country: studentProfile.country,
          order_id: orderId,
          items: tute.title,
          currency: 'LKR',
          amount: tute.price.toFixed(2)
        }).toString()
      });

      const responseData = await response.json();

      if (responseData.success && responseData.paymentData) {
        localStorage.setItem(PENDING_TUTE_PURCHASE_KEY, JSON.stringify({
          tuteId: tute.id,
          title: tute.title
        }));

        submitToPayHere(responseData.paymentData);
      } else {
        toast.error(responseData.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Error initiating payment');
    } finally {
      setProcessingTuteId(null);
    }
  };

  const handleBuyRecording = async (recording: Recording) => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        toast.error('Please login again');
        navigate('/');
        return;
      }

      setProcessingTuteId(recording.id);

      const studentProfile = await fetchStudentPaymentProfile(studentId);
      if (!studentProfile) {
        toast.error('Complete your profile before purchasing a recording.');
        return;
      }

      const response = await apiFetch('RecordingsPaymentServlet?action=initiatePayment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          studentId,
          recordingId: String(recording.id),
          first_name: studentProfile.firstName,
          last_name: studentProfile.lastName,
          email: studentProfile.email,
          phone: studentProfile.phone,
          address: studentProfile.address,
          city: studentProfile.city,
          country: studentProfile.country,
          items: recording.title,
          currency: 'LKR',
          amount: (recording.price || 0).toFixed(2)
        }).toString()
      });

      const responseData = await response.json();

      if (responseData.success && responseData.paymentData) {
        localStorage.setItem(PENDING_RECORDING_PURCHASE_KEY, JSON.stringify({
          recordingId: recording.id,
          title: recording.title
        }));

        submitToPayHere(responseData.paymentData);
      } else {
        toast.error(responseData.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Error initiating payment');
    } finally {
      setProcessingTuteId(null);
    }
  };

  const submitToPayHere = (paymentData: Record<string, string>) => {
    try {
      const requiredParams = [
        'merchant_id',
        'return_url',
        'cancel_url',
        'notify_url',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'order_id',
        'items',
        'currency',
        'amount',
        'hash'
      ];

      const missingParams = requiredParams.filter(param => !paymentData[param]);
      if (missingParams.length > 0) {
        toast.error('Payment configuration incomplete');
        return;
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.payhere.lk/pay/checkout';
      form.style.display = 'none';

      requiredParams.forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);

      setTimeout(() => {
        form.submit();
      }, 100);

    } catch (error) {
      console.error('Error submitting to PayHere:', error);
      toast.error('Payment redirect failed');
    }
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideo(null);
  };

  const EmptyState = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-sky-50 text-[#0f5f8f]">
        <Icon className="h-7 w-7" />
      </div>
      <p className="font-semibold text-slate-950">{title}</p>
    </div>
  );

  // Flattened all tutes for stat calculations
  const allTutesList = useMemo(() => Object.values(materialsByType).flat(), [materialsByType]);
  const freeRecordings = useMemo(() => recordings.filter(isRecordingFree), [recordings]);
  const paidRecordings = useMemo(() => recordings.filter(r => !isRecordingFree(r)), [recordings]);
  const freeTutesAll = useMemo(() => allTutesList.filter(isTuteFree), [allTutesList]);
  const paidTutesAll = useMemo(() => allTutesList.filter(t => !isTuteFree(t)), [allTutesList]);

  if (loading) {
    return <StudentLoadingState title="Class Materials" message="Loading materials" />;
  }

  // Render Recording Card component
  const renderRecordingCard = (recording: Recording) => {
    const isFree = isRecordingFree(recording);
    const isExpired = recording.isExpired || (recording.expiresAt && getTimeRemaining(recording.expiresAt).isExpired);

    return (
      <motion.article
        key={recording.id}
        variants={portalItemVariants}
        className={`overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition ${isExpired ? 'border-red-200 opacity-75' : 'border-slate-200'}`}
      >
        <div className="relative">
          <img
            src={recording.thumbnail_url || "https://i.postimg.cc/tCBN16Dr/Untitled_1.jpg"}
            alt={`${recording.title} thumbnail`}
            className="h-44 w-full object-cover sm:h-52"
          />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            {/*<AccessBadge accessType={isFree ? 'FREE' : 'PAID'} />*/}
            {!isFree && (
              <Badge
                variant="outline"
                className={`flex items-center gap-1 ${
                  isExpired
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : recording.isUnlocked
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : recording.hasRequested
                        ? 'border-sky-200 bg-sky-50 text-sky-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                {isExpired ? <AlertTriangle className="h-3 w-3" /> : recording.isUnlocked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {isExpired ? 'Expired' : recording.isUnlocked ? 'Unlocked' : recording.hasRequested ? 'Pending Approval' : 'Locked'}
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <p className="text-sm font-semibold text-[#0f5f8f]">{recording.subject}</p>
            <h2 className="mt-1 text-lg font-bold text-slate-950">{recording.title}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              {formatDate(recording.date)}
            </p>
          </div>

          {!isFree && (
            <p className="text-2xl font-bold text-[#00796b]">
              {formatPrice(recording.price || 0)}
            </p>
          )}

          {/* Countdown timer for expiring recordings */}
          {!isFree && recording.isUnlocked && !recording.isPaid && recording.expiresAt && !isExpired && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Expires in:</span>
                <span className="font-bold">{formatCountdown(recording.expiresAt)}</span>
              </div>
            </div>
          )}

          {isFree ? (
            <Button className="h-12 w-full bg-emerald-600 text-white hover:bg-emerald-700 font-semibold" onClick={() => handleStreamVideo(recording)}>
              <Play className="h-4 w-4 mr-1" />
              Watch Free Video
            </Button>
          ) : (
            <>
              {isExpired ? (
                <div className="space-y-2">
                  <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    This recording has expired. Please purchase to regain access.
                  </p>
                  <Button
                    disabled={processingTuteId === recording.id}
                    className="h-12 w-full bg-[#0f5f8f] text-white hover:bg-[#0b4d75]"
                    onClick={() => handleBuyRecording(recording)}
                  >
                    {processingTuteId === recording.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Preparing Payment...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy Now - {formatPrice(recording.price || 0)}
                      </>
                    )}
                  </Button>
                </div>
              ) : !recording.isUnlocked && !recording.hasRequested ? (
                <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                  Purchase this recording or request access to unlock.
                </p>
              ) : recording.hasRequested && !recording.isUnlocked ? (
                <p className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-700">
                  Request submitted. Waiting for admin approval.
                </p>
              ) : null}

              {recording.isUnlocked && !isExpired ? (
                <Button className="h-12 w-full bg-[#0f5f8f] text-white hover:bg-[#0b4d75]" onClick={() => handleStreamVideo(recording)}>
                  <Play className="h-4 w-4 mr-1" />
                  Watch Video
                </Button>
              ) : recording.hasRequested && !recording.isUnlocked ? (
                <Button className="h-12 w-full bg-slate-300 text-white" disabled>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Request Pending
                </Button>
              ) : !isExpired && !recording.isUnlocked && !recording.hasRequested ? (
                <div className="space-y-2">
                  <Button
                    disabled={processingTuteId === recording.id}
                    className="h-12 w-full bg-[#0f5f8f] text-white hover:bg-[#0b4d75]"
                    onClick={() => handleBuyRecording(recording)}
                  >
                    {processingTuteId === recording.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Preparing Payment...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy Now - {formatPrice(recording.price || 0)}
                      </>
                    )}
                  </Button>
                  <Button
                    disabled={processingTuteId === recording.id}
                    variant="outline"
                    className="h-12 w-full border-[#00796b] text-[#00796b] hover:bg-[#00796b] hover:text-white"
                    onClick={() => handleRequestUnlock(recording.id, recording.subject)}
                  >
                    {processingTuteId === recording.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-4 w-4 mr-1" />
                        Request Access
                      </>
                    )}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </motion.article>
    );
  };

  // Render Resource Card component (Title, Description, Grade, Access Type, Resource Type, Price (only if PAID), Download/Open button)
  const renderTuteCard = (tute: Tute) => {
    const isFree = isTuteFree(tute);
    const typeName = getResourceTypeName(tute);
    const downloadLink = tute.link || tute.download_url || '#';
    const gradeVal = tute.gradeName || tute.grade_name || (typeof tute.grade === 'string' ? tute.grade : tute.grade?.name) || tute.subject || '';

    return (
      <motion.article
        key={tute.id}
        variants={portalItemVariants}
        className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between"
      >
        {tute.cover_image_url && <img src={tute.cover_image_url} alt={`${tute.title} cover`} className="h-40 w-full object-cover" />}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {gradeVal && (
                  <span className="text-xs font-semibold text-[#0f5f8f] bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100">
                    {gradeVal.toLowerCase().includes('grade') ? gradeVal : `Grade ${gradeVal}`}
                  </span>
                )}
                <Badge variant="outline" className="bg-[#0f5f8f]/10 text-[#0f5f8f] border-[#0f5f8f]/20 font-medium">
                  {typeName}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-slate-950 mt-1.5">{tute.title}</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AccessBadge accessType={isFree ? 'FREE' : 'PAID'} />
              {!isFree && (
                <Badge
                  variant="outline"
                  className={
                    tute.isPurchased
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : tute.hasRequested
                        ? 'border-sky-200 bg-sky-50 text-sky-700'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                  }
                >
                  {tute.isPurchased ? 'Purchased' : tute.hasRequested ? 'Pending' : 'Available'}
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {tute.date && (
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(tute.date)}
              </p>
            )}
            {!isFree && (
              <p className="text-2xl font-bold text-[#00796b]">
                {formatPrice(tute.price)}
              </p>
            )}
            {tute.description && (
              <p className="text-sm leading-relaxed text-slate-600">{tute.description}</p>
            )}
          </div>
        </div>

        <div className="mt-5">
          {isFree ? (
            <Button
              className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center justify-center gap-2"
              onClick={() => {
                if (downloadLink && downloadLink !== '#') {
                  window.open(downloadLink, '_blank');
                } else {
                  toast.error('Download link not available');
                }
              }}
            >
              <Download className="h-4 w-4" />
              Download {typeName}
            </Button>
          ) : tute.isPurchased ? (
            <Button className="h-11 w-full bg-[#00796b] text-white hover:bg-[#00695c] flex items-center justify-center gap-2" onClick={() => window.open(downloadLink, '_blank')}>
              <FileCheck className="h-4 w-4" />
              Access {typeName}
            </Button>
          ) : tute.hasRequested ? (
            <Button className="h-11 w-full bg-slate-300 text-white" disabled>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Purchase Pending
            </Button>
          ) : (
            <Button
              disabled={processingTuteId === tute.id}
              className="h-11 w-full bg-[#0f5f8f] text-white hover:bg-[#0b4d75]"
              onClick={() => handleBuyTute(tute)}
            >
              {processingTuteId === tute.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Preparing Payment...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Buy Now - {formatPrice(tute.price)}
                </>
              )}
            </Button>
          )}
        </div>
      </motion.article>
    );
  };

  const defaultTabValue = resourceTypes.length > 0 ? `type-${resourceTypes[0].id}` : 'recordings';
  const currentTab = activeTab || defaultTabValue;

  const matchesGrade = (tute: Tute, filterGrade: string | null): boolean => {
    if (!filterGrade) return true;
    const rawGrade = tute.gradeName || tute.grade_name || (typeof tute.grade === 'string' ? tute.grade : tute.grade?.name) || '';
    if (!rawGrade) return true;
    const normRaw = rawGrade.toLowerCase().trim();
    const normFilter = filterGrade.toLowerCase().trim();
    if (normRaw === normFilter) return true;
    const rawNum = normRaw.replace(/\D/g, '');
    const filterNum = normFilter.replace(/\D/g, '');
    return Boolean(rawNum && filterNum && rawNum === filterNum);
  };

  const renderGroupedByGrade = (items: Tute[]) => {
    if (items.length === 0) {
      return <EmptyState icon={FileText} title="No papers available." />;
    }

    // Group by backend subject first (e.g. "2027 A/L", "Grade 06"),
    // then fallback to grade fields if subject is missing.
    const groups: Map<string, { gradeKey: string; gradeName: string; items: Tute[] }> = new Map();

    items.forEach(tute => {
      const subjectLabel = (tute.subject || '').trim();
      const gradeNameFromFields =
        (typeof tute.grade === 'object' && tute.grade?.name)
          ? tute.grade.name
          : tute.gradeName || tute.grade_name || (typeof tute.grade === 'string' ? tute.grade : '');

      const gradeName = (subjectLabel || gradeNameFromFields || 'General / Other').trim();
      const gradeIdFromFields =
        (typeof tute.grade === 'object' && tute.grade?.id)
          ? String(tute.grade.id)
          : tute.gradeId
            ? String(tute.gradeId)
            : tute.grade_id
              ? String(tute.grade_id)
              : null;

      // Prefer subject-based grouping to keep "2027 A/L" and "Grade 06" in separate sections.
      const groupKey = subjectLabel
        ? `subject:${subjectLabel.toLowerCase()}`
        : gradeIdFromFields
          ? `grade-id:${gradeIdFromFields}`
          : `grade-name:${gradeName.toLowerCase()}`;

      if (!groups.has(groupKey)) {
        groups.set(groupKey, { gradeKey: groupKey, gradeName, items: [] });
      }
      groups.get(groupKey)!.items.push(tute);
    });

    // Convert groups to array and sort by display name.
    const sortedGroups = Array.from(groups.values()).sort((a, b) => {
      return a.gradeName.localeCompare(b.gradeName, undefined, { numeric: true, sensitivity: 'base' });
    });

    return (
      <div className="space-y-8">
        {sortedGroups.map(({ gradeKey, gradeName, items: gradeItems }) => (
          <section key={gradeKey} className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <GraduationCap className="h-5 w-5 text-[#00afa1]" />
              <h2 className="text-lg font-bold text-slate-900">{gradeName}</h2>
              <Badge className="bg-[#0f5f8f] text-white border-0">{gradeItems.length} {gradeItems.length === 1 ? 'Paper' : 'Papers'}</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gradeItems.map(renderTuteCard)}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <StudentPageShell title="Class Materials">
      <StudentPageHero
        eyebrow="Study resources"
        title="Study materials, question papers, and recordings in one place."
        description="Access free study resources instantly or view locked paid materials."
        icon={Book}
      />

      {/* Active Filter Banner */}
      {(selectedGradeFilter || accessFilter !== 'ALL') && (
        <div className="flex items-center justify-between gap-3 bg-sky-50 border border-sky-200 p-3.5 rounded-xl text-sm text-[#0f5f8f] mb-4 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 shrink-0 text-[#00afa1]" />
            <span className="font-bold text-slate-800">Active Filters:</span>
            {selectedGradeFilter && (
              <Badge variant="outline" className="bg-white text-[#0f5f8f] border-sky-300 gap-1.5 font-bold py-1">
                <GraduationCap className="h-3.5 w-3.5 text-[#00afa1]" />
                Grade: {selectedGradeFilter}
                <button type="button" onClick={() => setSelectedGradeFilter(null)} className="ml-1 hover:text-red-500">
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            )}
            {accessFilter !== 'ALL' && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 font-bold py-1">
                Access: {accessFilter}
              </Badge>
            )}
          </div>
          {selectedGradeFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedGradeFilter(null)}
              className="h-8 text-xs text-[#0f5f8f] hover:bg-sky-100 font-semibold"
            >
              Clear Grade Filter
            </Button>
          )}
        </div>
      )}

      {/* Top Stats */}
      <motion.section variants={portalItemVariants} className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Recordings', value: recordings.length, icon: FileVideo, tone: 'bg-sky-50 text-[#0f5f8f]' },
          { label: 'Total Materials', value: allTutesList.length, icon: ShoppingCart, tone: 'bg-teal-50 text-[#00796b]' },
          { label: 'Free Resources', value: freeRecordings.length + freeTutesAll.length, icon: Sparkles, tone: 'bg-emerald-50 text-emerald-700' },
          { label: 'Paid Resources', value: paidRecordings.length + paidTutesAll.length, icon: DollarSign, tone: 'bg-blue-50 text-blue-700' }
        ].map((item) => (
          <Card key={item.label} className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-md ${item.tone}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-slate-950">{item.value}</p>
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.section>

      <motion.section variants={portalItemVariants}>
        <Tabs value={currentTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`mb-4 grid h-auto w-full grid-cols-${Math.min(resourceTypes.length + 1, 5)} rounded-lg bg-white p-1 shadow-sm`}>
            {resourceTypes.map((type) => {
              const typeItems = materialsByType[type.id] || [];
              const isQuestionPapers = type.id === 2 || type.name.toLowerCase().includes('paper') || type.name.toLowerCase().includes('question');

              // For Free Question Papers, show total count without grade filtering
              const filteredTypeItems = (isQuestionPapers && accessFilter === 'FREE')
                ? typeItems
                : (selectedGradeFilter ? typeItems.filter(t => matchesGrade(t, selectedGradeFilter)) : typeItems);

              return (
                <TabsTrigger
                  key={type.id}
                  value={`type-${type.id}`}
                  className="h-11 gap-2 data-[state=active]:bg-[#0f5f8f] data-[state=active]:text-white font-medium"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {type.name} ({filteredTypeItems.length})
                </TabsTrigger>
              );
            })}
            <TabsTrigger
              value="recordings"
              className="h-11 gap-2 data-[state=active]:bg-[#0f5f8f] data-[state=active]:text-white font-medium"
            >
              <FileVideo className="h-4 w-4" />
              Recordings ({recordings.length})
            </TabsTrigger>
          </TabsList>

          {/* DYNAMIC RESOURCE TYPE TABS CONTENT */}
          {resourceTypes.map((type) => {
            const rawItems = materialsByType[type.id] || [];
            const isQuestionPapers = type.id === 2 || type.name.toLowerCase().includes('paper') || type.name.toLowerCase().includes('question');

            // Check if this tab was accessed via the Question Papers URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const typeParam = urlParams.get('type');
            
            // If URL has type parameter that includes "question" and access is FREE, 
            // and this is the Question Papers type (type.id === 2), group by grade
            // This ensures Question Papers from WelcomeModal always group by grade
            const shouldGroupFromUrl = typeParam && typeParam.toLowerCase().includes('question') && 
              accessFilter === 'FREE' && type.id === 2;

            // For Free Question Papers, do NOT apply grade filtering - show all papers grouped by grade
            // For other types, apply grade filter if selected
            // If accessed via Question Papers URL parameter, also don't filter by grade
            const items = (isQuestionPapers && accessFilter === 'FREE') || shouldGroupFromUrl
              ? rawItems
              : (selectedGradeFilter ? rawItems.filter(t => matchesGrade(t, selectedGradeFilter)) : rawItems);

            const freeItems = items.filter(isTuteFree);
            const paidItems = items.filter(t => !isTuteFree(t));

            // For Question Papers with FREE access, always group by grade
            // Also group if accessed via Question Papers URL parameter (regardless of resource type metadata)
            const shouldGroupByGrade = shouldGroupFromUrl || (isQuestionPapers && accessFilter === 'FREE');

            return (
              <TabsContent key={type.id} value={`type-${type.id}`}>
                {items.length === 0 ? (
                  <EmptyState icon={ShoppingCart} title={`No ${type.name.toLowerCase()} available.`} />
                ) : shouldGroupByGrade ? (
                  // Group Question Papers by Grade - show ALL papers without grade filtering
                  renderGroupedByGrade(freeItems)
                ) : accessFilter === 'ALL' ? (
                  <div className="space-y-8">
                    {/* FREE RESOURCES SECTION */}
                    {freeItems.length > 0 && (
                      <div>
                        {/* <div className="flex items-center gap-2 mb-4 border-b pb-2">
                          <Sparkles className="h-5 w-5 text-emerald-600" />
                          <h3 className="text-lg font-bold text-slate-900">Free {type.name}</h3>
                          <Badge className="bg-emerald-100 text-emerald-800 border-0">{freeItems.length}</Badge>
                        </div> */}
                        {isQuestionPapers ? renderGroupedByGrade(freeItems) : (
                          <div className="grid gap-4 md:grid-cols-2">
                            {freeItems.map(renderTuteCard)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* PAID RESOURCES SECTION */}
                    {paidItems.length > 0 && (
                      <div>
                        {/* <div className="flex items-center gap-2 mb-4 border-b pb-2">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-bold text-slate-900">Paid {type.name}</h3>
                          <Badge className="bg-blue-100 text-blue-800 border-0">{paidItems.length}</Badge>
                        </div> */}
                        <div className="grid gap-4 md:grid-cols-2">
                          {paidItems.map(renderTuteCard)}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map(renderTuteCard)}
                  </div>
                )}
              </TabsContent>
            );
          })}

          {/* RECORDINGS TAB CONTENT */}
          <TabsContent value="recordings">
            {recordings.length === 0 ? (
              <EmptyState icon={FileVideo} title="No recordings available." />
            ) : accessFilter === 'ALL' ? (
              <div className="space-y-8">
                {/* FREE RECORDINGS SECTION */}
                {freeRecordings.length > 0 && (
                  <div>
                    {/* <div className="flex items-center gap-2 mb-3 border-b pb-2">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      <h3 className="text-lg font-bold text-slate-900">Free Recordings</h3>
                      <Badge className="bg-emerald-100 text-emerald-800 border-0">{freeRecordings.length}</Badge>
                    </div> */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {freeRecordings.map(renderRecordingCard)}
                    </div>
                  </div>
                )}

                {/* PAID RECORDINGS SECTION */}
                {paidRecordings.length > 0 && (
                  <div>
                    {/* <div className="flex items-center gap-2 mb-3 border-b pb-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-slate-900">Paid Recordings</h3>
                      <Badge className="bg-blue-100 text-blue-800 border-0">{paidRecordings.length}</Badge>
                    </div> */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {paidRecordings.map(renderRecordingCard)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {recordings.map(renderRecordingCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.section>

      {currentVideo && (
        <VideoPlayer
          videoUrl={currentVideo.youtubeUrl}
          title={currentVideo.title}
          isOpen={isVideoModalOpen}
          onClose={closeVideoModal}
        />
      )}
    </StudentPageShell>
  );
};

export default ClassMaterials;
