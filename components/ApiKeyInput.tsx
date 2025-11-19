import React, { useState } from 'react';
import { Key, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface ApiKeyInputProps {
  onSetApiKey: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSetApiKey }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setError('Please enter a valid API Key');
      return;
    }
    if (!inputKey.startsWith('AIza')) {
      setError('This does not look like a valid Gemini API Key (starts with AIza)');
      return;
    }
    onSetApiKey(inputKey.trim());
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 mb-6 mx-auto">
          <Key className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Enter your API Key</h2>
        <p className="text-zinc-400 text-center text-sm mb-8">
          To use the Interior AI Designer, you need a Google Gemini API key. Your key is stored locally in your browser and is never sent to our servers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-zinc-300 mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type="password"
                value={inputKey}
                onChange={(e) => {
                    setInputKey(e.target.value);
                    setError(null);
                }}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            {error && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{error}</span>
                </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Start Designing
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
          >
            <span>Get a free API key from Google AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};