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
//import {OrdenesEnviosProductosValues} from "../../../helpers/OrdenesEnviosProductosValues.jsx";
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
//import {PutOneOrder} from "../../../services/remote/put/PutOneOrder.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
//import {GetAllLabels} from "../../../services/remote/get/GetAllLabels";
import {GetAllProdServ} from "../../../services/remote/get/GetAllProdServ.jsx";

const OrdenesUpdateEnviosProductosModal = ({
                                               OrdenesUpdateEnviosProductosShowModal,
                                               setOrdenesUpdateEnviosProductosShowModal,
                                               datosSeleccionados,
                                               datosSecSubdocEnvios,
                                               dataRow,
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
            IdProdServOK: dataRow?.IdProdServOK || "",
            IdPresentaOK: dataRow?.IdPresentaOK || "",
            DesProdServ: dataRow?.DesProdServ || "",
            DesPresenta: dataRow?.DesPresenta || "",
            CantidadPed: dataRow?.CantidadPed || 0,
            CantidadEnt: dataRow?.CantidadEnt || 0,
        },
        validationSchema: Yup.object({
            DesProdServ: Yup.string().required("El producto es requerido"),
            DesPresenta: Yup.string().required("La presentación es requerida"),
            CantidadPed: Yup.number().required("La cantidad pedida es requerida"),
            CantidadEnt: Yup.number().required("La cantidad entregada es requerida"),
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

                // Determinar el indice del subdocumento seleccionado
                const index = ordenExistente.envios.findIndex((elemento) => (
                    elemento.IdDomicilioOK === datosSecSubdocEnvios.IdDomicilioOK && elemento.IdPaqueteriaOK === datosSecSubdocEnvios.IdPaqueteriaOK
                ));

                // determinar el indice del subdocumento de productos seleccionado
                const indexProducto = ordenExistente.envios[index].productos.findIndex((elemento) => (
                    elemento.IdProdServOK === dataRow.IdProdServOK && elemento.IdPresentaOK === dataRow.IdPresentaOK
                ));

                // actualizar el campo
                ordenExistente.envios[index].productos[indexProducto] = {
                    IdProdServOK: values.IdProdServOK,
                    IdPresentaOK: values.IdPresentaOK,
                    DesProdServ: values.DesProdServ,
                    DesPresenta: values.DesPresenta,
                    CantidadPed: values.CantidadPed,
                    CantidadEnt: values.CantidadEnt
                }

                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente); //se puede sacar el objectid con row._id para lo del fic aaaaaaaaaaaaaaaaaaa
                setMensajeExitoAlert("Producto actualizado Correctamente");
                fetchData();
            } catch (e) {
                //console.log(ProductosOrdenes);
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("No se pudo Actualizar");
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
            open={OrdenesUpdateEnviosProductosShowModal}
            onClose={() => setOrdenesUpdateEnviosProductosShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Editar Producto del Envio</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}} dividers>
                    <TextField
                        id="IdProdServOK"
                        label="IdProdServOK*"
                        value={formik.values.IdProdServOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdProdServOK && Boolean(formik.errors.IdProdServOK)}
                        helperText={formik.touched.IdProdServOK && formik.errors.IdProdServOK}
                        disabled={true}
                    />
                    <TextField
                        id="IdPresentaOK"
                        label="IdPresentaOK*"
                        value={formik.values.IdPresentaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdPresentaOK && Boolean(formik.errors.IdPresentaOK)}
                        helperText={formik.touched.IdPresentaOK && formik.errors.IdPresentaOK}
                        disabled={true}
                    />
                    <TextField
                        id="DesProdServ"
                        label="DesProdServ*"
                        value={formik.values.DesProdServ}
                        {...commonTextFieldProps}
                        error={formik.touched.DesProdServ && Boolean(formik.errors.DesProdServ)}
                        helperText={formik.touched.DesProdServ && formik.errors.DesProdServ}
                        disabled={true}
                    />
                    <TextField
                        id="DesPresenta"
                        label="DesPresenta*"
                        value={formik.values.DesPresenta}
                        {...commonTextFieldProps}
                        error={formik.touched.DesPresenta && Boolean(formik.errors.DesPresenta)}
                        helperText={formik.touched.DesPresenta && formik.errors.DesPresenta}
                        disabled={true}
                    />
                    <TextField
                        id="CantidadPed"
                        label="Cantidad Pedida*"
                        value={formik.values.CantidadPed}
                        {...commonTextFieldProps}
                        error={formik.touched.CantidadPed && Boolean(formik.errors.CantidadPed)}
                        helperText={formik.touched.CantidadPed && formik.errors.CantidadPed}
                    />
                    <TextField
                        id="CantidadEnt"
                        label="Cantidad Entregada*"
                        value={formik.values.CantidadEnt}
                        {...commonTextFieldProps}
                        error={formik.touched.CantidadEnt && Boolean(formik.errors.CantidadEnt)}
                        helperText={formik.touched.CantidadEnt && formik.errors.CantidadEnt}
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
                        onClick={() => setOrdenesUpdateEnviosProductosShowModal(false)}
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
export default OrdenesUpdateEnviosProductosModal;
