/**
 * 轻量级 reading-time 估算器。
 * 这里没有引入完整的 `reading-time` 包，因为文章正文已经通过
 * Astro 的 `render()` 处理过，我们手头也已经有可用的词数统计。
 */

const WORDS_PER_MINUTE = 220;

export interface ReadingTime {
  /** 整分钟数，最少为 1。 */
  minutes: number;
  /** 词数。 */
  words: number;
}

export function readingTime(text: string): ReadingTime {
  const words = text
    .replace(/```[\s\S]*?```/g, ' ') // 去掉 fenced code
    .replace(/<[^>]+>/g, ' ') // 去掉 HTML
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
  return {
    words,
    minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
}
