import React, { lazy } from 'react'
import { UserOutlined, LaptopOutlined } from '@ant-design/icons'
import { IRoutesProps } from 'types/routes'

import PageA from 'pages/PageA'
import PageB from 'pages/PageB'

const Main = lazy(() => import('pages/Main'))

export const routesConfig: IRoutesProps = [
  { path: '/main', name: 'main', element: <Main />, icon: <UserOutlined /> },
  {
    name: 'subnav',
    path: '/subnav',
    icon: <LaptopOutlined />,
    children: [
      {
        name: 'option1',
        path: '/subnav/option1',
        // component: <PageB />,
        children: [
          {
            name: 'aaaa',
            path: '/subnav/option1/aaa',
            element: <PageB />,
          },
        ],
      },
      {
        name: 'option2',
        path: '/subnav/option2',
        element: <PageA />,
        breadcrumbs: ['customTitle'],
      },
    ],
  },
]
export default routesConfig
