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
