import {OrdenesInfoAdModel} from "../models/OrdenesInfoAdModel.jsx";
// Importar el generador de ID
import {v4 as genID} from "uuid";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesInfoAdValues = (values, ordenesEstatus) => {
    let OrdenesEstatus = ordenesEstatus || OrdenesInfoAdModel();

    // generar un id aleatorio y concatenarlo al final de IdEtiquetaOK
    values.IdEtiquetaOK = `${values.IdEtiquetaOK}-${genID().replace(/-/g, "").substring(0, 12)}`;

    // Crear un nuevo objeto de estatus
    let nuevoInfoAd = {
        IdEtiquetaOK: values.IdEtiquetaOK,
        IdEtiqueta: values.IdEtiqueta,
        Valor: values.Valor,
        IdTipoSeccionOK: values.IdTipoSeccionOK,
        Secuencia: values.Secuencia
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesEstatus.info_ad.push(nuevoInfoAd);

    return OrdenesEstatus;
}