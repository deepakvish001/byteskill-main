import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Editor } from "@/components/editor"
import { InputTag } from "@/components/input-tag"

interface Course {
  id?: string;
  course_id?: string;
  title: string;
  description: string;
  tagline?: string;
  category: string;
  difficulty: string;
  total_lessons: number;
  estimated_hours: number;
  tags: string[];
  prerequisites: string[];
  is_premium: boolean;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  tagline: z.string().optional(),
  category: z.string().min(2, {
    message: "Category must be selected.",
  }),
  difficulty: z.string().min(2, {
    message: "Difficulty must be selected.",
  }),
  total_lessons: z.number().min(0, {
    message: "Total lessons must be a non-negative number.",
  }).default(0),
  estimated_hours: z.number().min(0, {
    message: "Estimated hours must be a non-negative number.",
  }).default(0),
  tags: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  is_premium: z.boolean().default(false),
});

interface EnhancedCourseFormProps {
  course?: Course;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

type FormData = z.infer<typeof formSchema>;

const EnhancedCourseForm = ({ course, onSubmit, onCancel }: EnhancedCourseFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      tagline: course?.tagline || "",
      category: course?.category || "course",
      difficulty: course?.difficulty || "Easy",
      total_lessons: course?.total_lessons || 0,
      estimated_hours: course?.estimated_hours || 0,
      tags: course?.tags || [],
      prerequisites: course?.prerequisites || [],
      is_premium: course?.is_premium || false,
    },
    mode: "onChange",
  });

  // Function to generate SEO-friendly slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const { control, handleSubmit, formState: { isValid } , watch } = form;

  const watchTags = watch("tags");
	const watchPrerequisites = watch("prerequisites");

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Generate course_id as SEO-friendly slug if creating new course
      let courseId = course?.course_id;
      if (!courseId) {
        const baseSlug = generateSlug(data.title);
        const timestamp = Date.now();
        courseId = `${baseSlug}-${timestamp}`;
      }

      const courseData = {
        ...data,
        course_id: courseId,
        tags: data.tags.filter(tag => tag.trim() !== ''),
        prerequisites: data.prerequisites.filter(prereq => prereq.trim() !== ''),
        estimated_hours: Number(data.estimated_hours) || 0,
        total_lessons: Number(data.total_lessons) || 0,
      };

      await onSubmit(courseData);
      toast.success(course ? 'Course updated successfully!' : 'Course created successfully!');
    } catch (error) {
      console.error('Error submitting course:', error);
      toast.error('Failed to save course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" type="text" placeholder="Course Title"
          {...form.register("title", {
            required: "Title is required",
          })}
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Course Description"
          {...form.register("description", {
            required: "Description is required",
          })}
        />
        {form.formState.errors.description && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" type="text" placeholder="Course Tagline"
          {...form.register("tagline")}
        />
        {form.formState.errors.tagline && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.tagline.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Controller
            control={control}
            name="category"
            defaultValue={course?.category || "course"}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="dsa-sheet">DSA Sheet</SelectItem>
                  <SelectItem value="interview-prep">Interview Prep</SelectItem>
                  <SelectItem value="core-cs">Core CS</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.category && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Controller
            control={control}
            name="difficulty"
            defaultValue={course?.difficulty || "Easy"}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.difficulty && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.difficulty.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="total_lessons">Total Lessons</Label>
          <Input id="total_lessons" type="number" placeholder="Total Lessons"
            {...form.register("total_lessons", { valueAsNumber: true })}
          />
          {form.formState.errors.total_lessons && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.total_lessons.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="estimated_hours">Estimated Hours</Label>
          <Input id="estimated_hours" type="number" placeholder="Estimated Hours"
            {...form.register("estimated_hours", { valueAsNumber: true })}
          />
          {form.formState.errors.estimated_hours && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.estimated_hours.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
				<InputTag
					id="tags"
					placeholder="Add tags"
					onChange={(values) => {
						form.setValue("tags", values);
					}}
					values={watchTags}
				/>
        {form.formState.errors.tags && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.tags.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="prerequisites">Prerequisites</Label>
				<InputTag
					id="prerequisites"
					placeholder="Add prerequisites"
					onChange={(values) => {
						form.setValue("prerequisites", values);
					}}
					values={watchPrerequisites}
				/>
        {form.formState.errors.prerequisites && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.prerequisites.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="is_premium">Is Premium</Label>
        <input
          id="is_premium"
          type="checkbox"
          className="ml-2"
          {...form.register("is_premium")}
        />
        {form.formState.errors.is_premium && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.is_premium.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default EnhancedCourseForm;
