import {Box} from "@mui/material";
import OrdersEnviosProductosTable from "./tables/OrdersEnviosProductosTable.jsx";

export default function OrdenesEnviosProductos({datosSeleccionados, datosSecSubdoc}) {
    return (
        <Box>
            <OrdersEnviosProductosTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdoc={datosSecSubdoc}
            />
        </Box>
    );
}