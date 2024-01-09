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
import IssuanceOfLicense from "../../components/IssuanceOfLicense";
import PartenershipDetail from "../../components/PartenershipDetail";
import BusinessAndEmployeeDetails from "../../components/BusinessAndEmployeeDetails";
import BusinessInfo from "../../components/BusinessInfo";
import AadharAuthentication from "../../components/AadharAuthentication";
import IndustryDocumentsUpload from "../../components/IndustryDocumentsUpload";
// import styles from '../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import theme from "../../../../../theme.js";
import urls from "../../../../../URLS/urls";
import HistoryComponent from "../../../../../components/skySign/HistoryComponent";
import SiteVisit from "../../components/SiteVisit";
import Loader from "../../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm();
  const userToken = useGetToken();

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
  const [tempState, setTemp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ID = router.query?.id;

    console.log("router?.query?", router?.query);
    if (ID) {
      setValue("applicationNumber", Number(ID));
      setLoading(true);
      axios
        .get(
          `${urls.SSLM}/trnIssuanceOfBusinessLicense/getByIdAndServiceId?serviceId=7&id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          // setdata(res.data.trnApplicantDetailsDao[0])
          setLoading(false);
          reset(res?.data);
          if (res?.data?.trnPartnerDao?.length > 0) {
            setValue("addPartnerCheckBox", true);
          }
          setTemp(true);
          console.log("loi recept data", res?.data);
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
          }).then((will) => {
            if (will) {
              router.push(
                `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny`
              );
            }
          });
        });
      // .then((resp) => {
      //   console.log('MODOFCER', resp.data)
      //   // setValue("applicationNumber", ID)
      //   reset(resp.data)
      //   // setValue("applicationNumber", ID)

      //   setData(resp.data)
      // })
    }
  }, [router?.query]);
  useEffect(() => {}, [tempState]);

  useEffect(() => {
    console.log("kay role a", user.roles.includes("HOD"));
  });
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
              {serviceId === 7 ? (
                <>
                  <ApplicantDetails />

                  {/* <AadharAuthentication /> */}

                  <AddressOfLicense />

                  <BusinessInfo />

                  <PartenershipDetail />

                  <IndustryDocumentsUpload
                    disabled={router?.query?.disabled ?? false}
                  />
                  {user.roles.includes("HOD") ? <SiteVisit /> : ""}
                  <HistoryComponent
                    serviceId={7}
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
