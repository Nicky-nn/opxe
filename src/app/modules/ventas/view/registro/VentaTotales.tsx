// noinspection GraphQLUnresolvedReference

import { MonetizationOn, Paid } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Fab,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import InputNumber from 'rc-input-number'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { FormTextField } from '../../../../base/components/Form'
import { NumeroMask } from '../../../../base/components/Mask/NumeroMask'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { reactSelectStyle } from '../../../../base/components/MySelect/ReactSelect'
import RepresentacionGraficaUrls from '../../../../base/components/RepresentacionGrafica/RepresentacionGraficaUrls'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
import { genReplaceEmpty, openInNewTab } from '../../../../utils/helper'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { genRound } from '../../../../utils/utils'
import { apiMonedas } from '../../../base/moneda/api/monedaListado.api'
import { MonedaProps } from '../../../base/moneda/interfaces/moneda'
import { fetchFacturaCreate } from '../../api/facturaCreate.api'
import { FacturaInitialValues, FacturaInputProps } from '../../interfaces/factura'
import { genCalculoTotalesService } from '../../services/operacionesService'
import { composeFactura, composeFacturaValidator } from '../../utils/composeFactura'
import { DescuentoAdicionalDialog } from './ventaTotales/DescuentoAdicionalDialog'
interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
}
type Row = {
  campo: string
  valor: number | null
}

type Props = OwnProps

const VentaTotales: FunctionComponent<Props> = (props) => {
  const {
    user: { moneda, monedaTienda },
  } = useAuth()

  const usuario = useAuth()

  const {
    form: {
      control,
      reset,
      handleSubmit,
      setValue,
      getValues,
      watch,
      formState: { errors },
    },
  } = props
  const [openDescuentoAdicional, setOpenDescuentoAdicional] = useState(false)
  const mySwal = withReactContent(Swal)
  const inputMoneda = getValues('moneda')
  const tipoCambio = getValues('tipoCambio')

  const [monedaActual, setmonedaActual] = useState('BOB')

  const [checked, setChecked] = useState(false)

  // const [monedas2, setMonedas2] = useState([])
  const [monedas2, setMonedas2] = useState<MonedaProps[]>([])

  const handleTipoCambioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Validar el número de decimales
    const decimalCount = (value.split('.')[1] || '').length
    if (decimalCount <= 5) {
      // @ts-ignore
      setValue('tipoCambio', value.toString())
    }
  }

  const handleFocus = (event: any) => event.target.select()
  const onSubmit: SubmitHandler<FacturaInputProps> = async (data) => {
    const inputFactura = composeFactura(data)
    const notificacion = true
    try {
      await swalAsyncConfirmDialog({
        text: '¿Confirma que desea emitir el documento fiscal?',
        preConfirm: async () => {
          try {
            const resp = await fetchFacturaCreate(notificacion, inputFactura)
            reset()
            setChecked(false)
            return resp
          } catch (err) {
            swalException(err)
            // console.log('err', err)
            return false
          }
        },
      }).then((resp) => {
        if (resp.isConfirmed) {
          const { value }: any = resp
          reset({ ...FacturaInitialValues, actividadEconomica: data.actividadEconomica })
          setChecked(false)
          if (usuario.user.tipoRepresentacionGrafica === 'pdf')
            openInNewTab(value.representacionGrafica.pdf)
          if (usuario.user.tipoRepresentacionGrafica === 'rollo')
            openInNewTab(value.representacionGrafica.rollo)
          mySwal.fire({
            title: `Documento generado correctamente`,
            html: (
              <RepresentacionGraficaUrls
                representacionGrafica={value.representacionGrafica}
              />
            ),
          })
        }
      })
    } catch (err) {
      console.log('Error submit factura', err)
      swalException(err)
    }
  }

  const { data: monedas, isLoading: monedaLoading } = useQuery<MonedaProps[], Error>({
    queryKey: ['apiMonedas'],
    queryFn: async () => {
      const resp = await apiMonedas()
      setMonedas2(resp)
      if (resp.length > 0) {
        // monedaUsuario
        const sessionMoneda = resp.find(
          (i) => i.codigo === genReplaceEmpty(inputMoneda?.codigo, moneda.codigo),
        )
        // montoTienda
        const mt = resp.find((i) => i.codigo === monedaTienda.codigo)
        if (sessionMoneda && mt) {
          setValue('moneda', sessionMoneda)
          // setValue('tipoCambio', mt.tipoCambio)
        }
        return resp
      }
      return []
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  })

  const calculoMoneda = (monto: number): number => {
    try {
      return genRound((monto * tipoCambio) / genRound(inputMoneda!.tipoCambio))
    } catch (e) {
      return monto
    }
  }

  useEffect(() => {
    const totales = genCalculoTotalesService(getValues())
    setValue('montoSubTotal', totales.subTotal)
    setValue('montoPagar', totales.montoPagar)
    setValue('inputVuelto', totales.vuelto)
    setValue('total', totales.total)
  }, [getValues('descuentoAdicional'), getValues('inputMontoPagar')])

  // eslint-disable-next-line no-unused-vars
  const [componentKey, setComponentKey] = useState(0)
  const [rows, setRows] = useState<Row[]>([{ campo: '', valor: null }])
  const [rowsInternacional, setRowsInternacional] = useState<Row[]>([
    { campo: '', valor: null },
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
    setRows([...rows, { campo: '', valor: null }])
  }

  const handleAddRowInternacional = () => {
    setRowsInternacional([...rowsInternacional, { campo: '', valor: null }])
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
      updatedRows[index].valor = null
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
      updatedRows[index].valor = null
    } else {
      updatedRows[index].valor = parseFloat(decimalValue.toFixed(5))
    }

    setRowsInternacional(updatedRows)
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

  const enviarDatos2 = () => {
    // Validación y ajuste para rows
    const adjustedRows = rows.map((row) => ({
      ...row,
      valor: row.valor ?? 0,
    }))

    const filteredRows = adjustedRows.filter((row) => row.campo !== '')

    if (filteredRows.length > 0) {
      setValue('costosGastosNacionales', filteredRows)
    }

    // Validación y ajuste para rowsInternacional
    const adjustedRowsInternacional = rowsInternacional.map((row) => ({
      ...row,
      valor: row.valor ?? 0,
    }))

    const filteredRowsInternacional = adjustedRowsInternacional.filter(
      (row) => row.campo !== '',
    )

    if (filteredRowsInternacional.length > 0) {
      setValue('costosGastosInternacionales', filteredRowsInternacional)
    }
  }

  return (
    <>
      <div>
        <Accordion sx={{ backgroundColor: '#EFEFEF' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant={'subtitle2'}>GASTOS (Click para expandir)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <h3 style={{ paddingInlineStart: 20 }}>Nacionales</h3>
              {rows.map((row, index) => (
                <Grid container item xs={12} spacing={2} key={index}>
                  <Grid item xs={7}>
                    <Controller
                      name="costosGastosNacionales"
                      control={control}
                      render={() => (
                        <FormTextField
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
                      name={'costosGastosNacionales'}
                      control={control}
                      render={() => (
                        <FormControl
                          fullWidth
                          error={Boolean(errors.costosGastosNacionales)}
                        >
                          <InputLabel>Valor</InputLabel>
                          <OutlinedInput
                            label={'Valor'}
                            size={'small'}
                            value={row.valor !== null ? row.valor.toString() : ''}
                            onChange={(event) => handleChangeValor(index, event)}
                            onBlur={enviarDatos}
                            inputComponent={NumeroMask as any}
                            inputProps={{
                              scale: 5,
                            }}
                            error={Boolean(errors.costosGastosNacionales)}
                          />
                          <FormHelperText>
                            {errors.costosGastosNacionales?.message || ''}
                          </FormHelperText>
                        </FormControl>
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
                      render={() => (
                        <FormTextField
                          name="costosGastosInternacionales"
                          id="costosGastosInternacionales"
                          value={row.campo}
                          onChange={(event) =>
                            handleChangeCampoInternacional(index, event)
                          }
                          onBlur={enviarDatos}
                          label="Campo"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      name={'costosGastosInternacionales'}
                      control={control}
                      render={() => (
                        <FormControl
                          fullWidth
                          error={Boolean(errors.costosGastosInternacionales)}
                        >
                          <InputLabel>Valor</InputLabel>
                          <OutlinedInput
                            label={'Valor'}
                            size={'small'}
                            value={row.valor !== null ? row.valor.toString() : ''}
                            onChange={(event) =>
                              handleChangeValorInternacional(index, event)
                            }
                            onBlur={enviarDatos}
                            inputComponent={NumeroMask as any}
                            inputProps={{
                              scale: 5,
                            }}
                            error={Boolean(errors.costosGastosInternacionales)}
                          />
                          <FormHelperText>
                            {errors.costosGastosInternacionales?.message || ''}
                          </FormHelperText>
                        </FormControl>
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
          </AccordionDetails>
        </Accordion>
      </div>

      {/* b */}

      <Grid>
        <div style={{ display: 'flex', alignItems: 'center' }}></div>
      </Grid>
      <SimpleCard title="Cálculo de los totales" childIcon={<MonetizationOn />}>
        {monedaLoading ? (
          <AlertLoading />
        ) : (
          <Controller
            name="moneda"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.moneda)}>
                <MyInputLabel shrink>Tipo Moneda</MyInputLabel>
                <Select<MonedaProps>
                  styles={reactSelectStyle(Boolean(errors.moneda))}
                  name="moneda"
                  placeholder={'Seleccione la moneda de venta'}
                  value={field.value}
                  onChange={async (val: any) => {
                    if (!val) {
                      // Opción "Agregar nueva moneda" seleccionada
                      field.onChange(val)
                      return
                    }

                    const selectedMoneda = monedas2.find((m) => m.sigla === val.sigla)
                    if (selectedMoneda) {
                      // @ts-ignore
                      setValue('tipoCambio', selectedMoneda.tipoCambio)
                      setmonedaActual(selectedMoneda.sigla)
                    }
                    field.onChange(val)
                  }}
                  onBlur={async () => {
                    field.onBlur()
                  }}
                  isSearchable={false}
                  options={monedas}
                  getOptionValue={(item) => item.codigo.toString()}
                  getOptionLabel={(item) => `${item.descripcion} (${item.sigla})`}
                />
                {errors.moneda && (
                  <FormHelperText>{errors.moneda?.message}</FormHelperText>
                )}
                <Controller
                  name="tipoCambio"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^\d+(\.\d{1,5})?$/, // Validar hasta 5 decimales
                      message: 'Ingrese un valor válido con hasta 5 decimales',
                    },
                  }}
                  render={({ field }) => (
                    <FormTextField
                      type="text" // Cambiar a tipo de texto para permitir validación personalizada
                      style={{ marginTop: 15 }}
                      id="tipoCambio"
                      label="Tipo de Cambio"
                      fullWidth
                      error={Boolean(errors.tipoCambio)}
                      helperText={errors.tipoCambio?.message}
                      onChange={handleTipoCambioChange}
                      value={isNaN(field.value) ? '' : field.value}
                    />
                  )}
                />
              </FormControl>
            )}
          />
        )}

        <List dense sx={{ mt: 2 }}>
          <Divider />
          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="subtitle1" gutterBottom>
                {getValues('montoSubTotal') || 0}{' '}
                <span style={{ fontSize: '0.8em' }}>{inputMoneda?.sigla || ''}</span>
              </Typography>
            }
          >
            <ListItemText primary={<strong>SUB-TOTAL</strong>} />
          </ListItem>
          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="subtitle1" gutterBottom>
                {rows.reduce((total, item) => total + (item.valor ?? 0), 0)}{' '}
                <span style={{ fontSize: '0.8em' }}>{inputMoneda?.sigla || ''}</span>
              </Typography>
            }
          >
            <ListItemText primary={<strong>GASTOS NACIONALES</strong>} />
          </ListItem>
          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="subtitle1" gutterBottom>
                {rowsInternacional.reduce((total, item) => total + (item.valor ?? 0), 0)}{' '}
                <span style={{ fontSize: '0.8em' }}>{inputMoneda?.sigla || ''}</span>
              </Typography>
            }
          >
            <ListItemText primary={<strong>GASTOS INTERNACIONALES</strong>} />
          </ListItem>

          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <>
                <Link
                  href="#"
                  onClick={() => setOpenDescuentoAdicional(true)}
                  variant="subtitle1"
                  underline="hover"
                >
                  {numberWithCommas(getValues('descuentoAdicional') || 0, {})}
                  <span style={{ fontSize: '0.8em' }}> {inputMoneda?.sigla || ''}</span>
                </Link>
                <DescuentoAdicionalDialog
                  id="ringtone-menu"
                  keepMounted={false}
                  open={openDescuentoAdicional}
                  onClose={(newValue) => {
                    setOpenDescuentoAdicional(false)
                    if (newValue || newValue === 0) {
                      setValue('descuentoAdicional', newValue)
                    }
                  }}
                  value={getValues('descuentoAdicional') || 0}
                />
              </>
            }
          >
            <ListItemText primary={<strong>DESCUENTO ADICIONAL</strong>} />
          </ListItem>

          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="subtitle1" gutterBottom>
                {getValues('total') +
                  rows.reduce((total, item) => total + (item.valor ?? 0), 0) +
                  rowsInternacional.reduce(
                    (total, item) => total + (item.valor ?? 0),
                    0,
                  ) || 0}{' '}
                <span style={{ fontSize: '0.8em' }}>{inputMoneda?.sigla || ''}</span>
              </Typography>
            }
          >
            <ListItemText primary={<strong>TOTAL</strong>} />
          </ListItem>
          <Divider
            variant="inset"
            component="li"
            style={{ marginTop: 10, marginBottom: 20 }}
          />
          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="h6" gutterBottom>
                {getValues('total') +
                  rows.reduce((total, item) => total + (item.valor ?? 0), 0) +
                  rowsInternacional.reduce(
                    (total, item) => total + (item.valor ?? 0),
                    0,
                  ) || 0}{' '}
                <span style={{ fontSize: '0.8em' }}>{inputMoneda?.sigla || ''}</span>
              </Typography>
            }
          >
            <ListItemText primary={<strong>MONTO A PAGAR</strong>} />
          </ListItem>

          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="h6" gutterBottom>
                {(() => {
                  const selectedMoneda = monedas2.find((m) => m.sigla === monedaActual)
                  if (selectedMoneda) {
                    const totalEnMonedaSeleccionada =
                      ((getValues('total') || 0) +
                        rows.reduce((total, item) => total + (item.valor ?? 0), 0) +
                        rowsInternacional.reduce(
                          (total, item) => total + (item.valor ?? 0),
                          0,
                        )) *
                      selectedMoneda.tipoCambio

                    return (
                      <>
                        {numberWithCommas(
                          calculoMoneda(totalEnMonedaSeleccionada),
                          2, // Cambia el número 2 a la cantidad de decimales deseada
                        )}{' '}
                        <span style={{ fontSize: '0.8em' }}>{'BOB'}</span>
                      </>
                    )
                  } else {
                    return ''
                  }
                })()}
              </Typography>
            }
          >
            <ListItemText primary={<strong>TOTAL EN BOLIVIANOS</strong>} />
          </ListItem>
        </List>

        <Divider style={{ marginTop: 10, marginBottom: 20 }} color={'red'} />
        <Grid sx={{ flexGrow: 1 }} container spacing={3}>
          <Grid item xs={12} md={7} lg={7}>
            <Controller
              control={control}
              name={'inputMontoPagar'}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.inputMontoPagar?.message)}>
                  <MyInputLabel shrink>Ingrese Monto</MyInputLabel>
                  <InputNumber
                    min={0}
                    id={'montoPagar'}
                    className="inputMontoPagar"
                    value={field.value}
                    onFocus={handleFocus}
                    onChange={(value: number | null) => {
                      // @ts-ignore
                      field.onChange(value)
                    }}
                    formatter={numberWithCommas}
                  />
                  <FormHelperText>{errors.inputMontoPagar?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            <small>Vuelto / Saldo</small>
            <Typography variant="h6" gutterBottom mr={2} align={'right'} color={'red'}>
              {numberWithCommas(calculoMoneda(getValues('inputVuelto') || 0), {})}
            </Typography>
          </Grid>

          {/* <Grid container spacing={2} alignItems="center">
            <Grid item xs={9} md={9} lg={9}>
              <h3 style={{ paddingInlineStart: 30 }}>Notificar al Correo Electrónico</h3>
            </Grid>
            <Grid item xs={3} md={3} lg={3}>
              <Switch
                defaultChecked={false}
                sx={{ transform: 'scale(1.5)' }}
                checked={checked}
                onChange={handleChange}
              />
            </Grid>
          </Grid> */}

          <Grid item xs={12} md={12} lg={12}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              onMouseDown={() => {
                enviarDatos2()
              }}
              fullWidth={true}
              color="success"
              startIcon={<Paid />}
            >
              REALIZAR PAGO
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
    </>
  )
}
export default VentaTotales
