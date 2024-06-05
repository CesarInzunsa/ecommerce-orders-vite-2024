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
import OrdenesClientesModal from "../../../modals/patchModals/OrdenesClientesModal.jsx";
import OrdenesVendedorModal from "../../../modals/patchModals/OrdenesVendedorModal.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";
import OrdenesVendedorModalUpdate from "../../../modals/updateModals/OrdenesVendedorModalUpdate.jsx";
import OrdenesVendedorModalDetails from "../../../modals/detailsModals/OrdenesVendedorModalDetails.jsx";

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

    // controlar modal insert vendedor
    const [OrdenesVendedorShowModal, setOrdenesVendedorShowModal] = useState(false);

    // controlar modal update vendedor
    const [OrdenesVendedorShowModalUpdate, setOrdenesVendedorShowModalUpdate] = useState(false);

    // controlar modal detials vendedor
    const [OrdenesVendedorShowModalDetails, setOrdenesVendedorShowModalDetails] = useState(false);

    // Función para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Guardar la informacion seleccionada
        setDataRow(rowData.original);
    };

    // Funcion par eliminar estatus órdenes
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El vendedor con el ID: ${
                (dataRow.IdUsuarioOK)
            } será eliminado, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                ordenExistente.vendedor = {
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
                await showMensajeConfirm("Vendedor eliminado con exito");

                // Actualizar la data
                await fetchData();

            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar el vendedor`);
            }
        }
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
                                            onClick={() => setOrdenesVendedorShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesVendedorShowModalUpdate(true)}
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
                                            onClick={() => setOrdenesVendedorShowModalDetails(true)}
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
                            <Dialog open={OrdenesVendedorShowModal}>
                                <OrdenesVendedorModal
                                    OrdenesVendedorShowModal={OrdenesVendedorShowModal}
                                    setOrdenesVendedorShowModal={setOrdenesVendedorShowModal}
                                    datosSeleccionados={datosSeleccionados}
                                    fetchData={fetchData}
                                    onClose={() => {
                                        setOrdenesVendedorShowModal(false)
                                    }}
                                />
                            </Dialog>

                            <Dialog open={OrdenesVendedorShowModalUpdate}>
                                <OrdenesVendedorModalUpdate
                                    OrdenesVendedorShowModalUpdate={OrdenesVendedorShowModalUpdate}
                                    setOrdenesVendedorShowModalUpdate={setOrdenesVendedorShowModalUpdate}
                                    datosSeleccionados={datosSeleccionados}
                                    fetchData={fetchData}
                                    dataRow={dataRow}
                                    onClose={() => {
                                        setOrdenesVendedorShowModalUpdate(false)
                                    }}
                                />
                            </Dialog>

                            <Dialog open={OrdenesVendedorShowModalDetails}>
                                <OrdenesVendedorModalDetails
                                    OrdenesVendedorShowModalDetails={OrdenesVendedorShowModalDetails}
                                    setOrdenesVendedorShowModalDetails={setOrdenesVendedorShowModalDetails}
                                    dataRow={dataRow}
                                    onClose={() => {
                                        setOrdenesVendedorShowModalDetails(false)
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

export default OrdenesVendedorTable;