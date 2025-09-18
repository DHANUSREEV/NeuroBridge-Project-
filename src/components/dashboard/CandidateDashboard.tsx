import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Settings, LogOut, BarChart3, Trophy, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileCompletionFlow from '@/components/dashboard/ProfileCompletionFlow';
import EnhancedQuizSection from '@/components/dashboard/EnhancedQuizSection';
import ResumeGenerator from '@/components/dashboard/ResumeGenerator';
import AccessibilitySettings from '@/components/dashboard/AccessibilitySettings';

interface CandidateDetails {
  phone: string;
  address: string;
  skills: string[];
  experience_years: number | null;
  education: string;
  current_position: string;
  linkedin_profile: string;
  github_profile: string;
  bio: string;
  accessibility_preferences: any;
}

const CandidateDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'home' | 'update-details' | 'accessibility' | 'quiz' | 'resume'>('home');
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [details, setDetails] = useState<CandidateDetails>({
    phone: '',
    address: '',
    skills: [],
    experience_years: null,
    education: '',
    current_position: '',
    linkedin_profile: '',
    github_profile: '',
    bio: '',
    accessibility_preferences: {},
  });

  useEffect(() => {
    checkProfileCompletion();
  }, [user]);

  const checkProfileCompletion = async () => {
    if (!user) return;

    try {
      const [detailsResponse, quizResponse] = await Promise.all([
        supabase
          .from('candidate_details')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
      ]);

      if (detailsResponse.data) {
        setDetails({
          phone: detailsResponse.data.phone || '',
          address: detailsResponse.data.address || '',
          skills: detailsResponse.data.skills || [],
          experience_years: detailsResponse.data.experience_years,
          education: detailsResponse.data.education || '',
          current_position: detailsResponse.data.current_position || '',
          linkedin_profile: detailsResponse.data.linkedin_profile || '',
          github_profile: detailsResponse.data.github_profile || '',
          bio: detailsResponse.data.bio || '',
          accessibility_preferences: detailsResponse.data.accessibility_preferences || {},
        });

        setProfileCompleted(detailsResponse.data.profile_completed || false);

        // Apply accessibility preferences
        if (detailsResponse.data.accessibility_preferences) {
          applyAccessibilityPreferences(detailsResponse.data.accessibility_preferences);
        }
      }

      if (quizResponse.data) {
        setQuizResults(quizResponse.data);
      }
    } catch (error: any) {
      if (error.code !== 'PGRST116') {
        toast({
          title: "Error fetching details",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = () => {
    setProfileCompleted(true);
    checkProfileCompletion(); // Refresh data
    toast({
      title: "Welcome to your dashboard!",
      description: "Your profile is complete. You can now access all features.",
    });
  };

  // Apply accessibility preferences to the DOM
  const applyAccessibilityPreferences = (prefs: any) => {
    const root = document.documentElement;
    
    // Apply font size
    if (prefs.fontSize) {
      root.style.fontSize = `${prefs.fontSize}px`;
    }
    
    // Apply high contrast mode
    if (prefs.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (prefs.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Apply color theme
    if (prefs.colorTheme) {
      root.setAttribute('data-theme', prefs.colorTheme);
    }
  };

  const handleSkillsChange = (value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setDetails({ ...details, skills: skillsArray });
  };

  const saveProfileDetails = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('candidate_details')
        .upsert({
          user_id: user.id,
          ...details,
          profile_completed: true,
        });

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your details have been saved successfully.",
      });
      
      // Refresh data
      await checkProfileCompletion();
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show profile completion flow if profile is not completed
  if (!profileCompleted) {
    return <ProfileCompletionFlow onComplete={handleProfileComplete} />;
  }

  const getProgressStats = () => {
    const totalQuizzes = 6; // Based on available quiz types
    const completedQuizzes = quizResults.length;
    const averageScore = quizResults.length > 0 
      ? Math.round(quizResults.reduce((sum: number, result: any) => sum + result.percentage, 0) / quizResults.length)
      : 0;
    
    return {
      completedQuizzes,
      totalQuizzes,
      averageScore,
      progressPercentage: Math.round((completedQuizzes / totalQuizzes) * 100)
    };
  };

  const stats = getProgressStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {profile?.first_name}!</h1>
              <p className="text-muted-foreground">
                Your neurodivergent-friendly career development dashboard
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {activeSection !== 'home' && (
              <Button
                variant="outline"
                onClick={() => setActiveSection('home')}
              >
                <User className="h-4 w-4 mr-2" />
                Dashboard Home
              </Button>
            )}
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Render different sections based on activeSection */}
        {activeSection === 'home' && (
          <>
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.progressPercentage}%</div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.completedQuizzes}</div>
                  <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.averageScore}%</div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 text-info mx-auto mb-2" />
                  <div className="text-2xl font-bold">✓</div>
                  <p className="text-sm text-muted-foreground">Profile Complete</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Update Details */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader onClick={() => setActiveSection('update-details')}>
                  <CardTitle className="flex items-center gap-3">
                    <User className="h-8 w-8 text-primary" />
                    Update Details
                  </CardTitle>
                  <CardDescription>
                    Manage your personal and professional information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Profile Completion</span>
                      <span className="text-success font-medium">100%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-success h-2 rounded-full w-full" />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => setActiveSection('update-details')}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Accessibility Settings */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader onClick={() => setActiveSection('accessibility')}>
                  <CardTitle className="flex items-center gap-3">
                    <Settings className="h-8 w-8 text-primary" />
                    Accessibility Settings
                  </CardTitle>
                  <CardDescription>
                    Customize your experience for better usability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Available settings: Font size, High contrast, Color themes, Reduced motion
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => setActiveSection('accessibility')}
                    >
                      Configure Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Selection */}
              <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${!profileCompleted ? 'opacity-60' : ''}`}>
                <CardHeader onClick={() => profileCompleted && setActiveSection('quiz')}>
                  <CardTitle className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-primary" />
                    Quiz Selection
                    {!profileCompleted && <span className="text-sm bg-muted px-2 py-1 rounded">Locked</span>}
                  </CardTitle>
                  <CardDescription>
                    {profileCompleted 
                      ? "Take assessments to showcase your skills"
                      : "Complete your profile to unlock quizzes"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Quizzes Available</span>
                      <span>{stats.totalQuizzes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span className="text-success font-medium">{stats.completedQuizzes}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      disabled={!profileCompleted}
                      onClick={() => setActiveSection('quiz')}
                    >
                      {profileCompleted ? 'Start Quiz' : 'Complete Profile First'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity & Recommendations</CardTitle>
                <CardDescription>
                  Your latest achievements and suggested next steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Latest Achievement
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {quizResults.length > 0 
                        ? `Completed ${(quizResults[0] as any).quiz_type} quiz with ${(quizResults[0] as any).percentage}% score`
                        : "Complete your first quiz to earn achievements"
                      }
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setActiveSection('resume')}
                    >
                      View Resume
                    </Button>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Next Recommendation
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {stats.completedQuizzes === 0 
                        ? "Take your first technical skills assessment"
                        : stats.completedQuizzes < 3
                        ? "Continue with soft skills evaluations" 
                        : "Generate and download your professional resume"
                      }
                    </p>
                    <Button 
                      size="sm"
                      onClick={() => {
                        if (stats.completedQuizzes < 3) {
                          setActiveSection('quiz');
                        } else {
                          setActiveSection('resume');
                        }
                      }}
                    >
                      {stats.completedQuizzes < 3 ? "Take Quiz" : "Generate Resume"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Update Details Section */}
        {activeSection === 'update-details' && (
          <Card>
            <CardHeader>
              <CardTitle>Update Your Details</CardTitle>
              <CardDescription>
                Keep your professional information up to date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    placeholder="Your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={details.experience_years || ''}
                    onChange={(e) => setDetails({ 
                      ...details, 
                      experience_years: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    placeholder="Years of professional experience"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_position">Current Position</Label>
                <Input
                  id="current_position"
                  value={details.current_position}
                  onChange={(e) => setDetails({ ...details, current_position: e.target.value })}
                  placeholder="Your current job title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Textarea
                  id="skills"
                  value={details.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  placeholder="React, TypeScript, Node.js, Python, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={details.bio}
                  onChange={(e) => setDetails({ ...details, bio: e.target.value })}
                  placeholder="Tell us about yourself, your strengths, and what makes you unique..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setActiveSection('home')} variant="outline">
                  Back to Dashboard
                </Button>
                <Button onClick={saveProfileDetails} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accessibility Section */}
        {activeSection === 'accessibility' && (
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Settings</CardTitle>
              <CardDescription>
                Customize your experience for better usability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccessibilitySettings 
                preferences={details.accessibility_preferences}
                onUpdate={(prefs) => setDetails({ ...details, accessibility_preferences: prefs })}
              />
              <div className="mt-6">
                <Button onClick={() => setActiveSection('home')} variant="outline">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quiz Section */}
        {activeSection === 'quiz' && (
          <div>
            <div className="mb-6">
              <Button onClick={() => setActiveSection('home')} variant="outline">
                Back to Dashboard
              </Button>
            </div>
            <EnhancedQuizSection />
          </div>
        )}

        {/* Resume Section */}
        {activeSection === 'resume' && (
          <div>
            <div className="mb-6">
              <Button onClick={() => setActiveSection('home')} variant="outline">
                Back to Dashboard
              </Button>
            </div>
            <ResumeGenerator />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;