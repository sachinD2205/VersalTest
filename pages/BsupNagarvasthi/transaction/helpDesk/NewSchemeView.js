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
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import styles from "../acknowledgement.module.css";
import divyangData from "../divyang.json";
import bsupUserRoles from "../../../../components/bsupNagarVasthi/userRolesBSUP";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
import { EncryptData,DecryptData } from "../../../../components/common/EncryptDecrypt/index.js";
import { manageStatus
 } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr.js";
const BachatGatCategorySchemes = (props) => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(trnNewApplicationSchema),
    mode: "onChange",
  });

  const language = useSelector((state) => state.labels.language);

  const router = useRouter();
  const [appliNo, setApplicationNo] = useState();
  const [currentStatus1, setCurrentStatus] = useState();
  const [divyangNames, setDivyangNames] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [religionNames, setReligionNames] = useState([]);
  const [castNames, setCastNames] = useState([]);
  const [castdependent, setCastDependent] = useState([]);
  const [dependency, setDependency] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [textFArea, setTextFArea] = useState([]);
  const [docUpload, setDocUpload] = useState([]);
  const [dropDown, setDropDown] = useState([]);
  const [eligibilityCriteriaDetails, setEligiblityCriteriaDetails] = useState(
    []
  );
  const [castOptions, setCastOptions] = useState([]);
  const [statusVal, setStatusVal] = useState(null);
  const [eligiblityData, setEligiblityCriteriaData] = useState([]);
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [statusAll, setStatus] = useState(null);
  const [genderDetails, setGenderDetails] = useState([]);
  const [eligiblityDocuments, setEligiblityDocuments] = useState([]);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [newSchemeDetails, setNewSchemeDetails] = useState([]);
  // const authority = user?.menus?.find((r) => {
  //   return r.id == selectedMenuFromDrawer;
  // })?.roles;
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const [userLst, setUserLst] = useState([]);
  const [remarkTableData, setRemarkData] = useState([]);
  const [subSchemeVal, setSubScheme] = useState();
  const [mainSchemeVal, setMainScheme] = useState();
  const [bankDoc, setBankDoc] = useState([]);

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
    getZoneName();
    getWardNames();
    getCRAreaName();
    getCastDetails();
    getBankMasters();
    getGenders();
    getReligionDetails();
    getUser();
    getAllStatus()
    getAllCasteOptions()
  }, []);

  useEffect(() => {
    setNewSchemeDetails(props.data);
    setBachatGatCategoryNewSchemes(props.data);
  }, [props && zoneNames && crAreaNames && wardNames && mainNames]);

  useEffect(() => {
    getMainScheme();
    getSubScheme();
  }, []);

  useEffect(() => {
    getDependency();
  }, [mainSchemeVal]);

  // useEffect(() => {
  //   getCastFromReligion();
  // }, [watch("religionKey ", watch("religionKey"))]);

  // get gender
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

  // religion details
  const getReligionDetails = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setReligionNames(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
            religionMr: row.religionMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const bankDocumentCol = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "title",
      headerName: <FormattedLabel id="docName" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "filenm",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },

    {
      field: "Action",
      headerName: <FormattedLabel id="view" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
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
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                //   "_blank"
                // );
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
  // table header
  const docColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "informationTitle",
      headerName: <FormattedLabel id="infoTitle" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: "fileName",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
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
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.path}`,
                //   "_blank"
                // );
                getFilePreview(record?.row?.path);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

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

  // eligiblity criteria table header
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
      width: 200,
    },
  ];

  // load cast from religion
  // const getCastFromReligion = () => {
  //   if (watch("religionKey")) {
  //     axios
  //       .get(
  //         `${urls.SLUMURL}/master/cast/getCastFromReligion?id=${watch(
  //           "religionKey"
  //         )}`,
  //         { headers: headers }
  //       )
  //       .then((r) => {
  //         setCastNames(
  //           r.data.mCast.map((row) => ({
  //             id: row.id,
  //             cast: row.cast,
  //             castMr: row.castMr,
  //           }))
  //         );
  //       })
  //       .catch((err) => {
  //         cfcErrorCatchMethod(err, false);
  //       });
  //   }
  // };

  // get bachatgat category new scheme
  const getBachatGatCategoryNewScheme = () => {
    if (router.query.id) {
      if (loggedUser === "citizenUser") {
        axios
          .get(
            `${urls.BSUPURL}/trnSchemeApplicationNew/getById?id=${router.query.id}`,
            {
              headers: headers,
            }
          )
          .then((r) => {
            setNewSchemeDetails(r.data);
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, false);
          });
      } else {
        axios
          .get(
            `${urls.BSUPURL}/trnSchemeApplicationNew/getById?id=${router.query.id}`,
            {
              headers: headers,
            }
          )
          .then((r) => {
            setNewSchemeDetails(r.data);
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, false);
          });
      }
    }
  };
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
  // set bachatgat category on UI
  const setBachatGatCategoryNewSchemes = (_res) => {
    setMainScheme(_res.mainSchemeKey);
    setApplicationNo(_res.applicationNo);
    setEligiblityCriteriaDetails(
      _res.trnSchemeApplicationDataDaoList &&
        _res.trnSchemeApplicationDataDaoList
    );
    setValue('casteOption',_res.castOptionKey)
    setValue("applicantFirstName", _res.applicantFirstName);
    setValue("applicantMiddleName", _res.applicantMiddleName);
    setValue("applicantLastName", _res.applicantLastName);
    setValue("buildingName", _res.buildingName);
    setValue("roadName", _res.roadName);
    setValue("applicantAadharNo", _res.applicantAadharNo);
    setValue("emailId", _res.emailId);
    setValue("mobileNo", _res.mobileNo);
    setValue("benecode", _res.beneficiaryCode);
    setValue(
      "zoneKey",
      language == "en"
        ? zoneNames?.find((obj) => obj.id == _res.zoneKey)?.zoneName
          ? zoneNames?.find((obj) => obj.id == _res.zoneKey)?.zoneName
          : "-"
        : zoneNames?.find((obj) => obj.id == _res.zoneKey)?.zoneNameMr
        ? zoneNames?.find((obj) => obj.id == _res.zoneKey)?.zoneNameMr
        : "-"
    );
    setValue(
      "wardKey",
      language == "en"
        ? wardNames?.find((obj) => obj.id == _res.wardKey)?.wardName
          ? wardNames?.find((obj) => obj.id == _res.wardKey)?.wardName
          : "-"
        : wardNames?.find((obj) => obj.id == _res.wardKey)?.wardNameMr
        ? wardNames?.find((obj) => obj.id == _res.wardKey)?.wardNameMr
        : "-"
    );
    setValue(
      "areaKey",
      language == "en"
        ? crAreaNames?.find((obj) => obj.id == _res.areaKey)?.crAreaName
          ? crAreaNames?.find((obj) => obj.id == _res.areaKey)?.crAreaName
          : "-"
        : crAreaNames?.find((obj) => obj.id == _res.areaKey)?.crAreaNameMr
        ? crAreaNames?.find((obj) => obj.id == _res.areaKey)?.crAreaNameMr
        : "-"
    );
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
    setValue("remarks", _res?.remarks ? _res?.remarks : "-");
    setValue(
      "bankNameId",
      bankMaster?.find((obj) => obj.id == _res.bankBranchKey)?.bankName
        ? bankMaster?.find((obj) => obj.id == _res.bankBranchKey)?.bankName
        : "-"
    );
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
    setValue(
      "subSchemeKey",
      language == "en"
        ? subSchemeNames?.find((obj) => obj.id == _res.subSchemeKey)
            ?.subSchemeName
          ? subSchemeNames?.find((obj) => obj.id == _res.subSchemeKey)
              ?.subSchemeName
          : "-"
        : subSchemeNames?.find((obj) => obj.id == _res.subSchemeKey)
            ?.subSchemeNameMr
        ? subSchemeNames?.find((obj) => obj.id == _res.subSchemeKey)
            ?.subSchemeNameMr
        : "-"
    );
    setSubScheme(_res.subSchemeKey);
    setEligiblityDocuments(_res.trnSchemeApplicationDocumentsList);
    setValue("fromDate", _res?.fromDate ? _res?.fromDate : null);
    setValue("bankBranchKey", _res.branchName);
    setValue("toDate", _res?.toDate ? _res?.toDate : null);
    setValue(
      "schemeRenewalDate",
      _res?.schemeRenewalDate ? _res?.schemeRenewalDate : null
    );
    setValue(
      "gender",
      genderDetails?.find((obj) => {
        return obj.id == _res?.gender;
      })
        ? genderDetails.find((obj) => {
            return obj.id == _res?.gender;
          }).gender
        : "-"
    );
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
    setValue("casteCategoryKey", _res?.casteCategory);
    setValue(
      "mainSchemeKey",
      language == "en"
        ? mainNames?.find((obj) => obj.id == _res.mainSchemeKey)?.schemeName
          ? mainNames?.find((obj) => obj.id == _res.mainSchemeKey)?.schemeName
          : "-"
        : mainNames?.find((obj) => obj.id == _res.mainSchemeKey)?.schemeNameMr
        ? mainNames?.find((obj) => obj.id == _res.mainSchemeKey)?.schemeNameMr
        : "-"
    );
    setStatusVal(_res.status);
    setValue("divyangSchemeTypeKey", _res.divyangSchemeTypeKey);
    setValue("saSanghatakRemark", _res.saSanghatakRemark);
    setValue("deptClerkRemark", _res.deptClerkRemark);
    setValue("deptyCommissionerRemark", _res.deptyCommissionerRemark);
    setValue("asstCommissionerRemark", _res.asstCommissionerRemark);
    setCurrentStatus(manageStatus(_res?.status, language, statusAll));

    const bankDoc = [];
    if (_res.passbookFrontPage && _res.passbookLastPage) {
      bankDoc.push({
        id: 1,
        title: "Passbook Front Page",
        documentType: "r.documentType",
        documentPath: _res.passbookFrontPage,
        filenm:
          _res.passbookFrontPage &&
          DecryptData("passphraseaaaaaaaaupload",  _res.passbookFrontPage).split("/").pop().split("_").pop(),
      });
      bankDoc.push({
        id: 2,
        title: "Passbook Back Page",
        documentType: "r.documentType",
        documentPath: _res.passbookLastPage,
        filenm:
          _res.passbookLastPage &&
          DecryptData("passphraseaaaaaaaaupload",  _res.passbookLastPage).split("/").pop().split("_").pop(),
      });
    } else if (_res.passbookLastPage) {
      bankDoc.push({
        id: 14,
        title: "Passbook Back Page",
        documentType: "r.documentType",
        documentPath: _res.passbookLastPage,
        filenm:
          _res.passbookLastPage &&
          DecryptData("passphraseaaaaaaaaupload", _res.passbookLastPage).split("/").pop().split("_").pop(),
      });
    } else if (_res.passbookFrontPage) {
      bankDoc.push({
        id: 15,
        title: "Passbook Front Page",
        documentPath: _res.passbookFrontPage,
        filenm:
          _res.passbookFrontPage &&
          DecryptData("passphraseaaaaaaaaupload",  _res.passbookFrontPage).split("/").pop().split("_").pop(),
      });
    }
    setBankDoc([...bankDoc]);
    //   }
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
            id: eligiblityDocuments[j].schemesConfigDocumentsKey,
            informationTitle: docUpload[i].informationTitle,
            name: docUpload[i].informationTitle,
            fileName:
              eligiblityDocuments[j].documentPath &&
              DecryptData("passphraseaaaaaaaaupload",eligiblityDocuments[j].documentPath)
                .split("/")
                .pop()
                .split("_")
                .pop(),
            path: eligiblityDocuments[j].documentPath,
          });
          setFetchDocuments([...res]);
        }
      }
    }
  }, [docUpload, eligiblityDocuments]);

  useEffect(() => {
    setDataToTable();
  }, [newSchemeDetails, userLst]);

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

  // approval section remark columns
  const approveSectionCol = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      // flex: 1,
    },
    {
      field: "userName",
      headerName: <FormattedLabel id="userName" />,
      headerAlign: "center",
      align: "left",
      // width: 200,
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="design" />,
      headerAlign: "center",
      align: "left",
      // width: 200,
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
      width: 900,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "remarkDate",
      headerName: <FormattedLabel id="remarkDate" />,
      headerAlign: "center",
      align: "center",
      // width: 200,
      flex: 1,
    },
  ];

  // get zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setZoneNames(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get ward
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setWardNames(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          }))
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
        setCRAreaName(
          r.data.area.map((row) => ({
            id: row.id,
            crAreaName: row.areaName,
            crAreaNameMr: row.areaNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get main scheme
  const getMainScheme = () => {
    if (loggedUser === "citizenUser") {
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
            }))
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else {
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
            }))
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // get sub scheme
  const getSubScheme = () => {
    if (loggedUser === "citizenUser") {
      axios
        .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
          headers: headers,
        })
        .then((r) => {
          setSubSchemeNames(
            r.data.mstSubSchemesList.map((row) => ({
              id: row.id,
              subSchemeName: row.subSchemeName,
              subSchemeNameMr: row.subSchemeNameMr,
            }))
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else {
      axios
        .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
          headers: headers,
        })
        .then((r) => {
          setSubSchemeNames(
            r.data.mstSubSchemesList.map((row) => ({
              id: row.id,
              subSchemeName: row.subSchemeName,
              subSchemeNameMr: row.subSchemeNameMr,
            }))
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // get dependancy(Eligiblity)
  const getDependency = () => {
    if (subSchemeVal && mainSchemeVal) {
      if (loggedUser === "citizenUser") {
        axios
          .get(
            `${urls.BSUPURL}/mstSchemesConfigData/getAllBySchemeConfigAndSubSchemeKey?schemeConfigKey=${mainSchemeVal}&subSchemeKey=${subSchemeVal}`,
            {
              headers: headers,
            }
          )
          .then((r) => {
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
                  documentPath: "",
                }))
            );
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
                }))
            );
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, false);
          });
      } else {
        axios
          .get(
            `${urls.BSUPURL}/mstSchemesConfigData/getAllBySchemeConfigAndSubSchemeKey?schemeConfigKey=${mainSchemeVal}&subSchemeKey=${subSchemeVal}`,
            {
              headers: headers,
            }
          )
          .then((r) => {
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
                  documentPath: "",
                }))
            );
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
                }))
            );
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, false);
          });
      }
    }
  };

  // get cast details
  const getCastDetails = () => {
    axios
    .get(`${urls.CFCURL}/castCategory/getAll`, {
      headers: headers,
    })
    .then((r) => {
      setCastNames(
        r.data.castCategory.map((row) => ({
          id: row.id,
          castCategory: row.castCategory,
        }))
      );
    })
    .catch((err) => {
      cfcErrorCatchMethod(err, true);
    });
  };

  // bank master
  const getBankMasters = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setBankMasters(r.data.bank);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // onsubmit(update status)
  const onSubmitForm = (formData) => {
    const temp = {
      ...newSchemeDetails,
      saSanghatakRemark: watch("saSanghatakRemark"),
      deptClerkRemark: watch("deptClerkRemark"),
      asstCommissionerRemark: watch("asstCommissionerRemark"),
      deptyCommissionerRemark: watch("deptyCommissionerRemark"),
      isApproved:
        formData === "Save" ? true : formData === "Revert" ? false : "false",
      isBenifitedPreviously: false,
      isComplete: false,
      isDraft: false,
      status: formData === "Reject" ? 22 : statusVal,
    };
    if (loggedUser === "citizenUser") {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
          headers: headers,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              formData === "Save"
                ? language === "en"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Approved successfully !`
                  : `
                अर्ज क्र ${
                  res.data.message.split("[")[1].split("]")[0]
                } यशस्वीरित्या मंजूर केले!`
                : formData === "Revert"
                ? language === "en"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Reverted successfully !`
                  : `अर्ज क्र ${res.data.message.split("[")[1].split("]")[0]} 
                यशस्वीरित्या परत केले!`
                : language === "en"
                ? `Application no ${
                    res.data.message.split("[")[1].split("]")[0]
                  } Rejected successfully !`
                : `अर्ज क्र ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या नाकारले!`,
              language === "en" ? "success" : "यशस्वी"
            );
            router.push({
              pathname:
                "/BsupNagarvasthi/transaction/newApplicationScheme/list",
            });
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
          headers: headers,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              formData === "Save"
                ? language === "en"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Approved successfully !`
                  : `
              अर्ज क्र ${
                res.data.message.split("[")[1].split("]")[0]
              } यशस्वीरित्या मंजूर केले!`
                : formData === "Revert"
                ? language === "en"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Reverted successfully !`
                  : `अर्ज क्र ${res.data.message.split("[")[1].split("]")[0]} 
              यशस्वीरित्या परत केले!`
                : language === "en"
                ? `Application no ${
                    res.data.message.split("[")[1].split("]")[0]
                  } Rejected successfully !`
                : `अर्ज क्र ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या नाकारले!`,
              language === "en" ? "success" : "यशस्वी"
            );
            router.push({
              pathname:
                "/BsupNagarvasthi/transaction/newApplicationScheme/list",
            });
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // accountant remark save
  const saveAccountant = () => {
    const temp = {
      ...newSchemeDetails,
      isBenifitedPreviously: false,
      isComplete: true,
      isDraft: false,
      transactionNo: watch("chequeNo"),
      amountPaid: watch("amount"),
      paymentDate: watch("paymentDate"),
    };
    if (loggedUser === "citizenUser") {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
          headers: headers,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              formData === "Save"
                ? language === "en"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Approved successfully !`
                  : `
              अर्ज क्र ${
                res.data.message.split("[")[1].split("]")[0]
              } यशस्वीरित्या मंजूर केले!`
                : formData === "Revert"
                ? language === "en"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Reverted successfully !`
                  : `अर्ज क्र ${res.data.message.split("[")[1].split("]")[0]} 
              यशस्वीरित्या परत केले!`
                : language === "en"
                ? `Application no ${
                    res.data.message.split("[")[1].split("]")[0]
                  } Rejected successfully !`
                : `अर्ज क्र ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या नाकारले!`,
              language === "en" ? "success" : "यशस्वी"
            );
            router.push({
              pathname:
                "/BsupNagarvasthi/transaction/newApplicationScheme/list",
            });
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
          headers: headers,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? `Application no ${
                    res.data.message.split("[")[1].split("]")[0]
                  } Payment succesful !`
                : `अर्ज क्र ${
                    res.data.message.split("[")[1].split("]")[0]
                  } पेमेंट यशस्वी झाले!`,
              language === "en" ? "success" : "यशस्वी"
            );
            router.push({
              pathname:
                "/BsupNagarvasthi/transaction/newApplicationScheme/list",
            });
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // UI
  return (
    <ThemeProvider theme={theme}>
      <>{/* <BreadcrumbComponent /> */}</>
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
              lg={6}
              xl={6}
              sx={{
                // dispaly:"flex",
                // justifyContent: "left",
                // alignItems: "left",
                "@media (max-width: 390px)": {
                  display: "grid",
                },
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  // marginLeft: 30,
                }}
              >
                <FormattedLabel id="applicationNo" /> :
              </label>
              <label
                style={{
                  fontSize: "18px",
                  gap: 3,
                }}
              >
                {appliNo}
              </label>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={6}
              xl={6}
              // style={{
              //   display: "flex",
              //   justifyContent: "left",
              //   alignItems: "left",
              // }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  // marginLeft: 30,
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
            {/* area name */}
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
                // sx={{ width: 230 }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="areaNm" />}
                multiline
                variant="standard"
                {...register("areaKey")}
                error={!!errors.areaKey}
                helperText={errors?.areaKey ? errors.areaKey.message : null}
              />
            </Grid>
            {/* Zone Name */}
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
                // sx={{ width: 230 }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="zoneNames" />}
                multiline
                variant="standard"
                {...register("zoneKey")}
                error={!!errors.zoneKey}
                helperText={errors?.zoneKey ? errors.zoneKey.message : null}
              />
            </Grid>
            {/* Ward name */}
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
                // sx={{ width: 230 }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="wardname" />}
                multiline
                variant="standard"
                {...register("wardKey")}
                error={!!errors.wardKey}
                helperText={errors?.wardKey ? errors.wardKey.message : null}
              />
            </Grid>
            {/* Beneficiary Code */}
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
                label={<FormattedLabel id="beneficiaryCode" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("benecode")}
                error={!!errors.benecode}
                helperText={errors?.benecode ? errors.benecode.message : null}
              />
            </Grid>
            {/* main shceme */}
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
                // sx={{ width: 230 }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="mainScheme" />}
                multiline
                variant="standard"
                {...register("mainSchemeKey")}
                error={!!errors.mainSchemeKey}
                helperText={
                  errors?.mainSchemeKey ? errors.mainSchemeKey.message : null
                }
              />
            </Grid>
            {/* Sub Scheme Key */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                // sx={{ width: "84%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-textarea"
                label={<FormattedLabel id="subScheme" />}
                multiline
                variant="standard"
                {...register("subSchemeKey")}
                error={!!errors.subSchemeKey}
                helperText={
                  errors?.subSchemeKey ? errors.subSchemeKey.message : null
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
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
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="gender" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("gender")}
                error={!!errors.gender}
                helperText={errors?.gender ? errors.gender.message : null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
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
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="flatBuildNo" />}
                variant="standard"
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                label={<FormattedLabel id="roadName" />}
                variant="standard"
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("landmark")}
                error={!!errors.landmark}
                helperText={errors?.landmark ? errors.landmark.message : null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("geoCode")}
                error={!!errors.geoCode}
                helperText={errors?.geoCode ? errors.geoCode.message : null}
              />
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
                id="standard-basic"
                label={<FormattedLabel id="applicantAdharNo" />}
                variant="standard"
                // sx={{
                //   width: "90%",
                // }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={true}
                InputLabelProps={{ shrink: true }}
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
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="dateOfBirth" />}
                variant="standard"
                // sx={{
                //   width: "90%",
                // }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("dateOfBirth")}
                error={!!errors.dateOfBirth}
                helperText={
                  errors?.dateOfBirth ? errors.dateOfBirth.message : null
                }
              />
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
                label={<FormattedLabel id="age" />}
                type="number"
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
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
                disabled={true}
                InputLabelProps={{ shrink: true }}
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={true}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      {...field}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);

                        castNames?.find(
                          (val) => val.id === value.target.value && val
                        )
                          ? setCastDependent([
                              castNames?.find(
                                (val) => val.id === value.target.value && val
                              ),
                            ])
                          : [];
                      }}
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
                error={errors.casteCategoryKey}
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={true}
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
                  name="casteCategoryKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.casteCategoryKey ? errors.casteCategoryKey.message : null}
                </FormHelperText>
              </FormControl>
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
                error={errors.casteOption}
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
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      disabled={true}
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
                  name="casteOption"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.casteOption ? errors.casteOption.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
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
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={true}
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
            {/* Divyang Scheme Type */}
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
                      InputLabelProps={{
                        shrink: true,
                      }}
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
          </Grid>
          {/* <Grid container spacing={2} sx={{ padding: "1rem" }}>
              
            </Grid> */}
          {
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
          }
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
              <TextField
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankName" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("bankNameId")}
                error={!!errors.bankNameId}
                helperText={
                  errors?.bankNameId ? errors.bankNameId.message : null
                }
              />
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
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("bankBranchKey")}
                error={!!errors.bankBranchKey}
                helperText={
                  errors?.bankBranchKey ? errors.bankBranchKey.message : null
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
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
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
                label={<FormattedLabel id="bankIFSC" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("ifscCode")}
                error={!!errors.ifscCode}
                helperText={errors?.ifscCode ? errors.ifscCode.message : null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
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
                label={<FormattedLabel id="bankMICR" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("micrCode")}
                error={!!errors.micrCode}
                helperText={errors?.micrCode ? errors.micrCode.message : null}
              />
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
                label={<FormattedLabel id="savinAcFirstNm" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("saOwnerFirstName")}
                error={!!errors.saOwnerFirstName}
                helperText={
                  errors?.saOwnerFirstName
                    ? errors.saOwnerFirstName.message
                    : null
                }
              />
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
                label={<FormattedLabel id="savingAcMiddleNm" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("saOwnerMiddleName")}
                error={!!errors.saOwnerMiddleName}
                helperText={
                  errors?.saOwnerMiddleName
                    ? errors.saOwnerMiddleName.message
                    : null
                }
              />
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
                label={<FormattedLabel id="savingAcLastNm" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
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
          {bankDoc.length != 0 && (
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
              rowsPerPageOptions={[10]}
              rows={bankDoc}
              columns={bankDocumentCol}
            />
          )}
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
            rowsPerPageOptions={[10]}
            rows={fetchDocument}
            columns={docColumns}
          />
          {/* <Grid container sx={{ padding: "10px" }}></Grid> */}
          {((loggedUser != "citizenUser" &&
            loggedUser != "cfcUser" &&
            // (authority && authority.find((val) => val != "PAYMENT VERIFICATION")
            (authority &&
            authority.find((val) => val != bsupUserRoles.roleAccountant)
              ? true
              : statusVal == 10 ||
                statusVal == 9 ||
                statusVal === 19 ||
                statusVal === 20
              ? true
              : false)) ||
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
          {(loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
            (statusVal === 22 || statusVal === 1) && (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                //   padding: 4,
                // }}
              >
                <TextField
                  // sx={{ width: "90%" }}
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
            )}
          {loggedUser != "citizenUser" &&
            loggedUser != "cfcUser" &&
            remarkTableData.length != 0 && (
              <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",
                  "& .MuiDataGrid-virtualScrollerContent": {},
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  marginTop: "10px",
                }}
                density="comfortable"
                rowHeight={50}
                rowCount={remarkTableData.length}
                pageSize={10}
                rows={remarkTableData}
                columns={approveSectionCol}
                onPageChange={(_data) => {}}
                onPageSizeChange={(_data) => {}}
              />
            )}
          {(statusVal == 2 || statusVal == 23) &&
            authority &&
            // authority.find((val) => val === "SAMUHA SANGHATAK") && (
            authority.find(
              (val) => val === bsupUserRoles.roleSamuhaSanghatak
            ) && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="saSanghatakRemark" />}
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={
                    statusVal != 2 && statusVal != 23
                      ? true
                      : authority &&
                        // authority.find((val) => val === "SAMUHA SANGHATAK")
                        authority.find(
                          (val) => val === bsupUserRoles.roleSamuhaSanghatak
                        )
                      ? false
                      : true
                  }
                  {...register("saSanghatakRemark")}
                  error={!!errors.saSanghatakRemark}
                  helperText={
                    errors?.saSanghatakRemark
                      ? errors.saSanghatakRemark.message
                      : null
                  }
                />
              </Grid>
            )}
          {(statusVal == 3 || statusVal == 4) &&
            authority &&
            // authority.find((val) => val === "PROPOSAL APPROVAL") && (
            authority.find((val) => val === bsupUserRoles.roleZonalClerk) && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="deptClerkRemark" />}
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("deptClerkRemark")}
                  disabled={
                    statusVal != 3 && statusVal != 4
                      ? true
                      : authority &&
                        // authority.find((val) => val === "PROPOSAL APPROVAL")
                        authority.find(
                          (val) => val === bsupUserRoles.roleZonalClerk
                        )
                      ? false
                      : true
                  }
                  error={!!errors.deptClerkRemark}
                  helperText={
                    errors?.deptClerkRemark
                      ? errors.deptClerkRemark.message
                      : null
                  }
                />
              </Grid>
            )}
          {(statusVal == 5 || statusVal == 6) &&
            authority &&
            // authority.find((val) => val === "APPROVAL") && (
            authority.find((val) => val === bsupUserRoles.roleZonalOfficer) && (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                //   padding: 4,
                // }}
              >
                <TextField
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="asstCommissionerRemark" />}
                  variant="standard"
                  disabled={
                    statusVal != 5 && statusVal != 6
                      ? true
                      : // : authority && authority.find((val) => val === "APPROVAL")
                      authority &&
                        authority.find(
                          (val) => val === bsupUserRoles.roleZonalOfficer
                        )
                      ? false
                      : true
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("asstCommissionerRemark")}
                  error={!!errors.asstCommissionerRemark}
                  helperText={
                    errors?.asstCommissionerRemark
                      ? errors.asstCommissionerRemark.message
                      : null
                  }
                />
              </Grid>
            )}
          {statusVal == 7 &&
            authority &&
            // authority.find((val) => val === "FINAL_APPROVAL") && (
            authority.find((val) => val === bsupUserRoles.roleHOClerk) && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="deptyCommissionerRemark" />}
                  variant="standard"
                  disabled={statusVal != 7 ? true : false}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("deptyCommissionerRemark")}
                  error={!!errors.deptyCommissionerRemark}
                  helperText={
                    errors?.deptyCommissionerRemark
                      ? errors.deptyCommissionerRemark.message
                      : null
                  }
                />
              </Grid>
            )}
          {(((statusVal == 2 || statusVal == 23) &&
            authority &&
            // authority.find((val) => val === "SAMUHA SANGHATAK")) ||
            authority.find(
              (val) => val === bsupUserRoles.roleSamuhaSanghatak
            )) ||
            ((statusVal == 5 || statusVal == 6) &&
              authority &&
              // authority.find((val) => val === "APPROVAL")) ||
              authority.find(
                (val) => val === bsupUserRoles.roleZonalOfficer
              )) ||
            ((statusVal == 3 || statusVal == 4) &&
              authority &&
              // authority.find((val) => val === "PROPOSAL APPROVAL")) ||
              authority.find((val) => val === bsupUserRoles.roleZonalClerk)) ||
            (statusVal == 7 &&
              authority &&
              // authority.find((val) => val === "FINAL_APPROVAL"))) && (
              authority.find((val) => val === bsupUserRoles.roleHOClerk))) && (
            <Grid container spacing={2} sx={{ padding: "10px" }}>
              <Grid
                item
                xl={
                  authority &&
                  // authority.find((val) => val === "SAMUHA SANGHATAK")
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  )
                    ? 4
                    : 6
                }
                lg={
                  authority &&
                  // authority.find((val) => val === "SAMUHA SANGHATAK")
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  )
                    ? 4
                    : 6
                }
                md={
                  authority &&
                  // authority.find((val) => val === "SAMUHA SANGHATAK")
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  )
                    ? 4
                    : 6
                }
                sm={
                  authority &&
                  // authority.find((val) => val === "SAMUHA SANGHATAK")
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  )
                    ? 4
                    : 6
                }
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() => {
                    onSubmitForm("Save");
                  }}
                  className={commonStyles.buttonApprove}
                  disabled={
                    (authority &&
                      // authority.find((val) => val === "SAMUHA SANGHATAK") &&
                      authority.find(
                        (val) => val === bsupUserRoles.roleSamuhaSanghatak
                      ) &&
                      watch("saSanghatakRemark")) ||
                    (authority &&
                      authority.find(
                        (val) =>
                          // val === "PROPOSAL APPROVAL" &&
                          val === bsupUserRoles.roleZonalClerk &&
                          watch("deptClerkRemark")
                      )) ||
                    (authority &&
                      // authority.find((val) => val === "APPROVAL") &&
                      authority.find(
                        (val) => val === bsupUserRoles.roleZonalOfficer
                      ) &&
                      watch("asstCommissionerRemark")) ||
                    (authority &&
                      // authority.find((val) => val === "FINAL_APPROVAL") &&
                      authority.find(
                        (val) => val === bsupUserRoles.roleHOClerk
                      ) &&
                      watch("deptyCommissionerRemark"))
                      ? false
                      : true
                  }
                  variant="contained"
                  color="success"
                >
                  <FormattedLabel id="approvebtn" />
                </Button>
              </Grid>
              <Grid
                item
                xl={
                  authority &&
                  // authority.find((val) => val === "SAMUHA SANGHATAK")
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  )
                    ? 4
                    : 6
                }
                lg={
                  authority &&
                  // authority.find((val) => val === "SAMUHA SANGHATAK")
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  )
                    ? 4
                    : 6
                }
                md={
                  authority &&
                  // authority.find((val) => val === "SAMUHA SANGHATAK")
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  )
                    ? 4
                    : 6
                }
                sm={
                  authority &&
                  // authority.find((val) => val === "SAMUHA SANGHATAK")
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  )
                    ? 4
                    : 6
                }
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  className={commonStyles.buttonRevert}
                  disabled={
                    (authority &&
                      // authority.find((val) => val === "SAMUHA SANGHATAK") &&
                      authority.find(
                        (val) => val === bsupUserRoles.roleSamuhaSanghatak
                      ) &&
                      watch("saSanghatakRemark")) ||
                    (authority &&
                      authority.find(
                        (val) =>
                          // val === "PROPOSAL APPROVAL" &&
                          val === bsupUserRoles.roleZonalClerk &&
                          watch("deptClerkRemark")
                      )) ||
                    (authority &&
                      // authority.find((val) => val === "APPROVAL") &&
                      authority.find(
                        (val) => val === bsupUserRoles.roleZonalOfficer
                      ) &&
                      watch("asstCommissionerRemark")) ||
                    (authority &&
                      // authority.find((val) => val === "FINAL_APPROVAL") &&
                      authority.find(
                        (val) => val === bsupUserRoles.roleHOClerk
                      ) &&
                      watch("deptyCommissionerRemark"))
                      ? false
                      : true
                  }
                  onClick={() => {
                    onSubmitForm("Revert");
                  }}
                  variant="contained"
                  color="secondary"
                >
                  <FormattedLabel id="revertbtn" />
                </Button>
              </Grid>

              {authority &&
                // authority.find((val) => val === "SAMUHA SANGHATAK") && (
                authority.find(
                  (val) => val === bsupUserRoles.roleSamuhaSanghatak
                ) && (
                  <Grid
                    item
                    xl={
                      authority &&
                      // authority.find((val) => val === "SAMUHA SANGHATAK")
                      authority.find(
                        (val) => val === bsupUserRoles.roleSamuhaSanghatak
                      )
                        ? 4
                        : 6
                    }
                    lg={
                      authority &&
                      // authority.find((val) => val === "SAMUHA SANGHATAK")
                      authority.find(
                        (val) => val === bsupUserRoles.roleSamuhaSanghatak
                      )
                        ? 4
                        : 6
                    }
                    md={
                      authority &&
                      // authority.find((val) => val === "SAMUHA SANGHATAK")
                      authority.find(
                        (val) => val === bsupUserRoles.roleSamuhaSanghatak
                      )
                        ? 4
                        : 6
                    }
                    sm={
                      authority &&
                      // authority.find((val) => val === "SAMUHA SANGHATAK")
                      authority.find(
                        (val) => val === bsupUserRoles.roleSamuhaSanghatak
                      )
                        ? 4
                        : 6
                    }
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      className={commonStyles.buttonReject}
                      disabled={
                        (authority &&
                          // authority.find((val) => val === "SAMUHA SANGHATAK") &&
                          authority.find(
                            (val) => val === bsupUserRoles.roleSamuhaSanghatak
                          ) &&
                          watch("saSanghatakRemark")) ||
                        (authority &&
                          authority.find(
                            (val) =>
                              // val === "PROPOSAL APPROVAL" &&
                              val === bsupUserRoles.roleZonalClerk &&
                              watch("deptClerkRemark")
                          )) ||
                        (authority &&
                          // authority.find((val) => val === "APPROVAL") &&
                          authority.find(
                            (val) => val === bsupUserRoles.roleZonalOfficer
                          ) &&
                          watch("asstCommissionerRemark")) ||
                        (authority &&
                          // authority.find((val) => val === "FINAL_APPROVAL") &&
                          authority.find(
                            (val) => val === bsupUserRoles.roleHOClerk
                          ) &&
                          watch("deptyCommissionerRemark"))
                          ? false
                          : true
                      }
                      onClick={() => {
                        onSubmitForm("Reject");
                      }}
                      variant="contained"
                      color="error"
                    >
                      <FormattedLabel id="rejectBtn" />
                    </Button>
                  </Grid>
                )}
            </Grid>
          )}

          {(((statusVal == 10 ||
            statusVal == 9 ||
            statusVal === 19 ||
            statusVal === 20) &&
            authority &&
            // authority?.find((val) => val === "PAYMENT VERIFICATION")) ||
            authority?.find((val) => val === bsupUserRoles.roleAccountant)) ||
            ((loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
              statusVal == 10) ||
            statusVal === 19 ||
            statusVal === 20) && (
            <>
              {" "}
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
                        <FormattedLabel id="accountantSection" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                {/*  Mobile*/}
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
                    // style={{ backgroundColor: "white", width: 230 }}
                    sx={{
                      m: { xs: 0, md: 1 },
                      backgroundColor: "white",
                      minWidth: "100%",
                    }}
                    // sx={{ marginTop: 2 }}
                    error={!!errors.paymentDate}
                  >
                    <Controller
                      control={control}
                      name="paymentDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled={statusVal != 9 ? true : false}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 14 }}>
                                {<FormattedLabel id="paymentDate" required />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                // fullWidth
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                InputLabelProps={{
                                  style: {
                                    fontSize: 12,
                                    marginTop: 3,
                                  },
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.paymentDate ? errors.paymentDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/*  Email Address */}
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
                    // sx={{ width: "230px" }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-basic"
                    disabled={statusVal != 9 ? true : false}
                    InputLabelProps={{ shrink: true }}
                    label={<FormattedLabel id="chequeNo" />}
                    variant="standard"
                    type="number"
                    {...register("chequeNo")}
                    error={!!errors.chequeNo}
                    helperText={
                      errors?.chequeNo ? errors.chequeNo.message : null
                    }
                  />
                </Grid>
                {/* Religion */}
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
                    // sx={{ width: "230px" }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-basic"
                    disabled={statusVal != 9 ? true : false}
                    InputLabelProps={{ shrink: true }}
                    label={<FormattedLabel id="billAmount" />}
                    variant="standard"
                    {...register("amount")}
                    error={!!errors.amount}
                    helperText={errors?.amount ? errors.amount.message : null}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {authority &&
            // authority.find((val) => val === "PAYMENT VERIFICATION") &&
            authority.find((val) => val === bsupUserRoles.roleAccountant) &&
            statusVal == 9 && (
              <Grid container sx={{ padding: "10px" }}>
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
                  }}
                >
                  <Button
                    className={commonStyles.buttonApprove}
                    disabled={
                      watch("amount") &&
                      watch("chequeNo") &&
                      watch("paymentDate")
                        ? false
                        : true
                    }
                    onClick={() => {
                      saveAccountant();
                    }}
                    variant="contained"
                    color="success"
                  >
                    <FormattedLabel id="approvebtn" />
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
                  }}
                >
                  <Button
                    className={commonStyles.buttonExit}
                    onClick={() => {
                      setValue("chequeNo", ""),
                        setValue("amount", ""),
                        setValue("paymentDate", "");
                    }}
                    variant="contained"
                    color="error"
                  >
                    <FormattedLabel id="cancel" />
                  </Button>
                </Grid>
              </Grid>
            )}

          {(loggedUser === "citizenUser" || loggedUser === "cfcUser") && (
            <div className={styles.btn}>
              <Button
                variant="contained"
                type="primary"
                className={commonStyles.buttonPrint}
              >
                <FormattedLabel id="print" />
              </Button>
              <Button
                type="primary"
                className={commonStyles.buttonExit}
                color="error"
                variant="contained"
                onClick={() => {
                  router.push("/BsupNagarvasthi/transaction/helpDesk");
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </div>
          )}
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategorySchemes;
