import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const { $api } = useNuxtApp()
  return useFetch(url, {
    ...options,
    $fetch: $api as typeof $fetch,
  })
}

export function $api<T>(url: string, options?: any): Promise<T> {
  const { $api } = useNuxtApp()
  return $api<T>(url, options)
}
