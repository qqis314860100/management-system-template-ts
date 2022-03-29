import { REPEAT } from 'common/axios'
import { message } from 'antd'

const errorAlert = (
  data: string | { msg?: string; message?: string }
): void => {
  if (typeof data === 'object') {
    message.error(data.msg || data.message)
  } else if (data !== REPEAT) {
    message.error(data)
  }
}

const successAlert = (msg: string): void => {
  message.success(msg || '操作成功')
}

export { errorAlert, successAlert }
