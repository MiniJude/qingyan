import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
  })
}

export function $api(url: string, options?: any) {
  const { $api } = useNuxtApp()
  return $api(url, options)
}
