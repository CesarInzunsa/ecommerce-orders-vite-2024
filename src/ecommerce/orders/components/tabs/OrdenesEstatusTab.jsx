import {Box} from "@mui/material";
import OrdersEstatusTable from "../tables/OrdersEstatusTable.jsx";

export default function OrdenesEstatusTab({datosSeleccionados, setDatosSeleccionados}) {
    return (
        <Box>
            <OrdersEstatusTable
                datosSeleccionados={datosSeleccionados}
                setDatosSeleccionados={setDatosSeleccionados}
            />
        </Box>
    );
}