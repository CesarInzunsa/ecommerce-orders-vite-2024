import {Box} from "@mui/material";
import OrdenesFormaPagoInfoAdTable from "../tables/OrdersFormaPagoInfoAdTable.jsx";

export default function OrdenesFormaPagoInfoAdTab({datosSeleccionados, datosSecSubdocProveedores}) {
    return (
        <Box>
            <OrdenesFormaPagoInfoAdTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdocProveedores={datosSecSubdocProveedores}
            />
        </Box>
    );
}