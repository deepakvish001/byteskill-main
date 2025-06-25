
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ModuleFormProps {
  module?: any;
  courseId: string;
  onClose: () => void;
}

const ModuleForm = ({ module, courseId, onClose }: ModuleFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimated_hours: 0,
    is_published: true,
  });

  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title || '',
        description: module.description || '',
        estimated_hours: module.estimated_hours || 0,
        is_published: module.is_published ?? true,
      });
    }
  }, [module]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (module) {
        const { error } = await supabase
          .from('course_modules')
          .update(data)
          .eq('id', module.id);
        if (error) throw error;
      } else {
        // Get the next module order
        const { data: existingModules, error: countError } = await supabase
          .from('course_modules')
          .select('module_order')
          .eq('course_id', courseId)
          .order('module_order', { ascending: false })
          .limit(1);

        if (countError) throw countError;

        const nextOrder = existingModules.length > 0 ? existingModules[0].module_order + 1 : 1;

        const { error } = await supabase
          .from('course_modules')
          .insert({
            ...data,
            course_id: courseId,
            module_order: nextOrder,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: `Module ${module ? 'updated' : 'created'} successfully` });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Error ${module ? 'updating' : 'creating'} module`,
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-white">Module Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter module title"
            required
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter module description"
            rows={3}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label htmlFor="estimated_hours" className="text-white">Estimated Hours</Label>
          <Input
            id="estimated_hours"
            type="number"
            value={formData.estimated_hours}
            onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
            min="0"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
          />
          <Label htmlFor="is_published" className="text-white">Published</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : (module ? 'Update Module' : 'Create Module')}
        </Button>
      </div>
    </form>
  );
};

export default ModuleForm;
