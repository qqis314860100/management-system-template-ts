import React from 'react'
import styled from '@emotion/styled'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import bg from './bg.svg'
import { useAuth } from 'context/authContext'
import useAsync from 'hooks/useAsync'
import { LongButton } from 'components/styled'

const ContainerWrapper = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #eff2f5;
  background-image: url(${bg});
`

const Container = styled.div`
  margin: auto;
  width: 450px;
  height: 340px;
  padding: 40px;
  text-align: center;
`

const Login = ({
  handleSetError,
}: {
  handleSetError: (error: Error) => void
}) => {
  const { onLogin } = useAuth()
  const { run, isLoading } = useAsync(undefined, { throwOnError: true })

  const navigate = useNavigate()

  // const onLogin = () => {
  //   navigate('/')
  // }

  const handleSubmit = async (values: {
    username: string
    password: string
    code: string
  }) => {
    try {
      await run(onLogin(values))
    } catch (err: any) {
      handleSetError(err)
    }
  }

  return (
    <ContainerWrapper>
      <Container>
        <Form size="large" style={{ marginTop: 40 }} onFinish={handleSubmit}>
          <Form.Item
            name={'username'}
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              placeholder="请输入用户名"
              prefix={<UserOutlined />}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name={'password'}
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              placeholder="请输入密码"
              prefix={<LockOutlined />}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item>
            <LongButton
              block
              loading={isLoading}
              htmlType={'submit'}
              type={'primary'}
            >
              登录
            </LongButton>
          </Form.Item>
        </Form>
      </Container>
    </ContainerWrapper>
  )
}

export default Login
