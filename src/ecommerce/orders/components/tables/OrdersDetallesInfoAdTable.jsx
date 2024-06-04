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
import OrdenesDetallesInfoAdModal from "../modals/patchModals/OrdenesDetallesInfoAdModal.jsx";
import OrdenesUpdateDetallesInfoAdModal from "../modals/updateModals/OrdenesUpdateDetallesInfoAdModal.jsx";
import {UpdatePatchOneOrder} from "../../services/remote/put/UpdatePatchOneOrder.jsx";
import {showMensajeConfirm, showMensajeError} from "../../../../share/components/elements/messages/MySwalAlerts.jsx";
import OrdenesDetailsDetallesInfoAdModal from "../modals/detailsModals/OrdenesDetailsDetallesInfoAdModal.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdEtiquetaOK",
        header: "Id Tipo Etiqueta OK",
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
        accessorKey: "Seccion",
        header: "Seccion",
        size: 150, //small column
    },
    {
        accessorKey: "Secuencia",
        header: "Secuencia",
        size: 150, //small column
    },

];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdProdServOK === datosSecSubdocumentoPresenta.IdProdServOK && elemento.IdPresentaOK === datosSecSubdocumentoPresenta.IdPresentaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].info_ad
        : null;
}

// Table - FrontEnd.
const OrdersDetallesInfoAdTable = ({datosSecSubdocDetalles, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesDetallesInfoAdShowModal, setOrdenesDetallesInfoAdShowModal] = useState(false);

    // controlar el estado del modal para actualizar
    const [OrdenesDetallesInfoAdShowModalUpdate, setOrdenesDetallesInfoAdShowModalUpdate] = useState(false);

    // controlar el estado del modal para ver detalles
    const [OrdenesDetallesInfoAdShowModalDetails, setOrdenesDetallesInfoAdShowModalDetails] = useState(false);

    // Controlar la informacion seleccionada
    const [dataRow, setDataRow] = useState();

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

    // Funcion par eliminar estatus órdenes
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `La Informacion Adicional con el ID: ${
                (dataRow.IdEtiquetaOK)
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
                    // Encuentra el índice del subdocumento info_ad que debemos actualizar
                    const infoAdIndex = detalle.info_ad.findIndex(infoAd => infoAd.IdEtiquetaOK === dataRow.IdEtiquetaOK && infoAd.IdTipoSeccionOK === dataRow.IdTipoSeccionOK);

                    // Si se encontró el subdocumento info_ad, devuelve true para detener la búsqueda
                    return infoAdIndex !== -1;
                });

                // Verifica si se encontró el subdocumento detalle_ps
                if (detallePsIndex !== -1) {
                    // Encuentra el índice del subdocumento info_ad dentro del subdocumento detalle_ps encontrado
                    const infoAdIndex = ordenExistente.detalle_ps[detallePsIndex].info_ad.findIndex(infoAd => infoAd.IdEtiquetaOK === dataRow.IdEtiquetaOK && infoAd.IdTipoSeccionOK === dataRow.IdTipoSeccionOK);

                    // Ahora ya tenemos los índices de detalle_ps e info_ad
                    console.log("detallePsIndex: ", detallePsIndex);
                    console.log("infoAdIndex: ", infoAdIndex);

                    // Elimina el subdocumento info_ad
                    ordenExistente.detalle_ps[detallePsIndex].info_ad.splice(infoAdIndex, 1);

                    // Actualiza el documento con el endpoint
                    await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                    // Mostrar mensaje de confirmación
                    await showMensajeConfirm("InfoAd eliminada con exito");

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
                                            onClick={() => setOrdenesDetallesInfoAdShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesDetallesInfoAdShowModalUpdate(true)}
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
                                            onClick={() => setOrdenesDetallesInfoAdShowModalDetails(true)}
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
                <Dialog open={OrdenesDetallesInfoAdShowModal}>
                    <OrdenesDetallesInfoAdModal
                        OrdenesDetallesInfoAdShowModal={OrdenesDetallesInfoAdShowModal}
                        setOrdenesDetallesInfoAdShowModal={setOrdenesDetallesInfoAdShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocDetalles={datosSecSubdocDetalles}
                        onClose={() => setOrdenesDetallesInfoAdShowModal(false)}
                        fetchData={fetchData}
                    />
                </Dialog>
                <Dialog open={OrdenesDetallesInfoAdShowModalUpdate}>
                    <OrdenesUpdateDetallesInfoAdModal
                        OrdenesDetallesInfoAdShowModalUpdate={OrdenesDetallesInfoAdShowModalUpdate}
                        setOrdenesDetallesInfoAdShowModalUpdate={setOrdenesDetallesInfoAdShowModalUpdate}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocDetalles={datosSecSubdocDetalles}
                        dataRow={dataRow}
                        onClose={() => setOrdenesDetallesInfoAdShowModalUpdate(false)}
                        fetchData={fetchData}
                    />
                </Dialog>
                <Dialog open={OrdenesDetallesInfoAdShowModalDetails}>
                    <OrdenesDetailsDetallesInfoAdModal
                        OrdenesDetallesInfoAdShowModalDetails={OrdenesDetallesInfoAdShowModalDetails}
                        setOrdenesDetallesInfoAdShowModalDetails={setOrdenesDetallesInfoAdShowModalDetails}
                        dataRow={dataRow}
                        onClose={() => setOrdenesDetallesInfoAdShowModalDetails(false)}
                    />
                </Dialog>
            </Box>
        </Box>
    );
};

export default OrdersDetallesInfoAdTable;