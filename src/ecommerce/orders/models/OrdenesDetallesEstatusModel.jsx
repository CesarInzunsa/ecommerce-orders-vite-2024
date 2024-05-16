import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdenesDetallesEstatusModel() {
    return {
        IdTipoEstatusOK: {type: String, require: true},
        Actual: {type: String, require: true},
        Observacion: {type: String, require: true},
        detail_row: getDetailRow()
    }
}