/* eslint-disable react/jsx-key */
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  ThemeProvider,
  Select,
  TextField,
} from "@mui/material";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import UploadButton from "../../singleFileUploadButton/UploadButton";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader/index";
import divyangData from "../divyang.json";
import { sortByProperty } from "../../../../components/bsupNagarVasthi/bsupCommonFunctions";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BachatGatCategorySchemes = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const router = useRouter();
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [religionNames, setReligionNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [castNames, setCastNames] = useState([]);
  const [dependency, setDependency] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [docUpload, setDocUpload] = useState([]);
  const [docUpload1, setDocUpload1] = useState([]);
  const [eligibilityCriteriaDetails, setEligiblityCriteriaDetails] = useState(
    []
  );
  const [eligiblityDocuments, setEligiblityDocuments] = useState([]);
  const [newSchemeDetails, setNewSchemeDetails] = useState([]);
  const [statusVal, setStatusVal] = useState(null);
  const [eligiblityData, setEligiblityCriteriaData] = useState([]);
  const [genderDetails, setGenderDetails] = useState([]);
  //get logged in user
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state.labels.language);
  const headers =
    loggedUser === "citizenUser"
      ? { Userid: user?.id }
      : { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
    getGenders();
    getReligionDetails();
    getBankMasters();
    getAllCastCategories();
    getMainScheme();
  }, []);

  useEffect(() => {
    getBachatGatCategoryNewScheme();
  }, [router.query.id]);

  // cast from religion
  const getAllCastCategories = () => {
    axios.get(`${urls.BSUPURL}/castCategory/getAll`).then((r) => {
      let data = r.data.castCategory.map((row) => ({
        id: row.id,
        cast: row.castCategory,
        castMr: row.castCategoryMr,
      }));
      setCastNames(
        language === "en"
          ? data.sort(sortByProperty("castCategory"))
          : data.sort(sortByProperty("castCategoryMr"))
      );
    });
  };

  //load religion details
  const getReligionDetails = () => {
    axios.get(`${urls.CFCURL}/master/religion/getAll`).then((r) => {
      setReligionNames(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
          religionMr: row.religionMr,
        }))
      );
    });
  };

  //  load genders
  const getGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setGenderDetails(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
          genderMr: row.genderMr,
        }))
      );
    });
  };

  // load zone
  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
          zonePrefix: row.zonePrefix,
        }))
      );
    });
  };

  // load wards
  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }))
      );
    });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios.get(`${urls.CfcURLMaster}/area/getAll`).then((r) => {
      setCRAreaName(
        r.data.area.map((row) => ({
          id: row.id,
          crAreaName: row.areaName,
          crAreaNameMr: row.areaNameMr,
        }))
      );
    });
  };

  // load main scheme
  const getMainScheme = () => {
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setMainNames(
          r.data.mstMainSchemesList.map((row) => ({
            id: row.id,
            schemeName: row.schemeName,
            schemeNameMr: row.schemeNameMr,
            schemePrefix: row.schemePrefix,
          }))
        );
      });
  };

  // load main scheme
  const getSubScheme = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.BSUPURL
        }/mstSubSchemes/getAllByMainSchemeKey?mainSchemeKey=${watch(
          "mainSchemeKey"
        )}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        if (r.data.mstSubSchemesList != []) {
          setSubSchemeNames(
            r.data.mstSubSchemesList.map((row) => ({
              id: row.id,
              subSchemeName: row.subSchemeName,
              subSchemeNameMr: row.subSchemeNameMr,
              benefitAmount: row.benefitAmount,
            }))
          );
        } else {
          setValue("subSchemeKey", "");
          setSubSchemeNames([]);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        catchMethod(err);
      });
  };

  useEffect(() => {
    if (watch("mainSchemeKey")) {
      getSubScheme();
    }
  }, [watch("mainSchemeKey")]);

  // eligiblity criteria
  const getDependency = () => {
    if (watch("mainSchemeKey") && watch("subSchemeKey")) {
      setIsLoading(true);
      axios
        .get(
          `${
            urls.BSUPURL
          }/mstSchemesConfigData/getAllBySchemeConfigAndSubSchemeKey?schemeConfigKey=${watch(
            "mainSchemeKey"
          )}&subSchemeKey=${watch("subSchemeKey")}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setIsLoading(false);
          if (r?.data?.mstSchemesConfigDataList != []) {
            setDependency(
              r?.data?.mstSchemesConfigDataList?.map((row) => ({
                id: row.id,
                informationType: row.informationType,
                informationTitle: row.informationTitle,
                informationTitleMr: row.informationTitleMr,
                schemesConfigKey: row.schemesConfigKey,
                subSchemeKey: row.subSchemeKey,
                infoSelectionData: row.infoSelectionData,
              }))
            );
            setDocUpload(
              r?.data?.mstSchemesConfigDataList
                ?.filter((obj) => obj.informationType === "fl")
                .map((row) => ({
                  id: row.id,
                  informationType: row.informationType,
                  informationTitle: row.informationTitle,
                  informationTitleMr: row.informationTitleMr,
                  schemesConfigKey: row.schemesConfigKey,
                  subSchemeKey: row.subSchemeKey,
                  documentPath:
                    eligiblityDocuments &&
                    eligiblityDocuments.find(
                      (obj) => obj.schemesConfigDocumentsKey == row.id
                    )?.documentPath,
                  uniqueId:
                    eligiblityDocuments &&
                    eligiblityDocuments.find(
                      (obj) => obj.schemesConfigDocumentsKey == row.id
                    )?.id,
                }))
            );
          } else {
            setValue("subSchemeKey", "");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          catchMethod(err);
        });
    }
  };
  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    }
  };

  useEffect(() => {
    getDependency();
  }, [watch("mainSchemeKey") && watch("subSchemeKey") && eligiblityDocuments]);

  // get bank details
  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(r.data.bank);
    });
  };

  useEffect(() => {
    setBachatGatCategoryNewSchemes();
  }, [newSchemeDetails]);

  // get bachatgat category new scheme
  const getBachatGatCategoryNewScheme = () => {
    if (router.query.id) {
      setIsLoading(true);
      axios
        .get(
          `${urls.BSUPURL}/trnSchemeApplicationNew/getById?id=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setIsLoading(false);
          setNewSchemeDetails(r.data);
        })
        .catch((err) => {
          setIsLoading(false);
          catchMethod(err);
        });
    }
  };

  // set bachatgat category on UI
  const setBachatGatCategoryNewSchemes = () => {
    let _res = newSchemeDetails;
    setEligiblityDocuments(_res.trnSchemeApplicationDocumentsList);
    setValue("benefitAmount", _res.benefitAmount);
    setValue("applicantFirstName", _res.applicantFirstName);
    setValue("applicantMiddleName", _res.applicantMiddleName);
    setValue("applicantLastName", _res.applicantLastName);
    setValue("buildingName", _res.buildingName);
    setValue("roadName", _res.roadName);
    setValue("applicantAadharNo", _res.applicantAadharNo);
    setValue("emailId", _res.emailId);
    setValue("mobileNo", _res.mobileNo);
    setValue("benecode", _res.beneficiaryCode);
    setValue("zoneKey", _res.zoneKey);
    setValue("wardKey", _res.wardKey);
    setValue("branchName", _res.branchName);
    setValue("areaKey", _res.areaKey);
    setValue("landmark", _res?.landmark ? _res?.landmark : "-");
    setValue("flatBuldingNo", _res?.flatBuldingNo ? _res?.flatBuldingNo : "-");
    setValue("geoCode", _res?.geoCode ? _res?.geoCode : "-");
    setValue(
      "savingAccountNo",
      _res?.savingAccountNo ? _res?.savingAccountNo : "-"
    );
    setValue(
      "saOwnerFirstName",
      _res?.saOwnerFirstName ? _res?.saOwnerFirstName : "-"
    );
    setValue(
      "saOwnerMiddleName",
      _res?.saOwnerMiddleName ? _res?.saOwnerMiddleName : "-"
    );
    setValue(
      "saOwnerLastName",
      _res?.saOwnerLastName ? _res?.saOwnerLastName : "-"
    );
    setValue("dateOfBirth", moment(_res?.dateOfBirth).format("DD/MM/YYYY"));
    setValue("remarks", _res?.remarks ? _res?.remarks : null);
    setValue("bankNameId", _res.bankBranchKey);
    setValue("ifscCode", _res.ifscCode);
    setValue("micrCode", _res.micrCode);
    setValue(
      "disabilityPercentage",
      _res?.disabilityPercentage ? _res?.disabilityPercentage : "-"
    );
    setValue(
      "disabilityDuration",
      _res?.disabilityDuration ? _res?.disabilityDuration : "-"
    );
    setValue(
      "disabilityCertificateNo",
      _res?.disabilityCertificateNo ? _res?.disabilityCertificateNo : "-"
    );

    setValue("mainSchemeKey", _res.mainSchemeKey);
    setValue("subSchemeKey", _res.subSchemeKey);
    setEligiblityCriteriaDetails(_res.trnSchemeApplicationDataDaoList);
    setValue("fromDate", _res?.fromDate ? _res?.fromDate : null);
    setValue("bankBranchKey", _res.bankBranchKey);
    setValue("toDate", _res?.toDate ? _res?.toDate : null);
    setValue(
      "schemeRenewalDate",
      _res?.schemeRenewalDate ? _res?.schemeRenewalDate : null
    );
    setValue("gender", _res?.gender);
    setValue("age", _res?.age ? _res?.age : 0);
    setValue(
      "disabilityCertificateValidity",
      _res?.disabilityCertificateValidity
        ? _res?.disabilityCertificateValidity
        : null
    );
    setValue("paymentDate", _res.paymentDate);
    setValue("chequeNo", _res.transactionNo);
    setValue("amount", _res.amountPaid);
    setValue("religionKey", _res?.religionKey ? _res?.religionKey : null);
    setValue("casteCategory", _res?.casteCategory);
    setStatusVal(_res.status);
    setValue("divyangSchemeTypeKey", _res.divyangSchemeTypeKey);
    setValue("saSanghatakRemark", _res.saSanghatakRemark);
    setValue("deptClerkRemark", _res.deptClerkRemark);
    setValue("deptyCommissionerRemark", _res.deptyCommissionerRemark);
    setValue("asstCommissionerRemark", _res.asstCommissionerRemark);
    setDocUpload1([
      {
        id: 1,
        title: language === "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentPath: _res.passbookFrontPage,
      },
      {
        id: 2,
        title: language === "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentPath: _res.passbookLastPage,
      },
    ]);
  };

  const checkAdhar = (value) => {
    if (value != undefined && value) {
      setIsLoading(true);
      const tempData = axios
        .get(
          `${urls.BSUPURL}/trnBachatgatRegistrationMembers/isMemberAlreadyExist?aadharNo=${value}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
          if (res.data.message == "Member Exist in our system..") {
            sweetAlert(
              language === "en"
                ? "Member exist in our system"
                : "आमच्या सिस्टममध्ये सदस्य अस्तित्वात आहेत",
              {
                button: language === "en" ? "Ok" : "ठीक आहे",
                allowOutsideClick: false, // Prevent closing on outside click
                allowEscapeKey: false, // Prevent closing on Esc key
                closeOnClickOutside: false,
              }
            );
          } else {
          }
        })
        .catch((err) => {
          setIsLoading(false);
          catchMethod(err);
        });
    }
  };

  // eligiblity criteria details show on table
  useEffect(() => {
    const eData = [];
    for (var i = 0; i < dependency.length; i++) {
      if (
        dependency[i].informationTitle != "fl" &&
        eligibilityCriteriaDetails.length != 0
      ) {
        for (var j = 0; j < eligibilityCriteriaDetails.length; j++) {
          if (
            eligibilityCriteriaDetails[j].schemesConfigDataKey ===
            dependency[i].id
          ) {
            eData.push({
              srNo: j + 1,
              activeFlag: "Y",
              id: eligibilityCriteriaDetails[j].id,
              informationTitle: dependency[i].informationTitle,
              informationType: dependency[i].informationType,
              infoSelectionData: dependency[i].infoSelectionData,
              schemeApplicationKey:
                eligibilityCriteriaDetails[j].schemeApplicationKey,
              schemesConfigDataKey:
                eligibilityCriteriaDetails[j].schemesConfigDataKey,
              informationDetails:
                eligibilityCriteriaDetails[j].informationDetails,
              subSchemeKey: eligibilityCriteriaDetails[j].subSchemeKey,
              trnType: eligibilityCriteriaDetails[j].trnType,
            });
          }
        }
      } else if (dependency[i].informationTitle != "fl") {
        eData.push({
          srNo: j + 1,
          activeFlag: "Y",
          id: null,
          informationTitle: dependency[i].informationTitle,
          informationType: dependency[i].informationType,
          infoSelectionData: dependency[i].infoSelectionData,
          schemeApplicationKey: null,
          schemesConfigDataKey: null,
          informationDetails: null,
          subSchemeKey: null,
          trnType: "SCAPRN",
        });
      }
    }
    setEligiblityCriteriaData([...eData]);
  }, [dependency, eligibilityCriteriaDetails]);

  useEffect(() => {
    eligiblityData &&
      eligiblityData
        .filter((temp) => temp.informationType === "ft")
        .map((obj, index) => {
          console.log("iiii ", index);
          // if (obj.informationType == "ft") {
          setValue(`Answer.${0}`, obj.informationDetails);
          // }
        });
  }, [eligiblityData]);

  // apply new shceme button
  const onSubmitForm = (formData) => {
    setIsLoading(true);
    const data =
      docUpload &&
      docUpload.map((obj) => {
        return {
          schemeApplicationKey: Number(router.query.id),
          trnType: "SCAPRN",
          activeFlag: "Y",
          schemeApplicationNo: "",
          schemesConfigDocumentsKey: obj.id,
          documentFlow: "",
          documentPath: obj.documentPath,
          fileType: obj.documentPath && obj.documentPath.split(".").pop(),
        };
      });

    let dummyDao =
      eligiblityData &&
      eligiblityData
        .filter((ftMap) => ftMap.informationType === "ft")
        .map((obj, index, arr) => {
          return {
            schemeApplicationKey: obj.schemeApplicationKey,
            schemeRenewalKey: 0,
            trnType: "SCAP",
            activeFlag: "Y",
            subSchemeKey: obj.subSchemeKey,
            schemesConfigDataKey: obj.schemesConfigDataKey,
            informationType: obj.informationType,
            informationDetails: formData.Answer[index],
          };
        });

    let dropdownDao =
      eligiblityData &&
      eligiblityData
        .filter((ftMap) => ftMap.informationType === "dd")
        .map((obj, index, arr) => {
          return {
            schemeApplicationKey: obj.schemeApplicationKey,
            schemeRenewalKey: 0,
            trnType: "SCAP",
            activeFlag: "Y",
            subSchemeKey: obj.subSchemeKey,
            schemesConfigDataKey: obj.schemesConfigDataKey,
            informationType: obj.informationType,
            informationDetails: formData.answerName[index],
          };
        });

    let eligiblityDataDao = [...dummyDao, ...dropdownDao];
    const dataDao = eligiblityDataDao.filter((element) => {
      return element !== null;
    });
    const temp = [
      {
        ...newSchemeDetails,
        status: statusVal,
        trnSchemeApplicationDataDaoList: dataDao,
        trnSchemeApplicationDocumentsList: data,
        beneficiaryCode: formData.benecode,
        passbookFrontPage:
          docUpload1 && docUpload1.find((obj) => obj.id == 1)?.documentPath,

        passbookLastPage:
          docUpload1 && docUpload1.find((obj) => obj.id == 2)?.documentPath,

        frontPageFileType:
          docUpload1 &&
          docUpload1
            .find((obj) => obj.id == 1)
            ?.documentPath.split(".")
            .pop(),
        lastPageFileType:
          docUpload1 &&
          docUpload1
            .find((obj) => obj.id == 2)
            ?.documentPath.split(".")
            .pop(),
        isBenifitedPreviously: false,
        isComplete: false,
        isDraft: false,
        isApproved: false,
        isDraft: false,
        age: Number(formData.age),
        applicationRenewalKey: Number(router.query.id),
        id: null,
        saSanghatakRemark: null,
        deptClerkRemark: null,
        asstCommissionerRemark: null,
        deptyCommissionerRemark: null,
        saSanghatakDate: null,
        saSanghatakUserId: null,
        deptClerkDate: null,
        deptClerkUserId: null,
        asstCommissionerDate: null,
        asstCommissionerUserId: null,
        deptyCommissionerDate: null,
        deptyCommissionerUserId: null,
        remarks: watch("remarks"),
        transactionNo: null,
        amountPaid: null,
        paymentDate: null,
      },
    ];
    const tempData = axios
      .post(`${urls.BSUPURL}/trnSchemeApplicationRenewal/save`, temp, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            text:
              language === "en"
                ? ` Your application is sent successfully. Your application no. is : ${
                    res.data.message.split("[")[1].split("]")[0]
                  } `
                : `तुमचा अर्ज यशस्वीरीत्या पाठवला आहे. तुमचा अर्ज क्र. आहे: ${
                    res.data.message.split("[")[1].split("]")[0]
                  }
              `,
            icon: "success",
            buttons: [
              language === "en" ? "View Acknowledgement" : "पावती पहा",
              language === "en" ? "Go To Dashboard" : "डॅशबोर्डवर जा",
            ],
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              {
                router.push("/dashboard");
              }
            } else {
              router.push({
                pathname: "/BsupNagarvasthi/transaction/acknowledgement",
                query: {
                  id: res.data.message.split("[")[1].split("]")[0],
                  trn: "NR",
                },
              });
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        catchMethod(err);
      });
  };

  // UI
  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
          "@media (max-width: 770px)": {
            marginTop: "2rem",
          },
        }}
      >
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="titleSchemeApplicationRenewal" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <FormControl
                error={errors.areaKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="areaName" />
                </InputLabel>
                <Controller
                  {...register("areaKey")}
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      {crAreaNames &&
                        crAreaNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.crAreaName
                              : auditorium.crAreaNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="areaKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.areaKey ? errors.areaKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Zone Name */}
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <FormControl
                error={errors.zoneKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zoneName" />
                </InputLabel>
                <Controller
                  {...register("zoneKey")}
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      {zoneNames &&
                        zoneNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.zoneName
                              : auditorium.zoneNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="zoneKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.zoneKey ? errors.zoneKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Ward name */}
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <FormControl
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.wardKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="wardname" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Service"
                      watch
                    >
                      {wardNames &&
                        wardNames.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {language === "en"
                              ? service.wardName
                              : service.wardNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="wardKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wardKey ? errors.wardKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <FormControl
                error={errors.mainSchemeKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="mainScheme" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {mainNames &&
                        mainNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.schemeName
                              : auditorium.schemeNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="mainSchemeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.mainSchemeKey ? errors.mainSchemeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Sub Scheme Key */}
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <FormControl
                error={errors.subSchemeKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="subScheme" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {subSchemeNames &&
                        subSchemeNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.subSchemeName
                              : auditorium.subSchemeNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="subSchemeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.subSchemeKey ? errors.subSchemeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Beneficiary Code */}
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="beneficiaryCode" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("benecode")}
                error={!!errors.benecode}
                helperText={errors?.benecode ? errors.benecode.message : null}
              />
            </Grid>

            {/* Benefit Amount */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="benefitAmount" />}
                variant="standard"
                {...register("benefitAmount")}
                InputLabelProps={{
                  shrink: watch("benefitAmount") ? true : false,
                }}
                error={!!errors.benefitAmount}
                helperText={
                  errors?.benefitAmount ? errors.benefitAmount.message : null
                }
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      marginRight: "2rem",
                    }}
                  >
                    <FormattedLabel id="applicantDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* First Name*/}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="applicantFirstName" />}
                variant="standard"
                InputLabelProps={{
                  shrink: watch("applicantFirstName") ? true : false,
                }}
                {...register("applicantFirstName")}
                error={!!errors.applicantFirstName}
                helperText={
                  errors?.applicantFirstName
                    ? errors.applicantFirstName.message
                    : null
                }
              />
            </Grid>
            {/* Middle Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{
                  shrink: watch("applicantMiddleName") ? true : false,
                }}
                label={<FormattedLabel id="applicantMiddleName" />}
                variant="standard"
                {...register("applicantMiddleName")}
                error={!!errors.applicantMiddleName}
                helperText={
                  errors?.applicantMiddleName
                    ? errors.applicantMiddleName.message
                    : null
                }
              />
            </Grid>
            {/* Last Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{
                  shrink: watch("applicantLastName") ? true : false,
                }}
                label={<FormattedLabel id="applicantLastName" />}
                variant="standard"
                {...register("applicantLastName")}
                error={!!errors.applicantLastName}
                helperText={
                  errors?.applicantLastName
                    ? errors.applicantLastName.message
                    : null
                }
              />
            </Grid>
            {/* Gender */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                error={!!errors.gender}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="gender" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {genderDetails &&
                        genderDetails.map((value, index) => (
                          <MenuItem key={index} value={value?.id}>
                            {language === "en"
                              ? value?.gender
                              : value?.genderMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="gender"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gender ? errors.gender.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* Flat/Building No */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="flatBuildNo" />}
                variant="standard"
                disabled={true}
                {...register("flatBuldingNo")}
                error={!!errors.flatBuldingNo}
                helperText={
                  errors?.flatBuldingNo ? errors.flatBuldingNo.message : null
                }
              />
            </Grid>
            {/* Building Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="buildingNm" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: watch("buildingName") ? true : false,
                }}
                {...register("buildingName")}
                error={!!errors.buildingName}
                helperText={
                  errors?.buildingName ? errors.buildingName.message : null
                }
              />
            </Grid>
            {/* Road Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="roadName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: watch("roadName") ? true : false,
                }}
                {...register("roadName")}
                error={!!errors.roadName}
                helperText={errors?.roadName ? errors.roadName.message : null}
              />
            </Grid>
            {/* LandMark */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="landmark" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: watch("landmark") ? true : false,
                }}
                {...register("landmark")}
                error={!!errors.landmark}
                helperText={errors?.landmark ? errors.landmark.message : null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* GIS Id/Geo Code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="gisgioCode" />}
                variant="standard"
                InputLabelProps={{
                  shrink: watch("geoCode") ? true : false,
                }}
                {...register("geoCode")}
              />
            </Grid>
            {/* Applicant Adhaar No*/}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                id="standard-basic"
                inputProps={{ minLength: 12, maxLength: 12 }}
                label={<FormattedLabel id="applicantAdharNo" />}
                variant="standard"
                disabled={true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                onMouseLeave={(e) => {
                  checkAdhar(e.target.value);
                }}
                InputLabelProps={{
                  shrink: watch("applicantAadharNo") ? true : false,
                }}
                {...register("applicantAadharNo")}
                error={!!errors.applicantAadharNo}
                helperText={
                  errors?.applicantAadharNo
                    ? errors.applicantAadharNo.message
                    : null
                }
              />
            </Grid>
            {/* Data of Birth */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.dateOfBirth}
              >
                <Controller
                  control={control}
                  name="dateOfBirth"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        variant="standard"
                        disabled={true}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="dateOfBirth" />
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format("YYYY-MM-DD"))
                        }
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            {...params}
                            size="small"
                            variant="standard"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/*  Age */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="age" />}
                disabled={true}
                type="number"
                variant="standard"
                InputLabelProps={{
                  shrink: watch("age") ? true : false,
                }}
                {...register("age")}
                error={!!errors.age}
                helperText={errors?.age ? errors.age.message : null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/*  Mobile*/}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{
                  shrink: watch("mobileNo") ? true : false,
                }}
                label={<FormattedLabel id="mobile" />}
                variant="standard"
                {...register("mobileNo")}
                error={!!errors.mobileNo}
                helperText={errors?.mobileNo ? errors.mobileNo.message : null}
              />
            </Grid>
            {/*  Email Address */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{
                  shrink: watch("emailId") ? true : false,
                }}
                label={<FormattedLabel id="email" />}
                variant="standard"
                {...register("emailId")}
                error={!!errors.emailId}
                helperText={errors?.emailId ? errors.emailId.message : null}
              />
            </Grid>
            {/* Religion */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                error={errors.religionKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="religion" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      {...field}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      label="Select Auditorium"
                    >
                      {religionNames &&
                        religionNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.religion
                              : auditorium.religionMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="religionKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.religionKey ? errors.religionKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Caste Category */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                error={errors.casteCategory}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="castCategory" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {castNames.length > 0 &&
                        castNames.map((auditorium, index) => {
                          return (
                            <MenuItem key={index} value={auditorium.id}>
                              {language === "en"
                                ? auditorium.cast
                                : auditorium.castMr}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="casteCategory"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.casteCategory ? errors.casteCategory.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Divyang Scheme Type */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                error={errors.divyangSchemeTypeKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="divyangSchemeType" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {divyangData &&
                        divyangData.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {auditorium.divyangName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="divyangSchemeTypeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.divyangSchemeTypeKey
                    ? errors.divyangSchemeTypeKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/*  Disability Percentage */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="disabilityPercent" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("disabilityPercentage")}
                error={!!errors.disabilityPercentage}
                helperText={
                  errors?.disabilityPercentage
                    ? errors.disabilityPercentage.message
                    : null
                }
                InputProps={{
                  endAdornment: "%",
                }}
              />
            </Grid>

            {/* Disability Certificate Expiry Date */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.disabilityCertificateValidity}
              >
                <Controller
                  control={control}
                  name="disabilityCertificateValidity"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        variant="standard"
                        disabled={true}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="disabilityCertExpDate" />
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format("YYYY-MM-DD"))
                        }
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            {...params}
                            size="small"
                            variant="standard"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.disabilityCertificateValidity
                    ? errors.disabilityCertificateValidity.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          {/* Main gap  Eligibility Criteria*/}
          <Grid container spacing={2} sx={{ padding: "1rem" }}></Grid>
          {dependency.length != 0 && (
            <Grid item xs={12}>
              <Box>
                <Grid container className={commonStyles.title}>
                  <Grid item xs={12}>
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="eligibilityCriteria" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}

          {eligiblityData &&
            eligiblityData
              .filter((obj) => obj.informationType === "ft")
              .map((obj, index) => {
                return (
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      {" "}
                      <strong>{obj?.informationTitle}</strong>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="ans" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch(`Answer.${index}`) ? true : false,
                        }}
                        {...register(`Answer.${index}`)}
                      />
                    </Grid>
                  </Grid>
                );
              })}
          {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {eligiblityData &&
            eligiblityData
              .filter((obj) => obj.informationType === "dd")
              .map((obj, index) => {
                return (
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{obj?.informationTitle}</strong>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.answerName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Select
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // fullWidth
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              variant="standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Select"
                            >
                              {obj &&
                                obj?.infoSelectionData
                                  ?.split(",")
                                  .map((department, index) => (
                                    <MenuItem key={index} value={department}>
                                      {department}
                                    </MenuItem>
                                  ))}
                            </Select>
                          )}
                          name={`answerName.${index}`}
                          control={control}
                          defaultValue={obj?.informationDetails}
                        />
                        <FormHelperText>
                          {errors?.answerName
                            ? errors.answerName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                );
              })}
          <Grid item xs={12}>
            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      marginRight: "2rem",
                    }}
                  >
                    <FormattedLabel id="bankDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* Bank Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.bankBranchKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="bankName" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      disabled={true}
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {bankMaster &&
                        bankMaster.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {language === "en"
                              ? service.bankName
                              : service.bankNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="bankBranchKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bankBranchKey ? errors.bankBranchKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Branch Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="branchName" />}
                variant="standard"
                InputLabelProps={{
                  shrink: watch("branchName") ? true : false,
                }}
                {...register("branchName")}
                error={!!errors.branchName}
                helperText={
                  errors?.branchName ? errors.branchName.message : null
                }
              />
            </Grid>
            {/* Saving Account No */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="savingAcNo" />}
                variant="standard"
                InputLabelProps={{
                  shrink: watch("savingAccountNo") ? true : false,
                }}
                {...register("savingAccountNo")}
                error={!!errors.savingAccountNo}
                helperText={
                  errors?.savingAccountNo
                    ? errors.savingAccountNo.message
                    : null
                }
              />
            </Grid>
            {/* Bank IFSC Code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{
                  shrink: watch("ifscCode") ? true : false,
                }}
                label={<FormattedLabel id="bankIFSC" />}
                variant="standard"
                {...register("ifscCode")}
                error={!!errors.ifscCode}
                helperText={errors?.ifscCode ? errors.ifscCode.message : null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* Bank Micr Code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="bankMICR" />}
                variant="standard"
                InputLabelProps={{
                  shrink: watch("micrCode") ? true : false,
                }}
                {...register("micrCode")}
              />
            </Grid>
            {/* Saving Acc Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="savinAcFirstNm" />}
                variant="standard"
                {...register("saOwnerFirstName")}
                error={!!errors.saOwnerFirstName}
                helperText={
                  errors?.saOwnerFirstName
                    ? errors.saOwnerFirstName.message
                    : null
                }
              />
            </Grid>
            {/* Saving Acc NO Middle Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="savingAcMiddleNm" />}
                variant="standard"
                {...register("saOwnerMiddleName")}
                error={!!errors.saOwnerMiddleName}
                helperText={
                  errors?.saOwnerMiddleName
                    ? errors.saOwnerMiddleName.message
                    : null
                }
              />
            </Grid>
            {/* Saving Account Last Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                x
                label={<FormattedLabel id="savingAcLastNm" />}
                variant="standard"
                {...register("saOwnerLastName")}
                error={!!errors.saOwnerLastName}
                helperText={
                  errors?.saOwnerLastName
                    ? errors.saOwnerLastName.message
                    : null
                }
              />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              container
              spacing={2}
              sx={{
                padding: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
                backgroundColor: "whitesmoke",
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={1}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "baseline",
                }}
              >
                <b> {language == "en" ? "Sr. No." : "अ. क्र."}</b>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={7}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "baseline",
                }}
              >
                <b>{language == "en" ? "Document Name" : "दस्तऐवजाचे नाव"}</b>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                sx={{
                  "@media (min-width: 500px)": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  },
                }}
              >
                <b>
                  {language == "en" ? "Upload Documents" : "दस्तऐवज अपलोड करा"}
                </b>
              </Grid>
            </Grid>

            {docUpload1 &&
              docUpload1.map((obj, index) => {
                return (
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      backgroundColor: "whitesmoke",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={1}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{index + 1}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={7}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{obj?.title}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      sx={{
                        "@media (min-width: 500px)": {
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        },
                      }}
                    >
                      <UploadButton
                        appName="BSUP"
                        serviceName="BSUP-BachatgatRegistration"
                        label={
                          <span>
                            <FormattedLabel id="uploadDocs" />{" "}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        filePath={obj.documentPath}
                        objId={obj.id}
                        uploadDoc={docUpload1}
                        value={docUpload1}
                        setUploadDoc={setDocUpload1}
                        registerFunction={register}
                        error={
                          errors &&
                          errors.uploadDocs &&
                          docUpload1.some((item) => !item.documentPath)
                            ? true
                            : false
                        }
                        helperText={
                          errors &&
                          errors.uploadDocs &&
                          docUpload1.some((item) => !item.documentPath)
                            ? errors.uploadDocs.message
                            : ""
                        }
                        required={true}
                      />
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>

          {docUpload.length != 0 && (
            <Grid item xs={12}>
              <Box>
                <Grid container className={commonStyles.title}>
                  <Grid item xs={12}>
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="eligibilityDoc" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
          {/* ////////////////////////////////////////////////////////// */}
          <Grid container sx={{ padding: "1rem" }}>
            <Grid
              container
              sx={{
                padding: "1rem",
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
                backgroundColor: "whitesmoke",
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={1}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "baseline",
                }}
              >
                <b> {language == "en" ? "Sr. No." : "अ. क्र."}</b>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={7}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "baseline",
                }}
              >
                <b>{language == "en" ? "Document Name" : "दस्तऐवजाचे नाव"}</b>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                sx={{
                  "@media (min-width: 500px)": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  },
                }}
              >
                <b>
                  {language == "en" ? "Upload Documents" : "दस्तऐवज अपलोड करा"}
                </b>
              </Grid>
            </Grid>

            {docUpload &&
              docUpload.map((obj, index) => {
                return (
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      backgroundColor: "whitesmoke",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={1}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{index + 1}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={7}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{obj?.informationTitle}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <UploadButton
                        appName="BSUP"
                        serviceName="BSUP-SchemeApplication"
                        label={<FormattedLabel id="uploadDocs" />}
                        filePath={obj.documentPath}
                        objId={obj.id}
                        uploadDoc={docUpload}
                        setUploadDoc={setDocUpload}
                      />
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      marginRight: "2rem",
                    }}
                  >
                    <FormattedLabel id="renewalSection" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                required
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="renewalRemark" />}
                variant="standard"
                multiline
                {...register("remarks")}
                inputProps={{ maxLength: 1000 }}
                InputLabelProps={{ shrink: true }}
                error={!!errors.remarks}
                helperText={errors?.remarks ? errors.remarks.message : null}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={5}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid item>
              <Button
                sx={{ marginRight: 8 }}
                disabled={
                  watch("remarks") &&
                  (docUpload1.some((item) => item.documentPath === "") ||
                    docUpload.some((item) => item.documentPath === "")) ===
                    false
                    ? eligiblityData && eligiblityData.length != 0
                      ? (watch("answerName") != null &&
                          watch("answerName").includes("")) ||
                        (watch("Answer") != null &&
                          watch("Answer").includes(""))
                        ? true
                        : false
                      : false
                    : true
                }
                type="submit"
                size="small"
                // className={commonStyles.buttonSave}
                variant="contained"
                color="success"
                endIcon={<SaveIcon />}
              >
                {<FormattedLabel id="save" />}
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="small"
                sx={{ marginRight: 8 }}
                variant="contained"
                color="error"
                // className={commonStyles.buttonExit}
                endIcon={<ClearIcon />}
                onClick={() => {
                  router.push(
                    "/BsupNagarvasthi/transaction/schemeApplicationRenewal"
                  );
                }}
              >
                {<FormattedLabel id="exit" />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategorySchemes;
