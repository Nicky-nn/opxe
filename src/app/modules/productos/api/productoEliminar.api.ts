// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'

const query = gql`
  mutation expoProductoListado_PRODUCTOS_ELIMINAR($codigoProducto: String!) {
    expoProductoEliminar(codigoProducto: $codigoProducto)
  }
`

export const apiProductosEliminar = async (codigoProducto: string): Promise<boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query, { codigoProducto })
  return data.fcvProductosEliminar
}
