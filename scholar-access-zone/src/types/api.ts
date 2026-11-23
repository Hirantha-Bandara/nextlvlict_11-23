export interface ApiErrorResponse {
  success?: false;
  message?: string;
  errorCode?: string;
}

export interface StudentDTO {
  // LoginServlet currently serializes this field as `id`, while profile
  // responses use `studentId`.
  studentId?: string | number;
  id?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  school?: string;
  gradeId?: string | number;
  gradeName?: string;
  grade?: { id?: number | string; name?: string } | string;
}

export interface AdminDTO {
  username?: string;
  name?: string;
}

export interface StudentProfileResponse extends ApiErrorResponse {
  success: boolean;
  student?: StudentDTO;
}

export interface StudentLoginResponse extends ApiErrorResponse {
  success: boolean | 'true';
  student?: StudentDTO;
  studentId?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
}

export interface AdminLoginResponse extends ApiErrorResponse {
  status?: 'success' | 'error';
  success?: boolean;
  admin?: AdminDTO;
  username?: string;
  sessionId?: string;
  authToken?: string;
}

export interface ClassType {
  id: number;
  name: string;
}

export interface ClassSchedule {
  id: number;
  gradeId?: number;
  gradeName?: string;
  grade?: {
    id: number;
    name: string;
    fee?: number;
  } | string;
  classTypeId?: number;
  classTypeName?: string;
  classType?: {
    id: number;
    name: string;
  } | string;
  dayId?: number;
  dayName?: string;
  day?: {
    id: number;
    name: string;
  } | string;
  startTime?: string;
  endTime?: string;
  start_time?: string;
  end_time?: string;
  zoomLink?: string;
  description?: string;
  status?: string;
  isActive?: boolean | number;
}

export interface ClassItem {
  id: number;
  grade: string;
  grade_id?: number | string;
  classTypeId?: number;
  classTypeName?: string;
  class_type_id?: number | string;
  day: string;
  day_id?: number | string;
  start_time: string;
  end_time: string;
  zoomLink: string;
  description: string;
  status?: string;
}

export interface ResourceType {
  id: number;
  name: string;
}

export interface TuteItem {
  id: number;
  title: string;
  description?: string;
  download_url?: string;
  link?: string;
  price: number;
  accessType?: 'FREE' | 'PAID' | string;
  access_type?: 'FREE' | 'PAID' | string;
  grade_id?: number;
  gradeId?: number;
  grade?: {
    id: number;
    name: string;
    fee?: number;
  } | string;
  tuteTypeId?: number;
  tute_type_id?: number;
  tuteTypeName?: string;
  tute_type_name?: string;
  tuteType?: ResourceType | string;
  status?: string;
  created_at?: string;
  isPurchased?: boolean;
  hasRequested?: boolean;
  cover_image_url?: string | null;
}

export interface GalleryImage { id: number; image_url: string; display_order: number; is_active?: boolean; }
export interface BranchImage { branch_name: string; image_url: string; }

export interface FreeLessonDTO {
  id: number;
  unitLabel: string;
  title: string;
  youtubeUrl: string;
  displayOrder: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

