import React, { useState, useRef } from 'react';
import {
  Music2,
  Search,
  Tv,
  Play,
  Pause,
  FileText,
  Sparkles,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Maximize2,
  X,
  Disc3,
  User
} from 'lucide-react';
import { Song, VocaloidSinger, MusicGenre } from '../types';
import { useData } from '../context/DataContext';

interface SinglesViewProps {
  onSelectSongModal: (song: Song) => void;
  onPlaySongPreview: (song: Song) => void;
  onOpenLyrics: (song: Song) => void;
  playingSongId: string | null;
}

export const SinglesView: React.FC<SinglesViewProps> = ({
  onSelectSongModal,
  onPlaySongPreview,
  onOpenLyrics,
  playingSongId,
}) => {
  const { songs } = useData();
  const [selectedSinger, setSelectedSinger] = useState<VocaloidSinger>('全部');
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active song selected for the in-page "套娃演示" Bilibili embed player
  const [nestedPlayerSong, setNestedPlayerSong] = useState<Song>(songs[0] || {} as Song);
  const [copiedBvid, setCopiedBvid] = useState(false);

  const nestedPlayerRef = useRef<HTMLDivElement>(null);

  const singers: VocaloidSinger[] = ['全部', '洛天依', '乐正绫', '星尘', '言和', '合唱/双子', '初音未来'];
  const genres: MusicGenre[] = ['全部', '古风/国风', '电子/EDM', '流行摇滚', '抒情物语', '交响/幻想'];

  // Filter logic
  const filteredSongs = songs.filter((song) => {
    const matchesSinger = selectedSinger === '全部' || song.singer === selectedSinger;
    const matchesGenre = selectedGenre === '全部' || song.genre === selectedGenre;
    const matchesSearch = 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.singer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.staff.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.staff.lyrics.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSinger && matchesGenre && matchesSearch;
  });

  const handleCardClickForNested = (song: Song) => {
    setNestedPlayerSong(song);
    // Smooth scroll to the nested player area
    if (nestedPlayerRef.current) {
      nestedPlayerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyBv = (bvid: string) => {
    navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`);
    setCopiedBvid(true);
    setTimeout(() => setCopiedBvid(false), 2000);
  };

  return (
    <div className="space-y-7 pb-12 animate-fade-in text-slate-100">
      {/* 1. Header: [作品展示 - 原创单曲] */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                作品展示 - 原创单曲
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                相依团队所有原创中文歌姬曲目库 · 点击任意卡片可触发下方【套娃内嵌播放】
              </p>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索歌名 / 创作者 / 歌姬..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* 2. Filter Bar: 筛选: [全部] [洛天依] [乐正绫] [星尘] ... */}
      <div className="space-y-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
        {/* Singer Filter Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-300 mr-1 shrink-0">歌姬筛选:</span>
          {singers.map((singer) => {
            const isSelected = selectedSinger === singer;
            return (
              <button
                key={singer}
                onClick={() => setSelectedSinger(singer)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                {singer}
              </button>
            );
          })}
        </div>

        {/* Genre Filter Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-slate-800">
          <span className="font-bold text-slate-400 mr-1 shrink-0">曲风风格:</span>
          {genres.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400 font-bold'
                    : 'bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Song Cards Grid [作品卡片] */}
      {filteredSongs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <p className="text-slate-400 text-sm">未找到符合筛选条件的原创单曲</p>
          <button
            onClick={() => {
              setSelectedSinger('全部');
              setSelectedGenre('全部');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30"
          >
            重置筛选条件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSongs.map((song) => {
            const isNestedActive = nestedPlayerSong.id === song.id;
            const isThisPlaying = playingSongId === song.id;

            return (
              <div
                key={song.id}
                onClick={() => handleCardClickForNested(song)}
                className={`group relative rounded-2xl bg-slate-900 border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isNestedActive
                    ? 'border-cyan-400 shadow-xl shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
                }`}
              >
                {/* [曲绘封面] */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Singer Tag */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-xs font-bold text-slate-950 shadow-md"
                    style={{ backgroundColor: song.singerColor }}
                  >
                    {song.singer}
                  </span>

                  {/* Genre badge */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[11px] font-medium text-cyan-300 border border-cyan-500/30">
                    {song.genre}
                  </span>

                  {/* Play Overlay Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-3.5 py-1.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
                      <Tv className="w-4 h-4" />
                      <span>套娃内嵌播放</span>
                    </div>
                  </div>

                  {/* Duration & Play count */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1">
                      <Tv className="w-3 h-3 text-[#FB7299]" />
                      {song.playCount}
                    </span>
                    <span className="bg-black/60 px-1.5 py-0.5 rounded">
                      {song.duration}
                    </span>
                  </div>
                </div>

                {/* Card Content & Staff List [歌曲名 + Staff信息] */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors truncate">
                        {song.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                        {song.releaseDate}
                      </span>
                    </div>
                    {song.subtitle && (
                      <p className="text-xs text-cyan-400/80 font-medium">
                        {song.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Staff Block (Detailed credits box) */}
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">作曲 / 编曲:</span>
                      <span className="font-medium text-cyan-300 truncate max-w-[140px] text-right">
                        {song.staff.composition}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">作词:</span>
                      <span className="font-medium text-slate-200 truncate max-w-[140px] text-right">
                        {song.staff.lyrics}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">调校:</span>
                      <span className="font-medium text-purple-300 truncate max-w-[140px] text-right">
                        {song.staff.tuning}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">曲绘 / PV:</span>
                      <span className="font-medium text-amber-300 truncate max-w-[140px] text-right">
                        {song.staff.illustration} / {song.staff.pv}
                      </span>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                    {/* Audio synth preview button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlaySongPreview(song);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isThisPlaying
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                      title="试听旋律"
                    >
                      {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{isThisPlaying ? '暂停' : '试听'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Lyrics button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLyrics(song);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700"
                        title="查看歌词"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      {/* Fullscreen modal trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSongModal(song);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FB7299]/15 hover:bg-[#FB7299]/25 text-[#FB7299] border border-[#FB7299]/30 font-semibold flex items-center gap-1"
                        title="大屏弹窗模式"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">弹窗</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. [! 套娃演示：点击卡片A，在此处弹出外部B站视频内嵌页 !] */}
      <section 
        ref={nestedPlayerRef}
        className="mt-10 rounded-2xl bg-slate-900 border-2 border-cyan-500/40 p-5 md:p-6 shadow-2xl space-y-4"
      >
        {/* Banner Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500 text-slate-950">
                  套娃演示 · 实时内嵌
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  B站视频内嵌播放区
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                当前正在内嵌播放：<span className="text-cyan-300 font-semibold">{nestedPlayerSong.title}</span> ({nestedPlayerSong.singer})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyBv(nestedPlayerSong.bilibiliBvid)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
              title="复制分享链接"
            >
              {copiedBvid ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBvid ? '已复制' : '复制视频链接'}</span>
            </button>

            <a
              href={`https://www.bilibili.com/video/${nestedPlayerSong.bilibiliBvid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#FB7299] hover:bg-[#e05e83] text-white text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
            >
              <span>前往B站原网页</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Embedded Iframe Container & Interactive Suite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Video Box */}
          <div className="lg:col-span-8 bg-black rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-between">
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* The Iframe */}
              <iframe
                src={`https://player.bilibili.com/player.html?bvid=${nestedPlayerSong.bilibiliBvid}&page=1&as_wide=1&high_quality=1&danmaku=1`}
                title={nestedPlayerSong.title}
                className="w-full h-full border-0 relative z-10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
              />
            </div>

            {/* Video info bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  BV: {nestedPlayerSong.bilibiliBvid}
                </span>
              </div>
            </div>
          </div>

          {/* Right Info Box: Staff, Slogan, and Switcher */}
          <div className="lg:col-span-4 bg-slate-850 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded text-xs font-bold text-slate-950"
                  style={{ backgroundColor: nestedPlayerSong.singerColor }}
                >
                  {nestedPlayerSong.singer}
                </span>
                <span className="text-xs text-slate-400">{nestedPlayerSong.genre}</span>
              </div>

              <div>
                <h4 className="font-black text-lg text-white">
                  {nestedPlayerSong.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed italic">
                  “{nestedPlayerSong.description}”
                </p>
              </div>

              {/* Staff Credits */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Staff 制作阵容</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div><span className="text-slate-400">作曲:</span> {nestedPlayerSong.staff.composition}</div>
                  <div><span className="text-slate-400">编曲:</span> {nestedPlayerSong.staff.arrangement}</div>
                  <div><span className="text-slate-400">作词:</span> {nestedPlayerSong.staff.lyrics}</div>
                  <div><span className="text-slate-400">调校:</span> {nestedPlayerSong.staff.tuning}</div>
                  <div><span className="text-slate-400">曲绘:</span> {nestedPlayerSong.staff.illustration}</div>
                  <div><span className="text-slate-400">PV:</span> {nestedPlayerSong.staff.pv}</div>
                </div>
              </div>
            </div>

            {/* Quick Song Switcher Thumbnails */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400">
                切换其他内嵌作品:
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {songs.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setNestedPlayerSong(s)}
                    className={`relative w-14 h-10 rounded overflow-hidden shrink-0 border transition-all ${
                      nestedPlayerSong.id === s.id
                        ? 'border-cyan-400 ring-2 ring-cyan-400'
                        : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                    title={s.title}
                  >
                    <img 
                      src={s.coverUrl} 
                      alt={s.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
