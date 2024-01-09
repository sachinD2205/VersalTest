import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { Collapse } from "@mui/material";
import { useRouter } from "next/router";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import CaseDetails from "./CaseDetails";
import TransferDetails from "./TransferDetails";
import Document from "./Document";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";

import {
  caseDetailsSchema,
  transferDetailsSchema,

  // demandBillBankDetailsSchema,
  // demandBillAdvocateDetailsSchema,
  // demandBillDetailsSchema1,
} from "../../../../containers/schema/LegalCaseSchema/transferAdvocateSchema";
import moment from "moment";
import Loader from "../../../../containers/Layout/components/Loader";
import { language } from "../../../../features/labelSlice";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// import Document from "./next/document";

const View = () => {
  const [dataValidation, setDataValidation] = useState(
    // transferDetailsSchema
    caseDetailsSchema
    // transferDetailsSchema
  );

  const { Panel } = Collapse;
  const router = useRouter();
  const [selectNewDate, setSelectNewDate] = React.useState(null);
  const [filingDate, setFilingDate] = React.useState(null);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const [loadderState, setLoadderState] = useState(false);

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

  function getSteps() {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="transferDetails" />,
      <FormattedLabel key={3} id="document" />,
    ];
  }

  const steps = getSteps();
  const methods = useForm({
    defaultValues: {
      // courtCaseNumber:"",
      caseType: "",
      court: "",
      filingDate: null,
      filedBy: "",
      filedByMr: "",
      transferFromAdvocate: "",
      transferToAdvocate: "",
      fromDate: "",
      toDate: "",
      newAppearnceDate: "",
      remark: "",
    },
    mode: "onChange",

    resolver: yupResolver(dataValidation),
    criteriaMode: "all",
  });

  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <CaseDetails />;

      case 1:
        return <TransferDetails />;

      case 2:
        return <Document />;
    }
  }

  const handleNext = (data) => {
    setLoadderState(true);

    console.log("data----->", JSON.stringify(data));
    console.log("handleNext", activeStep);
    const formattedtoDate = moment(data.toDate).format("YYYY-MM-DD");
    const formattedfromDate = moment(data.fromDate).format("YYYY-MM-DD");
    const formattednewAppearnceDate = moment(data.newAppearnceDate).format(
      "YYYY-MM-DD"
    );

    // filingDate
    const formattedfilingDate = moment(data.filingDate).format("YYYY-MM-DD");

    const finalBody = {
      ...data,
      caseNumberId: data?.caseNumberId,
      // toDate: formattedtoDate,
      fromDate: formattedfromDate,
      newAppearnceDate: formattednewAppearnceDate,
      filingDate: formattedfilingDate,
      transferAdvocateAttchment: JSON.parse(
        localStorage.getItem("transferAdvocateAttchment")
      ),
    };
    if (activeStep == steps.length - 1) {
      sweetAlert({
        title:
          language === "en" ? "Are you sure?" : "किंवा आपण सुनिश्चित आहात का?",
        text:
          language === "en"
            ? "Do you want to save the record?"
            : "किंवा आपण रेकॉर्ड साठवू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willSave) => {
        if (willSave) {
          console.log("_____finalBody", finalBody);
          // alert("Hei")
          axios
            .post(
              `${urls.LCMSURL}/trnsaction/transferAdvocate/save`,
              finalBody,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              if (res.status == 200) {
                swal(
                  // "Submited!",
                  language === "en" ? "Saved!" : "जतन केले!",
                  //  "Record Submited successfully !",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
                localStorage.removeItem("transferAdvocateAttchment");
                setLoadderState(false);
              }
              router.push(`/LegalCase/transaction/transferAdvocate/`);
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
          // .catch((er) => {
          //   setLoadderState(false);
          //   sweetAlert(
          //     "Error",
          //     er?.message ?? "Something Went Wrong",
          //     "error"
          //   );
          // });
        }
      });
    } else {
      setActiveStep(activeStep + 1);
      setLoadderState(false);
    }
  };

  // For Validation

  useEffect(() => {
    console.log("steps", activeStep);
    if (activeStep == "0") {
      setDataValidation(caseDetailsSchema);
    } else if (activeStep == "1") {
      setDataValidation(transferDetailsSchema);
    }
  }, [activeStep]);

  useEffect(() => {
    if (
      router?.query?.pageMode == "Edit" ||
      router?.query?.pageMode == "View"
    ) {
      console.log("Data------", router?.query);
      const finalData1 = {
        ...router?.query,
        caseNumberId: router?.query?.caseNumber,
        transferToAdvocate: router?.query?.transferToAdvocate,
        // transferFromAdvocate: router?.query?.transferFromAdvocate,
      };
      console.log("finalData1", finalData1);

      methods.reset(finalData1);
    }
  }, [router.query]);

  // useEffect(() => {}, []);

  return (
    <>
      {/* <Box> */}
      <div>
        <BreadcrumbComponent />
      </div>
      {/* </Box> */}
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            // marginLeft: 5,
            // marginRight: 5,
            // justifyContent:"center",
            // alignContent:"center",
            marginTop: 1,
            marginBottom: 5,
            padding: 1,
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {};
              const stepProps = {};

              return (
                <Step {...stepProps} key={index}>
                  <StepLabel {...labelProps}>{step}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === steps.length ? (
            <Typography variant="h3" align="center">
              Thank You
            </Typography>
          ) : (
            <>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleNext)}>
                  {getStepContent(activeStep)}
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    {activeStep !== 0 && (
                      <Button variant="outlined" onClick={() => previousStep()}>
                        <FormattedLabel id="back" />
                      </Button>
                    )}
                    <Box sx={{ flex: "1 auto" }} />
                    <Button
                      variant="contained"
                      color="primary"
                      // onClick={"./LegalCase/master/advocate"}
                      onClick={() => {
                        router.push(`/LegalCase/transaction/transferAdvocate/`);
                        localStorage.removeItem("transferAdvocateAttchment");
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                    <Box sx={{ flex: "0.01 auto" }} />

                    <Button
                      disabled={
                        activeStep === steps.length - 1 &&
                        router?.query?.pageMode === "View"
                          ? true
                          : false
                      }
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      {activeStep === steps.length - 1 ? (
                        <FormattedLabel id="finish" />
                      ) : (
                        <FormattedLabel id="saveAndNext" />
                      )}
                    </Button>
                  </Box>
                </form>
              </FormProvider>
            </>
          )}
        </Paper>
      )}
    </>
  );
};

export default View;
