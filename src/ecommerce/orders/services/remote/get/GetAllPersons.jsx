import axios from "axios";

export function GetAllPersons() {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_API_PERSONS_URL)
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    reject(data); // Rechaza la promesa con la respuesta si no fue exitosa
                } else if (data.data.length === 0) {
                    resolve([]);
                } else if (data.success) {
                    const ordersData = data.data[0].dataRes;

                    resolve(JSON.parse(JSON.stringify(ordersData))); // Resuelve la promesa y hace una copia profunda
                }
            })
            .catch((error) => {
                reject(error); // Rechaza la promesa en caso de error
            });
    });
}