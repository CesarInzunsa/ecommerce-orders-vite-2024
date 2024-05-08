import {OrdersModel} from "../models/OrdersModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const ordersValues = (values) => {
    let order = OrdersModel();
    order.IdInstitutoOK = values.IdInstitutoOK;
    order.IdNegocioOK = values.IdNegocioOK;
    order.IdOrdenOK = values.IdOrdenOK;
    order.IdOrdenBK = values.IdOrdenBK;
    order.IdTipoOrdenOK = values.IdTipoOrdenOK;
    order.IdRolOK = values.IdRolOK;
    order.IdPersonaOK = values.IdPersonaOK;
    order.ordenes_estatus = [];
    order.ordenes_info_ad = [];
    order.ordenes_detalle = [];
    order.ordenes_proveedor = [];
    return order
}