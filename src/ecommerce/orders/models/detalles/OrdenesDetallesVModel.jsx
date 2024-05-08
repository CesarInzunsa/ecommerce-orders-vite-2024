import {getDetailRow} from "../../helpers/Utils.jsx";

export function OrdenesDetallesVModel() {
    return {
        IdTipoEstatusOK: {type: String},
        Actual: {type: String},
        Observacion: {type: String},
        detail_row: getDetailRow(),
    }
}