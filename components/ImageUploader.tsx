import React, { useRef, useState } from 'react';
import { UploadCloud, Image } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  };

  return (
    <div
      className={`w-full max-w-xl bg-zinc-900/50 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center p-12 cursor-pointer group
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
          : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      <div className="bg-zinc-800 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-black/50">
        <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-indigo-400' : 'text-zinc-400'}`} />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">Click or drag image to upload</h3>
      <p className="text-zinc-500 text-center max-w-sm">
        Supported formats: JPEG, PNG, WEBP. 
        <br/>For best results, use a well-lit photo of a room.
      </p>

      <div className="mt-8 flex gap-3 opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">
        <div className="w-16 h-12 bg-zinc-800 rounded-md border border-zinc-700 flex items-center justify-center">
            <Image className="w-6 h-6 text-zinc-500" />
        </div>
        <div className="w-16 h-12 bg-zinc-800 rounded-md border border-zinc-700 flex items-center justify-center">
             <div className="w-6 h-6 rounded-full border-2 border-zinc-600"></div>
        </div>
      </div>
    </div>
  );
};