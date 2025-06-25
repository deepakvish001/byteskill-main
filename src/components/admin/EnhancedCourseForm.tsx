
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

interface EnhancedCourseFormProps {
  course?: any;
  category: string;
  onClose: () => void;
}

const EnhancedCourseForm = ({ course, category, onClose }: EnhancedCourseFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    estimated_hours: 0,
    is_published: false,
    is_premium: false,
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        difficulty: course.difficulty || 'beginner',
        estimated_hours: course.estimated_hours || 0,
        is_published: course.is_published ?? false,
        is_premium: course.is_premium ?? false,
        tags: course.tags || [],
      });
    }
  }, [course]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (course) {
        const { error } = await supabase
          .from('courses')
          .update(data)
          .eq('id', course.id);
        if (error) throw error;
      } else {
        // Generate course_id
        const courseId = `${category}-${Date.now()}`;
        
        const { error } = await supabase
          .from('courses')
          .insert({
            ...data,
            course_id: courseId,
            category: category,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`admin-${category}`] });
      toast({ title: `Course ${course ? 'updated' : 'created'} successfully` });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Error ${course ? 'updating' : 'creating'} course`,
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
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
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="text-white">Course Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course title"
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
            <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter course description"
            rows={4}
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

        <div>
          <Label className="text-white">Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="bg-gray-800 border-gray-700 text-white"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label htmlFor="is_published" className="text-white">Published</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_premium"
              checked={formData.is_premium}
              onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
            />
            <Label htmlFor="is_premium" className="text-white">Premium</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
        </Button>
      </div>
    </form>
  );
};

export default EnhancedCourseForm;
