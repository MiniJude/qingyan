// composables/useBreakpoints.ts
import { useMediaQuery } from '@vueuse/core'

export function useBreakpoints() {
  const isLtSm = useMediaQuery('(max-width: 639px)')
  const isLtMd = useMediaQuery('(max-width: 767px)')
  const isLtLg = useMediaQuery('(max-width: 1023px)')
  const isLtXl = useMediaQuery('(max-width: 1279px)')

  return {
    isLtSm,
    isLtMd,
    isLtLg,
    isLtXl,
  }
}
