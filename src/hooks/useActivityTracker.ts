
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ActivityData {
  problem_id?: string;
  course_id?: string;
  lesson_id?: string;
  content_id?: string;
  difficulty?: string;
  time_spent?: number;
  score?: number;
  [key: string]: any;
}

export const useActivityTracker = () => {
  const { user } = useAuth();

  const trackActivity = useCallback(async (
    activityType: string,
    pointsEarned: number = 0,
    activityData: ActivityData = {}
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: activityData,
          points_earned: pointsEarned
        });

      if (error) throw error;

      console.log(`Activity tracked: ${activityType} (+${pointsEarned} XP)`);
      
      if (pointsEarned > 0) {
        toast.success(`+${pointsEarned} XP earned for ${activityType.replace('_', ' ')}!`);
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [user]);

  // Specific activity trackers
  const trackProblemSolved = useCallback((problemId: string, difficulty: string, timeSpent: number) => {
    const points = difficulty === 'hard' ? 15 : difficulty === 'medium' ? 10 : 5;
    trackActivity('problem_solved', points, {
      problem_id: problemId,
      difficulty,
      time_spent: timeSpent
    });
  }, [trackActivity]);

  const trackLessonCompleted = useCallback((courseId: string, lessonId: string, timeSpent: number) => {
    trackActivity('lesson_completed', 5, {
      course_id: courseId,
      lesson_id: lessonId,
      time_spent: timeSpent
    });
  }, [trackActivity]);

  const trackCourseProgress = useCallback((courseId: string, progressPercentage: number) => {
    const points = Math.floor(progressPercentage / 10); // 1 point per 10% progress
    trackActivity('course_progress', points, {
      course_id: courseId,
      progress_percentage: progressPercentage
    });
  }, [trackActivity]);

  const trackLogin = useCallback(() => {
    trackActivity('daily_login', 1);
  }, [trackActivity]);

  const trackBookmark = useCallback((contentId: string, contentType: string) => {
    trackActivity('content_bookmarked', 0, {
      content_id: contentId,
      content_type: contentType
    });
  }, [trackActivity]);

  const trackNoteCreated = useCallback((contentId: string, noteLength: number) => {
    const points = noteLength > 100 ? 2 : 1; // Bonus for detailed notes
    trackActivity('note_created', points, {
      content_id: contentId,
      note_length: noteLength
    });
  }, [trackActivity]);

  const trackStreakMaintained = useCallback((streakCount: number) => {
    const points = Math.min(streakCount, 30); // Max 30 points for streak
    trackActivity('streak_maintained', points, {
      streak_count: streakCount
    });
  }, [trackActivity]);

  return {
    trackActivity,
    trackProblemSolved,
    trackLessonCompleted,
    trackCourseProgress,
    trackLogin,
    trackBookmark,
    trackNoteCreated,
    trackStreakMaintained
  };
};
