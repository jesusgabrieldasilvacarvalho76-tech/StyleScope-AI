
import React, { useState } from 'react';

interface RegistrationScreenProps {
  onRegister: (name: string, email: string, pass: string) => void;
  switchToLogin: () => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister, switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
        onRegister(name, email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 animate-fade-in">
      <div className="w-full max-w-sm mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tighter">Crie sua Conta</h1>
            <p className="text-gray-600 mt-2">Comece a descobrir seu estilo perfeito hoje.</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label htmlFor="email-register" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email-register"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password-register" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password-register"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Crie uma senha forte"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Criar Conta
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <button onClick={switchToLogin} className="font-medium text-black hover:underline">
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
};
