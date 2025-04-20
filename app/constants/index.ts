export const APP_NAME = '清研'
export const APP_DESC = '清研'

// 手机号加密前缀
export const PHONE_ENCRYPT_PREFIX = 'wbc'

/** 首页路由 */
export const HOME_ROUTE = '/knowledge-base'

// 定义文件类型枚举
export enum FileType {
  PPT = 'ppt',
  DOC = 'doc',
  EXCEL = 'excel',
  PICTURE = 'picture',
  // 可以根据需要添加更多类型
}

// 定义文件过滤选项枚举
export enum FileFilterType {
  PERSONAL = 'personal',
  TEAM = 'team',
  SHARED = 'shared',
  PERSONAL_SHARED = 'personal_shared',
  TEAM_SHARED = 'team_shared',
}

// AI文档类型枚举
export enum AiDocType {
  PPT = 'ppt',
  WORD = 'word',
  EXCEL = 'excel',
}
