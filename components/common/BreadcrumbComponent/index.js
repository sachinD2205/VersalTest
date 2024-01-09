import axios from "axios";
import { useEffect, useRef, useState } from "react";
import theme from "../../../theme";
import moment from "moment";
import urls from "../../../URLS/urls";
import { Breadcrumbs, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedBreadcrumbApplication } from "../../../features/userSlice";

const Index = (props) => {
  console.log("props", props);
  const [breadCrumbName, setBreadCrumbName] = useState("");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const dispatch = useDispatch();

  const selectedBreadcrumbApplication = useSelector((state) => {
    return state.user.selectedBreadcrumbApplication;
  });

  const token = useSelector((state) => state.user.user.token);

  console.log(
    "selectedMenuFromDrawer",
    selectedMenuFromDrawer,
    selectedBreadcrumbApplication
  );
  // useEffect(() => {
  //   // getMenus();
  //   setBreadCrumbName(selectedBreadcrumbApplication);
  // }, [selectedBreadcrumbApplication]);

  const usersDepartmentDashboardData = useSelector((state) => {
    return state.user.usersDepartmentDashboardData;
  });

  useEffect(() => {
    // setBreadCrumbName(
    //   usersDepartmentDashboardData?.menus?.reduce((result, person) => {
    //     if (person?.id === selectedMenuFromDrawer) {
    //       return person?.breadcrumName;
    //     }
    //     return result;
    //   }, null)
    // );

    if (selectedBreadcrumbApplication?.toLowerCase()?.includes("dashboard")) {
      console.log("its dashboard");
    } else {
      dispatch(
        setSelectedBreadcrumbApplication(
          usersDepartmentDashboardData?.menus?.reduce((result, person) => {
            if (person?.id === selectedMenuFromDrawer) {
              return person?.breadcrumName;
            }
            return result;
          }, null)
        )
      );
    }
  }, [usersDepartmentDashboardData]);

  const getMenus = async () => {
    await axios
      .get(`${urls.CFCURL}/master/menu/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setBreadCrumbName(
            r.data.menus?.reduce((result, person) => {
              if (person?.id === selectedMenuFromDrawer) {
                return person?.breadcrumName;
              }
              return result;
            }, null)
          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ padding: "10px" }}>
        <Typography
          color="primary"
          sx={{
            // textDecoration: "underline",
            fontSize: "12px",
          }}
        >
          {/* {breadCrumbName} */}
          {console.log(
            "selectedBreadcrumbApplication",
            selectedBreadcrumbApplication
          )}
          {selectedBreadcrumbApplication}
        </Typography>
      </Breadcrumbs>
    </>
  );
};

export default Index;
