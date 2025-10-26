
import { GoogleGenAI, GenerateContentResponse, Part, GenerateContentParameters } from '@google/genai';
import {
  GET_EPISODES_PROMPT,
  HANDLE_EPISODE_SELECTION_PROMPT,
  UPDATE_GSHEET_PROMPT,
  REFINE_CUE_SHEET_PROMPT,
  GEMINI_TEXT_MODEL,
  GEMINI_PRO_MODEL,
} from '../constants';
import { FileData } from '../types';

interface GenerateContentOptions {
  model: string;
  parts: Part[];
  thinkingBudget?: number;
  maxOutputTokens?: number;
}

const initializeGemini = () => {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY is not defined in environment variables.');
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const callGemini = async ({
  model,
  parts,
  thinkingBudget,
  maxOutputTokens,
}: GenerateContentOptions): Promise<string> => {
  const ai = initializeGemini();
  try {
    // Correctly typed config object using GenerateContentParameters
    const config: GenerateContentParameters['config'] = {};
    if (thinkingBudget !== undefined) {
      config.thinkingConfig = { thinkingBudget };
    }
    if (maxOutputTokens !== undefined) {
      config.maxOutputTokens = maxOutputTokens;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: config,
    });

    const text = response.text;
    if (!text) {
      console.error('Gemini response did not contain text:', response);
      throw new Error('Gemini did not return a text response.');
    }
    return text;
  } catch (error) {
    console.error(`Error calling Gemini model ${model}:`, error);
    // Attempt to extract a more user-friendly error message if available
    if (error instanceof Error) {
      throw new Error(`Failed to get response from Gemini: ${error.message}`);
    }
    throw new Error('Failed to get response from Gemini.');
  }
};

export const getEpisodes = async (): Promise<string[]> => {
  const response = await callGemini({
    model: GEMINI_TEXT_MODEL,
    parts: [{ text: GET_EPISODES_PROMPT }],
  });
  return response.split('\n').map((s) => s.trim()).filter(Boolean);
};

export const handleEpisodeSelection = async (
  availableEpisodes: string[],
  userSelection: string,
): Promise<string> => {
  const availableEpisodesString = availableEpisodes.join('\n');
  return await callGemini({
    model: GEMINI_TEXT_MODEL,
    parts: [{ text: HANDLE_EPISODE_SELECTION_PROMPT(availableEpisodesString, userSelection) }],
  });
};

export const updateGsheetIfNewEpisode = async (
  selectedEpisodeTitle: string,
  handleEpisodeSelectionOutput: string,
): Promise<string> => {
  return await callGemini({
    model: GEMINI_TEXT_MODEL,
    parts: [{ text: UPDATE_GSHEET_PROMPT(selectedEpisodeTitle, handleEpisodeSelectionOutput) }],
  });
};

export const refineCueSheet = async (
  episodeTitle: string,
  audioFile: FileData,
  draftCueSheet: FileData,
): Promise<string> => {
  const parts: Part[] = [
    REFINE_CUE_SHEET_PROMPT(episodeTitle),
    {
      inlineData: {
        mimeType: audioFile.mimeType,
        data: audioFile.base64,
      },
    },
    {
      inlineData: {
        mimeType: draftCueSheet.mimeType,
        data: draftCueSheet.base64,
      },
    },
  ];

  // For `gemini-2.5-pro` and potentially long outputs, provide sufficient thinking budget and max tokens.
  return await callGemini({
    model: GEMINI_PRO_MODEL,
    parts: parts,
    thinkingBudget: 16000, // Generous thinking budget for complex analysis
    maxOutputTokens: 10000, // Ample tokens for a detailed report
  });
};