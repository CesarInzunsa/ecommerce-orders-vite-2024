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

const OrdenesEnviosRastreosRastreosModalDetails = ({
                                                      OrdenesEnviosRastreosRastreosShowModalDetails,
                                                      setOrdenesEnviosRastreosRastreosShowModalDetails,
                                                      dataRow
                                                  }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            NumeroGuia: dataRow?.NumeroGuia || "",
            IdRepartidorOK: dataRow?.IdRepartidorOK || "",
            NombreRepartidor: dataRow?.NombreRepartidor || "",
            Alias: dataRow?.Alias || "",
        },
        validationSchema: Yup.object({
            NumeroGuia: Yup.string().required("El Número de guía es requerido"),
            IdRepartidorOK: Yup.string().required("Se Requiere el ID del repartidor"),
            NombreRepartidor: Yup.string().required("El nombre del repartidor es requerido"),
            Alias: Yup.string().required("El Alias es requerido"),
        }),
        onSubmit: async (values) => {},
    });

    //FIC: props structure for TextField Control.
    const commonTextFieldProps = {
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        fullWidth: true,
        margin: "dense",
        disabled: !!mensajeExitoAlert,
    };

    return (
        <Dialog
            open={OrdenesEnviosRastreosRastreosShowModalDetails}
            onClose={() => setOrdenesEnviosRastreosRastreosShowModalDetails(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Detalles - rastreo del Envio</strong>
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
                        disabled={true}
                    />

                    <TextField
                        id="IdRepartidorOK"
                        label="IdRepartidorOK*"
                        value={formik.values.IdRepartidorOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdRepartidorOK && Boolean(formik.errors.IdRepartidorOK)}
                        helperText={formik.touched.IdRepartidorOK && formik.errors.IdRepartidorOK}
                        disabled={true}
                    />

                    <TextField
                        id="NombreRepartidor"
                        label="NombreRepartidor*"
                        value={formik.values.NombreRepartidor}
                        {...commonTextFieldProps}
                        error={formik.touched.NombreRepartidor && Boolean(formik.errors.NombreRepartidor)}
                        helperText={formik.touched.NombreRepartidor && formik.errors.NombreRepartidor}
                        disabled={true}
                    />

                    <TextField
                        id="Alias"
                        label="Alias*"
                        value={formik.values.Alias}
                        {...commonTextFieldProps}
                        error={formik.touched.Alias && Boolean(formik.errors.Alias)}
                        helperText={formik.touched.Alias && formik.errors.Alias}
                        disabled={true}
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
                        onClick={() => setOrdenesEnviosRastreosRastreosShowModalDetails(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default OrdenesEnviosRastreosRastreosModalDetails;
