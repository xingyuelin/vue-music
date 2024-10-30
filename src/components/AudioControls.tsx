import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function AudioControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
}: AudioControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-6">
      <button 
        onClick={onPrevious}
        className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
        aria-label="Previous song"
      >
        <SkipBack size={24} />
      </button>
      
      <button 
        onClick={onPlayPause}
        className="p-4 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      
      <button 
        onClick={onNext}
        className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
        aria-label="Next song"
      >
        <SkipForward size={24} />
      </button>
    </div>
  );
}