
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  FolderOpen,
  FileText,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Video,
  Link,
  Bookmark
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ModuleForm from './ModuleForm';
import ChapterForm from './ChapterForm';
import ContentForm from './ContentForm';

interface CourseHierarchyManagementProps {
  courseId: string;
  onClose: () => void;
}

const CourseHierarchyManagement = ({ courseId, onClose }: CourseHierarchyManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [formContext, setFormContext] = useState<{ type: string; parent?: any }>({ type: '' });

  // Fetch course with full hierarchy
  const { data: courseData, isLoading } = useQuery({
    queryKey: ['course-hierarchy', courseId],
    queryFn: async () => {
      // Fetch course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('course_id', courseId)
        .single();
      
      if (courseError) throw courseError;

      // Fetch modules with chapters and content
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_chapters (
            *,
            course_content (*)
          )
        `)
        .eq('course_id', courseId)
        .order('module_order');

      if (modulesError) throw modulesError;

      return { course, modules };
    },
  });

  // Delete mutations
  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: "Module deleted successfully" });
    },
  });

  const deleteChapterMutation = useMutation({
    mutationFn: async (chapterId: string) => {
      const { error } = await supabase
        .from('course_chapters')
        .delete()
        .eq('id', chapterId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: "Chapter deleted successfully" });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', contentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: "Content deleted successfully" });
    },
  });

  // Reorder mutations
  const reorderMutation = useMutation({
    mutationFn: async ({ table, items }: { table: string; items: any[] }) => {
      const updates = items.map((item, index) => ({
        id: item.id,
        [table === 'course_modules' ? 'module_order' : 
          table === 'course_chapters' ? 'chapter_order' : 'content_order']: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from(table)
          .update({ 
            [table === 'course_modules' ? 'module_order' : 
              table === 'course_chapters' ? 'chapter_order' : 'content_order']: update[table === 'course_modules' ? 'module_order' : 
                table === 'course_chapters' ? 'chapter_order' : 'content_order']
          })
          .eq('id', update.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-hierarchy', courseId] });
      toast({ title: "Order updated successfully" });
    },
  });

  const toggleModuleExpanded = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const toggleChapterExpanded = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleAddModule = () => {
    setSelectedModule(null);
    setFormContext({ type: 'module' });
    setShowModuleForm(true);
  };

  const handleEditModule = (module: any) => {
    setSelectedModule(module);
    setFormContext({ type: 'module' });
    setShowModuleForm(true);
  };

  const handleAddChapter = (module: any) => {
    setSelectedChapter(null);
    setFormContext({ type: 'chapter', parent: module });
    setShowChapterForm(true);
  };

  const handleEditChapter = (chapter: any) => {
    setSelectedChapter(chapter);
    setFormContext({ type: 'chapter' });
    setShowChapterForm(true);
  };

  const handleAddContent = (chapter: any) => {
    setSelectedContent(null);
    setFormContext({ type: 'content', parent: chapter });
    setShowContentForm(true);
  };

  const handleEditContent = (content: any) => {
    setSelectedContent(content);
    setFormContext({ type: 'content' });
    setShowContentForm(true);
  };

  const moveItem = (items: any[], fromIndex: number, toIndex: number) => {
    const result = [...items];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'secondary';
      case 'medium': return 'default';
      case 'hard': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Course Content Management</h2>
          <p className="text-gray-400">{courseData?.course.title}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAddModule}>
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {courseData?.modules?.map((module: any, moduleIndex: number) => (
          <Card key={module.id} className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Collapsible>
                    <CollapsibleTrigger
                      onClick={() => toggleModuleExpanded(module.id)}
                      className="flex items-center space-x-2"
                    >
                      {expandedModules.has(module.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <FolderOpen className="w-5 h-5 text-blue-400" />
                    </CollapsibleTrigger>
                  </Collapsible>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Module {module.module_order}: {module.title}
                    </h3>
                    <p className="text-sm text-gray-400">{module.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={module.is_published ? 'secondary' : 'destructive'}>
                    {module.is_published ? 'Published' : 'Draft'}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => handleEditModule(module)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddChapter(module)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <div className="flex flex-col">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={moduleIndex === 0}
                      onClick={() => {
                        const newOrder = moveItem(courseData.modules, moduleIndex, moduleIndex - 1);
                        reorderMutation.mutate({ table: 'course_modules', items: newOrder });
                      }}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={moduleIndex === courseData.modules.length - 1}
                      onClick={() => {
                        const newOrder = moveItem(courseData.modules, moduleIndex, moduleIndex + 1);
                        reorderMutation.mutate({ table: 'course_modules', items: newOrder });
                      }}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this module?')) {
                        deleteModuleMutation.mutate(module.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <Collapsible open={expandedModules.has(module.id)}>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {/* Chapters */}
                  <div className="space-y-3">
                    {module.course_chapters?.map((chapter: any, chapterIndex: number) => (
                      <Card key={chapter.id} className="bg-gray-800 border-gray-700 ml-6">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Collapsible>
                                <CollapsibleTrigger
                                  onClick={() => toggleChapterExpanded(chapter.id)}
                                  className="flex items-center space-x-2"
                                >
                                  {expandedChapters.has(chapter.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                  <BookOpen className="w-4 h-4 text-green-400" />
                                </CollapsibleTrigger>
                              </Collapsible>
                              <div>
                                <h4 className="font-medium text-white">
                                  Chapter {chapter.chapter_order}: {chapter.title}
                                </h4>
                                <p className="text-xs text-gray-400">{chapter.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {chapter.estimated_time_minutes}min
                              </Badge>
                              <Button size="sm" variant="outline" onClick={() => handleEditChapter(chapter)}>
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAddContent(chapter)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this chapter?')) {
                                    deleteChapterMutation.mutate(chapter.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <Collapsible open={expandedChapters.has(chapter.id)}>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              {/* Content Items */}
                              <div className="space-y-2">
                                {chapter.course_content?.map((content: any, contentIndex: number) => (
                                  <div key={content.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg ml-6">
                                    <div className="flex items-center space-x-3">
                                      {content.content_type === 'lecture' && <Video className="w-4 h-4 text-purple-400" />}
                                      {content.content_type === 'article' && <FileText className="w-4 h-4 text-yellow-400" />}
                                      {content.content_type === 'problem' && <Link className="w-4 h-4 text-red-400" />}
                                      <div>
                                        <h5 className="text-sm font-medium text-white">{content.title}</h5>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <Badge variant={getDifficultyBadgeVariant(content.difficulty)} className="text-xs">
                                            {content.difficulty}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            {content.content_type}
                                          </Badge>
                                          <span className="text-xs text-gray-400">{content.estimated_time_minutes}min</span>
                                          {content.is_bookmarkable && <Bookmark className="w-3 h-3 text-blue-400" />}
                                          {content.practice_link && <Link className="w-3 h-3 text-green-400" />}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Badge variant={content.status === 'published' ? 'secondary' : 'destructive'} className="text-xs">
                                        {content.status}
                                      </Badge>
                                      <Button size="sm" variant="outline" onClick={() => handleEditContent(content)}>
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                          if (confirm('Are you sure you want to delete this content?')) {
                                            deleteContentMutation.mutate(content.id);
                                          }
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                {(!chapter.course_content || chapter.course_content.length === 0) && (
                                  <div className="text-center py-4 text-gray-400 text-sm">
                                    No content items yet. Click "Add Content" to get started.
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                    {(!module.course_chapters || module.course_chapters.length === 0) && (
                      <div className="text-center py-4 text-gray-400 text-sm ml-6">
                        No chapters yet. Click "+" to add a chapter.
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
        {(!courseData?.modules || courseData.modules.length === 0) && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="text-center py-8">
              <p className="text-gray-400 mb-4">No modules yet. Start by adding your first module.</p>
              <Button onClick={handleAddModule}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Module
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Module Form Dialog */}
      <Dialog open={showModuleForm} onOpenChange={setShowModuleForm}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedModule ? 'Edit Module' : 'Add New Module'}
            </DialogTitle>
          </DialogHeader>
          <ModuleForm
            module={selectedModule}
            courseId={courseId}
            onClose={() => setShowModuleForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Chapter Form Dialog */}
      <Dialog open={showChapterForm} onOpenChange={setShowChapterForm}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedChapter ? 'Edit Chapter' : 'Add New Chapter'}
            </DialogTitle>
          </DialogHeader>
          <ChapterForm
            chapter={selectedChapter}
            moduleId={formContext.parent?.id}
            courseId={courseId}
            onClose={() => setShowChapterForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Content Form Dialog */}
      <Dialog open={showContentForm} onOpenChange={setShowContentForm}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedContent ? 'Edit Content' : 'Add New Content'}
            </DialogTitle>
          </DialogHeader>
          <ContentForm
            content={selectedContent}
            chapterId={formContext.parent?.id}
            moduleId={formContext.parent?.module_id}
            courseId={courseId}
            onClose={() => setShowContentForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseHierarchyManagement;
