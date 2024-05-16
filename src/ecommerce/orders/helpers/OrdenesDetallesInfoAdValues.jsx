import {OrdenesDetallesInfoAdModel} from "../models/OrdenesDetallesInfoAdModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesDetallesInfoAdValues = (values, ordenesDetalleInfoAd, index) => {
    // Si no hay valores
    let OrdenesDetalleInfoAd = ordenesDetalleInfoAd || OrdenesDetallesInfoAdModel();
    // Crear un nuevo objeto de estatus
    let nuevoDetalle = {
        IdEtiquetaOK: values.IdEtiquetaOK,
        IdEtiqueta: values.IdEtiqueta,
        Etiqueta: values.Etiqueta,
        Valor: values.Valor,
        IdTipoSeccionOK: values.IdTipoSeccionOK,
        Seccion: values.Seccion,
        Secuencia: values.Secuencia,
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesDetalleInfoAd.detalle_ps[index].info_ad.push(nuevoDetalle);

    return OrdenesDetalleInfoAd;
}