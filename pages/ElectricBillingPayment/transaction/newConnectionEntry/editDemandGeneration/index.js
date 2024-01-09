import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Slide,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
  RadioGroup,
  Radio,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/demandGenerationSchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import { useDispatch, useSelector } from "react-redux";
import FileTable from "../../../../../components/ElectricBillingComponent/uploadMultipleDocuments/FileTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import Loader from "../../../../../containers/Layout/components/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import { DecryptData,EncryptData } from "../../../../../components/common/EncryptDecrypt";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const router = useRouter();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [generateDemandLetterFlag, setGenerateDemandLetterFlag] =
    useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [ward, setWard] = useState([]);
  const [department, setDepartment] = useState([]);
  const [zone, setZone] = useState([]);
  const [consumptionType, setConsumptionType] = useState([]);
  const [loadType, setLoadType] = useState([]);
  const [slideChecked, setSlideChecked] = useState(true);
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [phaseType, setPhaseType] = useState([]);
  const [slabType, setSlabType] = useState([]);
  const [usageType, setUsageType] = useState([]);
  const [msedclCategory, setMsedclCategory] = useState([]);
  const [msedclDivision, setMsedclDivision] = useState([]);
  const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState([]);
  const [subDivision, setSubDivision] = useState([]);
  const [departmentCategory, setDepartmentCategory] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [id, setId] = useState(router.query.id);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState([]);
  const [meterStatus, setMeterStatus] = useState([]);
  const [juniorEngineerDropDown, setJuniorEngineerDropDown] = useState([]);
  const [deputyEngineerDropDown, setDeputyEngineerDropDown] = useState([]);
  const [executiveEngineerDropDown, setExecutiveEngineerDropDown] = useState(
    []
  );
  const [roles, setRoles] = useState([]);
  const [accountantDropDown, setAccountantDropDown] = useState([]);
  const [equipementCapacityDropdown, setEquipementCapacityDropdown] = useState(
    []
  );
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

  let tableData = [];
  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];

  // multiple files attach
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(true);
  const [deletedFiles, setDeletedFiles] = useState([]);



  // useEffect(() => {
  //   setFinalFiles([...mainFiles, ...additionalFiles]);
  // }, [mainFiles, additionalFiles]);

  const getFilePreview = (filePath) => {
    console.log("filePath", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r?.data?.mimeType == "application/pdf") {
          const byteCharacters = atob(r?.data?.fileName);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const newTab = window.open();
          newTab.location.href = url;
        }
        // for img
        else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <body style="margin: 0;">
                <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
              </body>
            </html>
          `);
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    let temp = [...additionalFiles];

    let result =
      temp &&
      temp.map((each, i) => {
        return {
          ...each,
          srNo: i + 1,
        };
      });

    setFinalFiles([...mainFiles, ...result]);

    let deleteTableArr = [];
    deleteTableArr = result.filter((obj) => obj.activeFlag != "N");

    setDeletedFiles([...mainFiles, ...deleteTableArr]);
  }, [additionalFiles]);

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  // useEffect(() => {
  //   getDepartment();
  //   getConsumptionType();
  //   getBillingDivisionAndUnit();
  // }, [window.location.reload]);

  useEffect(() => {
    getZoneWiseWard(watch("departmentKey"), watch("zoneKey"));
  }, [watch("departmentKey"), watch("zoneKey")]);

  useEffect(() => {
    let _res = editData;

    setValue("consumerNo", _res?.consumerNo ? _res?.consumerNo : "");
    setValue("zoneKey", _res?.zoneKey);
    setValue("wardKey", _res?.wardKey);
    setValue("consumerName", _res?.consumerName ? _res?.consumerName : "-");
    setValue(
      "consumerAddress",
      _res?.consumerAddress ? _res?.consumerAddress : "-"
    );
    setValue(
      "consumerNameMr",
      _res?.consumerNameMr ? _res?.consumerNameMr : "-"
    );
    setValue(
      "consumerAddressMr",
      _res?.consumerAddressMr ? _res?.consumerAddressMr : "-"
    );
    setValue("pinCode", _res?.pinCode ? _res?.pinCode : "-");
    setValue(
      "consumptionTypeKey",
      _res?.consumptionTypeKey ? _res?.consumptionTypeKey : "-"
    );
    setValue("loadTypeKey", _res?.loadTypeKey ? _res?.loadTypeKey : "-");
    setValue("phaseKey", _res?.phaseKey ? _res?.phaseKey : "-");
    setValue("slabTypeKey", _res?.slabTypeKey ? _res?.slabTypeKey : "-");
    setValue("usageTypeKey", _res?.usageTypeKey ? _res?.usageTypeKey : "-");
    setValue(
      "msedclCategoryKey",
      _res?.msedclCategoryKey ? _res?.msedclCategoryKey : "-"
    );
    setValue(
      "msedclDivisionKey",
      _res?.msedclDivisionKey ? _res?.msedclDivisionKey : "-"
    );
    setValue(
      "billingUnitKey",
      _res?.billingUnitKey ? _res?.billingUnitKey : "-"
    );
    setValue(
      "subDivisionKey",
      _res?.subDivisionKey ? _res?.subDivisionKey : "-"
    );
    setValue(
      "departmentCategoryKey",
      _res?.departmentCategoryKey ? _res?.departmentCategoryKey : "-"
    );
    setValue("transactionNo", _res?.transactionNo ? _res?.transactionNo : "-");

    setValue("meterNo", _res?.meterNo ? _res?.meterNo : "");
    setValue("vanNo", _res?.vanNo ? _res?.vanNo : "");
    setValue(
      "multiplyingFactor",
      _res?.multiplyingFactor ? _res?.multiplyingFactor : ""
    );
    setValue(
      "billingCycleKey",
      _res?.billingCycleKey ? _res?.billingCycleKey : ""
    );
    setValue(
      "meterConnectionDate",
      _res?.meterConnectionDate ? _res?.meterConnectionDate : ""
    );
    setValue(
      "meterReadingDate",
      _res?.meterReadingDate ? _res?.meterReadingDate : ""
    );
    setValue("departmentKey", _res?.departmentKey);
    setValue(
      "meterStatusKey",
      _res?.meterStatusKey ? _res?.meterStatusKey : ""
    );
    setValue("juniorEnggKey", _res?.juniorEnggKey ? _res?.juniorEnggKey : "");
    setValue("dyEngineerKey", _res?.dyEngineerKey ? _res?.dyEngineerKey : "");
    setValue("exEngineerKey", _res?.exEngineerKey ? _res?.exEngineerKey : "");
    setValue(
      "accountOfficerKey",
      _res?.accountOfficerKey ? _res?.accountOfficerKey : ""
    );
    setValue(
      "sanctionedLoad",
      _res?.sanctionedLoad ? _res?.sanctionedLoad : ""
    );
    setValue(
      "sanctionedDemand",
      _res?.sanctionedDemand ? _res?.sanctionedDemand : ""
    );
    setValue("connectedLoad", _res?.connectedLoad ? _res?.connectedLoad : "");
    setValue(
      "contractDemand",
      _res?.contractDemand ? _res?.contractDemand : ""
    );
    setValue("capacityKey", _res?.capacityKey ? _res?.capacityKey : "");
    setValue("fromDiscount", _res?.fromDiscount ? _res?.fromDiscount : "");
    setValue("email", _res?.email ? _res?.email : "");
    setValue("mobileNo", _res?.mobileNo ? _res?.mobileNo : "");
    setValue(
      "previousReading",
      _res?.previousReading ? _res?.previousReading : ""
    );
    setValue(
      "newMeterInitialReading",
      _res?.newMeterInitialReading ? _res?.newMeterInitialReading : ""
    );
    setValue(
      "currentReading",
      _res?.currentReading ? _res?.currentReading : ""
    );

    if (_res?.transactionDocumentsList != undefined) {
      setAdditionalFiles(
        _res?.transactionDocumentsList?.map((each, i) => {
          return {
            id: each?.id,
            srNo: i + 1,
            fileName: showFileName(each?.documentPath),
            documentType: each?.documentType,
            activeFlag: each?.activeFlag,
            documentPath: each?.documentPath,
          };
        })
      );

      setDeletedFiles(
        _res?.transactionDocumentsList?.map((each, i) => {
          return {
            id: each?.id,
            srNo: i + 1,
            fileName: showFileName(each?.documentPath),
            documentType: each?.documentType,
            activeFlag: each?.activeFlag,
            documentPath: each?.documentPath,
          };
        })
      );
    }
  }, [editData, language]);

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    let fileNm = fileNamee?.length > 0 && fileNamee[1]?.split(".");

    return fileNm?.length > 0 && fileNm[0];
  }

  const deleteById = (value, _activeFlag) => {
    sweetAlert({
      title: language === "en" ? "Delete?" : "हटवा?",
      text:
        language === "en"
          ? "Are you sure you want to delete the file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      buttons: [
        language == "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((result) => {
      if (result) {
        const deleteArr = finalFiles.map((obj) => {
          if (obj.id == value) {
            return {
              ...obj,
              activeFlag: "N",
            };
          } else {
            return {
              ...obj,
            };
          }
        });
        setAdditionalFiles(deleteArr);
        sweetAlert(
          language === "en"
            ? "File Deleted Successfully!"
            : "फाइल यशस्वीरित्या हटवली!",
          { icon: "success" },
          { button: language === "en" ? "Ok" : "ठीक आहे" }
        );
      }
    });
  };

  useEffect(() => {
    getDepartment();
    getZone();
    getConsumptionType();
    getLoadType();
    getPhaseType();
    getSlabType();
    getMeterStatus();
    getBillingCycle();
    getUsageType();
    getMsedclCategory();
    getMsedclDivision();
    getBillingDivisionAndUnit();
    getSubDivision();
    getDepartmentCategory();
    getAllRoleOfUser();
    getEquipementCapacity();
  }, []);

  // get Equipement Capacity
  const getEquipementCapacity = () => {
    axios
      .get(`${urls.EBPSURL}/mstLoadEquipmentCapacity/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setEquipementCapacityDropdown(res.data.mstLoadEquipmentCapacityList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAllRoleOfUser = () => {
    axios
      .get(`${urls.CFCURL}/master/mstRole/getAll`, { headers: headers })
      .then((res) => {
        let roles = res.data.mstRole;
        let userRole = roles.filter(
          (each) =>
            each.name == "JUNIOR_ENGINEER" ||
            each.name == "DEPUTY_ENGINEER" ||
            each.name == "EXECUTIVE_ENGINEER" ||
            each.name == "ACCOUNTANT"
        );

        userRole.map((obj) => {
          axios
            .get(`${urls.CFCURL}/master/user/getUserByRole?roleId=${obj.id}`, {
              headers: headers,
            })
            .then((res) => {
              if (obj.name == "JUNIOR_ENGINEER") {
                setJuniorEngineerDropDown(res.data.user);
              }
              if (obj.name == "DEPUTY_ENGINEER") {
                setDeputyEngineerDropDown(res.data.user);
              }
              if (obj.name == "EXECUTIVE_ENGINEER") {
                setExecutiveEngineerDropDown(res.data.user);
              }
              if (obj.name == "ACCOUNTANT") {
                setAccountantDropDown(res.data.user);
              }
            })
            .catch((err) => {
              cfcErrorCatchMethod(err, true);
            });
        });

        setRoles(userRole);
      }).catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
    // .catch((err) => {
    //   catchMethod(err);
    // });
  };
  // get Ward Name
  const getZoneWiseWard = (deptId, zoneId) => {
    if (deptId && zoneId) {
      axios
        .get(
          `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`,
          {
            params: {
              departmentId: deptId,
              zoneId: zoneId,
            },
            headers: headers,
          }
        )
        .then((res) => {
          setWard(res.data);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, true);
        });
    }
  };

  // get Meter Status
  const getMeterStatus = () => {
    axios
      .get(`${urls.EBPSURL}/mstMeterStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setMeterStatus(res.data.mstMeterStatusList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Billing Cycle
  const getBillingCycle = () => {
    axios
      .get(`${urls.EBPSURL}/mstBillingCycle/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstBillingCycleList;
        setBillingCycle(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Department Name
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setDepartment(res.data.department);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Zone Name
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setZone(res.data.zone);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Consumption Type
  const getConsumptionType = () => {
    axios
      .get(`${urls.EBPSURL}/mstConsumptionType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setConsumptionType(res.data.mstConsumptionTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Load Type
  const getLoadType = () => {
    axios
      .get(`${urls.EBPSURL}/mstLoadType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setLoadType(res.data.mstLoadTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Phase Type
  const getPhaseType = () => {
    axios
      .get(`${urls.EBPSURL}/mstPhaseType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setPhaseType(res.data.mstPhaseTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Slab Type
  const getSlabType = () => {
    axios
      .get(`${urls.EBPSURL}/mstSlabType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setSlabType(res.data.mstSlabTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Usage Type
  const getUsageType = () => {
    axios
      .get(`${urls.EBPSURL}/mstEbUsageType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setUsageType(res.data.mstEbUsageTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Msedcl Division
  const getMsedclDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstDivision/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setMsedclDivision(res.data.mstDivisionDao);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Msedcl Category
  const getMsedclCategory = () => {
    axios
      .get(`${urls.EBPSURL}/mstMsedclCategory/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setMsedclCategory(res.data.mstMsedclCategoryList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Billing Division And Unit
  const getBillingDivisionAndUnit = () => {
    axios
      .get(`${urls.EBPSURL}/mstBillingUnit/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstBillingUnitList;
        setBillingDivisionAndUnit(
          temp.map((each) => {
            return {
              id: each.id,
              billingDivisionAndUnit: `${each.divisionName}/${each.billingUnit}`,
              billingDivisionAndUnitMr: `${each.divisionNameMr}/${each.billingUnit}`,
            };
          })
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setSubDivision(res.data.mstSubDivisionList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Department Category
  const getDepartmentCategory = () => {
    axios
      .get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setDepartmentCategory(res.data.mstDepartmentCategoryList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (router.query.id) {
      getNewConnectionsData(router.query.id);
    }
  }, [router.query.id]);

  // Get Table - Data
  const getNewConnectionsData = (id) => {
    setLoading(true);
    axios
      .get(`${urls.EBPSURL}/trnNewConnectionEntry/getById?id=${id}`, {
        headers: headers,
      })
      .then((r) => {
        setLoading(false);
        let result = r.data;
        setEditData(result);
      })
      .catch((err) => { setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const onSubmitForm = (formData) => {
    setLoading(true);
    let _formData = { ...editData, ...formData };

    // Save - DB
    let _body = {
      ..._formData,
      transactionDocumentsList: finalFiles,
      activeFlag: _formData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, _body, {
          headers: headers,
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            sweetAlert(
              language === "en" ? "Updated!" : "अपडेट केले !",
              language === "en"
                ? `Connection ${editData?.id} Updated successfully !`
                : `कनेक्शन ${editData?.id} यशस्वीरित्या अपडेट केले`,
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            router.push(
              "/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry"
            );
          }
        })
        .catch((err) => { setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const generateDemandLetter = () => {
    setGenerateDemandLetterFlag(false);
    handleOpen();
  };

  // Exit Button
  const handleExitButton = () => {
    reset({
      ...resetValuesForClear,
      id: null,
    });
    setButtonInputState(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    router.push(
      `/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry`
    );
  };

  // cancell Button
  const handleClearButton = () => {
    setDeletedFiles([]);
    reset({
      ...resetValuesForClear,
      id: id ? id : null,
    });
  };

  // Reset Values Cancell
  const resetValuesForClear = {
    consumerNo: "",
    consumerName: "",
    consumerAddress: "",
    consumerNameMr: "",
    consumerAddressMr: "",
    mobileNo: "",
    email: "",
    pinCode: "",
    zoneKey: "",
    wardKey: "",
    departmentKey: "",
    consumptionTypeKey: "",
    loadTypeKey: "",
    phaseKey: "",
    slabTypeKey: "",
    usageTypeKey: "",
    msedclCategoryKey: "",
    billingUnitKey: "",
    subDivisionKey: "",
    departmentCategoryKey: "",
    meterNo: "",
    meterConnectionDate: null,
    newMeterInitialReading: "",
    meterReadingDate: null,
    sanctionedDemand: "",
    sanctionedLoad: "",
    connectedLoad: "",
    contractDemand: "",
    meterStatusKey: "",
    capacityKey: "",
    vanNo: "",
    msedclDivisionKey: "",
    billingCycleKey: "",
    juniorEnggKey: "",
    dyEngineerKey: "",
    exEngineerKey: "",
    accountOfficerKey: "",
    transactionDocumentsList: [
      {
        documentPath: "",
        mediaKey: "",
        mediaType: "",
        remark: "",
      },
    ],
  };

  // Reset Values Exit
  const resetValuesExit = {
    billingCycle: "",
    billingCycleMr: "",
    id: null,
  };

  // file attache column
  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "documentType",
      flex: 1,
    },
    // language == "en"
    // ? {
    //     headerName: "Uploaded By",
    //     field: "attachedNameEn",
    //     flex: 2,
    //   }
    // : {
    //     headerName: "द्वारे अपलोड केले",
    //     field: "attachedNameMr",
    //     flex: 2,
    //   },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              // onClick={() => {
              //   window.open(
              //     `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
              //     "_blank"
              //   );
              // }}
              onClick={async () => {
                getFilePreview(record.row.filePath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
            {record.row.activeFlag === "Y" && (
              <IconButton
                color="primary"
                onClick={() => deleteById(record.row.id, "N")}
              >
                <DeleteIcon style={{ color: "red", fontSize: 30 }} />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // Row

  return loading ? (
    <CommonLoader />
  ) : (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      <Box>
        <Grid
          container
          className={commonStyles.title}
          style={{ marginBottom: "8px" }}
        >
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
              <FormattedLabel id="editDemandGeneration" />
            </h3>
          </Grid>
        </Grid>
      </Box>
      <FormProvider {...methods}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              {/* Firts Row */}
              <>
                <Accordion sx={{ padding: "10px" }} defaultExpanded>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="consumerInformation" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {/* Department Name */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.departmentKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="deptName" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("departmentKey")}
                                label={<FormattedLabel id="deptName" />}
                              >
                                {department &&
                                  department.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.department
                                        : type.departmentMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="departmentKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.departmentKey
                              ? errors.departmentKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Zone */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.zoneKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="zone" required />}
                          </InputLabel>
                          <Controller
                            name="zoneKey"
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  getZoneWiseWard(
                                    watch("departmentKey"),
                                    value
                                  );
                                }}
                                label={<FormattedLabel id="zone" />}
                              >
                                {zone &&
                                  zone.map((each, index) => (
                                    <MenuItem key={index} value={each.id}>
                                      {language == "en"
                                        ? each.zoneName
                                        : each.zoneNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zoneKey ? errors.zoneKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Ward Name */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.wardKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="ward" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("wardKey")}
                                label={<FormattedLabel id="ward" />}
                              >
                                {ward &&
                                  ward.map((wa, index) => (
                                    <MenuItem key={index} value={wa.id}>
                                      {language == "en"
                                        ? wa.wardName
                                        : wa.wardNameMr}
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

                      {/* Consumption Type */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.consumptionTypeKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="consumptionType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("consumptionTypeKey")}
                                label={<FormattedLabel id="consumptionType" />}
                              >
                                {consumptionType &&
                                  consumptionType.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.consumptionType
                                        : type.consumptionTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="consumptionTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.consumptionTypeKey
                              ? errors.consumptionTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* usage Type */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.usageTypeKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="ebUsageType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("usageTypeKey")}
                                label={<FormattedLabel id="ebUsageType" />}
                              >
                                {usageType &&
                                  usageType.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.usageType
                                        : type.usageTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="usageTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.usageTypeKey
                              ? errors.usageTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* slab Type */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.slabTypeKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="slabType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("slabTypeKey")}
                                label={<FormattedLabel id="slabType" />}
                              >
                                {slabType &&
                                  slabType.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.slabType
                                        : type.slabTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="slabTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.slabTypeKey
                              ? errors.slabTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* Consumer Number */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={<FormattedLabel id="consumerNo" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("consumerNo")}
                          error={!!errors.consumerNo}
                          helperText={
                            errors?.consumerNo
                              ? errors.consumerNo.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("consumerNo") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* Consumer Name */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Transliteration
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          _key={"consumerName"}
                          labelName={"consumerNameEn"}
                          fieldName={"consumerName"}
                          updateFieldName={"consumerNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="consumerNameEn" required />
                          }
                          error={!!errors.consumerName}
                          helperText={
                            errors?.consumerName
                              ? errors.consumerName.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("consumerName") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Consumer Name Mr */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Transliteration
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          _key={"consumerNameMr"}
                          labelName={"consumerNameMr"}
                          fieldName={"consumerNameMr"}
                          updateFieldName={"consumerName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={
                            <FormattedLabel id="consumerNameMr" required />
                          }
                          error={!!errors.consumerNameMr}
                          helperText={
                            errors?.consumerNameMr
                              ? errors.consumerNameMr.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("consumerNameMr") ? true : false,
                          }}
                        />
                      </Grid>

                      {/*Consumer Address */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Transliteration
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          _key={"consumerAddress"}
                          labelName={"consumerAddressEn"}
                          fieldName={"consumerAddress"}
                          updateFieldName={"consumerAddressMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="consumerAddressEn" required />
                          }
                          error={!!errors.consumerAddress}
                          helperText={
                            errors?.consumerAddress
                              ? errors.consumerAddress.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("consumerAddress") ? true : false,
                          }}
                        />
                      </Grid>

                      {/*Consumer Address Mr */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Transliteration
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          _key={"consumerAddressMr"}
                          labelName={"consumerAddressMr"}
                          fieldName={"consumerAddressMr"}
                          updateFieldName={"consumerAddress"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={
                            <FormattedLabel id="consumerAddressMr" required />
                          }
                          error={!!errors.consumerAddressMr}
                          helperText={
                            errors?.consumerAddressMr
                              ? errors.consumerAddressMr.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("consumerAddressMr") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Mobile Number */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={<FormattedLabel id="mobile" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("mobileNo")}
                          error={!!errors.mobileNo}
                          helperText={
                            errors?.mobileNo ? errors.mobileNo.message : null
                          }
                          inputProps={{ maxLength: 10, minLength: 10 }}
                          InputLabelProps={{
                            shrink: watch("mobileNo") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Mail Id */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={<FormattedLabel id="email" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("email")}
                          error={!!errors.email}
                          helperText={
                            errors?.email ? errors.email.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("email") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Pin Code */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={<FormattedLabel id="pincode" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("pinCode")}
                          error={!!errors.pinCode}
                          helperText={
                            errors?.pinCode ? errors.pinCode.message : null
                          }
                          inputProps={{ maxLength: 6 }}
                          InputLabelProps={{
                            shrink: watch("pinCode") ? true : false,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>

              <>
                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="meterDetails" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {/* Department Category */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.departmentCategoryKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {
                              <FormattedLabel
                                id="departmentCategory"
                                required
                              />
                            }
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("departmentCategoryKey")}
                                label={
                                  <FormattedLabel id="departmentCategory" />
                                }
                              >
                                {departmentCategory &&
                                  departmentCategory.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.departmentCategory
                                        : type.departmentCategoryMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="departmentCategoryKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.departmentCategoryKey
                              ? errors.departmentCategoryKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* MSEDCL Category */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.msedclCategoryKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="msedclCategory" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("msedclCategoryKey")}
                                label={<FormattedLabel id="msedclCategory" />}
                              >
                                {msedclCategory &&
                                  msedclCategory.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.msedclCategory
                                        : type.msedclCategoryMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="msedclCategoryKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.msedclCategoryKey
                              ? errors.msedclCategoryKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/*Meter No */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={<FormattedLabel id="meterNo" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("meterNo")}
                          error={!!errors.meterNo}
                          helperText={
                            errors?.meterNo ? errors.meterNo.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("meterNo") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Meter Connection Date*/}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* Meter Connection Date in English */}
                        <FormControl
                          error={!!errors.meterConnectionDate}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <Controller
                            control={control}
                            name="meterConnectionDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  inputFormat="dd/MM/yyyy"
                                  disableFuture
                                  label={
                                    <FormattedLabel id="meterConnectionDate" />
                                  }
                                  // @ts-ignore
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
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
                            {errors?.meterConnectionDate
                              ? errors.meterConnectionDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/*Initial Meter Reading */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="initialMeterReading" required />
                          }
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("newMeterInitialReading")}
                          error={!!errors.newMeterInitialReading}
                          helperText={
                            errors?.newMeterInitialReading
                              ? errors.newMeterInitialReading.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("newMeterInitialReading")
                              ? true
                              : false,
                          }}
                        />
                      </Grid>

                      {/* Meter Reading Date*/}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* Meter Connection Date in English */}
                        <FormControl
                          error={!!errors.meterReadingDate}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <Controller
                            control={control}
                            name="meterReadingDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  inputFormat="dd/MM/yyyy"
                                  disableFuture
                                  label={
                                    <FormattedLabel id="meterReadingDate" />
                                  }
                                  // @ts-ignore
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
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
                            {errors?.meterReadingDate
                              ? errors.meterReadingDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Meter Status */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.meterStatusKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="meterStatus" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("meterStatusKey")}
                                label={<FormattedLabel id="meterStatus" />}
                              >
                                {meterStatus &&
                                  meterStatus.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.meterStatus
                                        : type.meterStatusMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="meterStatusKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.meterStatusKey
                              ? errors.meterStatusKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Load Type */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.loadTypeKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="loadType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("loadTypeKey")}
                                label={<FormattedLabel id="loadType" />}
                              >
                                {loadType &&
                                  loadType.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.loadType
                                        : type.loadTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="loadTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.loadTypeKey
                              ? errors.loadTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* phase Type */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.phaseKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="phaseType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("phaseKey")}
                                label={<FormattedLabel id="phaseType" />}
                              >
                                {phaseType &&
                                  phaseType.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.phaseType
                                        : type.phaseTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="phaseKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.phaseKey ? errors.phaseKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Sanctioned Load */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="sanctionedLoad" required />
                          }
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("sanctionedLoad")}
                          error={!!errors.sanctionedLoad}
                          helperText={
                            errors?.sanctionedLoad
                              ? errors.sanctionedLoad.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("sanctionedLoad") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Sanctioned Demand */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="sanctionedDemand" required />
                          }
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("sanctionedDemand")}
                          error={!!errors.sanctionedDemand}
                          helperText={
                            errors?.sanctionedDemand
                              ? errors.sanctionedDemand.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("sanctionedDemand") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Connected Load */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={<FormattedLabel id="connectedLoad" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("connectedLoad")}
                          error={!!errors.connectedLoad}
                          helperText={
                            errors?.connectedLoad
                              ? errors.connectedLoad.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("connectedLoad") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Contract Demand */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="contractDemand" required />
                          }
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("contractDemand")}
                          error={!!errors.contractDemand}
                          helperText={
                            errors?.contractDemand
                              ? errors.contractDemand.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("contractDemand") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Equipement Capacity */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.capacityKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {
                              <FormattedLabel
                                id="LoadEquipmentCapacity"
                                required
                              />
                            }
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                {...register("capacityKey")}
                                label={
                                  <FormattedLabel id="LoadEquipmentCapacity" />
                                }
                              >
                                {equipementCapacityDropdown &&
                                  equipementCapacityDropdown.map(
                                    (type, index) => (
                                      <MenuItem key={index} value={type.id}>
                                        {language == "en"
                                          ? type.loadEquipmentCapacity
                                          : type.loadEquipmentCapacityMr}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="capacityKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.capacityKey
                              ? errors.capacityKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>

              <>
                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="billingDetails" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {/* MSEDCL Division */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.msedclDivisionKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="msedclDivision" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("msedclDivisionKey")}
                                label={<FormattedLabel id="msedclDivision" />}
                              >
                                {msedclDivision &&
                                  msedclDivision.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.division
                                        : type.divisionMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="msedclDivisionKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.msedclDivisionKey
                              ? errors.msedclDivisionKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* SubDivision */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.subDivisionKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="subDivision" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("subDivisionKey")}
                                label={<FormattedLabel id="subDivision" />}
                              >
                                {subDivision &&
                                  subDivision.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.subDivision
                                        : type.subDivisionMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="subDivisionKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.subDivisionKey
                              ? errors.subDivisionKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/*van No */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label={<FormattedLabel id="vanNo" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("vanNo")}
                          error={!!errors.vanNo}
                          helperText={
                            errors?.vanNo ? errors.vanNo.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("vanNo") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Billing Division/Unit */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.billingUnitKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {
                              <FormattedLabel
                                id="billingUnitAndDivision"
                                required
                              />
                            }
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("billingUnitKey")}
                                label={
                                  <FormattedLabel id="billingUnitAndDivision" />
                                }
                              >
                                {billingDivisionAndUnit &&
                                  billingDivisionAndUnit.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.billingDivisionAndUnit
                                        : type.billingDivisionAndUnitMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="billingUnitKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.billingUnitKey
                              ? errors.billingUnitKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Billing Cycle */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.billingCycleKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="billingCycle" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("billingCycleKey")}
                                label={<FormattedLabel id="billingCycle" />}
                              >
                                {billingCycle &&
                                  billingCycle.map((cycle, index) => (
                                    <MenuItem key={index} value={cycle.id}>
                                      {language == "en"
                                        ? cycle.billingCycle
                                        : cycle.billingCycleMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="billingCycleKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.billingCycleKey
                              ? errors.billingCycleKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Junior Engineer */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.juniorEnggKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="juniorEngineer" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("juniorEnggKey")}
                                label={<FormattedLabel id="juniorEngineer" />}
                              >
                                {juniorEngineerDropDown &&
                                  juniorEngineerDropDown.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? `${type.firstNameEn} ${type.middleNameEn} ${type.lastNameEn}`
                                        : `${type.firstNameMr} ${type.middleNameMr} ${type.lastNameMr}`}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="juniorEnggKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.juniorEnggKey
                              ? errors.juniorEnggKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Deputy Engineer */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.dyEngineerKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="deputyEngineer" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("dyEngineerKey")}
                                label={<FormattedLabel id="deputyEngineer" />}
                              >
                                {deputyEngineerDropDown &&
                                  deputyEngineerDropDown.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? `${type.firstNameEn} ${type.middleNameEn} ${type.lastNameEn}`
                                        : `${type.firstNameMr} ${type.middleNameMr} ${type.lastNameMr}`}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="dyEngineerKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.dyEngineerKey
                              ? errors.dyEngineerKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Executive Engineer */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.exEngineerKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="executiveEngineer" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("exEngineerKey")}
                                label={
                                  <FormattedLabel id="executiveEngineer" />
                                }
                              >
                                {executiveEngineerDropDown &&
                                  executiveEngineerDropDown.map(
                                    (type, index) => (
                                      <MenuItem key={index} value={type.id}>
                                        {language == "en"
                                          ? `${type.firstNameEn} ${type.middleNameEn} ${type.lastNameEn}`
                                          : `${type.firstNameMr} ${type.middleNameMr} ${type.lastNameMr}`}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="exEngineerKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.exEngineerKey
                              ? errors.exEngineerKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* accountant */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.accountOfficerKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="accountant" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                {...register("accountOfficerKey")}
                                label={<FormattedLabel id="accountant" />}
                              >
                                {accountantDropDown &&
                                  accountantDropDown.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? `${type.firstNameEn} ${type.middleNameEn} ${type.lastNameEn}`
                                        : `${type.firstNameMr} ${type.middleNameMr} ${type.lastNameMr}`}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="accountOfficerKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.accountOfficerKey
                              ? errors.accountOfficerKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>

              <>
                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="attachRequiredDocumemts" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {/* Attachement */}
                      <Grid item xs={12}>
                        <FileTable
                          appName="EBP" //Module Name
                          serviceName="EBP-NewConnection" //Transaction Name
                          fileName={attachedFile} //State to attach file
                          filePath={setAttachedFile} // File state upadtion function
                          newFilesFn={setAdditionalFiles} // File data function
                          columns={_columns} //columns for the table
                          rows={deletedFiles} //state to be displayed in table
                          // uploading={setUploading}
                          getValues={getValues}
                          pageMode={router.query.pageMode}
                          authorizedToUpload={authorizedToUpload}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>
              {/* Save ad Draft */}

              <Grid container sx={{ marginTop: "20px" }}>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <Button variant="contained" type="Submit" color="success">
                    {<FormattedLabel id="update" />}
                  </Button>
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <Button onClick={handleClearButton} variant="contained">
                    {<FormattedLabel id="clear" />}
                  </Button>
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleExitButton}
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Slide>
        )}
      </FormProvider>
    </Paper>
  );
};

export default Index;
