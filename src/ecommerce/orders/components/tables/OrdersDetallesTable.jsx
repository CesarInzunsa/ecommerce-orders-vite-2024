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
import OrdenesDetallesModal from "../modals/patchModals/OrdenesDetallesModal.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdProdServOK",
        header: "Id Producto/Servicio OK",
        size: 30,
    },
    {
        accessorKey: "IdPresentaOK",
        header: "Id Presentación OK",
        size: 30,
    },
    {
        accessorKey: "DesPresentaPS",
        header: "Descripción Presentación",
        size: 150,
    },
    {
        accessorKey: "Cantidad",
        header: "Cantidad",
        size: 150,
    },
    {
        accessorKey: "PrecioUniSinIVA",
        header: "Precio Unidad Sin IVA",
        size: 150,
    },
    {
        accessorKey: "PrecioUniConIVA",
        header: "Precio Unidad Con IVA",
        size: 150,
    },
    {
        accessorKey: "PorcentajeIVA",
        header: "Porcentaje IVA",
        size: 150,
    },
    {
        accessorKey: "MontoUniIVA",
        header: "Monto Unidad IVA",
        size: 150,
    },
    {
        accessorKey: "SubTotalSinIVA",
        header: "SubTotal Sin IVA",
        size: 150,
    },
    {
        accessorKey: "SubTotalConIVA",
        header: "Subtotal Con IVA",
        size: 50,
    },
];

// Table - FrontEnd.
const OrdersDetallesTable = ({setDatosSecSubdocDetalles, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesDetallesShowModal, setOrdenesDetallesShowModal] = useState(false);

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Accede a los datos necesarios del registro (rowData) y llama a tu método
        const {IdProdServOK, IdPresentaOK} = rowData.original;
        // Actualizar el estado de los datos seleccionados
        setDatosSecSubdocDetalles({IdProdServOK, IdPresentaOK});
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
            setOrdersData(ordersData.detalle_ps);

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
                                            onClick={() => setOrdenesDetallesShowModal(true)}
                                        >
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
                <Dialog open={OrdenesDetallesShowModal}>
                    <OrdenesDetallesModal
                        OrdenesDetallesShowModal={OrdenesDetallesShowModal}
                        setOrdenesDetallesShowModal={setOrdenesDetallesShowModal}
                        datosSeleccionados={datosSeleccionados}
                        onClose={() => {
                            setOrdenesDetallesShowModal(false)
                        }}
                    />
                </Dialog>
            </Box>
        </Box>
    );
};

export default OrdersDetallesTable;