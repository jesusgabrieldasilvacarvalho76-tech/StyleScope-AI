
import React from 'react';
import type { AnalysisRecord } from '../types';
import { dataUrlFromBase64 } from '../utils/fileUtils';
import { HistoryIcon } from './Icons';

interface HistoryScreenProps {
  history: AnalysisRecord[];
  onViewHistoryItem: (record: AnalysisRecord) => void;
  onClearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onViewHistoryItem, onClearHistory }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 sm:mb-0">Histórico de Análises</h1>
        {history.length > 0 && (
            <button onClick={onClearHistory} className="text-sm text-gray-500 hover:text-red-600 hover:underline transition-colors">Limpar histórico</button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-16">
          <HistoryIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Nenhuma análise encontrada.</h2>
          <p className="text-gray-500 mt-2">Comece uma nova análise para ver seu histórico aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.id}
              onClick={() => onViewHistoryItem(record)}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0">
                <img
                  src={dataUrlFromBase64(record.frontalPhoto)}
                  alt="Foto da análise"
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{record.result.analysis.faceShape} Face</p>
                <p className="text-sm text-gray-500">Análise de {new Date(record.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {record.result.recommendations.slice(0, 2).map(rec => (
                        <span key={rec.name} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{rec.name}</span>
                    ))}
                    {record.result.recommendations.length > 2 && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">...</span>}
                </div>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
