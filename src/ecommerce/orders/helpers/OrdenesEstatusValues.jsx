import {OrdersEstatusModel} from "../models/OrdenesEstatusModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesEstatusValues = (values, ordenesEstatus) => {
    // Si no hay valores, devolver un objeto vacío
    let OrdenesEstatus = ordenesEstatus || OrdersEstatusModel();
    // Crear un nuevo objeto de estatus
    let nuevoEstatus = {
        IdTipoEstatusOK: values.IdTipoEstatusOK,
        Actual: values.Actual,
        Observacion: values.Observacion,
        // Añadir otros campos si es necesario
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesEstatus.estatus.push(nuevoEstatus);

    // Devolver el array de estatus
    return OrdenesEstatus
}