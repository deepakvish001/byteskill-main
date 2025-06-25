
import React from 'react';
import AdminContentManagement from './AdminContentManagement';

interface InterviewPrepManagementProps {
  searchQuery: string;
}

const InterviewPrepManagement = ({ searchQuery }: InterviewPrepManagementProps) => {
  return <AdminContentManagement category="interview-prep" searchQuery={searchQuery} />;
};

export default InterviewPrepManagement;
