
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
import { Save, RotateCcw, AlertCircle } from 'lucide-react';

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

  const handleReset = () => {
    if (chapter) {
      setFormData({
        title: chapter.title || '',
        description: chapter.description || '',
        estimated_time_minutes: chapter.estimated_time_minutes || 0,
        is_published: chapter.is_published ?? true,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        estimated_time_minutes: 0,
        is_published: true,
      });
    }
    setValidationErrors([]);
  };

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
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          {chapter ? 'Edit Chapter' : 'Create Chapter'}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Save className="w-4 h-4 mr-1" />
            {mutation.isPending ? 'Saving...' : (chapter ? 'Update' : 'Create')}
          </Button>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h4 className="text-red-400 font-medium">Validation Errors:</h4>
          </div>
          <ul className="text-red-300 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white font-medium">Chapter Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter chapter title"
              required
              maxLength={200}
              className="bg-gray-800 border-gray-700 text-white focus:border-orange-400 focus:ring-orange-400/20 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter chapter description"
              rows={3}
              maxLength={1000}
              className="bg-gray-800 border-gray-700 text-white focus:border-orange-400 focus:ring-orange-400/20 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="estimated_time_minutes" className="text-white font-medium">Estimated Time (minutes)</Label>
            <Input
              id="estimated_time_minutes"
              type="number"
              value={formData.estimated_time_minutes}
              onChange={(e) => setFormData({ ...formData, estimated_time_minutes: parseInt(e.target.value) || 0 })}
              min="0"
              max="600"
              className="bg-gray-800 border-gray-700 text-white focus:border-orange-400 focus:ring-orange-400/20 mt-2"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="is_published" className="text-white font-medium">Published</Label>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              formData.is_published 
                ? 'bg-green-900/50 text-green-300 border border-green-700'
                : 'bg-gray-700 text-gray-300 border border-gray-600'
            }`}>
              {formData.is_published ? 'Published' : 'Draft'}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChapterForm;
