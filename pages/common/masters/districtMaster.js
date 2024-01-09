import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Grid,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../containers/Layout/BasicLayout";
// import urls from "../../../../URLS/urls";
import urls from "../../../URLS/urls";
import schema from "../../../containers/schema/common/RemarkMaster";
import styles from "../../../styles/[remarkMaster].module.css";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import { useSelector } from "react-redux";
// import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  let schema = yup.object().shape({
    // department: yup.string().required("Department  is Required !!!"),
    // approvalRemark: yup.string().required("Remark is Required !!!"),
    // rejectionRemark: yup.string().required("Remark  is Required !!"),
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [typeOfRemarks, settypeOfRemarks] = useState([]);
  const token = useSelector((state) => state.user.user.token);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    gettypeOfRemarks();
  }, []);

  useEffect(() => {
    getDistrictMaster();
  }, [typeOfRemarks]);

  const gettypeOfRemarks = () => {
    axios
      .get(`${urls.BaseURL}/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        settypeOfRemarks();
        // r.data.map((row) => ({
        //   id: row.id,
        //   department: row.department,
        // }))
      });
  };

  // Get Table - Data
  const getDistrictMaster = () => {
    axios
      .get(`${urls.BaseURL}/districtMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(` ----- ${res.data}`);
        setDataSource(
          res.data.districtMaster.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            districtNameEn: r.districtNameEn,
            districtNameMr: r.districtNameMr,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
            // departmentName: departments?.find((obj) => obj?.id === r.department)
            //   ?.department,
            // serviceName: serviceNames?.find((obj) => obj?.id === r.service)
            //   ?.service,
          }))
        );
      });
  };

  const editRecord = (rows) => {
    console.log("Edit cha data:", rows);
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
    };

    axios
      .post(`${urls.BaseURL}/districtMaster/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getDistrictMaster();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  // Delete By ID
  //   const deleteById = (value) => {
  //     swal({
  //       title: "Delete?",
  //       text: "Are you sure you want to delete this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       axios
  //         .delete(`${urls.BaseURL}/districtMaster/discard/${value}`)
  //         .then((res) => {
  //           if (res.status == 226) {
  //             if (willDelete) {
  //               swal("Record is Successfully Deleted!", {
  //                 icon: "success",
  //               });
  //             } else {
  //               swal("Record is Safe");
  //             }
  //             getDepartment();
  //             getServiceName();
  //             setButtonInputState(false);
  //           }
  //         });
  //     });
  //   };

  const deleteById = (value, _activeFlag) => {
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
            .post(`${urls.CFCURL}/master/districtMaster/save`, body, {
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

                setButtonInputState(false);
                getDistrictMaster();
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
            .post(`${urls.CFCURL}/master/districtMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                setButtonInputState(false);
                getDistrictMaster();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
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

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    department: null,
    service: null,
    districtNameEn: "",
    districtNameMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    department: null,
    service: null,
    districtNameEn: "",
    districtNameMr: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },
    // {
    //   field: "departmentName",
    //   headerName: "Department ",
    //   flex: 1,
    // },

    // {
    //     field: "villageNameEng",
    //     headerName: "Village",
    //     // type: "number",
    //     flex: 1,
    //   },
    {
      field: "districtNameEn",
      headerName: "District Name(English)",
      // type: "number",
      flex: 1,
    },
    {
      field: "districtNameMr",
      headerName: "District Name(Marathi)",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "typeOfRemarks",
    //   headerName: "Type Of Remarks",
    //   // type: "number",
    //   flex: 1,
    // },
    {
      field: "status",
      headerName: "Status",
      //type: "number",
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
                const { departmentName, ...rest } = params.row;
                reset({ ...rest });
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
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
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
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
        District Master
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div>
                    <Grid
                      container
                      spacing={2}
                      style={{ marginTop: "5px", marginLeft: "5%" }}
                    >
                      <Grid item xs={4}>
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id="standard-basic"
                          label="District Name Eng*"
                          variant="standard"
                          {...register("districtNameEn")}
                          error={!!errors.districtNameEn}
                          helperText={
                            errors?.districtNameEn
                              ? errors.districtNameEn.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id="standard-basic"
                          label="District Name Mr"
                          variant="standard"
                          {...register("districtNameMr")}
                          error={!!errors.districtNameMr}
                          helperText={
                            errors?.districtNameMr
                              ? errors.districtNameMr.message
                              : null
                          }
                        />
                      </Grid>

                      {/* <Grid
                 Type Of Remarks
                  item xs={4}
                  // sx={{ marginTop: 5 }}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}
                  sx={{ width: 250, marginTop: 5 }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    // fullWidth
                    sx={{ width: "35%" }}
                    error={!!errors.typeOfRemarks}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="typeOfRemarks" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          variant="standard"
                          onChange={(value) => field.onChange(value)}
                          // label="Payment Mode"
                        >
                          {typeOfRemarks &&
                            typeOfRemarks.map((typeOfRemarks, index) => {
                              return (
                                <MenuItem key={index} value={typeOfRemarks.id}>
                                  {/* {typeOfRemarks.typeOfRemarks} */}
                      {/* Type Of Remarks
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="typeOfRemarks"
                      control={control}
                      defaultValue=""
                    /> */}
                      {/* <FormHelperText>
                      {errors?.department ? errors.department.message : null}
                    </FormHelperText> */}
                      {/* </FormControl>
                </Grid> */}
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      style={{ marginTop: "5%", marginLeft: "20%" }}
                    >
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        Exit
                      </Button>
                    </Grid>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn}>
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
            Add{" "}
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
