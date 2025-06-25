
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  BookOpen,
  FolderTree
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import EnhancedCourseForm from './EnhancedCourseForm';
import CourseHierarchyManagement from './CourseHierarchyManagement';

interface AdminContentManagementProps {
  category: string;
  searchQuery: string;
}

const AdminContentManagement = ({ category, searchQuery }: AdminContentManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showHierarchyManagement, setShowHierarchyManagement] = useState(false);

  // Fetch courses for this category
  const { data: courses, isLoading } = useQuery({
    queryKey: [`admin-${category}`, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .eq('category', category)
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
      queryClient.invalidateQueries({ queryKey: [`admin-${category}`] });
      toast({ title: "Course status updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating course status", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Delete course
  const deleteMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`admin-${category}`] });
      toast({ title: "Course deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error deleting course", 
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

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setShowCourseForm(true);
  };

  const handleManageContent = (course: any) => {
    setSelectedCourse(course);
    setShowHierarchyManagement(true);
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'course': return 'Courses';
      case 'dsa-sheet': return 'DSA Sheets';
      case 'interview-prep': return 'Interview Prep';
      case 'core-cs': return 'Core CS';
      default: return 'Content';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {getCategoryTitle()} Management
            <Button onClick={() => { setSelectedCourse(null); setShowCourseForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add {getCategoryTitle().slice(0, -1)}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
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
                courses?.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.course_id}</div>
                        <div className="text-xs text-gray-400 mt-1">{course.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getDifficultyBadgeVariant(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {course.tags?.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {course.tags?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
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
                        <Button size="sm" variant="outline" onClick={() => handleEditCourse(course)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleManageContent(course)}>
                          <FolderTree className="w-4 h-4" />
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
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete this ${category}?`)) {
                              deleteMutation.mutate(course.id);
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

      {/* Course Form Dialog */}
      <Dialog open={showCourseForm} onOpenChange={setShowCourseForm}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedCourse ? `Edit ${getCategoryTitle().slice(0, -1)}` : `Add New ${getCategoryTitle().slice(0, -1)}`}
            </DialogTitle>
          </DialogHeader>
          <EnhancedCourseForm
            course={selectedCourse}
            category={category}
            onClose={() => setShowCourseForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Content Hierarchy Management Dialog */}
      <Dialog open={showHierarchyManagement} onOpenChange={setShowHierarchyManagement}>
        <DialogContent className="max-w-7xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Manage Course Content
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <CourseHierarchyManagement
              courseId={selectedCourse.course_id}
              onClose={() => setShowHierarchyManagement(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContentManagement;
