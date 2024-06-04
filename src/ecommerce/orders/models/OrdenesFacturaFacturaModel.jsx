import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la factura
export function OrdenesFacturaFacturaModel() {
    return {
        IdPersonaOK: {type: String, require: true},
        Nombre: {type: String, require: true},
        RFC: {type: String, require: true},
        correo: {type: String, require: true},
        telefono: {type: String, require: true},
        IdTipoFacturaOK: {type: String, require: true},
        IdTipoPago: {type: String, require: true},
        domicilio: [],
        productos: [],
        cliente: {},
        vendedor: {},
        envios: [],
    }
}