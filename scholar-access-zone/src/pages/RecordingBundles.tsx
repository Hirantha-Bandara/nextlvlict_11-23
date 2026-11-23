import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  Loader2,
  Filter,
  ShoppingCart,
  Play,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getYouTubeEmbedUrl } from '@/lib/youtube';
import {
  StudentLoadingState,
  StudentPageHero,
  StudentPageShell
} from '@/components/StudentPortalLayout';
import AccessBadge from '@/components/ui/AccessBadge';
import BundleCard from '@/components/BundleCard';

interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  accessType?: 'FREE' | 'PAID' | string;
  access_type?: 'FREE' | 'PAID' | string;
  gradeId?: number;
  gradeName?: string;
  thumbnail_url?: string | null;
  created_at?: string;
}

interface PurchasedBundle {
  id: number;
  bundleId: number;
  title: string;
  description: string;
  price: number;
  accessType?: 'FREE' | 'PAID' | string;
  gradeId?: number;
  gradeName?: string;
  thumbnail_url?: string | null;
  purchaseDate: string;
  paymentStatus: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  bundles?: Bundle[];
  purchasedBundles?: PurchasedBundle[];
  data?: any;
}

interface BundleLesson {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl?: string | null;
  displayOrder: number;
}

const PENDING_BUNDLE_PURCHASE_KEY = 'pendingBundlePurchase';

const isBundleFree = (bundle: Bundle): boolean => {
  const at = (bundle.accessType || bundle.access_type || '').toUpperCase();
  return at === 'FREE' || bundle.price === 0;
};

