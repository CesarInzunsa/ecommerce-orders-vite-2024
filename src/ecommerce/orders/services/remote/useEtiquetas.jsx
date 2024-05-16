import {useState, useEffect} from 'react';
import {GetAllLabels} from './get/GetAllLabels.jsx';

function useEtiquetas({IdEtiquetaOK, IdInstitutoOK}) {
    const [etiquetas, setEtiquetas] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const etiquetasData = await GetAllLabels();
                console.log("etiquetasData", etiquetasData)
                setEtiquetas(etiquetasData);
            } catch (error) {
                console.error("useEtiquetas():", error);
            }
        }

        fetchData();
    }, []);

    let etiquetaEspecifica = null
    if (IdEtiquetaOK && IdInstitutoOK) { //Si recibe IdInstitutoOK
        etiquetaEspecifica = etiquetas.find(etiqueta => etiqueta.IdEtiquetaOK === IdEtiquetaOK && etiqueta.IdInstitutoOK === IdInstitutoOK);
    } else if (IdEtiquetaOK && !IdInstitutoOK) {//Si NO recibe IdInstitutoOK
        etiquetaEspecifica = etiquetas.find(etiqueta => etiqueta.IdEtiquetaOK === IdEtiquetaOK)
    }

    return {etiquetas, etiquetaEspecifica};
}

export default useEtiquetas;