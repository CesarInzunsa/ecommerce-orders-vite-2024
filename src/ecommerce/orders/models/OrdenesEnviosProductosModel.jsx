// Modelo de datos para envios-productos
export function OrdenesEnviosProductosModel() {
    return {
        IdProdServOK: {type: String},
        IdPresentaOK: {type: String},
        DesProdServ: {type: String},
        DesPresenta: {type: String},
        CantidadPed: {type: Number},
        CantidadEnt: {type: Number}
    }
}