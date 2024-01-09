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
import Loader from "../../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";

const Index = (props) => {
  let appName = "LMS";
  let serviceName = "C-LMS";
  let applicationFrom = "Web";
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((lang) => lang?.labels?.language);
  const token = useSelector((state) => state.user.user.token);

  const router = useRouter();

  const closeMember = useForm({
    // resolver: yupResolver(bookIssueSchema),
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
    if (props.id) {
      axios
        .get(
          `${urls.LMSURL}/trnCloseMembership/getByIdAndServiceId?id=${
            props?.id
          }&serviceId=${86}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res, "reg123");
          reset(res.data);
          setValue("closeDate", new Date());
        });
    }
  }, [props]);

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
        setLibraryIdsList(response.data.libraryMasterList);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const getMembershipDetails = () => {
    setLoading(true);
    console.log("data", watch("membershipNo"), watch("libraryKey"));
    if (watch("membershipNo")) {
      const url =
        urls.LMSURL +
        "/trnApplyForNewMembership/getByMembershipDetailsForCancelMembership?membershipNo=" +
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
          setValue("memberName", response.data.applicantName);
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
          console.error(err);
          setLoading(false);
          swal(err.message, { icon: "error" });
        });
    }
  };

  const onSubmitForm = (data) => {
    setLoading(true);
    // const bodyForApi = {
    //     ...data,
    //     createdUserId: user?.id,
    //     applicationFrom,
    //     // serviceCharges: null,
    //     serviceId: 86,
    //     applicationStatus: 'APPLICATION_CREATED',
    // }
    // console.log('Final Data: ', bodyForApi)

    // Save - DB

    // axios
    //   .post(
    //     `${
    //       urls.LMSURL
    //     }/libraryMembership/cancellationMembership?membershipNo=${watch(
    //       "membershipNo"
    //     )}&cancellationRemark=${watch("remark")}&closeDate=${moment(
    //       watch("closeDate")
    //     ).format("YYYY/MM/DD")}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   )

    let _finalData = {
      membershipNo: watch("membershipNo"),
      cancellationDate: moment(watch("closeDate")).format("YYYY-MM-DD"),
      cancellationRemark: watch("remark"),
    };
    console.log("_finalData", _finalData);
    axios
      .post(
        `${urls.LMSURL}/libraryMembership/cancellationMembership`,
        _finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          setLoading(false);
          swal(
            language == "en" ? "Closed!" : "बंद!",
            language == "en"
              ? "Membership Closed successfully!"
              : "सदस्यत्व यशस्वीरित्या बंद झाले!",
            "success"
          );
          router.push({
            pathname: `/lms/transactions/closeMembership/scrutiny`,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        swal(
          language == "en" ? "Error!" : "त्रुटी!",
          language == "en"
            ? "Somethings Wrong, Membership not Closed!"
            : "काहीतरी चुकीचे, सदस्यत्व बंद नाही!",
          "error"
        );
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
                  {<FormattedLabel id="closeMembership" />}
                </h2>
              </div>
            </div> */}
            <Box>
              <BreadcrumbComponent />
            </Box>
            <LmsHeader labelName="closeMembership" />
            {loading ? (
              <Loader />
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
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
                          sx={{ marginTop: 2 }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="libraryCSC" required />
                            {/* Choose a library */}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // disabled={disable}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Choose a library"
                                id="demo-simple-select-standard"
                                labelId="id='demo-simple-select-standard-label'"
                              >
                                {libraryIdsList &&
                                  libraryIdsList.map((library, index) => (
                                    <MenuItem key={index} value={library.id}>
                                      {library.libraryName}
                                    </MenuItem>
                                  ))}
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
                      // style={{ marginTop: '1vh' }}
                      item
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
                        style={{ marginTop: "4vh" }}
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
                          endIcon={<OutIcon />}
                          // type="primary"
                          size="small"
                          onClick={() => {
                            getMembershipDetails();
                          }}
                        >
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
                          xl={4}
                          lg={4}
                          md={4}
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
                          xl={4}
                          lg={4}
                          md={4}
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
                      </Grid>

                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        style={{ marginTop: "1vh", marginLeft: "1vh" }}
                        columns={16}
                      >
                        {isPendingDue ? (
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
                              // label={<FormattedLabel id="firstName" required />}
                              label="Pending Dues"
                              variant="standard"
                              {...register("dues")}
                              error={!!errors.dues}
                              helperText={
                                errors?.dues ? errors.dues.message : null
                              }
                            />
                          </Grid>
                        ) : (
                          ""
                        )}
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <TextareaAutosize
                            //  InputLabelProps={{ shrink: true }}
                            disabled
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Reason for Membership Closure"
                            style={{ marginTop: 40, width: 300 }}
                            id="standard-basic"
                            label="Reason"
                            {...register("reason")}
                            error={!!errors.reason}
                            helperText={
                              errors?.reason ? errors.reason.message : null
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
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 14 }}>
                                        {" "}
                                        {/* Membership Close Date */}
                                        {
                                          <FormattedLabel id="membershipCloseDate" />
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
                        <Grid
                          item
                          style={{ marginTop: "1vh" }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <TextareaAutosize
                            //  InputLabelProps={{ shrink: true }}

                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Librarian Remark"
                            style={{ marginTop: 40, width: 300 }}
                            id="standard-basic"
                            label="Librarian Remark"
                            {...register("remark")}
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
                          />
                        </Grid>
                      </Grid>
                      {props.disabled ? (
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
                                  disabled={!(watch("remark") ? true : false)}
                                  endIcon={<SaveIcon />}
                                >
                                  {<FormattedLabel id="closeMembership" />}
                                  {/* Close Membership */}
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
                                variant="contained"
                                onClick={() => {
                                  swal({
                                    title:
                                      language == "en" ? "Exit?" : "बाहेर पडा?",
                                    text:
                                      language == "en"
                                        ? "Are you sure you want to exit this Record?"
                                        : "",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                  }).then((willDelete) => {
                                    if (willDelete) {
                                      swal(
                                        language == "en"
                                          ? "Record is Successfully Exit!"
                                          : "रेकॉर्डमधून यशस्वीरित्या बाहेर पडले",
                                        {
                                          icon: "success",
                                        }
                                      );
                                      backToHomeButton();
                                      // router.push({
                                      //   pathname: `/lms/transactions/closeMembership/scrutiny`,
                                      // });
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
