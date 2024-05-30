import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesFacturas from "./OrdenesFacturas.jsx";
import OrdenesFacturaNavTab from "./OrdenesFacturaNavTab.jsx";
import OrdenesFacturasDomicilio from "./OrdenesFacturasDomicilio.jsx";
import OrdenesFacturasProductosTab from "./OrdenesFacturasProductosTab.jsx";

export default function OrdenesFacturaTab({datosSeleccionados}) {

    // indicamos que al iniciar no hay ningun Instituto seleccionado.
    const [currentRowInProveedoresTab, setCurrentRowInProveedoresTab] = useState(1);

    // indicamos que el estado inicial del tab page principal por default.
    const [currentNameTabInProveedoresTab, setCurrentNameTabInProveedoresTab] = useState("FACTURA");

    // indicamos que el estado inicial de los datos del subdocumento
    const [datosSecSubdoc, setDatosSecSubdoc] = useState({
        IdPersonaOK: "0"
    });

    return (
        <Box>
            <OrdenesFacturaNavTab
                currentRowInProveedoresTab={currentRowInProveedoresTab}
                setCurrentNameTabInProveedoresTab={setCurrentNameTabInProveedoresTab}
            />

            {currentNameTabInProveedoresTab == "FACTURA" &&
                <OrdenesFacturas
                    datosSeleccionados={datosSeleccionados}
                    setDatosSecSubdoc={setDatosSecSubdoc}
                />
            }

            {currentNameTabInProveedoresTab == "DOMICILIO" &&
                <OrdenesFacturasDomicilio
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdoc={datosSecSubdoc}
                />
            }

            {currentNameTabInProveedoresTab == "PRODUCTOS" &&
                <OrdenesFacturasProductosTab
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdoc={datosSecSubdoc}
                />
            }

        </Box>
    );
}