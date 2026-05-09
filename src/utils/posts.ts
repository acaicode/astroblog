/**
 * 文章辅助函数。
 *
 * 对 `astro:content` collection API 做了一层封装，用来：
 *  - 在生产环境过滤 draft
 *  - 从文件路径推导 locale（例如 posts/en/foo -> 'en'）
 *  - 按 pubDate 倒序排序，并让置顶文章优先
 *  - 按 tag / category / month 分组
 *  - 通过 `translationKey` 解析互译文章
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

import { SITE, type Locale } from '../config';
import { withBase } from '../i18n/utils';

export type Post = CollectionEntry<'posts'> & {
  data: CollectionEntry<'posts'>['data'] & { lang: Locale; translationKey: string };
};

const isProd = import.meta.env.PROD;
const skipPostCollections = import.meta.env.CI_SKIP_CONTENT_COLLECTIONS === 'true';

/** 从 `posts/<locale>/foo` 这种 ID 中推导 locale。 */
function localeFromId(id: string): Locale {
  const seg = id.split(/[\\/]/)[0];
  if (seg && (SITE.locales as readonly string[]).includes(seg)) return seg as Locale;
  return SITE.defaultLocale;
}

/** 从内容 ID 中移除 locale 前缀。 */
function stripLocaleFromId(id: string): string {
  const segs = id.split(/[\\/]/);
  if (segs[0] && (SITE.locales as readonly string[]).includes(segs[0])) {
    return segs.slice(1).join('/');
  }
  return id;
}

/** 标准化文章条目，确保 `lang` 和 `translationKey` 都存在。 */
function normalize(entry: CollectionEntry<'posts'>): Post {
  const lang = entry.data.lang ?? localeFromId(entry.id);
  const translationKey = entry.data.translationKey ?? stripLocaleFromId(entry.id);
  return {
    ...entry,
    data: { ...entry.data, lang, translationKey },
  } as Post;
}

/** 生成对外 URL 使用的 slug：去掉 locale 和扩展名后的文件名。 */
export function postSlug(entry: Post): string {
  return stripLocaleFromId(entry.id).replace(/\.(md|mdx)$/i, '');
}

/** 生成文章的完整本地化 URL 路径。 */
export function postPath(entry: Post): string {
  const slug = postSlug(entry);
  const path =
    entry.data.lang === SITE.defaultLocale
      ? `/posts/${slug}/`
      : `/${entry.data.lang}/posts/${slug}/`;
  return withBase(path);
}

/** 文章排序：先按 pinned，再按 pubDate 倒序。 */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    const at = a.data.pubDate?.valueOf?.() ?? 0;
    const bt = b.data.pubDate?.valueOf?.() ?? 0;
    return bt - at;
  });
}

/**
 * 严格按 `pubDate` 排序（最新在前），忽略 `pinned`。
 *
 * 这个排序用于上一篇 / 下一篇导航：
 * 置顶文章不应该把最新文章硬拉到第 0 位，破坏真实时间顺序，
 * 否则会出现较新的文章被标成旧文章“上一篇”的问题。
 */
export function sortPostsByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const at = a.data.pubDate?.valueOf?.() ?? 0;
    const bt = b.data.pubDate?.valueOf?.() ?? 0;
    return bt - at;
  });
}

/** 获取某个 locale 下的所有文章（生产环境隐藏 draft，并完成排序）。 */
export async function getPosts(locale: Locale): Promise<Post[]> {
  if (skipPostCollections) return [];
  const all = await getCollection('posts', (entry) => {
    if (isProd && entry.data.draft) return false;
    const lang = entry.data.lang ?? localeFromId(entry.id);
    return lang === locale;
  });
  return sortPosts(all.map(normalize));
}

/** 按 locale + slug 查找单篇文章。 */
export async function getPostBySlug(locale: Locale, slug: string): Promise<Post | undefined> {
  const posts = await getPosts(locale);
  return posts.find((p) => postSlug(p) === slug);
}

