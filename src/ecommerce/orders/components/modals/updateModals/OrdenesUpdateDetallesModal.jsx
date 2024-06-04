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

const OrdenesUpdateDetallesModal = ({
                                        OrdenesUpdateDetallesShowModal,
                                        setUpdateOrdenesDetallesShowModal,
                                        datosSeleccionados,
                                        dataRow,
                                        fetchData
                                    }) => {

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
            IdProdServOK: dataRow.IdProdServOK,
            IdPresentaOK: dataRow.IdPresentaOK,
            DesPresentaPS: dataRow.DesPresentaPS,
            Cantidad: dataRow.Cantidad,
            PrecioUniSinIVA: dataRow.PrecioUniSinIVA,
            PrecioUniConIVA: dataRow.PrecioUniConIVA,
            PorcentajeIVA: dataRow.PorcentajeIVA,
            MontoUniIVA: dataRow.MontoUniIVA,
            SubTotalSinIVA: dataRow.SubTotalSinIVA,
            SubTotalConIVA: dataRow.SubTotalConIVA,
        },
        validationSchema: Yup.object({
            IdProdServOK: Yup.string().required("Campo requerido"),
            IdPresentaOK: Yup.string().required("Campo requerido"),
            DesPresentaPS: Yup.string().required("Campo requerido"),
            Cantidad: Yup.number().required("Campo requerido").moreThan(0, "Debe ser mayor a 0"),
            PrecioUniSinIVA: Yup.number().required("Campo requerido").moreThan(0, "Debe ser mayor a 0"),
            PrecioUniConIVA: Yup.number().required("Campo requerido").moreThan(0, "Debe ser mayor a 0"),
            PorcentajeIVA: Yup.number().required("Campo requerido").moreThan(0, "Debe ser mayor a 0"),
            MontoUniIVA: Yup.number().required("Campo requerido").moreThan(0, "Debe ser mayor a 0"),
            SubTotalSinIVA: Yup.number().required("Campo requerido").moreThan(0, "Debe ser mayor a 0"),
            SubTotalConIVA: Yup.number().required("Campo requerido").moreThan(0, "Debe ser mayor a 0"),
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

                // Actualizar la informacion del subdocumento
                for (let i = 0; i < ordenExistente.detalle_ps.length; i++) {
                    if (ordenExistente.detalle_ps[i].IdProdServOK === dataRow.IdProdServOK && ordenExistente.detalle_ps[i].IdPresentaOK === dataRow.IdPresentaOK) {
                        ordenExistente.detalle_ps[i].IdPresentaOK = values.IdPresentaOK;
                        ordenExistente.detalle_ps[i].DesPresentaPS = values.DesPresentaPS;
                        ordenExistente.detalle_ps[i].Cantidad = values.Cantidad;
                        ordenExistente.detalle_ps[i].PrecioUniSinIVA = values.PrecioUniSinIVA;
                        ordenExistente.detalle_ps[i].PrecioUniConIVA = values.PrecioUniConIVA;
                        ordenExistente.detalle_ps[i].PorcentajeIVA = values.PorcentajeIVA;
                        ordenExistente.detalle_ps[i].MontoUniIVA = values.MontoUniIVA;
                        ordenExistente.detalle_ps[i].SubTotalSinIVA = values.SubTotalSinIVA;
                        ordenExistente.detalle_ps[i].SubTotalConIVA = values.SubTotalConIVA;
                    }
                }

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);

                // Declarar estado de exito.
                setMensajeExitoAlert("Informacion actualizada exitosamente");

                // actualizar
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

    const {etiquetas, etiquetaEspecifica} = useProducts({IdProdServOK: formik.values.IdProdServOK || ""});

    return (
        <Dialog
            open={OrdenesUpdateDetallesShowModal}
            onClose={() => setUpdateOrdenesDetallesShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Actualizar un detalle de la orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>
                    <TextField
                        id="IdProdServOK"
                        label="IdProdServOK*"
                        value={formik.values.IdProdServOK}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.IdProdServOK &&
                            Boolean(formik.errors.IdProdServOK)
                        }
                        helperText={
                            formik.touched.IdProdServOK && formik.errors.IdProdServOK
                        }
                        disabled={true}
                    />
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
                            disabled={true}
                            value={formik.values.IdPresentaOK}
                            label="Selecciona una Pecentacion"
                            onChange={formik.handleChange}
                            name="IdPresentaOK" // Asegúrate de que coincida con el nombre del campo
                            onBlur={formik.handleBlur}
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
                        onClick={() => setUpdateOrdenesDetallesShowModal(false)}
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
export default OrdenesUpdateDetallesModal;