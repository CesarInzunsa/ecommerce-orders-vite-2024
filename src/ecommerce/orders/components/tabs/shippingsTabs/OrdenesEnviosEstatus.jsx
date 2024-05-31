import {Box} from "@mui/material";
import OrdersEnviosEstatusTable from "./tables/OrdersEnviosEstatusTable.jsx";

export default function OrdenesEnviosEstatus({datosSeleccionados, datosSecSubdoc}) {
    return (
        <Box>
            <OrdersEnviosEstatusTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdoc={datosSecSubdoc}
            />
        </Box>
    );
}