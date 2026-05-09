import type { Locale } from '../config';
import type { ImageMetadata } from 'astro';

export interface SiteConfig {
  title: string;
  description: string;
  author: {
    name: string;
    url?: string;
    avatar?: string | ImageMetadata;
    bio?: string;
  };
  defaultOgImage: string;
  postsPerPage: number;
  isoDates: boolean;
  showFeaturedImages: boolean;
  boxedArticles: boolean;
  dynamicPostCardHeight: boolean;
  autoOgImage: boolean;
  showPrivacyPolicy: boolean;
  footer: {
    /** 左侧页脚文案的完整覆盖，可使用 {year} 和 {author}。 */
    leftText?: string;
    /** 右侧页脚主题链接前显示的自定义文案。 */
    rightText?: string;
    /** 是否在页脚显示 Privacy Policy 链接。 */
    showPrivacyPolicy?: boolean;
    /** 是否在页脚右侧显示主题署名。 */
    showThemeCredits?: boolean;
    /** 页脚右侧主题链接使用的显示文字。 */
    themeName: string;
    /** 页脚右侧主题仓库链接地址。 */
    themeUrl: string;
  };
  url: string;
  locales: readonly Locale[];
  defaultLocale: Locale;
  multilingual: boolean;
}

export interface NavItem {
  /** 与 i18n.ts 文案项对应的唯一 key。 */
  key: string;
  /** 不带 locale 前缀的路径，渲染时会自动补上。 */
  href: string;
  /** 可选图标名，例如 `home`、`tags`。 */
  icon?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface TwikooConfig {
  /** 文章评论总开关。 */
  enabled: boolean;
  /** Twikoo 后端地址，例如 Netlify Function URL。 */
  envId: string;
  /** Twikoo 挂载点使用的 DOM id。 */
  elementId: string;
  /** Twikoo 客户端语言。 */
  lang: string;
  /** 通过 jsDelivr 加载的 Twikoo 浏览器端版本。 */
  version: string;
}
