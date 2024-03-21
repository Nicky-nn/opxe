import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Description, Save } from '@mui/icons-material'
import { Button, CssBaseline, Grid, Paper, Stack } from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import { genRandomString, isEmptyValue } from '../../../utils/helper'
import { notDanger, notError, notSuccess } from '../../../utils/notification'
import {
  swalAsyncConfirmDialog,
  swalClose,
  swalException,
  swalLoading,
} from '../../../utils/swal'
import { fetchSinActividades } from '../../sin/api/sinActividadEconomica.api'
import { fetchSinActividadesPorDocumentoSector } from '../../sin/api/sinActividadesPorDocumentoSector'
import { SinActividadesProps } from '../../sin/interfaces/sin.interface'
import { apiTipoProductoListado } from '../../tipoProducto/api/tipoProductoListado.api'
import { apiProductoModificar } from '../api/productoModificar.api'
import { apiProductoPorId } from '../api/productoPorId.api'
import {
  PRODUCTO_INITIAL_VALUES,
  ProductoInputProps,
} from '../interfaces/producto.interface'
import { productosRouteMap } from '../ProductosRoutesMap'
import { productoComposeService } from '../services/ProductoComposeService'
import {
  productoRegistroValidator,
  productoRegistroValidatorResponde,
} from '../validator/productoRegistroValidator'
import ProductoInventario from './ProductoInventario/ProductoInventario'
import ProductoClasificador from './registro/ProductoClasificador'
import Homologacion from './registro/ProductoHomologacion'
import ProductoOpciones from './registro/ProductoOpciones'
import ProductoPrecio from './registro/ProductoPrecio'
import ProductoProveedor from './registro/ProductoProveedor'
import ProductoVariantes from './registro/ProductoVariantes'

interface OwnProps {}

type Props = OwnProps

const ProductoActualizar: FunctionComponent<Props> = (props) => {
  const { id }: { id?: string } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState<ProductoInputProps | undefined>(undefined)

  const form = useForm<ProductoInputProps>({
    defaultValues: {
      ...PRODUCTO_INITIAL_VALUES,
    },
    // @ts-ignore
    resolver: yupResolver(productoRegistroValidator),
  })

  const onSubmit: SubmitHandler<ProductoInputProps> = async (values) => {
    const val = await productoRegistroValidatorResponde(values)
    const codigoProducto = values.codigoProducto
    const apiInput = productoComposeService(values)
    await swalAsyncConfirmDialog({
      preConfirm: async () => {
        const resp: any = await apiProductoModificar(codigoProducto, apiInput).catch(
          (err) => ({
            error: err,
          }),
        )
        if (resp.error) {
          toast.error('Error')
          swalException(resp.error)
          // console.log( ´error ´ )
          // mostrar error

          return false
        }
        return resp
      },
    }).then((resp) => {
      if (resp.isConfirmed) {
        notSuccess()
      }
      if (resp.isDenied) {
        swalException(resp.value)
      }
      return
    })
  }

  const fetchProductoPorCodigo = async (codigoProducto: string) => {
    try {
      swalLoading()
      const response = await apiProductoPorId(codigoProducto)
      setProducto(response[0])
      const act = await fetchSinActividades()
      // console.log('act', act)
      if (response) {
        // form.reset(response)
        const codigoActividad = response.sinProductoServicio
        const matchinActividad = act.find(
          (actividad) => actividad.codigoCaeb === codigoActividad.codigoActividad,
        )
        form.setValue('codigoActividad', response.sinProductoServicio)
        form.setValue(
          'codigoActividad.tipoActividad',
          matchinActividad?.tipoActividad || '',
        )

        form.setValue(
          'codigoActividad.actividadEconomica',
          matchinActividad?.descripcion || '',
        )

        form.setValue('codigoProductoSin', response.sinProductoServicio)
        form.setValue('codigoUnidadMedida', response.unidadMedida)
        form.setValue('codigoProveedor', response.proveedor)
        form.setValue('nombre', response.nombre)
        form.setValue('codigoProducto', response.codigoProducto)
        form.setValue('descripcion', response.descripcion)
        form.setValue('precio', response.precio)
        form.setValue('codigoNandina', response.codigoNandina || '')

        // const tip = await apiTipoProductoListado()
        // const tipoProducto = response.tipoProducto
        // const matchinTipoProducto = tip.find((tp) => tp._id === tipoProducto.codigoParent)
        // console.log('matchinTipoProducto', matchinTipoProducto)
        // // form.setValue('tipoProducto._id', tipoProducto._id)
        // // form.setValue('tipoProducto.codigoParent', tipoProducto.codigoParent)
        // // form.setValue('tipoProducto.descripcion', tipoProducto.descripcion)
        // // form.setValue('tipoProducto.parientes', matchinTipoProducto?.parientes || '')
        // // form.setValue('tipoProducto.descripcion', matchinTipoProducto?.descripcion || '')
      } else {
        notDanger('No se encontró el producto')
        navigate(-1)
      }
      swalClose()
    } catch (e: any) {
      swalException(e)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (!isEmptyValue(id)) {
        await fetchProductoPorCodigo(id!).then()
      } else {
        notDanger('Se requiere el código del producto')
        navigate(-1)
      }
    })()
  }, [])

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Servicios', path: '/productos/gestion' },
            { name: 'Modificar Servicio' },
          ]}
        />
      </div>
      <CssBaseline />

      <Paper
        elevation={0}
        variant="elevation"
        square
        sx={{ mb: 2, p: 0.5 }}
        className={'asideSidebarFixed'}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          style={{ marginTop: 2 }}
          spacing={{ xs: -2, sm: 0, md: 1, xl: 0 }}
          justifyContent="flex-end"
        >
          <Button
            color={'primary'}
            startIcon={<Description />}
            variant={'contained'}
            onClick={() => {
              navigate(productosRouteMap.nuevo)
            }}
          >
            Nuevo Servicio
          </Button>
          &nbsp;
          <Button
            color={'success'}
            startIcon={<Save />}
            variant={'contained'}
            onClick={form.handleSubmit(onSubmit)}
          >
            Guardar Cambios
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid item lg={8} md={8} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} xs={12}>
              <Homologacion form={form} />
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              {/* <ProductoPrecio form={form} /> */}
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} xs={12}>
              {/* <ProductoClasificador form={form} /> */}
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              {/* <ProductoProveedor form={form} /> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </SimpleContainer>
  )
}

export default ProductoActualizar
