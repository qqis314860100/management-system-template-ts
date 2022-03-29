import React, { FC } from 'react'
import { useQueryClient } from 'react-query'
import auth from 'api/auth'
import { useMount, useMountedRef } from 'hooks'
import { useCallback } from 'react'
import { useAsync } from 'hooks/useAsync'
import {
  FullScreenErrorFallback,
  FullScreenLoading,
} from 'components/lib/FullScreen'

interface UserInfo {
  code: string
  username: string
  password: string
}

const initUser = async () => {
  let user = null
  const token = auth.getToken()
  return user
}

const AuthContext = React.createContext<
  | {
      user: UserInfo | null
      onRegister: (form: UserInfo) => Promise<void>
      onLogin: (form: UserInfo) => Promise<void>
    }
  | undefined
>(undefined)

AuthContext.displayName = 'AuthContext'

export const AuthProvider: FC = ({ children }) => {
  const { data, error, isLoading, isIdle, isError, run, setData } =
    useAsync<UserInfo | null>()
  const queryClient = useQueryClient()

  const onLogin = (form: UserInfo) => auth.login(form).then(setData)
  const onRegister = (form: UserInfo) => auth.register(form).then(setData)

  useMount(
    useCallback(() => {
      run(initUser())
    }, [])
  )

  if (isIdle || isLoading) {
    return <FullScreenLoading />
  }

  if (isError) {
    return <FullScreenErrorFallback error={error} />
  }

  return (
    <AuthContext.Provider
      children={children}
      value={{ user: data, onRegister, onLogin }}
    />
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth必须在AuthProvider中使用')
  }
  return context
}
