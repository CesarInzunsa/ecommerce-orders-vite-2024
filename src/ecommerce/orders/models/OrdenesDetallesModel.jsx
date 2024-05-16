import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdenesDetallesModel() {
    return {
        IdProdServOK: {type: String, require: true}, //"9001-64e148b5ae58"
        IdPresentaOK: {type: String, require: true}, //"9001-64e148b5ae58-64e148b5"(64e148b5: se extrae la precentacion que se desea desede la colecion)
        DesPresentaPS: {type: String},
        Cantidad: {type: Number},
        PrecioUniSinIVA: {type: Number},
        PrecioUniConIVA: {type: Number},
        PorcentajeIVA: {type: Number},
        MontoUniIVA: {type: Number},
        SubTotalSinIVA: {type: Number},
        SubTotalConIVA: {type: Number},
        estatus: [],
        info_ad: [],
        paquete: [],
        detail_row: getDetailRow()
    }
}