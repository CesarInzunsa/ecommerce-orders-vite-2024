import {Box, Tabs, Tab} from "@mui/material";
import React, {useState} from "react";

const ordersTabs = ["Detalles", "Estatus-f", "Estatus-v", "Estatus-u", "Estatus-p", "Info ad", "paq"];

const OrdenesProveedoresDetallesNavTab = ({
                                              currentRowInProveedoresDetallesTab,
                                              setCurrentNameTabInProveedoresDetallesTab
                                          }) => {

    const [currenTabIndex, setCurrentTabIndex] = useState(0);
    const handleChange = (e) => {

        setCurrentNameTabInProveedoresDetallesTab(e.target.innerText.toUpperCase());

        switch (e.target.innerText.toUpperCase()) {
            case "DETALLES":
                setCurrentTabIndex(0);
                break;
            case "ESTATUS-F":
                setCurrentTabIndex(1);
                break;
            case "ESTATUS-V":
                setCurrentTabIndex(2);
                break;
            case "ESTATUS-U":
                setCurrentTabIndex(3);
                break;
            case "ESTATUS-P":
                setCurrentTabIndex(4);
                break;
            case "INFO AD":
                setCurrentTabIndex(5);
                break;
            case "PAQ":
                setCurrentTabIndex(6);
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
                    return <Tab key={tab} label={tab} disabled={currentRowInProveedoresDetallesTab === null}/>;
                })}
            </Tabs>
        </Box>
    );
};
export default OrdenesProveedoresDetallesNavTab;