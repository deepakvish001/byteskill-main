
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
import { Shield, User, Settings, Trash2 } from 'lucide-react';

interface AuditTrailProps {
  searchQuery: string;
}

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

const AuditTrail = ({ searchQuery }: AuditTrailProps) => {
  // Fetch audit logs with manual join since foreign key doesn't exist
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', searchQuery],
    queryFn: async (): Promise<AuditLogWithProfile[]> => {
      // First get audit logs
      let auditQuery = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (searchQuery) {
        auditQuery = auditQuery.ilike('action_type', `%${searchQuery}%`);
      }

      const { data: auditData, error: auditError } = await auditQuery;
      if (auditError) throw auditError;

      // Then get profiles for the actors
      if (auditData && auditData.length > 0) {
        const actorIds = [...new Set(auditData.map(log => log.actor_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', actorIds);

        if (profilesError) throw profilesError;

        // Manually combine the data
        return auditData.map(log => ({
          ...log,
          profile: profilesData?.find(profile => profile.id === log.actor_id)
        }));
      }

      return auditData || [];
    },
  });

  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'user_update':
      case 'user_create':
        return <User className="w-4 h-4" />;
      case 'role_change':
        return <Shield className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getActionBadgeVariant = (actionType: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (actionType.toLowerCase()) {
      case 'create':
        return 'secondary';
      case 'update':
        return 'default';
      case 'delete':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#1B1C2D] border-[#3A3B4D] shadow-xl">
        <CardHeader>
          <CardTitle className="text-[#E2E8F0] text-xl">Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#2A2B3D] rounded-lg border border-[#3A3B4D] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#3A3B4D] hover:bg-[#1E1E2F]">
                  <TableHead className="text-[#B0B8C1] font-medium">Action</TableHead>
                  <TableHead className="text-[#B0B8C1] font-medium">Actor</TableHead>
                  <TableHead className="text-[#B0B8C1] font-medium">Target</TableHead>
                  <TableHead className="text-[#B0B8C1] font-medium">Timestamp</TableHead>
                  <TableHead className="text-[#B0B8C1] font-medium">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-[#3A3B4D]">
                    <TableCell colSpan={5} className="text-center text-[#8F9BAA] py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : auditLogs?.length === 0 ? (
                  <TableRow className="border-[#3A3B4D]">
                    <TableCell colSpan={5} className="text-center text-[#8F9BAA] py-8">No audit logs found</TableCell>
                  </TableRow>
                ) : (
                  auditLogs?.map((log) => (
                    <TableRow key={log.id} className="border-[#3A3B4D] hover:bg-[#1E1E2F] transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-[#8F9BAA]">
                            {getActionIcon(log.action_type)}
                          </div>
                          <Badge 
                            variant={getActionBadgeVariant(log.action_type)}
                            className={`${
                              getActionBadgeVariant(log.action_type) === 'destructive' 
                                ? 'bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30' 
                                : getActionBadgeVariant(log.action_type) === 'secondary'
                                ? 'bg-green-500/20 text-green-300 border-green-500/50 hover:bg-green-500/30'
                                : 'bg-blue-500/20 text-blue-300 border-blue-500/50 hover:bg-blue-500/30'
                            }`}
                          >
                            {log.action_type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-[#E2E8F0]">{log.profile?.full_name || 'Unknown'}</div>
                          <div className="text-sm text-[#8F9BAA]">@{log.profile?.username || 'unknown'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {log.target_type && (
                            <Badge 
                              variant="outline" 
                              className="bg-[#1E1E2F] border-[#3A3B4D] text-[#B0B8C1] hover:bg-[#2A2B3D] hover:border-[#4A4B5D]"
                            >
                              {log.target_type}
                            </Badge>
                          )}
                          {log.target_id && (
                            <div className="text-sm text-[#8F9BAA] mt-1 font-mono">{log.target_id}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[#B0B8C1] text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.payload && Object.keys(log.payload).length > 0 && (
                          <pre className="text-xs bg-[#1E1E2F] border border-[#3A3B4D] text-[#B0B8C1] p-2 rounded max-w-xs overflow-hidden">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrail;
