import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  LogOut, 
  Settings, 
  Music, 
  Disc3, 
  Users, 
  Megaphone, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Eye,
  EyeOff,
  Radio,
  FileText,
  UserCheck,
  Layers,
  Globe,
  Compass,
  QrCode,
  HelpCircle,
  Clock,
  Link as LinkIcon,
  Share2,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { 
  NavTab, 
  Song, 
  Album, 
  Member, 
  Announcement, 
  RecruitmentPosition, 
  Collaboration,
  ToolLink,
  Milestone,
  FaqItem,
  Department 
} from '../types';

interface AdminViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const {
    teamInfo,
    songs,
    albums,
    collaborations,
    members,
    announcements,
    recruitmentPositions,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    changeAdminPassword,
    updateTeamInfo,
    addSong,
    updateSong,
    deleteSong,
    addAlbum,
    updateAlbum,
    deleteAlbum,
    addMember,
    updateMember,
    deleteMember,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addRecruitmentPosition,
    updateRecruitmentPosition,
    deleteRecruitmentPosition,
    addCollaboration,
    updateCollaboration,
    deleteCollaboration,
    exportDataJSON,
    importDataJSON,
    resetToDefaults
  } = useData();

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Admin Active Tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    'info' | 'songs' | 'albums' | 'collaborations' | 'members' | 'navigation_socials' | 'about_faq' | 'announcements' | 'recruitment' | 'security'
  >('info');

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Editing modals/states
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  const [editingCollab, setEditingCollab] = useState<Collaboration | null>(null);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);

  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);

  const [editingRec, setEditingRec] = useState<RecruitmentPosition | null>(null);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);

  const [editingTool, setEditingTool] = useState<ToolLink | null>(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);

  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Import JSON Modal
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const res = adminLogin(password, username);
    if (res.success) {
      setLoginSuccess(res.message);
      showToast('登录成功！已进入维护管理模式');
    } else {
      setLoginError(res.message);
    }
  };

  // Handle Password Change
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast('两次输入的新密码不一致');
      return;
    }
    const res = changeAdminPassword(oldPass, newPass);
    if (res.success) {
      showToast(res.message);
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      showToast(`修改失败: ${res.message}`);
    }
  };

  // Handle Export Backup
  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xiangyi_site_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('备份文件已成功导出并下载！');
  };

  // Handle Import
  const handleImportSubmit = () => {
    if (!importJsonText.trim()) {
      showToast('请输入有效的 JSON 配置内容');
      return;
    }
    const res = importDataJSON(importJsonText);
    if (res.success) {
      showToast(res.message);
      setIsImportModalOpen(false);
      setImportJsonText('');
    } else {
      showToast(`导入失败: ${res.message}`);
    }
  };

  // Handle Reset Defaults
  const handleReset = () => {
    if (window.confirm('⚠️ 确定要重置所有页面配置为出厂默认数据吗？此操作不可逆！')) {
      resetToDefaults();
      showToast('已恢复出厂初始数据！');
    }
  };

  // -------------------------------------------------------------
  // 1. UN-AUTHENTICATED LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 text-slate-100 animate-fade-in relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 mb-6 relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-cyan-950 border border-cyan-500/40 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            相依社 · 页面维护控制台
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            站点内部管理与配置后台 · 需要管理员身份凭证
          </p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              管理员账号
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-sm text-slate-200"
              placeholder="请输入管理员账号 (默认: admin)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex justify-between">
              <span>管理授权密码</span>
              <span className="text-[11px] text-cyan-400/80">初始: xiangyi2025</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-sm text-slate-200"
                placeholder="请输入管理密码"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>进入维护后台</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-cyan-400 transition-colors"
          >
            ← 返回网站首页
          </button>
          <span className="font-mono text-[11px] text-slate-400">相依社内部系统 v2.5</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-200 text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Control Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                网站页面维护控制台
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                已登录管理员
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              在此直接编辑社团信息、单曲、专辑、成员与公告，更改将实时保存并全站生效。
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="导出整站数据配置为 JSON 备份文件"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>导出备份</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="从 JSON 备份恢复数据"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>导入数据</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="恢复所有数据为初始默认值"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span>重置默认</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>退出后台</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs within Admin */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'info', label: '社团基本信息', icon: Settings, count: null },
          { id: 'songs', label: '单曲管理', icon: Music, count: songs.length },
          { id: 'albums', label: '专辑管理', icon: Disc3, count: albums.length },
          { id: 'collaborations', label: '合作项目', icon: Layers, count: collaborations.length },
          { id: 'members', label: '成员名单', icon: Users, count: members.length },
          { id: 'navigation_socials', label: '导航与社媒工具', icon: Compass, count: (teamInfo.toolLinks || []).length },
          { id: 'about_faq', label: '历程与问答FAQ', icon: HelpCircle, count: ((teamInfo.milestones || []).length + (teamInfo.faqs || []).length) },
          { id: 'announcements', label: '公告管理', icon: Megaphone, count: announcements.length },
          { id: 'recruitment', label: '招募岗位', icon: Sparkles, count: recruitmentPositions.length },
          { id: 'security', label: '安全与密码', icon: KeyRound, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all border ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. 社团信息管理 (含 QQ群二维码与主页数据) */}
      {/* ========================================================= */}
      {activeAdminTab === 'info' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">社团主数据与联系方式</h2>
              <p className="text-xs text-slate-400">修改后将即时更新首页、侧边栏、QQ弹窗、关于我们与页脚</p>
            </div>
            <button
              onClick={() => showToast('社团信息已自动保存生效！')}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>保存更新</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">社团名称 (中文)</label>
              <input
                type="text"
                value={teamInfo.name}
                onChange={(e) => updateTeamInfo({ ...teamInfo, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">社团英文名 / 全称</label>
              <input
                type="text"
                value={teamInfo.nameEn}
                onChange={(e) => updateTeamInfo({ ...teamInfo, nameEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">主标 Slogan</label>
              <input
                type="text"
                value={teamInfo.slogan}
                onChange={(e) => updateTeamInfo({ ...teamInfo, slogan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">副标宣传语 Sub-Slogan</label>
              <input
                type="text"
                value={teamInfo.subSlogan}
                onChange={(e) => updateTeamInfo({ ...teamInfo, subSlogan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">社团详细介绍</label>
              <textarea
                rows={3}
                value={teamInfo.description}
                onChange={(e) => updateTeamInfo({ ...teamInfo, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">成立日期</label>
              <input
                type="text"
                value={teamInfo.foundedDate}
                onChange={(e) => updateTeamInfo({ ...teamInfo, foundedDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">官方联络邮箱</label>
              <input
                type="text"
                value={teamInfo.socials.email}
                onChange={(e) => updateTeamInfo({
                  ...teamInfo,
                  socials: { ...teamInfo.socials, email: e.target.value, contactEmail: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* QQ群及二维码配置区块 */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>QQ群矩阵与二维码图片管理（支持自动上传）</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                支持直接选择图片文件自动上传或拖拽上传
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. 同好交流群配置 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-bold text-xs text-white">官方同好交流群</h4>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    同好乐迷
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">交流 QQ 群号</label>
                  <input
                    type="text"
                    value={teamInfo.socials.qqGroup}
                    onChange={(e) => updateTeamInfo({
                      ...teamInfo,
                      socials: { ...teamInfo.socials, qqGroup: e.target.value }
                    })}
                    placeholder="如: 829471052"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                  />
                </div>

                {/* 自动上传二维码区域 */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-400">
                    群二维码图片 (自动上传 / 链接 / 标准码)
                  </label>
                  
                  {/* 拖拽与上传控件 */}
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const dataUrl = ev.target?.result as string;
                          if (dataUrl) {
                            updateTeamInfo({
                              ...teamInfo,
                              socials: { ...teamInfo.socials, qqGroupQrCode: dataUrl }
                            });
                            showToast('交流群二维码已自动上传并保存！');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="p-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-900/60 flex flex-col items-center justify-center gap-2 text-center transition-colors group cursor-pointer relative"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const dataUrl = ev.target?.result as string;
                            if (dataUrl) {
                              updateTeamInfo({
                                ...teamInfo,
                                socials: { ...teamInfo.socials, qqGroupQrCode: dataUrl }
                              });
                              showToast('交流群二维码已自动上传并保存！');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                        e.target.value = '';
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="点击上传本地图片二维码"
                    />
                    <Upload className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <div className="text-[11px]">
                      <span className="text-cyan-300 font-semibold underline underline-offset-2">点击选择文件</span>
                      <span className="text-slate-400"> 或将图片拖拽至此处</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">支持 PNG / JPG / WebP，自动读取保存</p>
                    </div>
                  </div>

                  {/* 辅助按钮与手动输入 */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const autoUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qm.qq.com/cgi-bin/qm/qr?k=${teamInfo.socials.qqGroup}`;
                        updateTeamInfo({
                          ...teamInfo,
                          socials: { ...teamInfo.socials, qqGroupQrCode: autoUrl }
                        });
                        showToast('已生成标准交流群二维码！');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-cyan-400 border border-slate-700 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>生成标准码</span>
                    </button>

                    {teamInfo.socials.qqGroupQrCode && (
                      <button
                        type="button"
                        onClick={() => {
                          updateTeamInfo({
                            ...teamInfo,
                            socials: { ...teamInfo.socials, qqGroupQrCode: '' }
                          });
                          showToast('已清除交流群二维码');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-red-400 border border-slate-700 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>清除图片</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={teamInfo.socials.qqGroupQrCode || ''}
                    onChange={(e) => updateTeamInfo({
                      ...teamInfo,
                      socials: { ...teamInfo.socials, qqGroupQrCode: e.target.value }
                    })}
                    placeholder="或直接输入图片 URL 链接..."
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono"
                  />
                </div>

                {/* 预览 */}
                {teamInfo.socials.qqGroupQrCode && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <img 
                      src={teamInfo.socials.qqGroupQrCode} 
                      alt="交流群二维码预览"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg bg-white p-1 object-contain border border-slate-700 shrink-0" 
                    />
                    <div className="text-[11px] text-slate-300">
                      <span className="font-semibold text-white">已配置交流群二维码</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">前台弹窗将实时优先展示此二维码</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. 团队沟通群配置 (原考核招募群) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-bold text-xs text-white">官方团队沟通群</h4>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    团队协作与沟通
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">团队沟通 QQ 群号</label>
                  <input
                    type="text"
                    value={teamInfo.socials.qqRecruitGroup}
                    onChange={(e) => updateTeamInfo({
                      ...teamInfo,
                      socials: { ...teamInfo.socials, qqRecruitGroup: e.target.value }
                    })}
                    placeholder="如: 942187653"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                  />
                </div>

                {/* 自动上传团队沟通群二维码区域 */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-400">
                    团队沟通群二维码 (自动上传 / 链接 / 标准码)
                  </label>
                  
                  {/* 拖拽与上传控件 */}
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const dataUrl = ev.target?.result as string;
                          if (dataUrl) {
                            updateTeamInfo({
                              ...teamInfo,
                              socials: { ...teamInfo.socials, qqRecruitGroupQrCode: dataUrl }
                            });
                            showToast('团队沟通群二维码已自动上传并保存！');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="p-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-900/60 flex flex-col items-center justify-center gap-2 text-center transition-colors group cursor-pointer relative"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const dataUrl = ev.target?.result as string;
                            if (dataUrl) {
                              updateTeamInfo({
                                ...teamInfo,
                                socials: { ...teamInfo.socials, qqRecruitGroupQrCode: dataUrl }
                              });
                              showToast('团队沟通群二维码已自动上传并保存！');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                        e.target.value = '';
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="点击上传本地图片二维码"
                    />
                    <Upload className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <div className="text-[11px]">
                      <span className="text-cyan-300 font-semibold underline underline-offset-2">点击选择文件</span>
                      <span className="text-slate-400"> 或将图片拖拽至此处</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">支持 PNG / JPG / WebP，自动读取保存</p>
                    </div>
                  </div>

                  {/* 辅助按钮与手动输入 */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const autoUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qm.qq.com/cgi-bin/qm/qr?k=${teamInfo.socials.qqRecruitGroup}`;
                        updateTeamInfo({
                          ...teamInfo,
                          socials: { ...teamInfo.socials, qqRecruitGroupQrCode: autoUrl }
                        });
                        showToast('已生成标准团队沟通群二维码！');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-cyan-400 border border-slate-700 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>生成标准码</span>
                    </button>

                    {teamInfo.socials.qqRecruitGroupQrCode && (
                      <button
                        type="button"
                        onClick={() => {
                          updateTeamInfo({
                            ...teamInfo,
                            socials: { ...teamInfo.socials, qqRecruitGroupQrCode: '' }
                          });
                          showToast('已清除团队沟通群二维码');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-red-400 border border-slate-700 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>清除图片</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={teamInfo.socials.qqRecruitGroupQrCode || ''}
                    onChange={(e) => updateTeamInfo({
                      ...teamInfo,
                      socials: { ...teamInfo.socials, qqRecruitGroupQrCode: e.target.value }
                    })}
                    placeholder="或直接输入图片 URL 链接..."
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono"
                  />
                </div>

                {/* 预览 */}
                {teamInfo.socials.qqRecruitGroupQrCode && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <img 
                      src={teamInfo.socials.qqRecruitGroupQrCode} 
                      alt="团队沟通群二维码预览"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg bg-white p-1 object-contain border border-slate-700 shrink-0" 
                    />
                    <div className="text-[11px] text-slate-300">
                      <span className="font-semibold text-white">已配置团队沟通群二维码</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">提供给团队制作组成员与日常沟通协作</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 统计指标配置 */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">首页社团数据面板</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">作品总数</label>
                <input
                  type="text"
                  value={teamInfo.stats?.worksCount || '10+'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    stats: { ...teamInfo.stats, worksCount: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">全网总播放</label>
                <input
                  type="text"
                  value={teamInfo.stats?.playCount || '15,000+'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    stats: { ...teamInfo.stats, playCount: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">社团成员数</label>
                <input
                  type="text"
                  value={teamInfo.stats?.membersCount || '23'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    stats: { ...teamInfo.stats, membersCount: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">企划专辑数</label>
                <input
                  type="text"
                  value={teamInfo.stats?.albumsCount || '2'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    stats: { ...teamInfo.stats, albumsCount: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">全网听众/粉丝</label>
                <input
                  type="text"
                  value={teamInfo.stats?.fanCount || '2,000+'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    stats: { ...teamInfo.stats, fanCount: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. 单曲管理 */}
      {/* ========================================================= */}
      {activeAdminTab === 'songs' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">原创单曲库维护</h2>
              <p className="text-xs text-slate-400">管理歌曲、BV号、Staff人员名录与歌词</p>
            </div>
            <button
              onClick={() => {
                setEditingSong({
                  id: `song-${Date.now()}`,
                  title: '新单曲名称',
                  subtitle: 'New Single',
                  singer: '洛天依',
                  singerColor: '#66CCFF',
                  genre: '流行摇滚',
                  releaseDate: new Date().toISOString().slice(0, 10),
                  duration: '03:45',
                  coverUrl: 'http://i0.hdslb.com/bfs/archive/73645de19b43761fb45ef74201301107cd04ee8d.jpg',
                  bilibiliBvid: 'BV1aoZKBQEQt',
                  playCount: '1.2万',
                  danmakuCount: '320',
                  staff: {
                    composition: '相依团队',
                    arrangement: '相依团队',
                    lyrics: '相依团队',
                    tuning: '相依团队',
                    illustration: '相依团队',
                    pv: '相依团队',
                    mixing: '相依团队'
                  },
                  description: '歌曲故事与意境介绍...',
                  lyrics: '【歌词文本】\n在时光的缝隙里轻轻呼唤...',
                  isFeatured: false
                });
                setIsSongModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400"
            >
              <Plus className="w-4 h-4" />
              <span>添加新曲目</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex gap-3.5 items-start justify-between"
              >
                <div className="flex gap-3 min-w-0">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-sm text-white truncate">{song.title}</h4>
                      {song.isFeatured && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">精选</span>
                      )}
                    </div>
                    <p className="text-xs text-cyan-400 font-mono">BV: {song.bilibiliBvid}</p>
                    <p className="text-[11px] text-slate-400">歌手: {song.singer} · 曲风: {song.genre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingSong({ ...song });
                      setIsSongModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700"
                    title="编辑此曲目"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`确定要删除单曲《${song.title}》吗？`)) {
                        deleteSong(song.id);
                        showToast(`已删除单曲《${song.title}》`);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700"
                    title="删除单曲"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. 专辑管理 */}
      {/* ========================================================= */}
      {activeAdminTab === 'albums' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">企划专辑管理</h2>
              <p className="text-xs text-slate-400">管理专辑信息、主题色、曲目列表与试听预告</p>
            </div>
            <button
              onClick={() => {
                setEditingAlbum({
                  id: `album-${Date.now()}`,
                  title: '新专辑名称',
                  subTitle: 'New Album Concept',
                  releaseYear: '2026.06',
                  coverUrl: 'http://i0.hdslb.com/bfs/archive/73645de19b43761fb45ef74201301107cd04ee8d.jpg',
                  description: '专辑企划概念说明...',
                  themeColor: '#66CCFF',
                  bilibiliBvid: 'BV1aoZKBQEQt',
                  platforms: {
                    bilibili: 'https://space.bilibili.com/3707032479730267',
                    netease: 'https://music.163.com'
                  },
                  tracks: [
                    { trackNumber: 1, title: '主打曲目', singer: '洛天依', duration: '03:50', composer: '相依社', lyricist: '相依社', isOriginal: true }
                  ]
                });
                setIsAlbumModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400"
            >
              <Plus className="w-4 h-4" />
              <span>新建专辑</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {albums.map((album) => (
              <div
                key={album.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex gap-3.5 items-start justify-between"
              >
                <div className="flex gap-3 min-w-0">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <h4 className="font-bold text-sm text-white truncate">{album.title}</h4>
                    <p className="text-xs text-slate-400">{album.subTitle}</p>
                    <p className="text-[11px] text-cyan-400">发行: {album.releaseYear} · 收录 {album.tracks.length} 首曲目</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingAlbum({ ...album });
                      setIsAlbumModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700"
                    title="编辑此专辑"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`确定要删除专辑《${album.title}》吗？`)) {
                        deleteAlbum(album.id);
                        showToast(`已删除专辑《${album.title}》`);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700"
                    title="删除专辑"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. 合作项目管理 */}
      {/* ========================================================= */}
      {activeAdminTab === 'collaborations' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">跨社团合作企划与共创项目维护</h2>
              <p className="text-xs text-slate-400">管理与友社联合制作的音乐企划、活动展会共创项目及B站链接</p>
            </div>
            <button
              onClick={() => {
                setEditingCollab({
                  id: `collab-${Date.now()}`,
                  title: '新合作企划名称',
                  partner: '合作社团 / 创作者',
                  year: new Date().getFullYear().toString(),
                  type: 'cross-circle',
                  coverUrl: 'http://i0.hdslb.com/bfs/archive/73645de19b43761fb45ef74201301107cd04ee8d.jpg',
                  description: '合作项目企划背景与内容介绍...',
                  bilibiliBvid: 'BV1aoZKBQEQt',
                  role: '编曲与调校支持',
                  tags: ['跨社合作', '原创单曲']
                });
                setIsCollabModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>添加合作项目</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborations.map((collab) => (
              <div
                key={collab.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex gap-3.5 items-start justify-between"
              >
                <div className="flex gap-3 min-w-0">
                  <img
                    src={collab.coverUrl}
                    alt={collab.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                        {collab.year}
                      </span>
                      <h4 className="font-bold text-sm text-white truncate">{collab.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 truncate">合作方: <span className="text-slate-200">{collab.partner}</span></p>
                    <p className="text-[11px] text-cyan-400 truncate">社团职责: {collab.role}</p>
                    {collab.bilibiliBvid && (
                      <p className="text-[10px] text-slate-400 font-mono">BV号: {collab.bilibiliBvid}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingCollab({ ...collab });
                      setIsCollabModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 cursor-pointer"
                    title="编辑此合作企划"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`确定要删除合作企划《${collab.title}》吗？`)) {
                        deleteCollaboration(collab.id);
                        showToast(`已删除合作项目《${collab.title}》`);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 cursor-pointer"
                    title="删除合作企划"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. 成员名单管理 */}
      {/* ========================================================= */}
      {activeAdminTab === 'members' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">社团成员名录维护</h2>
              <p className="text-xs text-slate-400">添加社员、修改职务、更新哔哩哔哩个人空间跳转链接</p>
            </div>
            <button
              onClick={() => {
                setEditingMember({
                  id: `mem-${Date.now()}`,
                  name: '新成员昵称',
                  avatar: 'https://i0.hdslb.com/bfs/face/85c4b79d5cf79b658cadd029ddd76dd42773ef2a.jpg',
                  role: '编曲 / 调校',
                  department: 'music',
                  badge: '主创社员',
                  bio: '个人简介与专长描述...',
                  representativeWorks: ['《瞬时爱恋》'],
                  socialLinks: {
                    bilibili: 'https://space.bilibili.com/3546570760915314'
                  },
                  joinDate: '2026.01'
                });
                setIsMemberModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400"
            >
              <Plus className="w-4 h-4" />
              <span>添加新成员</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{member.name}</h4>
                    <p className="text-xs text-cyan-400 truncate">{member.role}</p>
                    {member.socialLinks?.bilibili && (
                      <a
                        href={member.socialLinks.bilibili}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#FB7299] hover:underline flex items-center gap-0.5 truncate"
                      >
                        <span>B站空间</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingMember({ ...member });
                      setIsMemberModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700"
                    title="编辑此成员"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`确定要移除成员【${member.name}】吗？`)) {
                        deleteMember(member.id);
                        showToast(`已移除成员【${member.name}】`);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700"
                    title="删除成员"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. 导航栏与工具社媒管理 */}
      {/* ========================================================= */}
      {activeAdminTab === 'navigation_socials' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">导航栏自定义、社媒矩阵与创作者工具管理</h2>
              <p className="text-xs text-slate-400">个性化整站菜单导航名称、更新社媒外链与社团推荐工具箱</p>
            </div>
            <button
              onClick={() => showToast('导航与社媒设置已保存生效！')}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>保存更新</span>
            </button>
          </div>

          {/* Module 1: Navigation Labels */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>站点侧边栏导航名称自定义</span>
            </h3>
            <p className="text-xs text-slate-400">
              自定义每个主要页面的导航标签文本，如将“作品单曲”个性化为“原创歌曲”、“社团成员”改为“Staff名录”等。
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">首页导航名称</label>
                <input
                  type="text"
                  value={teamInfo.navigationConfig?.home || '首页'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    navigationConfig: {
                      ...(teamInfo.navigationConfig || {
                        home: '首页',
                        songs: '单曲',
                        albums: '专辑',
                        collaborations: '合作',
                        members: '成员',
                        recruitment: '招募',
                        about: '关于',
                        tools: '工具'
                      }),
                      home: e.target.value
                    }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">单曲导航名称</label>
                <input
                  type="text"
                  value={teamInfo.navigationConfig?.songs || '作品单曲'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    navigationConfig: {
                      ...(teamInfo.navigationConfig || {
                        home: '首页',
                        songs: '单曲',
                        albums: '专辑',
                        collaborations: '合作',
                        members: '成员',
                        recruitment: '招募',
                        about: '关于',
                        tools: '工具'
                      }),
                      songs: e.target.value
                    }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">专辑导航名称</label>
                <input
                  type="text"
                  value={teamInfo.navigationConfig?.albums || '企划专辑'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    navigationConfig: {
                      ...(teamInfo.navigationConfig || {
                        home: '首页',
                        songs: '单曲',
                        albums: '专辑',
                        collaborations: '合作',
                        members: '成员',
                        recruitment: '招募',
                        about: '关于',
                        tools: '工具'
                      }),
                      albums: e.target.value
                    }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">合作导航名称</label>
                <input
                  type="text"
                  value={teamInfo.navigationConfig?.collaborations || '跨社合作'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    navigationConfig: {
                      ...(teamInfo.navigationConfig || {
                        home: '首页',
                        songs: '单曲',
                        albums: '专辑',
                        collaborations: '合作',
                        members: '成员',
                        recruitment: '招募',
                        about: '关于',
                        tools: '工具'
                      }),
                      collaborations: e.target.value
                    }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">成员导航名称</label>
                <input
                  type="text"
                  value={teamInfo.navigationConfig?.members || '社团成员'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    navigationConfig: {
                      ...(teamInfo.navigationConfig || {
                        home: '首页',
                        songs: '单曲',
                        albums: '专辑',
                        collaborations: '合作',
                        members: '成员',
                        recruitment: '招募',
                        about: '关于',
                        tools: '工具'
                      }),
                      members: e.target.value
                    }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">招募导航名称</label>
                <input
                  type="text"
                  value={teamInfo.navigationConfig?.recruitment || '加入社团'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    navigationConfig: {
                      ...(teamInfo.navigationConfig || {
                        home: '首页',
                        songs: '单曲',
                        albums: '专辑',
                        collaborations: '合作',
                        members: '成员',
                        recruitment: '招募',
                        about: '关于',
                        tools: '工具'
                      }),
                      recruitment: e.target.value
                    }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">关于导航名称</label>
                <input
                  type="text"
                  value={teamInfo.navigationConfig?.about || '关于我们'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    navigationConfig: {
                      ...(teamInfo.navigationConfig || {
                        home: '首页',
                        songs: '单曲',
                        albums: '专辑',
                        collaborations: '合作',
                        members: '成员',
                        recruitment: '招募',
                        about: '关于',
                        tools: '工具'
                      }),
                      about: e.target.value
                    }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">工具导航名称</label>
                <input
                  type="text"
                  value={teamInfo.navigationConfig?.tools || '创作工具'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    navigationConfig: {
                      ...(teamInfo.navigationConfig || {
                        home: '首页',
                        songs: '单曲',
                        albums: '专辑',
                        collaborations: '合作',
                        members: '成员',
                        recruitment: '招募',
                        about: '关于',
                        tools: '工具'
                      }),
                      tools: e.target.value
                    }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Module 2: Social Media matrix */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>全网社媒与官方平台矩阵外链</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">哔哩哔哩官方号主页 URL</label>
                <input
                  type="text"
                  value={teamInfo.socials.bilibili}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    socials: { ...teamInfo.socials, bilibili: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">B站官方号 UID / 名称</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={teamInfo.socials.bilibiliUid || '3707032479730267'}
                    onChange={(e) => updateTeamInfo({
                      ...teamInfo,
                      socials: { ...teamInfo.socials, bilibiliUid: e.target.value }
                    })}
                    placeholder="UID"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                  />
                  <input
                    type="text"
                    value={teamInfo.socials.bilibiliName || '相依社Official'}
                    onChange={(e) => updateTeamInfo({
                      ...teamInfo,
                      socials: { ...teamInfo.socials, bilibiliName: e.target.value }
                    })}
                    placeholder="官号昵称"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">团长 (light闪电ing) B站空间与MID</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={teamInfo.socials.leaderMid || '3546570760915314'}
                    onChange={(e) => updateTeamInfo({
                      ...teamInfo,
                      socials: { ...teamInfo.socials, leaderMid: e.target.value }
                    })}
                    placeholder="团长 MID"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                  />
                  <input
                    type="text"
                    value={teamInfo.socials.leaderName || 'light闪电ing'}
                    onChange={(e) => updateTeamInfo({
                      ...teamInfo,
                      socials: { ...teamInfo.socials, leaderName: e.target.value }
                    })}
                    placeholder="团长昵称"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">网易云音乐主页 / 音乐人链接</label>
                <input
                  type="text"
                  value={teamInfo.socials.netease || 'https://music.163.com'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    socials: { ...teamInfo.socials, netease: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">官方微博主页链接</label>
                <input
                  type="text"
                  value={teamInfo.socials.weibo || 'https://weibo.com'}
                  onChange={(e) => updateTeamInfo({
                    ...teamInfo,
                    socials: { ...teamInfo.socials, weibo: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Module 3: ToolLinks Management */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>创作工具与同好导航箱管理 (共 {(teamInfo.toolLinks || []).length} 个条目)</span>
                </h3>
                <p className="text-xs text-slate-400">维护展示在关于/工具页面的实用站点、歌姬调校、曲绘资源等推荐链接</p>
              </div>

              <button
                onClick={() => {
                  setEditingTool({
                    id: `tool-${Date.now()}`,
                    title: '新创作工具',
                    category: '歌姬制作',
                    description: '工具主要功能与使用场景介绍...',
                    url: 'https://',
                    icon: 'wrench',
                    isFeatured: true
                  });
                  setIsToolModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加工具条目</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {(teamInfo.toolLinks || []).map((tool) => (
                <div
                  key={tool.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                        {tool.category}
                      </span>
                      <h4 className="font-bold text-xs text-white truncate">{tool.title}</h4>
                      {tool.isFeatured && (
                        <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold">推荐</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{tool.description}</p>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 truncate font-mono"
                    >
                      <span>{tool.url}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingTool({ ...tool });
                        setIsToolModalOpen(true);
                      }}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`确定删除工具【${tool.title}】吗？`)) {
                          const updated = (teamInfo.toolLinks || []).filter((t) => t.id !== tool.id);
                          updateTeamInfo({ ...teamInfo, toolLinks: updated });
                          showToast(`已删除工具【${tool.title}】`);
                        }
                      }}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. 社团历程与问答FAQ管理 */}
      {/* ========================================================= */}
      {activeAdminTab === 'about_faq' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">社团发展里程碑与常见问答FAQ</h2>
              <p className="text-xs text-slate-400">实时维护“关于我们”界面的大事记时间轴与新手/听众常见问题</p>
            </div>
            <button
              onClick={() => showToast('历程与FAQ已保存！')}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>保存更新</span>
            </button>
          </div>

          {/* Section 1: Milestones */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>社团大事记 / 发展历程时间轴 (共 {(teamInfo.milestones || []).length} 个节点)</span>
                </h3>
                <p className="text-xs text-slate-400">记录社团创立、首张专辑、百万播放或重大展会节点</p>
              </div>

              <button
                onClick={() => {
                  setEditingMilestone({
                    id: `ms-${Date.now()}`,
                    year: '2026',
                    title: '重要里程碑事件',
                    description: '详细描述社团在该时期达成的成果与创作活动...'
                  });
                  setIsMilestoneModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增历程节点</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {(teamInfo.milestones || []).map((ms) => (
                <div
                  key={ms.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {ms.year}
                      </span>
                      <h4 className="font-bold text-sm text-white">{ms.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300">{ms.description}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingMilestone({ ...ms });
                        setIsMilestoneModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`确定删除历程【${ms.title}】吗？`)) {
                          const updated = (teamInfo.milestones || []).filter((m) => m.id !== ms.id);
                          updateTeamInfo({ ...teamInfo, milestones: updated });
                          showToast(`已删除历程【${ms.title}】`);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: FAQ */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>常见问题 Q&A (共 {(teamInfo.faqs || []).length} 条问答)</span>
                </h3>
                <p className="text-xs text-slate-400">帮助新手了解二创授权、商用规则、如何加入与投稿合作</p>
              </div>

              <button
                onClick={() => {
                  setEditingFaq({
                    id: `faq-${Date.now()}`,
                    question: '常见问题题目？',
                    answer: '详细解答内容说明...',
                    category: '社团相关'
                  });
                  setIsFaqModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加问答条目</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {(teamInfo.faqs || []).map((faq) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                        {faq.category || '常见问题'}
                      </span>
                      <h4 className="font-bold text-xs text-white">Q: {faq.question}</h4>
                    </div>
                    <p className="text-xs text-slate-300 pl-4 border-l-2 border-slate-800">A: {faq.answer}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingFaq({ ...faq });
                        setIsFaqModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`确定删除此条Q&A吗？`)) {
                          const updated = (teamInfo.faqs || []).filter((f) => f.id !== faq.id);
                          updateTeamInfo({ ...teamInfo, faqs: updated });
                          showToast('已删除该Q&A条目');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. 公告管理 */}
      {/* ========================================================= */}
      {activeAdminTab === 'announcements' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">官方公告与滚动动态发布</h2>
              <p className="text-xs text-slate-400">第一条公告将作为顶部常驻跑马灯显示</p>
            </div>
            <button
              onClick={() => {
                setEditingAnn({
                  id: `ann-${Date.now()}`,
                  date: new Date().toISOString().slice(0, 10),
                  title: '新公告标题',
                  tag: '通知',
                  content: '公告详细内容...',
                  linkTab: 'home'
                });
                setIsAnnModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400"
            >
              <Plus className="w-4 h-4" />
              <span>发布新公告</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann, idx) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {ann.tag}
                    </span>
                    <h4 className="font-bold text-sm text-white">{ann.title}</h4>
                    {idx === 0 && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                        顶部展示中
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{ann.content}</p>
                  <p className="text-[11px] text-slate-400 font-mono">发布日期: {ann.date}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingAnn({ ...ann });
                      setIsAnnModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`确定要删除此条公告吗？`)) {
                        deleteAnnouncement(ann.id);
                        showToast('已删除该公告');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. 招募岗位管理 */}
      {/* ========================================================= */}
      {activeAdminTab === 'recruitment' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">招募中心岗位发布</h2>
              <p className="text-xs text-slate-400">发布社团招募职位、要求及福利待遇</p>
            </div>
            <button
              onClick={() => {
                setEditingRec({
                  id: `rec-${Date.now()}`,
                  title: '新岗位名称',
                  department: 'visual',
                  isUrgent: true,
                  spots: '1-2名',
                  requirements: ['具备相关技能与作品积累', '热爱洛天依与歌姬创作'],
                  responsibilities: ['参与社团企划制作'],
                  perks: ['官方Staff署名', '社团内部交流支持']
                });
                setIsRecModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400"
            >
              <Plus className="w-4 h-4" />
              <span>新建招募岗位</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recruitmentPositions.map((pos) => (
              <div
                key={pos.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{pos.title}</h4>
                      {pos.isUrgent && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                          急招
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-cyan-400">{pos.spots}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    要求: {pos.requirements.join('；')}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setEditingRec({ ...pos });
                      setIsRecModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 text-xs flex items-center gap-1 px-2.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>编辑</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`确定删除招募岗位【${pos.title}】吗？`)) {
                        deleteRecruitmentPosition(pos.id);
                        showToast(`已删除岗位【${pos.title}】`);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 text-xs flex items-center gap-1 px-2.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>删除</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. 安全与密码设置 */}
      {/* ========================================================= */}
      {activeAdminTab === 'security' && (
        <div className="max-w-xl p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-cyan-400" />
              <span>修改管理员授权密码</span>
            </h2>
            <p className="text-xs text-slate-400">修改后下次登录请使用新密码</p>
          </div>

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">当前原密码</label>
              <input
                type="password"
                required
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="请输入当前管理密码"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">新管理密码 (至少6位)</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="请输入新密码"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">确认新管理密码</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="再次输入新密码"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>更新管理密码</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: Song Edit Modal */}
      {/* ========================================================= */}
      {isSongModalOpen && editingSong && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>编辑单曲信息</span>
              <button onClick={() => setIsSongModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">歌曲标题</label>
                <input
                  type="text"
                  value={editingSong.title}
                  onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">B站 BV号</label>
                <input
                  type="text"
                  value={editingSong.bilibiliBvid}
                  onChange={(e) => setEditingSong({ ...editingSong, bilibiliBvid: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">主唱歌姬</label>
                <input
                  type="text"
                  value={editingSong.singer}
                  onChange={(e) => setEditingSong({ ...editingSong, singer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">音乐风格</label>
                <input
                  type="text"
                  value={editingSong.genre}
                  onChange={(e) => setEditingSong({ ...editingSong, genre: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">封面图片 URL (防盗链已自动配置)</label>
                <input
                  type="text"
                  value={editingSong.coverUrl}
                  onChange={(e) => setEditingSong({ ...editingSong, coverUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">作曲 Staff</label>
                <input
                  type="text"
                  value={editingSong.staff.composition}
                  onChange={(e) => setEditingSong({
                    ...editingSong,
                    staff: { ...editingSong.staff, composition: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">作词 Staff</label>
                <input
                  type="text"
                  value={editingSong.staff.lyrics}
                  onChange={(e) => setEditingSong({
                    ...editingSong,
                    staff: { ...editingSong.staff, lyrics: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">调校 Staff</label>
                <input
                  type="text"
                  value={editingSong.staff.tuning}
                  onChange={(e) => setEditingSong({
                    ...editingSong,
                    staff: { ...editingSong.staff, tuning: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">曲绘 Staff</label>
                <input
                  type="text"
                  value={editingSong.staff.illustration}
                  onChange={(e) => setEditingSong({
                    ...editingSong,
                    staff: { ...editingSong.staff, illustration: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">PV Staff</label>
                <input
                  type="text"
                  value={editingSong.staff.pv}
                  onChange={(e) => setEditingSong({
                    ...editingSong,
                    staff: { ...editingSong.staff, pv: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">混音 Staff</label>
                <input
                  type="text"
                  value={editingSong.staff.mixing}
                  onChange={(e) => setEditingSong({
                    ...editingSong,
                    staff: { ...editingSong.staff, mixing: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">歌曲意境与介绍</label>
                <textarea
                  rows={2}
                  value={editingSong.description}
                  onChange={(e) => setEditingSong({ ...editingSong, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">完整歌词 (LRC 或文本)</label>
                <textarea
                  rows={4}
                  value={editingSong.lyrics}
                  onChange={(e) => setEditingSong({ ...editingSong, lyrics: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={editingSong.isFeatured}
                  onChange={(e) => setEditingSong({ ...editingSong, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500"
                />
                <label htmlFor="isFeatured" className="text-slate-200 font-semibold cursor-pointer">
                  设为首页顶部精选轮播作品
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsSongModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const exists = songs.some((s) => s.id === editingSong.id);
                  if (exists) {
                    updateSong(editingSong.id, editingSong);
                    showToast(`已更新单曲《${editingSong.title}》`);
                  } else {
                    addSong(editingSong);
                    showToast(`已新增单曲《${editingSong.title}》`);
                  }
                  setIsSongModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                保存单曲
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: Member Edit Modal */}
      {/* ========================================================= */}
      {isMemberModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>编辑成员信息</span>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">成员名称 / 昵称</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">哔哩哔哩个人空间链接 (点击成员名直达)</label>
                <input
                  type="text"
                  value={editingMember.socialLinks?.bilibili || ''}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    socialLinks: { ...editingMember.socialLinks, bilibili: e.target.value }
                  })}
                  placeholder="https://space.bilibili.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">头像图片 URL</label>
                <input
                  type="text"
                  value={editingMember.avatar}
                  onChange={(e) => setEditingMember({ ...editingMember, avatar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">部门分类</label>
                  <select
                    value={editingMember.department}
                    onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value as Department })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value="admin">策划 / 运营</option>
                    <option value="music">作曲 / 编曲 / 混音</option>
                    <option value="visual">曲绘 / 插画</option>
                    <option value="video">PV / 动态影像</option>
                    <option value="tuning">歌姬调校</option>
                    <option value="lyrics">作词 / 文案</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">身份标签 Badge</label>
                  <input
                    type="text"
                    value={editingMember.badge || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">具体职责 / 职务</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">个人简介 Bio</label>
                <textarea
                  rows={2}
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const exists = members.some((m) => m.id === editingMember.id);
                  if (exists) {
                    updateMember(editingMember.id, editingMember);
                    showToast(`已更新成员【${editingMember.name}】信息`);
                  } else {
                    addMember(editingMember);
                    showToast(`已添加成员【${editingMember.name}】`);
                  }
                  setIsMemberModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                保存成员
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: Album Edit Modal */}
      {/* ========================================================= */}
      {isAlbumModalOpen && editingAlbum && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>编辑专辑信息</span>
              <button onClick={() => setIsAlbumModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">专辑主标题</label>
                <input
                  type="text"
                  value={editingAlbum.title}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">专辑英文/副标</label>
                <input
                  type="text"
                  value={editingAlbum.subTitle}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, subTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">发行年份</label>
                  <input
                    type="text"
                    value={editingAlbum.releaseYear}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, releaseYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">专辑类型</label>
                  <select
                    value={editingAlbum.type}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value="EP">EP 小型概念专辑</option>
                    <option value="Full">Full 正式完整大碟</option>
                    <option value="Single">Single 概念特刊/单曲集</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">封面图片 URL</label>
                <input
                  type="text"
                  value={editingAlbum.coverUrl}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, coverUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">主题色调 (Hex，如 #66CCFF)</label>
                <input
                  type="text"
                  value={editingAlbum.themeColor || '#66CCFF'}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, themeColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">B站 试听/PV 视频 BV号</label>
                <input
                  type="text"
                  value={editingAlbum.bilibiliBvid || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, bilibiliBvid: e.target.value })}
                  placeholder="BV..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">专辑详细概念文案</label>
                <textarea
                  rows={3}
                  value={editingAlbum.description}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsAlbumModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const exists = albums.some((a) => a.id === editingAlbum.id);
                  if (exists) {
                    updateAlbum(editingAlbum.id, editingAlbum);
                    showToast(`已更新专辑《${editingAlbum.title}》`);
                  } else {
                    addAlbum(editingAlbum);
                    showToast(`已新增专辑《${editingAlbum.title}》`);
                  }
                  setIsAlbumModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                保存专辑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: Collaboration Edit Modal */}
      {/* ========================================================= */}
      {isCollabModalOpen && editingCollab && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>编辑合作项目企划</span>
              <button onClick={() => setIsCollabModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">合作项目标题</label>
                <input
                  type="text"
                  value={editingCollab.title}
                  onChange={(e) => setEditingCollab({ ...editingCollab, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">合作社团 / 创作者</label>
                  <input
                    type="text"
                    value={editingCollab.partner}
                    onChange={(e) => setEditingCollab({ ...editingCollab, partner: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">年份 / 期间</label>
                  <input
                    type="text"
                    value={editingCollab.year}
                    onChange={(e) => setEditingCollab({ ...editingCollab, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">合作类型</label>
                  <select
                    value={editingCollab.type}
                    onChange={(e) => setEditingCollab({ ...editingCollab, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value="cross-circle">跨社团原创音乐企划</option>
                    <option value="event">展会 / 活动联合展出</option>
                    <option value="single">单曲联合客串制作</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">相依社担任角色</label>
                  <input
                    type="text"
                    value={editingCollab.role}
                    onChange={(e) => setEditingCollab({ ...editingCollab, role: e.target.value })}
                    placeholder="如：编曲与调校支持"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">B站 投稿视频 BV号</label>
                <input
                  type="text"
                  value={editingCollab.bilibiliBvid || ''}
                  onChange={(e) => setEditingCollab({ ...editingCollab, bilibiliBvid: e.target.value })}
                  placeholder="BV..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">封面图片 URL</label>
                <input
                  type="text"
                  value={editingCollab.coverUrl}
                  onChange={(e) => setEditingCollab({ ...editingCollab, coverUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">企划简介与背景</label>
                <textarea
                  rows={3}
                  value={editingCollab.description}
                  onChange={(e) => setEditingCollab({ ...editingCollab, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsCollabModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const exists = collaborations.some((c) => c.id === editingCollab.id);
                  if (exists) {
                    updateCollaboration(editingCollab.id, editingCollab);
                    showToast(`已更新合作企划《${editingCollab.title}》`);
                  } else {
                    addCollaboration(editingCollab);
                    showToast(`已新增合作企划《${editingCollab.title}》`);
                  }
                  setIsCollabModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                保存合作企划
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: Announcement Edit Modal */}
      {/* ========================================================= */}
      {isAnnModalOpen && editingAnn && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>编辑官方公告</span>
              <button onClick={() => setIsAnnModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">公告标题</label>
                <input
                  type="text"
                  value={editingAnn.title}
                  onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">标签分类</label>
                  <select
                    value={editingAnn.tag}
                    onChange={(e) => setEditingAnn({ ...editingAnn, tag: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value="通知">通知</option>
                    <option value="首发">首发</option>
                    <option value="企划">企划</option>
                    <option value="招募">招募</option>
                    <option value="活动">活动</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">发布日期</label>
                  <input
                    type="date"
                    value={editingAnn.date}
                    onChange={(e) => setEditingAnn({ ...editingAnn, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">公告详细正文</label>
                <textarea
                  rows={3}
                  value={editingAnn.content}
                  onChange={(e) => setEditingAnn({ ...editingAnn, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const exists = announcements.some((a) => a.id === editingAnn.id);
                  if (exists) {
                    updateAnnouncement(editingAnn.id, editingAnn);
                    showToast(`已更新公告【${editingAnn.title}】`);
                  } else {
                    addAnnouncement(editingAnn);
                    showToast(`已发布公告【${editingAnn.title}】`);
                  }
                  setIsAnnModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                保存公告
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: Recruitment Edit Modal */}
      {/* ========================================================= */}
      {isRecModalOpen && editingRec && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>编辑招募岗位</span>
              <button onClick={() => setIsRecModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">岗位名称</label>
                <input
                  type="text"
                  value={editingRec.title}
                  onChange={(e) => setEditingRec({ ...editingRec, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">所属部门</label>
                  <select
                    value={editingRec.department}
                    onChange={(e) => setEditingRec({ ...editingRec, department: e.target.value as Department })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value="music">音乐 / 作曲 / 编曲 / 混音</option>
                    <option value="visual">视觉 / 曲绘 / 插画</option>
                    <option value="video">影像 / PV制作</option>
                    <option value="tuning">歌姬调校</option>
                    <option value="lyrics">作词 / 企划文案</option>
                    <option value="admin">运营 / 宣发</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">招募名额</label>
                  <input
                    type="text"
                    value={editingRec.spots}
                    onChange={(e) => setEditingRec({ ...editingRec, spots: e.target.value })}
                    placeholder="如：1-2名"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">任职要求 (每行一条)</label>
                <textarea
                  rows={3}
                  value={editingRec.requirements.join('\n')}
                  onChange={(e) => setEditingRec({
                    ...editingRec,
                    requirements: e.target.value.split('\n').filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">主要职责 (每行一条)</label>
                <textarea
                  rows={2}
                  value={editingRec.responsibilities.join('\n')}
                  onChange={(e) => setEditingRec({
                    ...editingRec,
                    responsibilities: e.target.value.split('\n').filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">福利与支持 (每行一条)</label>
                <textarea
                  rows={2}
                  value={editingRec.perks.join('\n')}
                  onChange={(e) => setEditingRec({
                    ...editingRec,
                    perks: e.target.value.split('\n').filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isUrgent"
                  checked={editingRec.isUrgent}
                  onChange={(e) => setEditingRec({ ...editingRec, isUrgent: e.target.checked })}
                  className="w-4 h-4 accent-red-500"
                />
                <label htmlFor="isUrgent" className="text-slate-200 font-semibold cursor-pointer">
                  标记为【急招】岗位
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsRecModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const exists = recruitmentPositions.some((r) => r.id === editingRec.id);
                  if (exists) {
                    updateRecruitmentPosition(editingRec.id, editingRec);
                    showToast(`已更新招募岗位【${editingRec.title}】`);
                  } else {
                    addRecruitmentPosition(editingRec);
                    showToast(`已新增招募岗位【${editingRec.title}】`);
                  }
                  setIsRecModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                保存岗位
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: ToolLink Edit Modal */}
      {/* ========================================================= */}
      {isToolModalOpen && editingTool && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>编辑创作者推荐工具</span>
              <button onClick={() => setIsToolModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">工具名称</label>
                <input
                  type="text"
                  value={editingTool.title}
                  onChange={(e) => setEditingTool({ ...editingTool, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">分类标签</label>
                  <input
                    type="text"
                    value={editingTool.category}
                    onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                    placeholder="如：歌姬调校、宿主DAW"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">图标标识</label>
                  <input
                    type="text"
                    value={editingTool.icon || 'wrench'}
                    onChange={(e) => setEditingTool({ ...editingTool, icon: e.target.value })}
                    placeholder="wrench, music..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">网址链接 URL</label>
                <input
                  type="text"
                  value={editingTool.url}
                  onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">工具描述 / 功能介绍</label>
                <textarea
                  rows={2}
                  value={editingTool.description}
                  onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isToolFeatured"
                  checked={editingTool.isFeatured}
                  onChange={(e) => setEditingTool({ ...editingTool, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500"
                />
                <label htmlFor="isToolFeatured" className="text-slate-200 font-semibold cursor-pointer">
                  标记为【社团推荐】工具
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsToolModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const currentTools = teamInfo.toolLinks || [];
                  const exists = currentTools.some((t) => t.id === editingTool.id);
                  const updated = exists
                    ? currentTools.map((t) => (t.id === editingTool.id ? editingTool : t))
                    : [...currentTools, editingTool];
                  updateTeamInfo({ ...teamInfo, toolLinks: updated });
                  showToast(`已保存工具【${editingTool.title}】`);
                  setIsToolModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                保存工具
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: Milestone Edit Modal */}
      {/* ========================================================= */}
      {isMilestoneModalOpen && editingMilestone && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>编辑社团历程节点</span>
              <button onClick={() => setIsMilestoneModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">年份 / 期间</label>
                  <input
                    type="text"
                    value={editingMilestone.year}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                    placeholder="2026.01"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">大事件标题</label>
                  <input
                    type="text"
                    value={editingMilestone.title}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">详细描述</label>
                <textarea
                  rows={3}
                  value={editingMilestone.description}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsMilestoneModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const currentList = teamInfo.milestones || [];
                  const exists = currentList.some((m) => m.id === editingMilestone.id);
                  const updated = exists
                    ? currentList.map((m) => (m.id === editingMilestone.id ? editingMilestone : m))
                    : [...currentList, editingMilestone];
                  updateTeamInfo({ ...teamInfo, milestones: updated });
                  showToast(`已保存历程节点【${editingMilestone.title}】`);
                  setIsMilestoneModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                保存节点
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: FAQ Edit Modal */}
      {/* ========================================================= */}
      {isFaqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>编辑常见问题 (Q&A)</span>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">问题分类</label>
                <input
                  type="text"
                  value={editingFaq.category || '常见问题'}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">问题 Question (Q)</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">解答 Answer (A)</label>
                <textarea
                  rows={3}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const currentFaqs = teamInfo.faqs || [];
                  const exists = currentFaqs.some((f) => f.id === editingFaq.id);
                  const updated = exists
                    ? currentFaqs.map((f) => (f.id === editingFaq.id ? editingFaq : f))
                    : [...currentFaqs, editingFaq];
                  updateTeamInfo({ ...teamInfo, faqs: updated });
                  showToast('已保存该Q&A问答条目');
                  setIsFaqModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                保存问答
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS: Import Backup JSON */}
      {/* ========================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>导入 JSON 配置备份</span>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </h3>

            <p className="text-xs text-slate-400">
              粘贴导出的整站 JSON 数据，导入后将覆盖当前存储的歌曲、成员、公告与信息。
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="在此粘贴 JSON 文本内容..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                确认恢复导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
