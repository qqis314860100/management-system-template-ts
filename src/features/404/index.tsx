import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default () => {
  const navigate = useNavigate()
  const onBackToHome = () => navigate('/')

  return (
    <Result
      status="404"
      title="404"
      subTitle="页面不存在"
      extra={
        <Button type="primary" onClick={onBackToHome}>
          回到首页
        </Button>
      }
    />
  )
}
