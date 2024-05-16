import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdenesInfoAdModel() {
    return [{
        IdEtiquetaOK: {type: String},
        IdEtiqueta: {type: String},
        Valor: {type: String},
        IdTipoSeccionOK: {type: String},
        Secuencia: {type: Number},
        detail_row: getDetailRow(),
    }]
}