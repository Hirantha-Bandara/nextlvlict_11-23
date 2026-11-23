import type { StudentDTO } from '@/types/api';

const studentKeys = ['isLoggedIn', 'studentId', 'firstName', 'lastName', 'email', 'mobile', 'school', 'gradeId', 'gradeName'];
const adminKeys = ['isAdminLoggedIn', 'adminUsername', 'adminSessionId', 'adminAuthToken'];

export const clearStudentSession = () => studentKeys.forEach((key) => localStorage.removeItem(key));
export const clearAdminSession = () => adminKeys.forEach((key) => localStorage.removeItem(key));

export const getStoredStudentId = (): string | null => {
  const studentId = localStorage.getItem('studentId')?.trim();
  return studentId && studentId !== 'undefined' && studentId !== 'null' ? studentId : null;
};

export const storeStudentIdentity = (student: StudentDTO): boolean => {
  const responseStudentId = student.studentId ?? student.id;
  const studentId = responseStudentId === undefined || responseStudentId === null
    ? ''
    : String(responseStudentId).trim();
  if (!studentId || studentId === 'undefined' || studentId === 'null') {
    clearStudentSession();
    return false;
  }

  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('studentId', studentId);
  if (student.firstName) localStorage.setItem('firstName', student.firstName);
  if (student.lastName) localStorage.setItem('lastName', student.lastName);
  if (student.email) localStorage.setItem('email', student.email);
  if (student.mobile) localStorage.setItem('mobile', student.mobile);
  if (student.school) localStorage.setItem('school', student.school);
  if (student.gradeId) localStorage.setItem('gradeId', String(student.gradeId));
  const gradeNameVal = student.gradeName || (typeof student.grade === 'string' ? student.grade : student.grade?.name);
  if (gradeNameVal) localStorage.setItem('gradeName', gradeNameVal);
  return true;
};

export const storeAdminIdentity = (
  admin: { username?: string; name?: string },
  auth?: { sessionId?: string; authToken?: string }
) => {
  localStorage.setItem('isAdminLoggedIn', 'true');
  const displayName = admin.username || admin.name;
  if (displayName) localStorage.setItem('adminUsername', displayName);
  if (auth?.sessionId) localStorage.setItem('adminSessionId', auth.sessionId);
  if (auth?.authToken) localStorage.setItem('adminAuthToken', auth.authToken);
};
