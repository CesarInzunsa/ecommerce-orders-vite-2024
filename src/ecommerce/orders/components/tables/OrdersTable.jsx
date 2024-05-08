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
import {getAllOrders} from '../../services/remote/get/GetAllOrders.jsx';

// Modals

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdInstitutoOK",
        header: "ID OK",
        size: 30, //small column
    },
    {
        accessorKey: "IdNegocioOK",
        header: "ID BK",
        size: 30, //small column
    },
    {
        accessorKey: "IdOrdenOK",
        header: "ID Orden OK",
        size: 150, //small column
    },
    {
        accessorKey: "IdOrdenBK",
        header: "ID Orden BK",
        size: 50, //small column
    },
    {
        accessorKey: "IdTipoOrdenOK",
        header: "ID Tipo Orden OK",
        size: 150, //small column
    },
    {
        accessorKey: "IdRolOK",
        header: "ID ROL OK",
        size: 50, //small column
    },
    {
        accessorKey: "IdPersonaOK",
        header: "ID Persona OK ",
        size: 50, //small column
    },
];

// Table - FrontEnd.
const OrdersTable = ({setDatosSeleccionados, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [addOrdersShowModal, setAddOrdersShowModal] = useState(false);

    // Controlar el estado que muestra u oculta la modal para ver los detalles de un producto
    const [AddOrdersDetailsShowModal, setAddOrdersDetailsShowModal] = useState(false);

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Accede a los datos necesarios del registro (rowData) y llama a tu método
        const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = rowData.original;
        // Actualizar el estado de los datos seleccionados
        setDatosSeleccionados({IdInstitutoOK, IdNegocioOK, IdOrdenOK});
    };

    async function fetchData() {
        try {
            // Obtener los datos
            const ordersData = await getAllOrders();
            setOrdersData(ordersData);

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

export default OrdersTable;