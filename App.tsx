import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import { type LegalPromptData } from './types';
import { buildPrompt, getAIResponse, improvePrompt } from './services/geminiService';
import { LEGAL_AREAS, TONES, LANGUAGES } from './constants';

const App: React.FC = () => {
  const [formData, setFormData] = useState<LegalPromptData>({
    areaOfLaw: LEGAL_AREAS[0],
    role: `Actúa como un abogado especialista en ${LEGAL_AREAS[0]}`,
    task: '',
    context: '',
    tone: TONES[0],
    language: LANGUAGES[0],
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isImproving, setIsImproving] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isResponseEditable, setIsResponseEditable] = useState<boolean>(false);

  useEffect(() => {
    if (formData.task && formData.context) {
      const prompt = buildPrompt(formData);
      setCurrentPrompt(prompt);
    } else {
      setCurrentPrompt('');
    }
  }, [formData]);
  
  const handleImprove = useCallback(async () => {
    if (!currentPrompt) return;
    setIsImproving(true);
    setError(null);
    try {
      const improved = await improvePrompt(currentPrompt);
      setCurrentPrompt(improved);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al mejorar el prompt.');
    } finally {
      setIsImproving(false);
    }
  }, [currentPrompt]);

  const handleExecute = useCallback(async () => {
    if (!currentPrompt) return;
    setIsExecuting(true);
    setError(null);
    setAiResponse('');
    setIsResponseEditable(false);
    try {
      const response = await getAIResponse(currentPrompt, uploadedFiles);
      setAiResponse(response);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al ejecutar el prompt.');
    } finally {
      setIsExecuting(false);
      // Opcional: limpiar archivos después de la ejecución
      // setUploadedFiles([]); 
    }
  }, [currentPrompt, uploadedFiles]);

  const handleDownloadResponse = () => {
    const blob = new Blob([aiResponse], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'respuesta-ia.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPrompt = () => {
    if (!currentPrompt) return;
    const blob = new Blob([currentPrompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-juridico.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditToggle = () => {
    setIsResponseEditable(prev => !prev);
  };

  return (
    <div className="min-h-screen font-sans text-gray-300">
      <Header />
      <main>
        <div className="max-w-8xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-px">
              <div className="lg:col-span-2 p-8">
                <InputForm
                  formData={formData}
                  setFormData={setFormData}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
              </div>
              <div className="lg:col-span-3 p-8 bg-white/5 rounded-r-2xl">
                <OutputDisplay
                  prompt={currentPrompt}
                  aiResponse={aiResponse}
                  isImproving={isImproving}
                  isExecuting={isExecuting}
                  error={error}
                  isResponseEditable={isResponseEditable}
                  onImprove={handleImprove}
                  onExecute={handleExecute}
                  onDownloadResponse={handleDownloadResponse}
                  onDownloadPrompt={handleDownloadPrompt}
                  onEditToggle={handleEditToggle}
                  onResponseChange={setAiResponse}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;