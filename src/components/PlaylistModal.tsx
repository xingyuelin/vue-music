import React from 'react';
import { X, Music, Trash2 } from 'lucide-react';

interface Song {
  title: string;
  artist: string;
  url: string;
}

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  currentSongIndex: number;
  onSongSelect: (index: number) => void;
  onSongDelete: (index: number) => void;
}

export default function PlaylistModal({
  isOpen,
  onClose,
  songs,
  currentSongIndex,
  onSongSelect,
  onSongDelete,
}: PlaylistModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Playlist</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close playlist"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {songs.map((song, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors ${
                currentSongIndex === index ? 'bg-indigo-50' : ''
              }`}
            >
              <button
                onClick={() => {
                  onSongSelect(index);
                  onClose();
                }}
                className={`flex-1 flex items-center space-x-3 text-left ${
                  currentSongIndex === index ? 'text-indigo-600' : 'text-gray-700'
                }`}
              >
                <Music size={16} className={currentSongIndex === index ? 'text-indigo-600' : 'text-gray-400'} />
                <div>
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                </div>
              </button>
              
              {songs.length > 1 && (
                <button
                  onClick={() => onSongDelete(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Delete ${song.title}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}