
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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

interface CourseManagementProps {
  searchQuery: string;
}

const CourseManagement = ({ searchQuery }: CourseManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);

  // Fetch courses (general courses, not DSA sheets or other specific categories)
  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .eq('category', 'course')
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
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
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

  const handleAddLessons = (course: any) => {
    setSelectedCourse(course);
    setShowLessonForm(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Course Management
            <Button onClick={() => { setSelectedCourse(null); setShowCourseForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
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
                courses?.map((course) => (
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
                        <Button size="sm" variant="outline" onClick={() => handleEditCourse(course)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAddLessons(course)}>
                          <BookOpen className="w-4 h-4" />
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
                            if (confirm('Are you sure you want to delete this course?')) {
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
          <CourseForm
            course={selectedCourse}
            category="course"
            onClose={() => setShowCourseForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Lesson Form Dialog */}
      <Dialog open={showLessonForm} onOpenChange={setShowLessonForm}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
          <LessonForm
            courseId={selectedCourse?.course_id}
            onClose={() => setShowLessonForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
