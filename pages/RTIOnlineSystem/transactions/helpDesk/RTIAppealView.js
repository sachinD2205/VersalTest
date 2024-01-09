import {
  Box,
  Button,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import theme from "../../../../theme";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { DataGrid } from "@mui/x-data-grid";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import hearingScheduleSchema from "../../../../containers/schema/rtiOnlineSystemSchema/hearingScheduleSchema";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import decisionSchema from "../../../../containers/schema/rtiOnlineSystemSchema/decisionSchema";
import { useSelector } from "react-redux";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import roleId from "../../../../components/rtiOnlineSystem/commonRoleId";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import {
  EncryptData,
  DecryptData,
} from "../../../../components/common/EncryptDecrypt";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const EntryForm = (props) => {
  const {
    register,
    control,
    methods,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const {
    register: register1,
    handleSubmit: handleSubmit2,
    methods: methods2,
    setValue: setValue1,
    formState: { errors: error2 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(hearingScheduleSchema),
  });

  const {
    register: register2,
    setValue: setValue2,
    formState: { errors: error3 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(decisionSchema),
  });

  const [mediumMaster, setMediumMaster] = useState([]);
  var currDate = new Date();
  currDate.setDate(currDate.getDate() + 1);
  const language = useSelector((state) => state?.labels?.language);
  const router = useRouter();
  const [applicationKey, setApplicationKey] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [appealData, setAppealData] = useState(null);
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);
  const [statusVal, setStatusVal] = useState(null);
  const [appealDoc, setAppealDoc] = useState([]);
  const [decisionDetailsrow, setDecisionDoc] = useState([]);
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const headers = { Authorization: `Bearer ${user?.token}` };
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const [statusAll, setStatus] = useState(null);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  useEffect(() => {
    getTransferMedium();
  }, []);

  useEffect(() => {
    if (applicationKey != null) {
      getRTIApplicationById();
    }
  }, [applicationKey]);

  const getAllStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getTransferMedium = () => {
    axios
      .get(`${urls.RTI}/mstTransferMedium/getAll`, {
        headers: headers,
      })
      .then((res, i) => {
        let result = res.data.mstTransferMediumList;
        setMediumMaster(
          result.map((res) => ({
            id: res.id,
            mediumPrefix: res.mediumPrefix,
            nameOfMedium: res.nameOfMedium,
            nameOfMediumMr: res.nameOfMediumMr,
            activeFlag: res.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };
  let checkAuth = () => {
    return authority?.includes(roleId.RTI_APPEALE_ROLE_ID) ? false : true;
  };
  const cancellButton = () => {
    router.push({
      pathname: "/RTIOnlineSystem/transactions/helpDesk",
    });
  };

  // hearing table for citizen
  const columnsCitizen = [
    {
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
    },
    {
      field: "hearingDate",
      headerName: <FormattedLabel id="scheduleDate" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
      minWidth: 150,
    },
    {
      field: "hearingTime",
      headerName: <FormattedLabel id="scheduleTime" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
      minWidth: 150,
    },
    {
      field: "venue",
      headerName: <FormattedLabel id="venueForHearing" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
      minWidth: 150,
    },
    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
      minWidth: 150,
    },
  ];

  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        if (r?.data?.mimeType == "application/pdf") {
          const byteCharacters = atob(r?.data?.fileName);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const newTab = window.open();
          newTab.location.href = url;
        }
        // for img
        else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <body style="margin: 0;">
                <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
              </body>
            </html>
          `);
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };
  // Document table
  const docColumns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "filenm",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                //   "_blank"
                // );
                getFilePreview(record?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAllStatus();
    setAppealData(props.data);
  }, [props, language]);

  useEffect(() => {
    if (appealData != null && statusAll != null) {
      setAppealDetails();
    }
  }, [appealData, statusAll, language]);

  // set appeal detailsF
  const setAppealDetails = () => {
    let res = appealData;
    setValue("appealApplicationNo", res.applicationNo);
    setValue("applicantFirstName", res?.applicantFirstName);
    setValue("applicantMiddleName", res?.applicantMiddleName);
    setValue("applicantLastName", res?.applicantLastName);
    setValue(
      "applicantName",
      language == "en"
        ? res?.applicantFirstName +
            " " +
            res?.applicantMiddleName +
            " " +
            res?.applicantLastName
        : res?.applicantFirstNameMr +
            " " +
            res?.applicantMiddleNameMr +
            " " +
            res?.applicantLastNameMr
    );
    setValue("address", language == "en" ? res?.address : res?.addressMr);
    setApplicationKey(res?.applicationKey);
    setValue("paymentAmount", res?.paymentAmount);
    setValue("address", res?.address);
    setValue("appealReason", res?.appealReason);
    setValue("place", res?.place);
    setValue("date", res?.applicationDate);
    setValue("officerDetails", res?.officerDetails);
    setValue("dateOfOfficialorderAgainstAppeal", res?.applicationDate);
    setValue("informationSubject", res?.subject);
    setValue("concernedOfficeDetails", res?.concernedOfficeDetails);
    setValue("informationSubjectDesc", res?.informationSubjectDesc);
    setValue("informationDescription", res?.informationDescription);
    setStatusVal(res.status);
    setValue("selectedReturnMedia2", res?.selectedReturnMediaKey);
    setValue("outwardNumberTxt1", res.outwardNumberTxt);
    setValue1("applicationNo", res?.applicationNo);
    setValue("status", manageStatus(res.status, language, statusAll));
    setDataSource(
      res.trnRtiHearingDaoList?.map((row, i) => ({
        srNo: i + 1,
        id: row.id,
        hearingDate: moment(row.hearingDate).format("DD-MM-YYYY"),
        hearingTime: moment(row.hearingTimeV3).format("hh:mm a"),
        venue: row.venue,
        remarks: row.remarks,
      }))
    );
    if (res.trnRtiHearingDaoList?.length != 0) {
      setValue2(
        "decisionDetails",
        res.trnRtiHearingDaoList && res.trnRtiHearingDaoList[0]?.decisionDetails
      );
      setValue2(
        "decisionStatus",
        res.trnRtiHearingDaoList && res.trnRtiHearingDaoList[0]?.decisionStatus
      );
      setValue2(
        "remarks",
        res.trnRtiHearingDaoList && res.trnRtiHearingDaoList[0]?.remarks
      );
      const doc = [];
      if (
        res.trnRtiHearingDaoList &&
        res.trnRtiHearingDaoList[0]?.decisionOrderDocumentPath != null
      ) {
        const DecryptPhoto1 = DecryptData(
          "passphraseaaaaaaaaupload",
          res.trnRtiHearingDaoList[0]?.decisionOrderDocumentPath 
        );
        doc.push({
          id: 1,
          filenm: "Decision Order Document",
          documentPath:
            res.trnRtiHearingDaoList &&
            res.trnRtiHearingDaoList[0]?.decisionOrderDocumentPath,
          documentType:
            res.trnRtiHearingDaoList &&
            DecryptPhoto1
              .split(".")
              .pop()
              .toUpperCase(),
        });
      }
      if (
        res.trnRtiHearingDaoList &&
        res.trnRtiHearingDaoList[0]?.informationDeliveredDocumentPath != null
      ) {
        const DecryptPhoto1 = DecryptData(
          "passphraseaaaaaaaaupload",
          res.trnRtiHearingDaoList[0]?.informationDeliveredDocumentPath
        );
        doc.push({
          id: 2,
          filenm: "Information Delivered Document",
          documentPath:
            res.trnRtiHearingDaoList[0]?.informationDeliveredDocumentPath,
          documentType:
          DecryptPhoto1
              .split(".")
              .pop()
              .toUpperCase(),
        });
      }
      setDecisionDoc(doc);
    }
    const doc = [];
    // Loop through each attached document and add it to the `doc` array
    for (let i = 1; i <= 10; i++) {
      const attachedDocument = res[`attachedDocument${i}`];
      if (attachedDocument != null) {
        const DecryptPhoto1 = DecryptData(
          "passphraseaaaaaaaaupload",
          attachedDocument
        );
        doc.push({
          id: i,
          filenm: DecryptPhoto1.split("/").pop().split("_").pop(),
          documentPath: attachedDocument,
          documentType: DecryptPhoto1.split(".").pop().toUpperCase(),
        });
      }
    }
    setAppealDoc(doc);
  };

  // for fetching rti application no and applicant name on hearing modal
  const getRTIApplicationById = () => {
    axios
      .get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationKey}`, {
        headers: headers,
      })
      .then((res) => {
        setApplicationDetailsOnForm(res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // set appeal details on form
  const setApplicationDetailsOnForm = (_res) => {
    setValue1("rtiapplicationNo", _res?.data.applicationNo);
  };

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            [theme.breakpoints.down("sm")]: {
              marginTop: "2rem",
              marginBottom: "2rem",
            },
            padding: 1,
          }}
        >
          <FormProvider {...methods}>
            <form>
              <Grid
                container
                spacing={3}
                sx={{
                  padding: "1rem",
                  [theme.breakpoints.down("sm")]: {
                    padding: "0px",
                  },
                }}
              >
                {/* applicant first name */}
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="standard-textarea"
                    label={<FormattedLabel id="rtiApplicationNO" />}
                    multiline
                    variant="standard"
                    {...register1("rtiapplicationNo")}
                    error={!!error2.rtiapplicationNo}
                    helperText={
                      error2?.rtiapplicationNo
                        ? error2.rtiapplicationNo.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="standard-textarea"
                    label={<FormattedLabel id="appealApplicationNo" />}
                    multiline
                    variant="standard"
                    {...register("appealApplicationNo")}
                    error={!!errors.applicationNo}
                    helperText={
                      errors?.applicationNo
                        ? errors.applicationNo.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                  {/* current status */}
                  <TextField
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-textarea"
                    label={<FormattedLabel id="currentStatus" />}
                    multiline
                    variant="standard"
                    {...register("status")}
                    error={!!errors.status}
                    helperText={errors?.status ? errors.status.message : null}
                  />
                </Grid>
                {/* information description */}
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-textarea"
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    label={<FormattedLabel id="descriptionOfInfo" />}
                    multiline
                    variant="standard"
                    {...register("informationDescription")}
                    error={!!errors.informationDescription}
                    helperText={
                      errors?.informationDescription
                        ? errors.informationDescription.message
                        : null
                    }
                  />
                </Grid>
                {/* officer details */}
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="standard-textarea"
                    label={<FormattedLabel id="descInfoOfOfficer" />}
                    multiline
                    variant="standard"
                    {...register("officerDetails")}
                    error={!!errors.officerDetails}
                    helperText={
                      errors?.officerDetails
                        ? errors.officerDetails.message
                        : null
                    }
                  />
                </Grid>
                {/* concern officer details */}
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-textarea"
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <FormattedLabel id="concernOfficerDeptnmWhoseInfoRequired" />
                    }
                    multiline
                    variant="standard"
                    {...register("concernedOfficeDetails")}
                    error={!!errors.concernedOfficeDetails}
                    helperText={
                      errors?.concernedOfficeDetails
                        ? errors.concernedOfficeDetails.message
                        : null
                    }
                  />
                </Grid>
                {/* reason for appeal */}
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-textarea"
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    label={<FormattedLabel id="reasonForAppeal" />}
                    multiline
                    variant="standard"
                    {...register("appealReason")}
                    error={!!errors.appealReason}
                    helperText={
                      errors?.appealReason ? errors.appealReason.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "0px",
                  }}
                >
                  <FormControl
                    sx={{
                      m: { xs: 0, md: 1 },
                      minWidth: "100%",
                      marginTop: "0px",
                    }}
                  >
                    <Controller
                      control={control}
                      name="date"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="date" required />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  // sx={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}
                >
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-basic"
                    disabled
                    InputLabelProps={{ shrink: watch("place") }}
                    label={<FormattedLabel id="place" />}
                    multiline
                    variant="standard"
                    {...register("place")}
                    error={!!errors.place}
                    helperText={errors?.place ? errors.place.message : null}
                  />
                </Grid>
              </Grid>
            </form>
          </FormProvider>
          {appealDoc.length != 0 && (
            <div>
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginBottom: "8px", marginTop: "8px" }}
                >
                  {/* <Grid item xs={1}>
                    <IconButton
                      style={{
                        color: "white",
                      }}
                      onClick={() => {
                        router.back();
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </Grid> */}
                  <Grid item xs={12}>
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="RTIAppealdoc" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <DataGrid
                autoHeight
                sx={{
                  padding: "10px",
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
                density="standard"
                pagination
                paginationMode="server"
                pageSize={10}
                rowsPerPageOptions={[10]}
                rows={appealDoc}
                columns={docColumns}
              />
            </div>
          )}

          {/* *******************************Hearing Schedule******************************* */}
          {dataSource && dataSource.length != 0 && (
            <div>
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginTop: "8px" }}
                >
                  <Grid item xs={12}>
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="hearingSchedule" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <DataGrid
                autoHeight
                sx={{
                  marginTop: 2,
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
                density="density"
                rowsPerPageOptions={[5]}
                rows={dataSource}
                columns={columnsCitizen}
              />
            </div>
          )}

          {(statusVal === 11 || statusVal == 14) && (
            <>
              <Box>
                <Grid container className={commonStyles.title}>
                  <Grid item xs={12}>
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="decisionDetails" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <FormProvider {...methods2}>
                <form>
                  <Grid
                    container
                    spacing={3}
                    sx={{
                      padding: "1rem",
                      [theme.breakpoints.down("sm")]: {
                        padding: "0px",
                      },
                    }}
                  >
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        sx={{
                          m: { xs: 0, md: 1 },
                          backgroundColor: "white",
                          minWidth: "100%",
                        }}
                        error={!!errors.toDate}
                      >
                        <Controller
                          control={control}
                          name="dateOfOfficialorderAgainstAppeal"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 14 }}>
                                    {
                                      <FormattedLabel id="dateOfOfficialorderAgainstAppeal" />
                                    }
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ width: "100%" }}
                                    {...params}
                                    size="small"
                                    variant="standard"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.dateOfOfficialorderAgainstAppeal
                            ? errors.dateOfOfficialorderAgainstAppeal.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xl={8} lg={8} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        label={<FormattedLabel id="decisiontakenInHearing" />}
                        multiline
                        variant="standard"
                        {...register2("decisionDetails")}
                        error={!!error3.decisionDetails}
                        helperText={
                          error3?.decisionDetails
                            ? error3.decisionDetails.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="decisionStatus" />}
                        multiline
                        variant="standard"
                        {...register2("decisionStatus")}
                        error={!!error3.decisionStatus}
                        helperText={
                          error3?.decisionStatus
                            ? error3.decisionStatus.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={8}
                      lg={8}
                      md={8}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="remark" />}
                        multiline
                        inputProps={{ maxLength: 500 }}
                        variant="standard"
                        {...register2("remarks")}
                        error={!!error3.remarks}
                        helperText={
                          error3?.remarks ? error3.remarks.message : null
                        }
                      />
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </>
          )}
          <Grid container spacing={2} sx={{ marginTop: "3rem" }}>
            {(logedInUser === "citizenUser" ||
              logedInUser === "cfcUser" ||
              (logedInUser === "departmentUser" && checkAuth())) &&
              statusVal === 6 && (
                <>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="back" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      endIcon={<DownloadIcon />}
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => {
                        router.push({
                          pathname:
                            "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                          query: { id: appealData?.applicationNo },
                        });
                      }}
                    >
                      <FormattedLabel id="downloadAcknowldgement" />
                    </Button>
                  </Grid>
                </>
              )}
            {/* Payment visiblity button Disply only user  */}
            {((logedInUser === "departmentUser" && checkAuth()) ||
              logedInUser === "citizenUser" ||
              logedInUser === "cfcUser") &&
              statusVal === 2 && (
                <>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="back" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => {
                        router.push({
                          pathname:
                            "/RTIOnlineSystem/transactions/payment/PaymentCollection",
                          query: { id: router.query.id, trnType: "apl" },
                        });
                      }}
                    >
                      <FormattedLabel id="makePayment" />
                    </Button>
                  </Grid>
                </>
              )}
          </Grid>
          {/* Back button */}
          {(logedInUser == "citizenUser" ||
            logedInUser === "cfcUser" ||
            (logedInUser === "departmentUser" && checkAuth())) &&
            (statusVal === 11 ||
              statusVal === 7 ||
              statusVal === 8 ||
              statusVal === 14) && (
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={() => cancellButton()}
                >
                  <FormattedLabel id="back" />
                </Button>
              </Grid>
            )}
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default EntryForm;
