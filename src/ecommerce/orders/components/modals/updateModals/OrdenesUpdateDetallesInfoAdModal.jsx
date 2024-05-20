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
import {OrdenesDetallesInfoAdValues} from "../../../helpers/OrdenesDetallesInfoAdValues.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
import {GetAllLabels} from "../../../services/remote/get/GetAllLabels";

const OrdenesUpdateDetallesInfoAdModal = ({
                                              OrdenesDetallesInfoAdShowModalUpdate,
                                              setOrdenesDetallesInfoAdShowModalUpdate,
                                              datosSeleccionados,
                                              datosSecSubdocDetalles,
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
            IdEtiquetaOK: dataRow.IdEtiquetaOK || "",
            IdEtiqueta: dataRow.IdEtiqueta || "",
            Etiqueta: dataRow.Etiqueta || "",
            Valor: dataRow.Valor || "",
            IdTipoSeccionOK: dataRow.IdTipoSeccionOK || "",
            Seccion: dataRow.Seccion || "",
            Secuencia: dataRow.Secuencia || "",
        },
        validationSchema: Yup.object({
            IdEtiquetaOK: Yup.string().required("El campo es requerido"),
            IdEtiqueta: Yup.string().required("El campo es requerido"),
            Etiqueta: Yup.string().required("El campo es requerido"),
            Valor: Yup.string().required("El campo es requerido"),
            IdTipoSeccionOK: Yup.string().required("El campo es requerido"),
            Seccion: Yup.string().required("El campo es requerido"),
            Secuencia: Yup.number().required("El campo es requerido"),
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

                //Actualizar la informacion del subdocumento
                for (let i = 0; i < ordenExistente.detalle_ps.length; i++) {
                    if (ordenExistente.detalle_ps[i].IdProdServOK === datosSecSubdocDetalles.IdProdServOK && ordenExistente.detalle_ps[i].IdPresentaOK === datosSecSubdocDetalles.IdPresentaOK) {

                        for (let j = 0; j < ordenExistente.detalle_ps[i].info_ad.length; j++) {
                            if (ordenExistente.detalle_ps[i].info_ad[j].IdEtiquetaOK === dataRow.IdEtiquetaOK) {
                                ordenExistente.detalle_ps[i].info_ad[j].IdEtiqueta = values.IdEtiqueta;
                                ordenExistente.detalle_ps[i].info_ad[j].Etiqueta = values.Etiqueta;
                                ordenExistente.detalle_ps[i].info_ad[j].Valor = values.Valor;
                                ordenExistente.detalle_ps[i].info_ad[j].IdTipoSeccionOK = values.IdTipoSeccionOK;
                                ordenExistente.detalle_ps[i].info_ad[j].Seccion = values.Seccion;
                                ordenExistente.detalle_ps[i].info_ad[j].Secuencia = values.Secuencia;
                            }
                        }
                    }
                }

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

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
            open={OrdenesDetallesInfoAdShowModalUpdate}
            onClose={() => setOrdenesDetallesInfoAdShowModalUpdate(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Actualizar Detalle-InfoAd de la orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>
                    <TextField
                        id="IdEtiquetaOK"
                        label="IdEtiquetaOK*"
                        value={formik.values.IdEtiquetaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdEtiquetaOK && Boolean(formik.errors.IdEtiquetaOK)}
                        helperText={formik.touched.IdEtiquetaOK && formik.errors.IdEtiquetaOK}
                    />
                    <TextField
                        id="IdEtiqueta"
                        label="IdEtiqueta*"
                        value={formik.values.IdEtiqueta}
                        {...commonTextFieldProps}
                        error={formik.touched.IdEtiqueta && Boolean(formik.errors.IdEtiqueta)}
                        helperText={formik.touched.IdEtiqueta && formik.errors.IdEtiqueta}
                    />
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
                        id="IdTipoSeccionOK"
                        label="IdTipoSeccionOK*"
                        value={formik.values.IdTipoSeccionOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoSeccionOK && Boolean(formik.errors.IdTipoSeccionOK)}
                        helperText={formik.touched.IdTipoSeccionOK && formik.errors.IdTipoSeccionOK}
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
                            setOrdenesDetallesInfoAdShowModalUpdate(false);
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
export default OrdenesUpdateDetallesInfoAdModal;