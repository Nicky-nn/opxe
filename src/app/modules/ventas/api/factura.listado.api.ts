// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageProps } from '../../../interfaces'
import { FacturaProps } from '../interfaces/factura'

/**
 * Respuesta de productos
 */
export interface ApiFacturaResponse {
  docs: Array<FacturaProps>
  pageInfo: PageInfoProps
}

const query = gql`
  query EXP_LISTADO($limit: Int!, $reverse: Boolean, $page: Int!, $query: String) {
    facturaExportacionListado(
      limit: $limit
      reverse: $reverse
      page: $page
      query: $query
    ) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        direccionComprador
        incoterm
        lugarDestino
        puertoDestino
        cuf
        moneda {
          codigoClasificador
          descripcion
        }
        representacionGrafica {
          rollo
          sin
          pdf
        }
        sucursal {
          codigo
          direccion
          telefono
        }
        puntoVenta {
          codigo
          tipoPuntoVenta {
            codigoClasificador
            descripcion
          }
          nombre
          descripcion
        }
        metodoPago {
          codigoClasificador
          descripcion
        }
        detalle {
          nroItem
          actividadEconomica {
            codigoCaeb
            descripcion
          }
          productoServicio {
            codigoActividad
            codigoProducto
            descripcionProducto
          }
          codigoProducto
          codigoNandina
          descripcion
          cantidad
          unidadMedida {
            codigoClasificador
            descripcion
          }
          precioUnitario
          montoDescuento
          subTotal
          detalleExtra
        }
        nitEmisor
        razonSocialEmisor
        numeroFactura
        fechaEmision
        cliente {
          razonSocial
          codigoCliente
          tipoDocumentoIdentidad {
            codigoClasificador
            descripcion
          }
          numeroDocumento
          complemento
          nombres
          apellidos
          email
        }
        montoTotalMoneda
        montoTotal
        tipoCambio
        state
        updatedAt
        usuario
        usucre
        usumod
        createdAt
      }
    }
  }
`

export const fetchFacturaListado = async (
  pageInfo: PageProps,
): Promise<ApiFacturaResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query, { ...pageInfo })
  return data.facturaExportacionListado
}
