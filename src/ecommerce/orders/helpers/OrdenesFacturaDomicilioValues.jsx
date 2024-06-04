import {OrdenesFacturaDomicilioModel} from "../models/OrdenesFacturaDomicilioModel.jsx";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesFacturaDomicilioValues = (values, ordenesFacturaDomicilio, index) => {
    // Si no hay valores
    let OrdenesFacturaDomicilio = ordenesFacturaDomicilio || OrdenesFacturaDomicilioModel();
    // Crear un nuevo objeto de estatus
    let nuevaFacturaDomicilio = {
        IdDomicilioOK: values.IdDomicilioOK,
        CalleNumero: values.CalleNumero,
        CodPostal: values.CodPostal,
        Pais: values.Pais,
        Estado: values.Estado,
        Municipio: values.Municipio,
        Localidad: values.Localidad,
        Colonia: values.Colonia,
    };

    OrdenesFacturaDomicilio.factura[index].domicilio.push(nuevaFacturaDomicilio);

    return OrdenesFacturaDomicilio
}