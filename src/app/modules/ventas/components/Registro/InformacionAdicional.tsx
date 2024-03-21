import { Grid } from '@mui/material'
import { Controller, UseFormReturn } from 'react-hook-form'

import { FormTextField } from '../../../../base/components/Form'
import { FacturaInputProps } from '../../interfaces/factura'

interface InformacionAdicionalProps {
  form: UseFormReturn<FacturaInputProps>
}
const InformacionAdicional = (props: InformacionAdicionalProps) => {
  // const { form } = props
  const {
    form: {
      control,
      setValue,
      formState: { errors },
    },
  } = props

  return (
    <>
      <Grid container spacing={1} rowSpacing={2}>
        <Grid item xs={12} lg={12} sm={12} md={12}>
          <Controller
            name="numeroDescripcionPaquetesBultos"
            control={control}
            render={({ field }) => (
              <FormTextField
                {...field}
                id="numeroDescripcionPaquetesBultos"
                name="numeroDescripcionPaquetesBultos"
                label="Número y descripción de paquetes (Bultos)"
                fullWidth
                multiline
                rows={3}
                onChange={(e) => {
                  setValue('numeroDescripcionPaquetesBultos', e.target.value)
                }}
                error={Boolean(errors.numeroDescripcionPaquetesBultos)}
                helperText={errors.numeroDescripcionPaquetesBultos?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} lg={12} sm={12} md={12}>
          <Controller
            name="informacionAdicional"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="informacionAdicional"
                label="Información adicional"
                fullWidth
                multiline
                rows={2}
                {...field}
                error={Boolean(errors.informacionAdicional)}
                helperText={errors.informacionAdicional?.message}
                onChange={(e) => {
                  setValue('informacionAdicional', e.target.value)
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} lg={12} sm={12} md={12}></Grid>
      </Grid>
    </>
  )
}

export default InformacionAdicional
