import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesProveedoresEstatus from "./OrdenesProveedoresEstatus.jsx";
import OrdenesProveedoresNavTab from "./OrdenesProveedoresNavTab.jsx";
import OrdenesProveedores from "./OrdenesProveedores.jsx";
import OrdenesProveedoresInfoAd from "./OrdenesProveedoresInfoAd.jsx";
import OrdenesProveedoresDetallesNavTab from "./OrdenesProveedoresDetallesNavTab.jsx";
import OrdenesProveedoresDetallesTab from "./OrdenesProveedoresDetallesTab.jsx";

export default function OrdenesProveedoresTab({datosSeleccionados, setDatosSeleccionados}) {

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

            {currentNameTabInProveedoresTab == "PROVEEDOR" &&
                <OrdenesProveedores
                    setDatosSecSubdocProveedores={setDatosSecSubdocProveedores}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "ESTATUS" &&
                <OrdenesProveedoresEstatus
                    datosSecSubdocProveedores={datosSecSubdocProveedores}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "INFO AD" &&
                <OrdenesProveedoresInfoAd
                    datosSecSubdocProveedores={datosSecSubdocProveedores}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "DETALLES" &&
                <OrdenesProveedoresDetallesTab
                    datosSecSubdocDetalles={datosSecSubdocProveedores}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "FORMA PAGO" &&
                <OrdenesProveedoresEstatus
                    datosSecSubdocDetalles={datosSecSubdocProveedores}
                    datosSeleccionados={datosSeleccionados}
                />
            }

        </Box>
    );
}