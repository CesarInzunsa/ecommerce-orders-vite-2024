import {Box} from "@mui/material";
import OrdersDetallesPaqueteTable from "../tables/OrdersDetallesPaqueteTable.jsx";

export default function OrdenesDetallesPaquete({datosSeleccionados, datosSecSubdocDetalles}) {
    return (
        <Box>
            <OrdersDetallesPaqueteTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdocDetalles={datosSecSubdocDetalles}
            />
        </Box>
    );
}