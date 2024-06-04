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
import OrdenesEnviosRastreosSeguimientoModal
    from "../../../modals/patchModals/OrdenesEnviosRastreosSeguimientoModal.jsx";
import OrdenesEnviosRastreosSeguimientoModalUpdate
    from "../../../modals/updateModals/OrdenesEnviosRastreosSeguimientoModalUpdate.jsx";
import {
    showMensajeConfirm,
    showMensajeError
} from "../../../../../../share/components/elements/messages/MySwalAlerts.jsx";
import {UpdatePatchOneOrder} from "../../../../services/remote/put/UpdatePatchOneOrder.jsx";
import OrdenesEnviosRastreosSeguimientoModalDetails
    from "../../../modals/detailsModals/OrdenesEnviosRastreosSeguimientoModalDetails.jsx";

// Modals

// Columns Table Definition.
const columns = [
    {
        accessorKey: "Ubicacion",
        header: "Ubicacion",
        size: 30, //small column
    },
    {
        accessorKey: "DesUbicacion",
        header: "DesUbicacion",
        size: 30, //small column
    },
    {
        accessorKey: "Referencias",
        header: "Referencias",
        size: 150, //small column
    },
    {
        accessorKey: "Observacion",
        header: "Observacion",
        size: 150, //small column
    },
];

function getDatosFiltrados(OneProductData, datosSecSubdoc, datosSecSubdocRastreos) {

    console.log("OneProductData: ", OneProductData);
    console.log("datosSecSubdoc: ", datosSecSubdoc);
    console.log("datosSecSubdocRastreos: ", datosSecSubdocRastreos);

    const resultadoFiltrado = OneProductData.filter(elemento => (
        elemento.IdDomicilioOK === datosSecSubdoc.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdoc.IdPaqueteriaOK
    ));

    // Obtener los productos filtrados
    const resultadoFiltradoEnvios = resultadoFiltrado.length > 0
        ? resultadoFiltrado[0].rastreos
        : null;

    // Ahora filtrar los productos para encontrar el subdocumento de descuentos
    const resultadoFiltradoSeguimiento = resultadoFiltradoEnvios.filter(elemento => (
        elemento.NumeroGuia === datosSecSubdocRastreos.NumeroGuia && elemento.IdRepartidorOK === datosSecSubdocRastreos.IdRepartidorOK
    ));

    // Obtener el primer elemento filtrado (si existe)
    return resultadoFiltradoSeguimiento.length > 0 ? resultadoFiltradoSeguimiento[0].seguimiento : null;
}

