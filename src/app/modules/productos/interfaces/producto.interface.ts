import { actionForm } from '../../../interfaces'
import { ProveedorProps } from '../../proveedor/interfaces/proveedor.interface'
import {
  SinActividadesDocumentoSectorProps,
  SinActividadesProps,
  SinProductoServicioProps,
  SinTipoMonedaProps,
  SinUnidadMedidaProps,
} from '../../sin/interfaces/sin.interface'
import { TipoProductoProps } from '../../tipoProducto/interfaces/tipoProducto.interface'

// Para evitar circular llamada
export interface ProductoProps {
  codigoProducto: string
  sigla: string
  nombre: string | null
  descripcion: string
  descripcionHtml: string
  moneda: SinTipoMonedaProps
  actividadEconomica: SinActividadesProps
  sinProductoServicio: SinProductoServicioProps
  tipoCambioVenta: number
  tipoCambioVentaOficial: number
  tipoCambioCompra: number
  tipoCambioCompraOficial: number
  unidadMedida: SinUnidadMedidaProps
  incluirCantidad: boolean // habilita cantidad al stock del inventario
  verificarStock: boolean // si es true, se verifica cantidad en stock, false = no se toma en cuenta
  codigoNandina: string
  state: string
  usucre: string
  createdAt: Date
  usumod: string
  updatedAt: string
  precio: number
}

export interface ProductoInputProps {
  actividadEconomica: SinActividadesDocumentoSectorProps | null
  sinProductoServicio: SinProductoServicioProps | null
  codigoProducto: string
  nombre: string | null
  sigla: string
  descripcion: string
  descripcionHtml: string
  moneda: SinTipoMonedaProps | null
  tipoCambioVenta: number | null
  tipoCambioVentaOficial: number | null
  tipoCambioCompra: number | null
  tipoCambioCompraOficial: number | null
  unidadMedida: SinUnidadMedidaProps | null
  action: string
  codigoNandina: string
  precio: number | null
  tipoProducto: TipoProductoProps | null
  codigoProveedor: ProveedorProps | null
}

/**
 * valores iniciales para un nuevo producto
 */
export const PRODUCTO_INITIAL_VALUES: ProductoInputProps = {
  actividadEconomica: null,
  sinProductoServicio: null,
  codigoProducto: '',
  nombre: '',
  sigla: '',
  descripcion: '',
  descripcionHtml: '',
  moneda: null,
  tipoCambioVenta: null,
  tipoCambioVentaOficial: null,
  tipoCambioCompra: null,
  tipoCambioCompraOficial: null,
  unidadMedida: null,
  action: actionForm.REGISTER,
  codigoNandina: '',
  precio: null,
  tipoProducto: null,
  codigoProveedor: null,
}

/**
 * Interface que nos permite registrar el producto, se usa para las apis
 */
export interface ProductoInputApiProps {
  codigoActividad: string
  codigoProductoSin: string
  nombre: string | null
  sigla: string
  descripcion: string | null
  descripcionHtml: string | null
  codigoMoneda: number
  tipoCambioVenta: number
  tipoCambioVentaOficial: number
  tipoCambioCompra: number
  tipoCambioCompraOficial: number
  codigoUnidadMedida: number
  condigoNandina: string
  precio: number
  tipoProducto: TipoProductoProps
  codigoProveedor: ProveedorProps
}
