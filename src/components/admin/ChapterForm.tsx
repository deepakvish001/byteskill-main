
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ChapterFormProps {
  chapter?: any;
  moduleId: string;
  courseId: string;
  onClose: () => void;
}

const ChapterForm = ({ chapter, moduleId, courseId, onClose }: ChapterFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimated_time_minutes: 0,
    is_published: true,
  });

  useEffect(() => {
    if (chapter) {
      setFormData({
        title: chapter.title || '',
        description: chapter.description || '',
        estimated_time_minutes: chapter.estimated_time_minutes || 0,
        is_published: chapter.is_published ?? true,
      });
    }
  }, [chapter]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (chapter) {
        const { error } = await supabase
          .from('course_chapters')
          .update(data)
          .eq('id', chapter.id);
        if (error) throw error;
      } else {
        // Get the next chapter order
        const { data: existingChapters, error: countError } = await supabase
          .from('course_chapters')
          .select('chapter_order')
          .eq('module_id', moduleId)
          .order('chapter_order', { ascending: false })
          .limit(1);

        if (countError) throw countError;

        const nextOrder = existingChapters.length > 0 ? existingChapters[0].chapter_order + 1 : 1;

        const { error } = await supabase
          .from('course_chapters')
          .insert({
            ...data,
            module_id: moduleId,
            course_id: courseId,
            chapter_order: nextOrder,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: `Chapter ${chapter ? 'updated' : 'created'} successfully` });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Error ${chapter ? 'updating' : 'creating'} chapter`,
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
          <Label htmlFor="title" className="text-white">Chapter Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter chapter title"
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
            placeholder="Enter chapter description"
            rows={3}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label htmlFor="estimated_time_minutes" className="text-white">Estimated Time (minutes)</Label>
          <Input
            id="estimated_time_minutes"
            type="number"
            value={formData.estimated_time_minutes}
            onChange={(e) => setFormData({ ...formData, estimated_time_minutes: parseInt(e.target.value) || 0 })}
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
          {mutation.isPending ? 'Saving...' : (chapter ? 'Update Chapter' : 'Create Chapter')}
        </Button>
      </div>
    </form>
  );
};

export default ChapterForm;
