import React from 'react'
import { Redirect } from 'react-router-dom'
import chartsRoute from './views/charts/ChartsRoute'
import dashboardRoutes from './views/dashboard/DashboardRoutes'
import materialRoutes from './views/material-kit/MaterialRoutes'

import friendsRoutes from './views/friends/FriendsRoutes'
import hextechRoutes from './views/hextech/HextechRoutes'

const redirectRoute = [
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/dashboard/default" />,
    },
]

const errorRoute = [
    {
        component: () => <Redirect to="/session/404" />,
    },
]

const routes = [
    ...dashboardRoutes,
    ...materialRoutes,
    ...chartsRoute,
    ...redirectRoute,
    ...errorRoute,
    ...friendsRoutes,
    ...hextechRoutes,
]

export default routes
