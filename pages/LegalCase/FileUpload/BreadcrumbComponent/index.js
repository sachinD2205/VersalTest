import axios from "axios";
import { useEffect, useRef, useState } from "react";
// import theme from "../../../theme";

import moment from "moment";
// import urls from "../../../URLS/urls";
import { Breadcrumbs, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = (props) => {
  console.log("props", props);
  const [breadCrumbName, setBreadCrumbName] = useState("");
  const language = useSelector((state) => state.labels.language);

  const token = useSelector((state) => state.user.user.token);

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

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
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography
          color="primary"
          // color="black"
          sx={{ textDecoration: "underline", fontSize: "15px" }}
        >
          {breadCrumbName}
        </Typography>
      </Breadcrumbs>
    </>
  );
};

export default Index;
