import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdenesDetallesInfoAdModel() {
    return {
        IdEtiquetaOK: {type: String, require: true},
        Etiqueta: {type: String, require: true},
        Valor: {type: String, require: true},
        IdTipoSeccionOK: {type: String, require: true},
        Seccion: {type: String, require: true},
        Secuencia: {type: Number, require: true},
        detail_row: getDetailRow()
    }
}