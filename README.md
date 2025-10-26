# Cue Sheet Pro - Episode Report Generator

![Powered by Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue?style=flat&logo=google&logoColor=white)

A web application designed to significantly streamline podcast post-production by generating detailed, AI-powered cue sheet reports. It assists audio engineers and podcast editors, particularly those new to Audacity, by providing comprehensive audio analysis, refining draft cue sheets, and embedding practical Audacity tips directly into the report.

## ✨ Features

*   **Intelligent Episode Selection:** Choose from existing podcast episodes (simulated to be fetched from a Google Sheet) or easily add a new one.
*   **Audio File Upload:** Upload your raw or edited audio files for AI analysis against your draft cue sheet. Supports common audio formats (`audio/*`).
*   **Draft Cue Sheet Upload:** Provide a preliminary cue sheet (Markdown or plain text) for the AI to refine and enhance. Supports `text/plain` and `text/markdown`.
*   **AI-Powered Refinement:** Leverages the advanced capabilities of the Google Gemini API to:
    *   Analyze uploaded audio against the draft cue sheet.
    *   Identify discrepancies in timings, voice transitions, and missing elements.
    *   Generate a highly refined, precise cue sheet.
*   **Audacity Integration & Tips:** Reports include practical, embedded Audacity-specific tips and instructions to guide novice editors through common editing tasks.
*   **Comprehensive Reporting:** Generates a detailed Markdown document that includes:
    *   An analysis of the audio file compared to the draft cue sheet.
    *   A clear plan for refinement.
    *   A glossary of essential audio terms explained in plain language.
    *   The final, refined cue sheet with embedded Audacity tips.
    *   Key production notes (e.g., final runtime, mastering standards).
*   **Google Workspace Integration (Simulated):** Provides instructions within the output report for creating Google Docs and updating Google Sheets, mimicking a real-world, integrated podcast production workflow.
*   **User-Friendly Interface:** Built with React, TypeScript, and Tailwind CSS for a responsive, intuitive, and aesthetically pleasing user experience.

## 🚀 How to Use

1.  **Select an Episode:** On the initial screen, choose an existing podcast episode from the dropdown list or enter a new episode title into the provided input field. Click "Confirm Selection."
2.  **Upload Files:**
    *   Upload your audio file (e.g., `.mp3`, `.wav`) for the selected episode.
    *   Upload your draft cue sheet (e.g., `.txt`, `.md`).
3.  **Generate Report:** Click the "Generate Detailed Report" button. The application will use AI to process your inputs and create a comprehensive report.
4.  **Review Report:** The generated report, presented in an easy-to-read Markdown format, will appear below the input section. It will include all the refined cue sheet details, analysis, and Audacity tips.
5.  **Start Over:** If you wish to generate a report for a different episode or with new files, click "Start Over" to reset the application.

## 💻 Technical Details

This application is built with modern frontend technologies and powered by advanced AI:

*   **Frontend Framework:** [React](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown) with [remark-gfm](https://github.com/remarkjs/remark-gfm) for GitHub Flavored Markdown and [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) for code blocks.
*   **AI Engine:** [Google Gemini API](https://ai.google.dev/gemini-api/docs) via the `@google/genai` SDK.

## 🔧 Development & Running the App

This application is designed to run efficiently within environments like Google AI Studio, leveraging ES6 modules and an import map for dependency management.

**API Key:**
The application requires a Google Gemini API key. This key is expected to be available in the execution environment as `process.env.API_KEY`. No manual configuration of the API key within the code or UI is needed or supported.

**Local Setup (if adapted for local development):**
While primarily intended for AI Studio, if you were to adapt this for local development:

*   Ensure you have [Node.js](https://nodejs.org/) installed.
*   Set your Google Gemini API key as an environment variable named `API_KEY`.
*   The `importmap` in `index.html` handles module resolution; no `npm install` would typically be needed for the CDN-served dependencies.

## 🤝 Contributing

We welcome contributions! If you have suggestions for features, improvements, or bug fixes, please feel free to contribute.

## 📄 License

This project is open-sourced under the Apache License 2.0. See the [LICENSE](LICENSE) file for more details.