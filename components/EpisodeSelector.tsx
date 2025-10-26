
import React, { useState, useEffect } from 'react';
import { Episode } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface EpisodeSelectorProps {
  episodes: string[];
  onSelectEpisode: (episodeTitle: string) => void;
  isLoading: boolean;
  error: string | null;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({ episodes, onSelectEpisode, isLoading, error }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [newEpisodeTitle, setNewEpisodeTitle] = useState<string>('');
  const [isNewEpisode, setIsNewEpisode] = useState<boolean>(false);

  useEffect(() => {
    if (episodes.length > 0 && !isNewEpisode) {
      setSelectedOption(episodes[0]); // Select first episode by default
    }
  }, [episodes, isNewEpisode]);

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === '__new_episode__') {
      setIsNewEpisode(true);
      setSelectedOption('');
    } else {
      setIsNewEpisode(false);
      setSelectedOption(value);
      setNewEpisodeTitle('');
    }
  };

  const handleNewEpisodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEpisodeTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isNewEpisode && newEpisodeTitle.trim()) {
      onSelectEpisode(newEpisodeTitle.trim());
    } else if (!isNewEpisode && selectedOption) {
      onSelectEpisode(selectedOption);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-primary-dark mb-4">1. Select or Add Episode</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="episode-select" className="block text-sm font-medium text-gray-700 mb-1">
            Choose an existing episode or add a new one:
          </label>
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : (
            <select
              id="episode-select"
              name="episode-select"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm rounded-md shadow-sm bg-gray-50"
              value={isNewEpisode ? '__new_episode__' : selectedOption}
              onChange={handleSelectionChange}
            >
              {episodes.map((episode) => (
                <option key={episode} value={episode}>
                  {episode}
                </option>
              ))}
              <option value="__new_episode__">Add New Episode...</option>
            </select>
          )}
        </div>

        {isNewEpisode && (
          <div>
            <label htmlFor="new-episode-title" className="block text-sm font-medium text-gray-700 mb-1">
              New Episode Title:
            </label>
            <input
              type="text"
              id="new-episode-title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm bg-gray-50"
              value={newEpisodeTitle}
              onChange={handleNewEpisodeChange}
              placeholder="Enter new episode title"
              required={isNewEpisode}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-dark hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
          disabled={isLoading || (!selectedOption && (!isNewEpisode || !newEpisodeTitle))}
        >
          {isLoading ? 'Processing...' : 'Confirm Selection'}
        </button>
      </form>
    </div>
  );
};

export default EpisodeSelector;
