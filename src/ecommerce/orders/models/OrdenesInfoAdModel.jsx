import {getDetailRow} from "../helpers/Utils.jsx";

export function OrdenesInfoAdModel() {
    return {
        IdEtiquetaOK: {type: String},
        IdEtiqueta: {type: String},
        Etiqueta: {type: String},
        Valor: {type: String},
        IdTipoSeccionOK: {type: String},
        Secuencia: {type: Number},
        detail_row: getDetailRow(),
    }
}