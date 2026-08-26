import React from 'react';
import { Layers, ExternalLink, Calendar, Users, Tv, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export const CollaborationsView: React.FC = () => {
  const { collaborations } = useData();

  return (
    <div className="space-y-8 pb-12 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              作品展示 - 合作项目
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              相依团队与其他同人社团、大型中文Vocaloid展演及Remix企划的联合共创
            </p>
          </div>
        </div>
      </div>

      {/* Collaborations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collaborations.map((collab) => (
          <div
            key={collab.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-blue-500/40 transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                <img
                  src={collab.coverUrl}
                  alt={collab.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500 text-slate-950 shadow-md">
                  {collab.year} 联合企划
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {collab.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mt-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>合作方：{collab.partnerCircle}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800 text-xs space-y-1 text-slate-300">
                  <div className="text-slate-400">所属展演 / 企划：{collab.eventName}</div>
                  <div className="text-cyan-300 font-semibold">相依负责职责：{collab.role}</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {collab.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <a
                href={collab.bilibiliBvid.startsWith('http') ? collab.bilibiliBvid : `https://www.bilibili.com/video/${collab.bilibiliBvid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-[#FB7299]/20 text-slate-200 hover:text-[#FB7299] border border-slate-700 hover:border-[#FB7299]/40 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Tv className="w-4 h-4 text-[#FB7299]" />
                <span>前往 Bilibili 观看合作联合投稿</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
