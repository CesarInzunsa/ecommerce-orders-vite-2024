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

const OrdenesDetallesInfoAdModal = ({
                                        OrdenesDetallesInfoAdShowModal,
                                        setOrdenesDetallesInfoAdShowModal,
                                        datosSeleccionados,
                                        datosSecSubdocDetalles,
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
            IdEtiquetaOK: "",
            Etiqueta: "",
            Valor: "",
            IdTipoSeccionOK: "",
            Seccion: "",
            Secuencia: "",
        },
        validationSchema: Yup.object({
            IdEtiquetaOK: Yup.string().required("El campo es requerido"),
            Etiqueta: Yup.string().required("El campo es requerido"),
            Valor: Yup.string().required("El campo es requerido"),
            IdTipoSeccionOK: Yup.string().required("El campo es requerido"),
            Seccion: Yup.string().required("El campo es requerido"),
            Secuencia: Yup.number().required("El campo es requerido"),
        }),
        onSubmit: async (values) => {
            // mostrar por consola toda la informacion nueva
            console.log("IdEtiquetaOK", values.IdEtiquetaOK);
            console.log("Etiqueta", values.Etiqueta);
            console.log("Valor", values.Valor);
            console.log("IdTipoSeccionOK", values.IdTipoSeccionOK);
            console.log("Seccion", values.Seccion);
            console.log("Secuencia", values.Secuencia);
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
                const index = ordenExistente.detalle_ps.findIndex((elemento) => (
                    elemento.IdProdServOK === datosSecSubdocDetalles.IdProdServOK && elemento.IdPresentaOK === datosSecSubdocDetalles.IdPresentaOK
                ));

                // Determinar si ya existe un detalle_ps.info_ad con un IdEtiquetaOK igual al nuevo
                const indexInfoAd = ordenExistente.detalle_ps[index].info_ad.findIndex((elemento) => (
                    elemento.IdEtiquetaOK === values.IdEtiquetaOK && elemento.Valor === values.Valor
                ));

                // Si ya existe un detalle_ps.info_ad con un IdEtiquetaOK igual al nuevo
                if (indexInfoAd !== -1) {
                    setMensajeExitoAlert(null);
                    setMensajeErrorAlert("Ya existe un registro con el mismo IdEtiquetaOK");
                    setLoading(false);
                    return;
                }

                values.IdTipoSeccionOK = 'IdSeccionesOrdenes';

                for (let i = 0; i < ordenExistente.detalle_ps[index].info_ad.length; i++) {
                    //console.log("Entro")
                    ordenExistente.detalle_ps[index].info_ad[i] = {
                        IdEtiquetaOK: ordenExistente.detalle_ps[index].info_ad[i].IdEtiquetaOK,
                        Etiqueta: ordenExistente.detalle_ps[index].info_ad[i].Etiqueta,
                        Valor: ordenExistente.detalle_ps[index].info_ad[i].Valor,
                        IdTipoSeccionOK: ordenExistente.detalle_ps[index].info_ad[i].IdTipoSeccionOK,
                        Seccion: ordenExistente.detalle_ps[index].info_ad[i].Seccion,
                        Secuencia: ordenExistente.detalle_ps[index].info_ad[i].Secuencia,
                    };
                    //console.log("Realizo", ordenExistente)
                }

                values.Actual == true ? (values.Actual = "S") : (values.Actual = "N");

                // Obtener los valores de la ventana modal
                const DetalleEstatusOrdenes = OrdenesDetallesInfoAdValues(values, ordenExistente, index);

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, DetalleEstatusOrdenes);

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

    useEffect(() => {
        getLabels();
        getSecciones();
    }, []);

    const [labels, setLabels] = useState([]);
    const [labelsvalores, setLabelsvalores] = useState([]);

    // Funcion para obtener todas las etiquetas
    async function getLabels() {
        try {
            // Obtener todas las etiquetas
            let labels = await GetAllLabels();
            // Comprueba si labels es un array y si tiene datos
            if (Array.isArray(labels) && labels.length > 0) {
                // guardar la informacion en el useState
                setLabels(labels);
            }
        } catch (e) {
            console.log('ERROR: getLabels', e);
        }
    }

    const [OrdenesValuesLabel, setOrdenesValuesLabel] = useState([]);

    async function getSecciones() {
        try {
            const Labels = await GetAllLabels();
            const OrdenesTypes = Labels.find(
                (label) => label.IdEtiquetaOK === "IdSeccionesOrdenes"
            );
            const valores = OrdenesTypes.valores; // Obtenemos el array de valores
            const IdValoresOK = valores.map((valor, index) => ({
                IdValorOK: valor.Valor,
                key: valor.IdValorOK, // Asignar el índice como clave temporal
            }));
            setOrdenesValuesLabel(IdValoresOK);
            //console.log(OrdenesValuesLabel)
        } catch (e) {
            console.error(
                "Error al obtener Etiquetas para Tipos Giros de Institutos:",
                e
            );
        }
    }

    return (
        <Dialog
            open={OrdenesDetallesInfoAdShowModal}
            onClose={() => setOrdenesDetallesInfoAdShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Agregar Nuevo Detalle-InfoAd a la orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Selecciona una etiqueta</InputLabel>
                        <Select
                            value={formik.values.IdEtiquetaOK}
                            label="Selecciona una opción"
                            onChange={(event) => {
                                formik.handleChange(event);
                                console.log(event.target.value);

                                // Buscar los valores de la etiqueta seleccionada
                                const etiquetaSeleccionada = labels.find((etiqueta) => etiqueta.IdEtiquetaOK === event.target.value);

                                // Obtener la Etiqueta seleccionada
                                formik.setFieldValue('Etiqueta', etiquetaSeleccionada.Etiqueta);
                                console.log(etiquetaSeleccionada.Etiqueta);

                                // Si se encontró la etiqueta
                                if (etiquetaSeleccionada) {
                                    setLabelsvalores(etiquetaSeleccionada.valores);
                                    console.log(labelsvalores);
                                }
                            }}
                            name="IdEtiquetaOK" // Asegúrate de que coincida con el nombre del campo
                            onBlur={formik.handleBlur}
                            disabled={!!mensajeExitoAlert}
                            error={formik.touched.IdEtiquetaOK && Boolean(formik.errors.IdEtiquetaOK)}
                            helperText={formik.touched.IdEtiquetaOK && formik.errors.IdEtiquetaOK}
                        >
                            {labels?.map((seccion) => {
                                return (
                                    <MenuItem
                                        value={seccion.IdEtiquetaOK}
                                        key={seccion.IdEtiquetaOK}
                                    >
                                        {seccion.IdEtiquetaOK}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <FormHelperText>
                            {formik.touched.IdEtiquetaOK && formik.errors.IdEtiquetaOK}
                        </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Selecciona un valor</InputLabel>
                        <Select
                            value={formik.values.Valor}
                            label="Selecciona una opción"
                            onChange={formik.handleChange}
                            name="Valor" // Asegúrate de que coincida con el nombre del campo
                            onBlur={formik.handleBlur}
                            disabled={!!mensajeExitoAlert}
                            error={formik.touched.Valor && Boolean(formik.errors.Valor)}
                            helperText={formik.touched.Valor && formik.errors.Valor}
                        >
                            {labelsvalores?.map((seccion) => {
                                return (
                                    <MenuItem
                                        value={seccion.Valor}
                                        key={seccion.Valor}
                                    >
                                        {seccion.Valor}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <FormHelperText>
                            {formik.touched.IdEtiquetaOK && formik.errors.IdEtiquetaOK}
                        </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Selecciona una Seccion</InputLabel>
                        <Select
                            value={formik.values.IdTipoSeccionOK}
                            label="Selecciona una opción"
                            onChange={(event) => {
                                formik.handleChange(event);
                                formik.setFieldValue('Seccion', event.target.value.substring(19, event.target.value.length));
                            }}
                            name="IdTipoSeccionOK" // Asegúrate de que coincida con el nombre del campo
                            onBlur={formik.handleBlur}
                            disabled={!!mensajeExitoAlert}
                            aria-label="TipoOrden"
                        >
                            {OrdenesValuesLabel.map((option, index) => (
                                <MenuItem key={option.IdValorOK} value={`IdSeccionesOrdenes-${option.key}`}>
                                    {option.IdValorOK}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            {formik.touched.IdTipoSeccionOK && formik.errors.IdTipoSeccionOK}
                        </FormHelperText>
                    </FormControl>
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
                            setOrdenesDetallesInfoAdShowModal(false);
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
export default OrdenesDetallesInfoAdModal;