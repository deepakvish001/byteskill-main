
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCourseInput = (data: {
  title: string;
  description?: string;
  tags?: string[];
}): ValidationResult => {
  const errors: string[] = [];

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  // Description validation
  if (data.description && data.description.length > 2000) {
    errors.push('Description must be less than 2000 characters');
  }

  // Sanitize HTML/script content
  if (containsHtmlOrScript(data.title)) {
    errors.push('Title cannot contain HTML or script tags');
  }

  if (data.description && containsHtmlOrScript(data.description)) {
    errors.push('Description cannot contain HTML or script tags');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateModuleInput = (data: {
  title: string;
  description?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  if (containsHtmlOrScript(data.title)) {
    errors.push('Title cannot contain HTML or script tags');
  }

  if (data.description && containsHtmlOrScript(data.description)) {
    errors.push('Description cannot contain HTML or script tags');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateChapterInput = (data: {
  title: string;
  description?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  if (containsHtmlOrScript(data.title)) {
    errors.push('Title cannot contain HTML or script tags');
  }

  if (data.description && containsHtmlOrScript(data.description)) {
    errors.push('Description cannot contain HTML or script tags');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateContentInput = (data: {
  title: string;
  description?: string;
  video_url?: string;
  practice_link?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  // URL validation
  if (data.video_url && !isValidUrl(data.video_url)) {
    errors.push('Video URL must be a valid HTTP/HTTPS URL');
  }

  if (data.practice_link && !isValidUrl(data.practice_link)) {
    errors.push('Practice link must be a valid HTTP/HTTPS URL');
  }

  if (containsHtmlOrScript(data.title)) {
    errors.push('Title cannot contain HTML or script tags');
  }

  if (data.description && containsHtmlOrScript(data.description)) {
    errors.push('Description cannot contain HTML or script tags');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateLessonInput = (data: {
  title: string;
  content?: string;
  video_url?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (data.video_url && !isValidUrl(data.video_url)) {
    errors.push('Video URL must be a valid HTTP/HTTPS URL');
  }

  if (containsHtmlOrScript(data.title)) {
    errors.push('Title cannot contain HTML or script tags');
  }

  if (data.content && containsHtmlOrScript(data.content)) {
    errors.push('Content cannot contain HTML or script tags');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const containsHtmlOrScript = (text: string): boolean => {
  const htmlScriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<[^>]*>/gi;
  return htmlScriptRegex.test(text);
};

const isValidUrl = (url: string): boolean => {
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim();
};
