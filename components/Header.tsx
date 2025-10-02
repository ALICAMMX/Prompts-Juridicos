import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-transparent">
      <div className="max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center gap-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
            <path d="M12 3L3.19372 7.5V11.7C3.19372 16.575 6.84372 20.9625 12 22.5C17.1562 20.9625 20.8062 16.575 20.8062 11.7V7.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.75 11.25H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.75 14.25H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 8.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 8.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Asistente de Prompts Juridicos de Grupo ALICAM
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;