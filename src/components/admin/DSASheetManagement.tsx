
import React from 'react';
import AdminContentManagement from './AdminContentManagement';

interface DSASheetManagementProps {
  searchQuery: string;
}

const DSASheetManagement = ({ searchQuery }: DSASheetManagementProps) => {
  return <AdminContentManagement category="dsa-sheet" searchQuery={searchQuery} />;
};

export default DSASheetManagement;
