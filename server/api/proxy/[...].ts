export default defineEventHandler(async (event) => {
  // 获取请求方法和请求路径
  const method = getMethod(event)
  const _path = getRouterParam(event, '_') || ''

  // 获取请求体（如果有）
  const body = method !== 'GET' ? await readBody(event) : undefined

  // 获取查询参数
  const query = getQuery(event)
  const targetUrl = query.url as string

  if (!targetUrl) {
    throw createError({
      statusCode: 400,
      message: '缺少目标 URL 参数',
    })
  }

  try {
    // 获取原始请求头
    const reqHeaders = getHeaders(event)
    // 创建新的请求头对象，排除不需要的头
    const headers: Record<string, string> = {}

    // 复制需要的头信息
    Object.keys(reqHeaders).forEach((key) => {
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'content-length') {
        const value = reqHeaders[key]
        if (value !== undefined) {
          headers[key] = value
        }
      }
    })

    const response = await $fetch(targetUrl, {
      method,
      body,
      headers,
    }) as any

    // 返回 data 字段或整个响应
    return response.data || response
  }
  catch (error: any) {
    console.error('代理请求失败:', error.message)
    throw createError({
      statusCode: error.status || 500,
      message: error.message || '代理请求失败',
    })
  }
})
