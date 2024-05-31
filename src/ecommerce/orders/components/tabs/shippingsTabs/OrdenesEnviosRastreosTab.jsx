import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesFacturas from "./OrdenesFacturas.jsx";
import OrdenesFacturaNavTab from "./OrdenesFacturaNavTab.jsx";
import OrdenesFacturasDomicilio from "./OrdenesFacturasDomicilio.jsx";
import OrdenesFacturasProductos from "./OrdenesFacturasProductos.jsx";
import OrdenesFacturaProductosNavTab from "./OrdenesFacturaProductosNavTab.jsx";
import OrdenesFacturasProductosDescuentos from "./OrdenesFacturasProductosDescuentos.jsx";
import OrdenesEnviosRastreosNavTab from "./OrdenesEnviosRastreosNavTab.jsx";
import OrdenesEnviosRastreos from "./OrdenesEnviosRastreos.jsx";
import OrdenesEnviosRastreosSeguimiento from "./OrdenesEnviosRastreosSeguimiento.jsx";

export default function OrdenesEnviosRastreosTab({datosSeleccionados, datosSecSubdoc}) {

    // indicamos que al iniciar no hay ningun Instituto seleccionado.
    const [currentRowInProveedoresTab, setCurrentRowInProveedoresTab] = useState(1);

    // indicamos que el estado inicial del tab page principal por default.
    const [currentNameTabInProveedoresTab, setCurrentNameTabInProveedoresTab] = useState("RASTREOS");

    // indicamos que el estado inicial de los datos del subdocumento
    const [datosSecSubdocRastreos, setDatosSecSubdocRastreos] = useState({
        NumeroGuia: "0",
        IdRepartidorOK: "0",
    });

    return (
        <Box>
            <OrdenesEnviosRastreosNavTab
                currentRowInProveedoresTab={currentRowInProveedoresTab}
                setCurrentNameTabInProveedoresTab={setCurrentNameTabInProveedoresTab}
            />

            {currentNameTabInProveedoresTab == "RASTREOS" &&
                <OrdenesEnviosRastreos
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdoc={datosSecSubdoc}
                    setDatosSecSubdocRastreos={setDatosSecSubdocRastreos}
                />
            }

            {currentNameTabInProveedoresTab == "SEGUIMIENTO" &&
                <OrdenesEnviosRastreosSeguimiento
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdoc={datosSecSubdoc}
                    datosSecSubdocRastreos={datosSecSubdocRastreos}
                />
            }

        </Box>
    );
}