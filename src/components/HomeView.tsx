import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Disc3, 
  Users, 
  Tv, 
  Flame, 
  Heart, 
  Radio, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { NavTab, Song } from '../types';
import { useData } from '../context/DataContext';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectSong: (song: Song) => void;
  onOpenRecruitment: () => void;
  onOpenQQModal: () => void;
  onPlaySongPreview: (song: Song) => void;
  playingSongId: string | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectSong,
  onOpenRecruitment,
  onOpenQQModal,
  onPlaySongPreview,
  playingSongId,
}) => {
  const { songs, teamInfo } = useData();
  const featuredSongs = songs.filter((s) => s.isFeatured).length > 0
    ? songs.filter((s) => s.isFeatured)
    : songs.slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto carousel slide
  useEffect(() => {
    if (featuredSongs.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredSongs.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredSongs.length]);

  const activeSlideSong = featuredSongs[currentSlide] || songs[0];

  return (
    <div className="space-y-8 pb-12 animate-fade-in text-slate-100">
      {/* 1. Hero Visual Carousel [主视觉大图 (海报/歌姬曲绘轮播)] */}
      <section className="relative rounded-2xl overflow-hidden bg-slate-900 border border-cyan-500/30 shadow-xl">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
          {/* Background Image with Ambient Glow */}
          <img
            src={activeSlideSong.coverUrl}
            alt={activeSlideSong.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 filter brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Carousel Content Overlay */}
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end md:justify-center z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-950 shadow-md"
                style={{ backgroundColor: activeSlideSong.singerColor }}
              >
                {activeSlideSong.singer}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
                {activeSlideSong.genre}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {activeSlideSong.releaseDate}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {activeSlideSong.title}
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200/90 font-medium mt-1 mb-3 drop-shadow-xs">
              {activeSlideSong.subtitle || '相依团队最新原创力作'}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-5 max-w-xl">
              {activeSlideSong.description}
            </p>

            {/* CTA Buttons for Carousel */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectSong(activeSlideSong)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer hover:scale-102"
              >
                <Tv className="w-4 h-4" />
                <span>观看B站内嵌视频</span>
              </button>

              <button
                onClick={() => onPlaySongPreview(activeSlideSong)}
                className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  playingSongId === activeSlideSong.id
                    ? 'bg-purple-500/30 border-purple-400 text-purple-200'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200 hover:text-white'
                }`}
              >
                <Play className="w-4 h-4 text-cyan-400" />
                <span>{playingSongId === activeSlideSong.id ? '正在试听' : '音频试听'}</span>
              </button>
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredSongs.length) % featuredSongs.length)}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="上一张"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {featuredSongs.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                  title={s.title}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredSongs.length)}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="下一张"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Team Slogan & Mission Banner [团队标语：为爱发电，相依同行。] */}
      <section className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>相依创作者社团 · 同人音乐企划</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {teamInfo.slogan}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {teamInfo.description}
            </p>
          </div>

          {/* Quick Entries [快速入口：最新作品 / 加入我们] */}
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('singles')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer hover:scale-102"
            >
              <Disc3 className="w-4 h-4" />
              <span>最新作品库</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenRecruitment}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>加入我们 (招募)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Real-time Team Statistics Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-xs mb-1">原创单曲/投稿</span>
          <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
            {teamInfo.stats.worksCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">洛天依/乐正绫/星尘等</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-xs mb-1">全网播放量</span>
          <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
            {teamInfo.stats.playCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">B站/网易云/QQ音乐</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-xs mb-1">核心创作者</span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            {teamInfo.stats.membersCount} 位
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">曲绘/PV/调校/音频</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-xs mb-1">实体企划专辑</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {teamInfo.stats.albumsCount} 张
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">附全彩画集/特典</span>
        </div>
      </section>

      {/* 4. Recent Releases & Spotlight Works */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">精选原创歌姬代表作</h3>
          </div>
          <button
            onClick={() => onNavigate('singles')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>查看全部单曲</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.slice(0, 3).map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="group relative rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-3.5 space-y-3 transition-all hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
            >
              {/* Cover & Overlay */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                {/* Singer badge */}
                <span
                  className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-bold text-slate-950 shadow-md"
                  style={{ backgroundColor: song.singerColor }}
                >
                  {song.singer}
                </span>

                {/* Duration */}
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300">
                  {song.duration}
                </span>

                {/* Hover Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Tv className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Title & Info */}
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                  {song.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  词：{song.staff.lyrics} · 曲：{song.staff.composition} · 调：{song.staff.tuning}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono text-cyan-400/90">
                  <Tv className="w-3 h-3 text-[#FB7299]" />
                  {song.playCount} 播放
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaySongPreview(song);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-900/60 text-slate-300 hover:text-cyan-200 border border-slate-700 text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>试听</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Urgent Recruitment Callout Banner */}
      <section className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-slate-900 border border-red-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">急招中</span>
              <h4 className="font-bold text-sm sm:text-base text-white">
                相依团队2025春季企划 · 招募曲绘师 / PV动效师
              </h4>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              多首原创洛天依/星尘单曲企划分镜已就绪，欢迎携作品投递交流！
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRecruitment}
          className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20 transition-all shrink-0 cursor-pointer"
        >
          <span>查看招募详情</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
