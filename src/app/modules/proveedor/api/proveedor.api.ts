// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageInputProps } from '../../../interfaces'
import { ProveedorProps } from '../interfaces/proveedor.interface'

const gqlQuery = gql`
  query PROVEEDOR($codigoProveedor: String!) {
    proveedor(codigoProveedor: $codigoProveedor) {
      codigo
      nombre
      direccion
      ciudad
      contacto
      correo
      telefono
    }
  }
`

export const apiProveedor = async (codigoProveedor: string): Promise<ProveedorProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, { codigoProveedor })
  // console.log(data)
  return data.proveedor
}
