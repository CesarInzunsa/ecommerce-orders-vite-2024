import axios from "axios";

export function AddOneOrder(order) {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_API_ORDERS_URL, order)
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    console.error("<<ERROR>> <<NO>> se ejecuto la API <<AddOneOrder>> de forma correcta", data);
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<AddOneOrder>>", error);
                reject(error);
            });
    });
}