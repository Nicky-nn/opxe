import { FormControl, FormHelperText } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'

import AlertError from '../../../../base/components/Alert/AlertError'
import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
import { genReplaceEmpty, isEmptyValue } from '../../../../utils/helper'
import useQueryActividades from '../../../sin/hooks/useQueryActividades'
import useQueryActividadesPorDocumentoSector from '../../../sin/hooks/useQueryActividadesPorDocumentoSector'
import {
  SinActividadesDocumentoSectorProps,
  SinActividadesProps,
} from '../../../sin/interfaces/sin.interface'
import { FacturaInputProps } from '../../interfaces/factura'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
}

type Props = OwnProps

const DatosActividadEconomica: FunctionComponent<Props> = (props) => {
  const {
    form: {
      control,
      setValue,
      reset,
      getValues,
      formState: { errors, isSubmitted, isSubmitSuccessful },
    },
  } = props
  const { user } = useAuth()
  const { actividades, actIsError, actError, actLoading } =
    useQueryActividadesPorDocumentoSector()

  useEffect(() => {
    if (!actLoading && actividades && actividades.length > 0) {
      if (isEmptyValue(getValues('actividadEconomica'))) {
        const actE = actividades.find(
          (act) => act.codigoActividad === user.actividadEconomica.codigoCaeb,
        )
        // setValue('actividadEconomica', actividades[0])
        if (actE) {
          setValue('actividadEconomica', actE)
        } else {
          setValue('actividadEconomica', actividades[0])
        }
      }
    }
  }, [actLoading])

  // console.log(
  //   `Actividad Seleccionada: ${JSON.stringify(getValues('actividadEconomica'))}`,
  // )

  if (actIsError) {
    return <AlertError mensaje={actError?.message!} />
  }

  return (
    <>
      <SimpleCard>
        {actLoading ? (
          <AlertLoading />
        ) : (
          <Controller
            name="actividadEconomica"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.actividadEconomica)}>
                <MyInputLabel shrink>Actividad Económica</MyInputLabel>
                <Select<SinActividadesDocumentoSectorProps>
                  {...field}
                  name="actividadEconomica"
                  placeholder={'Seleccione la actividad económica'}
                  value={field.value}
                  onChange={async (val: any) => {
                    field.onChange(val)
                    setValue('detalle', [])
                  }}
                  onBlur={async (val) => {
                    field.onBlur()
                  }}
                  isSearchable={false}
                  options={actividades}
                  getOptionValue={(item) => item.codigoActividad}
                  getOptionLabel={(item) =>
                    `${item.tipoActividad} - ${item.codigoActividad} - ${item.actividadEconomica}`
                  }
                />
                {errors.actividadEconomica && (
                  <FormHelperText>{errors.actividadEconomica?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}
      </SimpleCard>
    </>
  )
}

export default DatosActividadEconomica
