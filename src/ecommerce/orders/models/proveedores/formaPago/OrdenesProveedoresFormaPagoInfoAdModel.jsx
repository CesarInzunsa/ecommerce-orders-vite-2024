import {getDetailRow} from "../../../helpers/Utils.jsx";

export function OrdenesProveedoresFormaPagoInfoAdModel() {
    return {
        Etiqueta: {type: String},
        Valor: {type: String},
        IdSeccionOK: {type: String},
        Seccion: {type: String},
        Secuencia: {type: Number},
        detail_row: getDetailRow()
    }
}