import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import AdvocateDetails from "./AdvocateDetails";
import BankDetails from "./BankDetails";
import BillDetails from "./BillDetails";
import Document from "./Document";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// DemandedBIllToAdvocateToCleark
//LegalCase/transaction/demandedBillToAdvocate/DemandedBillToAdvocateClerk
const DemandedBillToAdvocateClerk = () => {
  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });
  const { contol, setValue, reset, getValues, register, handleSubmit } =
    methods;
  const router = useRouter();
  const [billDetail, setBillDetail] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [advocateId, setAdvocateId] = useState();
  const user = useSelector((state) => state.user.user.userDao);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

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

  // handleNext
  // HandleNext
  const handleNext = (data) => {
    setBillDetail(JSON.parse(localStorage.getItem("billDetail")));
    setAttachments(JSON.parse(localStorage.getItem("attachments")));
    let role = "BILL_SUBMISSION";

    // let advocate = {
    //   advocateName: getValues("advocateName"),
    //   city: getValues("city"),
    //   area: getValues("area"),
    //   roadName: getValues("roadName"),
    //   landmark: getValues("landmark"),
    //   pinCode: getValues("pinCode"),
    //   mobileNo: getValues("mobileNo"),
    //   emailAddress: getValues("emailAddress"),
    //   bankName: getValues("bankName"),
    //   accountNo: getValues("accountNo"),
    //   bankIFSCCode: getValues("bankIFSCCode"),
    //   bankMICRCode: getValues("bankMICRCode"),
    // };

    const finalBody = {
      ...data,
      id: getValues("id1"),
      role: role,
      advocateId,
      activeFlag: getValues("activeFlag"),
      billDetail: JSON.parse(localStorage.getItem("billDetail")),
      attachments: JSON.parse(localStorage.getItem("attachments")),
      // advocate: getValues("advocateName"),
    };

    axios
      .post(
        `${urls.LCMSURL}/transaction/demandedBillAndPaymentToAdvocate/save`,
        finalBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 201) {
          localStorage.removeItem("attachments");
          localStorage.removeItem("billDetail");
          swal(
            // "Submited!",
            language === "en" ? "Submited" : "सादर केले",
            // "Record Submited successfully !",
            language === "en"
              ? "Record Submited successfully ! "
              : "रेकॉर्ड यशस्वीरित्या सबमिट केले!",
            "success"
          );
        }
        localStorage.removeItem("attachments");
        localStorage.removeItem("billDetail");
        router.push(`/LegalCase/transaction/demandedBillToAdvocate/`);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    let tableData = JSON.parse(localStorage.getItem("tableRowData"));

    setValue(
      "advocateName",
      tableData?.advocate?.firstName +
        " " +
        tableData?.advocate?.middleName +
        " " +
        tableData?.advocate?.lastName
    );

    setValue("city", tableData?.advocate?.city);
    setValue("area", tableData?.advocate?.area);
    setValue("roadName", tableData?.advocate?.roadName);
    setValue("roadName", tableData?.advocate?.roadName);
    setValue("landmark", tableData?.advocate?.landmark);
    setValue("pinCode", tableData?.advocate?.pinCode);
    setValue("mobileNo", tableData?.advocate?.mobileNo);
    setValue("emailAddress", tableData?.advocate?.emailAddress);
    setValue("bankName", tableData?.advocate?.bankName);
    setValue("accountNo", tableData?.advocate?.accountNo);
    setValue("bankIFSCCode", tableData?.advocate?.bankIFSCCode);
    setValue("bankMICRCode", tableData?.advocate?.bankMICRCode);
    setValue("id1", tableData?.id);
    setValue("activeFlag", tableData?.activeFlag);
  }, [localStorage.getItem("nonExistent" != null)]);

  useEffect(() => {
    // setButtonInputStateNew(localStorage.getItem("buttonInputStateNew"));
    // setButtonInputState(localStorage.getItem("btnInputState"));
    // localStorage.removeItem("btnInputState");
    if (user)
      axios
        .get(
          `${urls.LCMSURL}/master/advocate/getById?advocateId=${user?.advocateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // if (res.status == 200) {
          // swal("Success!", "Record Fetched successfully !", "success");
          // }
          let response = res.data;
          // reset(response);
          setAdvocateId(response?.id);
          setValue(
            "advocateName",
            language === "en"
              ? response.firstName +
                  " " +
                  response.middleName +
                  " " +
                  response.lastName
              : response.firstNameMr +
                  " " +
                  response.middleNameMr +
                  " " +
                  response.lastNameMr
          );
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
  }, []);

  // View
  return (
    <>
      <Box>
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>
      <div>
        <ThemeProvider theme={theme}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleNext)}>
              <Paper
                elevation={5}
                sx={{
                  // marginLeft: "100px",
                  // marginRight: "50px",
                  // marginTop: "110px",
                  // padding: 1,
                  // paddingLeft: "20px",
                  p: "20px",
                  paddingTop: "20px",
                  height: "100%",
                  // backgroundColor: "#F5F5F5",
                }}
                // component={Box}
              >
                <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    // marginTop: 30,
                    marginBottom: 40,
                    // marginTop: ,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "50px",
                    marginRight: "75px",
                    borderRadius: 100,
                  }}
                >
                  <strong style={{ display: "flex", justifyContent: "center" }}>
                    Demand Bill To Advocate
                  </strong>
                </div>
                <div
                  style={{
                    margin: "50px",
                    // border: "2px solid red",
                  }}
                >
                  {/** Advocate Details */}
                  <Accordion
                    sx={{
                      margin: "40px",
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                    elevation={0}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography variant="subtitle">
                        Advocate Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <AdvocateDetails />
                    </AccordionDetails>
                  </Accordion>

                  {/** Bank Details */}
                  <Accordion
                    sx={{
                      margin: "40px",
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                    elevation={0}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography variant="subtitle">Bank Details</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      {/**   <BillDetails />*/}
                      {/*** Advocate Details */}
                      <BankDetails />
                    </AccordionDetails>
                  </Accordion>

                  {/** Documents  */}
                  <Accordion
                    sx={{
                      margin: "40px",
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                    elevation={0}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography variant="subtitle">Documents</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Document disabledInputSate={true} />
                    </AccordionDetails>
                  </Accordion>

                  {/** Bill Details */}
                  <Accordion
                    sx={{
                      margin: "40px",
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                    elevation={0}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography variant="subtitle">Bill Details</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <BillDetails />
                    </AccordionDetails>
                  </Accordion>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Stack direction="row">
                    <Button
                      style={{ display: "flex", justifyContent: "center" }}
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      <FormattedLabel id="save" />
                    </Button>
                  </Stack>
                </div>
              </Paper>
            </form>
          </FormProvider>
        </ThemeProvider>
      </div>
    </>
  );
};
export default DemandedBillToAdvocateClerk;
