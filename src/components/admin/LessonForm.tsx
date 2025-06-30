
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, RotateCcw, Video, FileText } from 'lucide-react';

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

  const handleReset = () => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        content: lesson.content || '',
        duration_minutes: lesson.duration_minutes || 0,
        video_url: lesson.video_url || '',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        duration_minutes: 0,
        video_url: '',
      });
    }
  };

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
    <div className="bg-black text-gray-100 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-100">
          {lesson ? 'Edit Lesson' : 'Add New Lesson'}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-gray-100 bg-gray-800"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            {mutation.isPending ? 'Saving...' : (lesson ? 'Update Lesson' : 'Create Lesson')}
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-200 font-medium">Lesson Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter lesson title"
              required
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-gray-200 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter lesson content"
              rows={6}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 mt-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_minutes" className="text-gray-200 font-medium">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                min="0"
                className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 mt-2"
              />
            </div>

            <div>
              <Label htmlFor="video_url" className="text-gray-200 font-medium flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video URL
              </Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="Enter video URL"
                className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 mt-2"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-gray-100 bg-gray-800"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LessonForm;
