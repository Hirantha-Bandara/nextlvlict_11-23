import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "@/lib/utils";

const formSchema = z.object({
  fName: z.string().min(1, {
    message: "First name must be at least 2 characters.",
  }),
  lName: z.string().min(1, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid 10-digit phone number.",
  }).max(10, {
    message: "Phone number must be exactly 10 digits.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
  gradeId: z.string().min(1, {
    message: "Please select a grade.",
  }),
  olAlId: z.string().min(1, {
    message: "Please select OL or AL.",
  }),
  dateOfBirth: z.string().min(1, {
    message: "Please select your date of birth.",
  }),
  school: z.string().min(1, {
    message: "Please enter your school name.",
  }),
  nic: z.string().optional(),
  line1: z.string().min(1, {
    message: "Address Line 1 is required",
  }),
  line2: z.string().optional(),
  city: z.string().min(1, {
    message: "City is required",
  }),
  postalcode: z.string().optional(),
  provinceId: z.string().min(1, {
    message: "Please select a province",
  }),
  districtId: z.string().min(1, {
    message: "Please select a district",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Slideshow = () => {
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
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
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
    </div>
  );
};

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [olAlOptions, setOlAlOptions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [olAlLoading, setOlAlLoading] = useState(true);
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [districtsLoading, setDistrictsLoading] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: Personal Info, 2: Address, 3: Success

  useEffect(() => {
    fetchOlAlOptions();
    fetchProvinces();
    fetchDistricts();
  }, []);

  const fetchOlAlOptions = async () => {
    try {
      const response = await apiFetch('OlAlServlet', {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${contentType}. Response: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (data.success) {
        setOlAlOptions(data.olAlOptions || []);
      } else {
        toast.error(data.message || "Failed to load OL/AL options");
      }
    } catch (error) {
      console.error("Error fetching OL/AL options:", error);
      toast.error("Error loading OL/AL options. Please check if the server is running.");
    } finally {
      setOlAlLoading(false);
    }
  };

  const fetchGrades = async (olAlId: string) => {
    if (!olAlId) {
      setGrades([]);
      return;
    }

    setGradesLoading(true);
    try {
      const response = await apiFetch(`GradeServlet?olAlId=${olAlId}`, {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${contentType}. Response: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (data.success) {
        setGrades(data.grades || []);
      } else {
        toast.error(data.message || "Failed to load grades");
        setGrades([]);
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Error loading grades. Please check if the server is running.");
      setGrades([]);
    } finally {
      setGradesLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await apiFetch('ProvincesServlet', {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setProvinces(data.provinces || []);
      } else {
        toast.error(data.message || "Failed to load provinces");
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      toast.error("Error loading provinces");
    } finally {
      setProvincesLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await apiFetch('DistrictsServlet', {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setDistricts(data.districts || []);
      } else {
        toast.error(data.message || "Failed to load districts");
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Error loading districts");
    } finally {
      setDistrictsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      lName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      gradeId: "",
      olAlId: "",
      dateOfBirth: "",
      school: "",
      nic: "",
      line1: "",
      line2: "",
      city: "",
      postalcode: "",
      provinceId: "",
      districtId: "",
    },
  });

  const watchOlAlId = form.watch("olAlId");

  // Fetch grades when OL/AL selection changes
  useEffect(() => {
    if (watchOlAlId) {
      fetchGrades(watchOlAlId);
      // Reset grade selection when OL/AL changes
      form.setValue("gradeId", "");
    } else {
      setGrades([]);
      form.setValue("gradeId", "");
    }
  }, [watchOlAlId]);

  const validateStep1 = () => {
    const fields = ['fName', 'lName', 'email', 'phone', 'password', 'confirmPassword', 'gradeId', 'olAlId', 'dateOfBirth', 'school'];
    let isValid = true;

    fields.forEach(field => {
      const value = form.getValues(field as any);
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        form.setError(field as any, { type: 'manual', message: 'This field is required' });
        isValid = false;
      }
    });

    if (form.getValues('password') !== form.getValues('confirmPassword')) {
      form.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      isValid = false;
    }

    return isValid;
  };

  const validateStep2 = () => {
    const fields = ['line1', 'city', 'provinceId', 'districtId'];
    let isValid = true;

    fields.forEach(field => {
      const value = form.getValues(field as any);
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        form.setError(field as any, { type: 'manual', message: 'This field is required' });
        isValid = false;
      }
    });

    return isValid;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      // Create URLSearchParams
      const params = new URLSearchParams();
      params.append('fName', values.fName);
      params.append('lName', values.lName);
      params.append('email', values.email);
      params.append('phone', values.phone);
      params.append('password', values.password);
      params.append('gradeId', values.gradeId);
      params.append('olAlId', values.olAlId);
      params.append('dateOfBirth', values.dateOfBirth);
      params.append('school', values.school);
      params.append('nic', values.nic || '');
      params.append('line1', values.line1);
      params.append('line2', values.line2 || '');
      params.append('city', values.city);
      params.append('postalcode', values.postalcode || '');
      params.append('provinceId', values.provinceId);
      params.append('districtId', values.districtId);

      // Send registration request to backend
      const response = await apiFetch('StudentRegistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const data = await response.json();

      if (data.success) {
        setStudentId(data.studentId);
        setCurrentStep(3);
        toast.success(data.message, {
          duration: 10000,
        });
      } else {
        // Handle different types of errors with specific messages
        if (data.errorType === 'EMAIL_EXISTS') {
          toast.error(data.message, {
            description: "Please use a different email address or try logging in.",
            duration: 8000,
          });
          // Highlight the email field
          form.setError('email', {
            type: 'manual',
            message: 'This email is already registered'
          });
          setCurrentStep(1);
        } else if (data.errorType === 'PHONE_EXISTS') {
          toast.error(data.message, {
            description: "Please use a different phone number.",
            duration: 8000,
          });
          // Highlight the phone field
          form.setError('phone', {
            type: 'manual',
            message: 'This phone number is already registered'
          });
          setCurrentStep(1);
        } else {
          toast.error(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmitStep2 = () => {
    if (validateStep2()) {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  if (currentStep === 3) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <div className="w-full max-w-xl animate-fade-in">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-[#3c6299]">Registration Successful!</CardTitle>
              <CardDescription className="text-center">
                Your student account has been created successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="my-6">
                <p className="text-lg font-semibold mb-2">Your Student ID is:</p>
                <div className="text-3xl font-bold text-[#3c6299] bg-blue-50 p-4 rounded-lg border border-blue-200">
                  {studentId}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Please save this ID securely. You will need it to log in to your account.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={handleBackToLogin}
                className="bg-[#3c6299] hover:bg-[#2a4a7a] text-white"
              >
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <div className="w-full h-full">
          <Slideshow />
        </div>
      </div>

      {/* Mobile Background Slideshow (visible behind the form) */}
      <div className="lg:hidden fixed inset-0 z-0 pointer-events-none">
        <Slideshow />
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Registration Form Section */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-md">
          {/* semi-transparent on mobile so slideshow is visible; opaque on lg+ */}
          <Card className="w-full shadow-lg border-0 bg-white/70 backdrop-blur-sm lg:bg-white lg:backdrop-blur-0">
            <CardHeader className="space-y-1 pb-4">

              <div className="flex justify-center">
                <img
                  src={`${import.meta.env.BASE_URL}Logo[1]-4.png`}
                  alt="Logo"
                  className="h-14 w-auto mb-2"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              <CardTitle className="text-2xl font-bold text-center text-[#3c6299]">
                Student Registration
              </CardTitle>
              <CardDescription className="text-center text-sm text-gray-600">
                {currentStep === 1
                  ? "Step 1: Personal Information"
                  : "Step 2: Address Information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {currentStep === 1 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your first name"
                                  {...field}
                                  disabled={loading}
                                  className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your last name"
                                  {...field}
                                  disabled={loading}
                                  className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  {...field}
                                  disabled={loading}
                                  className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">Phone Number *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Phone number (Whatsapp)"
                                  {...field}
                                  disabled={loading}
                                  maxLength={10}
                                  className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="olAlId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">OL or AL</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={loading || olAlLoading}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]">
                                    <SelectValue placeholder="Select OL or AL" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {olAlLoading ? (
                                    <SelectItem value="loading" disabled>
                                      Loading options...
                                    </SelectItem>
                                  ) : (
                                    olAlOptions.map((option) => (
                                      <SelectItem key={option.id} value={option.id.toString()}>
                                        {option.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gradeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">Grade/Class</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={loading || gradesLoading || !watchOlAlId}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]">
                                    <SelectValue placeholder={
                                      !watchOlAlId ? "Please select OL/AL first" : "Select your grade"
                                    } />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {gradesLoading ? (
                                    <SelectItem value="loading" disabled>
                                      Loading grades...
                                    </SelectItem>
                                  ) : grades.length === 0 ? (
                                    <SelectItem value="no-grades" disabled>
                                      No grades available for this selection
                                    </SelectItem>
                                  ) : (
                                    grades.map((grade) => (
                                      <SelectItem key={grade.id} value={grade.id.toString()}>
                                        {grade.name} 
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">Date of Birth</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  disabled={loading}
                                  max={new Date().toISOString().split('T')[0]}
                                  className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="school"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">School</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your school name"
                                  {...field}
                                  disabled={loading}
                                  className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* NIC field - only shown for A/L students */}
                      {watchOlAlId === "1" && (
                        <FormField
                          control={form.control}
                          name="nic"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">NIC Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your NIC number"
                                  {...field}
                                  disabled={loading}
                                  className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Create a password"
                                  {...field}
                                  disabled={loading}
                                  className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-[#3c6299]">Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Confirm your password"
                                  {...field}
                                  disabled={loading}
                                  className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full h-11 bg-[#00afa1] hover:bg-[#0e8b81] text-white font-medium mt-2 transition-colors duration-200"
                        disabled={loading || gradesLoading || olAlLoading}
                      >
                        Next: Address Information
                      </Button>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <div className="space-y-4">
                        <div className="border-t pt-4">
                          <h3 className="text-lg font-semibold text-[#3c6299] mb-3">Address Information</h3>

                          <FormField
                            control={form.control}
                            name="line1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-[#3c6299]">Address Line 1 *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Street address, P.O. box, company name"
                                    {...field}
                                    disabled={loading}
                                    className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="line2"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-[#3c6299]">Address Line 2</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Apartment, suite, unit, building, floor"
                                    {...field}
                                    disabled={loading}
                                    className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-[#3c6299]">City *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="City"
                                      {...field}
                                      disabled={loading}
                                      className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="postalcode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-[#3c6299]">Postal Code</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Postal code"
                                      {...field}
                                      disabled={loading}
                                      className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="provinceId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-[#3c6299]">Province *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={loading || provincesLoading}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]">
                                      <SelectValue placeholder="Select province" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {provincesLoading ? (
                                      <SelectItem value="loading" disabled>
                                        Loading provinces...
                                      </SelectItem>
                                    ) : provinces.length === 0 ? (
                                      <SelectItem value="no-provinces" disabled>
                                        No provinces available
                                      </SelectItem>
                                    ) : (
                                      provinces.map((province) => (
                                        <SelectItem key={province.id} value={province.id}>
                                          {province.name}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="districtId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-[#3c6299]">District *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={loading || districtsLoading}
                                >
                                  <FormControl>
                                    <SelectTrigger id="districtSelect" className="h-10 border-gray-300 focus:border-[#00afa1] focus:ring-[#00afa1]">
                                      <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {districtsLoading ? (
                                      <SelectItem value="loading" disabled>
                                        Loading districts...
                                      </SelectItem>
                                    ) : districts.length === 0 ? (
                                      <SelectItem value="no-districts" disabled>
                                        No districts available
                                      </SelectItem>
                                    ) : (
                                      districts.map((district) => (
                                        <SelectItem key={district.id} value={district.id}>
                                          {district.name}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handlePrevStep}
                          variant="outline"
                          className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                          disabled={loading}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSubmitStep2}
                          className="flex-1 h-11 bg-[#00afa1] hover:bg-[#0e8b81] text-white font-medium transition-colors duration-200"
                          disabled={loading || provincesLoading || districtsLoading}
                        >
                          {loading ? "Registering..." : "Complete Registration"}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
            {currentStep === 1 && (
              <CardFooter className="flex justify-center pt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-[#686868] hover:text-[#686868] font-medium"
                    onClick={() => navigate("/login")}
                    disabled={loading}
                  >
                    Login here
                  </Button>
                </p>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
