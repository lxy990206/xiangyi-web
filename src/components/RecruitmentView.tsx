import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  HelpCircle,
  Mail,
  FileText,
  AlertCircle,
  ClipboardList,
  ExternalLink,
  MousePointerClick,
  PenLine
} from 'lucide-react';
import { useData } from '../context/DataContext';

/** 飞书招募报名表单分享链接：报名数据实时收录至飞书多维表格，管理员可在飞书中查看与跟进 */
const FEISHU_FORM_URL = 'https://my.feishu.cn/share/base/shrcninVpjOJ0WvbL9JV8uMbyzg';

export const RecruitmentView: React.FC = () => {
  const { recruitmentPositions, teamInfo } = useData();
  const [selectedPosition, setSelectedPosition] = useState<string>(
    recruitmentPositions[0]?.id || ''
  );

  const activePos = recruitmentPositions.find((p) => p.id === selectedPosition) || recruitmentPositions[0];

  /** 部门编码 → 中文名称 */
  const deptLabel = (dept: string): string =>
    ({
      admin: '策划 / 运营',
      music: '作曲 / 编曲 / 混音',
      visual: '曲绘 / 插画',
      video: 'PV / 动态影像',
      tuning: '歌姬调校',
      lyrics: '作词 / 文案',
    }[dept] || dept);

  /** 跳转飞书报名表单（新标签页打开） */
  const openFeishuForm = () => {
    window.open(FEISHU_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  // 岗位数据为空时给出占位提示，避免空引用
  if (!activePos) {
    return (
      <div className="pb-12 animate-fade-in text-slate-100 flex flex-col items-center justify-center py-20 gap-3">
        <HelpCircle className="w-10 h-10 text-slate-600" />
        <p className="text-sm text-slate-400">当前暂无开放岗位，欢迎通过招募邮箱与我们保持联系</p>
        <p className="text-xs text-cyan-400 font-mono">{teamInfo.socials.email}</p>
      </div>
    );
  }

  /** 报名表单需要准备的材料清单（与飞书表单必填项保持一致） */
  const preparationItems = [
    { label: '创作者昵称 / 常用称呼', hint: '例：青羽 / Moonlight', required: true },
    { label: '应募岗位', hint: activePos?.title || '从开放岗位中选择', required: true },
    { label: '联系方式', hint: 'QQ / B站 UID / 邮箱 / 微信', required: true },
    { label: '代表作品链接', hint: 'B站 / 网易云 / Pixiv / 网盘等', required: true },
    { label: '自我介绍', hint: '喜欢的歌姬、擅长的工作流或创作经历（选填）', required: false },
  ];

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
                  onClick={() => setSelectedPosition(pos.id)}
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
                    <span className="text-xs text-slate-400 mt-0.5 block">{deptLabel(pos.department)}</span>
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

        {/* Right: Detailed Requirements & Application Entry (8 cols) */}
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
            {(activePos.preferredQualifications?.length ?? 0) > 0 && (
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

          {/* Feishu Application Form Entry Card */}
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-lg">
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 sm:p-5 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">在线报名 · 飞书报名表单</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    报名信息将实时收录至飞书多维表格，统筹策划组将在 3 个工作日内与您联系
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                官方渠道 · 信息保密
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* Application Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <MousePointerClick className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Step 1 · 选择岗位</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">在左侧列表了解岗位详情</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <PenLine className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Step 2 · 填写表单</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">在飞书表单中提交报名信息</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Step 3 · 等待联系</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">作品评估通过后专人对接</p>
                  </div>
                </div>
              </div>

              {/* Preparation Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <ClipboardList className="w-3.5 h-3.5 text-cyan-400" />
                  <span>报名前请准备以下信息</span>
                </div>
                <ul className="space-y-1.5">
                  {preparationItems.map((item) => (
                    <li key={item.label} className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="flex items-center gap-1.5 text-slate-300 min-w-0">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${item.required ? 'text-cyan-400' : 'text-slate-600'}`} />
                        <span className="truncate">{item.label}{item.required ? ' *' : ''}</span>
                      </span>
                      <span className="text-slate-500 shrink-0 hidden min-[420px]:inline">{item.hint}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-slate-500 flex items-start gap-1.5 pt-1 border-t border-slate-800/70">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-px text-slate-500" />
                  <span>带 * 为必填项；相依团队尊重原创版权，所有作品在发布前严格保密。</span>
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={openFeishuForm}
                className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <ExternalLink className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="truncate">前往飞书报名表单</span>
                <span className="hidden min-[420px]:inline truncate">· 应募「{activePos.title}」</span>
              </button>
              <p className="text-center text-[11px] text-slate-500">
                点击后将为您打开飞书在线表单（无需安装飞书，微信 / 浏览器均可填写），
                也可通过招募邮箱 <span className="text-cyan-400 font-mono">{teamInfo.socials.email}</span> 直接投递
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
