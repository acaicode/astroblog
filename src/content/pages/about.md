---
title: 关于
description: Chirping Astro —— 一款受 Chirpy 启发的多语言 Astro 博客主题，为写作者和创作者打造。
---

**Chirping Astro** 是一款开源主题，将广受欢迎的
[Chirpy Jekyll 主题](https://chirpy.cotes.page/) 的外观与体验带到了
[Astro](https://astro.build/) 平台 —— 具备一流的国际化支持、
现代化的工具链，默认情况下零 JavaScript 即可阅读。

适用于个人博客、技术日志和文档站点，在排版、搜索和沉浸式阅读体验方面表现出色。

## 功能概览

- **阅读优先的布局** — 固定左侧边栏，包含头像、垂直导航、主题切换和社交链接；居中主栏最大宽度 1250px；右侧面板展示"最近更新"和"热门标签"。
- **浅色与深色主题** — 原版 Chirpy 配色方案，移植到 daisyUI v5 设计令牌，主题切换带有圆形扩散过渡动画。
- **Markdown + MDX** — Astro Content Collections 支持类型化 frontmatter、Shiki 语法高亮、GFM、脚注、自动目录以及内置 `<Callout>` 组件。
- **LaTeX 数学公式** — 通过 `math: true` 按文章可选启用 KaTeX 支持。
- **即时搜索** — [Pagefind](https://pagefind.app/) 在构建时生成静态搜索索引，搜索面板按需加载。
- **评论系统** — 集成 Twikoo，支持单篇文章关闭评论。
- **流畅导航** — Astro 视图过渡动画，兼顾无障碍的减弱动画回退。
- **开箱即用的 SEO** — OpenGraph、Twitter Cards、RSS、hreflang 和 Sitemap。

## 技术栈

- [**Astro 6.x**](https://astro.build/) — Content Collections、MDX、RSS 和视图过渡
- [**Tailwind CSS v4**](https://tailwindcss.com/) 通过 `@tailwindcss/vite` 插件，搭配 [**daisyUI v5**](https://daisyui.com/) 主题系统
- [**Pagefind**](https://pagefind.app/) 静态搜索
- [**Twikoo**](https://twikoo.js.org/) 评论系统
- [**Shiki**](https://shiki.style/)、[**KaTeX**](https://katex.org/) 和
  [**Lucide**](https://lucide.dev/) 图标

## 个性化定制

几乎所有配置都通过单一的类型化配置文件 [`src/config.ts`](https://github.com/) 控制 —— 站点标题、作者、导航、社交链接、每页文章数、默认语言、Twikoo 设置和功能开关。修改后重启 `bun run dev` 即可生效。

新文章放在 `src/content/posts/` 中。Frontmatter 参考见本演示站点中的说明。

## 许可与鸣谢

基于 **MIT 协议** 发布。视觉设计致敬
[Cotes Chung's Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy)；
Astro 实现、内容和代码均为独立作品。
