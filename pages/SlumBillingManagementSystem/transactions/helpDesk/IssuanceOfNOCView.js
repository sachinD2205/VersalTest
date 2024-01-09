import React, { useEffect, useState } from "react";
import {
  EncryptData,
  DecryptData,
} from "../../../../components/common/EncryptDecrypt";
import { Grid, Box, TextField, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import { useSelector } from "react-redux";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import axios from "axios";
import urls from "../../../../URLS/urls";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
const Index = (props) => {
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  // @ts-ignore
  const [hutData, setHutData] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const [areaData, setAreaData] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [currentStatus1, setCurrentStatus] = useState();
  const [appliNo, setApplicationNo] = useState();
  const headers = { Authorization: `Bearer ${user?.token}` };
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [docList, setDocList] = useState([]);
  const [statusVal, setStatusVal] = useState(null);
  const [requiredUploadDoc1, setRequiredUploadDoc1] = useState(null);
  const [requiredUploadDoc, setRequiredUploadDoc] = useState(null);
  const [hutKey, setHutkeyVal] = useState(null);
  const [villlageData, setVillageData] = useState([]);
  const [villageName, setVillageName] = useState("");
  const [slumData, setSlumData] = useState([]);
  const [slumName, setSlumName] = useState("");
  const [statusAll, setStatus] = useState(null);
  const [usageType, setUsageType] = useState([]);
  const [hutOwnerData, setHutOwnerData] = useState(null);
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
  // document columns
  const docColumns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "filenm",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                getFilePreview(record?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getTitleData();
    getSlumData();
    getAreaData();
    getVillageData();
    getHutData();
    getRequiredDocs();
    getAllStatus();
  }, []);

  useEffect(() => {
    if (hutData.length != 0 && hutData?.usageTypeKey != undefined) {
      getUsageType();
    }
  }, [hutData?.usageTypeKey]);
  const getUsageType = () => {
    axios
      .get(
        `${urls.SLUMURL}/mstSbUsageType/getById?id=${hutData?.usageTypeKey}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let res = r.data;
        setUsageType(res?.usageTypeMr);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (hutKey != null) getHutByHutkey();
  }, [hutKey]);

  const getHutByHutkey = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${hutKey}`, {
        headers: headers,
      })
      .then((r) => {
        setHutData(r.data);
        let res = r.data.mstHutMembersList.find(
          (obj) => obj.headOfFamily === "Y"
        );
        setHutOwnerData(res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (hutOwnerData != null) {
      let res = hutOwnerData;
      setValue(
        "ownerTitle",
        !res?.title
          ? "-"
          : language == "en"
          ? titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.title)?.titleEn
          : titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.title)?.titleMr
      );
      setValue(
        "ownerFirstName",
        !res?.firstName
          ? "-"
          : language == "en"
          ? res?.firstName
          : res?.firstNameMr
      );
      setValue(
        "ownerMiddleName",
        !res?.middleName
          ? "-"
          : language == "en"
          ? res?.middleName
          : res?.middleNameMr
      );
      setValue(
        "ownerLastName",
        !res?.lastName
          ? "-"
          : language == "en"
          ? res?.lastName
          : res?.lastNameMr
      );
      setValue("ownerMobileNo", res?.mobileNo ? res?.mobileNo : "-");
      setValue("ownerAadharNo", res?.aadharNo ? res?.aadharNo : "-");
    }
  }, [hutOwnerData, language, titleDropDown]);

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

  useEffect(() => {
    if (props.data != null) {
      setDataOnForm();
    }
  }, [props, language, areaData, titleDropDown]);

  const attachFileColumns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },

    //File Name
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
            <IconButton
              color="primary"
              onClick={() => {
                getFilePreview(params?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

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
      .catch((error) => {
        console.log("CatchPreviewApi", error);
      });
  };

  const setDataOnForm = () => {
    let res = props.data;
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    setStatusVal(res.status);
    setHutkeyVal(res?.hutKey);
    setValue("hutNo", res ? res?.hutNo : "-");
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    let villageData1 =
      villlageData &&
      villlageData.find((obj) => obj.id == res?.villageKey)?.villageNameMr;
    setVillageName(villageData1);
    const slumName1 =
      slumData && slumData.find((obj) => obj.id == res?.slumKey)?.slumNameMr;
    setSlumName(slumName1);
    setValue(
      "slumTaxesAmount",
      res?.outstandingTax == null ? "0" : res?.outstandingTax
    );
    setValue(
      "applicantFirstName",
      res
        ? language == "en"
          ? res?.applicantFirstName
          : res?.applicantFirstNameMr
        : "-"
    );
    setValue(
      "applicantMiddleName",
      res
        ? language == "en"
          ? res?.applicantMiddleName
          : res?.applicantMiddleNameMr
        : "-"
    );
    setValue(
      "applicantLastName",
      res
        ? language == "en"
          ? res?.applicantLastName
          : res?.applicantLastNameMr
        : "-"
    );
    setValue("applicantMobileNo", res ? res?.applicantMobileNo : "-");
    setValue("applicantEmailId", res ? res?.applicantEmailId : "-");
    setValue("applicantAadharNo", res ? res?.applicantAadharNo : "-");
    setValue("noOfCopies", res ? res?.noOfCopies : "-");
    setValue("feesApplicable", res.feesApplicable);
    setValue("asOnDate", res.asOnDate);
    setApplicationNo(res?.applicationNo);
    setCurrentStatus(manageStatus(res.status, language, statusAll));
    let applicantPhoto = [];
    console.log("res.applicantPhoto", res.applicantPhoto);

    if (res.applicantPhoto != null) {
      applicantPhoto.push({
        id: 1,
        filenm: DecryptData("passphraseaaaaaaaaupload", res.applicantPhoto)
          .split("/")
          .pop()
          .split("_")
          .pop(),
        documentPath: res.applicantPhoto,
        documentType: DecryptData(
          "passphraseaaaaaaaaupload",
          res.applicantPhoto
        )
          .split(".")
          .pop()
          .toUpperCase(),
      });
    }
    setPhoto(applicantPhoto);
    setValue(
      "applicantTitle",
      language == "en"
        ? titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleEn
        : titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleMr
    );
    setValue(
      "slumKey",
      language === "en"
        ? slumData && slumData.find((obj) => obj.id == res?.slumKey)?.slumName
        : slumData && slumData.find((obj) => obj.id == res?.slumKey)?.slumNameMr
    );
    setValue(
      "areaKey",
      language === "en"
        ? areaData && areaData.find((obj) => obj.id == res?.areaKey)?.areaName
        : areaData && areaData.find((obj) => obj.id == res?.areaKey)?.areaNameMr
    );
    setValue(
      "villageKey",
      language === "en"
        ? villlageData &&
            villlageData.find((obj) => obj.id == res?.villageKey)?.villageName
        : villlageData &&
            villlageData.find((obj) => obj.id == res?.villageKey)?.villageNameMr
    );

    setValue("visitTime", res?.trnVisitScheduleList[0]?.visitTime);
    setValue("scheduledTime", res?.trnVisitScheduleList[0]?.scheduledDate);
    setValue("slongitude", res?.trnVisitScheduleList[0]?.longitude);
    setValue("slattitude", res?.trnVisitScheduleList[0]?.lattitude);
    setValue("remarks", res?.trnVisitScheduleList[0]?.remarks);
    setValue("geocode", res?.trnVisitScheduleList[0]?.geocode);
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
    setValue("purpose", res?.purpose ? res?.purpose : "");
    setValue("clerkApprovalRemark", res?.clerkApprovalRemark);
    // setClerkApprovalRemark(res?.clerkApprovalRemark);
    setValue("headClerkApprovalRemark", res?.headClerkApprovalRemark);
    setValue(
      "administrativeOfficerApprovalRemark",
      res?.administrativeOfficerApprovalRemark
    );
    setValue(
      "assistantCommissionerApprovalRemark",
      res?.assistantCommissionerApprovalRemark
    );
    setValue("finalApprovalRemark", res?.finalApprovalRemark);
    // setFinalApprovedRemark(res?.finalApprovalRemark);
  };
  const getRequiredDocs = () => {
    axios
      .get(
        `${urls.CFCURL}/master/documentMaster/getDocumentByService?serviceId=129`,
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
    if (requiredUploadDoc != null && requiredUploadDoc1 != null) {
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
    }
  }, [requiredUploadDoc1, requiredUploadDoc]);

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
  const getHutData = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstHutList;
        let res = result && result.find((obj) => obj.id == props.data?.hutKey);
        setValue("hutNo", res ? res?.hutNo : "-");
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

  return (
    <>
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
            <FormattedLabel id="issuanceOfNoc" />
          </h3>
        </Grid>
      </Grid>

      {/* Current status and application No */}
      <Grid container spacing={2} sx={{ padding: "1rem" }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          xl={6}
          sx={{
            "@media (max-width: 390px)": {
              display: "grid",
            },
          }}
        >
          <label
            style={{
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            <FormattedLabel id="applicationNo" /> :
          </label>
          <label
            style={{
              fontSize: "18px",
            }}
          >
            {appliNo}
          </label>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          xl={6}
          sx={{
            "@media (max-width: 390px)": {
              display: "grid",
            },
          }}
        >
          <label
            style={{
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            <FormattedLabel id="currentStatus" /> :
          </label>
          <label
            style={{
              fontSize: "18px",
              gap: 3,
            }}
          >
            {currentStatus1}
          </label>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ padding: "1rem" }}>
        {/* owner Title */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="title" required />}
            variant="standard"
            value={watch("ownerTitle")}
            InputLabelProps={{
              shrink: watch("ownerTitle") ? true : false,
            }}
            error={!!error.ownerTitle}
            helperText={error?.ownerTitle ? error.ownerTitle.message : null}
          />
        </Grid>

        {/* firstName */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="firstName" required />}
            variant="standard"
            value={watch("ownerFirstName")}
            InputLabelProps={{
              shrink: watch("ownerFirstName") ? true : false,
            }}
            error={!!error.ownerFirstName}
            helperText={
              error?.ownerFirstName ? error.ownerFirstName.message : null
            }
          />
        </Grid>

        {/* middleName */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="middleName" required />}
            variant="standard"
            value={watch("ownerMiddleName")}
            InputLabelProps={{
              shrink: watch("ownerMiddleName") ? true : false,
            }}
            error={!!error.ownerMiddleName}
            helperText={
              error?.ownerMiddleName ? error.ownerMiddleName.message : null
            }
          />
        </Grid>

        {/* lastName */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="lastName" required />}
            variant="standard"
            value={watch("ownerLastName")}
            InputLabelProps={{
              shrink: watch("ownerLastName") ? true : false,
            }}
            error={!!error.ownerLastName}
            helperText={
              error?.ownerLastName ? error.ownerLastName.message : null
            }
          />
        </Grid>

        {/* mobileNo */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="mobileNo" required />}
            variant="standard"
            value={watch("ownerMobileNo")}
            InputLabelProps={{
              shrink: watch("ownerMobileNo") ? true : false,
            }}
            error={!!error.ownerMobileNo}
            helperText={
              error?.ownerMobileNo ? error.ownerMobileNo.message : null
            }
          />
        </Grid>

        {/* aadharNo */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="aadharNo" required />}
            variant="standard"
            value={watch("ownerAadharNo")}
            InputLabelProps={{
              shrink: watch("ownerAadharNo") ? true : false,
            }}
            error={!!error.ownerAadharNo}
            helperText={
              error?.ownerAadharNo ? error.ownerAadharNo.message : null
            }
          />
        </Grid>

        {/* Slum Name */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="slumName" required />}
            variant="standard"
            value={watch("slumKey")}
            InputLabelProps={{
              shrink: watch("slumKey") ? true : false,
            }}
            error={!!error.slumKey}
            helperText={error?.slumKey ? error.slumKey.message : null}
          />
        </Grid>

        {/* Area */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="area" required />}
            variant="standard"
            value={watch("areaKey")}
            InputLabelProps={{
              shrink: watch("areaKey") ? true : false,
            }}
            error={!!error.areaKey}
            helperText={error?.areaKey ? error.areaKey.message : null}
          />
        </Grid>

        {/* Village */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="village" required />}
            variant="standard"
            value={watch("villageKey")}
            InputLabelProps={{
              shrink: watch("villageKey") ? true : false,
            }}
            error={!!error.villageKey}
            helperText={error?.villageKey ? error.villageKey.message : null}
          />
        </Grid>

        {/* pincode */}
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="pincode" required />}
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
            label={<FormattedLabel id="lattitude" required />}
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
            label={<FormattedLabel id="longitude" required />}
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

      <>
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
        />
      </>

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
            <FormattedLabel id="applicantInfo" />
          </h3>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ padding: "1rem" }}>
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <TextField
            disabled={true}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="title" />}
            variant="standard"
            value={watch("applicantTitle")}
            InputLabelProps={{
              shrink: watch("applicantTitle") ? true : false,
            }}
            error={!!error.applicantTitle}
            helperText={
              error?.applicantTitle ? error.applicantTitle.message : null
            }
          />
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
              error?.applicantLastName ? error.applicantLastName.message : null
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
              error?.applicantMobileNo ? error.applicantMobileNo.message : null
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
              error?.applicantAadharNo ? error.applicantAadharNo.message : null
            }
          />
        </Grid>
      </Grid>

      <>
        <DataGrid
          autoHeight
          sx={{
            padding: "10px",
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
          density="standard"
          rows={photo}
          columns={docColumns}
          pageSize={6}
        />
      </>
      <Grid
        container
        className={commonStyles.title}
        style={{ marginTop: "8px" }}
      >
        <Grid item xs={12}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <FormattedLabel id="purposeForNoc" />
          </h3>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ padding: "1rem" }}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <TextField
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="purpose" required />}
            variant="standard"
            disabled
            {...register("purpose")}
            inputProps={{ maxLength: 1000 }}
            InputLabelProps={{
              shrink: watch("purpose") ? true : false,
            }}
            multiline
            error={!!error.purpose}
            helperText={error?.purpose ? error.purpose.message : null}
          />
        </Grid>
      </Grid>
      <Grid
        container
        className={commonStyles.title}
        style={{ marginTop: "8px" }}
      >
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
      {/* Clerk Approval Remark */}
      {((statusVal != 15 &&
        statusVal != 28 &&
        statusVal != 29 &&
        statusVal != 16) ||
        watch("clerkApprovalRemark")) && (
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <TextField
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="clearkRemarks" />}
            variant="standard"
            disabled
            {...register("clerkApprovalRemark")}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ maxLength: 500 }}
            onChange={(e) => handleRemarkChange(e, "clerkApprovalRemark")}
            multiline
            error={!!error.clerkApprovalRemark}
            helperText={
              error?.clerkApprovalRemark
                ? error.clerkApprovalRemark.message
                : null
            }
          />
        </Grid>
      )}

      {((statusVal != 5 && statusVal != 29 && statusVal != 1) ||
        watch("headClerkApprovalRemark")) && (
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <TextField
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="headClerkApprovalRemark" />}
            variant="standard"
            disabled
            {...register("headClerkApprovalRemark")}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ maxLength: 500 }}
            multiline
            onChange={(e) => handleRemarkChange(e, "headClerkApprovalRemark")}
            error={!!error.headClerkApprovalRemark}
            helperText={
              error?.headClerkApprovalRemark
                ? error.headClerkApprovalRemark.message
                : null
            }
          />
        </Grid>
      )}

      {/* admin officer Approval Remark */}
      {((statusVal != 9 &&
        statusVal != 3 &&
        statusVal != 5 &&
        statusVal != 29 &&
        statusVal != 1) ||
        watch("administrativeOfficerApprovalRemark")) && (
          <>
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
              <TextField
                multiline
                disabled
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={
                  <FormattedLabel id="administrativeOfficerApprovalRemark" />
                }
                // @ts-ignore
                variant="standard"
                {...register("administrativeOfficerApprovalRemark")}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ maxLength: 500 }}
                onChange={(e) =>
                  handleRemarkChange(e, "administrativeOfficerApprovalRemark")
                }
                error={!!error.administrativeOfficerApprovalRemark}
                helperText={
                  error?.administrativeOfficerApprovalRemark
                    ? error.administrativeOfficerApprovalRemark.message
                    : null
                }
              />
            </Grid>
          </>
        )}

      {watch("finalApprovalRemark") && (
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <TextField
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            label={<FormattedLabel id="finalApprovedRemark" />}
            variant="standard"
            disabled
            {...register("finalApprovalRemark")}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            onChange={(e) => handleRemarkChange(e, "finalApprovalRemark")}
            inputProps={{ maxLength: 500 }}
            error={!!error.finalApprovalRemark}
            helperText={
              error?.finalApprovalRemark
                ? error.finalApprovalRemark.message
                : null
            }
          />
        </Grid>
      )}
    </>
  );
};

export default Index;
