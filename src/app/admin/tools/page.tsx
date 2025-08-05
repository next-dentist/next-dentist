import { Suspense } from 'react';
import AdminToolsPageClient from './adminToolsPageClient';

const AdminToolsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminToolsPageClient />
    </Suspense>
  );
};

export default AdminToolsPage;
