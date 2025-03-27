export default defineNuxtPlugin((nuxtApp) => {
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
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/sys/logon'))
      }
    },
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  }
})
