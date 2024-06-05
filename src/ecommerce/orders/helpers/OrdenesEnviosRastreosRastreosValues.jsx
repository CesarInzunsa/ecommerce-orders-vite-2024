import {OrdenesEnviosRastreosRastreosModel} from "../models/OrdenesEnviosRastreosRastreosModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesEnviosRastreosRastreosValues = (values, ordenesEnviosRastreosRastreos, index) => {
    // Si no hay valores
    let OrdenesEnviosRastreosRastreos = ordenesEnviosRastreosRastreos || OrdenesEnviosRastreosRastreosModel();
    // Crear un nuevo objeto de estatus
    let nuevoRastreo = {
        NumeroGuia: values.NumeroGuia,
        IdRepartidorOK: values.IdPresentaOK,
        NombreRepartidor: values.NombreRepartidor,
        Alias: values.Alias
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesEnviosRastreosRastreos.envios[index].rastreos.push(nuevoRastreo);

    return OrdenesEnviosRastreosRastreos;
}