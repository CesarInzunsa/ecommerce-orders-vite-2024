import {Box} from "@mui/material";
import OrdersFacturaProductosDescuentosTable from "./tables/OrdersFacturaProductosDescuentosTable.jsx";

export default function OrdenesFacturasProductosDescuentos({
                                                               datosSeleccionados,
                                                               datosSecSubdoc,
                                                               datosSecSubdocProductos
                                                           }) {
    return (
        <Box>
            <OrdersFacturaProductosDescuentosTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdoc={datosSecSubdoc}
                datosSecSubdocProductos={datosSecSubdocProductos}
            />
        </Box>
    );
}