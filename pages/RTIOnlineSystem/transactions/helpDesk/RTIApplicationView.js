import {
  Box,
  FormLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import theme from "../../../../theme";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import trnRtiApplicationSchema from "../../../../containers/schema/rtiOnlineSystemSchema/trnRtiApplicationSchema";
import urls from "../../../../URLS/urls";
import loiGeneratedSchema from "../../../../containers/schema/rtiOnlineSystemSchema/loiGeneratedSchema";
import roleId from "../../../../components/rtiOnlineSystem/commonRoleId";
import { useSelector } from "react-redux";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import {
  EncryptData,
  DecryptData,
} from "../../../../components/common/EncryptDecrypt";
import UploadButton1 from "../../Document/UploadButton1";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
import PostData from "../../transactions/postJson.json";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const EntryForm = (props) => {
  const {
    methods,
    setValue,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(trnRtiApplicationSchema),
    mode: "onChange",
  });

  const {
    register: register1,
    handleSubmit: handleSubmit2,
    methods: methods2,
    watch: watch1,
    control: control2,
    setValue: setValue1,
    formState: { errors: error2 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(loiGeneratedSchema),
  });
  const [amountValue, setAmountValue] = useState([]);

  const [mediumMaster, setMediumMaster] = useState([]);
  const [amount, setRatePerPage] = useState(null);
  const [zoneDetails, setZoneDetails] = useState();
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const router = useRouter();
  const [applications, setApplicationDetails] = useState(null);
  const [isBplval, setIsBpl] = useState(null);
  const [statusVal, setStatusVal] = useState(null);
  const [genderDetails, setGenderDetails] = useState([]);
  const [chargeTypeDetails, setChargeTypeDetails] = useState([]);
  let user = useSelector((state) => state.user.user);
  const [loiDetails, setLoiDetails] = useState([]);
  const [applicationId, setApplicationID] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [childDept, setChildDept] = useState([]);
  const [completeAttach, setCompleteAttach] = useState([]);
  const [applicationNumber, setApplicationNumber] = useState(null);
  const [hasDependant, setHasDependant] = useState(false);
  const logedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state?.labels?.language);
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [rateChartList, setRateChartList] = useState([]);
  const [infoSentByPost, setInfoSentByPost] = useState(false);
  const [rejectedCat, setRejectedCategory] = useState([]);
  const [officeLocationDetails, setOfficeLocationDetails] = useState([]);
  const [rejectedDocument, setRejectedDoc] = useState([]);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const [statusAll, setStatus] = useState(null);
  const headers = { Authorization: `Bearer ${user?.token}` };
  let checkAuth = () => {
    return authority?.includes(roleId.RTI_ADHIKARI_ROLE_ID) ? false : true;
  };
  const [bplDocument, setBPLDocument] = useState();

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

  useEffect(() => {
    getAllStatus();
    getZone();
    getDepartments();
    getSubDepartments();
    getGenders();
    getTransferMedium();
    getRejectedCat();
  }, []);

  useEffect(() => {
    getOfficeLocation();
  }, []);

  useEffect(() => {
    getChargeType();
    getChargeTypes();
  }, []);

  useEffect(() => {
    getSubDepartmentDetails();
  }, [watch("childdepartment")]);

  const getAllStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
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

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setOfficeLocationDetails(
          res.data.officeLocation.map((r, i) => ({
            id: r.id,
            officeLocationName: r.officeLocationName,
            officeLocationNameMar: r.officeLocationNameMar,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getTransferMedium = () => {
    axios
      .get(`${urls.RTI}/mstTransferMedium/getAll`, {
        headers: headers,
      })
      .then((res, i) => {
        let result = res.data.mstTransferMediumList;
        setMediumMaster(
          result.map((res) => ({
            id: res.id,
            mediumPrefix: res.mediumPrefix,
            nameOfMedium: res.nameOfMedium,
            nameOfMediumMr: res.nameOfMediumMr,
            activeFlag: res.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const cancellButton = () => {
    router.push({
      pathname: "/RTIOnlineSystem/transactions/helpDesk",
    });
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
      align: "left",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "left",
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

  // get sub dept by dept id
  const getSubDepartmentDetails = () => {
    if (watch("childdepartment")) {
      axios
        .get(
          `${urls.RTI}/master/subDepartment/getAllByDeptWise/${watch(
            "childdepartment"
          )}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setSubDepartmentList(
            res.data.subDepartment.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              departmentId: r.department,
              subDepartment: r.subDepartment,
              subDepartmentMr: r.subDepartmentMr,
            }))
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // load charge type
  const getChargeType = () => {
    axios
      .get(`${urls.CFCURL}/master/serviceChargeType/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setChargeTypeDetails(
          r.data.serviceChargeType
            .filter((r) => r.id == 10)
            .map((row) => ({
              id: row.id,
              serviceChargeType: row.serviceChargeType,
              serviceChargeTypeMr: row.serviceChargeTypeMr,
            }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get service charges by service id=103
  const getChargeTypes = () => {
    axios
      .get(
        `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=130`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        r.data.serviceCharge.length != 0 &&
          setRatePerPage(r.data.serviceCharge[0].amount);
        r.data.serviceCharge.length != 0 &&
          setValue1("amount", r.data.serviceCharge[0].amount);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get genders
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

  // get loi
  const getLoi = () => {
    axios
      .get(
        `${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${applicationId}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res.data.trnAppealLoiList.length != 0) {
          setLOIDetails(res);
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // set loi details on ui
  const setLOIDetails = (res) => {
    setLoiDetails(res.data.trnAppealLoiList[0]);
    setValue1("chargeTypeKey", res.data?.trnAppealLoiList[0].chargeTypeKey);
    setValue1("noOfPages", res.data.trnAppealLoiList[0].noOfPages);
    setValue1("amount", res.data?.trnAppealLoiList[0].amount);
    setValue1("totalAmount", res.data?.trnAppealLoiList[0].totalAmount);
    setValue1("remarks", res.data?.trnAppealLoiList[0].remarks);
    // setPageNo(res.data.trnAppealLoiList[0].noOfPages);
    setRatePerPage(res.data?.trnAppealLoiList[0].amount);
    const DummyRateChart = res.data.trnAppealLoiList[0]?.trnLoiChargesDaos?.map(
      (obj, index) => {
        return {
          id: obj.id,
          srNo: index + 1,
          serviceChargeTypeName: obj.serviceChargeTypeName,
          amount: obj.amount,
          unit: obj.unit,
        };
      }
    );
    setValue("serviceName", "RTI");
    setRateChartList(DummyRateChart);
  };

  useEffect(() => {
    setApplicationDetails(props.data);
  }, [props]);

  useEffect(() => {
    if (applications != null && statusAll != null) {
      setRtiApplication();
    }
  }, [applications, statusAll, language]);

  useEffect(() => {
    if (applicationId != null) {
      getLoi();
    }
  }, [applicationId]);

  const getRejectedCat = () => {
    axios
      .get(`${urls.RTI}/mstRejectCategory/getAll`, {
        headers: headers,
      })
      .then((res, i) => {
        setRejectedCategory(res?.data?.mstRejectCategoryDao);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };
  // set application details on UI
  const setRtiApplication = () => {
    let _res = applications;
    if (zoneDetails && departments && subDepartments) {
      setValue("areaKey", _res?.areaKey);
      setValue("zoneKey", _res?.zoneKey);
      setValue("departmentKey", _res?.departmentKey);
      setValue("subDepartmentKey", _res?.subDepartmentKey);
    }
    setValue("infoSentByPost", _res.infoSentByPost);
    setInfoSentByPost(_res.infoSentByPost);
    setValue("postType", _res.postType);
    setValue("officeLocationKey", _res?.officeLocationKey);
    setApplicationID(_res?.id);
    setValue("applicantFirstName", _res?.applicantFirstName);
    setValue("rejectRemark", _res?.rejectRemark);
    setValue("rejectCategoryKey", _res.rejectCategoryKey);
    setValue1(
      "applicantFirstName",
      language === "en"
        ? _res?.applicantFirstName +
            " " +
            _res?.applicantMiddleName +
            " " +
            _res?.applicantLastName
        : _res?.applicantFirstNameMr +
            " " +
            _res?.applicantMiddleNameMr +
            " " +
            _res?.applicantLastNameMr
    );
    setValue(
      "applicantName",
      language === "en"
        ? _res?.applicantFirstName +
            " " +
            _res?.applicantMiddleName +
            " " +
            _res?.applicantLastName
        : _res?.applicantFirstNameMr +
            " " +
            _res?.applicantMiddleNameMr +
            " " +
            _res?.applicantLastNameMr
    );
    setValue1("serviceName", "RTI");
    setValue("applicantMiddleName", _res?.applicantMiddleName);
    setValue("applicantLastName", _res?.applicantLastName);
    setValue("address", language === "en" ? _res?.address : _res?.addressMr);
    setValue("gender", _res?.gender);
    setValue("pinCode", _res?.pinCode);
    setValue("contactDetails", _res?.contactDetails);
    setApplicationNumber(_res?.applicationNo);
    setValue("emailId", _res?.emailId);
    setIsBpl(_res?.isBpl);
    setValue("bplCardNo", _res?.bplCardNo);
    setValue("yearOfIssues", _res?.bplCardIssueYear);
    setValue("informationSubject", _res?.subject);
    setValue("issuingAuthority", _res?.bplCardIssuingAuthority);
    setBPLDocument(_res?.bplCardDoc);
    setValue("remarks", _res?.remarks);
    setValue("completeRemark", _res?.remarks);
    setValue("outwardNumberTxt", _res?.outwardNumberTxt);
    setValue("applicationType", "Child Application");
    setHasDependant(_res?.hasDependant == null ? false : _res?.hasDependant);
    setValue(
      "fromDate",
      _res?.fromDate == null ? "-" : moment(_res?.fromDate).format("DD-MM-YYYY")
    ),
      setValue(
        "toDate",
        _res?.toDate == null ? "-" : moment(_res?.toDate).format("DD-MM-YYYY")
      );
    setValue(
      "applicationDate",
      _res?.applicationDate == null
        ? "-"
        : moment(_res?.applicationDate).format("DD-MM-YYYY")
    ),
      setValue("selectedReturnMediaKey", _res?.selectedReturnMediaKey);
    setValue("informationReturnMediaKey", _res?.informationReturnMediaKey);
    setValue("description", _res?.description);
    setValue("requiredInformationPurpose", _res?.requiredInformationPurpose);
    setValue("additionalInfo", _res?.additionalInfo);
    setValue("parentRemark", _res?.transferRemark);
    setValue("place", _res?.place);
    setValue("date", _res?.applicationDate);
    setValue("forwardRemark", _res?.forwardRemark);
    setStatusVal(_res.status);
    setValue("infoPages", _res?.infoPages),
      setValue("infoRemark", _res?.infoAvailableRemarks),
      setValue("status", manageStatus(_res.status, language, statusAll));
    let rejectDoc = [];
    if (_res.rejectDoc1 != null) {
      const DecryptPhoto  = 
      DecryptData(
        "passphraseaaaaaaaaupload",
        _res.rejectDoc1
      );
      rejectDoc.push({
        id: 1,
        filenm: DecryptPhoto.split("/").pop().split("_").pop(),
        documentPath: _res.rejectDoc1,
        documentType: DecryptPhoto.split(".").pop().toUpperCase(),
      });
    }
    
    if (_res?.thirdPartyDoc1 != null) {
      const DecryptPhoto= DecryptData(
        "passphraseaaaaaaaaupload",
        _res?.thirdPartyDoc1
      );
      rejectDoc.push({
        id: 2,
        filenm: "Third Party document",
        documentPath: _res.thirdPartyDoc1,
        documentType: DecryptPhoto?.split(".").pop().toUpperCase(),
      });
    }
    setRejectedDoc(rejectDoc);
    if (_res.userDao != null) {
      setValue(
        "rtiFullName",
        language == "en"
          ? _res.userDao.firstNameEn +
              " " +
              _res.userDao.middleNameEn +
              " " +
              _res.userDao.lastNameEn
          : _res.userDao.firstNameMr +
              " " +
              _res.userDao.middleNameMr +
              " " +
              _res.userDao.lastNameMr
      );
      setValue("rtiEmailId", _res.userDao.email);
      setValue("rtiContact", _res.userDao.phoneNo);
    }

    const doc = [];
    // Loop through each attached document and add it to the `doc` array
    for (let i = 1; i <= 10; i++) {
      const attachedDocument = _res[`attachedDocument${i}`];
      if (attachedDocument != null) {
        const DecryptPhoto  = DecryptData(
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
    }
    setDataSource(doc);

    const completeDoc = [];
    if (_res.attachedDocumentPath != null) {
      const DecryptPhoto =  DecryptData(
        "passphraseaaaaaaaaupload",
        _res?.attachedDocumentPath
      );
      completeDoc.push({
        id: 1,
        filenm: DecryptPhoto.split("/").pop().split("_").pop(),
        documentPath: _res.attachedDocumentPath,
        documentType:DecryptPhoto.split(".").pop().toUpperCase(),
      });
      setCompleteAttach(completeDoc);
    }
    const completeDoc1 = [];
    if (_res?.thirdPartyDoc1 != null) {
      const DecryptPhoto =  DecryptData(
        "passphraseaaaaaaaaupload",
        _res?.thirdPartyDoc1
      );
      completeDoc1.push({
        id: 2,
        filenm: "Third Party document",
        documentPath: _res.thirdPartyDoc1,
        documentType:DecryptPhoto?.split(".").pop().toUpperCase(),
      });
    }
    setCompleteAttach([...completeDoc, ...completeDoc1]);
    if (_res.dependentRtiApplicationDaoList && departments) {
      const _res1 = _res.dependentRtiApplicationDaoList.map((res, i) => {
        // const DecryptPhoto =   DecryptData(
        //   "passphraseaaaaaaaaupload",
        //   res.attachedDocumentPath
        // );
        // const DecryptPhoto1 =    DecryptData(
        //   "passphraseaaaaaaaaupload",
        //   res.rejectDoc1
        // );
        return {
          srNo: i + 1,
          id: res.id,
          applicationNo: res.applicationNo,
          departmentKey: res?.departmentKey,
          departmentName: departments.find((filterData) => {
            return filterData?.id == res?.departmentKey;
          })?.department,
          createdDate: res.createdDate,
          description: res.description,
          requiredInformationPurpose: res.requiredInformationPurpose,
          subject: res.subject,
          applicationDate:
            res.applicationDate == null
              ? "-"
              : moment(res.applicationDate).format("DD-MM-YYYY"),
          completedDate:
            res.completionDate == null
              ? "-"
              : moment(res.completionDate).format("DD-MM-YYYY"),
          statusVal: res.status,
          transferRemark: res.transferRemark,
          status: manageStatus(res.status, language, statusAll),
          activeFlag: res.activeFlag,
          remark: res.remarks,
          infoPages: res.infoPages,
          filenm:
          res.status == 11
            ? res.attachedDocumentPath
              ?  DecryptData(
                "passphraseaaaaaaaaupload",
                res.attachedDocumentPath
              ).split("/").pop()
              : ""
            : res.status === 15
            ? res.rejectDoc1
              ? DecryptData("passphraseaaaaaaaaupload", res.rejectDoc1).split("/").pop()
              : ""
            : "",
        documentPath:
          res.status == 11
            ? res.attachedDocumentPath
              ? res.attachedDocumentPath
              : ""
            : res.status === 15
            ? res.rejectDoc1
              ? res.rejectDoc1
              : ""
            : "",
        documentType:
          res.status == 11
            ? res.attachedDocumentPath
              ?  DecryptData(
                "passphraseaaaaaaaaupload",
                res.attachedDocumentPath
              ).split(".").pop().toUpperCase()
              : ""
            : res.status == 15
            ? res.rejectDoc1
              ? DecryptData("passphraseaaaaaaaaupload", res.rejectDoc1).split(".").pop().toUpperCase()
              : ""
            : "",
        };
      });
      setChildDept([..._res1]);
    }
  };

  // load zone
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setZoneDetails(
          res.data.zone.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            zoneName: r.zoneName,
            zoneNameMr: r.zoneNameMr,
            zone: r.zone,
            ward: r.ward,
            area: r.area,
            zooAddress: r.zooAddress,
            zooAddressAreaInAcres: r.zooAddressAreaInAcres,
            zooApproved: r.zooApproved,
            zooFamousFor: r.zooFamousFor,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load sub department
  const getSubDepartments = () => {
    axios
      .get(`${urls.RTI}/master/subDepartment/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setSubDepartmentList(
          res.data.subDepartment.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentId: r.department,
            subDepartment: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get departments
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
            departmentMr: row.departmentMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const rateColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "serviceChargeTypeName",
      headerName: <FormattedLabel id="chargeType" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: "unit",
      headerName: <FormattedLabel id="quantity" />,
      headerAlign: "center",
      align: "center",
      width: "150",
    },
    {
      field: "amount",
      headerName: <FormattedLabel id="amount" />,
      headerAlign: "center",
      align: "center",
      width: "150",
    },
  ];

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            [theme.breakpoints.down("sm")]: {
              marginTop: "2rem",
              marginBottom: "2rem",
            },
            padding: 1,
          }}
        >
          <Box>
            <FormProvider {...methods}>
              <form>
                <Grid
                  container
                  spacing={1}
                  sx={{
                    padding: "1rem",
                    [theme.breakpoints.down("sm")]: {
                      padding: "0px",
                    },
                  }}
                >
                  {applications?.parentId != null && (
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="applicationType" />}
                        multiline
                        variant="standard"
                        {...register("applicationType")}
                        error={!!errors.applicationType}
                        helperText={
                          errors?.applicationType
                            ? errors.applicationType.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  {/* Applicant first Name */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="applicantName" />}
                      multiline
                      variant="standard"
                      {...register("applicantName")}
                      error={!!errors.applicantName}
                      helperText={
                        errors?.applicantName
                          ? errors.applicantName.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Gender */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.gender}
                      disabled={logedInUser === "citizenUser" ? true : false}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="gender" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "100%" }}
                            disabled
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          >
                            {genderDetails &&
                              genderDetails.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {language == "en"
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

                  {/* Contact details */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="contactDetails" />}
                      multiline
                      variant="standard"
                      {...register("contactDetails")}
                      error={!!errors.contactDetails}
                      helperText={
                        errors?.contactDetails
                          ? errors.contactDetails.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Email id */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="emailId" />}
                      id="standard-textarea"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      {...register("emailId")}
                      error={!!errors.emailId}
                      helperText={
                        errors?.emailId ? errors.emailId.message : null
                      }
                    />
                  </Grid>

                  {/* Pincode */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="pinCode" />}
                      multiline
                      variant="standard"
                      {...register("pinCode")}
                      error={!!errors.pinCode}
                      helperText={
                        errors?.pinCode ? errors.pinCode.message : null
                      }
                    />
                  </Grid>

                  {/* Address */}
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      fullWidth
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="address" />}
                      multiline
                      variant="standard"
                      {...register("address")}
                      error={!!errors.address}
                      helperText={
                        errors?.address ? errors.address.message : null
                      }
                    />
                  </Grid>

                  {/* ZOne*/}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.zoneKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="zoneKey" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            sx={{ width: "100%" }}
                            disabled
                            variant="standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {zoneDetails &&
                              zoneDetails?.map((zoneDetails, index) => (
                                <MenuItem key={index} value={zoneDetails.id}>
                                  {language == "en"
                                    ? zoneDetails?.zoneName
                                    : zoneDetails?.zoneNameMr}
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

                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.officeLocationKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="officeLocation" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "100%" }}
                            disabled
                            fullWidth
                            variant="standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            label="Complaint Type"
                          >
                            {officeLocationDetails &&
                              officeLocationDetails?.map(
                                (officeLocationDetails, index) => (
                                  <MenuItem
                                    key={index}
                                    value={officeLocationDetails.id}
                                  >
                                    {language == "en"
                                      ? officeLocationDetails?.officeLocationName
                                      : officeLocationDetails?.officeLocationNameMar}
                                  </MenuItem>
                                )
                              )}
                          </Select>
                        )}
                        name="officeLocationKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.officeLocationKey
                          ? errors.officeLocationKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Department */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentKey" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            autoFocus
                            sx={{ width: "100%" }}
                            disabled
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value), getSubDepartmentDetails();
                            }}
                            label={<FormattedLabel id="departmentKey" />}
                          >
                            {departments &&
                              departments.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {language == "en"
                                    ? department.department
                                    : department.departmentMr}
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

                  {/* Sub department */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.subDepartmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="subDepartmentKey" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "100%" }}
                            disabled
                            fullWidth
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="subDepartmentKey" />}
                          >
                            {subDepartments &&
                              subDepartments?.map((subDepartment, index) => (
                                <MenuItem key={index} value={subDepartment.id}>
                                  {language == "en"
                                    ? subDepartment.subDepartment
                                    : subDepartment.subDepartmentMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="subDepartmentKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.subDepartmentKey
                          ? errors.subDepartmentKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* required information Purpose */}
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="requiredInformationPurpose" />}
                      multiline
                      variant="standard"
                      {...register("requiredInformationPurpose")}
                      error={!!errors.requiredInformationPurpose}
                      helperText={
                        errors?.requiredInformationPurpose
                          ? errors.requiredInformationPurpose.message
                          : null
                      }
                    />
                  </Grid>

                  {/*  */}
                  {/* from Date */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="fromDate" />}
                      multiline
                      variant="standard"
                      {...register("fromDate")}
                      error={!!errors.fromDate}
                      helperText={
                        errors?.fromDate ? errors.fromDate.message : null
                      }
                    />
                  </Grid>

                  {/* to date */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="toDate" />}
                      multiline
                      variant="standard"
                      {...register("toDate")}
                      error={!!errors.toDate}
                      helperText={errors?.toDate ? errors.toDate.message : null}
                    />
                  </Grid>
                  {/*  */}

                  {/* description */}
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="description" />}
                      multiline
                      variant="standard"
                      {...register("description")}
                      error={!!errors.description}
                      helperText={
                        errors?.description ? errors.description.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    // }}
                  >
                    <FormControl sx={{ marginTop: "0px" }}>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {
                          // <FormattedLabel id="isApplicantBelowToPovertyLine" />
                        }
                      </FormLabel>
                      <RadioGroup
                        disabled={true}
                        style={{ marginTop: 5 }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        row
                        name="infoSentByPost"
                        control={control}
                        value={infoSentByPost}
                        {...register("infoSentByPost")}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label={<FormattedLabel id="infoSentByPost" />}
                          name="RadioButton"
                          {...register("infoSentByPost")}
                          error={!!errors.infoSentByPost}
                          helperText={
                            errors?.infoSentByPost
                              ? errors.infoSentByPost.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label={<FormattedLabel id="infoProvidedByPerson" />}
                          name="RadioButton"
                          {...register("infoSentByPost")}
                          error={!!errors.infoSentByPost}
                          helperText={
                            errors?.infoSentByPost
                              ? errors.infoSentByPost.message
                              : null
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {watch("infoSentByPost") === true && (
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        disabled={true}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        // error={showPostTypeErr && !watch("postType")}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="postalService" required />
                        </InputLabel>
                        <Controller
                          disabled={true}
                          render={({ field }) => (
                            <Select
                              disbled
                              sx={{ width: "100%" }}
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="postalService" />}
                            >
                              {PostData &&
                                PostData?.map((m, index) => (
                                  <MenuItem key={index} value={m.postNm}>
                                    {language == "en" ? m.postNm : m.postNm}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="postType"
                          control={control}
                          defaultValue=""
                        />
                      </FormControl>
                    </Grid>
                  )}
                  {/*  */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.selectedReturnMediaKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel
                          id="requiredInfoDeliveryDetails"
                          required
                        />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled
                            sx={{ width: "100%" }}
                            fullWidth
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={
                              <FormattedLabel
                                id="requiredInfoDeliveryDetails"
                                required
                              />
                            }
                          >
                            {mediumMaster &&
                              mediumMaster?.map((m, index) => (
                                <MenuItem key={index} value={m.id}>
                                  {language == "en"
                                    ? m.nameOfMedium
                                    : m.nameOfMediumMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="selectedReturnMediaKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.selectedReturnMediaKey
                          ? errors.selectedReturnMediaKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* is bpl radio button */}
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    // style={{
                    //   display:'flex',
                    //   justifyContent:'center'
                    // }}
                  >
                    <FormControl
                      flexDirection="row"
                      style={{ marginTop: "0px", marginLeft: "10px" }}
                    >
                      <FormLabel
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="demo-row-radio-buttons-group-label"
                      >
                        {<FormattedLabel id="isApplicantBelowToPovertyLine" />}
                      </FormLabel>

                      <Controller
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        name="isApplicantBelowToPovertyLine"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            value={isBplval}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value="true"
                              control={<Radio />}
                              label={<FormattedLabel id="yes" />}
                              error={!!errors.isApplicantBelowToPovertyLine}
                              helperText={
                                errors?.isApplicantBelowToPovertyLine
                                  ? errors.isApplicantBelowToPovertyLine.message
                                  : null
                              }
                            />
                            <FormControlLabel
                              value="false"
                              control={<Radio />}
                              label={<FormattedLabel id="no" />}
                              error={!!errors.isApplicantBelowToPovertyLine}
                              helperText={
                                errors?.isApplicantBelowToPovertyLine
                                  ? errors.isApplicantBelowToPovertyLine.message
                                  : null
                              }
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* bpl card no */}
                  {isBplval && (
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        label={<FormattedLabel id="bplCardNo" />}
                        multiline
                        variant="standard"
                        {...register("bplCardNo")}
                        error={!!errors.bplCardNo}
                        helperText={
                          errors?.bplCardNo ? errors.bplCardNo.message : null
                        }
                      />
                    </Grid>
                  )}

                  {/* years of issues */}
                  {isBplval && (
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        label={<FormattedLabel id="yearOfIssues" />}
                        multiline
                        variant="standard"
                        {...register("yearOfIssues")}
                        error={!!errors.yearOfIssues}
                        helperText={
                          errors?.yearOfIssues
                            ? errors.yearOfIssues.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  {/* issuing authority */}
                  {isBplval && (
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="issuingAuthority" />}
                        multiline
                        variant="standard"
                        {...register("issuingAuthority")}
                        error={!!errors.issuingAuthority}
                        helperText={
                          errors?.issuingAuthority
                            ? errors.issuingAuthority.message
                            : null
                        }
                      />
                    </Grid>
                  )}
                  {isBplval && (
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "15px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FormattedLabel id="bplCardDoc" />
                      </div>
                      <UploadButton1
                        appName="RTI"
                        serviceName="RTI-Application"
                        filePath={setBPLDocument}
                        fileName={bplDocument}
                      />
                    </Grid>
                  )}

                  {applications?.isTransfer && (
                    <Grid
                      item
                      spacing={3}
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="forwardRemark" />}
                        multiline
                        variant="standard"
                        {...register("forwardRemark")}
                        error={!!errors.forwardRemark}
                        helperText={
                          errors?.forwardRemark
                            ? errors.forwardRemark.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  {/* current status */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="currentStatus" />}
                      multiline
                      variant="standard"
                      {...register("status")}
                      error={!!errors.status}
                      helperText={errors?.status ? errors.status.message : null}
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
                      marginTop: "0px",
                    }}
                  >
                    <FormControl
                      sx={{
                        m: { xs: 0, md: 1 },
                        minWidth: "100%",
                        marginTop: "0px",
                      }}
                    >
                      <Controller
                        control={control}
                        name="date"
                        // defaultValue={currDate}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="date" required />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  {...params}
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </FormControl>
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
                      marginLeft: "10px",
                    }}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      disabled
                      InputLabelProps={{ shrink: watch("place") }}
                      label={<FormattedLabel id="place" />}
                      multiline
                      variant="standard"
                      {...register("place")}
                      error={!!errors.place}
                      helperText={errors?.place ? errors.place.message : null}
                    />
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Box>
          {/* </Box> */}

          {dataSource.length != 0 && (
            <div>
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginBottom: "8px", marginTop: "8px" }}
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
                      <FormattedLabel id="RTIApplicationdoc" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
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
                rows={dataSource}
                columns={docColumns}
              />
            </div>
          )}

          {/* accept reject button */}
          {authority &&
            authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) &&
            (statusVal === 3 ||
              statusVal === 4 ||
              statusVal === 14 ||
              statusVal === 11 ||
              statusVal === 5) &&
            applications?.parentId == null && (
              <div>
                {statusVal === 4 ||
                statusVal === 14 ||
                statusVal === 11 ||
                statusVal === 5 ||
                (statusVal === 3 && childDept.length != 0) ? (
                  <>
                    {" "}
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
                          disabled={true}
                          name="isRejected"
                          control={control}
                          defaultValue="true"
                          render={({ field }) => (
                            <RadioGroup
                              value={childDept.length != 0 ? "true" : "false"}
                              selected={
                                childDept.length != 0 ? "true" : "false"
                              }
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value={"true"}
                                control={<Radio />}
                                label={<FormattedLabel id="accept" />}
                                error={!!errors.isRejected}
                                helperText={
                                  errors?.isRejected
                                    ? errors.isRejected.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                value={"false"}
                                control={<Radio />}
                                label={<FormattedLabel id="reject" />}
                                error={!!errors.isRejected}
                                helperText={
                                  errors?.isRejected
                                    ? errors.isRejected.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
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
                      <FormControl flexDirection="row">
                        <Controller
                          name="isRejected"
                          control={control}
                          {...register("isRejected")}
                          defaultValue=""
                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value={"true"}
                                control={<Radio />}
                                {...register("isRejected")}
                                label={<FormattedLabel id="accept" />}
                                error={!!errors.isRejected}
                                helperText={
                                  errors?.isRejected
                                    ? errors.isRejected.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                value={"false"}
                                {...register("isRejected")}
                                control={<Radio />}
                                label={<FormattedLabel id="reject" />}
                                error={!!errors.isRejected}
                                helperText={
                                  errors?.isRejected
                                    ? errors.isRejected.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </div>
            )}
          {/* Rejected Flow */}
          {(watch("isRejected") === "false" || statusVal === 15) && (
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
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="rejectedSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <FormControl
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
                  variant="standard"
                  error={!!errors.rejectCategoryKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="rejectCat" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={statusVal === 15 ? true : false}
                        sx={{ width: "100%" }}
                        fullWidth
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="rejectCat" required />}
                      >
                        {rejectedCat &&
                          rejectedCat?.map((m, index) => (
                            <MenuItem key={index} value={m.id}>
                              {language == "en" ? m.rejectCat : m.rejectCatMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="rejectCategoryKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.rejectCategoryKey
                      ? errors.rejectCategoryKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  disabled={statusVal == 15 ? true : false}
                  label={<FormattedLabel id="rejectedRemark" />}
                  id="standard-textarea"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
                  variant="standard"
                  multiline
                  inputProps={{ maxLength: 500 }}
                  {...register("rejectRemark")}
                  error={!!errors.rejectRemark}
                  helperText={
                    errors?.rejectRemark ? errors.rejectRemark.message : null
                  }
                />
              </Grid>
              {statusVal == 15 && (
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
                  rows={rejectedDocument}
                  columns={docColumns}
                />
              )}
              {statusVal != 15 && (
                <Grid container spacing={2} style={{ marginTop: "3rem" }}>
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
                      variant="contained"
                      color="error"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => {
                        onRejectClick();
                      }}
                    >
                      <FormattedLabel id="reject" />
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
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="back" />
                    </Button>
                  </Grid>
                </Grid>
              )}
            </>
          )}

          {/* loi generate View */}
          {loiDetails.length != 0 &&
            (statusVal === 5 ||
              statusVal === 4 ||
              statusVal === 11 ||
              statusVal == 14) && (
              <div>
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
                        <FormattedLabel id="loiGenerate" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={1} sx={{ padding: "1rem" }}>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="serviceName" />}
                      multiline
                      variant="standard"
                      {...register("serviceName")}
                      error={!!errors.serviceName}
                      helperText={
                        errors?.serviceName ? errors.serviceName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentKey" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            autoFocus
                            sx={{ width: "100%" }}
                            disabled
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value), getSubDepartmentDetails();
                            }}
                            label={<FormattedLabel id="departmentKey" />}
                          >
                            {departments &&
                              departments.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {language == "en"
                                    ? department.department
                                    : department.departmentMr}
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
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="totalAmount" />}
                      id="standard-textarea"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      {...register1("totalAmount")}
                      error={!!error2.totalAmount}
                      helperText={
                        error2?.totalAmount ? error2.totalAmount.message : null
                      }
                    />
                  </Grid>

                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      disabled={
                        statusVal === 4 ||
                        statusVal == 5 ||
                        statusVal == 11 ||
                        statusVal == 14
                          ? true
                          : false
                      }
                      label={<FormattedLabel id="remark" />}
                      id="standard-textarea"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      multiline
                      inputProps={{ maxLength: 500 }}
                      InputLabelProps={{ shrink: true }}
                      {...register1("remarks")}
                      error={!!error2.remarks}
                      helperText={
                        error2?.remarks ? error2.remarks.message : null
                      }
                    />
                  </Grid>
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
                    rows={rateChartList}
                    columns={rateColumns}
                  />
                </Grid>
              </div>
            )}

          {/* header for user */}
          {(logedInUser === "citizenUser" ||
            logedInUser === "cfcUser" ||
            (logedInUser === "departmentUser" && checkAuth())) &&
            (statusVal === 14 || statusVal === 11) && (
              <Box>
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
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="infoReady" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            )}

          <Box>
            <Box>
              <Grid
                container
                spacing={3}
                sx={{
                  padding: "1rem",
                  [theme.breakpoints.down("sm")]: {
                    padding: "0px",
                  },
                }}
              >
                {/* information remark */}
                {(statusVal == 11 || statusVal == 14) && (
                  <>
                    {" "}
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={
                          statusVal === 14 || statusVal === 11 ? true : false
                        }
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={
                          <FormattedLabel id="informationRemark" required />
                        }
                        multiline
                        variant="standard"
                        {...register("infoRemark")}
                        error={!!errors.infoRemark}
                        helperText={
                          errors?.infoRemark ? errors.infoRemark.message : null
                        }
                      />
                    </Grid>
                    {/* information ready date */}
                    {((statusVal == 14 &&
                      ((logedInUser === "departmentUser" && checkAuth()) ||
                        logedInUser === "citizenUser")) ||
                      logedInUser === "cfcUser") && (
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-textarea"
                          label={
                            statusVal == 14 ? (
                              <FormattedLabel id="infoReadyDate" />
                            ) : (
                              <FormattedLabel id="completeDate" />
                            )
                          }
                          multiline
                          variant="standard"
                          {...register("applicationDate")}
                          error={!!errors.applicationDate}
                          helperText={
                            errors?.applicationDate
                              ? errors.applicationDate.message
                              : null
                          }
                        />
                      </Grid>
                    )}
                  </>
                )}

                {/* information return media */}
                {statusVal == 11 && (
                  <>
                    <>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled={statusVal === 11 ? true : false}
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="completeRemark" required />
                          }
                          multiline
                          variant="standard"
                          {...register("remarks")}
                          error={!!errors.remarks}
                          helperText={
                            errors?.remarks ? errors.remarks.message : null
                          }
                        />
                      </Grid>
                      {statusVal === 11 && (
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <TextField
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={
                              statusVal == 14 ? (
                                <FormattedLabel id="infoReadyDate" />
                              ) : (
                                <FormattedLabel id="completeDate" />
                              )
                            }
                            multiline
                            variant="standard"
                            {...register("applicationDate")}
                            error={!!errors.applicationDate}
                            helperText={
                              errors?.applicationDate
                                ? errors.applicationDate.message
                                : null
                            }
                          />
                        </Grid>
                      )}

                      <Grid
                        item
                        xl={statusVal === 11 ? 6 : 12}
                        lg={statusVal === 11 ? 6 : 12}
                        md={statusVal === 11 ? 6 : 12}
                        sm={12}
                        xs={12}
                      >
                        <TextField
                          disabled={statusVal === 11 ? true : false}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-textarea"
                          label={<FormattedLabel id="outwardNumber" />}
                          multiline
                          variant="standard"
                          {...register("outwardNumberTxt")}
                          error={!!errors.outwardNumberTxt}
                          helperText={
                            errors?.outwardNumberTxt
                              ? errors.outwardNumberTxt.message
                              : null
                          }
                        />
                      </Grid>
                    </>

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
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!errors.informationReturnMediaKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel
                            id="informationReturnMedia"
                            required
                          />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={statusVal === 11 ? true : false}
                              sx={{ width: "100%" }}
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={
                                <FormattedLabel
                                  id="informationReturnMedia"
                                  required
                                />
                              }
                            >
                              {mediumMaster &&
                                mediumMaster?.map((m, index) => (
                                  <MenuItem key={index} value={m.id}>
                                    {language == "en"
                                      ? m.nameOfMedium
                                      : m.nameOfMediumMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="informationReturnMediaKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.informationReturnMediaKey
                            ? errors.informationReturnMediaKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {(statusVal == 11 || statusVal == 14) &&
                      ((logedInUser === "departmentUser" && checkAuth()) ||
                        logedInUser === "citizenUser" ||
                        logedInUser === "cfcUser") && (
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
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={"RTI Adhikari Full Name"}
                            multiline
                            variant="standard"
                            {...register("rtiFullName")}
                            error={!!errors.rtiFullName}
                            helperText={
                              errors?.rtiFullName
                                ? errors.rtiFullName.message
                                : null
                            }
                          />
                        </Grid>
                      )}
                    {(statusVal == 11 || statusVal == 14) &&
                      ((logedInUser === "departmentUser" && checkAuth()) ||
                        logedInUser === "citizenUser" ||
                        logedInUser === "cfcUser") && (
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
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={<FormattedLabel id="emailId" />}
                            multiline
                            variant="standard"
                            {...register("rtiEmailId")}
                            error={!!errors.rtiEmailId}
                            helperText={
                              errors?.rtiEmailId
                                ? errors.rtiEmailId.message
                                : null
                            }
                          />
                        </Grid>
                      )}
                    {(statusVal == 11 || statusVal == 14) &&
                      ((logedInUser === "departmentUser" && checkAuth()) ||
                        logedInUser === "cfcUser" ||
                        logedInUser === "citizenUser") && (
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
                            disabled={true}
                            InputLabelProps={{
                              shrink: watch("rtiContact") ? true : false,
                            }}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={<FormattedLabel id="contactDetails" />}
                            multiline
                            variant="standard"
                            {...register("rtiContact")}
                            error={!!errors.rtiContact}
                            helperText={
                              errors?.rtiContact
                                ? errors.rtiContact.message
                                : null
                            }
                          />
                        </Grid>
                      )}
                  </>
                )}
              </Grid>
            </Box>
          </Box>

          {/* // */}

          <Grid container spacing={2} sx={{ padding: "3rem" }}>
            {/* Payment getway button */}
            {((logedInUser === "departmentUser" && checkAuth()) ||
              logedInUser === "cfcUser" ||
              logedInUser === "citizenUser") &&
              statusVal === 2 && (
                <>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="back" />
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
                      variant="contained"
                      // color="primary"
                      style={{
                        borderRadius: "20px",
                        backgroundColor: "darkviolet",
                      }}
                      size="small"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => {
                        router.push({
                          pathname:
                            "/RTIOnlineSystem/transactions/payment/PaymentCollection",
                          query: { id: applicationNumber, trnType: "ap" },
                        });
                      }}
                    >
                      <FormattedLabel id="makePayment" />
                    </Button>
                  </Grid>
                </>
              )}
            {/* view loi buttonn*/}
            {statusVal === 4 &&
              ((logedInUser === "departmentUser" && checkAuth()) ||
                logedInUser === "cfcUser" ||
                logedInUser === "citizenUser") && (
                <>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="back" />
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
                      variant="contained"
                      color="primary"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      endIcon={<DownloadIcon />}
                      onClick={() => {
                        router.push({
                          pathname:
                            "/RTIOnlineSystem/transactions/acknowledgement/LoiGenerationRecipt",
                          query: { id: applicationNumber },
                        });
                      }}
                    >
                      <FormattedLabel id="downloadLoiReceipt" />
                    </Button>
                  </Grid>
                </>
              )}

            {/* download Aknowldgement */}
            {(logedInUser === "citizenUser" ||
              logedInUser === "cfcUser" ||
              (logedInUser === "departmentUser" && checkAuth())) &&
              statusVal === 3 && (
                <>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="back" />
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
                      type="button"
                      variant="contained"
                      color="primary"
                      endIcon={<DownloadIcon />}
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => {
                        router.push({
                          pathname:
                            "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
                          query: { id: applicationNumber },
                        });
                      }}
                    >
                      <FormattedLabel id="downloadAcknowldgement" />
                    </Button>
                  </Grid>
                </>
              )}

            {/* Back button */}
            {(((logedInUser === "citizenUser" || logedInUser === "cfcUser") &&
              (statusVal === 11 || statusVal === 5 || statusVal === 14)) ||
              (logedInUser === "departmentUser" &&
                (statusVal === 11 ||
                  statusVal === 5 ||
                  statusVal === 15 ||
                  statusVal === 14))) && (
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={() => cancellButton()}
                >
                  <FormattedLabel id="back" />
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default EntryForm;
