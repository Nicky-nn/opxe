import { mixed, number, object, setLocale, string } from 'yup'
import { es } from 'yup-locales'

import { ProductoInputProps } from '../interfaces/producto.interface'

export const productoRegistroValidatorResponde = async (
  alq: ProductoInputProps,
): Promise<boolean> => {
  setLocale(es)
  const schema = object({
    codigoProducto: string().required('Debe ingresar el código del producto'),
    nombre: string().required('Debe ingresar el nombre del producto'),
    codigoActividad: mixed().required('Debe seleccionar la actividad económica'),
    codigoProductoSin: mixed().required('Debe seleccionar el producto sin'),
    precio: number().min(1).required('Debe ingresar el precio del producto'),
    codigoUnidadMedida: number().required('Debe seleccionar la unidad de medida'),
    tipoProducto: mixed().required('Debe seleccionar el tipo de producto'),
    codigoNandina: string().required('Debe ingresar el código Nandina'),
  })

  try {
    await schema.validate(alq, { abortEarly: false })
    console.log('validacion correcta')
    return true
  } catch (e: any) {
    console.log('validacion incorrecta')
    console.log(e)
    return false
  }
}

export const productoRegistroValidator = object({
  codigoProducto: string().required(),
  codigoNandina: string().required(),
  nombre: string().required(),
  codigoActividad: mixed().required(),
  codigoProductoSin: mixed().required(),
  precio: number().min(0).required(),
  codigoUnidadMedida: mixed().required(),
})
