/**
 * Content Collections（Astro v6 loader API）。
 *
 * 目录约定：`src/content/<collection>/<locale>/**`
 *  - posts/en/**  -> EN posts
 *  - posts/fr/**  -> FR posts
 *  - pages/en/**  -> EN 静态页面（about 等）
 *  - pages/fr/**  -> FR 静态页面
 *
 * locale 会从文件路径推导出来，因此作者通常不需要手动填写，
 * 但也可以在 frontmatter 里覆盖。
 */

import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

import { SITE } from './config';

const localeEnum = z.enum(SITE.locales as unknown as [string, ...string[]]);

/**
 * 构建文章 / 页面使用的 frontmatter schema。
 *
 * `heroImage` 支持三种形式：
 *   1. 通过 `image()` 导入的资源：路径相对当前 Markdown 文件，
 *      指向 `src/assets/...`。Astro 会通过图片管线处理它，
 *      包括 WebP、响应式 `srcset`、自动推断宽高。这是推荐方式。
 *   2. public 路径（例如 `/images/foo.jpg`）：原样复制，不做优化。
 *   3. 外部 URL（https://...）：只有当 host 被加入
 *      `astro.config.mjs` 的 `image.remotePatterns` 白名单时，
 *      才会在构建时参与优化。
 */
const baseFrontmatter = ({ image }: SchemaContext) =>
  z.object({
    title: z.string().min(1).max(140),
    description: z.string().min(1).max(280),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.union([image(), z.string()]).optional(),
    /** hero/featured image 的可选 alt 文本。 */
    heroImageAlt: z.string().optional(),
    /** 单篇文章覆盖 SITE.showFeaturedImages（卡片 + hero）。 */
    showFeaturedImage: z.boolean().optional(),
    /** 单篇文章覆盖 SITE.dynamicPostCardHeight。 */
    dynamicPostCardHeight: z.boolean().optional(),
    canonicalURL: z.url().optional(),
    comments: z.boolean().optional(),
    toc: z.boolean().default(true),
    /** 置顶到列表顶部。 */
    pinned: z.boolean().default(false),
    /**
     * 是否启用 LaTeX 数学公式渲染（KaTeX）。
     * 为 `true` 时，layout 只会在当前页面加载 `katex.min.css`，
     * 避免不需要数学公式的文章也引入这份样式。
     */
    math: z.boolean().default(false),
    /** 可选 locale 覆盖；默认从路径推导。 */
    lang: localeEnum.optional(),
    /**
     * 用于把不同语言版本的文章关联起来。多个 locale 共享同一个
     * `translationKey` 时，会被视为互译文章，语言切换器会跳转到
     * 对应的同篇文章。
     *
     * 如果省略，则回退到文件 slug（相对于 locale 目录）。
     */
    translationKey: z.string().optional(),
  });

export type PostFrontmatter = z.infer<ReturnType<typeof baseFrontmatter>>;

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
  }),
  schema: baseFrontmatter,
});

const pages = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pages',
  }),
  schema: (ctx) =>
    baseFrontmatter(ctx)
      .partial({ pubDate: true })
      .extend({
        /** Pages 不参与分页，也不会出现在 archives。 */
        showInNav: z.boolean().default(false),
      }),
});

export const collections = { posts, pages };
