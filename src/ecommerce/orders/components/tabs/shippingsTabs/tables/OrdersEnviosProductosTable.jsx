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

// Modals
import OrdenesEnviosProductosModal from "../../../modals/patchModals/OrdenesEnviosProductosModal.jsx";
import OrdenesUpdateEnviosProductosModal from "../../../modals/updateModals/OrdenesUpdateEnviosProductosModal.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";
import OrdenesDetailsEnviosProductosModal from "../../../modals/detailsModals/OrdenesDetailsEnviosProductosModal.jsx";

const columns = [
    {
        accessorKey: "IdProdServOK",
        header: "IdProdServOK",
        size: 30, //small column
    },
    {
        accessorKey: "IdPresentaOK",
        header: "IdPresentaOK",
        size: 30, //small column
    },
    {
        accessorKey: "DesProdServ",
        header: "DesProdServ",
        size: 150, //small column
    },
    {
        accessorKey: "DesPresenta",
        header: "DesPresenta",
        size: 150, //small column
    },
    {
        accessorKey: "CantidadPed",
        header: "CantidadPed",
        size: 150, //small column
    },
    {
        accessorKey: "CantidadEnt",
        header: "CantidadEnt",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdDomicilioOK === datosSecSubdocumentoPresenta.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdocumentoPresenta.IdPaqueteriaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].productos
        : null;
}

// Table - FrontEnd.
const OrdersEnviosProductosTable = ({datosSeleccionados, datosSecSubdoc}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesEnviosProductosShowModal, setOrdenesEnviosProductosShowModal] = useState(false);

    const [OrdenesUpdateEnviosProductosShowModal, setOrdenesUpdateEnviosProductosShowModal] = useState(false);

    const [OrdenesDetailsEnviosProductosShowModal, setOrdenesDetailsEnviosProductosShowModal] = useState(false);

    // Controlar la informacion seleccionada
    const [dataRow, setDataRow] = useState();

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

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Guardar la informacion seleccionada
        setDataRow(rowData.original);
    };

    //Eliminar
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El producto con el ID: ${
                (dataRow.IdProdServOK)
            } será eliminado, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Determinar el indice del subdocumento seleccionado
                const index = ordenExistente.envios.findIndex((elemento) => (
                    elemento.IdProdServOK === datosSecSubdoc.IdProdServOK && elemento.IdPresentaOK === datosSecSubdoc.IdPresentaOK
                ));


                // Verifica si se encontró el subdocumento detalle_ps
                if (index !== -1) {
                    // Encuentra el índice del subdocumento estatus dentro del subdocumento detalle_ps encontrado
                    const estatusIndex = ordenExistente.envios[index].productos.findIndex(datosSecSubdoc => datosSecSubdoc.IdProdServOK === dataRow.IdProdServOK);

                    // Ahora ya tenemos los índices de detalle_ps e estatus
                    console.log("detallePsIndex: ", index);
                    console.log("estatusIndex: ", estatusIndex);

                    // Elimina el subdocumento estatus
                    ordenExistente.envios[index].productos.splice(estatusIndex, 1);

                    // Actualiza el documento con el endpoint
                    await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                    // Mostrar mensaje de confirmación
                    await showMensajeConfirm("Producto eliminado con exito");

                    // Actualizar la data
                    await fetchData();
                }
            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar el producto`);
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
                                            onClick={() => setOrdenesEnviosProductosShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesUpdateEnviosProductosShowModal(true)}
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
                                            onClick={() => setOrdenesDetailsEnviosProductosShowModal(true)}
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
                <Dialog open={OrdenesEnviosProductosShowModal}>
                    <OrdenesEnviosProductosModal
                        OrdenesEnviosProductosShowModal={OrdenesEnviosProductosShowModal}
                        setOrdenesEnviosProductosShowModal={setOrdenesEnviosProductosShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocEnvios={datosSecSubdoc}
                        onClose={() => {
                            setOrdenesEnviosProductosShowModal(false)
                        }}
                        fetchData={fetchData}
                    />
                </Dialog>

                <Dialog open={OrdenesUpdateEnviosProductosShowModal}>
                    <OrdenesUpdateEnviosProductosModal
                        OrdenesUpdateEnviosProductosShowModal={OrdenesUpdateEnviosProductosShowModal}
                        setOrdenesUpdateEnviosProductosShowModal={setOrdenesUpdateEnviosProductosShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocEnvios={datosSecSubdoc}
                        dataRow={dataRow}
                        onClose={() => {
                            setOrdenesUpdateEnviosProductosShowModal(false)
                        }}
                        fetchData={fetchData}
                    />
                </Dialog>

                <Dialog open={OrdenesDetailsEnviosProductosShowModal}>
                    <OrdenesDetailsEnviosProductosModal
                        OrdenesDetailsEnviosProductosShowModal={OrdenesDetailsEnviosProductosShowModal}
                        setOrdenesDetailsEnviosProductosShowModal={setOrdenesDetailsEnviosProductosShowModal}
                        dataRow={dataRow}
                        onClose={() => {
                            setOrdenesDetailsEnviosProductosShowModal(false)
                        }}
                    />
                </Dialog>

                {/*<Dialog open={OrdenesDetallesEstatusShowModal}>*/}
                {/*</Dialog>*/}
                {/*<Dialog open={OrdenesUpdateDetallesEstatusShowModal}>*/}
                {/*</Dialog>*/}
            </Box>
        </Box>
    );
};

export default OrdersEnviosProductosTable;