import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import urls from "../../../../URLS/urls";
// import styles from "../caseMainType/view.module.css";
import styles from "../../../../styles/LegalCase_Styles/paymentRate.module.css";

import schema from "../../../../containers/schema/LegalCaseSchema/paymentRateSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import theme from "../../../../theme.js";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
const Index = () => {
  // Schema
  // const generateSchema = (language) => {
  //   const baseSchema = yup.object({
  //     //
  //   });
  //   if(language ==="en"){
  //     return baseSchema.shapw
  //   }
  // };

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [loadderState, setLoadderState] = useState(true);

  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [tempCaseSubtype, setTempCaseSubtype] = useState();
  const router = useRouter();

  const [selectedOptionValue, setselectedOptionValue] = useState([]);

  const language = useSelector((state) => state.labels.language);

  const token = useSelector((state) => state.user.user.token);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 40,
    page: 1,
  });

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

  const [selectedDate, setSelectedDate] = useState(null);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getcaseMainTypes();
    getByCaseMainTypeAll();
  }, []);

  // useEffect(() => {
  //   getCaseSubType();
  // }, [caseMainTypes]);

  useEffect(() => {
    console.log("subTypes", caseSubTypes);
    getPaymentRate();
  }, [caseSubTypes]);

  useEffect(() => {
    getPaymentRate();
  }, [fetchData]);

  const getcaseMainTypes = () => {
    setLoadderState(true);

    axios
      .get(`${urls.LCMSURL}/master/caseMainType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseMainTypes(
          res.data.caseMainType.map((r, i) => ({
            id: r.id,
            caseMainType: r.caseMainType,
            caseMainTypeMr: r.caseMainTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getByCaseMainTypeAll = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseSubType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const caseSubTypes = res?.data?.caseSubType?.map((r, i) => ({
          id: r.id,
          subType: r.subType,
        }));

        setCaseSubTypes(caseSubTypes);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getCaseSubType = async (caseMainType) => {
    //  setValue("subType", "");
    if (caseMainType == null || caseMainType === "") {
      setCaseSubTypes([]);
      return;
    }
    try {
      const { data } = await axios.get(
        `${urls.LCMSURL}/master/caseSubType/getByCaseMainType?caseMainType=${caseMainType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const caseSubTypes = data.caseSubType.map((r, i) => ({
        id: r.id,
        subType: r.subType,
      }));
      console.log("caseSubTypes3232", caseSubTypes);
      setCaseSubTypes(caseSubTypes);
    } catch (err) {
      console.log("err", err);
      callCatchMethod(err, language);
    }
  };

  const caseMainType = watch("caseMainTypeId");

  //get subtype based on mainTypeId
  useEffect(() => {
    console.log("333", caseMainType);
    const getCaseSubType = async () => {
      //  setValue("subType", "");
      if (caseMainType == null || caseMainType === "") {
        setCaseSubTypes([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.LCMSURL}/master/caseSubType/getByCaseMainType?caseMainType=${caseMainType}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const caseSubTypes = data.caseSubType.map((r, i) => ({
          id: r.id,
          subType: r.subType,
        }));
        console.log("caseSubTypes3232", caseSubTypes);
        setCaseSubTypes(caseSubTypes);
      } catch (err) {
        console.log("err", err);
        callCatchMethod(err, language);
      }
    };
  }, [caseMainType]);

  // const getCaseSubType = () => {
  //   axios.get(`${urls.LCMSURL}/master/caseSubType/getAll`).then((res) => {
  //     setCaseSubTypes(
  //       res.data.caseSubType.map((r, i) => ({
  //         id: r.id,
  //         subType: r.subType,
  //         caseSubTypeMr: r.caseSubTypeMr,
  //       }))
  //     );
  //   });
  // };
  useEffect(() => {
    console.log("tempCaseSubtype", tempCaseSubtype);
  }, [tempCaseSubtype]);

  // Get Table - Data
  const getPaymentRate = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoadderState(true);

    axios
      .get(`${urls.LCMSURL}/master/paymentRate/getAllForMaster`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // params: {
        //   pageSize: _pageSize,
        //   pageNo: _pageNo,
        // },
      })
      .then((r) => {
        setLoadderState(false);

        console.log(";r", r);
        let result = r.data.paymentRate;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44", r);
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            // srNo: i + 1,
            srNo: i + 1,

            // caseMainType: r.caseMainType,
            caseMainTypeId: r.caseMainTypeId,
            caseMainType: caseMainTypes?.find(
              (obj) => obj?.id === r.caseMainTypeId
            )?.caseMainType,

            caseMainTypeMr: caseMainTypes?.find(
              (obj) => obj?.id === r.caseMainTypeId
            )?.caseMainTypeMr,

            caseSubType: r.caseSubType,
            caseSubType: caseSubTypes?.find((obj) => obj?.id === r.caseSubType)
              ?.subType,

            // caseSubTypeMr: caseSubTypes?.find(
            //   (obj) => obj?.id === r.caseSubType
            // )?.caseSubTypeMr,

            // subType: caseSubTypes?.find((obj) => obj?.id === r.caseSubType)
            //   ?.subType,

            caseSubTypeMr: caseSubTypes?.find(
              (obj) => obj?.id === r.caseSubType
            )?.caseSubTypeMr,

            rate: r.rate,

            fromDate: r?.fromDate,
            // fromDate: moment(r.fromDate).format("DD-MM-YYYY"),

            toDate: moment(r.toDate).format("DD-MM-YYYY"),

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          // rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LCMSURL}/master/paymentRate/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getAdvertisementCategoryDetails();
                getPaymentRate();
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
            .post(`${urls.LCMSURL}/master/paymentRate/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Safe", {
                  icon: "success",
                });
                // getAdvertisementCategoryDetails();
                getPaymentRate();
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

  useEffect(() => {
    console.log("aala", watch("caseSubType"));
  }, [watch("caseSubType")]);

  useEffect(() => {
    console.log("aala re", caseSubTypes);
  }, [caseSubTypes]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    const fromDate = moment(fromData.fromDate).format("YYYY-MM-DD");

    let _body = {
      ...fromData,

      // selectedOptionValue:fromData.selectedOptionValue,
      caseSubType: tempCaseSubtype,
      activeFlag: fromData.activeFlag,
      fromDate,
    };

    console.log("fromData", _body);

    let toDate1;

    if (fromData.toDate == "Invalid date") {
      toDate1 = null;
    } else {
      toDate1 = fromData.toDate;
    }
    let _body1 = {
      ...fromData,
      toDate: toDate1,
      caseSubType: tempCaseSubtype,

      // activeFlag: btnSaveText === "Update" ? fromData.activeFlag: null,
      // activeFlag: fromData.activeFlag,
      activeFlag: fromData.activeFlag,
    };

    if (btnSaveText === "Save") {
      setLoadderState(true);

      const tempData = axios
        .post(`${urls.LCMSURL}/master/paymentRate/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert(
              // "Saved!",
              language === "en" ? "Saved!" : "जतन केले!",
              // "Record Saved successfully !",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setLoadderState(true);

      const tempData = axios
        .post(`${urls.LCMSURL}/master/paymentRate/save`, _body1, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoadderState(false);

          console.log("res", res);
          if (res.status == 200) {
            fromData.id
              ? sweetAlert(
                  // "Updated!",
                  language === "en" ? "Updated!" : "जतन केले!",
                  // "Record Updated successfully !",
                  language === "en"
                    ? "Record Updated successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                )
              : sweetAlert(
                  // "Saved!",
                  language === "en" ? "Saved!" : "जतन केले!",
                  // "Record Saved successfully !",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
            getPaymentRate();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
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
    getByCaseMainTypeAll();
  };

  // cancell Button
  const cancellButton = () => {
    getByCaseMainTypeAll();
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    // caseCategory: "",
    caseMainType: "",
    rate: "",
    fromDate: "",
    toDate: "",
    caseSubType: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    caseMainType: "",
    rate: "",
    caseSubType: "",
    fromDate: "",
    toDate: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },

    {
      // field: "caseTypeName",
      field: language === "en" ? "caseMainType" : "caseMainTypeMr",

      headerName: <FormattedLabel id="caseType" />,
      //type: "number",
      flex: 1,
    },

    {
      // field: "caseSubTypeName",
      // field: language === "en" ? "caseSubType" : "caseSubTypeMr",
      field: "caseSubType",

      headerName: <FormattedLabel id="caseSubType" />,
      flex: 1,
    },

    {
      field: "rate",
      headerName: <FormattedLabel id="rate" />,
      flex: 1,
    },

    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,

      // headerName: "From Date",
      flex: 1,
    },

    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,

      // headerName: "To Date",
      flex: 1,
    },

    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
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
                getByCaseMainTypeAll();
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
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
          </Box>
        );
      },
    },
  ];

  // View
  return (
    <>
      <Box
        sx={{
          marginLeft: "1vw",
        }}
      >
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>

      {/* Loader */}
      {loadderState ? (
        <Loader />
      ) : (
        // <div
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       height: "60vh", // Adjust itasper requirement.
        //     }}
        //   >
        //     <Paper
        //       style={{
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //         background: "white",
        //         borderRadius: "50%",
        //         padding: 8,
        //       }}
        //       elevation={8}
        //     >
        //       <CircularProgress color="success" />
        //     </Paper>
        //   </div>

        <>
          {/* <ThemeProvider theme={theme}> */}
          <Paper
            elevation={8}
            variant="outlined"
            sx={{
              border: 1,
              borderColor: "grey.500",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "10px",
              marginBottom: "60px",
              padding: 1,
            }}
          >
            <Box
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              //   paddingTop: "10px",

              //   background:
              //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              // }}

              style={{
                // backgroundColor: "#0084ff",
                backgroundColor: "#556CD6",
                // backgroundColor: "#1C39BB",
                display: "flex",
                justifyContent: "center",

                // #00308F
                color: "white",
                // fontSize: 19,
                marginTop: 30,
                // marginBottom: "50px",
                // // marginTop: ,
                // padding: 8,
                // paddingLeft: 30,
                // marginLeft: "50px",
                // marginRight: "75px",
                borderRadius: 100,
                height: "8vh",
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginTop: "1vh",
                }}
              >
                <FormattedLabel id="caseFees" />
              </h2>
            </Box>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid
                      container
                      sx={{ marginLeft: "30px", marginTop: "10vh" }}
                    >
                      <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                        {/* Case Type  */}
                        {/* <FormControl
                        sx={{ marginTop: "35px" }}
                        error={!!errors.caseMainTypeId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="caseType" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="caseType" />}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("T") ? true : false) ||
                                  (router.query.T ? true : false),
                              }}
                            >
                              {caseMainTypes &&
                                caseMainTypes.map((caseMainType, index) => (
                                  <MenuItem key={index} value={caseMainType.id}>
                                    {language == "en"
                                      ? caseMainType?.caseMainType
                                      : caseMainType?.caseMainTypeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="caseMainTypeId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.caseMainTypeId
                            ? errors.caseMainTypeId.message
                            : null}
                        </FormHelperText>
                      </FormControl> */}

                        {/* New Autocomplete  */}
                        <FormControl
                          // variant="outlined"
                          error={!!errors?.caseMainTypeId}
                          // sx={{ marginTop: 2 }}
                        >
                          <Controller
                            name="caseMainTypeId"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                              <Autocomplete
                                variant="standard"
                                id="controllable-states-demo"
                                sx={{ width: 300 }}
                                onChange={(event, newValue) => {
                                  onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                                  getCaseSubType(newValue?.id);
                                }}
                                value={
                                  caseMainTypes?.find(
                                    (data) => data?.id === value
                                  ) || null
                                }
                                options={caseMainTypes} //! api Data
                                getOptionLabel={(caseMainType) =>
                                  language == "en"
                                    ? caseMainType?.caseMainType
                                    : caseMainType?.caseMainTypeMr
                                } //! Display name the Autocomplete
                                renderInput={(params) => (
                                  //! display lable list
                                  <TextField
                                    fullWidth
                                    {...params}
                                    label={
                                      language == "en"
                                        ? "Case Type"
                                        : "प्रकरणाचा प्रकार"
                                    }
                                    // variant="outlined"
                                    variant="standard"
                                  />
                                )}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.caseMainTypeId
                              ? errors?.caseMainTypeId?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                        <FormControl error={!!errors.caseSubType}>
                          <InputLabel id="demo-simple-select-standard-label"></InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Autocomplete
                                // fullWidth
                                sx={{ width: 300 }}
                                {...field}
                                variant="standard"
                                id="free-solo-2-demo"
                                disableClearable
                                options={caseSubTypes.map(
                                  (option) => option.subType
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    label={<FormattedLabel id="caseSubType" />}
                                    InputProps={{
                                      ...params.InputProps,
                                      type: "search",
                                    }}
                                    variant="standard"
                                  />
                                )}
                                onChange={(event, value) => {
                                  field.onChange(value);

                                  let temp = 0;
                                  caseSubTypes.filter((item) => {
                                    if (item.subType == value) {
                                      temp = item.id;
                                    }
                                  });

                                  setTempCaseSubtype(temp);

                                  console.log("checkSubtypeId", temp);
                                  console.log(event.target.value);
                                }}
                              />
                            )}
                            name="caseSubType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.caseSubType
                              ? errors.caseSubType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                        {/* New Exp */}
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                        <TextField
                          variant="standard"
                          sx={{
                            // marginTop: "10vh",
                            width: 300,
                          }}
                          label={<FormattedLabel id="rate" required />}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("rate") ? true : false) ||
                              (router.query.rate ? true : false),
                          }}
                          {...register("rate")}
                          error={!!errors.rate}
                          helperText={errors?.rate ? errors.rate.message : null}
                        />
                      </Grid>

                      {/* 2nd Row */}
                      {/* From Date */}
                      <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                        <FormControl
                          style={{
                            backgroundColor: "white",
                            width: 300,
                            marginTop: "8vh",
                          }}
                          error={!!errors.toDate}
                        >
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="fromDate" />
                                    </span>
                                  }
                                  value={field.value || null}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      variant="standard"
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.fromDate ? errors.fromDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* To Date */}
                      <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                        <FormControl
                          sx={{ width: 300, marginTop: "8vh" }}
                          // error={!!errors.date}
                        >
                          <Controller
                            name="toDate"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      {/* To Date */}
                                      {<FormattedLabel id="toDate" />}
                                    </span>
                                  }
                                  value={field.value || null}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      disabled
                                      {...params}
                                      variant="standard"
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          // marginTop: 3,
                                        },

                                        //true
                                        shrink:
                                          (watch("toDate") ? true : false) ||
                                          (router.query.toDate ? true : false),
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          {/* <FormHelperText>
                          {errors?.date ? errors.date.message : null}
                        </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      {/* Row Button */}
                      <Grid
                        container
                        spacing={5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10vh",
                        }}
                      >
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText === "Update" ? (
                              <FormattedLabel id="update" />
                            ) : (
                              <FormattedLabel id="save" />
                            )}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </Grid>
                      {/* </div> */}
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>

            <div className={styles.addbtn}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                // type='primary'
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
            </div>
            <DataGrid
              // disableColumnFilter
              // disableColumnSelector
              // disableToolbarButton
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,

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
              // rows={dataSource}
              // columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              //checkboxSelection

              // autoHeight={true}
              // rowHeight={50}
              // loading={data.loading}
              // density="compact"
              // pagination
              // paginationMode="server"
              // rowCount={data.totalRows}
              // rowsPerPageOptions={data.rowsPerPageOptions}
              // page={data.page}
              pageSize={40}
              // pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              rowsPerPageOptions={[40]}

              // onPageChange={(_data) => {
              //   getPaymentRate(data.pageSize, _data);
              // }}
              // onPageSizeChange={(_data) => {
              //   console.log("222", _data);
              //   // updateData("page", 1);
              //   getPaymentRate(_data, data.page);
              // }}
            />
          </Paper>
          {/* </ThemeProvider> */}
        </>
      )}

      {/*  */}
    </>
  );
};

export default Index;
