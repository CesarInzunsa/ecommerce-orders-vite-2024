import {useState, useEffect} from 'react';
import {GetAllInstitutes} from './get/GetAllInstitutes';

function UseInstitutos({IdInstitutoOK}) {
    const [etiquetas, setEtiquetas] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const etiquetasData = await GetAllInstitutes();
                //console.log("etiquetasData", etiquetasData)
                setEtiquetas(etiquetasData);
            } catch (error) {
                //console.error("useEtiquetas():", error);
            }
        }

        fetchData();
    }, []);

    let etiquetaEspecifica = null
    if (IdInstitutoOK) { //Si recibe IdInstitutoOK
        etiquetaEspecifica = etiquetas.find(etiqueta => etiqueta.IdInstitutoOK === IdInstitutoOK);
    } else if (!IdInstitutoOK) {//Si NO recibe IdInstitutoOK
        etiquetaEspecifica = etiquetas.find(etiqueta => etiqueta.IdInstitutoOK === IdInstitutoOK)
    }

    return {etiquetas, etiquetaEspecifica};
}

export default UseInstitutos;