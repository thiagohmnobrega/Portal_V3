import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    </div>
  );
}