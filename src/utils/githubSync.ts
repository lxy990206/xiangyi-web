import { 
  Song, 
  Album, 
  Member, 
  RecruitmentPosition, 
  Collaboration, 
  Announcement 
} from '../types';
import { TeamInfoType } from '../context/DataContext';

export interface GitHubSyncConfig {
  token: string;
  repo: string;          // e.g. "Light-Flash-ing/xiangyi-music-website" or "owner/repo"
  branch: string;        // e.g. "main" or "master"
  filePath: string;      // default: "src/data/teamData.ts"
  commitMessage: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  commitUrl?: string;
  commitSha?: string;
  updatedAt?: string;
}

export interface RepoTestResult {
  success: boolean;
  message: string;
  owner?: string;
  repoName?: string;
  defaultBranch?: string;
  isPrivate?: boolean;
  permissions?: {
    push?: boolean;
    admin?: boolean;
  };
}

/** 上传文件大小上限：20MB */
export const MAX_UPLOAD_FILE_SIZE = 20 * 1024 * 1024;

/** 无 GitHub 配置时，本地 DataURL 回退存储上限（localStorage 约 5MB，预留其他数据空间） */
export const MAX_LOCAL_DATAURL_SIZE = 3 * 1024 * 1024;

/**
 * 预览音频等媒体文件在仓库中的存放目录
 */
export const REPO_AUDIO_DIR = 'public/audio';

/**
 * 读取文件为 Base64（不含 DataURL 前缀）
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('文件读取失败，请重试'));
    reader.readAsDataURL(file);
  });
}

/**
 * 清洗文件名：去除非法字符与中文，保留扩展名
 */
export function sanitizeFileName(name: string): string {
  const ext = (name.match(/\.[a-zA-Z0-9]+$/) || ['.mp3'])[0].toLowerCase();
  const base = name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return `${base || 'audio'}${ext}`;
}

/**
 * 向 GitHub 仓库上传二进制文件（音频/图片等），返回站点内可访问的相对路径
 */
export async function uploadFileToGitHub(params: {
  token: string;
  repo: string;
  branch: string;
  path: string;       // 仓库内目标路径，如 public/audio/song-1.mp3
  file: File;
  commitMessage?: string;
}): Promise<{ success: boolean; webPath: string; commitUrl?: string }> {
  const { token, repo, branch, path, file, commitMessage } = params;
  if (file.size > MAX_UPLOAD_FILE_SIZE) {
    throw new Error(`文件大小 ${(file.size / 1024 / 1024).toFixed(1)}MB 超过 20MB 上传限制`);
  }

  const { owner, repo: repoName } = parseRepoString(repo);
  const cleanToken = token.trim();
  const targetBranch = branch.trim() || 'main';
  const targetPath = path.replace(/^\/+/, '');
  const base64Content = await readFileAsBase64(file);

  // 获取已存在文件 SHA（覆盖更新时必需）
  let existingSha: string | undefined;
  try {
    const fileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/${targetPath}?ref=${encodeURIComponent(targetBranch)}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${cleanToken}`,
        }
      }
    );
    if (fileRes.ok) {
      existingSha = (await fileRes.json()).sha;
    }
  } catch { /* 新文件无需 SHA */ }

  const payload: Record<string, any> = {
    message: commitMessage || `chore(assets): 上传媒体文件 ${file.name}`,
    content: base64Content,
    branch: targetBranch
  };
  if (existingSha) payload.sha = existingSha;

  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/contents/${targetPath}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }
  );

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    throw new Error(`文件上传失败: ${err.message || `HTTP ${putRes.status}`}`);
  }

  const resultData = await putRes.json();
  // 站点相对路径（public 目录部署后可直接访问，兼容根路径与子路径部署）
  const webPath = targetPath.replace(/^public\//, '');
  return {
    success: true,
    webPath,
    commitUrl: resultData.commit?.html_url
  };
}

/**
 * 删除 GitHub 仓库中的文件（用于清理被替换/清除的旧音频）
 */
export async function deleteRepoFile(params: {
  token: string;
  repo: string;
  branch: string;
  path: string;
  commitMessage?: string;
}): Promise<boolean> {
  const { token, repo, branch, path, commitMessage } = params;
  const { owner, repo: repoName } = parseRepoString(repo);
  const cleanToken = token.trim();
  const targetBranch = branch.trim() || 'main';
  const targetPath = path.replace(/^\/+/, '');

  try {
    const fileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/${targetPath}?ref=${encodeURIComponent(targetBranch)}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${cleanToken}`,
        }
      }
    );
    if (!fileRes.ok) return false;
    const fileData = await fileRes.json();
    if (!fileData.sha) return false;

    const delRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/${targetPath}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage || `chore(assets): 清理无用媒体文件 ${targetPath}`,
          sha: fileData.sha,
          branch: targetBranch
        })
      }
    );
    return delRes.ok;
  } catch {
    return false;
  }
}

