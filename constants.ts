
import { GoogleGenAI, GenerateContentParameters, Part } from '@google/genai';
import { FileData } from './types';

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
export const GEMINI_PRO_MODEL = 'gemini-2.5-pro'; // For complex tasks like cue sheet refinement

// Prompts for the Cue Sheet Pro workflow
export const GET_EPISODES_PROMPT = `
Your task is to open the \`opalcuesheet\` asset, specifically accessing the 'Projects' worksheet, to extract a clean, newline-separated list of podcast episode titles. This list will be used to populate a selection dropdown for user interaction.
# Step by Step instructions
1. Open the provided Opalcuesheet asset.
2. Access the 'Projects' worksheet within the Opalcuesheet.
3. Extract each episode title from the 'Projects' worksheet.
4. For each extracted episode title, add it to a list and append a newline character after each title.
5. Review the list of episode titles. Are all titles present and correctly formatted with a newline after each? If not, return to step 3.
6. Output the final newline-separated list of episode titles.
`;

export const HANDLE_EPISODE_SELECTION_PROMPT = (
  availableEpisodes: string,
  userSelection: string,
) => `
You are an expert user interaction handler for a podcast production workflow. Your task is to present the extracted episode titles to the user, allowing them to either select an existing episode or enter a new one. If a new episode title is entered by the user, you must generate a clear instruction to add this new title to the bottom of the 'Episodes' column (column A) of the 'Projects' sheet in the \`opalcuesheet\` Google Sheet. Otherwise, simply confirm the selected existing episode. The final output must contain the selected or new episode title, and if new, the specific instruction for updating the Google Sheet.

# Context:
Available Episodes:
${availableEpisodes}

User Selection: "${userSelection}"

# Step by Step instructions
1. Present the Available Episodes to the user as a list of selectable options.
2. Allow the user to either select one of the Available Episodes or enter a completely new episode title into "User Selection".
3. If the user's "User Selection" matches an existing title from Available Episodes, output the "User Selection".
4. If the user's "User Selection" is a new title, output the new "User Selection" followed by a clear instruction to add this new title to the bottom of the 'Episodes' column (column A) of the 'Projects' sheet in the \`opalcuesheet\` Google Sheet.
`;

export const UPDATE_GSHEET_PROMPT = (selectedEpisodeTitle: string, handleEpisodeSelectionOutput: string) => `
You are an expert python code programmer. Your goal is to generate and execute python code using {{"type": "tool", "path": "embed://a2/tools.bgl.json#module:code-execution", "title": "Code Execution"}} and return the execution result. You will be given an instruction on what the code should do. The code execution environment includes the following libraries: attrs, chess, contourpy, fpdf, geopandas, imageio, jinja2, joblib, jsonschema, jsonschema-specifications, lxml, matplotlib, mpmath, numpy, opencv-python, openpyxl, packaging, pandas, pillow, protobuf, pylatex, pyparsing, PyPDF2, python-dateutil, python-docx, python-pptx, reportlab, scikit-learn, scipy, seaborn, six, striprtf, sympy, tabulate, tensorflow, toolz, xlrd. You can not install your own libraries.

# Context:
Selected Episode Title: "${selectedEpisodeTitle}"
Handle Episode Selection Output: "${handleEpisodeSelectionOutput}"

# Step by Step instructions
1. Examine the \`Handle Episode Selection Output\` to determine if it contains an instruction to update the Google Sheet.
2. If the \`Handle Episode Selection Output\` indicates a new episode title and includes an instruction to add this title, generate and execute Python code using \`{{"type": "tool", "path": "embed://a2/tools.bgl.json#module:code-execution", "title": "Code Execution"}}\` to append the new episode title to the 'Episodes' column (column A) at the bottom of the 'Projects' sheet in the 'opalcuesheet' Google Sheet.
3. If the \`Handle Episode Selection Output\` does not indicate a new episode or an update instruction, confirm that no update is necessary.
`;


// Updated to use `Part` type as `TextPart` is not exported by @google/genai
export const REFINE_CUE_SHEET_PROMPT = (episodeTitle: string): Part => ({
  text: `
You are an expert audio engineer and podcast production teacher, specializing in creating detailed, easy-to-follow audio cue sheets for novice editors using Audacity. Your task is to analyze the provided audio file and the draft cue sheet for the selected podcast episode, reconciling all discrepancies to generate a comprehensive Markdown document. This document must include an analysis of the audio file and its comparison to the draft cue sheet, a plan for refinement, a glossary of audio terms explained in plain language, the final refined cue sheet with embedded Audacity tips, and production notes. Additionally, you will generate instructions within the output text for creating a Google Doc copy in a specific folder and updating a Google Sheet with episode details.

# Context:
Selected Episode Title: "${episodeTitle}"
Current Date: "${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}"

# Step by Step instructions
1. Analyze the Audio File and Draft Cue Sheet for the Selected Podcast Episode.
2. Identify all discrepancies in runtime, event timings, voice transitions, and missing elements between the Audio File and the Draft Cue Sheet.
3. Develop a plan for a refined cue sheet, outlining specific steps to correct the Draft Cue Sheet, such as re-timing, clarifying voice roles, and adding Audacity tips.
4. Define and explain the following audio terms in plain, simple language for a novice user: Pad, Sidechain Ducking, Decibel (dB), Reverb, Low-Pass Filter, Time-Stretching, and Stereo Panning.
5. Create the Refined Cue Sheet, ensuring it includes all voice lines, precise timings for every cue and transcript entry, and specific, embedded Audacity tips where helpful.
6. Summarize key production details such as the final runtime, mastering standards (-16 LUFS, -1dBFS peak), and voice processing notes in the Production Notes.
7. Combine the analysis, refinement plan, glossary, refined cue sheet, and production notes into a single, comprehensive Markdown document.
8. Generate instructions within the Markdown document for creating a Google Doc copy in the 'Papersthatdream Cue Sheets' folder with the document name 'EP2_Refined_Cue_Sheet_2025-10-25' but replace the episode number 'EP2' with the correct episode number of the Selected Episode Title and '2025-10-25' with the Current Date. If the episode title is "The Island That Forgets Nothing", use "EP2". If the episode title is "The One Who Knew How To Win", use "EP1". If the episode title is "I Only Know What Comes Next", use "EP3". If it's a new episode, default to "EP_New".
9. Generate instructions within the Markdown document for updating the 'Podcast Production Tracker' spreadsheet with the episode name (from Handle Episode Selection), cue sheet version number (\`v1.0\`), and the Current Date.
`
});