import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 我们就在这里通过改写 config 配置信息来实现业务功能的统一处理
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  // 注意：这里一定要返回 config，否则请求就发不出去了
  return config
}, function (error) {
  return Promise.reject(error)
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token 只能使用1次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 相应拦截器
let isRfreshing = false // 控制刷新 token 的状态
let requests: any[] = [] // 存储刷新 token 期间过来的 401 请求
request.interceptors.response.use(function (response) { // 状态码 2.。进入
  // 自定义错误状态码
  return response
}, async function (error) { // 超出 2xx 状态码都都执行这里
  // 如果是使用的 HTTP 状态码
  if (error.response) { // 请求发出去收到响应了，但是状态码超出了 2xx 范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token 无效（没有提供 token、token 是无效的、token 过期了）
      // 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
      if (!store.state.user) { // 如果没有 直接跳转登录页
        redirectLogin()
        return Promise.reject(error)
      }

      // 刷新 token
      if (!isRfreshing) {
        isRfreshing = true // 开启刷新状态
        // 尝试刷新获取新的 token
        return refreshToken().then(res => {
          if (!res.data.success) { // 抛出异常
            throw new Error('刷新 Token 失败')
          }

          //  成功 => 重新请求
          store.commit('setUser', res.data.content)
          // 把 requests 队列中的请求重新发出去
          requests.forEach(cb => cb())
          // 重置 requests 数组
          requests = []
          return request(error.config)
        }).catch(err => {
          //  失败 => 跳转登录页 重新登陆
          console.log(err)
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRfreshing = false // 重置刷新状态
        })
      }

      // 刷新状态下，把请求挂起放到 requests 数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去没有收到响应
    Message.error('请求超时，请刷新重试')
  } else { // 在设置请求时发生了一些事情，触发了一个错误
    Message.error(`请求失败：${error.message}`)
  }

  // 把请求失败的错误对象继续抛出，扔给上一个调用者
  return Promise.reject(error)
})

export default request

// 关于token过期
// access_token 获取需要权限的接口数据
// expires_in token过期时间
// refresh_token 获取新的token

// 1
// 请求拦截器中判断 token 是否过期 若已过期 将请求挂起 先刷新token再继续请求
// 优点
// 在请求前拦截 能节省请求 省流量
// 缺点
// 需要后续额外提供一个token时间过期的字段 使用本地时间判断 若本地时间被篡改 特别是本地时间比服务器时间慢 拦截会出现问题

// 2
// 不在请求前拦截 而是拦截返回的数据 先发起请求 接口返回过期后 刷新token 在进行一次请求
// 优点
// 不需要额外的token过期字段 不需要判断时间
// 缺点
// 会消耗多一次请求 耗流量

// 1和2优缺点是互补的 1有校验失败的风险（本地时间和服务器时间不同。。。。） 2更加粗暴 等返回失效 再重试一次 会多消耗一个请求
