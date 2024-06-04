import {getDetailRow} from "../helpers/Utils.jsx";

// Modelo de datos para la orden
export function OrdenesFacturaDomicilioModel() {
    return {
        IdDomicilioOK: {type: String},
        CalleNumero: {type: String},
        CodPostal: {type: String},
        Pais: {type: String},
        Estado: {type: String},
        Municipio: {type: String},
        Localidad: {type: String},
        Colonia: {type: String},
    }
}