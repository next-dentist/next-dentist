// Edit Blog Page

'use client';
import AddBlogForm from '@/components/addBlogForm';
import { useAdminBlog } from '@/hooks/useAdminBlog';

interface EditBlogPageProps {
  id: string;
}

export default function EditBlogPage({ id }: EditBlogPageProps) {
  const {
    useFetchBlogById,
    updateBlogMutate,
    isUpdating,
    updateError,
    isUpdateSuccess,
    resetUpdate,
  } = useAdminBlog();

  const { data: blog, isLoading, error } = useFetchBlogById(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || String(error)}</div>;
  if (!blog) return <div>Blog not found.</div>;

  // Use AddBlogForm for editing, passing initial data and update handler
  return (
    <div>
      <h1>Edit Blog</h1>
      <AddBlogForm blogId={id} />
      {isUpdateSuccess && (
        <div style={{ color: 'green' }}>
          Blog updated successfully!
          <button onClick={resetUpdate}>Dismiss</button>
        </div>
      )}
    </div>
  );
}
