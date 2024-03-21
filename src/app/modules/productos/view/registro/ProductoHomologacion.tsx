import { FormControl, FormHelperText, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'

import AlertError from '../../../../base/components/Alert/AlertError'
import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { FormTextField } from '../../../../base/components/Form'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import { apiSinProductoServicioPorActividad } from '../../../sin/api/sinProductoServicio.api'
import useQueryActividadesPorDocumentoSector from '../../../sin/hooks/useQueryActividadesPorDocumentoSector'
import {
  SinActividadesDocumentoSectorProps,
  SinProductoServicioProps,
} from '../../../sin/interfaces/sin.interface'
import { ProductoInputProps } from '../../interfaces/producto.interface'

interface OwnProps {
  form: UseFormReturn<ProductoInputProps>
}

type Props = OwnProps

const ProductoHomologacion: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      getValues,
      watch,
      formState: { errors },
    },
  } = props

  // miramos los cambios realizados en actividad economica
  const actividadEconomicaWatch = watch('actividadEconomica')

  // CARGA DATOS DE ACTIVIDADES
  const { actividades, actIsError, actError, actLoading } =
    useQueryActividadesPorDocumentoSector()

  // CARGA DE DATOS DE PRODUCTOS SERVICIOS
  const {
    data: productosServicios,
    isLoading: prodServIsLoading,
    error: prodServError,
  } = useQuery<SinProductoServicioProps[], Error>({
    queryKey: ['productosServicios', actividadEconomicaWatch],
    queryFn: async () => {
      const docs = await apiSinProductoServicioPorActividad(
        getValues('actividadEconomica.codigoActividad'),
      )
      if (docs.length > 0) {
        if (!getValues('sinProductoServicio')) setValue('sinProductoServicio', docs[0])
      }
      return docs
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  // En caso no existiera valores en actividad economica
  useEffect(() => {
    if (!actLoading && !actIsError && !getValues('actividadEconomica')) {
      setValue('actividadEconomica', actividades![0])
    }
  }, [actLoading])

  if (actIsError) {
    return <AlertError mensaje={actError!.message} />
  }
  if (prodServError) {
    return <AlertError mensaje={prodServError.message} />
  }

  // eslint-disable-next-line no-unused-vars
  const [codigoProducto, setCodigoProducto] = useState('')
  const generarCodigoProducto = (nombreProducto: string): string => {
    const palabras = nombreProducto
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, '') // Eliminar caracteres especiales
      .split(' ')
      .map((palabra) => palabra.substring(0, 5)) // Limitar a 3 caracteres por palabra

    let palabrasValidas: string[]
    if (palabras.length > 3) {
      palabrasValidas = [...palabras.slice(0, 5), ...palabras.slice(-2)]
    } else {
      palabrasValidas = palabras
    }

    const codigo = palabrasValidas.join('')

    let numeroAleatorio = Math.floor(Math.random() * 100)
    // Asegurarse de que el número aleatorio tenga al menos 2 dígitos
    if (numeroAleatorio < 10) {
      numeroAleatorio += 10
    }

    const codigoFinal = `${codigo}-${numeroAleatorio}`.slice(
      0,
      Math.min(13, codigo.length + 4),
    ) // Limitar a máximo 13 caracteres
    // console.log('codigoFinal', codigoFinal)
    if (nombreProducto.length > 0) {
      // setValue('codigoProducto', codigoFinal)
      return codigoFinal
    } else {
      // setValue('codigoProducto', '')
      return ''
    }
  }
  useEffect(() => {
    const nombreProducto = getValues('nombre')

    // Verificar si el campo de codigoProducto ya tiene un valor
    const codigoProductoExistente = getValues('codigoProducto')
    const codigoProductoActualizado =
      //@ts-ignore
      codigoProductoExistente || generarCodigoProducto(nombreProducto)

    setCodigoProducto(codigoProductoActualizado)
    setValue('codigoProducto', codigoProductoActualizado)
  }, [getValues, setValue, watch('nombre') ? watch('nombre') : ''])

  return (
    <>
      <SimpleCard title={'HOMOLOGACIÓN'}>
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} xs={12}>
            {actLoading ? (
              <AlertLoading />
            ) : (
              <Controller
                name="actividadEconomica"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <MyInputLabel shrink>Actividad Económica</MyInputLabel>
                    <Select<SinActividadesDocumentoSectorProps>
                      {...field}
                      styles={reactSelectStyle(Boolean(errors.sinProductoServicio))}
                      name="actividadEconomica"
                      placeholder={'Seleccione la actividad económica'}
                      menuPosition={'fixed'}
                      value={field.value}
                      onChange={async (actividadEconomica: any) => {
                        field.onChange(actividadEconomica)
                        setValue('sinProductoServicio', null)
                      }}
                      onBlur={async () => {
                        field.onBlur()
                      }}
                      isSearchable={false}
                      options={actividades}
                      getOptionValue={(item) => item.codigoActividad}
                      getOptionLabel={(item) =>
                        `${item.tipoActividad} - ${item.codigoActividad} - ${item.actividadEconomica}`
                      }
                    />
                    <FormHelperText>
                      {errors.sinProductoServicio?.message || ''}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            )}
          </Grid>

          <Grid item lg={12} md={12} xs={12}>
            {prodServIsLoading ? (
              <AlertLoading />
            ) : (
              <Controller
                name={'sinProductoServicio'}
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    component={'div'}
                    error={Boolean(errors.sinProductoServicio)}
                  >
                    <MyInputLabel shrink>Producto Homologado</MyInputLabel>
                    <Select<SinProductoServicioProps>
                      {...field}
                      styles={reactSelectStyle(Boolean(errors.sinProductoServicio))}
                      menuPosition={'fixed'}
                      name="sinProductoServicio"
                      placeholder={'Seleccione producto para homolgación'}
                      value={field.value || null}
                      onChange={(sinProductoServicio) => {
                        field.onChange(sinProductoServicio)
                      }}
                      options={productosServicios}
                      getOptionValue={(ps) => ps.codigoProducto}
                      getOptionLabel={(ps) =>
                        `${ps.codigoProducto} - ${ps.descripcionProducto}`
                      }
                    />
                    <FormHelperText>{errors.sinProductoServicio?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            )}
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Controller
              control={control}
              name={'nombre'}
              render={({ field }) => (
                <FormTextField
                  name="nombre"
                  label="Nombre Servicio"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={() => {
                    const nombreProducto = field.value
                    //@ts-ignore
                    const nuevoCodigoProducto = generarCodigoProducto(nombreProducto)
                    setCodigoProducto(nuevoCodigoProducto)
                    field.onBlur()
                  }}
                  error={Boolean(errors.nombre)}
                  helperText={errors.nombre?.message}
                />
              )}
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Controller
              name={'descripcion'}
              control={control}
              render={({ field }) => (
                <FormTextField
                  name="descripcion"
                  label="Descripcion"
                  multiline
                  minRows={3}
                  maxRows={5}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Controller
              control={control}
              name={'codigoProducto'}
              render={({ field }) => (
                <FormTextField
                  name="codigoProducto"
                  label="Código Servicio (SKU)"
                  value={field.value}
                  onChange={(event) => {
                    const nuevoCodigo = event.target.value
                    const esCodigoValido = /^[A-Z0-9-]*$/.test(nuevoCodigo)
                    if (esCodigoValido) {
                      field.onChange(nuevoCodigo.toUpperCase())
                      setCodigoProducto(nuevoCodigo.toUpperCase())
                    }
                  }}
                  error={
                    Boolean(errors.codigoProducto) ||
                    (field.value !== undefined && !/^[A-Z0-9-]*$/.test(field.value))
                  }
                  helperText={
                    errors.codigoProducto?.message ||
                    (field.value !== undefined &&
                      'Solo se puede utilizar letras, números y un guión, escriba en MAYÚSCULAS.')
                  }
                />
              )}
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Controller
              name={'codigoNandina'}
              control={control}
              render={({ field }) => (
                <FormTextField
                  name="codigoNandina"
                  label="Codigo Nandina"
                  error={Boolean(errors.codigoNandina)}
                  helperText={errors.codigoNandina?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </Grid>
        </Grid>
      </SimpleCard>
    </>
  )
}

export default ProductoHomologacion
