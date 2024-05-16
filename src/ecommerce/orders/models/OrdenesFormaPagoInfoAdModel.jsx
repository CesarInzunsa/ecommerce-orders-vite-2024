import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdenesFormaPagoInfoAdModel() {
    return {
        Etiqueta: {type: String, require: true},
        Valor: {type: String, require: true},
        IdSeccionOK: {type: Number, require: true},
        Seccion: {type: String, require: true},
        Secuencia: {type: Number, require: true},
        detail_row: getDetailRow()
    }
}