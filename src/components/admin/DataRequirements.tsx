
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Users, BookOpen, Code2, GraduationCap, Brain } from 'lucide-react';

const DataRequirements = () => {
  const userPages = [
    {
      page: 'DSA Sheets (/dsa-sheets)',
      icon: Code2,
      description: 'Practice sheets for data structures and algorithms',
      requiredData: [
        'courses where category = "dsa-sheet" and is_published = true',
        'course enrollment status for current user',
        'progress percentage from course_enrollments'
      ],
      displayFields: ['title', 'description', 'difficulty', 'total_lessons', 'estimated_hours', 'tags', 'is_premium'],
      userActions: ['Browse sheets', 'Enroll in sheet', 'Track progress', 'Filter by difficulty']
    },
    {
      page: 'Courses (/courses)',
      icon: BookOpen,
      description: 'General educational courses',
      requiredData: [
        'courses where category = "course" and is_published = true',
        'course enrollment status for current user',
        'user ratings and reviews'
      ],
      displayFields: ['title', 'description', 'difficulty', 'total_lessons', 'estimated_hours', 'tags', 'is_premium'],
      userActions: ['Browse courses', 'Enroll in course', 'View syllabus', 'Read reviews']
    },
    {
      page: 'Interview Prep (/interview-prep)',
      icon: GraduationCap,
      description: 'Interview preparation materials',
      requiredData: [
        'courses where category = "interview-prep" and is_published = true',
        'course enrollment status for current user',
        'completion statistics by topic'
      ],
      displayFields: ['title', 'description', 'difficulty', 'total_lessons', 'estimated_hours', 'tags', 'is_premium'],
      userActions: ['Browse prep materials', 'Take mock interviews', 'Practice problems', 'Track readiness']
    },
    {
      page: 'Core CS (/core-cs)',
      icon: Brain,
      description: 'Computer science fundamentals',
      requiredData: [
        'courses where category = "core-cs" and is_published = true',
        'prerequisite course completion status',
        'learning path progress'
      ],
      displayFields: ['title', 'description', 'difficulty', 'total_lessons', 'estimated_hours', 'prerequisites', 'tags'],
      userActions: ['Follow learning paths', 'Study fundamentals', 'Complete assignments', 'Take quizzes']
    },
    {
      page: 'Individual Course (/course/:id)',
      icon: BookOpen,
      description: 'Detailed course interface',
      requiredData: [
        'course details by course_id',
        'course_lessons for the course ordered by lesson_number',
        'user enrollment status and progress',
        'lesson_progress for completed lessons'
      ],
      displayFields: ['All course fields', 'lesson content', 'video_url', 'duration_minutes', 'completion status'],
      userActions: ['Study lessons', 'Watch videos', 'Track progress', 'Take notes', 'Submit assignments']
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            User-Side Data Requirements
          </CardTitle>
          <p className="text-gray-400">
            This shows what data each user-facing page needs from the admin-created content
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {userPages.map((page, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <page.icon className="w-5 h-5 text-blue-500" />
                {page.page}
              </CardTitle>
              <p className="text-gray-400">{page.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Required Database Queries */}
              <div>
                <h4 className="text-white font-semibold mb-2">Required Database Queries:</h4>
                <div className="space-y-1">
                  {page.requiredData.map((query, i) => (
                    <Badge key={i} variant="outline" className="mr-2 mb-1 bg-blue-900/20 text-blue-300 border-blue-700">
                      {query}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Display Fields */}
              <div>
                <h4 className="text-white font-semibold mb-2">Fields to Display:</h4>
                <div className="space-y-1">
                  {page.displayFields.map((field, i) => (
                    <Badge key={i} variant="secondary" className="mr-2 mb-1 bg-green-900/20 text-green-300">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* User Actions */}
              <div>
                <h4 className="text-white font-semibold mb-2">User Actions:</h4>
                <div className="space-y-1">
                  {page.userActions.map((action, i) => (
                    <Badge key={i} variant="outline" className="mr-2 mb-1 bg-purple-900/20 text-purple-300 border-purple-700">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Data Flow Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span><strong>Admin creates content</strong> → courses & course_lessons tables populated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span><strong>Admin publishes content</strong> → is_published = true, visible to users</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span><strong>Users browse & enroll</strong> → course_enrollments table updated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span><strong>Users study content</strong> → lesson_progress table tracks completion</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span><strong>Progress aggregated</strong> → course_enrollments.progress_percentage updated</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataRequirements;
