import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  ThemeProvider,
  Select,
  TextField,
  RadioGroup,
  Radio,
  FormLabel,
  Tooltip,
  Typography,
  Modal,
  Slide,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import sweetAlert from "sweetalert";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "../../../../theme";
import UploadButton from "../../singleFileUploadButton/UploadButton";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import bachatgatRegistration from "../../../../containers/schema/BsupNagarvasthiSchema/bachatgatRegistration";
import saveAsDraftBachatGatRegSchema from "../../../../containers/schema/BsupNagarvasthiSchema/saveAsDraftBachatGatRegSchema";
import Document from "../../uploadDocuments/UploadButton";
import { yupResolver } from "@hookform/resolvers/yup";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { sortByProperty } from "../../../../components/bsupNagarVasthi/bsupCommonFunctions";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const BachatGatCategory = () => {
  const [isName, setSaveButtonName] = useState("");
  const handleSaveAsDraft = (name) => {
    setIsDraft(true);
    setSaveButtonName(name);
  };
  const methods = useForm({
    criteriaMode: "all",
    resolver:
      isName === "draft"
        ? yupResolver(saveAsDraftBachatGatRegSchema)
        : yupResolver(bachatgatRegistration),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);
  const [memberList, setMemberData] = useState([]);
  const [memberUpdate, setMemberUpdate] = useState([]);
  const [slideChecked, setSlideChecked] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const [areaId, setAreaId] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [bachatGatCategory, setBachatGatCategory] = useState([]);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [loadFormData, setLoadFormData] = useState(null);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [documentUpdate, setDocumentUpdate] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  const [checkAdharNo, setCheckAdharNo] = useState("");
  const [areaNm, setAreaNm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState();
  const [ID, setIDd] = useState(undefined);
  const [label, setLabel] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let userCitizen = useSelector((state) => {
    return state?.user?.user;
  });
  let filePath = {};
  const [docUpload, setDocUpload] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

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

  const [value1, setValue1] = useState("false");
  const [value2, setValue2] = useState("false");
  const [value3, setValue3] = useState("false");

  const handleQuestionAnswerChange = (event) => {
    // setValue1(event.target.value);
  };

  useEffect(() => {
    setValue1(watch("questionFirstOption"));
  }, [watch("questionFirstOption")]);
  useEffect(() => {
    setValue2(watch("questionSecoundOption"));
  }, [watch("questionSecoundOption")]);
  useEffect(() => {
    setValue3(watch("questionThirdOption"));
  }, [watch("questionThirdOption")]);

  const headers = { Authorization: `Bearer ${user.token}` };
  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
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

  const handleClose = () => {
    setFetchDocuments([
      ...fetchDocument,
      {
        srNo:
          fetchDocument.length != 0
            ? fetchDocument[fetchDocument.length - 1].srNo + 1
            : 1,
        id:
          fetchDocument.length != 0
            ? fetchDocument[fetchDocument.length - 1].id + 1
            : 1,
        documentKey: null,
        documentPath: filePath.filePath,
        fileType:
          filePath?.extension &&
          filePath?.extension.split(".")[1].toUpperCase(),
        attachedDate: moment(new Date()).format("DD/MM/YYYY, h:mm:ss a"),
        fileName: filePath.fileName,
        activeFlag: "Y",
        bachatgatNo: null,
        bachatgatRegistrationKey: Number(router.query.id),
        bachatgatRenewalKey: null,
        documentFlow: null,
        documentTypeKey: null,
        serviceWiseChecklistKey: null,
        trnBachatgatRegistrationDocumentsList: null,
        trnType: "BGR",
        addUpdate: "Add",
      },
    ]);
    setDocumentUpdate([
      ...documentUpdate,
      {
        srNo:
          documentUpdate.length != 0
            ? documentUpdate[documentUpdate.length - 1].srNo + 1
            : 1,
        id:
          documentUpdate.length != 0
            ? documentUpdate[documentUpdate.length - 1].id + 1
            : 1,
        documentKey: null,
        documentPath: filePath.filePath,
        fileType:
          filePath?.extension &&
          filePath?.extension.split(".")[1].toUpperCase(),
        attachedDate: moment(new Date()).format("DD/MM/YYYY, h:mm:ss a"),
        fileName: filePath.fileName,
        activeFlag: "Y",
        bachatgatNo: null,
        bachatgatRegistrationKey: Number(router.query.id),
        bachatgatRenewalKey: null,
        documentFlow: null,
        documentTypeKey: null,
        serviceWiseChecklistKey: null,
        trnBachatgatRegistrationDocumentsList: null,
        trnType: "BGR",
        addUpdate: "Add",
      },
    ]);
    setAttachedFile("");
    setUploading(false);
  };
  function temp(arg) {
    filePath = arg;
  }

  const deleteById = (value, _activeFlag) => {
    sweetAlert({
      title: language === "en" ? "Delete?" : "हटवा?",
      text:
        language === "en"
          ? "Are you sure you want to delete this file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      buttons: [
        language == "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
      dangerMode: true,
      allowOutsideClick: false, // Prevent closing on outside click
      allowEscapeKey: false, // Prevent closing on Esc key
      closeOnClickOutside: false,
    }).then((result) => {
      if (result) {
        const deleteArr = fetchDocument.map((obj, index) => {
          if (obj.id === value) {
            return { ...obj, activeFlag: "N" };
          }
          return obj;
        });
        setFetchDocuments(deleteArr);

        const updatedRecords = deleteArr?.filter(
          (record) => record.activeFlag === "Y"
        );
        const updatedRecordsWithSerial = updatedRecords.map((record, index) => {
          return { ...record, srNo: index + 1 };
        });
        setDocumentUpdate(updatedRecordsWithSerial);
        sweetAlert(
          language === "en"
            ? "File deleted successfully!"
            : "फाइल यशस्वीरित्या हटवली!",
          {
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false,
          }
        );
      }
    });
  };

  const deleteMemberById = (value, _activeFlag) => {
    sweetAlert({
      title: language === "en" ? "Delete?" : "हटवा?",
      text:
        language === "en"
          ? "Are you sure you want to delete this member ? "
          : "तुम्हाला नक्की सदस्य हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      buttons: [
        language == "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
      allowOutsideClick: false, // Prevent closing on outside click
      allowEscapeKey: false, // Prevent closing on Esc key
      closeOnClickOutside: false,
      dangerMode: true,
    }).then((result) => {
      if (result) {
        const deleteArr = memberList?.map((obj, index) => {
          if (obj.id === value) {
            return { ...obj, activeFlag: "N" };
          }
          return obj;
        });
        setMemberData(deleteArr);
        const updatedRecords = deleteArr?.filter(
          (record) => record.activeFlag === "Y"
        );
        const updatedRecordsWithSerial = updatedRecords.map((record, index) => {
          return { ...record, srNo: index + 1 };
        });
        setMemberUpdate(updatedRecordsWithSerial);
        sweetAlert(
          language === "en"
            ? "Member deleted successfully!"
            : "सदस्य यशस्वीरित्या हटवली!",
          {
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false,
          }
        );
      }
    });
  };

  const memColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: <FormattedLabel id="memFullName" />,
      flex: 1,
      align: "left",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: <FormattedLabel id="memFullAdd" />,
      flex: 1,
      align: "left",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="memDesign" />,
      flex: 1,
      align: "left",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "aadharNumber",
      headerName: <FormattedLabel id="memAdharNo" />,
      flex: 1,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      flex: 1,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setIDd(record.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setValue("fullName", record.row.fullName);
                setValue("address", record.row.address);
                setValue("designation", record.row.designation);
                setValue("aadharNumber", record.row.aadharNumber);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {record.row.activeFlag === "Y" && (
              <IconButton
                disabled={editButtonInputState}
                color="primary"
                onClick={() => deleteMemberById(record.id, "N")}
              >
                <DeleteIcon style={{ color: "red", fontSize: 30 }} />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  const docColumns = [
    {
      field: "srNo",
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
      headerName: <FormattedLabel id="view" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={async () => {
                getFilePreview(record?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
            {record.row.activeFlag === "Y" && (
              <IconButton
                color="primary"
                onClick={() => deleteById(record.id, "N")}
              >
                <DeleteIcon style={{ color: "red", fontSize: 30 }} />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  const updateMember = async () => {
    if (
      watch("address") === "" ||
      watch("address") === undefined ||
      watch("fullName") === "" ||
      watch("fullName") === undefined ||
      watch("designation") === "" ||
      watch("designation") === undefined ||
      watch("aadharNumber") === "" ||
      watch("aadharNumber") === undefined
    ) {
      setShowError(true);
    } else {
      if (Number(watch("aadharNumber").length < 12)) {
        swal(
          language === "en"
            ? "Please enter correct aadhar no"
            : "कृपया योग्य आधार क्रमांक टाका",
          { button: language === "en" ? "Ok" : "ठीक आहे" }
        );
      } else {
        setShowError(false);
        if (
          checkAdharNo === "Eligible to get registered" ||
          (checkAdharNo == "" && router.query.id)
        ) {
          const duplicateNames = await handleAdd(watch("aadharNumber"), ID);
          if (duplicateNames === true) {
            setCheckAdharNo("Found But Not Eligible to get registered");
          } else {
            setCheckAdharNo("Eligible to get registered");
            memberList?.map((obj, index) => {
              if (obj.id === ID) {
                const updatedData = {
                  fullName: watch("fullName"),
                  address: watch("address"),
                  designation: watch("designation"),
                  aadharNumber: watch("aadharNumber"),
                  activeFlag: obj.activeFlag,
                  id: ID,
                  srNo: obj.srNo,
                  addUpdate: obj.addUpdate,
                };
                setMemberData(update(memberList, ID, updatedData));

                const updatedRecords = update(
                  memberList,
                  ID,
                  updatedData
                )?.filter((record) => record.activeFlag === "Y");
                const updatedRecordsWithSerial = updatedRecords.map(
                  (record, index) => {
                    return { ...record, srNo: index + 1 };
                  }
                );
                setMemberUpdate(updatedRecordsWithSerial);
                setShowError(false);
                setSlideChecked(false);
                setIsOpenCollapse(false);
                setEditButtonInputState(false);
                setIDd(undefined);
              }
            });
          }
          if (ID === undefined) {

            const duplicateNames = await handleAdd(watch("aadharNumber"));
            if (duplicateNames === true) {
              setCheckAdharNo("Found But Not Eligible to get registered");
            } else {
              setShowError(false);
              setMemberData((obj) => [
                ...obj,
                {
                  fullName: watch("fullName"),
                  address: watch("address"),
                  designation: watch("designation"),
                  aadharNumber: watch("aadharNumber"),
                  activeFlag: "Y",
                  srNo: memberList?.length + 1,
                  id: memberList?.length + 1,
                  addUpdate: "Add",
                },
              ]);
              setMemberUpdate((obj) => [
                ...obj,
                {
                  fullName: watch("fullName"),
                  address: watch("address"),
                  designation: watch("designation"),
                  aadharNumber: watch("aadharNumber"),
                  activeFlag: "Y",
                  srNo: memberUpdate?.length + 1,
                  id: memberList?.length + 1,
                  addUpdate: "Add",
                },
              ]);

              setShowError(false);
              setSlideChecked(false);
              setIsOpenCollapse(false);
              setEditButtonInputState(false);
            }
          }
        }
      }
    }
  };


  const handleAdd = (newItem, dummyId) => {
    let dummyMemlist = memberList.filter((obj) => obj.id != dummyId);
    const isDuplicate = dummyMemlist.some(
      (item) => item.aadharNumber === newItem
    );
    return isDuplicate;
  };

  function update(arr, id, updatedData) {
    return arr.map((item, index) =>
      item.id === id ? { ...item, ...updatedData } : item
    );
  }

  // set citizen personal details
  useEffect(() => {
    if (loggedUser === "citizenUser") {
      setValue("applicantFirstName", userCitizen?.firstName);
      setValue("applicantMiddleName", userCitizen?.middleName);
      setValue("applicantLastName", userCitizen?.surname);
      setValue("applicantFirstNameMr", userCitizen?.firstNamemr);
      setValue("applicantMiddleNameMr", userCitizen?.middleNamemr);
      setValue("applicantLastNameMr", userCitizen?.surnamemr);
      setValue(
        "applicantFullName",
        userCitizen?.firstName +
          " " +
          userCitizen?.middleName +
          " " +
          userCitizen?.surname
      );
      setValue(
        "applicantFullNameMr",
        userCitizen?.firstNamemr +
          " " +
          userCitizen?.middleNamemr +
          " " +
          userCitizen?.surnamemr
      );

      setValue("emailId", userCitizen?.emailID);
      setValue("mobileNo", userCitizen?.mobile);
    }
  }, [userCitizen, language]);

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
    getBachatGatCategory();
    getBank();
  }, []);

  useEffect(() => {
    if (router.query.id == null)
      setDocUpload([
        {
          id: 1,
          title:
            language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
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
    setAreaNm(
      crAreaNames &&
        crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
        ? crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
        : ""
    );
  }, [watch("areaKey")]);

  useEffect(() => {
    if (areaNm != " " && areaNm != null) {
      getAreas();
    }
  }, [areaNm]);

  const getAreas = () => {
    if (watch("areaName") != undefined) {
      setIsLoading(true);
      axios
        .get(
          `${
            urls.CFCURL
          }/master/zoneWardAreaMapping/getAreaName?areaName=${watch(
            "areaName"
          )}`,
          { headers: headers }
        )
        .then((res) => {
          setIsLoading(false);
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
              // setAreaId(
              //   language === "en"
              //     ? data.sort(sortByProperty("areaName"))
              //     : data.sort(sortByProperty("areaNameMr"))
              // );
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
                closeOnClickOutside: false,
              });
            }
          } else {
            setValue("zoneKey", "");
            setValue("wardKey", "");
            sweetAlert({
              title: language === "en" ? "OOPS!" : "क्षमस्व!",
              text:
                language === "en"
                  ? "Something went wrong!"
                  : "काहीतरी चूक झाली!",
              icon: "error",
              dangerMode: true,
              button: language === "en" ? "Ok" : "ठीक आहे",
              closeOnClickOutside: false,
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false, // Prevent closing on Esc key
              closeOnClickOutside: false,
            });
          }
        })
        .catch((err) => {
          setValue("zoneKey", "");
          setValue("wardKey", "");
          setIsLoading(false);
          cfcErrorCatchMethod(err, true);
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
  }, [watch("areaKey"), areaId]);

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
          setCheckAdharNo(res.data.status);
          if (res.data.status === "Found But Not Eligible to get registered") {
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // load zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, { headers: headers })
      .then((r) => {
        setZoneNames(
          r.data.zone.map((row, index) => ({
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

  //load ward details
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, { headers: headers })
      .then((r) => {
        setWardNames(
          r.data.ward.map((row, index) => ({
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

  // loadAreaName
  const getCRAreaName = () => {
    axios
      .get(`${urls.CfcURLMaster}/area/getAll`, { headers: headers })
      .then((r) => {
        setCRAreaName(
          r.data.area.map((row, index) => ({
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

  // load bank
  const getBank = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, { headers: headers })
      .then((r) => {
        let data = r.data.bank;
        setBankMasters(
          language === "en"
            ? data.sort(sortByProperty("bankName"))
            : data.sort(sortByProperty("bankNameMr"))
        );

        return r.data.bank;
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load bachatgat category
  const getBachatGatCategory = () => {
    axios
      .get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let data = r.data.mstBachatGatCategoryList.map((row, index) => ({
          id: row.id,
          bachatGatCategoryName: row.bgCategoryName,
          bachatGatCategoryNameMr: row.bgCategoryMr,
        }));
        setBachatGatCategory(
          language === "en"
            ? data.sort(sortByProperty("bachatGatCategoryName"))
            : data.sort(sortByProperty("bachatGatCategoryNameMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // save NEW bachatgat registration
  const onSubmitForm = (formData) => {
    setIsLoading(true);
    const isDraft = window.event.submitter.name === "draft";
    setIsDraft(isDraft);
    if (showAlert) {
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
      const docArray = fetchDocument.map((obj, index) => {
        if (obj.addUpdate === "Add") {
          return { ...obj, id: null };
        }
        return obj;
      });
      const memArray = memberList.map((obj, index) => {
        if (obj.addUpdate === "Add") {
          return { ...obj, id: null };
        }
        return obj;
      });
      const finalBodyForApi = [
        {
          ...loadFormData,
          ...formData,
          id: Number(router.query.id),
          totalMembersCount: Number(formData.totalMembersCount),
          areaKey: Number(formData.areaKey),
          isDraft: isDraft,
          trnBachatgatRegistrationDocumentsList: docArray,
          trnBachatgatRegistrationMembersList: memArray,
          passbookFrontPage:
            docUpload && docUpload.find((obj) => obj.id == 1)?.documentPath,

          passbookLastPage:
            docUpload && docUpload.find((obj) => obj.id == 2)?.documentPath,
          existingBachatgat: selectedValue === "existing" ? true : false,
          oldBachatgatNo:
            selectedValue === "existing" ? formData.oldBachatgatNo : 0,
          frontPageFileType:
            docUpload &&
            docUpload
              .find((obj) => obj.id == 1)
              ?.documentPath.split(".")
              .pop(),
          lastPageFileType:
            docUpload &&
            docUpload
              .find((obj) => obj.id == 2)
              ?.documentPath.split(".")
              .pop(),
          isApproved: false,
          isComplete: false,
        },
      ];
      const tempData = axios
        .post(
          `${urls.BSUPURL}/trnBachatgatRegistration/save`,
          finalBodyForApi,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            !isDraft
              ? sweetAlert({
                  text:
                    language === "en"
                      ? ` Your request for bachatgat registration is sent successfully. Your application no. is : ${
                          res.data.message.split("[")[1].split("]")[0]
                        } `
                      : `बचतगट नोंदणीसाठी तुमची विनंती यशस्वीरीत्या पाठवली आहे. तुमचा अर्ज क्र. आहे: ${
                          res.data.message.split("[")[1].split("]")[0]
                        }`,
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
                        trn: "R",
                      },
                    });
                  }
                })
              : sweetAlert({
                  title: language == "en" ? "Saved!" : "जतन केले",
                  text:
                    language == "en"
                      ? "Bachatgat registration saved in draft successfully !"
                      : "बचतगट नोंदणी मसुद्यात यशस्वीरित्या जतन झाला!",
                  icon: "success",
                  dangerMode: false,
                  allowOutsideClick: false, // Prevent closing on outside click
                  allowEscapeKey: false, // Prevent closing on Esc key
                  closeOnClickOutside: false,
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  closeOnClickOutside: false,
                }).then((will) => {
                  if (will) {
                    router.push("/dashboard");
                  }
                });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const loadDraftData = () => {
    setIsLoading(true);
    const loadData = axios
      .get(
        `${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${router.query.id}`,
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
  };

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      loadDraftData();
  }, [router.query.id]);

  useEffect(() => {
    if (loadFormData != null) setDataOnForm();
  }, [loadFormData, language]);

  const setDataOnForm = () => {
    let data = loadFormData;
    // getAreas( data.areaKey)
    setValue("areaKey", data.areaKey);
    setSelectedValue(data.existingBachatgat ? "existing" : "new");
    setValue("zoneKey", Number(data.zoneKey));
    setValue("wardKey", Number(data.wardKey));
    setValue("geoCode", data.geoCode);
    setValue("oldBachatgatNo", data.oldBachatgatNo);
    setValue("oldBachatgatRegDate", data.oldBachatgatRegDate);
    setValue("bachatgatName", data.bachatgatName);
    setValue("categoryKey", data.categoryKey);
    setValue("presidentFirstName", data.presidentFirstName);
    setValue("presidentLastName", data.presidentLastName);
    setValue("presidentMiddleName", data.presidentMiddleName);
    setValue("totalMembersCount", data.totalMembersCount);
    setValue("flatBuldingNo", data.flatBuldingNo);
    setValue("buildingName", data.buildingName);
    setValue("roadName", data.roadName);
    setValue("landmark", data.landmark);
    setValue("pinCode", data.pinCode);
    setValue("landlineNo", data.landlineNo);
    setValue("applicantFirstName", data?.applicantFirstName);
    setValue("applicantMiddleName", data?.applicantMiddleName);
    setValue("applicantLastName", data?.applicantLastName);
    setValue("emailId", data?.emailId);
    setValue("mobileNo", data?.mobileNo);
    setValue(
      "bankNameId",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        : "-"
    );
    setValue("bankBranchKey", data.bankBranchKey);
    setValue(
      "bankIFSC",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        : "-"
    );
    setValue(
      "bankMICR",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode
        : "-"
    );
    setValue("accountNo", data.accountNo);
    setValue("bankAccountFullName", data.bankAccountFullName);
    setValue("startDate", data.startDate);
    setValue("saSanghatakRemark", data.saSanghatakRemark);
    setValue("deptClerkRemark", data.deptClerkRemark);
    setValue("deptyCommissionerRemark", data.deptyCommissionerRemark);
    setValue("asstCommissionerRemark", data.asstCommissionerRemark);
    setValue("branchName", data.branchName);
    setValue("ifscCode", data.ifscCode);
    setValue("micrCode", data.micrCode);
    setValue("pan_no", data.pan_no);
    setValue3(data.questionThirdOption === "true" ? "true" : "false");
    setValue2(data.questionSecoundOption === "true" ? "true" : "false");
    setValue1(data.questionFirstOption === "true" ? "true" : "false");

    setValue(
      "questionThirdOption",
      data.questionThirdOption === "true" ? "true" : "false"
    );
    setValue(
      "questionSecoundOption",
      data.questionSecoundOption === "true" ? "true" : "false"
    );
    setValue("questionThirdAns", data.questionThirdAns);
    setValue("questionSecoundAns", data.questionSecoundAns);
    setValue("questionFirstAns", data.questionFirstAns);
    setValue(
      "questionFirstOption",
      data.questionFirstOption === "true" ? "true" : "false"
    );

    setMemberData([]);
    let res = data.trnBachatgatRegistrationMembersList.map((r, i) => {
      return {
        bachatgatRegistrationKey: Number(router.query.id),
        id: r.id,
        srNo: i + 1,
        fullName: r.fullName,
        address: r.address,
        designation: r.designation,
        aadharNumber: r.aadharNumber,
        activeFlag: r.activeFlag === "Y" ? r.activeFlag : " ",
      };
    });
    setMemberData([...res]);
    setMemberUpdate([...res]);
    const bankDoc = [];
    setDocUpload([
      {
        id: 1,
        title: language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentPath: data.passbookFrontPage,
      },
      {
        id: 2,
        title: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentPath: data.passbookLastPage,
      },
    ]);

    let _res = data.trnBachatgatRegistrationDocumentsList.map((r, i) => {
      bankDoc.push({
        id: r.id,
        srNo: i + 1,
        fileType: r.documentPath && r.documentPath.split(".").pop(),
        documentPath: r.documentPath,
        activeFlag: r.activeFlag,
        fileName:
          r.documentPath &&  DecryptData("passphraseaaaaaaaaupload",r.documentPath).split("/").pop().split("_").pop(),
        bachatgatRegistrationKey: r.bachatgatRegistrationKey,
        bachatgatRenewalKey: r.bachatgatRenewalKey,
        documentFlow: r.documentFlow,
        activeFlag: r.activeFlag,
        bachatgatNo: r.bachatgatNo,
        documentTypeKey: r.documentTypeKey,
        serviceWiseChecklistKey: r.serviceWiseChecklistKey,
        trnBachatgatRegistrationDocumentsList:
          r.trnBachatgatRegistrationDocumentsList,
        attachedDate: r.createDtTm,
        addUpdate: "Update",
      });
    });
    setFetchDocuments([...bankDoc]);
    setDocumentUpdate([...bankDoc.filter((obj) => obj.activeFlag === "Y")]);
  };

  const [selectedValue, setSelectedValue] = useState(null); //'existing'

  //radio button selection value
  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // UI
  return (
    <>
      {isLoading && <CommonLoader />}
      <ThemeProvider theme={theme}>
        <>
          <BreadcrumbComponent />
        </>
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
                  <FormattedLabel id="bachatGatDetails" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <div>
              <label>
                <input
                  type="radio"
                  name="option"
                  value="existing"
                  style={{ marginRight: "10px" }}
                  checked={selectedValue === "existing"}
                  onChange={handleRadioChange}
                />
                {/* Existing Bachat Gat */}
                <FormattedLabel id="existingBachatGat" />
              </label>
              <label>
                <input
                  type="radio"
                  name="option"
                  value="new"
                  style={{ marginLeft: "20px", marginRight: "10px" }}
                  checked={selectedValue === "new"}
                  onChange={handleRadioChange}
                />
                <FormattedLabel id="newBachatGat" />
              </label>
            </div>
          </Box>
          <FormProvider {...methods}>
            {/* New Bachat Gat Registation Form */}
            {selectedValue === "new" && (
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container spacing={2} style={{ padding: "1rem" }}>
                  {/* Area Name */}
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
                          required={!isDraft}
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
                                button: language === "en" ? "Ok" : "ठीक आहे",
                                closeOnClickOutside: false,
                                allowOutsideClick: false, // Prevent closing on outside click
                                allowEscapeKey: false, // Prevent closing on Esc key
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
                          <FormHelperText>
                            {errors?.areaKey ? errors.areaKey.message : null}
                          </FormHelperText>
                        </FormControl>
                        <Button
                          variant="contained"
                          color="primary"
                          // className={commonStyles.search}
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
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="zoneNames" />}>
                      <FormControl
                        error={errors.zoneKey}
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zoneNames" />
                          <span style={{ color: "red" }}>*</span>
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
                    </Tooltip>
                  </Grid>

                  {/* Ward name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="wardname" />}>
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.wardKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="wardname" />
                          <span style={{ color: "red" }}>*</span>
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
                    </Tooltip>
                  </Grid>

                  {/* geoCode */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="gisgioCode" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="gisgioCode" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("geoCode") ? true : false,
                        }}
                        {...register("geoCode")}
                      />
                    </Tooltip>
                  </Grid>

                  {/* bachatgat category name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bachatgatCat" />}>
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.categoryKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="bachatgatCat" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              {bachatGatCategory &&
                                bachatGatCategory.map((service, index) => (
                                  <MenuItem key={index} value={service.id}>
                                    {language == "en"
                                      ? service.bachatGatCategoryName
                                      : service.bachatGatCategoryNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="categoryKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.categoryKey
                            ? errors.categoryKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Tooltip>
                  </Grid>

                  {/* bachatgat name */}
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Tooltip title={<FormattedLabel id="bachatgatFullName" />}>
                      <TextField
                        id="standard-basic"
                        required={!isDraft}
                        label={<FormattedLabel id="bachatgatFullName" />}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("bachatgatName") ? true : false,
                        }}
                        {...register("bachatgatName")}
                        error={!!errors.bachatgatName}
                        helperText={
                          errors?.bachatgatName
                            ? errors.bachatgatName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Bachat Gat start date */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bachatgatStartDate" />}>
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.fromDate}
                      >
                        <Controller
                          control={control}
                          name="startDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                variant="standard"
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {<FormattedLabel id="bachatgatStartDate" />}
                                    <span style={{ color: "red" }}>*</span>
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    variant="standard"
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.startDate ? errors.startDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Tooltip>
                  </Grid>

                  {/* {/* bachatgat  address box*/}
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
                            <FormattedLabel id="bachatgatAddress" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* president first name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="presidentFirstName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="presidentFirstName" />}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("presidentFirstName") ? true : false,
                        }}
                        {...register("presidentFirstName")}
                        error={!!errors.presidentFirstName}
                        helperText={
                          errors?.presidentFirstName
                            ? errors.presidentFirstName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* president middle name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip
                      title={<FormattedLabel id="presidentFatherName" />}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="presidentFatherName" />}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("presidentMiddleName") ? true : false,
                        }}
                        {...register("presidentMiddleName")}
                        error={!!errors.presidentMiddleName}
                        helperText={
                          errors?.presidentMiddleName
                            ? errors.presidentMiddleName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* president last name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="presidentLastName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="presidentLastName" />}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("presidentLastName") ? true : false,
                        }}
                        {...register("presidentLastName")}
                        error={!!errors.presidentLastName}
                        helperText={
                          errors?.presidentLastName
                            ? errors.presidentLastName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* total members count */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title="Gat Total Members Count">
                      <TextField
                        id="standard-basic"
                        required={!isDraft}
                        label={<FormattedLabel id="totalCount" />}
                        variant="standard"
                        inputProps={{ maxLength: 2 }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        InputLabelProps={{
                          shrink: watch("totalMembersCount") ? true : false,
                        }}
                        {...register("totalMembersCount")}
                        error={!!errors.totalMembersCount}
                        helperText={
                          errors?.totalMembersCount
                            ? errors.totalMembersCount.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* building no */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="flatBuildNo" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="flatBuildNo" />}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("flatBuldingNo") ? true : false,
                        }}
                        {...register("flatBuldingNo")}
                        error={!!errors.flatBuldingNo}
                        helperText={
                          errors?.flatBuldingNo
                            ? errors.flatBuldingNo.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* building name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="buildingNm" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="buildingNm" />}
                        variant="standard"
                        inputProps={{ maxLength: 100 }}
                        InputLabelProps={{
                          shrink: watch("buildingName") ? true : false,
                        }}
                        {...register("buildingName")}
                        error={!!errors.buildingName}
                        helperText={
                          errors?.buildingName
                            ? errors.buildingName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Road Name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="roadName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="roadName" />}
                        variant="standard"
                        inputProps={{ maxLength: 100 }}
                        InputLabelProps={{
                          shrink: watch("roadName") ? true : false,
                        }}
                        {...register("roadName")}
                        error={!!errors.roadName}
                        helperText={
                          errors?.roadName ? errors.roadName.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Landmark */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="landmark" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="landmark" />}
                        required={!isDraft}
                        variant="standard"
                        inputProps={{ maxLength: 100 }}
                        InputLabelProps={{
                          shrink: watch("landmark") ? true : false,
                        }}
                        {...register("landmark")}
                        error={!!errors.landmark}
                        helperText={
                          errors?.landmark ? errors.landmark.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Pin Code */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="pincode" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        inputProps={{
                          maxLength: 6,
                          minLength: isDraft ? 6 : 0,
                        }}
                        label={<FormattedLabel id="pincode" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("pinCode") ? true : false,
                        }}
                        {...register("pinCode")}
                        error={!!errors.pinCode}
                        helperText={
                          errors?.pinCode ? errors.pinCode.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/*  Applicant Name Details box*/}

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

                  {loggedUser === "citizenUser" && (
                    <>
                      {/* applicant first name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantFirstName" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
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
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantFirstNameMr" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
                            label={<FormattedLabel id="applicantFirstNameMr" />}
                            variant="standard"
                            {...register("applicantFirstNameMr")}
                            error={!!errors.applicantFirstNameMr}
                            helperText={
                              errors?.applicantFirstNameMr
                                ? errors.applicantFirstNameMr.message
                                : null
                            }
                          />
                        </Tooltip>
                      </Grid>
                      {/* applicant middle name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantMiddleName" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
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
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantMiddleNameMr" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
                            label={
                              <FormattedLabel id="applicantMiddleNameMr" />
                            }
                            variant="standard"
                            {...register("applicantMiddleNameMr")}
                            error={!!errors.applicantMiddleNameMr}
                            helperText={
                              errors?.applicantMiddleNameMr
                                ? errors.applicantMiddleNameMr.message
                                : null
                            }
                          />
                        </Tooltip>
                      </Grid>
                      {/* applicant last name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantLastName" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
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
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantLastNameMr" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
                            label={<FormattedLabel id="applicantLastNameMr" />}
                            variant="standard"
                            {...register("applicantLastNameMr")}
                            error={!!errors.applicantLastNameMr}
                            helperText={
                              errors?.applicantLastNameMr
                                ? errors.applicantLastNameMr.message
                                : null
                            }
                          />
                        </Tooltip>
                      </Grid>
                    </>
                  )}

                  {loggedUser === "departmentUser" && (
                    <>
                      {/* applicant first name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantFirstName"}
                          labelName={"applicantFirstName"}
                          fieldName={"applicantFirstName"}
                          updateFieldName={"applicantFirstNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="applicantFirstName" required />
                          }
                          error={!!errors.applicantFirstName}
                          helperText={
                            errors?.applicantFirstName
                              ? errors.applicantFirstName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                      {/* applicant middle name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantMiddleName"}
                          labelName={"applicantMiddleName"}
                          fieldName={"applicantMiddleName"}
                          updateFieldName={"applicantMiddleNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="applicantMiddleName" required />
                          }
                          error={!!errors.applicantMiddleName}
                          helperText={
                            errors?.applicantMiddleName
                              ? errors.applicantMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                      {/* applicant last name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantLastNameMr"}
                          labelName={"applicantLastNameMr"}
                          fieldName={"applicantLastNameMr"}
                          updateFieldName={"applicantLastName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={
                            <FormattedLabel id="applicantLastNameMr" required />
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
                  {/* Landline No. */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="landlineNo" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        inputProps={{ maxLength: 12, minLength: 12 }}
                        id="standard-basic"
                        label={<FormattedLabel id="landlineNo" />}
                        variant="standard"
                        {...register("landlineNo")}
                        error={!!errors.landlineNo}
                        helperText={
                          errors?.landlineNo ? errors.landlineNo.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* mobile no */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="mobileNo" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        disabled={loggedUser === "citizenUser" ? true : false}
                        label={<FormattedLabel id="mobileNo" />}
                        variant="standard"
                        {...register("mobileNo")}
                        error={!!errors.mobileNo}
                        helperText={
                          errors?.mobileNo ? errors.mobileNo.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Email Id */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="emailId" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        disabled={loggedUser === "citizenUser" ? true : false}
                        label={<FormattedLabel id="emailId" />}
                        variant="standard"
                        {...register("emailId")}
                        error={!!errors.emailId}
                        helperText={
                          errors?.emailId ? errors.emailId.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Bank details box */}

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

                  {/* Bank name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bankName" />}>
                      <FormControl
                        variant="standard"
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
                          {errors?.bankBranchKey
                            ? errors.bankBranchKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Tooltip>
                  </Grid>

                  {/* Branch Name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="branchName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
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
                    </Tooltip>
                  </Grid>

                  {/* Saving Account No */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="accountNo" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        inputProps={{ maxLength: 18, minLength: 6 }}
                        label={<FormattedLabel id="accountNo" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("accountNo") ? true : false,
                        }}
                        {...register("accountNo")}
                        error={!!errors.accountNo}
                        helperText={
                          errors?.accountNo ? errors.accountNo.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Saving Account Name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="accountHolderName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="accountHolderName" />}
                        variant="standard"
                        inputProps={{ maxLength: 500 }}
                        InputLabelProps={{
                          shrink: watch("bankAccountFullName") ? true : false,
                        }}
                        {...register("bankAccountFullName")}
                        error={!!errors.bankAccountFullName}
                        helperText={
                          errors?.bankAccountFullName
                            ? errors.bankAccountFullName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* ifsc code */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bankIFSC" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="bankIFSC" />}
                        variant="standard"
                        inputProps={{ maxLength: 11, minLength: 11 }}
                        InputLabelProps={{
                          shrink: watch("ifscCode") ? true : false,
                        }}
                        {...register("ifscCode")}
                        error={!!errors.ifscCode}
                        helperText={
                          errors?.ifscCode ? errors.ifscCode.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Bank MICR Code */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bankMICR" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="bankMICR" />}
                        variant="standard"
                        inputProps={{ maxLength: 9, minLength: 9 }}
                        {...register("micrCode")}
                        InputLabelProps={{
                          shrink: watch("micrCode") ? true : false,
                        }}
                        error={!!errors.micrCode}
                        helperText={
                          errors?.micrCode ? errors.micrCode.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* PAN Number */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="panNumber" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="panNumber" />}
                        variant="standard"
                        inputProps={{ maxLength: 10, minLength: 10 }}
                        {...register("pan_no")}
                        InputLabelProps={{
                          shrink: watch("pan_no") ? true : false,
                        }}
                        error={!!errors.pan_no}
                        helperText={
                          errors?.pan_no ? errors.pan_no.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  <Grid container sx={{ margin: "10px" }}>
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
                    {docUpload &&
                      docUpload?.map((obj, index) => {
                        return (
                          <Grid
                            container
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

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                  <Grid container style={{paddingLeft:'1rem'}}>
                    <FormControl
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: "29px",
                      }}
                    >
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="question1" />}
                      </FormLabel>
                      <RadioGroup
                        style={{ marginTop: 5 }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        row
                        name="questionFirstOption"
                        control={control}
                        value={value1}
                        // onChange={handleQuestionAnswerChange}
                        {...register("questionFirstOption")}
                      >
                        <FormControlLabel
                          value={"true"}
                          control={<Radio />}
                          label={<FormattedLabel id="yes" />}
                          name="RadioButton"
                          {...register("questionFirstOption")}
                          error={!!errors.questionFirstOption}
                          helperText={
                            errors?.questionFirstOption
                              ? errors.questionFirstOption.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value={"false"}
                          control={<Radio />}
                          label={<FormattedLabel id="no" />}
                          name="RadioButton"
                          {...register("questionFirstOption")}
                          error={!!errors.questionFirstOption}
                          helperText={
                            errors?.questionFirstOption
                              ? errors.questionFirstOption.message
                              : null
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {value1 === "true" && (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="mahilaPrashikshan" />}
                        variant="standard"
                        inputProps={{ maxLength: 1000 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        multiline
                        {...register("questionFirstAns")}
                        error={!!errors.questionFirstAns}
                        helperText={
                          errors?.questionFirstAns
                            ? errors.questionFirstAns.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  <Grid container style={{paddingLeft:'1rem'}}>
                    <FormControl
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: "29px",
                      }}
                    >
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="question2" />}
                      </FormLabel>
                      <RadioGroup
                        style={{ marginTop: 5 }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        row
                        name="questionSecoundOption"
                        control={control}
                        value={value2}
                        // onChange={handleQuestionAnswerChange}
                        {...register("questionSecoundOption")}
                      >
                        <FormControlLabel
                          value={"true"}
                          control={<Radio />}
                          label={<FormattedLabel id="yes" />}
                          name="RadioButton"
                          {...register("questionSecoundOption")}
                          error={!!errors.questionSecoundOption}
                          helperText={
                            errors?.questionSecoundOption
                              ? errors.questionSecoundOption.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value={"false"}
                          control={<Radio />}
                          label={<FormattedLabel id="no" />}
                          name="RadioButton"
                          {...register("questionSecoundOption")}
                          error={!!errors.questionSecoundOption}
                          helperText={
                            errors?.questionSecoundOption
                              ? errors.questionSecoundOption.message
                              : null
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {value2 === "true" && (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="vyavsayacheNav" />}
                        variant="standard"
                        inputProps={{ maxLength: 1000 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        multiline
                        {...register("questionSecoundAns")}
                        error={!!errors.questionSecoundAns}
                        helperText={
                          errors?.questionSecoundAns
                            ? errors.questionSecoundAns.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  <Grid container style={{paddingLeft:'1rem'}}>
                    <FormControl
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: "29px",
                      }}
                    >
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="question3" />}
                      </FormLabel>
                      <RadioGroup
                        style={{ marginTop: 5 }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        row
                        name="questionThirdOption"
                        control={control}
                        value={value3}
                        // onChange={handleQuestionAnswerChange}
                        {...register("questionThirdOption")}
                      >
                        <FormControlLabel
                          value={"true"}
                          control={<Radio />}
                          label={<FormattedLabel id="yes" />}
                          name="RadioButton"
                          {...register("questionThirdOption")}
                          error={!!errors.questionThirdOption}
                          helperText={
                            errors?.questionThirdOption
                              ? errors.questionThirdOption.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value={"false"}
                          control={<Radio />}
                          label={<FormattedLabel id="no" />}
                          name="RadioButton"
                          {...register("questionThirdOption")}
                          error={!!errors.questionThirdOption}
                          helperText={
                            errors?.questionThirdOption
                              ? errors.questionThirdOption.message
                              : null
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {value3 === "true" && (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="vVyasaycheNav" />}
                        variant="standard"
                        inputProps={{ maxLength: 1000 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        multiline
                        {...register("questionThirdAns")}
                        error={!!errors.questionThirdAns}
                        helperText={
                          errors?.questionThirdAns
                            ? errors.questionThirdAns.message
                            : null
                        }
                      />
                    </Grid>
                  )}
                  {/* Member information box */}

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
                            <FormattedLabel id="memberInfo" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  {/* add more btn */}
                  <Grid container spacing={2}>
                    {!isOpenCollapse && (
                      <Grid
                        item
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          marginTop: "5px",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          // className={commonStyles.buttonSave}
                          startIcon={<AddIcon />}
                          disabled={
                            Number(watch("totalMembersCount")) <=
                              memberUpdate.length || memberUpdate.length >= 20
                          }
                          onClick={() => {
                            setEditButtonInputState(true);
                            setValue("fullName", "");
                            setValue("address", "");
                            setValue("designation", "");
                            setValue("aadharNumber", "");
                            setBtnSaveText("Save");
                            setSlideChecked(true);
                            setIsOpenCollapse(!isOpenCollapse);
                          }}
                        >
                          <FormattedLabel id="addMore" />
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                  {
                    <Slide
                      direction="down"
                      in={slideChecked}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Grid container spacing={2} style={{ padding: "1rem" }}>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <Tooltip title={<FormattedLabel id="memFullName" />}>
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              required
                              label={<FormattedLabel id="memFullName" />}
                              size="small"
                              {...register("fullName")}
                              inputProps={{ maxLength: 500 }}
                              error={!watch("fullName") && showError}
                              helperText={
                                !watch("fullName") && showError ? (
                                  <span
                                    style={{ color: "red", fontSize: "14px" }}
                                  >
                                    {language == "en"
                                      ? "Full name is required"
                                      : "पूर्ण नाव आवश्यक आहे"}
                                  </span>
                                ) : null
                              }
                            />
                          </Tooltip>
                        </Grid>
                        <Grid
                          required
                          item
                          xs={12}
                          sm={12}
                          md={3}
                          lg={3}
                          xl={3}
                        >
                          <Tooltip title={<FormattedLabel id="memFullAdd" />}>
                            <TextField
                              required
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              label={<FormattedLabel id="memFullAdd" />}
                              size="small"
                              {...register(`address`)}
                              inputProps={{ maxLength: 1000 }}
                              error={!watch("address") && showError}
                              helperText={
                                !watch("address") && showError ? (
                                  <span
                                    style={{ color: "red", fontSize: "14px" }}
                                  >
                                    {language == "en"
                                      ? "Address is required"
                                      : "पत्ता आवश्यक आहे"}
                                  </span>
                                ) : null
                              }
                            />
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <Tooltip title={<FormattedLabel id="memDesign" />}>
                            <FormControl
                              error={!watch("designation") && showError}
                              variant="standard"
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="memDesign" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    label="Member Designation"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                  >
                                    {[
                                      { id: 1, department: "President" },
                                      { id: 2, department: "Vice-President" },
                                      { id: 3, department: "Secretary" },
                                      { id: 4, department: "Member" },
                                    ].map((auditorium, index) => (
                                      <MenuItem
                                        key={index}
                                        value={auditorium.department}
                                        disabled={
                                          (field.value === "President" &&
                                            auditorium.department ===
                                              "President") ||
                                          (field.value === "Vice-President" &&
                                            auditorium.department ===
                                              "Vice-President") ||
                                          (auditorium.department ===
                                            "President" &&
                                            memberUpdate.some(
                                              (member) =>
                                                member.designation ===
                                                "President"
                                            )) ||
                                          (auditorium.department ===
                                            "Vice-President" &&
                                            memberUpdate.some(
                                              (member) =>
                                                member.designation ===
                                                "Vice-President"
                                            ))
                                        }
                                      >
                                        {auditorium.department}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                                {...register(`designation`)}
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {!watch("designation") && showError ? (
                                  <span
                                    style={{ color: "red", fontSize: "14px" }}
                                  >
                                    {language == "en"
                                      ? "Designation is required"
                                      : "पदनाम आवश्यक आहे"}
                                  </span>
                                ) : null}
                              </FormHelperText>
                            </FormControl>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <Tooltip title={<FormattedLabel id="memAdharNo" />}>
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              required
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              inputProps={{ maxLength: 12, minLength: 12 }}
                              onInput={(e) => {
                                if (e.target.value.length === 12) {
                                  checkAdhar(e.target.value);
                                }
                              }}
                              label={<FormattedLabel id="memAdharNo" />}
                              size="small"
                              {...register(`aadharNumber`)}
                              error={
                                checkAdharNo ===
                                  "Found But Not Eligible to get registered" ||
                                (!watch("aadharNumber") && showError)
                              }
                              InputProps={{
                                style: {
                                  borderColor:
                                    checkAdharNo ===
                                    "Found But Not Eligible to get registered"
                                      ? "red"
                                      : "inherit",
                                },
                              }}
                              helperText={
                                !watch("aadharNumber") && showError
                                  ? language === "en"
                                    ? "Adhar no is required"
                                    : "आधार क्र. आवश्यक आहे"
                                  : checkAdharNo ===
                                      "Found But Not Eligible to get registered" && (
                                      <span style={{ color: "red" }}>
                                        <FormattedLabel id="aadharErrorMsg" />
                                      </span>
                                    )
                              }
                            />
                          </Tooltip>
                        </Grid>
                        <Grid
                          container
                          spacing={5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            marginTop: "20px",
                          }}
                        >
                          <Grid item>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              // className={commonStyles.buttonExit}
                              endIcon={<ExitToAppIcon />}
                              onClick={() => {
                                setCheckAdharNo(null);
                                setValue("fullName", "");
                                setValue("address", "");
                                setValue("designation", "");
                                setValue("aadharNumber", "");
                                setShowError(false);
                                setSlideChecked(false);
                                setIsOpenCollapse(false);
                                setEditButtonInputState(false);
                              }}
                            >
                              <FormattedLabel id="exit" />
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              // className={commonStyles.buttonSave}
                              endIcon={<ClearIcon />}
                              onClick={() => {
                                setValue("fullName", "");
                                setValue("address", "");
                                setValue("designation", "");
                                setValue("aadharNumber", "");
                              }}
                            >
                              <FormattedLabel id="clear" />
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              // className={commonStyles.buttonSave}
                              onClick={updateMember}
                              endIcon={<SaveIcon />}
                            >
                              {btnSaveText === "Update" ? (
                                <FormattedLabel id="update" />
                              ) : (
                                <FormattedLabel id="save" />
                              )}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Slide>
                  }
                  <DataGrid
                    autoHeight
                    sx={{
                      marginTop: 2,
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
                    rows={memberUpdate}
                    columns={memColumns}
                  />
                  {/* required document box */}

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
                            <FormattedLabel id="requiredDoc" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <>
                    <Grid
                      container
                      style={{ padding: "10px", backgroundColor: "lightblue" }}
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
                        {/* <>
                          <div> */}
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
                        {/* </div>
                        </> */}
                        {/* <Typography
                          sx={{
                            fontWeight: 800,
                            marginLeft: { xs: "5%", md: "20%" },
                            textAlign: { xs: "center", md: "left" },
                          }}
                        >
                          <FormattedLabel id="uploadFile" />
                        </Typography> */}
                      </Grid>
                      <Grid item md={2} lg={2} xl={2}>
                        <Button
                          variant="contained"
                          // className={commonStyles.uploadButton}
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
                      rows={documentUpdate}
                      columns={docColumns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                    />
                  </>

                  {/* save cancel button button */}
                  <Grid container spacing={4} sx={{ padding: "1rem" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: { xs: "1rem", sm: 0 },
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        // className={commonStyles.buttonExit}
                        color="error"
                        endIcon={<ClearIcon />}
                        onClick={() => {
                          router.push("/dashboard");
                        }}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: { xs: "1rem", sm: 0 },
                      }}
                    >
                      <Button
                        sx={{ marginLeft: 2 }}
                        variant="contained"
                        size="small"
                        color="primary"
                        type="submit"
                        name="draft"
                        // className={commonStyles.buttonSave}
                        onClick={() => handleSaveAsDraft("draft")}
                        formNoValidate
                      >
                        <FormattedLabel id="saveAsDraft" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: { xs: "1rem", sm: 0 },
                      }}
                    >
                      <Button
                        disabled={
                          Number(watch("totalMembersCount") < 1) ||
                          Number(watch("totalMembersCount")) !==
                            memberList?.filter((obj) => obj.activeFlag === "Y")
                              .length ||
                          checkAdharNo ===
                            "Found But Not Eligible to get registered" ||
                          docUpload.some((item) => item.documentPath === "")
                            ? true
                            : false
                        }
                        type="submit"
                        size="small"
                        // className={commonStyles.buttonSave}
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="save" />
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider />
                </Grid>
              </form>
            )}

            {/* OLD Bachat Gat Registration Form */}
            {selectedValue === "existing" && (
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container spacing={2} style={{ padding: "1rem" }}>
                  {/* Area Name */}
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
                          required={!isDraft}
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
                                button: language === "en" ? "Ok" : "ठीक आहे",
                                dangerMode: true,
                                closeOnClickOutside: false,
                                allowOutsideClick: false, // Prevent closing on outside click
                                allowEscapeKey: false, // Prevent closing on Esc key
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
                          <FormHelperText>
                            {errors?.areaKey ? errors.areaKey.message : null}
                          </FormHelperText>
                        </FormControl>
                        <Button
                          variant="contained"
                          // className={commonStyles.search}
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
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="zoneNames" />}>
                      <FormControl
                        error={errors.zoneKey}
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zoneNames" />
                          <span style={{ color: "red" }}>*</span>
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
                    </Tooltip>
                  </Grid>

                  {/* Ward name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="wardname" />}>
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.wardKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="wardname" />
                          <span style={{ color: "red" }}>*</span>
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
                    </Tooltip>
                  </Grid>

                  {/* geoCode */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="gisgioCode" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="gisgioCode" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("geoCode") ? true : false,
                        }}
                        {...register("geoCode")}
                      />
                    </Tooltip>
                  </Grid>

                  {/* bachatgat category name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bachatgatCat" />}>
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.categoryKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="bachatgatCat" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              {bachatGatCategory &&
                                bachatGatCategory.map((service, index) => (
                                  <MenuItem key={index} value={service.id}>
                                    {language == "en"
                                      ? service.bachatGatCategoryName
                                      : service.bachatGatCategoryNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="categoryKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.categoryKey
                            ? errors.categoryKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Tooltip>
                  </Grid>

                  {/* bachatgat name */}
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Tooltip title={<FormattedLabel id="bachatgatFullName" />}>
                      <TextField
                        id="standard-basic"
                        required={!isDraft}
                        label={<FormattedLabel id="bachatgatFullName" />}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("bachatgatName") ? true : false,
                        }}
                        {...register("bachatgatName")}
                        error={!!errors.bachatgatName}
                        helperText={
                          errors?.bachatgatName
                            ? errors.bachatgatName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Bachat Gat start date */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bachatgatStartDate" />}>
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.fromDate}
                      >
                        <Controller
                          control={control}
                          name="startDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                variant="standard"
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {<FormattedLabel id="bachatgatStartDate" />}
                                    <span style={{ color: "red" }}>*</span>
                                  </span>
                                }
                                value={field.value}
                               
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    variant="standard"
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.startDate ? errors.startDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Tooltip>
                  </Grid>

                  {/* {/* bachatgat  address box*/}

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
                            <FormattedLabel id="bachatgatAddress" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* president first name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="presidentFirstName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="presidentFirstName" />}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("presidentFirstName") ? true : false,
                        }}
                        {...register("presidentFirstName")}
                        error={!!errors.presidentFirstName}
                        helperText={
                          errors?.presidentFirstName
                            ? errors.presidentFirstName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* president middle name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip
                      title={<FormattedLabel id="presidentFatherName" />}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="presidentFatherName" />}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("presidentMiddleName") ? true : false,
                        }}
                        {...register("presidentMiddleName")}
                        error={!!errors.presidentMiddleName}
                        helperText={
                          errors?.presidentMiddleName
                            ? errors.presidentMiddleName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* president last name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="presidentLastName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="presidentLastName" />}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("presidentLastName") ? true : false,
                        }}
                        {...register("presidentLastName")}
                        error={!!errors.presidentLastName}
                        helperText={
                          errors?.presidentLastName
                            ? errors.presidentLastName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* total members count */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title="Gat Total Members Count">
                      <TextField
                        id="standard-basic"
                        required={!isDraft}
                        label={<FormattedLabel id="totalCount" />}
                        variant="standard"
                        type="number"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        InputLabelProps={{
                          shrink: watch("totalMembersCount") ? true : false,
                        }}
                        {...register("totalMembersCount")}
                        error={!!errors.totalMembersCount}
                        helperText={
                          errors?.totalMembersCount
                            ? errors.totalMembersCount.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* building no */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="flatBuildNo" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="flatBuildNo" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("flatBuldingNo") ? true : false,
                        }}
                        {...register("flatBuldingNo")}
                        error={!!errors.flatBuldingNo}
                        helperText={
                          errors?.flatBuldingNo
                            ? errors.flatBuldingNo.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* building name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="buildingNm" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="buildingNm" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("buildingName") ? true : false,
                        }}
                        {...register("buildingName")}
                        error={!!errors.buildingName}
                        helperText={
                          errors?.buildingName
                            ? errors.buildingName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Road Name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="roadName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="roadName" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("roadName") ? true : false,
                        }}
                        {...register("roadName")}
                        error={!!errors.roadName}
                        helperText={
                          errors?.roadName ? errors.roadName.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Landmark */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="landmark" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="landmark" />}
                        required={!isDraft}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("landmark") ? true : false,
                        }}
                        {...register("landmark")}
                        error={!!errors.landmark}
                        helperText={
                          errors?.landmark ? errors.landmark.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Pin Code */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="pincode" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        inputProps={{ maxLength: 6, minLength: 6 }}
                        label={<FormattedLabel id="pincode" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("pinCode") ? true : false,
                        }}
                        {...register("pinCode")}
                        error={!!errors.pinCode}
                        helperText={
                          errors?.pinCode ? errors.pinCode.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Old Bachat Gat No */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="oldBachatGatNo" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        label={<FormattedLabel id="oldBachatGatNo" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("oldBachatgatNo") ? true : false,
                        }}
                        {...register("oldBachatgatNo")}
                        error={!!errors.oldBachatgatNo}
                        helperText={
                          errors?.oldBachatgatNo
                            ? errors.oldBachatgatNo.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Old Bachat Gat Registration Date */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip
                      title={<FormattedLabel id="oldBachatGatRegiDate" />}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.fromDate}
                      >
                        <Controller
                          control={control}
                          name="oldBachatgatRegDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                variant="standard"
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {
                                      <FormattedLabel id="oldBachatGatRegiDate" />
                                    }
                                    <span style={{ color: "red" }}>*</span>
                                  </span>
                                }
                                value={field.value}
                                maxDate={moment(new Date())}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    variant="standard"
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.oldBachatgatRegDate
                            ? errors.oldBachatgatRegDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Tooltip>
                  </Grid>

                  {/*  Applicant Name Details box*/}

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

                  {loggedUser === "citizenUser" && (
                    <>
                      {/* applicant first name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantFirstName" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
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
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantFirstNameMr" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
                            label={<FormattedLabel id="applicantFirstNameMr" />}
                            variant="standard"
                            {...register("applicantFirstNameMr")}
                            error={!!errors.applicantFirstNameMr}
                            helperText={
                              errors?.applicantFirstNameMr
                                ? errors.applicantFirstNameMr.message
                                : null
                            }
                          />
                        </Tooltip>
                      </Grid>
                      {/* applicant middle name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantMiddleName" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
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
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantMiddleNameMr" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
                            label={
                              <FormattedLabel id="applicantMiddleNameMr" />
                            }
                            variant="standard"
                            {...register("applicantMiddleNameMr")}
                            error={!!errors.applicantMiddleNameMr}
                            helperText={
                              errors?.applicantMiddleNameMr
                                ? errors.applicantMiddleNameMr.message
                                : null
                            }
                          />
                        </Tooltip>
                      </Grid>
                      {/* applicant last name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantLastName" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
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
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Tooltip
                          title={<FormattedLabel id="applicantLastNameMr" />}
                        >
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            disabled={
                              loggedUser === "citizenUser" ? true : false
                            }
                            label={<FormattedLabel id="applicantLastNameMr" />}
                            variant="standard"
                            {...register("applicantLastNameMr")}
                            error={!!errors.applicantLastNameMr}
                            helperText={
                              errors?.applicantLastNameMr
                                ? errors.applicantLastNameMr.message
                                : null
                            }
                          />
                        </Tooltip>
                      </Grid>
                    </>
                  )}

                  {loggedUser === "departmentUser" && (
                    <>
                      {/* applicant first name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantFirstName"}
                          labelName={"applicantFirstName"}
                          fieldName={"applicantFirstName"}
                          updateFieldName={"applicantFirstNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="applicantFirstName" required />
                          }
                          error={!!errors.applicantFirstName}
                          helperText={
                            errors?.applicantFirstName
                              ? errors.applicantFirstName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                      {/* applicant middle name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantMiddleName"}
                          labelName={"applicantMiddleName"}
                          fieldName={"applicantMiddleName"}
                          updateFieldName={"applicantMiddleNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="applicantMiddleName" required />
                          }
                          error={!!errors.applicantMiddleName}
                          helperText={
                            errors?.applicantMiddleName
                              ? errors.applicantMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                      {/* applicant last name */}
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                      <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                        <Transliteration
                          variant={"standard"}
                          _key={"applicantLastNameMr"}
                          labelName={"applicantLastNameMr"}
                          fieldName={"applicantLastNameMr"}
                          updateFieldName={"applicantLastName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={
                            <FormattedLabel id="applicantLastNameMr" required />
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

                  {/* Landline No. */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="landlineNo" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        inputProps={{ maxLength: 12, minLength: 12 }}
                        id="standard-basic"
                        label={<FormattedLabel id="landlineNo" />}
                        variant="standard"
                        {...register("landlineNo")}
                        error={!!errors.landlineNo}
                        helperText={
                          errors?.landlineNo ? errors.landlineNo.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* mobile no */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="mobileNo" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        disabled={loggedUser === "citizenUser" ? true : false}
                        label={<FormattedLabel id="mobileNo" />}
                        variant="standard"
                        {...register("mobileNo")}
                        error={!!errors.mobileNo}
                        helperText={
                          errors?.mobileNo ? errors.mobileNo.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Email Id */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="emailId" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        disabled={loggedUser === "citizenUser" ? true : false}
                        label={<FormattedLabel id="emailId" />}
                        variant="standard"
                        {...register("emailId")}
                        error={!!errors.emailId}
                        helperText={
                          errors?.emailId ? errors.emailId.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Bank details box */}

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

                  {/* Bank name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bankName" />}>
                      <FormControl
                        variant="standard"
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
                          {errors?.bankBranchKey
                            ? errors.bankBranchKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Tooltip>
                  </Grid>

                  {/* Branch Name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="branchName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="branchName" />}
                        variant="standard"
                        inputProps={{ maxLength: 50 }}
                        InputLabelProps={{
                          shrink: watch("branchName") ? true : false,
                        }}
                        {...register("branchName")}
                        error={!!errors.branchName}
                        helperText={
                          errors?.branchName ? errors.branchName.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Saving Account No */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="accountNo" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        inputProps={{ minLength: 6 }}
                        label={<FormattedLabel id="accountNo" />}
                        variant="standard"
                        InputLabelProps={{
                          shrink: watch("accountNo") ? true : false,
                        }}
                        {...register("accountNo")}
                        error={!!errors.accountNo}
                        helperText={
                          errors?.accountNo ? errors.accountNo.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Saving Account Name */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="accountHolderName" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="accountHolderName" />}
                        variant="standard"
                        inputProps={{ maxLength: 500 }}
                        InputLabelProps={{
                          shrink: watch("bankAccountFullName") ? true : false,
                        }}
                        {...register("bankAccountFullName")}
                        error={!!errors.bankAccountFullName}
                        helperText={
                          errors?.bankAccountFullName
                            ? errors.bankAccountFullName.message
                            : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* ifsc code */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bankIFSC" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        required={!isDraft}
                        id="standard-basic"
                        label={<FormattedLabel id="bankIFSC" />}
                        variant="standard"
                        inputProps={{ maxLength: 11, minLength: 11 }}
                        InputLabelProps={{
                          shrink: watch("ifscCode") ? true : false,
                        }}
                        {...register("ifscCode")}
                        error={!!errors.ifscCode}
                        helperText={
                          errors?.ifscCode ? errors.ifscCode.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* Bank MICR Code */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="bankMICR" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="bankMICR" />}
                        variant="standard"
                        inputProps={{ maxLength: 9, minLength: 9 }}
                        {...register("micrCode")}
                        InputLabelProps={{
                          shrink: watch("micrCode") ? true : false,
                        }}
                        error={!!errors.micrCode}
                        helperText={
                          errors?.micrCode ? errors.micrCode.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  {/* PAN Number */}
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Tooltip title={<FormattedLabel id="panNumber" />}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="panNumber" />}
                        variant="standard"
                        inputProps={{ maxLength: 10, minLength: 10 }}
                        {...register("pan_no")}
                        InputLabelProps={{
                          shrink: watch("pan_no") ? true : false,
                        }}
                        error={!!errors.pan_no}
                        helperText={
                          errors?.pan_no ? errors.pan_no.message : null
                        }
                      />
                    </Tooltip>
                  </Grid>

                  <Grid container sx={{ margin: "10px" }}>
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
                    {docUpload &&
                      docUpload?.map((obj, index) => {
                        return (
                          <Grid
                            container
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
                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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

                  {/* Member information box */}
                  {/* <Grid container>
                    <FormControl
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: "29px",
                      }}
                    >
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="question1" />}
                      </FormLabel>
                      <RadioGroup
                        style={{ marginTop: 5 }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        row
                        name="questionFirstOption"
                        control={control}
                        value={value1}
                        // onChange={handleQuestionAnswerChange}
                        {...register("questionFirstOption")}
                      >
                        <FormControlLabel
                          value={"true"}
                          control={<Radio />}
                          label={<FormattedLabel id="yes" />}
                          name="RadioButton"
                          {...register("questionFirstOption")}
                          error={!!errors.questionFirstOption}
                          helperText={
                            errors?.questionFirstOption
                              ? errors.questionFirstOption.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value={"false"}
                          control={<Radio />}
                          label={<FormattedLabel id="no" />}
                          name="RadioButton"
                          {...register("questionFirstOption")}
                          error={!!errors.questionFirstOption}
                          helperText={
                            errors?.questionFirstOption
                              ? errors.questionFirstOption.message
                              : null
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {value1 === "true" && (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="mahilaPrashikshan" />}
                        variant="standard"
                        inputProps={{ maxLength: 5000 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        multiline
                        {...register("questionFirstAns")}
                        error={!!errors.questionFirstAns}
                        helperText={
                          errors?.questionFirstAns
                            ? errors.questionFirstAns.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  <Grid container>
                    <FormControl
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: "29px",
                      }}
                    >
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="question2" />}
                      </FormLabel>
                      <RadioGroup
                        style={{ marginTop: 5 }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        row
                        name="questionSecoundOption"
                        control={control}
                        value={value2}
                        // onChange={handleQuestionAnswerChange}
                        {...register("questionSecoundOption")}
                      >
                        <FormControlLabel
                          value={"true"}
                          control={<Radio />}
                          label={<FormattedLabel id="yes" />}
                          name="RadioButton"
                          {...register("questionSecoundOption")}
                          error={!!errors.questionSecoundOption}
                          helperText={
                            errors?.questionSecoundOption
                              ? errors.questionSecoundOption.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value={"false"}
                          control={<Radio />}
                          label={<FormattedLabel id="no" />}
                          name="RadioButton"
                          {...register("questionSecoundOption")}
                          error={!!errors.questionSecoundOption}
                          helperText={
                            errors?.questionSecoundOption
                              ? errors.questionSecoundOption.message
                              : null
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid> */}

                  {/* 
                  {value2 === "true" && (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="vyavsayacheNav" />}
                        variant="standard"
                        inputProps={{ maxLength: 5000 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        multiline
                        {...register("questionSecoundAns")}
                        error={!!errors.questionSecoundAns}
                        helperText={
                          errors?.questionSecoundAns
                            ? errors.questionSecoundAns.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  <Grid container>
                    <FormControl
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: "29px",
                      }}
                    >
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {<FormattedLabel id="question3" />}
                      </FormLabel>
                      <RadioGroup
                        style={{ marginTop: 5 }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        row
                        name="questionThirdOption"
                        control={control}
                        value={value3}
                        // onChange={handleQuestionAnswerChange}
                        {...register("questionThirdOption")}
                      >
                        <FormControlLabel
                          value={"true"}
                          control={<Radio />}
                          label={<FormattedLabel id="yes" />}
                          name="RadioButton"
                          {...register("questionThirdOption")}
                          error={!!errors.questionThirdOption}
                          helperText={
                            errors?.questionThirdOption
                              ? errors.questionThirdOption.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value={"false"}
                          control={<Radio />}
                          label={<FormattedLabel id="no" />}
                          name="RadioButton"
                          {...register("questionThirdOption")}
                          error={!!errors.questionThirdOption}
                          helperText={
                            errors?.questionThirdOption
                              ? errors.questionThirdOption.message
                              : null
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {value3 === "true" && (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="vVyasaycheNav" />}
                        variant="standard"
                        inputProps={{ maxLength: 5000 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        multiline
                        {...register("questionThirdAns")}
                        error={!!errors.questionThirdAns}
                        helperText={
                          errors?.questionThirdAns
                            ? errors.questionThirdAns.message
                            : null
                        }
                      />
                    </Grid>
                  )} */}
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
                            <FormattedLabel id="memberInfo" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  {/* add more btn */}
                  <Grid container spacing={2}>
                    {!isOpenCollapse && (
                      <Grid
                        item
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          marginTop: "5px",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AddIcon />}
                          // className={commonStyles.buttonSave}
                          disabled={
                            Number(watch("totalMembersCount")) <=
                              memberUpdate.length || memberUpdate.length >= 20
                          }
                          onClick={() => {
                            setEditButtonInputState(true);
                            setValue("fullName", "");
                            setValue("address", "");
                            setValue("designation", "");
                            setValue("aadharNumber", "");
                            setBtnSaveText("Save");
                            setSlideChecked(true);
                            setIsOpenCollapse(!isOpenCollapse);
                          }}
                        >
                          <FormattedLabel id="addMore" />
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                  {
                    <Slide
                      direction="down"
                      in={slideChecked}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Grid container spacing={2} style={{ padding: "1rem" }}>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            required
                            label={<FormattedLabel id="memFullName" />}
                            size="small"
                            {...register("fullName")}
                            error={!watch("fullName") && showError}
                            helperText={
                              !watch("fullName") && showError ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  {language == "en"
                                    ? "Full name is required"
                                    : "पूर्ण नाव आवश्यक आहे"}
                                </span>
                              ) : null
                            }
                          />
                        </Grid>
                        <Grid
                          required
                          item
                          xs={12}
                          sm={12}
                          md={3}
                          lg={3}
                          xl={3}
                        >
                          <TextField
                            required
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            label={<FormattedLabel id="memFullAdd" />}
                            size="small"
                            {...register(`address`)}
                            error={!watch("address") && showError}
                            helperText={
                              !watch("address") && showError ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  {language == "en"
                                    ? "Address is required"
                                    : "पत्ता आवश्यक आहे"}
                                </span>
                              ) : null
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <FormControl
                            error={!watch("designation") && showError}
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="memDesign" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  label="Member Designation"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                >
                                  {[
                                    { id: 1, department: "President" },
                                    { id: 2, department: "Vice-President" },
                                    { id: 3, department: "Secretary" },
                                    { id: 4, department: "Member" },
                                  ].map((auditorium, index) => (
                                    <MenuItem
                                      key={index}
                                      value={auditorium.department}
                                      disabled={
                                        (field.value === "President" &&
                                          auditorium.department ===
                                            "President") ||
                                        (field.value === "Vice-President" &&
                                          auditorium.department ===
                                            "Vice-President") ||
                                        (auditorium.department ===
                                          "President" &&
                                          memberUpdate.some(
                                            (member) =>
                                              member.designation === "President"
                                          )) ||
                                        (auditorium.department ===
                                          "Vice-President" &&
                                          memberUpdate.some(
                                            (member) =>
                                              member.designation ===
                                              "Vice-President"
                                          ))
                                      }
                                    >
                                      {auditorium.department}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                              {...register(`designation`)}
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {!watch("designation") && showError ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  {language == "en"
                                    ? "Designation is required"
                                    : "पदनाम आवश्यक आहे"}
                                </span>
                              ) : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            required
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            inputProps={{ maxLength: 12, minLength: 12 }}
                            onInput={(e) => {
                              if (e.target.value.length === 12) {
                                checkAdhar(e.target.value);
                              }
                            }}
                            label={<FormattedLabel id="memAdharNo" />}
                            size="small"
                            {...register(`aadharNumber`)}
                            error={
                              checkAdharNo ===
                                "Found But Not Eligible to get registered" ||
                              (!watch("aadharNumber") && showError)
                            }
                            InputProps={{
                              style: {
                                borderColor:
                                  checkAdharNo ===
                                  "Found But Not Eligible to get registered"
                                    ? "red"
                                    : "inherit",
                              },
                            }}
                            helperText={
                              !watch("aadharNumber") && showError
                                ? language === "en"
                                  ? "Adhar no is required"
                                  : "आधार क्र. आवश्यक आहे"
                                : checkAdharNo ===
                                    "Found But Not Eligible to get registered" && (
                                    <span style={{ color: "red" }}>
                                      <FormattedLabel id="aadharErrorMsg" />
                                    </span>
                                  )
                            }
                          />
                        </Grid>
                        <Grid
                          container
                          spacing={5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            marginTop: "20px",
                          }}
                        >
                          <Grid item>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              // className={commonStyles.buttonExit}
                              endIcon={<ExitToAppIcon />}
                              onClick={() => {
                                setValue("fullName", "");
                                setValue("address", "");
                                setValue("designation", "");
                                setValue("aadharNumber", "");
                                setSlideChecked(false);
                                setSlideChecked(false);
                                setIsOpenCollapse(false);
                                setEditButtonInputState(false);
                              }}
                            >
                              <FormattedLabel id="exit" />
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              // className={commonStyles.buttonExit}
                              endIcon={<ClearIcon />}
                              onClick={() => {
                                setValue("fullName", "");
                                setValue("address", "");
                                setValue("designation", "");
                                setValue("aadharNumber", "");
                              }}
                            >
                              <FormattedLabel id="clear" />
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              // className={commonStyles.buttonSave}
                              onClick={updateMember}
                              endIcon={<SaveIcon />}
                            >
                              {btnSaveText === "Update" ? (
                                <FormattedLabel id="update" />
                              ) : (
                                <FormattedLabel id="save" />
                              )}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Slide>
                  }
                  <DataGrid
                    autoHeight
                    sx={{
                      marginTop: 2,
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
                    rows={memberUpdate}
                    columns={memColumns}
                  />
                  {/* required document box */}

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
                            <FormattedLabel id="requiredDoc" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <>
                    <Grid
                      container
                      style={{ padding: "10px", backgroundColor: "lightblue" }}
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
                        {/* <>
                          <div> */}
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
                        {/* </div>
                        </> */}
                        {/* <Typography
                          sx={{
                            fontWeight: 800,
                            marginLeft: { xs: "5%", md: "20%" },
                            textAlign: { xs: "center", md: "left" },
                          }}
                        >
                          <FormattedLabel id="uploadFile" />
                        </Typography> */}
                      </Grid>
                      {/* <Grid
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
                      </Grid> */}
                      <Grid item md={2} lg={2} xl={2}>
                        <Button
                          variant="contained"
                          endIcon={<Add />}
                          type="button"
                          color="primary"
                          // className={commonStyles.buttonSave}
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
                      rows={documentUpdate}
                      columns={docColumns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                    />
                  </>

                  {/* save cancel button button */}
                  <Grid container spacing={4} sx={{ padding: "1rem" }}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: { xs: "1rem", sm: 0 },
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        // className={commonStyles.buttonExit}
                        endIcon={<ClearIcon />}
                        onClick={() => {
                          router.push("/dashboard");
                        }}
                      >
                        <FormattedLabel id="back" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: { xs: "1rem", sm: 0 },
                      }}
                    >
                      <Button
                        sx={{ marginLeft: 2 }}
                        variant="contained"
                        size="small"
                        color="primary"
                        // className={commonStyles.buttonSave}
                        type="submit"
                        name="draft"
                        onClick={() => handleSaveAsDraft("draft")}
                        formNoValidate
                      >
                        <FormattedLabel id="saveAsDraft" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: { xs: "1rem", sm: 0 },
                      }}
                    >
                      <Button
                        disabled={
                          Number(watch("totalMembersCount")) !==
                            memberList?.filter((obj) => obj.activeFlag === "Y")
                              .length ||
                          checkAdharNo ===
                            "Found But Not Eligible to get registered" ||
                          docUpload.some((item) => item.documentPath === "")
                            ? true
                            : false
                        }
                        type="submit"
                        size="small"
                        // className={commonStyles.buttonSave}
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="save" />
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider />
                </Grid>
              </form>
            )}
          </FormProvider>
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
                appName={"BSUP"}
                serviceName={"BSUP-BachatgatRegistration"}
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
                // className={commonStyles.buttonExit}
                onClick={() => {
                  handleCancel(false);
                }}
                size="small"
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

export default BachatGatCategory;
