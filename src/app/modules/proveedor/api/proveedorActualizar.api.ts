import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import {
  ProveedorActualizarInputProp,
  ProveedorInputProp,
  ProveedorProps,
} from '../interfaces/proveedor.interface'

const gqlMutation = gql`
  mutation PROVEEDOR_ACTUALIZACION($codigo: ID!, $input: ProveedorActualizarInput!) {
    proveedorActualizar(codigo: $codigo, input: $input) {
      ciudad
      contacto
      correo
      direccion
      nombre
      telefono
    }
  }
`

export const apiProveedorActualizar = async (
  codigo: string,
  input: ProveedorActualizarInputProp,
): Promise<ProveedorProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlMutation, { codigo, input })
    return data.proveedorActualizar
  } catch (e: any) {
    console.error('apiProveedorActualizar', e)
    throw new MyGraphQlError(e)
  }
}
