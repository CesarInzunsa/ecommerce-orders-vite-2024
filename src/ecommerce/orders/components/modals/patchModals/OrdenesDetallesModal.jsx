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
import React, {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
import {OrdenesDetallesValues} from "../../../helpers/OrdenesDetallesValues.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
import useProducts from "../../../services/remote/useProducts";
import MyAutoComplete from "../../../../../share/components/elements/atomos/MyAutoComplete";
import Tooltip from "@mui/material/Tooltip";

const OrdenesDetallesModal = ({OrdenesDetallesShowModal, setOrdenesDetallesShowModal, datosSeleccionados}) => {

    // Declarar estados para las alertas de éxito y error
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    // Hook para manejar el estado de carga
    const [Loading, setLoading] = useState(false);

    // Hook para refrescar el componente
    const [refresh, setRefresh] = useState(false);

    // Hook para valores de labels y etiquetas
    const [isNuevaEtiqueta, setINuevaEtiqueta] = React.useState(false);

    useEffect(() => {
        console.log("isNuevaEtiqueta", isNuevaEtiqueta);
    }, [isNuevaEtiqueta]);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdProdServOK: "",
            IdPresentaOK: "",
            DesPresentaPS: "",
            Cantidad: "1",
            PrecioUniSinIVA: "",
            PrecioUniConIVA: "",
            PorcentajeIVA: "16",
            MontoUniIVA: "",
            SubTotalSinIVA: "",
            SubTotalConIVA: "",
        },
        validationSchema: Yup.object({
            IdProdServOK: Yup.string().required("Campo requerido"),
            IdPresentaOK: Yup.string().required("Campo requerido"),
            DesPresentaPS: Yup.string().required("Campo requerido"),
            Cantidad: Yup.string().required("Campo requerido"),
            PrecioUniSinIVA: Yup.string().required("Campo requerido"),
            PrecioUniConIVA: Yup.string().required("Campo requerido"),
            PorcentajeIVA: Yup.string().required("Campo requerido"),
            MontoUniIVA: Yup.string().required("Campo requerido"),
            SubTotalSinIVA: Yup.string().required("Campo requerido"),
            SubTotalConIVA: Yup.string().required("Campo requerido"),
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
                const ordenDetalleExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // Obtener los valores de la ventana modal
                const DetalleOrdenes = OrdenesDetallesValues(values, ordenDetalleExistente);

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, DetalleOrdenes);

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

    const {etiquetas, etiquetaEspecifica} = useProducts({IdProdServOK: formik.values.IdProdServOK || ""});

    return (
        <Dialog
            open={OrdenesDetallesShowModal}
            onClose={() => setOrdenesDetallesShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Agregar Nuevo Detalle a la orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>
                    <Stack direction="row" alignItems="center">
                        <MyAutoComplete
                            disabled={!!mensajeExitoAlert || isNuevaEtiqueta}
                            label={"Selecciona un Producto"}
                            options={etiquetas} //Arreglo de objetos
                            displayProp="IdProdServOK" // Propiedad a mostrar
                            idProp="IdProdServOK" // Propiedad a guardar al dar clic
                            onSelectValue={(selectedValue) => {
                                console.log("Selección:", selectedValue);
                                formik.values.DesPresentaPS = selectedValue
                                    ? selectedValue?.DesProdServ
                                    : "";
                                formik.values.IdProdServOK = selectedValue
                                    ? selectedValue?.IdProdServOK
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
                        id="DesPresentaPS"
                        label="DesPresentaPS*"
                        value={formik.values.DesPresentaPS}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.DesPresentaPS &&
                            Boolean(formik.errors.DesPresentaPS)
                        }
                        helperText={
                            formik.touched.DesPresentaPS && formik.errors.DesPresentaPS
                        }
                        disabled={true}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Selecciona una presentacion</InputLabel>
                        <Select
                            value={formik.values.IdPresentaOK}
                            label="Selecciona una Pecentacion"
                            onChange={formik.handleChange}
                            name="IdPresentaOK" // Asegúrate de que coincida con el nombre del campo
                            onBlur={formik.handleBlur}
                            disabled={!!mensajeExitoAlert}
                        >
                            {etiquetaEspecifica?.cat_prod_serv_presenta.map((seccion) => {
                                return (
                                    <MenuItem
                                        value={`${seccion.IdPresentaOK}`}
                                        key={seccion.IdPresentaOK}
                                    >
                                        {seccion.DesPresenta}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <FormHelperText>
                            {formik.touched.IdPresentaOK && formik.errors.IdPresentaOK}
                        </FormHelperText>
                    </FormControl>
                    <TextField
                        id="Cantidad"
                        label="Cantidad*"
                        value={formik.values.Cantidad}
                        onChange={(e) => {
                            const cantidad = e.target.value;
                            const nuevoValor = formik.values.PrecioUniSinIVA ?? 1;
                            const nuevoPrecioUniConIVA = nuevoValor * 0.16 || "";
                            const PrecioUniConIVAt = parseFloat(nuevoPrecioUniConIVA) + parseFloat(nuevoValor) || 0;

                            const SubTotalSinIVAt = cantidad * parseFloat(nuevoValor);
                            const SubTotalConIVAt = cantidad * PrecioUniConIVAt;

                            formik.setValues({
                                ...formik.values,
                                Cantidad: cantidad,
                                SubTotalSinIVA: SubTotalSinIVAt,
                                SubTotalConIVA: SubTotalConIVAt
                            });
                        }}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.Cantidad &&
                            Boolean(formik.errors.Cantidad)
                        }
                        helperText={
                            formik.touched.Cantidad && formik.errors.Cantidad
                        }
                    />
                    <div style={{margin: '10px 0'}}></div>
                    <TextField
                        id="PrecioUniSinIVA"
                        label="PrecioUniSinIVA*"
                        value={formik.values.PrecioUniSinIVA}
                        onChange={(e) => {
                            const nuevoValor = e.target.value;
                            const nuevoPrecioUniConIVA = nuevoValor * 0.16 || "";
                            const PrecioUniConIVAt = parseFloat(nuevoPrecioUniConIVA) + parseFloat(nuevoValor) || 0;
                            const cantidad = formik.values.Cantidad ?? 1;

                            const SubTotalSinIVAt = cantidad * parseFloat(nuevoValor);
                            const SubTotalConIVAt = cantidad * PrecioUniConIVAt;

                            formik.setValues({
                                ...formik.values,
                                PrecioUniSinIVA: nuevoValor,
                                PrecioUniConIVA: PrecioUniConIVAt,
                                MontoUniIVA: PrecioUniConIVAt,
                                SubTotalSinIVA: SubTotalSinIVAt,
                                SubTotalConIVA: SubTotalConIVAt
                            });
                        }}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.PrecioUniSinIVA &&
                            Boolean(formik.errors.PrecioUniSinIVA)
                        }
                        helperText={
                            formik.touched.PrecioUniSinIVA && formik.errors.PrecioUniSinIVA
                        }
                    />
                    <TextField
                        id="PrecioUniConIVA"
                        label="PrecioUniConIVA*"
                        value={formik.values.PrecioUniConIVA}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.PrecioUniConIVA &&
                            Boolean(formik.errors.PrecioUniConIVA)
                        }
                        helperText={
                            formik.touched.PrecioUniConIVA && formik.errors.PrecioUniConIVA
                        }
                        disabled={true}
                    />
                    <TextField
                        id="PorcentajeIVA"
                        label="PorcentajeIVA*"
                        value={formik.values.PorcentajeIVA}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.PorcentajeIVA &&
                            Boolean(formik.errors.PorcentajeIVA)
                        }
                        helperText={
                            formik.touched.PorcentajeIVA && formik.errors.PorcentajeIVA
                        }
                        disabled={true}
                    />
                    <TextField
                        id="MontoUniIVA"
                        label="MontoUniIVA*"
                        value={formik.values.MontoUniIVA}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.MontoUniIVA &&
                            Boolean(formik.errors.MontoUniIVA)
                        }
                        helperText={
                            formik.touched.MontoUniIVA && formik.errors.MontoUniIVA
                        }
                    />
                    <TextField
                        id="SubTotalSinIVA"
                        label="SubTotalSinIVA*"
                        value={formik.values.SubTotalSinIVA}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.SubTotalSinIVA &&
                            Boolean(formik.errors.SubTotalSinIVA)
                        }
                        helperText={
                            formik.touched.SubTotalSinIVA && formik.errors.SubTotalSinIVA
                        }
                    />
                    <TextField
                        id="SubTotalConIVA"
                        label="SubTotalConIVA*"
                        value={formik.values.SubTotalConIVA}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.SubTotalConIVA &&
                            Boolean(formik.errors.SubTotalConIVA)
                        }
                        helperText={
                            formik.touched.SubTotalConIVA && formik.errors.SubTotalConIVA
                        }
                        disabled={true}
                    />
                    {/* Agregar el resto de los campos aquí */}
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
                        onClick={() => setOrdenesDetallesShowModal(false)}
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
export default OrdenesDetallesModal;