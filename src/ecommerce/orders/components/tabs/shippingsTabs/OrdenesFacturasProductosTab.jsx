import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesFacturas from "./OrdenesFacturas.jsx";
import OrdenesFacturaNavTab from "./OrdenesFacturaNavTab.jsx";
import OrdenesFacturasDomicilio from "./OrdenesFacturasDomicilio.jsx";
import OrdenesFacturasProductos from "./OrdenesFacturasProductos.jsx";
import OrdenesFacturaProductosNavTab from "./OrdenesFacturaProductosNavTab.jsx";
import OrdenesFacturasProductosDescuentos from "./OrdenesFacturasProductosDescuentos.jsx";

export default function OrdenesFacturasProductosTab({datosSeleccionados, datosSecSubdoc}) {

    // indicamos que al iniciar no hay ningun Instituto seleccionado.
    const [currentRowInProveedoresTab, setCurrentRowInProveedoresTab] = useState(1);

    // indicamos que el estado inicial del tab page principal por default.
    const [currentNameTabInProveedoresTab, setCurrentNameTabInProveedoresTab] = useState("PRODUCTOS");

    // indicamos que el estado inicial de los datos del subdocumento
    const [datosSecSubdocProductos, setDatosSecSubdocProductos] = useState({
        IdProdServOK: "0",
        IdPresentaOK: "0",
    });

    return (
        <Box>
            <OrdenesFacturaProductosNavTab
                currentRowInProveedoresTab={currentRowInProveedoresTab}
                setCurrentNameTabInProveedoresTab={setCurrentNameTabInProveedoresTab}
            />

            {currentNameTabInProveedoresTab == "PRODUCTOS" &&
                <OrdenesFacturasProductos
                    datosSeleccionados={datosSeleccionados}
                    setDatosSecSubdoc={datosSecSubdoc}
                    setDatosSecSubdocProductos={setDatosSecSubdocProductos}
                />
            }

            {currentNameTabInProveedoresTab == "DESCUENTOS" &&
                <OrdenesFacturasProductosDescuentos
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdoc={datosSecSubdoc}
                    datosSecSubdocProductos={datosSecSubdocProductos}
                />
            }

        </Box>
    );
}