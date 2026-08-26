/**
 * B站公开接口自动获取工具
 * 用于维护后台按 BV号 自动抓取视频封面、按 UID/空间链接 自动抓取用户头像，
 * 减轻维护人员手动查找封面图与头像链接的负担。
 *
 * 说明：api.bilibili.com 对浏览器跨域支持不稳定，此处采用
 * 「直连 → 公共 CORS 代理逐级回退」的策略保证可用性。
 */

export interface BilibiliVideoInfo {
  bvid: string;
  title: string;
  coverUrl: string;       // 视频封面 (hdslb 直链)
  durationSec: number;    // 总时长（秒）
  playCount: number;      // 播放量
  danmakuCount: number;   // 弹幕数
  likeCount: number;
  coinCount: number;
  favoriteCount: number;
  description: string;
  ownerMid: string;       // UP主 UID
  ownerName: string;
  ownerFace: string;      // UP主头像
}

export interface BilibiliUserInfo {
  mid: string;
  name: string;
  face: string;           // 用户头像直链
  sign: string;
  level?: number;
  followers?: number;
}

/** 依次尝试直连与多个公共 CORS 代理，返回解析后的 JSON */
async function fetchJsonWithFallback(apiUrl: string): Promise<any> {
  const attempts: string[] = [
    apiUrl,
    `https://corsproxy.io/?url=${encodeURIComponent(apiUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`,
  ];

  let lastError = '未知错误';
  for (const url of attempts) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        continue;
      }
      const text = await res.text();
      return JSON.parse(text);
    } catch (e: any) {
      lastError = e?.message || '网络请求失败';
    }
  }
  throw new Error(`B站接口请求失败：${lastError}（可稍后重试或手动填写链接）`);
}

/** 从任意输入中提取 BV号（支持完整链接 / 纯 BV 号） */
export function extractBvid(input: string): string {
  const cleaned = (input || '').trim();
  if (!cleaned) return '';
  const m = cleaned.match(/(BV[0-9A-Za-z]{8,12})/);
  return m ? m[1] : cleaned.replace(/[?/\s].*$/, '');
}

/** 从任意输入中提取 B站用户 UID（支持空间链接 / 纯数字） */
export function extractBilibiliUid(input: string): string {
  const cleaned = (input || '').trim();
  if (!cleaned) return '';
  const m = cleaned.match(/space\.bilibili\.com\/(\d+)/) || cleaned.match(/^(\d{3,12})$/);
  return m ? m[1] : '';
}

/**
 * 按 BV号 获取视频公开信息（封面、标题、时长、播放/弹幕数据、UP主信息）
 */
export async function fetchBilibiliVideoInfo(bvidInput: string): Promise<BilibiliVideoInfo> {
  const bvid = extractBvid(bvidInput);
  if (!bvid) {
    throw new Error('请先填写有效的 B站 BV号（如 BV1xx411c7mD）');
  }

  const json = await fetchJsonWithFallback(
    `https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(bvid)}`
  );

  if (json.code !== 0 || !json.data) {
    throw new Error(json.message || 'B站接口返回异常，请检查 BV号 是否正确');
  }

  const d = json.data;
  return {
    bvid: d.bvid || bvid,
    title: d.title || '',
    coverUrl: d.pic || '',
    durationSec: d.duration || 0,
    playCount: d.stat?.view ?? 0,
    danmakuCount: d.stat?.danmaku ?? 0,
    likeCount: d.stat?.like ?? 0,
    coinCount: d.stat?.coin ?? 0,
    favoriteCount: d.stat?.favorite ?? 0,
    description: d.desc || '',
    ownerMid: String(d.owner?.mid ?? ''),
    ownerName: d.owner?.name || '',
    ownerFace: d.owner?.face || '',
  };
}

/**
 * 按 UID / 空间链接 获取B站用户公开信息（头像、昵称、签名、粉丝数）
 */
export async function fetchBilibiliUserInfo(uidInput: string): Promise<BilibiliUserInfo> {
  const mid = extractBilibiliUid(uidInput);
  if (!mid) {
    throw new Error('无法识别 B站 UID，请填写形如 123456789 的数字或完整空间链接');
  }

  const json = await fetchJsonWithFallback(
    `https://api.bilibili.com/x/web-interface/card?mid=${encodeURIComponent(mid)}`
  );

  if (json.code !== 0 || !json.data) {
    throw new Error(json.message || 'B站接口返回异常，请检查 UID 是否正确');
  }

  const card = json.data.card || {};
  return {
    mid: String(card.mid || mid),
    name: card.name || '',
    face: card.face || '',
    sign: card.sign || '',
    level: json.data.level_info?.current_level,
    followers: json.data.follower,
  };
}
