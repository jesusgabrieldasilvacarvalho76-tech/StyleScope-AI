
import React from 'react';
import type { AnalysisRecord, View } from '../types';
import { dataUrlFromBase64 } from '../utils/fileUtils';

interface HomeScreenProps {
  setView: (view: View) => void;
  history: AnalysisRecord[];
  onViewHistoryItem: (record: AnalysisRecord) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ setView, history, onViewHistoryItem }) => {
  const latestHistory = history.slice(0, 3);

  return (
    <div className="p-6 md:p-10 flex flex-col items-center min-h-screen animate-fade-in">
      <header className="text-center w-full max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Analisar Meu Rosto</h1>
        <p className="text-lg md:text-xl text-gray-600">
          Descubra os cortes de cabelo ideais para você com a ajuda da inteligência artificial.
        </p>
      </header>

      <main className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <button
          onClick={() => setView('upload')}
          className="w-full md:w-auto px-12 py-4 bg-black text-white text-lg font-semibold rounded-full shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mb-16"
        >
          Iniciar Análise
        </button>

        {history.length > 0 && (
          <section className="w-full text-center">
            <h2 className="text-2xl font-bold mb-6">Histórico Recente</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {latestHistory.map((record) => (
                <div
                  key={record.id}
                  className="cursor-pointer group border border-gray-200 rounded-lg overflow-hidden"
                  onClick={() => onViewHistoryItem(record)}
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={dataUrlFromBase64(record.frontalPhoto)}
                      alt="Análise anterior"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
            {history.length > 3 && (
                 <button onClick={() => setView('history')} className="mt-6 text-black font-semibold hover:underline">Ver todo o histórico</button>
            )}
          </section>
        )}
      </main>
    </div>
  );
};
