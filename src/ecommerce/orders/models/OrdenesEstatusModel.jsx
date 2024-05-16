import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdersEstatusModel() {
    return [{
        IdTipoEstatusOK: {type: String},
        Actual: {type: String},
        Observacion: {type: String},
        detail_row: getDetailRow(),
    }]
}