
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, RotateCcw } from 'lucide-react';
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

  const handleReset = () => {
    setFormData({
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
    setTags(course?.tags || []);
    setNewTag('');
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
    <div className="bg-black text-gray-100 p-6 rounded-lg max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-100">
          {course ? 'Edit' : 'Create'} {getCategoryTitle()}
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
            disabled={createCourseMutation.isPending}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            {createCourseMutation.isPending ? 'Saving...' : (course ? 'Update' : 'Create')}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-200 font-medium">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
              required
              placeholder="Enter course title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course_id" className="text-gray-200 font-medium">Course ID *</Label>
            <Input
              id="course_id"
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
              placeholder="e.g., js-basics-2024"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-200 font-medium">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 min-h-[100px]"
            rows={4}
            placeholder="Enter course description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-gray-200 font-medium">Difficulty</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100 focus:border-orange-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="beginner" className="text-gray-100 hover:bg-gray-800">Beginner</SelectItem>
                <SelectItem value="intermediate" className="text-gray-100 hover:bg-gray-800">Intermediate</SelectItem>
                <SelectItem value="advanced" className="text-gray-100 hover:bg-gray-800">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_lessons" className="text-gray-200 font-medium">Total Lessons</Label>
            <Input
              id="total_lessons"
              type="number"
              value={formData.total_lessons}
              onChange={(e) => setFormData({ ...formData, total_lessons: parseInt(e.target.value) || 0 })}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimated_hours" className="text-gray-200 font-medium">Estimated Hours</Label>
            <Input
              id="estimated_hours"
              type="number"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-gray-200 font-medium">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-blue-900/50 text-blue-300 border border-blue-700 px-3 py-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-300 transition-colors"
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
              placeholder="Add a tag"
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Switch
                id="is_premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
              />
              <Label htmlFor="is_premium" className="text-gray-200 font-medium">Premium Content</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="is_published" className="text-gray-200 font-medium">Published</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
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

export default CourseForm;
