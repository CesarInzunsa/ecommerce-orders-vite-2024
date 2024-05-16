import {useState, useEffect} from 'react';
import {GetAllProdServ} from './get/GetAllProdServ.jsx';

function useProducts({IdProdServOK}) {
    const [etiquetas, setEtiquetas] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const etiquetasData = await GetAllProdServ();
                console.log("etiquetasData", etiquetasData)
                setEtiquetas(etiquetasData);
            } catch (error) {
                console.error("useEtiquetas():", error);
            }
        }

        fetchData();
    }, []);

    let etiquetaEspecifica = null
    if (IdProdServOK) { //Si recibe IdInstitutoOK
        etiquetaEspecifica = etiquetas.find(etiqueta => etiqueta.IdProdServOK === IdProdServOK);
    } else if (!IdProdServOK) {//Si NO recibe IdInstitutoOK
        etiquetaEspecifica = etiquetas.find(etiqueta => etiqueta.IdProdServOK === IdProdServOK)
    }

    return {etiquetas, etiquetaEspecifica};
}

export default useProducts;