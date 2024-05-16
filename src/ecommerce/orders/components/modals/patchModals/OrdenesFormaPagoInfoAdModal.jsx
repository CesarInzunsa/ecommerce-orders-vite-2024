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
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel, FormHelperText, FormControl, Switch, Stack
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
import {OrdenesFormaPagoInfoAdValues} from "../../../helpers/OrdenesFormaPagoInfoAdValues.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";

const OrdenesFormaPagoInfoAdModal = ({
                                         OrdenesFormaPagoInfoAdShowModal,
                                         setOrdenesFormaPagoInfoAdShowModal,
                                         datosSeleccionados,
                                         datosSecSubdocDetalles
                                     }) => {

    // Declarar estados para las alertas de éxito y error
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    // Hook para manejar el estado de carga
    const [Loading, setLoading] = useState(false);

    // Hook para refrescar el componente
    const [refresh, setRefresh] = useState(false);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            Etiqueta: "",
            Valor: "",
            IdSeccionOK: "",
            Seccion: "",
            Secuencia: "",
        },
        validationSchema: Yup.object({
            Etiqueta: Yup.string().required("El idPresentaOK es requerido"),
            Valor: Yup.string().required("El DesPresenta es requerido"),
            IdSeccionOK: Yup.string().required("La Cantidad es requerida"),
            Seccion: Yup.string().required("El Precio es requerido"),
            Secuencia: Yup.number().required("El Precio es requerido"),
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
                // Desestructurar datos del documento seleccionado
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener la orden existente
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Determinar el indice del subdocumento seleccionado
                const index = ordenExistente.forma_pago.findIndex((elemento) => (
                    elemento.IdTipoPagoOK === datosSecSubdocDetalles.IdTipoPagoOK
                ));

                for (let i = 0; i < ordenExistente.forma_pago[index].info_ad.length; i++) {
                    //console.log("Entro")
                    ordenExistente.forma_pago[index].info_ad[i] = {
                        Etiqueta: ordenExistente.forma_pago[index].info_ad[i].Etiqueta,
                        Valor: ordenExistente.forma_pago[index].info_ad[i].Valor,
                        IdSeccionOK: ordenExistente.forma_pago[index].info_ad[i].IdSeccionOK,
                        Seccion: ordenExistente.forma_pago[index].info_ad[i].Seccion,
                        Secuencia: ordenExistente.forma_pago[index].info_ad[i].Secuencia,
                    };
                    //console.log("Realizo", ordenExistente)
                }

                // Obtener los valores de la ventana modal
                const FormaPagoInfoAdData = OrdenesFormaPagoInfoAdValues(values, ordenExistente, index);

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, FormaPagoInfoAdData);

                // Declarar estado de exito.
                setMensajeExitoAlert("Informacion actualizada exitosamente");
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("Ocurrio un error al actualizar la informacion. Intente de nuevo.");
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
            open={OrdenesFormaPagoInfoAdShowModal}
            onClose={() => setOrdenesFormaPagoInfoAdShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Agregar Nuevo Detalle-Paquete a la orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>
                    {/* FIC: Campos de captura o selección */}
                    <TextField
                        id="Etiqueta"
                        label="Etiqueta*"
                        value={formik.values.Etiqueta}
                        {...commonTextFieldProps}
                        error={formik.touched.Etiqueta && Boolean(formik.errors.Etiqueta)}
                        helperText={formik.touched.Etiqueta && formik.errors.Etiqueta}
                    />
                    <TextField
                        id="Valor"
                        label="Valor*"
                        value={formik.values.Valor}
                        {...commonTextFieldProps}
                        error={formik.touched.Valor && Boolean(formik.errors.Valor)}
                        helperText={formik.touched.Valor && formik.errors.Valor}
                    />
                    <TextField
                        id="IdSeccionOK"
                        label="IdSeccionOK*"
                        value={formik.values.IdSeccionOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdSeccionOK && Boolean(formik.errors.IdSeccionOK)}
                        helperText={formik.touched.IdSeccionOK && formik.errors.IdSeccionOK}
                    />
                    <TextField
                        id="Seccion"
                        label="Seccion*"
                        value={formik.values.Seccion}
                        {...commonTextFieldProps}
                        error={formik.touched.Seccion && Boolean(formik.errors.Seccion)}
                        helperText={formik.touched.Seccion && formik.errors.Seccion}
                    />
                    <TextField
                        id="Secuencia"
                        label="Secuencia*"
                        value={formik.values.Secuencia}
                        {...commonTextFieldProps}
                        error={formik.touched.Secuencia && Boolean(formik.errors.Secuencia)}
                        helperText={formik.touched.Secuencia && formik.errors.Secuencia}
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
                            setOrdenesFormaPagoInfoAdShowModal(false);
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
export default OrdenesFormaPagoInfoAdModal;