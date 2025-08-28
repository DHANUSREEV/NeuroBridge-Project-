// Welcome to NeuroStrengths - Inclusive neurodivergent skills discovery platform

import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { TypeSelection } from "@/components/TypeSelection";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowTypeSelection(true);
  };

  const handleTypeSelect = (type: string) => {
    navigate(`/quiz/${type}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {!showTypeSelection ? (
        <HeroSection onGetStarted={handleGetStarted} />
      ) : (
        <div className="min-h-screen py-12 bg-gradient-to-br from-background via-card/20 to-background">
          <div className="container mx-auto">
            <TypeSelection onTypeSelect={handleTypeSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
