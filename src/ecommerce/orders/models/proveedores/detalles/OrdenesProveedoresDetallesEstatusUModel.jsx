import {getDetailRow} from "../../../helpers/Utils.jsx";

export function OrdenesProveedoresDetallesEstatusUModel() {
    return {
        IdTipoEstatusOK: {type: String},
        Actual: {type: String},
        Observacion: {type: String},
        detail_row: getDetailRow()
    }
}