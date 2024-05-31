import {Box} from "@mui/material";
import OrdersEnviosInfoAdTable from "./tables/OrdersEnviosInfoAdTable.jsx";

export default function OrdenesEnviosInfoAd({datosSeleccionados, datosSecSubdoc}) {
    return (
        <Box>
            <OrdersEnviosInfoAdTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdoc={datosSecSubdoc}
            />
        </Box>
    );
}