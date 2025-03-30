#目录文件说明


## app

### plugins

#### api.ts

封装请求，统一设置baseURL、请求头、错误处理等

最后将 $api 挂载到 nuxtApp 上

### composables

#### useApi.ts

useAPI 和 $api 的封装，业务中使用的都是它们

- useAPI 是 useFetch 的封装(但最后也会调用 $api)
- $api 是 $fetch 的封装

useFetch 和 $fetch 两者使用场景有区别，可以看[Nuxt3文档](https://nuxt.com/docs/getting-started/data-fetching)

## server

### routes

#### copy.ts

转发以 `/copy` 开头的请求，解决跨域问题

开发阶段没有接口，要从 https://www.writebug.com/ 获取数据




### utils

### middleware



