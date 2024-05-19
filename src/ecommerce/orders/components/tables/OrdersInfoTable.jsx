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
import {GetOneOrder} from '../../services/remote/get/GetOneOrder.jsx';

// Modals
import OrdenesInfoAdModal from '../modals/patchModals/OrdenesInfoAdModal.jsx';
import OrdenesUpdateInfoAdModal from "../modals/updateModals/OrdenesUpdateInfoAdModal.jsx";
import {UpdatePatchOneOrder} from "../../services/remote/put/UpdatePatchOneOrder.jsx";
import {showMensajeConfirm, showMensajeError} from "../../../../share/components/elements/messages/MySwalAlerts.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdEtiquetaOK",
        header: "ID Etiqueta OK",
        size: 30, //small column
    },
    {
        accessorKey: "IdEtiqueta",
        header: "Id Etiqueta",
        size: 30, //small column
    },
    {
        accessorKey: "Valor",
        header: "Valor",
        size: 150, //small column
    },
    {
        accessorKey: "IdTipoSeccionOK",
        header: "Id Tipo Seccion OK",
        size: 150, //small column
    },
    {
        accessorKey: "Secuencia",
        header: "Secuencia",
        size: 150, //small column
    },
];

// Table - FrontEnd.
const OrdersInfoTable = ({setDatosSeleccionados, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesInfoAdShowModal, setOrdenesInfoAdShowModal] = useState(false);

    // Controlar el estado que muestra u oculta la modal para ver actualizar el subdocumento.
    const [OrdenesUpdateInfoAdShowModal, setOrdenesUpdateInfoAdShowModal] = useState(false);

    // Controlar el estado de la fila seleccionada.
    const [dataRow, setDataRow] = useState({});

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Guardar la informacion seleccionada
        setDataRow(rowData.original);
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
            setOrdersData(ordersData.info_ad);

            // Cambiar el estado del indicador (loading) a false.
            setLoadingTable(false);
        } catch (error) {
            console.error("Error al obtener la data en useEffect: ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Funcion par eliminar subdocumento
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `La Info Adicional con el ID: ${
                (dataRow.IdEtiquetaOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener el indice de la fila seleccionada
                const selectedRowIndex = ordersData.findIndex((row) => row.IdEtiquetaOK === dataRow.IdEtiquetaOK);

                // Verificar si no se seleccionó ninguna fila
                if (selectedRowIndex === -1) {
                    return;
                }

                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Actualizar la información
                const infoAdArray = [...ordenExistente.info_ad];
                infoAdArray.splice(selectedRowIndex, 1);
                const dataToUpdate = {
                    info_ad: infoAdArray,
                };

                // Actualizar el documento con el endpoint
                await UpdatePatchOneOrder?.(IdInstitutoOK, IdNegocioOK, IdOrdenOK, dataToUpdate);

                // Mostrar mensaje de confirmación
                await showMensajeConfirm("Estatus eliminado con exito");

                // Actualizar la data
                await fetchData();
            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar el estatus`);
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
                                            onClick={() => setOrdenesInfoAdShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesUpdateInfoAdShowModal(true)}
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
                                        <IconButton>
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
                            <Dialog open={OrdenesInfoAdShowModal}>
                                <OrdenesInfoAdModal
                                    OrdenesInfoAdShowModal={OrdenesInfoAdShowModal}
                                    setOrdenesInfoAdShowModal={setOrdenesInfoAdShowModal}
                                    datosSeleccionados={datosSeleccionados}
                                    onClose={() => setOrdenesInfoAdShowModal(false)}
                                />
                            </Dialog>
                            <Dialog open={OrdenesUpdateInfoAdShowModal}>
                                <OrdenesUpdateInfoAdModal
                                    OrdenesUpdateInfoAdShowModal={OrdenesUpdateInfoAdShowModal}
                                    setOrdenesUpdateInfoAdShowModal={setOrdenesUpdateInfoAdShowModal}
                                    datosSeleccionados={datosSeleccionados}
                                    dataRow={dataRow}
                                    onClose={() => setOrdenesUpdateInfoAdShowModal(false)}
                                />
                            </Dialog>
                        </>
                    )}
                />
            </Box>
        </Box>
    );
};

export default OrdersInfoTable;