
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
      <Card className="bg-[#1B1C2D] border-[#3A3B4D] shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#E2E8F0] text-xl">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-400" />
              Lesson Management - Course: {courseId}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAddLesson}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-[#3A3B4D] text-[#B0B8C1] hover:bg-[#1E1E2F] hover:text-[#E2E8F0] hover:border-[#4A4B5D] transition-all duration-200"
              >
                Close
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#2A2B3D] rounded-lg border border-[#3A3B4D] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#3A3B4D] hover:bg-[#1E1E2F]">
                  <TableHead className="text-[#B0B8C1] font-medium">Lesson #</TableHead>
                  <TableHead className="text-[#B0B8C1] font-medium">Title</TableHead>
                  <TableHead className="text-[#B0B8C1] font-medium">Duration</TableHead>
                  <TableHead className="text-[#B0B8C1] font-medium">Has Video</TableHead>
                  <TableHead className="text-[#B0B8C1] font-medium">Actions</TableHead>
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
                ) : lessons?.length === 0 ? (
                  <TableRow className="border-[#3A3B4D]">
                    <TableCell colSpan={5} className="text-center text-[#8F9BAA] py-8">
                      No lessons found. Add your first lesson!
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons?.map((lesson) => (
                    <TableRow key={lesson.id} className="border-[#3A3B4D] hover:bg-[#1E1E2F] transition-colors">
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-[#1E1E2F] border-[#3A3B4D] text-[#B0B8C1] hover:bg-[#2A2B3D] hover:border-[#4A4B5D]"
                        >
                          #{lesson.lesson_number}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-[#E2E8F0] font-medium">{lesson.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-[#8F9BAA]">
                          <Clock className="w-4 h-4 mr-1" />
                          {lesson.duration_minutes}m
                        </div>
                      </TableCell>
                      <TableCell>
                        {lesson.video_url ? (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/50 hover:bg-green-500/30">
                            Has Video
                          </Badge>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className="bg-[#1E1E2F] border-[#3A3B4D] text-[#8F9BAA] hover:bg-[#2A2B3D] hover:border-[#4A4B5D]"
                          >
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
                            className="border-[#3A3B4D] text-[#B0B8C1] hover:bg-[#1E1E2F] hover:text-[#E2E8F0] hover:border-[#4A4B5D] transition-all duration-200"
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
                            className="bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30 hover:border-red-500/70 transition-all duration-200"
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

      {/* Lesson Form Dialog */}
      <Dialog open={showLessonForm} onOpenChange={setShowLessonForm}>
        <DialogContent className="max-w-4xl bg-[#1B1C2D] border-[#3A3B4D] text-[#E2E8F0] shadow-2xl">
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
