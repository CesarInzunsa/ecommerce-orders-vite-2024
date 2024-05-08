import {getDetailRow} from "../../helpers/Utils.jsx";

export function OrdenesDetallesInfoAdModel() {
    return {
        IdEtiquetaOK: {type: String},
        IdEtiqueta: {type: String},
        Etiqueta: {type: String},
        Valor: {type: String},
        IdTipoSeccionOK: {type: String},
        Seccion: {type: String},
        Secuencia: {type: Number},
        detail_row: getDetailRow(),
    }
}