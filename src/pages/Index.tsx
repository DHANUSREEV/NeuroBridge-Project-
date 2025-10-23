import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { TypeSelection } from "@/components/TypeSelection";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
    // Check if we should show type selection from dashboard navigation
    if (location.state?.showTypeSelection) {
      setShowTypeSelection(true);
    }
  }, [user, loading, navigate, location.state]);

  const handleGetStarted = () => {
    setShowTypeSelection(true);
  };

  const handleTypeSelect = (type: string) => {
    if (!user) {
      // Show navigation prompt for authentication
      navigate('/auth', { 
        state: { 
          message: "Please log in to access your personalized dashboard. Once logged in, you can view and attempt your quizzes, track your progress, and access support tools designed to enhance your learning experience.",
          redirectTo: `/quiz/${type}`
        }
      });
    } else {
      navigate(`/quiz/${type}`);
    }
  };

  const handleAuthRedirect = () => {
    navigate('/auth');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page title */}
      
   <h1 className="text-6xl font-bold text-foreground text-center mt-8">
  Welcome to NeuroBridge - Inclusive neurodivergent skills discovery platform
</h1>

      {!showTypeSelection ? (
        <div>
          <div className="absolute top-4 right-4">
            <Button onClick={handleAuthRedirect} variant="outline">
              Sign In / Register
            </Button>
          </div>

          {/* Main hero section */}
          <HeroSection onGetStarted={handleGetStarted} />

          {/* Optional page heading */}
          <div className="text-center mt-8">
          </div>
        </div>
      ) : (
        <div className="min-h-screen py-12 bg-gradient-to-br from-background via-card/20 to-background">
          <div className="absolute top-4 right-4">
            <Button onClick={handleAuthRedirect} variant="outline">
              Sign In / Register
            </Button>
          </div>
          <div className="container mx-auto">
            <TypeSelection onTypeSelect={handleTypeSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
