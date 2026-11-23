import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';
import { storeAdminIdentity } from '@/lib/auth';
import type { AdminLoginResponse } from '@/types/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (isAdminLoggedIn) {
      navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await apiFetch('AdminLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include' // Important for session cookies
      });

      const data = await response.json() as AdminLoginResponse;

      if (response.ok && (data.status === 'success' || data.success === true || data.message === 'Login successful')) {
        storeAdminIdentity(
          data.admin || { username: data.username || username },
          { sessionId: data.sessionId, authToken: data.authToken }
        );
        toast.success("Admin login successful");
        navigate("/$12$SV5K9vEnQSZEGyn6Hugdey4MTL7dTCZu20OLvrt933uuLk2aY6/dashboard");
      } else {
        toast.error(data.message || "Invalid admin credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-portal-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-portal-blue p-2 rounded-full">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-portal-blue hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Use the credentials from your database
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
