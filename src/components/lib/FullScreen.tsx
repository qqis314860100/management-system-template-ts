import React from 'react'
import styled from '@emotion/styled'
import { Button, Spin, Typography } from 'antd'

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

// 类型守卫
const isError = (value: any): value is Error => value?.message

export const ErrorBox = ({ error }: { error: unknown }) => {
  if (isError(error)) {
    return <Typography.Text type="danger">{error.message}</Typography.Text>
  }
  return null
}

export const FullScreenLoading = () => {
  return (
    <FullPage>
      <Spin size="large" />
    </FullPage>
  )
}

export const FullScreenErrorFallback = ({ error }: { error: Error | null }) => {
  return (
    <FullPage>
      <ErrorBox error={error} />
    </FullPage>
  )
}
