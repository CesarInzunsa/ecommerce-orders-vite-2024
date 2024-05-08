import {Box} from "@mui/material";
import OrdersDetallesEstatusFTable from "../tables/OrdersDetallesEstatusFTable.jsx";

export default function OrdenesDetallesEstatusF({datosSeleccionados, datosSecSubdocDetalles}) {
    return (
        <Box>
            <OrdersDetallesEstatusFTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdocDetalles={datosSecSubdocDetalles}
            />
        </Box>
    );
}