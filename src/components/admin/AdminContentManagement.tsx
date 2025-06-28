
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import CourseForm from './CourseForm';
import CourseHierarchyManagement from './CourseHierarchyManagement';
import ModernDialog from './ModernDialog';

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
    <div className="min-h-screen bg-black text-white">
      <div className="space-y-6 p-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="bg-gray-900 border-b border-gray-700">
            <CardTitle className="flex items-center justify-between text-white text-2xl">
              {getCategoryTitle()} Management
              <Button 
                onClick={() => { setSelectedCourse(null); setShowCourseForm(true); }}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {getCategoryTitle().slice(0, -1)}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-900 p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800">
                    <TableHead className="text-gray-300">Course</TableHead>
                    <TableHead className="text-gray-300">Difficulty</TableHead>
                    <TableHead className="text-gray-300">Tags</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Premium</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow className="border-gray-700 hover:bg-gray-800">
                      <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                          <span className="ml-2">Loading...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : courses?.length === 0 ? (
                    <TableRow className="border-gray-700 hover:bg-gray-800">
                      <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                        No {getCategoryTitle().toLowerCase()} found. Create your first one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    courses?.map((course) => (
                      <TableRow key={course.id} className="border-gray-700 hover:bg-gray-800 transition-colors">
                        <TableCell className="text-white">
                          <div className="space-y-1">
                            <div className="font-semibold text-lg">{course.title}</div>
                            <div className="text-sm text-orange-400 font-mono">{course.course_id}</div>
                            <div className="text-xs text-gray-400 max-w-md truncate">{course.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDifficultyBadgeVariant(course.difficulty)} className="capitalize">
                            {course.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {course.tags?.slice(0, 2).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                            {course.tags?.length > 2 && (
                              <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                                +{course.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={course.is_published ? 'default' : 'destructive'}
                            className={course.is_published ? 'bg-green-900 text-green-400 border-green-700' : ''}
                          >
                            {course.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {course.is_premium && (
                            <Badge variant="outline" className="bg-yellow-900/50 text-yellow-400 border-yellow-700">
                              Premium
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEditCourse(course)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleManageContent(course)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                              <FolderTree className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={course.is_published ? "destructive" : "default"}
                              onClick={() => togglePublishMutation.mutate({
                                courseId: course.id,
                                isPublished: course.is_published
                              })}
                              className={course.is_published ? '' : 'bg-green-600 hover:bg-green-700'}
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
            </div>
          </CardContent>
        </Card>

        {/* Course Form Dialog */}
        <ModernDialog
          isOpen={showCourseForm}
          onClose={() => setShowCourseForm(false)}
          title={selectedCourse ? `Edit ${getCategoryTitle().slice(0, -1)}` : `Create New ${getCategoryTitle().slice(0, -1)}`}
          maxWidth="max-w-5xl"
          preventClose={true}
        >
          <CourseForm
            course={selectedCourse}
            onClose={() => setShowCourseForm(false)}
            category={category as 'course' | 'dsa-sheet' | 'interview-prep' | 'core-cs'}
          />
        </ModernDialog>

        {/* Content Hierarchy Management Dialog */}
        <ModernDialog
          isOpen={showHierarchyManagement}
          onClose={() => setShowHierarchyManagement(false)}
          title="Manage Course Content"
          maxWidth="max-w-7xl"
          preventClose={true}
        >
          {selectedCourse && (
            <CourseHierarchyManagement
              courseId={selectedCourse.course_id}
              onClose={() => setShowHierarchyManagement(false)}
            />
          )}
        </ModernDialog>
      </div>
    </div>
  );
};

export default AdminContentManagement;
