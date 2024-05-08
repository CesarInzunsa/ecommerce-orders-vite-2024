import {Box} from "@mui/material";
import OrdersProveedoresTable from "../tables/OrdersProveedoresTable.jsx";

export default function OrdenesProveedores({datosSeleccionados, setDatosSecSubdocProveedores}) {
    return (
        <Box>
            <OrdersProveedoresTable
                datosSeleccionados={datosSeleccionados}
                setDatosSecSubdocProveedores={setDatosSecSubdocProveedores}
            />
        </Box>
    );
}