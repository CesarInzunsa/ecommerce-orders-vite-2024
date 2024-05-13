import {Box, Tab, Tabs, Stack} from "@mui/material";
import React, {useState} from "react";

const BusinessTabs = ["detalles","estatus", "info ad", "paquete"];

const OrdenesDetallesNavTab = ({currentRowInBusinessTab, setCurrentNameTabInBusinessTab}) => {
    const [currenTabIndex, setCurrentTabIndex] = useState(0);

// Evento Change
    const handleChange = (e) => {
        setCurrentNameTabInBusinessTab(e.target.innerText.toUpperCase());
        switch (e.target.innerText.toUpperCase()) {
            case "DETALLES":
                setCurrentTabIndex(0);
                break;
            case "ESTATUS":
                setCurrentTabIndex(1);
                break;
            case "INFO AD":
                setCurrentTabIndex(2);
                break;
            case "PAQUETE":
                setCurrentTabIndex(3);
                break;
        }
    };
    return (
        <Box sx={{border: (theme) => `1px solid ${theme.palette.divider}`, mx: 1, padding: 0.5}}>
            <Tabs
                value={currenTabIndex}
                variant={"fullWidth"}
                onChange={handleChange}
                aria-label="icon tabs example"
                textColor="primary"
            >
                {BusinessTabs.map((tab) => {
                    return <Tab key={tab} label={tab} disabled={currentRowInBusinessTab === null}/>;
                })}
            </Tabs>
        </Box>
    );
};

export default OrdenesDetallesNavTab;