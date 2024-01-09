import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, ThemeProvider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import {
  GrivanceAuditReportSchema,
  GrivanceAuditListTitleSchema,
} from "../../../../components/grievanceMonitoring/schema/GrivanceAuditReportSchema";
import Loader from "../../../../containers/Layout/components/Loader";
import theme from "../../../../theme.js";
import GrivanceAuditCSS from "../GrivanceAuditReport/GrivanceAudit.module.css";
import SearchGrivanceAudit from "./SearchGrivanceAudit";
import GrivanceList from "./GrivanceList";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";

// ! Sachin Durge 🥰
// http://localhost:4000/grievanceMonitoring/reports/GrivanceAuditReport
// Grivance Audit
const Index = () => {
  const [dataValidation, setDataValidation] = useState(
    GrivanceAuditReportSchema,
  );
  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    resolver: yupResolver(dataValidation),
  });
  const {
    register,
    getValues,
    setValue,
    setError,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    formState: { errors },
  } = methods;
  const router = useRouter();
  let user = useSelector((state) => state?.user?.user);
  let language = useSelector((state) => state?.labels?.language);

  // handleNext
  const handleNext = (data) => {
    setValue("loadderState", true);
    console.table("handleNext", data);
    console.log("GrivanceReportAuditSearch", watch("buttonName"), data);
    let url = ``;
    let finalBodyForApiGrivanceAudit;
    let finalBodyForDepartmentCategory;
    let sendFromDate = moment(data?.fromDate).format(
      "YYYY-MM-DDT"
    ) + "00:00:01";
    let sendToDate = moment(data?.toDate).format("YYYY-MM-DDT") + "23:59:59";

    // 1st Payload
    // finalBodyForApiGrivanceAudit
    finalBodyForApiGrivanceAudit = {
      percentage: Number(data?.percentage),
      fromDate: sendFromDate,
      toDate: sendToDate,
      department: data?.department,
      subDepartmentlist: data?.subDepartmentlist,
    };

    // 2nd Payload
    // finalBodyForDepartmentCategory
    finalBodyForDepartmentCategory = {
      reportTitle: data?.reportTitle,
      complaintIdList: data?.complaintIdList,
    };

    // console.log(
    //   "finalBodyForApiGrivanceAudit",
    //   data?.complaintIdList,
    //   watch("complaintIdList"),
    // );

    // 1st Api
    // GrievanceAuditData
    if (watch("buttonName") == "SubmitButton") {
      url = `${urls.GM}/trnRegisterComplaint/loadForAudit`;
     

      axios
        .post(url, finalBodyForApiGrivanceAudit, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {

          if (res?.status == 200 || res?.status == 201) {
            // for null pointer handle
            if (res?.data.length > 0) {
              console.log("dlsjf4334", res?.data?.length);
              // console.log(
              //   `point wise report Data 12 chya gavat`,
              //   res?.data,
              //   res?.data[0]?.complaintRandomids,
              // );
              setValue("GrievanceAuditData", res?.data);
              setValue("complaintIdList", res?.data[0]?.complaintRandomids);
              setValue("searchInputState", false);
              setValue("loadderState", false);
            } else {
              sweetAlert({
                title: language === "en" ? "OOPS!" : "क्षमस्व!",
                text:
                  language === "en"
                    ? "There is nothing to show you!"
                    : "माहिती उपलब्ध नाही",
                icon: "warning",
                // buttons: ["No", "Yes"],
                dangerMode: false,
                closeOnClickOutside: false,
              })
              setValue("loadderState", false);
            }



          }

          else {
            setValue("loadderState", false);
            sweetAlert(language==='en'?"Network Error":'"नेटवर्क एरर"', language==='en'?"Please Try Again":"कृपया पुन्हा प्रयत्न करा", "error");
          }




        })
        .catch((error) => {
          console.log("Error", error);
          setValue("loadderState", false);
          catchMethod(error)
          // sweetAlert(language==='en'?"Network Error":'"नेटवर्क एरर"', language==='en'?"Please Try Again":"कृपया पुन्हा प्रयत्न करा", "error");
        });
    }

    //  Second Api
    //
    else if (watch("buttonName") == "GrivanceListReportNameSubmitButton") {
      url = `${urls.GM}/internalAuditMaster/saveAudit`;

      axios
        .post(url, finalBodyForDepartmentCategory, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            setValue("searchInputState", false);
            setValue("loadderState", false);
            console.log("sdfjsdlfkj393", res?.data);
            sweetAlert(
              res?.data?.status == "SUCCESS" ? language==='en'?"Saved!":"जतन केले!" :language==='en'? "Not Saved":"जतन केलेले नाही",
              res?.data?.message,
              res?.data?.status == "SUCCESS" ? "success" : "error",
            ).then((will) => {
              if (will) {
                router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
              }
            });
          } else {
            setValue("loadderState", false);
            console.log("error52323", res)
            sweetAlert(
              res?.data?.status == "SUCCESS" ? language==='en'?"Saved!":"जतन केले!" :language==='en'? "Not Saved":"जतन केलेले नाही",
              res?.data?.message,
              res?.data?.status == "SUCCESS" ? "success" : "error",
            );
          }
        })
        .catch((error) => {
          console.log("error523", error?.response?.data?.status);
          setValue("loadderState", false);
          catchMethod(error)
          // sweetAlert
          // sweetAlert(
          //   error?.response?.data?.status == "SUCCESS" ? language==='en'?"Saved!":"जतन केले!" :language==='en'? "Not Saved":"जतन केलेले नाही",
          //   error?.response?.data?.message,
          //   error?.response?.data?.status == "SUCCESS" ? "success" : "error",
          // );

        });
    }
    setValue("loadderState", false);
  };

  const catchMethod = (err) => {
    console.log("error ", err);
    if (err?.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server Is Unreachable Or May Be A Network Issue, Please Try After Sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err?.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized Access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };
  // =============================================> useEffect ====>

  useEffect(() => {
    setValue("department", null);
    setValue("subDepartmentlist", []);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("percentage", "");
    // GrievanceAuditData
    setValue("GrievanceAuditData", null);
    setValue("complaintIdList", null);
    setValue("reportTitle", "");
    setValue("searchInputState", true);
    clearErrors();
    setValue("loadderState", false);
  }, []);

  useEffect(() => {
    console.log("loadderState", watch("loadderState"));
  }, [watch("loadderState")]);

  useEffect(() => {
    console.log("GrievanceAuditData", watch("GrievanceAuditData"));

    // conditionalValidation
    if (
      watch("GrievanceAuditData") != null &&
      watch("GrievanceAuditData") != undefined &&
      watch("GrievanceAuditData").length != 0
    ) {
      setDataValidation(GrivanceAuditListTitleSchema);
    } else {
      setDataValidation(GrivanceAuditReportSchema);
    }
  }, [watch("GrievanceAuditData")]);

  useEffect(() => {
    console.log("errors121", errors);
  }, [errors]);

  useEffect(() => { }, [dataValidation]);

  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <div className={GrivanceAuditCSS.MainDiv}>
        <ThemeProvider theme={theme}>
          {watch("loadderState") ? (
            <CommonLoader />
          ) : (
            <Paper square elevation={5} className={GrivanceAuditCSS.Paper}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleNext)}>
                  {/** Search Screen */}
                  <SearchGrivanceAudit />
                  {(watch("GrievanceAuditData") != null &&
                    watch("GrievanceAuditData") != undefined &&
                    watch("GrievanceAuditData").length != "0") && (
                      <>
                        <GrivanceList />
                      </>
                    )}
                </form>
              </FormProvider>
            </Paper>
          )}
        </ThemeProvider>
      </div>
    </>
  );
};

export default Index;
