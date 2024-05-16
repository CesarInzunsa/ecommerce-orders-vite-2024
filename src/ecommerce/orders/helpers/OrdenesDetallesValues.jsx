import {OrdenesDetallesModel} from "../models/OrdenesDetallesModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesDetallesValues = (values, ordenesDetalle) => {
    // Si no hay valores
    let OrdenesDetalle = ordenesDetalle || OrdenesDetallesModel();
    // Crear un nuevo objeto de estatus
    let nuevoDetalle = {
        IdProdServOK: values.IdProdServOK,
        IdPresentaOK: values.IdPresentaOK,
        DesPresentaPS: values.DesPresentaPS,
        Cantidad: values.Cantidad,
        PrecioUniSinIVA: values.PrecioUniSinIVA,
        PrecioUniConIVA: values.PrecioUniConIVA,
        PorcentajeIVA: values.PorcentajeIVA,
        MontoUniIVA: values.MontoUniIVA,
        SubTotalSinIVA: values.SubTotalSinIVA,
        SubTotalConIVA: values.SubTotalConIVA
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesDetalle.detalle_ps.push(nuevoDetalle);

    return OrdenesDetalle;
}