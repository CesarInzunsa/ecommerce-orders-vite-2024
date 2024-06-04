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
import React, {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {OrdenesFormaPagoValues} from "../../../helpers/OrdenesFormaPagoValues.jsx";
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";

const OrdenesFormaPagoUpdateModal = ({
                                         OrdenesFormaPagoUpdateShowModal,
                                         setOrdenesFormaPagoUpdateShowModal,
                                         datosSeleccionados,
                                         dataRow,
                                         fetchData
                                     }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdTipoPagoOK: dataRow?.IdTipoPagoOK || "",
            MontoPagado: dataRow?.MontoPagado || "",
            MontoRecibido: dataRow?.MontoRecibido || "",
            MontoDevuelto: dataRow?.MontoDevuelto || "",
        },
        validationSchema: Yup.object({
            IdTipoPagoOK: Yup.string().required("Campo Requerido"),
            MontoPagado: Yup.number().required("Campo Requerido"),
            MontoRecibido: Yup.number().required("Campo Requerido"),
            MontoDevuelto: Yup.number().required("Campo Requerido"),
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

                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                for (let index = 0; index < ordenExistente.forma_pago.length; index++) {

                    if (ordenExistente.forma_pago[index].IdTipoPagoOK === dataRow.IdTipoPagoOK) {
                        ordenExistente.forma_pago[index].MontoPagado = values.MontoPagado;
                        ordenExistente.forma_pago[index].MontoRecibido = values.MontoRecibido;
                        ordenExistente.forma_pago[index].MontoDevuelto = values.MontoDevuelto;
                    }
                }

                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);
                setMensajeExitoAlert("Envío actualizado Correctamente");
                //handleReload(); //usar la función para volver a cargar los datos de la tabla y que se vea la actualizada
                fetchData();
            } catch (e) {
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

    return (
        <Dialog
            open={OrdenesFormaPagoUpdateShowModal}
            onClose={() => setOrdenesFormaPagoUpdateShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Actualizar Forma Pago de la Orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}} dividers>
                    {/* FIC: Campos de captura o selección */}
                    <TextField
                        id="IdTipoPagoOK"
                        label="IdTipoPagoOK*"
                        value={formik.values.IdTipoPagoOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoPagoOK && Boolean(formik.errors.IdTipoPagoOK)}
                        helperText={formik.touched.IdTipoPagoOK && formik.errors.IdTipoPagoOK}
                        disabled={true}
                    />
                    <TextField
                        id="MontoPagado"
                        label="MontoPagado*"
                        value={formik.values.MontoPagado}
                        {...commonTextFieldProps}
                        error={formik.touched.MontoPagado && Boolean(formik.errors.MontoPagado)}
                        helperText={formik.touched.MontoPagado && formik.errors.MontoPagado}
                    />
                    <TextField
                        id="MontoRecibido"
                        label="MontoRecibido*"
                        value={formik.values.MontoRecibido}
                        {...commonTextFieldProps}
                        error={formik.touched.MontoRecibido && Boolean(formik.errors.MontoRecibido)}
                        helperText={formik.touched.MontoRecibido && formik.errors.MontoRecibido}
                    />
                    <TextField
                        id="MontoDevuelto"
                        label="MontoDevuelto*"
                        value={formik.values.MontoDevuelto}
                        {...commonTextFieldProps}
                        error={formik.touched.MontoDevuelto && Boolean(formik.errors.MontoDevuelto)}
                        helperText={formik.touched.MontoDevuelto && formik.errors.MontoDevuelto}
                    />

                </DialogContent>
                {/* FIC: Aqui van las acciones del usuario como son las alertas o botones */}
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
                    {/* FIC: Boton de Cerrar. */}
                    <LoadingButton
                        color="secondary"
                        loadingPosition="start"
                        startIcon={<CloseIcon/>}
                        variant="outlined"
                        onClick={() => {
                            setOrdenesFormaPagoUpdateShowModal(false);
                            // reestablecer los valores de mensajes de exito y error
                            setMensajeErrorAlert(null);
                            setMensajeExitoAlert(null);

                            // Limpiar los valores del formulario
                            formik.resetForm();
                        }}
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
export default OrdenesFormaPagoUpdateModal;