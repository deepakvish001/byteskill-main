
import React from 'react';
import AdminContentManagement from './AdminContentManagement';

interface CoreCSManagementProps {
  searchQuery: string;
}

const CoreCSManagement = ({ searchQuery }: CoreCSManagementProps) => {
  return <AdminContentManagement category="core-cs" searchQuery={searchQuery} />;
};

export default CoreCSManagement;
