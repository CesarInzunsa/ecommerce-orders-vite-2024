import {Box} from "@mui/material";
import OrdenesClienteTable from "./tables/OrdenesClienteTable.jsx";

export default function OrdenesClientes({datosSeleccionados}) {
    return (
        <Box>
            <OrdenesClienteTable
                datosSeleccionados={datosSeleccionados}
            />
        </Box>
    );
}