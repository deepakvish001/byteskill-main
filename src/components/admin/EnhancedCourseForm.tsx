
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
import { useAdminValidation } from '@/hooks/useAdminValidation';
import { validateCourseInput, sanitizeInput } from '@/utils/inputValidation';

interface EnhancedCourseFormProps {
  course?: any;
  category: string;
  onClose: () => void;
}

const EnhancedCourseForm = ({ course, category, onClose }: EnhancedCourseFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { validateAdminOperation, logAdminAction } = useAdminValidation();
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    difficulty: 'beginner',
    estimated_hours: 0,
    is_published: false,
    is_premium: false,
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        tagline: course.tagline || '',
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
      const isAuthorized = await validateAdminOperation(
        course ? 'update' : 'create',
        'course'
      );
      
      if (!isAuthorized) {
        throw new Error('Insufficient permissions');
      }

      const validation = validateCourseInput(data);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        throw new Error('Validation failed: ' + validation.errors.join(', '));
      }

      const sanitizedData = {
        title: sanitizeInput(data.title),
        tagline: data.tagline ? sanitizeInput(data.tagline) : '',
        description: data.description ? sanitizeInput(data.description) : '',
        difficulty: data.difficulty,
        estimated_hours: data.estimated_hours,
        is_published: data.is_published,
        is_premium: data.is_premium,
        tags: data.tags?.map((tag: string) => sanitizeInput(tag)) || [],
        category: category,
        total_lessons: 0,
        module_count: 0,
        chapter_count: 0,
        problem_count: 0
      };

      if (course) {
        const { error } = await supabase
          .from('courses')
          .update(sanitizedData)
          .eq('id', course.id);
        if (error) throw error;

        await logAdminAction('update', 'course', course.id, {
          title: sanitizedData.title,
          category
        });
      } else {
        const courseId = `${category}-${Date.now()}`;
        
        const { error } = await supabase
          .from('courses')
          .insert({
            ...sanitizedData,
            course_id: courseId,
          });
        if (error) throw error;

        await logAdminAction('create', 'course', courseId, {
          title: sanitizedData.title,
          category
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`admin-${category}`] });
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast({ 
        title: `Course ${course ? 'updated' : 'created'} successfully`,
        className: "bg-green-900 border-green-700 text-green-100"
      });
      setValidationErrors([]);
      onClose();
    },
    onError: (error: any) => {
      console.error('Course mutation error:', error);
      toast({
        title: `Error ${course ? 'updating' : 'creating'} course`,
        description: error.message,
        variant: 'destructive',
        className: "bg-red-900 border-red-700 text-red-100"
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    mutation.mutate(formData);
  };

  const addTag = () => {
    const sanitizedTag = sanitizeInput(newTag);
    if (sanitizedTag && !formData.tags.includes(sanitizedTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, sanitizedTag]
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
    <div className="bg-gray-900 text-white rounded-lg border border-gray-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
        {validationErrors.length > 0 && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
            <h4 className="text-red-300 font-medium mb-2">Validation Errors:</h4>
            <ul className="text-red-200 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-200 font-medium">Course Name *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course name"
              required
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="tagline" className="text-gray-200 font-medium">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Enter course tagline"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-200 font-medium">Long Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter detailed course description"
              rows={4}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty" className="text-gray-200 font-medium">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="beginner" className="text-white hover:bg-gray-700">Beginner</SelectItem>
                  <SelectItem value="intermediate" className="text-white hover:bg-gray-700">Intermediate</SelectItem>
                  <SelectItem value="advanced" className="text-white hover:bg-gray-700">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimated_hours" className="text-gray-200 font-medium">Estimated Hours</Label>
              <Input
                id="estimated_hours"
                type="number"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
                min="0"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-200 font-medium">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button 
                type="button" 
                onClick={addTag} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 transition-colors"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gray-700 text-gray-200 border-gray-600">
                  {tag}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-3">
                <Switch
                  id="is_premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                />
                <Label htmlFor="is_premium" className="text-gray-200 font-medium">Premium Course</Label>
              </div>
              <Badge 
                variant={formData.is_premium ? "default" : "secondary"} 
                className={formData.is_premium ? "bg-yellow-600 text-yellow-100" : "bg-gray-600 text-gray-200"}
              >
                {formData.is_premium ? "Premium" : "Free"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-3">
                <Switch
                  id="is_published"  
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published" className="text-gray-200 font-medium">Published</Label>
              </div>
              <Badge 
                variant={formData.is_published ? "default" : "destructive"} 
                className={formData.is_published ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"}
              >
                {formData.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedCourseForm;
