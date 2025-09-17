import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Eye, 
  RefreshCw, 
  Star,
  Trophy,
  Award,
  Target
} from 'lucide-react';

interface QuizResult {
  id: string;
  quiz_type: string;
  domain_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

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
}

interface ResumeData {
  personalInfo: any;
  skills: string[];
  achievements: any[];
  certifications: any[];
  quizResults: QuizResult[];
  generatedAt: string;
}

const ResumeGenerator: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumePreview, setResumePreview] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch quiz results and candidate details in parallel
      const [quizResponse, detailsResponse] = await Promise.all([
        supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false }),
        supabase
          .from('candidate_details')
          .select('*')
          .eq('user_id', user.id)
          .single()
      ]);

      if (quizResponse.error && quizResponse.error.code !== 'PGRST116') {
        throw quizResponse.error;
      }
      if (detailsResponse.error && detailsResponse.error.code !== 'PGRST116') {
        throw detailsResponse.error;
      }

      setQuizResults(quizResponse.data || []);
      setCandidateDetails(detailsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const generateResumeData = (): ResumeData => {
    const achievements = [];
    const certifications = [];
    const skills = candidateDetails?.skills || [];

    // Process quiz results into achievements and certifications
    quizResults.forEach((result) => {
      if (result.percentage >= 80) {
        achievements.push({
          title: `Excellent Performance in ${result.quiz_type}`,
          description: `Scored ${result.percentage}% (${result.score}/${result.total_questions}) in ${result.domain_id}`,
          level: 'excellent',
          date: result.completed_at
        });
      } else if (result.percentage >= 70) {
        achievements.push({
          title: `Strong Performance in ${result.quiz_type}`,
          description: `Scored ${result.percentage}% (${result.score}/${result.total_questions}) in ${result.domain_id}`,
          level: 'good',
          date: result.completed_at
        });
      }

      certifications.push({
        name: `${result.quiz_type.charAt(0).toUpperCase() + result.quiz_type.slice(1)} Assessment - ${result.domain_id}`,
        score: `${result.percentage}%`,
        date: result.completed_at,
        badge: result.percentage >= 80 ? 'gold' : result.percentage >= 70 ? 'silver' : 'bronze'
      });
    });

    // Add skills from quiz performance
    quizResults.forEach((result) => {
      if (result.percentage >= 70) {
        const skillName = result.domain_id.charAt(0).toUpperCase() + result.domain_id.slice(1);
        if (!skills.includes(skillName)) {
          skills.push(skillName);
        }
      }
    });

    return {
      personalInfo: {
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
        email: profile?.email,
        phone: candidateDetails?.phone,
        address: candidateDetails?.address,
        currentPosition: candidateDetails?.current_position,
        experience: candidateDetails?.experience_years,
        education: candidateDetails?.education,
        bio: candidateDetails?.bio,
        linkedin: candidateDetails?.linkedin_profile,
        github: candidateDetails?.github_profile,
      },
      skills,
      achievements,
      certifications,
      quizResults,
      generatedAt: new Date().toISOString()
    };
  };

  const handleGenerateResume = async () => {
    if (!candidateDetails) {
      toast({
        title: "Profile incomplete",
        description: "Please complete your profile before generating a resume.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const resumeData = generateResumeData();
      setResumeData(resumeData);

      // Save resume data to database
      const { error } = await supabase
        .from('generated_resumes')
        .upsert({
          user_id: user!.id,
          resume_data: resumeData as any,
        });

      if (error) throw error;

      toast({
        title: "Resume generated successfully!",
        description: "Your professional resume has been created with your quiz results.",
      });
    } catch (error: any) {
      toast({
        title: "Error generating resume",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!resumeData) return;

    // Create a simple HTML document for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume - ${resumeData.personalInfo.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section h2 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
          .achievement { margin: 10px 0; padding: 10px; background-color: #f8fafc; border-left: 4px solid #10b981; }
          .certification { margin: 8px 0; padding: 8px; background-color: #fef3c7; border-radius: 4px; }
          .skills { display: flex; flex-wrap: wrap; gap: 8px; }
          .skill { background-color: #dbeafe; padding: 4px 8px; border-radius: 4px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${resumeData.personalInfo.name}</h1>
          <p>${resumeData.personalInfo.currentPosition}</p>
          <p>${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}</p>
        </div>
        
        <div class="section">
          <h2>Professional Summary</h2>
          <p>${resumeData.personalInfo.bio}</p>
        </div>
        
        <div class="section">
          <h2>Skills</h2>
          <div class="skills">
            ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
        
        <div class="section">
          <h2>Education</h2>
          <p>${resumeData.personalInfo.education}</p>
        </div>
        
        <div class="section">
          <h2>Achievements</h2>
          ${resumeData.achievements.map(achievement => `
            <div class="achievement">
              <strong>${achievement.title}</strong><br>
              ${achievement.description}
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>Certifications & Assessments</h2>
          ${resumeData.certifications.map(cert => `
            <div class="certification">
              <strong>${cert.name}</strong> - Score: ${cert.score}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    // Create and download HTML file (simulating PDF)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${resumeData.personalInfo.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Resume downloaded",
      description: "Your resume has been downloaded as an HTML file. You can print it as PDF from your browser.",
    });
  };

  const getTopPerformances = () => {
    return quizResults
      .filter(result => result.percentage >= 70)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
  };

  const topPerformances = getTopPerformances();

  return (
    <div className="space-y-6">
      {/* Resume Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Professional Resume Generator
          </CardTitle>
          <CardDescription>
            Automatically generate a professional resume enriched with your quiz results and achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Resume will include:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your professional profile information</li>
                <li>• Skills demonstrated through quiz performance</li>
                <li>• Achievement badges for high scores (80%+)</li>
                <li>• Certification details for completed assessments</li>
                <li>• Educational background and experience</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Current Status:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Completed</span>
                  <Badge variant={candidateDetails ? "default" : "secondary"}>
                    {candidateDetails ? "✓" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quiz Results</span>
                  <Badge variant={quizResults.length > 0 ? "default" : "secondary"}>
                    {quizResults.length} completed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Achievements</span>
                  <Badge variant={topPerformances.length > 0 ? "default" : "secondary"}>
                    {topPerformances.length} earned
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerateResume} disabled={loading || !candidateDetails}>
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
              Generate Resume
            </Button>
            
            {resumeData && (
              <>
                <Button variant="outline" onClick={() => setResumePreview(!resumePreview)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {resumePreview ? "Hide" : "Preview"}
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Performances */}
      {topPerformances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Top Performances
            </CardTitle>
            <CardDescription>
              These achievements will be highlighted in your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPerformances.map((result, index) => (
                <div key={result.id} className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    {index === 0 && <Award className="h-5 w-5 text-yellow-500" />}
                    {index === 1 && <Award className="h-5 w-5 text-gray-400" />}
                    {index === 2 && <Award className="h-5 w-5 text-amber-600" />}
                    <h4 className="font-medium">{result.quiz_type.charAt(0).toUpperCase() + result.quiz_type.slice(1)}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{result.domain_id}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{result.percentage}%</span>
                    <Badge variant={result.percentage >= 80 ? "default" : "secondary"}>
                      {result.percentage >= 80 ? "Excellent" : "Good"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resume Preview */}
      {resumePreview && resumeData && (
        <Card>
          <CardHeader>
            <CardTitle>Resume Preview</CardTitle>
            <CardDescription>
              This is how your generated resume will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 p-6 bg-white text-black rounded-lg border-2">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">{resumeData.personalInfo.name}</h1>
                <p className="text-lg text-gray-600 mb-1">{resumeData.personalInfo.currentPosition}</p>
                <p className="text-sm text-gray-500">
                  {resumeData.personalInfo.email} | {resumeData.personalInfo.phone}
                </p>
              </div>

              {/* Professional Summary */}
              <div>
                <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-600 pb-1 mb-2">
                  Professional Summary
                </h2>
                <p className="text-sm">{resumeData.personalInfo.bio}</p>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-600 pb-1 mb-2">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              {resumeData.achievements.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-blue-600 border-b border-blue-600 pb-1 mb-2">
                    Achievements
                  </h2>
                  <div className="space-y-2">
                    {resumeData.achievements.map((achievement, index) => (
                      <div key={index} className="p-2 bg-green-50 border-l-4 border-green-400">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeGenerator;