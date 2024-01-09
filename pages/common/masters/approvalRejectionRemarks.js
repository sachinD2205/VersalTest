import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Box,
  TextField,
  Tooltip,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import router from "next/router";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import styles from "../../../styles/view.module.css";
import { Divider } from "antd";
import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Head from "next/head";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import Loader from "../../../containers/Layout/components/Loader";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
const NewIndex = () => {
  let schema = yup.object().shape({
    departmentId: yup.string().required("Please select a department name."),
    serviceId: yup.string().required("Please select a service name."),
    // type: yup.string().required("Please select type."),
    remarkMr: yup.string().required("Please enter remark in English."),
    remark: yup.string().required("Please enter remark in Marathi."),
  });
  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  let isDisabled = false,
    DataBharaychaKiNahi,
    isAcknowledgement,
    isSave;

  if (router.query.pageMode === "view") {
    DataBharaychaKiNahi = true;
    isDisabled = true;
    isAcknowledgement = true;
    isSave = false;
  }
  const [btnSaveText, setBtnSaveText] = useState("Save");
  // const [dataSource, setDataSource] = useState([]);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [departmentDropDown, setDepartmentDropDown] = useState([]);
  const [serviceDropDown, setServiceDropDown] = useState([]);
  const [remarkTable, setRemarkTable] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [runAgain, setRunAgain] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [applications, setApplications] = useState([]);
  const token = useSelector((state) => state.user.user.token);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getApplication();
    getDepartment();
    getServices();
  }, []);

  const getApplication = async () => {
    // setOpen(true);

    await axios
      .get(`${urls.BaseURL}/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("11r", r);
        setApplications(
          // r?.data?.application?.map((row) => ({
          //   id: row.id,
          //   appCode: row.appCode,
          //   applicationNameEng: row.applicationNameEng,
          //   applicationNameMr: row.applicationNameMr,
          //   module: row.module,
          // })),
          r?.data?.application
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Department cha: ", r.data);
        setDepartmentDropDown(
          // @ts-ignore
          // r.data.department.map((j, i) => ({
          //   id: j.id,
          //   departmentId: j.department, //This is Department Name, not id
          // })),
          r.data.department
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Service cha data:", r.data);
        setServiceDropDown(
          // r.data.service.map((j, i) => ({
          //   id: j.id,
          //   serviceId: j.serviceName,
          // })),
          r.data.service
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // useEffect(() => {
  //   setRunAgain(false);

  // }, [runAgain]);

  // useEffect(() => {

  // }, [departmentDropDown]);

  //APPROVAL REJECTION REMARKS

  useEffect(() => {
    setRunAgain(false);
    getApprovalRejectionRemarks();
  }, [departmentDropDown, serviceDropDown, applications]);

  // get all data
  const getApprovalRejectionRemarks = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/approvalRejectionRemarks/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        let result = res.data.approvalRejection;
        let _res = result.map((j, i) => {
          console.log("res payment mode", res);
          return {
            id: j.id,
            srNo: Number(_pageNo + "0") + i + 1,

            // serviceId: j.serviceId ? getServiceName(j.serviceId) : "-",
            // departmentId: j.departmentId ? getDepartmentName(j.departmentId) : "-",
            applicationId: j.applicationId,
            applicationCol: applications.find((f) => f.id == j.applicationId)
              ?.applicationNameEng,

            departmentId: j.departmentId,
            departmentCol: departmentDropDown.find(
              (f) => f.id == j.departmentId
            )?.department,

            serviceId: j.serviceId,

            serviceCol: serviceDropDown.find((f) => f.id == j.serviceId)
              ?.serviceName,
            // departmentId:getDepartmentName(j.departmentId),
            // serviceId:getServiceName(j.serviceId),
            // departmentId: departmentDropDown?.find((obj) => obj?.id === j.departmentId)?.departmentId,

            // type: j.type ? j.type : '-',
            remarkMr: j.remarkMr,
            remark: j.remark,
            activeFlag: j.activeFlag,
            status: j.activeFlag === "Y" ? "Active" : "InActive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    console.log("aala", isOpenCollapse);
  }, [isOpenCollapse]);
  function getDepartmentName(value) {
    // @ts-ignore
    return departmentDropDown.find((obj) => obj?.id === value)?.departmentId;
  }
  function getServiceName(value) {
    // @ts-ignore
    return serviceDropDown.find((obj) => obj?.id === value)?.serviceId;
  }

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      width: 70,
    },
    {
      field: "applicationCol",
      headerName: "Application Name",
      width: 250,
    },
    {
      field: "departmentCol",
      headerName: "Department Name",
      width: 250,
    },
    {
      field: "serviceCol",
      headerName: "Service Name",
      width: 250,
    },

    {
      field: "remark",
      headerName: "Remark in English",
      width: 150,
    },
    {
      field: "remarkMr",
      headerName: "Remark in Marathi",
      width: 170,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update");
                  setID(params.row.id);
                  setIsOpenCollapse(true);
                  setSlideChecked(true);
                  setButtonInputState(true);
                  console.log("params.row: ", params.row);
                  reset(params.row);
                }}
              >
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  const editById = (values) => {
    console.log("Edit sathi: ", values);

    const deptId = departmentDropDown.find(
      // @ts-ignore
      (obj) => obj?.departmentId === values.departmentId
      // @ts-ignore
    )?.id;
    const serviceId = serviceDropDown.find(
      // @ts-ignore
      (obj) => obj?.serviceId === values.serviceId
      // @ts-ignore
    )?.id;
    const appId = applications.find(
      // @ts-ignore
      (obj) => obj?.applicationId === values.applicationId
      // @ts-ignore
    )?.id;

    reset({
      ...values,
      departmentId: deptId,
      serviceId: serviceId,
      applicationId: appId,
    });
    setCollapse(true);
  };

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
            .post(`${urls.CFCURL}/master/approvalRejectionRemarks/save`, body, {
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
                getApprovalRejectionRemarks();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
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
            .post(`${urls.CFCURL}/master/approvalRejectionRemarks/save`, body, {
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
                getApprovalRejectionRemarks();
                // setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };
  // const deleteById = async (id) => {
  //   sweetAlert({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this record!",
  //     icon: "warning",
  //     buttons: ["Cancel", "Delete"],
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${urls.CFCURL}/master/approvalRejectionRemarks/save/${id}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             sweetAlert(
  //               "Deleted!",
  //               "Record Deleted successfully !",
  //               "success"
  //             );
  //             setRunAgain(true);
  //           }
  //         });
  //     }
  //   });
  // };

  const onBack = () => {
    setCollapse(false);
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);

    // const urlLength = router.asPath.split('/').length
    // const urlArray = router.asPath.split('/')
    // let backUrl = ''
    // if (urlLength > 2) {
    //   for (let i = 0; i < urlLength - 1; i++) {
    //     backUrl += urlArray[i] + '/'
    //   }
    //   console.log('Final URL: ', backUrl)
    //   router.push(`${backUrl}`)
    // } else {
    //   router.push('/dashboard')
    // }
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    id: null,
    departmentId: "",
    applicationId: "",
    serviceId: "",
    type: "",
    remark: "",
    remarkMr: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // const onSubmit = async (data) => {
  //   console.log("Form Data: ", data);

  //   const bodyForAPI = {
  //     ...data,
  //   };

  //   console.log("Sagla data append kelya nantr: ", bodyForAPI);

  //   await axios
  //     .post(
  //       `${urls.CFCURL}/master/approvalRejectionRemarks/save`,
  //       bodyForAPI
  //     )
  //     .then((response) => {
  //       if (response.status === 200 || response.status === 200) {
  //         if (data.id) {
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");
  //         } else {
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         }
  //         setRunAgain(true);
  //         reset({ ...resetValuesCancell, id: null });
  //       }
  //     });
  // };

  const onSubmit = (formData) => {
    // console.log("231",formData);
    const finalBodyForApi = {
      ...formData,
      // activeFlag: btnSaveText === "Update" ? null : null,
    };

    axios
      .post(
        `${urls.CFCURL}/master/approvalRejectionRemarks/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          // getDepartmentName();
          getApprovalRejectionRemarks();
          // getServiceName();
          // setRunAgain();
          setCollapse(false);
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          // setDeleteButtonState(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
      {/* <Head>
        <title>Approval/Rejection Remarks</title>
      </Head> */}
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
        Approval/Rejection Remarks
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>

      <Paper className={styles.main}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* <Divider orientation='left' style={{ marginBottom: '2%' }}>
            <h3>Approval/Rejection Remarks</h3>
          </Divider> */}
            {/* <Button
            sx={{ marginBottom: 2, marginLeft: 5 }}
            onClick={() => {
              if (!collapse) {
                setCollapse(true);
              } else {
                setCollapse(false);
              }
            }}
            variant="contained"
            endIcon={<Add />}
          >
          ADD
          </Button> */}

            <Button
              variant="contained"
              endIcon={<Add />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesCancell,
                });
                setEditButtonInputState(true);
                // setDeleteButtonState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setCollapse(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />
            </Button>

            {isOpenCollapse && (
              <Slide
                direction="down"
                in={isOpenCollapse}
                mountOnEnter
                unmountOnExit
              >
                <Paper style={{ padding: "3% 3%" }}>
                  <>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.row}>
                          <Grid
                            item
                            xs={3}
                            // sx={{ marginTop: 5 }}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControl
                              variant="standard"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 36,
                              }}
                              // sx={{ width: 250, marginTop: 5, marginLeft: 12 }}
                              error={!!errors.applicationId}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                Application Name
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ width: 250 }}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Application Name"
                                  >
                                    {applications &&
                                      applications?.map(
                                        (applicationNameEng, index) => (
                                          <MenuItem
                                            key={index}
                                            value={applicationNameEng.id}
                                          >
                                            {
                                              applicationNameEng.applicationNameEng
                                            }
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="applicationId"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.applicationId
                                  ? errors.applicationId.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <FormControl
                            sx={{ width: "300px", marginTop: "2%" }}
                            variant="standard"
                            error={!!errors.departmentId}
                          >
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              disabled={isDisabled}
                            >
                              Department Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  disabled={isDisabled}
                                  // value={router.query.departmentId ? router.query.departmentId : field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="departmentId"
                                >
                                  {departmentDropDown &&
                                    departmentDropDown.map((value, index) => (
                                      <MenuItem key={index} value={value?.id}>
                                        {value.department}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="departmentId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.departmentId
                                ? errors.departmentId.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                          <FormControl
                            sx={{ width: "250px", marginTop: "2%" }}
                            variant="standard"
                            error={!!errors.serviceId}
                          >
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              disabled={isDisabled}
                            >
                              Service Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  disabled={isDisabled}
                                  // value={router.query.serviceId ? router.query.serviceId : field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="serviceId"
                                >
                                  {serviceDropDown &&
                                    serviceDropDown.map((value, index) => (
                                      <MenuItem key={index} value={value.id}>
                                        {value.serviceName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="serviceId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.serviceId
                                ? errors.serviceId.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                          {/* <FormControl
                          sx={{ width: "200px", marginTop: "2%" }}
                          variant="standard"
                          error={!!errors.type}
                        >
                          <InputLabel
                            id="demo-simple-select-standard-label"
                            disabled={isDisabled}
                          >
                            Type
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.type
                                    ? router.query.type
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label="type"
                              >
                                <MenuItem value={"Approval"}>Approval</MenuItem>
                                <MenuItem value={"Rejection"}>
                                  Rejection
                                </MenuItem>
                              </Select>
                            )}
                            name="type"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.type ? errors.type.message : null}
                          </FormHelperText>
                        </FormControl> */}
                        </div>

                        <div
                          className={styles.row}
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "450px",
                              // marginRight: '5%',
                              marginTop: "2%",
                            }}
                            id="standard-basic"
                            label="Remark in English*"
                            variant="standard"
                            {...register("remark")}
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.remark ? router.query.remark : ""
                            }
                          />
                          <TextField
                            sx={{
                              width: "450px",
                              // marginRight: '5%',
                              marginTop: "2%",
                            }}
                            id="standard-basic"
                            label="Remark in Marathi *"
                            variant="standard"
                            {...register("remarkMr")}
                            error={!!errors.remarkMr}
                            helperText={
                              errors?.remarkMr ? errors.remarkMr.message : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.remarkMr ? router.query.remarkMr : ""
                            }
                          />
                        </div>
                        <div className={styles.buttons}>
                          <Button
                            sx={{
                              width: "100px",
                              height: "40px",
                            }}
                            variant="contained"
                            type="submit"
                            endIcon={<Save />}
                          >
                            {btnSaveText}
                            {/* <FormattedLabel id={btnSaveText} /> */}
                          </Button>
                          <Button
                            sx={{
                              width: "100px",
                              height: "40px",
                            }}
                            variant="outlined"
                            color="error"
                            endIcon={<Clear />}
                            onClick={cancellButton}
                          >
                            Clear
                          </Button>
                          <Button
                            sx={{
                              width: "100px",
                              height: "40px",
                            }}
                            variant="contained"
                            color="error"
                            onClick={() => onBack()}
                            endIcon={<ExitToApp />}
                          >
                            Exit
                          </Button>
                        </div>
                      </form>
                    </FormProvider>
                  </>
                </Paper>
              </Slide>
            )}

            {/* <div
            className={styles.table}
            style={{ display: "flex", alignItems: "center" }}
          >
            <DataGrid
              sx={{
                marginTop: "5vh",
                marginBottom: "3vh",
                height: 370.5,
                width: 1005,
              }}
              rows={dataSource}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div> */}

            <Box style={{ display: "flex" }}>
              <DataGrid
                sx={{
                  backgroundColor: "white",
                  // overflowY: "scroll",

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
                autoHeight={data.pageSize}
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
                  getApprovalRejectionRemarks(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getApprovalRejectionRemarks(_data, data.page);
                }}
              />
            </Box>
          </>
        )}
      </Paper>
    </>
  );
};

export default NewIndex;
