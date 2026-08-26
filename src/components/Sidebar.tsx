import React, { useState } from 'react';
import { 
  Home, 
  Disc3, 
  Music2, 
  FolderHeart, 
  Users, 
  Sparkles, 
  Info, 
  ChevronDown, 
  ChevronRight, 
  Radio, 
  MessageCircle, 
  Send, 
  Flame, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink,
  Heart,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { NavTab } from '../types';
import { useData } from '../context/DataContext';

interface SidebarProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onOpenQQModal: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onOpenQQModal,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { teamInfo, songs, albums, collaborations, members, isAdminAuthenticated } = useData();

  // Expandable submenu for "作品主页"
  const isWorksActive = ['singles', 'albums', 'collaborations'].includes(currentTab);
  const [isWorksExpanded, setIsWorksExpanded] = useState<boolean>(true);
  const [copiedGroup, setCopiedGroup] = useState(false);

  const handleCopyQQ = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(teamInfo.socials.qqGroup);
    setCopiedGroup(true);
    setTimeout(() => setCopiedGroup(false), 2000);
  };

  const navConfig = teamInfo.navigationConfig || {};

  const navItems = [
    {
      id: 'home' as NavTab,
      label: navConfig.homeTitle || '首页',
      icon: Home,
      badge: null,
    },
    {
      id: 'works_parent',
      label: '作品主页',
      icon: Disc3,
      isParent: true,
      children: [
        { id: 'singles' as NavTab, label: navConfig.singlesTitle || '原创单曲', icon: Music2, count: `${songs.length}+` },
        { id: 'albums' as NavTab, label: navConfig.albumsTitle || '企划专辑', icon: FolderHeart, count: `${albums.length}` },
        { id: 'collaborations' as NavTab, label: navConfig.collaborationsTitle || '合作项目', icon: Layers, count: `${collaborations.length}` },
      ]
    },
    {
      id: 'members' as NavTab,
      label: navConfig.membersTitle || '成员名单',
      icon: Users,
      badge: `${members.length}人`,
    },
    {
      id: 'recruitment' as NavTab,
      label: navConfig.recruitmentTitle || '招募中心',
      icon: Sparkles,
      badge: '急招',
      isHot: true,
    },
    {
      id: 'about' as NavTab,
      label: navConfig.aboutTitle || '关于我们',
      icon: Info,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 lg:z-30
        w-64 bg-slate-900 border-r border-slate-800 text-slate-200
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:top-[45px] lg:h-[calc(100vh-45px)]
      `}>
        {/* Top: Team Logo & Brand Intro */}
        <div className="p-4 border-b border-slate-800/80 bg-gradient-to-b from-slate-800/40 to-transparent">
          <div 
            onClick={() => {
              onNavigate('home');
              onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-900"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                  {teamInfo.name}
                </h1>
                <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1 rounded">
                  2025
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate tracking-wide mt-0.5">
                {teamInfo.slogan}
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Navigation Tree */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            导航菜单
          </div>

          {navItems.map((item) => {
            if (item.isParent && item.children) {
              return (
                <div key={item.id} className="space-y-1">
                  {/* Parent Works Header */}
                  <button
                    onClick={() => {
                      setIsWorksExpanded(!isWorksExpanded);
                      if (!isWorksActive) {
                        onNavigate('singles');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isWorksActive
                        ? 'bg-slate-800 text-cyan-400 font-bold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Disc3 className={`w-4 h-4 ${isWorksActive ? 'text-cyan-400 animate-spin-slow' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isWorksExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Sub-items (Tree branches) */}
                  {isWorksExpanded && (
                    <div className="ml-4 pl-3 border-l-2 border-slate-700/60 space-y-1 py-0.5">
                      {item.children.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = currentTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onNavigate(sub.id);
                              onCloseMobile();
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                              isSubActive
                                ? 'bg-cyan-500/20 text-cyan-300 font-bold border-l-2 border-cyan-400 pl-2 shadow-xs'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                              <span>{sub.label}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 px-1 py-0.2 rounded bg-slate-800/80">
                              {sub.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as NavTab);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                    item.isHot 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.isHot && <Flame className="w-2.5 h-2.5" />}
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="pt-3 pb-1">
            <div className="h-px w-full bg-slate-800" />
          </div>

          {/* Quick Tools & Socials Section */}
          <div className="space-y-1.5 pt-1">
            <div className="px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>快捷工具 / 社媒</span>
            </div>

            {/* Bilibili Channel */}
            <a
              href={teamInfo.socials.bilibili}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-[#FB7299]/15 hover:text-[#FB7299] transition-colors border border-transparent hover:border-[#FB7299]/30 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#FB7299] text-white flex items-center justify-center text-[10px] font-black">
                  B
                </span>
                <span className="font-medium">B站官号</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#FB7299]" />
            </a>

            {/* Weibo */}
            <a
              href={teamInfo.socials.weibo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-[#E6162D]/15 hover:text-[#E6162D] transition-colors border border-transparent hover:border-[#E6162D]/30 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#E6162D] text-white flex items-center justify-center text-[10px] font-bold">
                  微
                </span>
                <span className="font-medium">官方微博</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#E6162D]" />
            </a>

            {/* QQ Group Button */}
            <div 
              onClick={onOpenQQModal}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-cyan-500/15 hover:text-cyan-300 transition-colors border border-transparent hover:border-cyan-500/30 cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <span className="font-medium">交流QQ群</span>
              </div>
              <button 
                onClick={handleCopyQQ}
                className="text-[10px] font-mono bg-slate-800 hover:bg-cyan-900/60 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-700 hover:border-cyan-500/40"
                title="点击复制群号"
              >
                {copiedGroup ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-green-400" />
                    <span className="text-green-400">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" />
                    <span>{teamInfo.socials.qqGroup}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Bottom Footer Info & Subtle Admin Access */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>© 2025 Xiangyi Team</span>
            <span className="text-cyan-500/80 font-mono">v2.5</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Heart className="w-3 h-3 text-red-400/80 inline fill-red-400/30" />
              <span>为爱发电 · 相依同行</span>
            </div>
            {/* Discreet Admin Maintenance Entry */}
            <button
              onClick={() => {
                onNavigate('admin');
                onCloseMobile();
              }}
              className={`p-1 rounded text-[10px] flex items-center gap-1 transition-all ${
                currentTab === 'admin'
                  ? 'text-cyan-300 bg-cyan-500/20 font-bold border border-cyan-500/30'
                  : 'text-slate-600 hover:text-slate-300 hover:bg-slate-800'
              }`}
              title="社团管理 · 页面维护后台 (需密码登录)"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>维护</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
