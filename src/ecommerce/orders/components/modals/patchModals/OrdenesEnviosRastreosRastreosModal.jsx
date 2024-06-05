import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    TextField,
    DialogActions,
    Box,
    Alert,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {OrdenesEnviosRastreosRastreosValues} from "../../../helpers/OrdenesEnviosRastreosRastreosValues.jsx";
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
import {PutOneOrder} from "../../../services/remote/put/PutOneOrder.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
import {GetAllLabels} from "../../../services/remote/get/GetAllLabels";
import {GetAllProdServ} from "../../../services/remote/get/GetAllProdServ.jsx";

const OrdenesEnviosRastreosRastreosModal = ({
                                                OrdenesEnviosRastreosRastreosShowModal,
                                                setOrdenesEnviosRastreosRastreosShowModal,
                                                datosSeleccionados,
                                                datosSecSubdoc,
                                                fetchData
                                            }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    const [OrdenesValuesLabel, setOrdenesValuesLabel] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            NumeroGuia: "",
            IdRepartidorOK: "",
            NombreRepartidor: "",
            Alias: "",
        },
        validationSchema: Yup.object({
            NumeroGuia: Yup.string().required("El Número de guía es requerido"),
            IdRepartidorOK: Yup.string().required("Se Requiere el ID del repartidor"),
            NombreRepartidor: Yup.string().required("El nombre del repartidor es requerido"),
            Alias: Yup.string().required("El Alias es requerido"),
        }),
        onSubmit: async (values) => {
            //FIC: mostramos el Loading.
            setMensajeExitoAlert("");
            setMensajeErrorAlert("");
            setLoading(true);

            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);

            try {
                //Se desestructuran los datos del documento seleccionado
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                //Obtener la orden seleccionada
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // buscar indice de envios
                const indexEnvios = ordenExistente.envios.findIndex((elemento) => {
                    return elemento.IdDomicilioOK === datosSecSubdoc.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdoc.IdPaqueteriaOK
                });

                ordenExistente.envios[indexEnvios].rastreos.push({
                    NumeroGuia: values.NumeroGuia,
                    IdRepartidorOK: values.IdRepartidorOK,
                    NombreRepartidor: values.NombreRepartidor,
                    Alias: values.Alias,
                });

                //await PutOneOrder(EstatusOrdenes, IdInstitutoOK, IdNegocioOK, IdOrdenOK);
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente); //se puede sacar el objectid con row._id para lo del fic aaaaaaaaaaaaaaaaaaa
                setMensajeExitoAlert("rastreo actualizado Correctamente");
                //handleReload(); //usar la función para volver a cargar los datos de la tabla y que se vea la actualizada

                fetchData();
            } catch (e) {
                //console.log(ProductosOrdenes);
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("No se pudo Registrar");
            }
            //FIC: ocultamos el Loading.
            setLoading(false);
        },
    });

    //FIC: props structure for TextField Control.
    const commonTextFieldProps = {
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        fullWidth: true,
        margin: "dense",
        disabled: !!mensajeExitoAlert,
    };

    //MI FUNCION CREO
    async function getDataSelectOrdenesType2() {
        try {
            const productosData = await GetAllProdServ();
            setProductos(productosData);
        } catch (e) {
            console.error(
                "Error al obtener Etiquetas para Tipos Giros de Institutos:",
                e
            );
        }
    }

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        getDataSelectOrdenesType2();
        //const productosData=await GetAllProdServ();
        //setProductos(productosData);
    }, []);


    return (
        <Dialog
            open={OrdenesEnviosRastreosRastreosShowModal}
            onClose={() => setOrdenesEnviosRastreosRastreosShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Agregar Nuevo rastreo al Envio</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}} dividers>
                    {/* FIC: Campos de captura o selección */}
                    <TextField
                        id="NumeroGuia"
                        label="NumeroGuia*"
                        value={formik.values.NumeroGuia}
                        {...commonTextFieldProps}
                        error={formik.touched.NumeroGuia && Boolean(formik.errors.NumeroGuia)}
                        helperText={formik.touched.NumeroGuia && formik.errors.NumeroGuia}
                    />

                    <TextField
                        id="IdRepartidorOK"
                        label="IdRepartidorOK*"
                        value={formik.values.IdRepartidorOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdRepartidorOK && Boolean(formik.errors.IdRepartidorOK)}
                        helperText={formik.touched.IdRepartidorOK && formik.errors.IdRepartidorOK}
                    />

                    <TextField
                        id="NombreRepartidor"
                        label="NombreRepartidor*"
                        value={formik.values.NombreRepartidor}
                        {...commonTextFieldProps}
                        error={formik.touched.NombreRepartidor && Boolean(formik.errors.NombreRepartidor)}
                        helperText={formik.touched.NombreRepartidor && formik.errors.NombreRepartidor}
                    />

                    <TextField
                        id="Alias"
                        label="Alias*"
                        value={formik.values.Alias}
                        {...commonTextFieldProps}
                        error={formik.touched.Alias && Boolean(formik.errors.Alias)}
                        helperText={formik.touched.Alias && formik.errors.Alias}
                    />

                </DialogContent>
                {/* FIC: Aqui van las acciones del usuario como son las alertas o botones */}
                <DialogActions
                    sx={{display: 'flex', flexDirection: 'row'}}
                >
                    <Box m="auto">
                        {mensajeErrorAlert && (
                            <Alert severity="error">
                                <b>¡ERROR!</b> ─ {mensajeErrorAlert}
                            </Alert>
                        )}
                        {mensajeExitoAlert && (
                            <Alert severity="success">
                                <b>¡ÉXITO!</b> ─ {mensajeExitoAlert}
                            </Alert>
                        )}
                    </Box>
                    {/* FIC: Boton de Cerrar. */}
                    <LoadingButton
                        color="secondary"
                        loadingPosition="start"
                        startIcon={<CloseIcon/>}
                        variant="outlined"
                        onClick={() => setOrdenesEnviosRastreosRastreosShowModal(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                    {/* FIC: Boton de Guardar. */}
                    <LoadingButton
                        color="primary"
                        loadingPosition="start"
                        startIcon={<SaveIcon/>}
                        variant="contained"
                        type="submit"
                        disabled={formik.isSubmitting || !!mensajeExitoAlert || Loading}
                    >
                        <span>GUARDAR</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default OrdenesEnviosRastreosRastreosModal;
