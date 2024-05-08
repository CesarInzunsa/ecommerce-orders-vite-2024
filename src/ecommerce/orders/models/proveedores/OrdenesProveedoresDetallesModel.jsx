import {getDetailRow} from "../../helpers/Utils.jsx";

export function OrdenesProveedoresDetallesModel() {
    return {
        IdProdServOK: {type: String},
        IdPresentaOK: {type: String},
        DesPresentaPS: {type: String},
        Cantidad: {type: Number},
        PrecioUniSinIVA: {type: Number},
        PrecioUniConIVA: {type: Number},
        PorcentajeIVA: {type: Number},
        MontoUniIVA: {type: Number},
        SubTotalSinIVA: {type: Number},
        SubTotalConIVA: {type: Number},
        pedidos_detalle_ps_estatus_f: [],
        pedidos_detalle_ps_estatus_v: [],
        pedidos_detalle_ps_estatus_u: [],
        pedidos_detalle_ps_estatus_p: [],
        pedidos_detalle_ps_info_ad: [],
        ordenes_presenta_ps_paq: [],
        detail_row: getDetailRow()
    }
}