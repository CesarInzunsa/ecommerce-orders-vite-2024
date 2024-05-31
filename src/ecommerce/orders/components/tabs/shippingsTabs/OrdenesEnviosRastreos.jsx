import {Box} from "@mui/material";
import OrdersEnviosRastreosTable from "./tables/OrdersEnviosRastreosTable.jsx";

export default function OrdenesEnviosRastreos({datosSeleccionados, datosSecSubdoc, setDatosSecSubdocRastreos}) {
    return (
        <Box>
            <OrdersEnviosRastreosTable
                datosSeleccionados={datosSeleccionados}
                datosSecSubdoc={datosSecSubdoc}
                setDatosSecSubdocRastreos={setDatosSecSubdocRastreos}
            />
        </Box>
    );
}