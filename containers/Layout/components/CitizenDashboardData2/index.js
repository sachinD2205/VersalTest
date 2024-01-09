import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import PropTypes from "prop-types";
import MyApplications from "../../../../pages/MyApplications";
import GeoPortal from "../../../../pages/GeoPortal";
import { useSelector } from "react-redux";
import CitizenDashboard2 from "../CitizenDashboard2";

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
        <Box>
          <Typography>
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


const CitizenDashboardData = ({ handleDrawerOpen, titleProp, subTitle, children, handleDrawerClose }) => {
  let value = useSelector((state) => {
    return state.user.citizenDashboardTabsValue;
  });
  return (
    <>
      <div style={{
        // backgroundImage: `url(/bgImage.jpeg)`,
        height: '100%',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        margin:'-1vw -2vw -2vw -2vw'
      }}>

        <Box  >
          <TabPanel value={value} index={0} sx={{ border: "solid red" }}>
            <MyApplications />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CitizenDashboard2
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
      </div>
    </>
  );
};

export default CitizenDashboardData;
