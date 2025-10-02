import React from 'react';
import { marked } from 'marked';

interface OutputDisplayProps {
  prompt: string;
  aiResponse: string;
  isImproving: boolean;
  isExecuting: boolean;
  error: string | null;
  isResponseEditable: boolean;
  onImprove: () => void;
  onExecute: () => void;
  onDownloadResponse: () => void;
  onDownloadPrompt: () => void;
  onEditToggle: () => void;
  onResponseChange: (newResponse: string) => void;
}

const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}> = ({ onClick, disabled, children, icon, variant = 'primary' }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed transition-all duration-200";
  const variantClasses = variant === 'primary' 
    ? "bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-400 disabled:bg-cyan-500/50"
    : "bg-white/10 hover:bg-white/20 text-gray-200 focus:ring-cyan-500 disabled:bg-white/5";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      {icon}
      {children}
    </button>
  );
};

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center p-8 flex-col gap-4">
    <div className="w-8 h-8">
      <div className="w-full h-full rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
    </div>
    <p className="text-gray-400">La IA está trabajando...</p>
  </div>
);


const OutputDisplay: React.FC<OutputDisplayProps> = ({
  prompt,
  aiResponse,
  isImproving,
  isExecuting,
  error,
  isResponseEditable,
  onImprove,
  onExecute,
  onDownloadResponse,
  onDownloadPrompt,
  onEditToggle,
  onResponseChange,
}) => {

  const getFormattedResponse = () => {
    if (!aiResponse) return { __html: '' };
    const rawMarkup = marked.parse(aiResponse) as string;
    return { __html: rawMarkup };
  };
  
  const hasPrompt = !!prompt;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="bg-black/20 p-6 rounded-lg shadow-lg ring-1 ring-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Vista Previa del Prompt</h2>
        <pre className="bg-black/30 p-4 rounded-md text-sm text-gray-300 whitespace-pre-wrap font-mono min-h-[120px] max-h-48 overflow-y-auto">
          {prompt || 'Completa el formulario para generar el prompt...'}
        </pre>
        <div className="flex flex-wrap gap-4 mt-4">
          <ActionButton onClick={onImprove} disabled={!hasPrompt || isImproving || isExecuting} variant="secondary" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>}>
            {isImproving ? 'Mejorando...' : 'Mejorar con IA'}
          </ActionButton>
          <ActionButton onClick={onDownloadPrompt} disabled={!hasPrompt || isImproving || isExecuting} variant="secondary" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H5V4zM5 8h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm2 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>}>
            Guardar Prompt
          </ActionButton>
          <ActionButton onClick={onExecute} disabled={!hasPrompt || isImproving || isExecuting} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>}>
            {isExecuting ? 'Ejecutando...' : 'Ejecutar Prompt'}
          </ActionButton>
        </div>
      </div>
      
      <div className="bg-black/20 p-6 rounded-lg shadow-lg ring-1 ring-white/10 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-4">Respuesta de la IA</h2>
        <div className="flex-grow min-h-[250px] relative">
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {isExecuting && <Spinner />}

          {!isExecuting && aiResponse && (
            isResponseEditable ? (
              <textarea
                value={aiResponse}
                onChange={(e) => onResponseChange(e.target.value)}
                className="w-full h-full min-h-[300px] bg-white/5 border-white/10 text-gray-200 rounded-md p-3 focus:border-cyan-400 focus:ring-cyan-400 sm:text-sm"
                aria-label="Editor de respuesta de la IA"
              />
            ) : (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={getFormattedResponse()}
              />
            )
          )}
          
          {!isExecuting && !aiResponse && !error && (
             <div className="flex items-center justify-center h-full text-gray-500">
               <p>La respuesta de la IA aparecerá aquí.</p>
            </div>
          )}
        </div>

        {aiResponse && !isExecuting && (
          <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-white/10">
            <ActionButton onClick={onDownloadResponse} disabled={false} variant="secondary" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}>
              Descargar
            </ActionButton>
            <ActionButton onClick={onEditToggle} disabled={false} icon={isResponseEditable ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>}>
              {isResponseEditable ? 'Guardar Cambios' : 'Editar'}
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;