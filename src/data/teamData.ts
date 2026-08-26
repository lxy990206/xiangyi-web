import { SongItem, AlbumItem, Member, RecruitmentPosition, Collaboration, Announcement } from '../types';

export const TEAM_INFO = {
  name: '相依团队',
  nameEn: 'Xiangyi Team (相依社)',
  slogan: '为爱发电，相依同行。',
  subSlogan: '以旋律筑梦，用歌声定格每一个动人心魄的瞬间。',
  foundedYear: '2025',
  foundedDate: '2025年9月6日',
  location: '同人音乐创作社团 / Virtual Singer Music Circle',
  description: '相依团队（Xiangyi Team / 相依社）成立于2025年9月6日，是由一群因对洛天依及中文虚拟歌姬文化怀揣纯粹热爱而聚首的年轻创作者发起创立的同人音乐社团。涵盖作曲编曲、作词、歌姬调校、曲绘插画、PV动画与混音母带全流程制作。',
  stats: {
    worksCount: '10+',
    playCount: '15,000+',
    membersCount: '23',
    albumsCount: '2',
    fanCount: '2,000+'
  },
  socials: {
    bilibili: 'https://space.bilibili.com/3707032479730267',
    bilibiliUid: '3707032479730267',
    bilibiliName: '相依社',
    bilibiliLeaderMid: '3546570760915314',
    bilibiliLeaderName: 'light闪电ing (相依_闪电)',
    weibo: 'https://weibo.com/xiangyiteam',
    weiboHandle: '@相依音乐企划组',
    qqGroup: '829471052',
    qqGroupQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qm.qq.com/cgi-bin/qm/qr?k=829471052',
    qqRecruitGroup: '942187653',
    qqRecruitGroupQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qm.qq.com/cgi-bin/qm/qr?k=942187653',
    neteaseArtist: 'https://music.163.com',
    qqmusic: 'https://y.qq.com',
    contactEmail: 'contact@xiangyiteam.org',
    email: 'contact@xiangyiteam.org'
  },
  navigationConfig: {
    homeTitle: '首页概览',
    singlesTitle: '原创单曲',
    albumsTitle: '企划专辑',
    collaborationsTitle: '合作项目',
    membersTitle: '社团成员',
    recruitmentTitle: '招募中心',
    aboutTitle: '关于我们'
  },
  recruitmentBanner: {
    enabled: true,
    badge: '急招中',
    title: '相依团队2025春季企划 · 招募曲绘师 / PV动效师',
    desc: '多首原创洛天依/星尘单曲企划分镜已就绪，欢迎携作品投递交流！',
    buttonText: '查看招募详情'
  },
  milestones: [
    { id: 'm-1', year: '2025.09.06', title: '相依团队正式创立', desc: '由多位中文Vocaloid音乐与ACE调校爱好者聚首创立，确立“为爱发电，相依同行”的社团理念。' },
    { id: 'm-2', year: '2025.10.03', title: '首支原创单曲《依你共鸣》', desc: '相依社成立首支原创纪念曲于Bilibili正式上线，收获广大中文V家听众的好评。' },
    { id: 'm-3', year: '2025.12.30', title: '企划专辑《相依之音》立项', desc: '开启跨社团联合共创，收录多首洛天依、乐正绫原创曲目。' },
    { id: 'm-4', year: '2026.02.17', title: '2026春节特别单曲《瞬时爱恋》', desc: '洛天依全新单曲登顶社团精选，ACE Studio精细拟真调校与唯美PV同步上线。' },
    { id: 'm-5', year: '2026.03', title: '春季全方位招募与新企划推进', desc: '面向全网招募曲绘师、PV动画师与调校师，筹备下一阶段大型歌姬物语。' }
  ],
  faqs: [
    {
      id: 'faq-1',
      q: '相依团队是什么性质的组织？',
      a: '相依团队是一个非商业性质的同人原创音乐创作社团，核心成员皆因对洛天依及中文虚拟歌姬文化的热爱而聚在一起。'
    },
    {
      id: 'faq-2',
      q: '社团创作的作品可以二创或翻唱吗？',
      a: '非常欢迎！在非商业用途且标明原曲完整Staff出处的前提下，社团鼓励并支持翻唱、翻调、MMD及同人曲绘二创。'
    },
    {
      id: 'faq-3',
      q: '如何与社团开展企划联动或商务合作？',
      a: '您可以通过官方邮箱 contact@xiangyiteam.org 或 B站官方账号私信与我们取得联系。'
    },
    {
      id: 'faq-4',
      q: '如何申请加入相依团队？',
      a: '请点击导航栏“招募中心”，查阅当前急需岗位要求并在线投递申请，或加入相依团队沟通QQ群（942187653）了解更多团队动态。'
    }
  ],
  toolLinks: [
    {
      id: 'tool-1',
      title: '相依社 B站官方主页',
      category: '官方社媒',
      url: 'https://space.bilibili.com/3707032479730267',
      desc: '官方联合投稿、视频发布与动态公告主阵地',
      icon: 'bilibili',
      isHot: true
    },
    {
      id: 'tool-2',
      title: '相依社 官方微博',
      category: '官方社媒',
      url: 'https://weibo.com/xiangyiteam',
      desc: '日常创作花絮、Staff幕后与同好互动',
      icon: 'weibo',
      isHot: false
    },
    {
      id: 'tool-3',
      title: 'Bilibili 创作中心',
      category: '创作工具',
      url: 'https://member.bilibili.com/platform/home',
      desc: '视频投稿、数据分析与高清码率上传通道',
      icon: 'external',
      isHot: false
    },
    {
      id: 'tool-4',
      title: 'ACE Studio 调校工具',
      category: '音频工具',
      url: 'https://ace-studio.timedomain.cn',
      desc: '高质量AI歌声合成与参数曲线微调引擎',
      icon: 'music',
      isHot: true
    },
    {
      id: 'tool-5',
      title: 'Vocaloid 中文维基',
      category: '同好资料',
      url: 'https://zh.moegirl.org.cn/Vocaloid',
      desc: '中文虚拟歌姬曲目收录、殿堂/传说曲与词条检索',
      icon: 'info',
      isHot: false
    }
  ]
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    date: '2026-02-17',
    title: '【新曲发布】洛天依2026春节原创单曲《瞬时爱恋》B站正式上线！',
    tag: '新曲',
    content: '相依团队2026春节特别企划《瞬时爱恋》震撼公开！ACE Studio高精调校搭配唯美PV，讲述深夜清醒与自我释怀的物语，欢迎前往B站观看投币！',
    linkTab: 'singles'
  },
  {
    id: 'ann-2',
    date: '2025-10-03',
    title: '【首发回顾】相依团队成立首支原创纪念曲《依你共鸣》',
    tag: '纪念',
    content: '团队成立以来的首支原创曲目《依你共鸣》，献给每一位陪伴洛天依与相依团队前行的共鸣者！',
    linkTab: 'singles'
  },
  {
    id: 'ann-3',
    date: '2026-02-20',
    title: '【春季招募】诚招曲绘师、PV动画师，共同筹备全新歌姬大企划！',
    tag: '招募',
    content: '相依社多项全新中V原创企划正紧锣密鼓推进中！急需画风细腻的曲绘师与节奏把控精准的PV/动效师，期待与各位同好相遇！',
    linkTab: 'recruitment'
  }
];

export const SONGS_DATA: SongItem[] = [
  {
    id: 'song-1',
    title: '瞬时爱恋',
    subtitle: '原来这场《瞬时爱恋》，只是我怕深夜冷清时的自我感动',
    singer: '洛天依',
    singerColor: '#66CCFF',
    genre: '流行抒情 / 电子',
    releaseDate: '2026-02-17',
    duration: '03:48',
    coverUrl: 'https://i0.hdslb.com/bfs/archive/73645de19b43761fb45ef74201301107cd04ee8d.jpg',
    bilibiliBvid: 'BV1aoZKBQEQt',
    bilibiliEmbedUrl: 'https://player.bilibili.com/player.html?bvid=BV1aoZKBQEQt&page=1&as_wide=1&high_quality=1&danmaku=0',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1aoZKBQEQt',
    aid: '116080047755152',
    cid: '36103916109',
    playCount: '6,557+',
    danmakuCount: '482',
    likeCount: '1,303',
    coinCount: '135',
    favoriteCount: '747',
    isFeatured: true,
    bpm: 120,
    staff: {
      composition: '本本不是胆小鬼',
      arrangement: '本本不是胆小鬼',
      lyrics: '仲瑾特雷森帝吓室',
      tuning: '云泠曦 / 星涯StellarHorizon',
      illustration: '依存证',
      pv: '洛小mua',
      mixing: '腐叶化蝶',
      planner: '相依社 / light闪电ing'
    },
    description: '【歌曲意境】两个月，能让一个人从深情坠入清醒。病中的一次次翻涌，曾被我当成是“非你不可”的执念，直到眼泪打湿枕巾才猛然发觉——那些悔恨和心萦，其实都挺可笑的。这首歌不是写给“前任”的，而是写给那个“因为孤独而试图寻找浮萍”的自己。我们总在深夜寻找肩膀，却忘了最好的支撑其实是内心的安宁。旧日风影，往后自守。',
    lyrics: `[00:00.00]瞬时爱恋 - 洛天依 (相依团队 2026 春节原创曲)
[00:03.00]作曲/编曲：本本不是胆小鬼
[00:06.00]作词：仲瑾特雷森帝吓室
[00:09.00]ACE调教：云泠曦 / 星涯StellarHorizon
[00:12.00]PV：洛小mua | 曲绘：依存证 | 混音：腐叶化蝶 | 封面制作：小白-待你长发及腰
[00:18.00]策划：相依社 / light闪电ing | 演唱：洛天依
[00:24.00]
[00:26.50]夜色把城市切成碎片
[00:32.20]指针在无声里兜着圈
[00:38.00]那些未寄出的誓言
[00:43.60]不过是深夜冷清时的自我消遣
[00:50.00]
[00:52.00]原来这场瞬时爱恋
[00:57.80]只是我怕寂寞的盲点
[01:03.50]在回忆退潮的岸边
[01:09.20]看清了心底最深处的疲倦
[01:15.00]
[01:16.80]旧日风影 随风飘远
[01:22.40]往后余生 独自成全
[01:28.00]不再向黑夜索要温暖
[01:34.00]在晨光破晓前 说声再见`
  },
  {
    id: 'song-2',
    title: '依你共鸣',
    subtitle: '我亲爱的共鸣者呀，请聆听你我之间的共鸣回响！我愿意《依你共鸣》',
    singer: '洛天依',
    singerColor: '#66CCFF',
    genre: '古风流行 / 物语',
    releaseDate: '2025-10-03',
    duration: '04:33',
    coverUrl: 'https://i1.hdslb.com/bfs/archive/ac977fcfaf45939fab40821035d97d5baa02f259.jpg',
    bilibiliBvid: 'BV1PhHuzzEJ9',
    bilibiliEmbedUrl: 'https://player.bilibili.com/player.html?bvid=BV1PhHuzzEJ9&page=1&as_wide=1&high_quality=1&danmaku=0',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1PhHuzzEJ9',
    aid: '115307943298329',
    cid: '32802147333',
    playCount: '5,258+',
    danmakuCount: '58',
    likeCount: '800+',
    coinCount: '120+',
    favoriteCount: '450+',
    isFeatured: true,
    bpm: 128,
    staff: {
      composition: '相依_涛涛',
      arrangement: '相依_涛涛',
      lyrics: '一小只初中牲 (Tianyrene)',
      tuning: '暗林星火Official',
      illustration: '星影安 / 依存证',
      pv: '相依_闪电 / 仲瑾特雷森帝吓室',
      mixing: 'Kira雨辰',
      planner: '相依_闪电 (策划) / 相依社'
    },
    description: '相依团队成立于2025年9月6日。我们因对洛天依与音乐创作的纯粹热爱而相聚。本作品为我们团队的首支原创曲目，承载着我们的梦想与热忱。感谢每一位成员的倾力付出，也感谢正在聆听的你。愿以此为始，与所有同好相伴前行，在创作的道路上继续发光发热。特别鸣谢四方老师@锦依卫Minecraft 与洛雨辰老师@Kira雨辰 在编曲与作曲环节给予的宝贵指导。',
    lyrics: `[00:00.00]依你共鸣 - 洛天依 (相依团队首支原创纪念曲)
[00:03.00]作曲/编曲：相依_涛涛
[00:06.00]作词：一小只初中牲 (Tianyrene)
[00:09.00]绘画：星影安、依存证 | XS调教：暗林星火Official
[00:12.00]视频制作：相依_闪电、仲瑾特雷森帝吓室
[00:15.00]策划：相依_闪电 / 相依社 | 混音：Kira雨辰 | 视频封面：小白-待你长发及腰
[00:20.00]特别鸣谢：四方老师@锦依卫Minecraft、洛雨辰老师@Kira雨辰
[00:25.00]
[00:28.00]旋律随风扬 光影落身旁
[00:34.50]荧幕身影跃动而上 连你我心梁
[00:41.20]笔尖墨花淌 牵绊字几行
[00:47.80]蜿蜒流经我身旁 润温暖华芳
[00:54.50]
[00:55.00]朝花雾中绽 夕暮云边灿
[01:01.50]俯拾忆为瓣 风起空回环
[01:08.00]群星未黯淡 闪耀似流焰
[01:14.80]凝望漫天星空璀璨 扬远航风帆
[01:21.50]
[01:22.00]漂泊身影复苏梦想 星河指路十三年共鸣情愫
[01:29.00]落笔题聘书 月下山水共舞
[01:35.50]晶露上蝴蝶伏 光影延续着渴望逐光芒万丈
[01:42.50]看夏虫向远方 听心印终交响
[01:49.00]纵几多前路迷惘 永伴你身旁
[01:55.50]依你身旁 便我所向
[02:02.00]
[02:15.00]喧哗人声响 浪潮汹涌忙
[02:21.50]交叉路口回头张望 寻你在何方
[02:28.00]歌声萦耳畔 幸得你相伴
[02:34.80]激起过往心中羁绊 向前不复还
[02:41.50]
[02:42.00]轻唱在你身旁 岁月未改模样
[02:48.50]热爱挥洒未相忘 共将天际照亮
[02:55.00]音符悠扬 琴弦回声荡
[03:01.80]细数回忆闪亮 与你一同传唱`
  },
  {
    id: 'song-3',
    title: 'And I\'m Home',
    subtitle: '“即使隔着银河，我也要唱出这心中的归宿。”【七夕&宿命曲】',
    singer: '星尘 & 海伊',
    singerColor: '#7B68EE',
    genre: '抒情摇滚 / 幻想',
    releaseDate: '2026-08-19',
    duration: '02:54',
    coverUrl: 'http://i0.hdslb.com/bfs/archive/357943e49c550830db40839b3f88b5cef2ada1e8.jpg',
    bilibiliBvid: 'BV1iF8p6iEzv',
    bilibiliEmbedUrl: 'https://player.bilibili.com/player.html?bvid=BV1iF8p6iEzv&page=1&as_wide=1&high_quality=1&danmaku=0',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1iF8p6iEzv',
    aid: '117122785085561',
    cid: '41072657427',
    playCount: '683+',
    danmakuCount: '15',
    staff: {
      composition: '经典原作',
      arrangement: '相依_闪电',
      lyrics: '原作Staff',
      tuning: '星尘/海伊调教组',
      illustration: '星影安',
      pv: 'light闪电ing',
      mixing: 'AudioLab',
      planner: '相依社'
    },
    description: '“即使隔着银河，我也要唱出这心中的归宿。”星尘与海伊跨越光年与浪潮的宿命合唱。七夕特别企划重唱物语。',
    lyrics: `[00:00.00]And I'm Home - 星尘 & 海伊
[00:04.00]制作：相依创作组 | UP主：light闪电ing
[00:15.00]
[00:18.00]星芒穿过夜色的海浪
[00:24.00]在掌心留下微热的光芒
[00:30.00]即使相隔遥远的银河
[00:36.00]歌声依然是我们不变的归宿`
  },
  {
    id: 'song-4',
    title: '零和 (Zero-Sum)',
    subtitle: '“零和”里唱透的伤痕与救赎，我们为何还要在夜里相拥？',
    singer: '永夜minus',
    singerColor: '#E2E8F0',
    genre: '另类摇滚 / 暗黑物语',
    releaseDate: '2026-08-24',
    duration: '04:51',
    coverUrl: 'http://i0.hdslb.com/bfs/archive/15e570fbc38aca2b84abceaa626c2b964a159c7f.jpg',
    bilibiliBvid: 'BV1TH816DEMs',
    bilibiliEmbedUrl: 'https://player.bilibili.com/player.html?bvid=BV1TH816DEMs&page=1&as_wide=1&high_quality=1&danmaku=0',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1TH816DEMs',
    aid: '117138438293191',
    cid: '41157988035',
    playCount: '463+',
    danmakuCount: '8',
    staff: {
      composition: '相依创作组',
      arrangement: '相依_闪电',
      lyrics: '仲瑾特雷森帝吓室',
      tuning: '暗林星火Official',
      illustration: '依存证',
      pv: '相依_闪电',
      mixing: '腐叶化蝶',
      planner: '相依社'
    },
    description: '“零和”里唱透的伤痕与救赎，我们为何还要在夜里相拥？沉郁厚重的低音与撕裂的情感呐喊。',
    lyrics: `[00:00.00]零和 (Zero-Sum) - 永夜minus
[00:05.00]制作：相依创作组 | UP主：light闪电ing
[00:15.00]
[00:18.00]在算计里清空了期待
[00:24.00]最后只剩下胜负与空白
[00:30.00]为什么还要在深夜相拥
[00:36.00]在废墟之上寻找那一抹救赎`
  },
  {
    id: 'song-5',
    title: '越冰船 (Cover)',
    subtitle: '破冰而来的歌声，温柔了极夜。天依，上海见！！！',
    singer: '洛天依',
    singerColor: '#66CCFF',
    genre: '抒情物语 / 翻调',
    releaseDate: '2026-08-09',
    duration: '04:17',
    coverUrl: 'http://i1.hdslb.com/bfs/archive/4adf1649bb3cc876aed3c0e9b52fdf493d220141.jpg',
    bilibiliBvid: 'BV1gYuU67E8w',
    bilibiliEmbedUrl: 'https://player.bilibili.com/player.html?bvid=BV1gYuU67E8w&page=1&as_wide=1&high_quality=1&danmaku=0',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1gYuU67E8w',
    aid: '117066312976415',
    cid: '40756644959',
    playCount: '901+',
    danmakuCount: '21',
    staff: {
      composition: '经典原作',
      arrangement: '相依编曲组',
      lyrics: '原作Staff',
      tuning: '云泠曦',
      illustration: '星影安',
      pv: '相依_闪电',
      mixing: 'Kira雨辰',
      planner: '相依社'
    },
    description: '“破冰而来的歌声，温柔了极夜。天依，上海见！！！”相依团队对经典的精诚翻调与再演绎。',
    lyrics: `[00:00.00]越冰船 - 洛天依 (相依精调版)
[00:04.00]调校：云泠曦 | 视频制作：相依_闪电
[00:12.00]
[00:15.00]极夜的寒冰被航迹斩开
[00:22.00]温暖的歌声穿透了阴霾
[00:29.00]向着朝阳破浪而去
[00:36.00]去见证那片等待已久的蔚蓝`
  }
];

export const ALBUMS_DATA: AlbumItem[] = [
  {
    id: 'album-1',
    title: '依你共鸣·瞬时相依',
    subTitle: 'Xiangyi Team 1st Concept Anthology',
    releaseYear: '2026.02',
    coverUrl: 'http://i0.hdslb.com/bfs/archive/73645de19b43761fb45ef74201301107cd04ee8d.jpg',
    description: '相依团队创立以来的首张精选概念企划。收录团队首支原创纪念曲《依你共鸣》、2026年春节全新原创曲《瞬时爱恋》及系列衍生企划曲目，见证团队从成立到绽放的每一个音符。',
    themeColor: '#66CCFF',
    bilibiliBvid: 'BV1aoZKBQEQt',
    crossfadeUrl: 'https://player.bilibili.com/player.html?bvid=BV1aoZKBQEQt&page=1&as_wide=1&high_quality=1&danmaku=0',
    platforms: {
      bilibili: 'https://space.bilibili.com/3707032479730267',
      netease: 'https://music.163.com',
      qqmusic: 'https://y.qq.com'
    },
    tracks: [
      { trackNumber: 1, title: '瞬时爱恋 (ACE Studio Ver.)', singer: '洛天依', duration: '03:48', composer: '本本不是胆小鬼', lyricist: '仲瑾特雷森帝吓室', isOriginal: true },
      { trackNumber: 2, title: '依你共鸣 (Founding Single)', singer: '洛天依', duration: '04:33', composer: '相依_涛涛', lyricist: '一小只初中牲', isOriginal: true },
      { trackNumber: 3, title: 'And I\'m Home', singer: '星尘 & 海伊', duration: '02:54', composer: '相依创作组', lyricist: '星海流浪者', isOriginal: true },
      { trackNumber: 4, title: '零和 (Zero-Sum)', singer: '永夜minus', duration: '04:51', composer: '相依创作组', lyricist: '仲瑾特雷森帝吓室', isOriginal: true },
      { trackNumber: 5, title: '越冰船 (Cover Edition)', singer: '洛天依', duration: '04:17', composer: '原作Staff', lyricist: '原作Staff', isOriginal: false }
    ]
  },
  {
    id: 'album-2',
    title: '初鸣·共鸣之声',
    subTitle: 'Xiangyi Founding Commemorative Edition',
    releaseYear: '2025.10',
    coverUrl: 'http://i1.hdslb.com/bfs/archive/ac977fcfaf45939fab40821035d97d5baa02f259.jpg',
    description: '记录2025年9月6日相依团队创立以来的初心与梦想。以《依你共鸣》为核心，呈现创作者们相聚的热忱与执着。',
    themeColor: '#06B6D4',
    bilibiliBvid: 'BV1PhHuzzEJ9',
    crossfadeUrl: 'https://player.bilibili.com/player.html?bvid=BV1PhHuzzEJ9&page=1&as_wide=1&high_quality=1&danmaku=0',
    platforms: {
      bilibili: 'https://space.bilibili.com/3707032479730267',
      netease: 'https://music.163.com'
    },
    tracks: [
      { trackNumber: 1, title: '依你共鸣 (Original)', singer: '洛天依', duration: '04:33', composer: '相依_涛涛', lyricist: '一小只初中牲', isOriginal: true },
      { trackNumber: 2, title: '依你共鸣 (Instrumental)', singer: '伴奏', duration: '04:33', composer: '相依_涛涛', lyricist: '-', isOriginal: true }
    ]
  }
];

export const COLLABORATIONS_DATA: Collaboration[] = [
  {
    id: 'collab-1',
    title: '中V曲目&曦梦闪 特别企划联动',
    partnerCircle: 'light闪电ing / 曦梦闪联合组',
    eventName: '2026 中文虚拟歌姬联合企划',
    year: '2026',
    coverUrl: 'http://i0.hdslb.com/bfs/archive/73645de19b43761fb45ef74201301107cd04ee8d.jpg',
    role: '联合投稿 / 原创曲制作 / 视觉PV监制',
    description: '相依社与知名UP主 light闪电ing 深度联合出品，打造《瞬时爱恋》、《依你共鸣》等高热度歌姬作品。',
    bilibiliBvid: 'BV1aoZKBQEQt'
  },
  {
    id: 'collab-2',
    title: '编曲创作特别指导合作',
    partnerCircle: '锦依卫Minecraft / Kira雨辰',
    eventName: '2025 原创曲目编曲与母带指导企划',
    year: '2025',
    coverUrl: 'http://i1.hdslb.com/bfs/archive/ac977fcfaf45939fab40821035d97d5baa02f259.jpg',
    role: '乐理研讨 / 编曲精修 / 专业混音母带',
    description: '特别鸣谢四方老师@锦依卫Minecraft 与洛雨辰老师@Kira雨辰 在首作创作过程中的全情指导与混音支持。',
    bilibiliBvid: 'BV1PhHuzzEJ9'
  }
];

export const MEMBERS_DATA: Member[] = [
  {
    id: 'mem-1',
    name: '相依社 (官方)',
    avatar: 'https://i1.hdslb.com/bfs/face/522044e64fc2875dea73856272e9baba6ef38a3f.jpg',
    role: '社团官方 / 总策划 / 企划发起',
    department: 'admin',
    badge: '官方号',
    bio: '相依团队官方账号。因对洛天依与音乐创作的热爱而相聚，记录社团每一部原创作品与成长轨迹。',
    representativeWorks: ['《瞬时爱恋》策划', '《依你共鸣》策划'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/3707032479730267'
    },
    joinDate: '2025.09'
  },
  {
    id: 'mem-2',
    name: 'light闪电ing (相依_闪电)',
    avatar: 'https://i0.hdslb.com/bfs/face/85c4b79d5cf79b658cadd029ddd76dd42773ef2a.jpg',
    role: '联合发起人 / 策划 / 视频制作',
    department: 'admin',
    badge: '核心主创',
    bio: '中V资深创作者，相依团队联合发起人与主力策划，统筹视频制作与企划宣发。',
    representativeWorks: ['《依你共鸣》视频/策划', '《瞬时爱恋》联合策划'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/3546570760915314'
    },
    joinDate: '2025.09'
  },
  {
    id: 'mem-4',
    name: '本本不是胆小鬼',
    avatar: 'https://i2.hdslb.com/bfs/face/f44ea56434217e8d1da1f3945a910d893f7708e4.jpg',
    role: '作曲 / 编曲',
    department: 'music',
    badge: '作曲编曲',
    bio: '青年编曲人，擅长现代流行与电子融合曲风，为《瞬时爱恋》打造动人心弦的旋律。',
    representativeWorks: ['《瞬时爱恋》作曲/编曲'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/3632299860036209'
    },
    joinDate: '2025.11'
  },
  {
    id: 'mem-5',
    name: '仲瑾特雷森帝吓室',
    avatar: 'https://i1.hdslb.com/bfs/face/bbfffcfb6a26a1547f8dc22f17c3d494dc1f1d46.webp',
    role: '主力作词 / 视频制作',
    department: 'lyrics',
    badge: '词作/视频',
    bio: '相依团队主力词作与视频创作者，文字细腻富有哲学意境，擅长刻画深层情感。',
    representativeWorks: ['《瞬时爱恋》作词', '《依你共鸣》视频制作'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/484003657'
    },
    joinDate: '2025.09'
  },
  {
    id: 'mem-6',
    name: '一小只初中牲 (Tianyrene)',
    avatar: 'https://i0.hdslb.com/bfs/face/596880ed16c37a2cfc5c5a50e39ef79b8ddbdf92.webp',
    role: '主力作词 / 文案',
    department: 'lyrics',
    badge: '词作者',
    bio: '以清澈纯粹的笔触写就感动，《依你共鸣》词作者，描摹与歌姬相伴十三年的共鸣情愫。',
    representativeWorks: ['《依你共鸣》作词'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/3493116082391421'
    },
    joinDate: '2025.09'
  },
  {
    id: 'mem-8',
    name: '云泠曦',
    avatar: 'https://i1.hdslb.com/bfs/face/11c324ca441c49c41835596e7779ca783e59c2d4.jpg',
    role: 'ACE Studio / Vocaloid 调教师',
    department: 'tuning',
    badge: 'ACE调校',
    bio: '精通ACE Studio与各大歌姬引擎调校，对呼吸声与颤音细节把控极具匠心。',
    representativeWorks: ['《瞬时爱恋》ACE调教'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/526817551'
    },
    joinDate: '2025.12'
  },
  {
    id: 'mem-9',
    name: '星影安',
    avatar: 'https://i1.hdslb.com/bfs/face/5833bf7ccc7ef479743b4f51f4264882953c5b3a.jpg',
    role: '主力曲绘师 / 插画设计',
    department: 'visual',
    badge: '曲绘主笔',
    bio: '画风唯美温润，擅长光影渲染与氛围营造，为歌曲赋予扣人心弦的视觉呈现。',
    representativeWorks: ['《依你共鸣》曲绘插画'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/1464411655'
    },
    joinDate: '2025.09'
  },
  {
    id: 'mem-10',
    name: '依存证',
    avatar: 'https://i2.hdslb.com/bfs/face/d97eafd5a02cd21afacce9b4870e1e60f3a38812.jpg',
    role: '曲绘师 / 概念设计',
    department: 'visual',
    badge: '曲绘画师',
    bio: '擅长角色情绪捕捉与细腻线条刻画，《依你共鸣》与《瞬时爱恋》曲绘创作者。',
    representativeWorks: ['《依你共鸣》曲绘', '《瞬时爱恋》曲绘'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/479165564'
    },
    joinDate: '2025.09'
  },
  {
    id: 'mem-11',
    name: '洛小mua',
    avatar: 'https://i1.hdslb.com/bfs/face/653a30847ee9e966da684c8a8e1cdaa730e55cf1.jpg',
    role: 'PV师 / 动效监督',
    department: 'video',
    badge: 'PV制作',
    bio: 'B站资深PV动画制作UP主（6万+关注），以精湛镜头语言与动态张力为《瞬时爱恋》打造视觉盛宴。',
    representativeWorks: ['《瞬时爱恋》PV动画'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/3537125622417583'
    },
    joinDate: '2025.12'
  },
  {
    id: 'mem-12',
    name: '小白-待你长发及腰',
    avatar: 'https://i0.hdslb.com/bfs/face/e549fb5e9c9eaae3a24bd96562270703ae47b62c.webp',
    role: '封面设计 / 平面视觉',
    department: 'visual',
    badge: '封面设计',
    bio: '专注于单曲封面排版、字体设计与官方视觉包装，呈现精致的同人设计美学。',
    representativeWorks: ['《依你共鸣》封面', '《瞬时爱恋》封面'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/1828433706'
    },
    joinDate: '2025.09'
  },
  {
    id: 'mem-13',
    name: 'Kira雨辰',
    avatar: 'https://i0.hdslb.com/bfs/face/f26a16d00a1c7fef2fb303fb39a08fe69f69bf41.jpg',
    role: '特邀混音师 / 编曲指导',
    department: 'music',
    badge: '专业混音',
    bio: '知名音乐制作人与混音师，为《依你共鸣》提供专业的母带与人声混音支持。',
    representativeWorks: ['《依你共鸣》混音母带'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/507925563'
    },
    joinDate: '2025.09'
  },
  {
    id: 'mem-14',
    name: '腐叶化蝶',
    avatar: 'https://i0.hdslb.com/bfs/face/677185a1973a82ac4d7fe7b847a58923e7cbeb6e.jpg',
    role: '混音师 / 音频工程师',
    department: 'music',
    badge: '混音工程师',
    bio: '擅长声场空间构架与频段雕琢，为《瞬时爱恋》打造纯净通透的声音质感。',
    representativeWorks: ['《瞬时爱恋》混音'],
    socialLinks: {
      bilibili: 'https://space.bilibili.com/1182243105'
    },
    joinDate: '2026.01'
  }
];

export const RECRUITMENT_POSITIONS: RecruitmentPosition[] = [
  {
    id: 'rec-1',
    title: '曲绘师 / 插画概念设计',
    department: 'visual',
    isUrgent: true,
    spots: '2-3名',
    requirements: [
      '熟练掌握板绘与数位绘画工具（CSP / SAI2 / Photoshop 等）',
      '具有良好的角色造型基础与光影氛围把控能力，能根据歌曲Demo与意境完成曲绘分镜或立绘',
      '能够配合团队完成图层拆分（用于PV动态特效制作）',
      '热爱洛天依等中文虚拟歌姬文化，有责任心，能按时交稿'
    ],
    responsibilities: [
      '负责相依社新原创单曲与企划画集的角色立绘、封面插画及分镜曲绘',
      '配合PV师进行画面图层拆解与素材修整',
      '参与歌曲早期世界观与视觉设定研讨'
    ],
    perks: [
      'B站官方联合投稿Staff署名，作品全网推广',
      '与高水平作词、编曲及混音老师紧密合作',
      '社团内部曲绘技法交流与资源共享，优先参与实体周边与专辑画集制作'
    ]
  },
  {
    id: 'rec-2',
    title: 'PV师 / 动态视觉特效师',
    department: 'video',
    isUrgent: true,
    spots: '1-2名',
    requirements: [
      '熟练使用 After Effects (AE) / Premiere / Blender 或相关动画软件',
      '对音乐节奏、重音卡点与转场动效有出色的敏锐度',
      '能够对静态曲绘进行2D/2.5D骨骼绑定、粒子光效及文字排版排版动画包装',
      '有成片同人音乐PV/AMV制作经验者优先'
    ],
    responsibilities: [
      '负责社团原创单曲PV的动态制作、歌词特效排版与成片渲染',
      '协助制作专辑Crossfade试听预告片与B站宣传动态短片'
    ],
    perks: [
      'B站官方联合投稿Staff署名与UP主联合推广',
      '丰富的优秀原创曲音频资源优先制作权',
      '社团专项视频工程模版与特效插件库支持'
    ]
  },
  {
    id: 'rec-3',
    title: '歌姬调教师 (ACE / Vocaloid / SynthV)',
    department: 'tuning',
    isUrgent: false,
    spots: '1-2名',
    requirements: [
      '熟练使用 ACE Studio / Vocaloid5/6 / Synthesizer V 等歌姬调教引擎',
      '音准把控精准，注重歌姬自然咬字、换气声与情感滑音细节',
      '有洛天依、乐正绫等中文声库调教成熟作品者优先'
    ],
    responsibilities: [
      '负责社团原创单曲的人声主旋律、和声编写与调校导出',
      '配合混音师进行人声分轨输出'
    ],
    perks: [
      '官方作品Staff署名',
      '优先调教高品质原创伴奏'
    ]
  },
  {
    id: 'rec-4',
    title: '词作者 / 企划文案',
    department: 'lyrics',
    isUrgent: false,
    spots: '1名',
    requirements: [
      '文字功底扎实，押韵合辙，熟悉音乐押韵与旋律句式对应',
      '具备完整的故事构建能力与歌词意境表达力'
    ],
    responsibilities: [
      '根据作曲Demo完成原创歌词创作与文案阐释',
      '参与社团企划世界观构架'
    ],
    perks: [
      '作品全网正式发行署名',
      '与实力编曲人共同打磨作品'
    ]
  }
];
