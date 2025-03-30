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

interface Template {
  id: string
  type: string
  file_type: string
  title: string
  content: string
  image: string
  preview_url: string
}

// /copy?url=https://www.writebug.com 接口返回的数据结构
interface CopyApiResponse<T> {
  code: number
  data: T
  message: string
}
