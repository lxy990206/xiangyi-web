import React, { useState } from 'react';
import { Users, Sparkles, ExternalLink, Music, Award, Paintbrush, Film, Mic2, FileEdit, Shield } from 'lucide-react';
import { Department, Member } from '../types';
import { useData } from '../context/DataContext';

export const MembersView: React.FC = () => {
  const { members } = useData();
  const [selectedDept, setSelectedDept] = useState<Department>('all');

  const deptTabs = [
    { id: 'all' as Department, label: '全部成员', count: members.length },
    { id: 'admin' as Department, label: '策划 / 运营', icon: Shield },
    { id: 'music' as Department, label: '作曲 / 编曲 / 混音', icon: Music },
    { id: 'visual' as Department, label: '曲绘 / 插画', icon: Paintbrush },
    { id: 'video' as Department, label: 'PV / 动态影像', icon: Film },
    { id: 'tuning' as Department, label: '歌姬调校', icon: Mic2 },
    { id: 'lyrics' as Department, label: '作词 / 文案', icon: FileEdit },
  ];

  const filteredMembers = members.filter((m) => {
    if (selectedDept === 'all') return true;
    return m.department === selectedDept;
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              社团成员名单 (Roster)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              为爱发电，相依同行 · 凝聚在相依旗帜下的创作者与幕后 Staff 阵容
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#FB7299] bg-[#FB7299]/10 px-3 py-1.5 rounded-lg border border-[#FB7299]/20 self-start sm:self-auto font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>点击成员姓名或头像可直达对应 B站个人空间</span>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        {deptTabs.map((dept) => {
          const isSelected = selectedDept === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              {dept.label}
            </button>
          );
        })}
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredMembers.map((member) => {
          const bilibiliUrl = member.socialLinks?.bilibili;
          return (
            <div
              key={member.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 space-y-4 transition-all hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                {/* Avatar & Header */}
                <div className="flex items-center gap-3">
                  {bilibiliUrl ? (
                    <a
                      href={bilibiliUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block shrink-0 rounded-xl overflow-hidden group/avatar"
                      title={`访问 ${member.name} 的哔哩哔哩空间`}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-slate-700 group-hover/avatar:border-[#FB7299] shadow-md transition-all duration-300 group-hover/avatar:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-[#FB7299]" />
                      </div>
                    </a>
                  ) : (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-slate-700 shadow-md shrink-0"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {bilibiliUrl ? (
                        <a
                          href={bilibiliUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-base text-white hover:text-[#FB7299] transition-colors truncate flex items-center gap-1 group/name"
                          title={`点击在新标签页打开 ${member.name} 的哔哩哔哩个人空间`}
                        >
                          <span className="group-hover/name:underline underline-offset-2">{member.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/name:text-[#FB7299] transition-colors shrink-0" />
                        </a>
                      ) : (
                        <h3 className="font-bold text-base text-white truncate">
                          {member.name}
                        </h3>
                      )}
                      {member.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                          {member.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-cyan-400 font-medium truncate mt-0.5">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>

                {/* Representative Works */}
                {member.representativeWorks && member.representativeWorks.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1">
                    <span className="text-slate-400 font-semibold block">代表作品 / 企划：</span>
                    <div className="flex flex-wrap gap-1">
                      {member.representativeWorks.map((work, idx) => (
                        <span key={idx} className="text-amber-300/90 font-medium">
                          {work}{idx < member.representativeWorks.length - 1 ? '、' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links & Join Date */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-mono">加入：{member.joinDate}</span>
                <div className="flex items-center gap-2">
                  {bilibiliUrl && (
                    <a
                      href={bilibiliUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#FB7299]/10 hover:bg-[#FB7299]/20 text-[#FB7299] border border-[#FB7299]/30 transition-all font-bold text-[11px]"
                      title={`前往 ${member.name} 的哔哩哔哩个人空间`}
                    >
                      <span>B站主页</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  {member.socialLinks?.pixiv && (
                    <a
                      href={member.socialLinks.pixiv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all font-bold text-[11px]"
                      title="Pixiv 主页"
                    >
                      <span>Pixiv</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
