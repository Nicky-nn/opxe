import { yupResolver } from '@hookform/resolvers/yup'
import { Save } from '@mui/icons-material'
import { Button, CssBaseline, Grid, Paper, Stack } from '@mui/material'
import { FunctionComponent } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import { notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiProductoRegistro } from '../api/productoRegistro.api'
import {
  PRODUCTO_INITIAL_VALUES,
  ProductoInputProps,
} from '../interfaces/producto.interface'
import { productoComposeService } from '../services/ProductoComposeService'
import {
  productoRegistroValidator,
  productoRegistroValidatorResponde,
} from '../validator/productoRegistroValidator'
import ProductoClasificador from './registro/ProductoClasificador'
import Homologacion from './registro/ProductoHomologacion'
import ProductoPrecio from './registro/ProductoPrecio'
import ProductoProveedor from './registro/ProductoProveedor'

interface OwnProps {}

type Props = OwnProps

const ProductoRegistro: FunctionComponent<Props> = () => {
  const navigate = useNavigate()
  const form = useForm<ProductoInputProps>({
    defaultValues: {
      ...PRODUCTO_INITIAL_VALUES,
    },
    //@ts-ignore
    resolver: yupResolver(productoRegistroValidator),
  })

  const onSubmit: SubmitHandler<ProductoInputProps> = async (values) => {
    const val = await productoRegistroValidatorResponde(values)
    const codigoProducto = values.codigoProducto
    const apiInput = productoComposeService(values)
    // console.log('apiInput', apiInput)
    await swalAsyncConfirmDialog({
      preConfirm: async () => {
        const resp: any = await apiProductoRegistro(codigoProducto, apiInput).catch(
          (err) => ({
            error: err,
          }),
        )
        if (resp.error) {
          swalException(resp.error)
          return false
        }
        return resp
      },
    }).then((resp) => {
      if (resp.isConfirmed) {
        // console.log('resp.value', resp)
        notSuccess()
        // navigate(`/productos/modificar/${resp.value.codigoProducto}`, { replace: true })
        navigate(`/productos/gestion/`, { replace: true })
      }
      if (resp.isDenied) {
        swalException(resp.value)
      }
      return
    })
  }

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Servicios', path: '/productos/gestion' },
            { name: 'Nuevo Servicio' },
          ]}
        />
      </div>
      <CssBaseline />

      <Paper
        elevation={0}
        variant="elevation"
        square
        sx={{ mb: 2, p: 0.5, bgcolor: '#FAFAFA' }}
        className={'asideSidebarFixed'}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          style={{ marginTop: 2 }}
          spacing={{ xs: 1, sm: 1, md: 1, xl: 1 }}
          justifyContent="flex-end"
        >
          <Button
            color={'success'}
            startIcon={<Save />}
            variant={'contained'}
            onClick={form.handleSubmit(onSubmit)}
          >
            Guardar Servicio
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
              {<ProductoPrecio form={form} />}
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} xs={12}>
              {<ProductoClasificador form={form} />}
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              {<ProductoProveedor form={form} />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </SimpleContainer>
  )
}

export default ProductoRegistro
