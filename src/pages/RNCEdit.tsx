import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import type { RNC, RNCStatus, RNCType } from '../types/rnc';
import { createTimelineEvent } from '../utils/timeline';
import FormField from '../components/forms/FormField';
import Input from '../components/forms/Input';
import Select from '../components/forms/Select';
import TagInput from '../components/forms/TagInput';

const mockRNC: RNC = {
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
};

const typeOptions = [
  { value: 'client', label: 'Cliente' },
  { value: 'supplier', label: 'Fornecedor' }
];

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' }
];

export default function RNCEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<RNC>>(
    id === 'new' ? {
      title: '',
      description: '',
      type: 'client',
      status: 'new',
      priority: 'medium',
      assignedTo: '',
      orderNumber: '',
      collectionDate: undefined,
      contactName: '',
      contactPhone: '',
      tags: [],
      timeline: []
    } : mockRNC
  );

  const handleAddTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tag]
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (id === 'new') {
        const creationEvent = createTimelineEvent(
          'creation',
          'RNC criada',
          'João Silva' // TODO: Get from auth context
        );
        formData.timeline = [creationEvent];
      }

      // TODO: Implement API call
      console.log('Saving RNC:', formData);
      
      navigate('/quality/rnc');
    } catch (error) {
      console.error('Error saving RNC:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {id === 'new' ? 'Nova RNC' : 'Editar RNC'}
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/quality/rnc')}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="rnc-form"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </button>
        </div>
      </div>

      <form id="rnc-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Informações Básicas
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <FormField label="Título">
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Nº do Pedido">
              <Input
                type="text"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                placeholder="Ex: PED-2024-001"
              />
            </FormField>

            <FormField label="Tags">
              <TagInput
                tags={formData.tags || []}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />
            </FormField>

            <FormField label="Descrição">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-6">
              <FormField label="Tipo">
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as RNCType })}
                  options={typeOptions}
                  required
                />
              </FormField>

              <FormField label="Prioridade">
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  options={priorityOptions}
                  required
                />
              </FormField>
            </div>

            <FormField label="Responsável">
              <Input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Informações de Contato
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <FormField label="Nome do Contato">
              <Input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
            </FormField>

            <FormField label="Telefone">
              <Input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
}