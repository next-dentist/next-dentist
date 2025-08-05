"use client";

import { Tag } from "lucide-react";
import { Button } from "./ui/button";
interface TagsProps {
  tags?: string[];
}

export const Tags: React.FC<TagsProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags?.map((tag) => (
        <Button variant="outline" className="text-sm" size="sm" key={tag}>
          <Tag className="w-4 h-4" /> {tag}
        </Button>
      ))}
    </div>
  );
};
