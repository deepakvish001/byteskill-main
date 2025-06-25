
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminValidation = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const validateAdminOperation = async (operationType: string, resourceType?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to perform this action",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('validate_admin_operation', {
        operation_type: operationType,
        resource_type: resourceType
      });

      if (error) {
        console.error('Admin validation error:', error);
        toast({
          title: "Permission denied",
          description: error.message || "You don't have permission to perform this action",
          variant: "destructive"
        });
        return false;
      }

      return data;
    } catch (error) {
      console.error('Admin validation failed:', error);
      toast({
        title: "Validation error",
        description: "Failed to validate admin permissions",
        variant: "destructive"
      });
      return false;
    }
  };

  const logAdminAction = async (
    actionType: string, 
    targetType?: string, 
    targetId?: string, 
    payload?: Record<string, any>
  ) => {
    try {
      await supabase.rpc('log_admin_action', {
        action_type_param: actionType,
        target_type_param: targetType,
        target_id_param: targetId,
        payload_param: payload || {}
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  return {
    validateAdminOperation,
    logAdminAction
  };
};
