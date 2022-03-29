import React from 'react'
import { useAuth } from 'context/authContext'
import { Form, Input } from 'antd'
import useAsync from 'hooks/useAsync'
import { LongButton } from 'components/styled'
import { errorAlert } from 'utils/alert'

export const Register = ({
  handleSetError,
}: {
  handleSetError: (error: Error) => void
}) => {
  const { onRegister } = useAuth()
  const { run, isLoading } = useAsync(undefined, { throwOnError: true })

  const handleSubmit = ({
    cpassword,
    ...values
  }: {
    username: string
    password: string
    cpassword: string
  }) => {
    if (cpassword !== values.password) {
      return errorAlert(new Error('请确认两次输入的密码相同'))
    }
    try {
      // 请求接口地址
    } catch (err: any) {
      handleSetError(err)
    }
  }
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={'username'}
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" type={'text'} id="username" />
      </Form.Item>
      <Form.Item>
        <Input placeholder="密码" type={'password'} id="password" />
      </Form.Item>
      <Form.Item>
        <Input placeholder="确认密码" type={'password'} id="cpassword" />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} />
      </Form.Item>
    </Form>
  )
}

export default Register
