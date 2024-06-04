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
import {OrdenesDetallesEstatusValues} from "../../../helpers/OrdenesDetallesEstatusValues.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
import {GetAllLabels} from "../../../services/remote/get/GetAllLabels";

const OrdenesFacturaProductosDescuentosModalDetails = ({
                                                          OrdenesDetallesEstatusModalShowModalDetails,
                                                          setOrdenesDetallesEstatusModalShowModalDetails,
                                                          dataRow,
                                                      }) => {

    // Declarar estados para las alertas de éxito y error
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    // Hook para manejar el estado de carga
    const [Loading, setLoading] = useState(false);

    // Hook para refrescar el componente
    const [refresh, setRefresh] = useState(false);

    // Hook para valores de labels y etiquetas
    const [OrdenesValuesLabel, setOrdenesValuesLabel] = useState([]);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdTipoDescuentoOK: dataRow?.IdTipoDescuentoOK || "",
            CodigoDescuento: dataRow?.CodigoDescuento || "",
            Monto: dataRow?.Monto || "",
        },
        validationSchema: Yup.object({
            IdTipoDescuentoOK: Yup.string().required("Campo requerido"),
            CodigoDescuento: Yup.string().required("Campo requerido"),
            Monto: Yup.string().required("Campo requerido"),
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
            open={OrdenesDetallesEstatusModalShowModalDetails}
            onClose={() => setOrdenesDetallesEstatusModalShowModalDetails(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Actualizar producto-Descuento a la orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>
                    <TextField
                        id="IdTipoDescuentoOK"
                        label="IdTipoDescuentoOK*"
                        value={formik.values.IdTipoDescuentoOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoDescuentoOK && Boolean(formik.errors.IdTipoDescuentoOK)}
                        helperText={formik.touched.IdTipoDescuentoOK && formik.errors.IdTipoDescuentoOK}
                        disabled={true}
                    />
                    <TextField
                        id="CodigoDescuento"
                        label="CodigoDescuento*"
                        value={formik.values.CodigoDescuento}
                        {...commonTextFieldProps}
                        error={formik.touched.CodigoDescuento && Boolean(formik.errors.CodigoDescuento)}
                        helperText={formik.touched.CodigoDescuento && formik.errors.CodigoDescuento}
                        disabled={true}
                    />
                    <TextField
                        id="Monto"
                        label="Monto*"
                        value={formik.values.Monto}
                        {...commonTextFieldProps}
                        error={formik.touched.Monto && Boolean(formik.errors.Monto)}
                        helperText={formik.touched.Monto && formik.errors.Monto}
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
                            setOrdenesDetallesEstatusModalShowModalDetails(false);
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
export default OrdenesFacturaProductosDescuentosModalDetails;