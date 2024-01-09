import React, { useEffect, useState, useRef } from "react";
import router from "next/router";
import theme from "../../../../../theme";
import axios from "axios";
import {
  Paper,
  Button,
  TextField,
  ThemeProvider,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  Radio,
  IconButton,
  FormHelperText,
  Modal,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { ExitToApp, Save } from "@mui/icons-material";
import urls from "../../../../../URLS/urls";
import { manageStatus } from "../../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import commonRoleId from "../../../../../components/SlumBillingManagementSystem/FileUpload/RoleId/commonRole";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
import {
  DecryptData,
  EncryptData,
} from "../../../../../components/common/EncryptDecrypt";
import ScheduleSiteVisitPage from "../scheduleSiteVisit/index";
import ViewPhotopassDetails from "../viewPhotopassDetails";
import Photopass from "../generateDocuments/photopass";
const Index = () => {
  const {
    watch,
    setValue,
    getValues,
    register,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [isOverduePayment, setIsOverduePayment] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [statusAll, setStatus] = useState([]);
  const [hutData, setHutData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [slumData, setSlumData] = useState([]);
  const [villageData, setVillageData] = useState([]);
  const [relationDropDown, setRelationDropDown] = useState([]);
  const [docList, setDocList] = useState([]);
  const [requiredUploadDoc, setRequiredUploadDoc] = useState(null);
  const [requiredUploadDoc1, setRequiredUploadDoc1] = useState(null);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const [ownership, setOwnership] = useState({});
  const [usageType, setUsageType] = useState({});
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [villageName, setVillageName] = useState(null);
  const [slumName, setSlumName] = useState(null);
  const handleClose = () => setOpen(false);
  const [usageData, setUsageTypeData] = useState([]);
  const [ownershipData, setOwnershipData] = useState([]);
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

  useEffect(() => {
    getOwnerShipData();
    getUsageType();
  }, []);

  const getUsageType = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbUsageType/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSbUsageTypeList;
        setUsageTypeData(result);
      })
      .catch((err) => {
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
        setOwnershipData(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };
  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });
  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
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

  const revertToCitizen = () => {
    const payload = {
      ...dataSource,
      clerkApprovalRemark: watch("clerkApprovalRemark"),
      isApproved: false,
      isComplete: false,
    };
    const tempData = axios
      .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, payload, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert(
            language === "en" ? "Revert!" : "पूर्वस्थितीवर येणे!",
            language == "en"
              ? `Photopass against ${dataSource.applicationNo} reverted successfully !`
              : `${dataSource.applicationNo} फोटोपास यशस्वीरित्या परत केले!`,
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          ).then((will) => {
            if (will) {
              router.push(
                "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
              );
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getIcardPhoto = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        setPhoto(r?.data?.fileName);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (router.query.id) {
      getPhotopassDataById(router.query.id);
    }
  }, [router.query.id]);

  useEffect(() => {
    getRelationDetails();
    getSlumData();
    getVillageData();
    getAreaData();
    getAllStatus();
    getTitleData();
  }, []);
  // Check some condition for hide and show
  const checkSomeCondition = () => {
    return (
      (dataSource?.status == 2 &&
        (watch("isRejected") === false ||
          watch("isRejected") === undefined ||
          watch("isRejected") === null)||(dataSource?.status == 16&&authority &&
          authority.find((val) => val != commonRoleId.ROLE_CLERK))) ||
      (dataSource?.status == 26 &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_CLERK))
    );
  };
  const getPhotopassDataById = (id) => {
    setIsLoading(true);
    if (id) {
      axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
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
    if (dataSource != null) {
      getRequiredDocs();
    }
  }, [dataSource]);

  const getRequiredDocs = () => {
    axios
      .get(
        `${urls.CFCURL}/master/documentMaster/getDocumentByService?serviceId=120`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let temp = r.data.documentMaster;
        setRequiredUploadDoc(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (dataSource != null && titleDropDown && relationDropDown) {
      setDataOnForm();
    }
  }, [
    dataSource,
    titleDropDown,
    relationDropDown,
    language,
    areaData,
    slumData,
  ]);

  const getAllStatus = () => {
    axios
      .get(`${urls.SLUMURL}/mstStatus/getAll`, {
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

  const setDataOnForm = () => {
    let res = dataSource;
    const extractedData = res?.transactionDocumentsList?.map(
      ({ id, documentKey, documentType, documentPath, remark }) => ({
        id,
        documentKey,
        documentType,
        documentPath,
        remark,
      })
    );
    setRequiredUploadDoc1(extractedData);
    setValue("hutNo", res.hutNo);
    setValue("applicationNo", res ? res.applicationNo : "-");
    setValue("currentStatus", manageStatus(res?.status, language, statusAll));
    setValue("areaKey", res?.areaKey);
    let Slumres = slumData && slumData.find((obj) => obj.id == res?.slumKey);
    setValue("slumKey", res?.slumKey);
    setSlumName(Slumres?.slumNameMr);
    setValue("applicantPhoto", res?.applicantPhoto);
    setValue("applicantTitle", res?.applicantTitle);
    setValue(
      "applicantFirstName",
      !res?.applicantFirstName ? "-" : res?.applicantFirstName
    );
    setValue(
      "applicantMiddleName",
      !res?.applicantMiddleName ? "-" : res?.applicantMiddleName
    );
    setValue(
      "applicantLastName",
      !res?.applicantLastName ? "-" : res?.applicantLastName
    );
    setValue(
      "applicantFirstNameMr",
      !res?.applicantFirstNameMr ? "-" : res?.applicantFirstNameMr
    );
    setValue(
      "applicantMiddleNameMr",
      !res?.applicantMiddleNameMr ? "-" : res?.applicantMiddleNameMr
    );
    setValue(
      "applicantLastNameMr",
      !res?.applicantLastNameMr ? "-" : res?.applicantLastNameMr
    );
    setValue(
      "applicantMobileNo",
      res?.applicantMobileNo ? res?.applicantMobileNo : "-"
    );
    setValue(
      "applicantAadharNo",
      res?.applicantAadharNo ? res?.applicantAadharNo : "-"
    );
    setValue(
      "applicantEmailId",
      res?.applicantEmailId ? res?.applicantEmailId : "-"
    );
    setValue("applicantAge", res?.applicantAge ? res?.applicantAge : "-");
    setValue(
      "applicantOccupation",
      res?.applicantOccupation ? res?.applicantOccupation : "-"
    );
    setValue("applicantRelationKey", res?.applicantRelationKey);
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    setValue("outstandingTax", res ? res?.outstandingTax : "-");
    setValue("coApplicantTitle", res?.coApplicantTitle);
    setValue(
      "spouseFirstName",
      !res?.coApplicantFirstName
        ? "-"
        : language == "en"
        ? res?.coApplicantFirstName
        : res?.coApplicantFirstNameMr
    );
    setValue(
      "spouseMiddleName",
      !res?.coApplicantMiddleName
        ? "-"
        : language == "en"
        ? res?.coApplicantMiddleName
        : res?.coApplicantMiddleNameMr
    );
    setValue(
      "spouseLastName",
      !res?.coApplicantLastName
        ? "-"
        : language == "en"
        ? res?.coApplicantLastName
        : res?.coApplicantLastNameMr
    );
    setValue(
      "spouseMobileNo",
      res?.coApplicantMobileNo ? res?.coApplicantMobileNo : "-"
    );
    setValue(
      "spouseAadharNo",
      res?.coApplicantAadharNo ? res?.coApplicantAadharNo : "-"
    );
    setValue(
      "spouseEmail",
      res?.coApplicantEmail ? res?.coApplicantEmail : "-"
    );
    setValue("spouseAge", res?.coApplicantAge ? res?.coApplicantAge : "-");
    setValue(
      "spouseOccupation",
      res?.coApplicantOccupation ? res?.coApplicantOccupation : "-"
    );

    let villageName =
      villageData && villageData.find((obj) => obj.id == res?.villageKey);

    setVillageName(villageName?.villageNameMr);
    setValue("villageKey", res?.villageKey);
    setValue(
      "spouseRelation",
      !res?.coApplicantRelationKey
        ? "-"
        : language == "en"
        ? relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.coApplicantRelationKey)
            ?.relation
        : relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.coApplicantRelationKey)
            ?.relationMr
    );
  };

  useEffect(() => {
    if (dataSource?.husbandWifeCombinedPhoto != null) {
      getIcardPhoto(dataSource?.husbandWifeCombinedPhoto);
    }
  }, [dataSource?.husbandWifeCombinedPhoto]);

  useEffect(() => {
    if (router.query.id) {
      setDocList(
        requiredUploadDoc1?.map((row, i) => ({
          srNo: i + 1,
          id: row.id,
          documentChecklistEn:
            requiredUploadDoc &&
            requiredUploadDoc.find((obj) => obj.id === row.documentKey)
              ?.documentChecklistEn,
          documentChecklistMr:
            requiredUploadDoc &&
            requiredUploadDoc.find((obj) => obj.id === row.documentKey)
              ?.documentChecklistMr,
          typeOfDocument: row.typeOfDocument,
          service: row.service,
          documentPath: row.documentPath,
          activeFlag: row.activeFlag,
          documentKey: row.documentKey,
          activeFlag: "Y",
          application: row.application,
        }))
      );
    } else {
      setDocList(
        requiredUploadDoc?.map((row, i) => ({
          srNo: i + 1,
          id: row.id,
          documentChecklistEn: row.documentChecklistEn,
          documentChecklistMr: row.documentChecklistMr,
          typeOfDocument: row.typeOfDocument,
          service: row.service,
          documentPath: row.documentPath,
          documentKey: row.documentKey,
          activeFlag: row.activeFlag,
          application: row.application,
        }))
      );
    }
  }, [requiredUploadDoc, requiredUploadDoc1]);

  const getTitleData = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.title;
        let res1 =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              titleEn: r.title,
              titleMr: r.titleMr,
            };
          });
        setTitleDropDown(res1);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (dataSource?.hutKey != null && dataSource?.hutKey != undefined) {
      getHutData(dataSource?.hutKey);
    }
  }, [dataSource?.hutNo]);

  const getHutData = (hutNo) => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${hutNo}`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data;
        setHutData(result);
        let res =
          ownershipData &&
          ownershipData?.find((obj) => obj.id == result?.ownershipKey);
        console.log("result", res);

        setOwnership(res.ownershipTypeMr);
        let res1 =
          usageData && usageData?.find((obj) => obj.id == result?.usageTypeKey);
        setUsageType(res1.usageTypeMr);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getRelationDetails = () => {
    axios
      .get(`${urls.SLUMURL}/mstRelation/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let temp = r.data.mstRelationDao;
        setRelationDropDown(
          temp?.map((row) => ({
            id: row.id,
            relation: row.relation,
            relationMr: row.relationMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getVillageData = () => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
        setVillageData(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };
  const getSlumData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSlumList;
        setSlumData(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };
  const getAreaData = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.area;
        setAreaData(result);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const attachFileColumns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",
      field: "documentChecklistMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="fileName" />,
      flex: 1,
    },
    {
      field: "attachedDoc1",
      headerName: <FormattedLabel id="attachment" />,
      width: 200,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.documentPath ? (
              <IconButton
                color="primary"
                onClick={() => {
                  getFilePreview(params?.row?.documentPath);
                }}
              >
                <VisibilityIcon />
              </IconButton>
            ) : (
              <FormattedLabel id="noFileFound" />
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      {isLoading && <CommonLoader />}
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
                }}
              >
                <FormattedLabel id="hutOwnerDetails" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={2} sx={{ padding: "1rem" }}>
          <Grid
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {photo ? (
              <img
                src={`data:image/png;base64,${photo}`}
                alt="अर्जदाराचा फोटो"
                height="150px"
                width="144px"
              />
            ) : (
              <h4>अर्जदाराचा फोटो</h4>
            )}
          </Grid>

          {/* Hut No */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="hutNo" />}
              variant="standard"
              value={watch("hutNo")}
              InputLabelProps={{
                shrink: watch("hutNo") ? true : false,
              }}
              error={!!error.hutNo}
              helperText={error?.hutNo ? error.hutNo.message : null}
            />
          </Grid>

          {/* Application No */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="applicationNo" />}
              variant="standard"
              value={watch("applicationNo")}
              InputLabelProps={{
                shrink: watch("applicationNo") ? true : false,
              }}
              error={!!error.applicationNo}
              helperText={
                error?.applicationNo ? error.applicationNo.message : null
              }
            />
          </Grid>

          {/* Current Status */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="currentStatus" />}
              variant="standard"
              value={watch("currentStatus")}
              InputLabelProps={{
                shrink: watch("currentStatus") ? true : false,
              }}
              error={!!error.currentStatus}
              helperText={
                error?.currentStatus ? error.currentStatus.message : null
              }
            />
          </Grid>

          {/* owner Title */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              variant="standard"
              error={!!error.applicantTitle}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="title" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled
                    sx={{ width: "100%" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="applicantTitle"
                  >
                    {titleDropDown &&
                      titleDropDown.map((value, index) => (
                        <MenuItem key={index} value={value.id}>
                          {language == "en" ? value.titleEn : value?.titleMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="applicantTitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.applicantTitle ? error.applicantTitle.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* firstName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="firstName" />}
              variant="standard"
              value={watch("applicantFirstName")}
              InputLabelProps={{
                shrink: watch("applicantFirstName") ? true : false,
              }}
              error={!!error.applicantFirstName}
              helperText={
                error?.applicantFirstName
                  ? error.applicantFirstName.message
                  : null
              }
            />
          </Grid>

          {/* firstName Marathi */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="firstNamemr" />}
              variant="standard"
              value={watch("applicantFirstNameMr")}
              InputLabelProps={{
                shrink: watch("applicantFirstNameMr") ? true : false,
              }}
              error={!!error.applicantFirstNameMr}
              helperText={
                error?.applicantFirstNameMr
                  ? error.applicantFirstNameMr.message
                  : null
              }
            />
          </Grid>

          {/* middleName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="middleName" />}
              variant="standard"
              value={watch("applicantMiddleName")}
              InputLabelProps={{
                shrink: watch("applicantMiddleName") ? true : false,
              }}
              error={!!error.applicantMiddleName}
              helperText={
                error?.applicantMiddleName
                  ? error.applicantMiddleName.message
                  : null
              }
            />
          </Grid>

          {/* middleName Marathi */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="middleNamemr" />}
              variant="standard"
              value={watch("applicantMiddleNameMr")}
              InputLabelProps={{
                shrink: watch("applicantMiddleNameMr") ? true : false,
              }}
              error={!!error.applicantMiddleNameMr}
              helperText={
                error?.applicantMiddleNameMr
                  ? error.applicantMiddleNameMr.message
                  : null
              }
            />
          </Grid>

          {/* lastName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="lastName" />}
              variant="standard"
              value={watch("applicantLastName")}
              InputLabelProps={{
                shrink: watch("applicantLastName") ? true : false,
              }}
              error={!!error.applicantLastName}
              helperText={
                error?.applicantLastName
                  ? error.applicantLastName.message
                  : null
              }
            />
          </Grid>

          {/* lastName Marathi */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="lastNamemr" />}
              variant="standard"
              value={watch("applicantLastNameMr")}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!error.applicantLastNameMr}
              helperText={
                error?.applicantLastNameMr
                  ? error.applicantLastNameMr.message
                  : null
              }
            />
          </Grid>

          {/* mobileNo */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="mobileNo" />}
              variant="standard"
              value={watch("applicantMobileNo")}
              InputLabelProps={{
                shrink: watch("applicantMobileNo") ? true : false,
              }}
              error={!!error.applicantMobileNo}
              helperText={
                error?.applicantMobileNo
                  ? error.applicantMobileNo.message
                  : null
              }
            />
          </Grid>

          {/* aadharNo */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="aadharNo" />}
              variant="standard"
              value={watch("applicantAadharNo")}
              InputLabelProps={{
                shrink: watch("applicantAadharNo") ? true : false,
              }}
              error={!!error.applicantAadharNo}
              helperText={
                error?.applicantAadharNo
                  ? error.applicantAadharNo.message
                  : null
              }
            />
          </Grid>

          {/* email */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="email" />}
              variant="standard"
              value={watch("applicantEmailId")}
              InputLabelProps={{
                shrink: watch("applicantEmailId") ? true : false,
              }}
              error={!!error.applicantEmailId}
              helperText={
                error?.applicantEmailId ? error.applicantEmailId.message : null
              }
            />
          </Grid>

          {/* age */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="age" />}
              variant="standard"
              value={watch("applicantAge")}
              InputLabelProps={{
                shrink: watch("applicantAge") ? true : false,
              }}
              error={!!error.applicantAge}
              helperText={
                error?.applicantAge ? error.applicantAge.message : null
              }
            />
          </Grid>

          {/* occupation */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="occupation" />}
              variant="standard"
              value={watch("applicantOccupation")}
              InputLabelProps={{
                shrink: watch("applicantOccupation") ? true : false,
              }}
              error={!!error.applicantOccupation}
              helperText={
                error?.applicantOccupation
                  ? error.applicantOccupation.message
                  : null
              }
            />
          </Grid>

          {/* relation  */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              variant="standard"
              error={!!error.applicantRelationKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="relation" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled
                    sx={{ width: "100%" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    {relationDropDown &&
                      relationDropDown.map((value, index) => (
                        <MenuItem key={index} value={value?.id}>
                          {language == "en"
                            ? value?.relation
                            : value?.relationMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="applicantRelationKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.applicantRelationKey
                  ? error.applicantRelationKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Slum Name */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              variant="standard"
              error={!!error.slumKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="slumName" />
              </InputLabel>
              <Controller
                disabled
                render={({ field }) => (
                  <Select
                    disabled
                    sx={{ width: "100%" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="slumKey"
                  >
                    {slumData &&
                      slumData.map((value, index) => (
                        <MenuItem key={index} value={value.id}>
                          {language == "en"
                            ? value.slumName
                            : value?.slumNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="slumKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.slumKey ? error.slumKey.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Area */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              variant="standard"
              error={!!error.areaKey}
            >
              <InputLabel
                id="demo-simple-select-standard-label"
                shrink={watch("areaKey") == null ? false : true}
              >
                <FormattedLabel id="area" />
              </InputLabel>
              <Controller
                disabled
                render={({ field }) => (
                  <Select
                    disabled
                    sx={{ width: "100%" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="areaKey"
                  >
                    {areaData &&
                      areaData.map((value, index) => (
                        <MenuItem key={index} value={value.id}>
                          {language == "en"
                            ? value.areaName
                            : value?.areaNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="areaKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.areaKey ? error.areaKey.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Village */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              variant="standard"
              error={!!error.villageKey}
            >
              <InputLabel
                id="demo-simple-select-standard-label"
                shrink={watch("villageKey") == null ? false : true}
              >
                <FormattedLabel id="village" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled
                    sx={{ width: "100%" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="villageKey"
                  >
                    {villageData &&
                      villageData.map((value, index) => (
                        <MenuItem key={index} value={value.id}>
                          {language == "en"
                            ? value.villageName
                            : value?.villageNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="villageKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.villageKey ? error.villageKey.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* pincode */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="pincode" />}
              variant="standard"
              value={watch("pincode")}
              InputLabelProps={{
                shrink: watch("pincode") ? true : false,
              }}
              error={!!error.pincode}
              helperText={error?.pincode ? error.pincode.message : null}
            />
          </Grid>

          {/* Lattitude */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="lattitude" />}
              variant="standard"
              value={watch("lattitude")}
              InputLabelProps={{
                shrink: watch("lattitude") ? true : false,
              }}
              error={!!error.lattitude}
              helperText={error?.lattitude ? error.lattitude.message : null}
            />
          </Grid>

          {/* Longitude */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="longitude" />}
              variant="standard"
              value={watch("longitude")}
              InputLabelProps={{
                shrink: watch("longitude") ? true : false,
              }}
              error={!!error.longitude}
              helperText={error?.longitude ? error.longitude.message : null}
            />
          </Grid>
        </Grid>
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={12}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FormattedLabel id="spouseDetails" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={2} sx={{ padding: "1rem" }}>
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              variant="standard"
              error={!!error.coApplicantTitle}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="title" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled
                    sx={{ width: "100%" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="coApplicantTitle"
                  >
                    {titleDropDown &&
                      titleDropDown.map((value, index) => (
                        <MenuItem key={index} value={value.id}>
                          {language == "en" ? value.titleEn : value?.titleMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="coApplicantTitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.coApplicantTitle
                  ? error.coApplicantTitle.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Spouse firstName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={watch("spouseFirstName") != ""}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="firstName" />}
              variant="standard"
              {...register("spouseFirstName")}
              InputLabelProps={{
                shrink: watch("spouseFirstName") ? true : false,
              }}
              error={!!error.spouseFirstName}
              helperText={
                error?.spouseFirstName ? error.spouseFirstName.message : null
              }
            />
          </Grid>

          {/* Spouse middleName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={watch("spouseMiddleName") != ""}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="middleName" />}
              variant="standard"
              {...register("spouseMiddleName")}
              InputLabelProps={{
                shrink: watch("spouseMiddleName") ? true : false,
              }}
              error={!!error.spouseMiddleName}
              helperText={
                error?.spouseMiddleName ? error.spouseMiddleName.message : null
              }
            />
          </Grid>

          {/* Spouse lastName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={watch("spouseLastName") != ""}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="lastName" />}
              variant="standard"
              {...register("spouseLastName")}
              InputLabelProps={{
                shrink: watch("spouseLastName") ? true : false,
              }}
              error={!!error.spouseLastName}
              helperText={
                error?.spouseLastName ? error.spouseLastName.message : null
              }
            />
          </Grid>

          {/* Spouse mobileNo */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={watch("spouseMobileNo")}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="mobileNo" />}
              variant="standard"
              {...register("spouseMobileNo")}
              InputLabelProps={{
                shrink: watch("spouseMobileNo") ? true : false,
              }}
              error={!!error.spouseMobileNo}
              helperText={
                error?.spouseMobileNo ? error.spouseMobileNo.message : null
              }
            />
          </Grid>

          {/* Spouse aadharNo */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={watch("spouseAadharNo")}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="aadharNo" />}
              variant="standard"
              {...register("spouseAadharNo")}
              InputLabelProps={{
                shrink: watch("spouseAadharNo") ? true : false,
              }}
              error={!!error.spouseAadharNo}
              helperText={
                error?.spouseAadharNo ? error.spouseAadharNo.message : null
              }
            />
          </Grid>

          {/* Spouse email */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={watch("spouseEmail")}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="email" />}
              variant="standard"
              {...register("spouseEmail")}
              InputLabelProps={{
                shrink: watch("spouseEmail") ? true : false,
              }}
              error={!!error.spouseEmail}
              helperText={error?.spouseEmail ? error.spouseEmail.message : null}
            />
          </Grid>

          {/* Spouse age */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={watch("spouseAge")}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="age" />}
              variant="standard"
              {...register("spouseAge")}
              InputLabelProps={{
                shrink: watch("spouseAge") ? true : false,
              }}
              error={!!error.spouseAge}
              helperText={error?.spouseAge ? error.spouseAge.message : null}
            />
          </Grid>

          {/* Spouse occupation */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={watch("spouseOccupation")}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="occupation" />}
              variant="standard"
              {...register("spouseOccupation")}
              InputLabelProps={{
                shrink: watch("spouseOccupation") ? true : false,
              }}
              error={!!error.spouseOccupation}
              helperText={
                error?.spouseOccupation ? error.spouseOccupation.message : null
              }
            />
          </Grid>

          {/* Spouse relation */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={true}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="relation" />}
              variant="standard"
              value={watch("spouseRelation")}
              InputLabelProps={{
                shrink: watch("spouseRelation") ? true : false,
              }}
              error={!!error.spouseRelation}
              helperText={
                error?.spouseRelation ? error.spouseRelation.message : null
              }
            />
          </Grid>
        </Grid>
        <>
          <Box>
            <Grid container className={commonStyles.title}>
              <Grid item xs={12}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <FormattedLabel id="rquiredAttachFile" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <Grid
            container
            spacing={2}
            sx={{
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DataGrid
              getRowId={(row) => row.id}
              autoHeight
              sx={{
                margin: "10px",
                overflowY: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              rows={docList || []}
              columns={attachFileColumns}
              pageSize={6}
              rowsPerPageOptions={[6]}
            />
          </Grid>
        </>
        {(dataSource?.status === 1 || dataSource?.status === 2) &&
          authority &&
          authority.find((val) => val === commonRoleId.ROLE_CLERK) && (
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl flexDirection="row">
                <Controller
                  {...register("isRejected")}
                  name="isRejected"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup
                      value={dataSource?.status !== 2 ? "false" : field.value}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        {...register("isRejected")}
                        disabled={dataSource?.status !== 2}
                        value={"true"}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        control={<Radio />}
                        label={<FormattedLabel id="accept" />}
                        error={!!error.isRejected}
                        helperText={
                          error?.isRejected ? error.isRejected.message : null
                        }
                      />
                      <FormControlLabel
                        {...register("isRejected")}
                        value={"false"}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        disabled={dataSource?.status != 2}
                        control={<Radio />}
                        label={<FormattedLabel id="revert" />}
                        error={!!error.isRejected}
                        helperText={
                          error?.isRejected ? error.isRejected.message : null
                        }
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          )}
        {/* revert section */}
        {((watch("isRejected") === "false" &&
          authority &&
          authority.find((val) => val === commonRoleId.ROLE_CLERK)) ||
          dataSource?.status == 1) && (
          <>
            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="revertSection" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  label={<FormattedLabel id="revertedRemark" />}
                  id="standard-textarea"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  multiline
                  disabled={dataSource?.status === 1}
                  inputProps={{ maxLength: 500 }}
                  {...register("clerkApprovalRemark")}
                  error={!!error.clerkApprovalRemark}
                  helperText={
                    error?.clerkApprovalRemark
                      ? error.clerkApprovalRemark.message
                      : null
                  }
                />
              </Grid>
            </Grid>
          </>
        )}
        {/* schedule site visit */}
        {dataSource?.status != 1 && dataSource?.status != 0 && (
          <>
            {(watch("isRejected") === "true" ||
              (dataSource?.status != 1 && dataSource?.status != 2)) && (
              <>
                <Box>
                  <Grid container className={commonStyles.title}>
                    <Grid item xs={12}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <FormattedLabel id="scheduleSiteVisit" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={2} sx={{ padding: "1rem" }}>
                  <>
                    <ScheduleSiteVisitPage
                      data={dataSource}
                      isOverduePayment={isOverduePayment}
                      hutData={hutData}
                    />
                  </>
                </Grid>
              </>
            )}

            {/* Approval section */}
            {
              <>
                {((dataSource?.status != 15 &&
                  dataSource?.status != 28 &&
                  dataSource?.status != 16 &&
                  dataSource?.status != 2 &&
                  dataSource?.status != 14) ||
                  (authority &&
                    authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
                    dataSource?.status == 16)) && (
                  <>
                    <Box>
                      <Grid container className={commonStyles.title}>
                        <Grid item xs={12}>
                          <h3
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                            }}
                          >
                            <FormattedLabel id="approvalSection" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                    <ViewPhotopassDetails
                      data={dataSource}
                      ownership={ownership}
                      hutData={hutData}
                      slumName={slumName}
                      photo={photo}
                      villageName={villageName}
                      usageType={usageType}
                    />
                  </>
                )}
              </>
            }
          </>
        )}{" "}
        {/* Buttons Row */}
        <Grid container spacing={2} sx={{ padding: "1rem" }}>
          {
            <>
              {(loggedInUser === "citizenUser" ||
                loggedInUser === "cfcUser" ||(loggedInUser === "departmentUser" && dataSource?.status === 17)||
                checkSomeCondition()) && (
                <>
                  <Grid
                    item
                    xl={
                      dataSource?.status == 13 || dataSource?.status == 17
                        ? 6
                        : 12
                    }
                    lg={
                      dataSource?.status == 13 || dataSource?.status == 17
                        ? 6
                        : 12
                    }
                    md={
                      dataSource?.status == 13 || dataSource?.status == 17
                        ? 6
                        : 12
                    }
                    sm={
                      dataSource?.status == 13 || dataSource?.status == 17
                        ? 6
                        : 12
                    }
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<ExitToApp />}
                      onClick={() => {
                        if(loggedInUser==='citizenUser'){
                          router.push("/dashboard");
                        }else if(loggedInUser==='cfcUser'){
                          router.push("/CFC_Dashboard");
                        } else {
                          router.push(
                            `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/hutTransferDetails`
                          );
                        }
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                  {dataSource?.status == 17 && (
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
                        marginTop: "10px",
                      }}
                    >
                      {" "}
                      <Button
                        color="success"
                        size="small"
                        variant="contained"
                        onClick={() => {
                          dataSource && handleOpen();
                        }}
                        endIcon={<Save />}
                      >
                        <FormattedLabel id="downloadPhotopass" />
                      </Button>
                    </Grid>
                  )}
                  {dataSource?.status == 13 && (
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
                        marginTop: "10px",
                      }}
                    >
                      <Button
                        // variant="contained"
                        color="success"
                        size="small"
                        // endIcon={<ExitToApp />}
                        onClick={() => {
                          router.push({
                            pathname:
                              "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForPhotopass",
                            query: {
                              id: getValues("applicationNo"),
                            },
                          });
                        }}
                      >
                        <FormattedLabel id="makeLoiPayment" />
                      </Button>
                    </Grid>
                  )}
                </>
              )}

              {/* For Revert button */}
              {watch("isRejected") === "false" &&
                (isOverduePayment ||
                  (authority &&
                    authority.find(
                      (val) => val === commonRoleId.ROLE_CLERK
                    ) && (
                      <>
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          sx={{
                            marginTop: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
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
                              } else {
                                router.push(
                                  `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`
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
                          sm={12}
                          xs={12}
                          sx={{
                            marginTop: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            type="submit"
                            disabled={!watch("clerkApprovalRemark")}
                            endIcon={<ExitToApp />}
                            onClick={() => {
                              revertToCitizen();
                            }}
                          >
                            <FormattedLabel id="Revert" />
                          </Button>
                        </Grid>
                      </>
                    )))}
            </>
          }

          {(dataSource !== undefined && dataSource?.status == 0) ||
          dataSource?.status == 1 ? (
            <Grid container>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
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
                    } else {
                      router.push(
                        `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`
                      );
                    }
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                height: "90%",
                // bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
                margin: "20px",
                overflow: "scroll",
              }}
            >
              {dataSource && (
                <Photopass
                  connectionData={hutData}
                  ownership={ownership}
                  usageType={usageType}
                  slumName={slumName}
                  husbandWifeCombinedPhoto={photo}
                  handleClose={handleClose}
                  villageName={villageName}
                  componentRef={componentRef1}
                />
              )}
            </Box>
          </Modal>
        </div>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
