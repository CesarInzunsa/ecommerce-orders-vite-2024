// Importar react components
import {useEffect, useState} from "react";
// Importar material ui components
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    TextField,
    DialogActions,
    Box,
    Alert,
    FormHelperText, Select, FormControl, InputLabel
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";
// Importar Services
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {GetAllLabels} from "../../../services/remote/get/GetAllLabels.jsx";
import {GetAllPersons} from "../../../services/remote/get/GetAllPersons.jsx";
import UseInstitutos from "../../../services/remote/UseInstitutos.jsx";
// Importar Helpers
import {ordersValues} from "../../../helpers/ordersValues.jsx";
// Importar el generador de ID
import {v4 as genID} from "uuid";
// Importar custom Hook
import MyAutoComplete from "../../../../../share/components/elements/atomos/MyAutoComplete.jsx";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";

const PatchOrdenesModal = ({PatchOrdenesShowModal, setPatchOrdenesShowModal, dataRow}) => {

    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    const [IdGen, setIdGen] = useState(genID().replace(/-/g, "").substring(0, 12));
    const [TipoOrdenesValuesLabel, setTipoOrdenesValuesLabel] = useState([]);
    const [RolValuesLabel, setRolValuesLabel] = useState([]);
    const [PersonaValuesLabel, setPersonaValuesLabel] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // Creamos un useEffect para que se ejecute cada vez que cambie el valor de IdInstitutoOK
    useEffect(() => {
        getLabelsByTipoOrdenes();
        getLabelsByRol();
        getPersonsByTipo();
    }, []);

    // Función para obtener los tipos de órdenes desde la base de datos de labels
    async function getLabelsByTipoOrdenes() {
        try {
            const Labels = await GetAllLabels();
            const OrdenesTypes = Labels.find(
                (label) => label.IdEtiquetaOK === "IdTipoOrdenes"
            );
            const valores = OrdenesTypes.valores; // Obtenemos el array de valores
            const IdValoresOK = valores.map((valor, index) => ({
                IdValorOK: valor.Valor,
                key: valor.IdValorOK, // Asignar el índice como clave temporal
            }));
            setTipoOrdenesValuesLabel(IdValoresOK);
            console.log("TipoOrdenesValuesLabel", TipoOrdenesValuesLabel)
        } catch (error) {
            console.error("Error al obtener Etiquetas para Tipos Giros de Institutos:", error);
        }
    }

    // Función para obtener los tipos de roles desde la base de datos de labels
    async function getLabelsByRol() {
        try {
            const Labels = await GetAllLabels();
            const OrdenesTypes = Labels.find(
                (label) => label.IdEtiquetaOK === "IdTipoRol"
            );
            const valores = OrdenesTypes.valores; // Obtenemos el array de valores
            const IdValoresOK = valores.map((valor, index) => ({
                IdValorOK: valor.Valor,
                key: valor.IdValorOK, // Asignar el índice como clave temporal
            }));
            setRolValuesLabel(IdValoresOK);
            console.log("RolValuesLabel", RolValuesLabel)
        } catch (e) {
            console.error("Error al obtener Etiquetas para Tipos Giros de Institutos:", error);
        }
    }

    // Función para obtener los tipos de personas desde la base de datos de labels
    async function getPersonsByTipo() {
        try {
            const Labels = await GetAllPersons();

            // Comprueba si Labels es un array y si tiene datos
            if (Array.isArray(Labels) && Labels.length > 0) {
                const IdValoresOK = Labels.map((valor, index) => ({
                    IdValorOK: valor.Nombre + " " + valor.ApPaterno + " " + valor.ApMaterno,
                    key: valor.IdPersonaOK,
                }));

                setPersonaValuesLabel(IdValoresOK);
                console.log("PersonaValuesLabel", PersonaValuesLabel);
            } else {
                console.log('El resultado de GetPersona() no es un array o está vacío');
            }
        } catch (error) {
            console.error("Error al obtener Etiquetas para Tipos Giros de Institutos:", error);
        }
    }

    // Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdInstitutoOK: dataRow.IdInstitutoOK || "",
            IdNegocioOK: dataRow.IdNegocioOK || "",
            IdOrdenOK: dataRow.IdOrdenOK || "",
            IdOrdenBK: dataRow.IdOrdenBK || "",
            IdTipoOrdenOK: dataRow.IdTipoOrdenOK || "",
            IdRolOK: dataRow.IdRolOK || "",
            IdPersonaOK: dataRow.IdPersonaOK || "",
        },
        validationSchema: Yup.object({
            IdOrdenOK: Yup.string()
                .required("Campo requerido")
                .matches(
                    /^[a-zA-Z0-9-]+$/,
                    "Solo se permiten caracteres alfanuméricos"
                ),
            IdOrdenBK: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            // Mostramos el Loading.
            setLoading(true);

            // Reiniciamos los estados de las alertas de exito y error.
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);

            // Try-catch para manejar errores.
            try {
                // Extraer los datos de los campos de la ventana modal que ya tiene Formik.
                const order = ordersValues(values);
                // Llamamos al servicio para agregar una nueva orden
                await UpdatePatchOneOrder(dataRow.IdInstitutoOK, dataRow.IdNegocioOK, dataRow.IdOrdenOK, order);
                // Si no hubo errores, mostramos el mensaje de exito.
                setMensajeExitoAlert("Orden creada y guardada correctamente");
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("No se pudo crear la orden");
            }

            // Ocultamos el Loading.
            setLoading(false);
        },
    });

    // props structure for TextField Control.
    const commonTextFieldProps = {
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        fullWidth: true,
        margin: "dense",
        disabled: !!mensajeExitoAlert,
    };

    const {etiquetas, etiquetaEspecifica} = UseInstitutos({IdInstitutoOK: formik.values.IdInstitutoOK || "",});

    return (
        <Dialog
            open={PatchOrdenesShowModal}
            onClose={() => setPatchOrdenesShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography component="h6">
                        <strong>Agregar nueva orden</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent
                    sx={{display: 'flex', flexDirection: 'column'}}
                    dividers
                >
                    {/* Aqui van los campos de la ventana modal */}
                    <MyAutoComplete
                        disabled={!!mensajeExitoAlert}
                        label={`Selecciona un Instituto [${dataRow.IdInstitutoOK}]`}
                        options={etiquetas}
                        displayProp="IdInstitutoOK"
                        idProp="IdInstitutoOK"
                        onSelectValue={(selectedValue) => {
                            formik.values.IdInstitutoOK = selectedValue ? selectedValue?.IdInstitutoOK : "";
                            setRefresh(!refresh);
                        }}
                        disabled
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>{`Selecciona un Negocio [${dataRow.IdNegocioOK}]`}</InputLabel>
                        <Select
                            value={formik.values.IdNegocioOK}
                            label="Selecciona una opción"
                            onChange={formik.handleChange}
                            name="IdNegocioOK" // Asegúrate de que coincida con el nombre del campo
                            onBlur={formik.handleBlur}
                            disabled={!!mensajeExitoAlert}
                            disabled
                        >
                            {etiquetaEspecifica?.cat_negocios.map((seccion) => {
                                return (
                                    <MenuItem
                                        value={seccion.IdNegocioOK}
                                        key={seccion.IdNegocioOK}
                                    >
                                        {seccion.Alias}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <FormHelperText>
                            {formik.touched.IdNegocioOK && formik.errors.IdNegocioOK}
                        </FormHelperText>
                    </FormControl>

                    <TextField
                        id="IdOrdenOK"
                        label={`IdOrdenOK* [${dataRow.IdOrdenOK}]`}
                        value={formik.values.IdOrdenOK}
                        /* onChange={formik.handleChange} */
                        {...commonTextFieldProps}
                        error={formik.touched.IdOrdenOK && Boolean(formik.errors.IdOrdenOK)}
                        helperText={formik.touched.IdOrdenOK && formik.errors.IdOrdenOK}
                        disabled={true}
                    />

                    <TextField
                        id="IdOrdenBK"
                        label={`IdOrdenBK* [${dataRow.IdOrdenBK}]`}
                        value={formik.values.IdOrdenBK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdOrdenBK && Boolean(formik.errors.IdOrdenBK)}
                        helperText={formik.touched.IdOrdenBK && formik.errors.IdOrdenBK}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel
                            htmlFor="dynamic-select-tipo-orden">{`Tipo de Orden[${dataRow.IdTipoOrdenOK}]`}</InputLabel>
                        <Select
                            id="dynamic-select-tipo-orden"
                            value={formik.values.IdTipoOrdenOK}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="IdTipoOrdenOK"
                            aria-label="TipoOrden"
                        >
                            {TipoOrdenesValuesLabel.map((option, index) => (
                                <MenuItem key={option.IdValorOK} value={`IdTipoOrdenes-${option.key}`}>
                                    {option.IdValorOK}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="dynamic-select-rol">{`Rol [${dataRow.IdRolOK}]`}</InputLabel>
                        <Select
                            id="dynamic-select-rol"
                            value={formik.values.IdRolOK}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="IdRolOK"
                            aria-label="Rol"
                        >
                            {RolValuesLabel.map((option, index) => (
                                <MenuItem key={option.IdValorOK} value={`IdTipoRol-${option.key}`}>
                                    {option.IdValorOK}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Autocomplete
                        id="dynamic-autocomplete-persona"
                        options={PersonaValuesLabel}

                        getOptionLabel={(option) => option.IdValorOK}
                        value={PersonaValuesLabel.find((option) => option.key === formik.values.IdPersonaOK) || null}
                        onChange={(e, newValue) => {
                            formik.setFieldValue("IdPersonaOK", newValue ? newValue.key : "");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={`Selecciona una Persona ${dataRow.IdPersonaOK}`}
                                error={formik.touched.IdPersonaOK && Boolean(formik.errors.IdPersonaOK)}
                                helperText={formik.touched.IdPersonaOK && formik.errors.IdPersonaOK}
                            />
                        )}
                    />


                </DialogContent>
                {/* Aqui van las acciones del usuario como son las alertas o botones */}
                <DialogActions
                    sx={{display: 'flex', flexDirection: 'row'}}
                >
                    <Box m="auto">
                        {console.log("mensajeExitoAlert", mensajeExitoAlert)}
                        {console.log("mensajeErrorAlert", mensajeErrorAlert)}
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
                    {/* Boton de Cerrar. */}
                    <LoadingButton
                        color="secondary"
                        loadingPosition="start"
                        startIcon={<CloseIcon/>}
                        variant="outlined"
                        onClick={() => setPatchOrdenesShowModal(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                    {/* Boton de Guardar. */}
                    <LoadingButton
                        color="primary"
                        loadingPosition="start"
                        startIcon={<SaveIcon/>}
                        variant="contained"
                        //onClick={() => setAddInstituteShowModal(false)}
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
export default PatchOrdenesModal;