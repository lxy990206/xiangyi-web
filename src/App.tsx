import React, { useState, useEffect } from 'react';
import { Menu, X, Music2, Sparkles } from 'lucide-react';
import { NavTab, Song } from './types';
import { GlobalHeader } from './components/GlobalHeader';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { SinglesView } from './components/SinglesView';
import { AlbumsView } from './components/AlbumsView';
import { CollaborationsView } from './components/CollaborationsView';
import { MembersView } from './components/MembersView';
import { RecruitmentView } from './components/RecruitmentView';
import { AboutView } from './components/AboutView';
import { AdminView } from './components/AdminView';
import { BilibiliPlayerModal } from './components/BilibiliPlayerModal';
import { QQGroupModal } from './components/QQGroupModal';
import { LyricsModal } from './components/LyricsModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { audioEngine } from './utils/audioSynthesizer';
import { DataProvider, useData } from './context/DataContext';

function AppContent() {
  const { songs } = useData();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Active song for video modal
  const [selectedVideoSong, setSelectedVideoSong] = useState<Song | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Active song for lyrics modal
  const [selectedLyricsSong, setSelectedLyricsSong] = useState<Song | null>(null);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState(false);

  // QQ group modal
  const [isQQModalOpen, setIsQQModalOpen] = useState(false);

  // Persistent audio playback state
  const [currentAudioSong, setCurrentAudioSong] = useState<Song | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioBarVisible, setIsAudioBarVisible] = useState(false);

  // Connect Audio Engine state
  useEffect(() => {
    audioEngine.setCallback((isPlaying, songId) => {
      setIsAudioPlaying(isPlaying);
      if (isPlaying && songId) {
        const found = songs.find((s) => s.id === songId);
        if (found) {
          setCurrentAudioSong(found);
          setIsAudioBarVisible(true);
        }
      }
    });
  }, [songs]);

  const handlePlaySongPreview = (song: Song) => {
    if (isAudioPlaying && currentAudioSong?.id === song.id) {
      audioEngine.stop();
      setIsAudioPlaying(false);
    } else {
      setCurrentAudioSong(song);
      setIsAudioBarVisible(true);
      audioEngine.playSongPreview(song.id, song.genre, song.audioUrl);
    }
  };

  const handleToggleGlobalAudio = () => {
    if (isAudioPlaying) {
      audioEngine.stop();
      setIsAudioPlaying(false);
    } else {
      const songToPlay = currentAudioSong || songs[0];
      if (songToPlay) {
        handlePlaySongPreview(songToPlay);
      }
    }
  };

  const handleOpenVideoModal = (song: Song) => {
    setSelectedVideoSong(song);
    setIsVideoModalOpen(true);
  };

  const handleOpenLyrics = (song: Song) => {
    setSelectedLyricsSong(song);
    setIsLyricsModalOpen(true);
  };

  const handleOpenRecruitment = () => {
    setCurrentTab('recruitment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Global Header [网站页眉 - 全局置顶] */}
      <GlobalHeader
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleGlobalAudio}
        onOpenRecruitment={handleOpenRecruitment}
      />

      {/* Mobile Top App Bar (Hamburger menu button on mobile) */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-[45px] z-30">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{isMobileNavOpen ? '关闭菜单' : '导航菜单'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white">
            {currentTab === 'home' && '首页'}
            {currentTab === 'singles' && '原创单曲'}
            {currentTab === 'albums' && '企划专辑'}
            {currentTab === 'collaborations' && '合作项目'}
            {currentTab === 'members' && '成员名单'}
            {currentTab === 'recruitment' && '招募中心'}
            {currentTab === 'about' && '关于我们'}
            {currentTab === 'admin' && '维护后台'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>
      </div>

      {/* 2. Main Layout Container: [侧边导航栏 (固定)] + [右侧主体内容区 (动态加载/套娃容器)] */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenQQModal={() => setIsQQModalOpen(true)}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Right Main Content Area */}
        <main className={`
          flex-1 min-w-0 transition-all duration-300
          lg:ml-64 p-4 sm:p-6 lg:p-8
          ${isAudioBarVisible ? 'pb-24' : 'pb-12'}
        `}>
          {currentTab === 'home' && (
            <HomeView
              onNavigate={setCurrentTab}
              onSelectSong={handleOpenVideoModal}
              onOpenRecruitment={handleOpenRecruitment}
              onOpenQQModal={() => setIsQQModalOpen(true)}
              onPlaySongPreview={handlePlaySongPreview}
              playingSongId={isAudioPlaying ? currentAudioSong?.id || null : null}
            />
          )}

          {currentTab === 'singles' && (
            <SinglesView
              onSelectSongModal={handleOpenVideoModal}
              onPlaySongPreview={handlePlaySongPreview}
              onOpenLyrics={handleOpenLyrics}
              playingSongId={isAudioPlaying ? currentAudioSong?.id || null : null}
            />
          )}

          {currentTab === 'albums' && (
            <AlbumsView
              onSelectSongModal={handleOpenVideoModal}
            />
          )}

          {currentTab === 'collaborations' && (
            <CollaborationsView />
          )}

          {currentTab === 'members' && (
            <MembersView />
          )}

          {currentTab === 'recruitment' && (
            <RecruitmentView />
          )}

          {currentTab === 'about' && (
            <AboutView />
          )}

          {currentTab === 'admin' && (
            <AdminView onNavigate={setCurrentTab} />
          )}
        </main>
      </div>

      {/* 3. Persistent Audio Player Bar */}
      {isAudioBarVisible && currentAudioSong && (
        <AudioPlayerBar
          currentSong={currentAudioSong}
          isPlaying={isAudioPlaying}
          onTogglePlay={() => handlePlaySongPreview(currentAudioSong)}
          onSelectSong={(song) => handlePlaySongPreview(song)}
          onOpenVideoModal={handleOpenVideoModal}
          onOpenLyrics={handleOpenLyrics}
          onCloseBar={() => {
            audioEngine.stop();
            setIsAudioBarVisible(false);
          }}
        />
      )}

      {/* 4. Modals */}
      <BilibiliPlayerModal
        song={selectedVideoSong}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onPlaySynth={handlePlaySongPreview}
        isSynthPlaying={isAudioPlaying && selectedVideoSong?.id === currentAudioSong?.id}
      />

      <QQGroupModal
        isOpen={isQQModalOpen}
        onClose={() => setIsQQModalOpen(false)}
      />

      <LyricsModal
        song={selectedLyricsSong}
        isOpen={isLyricsModalOpen}
        onClose={() => setIsLyricsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
