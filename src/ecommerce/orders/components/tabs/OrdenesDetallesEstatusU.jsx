import {Box} from "@mui/material";
import OrdersDetallesEstatusUTable from "../tables/OrdersDetallesEstatusUTable.jsx";

export default function OrdenesDetallesEstatusU({datosSeleccionados, datosSecSubdocDetalles}) {
    return (
        <Box>
            <OrdersDetallesEstatusUTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdocDetalles={datosSecSubdocDetalles}
            />
        </Box>
    );
}