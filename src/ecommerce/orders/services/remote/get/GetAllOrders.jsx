import axios from "axios";

export function getAllOrders() {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_API_ORDERS_URL)
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    //console.error("No se pudo realizar correctamente la petición <<getAllOrders - Services>>", data);
                    reject(data); // Rechaza la promesa con la respuesta si no fue exitosa
                } else if (data.data.length === 0) {
                    //console.info("🛈 No se encontraron documentos en <<cat_orders>>");
                    resolve([]);
                } else if (data.success) {
                    const ordersData = data.data[0].dataRes;
                    //console.log("Colección: <<cat_orders>>", InstitutesData);
                    resolve(JSON.parse(JSON.stringify(ordersData))); // Resuelve la promesa y hace una copia profunda
                }
            })
            .catch((error) => {
                //console.error("Error en <<getAllOrders - Services>>", error);
                reject(error); // Rechaza la promesa en caso de error
            });
    });
}