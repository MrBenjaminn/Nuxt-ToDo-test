declare module '*.svg?component' {
  import type { DefineComponent, ComponentOptions } from 'vue'
  const component: DefineComponent<{}, {}, any> | ComponentOptions
  export default component
}

declare module '*.svg?raw' {
  const content: string
  export default content
}
