import {Box} from "@mui/material";
import OrdersTable from "../tables/OrdersTable.jsx";

export default function OrdenesTab({datosSeleccionados, setDatosSeleccionados}) {
    return (
        <Box>
            <OrdersTable
                datosSeleccionados={datosSeleccionados}
                setDatosSeleccionados={setDatosSeleccionados}
            />
        </Box>
    );
}