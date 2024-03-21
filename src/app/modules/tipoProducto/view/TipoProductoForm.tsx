import { FormControl, Grid, TextField } from '@mui/material'
import { FunctionComponent } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select, { SingleValue } from 'react-select'

import AlertError from '../../../base/components/Alert/AlertError'
import AlertLoading from '../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyle } from '../../../base/components/MySelect/ReactSelect'
import useQueryTiposProducto from '../hooks/useQueryTiposProducto'
import {
  TipoProductoInputProp,
  TipoProductoProps,
} from '../interfaces/tipoProducto.interface'

interface OwnProps {
  form: UseFormReturn<TipoProductoInputProp>
}

type Props = OwnProps

const TipoProductoForm: FunctionComponent<Props> = (props) => {
  const { form } = props
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = form

  const { tiposProducto, tpLoading, tpError, tpIsError } = useQueryTiposProducto()

  if (tpIsError) return <AlertError mensaje={tpError!.message!} />

  return (
    <>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            {tpLoading ? (
              <AlertLoading />
            ) : (
              <Controller
                control={control}
                name={'codigoParent'}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <MyInputLabel shrink>Tipo Producto</MyInputLabel>
                    <Select<TipoProductoProps>
                      {...field}
                      menuPosition={'fixed'}
                      name="codigoParent"
                      placeholder={'Seleccione...'}
                      styles={reactSelectStyle(Boolean(errors.codigoParent))}
                      value={tiposProducto?.find(
                        (tp) => tp._id === getValues('codigoParent'),
                      )}
                      onChange={(codigoParent: SingleValue<TipoProductoProps>) => {
                        field.onChange(codigoParent)
                        setValue('codigoParent', codigoParent?._id ?? null)
                      }}
                      isSearchable={false}
                      options={tiposProducto}
                      isClearable={true}
                      getOptionValue={(ps) => ps._id}
                      getOptionLabel={(item) => `${item.parientes}`}
                    />
                  </FormControl>
                )}
              />
            )}
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Controller
              control={control}
              name={'descripcion'}
              render={({ field }) => (
                <FormControl fullWidth>
                  <MyInputLabel shrink>Descripción</MyInputLabel>
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    error={Boolean(errors.descripcion)}
                    helperText={errors.descripcion?.message}
                  />
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default TipoProductoForm
