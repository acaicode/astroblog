---
title: '开始使用'
description: '欢迎使用 Chirping Astro 博客主题。了解如何配置站点、撰写文章并部署上线。'
pubDate: 2026-05-03
tags: [入门, 教程]
categories: [指南]
pinned: true
toc: true
---

欢迎来到你的新博客！本文将通过实例带你了解 **Chirping Astro** 的基本用法。

## 配置站点

打开 `src/config.ts` 并修改以下内容：

- **title** — 站点/博客名称
- **description** — 用于搜索引擎和 RSS
- **author.name** — 显示在侧边栏和页脚
- **url** — 生产环境 URL（部署时通过 `SITE_URL` 环境变量设置）

## 环境变量

将 `.env.example` 复制为 `.env`：

```bash
cp .env.example .env
```

重要变量：

| 变量                   | 用途                                          |
| ---------------------- | --------------------------------------------- |
| `SITE_URL`             | 生产环境 URL（如 `https://myblog.com`）        |
| `BASE_PATH`            | GitHub Pages 设为 `/<仓库名>`，其他留空        |
| `PUBLIC_GITHUB_HANDLE` | 在侧边栏显示 GitHub 图标                      |
| 评论系统               | 在 `src/config.ts` 中配置 Twikoo              |

## 撰写文章

在 `src/content/posts/` 中创建 Markdown 文件：

```markdown
---
title: '文章标题'
description: '用于 SEO 和列表展示的简要描述。'
pubDate: 2026-05-03
tags: [标签1, 标签2]
categories: [分类]
---

在这里用标准 Markdown 撰写你的内容。
```

### 可用的 Frontmatter 字段

| 字段           | 必填 | 说明                   |
| -------------- | ---- | ---------------------- |
| `title`        | 是   | 文章标题（1–140 字符）  |
| `description`  | 是   | Meta 描述（1–280 字符） |
| `pubDate`      | 是   | 发布日期（ISO 格式）    |
| `tags`         | 否   | 标签数组               |
| `categories`   | 否   | 分类数组               |
| `heroImage`    | 否   | 特色图片路径           |
| `pinned`       | 否   | 置顶到列表顶部         |
| `toc`          | 否   | 显示目录               |
| `draft`        | 否   | 在生产环境隐藏         |

## 使用 MDX

如需更丰富的内容，可以使用 `.mdx` 文件来嵌入组件：

```mdx
---
title: 'MDX 示例'
description: '在文章中使用组件。'
pubDate: 2026-05-03
tags: [mdx]
categories: [指南]
---

import Callout from '../../components/Callout.astro';

<Callout type="tip">你可以直接在文章中嵌入 Astro 组件！</Callout>
```

## 部署

推送到 GitHub 的 `main` 分支，配套的 GitHub Actions 工作流会自动构建并部署到 GitHub Pages。

如需自定义域名，请在仓库的 **Settings → Environments → github-pages** 中设置 `SITE_URL`。

## 了解更多

- [完整文档](https://github.com/kannansuresh/chirping-astro)
- [在线演示](https://kannansuresh.github.io/chirping-astro)
- [Astro 文档](https://docs.astro.build)

---

祝你写博客愉快！准备好发布自己的内容时，可以删除这篇文章。
