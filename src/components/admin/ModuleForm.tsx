
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
import { validateModuleInput, sanitizeInput } from '@/utils/inputValidation';

interface ModuleFormProps {
  module?: any;
  courseId: string;
  onClose: () => void;
}

const ModuleForm = ({ module, courseId, onClose }: ModuleFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { validateAdminOperation, logAdminAction } = useAdminValidation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimated_hours: 0,
    is_published: true,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title || '',
        description: module.description || '',
        estimated_hours: module.estimated_hours || 0,
        is_published: module.is_published ?? true,
      });
    }
  }, [module]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Validate admin permissions first
      const isAuthorized = await validateAdminOperation(
        module ? 'update' : 'create',
        'module'
      );
      
      if (!isAuthorized) {
        throw new Error('Insufficient permissions');
      }

      // Validate input data
      const validation = validateModuleInput(data);
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

      if (module) {
        const { error } = await supabase
          .from('course_modules')
          .update(sanitizedData)
          .eq('id', module.id);
        if (error) throw error;

        await logAdminAction('update', 'module', module.id, {
          title: sanitizedData.title,
          courseId
        });
      } else {
        // Get the next module order
        const { data: existingModules, error: countError } = await supabase
          .from('course_modules')
          .select('module_order')
          .eq('course_id', courseId)
          .order('module_order', { ascending: false })
          .limit(1);

        if (countError) throw countError;

        const nextOrder = existingModules.length > 0 ? existingModules[0].module_order + 1 : 1;

        const { error } = await supabase
          .from('course_modules')
          .insert({
            ...sanitizedData,
            course_id: courseId,
            module_order: nextOrder,
          });
        if (error) throw error;

        await logAdminAction('create', 'module', courseId, {
          title: sanitizedData.title,
          courseId
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: `Module ${module ? 'updated' : 'created'} successfully` });
      setValidationErrors([]);
      onClose();
    },
    onError: (error: any) => {
      console.error('Module mutation error:', error);
      toast({
        title: `Error ${module ? 'updating' : 'creating'} module`,
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
          <Label htmlFor="title" className="text-white">Module Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter module title"
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
            placeholder="Enter module description"
            rows={4}
            maxLength={1000}
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
            max="1000"
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
          {mutation.isPending ? 'Saving...' : (module ? 'Update Module' : 'Create Module')}
        </Button>
      </div>
    </form>
  );
};

export default ModuleForm;
