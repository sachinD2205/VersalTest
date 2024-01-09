import { yupResolver } from "@hookform/resolvers/yup";
import { Paper } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import {
  GrivanceAuditListTitleSchema,
  GrivanceAuditReportSchema,
} from "../../../../components/grievanceMonitoring/schema/GrivanceAuditReportSchema";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import GrivanceAuditCSS from "./GrivanceAudit.module.css";
import GrivanceList from "./GrivanceList";
import SearchGrivanceAudit from "./SearchGrivanceAudit";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";

// Grivance Audit
const Index = () => {
  const [dataValidation, setDataValidation] = useState(
    GrivanceAuditReportSchema(language)
  );
  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    resolver: yupResolver(dataValidation),
  });
  const {
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = methods;
  const router = useRouter();
  let user = useSelector((state) => state?.user?.user);
  let language = useSelector((state) => state?.labels?.language);
  const [isLoading, setIsLoading] = useState(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // handleNext
  const handleNext = (data) => {
    setValue("loadderState", true);
    let url = ``;
    let finalBodyForApiGrivanceAudit;
    let finalBodyForDepartmentCategory;
    finalBodyForApiGrivanceAudit = {
      percentage: Number(data?.percentage),
      fromDate: data?.fromDate,
      toDate: data?.toDate,
      department: data?.department,
      subDepartmentlist: data?.subDepartmentlist,
    };

    finalBodyForDepartmentCategory = {
      reportTitle: data?.reportTitle,
      complaintIdList: data?.complaintIdList,
    };
    if (watch("buttonName") == "SubmitButton") {
      setIsLoading(true);
      url = `${urls.GM}/trnRegisterComplaint/loadForAudit`;
      axios
        .post(url, finalBodyForApiGrivanceAudit, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res?.status == 200 || res?.status == 201) {
            if (
              res?.data != null &&
              res?.data != undefined &&
              res?.data?.length != 0
            ) {
              setValue("GrievanceAuditData", res?.data);
              setValue("complaintIdList", res?.data[0]?.complaintRandomids);
              setValue("searchInputState", false);
              setValue("loadderState", false);
            } else {
              sweetAlert({
                title:
                  language == "en"
                    ? "Record Not Found!"
                    : "रेकॉर्ड सापडला नाही!",
                text:
                  language == "en"
                    ? "Record Not Found Against This Parameter"
                    : "रेकॉर्ड आढळले नाही",
                icon: "error",
                dangerMode: false,
                button: language === "en" ? "Ok" : "ठीक आहे",
                closeOnClickOutside: true,
              });

              setValue("loadderState", false);
            }
          } else {
            sweetAlert({
              title: language === "en" ? "Network Error" : "नेटवर्क एरर",
              text:
                language === "en"
                  ? "Please Try Again"
                  : "कृपया पुन्हा प्रयत्न करा",
              icon: "error",
              dangerMode: false,
              button: language === "en" ? "Ok" : "ठीक आहे",
              closeOnClickOutside: true,
            });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }

    //  Second Api
    //
    else if (watch("buttonName") == "GrivanceListReportNameSubmitButton") {
      url = `${urls.GM}/internalAuditMaster/saveAudit`;
      setIsLoading(true);
      axios
        .post(url, finalBodyForDepartmentCategory, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res?.status == 200 || res?.status == 201) {
            setValue("loadderState", false);
            setValue("searchInputState", false);

            language == "en"
              ? sweetAlert({
                  title:
                    res?.data?.status == "SUCCESS" ? "Saved!" : "Not Saved",
                  text: res?.data?.message,
                  icon: res?.data?.status == "SUCCESS" ? "success" : "error",
                  dangerMode: false,
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  closeOnClickOutside: true,
                }).then((will) => {
                  if (will) {
                    router.push(
                      `/grievanceMonitoring/dashboards/deptUserDashboard`
                    );
                  }
                })
              : sweetAlert({
                  title:
                    res?.data?.status == "SUCCESS"
                      ? "जतन केले!"
                      : "जतन केले नाही !",
                  text: res?.data?.message,
                  icon: res?.data?.status == "SUCCESS" ? "success" : "error",
                  dangerMode: false,
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  closeOnClickOutside: true,
                }).then((will) => {
                  if (will) {
                    router.push(
                      `/grievanceMonitoring/dashboards/deptUserDashboard`
                    );
                  }
                });
          } else {
            setValue("loadderState", false);

            language == "en"
              ? sweetAlert({
                  title:
                    res?.data?.status == "SUCCESS" ? "Saved!" : "Not Saved",
                  text: res?.data?.message,
                  icon: res?.data?.status == "SUCCESS" ? "success" : "error",
                  dangerMode: false,
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  closeOnClickOutside: true,
                })
              : sweetAlert({
                  title:
                    res?.data?.status == "SUCCESS"
                      ? "जतन केले!"
                      : "जतन केले नाही !",
                  text: res?.data?.message,
                  icon: res?.data?.status == "SUCCESS" ? "success" : "error",
                  dangerMode: false,
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  closeOnClickOutside: true,
                });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          setValue("loadderState", false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };


  useEffect(() => {
    setValue("department", null);
    setValue("subDepartmentlist", []);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("percentage", "");
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
    // conditionalValidation
    if (
      watch("GrievanceAuditData") != null &&
      watch("GrievanceAuditData") != undefined &&
      watch("GrievanceAuditData").length != 0
    ) {
      setDataValidation(GrivanceAuditListTitleSchema(language));
    } else {
      setDataValidation(GrivanceAuditReportSchema(language));
    }
  }, [watch("GrievanceAuditData")]);

  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <div className={GrivanceAuditCSS.MainDiv}>
        <>
          {isLoading && <CommonLoader />}
          <Paper square elevation={5} className={GrivanceAuditCSS.Paper}>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {/** Search Screen */}
                <SearchGrivanceAudit />
                {watch("GrievanceAuditData") != null &&
                  watch("GrievanceAuditData") != undefined &&
                  watch("GrievanceAuditData").length != "0" && (
                    <>
                      <GrivanceList />
                    </>
                  )}
              </form>
            </FormProvider>
          </Paper>
        </>
      </div>
    </>
  );
};

export default Index;
