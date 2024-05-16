import axios from "axios";

export function AddOrdenesEstatus(IdInstitutoOK, IdNegocioOK, id, updateData) {
    return new Promise((resolve, reject) => {
        // Puedes ajustar la URL según tu API
        axios.patch(`${import.meta.env.VITE_ORDERS_URL}one?IdInstitutoOK=${IdInstitutoOK}&IdNegocioOK=${IdNegocioOK}&IdOrdenOK=${id}`, updateData)
            .then((response) => {
                const data = response.data;

                if (!data.success) {
                    console.error("No se pudo realizar correctamente la petición <<updateOrdenById - Services>>", data);
                    reject(data);
                } else {
                    console.log(`Orden con ID ${id} actualizada exitosamente`);
                    resolve(data); // Puedes resolver con algún mensaje o datos adicionales si es necesario
                }
            })
            .catch((error) => {
                console.error("Error en <<updateOrdenById - Services>>", error);
                reject(error);
            });
    });
}