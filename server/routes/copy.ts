export default defineEventHandler(async (event) => {
  // 获取 URL 参数
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw createError({
      statusCode: 400,
      message: '缺少必要的 URL 参数',
    })
  }

  // 获取请求方法和请求体
  const method = event.method
  const body = method !== 'GET' ? await readBody(event) : undefined

  // 直接请求外部URL，服务器端不存在跨域问题
  const response = await $fetch(url, {
    method,
    body,
  }) as any

  return response
})
