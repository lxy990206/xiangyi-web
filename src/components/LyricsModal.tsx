import React, { useState } from 'react';
import { X, FileText, Copy, Check, Disc3 } from 'lucide-react';
import { Song } from '../types';

interface LyricsModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({ song, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !song) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${song.title} - ${song.singer}\n\n${song.lyrics}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{song.title}</h3>
              <p className="text-xs text-slate-400">演唱：{song.singer} · 词：{song.staff.lyrics}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制歌词'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed space-y-1">
          {song.lyrics}
        </div>
      </div>
    </div>
  );
};
