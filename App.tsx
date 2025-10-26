
import React, { useState, useEffect, useCallback } from 'react';
import {
  getEpisodes,
  handleEpisodeSelection,
  updateGsheetIfNewEpisode,
  refineCueSheet,
} from './services/geminiService';
import { Episode, FileData, CueSheetReport, ProcessStep } from './types';
import EpisodeSelector from './components/EpisodeSelector';
import FileUpload from './components/FileUpload';
import ReportDisplay from './components/ReportDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [episodes, setEpisodes] = useState<string[]>([]);
  const [selectedEpisodeTitle, setSelectedEpisodeTitle] = useState<string | null>(null);
  const [handleSelectionOutput, setHandleSelectionOutput] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<FileData | null>(null);
  const [draftCueSheetFile, setDraftCueSheetFile] = useState<FileData | null>(null);
  const [report, setReport] = useState<CueSheetReport | null>(null);
  const [loading, setLoading] = useState<ProcessStep>(ProcessStep.IDLE);
  const [error, setError] = useState<string | null>(null);

  const fetchEpisodes = useCallback(async () => {
    setLoading(ProcessStep.FETCHING_EPISODES);
    setError(null);
    try {
      const fetchedEpisodes = await getEpisodes();
      setEpisodes(fetchedEpisodes);
      setLoading(ProcessStep.IDLE);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(`Failed to fetch episodes: ${errorMessage}`);
      setLoading(ProcessStep.ERROR);
    }
  }, []);

  useEffect(() => {
    fetchEpisodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEpisodeSelectionSubmit = useCallback(async (episodeTitle: string) => {
    setLoading(ProcessStep.EPISODE_SELECTED);
    setError(null);
    try {
      // First, let Gemini determine if it's a new or existing episode.
      const output = await handleEpisodeSelection(episodes, episodeTitle);
      setHandleSelectionOutput(output);
      setSelectedEpisodeTitle(episodeTitle);

      // Based on Gemini's output, determine if a Gsheet update instruction was given.
      // This is a simulation, as the frontend doesn't execute Python.
      // Gemini's response will contain the "result" of its simulated Python execution.
      const gsheetUpdateStatus = await updateGsheetIfNewEpisode(episodeTitle, output);
      console.log('GSheet Update Status:', gsheetUpdateStatus);

      setLoading(ProcessStep.IDLE);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(`Failed to handle episode selection: ${errorMessage}`);
      setLoading(ProcessStep.ERROR);
    }
  }, [episodes]);

  const generateReport = useCallback(async () => {
    if (!selectedEpisodeTitle || !audioFile || !draftCueSheetFile) {
      setError('Please select an episode and upload both files.');
      return;
    }

    setLoading(ProcessStep.GENERATING_REPORT);
    setError(null);
    try {
      const markdownReport = await refineCueSheet(
        selectedEpisodeTitle,
        audioFile,
        draftCueSheetFile,
      );
      setReport({ title: selectedEpisodeTitle, markdown: markdownReport });
      setLoading(ProcessStep.COMPLETED);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(`Failed to generate report: ${errorMessage}`);
      setLoading(ProcessStep.ERROR);
    }
  }, [selectedEpisodeTitle, audioFile, draftCueSheetFile]);

  const resetApp = () => {
    setEpisodes([]);
    setSelectedEpisodeTitle(null);
    setHandleSelectionOutput(null);
    setAudioFile(null);
    setDraftCueSheetFile(null);
    setReport(null);
    setLoading(ProcessStep.IDLE);
    setError(null);
    fetchEpisodes(); // Re-fetch episodes for a fresh start
  };

  return (
    <div className="min-h-screen bg-background text-secondary-dark flex flex-col">
      <header className="bg-primary-light text-primary-dark py-6 px-4 md:px-8 shadow-md">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Cue Sheet Pro - Episode Report Generator</h1>
          <p className="text-center mt-2 text-lg">Streamline your podcast production with AI-powered cue sheet refinement.</p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 md:px-8 py-8 flex-grow">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading !== ProcessStep.IDLE && loading !== ProcessStep.ERROR && (
          <div className="mb-6">
            <LoadingSpinner />
            <p className="text-center text-sm text-gray-600 mt-2">
              {loading === ProcessStep.FETCHING_EPISODES && 'Fetching available episodes...'}
              {loading === ProcessStep.EPISODE_SELECTED && 'Confirming episode selection and checking for GSheet updates...'}
              {loading === ProcessStep.UPLOADING_FILES && 'Uploading files...'}
              {loading === ProcessStep.GENERATING_REPORT && 'Generating detailed cue sheet report (this may take a moment)...'}
            </p>
          </div>
        )}

        {!selectedEpisodeTitle ? (
          <EpisodeSelector
            episodes={episodes}
            onSelectEpisode={handleEpisodeSelectionSubmit}
            isLoading={loading === ProcessStep.FETCHING_EPISODES || loading === ProcessStep.EPISODE_SELECTED}
            error={error}
          />
        ) : (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">Selected Episode: <span className="font-bold">{selectedEpisodeTitle}</span></h2>
            {handleSelectionOutput && <p className="text-gray-700 text-sm mb-4">GSheet Status: {handleSelectionOutput}</p>}

            <h3 className="text-lg font-semibold text-primary-dark mb-4">2. Upload Files for Analysis</h3>
            <FileUpload
              label="Upload Audio File (MP3, WAV, etc.)"
              accept="audio/*"
              onFileChange={setAudioFile}
              isLoading={loading === ProcessStep.GENERATING_REPORT}
              required={true}
            />
            <FileUpload
              label="Upload Draft Cue Sheet (Markdown, Text)"
              accept="text/plain,text/markdown"
              onFileChange={setDraftCueSheetFile}
              isLoading={loading === ProcessStep.GENERATING_REPORT}
              required={true}
            />

            <button
              onClick={generateReport}
              className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-primary-dark hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50 mt-4"
              disabled={loading === ProcessStep.GENERATING_REPORT || !audioFile || !draftCueSheetFile}
            >
              {loading === ProcessStep.GENERATING_REPORT ? 'Generating Report...' : 'Generate Detailed Report'}
            </button>
            <button
              onClick={resetApp}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark mt-2"
              disabled={loading !== ProcessStep.IDLE && loading !== ProcessStep.COMPLETED && loading !== ProcessStep.ERROR}
            >
              Start Over
            </button>
          </div>
        )}

        {report && <ReportDisplay markdown={report.markdown} />}
      </main>

      <footer className="bg-primary-light text-primary-dark py-4 px-4 md:px-8 text-center text-sm shadow-inner mt-8">
        <p>&copy; {new Date().getFullYear()} Cue Sheet Pro. All rights reserved.</p>
        <p className="mt-1">Powered by Google Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
