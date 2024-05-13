import {Box} from "@mui/material";
import OrdersDetallesInfoAdTable from "../tables/OrdersDetallesInfoAdTable.jsx";

export default function OrdenesDetallesInfoAd({datosSeleccionados, datosSecSubdocDetalles}) {
    return (
        <Box>
            <OrdersDetallesInfoAdTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdocDetalles={datosSecSubdocDetalles}
            />
        </Box>
    );
}