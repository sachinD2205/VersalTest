import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, ThemeProvider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import AadharAuthentication from "../../../../components/streetVendorManagementSystem/components/AadharAuthentication";
import AdditionalDetails from "../../../../components/streetVendorManagementSystem/components/AdditionalDetails";
import AddressOfHawker from "../../../../components/streetVendorManagementSystem/components/AddressOfHawker";
import DocumentsUpload from "../../../../components/streetVendorManagementSystem/components/DocumentsUpload";
import HawkerDetails from "../../../../components/streetVendorManagementSystem/components/HawkerDetails";
import PropertyAndWaterTaxes from "../../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes";
import HawkerMasterCSS from "../../../../components/streetVendorManagementSystem/styles/NewHawkerMaster.module.css";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

//! Sachin_Durge🥶
// HawkerMaster
const Inedex = () => {
  // methods
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    mode: "onChange",
  });
  // destructure
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
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
  //finalSubmit
  const handleNext = (data) => {
    console.log("HawkerMasterFinalSubmitFinalData", data);

    // role
    const role = "citizen";

    // finalBody
    const finalBodyForApi = {
      ...data,
    };

    // url
    const url = `${urls.HMSURL}/IssuanceofHawkerLicense/editIssuanceOfHawkerLicense`;

    // path
    const routerPushPath = ``;

    // basedOnuserPath-loggedInUser
    if (loggedInUser == "departmentUser") {
      routerPushPath = `/streetVendorManagementSystem/dashboards`;
    } else {
      routerPushPath = `/dashboard`;
    }

    axios
      .post(url, finalBodyForApi, {
        headers: {
          role: role,
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        if (
          res?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          res?.data?.id
            ? sweetAlert("Submitted!", res?.data?.message, "success")
            : sweetAlert("Submitted !", res?.data?.message, "success");
          router.push(routerPushPath);
          setValue("loadderState", false);
        } else {
          sweetAlert("Network Failed!", "please try again later...", "error");
          setValue("loadderState", false);
        }
      })
      .catch((error) => {
        console.log("HawkerMasterFinalApiError", error);
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // View
  return (
    <div>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>
            <Paper className={HawkerMasterCSS.Paper}>
              <div className={HawkerMasterCSS.MainHeader}>
                {language == "en" ? "Hawker Master" : "पथविक्रेता मास्टर"}
              </div>
              <div className={HawkerMasterCSS.Components}>
                <HawkerDetails />
                <AddressOfHawker />
                <AadharAuthentication />
                <PropertyAndWaterTaxes />
                <AdditionalDetails />
                <DocumentsUpload />
              </div>
            </Paper>
          </form>
        </FormProvider>
      </ThemeProvider>
    </div>
  );
};

export default Inedex;
