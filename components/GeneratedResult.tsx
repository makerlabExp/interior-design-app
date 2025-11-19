import React, { useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';

interface GeneratedResultProps {
  originalImage: string;
  generatedImage: string;
  styleName: string;
}

export const GeneratedResult: React.FC<GeneratedResultProps> = ({ originalImage, generatedImage, styleName }) => {
  const [activeTab, setActiveTab] = useState<'generated' | 'original'>('generated');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${styleName.toLowerCase().replace(' ', '-')}-redesign.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden relative group">
        
        {/* Image Container */}
        <div className="relative w-full h-full min-h-[400px] md:min-h-[600px]">
           <img 
            src={activeTab === 'generated' ? generatedImage : originalImage}
            alt="Room Design"
            className="absolute inset-0 w-full h-full object-contain bg-black/50"
          />
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            
            {/* Toggle Switch */}
            <div className="bg-black/40 backdrop-blur-md p-1 rounded-lg border border-white/10 flex items-center">
                <button 
                    onClick={() => setActiveTab('original')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'original' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                    Original
                </button>
                <button 
                    onClick={() => setActiveTab('generated')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'generated' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                    Generated
                </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                 <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white text-zinc-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>
            </div>
        </div>

        <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-sm text-white font-medium">
             Style: {styleName}
        </div>
      </div>
    </div>
  );
};