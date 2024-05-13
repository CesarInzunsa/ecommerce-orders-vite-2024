import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesFormaPagoInfoAdTab from "./OrdenesFormaPagoInfoAdTab.jsx";
import OrdenesProveedoresNavTab from "./OrdenesProveedoresNavTab.jsx";
import OrdenesFormaPago from "./OrdenesFormaPago.jsx";
import OrdenesProveedoresInfoAd from "./OrdenesProveedoresInfoAd.jsx";
import OrdenesProveedoresDetallesTab from "./OrdenesProveedoresDetallesTab.jsx";

export default function OrdenesFormaPagoTab({datosSeleccionados, setDatosSeleccionados}) {

    // indicamos que al iniciar no hay ningun Instituto seleccionado.
    const [currentRowInProveedoresTab, setCurrentRowInProveedoresTab] = useState(1);

    // indicamos que el estado inicial del tab page principal por default.
    const [currentNameTabInProveedoresTab, setCurrentNameTabInProveedoresTab] = useState("PROVEEDOR");

    // indicamos que el estado inicial de los datos del subdocumento
    const [datosSecSubdocProveedores, setDatosSecSubdocProveedores] = useState({
        IdInstitutoOK: "0",
        IdNegocioOK: "0",
        IdOrdenOK: "0"
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