import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Fingerprint from "../../../../components/common/fingerPrintSM";
// import UploadButton from "../../../../components/fileUpload/UploadButton";
import UploadButton from "../../../../components/security/UploadButton";
import ComponentToPrintDeptKeyIssue from "../../../../components/security/ComponentToPrintDeptKeyIssue";
import UploadButtonThumbOP from "../../../../components/security/DocumentsUploadThumbOP";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/securityManagementSystemSchema/transactions/departmentKeyIssue";
import styles from "../../visitorEntry.module.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TvIcon from "@mui/icons-material/Tv";
import { toast } from "react-toastify";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function DepartmentKeyIssue() {
  const language = useSelector((state) => state.labels.language);
  const [open, setOpen] = useState(false);

  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    defaultValues: {
      departmentOnOffStatus: "N",
      fanOnOffStatus: "N",
      lightOnOffStatus: "N",
      isDepartmentUser: "department_user",
      employeeType: "government_employee",
      personReturningKey: true,
    },
    resolver: yupResolver(schema(language, open)),
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = methods;

  let appName = "SM";
  let serviceName = "SM-DKI";
  // let pageMode = router?.query?.pageMode;
  let pageMode = "DEPARTMENT KEY ISSUE";

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [rowId, setRowId] = useState("");
  const [tempData, setTempData] = useState();

  const [loading, setLoading] = useState(false);

  const [nextEntryNumber, setNextEntryNumber] = useState();
  const [printData, setPrintData] = useState();

  const [keyIssueAt, setKeyIssueAt] = useState(new Date());

  const [base64String, setBase64String] = React.useState("");
  const [fingerPrintImg, setFingerPrintImg] = React.useState("");
  const [info, setInfo] = React.useState("");

  const [imageSrc, setImageSrc] = useState("");

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  let user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  const [openForm, setOpenForm] = useState(false);
  const [disabledData, setDisabledData] = useState();
  const [openAuthority, setOpenAuthority] = useState(false);
  const [authorityData, setAuthorityData] = useState();

  const [paramsData, setParamsData] = useState(false);

  const [employee, setEmployee] = useState([]);

  const [employeeId, setEmployeeId] = useState();
  const [employeeIdReturningKey, setEmployeeIdReturningKey] = useState();
  const [empDetails, setEmpDetails] = useState(false);
  const token = useSelector((state) => state.user.user.token);

  const [encryptedFileNameToSend, setEncryptedFileNameToSend] = useState();
  const [
    encryptedFileNameToSendDeptPerson,
    setEncryptedFileNameToSendDeptPerson,
  ] = useState();

  const [
    encryptedFileNameToSendKeyReturnPerson,
    setEncryptedFileNameToSendKeyReturnPerson,
  ] = useState();

  const [
    encryptedFileNameToSendContractorPerson,
    setEncryptedFileNameToSendContractorPerson,
  ] = useState();

  // useEffect(() => {
  // }, [empDetails]);

  useEffect(() => {
    getDepartment();
    // getEmployee();
    getBasicUserDetails();
    getBuildings();
    getZoneKeys();
    getNextEntryNumber();
    getWardKeys();
    getOtherDepartments();
  }, []);

  useEffect(() => {
    getDepartment();
    // getEmployee();
    getBasicUserDetails();
    getBuildings();
    getZoneKeys();
    getNextEntryNumber();
    getWardKeys();
    getOtherDepartments();
  }, [window.location.reload]);

  useEffect(() => {
    // getAllVisitors();
    if (
      employee?.length > 0 &&
      wardKeys?.length > 0 &&
      zoneKeys?.length > 0 &&
      departments?.length > 0
    ) {
      getAllVisitors();
    }

    if (departments.length > 0) {
      let tempEmployeeDepartment = departments?.find(
        (department) => department.id == user.userDao.department
      )?.department;
      setValue("departmentOfEmployee", tempEmployeeDepartment);
    }
  }, [employee, wardKeys, zoneKeys, departments]);

  const getNextEntryNumber = () => {
    axios
      .get(`${urls.SMURL}/trnDepartmentKeyInOut/getNextIssueNo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setNextEntryNumber(r.data);
        setValue("keyIssueNo", r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  //buildings
  const [buildings, setBuildings] = useState([]);
  const [otherDepartmentList, setOtherDepartmentList] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  // get buildings
  const getBuildings = () => {
    axios
      .get(`${urls.SMURL}/mstBuildingMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        let result = r.data.mstBuildingMasterList;
        setBuildings(result);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  const handleOpen = (_data) => {
    setOpen(true);
    setParamsData(_data);
  };

  const handleOpenAuthority = (_data) => {
    setOpenAuthority(true);
    setAuthorityData(_data);
  };

  const handleClose = () => setOpen(false);
  const handleCloseAuthority = () => setOpenAuthority(false);

  const searchEmployeeDetails = async (userId) => {
    await axios
      .post(`${urls.CFCURL}/master/user/getById=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // .post(`http://localhost:8090/cfc/api/master/user/getById=${userId}`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res emplo", r);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getOtherDepartments = () => {
    axios
      .get(`${urls.SMURL}/mstOtherDepartment/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOtherDepartmentList(
          res.data.mstOtherDepartmentList?.map((r, i) => ({
            id: r.id,
            otherDepartment: r.otherDepartment,
            otherDepartmentMr: r.otherDepartmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);
  // get Zone Keys
  const getZoneKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getWardKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const getFilterWards = (value) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
        {
          params: { moduleId: 21, zoneId: value.target.value },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        setWardKeys(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getEmployee = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let _res = res?.data?.user;

        setEmployee(
          _res?.map((val) => {
            return {
              id: val.id,
              firstNameEn: val.firstNameEn,
              lastNameEn: val.lastNameEn,
              empCode: val.empCode,
              phoneNo: val.phoneNo,
              department: val?.department
                ? val?.department
                : val.officeDepartmentDesignationUserDaoLst[0]?.departmentId,
            };
          })
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getBasicUserDetails = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/user/getUserBasicDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("getBasicUserDetails", res);
        let _res = res.data.userList;
        setEmployee(
          _res?.map((val) => {
            return {
              id: val.id,
              firstNameEn: val.firstNameEn,
              lastNameEn: val.lastNameEn,
              empCode: val.empCode,
              phoneNo: val.phoneNo,
              department:
                val.department ||
                (val.officeDepartmentDesignationUserDaoLst &&
                  val.officeDepartmentDesignationUserDaoLst[0]?.departmentId),
              // department: val?.department
              //   ? val?.department
              //   : val.officeDepartmentDesignationUserDaoLst[0]?.departmentId,
            };
          })
        );
        setLoading(false);
      })
      ?.catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const resetValuesCancell = {
    departmentKey: null,
    keyIssueAt: new Date(),
    buildingKey: null,
    zoneKey: null,
    wardKey: null,
    mobileNumber: "",
    employeeKey: null,
    employeeName: "",
    remark: "",
    personReturningKey: true,
  };

  // Disable state variables
  const [isEmployeeNameDisabled, setIsEmployeeNameDisabled] = useState(false);
  const [isMobileNumberDisabled, setIsMobileNumberDisabled] = useState(false);

  const getEmployeeDetails = () => {
    console.log("selectedEmployee EI", employeeId);
    // Filter through employee list to get the selected employee details based on employee id
    let selectedEmployee = employee.filter(
      (item) => item.empCode === employeeId
    );
    console.log("selectedEmployee", selectedEmployee);

    setValue("zoneKey", selectedEmployee[0]?.zoneKey);
    setValue("departmentKey", selectedEmployee[0]?.department);

    if (selectedEmployee[0]?.firstNameEn && selectedEmployee[0]?.lastNameEn) {
      setValue(
        "employeeName",
        selectedEmployee[0]?.firstNameEn + " " + selectedEmployee[0]?.lastNameEn
      );
      setValue("mobileNumber", selectedEmployee[0]?.phoneNo);

      // Disable the fields
      setIsEmployeeNameDisabled(true);
      setIsMobileNumberDisabled(true);
    } else if (
      selectedEmployee[0]?.firstNameEn &&
      !selectedEmployee[0]?.lastNameEn
    ) {
      setValue("employeeName", selectedEmployee[0]?.firstNameEn);
      setValue("mobileNumber", selectedEmployee[0]?.phoneNo);

      // Disable the fields
      setIsEmployeeNameDisabled(true);
      setIsMobileNumberDisabled(true);
    } else if (
      !selectedEmployee[0]?.firstNameEn &&
      !selectedEmployee[0]?.lastNameEn
    ) {
      sweetAlert(
        language == "en" ? "Error ?" : "त्रुटी!",

        language == "en" ? "Employee Not found!" : "कर्मचारी स्थापन नाही!",
        "error"
      );
      setValue("employeeName", "");
      setValue("mobileNumber", "");

      // Enable the fields
      setIsEmployeeNameDisabled(false);
      setIsMobileNumberDisabled(false);
    }

    // setValue("employeeKey", selectedEmployee[0]?.firstNameEn + " " + selectedEmployee[0]?.lastNameEn);
  };

  const getAllVisitors = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.SMURL}/trnDepartmentKeyInOut/getAll`, {
        // .get(`http://192.168.68.125:9010/sm/api/trnDepartmentKeyInOut/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        let result = r.data.trnDepartmentKeyInOutList;
        setTempData(result);
        console.log("result1", result);
        let _res = result?.map((r, i) => {
          return {
            ...r,
            departmentKey: departments?.find(
              (obj) => obj?.id === r?.departmentKey
            )?.department
              ? departments?.find((obj) => obj?.id === r?.departmentKey)
                  ?.department
              : "-",
            deptKey: r?.departmentKey,
            // employeeName: employee?.find((obj) => obj?.id === r?.employeeKey)?.firstNameEn
            //   ? employee?.find((obj) => obj?.id === r?.employeeKey)?.firstNameEn +
            //     " " +
            //     employee?.find((obj) => obj?.id === r?.employeeKey)?.lastNameEn
            //   : "-",
            employeeName: r.employeeName,
            employeeKey: r.employeeKey,
            id: r.id,
            keyIssueAt: r.keyIssueAt
              ? moment(r.keyIssueAt).format("DD-MM-YYYY hh:mm A")
              : "-",
            kIA: r?.keyIssueAt,
            keyReceivedAt: r.keyReceivedAt
              ? moment(r.keyReceivedAt).format("DD-MM-YYYY hh:mm A")
              : "-",
            keyStatus: r.keyStatus,
            mobileNumber: r.mobileNumber,
            subDepartmentKey: r.subDepartmentKey,
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            visitorStatus: r.visitorStatus === "I" ? "In" : "Out",
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            ward: r?.wardKey,
            zone: r?.zoneKey,
            wardKey: r?.wardKey
              ? wardKeys?.find((obj) => {
                  return obj?.id == r.wardKey;
                })?.wardName
              : "-",
            zoneKey: r?.zoneKey
              ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              : "-",
            issueNo: r?.issueNo,
            departmentOfEmployee: r?.departmentOfEmployee,
          };
        });
        // setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const columns = [
    {
      field: "srNo",
      // headerName: "Sr No",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "issueNo",
      // headerName: "Sr No",
      headerName: <FormattedLabel id="issueNo" />,
      flex: 0.4,
      headerAlign: "center",
    },

    {
      hide: false,
      field: "zoneKey",
      headerName: <FormattedLabel id="zone" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "wardKey",
      headerName: <FormattedLabel id="ward" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: <FormattedLabel id="deptName" />,
      minWidth: 220,
      headerAlign: "center",
    },
    // {
    //   hide: false,
    //   field: "employeeKey",
    //   headerName: "Employee Key",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      hide: false,
      field: "employeeName",
      headerName: <FormattedLabel id="employeeName" />,
      flex: 1.3,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyIssueAt",
      headerName: <FormattedLabel id="keyIssueAt" />,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyReceivedAt",
      headerName: <FormattedLabel id="keyReceivedAt" />,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyStatus",
      headerName: <FormattedLabel id="keyStatus" />,
      flex: 1,
      maxWidth: 100,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "mobileNumber",
      headerName: <FormattedLabel id="mobile" />,
      flex: 1,
      maxWidth: 100,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "subDepartmentKey",
      headerName: "Sub Department Key",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "departmentOfEmployee",
      headerName: <FormattedLabel id="employeeDepartment" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {(authority?.includes("HOD") || authority?.includes("ENTRY")) && (
              <>
                {params.row.keyStatus == "Key Issued" && (
                  <Tooltip
                    title={
                      language == "en" ? "Receive Key" : "चावी प्राप्त करा"
                    }
                  >
                    <IconButton
                      onClick={() => {
                        handleOpen(params);
                      }}
                    >
                      <KeyOffIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                )}
                {params?.row?.isAuthorityLetterPending == true ? (
                  <Tooltip
                    title={
                      language == "en"
                        ? "Upload Authority Letter"
                        : "अधिकार पत्र अपलोड करा"
                    }
                  >
                    <IconButton
                      onClick={() => {
                        handleOpenAuthority(params?.row);
                      }}
                    >
                      <UploadFileIcon style={{ color: "black" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ""
                )}
                {params?.row?.authorityLetter && (
                  <Tooltip
                    title={
                      language == "en"
                        ? "View Authority Letter"
                        : "अधिकार पत्र पहा"
                    }
                  >
                    <IconButton
                      onClick={async () => {
                        // window.open(
                        //   `${urls.CFCURL}/file/preview?filePath=${params?.row?.authorityLetter}`,
                        //   "_blank"
                        // );

                        console.log(
                          "filePath123",
                          params?.row?.authorityLetter?.includes(".pdf")
                        );

                        const DecryptPhoto = await DecryptData(
                          "passphraseaaaaaaaaupload",
                          params?.row?.authorityLetter
                        );

                        const ciphertext = await EncryptData(
                          "passphraseaaaaaaapreview",
                          DecryptPhoto
                        );

                        const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
                        axios
                          .get(url, {
                            headers: { Authorization: `Bearer ${token}` },
                          })
                          .then((r) => {
                            console.log("r", r);
                            if (r?.data?.mimeType == "application/pdf") {
                              const byteCharacters = atob(r?.data?.fileName);
                              const byteNumbers = new Array(
                                byteCharacters.length
                              );
                              for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                              }
                              const byteArray = new Uint8Array(byteNumbers);
                              const blob = new Blob([byteArray], {
                                type: "application/pdf",
                              });
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

                        // if (params?.row?.authorityLetter?.includes(".pdf")) {
                        //   const url = `${urls.CFCURL}/file/preview?filePath=${params?.row?.authorityLetter}`;

                        //   axios
                        //     .get(url, {
                        //       headers: {
                        //         Authorization: `Bearer ${token}`,
                        //       },
                        //       responseType: "arraybuffer",
                        //     })
                        //     .then((response) => {
                        //       if (
                        //         response &&
                        //         response.data instanceof ArrayBuffer
                        //       ) {
                        //         const pdfBlob = new Blob([response.data], {
                        //           type: "application/pdf",
                        //         });
                        //         const pdfUrl = URL.createObjectURL(pdfBlob);

                        //         const newTab = window.open();
                        //         newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
                        //       } else {
                        //         console.error(
                        //           "Invalid or missing data in the response"
                        //         );
                        //       }
                        //     })
                        //     .catch((error) => {
                        //       console.error(
                        //         "Error fetching or displaying PDF:",
                        //         error
                        //       );
                        //     });
                        // } else {
                        //   const url = ` ${urls.CFCURL}/file/previewNew?filePath=${params?.row?.authorityLetter}`;

                        //   axios
                        //     .get(url, {
                        //       headers: {
                        //         Authorization: `Bearer ${token}`,
                        //       },
                        //     })
                        //     .then((r) => {
                        //       console.log("ImageApi21312", r?.data);
                        //       const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
                        //       const newTab = window.open();
                        //       newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
                        //     })
                        //     .catch((error) => {
                        //       console.log("CatchPreviewApi", error);
                        //       callCatchMethod(error, language);
                        //     });
                        // }
                      }}
                    >
                      <TvIcon style={{ color: "black" }} />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={language == "en" ? "View Form" : "फॉर्म पहा"}>
                  <IconButton
                    onClick={async () => {
                      // handleOpen(params);
                      console.log("openForm", params.row);
                      if (params?.row?.departmentPersonPhoto != null) {
                        const DecryptPhoto = await DecryptData(
                          "passphraseaaaaaaaaupload",
                          params?.row?.departmentPersonPhoto
                        );

                        const ciphertext = await EncryptData(
                          "passphraseaaaaaaapreview",
                          DecryptPhoto
                        );

                        const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
                        const response = await axios.get(url, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });

                        const imageUrl = `data:image/png;base64,${response?.data?.fileName}`;
                        setImageSrc(imageUrl);
                      } else {
                        setImageSrc("");
                      }
                      setDisabledData(params.row);
                      setOpenForm(true);
                    }}
                  >
                    <VisibilityIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        );
      },
    },
  ];

  const handleUploadAuthority = () => {
    let body;

    let tmepAuthorityData = tempData?.find(
      (item) => item.id == authorityData.id
    );

    if (watch("authorityLetter1")) {
      body = {
        ...tmepAuthorityData,
        // authorityLetter: watch("authorityLetter1"),
        authorityLetter: encryptedFileNameToSend,
      };

      console.log("body123", body);
      axios
        .post(
          `${urls.SMURL}/trnDepartmentKeyInOut/save`,
          {
            ...body,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language == "en" ? "Updated!" : "अपडेट केले!",

              language == "en"
                ? "The Authority Letter was Updated successfully "
                : "प्राधिकरण पत्र यशस्वीरित्या अपडेट केले गेले",

              "success"
            );
            setValue("authorityLetter1", null);
            handleCloseAuthority();
            getAllVisitors();
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    } else {
      console.log("erlse");
      toast(
        language == "en"
          ? "Please Upload Authority Letter First"
          : "कृपया प्रथम अधिकार पत्र अपलोड करा",
        {
          type: "error",
        }
      );
    }
  };

  const onSubmitForm = (formData, btnType) => {
    console.log("formData", formData);

    // Save - DB
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      console.log("save");
      _body = {
        ...formData,
        departmentKey: Number(formData?.departmentKey),
        employeeKey: String(employeeId),
        employeeName: formData?.employeeName,
        // employeeName: employee?.find((obj) => obj?.id === formData?.employeeKey)?.firstNameEn,
        wardKey: Number(formData?.wardKey),
        zoneKey: Number(formData?.zoneKey),
        buildingName: Number(formData?.buildingName),
        keyIssueAt: moment(formData?.keyIssueAt).format("YYYY-MM-DDTHH:mm:ss"),
        fingerPrint: base64String,
        isHoliday: formData.isHoliday == "true" ? true : false,
        authorityLetter: encryptedFileNameToSend,
        departmentPersonPhoto: encryptedFileNameToSendDeptPerson,
        contractorPersonPhoto: encryptedFileNameToSendContractorPerson,
      };
    } else {
      _body = {
        ...formData,
        id: formData?.id,
        departmentKey: formData?.deptKey,
        employeeKey: String(employeeId),
        employeeName: formData?.employeeName,
        // employeeName: employee?.find((obj) => obj?.id === formData?.employeeKey)?.firstNameEn,
        keyReceivedAt: moment(watch("keyReceivedAt")).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        keyIssueAt: moment(formData?.kIA).format("YYYY-MM-DDTHH:mm:ss"),
        // keyIssueAt: formData?.kIA,
        // keyIssueAt: formData?.keyIssueAt,
        keyStatus: "key Received",
        wardKey: formData?.ward,
        zoneKey: formData?.zone,
        fingerPrint: fingerPrintImg,
        isHoliday: formData.isHoliday == "true" ? true : false,
        // personReturningKey: watch("personReturningKey"),
        empIdReturningKey:
          watch("personReturningKey") == true
            ? String(employeeId)
            : watch("empIdReturningKey"),
        employeeNameReturningKey:
          watch("personReturningKey") == true
            ? formData?.employeeName
            : watch("employeeNameReturningKey"),
        mobileNumberReturningKey:
          watch("personReturningKey") == true
            ? formData?.mobileNumber
            : watch("mobileNumberReturningKey"),
        keyReturningPersonPhotoToSend: formData?.departmentPersonPhoto,
      };
      console.log("update", formData, _body);
    }

    if (btnSaveText === "Save" && btnType !== "Checkout") {
      console.log("1", _body);
      const tempData = axios
        .post(
          `${urls.SMURL}/trnDepartmentKeyInOut/save`,
          {
            ..._body,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("eres", res);
          if (res.status == 201) {
            if (res.data.status == "409 CONFLICT") {
              sweetAlert(
                language == "en" ? "Already Issued" : "आधीच जारी!",
                language == "en"
                  ? "Key is Already Issued"
                  : "चावी आधीच जारी केली आहे",
                "error"
              );
            } else {
              sweetAlert(
                language == "en" ? "Saved!" : "जतन केले!",

                language == "en"
                  ? "Record Saved successfully! "
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",

                "success"
              );
              setButtonInputState(false);
              getAllVisitors();
              reset();
              setIsOpenCollapse(false);
              setFetchData(tempData);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
              exitButton();
              setBase64String("");
              setFingerPrintImg("");
            }
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Checkout" || btnType === "Checkout") {
      console.log("2", _body);
      const tempData = axios
        .post(
          `${urls.SMURL}/trnDepartmentKeyInOut/save`,
          {
            ..._body,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language == "en" ? "Saved!" : "जतन केले!",

              language == "en"
                ? "Record Saved successfully! "
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            setButtonInputState(false);
            getAllVisitors();
            reset();
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setOpen(false);
            exitButton();
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
  };

  // function capture finger
  const CaptureFinger = () => {
    // call http request using axios

    var MFS100Request = {
      Quality: 0,
      TimeOut: 100,
    };
    var jsondata = JSON.stringify(MFS100Request);

    axios
      .post(`http://localhost:8004/mfs100/capture`, jsondata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("r", r);
        const url = "data:image/bmp;base64," + r.data.BitmapData;
        let _file;
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            _file = new File([blob], "fingerprint.png", { type: "image/png" });
            console.log("loglog", _file);
            let formData = new FormData();
            formData.append("file", _file);
            formData.append("appName", appName);
            formData.append("serviceName", serviceName);
            axios
              .post(`${urls.CFCURL}/file/upload`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((r) => {
                let f = r.data.filePath;
                console.log("fff34", f);
              });
          });

        setBase64String("data:image/bmp;base64," + r.data.BitmapData);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const handleUploadDocument = (path) => {
    setValue("authorityLetter", path);
  };

  const handleUploadDocument1 = (path) => {
    setValue("authorityLetter1", path);
  };

  const handleGetName = (e) => {
    console.log("e", e);
    setEncryptedFileNameToSend(e);
  };

  const handleGetNameDeptPersonPhoto = (e) => {
    console.log("e", e);
    setEncryptedFileNameToSendDeptPerson(e);
  };

  const handleGetNameKeyReturningPersonPhoto = (e) => {
    console.log("e", e);
    setEncryptedFileNameToSendKeyReturnPerson(e);
  };

  const handleGetNameContractorPhoto = (e) => {
    console.log("e", e);
    setEncryptedFileNameToSendContractorPerson(e);
  };

  const getRowClassName = (params) => {
    const row = params.row;

    // Define your condition here
    if (row.isAuthorityLetterPending == true) {
      console.log("aala re", row.isAuthorityLetterPending);

      return styles.rowBack;
    }

    return "";
  };

  useEffect(() => {
    console.log("isHoliday", typeof watch("isHoliday"), watch("isHoliday"));
  }, [watch("isHoliday")]);

  const handleCaptureImageClicked = (e) => {
    console.log("e", e);
  };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  return (
    <Paper>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box>
            <BreadcrumbComponent />
          </Box>

          <Box
            sx={{
              backgroundColor: "#556CD6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 30,
              padding: "5px",
              // background:
              //   "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <Typography
              style={{
                color: "white",
                fontSize: "19px",
              }}
            >
              <strong>
                {" "}
                <FormattedLabel id="departmentKeyIssue" />
              </strong>
            </Typography>
          </Box>
          <Head>
            <title>Department-Key-Issue</title>
          </Head>
          <div>
            {printData && (
              <ComponentToPrintDeptKeyIssue
                ref={componentRef}
                data={printData}
              />
            )}
          </div>
          {isOpenCollapse ? (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                sx={{ width: "45%" }}
                fullWidth
                id="outlined-basic"
                label="Employee Id"
                size="small"
                variant="outlined"
                {...register("employeeId")}
                error={!!errors.employeeId}
                helperText={
                  errors?.employeeId ? errors.employeeId.message : null
                }
              />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  searchEmployeeDetails(watch("employeeId"));
                }}
              >
                Search Emploee Details
              </Button>
            </Grid>
          </Grid> */}
                <Grid
                  container
                  sx={{ padding: "10px", justifyContent: "center" }}
                >
                  <Grid item xs={6}>
                    <Controller
                      name="isHoliday"
                      control={control}
                      defaultValue="false"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          defaultValue="false"
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label={<FormattedLabel id="holiday" />}
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label={<FormattedLabel id="workingDay" />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ padding: "10px", justifyContent: "center" }}
                >
                  <Grid item xs={6}>
                    <Controller
                      name="employeeType"
                      control={control}
                      defaultValue="government_employee"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          defaultValue="government_employee"
                        >
                          <FormControlLabel
                            value="government_employee"
                            control={<Radio />}
                            label={<FormattedLabel id="governmentEmployee" />}
                          />
                          <FormControlLabel
                            value="contractor_employee"
                            control={<Radio />}
                            label={<FormattedLabel id="contractorEmployee" />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6}>
                    <Controller
                      name="key_issue_no"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="keyIssueNo" required />}
                          // label="Key Issue No"
                          fullWidth
                          disabled
                          value={nextEntryNumber}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ width: "90%" }}
                          size="small"
                          // error={errors.key_issue_no}
                          // helperText={errors.key_issue_no ? errors.key_issue_no.message : null}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.keyStatus}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentKeyStatus" required />
                      </InputLabel>
                      <Controller
                        defaultValue="Key Issued"
                        name="keyStatus"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value}
                            fullWidth
                            disabled
                            label={
                              <FormattedLabel
                                id="departmentKeyStatus"
                                required
                              />
                            }
                          >
                            <MenuItem value={"Key Received"}>
                              Key Received
                            </MenuItem>
                            <MenuItem value={"Key Issued"}>Key Issued</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Employee Id */}
                {watch("employeeType") != "contractor_employee" ? (
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <TextField
                        sx={{ width: "90%" }}
                        fullWidth
                        InputLabelProps={{
                          shrink: employeeId ? true : false,
                        }}
                        id="outlined-basic"
                        label={<FormattedLabel id="employeeId" />}
                        size="small"
                        defaultValue=""
                        variant="outlined"
                        {...register("empId")}
                        onChange={(e) => {
                          // Set Employee Id

                          if (e.target.value.length === 0) {
                            setEmployeeId(null);
                            clearErrors("empId");
                          } else if (isNaN(parseFloat(e.target.value))) {
                            setError("empId", {
                              type: "manual",
                              message: "Employee Id must be number",
                            });
                          } else {
                            clearErrors("empId");
                            setEmployeeId(e.target.value);
                          }
                        }}
                        error={errors.empId}
                        helperText={errors.empId ? errors.empId.message : null}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {/* add a button and call function to get employee details */}
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!employeeId}
                        onClick={() => {
                          // setEmpDetails(!empDetails);
                          getEmployeeDetails();
                        }}
                      >
                        <FormattedLabel id="getEmployeeDetails" />
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6}>
                    {/* {watch("isDepartmentUser") === "department_user" ? ( */}
                    {/* <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.employeeKey}>
                      <InputLabel shrink id="demo-simple-select-standard-label">
                        <FormattedLabel id="employeeName" required />
                      </InputLabel>
                      <Controller
                        name="employeeKey"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value}
                            InputLabelProps={
                              {
                                // style: { fontSize: 15 },
                                //true
                                // shrink: watch("employeeKey") ? true : false,
                              }
                            }
                            fullWidth
                            label={<FormattedLabel id="employeeName" required />}
                            size="small"
                          >
                            {employee.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.firstNameEn + " " + item.lastNameEn}>
                                  {item.firstNameEn + " " + item.lastNameEn}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText>
                        {errors.employeeKey ? errors.employeeKey.message : null}
                      </FormHelperText>
                    </FormControl> */}
                    {/* ) : (
                      <TextField
                        sx={{ width: "90%" }}
                        fullWidth
                        id="outlined-basic"
                        label={<FormattedLabel id="otherPersonName" required />}
                        size="small"
                        variant="outlined"
                        {...register("employeeKey")}
                      />
                    )} */}

                    <Controller
                      name="employeeName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="employeeName" required />}
                          InputLabelProps={{
                            shrink: watch("employeeName") ? true : false,
                          }}
                          size="small"
                          fullWidth
                          disabled={isEmployeeNameDisabled}
                          sx={{
                            width: "90%",
                          }}
                          error={errors.employeeName}
                          helperText={
                            errors.employeeName
                              ? errors.employeeName.message
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="mobile" required />}
                          InputLabelProps={{
                            shrink: watch("mobileNumber") ? true : false,
                          }}
                          inputProps={{
                            maxLength: 10,
                          }}
                          size="small"
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          disabled={isMobileNumberDisabled}
                          error={errors.mobileNumber}
                          helperText={
                            errors.mobileNumber
                              ? errors.mobileNumber.message
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>

                  {/* <Box>
                    <Fingerprint
                      base64String={base64String}
                      setFingerPrintImg={setFingerPrintImg}
                      setBase64String={setBase64String}
                      appName={appName}
                      serviceName={serviceName}
                    />
                  </Box> */}
                </Grid>

                {/* {watch('employeeType') != "contractor_employee" ? (
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <Controller
                        name="departmentOfEmployee"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            disabled
                            {...field}
                            label={<FormattedLabel id="employeeDepartment" />}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            size="small"
                            fullWidth
                            sx={{
                              width: "90%",
                            }}
                            error={errors.departmentOfEmployee}
                            helperText={errors.departmentOfEmployee ? errors.departmentOfEmployee.message : null}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                ) : ""} */}
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      // required
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.zoneKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="zoneName" required />
                      </InputLabel>
                      <Controller
                        name="zoneKey"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              getFilterWards(value);
                            }}
                            fullWidth
                            label={<FormattedLabel id="zoneName" required />}
                          >
                            {zoneKeys.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.zoneName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.zoneKey ? errors.zoneKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.wardKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="wardName" required />
                      </InputLabel>
                      <Controller
                        name="wardKey"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value}
                            disabled={!watch("zoneKey")}
                            fullWidth
                            label={<FormattedLabel id="wardName" required />}
                          >
                            {wardKeys.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.wardId}>
                                  {item.wardName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.wardKey ? errors.wardKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={6} item>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentName" required />
                      </InputLabel>
                      <Controller
                        name="departmentKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            fullWidth
                            label={
                              <FormattedLabel id="departmentName" required />
                            }
                          >
                            {departments?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.department}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText>
                        {errors.departmentKey
                          ? errors.departmentKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.buildingName}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="buildingName" required />
                      </InputLabel>
                      <Controller
                        name="buildingName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            fullWidth
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                          >
                            {buildings?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.buildingName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.buildingName
                          ? errors.buildingName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ padding: "10px", justifyContent: "center" }}
                >
                  <Grid item xs={6}>
                    <Controller
                      name="departmentKeyType"
                      control={control}
                      defaultValue="Department Key"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          defaultValue="Department Key"
                        >
                          <FormControlLabel
                            value="Department Key"
                            control={<Radio />}
                            label={<FormattedLabel id="ownedKey" />}
                          />
                          <FormControlLabel
                            value="Other Key"
                            control={<Radio />}
                            label={<FormattedLabel id="otherKey" />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid>
                {watch("departmentKeyType") == "Other Key" ? (
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.otherDepartmentKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="otherDepartment" required />
                        </InputLabel>
                        <Controller
                          name="otherDepartmentKey"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // {...field}
                              onChange={(value) => field.onChange(value)}
                              value={field.value}
                              fullWidth
                              label={
                                <FormattedLabel id="otherDepartment" required />
                              }
                            >
                              {otherDepartmentList?.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.id}>
                                    {item.otherDepartment}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.otherDepartmentKey
                            ? errors.otherDepartmentKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}

                {watch("otherDepartmentKey") == 49 ||
                watch("isHoliday") == "true" ? (
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <Typography>
                        <FormattedLabel id="authorityLetter" />
                      </Typography>
                      <Box>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          filePath={(path) => {
                            handleUploadDocument(path);
                          }}
                          fileName={
                            getValues("authorityLetter.png") &&
                            "authorityLetter.png"
                          }
                          fileNameEncrypted={(path) => {
                            handleGetName(path);
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6}>
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      // error={!!errors.keyIssueAt}
                      fullWidth
                    >
                      <Controller
                        name="keyIssueAt"
                        control={control}
                        defaultValue={new Date()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              {...field}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  // error={!!errors.keyIssueAt}
                                  // label="Dept Key Issued Date"
                                  label={
                                    <FormattedLabel id="keyIssueAt" required />
                                  }
                                  size="small"
                                  fullWidth
                                  sx={{ width: "90%" }}
                                />
                              )}
                              label={
                                <FormattedLabel id="keyIssueAt" required />
                              }
                              value={field.value}
                              minDateTime={moment(new Date())}
                              // onChange={(date) => field.onChange(date)}
                              onChange={(event) => {
                                field.onChange(event);
                                setKeyIssueAt(event);
                              }}
                              // defaultValue={new Date()}
                              inputFormat="DD-MM-YYYY hh:mm:ss"
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {/* {errors?.keyIssueAt ? errors.keyIssueAt.message : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {console.log("watch", watch("employeeType"))}
                  {watch("employeeType") == "government_employee" ? (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <Typography>
                        {" "}
                        <FormattedLabel id="departmentPersonPhoto" />
                      </Typography>
                      <Box>
                        <UploadButtonThumbOP
                          appName={appName}
                          fileName={"departmentPersonPhoto.png"}
                          serviceName={serviceName}
                          fileDtl={getValues("departmentPersonPhoto")}
                          fileKey={"departmentPersonPhoto"}
                          showDel={
                            pageMode != "DEPARTMENT KEY ISSUE" ? false : true
                          }
                          handleCaptureImageClicked={handleCaptureImageClicked}
                          fileNameEncrypted={(path) => {
                            handleGetNameDeptPersonPhoto(path);
                          }}
                        />
                      </Box>
                    </Grid>
                  ) : (
                    ""
                  )}
                  {watch("employeeType") == "contractor_employee" ? (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <Typography>
                        {" "}
                        <FormattedLabel id="contractorPersonPhoto" />
                      </Typography>
                      <Box>
                        <UploadButtonThumbOP
                          appName={appName}
                          fileName={"contractorPersonPhoto.png"}
                          serviceName={serviceName}
                          fileDtl={getValues("contractorPersonPhoto")}
                          fileKey={"contractorPersonPhoto"}
                          showDel={
                            pageMode != "DEPARTMENT KEY ISSUE" ? false : true
                          }
                          fileNameEncrypted={(path) => {
                            handleGetNameContractorPhoto(path);
                          }}
                        />
                      </Box>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  {/* <Grid item xs={6}>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="mobile" required />}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          error={errors.mobileNumber}
                          helperText={errors.mobileNumber ? errors.mobileNumber.message : null}
                        />
                      )}
                    />
                  </Grid> */}
                  <Grid item xs={6}>
                    <Controller
                      name="remark"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="remark" />}
                          fullWidth
                          sx={{ width: "90%" }}
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                {/* <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Controller
                      name="isDepartmentUser"
                      control={control}
                      defaultValue="department_user"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          defaultValue="department_user"
                        >
                          <FormControlLabel
                            value="department_user"
                            control={<Radio />}
                            label={<FormattedLabel id="departmentUser" />}
                          />
                          <FormControlLabel
                            value="other_user"
                            control={<Radio />}
                            label={<FormattedLabel id="otherUser" />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid> */}

                <Grid container sx={{ padding: "10px" }}>
                  {/* <Grid item xs={6}>
                    {watch("isDepartmentUser") === "department_user" ? (
                      <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.employeeKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="employeeName" required />
                        </InputLabel>
                        <Controller
                          name="employeeKey"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value}
                              fullWidth
                              label={<FormattedLabel id="employeeName" required />}
                              size="small"
                            >
                              {employee.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.firstNameEn + " " + item.lastNameEn}>
                                    {item.firstNameEn + " " + item.lastNameEn}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors.employeeKey ? errors.employeeKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    ) : (
                      <TextField
                        sx={{ width: "90%" }}
                        fullWidth
                        id="outlined-basic"
                        label={<FormattedLabel id="otherPersonName" required />}
                        size="small"
                        variant="outlined"
                        {...register("employeeKey")}
                      />
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="mobile" required />}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          error={errors.mobileNumber}
                          helperText={errors.mobileNumber ? errors.mobileNumber.message : null}
                        />
                      )}
                    />
                  </Grid> */}
                  {watch("employeeType") != "contractor_employee" ? (
                    <Box>
                      <Fingerprint
                        base64String={base64String}
                        setFingerPrintImg={setFingerPrintImg}
                        setBase64String={setBase64String}
                        appName={appName}
                        serviceName={serviceName}
                      />
                    </Box>
                  ) : (
                    ""
                  )}
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      type="submit"
                      color="success"
                    >
                      <FormattedLabel id="save" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() =>
                        reset({
                          ...resetValuesCancell,
                        })
                      }
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => {
                        setIsOpenCollapse(!isOpenCollapse);
                        exitButton();
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          ) : (
            <FormProvider {...methods}>
              {(authority?.includes("HOD") || authority?.includes("ENTRY")) && (
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={10}></Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<AddIcon />}
                      // type='primary'
                      // disabled={buttonInputState}
                      onClick={() => {
                        // reset({
                        //   ...resetValuesExit,
                        // });
                        getNextEntryNumber();
                        setEditButtonInputState(true);
                        setDeleteButtonState(true);
                        setBtnSaveText("Save");
                        // setButtonInputState(true);
                        // setSlideChecked(true);
                        setIsOpenCollapse(!isOpenCollapse);
                      }}
                    >
                      <FormattedLabel id="add" />
                    </Button>
                  </Grid>
                </Grid>
              )}

              <Box>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Box>
                      <FormControl
                        style={{
                          backgroundColor: "white",
                        }}
                        error={!!errors.keyReceivedAt}
                        fullWidth
                      >
                        <Controller
                          name="keyReceivedAt"
                          control={control}
                          defaultValue={new Date()}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                {...field}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={!!errors.keyReceivedAt}
                                    // label="Dept Key Recieved Date"
                                    label={
                                      <FormattedLabel id="deptKeyReceivedDate" />
                                    }
                                    fullWidth
                                    size="small"
                                  />
                                )}
                                label={
                                  <FormattedLabel id="deptKeyReceivedDate" />
                                }
                                // defaultValue={moment(paramsData?.row?.kIA)}
                                value={field.value}
                                minDateTime={moment(paramsData?.row?.kIA)}
                                onChange={(date) => field.onChange(date)}
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.keyReceivedAt
                            ? errors.keyReceivedAt.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                    <Box>
                      <Controller
                        name="personReturningKey"
                        control={control}
                        defaultValue={true}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                defaultChecked={watch("personReturningKey")}
                                onChange={(e) => {
                                  console.log("wwwe", e.target.checked);
                                  field.onChange(e.target.checked);
                                }}
                              />
                            }
                            label="Is the same person returning key who issued it"
                          />
                        )}
                      />
                    </Box>
                    <Box>
                      {!watch("personReturningKey") && (
                        <>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={6}>
                              <TextField
                                sx={{ width: "90%" }}
                                fullWidth
                                InputLabelProps={{
                                  shrink: employeeIdReturningKey ? true : false,
                                }}
                                id="outlined-basic"
                                label={<FormattedLabel id="employeeId" />}
                                size="small"
                                defaultValue=""
                                variant="outlined"
                                {...register("empIdReturningKey")}
                                onChange={(e) => {
                                  // Set Employee Id

                                  if (e.target.value.length === 0) {
                                    setEmployeeId(null);
                                    clearErrors("empIdReturningKey");
                                  } else if (
                                    isNaN(parseFloat(e.target.value))
                                  ) {
                                    setError("empIdReturningKey", {
                                      type: "manual",
                                      message: "Employee Id must be number",
                                    });
                                  } else {
                                    clearErrors("empIdReturningKey");
                                    setEmployeeIdReturningKey(e.target.value);
                                  }
                                }}
                                error={errors.empIdReturningKey}
                                helperText={
                                  errors.empIdReturningKey
                                    ? errors.empIdReturningKey.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid item xs={6}>
                              {/* add a button and call function to get employee details */}
                              <Button
                                variant="contained"
                                color="primary"
                                disabled={!employeeIdReturningKey}
                                onClick={() => {
                                  let selectedEmployee = employee.filter(
                                    (item) =>
                                      item.empCode == watch("empIdReturningKey")
                                  );
                                  console.log("selEmp", selectedEmployee);

                                  if (
                                    selectedEmployee[0]?.firstNameEn &&
                                    selectedEmployee[0]?.lastNameEn
                                  ) {
                                    setValue(
                                      "employeeNameReturningKey",
                                      selectedEmployee[0]?.firstNameEn +
                                        " " +
                                        selectedEmployee[0]?.lastNameEn
                                    );
                                    setValue(
                                      "mobileNumberReturningKey",
                                      selectedEmployee[0]?.phoneNo
                                    );
                                  } else if (
                                    selectedEmployee[0]?.firstNameEn &&
                                    !selectedEmployee[0]?.lastNameEn
                                  ) {
                                    setValue(
                                      "employeeNameReturningKey",
                                      selectedEmployee[0]?.firstNameEn
                                    );
                                    setValue(
                                      "mobileNumberReturningKey",
                                      selectedEmployee[0]?.phoneNo
                                    );
                                  } else if (
                                    !selectedEmployee[0]?.firstNameEn &&
                                    !selectedEmployee[0]?.lastNameEn
                                  ) {
                                    sweetAlert(
                                      language == "en" ? "Error ?" : "त्रुटी!",

                                      language == "en"
                                        ? "Employee Not found!"
                                        : "कर्मचारी स्थापन नाही!",
                                      "error"
                                    );
                                    setValue("employeeName", "");
                                    setValue("mobileNumber", "");
                                  }
                                }}
                              >
                                <FormattedLabel id="getEmployeeDetails" />
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid item xs={6}>
                              <TextField
                                label={
                                  <FormattedLabel id="employeeName" required />
                                }
                                InputLabelProps={{
                                  shrink: watch("employeeNameReturningKey")
                                    ? true
                                    : false,
                                }}
                                {...register("employeeNameReturningKey")}
                                size="small"
                                fullWidth
                                sx={{
                                  width: "90%",
                                }}
                                error={errors.employeeNameReturningKey}
                                helperText={
                                  errors.employeeNameReturningKey
                                    ? errors.employeeNameReturningKey.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                label={<FormattedLabel id="mobile" required />}
                                InputLabelProps={{
                                  shrink: watch("mobileNumberReturningKey")
                                    ? true
                                    : false,
                                }}
                                {...register("mobileNumberReturningKey")}
                                inputProps={{
                                  maxLength: 10,
                                }}
                                size="small"
                                fullWidth
                                sx={{
                                  width: "90%",
                                }}
                                error={errors.mobileNumberReturningKey}
                                helperText={
                                  errors.mobileNumberReturningKey
                                    ? errors.mobileNumberReturningKey.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                              }}
                            >
                              <Typography>
                                {" "}
                                <FormattedLabel id="keyReturningPersonPhoto" />
                              </Typography>
                              <Box>
                                <UploadButtonThumbOP
                                  appName={appName}
                                  fileName={"keyReturningPersonPhoto.png"}
                                  serviceName={serviceName}
                                  fileDtl={getValues("keyReturningPersonPhoto")}
                                  fileKey={"keyReturningPersonPhoto"}
                                  showDel={
                                    pageMode != "DEPARTMENT KEY ISSUE"
                                      ? false
                                      : true
                                  }
                                  handleCaptureImageClicked={
                                    handleCaptureImageClicked
                                  }
                                  fileNameEncrypted={(path) => {
                                    handleGetNameKeyReturningPersonPhoto(path);
                                  }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        padding: "10px",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setBtnSaveText("Checkout");
                          setRowId(paramsData.row.id);

                          if (
                            !watch("personReturningKey") &&
                            !watch("mobileNumberReturningKey") &&
                            !watch("employeeNameReturningKey")
                          ) {
                            setError("mobileNumberReturningKey", {
                              type: "manual",
                              message: "Mobile Number Required",
                            });
                            setError("employeeNameReturningKey", {
                              type: "manual",
                              message: "Employee Name Required",
                            });
                          } else if (
                            !watch("personReturningKey") &&
                            !watch("mobileNumberReturningKey")
                          ) {
                            setError("mobileNumberReturningKey", {
                              type: "manual",
                              message: "Mobile Number Required",
                            });
                          } else if (
                            !watch("personReturningKey") &&
                            !watch("employeeNameReturningKey")
                          ) {
                            setError("employeeNameReturningKey", {
                              type: "manual",
                              message: "Employee Name Required",
                            });
                          } else {
                            onSubmitForm(paramsData.row, "Checkout");
                            clearErrors(
                              "employeeNameReturningKey",
                              "mobileNumberReturningKey"
                            );
                          }
                        }}
                      >
                        <FormattedLabel id="submit" />
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={handleClose}
                      >
                        <FormattedLabel id="close" />
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </Box>
              <Box>
                <Modal
                  open={openAuthority}
                  onClose={handleCloseAuthority}
                  aria-labelledby="modal-modal-title1"
                  aria-describedby="modal-modal-description1"
                >
                  <Box sx={style}>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <Box sx={{ width: "50%" }}>
                          <Typography>
                            <FormattedLabel id="authorityLetter" />
                          </Typography>
                        </Box>
                        <Box sx={{ width: "50%", overflow: "auto" }}>
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            filePath={(path) => {
                              handleUploadDocument1(path);
                            }}
                            fileName={
                              getValues("authorityLetter1.png") &&
                              "authorityLetter1.png"
                            }
                            fileNameEncrypted={(path) => {
                              handleGetName(path);
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            // onSubmitForm(paramsData.row, "Checkout");
                            handleUploadAuthority();
                          }}
                        >
                          <FormattedLabel id="upload" />
                          {/* Upload */}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              </Box>
              <Box>
                <DataGrid
                  // disableColumnFilter
                  // disableColumnSelector
                  // disableToolbarButton
                  // disableDensitySelector
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      // printOptions: { disableToolbarButton: true },
                      // disableExport: true,
                      // disableToolbarButton: true,
                      // csvOptions: { disableToolbarButton: true },
                    },
                  }}
                  autoHeight={data.pageSize}
                  sx={{
                    // marginLeft: 5,
                    // marginRight: 5,
                    // marginTop: 5,
                    // marginBottom: 5,
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
                  // rows={dataSource}
                  // pageSize={5}
                  // rowsPerPageOptions={[5]}
                  //checkboxSelection
                  getRowClassName={(params) => getRowClassName(params)}
                  density="compact"
                  // autoHeight={true}
                  // rowHeight={50}
                  pagination
                  paginationMode="server"
                  // loading={data.loading}
                  rowCount={data.totalRows}
                  rowsPerPageOptions={data.rowsPerPageOptions}
                  page={data.page}
                  pageSize={data.pageSize}
                  rows={data.rows}
                  columns={columns}
                  onPageChange={(_data) => {
                    getAllVisitors(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    // updateData("page", 1);
                    getAllVisitors(_data, data.page);
                  }}
                />
              </Box>
              <Box>
                <Dialog
                  fullWidth
                  open={openForm}
                  onClose={() => setOpenForm(false)}
                >
                  <DialogTitle
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: 600,
                    }}
                  >
                    <FormattedLabel id="departmentKeyIssue" />
                  </DialogTitle>
                  <Divider />
                  <DialogContent>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={6}>
                        <Controller
                          name="isHoliday"
                          control={control}
                          disabled
                          render={({ field }) => (
                            <RadioGroup
                              disabled
                              {...field}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              value={disabledData?.isHoliday}
                            >
                              <FormControlLabel
                                value="true"
                                control={<Radio disabled />}
                                disabled
                                label={<FormattedLabel id="holiday" />}
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="workingDay" />}
                              />
                            </RadioGroup>
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name="employeeType"
                          control={control}
                          defaultValue="government_employee"
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              defaultValue="government_employee"
                              value={disabledData?.employeeType}
                            >
                              <FormControlLabel
                                value="government_employee"
                                control={<Radio disabled />}
                                label={
                                  <FormattedLabel id="governmentEmployee" />
                                }
                              />
                              <FormControlLabel
                                value="contractor_employee"
                                control={<Radio disabled />}
                                label={
                                  <FormattedLabel id="contractorEmployee" />
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={6}>
                        <TextField
                          label={<FormattedLabel id="keyIssueNo" required />}
                          fullWidth
                          disabled
                          value={disabledData?.issueNo}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ width: "90%" }}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label={
                            <FormattedLabel id="departmentKeyStatus" required />
                          }
                          fullWidth
                          disabled
                          value={disabledData?.keyStatus}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ width: "90%" }}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={6}>
                        <TextField
                          label={<FormattedLabel id="employeeName" required />}
                          InputLabelProps={{
                            shrink: disabledData?.employeeName ? true : false,
                          }}
                          value={disabledData?.employeeName}
                          size="small"
                          disabled
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          error={errors.employeeName}
                          helperText={
                            errors.employeeName
                              ? errors.employeeName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label={<FormattedLabel id="mobile" required />}
                          InputLabelProps={{
                            shrink: disabledData?.mobileNumber ? true : false,
                          }}
                          disabled
                          value={disabledData?.mobileNumber}
                          inputProps={{
                            maxLength: 10,
                          }}
                          size="small"
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="zoneName" required />}
                          size="small"
                          disabled
                          value={disabledData?.zoneKey}
                          fullWidth
                          InputLabelProps={{
                            shrink: disabledData?.zoneKey ? true : false,
                          }}
                          sx={{ width: "90%" }}
                        />
                      </Grid>
                      <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="wardName" required />}
                          size="small"
                          disabled
                          value={disabledData?.wardKey}
                          fullWidth
                          InputLabelProps={{
                            shrink: disabledData?.wardKey ? true : false,
                          }}
                          sx={{ width: "90%" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="deptName" />}
                          size="small"
                          fullWidth
                          disabled
                          multiline
                          InputLabelProps={{
                            shrink: disabledData?.departmentName ? true : false,
                          }}
                          value={disabledData?.departmentName}
                          sx={{ width: "90%" }}
                        />
                      </Grid>
                      <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ width: "90%" }}
                          error={errors.buildingName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="buildingName" required />
                          </InputLabel>
                          <Controller
                            name="buildingName"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // {...field}
                                onChange={(value) => field.onChange(value)}
                                value={disabledData?.buildingName}
                                fullWidth
                                disabled
                                label={
                                  <FormattedLabel id="buildingName" required />
                                }
                              >
                                {buildings?.map((item, i) => {
                                  return (
                                    <MenuItem key={i} value={item.id}>
                                      {item.buildingName}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={6}>
                        <Controller
                          name="departmentKeyType"
                          control={control}
                          defaultValue="Department Key"
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              value={disabledData?.departmentKeyType}
                            >
                              <FormControlLabel
                                value="Department Key"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="ownedKey" />}
                              />
                              <FormControlLabel
                                value="Other Key"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="otherKey" />}
                              />
                            </RadioGroup>
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      {disabledData?.otherDepartmentKey != null && (
                        <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{ width: "90%" }}
                            error={errors.otherDepartmentKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="otherDepartment" required />
                            </InputLabel>
                            <Controller
                              name="otherDepartmentKey"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <Select
                                  // {...field}
                                  onChange={(value) => field.onChange(value)}
                                  value={disabledData?.otherDepartmentKey}
                                  fullWidth
                                  disabled
                                  label={
                                    <FormattedLabel
                                      id="otherDepartment"
                                      required
                                    />
                                  }
                                >
                                  {otherDepartmentList?.map((item, i) => {
                                    return (
                                      <MenuItem key={i} value={item.id}>
                                        {item.otherDepartment}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>
                      )}
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="keyIssueAt" required />}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            shrink: disabledData?.keyIssueAt ? true : false,
                          }}
                          disabled
                          value={disabledData?.keyIssueAt}
                          sx={{ width: "90%" }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        xl={6}
                        sx={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        {imageSrc && (
                          <img
                            src={imageSrc}
                            alt="Image"
                            height="100vh"
                            width="150vw"
                          />
                        )}
                        {/* <img
                          src={`${urls.CFCURL}/file/preview?filePath=${
                            disabledData?.departmentPersonPhoto
                              ? disabledData?.departmentPersonPhoto
                              : disabledData?.contractorPersonPhoto
                          }`}
                          alt="123"
                          height="100vh"
                          width="150vw"
                        /> */}
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={6}>
                        <TextField
                          value={disabledData?.remark}
                          disabled
                          label={<FormattedLabel id="remark" />}
                          fullWidth
                          sx={{ width: "90%" }}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => {
                            setOpenForm(false);
                          }}
                        >
                          {<FormattedLabel id="close" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Dialog>
              </Box>
            </FormProvider>
          )}
        </>
      )}
    </Paper>
  );
}
export default DepartmentKeyIssue;
