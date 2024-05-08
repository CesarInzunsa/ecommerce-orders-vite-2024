import {Box} from "@mui/material";
import OrdersInfoTable from "../tables/OrdersInfoTable.jsx";

export default function OrdenesInfo({datosSeleccionados, setDatosSeleccionados}) {
    return (
        <Box>
            <OrdersInfoTable
                datosSeleccionados={datosSeleccionados}
                setDatosSeleccionados={setDatosSeleccionados}
            />
        </Box>
    );
}