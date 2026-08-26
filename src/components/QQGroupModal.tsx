import React, { useState, useRef } from 'react';
import { 
  X, 
  MessageCircle, 
  Copy, 
  Check, 
  QrCode, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  Download, 
  RefreshCw, 
  Image as ImageIcon,
  MessagesSquare
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface QQGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QQGroupModal: React.FC<QQGroupModalProps> = ({ isOpen, onClose }) => {
  const { teamInfo, updateTeamInfo } = useData();
  const [activeGroupType, setActiveGroupType] = useState<'fan' | 'team'>('fan');
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentGroupNumber = activeGroupType === 'fan' 
    ? teamInfo.socials.qqGroup 
    : teamInfo.socials.qqRecruitGroup;

  const currentQrCode = activeGroupType === 'fan'
    ? (teamInfo.socials.qqGroupQrCode || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qm.qq.com/cgi-bin/qm/qr?k=${teamInfo.socials.qqGroup}`)
    : (teamInfo.socials.qqRecruitGroupQrCode || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qm.qq.com/cgi-bin/qm/qr?k=${teamInfo.socials.qqRecruitGroup}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentGroupNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showToastMsg = (msg: string) => {
    setUploadToast(msg);
    setTimeout(() => setUploadToast(null), 2800);
  };

  // 处理图片文件读取并自动上传
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToastMsg('请上传有效的图片文件 (PNG/JPG/WebP/GIF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        if (activeGroupType === 'fan') {
          updateTeamInfo({
            ...teamInfo,
            socials: { ...teamInfo.socials, qqGroupQrCode: dataUrl }
          });
          showToastMsg('交流群二维码已自动上传并保存！');
        } else {
          updateTeamInfo({
            ...teamInfo,
            socials: { ...teamInfo.socials, qqRecruitGroupQrCode: dataUrl }
          });
          showToastMsg('团队沟通群二维码已自动上传并保存！');
        }
        setImgError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // 重置 input 以允许再次选择相同文件
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleGenerateStandardQr = () => {
    const autoUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qm.qq.com/cgi-bin/qm/qr?k=${currentGroupNumber}`;
    if (activeGroupType === 'fan') {
      updateTeamInfo({
        ...teamInfo,
        socials: { ...teamInfo.socials, qqGroupQrCode: autoUrl }
      });
    } else {
      updateTeamInfo({
        ...teamInfo,
        socials: { ...teamInfo.socials, qqRecruitGroupQrCode: autoUrl }
      });
    }
    setImgError(false);
    showToastMsg('已自动生成标准 QQ 加群二维码！');
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = currentQrCode;
    link.download = `相依团队-${activeGroupType === 'fan' ? '同好交流群' : '团队沟通群'}-二维码.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMsg('正在下载二维码图片...');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Notification */}
        {uploadToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-60 bg-cyan-500 text-slate-950 px-4 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 animate-bounce">
            <Check className="w-3.5 h-3.5" />
            <span>{uploadToast}</span>
          </div>
        )}

        {/* Hidden File Input for Auto Upload */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/*"
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">相依团队 · 官方QQ群矩阵</h3>
              <p className="text-[11px] text-slate-400">官方同好交流与团队日常沟通协作</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Group Selector Tab */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setActiveGroupType('fan');
              setImgError(false);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeGroupType === 'fan'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>同好交流群</span>
          </button>

          <button
            onClick={() => {
              setActiveGroupType('team');
              setImgError(false);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeGroupType === 'team'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessagesSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>团队沟通群</span>
          </button>
        </div>

        {/* Group Number & Copy Card */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              {activeGroupType === 'fan' ? '官方同好交流 QQ 群号' : '相依团队沟通 QQ 群号'}
            </span>
            <span className="text-2xl font-black font-mono text-cyan-400 tracking-wider">
              {currentGroupNumber}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>复制群号</span>
              </>
            )}
          </button>
        </div>

        {/* QR Code graphic / Drag & Drop Upload Zone */}
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`p-4 rounded-2xl bg-slate-950 border transition-all flex flex-col items-center justify-center text-center space-y-3 relative ${
            isDragging 
              ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]' 
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-cyan-950/90 rounded-2xl flex flex-col items-center justify-center z-10 text-cyan-300">
              <Upload className="w-8 h-8 animate-bounce mb-2" />
              <p className="text-xs font-bold">松开鼠标即可自动上传并保存二维码！</p>
            </div>
          )}

          {/* QR Code Container */}
          <div className="w-44 h-44 rounded-2xl bg-white p-2.5 flex flex-col items-center justify-center relative overflow-hidden shadow-lg shadow-cyan-500/10 group">
            {!imgError && currentQrCode ? (
              <img
                src={currentQrCode}
                alt="QQ群二维码"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2 text-slate-300">
                <QrCode className="w-20 h-20 text-cyan-400 opacity-90" />
                <span className="text-[10px] font-mono text-cyan-300 font-bold mt-1">群号 {currentGroupNumber}</span>
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            <p className="text-xs text-slate-300 font-medium">
              手机 QQ 扫一扫或搜索群号 <span className="text-cyan-400 font-mono font-bold">{currentGroupNumber}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {activeGroupType === 'fan' ? '欢迎中V乐迷、同好交流闲聊与新曲讨论' : '相依团队成员交流、制作进度与企划协作沟通'}
            </p>
          </div>

          {/* Action Buttons: Auto Upload, Auto Generate, Download */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="选择本地图片文件，将自动读取并保存二维码"
            >
              <Upload className="w-3 h-3" />
              <span>自动上传图片</span>
            </button>

            <button
              onClick={handleGenerateStandardQr}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="根据当前填写的群号自动生成标准二维码"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              <span>生成标准码</span>
            </button>

            <button
              onClick={handleDownloadQr}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="下载保存二维码到本地"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span>保存到本地</span>
            </button>
          </div>
        </div>

        {/* Community Rules Note */}
        <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>入群守则与说明：</span>
          </div>
          <p className="leading-relaxed">
            {activeGroupType === 'fan' 
              ? '请友善交流，支持洛天依及中文虚拟歌姬文化二创讨论；严禁广告刷屏、引战及违法违规言论。'
              : '相依团队创作者与制作组沟通群。申请加入时请备注【社团职务/应聘职位+昵称】，进群后请配合团队工作安排与日常协作。'}
          </p>
        </div>
      </div>
    </div>
  );
};

