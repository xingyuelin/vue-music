import React, { useState, useRef, useEffect } from 'react';
import { Repeat, ListMusic } from 'lucide-react';
import AudioControls from './AudioControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import URLInput from './URLInput';
import PlaylistModal from './PlaylistModal';

interface Song {
  title: string;
  artist: string;
  url: string;
}

const defaultSongs: Song[] = [
  {
    title: "Forest Lullaby",
    artist: "Lesfm",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=forest-lullaby-110624.mp3"
  },
  {
    title: "Sweet Dreams",
    artist: "Ashot-Danielyan",
    url: "https://cdn.pixabay.com/download/audio/2022/01/20/audio_c8c8a73467.mp3?filename=sweet-dreams-116581.mp3"
  }
];

export default function MusicPlayer() {
  const [songs, setSongs] = useState<Song[]>(defaultSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = songs[currentSongIndex];

  const handleAddSong = (url: string) => {
    try {
      new URL(url);
      const newSong: Song = {
        title: `Custom Track ${songs.length + 1}`,
        artist: 'Custom URL',
        url: url
      };
      setSongs(prev => [...prev, newSong]);
      setCurrentSongIndex(songs.length);
    } catch (err) {
      setError('Invalid URL format. Please enter a valid audio URL.');
    }
  };

  const handleDeleteSong = (index: number) => {
    if (songs.length <= 1) return;

    setSongs(prev => prev.filter((_, i) => i !== index));
    
    if (index === currentSongIndex) {
      setCurrentSongIndex(prev => 
        index >= songs.length - 1 ? prev - 1 : prev
      );
    } else if (index < currentSongIndex) {
      setCurrentSongIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);

    const loadAudio = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.load();
          setIsLoading(false);
          if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error("Playback failed:", error);
                setError("Failed to play audio. Please try again.");
              });
            }
          }
        }
      } catch (err) {
        setError("Failed to load audio file.");
        setIsLoading(false);
      }
    };

    loadAudio();
  }, [currentSongIndex]);

  const togglePlay = async () => {
    try {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        }
        setIsPlaying(!isPlaying);
      }
    } catch (err) {
      setError("Playback failed. Please try again.");
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = parseFloat(e.target.value);
      setCurrentTime(time);
      audioRef.current.currentTime = time;
    }
  };

  const handlePrevious = () => {
    setCurrentSongIndex(prev => (prev === 0 ? songs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSongIndex(prev => (prev === songs.length - 1 ? 0 : prev + 1));
  };

  const handleEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => setError("Failed to replay track."));
      }
    } else {
      handleNext();
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-4">
      <audio 
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={() => setError("Failed to load audio file.")}
        loop={isLooping}
      />
      
      <URLInput onAddSong={handleAddSong} />

      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">{currentSong.title}</h2>
        <p className="text-gray-500">{currentSong.artist}</p>
      </div>

      {error && (
        <div className="text-red-500 text-center text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onProgressChange={handleProgressChange}
          />

          <AudioControls
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />

          <div className="flex items-center justify-between">
            <div className="w-1/2">
              <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={setVolume}
                onMuteToggle={toggleMute}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleLoop}
                className={`p-2 rounded-full transition-all transform ${
                  isLooping 
                    ? 'text-indigo-600 bg-indigo-50 scale-110' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                aria-label={isLooping ? 'Disable loop' : 'Enable loop'}
                title={isLooping ? 'Disable loop' : 'Enable loop'}
              >
                <Repeat size={20} className={`transform transition-transform ${isLooping ? 'scale-110' : ''}`} />
              </button>
              
              <button
                onClick={() => setIsPlaylistOpen(true)}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                aria-label="Open playlist"
              >
                <ListMusic size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      <PlaylistModal
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        songs={songs}
        currentSongIndex={currentSongIndex}
        onSongSelect={setCurrentSongIndex}
        onSongDelete={handleDeleteSong}
      />
    </div>
  );
}