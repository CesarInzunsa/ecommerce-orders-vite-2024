import {Box} from "@mui/material";

export default function OrdenesProveedoresDetalles({
                                                       datosSeleccionados,
                                                       datosSecSubdocDetalles,
                                                       datosSecSubdocProveedoresDetalles
                                                   }) {

    console.log("Datos seleccionados: ", datosSeleccionados);
    console.log("Datos subdocumento detalles: ", datosSecSubdocDetalles);
    console.log("Datos subdocumento proveedores detalles: ", datosSecSubdocProveedoresDetalles);

    return (
        <Box>
            <h1>OrdenesProveedoresDetalles</h1>
        </Box>
    );
}