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

const OrdenesEnviosProductosModal = ({
                                         OrdenesEnviosProductosShowModal,
                                         setOrdenesEnviosProductosShowModal,
                                         datosSeleccionados,
                                         datosSecSubdocEnvios,
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
            DesProdServ: "",
            DesPresenta: "",
            CantidadPed: 0,
            CantidadEnt: 0,
        },
        validationSchema: Yup.object({
            DesProdServ: Yup.object().required("El producto es requerido"),
            DesPresenta: Yup.object().required("La presentación es requerida"),
            CantidadPed: Yup.string().required("La cantidad pedida es requerida"),
            CantidadEnt: Yup.string().required("La cantidad entregada es requerida"),
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


                /*ordenExistente.envios[index].productos.push(
                    {
                        IdProdServOK: values.DesProdServ.IdProdServOK,
                        IdPresentaOK: values.DesPresenta.IdPresentaOK,
                        DesProdServ: values.DesProdServ.DesProdServ,
                        DesPresenta: values.DesPresenta.DesPresenta,
                        CantidadPed: values.CantidadPed,
                        CantidadEnt: values.CantidadEnt
                    }
                );*/

                let values2 = {
                    IdProdServOK: values.DesProdServ.IdProdServOK,
                    IdPresentaOK: values.DesPresenta.IdPresentaOK,
                    DesProdServ: values.DesProdServ.DesProdServ,
                    DesPresenta: values.DesPresenta.DesPresenta,
                    CantidadPed: values.CantidadPed,
                    CantidadEnt: values.CantidadEnt
                };
                //console.log(ordenExistente);
                /*for (let i = 0; i < ordenExistente.envios[index].productos.length; i++) {
                    console.log("Entro")
                    ordenExistente.envios[index].productos[i] = {
                        IdProdServOK: ordenExistente.envios[index].productos[i].IdProdServOK,
                        IdPresentaOK: ordenExistente.envios[index].productos[i].IdPresentaOK,
                        DesProdServ: ordenExistente.envios[index].productos[i].DesProdServ,
                        DesPresenta: ordenExistente.envios[index].productos[i].DesPresenta,
                        CantidadPed: ordenExistente.envios[index].productos[i].CantidadPed,
                        CantidadEnt: ordenExistente.envios[index].productos[i].CantidadEnt,

                    };
                    console.log("Realizo", ordenExistente)
                }*/
                //values.Actual === true ? (values.Actual = "S") : (values.Actual = "N");

                //console.log(ordenExistente);
                const ProductosOrdenes = OrdenesEnviosProductosValues(values2, ordenExistente, index);
                //const EstatusOrdenes = OrdenesEstatusValues(values);

                //console.log("<<Ordenes>>", EstatusOrdenes);
                console.log(datosSeleccionados);
                // console.log("LA ID QUE SE PASA COMO PARAMETRO ES:", row._id);
                // Utiliza la función de actualización si estamos en modo de edición

                //await PutOneOrder(EstatusOrdenes, IdInstitutoOK, IdNegocioOK, IdOrdenOK);
                await UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, ProductosOrdenes); //se puede sacar el objectid con row._id para lo del fic aaaaaaaaaaaaaaaaaaa
                setMensajeExitoAlert("Producto actualizado Correctamente");
                //handleReload(); //usar la función para volver a cargar los datos de la tabla y que se vea la actualizada

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

    /*
        async function getDataSelectOrdenesType2() {
            try {
                const Labels = await GetAllLabels();
                const OrdenesTypes = Labels.find(
                    (label) => label.IdEtiquetaOK === "IdTipoEnvioEstatus"
                );
                let envioEstatus = [];
                Labels.forEach(etiqueta => {
                    if (etiqueta.IdEtiquetaOK == "IdTipoEnvioEstatus"){
                        envioEstatus.push(etiqueta);
                    }
                });
                let valores = [];
                envioEstatus[0].valores.forEach(valor => {
                    valores.push(valor.Valor);
                });
                //const valores = OrdenesTypes.valores; // Obtenemos el array de valores
                /*const IdValoresOK = valores.map((valor, index) => ({
                    IdValorOK: valor.Valor,
                    key: valor.IdValorOK, // Asignar el índice como clave temporal
                }));
                setOrdenesValuesLabel(valores);
                console.log(OrdenesValuesLabel)
            } catch (e) {
                console.error(
                    "Error al obtener Etiquetas para Tipos Giros de Institutos:",
                    e
                );
            }
        }*/

    //MI FUNCION CREO
    async function getDataSelectOrdenesType2() {
        try {
            const productosData = await GetAllProdServ();
            setProductos(productosData);
        } catch (e) {
            console.error(
                "Error al obtener Etiquetas para Tipos Giros de Institutos:",
                e
            );
        }
    }

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        getDataSelectOrdenesType2();
        //const productosData=await GetAllProdServ();
        //setProductos(productosData);
    }, []);


    return (
        <Dialog
            open={OrdenesEnviosProductosShowModal}
            onClose={() => setOrdenesEnviosProductosShowModal(false)}
            fullWidth
        >
            <form onSubmit={(e) => {
                formik.handleSubmit(e);
            }}>
                {/* FIC: Aqui va el Titulo de la Modal */}
                <DialogTitle>
                    <Typography>
                        <strong>Agregar Nuevo Producto al Envio</strong>
                    </Typography>
                </DialogTitle>
                {/* FIC: Aqui va un tipo de control por cada Propiedad de Institutos */}
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}} dividers>
                    {/* FIC: Campos de captura o selección */}
                    <InputLabel htmlFor="dynamic-select-tipo-orden">Producto</InputLabel>
                    <Select
                        id="dynamic-select-producto"
                        value={formik.values.DesProdServ}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="DesProdServ"
                        aria-label="Producto"
                    >
                        {productos.map((option, index) => (
                            <MenuItem key={option.DesProdServ} value={option}>
                                {option.DesProdServ}
                            </MenuItem>
                        ))}
                    </Select>
                    <InputLabel htmlFor="dynamic-select-presentacion">Presentación</InputLabel>
                    <Select
                        id="dynamic-select-presentacion"
                        value={formik.values.DesPresenta}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="DesPresenta"
                        aria-label="Presentación"
                    >
                        {formik.values.DesProdServ &&
                            formik.values.DesProdServ.cat_prod_serv_presenta.map((DesPresenta, index) => (
                                <MenuItem key={`${index}-${DesPresenta.DesPresenta}`} value={DesPresenta}>
                                    {DesPresenta.DesPresenta}
                                </MenuItem>
                            ))}
                    </Select>
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
                        onClick={() => setOrdenesEnviosProductosShowModal(false)}
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
export default OrdenesEnviosProductosModal;
