import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdenesDetallesPaqueteAdModel() {
    return {
        idPresentaOK: {type: String, require: true},
        DesPresenta: {type: String, require: true},
        Cantidad: {type: Number, require: true},
        Precio: {type: Number, require: true},
        detail_row: getDetailRow()
    }
}