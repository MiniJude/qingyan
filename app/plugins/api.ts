import { ElMessage } from 'element-plus'

function ResponseHandler<T>(response: ApiResponse<T>): Promise<T> {
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
  // 注意：我们这里不需要直接使用config，因为使用服务器端代理
  // const config = useRuntimeConfig()
  // const { session } = useUserSession()

  const api = $fetch.create({
    // 不设置baseURL，让服务器端API代理处理
    // baseURL: config.public.apiBase,
    onRequest({ request: _request, options, error: _error }) {
    //   if (session.value?.token) {
    //     // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
    //     options.headers.set('Authorization', `Bearer ${session.value?.token}`)
    //   }

      // 确保headers存在
      if (!options.headers) {
        options.headers = new Headers()
      }

      // 添加CSRF防护等其他必要请求头
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

  // 包装 api 函数以处理返回数据
  const apiWrapper = <T>(url: string, options?: any): Promise<T> => {
    return api<ApiResponse<T>>(url, options).then(res => ResponseHandler<T>(res))
  }

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api: apiWrapper,
    },
  }
})
