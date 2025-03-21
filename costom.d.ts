declare module '*.svg' {
  import type { Component } from 'vue'

  const component: Component
  export default component
}

declare module '*.svg?skipsvgo' {
  import type { Component } from 'vue'

  const component: Component
  export default component
}

declare module '*.svg?component' {
  import type { Component } from 'vue'

  const component: Component
  export default component
}
