
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAdminValidation } from '@/hooks/useAdminValidation';
import { sanitizeInput } from '@/utils/inputValidation';
import { FileText, Video, Link, Bookmark } from 'lucide-react';

interface ProblemFormProps {
  content?: any;
  chapterId: string;
  moduleId: string;
  courseId: string;
  onClose: () => void;
}

const ProblemForm = ({ content, chapterId, moduleId, courseId, onClose }: ProblemFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { validateAdminOperation, logAdminAction } = useAdminValidation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    estimated_time_minutes: 0,
    article_content: '',
    video_url: '',
    practice_link: '',
    is_bookmarkable: true,
    is_practice_available: false,
    status: 'draft',
    content_type: 'problem'
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        description: content.description || '',
        difficulty: content.difficulty || 'easy',
        estimated_time_minutes: content.estimated_time_minutes || 0,
        article_content: content.article_content || '',
        video_url: content.video_url || '',
        practice_link: content.practice_link || '',
        is_bookmarkable: content.is_bookmarkable ?? true,
        is_practice_available: content.is_practice_available ?? false,
        status: content.status || 'draft',
        content_type: content.content_type || 'problem'
      });
    }
  }, [content]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const isAuthorized = await validateAdminOperation(
        content ? 'update' : 'create',
        'content'
      );
      
      if (!isAuthorized) {
        throw new Error('Insufficient permissions');
      }

      const sanitizedData = {
        ...data,
        title: sanitizeInput(data.title),
        description: data.description ? sanitizeInput(data.description) : '',
        article_content: data.article_content ? sanitizeInput(data.article_content) : '',
        video_url: data.video_url ? sanitizeInput(data.video_url) : '',
        practice_link: data.practice_link ? sanitizeInput(data.practice_link) : '',
      };

      if (content) {
        const { error } = await supabase
          .from('course_content')
          .update(sanitizedData)
          .eq('id', content.id);
        if (error) throw error;

        await logAdminAction('update', 'content', content.id, {
          title: sanitizedData.title,
          chapterId,
          moduleId,
          courseId
        });
      } else {
        // Get the next content order
        const { data: existingContent, error: countError } = await supabase
          .from('course_content')
          .select('content_order')
          .eq('chapter_id', chapterId)
          .order('content_order', { ascending: false })
          .limit(1);

        if (countError) throw countError;

        const nextOrder = existingContent.length > 0 ? existingContent[0].content_order + 1 : 1;

        const { error } = await supabase
          .from('course_content')
          .insert({
            ...sanitizedData,
            chapter_id: chapterId,
            module_id: moduleId,
            course_id: courseId,
            content_order: nextOrder,
          });
        if (error) throw error;

        await logAdminAction('create', 'content', courseId, {
          title: sanitizedData.title,
          chapterId,
          moduleId,
          courseId
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: `Problem ${content ? 'updated' : 'created'} successfully` });
      setValidationErrors([]);
      onClose();
    },
    onError: (error: any) => {
      console.error('Problem mutation error:', error);
      toast({
        title: `Error ${content ? 'updating' : 'creating'} problem`,
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
    <div className="bg-black text-white">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
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
            <Label htmlFor="title" className="text-white">Problem Name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter problem name"
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
              placeholder="Enter problem description"
              rows={3}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="article_content" className="text-white flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Article Link
              </Label>
              <Input
                id="article_content"
                value={formData.article_content}
                onChange={(e) => setFormData({ ...formData, article_content: e.target.value })}
                placeholder="Enter article URL"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="video_url" className="text-white flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video Link
              </Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="Enter video URL"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="practice_link" className="text-white flex items-center gap-2">
                <Link className="w-4 h-4" />
                Practice Link
              </Label>
              <Input
                id="practice_link"
                value={formData.practice_link}
                onChange={(e) => setFormData({ ...formData, practice_link: e.target.value })}
                placeholder="Enter practice URL"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_bookmarkable"
                checked={formData.is_bookmarkable}
                onCheckedChange={(checked) => setFormData({ ...formData, is_bookmarkable: checked })}
              />
              <Label htmlFor="is_bookmarkable" className="text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Bookmarkable
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_practice_available"
                checked={formData.is_practice_available}
                onCheckedChange={(checked) => setFormData({ ...formData, is_practice_available: checked })}
              />
              <Label htmlFor="is_practice_available" className="text-white">Practice Available</Label>
            </div>

            <div>
              <Label htmlFor="status" className="text-white">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending} className="bg-blue-600 hover:bg-blue-700">
            {mutation.isPending ? 'Saving...' : (content ? 'Update Problem' : 'Create Problem')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProblemForm;
