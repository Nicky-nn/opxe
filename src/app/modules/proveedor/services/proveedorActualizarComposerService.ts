import { genReplaceEmpty } from '../../../utils/helper'
import {
  ProveedorApiInputProps,
  ProveedorInputProp,
} from '../interfaces/proveedor.interface'

export const proveedorActualizarComposeService = (
  input: ProveedorInputProp,
): ProveedorApiInputProps => {
  return <any>{
    codigo: input.codigo,
    ciudad: genReplaceEmpty(input.ciudad, ''),
    contacto: genReplaceEmpty(input.contacto, ''),
    correo: genReplaceEmpty(input.correo, ''),
    direccion: genReplaceEmpty(input.direccion, ''),
    nombre: genReplaceEmpty(input.nombre, ''),
    telefono: genReplaceEmpty(input.telefono, ''),
  }
}
