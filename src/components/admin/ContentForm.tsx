
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
import { X } from 'lucide-react';

interface ContentFormProps {
  content?: any;
  chapterId: string;
  moduleId: string;
  courseId: string;
  onClose: () => void;
}

const ContentForm = ({ content, chapterId, moduleId, courseId, onClose }: ContentFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'lecture',
    article_content: '',
    video_url: '',
    practice_link: '',
    estimated_time_minutes: 0,
    difficulty: 'easy',
    topics: [] as string[],
    tags: [] as string[],
    status: 'draft',
    is_bookmarkable: true,
    is_practice_available: false,
  });

  const [newTopic, setNewTopic] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        description: content.description || '',
        content_type: content.content_type || 'lecture',
        article_content: content.article_content || '',
        video_url: content.video_url || '',
        practice_link: content.practice_link || '',
        estimated_time_minutes: content.estimated_time_minutes || 0,
        difficulty: content.difficulty || 'easy',
        topics: content.topics || [],
        tags: content.tags || [],
        status: content.status || 'draft',
        is_bookmarkable: content.is_bookmarkable ?? true,
        is_practice_available: content.is_practice_available ?? false,
      });
    }
  }, [content]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (content) {
        const { error } = await supabase
          .from('course_content')
          .update(data)
          .eq('id', content.id);
        if (error) throw error;
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
            ...data,
            chapter_id: chapterId,
            module_id: moduleId,
            course_id: courseId,
            content_order: nextOrder,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: `Content ${content ? 'updated' : 'created'} successfully` });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Error ${content ? 'updating' : 'creating'} content`,
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const addTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData({
        ...formData,
        topics: [...formData.topics, newTopic.trim()]
      });
      setNewTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter(t => t !== topic)
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto bg-black text-gray-100">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="text-gray-200">Content Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter content title"
              required
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
            />
          </div>

          <div>
            <Label htmlFor="content_type" className="text-gray-200">Content Type</Label>
            <Select value={formData.content_type} onValueChange={(value) => setFormData({ ...formData, content_type: value })}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="lecture" className="text-gray-100 hover:bg-gray-800">Lecture</SelectItem>
                <SelectItem value="article" className="text-gray-100 hover:bg-gray-800">Article</SelectItem>
                <SelectItem value="problem" className="text-gray-100 hover:bg-gray-800">Problem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-200">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter content description"
            rows={2}
            className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="difficulty" className="text-gray-200">Difficulty</Label>
            <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
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
            <Label htmlFor="estimated_time_minutes" className="text-gray-200">Estimated Time (minutes)</Label>
            <Input
              id="estimated_time_minutes"
              type="number"
              value={formData.estimated_time_minutes}
              onChange={(e) => setFormData({ ...formData, estimated_time_minutes: parseInt(e.target.value) || 0 })}
              min="0"
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
            />
          </div>
        </div>

        {formData.content_type === 'article' && (
          <div>
            <Label htmlFor="article_content" className="text-gray-200">Article Content</Label>
            <Textarea
              id="article_content"
              value={formData.article_content}
              onChange={(e) => setFormData({ ...formData, article_content: e.target.value })}
              placeholder="Enter article content (supports markdown)"
              rows={8}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
            />
          </div>
        )}

        {formData.content_type === 'lecture' && (
          <div>
            <Label htmlFor="video_url" className="text-gray-200">Video URL</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
            />
          </div>
        )}

        <div>
          <Label htmlFor="practice_link" className="text-gray-200">Practice Link</Label>
          <Input
            id="practice_link"
            value={formData.practice_link}
            onChange={(e) => setFormData({ ...formData, practice_link: e.target.value })}
            placeholder="Enter practice/exercise link"
            className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
          />
        </div>

        {/* Topics */}
        <div>
          <Label className="text-gray-200">Topics</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add a topic"
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
            />
            <Button type="button" onClick={addTopic} className="bg-blue-600 hover:bg-blue-700">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.topics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gray-800 text-gray-200 border-gray-600">
                {topic}
                <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeTopic(topic)} />
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label className="text-gray-200">Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} className="bg-blue-600 hover:bg-blue-700">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1 bg-gray-800 text-gray-200 border-gray-600">
                {tag}
                <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status" className="text-gray-200">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="draft" className="text-gray-100 hover:bg-gray-800">Draft</SelectItem>
                <SelectItem value="published" className="text-gray-100 hover:bg-gray-800">Published</SelectItem>
                <SelectItem value="archived" className="text-gray-100 hover:bg-gray-800">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_bookmarkable"
              checked={formData.is_bookmarkable}
              onCheckedChange={(checked) => setFormData({ ...formData, is_bookmarkable: checked })}
            />
            <Label htmlFor="is_bookmarkable" className="text-gray-200">Bookmarkable</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_practice_available"
              checked={formData.is_practice_available}
              onCheckedChange={(checked) => setFormData({ ...formData, is_practice_available: checked })}
            />
            <Label htmlFor="is_practice_available" className="text-gray-200">Practice Available</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-gray-100 bg-gray-800"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={mutation.isPending}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {mutation.isPending ? 'Saving...' : (content ? 'Update Content' : 'Create Content')}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;
