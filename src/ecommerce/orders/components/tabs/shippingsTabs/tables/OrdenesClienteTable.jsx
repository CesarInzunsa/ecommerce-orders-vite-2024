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
import OrdenesDetailsFacturaFacturaModal from "../../../modals/detailsModals/OrdenesDetailsFacturaFacturaModal.jsx";
import OrdenesClientesModal from "../../../modals/patchModals/OrdenesClientesModal.jsx";
import OrdenesClientesModalUpdate from "../../../modals/updateModals/OrdenesClientesModalUpdate.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";
import OrdenesClientesModalUpdateDetails from "../../../modals/detailsModals/OrdenesClientesModalDetails.jsx";

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
const OrdenesClienteTable = ({datosSeleccionados}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // Controlar el estado de la fila seleccionada.
    const [dataRow, setDataRow] = useState({});

    // controlar modal insertar cliente
    const [OrdenesClientesShowModal, setOrdenesClientesShowModal] = useState(false);

    // controlar modal update cliente
    const [OrdenesClientesShowModalUpdate, setOrdenesClientesShowModalUpdate] = useState(false);

    // controlar modal details cliente
    const [OrdenesClientesShowModalDetails, setOrdenesClientesShowModalDetails] = useState(false);

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

            if (ordersData.cliente === undefined || ordersData.cliente === null) {
                setOrdersData([]);
                setLoadingTable(false);
                return;
            }

            setOrdersData([ordersData.cliente]);
            // Cambiar el estado del indicador (loading) a false.
            setLoadingTable(false);
        } catch (error) {
            console.error("Error al obtener la data en useEffect: ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Funcion par eliminar estatus órdenes
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El cliente con el ID: ${
                (dataRow.IdUsuarioOK)
            } será eliminado, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                ordenExistente.cliente = {
                    IdUsuarioOK: "",
                    IdPersonaOK: "",
                    Usuario: "",
                    Alias: "",
                    Nombre: "",
                    ApParterno: "",
                    ApMaterno: "",
                    FullUserName: "",
                    RFC: "",
                    CURP: "",
                    Sexo: "",
                    IdTipoPersonaOK: "",
                    FechaNac: "",
                    IdTipoEstatusOK: "",
                    IdRolActualOK: "",
                    IdRolPrincipalOK: "",
                    FotoPerfil: "",
                    Email: "",
                    TelMovil: "",
                };

                // Actualiza el documento con el endpoint
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Mostrar mensaje de confirmación
                await showMensajeConfirm("Cliente eliminado con exito");

                // Actualizar la data
                await fetchData();

            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar el cliente`);
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
                                            onClick={() => setOrdenesClientesShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesClientesShowModalUpdate(true)}
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
                                            onClick={() => setOrdenesClientesShowModalDetails(true)}
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
                            {/* M O D A L E S */}
                            <Dialog open={OrdenesClientesShowModal}>
                                <OrdenesClientesModal
                                    OrdenesClientesShowModal={OrdenesClientesShowModal}
                                    setOrdenesClientesShowModal={setOrdenesClientesShowModal}
                                    datosSeleccionados={datosSeleccionados}
                                    fetchData={fetchData}
                                    onClose={() => {
                                        setOrdenesClientesShowModal(false)
                                    }}
                                />
                            </Dialog>

                            <Dialog open={OrdenesClientesShowModalUpdate}>
                                <OrdenesClientesModalUpdate
                                    OrdenesClientesShowModalUpdate={OrdenesClientesShowModalUpdate}
                                    setOrdenesClientesShowModalUpdate={setOrdenesClientesShowModalUpdate}
                                    datosSeleccionados={datosSeleccionados}
                                    fetchData={fetchData}
                                    dataRow={dataRow}
                                    onClose={() => {
                                        setOrdenesClientesShowModalUpdate(false)
                                    }}
                                />
                            </Dialog>

                            <Dialog open={OrdenesClientesShowModalDetails}>
                                <OrdenesClientesModalUpdateDetails
                                    OrdenesClientesShowModalDetails={OrdenesClientesShowModalDetails}
                                    setOrdenesClientesShowModalDetails={setOrdenesClientesShowModalDetails}
                                    dataRow={dataRow}
                                    onClose={() => {
                                        setOrdenesClientesShowModalDetails(false)
                                    }}
                                />
                            </Dialog>
                        </>
                    )}
                />
            </Box>
        </Box>
    );
};

export default OrdenesClienteTable;