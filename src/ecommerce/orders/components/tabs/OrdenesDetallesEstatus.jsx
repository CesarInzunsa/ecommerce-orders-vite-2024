import {Box} from "@mui/material";
import OrdersDetallesEstatusTable from "../tables/OrdersDetallesEstatusTable.jsx";

export default function OrdenesDetallesEstatus({datosSeleccionados, datosSecSubdocDetalles}) {
    return (
        <Box>
            <OrdersDetallesEstatusTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdocDetalles={datosSecSubdocDetalles}
            />
        </Box>
    );
}