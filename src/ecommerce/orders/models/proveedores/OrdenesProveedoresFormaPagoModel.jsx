import {getDetailRow} from "../../helpers/Utils.jsx";

export function OrdenesProveedoresDetallesModel() {
    return {
        IdTipoPagoOk: {type: String},
        TipoPago: {type: String},
        MontoPagado: {type: Number},
        MontoRecibido: {type: Number},
        MontoDevuelto: {type: Number},
        ordenes_info_ad: [],
        detail_row: getDetailRow()
    }
}