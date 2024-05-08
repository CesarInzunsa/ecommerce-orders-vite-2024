import {Box} from "@mui/material";
import {useState} from "react";
import OrdersNavTab from "../components/tabs/OrdersNavTab.jsx";
import OrdenesEstatusTab from "../components/tabs/OrdenesEstatusTab.jsx";
import OrdenesTab from "../components/tabs/OrdenesTab.jsx";
import OrdenesInfo from "../components/tabs/OrdenesInfo.jsx";
import OrdenesDetallesTab from "../components/tabs/OrdenesDetallesTab.jsx";
import OrdenesProveedoresTab from "../components/tabs/OrdenesProveedoresTab.jsx";

export default function Orders() {

    // Indicamos que al iniciar no hay ninguna tab seleccionada
    const [currentRowInOrdersTab, setCurrentRowInOrdersTab] = useState(0);

    // Indicamos que el estado inicial del tab page principal por default sera ORDENES
    const [currentNameTabInPrincipalTab, setCurrentNameTabInPrincipalTab] = useState("ORDENES");

    // useState para guardar los ids seleccionados y compartirlos entre tabs.
    const [datosSeleccionados, setDatosSeleccionados] = useState({
        IdInstitutoOK: "0",
        IdNegocioOK: "0",
        IdOrdenOK: "0"
    });

    return (
        <Box>
            <OrdersNavTab
                setCurrentRowInOrdersTab={setCurrentRowInOrdersTab}
                setCurrentNameTabInPrincipalTab={setCurrentNameTabInPrincipalTab}
            />

            {currentNameTabInPrincipalTab == "ORDENES" &&
                <OrdenesTab
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }
            {currentNameTabInPrincipalTab == "ESTATUS" &&
                <OrdenesEstatusTab
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }
            {currentNameTabInPrincipalTab == "INFO" &&
                <OrdenesInfo
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }
            {currentNameTabInPrincipalTab == "DETALLES" &&
                <OrdenesDetallesTab
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }
            {currentNameTabInPrincipalTab == "PROVEEDOR" &&
                <OrdenesProveedoresTab
                    datosSeleccionados={datosSeleccionados}
                    setDatosSeleccionados={setDatosSeleccionados}
                />
            }
        </Box>
    );
}