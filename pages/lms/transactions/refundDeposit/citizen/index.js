import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextareaAutosize,
  TextField,
  ThemeProvider,
} from "@mui/material";
import theme from "../../../../../theme";
import styles from "../../../../../styles/lms/[closeMembership]view.module.css";
import InIcon from "@mui/icons-material/Input";
import OutIcon from "@mui/icons-material/Output";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import SaveIcon from "@mui/icons-material/Save";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { refundDepositSchema } from "../../../../../components/lms/schema/refundDepositSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../../components/lms/lmsHeader";
import { toast } from "react-toastify";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = (props) => {
  let appName = "LMS";
  let serviceName = "C-LMS";
  let applicationFrom = "Web";
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const token = useSelector((state) => state.user.user.token);

  const closeMember = useForm({
    resolver: yupResolver(refundDepositSchema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = closeMember;

  const [libraryIdsList, setLibraryIdsList] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);
  const [buttonInputState, setButtonInputState] = useState();

  const [showDetails, setShowDetails] = useState(false);
  const [memberName, setMemberName] = useState();
  const [isPendingDue, setIsPendingDue] = useState(false);
  const [isPendingBook, setIsPendingBook] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [loading, setLoading] = useState(false);

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

  const backToHomeButton = () => {
    // history.push({ pathname: "/homepage" });
    // router.push({
    //   pathname: `/dashboard`,
    // });

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      router.push(`/dashboard`);
    } else if (localStorage.getItem("loggedInUser") == "cfcUser") {
      router.push(`/CFC_Dashboard`);
    } else {
      router.push(`/lms/transactions/refundDeposit/scrutiny`);
    }
  };

  useEffect(() => {
    setAllLibrariesList();
    getBank();
    // getAllBooks()

    if (props.disabled) {
      setShowDetails(true);
    }
    console.log("aalanai", props.id);
    // if(props.id){
    //     axios
    //     .get(
    //       `${urls.LMSURL}/trnCloseMembership/getByIdAndServiceId?id=${props?.id}&serviceId=${86}`,
    //     )
    //     .then((res) => {
    //       console.log(res, "reg123")
    //       reset(res.data)

    //     })
    // }
  }, []);

  const [bank, setBank] = useState([]);
  const getBank = () => {
    console.log("123");
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // .get("http://15.206.219.76:8090/cfc/api/master/bank/getAll")
      .then((r) => {
        console.log("bank 123", r);
        setBank(r?.data?.bank);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const setAllLibrariesList = () => {
    setLoading(true);
    const url = urls.LMSURL + "/libraryMaster/getAll";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        if (response.status !== 200) {
          throw new Error("Error getting libraries");
        }
        if (
          !response.data ||
          !response.data.libraryMasterList ||
          response.data.libraryMasterList.length === 0
        ) {
          throw new Error("No libraries found");
        }
        setLibraryIdsList(
          response?.data?.libraryMasterList.sort((a, b) => a.id - b.id)
        );
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   setLoading(false);
    //   console.error(err);
    //   swal(err.message, { icon: "error" });
    // });
  };

  const getMembershipDetails = () => {
    if (!(watch("membershipNo") && watch("libraryKey"))) {
      toast("Please Select Values", {
        type: "error",
      });
      return;
    }
    setLoading(true);
    console.log("data", watch("membershipNo"), watch("libraryKey"));
    if (watch("membershipNo")) {
      const url =
        urls.LMSURL +
        "/trnCloseMembership/getByMembershipNoAndLibrayKeyForRefund?membershipNo=" +
        watch("membershipNo") +
        "&libraryKey=" +
        watch("libraryKey");
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          // if (
          //   !response.data ||
          //   !response.data.trnBookIssueReturnList ||
          //   response.data.trnBookIssueReturnList.length === 0
          // ) {
          //   throw new Error('No books found')
          // }
          // setReturnBooksAvailableList(response.data.trnBookIssueReturnList)
          setValue("memberName", response?.data?.applicantName);
          setValue("startDate", response?.data?.startDate);
          setValue("endDate", response?.data?.endDate);
          setValue("closeDate", response?.data?.cancellationDate);
          setMemberName(response?.data?.applicantName);
          //finePending
          setIsPendingDue(response?.data?.finePending);
          //bookPending
          setIsPendingBook(response?.data?.bookPending);
          // setIsPendingBook(true)
          setShowDetails(true);
          setSearchData(response?.data);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          // swal(err.response?.data?.message, { icon: "error" });
          sweetAlert({
            title: language === "en" ? "Not Found !! " : "आढळले नाही !!",
            text: language === "en" ? "Data Not Found !" : "डेटा आढळला नाही !",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        });
    }
  };

  const onSubmitForm = (data) => {
    setLoading(true);
    let userType;
    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "departmentUser") {
      userType = 3;
    } else {
      userType = 2;
    }
    const bodyForApi = {
      ...data,
      createdUserId: user?.id,
      applicationFrom,
      // serviceCharges: null,
      serviceId: 89,
      bankaAccountNo: Number(data.bankaAccountNo),
      cancellationDate: watch("closeDate"),
      applicationStatus: "APPLICATION_CREATED",
      applicantType: userType,
      applicantName: searchData?.applicantName,
      applicantNameMr: searchData?.applicantNameMr,
    };
    console.log("Final Data: ", bodyForApi);

    // Save - DB

    axios
      .post(`${urls.LMSURL}/trnDepositeRefund/save`, bodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          setLoading(false);
          sweetAlert({
            title: language === "en" ? "Saved " : "जतन केले",
            text:
              language === "en"
                ? "Record saved successfully"
                : "रेकॉर्ड यशस्वीरित्या जतन केले",
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
            dangerMode: false,
            closeOnClickOutside: false,
          });
          // swal("Saved!", "Record Saved successfully !", "success");
          // router.push({
          //     pathname: `/dashboard`,
          // })
          let temp = res?.data?.message;
          router.push({
            pathname: `/lms/transactions/refundDeposit/acknowledgmentReceipt`,
            query: {
              id: Number(temp.split(":")[1]),
            },
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err123", err?.response?.data?.status);
        if (err.response?.data?.status == 409) {
          // swal("Error!", "Application for this member already exist!", "error");
          sweetAlert({
            title:
              language === "en" ? "Alredy Exist !! " : "आधीच अस्तित्वात आहे !!",
            text:
              language === "en"
                ? "Application for this member already exist!"
                : "या सदस्यासाठी अर्ज आधीपासूनच अस्तित्वात आहे!",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        } else if (err.response?.data?.status == 410) {
          // swal("Error!", "Application for this member already exist!", "error");
          sweetAlert({
            title:
              language === "en"
                ? "Already sent to accountant  !! "
                : "आधीच लेखापालाकडे पाठवले आहे !!  ",
            text:
              language === "en"
                ? "Application for this member already sent to accountant !"
                : "या सदस्याचा अर्ज आधीच लेखापालाकडे पाठवला आहे !",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        } else {
          // swal("Error!", "Somethings Wrong Record no t Saved!", "error");
          sweetAlert({
            title: language === "en" ? "Error !! " : "त्रुटी !!",
            text:
              language === "en"
                ? "Somethings Wrong !! Record not Saved!"
                : "काहीतरी त्रुटी !! रेकॉर्ड जतन केलेले नाही!",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={theme}>
          <Paper
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
            }}
            id="paper-top"
          >
            {/* <div className={styles.detailsTABLE}>
              <div className={styles.h1TagTABLE}>
                <h2
                  style={{
                    fontSize: "20",
                    color: "white",
                    marginTop: "7px",
                  }}
                >
                  {" "}
                  {<FormattedLabel id="refundDeposit" />}
                </h2>
              </div>
            </div> */}
            <LmsHeader labelName="refundDeposit" />
            {loading ? (
              <Loader />
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                    >
                      <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.libraryName}
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="libraryCSC" required />
                            {/* Choose a library */}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // disabled
                                // disabled={disable}
                                sx={{ width: "100%" }}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      height: "50%",
                                    },
                                  },
                                }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                // label="Choose a library"
                                label={
                                  <FormattedLabel id="libraryCSC" required />
                                }
                                id="demo-simple-select-standard"
                                labelId="demo-simple-select-standard-label"
                              >
                                {libraryIdsList &&
                                  libraryIdsList.map((library, index) => {
                                    return (
                                      <MenuItem key={index} value={library.id}>
                                        {language === "en"
                                          ? library.libraryName
                                          : library?.libraryNameMr}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="libraryKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.libraryName
                              ? errors.libraryName.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                    >
                      <TextField
                        InputLabelProps={{
                          shrink: watch("membershipNo") ? true : false,
                        }}
                        sx={{ width: "90%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="membershipNo" required />}
                        // label="Membership No"
                        variant="standard"
                        {...register("membershipNo")}
                        error={!!errors.membershipNo}
                        helperText={
                          errors?.membershipNo
                            ? errors.membershipNo.message
                            : null
                        }
                      />
                    </Grid>
                    {!props.disabled ? (
                      <Grid
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                        }}
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                      >
                        <Button
                          type="button"
                          size="small"
                          disabled={watch("membershipNo")?.length == 0}
                          variant="contained"
                          endIcon={<OutIcon />}
                          style={{ marginRight: "20px" }}
                          // type="primary"
                          onClick={() => {
                            getMembershipDetails();
                          }}
                        >
                          {/* Search Member */}
                          {<FormattedLabel id="searchMember" />}
                        </Button>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                  {showDetails ? (
                    <>
                      <div className={styles.details1TABLE}>
                        <div className={styles.h2TagTABLE}>
                          <h2
                            style={{
                              fontSize: "20",
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            {" "}
                            {<FormattedLabel id="membershipDetails" />}
                            {/* Membership Details */}
                          </h2>
                        </div>
                      </div>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        style={{ marginTop: "1vh", marginLeft: "1vh" }}
                        columns={16}
                      >
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={3}
                          lg={3}
                          md={3}
                          sm={12}
                          xs={12}
                        >
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="memberName" required />}
                            // label="Member Name"
                            variant="standard"
                            {...register("memberName")}
                            error={!!errors.memberName}
                            helperText={
                              errors?.memberName
                                ? errors.memberName.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={3}
                          lg={3}
                          md={3}
                          sm={12}
                          xs={12}
                        >
                          <FormControl
                            sx={{ marginTop: 0 }}
                            error={!!errors.startDate}
                          >
                            <Controller
                              control={control}
                              name="startDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    disabled
                                    // maxDate={new Date()}
                                    // disabled={disable}
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 14 }}>
                                        {" "}
                                        {/* Membership Start Date */}
                                        {
                                          <FormattedLabel
                                            id="startDate"
                                            required
                                          />
                                        }
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) =>
                                      field.onChange(
                                        moment(date).format("YYYY-MM-DD")
                                      )
                                    }
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        // disabled={disabled}
                                        {...params}
                                        size="small"
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
                              {errors?.startDate
                                ? errors.startDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={3}
                          lg={3}
                          md={3}
                          sm={12}
                          xs={12}
                        >
                          <FormControl
                            sx={{ marginTop: 0 }}
                            error={!!errors.endDate}
                          >
                            <Controller
                              control={control}
                              name="endDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    disabled
                                    // maxDate={new Date()}
                                    // disabled={disable}
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 14 }}>
                                        {" "}
                                        {/* Membership End Date */}
                                        {
                                          <FormattedLabel
                                            id="endDate"
                                            required
                                          />
                                        }
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) =>
                                      field.onChange(
                                        moment(date).format("YYYY-MM-DD")
                                      )
                                    }
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        // disabled={disabled}
                                        {...params}
                                        size="small"
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
                              {errors?.endDate ? errors.endDate.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <FormControl
                            sx={{ marginTop: 0 }}
                            error={!!errors.closeDate}
                          >
                            <Controller
                              control={control}
                              name="closeDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    // maxDate={new Date()}
                                    // disabled={disable}
                                    disabled
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 14 }}>
                                        {" "}
                                        {/* Membership Close Date */}
                                        {
                                          <FormattedLabel
                                            id="membershipCloseDate"
                                            required
                                          />
                                        }
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) =>
                                      field.onChange(
                                        moment(date).format("YYYY-MM-DD")
                                      )
                                    }
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        // disabled={disabled}
                                        {...params}
                                        size="small"
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
                              {errors?.closeDate
                                ? errors.closeDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <div className={styles.details1TABLE}>
                        <div className={styles.h2TagTABLE}>
                          <h2
                            style={{
                              fontSize: "20",
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            {" "}
                            {<FormattedLabel id="bankEcsDetails" />}
                            {/* Bank(ECS Form) Details */}
                          </h2>
                        </div>
                      </div>
                      <Grid
                        container
                        style={{ marginTop: "1vh", marginLeft: "10vh" }}
                      >
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <TextField
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="bankHolderName" required />
                            }
                            // label="Bank Account Holder Name"
                            variant="standard"
                            {...register("bankAccountHolderName")}
                            error={!!errors.bankAccountHolderName}
                            helperText={
                              errors?.bankAccountHolderName
                                ? errors.bankAccountHolderName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <TextField
                            id="standard-basic"
                            label={
                              <FormattedLabel id="bankAccountNumber" required />
                            }
                            // label="Bank Account Number"
                            variant="standard"
                            type="password"
                            sx={{ width: 230 }}
                            {...register("bankaAccountNo")}
                            error={!!errors.bankaAccountNo}
                            helperText={
                              errors?.bankaAccountNo
                                ? errors.bankaAccountNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <FormControl
                            error={errors.typeOfBankAccount}
                            variant="standard"
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="typeOfBankAccount" required />
                              {/* Type Of Bank Account */}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={
                                    <FormattedLabel id="typeOfBankAccount" />
                                  }
                                  // label="Type Of Bank Account"
                                >
                                  {["Current", "Saving", "Other"].map(
                                    (auditorium, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={auditorium}
                                        >
                                          {auditorium}
                                        </MenuItem>
                                      );
                                    }
                                  )}
                                </Select>
                              )}
                              name="typeOfBankAccount"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.typeOfBankAccount
                                ? errors.typeOfBankAccount.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        style={{ marginTop: "1vh", marginLeft: "10vh" }}
                      >
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <FormControl
                            variant="standard"
                            error={!!errors.bankNameId}
                            sx={{ width: "90%" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="bankName" />
                              {/* Bank Name */}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={
                                    <FormattedLabel id="bankName" required />
                                  }
                                  // label="Bank Name"
                                >
                                  {bank.map((bank, index) => (
                                    <MenuItem
                                      key={index}
                                      value={bank.id}
                                      sx={{
                                        display: bank.bankName
                                          ? "flex"
                                          : "none",
                                      }}
                                    >
                                      {bank.bankName}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                              name="bankNameId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.bankNameId
                                ? errors.bankNameId.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <TextField
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="bankAddress" required />}
                            // label="Bank Address"
                            variant="standard"
                            {...register("bankAddress")}
                            error={!!errors.bankAddress}
                            helperText={
                              errors?.bankAddress
                                ? errors.bankAddress.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <TextField
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="bankIFSC" required />}
                            // label="IFSC Code"
                            variant="standard"
                            {...register("ifscCode")}
                            error={!!errors.ifscCode}
                            helperText={
                              errors?.ifscCode ? errors.ifscCode.message : null
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        style={{ marginTop: "1vh", marginLeft: "10vh" }}
                      >
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="bankMICR" required />}
                            // label="MICR Code"
                            variant="standard"
                            type="number"
                            sx={{ width: 230 }}
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 10);
                            }}
                            {...register("micrCode")}
                            error={!!errors.micrCode}
                            helperText={
                              errors?.micrCode ? errors.micrCode.message : null
                            }
                          />
                        </Grid>
                      </Grid>
                      {!props.disabled ? (
                        <>
                          <Grid
                            container
                            spacing={2}
                            columnSpacing={{
                              xs: 1,
                              sm: 2,
                              md: 3,
                              lg: 12,
                              xl: 12,
                            }}
                            style={{ marginTop: "1vh", marginLeft: "1vh" }}
                            columns={16}
                          >
                            <Grid
                              item
                              style={{ marginTop: "4vh" }}
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <Button
                                type="submit"
                                variant="contained"
                                size="small"
                                // color="success"
                                endIcon={<SaveIcon />}
                              >
                                {<FormattedLabel id="save" />}
                                {/* save */}
                              </Button>
                            </Grid>

                            <Grid
                              item
                              style={{ marginTop: "4vh" }}
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  swal({
                                    title:
                                      language == "en" ? "Exit?" : "बाहेर पडा?",
                                    text:
                                      language == "en"
                                        ? "Are you sure you want to exit this Record?"
                                        : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                  }).then((willDelete) => {
                                    if (willDelete) {
                                      swal(
                                        language == "en"
                                          ? "Record is Successfully Exit!"
                                          : "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                                        {
                                          icon: "success",
                                        }
                                      );
                                      // router.push({
                                      //   pathname: `/dashboard`,
                                      // });
                                      backToHomeButton();
                                    } else {
                                      swal(
                                        language == "en"
                                          ? "Record is Safe"
                                          : "रेकॉर्ड सुरक्षित आहे"
                                      );
                                    }
                                  });
                                }}
                              >
                                <FormattedLabel id="exit" />
                                {/* exit */}
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </form>
              </FormProvider>
            )}
          </Paper>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
};

export default Index;
