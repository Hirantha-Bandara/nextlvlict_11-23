import { SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { Calendar, MapPin, Download, CheckCircle, Loader2 } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Events() {
  const { events, eventsLoading } = usePortfolioData();
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    grade: '',
    nic: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiating' | 'processing' | 'success' | 'failed'>('idle');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    // If the date is already in a readable format (like "15th June 2023"), return it as-is
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.contactNumber.trim() !== '' && 
           formData.grade.trim() !== '';
  };

  const handleInitiateRegistration = async () => {
    if (!selectedEvent) return;
    
    setIsSubmitting(true);
    setPaymentStatus('initiating');

    try {
      const response = await fetch('/nextlvlict_war/EventRegistrationServlet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'initiateRegistration',
          eventId: selectedEvent.id.toString(),
          name: formData.name,
          contactNumber: formData.contactNumber,
          grade: formData.grade,
          nic: formData.nic,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      const result = JSON.parse(responseText);
      
      if (result.success) {
        setRegistrationResult(result);
        await handleInitiatePayment(result.registrationId);
      } else {
        alert(result.message || 'Registration failed');
        setIsSubmitting(false);
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
      setIsSubmitting(false);
      setPaymentStatus('failed');
    }
  };

  const handleInitiatePayment = async (registrationId: number) => {
    try {
      const response = await fetch('/nextlvlict_war/EventRegistrationServlet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'initiatePayment',
          registrationId: registrationId.toString(),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Handle free events (no payment required)
        if (result.qrCodeData) {
          setPaymentStatus('success');
          setRegistrationNumber(result.registrationNumber);
          setQrCodeData(result.qrCodeData);
          setIsSubmitting(false);
        } 
        // Handle paid events (payment required)
        else if (result.paymentData) {
          setPaymentStatus('processing');
          initiatePayHerePayment(result.paymentData);
        } else {
          alert(result.message || 'Payment initiation failed');
          setIsSubmitting(false);
          setPaymentStatus('failed');
        }
      } else {
        alert(result.message || 'Payment initiation failed');
        setIsSubmitting(false);
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('An error occurred during payment initiation');
      setIsSubmitting(false);
      setPaymentStatus('failed');
    }
  };

  const initiatePayHerePayment = (paymentData: any) => {
    // Create PayHere checkout form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.checkout_url;

    const fields = [
      'merchant_id', 'return_url', 'cancel_url', 'notify_url',
      'order_id', 'items', 'amount', 'currency', 'hash',
      'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'country',
      'custom_1', 'custom_2'
    ];

    fields.forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field;
      input.value = paymentData[field] || '';
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleDownloadQR = () => {
    if (!qrCodeData) return;
    
    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = `qr_${registrationNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check for payment return on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const registrationId = urlParams.get('registrationId');

    if (action === 'paymentReturn' && registrationId) {
      // In a real implementation, you would verify the payment status
      // For now, we'll show a success state
      setPaymentStatus('success');
      setRegistrationNumber('EVT' + Date.now());
      // In production, fetch the actual QR code from the server
      setQrCodeData('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <section id="events" className="section-pad bg-surface">
      <div className="container-page flex flex-col gap-12 items-center">
        <SectionHeading eyebrow="Events" title={<>Upcoming <span className="text-gradient-navy">events & workshops</span></>} description="Join our ICT seminars, workshops, and special events to enhance your learning experience." />

        {eventsLoading ? (
          /* Skeleton grid while fetching live data */
          <div className="grid gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-soft h-64 sm:h-80 animate-pulse rounded-xl sm:rounded-3xl bg-muted" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
          </div>
        ) : (
          <Stagger className={events.length === 1 ? "w-full max-w-2xl" : "grid gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"}>
            {events.map((event) => (
              <StaggerItem key={event.id} className="h-full">
                <article
                  className="card-soft flex h-full flex-col overflow-hidden rounded-xl sm:rounded-3xl cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2">{event.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">{event.description}</p>

                    <div className="mt-auto space-y-2 pt-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      {event.fee && (
                        <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {event.fee}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedEvent.image && (
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  {selectedEvent.fee && (
                    <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {selectedEvent.fee}
                    </div>
                  )}
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-base">{selectedEvent.description}</p>
                  {selectedEvent.fullDescription && (
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedEvent.fullDescription }}
                      className="mt-4"
                    />
                  )}
                </div>

                {!showRegistrationForm && !registrationResult && (
                  <Button 
                    onClick={() => setShowRegistrationForm(true)}
                    className="w-full mt-6"
                    size="lg"
                  >
                    Register for Event
                  </Button>
                )}

                {showRegistrationForm && (
                  <div className="mt-6 space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Registration Details</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Enter your full name"
                          disabled={isSubmitting || paymentStatus === 'processing'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact">Contact Number *</Label>
                        <Input
                          id="contact"
                          value={formData.contactNumber}
                          onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                          placeholder="07xxxxxxxxx"
                          disabled={isSubmitting || paymentStatus === 'processing'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="grade">Grade *</Label>
                        <Input
                          id="grade"
                          value={formData.grade}
                          onChange={(e) => setFormData({...formData, grade: e.target.value})}
                          placeholder="e.g., Grade 10, Grade 11"
                          disabled={isSubmitting || paymentStatus === 'processing'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nic">NIC (Optional)</Label>
                        <Input
                          id="nic"
                          value={formData.nic}
                          onChange={(e) => setFormData({...formData, nic: e.target.value})}
                          placeholder="Enter NIC number"
                          disabled={isSubmitting || paymentStatus === 'processing'}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => setShowRegistrationForm(false)}
                        variant="outline"
                        disabled={isSubmitting || paymentStatus === 'processing'}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleInitiateRegistration}
                        disabled={!isFormValid() || isSubmitting || paymentStatus === 'processing'}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                        ) : (
                          'Proceed to Payment'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {paymentStatus === 'processing' && (
                  <div className="mt-6 text-center py-8 border-t">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Processing payment...</p>
                  </div>
                )}

                {paymentStatus === 'success' && qrCodeData && (
                  <div className="mt-6 space-y-4 border-t pt-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Registration Successful!</span>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Registration Number:</p>
                      <p className="text-lg font-mono font-bold">{registrationNumber}</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <img src={qrCodeData} alt="QR Code" className="w-48 h-48" />
                      <Button
                        onClick={handleDownloadQR}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download QR Code
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        setShowRegistrationForm(false);
                        setRegistrationResult(null);
                        setPaymentStatus('idle');
                        setQrCodeData(null);
                        setRegistrationNumber(null);
                        setFormData({ name: '', contactNumber: '', grade: '', nic: '' });
                      }}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                )}

                {paymentStatus === 'failed' && (
                  <div className="mt-6 space-y-4 border-t pt-4">
                    <div className="text-red-600 font-semibold">Payment Failed</div>
                    <p className="text-sm text-muted-foreground">Your payment could not be processed. Please try again.</p>
                    <Button
                      onClick={() => {
                        setPaymentStatus('idle');
                        setRegistrationResult(null);
                      }}
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
