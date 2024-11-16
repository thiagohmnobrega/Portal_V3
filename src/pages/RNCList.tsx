import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { RNC } from '../types/rnc';
import RNCListHeader from '../components/RNCListHeader';
import VirtualTable from '../components/VirtualTable';
import RNCStatusBadge from '../components/RNCStatusBadge';
import RNCPriorityBadge from '../components/RNCPriorityBadge';
import RNCTags from '../components/RNCTags';

const mockRNCs: RNC[] = [
  {
    id: '1',
    type: 'client',
    status: 'new',
    title: 'Problema de Qualidade - Lote A123',
    description: 'Cliente reportou defeitos no último envio',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    priority: 'high',
    assignedTo: 'João Silva',
    contactName: 'Maria Santos',
    contactPhone: '11999887766',
    orderNumber: 'PED-2024-001',
    tags: ['Embalagem', 'Produto Danificado'],
    timeline: []
  }
];

export default function RNCList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RNC;
    direction: 'asc' | 'desc';
  }>({ key: 'createdAt', direction: 'desc' });

  const filteredRNCs = useMemo(() => {
    return mockRNCs
      .filter(rnc => {
        const searchFields = [
          rnc.title.toLowerCase(),
          rnc.id.toLowerCase(),
          rnc.orderNumber?.toLowerCase() || '',
          ...rnc.tags.map(tag => tag.toLowerCase())
        ];
        const matchesSearch = searchFields.some(field => field.includes(searchTerm.toLowerCase()));
        const matchesFilter = filter === 'all' || rnc.status === filter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const direction = sortConfig.direction === 'asc' ? 1 : -1;
        
        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
      });
  }, [searchTerm, filter, sortConfig]);

  const handleExport = async () => {
    const csvContent = [
      ['ID', 'Nº Pedido', 'Título', 'Tipo', 'Status', 'Prioridade', 'Responsável', 'Contato', 'Tags'],
      ...filteredRNCs.map(rnc => [
        rnc.id,
        rnc.orderNumber || '',
        rnc.title,
        rnc.type === 'client' ? 'Cliente' : 'Fornecedor',
        rnc.status,
        rnc.priority,
        rnc.assignedTo,
        rnc.contactName,
        rnc.tags.join(', ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rncs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      width: 80,
      render: (rnc: RNC) => (
        <Link to={`/quality/rnc/${rnc.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
          #{rnc.id}
        </Link>
      )
    },
    {
      key: 'orderNumber',
      header: 'Nº Pedido',
      width: 120,
      render: (rnc: RNC) => (
        <span className="text-gray-900 dark:text-gray-100">{rnc.orderNumber || '-'}</span>
      )
    },
    {
      key: 'title',
      header: 'Título',
      width: 'auto',
      render: (rnc: RNC) => (
        <div className="space-y-1">
          <Link to={`/quality/rnc/${rnc.id}`} className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
            {rnc.title}
          </Link>
          <RNCTags tags={rnc.tags} />
        </div>
      )
    },
    {
      key: 'type',
      header: 'Tipo',
      width: 120,
      render: (rnc: RNC) => (
        <span className="text-gray-900 dark:text-gray-100 capitalize">
          {rnc.type === 'client' ? 'Cliente' : 'Fornecedor'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: 120,
      render: (rnc: RNC) => <RNCStatusBadge status={rnc.status} />
    },
    {
      key: 'priority',
      header: 'Prioridade',
      width: 120,
      render: (rnc: RNC) => <RNCPriorityBadge priority={rnc.priority} />
    },
    {
      key: 'assignedTo',
      header: 'Responsável',
      width: 160,
      render: (rnc: RNC) => <span className="text-gray-900 dark:text-gray-100">{rnc.assignedTo}</span>
    },
    {
      key: 'contactName',
      header: 'Contato',
      width: 160,
      render: (rnc: RNC) => <span className="text-gray-900 dark:text-gray-100">{rnc.contactName}</span>
    },
    {
      key: 'actions',
      header: 'Ações',
      width: 100,
      render: (rnc: RNC) => (
        <Link 
          to={`/quality/rnc/${rnc.id}/edit`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Editar
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <RNCListHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
        onExport={handleExport}
      />
      
      <VirtualTable
        data={filteredRNCs}
        columns={columns}
        rowHeight={80}
        minHeight={500}
        maxHeight={700}
      />
    </div>
  );
}