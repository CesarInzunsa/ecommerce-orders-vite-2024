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
import OrdenesEnviosModal from "../../../modals/patchModals/OrdenesEnviosModal.jsx";
import OrdenesEnviosModalUpdate from "../../../modals/updateModals/OrdenesEnviosModalUpdate.jsx";
import OrdenesEnviosModalDetails from "../../../modals/detailsModals/OrdenesEnviosModalDetails.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";

// Modals

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdDomicilioOK",
        header: "IdDomicilioOK",
        size: 30, //small column
    },
    {
        accessorKey: "IdPaqueteriaOK",
        header: "IdPaqueteriaOK",
        size: 30, //small column
    },
    {
        accessorKey: "IdTipoMetodoEnvio",
        header: "IdTipoMetodoEnvio",
        size: 150, //small column
    },
    {
        accessorKey: "CostoEnvio",
        header: "CostoEnvio",
        size: 150, //small column
    },
];

// Table - FrontEnd.
const OrdenesEnviosTable = ({datosSeleccionados, setDatosSecSubdoc}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // Controlar el estado de la fila seleccionada.
    const [dataRow, setDataRow] = useState({});

    // control modal OrdenesEnvios
    const [OrdenesEnviosShowModal, setOrdenesEnviosShowModal] = useState(false);

    // control modal ordenes envios update
    const [OrdenesEnviosShowModalUpdate, setOrdenesEnviosShowModalUpdate] = useState(false);

    // control modal ordenes details
    const [OrdenesEnviosShowModalDetails, setOrdenesEnviosShowModalDetails] = useState(false);

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Guardar la informacion seleccionada
        setDataRow(rowData.original);

        const {IdDomicilioOK, IdPaqueteriaOK} = rowData.original;

        setDatosSecSubdoc({IdDomicilioOK, IdPaqueteriaOK});

        //Jesus
        localStorage.setItem("envioSeleccionado", JSON.stringify(rowData.original));
    };

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
            setOrdersData(ordersData.envios);
            // Cambiar el estado del indicador (loading) a false.
            setLoadingTable(false);
        } catch (error) {
            console.error("Error al obtener la data en useEffect: ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Funcion par eliminar envios ordenes
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El envio con el ID: ${
                (dataRow.IdDomicilioOK)
            } será eliminado, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // buscar el indice del envio seleccionado

                const indexEnvio = ordenExistente.envios.findIndex((envio) => {
                    return envio.IdDomicilioOK === dataRow.IdDomicilioOK;
                });

                ordenExistente.envios.splice(indexEnvio, 1);

                // Actualiza el documento con el endpoint
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Mostrar mensaje de confirmación
                await showMensajeConfirm("Envio eliminado con exito");

                // Actualizar la data
                await fetchData();

            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar el envio`);
            }
        }
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
                                            onClick={() => setOrdenesEnviosShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesEnviosShowModalUpdate(true)}
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
                                            onClick={() => setOrdenesEnviosShowModalDetails(true)}
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
                            {/* M O D A L E S */}
                            <Dialog open={OrdenesEnviosShowModal}>
                                <OrdenesEnviosModal
                                    OrdenesEnviosShowModal={OrdenesEnviosShowModal}
                                    setOrdenesEnviosShowModal={setOrdenesEnviosShowModal}
                                    datosSeleccionados={datosSeleccionados}
                                    onClose={() => setOrdenesEnviosShowModal(false)}
                                    fetchData={fetchData}
                                />
                            </Dialog>

                            <Dialog open={OrdenesEnviosShowModalUpdate}>
                                <OrdenesEnviosModalUpdate
                                    OrdenesEnviosShowModalUpdate={OrdenesEnviosShowModalUpdate}
                                    setOrdenesEnviosShowModalUpdate={setOrdenesEnviosShowModalUpdate}
                                    datosSeleccionados={datosSeleccionados}
                                    onClose={() => setOrdenesEnviosShowModalUpdate(false)}
                                    fetchData={fetchData}
                                    dataRow={dataRow}
                                />
                            </Dialog>

                            <Dialog open={OrdenesEnviosShowModalDetails}>
                                <OrdenesEnviosModalDetails
                                    OrdenesEnviosShowModalDetails={OrdenesEnviosShowModalDetails}
                                    setOrdenesEnviosShowModalDetails={setOrdenesEnviosShowModalDetails}
                                    onClose={() => setOrdenesEnviosShowModalDetails(false)}
                                    dataRow={dataRow}
                                />
                            </Dialog>
                        </>
                    )}
                />
            </Box>
        </Box>
    );
};

export default OrdenesEnviosTable;