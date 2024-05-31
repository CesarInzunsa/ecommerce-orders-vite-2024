import {Box} from "@mui/material";
import OrdersEnviosRastreosSeguimientoTable from "./tables/OrdersEnviosRastreosSeguimientoTable.jsx";

export default function OrdenesEnviosRastreosSeguimiento({datosSeleccionados, datosSecSubdoc, datosSecSubdocRastreos}) {
    return (
        <Box>
            <OrdersEnviosRastreosSeguimientoTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdoc={datosSecSubdoc}
                datosSecSubdocRastreos={datosSecSubdocRastreos}
            />
        </Box>
    );
}