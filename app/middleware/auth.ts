export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('token')
  const localePath = useLocalePath()
  if (!token.value) {
    return navigateTo(localePath('/403' as I18nRoutePath))
  }
})
