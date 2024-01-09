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
  Typography,
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
import { closeMembershipSchema } from "../../../../../components/lms/schema/closeMembershipSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../../../../containers/Layout/components/Loader";
import { DataGrid } from "@mui/x-data-grid";
import LmsHeader from "../../../../../components/lms/lmsHeader";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = (props) => {
  let appName = "LMS";
  let serviceName = "C-LMS";
  let applicationFrom = "Web";
  const user = useSelector((state) => state?.user.user);
  const token = useSelector((state) => state.user.user.token);

  const language = useSelector((lang) => lang?.labels?.language);
  const router = useRouter();

  const closeMember = useForm({
    resolver: yupResolver(closeMembershipSchema),
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
  const [loading, setLoading] = useState(false);
  const [searchMemberData, setSearchMemberData] = useState([]);

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
      router.push(`/lms/transactions/closeMembership/scrutiny`);
    }
  };

  useEffect(() => {
    setAllLibrariesList();
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
          response.data.libraryMasterList.sort((a, b) => a.id - b.id)
        );
      })
      .catch((err) => {
        setLoading(false);
        console.log("yetay error", err?.response?.data?.message);
        // swal(err?.response?.data?.message, { icon: "error" });
        catchExceptionHandlingMethod(err, language);
      });
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
        "/libraryMembership/getByMembershipDetailsForCancelMembership?membershipNo=" +
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
          console.log("res", response);
          setSearchMemberData(response?.data);
          setLoading(false);
          // if (
          //   !response.data ||
          //   !response.data.trnBookIssueReturnList ||
          //   response.data.trnBookIssueReturnList.length === 0
          // ) {
          //   throw new Error('No books found')
          // }
          // setReturnBooksAvailableList(response.data.trnBookIssueReturnList)
          setValue("memberName", response.data.applicantName);
          setValue("memberNameMr", response.data.applicantNameMr);
          setValue("startDate", response.data.startDate);
          setValue("endDate", response.data.endDate);
          setMemberName(response.data.applicantName);
          //finePending
          setIsPendingDue(response?.data?.finePending);
          //bookPending
          setIsPendingBook(response?.data?.bookPending);
          // setIsPendingBook(true)
          setShowDetails(true);
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
    console.log("Data: ", data);
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
      serviceId: 86,
      applicationStatus: "APPLICATION_CREATED",
      memberNameMr: data?.memberNameMr,
      //searchMemberData
      afName: searchMemberData?.afName,
      amName: searchMemberData?.amName,
      alName: searchMemberData?.alName,
      afNameMr: searchMemberData?.afNameMr,
      amNameMr: searchMemberData?.amNameMr,
      alNameMr: searchMemberData?.alNameMr,
      aemail: searchMemberData?.aemail,
      applicantName: searchMemberData?.applicantName,
      applicantNameMr: searchMemberData?.applicantNameMr,
      applicantType: userType,
    };
    console.log("Final Dat2a: ", bodyForApi);

    // Save - DB

    axios
      .post(`${urls.LMSURL}/trnCloseMembership/save`, bodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          setLoading(false);
          swal(
            language == "en" ? "Saved!" : "जतन केले!",
            language == "en"
              ? "Record Saved successfully!"
              : "रेकॉर्ड यशस्वीरित्या जतन केले!",
            "success"
          );
          // router.push({
          //     pathname: `/dashboard`,
          // })
          let temp = res?.data?.message;
          router.push({
            pathname: `/lms/transactions/closeMembership/acknowledgmentReceipt`,
            query: {
              id: Number(temp?.split(":")[1]),
            },
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err123", err.response?.data?.status);
        if (err?.response?.data?.status == 409) {
          swal(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en"
              ? "Application for this member already exist!"
              : "या सदस्यासाठी अर्ज आधीच अस्तित्वात आहे!",
            "error"
          );
        } else {
          swal(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en"
              ? "Somethings Wrong, Record not Saved!"
              : "काहीतरी चुकीचे आहे, रेकॉर्ड सेव्ह नाही!",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      field: "srNo",
      // headerName: 'Book Name',
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      // width: 480,
    },
    {
      field: "bookName",
      // headerName: 'Book Name',
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="bookName" />,
      flex: 1,
      // width: 480,
    },
    {
      field: "issuedAt",
      // headerName: 'Issued At',
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="issuedAt" />,
      width: 200,
      //  flex: 3
    },
  ];

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
            <LmsHeader labelName="closeMembership" />
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
                  {<FormattedLabel id="closeMembership" />}
                </h2>
              </div>
            </div> */}
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
                      <FormControl
                        fullWidth
                        variant="standard"
                        error={!!errors.libraryKey}
                        sx={{
                          width: "90%",
                        }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="libraryCSC" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // disabled
                              // disabled={disable}
                              value={field.value}
                              sx={{ width: "100%" }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    height: "50%",
                                  },
                                },
                              }}
                              onChange={(value) => field.onChange(value)}
                              // label="Choose a library"
                              label={
                                <FormattedLabel id="libraryCSC" required />
                              }
                              id="demo-simple-select-standard"
                              labelId="demo-simple-select-standard-label"
                            >
                              {libraryIdsList &&
                                libraryIdsList.map((library, index) => (
                                  <MenuItem key={index} value={library.id}>
                                    {language === "en"
                                      ? library.libraryName
                                      : library.libraryNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="libraryKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.libraryKey
                            ? errors.libraryKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
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
                          variant="contained"
                          size="small"
                          disabled={watch("membershipNo")?.length == 0}
                          endIcon={<OutIcon />}
                          // type="primary"
                          onClick={() => {
                            getMembershipDetails();
                          }}
                        >
                          <FormattedLabel id="searchMember" />

                          {/* Search Member */}
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
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          style={{
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
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: "90%" }}
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
                          style={{
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
                          <FormControl
                            sx={{ width: "90%" }}
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
                                    sx={{ width: "90%" }}
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
                                        sx={{ width: "90%" }}
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
                          style={{
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
                          <FormControl
                            sx={{ width: "90%" }}
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
                                        sx={{ width: "90%" }}
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
                      </Grid>

                      <Grid container style={{ padding: "10px" }}>
                        {isPendingDue && (
                          <Grid
                            item
                            style={{ marginTop: "4vh" }}
                            xl={4}
                            lg={4}
                            md={4}
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
                              label={<FormattedLabel id="dues" required />}
                              // label="Pending Dues"
                              variant="standard"
                              {...register("dues")}
                              error={!!errors.dues}
                              helperText={
                                errors?.dues ? errors.dues.message : null
                              }
                            />
                          </Grid>
                        )}
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextareaAutosize
                            //  InputLabelProps={{ shrink: true }}
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Reason for Membership Closure"
                            style={{ width: "90%" }}
                            id="standard-basic"
                            // label="Reason"
                            label={<FormattedLabel id="reason" required />}
                            {...register("reason")}
                            error={!!errors.reason}
                            helperText={
                              errors?.reason ? errors.reason.message : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid item xs={12}>
                          {searchMemberData?.issueBooklist?.length > 0 && (
                            <DataGrid
                              autoHeight
                              rowHeight={40}
                              sx={{
                                overflowY: "scroll",
                                overflowX: "scroll",

                                ".mui-style-f3jnds-MuiDataGrid-columnHeaders": {
                                  minHeight: "40px !important",
                                  maxHeight: "40px !important",
                                },

                                "& .MuiDataGrid-virtualScrollerContent": {},
                                "& .MuiDataGrid-columnHeadersInner": {
                                  backgroundColor: "#556CD6",
                                  color: "white",
                                },

                                "& .MuiDataGrid-cell:hover": {
                                  color: "primary.main",
                                },
                              }}
                              rows={
                                searchMemberData?.issueBooklist?.length > 0
                                  ? searchMemberData?.issueBooklist?.map(
                                      (val, id) => {
                                        return {
                                          id: id,
                                          srNo: id + 1,
                                          bookName: val.bookName,
                                          issuedAt: moment(
                                            val?.issuedAt
                                          ).format("DD/MM/YYYY"),
                                        };
                                      }
                                    )
                                  : []
                              }
                              columns={columns}
                              pageSize={5}
                              rowsPerPageOptions={[5]}
                            />
                          )}
                        </Grid>
                      </Grid>
                      {!props.disabled ? (
                        <>
                          {isPendingBook ? (
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
                              <span
                                style={{
                                  marginLeft: "12vh",
                                  fontSize: "2vh",
                                  color: "red",
                                  fontWeight: 600,
                                }}
                              >
                                Note :- Please First Return the Issued Book
                              </span>
                            </Grid>
                          ) : (
                            ""
                          )}
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
                            {!isPendingBook ? (
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
                            ) : (
                              ""
                            )}
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
                                size="small"
                                variant="contained"
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
                                          ? "Record is Successfully Exited!"
                                          : "यशस्वीरित्या बाहेर पडलो",
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