const RecordingBundles = () => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [purchasedBundles, setPurchasedBundles] = useState<PurchasedBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingBundleId, setProcessingBundleId] = useState<number | null>(null);

  // Filter state: 'ALL' | 'FREE' | 'PAID'
  const [accessFilter, setAccessFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
  // Grade name for display / client-side filtering
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string | null>(null);
  // Grade ID passed to the API
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('available');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingBundle, setViewingBundle] = useState<Bundle | null>(null);
  const [bundleLessons, setBundleLessons] = useState<BundleLesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    fetchBundles();
    fetchPurchasedBundles();

    const urlParams = new URLSearchParams(window.location.search);
    const accessParam = urlParams.get('access');
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

    // Handle payment return from backend redirect
    const action = urlParams.get('action');
    const orderId = urlParams.get('order_id');
    const studentId = localStorage.getItem("studentId");

    if (action === 'paymentReturn' && orderId && orderId.startsWith('BUNDLE_')) {
      // Backend has already processed the payment via notify_url or fallback
      // Just refresh the data and show success message
      toast.success("Bundle payment completed successfully!");
      fetchBundles();
      fetchPurchasedBundles();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (action === 'paymentCancel') {
      localStorage.removeItem(PENDING_BUNDLE_PURCHASE_KEY);
      toast.error('Payment was cancelled');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate]);

  const fetchBundles = async (selectedAccess?: string, gradeId?: string) => {
    try {
      setLoading(true);
      const filterType = selectedAccess !== undefined ? selectedAccess : accessFilter;
      const gid = gradeId !== undefined ? gradeId : selectedGradeId;

      const studentId = localStorage.getItem("studentId");
      let url = studentId
        ? `RecordingBundleServlet?action=getAvailableBundlesForStudent&studentId=${studentId}`
        : 'RecordingBundleServlet?action=getAll';

      const response = await apiFetch(url);
      if (response.ok) {
        const responseData: ApiResponse = await response.json();
        if (responseData.success && responseData.bundles && Array.isArray(responseData.bundles)) {
          setBundles(responseData.bundles);
        } else {
          setBundles([]);
        }
      } else {
        setBundles([]);
      }
    } catch (error) {
      toast.error('Error loading bundles');
      console.error('Error:', error);
      setBundles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchasedBundles = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) return;

      const response = await apiFetch(`RecordingBundleServlet?action=getStudentBundles&studentId=${studentId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const responseData: ApiResponse = await response.json();
        if (responseData.success && responseData.bundles && Array.isArray(responseData.bundles)) {
          setPurchasedBundles(responseData.bundles);
        } else {
          setPurchasedBundles([]);
        }
      }
    } catch (error) {
      console.error('Error fetching purchased bundles:', error);
      setPurchasedBundles([]);
    }
  };

  const handleAccessFilterChange = (filter: 'ALL' | 'FREE' | 'PAID') => {
    setAccessFilter(filter);
    fetchBundles(filter, selectedGradeId || undefined);
  };

  const fetchStudentPaymentProfile = async (studentId: string) => {
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

  const handleBuyBundle = async (bundle: Bundle) => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        toast.error('Please login again');
        navigate('/');
        return;
      }

      setProcessingBundleId(bundle.id);

      const studentProfile = await fetchStudentPaymentProfile(studentId);
      if (!studentProfile) {
        toast.error('Complete your profile before purchasing a bundle.');
        return;
      }

      const orderId = `BUNDLE-${studentId}-${bundle.id}-${Date.now()}`;
      const response = await apiFetch('BundlePaymentServlet?action=initiatePayment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          studentId,
          bundleId: String(bundle.id),
          first_name: studentProfile.firstName,
          last_name: studentProfile.lastName,
          email: studentProfile.email,
          phone: studentProfile.phone,
          address: studentProfile.address,
          city: studentProfile.city,
          country: studentProfile.country,
          order_id: orderId,
          items: bundle.title,
          currency: 'LKR',
          amount: bundle.price.toFixed(2)
        }).toString()
      });

      const responseData = await response.json();

      if (responseData.success && responseData.paymentData) {
        localStorage.setItem(PENDING_BUNDLE_PURCHASE_KEY, JSON.stringify({
          bundleId: bundle.id,
          title: bundle.title
        }));

        submitToPayHere(responseData.paymentData);
      } else {
        toast.error(responseData.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Error initiating payment');
    } finally {
      setProcessingBundleId(null);
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

  const handleViewBundle = async (bundle: Bundle) => {
    setViewingBundle(bundle);
    setLoadingLessons(true);
    setIsViewDialogOpen(true);

    try {
      const response = await apiFetch(`RecordingBundleServlet?action=getBundleLessons&bundle_id=${bundle.id}`);
      if (response.ok) {
        const responseData: ApiResponse = await response.json();
        if (responseData.success && responseData.data && Array.isArray(responseData.data)) {
          setBundleLessons(responseData.data);
        } else {
          setBundleLessons([]);
          toast.error('No lessons found in this bundle');
        }
      } else {
        setBundleLessons([]);
        toast.error('Failed to load bundle lessons');
      }
    } catch (error) {
      console.error('Error fetching bundle lessons:', error);
      toast.error('Error loading bundle lessons');
      setBundleLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  // Filtered bundles
  const filteredBundles = useMemo(() => {
    return bundles.filter(bundle => {
      if (accessFilter !== 'ALL') {
        const isFree = isBundleFree(bundle);
        if (accessFilter === 'FREE' && !isFree) return false;
        if (accessFilter === 'PAID' && isFree) return false;
      }
      if (selectedGradeFilter && bundle.gradeName !== selectedGradeFilter) {
        return false;
      }
      return true;
    });
  }, [bundles, accessFilter, selectedGradeFilter]);

  const freeBundles = useMemo(() => filteredBundles.filter(isBundleFree), [filteredBundles]);
  const paidBundles = useMemo(() => filteredBundles.filter(b => !isBundleFree(b)), [filteredBundles]);

  if (loading) {
    return <StudentLoadingState title="Recording Bundles" message="Loading bundles" />;
  }

  return (
    <StudentPageShell>
      <StudentPageHero
        title="Recording Bundles"
        description="Save money by purchasing class recording bundles"
        icon={Package}
      />

      <div className="space-y-6">
        {/* Access Filter */}
        {/*<div className="flex items-center gap-2 bg-white p-4 rounded-2xl border border-nl-line">*/}
        {/*  <Filter className="h-4 w-4 text-nl-steel shrink-0" />*/}
        {/*  <div className="flex gap-2">*/}
        {/*    <Button*/}
        {/*      variant={accessFilter === 'ALL' ? 'default' : 'outline'}*/}
        {/*      size="sm"*/}
        {/*      onClick={() => handleAccessFilterChange('ALL')}*/}
        {/*    >*/}
        {/*      All Bundles*/}
        {/*    </Button>*/}
        {/*    <Button*/}
        {/*      variant={accessFilter === 'FREE' ? 'default' : 'outline'}*/}
        {/*      size="sm"*/}
        {/*      onClick={() => handleAccessFilterChange('FREE')}*/}
        {/*    >*/}
        {/*      Free*/}
        {/*    </Button>*/}
        {/*    <Button*/}
        {/*      variant={accessFilter === 'PAID' ? 'default' : 'outline'}*/}
        {/*      size="sm"*/}
        {/*      onClick={() => handleAccessFilterChange('PAID')}*/}
        {/*    >*/}
        {/*      Paid*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 rounded-2xl bg-nl-mist p-1">
            <TabsTrigger value="available" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-nl-blue data-[state=active]:shadow-soft">
              <ShoppingCart className="h-4 w-4" />
              Available Bundles ({filteredBundles.length})
            </TabsTrigger>
            <TabsTrigger value="purchased" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-nl-blue data-[state=active]:shadow-soft">
              <Play className="h-4 w-4" />
              My Bundles ({purchasedBundles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            {filteredBundles.length === 0 ? (
              <div className="nl-card p-8 text-center">
                <Package className="mx-auto mb-4 h-14 w-14 text-nl-steel" />
                <p className="font-display font-semibold text-nl-ink">No bundles found</p>
                <p className="mt-1 text-sm text-nl-steel">
                  {accessFilter === 'FREE' ? 'No free bundles available' :
                   accessFilter === 'PAID' ? 'No paid bundles available' :
                   'No bundles available at the moment'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBundles.map(bundle => {
                  const isPurchased = purchasedBundles.some(pb => pb.bundleId === bundle.id);
                  return (
                    <BundleCard
                      key={bundle.id}
                      bundle={bundle}
                      isPurchased={isPurchased}
                      onPurchase={handleBuyBundle}
                      onView={handleViewBundle}
                      processingId={processingBundleId}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="purchased">
            {purchasedBundles.length === 0 ? (
              <div className="nl-card p-8 text-center">
                <ShoppingCart className="mx-auto mb-4 h-14 w-14 text-nl-steel" />
                <p className="font-display font-semibold text-nl-ink">No purchased bundles</p>
                <p className="mt-1 text-sm text-nl-steel">
                  You haven't purchased any bundles yet
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {purchasedBundles.map(bundle => (
                  <BundleCard
                    key={bundle.id}
                    bundle={{
                      id: bundle.bundleId,
                      title: bundle.title,
                      description: bundle.description,
                      price: bundle.price,
                      accessType: bundle.accessType,
                      gradeId: bundle.gradeId,
                      gradeName: bundle.gradeName,
                      thumbnail_url: bundle.thumbnail_url
                    }}
                    isPurchased={true}
                    onPurchase={handleBuyBundle}
                    onView={handleViewBundle}
                    processingId={processingBundleId}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bundle Lessons View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingBundle?.title}</DialogTitle>
            <DialogDescription>
              {viewingBundle?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {loadingLessons ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-nl-blue" />
                <span className="ml-2 text-nl-steel">Loading lessons...</span>
              </div>
            ) : bundleLessons.length === 0 ? (
              <div className="text-center py-8 text-nl-steel">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No lessons available in this bundle</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bundleLessons.map((lesson, index) => (
                  <div key={lesson.id} className="nl-card overflow-hidden">
                    <div className="bg-nl-mist px-4 py-3 border-b border-nl-line/70">
                      <h3 className="font-display font-semibold text-nl-ink">
                        {index + 1}. {lesson.title}
                      </h3>
                      {lesson.description && (
                        <p className="text-sm text-nl-steel mt-1">{lesson.description}</p>
                      )}
                    </div>
                    <div className="aspect-video bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(lesson.youtubeUrl)}
                        title={lesson.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </StudentPageShell>
  );
};

export default RecordingBundles;
