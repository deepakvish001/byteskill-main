
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
import { Edit, Trash2, Plus, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LessonForm from './LessonForm';

interface LessonManagementProps {
  courseId: string;
  onClose: () => void;
}

const LessonManagement = ({ courseId, onClose }: LessonManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);

  // Fetch lessons for the course
  const { data: lessons, isLoading, error } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      console.log('Fetching lessons for course:', courseId);
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_number', { ascending: true });
      
      if (error) {
        console.error('Error fetching lessons:', error);
        throw error;
      }
      console.log('Fetched lessons:', data);
      return data;
    },
    enabled: !!courseId,
  });

  // Delete lesson
  const deleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      console.log('Deleting lesson:', lessonId);
      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', lessonId);
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons', courseId] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: "Lesson deleted successfully" });
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({ 
        title: "Error deleting lesson", 
        description: error.message || 'An unexpected error occurred',
        variant: "destructive" 
      });
    },
  });

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setShowLessonForm(true);
  };

  const handleAddLesson = () => {
    setSelectedLesson(null);
    setShowLessonForm(true);
  };

  const handleDeleteLesson = (lessonId: string, lessonTitle: string) => {
    if (confirm(`Are you sure you want to delete the lesson "${lessonTitle}"?`)) {
      deleteMutation.mutate(lessonId);
    }
  };

  if (error) {
    return (
      <Card className="bg-black border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-center">
            <div>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Lessons</h3>
              <p className="text-gray-400 mb-4">
                {error.message || 'Unable to load lessons for this course'}
              </p>
              <Button onClick={onClose} variant="outline" className="border-gray-700 text-gray-300">
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-100">
            <div>
              Lesson Management
              <div className="text-sm text-gray-400 font-normal mt-1">
                Course ID: {courseId}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddLesson} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-gray-100 bg-gray-800"
              >
                Close
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-400">Loading lessons...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Lesson #</TableHead>
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300">Duration</TableHead>
                  <TableHead className="text-gray-300">Has Video</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons?.length === 0 ? (
                  <TableRow className="border-gray-800">
                    <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                      <div>
                        <div className="text-lg font-medium mb-2">No lessons found</div>
                        <div className="text-sm">Add your first lesson to get started!</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons?.map((lesson) => (
                    <TableRow key={lesson.id} className="border-gray-800 hover:bg-gray-900/50">
                      <TableCell>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          #{lesson.lesson_number}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-100 font-medium">{lesson.title}</div>
                        {lesson.content && (
                          <div className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {lesson.content.substring(0, 100)}
                            {lesson.content.length > 100 && '...'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {lesson.duration_minutes || 0}m
                        </div>
                      </TableCell>
                      <TableCell>
                        {lesson.video_url ? (
                          <Badge className="bg-green-900 text-green-400 border-green-700">
                            Has Video
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-400 border-gray-600">
                            No Video
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditLesson(lesson)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-gray-100 bg-gray-800"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                            disabled={deleteMutation.isPending}
                            className="bg-red-900 hover:bg-red-800 border-red-700"
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
          )}
        </CardContent>
      </Card>

      {/* Lesson Form Dialog */}
      <Dialog open={showLessonForm} onOpenChange={setShowLessonForm}>
        <DialogContent className="max-w-4xl bg-black border-gray-800">
          <LessonForm
            courseId={courseId}
            lesson={selectedLesson}
            onClose={() => setShowLessonForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonManagement;
