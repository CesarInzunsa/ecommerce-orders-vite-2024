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
import {GetAllInstitutes} from "../../../services/remote/get/GetAllInstitutes.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";

const OrdenesModal = ({PatchOrdenesShowModal, setPatchOrdenesShowModal, dataRow, fetchData}) => {

    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    const [TipoOrdenesValuesLabel, setTipoOrdenesValuesLabel] = useState([]);
    const [RolValuesLabel, setRolValuesLabel] = useState([]);
    const [PersonaValuesLabel, setPersonaValuesLabel] = useState([]);
    const [InstitutosValues, setInstitutosValues] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // Creamos un useEffect para que se ejecute cada vez que cambie el valor de IdInstitutoOK
    useEffect(() => {
        getLabelsByTipoOrdenes();
        getLabelsByRol();
        getPersonsByTipo();
        getInstitutos();
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

    // Función para obtener los institutos desde la base de datos de cat_institutos
    async function getInstitutos() {
        try {
            // Obtenemos los institutos
            const institutos = await GetAllInstitutes();
            // Comprueba si institutos es un array y si tiene datos
            if (Array.isArray(institutos) && institutos.length > 0) {
                // Mapeamos los valores para obtener un array de objetos con las propiedades Alias y key
                const IdValoresOK = institutos.map((valor, index) => ({
                    Alias: valor.Alias,
                    key: valor.IdInstitutoOK,
                }));
                // Actualizamos el estado de InstitutosValues
                setInstitutosValues(IdValoresOK);
            } else {
                console.log('El resultado de getInstitutos() no es un array o está vacío');
            }
        } catch (error) {
            console.error("Error al obtener getInstitutos:", error);
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
            IdInstitutoOK: Yup.string().required("Campo requerido"),
            IdNegocioOK: Yup.string().required("Campo requerido"),
            IdOrdenOK: Yup.string()
                .required("Campo requerido")
                .matches(
                    /^[a-zA-Z0-9-]+$/,
                    "Solo se permiten caracteres alfanuméricos"
                ),
            IdOrdenBK: Yup.string().required("Campo requerido"),
            IdTipoOrdenOK: Yup.string().required("Campo requerido"),
            IdRolOK: Yup.string().required("Campo requerido"),
            IdPersonaOK: Yup.string().required("Campo requerido"),
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
                // extraer los datos del renglon seleccionado
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = dataRow;
                // Buscar la orden
                const orderExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);
                // Actualizar la orderExistente con los valores de la ventana modal
                orderExistente.IdOrdenBK= order.IdOrdenBK;
                orderExistente.IdTipoOrdenOK= order.IdTipoOrdenOK;
                orderExistente.IdRolOK= order.IdRolOK;
                orderExistente.IdPersonaOK= order.IdPersonaOK;

                // Llamamos al servicio para agregar una nueva orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, orderExistente);
                // Si no hubo errores, mostramos el mensaje de exito.
                setMensajeExitoAlert("Orden actualizada correctamente");
                fetchData();
            } catch (e) {
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("No se pudo actualizar la orden");
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
                        <strong>Actualizar nueva orden</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent
                    sx={{display: 'flex', flexDirection: 'column'}}
                    dividers
                >
                    {/* Aqui van los campos de la ventana modal */}
                    <Autocomplete
                        id="dynamic-autocomplete-instituto"
                        options={InstitutosValues}
                        disabled={true}
                        getOptionLabel={(option) => option.Alias}
                        value={InstitutosValues.find((option) => option.key === formik.values.IdInstitutoOK) || null}
                        onChange={(e, newValue) => {
                            formik.setFieldValue("IdInstitutoOK", newValue ? newValue.key : "");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Selecciona un instituto"}
                                error={formik.touched.IdInstitutoOK && Boolean(formik.errors.IdInstitutoOK)}
                                helperText={formik.touched.IdInstitutoOK && formik.errors.IdInstitutoOK}
                            />
                        )}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Selecciona un Negocio</InputLabel>
                        <Select
                            value={formik.values.IdNegocioOK}
                            label="Selecciona una opción"
                            onChange={formik.handleChange}
                            name="IdNegocioOK" // Asegúrate de que coincida con el nombre del campo
                            onBlur={formik.handleBlur}
                            error={formik.touched.IdNegocioOK && Boolean(formik.errors.IdNegocioOK)}
                            helperText={formik.touched.IdNegocioOK && formik.errors.IdNegocioOK}
                            disabled={true}
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
                        label="IdOrdenOK*"
                        value={formik.values.IdOrdenOK}
                        /* onChange={formik.handleChange} */
                        {...commonTextFieldProps}
                        error={formik.touched.IdOrdenOK && Boolean(formik.errors.IdOrdenOK)}
                        helperText={formik.touched.IdOrdenOK && formik.errors.IdOrdenOK}
                        disabled={true}
                    />

                    <TextField
                        id="IdOrdenBK"
                        label="IdOrdenBK*"
                        value={formik.values.IdOrdenBK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdOrdenBK && Boolean(formik.errors.IdOrdenBK)}
                        helperText={formik.touched.IdOrdenBK && formik.errors.IdOrdenBK}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="dynamic-select-tipo-orden">Tipo de OrdenOK</InputLabel>
                        <Select
                            id="dynamic-select-tipo-orden"
                            value={formik.values.IdTipoOrdenOK}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="IdTipoOrdenOK"
                            aria-label="TipoOrden"
                            error={formik.touched.IdTipoOrdenOK && Boolean(formik.errors.IdTipoOrdenOK)}
                            helperText={formik.touched.IdTipoOrdenOK && formik.errors.IdTipoOrdenOK}
                        >
                            {TipoOrdenesValuesLabel.map((option, index) => (
                                <MenuItem key={option.IdValorOK} value={`IdTipoOrdenes-${option.key}`}>
                                    {option.IdValorOK}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="dynamic-select-rol">Rol</InputLabel>
                        <Select
                            id="dynamic-select-rol"
                            value={formik.values.IdRolOK}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="IdRolOK"
                            aria-label="Rol"
                            error={formik.touched.IdRolOK && Boolean(formik.errors.IdRolOK)}
                            helperText={formik.touched.IdRolOK && formik.errors.IdRolOK}
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
                                label={"Selecciona una Persona"}
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
export default OrdenesModal;