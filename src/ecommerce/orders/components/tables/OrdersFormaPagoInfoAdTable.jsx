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
import OrdenesFormaPagoInfoAdModal from "../modals/patchModals/OrdenesFormaPagoInfoAdModal.jsx";
import OrdenesFormaPagoInfoAdUpdateModal from "../modals/updateModals/OrdenesFormaPagoInfoAdUpdateModal.jsx";
import {UpdatePatchOneOrder} from "../../services/remote/put/UpdatePatchOneOrder.jsx";
import {showMensajeConfirm, showMensajeError} from "../../../../share/components/elements/messages/MySwalAlerts.jsx";
import OrdenesFormaPagoInfoAdDetailsModal from "../modals/detailsModals/OrdenesFormaPagoInfoAdDetailsModal.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdSeccionOK",
        header: "IdSeccionOK",
        size: 150, //small column
    },
    {
        accessorKey: "Etiqueta",
        header: "Etiqueta",
        size: 30, //small column
    },
    {
        accessorKey: "Valor",
        header: "Valor",
        size: 30, //small column
    },
    {
        accessorKey: "Seccion",
        header: "Seccion",
        size: 150, //small column
    },
    {
        accessorKey: "Secuencia",
        header: "Secuencia",
        size: 150,
    }
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdTipoPagoOK === datosSecSubdocumentoPresenta.IdTipoPagoOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].info_ad
        : null;
}

// Table - FrontEnd.
const OrdersFormaPagoInfoAdTable = ({datosSecSubdocProveedores, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesFormaPagoInfoAdShowModal, setOrdenesFormaPagoInfoAdShowModal] = useState(false);

    // Controlar el estado que muestra u oculta la modal para ver los detalles de un producto
    const [OrdenesFormaPagoInfoAdUpdateShowModal, setOrdenesFormaPagoInfoAdUpdateShowModal] = useState(false);

    // Controlar el estado que muestra u oculta la modal para ver los detalles de un producto
    const [OrdenesFormaPagoInfoAdDetailsShowModal, setOrdenesFormaPagoInfoAdDetailsShowModal] = useState(false);

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

            const datosFiltrados = getDatosFiltrados(ordersData.forma_pago, datosSecSubdocProveedores);
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
            `La Forma Pago InfoAd con el ID: ${
                (dataRow.IdSeccionOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Encuentra el índice del subdocumento forma_pago que quieres actualizar
                const FormaPagoIndex = ordenExistente.forma_pago.findIndex(formaPago => {
                    // Encuentra el índice del subdocumento info_ad que debemos actualizar
                    const paqueteIndex = formaPago.info_ad.findIndex(subDoc => subDoc.IdSeccionOK === dataRow.IdSeccionOK);

                    // Si se encontró el subdocumento info_ad, devuelve true para detener la búsqueda
                    return paqueteIndex !== -1;
                });

                // Verifica si se encontró el subdocumento forma_pago
                if (FormaPagoIndex !== -1) {
                    // Encuentra el índice del subdocumento info_ad dentro del subdocumento forma_pago encontrado
                    const infoAdIndex = ordenExistente.forma_pago[FormaPagoIndex].info_ad.findIndex(infoAd => infoAd.IdSeccionOK === dataRow.IdSeccionOK);

                    // Ahora ya tenemos los índices de forma_pago e info_ad
                    console.log("FormaPagoIndex: ", FormaPagoIndex);
                    console.log("infoAdIndex: ", infoAdIndex);

                    // Elimina el subdocumento info_ad
                    ordenExistente.forma_pago[FormaPagoIndex].info_ad.splice(infoAdIndex, 1);

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
                                            onClick={() => setOrdenesFormaPagoInfoAdShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesFormaPagoInfoAdUpdateShowModal(true)}
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
                                            onClick={() => setOrdenesFormaPagoInfoAdDetailsShowModal(true)}
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
                            <Dialog open={OrdenesFormaPagoInfoAdShowModal}>
                                <OrdenesFormaPagoInfoAdModal
                                    OrdenesFormaPagoInfoAdShowModal={OrdenesFormaPagoInfoAdShowModal}
                                    setOrdenesFormaPagoInfoAdShowModal={setOrdenesFormaPagoInfoAdShowModal}
                                    datosSeleccionados={datosSeleccionados}
                                    datosSecSubdocDetalles={datosSecSubdocProveedores}
                                    onClose={() => {
                                        setOrdenesFormaPagoInfoAdShowModal(false)
                                    }}
                                    fetchData={fetchData}
                                />
                            </Dialog>
                            <Dialog open={OrdenesFormaPagoInfoAdUpdateShowModal}>
                                <OrdenesFormaPagoInfoAdUpdateModal
                                    OrdenesFormaPagoInfoAdUpdateShowModal={OrdenesFormaPagoInfoAdUpdateShowModal}
                                    setOrdenesFormaPagoInfoAdUpdateShowModal={setOrdenesFormaPagoInfoAdUpdateShowModal}
                                    datosSeleccionados={datosSeleccionados}
                                    datosSecSubdocDetalles={datosSecSubdocProveedores}
                                    dataRow={dataRow}
                                    onClose={() => {
                                        setOrdenesFormaPagoInfoAdUpdateShowModal(false)
                                    }}
                                    fetchData={fetchData}
                                />
                            </Dialog>

                            <Dialog open={OrdenesFormaPagoInfoAdDetailsShowModal}>
                                <OrdenesFormaPagoInfoAdDetailsModal
                                    OrdenesFormaPagoInfoAdDetailsShowModal={OrdenesFormaPagoInfoAdDetailsShowModal}
                                    setOrdenesFormaPagoInfoAdDetailsShowModal={setOrdenesFormaPagoInfoAdDetailsShowModal}
                                    dataRow={dataRow}
                                    onClose={() => {
                                        setOrdenesFormaPagoInfoAdDetailsShowModal(false)
                                    }}
                                />
                            </Dialog>
                        </>
                    )}
                />
                {/* M O D A L E S */}
            </Box>
        </Box>
    );
};

export default OrdersFormaPagoInfoAdTable;