/** 获取一篇文章的所有互译版本（共享 translationKey 的其他 locale）。 */
export async function getTranslations(entry: Post): Promise<Record<Locale, Post | undefined>> {
  const out: Record<string, Post | undefined> = {};
  for (const locale of SITE.locales) {
    if (locale === entry.data.lang) {
      out[locale] = entry;
      continue;
    }
    const all = await getPosts(locale as Locale);
    out[locale] = all.find((p) => p.data.translationKey === entry.data.translationKey);
  }
  return out as Record<Locale, Post | undefined>;
}

/** 获取某个 locale 的标签及计数，先按数量倒序，再按字母序。 */
export async function getTagsWithCount(
  locale: Locale,
): Promise<Array<{ name: string; count: number }>> {
  const posts = await getPosts(locale);
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 获取某个 locale 的分类及计数。 */
export async function getCategoriesWithCount(
  locale: Locale,
): Promise<Array<{ name: string; count: number }>> {
  const posts = await getPosts(locale);
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const c of p.data.categories) map.set(c, (map.get(c) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 为 archives 页面按 year -> month 对文章分组。 */
export function groupByYearMonth(
  posts: Post[],
  _locale: Locale,
): Array<{
  year: number;
  months: Array<{ month: number; label: string; posts: Post[] }>;
}> {
  const buckets = new Map<number, Map<number, Post[]>>();
  for (const post of posts) {
    const date = post.data.pubDate;
    if (!date) continue;
    const y = date.getFullYear();
    const m = date.getMonth();
    if (!buckets.has(y)) buckets.set(y, new Map());
    const months = buckets.get(y)!;
    if (!months.has(m)) months.set(m, []);
    months.get(m)!.push(post);
  }
  const lang = 'zh-CN';
  const fmt = new Intl.DateTimeFormat(lang, { month: 'long' });
  return Array.from(buckets.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, months]) => ({
      year,
      months: Array.from(months.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([month, list]) => ({
          month,
          label: fmt.format(new Date(year, month, 1)),
          posts: list,
        })),
    }));
}

/**
 * 判断文章是否应该显示 featured（hero）图片，
 * 同时考虑单篇覆盖项 `showFeaturedImage`
 * 与全站默认值 `SITE.showFeaturedImages`。
 *
 * 当文章没有 `heroImage` 时，直接返回 `false`。
 */
export function shouldShowHero(post: Post): boolean {
  if (!post.data.heroImage) return false;
  return post.data.showFeaturedImage ?? SITE.showFeaturedImages;
}

/** 获取文章 hero image 的源 URL/路径；没有则返回 `undefined`。 */
export function heroImageSrc(post: Post): string | undefined {
  const img = post.data.heroImage;
  if (!img) return undefined;
  let src: string | undefined;
  if (typeof img === 'string') src = img;
  // 如果是导入资源（ImageMetadata），取出它的公开 URL。
  else if (typeof img === 'object' && 'src' in (img as Record<string, unknown>)) {
    src = (img as { src: string }).src;
  }
  if (!src) return undefined;
  // 对指向 /public 的绝对路径补上配置里的 base 前缀。
  return src.startsWith('/') && !src.startsWith('//') ? withBase(src) : src;
}

/**
 * 获取原始 hero image，可直接传给 `<SmartImage>`。
 * 对通过 `image()` schema 导入的资源，会保留 `ImageMetadata` 结构，
 * 这样图片管线仍能使用其固有尺寸；对于普通 `/public/...` 字符串，
 * 则只补上 `withBase()`。
 */
export function heroImage(post: Post): ImageMetadata | string | undefined {
  const img = post.data.heroImage;
  if (!img) return undefined;
  if (typeof img === 'string') {
    return img.startsWith('/') && !img.startsWith('//') ? withBase(img) : img;
  }
  return img as ImageMetadata;
}

/** 将 tag/category 转成可用于 URL 的 slug。 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** 为指定 locale 生成 tag 列表页 URL。 */
export function tagPath(locale: Locale, tag: string): string {
  const slug = slugify(tag);
  const path = locale === SITE.defaultLocale ? `/tags/${slug}/` : `/${locale}/tags/${slug}/`;
  return withBase(path);
}

/** 为指定 locale 生成 category 列表页 URL。 */
export function categoryPath(locale: Locale, category: string): string {
  const slug = slugify(category);
  const path =
    locale === SITE.defaultLocale ? `/categories/${slug}/` : `/${locale}/categories/${slug}/`;
  return withBase(path);
}
