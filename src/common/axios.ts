import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { stringify } from 'qs'
import * as R from 'ramda'
import { localStorageKey } from 'common/contants'
import commonConfig from 'common/config'
import { successAlert, errorAlert } from 'utils/alert'
import qs from 'qs'

const { CancelToken } = axios

export const REPEAT = 'repeat message:999999'

class HttpRequest {
  public baseUrl!: string
  public pending!: {
    [propName: string]: any
  }

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.pending = {}
  }

  public removePending(key: string | number, isRequest = false): void {
    if (isRequest && this.pending[key]) {
      this.pending[key](REPEAT)
    }
    delete this.pending[key]
  }

  /**获取axios配置 */
  public getInsideConfig(): AxiosRequestConfig {
    const config = {
      baseUrl: this.baseUrl,
      Headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      timeout: 1000 * 30,
    }
    return config
  }

  public interceptors(instance: AxiosInstance) {
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      const key = `${config.url}&${config.method}${stringify(config.data)}`
      const token = localStorage.getItem(localStorageKey)
      let isPublic = false
      commonConfig.publicPath.map((path) => {
        if (config.url) {
          isPublic = isPublic || path.test(config.url)
          return path
        }
      })
      if (!isPublic && token) {
        const auth_token = `Bearer ${token}`
        config.headers!.token = auth_token
      }
      this.removePending(key, true)

      config.cancelToken = new CancelToken((c) => {
        this.pending[key] = c
      })
      return config
    })

    instance.interceptors.response.use(
      (res: AxiosResponse) => {
        const data = res.config.data ? JSON.parse(res.config.data) : ''
        const key = `${res.config.url}&${res.config.method}${stringify(data)}`
        this.removePending(key)
        if (res.status === 200) {
          if (res.data.status === 200 || res.data.code === 200) {
            if (res.config.params && res.config.params.sucAlert) {
              successAlert(res.data.msg || res.data.message)
            }
            return Promise.resolve(res.data)
          } else {
            return Promise.reject(res.data.msg || res.data.message)
          }
        } else if (res.status === 401) {
          window.location.reload()
          return Promise.reject({ message: '请重新登陆' })
        } else {
          return Promise.reject(res)
        }
      },
      (err) => {
        if (err.message.includes(REPEAT)) {
          return Promise.reject(new Error(REPEAT))
        } else {
          // errorAlert('服务器或者网络异常')
          return Promise.reject(err)
        }
      }
    )
  }

  public request<T>(options: AxiosRequestConfig): AxiosPromise<T> {
    const instance = axios.create()
    const newOptions = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance)
    return instance(newOptions)
  }

  public get<T>({
    url,
    data,
    config,
  }: {
    url: string
    data?: { [propName: string]: any }
    config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>
  }): AxiosPromise<T> {
    if (data && Object.keys(data).length) {
      url = `${url}?${qs.stringify(data)}`
    }
    return this.request<T>({ method: 'get', url, ...config })
  }

  public post<T>({
    url,
    data,
    config,
  }: {
    url: string
    data?: { [propName: string]: any }
    config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>
  }): AxiosPromise<T> {
    return this.request<T>({ method: 'post', url, data, ...config })
  }
}

export default HttpRequest
