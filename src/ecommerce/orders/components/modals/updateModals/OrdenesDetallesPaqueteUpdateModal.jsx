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
import {OrdenesDetallesPaqueteValues} from "../../../helpers/OrdenesDetallesPaqueteValues.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";

const OrdenesDetallesPaqueteUpdateModal = ({
                                               OrdenesDetallesPaqueteUpdateShowModal,
                                               setOrdenesDetallesPaqueteUpdateShowModal,
                                               datosSeleccionados,
                                               datosSecSubdocDetalles,
                                               dataRow,
                                               fetchData
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
            idPresentaOK: dataRow?.idPresentaOK || "",
            DesPresenta: dataRow?.DesPresenta || "",
            Cantidad: dataRow?.Cantidad || "",
            Precio: dataRow?.Precio || "",
        },
        validationSchema: Yup.object({
            idPresentaOK: Yup.string().required("Campo requerido"),
            DesPresenta: Yup.string().required("Campo requerido"),
            Cantidad: Yup.number().required("Campo requerido"),
            Precio: Yup.number().required("Campo requerido"),
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

                        for (let j = 0; j < ordenExistente.detalle_ps[i].paquete.length; j++) {
                            if (ordenExistente.detalle_ps[i].paquete[j].idPresentaOK === dataRow.idPresentaOK) {
                                ordenExistente.detalle_ps[i].paquete[j].DesPresenta = values.DesPresenta;
                                ordenExistente.detalle_ps[i].paquete[j].Cantidad = values.Cantidad;
                                ordenExistente.detalle_ps[i].paquete[j].Precio = values.Precio;
                            }
                        }
                    }
                }

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Declarar estado de exito.
                setMensajeExitoAlert("Informacion actualizada exitosamente");

                fetchData();
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
            open={OrdenesDetallesPaqueteUpdateShowModal}
            onClose={() => setOrdenesDetallesPaqueteUpdateShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Actualizar Detalle-Paquete a la orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>
                    {/* FIC: Campos de captura o selección */}
                    <TextField
                        id="idPresentaOK"
                        label="idPresentaOK*"
                        value={formik.values.idPresentaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.idPresentaOK && Boolean(formik.errors.idPresentaOK)}
                        helperText={formik.touched.idPresentaOK && formik.errors.idPresentaOK}
                        disabled={true}
                    />
                    <TextField
                        id="DesPresenta"
                        label="DesPresenta*"
                        multiline
                        rows={4}
                        maxRows={10}
                        value={formik.values.DesPresenta}
                        {...commonTextFieldProps}
                        error={formik.touched.DesPresenta && Boolean(formik.errors.DesPresenta)}
                        helperText={formik.touched.DesPresenta && formik.errors.DesPresenta}
                    />
                    <TextField
                        id="Cantidad"
                        label="Cantidad*"
                        value={formik.values.Cantidad}
                        {...commonTextFieldProps}
                        error={formik.touched.Cantidad && Boolean(formik.errors.Cantidad)}
                        helperText={formik.touched.Cantidad && formik.errors.Cantidad}
                    />
                    <TextField
                        id="Precio"
                        label="Precio*"
                        value={formik.values.Precio}
                        {...commonTextFieldProps}
                        error={formik.touched.Precio && Boolean(formik.errors.Precio)}
                        helperText={formik.touched.Precio && formik.errors.Precio}
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
                            setOrdenesDetallesPaqueteUpdateShowModal(false);
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
export default OrdenesDetallesPaqueteUpdateModal;