import { GoogleGenAI, Part } from "@google/genai";
import { type LegalPromptData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const JURISDICTION_INSTRUCTIONS = `
IMPORTANTE: Todas las respuestas deben estar estrictamente basadas en el marco legal vigente en toda la República Mexicana, tomando como base primordial la Constitución Política de los Estados Unidos Mexicanos. Si se requiere jurisprudencia, debe ser citada exclusivamente del Semanario Judicial de la Federación.
`.trim();

export const buildPrompt = (data: LegalPromptData): string => {
  const {
    role,
    task,
    context,
    tone,
    language,
  } = data;

  const userPrompt = `
Rol=${role}
Tarea=${task}
Contexto=${context}
Tono=${tone}
Lenguaje=${language}
`.trim();

  return `${JURISDICTION_INSTRUCTIONS}\n\n${userPrompt}`;
};

export const improvePrompt = async (prompt: string): Promise<string> => {
    // Extraer el prompt del usuario sin las instrucciones de jurisdicción
    const userPrompt = prompt.replace(JURISDICTION_INSTRUCTIONS, '').trim();

    const improveInstruction = `
Revisa y mejora el siguiente prompt para un asistente legal de IA para maximizar la claridad, detalle y efectividad, considerando el marco legal mexicano.
Asegúrate de que la estructura sea lógica y que pida la información más relevante.
Devuelve únicamente el prompt mejorado, sin añadir explicaciones, preámbulos o texto introductorio, y manteniendo el formato original de "Rol=... Tarea=...".

PROMPT ORIGINAL:
---
${userPrompt}
---
PROMPT MEJORADO:
`.trim();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: improveInstruction,
        });
        const improvedUserPrompt = response.text;
        if (!improvedUserPrompt) {
            throw new Error('La IA no pudo mejorar el prompt.');
        }
        // Re-agregar las instrucciones de jurisdicción al prompt mejorado
        return `${JURISDICTION_INSTRUCTIONS}\n\n${improvedUserPrompt.trim()}`;
    } catch (error) {
        console.error("Error al mejorar el prompt con la IA:", error);
        throw new Error("No se pudo mejorar el prompt. Por favor, inténtelo de nuevo.");
    }
}

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}


export const getAIResponse = async (
  prompt: string,
  files: File[]
): Promise<string> => {
  try {
    const promptParts: Part[] = [
      { text: prompt }
    ];

    if (files.length > 0) {
      // Filtrar para asegurar que solo se procesen tipos de imagen soportados
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      for (const file of imageFiles) {
        const filePart = await fileToGenerativePart(file);
        promptParts.push(filePart);
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: promptParts },
    });
    const aiResponse = response.text;
    if (!aiResponse) {
        throw new Error('La respuesta de la IA estaba vacía.');
    }
    return aiResponse;
  } catch (error) {
    console.error("Error al generar la respuesta de la IA:", error);
    throw new Error("No se pudo obtener una respuesta del servicio de IA. Por favor, inténtelo de nuevo más tarde.");
  }
};