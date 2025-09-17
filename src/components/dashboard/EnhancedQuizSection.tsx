import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Users, 
  Target, 
  Code, 
  Lightbulb, 
  BookOpen,
  Trophy,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface QuizResult {
  id: string;
  quiz_type: string;
  domain_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

const EnhancedQuizSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  const quizCategories = [
    {
      id: 'technical',
      title: 'Technical Skills',
      description: 'Programming, algorithms, and technical problem-solving',
      icon: Code,
      color: 'bg-blue-500',
      quizzes: [
        { id: 'cognitive', name: 'Cognitive & Learning', domains: ['python', 'algorithms', 'java'] },
        { id: 'sensory', name: 'Sensory & Processing', domains: ['webdev', 'databases'] }
      ]
    },
    {
      id: 'soft-skills',
      title: 'Soft Skills',
      description: 'Communication, teamwork, and interpersonal abilities',
      icon: Users,
      color: 'bg-green-500',
      quizzes: [
        { id: 'communication', name: 'Communication Skills', domains: ['verbal', 'written', 'presentation'] },
        { id: 'teamwork', name: 'Teamwork & Collaboration', domains: ['leadership', 'conflict-resolution'] }
      ]
    },
    {
      id: 'career-alignment',
      title: 'Career Alignment',
      description: 'Interest mapping and career path exploration',
      icon: Target,
      color: 'bg-purple-500',
      quizzes: [
        { id: 'motor', name: 'Motor & Coordination', domains: ['coordination', 'spatial', 'mechanical'] },
        { id: 'interests', name: 'Career Interests', domains: ['analytical', 'creative', 'social'] }
      ]
    }
  ];

  useEffect(() => {
    fetchQuizResults();
  }, [user]);

  const fetchQuizResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setQuizResults(data || []);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuizProgress = (categoryId: string) => {
    const category = quizCategories.find(c => c.id === categoryId);
    if (!category) return { completed: 0, total: 0, percentage: 0 };

    const totalQuizzes = category.quizzes.reduce((acc, quiz) => acc + quiz.domains.length, 0);
    const completedQuizzes = quizResults.filter(result => 
      category.quizzes.some(quiz => quiz.id === result.quiz_type)
    ).length;

    return {
      completed: completedQuizzes,
      total: totalQuizzes,
      percentage: totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0
    };
  };

  const getLatestResult = (quizType: string) => {
    return quizResults.find(result => result.quiz_type === quizType);
  };

  const handleStartQuiz = (quizType: string) => {
    navigate(`/quiz/${quizType}`);
  };

  return (
    <div className="space-y-8">
      {/* Quiz Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizCategories.map((category) => {
          const progress = getQuizProgress(category.id);
          const Icon = category.icon;
          
          return (
            <Card key={category.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${category.color}`} />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">
                    {progress.completed}/{progress.total}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription className="text-sm">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    {category.quizzes.map((quiz) => {
                      const result = getLatestResult(quiz.id);
                      return (
                        <div key={quiz.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{quiz.name}</p>
                            {result && (
                              <p className="text-xs text-muted-foreground">
                                Last: {result.percentage}% • {new Date(result.completed_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant={result ? "outline" : "default"}
                            onClick={() => handleStartQuiz(quiz.id)}
                          >
                            {result ? (
                              <>
                                <Trophy className="h-3 w-3 mr-1" />
                                Retake
                              </>
                            ) : (
                              <>
                                <ChevronRight className="h-3 w-3 mr-1" />
                                Start
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Quiz Results */}
      {quizResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Quiz Results
            </CardTitle>
            <CardDescription>
              Your latest quiz attempts and scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizResults.slice(0, 5).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{result.quiz_type.charAt(0).toUpperCase() + result.quiz_type.slice(1)}</h4>
                      <Badge variant="outline" className="text-xs">
                        {result.domain_id}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date(result.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {result.percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.score}/{result.total_questions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Instructions */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Quiz Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Before You Start:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Find a quiet, comfortable environment</li>
                <li>• Ensure stable internet connection</li>
                <li>• Take your time - there's no rush</li>
                <li>• Use accessibility features if needed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features Available:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Adjustable font sizes and themes</li>
                <li>• Screen reader compatibility</li>
                <li>• Optional hints for questions</li>
                <li>• Progress saving (can resume later)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedQuizSection;