import Swal from "sweetalert2";

export const showMensajeExito = (mensaje) => {
    Swal.fire({
        title: "Proceso Exitoso",
        text: mensaje,
        icon: "success",
        // showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
    })
};
export const showMensajeError = (mensaje) => {
    Swal.fire({
        title: "Hubo un Error",
        text: mensaje,
        icon: "error",
        // showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
    })
};
export const showMensajeConfirm = async (mensaje) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: "Mensaje de Confirmación",
            text: mensaje,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed)
                resolve(true);
            else
                resolve(false);

        });
    });
};