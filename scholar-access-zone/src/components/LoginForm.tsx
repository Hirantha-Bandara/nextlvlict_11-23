import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, Phone } from "lucide-react";
import { apiFetch } from "@/lib/utils";
import { storeStudentIdentity } from "@/lib/auth";
import type { StudentDTO, StudentLoginResponse } from "@/types/api";
import WelcomeModal, { isModalSkippedToday } from '@/components/WelcomeModal';

const getLoginErrorMessage = (
  data: StudentLoginResponse | null,
  rawText: string,
  status: number
) => {
  const message = (data?.message || (data as { error?: string } | null)?.error || rawText).trim();
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('locked')) {
    const retryMatch = message.match(/(\d+)\s*seconds?/i);
    return retryMatch
      ? `Your account is temporarily locked. Please try again in ${retryMatch[1]} seconds.`
      : 'Your account is temporarily locked. Please try again later.';
  }

  if (normalizedMessage.includes('password')) {
    return 'The password entered is incorrect.';
  }

  if (normalizedMessage.includes('mobile') || normalizedMessage.includes('username') || normalizedMessage.includes('credential')) {
    return 'The login details you entered are incorrect.';
  }

  if (status === 401) {
    return 'The login details you entered are incorrect.';
  }

  return 'Login failed. Please check your credentials and try again.';
};

