import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdersModel() {
    return {
        IdInstitutoOK: {type: String},
        IdNegocioOK: {type: String},
        IdOrdenOK: {type: String},
        IdOrdenBK: {type: String},
        IdTipoOrdenOK: {type: String},
        IdRolOK: {type: String},
        IdPersonaOK: {type: String},
        estatus: [],
        info_ad: [],
        detalle_ps: [],
        forma_pago: [],
        detail_row: getDetailRow(),
    }
}