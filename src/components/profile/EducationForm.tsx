
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

interface EducationFormProps {
  education?: Education;
  onSave: () => void;
  onCancel: () => void;
  open: boolean;
}

const EducationForm: React.FC<EducationFormProps> = ({ education, onSave, onCancel, open }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Education>({
    institution: education?.institution || '',
    degree: education?.degree || '',
    field_of_study: education?.field_of_study || '',
    start_date: education?.start_date || '',
    end_date: education?.end_date || '',
    is_current: education?.is_current || false,
    description: education?.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const data = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      let error;
      if (education?.id) {
        ({ error } = await supabase
          .from('user_education')
          .update(data)
          .eq('id', education.id));
      } else {
        ({ error } = await supabase
          .from('user_education')
          .insert(data));
      }

      if (error) throw error;

      toast.success(`Education ${education?.id ? 'updated' : 'added'} successfully`);
      onSave();
    } catch (error: any) {
      console.error('Error saving education:', error);
      toast.error('Failed to save education');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {education?.id ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution" className="text-white">Institution *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree" className="text-white">Degree *</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field_of_study" className="text-white">Field of Study</Label>
              <Input
                id="field_of_study"
                value={formData.field_of_study}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-white">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-white">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
                disabled={formData.is_current}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_current"
                checked={formData.is_current}
                onCheckedChange={(checked) => setFormData({ 
                  ...formData, 
                  is_current: checked as boolean,
                  end_date: checked ? '' : formData.end_date
                })}
              />
              <Label htmlFor="is_current" className="text-white">Currently studying here</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-800/50 border-gray-600 text-white"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EducationForm;
