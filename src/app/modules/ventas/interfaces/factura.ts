import { PuntoVentaProps } from '../../../interfaces/puntoVenta'
import { MetodoPagoProp } from '../../base/metodoPago/interfaces/metodoPago'
import { MonedaProps } from '../../base/moneda/interfaces/moneda'
import { ClienteProps } from '../../clientes/interfaces/cliente'
import { ProductoProps } from '../../productos/interfaces/producto.interface'
import {
  SinActividadesDocumentoSectorProps,
  SinActividadesProps,
  SinCufdProps,
  SinCuisProps,
  SinMotivoAnulacionProps,
  SinProductoServicioProps,
  SinTipoDocumentoSectorProps,
  SinTipoEmisionProps,
  SinTipoFacturaProps,
  SinTipoMetodoPagoProps,
  SinTipoMonedaProps,
  SinUnidadMedidaProps,
} from '../../sin/interfaces/sin.interface'
import { SucursalProps } from '../../sucursal/interfaces/sucursal'

export interface FacturaAlquilerDetalleInput extends ProductoProps {
  codigoProductoSin: string
  codigoProducto: string
  codigoNandina: string
  // descripcion: string
  cantidad: number
  precioUnitario: number
  montoDescuento: number
}

export interface FacturaExpoCostosGastosNacionalesInputProps {
  campo: string
  valor: number | null
}

export interface FacturaExpoCostosGastosInternacionalesInputProps {
  campo: string
  valor: number | null
}

export interface FacturaInputProps {
  actividadEconomica: null | SinActividadesDocumentoSectorProps
  cliente: ClienteProps | null
  codigoCliente: string
  tipoCliente: 'N' | '99002' | '99003'
  codigoExcepcion: number | null
  codigoMetodoPago: MetodoPagoProp
  descuentoAdicional: number
  codigoMoneda: number
  periodoFacturado: string
  detalle: FacturaAlquilerDetalleInput[]
  detalleExtra?: string | null
  detalleExtraText?: string | null
  emailCliente?: string | null
  numeroTarjeta?: string | null
  tipoCambio: number
  montoPagar: number
  montoSubTotal: number
  total: number
  inputMontoPagar: number
  inputVuelto: number
  moneda?: MonedaProps
  direccionComprador?: string
  lugarDestino?: string
  incoterm?: string
  incotermDetalle?: string
  puertoDestino?: string
  codigoPais?: number
  costosGastosNacionales?: FacturaExpoCostosGastosNacionalesInputProps[]
  costosGastosInternacionales?: FacturaExpoCostosGastosInternacionalesInputProps[]
  numeroDescripcionPaquetesBultos?: string
  informacionAdicional?: string
  notificacion?: boolean
  codigoNandina?: string
}

/**
 * Valores iniciales del formulario
 */
export const FacturaInitialValues: FacturaInputProps = {
  notificacion: false,
  tipoCambio: 1,
  actividadEconomica: null,
  tipoCliente: 'N',
  cliente: null,
  codigoCliente: '',
  codigoExcepcion: 1,
  codigoMetodoPago: {
    codigoClasificador: 1,
    descripcion: 'EFECTIVO',
  },
  periodoFacturado: '',
  codigoMoneda: 1,
  descuentoAdicional: 0,
  detalle: [] as FacturaAlquilerDetalleInput[],
  detalleExtra: '',
  detalleExtraText: '',
  emailCliente: null,
  // montoGiftCard: 0,
  numeroTarjeta: null,
  montoSubTotal: 0,
  montoPagar: 0,
  total: 0,
  inputMontoPagar: 0,
  inputVuelto: 0,
  direccionComprador: '',
  incoterm: '',
  incotermDetalle: '',
  puertoDestino: '',
  lugarDestino: '',
  codigoPais: 0,
  costosGastosNacionales: [] as FacturaExpoCostosGastosNacionalesInputProps[],
  costosGastosInternacionales: [] as FacturaExpoCostosGastosInternacionalesInputProps[],
  numeroDescripcionPaquetesBultos: '',
  informacionAdicional: '',
  codigoNandina: '',
}

export interface RepresentacionGraficaProps {
  pdf: string
  rollo: string
  xml: string
  sin: string
}

export interface DetalleFacturaProps {
  actividadEconomica: SinActividadesProps
  cantidad: number
  descripcion: string
  detalleExtra: string
  montoDescuento: number
  nroItem: number
  numeroImei: string
  numeroSerie: string
  precioUnitario: number
  producto: string
  productoServicio: SinProductoServicioProps
  subTotal: number
  unidadMedida: SinUnidadMedidaProps
  codigoNandina: string
}

export interface FacturaProps {
  _id: string
  cafc: string
  direccionComprador: string
  lugarDestino: string
  puertoDestino: string
  cliente: ClienteProps
  codigoRecepcion: String
  createdAt: string
  cuf: string
  cufd: SinCufdProps
  cuis: SinCuisProps
  descuentoAdicional: number
  detalle: DetalleFacturaProps[]
  detalleExtra: string
  documentoSector: SinTipoDocumentoSectorProps
  eventoSignificativo: any
  fechaEmision: string
  leyenda: string
  metodoPago: SinTipoMetodoPagoProps
  moneda: SinTipoMonedaProps
  montoGiftCard: number
  montoTotal: number
  montoTotalLiteral: number
  montoTotalMoneda: number
  montoTotalSujetoIva: number
  motivoAnulacion: SinMotivoAnulacionProps
  nitEmisor: string
  numeroFactura: number
  numeroTarjeta: string
  puntoVenta: PuntoVentaProps
  razonSocialEmisor: string
  representacionGrafica: RepresentacionGraficaProps
  state: string
  subLeyenda: string
  sucursal: SucursalProps
  tipoCambio: number
  incoterm: string
  tipoEmision: SinTipoEmisionProps
  tipoFactura: SinTipoFacturaProps
  updatedAt: string
  usuario: string
  usucre: string
  usumod: string
}
