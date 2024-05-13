import {Box, Tabs, Tab} from "@mui/material";
import React, {useState} from "react";

const ordersTabs = ["Ordenes", "Estatus", "Info", "Detalles", "Forma pago"];

const OrdersNavTab = ({setCurrentRowInOrdersTab, setCurrentNameTabInPrincipalTab}) => {

    const [currenTabIndex, setCurrentTabIndex] = useState(0);
    const handleChange = (e) => {

        setCurrentNameTabInPrincipalTab(e.target.innerText.toUpperCase());

        switch (e.target.innerText.toUpperCase()) {
            case "ORDENES":
                setCurrentTabIndex(0);
                break;
            case "ESTATUS":
                setCurrentTabIndex(1);
                break;
            case "INFO":
                setCurrentTabIndex(2);
                break;
            case "DETALLES":
                setCurrentTabIndex(3);
                break;
            case "FORMA PAGO":
                setCurrentTabIndex(4);
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
                    return <Tab key={tab} label={tab} disabled={setCurrentRowInOrdersTab === null}/>;
                })}
            </Tabs>
        </Box>
    );
};
export default OrdersNavTab;