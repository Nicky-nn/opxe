import '../../../../../styles/custom-datepicker.css'

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  Autocomplete,
  Button,
  createFilterOptions,
  Fab,
  FormControl,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { Box, makeStyles, TextField } from '@mui/material'
import axios from 'axios'
import es from 'date-fns/locale/es'
import React, { createContext, useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'
import AsyncSelect from 'react-select/async'

import { FormTextField } from '../../../../base/components/Form'
import { FacturaInputProps } from '../../interfaces/factura'

interface GastosProps {
  form: UseFormReturn<FacturaInputProps>
}

type Row = {
  campo: string
  valor: number
}

const Gastos = (props: GastosProps) => {
  const {
    form: {
      control,
      watch,
      setValue,
      reset,
      getValues,
      formState: { errors, isSubmitSuccessful, isSubmitted },
    },
  } = props
  const [componentKey, setComponentKey] = useState(0)
  const [rows, setRows] = useState<Row[]>([{ campo: '', valor: 0 }])
  const [rowsInternacional, setRowsInternacional] = useState<Row[]>([
    { campo: '', valor: 0 },
  ])

  const handleRemoveRow = (index: number) => {
    const updatedRows = [...rows]
    updatedRows.splice(index, 1)
    setRows(updatedRows)
  }

  const handleRemoveRowInternacional = (index: number) => {
    const updatedRows = [...rowsInternacional]
    updatedRows.splice(index, 1)
    setRowsInternacional(updatedRows)
  }

  const handleAddRow = () => {
    setRows([...rows, { campo: '', valor: 0 }])
  }

  const handleAddRowInternacional = () => {
    setRowsInternacional([...rowsInternacional, { campo: '', valor: 0 }])
  }

  const handleChangeCampo = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updatedRows = [...rows]
    updatedRows[index].campo = event.target.value
    setRows(updatedRows)
  }

  const handleChangeValor = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updatedRows = [...rows]
    const value = event.target.value
    const decimalValue = parseFloat(value)

    if (isNaN(decimalValue)) {
      updatedRows[index].valor = 0
    } else {
      updatedRows[index].valor = parseFloat(decimalValue.toFixed(5))
    }

    setRows(updatedRows)
  }

  const handleChangeCampoInternacional = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updatedRows = [...rowsInternacional]
    updatedRows[index].campo = event.target.value
    setRowsInternacional(updatedRows)
  }

  const handleChangeValorInternacional = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updatedRows = [...rowsInternacional]
    const value = event.target.value
    const decimalValue = parseFloat(value)

    if (isNaN(decimalValue)) {
      updatedRows[index].valor = 0
    } else {
      updatedRows[index].valor = parseFloat(decimalValue.toFixed(5))
    }

    setRowsInternacional(updatedRows)
  }

  const handleBlurCampo = () => {
    const gastosData = {
      nacionales: rows,
      internacionales: rowsInternacional,
    }

    const nacionalesSinCamposVacios = gastosData.nacionales.filter(
      (row) => row.campo.trim() !== '',
    )
    const internacionalesSinCamposVacios = gastosData.internacionales.filter(
      (row) => row.campo.trim() !== '',
    )
  }

  const enviarDatos = () => {
    if (rows.length === 0) {
      return
    } else {
      if (rows[0].campo === '') {
        return
      } else {
        setValue('costosGastosNacionales', rows)
      }
    }
    if (rowsInternacional.length === 0) {
      return
    } else {
      if (rowsInternacional[0].campo === '') {
        return
      } else {
        setValue('costosGastosInternacionales', rowsInternacional)
      }
    }
  }

  const resetComponent = () => {
    setRows([{ campo: '', valor: 0 }])
    setRowsInternacional([{ campo: '', valor: 0 }])
    setComponentKey((prevKey) => prevKey + 1)
  }

  const watchCostosGastosNacionales = watch('costosGastosNacionales')

  React.useEffect(() => {
    if (
      Array.isArray(watchCostosGastosNacionales) &&
      watchCostosGastosNacionales.length === 0
    ) {
      resetComponent()
    }
  }, [watchCostosGastosNacionales])

  return (
    <Grid container spacing={2}>
      <h3 style={{ paddingInlineStart: 20 }}>Nacionales</h3>
      {rows.map((row, index) => (
        <Grid container item xs={12} spacing={2} key={index}>
          <Grid item xs={7}>
            <Controller
              name="costosGastosNacionales"
              control={control}
              render={({ field }) => (
                <FormTextField
                  {...field}
                  name="costosGastosNacionales"
                  id="costosGastosNacionales"
                  value={row.campo}
                  onChange={(event) => handleChangeCampo(index, event)}
                  onBlur={enviarDatos}
                  label="Campo"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="costosGastosNacionales"
              control={control}
              render={({ field }) => (
                <FormTextField
                  {...field}
                  type="number"
                  InputProps={{
                    inputProps: {
                      step: '0.00001',
                      max: 99999.99999,
                      min: 0,
                    },
                  }}
                  id="costosGastosNacionales"
                  name="costosGastosNacionales"
                  value={row.valor}
                  onChange={(event) => handleChangeValor(index, event)}
                  onBlur={enviarDatos}
                  label="Valor"
                  fullWidth
                  onError={(error) => {
                    return error ? true : false
                  }}
                />
              )}
            />
          </Grid>
          {index === rows.length - 1 && (
            <Grid item xs={1}>
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => {
                  handleAddRow()
                  enviarDatos()
                }}
                size="small"
              >
                <AddIcon />
              </Fab>
            </Grid>
          )}
          {index !== 0 && (
            <Grid item xs={1}>
              <Fab
                color="secondary"
                aria-label="remove"
                onClick={() => {
                  handleRemoveRow(index)
                  enviarDatos()
                }}
                size="small"
              >
                <RemoveIcon />
              </Fab>
            </Grid>
          )}
        </Grid>
      ))}

      <h3 style={{ paddingInlineStart: 20 }}>Internacionales</h3>
      {rowsInternacional.map((row, index) => (
        <Grid container item xs={12} spacing={2} key={index}>
          <Grid item xs={7}>
            <Controller
              name="costosGastosInternacionales"
              control={control}
              render={({ field }) => (
                <FormTextField
                  {...field}
                  name="costosGastosInternacionales"
                  id="costosGastosInternacionales"
                  value={row.campo}
                  onChange={(event) => handleChangeCampoInternacional(index, event)}
                  onBlur={enviarDatos}
                  label="Campo"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="costosGastosInternacionales"
              control={control}
              render={({ field }) => (
                <FormTextField
                  {...field}
                  type="number"
                  InputProps={{
                    inputProps: {
                      step: '0.00001',
                      max: 99999.99999,
                      min: 0,
                    },
                  }}
                  id="costosGastosInternacionales"
                  name="costosGastosInternacionales"
                  value={row.valor}
                  onChange={(event) => handleChangeValorInternacional(index, event)}
                  onBlur={enviarDatos}
                  label="Valor"
                  fullWidth
                  onError={(error) => {
                    return error ? true : false
                  }}
                />
              )}
            />
          </Grid>
          {index === rowsInternacional.length - 1 && (
            <Grid item xs={1}>
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => {
                  handleAddRowInternacional()
                  enviarDatos()
                }}
                size="small"
              >
                <AddIcon />
              </Fab>
            </Grid>
          )}
          {index !== 0 && (
            <Grid item xs={1}>
              <Fab
                color="secondary"
                aria-label="remove"
                onClick={() => {
                  handleRemoveRowInternacional(index)
                  enviarDatos()
                }}
                size="small"
              >
                <RemoveIcon />
              </Fab>
            </Grid>
          )}
        </Grid>
      ))}
    </Grid>
  )
}

export default Gastos
