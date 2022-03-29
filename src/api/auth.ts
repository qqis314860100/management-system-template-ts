import { localStorageKey } from 'common/contants'
import { LoginInfo } from 'types/login'
import req from 'common/request'

export const getToken = () => window.localStorage.getItem(localStorageKey)

export const setToken = ({ user }: { user: LoginInfo }) =>
  window.localStorage.setItem(localStorageKey, user.token || '')

export const login = (data: {
  username: string
  password: string
  code: string
}) => req.post({ url: '/login', data }).then((res) => res.data as any)

export const register = (data: { username: string; password: string }) =>
  req.post({ url: '/register', data }).then((res) => res.data as any)

export const logout = () => window.localStorage.removeItem(localStorageKey)
export default { getToken, login, setToken, register, logout }
