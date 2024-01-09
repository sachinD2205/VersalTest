import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  demandBillAdvocateDetailsSchema,
  demandBillAdvocateDetailsSchema1,
  demandBillBankDetailsSchema,
  demandBillDetailsSchema1,
} from "../../../../containers/schema/LegalCaseSchema/demandedBillToAdvocateSchema";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import AdvocateDetails from "./AdvocateDetails";
import BankDetails from "./BankDetails";
import BillDetails from "./BillDetails";
import Document from "./Document";

// Get Steps
function getSteps() {
  return [
    <FormattedLabel key={1} id="advocateDetails" />,
    <FormattedLabel key={2} id="bankDetails" />,
    <FormattedLabel key={3} id="billDetails" />,
    <FormattedLabel key={4} id="document" />,
  ];
}

// Setep Content
function getStepContent(step, pageMode, buttonInputStateNew) {
  switch (step) {
    case 0:
      return <AdvocateDetails />;

    case 1:
      return <BankDetails />;

    case 2:
      return <BillDetails />;

    case 3:
      return <Document buttonInputStateNew={buttonInputStateNew} />;
  }
}

// Main Component - View
const View = () => {
  const [dataValidation, setDataValidation] = useState(
    demandBillAdvocateDetailsSchema1
  );
  const methods = useForm({
    defaultValues: {
      courtName: "",
      caseMainType: "",
      subType: "",
      year: "",
      stampNo: "",
      fillingDate: null,
      filedBy: "",
      filedAgainst: "",
      caseDetails: "",
      advocateName: "",
      opponentAdvocate: "",
      concernPerson: "",
      appearanceDate: null,
      department: "",
      courtName: "",
    },
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
  });
  const {
    setValue,
    getValues,
    reset,
    register,
    handleSubmit,
    setError,
    trigger,
    watch,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [courtCaseNumbers, setcourtCaseNumbers] = useState([]);
  const steps = getSteps();
  const user = useSelector((state) => state.user.user.userDao);
  const language = useSelector((state) => state.labels.language);
  const [billDetail, setBillDetail] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [advocateId, setAdvocateId] = useState();
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [pageMode, setPageMode] = useState("Add");
  const [authority, setAuthority] = useState();
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const user1 = useSelector((state) => state?.user?.user);
  const token = useSelector((state) => state.user.user.token);

  const [getBankName, setGetBankName] = useState();
  const [advocateData, setAdvocateData] = useState({});
  const [advBnkName, setAdvBnkName] = useState();

  // get Bank Name
  useEffect(() => {
    axios
      .get(`${urls.LCMSURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGetBankName(res?.data?.bank);
        console.log("stateDaa", res?.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // handleNext
  const handleNext = (data) => {
    let billDetailLocal = JSON.parse(localStorage.getItem("billDetail"));
    let attachementLocal = JSON.parse(localStorage.getItem("attachments"));
    setBillDetail(billDetailLocal);
    setAttachments(attachementLocal);

    // const getBankNames = () => {

    // };

    // useEffect(() => {
    //   getBankNames();
    // }, []);

    if (activeStep == steps?.length - 1) {
      // console.log("activeStep", activeStep, steps.length - 1);
      // advocateDetails
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

      let advocate;
      let advocateName;
      let advID;

      // const updatedBankName = getBankName?.find(
      //   (b) => b.bankName == getValues("bankName")
      // )?.bankNameSr;

      // console.log("updatedBankName", getValues("bankName"));

      if (authority?.includes("ADMIN")) {
        advocate = {
          advocateName: advData?.advocateName,
          city: advData?.city,
          area: advData?.area,
          roadName: advData?.roadName,
          landmark: advData?.landmark,
          pinCode: advData?.pinCode,
          mobileNo: advData?.mobileNo,
          emailAddress: advData?.emailAddress,
          bankName: advData?.bankName,
          // bankName: updatedBankName,
          accountNo: advData?.accountNo,
          bankIFSCCode: advData?.bankIFSCCode,
          bankMICRCode: advData?.bankMICRCode,
        };
        advocateName = `${advData?.firstName} ${advData?.middleName} ${advData?.lastName}`;
        advID = advData?.id;
      } else {
        advocate = {
          advocateName: `${advocateData?.firstName} ${advocateData?.middleName} ${advocateData?.lastName}`,
          city: advocateData?.city,
          area: advocateData?.area,
          roadName: advocateData?.roadName,
          landmark: advocateData?.landmark,
          pinCode: advocateData?.pinCode,
          mobileNo: advocateData?.mobileNo,
          emailAddress: advocateData?.emailAddress,
          bankName: advBnkName,
          accountNo: advocateData?.accountNo,
          bankIFSCCode: advocateData?.bankIFSCCode,
          bankMICRCode: advocateData?.bankMICRCode,
        };
        advocateName = `${advocateData?.firstName} ${advocateData?.middleName} ${advocateData?.lastName}`;
        advID = advocateId;
        // advocate = {
        //   advocateName: getValues("advocateName"),
        //   city: getValues("city"),
        //   area: getValues("area"),
        //   roadName: getValues("roadName"),
        //   landmark: getValues("landmark"),
        //   pinCode: getValues("pinCode"),
        //   mobileNo: getValues("mobileNo"),
        //   emailAddress: getValues("emailAddress"),
        //   bankName: getValues("bankName"),
        //   // bankName: updatedBankName,
        //   accountNo: getValues("accountNo"),
        //   bankIFSCCode: getValues("bankIFSCCode"),
        //   bankMICRCode: getValues("bankMICRCode"),
        // };
        // advocateName = getValues("advocateName");
        // advID = advocateId;
      }

      console.log("advocaterrr", getValues("city"));

      // finalBody
      let finalBody;
      if (
        router?.query?.pageMode === "REASSIGN_BY_LEGAL_CLERK" ||
        router?.query?.pageMode === "EDIT_ONLY"
      ) {
        finalBody = {
          id: router?.query?.billID,
          role: "BILL_RAISED",
          billDetail,
          attachments: JSON.parse(localStorage.getItem("attachments")),
          advocate,
          advocateName,
          advocateId: advID,
        };
      } else {
        finalBody = {
          // ...data,
          // id: router.query.id,
          role: "BILL_RAISED",
          billDetail,
          attachments: JSON.parse(localStorage.getItem("attachments")),
          advocate,
          advocateName,
          advocateId: advID,
          // advID,
        };
      }
      console.log("finalBody180", finalBody);
      // console.log("___finalBody180", advocateData);

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
          if (res.status == 201 || res.status == 200) {
            localStorage.removeItem("attachments");
            localStorage.removeItem("billDetail");
            localStorage.removeItem("advDetails");
            localStorage.removeItem("buttonInputState");
            localStorage.removeItem("tableRowData");
            localStorage.removeItem("role");
            localStorage.removeItem("pageMode");
            localStorage.removeItem("btnInputStateDemandBill");
            localStorage.removeItem("paidAmountInputState");
            localStorage.removeItem("approvalAmountInputState");
            swal("Submited!", "Record Submited successfully !", "success");
            localStorage.removeItem("deleteButtonInputState");

            localStorage.removeItem("paidAmountTableState");
            localStorage.removeItem("demandedBillTableActionButtonInputState");
            localStorage.removeItem("billDetailComponent");
            localStorage.removeItem("approvalAmountTableState");
            router.push(`/LegalCase/dashboard`);
          }
        });
    } else {
      // alert("bhava")
      console.log(
        billDetailLocal.length != "0" && billDetailLocal.length != "undefined",
        "sdfsdfsdfsd"
      );

      if (activeStep == "2") {
        if (
          billDetailLocal.length == "0" ||
          billDetailLocal.length == "undefined"
        ) {
          if (watch("caseNumber") == "" || watch("caseNumber") == "undefined") {
            setError("caseNumber", { message: "case number is required" });
          }
          if (watch("feesAmount") == "" || watch("feesAmount") == "undefined") {
            setError("feesAmount", { message: "Case Fees is required" });
          }
        } else {
          // alert("okBhava");
          setActiveStep(activeStep + 1);
        }
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  }; // else end

  // handleBack
  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  // ---------------------- useEffect -----------

  // useEffect
  useEffect(() => {
    let auth = user1?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("SachinUser", auth);

    // newCondition
    console.log("routerQuery", router?.query);

    if (router?.query?.pageMode == "reassignByLegalCleark") {
      localStorage.setItem("approvalAmountInputState", false);
      localStorage.setItem("approvalAmountTableState", true);
      localStorage.setItem("paidAmountInputState", false);
      localStorage.setItem("paidAmountTableState", true);
      localStorage.setItem("demandedBillTableActionButtonInputState", true);
      localStorage.setItem("billDetailComponent", true);
      localStorage.setItem("billDetail", JSON.stringify([]));
      localStorage.setItem("deleteButtonInputState", true);
      localStorage.removeItem("role");
    } else if (
      router?.query?.pageMode == "REASSIGN_BY_LEGAL_CLERK" ||
      router?.query?.pageMode == "EDIT_ONLY" ||
      router?.query?.pageMode == "VIEW_ONLY"
    ) {
      localStorage.setItem("approvalAmountInputState", false);
      localStorage.setItem("approvalAmountTableState", true);
      localStorage.setItem("paidAmountInputState", false);
      localStorage.setItem("paidAmountTableState", true);
      localStorage.setItem("demandedBillTableActionButtonInputState", true);
      localStorage.setItem("billDetailComponent", true);
      // localStorage.setItem("billDetail", JSON.stringify([]));
      localStorage.setItem("deleteButtonInputState", true);
      localStorage.removeItem("role");
    } else {
      localStorage.setItem("approvalAmountInputState", false);
      localStorage.setItem("approvalAmountTableState", true);
      localStorage.setItem("paidAmountInputState", false);
      localStorage.setItem("paidAmountTableState", true);
      localStorage.setItem("demandedBillTableActionButtonInputState", true);
      localStorage.setItem("billDetailComponent", true);
      localStorage.setItem("billDetail", JSON.stringify([]));
      localStorage.setItem("deleteButtonInputState", true);
      localStorage.removeItem("role");
    }

    // user
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
          let response = res.data;
          console.log("res.data", res.data);
          reset(response);
          setAdvocateData(response);
          setValue(
            "bankName",
            getBankName?.find((s) => s.id == getValues("bankName"))?.bankName
          );
          setAdvocateId(response?.id);
          let _n = getBankName?.find(
            (s) => s.id == response?.bankName
          )?.bankName;
          setAdvBnkName(_n);
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
                  response.lastNameMr,
            setValue("shrink", true)
          );
        });

    setValue("disabledDemandedBillInputState", false);
  }, []);

  useEffect(() => {
    console.log("activeStep", activeStep);
    if (activeStep == "0") {
      setDataValidation(demandBillAdvocateDetailsSchema1);
    } else if (activeStep == "1") {
      setDataValidation(demandBillAdvocateDetailsSchema1);
    } else if (activeStep == "2") {
      setDataValidation(demandBillAdvocateDetailsSchema1);
    }
  }, [activeStep]);

  useEffect(() => {}, [methods]);

  useEffect(() => {
    localStorage.setItem("pageMode", pageMode);
  }, [pageMode]);

  useEffect(() => {}, [buttonInputStateNew]);

  useEffect(() => {
    if (router?.query?.pageMode == "Add") {
      setPageMode("Add");
    } else if (router?.query?.pageMode == "View") {
      setPageMode("View");
    }
  }, [router.isReady]);

  useEffect(() => {
    console.log("errors7878", errors);
  }, [errors]);

  // View
  return (
    <>
      <Paper
        sx={{
          margin: 5,
          padding: 1,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <div
          style={{
            backgroundColor: "#556CD6",
            color: "white",
            fontSize: 19,
            marginBottom: 40,
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
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleNext)}>
                  {getStepContent(
                    activeStep,
                    router?.query?.pageMode,
                    buttonInputStateNew
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginRight: "12vh",
                      marginLeft: "12vh",
                      pt: 2,
                    }}
                  >
                    <Button
                      disabled={activeStep === 0}
                      variant="contained"
                      color="primary"
                      onClick={() => previousStep()}
                    >
                      <FormattedLabel id="back" />
                    </Button>
                    <Box sx={{ flex: "1 auto" }} />
                    {/** SaveAndNext Button */}
                    <>
                      {activeStep != steps.length - 1 && (
                        <Button variant="contained" type="submit">
                          {router?.query?.pageMode === "VIEW_ONLY" ? (
                            <FormattedLabel id="next" />
                          ) : (
                            <FormattedLabel id="saveAndNext" />
                          )}
                        </Button>
                      )}
                    </>

                    {/**  Finish Submit */}
                    <>
                      {activeStep == steps.length - 1 && (
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={
                            router?.query?.pageMode === "VIEW_ONLY"
                              ? true
                              : false
                          }
                        >
                          <FormattedLabel id="finish" />
                        </Button>
                      )}
                    </>
                    <Box sx={{ flex: "0.01 auto" }} />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        localStorage.removeItem("attachments");
                        localStorage.removeItem("billDetail");
                        localStorage.removeItem("buttonInputState");
                        localStorage.removeItem("tableRowData");
                        localStorage.removeItem("role");
                        localStorage.removeItem("pageMode");
                        localStorage.removeItem("btnInputStateDemandBill");
                        localStorage.removeItem("paidAmountInputState");
                        localStorage.removeItem("approvalAmountInputState");
                        localStorage.removeItem("paidAmountInputState");
                        localStorage.removeItem("buttonInputstateNew");
                        localStorage.removeItem("paidAmountTableState");
                        localStorage.removeItem("advDetails");
                        localStorage.removeItem("billDetailId");
                        localStorage.removeItem(
                          "approvalAmountTableState",
                          true
                        );
                        localStorage.removeItem("billDetailComponent");
                        localStorage.removeItem("deleteButtonInputState");

                        localStorage.removeItem(
                          "demandedBillTableActionButtonInputState"
                        );
                        router.push(`/LegalCase/dashboard`);
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Box>
                </form>
              </FormProvider>
            </ThemeProvider>
          </>
        )}
      </Paper>
    </>
  );
};

export default View;
