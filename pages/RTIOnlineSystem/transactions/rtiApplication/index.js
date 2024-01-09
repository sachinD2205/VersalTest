import {
  Box,
  Button,
  FormLabel,
  Radio,
  Typography,
  RadioGroup,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import theme from "../../../../theme";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import Document from "../../Document/UploadButton";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel.js";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import trnRtiApplicationSchema from "../../../../containers/schema/rtiOnlineSystemSchema/trnRtiApplicationSchema.js";
import saveAsDraftTrnRtiApplicationSchema from "../../../../containers/schema/rtiOnlineSystemSchema/saveAsDraftTrnRtiApplicationSchema";
import urls from "../../../../URLS/urls.js";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyPressEvents from "../../../../util/KeyPressEvents";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import UploadButton from "../../../../components/fileUpload/UploadButton";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil.js";
import {
  EncryptData,
  DecryptData,
} from "../../../../components/common/EncryptDecrypt/index.js";
import PostData from "../postJson.json";
const EntryForm = () => {
  const [isName, setSaveButtonName] = useState("");

  const handleSaveAsDraft = (name) => {
    setIsDraft(true);
    setSaveButtonName(name);
  };
  const methods = useForm({
    criteriaMode: "all",
    resolver:
      isName === "draft"
        ? yupResolver(saveAsDraftTrnRtiApplicationSchema)
        : yupResolver(trnRtiApplicationSchema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const [officeLocationDetails, setOfficeLocationDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const [uploading, setUploading] = useState(false);
  const language = useSelector((state) => state.labels.language);
  const [mediumMaster, setMediumMaster] = useState([]);
  const [zoneDetails, setZoneDetails] = useState();
  const [departments, setDepartments] = useState([]);
  const [isDraft, setIsDraft] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [wards, setWards] = useState([]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  let user = useSelector((state) => state.user.user);
  const [genderDetails, setGenderDetails] = useState(false);
  const [isBplval, setIsBpl] = useState(false);
  const logedInUser = localStorage.getItem("loggedInUser");
  const [loadFormData, setLoadFormData] = useState(null);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [attachedFile, setAttachedFile] = useState();
  const [label, setLabel] = useState("");
  const [departmentData, setDepartmentData] = useState([]);
  const currDate = new Date();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState("");
  const [infoSentByPost, setInfoSentByPost] = useState(false);
  const [showErCardNo, setCardNoError] = useState(false);
  const [showPostTypeErr, setPostTypeError] = useState(false);

  const headers = { Authorization: `Bearer ${user?.token}` };
  const [document, setDocument] = useState(null);

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

  const years = Array.from({ length: 50 }, (_, index) => currentYear - index);
  let filePath = {};
  const userCitizen = useSelector((state) => {
    return state?.user?.user;
  });
  function temp(arg) {
    filePath = arg;
  }
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  useEffect(() => {
    getZone();
    getGenders();
    getDepartments();
    getTransferMedium();
    getOfficeLocation();
  }, []);

  useEffect(() => {
    if (watch("zoneKey") != null && watch("zoneKey") != "") {
      getOfficeLocationByZone();
    } else {
      setValue("officeLocationKey", "");
    }
  }, [watch("zoneKey")]);

  useEffect(() => {
    // if(router.query.id===undefined){
    if (
      watch("officeLocationKey") != null &&
      watch("officeLocationKey") != "" &&
      watch("zoneKey") != null &&
      watch("zoneKey") != ""
    ) {
      getDepartmentByOfficeLocation();
    } else {
      setValue("departmentKey", "");
    }
  }, [watch("officeLocationKey")]);

  useEffect(() => {
    setCitizenData();
  }, [userCitizen && language]);

  useEffect(() => {
    getSubDepartmentDetails();
  }, [watch("departmentKey")]);

  const handleClose = () => {
    setFetchDocuments([
      ...fetchDocument,
      {
        id:
          fetchDocument.length != 0
            ? fetchDocument[fetchDocument.length - 1].id + 1
            : 1,
        documentKey: null,
        documentPath: filePath.filePath,
        fileName: filePath.fileName.split("/").pop().split("_").pop(),
      },
    ]);
    setAttachedFile("");
    setUploading(false);
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
  const docColumns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fileName",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        return (
          <>
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

            <IconButton color="primary" onClick={() => deleteById(record.id)}>
              <DeleteIcon style={{ color: "red", fontSize: 30 }} />
            </IconButton>
          </>
        );
      },
    },
  ];

  const deleteById = (value) => {
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
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((result) => {
      if (result) {
        const deleteArr = fetchDocument.map((obj) => {
          if (obj.id === value) {
            return { ...obj, activeFlag: "N" };
          }
          return obj;
        });
        setFetchDocuments(fetchDocument.filter((obj) => obj.id !== value));
        sweetAlert(
          language === "en"
            ? "File Deleted Successfully!"
            : "फाइल यशस्वीरित्या हटवली!",
          {
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          }
        );
      }
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

  const getDepartmentByOfficeLocation = () => {
    axios
      .get(
        `${
          urls.RTI
        }/mstZoneOfficeLocationDepartmentMapping/getAllDeptByZoneAndLocation?zoneKey=${watch(
          "zoneKey"
        )}&locationkey=${watch("officeLocationKey")}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let data = r.data.mstZoneOfficeLocationDepartmentMappingDao.map(
          (row) => ({
            id: row.departmentKey,
            department: departments?.find((obj) => {
              return obj.id == row.departmentKey;
            })
              ? departments.find((obj) => {
                  return obj.id == row.departmentKey;
                }).department
              : "-",
            departmentMr: departments?.find((obj) => {
              return obj.id == row.departmentKey;
            })
              ? departments.find((obj) => {
                  return obj.id == row.departmentKey;
                }).departmentMr
              : "-",
          })
        );
        setDepartmentData(data.sort(sortByProperty("department")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getOfficeLocationByZone = () => {
    axios
      .get(
        `${
          urls.RTI
        }/mstZoneOfficeLocationDepartmentMapping/getAllLocByZone?zoneKey=${watch(
          "zoneKey"
        )}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let data = r.data.mstZoneOfficeLocationDepartmentMappingDao.map(
          (row) => ({
            id: row.officeLocationkey,
            officeLocation: officeLocationDetails?.find((obj) => {
              return obj.id == row.officeLocationkey;
            })
              ? officeLocationDetails.find((obj) => {
                  return obj.id == row.officeLocationkey;
                }).officeLocationName
              : "-",
            officeLocationMr: officeLocationDetails?.find((obj) => {
              return obj.id == row.officeLocationkey;
            })
              ? officeLocationDetails.find((obj) => {
                  return obj.id == row.officeLocationkey;
                }).officeLocationNameMar
              : "-",
          })
        );

        setWards(data.sort(sortByProperty("officeLocation")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getTransferMedium = () => {
    axios
      .get(`${urls.RTI}/mstTransferMedium/getAll`, {
        headers: headers,
      })
      .then((res, i) => {
        let result = res.data.mstTransferMediumList;
        let data = result.map((res) => ({
          id: res.id,
          mediumPrefix: res.mediumPrefix,
          nameOfMedium: res.nameOfMedium,
          nameOfMediumMr: res.nameOfMediumMr,
          activeFlag: res.activeFlag,
          status: res.activeFlag === "Y" ? "Active" : "InActive",
        }));
        setMediumMaster(data.sort(sortByProperty("nameOfMedium")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // getGenders
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

  // citizen user data fetch on Ui
  const setCitizenData = () => {
    if (logedInUser === "citizenUser") {
      setValue("applicantFirstName", userCitizen?.firstName);
      setValue("applicantMiddleName", userCitizen?.middleName);
      setValue("applicantLastName", userCitizen?.surname);
      setValue("applicantFirstNameMr", userCitizen?.firstNamemr);
      setValue("applicantMiddleNameMr", userCitizen?.middleNamemr);
      setValue("applicantLastNameMr", userCitizen?.surnamemr);
      setValue("emailId", userCitizen?.emailID);
      setValue("pinCode", userCitizen?.ppincode);
      setValue("contactDetails", userCitizen?.mobile);
      setValue("gender", userCitizen?.gender);
    }
  };

  // get zone
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res.data.zone.map((r, i) => ({
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
        }));
        setZoneDetails(data.sort(sortByProperty("zoneName")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };

  // get sub department by dept id
  const getSubDepartmentDetails = () => {
    if (watch("departmentKey")) {
      axios
        .get(
          `${urls.RTI}/master/subDepartment/getAllByDeptWise/${watch(
            "departmentKey"
          )}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          let data = res.data.subDepartment.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentId: r.department,
            subDepartment: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          }));
          setSubDepartmentList(data.sort(sortByProperty("subDepartment")));
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
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

  const onSubmitForm = (formData) => {
    const fromDate = formData.fromDate
      ? moment(formData.fromDate).format("YYYY-MM-DD")
      : "";
    const toDate = formData.toDate
      ? moment(formData.toDate).format("YYYY-MM-DD")
      : "";
    const saveAsDraft = window.event.submitter.name === "draft";
    const isBpl = isBplval;
    const bplCardIssueYear = selectedYear;
    const bplCardIssuingAuthority = formData.issuingAuthority;
    const attachedDocuments = Array(10).fill(null);
    if (fetchDocument) {
      for (let i = 0; i < fetchDocument.length && i < 10; i++) {
        attachedDocuments[i] = fetchDocument[i].documentPath;
      }
    }

    const body = {
      ...loadFormData,
      ...formData,
      departmentKey: formData.departmentKey,
      officeLocationKey: formData.officeLocationKey,
      zoneKey: formData.zoneKey,
      fromDate,
      toDate,
      isBpl,
      bplCardIssueYear,
      bplCardIssuingAuthority,
      bplCardDoc: document,
      saveAsDraft: window.event.submitter.name === "draft",
      attachedDocument1: attachedDocuments[0],
      attachedDocument2: attachedDocuments[1],
      attachedDocument3: attachedDocuments[2],
      attachedDocument4: attachedDocuments[3],
      attachedDocument5: attachedDocuments[4],
      attachedDocument6: attachedDocuments[5],
      attachedDocument7: attachedDocuments[6],
      attachedDocument8: attachedDocuments[7],
      attachedDocument9: attachedDocuments[8],
      attachedDocument10: attachedDocuments[9],
    };
    if (isBplval && !saveAsDraft && formData.bplCardNo == "") {
      setCardNoError(true);
    } else if (!infoSentByPost  && !saveAsDraft && formData.postType === "") {
      setPostTypeError(true);
    } else {
      commonSaveRestCall(body, isBpl, body.saveAsDraft);
    }
  };

  const commonSaveRestCall = (body, isBpl, isDraft) => {
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.RTI}/trnRtiApplication/save`, body, {
        headers: headers,
      })
      .then((res) => {
        var a = res.data.message;
        setIsLoading(false);
        if (res.status == 201) {
          setAlertAfterSubmitApplication(res, isBpl, isDraft);
        } else {
          sweetAlert({
            title: language == "en" ? "Error!" : "त्रुटी",
            text:
              language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })

      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const loadDraftData = () => {
    setIsLoading(true);
    const loadData = axios
      .get(`${urls.RTI}/trnRtiApplication/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        setLoadFormData(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (loadFormData != null) setTempFormData();
  }, [loadFormData]);

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      loadDraftData();
    }
  }, [router.query.id]);

  useEffect(() => {
    setIsBpl(watch("isApplicantBelowToPovertyLine") === "true" ? true : false);
    if (watch("isApplicantBelowToPovertyLine") === "false") {
      setValue("bplCardNo", "");
      setValue("yearOfIssues", "");
      setValue("issuingAuthority", "");
    }
  }, [watch("isApplicantBelowToPovertyLine")]);

  const setTempFormData = () => {
    let _res = loadFormData;
    setValue("place", _res?.place);
    setValue('date',_res?.applicationDate)
    setValue("applicantFirstName", _res?.applicantFirstName);
    setValue("applicantMiddleName", _res?.applicantMiddleName);
    setValue("applicantLastName", _res?.applicantLastName);
    setValue("applicantFirstNameMr", _res?.applicantFirstNameMr);
    setValue("applicantMiddleNameMr", _res?.applicantMiddleNameMr);
    setValue("applicantLastNameMr", _res?.applicantLastNameMr);
    setValue("address", _res?.address);
    setValue("addressMr", _res?.addressMr);
    setValue("areaKey", _res?.areaKey);
    setValue("zoneKey", _res?.zoneKey);
    setValue("wardKey", _res.wardKey);
    setValue("departmentKey", _res?.departmentKey);
    setValue("subDepartmentKey", _res?.subDepartmentKey);
    setValue("officeLocationKey", _res?.officeLocationKey);
    setValue("gender", _res?.gender);
    setValue("pinCode", _res?.pinCode);
    setValue("contactDetails", _res?.contactDetails);
    setValue("emailId", _res?.emailId);
    setValue("bplCardNo", _res?.bplCardNo);
    setSelectedYear(_res?.bplCardIssueYear);
    setValue("informationSubject", _res?.subject);
    setValue(
      "issuingAuthority",
      _res?.bplCardIssuingAuthority ? _res?.bplCardIssuingAuthority : ""
    );
    setValue("fromDate", _res?.fromDate), setValue("toDate", _res?.toDate);
    setValue(
      "selectedReturnMediaKey",
      _res.selectedReturnMediaKey ? _res.selectedReturnMediaKey : ""
    );
    setValue("informationReturnMediaKey", _res?.informationReturnMediaKey);
    setValue("description", _res?.description);
    setValue("requiredInformationPurpose", _res?.requiredInformationPurpose);
    // setValue("descriptionMr", _res?.descriptionMr);
    // setValue("requiredInformationPurposeMr", _res?.requiredInformationPurposeMr);
    setIsBpl(_res?.isBpl);
    setValue("isApplicantBelowToPovertyLine", _res?.isBpl ? "true" : "false");
    setDocument(_res.bplCardDoc);
    setValue("infoSentByPost", _res.infoSentByPost ? "true" : "false");
    setInfoSentByPost(_res.infoSentByPost);
    setValue("postType", _res.postType);

    const doc = [];
    // Loop through each attached document and add it to the `doc` array
    for (let i = 1; i <= 10; i++) {
      const attachedDocument = _res[`attachedDocument${i}`];
      if (attachedDocument != null) {
        const DecryptPhoto = DecryptData(
          "passphraseaaaaaaaaupload",
          attachedDocument
        );
        doc.push({
          id: i,
          fileName: DecryptPhoto.split("/").pop().split("_").pop(),
          documentPath: attachedDocument,
          documentType: attachedDocument.split(".").pop().toUpperCase(),
        });
      }
    }
    setFetchDocuments([...doc]);
  };

  const setAlertAfterSubmitApplication = (res, isBpl, isDraft) => {
    if (isDraft) {
      alertForSaveAsDraft();
    } else {
      if (isBpl === true) {
        sweetAlert({
          title: language == "en" ? "Saved!" : "जतन केले",
          text:
            language == "en"
              ? "RTI Application Saved Successfully !"
              : "आरटीआय अर्ज यशस्वीरित्या जतन झाला!",
          icon: "success",
          dangerMode: false,
          button: language == "en" ? "Ok" : "ठीक आहे",
          closeOnClickOutside: false,
        }).then((will) => {
          if (will) {
            sweetAlert({
              text:
                language == "en"
                  ? ` Your Application No Is : ${
                      res.data.message.split("[")[1].split("]")[0]
                    }`
                  : `तुमचा अर्ज क्र : ${
                      res.data.message.split("[")[1].split("]")[0]
                    }`,
              icon: "success",
              buttons: [
                language == "en" ? "View Acknowledgement" : "पावती पहा",
                language == "en" ? "Go To Dashboard" : "डॅशबोर्डवर जा",
              ],
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                {
                  cancellButton();
                }
              } else {
                router.push({
                  pathname:
                    "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
                  query: { id: res.data.message.split("[")[1].split("]")[0] },
                });
              }
            });
          }
        });
      } else {
        var a = res.data.message;
        router.push({
          pathname: "/RTIOnlineSystem/transactions/payment/PaymentCollection",
          query: {
            id: res.data.message.split("[")[1].split("]")[0],
            trnType: "ap",
          },
        });
      }
    }
  };

  const alertForSaveAsDraft = () => {
    sweetAlert({
      title: language == "en" ? "Saved!" : "जतन केले",
      text:
        language == "en"
          ? "RTI Application Saved in draft Successfully !"
          : "आरटीआय अर्ज मसुद्यात यशस्वीरित्या जतन झाला!",
      icon: "success",
      dangerMode: false,
      closeOnClickOutside: false,
      button: language == "en" ? "Ok" : "ठीक आहे",
    }).then((will) => {
      if (will) {
        cancellButton();
      }
    });
  };

  const cancellButton = () => {
    logedInUser === "citizenUser"
      ? router.push("/dashboard")
      : logedInUser === "cfcUser"
      ? router.push("/CFC_Dashboard")
      : router.push(
          "/RTIOnlineSystem/transactions/rtiApplication/rtiAplicationList"
        );
  };

  useEffect(() => {
    setInfoSentByPost(watch("infoSentByPost"));
    // if(!watch('infoSentByPost')){
    setValue("postType", "");
    // }
  }, [watch("infoSentByPost")]);
  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <BreadcrumbComponent />
        {isLoading && <CommonLoader />}
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "20px",
            padding: 1,
          }}
        >
          <Box>
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
                    <FormattedLabel id="rtiApplication" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            {/* <Divider /> */}
            <>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container spacing={1} sx={{ padding: "1rem" }}>
                    {/* applicant first name */}
                    {logedInUser === "citizenUser" ? (
                      <>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            disabled={
                              logedInUser === "citizenUser" ? true : false
                            }
                            id="standard-basic"
                            label={
                              <FormattedLabel
                                id="applicantFirstName"
                                required
                              />
                            }
                            multiline
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

                        {/*applicant middle name */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            disabled={
                              logedInUser === "citizenUser" ? true : false
                            }
                            id="standard-textarea"
                            label={
                              <FormattedLabel
                                id="applicantMiddleName"
                                required
                              />
                            }
                            multiline
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
                        {/* applicant last name */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            disabled={
                              logedInUser === "citizenUser" ? true : false
                            }
                            id="standard-textarea"
                            label={
                              <FormattedLabel id="applicantLastName" required />
                            }
                            multiline
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

                        {/* applicant first name */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            disabled={
                              logedInUser === "citizenUser" ? true : false
                            }
                            id="standard-basic"
                            label={
                              <FormattedLabel
                                id="applicantFirstNameMr"
                                required
                              />
                            }
                            multiline
                            variant="standard"
                            {...register("applicantFirstNameMr")}
                            error={!!errors.applicantFirstNameMr}
                            helperText={
                              errors?.applicantFirstNameMr
                                ? errors.applicantFirstNameMr.message
                                : null
                            }
                          />
                        </Grid>

                        {/*applicant middle name */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            disabled={
                              logedInUser === "citizenUser" ? true : false
                            }
                            id="standard-textarea"
                            label={
                              <FormattedLabel
                                id="applicantMiddleNameMr"
                                required
                              />
                            }
                            multiline
                            variant="standard"
                            {...register("applicantMiddleNameMr")}
                            error={!!errors.applicantMiddleNameMr}
                            helperText={
                              errors?.applicantMiddleNameMr
                                ? errors.applicantMiddleNameMr.message
                                : null
                            }
                          />
                        </Grid>
                        {/* applicant last name */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            disabled={
                              logedInUser === "citizenUser" ? true : false
                            }
                            id="standard-textarea"
                            label={
                              <FormattedLabel
                                id="applicantLastNameMr"
                                required
                              />
                            }
                            multiline
                            variant="standard"
                            {...register("applicantLastNameMr")}
                            error={!!errors.applicantLastNameMr}
                            helperText={
                              errors?.applicantLastNameMr
                                ? errors.applicantLastNameMr.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"applicantFirstName"}
                            labelName={"applicantFirstName"}
                            fieldName={"applicantFirstName"}
                            updateFieldName={"applicantFirstNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel
                                id="applicantFirstName"
                                required
                              />
                            }
                            error={!!errors.applicantFirstName}
                            helperText={
                              errors?.applicantFirstName
                                ? errors.applicantFirstName.message
                                : null
                            }
                          />
                        </Grid>

                        {/*applicant middle name */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"applicantMiddleName"}
                            labelName={"applicantMiddleName"}
                            fieldName={"applicantMiddleName"}
                            updateFieldName={"applicantMiddleNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel
                                id="applicantMiddleName"
                                required
                              />
                            }
                            error={!!errors.applicantMiddleName}
                            helperText={
                              errors?.applicantMiddleName
                                ? errors.applicantMiddleName.message
                                : null
                            }
                          />
                        </Grid>
                        {/* applicant last name */}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"applicantLastName"}
                            labelName={"applicantLastName"}
                            fieldName={"applicantLastName"}
                            updateFieldName={"applicantLastNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel id="applicantLastName" required />
                            }
                            error={!!errors.applicantLastName}
                            helperText={
                              errors?.applicantLastName
                                ? errors.applicantLastName.message
                                : null
                            }
                          />
                        </Grid>

                        {/* applicant first name mr*/}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"applicantFirstNameMr"}
                            labelName={"applicantFirstNameMr"}
                            fieldName={"applicantFirstNameMr"}
                            updateFieldName={"applicantFirstName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel
                                id="applicantFirstNameMr"
                                required
                              />
                            }
                            error={!!errors.applicantFirstNameMr}
                            helperText={
                              errors?.applicantFirstNameMr
                                ? errors.applicantFirstNameMr.message
                                : null
                            }
                          />
                        </Grid>

                        {/*applicant middle name mr*/}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"applicantMiddleNameMr"}
                            labelName={"applicantMiddleNameMr"}
                            fieldName={"applicantMiddleNameMr"}
                            updateFieldName={"applicantMiddleName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel
                                id="applicantMiddleNameMr"
                                required
                              />
                            }
                            error={!!errors.applicantMiddleNameMr}
                            helperText={
                              errors?.applicantMiddleNameMr
                                ? errors.applicantMiddleNameMr.message
                                : null
                            }
                          />
                        </Grid>
                        {/* applicant last name mr*/}
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                          <Transliteration
                            variant={"standard"}
                            _key={"applicantLastNameMr"}
                            labelName={"applicantLastNameMr"}
                            fieldName={"applicantLastNameMr"}
                            updateFieldName={"applicantLastName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel
                                id="applicantLastNameMr"
                                required
                              />
                            }
                            error={!!errors.applicantLastNameMr}
                            helperText={
                              errors?.applicantLastNameMr
                                ? errors.applicantLastNameMr.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}

                    {/* gender */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!errors.gender}
                        disabled={logedInUser === "citizenUser" ? true : false}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="gender" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
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

                    {/* pincode */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        disabled={logedInUser === "citizenUser" ? true : false}
                        label={<FormattedLabel id="pinCode" required />}
                        inputProps={{ maxLength: 6 }}
                        variant="standard"
                        {...register("pinCode")}
                        error={!!errors.pinCode}
                        helperText={
                          errors?.pinCode ? errors.pinCode.message : null
                        }
                      />
                    </Grid>

                    {/* contact details */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        inputProps={{ maxLength: 10 }}
                        disabled={logedInUser === "citizenUser" ? true : false}
                        label={<FormattedLabel id="contactDetails" required />}
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

                    {/* address */}
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Transliteration
                        variant={"standard"}
                        _key={"address"}
                        labelName={"address"}
                        fieldName={"address"}
                        updateFieldName={"addressMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="address" required />}
                        error={!!errors.address}
                        helperText={
                          errors?.address ? errors.address.message : null
                        }
                      />
                    </Grid>

                    {/* address */}
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Transliteration
                        variant={"standard"}
                        _key={"addressMr"}
                        labelName={"addressMr"}
                        fieldName={"addressMr"}
                        updateFieldName={"address"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        label={<FormattedLabel id="addressMr" required />}
                        error={!!errors.addressMr}
                        helperText={
                          errors?.addressMr ? errors.addressMr.message : null
                        }
                      />
                    </Grid>
                    {/*email id  */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        label={<FormattedLabel id="emailId" required />}
                        id="standard-textarea"
                        disabled={logedInUser === "citizenUser" ? true : false}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        {...register("emailId")}
                        error={!!errors.emailId}
                        helperText={
                          errors?.emailId ? errors.emailId.message : null
                        }
                      />
                    </Grid>

                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zoneKey" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              fullWidth
                              variant="standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Complaint Type"
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

                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.officeLocationKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="officeLocation" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              fullWidth
                              variant="standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Complaint Type"
                            >
                              {wards &&
                                wards?.map((officeLocationDetails, index) => (
                                  <MenuItem
                                    key={index}
                                    value={officeLocationDetails.id}
                                  >
                                    {language == "en"
                                      ? officeLocationDetails?.officeLocation
                                      : officeLocationDetails?.officeLocationMr}
                                  </MenuItem>
                                ))}
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
                              sx={{ width: "100%" }}
                              autoFocus
                              fullWidth
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value),
                                  getSubDepartmentDetails();
                              }}
                              label={<FormattedLabel id="departmentKey" />}
                            >
                              {departmentData &&
                                departmentData.map((department, index) => (
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

                    {/* {subDepartments.length !== 0 ? ( */}
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!errors.subDepartmentKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="subDepartmentKey" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="subDepartmentKey" />}
                            >
                              {subDepartments &&
                                subDepartments?.map((subDepartment, index) => (
                                  <MenuItem
                                    key={index}
                                    value={subDepartment.id}
                                  >
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

                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        label={
                          <FormattedLabel
                            id="requiredInformationPurpose"
                            required
                          />
                        }
                        multiline
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("requiredInformationPurpose")
                            ? true
                            : false,
                        }}
                        {...register("requiredInformationPurpose")}
                        error={!!errors.requiredInformationPurpose}
                        helperText={
                          errors?.requiredInformationPurpose
                            ? errors.requiredInformationPurpose.message
                            : null
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
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{
                          m: { xs: 0, md: 1 },
                          backgroundColor: "white",
                          minWidth: "100%",
                        }}
                        error={!!errors.fromDate}
                      >
                        <Controller
                          control={control}
                          name="fromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                sx={{ width: "100%" }}
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 14 }}>
                                    {<FormattedLabel id="fromDate" />}
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                maxDate={yesterday}
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ width: "100%" }}
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.fromDate ? errors.fromDate.message : null}
                        </FormHelperText>
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
                      }}
                    >
                      <FormControl
                        sx={{
                          m: { xs: 0, md: 1 },
                          backgroundColor: "white",
                          minWidth: "100%",
                        }}
                        error={!!errors.toDate}
                      >
                        <Controller
                          control={control}
                          name="toDate"
                          disabled={watch("fromDate")}
                          defaultValue={currDate}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disableFuture
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 14 }}>
                                    {<FormattedLabel id="toDate" />}
                                  </span>
                                }
                                minDate={watch("fromDate")}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ width: "100%" }}
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toDate ? errors.toDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        label={<FormattedLabel id="description" required />}
                        multiline
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("description") ? true : false,
                        }}
                        {...register("description")}
                        error={!!errors.description}
                        helperText={
                          errors?.description
                            ? errors.description.message
                            : null
                        }
                      />
                      {/* <Transliteration
                        variant={"standard"}
                        _key={"description"}
                          labelName={"description"}
                          fieldName={"description"}
                          updateFieldName={"descriptionMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="description" required />}
                          error={!!errors.description}
                          helperText={
                            errors?.description ? errors.description.message : null
                          }
                      /> */}
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

                    {watch("infoSentByPost") === "true" && (
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          error={showPostTypeErr && !watch("postType")}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="postalService" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
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
                          <FormHelperText>
                            {showPostTypeErr && !watch("postType")
                              ? language == "en"
                                ? "Post Type is required"
                                : "पोस्ट प्रकार आवश्यक आहे"
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    )}
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
                              sx={{ width: "100%" }}
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={
                                <FormattedLabel id="requiredInfoDeliveryDetails" />
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
                        {watch("selectedReturnMediaKey") === 11 ? (
                          <div style={{ textAlign: "center" }}>
                            <FormattedLabel id="softCopyNote" />
                          </div>
                        ) : (
                          <></>
                        )}
                      </FormControl>
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
                      <FormControl
                        sx={{ marginTop: "0px", marginLeft: "10px" }}
                      >
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {
                            <FormattedLabel id="isApplicantBelowToPovertyLine" />
                          }
                        </FormLabel>
                        <RadioGroup
                          style={{ marginTop: 5 }}
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          row
                          name="isApplicantBelowToPovertyLine"
                          control={control}
                          value={isBplval}
                          {...register("isApplicantBelowToPovertyLine")}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label={<FormattedLabel id="yes" />}
                            name="RadioButton"
                            {...register("isApplicantBelowToPovertyLine")}
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
                            name="RadioButton"
                            {...register("isApplicantBelowToPovertyLine")}
                            error={!!errors.isApplicantBelowToPovertyLine}
                            helperText={
                              errors?.isApplicantBelowToPovertyLine
                                ? errors.isApplicantBelowToPovertyLine.message
                                : null
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    {isBplval && (
                      <>
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
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={<FormattedLabel id="bplCardNo" required />}
                            inputProps={{ maxLength: 10, minLength: 10 }}
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            variant="standard"
                            InputLabelProps={{
                              shrink: watch("bplCardNo") ? true : false,
                            }}
                            {...register("bplCardNo")}
                            error={showErCardNo && !watch("bplCardNo")}
                            helperText={
                              showErCardNo && !watch("bplCardNo")
                                ? language == "en"
                                  ? "BPl Card No is required"
                                  : "बीपीएल कार्ड क्रमांक आवश्यक आहे"
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}
                    {isBplval && (
                      <>
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
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            variant="standard"
                            // error={!selectedYear && showErYear}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="yearOfIssues" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  fullWidth
                                  value={selectedYear}
                                  onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                  }}
                                  label={<FormattedLabel id="yearOfIssues" />}
                                >
                                  {years &&
                                    years?.map((year) => (
                                      <MenuItem key={year} value={year}>
                                        {year}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="yearOfIssues"
                              control={control}
                              defaultValue=""
                            />
                            {/* <FormHelperText>
                              {!selectedYear && showErYear
                                ? language == "en"
                                  ? "Year of issues is required"
                                  : "अंकांचे वर्ष आवश्यक आहे"
                                : null}
                            </FormHelperText> */}
                          </FormControl>
                        </Grid>
                      </>
                    )}

                    {isBplval && (
                      <>
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
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={<FormattedLabel id="issuingAuthority" />}
                            multiline
                            variant="standard"
                            InputLabelProps={{
                              shrink: watch("issuingAuthority") ? true : false,
                            }}
                            onKeyPress={KeyPressEvents.isInputChar}
                            inputProps={{ maxLength: 100 }}
                            {...register("issuingAuthority")}
                            // error={showErIssAuth && !watch("issuingAuthority")}
                            // helperText={
                            //   showErIssAuth && !watch("issuingAuthority")
                            //     ? language == "en"
                            //       ? "Issuing authority is required"
                            //       : "जारी करणारे प्राधिकरण आवश्यक आहे"
                            //     : null
                            // }
                          />
                        </Grid>
                      </>
                    )}
                    {isBplval && (
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
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FormattedLabel id="bplCardDoc" required />
                        </div>
                        <UploadButton
                          appName="RTI"
                          serviceName="RTI-Application"
                          filePath={setDocument}
                          fileName={document}
                        />
                      </Grid>
                    )}
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
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled
                            inputFormat="DD/MM/YYYY"
                            minDate={watch("fromDate")}
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
                    <Grid item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft:'10px'
                      }}
                >
                   <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        InputLabelProps={{ shrink: watch('place') }}
                        label={<FormattedLabel id="place" />}
                        multiline
                        variant="standard"
                        {...register("place")}
                        error={!!errors.place}
                        helperText={
                          errors?.place
                            ? errors.place.message
                            : null
                        }
                      />
                </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <Box sx={{ width: "88%" }}>
                        <Grid
                          container
                          style={{
                            padding: "10px",
                            backgroundColor: "lightblue",
                          }}
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid
                            item
                            xs={10}
                            sm={10}
                            md={10}
                            lg={10}
                            xl={10}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800,
                                marginLeft: { xs: "5%", md: "20%" },
                                textAlign: { xs: "center", md: "left" },
                              }}
                            >
                              <FormattedLabel id="uploadFile" />
                            </Typography>
                          </Grid>
                          <Grid item md={2} lg={2} xl={2}>
                            <Button
                              variant="contained"
                              endIcon={<Add />}
                              type="button"
                              color="primary"
                              onClick={handleOpen}
                              size="small"
                            >
                              {<FormattedLabel id="addDoc" />}
                            </Button>
                          </Grid>
                        </Grid>

                        <DataGrid
                          sx={{
                            overflowY: "scroll",
                            "& .MuiDataGrid-columnHeadersInner": {
                              backgroundColor: "#556CD6",
                              color: "white",
                            },

                            "& .MuiDataGrid-cell:hover": {
                              color: "primary.main",
                            },
                          }}
                          autoHeight
                          disableSelectionOnClick
                          rows={fetchDocument.filter(
                            (obj) => obj.activeFlag != "N"
                          )}
                          columns={docColumns}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                        />
                      </Box>
                    </Grid>

                    <Grid
                      container
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Grid item>
                        <Button
                          sx={{ margin: 1 }}
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="back" />
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          sx={{ margin: 1 }}
                          variant="contained"
                          color="primary"
                          type="submit"
                          size="small"
                          name="draft"
                          onClick={() => handleSaveAsDraft("draft")}
                        >
                          <FormattedLabel id="saveAsDraft" />
                        </Button>
                      </Grid>

                      {isBplval && (
                        <Grid>
                          <Button
                            sx={{ margin: 1 }}
                            type="submit"
                            variant="contained"
                            size="small"
                            disabled={!document}
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            <FormattedLabel id="save" />
                          </Button>
                        </Grid>
                      )}
                      {isBplval === false && (
                        <Grid>
                          <Button
                            sx={{ margin: 1 }}
                            type="submit"
                            variant="contained"
                            color="success"
                            size="small"
                            endIcon={<SaveIcon />}
                          >
                            <FormattedLabel id="saveAndPay" />
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </>
          </Box>
        </Paper>
      </ThemeProvider>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "15%",
        }}
      >
        <Box
          sx={{
            width: "50%",
            backgroundColor: "white",
            height: "40%",
            borderRadius: "10px",
          }}
        >
          <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1.5%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bolder",
                  fontSize: "large",
                  textTransform: "capitalize",
                }}
              >
                <FormattedLabel id="fileUpload" />
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Document
                appName={"RTI"}
                serviceName={"RTI-Application"}
                fileName={attachedFile} //State to attach file
                filePath={temp}
                fileLabel={setLabel}
                handleClose={handleClose}
                uploading={setUploading}
                modalState={setOpen}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <FormattedLabel id="cancel" />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default EntryForm;
