import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  TextField,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import InputNumber from 'rc-input-number'
import { FunctionComponent, useEffect, useState } from 'react'
import Select from 'react-select'

import AlertError from '../../../../base/components/Alert/AlertError'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import useAuth from '../../../../base/hooks/useAuth'
import {
  genRandomString,
  genReplaceEmpty,
  handleFocus,
  isEmptyValue,
} from '../../../../utils/helper'
import { notError } from '../../../../utils/notification'
import { apiSinMonedaUnidadMedida } from '../../../sin/api/sinMonedaUnidadMedida.api'
import { apiProductoServicioUnidadMedida } from '../../../sin/api/sinProductosUnidadMedida.api'
import {
  SinProductoServicioProps,
  SinTipoMonedaProps,
  SinUnidadMedidaProps,
} from '../../../sin/interfaces/sin.interface'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: any) => void
  codigoActividad: string
}

type Props = OwnProps

const AgregarArticuloDialog: FunctionComponent<Props> = (props: Props) => {
  const { onClose, keepMounted, codigoActividad, open, ...other } = props
  const { user } = useAuth()
  const initialValues: any = {
    incluirCantidad: false,
    verificarStock: false,
    id: genRandomString(5),
    codigoProducto: genRandomString(10).toUpperCase(),
    codigoNandina: '',
    nombre: '',
    precio: 0,
    titulo: '',
    inventario: [
      {
        sucursal: user.sucursal,
        stock: 0,
      },
    ],
    costo: 0,
    sinProductoServicio: {} as SinProductoServicioProps,
    unidadMedida: {} as SinUnidadMedidaProps,
    precioComparacion: 0,
    disponibleParaVenta: false,
    codigoBarras: null,
  }
  const [inputForm, setInputForm] = useState<any>(initialValues)
  const [unidadesMedida, setUnidadesMedida] = useState<SinUnidadMedidaProps[]>([])
  const [productosServicios, setProductosServicios] = useState<
    SinProductoServicioProps[]
  >([])

  const [isError, setIsError] = useState(null)

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    try {
      // console.log(inputForm)
      if (inputForm.titulo.trim().length === 0) {
        throw new Error('Debe ingresar título del producto')
      }
      if (inputForm.nombre.trim().length === 0) {
        throw new Error('Debe ingresar nombre del producto')
      }
      if (inputForm.precio === 0) {
        throw new Error('Precio debe ser mayor a 0')
      }
      if (isEmptyValue(inputForm.unidadMedida)) {
        throw new Error('Seleccione unidad de medida')
      }
      if (isEmptyValue(inputForm.sinProductoServicio)) {
        throw new Error('Seleccione producto para homologación')
      }
      if (inputForm.codigoNandina.trim().length === 0) {
        throw new Error('Debe ingresar código nandina')
      }
      // Se elimino para q no marque error Funion no funcional vea doumnetacion
      const nuevoDetalle = {
        _id: inputForm.id,
        id: inputForm.id,
        sinProductoServicio: inputForm.sinProductoServicio,
        codigoProducto: inputForm.codigoProducto,
        codigoNandina: inputForm.codigoNandina,
        // producto: {
        //   // titulo: inputForm.titulo,
        //   descripcion: inputForm.nombre,
        //   descripcionHtml: inputForm.nombre,
        //   // opcionesProducto: [],
        //   // tipoProducto: null,
        //   // totalVariantes: 1,
        //   // varianteUnica: true,
        //   // proveedor: null,
        //   // usucre: user.nombres,
        // },
        titulo: inputForm.titulo,
        nombre: inputForm.nombre,
        codigoBarras: null,
        precio: inputForm.precio,
        precioComparacion: inputForm.precioComparacion!,
        costo: inputForm.costo,
        incluirCantidad: false,
        verificarStock: false,
        unidadMedida: inputForm.unidadMedida!,
        inventario: inputForm.inventario,
        usucre: user.nombres,
      }
      onClose(nuevoDetalle)
    } catch (e: any) {
      notError(e.message)
    }
  }

  // Obtenemos los datos del producto homologado y unidades de medida
  const fetchProductosServiciosUnidadesMedida = async () => {
    try {
      // const resp = await apiProductoServicioUnidadMedida(codigoActividad)
      const resp = await apiProductoServicioUnidadMedida()
      if (resp) {
        // console.log(resp)
        setUnidadesMedida(resp.sinUnidadMedida)
        // console.log(resp.sinProductoServicioPorActividad)
        setProductosServicios(resp.sinProductoServicioPorDocumentoSector)
      }
    } catch (e: any) {
      setIsError(e.message)
    }
  }

  useEffect(() => {
    fetchProductosServiciosUnidadesMedida().then()
  }, [])

  useEffect(() => {
    if (open) {
      setInputForm(initialValues)
    }
  }, [open])

  const { data, isLoading } = useQuery<
    {
      sinTipoMoneda: SinTipoMonedaProps[]
      sinUnidadMedida: SinUnidadMedidaProps[]
    },
    Error
  >({
    queryKey: ['monedaUnidadMedida'],
    queryFn: async () => {
      const data = await apiSinMonedaUnidadMedida()
      return data || {}
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (data && !inputForm.unidadMedida) {
  //       const servicios = data.sinUnidadMedida.find(
  //         (su) => su.codigoClasificador === '58',
  //       )
  //       setInputForm({
  //         ...inputForm,
  //         unidadMedida: servicios || null,
  //       })
  //     }
  //   }
  // }, [isLoading])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 490 } }}
        maxWidth="sm"
        keepMounted={false}
        open={open}
        {...other}
      >
        <DialogTitle>Agregar Producto Personalizado</DialogTitle>
        <DialogContent dividers>
          {!isError ? (
            <Grid container spacing={2.5}>
              <Grid item lg={12} md={12} xs={12}>
                <FormControl fullWidth component={'div'}>
                  <MyInputLabel shrink>Tipo de Producto Homologado</MyInputLabel>
                  <Select<SinProductoServicioProps>
                    styles={reactSelectStyle(Boolean(isError))}
                    menuPosition={'fixed'}
                    name="productoServicio"
                    placeholder={'Seleccione producto para homologación'}
                    value={genReplaceEmpty(inputForm.sinProductoServicio, null)}
                    onChange={(resp) => {
                      setInputForm({
                        ...inputForm,
                        sinProductoServicio: resp || ({} as SinProductoServicioProps),
                      })
                    }}
                    options={productosServicios}
                    getOptionValue={(ps) => ps.codigoProducto}
                    getOptionLabel={(ps) =>
                      `${ps.codigoProducto} - ${ps.descripcionProducto}`
                    }
                  />
                </FormControl>
              </Grid>

              <Grid item lg={12} md={12} xs={12}>
                {data?.sinUnidadMedida ? (
                  <FormControl fullWidth error={Boolean(isError)}>
                    <MyInputLabel shrink>Unidad de Medida</MyInputLabel>
                    <Select<SinUnidadMedidaProps>
                      styles={reactSelectStyle(Boolean(isError))}
                      name={'unidadMedida'}
                      placeholder={'Seleccione la unidad de medida'}
                      menuPosition={'fixed'}
                      // value={inputForm.unidadMedida}
                      onChange={(resp) => {
                        setInputForm({
                          ...inputForm,
                          unidadMedida: resp || ({} as SinUnidadMedidaProps),
                        })
                      }}
                      onBlur={() => {}}
                      options={data.sinUnidadMedida}
                      getOptionValue={(item) => item.codigoClasificador}
                      getOptionLabel={(item) =>
                        `${item.codigoClasificador} - ${item.descripcion}`
                      }
                    />
                  </FormControl>
                ) : (
                  <AlertError
                    tipo={'error'}
                    mensaje={'No se pudo cargar el clasificador de monedas'}
                  />
                )}
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextField
                  id="codigoNandina"
                  label="Codigo Nandina"
                  size={'small'}
                  fullWidth
                  value={inputForm.codigoNandina}
                  onChange={(e) => {
                    setInputForm({
                      ...inputForm,
                      codigoNandina: e.target.value,
                    })
                  }}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextField
                  id="nombre"
                  label="Nombre / Descripción Servicio"
                  multiline
                  minRows={3}
                  maxRows={6}
                  size={'small'}
                  fullWidth
                  value={inputForm.nombre}
                  onChange={(e) => {
                    setInputForm({
                      ...inputForm,
                      nombre: e.target.value,
                      titulo: e.target.value,
                    })
                  }}
                />
              </Grid>

              <Grid item lg={12} md={12} xs={12}>
                <InputLabel>Precio</InputLabel>
                <InputNumber
                  min={0}
                  value={inputForm.precio}
                  onFocus={handleFocus}
                  onChange={(precio: number | null) =>
                    setInputForm({ ...inputForm, precio: precio! })
                  }
                  formatter={numberWithCommas}
                  style={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          ) : (
            <AlertError mensaje={isError} />
          )}
        </DialogContent>
        <DialogActions sx={{ mb: 1 }}>
          <Button variant={'contained'} size={'small'} onClick={handleOk}>
            Registrar
          </Button>
          <Button
            variant={'contained'}
            size={'small'}
            color={'error'}
            autoFocus
            onClick={handleCancel}
            style={{ marginRight: 18 }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AgregarArticuloDialog
