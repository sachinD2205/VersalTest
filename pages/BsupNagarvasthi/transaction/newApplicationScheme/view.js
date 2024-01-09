import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Checkbox,
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
import React, { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import trnNewApplicationSchema from "../../../../containers/schema/BsupNagarvasthiSchema/trnNewApplicationSchema.js";
import divyangData from "../divyang.json";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import Loader from "../../../../containers/Layout/components/Loader";
import bsupUserRoles from "../../../../components/bsupNagarVasthi/userRolesBSUP";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { GridToolbar } from "@mui/x-data-grid";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
import { EncryptData,DecryptData } from "../../../../components/common/EncryptDecrypt/index.js";

const BachatGatCategorySchemes = () => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(trnNewApplicationSchema),
    mode: "onChange",
  });
  const componentRef = useRef(null);
  const language = useSelector((state) => state.labels.language);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [appliNo, setApplicationNo] = useState();
  const [currentStatus1, setCurrentStatus] = useState();
  const [statusAll, setStatus] = useState(null);
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
  const [statusVal, setStatusVal] = useState(null);
  const [eligiblityData, setEligiblityCriteriaData] = useState([]);
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [genderDetails, setGenderDetails] = useState([]);
  const [eligiblityDocuments, setEligiblityDocuments] = useState([]);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [newSchemeDetails, setNewSchemeDetails] = useState(null);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const [userLst, setUserLst] = useState([]);
  const [remarkTableData, setRemarkData] = useState([]);
  const [accPaymentTableData, setAccPaymentData] = useState([]);
  const [subSchemeVal, setSubScheme] = useState();
  const [mainSchemeVal, setMainScheme] = useState();
  const [bankDoc, setBankDoc] = useState([]);

  const [isApproveChecked, setIsApproveChecked] = useState(false);
  const [isRevertChecked, setIsRevertChecked] = useState(false);
  const [isRejectChecked, setIsRejectChecked] = useState(false);
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);

  const [samuhaSanghatakRemark, setSamuhaSanghatakRemark] = useState("");
  const [deptClerkRemark, setDeptClerkRemark] = useState("");
  const [asstCommissionerRemark, setAsstCommissionerRemark] = useState("");
  const [deptyCommissionerRemark, setDeptyCommissionerRemark] = useState("");

  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [bachatgatrejectionCategories, setBachatgatrejectionCategories] =
    useState([]);

  const [hanadleStudent, setHanadleStudent] = useState([]);
  const [serviceId, setServiceId] = useState([]);
  const [rejectReason, setRejectReason] = useState();
  const [castOptions, setCastOptions] = useState([]);
  const [remAmount, setRemAmount] = useState();
  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

  const headers = { Authorization: `Bearer ${user?.token}` };
  const [bachatgatApprovalCategories, setBachatgatApprovalCategories] =
    useState([]);
  const [bachatgatRevertCategories, setBachatgatRevertCategories] = useState(
    []
  );
  const [forBachatGat, setForBachatgat] = useState(true);

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

  const onPrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
    getCastDetails();
    getBankMasters();
    getGenders();
    getReligionDetails();
    getUser();
    getRejectCategories();
  }, []);

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

  useEffect(() => {
    if (isRejectChecked) {
      setRejectReason(hanadleStudent.toString());
    }
  }, [hanadleStudent]);

  // useEffect(() => {
  //   setRejectReason(hanadleStudent.toString());
  // }, [hanadleStudent]);

  useEffect(() => {
    if (isApproveChecked === true) {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "1")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    } else if (isRevertChecked === true) {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "2")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    } else if (isRejectChecked === true) {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "3")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    }
  }, [isApproveChecked, isRevertChecked, isRejectChecked]);

  const handleChange = (event, studentId, fieldName) => {
    switch (fieldName) {
      case "saSanghatakRemark":
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setSamuhaSanghatakRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            let string = bachatgatRevertCategories.map(
              (student) => student.rejectCat
            );
            setValue(
              "saSanghatakRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setSamuhaSanghatakRemark("");
            setValue("saSanghatakRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setSamuhaSanghatakRemark(...hanadleStudent, dummy);
            setValue("saSanghatakRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setSamuhaSanghatakRemark(
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
            setValue(
              "saSanghatakRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      case "deptClerkRemark":
        // setDeptClerkRemark(studentId);
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setDeptClerkRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setValue(
              "deptClerkRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setDeptClerkRemark("");
            setValue("deptClerkRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setDeptClerkRemark([...hanadleStudent, dummy]);
            setValue("deptClerkRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setDeptClerkRemark(hanadleStudent?.filter((obj) => obj !== dummy));
            setValue(
              "deptClerkRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      case "asstCommissionerRemark":
        // setAsstCommissionerRemark(studentId);
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setAsstCommissionerRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setValue(
              "asstCommissionerRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setAsstCommissionerRemark("");
            setValue("asstCommissionerRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setAsstCommissionerRemark([...hanadleStudent, dummy]);
            setValue("asstCommissionerRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setAsstCommissionerRemark(
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
            setValue(
              "asstCommissionerRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      case "deptyCommissionerRemark":
        // setDeptyCommissionerRemark(studentId);
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setDeptyCommissionerRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setValue(
              "deptyCommissionerRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setDeptyCommissionerRemark("");
            setValue("deptyCommissionerRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setDeptyCommissionerRemark([...hanadleStudent, dummy]);
            setValue("deptyCommissionerRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setDeptyCommissionerRemark(
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
            setValue(
              "deptyCommissionerRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      default:
        break;
    }

    // if (studentId === "all") {
    //   if (event.target.checked) {
    //     setServiceId(bachatgatRevertCategories.map((student) => student.id));
    //     setHanadleStudent(
    //       bachatgatRevertCategories.map((student) => student.rejectCat)
    //     );
    //   } else {
    //     setServiceId([]);
    //     setHanadleStudent([]);
    //   }
    // } else {
    //   if (event.target.checked) {
    //     let dummy = bachatgatRevertCategories.find(
    //       (obj) => obj.id === studentId
    //     )?.rejectCat;
    //     setServiceId([...serviceId, studentId]);
    //     setHanadleStudent([...hanadleStudent, dummy]);
    //   } else {
    //     setServiceId(serviceId?.filter((obj) => obj !== studentId));
    //     setHanadleStudent(hanadleStudent?.filter((obj) => obj !== studentId));
    //   }
    // }
  };

  // const handleChange = (event, studentId) => {
  //   if (studentId === "all") {
  //     if (event.target.checked) {
  //       setServiceId(bachatgatrejectionCategories.map((student) => student.id));
  //       setHanadleStudent(
  //         bachatgatrejectionCategories.map((student) => student.rejectCat)
  //       );
  //     } else {
  //       setServiceId([]);
  //       setHanadleStudent([]);
  //     }
  //   } else {
  //     if (event.target.checked) {
  //       let dummy = bachatgatrejectionCategories.find(
  //         (obj) => obj.id === studentId
  //       )?.rejectCat;
  //       setServiceId([...serviceId, studentId]);
  //       setHanadleStudent([...hanadleStudent, dummy]);
  //     } else {
  //       setServiceId(serviceId?.filter((obj) => obj !== studentId));
  //       setHanadleStudent(hanadleStudent?.filter((obj) => obj !== studentId));
  //     }
  //   }
  // };

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      getBachatGatCategoryNewScheme();
  }, [zoneNames && crAreaNames && wardNames && mainNames, router.query.id]);

  useEffect(() => {
    if (newSchemeDetails != null) {
      setBachatGatCategoryNewSchemes();
    }
  }, [newSchemeDetails, language]);

  useEffect(() => {
    getAllStatus();
    getMainScheme();
    getSubScheme();
  }, []);

  useEffect(() => {
    getDependency();
  }, [mainSchemeVal]);

  // Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // Update checkbox state
    setIsApproveChecked(name === "approve" && checked);
    setIsRevertChecked(name === "revert" && checked);
    setIsRejectChecked(name === "reject" && checked);
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

  const handleRemarkChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    switch (fieldName) {
      case "saSanghatakRemark":
        setSamuhaSanghatakRemark(fieldValue);
        break;
      case "deptClerkRemark":
        setDeptClerkRemark(fieldValue);
        break;
      case "asstCommissionerRemark":
        setAsstCommissionerRemark(fieldValue);
        break;
      case "deptyCommissionerRemark":
        setDeptyCommissionerRemark(fieldValue);
        break;
      default:
        break;
    }
  };
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

  const backButton = () => {
    if (loggedUser === "citizenUser" || loggedUser === "cfcUser") {
      router.push({
        pathname: "/dashboard",
      });
    } else {
      router.push({
        pathname: "/BsupNagarvasthi/transaction/newApplicationScheme/list",
      });
    }
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
      align: "left",
      // flex: 1,
      width: 500,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "15px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "filenm",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "left",
      // flex: 1,
      width: 500,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "15px" }}>
          {params.value}
        </div>
      ),
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
      // flex: 1,
      width: 100,
    },
    {
      field: "informationTitle",
      headerName: <FormattedLabel id="infoTitle" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
      // width: 900,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "fileName",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "left",
      // width: 500,
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },

    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      flex: 1,
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
      // flex: 1,
      width: 100,
    },
    {
      field: "infoTitle",
      headerName: <FormattedLabel id="infoTitle" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
      // width: 700,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "infoDetails",
      headerName: <FormattedLabel id="answer" />,
      headerAlign: "center",
      align: "left",
      // width: 500,
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
      // flex: 1,
    },
  ];

  const onCancel = () => {};

  // cast from cast category
  const getCastFromCastCategoory = () => {
    axios
      .get(
        `${urls.BSUPURL}/master/cast/getCastFromCastCategories?id=${watch(
          "casteCategory"
        )}`,
        { headers: headers }
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

  useEffect(() => {
    if (watch("casteCategory")) {
      getCastFromCastCategoory();
    }
  }, [watch("casteCategory")]);

  // get bachatgat category new scheme
  const getBachatGatCategoryNewScheme = () => {
    if (router.query.id) {
      setIsLoading(true);
      axios
        .get(
          `${urls.BSUPURL}/trnSchemeApplicationNew/getById?id=${router.query.id}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setIsLoading(false);
          setNewSchemeDetails(r.data);
          setAccPaymentData(r.data.installmentDetailsDaos);
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

  // set bachatgat category on UI
  const setBachatGatCategoryNewSchemes = () => {
    if (newSchemeDetails != null) {
      let _res = newSchemeDetails;
      setMainScheme(_res?.mainSchemeKey);
      setApplicationNo(_res?.applicationNo);
      setEligiblityCriteriaDetails(
        _res?.trnSchemeApplicationDataDaoList &&
          _res?.trnSchemeApplicationDataDaoList
      );
      setValue("applicantFirstName", _res?.applicantFirstName);
      setValue("applicantMiddleName", _res?.applicantMiddleName);
      setValue("applicantLastName", _res?.applicantLastName);
      setValue("buildingName", _res?.buildingName);
      setValue("roadName", _res?.roadName);
      setValue("bachatgatNo", _res?.bachatgatNo);
      setValue("applicantAadharNo", _res?.applicantAadharNo);
      setValue("emailId", _res?.emailId);
      setValue("mobileNo", _res?.mobileNo);
      setValue("benecode", _res?.beneficiaryCode);
      setValue("benefitAmount", _res?.benefitAmount);
      setValue(
        "paymentDate",
        moment(_res?.installmentDate).format("DD/MM/YYYY")
      );
      setValue(
        "completedInstallment",
        _res?.completedInstallment == null ? 0 : _res?.completedInstallment
      );
      setValue("rejectReason", _res?.rejectReason);
      setValue("amountPaid", _res?.amountPaid);
      let remAmt = _res?.benefitAmount - _res?.amountPaid;
      setValue("remaingAmount", remAmt);
      setRemAmount(remAmt);
      setValue("casteCategory", _res?.casteCategory);
      setValue("casteOption", _res?.castOptionKey);
      setValue(
        "zoneKey",
        language == "en"
          ? zoneNames?.find((obj) => obj.id == _res?.zoneKey)?.zoneName
            ? zoneNames?.find((obj) => obj.id == _res?.zoneKey)?.zoneName
            : "-"
          : zoneNames?.find((obj) => obj.id == _res?.zoneKey)?.zoneNameMr
          ? zoneNames?.find((obj) => obj.id == _res?.zoneKey)?.zoneNameMr
          : "-"
      );
      setValue(
        "wardKey",
        language == "en"
          ? wardNames?.find((obj) => obj.id == _res?.wardKey)?.wardName
            ? wardNames?.find((obj) => obj.id == _res?.wardKey)?.wardName
            : "-"
          : wardNames?.find((obj) => obj.id == _res?.wardKey)?.wardNameMr
          ? wardNames?.find((obj) => obj.id == _res?.wardKey)?.wardNameMr
          : "-"
      );
      setValue(
        "areaKey",
        language == "en"
          ? crAreaNames?.find((obj) => obj.id == _res?.areaKey)?.crAreaName
            ? crAreaNames?.find((obj) => obj.id == _res?.areaKey)?.crAreaName
            : "-"
          : crAreaNames?.find((obj) => obj.id == _res?.areaKey)?.crAreaNameMr
          ? crAreaNames?.find((obj) => obj.id == _res?.areaKey)?.crAreaNameMr
          : "-"
      );
      setValue("landmark", _res?.landmark ? _res?.landmark : "-");
      setValue(
        "flatBuldingNo",
        _res?.flatBuldingNo ? _res?.flatBuldingNo : "-"
      );
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
        bankMaster?.find((obj) => obj.id == _res?.bankBranchKey)?.bankName
          ? bankMaster?.find((obj) => obj.id == _res?.bankBranchKey)?.bankName
          : "-"
      );
      setValue("ifscCode", _res?.ifscCode);
      setValue("micrCode", _res?.micrCode);
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
          ? subSchemeNames?.find((obj) => obj.id == _res?.subSchemeKey)
              ?.subSchemeName
            ? subSchemeNames?.find((obj) => obj.id == _res?.subSchemeKey)
                ?.subSchemeName
            : "-"
          : subSchemeNames?.find((obj) => obj.id == _res?.subSchemeKey)
              ?.subSchemeNameMr
          ? subSchemeNames?.find((obj) => obj.id == _res?.subSchemeKey)
              ?.subSchemeNameMr
          : "-"
      );
      setSubScheme(_res?.subSchemeKey);
      setEligiblityDocuments(_res?.trnSchemeApplicationDocumentsList);
      setValue("fromDate", _res?.fromDate ? _res?.fromDate : null);
      setValue("bankBranchKey", _res?.branchName);
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
      setValue("paymentDate", _res?.installmentDate);
      setValue("chequeNo", _res?.chequeNo);
      setValue("amountPaid", _res?.amountPaid);
      setValue("installmentAmount", _res?.installmentAmount);
      setInstallmentAmount(_res?.amountPaid);
      setValue("religionKey", _res?.religionKey ? _res?.religionKey : null);
      setValue(
        "mainSchemeKey",
        language == "en"
          ? mainNames?.find((obj) => obj.id == _res?.mainSchemeKey)?.schemeName
            ? mainNames?.find((obj) => obj.id == _res?.mainSchemeKey)
                ?.schemeName
            : "-"
          : mainNames?.find((obj) => obj.id == _res?.mainSchemeKey)
              ?.schemeNameMr
          ? mainNames?.find((obj) => obj.id == _res?.mainSchemeKey)
              ?.schemeNameMr
          : "-"
      );
      setStatusVal(_res?.status);
      setValue("divyangSchemeTypeKey", _res?.divyangSchemeTypeKey);
      setValue("saSanghatakRemark", _res?.saSanghatakRemark);
      setValue("deptClerkRemark", _res?.deptClerkRemark);
      setValue("deptyCommissionerRemark", _res?.deptyCommissionerRemark);
      setValue("asstCommissionerRemark", _res?.asstCommissionerRemark);
      setCurrentStatus(manageStatus(_res?.status, language, statusAll));

      // const accPaymentDeatils = _res?.installmentDetailsDaos.map((d)=>({
      //   id : d.id,
      //   activeFlag:

      // }))

      const bankDoc = [];
      const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", _res?.passbookFrontPage);
      const DecryptPhoto1 = DecryptData("passphraseaaaaaaaaupload", _res?.passbookLastPage);
      if (_res?.passbookFrontPage && _res?.passbookLastPage) {
       

        bankDoc.push({
          id: 1,
          title:
            language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
          documentType: "r.documentType",
          documentPath: _res?.passbookFrontPage,
          filenm:
            _res?.passbookFrontPage &&
            DecryptPhoto.split("/").pop().split("_").pop(),
        });
        bankDoc.push({
          id: 2,
          title: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
          documentType: "r.documentType",
          documentPath: _res?.passbookLastPage,
          filenm:
            _res?.passbookLastPage &&
            DecryptPhoto1.split("/").pop().split("_").pop(),
        });
      } else if (_res?.passbookLastPage) {
        bankDoc.push({
          id: 14,
          title: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
          documentType: "r.documentType",
          documentPath: _res?.passbookLastPage,
          filenm:
            _res?.passbookLastPage &&
            DecryptPhoto1.split("/").pop().split("_").pop(),
        });
      } else if (_res?.passbookFrontPage) {
        bankDoc.push({
          id: 15,
          title:
            language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
          documentPath: _res?.passbookFrontPage,
          filenm:
            _res?.passbookFrontPage &&
            DecryptPhoto.split("/").pop().split("_").pop(),
        });
      }
      setBankDoc([...bankDoc]);
    }
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
    if (docUpload.length != 0 && eligiblityDocuments.length != 0) {
      const res = [];
      let counter = 1;
      for (var i = 0; i < docUpload.length; i++) {
        for (var j = 0; j < eligiblityDocuments.length; j++) {
          if (
            eligiblityDocuments[j].schemesConfigDocumentsKey ==
              docUpload[i].id &&
            eligiblityDocuments[j].documentPath
          ) {
            res.push({
              srNo: counter++,
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
          }
        }
      }
      setFetchDocuments([...res]);
    }
  }, [docUpload, eligiblityDocuments]);

  useEffect(() => {
    if (newSchemeDetails != null) setDataToTable();
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
              ? "Zonal Clerk"
              : i == 2
              ? "Zonal Officer"
              : "HO Clerk",
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
              ? "Zonal Clerk"
              : i == 2
              ? "Zonal Officer"
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
              ? "Zonal Clerk"
              : i == 2
              ? "HO Clerk"
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
          designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Zonal Clerk" : "",
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
          designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "HO Clerk" : "",
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
            i == 0 ? "Zonal Clerk" : i == 1 ? "Zonal Officer" : "HO Clerk",
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
          designation: i == 0 ? "Zonal Clerk" : i == 1 ? "Zonal Officer" : "",
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
          designation: i == 0 ? "Zonal Clerk" : i == 1 ? "HO Clerk" : "",
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
          designation: i == 0 ? "Zonal Clerk" : "",
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
          designation: i == 0 ? "Zonal Officer" : "HO Clerk",
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
          designation: i == 0 ? "Zonal Officer" : "",
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
          designation: i == 0 ? "HO Clerk" : "",
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
      // width: 100,
      // flex: 1,
    },
    {
      field: "userName",
      headerName: <FormattedLabel id="userName" />,
      headerAlign: "center",
      align: "left",
      // width: 200,
      flex: 1,
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="design" />,
      headerAlign: "center",
      align: "left",
      // width: 150,
      flex: 1,
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      headerAlign: "center",
      align: "left",
      // width: 900,
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "remarkDate",
      headerName: <FormattedLabel id="remarkDate" />,
      headerAlign: "center",
      align: "center",
      // width: 150,
      flex: 1,
    },
  ];
  const accountPaymentCol = [
    {
      field: "currInstallmentNumber",
      headerName: <FormattedLabel id="currInstallmentNumber" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: "installmentAmt",
      headerName: <FormattedLabel id="installmentAmt" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "installmentDate",
      headerName: <FormattedLabel id="installmentDate" />,
      headerAlign: "center",
      valueFormatter: (params) =>
        params.value ? moment(params.value).format("DD/MM/YYYY HH:mm") : "",
      align: "center",
      flex: 1,
    },
    {
      field: "chequeNo",
      headerName: <FormattedLabel id="chequeNo" />,
      headerAlign: "center",
      align: "center",
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
  };

  // get sub scheme
  const getSubScheme = () => {
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
  };

  // get dependancy(Eligiblity)
  const getDependency = () => {
    if (subSchemeVal && mainSchemeVal) {
      setIsLoading(true);
      axios
        .get(
          `${urls.BSUPURL}/mstSchemesConfigData/getAllBySchemeConfigAndSubSchemeKey?schemeConfigKey=${mainSchemeVal}&subSchemeKey=${subSchemeVal}`,
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
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
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
    let isInstallmentPaid = false;
    let completedInstallment = null;
    let installmentAmount = null;
    let installmentDate = null;
    let paymentType = null;
    let paymentMode = null;

    if (
      authority &&
      authority.find((val) => val === bsupUserRoles.roleAccountant)
    ) {
      isInstallmentPaid = true;
      completedInstallment =
        formData.completedInstallment == null
          ? 0
          : formData.completedInstallment;
      installmentAmount = watch("installmentAmount");
      installmentDate = watch("paymentDate")
        ? moment(watch("paymentDate")).format("YYYY-MM-DD")
        : "";
      paymentType = formData.paymentType == null ? null : formData.paymentType;
      paymentMode = formData.paymentMode == null ? null : formData.paymentMode;
    }

    let paymentDao = {
      installmentPaid: isInstallmentPaid,
      completedInstallment: completedInstallment,
      installmentAmount: installmentAmount,
      installmentDate: installmentDate,
      paymentType: paymentType,
      paymentMode: paymentMode,
    };

    const temp = [
      {
        ...newSchemeDetails,
        saSanghatakRemark:
          watch("saSanghatakRemark") != null && watch("saSanghatakRemark") != ""
            ? watch("saSanghatakRemark").toString()
            : newSchemeDetails.saSanghatakRemark == null
            ? watch("saSanghatakRemark")
            : newSchemeDetails.saSanghatakRemark,
        deptClerkRemark:
          watch("deptClerkRemark") != null && watch("deptClerkRemark") != ""
            ? watch("deptClerkRemark").toString()
            : newSchemeDetails.deptClerkRemark == null
            ? watch("deptClerkRemark")
            : newSchemeDetails.deptClerkRemark,
        asstCommissionerRemark:
          watch("asstCommissionerRemark") != null &&
          watch("asstCommissionerRemark") != ""
            ? watch("asstCommissionerRemark").toString()
            : newSchemeDetails.asstCommissionerRemark == null
            ? watch("asstCommissionerRemark")
            : newSchemeDetails.asstCommissionerRemark,
        deptyCommissionerRemark:
          watch("deptyCommissionerRemark") != null &&
          watch("deptyCommissionerRemark") != ""
            ? watch("deptyCommissionerRemark").toString()
            : newSchemeDetails.deptyCommissionerRemark == null
            ? watch("deptyCommissionerRemark")
            : newSchemeDetails.deptyCommissionerRemark,
        isApproved:
          formData === "Save" ? true : formData === "Revert" ? false : false,
        isBenifitedPreviously: false,
        isComplete: false,
        isDraft: false,
        rejectReason: rejectReason,
        status: formData === "Reject" ? 22 : statusVal,
        // ////////////////////////////////Accountuser////////////////
        installmentDate: installmentDate,
        installmentAmount: installmentAmount,
        // amountPaid: installmentAmount,
        installmentPaid: isInstallmentPaid,
        trnInstallmentDetailsDao: paymentDao,
      },
    ];
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले",
            text:
              language === "en"
                ? formData === "Save"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Approved successfully !`
                  : formData === "Revert"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Reverted successfully !`
                  : `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Rejected successfully !`
                : formData === "Save"
                ? `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या मंजूर केले!`
                : formData === "Revert"
                ? `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या परत केले!`
                : `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या नाकारले!`,
            icon: "success",
            confirmButtonText: "OK",

            showCancelButton: false,
            confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              {
                router.push(
                  "/BsupNagarvasthi/transaction/newApplicationScheme/list"
                );
              }
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // accountant remark save
  const saveAccountant = (formData) => {
    let isInstallmentPaid = false;
    let completedInstallment = null;
    let installmentAmount = null;
    let installmentDate = null;
    let paymentType = null;
    let paymentMode = null;

    // if (authority && authority.find((val) => val === "PAYMENT VERIFICATION")) {
    if (
      authority &&
      authority.find((val) => val === bsupUserRoles.roleAccountant)
    ) {
      isInstallmentPaid = true;
      completedInstallment =
        formData?.completedInstallment == null
          ? 0
          : formData?.completedInstallment;
      installmentAmount =
      watch("installmentAmount");
      installmentDate = new Date();
      paymentType =
        formData?.paymentType == null ? null : formData?.paymentType;
      paymentMode =
        formData?.paymentMode == null ? null : formData?.paymentMode;
    }

    let paymentDao = [
      {
        installmentPaid: isInstallmentPaid,
        completedInstallment: completedInstallment,
        installmentAmount: watch("installmentAmount"),
        installmentDate: installmentDate,
        paymentType: paymentType,
        paymentMode: paymentMode,
        chequeNo: watch("chequeNo"),
      },
    ];

    const temp = [
      {
        ...newSchemeDetails,
        isBenifitedPreviously: false,
        isComplete: true,
        isDraft: false,
        paymentDate: watch("paymentDate"),
        installmentDate: installmentDate,
        chequeNo: watch("chequeNo"),
        installmentAmount: watch("installmentAmount"),
        installmentPaid: isInstallmentPaid,
        // transactionNo: watch("chequeNo"),
        // amountPaid: watch("amountPaid"),
        // paymentDate: watch("paymentDate"),
        installmentDetailsDaos: paymentDao,
      },
    ];



    setIsLoading(true);
    const tempData = axios
      .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert(
            language === "en" ? "Saved!" : "जतन केले!",
            language === "en"
              ? `Application no ${
                  res.data.message.split("[")[1].split("]")[0]
                } Approved successfully !`
              : `
            अर्ज क्र ${
              res.data.message.split("[")[1].split("]")[0]
            } यशस्वीरित्या मंजूर केले!`,
            language === "en" ? "success" : "यशस्वी",
            {
              showCancelButton: false,
              confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false, // Prevent closing on Esc key
              closeOnClickOutside: false,
            }
          ).then((will) => {
            if (will) {
              router.push({
                pathname:
                  "/BsupNagarvasthi/transaction/newApplicationScheme/list",
              });
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // load bachat gat reject categories
  const getRejectCategories = () => {
    axios
      .get(
        `${urls.BSUPURL}/mstRejectCategory/getAllSchemeRejectionCategories`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setBachatgatApprovalCategories(
          r.data.mstRejectCategoryDao.map((row) => ({
            id: row.id,
            rejectCat: row.rejectCat,
            rejectCatMr: row.rejectCatMr,
            forBachatGatorScheme: row.forBachatGatorScheme,
            categoryType: row.categoryType,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // const handleAmountPaidChange = (event) => {
  //   const inputValue = event.target.value;
  //   const billAmount = parseFloat(inputValue);

  //   if (!isNaN(billAmount) && billAmount <= remAmount) {
  //     setValue("installmentAmount", inputValue);
  //   } else {
  //     setValue("installmentAmount", ""); // Clear the input value
  //   }
  // };

  const handleAmountPaidChange = (event) => {
    const inputValue = event.target.value;
    const billAmount = parseFloat(inputValue);

    if (!isNaN(billAmount) && billAmount <= remAmount) {
      setValue("installmentAmount", inputValue);
    } else {
      setValue("installmentAmount", "");
    }
  };

  // UI
  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
      <Paper
        elevation={8}
        ref={componentRef}
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
                  gap: 3,
                }}
              >
                {appliNo}
              </label>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
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
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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

            {/* Benefit Amount */}
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
                disabled={true}
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
            {watch("bachatgatNo") !== "" ||
              watch("bachatgatNo") != null ||
              (watch("bachatgatNo") != undefined && (
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
                    disabled={true} //{loggedUser === "citizenUser" ? true : false}
                    InputLabelProps={{ shrink: true }}
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
              ))}

            {/* No Of Installments paid */}
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
                disabled={true} //{loggedUser === "citizenUser" ? true : false}
                label={<FormattedLabel id="paidInstallments" />}
                variant="standard"
                {...register("completedInstallment")}
                value={watch("completedInstallment")}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.completedInstallment}
                helperText={
                  errors?.completedInstallment
                    ? errors.completedInstallment.message
                    : null
                }
              />
            </Grid>

            {/* paid Amount */}
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
                disabled={true} //{loggedUser === "citizenUser" ? true : false}
                label={<FormattedLabel id="paidAmount" />}
                variant="standard"
                {...register("amountPaid")}
                value={watch("amountPaid")}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.amountPaid}
                helperText={
                  errors?.amountPaid ? errors.amountPaid.message : null
                }
              />
            </Grid>
            {/* remaining Amount */}
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
                disabled={true} //{loggedUser === "citizenUser" ? true : false}
                label={<FormattedLabel id="remaingAmount" />}
                variant="standard"
                {...register("remaingAmount")}
                value={watch("remaingAmount")}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.remaingAmount}
                helperText={
                  errors?.remaingAmount ? errors.remaingAmount.message : null
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
            {/* Last Name */}
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
            {/* Gender */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
                error={errors.casteCategory}
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
                            // <MenuItem key={index} value={auditorium.id}>
                            //   {auditorium.cast}
                            // </MenuItem>
                            <MenuItem key={index} value={auditorium.id}>
                              {auditorium.castCategory}
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

            {mainSchemeVal === 26 && (
              <>
                {/* Divyang Scheme Type */}
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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
                    disabled={true}
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
              </>
            )}
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
            getRowHeight={() => "auto"}
            autoHeight={true}
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
            rows={eligiblityData}
            columns={eligiblityColumns}
          />
          <Grid item xs={12}>
            <Box>
              <Grid
                container
                className={commonStyles.title}
                style={{ marginTop: "1rem" }}
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
                {...register("bankBranchKey")}
                error={!!errors.bankBranchKey}
                helperText={
                  errors?.bankBranchKey ? errors.bankBranchKey.message : null
                }
              />
            </Grid>
            {/* Saving Account No */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
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
              getRowHeight={() => "auto"}
              autoHeight={true}
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
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginTop: "10px" }}
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
                      <FormattedLabel id="eligibilityDoc" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
          <DataGrid
            getRowHeight={() => "auto"}
            autoHeight={true}
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
            // (loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
            // (statusVal === 1 || statusVal === 23 || statusVal === 22) &&
            remarkTableData.length != 0) && (
            <Grid item xs={12}>
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginTop: "10px" }}
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
                      <FormattedLabel id="approvalSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
          {/* {(loggedUser === "citizenUser" || loggedUser === "cfcUser") && */}

          {(statusVal === 22 || statusVal === 1) &&
            (loggedUser === "citizenUser" || loggedUser === "cfcUser") && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
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

          {/* {statusVal === 22 &&
            (loggedUser === "citizenUser" || loggedUser === "cfcUser") && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="rejectCat" />}
                  multiline
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={true}
                  {...register("rejectReason")}
                  error={!!errors.rejectReason}
                  helperText={
                    errors?.rejectCat ? errors.rejectCat.message : null
                  }
                />{" "}
              </Grid>
            )} */}
          {/* } */}
          
            {/* // loggedUser != "citizenUser" &&
            //   loggedUser != "cfcUser" && */}
          {( remarkTableData.length != 0) && (
              <DataGrid
                getRowHeight={() => "auto"}
                autoHeight={true}
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
                // rowHeight={150}
                rowCount={remarkTableData.length}
                pageSize={10}
                rows={remarkTableData}
                columns={approveSectionCol}
                onPageChange={(_data) => {}}
                onPageSizeChange={(_data) => {}}
              />
            )
          }
          <>
            {(loggedUser !== "citizenUser" || loggedUser !== "cfcUser") && (
              <Box sx={{ marginTop: "1rem" }}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    [theme.breakpoints.up("sm")]: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                >
                  {statusVal !== 15 && (
                    <>
                      {/* Checkbox for approve */}
                      {(((statusVal === 2 || statusVal === 23) &&
                        authority &&
                        // authority.find((val) => val === "SAMUHA SANGHATAK")) ||
                        authority.find(
                          (val) => val === bsupUserRoles.roleSamuhaSanghatak
                        )) ||
                        ((statusVal == 4 || statusVal == 3) &&
                          authority &&
                          authority.find(
                            // (val) => val === "PROPOSAL APPROVAL"
                            (val) => val === bsupUserRoles.roleZonalClerk
                          )) ||
                        ((statusVal == 5 || statusVal == 6) &&
                          authority &&
                          // authority.find((val) => val === "APPROVAL")) ||
                          authority.find(
                            (val) => val === bsupUserRoles.roleZonalOfficer
                          )) ||
                        (statusVal == 7 &&
                          authority &&
                          authority.find(
                            // (val) => val === "FINAL_APPROVAL"
                            (val) => val === bsupUserRoles.roleHOClerk
                          ))) && (
                        <>
                          <Grid item xl={2} lg={2} md={2} sm={4} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="approve"
                                  checked={isApproveChecked}
                                  onChange={handleCheckboxChange}
                                />
                              }
                              label={<FormattedLabel id="approvebtn" />}
                            />
                          </Grid>

                          {/* Checkbox for revert */}
                          <Grid item xl={2} lg={2} md={2} sm={4} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="revert"
                                  checked={isRevertChecked}
                                  onChange={handleCheckboxChange}
                                />
                              }
                              label={<FormattedLabel id="revertbtn" />}
                            />
                          </Grid>

                          {/* Checkbox for reject */}
                          {(statusVal === 2 || statusVal === 23) &&
                            authority &&
                            authority.find(
                              // (val) => val === "SAMUHA SANGHATAK"
                              (val) => val === bsupUserRoles.roleSamuhaSanghatak
                            ) && (
                              <Grid item xl={2} lg={2} md={2} sm={4} xs={12}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="reject"
                                      checked={isRejectChecked}
                                      onChange={handleCheckboxChange}
                                    />
                                  }
                                  label={<FormattedLabel id="rejectBtn" />}
                                />
                              </Grid>
                            )}
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </Box>
            )}

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {(((statusVal == 2 || statusVal == 23) &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleSamuhaSanghatak
                )) ||
                (loggedUser === "citizenUser" && statusVal == 23)) && <></>}

              {/* Samuh sanghtak remark */}
              {(statusVal == 2 || statusVal == 23) &&
                authority &&
                // authority.find((val) => val === "SAMUHA SANGHATAK") && (
                authority.find(
                  (val) => val === bsupUserRoles.roleSamuhaSanghatak
                ) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="saSanghatakRemark" />}
                          variant="standard"
                          inputProps={{ maxLength: 1000 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled={
                            statusVal != 2 && statusVal != 23
                              ? true
                              : authority &&
                                authority.find(
                                  // (val) => val === "SAMUHA SANGHATAK"
                                  (val) =>
                                    val === bsupUserRoles.roleSamuhaSanghatak
                                )
                              ? false
                              : true
                          }
                          {...register("saSanghatakRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "samuhaSanghatakRemark")
                          }
                          error={!!errors.saSanghatakRemark}
                          helperText={
                            errors?.saSanghatakRemark
                              ? errors.saSanghatakRemark.message
                              : null
                          }
                        />
                      </Grid>
                    )} */}

                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <>
                        {" "}
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
                          <FormControl
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          >
                            <InputLabel id="selectedStudents-label">
                              <FormattedLabel id="revertCategory" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatRevertCategories"
                              control={control}
                              multiline
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="selectedStudents-label"
                                  id="selectedStudents"
                                  multiple
                                  multiline
                                  value={serviceId}
                                  onChange={(e) => {
                                    handleChange(
                                      e,
                                      e.target.value,
                                      "saSanghatakRemark"
                                    );
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                          .map((id) =>
                                            language == "en"
                                              ? bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCat
                                              : bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCatMr
                                          )
                                          .join(", ")
                                  }
                                >
                                  {bachatgatRevertCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatRevertCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                            bachatgatRevertCategories.length
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            "all",
                                            "saSanghatakRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            dept.id,
                                            "saSanghatakRemark"
                                          )
                                        }
                                      />
                                      {language === "en"
                                        ? dept?.rejectCat
                                        : dept?.rejectCatMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="saSanghatakRemark" />}
                            variant="standard"
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            multiline
                            disabled={
                              statusVal != 2 && statusVal != 23
                                ? true
                                : authority &&
                                  authority.find(
                                    (val) =>
                                      val === bsupUserRoles.roleSamuhaSanghatak
                                  )
                                ? false
                                : true
                            }
                            {...register("saSanghatakRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "samuhaSanghatakRemark")
                            }
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
                  </>
                )}

              {/* deparment clerk remark */}
              {(statusVal == 3 || statusVal == 4) &&
                authority &&
                // authority.find((val) => val === "PROPOSAL APPROVAL") && (
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalClerk
                ) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
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
                        // }}
                      >
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="deptClerkRemark" />}
                          variant="standard"
                          inputProps={{ maxLength: 1000 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("deptClerkRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "deptClerkRemark")
                          }
                          disabled={
                            statusVal != 3 && statusVal != 4
                              ? true
                              : authority &&
                                authority.find(
                                  // (val) => val === "PROPOSAL APPROVAL"
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
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <>
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
                          <FormControl
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          >
                            <InputLabel id="selectedStudents-label">
                              <FormattedLabel id="revertCategory" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatRevertCategories"
                              control={control}
                              multiline
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="selectedStudents-label"
                                  id="selectedStudents"
                                  multiple
                                  multiline
                                  value={serviceId}
                                  onChange={(e) => {
                                    handleChange(
                                      e,
                                      e.target.value,
                                      "deptClerkRemark"
                                    );
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                          .map((id) =>
                                            language == "en"
                                              ? bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCat
                                              : bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCatMr
                                          )
                                          .join(", ")
                                  }
                                >
                                  {bachatgatRevertCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatRevertCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                            bachatgatRevertCategories.length
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            "all",
                                            "deptClerkRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            dept.id,
                                            "deptClerkRemark"
                                          )
                                        }
                                      />
                                      {language === "en"
                                        ? dept?.rejectCat
                                        : dept?.rejectCatMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="deptClerkRemark" />}
                            variant="standard"
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            multiline
                            disabled={true}
                            // disabled={
                            //   statusVal != 3 && statusVal != 4
                            //     ? true
                            //     : authority &&
                            //       authority.find(
                            //         (val) =>
                            //           val === bsupUserRoles.roleZonalClerk
                            //       )
                            //     ? false
                            //     : true
                            // }
                            {...register("deptClerkRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "deptClerkRemark")
                            }
                            error={!!errors.deptClerkRemark}
                            helperText={
                              errors?.deptClerkRemark
                                ? errors.deptClerkRemark.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}

              {/* assistant commisssioner remark */}
              {(statusVal == 5 || statusVal == 6) &&
                authority &&
                // authority.find((val) => val === "APPROVAL") && (
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalOfficer
                ) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="asstCommissionerRemark" />}
                          variant="standard"
                          disabled={
                            statusVal != 5 && statusVal != 6
                              ? true
                              : authority &&
                                // authority.find((val) => val === "APPROVAL")
                                authority.find(
                                  (val) =>
                                    val === bsupUserRoles.roleZonalOfficer
                                )
                              ? false
                              : true
                          }
                          inputProps={{ maxLength: 1000 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("asstCommissionerRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "asstCommissionerRemark")
                          }
                          error={!!errors.asstCommissionerRemark}
                          helperText={
                            errors?.asstCommissionerRemark
                              ? errors.asstCommissionerRemark.message
                              : null
                          }
                        />
                      </Grid>
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <>
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
                          <FormControl
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          >
                            <InputLabel id="selectedStudents-label">
                              <FormattedLabel id="revertCategory" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatRevertCategories"
                              control={control}
                              multiline
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="selectedStudents-label"
                                  id="selectedStudents"
                                  multiple
                                  multiline
                                  value={serviceId}
                                  onChange={(e) => {
                                    handleChange(
                                      e,
                                      e.target.value,
                                      "asstCommissionerRemark"
                                    );
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                          .map((id) =>
                                            language == "en"
                                              ? bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCat
                                              : bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCatMr
                                          )
                                          .join(", ")
                                  }
                                >
                                  {bachatgatRevertCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatRevertCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                            bachatgatRevertCategories.length
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            "all",
                                            "asstCommissionerRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            dept.id,
                                            "asstCommissionerRemark"
                                          )
                                        }
                                      />
                                      {language === "en"
                                        ? dept?.rejectCat
                                        : dept?.rejectCatMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="asstCommissionerRemark" />
                            }
                            variant="standard"
                            disabled={true}
                            // disabled={
                            //   statusVal != 5 && statusVal != 6
                            //     ? true
                            //     : authority &&
                            //       authority.find(
                            //         (val) =>
                            //           val === bsupUserRoles.roleZonalOfficer
                            //       )
                            //     ? false
                            //     : true
                            // }
                            multiline
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            {...register("asstCommissionerRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "asstCommissionerRemark")
                            }
                            error={!!errors.asstCommissionerRemark}
                            helperText={
                              errors?.asstCommissionerRemark
                                ? errors.asstCommissionerRemark.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}

              {/* HO Clerk remark */}
              {statusVal == 7 &&
                authority &&
                // authority.find((val) => val === "FINAL_APPROVAL") && (
                authority.find((val) => val === bsupUserRoles.roleHOClerk) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={
                            <FormattedLabel id="deptyCommissionerRemark" />
                          }
                          variant="standard"
                          disabled={statusVal != 7 ? true : false}
                          inputProps={{ maxLength: 1000 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("deptyCommissionerRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "deptyCommissionerRemark")
                          }
                          error={!!errors.deptyCommissionerRemark}
                          helperText={
                            errors?.deptyCommissionerRemark
                              ? errors.deptyCommissionerRemark.message
                              : null
                          }
                        />
                      </Grid>
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <>
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
                          <FormControl
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          >
                            <InputLabel id="selectedStudents-label">
                              <FormattedLabel id="revertCategory" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatRevertCategories"
                              control={control}
                              multiline
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                  labelId="selectedStudents-label"
                                  id="selectedStudents"
                                  multiple
                                  multiline
                                  value={serviceId}
                                  onChange={(e) => {
                                    handleChange(
                                      e,
                                      e.target.value,
                                      "deptyCommissionerRemark"
                                    );
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                          .map((id) =>
                                            language == "en"
                                              ? bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCat
                                              : bachatgatRevertCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCatMr
                                          )
                                          .join(", ")
                                  }
                                >
                                  {bachatgatRevertCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatRevertCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                            bachatgatRevertCategories.length
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            "all",
                                            "deptyCommissionerRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            dept.id,
                                            "deptyCommissionerRemark"
                                          )
                                        }
                                      />
                                      {language === "en"
                                        ? dept?.rejectCat
                                        : dept?.rejectCatMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="deptyCommissionerRemark" />
                            }
                            multiline
                            variant="standard"
                            // disabled={statusVal != 7 ? true : false}
                            disabled={true}
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            {...register("deptyCommissionerRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "deptyCommissionerRemark")
                            }
                            error={!!errors.deptyCommissionerRemark}
                            helperText={
                              errors?.deptyCommissionerRemark
                                ? errors.deptyCommissionerRemark.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}
            </Grid>

            {/* Approve  reject revert button */}
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
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalClerk
                )) ||
              (statusVal == 7 &&
                authority &&
                // authority.find((val) => val === "FINAL_APPROVAL"))) && (
                authority.find(
                  (val) => val === bsupUserRoles.roleHOClerk
                ))) && (
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xl={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 6
                      : 4
                  }
                  lg={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 6
                      : 4
                  }
                  md={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 6
                      : 4
                  }
                  sm={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 6
                      : 4
                  }
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{ margin: 1 }}
                    variant="contained"
                    color="error"
                    // className={commonStyles.buttonBack}
                    size="small"
                    onClick={() => backButton()}
                  >
                    <FormattedLabel id="back" />
                  </Button>
                </Grid>
                <Grid
                  item
                  xl={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 6
                      : 4
                  }
                  lg={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 6
                      : 4
                  }
                  md={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 12
                      : 4
                  }
                  sm={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 6
                      : 4
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
                      onPrint();
                    }}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </Grid>
                {isApproveChecked && (
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={4}
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
                      // className={commonStyles.buttonApprove}
                      // disabled={!isRemarksFilled}
                      disabled={serviceId.length > 0 ? false : true}
                      variant="contained"
                      color="success"
                      size="small"
                    >
                      <FormattedLabel id="approvebtn" />
                    </Button>
                  </Grid>
                )}
                {isRevertChecked && (
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={4}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={() => {
                        onSubmitForm("Revert");
                      }}
                      // className={commonStyles.buttonRevert}
                      // disabled={!isRemarksFilled}
                      disabled={serviceId.length > 0 ? false : true}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      <FormattedLabel id="revertbtn" />
                    </Button>
                  </Grid>
                )}

                {authority &&
                  // authority.find((val) => val === "SAMUHA SANGHATAK") && (
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  ) && (
                    <>
                      {isRejectChecked && (
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={4}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            // className={commonStyles.buttonReject}
                            // disabled={!isRemarksFilled}
                            disabled={serviceId.length > 0 ? false : true}
                            size="small"
                            onClick={() => {
                              onSubmitForm("Reject");
                            }}
                            variant="contained"
                            color="secondary"
                          >
                            <FormattedLabel id="rejectBtn" />
                          </Button>
                        </Grid>
                      )}
                    </>
                  )}
              </Grid>
            )}
          </>
          {(statusVal === 10 || statusVal == 9) &&
            (accPaymentTableData.length != 0 ||
              (authority &&
                // authority?.find((val) => val === "PAYMENT VERIFICATION")) ||
                authority?.find(
                  (val) => val === bsupUserRoles.roleAccountant
                ))) && (
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
                          <FormattedLabel id="paymentDetails" />
                        </h3>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
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
                  density="compact"
                  rowHeight={50}
                  rowCount={accPaymentTableData.length}
                  pageSize={10}
                  rows={accPaymentTableData}
                  columns={accountPaymentCol}
                  onPageChange={(_data) => {}}
                  onPageSizeChange={(_data) => {}}
                />
              </>
            )}

          {statusVal == 9 &&
            authority &&
            // authority?.find((val) => val === "PAYMENT VERIFICATION")) ||
            authority?.find((val) => val === bsupUserRoles.roleAccountant) && (
              // ||
              // ((loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
              //   statusVal == 10) ||
              // statusVal === 19 ||
              // statusVal === 20)
              // (
              <>
                {" "}
                <Grid item xs={12}>
                  <Box>
                    <Grid
                      container
                      className={commonStyles.title}
                      style={{ marginTop: "1rem" }}
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
                        m: { xs: 0 },
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
                        {errors?.paymentDate
                          ? errors.paymentDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/*  Cheque No */}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      disabled={statusVal != 9 ? true : false}
                      inputProps={{ maxLength: 6, minLength: 6 }}
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="chequeNo" />}
                      variant="standard"
                      // type="number"
                      {...register("chequeNo")}
                      error={!!errors.chequeNo}
                      helperText={
                        errors?.chequeNo ? errors.chequeNo.message : null
                      }
                    />
                  </Grid>
                  {/* Bill Amount */}
                  {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      onInput={handleAmountPaidChange}
                      type="number"
                      disabled={statusVal !== 9}
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="billAmount" />}
                      variant="standard"
                      {...register("installmentAmount", {
                        validate: (value) =>
                          parseFloat(value) <= parseFloat(remAmount)
                            ? true
                            : "Exceeds remaining amount",
                      })}
                      error={!!errors.installmentAmount}
                      helperText={
                        errors.installmentAmount
                          ? errors.installmentAmount.message
                          : null
                      }
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      onInput={handleAmountPaidChange}
                      type="number"
                      disabled={statusVal !== 9 || remAmount <= 0} // Disable if statusVal is not 9 or remAmount is 0
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="billAmount" />}
                      variant="standard"
                      // value={
                      //   remAmount <= 0 ? 0 : watch("installmentAmount", "")
                      // } // Show 0 if remAmount is zero/negative
                      value={
                        remAmount <= 0
                          ? 0
                          : parseFloat(watch("installmentAmount")) > remAmount
                          ? remAmount
                          : watch("installmentAmount")
                      } // Show entered value or remaining amount if greater
                      {...register("installmentAmount", {
                        validate: (value) =>
                          parseFloat(value) <= parseFloat(remAmount) &&
                          parseFloat(remAmount) >= 0
                            ? true
                            : "Exceeds remaining amount",
                      })}
                      error={!!errors.installmentAmount}
                      helperText={
                        errors.installmentAmount
                          ? errors.installmentAmount.message
                          : null
                      }
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
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      router.push({
                        pathname: "/BsupNagarvasthi/transaction/newApplicationScheme/list",
                      });
                    }}
                    // className={commonStyles.buttonExit}
                    size="small"
                    variant="contained"
                    color="error"
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      setValue("chequeNo", ""),
                        setValue("amountPaid", ""),
                        setValue("paymentDate", null);
                    }}
                    // className={commonStyles.buttonExit}
                    size="small"
                    variant="contained"
                    color="primary"
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                </Grid>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    disabled={
                      // remAmount <= 0 ||
                      // watch("installmentAmount") &&
                      // watch("chequeNo") &&
                      // watch("paymentDate")
                      //   ? false
                      //   : true
                      remAmount <= 0 ||
                      !watch("installmentAmount") ||
                      !watch("chequeNo") ||
                      !watch("paymentDate")
                    }
                    // className={commonStyles.buttonApprove}
                    size="small"
                    type="submit"
                    onClick={() => {
                      saveAccountant();
                    }}
                    variant="contained"
                    color="success"
                  >
                    <FormattedLabel id="approvebtn" />
                  </Button>
                </Grid>
              </Grid>
            )}

          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {statusVal == 10 &&
              (loggedUser === "citizenUser" || loggedUser === "cfcUser") && (
                <>
                  {/* <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button size="small" variant="contained" type="primary">
                      <FormattedLabel id="print" />
                    </Button>
                  </Grid> */}
                </>
              )}
            {(loggedUser === "citizenUser" ||
              (statusVal != 2 &&
                statusVal != 23 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleSamuhaSanghatak
                )) ||
              (statusVal != 5 &&
                statusVal != 6 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalOfficer
                )) ||
              (statusVal != 3 &&
                statusVal != 4 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalClerk
                )) ||
              (statusVal != 7 &&
                authority &&
                authority.find((val) => val === bsupUserRoles.roleHOClerk)) ||
              (authority &&
                // authority.find((val) => val === "PAYMENT VERIFICATION") &&
                authority.find((val) => val === bsupUserRoles.roleAccountant) &&
                statusVal != 9)) && (
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
                    sx={{ margin: 1 }}
                    variant="contained"
                    // className={commonStyles.buttonBack}
                    color="error"
                    size="small"
                    onClick={() => backButton()}
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
                    sx={{ margin: 1 }}
                    variant="contained"
                    // className={commonStyles.buttonBack}
                    color="primary"
                    size="small"
                    onClick={() => onPrint()}
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategorySchemes;
