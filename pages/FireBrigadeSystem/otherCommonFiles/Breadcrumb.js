import axios from "axios";
import { useEffect, useRef, useState } from "react";
import theme from "../../../theme";
import moment from "moment";
import urls from "../../../URLS/urls";
import {
  Box,
  Breadcrumbs,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedBreadcrumbApplication } from "../../../features/userSlice";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/router";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import * as React from "react";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

const BreadcrumbComponent = (props) => {
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  console.log("props", props);
  const [breadCrumbName, setBreadCrumbName] = useState("");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const response = useSelector((state) => {
    return state.user.usersDepartmentDashboardData;
  });

  const selectedApplicationId = useSelector((state) => {
    return state.user.selectedApplicationId;
  });

  const dispatch = useDispatch();

  const selectedBreadcrumbApplication = useSelector((state) => {
    return state.user.selectedBreadcrumbApplication;
  });

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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

  const breadcrumbString = selectedBreadcrumbApplication; // Replace with your actual breadcrumb string

  // Check if selectedBreadcrumbApplication is a non-empty string
  if (typeof breadcrumbString === "string" && breadcrumbString.trim() !== "") {
    // Split the breadcrumbString by the forward slash "/" and remove extra whitespace
    const parts = breadcrumbString.split("/").map((part) => part.trim());

    console.log("parts", parts);

    // Extract the parts or provide default values if they don't exist
    const firstPart = parts[0] || "Fire Brigade System"; // Default to "Home" if the first part is missing
    const secondPart = parts[1] || "Masters"; // Default to "Page" if the second part is missing

    let arr = [];
    let objj = {};
    let res = [];

    console.log("response", response);

    let abc = response?.menus?.filter((val) => {
      return val.appKey === selectedApplicationId;
    });

    arr = response?.menus?.filter((val) => {
      return val.isParent === "Y";
    });

    console.log("arr345", arr);

    let childEle;
    arr?.map((val) => {
      childEle = abc
        .sort((a, b) => (a.menuNameEng > b.menuNameEng ? 1 : -1))
        .filter((value) => {
          return 2 == value.parentId;
        });

      objj[val.menuNameEng] = childEle;

      res.push(val);
      res.push(...childEle);

      return val;
    });

    console.log("childEle123", childEle);

    console.log("arr123", arr);

    console.log("response123", response);

    return (
      <>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            padding: "10px",
            marginLeft: -1.5,
            backgroundColor: "white",
            paddingRight: 3,
            borderRadius: 20,
          }}
        >
          <Typography
            color="primary"
            sx={{
              fontSize: "12px",
            }}
            onClick={() => {
              router.push(`/DepartmentDashboard`);
            }}
          >
            {firstPart}
          </Typography>
          {/* <NavigateNextIcon
            sx={{
              fontSize: "18px", // Adjust the icon size as needed
              verticalAlign: "middle", // Align the icon vertically with text
            }}
          />{" "} */}
          <Typography
            color="primary"
            sx={{
              fontSize: "12px",
            }}
            // onClick={handleSecondPartClick}
            // onClick={handleClick}
            onClick={handleOpenUserMenu}
          >
            {secondPart}
            {anchorElUser ? (
              <ExpandLess
                sx={{
                  fontSize: "23px", // Adjust the icon size as needed
                  verticalAlign: "middle", // Align the icon vertically with text
                }}
              />
            ) : (
              <ExpandMore
                sx={{
                  fontSize: "23px", // Adjust the icon size as needed
                  verticalAlign: "middle", // Align the icon vertically with text
                }}
              />
            )}

            {/* <NavigateNextIcon
              sx={{
                fontSize: "18px", // Adjust the icon size as needed
                verticalAlign: "middle", // Align the icon vertically with text
              }}
            /> */}
          </Typography>
          {/* To Display List */}

          {/* <NavigateNextIcon
            sx={{
              fontSize: "12px", // Adjust the icon size as needed
              verticalAlign: "middle", // Align the icon vertically with text
            }}
          /> */}
          {/* <Typography
            color='primary'
            sx={{
              fontSize: "12px",
            }}
          >
            {secondPart}
          </Typography> */}
        </Breadcrumbs>

        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {console.log("childEle123", childEle)}
          {childEle?.map((item) => (
            <MenuItem key={item.id} onClick={() => router.push(item.clickTo)}>
              {language == "en" ? item.menuNameEng : item.menuNameMr}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  } else {
    // Handle the case when selectedBreadcrumbApplication is not a valid string
    return null; // or display an error message
  }
};

export default BreadcrumbComponent;
