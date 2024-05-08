import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesProveedoresDetallesNavTab from "./OrdenesProveedoresDetallesNavTab.jsx";
import OrdenesProveedoresDetalles from "./OrdenesProveedoresDetalles.jsx";

export default function OrdenesProveedoresDetallesTab({datosSeleccionados, datosSecSubdocDetalles}) {

    // indicamos que al iniciar no hay ningun Instituto seleccionado.
    const [currentRowInProveedoresDetallesTab, setCurrentRowInProveedoresTab] = useState(1);

    // indicamos que el estado inicial del tab page principal por default.
    const [currentNameTabInProveedoresTab, setCurrentNameTabInProveedoresDetallesTab] = useState("DETALLES");

    // indicamos que el estado inicial de los datos del subdocumento
    const [datosSecSubdocProveedoresDetalles, setDatosSecSubdocProveedoresDetallles] = useState({
        IdProdServOK: "0",
        IdPresentaOK: "0"
    });

    return (
        <Box>
            <OrdenesProveedoresDetallesNavTab
                currentRowInProveedoresDetallesTab={currentRowInProveedoresDetallesTab}
                setCurrentNameTabInProveedoresDetallesTab={setCurrentNameTabInProveedoresDetallesTab}
            />

            {currentNameTabInProveedoresTab == "DETALLES" &&
                <OrdenesProveedoresDetalles
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    datosSecSubdocProveedoresDetalles={setDatosSecSubdocProveedoresDetallles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "ESTATUS-F" &&
                <OrdenesProveedoresDetalles
                    datosSecSubdocProveedoresDetalles={datosSecSubdocProveedoresDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "ESTATUS-V" &&
                <OrdenesProveedoresDetalles
                    datosSecSubdocProveedoresDetalles={datosSecSubdocProveedoresDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "ESTATUS-U" &&
                <OrdenesProveedoresDetalles
                    datosSecSubdocProveedoresDetalles={datosSecSubdocProveedoresDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "ESTATUS-P" &&
                <OrdenesProveedoresDetalles
                    datosSecSubdocProveedoresDetalles={datosSecSubdocProveedoresDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "INFO AD" &&
                <OrdenesProveedoresDetalles
                    datosSecSubdocProveedoresDetalles={datosSecSubdocProveedoresDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInProveedoresTab == "PAQ" &&
                <OrdenesProveedoresDetalles
                    datosSecSubdocProveedoresDetalles={datosSecSubdocProveedoresDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

        </Box>
    );
}