//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { Paper, ThemeProvider } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
// import BoardDocumentThumbAndSign from '../../../../../components/marriageRegistration/BoardDocumentThumbAndSign'
import DocumentChecklistHeader from "../../../../../components/skySign/DocumentChecklistHeader";
import ScrutinyAction from "../../../../../components/skySign/ScrutinyAction";
// import BoardRegistration from '../../transactions/boardRegistrations/citizen/boardRegistration'
// import NewMembershipRegistration from '../citizen/newMembershipRegistration'
import ApplicantDetails from "../../components/ApplicantDetails";
import AddressOfLicense from "../../components/AddressOfLicense";
// import IssuanceOfLicense from "../components/IssuanceOfLicense";
import PartenershipDetail from "../../components/PartenershipDetail";
import IndustryAndEmployeeDetaills from "../../components/IndustryAndEmployeeDetaills";
import BusinessOrIndustryInfo from "../../components/BusinessOrIndustryInfo";
import AadharAuthentication from "../../components/AadharAuthentication";
import IndustryDocumentsUpload from "../../components/IndustryDocumentsUpload";
import StoreInfo from "../../components/StoreInfo";
import StoreAndEmployeeDetails from "../../components/StoreAndEmployeeDetails";
// import styles from '../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import theme from "../../../../../theme.js";
import urls from "../../../../../URLS/urls";
import StoreInformation from "../../components/StoreInformation";
import SiteVisit from "../../components/SiteVisit";
import HistoryComponent from "../../../../../components/skySign/HistoryComponent";
import Loader from "../../../../../containers/Layout/components/Loader";

import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm();
  let serviceId = Number(router.query.serviceId);
  const [data, setData] = useState();
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
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      setValue("applicationNumber", Number(ID));
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
              router.push(`/skySignLicense/dashboards`);
            }
          });
        });
    }
  }, [router.query]);
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
              {/* <DocumentChecklistHeader /> */}
              <div className={styles.detailsApot}>
                <div className={styles.h1TagApot}>
                  <h2
                    style={{
                      color: "white",
                      marginTop: "1.5vh",
                    }}
                  >
                    {language === "en"
                      ? router?.query?.pageHeader
                      : router?.query?.pageHeaderMr}
                    {/* {
                    language === 'en' ? router?.query?.pageMode : router?.query?.pageModeMr
                  } */}
                    {/* Document Verification */}
                  </h2>
                </div>
              </div>

              {/* <NewMembershipRegistration
            id={router?.query?.id}
            onlyDoc={true}
            preview={false}
            photos={data ? data : []}
          /> */}

              {/* <ApplicantDetails />

          <AadharAuthentication />

          <AddressOfLicense />

          <BusinessOrIndustryInfo />

          <IndustryAndEmployeeDetaills />
          <PartenershipDetail /> */}
              {/* {(router?.query?.role === 'DOCUMENT_VERIFICATION' ||
            router?.query?.role === 'FINAL_APPROVAL') && (
            <BoardDocumentThumbAndSign />
          )} */}

              {/* <BoardDocumentThumbAndSign /> */}
              {serviceId === 9 ? (
                <>
                  <ApplicantDetails />

                  {/* <AadharAuthentication /> */}

                  <AddressOfLicense />

                  <StoreInformation />

                  <PartenershipDetail />

                  <IndustryDocumentsUpload />
                  {user.roles.includes("HOD") ? <SiteVisit /> : ""}
                  <HistoryComponent
                    serviceId={9}
                    applicationId={router?.query?.id}
                  />
                </>
              ) : (
                ""
              )}
              <ScrutinyAction loading={setLoading} />
            </FormProvider>
          </Paper>
        </ThemeProvider>
      )}
    </>
  );
};

export default Index;
