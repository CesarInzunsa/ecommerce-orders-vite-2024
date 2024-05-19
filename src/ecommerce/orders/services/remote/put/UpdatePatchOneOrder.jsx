import axios from "axios";

export function UpdatePatchOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK, updateData) {
    return new Promise((resolve, reject) => {
        // Puedes ajustar la URL según tu API
        axios.patch(`${import.meta.env.VITE_API_ORDERS_URL}/one?IdInstitutoOK=${IdInstitutoOK}&IdNegocioOK=${IdNegocioOK}&IdOrdenOK=${IdOrdenOK}`, updateData)
            .then((response) => {
                const data = response.data;

                if (!data.success) {
                    console.error("No se pudo realizar correctamente la petición <<updateOrdenById - Services>>", data);
                    reject(data);
                } else {
                    console.log(`Orden con ID ${IdOrdenOK} actualizada exitosamente`);
                    resolve(data); // Puedes resolver con algún mensaje o datos adicionales si es necesario
                }
            })
            .catch((error) => {
                console.error("Error en <<updateOrdenById - Services>>", error);
                reject(error);
            });
    });
}