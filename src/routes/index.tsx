import React, { useState, Suspense, ReactElement } from 'react'
import { ErrorBoundary } from 'components/lib/ErrorBoundary'
import {
  FullScreenErrorFallback,
  FullScreenLoading,
  ErrorBox,
} from 'components/lib/FullScreen'
// import { useAuth } from 'context/authContext'
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Spin, BackTop } from 'antd'
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import routes from 'routes/config'
import Login from 'features/Login'
import NotFound from 'features/404'
import { IRouteProps, IRoutesProps } from 'types/routes'
import Register from 'features/Register'
import { BrowserRouter as Router } from 'react-router-dom'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const Index = () => {
  const navigate = useNavigate()
  const { pathname: currentPath } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const getItemsByRoutes = (routes: IRoutesProps) => {
    let pages: JSX.Element[] = []
    let menus: JSX.Element[] = []
    let defaultOpenKeys: string[] = []
    let breadcrumbs

    const createMenuItem = (route: IRouteProps) => (
      <Menu.Item key={route.path} {...(route.icon ? { icon: route.icon } : {})}>
        {route.name}
      </Menu.Item>
    )

    const createPageRoute = ({ path, element }: IRouteProps) => (
      <Route key={path} path={path} element={element} />
    )

    routes.forEach((route) => {
      if (route.children) {
        menus.push(
          <SubMenu
            key={route.path}
            title={route.name}
            {...(route.icon ? { icon: route.icon } : {})}
          >
            {route.children.map((route) => createMenuItem(route))}
          </SubMenu>
        )

        route.children.forEach((subRoute) => {
          pages.push(createPageRoute(subRoute))

          if (subRoute.path === currentPath) {
            subRoute.breadcrumbs
              ? (breadcrumbs = subRoute.breadcrumbs)
              : (breadcrumbs = [route.name, subRoute.name])
            defaultOpenKeys = [route.path]
          }
        })
      } else {
        menus.push(createMenuItem(route))
        pages.push(createPageRoute(route))
        if (route.path === currentPath) {
          route.breadcrumbs
            ? (breadcrumbs = route.breadcrumbs)
            : (breadcrumbs = [route.name])
        }
      }
    })

    return {
      menus,
      pages: pages.concat(<Route key="*" path="*" element={<NotFound />} />),
      breadcrumbs: (breadcrumbs || []).map((item) => (
        <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
      )),
      defaultOpenKeys,
    }
  }

  const handleClickMenu = ({ key: path }: any) => navigate(path)

  const onLogout = () => {
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Dropdown
          placement="bottomRight"
          overlayStyle={{ width: 150 }}
          overlay={
            <Menu onClick={onLogout}>
              <Menu.Item key="logout">退出登录</Menu.Item>
            </Menu>
          }
        >
          <div className="avatar">
            <Avatar
              icon={<UserOutlined />}
              size="large"
              style={{ marginRight: 5, backgroundColor: '#001529' }}
            />
            用户名
          </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          width={200}
          className="sider"
          collapsible
          trigger={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          collapsed={collapsed}
          onCollapse={(collapsed) => setCollapsed(collapsed)}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={[currentPath]}
            defaultOpenKeys={getItemsByRoutes(routes).defaultOpenKeys}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleClickMenu}
          >
            {getItemsByRoutes(routes).menus}
          </Menu>
        </Sider>
        <Layout className="layout">
          <Breadcrumb className="breadcrumb">
            {getItemsByRoutes(routes).breadcrumbs}
          </Breadcrumb>
          <Content className="content">
            <Suspense fallback={<Spin />}>
              <Routes>{getItemsByRoutes(routes).pages}</Routes>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
      <BackTop />
    </Layout>
  )
}

const App = () => {
  // const { user } = useAuth()
  const [error, setError] = useState<Error | null>(null)

  return (
    <div className="app">
      <ErrorBoundary fallbackRender={FullScreenErrorFallback}>
        <ErrorBox error={error} />
        <React.Suspense fallback={<FullScreenLoading />}>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate replace to="/main" />} />
              <Route
                path="/login"
                element={<Login handleSetError={setError} />}
              />
              <Route
                path="register"
                element={<Register handleSetError={setError} />}
              />
              <Route path="*" element={<Index />} />
            </Routes>
          </Router>
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
