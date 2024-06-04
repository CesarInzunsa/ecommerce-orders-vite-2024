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
    FormControlLabel
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {OrdenesEnviosProductosValues} from "../../../helpers/OrdenesEnviosProductosValues.jsx";
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
import {PutOneOrder} from "../../../services/remote/put/PutOneOrder.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
import {GetAllLabels} from "../../../services/remote/get/GetAllLabels";
import {GetAllProdServ} from "../../../services/remote/get/GetAllProdServ.jsx";

const OrdenesFacturaProductosModal = ({
                                          OrdenesFacturaProductosShowModal,
                                          setOrdenesFacturaProductosShowModal,
                                          datosSeleccionados,
                                          datosSecSubdoc,
                                          fetchData
                                      }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    const [OrdenesValuesLabel, setOrdenesValuesLabel] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdProdServOK: "",
            IdPresentaOK: "",
            Cantidad: 0,
            PrecioUnitario: 0,
        },
        validationSchema: Yup.object({
            IdProdServOK: Yup.string().required("IdProdServOK es requerido"),
            IdPresentaOK: Yup.string().required("IdPresentaOK es requerido"),
            Cantidad: Yup.number().required("La cantidad es requerida"),
            PrecioUnitario: Yup.number().required("El Precio Unitario es requerido"),
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
                //Se desestructuran los datos del documento seleccionado
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                //Obtener la orden seleccionada
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                // obtener el indice de la factura
                const indexFactura = ordenExistente.factura.findIndex((value) => {
                    return value.IdPersonaOK === datosSecSubdoc.IdPersonaOK;
                });

                // crear un nuevo producto

                ordenExistente.factura[indexFactura].productos.push({
                    IdProdServOK: values.IdProdServOK,
                    IdPresentaOK: values.IdPresentaOK,
                    Cantidad: values.Cantidad,
                    PrecioUnitario: values.PrecioUnitario,
                    descuentos: []
                });


                // actualizar la data
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);
                setMensajeExitoAlert("Producto insertado");

                fetchData();
            } catch (e) {
                //console.log(ProductosOrdenes);
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


    return (
        <Dialog
            open={OrdenesFacturaProductosShowModal}
            onClose={() => setOrdenesFacturaProductosShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Agregar Nuevo Producto a la factura</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}} dividers>
                    {/* FIC: Campos de captura o selección */}

                    <TextField
                        id="IdProdServOK"
                        label="IdProdServOK*"
                        value={formik.values.IdProdServOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdProdServOK && Boolean(formik.errors.IdProdServOK)}
                        helperText={formik.touched.IdProdServOK && formik.errors.IdProdServOK}
                    />
                    <TextField
                        id="IdPresentaOK"
                        label="IdPresentaOK*"
                        value={formik.values.IdPresentaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdPresentaOK && Boolean(formik.errors.IdPresentaOK)}
                        helperText={formik.touched.IdPresentaOK && formik.errors.IdPresentaOK}
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
                        id="PrecioUnitario"
                        label="PrecioUnitario*"
                        value={formik.values.PrecioUnitario}
                        {...commonTextFieldProps}
                        error={formik.touched.PrecioUnitario && Boolean(formik.errors.PrecioUnitario)}
                        helperText={formik.touched.PrecioUnitario && formik.errors.PrecioUnitario}
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
                        onClick={() => setOrdenesFacturaProductosShowModal(false)}
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
export default OrdenesFacturaProductosModal;
