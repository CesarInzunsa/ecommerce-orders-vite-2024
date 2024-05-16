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
import OrdenesDetallesPaqueteModal from "../modals/patchModals/OrdenesDetallesPaqueteModal.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "idPresentaOK",
        header: "Id Presenta OK",
        size: 30, //small column
    },
    {
        accessorKey: "DesPresenta",
        header: "Descripcion Presenta",
        size: 30, //small column
    },
    {
        accessorKey: "Cantidad",
        header: "Cantidad",
        size: 150, //small column
    },
    {
        accessorKey: "Precio",
        header: "Precio",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdProdServOK === datosSecSubdocumentoPresenta.IdProdServOK && elemento.IdPresentaOK === datosSecSubdocumentoPresenta.IdPresentaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].paquete
        : null;
}

// Table - FrontEnd.
const OrdersDetallesPaqueteTable = ({datosSecSubdocDetalles, datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // controlar el estado que muesta u oculta el modal para insertar el nuevo subdocumento.
    const [OrdenesDetallesPaqueteShowModal, setOrdenesDetallesPaqueteShowModal] = useState(false);

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
                                        <IconButton
                                            onClick={() => setOrdenesDetallesPaqueteShowModal(true)}
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
                <OrdenesDetallesPaqueteModal
                    OrdenesDetallesPaqueteShowModal={OrdenesDetallesPaqueteShowModal}
                    setOrdenesDetallesPaqueteShowModal={setOrdenesDetallesPaqueteShowModal}
                    datosSeleccionados={datosSeleccionados}
                    datosSecSubdocDetalles={datosSecSubdocDetalles}
                    onClose={() => setOrdenesDetallesPaqueteShowModal(false)}
                />
            </Box>
        </Box>
    );
};

export default OrdersDetallesPaqueteTable;