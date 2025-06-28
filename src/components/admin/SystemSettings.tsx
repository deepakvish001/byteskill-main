
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Globe, 
  Bell,
  Save,
  RefreshCw,
  AlertTriangle,
  Plus,
  Trash2
} from 'lucide-react';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  category: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

const SystemSettings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [changedSettings, setChangedSettings] = useState<Set<string>>(new Set());
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);
  const [newSettingForm, setNewSettingForm] = useState({
    key: '',
    value: '',
    type: 'string' as const,
    description: '',
    category: 'general',
    is_public: false
  });

  // Fetch system settings
  const { data: systemSettings, isLoading, refetch } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async (): Promise<SystemSetting[]> => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category, key');
      
      if (error) throw error;
      return (data || []).map(setting => ({
        ...setting,
        type: setting.type as 'string' | 'number' | 'boolean' | 'json'
      }));
    },
    refetchInterval: isRealTimeActive ? 30000 : false,
  });

  // Set up real-time subscriptions
  useEffect(() => {
    if (!isRealTimeActive) return;

    const channel = supabase
      .channel('system-settings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_settings'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['system-settings'] });
          toast.success('System settings updated in real-time');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isRealTimeActive, queryClient]);

  // Update settings state when data loads
  useEffect(() => {
    if (systemSettings) {
      const settingsMap: Record<string, any> = {};
      systemSettings.forEach(setting => {
        let value: any = setting.value;
        if (setting.type === 'boolean') {
          value = setting.value === 'true';
        } else if (setting.type === 'number') {
          value = parseFloat(setting.value) || 0;
        } else if (setting.type === 'json') {
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = {};
          }
        }
        settingsMap[setting.key] = value;
      });
      setSettings(settingsMap);
    }
  }, [systemSettings]);

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, type }: { key: string; value: any; type: string }) => {
      let stringValue = String(value);
      if (type === 'json') {
        stringValue = JSON.stringify(value);
      }

      const { error } = await supabase
        .from('system_settings')
        .update({
          value: stringValue,
          updated_at: new Date().toISOString()
        })
        .eq('key', key);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('Settings updated successfully');
      setChangedSettings(new Set());
    },
    onError: (error) => {
      toast.error('Failed to update settings: ' + error.message);
    },
  });

  // Create new setting mutation
  const createSettingMutation = useMutation({
    mutationFn: async (newSetting: typeof newSettingForm) => {
      let stringValue = newSetting.value;
      if (newSetting.type === 'json') {
        try {
          JSON.parse(stringValue);
        } catch {
          throw new Error('Invalid JSON format');
        }
      }

      const { error } = await supabase
        .from('system_settings')
        .insert([{
          ...newSetting,
          value: stringValue,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('Setting created successfully');
      setNewSettingForm({
        key: '',
        value: '',
        type: 'string',
        description: '',
        category: 'general',
        is_public: false
      });
    },
    onError: (error) => {
      toast.error('Failed to create setting: ' + error.message);
    },
  });

  // Delete setting mutation
  const deleteSettingMutation = useMutation({
    mutationFn: async (settingId: string) => {
      const { error } = await supabase
        .from('system_settings')
        .delete()
        .eq('id', settingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('Setting deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete setting: ' + error.message);
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setChangedSettings(prev => new Set(prev).add(key));
  };

  const saveAllChanges = () => {
    const settingsToUpdate = systemSettings?.filter(s => changedSettings.has(s.key)) || [];
    
    Promise.all(
      settingsToUpdate.map(setting => 
        updateSettingMutation.mutateAsync({
          key: setting.key,
          value: settings[setting.key],
          type: setting.type
        })
      )
    );
  };

  const resetChanges = () => {
    if (systemSettings) {
      const settingsMap: Record<string, any> = {};
      systemSettings.forEach(setting => {
        let value: any = setting.value;
        if (setting.type === 'boolean') {
          value = setting.value === 'true';
        } else if (setting.type === 'number') {
          value = parseFloat(setting.value) || 0;
        } else if (setting.type === 'json') {
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = {};
          }
        }
        settingsMap[setting.key] = value;
      });
      setSettings(settingsMap);
      setChangedSettings(new Set());
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    const value = settings[setting.key];
    const hasChanged = changedSettings.has(setting.key);

    if (setting.type === 'boolean') {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
          />
          <Label className={`text-white ${hasChanged ? 'text-orange-400' : ''}`}>
            {value ? 'Enabled' : 'Disabled'}
          </Label>
        </div>
      );
    }
    
    if (setting.type === 'number') {
      return (
        <Input
          type="number"
          value={Number(value) || ''}
          onChange={(e) => handleSettingChange(setting.key, parseFloat(e.target.value) || 0)}
          className={`bg-gray-800 border-gray-700 text-white ${hasChanged ? 'border-orange-400' : ''}`}
        />
      );
    }
    
    if (setting.type === 'json') {
      return (
        <Textarea
          value={JSON.stringify(value || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleSettingChange(setting.key, parsed);
            } catch {
              // Invalid JSON, don't update
            }
          }}
          rows={4}
          className={`bg-gray-800 border-gray-700 text-white font-mono text-sm ${hasChanged ? 'border-orange-400' : ''}`}
        />
      );
    }
    
    // Default case for 'string' type
    return (
      <Input
        type="text"
        value={String(value) || ''}
        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
        className={`bg-gray-800 border-gray-700 text-white ${hasChanged ? 'border-orange-400' : ''}`}
      />
    );
  };

  const groupedSettings = systemSettings?.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, SystemSetting[]>) || {};

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'general': return Settings;
      case 'database': return Database;
      case 'email': return Mail;
      case 'security': return Shield;
      case 'api': return Globe;
      case 'notifications': return Bell;
      default: return Settings;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-black">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-black min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <p className="text-gray-400">Configure platform-wide settings and preferences</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isRealTimeActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-sm text-gray-400">
              {isRealTimeActive ? 'Auto-sync Active' : 'Auto-sync Paused'}
            </span>
          </div>
          
          {changedSettings.size > 0 && (
            <>
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                {changedSettings.size} unsaved changes
              </Badge>
              <Button
                variant="outline"
                onClick={resetChanges}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={saveAllChanges}
                disabled={updateSettingMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateSettingMutation.isPending ? 'Saving...' : 'Save All'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue={Object.keys(groupedSettings)[0] || 'general'} className="space-y-6">
        <TabsList className="bg-gray-800 grid grid-cols-6 w-full">
          {Object.keys(groupedSettings).map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-300"
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            );
          })}
          <TabsTrigger 
            value="new"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Setting
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6">
              {categorySettings.map((setting) => (
                <Card key={setting.id} className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">
                          {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </CardTitle>
                        <p className="text-gray-400 text-sm mt-1">
                          {setting.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={setting.is_public ? "default" : "secondary"}>
                          {setting.is_public ? 'Public' : 'Private'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {setting.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSettingMutation.mutate(setting.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderSettingInput(setting)}
                    <div className="mt-2 text-xs text-gray-500">
                      Key: <code className="bg-gray-800 px-1 py-0.5 rounded">{setting.key}</code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}</Tabs>

        {/* New Setting Tab */}
        <TabsContent value="new">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Create New Setting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Key</Label>
                  <Input
                    value={newSettingForm.key}
                    onChange={(e) => setNewSettingForm(prev => ({ ...prev, key: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="setting_key"
                  />
                </div>
                <div>
                  <Label className="text-white">Category</Label>
                  <Input
                    value={newSettingForm.category}
                    onChange={(e) => setNewSettingForm(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="general"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-white">Description</Label>
                <Input
                  value={newSettingForm.description}
                  onChange={(e) => setNewSettingForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Setting description"
                />
              </div>
              
              <div>
                <Label className="text-white">Value</Label>
                <Textarea
                  value={newSettingForm.value}
                  onChange={(e) => setNewSettingForm(prev => ({ ...prev, value: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Setting value"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newSettingForm.is_public}
                    onCheckedChange={(checked) => setNewSettingForm(prev => ({ ...prev, is_public: checked }))}
                  />
                  <Label className="text-white">Public Setting</Label>
                </div>
              </div>
              
              <Button
                onClick={() => createSettingMutation.mutate(newSettingForm)}
                disabled={createSettingMutation.isPending || !newSettingForm.key || !newSettingForm.description}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createSettingMutation.isPending ? 'Creating...' : 'Create Setting'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {Object.keys(groupedSettings).length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Settings Found</h3>
            <p className="text-gray-400 text-center">
              No system settings have been configured yet. Create your first setting using the "New Setting" tab.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemSettings;
