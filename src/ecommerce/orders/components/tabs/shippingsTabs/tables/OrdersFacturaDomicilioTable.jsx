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
import OrdenesFacturaDomicilioModal from "./../../../modals/patchModals/OrdenesFacturaDomicilioModal.jsx"
import OrdenesFacturaDomicilioModalUpdate from "./../../../modals/updateModals/OrdenesUpdateFacturaDomicilioModal.jsx";
import OrdenesFacturaDomicilioModalDetails from "../../../modals/detailsModals/OrdenesDetailsFacturaDomicilioModal.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";

// Columns Table Definition.
const columns = [
    {
        accessorKey: "IdDomicilioOK",
        header: "IdDomicilioOK",
        size: 30, //small column
    },
    {
        accessorKey: "CalleNumero",
        header: "CalleNumero",
        size: 30, //small column
    },
    {
        accessorKey: "CodPostal",
        header: "CodPostal",
        size: 150, //small column
    },
    {
        accessorKey: "Pais",
        header: "Pais",
        size: 150, //small column
    },
    {
        accessorKey: "Estado",
        header: "Estado",
        size: 150, //small column
    },
    {
        accessorKey: "Municipio",
        header: "Municipio",
        size: 150, //small column
    },
    {
        accessorKey: "Localidad",
        header: "Localidad",
        size: 150, //small column
    },
    {
        accessorKey: "Colonia",
        header: "Colonia",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdocumentoPresenta) {
    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdPersonaOK === datosSecSubdocumentoPresenta.IdPersonaOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].domicilio
        : null;
}

// Table - FrontEnd.
const OrdersFacturaDomicilioTable = ({datosSeleccionados, datosSecSubdoc}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    //controlar el estado que muestra u oculta el modal para insertar el nuevo subdocumento
    const [OrdenesFacturaDomicilioShowModal, setOrdenesFacturaDomicilioShowModal] = useState(false);

    // controlar el estado del modal para actualizar
    const [OrdenesFacturaDomicilioShowModalUpdate, setOrdenesFacturaDomicilioShowModalUpdate] = useState(false);

    // controlar el estado del modal para detalles
    const [OrdenesFacturaDomicilioShowModalDetails, setOrdenesFacturaDomicilioShowModalDetails] = useState(false);

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

            const datosFiltrados = getDatosFiltrados(ordersData.factura, datosSecSubdoc);
            if (datosFiltrados) {
                setOrdersData(datosFiltrados);
            } else {
                setOrdersData([]); // que no sea null
            }

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
            `La dirección de la factura con el ID: ${
                (dataRow.IdDomicilioOK)
            } será eliminada, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Encuentra el índice del subdocumento factura que quieres actualizar
                const facturaPsIndex = ordenExistente.factura.findIndex(factura => {
                    // Encuentra el índice del subdocumento domicilio que debemos actualizar
                    const facturaDomicilioIndex = factura.domicilio.findIndex(domicilio => domicilio.IdDomicilioOK === dataRow.IdDomicilioOK);

                    // Si se encontró el subdocumento domicilio, devuelve true para detener la búsqueda
                    return facturaDomicilioIndex !== -1;
                });

                // Verifica si se encontró el subdocumento factura
                if (facturaPsIndex !== -1) {
                    // Encuentra el índice del subdocumento domicilio dentro del subdocumento factura encontrado
                    const infoAdIndex = ordenExistente.factura[facturaPsIndex].domicilio.findIndex(infoAd => infoAd.IdDomicilioOK === dataRow.IdDomicilioOK);

                    // Ahora ya tenemos los índices de factura e domicilio
                    console.log("facturaPsIndex: ", facturaPsIndex);
                    console.log("infoAdIndex: ", infoAdIndex);

                    // Elimina el subdocumento domicilio
                    ordenExistente.factura[facturaPsIndex].domicilio.splice(infoAdIndex, 1);

                    // Actualiza el documento con el endpoint
                    await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                    // Mostrar mensaje de confirmación
                    await showMensajeConfirm("Factura eliminada con exito");

                    // Actualizar la data
                    await fetchData();
                }
            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar la InfoAd`);
            }
        }
    };

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
                                            onClick={() => setOrdenesFacturaDomicilioShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesFacturaDomicilioShowModalUpdate(true)}
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
                                            onClick={() => setOrdenesFacturaDomicilioShowModalDetails(true)}
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
                        </>
                    )}
                />
                {/* M O D A L E S */}
                <Dialog open={OrdenesFacturaDomicilioShowModal}>
                    <OrdenesFacturaDomicilioModal
                        OrdenesFacturaDomicilioShowModal={OrdenesFacturaDomicilioShowModal}
                        setOrdenesFacturaDomicilioShowModal={setOrdenesFacturaDomicilioShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocDetalles={datosSecSubdoc}
                        fetchData={fetchData}
                        onClose={() => setOrdenesFacturaDomicilioShowModal(false)}
                    />
                </Dialog>
                {/*<Dialog open={OrdenesUpdateDetallesEstatusShowModal}>*/}
                <Dialog open={OrdenesFacturaDomicilioShowModalUpdate}>
                    <OrdenesFacturaDomicilioModalUpdate
                        OrdenesFacturaDomicilioShowModalUpdate={OrdenesFacturaDomicilioShowModalUpdate}
                        setOrdenesFacturaDomicilioShowModalUpdate={setOrdenesFacturaDomicilioShowModalUpdate}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocDetalles={datosSecSubdoc}
                        dataRow={dataRow}
                        fetchData={fetchData}
                        onClose={() => setOrdenesFacturaDomicilioShowModal(false)}
                    />
                </Dialog>

                <Dialog open={OrdenesFacturaDomicilioShowModalDetails}>
                    <OrdenesFacturaDomicilioModalDetails
                        OrdenesFacturaDomicilioShowModalDetails={OrdenesFacturaDomicilioShowModalDetails}
                        setOrdenesFacturaDomicilioShowModalDetails={setOrdenesFacturaDomicilioShowModalDetails}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdocDetalles={datosSecSubdoc}
                        dataRow={dataRow}
                        fetchData={fetchData}
                        onClose={() => setOrdenesFacturaDomicilioShowModal(false)}
                    />
                </Dialog>
            </Box>
        </Box>
    );
};

export default OrdersFacturaDomicilioTable;