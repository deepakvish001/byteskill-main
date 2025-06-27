
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
import { X } from 'lucide-react';

interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  start_date: string;
  end_date: string;
  is_ongoing: boolean;
}

interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
  open: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel, open }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [formData, setFormData] = useState<Project>({
    title: project?.title || '',
    description: project?.description || '',
    technologies: project?.technologies || [],
    github_url: project?.github_url || '',
    live_url: project?.live_url || '',
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
    is_ongoing: project?.is_ongoing || false
  });

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

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
      if (project?.id) {
        ({ error } = await supabase
          .from('user_projects')
          .update(data)
          .eq('id', project.id));
      } else {
        ({ error } = await supabase
          .from('user_projects')
          .insert(data));
      }

      if (error) throw error;

      toast.success(`Project ${project?.id ? 'updated' : 'added'} successfully`);
      onSave();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {project?.id ? 'Edit Project' : 'Add Project'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-800/50 border-gray-600 text-white"
              required
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
          <div className="space-y-2">
            <Label className="text-white">Technologies</Label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add technology..."
                className="bg-gray-800/50 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <Button type="button" onClick={addTechnology} className="bg-orange-600 hover:bg-orange-700">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.technologies.map((tech) => (
                <div key={tech} className="bg-orange-600/20 text-orange-400 px-2 py-1 rounded-md flex items-center gap-1">
                  {tech}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTechnology(tech)} />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_url" className="text-white">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="live_url" className="text-white">Live URL</Label>
              <Input
                id="live_url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
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
                disabled={formData.is_ongoing}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_ongoing"
              checked={formData.is_ongoing}
              onCheckedChange={(checked) => setFormData({ 
                ...formData, 
                is_ongoing: checked as boolean,
                end_date: checked ? '' : formData.end_date
              })}
            />
            <Label htmlFor="is_ongoing" className="text-white">Ongoing project</Label>
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

export default ProjectForm;
