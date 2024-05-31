import {Box} from "@mui/material";
import OrdenesVendedorTable from "./tables/OrdenesVendedorTable.jsx";

export default function OrdenesVendedor({datosSeleccionados}) {
    return (
        <Box>
            <OrdenesVendedorTable
                datosSeleccionados={datosSeleccionados}
            />
        </Box>
    );
}