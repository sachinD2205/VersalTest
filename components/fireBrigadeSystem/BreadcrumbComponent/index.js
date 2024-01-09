import axios from "axios";
import { useEffect, useRef, useState } from "react";
import theme from "../../../theme";
import moment from "moment";
import urls from "../../../URLS/urls";
import { Breadcrumbs, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

const Index = (props) => {
  const userToken = useGetToken();

  console.log("props", props);
  const [breadCrumbName, setBreadCrumbName] = useState("");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  useEffect(() => {
    // getMenus();
  }, []);

  const usersDepartmentDashboardData = useSelector((state) => {
    return state.user.usersDepartmentDashboardData;
  });

  useEffect(() => {
    setBreadCrumbName(
      usersDepartmentDashboardData?.menus?.reduce((result, person) => {
        if (person?.id === selectedMenuFromDrawer) {
          return person?.breadcrumName;
        }
        return result;
      }, null)
    );
  }, [usersDepartmentDashboardData]);

  const getMenus = async () => {
    await axios
      .get(`${urls.CFCURL}/master/menu/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
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
          sx={{ textDecoration: "underline", fontSize: "12px" }}
        >
          {breadCrumbName}
        </Typography>
      </Breadcrumbs>
    </>
  );
};

export default Index;
