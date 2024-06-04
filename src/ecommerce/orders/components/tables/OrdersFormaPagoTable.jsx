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
import OrdenesFormaPagoModal from "../modals/patchModals/OrdenesFormaPagoModal.jsx";
import OrdenesFormaPagoUpdateModal from "../modals/updateModals/OrdenesFormaPagoUpdateModal.jsx";
import {UpdatePatchOneOrder} from "../../services/remote/put/UpdatePatchOneOrder.jsx";
import {showMensajeConfirm, showMensajeError} from "../../../../share/components/elements/messages/MySwalAlerts.jsx";
import OrdenesFormaPagoDetailsModal from "../modals/detailsModals/OrdenesFormaPagoDetailsModal.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdTipoPagoOK",
        header: "Id Tipo Pago",
        size: 30, //small column
    },
    {
        accessorKey: "MontoPagado",
        header: "Monto Pagado",
        size: 30, //small column
    },
    {
        accessorKey: "MontoRecibido",
        header: "Monto Recibido",
        size: 150, //small column
    },
    {
        accessorKey: "MontoDevuelto",
        header: "Monto Devuelto",
        size: 150, //small column
    }
];

// Table - FrontEnd.
const OrdersFormaPagoTable = ({setDatosSecSubdocProveedores, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesFormaPagoShowModal, setOrdenesFormaPagoShowModal] = useState(false);

    // Controlar el estado que muestra u oculta la modal para ver los detalles de un producto
    const [OrdenesFormaPagoUpdateShowModal, setOrdenesFormaPagoUpdateShowModal] = useState(false);

    // Controlar la informacion seleccionada
    const [dataRow, setDataRow] = useState();

    // Controlar el estado que muestra u oculta la modal para ver los detalles de un producto
    const [OrdenesFormaPagoDetailsShowModal, setOrdenesFormaPagoDetailsShowModal] = useState(false);

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Guardar la informacion seleccionada
        setDataRow(rowData.original);

        // Accede a los datos necesarios del registro (rowData) y llama a tu método
        const {IdTipoPagoOK} = rowData.original;

        // Actualizar el estado de los datos seleccionados
        setDatosSecSubdocProveedores({IdTipoPagoOK});
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
            setOrdersData(ordersData.forma_pago);

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
            `La Forma de Pago con el ID: ${
                (dataRow.IdTipoPagoOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener el indice de la fila seleccionada
                const selectedRowIndex = ordersData.findIndex((row) => row.IdTipoPagoOK === dataRow.IdTipoPagoOK);

                // Verificar si no se seleccionó ninguna fila
                if (selectedRowIndex !== -1) {
                    // Obtener los id's seleccionados del documento principal
                    let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                    // Obtener toda la información del documento que se quiere actualizar su subdocumento
                    const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                    // Actualizar la información
                    const formaPagoArray = [...ordenExistente.forma_pago];
                    formaPagoArray.splice(selectedRowIndex, 1);
                    const dataToUpdate = {
                        forma_pago: formaPagoArray,
                    };

                    // Actualizar el documento con el endpoint
                    await UpdatePatchOneOrder?.(IdInstitutoOK, IdNegocioOK, IdOrdenOK, dataToUpdate);

                    // Mostrar mensaje de confirmación
                    await showMensajeConfirm("Estatus eliminado con exito");

                    // Actualizar la data
                    await fetchData();
                }
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
                                            onClick={() => setOrdenesFormaPagoShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesFormaPagoUpdateShowModal(true)}
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
                                    <Tooltip title="Detalles">
                                        <IconButton
                                            onClick={() => setOrdenesFormaPagoDetailsShowModal(true)}
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
                <Dialog open={OrdenesFormaPagoShowModal}>
                    <OrdenesFormaPagoModal
                        OrdenesFormaPagoShowModal={OrdenesFormaPagoShowModal}
                        setOrdenesFormaPagoShowModal={setOrdenesFormaPagoShowModal}
                        datosSeleccionados={datosSeleccionados}
                        onClose={() => {
                            setOrdenesFormaPagoShowModal(false)
                        }}
                        fetchData={fetchData}
                    />
                </Dialog>
                <Dialog open={OrdenesFormaPagoUpdateShowModal}>
                    <OrdenesFormaPagoUpdateModal
                        OrdenesFormaPagoUpdateShowModal={OrdenesFormaPagoUpdateShowModal}
                        setOrdenesFormaPagoUpdateShowModal={setOrdenesFormaPagoUpdateShowModal}
                        datosSeleccionados={datosSeleccionados}
                        dataRow={dataRow}
                        onClose={() => {
                            setOrdenesFormaPagoUpdateShowModal(false)
                        }}
                        fetchData={fetchData}
                    />
                </Dialog>

                <Dialog open={OrdenesFormaPagoDetailsShowModal}>
                    <OrdenesFormaPagoDetailsModal
                        OrdenesFormaPagoDetailsShowModal={OrdenesFormaPagoDetailsShowModal}
                        setOrdenesFormaPagoDetailsShowModal={setOrdenesFormaPagoDetailsShowModal}
                        dataRow={dataRow}
                        onClose={() => {
                            setOrdenesFormaPagoDetailsShowModal(false)
                        }}
                    />
                </Dialog>
            </Box>
        </Box>
    );
};

export default OrdersFormaPagoTable;