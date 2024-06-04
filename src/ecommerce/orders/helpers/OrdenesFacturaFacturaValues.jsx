import {OrdenesFacturaFacturaModel} from "../models/OrdenesFacturaFacturaModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesFacturaFacturaValues = (values) => {
    // Si no hay valores
    let OrdenesFacturaFactura = ordenesFacturaFactura || OrdenesFacturaFacturaModel();
    // Crear un nuevo objeto de estatus
    let nuevaFacturaDomicilio = {
        IdPersonaOK: values.IdPersonaOK,
        Nombre: values.Nombre,
        RFC: values.RFC,
        correo: values.correo,
        Telefono: values.Telefono,
        IdTipoFacturaOK: values.IdTipoFacturaOK,
        IdTipoPago: values.IdTipoPago,
    };

    OrdenesFacturaFactura.factura.push(nuevaFacturaDomicilio);

    return OrdenesFacturaFactura
}