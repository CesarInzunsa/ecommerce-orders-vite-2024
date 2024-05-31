import {Box} from "@mui/material";
import OrdersFacturaDomicilioTable from "./tables/OrdersFacturaDomicilioTable.jsx";

export default function OrdenesFacturasDomicilio({datosSeleccionados, datosSecSubdoc}) {
    return (
        <Box>
            <OrdersFacturaDomicilioTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdoc={datosSecSubdoc}
            />
        </Box>
    );
}