const Slideshow = ({ isMobile = false }: { isMobile?: boolean }) => {
  const slides = [
    {
      id: 1,
      title: "1",
      subtitle: "1",
      description: "1",
      image: "https://i.postimg.cc/XvM9d9J3/Untitled-1.jpg"
    },
    {
      id: 2,
      title: "2",
      subtitle: "2",
      description: "2",
      image: "https://i.postimg.cc/tJt9vQdP/Untitled-2.jpg"
    },
    {
      id: 3,
      title: "3",
      subtitle: "3",
      description: "3",
      image: "https://i.postimg.cc/C5KcXbbp/Untitled-3.jpg"
    },
    {
      id: 4,
      title: "4",
      subtitle: "4",
      description: "4",
      image: "https://i.postimg.cc/TYgtS2WZ/Untitled-4.jpg"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-nl-navy via-nl-blue to-nl-sky ${isMobile ? 'fixed inset-0 -z-10' : 'h-full w-full'
      }`}>
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover opacity-70"
            />
          </div>
        ))}
      </div>
      {/* Dark overlay for better readability - only on mobile */}
      {isMobile && <div className="absolute inset-0 bg-black/40"></div>}
    </div>
  );
};

const LoginForm = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loggedInStudent, setLoggedInStudent] = useState<{ gradeId?: number | string; gradeName?: string } | null>(null);
  const navigate = useNavigate();

  const openForgotModal = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowForgotModal(true);
  };

  const closeForgotModal = () => setShowForgotModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMobile = mobile.trim();
    const trimmedPassword = password.trim();

    if (!trimmedMobile || !trimmedPassword) {
      toast.error("Please enter your mobile number and password.");
      return;
    }

    if (trimmedMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch(
        "LoginServlet",
        {
          method: "POST",
          // LoginServlet creates the JSESSIONID that the protected endpoints
          // (including PaymentHistoryServlet) use on subsequent requests.
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: trimmedMobile,
            password: trimmedPassword,
          }),
        }
      );

      const responseText = await response.text().catch(() => "");
      let data: StudentLoginResponse | null = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText) as StudentLoginResponse;
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        console.error("Login failed, server responded with non-OK status:", response.status, responseText);
        toast.error(getLoginErrorMessage(data, responseText, response.status));
        return;
      }

      if (!data) {
        console.warn("Response was not JSON, server returned:", responseText);
        toast.error(responseText || "Login failed: unexpected server response.");
        return;
      }

      const success = data?.success === true || data?.success === "true";

      if (success) {
        const student: StudentDTO | undefined = data.student || (data.studentId ? {
          studentId: data.studentId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobile: data.mobile,
          gradeId: (data as StudentDTO).gradeId,
          gradeName: (data as StudentDTO).gradeName,
          grade: (data as StudentDTO).grade
        } : undefined);
        if (!student) {
          toast.error("Login response did not include student information.");
          return;
        }
        if (!storeStudentIdentity(student)) {
          toast.error("Login response did not include a valid student ID.");
          return;
        }

        toast.success("Login successful!");

        if (isModalSkippedToday()) {
          navigate("/dashboard");
        } else {
          setLoggedInStudent({
            gradeId: student.gradeId,
            gradeName: student.gradeName || (typeof student.grade === 'string' ? student.grade : student.grade?.name)
          });
          setShowWelcomeModal(true);
        }
      } else {
        toast.error(getLoginErrorMessage(data, responseText, response.status));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="student-portal-theme min-h-screen flex bg-nl-mist">
      {/* Desktop Slideshow (left side) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <div className="w-full h-full">
          <Slideshow />
        </div>
      </div>

      {/* Mobile Background Slideshow */}
      <div className="lg:hidden fixed inset-0 z-0 pointer-events-none">
        <Slideshow />
        {/* subtle overlay so form text stays readable but background remains visible */}
        <div className="absolute inset-0 bg-black/0"></div>
      </div>

      {/* Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-md">
          {/* make card semi-transparent on mobile so slideshow is visible behind it */}
          <Card className="nl-card w-full rounded-2xl backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <CardHeader className="space-y-1 pb-4">
              <div className="flex justify-center">
                <img
                  src={`${import.meta.env.BASE_URL}Logo[1]-4.png`}
                  alt="Logo"
                  className="h-14 w-auto mb-2"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <CardTitle className="font-display text-center text-2xl font-bold text-nl-blue">
                Student Portal Login
              </CardTitle>
              <CardDescription className="text-center text-sm text-nl-steel">
                Enter your mobile number and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium text-nl-blue">
                    <Phone className="h-4 w-4" />
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    placeholder="Enter your registered mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    disabled={loading}
                    className="h-11 rounded-xl border-nl-line focus:border-nl-sky focus:ring-nl-sky"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-nl-blue">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="h-11 rounded-xl border-nl-line pr-12 focus:border-nl-sky focus:ring-nl-sky"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full rounded-xl px-3 text-nl-blue hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-nl-blue to-nl-navy font-medium text-white shadow-soft transition-colors duration-200 hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 pt-4">
              <p className="text-center text-sm text-nl-steel w-full">
                <a
                  href="#"
                  onClick={openForgotModal}
                  className="text-nl-teal hover:underline font-medium"
                >
                  Forgot your password?
                </a>
              </p>
              <div className="w-full border-t border-nl-line my-2"></div>
              <p className="text-center text-sm text-nl-steel">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 text-nl-steel hover:text-nl-blue hover:underline font-medium"
                  onClick={handleRegisterRedirect}
                  disabled={loading}
                >
                  Register here
                </Button>
              </p>
              <a
                href="https://portfolio.nextlvlict.com/"
                className="btn btn-light btn-lg mt-3 freaky-btn"
                aria-label="Go to Portfolio"
              >
                Go to Portfolio
              </a>
            </CardFooter>
          </Card>
          {/* Forgot password modal */}
          {showForgotModal && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div
                className="absolute inset-0 bg-black/50"
                onClick={closeForgotModal}
                aria-hidden="true"
              />
              <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lift">
                <h3 className="font-display mb-2 text-lg font-semibold text-nl-blue">Forgot your password?</h3>
                <p className="mb-4 text-sm text-nl-steel">
                  Calm down and try to remember the old password. If that fails, contact support.😅👏
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="inline-flex items-center rounded-xl bg-nl-teal px-4 py-2 text-white shadow-soft hover:bg-nl-teal/90"
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Navigation Modal */}
          <WelcomeModal
            isOpen={showWelcomeModal}
            onClose={() => setShowWelcomeModal(false)}
            studentGradeId={loggedInStudent?.gradeId}
            studentGradeName={loggedInStudent?.gradeName}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
