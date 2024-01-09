/* eslint-disable react/jsx-key */
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  ThemeProvider,
  Checkbox,
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
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import IconButton from "@mui/material/IconButton";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import trnNewApplicationSchema from "../../../../containers/schema/BsupNagarvasthiSchema/trnNewApplicationSchema.js";
import saveAsDraftTrnNewApplicationSchema from "../../../../containers/schema/BsupNagarvasthiSchema/saveAsDraftTrnNewSchema";
import divyangData from "../divyang.json";
import Loader from "../../../../containers/Layout/components/Loader/index";
import bsupUserRoles from "../../../../components/bsupNagarVasthi/userRolesBSUP";
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
  const [isName, setSaveButtonName] = useState("");

  const handleSaveAsDraft = (name) => {
    setIsDraft(true);
    setSaveButtonName(name);
  };
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver:
      isName === "draft"
        ? yupResolver(saveAsDraftTrnNewApplicationSchema)
        : yupResolver(trnNewApplicationSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const [showAlert, setAlert] = useState(false);
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
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [docUpload, setDocUpload] = useState([]);
  const [docUpload1, setDocUpload1] = useState([]);
  const [statusVal, setStatusVal] = useState(null);
  const [dropDown, setDropDown] = useState([]);
  const [loadFormData, setLoadFormData] = useState([]);
  const [eligiblityDocuments, setEligiblityDocuments] = useState([]);
  const [mainSchemeVal, setMainScheme] = useState();
  const [genderDetails, setGenderDetails] = useState([]);
  const [areaId, setAreaId] = useState([]);
  const [areaNm, setAreaNm] = useState(null);
  const [subSchemePrefix, setSubSchemePrefix] = useState();
  const [eligiblityData, setEligiblityCriteriaData] = useState([]);
  const [eligibilityCriteriaDetails, setEligiblityCriteriaDetails] = useState(
    []
  );
  const [subSchemeNote, setSubSchemeNote] = useState(null);
  const [forBachatGat, setForBachatgat] = useState(false);
  const [subSchemeVal, setSubScheme] = useState();
  const [isDraft, setIsDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bachatGatValid, setBachatGatValid] = useState(false);
  //get logged in user
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  let userCitizen = useSelector((state) => {
    return state?.user?.user;
  });
  const [mainSchemePrefix, setMainPrefix] = useState(null);
  const [zonePref, setZonePrefix] = useState();
  const language = useSelector((state) => state.labels.language);
  const currDate = new Date();
  const [selectedMainScheme, setSelectedMainScheme] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSubScheme, setSelectedSubScheme] = useState(null);
  const [castOptions, setCastOptions] = useState([]);
  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

  const headers = { Authorization: `Bearer ${user?.token}` };

  const [checked, setChecked] = React.useState(false);
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

  const handleConfirmationChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (watch("areaKey") === "") {
      setValue("mainSchemeKey", "");
      setValue("subSchemeKey", "");
    }
  }, [watch("areaKey")]);

  // useEffect(() => {
  //   const tempData = axios
  //     .get(`${urls.BSUPURL}/trnSchemeApplicationNew/getBeneficiaryCode`, {
  //       headers: headers
  //     })
  //     .then((res) => {
  //       setValue(
  //         "benecode",
  //         zonePref +
  //         " " +
  //         mainSchemePrefix +
  //         " " +
  //         watch("subSchemeKey") +
  //         " " +
  //         res.data
  //       );
  //     })
  //     .catch((err) => {
  //       catchMethod(err)
  //     });
  // }, [zonePref, mainSchemePrefix, watch("subSchemeKey")]);

  useEffect(() => {
    if (zonePref != undefined) {
      const tempData = axios
        .get(`${urls.BSUPURL}/trnSchemeApplicationNew/getBeneficiaryCode`, {
          headers: headers,
        })
        .then((res) => {
          setValue(
            "benecode",
            zonePref +
              " " +
              mainSchemePrefix +
              " " +
              watch("subSchemeKey") +
              " " +
              res.data
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  }, [selectedSubScheme]);

  useEffect(() => {
    if (
      watch("bachatgatNo") != "" &&
      watch("bachatgatNo") != undefined &&
      watch("bachatgatNo") != null
    ) {
      // && watch("bachatgatNo")?.length === 21
      isValidBachatgat();
    }
  }, [watch("bachatgatNo")]);

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;

  const isValidBachatgat = () => {
    const url = `${
      urls.BSUPURL
    }/trnBachatgatRegistration/isCompleted6Months?bachatGatNo=${watch(
      "bachatgatNo"
    )}`;
    // if (watch("bachatgatNo").length === 21) {
    setIsLoading(true);
    axios
      .get(url, { headers: headers })
      .then((response) => {
        setIsLoading(false);
        setBachatGatValid(response.data);
        if (response.data === false) {
          sweetAlert({
            text:
              language === "en"
                ? `Your bachatgat number not eligible for this scheme `
                : `तुमचा बचतगट क्रमांक या योजनेसाठी पात्र नाही`,
            icon: "error",
            showCancelButton: false,
            confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false, // Prevent closing on click outside
          });

          // .then((will) => {
          //   if (will) {
          //     {
          //       // router.push(
          //       //   "/BsupNagarvasthi/transaction/newApplicationScheme/list"
          //       // );
          //       router.push("/dashboard");
          //     }
          //   }
          // });
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
    // }
    // }
    // setIsLoading(false);
    // catchMethod(err);
  };

  // eligiblity criteria details show on table
  useEffect(() => {
    const eData = [];
    for (var i = 0; i < dependency.length; i++) {
      if (
        dependency[i].informationType != "fl" &&
        eligibilityCriteriaDetails.length != 0
      ) {
        for (var j = 0; j < eligibilityCriteriaDetails.length; j++) {
          if (
            eligibilityCriteriaDetails[j].schemesConfigDataKey ==
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
      } else if (dependency[i].informationType != "fl") {
        eData.push({
          srNo: j + 1,
          activeFlag: "Y",
          id: null,
          schemesConfigDataKey: dependency[i].id,
          informationTitle: dependency[i].informationTitle,
          informationType: dependency[i].informationType,
          infoSelectionData: dependency[i].infoSelectionData,
        });
      }
    }

    setEligiblityCriteriaData([...eData]);
  
  }, [dependency, eligibilityCriteriaDetails]);

  useEffect(() => {
    eligiblityData &&
      eligiblityData
        .filter((temp) => temp.informationType == "ft")
        ?.map((obj, index) => {
          // if (obj.informationType == "ft") {
          setValue(`Answer.${index}`, obj.informationDetails);
          // }
        });
  }, [eligiblityData]);

  // eligiblity document array
  useEffect(() => {
    const res = [];

    for (var i = 0; i < docUpload?.length; i++) {
      for (var j = 0; j < eligiblityDocuments?.length; j++) {
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
    getZoneName();
    getWardNames();
    getCRAreaName();
    getGenders();
    getReligionDetails();
    getBankMasters();
    setDocUpload1([
      {
        id: 1,
        title: language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentPath: "",
      },
      {
        id: 2,
        title: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentPath: "",
      },
    ]);
  }, [language]);

  useEffect(() => {
    if (watch("casteCategory")) {
      getCastFromCastCategoory();
    }
  }, [watch("casteCategory")]);

  useEffect(() => {
    if (loggedUser === "citizenUser") {
      setValue("applicantFirstName", userCitizen?.firstName);
      setValue("applicantMiddleName", userCitizen?.middleName);
      setValue("applicantLastName", userCitizen?.surname);
      setValue("applicantFirstNameMr", userCitizen?.firstNamemr);
      setValue("applicantMiddleNameMr", userCitizen?.middleNamemr);
      setValue("applicantLastNameMr", userCitizen?.surnamemr);
      setValue("emailId", userCitizen?.emailID);
      setValue("pinCode", userCitizen?.pincode);
      setValue("mobileNo", userCitizen?.mobile);
      setValue("gender", userCitizen?.gender);
      setValue(
        "flatBuldingNo",
        language == "en"
          ? userCitizen?.pflatBuildingNo
          : userCitizen?.cflatBuildingNoMr
      );
      setValue(
        "buildingName",
        language == "en"
          ? userCitizen?.pbuildingName
          : userCitizen?.cbuildingNameMr
      );
      setValue(
        "roadName",
        language == "en" ? userCitizen?.croadName : userCitizen.croadNameMr
      );
      setValue(
        "landmark",
        language == "en" ? userCitizen?.clandmark : userCitizen?.clandmarkMr
      );
      setValue("dateOfBirth", userCitizen?.dateOfBirth);
      setValue("age", calculate_age(userCitizen?.dateOfBirth));
    }
  }, [userCitizen]);

  const calculate_age = (dob1) => {
    var today = new Date();
    var birthDate = new Date(dob1); // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    return age_now;
  };

  useEffect(() => {
    setZonePrefix(
      zoneNames &&
        zoneNames.find((r) => {
          return r.id == watch("zoneKey");
        })?.zonePrefix
    );
  }, [watch("zoneKey")]);

  useEffect(() => {
    getMainScheme();
  }, []);

  useEffect(() => {
    setAreaNm(
      crAreaNames &&
        crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
        ? crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
        : ""
    );
  }, [watch("areaKey")]);

  useEffect(() => {
    if (areaNm != "" && areaNm != null) {
      getAreas();
    }
  }, [areaNm]);

  const getAreas = () => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaName?areaName=${watch(
          "areaName"
        )}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          if (res?.data.length !== 0) {
            setAreaId(
              res?.data?.map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                areaId: r.areaId,
                zoneId: r.zoneId,
                wardId: r.wardId,
                zoneName: r.zoneName,
                zoneNameMr: r.zoneNameMr,
                wardName: r.wardName,
                wardNameMr: r.wardNameMr,
                areaName: r.areaName,
                areaNameMr: r.areaNameMr,
              }))
            );
            setValue("areaName", "");
          } else {
            setValue("zoneKey", "");
            setValue("wardKey", "");
            sweetAlert({
              title: language === "en" ? "OOPS!" : "क्षमस्व!",
              text:
                language === "en"
                  ? "There are no areas match with your search!"
                  : "तुमच्या शोधाशी जुळणारे कोणतेही क्षेत्र नाहीत!",
              icon: "warning",
              dangerMode: true,
              button: language === "en" ? "Ok" : "ठीक आहे",
              closeOnClickOutside: false,
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false, // Prevent closing on Esc key
            });
          }
        } else {
          setValue("zoneKey", "");
          setValue("wardKey", "");
          sweetAlert({
            title: language === "en" ? "OOPS!" : "क्षमस्व!",
            text:
              language === "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            button: language === "en" ? "Ok" : "ठीक आहे",
            closeOnClickOutside: false,
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
          });
        }
      })
      .catch((err) => {
        setValue("zoneKey", "");
        setValue("wardKey", "");
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (watch("areaKey")) {
      let filteredArrayZone = areaId?.filter(
        (obj) => obj?.areaId === watch("areaKey")
      );

      let flArray1 = zoneNames?.filter((obj) => {
        return filteredArrayZone?.some((item) => {
          return item?.zoneId === obj?.id;
        });
      });

      let flArray2 = wardNames?.filter((obj) => {
        return filteredArrayZone?.some((item) => {
          return item?.wardId === obj?.id;
        });
      });

      setValue("zoneKey", flArray1[0]?.id);
      setValue("wardKey", flArray2[0]?.id);
    } else {
      setValue("zoneKey", "");
      setValue("wardKey", "");
    }
  }, [watch("areaKey")]);

  useEffect(() => {
    getAllCastCategories();
  }, []);

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

  // cast from cast category
  const getCastFromCastCategoory = () => {
    axios
      .get(
        `${urls.BSUPURL}/master/cast/getCastFromCastCategories?id=${watch(
          "casteCategory"
        )}`,
        {
          headers: headers,
        }
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
        setGenderDetails(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          }))
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
          zoneNameMr: row.zoneNameMr,
          zonePrefix: row.zonePrefix,
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
          schemeNameMr: row.schemeNameMr,
          schemePrefix: row.schemePrefix,
        }));
        setMainNames(
          language === "en"
            ? data.sort(sortByProperty("schemeName"))
            : data.sort(sortByProperty("schemeNameMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // load sub scheme
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
        let data = r.data.mstSubSchemesList.map((row) => ({
          id: row.id,
          subSchemeName: row.subSchemeName,
          subSchemeNameMr: row.subSchemeNameMr,
          benefitAmount: row.benefitAmount,
          forBachatGat: row.forBachatGat,
          note: row.note,
        }));
        setSubSchemeNames(
          language === "en"
            ? data.sort(sortByProperty("subSchemeName"))
            : data.sort(sortByProperty("subSchemeNameMr"))
        );
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  //added for benefit amount
  // useEffect(() => {
  //   let dummyAmount = subSchemeNames.find(
  //     (obj) => obj.id === watch("subSchemeKey")
  //   );
  //   setForBachatgat(dummyAmount?.forBachatGat);
  //   setValue("benefitAmount", dummyAmount?.benefitAmount);
  // }, [watch("subSchemeKey")]);

  // when find mainscheme key then set bene code
  useEffect(() => {
    if (watch("mainSchemeKey")) {
      // setValue("benefitAmount", "");
      getSubScheme();
      setMainPrefix(
        mainNames &&
          mainNames.find((r) => {
            return r.id == watch("mainSchemeKey");
          })?.schemePrefix
      );
    }
    setValue("Answer", undefined);
    setValue("answerName", undefined);
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
    }
  }, [watch("subSchemeKey")]);

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
          setDependency(
            r?.data?.mstSchemesConfigDataList?.map((row) => ({
              id: row.id,
              informationType: row.informationType,
              informationTitle: row.informationTitle,
              informationTitleMr: row.informationTitleMr,
              schemesConfigKey: row.schemesConfigKey,
              subSchemeKey: row.subSchemeKey,
              infoSelectionData: row.infoSelectionData,
              isRequired: row.isMandatory,
            }))
          );
          setTextFArea(
            r?.data?.mstSchemesConfigDataList
              ?.filter((obj) => obj.informationType === "ft")
              .map((row) => ({
                id: row.id,
                informationType: row.informationType,
                informationTitle: row.informationTitle,
                informationTitleMr: row.informationTitleMr,
                schemesConfigKey: row.schemesConfigKey,
                subSchemeKey: row.subSchemeKey,
                isRequired: row.isMandatory,
              }))
          );
          // setDocUpload(
          //   r?.data?.mstSchemesConfigDataList
          //     ?.filter((obj) => obj.informationType === "fl")
          //     .map((row) => ({
          //       id: row.id,
          //       informationType: row.informationType,
          //       informationTitle: row.informationTitle,
          //       informationTitleMr: row.informationTitleMr,
          //       schemesConfigKey: row.schemesConfigKey,
          //       subSchemeKey: row.subSchemeKey,
          //       documentPath: "",
          //     }))
          // );

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
                isRequired: row.isMandatory,
                documentPath:
                  eligiblityDocuments &&
                  eligiblityDocuments.find(
                    (obj) => obj.schemesConfigDocumentsKey == row.id
                  )?.documentPath === undefined
                    ? ""
                    : eligiblityDocuments &&
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

          // setDropDown(
          //   r?.data?.mstSchemesConfigDataList
          //     ?.filter((obj) => obj.informationType === "dd")
          //     .map((row) => ({
          //       id: row.id,
          //       informationType: row.informationType,
          //       informationTitle: row.informationTitle,
          //       informationTitleMr: row.informationTitleMr,
          //       schemesConfigKey: row.schemesConfigKey,
          //       subSchemeKey: row.subSchemeKey,
          //       infoSelectionData: row.infoSelectionData,
          //     }))
          // );
          setDropDown(
            r?.data?.mstSchemesConfigDataList
              ?.filter((obj) => obj.informationType === "dd")
              .map((row) => ({
                id: row.id,
                informationType: row.informationType,
                informationTitle: row.informationTitle,
                informationTitleMr: row.informationTitleMr,
                schemesConfigKey: row.schemesConfigKey,
                subSchemeKey: row.subSchemeKey,
                infoSelectionData: row.infoSelectionData,
                isRequired: row.isMandatory,
              }))
          );
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  useEffect(() => {
    getDependency();
  }, [watch("mainSchemeKey"), watch("subSchemeKey"), eligiblityDocuments]);

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

  const resetValuesCancell = {
    fromDate: "",
    toDate: "",
    applicationNo: "",
    subSchemeKey: "",
    mainSchemeKey: "",
    flatBuildingNo: "",
    buildingName: "",
    roadName: "",
    buildingName: "",
    roadName: "",
    mobileNo: "",
    emailId: "",
    landmark: "",
    pincode: "",
    geoCode: "",
    dateOfBirth: "",
    religionKey: "",
    casteCategory: "",
    bankBranchKey: "",
    savingAccountNo: "",
    saOwnerFirstName: "",
    saOwnerMiddleName: "",
    saOwnerLastName: "",
    disabilityCertificateNo: "",
    disabilityCertificateValidity: "",
    // disabilityPercentage: "5",
    disabilityPercentage: "",
    disabilityDuration: "",
    schemeRenewalDate: null,
    divyangSchemeTypeKey: null,
    isBenifitedPreviously: "",
    remarks: "",
    applicantFirstName: "",
    applicantMiddleName: "",
    applicantLastName: "",
    benefitAmount: "",
  };

  // apply new shceme button
  const onSubmitForm = (formData) => {
    setIsLoading(true);
   const isDraft = window.event.submitter.name === "draft";
    setIsDraft(isDraft);
    const data =
      docUpload &&
      docUpload.map((obj) => {
        return {
          id: router.query.id != null ? Number(obj.uniqueId) : null,
          schemeApplicationKey: formData.mainSchemeKey,
          // schemeApplicationKey:0,
          schemeRenewalKey: 0,
          trnType: "SCAP",
          schemeApplicationNo: "",
          informationType: obj.informationType,
          schemesConfigDocumentsKey: obj.id,
          documentFlow: "",
          activeFlag: "Y",
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
            id:
              router.query.id != null
                ? Number(obj.id) === 0
                  ? null
                  : Number(obj.id)
                : null,
            // schemeApplicationKey: formData.mainSchemeKey, //main scheme id
            schemeApplicationKey:
              router.query.id != null
                ? Number(obj.schemeApplicationKey)
                : formData.mainSchemeKey, //main scheme id

            schemeRenewalKey: 0,
            // schemeApplicationKey:0,
            trnType: "SCAP",
            activeFlag: "Y",
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
            id:
              router.query.id != null
                ? Number(obj.id) === 0
                  ? null
                  : Number(obj.id)
                : null,
            schemeApplicationKey:
              router.query.id != null
                ? Number(obj.schemeApplicationKey)
                : formData.mainSchemeKey, //main scheme id
            schemeRenewalKey: 0,
            // schemeApplicationKey:0,
            trnType: "SCAP",
            activeFlag: "Y",
            schemesConfigDataKey: obj.schemesConfigDataKey,
            informationType: obj.informationType,
            informationDetails:
              formData.answerName && formData.answerName[index],
          };
        });
    let routerData = [];

    if (
      loadFormData.length != 0 &&
      loadFormData?.trnSchemeApplicationDataDaoList?.length != 0 &&
      Number(loadFormData.subSchemeKey) != Number(formData.subSchemeKey)
    ) {
      routerData =
        loadFormData.trnSchemeApplicationDataDaoList &&
        loadFormData.trnSchemeApplicationDataDaoList
          .filter((obj) => obj.informationType != "fl")
          .map((temp) => {
            return { ...temp, activeFlag: "N" };
          });
    }
    let routerDocument = [];
    if (
      loadFormData.length != 0 &&
      loadFormData?.trnSchemeApplicationDocumentsList?.length != 0 &&
      Number(loadFormData.subSchemeKey) != Number(formData.subSchemeKey)
    ) {
      routerDocument =
        loadFormData.trnSchemeApplicationDocumentsList &&
        loadFormData.trnSchemeApplicationDocumentsList.map((temp) => {
          return { ...temp, activeFlag: "N" };
        });
    }

    let eligiblityDataDao = [...dummyDao, ...dropdownDao, ...routerData];
    let eligiblityDocumentDao = [...data, ...routerDocument];

    let dataDao = eligiblityDataDao.filter((element) => {
      return element !== null;
    });

    let isInstallmentPaid = false;
    let completedInstallment = null;
    let installmentAmount = null;
    let installmentDate = null;
    let paymentType = null;
    let paymentMode = null;

    // ////////////////////////////////Accountuser////////////////
    // if(authority && authority.find((val) => val === "FINAL_APPROVAL")){
    if (
      authority &&
      authority.find((val) => val === bsupUserRoles.roleHOClerk)
    ) {
      isInstallmentPaid = true;
      completedInstallment =
        formData.completedInstallment == null
          ? 0
          : formData.completedInstallment;
      installmentAmount =
        formData.completedInstallment == null
          ? 0
          : formData.completedInstallment;
      installmentDate = currDate;
      paymentType = formData.paymentType == null ? null : formData.paymentType;
      paymentMode = formData.paymentMode == null ? null : formData.paymentMode;
    }
    /////////////////////////////////////////////////////////////

    const temp = [
      {
        ...loadFormData,
        ...formData,
        status: statusVal,
        id: Number(router.query.id),
        isDraft: isDraft,
        isApproved: false,
        isComplete: false,
        bachatgatNo: forBachatGat === true ? formData.bachatgatNo : "",
        isRenewed: false,
        activeFlag: "Y",
        ////////////////////////////////////////////////////////////////

        installmentPaid: isInstallmentPaid,
        completedInstallment: completedInstallment,
        installmentAmount: installmentAmount,
        installmentDate: installmentDate,
        paymentType: paymentType,
        paymentMode: paymentMode,
        castOptionKey: formData.castOptionKey,

        /////////////////////////////////////////////////////////////
        trnSchemeApplicationDataDaoList: dataDao,
        trnSchemeApplicationDocumentsList: eligiblityDocumentDao,
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
      },
    ];
    const tempData = axios
      .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          !isDraft
            ? sweetAlert({
                text:
                  language === "en"
                    ? ` Your application is sent successfully. Your application no. is ${
                        res.data.message.split("[")[1].split("]")[0]
                      } `
                    : `तुमचा अर्ज यशस्वीरीत्या पाठवला आहे. तुमचा अर्ज क्र. आहे ${
                        res.data.message.split("[")[1].split("]")[0]
                      }  `,
                icon: "success",
                buttons: [
                  isName === "draft" || isDraft === true
                    ? null
                    : language === "en"
                    ? "View Acknowledgement"
                    : "पावती पहा",
                  language === "en" ? "Go To Dashboard" : "डॅशबोर्डवर जा",
                ],
                dangerMode: false,
                allowOutsideClick: false, // Prevent closing on outside click
                allowEscapeKey: false, // Prevent closing on Esc key
                closeOnClickOutside: false,
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
                    pathname: "/BsupNagarvasthi/transaction/acknowledgement",
                    query: {
                      id: res.data.message.split("[")[1].split("]")[0],
                      trn: "N",
                    },
                  });
                }
              })
            : sweetAlert({
                text:
                  language === "en"
                    ? ` Your application is save as draft successfully `
                    : `तुमचा अर्ज मसुदा म्हणून यशस्वीरित्या जतन झाला आहे`,
                icon: "success",
                showCancelButton: false,
                confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
                allowOutsideClick: false, // Prevent closing on outside click
                allowEscapeKey: false, // Prevent closing on Esc key
                closeOnClickOutside: false, // Prevent closing on click outside
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
                    pathname: "/BsupNagarvasthi/transaction/acknowledgement",
                    query: {
                      id: res.data.message.split("[")[1].split("]")[0],
                      trn: "N",
                    },
                  });
                }
              });
        }
        // setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
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

  const loadDraftData = () => {
    setIsLoading(true);
    const loadData = axios
      .get(
        `${urls.BSUPURL}/trnSchemeApplicationNew/getById?id=${router.query.id}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        setLoadFormData(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
    getAreas();
    getZoneName();
    getWardNames();
  };

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      loadDraftData();
    }
  }, [router.query.id]);

  useEffect(() => {
    if (loadFormData.length != 0) {
      setBachatGatCategoryNewSchemes();
    }
  }, [loadFormData]);

  const setBachatGatCategoryNewSchemes = () => {
    let _res = loadFormData;
    setEligiblityDocuments(_res.trnSchemeApplicationDocumentsList);
    setValue("applicantFirstName", _res.applicantFirstName);
    setValue("bachatgatNo", _res.bachatgatNo);
    setValue("benefitAmount", _res.benefitAmount);
    setValue("subSchemeKey", _res.subSchemeKey);
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
    setValue("landmark", _res?.landmark ? _res?.landmark : "");
    setValue("flatBuldingNo", _res?.flatBuldingNo ? _res?.flatBuldingNo : "");
    setValue("geoCode", _res?.geoCode ? _res?.geoCode : "");
    setValue(
      "savingAccountNo",
      _res?.savingAccountNo ? _res?.savingAccountNo : ""
    );
    setValue(
      "saOwnerFirstName",
      _res?.saOwnerFirstName ? _res?.saOwnerFirstName : ""
    );
    setValue(
      "saOwnerMiddleName",
      _res?.saOwnerMiddleName ? _res?.saOwnerMiddleName : ""
    );
    setValue(
      "saOwnerLastName",
      _res?.saOwnerLastName ? _res?.saOwnerLastName : ""
    );
    setValue("dateOfBirth", _res?.dateOfBirth);
    setValue("remarks", _res?.remarks ? _res?.remarks : "");
    setValue("bankNameId", _res.bankBranchKey);
    setValue("ifscCode", _res.ifscCode);
    setValue("micrCode", _res.micrCode);
    setValue(
      "disabilityPercentage",
      _res?.disabilityPercentage ? _res?.disabilityPercentage : ""
    );
    setValue(
      "disabilityDuration",
      _res?.disabilityDuration ? _res?.disabilityDuration : ""
    );
    setValue(
      "disabilityCertificateNo",
      _res?.disabilityCertificateNo ? _res?.disabilityCertificateNo : ""
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
  };

  // const isDocUpload1Valid = docUpload1.some((item) => item.documentPath === "");
  // const isDocUploadValid =
  //   docUpload.find((item) => item.isRequired === true)?.documentPath === "";

  // const isButtonDisabled =
  //   ((isDocUpload1Valid || isDocUploadValid) === false
  //     ? dependency && dependency.length !== 0
  //       ? (watch("answerName") && watch("answerName").includes("")) ||
  //         (watch("Answer") && watch("Answer").includes(""))
  //         ? true
  //         : false
  //       : false
  //     : true) ||
  //   (bachatGatValid === false && forBachatGat);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isPassbookUpload, setIsPassbookUpload] = useState(false);
  const [isEligblityDoc, setIsEligblityDoc] = useState(false);

  useEffect(() => {
    setIsPassbookUpload(docUpload1.some((item) => item.documentPath === ""));
    setIsEligblityDoc(
      docUpload.find((item) => item.isRequired === true)?.documentPath === ""
    );
  }, [docUpload1, docUpload]);

  useEffect(() => {
    if (
      (!isPassbookUpload && !isEligblityDoc) ||
      (bachatGatValid === false && forBachatGat)
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [isEligblityDoc, isPassbookUpload]);

;
  // };

  const setBenifitAmount = () => {
    const subScheme_Key = watch("subSchemeKey");

    const selectedSubScheme = subSchemeNames.find(
      (obj) => obj.id === subScheme_Key
    );

    if (selectedSubScheme) {
      setValue("benefitAmount", selectedSubScheme.benefitAmount);
      setForBachatgat(selectedSubScheme.forBachatGat);
    }
    setSubSchemeNote(
      subSchemeNames.find((obj) => obj.id === watch("subSchemeKey"))?.note
    );
  };

  useEffect(() => {
    if (subSchemeNames.length > 0) {
      setBenifitAmount();
    }
  }, [watch("subSchemeKey"), subSchemeNames]);

  // useEffect(() => {
  //   setBenifitAmount();
  // }, [watch("subSchemeKey")]);

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
          "@media (max-width: 770px)": {
            marginTop: "4rem",
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
              md={12}
              lg={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
                gap: 15,
              }}
            >
              {areaId.length === 0 ? (
                <>
                  <TextField
                    style={{
                      backgroundColor: "white",
                      width: "300px",
                    }}
                    // sx={{ m: { xs: 0, md: 1 }, backgroundColor: "white", minWidth: "100%" }}
                    id="outlined-basic"
                    label={
                      language === "en"
                        ? "Search By Area Name"
                        : "क्षेत्राच्या नावाने शोधा"
                    }
                    placeholder={
                      language === "en"
                        ? "Enter Area Name, Like 'Dehu'"
                        : "'देहू' प्रमाणे क्षेत्राचे नाव प्रविष्ट करा"
                    }
                    variant="standard"
                    {...register("areaName")}
                    // required
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (watch("areaName")) {
                        getAreas();
                      } else {
                        sweetAlert({
                          title: language === "en" ? "OOPS!" : "क्षमस्व!",
                          text:
                            language === "en"
                              ? "Please enter the area name first"
                              : "कृपया प्रथम क्षेत्राचे नाव प्रविष्ट करा",
                          icon: "warning",
                          dangerMode: true,
                          closeOnClickOutside: false,
                        });
                      }
                    }}
                    size="small"
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    <FormattedLabel id="getDetails" />
                  </Button>
                </>
              ) : (
                <>
                  <FormControl
                    style={{ minWidth: "200px" }}
                    // sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    error={!!errors.areaKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="results" />
                      <span style={{ color: "red" }}>*</span>
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          style={{ backgroundColor: "inherit" }}
                          fullWidth
                          variant="standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label="Complaint Type"
                        >
                          {areaId &&
                            areaId?.map((areaId, index) => (
                              <MenuItem key={index} value={areaId.areaId}>
                                {language === "en"
                                  ? areaId?.areaName
                                  : areaId?.areaNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="areaKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText classsName={commonStyles.errorMessage}>
                      {errors?.areaKey ? errors.areaKey.message : null}
                    </FormHelperText>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setAreaId([]);
                      setValue("areaKey", "");
                    }}
                    size="small"
                  >
                    <FormattedLabel id="searchArea" />
                  </Button>
                </>
              )}
            </Grid>
            {/* Zone Name */}
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
              <FormControl
                error={errors.zoneKey}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zoneNames" />
                  <span style={{ color: "red" }}>*</span>
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
                        setSelectedZone(value.target.value);
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
                <FormHelperText classsName={commonStyles.errorMessage}>
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                variant="standard"
                // sx={{ width: "100%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.wardKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="wardname" />
                  <span style={{ color: "red" }}>*</span> {/* Required star */}
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
                <FormHelperText classsName={commonStyles.errorMessage}>
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
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                error={errors.mainSchemeKey}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="mainScheme" />
                  <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ minWidth: "90%" }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setMainScheme(value.target.value);
                        setSelectedMainScheme(value.target.value);
                      }}
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
                <FormHelperText classsName={commonStyles.errorMessage}>
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
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                error={errors.subSchemeKey}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="subScheme" />
                  <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setSelectedSubScheme(value.target.value);
                        setEligiblityCriteriaDetails([]);
                        // setEligiblityCriteriaDetails(eligibilityCriteriaDetails && eligibilityCriteriaDetails.map((obj)=> {return { ...obj, activeFlag: "N" }}))
                      }}
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
                <FormHelperText classsName={commonStyles.errorMessage}>
                  {errors?.subSchemeKey ? errors.subSchemeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Beneficiary Code */}

            {watch("zoneKey") != "" &&
              watch("mainSchemekey") != "" &&
              watch("subSchemeKey") != "" && (
                <>
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
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      // sx={{ width: "90%" }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="beneficiaryCode" />}
                      variant="standard"
                      disabled={true}
                      InputLabelProps={{
                        shrink: watch("benecode") ? true : false,
                      }}
                      {...register("benecode")}
                      error={!!errors.benecode}
                      helperText={
                        errors?.benecode ? errors.benecode.message : null
                      }
                    />
                  </Grid>
                </>
              )}

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
              //   alignItems: "center",
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
                value={
                  watch("benefitAmount")
                    ? parseFloat(watch("benefitAmount")).toFixed(2)
                    : ""
                }
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
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  inputProps={{ maxLength: 21, minLength: 21 }}
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
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
                label={<FormattedLabel id="applicantFirstName" />}
                variant="standard"
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
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
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={loggedUser === "citizenUser" ? true : false}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {genderDetails &&
                        genderDetails.map((value, index) => (
                          <MenuItem key={index} value={value?.id}>
                            {language == "en" ? value?.gender : value?.genderMr}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="buildingNm" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="roadName" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="landmark" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                // required
                id="standard-basic"
                label={<FormattedLabel id="gisgioCode" />}
                variant="standard"
                {...register("geoCode")}
                InputLabelProps={{ shrink: watch("geoCode") ? true : false }}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                id="standard-basic"
                required
                // type="number"
                label={<FormattedLabel id="applicantAdharNo" />}
                variant="standard"
                // sx={{
                //   width: "90%",
                // }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                // onInput={(e) => {
                //   checkAdhar(e.target.value);
                // }}
                inputProps={{ minLength: 12, maxLength: 12 }}
                {...register("applicantAadharNo")}
                InputLabelProps={{
                  shrink: watch("applicantAadharNo") ? true : false,
                }}
                error={!!errors.applicantAadharNo}
                helperText={
                  errors?.applicantAadharNo
                    ? errors.applicantAadharNo.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                required
                disabled={true}
                id="standard-basic"
                label={<FormattedLabel id="age" />}
                type="number"
                variant="standard"
                {...register("age")}
                InputLabelProps={{ shrink: true }}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
                InputLabelProps={{
                  shrink: loggedUser === "citizenUser" ? true : false,
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                error={errors.religionKey}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="religion" />
                  <span style={{ color: "red" }}>*</span>
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
                            {language == "en"
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
                error={errors.casteCategory}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="castCategory" />
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
                      {castNames.length > 0 &&
                        castNames.map((auditorium, index) => {
                          return (
                            <MenuItem key={index} value={auditorium.id}>
                              {language == "en"
                                ? auditorium.castCategory
                                : auditorium.castCategoryMr}
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

                {/* <Grid container spacing={3} sx={{ padding: "1rem" }}> */}
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
                                {/* <span style={{ color: "red" }}>*</span> */}
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
                      {errors?.disabilityCertificateValidity
                        ? errors.disabilityCertificateValidity.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* </Grid> */}
          </Grid>
          {/* Main gap  Eligibility Criteria*/}
          <Grid container sx={{ padding: "10px" }}></Grid>
          {/* {dependency.length != 0 && ( */}
          {eligiblityData.length != 0 && (
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

              <Grid
                container
                spacing={2}
                sx={{
                  padding: "1rem",
                  display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                  // backgroundColor: "whitesmoke",
                  textAlign: "center",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={1}
                  style={{
                    display: "flex",
                    justifyContent: "baseline",
                    alignItems: "baseline",
                  }}
                >
                  <b> {language == "en" ? "Sr. No." : "अ. क्र."}</b>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <b>{language == "en" ? "Criteria Name" : "निकषाचे नाव"}</b>
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
                      alignItems: "center",
                    },
                  }}
                >
                  <b>{language == "en" ? "Action" : "क्रिया"}</b>
                </Grid>
              </Grid>
            </>
          )}

          {/* )} */}
          {eligiblityData &&
            eligiblityData
              .filter((obj) => obj.informationType === "ft")
              .map((obj, index) => {
                return (
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      // padding: "1rem",
                      // padding: "10px",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "baseline",
                    }}
                  >
                    {/* Sr No */}
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
                      md={5}
                      lg={5}
                      xl={5}
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
                      md={5}
                      lg={5}
                      xl={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        // sx={{ width: "90%" }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required
                        id="standard-basic"
                        label={<FormattedLabel id="ans" />}
                        variant="standard"
                        {...register(`Answer.${index}`, {
                          ...trnNewApplicationSchema.Answer,
                        })}
                        InputLabelProps={{
                          shrink: watch(`Answer.${index}`) ? true : false,
                        }}
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
                    spacing={1}
                    sx={{
                      // padding: "1rem",
                      // padding: "10px",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "baseline",
                    }}
                  >
                    {/* Sr No */}
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
                      <strong>
                        {eligiblityData &&
                          eligiblityData.filter(
                            (obj) => obj.informationType === "ft"
                          ).length +
                            index +
                            1}
                      </strong>
                    </Grid>

                    <Grid
                      item
                      // xs={12}
                      // sm={12}
                      // md={6}
                      // lg={3}
                      // xl={3}
                      xs={12}
                      sm={12}
                      md={5}
                      lg={5}
                      xl={5}
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
                      // xs={12}
                      // sm={12}
                      // md={6}
                      // lg={3}
                      // xl={3}
                      xs={12}
                      sm={12}
                      md={5}
                      lg={5}
                      xl={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
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

          <Grid container sx={{ padding: "10px" }}></Grid>
          <Grid item xs={12}>
            <Box>
              <Grid
                container
                className={commonStyles.title}
                style={{ marginBottom: "8px" }}
              >
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.bankBranchKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="bankName" />
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
                    >
                      {bankMaster &&
                        bankMaster.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {language == "en"
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
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                required
                id="standard-basic"
                label={<FormattedLabel id="branchName" />}
                variant="standard"
                {...register("branchName")}
                inputProps={{ maxLength: 500 }}
                InputLabelProps={{ shrink: watch("branchName") ? true : false }}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                required
                id="standard-basic"
                label={<FormattedLabel id="savingAcNo" />}
                variant="standard"
                {...register("savingAccountNo")}
                inputProps={{ maxLength: 18, minLength: 6 }}
                InputLabelProps={{
                  shrink: watch("savingAccountNo") ? true : false,
                }}
                // InputLabelProps={{
                //   shrink: watch("savingAccountNo") ? true : false,
                // }}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                required
                id="standard-basic"
                label={<FormattedLabel id="bankIFSC" />}
                variant="standard"
                inputProps={{ maxLength: 11, minLength: 11 }}
                {...register("ifscCode")}
                InputLabelProps={{ shrink: watch("ifscCode") ? true : false }}
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
              style={{
                display: "flex",
                justifyContent: "center",
                color: "black",
              }}
            >
              <TextField
                // required
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankMICR" />}
                variant="standard"
                inputProps={{ maxLength: 9 }}
                {...register("micrCode")}
                InputLabelProps={{ shrink: watch("micrCode") ? true : false }}
                error={!!errors.micrCode}
                helperText={errors?.micrCode ? errors.micrCode.message : null}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                required
                id="standard-basic"
                label={<FormattedLabel id="savinAcFirstNm" />}
                variant="standard"
                inputProps={{ maxLength: 50 }}
                {...register("saOwnerFirstName")}
                InputLabelProps={{
                  shrink: watch("saOwnerFirstName") ? true : false,
                }}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                required
                id="standard-basic"
                label={<FormattedLabel id="savingAcMiddleNm" />}
                variant="standard"
                inputProps={{ maxLength: 50 }}
                {...register("saOwnerMiddleName")}
                InputLabelProps={{
                  shrink: watch("saOwnerMiddleName") ? true : false,
                }}
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
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                required
                id="standard-basic"
                label={<FormattedLabel id="savingAcLastNm" />}
                variant="standard"
                inputProps={{ maxLength: 50 }}
                {...register("saOwnerLastName")}
                InputLabelProps={{
                  shrink: watch("saOwnerLastName") ? true : false,
                }}
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
                      // padding: "1rem",
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

          {/* <Grid container spacing={2} sx={{ padding: "1rem" }}></Grid> */}
          {/*{docUpload.length != 0 && (*/}

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
          {subSchemeNote != null && (
            <div
              style={{
                display: "flex",
                padding: "10px",
                color: "red",
                fontFamily: "Roboto, Arial, Helvetica, sans-serif",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Note : " : "टीप : "}
              {subSchemeNote}
            </div>
          )}
          {/*)}*/}
          {/* ////////////////////////////////////////////////////////// */}
          <Grid container sx={{ padding: "1rem" }}>
            {docUpload.length != 0 && (
              <Grid
                container
                spacing={2}
                sx={{
                  padding: "1rem",
                  display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                  backgroundColor: "whitesmoke",
                  textAlign: "center",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={1}
                  style={{
                    display: "flex",
                    justifyContent: "baseline",
                    alignItems: "baseline",
                  }}
                >
                  <b> {language == "en" ? "Sr. No." : "अ. क्र."}</b>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={8}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                      alignItems: "center",
                    },
                  }}
                >
                  <b>
                    {language == "en"
                      ? "Upload Documents"
                      : "दस्तऐवज अपलोड करा"}
                  </b>
                </Grid>
              </Grid>
            )}

            {docUpload &&
              docUpload.map((obj, index) => {
                return (
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      // padding: "1rem",
                      padding: "10px",
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      backgroundColor: "whitesmoke",
                    }}
                  >
                    {/* Sr No */}
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
                    {/* Information Title */}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={8}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{obj?.informationTitle}</strong>
                    </Grid>
                    {/* upload button */}
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
          <Grid item xs={12}>
            <Box>
              <Grid
                container
                className={commonStyles.title}
                // style={{ marginBottom: "8px" }}
              >
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
                    <FormattedLabel id="selfDeclaration" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{
              padding: "1rem",
            }}
          >
            <Grid item xs={12}>
              <h3>
                मी श्री / श्रीमती <b>{userCitizen?.firstNamemr}{" "}
                {userCitizen?.middleNamemr}{" "} {userCitizen?.surnamemr}</b> राहणार{" "}<b>
                {userCitizen?.pbuildingNameMr}{", "} {userCitizen?.croadNameMr}{", "}
                {userCitizen?.clandmarkMr}</b> प्रतिज्ञापुर्वक लिहून देतो / देते की,
                विषयांकरीता योजनेअंतर्गत लाभ मिळण्याकरीता सादर केलेल्या
                अर्जामध्ये नमूद केलेली माहिती बरोबर व खरी आहे तसेच या योजने
                अंतर्गत महानगरपालिकेने निश्चित केलेल्या सर्व अटी, शर्ती मला
                मान्य आहेत. मी अशा प्रकारच्या कोणत्याही शासकीय / अन्य योजने
                अंतर्गत लाभ घेतलेला नाही. या अर्जात नमूद केलेली माहिती खोटी
                असल्यास होणाऱ्या परिणामांना मी स्वतः जबाबदार असून मिळालेला लाभ
                महानगरपालिकेस विनातक्रार परत करण्याची हमी देत आहे. मी
                महापालिकेची फसवणुक केल्यास फौजदारी स्वरूपाच्या कारवाईस पात्र
                राहिल.
              </h3>
            </Grid>
            <Grid item xs={12}>
              <h3>दिनांक: {(moment(currDate).format("DD-MM-YYYY"))}</h3>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleConfirmationChange}
                  />
                }
                label={<FormattedLabel id="iAgree" />}
              />
            </FormGroup>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Grid item>
              <Button
                size="small"
                // className={commonStyles.buttonExit}
                // sx={{ marginRight: 8 }}
                variant="contained"
                color="error"
                endIcon={<ClearIcon />}
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                {<FormattedLabel id="back" />}
              </Button>
            </Grid>
            <Grid item>
              <Button
                // sx={{ marginRight: 8 }}S
                // className={commonStyles.buttonSave}
                variant="contained"
                color="primary"
                size="small"
                type="submit"
                name="draft"
                onClick={() => handleSaveAsDraft("draft")}
                formNoValidate
              >
                <FormattedLabel id="saveAsDraft" />
              </Button>
            </Grid>
            <Grid item>
              <Button
                // sx={{ marginRight: 8 }}
                // className={commonStyles.buttonSave}
                disabled={isButtonDisabled || !checked}
                type="submit"
                size="small"
                variant="contained"
                color="success"
                endIcon={<SaveIcon />}
                onClick={() => handleSaveAsDraft("save")}
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
