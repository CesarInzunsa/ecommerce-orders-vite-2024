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
        accessorKey: "IdEtiquetaOK",
        header: "IdEtiquetaOK",
        size: 30, //small column
    },
    {
        accessorKey: "IdEtiqueta",
        header: "IdEtiqueta",
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
        header: "IdTipoSeccionOK",
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
        elemento.IdDomicilioOK === datosSecSubdocumentoPresenta.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdocumentoPresenta.IdPaqueteriaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].info_ad
        : null;
}

// Table - FrontEnd.
const OrdersEnviosInfoAdTable = ({datosSeleccionados, datosSecSubdoc}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

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

export default OrdersEnviosInfoAdTable;