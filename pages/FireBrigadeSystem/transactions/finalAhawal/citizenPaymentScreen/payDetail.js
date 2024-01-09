import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import sweetAlert from "sweetalert";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormattedLabel from "../../../../../components/../containers/reuseableComponents/FormattedLabel";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import styles from "../../../../../styles/fireBrigadeSystem/view.module.css";
import LoiGenerationRecipt from "../loiRecipt";

import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// import { makeStyles } from "@material-ui/core/styles";
import Table from "@mui/material/Table";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

// style for tablenpm install @material-ui/styles

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: "#D7DBDD",
    // color: "blue",
    backgroundColor: "#337AFF",
    color: "white",
    fontSize: "15px",
    // color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

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

// const useStyles = makeStyles({
//   finalRow: {
//     backgroundColor: "lightblue",
//   },
// });

// style end

// import LoiGenerationRecipt from "../components/"
// import theme from "";
import { useRouter } from "next/router";
import urls from "../../../../../URLS/urls";
// import LoiCollectionComponent from "./LoiCollectionComponent";
// Loi Generation
const PayDetail = () => {
  // const classes = useStyles();
  const userToken = useGetToken();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmitForm = (r) => {
    console.log("pppp", r);
    const finalBody = {
      // ...fromData,

      role: "LOI_GENERATION",

      chargeRate,

      mailID: r.mailID,
      paymentLink:
        "http://localhost:4000/FireBrigadeSystem/transactions/firstAhawal/citizenPaymentScreen/Citizenpayment",

      informerName: r.informerName,
      informerNameMr: r.informerNameMr,
      informerLastName: r.informerLastName,
      informerLastNameMr: r.informerLastNameMr,
      informerMiddleName: r.informerMiddleName,
      informerMiddleNameMr: r.informerMiddleNameMr,
      city: r.city,
      cityMr: r.cityMr,
      area: r.area,
      areaMr: r.areaMr,
      contactNumber: r.contactNumber,
      pinCode: r.pinCode,
    };
    console.log("fffff", finalBody);
    axios
      .post(`${urls.FbsURL}/trnLoi/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          r.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.back();
        }
      });
    // .catch((err) => {
    //   if (err.status == 500) {
    //     sweetAlert("Error:", err);
    //   }
    // });
  };

  // useEffect(() => {
  //   getCharge();
  // }, []);

  // const [charge, setCharge] = useState();

  // const getCharge = () => {
  //   axios
  //     .get("${urls.FbsURL}/master/chargeType/getAll")
  //     .then((res) => {
  //       console.log("charge", res?.data?.chargeType);
  //       setCharge(res?.data?.chargeType);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // const rows = [
  //   charge &&
  //     charge.map((data, index) =>
  //       createData(
  //         <>{index}</>,
  //         <>{data.chargeName}</>,
  //         "Mandatory",
  //         <div style={{ background: "#D0D3D4", padding: "2px" }}>
  //           <input
  //             type="file"
  //             name="myImage"
  //             onChange={(event) => {
  //               console.log(event.target.files[0]);
  //               setSelectedImage(event.target.files[0]);
  //             }}
  //           />
  //         </div>,
  //         <span>Upload</span>
  //       )
  //     ),
  // ];

  useEffect(() => {
    getChargeName();
    getChargeRate();
    getEmrData();
    getPinCode();
  }, []);

  const [crPincodes, setCrPinCodes] = useState();
  const [chargeName, setChargeName] = useState();
  const [emergencyService, setEmergencyService] = useState();

  // fetch pin code from cfc
  const getPinCode = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("pin", res?.data?.pinCode);
        setCrPinCodes(res?.data?.pinCode);
      })
      .catch((err) => console.log(err));
  };

  // Get Charge Name
  const getChargeName = () => {
    axios
      .get(`${urls.FbsURL}/master/chargeType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setChargeName(res?.data?.chargeType);
      });
  };

  // set table data
  const [chargeRate, setChargeRate] = useState([]);

  // Get Charge Rate
  const getChargeRate = () => {
    axios
      .get(`${urls.FbsURL}/chargeTypeRateEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("qstandByDuty", router.query.standByDuty);
        console.log("rescueVardi", router.query.rescueVardi);
        const filterData = res?.data?.chargeTypeRate
          ?.filter(
            (data, index) =>
              data.id == router.query.pumpingCharge ||
              data.id == router.query.standByDuty ||
              data.id == router.query.rescueVardi ||
              data.id == router.query.thirdCharge
          )
          .map((row) => ({
            ...row,
            calculateOn: row.calculateOn
              ? row.calculateOn + " = " + router.query.numberOfTrip
              : "",
            amount: row.rate * router.query.numberOfTrip,
            id: null,
            activeFlag: null,
            thirdCharge: null,
          }));

        setChargeRate(filterData);
      });
  };

  console.log("chargeRate", chargeRate);

  // useEffect(() => {
  //   let test = chargeRate?.find(
  //     (obj) => obj.id == router.query.chargesApply
  //   )?.subCharge;
  //   console.log("dsf", test);

  // }, [chargeRate]);

  // Get Emergency Service Data
  const getEmrData = () => {
    axios
      .get(`${urls.FbsURL}/transaction/trnEmergencyServices/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setEmergencyService(res?.data?.emergencyService);
        // let result = res?.data?.map((r) => {
        //   return {
        //     chargesApply: r.chargesApply,
        //   };
        // });
        // console.log("result", result);
        // setEmergencyService(result);
      });
  };

  console.log("emergencyService", emergencyService);

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("dddd", router.query.numberOfTrip);

      reset(router.query);
    }
  }, []);

  // const {
  //   control,
  //   register,
  //   reset,
  //   formState: { errors },
  // } = useForm();

  const router = useRouter();

  useEffect(() => {
    getServices();
    getChargeTypeRate();
  }, []);

  const [services, setServices] = useState();

  const getServices = () => {
    axios
      .get("${urls.CFCURL}/master/service/getAll", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => setServices(res?.data?.service))
      .catch((error) => console.log(error));
  };

  const [chargeTypeRate, setchargeTypeRate] = useState();

  const getChargeTypeRate = () => {
    axios
      .get("${urls.FbsURL}/chargeTypeRateEntry/getAll", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("123", res);
        return setchargeTypeRate(res?.data?.chargeTypeRate);
      })
      .catch((error) => console.log(error));
  };

  const language = useSelector((state) => state?.labels.language);

  const [loiGenerationReceiptDailog, setLoiGenerationReceiptDailog] =
    useState(false);
  const loiGenerationReceiptDailogOpen = () =>
    setLoiGenerationReceiptDailog(true);
  const loiGenerationReceiptDailogClose = () =>
    setLoiGenerationReceiptDailog(false);

  // const loi Recipit
  const loiGenerationReceipt = () => {
    loiGenerationReceiptDailogOpen();
  };

  useEffect(() => {
    console.log("title", getValues("title"));
    console.log("serviceName", getValues("serviceName"));
    console.log("firstName", getValues("firstName"));
  }, []);

  // title
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios
      .get(`${urls.CfcURLMaster}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setTitles(
          r.data.title.map((row) => ({
            id: row.id,
            title: row.title,
            titleMr: row.titleMr,
          }))
        );
      });
  };

  const [licenseType, setlicenseType] = useState([]);

  const getlicenseType = () => {
    axios
      .get(`${urls.SSLM}/master/MstLicenseType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setlicenseType(
          r.data.MstLicenseType.map((row) => ({
            id: row.id,
            licenseTypeEn: row.licenseType,
            licenseTypeMar: row.licenseTypeMar,
          }))
        );
      });
  };

  // const [serviceCharges, setServiceCharges] = useState([]);

  // const getServiceCharges = () => {
  //   axios.get(`${urls.HMSURL}/servicecharges/getAll`).then((r) => {
  //     setServiceCharges(
  //       r.data.serviceCharge.map((row) => ({
  //         id: row.id,
  //         serviceChargeType: row.serviceChargeType,
  //         charge: row.charge,
  //         amount: row.amount,
  //       }))
  //     );
  //   });
  // };

  const [durationOfLicense, setdurationOfLicense] = useState([]);

  const getdurationOfLicense = () => {
    axios
      .get(`${urls.HMSURL}/licenseValidity/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setdurationOfLicense(
          r.data.licenseValidity.map((row) => ({
            id: row.id,
            durationOfLicense: row.durationOfLicense,
            durationOfLicensemr: row.durationOfLicenseMr,
          }))
        );
      });
  };

  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CfcURLMaster}/service/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            }))
          );
        } else {
          message.error("Filed To Load !! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.success("Error !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // const onSubmitForm = (fromData) => {
  //   console.log("fromData", fromData);

  //   const finalBody = {
  //     ...fromData,
  //     dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
  //       "YYYY-MM-DDThh:mm:ss"
  //     ),
  //     departureTime: moment(fromData.departureTime, "HH:mm").format("HH:mm"),
  //   };
  //   axios
  //     .post(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
  //       finalBody
  //     )
  //     .then((res) => {
  //       if (res.status == 200) {
  //         fromData.id
  //           ? sweetAlert("Update!", "Record Updated successfully !", "success")
  //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         router.back();
  //       }
  //     });
  // };

  useEffect(() => {
    getserviceNames();
    getTitles;
    getlicenseType();
    getdurationOfLicense();
    // getServiceCharges();
  }, []);

  // ServiceName
  const [serviceNames, setServiceNames] = useState([]);
  // const [test, setText] = useState();

  // verify LOI
  const verifyLoi = () => {};

  const [total, setTotal] = useState();
  useEffect(() => {
    let total1 = 0;
    chargeRate.forEach((data, index) => {
      total1 += data.amount;
    });
    setTotal(total1);
  }, [chargeRate]);

  // const columns = [
  //   {
  //     field: "Sr.No",
  //     headerName: <FormattedLabel id="srNo" />,
  //     flex: 1,
  //   },
  //   {
  //     field: "chargeName",
  //     // headerName: <FormattedLabel id="buildingPurposeMr" />,
  //     headerName: "Description",
  //     flex: 1,
  //   },
  //   {
  //     field: "unit",
  //     // headerName: <FormattedLabel id="buildingPurposeMr" />,
  //     headerName: "Unit",
  //     flex: 1,
  //   },
  //   {
  //     field: "dependsOn",
  //     // headerName: <FormattedLabel id="buildingPurposeMr" />,
  //     headerName: "Depends On",
  //     flex: 1,
  //   },
  //   {
  //     field: "actions",
  //     headerName: <FormattedLabel id="actions" />,
  //     width: 120,
  //     sortable: false,
  //     disableColumnMenu: true,
  //     renderCell: (params) => {
  //       return (
  //         <>
  //           <IconButton
  //             className={styles.edit}
  //             disabled={editButtonInputState}
  //             onClick={() => {
  //               setIsOpenCollapse(false),
  //                 setBtnSaveText("Update"),
  //                 setID(params.row.id),
  //                 setIsOpenCollapse(true),
  //                 setSlideChecked(true);
  //               setButtonInputState(true);
  //               setEditButtonInputState(true);
  //               setDeleteButtonState(true);
  //               reset(params.row);
  //             }}
  //           >
  //             <EditIcon />
  //           </IconButton>
  //           <IconButton
  //             className={styles.delete}
  //             disabled={deleteButtonInputState}
  //             onClick={() => deleteById(params.id)}
  //           >
  //             <DeleteIcon />
  //           </IconButton>
  //         </>
  //       );
  //     },
  //   },
  // ];

  return (
    <>
      <Box
        style={{
          margin: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
                      pathname:
                        "/FireBrigadeSystem/transactions/firstAhawal/citizenPaymentScreen/Citizenpayment",
                    })
                  }
                />
              </IconButton>
              <h5>Application Number</h5>
              {/* <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "rgb(7 110 230 / 91%)",
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

                LOI Generation
              </Typography> */}
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
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.small}>
                  <Box className={styles.tableHead}>
                    <Box className={styles.feildHead}>
                      {<FormattedLabel id="informerDetails" />}
                    </Box>
                  </Box>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        // size="small"
                        id="standard-basic"
                        label={<FormattedLabel id="informerName" />}
                        variant="standard"
                        {...register("informerName")}
                        error={!!errors.informerName}
                        helperText={
                          errors?.informerName
                            ? errors.informerName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerMiddleName" />}
                        variant="standard"
                        {...register("informerMiddleName")}
                        error={!!errors.informerMiddleName}
                        helperText={
                          errors?.informerMiddleName
                            ? errors.informerMiddleName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerLastName" />}
                        variant="standard"
                        {...register("informerLastName")}
                        error={!!errors.informerLastName}
                        helperText={
                          errors?.informerLastName
                            ? errors.informerLastName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerNameMr" />}
                        variant="standard"
                        {...register("informerNameMr")}
                        error={!!errors.informerNameMr}
                        helperText={
                          errors?.informerNameMr
                            ? errors.informerNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerMiddleNameMr" />}
                        variant="standard"
                        {...register("informerMiddleNameMr")}
                        error={!!errors.informerMiddleNameMr}
                        helperText={
                          errors?.informerMiddleNameMr
                            ? errors.informerMiddleNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="informerLastNameMr" />}
                        variant="standard"
                        {...register("informerLastNameMr")}
                        error={!!errors.informerLastNameMr}
                        helperText={
                          errors?.informerLastNameMr
                            ? errors.informerLastNameMr.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="area" />}
                        variant="standard"
                        {...register("area")}
                        error={!!errors.area}
                        helperText={errors?.area ? errors.area.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="city" />}
                        variant="standard"
                        {...register("city")}
                        error={!!errors.city}
                        helperText={errors?.city ? errors.city.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        variant="standard"
                        sx={{ width: "55%" }}
                        error={!!errors.pinCode}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Pin Code
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Pin Code"
                            >
                              {crPincodes &&
                                crPincodes.map((crPincode, index) => (
                                  <MenuItem key={index} value={crPincode.id}>
                                    {crPincode.pinCode}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="pinCode"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.pinCode ? errors.pinCode.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="areaMr" />}
                        variant="standard"
                        {...register("areaMr")}
                        error={!!errors.areaMr}
                        helperText={
                          errors?.areaMr ? errors.areaMr.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="cityMr" />}
                        variant="standard"
                        {...register("cityMr")}
                        error={!!errors.cityMr}
                        helperText={
                          errors?.cityMr ? errors.cityMr.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="contactNumber" />}
                        variant="standard"
                        {...register("contactNumber")}
                        error={!!errors.contactNumber}
                        helperText={
                          errors?.contactNumber
                            ? errors.contactNumber.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="email" />}
                        variant="standard"
                        {...register("mailID")}
                        error={!!errors.mailID}
                        helperText={
                          errors?.mailID ? errors.mailID.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                  <br />
                  <br />
                  {/* <div className={styles.details}>
                    <div className={styles.h1Tag}>
                      <h3
                        style={{
                          color: "white",
                          marginTop: "5px",
                          paddingLeft: 10,
                        }}
                      >
                        Charge Details
                      </h3>
                    </div>
                  </div> */}
                  <br />
                  <br />

                  <div className={styles.small}>
                    <div className={styles.row}>
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 700 }}
                          aria-label="customized table"
                        >
                          <TableHead>
                            <TableRow>
                              <StyledTableCell align="center">
                                Sr.No
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                Charge Apply
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                Rate
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                Calculated On
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                Operation
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                Amount
                              </StyledTableCell>
                              {/* <StyledTableCell align="right">Protein&nbsp;</StyledTableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {/* <TableRow className={classes.finalRow}>
                              <TableCell align="left" colSpan={6}>
                                <b>Mandatory Documents</b>
                              </TableCell>
                            </TableRow> */}
                            {chargeRate &&
                              chargeRate
                                // .filter((u) => u.chargeType === 8)
                                // .filter(
                                //   (u) => u.id === test
                                // )

                                // find(
                                //   (u) => u.id === router.query.chargesApply
                                // )?.subCharge &&

                                .map((row, index) => {
                                  console.log("111id", row.id);
                                  console.log("55", row.subCharge);
                                  console.log("111chargeType", row.chargeType);

                                  return (
                                    <StyledTableRow key={index}>
                                      <StyledTableCell
                                        component="th"
                                        scope="row"
                                        align="center"
                                      >
                                        {index + 1}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        <b style={{ color: "blue" }}>
                                          {
                                            chargeName?.find(
                                              (obj) => obj.id == row.chargeType
                                            )?.chargeType
                                          }
                                        </b>
                                        <br />
                                        <b>{row.subCharge}</b>
                                        {/* {router.query.chargesApply} */}
                                        {/*

                                        {row.subCharge ===
                                        router.query.chargesApply
                                          ? row.subCharge
                                          : "-"} */}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        {row.rate}
                                      </StyledTableCell>
                                      <StyledTableCell align="right">
                                        {row.calculateOn}
                                      </StyledTableCell>

                                      <StyledTableCell align="center">
                                        {row.operations}
                                      </StyledTableCell>

                                      <StyledTableCell align="center">
                                        {row.amount}
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  );
                                })}

                            <TableRow style={{ backgroundColor: "skyblue" }}>
                              <TableCell
                                align="right"
                                colSpan={5}
                                style={{ fontStyle: "under" }}
                              >
                                <b>Total :</b>
                              </TableCell>
                              <TableCell align="left" colSpan={5}>
                                {/* <b> {(row.rate += pre)}</b> */}
                                {/* <b>{row.rate}</b> */}

                                {/* {chargeRate &&
                                  chargeRate.map((values) => {
                                    console.log("values", values);
                                    var chargeTotal = 0;
                                    for (let i = 0; i < values.length; i++) {
                                      console.log("i", i);
                                      chargeTotal += values[i].rate;
                                      console.log("total", chargeTotal);
                                      return <p>{chargeTotal}</p>;
                                    }
                                  })} */}
                                <b>{total} Rs</b>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                    <br />
                    {/* <Button
                sx={{ marginRight: 8 }}
                variant="contained"
                color="primary"
                endIcon={<ClearIcon />}
                onClick={() => cancellButton()}
              >
                Clear
              </Button> */}
                    {/* </form>
        </FormProvider> */}
                  </div>
                  {/** Form Preview Dailog */}
                  <Grid container className={styles.feildres} spacing={2}>
                    <Grid item>
                      <Button
                        type="submit"
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        // sx={{
                        //   backgroundColor: "blue",
                        //   color: "white",
                        //   hoverColor: "black",
                        // }}
                        endIcon={<SaveIcon />}
                      >
                        {/* <FormattedLabel id="save" /> */}
                        Pay Online
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        // sx={{
                        //   backgroundColor: "blue",
                        //   color: "white",
                        //   hoverColor: "black",
                        // }}
                        endIcon={<SaveIcon />}
                      >
                        {/* <FormattedLabel id="save" /> */}
                        Cash Payment
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        // sx={{
                        //   backgroundColor: "blue",
                        //   color: "white",
                        //   hoverColor: "black",
                        // }}
                        endIcon={<SaveIcon />}
                      >
                        Rtgs
                      </Button>
                    </Grid>
                    {/* <Grid item>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        // color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={() =>
                          router.push({
                            pathname:
                              "/FireBrigadeSystem/transactions/firstAhawal",
                          })
                        }
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid> */}
                  </Grid>
                  <Dialog
                    fullWidth
                    maxWidth={"lg"}
                    open={loiGenerationReceiptDailog}
                    onClose={() => loiGenerationReceiptDailogClose()}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <Grid container>
                        <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                          Preview
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sm={2}
                          md={4}
                          lg={6}
                          xl={6}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <IconButton
                            aria-label="delete"
                            sx={{
                              marginLeft: "530px",
                              backgroundColor: "primary",
                              ":hover": {
                                bgcolor: "red", // theme.palette.primary.main
                                color: "white",
                              },
                            }}
                          >
                            <CloseIcon
                              sx={{
                                color: "black",
                              }}
                              onClick={() => {
                                loiGenerationReceiptDailogClose();
                              }}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </DialogTitle>
                    <DialogContent>
                      <LoiGenerationRecipt />
                    </DialogContent>

                    <DialogTitle>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          variant="contained"
                          onClick={loiGenerationReceiptDailogClose}
                        >
                          Exit
                        </Button>
                      </Grid>
                    </DialogTitle>
                  </Dialog>
                </div>
              </form>
            </FormProvider>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default PayDetail;
