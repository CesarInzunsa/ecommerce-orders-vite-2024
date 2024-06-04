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

const OrdenesEnviosRastreosSeguimientoModalUpdate = ({
                                                         OrdenesEnviosRastreosSeguimientoModalShowModalUpdate,
                                                         setOrdenesEnviosRastreosSeguimientoModalShowModalUpdate,
                                                         datosSeleccionados,
                                                         datosSecSubdoc,
                                                         datosSecSubdocRastreos,
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

                // Determinar el indice del subdocumento de envios
                const indexEnvios = ordenExistente.envios.findIndex((elemento) => (
                    elemento.IdDomicilioOK === datosSecSubdoc.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdoc.IdPaqueteriaOK
                ));

                // Determinar el indice del subdocumento de rastreos
                const indexRastreos = ordenExistente.envios[indexEnvios].rastreos.findIndex((elemento) => (
                    elemento.NumeroGuia === datosSecSubdocRastreos.NumeroGuia
                ));

                // Buscar el indice del seguimiento seleccionado
                const indexSeguimiento = ordenExistente.envios[indexEnvios].rastreos[indexRastreos].seguimiento.findIndex((elemento) => (
                    elemento.Ubicacion === dataRow.Ubicacion
                ));

                if (indexSeguimiento === -1) {
                    setMensajeExitoAlert(null);
                    setMensajeErrorAlert("Seleccione un seguimiento valido. Intente de nuevo.");
                    setLoading(false);
                    return;
                }

                ordenExistente.envios[indexEnvios].rastreos[indexRastreos].seguimiento[indexSeguimiento] = {
                    Ubicacion: dataRow.Ubicacion,
                    DesUbicacion: values.DesUbicacion,
                    Referencias: values.Referencias,
                    Observacion: values.Observacion
                };

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Declarar estado de exito.
                setMensajeExitoAlert("Informacion insertada exitosamente");

                fetchData();
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("Ocurrio un error al insertar la informacion. Intente de nuevo.");
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
            open={OrdenesEnviosRastreosSeguimientoModalShowModalUpdate}
            onClose={() => setOrdenesEnviosRastreosSeguimientoModalShowModalUpdate(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Actualizar - Envios-Rastreos-Rastreos a la orden</strong>
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
                    />
                    <TextField
                        id="Referencias"
                        label="Referencias*"
                        value={formik.values.Referencias}
                        {...commonTextFieldProps}
                        error={formik.touched.Referencias && Boolean(formik.errors.Referencias)}
                        helperText={formik.touched.Referencias && formik.errors.Referencias}
                    />
                    <TextField
                        id="Observacion"
                        label="Observacion*"
                        value={formik.values.Observacion}
                        {...commonTextFieldProps}
                        error={formik.touched.Observacion && Boolean(formik.errors.Observacion)}
                        helperText={formik.touched.Observacion && formik.errors.Observacion}
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
                            setOrdenesEnviosRastreosSeguimientoModalShowModalUpdate(false);
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
export default OrdenesEnviosRastreosSeguimientoModalUpdate;