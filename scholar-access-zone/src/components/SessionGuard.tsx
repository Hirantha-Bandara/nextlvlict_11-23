import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiFetch } from '@/lib/utils';
import { clearAdminSession, clearStudentSession, getStoredStudentId, storeStudentIdentity } from '@/lib/auth';
import type { StudentProfileResponse } from '@/types/api';
import { toast } from 'sonner';

type SessionKind = 'student' | 'admin';
const ADMIN_LOGIN_PATH = '/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6';

interface SessionGuardProps {
  kind: SessionKind;
  children: ReactNode;
}

export const verifyStudentSession = async (): Promise<boolean> => {
  const studentId = getStoredStudentId();
  if (!studentId) return false;

  const response = await apiFetch('StudentProfileServlet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
    credentials: 'include',
  });
  const data = await response.json() as StudentProfileResponse;
  if (!response.ok || !data.success || !data.student) return false;

  return storeStudentIdentity(data.student);
};

export const verifyAdminSession = async (): Promise<boolean> => {
  // This existing read-only admin endpoint is protected by the backend session.
  const response = await apiFetch('ClassScheduling?action=getDays', {
    method: 'GET',
    credentials: 'include',
  });
  return response.ok;
};

export const SessionGuard = ({ kind, children }: SessionGuardProps) => {
  const location = useLocation();
  const [state, setState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    let active = true;
    const verify = async () => {
      try {
        const authenticated = kind === 'student'
          ? await verifyStudentSession()
          : await verifyAdminSession();
        if (!authenticated) {
          kind === 'student' ? clearStudentSession() : clearAdminSession();
        }
        if (active) setState(authenticated ? 'authenticated' : 'unauthenticated');
      } catch {
        // A failed verification must never be treated as an authenticated session.
        kind === 'student' ? clearStudentSession() : clearAdminSession();
        if (active) setState('unauthenticated');
      }
    };
    verify();
    return () => { active = false; };
  }, [kind]);

  if (state === 'checking') return null;
  if (state === 'unauthenticated') {
    return <Navigate to={kind === 'student' ? '/login' : ADMIN_LOGIN_PATH} replace state={{ from: location }} />;
  }
  return <>{children}</>;
};

// Runs once when the SPA starts. Stored identity only tells us which
// verification endpoint to call; the backend cookie response decides whether
// that identity is still authenticated.
export const SessionBootstrap = () => {
  useEffect(() => {
    const verify = async () => {
      if (getStoredStudentId()) {
        try {
          if (!await verifyStudentSession()) clearStudentSession();
        } catch {
          clearStudentSession();
        }
        return;
      }

      if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        try {
          if (!await verifyAdminSession()) clearAdminSession();
        } catch {
          clearAdminSession();
        }
      }
    };
    verify();
  }, []);

  useEffect(() => {
    const handleSecurityStatus = (event: Event) => {
      const { status, message, retryAfter } = (event as CustomEvent<{
        status: number;
        message?: string;
        retryAfter?: string;
      }>).detail;

      if (status === 401) {
        // A request can be unauthorized for reasons other than an expired
        // browser session.  Let the caller keep its current screen and show
        // the server error instead of unexpectedly navigating to a login page.
        toast.error(message || 'This request is not authorized.');
      } else if (status === 403) {
        toast.error(message || 'You do not have permission to perform this action.');
      } else if (status === 423) {
        toast.error(message || 'This account is temporarily locked. Please try again later.');
      } else if (status === 429) {
        toast.error(message || (retryAfter
          ? `Too many requests. Please try again in ${retryAfter} seconds.`
          : 'Too many requests. Please try again shortly.'));
      }
    };

    window.addEventListener('api-security-status', handleSecurityStatus);
    return () => window.removeEventListener('api-security-status', handleSecurityStatus);
  }, []);

  return null;
};
