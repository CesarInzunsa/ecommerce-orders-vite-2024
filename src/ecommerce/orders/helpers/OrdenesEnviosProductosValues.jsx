import {OrdenesEnviosProductosModel} from "../models/OrdenesEnviosProductosModel";

// obtiene los valores capturados en la ventana modal enviados desde el evento onSubmit de Formik
export const OrdenesEnviosProductosValues = (values, ordenesEnviosProductos, index) => {
    // Si no hay valores
    let OrdenesEnviosProductos = ordenesEnviosProductos || OrdenesEnviosProductosModel();
    // Crear un nuevo objeto de estatus
    let nuevoProducto = {
        IdProdServOK: values.IdProdServOK,
        IdPresentaOK: values.IdPresentaOK,
        DesProdServ: values.DesProdServ,
        DesPresenta: values.DesPresenta,
        CantidadPed: values.CantidadPed,
        CantidadEnt: values.CantidadEnt,
    };

    // Agregar el nuevo objeto de estatus al array existente
    OrdenesEnviosProductos.envios[index].productos.push(nuevoProducto);

    return OrdenesEnviosProductos;
}