/**
 * Safely encode a UTF-8 string to Base64 in the browser
 */
export function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Parse repository string into owner and repo name
 */
export function parseRepoString(repoInput: string): { owner: string; repo: string } {
  let cleaned = repoInput.trim();
  // Strip full github url if present
  cleaned = cleaned.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/^\/+|\/+$/g, '');
  const parts = cleaned.split('/');
  if (parts.length < 2 || !parts[0] || !parts[1]) {
    throw new Error('仓库格式不正确，请输入形如 "用户名/仓库名" (例如: Light-Flash-ing/xiangyi-music-website)');
  }
  return { owner: parts[0], repo: parts[1] };
}

/**
 * Generate full TypeScript source code for src/data/teamData.ts
 */
export function generateTeamDataTsCode(data: {
  teamInfo: TeamInfoType;
  songs: Song[];
  albums: Album[];
  collaborations: Collaboration[];
  members: Member[];
  announcements: Announcement[];
  recruitmentPositions: RecruitmentPosition[];
}): string {
  const {
    teamInfo,
    songs,
    albums,
    collaborations,
    members,
    announcements,
    recruitmentPositions
  } = data;

  const header = `/**
 * 相依团队 (Xiangyi Team) 官方网站核心数据配置
 * 自动同步生成时间: ${new Date().toISOString()} (${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })})
 * 包含社团简介、原创单曲(含试听音频配置)、专辑、合作项目、成员名单、公告及招募岗位。
 */
import { SongItem, AlbumItem, Member, RecruitmentPosition, Collaboration, Announcement } from '../types';

// 数据同步版本时间戳：GitHub 自动同步时更新，用于检测部署新版数据并自动刷新浏览器本地缓存
export const TEAM_DATA_SYNCED_AT = '${new Date().toISOString()}';

`;

  const teamInfoCode = `export const TEAM_INFO = ${JSON.stringify(teamInfo, null, 2)};\n\n`;
  const announcementsCode = `export const ANNOUNCEMENTS: Announcement[] = ${JSON.stringify(announcements, null, 2)};\n\n`;
  const songsCode = `export const SONGS_DATA: SongItem[] = ${JSON.stringify(songs, null, 2)};\n\n`;
  const albumsCode = `export const ALBUMS_DATA: AlbumItem[] = ${JSON.stringify(albums, null, 2)};\n\n`;
  const collaborationsCode = `export const COLLABORATIONS_DATA: Collaboration[] = ${JSON.stringify(collaborations, null, 2)};\n\n`;
  const membersCode = `export const MEMBERS_DATA: Member[] = ${JSON.stringify(members, null, 2)};\n\n`;
  const recruitmentCode = `export const RECRUITMENT_POSITIONS: RecruitmentPosition[] = ${JSON.stringify(recruitmentPositions, null, 2)};\n`;

  return header + teamInfoCode + announcementsCode + songsCode + albumsCode + collaborationsCode + membersCode + recruitmentCode;
}

/**
 * Test GitHub connection and token permissions
 */
