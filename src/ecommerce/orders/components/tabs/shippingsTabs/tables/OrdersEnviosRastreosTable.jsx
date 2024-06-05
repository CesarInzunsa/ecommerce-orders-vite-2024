import {useEffect, useState} from "react";

//Material UI
import {MaterialReactTable} from 'material-react-table';
import {Box, Stack, Tooltip, IconButton, Dialog} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

// DB
import {GetOneOrder} from '../../../../services/remote/get/GetOneOrder.jsx';
import OrdenesEnviosEstatusModal from "../../../modals/patchModals/OrdenesEnviosEstatusModal.jsx";
import OrdenesEnviosRastreosRastreosModal from "../../../modals/patchModals/OrdenesEnviosRastreosRastreosModal.jsx";
import OrdenesEnviosRastreosRastreosModalUpdate
    from "../../../modals/updateModals/OrdenesEnviosRastreosRastreosModalUpdate.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";
import OrdenesEnviosRastreosRastreosModalDetails
    from "../../../modals/detailsModals/OrdenesEnviosRastreosRastreosModalDetails.jsx";

// Modals

// Columns Table Definition.
const columns = [
    {
        accessorKey: "NumeroGuia",
        header: "NumeroGuia",
        size: 30, //small column
    },
    {
        accessorKey: "IdRepartidorOK",
        header: "IdRepartidorOK",
        size: 30, //small column
    },
    {
        accessorKey: "NombreRepartidor",
        header: "NombreRepartidor",
        size: 150, //small column
    },
    {
        accessorKey: "Alias",
        header: "Alias",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdDomicilioOK === datosSecSubdocumentoPresenta.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdocumentoPresenta.IdPaqueteriaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].rastreos
        : null;
}

