import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Paintbrush, 
  Film, 
  Mic2, 
  Music, 
  CheckCircle2, 
  Send, 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const RecruitmentView: React.FC = () => {
  const { recruitmentPositions, teamInfo } = useData();
  const [selectedPosition, setSelectedPosition] = useState<string>(
    recruitmentPositions[0]?.id || ''
  );
  const [formData, setFormData] = useState({
    name: '',
    role: recruitmentPositions[0]?.title || '',
    contact: '',
    contactType: 'QQ',
    portfolioUrl: '',
    intro: '',
    agreed: true
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activePos = recruitmentPositions.find((p) => p.id === selectedPosition) || recruitmentPositions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim() || !formData.portfolioUrl.trim()) {
      alert('请完整填写您的昵称、联系方式及作品链接！');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in text-slate-100">
      {/* 1. Header with Urgent Badge */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-slate-900 border border-red-500/30 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-black bg-red-500 text-white">
                  春季招募中
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  招募中心 · 加入相依创作团队
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                【公告重点：诚招曲绘师、PV师！】为爱发电，相依同行。期待与你共谱动人乐章。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">招募邮箱：</span>
            <span className="font-mono text-cyan-300 font-semibold">{teamInfo.socials.email}</span>
          </div>
        </div>
      </div>

      {/* 2. Position Tabs & Detailed Requirement Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Position Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            开放招募岗位
          </div>

          <div className="space-y-2.5">
            {recruitmentPositions.map((pos) => {
              const isSelected = selectedPosition === pos.id;
              return (
                <div
                  key={pos.id}
                  onClick={() => {
                    setSelectedPosition(pos.id);
                    setFormData((prev) => ({ ...prev, role: pos.title }));
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{pos.title}</span>
                    </div>
                    <span className="text-xs text-slate-400 mt-0.5 block">{pos.department}</span>
                  </div>

                  {pos.isUrgent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                      急招
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Circle Benefits Callout */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>社团提供之支持</span>
            </h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px] leading-relaxed">
              <li>B站官方联合投稿 & 全网音乐平台宣发挂名</li>
              <li>实体专辑周边版税分成与专属特典礼包</li>
              <li>提供专业编曲分轨、高质量原画分层支持</li>
              <li>温馨互助的同好技术研讨氛围</li>
            </ul>
          </div>
        </div>

        {/* Right: Detailed Requirements & Interactive Application Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Position Requirements Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{activePos.title}</h3>
                  {activePos.isUrgent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
                      急招职位
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{activePos.description}</p>
              </div>
            </div>

            {/* Requirements list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                【基本要求】
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activePos.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preferred qualifications */}
            {activePos.preferredQualifications.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  【加分项】
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activePos.preferredQualifications.map((pref, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{pref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Interactive Audition / Application Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">在线投递 / 申请表单</h3>
              </div>
              <span className="text-[11px] text-slate-400">
                提交后社团负责人将在3个工作日内与您联系
              </span>
            </div>

            {isSubmitted ? (
              <div className="p-8 text-center space-y-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">投递成功！感谢你对相依团队的关注！</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  我们已经收到您的应募信息（申请岗位：<span className="text-cyan-300 font-bold">{formData.role}</span>）。统筹策划组将认真评估您的作品 Demo，并通过您留下的联系方式与您取得联系。
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      role: activePos.title,
                      contact: '',
                      contactType: 'QQ',
                      portfolioUrl: '',
                      intro: '',
                      agreed: true
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  继续提交另一份申请
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">创作者昵称 / 常用称呼 *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例：青羽 / Moonlight"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">应募岗位 *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-cyan-400 transition-colors"
                    >
                      {recruitmentPositions.map((p) => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="font-semibold text-slate-300">联系方式类型</label>
                    <select
                      value={formData.contactType}
                      onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-hidden focus:border-cyan-400"
                    >
                      <option value="QQ">QQ 号码</option>
                      <option value="Bilibili">B站 UID / 主页</option>
                      <option value="Email">电子邮箱 Email</option>
                      <option value="Wechat">微信 WeChat</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-300">具体联系号码 / 账号 *</label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="例：QQ号 123456789 或 邮箱"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Portfolio / Demo Link */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">
                    代表作品链接 (B站 / 网易云 / Pixiv / Lofter / 百度网盘等) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://... 请附上作品集或公开作品链接"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                  />
                </div>

                {/* Intro / Note */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">自我介绍 / 创作风格 / 期望</label>
                  <textarea
                    rows={3}
                    value={formData.intro}
                    onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                    placeholder="简单聊聊你喜欢的歌姬、擅长的工作流或创作经历吧..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                    相依团队尊重原创版权，所有作品在发布前严格保密。
                  </span>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer hover:scale-102"
                  >
                    <Send className="w-4 h-4" />
                    <span>提交应募申请</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
