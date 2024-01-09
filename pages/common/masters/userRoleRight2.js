import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  ListSubheader,
  InputAdornment,
} from "@mui/material";
import { Slide } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { FormProvider } from "react-hook-form";

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import urls from "../../../URLS/urls";
import Loader from "../../../containers/Layout/components/Loader";
import schema from "../../../containers/schema/UserRoleRightSchema";
import { MenuProps, useStyles } from "../../../containers/utils/UserRoleRightUtils";
// import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SaveIcon from "@mui/icons-material/Save";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// import styles from "../../../styles/cfc/cfc.module.css";
import styles from "../../../styles/cfc/cfc.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
// Table
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { List, ListItem } from "@mui/material";

import ListItemButton from "@mui/material/ListItemButton";
import CommentIcon from "@mui/icons-material/Comment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F5B7B1",
    // backgroundColor: "#D7DBDD",
    // color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
//   "&: td, &: th": {
//     border: "1px solid black",
//   },
// }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&: td, &: th": {
    border: "1px solid black",
  },
}));

function createData(name, calories, fat, carbs, protein, upload) {
  return { name, calories, fat, carbs, protein, upload };
}

// modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// modal end

const UserRoleRight2 = () => {
  // modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    handleTableData();
    getRoleName();
    handleApplicationNameChange();
    setButtonShow(true);
  };

  // modal end

  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [load, setLoad] = useState(false);

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  const handleLoad = () => {
    setLoad(false);
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    methods,

    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedApplicationR, setSelectedApplicationR] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [designationList, setDesignationList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const applicationName = watch("applicationName");
  const [roleList, setRoleList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(null);
  const roleName = watch("roleName");
  const [testArray, setTestArray] = useState({ res: [], objj: [] });
  const router = useRouter();
  const [buttonInputState, setButtonInputState] = useState();

  const [buttonShow, setButtonShow] = useState(false);

  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [menuIdForApiCall, setMenuIdForApiCall] = useState();

  const [disabledBtn, setDisabledBtn] = useState(false);

  const [rolesToUpdate, setrolesToUpdate] = useState([]);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [addRoles, setAddRoles] = useState(false);

  // let userR = null;
  // const krBhava=useSelector(state=> state.user.lang)

  // const options = [
  //   "Oliver Hansen",
  //   "Van Henry",
  //   "April Tucker",
  //   "Ralph Hubbard",
  //   "Omar Alexander",
  //   "Carlos Abbott",
  //   "Miriam Wagner",
  //   "Bradley Wilkerson",
  //   "Virginia Andrews",
  //   "Kelly Snyder"
  // ];

  const classes = useStyles();
  // const autocompleteRef = useRef(null);
  const [selected, setSelected] = useState([]);
  console.log("selected", selected, selected.roleId);
  const isAllSelected = roleList.length > 0 && (selected.roleId || []).length === roleList.length;

  let userId = getValues("employeeName");
  const dataToSave = [];
  const handleChangeForAutoComplete = (event, value, val, id) => {
    // Remove deselected values from dataToSave
    const updatedDataToSave = dataToSave.filter(
      (item) => item.role !== val.id || value.some((selectedValue) => selectedValue.id === item.menu)
    );

    // Add new values to dataToSave
    for (let i = 0; i < value.length; i++) {
      const newData = {
        user: parseInt(router.query.id),
        role: value[i].id,
        menu: val.id,
      };

      const isDuplicate = updatedDataToSave.some((item) => item.role === newData.role && item.menu === newData.menu);

      if (!isDuplicate) {
        updatedDataToSave.push(newData);
      }
    }

    // Update dataToSave
    dataToSave.length = 0;
    dataToSave.push(...updatedDataToSave);
    console.log("dataToSave : ", dataToSave);
  };

  const _handleChange = (event, val, index) => {
    console.log("event", event.target.value, "val", val, "checked", checkedState);
    const value = event.target.value;
    let _selected = [...selected];
    let _checkedState = [...checkedState];
    let selectedIndex = _selected.findIndex((txt) => {
      return txt.menuId === val.id;
    });
    console.log("selectedIndex: ", selectedIndex.toString());
    if (selectedIndex > -1) {
      // found roleId ->
      if (value[value.length - 1] === "all") {
        // uncheck select all checkbox
        if (_selected[selectedIndex].roleId.length === roleList.length) {
          // if all selected -> unselect all
          _selected.splice(selectedIndex, 1);
          _checkedState = _checkedState.filter((mid) => mid != val.id);
        } else if (_selected[selectedIndex].roleId.length > 0) {
          // partially selectec -> select all
          _selected[selectedIndex].roleId = roleList.map((val) => val.id);
        }
        setSelected([..._selected]);
        setCheckedState([..._checkedState]);
      } else {
        // if any role is selected when there is atlest one role selected.
        if (_selected[selectedIndex].roleId.includes(value[0])) {
          // remove added role -> uncheck
          _selected[selectedIndex].roleId = _selected[selectedIndex].roleId.filter((rid) => rid !== value[0]);

          if (_selected[selectedIndex].roleId.length === 0) {
            _selected.splice(selectedIndex, 1);
            _checkedState = _checkedState.filter((mid) => mid != val.id);
          }
        } else {
          // add newly selected role -> check
          _selected[selectedIndex].roleId = [..._selected[selectedIndex].roleId, ...value];
          // if (_selected[selectedIndex].roleId.length === roleList.length) {
          //   //
          // }
        }
        setSelected([..._selected]);
        setCheckedState([..._checkedState]);
      }
    } else {
      //not found roleId => first time inserting
      if (value[value.length - 1] === "all") {
        setSelected([
          ..._selected,
          {
            menuId: val.id,
            roleId: roleList.map((val) => val.id),
            userId: userId,
          },
        ]);
        if (!_checkedState.includes(val.id)) {
          setCheckedState([..._checkedState, val.id]);
        }
      } else {
        let roleId = roleList.filter((r) => value.includes(r.id)).map((r) => r.id);
        setSelected([
          ..._selected,
          {
            menuId: val.id,
            roleId: value,
            userId: userId,
          },
        ]);
        console.log("_checkedState : ", _checkedState);
        console.log("val : ", val);
        if (!_checkedState.includes(val.id)) {
          setCheckedState([..._checkedState, val.id]);
        }
      }
    }
  };

  const [selectedOptionsArray, setSelectedOptionsArray] = React.useState([]);
  const handleAutocompleteChange = (index, value) => {
    if (value && value.length > 0) {
      const newArray = [...selectedOptionsArray];
      newArray[index] = value;
      setSelectedOptionsArray(newArray);
    }
  };

  useEffect(() => {
    getDepartmentName();
    getDesignationName();
    getUserName();
    getServiceName();
    getMenuName();
    getParentMenu();
    // setLang(krBhava)
  }, []);

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      flex: 0.2,
      cellClassName: "super-app-theme--cell",
      // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "role",
      headerName: <FormattedLabel id="role" />,
      // align: "center",
      // headerAlign: "center",
      // paddingLeft: 70,
      flex: 1,

      // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      // width: 100,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor: "whitesmoke",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              size="small"
              // onClick={() => removeEmployee(index)}
            >
              <DeleteIcon
                color="error"
                sx={{ fontSize: 25 }}
                onClick={() => {
                  console.log("delete params", params);

                  axios
                    .get(`${urls.CFCURL}/master/userRoleMenu/deleteById`, {
                      // .get(`http://192.168.29.122:8090/cfc/api/master/userRoleMenu/deleteById`, {

                      params: {
                        id: params?.row?.id,
                      },
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    })
                    .then((res) => {
                      console.log("update res", res);
                      if (res.status == 200) {
                        getData(menuIdForApiCall);
                        toast("Role deleted succesfully!!!", {
                          type: "success",
                        });
                      }
                    });
                }}
              />
            </IconButton>
          </Box>
        );
        // } else return null;
      },
    },
    // { field: "role", headerName: "Role", width: 300 },
  ];

  const [dataSource, setDataSource] = useState([]);

  // Get Table - Data
  const getData = (_menu) => {
    axios
      .get(
        `${urls.CFCURL}/master/userRoleMenu/getRoleByMenuId?menuId=${_menu}&userId=${selectedUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        // `http://192.168.29.122:8090/cfc/api/master/userRoleMenu/getRoleByMenuId?menuId=${_menu}&userId=${selectedUser}`
      )
      .then((res) => {
        console.log("get Role By Menu Id", res);
        // setDataSource(res.data);
        if (res.status == 200) {
          let result = res.data;
          let _res = result.map((val, index) => {
            return {
              srNo: index + 1,
              activeFlag: val.activeFlag,
              id: val.id,
              role: val.role == 1 ? "ADMIN" : roleList.find((r) => r.id == val.role)?.name,
              menu: val.menu,
              user: val.user,
            };
          });
          setDataSource(_res);
        }
        console.log("data", res.data);
      });
  };

  const [menus, setMenus] = useState([]);
  const [menuIdddd, setMenuId] = useState([]);

  const getParentMenu = () => {
    axios
      .get(`${urls.CFCURL}/master/menu/getAllParents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMenus(res.data.menu);
      });
  };

  useEffect(() => {
    console.log("router.query", router?.query);
    // if (router?.query?.pageMode === "EDIT") {
    console.log("Hit", router?.query);
    reset(router?.query);
    setValue("departmentName", Number(router?.query?.dept));
    setSelectedDepartment(Number(router?.query?.dept));
    setValue("designationName", Number(router?.query?.desig));
    setSelectedDesignation(Number(router?.query?.desig));
    // let nmr = user?.menus?.find((r) => r.serviceId == 10)?.roles

    // setValue("employeeName", userList.find((f) => f.id == router.query.id)?.firstNameEn);
    setValue(
      "employeeName",
      router?.query?.firstName + " " + router?.query?.middleName + " " + router?.query?.lastName
    );

    // setSelectedUser(Number(router?.query?.id));
    setSelectedUser(router?.query?.id);
    // }
  }, []);

  console.log("selectedUser", selectedUser);

  useEffect(() => {
    // if (selectedUser != null) {
    getApplicationsName();
    // getSelectedRoleRights();
    // }
  }, [selectedUser]);

  const checkIsChecked = (val, option) => {
    let _selected = [...selected];
    let i = _selected.filter((_role) => _role.menuId == val.id);

    if (i.length > 0) {
      let test = i[0].roleId.indexOf(option.id) > -1;
      return test;
    }
    return false;
  };

  const getDepartmentName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          // console.log("res department", r);
          setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  // Exit Button
  const exitButton = () => {
    setSelected([]);
    setCheckedState([]);
    router.push("/common/masters/departmentUserList");
  };

  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDesignationName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/designation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res deg", r);
        if (r.status == 200) {
          setDesignationList(r.data.designation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getMenuName = async () => {
    // setLoading(true);
    // setLoad(true);

    await axios
      .get(`${urls.CFCURL}/master/menu/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        // setLoading(false);
        // setLoad(false);

        if (r.status == 200) {
          console.log("res menu", r);
          setMenuList(r.data.menu);
        }
      })
      .catch((err) => {
        // setLoading(false);
        // setLoad(false);

        console.log("err", err);
      });
  };

  const getUserName = async () => {
    // setLoading(true);
    // setLoad(true);

    await axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res user", r);
          // setLoading(false);
          // setLoad(false);

          setUserList(r.data.user);
        }
      })
      .catch((err) => {
        // setLoading(false);
        console.log("err", err);
      });
  };

  const getApplicationsName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/application/getByUserId?userId=${selectedUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("111res application", r.data);
          setApplicationList(r.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getSelectedRoleRights = async () => {
    await axios
      .get(`${urls.CFCURL}/master/userRoleMenu/getByUserId?userId=${selectedUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res selected role", r.data.userRoleMenu);
          // setSelectedList(r.data.userRoleMenu);
          // setSelected(r.data.userRoleMenu)
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  console.log("selectedList", selectedList);

  const allRoles = [];
  const getRoleName = async () => {
    setLoad(true);
    await axios
      .get(`${urls.CFCURL}/master/mstRole/findByApplicationId?appId=${selectedApplicationR}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setLoad(false);
          console.log("resrole777", r.data.mstRole);
          setRoleList(r.data.mstRole);
          allRoles = r.data.mstRole;
          setOptions(allRoles);
          // setRoleList(
          //   r.data.mstRole.map((opt) => {
          //     return opt.name;
          //   })
          // );
        }
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
        toast("Data load", {
          type: "error",
        });
      });
  };

  const onFinish = async (data) => {
    console.log("data", data);
    console.log("Selected Options Array:", selectedOptionsArray);

    // const body = {
    // menuIds: checkedState,
    // applicationId: parseInt(data.applicationName),
    // userId: parseInt(data.userName),
    // roleId: parseInt(data.roleName),
    // departmentId: parseInt(data.departmentName),
    // role: selected,
    // employeeName: parseInt(data.employeeName),

    // id : 27 // first null, in case of edit pass it
    // activeFlag : "Y"
    // };
    // let _body = {
    //   userRoleMenu : selected.map((val) => {
    //     return {
    //       user: val.userId,
    //       role: val.roleId,
    //       menu: val.menuId
    //     }
    //   })
    // }
    let empName = router.query.id;
    let userRoleMenu = [];
    selected.map((val) => {
      console.log("00", val.roleId);
      val.roleId.map((e) =>
        userRoleMenu.push({
          // user: val.userId,
          user: empName,
          role: e,
          menu: val.menuId,
        })
      );
    });

    const body = {
      userRoleMenu: dataToSave,
    };

    console.log("userRoleMenu", userRoleMenu);
    console.log("BODY", body);
    swal({
      title: "Confirmation",
      text: "Are you sure you want to submit ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        if (dataToSave.length > 0) {
          setButtonInputState(true);
          axios
            .post(`${urls.CFCURL}/master/userRoleMenu/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((r) => {
              setButtonInputState(false);
              if (r.status == 200) {
                console.log("res", r);
                router.push("/common/masters/departmentUserList");
                toast("User Role added succesfully!!!", {
                  type: "success",
                });
              } else {
                message.error("Please Try Again !");
              }
            })
            .catch((err) => {
              setButtonInputState(false);
              console.log(err);
              toast("Please Try Again !", {
                type: "error",
              });
            });
        } else {
          toast("Please try after sometime.", {
            type: "error",
          });
          // if (autocompleteRef.current) {
          //   autocompleteRef.current.clear();
          // }
          // toast("Please Select Atleast One Role", {
          //   type: "error",
          // });
        }
      } else {
        setButtonInputState(false);
      }
    });
    // console.log("body", body,"_body",_body);
  };

  const [checkedState, setCheckedState] = useState([]);

  const handleChange = (e, { id, menuNameEng }) => {
    const newCheckedState = [...checkedState];
    let indexOfElement = newCheckedState.indexOf(id);
    let isChecked;
    if (indexOfElement === -1) {
      newCheckedState.push(id);
      isChecked = true;
    } else {
      newCheckedState.splice(indexOfElement, 1);
      isChecked = false;
    }

    if (objj[menuNameEng]) {
      let childIds = objj[menuNameEng].map((_menu) => _menu.id);
      if (isChecked) {
        // to select all child elements if parent is selected
        newCheckedState = [...newCheckedState, ...childIds];
        newCheckedState = [...new Set(newCheckedState)];
      } else {
        // to unselect all child elements if parent is unselected
        newCheckedState = newCheckedState.filter((_id) => !childIds.includes(_id));
      }
    }
    setCheckedState(newCheckedState);
  };

  let res = [];
  let objj = {};
  let arr = [];

  const handleTableData = () => {
    axios
      .get(
        `${urls.CFCURL}/master/userRoleMenu/getByUserIdAndApplicationId?userId=${selectedUser}&applicationId=${selectedApplicationR}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        // `http://192.168.29.122:8090/cfc/api/master/userRoleMenu/getByUserIdAndApplicationId?userId=${selectedUser}&applicationId=${selectedApplicationR}`
      )
      .then((r) => {
        console.log("menjus", r);
        if (r.status == 200) {
          setSelectedList(r?.data?.userRoleMenu);

          // setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleApplicationNameChange = () => {
    setLoad(true);
    // let selectedApplication = applicationId;
    console.log("selectedApplication", selectedApplicationR);

    let abc = menuList.filter((val) => {
      return val.appId === selectedApplicationR;
    });

    arr = menuList.filter((val) => {
      return val.isParent === "Y";
    });

    arr.map((val) => {
      let childEle = abc.filter((value) => {
        return val.id == value.parentId;
      });

      objj[val.menuNameEng] = childEle;

      res.push(val);
      res.push(...childEle);

      return val;
    });

    setTestArray({ res: [...res], objj: { ...objj } });
    setLoad(false);
  };

  console.log("testArray", testArray.res);

  const getSelectedRoleValue = (val) => {
    return selected.roleId || [];
    // const { roleId, menuId } = selected;
    // return roleId.filter((_role) => {
    //   console.log("432", _role, _role.menuId == val.id);
    //   return menuId == val.id;
    // });

    // .roleId?.map((val) => val) || [];
  };

  const [searchText, setSearchText] = useState("");
  const displayedOptions = useMemo(
    () => allRoles.filter((option) => containsText(option.name, searchText)),
    [allRoles, searchText]
  );

  const filteredOptions = allRoles.filter((option) => {
    option.toLowerCase().includes(searchText.toLowerCase());
  });
  const [options, setOptions] = useState([]);

  const checkIsAllSelected = (val) => {
    const _selected = [...selected];
    let selectedIndex = _selected.findIndex((txt) => {
      return txt.menuId === val.id;
    });
    if (selectedIndex > -1) return _selected[selectedIndex].roleId.length === roleList.length;

    return false;
  };

  const checkIsIntermediate = (val) => {
    const _selected = [...selected];
    let selectedIndex = _selected.findIndex((txt) => {
      return txt.menuId === val.id;
    });

    if (selectedIndex > -1) {
      return _selected[selectedIndex].roleId.length != roleList.length;
    }

    return false;
  };

  return (
    <FormProvider>
      <form onSubmit={handleSubmit(onFinish)}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
          }}
        >
          {loading && <Loader />}
        </Box>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={load} onClick={handleLoad}>
          Loading....
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname: "/common/masters/departmentUserList",
                    })
                  }
                />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  // color: "rgb(7 110 230 / 91%)",
                  color: "#EC7063",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                <FormattedLabel id="userRoleRightMaster" />
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>

        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ width: "86%" }}
                size="small"
                id="outlined-basic"
                label={<FormattedLabel id="employeeName" />}
                // readonly={employeeName}
                // value={router.query.employeeCode ? router.query.employeeCode : employeeCodeState}
                variant="outlined"
                style={{ backgroundColor: "white" }}
                {...register("employeeName")}
              />
              {/* <TextField
              sx={{ width: "86%" }}
              size="small"
              id="outlined-basic"
              variant="standard"
              readonly
              {...register("employeeName")}
              error={errors.employeeName}
              helperText={errors.employeeName?.message}
            /> */}
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <FormControl size="small" sx={{ m: 1, width: "86%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="applicationName" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      style={{ backgroundColor: "white" }}
                      variant="outlined"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={<FormattedLabel id="applicationName" />}
                      value={field.value}
                      // {...register("applicationName")}
                      // onChange={(value) => field.onChange(value)}
                      onChange={(value) => {
                        // console.log("value", value);
                        field.onChange(value);
                        setSelectedApplicationR(value.target.value);
                      }}
                    >
                      {applicationList.length > 0 ? (
                        applicationList.map((application, index) => {
                          return (
                            <MenuItem key={index} value={application.id}>
                              {application.applicationNameEng}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <MenuItem
                          sx={{
                            border: "1px solid red",
                            color: "red",
                            borderRadius: "100px",
                            backgroundColor: "#D5DBDB",
                          }}
                          value=""
                        >
                          {language === "en"
                            ? router?.query?.firstName +
                              " " +
                              router?.query?.lastName +
                              " " +
                              "does not have access for menu"
                            : router?.query?.firstName +
                              " " +
                              router?.query?.lastName +
                              " " +
                              "याला मेनूसाठी प्रवेश नाही"}
                        </MenuItem>
                      )}
                    </Select>
                  )}
                  name="applicationName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText style={{ color: "red" }}>
                  {errors?.applicationName ? errors.applicationName.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                display: "flex",
                // justifyContent: "right",
                padding: "5px",
              }}
            >
              <Button
                onClick={() => {
                  handleTableData();
                  getRoleName();
                  handleApplicationNameChange();
                  setButtonShow(true);
                }}
                // disabled={load}
                disabled={watch("applicationName") != 0 && !watch("applicationName")}
                variant="contained"
                sx={{ backgroundColor: "#3C8DBC", textTransform: "capitalize" }}
                size="small"
              >
                <FormattedLabel id="search" />
                <SearchIcon style={{ fontSize: "28px", paddingLeft: "3px" }} />
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid container>
          {/* <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
         <FormControl size="small" sx={{ m: 1, width: "86%" }}>
            <InputLabel id="demo-simple-select-standard-label">Department Name</InputLabel>

            <Controller
              render={({ field }) => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Department Name"
                  value={field.value}
                  // onChange={(value) => field.onChange(value)}
                  onChange={(value) => {
                    field.onChange(value);
                    setSelectedDepartment(value.target.value);
                    // handleRoleNameChange(value);
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {departmentList.length > 0
                    ? departmentList.map((department, index) => {
                        return (
                          <MenuItem key={index} value={department.id}>
                            {lang === "en" ? department.department : department.departmentMr}
                          </MenuItem>
                        );
                      })
                    : []}
                </Select>
              )}
              name="departmentName"
              control={control}
              defaultValue=""
            />
            <FormHelperText style={{ color: "red" }}>
              {errors?.departmentName ? errors.departmentName.message : null}
            </FormHelperText>
          </FormControl> 
        </Grid>*/}

          {/*  <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
         <FormControl size="small" sx={{ m: 1, width: "86%" }}>
            <InputLabel id="demo-simple-select-standard-label">Designation Name</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Designation Name"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value), setSelectedDesignation(value.target.value);
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {designationList.length > 0
                    ? designationList
                        .filter((designation) => designation.departmentId === selectedDepartment)
                        .map((designation, index) => {
                          return (
                            <MenuItem key={index} value={designation.id}>
                              {designation.designation}
                            </MenuItem>
                          );
                        })
                    : []}
                </Select>
              )}
              name="designationName"
              control={control}
              defaultValue=""
            />
            <FormHelperText style={{ color: "red" }}>
              {errors?.designationName ? errors.designationName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}

          {/* <Grid item xs={3}> */}
          {/* <FormControl size="small" sx={{ m: 1, width: "86%" }}>
            <InputLabel id="demo-simple-select-standard-label">Employee Name</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Employee Name"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value), setSelectedUser(value.target.value);
                    // userR = userList.filter((u) => u.id === value.target.value),
                    // console.log("userR",userR);
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {userList.length > 0
                    ? userList
                        // .filter((user) => {
                        //   if (
                        //     // user.department === selectedDepartment &&
                        //     // user.designation === selectedDesignation
                        //     selectedDepartment &&
                        //     selectedDesignation &&
                        //     user.department === selectedDepartment &&
                        //     user.designation === selectedDesignation
                        //   ) {
                        //     return user;
                        //   } else {
                        //     return user;
                        //   }
                        // })
                        .map((user, index) => {
                          return (
                            <MenuItem key={index} value={user.id}>
                              {user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn}
                            </MenuItem>
                          );
                        })
                    : []}
                </Select>
              )}
              name="employeeName"
              control={control}
              defaultValue=""
            />
            <FormHelperText style={{ color: "red" }}>
              {errors?.employeeName ? errors.employeeName.message : null}
            </FormHelperText>
          </FormControl> */}

          {/* </Grid> */}

          {/* <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>
            <FormControl size="small" sx={{ m: 1, width: "86%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Service Name
              </InputLabel>
  
              <Controller
                render={({ field }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Service Name"
                    value={field.value}
                    // onChange={(value) => field.onChange(value)}
                    onChange={(value) => {
                      field.onChange(value);
                      setSelectedService(value.target.value);
                      // handleRoleNameChange(value);
                    }}
                    style={{ backgroundColor: "white" }}
                  >
                    {serviceList.length > 0
                      ? serviceList.filter((service)=>service.application===selectedApplicationR).map((service, index) => {
                          return (
                            <MenuItem key={index} value={service.id}>
                              {service.serviceName}
                            </MenuItem>
                          );
                        })
                      : "NA"}
                  </Select>
                )}
                name="serviceName"
                control={control}
                defaultValue=""
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.roleName ? errors.roleName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "right",
            padding: "5px",
          }}
        >
          <Button
            // className={styles.adbtn}
            variant="contained"
            // disabled={buttonInputState}
            // onClick={() =>
            //   router.push({
            //     query: { ...router.query, mode: "edit" },
            //     pathname: "./userRoleAdd",
            //   })
            // }
            // onClick={handleOpen}
            onClick={() => {
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            <AddIcon />
          </Button>
        </Grid>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>User</StyledTableCell> */}

                <StyledTableCell align="center">{language == "en" ? "Sr.No" : "अनु क्र"}</StyledTableCell>
                <StyledTableCell align="center">{language == "en" ? "Menu Type" : "मेनू प्रकार"}</StyledTableCell>
                <StyledTableCell align="left">{language == "en" ? "Menu Name" : "मेनूचे नाव"}</StyledTableCell>
                <StyledTableCell align="left">{language == "en" ? "Role" : "भूमिका"}</StyledTableCell>
                <StyledTableCell align="center">{language == "en" ? "Action" : "क्रिया"}</StyledTableCell>
                {/* <StyledTableCell align='right'>Role&nbsp;(g)</StyledTableCell> */}
                {/* <StyledTableCell align='right'>Carbs&nbsp;(g)</StyledTableCell> */}
                {/* <StyledTableCell align='right'>Protein&nbsp;(g)</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedList.map((row, index) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell
                    style={{
                      backgroundColor: "#F5EEF8",
                      // backgroundColor: "#F5B7B1",
                      border: "1px solid white",
                    }}
                    align="center"
                  >
                    {index + 1}
                    {/* {menuList.find((m) => m.id == row.menu)?.menuNameEng} */}
                  </StyledTableCell>
                  {/* <StyledTableCell component='th' scope='row'>
                  {router?.query?.firstName +
                    " " +
                    router?.query?.middleName +
                    " " +
                    router?.query?.lastName}
                </StyledTableCell> */}

                  <StyledTableCell
                    style={{
                      backgroundColor: "#FADBD8",
                      border: "1px solid white",
                    }}
                    align="center"
                    // className={classes.tableBody}
                  >
                    {row.parentName}
                    {/* {menuList.find((m) => m.id == row.menu)?.menuNameEng} */}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {language == "en" ? row.menuNameEng : row.menuNameMr}
                    {/* {menuList.find((m) => m.id == row.menu)?.menuNameEng} */}
                  </StyledTableCell>

                  {/* {roleList.find((r) => r.id == row.role)?.name} */}
                  <StyledTableCell
                    align="left"
                    style={{
                      backgroundColor: "#FDEDEC",
                      border: "1px solid white",
                    }}
                  >
                    {row.roleNames}
                  </StyledTableCell>

                  <StyledTableCell
                    style={{
                      width: "15%",
                      // backgroundColor: "#F9EBEA",
                      backgroundColor: "#FADBD8",
                      border: "1px solid white",
                    }}
                    align="center"
                  >
                    <IconButton
                    // disabled={params.row.activeFlag === "Y" ? false : true}
                    // onClick={() => {
                    //   // const record = params.row;
                    //   router.push(
                    //     {
                    //       pathname:
                    //         "/FireBrigadeSystem/transactions/firstAhawal/form",
                    //       // query: {
                    //       //   pageMode: "Edit",
                    //       //   ...record,
                    //       //   firstAhawalId: record?.firstAhawalId?.id,
                    //       // },
                    //     }
                    //     // "/FireBrigadeSystem/transactions/firstAhawal/form"
                    //   );
                    //   ("");
                    // }}
                    >
                      <Button
                        size="small"
                        // variant="contained"
                        // className={styles.click}
                        sx={{
                          border: "1px solid #5499C7",
                          backgroundColor: "#ecf0f1",
                        }}
                        onClick={() => {
                          handleOpen();
                          getData(row.menu);
                          console.log("row23", row.menu);
                          let applicationName = watch("applicationName");
                          console.log("applicationName12", applicationName);
                          reset(row);
                          setMenuIdForApiCall(row.menu);
                          setValue("menuIdForApiCall", row.menu);
                          setValue("applicationName", applicationName);
                          handleApplicationNameChange();
                        }}
                      >
                        <FormattedLabel id="edit" />
                        <EditIcon style={{ color: "#556CD6" }} />
                      </Button>
                    </IconButton>
                    <Tooltip title="Delete Menu">
                      <IconButton
                        color="error"
                        onClick={() => {
                          console.log("params2", row, {
                            menuId: row.menu,
                            userId: Number(selectedUser),
                          });
                          axios
                            .get(
                              `${urls.CFCURL}/master/userRoleMenu/deleteMenuByUserIdAndMenuId`,
                              // `http://192.168.29.122:8090/cfc/api/master/userRoleMenu/deleteMenuByUserIdAndMenuId`,
                              {
                                params: {
                                  userId: Number(selectedUser),
                                  menuId: row.menu,
                                },
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            )
                            .then((res) => {
                              console.log("update res", res);
                              if (res.status == 200) {
                                toast("Menu deleted succesfully!!!", {
                                  type: "success",
                                });
                                handleTableData();
                                getRoleName();
                                handleApplicationNameChange();
                                setButtonShow(true);
                              }
                            });
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>

                  {/* <StyledTableCell align='right'>{row.role}</StyledTableCell> */}
                  {/* <StyledTableCell align='right'>{row.protein}</StyledTableCell> */}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            style={{
              width: "90%",
              height: "95%",
              backgroundColor: "#EAECEE",
              overflowY: "scroll",
            }}
            sx={style}
          >
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
              <Grid item xs={4} className={styles.feildres}>
                <FormControl size="small" sx={{ m: 1, width: "86%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="applicationName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        variant="outlined"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={<FormattedLabel id="applicationName" />}
                        value={field.value}
                        // {...register("applicationName")}
                        // onChange={(value) => field.onChange(value)}
                        onChange={(value) => {
                          // console.log("value", value);
                          field.onChange(value);
                          setSelectedApplicationR(value.target.value);
                        }}
                      >
                        {applicationList.length > 0 ? (
                          applicationList.map((application, index) => {
                            return (
                              <MenuItem key={index} value={application.id}>
                                {application.applicationNameEng}
                              </MenuItem>
                            );
                          })
                        ) : (
                          <MenuItem
                            sx={{
                              border: "1px solid red",
                              color: "red",
                              borderRadius: "100px",
                              backgroundColor: "#D5DBDB",
                            }}
                            value=""
                          >
                            {language === "en"
                              ? router?.query?.firstName +
                                " " +
                                router?.query?.lastName +
                                " " +
                                "does not have access for menu"
                              : router?.query?.firstName +
                                " " +
                                router?.query?.lastName +
                                " " +
                                "याला मेनूसाठी प्रवेश नाही"}
                          </MenuItem>
                        )}
                      </Select>
                    )}
                    name="applicationName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.applicationName ? errors.applicationName.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <FormControl size="small" sx={{ m: 1, width: "86%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="menuType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        style={{ backgroundColor: "white" }}
                        variant="outlined"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={<FormattedLabel id="menuType" />}
                        value={field.value}
                        // {...register("applicationName")}
                        // onChange={(value) => field.onChange(value)}
                        onChange={(value) => {
                          // console.log("value", value);
                          field.onChange(value);
                          // setSelectedApplicationR(value.target.value);
                        }}
                      >
                        {selectedList.length > 0 &&
                          selectedList.map((row, index) => {
                            return (
                              <MenuItem key={index} value={row.parentName}>
                                {row.parentName}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    )}
                    name="parentName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.menuType ? errors.menuType.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <FormControl size="small" sx={{ m: 1, width: "86%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="menuName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        style={{ backgroundColor: "white" }}
                        variant="outlined"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={<FormattedLabel id="menuName" />}
                        value={field.value}
                        // {...register("applicationName")}
                        // onChange={(value) => field.onChange(value)}
                        onChange={(value) => {
                          // console.log("value", value);
                          field.onChange(value);
                          setSelectedApplicationR(value.target.value);
                        }}
                      >
                        {selectedList.length > 0 &&
                          selectedList.map((row, index) => {
                            return (
                              <MenuItem key={index} value={row.menuNameEng}>
                                {language == "en" ? row.menuNameEng : row.menuNameMr}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    )}
                    name="menuNameEng"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.meunName ? errors.meunName.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            {/* <Grid item xs={3} className={styles.feildres}>
                <FormControl size='small' sx={{ m: 1, width: "86%" }}>
                  <InputLabel id='demo-simple-select-standard-label'>
                    Roles
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        style={{ backgroundColor: "white" }}
                        variant='outlined'
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        label='Application Name'
                        // value={field.value}
                        // {...register("applicationName")}
                        // onChange={(value) => field.onChange(value)}
                        onChange={(value) => {
                          // console.log("value", value);
                          field.onChange(value);
                          // setSelectedApplicationR(value.target.value);
                        }}
                      >
                        {roleList.length > 0 &&
                          roleList.map((row, index) => {
                            return (
                              <MenuItem key={index} value={row.id}>
                                {row.roleNames}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    )}
                    name='role'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.role ? errors.role.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}
            {/* Data Grid */}

            <br />
            <br />
            <Grid container>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "end", padding: "10px" }}>
                <Button
                  variant="contained"
                  size="small"
                  disabled={addRoles}
                  type="button"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    // buttonValueSetFun()
                    setAddRoles(true);
                  }}
                >
                  <FormattedLabel id="addNewRoles" />
                </Button>
              </Grid>
            </Grid>
            {addRoles && (
              <Grid container>
                {/* <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    padding: "10px",
                  }}
                >
                  <FormControl
                    size="small"
                    fullWidth
                    sx={{ width: "100%" }}
                    error={!!errors.newRoles}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Roles
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Roles"
                          multiple
                          value={rolesToUpdate}
                          onChange={(value) => {
                            let debhava = [...value.target.value];
                            setrolesToUpdate(debhava);
                            // field.onChange(value);
                          }}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Roles"
                            />
                          }
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => (
                                <Chip
                                  sx={{ backgroundColor: "#AFDBEE" }}
                                  key={value}
                                  label={
                                    roleList?.find((obj) => {
                                      return obj?.id === value;
                                    })?.name
                                  }
                                />
                              ))}
                            </Box>
                          )}
                          MenuProps={MenuProps}
                          style={{ backgroundColor: "white" }}
                        >
                          {roleList.length > 0
                            ? roleList.map((menu, index) => {
                                return (
                                  <MenuItem key={index} value={menu.id}>
                                    <Checkbox
                                      checked={
                                        rolesToUpdate?.find(
                                          (obj) => obj == menu.id
                                        )
                                          ? true
                                          : false
                                      }
                                    />
                                    <ListItemText primary={menu.name} />
                                  </MenuItem>
                                );
                              })
                            : "NA"}
                        </Select>
                      )}
                      name="newRoles"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.newRoles ? errors.newRoles.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  <Autocomplete
                    multiple
                    fullWidth
                    sx={{ backgroundColor: "white" }}
                    size="small"
                    id="checkboxes-tags-demo"
                    options={roleList}
                    disableCloseOnSelect
                    getOptionLabel={(option) => (language === "en" ? option.name : option.nameMr)}
                    onChange={(eve, value) => {
                      console.log("value", value);
                      const selectedIds = value?.map((val) => val?.id);
                      setrolesToUpdate(selectedIds);
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                        {language === "en" ? option.name : option.nameMr}
                      </li>
                    )}
                    renderInput={(params) => <TextField variant="outlined" {...params} label="Roles" />}
                  />
                </Grid>
              </Grid>
            )}

            <Box
              style={{
                // height: "auto",
                // overflow: "auto",
                width: "100%",
              }}
            >
              <DataGrid
                // disableColumnFilter
                // disableColumnSelector
                // disableExport
                // disableToolbarButton
                // disableDensitySelector
                // componentsProps={{
                //   toolbar: {
                //     showQuickFilter: true,
                //     quickFilterProps: { debounceMs: 500 },
                //     printOptions: { disableToolbarButton: true },
                //     // disableExport: true,
                //     // disableToolbarButton: true,
                //     csvOptions: { disableToolbarButton: true },
                //   },
                // }}
                // components={{ Toolbar: GridToolbar }}
                autoHeight
                density="compact"
                sx={{
                  "& .super-app-theme--cell": {
                    backgroundColor: "#E3EAEA",
                    borderLeft: "10px solid white",
                    borderRight: "10px solid white",
                    borderTop: "4px solid white",
                  },
                  backgroundColor: "white",
                  boxShadow: 2,
                  // border: 1,
                  // borderColor: "primary.light",
                  // "& .MuiDataGrid-cell:hover": {
                  //   // transform: "scale(1.1)",
                  // },
                  // "& .MuiDataGrid-row:hover": {
                  //   backgroundColor: "#E3EAEA",
                  // },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-column": {
                    backgroundColor: "red",
                  },
                }}
                rows={dataSource}
                columns={columns}
                pageSize={7}
                rowsPerPageOptions={[7]}
                //checkboxSelection
              />
            </Box>
            <br />
            <br />
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
              <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  // className={styles.adbtn}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const body = {
                      menu: menuIdForApiCall,
                      roles: rolesToUpdate,
                      user: Number(selectedUser),
                    };
                    axios
                      .post(
                        `${urls.CFCURL}/master/userRoleMenu/saveUserRolesMenu`,
                        // `http://192.168.29.122:8090/cfc/api/master/userRoleMenu/saveUserRolesMenu`,
                        body,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      )
                      .then((res) => {
                        console.log("update res", res);
                        getData(menuIdForApiCall);
                        // setOpen(false)
                        setrolesToUpdate(null);
                        handleClose();
                        toast("Role added succesfully!!!", {
                          type: "success",
                        });
                      });
                  }}
                >
                  <FormattedLabel id="Update" />
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  // className={styles.adbtn}
                  variant="contained"
                  // disabled={buttonInputState}
                  // onClick={() =>
                  //   router.push({
                  //     query: { ...router.query, mode: "edit" },
                  //     pathname: "./userRoleAdd",
                  //   })
                  // }
                  sx={{ color: "white", backgroundColor: "red" }}
                  size="small"
                  onClick={handleClose}
                >
                  <FormattedLabel id="close" />
                </Button>
              </Grid>
            </Grid>
            {/* </Paper> */}
          </Box>
        </Modal>
        {/* Modal End */}

        <br />
        <br />
        <br />
        <br />
        {/* {isOpenCollapse && ( */}
        {/* // <Slide direction='down' in={slideChecked} mountOnEnter unmountOnExit> */}
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
            <h3>
              <FormattedLabel id="addRole" />
            </h3>
            {/* <Grid item xs={4} className={styles.feildres}>
            <FormControl size='small' sx={{ m: 1, width: "86%" }}>
              <InputLabel id='demo-simple-select-standard-label'>
                Application Name
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    style={{ backgroundColor: "white" }}
                    variant='outlined'
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    label='Application Name'
                    value={field.value}
                    // {...register("applicationName")}
                    // onChange={(value) => field.onChange(value)}
                    onChange={(value) => {
                      // console.log("value", value);
                      field.onChange(value);
                      setSelectedApplicationR(value.target.value);
                    }}
                  >
                    {applicationList.length > 0 ? (
                      applicationList.map((application, index) => {
                        return (
                          <MenuItem key={index} value={application.id}>
                            {application.applicationNameEng}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <MenuItem
                        sx={{
                          border: "1px solid red",
                          color: "red",
                          borderRadius: "100px",
                          backgroundColor: "#D5DBDB",
                        }}
                        value=''
                      >
                        {language === "en"
                          ? router?.query?.firstName +
                            " " +
                            router?.query?.lastName +
                            " " +
                            "does not have access for menu"
                          : router?.query?.firstName +
                            " " +
                            router?.query?.lastName +
                            " " +
                            "याला मेनूसाठी प्रवेश नाही"}
                      </MenuItem>
                    )}
                  </Select>
                )}
                name='applicationName'
                control={control}
                defaultValue=''
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.applicationName
                  ? errors.applicationName.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}
            {/* <Grid item xs={4} className={styles.feildres}>
              <FormControl
                size='small'
                sx={{ m: 1, width: "86%" }}
                error={!!errors.parentId}
              >
                <InputLabel id='demo-simple-select-standard-label'>
                  Menu type
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      label='Menu Type'
                      value={field.value}
                      // {...register("applicationName")}
                      // onChange={(value) => field.onChange(value)}
                      onChange={(value) => {
                        console.log("value.target.value", value.target.value);
                        field.onChange(value);
                        setMenuId(value.target.value);
                      }}
                      style={{ backgroundColor: "white" }}
                    >
                      {menus.length > 0
                        ? menus.map((menu, index) => {
                            return (
                              <MenuItem key={index} value={menu.id}>
                                {menu.menuNameEng}
                              </MenuItem>
                            );
                          })
                        : "NA"}
                    </Select>
                  )}
                  name='parentId'
                  control={control}
                  defaultValue=''
                />
                <FormHelperText style={{ color: "red" }}>
                  {errors?.parentId ? errors.parentId.message : null}
                </FormHelperText>
              </FormControl>
            </Grid> */}
          </Grid>
        </Paper>

        {
          testArray && (
            <Paper>
              <Grid
                container
                style={{
                  // backgroundColor: "#D3D3D3",
                  backgroundColor: "white",
                  // height: "290px",
                  // overflow: "auto",
                }}
              >
                {testArray.res &&
                  testArray.res.map((text, index) => {
                    return (
                      <>
                        {text.isParent !== null && (
                          <>
                            <Grid
                              item
                              xs={12}
                              // style={{
                              //   display: "flex",
                              //   // justifyContent: "center",
                              //   flexDirection: "column",
                              //   // border: "1px solid green",
                              // }}
                              key={index}
                            >
                              <FormGroup>
                                {/* <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "10px",
                                  backgroundColor: "#2980B9",
                                  color: "white",
                                }}
                              > */}
                                <Grid container>
                                  {/* <Grid
                                    xs={2}
                                    item
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                </Grid> */}
                                  {/* <Checkbox
                                    checked={checkedState.indexOf(text.id) >= 0}
                                    onChange={(e) => {
                                      handleChange(e, text);
                                    }}
                                  /> */}

                                  {/* <Grid
                                    item
                                    xs={5}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      style={{ fontWeight: "normal" }}
                                    >
                                      {text.menuNameEng}
                                    </Typography>
                                  </Grid> */}
                                  {/* <Grid
                                    item
                                    xs={5}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "normal",
                                        marginLeft: "60px",
                                      }}
                                    >
                                      Role
                                    </Typography>
                                  </Grid> */}
                                  {/* {text.parentId == 3 ? (
                         
                              ) : (
                                <></>
                              )} */}
                                </Grid>
                                {/* <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkedState.indexOf(text.id) >= 0}
                                onChange={(e) => {
                                  console.log("id", text.id, text);
                                  handleChange(e, text);
                                }}
                              />
                            }
                            label={text.menuNameEng}
                          /> */}
                                {/* </Box> */}
                              </FormGroup>
                              {/* <Divider /> */}
                              {console.log("testArray", testArray)}

                              {testArray.res
                                .filter((val) => val.isParent == "Y")
                                .map((abc, index) => {
                                  return (
                                    testArray?.objj[abc.menuNameEng]
                                      // ?.filter((f) => {
                                      //   f.parentId == 2;
                                      // })
                                      ?.map((val, id) => {
                                        return (
                                          // menuIdddd- Menu Type dropDown Value Set
                                          val.parentId == text.id && (
                                            // val.parentId == menuIdddd &&
                                            //newly added
                                            // selectedList.find(
                                            //   (f) =>
                                            //     f.menuNameEng == val.menuNameEng
                                            // ) &&
                                            <FormGroup
                                              sx={{
                                                backgroundColor:
                                                  (val.parentId == 3 && "#AED6F1") || val.parentId == 1
                                                    ? "#AED6F1"
                                                    : "#D5F5E3",
                                              }}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "2px solid white",
                                              }}
                                            >
                                              <Grid
                                                container
                                                style={{
                                                  padding: "5px",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                }}
                                              >
                                                <Grid
                                                  xs={0.5}
                                                  item
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  {/* <Checkbox
                                                    sx={{
                                                      backgroundColor: "white",
                                                      marginRight: "20px",
                                                      marginLeft: "5px",
                                                      padding: "2px",
                                                    }}
                                                    checked={checkedState.indexOf(val.id) > -1}
                                                    // checked={checkedState.indexOf(val.id) >= 0}

                                                    // checked={checkedState.indexOf(val.id) > -1}
                                                    // checked={selectedModuleName.indexOf(name.applicationNameEng) > -1}
                                                    onChange={(e) => {
                                                      handleChange(e, val);
                                                    }}
                                                  /> */}
                                                </Grid>
                                                <Grid
                                                  item
                                                  xs={2.4}
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Typography>
                                                    {language == "en" ? val?.menuNameEng : val?.menuNameMr}
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={9} style={{ padding: "5px" }}>
                                                  <FormControl fullWidth size="small">
                                                    {/* <InputLabel id="mutiple-select-label">
                                                      <FormattedLabel id="roles" />
                                                    </InputLabel> */}

                                                    <Autocomplete
                                                      multiple
                                                      key={"role_" + index}
                                                      limitTags={2}
                                                      options={roleList}
                                                      disableCloseOnSelect
                                                      getOptionLabel={(option) => option.name}
                                                      onChange={(event, value) => {
                                                        handleChangeForAutoComplete(event, value, val, id);
                                                      }}
                                                      renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                          <Checkbox
                                                            icon={icon}
                                                            checkedIcon={checkedIcon}
                                                            style={{ marginRight: 8 }}
                                                            checked={selected}
                                                          />
                                                          {option.name}
                                                        </li>
                                                      )}
                                                      style={{ width: 500 }}
                                                      renderInput={(params) => <TextField {...params} label="Roles" />}
                                                    />

                                                    {/* <Select
                                                      sx={{
                                                        width: "100%",
                                                        backgroundColor: "white",
                                                      }}
                                                      // size="small"
                                                      key={"role_" + index}
                                                      labelId="mutiple-select-label"
                                                      multiple
                                                      label="Roles"
                                                      value={getSelectedRoleValue(val)}
                                                      // value={
                                                      //   selected.filter(
                                                      //     (_role) => {
                                                      //      return _role.menuId == val.id
                                                      //     }
                                                      //   ).roleId || []
                                                      // }
                                                      onChange={(event) => {
                                                        console.log(event);
                                                        _handleChange(event, val, id);
                                                      }}
                                                      onSelect={(e) => {
                                                        console.log("onSelect", e);
                                                      }}
                                                      onClick={(e) => {
                                                        console.log("onClick", e);
                                                      }}
                                                      onOpen={(e, index) => {
                                                        console.log("onOpen", e.target, index);
                                                      }}
                                                      renderValue={(selected) => selected.join(", ")}
                                                      MenuProps={{ autoFocus: false }}
                                                    >
                                                      <ListSubheader>
                                                        <TextField
                                                          size="small"
                                                          // Autofocus on textfield
                                                          autoFocus
                                                          placeholder="Type to search..."
                                                          fullWidth
                                                          InputProps={{
                                                            startAdornment: (
                                                              <InputAdornment position="start">
                                                                <SearchIcon />
                                                              </InputAdornment>
                                                            ),
                                                          }}
                                                          onChange={(e) => setSearchText(e.target.value)}
                                                          onKeyDown={(e) => {
                                                            if (e.key !== "Escape") {
                                                              // Prevents autoselecting item while typing (default Select behaviour)
                                                              e.stopPropagation();
                                                            }
                                                          }}
                                                        />
                                                      </ListSubheader>

                                                      {filteredOptions.map((option, index) => (
                                                        <MenuItem
                                                          key={index}
                                                          value={option.id}
                                                          sx={{
                                                            padding: 0,
                                                          }}
                                                        >
                                                          <ListItemIcon>
                                                            <Checkbox
                                                              key={"CH" + index}
                                                              checked={
                                                                // selected.indexOf(
                                                                //   option.id
                                                                // ) > -1
                                                                checkIsChecked(val, option)
                                                              }
                                                            />
                                                          </ListItemIcon>
                                                          <ListItemText primary={option.name} />
                                                        </MenuItem>
                                                      ))}
                                                    </Select> */}
                                                  </FormControl>
                                                  {/* <FormControl size="small" fullWidth>
                                              <InputLabel id="demo-simple-select-standard-label">
                                                Role
                                              </InputLabel>
  
                                              <Controller
                                                render={({ field }) => (
                                                  <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Role"
                                                    value={field.value}
                                                    onChange={(value) => {
                                                      field.onChange(value);
                                                    }}
                                                    style={{
                                                      backgroundColor: "white",
                                                    }}
                                                  >
                                                    {roleList.length > 0
                                                      ? roleList.map(
                                                          (role, index) => {
                                                            return (
                                                              <MenuItem
                                                                key={index}
                                                                value={role.id}
                                                              >
                                                                {role.name}
                                                              </MenuItem>
                                                            );
                                                          }
                                                        )
                                                      : "NA"}
                                                  </Select>
                                                )}
                                                name="roleName"
                                                control={control}
                                                defaultValue=""
                                              />
                                              <FormHelperText
                                                style={{ color: "red" }}
                                              >
                                                {errors?.roleName
                                                  ? errors.roleName.message
                                                  : null}
                                              </FormHelperText>
                                            </FormControl> */}
                                                </Grid>
                                                {/* {val.parentId == 3 ? (
                                        <>
                                          
                                        </>
                                      ) : (
                                        <></>
                                      )} */}

                                                {/* <Divider style={{ width: "100%" }} /> */}
                                              </Grid>
                                            </FormGroup>

                                            // <FormControlLabel
                                            //   style={{
                                            //     border: "1px solid red",
                                            //     width: "100%",
                                            //     display: "flex",
                                            //   }}
                                            //   control={
                                            //     <Checkbox
                                            //       checked={checkedState.indexOf(val.id) >= 0}
                                            //       onChange={(e) => {
                                            //         console.log("id", id, val);
                                            //         handleChange(e, val);
                                            //       }}
                                            //     />
                                            //   }
                                            //   label={val.menuNameEng}
                                            // />
                                          )
                                        );
                                      })
                                  );
                                })}
                            </Grid>
                            {/* <Divider
                              orientation='vertical'
                              variant='middle'
                              flexItem
                              sx={{ mr: "-1px" }}
                            /> */}
                          </>
                        )}
                      </>
                    );
                  })}
              </Grid>
              {buttonShow == true ? (
                <>
                  <br />
                  <br />
                  <Grid container className={styles.feildres} spacing={2}>
                    <Grid item>
                      <Button
                        endIcon={<SaveIcon />}
                        variant="contained"
                        type="submit"
                        size="small"
                        disabled={buttonInputState}
                        sx={{
                          backgroundColor: "#00A65A",
                          textTransform: "capitalize",
                        }}
                      >
                        <FormattedLabel id="Save" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        endIcon={<ClearIcon />}
                        size="small"
                        variant="contained"
                        sx={{
                          backgroundColor: "#3C8DBC",
                          textTransform: "capitalize",
                        }}
                        onClick={() => {
                          setSelected([]);
                          setCheckedState([]);
                        }}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        endIcon={<ExitToAppIcon />}
                        size="small"
                        variant="contained"
                        onClick={() => exitButton()}
                        sx={{
                          backgroundColor: "#DD4B39",
                          textTransform: "capitalize",
                        }}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                </>
              ) : (
                <></>
              )}
            </Paper>
          )
          //  : (
          //   <>Please Choose Application Name then Search</>
          // )
        }
        {/* // </Slide> */}
        {/* )} */}
      </form>
    </FormProvider>
  );
};

export default UserRoleRight2;
