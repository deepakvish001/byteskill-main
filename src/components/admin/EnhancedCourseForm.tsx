
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
        ...data,
        title: sanitizeInput(data.title),
        tagline: data.tagline ? sanitizeInput(data.tagline) : '',
        description: data.description ? sanitizeInput(data.description) : '',
        tags: data.tags?.map((tag: string) => sanitizeInput(tag)) || []
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
            category: category,
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
      toast({ title: `Course ${course ? 'updated' : 'created'} successfully` });
      setValidationErrors([]);
      onClose();
    },
    onError: (error: any) => {
      console.error('Course mutation error:', error);
      toast({
        title: `Error ${course ? 'updating' : 'creating'} course`,
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
            <Label htmlFor="title" className="text-white">Course Name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course name"
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="tagline" className="text-white">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Enter course tagline"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Long Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter detailed course description"
              rows={4}
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
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
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
              <Button type="button" onClick={addTag} className="bg-blue-600 hover:bg-blue-700">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gray-700 text-white">
                  {tag}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                />
                <Label htmlFor="is_premium" className="text-white">Premium Course</Label>
              </div>
              <Badge variant={formData.is_premium ? "default" : "secondary"} className="bg-yellow-600 text-white">
                {formData.is_premium ? "Premium" : "Free"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published" className="text-white">Published</Label>
              </div>
              <Badge variant={formData.is_published ? "default" : "destructive"} className={formData.is_published ? "bg-green-600" : "bg-red-600"}>
                {formData.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending} className="bg-blue-600 hover:bg-blue-700">
            {mutation.isPending ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedCourseForm;
