import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, Send, FileText, Users, BarChart3 } from 'lucide-react';

interface CandidateReport {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  skills: string[];
  experience_years: number;
  current_position: string;
  bio: string;
  rating: number;
  remarks: string;
  recommendation_status: string;
}

const ReportsSection = () => {
  const [candidates, setCandidates] = useState<CandidateReport[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCandidateReports();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, filterStatus, searchTerm]);

  const fetchCandidateReports = async () => {
    setLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'candidate');

      if (profilesError) throw profilesError;

      const candidateReports = await Promise.all(
        profilesData.map(async (profile) => {
          const { data: details } = await supabase
            .from('candidate_details')
            .select('*')
            .eq('user_id', profile.user_id)
            .single();

          const { data: remarks } = await supabase
            .from('manager_remarks')
            .select('*')
            .eq('candidate_id', profile.user_id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            id: profile.user_id,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email,
            phone: details?.phone || '',
            skills: details?.skills || [],
            experience_years: details?.experience_years || 0,
            current_position: details?.current_position || '',
            bio: details?.bio || '',
            rating: remarks?.[0]?.rating || 0,
            remarks: remarks?.[0]?.remarks || 'No remarks yet',
            recommendation_status: remarks?.[0]?.recommendation_status || 'pending',
          };
        })
      );

      setCandidates(candidateReports);
    } catch (error: any) {
      toast({
        title: "Error fetching reports",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = candidates;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(candidate => candidate.recommendation_status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredCandidates(filtered);
  };

  const generateCSVReport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Position', 'Experience', 'Skills', 'Rating', 'Status', 'Remarks'];
    const csvData = filteredCandidates.map(candidate => [
      `${candidate.first_name} ${candidate.last_name}`,
      candidate.email,
      candidate.phone,
      candidate.current_position,
      `${candidate.experience_years} years`,
      candidate.skills.join('; '),
      candidate.rating,
      candidate.recommendation_status,
      candidate.remarks.replace(/"/g, '""')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidate-reports-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "CSV report has been downloaded successfully.",
    });
  };

  const sendReportToEmail = async (candidate: CandidateReport, platform: string) => {
    // Simulate sending report to external platforms
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Report Sent",
      description: `${candidate.first_name} ${candidate.last_name}'s report sent to ${platform} successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      'recommended': 'default',
      'pending': 'secondary',
      'not_recommended': 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const getAnalytics = () => {
    const total = candidates.length;
    const recommended = candidates.filter(c => c.recommendation_status === 'recommended').length;
    const pending = candidates.filter(c => c.recommendation_status === 'pending').length;
    const avgRating = candidates.reduce((sum, c) => sum + c.rating, 0) / total || 0;

    return { total, recommended, pending, avgRating };
  };

  const analytics = getAnalytics();

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{analytics.total}</p>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">{analytics.recommended}</p>
                <p className="text-sm text-muted-foreground">Recommended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">{analytics.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{analytics.avgRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reports & Analytics
          </CardTitle>
          <CardDescription>
            Generate and share candidate reports with external platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="not_recommended">Not Recommended</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={generateCSVReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Reports List */}
      <div className="grid gap-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {candidate.first_name} {candidate.last_name}
                      </h3>
                      <p className="text-muted-foreground">{candidate.email}</p>
                      <p className="text-sm text-muted-foreground">{candidate.current_position}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(candidate.recommendation_status)}
                      <p className="text-sm text-muted-foreground mt-1">
                        Rating: {candidate.rating}/5
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 5).map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                      {candidate.skills.length > 5 && (
                        <Badge variant="outline">+{candidate.skills.length - 5} more</Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Manager Remarks:</p>
                    <p className="text-sm text-muted-foreground">{candidate.remarks}</p>
                  </div>
                </div>

                <div className="lg:w-64 space-y-2">
                  <p className="text-sm font-medium">Send Report To:</p>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => sendReportToEmail(candidate, 'LinkedIn')}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => sendReportToEmail(candidate, 'Naukri')}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Naukri
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => sendReportToEmail(candidate, 'Unstop')}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Unstop
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => sendReportToEmail(candidate, 'Data Team')}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Data Team
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No candidates found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsSection;