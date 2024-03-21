import { Autocomplete, createFilterOptions, Grid } from '@mui/material'
import { Box, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'

import { FormTextField } from '../../../../base/components/Form'
import { FacturaInputProps } from '../../interfaces/factura'

interface DireccionesProps {
  form: UseFormReturn<FacturaInputProps>
}
const filter = createFilterOptions<PaisesProps>()
const Direcciones = (props: DireccionesProps) => {
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
            name="direccionComprador"
            control={control}
            render={({ field }) => (
              <FormTextField
                {...field}
                id="direccionComprador"
                label="Dirección Comprador"
                fullWidth
                error={Boolean(errors.direccionComprador)}
                helperText={errors.direccionComprador?.message}
                onChange={(e) => {
                  setValue('direccionComprador', e.target.value)
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} lg={5} md={6}>
          <Controller
            name="puertoDestino"
            control={control}
            render={({ field }) => (
              <FormTextField
                {...field}
                id="puertoDestino"
                label="Puerto Destino"
                inputProps={{
                  style: { textTransform: 'uppercase' },
                }}
                fullWidth
                error={Boolean(errors.puertoDestino)}
                helperText={errors.puertoDestino?.message}
                onChange={(e) => {
                  setValue('puertoDestino', e.target.value)
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} lg={7} md={6}>
          <CountrySelect form={props.form} />
        </Grid>
        <Grid item xs={12} lg={12} sm={12} md={12}>
          <CodigosIncotermSelect form={props.form} />
        </Grid>
        <Grid item xs={12} lg={12} sm={12} md={12}>
          <Controller
            name="incotermDetalle"
            control={control}
            render={({ field }) => (
              <FormTextField
                id="incotermDetalle"
                label="Detalle Incoter"
                fullWidth
                multiline
                rows={2}
                {...field}
                error={Boolean(errors.incotermDetalle)}
                helperText={errors.incotermDetalle?.message}
                onChange={(e) => {
                  setValue('incotermDetalle', e.target.value)
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

export default Direcciones

export function Paises(props: DireccionesProps) {
  const [value, setValuel] = React.useState<PaisesProps | null>(null)
  const {
    form: {
      control,
      watch,
      setValue,
      formState: { errors, isSubmitSuccessful },
    },
  } = props

  const watchPuertoDestino = watch('puertoDestino')
  const [componentKey, setComponentKey] = useState(0)

  useEffect(() => {
    if (value !== null) {
      setValuel(value)
      setValue('puertoDestino', value.title)
    }
  }, [value])

  const resetComponent = () => {
    setComponentKey((prevKey) => prevKey + 1)
    setValuel(null)
  }

  React.useEffect(() => {
    if (watchPuertoDestino === '') {
      resetComponent()
    }
  }, [isSubmitSuccessful, watchPuertoDestino])

  return (
    <Controller
      key={componentKey}
      name="puertoDestino"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Autocomplete
          {...field}
          defaultValue={null}
          value={value}
          size="small"
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setValuel({
                title: newValue,
              })
            } else if (newValue && newValue.inputValue) {
              setValuel({
                title: newValue.inputValue,
              })
            } else {
              setValuel(newValue)
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params)

            const { inputValue } = params
            const isExisting = options.some((option) => inputValue === option.title)
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                title: `Añadir "${inputValue}"`,
              })
            }

            return filtered
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="puertoDestino"
          options={paises}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option
            }
            if (option.inputValue) {
              return option.inputValue
            }
            return option.title
          }}
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          // sx={{ width: 220 }}
          freeSolo
          renderInput={(params) => (
            <FormTextField
              {...params}
              defaultValue="puertoDestino"
              id="puertoDestino"
              label="Puerto Destino"
              fullWidth
              error={Boolean(errors.puertoDestino)}
              helperText={errors.puertoDestino?.message}
            />
          )}
        />
      )}
    />
  )
}

export function CountrySelect(props: DireccionesProps) {
  const {
    form: {
      control,
      setValue,
      watch,
      formState: { errors },
    },
  } = props

  const [selectedOption, setSelectedOption] = useState(null)
  const [componentKey, setComponentKey] = useState(0)

  const resetComponent = () => {
    setComponentKey((prevKey) => prevKey + 1)
    setSelectedOption(null)
    setValue('lugarDestino', '') // Reiniciar el valor del campo "lugarDestino" a una cadena vacía
  }

  const handleSelect = (option: any) => {
    if (!option) return
    setSelectedOption(option)
    setValue('lugarDestino', option.label)
    setValue('codigoPais', option.codigo)
  }

  const textFieldValue = `${selectedOption}`

  const watchs = watch('lugarDestino')
  const watchs2 = watch('codigoPais')

  useEffect(() => {
    if (watchs === '') {
      resetComponent()
      setSelectedOption(null)
    }
  }, [watchs, watchs2])

  return (
    <>
      <Autocomplete
        key={componentKey} // Usar la variable de estado componentKey como clave única
        id="country-select-demo"
        size="small"
        options={countries}
        closeText="Cerrar"
        autoHighlight
        getOptionLabel={(option) => `${option.label} (${option.codigo})`}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              alt=""
            />
            {option.label} ({option.codigo})
          </Box>
        )}
        renderInput={(params) => (
          <Controller
            name="lugarDestino"
            control={control}
            defaultValue="DEF"
            render={({ field }) => (
              <TextField
                {...field}
                {...params}
                defaultValue={''}
                id="lugarDestino"
                label="Lugar Destino"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
                value={textFieldValue}
                error={Boolean(errors.lugarDestino)}
                helperText={errors.lugarDestino?.message}
              />
            )}
          />
        )}
        onChange={(event, newValue) => {
          handleSelect(newValue)
        }}
      />
    </>
  )
}

interface CountryType {
  codigo: string
  code: string
  label: string
  suggested?: boolean
}

const countries: readonly CountryType[] = [
  { code: 'AF', label: 'Afganistán', codigo: '1' },
  { code: 'AL', label: 'Albania', codigo: '2' },
  { code: 'DE', label: 'Alemania', codigo: '3' },
  { code: 'AD', label: 'Andorra', codigo: '4' },
  { code: 'AO', label: 'Angola', codigo: '5' },
  { code: 'AG', label: 'Antigua y Barbuda', codigo: '6' },
  { code: 'SA', label: 'Arabia Saudita', codigo: '7' },
  { code: 'DZ', label: 'Argelia', codigo: '8' },
  { code: 'AR', label: 'Argentina', codigo: '9' },
  { code: 'AM', label: 'Armenia', codigo: '10' },
  { code: 'AU', label: 'Australia', codigo: '11' },
  { code: 'AT', label: 'Austria', codigo: '12' },
  { code: 'AZ', label: 'Azerbaiyán', codigo: '13' },
  { code: 'BS', label: 'Bahamas', codigo: '14' },
  { code: 'BH', label: 'Bahrein', codigo: '15' },
  { code: 'BD', label: 'Bangladesh', codigo: '16' },
  { code: 'BB', label: 'Barbados', codigo: '17' },
  { code: 'BBB', label: 'Biolorrusia', codigo: '18' },
  { code: 'BZ', label: 'Belice', codigo: '19' },
  { code: 'BJ', label: 'Benin', codigo: '20' },
  { code: 'BT', label: 'Bhután', codigo: '21' },
  { code: 'BO', label: 'Bolivia', codigo: '22' },
  { code: 'BA', label: 'Bosnia y Herzegovina', codigo: '23' },
  { code: 'BW', label: 'Botsuana', codigo: '24' },
  { code: 'BR', label: 'Brasil', codigo: '25' },
  { code: 'BN', label: 'Brunéi', codigo: '26' },
  { code: 'BG', label: 'Bulgaria', codigo: '27' },
  { code: 'BF', label: 'Burkina Faso', codigo: '28' },
  { code: 'BI', label: 'Burundi', codigo: '29' },
  { code: 'BELG', label: 'Bélgica', codigo: '30' },
  { code: 'CV', label: 'Cabo Verde', codigo: '31' },
  { code: 'KH', label: 'Camboya', codigo: '32' },
  { code: 'CM', label: 'Camerún', codigo: '33' },
  { code: 'CA', label: 'Canadá', codigo: '34' },
  { code: 'TD', label: 'Chad', codigo: '35' },
  { code: 'CZ', label: 'Chequia', codigo: '36' },
  { code: 'CL', label: 'Chile', codigo: '37' },
  { code: 'CN', label: 'China', codigo: '38' },
  { code: 'CY', label: 'Chipre', codigo: '39' },
  { code: 'CO', label: 'Colombia', codigo: '40' },
  { code: 'KM', label: 'Comoras', codigo: '41' },
  { code: 'CG', label: 'Congo', codigo: '42' },
  { code: 'CR', label: 'Costa Rica', codigo: '43' },
  { code: 'HR', label: 'Croacia', codigo: '44' },
  { code: 'CU', label: 'Cuba', codigo: '45' },
  { code: 'CMA', label: 'Costa de Marfil', codigo: '46' },
  { code: 'DK', label: 'Dinamarca', codigo: '47' },
  { code: 'DJ', label: 'Djibouti', codigo: '48' },
  { code: 'DM', label: 'Dominica', codigo: '49' },
  { code: 'EC', label: 'Ecuador', codigo: '50' },
  { code: 'EG', label: 'Egipto', codigo: '51' },
  { code: 'SV', label: 'El Salvador', codigo: '52' },
  { code: 'AE', label: 'Emiratos Árabes Unidos', codigo: '53' },
  { code: 'ER', label: 'Eritrea', codigo: '54' },
  { code: 'SK', label: 'Eslovaquia', codigo: '55' },
  { code: 'SI', label: 'Eslovenia', codigo: '56' },
  { code: 'ES', label: 'España', codigo: '57' },
  { code: 'US', label: 'Estados Unidos', codigo: '58' },
  { code: 'EE', label: 'Estonia', codigo: '59' },
  { code: 'ET', label: 'Etiopía', codigo: '60' },
  { code: 'RU', label: 'Federación Rusa', codigo: '61' },
  { code: 'FJ', label: 'Fiji', codigo: '62' },
  { code: 'PH', label: 'Filipinas', codigo: '63' },
  { code: 'FI', label: 'Finlandia', codigo: '64' },
  { code: 'FR', label: 'Francia', codigo: '65' },
  { code: 'GA', label: 'Gabón', codigo: '66' },
  { code: 'GM', label: 'Gambia', codigo: '67' },
  { code: 'GE', label: 'Georgia', codigo: '68' },
  { code: 'GH', label: 'Ghana', codigo: '69' },
  { code: 'GD', label: 'Granada', codigo: '70' },
  { code: 'GR', label: 'Grecia', codigo: '71' },
  { code: 'GT', label: 'Guatemala', codigo: '72' },
  { code: 'GN', label: 'Guinea', codigo: '73' },
  { code: 'GQ', label: 'Guinea Ecuatorial', codigo: '74' },
  { code: 'GW', label: 'Guinea-Bissau', codigo: '75' },
  { code: 'GY', label: 'Guyana', codigo: '76' },
  { code: 'HT', label: 'Haití', codigo: '77' },
  { code: 'HN', label: 'Honduras', codigo: '78' },
  { code: 'HU', label: 'Hungría', codigo: '79' },
  { code: 'IN', label: 'India', codigo: '80' },
  { code: 'ID', label: 'Indonesia', codigo: '81' },
  { code: 'IQ', label: 'Iraq', codigo: '82' },
  { code: 'IE', label: 'Irlanda', codigo: '83' },
  { code: 'IR', label: 'Irán', codigo: '84' },
  { code: 'IS', label: 'Islandia', codigo: '85' },
  { code: 'CK', label: 'Islas Cook', codigo: '86' },
  { code: 'ISFE', label: 'Islas Feroe', codigo: '87' },
  { code: 'MH', label: 'Islas Marshall', codigo: '88' },
  { code: 'SB', label: 'Islas Salomón', codigo: '89' },
  { code: 'IL', label: 'Israel', codigo: '90' },
  { code: 'IT', label: 'Italia', codigo: '91' },
  { code: 'JM', label: 'Jamaica', codigo: '92' },
  { code: 'JP', label: 'Japón', codigo: '93' },
  { code: 'JO', label: 'Jordania', codigo: '94' },
  { code: 'KZ', label: 'Kazajstán', codigo: '95' },
  { code: 'KE', label: 'Kenia', codigo: '96' },
  { code: 'KG', label: 'Kirguistán', codigo: '97' },
  { code: 'KI', label: 'Kiribati', codigo: '98' },
  { code: 'KW', label: 'Kuwait', codigo: '99' },
  { code: 'LS', label: 'Lesoto', codigo: '100' },
  { code: 'LV', label: 'Letonia', codigo: '101' },
  { code: 'LR', label: 'Liberia', codigo: '102' },
  { code: 'LY', label: 'Libia', codigo: '103' },
  { code: 'LT', label: 'Lituania', codigo: '104' },
  { code: 'LU', label: 'Luxemburgo', codigo: '105' },
  { code: 'LB', label: 'Líbano', codigo: '106' },
  { code: 'MG', label: 'Madagascar', codigo: '107' },
  { code: 'MY', label: 'Malasia', codigo: '108' },
  { code: 'MW', label: 'Malawi', codigo: '109' },
  { code: 'MV', label: 'Maldivas', codigo: '110' },
  { code: 'MT', label: 'Malta', codigo: '111' },
  { code: 'ML', label: 'Malí', codigo: '112' },
  { code: 'MA', label: 'Marruecos', codigo: '113' },
  { code: 'MU', label: 'Mauricio', codigo: '114' },
  { code: 'MR', label: 'Mauritania', codigo: '115' },
  { code: 'FM', label: 'Micronesia', codigo: '116' },
  { code: 'MN', label: 'Mongolia', codigo: '117' },
  { code: 'ME', label: 'Montenegro', codigo: '118' },
  { code: 'MZ', label: 'Mozambique', codigo: '119' },
  { code: 'MM', label: 'Myanmar', codigo: '120' },
  { code: 'MX', label: 'México', codigo: '121' },
  { code: 'MC', label: 'Mónaco', codigo: '122' },
  { code: 'NA', label: 'Namibia', codigo: '123' },
  { code: 'NR', label: 'Nauru', codigo: '124' },
  { code: 'NP', label: 'Nepal', codigo: '125' },
  { code: 'NI', label: 'Nicaragua', codigo: '126' },
  { code: 'NG', label: 'Nigeria', codigo: '127' },
  { code: 'NU', label: 'Niue', codigo: '128' },
  { code: 'NO', label: 'Noruega', codigo: '129' },
  { code: 'NZ', label: 'Nueva Zelanda', codigo: '130' },
  { code: 'NE', label: 'Níger', codigo: '131' },
  { code: 'OM', label: 'Omán', codigo: '132' },
  { code: 'PK', label: 'Pakistán', codigo: '133' },
  { code: 'PW', label: 'Palau', codigo: '134' },
  { code: 'PA', label: 'Panamá', codigo: '135' },
  { code: 'PG', label: 'Papúa Nueva Guinea', codigo: '136' },
  { code: 'PY', label: 'Paraguay', codigo: '137' },
  { code: 'NL', label: 'Países Bajos', codigo: '138' },
  { code: 'PE', label: 'Perú', codigo: '139' },
  { code: 'PL', label: 'Polonia', codigo: '140' },
  { code: 'PT', label: 'Portugal', codigo: '141' },
  { code: 'QA', label: 'Qatar', codigo: '142' },
  { code: 'GB', label: 'Reino Unido', codigo: '143' },
  { code: 'CF', label: 'República Centroafricana', codigo: '144' },
  { code: 'LAO', label: 'República Democrática Popular Lao', codigo: '145' },
  { code: 'RCO', label: ' Republica del Congo', codigo: '146' },
  { code: 'DO', label: 'República Dominicana', codigo: '147' },
  { code: 'KR', label: 'República Popular Demorática de Corea', codigo: '148' },
  { code: 'TZ', label: 'República Unida de Tanzania', codigo: '149' },
  { code: 'KR', label: 'República de Corea', codigo: '150' },
  { code: 'MD', label: 'República de Moldova', codigo: '151' },
  { code: 'SI', label: 'República Árabe Siria', codigo: '152' },
  { code: 'RO', label: 'Rumania', codigo: '153' },
  { code: 'RW', label: 'Ruanda', codigo: '154' },
  { code: 'KN', label: 'San Cristóbal y Nieves', codigo: '155' },
  { code: 'WS', label: 'Samoa', codigo: '156' },
  { code: 'SM', label: 'San Marino', codigo: '157' },
  { code: 'VC', label: 'San Vicente y las Granadinas', codigo: '158' },
  { code: 'LC', label: 'Santa Lucía', codigo: '159' },
  { code: 'ST', label: 'Santo Tomé y Príncipe', codigo: '160' },
  { code: 'SN', label: 'Senegal', codigo: '161' },
  { code: 'RS', label: 'Servia', codigo: '162' },
  { code: 'WS', label: 'Seychelles', codigo: '163' },
  { code: 'SL', label: 'Sierra Leona', codigo: '164' },
  { code: 'SG', label: 'Singapur', codigo: '165' },
  { code: 'SO', label: 'Somalia', codigo: '166' },
  { code: 'LK', label: 'Sri Lanka', codigo: '167' },
  { code: 'ZA', label: 'Sudáfrica', codigo: '168' },
  { code: 'SD', label: 'Sudán', codigo: '169' },
  { code: 'SS', label: 'Sudán del Sur', codigo: '170' },
  { code: 'SE', label: 'Suecia', codigo: '171' },
  { code: 'CH', label: 'Suiza', codigo: '172' },
  { code: 'SR', label: 'Suriname', codigo: '173' },
  { code: 'EH', label: 'Suazilandia', codigo: '174' },
  { code: 'TH', label: 'Tailandia', codigo: '175' },
  { code: 'TJ', label: 'Tayikistán', codigo: '176' },
  { code: 'TL', label: 'Timor Oriental', codigo: '177' },
  { code: 'TG', label: 'Togo', codigo: '178' },
  { code: 'Tk', label: 'Tokelau', codigo: '179' },
  { code: 'TO', label: 'Tonga', codigo: '180' },
  { code: 'TT', label: 'Trinidad y Tobago', codigo: '181' },
  { code: 'TM', label: 'Turkmenistán', codigo: '182' },
  { code: 'TR', label: 'Turquía', codigo: '183' },
  { code: 'TV', label: 'Tuvalu', codigo: '184' },
  { code: 'TN', label: 'Túnez', codigo: '185' },
  { code: 'UA', label: 'Ucrania', codigo: '186' },
  { code: 'UG', label: 'Uganda', codigo: '187' },
  { code: 'UY', label: 'Uruguay', codigo: '188' },
  { code: 'UZ', label: 'Uzbekistán', codigo: '189' },
  { code: 'VU', label: 'Vanuatu', codigo: '190' },
  { code: 'VE', label: 'Venezuela', codigo: '191' },
  { code: 'VN', label: 'Vietnam', codigo: '192' },
  { code: 'YE', label: 'Yemen', codigo: '193' },
  { code: 'ZM', label: 'Zambia', codigo: '194' },
  { code: 'ZW', label: 'Zimbabue', codigo: '195' },
  { code: 'MK', label: 'República de Macedonia', codigo: '196' },
  { code: 'NOHAY', label: 'No Registrado', codigo: '197' },
  { code: 'NEER', label: 'Antillas Neerlandesas', codigo: '198' },
  { code: 'AW', label: 'Aruba', codigo: '199' },
  { code: 'BW', label: 'Bermudas', codigo: '200' },
  { code: 'KY', label: 'Islas Caimán', codigo: '201' },
  { code: 'GL', label: 'Groenlandia', codigo: '202' },
  { code: 'ISM', label: 'Islas Malvinas', codigo: '203' },
  { code: 'Yugos', label: 'Yugoslavia', codigo: '204' },
  { code: 'PR', label: 'Puerto Rico', codigo: '205' },
  { code: 'HK', label: 'Hong Kong', codigo: '206' },
  { code: 'FOR', label: 'Formosa', codigo: '207' },
  { code: 'NOESP', label: 'No Especificado', codigo: '208' },
  { code: 'VI', label: 'Islas Vírgenes Británicas', codigo: '209' },
]

interface PaisesProps {
  inputValue?: string
  title: string
}
const paises: readonly PaisesProps[] = [
  { title: 'Argentina - Buenos Aires' },
  { title: 'Argentina - Córdoba' },
  { title: 'Argentina - Mendoza' },
  { title: 'Argentina - Rosario' },
  { title: 'Argentina - Tucumán' },
  { title: 'Bolivia - La Paz' },
  { title: 'Bolivia - Santa Cruz' },
  { title: 'Bolivia - Sucre' },
  { title: 'Bolivia - Cochabamba' },
  { title: 'Bolivia - Oruro' },
  { title: 'Bolivia - Potosí' },
  { title: 'Bolivia - Tarija' },
  { title: 'Bolivia - Trinidad' },
  { title: 'Bolivia - Cobija' },
  { title: 'Brasil - Belo Horizonte' },
  { title: 'Brasil - Brasilia' },
  { title: 'Brasil - Curitiba' },
  { title: 'Brasil - Fortaleza' },
  { title: 'Brasil - Goiânia' },
  { title: 'Brasil - Manaus' },
  { title: 'Brasil - Porto Alegre' },
  { title: 'Brasil - Recife' },
  { title: 'Brasil - Rio de Janeiro' },
  { title: 'Brasil - Salvador' },
  { title: 'Brasil - São Paulo' },
  { title: 'Chile - Antofagasta' },
  { title: 'Chile - Concepción' },
  { title: 'Chile - Iquique' },
  { title: 'Chile - La Serena' },
  { title: 'Chile - Puerto Montt' },
  { title: 'Chile - Santiago' },
  { title: 'Chile - Valparaíso' },
  { title: 'Colombia - Barranquilla' },
  { title: 'Colombia - Bogotá' },
  { title: 'Colombia - Cali' },
  { title: 'Colombia - Medellín' },
  { title: 'Colombia - Pereira' },
  { title: 'Colombia - Santa Marta' },
  { title: 'Costa Rica - San José' },
  { title: 'Ecuador - Guayaquil' },
  { title: 'Ecuador - Quito' },
  { title: 'El Salvador - San Salvador' },
  { title: 'Guatemala - Ciudad de Guatemala' },
  { title: 'Honduras - San Pedro Sula' },
  { title: 'Honduras - Tegucigalpa' },
  { title: 'México - Ciudad de México' },
  { title: 'México - Guadalajara' },
  { title: 'México - Monterrey' },
  { title: 'México - Puebla' },
  { title: 'México - Tijuana' },
  { title: 'Nicaragua - Managua' },
  { title: 'Panamá - Ciudad de Panamá' },
  { title: 'Paraguay - Asunción' },
  { title: 'Perú - Arequipa' },
  { title: 'Perú - Chiclayo' },
  { title: 'Perú - Cusco' },
  { title: 'Perú - Lima' },
  { title: 'Perú - Piura' },
  { title: 'Perú - Trujillo' },
  { title: 'República Dominicana - Santo Domingo' },
  { title: 'Uruguay - Montevideo' },
  { title: 'Venezuela - Caracas' },
  { title: 'Venezuela - Maracaibo' },
  { title: 'Venezuela - Valencia' },
]

interface IncotereProps {
  inputValue?: string
  title: string
}

const incoterm: readonly IncotereProps[] = [
  { title: 'EXW - Ex Works (En fábrica)' },
  { title: 'FCA - Free Carrier (Franco transportista)' },
  { title: 'FAS - Free Alongside Ship (Franco al costado del buque)' },
  { title: 'FOB - Free On Board (Franco a bordo)' },
  { title: 'CFR - Cost and Freight (Coste y flete)' },
  { title: 'CIF - Cost, Insurance and Freight (Coste, seguro y flete)' },
  { title: 'CPT - Carriage Paid To (Transporte pagado hasta)' },
  { title: 'CIP - Carriage and Insurance Paid To (Transporte y seguro pagados hasta)' },
  { title: 'DAT - Delivered At Terminal (Entregada en terminal)' },
  { title: 'DAP - Delivered At Place (Entregada en lugar)' },
  { title: 'DDP - Delivered Duty Paid (Entregada derechos pagados)' },
]
export const CodigosIncotermSelect = (props: DireccionesProps) => {
  const [value, setValuel] = React.useState<IncotereProps | null>(null)
  const {
    form: {
      control,
      watch,
      setValue,
      formState: { errors, isSubmitSuccessful },
    },
  } = props

  const watchvalue = watch('incoterm')

  const [componentKey, setComponentKey] = useState(0)
  const resetComponent = () => {
    setComponentKey((prevKey) => prevKey + 1)
    setValuel(null)
  }

  React.useEffect(() => {
    if (watchvalue === '') {
      resetComponent()
    }
  }, [watchvalue])

  React.useEffect(() => {
    if (value && value.title) {
      const parts = value.title.split('-')
      const textBeforeDash = parts[0].trim()
      setValue('incoterm', textBeforeDash)
    }
  }, [value])

  React.useEffect(() => {
    setValuel(null)
  }, [isSubmitSuccessful])

  return (
    <Controller
      key={componentKey}
      name="incoterm"
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          defaultValue={null}
          value={value}
          size="small"
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setValuel({
                title: newValue,
              })
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setValuel({
                title: newValue.inputValue,
              })
            } else {
              setValuel(newValue)
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params)

            const { inputValue } = params
            // Suggest the creation of a new value
            const isExisting = options.some((option) => inputValue === option.title)
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                title: `Añadir "${inputValue}"`,
              })
            }

            return filtered
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="incoter"
          options={incoterm}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue
            }
            // Regular option
            return option.title
          }}
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          // sx={{ width: 220 }}
          freeSolo
          renderInput={(params) => (
            <FormTextField
              {...params}
              label="Codigo Incoter"
              id="incoterm"
              error={Boolean(errors.incoterm)}
              helperText={errors.incoterm?.message}
            />
          )}
        />
      )}
    />
  )
}
