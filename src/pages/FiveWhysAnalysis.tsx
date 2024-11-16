import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Download, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Why {
  id: string;
  question: string;
  answer: string;
}

export default function FiveWhysAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [description, setDescription] = useState('Descrição do problema...');
  const [whys, setWhys] = useState<Why[]>([
    { id: '1', question: 'Por que isso ocorreu?', answer: '' }
  ]);

  const handleAnswerChange = (id: string, answer: string) => {
    setWhys(current => {
      const updated = current.map(why => 
        why.id === id ? { ...why, answer } : why
      );
      
      // Add next question if we have less than 5 whys and current answer was filled
      if (answer && updated.length < 5) {
        const lastWhy = updated[updated.length - 1];
        if (lastWhy.id === id) {
          updated.push({
            id: (parseInt(lastWhy.id) + 1).toString(),
            question: 'Por que isso ocorreu?',
            answer: ''
          });
        }
      }
      
      return updated;
    });
  };

  const removeWhy = (id: string) => {
    setWhys(current => {
      const index = current.findIndex(why => why.id === id);
      return current.slice(0, index + 1);
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Análise dos 5 Porquês', 20, 20);
    
    doc.setFontSize(12);
    doc.text('Descrição do Problema:', 20, 40);
    doc.setFontSize(10);
    doc.text(description, 20, 50);
    
    let yPos = 70;
    whys.forEach((why, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}º Por quê:`, 20, yPos);
      doc.setFontSize(10);
      doc.text(why.answer || '(Sem resposta)', 20, yPos + 10);
      yPos += 30;
    });
    
    doc.save(`5-whys-rnc-${id}.pdf`);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving analysis:', { description, whys });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/quality/rnc/${id}/root-cause`)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Método dos 5 Porquês</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={exportPDF}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição do Problema
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="space-y-4">
          {whys.map((why, index) => (
            <div key={why.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {index + 1}º Por quê?
                </h3>
                {index > 0 && (
                  <button
                    onClick={() => removeWhy(why.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              <textarea
                value={why.answer}
                onChange={(e) => handleAnswerChange(why.id, e.target.value)}
                placeholder="Digite sua resposta..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
          ))}

          {whys.length < 5 && whys[whys.length - 1].answer && (
            <button
              onClick={() => handleAnswerChange(whys[whys.length - 1].id, whys[whys.length - 1].answer)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar próximo "Por quê?"
            </button>
          )}
        </div>
      </div>
    </div>
  );
}