type FileType = 'doc' | 'pdf' | 'ppt' | 'wechat-article' | 'wechat-records' | 'url' | 'picture' | 'link'

interface FileTreeType {
  label: string
  id: string
  children?: FileTreeType[]
  level?: number
  type?: 'folder' | 'file'
  fileType?: FileType
}

type OptionalIdTree<T extends { children?: T[] }> = Omit<T, 'id' | 'children'> & {
  id?: string
  children?: OptionalIdTree<T>[]
}

type FileTreeTypeWithOptionalId = OptionalIdTree<FileTreeType>
