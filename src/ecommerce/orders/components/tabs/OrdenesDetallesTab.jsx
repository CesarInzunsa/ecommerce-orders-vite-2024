import {Box} from "@mui/material";
import {useState} from "react";
//
import OrdenesDetallesNavTab from "./OrdenesDetallesNavTab.jsx";
import OrdenesDetallesEstatus from "./OrdenesDetallesEstatus.jsx";
import OrdenesDetallesInfoAd from "./OrdenesDetallesInfoAd.jsx";
import OrdenesDetallesPaquete from "./OrdenesDetallesPaquete.jsx";
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

            {currentNameTabInBusinessTab == "ESTATUS" &&
                <OrdenesDetallesEstatus
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInBusinessTab == "INFO AD" &&
                <OrdenesDetallesInfoAd
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

            {currentNameTabInBusinessTab == "PAQUETE" &&
                <OrdenesDetallesPaquete
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    datosSeleccionados={datosSeleccionados}
                />
            }

        </Box>
    );
}