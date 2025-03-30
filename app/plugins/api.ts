import { ElMessage } from 'element-plus'

function copyApiResponseHandler<T>(response: CopyApiResponse<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    // 如果返回的code不是50000，则抛出错误
    if (response.code !== 20000) {
      ElMessage.error(response.message)
      reject(new Error(response.message))
    }

    resolve(response.data)
  })
}

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig()
  //   const { session } = useUserSession()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request: _request, options: _options, error: _error }) {
    //   if (session.value?.token) {
    //     // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
    //     options.headers.set('Authorization', `Bearer ${session.value?.token}`)
    //   }
    },
    // onResponse钩子不应返回值，只应执行副作用
    onResponse({ response: _response }) {
      // 可以在这里执行副作用，但不返回任何值
    },
    async onResponseError({ response: _response }) {
      // if (response.status === 401) {
      //   await nuxtApp.runWithContext(() => navigateTo('/sys/logon'))
      // }
    },
  })

  // 包装 api 函数以处理特殊路径
  const apiWrapper = <T>(url: string, options?: any): Promise<T> => {
    // 如果是 /copy 路径，使用根路径而不是 apiBase
    if (url.startsWith('/copy')) {
      // 直接发送请求到服务器代理路由，不在客户端解析URL
      return $fetch<CopyApiResponse<T>>(url, options).then(res => copyApiResponseHandler<T>(res))
    }
    // 其他正常路径使用配置的 api
    return api<T>(url, options)
  }

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api: apiWrapper,
    },
  }
})
