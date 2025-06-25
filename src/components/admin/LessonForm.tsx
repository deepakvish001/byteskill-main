
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface LessonFormProps {
  courseId: string;
  lesson?: any;
  onClose: () => void;
}

const LessonForm = ({ courseId, lesson, onClose }: LessonFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    content: lesson?.content || '',
    video_url: lesson?.video_url || '',
    duration_minutes: lesson?.duration_minutes || 0,
    lesson_number: lesson?.lesson_number || 1
  });

  const createLessonMutation = useMutation({
    mutationFn: async (data: any) => {
      const lessonData = {
        ...data,
        course_id: courseId,
        created_at: new Date().toISOString()
      };

      if (lesson) {
        const { error } = await supabase
          .from('course_lessons')
          .update(lessonData)
          .eq('id', lesson.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('course_lessons')
          .insert([lessonData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons', courseId] });
      toast({ title: `${lesson ? 'Updated' : 'Created'} lesson successfully` });
      onClose();
    },
    onError: (error) => {
      toast({ 
        title: `Error ${lesson ? 'updating' : 'creating'} lesson`, 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLessonMutation.mutate(formData);
  };

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white">
          {lesson ? 'Edit' : 'Add'} Lesson
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="lesson_number" className="text-white">Lesson Number</Label>
              <Input
                id="lesson_number"
                type="number"
                value={formData.lesson_number}
                onChange={(e) => setFormData({ ...formData, lesson_number: parseInt(e.target.value) || 1 })}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content" className="text-white">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={6}
              placeholder="Lesson content, instructions, problem description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video_url" className="text-white">Video URL (Optional)</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label htmlFor="duration_minutes" className="text-white">Duration (Minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={createLessonMutation.isPending} className="flex-1">
              {createLessonMutation.isPending ? 'Saving...' : (lesson ? 'Update' : 'Create')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LessonForm;
