import { useMountedRef } from 'hooks'
import { useCallback, useReducer, useState } from 'react'

interface State<D> {
  error: Error | null
  data: D | null
  stat: 'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState: State<null> = {
  stat: 'idle',
  data: null,
  error: null,
}

const defaultConfig = {
  throwOnError: false,
}

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef()

  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  )
}

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig }
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    { ...defaultInitialState, ...initialState }
  )

  const safeDispatch = useSafeDispatch(dispatch)
  // useState直接传入函数的含义是：惰性初始化；所以，要用useState保存函数，不能直接传入函数
  const [retry, setRetry] = useState(() => () => {})

  const setData = useCallback(
    (data: D) => safeDispatch({ data, stat: 'success', error: null }),
    [safeDispatch]
  )

  const setError = useCallback(
    (error: Error) => safeDispatch({ error, stat: 'error', data: null }),
    [safeDispatch]
  )

  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) throw new Error('请传入Promise类型')
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig)
        }
      })

      safeDispatch({ stat: 'loading' })
      return promise
        .then((data) => {
          setData(data)
          return data
        })
        .catch((error) => {
          setError(error)
          // catch会消化异常,如果不主动抛出,外界接受不到异常
          if (config.throwOnError) return Promise.reject(error)
          return error
        })
    },
    [config.throwOnError, setData, setError, safeDispatch]
  )

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    retry,
    ...state,
  }
}

export default useAsync