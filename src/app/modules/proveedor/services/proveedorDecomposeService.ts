import { ActionFormProps } from '../../../interfaces'
import { genReplaceEmpty } from '../../../utils/helper'
import { ProveedorInputProp, ProveedorProps } from '../interfaces/proveedor.interface'

/**
 * Decomponemos al cliente para el formulario
 * @param input
 * @param action
 */
export const proveedorDecomposeService = (
  input: ProveedorProps,
  action: ActionFormProps,
): ProveedorInputProp => {
  return {
    codigo: input.codigo,
    nombre: genReplaceEmpty(input.nombre, ''),
    direccion: genReplaceEmpty(input.direccion, ''),
    ciudad: genReplaceEmpty(input.ciudad, ''),
    contacto: genReplaceEmpty(input.contacto, ''),
    correo: genReplaceEmpty(input.correo, ''),
    telefono: genReplaceEmpty(input.telefono, ''),
    action,
  }
}
