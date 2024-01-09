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
  Checkbox,
  Typography,
  Modal,
  Slide,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { useReactToPrint } from "react-to-print";
import React, { useEffect, useState, useRef } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  FormProvider,
} from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import theme from "../../../../theme";
import axios from "axios";
import styles from "../acknowledgement.module.css";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import bachatgatRegistration from "../../../../containers/schema/BsupNagarvasthiSchema/bachatgatRegistration";
import { yupResolver } from "@hookform/resolvers/yup";
import { EncryptData,DecryptData } from "../../../../components/common/EncryptDecrypt";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";

import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const BachatGatCategory = (props) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    methods,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bachatgatRegistration),
    defaultValues: {
      trnBachatgatRegistrationMembersList: [
        { fullName: "", designation: "", address: "", aadharNumber: "" },
      ],
    },
  });

  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [statusVal, setStatusVal] = useState(null);
  const [remarkTableData, setRemarkData] = useState([]);
  const [memberList, setMemberData] = useState([]);
  // const authority = user?.menus?.find((r) => {
  //   return r.id == selectedMenuFromDrawer;
  // })?.roles;
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const language = useSelector((state) => state.labels.language);
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  localStorage.removeItem("bsupDocuments");
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "trnBachatgatRegistrationMembersList",
      control,
    }
  );

  const [appliNo, setApplicationNo] = useState();
  const [currentStatus1, setCurrentStatus] = useState();
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [bachatGatCategory, setBachatGatCategory] = useState([]);
  const [registrationDetails, setRegistrationDetails] = useState([]);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const loggedUser = localStorage.getItem("loggedInUser");
  // Enable Disable approve reject revert button
  const [samuhaSanghatakRemark, setSamuhaSanghatakRemark] = useState("");
  const [deptClerkRemark, setDeptClerkRemark] = useState("");
  const [asstCommissionerRemark, setAsstCommissionerRemark] = useState("");
  const [deptyCommissionerRemark, setDeptyCommissionerRemark] = useState("");
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);
  const [existingBachatGat, setExistingBachatGat] = useState(false);
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

  const [value1, setValue1] = useState("false");
  const [value2, setValue2] = useState("false");
  const [value3, setValue3] = useState("false");



  useEffect(() => {
    setValue1(watch("questionFirstOption"));
  }, [watch("questionFirstOption")]);
  useEffect(() => {
    setValue2(watch("questionSecoundOption"));
  }, [watch("questionSecoundOption")]);
  useEffect(() => {
    setValue3(watch("questionThirdOption"));
  }, [watch("questionThirdOption")]);


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
    setIsRemarksFilled(
      samuhaSanghatakRemark ||
        deptClerkRemark ||
        asstCommissionerRemark ||
        deptyCommissionerRemark
    );
  }, [
    samuhaSanghatakRemark,
    deptClerkRemark,
    asstCommissionerRemark,
    deptyCommissionerRemark,
  ]);

  // fetch bachatgat regsitration details by id
  useEffect(() => {
    setDataOnForm(props.data);
    setRegistrationDetails(props.data);
  }, [props && bankMaster]);

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
    getBachatGatCategory();
    getBank();
    getUser();
  }, []);

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

  // load zone
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

  // load wards
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

  // load bank
  const getBank = () => {
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

  // load bachatgat category
  const getBachatGatCategory = () => {
    loggedUser === "citizenUser"
      ? axios
          .get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`, {
            headers: headers,
          })
          .then((r) => {
            setBachatGatCategory(
              r.data.mstBachatGatCategoryList.map((row) => ({
                id: row.id,
                bachatGatCategoryName: row.bgCategoryName,
                bachatGatCategoryNameMr: row.bgCategoryMr,
              }))
            );
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, false);
          })
      : axios
          .get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`, {
            headers: headers,
          })
          .then((r) => {
            setBachatGatCategory(
              r.data.mstBachatGatCategoryList.map((row) => ({
                id: row.id,
                bachatGatCategoryName: row.bgCategoryName,
                bachatGatCategoryNameMr: row.bgCategoryMr,
              }))
            );
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, false);
          });
  };

  const backButton = () => {
    router.push({
      pathname: "/BsupNagarvasthi/transaction/bachatgatRegistration",
    });
  };

  const setDataOnForm = (data) => {
    setApplicationNo(data.applicationNo);
    setValue("bachatgatNo", data.bachatgatNo);
    setValue("oldBachatgatNo", data.oldBachatgatNo);
    setValue("oldBachatgatRegDate", data.oldBachatgatRegDate);
    setValue("areaKey", data.areaKey);
    setExistingBachatGat(data.existingBachatgat)
    setValue("zoneKey", data.zoneKey);
    setValue("wardKey", data.wardKey);
    setValue("geoCode", data.geoCode);
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
    setStatusVal(data.status);
    setValue(
      "bankNameId",
      language == "en"
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
          ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
          : "-"
        : bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
        : "-"
    );
    setValue(
      "bankBranchKey",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        : "-"
    );
    setValue(
      "bankIFSC",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
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
    setValue("bankMICR", data.micrCode);
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
    setCurrentStatus(
      data.status === null
        ? "pending"
        : "" || data.status === 0
        ? "Save As Draft"
        : "" || data.status === 1
        ? "Send Back To Citizen For Approval"
        : "" || data.status === 2
        ? "Send to Samuha Sanghatak For Approval"
        : "" || data.status === 3
        ? "Send To Dept. Clerk For Approval"
        : "" || data.status === 4
        ? "Send Back To Dept. Clerk(Reverted)"
        : "" || data.status === 5
        ? "Send To Asst. Commissioner For Approval"
        : "" || data.status === 6
        ? "Send Back To Asst. Commissioner(Reverted)"
        : "" || data.status === 7
        ? "Send To Dy. Commissioner For Approval"
        : "" || data.status === 8
        ? "Send Back To Dy. Commissioner(Reverted)"
        : "" || data.status === 16
        ? "Send Back To Dept Clerk After Approval Dy Commissioner"
        : "" || data.status === 10
        ? "Complete"
        : "" || data.status === 11
        ? "Close"
        : "" || data.status === 12
        ? "Duplicate"
        : "" || data.status === 22
        ? "Rejected"
        : "" || data.status === 23
        ? "Send Back to Samuh Sanghtak"
        : "" || data.status === 17
        ? "Modification In Progress "
        : "" || data.status === 18
        ? "Modified"
        : "" || data.status === 19
        ? "Renewal In Progress "
        : "" || data.status === 21
        ? "Cancellation In Progress "
        : "" || data.status === 9
        ? "Send To Accountant"
        : "" || data.status === 20
        ? "Renewed"
        : "" || data.status === 15
        ? "Cancelled"
        : "" || data.status === 13
        ? "Cancellation Initiated"
        : "" || data.status === 14
        ? "Notice sent"
        : "Invalid"
    );

    let res = data.trnBachatgatRegistrationMembersList.map((r, i) => {
      return {
        id: i + 1,
        fullName: r.fullName,
        address: r.address,
        designation: r.designation,
        aadharNumber: r.aadharNumber,
      };
    });
    setMemberData([...res]);
    const bankDoc = [];

    let _res = data.trnBachatgatRegistrationDocumentsList.map((r, i) => {
      bankDoc.push({
        id: i + 1,
        title: language == "en" ? "Other" : "इतर",
        filenm:
          r.documentPath &&DecryptData("passphraseaaaaaaaaupload", r.documentPath).split("/").pop().split("_").pop(),
        documentType: r.documentType,
        documentPath: r.documentPath,
      });
    });

    if (data.passbookFrontPage && data.passbookLastPage) {
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 1,
        title: "Passbook Front Page",
        documentType: "r.documentType",
        documentPath: data.passbookFrontPage,
        filenm:
          data.passbookFrontPage &&
          DecryptData("passphraseaaaaaaaaupload",data.passbookFrontPage).split("/").pop().split("_").pop(),
      });
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 2,
        title: "Passbook Back Page",
        documentType: "r.documentType",
        documentPath: data.passbookLastPage,
        filenm:
          data.passbookLastPage &&
          DecryptData("passphraseaaaaaaaaupload",data.passbookLastPage).split("/").pop().split("_").pop(),
      });
    } else if (data.passbookLastPage) {
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 3,
        title: "Passbook Back Page",
        documentType: "r.documentType",
        documentPath: data.passbookLastPage,
        filenm:
          data.passbookLastPage &&
          DecryptData("passphraseaaaaaaaaupload", data.passbookLastPage).split("/").pop().split("_").pop(),
      });
    } else if (data.passbookFrontPage) {
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 4,
        title: "Passbook Front Page",
        documentPath: data.passbookFrontPage,
        filenm:
          data.passbookFrontPage &&
          DecryptData("passphraseaaaaaaaaupload",data.passbookFrontPage).split("/").pop().split("_").pop(),
      });
    }
    setFetchDocuments([...bankDoc]);
  };

  // set remark table details
  useEffect(() => {
    setDataToTable();
  }, [registrationDetails, userLst]);

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
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.asstCommissionerRemark
              : registrationDetails.deptyCommissionerRemark,
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
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(registrationDetails.deptyCommissionerDate).format(
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
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.asstCommissionerRemark
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
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(registrationDetails.asstCommissionerDate).format(
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
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.deptyCommissionerRemark
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
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(registrationDetails.deptyCommissionerDate).format(
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
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : "",
          designation:
            i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
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
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Samuh Sanghtak" : i == 1 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptyCommissionerDate).format(
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
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.saSanghatakRemark : "",
          designation: i == 0 ? "Samuh Sanghtak" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
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
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.asstCommissionerRemark
              : i == 2
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Department Clerk"
              : i == 1
              ? "Assistant Commissioner"
              : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(registrationDetails.deptyCommissionerDate).format(
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
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.asstCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Department Clerk"
              : i == 1
              ? "Assistant Commissioner"
              : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.asstCommissionerDate).format(
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
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Department Clerk" : i == 1 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptyCommissionerDate).format(
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
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.deptClerkRemark : "",
          designation: i == 0 ? "Department Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
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
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.asstCommissionerRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Assistant Commissioner" : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(registrationDetails.deptyCommissionerDate).format(
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
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.asstCommissionerRemark : "",
          designation: i == 0 ? "Assistant Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.asstCommissionerDate).format(
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
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.deptyCommissionerRemark : "",
          designation: i == 0 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    setRemarkData([...a]);
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
      field: "title",
      headerName: <FormattedLabel id="docName" />,
      headerAlign: "center",
      minWidth: 100,
      align: "left",
      flex: 1,
    },
    {
      field: "filenm",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      minWidth: 100,
      align: "left",
      flex: 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="view" />,
      headerAlign: "center",
      minWidth: 100,
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

  // member columns
  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: <FormattedLabel id="memFullName" />,
      flex: 1,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: <FormattedLabel id="memFullAdd" />,
      flex: 1,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="memDesign" />,
      flex: 1,
      align: "center",
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
  ];

  // remark columns
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

  // UI
  return (
    <ThemeProvider theme={theme}>
      <>{/* <BreadcrumbComponent /> */}</>
      <Paper elevation={10} style={{padding:'10px'}}>
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
                <FormattedLabel id="bachatGatDetails" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <form>
          <Grid container spacing={2} style={{ padding: "1rem" }}>
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
              md={12}
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

            {/* area name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                error={errors.areaKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="areaNm" />
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
                    >
                      {crAreaNames &&
                        crAreaNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language == "en"
                              ? auditorium.crAreaName
                              : auditorium.crAreaNameMr}
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                error={errors.zoneKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zoneNames" />
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
                            {language == "en"
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
            </Grid>

            {/* Ward name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                error={!!errors.wardKey}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="wardname" />
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
                            {language == "en"
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
            </Grid>

            {/* geo code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="gisgioCode" />}
                variant="standard"
                {...register("geoCode")}
                error={!!errors.geoCode}
                helperText={errors?.geoCode ? errors.geoCode.message : null}
              />
            </Grid>

            {/* bachatgat name */}
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="bachatgatFullName" />}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                variant="standard"
                {...register("bachatgatName")}
                error={!!errors.bachatgatName}
                helperText={
                  errors?.bachatgatName ? errors.bachatgatName.message : null
                }
              />
            </Grid>

            {/* bachatgat category */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                      disabled={true}
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
                  {errors?.categoryKey ? errors.categoryKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Bachat Gat start date */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                        disabled={true}
                        variant="standard"
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            {<FormattedLabel id="bachatgatStartDate" />}
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
                            {...params}
                            size="small"
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
            </Grid>
          </Grid>

          {/* bachatgat address box */}
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
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            {/* president first name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="presidentFirstName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("presidentFirstName")}
                error={!!errors.presidentFirstName}
                helperText={
                  errors?.presidentFirstName
                    ? errors.presidentFirstName.message
                    : null
                }
              />
            </Grid>
            {/* bahcatgat middle name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="presidentFatherName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("presidentMiddleName")}
                error={!!errors.presidentMiddleName}
                helperText={
                  errors?.presidentMiddleName
                    ? errors.presidentMiddleName.message
                    : null
                }
              />
            </Grid>
            {/* bahcatgat last name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="presidentLastName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("presidentLastName")}
                error={!!errors.presidentLastName}
                helperText={
                  errors?.presidentLastName
                    ? errors.presidentLastName.message
                    : null
                }
              />
            </Grid>
            {/* total member */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <Tooltip title="Gat Total Members Count">
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="totalCount" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="flatBuildNo" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("flatBuldingNo")}
                error={!!errors.flatBuldingNo}
                helperText={
                  errors?.flatBuldingNo ? errors.flatBuldingNo.message : null
                }
              />
            </Grid>
            {/* building name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="roadName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("roadName")}
                error={!!errors.roadName}
                helperText={errors?.roadName ? errors.roadName.message : null}
              />
            </Grid>

            {/* Landmark */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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

            {/* Pin Code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="pincode" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("pinCode")}
                error={!!errors.pinCode}
                helperText={errors?.pinCode ? errors.pinCode.message : null}
              />
            </Grid>
            
          {existingBachatGat === true && (
                <>
                  {/* Old Bachat Gat No */}
                  <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      id="standard-basic"
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      // inputProps={{ maxLength: 6, minLength: 6 }}
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
                  </Grid>

                  {/* Old Bachat Gat Registration Date */}
                  <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
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
                              disabled={true}
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="oldBachatGatRegiDate" />}
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
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
                  </Grid>
                </>
                 )} 
          </Grid>

          {/*   Applicant Name Details*/}
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
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            {/* applicant first name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantFirstName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("applicantFirstName")}
                error={!!errors.applicantFirstName}
                helperText={
                  errors?.applicantFirstName
                    ? errors.applicantFirstName.message
                    : null
                }
              />
            </Grid>

            {/* applicant middle name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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

            {/* applicant last name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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

            {/* Landline No. */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="landlineNo" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("landlineNo")}
                error={!!errors.landlineNo}
                helperText={
                  errors?.landlineNo ? errors.landlineNo.message : null
                }
              />
            </Grid>

            {/* mobile no */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="mobileNo" />}
                variant="standard"
                {...register("mobileNo")}
                error={!!errors.mobileNo}
                helperText={errors?.mobileNo ? errors.mobileNo.message : null}
              />
            </Grid>

            {/* Email Id */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="emailId" />}
                variant="standard"
                {...register("emailId")}
                error={!!errors.emailId}
                helperText={errors?.emailId ? errors.emailId.message : null}
              />
            </Grid>
          </Grid>
          {/* bank details box */}
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
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            {/* bank name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="branchName" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("branchName")}
                error={!!errors.branchName}
                helperText={
                  errors?.branchName ? errors.branchName.message : null
                }
              />
            </Grid>

            {/* Saving Account No */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="accountNo" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("accountNo")}
                error={!!errors.accountNo}
                helperText={errors?.accountNo ? errors.accountNo.message : null}
              />
            </Grid>

            {/* Saving Account Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="accountHolderName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("bankAccountFullName")}
                error={!!errors.bankAccountFullName}
                helperText={
                  errors?.bankAccountFullName
                    ? errors.bankAccountFullName.message
                    : null
                }
              />
            </Grid>

            {/* ifsc code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankIFSC" />}
                variant="standard"
                {...register("ifscCode")}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                error={!!errors.ifscCode}
                helperText={errors?.ifscCode ? errors.ifscCode.message : null}
              />
            </Grid>

            {/* Bank MICR Code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankMICR" />}
                variant="standard"
                {...register("bankMICR")}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                error={!!errors.bankMICR}
                helperText={errors?.bankMICR ? errors.bankMICR.message : null}
              />
            </Grid>
            {/* PAN Number */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="panNumber" />}
                variant="standard"
                inputProps={{ maxLength: 10, minLength: 10 }}
                disabled={true}
                {...register("pan_no")}
                InputLabelProps={{
                  shrink: watch("pan_no") ? true : false,
                }}
                error={!!errors.pan_no}
                helperText={errors?.pan_no ? errors.pan_no.message : null}
              />
            </Grid>
          </Grid>

    {existingBachatGat===false&&   <div style={{padding:'1rem'}}>  
     <Grid container >
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
                  disabled
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
                  disabled
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
                disabled
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

          <Grid container >
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
                  disabled
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
                  disabled
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
                disabled
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
                  disabled
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
                  disabled
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
                disabled
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
          )}
          </div>}
          {/* member info box */}
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
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            {/* members show in table */}
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
              rows={memberList}
              columns={columns}
            />
          </Grid>
          {/* Required documents */}
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
                  <FormattedLabel id="requiredDoc" />
                </h3>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            {/* document columns */}
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
            <Divider />
          </Grid>

          {/* Approval section */}
          <Grid container sx={{ padding: "10px" }}></Grid>
          {((loggedUser != "citizenUser" && loggedUser != "cfcUser") ||
            ((loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
              (statusVal === 1 || statusVal === 23 || statusVal === 22) &&
              remarkTableData.length != 0)) && (
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
          )}

          {/* samuh sanghtak remark show only citizen when status is reverted */}
          {(loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
            (statusVal === 22 || statusVal === 1) && (
              <>
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

          {/* remark table */}
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
        </form>
        {(loggedUser === "citizenUser" || loggedUser === "cfcUser") && (
          <div className={styles.btn}>
            <Button
              variant="contained"
              className={commonStyles.buttonPrint}
              type="primary"
              onClick={handlePrint}
            >
              <FormattedLabel id="print" />
            </Button>
            <Button
              type="primary"
              variant="contained"
              className={commonStyles.buttonExit}
              color="error"
              onClick={() => {
                router.push("/BsupNagarvasthi/transaction/helpDesk");
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </div>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategory;
