import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  Share2,
  Tv,
  Sparkles,
  Layers,
  Disc3,
  Copy,
  Check,
  Maximize2
} from 'lucide-react';
import { Song } from '../types';
import { audioEngine } from '../utils/audioSynthesizer';

interface BilibiliPlayerModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  onPlaySynth: (song: Song) => void;
  isSynthPlaying: boolean;
}

export const BilibiliPlayerModal: React.FC<BilibiliPlayerModalProps> = ({
  song,
  isOpen,
  onClose,
  onPlaySynth,
  isSynthPlaying,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'lyrics' | 'staff'>('video');
  const [copiedLink, setCopiedLink] = useState(false);
  const [customBvid, setCustomBvid] = useState('');

  useEffect(() => {
    if (song) {
      setCustomBvid(song.bilibiliBvid);
    }
  }, [song]);

  if (!isOpen || !song) return null;

  const handleCopyShare = () => {
    const url = `https://www.bilibili.com/video/${customBvid || song.bilibiliBvid}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const bvid = customBvid || song.bilibiliBvid;
  const embedUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&as_wide=1&high_quality=1&danmaku=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded text-xs font-black bg-[#FB7299] text-white flex items-center gap-1 shadow-xs">
              <Tv className="w-3 h-3" />
              Bilibili 内嵌播放
            </span>
            <h2 className="font-bold text-sm sm:text-base text-white truncate">
              {song.title} <span className="text-slate-400 text-xs font-normal">({song.singer})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 transition-colors"
              title="复制视频链接"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? '已复制' : '分享'}</span>
            </button>

            <a
              href={`https://www.bilibili.com/video/${bvid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#FB7299]/20 hover:bg-[#FB7299]/30 text-[#FB7299] border border-[#FB7299]/40 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="在B站新标签页打开"
            >
              <span>跳转B站</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two-column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left / Top: Video Player Frame (7 cols) */}
          <div className="lg:col-span-8 bg-black flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* 16:9 Aspect Ratio Video Box */}
            <div className="relative w-full aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* Actual Bilibili Iframe */}
              <iframe
                src={embedUrl}
                title={song.title}
                className="w-full h-full border-0 relative z-10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
              />
            </div>

            {/* Video Controls Bar */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPlaySynth(song)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      isSynthPlaying
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300 animate-pulse'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title="播放网页原生模拟旋律"
                  >
                    {isSynthPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isSynthPlaying ? '正在试听旋律' : '原生音频试听'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                  <span>BV:</span>
                  <input
                    type="text"
                    value={customBvid}
                    onChange={(e) => setCustomBvid(e.target.value)}
                    placeholder="BV1..."
                    className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-cyan-300 w-28 focus:outline-hidden focus:border-cyan-400 font-mono"
                    title="可在此输入任意B站BV号切换播放"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right / Bottom: Song Info, Staff & Lyrics (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 p-4 flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex rounded-lg bg-slate-800/80 p-1 border border-slate-700/60 text-xs font-medium">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex-1 py-1.5 rounded-md transition-all ${
                  activeTab === 'video'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                歌曲详情
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex-1 py-1.5 rounded-md transition-all ${
                  activeTab === 'staff'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Staff 名单
              </button>
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`flex-1 py-1.5 rounded-md transition-all ${
                  activeTab === 'lyrics'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                歌词文本
              </button>
            </div>

            {/* Tab 1: Video & Song Profile */}
            {activeTab === 'video' && (
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2 py-0.5 rounded-md font-bold text-slate-950 text-xs"
                      style={{ backgroundColor: song.singerColor }}
                    >
                      {song.singer}
                    </span>
                    <span className="text-slate-400">{song.genre} · {song.releaseDate}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed italic">
                    {song.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300 text-xs">
                  <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">全网播放</span>
                    <span className="font-bold text-cyan-400 text-sm">{song.playCount}</span>
                  </div>
                  <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">弹幕总数</span>
                    <span className="font-bold text-purple-400 text-sm">{song.danmakuCount}</span>
                  </div>
                  <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">时长</span>
                    <span className="font-mono">{song.duration}</span>
                  </div>
                  <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">BPM</span>
                    <span className="font-mono">{song.bpm || 120}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/20 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>社团标语</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    为爱发电，相依同行。感谢每一位在B站长按点赞、投币、收藏支持相依团队的朋友！
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Staff List */}
            {activeTab === 'staff' && (
              <div className="space-y-2 text-xs overflow-y-auto max-h-80 pr-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  制作组 STAFF 阵容
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-400">作曲</span>
                    <span className="font-semibold text-cyan-300">{song.staff.composition}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-400">编曲</span>
                    <span className="font-semibold text-slate-200">{song.staff.arrangement}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-400">作词</span>
                    <span className="font-semibold text-slate-200">{song.staff.lyrics}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-400">调校</span>
                    <span className="font-semibold text-purple-300">{song.staff.tuning}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-400">曲绘</span>
                    <span className="font-semibold text-amber-300">{song.staff.illustration}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-400">PV/影像</span>
                    <span className="font-semibold text-red-300">{song.staff.pv}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-400">混音</span>
                    <span className="font-semibold text-slate-200">{song.staff.mixing}</span>
                  </div>
                  {song.staff.planner && (
                    <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-slate-800">
                      <span className="text-slate-400">企划监制</span>
                      <span className="font-semibold text-cyan-400">{song.staff.planner}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Lyrics */}
            {activeTab === 'lyrics' && (
              <div className="flex-1 overflow-y-auto max-h-80 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {song.lyrics}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
