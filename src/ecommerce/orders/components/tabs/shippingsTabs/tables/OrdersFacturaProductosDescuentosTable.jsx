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
import OrdenesDetailsDetallesEstatusModal from "../../../modals/detailsModals/OrdenesDetailsDetallesEstatusModal.jsx";
import OrdenesFacturaProductosDescuentosModal
    from "../../../modals/patchModals/OrdenesFacturaProductosDescuentosModal.jsx";
import OrdenesFacturaProductosDescuentosModalUpdate
    from "../../../modals/updateModals/OrdenesFacturaProductosDescuentosModalUpdate.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
import OrdenesFacturaProductosDescuentosModalDetails
    from "../../../modals/detailsModals/OrdenesFacturaProductosDescuentosModalDetails.jsx";

// Modals

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdTipoDescuentoOK",
        header: "IdTipoDescuentoOK",
        size: 30, //small column
    },
    {
        accessorKey: "CodigoDescuento",
        header: "CodigoDescuento",
        size: 30, //small column
    },
    {
        accessorKey: "Monto",
        header: "Monto",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta, datosSecSubdocProductos) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdPersonaOK === datosSecSubdocumentoPresenta.IdPersonaOK
    ));

    // Obtener los productos filtrados
    const resultadoFiltradoProductos = resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].productos
        : null;

    // Ahora filtrar los productos para encontrar el subdocumento de descuentos
    const resultadoFiltradoDescuentos = resultadoFiltradoProductos.filter(elemento => (
        elemento.IdProdServOK === datosSecSubdocProductos.IdProdServOK && elemento.IdPresentaOK === datosSecSubdocProductos.IdPresentaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltradoDescuentos.length > 0 ? resultadoFiltradoDescuentos[0].descuentos : null;
}

// Table - FrontEnd.
const OrdersFacturaProductosDescuentosTable = ({datosSeleccionados, datosSecSubdoc, datosSecSubdocProductos}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // Controlar la informacion seleccionada
    const [dataRow, setDataRow] = useState();

    // Controlar la visibilidad del modal
    const [OrdenesDetallesEstatusModalShowModal, setOrdenesDetallesEstatusModalShowModal] = useState(false);
    // controlar la visibildiad del modal update
    const [OrdenesDetallesEstatusModalShowModalUpdate, setOrdenesDetallesEstatusModalShowModalUpdate] = useState(false);
    // controlar la visibilidad del modal details
    const [OrdenesDetallesEstatusModalShowModalDetails, setOrdenesDetallesEstatusModalShowModalDetails] = useState(false);
    console.log("datosSeleccionados: ", datosSeleccionados);
    console.log("datosSecSubdoc: ", datosSecSubdoc);
    console.log("datosSecSubdocProductos: ", datosSecSubdocProductos);

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

            const datosFiltrados = getDatosFiltrados(ordersData.factura, datosSecSubdoc, datosSecSubdocProductos);
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
            `El descuento del producto con el ID: ${
                (dataRow.IdTipoDescuentoOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Desestructurar datos del documento seleccionado
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener la orden existente
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Determinar el indice del subdocumento seleccionado
                const indexFactura = ordenExistente.factura.findIndex((elemento) => (
                    elemento.IdPersonaOK === datosSecSubdoc.IdPersonaOK
                ));

                // Determinar el indice del subdocumento seleccionado
                const indexProductos = ordenExistente.factura[indexFactura].productos.findIndex((elemento) => (
                    elemento.IdProdServOK === datosSecSubdocProductos.IdProdServOK
                ));

                // Determinarl el indce del subdocumento de descuentos
                const indexDescuentos = ordenExistente.factura[indexFactura].productos[indexProductos].descuentos.findIndex((elemento) => {
                    return elemento.IdTipoDescuentoOK === dataRow.IdTipoDescuentoOK;
                });

                // Elimina el subdocumento de descuentos
                ordenExistente.factura[indexFactura].productos[indexProductos].descuentos.splice(indexDescuentos, 1);

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Declarar estado de exito.
                await showMensajeConfirm("Factura eliminada con exito");

                await fetchData();
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
                                            onClick={() => setOrdenesDetallesEstatusModalShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesDetallesEstatusModalShowModalUpdate(true)}
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
                                            onClick={() => setOrdenesDetallesEstatusModalShowModalDetails(true)}
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
                <Dialog open={OrdenesDetallesEstatusModalShowModal}>
                    <OrdenesFacturaProductosDescuentosModal
                        OrdenesDetallesEstatusModalShowModal={OrdenesDetallesEstatusModalShowModal}
                        setOrdenesDetallesEstatusModalShowModal={setOrdenesDetallesEstatusModalShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdoc={datosSecSubdoc}
                        datosSecSubdocProductos={datosSecSubdocProductos}
                        fetchData={fetchData}
                        onClose={() => setOrdenesDetallesEstatusModalShowModal(false)}
                    />
                </Dialog>

                <Dialog open={OrdenesDetallesEstatusModalShowModalUpdate}>
                    <OrdenesFacturaProductosDescuentosModalUpdate
                        OrdenesDetallesEstatusModalShowModalUpdate={OrdenesDetallesEstatusModalShowModalUpdate}
                        setOrdenesDetallesEstatusModalShowModalUpdate={setOrdenesDetallesEstatusModalShowModalUpdate}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdoc={datosSecSubdoc}
                        datosSecSubdocProductos={datosSecSubdocProductos}
                        fetchData={fetchData}
                        onClose={() => setOrdenesDetallesEstatusModalShowModalUpdate(false)}
                        dataRow={dataRow}
                    />
                </Dialog>

                <Dialog open={OrdenesDetallesEstatusModalShowModalDetails}>
                    <OrdenesFacturaProductosDescuentosModalDetails
                        OrdenesDetallesEstatusModalShowModalDetails={OrdenesDetallesEstatusModalShowModalDetails}
                        setOrdenesDetallesEstatusModalShowModalDetails={setOrdenesDetallesEstatusModalShowModalDetails}
                        onClose={() => setOrdenesDetallesEstatusModalShowModalDetails(false)}
                        dataRow={dataRow}
                    />
                </Dialog>
            </Box>
        </Box>
    );
};

export default OrdersFacturaProductosDescuentosTable;