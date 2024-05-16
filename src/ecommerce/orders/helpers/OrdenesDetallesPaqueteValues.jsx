import {OrdenesDetallesPaqueteAdModel} from "../models/OrdenesDetallesPaqueteAdModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesDetallesPaqueteValues = (values, ordenesDetallePaquete, index) => {
    // Si no hay valores
    let OrdenesDetallePaquete = ordenesDetallePaquete || OrdenesDetallesPaqueteAdModel();
    // Crear un nuevo objeto de estatus
    let nuevoDetalle = {
        DesPresenta: values.DesPresenta,
        Cantidad: values.Cantidad,
        Precio: values.Precio,
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesDetallePaquete.detalle_ps[index].paquete.push(nuevoDetalle);

    return OrdenesDetallePaquete;
}