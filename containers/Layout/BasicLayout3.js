import React from "react";
import LayoutFooter from "./components/LayoutFooter";
import FirstHeader from "./components/FirstHeader";
import FirstHeaderDepartment from "./components/FirstHeaderDepartment";
// import LayoutPageHeader from './components/LayoutPageHeader'
// import CitizenDashboardData from './components/CitizenDashboardData'
// import DepartmentDashboard from '../../pages/DepartmentDashboard'
// import { useSelector } from 'react-redux'
// import { Box, Toolbar } from '@mui/material'
import FirstHeaderCFC from "./components/FirstHeaderCFC";
import { Box } from "@mui/material";

const BasicLayout = ({ children, titleProp, subTitle }) => {
  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);
  return (
    <>
      {/* <div> */}
      <div className="formLayout" style={{height:" 100%", width: "100%"}}>
        {loggedInUser === "departmentUser" && <FirstHeaderDepartment />}

        {loggedInUser === "citizenUser" && <FirstHeader />}
        {loggedInUser === "cfcUser" && (
          <Box sx={{ paddingTop:'25px' }}>
            <FirstHeaderCFC />
          </Box>
        )}
        <div>
          <div
            style={
              loggedInUser === "citizenUser"
                ? {
                    // marginLeft: "2vw",
                    // marginRight: "2vw",
                    // marginTop: "2vw",
                    // marginBottom: "4vw",
                  }
                : {
                    marginLeft: "2vw",
                    marginRight: "2vw",
                    marginTop: "7vw",
                    marginBottom: "4vw",
                  }
            }
          >
            {children}
          </div>
        </div>

        <div></div>
        {/* <UpperFooter /> */}
        {(loggedInUser === "citizenUser" ||
          loggedInUser === "departmentUser" ||
          loggedInUser === "cfcUser") && <LayoutFooter />}
      </div>
    </>
  );
};

export default BasicLayout;
