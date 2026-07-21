declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@presentation/*' {
  const component: any
  export default component
}

declare module '@components/*' {
  const component: any
  export default component
}
