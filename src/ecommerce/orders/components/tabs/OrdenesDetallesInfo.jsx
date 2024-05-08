import {Box} from "@mui/material";
import OrdersDetallesEstatusInfoAdTable from "../tables/OrdersDetallesEstatusInfoAdTable.jsx";

export default function OrdenesDetallesInfo({datosSeleccionados, datosSecSubdocDetalles}) {
    return (
        <Box>
            <OrdersDetallesEstatusInfoAdTable
                datosSecSubdocDetalles={datosSecSubdocDetalles}
                datosSeleccionados={datosSeleccionados}
            />
        </Box>
    );
}