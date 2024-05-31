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

        // extrar los ids
        const {IdProdServOK, IdPresentaOK} = dataRow;

        setDatosSecSubdocProductos({IdProdServOK, IdPresentaOK});
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
                                            //onClick={() => setOrdenesDetallesEstatusShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            //onClick={() => setOrdenesUpdateDetallesEstatusShowModal(true)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            //onClick={() => handleDelete()}
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
                {/*<Dialog open={OrdenesDetallesEstatusShowModal}>*/}
                {/*</Dialog>*/}
                {/*<Dialog open={OrdenesUpdateDetallesEstatusShowModal}>*/}
                {/*</Dialog>*/}
            </Box>
        </Box>
    );
};

export default OrdersFacturaProductosDescuentosTable;