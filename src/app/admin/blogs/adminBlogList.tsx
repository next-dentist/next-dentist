// Admin Blog List with shadcn table, status change, edit, and image preview
'use client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminBlog } from '@/hooks/useAdminBlog';
import { BlogStatus } from '@prisma/client';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'deleted', label: 'Deleted' },
];

const AdminBlogList: React.FC = () => {
  const {
    blogs = [],
    isBlogsLoading,
    blogsError,
    updateBlogMutate,
    isUpdating,
    refetchBlogs,
  } = useAdminBlog();

  return (
    <div className="container mx-auto px-2 py-8">
      <h1 className="mb-6 text-2xl font-bold">Blog Management</h1>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/blogs/add">
          <Button variant="default">Create New Blog</Button>
        </Link>
      </div>
      <div className="overflow-x-auto rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created</TableHead>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isBlogsLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <span className="text-muted-foreground">
                    Loading blogs...
                  </span>
                </TableCell>
              </TableRow>
            ) : blogsError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-red-500"
                >
                  Error loading blogs.
                </TableCell>
              </TableRow>
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No blogs found.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog: any) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <span className="text-muted-foreground text-xs">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title || 'Blog Image'}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded text-xs">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">
                    <div className="font-medium">
                      {blog.title || 'Untitled'}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {blog.authorName || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {blog.category && blog.category.name ? (
                      <span className="text-xs">{blog.category.name}</span>
                    ) : blog.categories &&
                      Array.isArray(blog.categories) &&
                      blog.categories.length > 0 ? (
                      <span className="text-xs">
                        {blog.categories.map((cat: any) => cat.name).join(', ')}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={(blog.status as BlogStatus) || BlogStatus.draft}
                      onValueChange={val => {
                        if (val !== blog.status) {
                          updateBlogMutate({
                            id: blog.id,
                            status: val as BlogStatus,
                          });
                        }
                      }}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/blogs/edit/${blog.id}`}>
                      <Button
                        size="icon"
                        variant="outline"
                        className="mr-2"
                        aria-label="Edit Blog"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBlogList;
