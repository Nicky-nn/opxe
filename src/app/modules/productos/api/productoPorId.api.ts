// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { ProductoProps } from '../interfaces/producto.interface'

const query = gql`
  query EXPO_PRODUCTO($codigoProducto: ID!) {
    expoProducto(codigoProducto: $codigoProducto) {
      codigoProducto
      codigoNandina
      descripcion
      nombre
      sinProductoServicio {
        codigoActividad
        codigoProducto
        descripcionProducto
      }
      unidadMedida {
        codigoClasificador
        descripcion
      }
      proveedor {
        codigo
        nombre
      }
      tipoProducto {
        _id
        codigoParent
        descripcion
        parientes
      }
      precio
      state
      usucre
      createdAt
      usumod
      updatedAt
    }
  }
`

export const apiProductoPorId = async (id: string): Promise<ProductoProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query, { codigoProducto: id })
  return data.expoProducto
}
