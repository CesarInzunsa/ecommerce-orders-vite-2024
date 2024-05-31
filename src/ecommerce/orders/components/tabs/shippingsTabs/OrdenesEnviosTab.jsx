import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesFacturas from "./OrdenesFacturas.jsx";
import OrdenesFacturaNavTab from "./OrdenesFacturaNavTab.jsx";
import OrdenesFacturasDomicilio from "./OrdenesFacturasDomicilio.jsx";
import OrdenesFacturasProductosTab from "./OrdenesFacturasProductosTab.jsx";
import OrdenesEnviosNavTab from "./OrdenesEnviosNavTab.jsx";
import OrdenesEnvios from "./OrdenesEnvios.jsx";
import OrdenesEnviosInfoAd from "./OrdenesEnviosInfoAd.jsx";
import OrdenesEnviosProductos from "./OrdenesEnviosProductos.jsx";
import OrdenesEnviosEstatus from "./OrdenesEnviosEstatus.jsx";
import OrdenesEnviosRastreosTab from "./OrdenesEnviosRastreosTab.jsx";

export default function OrdenesEnviosTab({datosSeleccionados}) {

    // indicamos que al iniciar no hay ningun Instituto seleccionado.
    const [currentRowInProveedoresTab, setCurrentRowInProveedoresTab] = useState(1);

    // indicamos que el estado inicial del tab page principal por default.
    const [currentNameTabInProveedoresTab, setCurrentNameTabInProveedoresTab] = useState("ENVIOS");

    // indicamos que el estado inicial de los datos del subdocumento
    const [datosSecSubdoc, setDatosSecSubdoc] = useState({
        IdDomicilioOK: "0",
        IdPaqueteriaOK: "0",
    });

    return (
        <Box>
            <OrdenesEnviosNavTab
                currentRowInProveedoresTab={currentRowInProveedoresTab}
                setCurrentNameTabInProveedoresTab={setCurrentNameTabInProveedoresTab}
            />

            {currentNameTabInProveedoresTab == "ENVIOS" &&
                <OrdenesEnvios
                    datosSeleccionados={datosSeleccionados}
                    setDatosSecSubdoc={setDatosSecSubdoc}
                />
            }

            {currentNameTabInProveedoresTab == "INFO_AD" &&
                <OrdenesEnviosInfoAd
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdoc={datosSecSubdoc}
                />
            }

            {currentNameTabInProveedoresTab == "PRODUCTOS" &&
                <OrdenesEnviosProductos
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdoc={datosSecSubdoc}
                />
            }

            {currentNameTabInProveedoresTab == "ESTATUS" &&
                <OrdenesEnviosEstatus
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdoc={datosSecSubdoc}
                />
            }

            {currentNameTabInProveedoresTab == "RASTREOS" &&
                <OrdenesEnviosRastreosTab
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdoc={datosSecSubdoc}
                />
            }

        </Box>
    );
}