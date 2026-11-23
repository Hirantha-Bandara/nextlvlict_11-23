/**
 * Authentication session helpers.
 *
 * Two independent auth contexts exist side by side:
 *
 * Student — cookie-only
 *   Login posts to LoginServlet → Tomcat sets an HttpOnly JSESSIONID cookie.
 *   The browser forwards it automatically via `credentials: 'include'`.
 *   On logout, student identity keys are cleared from localStorage.
 *
 * Admin — cookie + token headers
 *   Login posts to AdminLogin servlet → backend returns sessionId + authToken
 *   in the JSON body. Both are stored in localStorage and injected as
 *   X-Session-Id / X-Auth-Token headers by apiFetch on every request.
 */

// ---------------------------------------------------------------------------
// Student session
// ---------------------------------------------------------------------------

const STUDENT_KEYS = [
  "isLoggedIn",
  "studentId",
  "firstName",
  "lastName",
  "email",
  "mobile",
  "school",
  "gradeId",
  "gradeName",
] as const;

export interface StudentDTO {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  school?: string;
  gradeId?: string;
  gradeName?: string;
}

/** Persist student identity to localStorage after a successful login. */
export function storeStudentIdentity(student: StudentDTO): boolean {
  try {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("studentId", student.studentId);
    localStorage.setItem("firstName", student.firstName);
    localStorage.setItem("lastName", student.lastName);
    localStorage.setItem("email", student.email);
    if (student.mobile) localStorage.setItem("mobile", student.mobile);
    if (student.school) localStorage.setItem("school", student.school);
    if (student.gradeId) localStorage.setItem("gradeId", student.gradeId);
    if (student.gradeName) localStorage.setItem("gradeName", student.gradeName);
    return true;
  } catch {
    return false;
  }
}

/** Remove all student session data from localStorage. */
export function clearStudentSession(): void {
  STUDENT_KEYS.forEach((key) => localStorage.removeItem(key));
}

/** Check whether a student is currently logged in. */
export function isStudentLoggedIn(): boolean {
  return localStorage.getItem("isLoggedIn") === "true";
}

// ---------------------------------------------------------------------------
// Admin session
// ---------------------------------------------------------------------------

export interface AdminDTO {
  adminId: string;
  username: string;
  email?: string;
}

export interface AdminAuthDTO {
  authToken: string;
  sessionId: string;
}

/** Persist admin identity and auth tokens to localStorage. */
export function storeAdminIdentity(admin: AdminDTO, auth: AdminAuthDTO): boolean {
  try {
    localStorage.setItem("adminAuthToken", auth.authToken);
    localStorage.setItem("adminSessionId", auth.sessionId);
    localStorage.setItem("adminId", admin.adminId);
    localStorage.setItem("adminUsername", admin.username);
    if (admin.email) localStorage.setItem("adminEmail", admin.email);
    return true;
  } catch {
    return false;
  }
}

/** Remove all admin session data from localStorage. */
export function clearAdminSession(): void {
  [
    "adminAuthToken",
    "adminSessionId",
    "adminId",
    "adminUsername",
    "adminEmail",
  ].forEach((key) => localStorage.removeItem(key));
}

/** Check whether an admin is currently logged in. */
export function isAdminLoggedIn(): boolean {
  return Boolean(
    localStorage.getItem("adminAuthToken") &&
      localStorage.getItem("adminSessionId"),
  );
}
