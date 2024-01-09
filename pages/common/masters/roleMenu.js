import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../containers/schema/common/RoleMenu";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../../styles/applicationStatus.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// import { useDemoData } from '@mui/x-data-grid-generator';
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import { useSelector } from "react-redux";

const RoleMenu = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const token = useSelector((state) => state.user.user.token);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [role, setRole] = useState([]);
  const [menu, setMenu] = useState([]);
  const [user, setUser] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getRole();
    getMenu();
    getUser();
    getApplicationStatus();
  }, []);

  const getRole = () => {
    axios
      .get(`${urls.CFCURL}/master/role/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        console.log("role res", res);
        let roles = {};

        setRole(result.name);
      });
  };

  // const getServices = () => {
  //     axios
  //       .get(`${urls.CFCURL}/master/service/getAll`)

  //       .then((r) => {
  //         if (r.status == 200) {
  //           console.log("service res", r);

  //           let services = {};
  //           r.data.service.map((r) => (services[r.id] = r.serviceName));
  //           _setServices(services);
  //           setServices(r.data.service);
  //           //   setServices(r.data.service);
  //         } else {
  //           message.error("Login Failed ! Please Try Again !");
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         toast("Login Failed ! Please Try Again !", {
  //           type: "error",
  //         });
  //       });
  //   };

  const getMenu = () => {
    axios
      .get(`${urls.CFCURL}/master/menu/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        console.log("role res", res);

        setMenu(res.data.menuNameEng);
      });
  };

  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/userAuthenticationAndRoleRights/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        console.log("role res", res);

        setUser(res.data.userName);
      });
  };
  const getApplicationStatus = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/roleMenu/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("resss", res);
        let result = res.data.roleMenu;
        let _res = result.map((val, i) => {
          return {
            //   activeFlag: val.activeFlag,
            srNo: val.id,

            //   serviceStatus:val.serviceStatus ? val.serviceStatus : "-",
            // serviceStatusMr: val.serviceStatusMr,
            id: val.id,
            role: role[val.role] ? role[val.role].name : "-",
            menu: menu[val.menu] ? menu[val.menu].menu : "-",

            user: user[val.user] ? user[val.user].user : "-",

            //   status: val.activeFlag === "Y" ? "Active" : "Inactive",
            //   documentChecklistEn: val.documentChecklistEn
            //     ? val.documentChecklistEn
            //     : "-",
            //   documentChecklistMr: val.documentChecklistMr
            //     ? val.documentChecklistMr
            //     : "-",
            //   typeOfDocumentEn: val.typeOfDocumentEn ? val.typeOfDocumentEn : "-",
            //   typeOfDocumentMr: val.typeOfDocumentMr ? val.typeOfDocumentMr : "-",
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  const deleteById = (value, _activeFlag) => {
    console.log("value, _activeFlag", value, _activeFlag);
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/roleMenu/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getApplicationStatus();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/roleMenu/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("act res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getApplicationStatus();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    role: "",
    menu: "",
    user: "",
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const finalBodyForApi = {
      ...formData,
      service: Number(formData.service),
      // activeFlag: btnSaveText === "Update" ? formData.activeFlag :null ,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/roleMenu/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getApplicationStatus();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const resetValuesExit = {
    role: "",
    menu: "",
    user: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
      maxWidth: 100,
    },
    {
      field: "role",
      headerName: "Role",
      // type: "number",
      flex: 1,
    },
    {
      field: "menu",
      headerName: "Menu",
      // type: "number",
      flex: 1,
    },
    {
      field: "user",
      headerName: "User",
      // type: "number",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Paper style={{ margin: "50px" }}>
        <div
          style={{
            // backgroundColor: "#0084ff",
            backgroundColor: "#757ce8",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
          Role Menu Master
          {/* <FormattedLabel id='aadharAuthentication' /> */}
        </div>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ width: "60%" }}
                    error={!!errors.role}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Role
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Role"
                        >
                          {role &&
                            role.map((role, index) => {
                              return (
                                <MenuItem key={index} value={role.id}>
                                  {role.name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="role"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.role ? errors.role.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ width: "60%" }}
                    error={!!errors.menu}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Menu
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Menu"
                        >
                          {menu &&
                            menu.map((menu, index) => {
                              return (
                                <MenuItem key={index} value={menu.id}>
                                  {menu.menu}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="menu"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.menu ? errors.menu.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ width: "60%" }}
                    error={!!errors.user}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      User
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="user"
                        >
                          {user &&
                            user.map((user, index) => {
                              return (
                                <MenuItem key={index} value={user.id}>
                                  {user.user}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="user"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.user ? errors.user.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        label="Document checklist(In English)*"
                        variant="outlined"
                        size="small"
                        {...register("documentChecklistEn")}
                        error={!!errors.documentChecklistEn}
                        helperText={
                          errors?.documentChecklistEn
                            ? errors.documentChecklistEn.message
                            : null
                        }
                      />
                    </Grid> */}
              </Grid>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    <FormattedLabel id={btnSaveText} />
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={9}></Grid>
          <Grid
            item
            xs={2}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />
            </Button>
          </Grid>
        </Grid>

        <Box style={{ height: "auto", overflow: "auto" }}>
          <DataGrid
            sx={{
              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            density="compact"
            autoHeight={true}
            // rowHeight={50}
            pagination
            paginationMode="server"
            // loading={data.loading}
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getApplicationStatus(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getApplicationStatus(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default RoleMenu;
