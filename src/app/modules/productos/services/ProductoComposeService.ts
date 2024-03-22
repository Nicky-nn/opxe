import { SinActividadesDocumentoSectorProps } from '../../../interfaces/sin.interface'
import { genReplaceEmpty } from '../../../utils/helper'
import { ProductoInputProps } from '../interfaces/producto.interface'

/**
 * Componemos el producto para su posterior guardado
 * @param prod
 */

export const productoComposeService = (aql: ProductoInputProps): any => {
  return {
    // codigoProducto: aql.codigoProducto,
    nombre: aql.nombre,
    descripcion: aql.descripcion,
    descripcionHtml: aql.descripcionHtml,
    codigoActividad: aql.actividadEconomica?.codigoActividad,
    codigoProductoSin: aql.sinProductoServicio?.codigoProducto,
    precio: aql.precio,
    codigoUnidadMedida: aql.unidadMedida?.codigoClasificador,
    tipoProductoId: aql.tipoProducto?._id,
    codigoProveedor: aql.codigoProveedor?.codigo,
    codigoNandina: aql.codigoNandina,
  }
}

export const productoInputComposeService = (
  aql: ProductoInputProps,
  actividadEconomica: SinActividadesDocumentoSectorProps,
): any => {
  return {
    actividadEconomica,
    sinProductoServicio: aql.sinProductoServicio,
    codigoProducto: aql.codigoProducto,
    nombre: aql.nombre,
    descripcion: aql.descripcion,
    descripcionHtml: aql.descripcionHtml,
    codigoActividad: aql.actividadEconomica?.codigoActividad,
    codigoProductoSin: aql.sinProductoServicio?.codigoProducto,
    precio: aql.precio,
    codigoUnidadMedida: aql.codigoUnidadMedida,
    tipoProducto: aql.tipoProducto,
    codigoProveedor: aql.codigoProveedor,
    codigoNandina: aql.codigoNandina,
    unidadMedida: aql.unidadMedida,
  }
}
