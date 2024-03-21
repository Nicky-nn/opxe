// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { SinProductoServicioProps } from '../interfaces/sin.interface'

const gqlQuery = gql`
  query PRODUCTO_SERVICIO_POR_ACTIVIDAD($codigoActividad: String!) {
    sinProductoServicioPorActividad(codigoActividad: $codigoActividad) {
      codigoActividad
      codigoProducto
      descripcionProducto
    }
  }
`

/**
 * Filtro de productos por tipo de actividad
 * @param codigoActividad
 */
export const apiSinProductoServicioPorActividad = async (
  codigoActividad: string,
): Promise<SinProductoServicioProps[]> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(gqlQuery, {
    codigoActividad: codigoActividad || '',
  })
  return data.sinProductoServicioPorActividad
}
