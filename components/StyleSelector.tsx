import React, { useRef } from 'react';
import { DesignStyle } from '../types';
import { STYLES } from '../constants';
import { CheckCircle2 } from 'lucide-react';

interface StyleSelectorProps {
  selectedId: string | null;
  onSelect: (style: DesignStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {STYLES.map((style) => {
        const isSelected = selectedId === style.id;
        
        return (
          <div
            key={style.id}
            onClick={() => onSelect(style)}
            className={`relative group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300
              ${isSelected 
                ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-lg shadow-indigo-500/20' 
                : 'border-zinc-800 hover:border-zinc-600'
              }`}
          >
            <div className="flex items-center p-3 bg-zinc-900/90 backdrop-blur-sm h-20">
                <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 mr-4 relative">
                    <img 
                        src={style.imageUrl} 
                        alt={style.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="flex-1">
                    <h4 className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                        {style.name}
                    </h4>
                </div>
                <div className="text-zinc-600">
                    {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-700 group-hover:border-zinc-500"></div>
                    )}
                </div>
            </div>
            {/* Subtle glow effect on hover */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 
                bg-gradient-to-r from-white/5 to-transparent`} 
            />
          </div>
        );
      })}
    </div>
  );
};