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
        accessorKey: "IdUsuarioOK",
        header: "IdUsuarioOK",
        size: 30, //small column
    },
    {
        accessorKey: "IdPersonaOK",
        header: "IdPersonaOK",
        size: 30, //small column
    },
    {
        accessorKey: "Usuario",
        header: "Usuario",
        size: 150, //small column
    },
    {
        accessorKey: "Alias",
        header: "Alias",
        size: 150, //small column
    },
    {
        accessorKey: "Nombre",
        header: "Nombre",
        size: 150, //small column
    },
    {
        accessorKey: "ApParterno",
        header: "ApParterno",
        size: 150, //small column
    },
    {
        accessorKey: "ApMaterno",
        header: "ApMaterno",
        size: 150, //small column
    },
    {
        accessorKey: "FullUserName",
        header: "FullUserName",
        size: 150, //small column
    },
    {
        accessorKey: "RFC",
        header: "RFC",
        size: 150, //small column
    },
    {
        accessorKey: "CURP",
        header: "CURP",
        size: 150, //small column
    },
    {
        accessorKey: "Sexo",
        header: "Sexo",
        size: 150, //small column
    },
    {
        accessorKey: "IdTipoPersonaOK",
        header: "IdTipoPersonaOK",
        size: 150, //small column
    },
    {
        accessorKey: "FechaNac",
        header: "FechaNac",
        size: 150, //small column
    },
    {
        accessorKey: "IdTipoEstatusOK",
        header: "IdTipoEstatusOK",
        size: 150, //small column
    },
    {
        accessorKey: "IdRolActualOK",
        header: "IdRolActualOK",
        size: 150, //small column
    },
    {
        accessorKey: "IdRolPrincipalOK",
        header: "IdRolPrincipalOK",
        size: 150, //small column
    },
    {
        accessorKey: "FotoPerfil",
        header: "FotoPerfil",
        size: 150, //small column
    },
    {
        accessorKey: "Email",
        header: "Email",
        size: 150, //small column
    },
    {
        accessorKey: "TelMovil",
        header: "TelMovil",
        size: 150, //small column
    },
];

// Table - FrontEnd.
const OrdenesVendedorTable = ({datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // Controlar el estado de la fila seleccionada.
    const [dataRow, setDataRow] = useState({});

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Guardar la informacion seleccionada
        setDataRow(rowData.original);
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
            setOrdersData([ordersData.vendedor]);
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
                                            //onClick={() => setOrdenesInfoAdShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            //onClick={() => setOrdenesUpdateInfoAdShowModal(true)}
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
                            {/* M O D A L E S */}
                            {/*<Dialog open={OrdenesInfoAdShowModal}>*/}

                            {/*</Dialog>*/}
                            {/*<Dialog open={OrdenesUpdateInfoAdShowModal}>*/}

                            {/*</Dialog>*/}
                        </>
                    )}
                />
            </Box>
        </Box>
    );
};

export default OrdenesVendedorTable;