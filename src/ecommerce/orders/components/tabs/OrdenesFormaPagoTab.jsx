import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesFormaPagoInfoAdTab from "./OrdenesFormaPagoInfoAdTab.jsx";
import OrdenesProveedoresNavTab from "./OrdenesProveedoresNavTab.jsx";
import OrdenesFormaPago from "./OrdenesFormaPago.jsx";

export default function OrdenesFormaPagoTab({datosSeleccionados, setDatosSeleccionados}) {

    // indicamos que al iniciar no hay ningun Instituto seleccionado.
    const [currentRowInProveedoresTab, setCurrentRowInProveedoresTab] = useState(1);

    // indicamos que el estado inicial del tab page principal por default.
    const [currentNameTabInProveedoresTab, setCurrentNameTabInProveedoresTab] = useState("FORMA PAGO");

    // indicamos que el estado inicial de los datos del subdocumento
    const [datosSecSubdocProveedores, setDatosSecSubdocProveedores] = useState({
        IdTipoPagoOk: "0"
    });

    return (
        <Box>
            <OrdenesProveedoresNavTab
                currentRowInProveedoresTab={currentRowInProveedoresTab}
                setCurrentNameTabInProveedoresTab={setCurrentNameTabInProveedoresTab}
            />

            {currentNameTabInProveedoresTab == "FORMA PAGO" &&
                <OrdenesFormaPago
                    setDatosSecSubdocProveedores={setDatosSecSubdocProveedores}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "INFO AD" &&
                <OrdenesFormaPagoInfoAdTab
                    datosSecSubdocProveedores={datosSecSubdocProveedores}
                    datosSeleccionados={datosSeleccionados}
                />
            }

        </Box>
    );
}