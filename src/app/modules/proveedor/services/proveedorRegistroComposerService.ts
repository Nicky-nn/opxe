import {
  ProveedorApiInputProps,
  ProveedorInputProp,
} from '../interfaces/proveedor.interface'

/**
 * Componemos el input a valores que acepta el servicio
 * @param input
 */
export const proveedorRegistroComposeService = (
  input: ProveedorInputProp,
): ProveedorApiInputProps => {
  return {
    codigo: input.codigo,
    ciudad: input.ciudad,
    contacto: input.contacto,
    correo: input.correo,
    direccion: input.direccion,
    nombre: input.nombre,
    telefono: input.telefono,
  }
}
