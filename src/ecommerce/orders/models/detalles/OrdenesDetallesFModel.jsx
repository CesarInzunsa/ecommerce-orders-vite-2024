import {getDetailRow} from "../../helpers/Utils.jsx";

export function OrdenesDetallesFModel() {
    return {
        IdTipoEstatusOK: {type: String},
        Actual: {type: String},
        Observacion: {type: String},
        detail_row: getDetailRow(),
    }
}