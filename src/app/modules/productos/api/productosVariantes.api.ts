// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageProps } from '../../../interfaces'
import { ProductoInputProps } from '../interfaces/producto.interface'

const reqQuery = gql`
  query EXP_PRODUCTO_LISTADO(
    $limit: Int!
    $reverse: Boolean
    $page: Int!
    $query: String
  ) {
    expoProductoListado(limit: $limit, reverse: $reverse, page: $page, query: $query) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        codigoProducto
        codigoNandina
        state
        nombre
        descripcion
        actividadEconomica {
          codigoCaeb
          descripcion
          tipoActividad
        }
        descripcionHtml
        tipoProducto {
          _id
          descripcion
          codigoParent
        }
        imagen {
          altText
          url
        }
        proveedor {
          codigo
          nombre
          correo
        }
        sinProductoServicio {
          codigoActividad
          codigoProducto
          descripcionProducto
        }
        precio
        precioComparacion
        costo
        unidadMedida {
          codigoClasificador
          descripcion
        }
        state
        usucre
        createdAt
        usumod
        updatedAt
      }
    }
  }
`
/**
 * Respuesta de productos
 */
export interface ApiProductoVarianteResponse {
  docs: Array<ProductoInputProps>
  pageInfo: PageInfoProps
}

export const apiProductosVariantes = async (
  pageInfo: PageProps,
): Promise<ApiProductoVarianteResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(reqQuery, { ...pageInfo })
  return data?.expoProductoListado || []
}
