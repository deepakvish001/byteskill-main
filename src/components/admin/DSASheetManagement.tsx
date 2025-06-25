
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Edit, Trash2, Plus, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CourseForm from './CourseForm';
import LessonForm from './LessonForm';

interface DSASheetManagementProps {
  searchQuery: string;
}

const DSASheetManagement = ({ searchQuery }: DSASheetManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSheet, setSelectedSheet] = useState<any>(null);
  const [showSheetForm, setShowSheetForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);

  // Fetch DSA sheets
  const { data: dsaSheets, isLoading } = useQuery({
    queryKey: ['admin-dsa-sheets', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .eq('category', 'dsa-sheet')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Toggle publish status
  const togglePublishMutation = useMutation({
    mutationFn: async ({ sheetId, isPublished }: { sheetId: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !isPublished })
        .eq('id', sheetId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dsa-sheets'] });
      toast({ title: "DSA Sheet status updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating DSA sheet status", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Delete sheet
  const deleteMutation = useMutation({
    mutationFn: async (sheetId: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', sheetId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dsa-sheets'] });
      toast({ title: "DSA Sheet deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error deleting DSA sheet", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'secondary';
      case 'intermediate': return 'default';
      case 'advanced': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            DSA Sheet Management
            <Button onClick={() => { setSelectedSheet(null); setShowSheetForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add DSA Sheet
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sheet</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Problems</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : (
                dsaSheets?.map((sheet) => (
                  <TableRow key={sheet.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sheet.title}</div>
                        <div className="text-sm text-gray-500">{sheet.course_id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getDifficultyBadgeVariant(sheet.difficulty)}>
                        {sheet.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{sheet.total_lessons || 0}</TableCell>
                    <TableCell>
                      <Badge variant={sheet.is_published ? 'secondary' : 'destructive'}>
                        {sheet.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sheet.is_premium && <Badge variant="outline">Premium</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedSheet(sheet); setShowSheetForm(true); }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedSheet(sheet); setShowLessonForm(true); }}>
                          <BookOpen className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={sheet.is_published ? "destructive" : "default"}
                          onClick={() => togglePublishMutation.mutate({
                            sheetId: sheet.id,
                            isPublished: sheet.is_published
                          })}
                        >
                          {sheet.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this DSA sheet?')) {
                              deleteMutation.mutate(sheet.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sheet Form Dialog */}
      <Dialog open={showSheetForm} onOpenChange={setShowSheetForm}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
          <CourseForm
            course={selectedSheet}
            category="dsa-sheet"
            onClose={() => setShowSheetForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Problem Form Dialog */}
      <Dialog open={showLessonForm} onOpenChange={setShowLessonForm}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
          <LessonForm
            courseId={selectedSheet?.course_id}
            onClose={() => setShowLessonForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DSASheetManagement;
