
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
import { Save, RotateCcw, AlertCircle } from 'lucide-react';

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

  const handleReset = () => {
    if (module) {
      setFormData({
        title: module.title || '',
        description: module.description || '',
        estimated_hours: module.estimated_hours || 0,
        is_published: module.is_published ?? true,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        estimated_hours: 0,
        is_published: true,
      });
    }
    setValidationErrors([]);
  };

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
    <div className="bg-black text-gray-100 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-100">
          {module ? 'Edit Module' : 'Create Module'}
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
            disabled={mutation.isPending}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            {mutation.isPending ? 'Saving...' : (module ? 'Update' : 'Create')}
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
            <Label htmlFor="title" className="text-gray-200 font-medium">Module Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter module title"
              required
              maxLength={200}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-200 font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter module description"
              rows={4}
              maxLength={1000}
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="estimated_hours" className="text-gray-200 font-medium">Estimated Hours</Label>
            <Input
              id="estimated_hours"
              type="number"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
              min="0"
              max="1000"
              className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20 mt-2"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="is_published" className="text-gray-200 font-medium">Published</Label>
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
            className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-gray-100 bg-gray-800"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModuleForm;
