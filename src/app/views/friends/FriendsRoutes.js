import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'
import { authRoles } from '../../auth/authRoles'

const Friends = Loadable(lazy(() => import('./Friends')))

const friendsRoutes = [
    {
        path: '/friends/default',
        element: <Friends />,
        auth: authRoles.admin,
    },
]

export default friendsRoutes
