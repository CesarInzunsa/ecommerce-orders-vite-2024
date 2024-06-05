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

const OrdenesEnviosModalUpdate = ({
                                      OrdenesEnviosShowModalDetails,
                                      setOrdenesEnviosShowModalDetails,
                                      dataRow
                                  }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);

    // Formik - Yup
    const formik = useFormik({
        initialValues: {
            IdDomicilioOK: dataRow?.IdPaqueteriaOK || "",
            IdPaqueteriaOK: dataRow?.IdPaqueteriaOK || "",
            IdTipoMetodoEnvio: dataRow?.IdTipoMetodoEnvio || "",
            CostoEnvio: dataRow?.CostoEnvio || "",
        },
        validationSchema: Yup.object({
            IdDomicilioOK: Yup.string().required("Campo requerido"),
            IdPaqueteriaOK: Yup.string().required("Campo requerido"),
            IdTipoMetodoEnvio: Yup.string().required("Campo requerido"),
            CostoEnvio: Yup.number().required("Campo requerido"),
        }),
        onSubmit: async (values) => {},
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
            open={OrdenesEnviosShowModalDetails}
            onClose={() => setOrdenesEnviosShowModalDetails(false)}
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
                        disabled={true}
                    />
                    <TextField
                        id="IdPaqueteriaOK"
                        label="IdPaqueteriaOK*"
                        value={formik.values.IdPaqueteriaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdPaqueteriaOK && Boolean(formik.errors.IdPaqueteriaOK)}
                        helperText={formik.touched.IdPaqueteriaOK && formik.errors.IdPaqueteriaOK}
                        disabled={true}
                    />
                    <TextField
                        id="IdTipoMetodoEnvio"
                        label="IdTipoMetodoEnvio*"
                        value={formik.values.IdTipoMetodoEnvio}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoMetodoEnvio && Boolean(formik.errors.IdTipoMetodoEnvio)}
                        helperText={formik.touched.IdTipoMetodoEnvio && formik.errors.IdTipoMetodoEnvio}
                        disabled={true}
                    />
                    <TextField
                        id="CostoEnvio"
                        label="CostoEnvio*"
                        value={formik.values.CostoEnvio}
                        {...commonTextFieldProps}
                        error={formik.touched.CostoEnvio && Boolean(formik.errors.CostoEnvio)}
                        helperText={formik.touched.CostoEnvio && formik.errors.CostoEnvio}
                        disabled={true}
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
                        onClick={() => setOrdenesEnviosShowModalDetails(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default OrdenesEnviosModalUpdate;
