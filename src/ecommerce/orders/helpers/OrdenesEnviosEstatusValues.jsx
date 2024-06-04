import {OrdenesEnviosEstatusModel} from "../models/OrdenesEnviosEstatusModel";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesEnviosEstatusValues = (values, ordenesEnviosEstatus, index) => {
    // Si no hay valores
    let OrdenesEnviosEstatus = ordenesEnviosEstatus || OrdenesEnviosEstatusModel();
    // Crear un nuevo objeto de estatus
    let nuevoEstatus = {
        IdTipoEstatusOK: values.IdTipoEstatusOK,
        Actual: values.Actual,
        Observacion: values.Observacion,
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesEnviosEstatus.envios[index].estatus.push(nuevoEstatus);

    return OrdenesEnviosEstatus;
}