import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import theme from "../../../../theme";
import React from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Controller, useForm, FormProvider } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import router from "next/router";
import axios from "axios";
import { Clear, ExitToApp, Language, Save } from "@mui/icons-material";
import urls from "../../../../URLS/urls";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FileTable from "../../../../components/SlumBillingManagementSystem/FileUpload/FileTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import { manageStatus } from "../../../../components/ElectricBillingComponent/commonStatus/manageEnMr";
import { DataGrid } from "@mui/x-data-grid";
import commonRoleId from "../../../../components/SlumBillingManagementSystem/FileUpload/RoleId/commonRole";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ViewPhotopassDetails from "../../transactions/inssuranceOfPhotopass/viewPhotopassDetails/index";
import moment from "moment";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const Index = ({ data }) => {
  const {
    register,
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
  });
  const [villageData, setVillageData] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [areaData, setAreaData] = useState([]);
  const [slumData, setSlumData] = useState([]);
  //get logged in user
  const user = useSelector((state) => state.user.user);
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
  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("data", data);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;

  // multiple files attach
  const [finalFiles, setFinalFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photo1, setPhoto1] = useState(null);
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [relationDropDown, setRelationDropDown] = useState([]);
  const [statusAll, setStatus] = useState([]);
  const [dataSource, setDataSource] = useState(null);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [requiredUploadDoc, setRequiredUploadDoc] = useState(null);
  const [requiredUploadDoc1, setRequiredUploadDoc1] = useState(null);
  const [remark, setRemark] = useState("");
  const [docList, setDocList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [completeSiteVisitDoc, setCompleteSiteVisitDoc] = useState([]);
  const headers = { Authorization: `Bearer ${user?.token}` };
  useEffect(() => {
    setDataSource(data);
  }, [data]);

  useEffect(() => {
    getRelationDetails();
    getTitleData();
    getAllStatus();
  }, []);

  const getIcardPhoto = (filePath) => {
    console.log("filePath", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        setPhoto1(r?.data?.fileName);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (photo?.documentPath != null && photo?.documentPath != undefined) {
      console.log("photo", photo1);
      getIcardPhoto(photo.documentPath);
    }
  }, [photo]);

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
    // if (router.query.id) {
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
    // } else {
    //   setDocList(
    //     requiredUploadDoc?.map((row, i) => ({
    //       srNo: i + 1,
    //       id: row.id,
    //       documentChecklistEn: row.documentChecklistEn,
    //       documentChecklistMr: row.documentChecklistMr,
    //       typeOfDocument: row.typeOfDocument,
    //       service: row.service,
    //       documentPath: row.documentPath,
    //       documentKey: row.documentKey,
    //       activeFlag: row.activeFlag,
    //       application: row.application,
    //     }))
    //   );
    // }
  }, [requiredUploadDoc, requiredUploadDoc1]);

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
        {
          console.log("record", record);
        }
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

  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "scheduledTimeText",
      headerName: <FormattedLabel id="scheduleDateTime" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
  ];

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

  //   const getPhotopassDataById = (id) => {
  //     setIsLoading(true);
  //     if (id) {
  //       if (loggedInUser === "citizenUser") {
  //         axios
  //           .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
  //             headers: {
  //               UserId: user.id,
  //             },
  //           })
  //           .then((r) => {
  //             setIsLoading(false);
  //             let result = r.data;
  //             console.log("getPhotopassDataById", result);
  //             setDataSource(result);
  //           });
  //       } else {
  //         axios
  //           .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
  //             headers: {
  //               Authorization: `Bearer ${user.token}`,
  //             },
  //           })
  //           .then((r) => {
  //             setIsLoading(false);
  //             let result = r.data;
  //             console.log("getPhotopassDataById", result);
  //             setDataSource(result);
  //           });
  //       }
  //     }
  //   };

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
    getSlumData();
    getAreaData();
    getVillageData();
    getHutData();
  }, []);

  useEffect(() => {
    if (dataSource != null) {
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
      setScheduleList(
        res?.trnVisitScheduleList.map((obj, index) => {
          return {
            id: index + 1,
            scheduledTimeText: obj.scheduledTimeText
              ? moment(obj.scheduledTimeText)?.format("DD-MM-YYYY HH:mm ")
              : "-",
          };
        })
      );

      setValue("hutNo", res ? res.hutNo : "-");
      setValue("applicationNo", res ? res.applicationNo : "-");
      setValue("currentStatus", manageStatus(res?.status, language, statusAll));

      let Slumres = slumData && slumData.find((obj) => obj.id == res?.slumKey);
      setValue(
        "slumKey",
        language === "en" ? Slumres?.slumName : Slumres.slumNameMr
      );
      let areaRes = areaData && areaData.find((obj) => obj.id === res?.areaKey);
      setValue(
        "areaKey",
        language === "en" ? areaRes?.areaName : areaRes.areaNameMr
      );

      let villageName =
        villageData && villageData.find((obj) => obj.id == res?.villageKey);
      setValue(
        "villageKey",
        language === "en" ? villageName?.villageName : villageName.villageNameMr
      );

      setValue(
        "ownerTitle",
        !res?.applicantTitle
          ? "-"
          : language == "en"
          ? titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleEn
          : titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleMr
      );
      setValue(
        "ownerFirstName",
        !res?.applicantFirstName
          ? "-"
          : language == "en"
          ? res?.applicantFirstName
          : res?.applicantFirstNameMr
      );
      setValue(
        "ownerMiddleName",
        !res?.applicantMiddleName
          ? "-"
          : language == "en"
          ? res?.applicantMiddleName
          : res?.applicantMiddleNameMr
      );
      setValue(
        "ownerLastName",
        !res?.applicantLastName
          ? "-"
          : language == "en"
          ? res?.applicantLastName
          : res?.applicantLastNameMr
      );
      setValue(
        "ownerMobileNo",
        res?.applicantMobileNo ? res?.applicantMobileNo : "-"
      );
      setValue(
        "ownerAadharNo",
        res?.applicantAadharNo ? res?.applicantAadharNo : "-"
      );
      setValue(
        "ownerEmail",
        res?.applicantEmailId ? res?.applicantEmailId : "-"
      );
      setValue("ownerAge", res?.applicantAge ? res?.applicantAge : "-");
      setValue(
        "ownerOccupation",
        res?.applicantOccupation ? res?.applicantOccupation : "-"
      );
      setValue(
        "ownerRelation",
        !res?.applicantRelationKey
          ? "-"
          : language == "en"
          ? relationDropDown &&
            relationDropDown.find((obj) => obj.id == res?.applicantRelationKey)
              ?.relation
          : relationDropDown &&
            relationDropDown.find((obj) => obj.id == res?.applicantRelationKey)
              ?.relationMr
      );
      setValue("pincode", res ? res?.pincode : "-");
      setValue("lattitude1", res ? res?.lattitude : "-");
      setValue("longitude1", res ? res?.longitude : "-");
      setValue("outstandingTax", res ? res?.outstandingTax : "-");
      setValue(
        "spouseTitle",
        !res?.coApplicantTitle
          ? "-"
          : language == "en"
          ? titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.coApplicantTitle)
              ?.titleEn
          : titleDropDown &&
            titleDropDown.find((obj) => obj.id == res?.coApplicantTitle)
              ?.titleMr
      );
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
      setValue(
        "spouseRelation",
        !res?.coApplicantRelationKey
          ? "-"
          : language == "en"
          ? relationDropDown &&
            relationDropDown.find(
              (obj) => obj.id == res?.coApplicantRelationKey
            )?.relation
          : relationDropDown &&
            relationDropDown.find(
              (obj) => obj.id == res?.coApplicantRelationKey
            )?.relationMr
      );
      setPhoto({ documentPath: res?.husbandWifeCombinedPhoto });

      setValue("clerkApprovalRemark", res?.clerkApprovalRemark);
      setValue("headClerkApprovalRemark", res?.headClerkApprovalRemark);
      setValue(
        "officeSuperintendantApprovalRemark",
        res?.officeSuperintendantApprovalRemark
      );
      setValue(
        "administrativeOfficerApprovalRemark",
        res?.administrativeOfficerApprovalRemark
      );
      setValue(
        "assistantCommissionerApprovalRemark",
        res?.assistantCommissionerApprovalRemark
      );

      setValue("visitTime", res?.trnVisitScheduleList[0]?.visitTime);
      setValue("longitude", res?.trnVisitScheduleList[0]?.longitude);
      setValue("lattitude", res?.trnVisitScheduleList[0]?.lattitude);
      setValue("remarks", res?.trnVisitScheduleList[0]?.remarks);
      setValue("geocode", res?.trnVisitScheduleList[0]?.geocode);
      setValue(
        "scheduledTime",
        res?.trnVisitScheduleList[0]?.scheduledTimeText
      );

      let siteVisitObj =
        res?.trnVisitScheduleList &&
        res?.trnVisitScheduleList[res?.trnVisitScheduleList?.length - 1];

      const doc = [];
      // Loop through each attached document and add it to the `doc` array

      // for (let i = 1; i <= 5; i++) {
      //   const attachedDocument = siteVisitObj?.[`siteImage${i}`];

      //   if (attachedDocument != null) {
      //     doc.push({
      //       id: i,
      //       fileName: attachedDocument.split("/").pop().split("_").pop(),
      //       documentPath: attachedDocument,
      //       documentType: attachedDocument.split(".").pop().toUpperCase(),
      //     });
      //   }

      for (let i = 1; i <= 5; i++) {
        const attachedDocument =
          res?.trnVisitScheduleList[0]?.[`siteImage${i}`];
        if (attachedDocument != null && attachedDocument != "") {
          const DecryptPhoto = DecryptData(
            "passphraseaaaaaaaaupload",
            attachedDocument
          );
          doc.push({
            id: i,
            filenm: DecryptPhoto.split("/").pop().split("_").pop(),
            documentPath: attachedDocument,
            documentType: DecryptPhoto.split(".").pop().toUpperCase(),
          });
        }
        setCompleteSiteVisitDoc(doc);
        setFinalFiles(doc);
      }
      // setFinalFiles([
      //   {
      //     srNo: 1,
      //     fileName: siteVisitObj?.siteImage1 && showFileName(siteVisitObj?.siteImage1),
      //     filePath: siteVisitObj?.siteImage1 && siteVisitObj?.siteImage1,
      //   },
      //   {
      //     srNo: 2,
      //     fileName:siteVisitObj?.siteImage1 &&  showFileName(siteVisitObj?.siteImage2),
      //     filePath: siteVisitObj?.siteImage1 && siteVisitObj?.siteImage2,
      //   },
      //   {
      //     srNo: 3,
      //     fileName: siteVisitObj?.siteImage1 && showFileName(siteVisitObj?.siteImage3),
      //     filePath: siteVisitObj?.siteImage1 && siteVisitObj?.siteImage3,
      //   },
      //   {
      //     srNo: 4,
      //     fileName: siteVisitObj?.siteImage1 && showFileName(siteVisitObj?.siteImage4),
      //     filePath: siteVisitObj?.siteImage1 && siteVisitObj?.siteImage4,
      //   },
      //   {
      //     srNo: 5,
      //     fileName: siteVisitObj?.siteImage1 ? showFileName(siteVisitObj?.siteImage5) : "",
      //     filePath: siteVisitObj?.siteImage1 && siteVisitObj?.siteImage5,
      //   },
      // ]);
      setValue("siteVisitRemark", siteVisitObj?.remarks);
    }
  }, [dataSource, language, statusAll, titleDropDown, slumData, areaData]);
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

  const getTitleData = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.title;
        let res =
          result && result.find((obj) => obj.id == dataSource?.applicantTitle);
        setValue(
          "applicantTitle",
          language == "en" ? res?.title : res?.titleMr
        );

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
        let res = result && result.find((obj) => obj.id == dataSource?.hutKey);
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

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    let body;
    authority && authority.find((val) => val === commonRoleId.ROLE_CLERK)
      ? (body = {
          ...dataSource,
          clerkApprovalRemark: remark,
        })
      : authority &&
        authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK)
      ? (body = {
          ...dataSource,
          headClerkApprovalRemark: remark,
        })
      : authority &&
        authority.find((val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT)
      ? (body = {
          ...dataSource,
          officeSuperintendantApprovalRemark: remark,
        })
      : authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
        )
      ? (body = {
          ...dataSource,
          administrativeOfficerApprovalRemark: remark,
        })
      : authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER
        )
      ? (body = {
          ...dataSource,
          assistantCommissionerApprovalRemark: remark,
        })
      : "";

    if (btnSaveText === "Save") {
      let payload = {
        ...body,
        isApproved: true,
        isComplete: false,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, payload, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert(
              language == "en" ? "Approved!" : "मंजूर!",
              language == "en"
                ? `Photopass against ${dataSource.applicationNo} Approved successfully !`
                : `${dataSource.applicationNo} विरुद्ध फोटोपास यशस्वीरीत्या मंजूर झाला!`,
              "success"
            );
            router.push(
              "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else if (btnSaveText === "Revert") {
      let payload = {
        ...body,
        isApproved: false,
        isComplete: false,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, payload, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert(
              language == "en" ? "Revert!" : "परत!",
              language == "en"
                ? `Photopass against ${dataSource.applicationNo} Revert Back successfully !`
                : `फोटोपास ${dataSource.applicationNo} विरुद्ध यशस्वीरित्या परत केले!`,
              "success"
            );
            router.push(
              "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else if (btnSaveText === "Complete") {
      let payload = {
        ...body,
        isApproved: null,
        isComplete: true,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, payload, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert(
              language == "en" ? "Issued!" : "जारी!",
              language == "en"
                ? `Photopass ${dataSource.applicationNo} Issued successfully !`
                : `फोटोपास ${dataSource.applicationNo} यशस्वीरित्या जारी केले!`,
              "success"
            );
            router.push(
              "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
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
        "error"
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error"
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error"
      );
    }
  };

  // file attache column
  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "id",
      width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      headerAlign: "center",
      align: "center",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      headerAlign: "center",
      align: "center",
      // flex: 1,
      width: 200,

      renderCell: (record) => {
        return (
          <>
            {record.row.documentPath ? (
              <IconButton
                color="primary"
                // onClick={() => {
                //   window.open(
                //     `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                //     "_blank"
                //   );
                // }}
                onClick={() => {
                  getFilePreview(params?.row?.documentPath);
                }}
              >
                <VisibilityIcon />
              </IconButton>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      {isLoading && <CommonLoader />}
      <ThemeProvider theme={theme}>
        {/* <>
          <BreadcrumbComponent />
        </> */}
        {/* <Paper
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
        > */}
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          {/********* Hut Owner Information *********/}

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
                  <FormattedLabel id="hutOwnerDetails" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={1} sx={{ padding: "1rem" }}>
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
              {photo1 ? (
                <img
                  // src={`${urls.CFCURL}/file/preview?filePath=${photo?.documentPath}`}
                  src={`data:image/png;base64,${photo1}`}
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
              <TextField
                disabled={true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="title" />}
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
                label={<FormattedLabel id="firstName" />}
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
                label={<FormattedLabel id="middleName" />}
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
                label={<FormattedLabel id="lastName" />}
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
                label={<FormattedLabel id="mobileNo" />}
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
                label={<FormattedLabel id="aadharNo" />}
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

            {/* email */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="email" />}
                variant="standard"
                value={watch("ownerEmail")}
                InputLabelProps={{
                  shrink: watch("ownerEmail") ? true : false,
                }}
                error={!!error.ownerEmail}
                helperText={error?.ownerEmail ? error.ownerEmail.message : null}
              />
            </Grid>

            {/* age */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="age" />}
                variant="standard"
                value={watch("ownerAge")}
                InputLabelProps={{
                  shrink: watch("ownerAge") ? true : false,
                }}
                error={!!error.ownerAge}
                helperText={error?.ownerAge ? error.ownerAge.message : null}
              />
            </Grid>

            {/* occupation */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="occupation" />}
                variant="standard"
                value={watch("ownerOccupation")}
                InputLabelProps={{
                  shrink: watch("ownerOccupation") ? true : false,
                }}
                error={!!error.ownerOccupation}
                helperText={
                  error?.ownerOccupation ? error.ownerOccupation.message : null
                }
              />
            </Grid>

            {/* relation  */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="relation" />}
                variant="standard"
                value={watch("ownerRelation")}
                InputLabelProps={{
                  shrink: watch("ownerRelation") ? true : false,
                }}
                error={!!error.ownerRelation}
                helperText={
                  error?.ownerRelation ? error.ownerRelation.message : null
                }
              />
            </Grid>

            {/* Slum Name */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="slumName" />}
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
                label={<FormattedLabel id="area" />}
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
                label={<FormattedLabel id="village" />}
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
                value={watch("lattitude1")}
                InputLabelProps={{
                  shrink: watch("lattitude1") ? true : false,
                }}
                error={!!error.lattitude1}
                helperText={error?.lattitude1 ? error.lattitude1.message : null}
              />
            </Grid>

            {/* Longitude */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="longitude" />}
                variant="standard"
                value={watch("longitude1")}
                InputLabelProps={{
                  shrink: watch("longitude1") ? true : false,
                }}
                error={!!error.longitude1}
                helperText={error?.longitude1 ? error.longitude1.message : null}
              />
            </Grid>
          </Grid>

          {/********* Spouse Information *********/}

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

          <Grid container spacing={1} sx={{ padding: "10px" }}>
            {/* Spouse Title */}

            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="title" />}
                variant="standard"
                value={watch("spouseTitle")}
                InputLabelProps={{
                  shrink: watch("spouseTitle") ? true : false,
                }}
                error={!!error.spouseTitle}
                helperText={
                  error?.spouseTitle ? error.spouseTitle.message : null
                }
              />
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
                  error?.spouseMiddleName
                    ? error.spouseMiddleName.message
                    : null
                }
              />
            </Grid>

            {/* Spouse lastName */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={watch("spouseLastName") != ""}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="lastNameEn" />}
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
                helperText={
                  error?.spouseEmail ? error.spouseEmail.message : null
                }
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
                  error?.spouseOccupation
                    ? error.spouseOccupation.message
                    : null
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

          {dataSource?.status != 1 && dataSource?.status != 0 && (
          <>
            {(
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
        {scheduleList.length != 0 && dataSource?.status != 2 && (
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <DataGrid
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
              pageSize={10}
              density="standard"
              pagination={{ pageSizeOptions: [10, 20, 50, 100] }}
              rows={scheduleList}
              columns={columns}
            />
          </Grid>
        )}
       

        {(
          (dataSource?.status != 2 &&
            dataSource?.status != 15 &&
            dataSource?.status != 28)) && (
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
                    <FormattedLabel id="photopassSiteDetails" />
                  </h3>
                </Grid>
              </Grid>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Schedule date & time */}
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
                <Controller
                  control={control}
                  name="scheduledTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        disablePast
                        {...field}
                        renderInput={(props) => (
                          <TextField
                            {...props}
                            size="small"
                            fullWidth
                            sx={{
                              m: { xs: 0, md: 1 },
                              minWidth: "100%",
                            }}
                            error={error.scheduledTime}
                            helperText={
                              error?.scheduledTime
                                ? error.scheduledTime.message
                                : null
                            }
                          />
                        )}
                        label={<FormattedLabel id="scheduleDateTime" />}
                        
                        value={
                          field.value
                            ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                            : null
                        }
                        defaultValue={null}
                        disabled
                        inputFormat="DD-MM-YYYY hh:mm:ss A"
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              {/* Visit Date & Time */}
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
                <Controller
                  control={control}
                  name="visitTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        {...field}
                        renderInput={(props) => (
                          <TextField
                            {...props}
                            size="small"
                            fullWidth
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            error={error.visitTime}
                            helperText={
                              error?.visitTime ? error.visitTime.message : null
                            }
                          />
                        )}
                        label={<FormattedLabel id="visitDateTime" required />}
                       
                        value={
                          field.value
                            ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                            : null
                        }
                        defaultValue={null}
                        inputFormat="DD-MM-YYYY hh:mm:ss A"
                        disabled
                      />
                    </LocalizationProvider>
                  )}
                />
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
                }}
              >
                <TextField
                  disabled
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lattitude" required />}
                  variant="standard"
                  {...register("lattitude")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("lattitude") ? true : false,
                  }}
                  error={!!error.lattitude}
                  helperText={error?.lattitude ? error.lattitude.message : null}
                />
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
                }}
              >
                <TextField
                  disabled
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="longitude" required />}
                  variant="standard"
                  {...register("longitude")}
                  InputLabelProps={{
                    shrink: watch("longitude") ? true : false,
                  }}
                  error={!!error.longitude}
                  helperText={error?.longitude ? error.longitude.message : null}
                />
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
                }}
              >
                <TextField
                  disabled
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="geocode" required />}
                  variant="standard"
                  {...register("geocode")}
                  InputLabelProps={{
                    shrink: watch("geocode") ? true : false,
                  }}
                  error={!!error.geocode}
                  helperText={error?.geocode ? error.geocode.message : null}
                />
              </Grid>
            </Grid>

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
                    <FormattedLabel id="attachInspectionImages" />
                  </h3>
                </Grid>
              </Grid>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Attachement */}
              {dataSource?.status != 15 && dataSource?.status != 28 && (
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
                  pagination
                  paginationMode="server"
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  rows={completeSiteVisitDoc}
                  columns={docColumns}
                />
              ) }
            </Grid>

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
                <TextField
                  disabled
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="remarks" />}
                  inputProps={{ maxLength: 500 }}
                  multiline
                  variant="standard"
                  {...register("remarks")}
                  error={!!error.remarks}
                  helperText={error?.remarks ? error.remarks.message : null}
                />
              </Grid>
            </Grid>
          
         </>
        )}
                  </>
                </Grid>
              </>
            )}

            {/* Approval section */}
            {
            }
          </>
        )}{" "}

          {/* Approval section */}
          {
            <>
              {dataSource?.status != 15 &&
                dataSource?.status != 28 &&
                dataSource?.status != 16 &&
                dataSource?.status != 2 &&
                dataSource?.status != 14 && (
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
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {/* clerk remark */}

                      {((dataSource?.status != 15 &&
                        dataSource?.status != 28) ||
                        watch("clerkApprovalRemark")) && (
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
                            marginTop: "20px",
                          }}
                        >
                          <TextField
                            multiline
                            disabled
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            label={<FormattedLabel id="clerkApprovalRemark" />}
                            inputProps={{ maxLength: 500 }}
                            variant="standard"
                            {...register("clerkApprovalRemark")}
                            InputLabelProps={{
                              shrink: watch("clerkApprovalRemark")
                                ? true
                                : false,
                            }}
                            error={!!error.clerkApprovalRemark}
                            helperText={
                              error?.clerkApprovalRemark
                                ? error.clerkApprovalRemark.message
                                : null
                            }
                          />
                        </Grid>
                      )}

                      {/* headClerkApprovalRemark */}

                      {(watch("headClerkApprovalRemark") ||
                        (dataSource?.status != 5 &&
                          dataSource?.status != 1 &&
                          dataSource?.status != 20 &&
                          dataSource?.status != 15 &&
                          dataSource?.status != 28 &&
                          dataSource?.status != 16 &&
                          dataSource?.status != 14)) && (
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
                            marginTop: "20px",
                          }}
                        >
                          <TextField
                            multiline
                            disabled
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            label={
                              <FormattedLabel id="headClerkApprovalRemark" />
                            }
                            inputProps={{ maxLength: 500 }}
                            variant="standard"
                            {...register("headClerkApprovalRemark")}
                            InputLabelProps={{
                              shrink: watch("headClerkApprovalRemark")
                                ? true
                                : false,
                            }}
                            error={!!error.headClerkApprovalRemark}
                            helperText={
                              error?.headClerkApprovalRemark
                                ? error.headClerkApprovalRemark.message
                                : null
                            }
                          />
                        </Grid>
                      )}

                      {/* administrativeOfficerApprovalRemark */}
                      {(dataSource?.status === 11 ||
                        dataSource?.status == 21 ||
                        dataSource?.status === 17 ||
                        watch("administrativeOfficerApprovalRemark")) && (
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
                            marginTop: "20px",
                          }}
                        >
                          <TextField
                            multiline
                            disabled
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            label={
                              <FormattedLabel id="administrativeOfficerApprovalRemark" />
                            }
                            inputProps={{ maxLength: 500 }}
                            variant="standard"
                            {...register("administrativeOfficerApprovalRemark")}
                            InputLabelProps={{
                              shrink: watch(
                                "administrativeOfficerApprovalRemark"
                              )
                                ? true
                                : false,
                            }}
                            error={!!error.administrativeOfficerApprovalRemark}
                            helperText={
                              error?.administrativeOfficerApprovalRemark
                                ? error.administrativeOfficerApprovalRemark
                                    .message
                                : null
                            }
                          />
                        </Grid>
                      )}

                      {/* assistantCommissionerApprovalRemark */}
                      {(dataSource?.status == 21 ||
                        watch("assistantCommissionerApprovalRemark") ||
                        dataSource?.status === 17) && (
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
                            marginTop: "20px",
                          }}
                        >
                          <TextField
                            multiline
                            disabled
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            label={
                              <FormattedLabel id="assistantCommissionerApprovalRemark" />
                            }
                            inputProps={{ maxLength: 500 }}
                            variant="standard"
                            {...register("assistantCommissionerApprovalRemark")}
                            InputLabelProps={{
                              shrink: watch(
                                "assistantCommissionerApprovalRemark"
                              )
                                ? true
                                : false,
                            }}
                            error={!!error.assistantCommissionerApprovalRemark}
                            helperText={
                              error?.assistantCommissionerApprovalRemark
                                ? error.assistantCommissionerApprovalRemark
                                    .message
                                : null
                            }
                          />
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}
            </>
          }

          {/* <Box
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="generateReports" />
            </h2>
          </Box> */}

          {/* Generate Inspection Report */}
          {/* <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Grid item xl={9} lg={9} md={6} sm={6} xs={12}>
                <label>
                  <b>
                    {authority &&
                    authority.find((val) => val === commonRoleId.ROLE_CLERK) ? (
                      <FormattedLabel id="generateInspectionReport" />
                    ) : (
                      <FormattedLabel id="generatedInspectionReport" />
                    )}
                  </b>
                </label>
              </Grid>

              <Grid item xl={2} lg={2} md={5} sm={5} xs={12}>
                <Button color="primary" variant="contained" size="samll">
                  <FormattedLabel id="preview" />
                </Button>
              </Grid>
            </Grid> */}

          {/* Exit button */}
          {/* <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>

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
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="contained"
                  size="samll"
                  color="error"
                  endIcon={<ExitToApp />}
                  onClick={() => {
                    router.push(
                      `/SlumBillingManagementSystem/transactions/helpDesk`
                    );
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </Grid> */}
          {/* </Grid> */}
        </form>
        {/* </Paper> */}
      </ThemeProvider>
    </>
  );
};

export default Index;
