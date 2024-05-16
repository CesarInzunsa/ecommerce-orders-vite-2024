import axios from "axios";

export function DelOneOrder(IdInstitutoOK, IdNegocioOK, IdOrdenOK) {
    return new Promise((resolve, reject) => {
        axios.delete(import.meta.env.VITE_API_ORDERS_URL + '/?IdInstitutoOK=' + IdInstitutoOK + '&IdNegocioOK=' + IdNegocioOK + '&IdOrdenOK=' + IdOrdenOK)
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    console.error("<<ERROR>> <<NO>> se ejecuto la API <<DelOneOrder>> de forma correcta", data);
                    reject(data);
                } else if (data.success) {
                    resolve(data);
                }
            })
            .catch((error) => {
                console.error("<<ERROR>> en API <<DelOneOrder>>", error);
                reject(error);
            });
    });
}