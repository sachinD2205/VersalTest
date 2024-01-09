import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Paper, Stack, ThemeProvider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import AadharAuthentication from "../../../../components/streetVendorManagementSystem/components/AadharAuthentication";
import AdditionalDetails from "../../../../components/streetVendorManagementSystem/components/AdditionalDetails";
import AddressOfHawker from "../../../../components/streetVendorManagementSystem/components/AddressOfHawker";
import DocumentsUploadWithouDeleteButton from "../../../../components/streetVendorManagementSystem/components/DocumentsUploadWithouDeleteButton";
import HawkerDetails from "../../../../components/streetVendorManagementSystem/components/HawkerDetails";
import PropertyAndWaterTaxes from "../../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes";
import SearchHawkerLicense from "../../../../components/streetVendorManagementSystem/components/SearchHawkerLicense";
import {
  RenewalOfHawkerLicenseSchema,
  RenewalOfHawkerLicenseSchema1,
} from "../../../../components/streetVendorManagementSystem/schema/RenewalOfHawkerLicenseSchema";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import sweetAlert from "sweetalert";

//renewalOfIssuanceOfHawkerLicense
// http://localhost:4000/streetVendorManagementSystem/transactions/renewalOfIssuanceOfHawkerLicense
const Index = () => {
  const language = useSelector((state) => state?.lables?.language);
  const [dataValidation, setDataValidation] = useState(
    RenewalOfHawkerLicenseSchema(
      language,
      localStorage.getItem("castOtherA"),
      localStorage.getItem("castCategoryOtherA"),
      localStorage.getItem("applicantTypeOtherA"),
      localStorage.getItem("disablityNameYNA"),
      localStorage.getItem("oldLicenseYNA"),
      localStorage.getItem("voterNameYNA")
    )
  );
  const userToken = useGetToken();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(dataValidation),
  });
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    methos,
    watch,
    reset,
    formState: errors,
  } = methods;
  const [userType1, setuserType] = useState(null);
  let loggedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  // // loadderSetTimeOutFunction
  // const loadderSetTimeOutFunction = () => {
  //   setTimeout(() => {
  //     setValue("loadderState", false);
  //   }, 0);
  // };

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
  const handleNext = (data) => {

    setValue("loadderState", true);
    console.log("data -----3324", data);
    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      setuserType(1);
    } else if (localStorage.getItem("loggedInUser") == "CFC_USER" || loggedInUser == "cfcUser") {
      setuserType(2);
    } else if (localStorage.getItem("loggedInUser") == "DEPT_USER") {
      setuserType(3);
    }

    let loggedInUser = localStorage.getItem("loggedInUser");
    console.log("loggedInUser++", loggedInUser);
    const finalBodyForApi = {
      ...data,
      id: null,
      siteVisit: null,
      hawkerLicenseHistoryLst: null,
      loi: null,
      paymentCollection: null,
      activeFlag: "Y",
      serviceId: 27,
      serviceName: "Cancellation Of Hawker License",
      createdUserId: user?.id,
      userType: userType1,
      oldIssuanceOfHawkerLicenseKey: data?.id,
      // pageMode: "APPLICATION_CREATED",
      // applicationStatus: "APPLICATION_CREATED",
      crCityNameMr: "पिंपरी चिंचवड",
      crStateMr: "महाराष्ट्र",
      appointmentType: "",
      // id: draftId,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.HMSURL}/cancellationOfHawkerLicense/saveCancellationOfLicense`,
        finalBodyForApi,
        {
          headers: {
            role: "CITIZEN",
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("res?.stasdf", res);
        if (
          res?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setValue("loadderState", false);
          const applicationNumber = res?.data?.message?.slice("24");
          console.log("res34234", res?.data?.message?.slice("24"));

          res?.data?.id
            ? sweetAlert(
              "Submitted!",
              `application number is ${applicationNumber}`,
              "success",
              {
                buttons: { ok: "OK" },
              }
            )
            : sweetAlert(
              "अर्ज सादर केला!",
              `
            अर्ज क्रमांक ${applicationNumber}`,
              "success",
              {
                buttons: { ok: "ठीक आहे" },
              }
            );
          if (loggedInUser == "citizenUser") {
            setValue("loadderState", false)
            router.push(`/dashboard`)
          } else if (loggedInUser == "CFC_USER" || loggedInUser == "cfcUser") {
            setValue("loadderState", false)
            router.push(`/CFC_Dashboard`)
          } else if (loggedInUser == "DEPT_USER") {
            setValue("loadderState", false)
            router.push(`/streetVendorManagementSystem/dashboards`)
          }
        } else {
          setValue("loadderState", false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
        console.log("issuanceOfHawkerLicenseSaveApi", error);
      });
  };

  // handleExit
  const handleExit = () => {
    if (loggedInUser == "citizenUser") {
      setValue("loadderState", false)
      router.push(`/dashboard`)
    } else if (loggedInUser == "CFC_USER" || loggedInUser == "cfcUser") {
      setValue("loadderState", false)
      router.push(`/CFC_Dashboard`)
    } else if (loggedInUser == "DEPT_USER") {
      setValue("loadderState", false)
      router.push(`/streetVendorManagementSystem/dashboards`)
    }
    reset();
    setValue("disabledFieldInputState", false);
    setValue("SearchAndOtherButtonConditionalState", false);
  };

  // handleClear
  const handleClearRecord = () => {
    reset();
    setValue("dateOfBirth", null);
    setValue("applicantName", "");
    setValue("certificateNo", "");
    setValue("disabledFieldInputState", false);
    setValue("SearchAndOtherButtonConditionalState", false);
  };

  //! useEffect

  useEffect(() => {
    localStorage.setItem("castOtherA", watch("castOtherA"));
    localStorage.setItem("castCategoryOtherA", watch("castCategoryOtherA"));
    localStorage.setItem("applicantTypeOtherA", watch("applicantTypeOtherA"));
    localStorage.setItem("disablityNameYNA", watch("disablityNameYNA"));
    localStorage.setItem("oldLicenseYNA", watch("oldLicenseYNA"));
    localStorage.setItem("voterNameYNA", watch("voterNameYNA"));
    RenewalOfHawkerLicenseSchema(
      language,
      localStorage.getItem("castOtherA"),
      localStorage.getItem("castCategoryOtherA"),
      localStorage.getItem("applicantTypeOtherA"),
      localStorage.getItem("disablityNameYNA"),
      localStorage.getItem("oldLicenseYNA"),
      localStorage.getItem("voterNameYNA")
    );
  }, []);

  useEffect(() => {
    if (watch("addresDetail")) {
      // alert("withCheckBox");
      setDataValidation(
        RenewalOfHawkerLicenseSchema(
          language,
          watch("castOtherA"),
          watch("castCategoryOtherA"),
          watch("applicantTypeOtherA"),
          watch("disablityNameYNA"),
          watch("oldLicenseYNA"),
          watch("voterNameYNA")
        )
      );
    } else {
      // alert("withoutCheckBox");
      setDataValidation(
        RenewalOfHawkerLicenseSchema1(
          language,
          watch("castOtherA"),
          watch("castCategoryOtherA"),
          watch("applicantTypeOtherA"),
          watch("disablityNameYNA"),
          watch("oldLicenseYNA"),
          watch("voterNameYNA")
        )
      );
    }
  }, [
    watch("addresDetail"),
    language,
    watch("castOtherA"),
    watch("castCategoryOtherA"),
    watch("applicantTypeOtherA"),
    watch("disablityNameYNA"),
    watch("oldLicenseYNA"),
    watch("voterNameYNA"),
  ]);

  useEffect(() => {
    console.log(
      "loddderStateNew898",
      watch("SearchAndOtherButtonConditionalState")
    );
  }, [watch("SearchAndOtherButtonConditionalState")]);

  useEffect(() => {
    console.log("loadderState", watch("loadderState"));
  }, [watch("loadderState")]);

  useEffect(() => {
    console.log("errorsCancellation", errors);
  }, [errors]);

  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>
            <ThemeProvider theme={theme}>
              <Paper
                square
                sx={{
                  padding: "8vh 2vw",
                  backgroundColor: "white",
                }}
                elevation={5}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    background:
                      "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                  }}
                >
                  <h2>
                    {
                      <FormattedLabel id="cancellationOfIssuanceOfHawkerLicense" />
                    }
                  </h2>
                </Box>
                {!watch("SearchAndOtherButtonConditionalState") && (
                  <>
                    <SearchHawkerLicense serviceId={"27"} />
                  </>
                )}

                {watch("SearchAndOtherButtonConditionalState") && (
                  <>
                    <HawkerDetails />
                    <AddressOfHawker />
                    <AadharAuthentication />
                    <PropertyAndWaterTaxes />
                    <AdditionalDetails />
                    <DocumentsUploadWithouDeleteButton />
                  </>
                )}

                {/** Button */}
                {watch("SearchAndOtherButtonConditionalState") && (
                  <>
                    <Stack
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                      direction="row"
                      spacing={5}
                    >
                      {/** submit */}

                      {!localStorage.getItem(
                        "cancellationOfHawkerLicenseId"
                      ) && (
                          <Button
                            type="submit"
                            // onClick={() => {
                            //   setValue("loadderState", true);
                            // }}
                            variant="contained"
                          >
                            {<FormattedLabel id="submit" />}
                          </Button>
                        )}

                      {/** Clear Button */}

                      {!localStorage.getItem(
                        "cancellationOfHawkerLicenseId"
                      ) && (
                          <Button onClick={handleClearRecord} variant="contained">
                            {<FormattedLabel id="clear" />}
                          </Button>
                        )}

                      {/** Exit Button */}
                      <Button onClick={handleExit} variant="contained">
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Stack>
                  </>
                )}
              </Paper>
            </ThemeProvider>
          </form>
        </FormProvider>
      )}
    </>
  );
};

export default Index;
