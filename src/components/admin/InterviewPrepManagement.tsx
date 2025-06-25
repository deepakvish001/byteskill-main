
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InterviewPrepManagementProps {
  searchQuery: string;
}

const InterviewPrepManagement = ({ searchQuery }: InterviewPrepManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Interview Prep courses
  const { data: interviewPreps, isLoading } = useQuery({
    queryKey: ['admin-interview-prep', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .eq('category', 'interview-prep')
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
    mutationFn: async ({ courseId, isPublished }: { courseId: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !isPublished })
        .eq('id', courseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-interview-prep'] });
      toast({ title: "Interview prep status updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating interview prep status", 
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
            Interview Prep Management
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Interview Prep
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Lessons</TableHead>
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
                interviewPreps?.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.course_id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getDifficultyBadgeVariant(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.total_lessons || 0}</TableCell>
                    <TableCell>
                      <Badge variant={course.is_published ? 'secondary' : 'destructive'}>
                        {course.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {course.is_premium && <Badge variant="outline">Premium</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={course.is_published ? "destructive" : "default"}
                          onClick={() => togglePublishMutation.mutate({
                            courseId: course.id,
                            isPublished: course.is_published
                          })}
                        >
                          {course.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="destructive">
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
    </div>
  );
};

export default InterviewPrepManagement;
