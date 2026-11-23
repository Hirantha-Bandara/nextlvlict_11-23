
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import { UserRound, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="">
      <LoginForm />

    </div>

  );
};

export default Index;
