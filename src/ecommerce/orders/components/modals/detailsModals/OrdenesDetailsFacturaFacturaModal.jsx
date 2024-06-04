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
import React, {useState} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {OrdenesFacturaFacturaValues} from "../../../helpers/OrdenesFacturaFacturaValues.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";

const OrdenesDetailsFacturaFacturaModal = ({
                                               OrdenesDetailsFacturaShowModal,
                                               setOrdenesDetailsFacturaShowModal,
                                               dataRow
                                           }) => {

    // Declarar estados para las alertas de éxito y error
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    // Hook para manejar el estado de carga
    const [Loading, setLoading] = useState(false);

    // Formik y Yup.
    const formik = useFormik({
        initialValues: {
            Nombre: dataRow.Nombre || "",
            RFC: dataRow.RFC || "",
            IdPersonaOK: dataRow.IdPersonaOK || "",
            correo: dataRow.correo || "",
            Telefono: dataRow.Telefono || "",
            IdTipoFacturaOK: dataRow.IdTipoFacturaOK || "",
            IdTipoPago: dataRow.IdTipoPago || "",
        },
        validationSchema: Yup.object({
            IdPersonaOK: Yup.string().required("Campo requerido"),
            Nombre: Yup.string().required("Campo requerido"),
            RFC: Yup.string().required("Campo requerido"),
            correo: Yup.string().email("correo inválido").required("Campo requerido"),
            Telefono: Yup.string().required("Campo requerido"),
            IdTipoFacturaOK: Yup.string().required("Campo requerido"),
            IdTipoPago: Yup.string().required("Campo requerido"),
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
            open={OrdenesDetailsFacturaShowModal}
            onClose={() => setOrdenesDetailsFacturaShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>
                    <Typography>
                        <strong>Detalles - Factura de la Orden</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>
                    <TextField
                        id="IdPersonaOK"
                        label="ID Persona*"
                        value={formik.values.IdPersonaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdPersonaOK && Boolean(formik.errors.IdPersonaOK)}
                        helperText={formik.touched.IdPersonaOK && formik.errors.IdPersonaOK}
                        disabled={true}
                    />
                    <TextField
                        id="Nombre"
                        label="Nombre*"
                        value={formik.values.Nombre}
                        {...commonTextFieldProps}
                        error={formik.touched.Nombre && Boolean(formik.errors.Nombre)}
                        helperText={formik.touched.Nombre && formik.errors.Nombre}
                        disabled={true}
                    />
                    <TextField
                        id="RFC"
                        label="RFC*"
                        value={formik.values.RFC}
                        {...commonTextFieldProps}
                        error={formik.touched.RFC && Boolean(formik.errors.RFC)}
                        helperText={formik.touched.RFC && formik.errors.RFC}
                        disabled={true}
                    />
                    <TextField
                        id="correo"
                        label="correo*"
                        value={formik.values.correo}
                        {...commonTextFieldProps}
                        error={formik.touched.correo && Boolean(formik.errors.correo)}
                        helperText={formik.touched.correo && formik.errors.correo}
                        disabled={true}
                    />
                    <TextField
                        id="Telefono"
                        label="Teléfono*"
                        value={formik.values.Telefono}
                        {...commonTextFieldProps}
                        error={formik.touched.Telefono && Boolean(formik.errors.Telefono)}
                        helperText={formik.touched.Telefono && formik.errors.Telefono}
                        disabled={true}
                    />
                    <TextField
                        id="IdTipoFacturaOK"
                        label="ID Tipo Factura*"
                        value={formik.values.IdTipoFacturaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoFacturaOK && Boolean(formik.errors.IdTipoFacturaOK)}
                        helperText={formik.touched.IdTipoFacturaOK && formik.errors.IdTipoFacturaOK}
                        disabled={true}
                    />
                    <TextField
                        id="IdTipoPago"
                        label="ID Tipo Pago*"
                        value={formik.values.IdTipoPago}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoPago && Boolean(formik.errors.IdTipoPago)}
                        helperText={formik.touched.IdTipoPago && formik.errors.IdTipoPago}
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
                        onClick={() => {
                            setOrdenesDetailsFacturaShowModal(false);
                            setMensajeErrorAlert(null);
                            setMensajeExitoAlert(null);
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

export default OrdenesDetailsFacturaFacturaModal;
