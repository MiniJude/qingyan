// 文件类型枚举
export enum FileType {
  Document = 'document',
  Pdf = 'pdf',
  Image = 'image',
  Presentation = 'presentation',
  Unknown = 'unknown',
}

// 文件信息接口
export interface FileInfo {
  id: string
  name: string
  type: FileType
  size?: number
  url?: string
}

// 根据文件MIME类型获取FileType
export function getFileTypeFromMime(mimeType: string): FileType {
  if (mimeType.startsWith('image/')) {
    return FileType.Image
  }

  if (mimeType === 'application/pdf') {
    return FileType.Pdf
  }

  if (mimeType.includes('presentation')
    || mimeType === 'application/vnd.ms-powerpoint'
    || mimeType.includes('officedocument.presentationml')) {
    return FileType.Presentation
  }

  if (mimeType.includes('text/')
    || mimeType === 'application/msword'
    || mimeType.includes('officedocument.wordprocessingml')
    || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return FileType.Document
  }

  return FileType.Unknown
}

// 根据文件扩展名获取FileType
export function getFileTypeFromExtension(filename: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase() || ''

  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return FileType.Image
    case 'pdf':
      return FileType.Pdf
    case 'ppt':
    case 'pptx':
      return FileType.Presentation
    case 'doc':
    case 'docx':
    case 'txt':
    case 'md':
    case 'rtf':
      return FileType.Document
    default:
      return FileType.Unknown
  }
}
