import axios from "axios";

export function GetOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK) {
    return new Promise((resolve, reject) => {

        axios.get(import.meta.env.VITE_API_ORDERS_URL + '/one?IdInstitutoOK=' + IdInstitutoOK + '&IdNegocioOK=' + IdNegocioOK + '&IdOrdenOK=' + IdOrdenOK)
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    //console.error("No se pudo realizar correctamente la petición <<GetOneOrder - Services>>", data);
                    reject(data); // Rechaza la promesa con la respuesta si no fue exitosa
                } else if (data.data.length === 0) {
                    //console.info("🛈 No se encontraron documentos en <<cat_orders>>");
                    resolve([]);
                } else if (data.success) {
                    const orderData = data.data[0].dataRes;
                    resolve(JSON.parse(JSON.stringify(orderData))); // Resuelve la promesa y hace una copia profunda
                }
            })
            .catch((error) => {
                //console.error("Error en <<GetOneOrder - Services>>", error);
                reject(error); // Rechaza la promesa en caso de error
            });
    });

}