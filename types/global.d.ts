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

interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

/** 流程弹框的每个步骤的类型 */
interface FlowStepItem {
  component: ShallowRef<Component>
  title?: string
  props?: Record<string, any>
  showFooter?: boolean
}

/** 国际化路由路径 */
type I18nRoutePath = keyof RouteNamedMapI18n | RouteLocationI18nGenericPath
