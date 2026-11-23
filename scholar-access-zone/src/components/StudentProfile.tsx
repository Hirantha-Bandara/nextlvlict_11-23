import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Save, X, Edit, School, Calendar, Smartphone, MapPin, Plus, Loader2, CheckCircle, Building } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/utils";

interface StudentData {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  school: string;
  gradeName?: string;
  monthlyFee?: number;
  address: {
    line1: string;
    line2: string;
    city: string;
    postalcode: string;
    provinceId: string;
    provinceName?: string;
  };
}

interface Province {
  id: string;
  name: string;
}

interface ClassType {
  id: number;
  name: string;
}

interface StudentClassType {
  id: number;
  classTypeId: number;
  classTypeName: string;
}

type StudentProfileResponse = {
  success?: boolean;
  message?: string;
  student?: Record<string, any>;
};

const normalizeStudentProfile = (student: Record<string, any>, fallbackStudentId: string): StudentData => {
  const provinceId = student.provinceId || student.province_id || student.provinceID || student.province || '';
  const addressLine1 = student.addressLine1 || student.line1 || student.address?.line1 || student.address?.addressLine1 || '';
  const addressLine2 = student.addressLine2 || student.line2 || student.address?.line2 || student.address?.addressLine2 || '';
  const city = student.city || student.address?.city || '';
  const postalcode = student.postalCode || student.postalcode || student.address?.postalCode || student.address?.postalcode || '';
  const provinceName = student.provinceName || student.address?.provinceName || (typeof student.province === 'string' ? student.province : '') || '';

  return {
    studentId: student.studentId || student.studentIdNumber || student.id || fallbackStudentId,
    firstName: student.firstName || '',
    lastName: student.lastName || '',
    email: student.email || '',
    mobile: student.mobile || '',
    dateOfBirth: student.dateOfBirth || '',
    school: student.school || '',
    gradeName: student.gradeName,
    monthlyFee: student.monthlyFee,
    address: {
      line1: addressLine1,
      line2: addressLine2,
      city,
      postalcode,
      provinceId,
      provinceName
    }
  };
};

