// Importar react components
import {useEffect, useState} from "react";
// Importar material ui components
import {Dialog, DialogContent, DialogTitle, Typography, TextField, DialogActions, Box, Alert} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
//FIC: Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";
// Importar Services
import {AddOneOrder} from "../../../services/remote/post/AddOneOrder.jsx";
// Importar Helpers
import {ordersValues} from "../../../helpers/ordersValues.jsx";
// importar el generador de ID
import {v4 as genID} from "uuid";

const AddOrdenesModal = ({AddProductShowModal, setAddProductShowModal}) => {

    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    const [IdGen, setIdGen] = useState(genID().replace(/-/g, "").substring(0, 12));

    // Creamos un useEffect para que se ejecute cada vez que cambie el valor de IdInstitutoOK
    useEffect(() => {
        setIdGen(genID().replace(/-/g, "").substring(0, 12));
    }, []);

    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdInstitutoOK: "",
            IdNegocioOK: "",
            IdOrdenOK: "",
            IdOrdenBK: "",
            IdTipoOrdenOK: "",
            IdRolOK: "",
            IdPersonaOK: "",
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
                //FIC: Extraer los datos de los campos de la ventana modal que ya tiene Formik.
                const order = ordersValues(values);
                // Llamamos al servicio para agregar una nueva orden
                await AddOneOrder(order);
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
            open={AddProductShowModal}
            onClose={() => setAddProductShowModal(false)}
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography component="h6">
                        <strong>Agregar nueva orden</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent
                    sx={{display: 'flex', flexDirection: 'column'}}
                    dividers
                >
                    <TextField
                        id="IdInstitutoOK"
                        label="IdInstitutoOK*"
                        value={formik.values.IdInstitutoOK}
                        /* onChange={formik.handleChange} */
                        {...commonTextFieldProps}
                        error={formik.touched.IdInstitutoOK && Boolean(formik.errors.IdInstitutoOK)}
                        helperText={formik.touched.IdInstitutoOK && formik.errors.IdInstitutoOK}
                    />
                    <TextField
                        id="IdProdServBK"
                        label="IdProdServBK*"
                        value={formik.values.IdProdServBK}
                        /* onChange={formik.handleChange} */
                        {...commonTextFieldProps}
                        error={formik.touched.IdProdServBK && Boolean(formik.errors.IdProdServBK)}
                        helperText={formik.touched.IdProdServBK && formik.errors.IdProdServBK}
                    />
                    <TextField
                        id="CodigoBarras"
                        label="CodigoBarras*"
                        value={formik.values.CodigoBarras}
                        /* onChange={formik.handleChange} */
                        {...commonTextFieldProps}
                        error={formik.touched.CodigoBarras && Boolean(formik.errors.CodigoBarras)}
                        helperText={formik.touched.CodigoBarras && formik.errors.CodigoBarras}
                    />
                    <TextField
                        id="DesProdServ"
                        label="DesProdServ*"
                        value={formik.values.DesProdServ}
                        /* onChange={formik.handleChange} */
                        {...commonTextFieldProps}
                        error={formik.touched.DesProdServ && Boolean(formik.errors.DesProdServ)}
                        helperText={formik.touched.DesProdServ && formik.errors.DesProdServ}
                    />
                    <TextField
                        id="Indice"
                        label="Indice*"
                        value={formik.values.Indice}
                        /* onChange={formik.handleChange} */
                        {...commonTextFieldProps}
                        error={formik.touched.Indice && Boolean(formik.errors.Indice)}
                        helperText={formik.touched.Indice && formik.errors.Indice}
                    />
                </DialogContent>
                {/* FIC: Aqui van las acciones del usuario como son las alertas o botones */}
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
                    {/* FIC: Boton de Cerrar. */}
                    <LoadingButton
                        color="secondary"
                        loadingPosition="start"
                        startIcon={<CloseIcon/>}
                        variant="outlined"
                        onClick={() => setAddProductShowModal(false)}
                    >
                        <span>CERRAR</span>
                    </LoadingButton>
                    {/* FIC: Boton de Guardar. */}
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
export default AddOrdenesModal;