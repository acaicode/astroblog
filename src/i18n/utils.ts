/* global URL */
/**
 * i18n 工具函数。
 *
 * 路由规则：
 *  - EN 是默认 locale，直接挂在根路径，不带前缀。
 *  - FR 挂在 `/fr/...` 下。
 *
 * 唯一配置来源：`src/config.ts` -> `SITE.locales` / `SITE.defaultLocale`。
 */

import { SITE, type Locale } from '../config';
import { messages, type UIKey } from './ui';

const DEFAULT_LOCALE: Locale = SITE.defaultLocale;

/** 配置中的 base path（无尾部斜杠），例如 `/chirping-astro` 或空字符串。 */
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/**
 * 给绝对路径补上配置中的 `base` 前缀。
 * 对已带前缀的路径不会重复拼接；空路径和相对路径会原样返回。
 */
export function withBase(path: string): string {
  if (!path || !path.startsWith('/')) return path;
  if (!BASE) return path;
  if (path === BASE || path.startsWith(`${BASE}/`)) return path;
  return `${BASE}${path}`;
}

/** 返回 locale 前缀；默认 locale 返回空字符串。 */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

/**
 * 为给定 pathname 生成本地化 URL（输入路径本身不带 locale 前缀）。
 *
 *   localizedPath('/posts/foo', 'en') -> '/posts/foo'
 *   localizedPath('/posts/foo', 'fr') -> '/fr/posts/foo'
 *   localizedPath('/', 'fr')          -> '/fr/'
 *
 * 当配置了 `base`（例如 `/chirping-astro`）时，会自动补上。
 */
export function localizedPath(path: string, locale: Locale): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  const localized =
    locale === DEFAULT_LOCALE ? cleaned : cleaned === '/' ? `/${locale}/` : `/${locale}${cleaned}`;
  return withBase(localized);
}

/**
 * 从 URL 或 Astro.url.pathname 中识别当前 locale。
 * 只要路径以 `/fr` 或 `/fr/` 开头，就返回 `fr`；
 * 否则返回默认 locale。
 */
export function detectLocale(pathname: string): Locale {
  const p = stripBase(pathname);
  for (const locale of SITE.locales) {
    if (locale === DEFAULT_LOCALE) continue;
    if (p === `/${locale}` || p.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}

/** 从 pathname 中去掉配置的 base path 前缀。 */
function stripBase(pathname: string): string {
  if (!BASE) return pathname;
  if (pathname === BASE) return '/';
  if (pathname.startsWith(`${BASE}/`)) return pathname.slice(BASE.length);
  return pathname;
}

/**
 * 从 pathname 中移除 locale 前缀，以便重新本地化。
 *
 *   stripLocale('/fr/posts/foo')  -> '/posts/foo'
 *   stripLocale('/posts/foo')     -> '/posts/foo'
 *   stripLocale('/fr')            -> '/'
 */
export function stripLocale(pathname: string): string {
  const p = stripBase(pathname);
  for (const locale of SITE.locales) {
    if (locale === DEFAULT_LOCALE) continue;
    if (p === `/${locale}` || p === `/${locale}/`) return '/';
    if (p.startsWith(`/${locale}/`)) return p.slice(`/${locale}`.length);
  }
  return p;
}

/**
 * 翻译辅助函数。优先返回当前 locale 的文案，
 * 不存在时回退到默认 locale，再不行就返回 key 本身。
 *
 *   const t = useTranslations('fr');
 *   t('nav.home') // 'Accueil'
 */
// eslint-disable-next-line no-unused-vars
export function useTranslations(locale: Locale): (key: UIKey) => string {
  return function t(key: UIKey): string {
    const dict = messages[locale] ?? messages[DEFAULT_LOCALE];
    return dict[key] ?? messages[DEFAULT_LOCALE][key] ?? key;
  };
}

/**
 * 按 locale 格式化日期。
 */
export function formatDate(
  date: Date | string,
  _locale: Locale,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  if (SITE.isoDates) return d.toISOString().slice(0, 10);
  const lang = 'zh-CN';
  return new Intl.DateTimeFormat(lang, options).format(d);
}

/** 用于 `<time datetime="...">` 的简短 ISO 8601 日期。 */
export function isoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

/**
 * 将“逻辑路径”映射到所有支持的 locale，
 * 用于生成 `<link rel="alternate" hreflang="...">` SEO 标签。
 *
 * `pathWithoutLocale` 应该是不带 locale 前缀的 canonical 路径，
 * 例如 EN 和 FR 都传 `/posts/welcome`。
 * 如需限制输出范围，可传 `availableLocales`，
 * 例如某篇文章没有其他语言版本时只输出已有 locale。
 */
export function alternates(
  pathWithoutLocale: string,
  availableLocales?: readonly Locale[],
): Array<{
  locale: Locale | 'x-default';
  href: string;
}> {
  const locales = (availableLocales ?? SITE.locales) as readonly Locale[];
  const list: Array<{ locale: Locale | 'x-default'; href: string }> = locales.map((locale) => ({
    locale,
    href: new URL(localizedPath(pathWithoutLocale, locale), SITE.url).toString(),
  }));
  // 只有当默认 locale 对当前路径确实可用时，才输出 x-default；
  // 否则就不生成。
  if (locales.includes(DEFAULT_LOCALE)) {
    list.push({
      locale: 'x-default',
      href: new URL(localizedPath(pathWithoutLocale, DEFAULT_LOCALE), SITE.url).toString(),
    });
  }
  return list;
}

/** 计算某个本地化路径对应的 canonical URL。 */
export function canonicalUrl(pathname: string): string {
  return new URL(pathname, SITE.url).toString();
}

/** 生成语言切换器显示用的友好标签。 */
export function localeLabel(locale: Locale): string {
  switch (locale) {
    case 'zh':
      return '中文';
    default:
      return '中文';
  }
}

/** 用于 `<html lang>` 和日期格式化的 ISO BCP 47 语言标签。 */
export function htmlLang(locale: Locale): string {
  switch (locale) {
    case 'zh':
      return 'zh-CN';
    default:
      return 'zh-CN';
  }
}
