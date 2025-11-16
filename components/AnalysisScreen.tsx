
import React from 'react';
import type { AnalysisRecord } from '../types';
import { dataUrlFromBase64 } from '../utils/fileUtils';

interface AnalysisScreenProps {
  isLoading: boolean;
  error: string | null;
  analysisRecord: AnalysisRecord | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-semibold tracking-tight">Analisando suas feições...</h2>
        <p className="text-gray-600 mt-2">Aguarde, a IA está trabalhando para encontrar os melhores cortes para você.</p>
    </div>
);

const AnalysisDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
        <p className="text-lg font-medium text-black">{value}</p>
    </div>
);

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ isLoading, error, analysisRecord }) => {
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-150px)]"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)] text-center p-4">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800">Ocorreu um Erro</h2>
            <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysisRecord) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)] text-center p-4">
            <p>Nenhuma análise para exibir.</p>
        </div>
    );
  }
  
  const { result, frontalPhoto } = analysisRecord;
  const { analysis, recommendations } = result;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8">Sua Análise e Recomendações</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1">
                <img src={dataUrlFromBase64(frontalPhoto)} alt="Sua foto" className="rounded-lg shadow-md aspect-square object-cover w-full" />
            </div>
            <div className="lg:col-span-2 space-y-4">
                 <h2 className="text-2xl font-bold border-b pb-2 mb-4">Resumo da Análise Facial</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnalysisDetail label="Formato do Rosto" value={analysis.faceShape} />
                    <AnalysisDetail label="Tipo de Cabelo" value={analysis.hairType} />
                    <AnalysisDetail label="Linha da Mandíbula" value={analysis.jawline} />
                    <AnalysisDetail label="Formato da Testa" value={analysis.forehead} />
                    <AnalysisDetail label="Tom de Pele" value={analysis.skinTone} />
                    <AnalysisDetail label="Perfil Lateral" value={analysis.sideProfile} />
                    <div className="sm:col-span-2">
                        <AnalysisDetail label="Proporções Faciais" value={analysis.facialProportions} />
                    </div>
                 </div>
            </div>
        </div>
        
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Cortes Recomendados</h2>
            <div className="space-y-8">
                {recommendations.map((rec, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-2xl font-bold">{rec.name}</h3>
                            <div className="flex space-x-2">
                                {rec.lengths.map(len => (
                                    <span key={len} className="bg-black text-white text-xs font-semibold px-2.5 py-1 rounded-full">{len}</span>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4">{rec.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-1 text-gray-800">Por que funciona?</h4>
                                <p className="text-sm text-gray-600">{rec.reason}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-1 text-gray-800">Como estilizar?</h4>
                                <p className="text-sm text-gray-600">{rec.styling}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
