
import React from 'react';

interface ProfileScreenProps {
  userEmail: string;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userEmail, onLogout }) => {
  return (
    <div className="max-w-md mx-auto p-4 md:p-8 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8">Meu Perfil</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-500">Email</label>
          <p className="mt-1 text-lg p-3 bg-gray-100 rounded-md truncate">{userEmail}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Senha</label>
          <p className="mt-1 text-lg p-3 bg-gray-100 rounded-md">********</p>
        </div>
        <div className="pt-4">
          <button
            onClick={onLogout}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
};