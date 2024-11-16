import React from 'react';
import type { RNC } from '../types/rnc';
import { format } from 'date-fns';

interface RNCPrintViewProps {
  rnc: RNC;
}

const RNCPrintView = React.forwardRef<HTMLDivElement, RNCPrintViewProps>(({ rnc }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Registro de Não Conformidade</h1>
        <p className="text-gray-600">RNC #{rnc.id}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Título</p>
              <p className="text-gray-900">{rnc.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tipo</p>
              <p className="text-gray-900 capitalize">{rnc.type === 'client' ? 'Cliente' : 'Fornecedor'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-gray-900 capitalize">{rnc.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Prioridade</p>
              <p className="text-gray-900 capitalize">{rnc.priority}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Contato</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Nome</p>
              <p className="text-gray-900">{rnc.contactName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Telefone</p>
              <p className="text-gray-900">{rnc.contactPhone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Descrição</h2>
        <p className="text-gray-900 whitespace-pre-wrap">{rnc.description}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Histórico</h2>
        <div className="space-y-4">
          {rnc.timeline.map((event) => (
            <div key={event.id} className="border-b pb-4">
              <p className="text-sm text-gray-600">
                {format(new Date(event.createdAt), 'dd/MM/yyyy HH:mm')}
              </p>
              <p className="text-gray-900">{event.description}</p>
              <p className="text-sm text-gray-600">por {event.createdBy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Documento gerado em {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
      </div>
    </div>
  );
});

RNCPrintView.displayName = 'RNCPrintView';

export default RNCPrintView;