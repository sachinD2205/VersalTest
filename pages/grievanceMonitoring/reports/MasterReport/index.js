import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, ThemeProvider } from "@mui/material";
import axios from "axios";
import React, { useEffect,useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import MasterReporSchema from "../../../../components/grievanceMonitoring/schema/MasterReporSchema";
import theme from "../../../../theme.js";
import styles from "../MasterReport/Master.module.css";
import AfterSelectingCategoryWise from "./AfterSelectingCategoryWise";
import AfterSelectingPointWise from "./AfterSelectingPointWise";
import DayWiseInDetails from "./DayWiseInDetails";
import DayWiseSelection from "./DayWiseSelection";
import PralabitDetails from "./PralabitDetails";
import SearchCreteriaReport from "./SearchCreteriaReport";
import AuditData from "./AuditData";
import SarathiAuditData from "./SarathiAuditData";
import CategoryWiseChart from "./CategoryWiseChart";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import moment from "moment";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil.js";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    resolver: yupResolver(MasterReporSchema),
  });
  const {
    setValue,
    watch,
    clearErrors,
  } = methods;

  let user = useSelector((state) => state?.user?.user);
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
    let url;
    let body;

    // defalutClearAllState
    setValue("pointWise", null);
    setValue("PralabitData", null);
    setValue("EscalationPralabitData", null);
    setValue("DayWiseSelectionData", null);
    setValue("dayWiseDataInDetails", null);
    setValue("categoryWiseData", null);

    let sendFromDate = moment(data?.fromDate).format(
      "YYYY-MM-DD"
    );
    let sendToDate = moment(data?.toDate).format("YYYY-MM-DD");
    let crrlastCommissionorDate = moment(data?.lastCommissionorDate).format("YYYY-MM-DD");

      // Check if the fromDate and toDate values match the default values
  const isDefaultFromDate = data?.fromDate === "01/01/2022";
  const isDefaultToDate = data?.toDate === moment().format("DD/MM/YYYY");

  
    body = {
      department: data?.department,
      lstSubDepartment: data?.lstSubDepartment,
      splevent: data?.splevent,
      crrfromDate: sendFromDate === null ? isDefaultFromDate : sendFromDate,
      crrtoDate: sendToDate === null ? isDefaultToDate : sendToDate,
      crrlastCommissionorDate: crrlastCommissionorDate,
    };

    // pointWise
    if (watch("buttonName") == "pointWise") {
      url = `${urls.GM}/report/getCommissionorReviewReportGhoshwaraV2`;

      axios
        .post(url, body, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            setValue("pointWise", res?.data);
            setValue("searchButtonInputState", false);
            setValue("loadderState", false);
          } else {
            setValue("loadderState", false);
          }
        })
        .catch((error) => {
          setValue("loadderState", false);
          cfcErrorCatchMethod(error,false);
        });
    }

    // CategoryWise
    else if (watch("buttonName") == "categoryWise") {
      url = `${urls.GM}/report/getReportDepartmentWiseComplaintStatusV2`;

      axios
        .post(url, body, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            setValue("categoryWiseData", res?.data);
            setValue("searchButtonInputState", false);
            setValue("loadderState", false);
          } else {
            setValue("loadderState", false);
          }
        })
        .catch((error) => {
          setValue("loadderState", false);
          cfcErrorCatchMethod(error,false);
        });
    }
  };


  useEffect(() => {
    setValue("loadderState", false);
    setValue("department", null);
    setValue("lstSubDepartment", []);
    setValue("splevent", []);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("lastCommissionorDate", null);
    clearErrors();
    // categoryWiseData
    setValue("categoryWiseData", null);
    // pointwise
    setValue("pointWise", null);
    // ghoshwara
    setValue("PralabitData", null);
    setValue("EscalationPralabitData", null);
    // daywiseSelection
    setValue("DayWiseSelectionData", null);
    // dayWiseSelectionInDetail
    setValue("dayWiseDataInDetails", null);
    //searchButton
    setValue("searchButtonInputState", true);
    // Audited
    setValue("AuditData", null);
    setValue("ClickFiledNameEn", "");
    setValue("ClickFiledNameMr", "");
    // SarathiAudited
    setValue("SarathiAuditData", null);
    setValue("ClickFiledNameEn", "");
    setValue("ClickFiledNameMr", "");
    // chart
    setValue("CategoryWiseChartData", null);
    setValue("selectedDepartmentForChart", "");
  }, []);


  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <div className={styles.MainDiv}>
        <ThemeProvider theme={theme}>
          {watch("loadderState") && (
            <CommonLoader />
          )} 
           {(
            <Paper square elevation={5} className={styles.Paper}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleNext)}>
                  {/** Search Screen */}
                  <SearchCreteriaReport />

                  {/** after Click on PointWise */}
                  {watch("pointWise") != null &&
                  watch("pointWise") != undefined ? (
                    <>
                      {/** Point Wise Data */}
                      <AfterSelectingPointWise />

                      {/** Goshwara   */}
                      {(watch("PralabitData") != null &&
                        watch("PralabitData") != undefined) ||
                      (watch("EscalationPralabitData") != null &&
                        watch("EscalationPralabitData") != undefined) ? (
                        <>
                          <PralabitDetails />

                          {/** DayWiseData */}
                          {watch("DayWiseSelectionData") != null &&
                          watch("DayWiseSelectionData") != undefined ? (
                            <>
                              <DayWiseSelection />

                              {/** DayWiseInDetails */}

                              {/** DayWiseData */}
                              {watch("dayWiseDataInDetails") != null &&
                              watch("dayWiseDataInDetails") != undefined ? (
                                <>
                                  <DayWiseInDetails />
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}

                  {/** Audit  */}
                  {watch("AuditData") != null &&
                  watch("AuditData") != undefined ? (
                    <>
                      <AuditData />

                      {/** AuditDayWiseData */}
                      {watch("dayWiseDataInDetails") != null &&
                      watch("dayWiseDataInDetails") != undefined ? (
                        <>
                          <DayWiseInDetails />
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}

                  {/** SarathiAuditData */}
                  {watch("SarathiAuditData") != null &&
                  watch("SarathiAuditData") != undefined ? (
                    <>
                      <SarathiAuditData />
                      {/** DayWiseData */}
                      {watch("dayWiseDataInDetails") != null &&
                      watch("dayWiseDataInDetails") != undefined ? (
                        <>
                          <DayWiseInDetails />
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}

                  {/** PointWise on Click  */}
                  {watch("categoryWiseData") != null &&
                    watch("categoryWiseData") != undefined && (
                      <>
                        {/** Category Wise  Data */}
                        <AfterSelectingCategoryWise />

                        {/** Pralabit On Click  */}
                        {(watch("PralabitData") != null &&
                          watch("PralabitData") != undefined) ||
                        (watch("EscalationPralabitData") != null &&
                          watch("EscalationPralabitData") != undefined) ? (
                          <>
                            <PralabitDetails />

                            {/** DayWiseData */}
                            {watch("DayWiseSelectionData") != null &&
                            watch("DayWiseSelectionData") != undefined ? (
                              <>
                                <DayWiseSelection />

                                {/** DayWiseInDetails */}

                                {/** DayWiseData */}
                                {watch("dayWiseDataInDetails") != null &&
                                watch("dayWiseDataInDetails") != undefined ? (
                                  <>
                                    <DayWiseInDetails />
                                  </>
                                ) : (
                                  ""
                                )}
                              </>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          ""
                        )}

                        {/** CategoryWise Chart */}
                        {watch("CategoryWiseChartData") != null &&
                          watch("CategoryWiseChartData") != undefined && (
                            <>
                              {/** PointWise  Data */}
                              <CategoryWiseChart />
                            </>
                          )}
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
