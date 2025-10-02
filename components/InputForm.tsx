import React, { useCallback } from 'react';
import { type LegalPromptData } from '../types';
import { LEGAL_AREAS, TONES, LANGUAGES } from '../constants';

interface InputFormProps {
  formData: LegalPromptData;
  setFormData: React.Dispatch<React.SetStateAction<LegalPromptData>>;
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileUploader: React.FC<{
  files: File[];
  onFilesChange: (files: File[]) => void;
}> = ({ files, onFilesChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesChange([...files, ...Array.from(e.dataTransfer.files)]);
      e.dataTransfer.clearData();
    }
  }, [files, onFilesChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300">
        Analizar Documentos (Opcional)
      </label>
      <label 
        htmlFor="file-upload"
        className="mt-2 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-white/20 hover:border-cyan-400/50"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
          </svg>
          <div className="flex text-sm text-gray-400">
            <p className="pl-1">Arrastra y suelta o <span className="font-medium text-cyan-400">busca en tus archivos</span></p>
          </div>
          <p className="text-xs text-gray-500">Imágenes (PNG, JPG) de documentos, evidencias, etc.</p>
        </div>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
      </label>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <ul className="divide-y divide-white/10">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-300 truncate w-4/5">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="ml-4 text-red-400 hover:text-red-300 font-bold"
                  aria-label={`Eliminar ${file.name}`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, uploadedFiles, setUploadedFiles }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaClick = (area: string) => {
    setFormData((prev) => {
      const isRoleDefault = LEGAL_AREAS.some(
        (legalArea) => prev.role === `Actúa como un abogado especialista en ${legalArea}`
      );
      
      const newRole =
        isRoleDefault || prev.role.trim() === ''
          ? `Actúa como un abogado especialista en ${area}`
          : prev.role;

      return {
        ...prev,
        areaOfLaw: area,
        role: newRole,
      };
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Materia
        </label>
        <div className="flex flex-wrap gap-2">
          {LEGAL_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => handleAreaClick(area)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                formData.areaOfLaw === area
                  ? 'bg-cyan-500 text-white shadow-md ring-2 ring-cyan-400'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
      
      <form className="space-y-6">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300">
            Rol
          </label>
          <textarea
            id="role"
            name="role"
            rows={2}
            className="mt-2 block w-full rounded-md bg-white/5 border-white/10 text-gray-200 shadow-sm focus:border-cyan-400 focus:ring-cyan-400 sm:text-sm placeholder-gray-500"
            placeholder="Ej: Actúa como un juez de distrito..."
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="task" className="block text-sm font-medium text-gray-300">
            Tarea
          </label>
          <textarea
            id="task"
            name="task"
            rows={2}
            className="mt-2 block w-full rounded-md bg-white/5 border-white/10 text-gray-200 shadow-sm focus:border-cyan-400 focus:ring-cyan-400 sm:text-sm placeholder-gray-500"
            placeholder="Ej: Redacta una demanda de amparo indirecto..."
            value={formData.task}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

         <div>
          <label htmlFor="context" className="block text-sm font-medium text-gray-300">
            Contexto
          </label>
          <textarea
            id="context"
            name="context"
            rows={6}
            className="mt-2 block w-full rounded-md bg-white/5 border-white/10 text-gray-200 shadow-sm focus:border-cyan-400 focus:ring-cyan-400 sm:text-sm placeholder-gray-500"
            placeholder="Describe aquí todos los hechos, antecedentes, artículos aplicables y detalles relevantes del caso..."
            value={formData.context}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-300">
              Tono
            </label>
            <select
              id="tone"
              name="tone"
              className="mt-2 block w-full rounded-md bg-white/5 border-white/10 text-gray-200 shadow-sm focus:border-cyan-400 focus:ring-cyan-400 sm:text-sm"
              value={formData.tone}
              onChange={handleChange}
            >
              {TONES.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-300">
              Lenguaje
            </label>
            <select
              id="language"
              name="language"
              className="mt-2 block w-full rounded-md bg-white/5 border-white/10 text-gray-200 shadow-sm focus:border-cyan-400 focus:ring-cyan-400 sm:text-sm"
              value={formData.language}
              onChange={handleChange}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <FileUploader files={uploadedFiles} onFilesChange={setUploadedFiles} />

      </form>
    </div>
  );
};

export default InputForm;