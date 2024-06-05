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
import {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";

const OrdenesEnviosModal = ({OrdenesEnviosShowModal, setOrdenesEnviosShowModal, datosSeleccionados, fetchData}) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);

    // Formik - Yup
    const formik = useFormik({
        initialValues: {
            IdDomicilioOK: "",
            IdPaqueteriaOK: "",
            IdTipoMetodoEnvio: "",
            CostoEnvio: "",
        },
        validationSchema: Yup.object({
            IdDomicilioOK: Yup.string().required("Campo requerido"),
            IdPaqueteriaOK: Yup.string().required("Campo requerido"),
            IdTipoMetodoEnvio: Yup.string().required("Campo requerido"),
            CostoEnvio: Yup.number().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            setMensajeExitoAlert("");
            setMensajeErrorAlert("");
            setLoading(true);

            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            try {
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                ordenExistente.envios.push({
                    IdDomicilioOK: values.IdDomicilioOK,
                    IdPaqueteriaOK: values.IdPaqueteriaOK,
                    IdTipoMetodoEnvio: values.IdTipoMetodoEnvio,
                    CostoEnvio: values.CostoEnvio,
                });

                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);
                setMensajeExitoAlert("Envío registrado correctamente");
                fetchData();
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("No se pudo registrar el envío");
            }
            setLoading(false);
        },
    });

    const commonTextFieldProps = {
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        fullWidth: true,
        margin: "dense",
        disabled: !!mensajeExitoAlert,
    };

    return (
        <Dialog
            open={OrdenesEnviosShowModal}
            onClose={() => setOrdenesEnviosShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                <DialogTitle>
                    <Typography>
                        <strong>Agregar Nuevo Envío a la Orden</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}} dividers>

                    <TextField
                        id="IdDomicilioOK"
                        label="IdDomicilioOK*"
                        value={formik.values.IdDomicilioOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdDomicilioOK && Boolean(formik.errors.IdDomicilioOK)}
                        helperText={formik.touched.IdDomicilioOK && formik.errors.IdDomicilioOK}
                    />
                    <TextField
                        id="IdPaqueteriaOK"
                        label="IdPaqueteriaOK*"
                        value={formik.values.IdPaqueteriaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdPaqueteriaOK && Boolean(formik.errors.IdPaqueteriaOK)}
                        helperText={formik.touched.IdPaqueteriaOK && formik.errors.IdPaqueteriaOK}
                    />
                    <TextField
                        id="IdTipoMetodoEnvio"
                        label="IdTipoMetodoEnvio*"
                        value={formik.values.IdTipoMetodoEnvio}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoMetodoEnvio && Boolean(formik.errors.IdTipoMetodoEnvio)}
                        helperText={formik.touched.IdTipoMetodoEnvio && formik.errors.IdTipoMetodoEnvio}
                    />
                    <TextField
                        id="CostoEnvio"
                        label="CostoEnvio*"
                        value={formik.values.CostoEnvio}
                        {...commonTextFieldProps}
                        error={formik.touched.CostoEnvio && Boolean(formik.errors.CostoEnvio)}
                        helperText={formik.touched.CostoEnvio && formik.errors.CostoEnvio}
                    />
                </DialogContent>
                <DialogActions sx={{display: 'flex', flexDirection: 'row'}}>
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
                    <LoadingButton
                        color="secondary"
                        loadingPosition="start"
                        startIcon={<CloseIcon/>}
                        variant="outlined"
                        onClick={() => setOrdenesEnviosShowModal(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
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

export default OrdenesEnviosModal;
