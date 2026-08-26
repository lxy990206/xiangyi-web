import React from 'react';
import { Info, Sparkles, Heart, Clock, ShieldCheck, HelpCircle, Users, ExternalLink, Mail } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AboutView: React.FC = () => {
  const { teamInfo } = useData();
  const milestones = teamInfo.milestones || [];
  const faqs = teamInfo.faqs || [];

  return (
    <div className="space-y-8 pb-12 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              关于相依团队 (About Xiangyi)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              社团发展历程 · 创作理念 · 问答与合作咨询
            </p>
          </div>
        </div>
      </div>

      {/* Slogan & Origin Story */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Heart className="w-4 h-4 text-red-400" />
            <span>社团理念：{teamInfo.slogan}</span>
          </div>

          <h3 className="text-xl font-bold text-white">
            “以旋律筑梦，用歌声定格每一个动人心魄的瞬间。”
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            相依团队（Xiangyi Team）由一群对洛天依、乐正绫、星尘、言和等中文虚拟歌姬怀揣热忱的年轻创作者发起。我们涵盖了作词、作曲、编曲、歌姬调校、曲绘插画、PV动画与混音母带全流程制作。
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            在信息洪流的时代，我们依然相信纯粹的旋律拥有抚慰心灵的力量。每一首新曲，都是社团成员无数个夜晚对音轨、咬字与画面的反复打磨。
          </p>
        </div>

        {/* Info card */}
        <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white">社团基本档案</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">社团名称</span>
                <span className="font-semibold text-white">{teamInfo.name}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">成立年份</span>
                <span className="font-mono text-cyan-300">{teamInfo.foundedDate}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">主要领域</span>
                <span>Vocaloid原创同人企划</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">B站官号</span>
                <span className="text-[#FB7299] font-medium">{teamInfo.socials.bilibiliName}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300">
            官方联络邮箱：<span className="font-mono font-bold block text-white mt-0.5">{teamInfo.socials.email}</span>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>社团发展里程碑</span>
        </h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative flex items-start gap-4 pl-1">
              <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shrink-0 z-10 shadow-md">
                {idx + 1}
              </div>
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{m.title}</h4>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">{m.year}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <span>常见疑问 (FAQ)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-cyan-300">Q: {faq.q}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">A: {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
