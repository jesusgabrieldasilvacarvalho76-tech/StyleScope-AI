
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY || "fallback_api_key_if_not_set" });

const prompt = `
Você é um cabeleireiro especialista e analista facial. Sua tarefa é analisar as duas imagens fornecidas de uma pessoa (uma frontal, uma de perfil) e fornecer uma análise facial detalhada e recomendações de cortes de cabelo personalizados. Sua resposta deve estar no formato JSON.

Analise os seguintes aspectos com base nas imagens:
1.  **faceShape**: Determine o formato do rosto (ex: 'Oval', 'Quadrado', 'Redondo', 'Coração', 'Diamante').
2.  **facialProportions**: Descreva brevemente as principais proporções, como a largura da testa versus a linha da mandíbula.
3.  **jawline**: Descreva o ângulo da mandíbula (ex: 'Definida', 'Suave').
4.  **forehead**: Descreva o formato da testa (ex: 'Larga', 'Estreita').
5.  **sideProfile**: Analise o perfil lateral, observando a projeção do queixo, a curvatura do crânio e a linha do cabelo.
6.  **hairType**: Infira o tipo de cabelo (ex: 'Ondulado', 'Liso', 'Cacheado'), textura ('Fino', 'Médio', 'Grosso'), e densidade ('Baixa', 'Média', 'Alta').
7.  **skinTone**: Descreva o tom de pele (ex: 'Claro', 'Médio', 'Escuro') e o subtom, se possível ('Quente', 'Frio', 'Neutro').

Com base nesta análise, forneça 3 recomendações de cortes de cabelo. Para cada recomendação:
-   **name**: Um nome claro para o corte (ex: 'Bob Assimétrico', 'Undercut Texturizado', 'Corte Longo em Camadas').
-   **lengths**: Um array de comprimentos possíveis (ex: ['Curto', 'Médio']).
-   **description**: Uma breve descrição do corte.
-   **reason**: Uma explicação simples do *porquê* este corte é uma boa combinação para as características do usuário.
-   **styling**: Breves dicas sobre como estilizar este corte.

Forneça sua saída final como um único objeto JSON. Não inclua nenhum texto antes ou depois do bloco JSON.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: {
            type: Type.OBJECT,
            properties: {
                faceShape: { type: Type.STRING, description: "Formato do rosto" },
                facialProportions: { type: Type.STRING, description: "Proporções faciais" },
                jawline: { type: Type.STRING, description: "Linha da mandíbula" },
                forehead: { type: Type.STRING, description: "Formato da testa" },
                sideProfile: { type: Type.STRING, description: "Análise do perfil" },
                hairType: { type: Type.STRING, description: "Tipo de cabelo" },
                skinTone: { type: Type.STRING, description: "Tom de pele" },
            },
            required: ["faceShape", "facialProportions", "jawline", "forehead", "sideProfile", "hairType", "skinTone"],
        },
        recommendations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Nome do corte" },
                    lengths: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Comprimentos possíveis"
                    },
                    description: { type: Type.STRING, description: "Descrição do corte" },
                    reason: { type: Type.STRING, description: "Motivo da recomendação" },
                    styling: { type: Type.STRING, description: "Dicas de estilização" },
                },
                required: ["name", "lengths", "description", "reason", "styling"],
            },
        },
    },
    required: ["analysis", "recommendations"],
};

export const getAnalysisForImages = async (frontalImage: string, sideImage: string): Promise<AnalysisResult> => {
    try {
        const frontalImagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: frontalImage,
            },
        };

        const sideImagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: sideImage,
            },
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    frontalImagePart,
                    sideImagePart,
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const text = response.text.trim();
        const parsedJson = JSON.parse(text);

        return parsedJson as AnalysisResult;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Não foi possível obter a análise. Tente novamente.");
    }
};
