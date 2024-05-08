import {getDetailRow} from "../../../helpers/Utils.jsx";

export function OrdenesProveedoresDetallesEstatusVModel() {
    return {
        IdTipoEstatusOK: {type: String},
        Actual: {type: String},
        Observacion: {type: String},
        detail_row: getDetailRow()
    }
}