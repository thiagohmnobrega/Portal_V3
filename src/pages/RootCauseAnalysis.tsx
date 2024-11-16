import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Fish, List } from 'lucide-react';

export default function RootCauseAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/quality/rnc/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Selecione o Método de Análise</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-blue-700">
              A análise de causa raiz é uma metodologia estruturada para identificar a origem fundamental de um problema.
              Selecione um dos métodos abaixo para iniciar sua análise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => navigate(`/quality/rnc/${id}/root-cause/five-whys`)}
            className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <List className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">5 Porquês</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Método iterativo de perguntas para explorar relações de causa e efeito.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate(`/quality/rnc/${id}/root-cause/fishbone`)}
            className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Fish className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Espinha de Peixe</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Diagrama visual para identificar múltiplas causas potenciais.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}