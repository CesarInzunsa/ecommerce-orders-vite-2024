import {RouterProvider} from "react-router-dom";
// Route
import router from "./navigation/NaviRoutesCommerce";
import Footer from "./share/footer/components/Footer";

export default function AppAllModules() {
    return (
        <>
            <div id='div-app'>
                <RouterProvider router={router}/>
                <div id='div-footer'>
                    <Footer/>
                </div>
            </div>
        </>
    );
}