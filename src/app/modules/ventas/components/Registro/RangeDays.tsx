import 'react-datepicker/dist/react-datepicker.css'
import '../../../../../styles/custom-datepicker.css'

import { Typography } from '@mui/material'
import es from 'date-fns/locale/es'
import React, { createContext, useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'

import { FacturaInputProps } from '../../interfaces/factura'

interface RangeDaysProps {
  form: UseFormReturn<FacturaInputProps>
}

const RangeDays = (props: RangeDaysProps) => {
  const { form } = props

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [startDate, endDate] = dateRange
  const [hasError, setHasError] = useState(false)

  const formatDates = (start: Date, end: Date): string => {
    const startString = start.toLocaleDateString('es', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const endString = end.toLocaleDateString('es', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    return `${startString} al ${endString}`
  }

  useEffect(() => {
    const rangeText = document.getElementById('range-text')
    if (rangeText && startDate && endDate) {
      const range = formatDates(startDate, endDate)
      rangeText.innerHTML = `<span style="font-weight:bold;"> Rango Seleccionado:</span> ${range}`
      setHasError(false)
    } else if (rangeText) {
      rangeText.textContent = ''
      setHasError(true)
    }
  }, [startDate, endDate])

  const watchPeriodoFacturado = form.watch('periodoFacturado')

  useEffect(() => {
    if (watchPeriodoFacturado === '' || watchPeriodoFacturado === undefined) {
      setDateRange([null, null]) // Reiniciar el rango de fechas
    }
  }, [
    watchPeriodoFacturado === '' ||
      watchPeriodoFacturado === undefined ||
      watchPeriodoFacturado === null,
  ])

  const handleDateChange = (update: [Date | null, Date | null]): void => {
    setDateRange(update)
    if (update[0] && update[1]) {
      form.setValue('periodoFacturado', formatDates(update[0], update[1]))
    }
  }

  return (
    <div className="custom-calendar">
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        isClearable={true}
        locale={es}
        dateFormat="dd/MM/yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        placeholderText="Seleccione un rango de fechas"
      />
      {hasError && (
        <Typography variant="body1" sx={{ mt: 2 }} className="error">
          Ningún rango seleccionado
        </Typography>
      )}
      <Typography id="range-text" variant="body1" sx={{ mt: 2 }} />
    </div>
  )
}

export default RangeDays
