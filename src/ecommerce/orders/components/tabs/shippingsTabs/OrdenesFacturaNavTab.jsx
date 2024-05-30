import {Box, Tabs, Tab} from "@mui/material";
import React, {useState} from "react";

const ordersTabs = ["Factura", "Domicilio", "Productos"];

const OrdenesFacturaNavTab = ({currentRowInProveedoresTab, setCurrentNameTabInProveedoresTab}) => {

    const [currenTabIndex, setCurrentTabIndex] = useState(0);
    const handleChange = (e) => {

        setCurrentNameTabInProveedoresTab(e.target.innerText.toUpperCase());

        switch (e.target.innerText.toUpperCase()) {
            case "FACTURA":
                setCurrentTabIndex(0);
                break;
            case "DOMICILIO":
                setCurrentTabIndex(1);
                break;
            case "PRODUCTOS":
                setCurrentTabIndex(2);
                break;
        }

    };

    return (
        <Box sx={{border: (theme) => `2px solid ${theme.palette.divider}`, mx: 1, padding: 0.5}}>
            <Tabs
                value={currenTabIndex}
                variant={"fullWidth"}
                onChange={handleChange}
                aria-label="icon tabs example"
                textColor="primary"
            >
                {ordersTabs.map((tab) => {
                    return <Tab key={tab} label={tab} disabled={currentRowInProveedoresTab === null}/>;
                })}
            </Tabs>
        </Box>
    );
};
export default OrdenesFacturaNavTab;