// Table - FrontEnd.
const OrdersEnviosRastreosSeguimientoTable = ({datosSeleccionados, datosSecSubdoc, datosSecSubdocRastreos}) => {

    // controlar el estado del indicador (loading).
    const [loadingTable, setLoadingTable] = useState(true);

    // controlar el estado de la data.
    const [ordersData, setOrdersData] = useState([]);

    // Controlar el estado del modal
    const [OrdenesEnviosRastreosSeguimientoModalShowModal, setOrdenesEnviosRastreosSeguimientoModalShowModal] = useState(false);

    // Controlar el estado del modal update
    const [OrdenesEnviosRastreosSeguimientoModalShowModalUpdate, setOrdenesEnviosRastreosSeguimientoModalShowModalUpdate] = useState(false);

    // controlar el estado del modal details
    const [OrdenesEnviosRastreosSeguimientoModalShowModalDetails, setOrdenesEnviosRastreosSeguimientoModalShowModalDetails] = useState(false);

    // Controlar la informacion seleccionada
    const [dataRow, setDataRow] = useState();

    console.log("datosSeleccionados: ", datosSeleccionados);
    console.log("datosSecSubdoc: ", datosSecSubdoc);
    console.log("datosSecSubdocProductos: ", datosSecSubdocRastreos);

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

            const datosFiltrados = getDatosFiltrados(ordersData.envios, datosSecSubdoc, datosSecSubdocRastreos);

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

    //Eliminar
    const handleDelete = async () => {
        const res = await showMensajeConfirm(
            `El producto con el ID: ${
                (dataRow.Ubicacion)
            } será eliminado, ¿Desea continuar?`
        );
        if (res) {
            try {
                // Obtener los id's seleccionados del documento principal
                let {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener toda la información del documento que se quiere actualizar su subdocumento
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Determinar el indice del subdocumento de envios
                const indexEnvios = ordenExistente.envios.findIndex((elemento) => (
                    elemento.IdDomicilioOK === datosSecSubdoc.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdoc.IdPaqueteriaOK
                ));

                // Determinar el indice del subdocumento de rastreos
                const indexRastreos = ordenExistente.envios[indexEnvios].rastreos.findIndex((elemento) => (
                    elemento.NumeroGuia === datosSecSubdocRastreos.NumeroGuia
                ));

                // Buscar el indice del seguimiento seleccionado
                const indexSeguimiento = ordenExistente.envios[indexEnvios].rastreos[indexRastreos].seguimiento.findIndex((elemento) => (
                    elemento.Ubicacion === dataRow.Ubicacion
                ));

                if (indexSeguimiento === -1) {
                    showMensajeError(`No se pudo eliminar el seguimiento`);
                    return;
                }

                // Elimina el subdocumento seguimiento dentro de rastreos
                ordenExistente.envios[indexEnvios].rastreos[indexRastreos].seguimiento.splice(indexSeguimiento, 1);

                // Actualiza el documento con el endpoint
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Mostrar mensaje de confirmación
                await showMensajeConfirm("Seguimiento eliminado con exito");

                // Actualizar la data
                await fetchData();
            } catch (e) {
                console.error("handleDelete", e);
                showMensajeError(`No se pudo eliminar el producto`);
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
                                            onClick={() => setOrdenesEnviosRastreosSeguimientoModalShowModal(true)}
                                        >
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={() => setOrdenesEnviosRastreosSeguimientoModalShowModalUpdate(true)}
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
                                            onClick={() => setOrdenesEnviosRastreosSeguimientoModalShowModalDetails(true)}
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
                <Dialog open={OrdenesEnviosRastreosSeguimientoModalShowModal}>
                    <OrdenesEnviosRastreosSeguimientoModal
                        OrdenesEnviosRastreosSeguimientoModalShowModal={OrdenesEnviosRastreosSeguimientoModalShowModal}
                        setOrdenesEnviosRastreosSeguimientoModalShowModal={setOrdenesEnviosRastreosSeguimientoModalShowModal}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdoc={datosSecSubdoc}
                        datosSecSubdocRastreos={datosSecSubdocRastreos}
                        fetchData={fetchData}
                        onClose={() => {
                            setOrdenesEnviosRastreosSeguimientoModalShowModal(false);
                        }}
                    />
                </Dialog>
                <Dialog open={OrdenesEnviosRastreosSeguimientoModalShowModalUpdate}>
                    <OrdenesEnviosRastreosSeguimientoModalUpdate
                        OrdenesEnviosRastreosSeguimientoModalShowModalUpdate={OrdenesEnviosRastreosSeguimientoModalShowModalUpdate}
                        setOrdenesEnviosRastreosSeguimientoModalShowModalUpdate={setOrdenesEnviosRastreosSeguimientoModalShowModalUpdate}
                        datosSeleccionados={datosSeleccionados}
                        datosSecSubdoc={datosSecSubdoc}
                        datosSecSubdocRastreos={datosSecSubdocRastreos}
                        fetchData={fetchData}
                        onClose={() => {
                            setOrdenesEnviosRastreosSeguimientoModalShowModalUpdate(false);
                        }}
                        dataRow={dataRow}
                    />
                </Dialog>

                <Dialog open={OrdenesEnviosRastreosSeguimientoModalShowModalDetails}>
                    <OrdenesEnviosRastreosSeguimientoModalDetails
                        OrdenesEnviosRastreosSeguimientoModalShowModalDetails={OrdenesEnviosRastreosSeguimientoModalShowModalDetails}
                        setOrdenesEnviosRastreosSeguimientoModalShowModalDetails={setOrdenesEnviosRastreosSeguimientoModalShowModalDetails}
                        onClose={() => {
                            setOrdenesEnviosRastreosSeguimientoModalShowModalDetails(false);
                        }}
                        dataRow={dataRow}
                    />
                </Dialog>

            </Box>
        </Box>
    );
};

export default OrdersEnviosRastreosSeguimientoTable;