import React, { useEffect } from "react";
import "./popup.css";
import AppliedFormTab from "../AppliedForm";
import SettingsTab from "@/components/Settings";
import AppliedListTab from "@/components/AppliedList";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

type Props = {};

export default function Popup({}: Props) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="base">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Applied" {...a11yProps(0)} />
            <Tab label="Manually Add" {...a11yProps(1)} />
            <Tab label="Settings" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AppliedListTab />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AppliedFormTab />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <SettingsTab />
        </CustomTabPanel>
      </Box>
    </div>
  );
}
