import { ProveedorInputProp } from '../interfaces/proveedor.interface'

/**
 * Validamos los datos de formulario del producto
 * @param input
 */
export const proveedorRegistroValidator = async (
  input: ProveedorInputProp,
): Promise<Array<string>> => {
  try {
    return []
  } catch (e: any) {
    return [e.message]
  }
}
