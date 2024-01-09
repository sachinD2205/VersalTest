import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import BoardRegistration from '../boardRegistrations/citizen/boardRegistration'
import AccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import RenewForm from "./renewForm";
import styles from "./renewalOfMBReg.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const [loader, setLoader] = useState(false);
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
  const disptach = useDispatch();
  const router = useRouter();

  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const [flagSearch, setFlagSearch] = useState(false);
  const [data, setData] = useState();
  const [showAccordian, setshowAccordian] = useState(true);

  const logedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state?.labels.language);
  const handleSearch = () => {
    let temp = watch("mBoardRegNo");
    console.log("type", typeof temp);
    let bodyForApi = {
      boardName: watch("mBoardRegName") || watch("mBoardRegNameF"),
      registrationDate: watch("marriageBoardRegistrationDate"),
      registrationYear:
        watch("marriageBoardRegisterationYear") !== ""
          ? watch("marriageBoardRegisterationYear")
          : null,
      registrationNumber: temp,
    };

    axios
      .post(
        `${urls.MR}/transaction/marriageBoardRegistration/getBySearchParams`,
        bodyForApi,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
        // allvalues,
      )
      .then((res) => {
        if (res.status == 200) {
          swal(
            language == "en" ? "Searched!" : "शोधले!",
            language == "en" ? "Record Found!" : "रेकॉर्ड सापडले!",
            "success",
          );
          // swal("Success!", "Record Searched successfully !", "success");
          setData(res.data);
          setFlagSearch(true);
          setshowAccordian(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  let user = useSelector((state) => state.user.user);
  const getById = (id) => {
    if (id != null && id != undefined && id != "") {
      axios
        .get(
          `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/getapplicantById?applicationId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((r) => {
          console.log("r.data", r.data);

          let oldAppId = r.data.trnApplicantId;

          console.log(oldAppId, "oldAppId");

          let certificateIssueDateTime;

          axios
            .get(
              `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${oldAppId}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            )
            .then((re) => {
              certificateIssueDateTime = re.data.certificateIssueDateTime;
              setValue("registrationDate", re.data.registrationDate);
              console.log("re.data", re.data);
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });

          reset(r.data);

          setValue("registrationDate", certificateIssueDateTime);

          setFlagSearch(true);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    console.log("router?.query?.pageMode", router?.query?.pageMode);
    getById(router?.query?.applicationId);
  }, [router?.query?.pageMode == "View"]);

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <div>
        <Paper
          sx={{
            marginLeft: 2,
            marginRight: 2,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
            border: 1,
            borderColor: "grey.500",
          }}
        >
          <>
            <div className={styles.details}>
              <div className={styles.h1Tag}>
                <h3
                  style={{
                    color: "white",
                    marginTop: "7px",
                  }}
                >
                  {<FormattedLabel id="onlyRMBR" />}

                  {/* Renewal of Marriage Board Registration */}
                </h3>
              </div>
            </div>
            {router?.query?.pageMode != "View" ? (
              showAccordian && (
                <>
                  <div>
                    <Accordion
                      sx={{
                        marginLeft: "5vh",
                        marginRight: "5vh",
                        marginTop: "2vh",
                        marginBottom: "2vh",
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          backgroundColor: "#278bff",
                          color: "white",
                          textTransform: "uppercase",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        backgroundColor="#278bff"
                        // sx={{
                        //   backgroundColor: '0070f3',
                        // }}
                      >
                        <Typography>
                          {language == "en"
                            ? " 1) Marriage Board Reg Number *"
                            : "१) विवाह मंडळ नोंदणी क्रमांक *"}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className={styles.row}>
                          <div>
                            <TextField
                              //  disabled
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="registerationNo" required />
                              }
                              // label="Marriage Board Reg Number"
                              variant="standard"
                              {...register("mBoardRegNo")}
                              // error={!!errors.aFName}
                              // helperText={errors?.aFName ? errors.aFName.message : null}
                            />
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <div style={{ textAlign: "center" }}>
                      <Typography variant="h6">OR</Typography>
                    </div>
                    <Accordion
                      sx={{
                        marginLeft: "5vh",
                        marginRight: "5vh",
                        marginTop: "2vh",
                        marginBottom: "2vh",
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          backgroundColor: "#278bff",
                          color: "white",
                          textTransform: "uppercase",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        backgroundColor="#278bff"
                        // sx={{
                        //   backgroundColor: '0070f3',
                        // }}
                      >
                        <Typography>
                          {" "}
                          {language == "en"
                            ? "2) Marriage Board Reg Name * ,Marriage Board Registration Date *"
                            : "२) विवाह मंडळाचे नाव *, विवाह मंडळ नोंदणी तारीख*"}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className={styles.row}>
                          <div>
                            <TextField
                              //  disabled
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={<FormattedLabel id="mbrName" required />}
                              // label={"Marriage Board Reg Name"}
                              variant="standard"
                              {...register("mBoardRegNameF")}
                              // error={!!errors.aFName}
                              // helperText={errors?.aFName ? errors.aFName.message : null}
                            />
                          </div>
                          <div style={{ marginTop: "10px" }}>
                            <FormControl sx={{ marginTop: 0 }}>
                              <Controller
                                control={control}
                                name="marriageBoardRegistrationDate"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 14 }}>
                                          {
                                            <FormattedLabel
                                              id="mbrDate"
                                              required
                                            />
                                          }
                                          {/* Marriage Board Reg Date */}
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD"),
                                        )
                                      }
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
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
                            </FormControl>
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <div style={{ textAlign: "center" }}>
                      <Typography variant="h6">OR</Typography>
                    </div>
                    <Accordion
                      sx={{
                        marginLeft: "5vh",
                        marginRight: "5vh",
                        marginTop: "2vh",
                        marginBottom: "2vh",
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          backgroundColor: "#278bff",
                          color: "white",
                          textTransform: "capitalize",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        backgroundColor="#278bff"
                        // sx={{
                        //   backgroundColor: '0070f3',
                        // }}
                      >
                        <Typography>
                          {language == "en"
                            ? "3) MARRIAGE BOARD REG NAME *, MARRIAGE BOARD REG YEAR *"
                            : "3) विवाह मंडळाचे नाव *, विवाह मंडळ नोंदणी वर्ष *"}{" "}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className={styles.row}>
                          <div>
                            <TextField
                              //  disabled
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={<FormattedLabel id="mbrName" required />}
                              // label={"Marriage Board Reg Name"}
                              variant="standard"
                              {...register("mBoardRegName")}
                              // error={!!errors.aFName}
                              // helperText={errors?.aFName ? errors.aFName.message : null}
                            />
                          </div>

                          <div>
                            <TextField
                              // disabled
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={<FormattedLabel id="mbrYear" required />}
                              // label={"Marriage Board Reg Year"}
                              variant="standard"
                              {...register("marriageBoardRegisterationYear")}
                            />
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>

                  <div className={styles.row}>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        // disabled={validateSearch()}
                        onClick={() => {
                          handleSearch();
                        }}
                      >
                        {<FormattedLabel id="search" />}
                        {/* Search */}
                      </Button>
                    </div>
                  </div>
                </>
              )
            ) : (
              <>
                <div className={styles.row}>
                  {/* <div className={styles.row}> */}
                  <TextField
                    //  disabled
                    sx={{ width: 300 }}
                    id="standard-basic"
                    disabled={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // defaultValue={"abc"}
                    label={<FormattedLabel id="registrationNumber" required />}
                    variant="standard"
                    {...register("registrationNumber")}
                  />
                  {/* </div> */}
                  {/* <div className={styles.row}> */}
                  <FormControl sx={{ marginTop: 0 }}>
                    <Controller
                      control={control}
                      name="registrationDate"
                      defaultValue={null}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled={true}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 14 }}>
                                {
                                  <FormattedLabel
                                    id="registrationDate"
                                    required
                                  />
                                }
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
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
                  </FormControl>
                  {/* </div> */}
                </div>
              </>
            )}
          </>
        </Paper>
      </div>
      {/* {router?.query?.pageMode == "Edit" ||
        (router?.query?.pageMode == "View" && (
          <HistoryComponent serviceId={14} applicationId={router?.query?.id} />
        ))} */}
      {flagSearch ? <RenewForm data={data} /> : ""}
    </div>
  );
};

export default Index;
