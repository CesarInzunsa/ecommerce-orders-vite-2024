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
    FormControlLabel, Stack, Switch, FormControl, FormHelperText
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import React, {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {OrdenesInfoAdValues} from "../../../helpers/OrdenesInfoAdValues.jsx";
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
import {GetAllLabels} from "../../../services/remote/get/GetAllLabels";
import MyAutoComplete from "../../../../../share/components/elements/atomos/MyAutoComplete.jsx";
import Tooltip from "@mui/material/Tooltip";
import useEtiquetas from "../../../services/remote/useEtiquetas";

const OrdenesUpdateInfoAdModal = ({
                                      OrdenesUpdateInfoAdShowModal,
                                      setOrdenesUpdateInfoAdShowModal,
                                      datosSeleccionados,
                                      dataRow
                                  }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isNuevaEtiqueta, setINuevaEtiqueta] = React.useState(false);
    const [OrdenesValuesLabel, setOrdenesValuesLabel] = useState([]);

    useEffect(() => {
        console.log("isNuevaEtiqueta", isNuevaEtiqueta);
    }, [isNuevaEtiqueta]);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdEtiquetaOK: dataRow.IdEtiquetaOK,
            IdEtiqueta: dataRow.IdEtiqueta,
            IdTipoSeccionOK: dataRow.IdTipoSeccionOK,
            Valor: dataRow.Valor,
            Secuencia: dataRow.Secuencia,
        },
        validationSchema: Yup.object({
            IdEtiquetaOK: Yup.string(),
            IdEtiqueta: Yup.string(),
            IdTipoSeccionOK: Yup.string().required("Campo requerido"),
            Valor: Yup.string("").required("Campo requerido"),
            Secuencia: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {

            console.log('entontro al onsubmit', values)

            //FIC: mostramos el Loading.
            setMensajeExitoAlert("");
            setMensajeErrorAlert("");
            setLoading(true);

            //FIC: reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            try {

                // Obtener los id de la orden
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                // Obtener la orden existente
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Actualizar la informacion del subdocumento
                for (let i = 0; i < ordenExistente.info_ad.length; i++) {
                    if (ordenExistente.info_ad[i].IdEtiquetaOK === dataRow.IdEtiquetaOK) {
                        ordenExistente.info_ad[i].IdEtiqueta = values.IdEtiqueta;
                        ordenExistente.info_ad[i].Valor = values.Valor;
                        ordenExistente.info_ad[i].IdTipoSeccionOK = values.IdTipoSeccionOK;
                        ordenExistente.info_ad[i].Secuencia = values.Secuencia;
                    }
                }

                // Actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                setMensajeExitoAlert("Info Adicional creada y guardada Correctamente");
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

    async function getDataSelectOrdenesType2() {
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
            console.log(OrdenesValuesLabel)
        } catch (e) {
            console.error(
                "Error al obtener Etiquetas para Tipos Giros de Institutos:",
                e
            );
        }
    }

    useEffect(() => {
        getDataSelectOrdenesType2();
    }, []);

    const {etiquetas, etiquetaEspecifica} = useEtiquetas({
        IdInstitutoOK: datosSeleccionados.IdInstitutoOK,
        IdEtiquetaOK: formik.values.IdEtiquetaOK || "",
    });

    return (
        <Dialog
            open={OrdenesUpdateInfoAdShowModal}
            onClose={() => OrdenesUpdateInfoAdShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Agregar Nuevo Estado de la Orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent
                    sx={{display: 'flex', flexDirection: 'column'}}
                    dividers
                >
                    <Stack direction="row" alignItems="center">
                        <MyAutoComplete
                            disabled={!!mensajeExitoAlert || isNuevaEtiqueta}
                            label={"Selecciona una Etiqueta"}
                            options={etiquetas} //Arreglo de objetos
                            displayProp="Etiqueta" // Propiedad a mostrar
                            idProp="IdEtiquetaOK" // Propiedad a guardar al dar clic
                            onSelectValue={(selectedValue) => {
                                //console.log("Selección:", selectedValue);
                                formik.values.IdEtiqueta = selectedValue
                                    ? selectedValue?.IdEtiquetaOK
                                    : "";
                                formik.values.IdEtiquetaOK = selectedValue
                                    ? selectedValue?.IdEtiquetaOK
                                    : "";
                                setRefresh(!refresh);
                            }}
                        />
                        <Tooltip title="Agrega manualmente una etiqueta nueva">
                            <FormControlLabel
                                sx={{ml: 2}}
                                control={<Switch defaultChecked/>}
                                label={
                                    isNuevaEtiqueta
                                        ? "Agregar Nueva Etiqueta"
                                        : "Seleccionar una Etiqueta"
                                }
                                onChange={() => {
                                    setINuevaEtiqueta(!isNuevaEtiqueta);
                                    formik.values.IdEtiqueta = "";
                                }}
                            />
                        </Tooltip>
                    </Stack>
                    <TextField
                        id="IdEtiqueta"
                        label="IdEtiqueta*"
                        value={formik.values.IdEtiqueta}
                        {...commonTextFieldProps}
                        error={formik.touched.IdEtiqueta && Boolean(formik.errors.IdEtiqueta)}
                        helperText={formik.touched.IdEtiqueta && formik.errors.IdEtiqueta}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Selecciona una Seccion</InputLabel>
                        <Select
                            value={formik.values.IdTipoSeccionOK}
                            label="Selecciona una opción"
                            onChange={formik.handleChange}
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
                        id="Valor"
                        label="Valor*"
                        value={formik.values.Valor}
                        error={formik.touched.Valor && Boolean(formik.errors.Valor)}
                        helperText={formik.touched.Valor && formik.errors.Valor}
                        {...commonTextFieldProps}
                        disabled={!!mensajeExitoAlert}
                    />
                    <TextField
                        type="number"
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
                        onClick={() => setOrdenesUpdateInfoAdShowModal(false)}
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
export default OrdenesUpdateInfoAdModal;