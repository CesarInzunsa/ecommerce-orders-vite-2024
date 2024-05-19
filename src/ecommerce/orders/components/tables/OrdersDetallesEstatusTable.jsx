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
import OrdenesDetallesEstatusModal from "../modals/patchModals/OrdenesDetallesEstatusModal.jsx";
import OrdenesUpdateDetallesEstatusModal from "../modals/updateModals/OrdenesUpdateDetallesEstatusModal.jsx";
import {UpdatePatchOneOrder} from "../../services/remote/put/UpdatePatchOneOrder.jsx";
import {showMensajeConfirm, showMensajeError} from "../../../../share/components/elements/messages/MySwalAlerts.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdTipoEstatusOK",
        header: "Id Tipo Estatus OK",
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
        elemento.IdProdServOK === datosSecSubdocumentoPresenta.IdProdServOK && elemento.IdPresentaOK === datosSecSubdocumentoPresenta.IdPresentaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].estatus
        : null;
}

// Table - FrontEnd.
const OrdersDetallesEstatusTable = ({datosSecSubdocDetalles, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesDetallesEstatusShowModal, setOrdenesDetallesEstatusShowModal] = useState(false);

    // controllar el estado que muestra u oculta el modal para actualizar el subdocumento.
    const [OrdenesUpdateDetallesEstatusShowModal, setOrdenesUpdateDetallesEstatusShowModal] = useState(false);

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
                // Obtener el indice de la fila seleccionada
                const selectedRowIndex = ordersData.findIndex((row) => row.IdTipoEstatusOK === dataRow.IdTipoEstatusOK);

                // Verificar si no se seleccionó ninguna fila
                if (selectedRowIndex !== -1) {
                    // Obtener los id's seleccionados del documento principal
                    let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                    // Obtener toda la información del documento que se quiere actualizar su subdocumento
                    const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                    // Actualizar la información
                    const estatusArray = [...ordenExistente.detalle_ps[selectedRowIndex].estatus];
                    estatusArray.splice(selectedRowIndex, 1);
                    ordenExistente.detalle_ps[selectedRowIndex].estatus = estatusArray;

                    // Prepara los datos para actualizar el documento
                    const dataToUpdate = {
                        detalle_ps: ordenExistente.detalle_ps,
                    };

                    // Actualizar el documento con el endpoint
                    await UpdatePatchOneOrder?.(IdInstitutoOK, IdNegocioOK, IdOrdenOK, dataToUpdate);

                    // Mostrar mensaje de confirmación
                    await showMensajeConfirm("Estatus eliminado con exito");

                    // Actualizar la data
                    await fetchData();
                } else {
                    showMensajeError(`No se pudo eliminar el estatus`);
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
                                            onClick={() => setOrdenesDetallesEstatusShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesUpdateDetallesEstatusShowModal(true)}
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
                        </>
                    )}
                />
                {/* M O D A L E S */}
                <OrdenesDetallesEstatusModal
                    OrdenesDetallesEstatusShowModal={OrdenesDetallesEstatusShowModal}
                    setOrdenesDetallesEstatusShowModal={setOrdenesDetallesEstatusShowModal}
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    onClose={() => setOrdenesDetallesEstatusShowModal(false)}
                />
                <OrdenesUpdateDetallesEstatusModal
                    OrdenesUpdateDetallesEstatusShowModal={OrdenesUpdateDetallesEstatusShowModal}
                    setOrdenesUpdateDetallesEstatusShowModal={setOrdenesUpdateDetallesEstatusShowModal}
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    dataRow={dataRow}
                    onClose={() => setOrdenesUpdateDetallesEstatusShowModal(false)}
                />
            </Box>
        </Box>
    );
};

export default OrdersDetallesEstatusTable;