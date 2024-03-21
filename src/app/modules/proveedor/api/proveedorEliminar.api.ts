// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'

/* Defining a GraphQL mutation query called `PROVEEDOR_ELIMINAR` that takes in a required argument
`codigoProveedor` of type array of strings and returns a boolean value indicating whether the
deletion of the specified provider was successful or not. The query is using the `gql` function from
the `graphql-request` library to parse the query string into a GraphQL AST (Abstract Syntax Tree)
object. */
const gqlQuery = gql`
  mutation PROVEEDOR_ELIMINAR($codigoProveedor: [String]!) {
    proveedorEliminar(codigoProveedor: $codigoProveedor)
  }
`

export const apiProveedorEliminar = async (codigoProveedor: string): Promise<boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, { codigoProveedor })
  return data.proveedorEliminar
}
