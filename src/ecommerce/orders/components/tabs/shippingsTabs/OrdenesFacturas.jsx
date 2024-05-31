import {Box} from "@mui/material";
import OrdenesFacturaTable from "./tables/OrdenesFacturaTable.jsx";

export default function OrdenesFacturas({datosSeleccionados, setDatosSecSubdoc}) {
    return (
        <Box>
            <OrdenesFacturaTable
                datosSeleccionados={datosSeleccionados}
                setDatosSecSubdoc={setDatosSecSubdoc}
            />
        </Box>
    );
}