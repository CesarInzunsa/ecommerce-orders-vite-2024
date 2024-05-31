import {Box} from "@mui/material";
import OrdenesEnviosTable from "./tables/OrdenesEnviosTable.jsx";

export default function OrdenesEnvios({datosSeleccionados, setDatosSecSubdoc}) {
    return (
        <Box>
            <OrdenesEnviosTable
                datosSeleccionados={datosSeleccionados}
                setDatosSecSubdoc={setDatosSecSubdoc}
            />
        </Box>
    );
}