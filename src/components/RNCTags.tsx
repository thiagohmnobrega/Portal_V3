import React from 'react';
import { Tag } from 'lucide-react';

interface RNCTagsProps {
  tags: string[];
}

export default function RNCTags({ tags }: RNCTagsProps) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
        >
          <Tag className="w-3 h-3 mr-1" />
          {tag}
        </span>
      ))}
    </div>
  );
}