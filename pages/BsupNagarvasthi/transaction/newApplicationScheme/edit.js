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
import { DataGrid } from "@mui/x-data-grid";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import UploadButton from "../../singleFileUploadButton/UploadButton";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import trnNewApplicationSchema from "../../../../containers/schema/BsupNagarvasthiSchema/trnNewApplicationSchema.js";
import divyangData from "../divyang.json";
import Loader from "../../../../containers/Layout/components/Loader";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import { sortByProperty } from "../../../../components/bsupNagarVasthi/bsupCommonFunctions";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

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
    resolver: yupResolver(trnNewApplicationSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [religionNames, setReligionNames] = useState([]);
  const [castNames, setCastNames] = useState([]);
  const [dependency, setDependency] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [textFArea, setTextFArea] = useState([]);
  const [docUpload, setDocUpload] = useState([]);
  const [docUpload1, setDocUpload1] = useState([]);
  const [forBachatGat, setForBachatgat] = useState(true);
  const [eligibilityCriteriaDetails, setEligiblityCriteriaDetails] = useState(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [eligiblityDocuments, setEligiblityDocuments] = useState([]);
  const [newSchemeDetails, setNewSchemeDetails] = useState([]);
  const [mainSchemeVal, setMainScheme] = useState();
  const [subSchemeVal, setSubScheme] = useState();
  const [statusVal, setStatusVal] = useState(null);
  const [subSchemePrefix, setSubSchemePrefix] = useState();
  const [eligiblityData, setEligiblityCriteriaData] = useState([]);
  const [remarkTableData, setRemarkData] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [dropDown, setDropDown] = useState([]);
  const [genderDetails, setGenderDetails] = useState([]);
  //get logged in user
  const [statusAll, setStatus] = useState([]);
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  const [mainSchemePrefix, setMainPrefix] = useState(null);
  const [zonePref, setZonePrefix] = useState(null);
  const language = useSelector((state) => state.labels.language);

  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

  const headers = { Authorization: `Bearer ${user?.token}` };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const [castOptions, setCastOptions] = useState([]);

  useEffect(() => {
    getZoneName();
    getAllStatus();
    getUser();
    getWardNames();
    getCRAreaName();
    getGenders();
    getReligionDetails();
    getBankMasters();
  }, []);

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      getBachatGatCategoryNewScheme();
  }, [router.query.id]);

  useEffect(() => {
    setZonePrefix(
      zoneNames &&
        zoneNames.find((r) => {
          return r.id == watch("zoneKey");
        })?.zonePrefix
    );
  }, [watch("zoneKey")]);

  useEffect(() => {
    getAllCastCategories();
    getMainScheme();
  }, []);

  const getAllStatus = () => {
    axios
      .get(`${urls.BSUPURL}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
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

  // cast from cast category
  const getCastFromCastCategoory = () => {
    axios
      .get(
        `${urls.BSUPURL}/master/cast/getCastFromCastCategories?id=${watch(
          "casteCategory"
        )}`,
        { headers: headers }
      )
      .then((r) => {
        setCastOptions(
          r.data.mCast.map((row) => ({
            id: row.id,
            cast: row.cast,
            castMr: row.castMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  //get all cast options for mapping
  const getAllCasteOptions = () => {
    axios
      .get(`${urls.BSUPURL}/master/cast/getAll`, { headers: headers })
      .then((r) => {
        setCastOptions(
          r.data.mCast.map((row) => ({
            id: row.id,
            cast: row.cast,
            castMr: row.castMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    getAllCasteOptions();
  }, []);

  useEffect(() => {
    if (watch("casteCategory")) {
      getCastFromCastCategoory();
    }
  }, [watch("casteCategory")]);
  //get all cast categories
  const getAllCastCategories = () => {
    axios
      .get(`${urls.BSUPURL}/castCategory/getAll`, { headers: headers })
      .then((r) => {
        let data = r.data.castCategory.map((row) => ({
          id: row.id,
          castCategory: row.castCategory,
          castCategoryMr: row.castCategoryMr,
        }));
        setCastNames(
          language === "en"
            ? data.sort(sortByProperty("castCategory"))
            : data.sort(sortByProperty("castCategoryMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  //load religion details
  const getReligionDetails = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let data = r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
          religionMr: row.religionMr,
        }));
        setReligionNames(
          language === "en"
            ? data.sort(sortByProperty("religion"))
            : data.sort(sortByProperty("religionMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  //  load genders
  const getGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let data = r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        }));
        setGenderDetails(
          language === "en"
            ? data.sort(sortByProperty("gender"))
            : data.sort(sortByProperty("genderMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let data = r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zonePrefix: row.zonePrefix,
          zoneNameMr: row.zoneNameMr,
        }));
        setZoneNames(
          language === "en"
            ? data.sort(sortByProperty("zoneName"))
            : data.sort(sortByProperty("zoneNameMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load wards
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let data = r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }));
        setWardNames(
          language === "en"
            ? data.sort(sortByProperty("wardName"))
            : data.sort(sortByProperty("wardNameMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios
      .get(`${urls.CfcURLMaster}/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let data = r.data.area.map((row) => ({
          id: row.id,
          crAreaName: row.areaName,
          crAreaNameMr: row.areaNameMr,
        }));
        setCRAreaName(
          language === "en"
            ? data.sort(sortByProperty("crAreaName"))
            : data.sort(sortByProperty("crAreaNameMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load main scheme
  const getMainScheme = () => {
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let data = r.data.mstMainSchemesList.map((row) => ({
          id: row.id,
          schemeName: row.schemeName,
          schemePrefix: row.schemePrefix,
        }));
        setMainNames(
          language === "en"
            ? data.sort(sortByProperty("schemeName"))
            : data.sort(sortByProperty("crAreaNameMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
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
          let data = r.data.mstSubSchemesList.map((row) => ({
            id: row.id,
            subSchemeName: row.subSchemeName,
            subSchemeNameMr: row.subSchemeNameMr,
            benefitAmount: row.benefitAmount,
            forBachatGat: row.forBachatGat,
          }));
          setSubSchemeNames(
            language === "en"
              ? data.sort(sortByProperty("subSchemeName"))
              : data.sort(sortByProperty("subSchemeNameMr"))
          );
        } else {
          setValue("subSchemeKey", "");
          setSubSchemeNames([]);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (watch("mainSchemeKey")) {
      getSubScheme();
    }
  }, [watch("mainSchemeKey")]);


  const setBenifitAmount = () => {
    const selectedSubScheme = subSchemeNames.find(
      (obj) => obj.id === watch("subSchemeKey")
    );
    if (selectedSubScheme) {
      setValue("benefitAmount", selectedSubScheme.benefitAmount);
      setForBachatgat(selectedSubScheme.forBachatGat);
    }
  };
  useEffect(() => {
    setBenifitAmount();
  }, [watch("subSchemeKey")]);



  // when find mainscheme key then set bene code
  useEffect(() => {
    if (watch("mainSchemeKey")) {
      // setValue("benefitAmount", "");
      setMainPrefix(
        mainNames &&
          mainNames.find((r) => {
            return r.id == watch("mainSchemeKey");
          })?.schemePrefix
      );
    }
  }, [watch("mainSchemeKey")]);

  // when find sub scheme key then set bene code
  useEffect(() => {
    if (watch("subSchemeKey")) {
      setSubSchemePrefix(
        subSchemeNames &&
          subSchemeNames.find((r) => {
            return r.id == watch("subSchemeKey");
          })?.id
      );
      // setValue(
      //   "benecode",
      //   zonePref + " " + mainSchemePrefix + " " + watch("subSchemeKey")
      // );
    }
  }, [watch("subSchemeKey"), mainSchemePrefix, zonePref]);

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
                isRequired: row.isMandatory,
                informationType: row.informationType,
                informationTitle: row.informationTitle,
                informationTitleMr: row.informationTitleMr,
                schemesConfigKey: row.schemesConfigKey,
                subSchemeKey: row.subSchemeKey,
                infoSelectionData: row.infoSelectionData,
              }))
            );
            setTextFArea(
              r?.data?.mstSchemesConfigDataList
                ?.filter((obj) => obj.informationType === "ft")
                .map((row) => ({
                  id: row.id,
                  isRequired: row.isMandatory,
                  informationType: row.informationType,
                  informationTitle: row.informationTitle,
                  informationTitleMr: row.informationTitleMr,
                  schemesConfigKey: row.schemesConfigKey,
                  subSchemeKey: row.subSchemeKey,
                }))
            );
            setDocUpload(
              r?.data?.mstSchemesConfigDataList
                ?.filter((obj) => obj.informationType === "fl")
                .map((row) => ({
                  id: row.id,
                  isRequired: row.isMandatory,
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
            setDropDown(
              r?.data?.mstSchemesConfigDataList
                ?.filter((obj) => obj.informationType === "dd")
                .map((row) => ({
                  id: row.id,
                  isRequired: row.isMandatory,
                  informationType: row.informationType,
                  informationTitle: row.informationTitle,
                  informationTitleMr: row.informationTitleMr,
                  schemesConfigKey: row.schemesConfigKey,
                  subSchemeKey: row.subSchemeKey,
                  infoSelectionData: row.infoSelectionData,
                }))
            );
          } else {
            setValue("subSchemeKey", "");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  useEffect(() => {
    getDependency();
  }, [watch("mainSchemeKey") && watch("subSchemeKey") && eligiblityDocuments]);

  // get bank details
  const getBankMasters = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let data = r.data.bank;
        setBankMasters(
          language === "en"
            ? data.sort(sortByProperty("bankName"))
            : data.sort(sortByProperty("bankNameMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load user
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setUserLst(res?.data?.user);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (newSchemeDetails != null) {
      setBachatGatCategoryNewSchemes();
    }
  }, [newSchemeDetails, language, statusAll]);

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
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // set bachatgat category on UI
  const setBachatGatCategoryNewSchemes = () => {
    let _res = newSchemeDetails;
    setEligiblityDocuments(_res.trnSchemeApplicationDocumentsList);
    setValue("applicantFirstName", _res.applicantFirstName);
    setValue("benefitAmount", _res.benefitAmount);

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
    // setValue("dateOfBirth", moment(_res?.dateOfBirth).format("DD/MM/YYYY"));
    setValue("dateOfBirth", _res?.dateOfBirth);

    setValue("remarks", _res?.remarks ? _res?.remarks : "-");
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
    setMainScheme(_res.mainSchemeKey);
    setSubScheme(_res.subSchemeKey);
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
    setValue("castOptionKey", _res.castOptionKey);
    setStatusVal(_res.status);
    setValue("divyangSchemeTypeKey", _res.divyangSchemeTypeKey);
    setValue("saSanghatakRemark", _res.saSanghatakRemark);
    setValue("deptClerkRemark", _res.deptClerkRemark);
    setValue("deptyCommissionerRemark", _res.deptyCommissionerRemark);
    setValue("asstCommissionerRemark", _res.asstCommissionerRemark);
    setDocUpload1([
      {
        id: 1,
        title: language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentPath: _res.passbookFrontPage,
      },
      {
        id: 2,
        title: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentPath: _res.passbookLastPage,
      },
    ]);
    setValue("status", manageStatus(_res.status, language, statusAll));
  };

  // eligiblity criteria details show on table
  // useEffect(() => {
  //   const eData = [];
  //   for (var i = 0; i < dependency.length; i++) {
  //     if (
  //       dependency[i].informationTitle != "fl" &&
  //       eligibilityCriteriaDetails.length != 0
  //     ) {
  //       for (var j = 0; j < eligibilityCriteriaDetails.length; j++) {
  //         if (
  //           eligibilityCriteriaDetails[j].schemesConfigDataKey ==
  //           dependency[i].id
  //         ) {
  //           eData.push({
  //             srNo: j + 1,
  //             activeFlag: "Y",
  //             id: eligibilityCriteriaDetails[j].id,
  //             informationTitle: dependency[i].informationTitle,
  //             informationType: dependency[i].informationType,
  //             infoSelectionData: dependency[i].infoSelectionData,
  //             schemeApplicationKey:
  //               eligibilityCriteriaDetails[j].schemeApplicationKey,
  //             schemesConfigDataKey:
  //               eligibilityCriteriaDetails[j].schemesConfigDataKey,
  //             informationDetails:
  //               eligibilityCriteriaDetails[j].informationDetails,
  //             subSchemeKey: eligibilityCriteriaDetails[j].subSchemeKey,
  //             trnType: eligibilityCriteriaDetails[j].trnType,
  //           });
  //         }
  //       }
  //     } else if (dependency[i].informationTitle != "fl") {
  //       eData.push({
  //         srNo: j + 1,
  //         activeFlag: "Y",
  //         id: dependency[i].id,
  //         informationTitle: dependency[i].informationTitle,
  //         informationType: dependency[i].informationType,
  //         infoSelectionData: dependency[i].infoSelectionData,
  //       });
  //     }
  //   }
  //   setEligiblityCriteriaData([...eData]);
  // }, [dependency, eligibilityCriteriaDetails]);

  // eligiblity criteria details show on table
  useEffect(() => {
    const eData = [];
    for (var i = 0; i < dependency.length; i++) {
      if (dependency[i].informationTitle != "fl") {
        for (var j = 0; j < eligibilityCriteriaDetails.length; j++) {
          if (
            eligibilityCriteriaDetails[j].schemesConfigDataKey ==
            dependency[i].id
          ) {
            eData.push({
              srNo: eData.length + 1,
              id: eligibilityCriteriaDetails[j].id,
              infoTitle: dependency[i].informationTitle,
              infoDetails: eligibilityCriteriaDetails[j].informationDetails,
            });
          }
        }
      }
    }

    setEligiblityCriteriaData([...eData]);
  }, [dependency, eligibilityCriteriaDetails]);

  useEffect(() => {
    eligiblityData &&
      eligiblityData.map((obj, index) => {
        if (obj.informationType == "ft") {
          setValue(`Answer.${index}`, obj.informationDetails);
        }
      });
  }, [eligiblityData]);

  // eligiblity document array
  useEffect(() => {
    const res = [];

    for (var i = 0; i < docUpload.length; i++) {
      for (var j = 0; j < eligiblityDocuments.length; j++) {
        if (
          eligiblityDocuments[j].schemesConfigDocumentsKey == docUpload[i].id &&
          eligiblityDocuments[j].documentPath
        ) {
          res.push({
            srNo: j + 1,
            uniqueId: eligiblityDocuments[j].id,
            id: eligiblityDocuments[j].schemesConfigDocumentsKey,
            informationTitle: docUpload[i].informationTitle,
            fileName:
              eligiblityDocuments[j].documentPath &&
              eligiblityDocuments[j].documentPath
                .split("/")
                .pop()
                .split("_")
                .pop(),
            documentPath: eligiblityDocuments[j].documentPath,
          });
        }
        setFetchDocuments(Remove_Duplicate_recs(res));
      }
    }
  }, [docUpload]);

  const Remove_Duplicate_recs = (filteredRecord) => {
    var records = [];
    for (let record of filteredRecord) {
      const duplicate_recorde_exists = records.find(
        (r) => r.informationTitle === record.informationTitle
      );
      if (duplicate_recorde_exists) {
        continue;
      } else {
        records.push(record);
      }
    }
    return records;
  };

  useEffect(() => {
    setDataToTable();
  }, [newSchemeDetails]);

  // set data to table
  const setDataToTable = () => {
    const a = [];
    if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 4; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptClerkRemark
              : i == 2
              ? newSchemeDetails.asstCommissionerRemark
              : newSchemeDetails.deptyCommissionerRemark,
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Department Clerk"
              : i == 2
              ? "Assistant Commissioner"
              : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1110
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptClerkRemark
              : i == 2
              ? newSchemeDetails.asstCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Department Clerk"
              : i == 2
              ? "Assistant Commissioner"
              : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1101
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptClerkRemark
              : i == 2
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Department Clerk"
              : i == 2
              ? "Deputy Commissioner"
              : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1100
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptClerkRemark
              : "",
          designation:
            i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1001
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.saSanghatakRemark
              : i == 1
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Samuh Sanghtak" : i == 1 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1000
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? newSchemeDetails.saSanghatakRemark : "",
          designation: i == 0 ? "Samuh Sanghtak" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //    0111
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.deptClerkRemark
              : i == 1
              ? newSchemeDetails.asstCommissionerRemark
              : i == 2
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Department Clerk"
              : i == 1
              ? "Assistant Commissioner"
              : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //0110
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.deptClerkRemark
              : i == 1
              ? newSchemeDetails.asstCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Department Clerk"
              : i == 1
              ? "Assistant Commissioner"
              : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 0101
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.deptClerkRemark
              : i == 1
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Department Clerk" : i == 1 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0100
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == newSchemeDetails.deptClerkUserId)
                ?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? newSchemeDetails.deptClerkRemark : "",
          designation: i == 0 ? "Department Clerk" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0011
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? newSchemeDetails.asstCommissionerRemark
              : i == 1
              ? newSchemeDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Assistant Commissioner" : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0010
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? newSchemeDetails.asstCommissionerRemark : "",
          designation: i == 0 ? "Assistant Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
      // 0001
    }
    // 0001
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == newSchemeDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? newSchemeDetails.deptyCommissionerRemark : "",
          designation: i == 0 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(newSchemeDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    setRemarkData([...a]);
  };

  // apply new shceme button
  const onSubmitForm = (formData) => {
    const data =
      docUpload &&
      docUpload.map((obj) => {
        return {
          schemeApplicationKey: router.query.id,
          trnType: "SCAP",
          id: obj.uniqueId,
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
            id: obj.id,
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
            id: obj.id,
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
    setIsLoading(true);
    const temp = [
      {
        ...newSchemeDetails,
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
        areaKey: Number(formData.areaKey),
        bankBranchKey: Number(formData.bankBranchKey),
        casteCategory: Number(formData.casteCategory),
        religionKey: Number(formData.religionKey),
        mainSchemeKey: Number(formData.mainSchemeKey),
        subSchemeKey: Number(formData.subSchemeKey),
        wardKey: Number(formData.wardKey),
        zoneKey: Number(formData.zoneKey),
        age: Number(formData.age),
        applicantAadharNo: formData.applicantAadharNo,
        branchName: formData.branchName,
        saOwnerFirstName: formData.saOwnerFirstName,
        saOwnerLastName: formData.saOwnerLastName,
        saOwnerMiddleName: formData.saOwnerMiddleName,
        savingAccountNo: formData.savingAccountNo,
        micrCode: formData.micrCode,
        ifscCode: formData.ifscCode,
        geoCode: formData.geoCode,
        disabilityCertificateValidity: formData.disabilityCertificateValidity,
        status: statusVal,
        castOptionKey:formData.castOptionKey,
        // ////////////////////////////////Accountuser////////////////
        installmentPaid: loggedUser === "accountUser" ? true : false,
        completedInstallment:
          formData.completedInstallment == null
            ? 0
            : formData.completedInstallment,
        installmentAmount:
          formData.completedInstallment == null
            ? 0
            : formData.completedInstallment,
        installmentDate: loggedUser === "accountUser" ? currDate : null,
        paymentType: formData.paymentType == null ? null : formData.paymentType,
        paymentMode: formData.paymentMode == null ? null : formData.paymentMode,
      },
    ];
    const tempData = axios
      .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            text:
              language === "en"
                ? ` Your application is sent successfully. Your application no. is ${
                    res.data.message.split("[")[1].split("]")[0]
                  } `
                : `तुमचा अर्ज यशस्वीरीत्या पाठवला आहे. तुमचा अर्ज क्र. आहे ${
                    res.data.message.split("[")[1].split("]")[0]
                  }`,
            icon: "success",
            buttons: [
              language === "en" ? "View Acknowledgement" : "पावती पहा",
              language === "en" ? "Go To Dashboard" : "डॅशबोर्डवर जा",
            ],
            dangerMode: false,
            closeOnClickOutside: false,
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
          }).then((will) => {
            if (will) {
              {
                // router.push(
                //   "/BsupNagarvasthi/transaction/newApplicationScheme/list"
                // );
                router.push("/dashboard");
              }
            } else {
              router.push({
                pathname:
                  "/BsupNagarvasthi/transaction/newApplicationScheme/view",
                query: { id: res.data.message.split("[")[1].split("]")[0] },
              });
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const eligiblityColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "infoTitle",
      headerName: <FormattedLabel id="infoTitle" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: "infoDetails",
      headerName: <FormattedLabel id="answer" />,
      headerAlign: "center",
      align: "left",
      // width: 200,
      flex: 1,
    },
  ];

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
          // marginLeft: "10px",
          // marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
          "@media (max-width: 500px)": {
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
                <FormattedLabel id="titleNewApplicationSchemes" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <FormControl
                error={errors.areaKey}
                variant="standard"
                // sx={{ width: "90%" }}
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
                      // sx={{ minWidth: "90%" }}
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
                            {auditorium.crAreaName}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <FormControl
                error={errors.zoneKey}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zoneNames" />
                </InputLabel>
                <Controller
                  {...register("zoneKey")}
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      // sx={{ minWidth: "90%" }}
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
                            {auditorium.zoneName}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <FormControl
                variant="standard"
                // sx={{ width: "100%" }}
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
                      // sx={{ minWidth: "90%" }}
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
                            {service.wardName}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              // }}
            >
              <FormControl
                error={errors.mainSchemeKey}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="mainScheme" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      // sx={{ minWidth: "90%" }}
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
                            {auditorium.schemeName}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              // }}
            >
              <FormControl
                error={errors.subSchemeKey}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="subScheme" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      // sx={{ minWidth: "90%" }}
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
                            {auditorium.subSchemeName}
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
                // sx={{ width: "90%" }}
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
              lg={4}
              xl={4}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true} //{loggedUser === "citizenUser" ? true : false}
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

            {/* Bachat Gat No */}
            {forBachatGat && (
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={4}
                xl={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  // disabled={true} //{loggedUser === "citizenUser" ? true : false}
                  label={<FormattedLabel id="bachatgatNo" />}
                  variant="standard"
                  {...register("bachatgatNo")}
                  // value={
                  //   watch("bachatgatNo")
                  // }

                  error={!!errors.bachatgatNo}
                  helperText={
                    errors?.bachatgatNo ? errors.bachatgatNo.message : null
                  }
                />
              </Grid>
            )}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <FormControl
                // sx={{ minWidth: "90%" }}
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
                      disabled={loggedUser === "citizenUser" ? true : false}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {genderDetails &&
                        genderDetails.map((value, index) => (
                          <MenuItem key={index} value={value?.id}>
                            {value?.gender}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="flatBuildNo" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}
                {...register("flatBuldingNo")}
                error={!!errors.flatBuldingNo}
                helperText={
                  errors?.flatBuldingNo ? errors.flatBuldingNo.message : null
                }
              />
            </Grid>
            {/* Building Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="buildingNm" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="roadName" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}
                InputLabelProps={{
                  shrink: watch("roadName") ? true : false,
                }}
                {...register("roadName")}
                error={!!errors.roadName}
                helperText={errors?.roadName ? errors.roadName.message : null}
              />
            </Grid>
            {/* LandMark */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="landmark" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="gisgioCode" />}
                variant="standard"
                InputLabelProps={{
                  shrink: watch("geoCode") ? true : false,
                }}
                {...register("geoCode")}
                // error={!!errors.geoCode}
                // helperText={errors?.geoCode ? errors.geoCode.message : null}
              />
            </Grid>
            {/* Applicant Adhaar No*/}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                id="standard-basic"
                inputProps={{ minLength: 12, maxLength: 12 }}
                label={<FormattedLabel id="applicantAdharNo" />}
                variant="standard"
                // sx={{
                //   width: "90%",
                // }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                // onMouseLeave={(e) => {
                //   checkAdhar(e.target.value);
                // }}
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              {/* <FormControl
                variant="standard"
                // style={{ marginTop: 5, marginLeft: 12, width: "90%" }}
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
                        disabled={loggedUser === "citizenUser" ? true : false}
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
              </FormControl> */}
              <FormControl
                variant="standard"
                // style={{ marginTop: 5, marginLeft: 12, width: "90%" }}
                sx={{ minWidth: "100%" }}
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
                        disabled={loggedUser === "citizenUser" ? true : false}
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
                            sx={{ m: { xs: 0 }, minWidth: "100%" }}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="age" />}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <FormControl
                error={errors.religionKey}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="religion" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ minWidth: 220 }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      {...field}
                      value={field.value}
                      // onChange={(value) => {
                      //   field.onChange(value);
                      // }}
                      label="Select Auditorium"
                    >
                      {religionNames &&
                        religionNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {auditorium.religion}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <FormControl
                error={errors.casteCategory}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="castCategory" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ minWidth: 220 }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
                              {auditorium.castCategory}
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

            {/* Caste Option */}
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
                error={errors.castOptionKey}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="castOption" />
                  <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ minWidth: 220 }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {castOptions.length > 0 &&
                        castOptions.map((auditorium, index) => {
                          return (
                            <MenuItem key={index} value={auditorium.id}>
                              {language == "en"
                                ? auditorium.cast
                                : auditorium.castMr}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="castOptionKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.castOptionKey ? errors.castOptionKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {mainSchemeVal === 26 && (
              <>
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
                    // sx={{ width: "90%" }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="divyangSchemeType" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          // sx={{ minWidth: 220 }}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  // }}
                >
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-basic"
                    label={<FormattedLabel id="disabilityPercent" />}
                    variant="standard"
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
                    // style={{ marginTop: 5, marginLeft: 12, width: "90%" }}
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
              </>
            )}
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}></Grid>
          {/* Main gap  Eligibility Criteria*/}
          {/* <Grid container spacing={2} sx={{ padding: "1rem" }}></Grid> */}
          {dependency.length != 0 && (
            <>
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
              <DataGrid
                autoHeight
                sx={{
                  marginTop: 5,
                  overflowY: "scroll",
                  overflowX: "scroll",
                  "& .MuiDataGrid-virtualScrollerContent": {},
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  flexDirection: "column",
                  overflowX: "scroll",
                }}
                autoWidth
                density="standard"
                pageSize={10}
                rows={eligiblityData}
                columns={eligiblityColumns}
              />
            </>
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
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      // style={{
                      //   display: "flex",
                      //   justifyContent: "center",
                      // }}
                    >
                      <TextField
                        // sx={{ width: "90%" }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="ans" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch(`Answer.${index}`) ? true : false,
                        }}
                        {...register(`Answer.${index}`)}
                        error={!!errors[`Answer.${index}`]}
                        helperText={errors[`Answer.${index}`]?.message || null}
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
                        // style={{ minWidth: "280.2px" }}
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
                          defaultValue={obj.informationDetails}
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

          {/* <Grid container spacing={2} sx={{ padding: "10px" }}></Grid> */}

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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <FormControl
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.bankBranchKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="bankName" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ minWidth: 220 }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {bankMaster &&
                        bankMaster.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {service.bankName}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="branchName" />}
                variant="standard"
                inputProps={{ maxLength: 500 }}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="savingAcNo" />}
                inputProps={{ maxLength: 18, minLength: 6 }}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                inputProps={{ maxLength: 11, minLength: 11 }}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              //   color: "black",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                // inputProps={{ maxLength: 9, minLength: 9 }}
                id="standard-basic"
                label={<FormattedLabel id="bankMICR" />}
                variant="standard"
                InputLabelProps={{
                  shrink: watch("micrCode") ? true : false,
                }}
                {...register("micrCode")}
                // error={!!errors.micrCode}
                // helperText={errors?.micrCode ? errors.micrCode.message : null}
              />
            </Grid>
            {/* Saving Acc Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="savinAcFirstNm" />}
                inputProps={{ maxLength: 50 }}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="savingAcMiddleNm" />}
                inputProps={{ maxLength: 50 }}
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="savingAcLastNm" />}
                inputProps={{ maxLength: 50 }}
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
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "baseline",
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
                        //   display: "flex",
                        //   justifyContent: "center",
                        //   alignItems: "baseline",
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
                            {obj.isRequired && (
                              <span style={{ color: "red" }}>*</span>
                            )}
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

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "baseline",
            }}
          >
            <b
              style={{
                textAlign: "center",
                color: "red",
                marginRight: "4px",
              }}
            >
              {language === "en"
                ? "Attachment size should be less than or equal to 2mb"
                : "संलग्नक आकार 2mb पेक्षा कमी किंवा समान असावा"}
            </b>
            <p>
              {language === "en"
                ? "(Documents Attachments pdf/jpeg/jpg/png)"
                : "(दस्तऐवज संलग्नक pdf/jpeg/jpg/png)"}
            </p>
          </Grid>
          {/* <Grid container sx={{ padding: "10px" }}></Grid> */}
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
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "baseline",
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
                        flex: 1,
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
                      sx={{
                        // display: "flex",
                        // justifyContent: "center",
                        // alignItems: "baseline",
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
                            {obj.isRequired && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          </span>
                        }
                        filePath={obj.documentPath}
                        objId={obj.id}
                        uploadDoc={docUpload}
                        value={docUpload}
                        setUploadDoc={setDocUpload}
                        registerFunction={register}
                        error={
                          errors &&
                          errors.uploadDocs &&
                          docUpload.some((item) => !item.documentPath)
                            ? true
                            : false
                        }
                        helperText={
                          errors &&
                          errors.uploadDocs &&
                          docUpload.some((item) => !item.documentPath)
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
          {((loggedUser != "citizenUser" && loggedUser != "cfcUser") ||
            ((loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
              (statusVal === 1 || statusVal === 23 || statusVal === 22) &&
              remarkTableData.length != 0)) && (
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
                      <FormattedLabel id="approvalSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
          {/* samuh sanghtak remark show only citizen when status is reverted */}
          {(loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
            (statusVal === 22 || statusVal === 1) && (
              <>
                {" "}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-basic"
                    label={
                      statusVal === 1 ? (
                        <FormattedLabel id="revertedReason" />
                      ) : (
                        <FormattedLabel id="rejectedReason" />
                      )
                    }
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    multiline
                    disabled={true}
                    {...register("saSanghatakRemark")}
                    error={!!errors.saSanghatakRemark}
                    helperText={
                      errors?.saSanghatakRemark
                        ? errors.saSanghatakRemark.message
                        : null
                    }
                  />
                </Grid>
              </>
            )}
          <Grid
            container
            spacing={5}
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "6px",
            }}
          >
            <Grid item>
              <Button
                size="small"
                // sx={{ marginRight: 8 }}
                variant="contained"
                color="error"
                // className={commonStyles.buttonExit}
                endIcon={<ClearIcon />}
                onClick={() => {
                  router.push(
                    // "/BsupNagarvasthi/transaction/newApplicationScheme/list"
                    "/dashboard"
                  );
                }}
              >
                {<FormattedLabel id="back" />}
              </Button>
            </Grid>
            <Grid item>
              {/* <Button
                sx={{ marginRight: 8 }}
                type="submit"
                size="small"
                disabled={
                  (docUpload1.some((item) => item.documentPath === "") ||
                    docUpload.some((item) => item.documentPath === "")) ===
                  false
                    ? dependency && dependency.length != 0
                      ? (watch("answerName") &&
                          watch("answerName").includes("")) ||
                        (watch("Answer") && watch("Answer").includes(""))
                        ? true
                        : false
                      : false
                    : true
                }
                variant="contained"
                color="primary"
                endIcon={<SaveIcon />}
              >
                {<FormattedLabel id="save" />}
              </Button> */}
              <Button
                // sx={{ marginRight: 8 }}
                disabled={
                  (docUpload1.some((item) => item.documentPath === "") ||
                    docUpload.find((item) => item.isRequired === true)
                      ?.documentPath === "") === false
                    ? dependency && dependency.length != 0
                      ? (watch("answerName") &&
                          watch("answerName").includes("")) ||
                        (watch("Answer") && watch("Answer").includes(""))
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
                // onClick={() => handleSaveAsDraft("save")}
              >
                {<FormattedLabel id="save" />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategorySchemes;
