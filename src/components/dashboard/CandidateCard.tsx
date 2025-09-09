import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Share2, Mail, Phone, MapPin, Calendar, Github, Linkedin } from 'lucide-react';

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

interface CandidateCardProps {
  candidate: CandidateData;
  remark?: ManagerRemark;
  onAddRemark: () => void;
  onShare: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  remark,
  onAddRemark,
  onShare,
}) => {
  const fullName = `${candidate.profile.first_name || ''} ${candidate.profile.last_name || ''}`.trim() || 'Unnamed Candidate';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{fullName}</h3>
            <p className="text-muted-foreground">{candidate.current_position || 'Position not specified'}</p>
            {remark && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">⭐ {remark.rating}/5</Badge>
                <Badge variant={remark.recommendation_status === 'recommended' ? 'default' : 'outline'}>
                  {remark.recommendation_status}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddRemark}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {remark ? 'Update' : 'Add'} Remark
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>{candidate.profile.email}</span>
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>{candidate.phone}</span>
              </div>
            )}
            {candidate.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{candidate.address}</span>
              </div>
            )}
            {candidate.experience_years && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{candidate.experience_years} years experience</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {candidate.linkedin_profile && (
              <a
                href={candidate.linkedin_profile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {candidate.github_profile && (
              <a
                href={candidate.github_profile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Profile</span>
              </a>
            )}
          </div>
        </div>

        {candidate.skills && candidate.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Skills:</p>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 8).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{candidate.skills.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {candidate.education && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Education:</p>
            <p className="text-sm text-muted-foreground">{candidate.education}</p>
          </div>
        )}

        {candidate.bio && (
          <div>
            <p className="text-sm font-medium mb-1">Bio:</p>
            <p className="text-sm text-muted-foreground line-clamp-3">{candidate.bio}</p>
          </div>
        )}

        {remark && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Manager's Remark:</p>
            <p className="text-sm text-muted-foreground">{remark.remarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateCard;