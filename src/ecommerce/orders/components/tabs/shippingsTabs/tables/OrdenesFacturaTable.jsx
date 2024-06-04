import {useEffect, useState} from "react";

//Material UI
import {MaterialReactTable} from 'material-react-table';
import {Box, Stack, Tooltip, IconButton, Dialog} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import OrdenesFacturaFacturaModal from '../../../modals/patchModals/OrdenesFacturaFacturaModal.jsx';
import OrdenesUpdateFacturaFacturaModal from "../../../modals/updateModals/OrdenesUpdateFacturaFacturaModal.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
// DB
import {GetOneOrder} from '../../../../services/remote/get/GetOneOrder.jsx';
import OrdenesDetailsFacturaFacturaModal from "../../../modals/detailsModals/OrdenesDetailsFacturaFacturaModal.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdPersonaOK",
        header: "IdPersonaOK",
        size: 30, //small column
    },
    {
        accessorKey: "Nombre",
        header: "Nombre",
        size: 30, //small column
    },
    {
        accessorKey: "RFC",
        header: "RFC",
        size: 150, //small column
    },
    {
        accessorKey: "correo",
        header: "correo",
        size: 150, //small column
    },
    {
        accessorKey: "Telefono",
        header: "Telefono",
        size: 150, //small column
    },
    {
        accessorKey: "IdTipoFacturaOK",
        header: "IdTipoFacturaOK",
        size: 150, //small column
    },
    {
        accessorKey: "IdTipoPago",
        header: "IdTipoPago",
        size: 150, //small column
    },
];

// Table - FrontEnd.
const OrdenesFacturaTable = ({datosSeleccionados, setDatosSecSubdoc}) => {


    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    const [OrdenesFacturaShowModal, setOrdenesFacturaShowModal] = useState(false);

    const [OrdenesUpdateFacturaShowModal, setOrdenesUpdateFacturaShowModal] = useState(false);

    // CONTROLAR EL ESTADO DE LA VENTANA MODAL
    const [OrdenesDetailsFacturaShowModal, setOrdenesDetailsFacturaShowModal] = useState(false);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // Controlar el estado de la fila seleccionada.
    const [dataRow, setDataRow] = useState({});

    // FunciÃ³n para manejar el clic en una fila
    const sendDataRow = (rowData) => {
        // Guardar la informacion seleccionada
        setDataRow(rowData.original);

        // Extraer los ids seleccionados
        const {IdPersonaOK} = rowData.original;
        setDatosSecSubdoc({IdPersonaOK});

        console.log(IdPersonaOK);
    };

    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `La dirección de la factura con el ID: ${
                (dataRow.IdPersonaOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                const selectedRowIndex = ordersData.findIndex((row) => dataRow.IdPersonaOK === row.IdPersonaOK);

                if (selectedRowIndex === -1) {
                    return;
                }
                console.log(selectedRowIndex)

                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);
                const facturaArray = [...ordenExistente.factura];
                facturaArray.splice(selectedRowIndex, 1);
                const dataToUpdate = {
                    factura: facturaArray,
                };


                await UpdatePatchOneOrder?.(IdInstitutoOK, IdNegocioOK, IdOrdenOK, dataToUpdate);

                // Mostrar mensaje de confirmación
                await showMensajeConfirm("Estatus eliminado con exito");

                // Actualizar la data
                await fetchData();


            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar`);
            }
        }
    };

    async function fetchData() {
        setLoadingTable(true);
        try {
            // Obtener los id's seleccionados
            const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

            // Verificar si fueron seleccionados los id's; de lo contrario, no hacer nada.
            if (!IdInstitutoOK || !IdNegocioOK || !IdOrdenOK) {
                setOrdersData([]);
                setLoadingTable(false);
                return;
            }

            // Obtener los datos
            const ordersData = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);
            setOrdersData(ordersData.factura || []);

            // Cambiar el estado del indicador (loading) a false.
            setLoadingTable(false);
        } catch (error) {
            console.error("Error al obtener la data en useEffect: ", error);
            setLoadingTable(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [datosSeleccionados]);

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
                                            onClick={() => setOrdenesFacturaShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesUpdateFacturaShowModal(true)}
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
                                            onClick={() => setOrdenesDetailsFacturaShowModal(true)}
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
                            <Dialog open={OrdenesFacturaShowModal}>
                                <OrdenesFacturaFacturaModal
                                    OrdenesFacturaShowModal={OrdenesFacturaShowModal}
                                    setOrdenesFacturaShowModal={setOrdenesFacturaShowModal}
                                    datosSeleccionados={datosSeleccionados}
                                    fetchData={fetchData}
                                    onClose={() => {
                                        setOrdenesFacturaShowModal(false)
                                    }}
                                />

                            </Dialog>

                            <Dialog open={OrdenesUpdateFacturaShowModal}>
                                <OrdenesUpdateFacturaFacturaModal
                                    OrdenesUpdateFacturaShowModal={OrdenesUpdateFacturaShowModal}
                                    setOrdenesUpdateFacturaShowModal={setOrdenesUpdateFacturaShowModal}
                                    datosSeleccionados={datosSeleccionados}
                                    dataRow={dataRow}
                                    fetchData={fetchData}
                                    onClose={() => {
                                        setOrdenesUpdateFacturaShowModal(false)
                                    }}
                                />

                            </Dialog>

                            <Dialog open={OrdenesDetailsFacturaShowModal}>
                                <OrdenesDetailsFacturaFacturaModal
                                    OrdenesDetailsFacturaShowModal={OrdenesDetailsFacturaShowModal}
                                    setOrdenesDetailsFacturaShowModal={setOrdenesDetailsFacturaShowModal}
                                    dataRow={dataRow}
                                    onClose={() => {
                                        setOrdenesDetailsFacturaShowModal(false)
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

export default OrdenesFacturaTable;