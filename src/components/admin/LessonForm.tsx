
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LessonFormProps {
  courseId: string;
  lesson?: any;
  onClose: () => void;
}

const LessonForm = ({ courseId, lesson, onClose }: LessonFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    duration_minutes: 0,
    video_url: '',
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        content: lesson.content || '',
        duration_minutes: lesson.duration_minutes || 0,
        video_url: lesson.video_url || '',
      });
    }
  }, [lesson]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (lesson) {
        const { error } = await supabase
          .from('course_lessons')
          .update(data)
          .eq('id', lesson.id);
        if (error) throw error;
      } else {
        // Get the next lesson number
        const { data: existingLessons, error: countError } = await supabase
          .from('course_lessons')
          .select('lesson_number')
          .eq('course_id', courseId)
          .order('lesson_number', { ascending: false })
          .limit(1);

        if (countError) throw countError;

        const nextNumber = existingLessons.length > 0 ? existingLessons[0].lesson_number + 1 : 1;

        const { error } = await supabase
          .from('course_lessons')
          .insert({
            ...data,
            course_id: courseId,
            lesson_number: nextNumber,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons', courseId] });
      toast({ title: `Lesson ${lesson ? 'updated' : 'created'} successfully` });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Error ${lesson ? 'updating' : 'creating'} lesson`,
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
    <>
      <DialogHeader>
        <DialogTitle className="text-white">
          {lesson ? 'Edit Lesson' : 'Add New Lesson'}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Lesson Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter lesson title"
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-white">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter lesson content"
              rows={6}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_minutes" className="text-white">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                min="0"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="video_url" className="text-white">Video URL</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="Enter video URL"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : (lesson ? 'Update Lesson' : 'Create Lesson')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default LessonForm;
