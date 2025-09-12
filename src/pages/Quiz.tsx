import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Trophy, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { questionBank } from "@/data/questionBank";

export default function Quiz() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  // Quiz state management
  const [currentStep, setCurrentStep] = useState<'domain-selection' | 'quiz' | 'results'>('domain-selection');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const neuroType = questionBank[type as keyof typeof questionBank];
  
  if (!neuroType) {
    navigate('/404');
    return null;
  }

  const selectedDomainData = selectedDomain 
    ? neuroType.domains.find(d => d.id === selectedDomain)
    : null;

  // Domain selection handlers
  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
    setCurrentStep('quiz');
  };

  // Quiz handlers
  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);

    if (currentQuestion === selectedDomainData!.questions.length - 1) {
      // Quiz complete, show results
      setQuizComplete(true);
      setCurrentStep('results');
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateScore = () => {
    if (!selectedDomainData) return 0;
    return userAnswers.reduce((score, answer, index) => {
      return answer === selectedDomainData.questions[index].correctAnswer ? score + 1 : score;
    }, 0);
  };

  const handleRetakeQuiz = () => {
    setCurrentStep('domain-selection');
    setSelectedDomain(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizComplete(false);
  };

  const handleGenerateResume = () => {
    const score = calculateScore();
    const results = {
      domain: selectedDomainData,
      score,
      totalQuestions: selectedDomainData?.questions.length || 0,
      answers: userAnswers,
      questions: selectedDomainData?.questions || []
    };
    navigate(`/results/${type}`, { state: results });
  };

  // Domain Selection Step
  if (currentStep === 'domain-selection') {
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
          </div>

          {/* Domain Selection */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-4">
                Choose Your {neuroType.name} Domain
              </h1>
              <p className="text-xl text-muted-foreground">
                {neuroType.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neuroType.domains.map((domain, index) => (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="p-6 cursor-pointer hover:shadow-elevated transition-all border-2 hover:border-primary/50"
                    onClick={() => handleDomainSelect(domain.id)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">{domain.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{domain.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {domain.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        10 Questions
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Step
  if (currentStep === 'quiz' && selectedDomainData) {
    const progress = ((currentQuestion + 1) / selectedDomainData.questions.length) * 100;
    const currentQuestionData = selectedDomainData.questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep('domain-selection')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Domains
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star size={14} />
                Question {currentQuestion + 1}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{selectedDomainData.name} {selectedDomainData.icon}</span>
              <span>{currentQuestion + 1} of {selectedDomainData.questions.length}</span>
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
                    {currentQuestionData.question}
                  </h2>
                  <p className="text-muted-foreground">
                    Select the best answer - answers will be revealed at the end!
                  </p>
                </div>

                <div className="space-y-4">
                  {currentQuestionData.options.map((option, index) => (
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
                <span className="text-sm">You're doing amazing! Keep going!</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Results Step
  if (currentStep === 'results' && selectedDomainData && quizComplete) {
    const score = calculateScore();
    const percentage = Math.round((score / selectedDomainData.questions.length) * 100);

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
                Quiz Complete!
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4">
              You scored {score} out of {selectedDomainData.questions.length} ({percentage}%)
            </p>
            
            <Badge 
              variant={percentage >= 70 ? "default" : "secondary"}
              className="text-lg px-4 py-2"
            >
              {percentage >= 80 ? "🌟 Excellent!" : percentage >= 70 ? "✅ Great Job!" : percentage >= 50 ? "👍 Good Effort!" : "💪 Keep Learning!"}
            </Badge>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Question Review */}
            {selectedDomainData.questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-6 border-2 ${isCorrect ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isCorrect ? 'bg-success' : 'bg-destructive'}`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-3">{question.question}</h3>
                        
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optionIndex) => {
                            const isUserAnswer = optionIndex === userAnswer;
                            const isCorrectAnswer = optionIndex === question.correctAnswer;
                            
                            return (
                              <div
                                key={optionIndex}
                                className={`p-3 rounded-lg border ${
                                  isCorrectAnswer 
                                    ? 'border-success bg-success/10 text-success-foreground' 
                                    : isUserAnswer 
                                      ? 'border-destructive bg-destructive/10 text-destructive-foreground'
                                      : 'border-muted bg-muted/30'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                                  <span>{option}</span>
                                  {isCorrectAnswer && <Badge variant="secondary" className="ml-auto">✓ Correct</Badge>}
                                  {isUserAnswer && !isCorrectAnswer && <Badge variant="destructive" className="ml-auto">Your Answer</Badge>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {question.explanation && (
                          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <Button
              variant="hero"
              size="lg"
              onClick={handleGenerateResume}
              className="flex items-center gap-2"
            >
              <Trophy size={20} />
              Generate Professional Resume
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleRetakeQuiz}
              className="flex items-center gap-2"
            >
              Take Another Quiz
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}