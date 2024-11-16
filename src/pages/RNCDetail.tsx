import React, { useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Clock, 
  User, 
  Edit, 
  MessageSquare,
  PlusCircle,
  RefreshCw,
  Users,
  Printer,
  Mail,
  Download,
  X,
  BrainCircuit,
  Tag
} from 'lucide-react';
import type { RNC, RNCStatus } from '../types/rnc';
import RNCPrintView from '../components/RNCPrintView';
import RNCTags from '../components/RNCTags';

const statusOptions: { value: RNCStatus; label: string; color: string }[] = [
  { value: 'new', label: 'Novo', color: 'yellow' },
  { value: 'analyzing', label: 'Em Análise', color: 'blue' },
  { value: 'resolved', label: 'Resolvido', color: 'green' }
];

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
  timeline: [
    {
      id: '1',
      type: 'creation',
      description: 'RNC criada',
      createdAt: new Date('2024-03-10'),
      createdBy: 'João Silva'
    }
  ]
};

export default function RNCDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rnc, setRnc] = useState<RNC>(mockRNC);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', subject: '', message: '' });
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleDownloadPDF = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`RNC-${id}.pdf`);
    }
  };

  const handleSendEmail = () => {
    console.log('Sending email:', emailData);
    setIsEmailModalOpen(false);
    setEmailData({ to: '', subject: '', message: '' });
  };

  const handleEdit = () => {
    navigate(`/quality/rnc/${id}/edit`);
  };

  const handleStatusChange = (newStatus: RNCStatus) => {
    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'status_change' as const,
      description: `Status alterado para ${statusOptions.find(s => s.value === newStatus)?.label}`,
      createdAt: new Date(),
      createdBy: 'João Silva',
      metadata: {
        oldStatus: rnc.status,
        newStatus
      }
    };

    setRnc(prev => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date(),
      timeline: [newEvent, ...prev.timeline]
    }));
    setIsStatusModalOpen(false);
  };

  const handleWhatsApp = () => {
    if (rnc.contactPhone) {
      const formattedPhone = rnc.contactPhone.replace(/\D/g, '');
      window.open(`https://wa.me/55${formattedPhone}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RNC #{id}</h1>
        <div className="flex space-x-4">
          <Link
            to={`/quality/rnc/${id}/root-cause`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <BrainCircuit className="w-4 h-4 mr-2" />
            Análise de Causa Raiz
          </Link>
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
          >
            <Mail className="w-4 h-4 mr-2" />
            Enviar por Email
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </button>
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Atualizar Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detalhes</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                <p className="mt-1 text-gray-900 dark:text-white">{rnc.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nº do Pedido</label>
                <p className="mt-1 text-gray-900 dark:text-white">{rnc.orderNumber || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                <div className="mt-1">
                  <RNCTags tags={rnc.tags} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">{rnc.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                  <p className="mt-1 text-gray-900 dark:text-white capitalize">
                    {rnc.type === 'client' ? 'Cliente' : 'Fornecedor'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prioridade</label>
                  <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    rnc.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                    rnc.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  }`}>
                    {rnc.priority === 'high' ? 'Alta' :
                     rnc.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Linha do Tempo</h2>
            <div className="space-y-6">
              {rnc.timeline.map((event) => (
                <div key={event.id} className="relative pl-8 pb-6 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full flex items-center justify-center ${
                    event.type === 'status_change' ? 'bg-blue-500' :
                    event.type === 'edit' ? 'bg-yellow-500' :
                    event.type === 'creation' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}>
                    {event.type === 'creation' && <PlusCircle className="w-3 h-3 text-white" />}
                    {event.type === 'status_change' && <RefreshCw className="w-3 h-3 text-white" />}
                    {event.type === 'edit' && <Edit className="w-3 h-3 text-white" />}
                    {event.type === 'assignment' && <Users className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(event.createdAt).toLocaleString('pt-BR')}
                  </div>
                  <p className="text-gray-900 dark:text-white">{event.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">por {event.createdBy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Atual</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  rnc.status === 'new' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                  rnc.status === 'analyzing' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                  'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                }`}>
                  {statusOptions.find(s => s.value === rnc.status)?.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Responsável</span>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{rnc.assignedTo}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contato</h2>
              {rnc.contactPhone && (
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  WhatsApp
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                <p className="mt-1 text-gray-900 dark:text-white">{rnc.contactName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                <p className="mt-1 text-gray-900 dark:text-white">{rnc.contactPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden print view */}
      <div className="hidden">
        <RNCPrintView ref={printRef} rnc={rnc} />
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enviar RNC por Email</h3>
              <button onClick={() => setIsEmailModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Para
                </label>
                <input
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mensagem
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Atualizar Status</h3>
              <button onClick={() => setIsStatusModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
            </div>
            <div className="space-y-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border ${
                    rnc.status === option.value
                      ? `bg-${option.color}-50 dark:bg-${option.color}-900 border-${option.color}-200 dark:border-${option.color}-700`
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}