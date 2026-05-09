/**
 * UI 文案字典。
 * 如需新增 locale，需要同时在 `messages` 和 `src/config.ts` 的
 * `SITE.locales` 中添加对应项。每个 locale 都必须具备完整 key 集合，
 * 这一点会由 TypeScript 约束。
 */

import type { Locale } from '../config';

export const messages = {
  zh: {
    'site.skipToContent': '跳到内容',

    'nav.home': '首页',
    'nav.posts': '文章',
    'nav.tags': '标签',
    'nav.categories': '分类',
    'nav.archives': '归档',
    'nav.about': '关于',
    'nav.search': '搜索',
    'nav.toggleMenu': '切换菜单',

    'theme.toggle': '切换主题',
    'theme.light': '浅色',
    'theme.dark': '深色',
    'theme.system': '跟随系统',

    'lang.switcher': '语言',
    'lang.en': 'English',
    'lang.fr': 'French',

    'post.publishedOn': '发布于',
    'post.updatedOn': '更新于',
    'post.readingTime': '分钟阅读',
    'post.toc': '目录',
    'post.tags': '标签',
    'post.categories': '分类',
    'post.previous': '上一篇',
    'post.next': '下一篇',
    'post.comments': '评论',
    'post.commentsDisabled': '该文章已关闭评论。',
    'post.share': '分享',
    'post.copyLink': '复制链接',
    'post.copied': '已复制！',
    'post.author': '作者',

    'list.allPosts': '全部文章',
    'list.empty': '暂无文章。',
    'list.tagPosts': '标签下的文章',
    'list.categoryPosts': '分类下的文章',
    'list.totalPosts': '篇',
    'list.totalPostsOne': '篇',

    'pagination.previous': '上一页',
    'pagination.next': '下一页',
    'pagination.page': '第',
    'pagination.of': '/',

    'archives.title': '归档',
    'archives.empty': '暂无文章。',

    'tags.title': '标签',
    'tags.empty': '暂无标签。',

    'categories.title': '分类',
    'categories.empty': '暂无分类。',

    'search.title': '搜索',
    'search.placeholder': '搜索站点内容',
    'search.openLabel': '打开搜索',
    'search.closeLabel': '关闭搜索',
    'search.empty': '无结果。',
    'search.loading': '正在加载搜索…',
    'search.typeToStart': '输入关键词开始搜索…',
    'search.hintShortcut': '按 / 键打开搜索',
    'search.searching': '搜索中…',
    'search.noResultsFor': '未找到与',
    'search.resultsCount': '条结果',
    'search.resultsCountOne': '条结果',
    'search.hintNavigate': '导航',
    'search.hintSelect': '打开',
    'search.clearLabel': '清除',

    'code.copy': '复制',
    'code.copied': '已复制',

    '404.title': '页面未找到',
    '404.description': '您要查找的页面已经飞走了。',
    '404.cta': '回到首页',

    'footer.poweredBy': 'Powered by',
    'footer.theme': 'Theme',
    'footer.privacy': '隐私政策',
    'footer.copyright': '保留所有权利。',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof messages)['zh'];
