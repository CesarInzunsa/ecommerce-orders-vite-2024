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
import OrdenesEnviosEstatusModal from "../../../modals/patchModals/OrdenesEnviosEstatusModal.jsx";
import OrdenesUpdateEnviosEstatusModal from "../../../modals/updateModals/OrdenesUpdateEnviosEstatusModal.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";
import OrdenesDetailsEnviosEstatusModal from "../../../modals/detailsModals/OrdenesDetailsEnviosEstatusModal.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdTipoEstatusOK",
        header: "IdTipoEstatusOK",
        size: 30, //small column
    },
    {
        accessorKey: "Actual",
        header: "Actual",
        size: 30, //small column
    },
    {
        accessorKey: "Observacion",
        header: "Observacion",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdDomicilioOK === datosSecSubdocumentoPresenta.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdocumentoPresenta.IdPaqueteriaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].estatus
        : null;
}

// Table - FrontEnd.
const OrdersEnviosEstatusTable = ({datosSeleccionados, datosSecSubdoc}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesEnviosEstatusShowModal, setOrdenesEnviosEstatusShowModal] = useState(false);

    // controllar el estado que muestra u oculta el modal para actualizar el subdocumento.
    const [OrdenesUpdateEnviosEstatusShowModal, setOrdenesUpdateEnviosEstatusShowModal] = useState(false);

    // controlar el estado que muestra u oculta el modal para ver los detalles del subdocumento.
    const [OrdenesDetailsEnviosEstatusShowModal, setOrdenesDetailsEnviosEstatusShowModal] = useState(false);

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

    // Funcion par eliminar estatus órdenes
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El estatus con el ID: ${
                (dataRow.IdTipoEstatusOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Determinar el indice del subdocumento seleccionado
                const index = ordenExistente.envios.findIndex((elemento) => (
                    elemento.IdDomicilioOK === datosSecSubdoc.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdoc.IdPaqueteriaOK
                ));


                // Verifica si se encontró el subdocumento detalle_ps
                if (index !== -1) {
                    // Encuentra el índice del subdocumento estatus dentro del subdocumento detalle_ps encontrado
                    const estatusIndex = ordenExistente.envios[index].estatus.findIndex(datosSecSubdoc => datosSecSubdoc.IdTipoEstatusOK === dataRow.IdTipoEstatusOK);

                    // Ahora ya tenemos los índices de detalle_ps e estatus
                    console.log("detallePsIndex: ", index);
                    console.log("estatusIndex: ", estatusIndex);

                    // Elimina el subdocumento estatus
                    ordenExistente.envios[index].estatus.splice(estatusIndex, 1);

                    // Actualiza el documento con el endpoint
                    await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

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
                                            onClick={() => setOrdenesEnviosEstatusShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesUpdateEnviosEstatusShowModal(true)}
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
                                            onClick={() => setOrdenesDetailsEnviosEstatusShowModal(true)}
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
                <Dialog open={OrdenesEnviosEstatusShowModal}>
                    <OrdenesEnviosEstatusModal
                        OrdenesEnviosEstatusShowModal={OrdenesEnviosEstatusShowModal}
                        setOrdenesEnviosEstatusShowModal={setOrdenesEnviosEstatusShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocEnvios={datosSecSubdoc}
                        onClose={() => {
                            setOrdenesEnviosEstatusShowModal(false)
                        }}
                        fetchData={fetchData}
                    />
                </Dialog>
                <Dialog open={OrdenesUpdateEnviosEstatusShowModal}>
                    <OrdenesUpdateEnviosEstatusModal
                        OrdenesUpdateEnviosEstatusShowModal={OrdenesUpdateEnviosEstatusShowModal}
                        setOrdenesUpdateEnviosEstatusShowModal={setOrdenesUpdateEnviosEstatusShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocEnvios={datosSecSubdoc}
                        dataRow={dataRow}
                        onClose={() => setOrdenesUpdateEnviosEstatusShowModal(false)}
                        fetchData={fetchData}
                    />
                </Dialog>
                <Dialog open={OrdenesDetailsEnviosEstatusShowModal}>
                    <OrdenesDetailsEnviosEstatusModal
                        OrdenesDetailsEnviosEstatusShowModal={OrdenesDetailsEnviosEstatusShowModal}
                        setOrdenesDetailsEnviosEstatusShowModal={setOrdenesDetailsEnviosEstatusShowModal}
                        dataRow={dataRow}
                        onClose={() => setOrdenesDetailsEnviosEstatusShowModal(false)}
                    />
                </Dialog>
            </Box>
        </Box>
    );
};

export default OrdersEnviosEstatusTable;