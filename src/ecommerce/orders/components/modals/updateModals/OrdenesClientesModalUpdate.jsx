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
import SaveIcon from "@mui/icons-material/Save";
import React, {useState, useEffect} from "react";

// Formik - Yup
import {useFormik} from "formik";
import * as Yup from "yup";

//HELPERS
import {OrdenesInfoAdValues} from "../../../helpers/OrdenesInfoAdValues.jsx";
import {UpdatePatchOneOrder} from "../../../services/remote/put/UpdatePatchOneOrder";
import {GetOneOrder} from "../../../services/remote/get/GetOneOrder.jsx";

const OrdenesClientesModalUpdate = ({
                                        OrdenesClientesShowModalUpdate,
                                        setOrdenesClientesShowModalUpdate,
                                        datosSeleccionados,
                                        dataRow,
                                        fetchData
                                    }) => {
    const [mensajeErrorAlert, setMensajeErrorAlert] = useState("");
    const [mensajeExitoAlert, setMensajeExitoAlert] = useState("");
    const [Loading, setLoading] = useState(false);
    //Para ver la data que trae el documento completo desde el dispatch de ShippingsTable
    //FIC: Definition Formik y Yup.
    const formik = useFormik({
        initialValues: {
            IdUsuarioOK: dataRow?.IdUsuarioOK || "",
            IdPersonaOK: dataRow?.IdPersonaOK || "",
            Usuario: dataRow?.Usuario || "",
            Alias: dataRow?.Alias || "",
            Nombre: dataRow?.Nombre || "",
            ApParterno: dataRow?.ApParterno || "",
            ApMaterno: dataRow?.ApMaterno || "",
            FullUserName: dataRow?.FullUserName || "",
            RFC: dataRow?.RFC || "",
            CURP: dataRow?.CURP || "",
            Sexo: dataRow?.Sexo || "",
            IdTipoPersonaOK: dataRow?.IdTipoPersonaOK || "",
            FechaNac: dataRow?.FechaNac || "",
            IdTipoEstatusOK: dataRow?.IdTipoEstatusOK || "",
            IdRolActualOK: dataRow?.IdRolActualOK || "",
            IdRolPrincipalOK: dataRow?.IdRolPrincipalOK || "",
            FotoPerfil: dataRow?.FotoPerfil || "",
            Email: dataRow?.Email || "",
            TelMovil: dataRow?.TelMovil || "",
        },
        validationSchema: Yup.object({
            IdUsuarioOK: Yup.string().required("Campo requerido"),
            IdPersonaOK: Yup.string().required("Campo requerido"),
            Usuario: Yup.string().required("Campo requerido"),
            Alias: Yup.string().required("Campo requerido"),
            Nombre: Yup.string().required("Campo requerido"),
            ApParterno: Yup.string().required("Campo requerido"),
            ApMaterno: Yup.string().required("Campo requerido"),
            FullUserName: Yup.string().required("Campo requerido"),
            RFC: Yup.string().required("Campo requerido"),
            CURP: Yup.string().required("Campo requerido"),
            Sexo: Yup.string().required("Campo requerido"),
            IdTipoPersonaOK: Yup.string().required("Campo requerido"),
            FechaNac: Yup.string().required("Campo requerido"),
            IdTipoEstatusOK: Yup.string().required("Campo requerido"),
            IdRolActualOK: Yup.string().required("Campo requerido"),
            IdRolPrincipalOK: Yup.string().required("Campo requerido"),
            FotoPerfil: Yup.string().required("Campo requerido"),
            Email: Yup.string().required("Campo requerido").email("Email inválido"),
            TelMovil: Yup.string().required("Campo requerido"),
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

                const {IdInstitutoOK, IdNegocioOK, IdOrdenOK} = datosSeleccionados;

                const ordenExistente = await GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK);

                ordenExistente.cliente = {
                    IdUsuarioOK: values.IdUsuarioOK,
                    IdPersonaOK: values.IdPersonaOK,
                    Usuario: values.Usuario,
                    Alias: values.Alias,
                    Nombre: values.Nombre,
                    ApParterno: values.ApParterno,
                    ApMaterno: values.ApMaterno,
                    FullUserName: values.FullUserName,
                    RFC: values.RFC,
                    CURP: values.CURP,
                    Sexo: values.Sexo,
                    IdTipoPersonaOK: values.IdTipoPersonaOK,
                    FechaNac: values.FechaNac,
                    IdTipoEstatusOK: values.IdTipoEstatusOK,
                    IdRolActualOK: values.IdRolActualOK,
                    IdRolPrincipalOK: values.IdRolPrincipalOK,
                    FotoPerfil: values.FotoPerfil,
                    Email: values.Email,
                    TelMovil: values.TelMovil,
                }

                const info_ad_data = OrdenesInfoAdValues(values, ordenExistente);

                //console.log("<<Ordenes info ad>>", info_ad_data);
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, info_ad_data);

                setMensajeExitoAlert("Cliente creado y guardada Correctamente");

                fetchData();
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

    return (
        <Dialog
            open={OrdenesClientesShowModalUpdate}
            onClose={() => setOrdenesClientesShowModalUpdate(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Actualizar cliente a la Orden</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent
                    sx={{display: 'flex', flexDirection: 'column'}}
                    dividers
                >
                    <TextField
                        id="IdUsuarioOK"
                        label="IdUsuarioOK*"
                        value={formik.values.IdUsuarioOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdUsuarioOK && Boolean(formik.errors.IdUsuarioOK)}
                        helperText={formik.touched.IdUsuarioOK && formik.errors.IdUsuarioOK}
                    />

                    <TextField
                        id="IdPersonaOK"
                        label="IdPersonaOK*"
                        value={formik.values.IdPersonaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdPersonaOK && Boolean(formik.errors.IdPersonaOK)}
                        helperText={formik.touched.IdPersonaOK && formik.errors.IdPersonaOK}
                    />

                    <TextField
                        id="Usuario"
                        label="Usuario*"
                        value={formik.values.Usuario}
                        {...commonTextFieldProps}
                        error={formik.touched.Usuario && Boolean(formik.errors.Usuario)}
                        helperText={formik.touched.Usuario && formik.errors.Usuario}
                    />

                    <TextField
                        id="Alias"
                        label="Alias*"
                        value={formik.values.Alias}
                        {...commonTextFieldProps}
                        error={formik.touched.Alias && Boolean(formik.errors.Alias)}
                        helperText={formik.touched.Alias && formik.errors.Alias}
                    />

                    <TextField
                        id="Nombre"
                        label="Nombre*"
                        value={formik.values.Nombre}
                        {...commonTextFieldProps}
                        error={formik.touched.Nombre && Boolean(formik.errors.Nombre)}
                        helperText={formik.touched.Nombre && formik.errors.Nombre}
                    />

                    <TextField
                        id="ApParterno"
                        label="ApParterno*"
                        value={formik.values.ApParterno}
                        {...commonTextFieldProps}
                        error={formik.touched.ApParterno && Boolean(formik.errors.ApParterno)}
                        helperText={formik.touched.ApParterno && formik.errors.ApParterno}
                    />

                    <TextField
                        id="ApMaterno"
                        label="ApMaterno*"
                        value={formik.values.ApMaterno}
                        {...commonTextFieldProps}
                        error={formik.touched.ApMaterno && Boolean(formik.errors.ApMaterno)}
                        helperText={formik.touched.ApMaterno && formik.errors.ApMaterno}
                    />

                    <TextField
                        id="FullUserName"
                        label="FullUserName*"
                        value={formik.values.FullUserName}
                        {...commonTextFieldProps}
                        error={formik.touched.FullUserName && Boolean(formik.errors.FullUserName)}
                        helperText={formik.touched.FullUserName && formik.errors.FullUserName}
                    />

                    <TextField
                        id="RFC"
                        label="RFC*"
                        value={formik.values.RFC}
                        {...commonTextFieldProps}
                        error={formik.touched.RFC && Boolean(formik.errors.RFC)}
                        helperText={formik.touched.RFC && formik.errors.RFC}
                    />

                    <TextField
                        id="CURP"
                        label="CURP*"
                        value={formik.values.CURP}
                        {...commonTextFieldProps}
                        error={formik.touched.CURP && Boolean(formik.errors.CURP)}
                        helperText={formik.touched.CURP && formik.errors.CURP}
                    />

                    <TextField
                        id="Sexo"
                        label="Sexo*"
                        value={formik.values.Sexo}
                        {...commonTextFieldProps}
                        error={formik.touched.Sexo && Boolean(formik.errors.Sexo)}
                        helperText={formik.touched.Sexo && formik.errors.Sexo}
                    />

                    <TextField
                        id="IdTipoPersonaOK"
                        label="IdTipoPersonaOK*"
                        value={formik.values.IdTipoPersonaOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoPersonaOK && Boolean(formik.errors.IdTipoPersonaOK)}
                        helperText={formik.touched.IdTipoPersonaOK && formik.errors.IdTipoPersonaOK}
                    />

                    <TextField
                        id="FechaNac"
                        label="FechaNac*"
                        value={formik.values.FechaNac}
                        {...commonTextFieldProps}
                        error={formik.touched.FechaNac && Boolean(formik.errors.FechaNac)}
                        helperText={formik.touched.FechaNac && formik.errors.FechaNac}
                    />

                    <TextField
                        id="IdTipoEstatusOK"
                        label="IdTipoEstatusOK*"
                        value={formik.values.IdTipoEstatusOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdTipoEstatusOK && Boolean(formik.errors.IdTipoEstatusOK)}
                        helperText={formik.touched.IdTipoEstatusOK && formik.errors.IdTipoEstatusOK}
                    />

                    <TextField
                        id="IdRolActualOK"
                        label="IdRolActualOK*"
                        value={formik.values.IdRolActualOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdRolActualOK && Boolean(formik.errors.IdRolActualOK)}
                        helperText={formik.touched.IdRolActualOK && formik.errors.IdRolActualOK}
                    />

                    <TextField
                        id="IdRolPrincipalOK"
                        label="IdRolPrincipalOK*"
                        value={formik.values.IdRolPrincipalOK}
                        {...commonTextFieldProps}
                        error={formik.touched.IdRolPrincipalOK && Boolean(formik.errors.IdRolPrincipalOK)}
                        helperText={formik.touched.IdRolPrincipalOK && formik.errors.IdRolPrincipalOK}
                    />

                    <TextField
                        id="FotoPerfil"
                        label="FotoPerfil*"
                        value={formik.values.FotoPerfil}
                        {...commonTextFieldProps}
                        error={formik.touched.FotoPerfil && Boolean(formik.errors.FotoPerfil)}
                        helperText={formik.touched.FotoPerfil && formik.errors.FotoPerfil}
                    />

                    <TextField
                        id="Email"
                        label="Email*"
                        value={formik.values.Email}
                        {...commonTextFieldProps}
                        error={formik.touched.Email && Boolean(formik.errors.Email)}
                        helperText={formik.touched.Email && formik.errors.Email}
                    />

                    <TextField
                        id="TelMovil"
                        label="TelMovil*"
                        value={formik.values.TelMovil}
                        {...commonTextFieldProps}
                        error={formik.touched.TelMovil && Boolean(formik.errors.TelMovil)}
                        helperText={formik.touched.TelMovil && formik.errors.TelMovil}
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
                        onClick={() => setOrdenesClientesShowModalUpdate(false)}
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
export default OrdenesClientesModalUpdate;