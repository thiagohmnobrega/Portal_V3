import React from 'react';
import { Plus, Download, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchInput from './SearchInput';

interface RNCListHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  onExport: () => void;
}

export default function RNCListHeader({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  onExport
}: RNCListHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registro de Não Conformidade</h1>
        <div className="flex space-x-4">
          <button
            onClick={onExport}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-gray-700 dark:text-gray-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
          <Link 
            to="/quality/rnc/new" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova RNC
          </Link>
        </div>
      </div>

      <div className="flex gap-4">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Pesquisar RNCs..."
        />
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todos os Status</option>
            <option value="new">Novos</option>
            <option value="analyzing">Em Análise</option>
            <option value="resolved">Resolvidos</option>
          </select>
        </div>
      </div>
    </div>
  );
}