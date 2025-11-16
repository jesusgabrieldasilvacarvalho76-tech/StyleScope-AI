
import React, { useState } from 'react';
import { fileToBase64, dataUrlFromBase64 } from '../utils/fileUtils';
import { CameraIcon } from './Icons';

interface UploadScreenProps {
  onAnalyze: (frontalImage: string, sideImage: string) => void;
}

const ImageUploadSlot: React.FC<{
  id: string;
  label: string;
  instruction: string;
  imagePreview: string | null;
  onImageChange: (file: File) => void;
}> = ({ id, label, instruction, imagePreview, onImageChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="cursor-pointer block">
        <div className={`aspect-square w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-4 transition-colors ${imagePreview ? 'border-gray-300' : 'border-gray-400 hover:border-black hover:bg-gray-50'}`}>
          {imagePreview ? (
            <img src={imagePreview} alt={`${label} preview`} className="w-full h-full object-cover rounded-md" />
          ) : (
            <>
              <CameraIcon className="w-10 h-10 text-gray-500 mb-2" />
              <span className="font-semibold">{label}</span>
              <span className="text-xs text-gray-500 mt-1">{instruction}</span>
            </>
          )}
        </div>
      </label>
      <input id={id} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export const UploadScreen: React.FC<UploadScreenProps> = ({ onAnalyze }) => {
  const [frontalImage, setFrontalImage] = useState<File | null>(null);
  const [sideImage, setSideImage] = useState<File | null>(null);
  const [frontalPreview, setFrontalPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);

  const handleFrontalChange = (file: File) => {
    setFrontalImage(file);
    fileToBase64(file).then(base64 => setFrontalPreview(dataUrlFromBase64(base64)));
  };

  const handleSideChange = (file: File) => {
    setSideImage(file);
    fileToBase64(file).then(base64 => setSidePreview(dataUrlFromBase64(base64)));
  };

  const handleAnalyzeClick = async () => {
    if (frontalImage && sideImage) {
      const frontalBase64 = await fileToBase64(frontalImage);
      const sideBase64 = await fileToBase64(sideImage);
      onAnalyze(frontalBase64, sideBase64);
    }
  };

  return (
    <div className="p-6 md:p-10 flex flex-col items-center max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-center mb-2">Envie suas fotos</h1>
      <p className="text-gray-600 text-center mb-8">Para a melhor análise, siga as instruções em cada campo.</p>
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
        <ImageUploadSlot
          id="frontal-upload"
          label="Foto Frontal"
          instruction="Olhe diretamente para a câmera, sem sorrir."
          imagePreview={frontalPreview}
          onImageChange={handleFrontalChange}
        />
        <ImageUploadSlot
          id="side-upload"
          label="Foto de Perfil"
          instruction="Mostre o lado do seu rosto, com o cabelo para trás."
          imagePreview={sidePreview}
          onImageChange={handleSideChange}
        />
      </div>

      <button
        onClick={handleAnalyzeClick}
        disabled={!frontalImage || !sideImage}
        className="w-full md:w-auto px-12 py-4 bg-black text-white text-lg font-semibold rounded-full shadow-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        Analisar
      </button>
    </div>
  );
};
