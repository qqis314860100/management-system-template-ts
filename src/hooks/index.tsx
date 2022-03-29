import { useRef } from 'react'
import { useEffect } from 'react'

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback()
  }, [callback])
}
/**
 * 返回组件的挂载状态,如果还没挂载或者已经卸载，返回false，反之返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  })
  return mountedRef
}
