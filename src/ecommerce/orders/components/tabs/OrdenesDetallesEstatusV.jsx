import {Box} from "@mui/material";
import OrdersDetallesEstatusVTable from "../tables/OrdersDetallesEstatusVTable.jsx";

export default function OrdenesDetallesEstatusV({datosSeleccionados, datosSecSubdocDetalles}) {
    return (
        <Box>
            <OrdersDetallesEstatusVTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdocDetalles={datosSecSubdocDetalles}
            />
        </Box>
    );
}