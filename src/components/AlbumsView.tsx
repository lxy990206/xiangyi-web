import React, { useState } from 'react';
import { 
  FolderHeart, 
  Disc3, 
  Play, 
  ExternalLink, 
  Sparkles, 
  Music, 
  Download, 
  Share2, 
  Tv, 
  ShoppingBag,
  ListMusic
} from 'lucide-react';
import { Album, Song } from '../types';
import { useData } from '../context/DataContext';

interface AlbumsViewProps {
  onSelectSongModal?: (song: Song) => void;
}

export const AlbumsView: React.FC<AlbumsViewProps> = () => {
  const { albums } = useData();
  const [selectedAlbumState, setSelectedAlbumState] = useState<Album | null>(null);

  const selectedAlbum = selectedAlbumState || albums[0] || {} as Album;

  return (
    <div className="space-y-8 pb-12 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <FolderHeart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              作品展示 - 企划专辑
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              相依团队出品的同人原创概念实体CD与数字EP · 附带全彩画集与独占特典
            </p>
          </div>
        </div>
      </div>

      {/* Album List & Detailed Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Album Navigation & Quick Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            发行专辑列表
          </div>

          <div className="space-y-3">
            {albums.map((album) => {
              const isSelected = selectedAlbum.id === album.id;
              return (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbumState(album)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-slate-800 border-purple-400 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/50'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover shrink-0 shadow-md"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-purple-400 block font-mono">
                      {album.releaseYear}
                    </span>
                    <h3 className="font-bold text-sm text-white truncate">
                      {album.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {album.tracks.length} 首曲目收录
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Album Full Details (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative group shrink-0 mx-auto sm:mx-0">
              <img
                src={selectedAlbum.coverUrl}
                alt={selectedAlbum.title}
                referrerPolicy="no-referrer"
                className="w-48 h-48 rounded-xl object-cover shadow-2xl border border-slate-700"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg">
                <Disc3 className="w-5 h-5 animate-spin-slow" />
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <span className="text-xs font-mono text-purple-400 font-bold">
                  {selectedAlbum.releaseYear} 发行 · 原创概念同人二专
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {selectedAlbum.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedAlbum.subTitle}
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedAlbum.description}
              </p>

              {/* Streaming Platform buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedAlbum.bilibiliBvid && (
                  <a
                    href={`https://www.bilibili.com/video/${selectedAlbum.bilibiliBvid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#FB7299]/20 hover:bg-[#FB7299]/30 text-[#FB7299] border border-[#FB7299]/40 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>B站全曲试听 (Crossfade)</span>
                  </a>
                )}

                <a
                  href={selectedAlbum.platforms.netease || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>网易云音乐</span>
                </a>
              </div>
            </div>
          </div>

          {/* Tracklist table */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <ListMusic className="w-4 h-4 text-purple-400" />
                收录曲目清单 ({selectedAlbum.tracks.length} Tracks)
              </span>
              <span className="text-slate-400 font-normal">全曲目重制母带版</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 divide-y divide-slate-800 bg-slate-950/60 text-xs">
              {selectedAlbum.tracks.map((track) => (
                <div
                  key={track.trackNumber}
                  className="p-3 flex items-center justify-between hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center font-mono text-slate-400 group-hover:text-purple-400 font-bold">
                      {String(track.trackNumber).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-white truncate">
                        {track.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        演唱：{track.singer} · 词：{track.lyricist} · 曲：{track.composer}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-slate-400 text-xs shrink-0">
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
