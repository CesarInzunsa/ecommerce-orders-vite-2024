import axios from "axios";

export function PutOneOrder(order, IdInstitutoOK, IdNegocioOK, IdOrdenOK) {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_API_ORDERS_URL + '/?IdInstitutoOK=' + IdInstitutoOK + '&IdNegocioOK=' + IdNegocioOK + '&IdOrdenOK=' + IdOrdenOK, order)
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    console.error("<<ERROR>> <<NO>> se ejecuto la API <<PutOneOrder>> de forma correcta", data);
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<PutOneOrder>>", error);
                reject(error);
            });
    });
}