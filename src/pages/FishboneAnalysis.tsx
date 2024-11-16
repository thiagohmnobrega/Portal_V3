import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Download, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Cause {
  id: string;
  text: string;
}

interface Category {
  id: string;
  name: string;
  causes: Cause[];
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Máquina', causes: [] },
  { id: '2', name: 'Método', causes: [] },
  { id: '3', name: 'Mão de Obra', causes: [] },
  { id: '4', name: 'Material', causes: [] },
  { id: '5', name: 'Meio Ambiente', causes: [] },
  { id: '6', name: 'Medição', causes: [] },
];

export default function FishboneAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [description, setDescription] = useState('Descrição do problema...');
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  const addCause = (categoryId: string) => {
    setCategories(current =>
      current.map(category =>
        category.id === categoryId
          ? {
              ...category,
              causes: [
                ...category.causes,
                { id: Math.random().toString(36).substr(2, 9), text: '' }
              ]
            }
          : category
      )
    );
  };

  const updateCause = (categoryId: string, causeId: string, text: string) => {
    setCategories(current =>
      current.map(category =>
        category.id === categoryId
          ? {
              ...category,
              causes: category.causes.map(cause =>
                cause.id === causeId ? { ...cause, text } : cause
              )
            }
          : category
      )
    );
  };

  const removeCause = (categoryId: string, causeId: string) => {
    setCategories(current =>
      current.map(category =>
        category.id === categoryId
          ? {
              ...category,
              causes: category.causes.filter(cause => cause.id !== causeId)
            }
          : category
      )
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Diagrama de Ishikawa (Espinha de Peixe)', 20, 20);
    
    doc.setFontSize(12);
    doc.text('Problema:', 20, 40);
    doc.setFontSize(10);
    doc.text(description, 20, 50);
    
    let yPos = 70;
    categories.forEach(category => {
      doc.setFontSize(12);
      doc.text(category.name, 20, yPos);
      
      doc.setFontSize(10);
      category.causes.forEach(cause => {
        yPos += 10;
        doc.text(`- ${cause.text}`, 30, yPos);
      });
      yPos += 20;
    });
    
    doc.save(`fishbone-rnc-${id}.pdf`);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving analysis:', { description, categories });
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
          <h1 className="text-2xl font-bold text-gray-900">Diagrama de Espinha de Peixe</h1>
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

      <div className="max-w-4xl mx-auto space-y-6">
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

        <div className="grid grid-cols-2 gap-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {category.name}
              </h3>
              
              <div className="space-y-3">
                {category.causes.map(cause => (
                  <div key={cause.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={cause.text}
                      onChange={(e) => updateCause(category.id, cause.id, e.target.value)}
                      placeholder="Digite a causa..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeCause(category.id, cause.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => addCause(category.id)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Causa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}