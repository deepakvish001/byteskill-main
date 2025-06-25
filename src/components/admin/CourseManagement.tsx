
import React from 'react';
import AdminContentManagement from './AdminContentManagement';

interface CourseManagementProps {
  searchQuery: string;
}

const CourseManagement = ({ searchQuery }: CourseManagementProps) => {
  return <AdminContentManagement category="course" searchQuery={searchQuery} />;
};

export default CourseManagement;