export async function testGitHubRepo(token: string, repoInput: string): Promise<RepoTestResult> {
  if (!token || token.trim().length === 0) {
    return { success: false, message: '请先填入 GitHub Personal Access Token (PAT)' };
  }
  if (!repoInput || repoInput.trim().length === 0) {
    return { success: false, message: '请填入 GitHub 仓库路径 (如 owner/repo)' };
  }

  try {
    const { owner, repo } = parseRepoString(repoInput);
    const cleanToken = token.trim();

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${cleanToken}`,
      }
    });

    if (response.status === 401) {
      return { success: false, message: 'GitHub Token 无效或已过期 (401 Unauthorized)，请检查 Token 权限。' };
    }
    if (response.status === 404) {
      return { success: false, message: `找不到仓库 "${owner}/${repo}" 或该 Token 没有访问此仓库的权限 (404 Not Found)。` };
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, message: `连接失败: ${err.message || response.statusText}` };
    }

    const data = await response.json();
    const canPush = data.permissions?.push ?? true;

    return {
      success: true,
      message: canPush ? '✅ 仓库连接成功，已具备写入与推送权限！' : '⚠️ 仓库连接成功，但当前 Token 可能没有 Push 推送权限。',
      owner: data.owner?.login || owner,
      repoName: data.name || repo,
      defaultBranch: data.default_branch || 'main',
      isPrivate: data.private,
      permissions: data.permissions
    };
  } catch (err: any) {
    return {
      success: false,
      message: `网络或解析错误: ${err.message || '无法连接 GitHub API'}`
    };
  }
}

/**
 * Push updated data directly to GitHub repository via REST API
 */
export async function syncDataToGitHub(
  config: GitHubSyncConfig,
  data: {
    teamInfo: TeamInfoType;
    songs: Song[];
    albums: Album[];
    collaborations: Collaboration[];
    members: Member[];
    announcements: Announcement[];
    recruitmentPositions: RecruitmentPosition[];
  },
  onProgress?: (step: string) => void
): Promise<SyncResult> {
  const { token, repo: repoInput, branch, filePath, commitMessage } = config;

  if (!token || !token.trim()) {
    throw new Error('未配置 GitHub Access Token，无法同步。');
  }

  const { owner, repo } = parseRepoString(repoInput);
  const cleanToken = token.trim();
  const targetBranch = branch.trim() || 'main';
  const targetPath = (filePath.trim() || 'src/data/teamData.ts').replace(/^\/+/, '');

  // 1. Generate full source code
  onProgress?.('1/4 正在生成最新的 TypeScript 数据源码...');
  const tsCode = generateTeamDataTsCode(data);
  const base64Content = utf8ToBase64(tsCode);

  // 2. Fetch existing file SHA if exists
  onProgress?.('2/4 正在获取远程文件 SHA 版本校验...');
  let existingSha: string | undefined = undefined;

  try {
    const fileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}?ref=${encodeURIComponent(targetBranch)}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${cleanToken}`,
        }
      }
    );

    if (fileRes.ok) {
      const fileData = await fileRes.json();
      existingSha = fileData.sha;
    } else if (fileRes.status !== 404) {
      const err = await fileRes.json().catch(() => ({}));
      console.warn('Get file sha warning:', err);
    }
  } catch (e) {
    console.warn('Failed to query existing file SHA, will try create/update directly', e);
  }

  // 3. Commit & Push update to GitHub
  onProgress?.('3/4 正在向 GitHub 提交并推送代码 (Commit & Push)...');
  const nowStr = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const finalMessage = commitMessage.trim() || `chore(data): 同步相依团队官网最新前台修改 [${nowStr}]`;

  const payload: Record<string, any> = {
    message: finalMessage,
    content: base64Content,
    branch: targetBranch
  };
  if (existingSha) {
    payload.sha = existingSha;
  }

  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }
  );

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    let errMsg = err.message || `HTTP ${putRes.status} ${putRes.statusText}`;
    if (putRes.status === 409) {
      errMsg = '文件冲突 (409 Conflict): 远程文件已被修改或 SHA 不匹配，请重试同步。';
    } else if (putRes.status === 401) {
      errMsg = 'Token 鉴权失败 (401): 请检查 Token 是否具备写入 repo 的权限。';
    } else if (putRes.status === 404) {
      errMsg = `仓库或分支不存在 (404): 请检查仓库名 "${owner}/${repo}" 及分支 "${targetBranch}" 是否正确。`;
    }
    throw new Error(errMsg);
  }

  const resultData = await putRes.json();
  onProgress?.('4/4 同步完成！代码已提交至 GitHub。');

  return {
    success: true,
    message: '同步成功！已将最新修改直接提交至 GitHub 仓库。',
    commitUrl: resultData.commit?.html_url || `https://github.com/${owner}/${repo}/commits/${targetBranch}`,
    commitSha: resultData.commit?.sha,
    updatedAt: nowStr
  };
}

/**
 * Trigger browser file download for teamData.ts
 */
export function downloadTsFile(filename: string = 'teamData.ts', content: string) {
  const blob = new Blob([content], { type: 'text/typescript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
