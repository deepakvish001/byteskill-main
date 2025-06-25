
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseFormProps {
  course?: any;
  onClose: () => void;
  category: 'course' | 'dsa-sheet' | 'interview-prep' | 'core-cs';
}

const CourseForm = ({ course, onClose, category }: CourseFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>(course?.tags || []);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    title: course?.title || '',
    course_id: course?.course_id || '',
    description: course?.description || '',
    difficulty: course?.difficulty || 'beginner',
    total_lessons: course?.total_lessons || 0,
    estimated_hours: course?.estimated_hours || 0,
    is_premium: course?.is_premium || false,
    is_published: course?.is_published || false,
    prerequisites: course?.prerequisites || []
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      const courseData = {
        ...data,
        category,
        tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (course) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', course.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dsa-sheets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-interview-prep'] });
      queryClient.invalidateQueries({ queryKey: ['admin-core-cs'] });
      toast({ title: `${course ? 'Updated' : 'Created'} ${category} successfully` });
      onClose();
    },
    onError: (error) => {
      toast({ 
        title: `Error ${course ? 'updating' : 'creating'} ${category}`, 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'course': return 'Course';
      case 'dsa-sheet': return 'DSA Sheet';
      case 'interview-prep': return 'Interview Prep';
      case 'core-cs': return 'Core CS';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white">
          {course ? 'Edit' : 'Create'} {getCategoryTitle()}
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
              <Label htmlFor="course_id" className="text-white">Course ID</Label>
              <Input
                id="course_id"
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g., js-basics-2024"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
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
            <div>
              <Label htmlFor="total_lessons" className="text-white">Total Lessons</Label>
              <Input
                id="total_lessons"
                type="number"
                value={formData.total_lessons}
                onChange={(e) => setFormData({ ...formData, total_lessons: parseInt(e.target.value) || 0 })}
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
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-white">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-blue-900 text-blue-300">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                className="bg-gray-800 border-gray-700 text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
              />
              <Label htmlFor="is_premium" className="text-white">Premium Content</Label>
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

          <div className="flex gap-4">
            <Button type="submit" disabled={createCourseMutation.isPending} className="flex-1">
              {createCourseMutation.isPending ? 'Saving...' : (course ? 'Update' : 'Create')}
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

export default CourseForm;
