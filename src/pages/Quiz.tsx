// src/pages/Quiz.tsx - FINAL GPT-4 VERSION
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Star, Trophy, CheckCircle, Loader2, Sparkles, Brain, 
  Code, Database, Shield, Cloud, Wrench, Users, MessageSquare, 
  Target, Clock, TrendingUp, Award 
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateQuiz, evaluateQuiz, generateQuizFeedback, QuizData, isOpenRouterConfigured } from "@/api/openrouter";
import { useToast } from "@/hooks/use-toast";

interface Domain {
  id: string;
  name: string;
  icon: any;
  description: string;
  category: string;
  color: string;
}

export default function Quiz() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<"category-selection" | "domain-selection" | "quiz" | "results">("category-selection");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    if (!isOpenRouterConfigured()) {
      toast({
        title: "API Not Configured",
        description: "Add OpenRouter API key to .env file",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const allDomains: Domain[] = [
    // Programming & Development
    { id: "python", name: "Python", icon: Code, description: "Python programming", category: "Programming & Development", color: "from-blue-500/20 to-blue-600/20" },
    { id: "java", name: "Java", icon: Code, description: "Java fundamentals", category: "Programming & Development", color: "from-orange-500/20 to-orange-600/20" },
    { id: "csharp", name: "C#", icon: Code, description: "C# and .NET", category: "Programming & Development", color: "from-purple-500/20 to-purple-600/20" },
    { id: "cpp", name: "C++", icon: Code, description: "C++ programming", category: "Programming & Development", color: "from-pink-500/20 to-pink-600/20" },
    { id: "javascript", name: "JavaScript", icon: Code, description: "Modern JavaScript", category: "Programming & Development", color: "from-yellow-500/20 to-yellow-600/20" },
    { id: "typescript", name: "TypeScript", icon: Code, description: "TypeScript type safety", category: "Programming & Development", color: "from-blue-500/20 to-cyan-600/20" },
    { id: "react", name: "React", icon: Code, description: "React framework", category: "Programming & Development", color: "from-cyan-500/20 to-cyan-600/20" },
    { id: "angular", name: "Angular", icon: Code, description: "Angular development", category: "Programming & Development", color: "from-red-500/20 to-red-600/20" },
    { id: "vuejs", name: "Vue.js", icon: Code, description: "Vue.js fundamentals", category: "Programming & Development", color: "from-green-500/20 to-green-600/20" },
    { id: "nodejs", name: "Node.js", icon: Code, description: "Backend Node.js", category: "Programming & Development", color: "from-green-500/20 to-lime-600/20" },
    { id: "django", name: "Django", icon: Code, description: "Python Django", category: "Programming & Development", color: "from-green-700/20 to-green-800/20" },
    { id: "springboot", name: "Spring Boot", icon: Code, description: "Java Spring Boot", category: "Programming & Development", color: "from-green-500/20 to-emerald-600/20" },
    { id: "flutter", name: "Flutter", icon: Code, description: "Flutter development", category: "Programming & Development", color: "from-blue-400/20 to-blue-500/20" },
    { id: "reactnative", name: "React Native", icon: Code, description: "React Native apps", category: "Programming & Development", color: "from-cyan-400/20 to-blue-500/20" },
    { id: "swift", name: "Swift", icon: Code, description: "iOS with Swift", category: "Programming & Development", color: "from-orange-500/20 to-red-600/20" },
    { id: "kotlin", name: "Kotlin", icon: Code, description: "Android with Kotlin", category: "Programming & Development", color: "from-purple-500/20 to-indigo-600/20" },

    // Databases & Data
    { id: "sql", name: "SQL", icon: Database, description: "SQL fundamentals", category: "Databases & Data Management", color: "from-indigo-500/20 to-indigo-600/20" },
    { id: "mysql", name: "MySQL", icon: Database, description: "MySQL database", category: "Databases & Data Management", color: "from-blue-500/20 to-blue-700/20" },
    { id: "postgresql", name: "PostgreSQL", icon: Database, description: "PostgreSQL advanced", category: "Databases & Data Management", color: "from-blue-600/20 to-indigo-700/20" },
    { id: "mongodb", name: "MongoDB", icon: Database, description: "NoSQL MongoDB", category: "Databases & Data Management", color: "from-green-500/20 to-green-700/20" },
    { id: "redis", name: "Redis", icon: Database, description: "Redis caching", category: "Databases & Data Management", color: "from-red-500/20 to-red-600/20" },
    { id: "cassandra", name: "Cassandra", icon: Database, description: "Distributed databases", category: "Databases & Data Management", color: "from-blue-500/20 to-purple-600/20" },
    { id: "excel", name: "Excel", icon: Database, description: "Data analysis Excel", category: "Databases & Data Management", color: "from-green-600/20 to-green-700/20" },
    { id: "pandas", name: "Pandas", icon: Database, description: "Python Pandas", category: "Databases & Data Management", color: "from-blue-500/20 to-blue-600/20" },
    { id: "rlang", name: "R Programming", icon: Database, description: "Statistical analysis R", category: "Databases & Data Management", color: "from-blue-400/20 to-blue-500/20" },

    // Networking & Security
    { id: "tcpip", name: "TCP/IP", icon: Shield, description: "Network protocols", category: "Networking & Security", color: "from-cyan-500/20 to-cyan-600/20" },
    { id: "dns", name: "DNS", icon: Shield, description: "Domain Name System", category: "Networking & Security", color: "from-blue-500/20 to-blue-600/20" },
    { id: "http", name: "HTTP/HTTPS", icon: Shield, description: "Web protocols", category: "Networking & Security", color: "from-green-500/20 to-green-600/20" },
    { id: "firewalls", name: "Firewalls", icon: Shield, description: "Network security", category: "Networking & Security", color: "from-red-500/20 to-red-600/20" },
    { id: "vpn", name: "VPN", icon: Shield, description: "Virtual Private Networks", category: "Networking & Security", color: "from-purple-500/20 to-purple-600/20" },
    { id: "networktroubleshooting", name: "Network Troubleshooting", icon: Shield, description: "Diagnose network issues", category: "Networking & Security", color: "from-orange-500/20 to-orange-600/20" },
    { id: "cybersecurity", name: "Cybersecurity", icon: Shield, description: "Security practices", category: "Networking & Security", color: "from-red-600/20 to-red-700/20" },
    { id: "pentesting", name: "Penetration Testing", icon: Shield, description: "Ethical hacking", category: "Networking & Security", color: "from-gray-600/20 to-gray-800/20" },

    // Cloud & DevOps
    { id: "aws", name: "AWS", icon: Cloud, description: "Amazon Web Services", category: "Cloud & DevOps", color: "from-orange-500/20 to-orange-600/20" },
    { id: "azure", name: "Azure", icon: Cloud, description: "Microsoft Azure", category: "Cloud & DevOps", color: "from-blue-500/20 to-blue-600/20" },
    { id: "gcp", name: "Google Cloud", icon: Cloud, description: "Google Cloud Platform", category: "Cloud & DevOps", color: "from-red-500/20 to-yellow-600/20" },
    { id: "cicd", name: "CI/CD", icon: Cloud, description: "CI/CD pipelines", category: "Cloud & DevOps", color: "from-green-500/20 to-green-600/20" },
    { id: "docker", name: "Docker", icon: Cloud, description: "Docker containers", category: "Cloud & DevOps", color: "from-blue-400/20 to-blue-500/20" },
    { id: "kubernetes", name: "Kubernetes", icon: Cloud, description: "K8s orchestration", category: "Cloud & DevOps", color: "from-blue-500/20 to-purple-600/20" },
    { id: "git", name: "Git", icon: Cloud, description: "Version control", category: "Cloud & DevOps", color: "from-orange-500/20 to-red-600/20" },
    { id: "github", name: "GitHub", icon: Cloud, description: "GitHub workflows", category: "Cloud & DevOps", color: "from-gray-700/20 to-gray-900/20" },

    // Technical Tools
    { id: "apis", name: "APIs", icon: Wrench, description: "API design", category: "Other Technical Tools", color: "from-purple-500/20 to-purple-600/20" },
    { id: "rest", name: "RESTful Services", icon: Wrench, description: "REST APIs", category: "Other Technical Tools", color: "from-blue-500/20 to-blue-600/20" },
    { id: "graphql", name: "GraphQL", icon: Wrench, description: "GraphQL queries", category: "Other Technical Tools", color: "from-pink-500/20 to-pink-600/20" },
    { id: "jest", name: "Jest", icon: Wrench, description: "JavaScript testing", category: "Other Technical Tools", color: "from-red-500/20 to-red-600/20" },
    { id: "selenium", name: "Selenium", icon: Wrench, description: "Automated testing", category: "Other Technical Tools", color: "from-green-500/20 to-green-600/20" },
    { id: "jira", name: "Jira", icon: Wrench, description: "Agile management", category: "Other Technical Tools", color: "from-blue-500/20 to-blue-700/20" },
    { id: "trello", name: "Trello", icon: Wrench, description: "Task management", category: "Other Technical Tools", color: "from-blue-400/20 to-blue-500/20" },

    // Soft Skills
    { id: "communication", name: "Communication", icon: MessageSquare, description: "Communication skills", category: "Communication & Collaboration", color: "from-green-500/20 to-green-600/20" },
    { id: "teamwork", name: "Teamwork", icon: Users, description: "Team collaboration", category: "Communication & Collaboration", color: "from-blue-500/20 to-blue-600/20" },
    { id: "presentation", name: "Presentation Skills", icon: MessageSquare, description: "Effective presentations", category: "Communication & Collaboration", color: "from-purple-500/20 to-purple-600/20" },
    { id: "criticalthinking", name: "Critical Thinking", icon: Brain, description: "Analytical thinking", category: "Problem-Solving & Analytical", color: "from-indigo-500/20 to-indigo-600/20" },
    { id: "troubleshooting", name: "Troubleshooting", icon: Target, description: "Problem resolution", category: "Problem-Solving & Analytical", color: "from-red-500/20 to-red-600/20" },
    { id: "logicalreasoning", name: "Logical Reasoning", icon: Brain, description: "Logic skills", category: "Problem-Solving & Analytical", color: "from-cyan-500/20 to-cyan-600/20" },
    { id: "prioritization", name: "Prioritization", icon: Clock, description: "Task prioritization", category: "Time & Task Management", color: "from-orange-500/20 to-orange-600/20" },
    { id: "multitasking", name: "Multitasking", icon: Clock, description: "Managing multiple tasks", category: "Time & Task Management", color: "from-yellow-500/20 to-yellow-600/20" },
    { id: "deadlinemanagement", name: "Deadline Management", icon: Clock, description: "Meeting deadlines", category: "Time & Task Management", color: "from-red-500/20 to-red-600/20" },
    { id: "continuouslearning", name: "Continuous Learning", icon: TrendingUp, description: "Growth mindset", category: "Adaptability & Learning", color: "from-green-500/20 to-green-600/20" },
    { id: "flexibility", name: "Flexibility", icon: TrendingUp, description: "Adapting to change", category: "Adaptability & Learning", color: "from-blue-500/20 to-blue-600/20" },
    { id: "feedback", name: "Receiving Feedback", icon: TrendingUp, description: "Open to feedback", category: "Adaptability & Learning", color: "from-purple-500/20 to-purple-600/20" },
    { id: "accountability", name: "Accountability", icon: Award, description: "Responsibility", category: "Professionalism & Work Ethics", color: "from-indigo-500/20 to-indigo-600/20" },
    { id: "attention", name: "Attention to Detail", icon: Award, description: "Quality precision", category: "Professionalism & Work Ethics", color: "from-cyan-500/20 to-cyan-600/20" },
    { id: "leadership", name: "Leadership", icon: Award, description: "Leadership skills", category: "Professionalism & Work Ethics", color: "from-yellow-500/20 to-yellow-600/20" },
  ];

  const categories = [
    { id: "Programming & Development", name: "Programming & Development", icon: Code, color: "from-blue-500 to-cyan-500", description: "Languages and frameworks" },
    { id: "Databases & Data Management", name: "Databases & Data", icon: Database, color: "from-purple-500 to-pink-500", description: "SQL, NoSQL, analytics" },
    { id: "Networking & Security", name: "Networking & Security", icon: Shield, color: "from-red-500 to-orange-500", description: "Networks and security" },
    { id: "Cloud & DevOps", name: "Cloud & DevOps", icon: Cloud, color: "from-green-500 to-emerald-500", description: "Cloud and automation" },
    { id: "Other Technical Tools", name: "Technical Tools", icon: Wrench, color: "from-indigo-500 to-purple-500", description: "APIs, testing, Agile" },
    { id: "Communication & Collaboration", name: "Communication", icon: MessageSquare, color: "from-green-400 to-teal-500", description: "Teamwork and presentation" },
    { id: "Problem-Solving & Analytical", name: "Problem-Solving", icon: Brain, color: "from-cyan-500 to-blue-500", description: "Critical thinking" },
    { id: "Time & Task Management", name: "Time Management", icon: Clock, color: "from-orange-400 to-red-500", description: "Prioritization" },
    { id: "Adaptability & Learning", name: "Adaptability", icon: TrendingUp, color: "from-emerald-500 to-green-600", description: "Growth mindset" },
    { id: "Professionalism & Work Ethics", name: "Professionalism", icon: Award, color: "from-yellow-500 to-orange-500", description: "Leadership" },
  ];

  const saveQuizResult = async (score: number, totalQuestions: number, percentage: number, answers: number[]) => {
    if (!user || !selectedDomain) return;
    try {
      await supabase.from("quiz_results").insert({
        user_id: user.id,
        quiz_type: type!,
        domain_id: selectedDomain,
        score,
        total_questions: totalQuestions,
        percentage,
        answers,
        ai_generated: true,
      });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  useEffect(() => {
    if (!selectedDomain) return;
    async function fetchQuiz() {
      setLoadingQuiz(true);
      toast({ title: "Generating Quiz...", description: "GPT-4 is creating questions (15-30s)" });
      try {
        const data = await generateQuiz(selectedDomain, "medium", 10);
        if (data) {
          setQuizData(data);
          toast({ title: "Quiz Ready!", description: `${data.questions.length} questions loaded.` });
        } else {
          throw new Error("Failed to generate quiz");
        }
      } catch (error: any) {
        console.error("Quiz error:", error);
        toast({ 
          title: "Generation Failed", 
          description: error.message || "Please try again", 
          variant: "destructive" 
        });
        setCurrentStep("domain-selection");
        setSelectedDomain(null);
      } finally {
        setLoadingQuiz(false);
      }
    }
    fetchQuiz();
  }, [selectedDomain]);

  useEffect(() => {
    if (quizComplete && quizData && selectedDomain) {
      const evaluation = evaluateQuiz(quizData.questions, userAnswers);
      async function fetchFeedback() {
        const feedback = await generateQuizFeedback(evaluation.score, evaluation.totalQuestions, selectedDomain);
        setAiFeedback(feedback);
      }
      fetchFeedback();
      saveQuizResult(evaluation.score, evaluation.totalQuestions, evaluation.percentage, userAnswers);
    }
  }, [quizComplete]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep("domain-selection");
  };

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
    setCurrentStep("quiz");
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);
    if (currentQuestion === quizData!.questions.length - 1) {
      setQuizComplete(true);
      setCurrentStep("results");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentStep("category-selection");
    setSelectedCategory(null);
    setSelectedDomain(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizComplete(false);
    setQuizData(null);
    setAiFeedback("");
  };

  const handleGenerateResume = () => {
    if (!quizData) return;
    const evaluation = evaluateQuiz(quizData.questions, userAnswers);
    const selectedDomainData = allDomains.find(d => d.id === selectedDomain);
    navigate(`/results/${type}`, { 
      state: {
        domain: {
          id: selectedDomain,
          name: selectedDomainData?.name || quizData.title,
          icon: selectedDomainData?.icon,
          description: selectedDomainData?.description
        },
        score: evaluation.score,
        totalQuestions: evaluation.totalQuestions,
        percentage: evaluation.percentage,
        answers: userAnswers,
        questions: quizData.questions,
        aiFeedback,
      }
    });
  };

  // CATEGORY SELECTION
  if (currentStep === "category-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2">
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">GPT-4 Powered Quizzes</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Choose Your Skill Category</h1>
              <p className="text-xl text-muted-foreground">Select a category for your assessment</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50 h-full"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 mx-auto`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-center">{category.name}</h3>
                      <p className="text-muted-foreground text-sm text-center mb-4">{category.description}</p>
                      <Badge variant="secondary" className="text-xs w-full justify-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {allDomains.filter(d => d.category === category.id).length} Topics
                      </Badge>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DOMAIN SELECTION
  if (currentStep === "domain-selection") {
    const filteredDomains = allDomains.filter(d => d.category === selectedCategory);
    const selectedCategoryData = categories.find(c => c.id === selectedCategory);

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setCurrentStep("category-selection")} className="mb-8 flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Categories
          </Button>
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">{selectedCategoryData?.name}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Select a Topic</h1>
              <p className="text-xl text-muted-foreground">Choose a skill to test</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDomains.map((domain, index) => {
                const Icon = domain.icon;
                return (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`p-5 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50 h-full bg-gradient-to-br ${domain.color}`}
                      onClick={() => handleDomainSelect(domain.id)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <Icon className="h-10 w-10 mb-3 text-primary" />
                        <h3 className="text-lg font-semibold mb-2">{domain.name}</h3>
                        <p className="text-muted-foreground text-xs mb-3">{domain.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          GPT-4 Quiz
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ LOADING
  if (currentStep === "quiz" && loadingQuiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Generating Your Quiz...</p>
          <p className="text-muted-foreground">GPT-4 is creating personalized questions</p>
          <p className="text-sm text-muted-foreground mt-2">This takes 15-30 seconds</p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Powered by GPT-4</span>
        </div>
      </div>
    );
  }

  // QUIZ ACTIVE
  if (currentStep === "quiz" && quizData) {
    const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
    const currentQuestionData = quizData.questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => setCurrentStep("domain-selection")} className="flex items-center gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
            <Badge variant="secondary">
              <Star size={14} className="mr-1" /> Question {currentQuestion + 1}
            </Badge>
          </div>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="h-3 w-3" />{quizData.title}
              </span>
              <span>{currentQuestion + 1} / {quizData.questions.length}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          <div className="max-w-3xl mx-auto">
            <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-8 shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">{currentQuestionData.question}</h2>
                  <p className="text-muted-foreground">Select the best answer</p>
                </div>
                <div className="space-y-4">
                  {currentQuestionData.options.map((option: string, index: number) => (
                    <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full p-6 h-auto text-left justify-start hover:border-primary hover:bg-primary/5"
                        onClick={() => handleAnswer(index)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center font-bold flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-base flex-1">{option}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS
  if (currentStep === "results" && quizData) {
    const evaluation = evaluateQuiz(quizData.questions, userAnswers);
    const selectedDomainData = allDomains.find(d => d.id === selectedDomain);
    const Icon = selectedDomainData?.icon || Brain;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
              <p className="text-xl text-muted-foreground">Here's your performance</p>
            </motion.div>

            <Card className="p-8 mb-6 shadow-lg">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">{selectedDomainData?.name}</h2>
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-3xl font-bold text-primary">{evaluation.score}</p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-3xl font-bold text-primary">{evaluation.totalQuestions}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-3xl font-bold text-primary">{evaluation.percentage}%</p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                </div>
              </div>

              {aiFeedback && (
                <div className="mb-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">GPT-4 Feedback</h3>
                      <p className="text-muted-foreground">{aiFeedback}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Question Review</h3>
                {quizData.questions.map((question, index) => {
                  const isCorrect = evaluation.correctAnswers[index];
                  return (
                    <Card key={index} className={`p-4 ${isCorrect ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                          {isCorrect ? <CheckCircle className="h-4 w-4 text-white" /> : <span className="text-white text-xs">✕</span>}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.question}</p>
                          <div className="text-sm space-y-1">
                            <p className="text-muted-foreground">
                              Your answer: <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{question.options[userAnswers[index]]}</span>
                            </p>
                            {!isCorrect && (
                              <p className="text-muted-foreground">
                                Correct: <span className="text-green-600 font-medium">{question.options[question.correctAnswer]}</span>
                              </p>
                            )}
                            {question.explanation && (
                              <p className="text-muted-foreground mt-2 pt-2 border-t">
                                <span className="font-medium">Explanation:</span> {question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={handleRetakeQuiz} variant="outline">
                Take Another Quiz
              </Button>
              <Button size="lg" onClick={handleGenerateResume} className="gap-2">
                <Trophy className="h-4 w-4" />
                View Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}