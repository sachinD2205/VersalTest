import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import React, { useRef } from "react";
import theme from "../../../../../theme";
import { useForm } from "react-hook-form";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import router from "next/router";
import axios from "axios";
import { ExitToApp, Save } from "@mui/icons-material";
import urls from "../../../../../URLS/urls";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FileTable from "../../../../../components/SlumBillingManagementSystem/FileUpload/FileTable";
import sweetAlert from "sweetalert";
import { useReactToPrint } from "react-to-print";
import Noc from "../generateDocuments/noc";
import Loader from "../../../../../containers/Layout/components/Loader/index";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";

const Index = () => {
  const {
    watch,
    setValue,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
  });

  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [finalFiles, setFinalFiles] = useState([]);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [dataSource, setDataSource] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [slumName, setSlumName] = useState("");
  const [villageName, setVillageName] = useState("");
  const [villageData, setVillageData] = useState("");
  const [slumData, setSlumData] = useState([]);
  const [hutData, setHutData] = useState({});
  const [hutOwnerData, setHutOwnerData] = useState({});

  const [ownership, setOwnership] = useState({});
  const [usageType, setUsageType] = useState({});
  const [cityDropDown, setCityDropDown] = useState([
    {
      id: 1,
      cityEn: "Pimpri",
      cityMr: "पिंपरी",
    },
    {
      id: 2,
      cityEn: "Chinchwad",
      cityMr: "चिंचवड",
    },
  ]);
  const headers = { Authorization: `Bearer ${user?.token}` };



  useEffect(() => {
    getNocDataById(router.query.id);
    getHutData();
    getVillageData();
    getSlumData();
  }, [router.query.id]);

  useEffect(() => {
    getOwnerShipData();
    getUsageType();
  }, [hutData]);

  const getNocDataById = (id) => {
    setIsLoading(true);
    if (id) {
      axios
        .get(`${urls.SLUMURL}/trnIssueNoc/getById?id=${id}`, {
          headers: headers,
        })
        .then((r) => {
          setIsLoading(false);
          let result = r.data;
          setDataSource(result);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  useEffect(() => {
    let res = dataSource;
    setValue(
      "cityKey",
      language === "en"
        ? cityDropDown &&
            cityDropDown.find((obj) => obj.id == res?.cityKey)?.cityEn
        : cityDropDown &&
            cityDropDown.find((obj) => obj.id == res?.cityKey)?.cityMr
    );
    getHutData();
    setValue("pincode", res?.pincode ? res?.pincode : "-");
    setValue("lattitude", res?.lattitude ? res?.lattitude : "-");
    setValue("longitude", res?.longitude ? res?.longitude : "-");
    setValue("outstandingTax", res?.outstandingTax ? res?.outstandingTax : "-");
    setValue("applicantTitle", res?.applicantTitle ? res?.applicantTitle : "-");
    setValue(
      "applicantFirstName",
      res?.applicantFirstName ? res?.applicantFirstName : "-"
    );
    setValue(
      "applicantMiddleName",
      res?.applicantMiddleName ? res?.applicantMiddleName : "-"
    );
    setValue(
      "applicantLastName",
      res?.applicantLastName ? res?.applicantLastName : "-"
    );
    setValue(
      "applicantMobileNo",
      res?.applicantMobileNo ? res?.applicantMobileNo : "-"
    );
    setValue(
      "applicantEmailId",
      res?.applicantEmailId ? res?.applicantEmailId : "-"
    );
    setValue(
      "applicantAadharNo",
      res?.applicantAadharNo ? res?.applicantAadharNo : "-"
    );
    setValue("noOfCopies", res?.noOfCopies ? res?.noOfCopies : "-");
    setValue(
      "clerkApprovalRemark",
      res?.clerkApprovalRemark ? res?.clerkApprovalRemark : "-"
    );
    setValue(
      "headClerkApprovalRemark",
      res?.headClerkApprovalRemark ? res?.headClerkApprovalRemark : "-"
    );
    setValue(
      "officeSuperintendantApprovalRemark",
      res?.officeSuperintendantApprovalRemark
        ? res?.officeSuperintendantApprovalRemark
        : "-"
    );
    setValue(
      "administrativeOfficerApprovalRemark",
      res?.administrativeOfficerApprovalRemark
        ? res?.administrativeOfficerApprovalRemark
        : "-"
    );
    setValue(
      "assistantCommissionerApprovalRemark",
      res?.assistantCommissionerApprovalRemark
        ? res?.assistantCommissionerApprovalRemark
        : "-"
    );

    setPhoto(res?.applicantPhoto);
    let siteVisitObj =
      dataSource?.trnVisitScheduleList && dataSource.trnVisitScheduleList[0];

    if (siteVisitObj) {
      const showFileNameOrDefault = (fileName) =>
        fileName ? showFileName(fileName) : "Default File Name";

      const finalFiles = Array.from({ length: 5 }, (_, index) => {
        const siteImage = siteVisitObj[`siteImage${index + 1}`];
        if (siteImage) {
          return {
            srNo: index + 1,
            fileName: showFileNameOrDefault(siteImage),
            filePath: siteImage,
          };
        }
        return null;
      }).filter((fileObj) => fileObj !== null);

      setFinalFiles(finalFiles);
    }
    setValue("siteVisitRemark", siteVisitObj?.remarks);
    let villageData1 =villageData &&
          villageData.find((obj) => obj.id == res?.villageKey)?.villageNameMr;

    setVillageName(villageData1);

    const slumName1 = slumData &&
          slumData.find((obj) => obj.id == res?.slumKey)?.slumNameMr;
    setSlumName(slumName1);
  }, [dataSource, language]);

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");

    return fileNamee?.length > 0 && fileNamee[1];
  }

  const getHutData = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${dataSource?.hutKey}`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data;
        // let res = result && result.find((obj) => obj.id == dataSource?.hutKey);
        let res1 = result?.mstHutMembersList.find(
          (obj) => obj.headOfFamily === "Y"
        );
        setHutOwnerData(res1);
        setHutData(result);
        setValue("hutNo", result ? result?.hutNo : "-");
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getOwnerShipData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbOwnershipType/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSbOwnershipTypeList;
        let res =
          result && result.find((obj) => obj.id == hutData?.ownershipKey);

        setOwnership(res?.ownershipTypeMr);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  // get village details
  const getVillageData = () => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
        setVillageData(result);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  // get slum details
  const getSlumData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSlumList;
        setSlumData(result);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getUsageType = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbUsageType/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSbUsageTypeList;
        let res =
          result && result.find((obj) => obj.id == hutData?.usageTypeKey);

        setUsageType(res?.usageTypeMr);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });


  return (
    <>
      <ThemeProvider theme={theme}>
        {isLoading && <CommonLoader />}
        <>
          <form>
            <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>
              <Grid
                item
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  endIcon={<ExitToApp />}
                  onClick={() => {
                    if(loggedInUser==='citizenUser'){
                      router.push("/dashboard");
                    }else if(loggedInUser==='cfcUser'){
                      router.push("/CFC_Dashboard");
                    }else {
                      router.push(
                        `/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails`
                      );
                    }
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
              <Grid
                item
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  color="success"
                  size="small"
                  variant="contained"
                  onClick={() => {
                    dataSource && handleGenerateButton1();
                  }}
                  endIcon={<Save />}
                >
                  <FormattedLabel id="downloadNoc" />
                </Button>
              </Grid>
            </Grid>

            <Paper style={{ display: "none" }}>
              {dataSource && (
                <Noc
                  connectionData={hutData}
                  ownership={hutOwnerData}
                  usageType={usageType}
                  slumName={slumName}
                  villageName={villageName}
                  componentRef={componentRef1}
                />
              )}
            </Paper>
          </form>
        </>
      </ThemeProvider>
    </>
  );
};

export default Index;
