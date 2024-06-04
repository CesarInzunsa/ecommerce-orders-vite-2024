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
import OrdenesDetallesInfoAdModal from "../../../modals/patchModals/OrdenesDetallesInfoAdModal.jsx";
import OrdenesFacturaProductosModal from "../../../modals/patchModals/OrdenesFacturaProductosModal.jsx";
import OrdenesFacturaProductosModalUpdate from "../../../modals/updateModals/OrdenesFacturaProductosModalUpdate.jsx";
import OrdenesFacturaProductosModalDetails from "../../../modals/detailsModals/OrdenesFacturaProductosModalDetails.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";

// Modals

// Columns Table Definition.
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
        accessorKey: "Cantidad",
        header: "Cantidad",
        size: 150, //small column
    },
    {
        accessorKey: "PrecioUnitario",
        header: "PrecioUnitario",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdPersonaOK === datosSecSubdocumentoPresenta.IdPersonaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].productos
        : null;
}

// Table - FrontEnd.
const OrdersFacturaProductosTable = ({
                                         datosSeleccionados,
                                         datosSecSubdoc,
                                         setDatosSecSubdocProductos,
                                     }) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // Controlar la informacion seleccionada
    const [dataRow, setDataRow] = useState();

    // control modal add
    const [OrdenesFacturaProductosShowModal, setOrdenesFacturaProductosShowModal] = useState(false);

    // control modal update
    const [OrdenesFacturaProductosShowModalUpdate, setOrdenesFacturaProductosShowModalUpdate] = useState(false);

    // control modal details
    const [OrdenesFacturaProductosShowModalDetails, setOrdenesFacturaProductosShowModalDetails] = useState(false);

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

            const datosFiltrados = getDatosFiltrados(ordersData.factura, datosSecSubdoc);
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

        // extrar los ids
        const {IdProdServOK, IdPresentaOK} = rowData.original;

        setDatosSecSubdocProductos({IdProdServOK, IdPresentaOK});

        console.log("Datos seleccionados: ", {IdProdServOK, IdPresentaOK});
    };

    // Funcion par eliminar estatus órdenes
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El producto con el ID: ${
                (dataRow.IdProdServOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // obtener el indice de la factura
                const indexFactura = ordenExistente.factura.findIndex((value) => {
                    return value.IdPersonaOK === datosSecSubdoc.IdPersonaOK;
                });

                // obtener el indice del producto seleccionado dentro de la factura
                const indexProducto = ordenExistente.factura[indexFactura].productos.findIndex((value) => {
                    return value.IdProdServOK === dataRow.IdProdServOK;
                });


                ordenExistente.factura[indexFactura].productos.splice(indexProducto, 1);

                // Actualiza el documento con el endpoint
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Mostrar mensaje de confirmación
                await showMensajeConfirm("Estatus eliminado con exito");

                // Actualizar la data
                await fetchData();

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
                                            onClick={() => setOrdenesFacturaProductosShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesFacturaProductosShowModalUpdate(true)}
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
                                            onClick={() => setOrdenesFacturaProductosShowModalDetails(true)}
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
                <Dialog open={OrdenesFacturaProductosShowModal}>
                    <OrdenesFacturaProductosModal
                        OrdenesFacturaProductosShowModal={OrdenesFacturaProductosShowModal}
                        setOrdenesFacturaProductosShowModal={setOrdenesFacturaProductosShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdoc={datosSecSubdoc}
                        onClose={() => setOrdenesFacturaProductosShowModal(false)}
                        fetchData={fetchData}
                    />
                </Dialog>

                <Dialog open={OrdenesFacturaProductosShowModalUpdate}>
                    <OrdenesFacturaProductosModalUpdate
                        OrdenesFacturaProductosShowModalUpdate={OrdenesFacturaProductosShowModalUpdate}
                        setOrdenesFacturaProductosShowModalUpdate={setOrdenesFacturaProductosShowModalUpdate}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdoc={datosSecSubdoc}
                        onClose={() => setOrdenesFacturaProductosShowModal(false)}
                        fetchData={fetchData}
                        dataRow={dataRow}
                    />
                </Dialog>


                <Dialog open={OrdenesFacturaProductosShowModalDetails}>
                    <OrdenesFacturaProductosModalDetails
                        OrdenesFacturaProductosShowModalDetails={OrdenesFacturaProductosShowModalDetails}
                        setOrdenesFacturaProductosShowModalDetails={setOrdenesFacturaProductosShowModalDetails}
                        onClose={() => setOrdenesFacturaProductosShowModalDetails(false)}
                        dataRow={dataRow}
                    />
                </Dialog>
            </Box>
        </Box>
    );
};

export default OrdersFacturaProductosTable;