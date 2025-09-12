import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, LogOut, MessageSquare, Share2, TrendingUp, Search, Loader2, BarChart3 } from 'lucide-react';
import CandidateCard from '@/components/dashboard/CandidateCard';
import RemarkDialog from '@/components/dashboard/RemarkDialog';
import ReportsSection from './ReportsSection';

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

  useEffect(() => {
    fetchCandidates();
    fetchRemarks();
  }, []);

  useEffect(() => {
    // Filter candidates based on search term
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
      // First get candidate details
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidate_details')
        .select('*');

      if (candidateError) throw candidateError;

      // Then get profiles for these candidates
      const userIds = candidateData?.map(c => c.user_id) || [];
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email')
        .in('user_id', userIds);

      if (profileError) throw profileError;

      // Combine the data
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
        .select('*');

      if (error) throw error;
      setRemarks(data || []);
    } catch (error: any) {
      console.error('Error fetching remarks:', error);
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
    // Simulate sharing to external platforms
    const platforms = ['LinkedIn', 'Unstop', 'Naukri'];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    
    toast({
      title: "Report shared successfully",
      description: `Candidate profile shared to ${randomPlatform}`,
    });

    // Here you would implement actual API calls to external platforms
    console.log('Sharing candidate report:', {
      candidate: candidate.profile.email,
      platform: randomPlatform,
      data: candidate,
    });
  };

  const getCandidateRemark = (candidateId: string) => {
    return remarks.find(remark => remark.candidate_id === candidateId);
  };

  const getTopCandidates = () => {
    return candidates
      .map(candidate => ({
        ...candidate,
        remark: getCandidateRemark(candidate.user_id),
      }))
      .filter(candidate => candidate.remark)
      .sort((a, b) => (b.remark?.rating || 0) - (a.remark?.rating || 0))
      .slice(0, 3);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.first_name || 'Manager'}!
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="candidates" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports & Analytics
          </TabsTrigger>
        </TabsList>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-6">
          {/* Analytics Summary */}
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
                <CardTitle className="text-sm font-medium">Reviewed Candidates</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{remarks.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {remarks.length > 0 
                    ? (remarks.reduce((sum, r) => sum + r.rating, 0) / remarks.length).toFixed(1)
                    : '0.0'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Candidates */}
          {getTopCandidates().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Rated Candidates
                </CardTitle>
                <CardDescription>
                  Candidates with the highest ratings and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getTopCandidates().map((candidate, index) => (
                    <div key={candidate.user_id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-primary font-bold">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {candidate.profile.first_name} {candidate.profile.last_name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            ⭐ {candidate.remark?.rating}/5
                          </Badge>
                          <Badge variant={candidate.remark?.recommendation_status === 'recommended' ? 'default' : 'outline'}>
                            {candidate.remark?.recommendation_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Candidates List */}
          <Card>
            <CardHeader>
              <CardTitle>All Candidates</CardTitle>
              <CardDescription>
                Review candidate profiles and add your remarks and recommendations
              </CardDescription>
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
                  
                  {filteredCandidates.length === 0 && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm 
                        ? "No candidates match your search criteria." 
                        : "No candidates have registered yet."}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <ReportsSection />
        </TabsContent>
      </Tabs>

      {/* Remark Dialog */}
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