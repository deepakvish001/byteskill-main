
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'problem',
    difficulty: 'easy',
    estimated_time_minutes: 0,
    article_content: '',
    video_url: '',
    practice_link: '',
    is_bookmarkable: true,
    status: 'draft'
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        description: content.description || '',
        content_type: content.content_type || 'problem',
        difficulty: content.difficulty || 'easy',
        estimated_time_minutes: content.estimated_time_minutes || 0,
        article_content: content.article_content || '',
        video_url: content.video_url || '',
        practice_link: content.practice_link || '',
        is_bookmarkable: content.is_bookmarkable ?? true,
        status: content.status || 'draft'
      });
    }
  }, [content]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const problemData = {
        ...data,
        chapter_id: chapterId,
        module_id: moduleId,
        course_id: courseId,
        content_order: content?.content_order || 1,
        topics: [],
        tags: []
      };

      if (content) {
        const { error } = await supabase
          .from('course_content')
          .update(problemData)
          .eq('id', content.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('course_content')
          .insert([problemData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ 
        title: `Problem ${content ? 'updated' : 'created'} successfully`,
        className: "bg-green-900 border-green-700 text-green-100"
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Problem mutation error:', error);
      toast({
        title: `Error ${content ? 'updating' : 'creating'} problem`,
        description: error.message,
        variant: 'destructive',
        className: "bg-red-900 border-red-700 text-red-100"
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="bg-black text-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-200 font-medium">Problem Name *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter problem name"
                required
                className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-200 font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter problem description"
                rows={3}
                className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty" className="text-gray-200 font-medium">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="easy" className="text-gray-100 hover:bg-gray-800">Easy</SelectItem>
                    <SelectItem value="medium" className="text-gray-100 hover:bg-gray-800">Medium</SelectItem>
                    <SelectItem value="hard" className="text-gray-100 hover:bg-gray-800">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estimated_time" className="text-gray-200 font-medium">Est. Time (min)</Label>
                <Input
                  id="estimated_time"
                  type="number"
                  value={formData.estimated_time_minutes}
                  onChange={(e) => setFormData({ ...formData, estimated_time_minutes: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="article_content" className="text-gray-200 font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Article Link
              </Label>
              <Input
                id="article_content"
                value={formData.article_content}
                onChange={(e) => setFormData({ ...formData, article_content: e.target.value })}
                placeholder="Enter article URL"
                className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="video_url" className="text-gray-200 font-medium flex items-center gap-2">
                <Video className="w-4 h-4 text-red-400" />
                Video Link
              </Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="Enter video URL"
                className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="practice_link" className="text-gray-200 font-medium flex items-center gap-2">
                <Link className="w-4 h-4 text-green-400" />
                Practice Link
              </Label>
              <Input
                id="practice_link"
                value={formData.practice_link}
                onChange={(e) => setFormData({ ...formData, practice_link: e.target.value })}
                placeholder="Enter practice URL"
                className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-3">
                <Bookmark className="w-4 h-4 text-yellow-400" />
                <Switch
                  id="is_bookmarkable"
                  checked={formData.is_bookmarkable}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_bookmarkable: checked })}
                />
                <Label htmlFor="is_bookmarkable" className="text-gray-200 font-medium">Bookmarkable</Label>
              </div>
              <Badge variant={formData.is_bookmarkable ? "default" : "secondary"} className={formData.is_bookmarkable ? "bg-yellow-600 text-yellow-100" : "bg-gray-600 text-gray-200"}>
                {formData.is_bookmarkable ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Selection */}
        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div>
            <Label htmlFor="status" className="text-gray-200 font-medium">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 mt-2 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="draft" className="text-gray-100 hover:bg-gray-800">Draft</SelectItem>
                <SelectItem value="published" className="text-gray-100 hover:bg-gray-800">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant={formData.status === 'published' ? "default" : "destructive"} className={formData.status === 'published' ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"}>
            {formData.status === 'published' ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-gray-100 bg-gray-800 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : (content ? 'Update Problem' : 'Create Problem')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProblemForm;
