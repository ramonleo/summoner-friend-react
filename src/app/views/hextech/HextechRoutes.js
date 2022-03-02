import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'
import { authRoles } from '../../auth/authRoles'

const Hextech = Loadable(lazy(() => import('./Hextech')))

const hextechRoutes = [
    {
        path: '/hextech/default',
        element: <Hextech />,
        auth: authRoles.admin,
    },
]

export default hextechRoutes
