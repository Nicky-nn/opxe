import { homeRoutesMap } from './modules/home/HomeRoutes'
import { productosRouteMap } from './modules/productos/ProductosRoutesMap'
import { proveedorRouteMap } from './modules/proveedor/ProveedorRoutesMap'

export interface NavigationProps {
  name: string
  path?: string
  icon?: any
  iconText?: string
  label?: string
  type?: string
  badge?: { value: string; color: string }
  children?: Array<{
    name: string
    iconText: string
    path: string
  }>
}

export const navigations: NavigationProps[] = [
  {
    name: homeRoutesMap.home.name,
    icon: 'home',
    path: homeRoutesMap.home.path,
  },
  {
    name: 'SEGURIDAD',
    label: 'TRANSACCIONES',
    type: 'label',
  },
  {
    name: 'Exportaciones',
    icon: 'point_of_sale',
    children: [
      {
        name: 'Registrar Exportación',
        iconText: 'ALRE',
        path: '/ventas/registro',
      },
      {
        name: 'Gestión de Exportaciones',
        iconText: 'ALGE',
        path: '/ventas/gestion',
      },
    ],
  },
  {
    name: 'Servicios',
    icon: 'storefront_sharp',
    children: [
      {
        name: 'Gestión de Servicios',
        iconText: 'GP',
        path: productosRouteMap.gestion,
      },
      {
        name: 'Proveedores',
        iconText: 'PR',
        path: proveedorRouteMap.gestion,
      },
    ],
  },
  {
    name: 'Clientes',
    icon: 'person_sharp',
    badge: { value: '', color: 'secondary' },
    children: [
      {
        name: 'Gestión de clientes',
        path: '/clientes/gestion',
        iconText: 'GC',
      },
    ],
  },
]

/*
// Ejemplo de estructura con Hijos
  {
    name: 'Configuración',
    icon: 'settings',
    children: [
      {
        name: configuracionRoutesMap.parametrosSistema.name,
        iconText: 'PSI',
        path: configuracionRoutesMap.parametrosSistema.path,
      },
    ],
  }
*/
