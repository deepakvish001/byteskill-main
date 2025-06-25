
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

const AuditTrail = ({ searchQuery }: AuditTrailProps) => {
  // Fetch audit logs with manual join since foreign key doesn't exist
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', searchQuery],
    queryFn: async () => {
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

  const getActionBadgeVariant = (actionType: string) => {
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
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : auditLogs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No audit logs found</TableCell>
                </TableRow>
              ) : (
                auditLogs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action_type)}
                        <Badge variant={getActionBadgeVariant(log.action_type)}>
                          {log.action_type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.profile?.full_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">@{log.profile?.username || 'unknown'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {log.target_type && (
                          <Badge variant="outline">{log.target_type}</Badge>
                        )}
                        {log.target_id && (
                          <div className="text-sm text-gray-500 mt-1">{log.target_id}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {log.payload && Object.keys(log.payload).length > 0 && (
                        <pre className="text-xs bg-gray-100 p-2 rounded max-w-xs overflow-hidden">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
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

export default AuditTrail;
