import {Box} from "@mui/material";
import OrdersFormaPagoTable from "../tables/OrdersFormaPagoTable.jsx";

export default function OrdenesFormaPago({datosSeleccionados, setDatosSecSubdocProveedores}) {
    return (
        <Box>
            <OrdersFormaPagoTable
                datosSeleccionados={datosSeleccionados}
                setDatosSecSubdocProveedores={setDatosSecSubdocProveedores}
            />
        </Box>
    );
}