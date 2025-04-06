import { useId } from 'vue'

// 递归为树节点添加唯一ID
export function addUidToNodes(nodes: FileTreeTypeWithOptionalId[]): FileTreeType[] {
  return nodes.map((node) => {
    const nodeWithUid = {
      ...node,
      id: useId(),
    }

    if (nodeWithUid.children && nodeWithUid.children.length > 0) {
      nodeWithUid.children = addUidToNodes(nodeWithUid.children)
    }

    return nodeWithUid as FileTreeType
  })
}

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
