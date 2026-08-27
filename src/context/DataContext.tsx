import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Song, 
  Album, 
  Member, 
  RecruitmentPosition, 
  Collaboration, 
  Announcement 
} from '../types';
import { 
  SONGS_DATA, 
  TEAM_INFO as DEFAULT_TEAM_INFO, 
  ALBUMS_DATA, 
  MEMBERS_DATA, 
  ANNOUNCEMENTS, 
  RECRUITMENT_POSITIONS, 
  COLLABORATIONS_DATA,
  TEAM_DATA_SYNCED_AT
} from '../data/teamData';

export type TeamInfoType = typeof DEFAULT_TEAM_INFO;

interface DataContextType {
  teamInfo: TeamInfoType;
  songs: Song[];
  albums: Album[];
  members: Member[];
  announcements: Announcement[];
  recruitmentPositions: RecruitmentPosition[];
  collaborations: Collaboration[];
  
  // Admin Auth
  isAdminAuthenticated: boolean;
  adminUsername: string;
  adminLogin: (password: string, username?: string) => { success: boolean; message: string };
  adminLogout: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };

  // Data Actions
  updateTeamInfo: (info: TeamInfoType) => void;
  addSong: (song: Song) => void;
  updateSong: (id: string, song: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  
  addAlbum: (album: Album) => void;
  updateAlbum: (id: string, album: Partial<Album>) => void;
  deleteAlbum: (id: string) => void;
  
  addMember: (member: Member) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  addAnnouncement: (ann: Announcement) => void;
  updateAnnouncement: (id: string, ann: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  
  addRecruitmentPosition: (pos: RecruitmentPosition) => void;
  updateRecruitmentPosition: (id: string, pos: Partial<RecruitmentPosition>) => void;
  deleteRecruitmentPosition: (id: string) => void;

  addCollaboration: (collab: Collaboration) => void;
  updateCollaboration: (id: string, collab: Partial<Collaboration>) => void;
  deleteCollaboration: (id: string) => void;

  // System actions
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => { success: boolean; message: string };
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'xiangyi_site_data_v2';
const ADMIN_AUTH_KEY = 'xiangyi_admin_session_v2';
const ADMIN_PASS_KEY = 'xiangyi_admin_password_v2';
// 缓存版本管理：记录本地数据所基于的同步版本 & 本地最后修改时间
const DATA_SYNCED_KEY = 'xiangyi_data_synced_at';
const DATA_MODIFIED_KEY = 'xiangyi_local_modified_at';

const DEFAULT_ADMIN_PASS = 'xiangyi2025';

const CODE_SYNCED_AT_MS = Date.parse(TEAM_DATA_SYNCED_AT) || 0;

/**
 * 缓存刷新策略：
 * - 代码内置默认数据版本（TEAM_DATA_SYNCED_AT，随部署更新）比本地缓存所基于的版本新
 *   且本地没有比其更新的未同步修改时 → 自动采用新部署数据，避免访客一直看到旧缓存；
 * - 本地在部署版本之后有修改（后台编辑未同步）→ 保留本地数据，防止丢失未同步修改。
 */
const shouldAdoptNewDefaults = (() => {
  let cached: boolean | null = null;
  return (): boolean => {
    if (cached !== null) return cached;
    try {
      const modifiedAt = Date.parse(localStorage.getItem(DATA_MODIFIED_KEY) || '') || 0;
      const syncedAt = Date.parse(localStorage.getItem(DATA_SYNCED_KEY) || '') || 0;
      if (modifiedAt > CODE_SYNCED_AT_MS) {
        // 本地有更新的未同步修改，保留本地
        cached = false;
        return false;
      }
      if (CODE_SYNCED_AT_MS > syncedAt) {
        // 首次访问或检测到新版部署数据 → 采用默认并记录版本
        localStorage.setItem(DATA_SYNCED_KEY, TEAM_DATA_SYNCED_AT);
        cached = true;
        return true;
      }
    } catch {
      cached = false;
      return false;
    }
    cached = false;
    return false;
  };
})();

/** 读取一份数据切片：部署版本更新时直接采用默认值，否则读取本地缓存 */
const loadDataSlice = <T,>(subKey: string, defaults: T): T => {
  if (!shouldAdoptNewDefaults()) {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${subKey}`);
      if (saved) return JSON.parse(saved) as T;
    } catch { /* 解析失败回退默认值 */ }
  }
  return defaults;
};

/** 标记本地数据被修改（用于区分"未同步的本地编辑"与"可直接覆盖的旧缓存"） */
const touchLocalModified = () => {
  try {
    localStorage.setItem(DATA_MODIFIED_KEY, new Date().toISOString());
  } catch { /* ignore */ }
};

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize data from localStorage or default
  const [teamInfo, setTeamInfo] = useState<TeamInfoType>(() => {
    const parsed = loadDataSlice<Partial<TeamInfoType> | null>('teamInfo', null);
    if (parsed) {
      return {
        ...DEFAULT_TEAM_INFO,
        ...parsed,
        stats: { ...DEFAULT_TEAM_INFO.stats, ...(parsed.stats || {}) },
        socials: { ...DEFAULT_TEAM_INFO.socials, ...(parsed.socials || {}) },
        navigationConfig: { ...DEFAULT_TEAM_INFO.navigationConfig, ...(parsed.navigationConfig || {}) },
        recruitmentBanner: { ...DEFAULT_TEAM_INFO.recruitmentBanner, ...(parsed.recruitmentBanner || {}) },
        milestones: parsed.milestones?.length ? parsed.milestones : DEFAULT_TEAM_INFO.milestones,
        faqs: parsed.faqs?.length ? parsed.faqs : DEFAULT_TEAM_INFO.faqs,
        toolLinks: parsed.toolLinks?.length ? parsed.toolLinks : DEFAULT_TEAM_INFO.toolLinks,
      };
    }
    return DEFAULT_TEAM_INFO;
  });

  const [songs, setSongs] = useState<Song[]>(() => loadDataSlice<Song[]>('songs', SONGS_DATA));

  const [albums, setAlbums] = useState<Album[]>(() => loadDataSlice<Album[]>('albums', ALBUMS_DATA));

  const [members, setMembers] = useState<Member[]>(() => loadDataSlice<Member[]>('members', MEMBERS_DATA));

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadDataSlice<Announcement[]>('announcements', ANNOUNCEMENTS));

  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPosition[]>(() => loadDataSlice<RecruitmentPosition[]>('recruitment', RECRUITMENT_POSITIONS));

  const [collaborations, setCollaborations] = useState<Collaboration[]>(() => loadDataSlice<Collaboration[]>('collaborations', COLLABORATIONS_DATA));

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const session = sessionStorage.getItem(ADMIN_AUTH_KEY);
      return session === 'true';
    } catch {
      return false;
    }
  });
  const [adminUsername, setAdminUsername] = useState<string>('相依社管理员');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_teamInfo`, JSON.stringify(teamInfo));
    } catch (e) {
      console.warn('Failed to save teamInfo', e);
    }
  }, [teamInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_songs`, JSON.stringify(songs));
    } catch (e) {
      console.warn('Failed to save songs', e);
    }
  }, [songs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_albums`, JSON.stringify(albums));
    } catch (e) {
      console.warn('Failed to save albums', e);
    }
  }, [albums]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
    } catch (e) {
      console.warn('Failed to save members', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
    } catch (e) {
      console.warn('Failed to save announcements', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_recruitment`, JSON.stringify(recruitmentPositions));
    } catch (e) {
      console.warn('Failed to save recruitment', e);
    }
  }, [recruitmentPositions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_collaborations`, JSON.stringify(collaborations));
    } catch (e) {
      console.warn('Failed to save collaborations', e);
    }
  }, [collaborations]);

  // 跨标签页实时同步：其他标签页修改数据时，本标签页立即刷新显示
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || !e.newValue || !e.key.startsWith(`${STORAGE_KEY}_`)) return;
      const subKey = e.key.slice(STORAGE_KEY.length + 1);
      try {
        const value = JSON.parse(e.newValue);
        if (subKey === 'teamInfo' && value) setTeamInfo((prev) => ({ ...prev, ...value }));
        else if (subKey === 'songs' && Array.isArray(value)) setSongs(value);
        else if (subKey === 'albums' && Array.isArray(value)) setAlbums(value);
        else if (subKey === 'members' && Array.isArray(value)) setMembers(value);
        else if (subKey === 'announcements' && Array.isArray(value)) setAnnouncements(value);
        else if (subKey === 'recruitment' && Array.isArray(value)) setRecruitmentPositions(value);
        else if (subKey === 'collaborations' && Array.isArray(value)) setCollaborations(value);
      } catch { /* 忽略无效数据 */ }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Auth Methods
  const getStoredPassword = () => {
    return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_ADMIN_PASS;
  };

  const adminLogin = (password: string, username = '相依社管理员') => {
    const validPass = getStoredPassword();
    if (password.trim() === validPass) {
      setIsAdminAuthenticated(true);
      setAdminUsername(username || '相依社管理员');
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch {}
      return { success: true, message: '管理员验证成功，欢迎进入维护后台！' };
    }
    return { success: false, message: '管理密码错误，无权访问维护后台。' };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {}
  };

  const changeAdminPassword = (oldPass: string, newPass: string) => {
    const currentPass = getStoredPassword();
    if (oldPass !== currentPass) {
      return { success: false, message: '原管理密码输入不正确' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, message: '新密码长度至少需要 6 个字符' };
    }
    try {
      localStorage.setItem(ADMIN_PASS_KEY, newPass);
      return { success: true, message: '管理密码修改成功，请牢记新密码！' };
    } catch {
      return { success: false, message: '密码保存失败，请检查浏览器存储权限' };
    }
  };

  // CRUD Methods（所有修改均标记本地修改时间，用于缓存版本判定）
  const updateTeamInfo = (info: TeamInfoType) => {
    touchLocalModified();
    setTeamInfo(info);
  };

  const addSong = (song: Song) => {
    touchLocalModified();
    setSongs((prev) => [song, ...prev]);
  };

  const updateSong = (id: string, updated: Partial<Song>) => {
    touchLocalModified();
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSong = (id: string) => {
    touchLocalModified();
    setSongs((prev) => prev.filter((s) => s.id !== id));
  };

  const addAlbum = (album: Album) => {
    touchLocalModified();
    setAlbums((prev) => [album, ...prev]);
  };

  const updateAlbum = (id: string, updated: Partial<Album>) => {
    touchLocalModified();
    setAlbums((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAlbum = (id: string) => {
    touchLocalModified();
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  };

  const addMember = (member: Member) => {
    touchLocalModified();
    setMembers((prev) => [...prev, member]);
    // update stats count
    setTeamInfo((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        membersCount: String(members.length + 1)
      }
    }));
  };

  const updateMember = (id: string, updated: Partial<Member>) => {
    touchLocalModified();
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
  };

  const deleteMember = (id: string) => {
    touchLocalModified();
    setMembers((prev) => {
      const next = prev.filter((m) => m.id !== id);
      setTeamInfo((prevInfo) => ({
        ...prevInfo,
        stats: {
          ...prevInfo.stats,
          membersCount: String(next.length)
        }
      }));
      return next;
    });
  };

  const addAnnouncement = (ann: Announcement) => {
    touchLocalModified();
    setAnnouncements((prev) => [ann, ...prev]);
  };

  const updateAnnouncement = (id: string, updated: Partial<Announcement>) => {
    touchLocalModified();
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAnnouncement = (id: string) => {
    touchLocalModified();
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const addRecruitmentPosition = (pos: RecruitmentPosition) => {
    touchLocalModified();
    setRecruitmentPositions((prev) => [...prev, pos]);
  };

  const updateRecruitmentPosition = (id: string, updated: Partial<RecruitmentPosition>) => {
    touchLocalModified();
    setRecruitmentPositions((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteRecruitmentPosition = (id: string) => {
    touchLocalModified();
    setRecruitmentPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const addCollaboration = (collab: Collaboration) => {
    touchLocalModified();
    setCollaborations((prev) => [collab, ...prev]);
  };

  const updateCollaboration = (id: string, updated: Partial<Collaboration>) => {
    touchLocalModified();
    setCollaborations((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCollaboration = (id: string) => {
    touchLocalModified();
    setCollaborations((prev) => prev.filter((c) => c.id !== id));
  };

  // Backup & Restore
  const exportDataJSON = () => {
    const backupObj = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      teamInfo,
      songs,
      albums,
      members,
      announcements,
      recruitmentPositions,
      collaborations,
    };
    return JSON.stringify(backupObj, null, 2);
  };

  const importDataJSON = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'JSON 数据格式无效' };
      }
      touchLocalModified();
      if (data.teamInfo) setTeamInfo(data.teamInfo);
      if (Array.isArray(data.songs)) setSongs(data.songs);
      if (Array.isArray(data.albums)) setAlbums(data.albums);
      if (Array.isArray(data.members)) setMembers(data.members);
      if (Array.isArray(data.announcements)) setAnnouncements(data.announcements);
      if (Array.isArray(data.recruitmentPositions)) setRecruitmentPositions(data.recruitmentPositions);
      if (Array.isArray(data.collaborations)) setCollaborations(data.collaborations);

      return { success: true, message: '整站配置数据恢复导入成功！' };
    } catch (e: any) {
      return { success: false, message: `解析失败: ${e?.message || '未知错误'}` };
    }
  };

  const resetToDefaults = () => {
    setTeamInfo(DEFAULT_TEAM_INFO);
    setSongs(SONGS_DATA);
    setAlbums(ALBUMS_DATA);
    setMembers(MEMBERS_DATA);
    setAnnouncements(ANNOUNCEMENTS);
    setRecruitmentPositions(RECRUITMENT_POSITIONS);
    setCollaborations(COLLABORATIONS_DATA);

    try {
      localStorage.removeItem(`${STORAGE_KEY}_teamInfo`);
      localStorage.removeItem(`${STORAGE_KEY}_songs`);
      localStorage.removeItem(`${STORAGE_KEY}_albums`);
      localStorage.removeItem(`${STORAGE_KEY}_members`);
      localStorage.removeItem(`${STORAGE_KEY}_announcements`);
      localStorage.removeItem(`${STORAGE_KEY}_recruitment`);
      localStorage.removeItem(`${STORAGE_KEY}_collaborations`);
      // 重置后本地与代码默认版本一致：清除本地修改标记，登记当前代码版本
      localStorage.removeItem(DATA_MODIFIED_KEY);
      localStorage.setItem(DATA_SYNCED_KEY, TEAM_DATA_SYNCED_AT);
    } catch {}
  };

  return (
    <DataContext.Provider
      value={{
        teamInfo,
        songs,
        albums,
        members,
        announcements,
        recruitmentPositions,
        collaborations,
        isAdminAuthenticated,
        adminUsername,
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
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
