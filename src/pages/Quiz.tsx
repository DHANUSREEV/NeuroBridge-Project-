import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Trophy, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function Quiz() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  // Sample quiz data - would be different for each neurodivergent type
  const quizData = {
    cognitive: {
      title: "Cognitive Strengths Discovery",
      description: "Let's explore your unique cognitive abilities!",
      questions: [
        {
          question: "When solving problems, I prefer to:",
          options: [
            "Break them down into smaller parts",
            "Look at the big picture first", 
            "Try different approaches until one works",
            "Ask for help from others"
          ]
        },
        {
          question: "I learn best when:",
          options: [
            "I can see visual examples",
            "I hear explanations",
            "I can practice hands-on",
            "I work at my own pace"
          ]
        }
      ]
    },
    sensory: {
      title: "Sensory Processing Profile",
      description: "Discover how you process the world around you!",
      questions: [
        {
          question: "In busy environments, I usually:",
          options: [
            "Feel energized and alert",
            "Need to find a quiet space",
            "Focus on specific sounds or sights",
            "Adapt based on my mood"
          ]
        }
      ]
    },
    motor: {
      title: "Movement & Coordination Strengths",
      description: "Let's explore your unique movement patterns!",
      questions: [
        {
          question: "When learning new physical tasks, I:",
          options: [
            "Practice until I get it perfect",
            "Prefer to watch others first",
            "Learn through repetition",
            "Adapt my own style"
          ]
        }
      ]
    }
  };

  const currentQuiz = quizData[type as keyof typeof quizData] || quizData.cognitive;
  const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === currentQuiz.questions.length - 1;

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    setScore(score + 1); // Simplified scoring

    if (isLastQuestion) {
      // Navigate to results
      navigate(`/results/${type}`, { state: { score, answers: newAnswers } });
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star size={14} />
              Level {currentQuestion + 1}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{currentQuiz.title}</span>
            <span>{currentQuestion + 1} of {currentQuiz.questions.length}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Quiz Content */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 shadow-elevated">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  {currentQuiz.questions[currentQuestion].question}
                </h2>
                <p className="text-muted-foreground">
                  Choose the option that best describes you - there are no wrong answers!
                </p>
              </div>

              <div className="space-y-4">
                {currentQuiz.questions[currentQuestion].options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full p-6 h-auto text-left justify-start hover:border-primary hover:bg-primary/5 transition-all"
                      onClick={() => handleAnswer(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                          <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                        </div>
                        <span className="text-base">{option}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Encouragement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <div className="flex items-center justify-center gap-2 text-success">
              <CheckCircle size={16} />
              <span className="text-sm">You're doing great! Keep going!</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}