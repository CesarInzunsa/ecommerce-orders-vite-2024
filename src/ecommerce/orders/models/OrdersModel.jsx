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
        ordenes_estatus: [],
        ordenes_info_ad: [],
        ordenes_detalle: [],
        ordenes_proveedor: [],
        detail_row: getDetailRow(),
    }
}