import React from 'react';

const priorityConfig = {
  low: { label: 'Baixa', classes: 'bg-green-100 text-green-800' },
  medium: { label: 'Média', classes: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'Alta', classes: 'bg-red-100 text-red-800' }
};

interface RNCPriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

export default function RNCPriorityBadge({ priority }: RNCPriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.classes}`}>
      {config.label}
    </span>
  );
}