// Table - FrontEnd.
const OrdersEnviosRastreosTable = ({datosSeleccionados, datosSecSubdoc, setDatosSecSubdocRastreos}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // Controlar la informacion seleccionada
    const [dataRow, setDataRow] = useState();

    // controlar modal update rastreo
    const [OrdenesEnviosRastreosRastreosShowModalUpdate, setOrdenesEnviosRastreosRastreosShowModalUpdate] = useState(false);

    // controlar modal add rastreo
    const [OrdenesEnviosRastreosRastreosShowModal, setOrdenesEnviosRastreosRastreosShowModal] = useState(false);

    // controlar modal details
    const [OrdenesEnviosRastreosRastreosShowModalDetails, setOrdenesEnviosRastreosRastreosShowModalDetails] = useState(false);

    async function fetchData() {
        try {
            // Obtener los id's seleccionados
            const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

            // Verificar si fueron seleccionados los id's; de lo contrario, no hacer nada.
            if (IdInstitutoOK === "0" || IdNegocioOK === "0" || IdOrdenOK === "0") {
                setLoadingTable(false);
                return;
            }

            // Obtener los datos
            const ordersData = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

            const datosFiltrados = getDatosFiltrados(ordersData.envios, datosSecSubdoc);
            setOrdersData(datosFiltrados);

            // Cambiar el estado del indicador (loading) a false.
            setLoadingTable(false);
        } catch (error) {
            console.error("Error al obtener la data en useEffect: ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Funcion par eliminar estatus órdenes
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El rastreo de la factura con el ID: ${
                (dataRow.NumeroGuia)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // buscar indice de envios
                const indexEnvios = ordenExistente.envios.findIndex((elemento) => {
                    return elemento.IdDomicilioOK === datosSecSubdoc.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdoc.IdPaqueteriaOK
                });

                // Buscar el indice de rastreo
                const indexRastreo = ordenExistente.envios[indexEnvios].rastreos.findIndex((elemento) => {
                    return elemento.NumeroGuia === dataRow.NumeroGuia && elemento.IdRepartidorOK === dataRow.IdRepartidorOK
                });

                // Eliminar el rastreo
                ordenExistente.envios[indexEnvios].rastreos.splice(indexRastreo, 1);

                // Actualiza el documento con el endpoint
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Mostrar mensaje de confirmación
                await showMensajeConfirm("Rastreo eliminado con exito");

                // Actualizar la data
                await fetchData();

            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar el rastreo`);
            }
        }
    };

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Guardar la informacion seleccionada
        setDataRow(rowData.original);

        const {NumeroGuia, IdRepartidorOK} = rowData.original;

        setDatosSecSubdocRastreos({NumeroGuia, IdRepartidorOK});

        console.log()
    };

    return (
        <Box>
            <Box>
                <MaterialReactTable
                    columns={columns}
                    initialState={{density: "compact", showGlobalFilter: true}}
                    data={ordersData}
                    state={{isLoading: loadingTable}}
                    enableMultiRowSelection={false}
                    enableRowSelection={true}
                    muiTableBodyRowProps={({row}) => ({
                        onClick: row.getToggleSelectedHandler(),
                        onClickCapture: () => sendDataRow(row),
                        sx: {cursor: 'pointer'},
                    })}
                    renderTopToolbarCustomActions={() => (
                        <>
                            {/* ------- BARRA DE ACCIONES ------ */}
                            <Stack direction="row" sx={{m: 1}}>
                                <Box>
                                    <Tooltip title="Agregar">
                                        <IconButton
                                            onClick={() => setOrdenesEnviosRastreosRastreosShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesEnviosRastreosRastreosShowModalUpdate(true)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            onClick={() => handleDelete()}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Detalles ">
                                        <IconButton
                                            onClick={() => setOrdenesEnviosRastreosRastreosShowModalDetails(true)}
                                        >
                                            <InfoIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Refrescar">
                                        <IconButton
                                            onClick={fetchData}>
                                            <RefreshIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Stack>
                            {/* ------- BARRA DE ACCIONES FIN ------ */}
                        </>
                    )}
                />
                {/* M O D A L E S */}
                <Dialog open={OrdenesEnviosRastreosRastreosShowModal}>
                    <OrdenesEnviosRastreosRastreosModal
                        OrdenesEnviosRastreosRastreosShowModal={OrdenesEnviosRastreosRastreosShowModal}
                        setOrdenesEnviosRastreosRastreosShowModal={setOrdenesEnviosRastreosRastreosShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdoc={datosSecSubdoc}
                        onClose={() => {
                            setOrdenesEnviosRastreosRastreosShowModal(false)
                        }}
                        fetchData={fetchData}
                    />
                </Dialog>
                <Dialog open={OrdenesEnviosRastreosRastreosShowModalUpdate}>
                    <OrdenesEnviosRastreosRastreosModalUpdate
                        OrdenesEnviosRastreosRastreosShowModalUpdate={OrdenesEnviosRastreosRastreosShowModalUpdate}
                        setOrdenesEnviosRastreosRastreosShowModalUpdate={setOrdenesEnviosRastreosRastreosShowModalUpdate}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdoc={datosSecSubdoc}
                        onClose={() => {
                            setOrdenesEnviosRastreosRastreosShowModalUpdate(false)
                        }}
                        fetchData={fetchData}
                        dataRow={dataRow}
                    />
                </Dialog>

                <Dialog open={OrdenesEnviosRastreosRastreosShowModalDetails}>
                    <OrdenesEnviosRastreosRastreosModalDetails
                        OrdenesEnviosRastreosRastreosShowModalDetails={OrdenesEnviosRastreosRastreosShowModalDetails}
                        setOrdenesEnviosRastreosRastreosShowModalDetails={setOrdenesEnviosRastreosRastreosShowModalDetails}
                        onClose={() => {
                            setOrdenesEnviosRastreosRastreosShowModalDetails(false)
                        }}
                        dataRow={dataRow}
                    />
                </Dialog>
            </Box>
        </Box>
    );
};

export default OrdersEnviosRastreosTable;