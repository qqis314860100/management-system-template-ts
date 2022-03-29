import { RouteProps } from 'react-router-dom'

export interface IRouteProps extends RouteProps {
  name: string
  path: string
  icon?: React.ReactElement
  breadcrumbs?: string[]
  children?: IRouteProps[]
}
export type IRoutesProps = IRouteProps[]
