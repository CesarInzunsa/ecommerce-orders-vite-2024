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
import React, {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import useProducts from "../../../services/remote/useProducts.jsx";

const OrdenesFacturaDomicilioModalDetails = ({
                                                 OrdenesFacturaDomicilioShowModalDetails,
                                                 setOrdenesFacturaDomicilioShowModalDetails,
                                                 dataRow
                                             }) => {

    // Declarar estados para las alertas de éxito y error
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");

    //Manejar estado de carga
    const [Loading, setLoading] = useState(false);
    //Refrescar el componente
    const [refresh, setRefresh] = useState(false);
    //Labels y etiquetas
    const [isNuevaEtiqueta, setNuevaEtiqueta] = React.useState(false);
    //Recuperar la data del doc. completo

    useEffect(() => {
        console.log("isNuevaEtiqueta", isNuevaEtiqueta);
    }, [isNuevaEtiqueta]);

    const formik = useFormik({
        initialValues: {
            IdDomicilioOK: dataRow.IdDomicilioOK || "",
            CalleNumero: dataRow.CalleNumero || "",
            CodPostal: dataRow.CodPostal || "",
            Pais: dataRow.Pais || "",
            Estado: dataRow.Estado || "",
            Municipio: dataRow.Municipio || "",
            Localidad: dataRow.Localidad || "",
            Colonia: dataRow.Colonia || "",
        },
        validationSchema: Yup.object({
            IdDomicilioOK: Yup.string().required("Campo requerido"),
            CalleNumero: Yup.string().required("Campo requerido"),
            CodPostal: Yup.string().required("Campo requerido"),
            Pais: Yup.string().required("Campo requerido"),
            Estado: Yup.string().required("Campo requerido"),
            Municipio: Yup.string().required("Campo requerido"),
            Localidad: Yup.string().required("Campo requerido"),
            Colonia: Yup.string().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
        },
    });

    //Props correspondientes a la estructura
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
            open={OrdenesFacturaDomicilioShowModalDetails}
            onClose={() => setOrdenesFacturaDomicilioShowModalDetails(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Información de la dirección a la factura</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: "flex", flexDirection: "column"}} dividers>

                    <TextField
                        id="IdDomicilioOK"
                        label="IdDomicilioOK*"
                        value={formik.values.IdDomicilioOK}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.IdDomicilioOK &&
                            Boolean(formik.errors.IdDomicilioOK)
                        }
                        helperText={
                            formik.touched.IdDomicilioOK && formik.errors.IdDomicilioOK
                        }
                        disabled={true}

                    />
                    <TextField
                        id="CalleNumero"
                        label="CalleNumero*"
                        value={formik.values.CalleNumero}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.CalleNumero &&
                            Boolean(formik.errors.CalleNumero)
                        }
                        helperText={
                            formik.touched.CalleNumero && formik.errors.CalleNumero
                        }
                        disabled={true}
                    />
                    <TextField
                        id="CodPostal"
                        label="CodPostal*"
                        value={formik.values.CodPostal}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.CodPostal &&
                            Boolean(formik.errors.CodPostal)
                        }
                        helperText={
                            formik.touched.CodPostal && formik.errors.CodPostal
                        }
                        disabled={true}
                    />
                    <TextField
                        id="Pais"
                        label="Pais*"
                        value={formik.values.Pais}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.Pais &&
                            Boolean(formik.errors.Pais)
                        }
                        helperText={
                            formik.touched.Pais && formik.errors.Pais
                        }
                        disabled={true}
                    />
                    <TextField
                        id="Estado"
                        label="Estado*"
                        value={formik.values.Estado}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.Estado &&
                            Boolean(formik.errors.Estado)
                        }
                        helperText={
                            formik.touched.Estado && formik.errors.Estado
                        }
                        disabled={true}
                    />
                    <TextField
                        id="Municipio"
                        label="Municipio*"
                        value={formik.values.Municipio}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.Municipio &&
                            Boolean(formik.errors.Municipio)
                        }
                        helperText={
                            formik.touched.Municipio && formik.errors.Municipio
                        }
                        disabled={true}
                    />
                    <TextField
                        id="Localidad"
                        label="Localidad*"
                        value={formik.values.Localidad}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.Localidad &&
                            Boolean(formik.errors.Localidad)
                        }
                        helperText={
                            formik.touched.Localidad && formik.errors.Localidad
                        }
                        disabled={true}
                    />
                    <TextField
                        id="Colonia"
                        label="Colonia*"
                        value={formik.values.Colonia}
                        {...commonTextFieldProps}
                        error={
                            formik.touched.Colonia &&
                            Boolean(formik.errors.Colonia)
                        }
                        helperText={
                            formik.touched.Colonia && formik.errors.Colonia
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
                        onClick={() => {
                            setOrdenesFacturaDomicilioShowModalDetails(false);
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

                </DialogActions>
            </form>
        </Dialog>
    );


};
export default OrdenesFacturaDomicilioModalDetails;