import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Save, Settings, LogOut } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
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
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('candidate_details')
        .upsert({
          user_id: user.id,
          ...details,
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your details have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving details",
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.first_name || 'Candidate'}!
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAccessibility(!showAccessibility)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Accessibility
          </Button>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {showAccessibility && (
        <AccessibilitySettings 
          preferences={details.accessibility_preferences}
          onUpdate={(prefs) => setDetails({ ...details, accessibility_preferences: prefs })}
        />
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Profile</CardTitle>
          <CardDescription>
            Update your personal and professional information to help managers understand your strengths and experience.
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
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={details.address}
              onChange={(e) => setDetails({ ...details, address: e.target.value })}
              placeholder="Your address"
              rows={2}
            />
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
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              value={details.education}
              onChange={(e) => setDetails({ ...details, education: e.target.value })}
              placeholder="Your educational background"
              rows={3}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDashboard;