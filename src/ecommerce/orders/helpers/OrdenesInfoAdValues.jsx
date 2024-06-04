import {OrdenesInfoAdModel} from "../models/OrdenesInfoAdModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesInfoAdValues = (values, ordenesEstatus) => {
    let OrdenesEstatus = ordenesEstatus || OrdenesInfoAdModel();

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