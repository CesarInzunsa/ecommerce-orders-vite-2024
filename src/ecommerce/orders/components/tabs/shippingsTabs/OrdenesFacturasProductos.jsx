import {Box} from "@mui/material";
import OrdersFacturaProductosTable from "./tables/OrdersFacturaProductosTable.jsx";

export default function OrdenesFacturasProductos({datosSeleccionados, datosSecSubdoc, setDatosSecSubdocProductos}) {
    return (
        <Box>
            <OrdersFacturaProductosTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdoc={datosSecSubdoc}
                setDatosSecSubdocProductos={setDatosSecSubdocProductos}
            />
        </Box>
    );
}