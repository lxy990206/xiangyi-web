import React from 'react';
import { Volume2, VolumeX, Sparkles, Megaphone, ArrowRight, ExternalLink } from 'lucide-react';
import { NavTab } from '../types';
import { useData } from '../context/DataContext';

interface GlobalHeaderProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenRecruitment: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  onNavigate,
  isAudioPlaying,
  onToggleAudio,
  onOpenRecruitment,
}) => {
  const { teamInfo, announcements } = useData();
  // 置顶公告优先展示；无置顶时按列表顺序取第一条
  const currentAnnouncement = announcements.some((a) => a.isPinned)
    ? announcements.find((a) => a.isPinned)!
    : announcements[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/20 text-slate-100 shadow-md">
      <div className="w-full px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand Title & Marquee */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            title="回到首页"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-sm shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <span className="text-white text-xs font-black tracking-tighter">XY</span>
            </div>
            <span className="font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent hidden sm:inline">
              {teamInfo.name} <span className="text-xs font-normal text-cyan-400/80 uppercase ml-1">Xiangyi Team 官网</span>
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block shrink-0" />

          {/* Announcement Ticker with Click Action */}
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden bg-slate-800/80 hover:bg-slate-800 transition-colors border border-cyan-500/30 rounded-full px-2.5 sm:px-3 py-1 text-xs">
            <Megaphone className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-bounce" />
            <span className="bg-cyan-500/20 text-cyan-300 font-semibold px-1.5 py-0.5 rounded text-[11px] shrink-0 hidden min-[420px]:inline">
              {currentAnnouncement ? currentAnnouncement.tag : '公告'}
            </span>
            <button
              onClick={() => onNavigate(currentAnnouncement?.linkTab || 'recruitment')}
              className="text-slate-200 hover:text-cyan-300 transition-colors truncate text-left font-medium flex-1 min-w-0 cursor-pointer"
              title="点击查看详情"
            >
              {currentAnnouncement ? currentAnnouncement.title : '【公告】欢迎访问相依社官方网站'}
            </button>
            <button
              onClick={onOpenRecruitment}
              className="shrink-0 hidden min-[420px]:flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-200 transition-colors ml-1 bg-cyan-950/60 hover:bg-cyan-900/80 px-2 py-0.5 rounded-full border border-cyan-500/40"
            >
              <span>加入我们</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Sound ambiance, Social indicator, and Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Ambient BGM / Synth Sound State */}
          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              isAudioPlaying
                ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title={isAudioPlaying ? '暂停网页原声试听' : '点击试听社团主题旋律'}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden md:inline">原声播放中</span>
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-2 bg-cyan-400 animate-ping" />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" />
                  <span className="w-0.5 h-1.5 bg-cyan-400" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden md:inline">原声试听</span>
              </>
            )}
          </button>

          {/* Bilibili Status Link */}
          <a
            href={teamInfo.socials.bilibili}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FB7299]/15 hover:bg-[#FB7299]/25 border border-[#FB7299]/30 text-[#FB7299] transition-colors"
            title="前往 B站 官方空间"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB7299] animate-pulse" />
            <span className="font-semibold">B站官号</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
};
