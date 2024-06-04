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
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
import {OrdenesFacturaFacturaValues} from "../../../helpers/OrdenesFacturaFacturaValues.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";

const OrdenesFacturaFacturaModal = ({
                                        OrdenesFacturaShowModal,
                                        setOrdenesFacturaShowModal,
                                        datosSeleccionados,
                                        fetchData
                                    }) => {

    // Declarar estados para las alertas de éxito y error
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    // Hook para manejar el estado de carga
    const [Loading, setLoading] = useState(false);

    // Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdPersonaOK: "",
            Nombre: "",
            RFC: "",
            correo: "",
            Telefono: "",
            IdTipoFacturaOK: "",
            IdTipoPago: "",
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
        onSubmit: async (values) => {
            setMensajeExitoAlert("");
            setMensajeErrorAlert("");
            setLoading(true);

            try {
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;
                console.log('1');
                // Obtener la orden existente
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);
                console.log('2');
                // Obtener los valores de la ventana modal
                let nuevaFacturaDomicilio = {
                    IdPersonaOK: values.IdPersonaOK,
                    Nombre: values.Nombre,
                    RFC: values.RFC,
                    correo: values.correo,
                    Telefono: values.Telefono,
                    IdTipoFacturaOK: values.IdTipoFacturaOK,
                    IdTipoPago: values.IdTipoPago,
                };

                ordenExistente.factura.push(nuevaFacturaDomicilio);

                console.log('3');
                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);
                console.log('4');
                // Declarar estado de exito.
                setMensajeExitoAlert("Información actualizada exitosamente");
                console.log('5');
                fetchData();
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("Ocurrió un error al actualizar la información. Intente de nuevo.");
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
            open={OrdenesFacturaShowModal}
            onClose={() => setOrdenesFacturaShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>
                    <Typography>
                        <strong>Agregar Nueva Factura a la Orden</strong>
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
                    />
                    <TextField
                        id="Nombre"
                        label="Nombre*"
                        value={formik.values.Nombre}
                        {...commonTextFieldProps}
                        error={formik.touched.Nombre && Boolean(formik.errors.Nombre)}
                        helperText={formik.touched.Nombre && formik.errors.Nombre}
                    />
                    <TextField
                        id="RFC"
                        label="RFC*"
                        value={formik.values.RFC}
                        {...commonTextFieldProps}
                        error={formik.touched.RFC && Boolean(formik.errors.RFC)}
                        helperText={formik.touched.RFC && formik.errors.RFC}
                    />
                    <TextField
                        id="correo"
                        label="correo*"
                        value={formik.values.correo}
                        {...commonTextFieldProps}
                        error={formik.touched.correo && Boolean(formik.errors.correo)}
                        helperText={formik.touched.correo && formik.errors.correo}
                    />
                    <TextField
                        id="Telefono"
                        label="Teléfono*"
                        value={formik.values.Telefono}
                        {...commonTextFieldProps}
                        error={formik.touched.Telefono && Boolean(formik.errors.Telefono)}
                        helperText={formik.touched.Telefono && formik.errors.Telefono}
                    />
                    <TextField
                        id="IdTipoFacturaOK"
                        label="ID Tipo Factura*"
                        value={formik.values.IdTipoFacturaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoFacturaOK && Boolean(formik.errors.IdTipoFacturaOK)}
                        helperText={formik.touched.IdTipoFacturaOK && formik.errors.IdTipoFacturaOK}
                    />
                    <TextField
                        id="IdTipoPago"
                        label="ID Tipo Pago*"
                        value={formik.values.IdTipoPago}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoPago && Boolean(formik.errors.IdTipoPago)}
                        helperText={formik.touched.IdTipoPago && formik.errors.IdTipoPago}
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
                            setOrdenesFacturaShowModal(false);
                            setMensajeErrorAlert(null);
                            setMensajeExitoAlert(null);
                            formik.resetForm();
                        }}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                    <LoadingButton
                        color="primary"
                        loadingPosition="start"
                        startIcon={<SaveIcon/>}
                        variant="contained"
                        type="submit"
                        disabled={!!mensajeExitoAlert}
                        loading={Loading}
                    >
                        <span>GUARDAR</span>
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default OrdenesFacturaFacturaModal;
