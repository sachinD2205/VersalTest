//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { Button, Paper, Stack, ThemeProvider } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
// import BoardDocumentThumbAndSign from '../../../../../components/marriageRegistration/BoardDocumentThumbAndSign'
// import BoardRegistration from '../../transactions/boardRegistrations/citizen/boardRegistration'
// import NewMembershipRegistration from '../citizen/newMembershipRegistration'
import ApplicantDetails from "../components/ApplicantDetails";
import AddressOfLicense from "../components/AddressOfLicense";
// import IssuanceOfLicense from "../components/IssuanceOfLicense";
import PartenershipDetail from "../components/PartenershipDetail";
import IndustryAndEmployeeDetaills from "../components/IndustryAndEmployeeDetaills";
import BusinessOrIndustryInfo from "../components/BusinessOrIndustryInfo";
import IndustryDocumentsUpload from "../components/IndustryDocumentsUpload";
import BusinessAndEmployeeDetails from "../components/BusinessAndEmployeeDetails";
import BusinessInfo from "../components/BusinessInfo";
import StoreInformation from "../components/StoreInformation.js";
// import styles from '../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import styles from "../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import CloseIcon from "@mui/icons-material/Close";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import IndustryInfo from "./IndustryInfo";
import Loader from "../../../../containers/Layout/components/Loader";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm();
  let serviceId = Number(router?.query?.serviceId);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const {
    // getValues,
    // register,
    // handleSubmit,
    // control,
    reset,
    setValue,
    formState: { errors },
  } = methods;
  //http://localhost:8090/mr/api/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}
  // useEffect(() => {
  //   console.log('router?.query?', router?.query)
  //   if (router?.query?.id) {

  //     // setData(router?.query)
  //     // reset(router?.query)
  //   }
  // }, [])

  // useEffect(() => {
  //   console.log('router?.query?.role', router?.query?.role)
  //   reset(router?.query)
  // }, [])

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

  useEffect(() => {
    const ID = router.query?.id;

    console.log("router?.query?", router?.query);
    if (ID) {
      setValue("applicationNumber", Number(ID));
      if (serviceId === 7) {
        setLoading(true);
        axios
          .get(
            `${urls.SSLM}/trnIssuanceOfBusinessLicense/getByIdAndServiceId?serviceId=${router?.query?.serviceId}&id=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            setLoading(false);
            // setdata(res.data.trnApplicantDetailsDao[0])
            reset(res.data);
            if (res?.data?.trnPartnerDao?.length > 0) {
              setValue("addPartnerCheckBox", true);
            }
            console.log("loi recept data", res.data);
          })
          .catch((err) => {
            setLoading(false);
            sweetAlert({
              title: language === "en" ? "Error !! " : "त्रुटी !!",
              text:
                language === "en"
                  ? "Somethings Wrong !! Getting error while fetching records !"
                  : "काहीतरी त्रुटी !! रेकॉर्ड मिळवताना त्रुटी येत आहे",
              icon: "error",
              button: language === "en" ? "Ok" : "ठीक आहे",
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                // router.push(`/skySignLicense/dashboards`);
                router.push(`/dashboard`);
              }
            });
          });
      } else if (serviceId === 8) {
        setLoading(true);
        axios
          .get(
            `${urls.SSLM}/trnIssuanceOfIndustrialLicense/getByServiceIdAndId?serviceId=8&id=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            setLoading(false);
            // setdata(res.data.trnApplicantDetailsDao[0])
            reset(res?.data);
            console.log("loi recept data", res.data);
          })
          .catch((err) => {
            setLoading(false);
            sweetAlert({
              title: language === "en" ? "Error !! " : "त्रुटी !!",
              text:
                language === "en"
                  ? "Somethings Wrong !! Getting error while fetching records !"
                  : "काहीतरी त्रुटी !! रेकॉर्ड मिळवताना त्रुटी येत आहे",
              icon: "error",
              button: language === "en" ? "Ok" : "ठीक आहे",
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                router.push(`/dashboard`);
              }
            });
          });
      } else if (serviceId === 9) {
        setLoading(true);
        axios
          .get(
            `${urls.SSLM}/Trn/TrnIssuanceOfStoreLicense/getByIdAndServiceId?serviceId=9&id=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            setLoading(false);
            // setdata(res.data.trnApplicantDetailsDao[0])
            reset(res?.data);
            if (res?.data?.trnPartnerDao?.length > 0) {
              setValue("addPartnerCheckBox", true);
            }
          })
          .catch((err) => {
            setLoading(false);
            sweetAlert({
              title: language === "en" ? "Error !! " : "त्रुटी !!",
              text:
                language === "en"
                  ? "Somethings Wrong !! Getting error while fetching records !"
                  : "काहीतरी त्रुटी !! रेकॉर्ड मिळवताना त्रुटी येत आहे",
              icon: "error",
              button: language === "en" ? "Ok" : "ठीक आहे",
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                router.push(`/dashboard`);
              }
            });
          });
      }

      // .then((resp) => {
      //   console.log('MODOFCER', resp.data)
      //   // setValue("applicationNumber", ID)
      //   reset(resp.data)
      //   // setValue("applicationNumber", ID)

      //   setData(resp.data)
      // })
    }
  }, [router?.query]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <Paper
            sx={{
              marginLeft: 2,
              marginRight: 2,
              marginTop: 1,
              marginBottom: 1,
              padding: 1,
              // borderRadius: 5,
              border: 1,
              borderColor: "#5BCAFA",
            }}
          >
            <FormProvider {...methods}>
              {serviceId === 7 ? (
                <>
                  <ApplicantDetails />

                  {/* <AadharAuthentication /> */}

                  <AddressOfLicense />

                  <BusinessInfo />

                  <BusinessAndEmployeeDetails />

                  <PartenershipDetail />

                  <IndustryDocumentsUpload disabled={true} />
                </>
              ) : (
                ""
              )}

              {serviceId === 8 ? (
                <>
                  <ApplicantDetails />

                  <AddressOfLicense />

                  {/* <BusinessOrIndustryInfo /> */}
                  <IndustryInfo />

                  <IndustryAndEmployeeDetaills />

                  <PartenershipDetail />
                  <IndustryDocumentsUpload disabled={true} />
                </>
              ) : (
                ""
              )}
              {serviceId === 9 ? (
                <>
                  <ApplicantDetails />

                  <AddressOfLicense />

                  <StoreInformation />

                  <PartenershipDetail />

                  <IndustryDocumentsUpload disabled={true} />
                </>
              ) : (
                ""
              )}

              <Stack
                spacing={15}
                direction="row"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  endIcon={<CloseIcon />}
                  color="error"
                  onClick={() => {
                    // alert(serviceId)

                    router.push(`/dashboard`);
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Stack>
            </FormProvider>
          </Paper>
        </ThemeProvider>
      )}
    </>
  );
};

export default Index;
