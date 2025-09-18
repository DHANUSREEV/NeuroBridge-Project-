import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CandidateDashboard from '@/components/dashboard/CandidateDashboard';
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard - Auth State:', { loading, user: !!user, profile: !!profile });
    if (!loading && !user) {
      console.log('Redirecting to /auth - no user found');
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {profile.role === 'candidate' ? (
        <CandidateDashboard />
      ) : (
        <ManagerDashboard />
      )}
    </div>
  );
};

export default Dashboard;