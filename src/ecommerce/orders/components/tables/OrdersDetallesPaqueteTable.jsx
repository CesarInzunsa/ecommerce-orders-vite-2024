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
import OrdenesDetallesPaqueteUpdateModal from "../modals/updateModals/OrdenesDetallesPaqueteUpdateModal.jsx";
import OrdenesDetallesPaqueteModal from "../modals/patchModals/OrdenesDetallesPaqueteModal.jsx";
import {showMensajeConfirm, showMensajeError} from "../../../../share/components/elements/messages/MySwalAlerts.jsx";
import {UpdatePatchOneOrder} from "../../services/remote/put/UpdatePatchOneOrder.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "idPresentaOK",
        header: "Id Presenta OK",
        size: 30, //small column
    },
    {
        accessorKey: "DesPresenta",
        header: "Descripcion Presenta",
        size: 30, //small column
    },
    {
        accessorKey: "Cantidad",
        header: "Cantidad",
        size: 150, //small column
    },
    {
        accessorKey: "Precio",
        header: "Precio",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdProdServOK === datosSecSubdocumentoPresenta.IdProdServOK && elemento.IdPresentaOK === datosSecSubdocumentoPresenta.IdPresentaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].paquete
        : null;
}

// Table - FrontEnd.
const OrdersDetallesPaqueteTable = ({datosSecSubdocDetalles, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesDetallesPaqueteShowModal, setOrdenesDetallesPaqueteShowModal] = useState(false);

    // Controlar la informacion seleccionada
    const [dataRow, setDataRow] = useState();

    // controlar el estado que muestra u oculta el modal para actualizar el subdocumento.
    const [OrdenesDetallesPaqueteUpdateShowModal, setOrdenesDetallesPaqueteUpdateShowModal] = useState(false);

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

            const datosFiltrados = getDatosFiltrados(ordersData.detalle_ps, datosSecSubdocDetalles);
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

    // Función par eliminar detalle-paquete de órdenes
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El paquete con el ID: ${
                (dataRow.idPresentaOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Encuentra el índice del subdocumento detalle_ps que quieres actualizar
                const detallePsIndex = ordenExistente.detalle_ps.findIndex(detalle => {
                    // Encuentra el índice del subdocumento paquete que debemos actualizar
                    const paqueteIndex = detalle.paquete.findIndex(subDoc => subDoc.idPresentaOK === dataRow.idPresentaOK);

                    // Si se encontró el subdocumento paquete, devuelve true para detener la búsqueda
                    return paqueteIndex !== -1;
                });

                // Verifica si se encontró el subdocumento detalle_ps
                if (detallePsIndex !== -1) {
                    // Encuentra el índice del subdocumento paquete dentro del subdocumento detalle_ps encontrado
                    const paqueteIndex = ordenExistente.detalle_ps[detallePsIndex].paquete.findIndex(infoAd => infoAd.idPresentaOK === dataRow.idPresentaOK);

                    // Ahora ya tenemos los índices de detalle_ps e paquete
                    console.log("detallePsIndex: ", detallePsIndex);
                    console.log("paqueteIndex: ", paqueteIndex);

                    // Elimina el subdocumento paquete
                    ordenExistente.detalle_ps[detallePsIndex].paquete.splice(paqueteIndex, 1);

                    // Actualiza el documento con el endpoint
                    await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                    // Mostrar mensaje de confirmación
                    await showMensajeConfirm("Paquete eliminado con exito");

                    // Actualizar la data
                    await fetchData();
                }
            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar la InfoAd`);
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
                                            onClick={() => setOrdenesDetallesPaqueteShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesDetallesPaqueteUpdateShowModal(true)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            onClick={handleDelete}
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
                        </>
                    )}
                />
                {/* M O D A L E S */}
                <Dialog open={OrdenesDetallesPaqueteShowModal}>
                    <OrdenesDetallesPaqueteModal
                        OrdenesDetallesPaqueteShowModal={OrdenesDetallesPaqueteShowModal}
                        setOrdenesDetallesPaqueteShowModal={setOrdenesDetallesPaqueteShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocDetalles={datosSecSubdocDetalles}
                        onClose={() => setOrdenesDetallesPaqueteShowModal(false)}
                    />
                </Dialog>
                <Dialog open={OrdenesDetallesPaqueteUpdateShowModal}>
                    <OrdenesDetallesPaqueteUpdateModal
                        OrdenesDetallesPaqueteUpdateShowModal={OrdenesDetallesPaqueteUpdateShowModal}
                        setOrdenesDetallesPaqueteUpdateShowModal={setOrdenesDetallesPaqueteUpdateShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocDetalles={datosSecSubdocDetalles}
                        dataRow={dataRow}
                        onClose={() => setOrdenesDetallesPaqueteUpdateShowModal(false)}
                    />
                </Dialog>
            </Box>
        </Box>
    );
};

export default OrdersDetallesPaqueteTable;