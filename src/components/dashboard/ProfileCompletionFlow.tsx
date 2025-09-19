import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, User, Briefcase, GraduationCap, Settings } from 'lucide-react';

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
  profile_completed: boolean;
}

interface ProfileCompletionFlowProps {
  onComplete: () => void;
}

const ProfileCompletionFlow: React.FC<ProfileCompletionFlowProps> = ({ onComplete }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
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
    profile_completed: false,
  });

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      description: 'Basic contact details',
      fields: ['phone', 'address']
    },
    {
      id: 'professional',
      title: 'Professional Details',
      icon: Briefcase,
      description: 'Work experience and current role',
      fields: ['current_position', 'experience_years', 'linkedin_profile', 'github_profile']
    },
    {
      id: 'education',
      title: 'Education & Skills',
      icon: GraduationCap,
      description: 'Educational background and technical skills',
      fields: ['education', 'skills']
    },
    {
      id: 'bio',
      title: 'About You',
      icon: Settings,
      description: 'Tell us about yourself and accessibility preferences',
      fields: ['bio', 'accessibility_preferences']
    }
  ];

  useEffect(() => {
    fetchCandidateDetails();
  }, [user]);

  const fetchCandidateDetails = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('candidate_details')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setDetails({
          phone: data.phone || '',
          address: data.address || '',
          skills: data.skills || [],
          experience_years: data.experience_years,
          education: data.education || '',
          current_position: data.current_position || '',
          linkedin_profile: data.linkedin_profile || '',
          github_profile: data.github_profile || '',
          bio: data.bio || '',
          accessibility_preferences: data.accessibility_preferences || {},
          profile_completed: data.profile_completed || false,
        });

        // If profile is already completed, redirect
        if (data.profile_completed) {
          onComplete();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error fetching details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const requiredFields = steps[stepIndex].fields;
    
    switch (stepIndex) {
      case 0: // Personal
        return !!(details.phone && details.address);
      case 1: // Professional
        return !!(details.current_position && details.experience_years !== null);
      case 2: // Education
        return !!(details.education && details.skills.length > 0);
      case 3: // Bio
        return !!(details.bio);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    } else {
      toast({
        title: "Please complete all required fields",
        description: "All fields in this section are required to proceed.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('candidate_details')
        .upsert({
          user_id: user!.id,
          ...details,
          profile_completed: true,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile completed!",
        description: "You can now access all features of the platform.",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error completing profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsChange = (value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setDetails({ ...details, skills: skillsArray });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Welcome {profile?.first_name}! Please complete your profile to access all features.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : isCurrent 
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                </div>
                <span className={`text-xs mt-2 text-center ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StepIcon size={24} />
              {currentStepData.title}
            </CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Personal Information */}
            {currentStep === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    placeholder="Your phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={details.address}
                    onChange={(e) => setDetails({ ...details, address: e.target.value })}
                    placeholder="Your address"
                    rows={3}
                    required
                  />
                </div>
              </>
            )}

            {/* Step 1: Professional Details */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="current_position">Current Position *</Label>
                  <Input
                    id="current_position"
                    value={details.current_position}
                    onChange={(e) => setDetails({ ...details, current_position: e.target.value })}
                    placeholder="Your current job title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={details.experience_years || ''}
                    onChange={(e) => setDetails({ 
                      ...details, 
                      experience_years: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    placeholder="Years of professional experience"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    value={details.linkedin_profile}
                    onChange={(e) => setDetails({ ...details, linkedin_profile: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input
                    id="github"
                    value={details.github_profile}
                    onChange={(e) => setDetails({ ...details, github_profile: e.target.value })}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </>
            )}

            {/* Step 2: Education & Skills */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="education">Education *</Label>
                  <Textarea
                    id="education"
                    value={details.education}
                    onChange={(e) => setDetails({ ...details, education: e.target.value })}
                    placeholder="Your educational background"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated) *</Label>
                  <Textarea
                    id="skills"
                    value={details.skills.join(', ')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    placeholder="React, TypeScript, Node.js, Python, etc."
                    rows={3}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your technical skills separated by commas. At least one skill is required.
                  </p>
                </div>
              </>
            )}

            {/* Step 3: About You */}
            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    value={details.bio}
                    onChange={(e) => setDetails({ ...details, bio: e.target.value })}
                    placeholder="Tell us about yourself, your strengths, and what makes you unique..."
                    rows={4}
                    required
                  />
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Accessibility preferences can be configured later in your dashboard settings.
                  </p>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={loading || !validateStep(currentStep)}
              >
                {currentStep === steps.length - 1 ? 'Complete Profile' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletionFlow;