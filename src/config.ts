import avatarImg from './assets/images/site/avatar.svg';
import ogDefaultImg from './assets/images/site/og-default.svg';
import type { SiteConfig, NavItem, SocialLink, TwikooConfig } from './types/config';

/**
 * 全局站点与主题配置。
 * 在这里修改即可完成主题定制。所有字段都有类型约束，
 * 并会被 layouts、components、RSS、sitemap 和 SEO 共用。
 */

// 导出站点图片资源，供组件复用
export const SITE_IMAGES = {
  avatar: avatarImg,
  ogDefault: ogDefaultImg,
} as const;

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

/**
 * 作者与社交账号配置。优先从 env vars 读取，
 * 这样就不需要把这些标识硬编码进源码里。
 *
 * 某个 handle 留空时，会自动从侧边栏隐藏对应入口，
 * 也不会暴露无效的 `your-handle` URL。
 */
const GITHUB_HANDLE = import.meta.env.PUBLIC_GITHUB_HANDLE ?? '';
const GITHUB_REPO = import.meta.env.PUBLIC_GITHUB_REPO ?? 'chirping-astro';
const TWITTER_HANDLE = import.meta.env.PUBLIC_TWITTER_HANDLE ?? '';
const CONTACT_EMAIL = import.meta.env.PUBLIC_CONTACT_EMAIL ?? '';
const THEME_REPO_URL = 'https://github.com/kannansuresh/chirping-astro';

/**
 * 当前部署源码对应的公开 GitHub 仓库信息。
 * 适用于需要仓库 URL 的自定义链接或集成。
 * 当 `PUBLIC_GITHUB_HANDLE` 未设置时，`url` 会回退到安全默认值，
 * 避免生成的链接直接指向 404。
 */
export const REPO = {
  handle: GITHUB_HANDLE,
  name: GITHUB_REPO,
  url: GITHUB_HANDLE ? `https://github.com/${GITHUB_HANDLE}/${GITHUB_REPO}` : 'https://github.com',
} as const;

export const SITE: SiteConfig = {
  // ==========================================
  // 可安全修改（内容与展示）
  // ==========================================

  /** 默认站点标题，用于首页 `<title>` 和 meta。 */
  title: '我的博客',
  /** 站点副标题 / 描述。 */
  description: '暂时还在初始化中',
  /** 显示在页脚和 meta 中的作者信息。 */
  author: {
    name: '朱轶博',
    url: GITHUB_HANDLE ? `https://github.com/${GITHUB_HANDLE}` : undefined,
    avatar: avatarImg,
    bio: '开发者',
  },
  /** 默认 OG image。 */
  defaultOgImage: ogDefaultImg.src,
  /** 列表页每页显示的文章数量。 */
  postsPerPage: 8,
  /** 为 true 时显示 ISO 8601 日期，否则按 locale 格式化。 */
  isoDates: false,
  /** 全站默认是否显示文章特色图。 */
  showFeaturedImages: true,
  /** 是否给文章与页面正文加带边框的卡片式容器。 */
  boxedArticles: false,
  /** 当标题或描述较长时，是否允许列表卡片自适应增高。 */
  dynamicPostCardHeight: false,
  /** 对没有 `heroImage` 的文章自动生成 Open Graph 图片。 */
  autoOgImage: true,
  /** 是否在页脚显示 Privacy Policy 链接。 */
  showPrivacyPolicy: true,
  /** 页脚文字与链接控制。 */
  footer: {
    /**
     * 左侧页脚文案的完整覆盖，可使用 {year} 和 {author}。
     * 未设置时使用默认文案，并在启用时附带 Privacy Policy 链接。
     */
    leftText: undefined,
    /**
     * 右侧页脚主题链接前的自定义文案。
     * 未设置时使用默认文案 "Powered by Astro · Theme <themeName>"。
     */
    rightText: undefined,
    /** 是否在页脚显示 Privacy Policy 链接。 */
    showPrivacyPolicy: true,
    /** 是否在页脚右侧显示主题署名 Theme <themeName>。 */
    showThemeCredits: true,
    /** 页脚右侧主题仓库链接的显示文字。 */
    themeName: 'Chirping Astro',
    /** 默认上游主题仓库地址。 */
    themeUrl: THEME_REPO_URL,
  },

  // ==========================================
  // 谨慎修改（可能影响功能）
  // ==========================================

  /** 部署后的公开站点 URL，不带尾部斜杠；错误会影响 SEO/RSS。 */
  // 这里用 `||` 而不是 `??`，这样即使 `.env` 里显式写了空的
  // `SITE_URL=`，也会回退到默认值。Astro 要求 `site` 必须是合法 URL。
  url: import.meta.env.SITE_URL || 'https://chirping-astro.example.com',
  /** 支持的 locale。修改后需要同步调整目录、内容和 i18n 配置。 */
  locales: locales,
  /** 默认 locale。修改它通常需要一次性联动多个文件。 */
  defaultLocale: 'en',
  /** 是否显示语言切换器并链接到翻译页面。 */
  multilingual: true,
};

export const NAV: readonly NavItem[] = [
  { key: 'home', href: '/', icon: 'lucide:home' },
  { key: 'categories', href: '/categories', icon: 'lucide:layers' },
  { key: 'tags', href: '/tags', icon: 'lucide:tag' },
  { key: 'archives', href: '/archives', icon: 'lucide:archive' },
  { key: 'about', href: '/about', icon: 'lucide:info' },
] as const;

/**
 * SOCIALS 会基于上面的 env handles 自动生成，
 * 这样用户只需要改一个地方（`.env` 或本文件顶部常量）。
 * 某个 handle 为空时会自动过滤，对应图标不会出现在侧边栏。
 * RSS 会始终保留。
 *
 * 如果需要主题未内置的社交平台，直接在下面追加一项即可，
 * 类型使用 `SocialLink`。
 */
export const SOCIALS: readonly SocialLink[] = [
  GITHUB_HANDLE && {
    label: 'GitHub',
    href: `https://github.com/${GITHUB_HANDLE}`,
    icon: 'simple-icons:github',
  },
  TWITTER_HANDLE && {
    label: 'Twitter',
    href: `https://x.com/${TWITTER_HANDLE}`,
    icon: 'simple-icons:x',
  },
  CONTACT_EMAIL && {
    label: 'Email',
    href: `mailto:${CONTACT_EMAIL}`,
    icon: 'lucide:mail',
  },
  { label: 'RSS', href: '/rss.xml', icon: 'lucide:rss' },
].filter(Boolean) as SocialLink[];

/**
 * Twikoo 评论配置。将 `enabled` 设为 `false`
 * 可全局关闭评论；单篇文章仍可通过 frontmatter 的
 * `comments: false` 单独关闭。
 */
export const TWIKOO: TwikooConfig = {
  enabled: true,
  envId: 'https://mongodzyb.netlify.app/.netlify/functions/twikoo',
  elementId: 'tcomment',
  lang: 'zh-CN',
  version: '1.7.9',
};

/**
 * Pagefind 运行时设置。索引会在 `astro build` 之后
 * 通过 `bun run pagefind` 生成到 `dist/_pagefind/`。
 */
export const PAGEFIND = {
  /** Pagefind bundle 对外服务的路径。 */
  bundlePath: '/_pagefind/',
  /** 每个 locale 渲染的结果数量。 */
  pageSize: 10,
} as const;
