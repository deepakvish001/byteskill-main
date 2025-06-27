
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useActivityTracker = () => {
  const { user } = useAuth();

  const trackActivity = useCallback(async (
    activityType: string,
    activityData: any = {},
    pointsEarned: number = 0
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
        toast.success(`+${pointsEarned} XP earned!`, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [user]);

  const trackProblemSolved = useCallback(async (
    problemId: string,
    difficulty: 'easy' | 'medium' | 'hard',
    timeSpent: number
  ) => {
    const points = {
      easy: 10,
      medium: 15,
      hard: 25
    };

    await trackActivity('problem_solved', {
      problem_id: problemId,
      difficulty,
      time_spent_minutes: timeSpent
    }, points[difficulty]);
  }, [trackActivity]);

  const trackLessonCompleted = useCallback(async (
    lessonId: string,
    courseId: string,
    timeSpent: number
  ) => {
    await trackActivity('lesson_completed', {
      lesson_id: lessonId,
      course_id: courseId,
      time_spent_minutes: timeSpent
    }, 5);
  }, [trackActivity]);

  const trackCourseProgress = useCallback(async (
    courseId: string,
    progressPercentage: number
  ) => {
    const points = Math.floor(progressPercentage / 10); // 1 point per 10% progress
    
    await trackActivity('course_progress', {
      course_id: courseId,
      progress_percentage: progressPercentage
    }, points);
  }, [trackActivity]);

  const trackProfileUpdate = useCallback(async () => {
    await trackActivity('profile_updated', {}, 2);
  }, [trackActivity]);

  const trackLogin = useCallback(async () => {
    await trackActivity('daily_login', {}, 1);
  }, [trackActivity]);

  return {
    trackActivity,
    trackProblemSolved,
    trackLessonCompleted,
    trackCourseProgress,
    trackProfileUpdate,
    trackLogin
  };
};
