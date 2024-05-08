import {Box} from "@mui/material";
import OrdersDetallesTable from "../tables/OrdersDetallesTable.jsx";

export default function OrdenesDetalles({datosSeleccionados, setDatosSecSubdocDetalles}) {
    return (
        <Box>
            <OrdersDetallesTable
                datosSeleccionados={datosSeleccionados}
                setDatosSecSubdocDetalles={setDatosSecSubdocDetalles}
            />
        </Box>
    );
}