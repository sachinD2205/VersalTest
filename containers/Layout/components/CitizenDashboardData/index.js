import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import PropTypes from "prop-types";
import CitizenDashboard from "../../components/CitizenDashboard";
import MyApplications from "../../../../pages/MyApplications";
import GeoPortal from "../../../../pages/GeoPortal";
import { useSelector } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
        // sx={{ p: 3 }}
        >
          <Typography
          // sx={{
          //   marginLeft: '-7vw',
          //   marginRight: '-2vw',
          //   marginTop: '-7vw',
          //   marginBottom: '-2vw',
          // }}
          >
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CitizenDashboardData = ({ handleDrawerOpen, titleProp, subTitle, children, handleDrawerClose }) => {
  let value = useSelector((state) => {
    // @ts-ignore
    return state.user.citizenDashboardTabsValue;
  });
  return (
    // <Box className="layout-content">
    <Box>
      <TabPanel value={value} index={0} sx={{ border: "solid red" }}>
        <MyApplications />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CitizenDashboard
          handleDrawerOpen={handleDrawerOpen}
          titleProp={titleProp}
          subTitle={subTitle}
          children={children}
          handleDrawerClose={handleDrawerClose}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GeoPortal />
      </TabPanel>
    </Box>
  );
};

export default CitizenDashboardData;
