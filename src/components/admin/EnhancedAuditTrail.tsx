
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Shield, 
  User, 
  Settings, 
  Trash2, 
  Search,
  Filter,
  Activity,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface AuditLogWithProfile {
  id: string;
  action_type: string;
  actor_id: string;
  target_type: string | null;
  target_id: string | null;
  payload: any;
  timestamp: string;
  profile?: {
    id: string;
    username: string;
    full_name: string;
  };
}

interface EnhancedAuditTrailProps {
  searchQuery: string;
}

const EnhancedAuditTrail = ({ searchQuery }: EnhancedAuditTrailProps) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');

  // Fetch audit logs with real-time updates
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', searchQuery, filterType, timeRange],
    queryFn: async (): Promise<AuditLogWithProfile[]> => {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(200);

      // Apply time range filter
      if (timeRange !== 'all') {
        const timeRanges = {
          '1h': 1,
          '24h': 24,
          '7d': 24 * 7,
          '30d': 24 * 30
        };
        const hours = timeRanges[timeRange as keyof typeof timeRanges];
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
        query = query.gte('timestamp', cutoff);
      }

      // Apply action type filter
      if (filterType !== 'all') {
        query = query.eq('action_type', filterType);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`action_type.ilike.%${searchQuery}%,target_type.ilike.%${searchQuery}%`);
      }

      const { data: auditData, error: auditError } = await query;
      if (auditError) throw auditError;

      // Fetch profiles for the actors
      if (auditData && auditData.length > 0) {
        const actorIds = [...new Set(auditData.map(log => log.actor_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', actorIds);

        if (profilesError) throw profilesError;

        return auditData.map(log => ({
          ...log,
          profile: profilesData?.find(profile => profile.id === log.actor_id)
        }));
      }

      return auditData || [];
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });

  // Get unique action types for filter
  const actionTypes = [...new Set(auditLogs?.map(log => log.action_type) || [])];

  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'user_update':
      case 'user_create':
      case 'user_banned':
      case 'user_unbanned':
        return <User className="w-4 h-4" />;
      case 'role_change':
        return <Shield className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'create':
      case 'update':
        return <Settings className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionBadgeVariant = (actionType: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (actionType.toLowerCase()) {
      case 'create':
      case 'user_create':
        return 'secondary';
      case 'update':
      case 'user_update':
        return 'default';
      case 'delete':
      case 'user_banned':
        return 'destructive';
      case 'user_unbanned':
        return 'default';
      default:
        return 'outline';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now.getTime() - time.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search audit logs..."
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Actions</SelectItem>
            {actionTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{auditLogs?.length || 0}</p>
                <p className="text-sm text-gray-400">Total Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {auditLogs?.filter(log => {
                    const logTime = new Date(log.timestamp);
                    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
                    return logTime > hourAgo;
                  }).length || 0}
                </p>
                <p className="text-sm text-gray-400">Last Hour</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {[...new Set(auditLogs?.map(log => log.actor_id) || [])].length}
                </p>
                <p className="text-sm text-gray-400">Active Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {auditLogs?.filter(log => ['delete', 'user_banned'].includes(log.action_type)).length || 0}
                </p>
                <p className="text-sm text-gray-400">Critical Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Audit Trail</span>
            <Badge variant="outline" className="ml-auto">
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Action</TableHead>
                <TableHead className="text-gray-300">Actor</TableHead>
                <TableHead className="text-gray-300">Target</TableHead>
                <TableHead className="text-gray-300">Time</TableHead>
                <TableHead className="text-gray-300">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No audit logs found for the selected criteria
                  </TableCell>
                </TableRow>
              ) : (
                auditLogs?.map((log) => (
                  <TableRow key={log.id} className="border-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action_type)}
                        <Badge variant={getActionBadgeVariant(log.action_type)}>
                          {log.action_type.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">
                          {log.profile?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-400">
                          @{log.profile?.username || 'unknown'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {log.target_type && (
                          <Badge variant="outline" className="text-xs">
                            {log.target_type}
                          </Badge>
                        )}
                        {log.target_id && (
                          <div className="text-sm text-gray-400 mt-1 font-mono">
                            {log.target_id.length > 20 
                              ? `${log.target_id.substring(0, 20)}...` 
                              : log.target_id
                            }
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-white text-sm">
                          {formatTimeAgo(log.timestamp)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.payload && Object.keys(log.payload).length > 0 && (
                        <details className="cursor-pointer">
                          <summary className="text-sm text-blue-400 hover:text-blue-300">
                            View Details
                          </summary>
                          <pre className="text-xs bg-gray-800 p-2 rounded mt-2 max-w-xs overflow-auto text-gray-300">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </details>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAuditTrail;
