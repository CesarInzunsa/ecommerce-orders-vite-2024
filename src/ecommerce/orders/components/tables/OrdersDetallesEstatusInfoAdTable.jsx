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

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdEtiquetaOK",
        header: "Id Etiqueta OK",
        size: 30, //small column
    },
    {
        accessorKey: "IdEtiqueta",
        header: "Id Etiqueta",
        size: 30, //small column
    },
    {
        accessorKey: "Etiqueta",
        header: "Etiqueta",
        size: 150, //small column
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
        ? resultadoFiltrado[0].pedidos_detalle_ps_info_ad
        : null;
}

// Table - FrontEnd.
const OrdersDetallesEstatusInfoAdTable = ({datosSecSubdocDetalles, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [addOrdersShowModal, setAddOrdersShowModal] = useState(false);

    // Controlar el estado que muestra u oculta la modal para ver los detalles de un producto
    const [AddOrdersDetailsShowModal, setAddOrdersDetailsShowModal] = useState(false);

    // // Función para manejar el clic en una fila
    // const sendDataRow = (rowData) => {
    //     // Accede a los datos necesarios del registro (rowData) y llama a tu método
    //     const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = rowData.original;
    //     // Actualizar el estado de los datos seleccionados
    //     setDatosSeleccionados({IdInstitutoOK, IdNegocioOK, IdOrdenOK});
    // };

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

            const datosFiltrados = getDatosFiltrados(ordersData.ordenes_detalle, datosSecSubdocDetalles);
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

    return (
        <Box>
            <Box>
                <MaterialReactTable
                    columns={columns}
                    initialState={{density: "compact", showGlobalFilter: true}}
                    data={ordersData}
                    state={{isLoading: loadingTable}}
                    // enableMultiRowSelection={false}
                    // enableRowSelection={true}
                    // muiTableBodyRowProps={({row}) => ({
                    //     onClick: row.getToggleSelectedHandler(),
                    //     onClickCapture: () => sendDataRow(row),
                    //     sx: {cursor: 'pointer'},
                    // })}
                    renderTopToolbarCustomActions={() => (
                        <>
                            {/* ------- BARRA DE ACCIONES ------ */}
                            <Stack direction="row" sx={{m: 1}}>
                                <Box>
                                    <Tooltip title="Agregar">
                                        <IconButton>
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton>
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton>
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
            </Box>
        </Box>
    );
};

export default OrdersDetallesEstatusInfoAdTable;