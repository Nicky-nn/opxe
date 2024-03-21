import { Navigate } from 'react-router-dom'

import AuthGuard from '../../auth/AuthGuard'
import MatxLayout from '../base/components/Template/MatxLayout/MatxLayout'
import cuentaRoutes from '../modules/base/cuenta/CuentaRoutes'
import NotFound from '../modules/base/sessions/NotFound'
import sessionRoutes from '../modules/base/sessions/SessionRoutes'
import clientesRoutes from '../modules/clientes/ClientesRoutes'
import homeRoutes, { homeRoutesMap } from '../modules/home/HomeRoutes'
import productosRoutes from '../modules/productos/ProductosRoutes'
import proveedorRoutes from '../modules/proveedor/ProveedorRoutes'
import ventasRoutes from '../modules/ventas/VentasRoutes'

export const appRoutes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...ventasRoutes,
      ...homeRoutes,
      ...cuentaRoutes,
      ...clientesRoutes,
      ...productosRoutes,
      ...proveedorRoutes,
    ],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to={homeRoutesMap.home.path} /> },
  { path: '*', element: <NotFound /> },
]
