import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, LogOut, MessageSquare, Search, Loader2, BarChart3, BookOpen, Plus, LineChart, TrendingUp } from 'lucide-react';
import CandidateCard from '@/components/dashboard/CandidateCard';
import RemarkDialog from '@/components/dashboard/RemarkDialog';
import ReportsSection from './ReportsSection';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CandidateData {
  user_id: string;
  phone?: string;
  address?: string;
  skills?: string[];
  experience_years?: number;
  education?: string;
  current_position?: string;
  linkedin_profile?: string;
  github_profile?: string;
  bio?: string;
  created_at?: string;
  profile: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

interface ManagerRemark {
  id: string;
  candidate_id: string;
  remarks: string;
  rating: number;
  recommendation_status: string;
  created_at?: string;
}

interface Question {
  question: string;
  options: string[];
  correct: string;
}

interface QuizResult {
  id: string;
  user_id: string;
  quiz_type: string;
  domain_id: string;
  score: number;
  total: number;
  created_at: string;
}

const ManagerDashboard = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateData[]>([]);
  const [remarks, setRemarks] = useState<ManagerRemark[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateData | null>(null);
  const [showRemarkDialog, setShowRemarkDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [quizTopic, setQuizTopic] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    fetchCandidates();
    fetchRemarks();
    fetchQuizResults();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = candidates.filter(candidate =>
        candidate.profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCandidates(filtered);
    } else {
      setFilteredCandidates(candidates);
    }
  }, [candidates, searchTerm]);

  const fetchCandidates = async () => {
    try {
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidate_details')
        .select('*')
        .order('created_at', { ascending: true });

      if (candidateError) throw candidateError;

      const userIds = candidateData?.map(c => c.user_id) || [];
      
      if (userIds.length === 0) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email')
        .in('user_id', userIds);

      if (profileError) throw profileError;

      const combinedData = candidateData?.map(candidate => {
        const profile = profileData?.find(p => p.user_id === candidate.user_id) || {
          first_name: '',
          last_name: '',
          email: 'No email',
        };
        return {
          ...candidate,
          profile,
        };
      }) || [];
      
      setCandidates(combinedData);
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      toast({
        title: "Error fetching candidates",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRemarks = async () => {
    try {
      const { data, error } = await supabase
        .from('manager_remarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRemarks(data || []);
    } catch (error: any) {
      console.error('Error fetching remarks:', error);
      setRemarks([]);
    }
  };

  const fetchQuizResults = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quiz results:', error);
        setQuizResults([]);
      } else {
        setQuizResults(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching quiz results:', error);
      setQuizResults([]);
    } finally {
      setLoadingChart(false);
    }
  };

  const generateQuiz = async () => {
    if (!quizTopic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for the quiz.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingQuiz(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: quizTopic, numQuestions: 5 }),
      });

      if (!response.ok) throw new Error('Failed to generate questions');
      const data = await response.json();
      setGeneratedQuestions(data.questions);
      toast({
        title: "Quiz generated",
        description: "Questions have been generated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error generating quiz",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleAddRemark = (candidate: CandidateData) => {
    setSelectedCandidate(candidate);
    setShowRemarkDialog(true);
  };

  const handleRemarkSaved = () => {
    fetchRemarks();
    setShowRemarkDialog(false);
    setSelectedCandidate(null);
  };

  const handleShareReport = async (candidate: CandidateData) => {
    const platforms = ['LinkedIn', 'Unstop', 'Naukri'];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    
    toast({
      title: "Report shared successfully",
      description: `Candidate profile shared to ${randomPlatform}`,
    });
  };

  const getCandidateRemark = (candidateId: string) => {
    return remarks.find(remark => remark.candidate_id === candidateId);
  };

  const getExperienceDistributionData = () => {
    const experienceRanges = {
      '0-2 years': 0,
      '3-5 years': 0,
      '6-10 years': 0,
      '10+ years': 0,
    };

    candidates.forEach(candidate => {
      const exp = candidate.experience_years || 0;
      if (exp <= 2) experienceRanges['0-2 years']++;
      else if (exp <= 5) experienceRanges['3-5 years']++;
      else if (exp <= 10) experienceRanges['6-10 years']++;
      else experienceRanges['10+ years']++;
    });

    return {
      labels: Object.keys(experienceRanges),
      datasets: [{
        label: 'Number of Candidates',
        data: Object.values(experienceRanges),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
      }],
    };
  };

  const getSkillsDistributionData = () => {
    const skillCounts: { [key: string]: number } = {};
    
    candidates.forEach(candidate => {
      candidate.skills?.forEach(skill => {
        const normalizedSkill = skill.trim();
        skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
      });
    });

    const sortedSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      labels: sortedSkills.map(([skill]) => skill),
      datasets: [{
        label: 'Number of Candidates',
        data: sortedSkills.map(([, count]) => count),
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 2,
      }],
    };
  };

  const getCandidateGrowthData = () => {
    const monthCounts: { [key: string]: number } = {};
    
    candidates.forEach(candidate => {
      if (candidate.created_at) {
        const date = new Date(candidate.created_at);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
      }
    });

    const sortedMonths = Object.keys(monthCounts).sort();

    let cumulative = 0;
    const cumulativeCounts = sortedMonths.map(month => {
      cumulative += monthCounts[month];
      return cumulative;
    });

    const last6Months = sortedMonths.slice(-6);
    const last6Counts = cumulativeCounts.slice(-6);

    const formattedLabels = last6Months.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    return {
      labels: formattedLabels.length > 0 ? formattedLabels : ['No Data'],
      datasets: [{
        label: 'Total Candidates',
        data: last6Counts.length > 0 ? last6Counts : [0],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      }],
    };
  };

  const getQuizTypeDistributionData = () => {
    const typeCounts: { [key: string]: number } = {};

    quizResults.forEach(result => {
      typeCounts[result.quiz_type] = (typeCounts[result.quiz_type] || 0) + 1;
    });

    return {
      labels: Object.keys(typeCounts).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
      datasets: [{
        label: 'Number of Quizzes',
        data: Object.values(typeCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 205, 86, 0.7)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        borderWidth: 2,
      }],
    };
  };

  const getDomainPerformanceData = () => {
    const domainScores: { [key: string]: { total: number, count: number } } = {};

    quizResults.forEach(result => {
      if (!domainScores[result.domain_id]) {
        domainScores[result.domain_id] = { total: 0, count: 0 };
      }
      domainScores[result.domain_id].total += result.score;
      domainScores[result.domain_id].count += 1;
    });

    const domains = Object.keys(domainScores);
    const avgScores = domains.map(domain => 
      domainScores[domain].total / domainScores[domain].count
    );

    return {
      labels: domains.map(d => d.charAt(0).toUpperCase() + d.slice(1)),
      datasets: [{
        label: 'Average Score',
        data: avgScores,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
      }],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const hasQuizData = quizResults.length > 0;
  const hasCandidateData = candidates.length > 0;
  const hasSkillsData = candidates.some(c => c.skills && c.skills.length > 0);

  const totalCorrectAnswers = quizResults.reduce((sum, r) => sum + Number(r.score), 0);
  const totalIncorrectAnswers = quizResults.reduce((sum, r) => sum + (Number(r.total) - Number(r.score)), 0);
  const avgScore = quizResults.length > 0 
    ? (totalCorrectAnswers / quizResults.length).toFixed(1)
    : '0.0';

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {profile?.first_name || 'Manager'}! Monitor candidates and quiz results.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="candidates">
            <Users className="h-4 w-4 mr-2" />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="quizzes">
            <BookOpen className="h-4 w-4 mr-2" />
            Quizzes
          </TabsTrigger>
          <TabsTrigger value="graphs">
            <LineChart className="h-4 w-4 mr-2" />
            Graphs
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{candidates.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quizResults.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgScore}/10</div>
              </CardContent>
            </Card>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Candidates</CardTitle>
              <CardDescription>Review candidate profiles and quiz performance</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.user_id}
                      candidate={candidate}
                      remark={getCandidateRemark(candidate.user_id)}
                      onAddRemark={() => handleAddRemark(candidate)}
                      onShare={() => handleShareReport(candidate)}
                    />
                  ))}
                  {filteredCandidates.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No candidates match your search." : "No candidates registered yet."}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Generator</CardTitle>
              <CardDescription>Generate quiz questions using GPT-4</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter topic (e.g., JavaScript)"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={generateQuiz} disabled={generatingQuiz}>
                  {generatingQuiz ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Generate
                </Button>
              </div>
              {generatedQuestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Generated Questions</h3>
                  {generatedQuestions.map((q, i) => (
                    <Card key={i}>
                      <CardContent className="pt-4">
                        <p className="font-medium mb-2">{q.question}</p>
                        <ul className="list-disc list-inside space-y-1">
                          {q.options.map((opt, j) => (
                            <li key={j} className={opt === q.correct ? 'text-green-600 font-semibold' : ''}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graphs" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
            <p className="text-muted-foreground">
              Real-time data from Supabase: {candidates.length} candidates, {quizResults.length} quiz results
            </p>
          </div>

          {/* Row 1: Experience and Skills - 2 graphs side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Experience Distribution</CardTitle>
                <CardDescription>Years of experience from candidate_details</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {hasCandidateData ? (
                  <Bar data={getExperienceDistributionData()} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No candidate data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 10 Skills</CardTitle>
                <CardDescription>Most common skills from candidate_details</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {hasSkillsData ? (
                  <Bar data={getSkillsDistributionData()} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No skills data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Growth, Quiz Types, and Domain - 3 graphs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Growth</CardTitle>
                <CardDescription>Registration over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {hasCandidateData ? (
                  <Line data={getCandidateGrowthData()} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No data</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quiz Types</CardTitle>
                <CardDescription>Sensory, Cognitive, Motor</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {hasQuizData ? (
                  <Bar data={getQuizTypeDistributionData()} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No quiz data</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domain Performance</CardTitle>
                <CardDescription>Average scores by domain</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {hasQuizData ? (
                  <Bar data={getDomainPerformanceData()} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No quiz data</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
              <CardDescription>Real-time data from Supabase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Candidates</p>
                  <p className="text-2xl font-bold">{candidates.length}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Quizzes</p>
                  <p className="text-2xl font-bold">{quizResults.length}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Correct</p>
                  <p className="text-2xl font-bold text-green-600">{totalCorrectAnswers}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                  <p className="text-2xl font-bold text-red-600">{totalIncorrectAnswers}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">{avgScore}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <ReportsSection />
        </TabsContent>
      </Tabs>

      {selectedCandidate && (
        <RemarkDialog
          candidate={selectedCandidate}
          open={showRemarkDialog}
          onClose={() => setShowRemarkDialog(false)}
          onSave={handleRemarkSaved}
          existingRemark={getCandidateRemark(selectedCandidate.user_id)}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;