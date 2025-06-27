
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useActivityTracker } from './useActivityTracker';

interface ProgressState {
  problemStatuses: Record<number, "Solved" | "Attempted" | "Not Started">;
  bookmarkedProblems: number[];
  problemNotes: Record<number, string>;
}

export const useProgressHandler = (courseId: string) => {
  const { user } = useAuth();
  const { trackProblemSolved, trackBookmark, trackNoteCreated } = useActivityTracker();
  const [progressState, setProgressState] = useState<ProgressState>({
    problemStatuses: {},
    bookmarkedProblems: [],
    problemNotes: {}
  });

  const fetchUserProgress = useCallback(async (contentIdMap: Record<number, string>) => {
    if (!user) return;

    try {
      const { data: progress, error } = await supabase
        .from('user_content_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;

      const statuses: Record<number, "Solved" | "Attempted" | "Not Started"> = {};
      const bookmarks: number[] = [];
      const notes: Record<number, string> = {};

      progress?.forEach(p => {
        const problemId = parseInt(p.content_id.replace(/-/g, '').substring(0, 8), 16);
        
        if (p.is_completed) {
          statuses[problemId] = "Solved";
        } else if (p.time_spent_minutes > 0) {
          statuses[problemId] = "Attempted";
        } else {
          statuses[problemId] = "Not Started";
        }

        if (p.is_bookmarked) {
          bookmarks.push(problemId);
        }

        if (p.notes) {
          notes[problemId] = p.notes;
        }
      });

      setProgressState({
        problemStatuses: statuses,
        bookmarkedProblems: bookmarks,
        problemNotes: notes
      });
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  }, [user, courseId]);

  const toggleProblemStatus = useCallback(async (
    problemId: number, 
    contentId: string,
    moduleId: string,
    chapterId: string,
    difficulty: string = 'easy'
  ) => {
    if (!user) {
      toast.error("Please sign in to track your progress");
      return;
    }

    const currentStatus = progressState.problemStatuses[problemId] || "Not Started";
    let newStatus: "Solved" | "Attempted" | "Not Started";
    
    switch (currentStatus) {
      case "Not Started":
        newStatus = "Attempted";
        break;
      case "Attempted":
        newStatus = "Solved";
        break;
      case "Solved":
        newStatus = "Not Started";
        break;
      default:
        newStatus = "Not Started";
    }

    setProgressState(prev => ({
      ...prev,
      problemStatuses: {
        ...prev.problemStatuses,
        [problemId]: newStatus
      }
    }));

    try {
      const progressData = {
        user_id: user.id,
        content_id: contentId,
        course_id: courseId,
        module_id: moduleId,
        chapter_id: chapterId,
        is_completed: newStatus === "Solved",
        time_spent_minutes: newStatus !== "Not Started" ? 1 : 0,
        completed_at: newStatus === "Solved" ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('user_content_progress')
        .upsert(progressData, { 
          onConflict: 'user_id,content_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      
      // Track activity if problem was solved
      if (newStatus === "Solved" && currentStatus !== "Solved") {
        await trackProblemSolved(contentId, difficulty, 1);
      }
      
      toast.success(`Problem marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating problem status:', error);
      toast.error('Failed to update progress');
      setProgressState(prev => ({
        ...prev,
        problemStatuses: {
          ...prev.problemStatuses,
          [problemId]: currentStatus
        }
      }));
    }
  }, [user, courseId, progressState.problemStatuses, trackProblemSolved]);

  const toggleBookmark = useCallback(async (
    problemId: number,
    contentId: string,
    moduleId: string,
    chapterId: string
  ) => {
    if (!user) {
      toast.error("Please sign in to bookmark problems");
      return;
    }

    const isBookmarked = progressState.bookmarkedProblems.includes(problemId);

    try {
      const progressData = {
        user_id: user.id,
        content_id: contentId,
        course_id: courseId,
        module_id: moduleId,
        chapter_id: chapterId,
        is_bookmarked: !isBookmarked,
        bookmarked_at: !isBookmarked ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('user_content_progress')
        .upsert(progressData, { 
          onConflict: 'user_id,content_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      setProgressState(prev => ({
        ...prev,
        bookmarkedProblems: isBookmarked 
          ? prev.bookmarkedProblems.filter(id => id !== problemId)
          : [...prev.bookmarkedProblems, problemId]
      }));

      // Track bookmark activity
      if (!isBookmarked) {
        await trackBookmark(contentId, 'problem');
      }

      toast.success(isBookmarked ? 'Bookmark removed' : 'Problem bookmarked');
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  }, [user, courseId, progressState.bookmarkedProblems, trackBookmark]);

  const saveNote = useCallback(async (
    problemId: number,
    contentId: string,
    moduleId: string,
    chapterId: string,
    noteContent: string
  ) => {
    if (!user) {
      toast.error("Please sign in to save notes");
      return;
    }

    try {
      const progressData = {
        user_id: user.id,
        content_id: contentId,
        course_id: courseId,
        module_id: moduleId,
        chapter_id: chapterId,
        notes: noteContent
      };

      const { error } = await supabase
        .from('user_content_progress')
        .upsert(progressData, { 
          onConflict: 'user_id,content_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      setProgressState(prev => ({
        ...prev,
        problemNotes: {
          ...prev.problemNotes,
          [problemId]: noteContent
        }
      }));

      // Track note creation activity
      await trackNoteCreated(contentId, noteContent.length);

      toast.success('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  }, [user, courseId, trackNoteCreated]);

  return {
    progressState,
    fetchUserProgress,
    toggleProblemStatus,
    toggleBookmark,
    saveNote
  };
};
