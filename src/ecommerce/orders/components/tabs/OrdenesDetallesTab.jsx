import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesDetallesNavTab from "./OrdenesDetallesNavTab.jsx";
import OrdenesDetallesEstatusF from "./OrdenesDetallesEstatusF.jsx";
import OrdenesDetallesEstatusV from "./OrdenesDetallesEstatusV.jsx";
import OrdenesDetallesEstatusU from "./OrdenesDetallesEstatusU.jsx";
import OrdenesDetallesInfo from "./OrdenesDetallesInfo.jsx";
import OrdenesDetallesPAQ from "./OrdenesDetallesPAQ.jsx";
import OrdenesDetalles from "./OrdenesDetalles.jsx";

export default function OrdenesDetallesTab({datosSeleccionados, setDatosSeleccionados}) {

    // indicamos que al iniciar no hay ningun Instituto seleccionado.
    const [currentRowInBusinessTab, setCurrentRowInBusinessTab] = useState(1);

    // indicamos que el estado inicial del tab page principal por default.
    const [currentNameTabInBusinessTab, setCurrentNameTabInBusinessTab] = useState("DETALLES");

    // indicamos que el estado inicial de los datos del subdocumento
    const [datosSecSubdocDetalles, setDatosSecSubdocDetalles] = useState({
        IdInstitutoOK: "0",
        IdNegocioOK: "0",
        IdOrdenOK: "0"
    });

    return (
        <Box>
            <OrdenesDetallesNavTab
                currentRowInBusinessTab={currentRowInBusinessTab}
                setCurrentNameTabInBusinessTab={setCurrentNameTabInBusinessTab}
            />

            {currentNameTabInBusinessTab == "DETALLES" &&
                <OrdenesDetalles
                    setDatosSecSubdocDetalles={setDatosSecSubdocDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInBusinessTab == "ESTATUS-F" &&
                <OrdenesDetallesEstatusF
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInBusinessTab == "ESTATUS-V" &&
                <OrdenesDetallesEstatusV
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInBusinessTab == "ESTATUS-U" &&
                <OrdenesDetallesEstatusU
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInBusinessTab == "INFO" &&
                <OrdenesDetallesInfo
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInBusinessTab == "PAQ" &&
                <OrdenesDetallesPAQ
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

        </Box>
    );
}