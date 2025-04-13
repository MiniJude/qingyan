/**
 * 处理内容，移除HTML标签和Markdown标记
 * @param content 需要处理的内容字符串
 * @returns 处理后的纯文本内容
 */
export function processContent(content: string): string {
  if (!content)
    return ''

  // 一次性替换所有标记
  return content
    .replace(/<[^>]+>/g, '') // HTML标签
    .replace(/#{1,6}\s?|(\*\*|__)|(\*|_)|\n\s*>|\n\s*-\s|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g, '') // Markdown标记
    .trim()
}
