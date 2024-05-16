import {OrdenesFormaPagoModel} from "../models/OrdenesFormaPagoModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesFormaPagoValues = (values, ordenesFormaPago) => {
    // Si no hay valores
    let OrdenesFormaPago = ordenesFormaPago || OrdenesFormaPagoModel();
    // Crear un nuevo objeto de estatus
    let nuevoDetalle = {
        IdTipoPagoOK: values.IdTipoPagoOK,
        MontoPagado: values.MontoPagado,
        MontoRecibido: values.MontoRecibido,
        MontoDevuelto: values.MontoDevuelto,
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesFormaPago.forma_pago.push(nuevoDetalle);

    return OrdenesFormaPago;
}