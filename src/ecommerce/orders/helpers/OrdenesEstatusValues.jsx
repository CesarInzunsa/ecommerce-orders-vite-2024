import {OrdersEstatusModel} from "../models/OrdenesEstatusModel.jsx";
// Importar el generador de ID
import {v4 as genID} from "uuid";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesEstatusValues = (values, ordenesEstatus) => {
    // Si no hay valores, devolver un objeto vacío
    let OrdenesEstatus = ordenesEstatus || OrdersEstatusModel();

    // generar un id aleatorio y concatenarlo al final de IdTipoEstatusOK
    values.IdTipoEstatusOK = `${values.IdTipoEstatusOK}-${genID().replace(/-/g, "").substring(0, 12)}`;

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