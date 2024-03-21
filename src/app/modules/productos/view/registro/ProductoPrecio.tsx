import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { FunctionComponent, useEffect } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'

import AlertError from '../../../../base/components/Alert/AlertError'
import { NumeroFormat } from '../../../../base/components/Mask/NumeroFormat'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import { handleSelect } from '../../../../utils/helper'
import { apiSinMonedaUnidadMedida } from '../../../sin/api/sinMonedaUnidadMedida.api'
import {
  SinTipoMonedaProps,
  SinUnidadMedidaProps,
} from '../../../sin/interfaces/sin.interface'
import { ProductoInputProps } from '../../interfaces/producto.interface'

interface OwnProps {
  form: UseFormReturn<ProductoInputProps>
}

type Props = OwnProps

const ProductoPrecio: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props

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

  useEffect(() => {
    if (!isLoading) {
      if (data && !getValues('unidadMedida')) {
        const servicios = data.sinUnidadMedida.find(
          (su) => su.codigoClasificador === '58',
        )
        setValue('unidadMedida', servicios || null)
      }
    }
  }, [isLoading])

  return (
    <SimpleCard title={'PRECIO'}>
      <Grid container columnSpacing={3} rowSpacing={2}>
        <Grid item lg={8} md={8} xs={12}>
          {data?.sinUnidadMedida ? (
            <Controller
              name={'unidadMedida'}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.unidadMedida)}>
                  <MyInputLabel shrink>Unidad de Medida</MyInputLabel>
                  <Select<SinUnidadMedidaProps>
                    {...field}
                    styles={reactSelectStyle(Boolean(errors.unidadMedida))}
                    name={'unidadMedida'}
                    placeholder={'Seleccione la unidad de medida'}
                    menuPosition={'fixed'}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={data.sinUnidadMedida}
                    getOptionValue={(item) => item.codigoClasificador.toString()}
                    getOptionLabel={(item) =>
                      `${item.codigoClasificador} - ${item.descripcion}`
                    }
                  />
                  <FormHelperText>{errors.unidadMedida?.message || ''}</FormHelperText>
                </FormControl>
              )}
            />
          ) : (
            <AlertError
              tipo={'error'}
              mensaje={'No se pudo cargar el clasificador de monedas'}
            />
          )}
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <Controller
            control={control}
            name={'precio'}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.precio)}>
                <InputLabel>Precio</InputLabel>
                <OutlinedInput
                  {...field}
                  label={'Precio'}
                  size={'small'}
                  value={field.value}
                  onFocus={handleSelect}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputComponent={NumeroFormat as any}
                  inputProps={{}}
                  error={Boolean(errors.precio?.message)}
                />
                <FormHelperText>{errors.precio?.message || ''}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </SimpleCard>
  )
}

export default ProductoPrecio
