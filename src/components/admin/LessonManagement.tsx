
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
import { Edit, Trash2, Plus, Clock, BookOpen } from 'lucide-react';
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
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_number', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  // Delete lesson
  const deleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', lessonId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons', courseId] });
      toast({ title: "Lesson deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error deleting lesson", 
        description: error.message,
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

  return (
    <div className="space-y-6">
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-100">
            Lesson Management - Course: {courseId}
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
              {isLoading ? (
                <TableRow className="border-gray-800">
                  <TableCell colSpan={5} className="text-center text-gray-400">Loading...</TableCell>
                </TableRow>
              ) : lessons?.length === 0 ? (
                <TableRow className="border-gray-800">
                  <TableCell colSpan={5} className="text-center text-gray-400">
                    No lessons found. Add your first lesson!
                  </TableCell>
                </TableRow>
              ) : (
                lessons?.map((lesson) => (
                  <TableRow key={lesson.id} className="border-gray-800">
                    <TableCell>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">#{lesson.lesson_number}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-100 font-medium">{lesson.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {lesson.duration_minutes}m
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
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this lesson?')) {
                              deleteMutation.mutate(lesson.id);
                            }
                          }}
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
