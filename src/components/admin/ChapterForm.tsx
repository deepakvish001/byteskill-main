
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAdminValidation } from '@/hooks/useAdminValidation';
import { validateChapterInput, sanitizeInput } from '@/utils/inputValidation';

interface ChapterFormProps {
  chapter?: any;
  moduleId: string;
  courseId: string;
  onClose: () => void;
}

const ChapterForm = ({ chapter, moduleId, courseId, onClose }: ChapterFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { validateAdminOperation, logAdminAction } = useAdminValidation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimated_time_minutes: 0,
    is_published: true,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
      // Validate admin permissions first
      const isAuthorized = await validateAdminOperation(
        chapter ? 'update' : 'create',
        'chapter'
      );
      
      if (!isAuthorized) {
        throw new Error('Insufficient permissions');
      }

      // Validate input data
      const validation = validateChapterInput(data);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        throw new Error('Validation failed: ' + validation.errors.join(', '));
      }

      // Sanitize input data
      const sanitizedData = {
        ...data,
        title: sanitizeInput(data.title),
        description: data.description ? sanitizeInput(data.description) : '',
      };

      if (chapter) {
        const { error } = await supabase
          .from('course_chapters')
          .update(sanitizedData)
          .eq('id', chapter.id);
        if (error) throw error;

        await logAdminAction('update', 'chapter', chapter.id, {
          title: sanitizedData.title,
          moduleId,
          courseId
        });
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
            ...sanitizedData,
            module_id: moduleId,
            course_id: courseId,
            chapter_order: nextOrder,
          });
        if (error) throw error;

        await logAdminAction('create', 'chapter', courseId, {
          title: sanitizedData.title,
          moduleId,
          courseId
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: `Chapter ${chapter ? 'updated' : 'created'} successfully` });
      setValidationErrors([]);
      onClose();
    },
    onError: (error: any) => {
      console.error('Chapter mutation error:', error);
      toast({
        title: `Error ${chapter ? 'updating' : 'creating'} chapter`,
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationErrors.length > 0 && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <h4 className="text-red-400 font-medium mb-2">Validation Errors:</h4>
          <ul className="text-red-300 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-white">Chapter Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter chapter title"
            required
            maxLength={200}
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
            maxLength={1000}
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
            max="600"
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
