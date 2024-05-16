import {OrdenesDetallesEstatusModel} from "../models/OrdenesDetallesEstatusModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesDetallesEstatusValues = (values, ordenesDetalleEstatus, index) => {
    // Si no hay valores
    let OrdenesDetalleEstatus = ordenesDetalleEstatus || OrdenesDetallesEstatusModel();
    // Crear un nuevo objeto de estatus
    let nuevoDetalle = {
        IdTipoEstatusOK: values.IdTipoEstatusOK,
        Actual: values.Actual,
        Observacion: values.Observacion,
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesDetalleEstatus.detalle_ps[index].estatus.push(nuevoDetalle);

    return OrdenesDetalleEstatus;
}