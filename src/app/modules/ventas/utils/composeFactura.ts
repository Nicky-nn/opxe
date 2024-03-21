import { array, number, object, setLocale, string } from 'yup'
import { es } from 'yup-locales'

import { genReplaceEmpty } from '../../../utils/helper'
import { genRound } from '../../../utils/utils'
import { FacturaInputProps } from '../interfaces/factura'

const calculoMonedaBs = (monto: number, tipoCambioBs: number): number => {
  try {
    return genRound(monto * tipoCambioBs)
  } catch (e) {
    return monto
  }
}

export const composeFactura = (fcv: FacturaInputProps): any => {
  const notificacion = fcv.notificacion ? true : false
  const input = {
    actividadEconomica: fcv.actividadEconomica!?.codigoActividad,
    cliente: {
      codigoCliente: fcv.cliente!.codigoCliente,
      email: fcv.cliente!.email,
    },
    codigoMetodoPago: fcv.codigoMetodoPago.codigoClasificador,
    descuentoAdicional: calculoMonedaBs(fcv.descuentoAdicional, fcv.tipoCambio),
    codigoMoneda: fcv.moneda!.codigo,
    tipoCambio: fcv.tipoCambio,
    direccionComprador: fcv.direccionComprador,
    incoterm: fcv.incoterm,
    incotermDetalle: fcv.incotermDetalle,
    puertoDestino: fcv.puertoDestino,
    lugarDestino: fcv.lugarDestino,
    codigoPais: fcv.codigoPais,
    informacionAdicional: fcv.informacionAdicional,
    numeroDescripcionPaquetesBultos: fcv.numeroDescripcionPaquetesBultos,
    costosGastosNacionales: fcv.costosGastosNacionales?.map((item) => ({
      campo: item.campo,
      valor: item.valor,
    })),
    costosGastosInternacionales: fcv.costosGastosInternacionales?.map((item) => ({
      campo: item.campo,
      valor: item.valor,
    })),
    detalleExtra: fcv.detalleExtra,
    detalle: fcv.detalle.map((item) => ({
      codigoActividad: fcv.actividadEconomica!?.codigoActividad,
      codigoProductoSin: item.codigoProductoSin,
      codigoProducto: item.codigoProducto,
      codigoNandina: item.codigoNandina,
      descripcion: item.nombre,
      cantidad: item.cantidad,
      codigoUnidadMedida: parseInt(item.unidadMedida.codigoClasificador.toString()),
      precioUnitario: item.precioUnitario,
      montoDescuento: item.montoDescuento,
    })),
  }
  if (fcv.numeroTarjeta) {
    return { ...input, numeroTarjeta: fcv.numeroTarjeta }
  }
  // return { input, notificacion }
  return input
}
export const composeFacturaValidator = async (fcv: any): Promise<boolean> => {
  setLocale(es)
  const schema = object({
    actividadEconomica: string().required('Debe seleccionar la actividad economica'),
    cliente: object({
      codigoCliente: string().required('Debe seleccionar los datos del cliente'),
      email: string().email('Debe ingresar un correo valido'),
    }),
    codigoMetodoPago: number().integer().min(1).max(308).required(),
    direccionComprador: string().min(0).max(500),
    descuentoAdicional: number().min(0).required(),
    detalleExtra: string().min(0).max(500),
    codigoMoneda: number().integer().min(1).max(153),
    tipoCambio: number().min(0).required(),
    // numeroTarjeta: string().max(16),
    incoterm: string().min(0).max(500),
    incotermDetalle: string().min(0).max(500),
    puertoDestino: string().min(0).max(500),
    lugarDestino: string().min(0).max(500),
    codigoPais: number().integer().min(1).max(999),
    informacionAdicional: string().min(0).max(500),
    detalle: array()
      .of(
        object({
          codigoProductoSin: string().min(1).max(99999999).required(),
          codigoProducto: string().min(1).max(50).required(),
          descripcion: string().min(1).max(500).required(),
          cantidad: number().min(0).required(),
          // unidadMedida: number().integer().min(1).required(),
          precioUnitario: number().min(0).required(),
          montoDescuento: number().min(0),
          codigoNandina: string().min(0).max(50),
        }),
      )
      .min(1, 'Debe seleccionar al menos 1 productos / servicio para el detalle'),
  })
  await schema.validate(fcv)
  return true
}
