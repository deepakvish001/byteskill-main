
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Achievement {
  id?: string;
  title: string;
  description: string;
  date_achieved: string;
  organization: string;
  certificate_url: string;
}

interface AchievementFormProps {
  achievement?: Achievement;
  onSave: () => void;
  onCancel: () => void;
  open: boolean;
}

const AchievementForm: React.FC<AchievementFormProps> = ({ achievement, onSave, onCancel, open }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Achievement>({
    title: achievement?.title || '',
    description: achievement?.description || '',
    date_achieved: achievement?.date_achieved || '',
    organization: achievement?.organization || '',
    certificate_url: achievement?.certificate_url || ''
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
      if (achievement?.id) {
        ({ error } = await supabase
          .from('user_achievements')
          .update(data)
          .eq('id', achievement.id));
      } else {
        ({ error } = await supabase
          .from('user_achievements')
          .insert(data));
      }

      if (error) throw error;

      toast.success(`Achievement ${achievement?.id ? 'updated' : 'added'} successfully`);
      onSave();
    } catch (error: any) {
      console.error('Error saving achievement:', error);
      toast.error('Failed to save achievement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {achievement?.id ? 'Edit Achievement' : 'Add Achievement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-800/50 border-gray-600 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization" className="text-white">Organization</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_achieved" className="text-white">Date Achieved</Label>
              <Input
                id="date_achieved"
                type="date"
                value={formData.date_achieved}
                onChange={(e) => setFormData({ ...formData, date_achieved: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificate_url" className="text-white">Certificate URL</Label>
            <Input
              id="certificate_url"
              value={formData.certificate_url}
              onChange={(e) => setFormData({ ...formData, certificate_url: e.target.value })}
              className="bg-gray-800/50 border-gray-600 text-white"
              placeholder="https://..."
            />
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

export default AchievementForm;
