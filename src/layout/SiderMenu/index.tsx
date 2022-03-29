import { useState, Suspense } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Spin } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import routes from 'routes/config'
import NotFound from 'features/404'
import { IRouteProps, IRoutesProps } from 'types/routes'

const { SubMenu } = Menu
const { Content, Sider } = Layout

const SiderMenu = () => {
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
            defaultOpenKeys = [route!.path]
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

  return (
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
  )
}

export default SiderMenu
