export type NavTab = 
  | 'home'
  | 'singles'
  | 'albums'
  | 'collaborations'
  | 'members'
  | 'recruitment'
  | 'about'
  | 'admin';

export type VocaloidSinger = 
  | '全部'
  | '洛天依'
  | '乐正绫'
  | '星尘'
  | '言和'
  | '初音未来'
  | '合唱/双子'
  | '星尘 & 海伊'
  | '永夜minus'
  | string;

export type MusicGenre = 
  | '全部'
  | '古风/国风'
  | '电子/EDM'
  | '流行摇滚'
  | '抒情物语'
  | '交响/幻想'
  | string;

export interface SongStaff {
  composition: string;   // 作曲
  arrangement: string;   // 编曲
  lyrics: string;        // 作词
  tuning: string;        // 调校
  illustration: string;  // 曲绘
  pv: string;            // PV/影像
  mixing: string;        // 混音
  planner?: string;      // 策划/监制
}

export interface Song {
  id: string;
  title: string;
  subtitle?: string;
  singer: VocaloidSinger;
  singerColor: string;
  genre: MusicGenre;
  releaseDate: string;
  duration: string;
  coverUrl: string;
  audioUrl?: string;          // 试听音频源 (MP3/WAV/DataURL/在线音频直链)
  audioDuration?: string;     // 试听时长或标注
  audioMode?: 'custom' | 'synth'; // 音频播放模式 (自定义音频 / 网页旋律合成器)
  bilibiliBvid: string;
  bilibiliEmbedUrl?: string;
  playCount: string;
  danmakuCount: string;
  staff: SongStaff;
  description: string;
  lyrics: string;
  isFeatured?: boolean;
  bpm?: number;
  aid?: string | number;
  cid?: string | number;
  likeCount?: string;
  coinCount?: string;
  favoriteCount?: string;
  bilibiliUrl?: string;
}

export interface AlbumTrack {
  trackNumber: number;
  title: string;
  singer: string;
  duration: string;
  composer: string;
  lyricist: string;
  isOriginal: boolean;
  audioUrl?: string;
}

export type SongItem = Song;
export type AlbumItem = Album;

export interface Album {
  id: string;
  title: string;
  subTitle: string;
  releaseYear: string;
  coverUrl: string;
  description: string;
  themeColor: string;
  tracks: AlbumTrack[];
  bilibiliBvid?: string;
  crossfadeUrl?: string;
  platforms: {
    bilibili?: string;
    netease?: string;
    qqmusic?: string;
    booth?: string;
  };
}

export interface Collaboration {
  id: string;
  title: string;
  partnerCircle: string;
  eventName: string;
  year: string;
  coverUrl: string;
  role: string;
  description: string;
  bilibiliBvid: string;
}

export type Department = 
  | 'all'
  | 'music'       // 作曲/编曲/混音
  | 'tuning'      // 调校
  | 'lyrics'      // 作词
  | 'visual'      // 曲绘/插画
  | 'video'       // PV/影像
  | 'admin';      // 策划/运营

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: Department;
  bio: string;
  representativeWorks: string[];
  socialLinks: {
    bilibili?: string;
    weibo?: string;
    netease?: string;
    lofter?: string;
    pixiv?: string;
  };
  joinDate: string;
  badge?: string;
}

export interface RecruitmentPosition {
  id: string;
  title: string;
  department: string;
  isUrgent: boolean;
  spots?: string;
  description?: string;
  requirements: string[];
  responsibilities?: string[];
  perks?: string[];
  preferredQualifications?: string[];
  benefits?: string[];
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  desc: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface ToolLink {
  id: string;
  title: string;
  category: string;
  url: string;
  desc: string;
  icon?: string;
  isHot?: boolean;
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  tag: '招募' | '新歌' | '新曲' | '企划' | '纪念' | '通知' | string;
  content: string;
  linkTab?: NavTab;
}
