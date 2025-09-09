import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Star, Save, Loader2 } from 'lucide-react';

interface CandidateData {
  user_id: string;
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

interface RemarkDialogProps {
  candidate: CandidateData;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  existingRemark?: ManagerRemark;
}

const RemarkDialog: React.FC<RemarkDialogProps> = ({
  candidate,
  open,
  onClose,
  onSave,
  existingRemark,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    remarks: '',
    rating: 0,
    recommendation_status: 'pending',
  });

  useEffect(() => {
    if (existingRemark) {
      setFormData({
        remarks: existingRemark.remarks,
        rating: existingRemark.rating,
        recommendation_status: existingRemark.recommendation_status,
      });
    } else {
      setFormData({
        remarks: '',
        rating: 0,
        recommendation_status: 'pending',
      });
    }
  }, [existingRemark, open]);

  const handleSave = async () => {
    if (!user || !formData.remarks.trim() || formData.rating === 0) {
      toast({
        title: "Missing information",
        description: "Please provide remarks and a rating.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (existingRemark) {
        // Update existing remark
        const { error } = await supabase
          .from('manager_remarks')
          .update({
            remarks: formData.remarks,
            rating: formData.rating,
            recommendation_status: formData.recommendation_status,
          })
          .eq('id', existingRemark.id);

        if (error) throw error;
      } else {
        // Create new remark
        const { error } = await supabase
          .from('manager_remarks')
          .insert({
            manager_id: user.id,
            candidate_id: candidate.user_id,
            remarks: formData.remarks,
            rating: formData.rating,
            recommendation_status: formData.recommendation_status,
          });

        if (error) throw error;
      }

      toast({
        title: "Remark saved",
        description: "Your feedback has been saved successfully.",
      });
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Error saving remark",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${candidate.profile.first_name || ''} ${candidate.profile.last_name || ''}`.trim() || 'Candidate';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingRemark ? 'Update Remark' : 'Add Remark'} for {fullName}
          </DialogTitle>
          <DialogDescription>
            Provide your feedback and recommendation for this candidate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`p-1 rounded ${
                    formData.rating >= star ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating}/5
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendation_status">Recommendation Status</Label>
            <Select
              value={formData.recommendation_status}
              onValueChange={(value) => 
                setFormData({ ...formData, recommendation_status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="not_recommended">Not Recommended</SelectItem>
                <SelectItem value="needs_interview">Needs Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Share your thoughts about this candidate's strengths, areas for improvement, and overall fit..."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemarkDialog;