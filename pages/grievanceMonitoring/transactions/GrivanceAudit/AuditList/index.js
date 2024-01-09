import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, ThemeProvider, CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../../URLS/urls";
import { AuditListTitleSchema } from "../../../../../components/grievanceMonitoring/schema/GrivanceAuditReportSchema";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil.js";
import theme from "../../../../../theme.js";
import AuditList from "./AuditList";
import AuditListStyle from "./AuditList.module.css";
import SearchGrivanceAuditListByReportName from "./SearchGrivanceAuditListByReportName";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";


const Index = () => {
  let language = useSelector((state) => state?.labels?.language);
  const [isLoading, setIsLoading] = useState(false);
  const [dataValidation, setDataValidation] = useState(
    AuditListTitleSchema(language)
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
    let url = ``;
    let finalBodyForApiForGetByAuditName;
    finalBodyForApiForGetByAuditName = {
      reportTitle: data?.reportTitle,
    };

    // getByAuditName
    if (watch("buttonName") == "SubmitButton") {
      setIsLoading(true);
      url = `${urls.GM}/internalAuditMaster/getByAuditName`;
      axios
        .post(url, finalBodyForApiForGetByAuditName, {
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
              setValue("AuditList", res?.data);
              setValue("searchInputState", false);
            } else {
              language == "en"
                ? sweetAlert(
                    "Record Not Found!",
                    "Record Not Found Against This Report Name",
                    "error",
                    { button: "Ok" }
                  )
                : sweetAlert(
                    "रेकॉर्ड सापडला नाही!",
                    "या अहवालाच्या नावाविरुद्ध रेकॉर्ड आढळले नाही",
                    "error",
                    { button: "ठीक आहे" }
                  );
            }
          } else {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };

  useEffect(() => {
    setValue("reportTitle", null);
    setValue("AuditList", []);
    setValue("GrivanceAuditListTableData", []);
    setValue("searchInputState", true);
    setValue("tokenNo", "");
    setValue("TokenHistoryDetails", []);
    clearErrors();
  }, []);

  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <div className={AuditListStyle.MainDiv}>
        <ThemeProvider theme={theme}>
          {isLoading && <CommonLoader />}
          <Paper square elevation={5} className={AuditListStyle.Paper}>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleNext)}>
                <SearchGrivanceAuditListByReportName />
                {watch("AuditList") != null &&
                  watch("AuditList") != undefined &&
                  watch("AuditList").length != "0" && (
                    <>
                      <AuditList />
                    </>
                  )}
              </form>
            </FormProvider>
          </Paper>
        </ThemeProvider>
      </div>
    </>
  );
};

export default Index;
