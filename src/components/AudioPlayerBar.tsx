import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Tv, 
  FileText, 
  X, 
  Music,
  Headphones
} from 'lucide-react';
import { Song } from '../types';
import { useData } from '../context/DataContext';
import { audioEngine } from '../utils/audioSynthesizer';

interface AudioPlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectSong: (song: Song) => void;
  onOpenVideoModal: (song: Song) => void;
  onOpenLyrics: (song: Song) => void;
  onCloseBar: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onSelectSong,
  onOpenVideoModal,
  onOpenLyrics,
  onCloseBar,
}) => {
  const { songs } = useData();
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs <= 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Connect to audioEngine progress updates
  useEffect(() => {
    audioEngine.setProgressCallback((cur, dur, pct) => {
      setProgress(pct);
      setCurrentTimeStr(formatTime(cur));
      if (dur > 0) {
        setDurationStr(formatTime(dur));
      }
    });

    return () => {
      audioEngine.setProgressCallback(null);
    };
  }, []);

  // Simulated progress timer when synth is playing without real audio
  useEffect(() => {
    let interval: number;
    const status = audioEngine.getStatus();
    if (isPlaying && !status.isRealAudio) {
      interval = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.8));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!currentSong) return null;

  const songList = songs.length > 0 ? songs : [currentSong];

  const handleNext = () => {
    const currentIndex = songList.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songList.length;
    onSelectSong(songList[nextIndex]);
    setProgress(0);
  };

  const handlePrev = () => {
    const currentIndex = songList.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    onSelectSong(songList[prevIndex]);
    setProgress(0);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      audioEngine.setVolume(0.8);
      setIsMuted(false);
    } else {
      audioEngine.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPct = Math.min(Math.max((clickX / rect.width) * 100, 0), 100);
    setProgress(newPct);
    audioEngine.seek(newPct);
  };

  const hasCustomAudio = Boolean(currentSong.audioUrl && currentSong.audioUrl.trim().length > 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-cyan-500/30 px-4 py-2.5 shadow-2xl text-slate-100 animate-slide-up">
      {/* Top progress bar slider */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800 cursor-pointer group"
        onClick={handleSeek}
        title="点击调整播放进度"
      >
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-100 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 shadow-md transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 pt-1">
        {/* Left: Song Profile */}
        <div className="flex items-center gap-3 min-w-0 max-w-[260px] sm:max-w-xs">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
            <img 
              src={currentSong.coverUrl} 
              alt={currentSong.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-2 bg-cyan-400 animate-ping" />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" />
                  <span className="w-0.5 h-1.5 bg-cyan-400" />
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                {currentSong.title}
              </h4>
              <span 
                className="px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-950 shrink-0"
                style={{ backgroundColor: currentSong.singerColor }}
              >
                {currentSong.singer}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
              <span>{currentSong.staff.composition} · {currentSong.genre}</span>
              {hasCustomAudio ? (
                <span className="inline-flex items-center gap-0.5 text-[9px] px-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  <Headphones className="w-2.5 h-2.5" /> 原声
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-[9px] px-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                  <Music className="w-2.5 h-2.5" /> 旋律
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Playback Controls & Time */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="上一曲"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md shadow-cyan-500/30 transition-all hover:scale-105"
              title={isPlaying ? '暂停' : '试听'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="下一曲"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden sm:inline-flex"
              title={isMuted ? '取消静音' : '静音'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {hasCustomAudio && (
            <div className="text-[10px] text-slate-400 font-mono hidden md:block">
              {currentTimeStr} / {durationStr !== '0:00' ? durationStr : currentSong.duration}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Lyrics button */}
          <button
            onClick={() => onOpenLyrics(currentSong)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 transition-colors"
            title="歌词"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">歌词</span>
          </button>

          {/* Video modal button */}
          <button
            onClick={() => onOpenVideoModal(currentSong)}
            className="px-2.5 py-1 rounded-lg bg-[#FB7299]/20 hover:bg-[#FB7299]/30 text-[#FB7299] border border-[#FB7299]/40 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="查看B站内嵌视频"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">B站视频</span>
          </button>

          {/* Close bar button */}
          <button
            onClick={onCloseBar}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-1"
            title="关闭播放条"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

