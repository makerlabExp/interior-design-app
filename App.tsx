import React, { useState, useEffect } from 'react';
import { StyleSelector } from './components/StyleSelector';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedResult } from './components/GeneratedResult';
import { ApiKeyInput } from './components/ApiKeyInput';
import { generateRoomDesign } from './services/geminiService';
import { DesignStyle } from './types';
import { STYLES } from './constants';
import { Sparkles, ArrowLeft, Wand2, Sofa, Key } from 'lucide-react';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'style' | 'result'>('upload');
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isRoomEmpty, setIsRoomEmpty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
        setApiKey(storedKey);
    }
  }, []);

  const handleSetApiKey = (key: string) => {
      localStorage.setItem('gemini_api_key', key);
      setApiKey(key);
  };

  const handleClearKey = () => {
      localStorage.removeItem('gemini_api_key');
      setApiKey(null);
      resetApp();
  };

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setCurrentStep('style');
  };

  const handleStyleSelect = async (style: DesignStyle) => {
    setSelectedStyle(style);
  };

  const handleGenerate = async () => {
    if (!originalImage || !selectedStyle || !apiKey) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateRoomDesign(originalImage, selectedStyle, customPrompt, isRoomEmpty, apiKey);
      setGeneratedImage(result);
      setCurrentStep('result');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate the design.";
      setError(errorMessage.includes('API Key') ? 'Invalid API Key or Quota exceeded.' : 'Failed to generate design. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    setCurrentStep('upload');
    setOriginalImage(null);
    setOriginalImagePreview(null);
    setSelectedStyle(null);
    setGeneratedImage(null);
    setCustomPrompt('');
    setIsRoomEmpty(false);
    setError(null);
  };

  if (!apiKey) {
      return <ApiKeyInput onSetApiKey={handleSetApiKey} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto p-6 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            NanoSpace AI
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
            {currentStep !== 'upload' && (
            <button 
                onClick={resetApp}
                className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
                New Design
            </button>
            )}
             <button 
                onClick={handleClearKey}
                className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                title="Change API Key"
            >
                <Key className="w-3 h-3" />
                Reset Key
            </button>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto p-6 flex-1 flex flex-col">
        
        {/* Progress Steps - Simple visual indicator */}
        <div className="flex items-center justify-center mb-10 gap-4 text-sm">
          <span className={`${currentStep === 'upload' ? 'text-indigo-400 font-bold' : 'text-zinc-500'}`}>1. Upload</span>
          <div className="w-8 h-[1px] bg-zinc-800"></div>
          <span className={`${currentStep === 'style' ? 'text-indigo-400 font-bold' : 'text-zinc-500'}`}>2. Style</span>
          <div className="w-8 h-[1px] bg-zinc-800"></div>
          <span className={`${currentStep === 'result' ? 'text-indigo-400 font-bold' : 'text-zinc-500'}`}>3. Result</span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Step 1: Upload */}
        {currentStep === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Redesign your space in seconds.</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Upload a photo of your room and let our Nano Banana AI reimagine it in over 20 distinct styles.
              </p>
            </div>
            <ImageUploader onImageSelected={handleImageUpload} />
          </div>
        )}

        {/* Step 2: Select Style */}
        {currentStep === 'style' && (
          <div className="animate-fade-in pb-24">
             <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="w-full md:w-1/3 sticky top-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden p-4 backdrop-blur-sm">
                    <h3 className="text-zinc-400 uppercase text-xs font-bold tracking-wider mb-3">Your Room</h3>
                    <img 
                      src={originalImagePreview || ''} 
                      alt="Original" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Selected Style</label>
                        <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-200">
                          {selectedStyle ? selectedStyle.name : "Select a style from the right →"}
                        </div>
                      </div>

                       {/* Empty Room Toggle */}
                      <div 
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3
                          ${isRoomEmpty 
                            ? 'bg-indigo-900/30 border-indigo-500/50' 
                            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                          }`}
                        onClick={() => setIsRoomEmpty(!isRoomEmpty)}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isRoomEmpty ? 'bg-indigo-600 border-indigo-600' : 'border-zinc-600'}`}>
                          {isRoomEmpty && <Sofa className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-zinc-300 select-none">This is an empty room</span>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-zinc-300 mb-1.5 block">
                          Additional Instructions (Optional)
                        </label>
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="e.g., Make it blue, add more plants..."
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none h-24 placeholder-zinc-600"
                        />
                      </div>

                      <button
                        onClick={handleGenerate}
                        disabled={!selectedStyle || isGenerating}
                        className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all transform active:scale-95
                          ${!selectedStyle || isGenerating 
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20'
                          }`}
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Dreaming up designs...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate Design
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Choose a Style</h3>
                    <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">
                      {STYLES.length} Styles Available
                    </span>
                  </div>
                  <StyleSelector 
                    selectedId={selectedStyle?.id || null} 
                    onSelect={handleStyleSelect} 
                  />
                </div>
             </div>
          </div>
        )}

        {/* Step 3: Result */}
        {currentStep === 'result' && generatedImage && (
          <div className="animate-fade-in h-full flex flex-col">
            <div className="mb-6 flex items-center gap-4">
              <button 
                onClick={() => setCurrentStep('style')}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-zinc-900"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Styles
              </button>
              <div className="h-6 w-[1px] bg-zinc-800"></div>
              <h2 className="text-xl font-semibold text-white">
                {selectedStyle?.name} Transformation
              </h2>
            </div>
            
            <GeneratedResult 
              originalImage={originalImagePreview || ''}
              generatedImage={generatedImage}
              styleName={selectedStyle?.name || 'Custom'}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;