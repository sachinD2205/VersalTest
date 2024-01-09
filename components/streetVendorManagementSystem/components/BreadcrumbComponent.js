import { Breadcrumbs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import Style from "../../../../components/streetVendorManagementSystem/styles/br";

const Index = () => {
  const [breadCrumbName, setBreadCrumbName] = useState("");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer"),
  );

  // usersDepartmentDashboardData
  const usersDepartmentDashboardData = useSelector((state) => {
    return state.user.usersDepartmentDashboardData;
  });

  // newFunction
  const newFunction = () => {
    setBreadCrumbName(
      usersDepartmentDashboardData?.menus?.reduce((result, person) => {
        if (person?.id === selectedMenuFromDrawer) {
          return person?.breadcrumName;
        }
        return result;
      }, null),
    );
  };

  // ! ====================> useEffect < ===================

  useEffect(() => {
    newFunction();
  }, [usersDepartmentDashboardData]);

  //MarriageRegistration / Menu / Master / Relation

  // view
  return (
    <>
      <Breadcrumbs aria-label='breadcrumb' sx={{ padding: "10px" }}>
        <Typography
          color='primary'
          sx={{
            // textDecoration: "underline",
            fontSize: "12px",
          }}>
          {breadCrumbName}
        </Typography>
      </Breadcrumbs>
    </>
  );
};

export default Index;