interface StudentProfileProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  onUpdate?: (data: StudentData) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
  isOpen,
  onClose,
  studentId,
  onUpdate
}) => {
  const [formData, setFormData] = useState<StudentData>({
    studentId: studentId,
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    school: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      postalcode: '',
      provinceId: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [studentClassTypes, setStudentClassTypes] = useState<StudentClassType[]>([]);
  const [availableClassTypes, setAvailableClassTypes] = useState<ClassType[]>([]);
  const [selectedClassTypeId, setSelectedClassTypeId] = useState<number | null>(null);
  const [isRegisteringClassType, setIsRegisteringClassType] = useState(false);
  const [classTypesLoading, setClassTypesLoading] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentData();
      loadStudentClassTypes();
      loadAvailableClassTypes();
    }
  }, [isOpen, studentId]);

  const fetchProvinces = async () => {
    try {
      const response = await apiFetch('ProvincesServlet');
      const data = await response.json();
      if (data.success) {
        setProvinces(data.provinces || []);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      toast.error("Error loading provinces");
    } finally {
      setProvincesLoading(false);
    }
  };

  const fetchStudentData = async () => {
    if (!studentId) return;

    setFetching(true);
    try {
      const response = await apiFetch('StudentProfileServlet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId })
      });

      const data = await response.json() as StudentProfileResponse;

      if (data.success && data.student) {
        setFormData(normalizeStudentProfile(data.student, studentId));
      } else {
        toast.error(data.message || "Failed to load student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Error loading student profile");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: keyof StudentData['address'], value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.school) {
      toast.error("Please fill in all required fields");
      return;
    }

    const hasAnyAddressInput = Boolean(
      formData.address.line1 ||
      formData.address.line2 ||
      formData.address.city ||
      formData.address.postalcode ||
      formData.address.provinceId
    );

    if (
      hasAnyAddressInput &&
      (!formData.address.line1 || !formData.address.city || !formData.address.provinceId)
    ) {
      toast.error("Please fill in all required address fields");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch(
        "UpdateProfileServlet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            studentId: formData.studentId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            school: formData.school,
            line1: formData.address.line1,
            line2: formData.address.line2,
            city: formData.address.city,
            postalcode: formData.address.postalcode,
            provinceId: formData.address.provinceId
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        if (onUpdate) {
          onUpdate(formData);
        }
        setIsEditing(false);
        toast.success("Profile updated successfully");

        // Update localStorage
        localStorage.setItem("firstName", formData.firstName);
        localStorage.setItem("lastName", formData.lastName);
        localStorage.setItem("email", formData.email);
        localStorage.setItem("school", formData.school);

        // Refresh data
        fetchStudentData();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchStudentData(); // Reload original data
    setIsEditing(false);
  };

  const loadStudentClassTypes = async () => {
    try {
      const response = await apiFetch(`StudentManagement?action=getStudentClassTypes&studentId=${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudentClassTypes(data || []);
      }
    } catch (error) {
      console.error('Error loading student class types:', error);
    }
  };

  const loadAvailableClassTypes = async () => {
    setClassTypesLoading(true);
    try {
      const response = await apiFetch('ClassTypeServlet', {
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
        setAvailableClassTypes(data.classTypes || []);
      } else {
        toast.error(data.message || "Failed to load class types");
        setAvailableClassTypes([]);
      }
    } catch (error) {
      console.error('Error loading class types:', error);
      toast.error("Error loading class types. Please check if the server is running.");
      setAvailableClassTypes([]);
    } finally {
      setClassTypesLoading(false);
    }
  };

  const handleRegisterClassType = async () => {
    if (!selectedClassTypeId) {
      toast.error("Please select a class type");
      return;
    }

    try {
      setIsRegisteringClassType(true);
      const formData = new URLSearchParams();
      formData.append('studentId', studentId);
      formData.append('classTypeId', String(selectedClassTypeId));

      const response = await apiFetch('StudentManagement?action=registerForClassType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Successfully registered for new class type');
        setSelectedClassTypeId(null);
        loadStudentClassTypes(); // Reload to get updated data
      }
    } catch (error) {
      console.error('Error registering for class type:', error);
      toast.error('Failed to register for class type');
    } finally {
      setIsRegisteringClassType(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProvinceName = (provinceId: string) => {
    const province = provinces.find(p => p.id === provinceId);
    return province ? province.name : formData.address.provinceName || 'Not set';
  };

  if (fetching) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="student-portal-theme nl-card sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Profile
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nl-blue"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="student-portal-theme nl-card sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Profile
          </DialogTitle>
          <DialogDescription>
            View and update your personal information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student ID and Grade Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile Number (ID)
                </Label>
                <p className="font-display text-lg font-bold text-nl-blue">{formData.mobile || 'Not set'}</p>
                <p className="text-xs text-nl-steel">Used for login - Your unique student identifier</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date of Birth
                </Label>
                <p className="font-display text-lg font-semibold text-nl-ink">{formatDate(formData.dateOfBirth)}</p>
                <p className="text-xs text-nl-steel">Cannot be changed</p>
              </CardContent>
            </Card>
          </div>

          {/* Grade Information */}
          {formData.gradeName && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-display mb-2 font-semibold text-nl-blue">Grade Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Grade</Label>
                    <p className="font-medium">{formData.gradeName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Monthly Fee</Label>
                    <p className="font-medium">Rs. {formData.monthlyFee?.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Editable Personal Info */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-display flex items-center gap-2 font-semibold text-nl-blue">
                <User className="h-4 w-4" />
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing || loading}
                    placeholder="First name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing || loading}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing || loading}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school" className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  School *
                </Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  disabled={!isEditing || loading}
                  placeholder="Your school name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Section */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-display flex items-center gap-2 font-semibold text-nl-blue">
                <MapPin className="h-4 w-4" />
                Address Information
              </h3>

              {!isEditing ? (
                // Display mode
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Address Line 1</Label>
                    <p className="font-medium">{formData.address.line1 || 'Not set'}</p>
                  </div>
                  {formData.address.line2 && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Address Line 2</Label>
                      <p className="font-medium">{formData.address.line2}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">City</Label>
                      <p className="font-medium">{formData.address.city || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Postal Code</Label>
                      <p className="font-medium">{formData.address.postalcode || 'Not set'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Province</Label>
                    <p className="font-medium">{getProvinceName(formData.address.provinceId)}</p>
                  </div>
                </div>
              ) : (
                // Edit mode
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="line1">Address Line 1 *</Label>
                    <Input
                      id="line1"
                      value={formData.address.line1}
                      onChange={(e) => handleAddressChange('line1', e.target.value)}
                      disabled={!isEditing || loading}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      value={formData.address.line2}
                      onChange={(e) => handleAddressChange('line2', e.target.value)}
                      disabled={!isEditing || loading}
                      placeholder="Apartment, suite, unit"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        disabled={!isEditing || loading}
                        placeholder="City"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalcode">Postal Code</Label>
                      <Input
                        id="postalcode"
                        value={formData.address.postalcode}
                        onChange={(e) => handleAddressChange('postalcode', e.target.value)}
                        disabled={!isEditing || loading}
                        placeholder="Postal code"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provinceId">Province *</Label>
                    <Select
                      value={formData.address.provinceId}
                      onValueChange={(value) => handleAddressChange('provinceId', value)}
                      disabled={!isEditing || loading || provincesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Class Type Registration Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building className="h-4 w-4" />
                Class Types
              </CardTitle>
              <CardDescription className="text-xs">Manage your class type registrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Class Types */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Current Class Types</Label>
                {studentClassTypes.length === 0 ? (
                  <p className="text-sm text-nl-steel">No class types registered yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {studentClassTypes.map((classType) => (
                      <Badge key={classType.id} className="bg-nl-teal/10 text-nl-teal hover:bg-nl-teal/15 border-nl-teal/25">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {classType.classTypeName}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Register for New Class Type */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium mb-2 flex items-center gap-2 block">
                  <Plus className="h-3 w-3" />
                  Register for Additional Class Type
                </Label>
                <p className="mb-3 text-xs text-nl-steel">
                  If you wish to attend additional class types (e.g., both theory and revision classes), you can register for them here.
                </p>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedClassTypeId?.toString() || ''}
                    onValueChange={(value) => setSelectedClassTypeId(parseInt(value))}
                    disabled={classTypesLoading || isRegisteringClassType}
                  >
                    <SelectTrigger className="h-9 rounded-xl border-nl-line w-[200px]">
                      <SelectValue placeholder={classTypesLoading ? "Loading..." : "Select class type"} />
                    </SelectTrigger>
                    <SelectContent>
                      {classTypesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading class types...
                        </SelectItem>
                      ) : availableClassTypes.length === 0 ? (
                        <SelectItem value="no-types" disabled>
                          No class types available
                        </SelectItem>
                      ) : (
                        availableClassTypes
                          .filter(ct => !studentClassTypes.some(sct => sct.classTypeId === ct.id))
                          .map((classType) => (
                            <SelectItem key={classType.id} value={classType.id.toString()}>
                              {classType.name}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleRegisterClassType}
                    disabled={isRegisteringClassType || !selectedClassTypeId || classTypesLoading}
                    size="sm"
                    className="h-9"
                  >
                    {isRegisteringClassType ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </Button>
                </div>
                {availableClassTypes.length > 0 && studentClassTypes.length >= availableClassTypes.length && (
                  <p className="mt-2 text-xs text-nl-steel">
                    You are already registered for all available class types.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-nl-teal hover:bg-nl-teal/90 text-white shadow-soft"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-nl-blue hover:bg-nl-navy text-white shadow-soft"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="rounded-xl border-nl-blue text-nl-blue hover:bg-nl-blue/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfile;