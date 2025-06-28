
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Activity, 
  User, 
  Settings, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface AuditLog {
  id: string;
  action_type: string;
  actor_id: string;
  target_type: string | null;
  target_id: string | null;
  timestamp: string;
  payload: any;
}

interface EnhancedAuditTrailProps {
  searchQuery: string;
}

const EnhancedAuditTrail = ({ searchQuery }: EnhancedAuditTrailProps) => {
  // Fetch audit logs with real-time updates
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', searchQuery],
    queryFn: async (): Promise<AuditLog[]> => {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (searchQuery) {
        query = query.or(`action_type.ilike.%${searchQuery}%,target_type.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000, // Real-time updates every 5 seconds
  });

  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'user_created':
      case 'user_updated':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'user_banned':
      case 'user_unbanned':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'role_change':
        return <Settings className="w-4 h-4 text-purple-400" />;
      case 'login_success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'login_failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionBadge = (actionType: string) => {
    const colors = {
      user_created: 'bg-green-900 text-green-300 border-green-800',
      user_updated: 'bg-blue-900 text-blue-300 border-blue-800',
      user_banned: 'bg-red-900 text-red-300 border-red-800',
      user_unbanned: 'bg-green-900 text-green-300 border-green-800',
      role_change: 'bg-purple-900 text-purple-300 border-purple-800',
      login_success: 'bg-green-900 text-green-300 border-green-800',
      login_failed: 'bg-red-900 text-red-300 border-red-800',
    };
    
    return (
      <Badge className={colors[actionType as keyof typeof colors] || 'bg-gray-800 text-gray-300 border-gray-700'}>
        {actionType.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
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
                    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    return logTime > dayAgo;
                  }).length || 0}
                </p>
                <p className="text-sm text-gray-400">Last 24h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {auditLogs?.filter(log => log.action_type.includes('success')).length || 0}
                </p>
                <p className="text-sm text-gray-400">Successful</p>
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
                  {auditLogs?.filter(log => log.action_type.includes('failed') || log.action_type.includes('banned')).length || 0}
                </p>
                <p className="text-sm text-gray-400">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Action</TableHead>
                <TableHead className="text-gray-300">Actor</TableHead>
                <TableHead className="text-gray-300">Target</TableHead>
                <TableHead className="text-gray-300">Details</TableHead>
                <TableHead className="text-gray-300">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs?.map((log) => (
                <TableRow key={log.id} className="border-gray-800">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action_type)}
                      {getActionBadge(log.action_type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white">
                      Actor
                    </div>
                    <div className="text-gray-400 text-xs">
                      ID: {log.actor_id?.slice(0, 8)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-300">
                      {log.target_type || 'N/A'}
                    </div>
                    {log.target_id && (
                      <div className="text-gray-500 text-xs">
                        {log.target_id.slice(0, 8)}...
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-300 text-sm max-w-xs truncate">
                      {log.payload && typeof log.payload === 'object' 
                        ? JSON.stringify(log.payload).slice(0, 50) + '...'
                        : 'No details'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-300 text-sm">
                      {formatTimestamp(log.timestamp)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {(!auditLogs || auditLogs.length === 0) && (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Audit Logs</h3>
              <p className="text-gray-400">No activity has been logged yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAuditTrail;
