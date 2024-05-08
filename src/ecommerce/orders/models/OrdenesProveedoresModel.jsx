export function OrdenesProveedoresModel() {
    return {
        IdOrdenOK: {type: String},
        IdOrdenBK: {type: String},
        IdTipoOrdenOK: {type: String},
        ordenes_estatus: [],
        ordenes_info_ad: [],
        ordenes_detalle: [],
        ordenes_forma_pago: [],
    }
}