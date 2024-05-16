import {OrdenesFormaPagoInfoAdModel} from "../models/OrdenesFormaPagoInfoAdModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesFormaPagoInfoAdValues = (values, ordenesFormaPagoInfoAd, index) => {
    // Si no hay valores
    let OrdenesDetalleEstatus = ordenesFormaPagoInfoAd || OrdenesFormaPagoInfoAdModel();
    // Crear un nuevo objeto de estatus
    let nuevoDetalle = {
        Etiqueta: values.IdTipoEstatusOK,
        Valor: values.Valor,
        IdSeccionOK: values.IdSeccionOK,
        Seccion: values.Seccion,
        Secuencia: values.Secuencia,
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesDetalleEstatus.forma_pago[index].info_ad.push(nuevoDetalle);

    return OrdenesDetalleEstatus;
}