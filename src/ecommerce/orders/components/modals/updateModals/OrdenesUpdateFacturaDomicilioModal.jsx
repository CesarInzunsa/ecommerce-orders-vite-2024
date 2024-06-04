import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    TextField,
    DialogActions,
    Box,
    Alert
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import React, {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder.jsx";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";
import useProducts from "../../../services/remote/useProducts.jsx";

const OrdenesFacturaDomicilioModalUpdate = ({
                                                OrdenesFacturaDomicilioShowModalUpdate,
                                                setOrdenesFacturaDomicilioShowModalUpdate,
                                                datosSeleccionados,
                                                datosSecSubdocDetalles,
                                                dataRow,
                                                fetchData
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
            //Mostrar pantalla de carga
            setMensajeExitoAlert("");
            setMensajeErrorAlert("");
            setLoading(true);
            //limpiar mensajes
            setMensajeErrorAlert(null);
            setMensajeExitoAlert(null);
            try {
                // Desestructurar datos del documento seleccionado
                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;
                console.log("1");

                // Obtener la orden existente
                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);
                console.log("2");

                // Determinar el indice del subdocumento seleccionado
                const index = ordenExistente.factura.findIndex((elemento) => (
                    elemento.IdPersonaOK === datosSecSubdocDetalles.IdPersonaOK
                ));
                console.log("3");

                const indexDomicilio = ordenExistente.factura[index].domicilio.findIndex((domicilio) => (
                    domicilio.IdDomicilioOK === dataRow.IdDomicilioOK
                ));

                ordenExistente.factura[index].domicilio[indexDomicilio] = {
                    IdDomicilioOK: values.IdDomicilioOK,
                    CalleNumero: values.CalleNumero,
                    CodPostal: values.CodPostal,
                    Pais: values.Pais,
                    Estado: values.Estado,
                    Municipio: values.Municipio,
                    Localidad: values.Localidad,
                    Colonia: values.Colonia,
                }
                console.log("4");

                // Obtener los valores de la ventana modal

                console.log("5");
                // actualizar la orden
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ordenExistente);
                console.log("6");
                // Declarar estado de exito.
                setMensajeExitoAlert("Informacion actualizada exitosamente");
                console.log("7");

                fetchData();
            } catch (e) {
                console.log(e);
                setMensajeExitoAlert(null);
                setMensajeErrorAlert("Error al agregar la información")
            }
            //FIC: ocultamos el Loading.
            setLoading(false);
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
            open={OrdenesFacturaDomicilioShowModalUpdate}
            onClose={() => setOrdenesFacturaDomicilioShowModalUpdate(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Modificar dirección a la factura</strong>
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
                            setOrdenesFacturaDomicilioShowModalUpdate(false);
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
export default OrdenesFacturaDomicilioModalUpdate;