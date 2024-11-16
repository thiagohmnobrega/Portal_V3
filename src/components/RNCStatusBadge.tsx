import React from 'react';
import type { RNCStatus } from '../types/rnc';

const statusConfig = {
  new: { label: 'Novo', classes: 'bg-yellow-100 text-yellow-800' },
  analyzing: { label: 'Em Análise', classes: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Resolvido', classes: 'bg-green-100 text-green-800' }
};

interface RNCStatusBadgeProps {
  status: RNCStatus;
}

export default function RNCStatusBadge({ status }: RNCStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.classes}`}>
      {config.label}
    </span>
  );
}