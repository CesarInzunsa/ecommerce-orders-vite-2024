import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdenesFormaPagoModel() {
    return {
        IdTipoPagoOK: {type: String, require: true},
        MontoPagado: {type: Number, require: true},
        MontoRecibido: {type: Number, require: true},
        MontoDevuelto: {type: Number, require: true},
        info_ad: [],
        detail_row: getDetailRow()
    }
}