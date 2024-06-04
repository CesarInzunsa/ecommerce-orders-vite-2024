// Importar de material-ui
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    TextField,
    DialogActions,
    Box,
    Alert,
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

// Importar React
import React, {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
import {GetAllLabels} from "../../../services/remote/get/GetAllLabels";

const OrdenesEnviosRastreosSeguimientoModalDetails = ({
                                                         OrdenesEnviosRastreosSeguimientoModalShowModalDetails,
                                                         setOrdenesEnviosRastreosSeguimientoModalShowModalDetails,
                                                         dataRow
                                                     }) => {

    // Declarar estados para las alertas de éxito y error
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    // Hook para manejar el estado de carga
    const [Loading, setLoading] = useState(false);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            Ubicacion: dataRow.Ubicacion || "",
            DesUbicacion: dataRow.DesUbicacion || "",
            Referencias: dataRow.Referencias || "",
            Observacion: dataRow.Observacion || "",
        },
        validationSchema: Yup.object({
            Ubicacion: Yup.string().required("Ubicacion es requerido"),
            DesUbicacion: Yup.string().required("DesUbicacion es requerido"),
            Referencias: Yup.string().required("Referencias es requerido"),
            Observacion: Yup.string().required("Observacion es requerido"),
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
            open={OrdenesEnviosRastreosSeguimientoModalShowModalDetails}
            onClose={() => setOrdenesEnviosRastreosSeguimientoModalShowModalDetails(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Detalles - Envios-Rastreos-Rastreos a la orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>

                    <TextField
                        id="Ubicacion"
                        label="Ubicacion*"
                        value={formik.values.Ubicacion}
                        {...commonTextFieldProps}
                        error={formik.touched.Ubicacion && Boolean(formik.errors.Ubicacion)}
                        helperText={formik.touched.Ubicacion && formik.errors.Ubicacion}
                        disabled={true}
                    />
                    <TextField
                        id="DesUbicacion"
                        label="DesUbicacion*"
                        value={formik.values.DesUbicacion}
                        {...commonTextFieldProps}
                        error={formik.touched.DesUbicacion && Boolean(formik.errors.DesUbicacion)}
                        helperText={formik.touched.DesUbicacion && formik.errors.DesUbicacion}
                        disabled={true}
                    />
                    <TextField
                        id="Referencias"
                        label="Referencias*"
                        value={formik.values.Referencias}
                        {...commonTextFieldProps}
                        error={formik.touched.Referencias && Boolean(formik.errors.Referencias)}
                        helperText={formik.touched.Referencias && formik.errors.Referencias}
                        disabled={true}
                    />
                    <TextField
                        id="Observacion"
                        label="Observacion*"
                        value={formik.values.Observacion}
                        {...commonTextFieldProps}
                        error={formik.touched.Observacion && Boolean(formik.errors.Observacion)}
                        helperText={formik.touched.Observacion && formik.errors.Observacion}
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
                        onClick={() => {
                            setOrdenesEnviosRastreosSeguimientoModalShowModalDetails(false);
                            // reestablecer los valores de mensajes de exito y error
                            setMensajeErrorAlert(null);
                            setMensajeExitoAlert(null);

                            // Limpiar los valores del formulario
                            formik.resetForm();
                        }}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default OrdenesEnviosRastreosSeguimientoModalDetails;