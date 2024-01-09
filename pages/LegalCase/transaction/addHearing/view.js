import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import {
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Box,
} from "@mui/material";

import { useRouter } from "next/router";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import { Alert } from "@mui/material";
import HearingDetails from "./HearingDetails";
import DocumentsUpload from "./DocumentsUpload";
import { MultilineChart } from "@mui/icons-material";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

import {
  addHearingSchema,
  addHearingSchemaMr,
  courtCaseDetailsSchema,
} from "../../../../containers/schema/LegalCaseSchema/addHearingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { id } from "date-fns/locale";
import { useSelector } from "react-redux";
import { language } from "../../../../features/labelSlice";
import moment from "moment";
import Loader from "../../../../containers/Layout/components/Loader";

const View = () => {
  const router = useRouter();
  const [loadderState, setLoadderState] = useState(false);

  const [dataValidation, setDataValidation] = useState(addHearingSchema);
  // const [dataValidation, setDataValidation] = useState();
  const language = useSelector((state) => state?.labels?.language);
  const user = useSelector((state) => {
    return state.user.user;
  });
  const token = useSelector((state) => state.user.user.token);

  // useEffect(() => {
  //   console.log("activeStep", activeStep);
  //   if (activeStep == "0") {
  //     setDataValidation(addHearingSchema);
  //   } else if (activeStep == "1") {
  //     setDataValidation(addHearingSchema);
  //   }
  // }, [activeStep]);

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

  useEffect(() => {
    if (activeStep == "0" && language == "en") {
      setDataValidation(addHearingSchema);
    }
    if (activeStep == "0" && language == "mr") {
      setDataValidation(addHearingSchemaMr);
    }
  }, [activeStep, language]);

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    defaultValues: {
      caseNumber: "",
    },
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  function getSteps() {
    return [
      <FormattedLabel key={1} id="addHearing" />,
      <FormattedLabel key={2} id="document" />,
    ];
  }

  function getStepContent(step) {
    console.log("activeStep", step);
    switch (step) {
      case 0:
        return <HearingDetails />;
      case 1:
        return <DocumentsUpload />;
    }
  }

  const handleNext = (data) => {
    console.log("handleNext", data);
    setLoadderState(true);

    // Fetch the data from Local Storage
    const files = JSON.parse(
      localStorage.getItem("TrnAddHearingAttachmentDao")
    );

    console.log("files", files);
    const hearingDate = moment(data.hearingDate).format("YYYY-MM-DD");

    const finalBody = {
      ...data,
      // caseNumber: router.query.caseReference,
      // caseNumber: router.query.caseNumber,
      caseNumber: getValues("caseNumber"),

      caseEntry: router.query.id,

      createdUserId: user.id,

      // JSON Key Suggested by Swati Ma'am
      addHearingAttachment: files,
      hearingDate,
      // caseEntry: router.query.id,

      // id:id
    };
    console.log("__finalBody", finalBody);
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
          axios
            .post(`${urls.LCMSURL}/trnsaction/addHearing/save`, finalBody, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              if (res.status == 200) {
                localStorage.removeItem("TrnAddHearingAttachmentDao");
                setLoadderState(false);

                swal(
                  // "Submited!",
                  language === "en" ? "Saved!" : "जतन केले!",
                  //  "Record Submited successfully !",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
              }
              setLoadderState(false);

              router.push(`/LegalCase/transaction/newCourtCaseEntry/`);
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        }
      });
    } else {
      setLoadderState(false);

      setActiveStep(activeStep + 1);
    }
  };

  // Handle Back
  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  const nextStep = () => {
    setActiveStep((activeStep) => activeStep + 1);
  };
  useEffect(() => {
    console.log("_____vvv", router.query);
  }, [router.query]);
  useEffect(() => {
    console.log("dataaaa", router.query);
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "View" ||
      router.query.pageMode == "addHearing"
    ) {
      const data = {
        ...router.query,
        id: null,
      };
      methods.reset(data);
      methods.setValue("caseMainType", router.query.caseMainType),
        methods.setValue("fillingDate", router.query.fillingDate),
        methods.setValue("court", router.query.court),
        // appearanceDate
        methods.setValue("hearingDate", router.query.appearanceDate),
        methods.setValue("courtCaseNumber", router.query.courtCaseNumber);
      methods.setValue("caseStatus", router.query.caseStatus);

      // id
    }
  }, []);

  // For Validation

  useEffect(() => {
    console.log("query123", router.query);
  }, [router.query]);

  return (
    <>
      <Box
        sx={{
          marginLeft: "3vw",
        }}
      >
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
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
                    <Button
                      disabled={activeStep == 0}
                      variant="outlined"
                      onClick={() => previousStep()}
                    >
                      <FormattedLabel id="back" />
                    </Button>
                    <Box sx={{ flex: "1 auto" }} />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        localStorage.removeItem("TrnAddHearingAttachmentDao");
                        router.push(
                          `/LegalCase/transaction/newCourtCaseEntry/`
                        );
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                    <Box sx={{ flex: "0.01 auto" }} />

                    <Button variant="contained" color="primary" type="submit">
                      {activeStep === steps.length - 1 ? (
                        <FormattedLabel id="finish" />
                      ) : (
                        <FormattedLabel id="save" />
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
