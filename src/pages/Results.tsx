import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Download, Star, Heart, Sparkles } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { score, answers } = location.state || { score: 0, answers: [] };

  const resultData = {
    cognitive: {
      title: "Cognitive Strengths Profile",
      strengths: ["Analytical Thinking", "Pattern Recognition", "Creative Problem-Solving"],
      supportAreas: ["Processing Speed", "Working Memory"],
      badges: ["Logic Master", "Pattern Detective", "Creative Thinker"]
    },
    sensory: {
      title: "Sensory Processing Profile", 
      strengths: ["Attention to Detail", "Environmental Awareness", "Focus Ability"],
      supportAreas: ["Sensory Filtering", "Environmental Adaptation"],
      badges: ["Detail Detective", "Environment Expert", "Focus Champion"]
    },
    motor: {
      title: "Movement & Coordination Profile",
      strengths: ["Persistence", "Adaptive Strategies", "Kinesthetic Learning"],
      supportAreas: ["Fine Motor Skills", "Coordination Tasks"],
      badges: ["Persistence Pro", "Strategy Master", "Kinesthetic Learner"]
    }
  };

  const currentResult = resultData[type as keyof typeof resultData] || resultData.cognitive;

  const handleGenerateResume = () => {
    navigate('/resume', { state: { type, results: currentResult, score, answers } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30">
      <div className="container mx-auto px-4 py-8">
        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Trophy size={48} className="text-success" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-success bg-clip-text text-transparent">
              Amazing work!
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            You've unlocked new insights about your unique abilities
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Results Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 shadow-elevated">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {currentResult.title}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-success">
                    <Star size={20} />
                    Your Superpowers
                  </h3>
                  <div className="space-y-3">
                    {currentResult.strengths.map((strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20"
                      >
                        <Sparkles size={16} className="text-success" />
                        <span>{strength}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Support Areas */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                    <Heart size={20} />
                    Growth Opportunities
                  </h3>
                  <div className="space-y-3">
                    {currentResult.supportAreas.map((area, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20"
                      >
                        <Heart size={16} className="text-primary" />
                        <span>{area}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Badges Earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-8 shadow-elevated">
              <h3 className="text-xl font-semibold mb-6 text-center">
                🏆 Badges Earned
              </h3>
              
              <div className="flex flex-wrap gap-4 justify-center">
                {currentResult.badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Badge 
                      className="px-4 py-2 text-base bg-gradient-success text-success-foreground badge-glow"
                    >
                      ⭐ {badge}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="hero"
              size="lg"
              onClick={handleGenerateResume}
              className="flex items-center gap-2"
            >
              <Download size={20} />
              Generate My Professional Resume
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              Take Another Quiz
            </Button>
          </motion.div>

          {/* Encouragement Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-12 p-6 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg border border-success/20"
          >
            <p className="text-lg text-muted-foreground">
              🎉 Remember: Your neurodivergent traits aren't limitations - they're your unique advantages that make you exceptional!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}