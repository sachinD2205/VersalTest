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
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import sweetAlert from "sweetalert";

//renewalOfIssuanceOfHawkerLicense
const Index = () => {
  const language = useSelector((state) => state?.labeles?.language);
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
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(dataValidation),
  });
  const [userType1, setuserType] = useState(null);
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    methos,
    watch,
    reset,
    formState: { errors },
  } = methods;
  let user = useSelector((state) => state.user.user);
  const userToken = useGetToken();
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
  const handleNext = (data) => {
    setValue("loadderState", true);


    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      setuserType(1);
    } else if (loggedInUser == "CFC_USER" || loggedInUser == "cfcUser") {
      setuserType(2);
    } else if (localStorage.getItem("loggedInUser") == "DEPT_USER") {
      setuserType(3);
    }

    let loggedInUser = localStorage.getItem("loggedInUser");
    const finalBodyForApi = {
      ...data,
      id: null,
      siteVisit: null,
      hawkerLicenseHistoryLst: null,
      loi: null,
      paymentCollection: null,
      activeFlag: "Y",
      serviceId: 25,
      serviceName: "Renewal Issuance Of Hawker License",
      createdUserId: user?.id,
      userType: userType1,
      oldIssuanceOfHawkerLicenseKey: data?.id,
      crCityNameMr: "पिंपरी चिंचवड",
      crStateMr: "महाराष्ट्र",
      appointmentType: "",
    };


    axios
      .post(
        `${urls.HMSURL}/transaction/renewalOfHawkerLicense/saveRenewalOfLicense`,
        finalBodyForApi,
        {
          headers: {
            role: "CITIZEN",
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (
          res?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setValue("loadderState", false);

          const applicationNumber = res?.data?.message?.slice("24");

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

  // ! useEffect 😁

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

  }, [watch("SearchAndOtherButtonConditionalState")]);

  useEffect(() => {
  }, [watch("loadderState")]);

  //Erross
  useEffect(() => {
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
                    {<FormattedLabel id="renewalOfIssuanceOfHawkerLicense" />}
                  </h2>
                </Box>


                {!watch("SearchAndOtherButtonConditionalState") && (
                  <>
                    <SearchHawkerLicense serviceId={"25"} />
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
                      {/** Submit Button */}

                      {!localStorage.getItem("renewalOfHawkerLicenseId") && (
                        <Button type="submit" variant="contained">
                          {<FormattedLabel id="submit" />}
                        </Button>
                      )}

                      {/** Clear Button */}

                      {!localStorage.getItem("renewalOfHawkerLicenseId") && (
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
