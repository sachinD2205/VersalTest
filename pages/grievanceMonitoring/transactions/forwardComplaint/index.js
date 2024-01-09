import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import ForwardIcon from "@mui/icons-material/Forward";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import {  Visibility } from "@mui/icons-material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import forwardComplaintSchema from "../../../../containers/schema/grievanceMonitoring/TransactionsSchema's/forwardComplaintSchema";
import theme from "../../../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { EncryptData,DecryptData } from "../../../../components/common/EncryptDecrypt";
import commonStyles from '../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css'
const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(forwardComplaintSchema),
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
  const [areaId, setAreaId] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [OfficeLocationName, setOfficeLocationName] = useState([]);
  const [complaintTypes, setcomplaintTypes] = useState([]);
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const [showForwrdGr, setShowForwrdGr] = useState(false);
  const [grievanceIdd, setGrievanceIdd] = useState(null);
  const router = useRouter();
  const [dependDept, setDependDept] = useState([]);
  const language = useSelector((state) => state?.labels?.language);
  const [document, setDocument] = useState([]);
  const [deptDoc, setDeptDoc] = useState([]);
  // userToken
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const logedInUser = localStorage.getItem("loggedInUser");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchData, setFetchData] = useState(null);
  const headers = { Authorization: `Bearer ${userToken}` };
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // Get Table - Data
  const getAllAmenities = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.GM}/trnRegisterComplaint/getByApplicationId?applicationNo=${(router?.query?.id)?.replaceAll('+','%2b')}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data;
        setFetchData(result);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };
  useEffect(() => {
    if (fetchData != null) setDataImageonUi();
  }, [fetchData, allWards,
    allZones,
    areaId,
    OfficeLocationName,
    departments,]);

  let setDataImageonUi = () => {
    const result = fetchData;
    let res = [];
    if (result?.trnAttacheDocumentDtos != 0) {
      result?.trnAttacheDocumentDtos?.map((obj, index) => {
        if (obj.transactionType === "ROC" || obj.transactionType === "RC") {
          return res.push({
            id: index + 1,
            originalFileName: obj.originalFileName,
            documentType: obj.documentType,
            filePath: obj.filePath,
            attachedDate1:
              logedInUser === "departmentUser"
                ? moment(obj.attachedDate).format("DD-MM-YYYY HH:mm:ss")
                : moment(obj.attachedDate).format("DD-MM-YYYY"),
            transactionType:
              obj.transactionType === "ROC" ? "Reopen" : "Register",
          });
        }
      });

      let res1 = [];
      result?.trnAttacheDocumentDtos?.map((obj, index) => {
        if (obj.transactionType === "CC") {
          return res1.push({
            id: index + 1,
            originalFileName: obj.originalFileName,
            documentType: obj.documentType,
            filePath: obj.filePath,
            attachedDate1:
              logedInUser === "departmentUser"
                ? moment(obj.attachedDate).format("DD-MM-YYYY HH:mm:ss")
                : moment(obj.attachedDate).format("DD-MM-YYYY"),
            transactionType: "Close",
          });
        }
      });
      setDeptDoc(res1);
      setDocument(res);
    } else {
      setDocument([]);
      setDeptDoc([]);
    }
  };

  useEffect(() => {
    if (fetchData != null) {
      let result = fetchData;
      setValue("grievanceRaiseDate", result?.createDtTm);
      setValue("grievanceId", result?.applicationNo);
      setValue(
        "complaintStatusText",
         (result.reopenCount>0 && result.complaintStatusText ==='Open')?language === "en"
         ?"Reopen":'पुन्हा उघडले' : language === "en"?result.complaintStatusText: result.complaintStatusTextMr
      );
      setValue("board", result?.location);
      setValue("complaintDescription", result?.complaintDescription);
      setValue("complaintType", result?.complaintType);
      setValue("uploadedDocumentAll", result?.trnAttacheDocumentDtos);
      setValue("areaKey", result?.areaKey);
      setValue("wardKey", result?.wardKey);
      setValue("zoneKey", result?.zoneKey);
      setValue("officeLocation", result?.officeLocation);
      setGrievanceIdd(result.id);
      setValue("loadderState", false);
    }
  }, [fetchData, language]);

  useEffect(() => {
    getDeptByZoneWardOffice();
  }, [watch("zoneKey") && watch("wardKey") && watch("officeLoation")]);

  const getDeptByZoneWardOffice = () => {
    let body = {
      zone: watch("zoneKey"),
      ward: watch("wardKey"),
      officeLocation: watch("officeLocation"),
    };
    if (
      watch("zoneKey") != null &&
      watch("wardKey") != null &&
      watch("officeLocation")
    ) {
      setIsLoading(true);
      axios
        .post(`${urls.GM}/trnRegisterComplaint/getDepartmentList`, body, {
             headers: headers,
          })
        .then((res) => {
          setIsLoading(false);
          if (res?.status == 200 || res?.status == 201) {
            setDependDept(res.data.sort(sortByProperty("departmentName")));
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
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

  // onSubmitForm
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      id: grievanceIdd !== null ? grievanceIdd : "",
      department: watch("departmentName"),
      subDepartment: watch("subDepartment"),
      complaintTypeId: watch("complaintTypeId"),
      complaintSubTypeId: watch("complaintSubTypeId"),
      employeeName: null,
      transforReason: watch("reply"),
    };

    sweetAlert({
      title: language == "en" ? "Are You Sure" : "तुम्हाला खात्री आहे",
      text:
        language == "en"
          ? "Do You Want To Forward This Grievance?"
          : "तुम्हाला ही तक्रार फॉरवर्ड करायची आहे का?",
      icon: "warning",
      buttons: [
        language == "en" ? "No" : "नाही",
        language == "en" ? "Yes" : "हो",
      ],
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((willDelete) => {
      if (willDelete) {
        setIsLoading(true);
        axios
          .post(
            `${urls.GM}/trnRegisterComplaint/forwordComplaint`,
            finalBodyForApi,
            {
              headers: headers,
            }
          )
          .then((res) => {
            setIsLoading(false);
            if (res.status == 200 || res.status == 201) {
              sweetAlert({
                title: language == "en" ? "Forwarded" : "फॉरवर्ड केले",
                text:
                  language == "en"
                    ? `Complaint Number ${router?.query?.id} Forwarded Successfully !`
                    : `तक्रार क्र. ${router?.query?.id} यशस्वीरित्या फॉरवर्ड केला!`,
                icon: "success",
                dangerMode: false,
                closeOnClickOutside: false,
                button: language == "en" ? "Ok" : "ठीक आहे",
              }).then((will) => {
                if (will) {
                  setShowForwrdGr(true);
                  router.push({
                    pathname:
                      "/grievanceMonitoring/dashboards/deptUserDashboard",
                  });
                }
              });
            }
          })
          .catch((err) => {
            setIsLoading(false);
            cfcErrorCatchMethod(err,false);
            setButtonInputState(false);
          });
      } else {
        sweetAlert(
          language == "en"
            ? "Your Grievance Is Not Forwarded"
            : "तुमची तक्रार फॉरवर्ड केलेली नाही",
          { button: language == "en" ? "Ok" : "ठीक आहे" }
        );
      }
    });
  };

  // getDepartment
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`, {
      headers: headers,
    }).then((res) => {
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
          departmentMr: r.departmentMr,
        }))
      );
    }).catch((err) => {
      setIsLoading(false);
      cfcErrorCatchMethod(err,true);
    });
  };

  // getSubDepartmentDetails
  const getSubDepartmentDetails = () => {
    if (watch("departmentName")) {
      setIsLoading(true);
      axios
        .get(
          `${urls.GM}/master/subDepartment/getAllByDeptWise/${watch(
            "departmentName"
          )}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
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
          setIsLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };
  const getFilePreview = (filePath) => {
    console.log("filePath", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        console.log("Shvani", r);
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
        } else if (r?.data?.mimeType == "video/mp4") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
        <html>
          <body style="margin: 0;">
            <video width="100%" height="100%" controls>
              <source src="${dataUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </body>
        </html>
      `);
        } else if (r?.data?.mimeType == "audio/mpeg") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
  <html>
    <body style="margin: 0;">
      <audio controls>
        <source src="${dataUrl}" type="audio/mpeg">
        Your browser does not support the audio tag.
      </audio>
    </body>
  </html>
`);
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          console.log("dataUrl", dataUrl);
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
  const documentCol = [
    {
      field: "originalFileName",
      headerName: language == "en" ? "Original File Name" : "मूळ फाइल नाव",
      headerAlign: "center",
      align: "center",
      width: "250",
    },
    {
      field: "transactionType",
      headerName: language == "en" ? "Action" : "कृती",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "250",
    },
    {
      field: "documentType",
      headerName: language == "en" ? "File Type" : "दस्तऐवजाचा प्रकार",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "250",
    },
    {
      field: "attachedDate1",
      headerName:
        language == "en" ? "Document Attached Date" : "दस्तऐवज संलग्न तारीख",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "250",
    },
    {
      field: "Action",
      headerName: language == "en" ? "View" : "पहा",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "50",
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
                getFilePreview(record?.row?.filePath)
              }}
            >
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
  ];

  // getComplaintTypes
  const getComplaintTypes = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.GM}/complaintTypeMaster/getByDepId?id=${watch(
          "departmentName"
        )}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let data = res?.data?.complaintTypeMasterList?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          complaintTypeEn: r.complaintType,
          complaintTypeMr: r.complaintTypeMr,
          departmentId: r.departmentId,
          departmentName: r.departmentName,
        }));
        setcomplaintTypes(data.sort(sortByProperty("complaintTypeEn")));
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };

  // getComplaintSubType
  const getComplaintSubType = () => {
    if (watch("complaintTypeId")) {
      setIsLoading(true);
      axios
        .get(
          `${urls.GM}/complaintSubTypeMaster/getAllByCmplId?id=${watch(
            "complaintTypeId"
          )}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
          let data = res?.data?.complaintSubTypeMasterList?.map((r, i) => ({
            id: r.id,
            complaintSubType: r.complaintSubType,
            complaintSubTypeMr: r.complaintSubTypeMr,
            complaintTypeId: r.complaintTypeId,
            categoryKey: r.categoryKey,
            categoryName: r.categoryName,
            categoryNameMr: r.categoryNameMr,
          }));
          setComplaintSubTypes(data.sort(sortByProperty("complaintSubType")));
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };

  // getAllArea
  const getAllArea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll` ,{
        headers: headers,
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAreaId(
            res?.data?.area?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              areaId: r.areaId,
              areaName: r.areaName,
              areaNameMr: r.areaNameMr,
            }))
          );
        } else {
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err,true);
      });
  };

  // getAllZones
  const getAllZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllZones(
            res?.data?.zone?.map((r, i) => ({
              id: r.id,
              zoneName: r.zoneName,
              zoneNameMr: r.zoneNameMr,
            }))
          );
        } else {
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err,true);
      });
  };

  // getAllWards
  const getAllWards = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: headers,
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setAllWards(
            res?.data?.ward?.map((r, i) => ({
              id: i + 1,
              wardName: r?.wardName,
              wardNameMr: r?.wardNameMr,
            }))
          );
        } else {
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err,true);
      });
  };

  // get Office Name
  const gettOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: headers,
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (
            res?.data?.officeLocation != null &&
            res?.data?.officeLocation != undefined &&
            res?.data?.officeLocation.length != 0
          ) {
            setOfficeLocationName(
              res?.data?.officeLocation?.map((r, i) => ({
                id: r?.id,
                officeLocationName: r?.officeLocationName,
                officeLocationNameMar: r?.officeLocationNameMar,
              }))
            );
          } else {
          }
        } else {
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err,true);
      });
  };

  //!  useEffect ====================>
  useEffect(() => {
    getAllWards();
    getAllZones();
    getAllArea();
    gettOfficeLocation();
    getDepartment();
    setValue("documentUploadButtonSachinInputState", false);
    setValue("documentUploadSachinDeleteButtonInputState", false);
    setValue("disabledInputState", false);
  }, []);

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      getAllAmenities();
  }, [ router.query.id,
  ]);

  useEffect(() => {
    setValue("subDepartment", "");
    getSubDepartmentDetails();
  }, [watch("departmentName")]);

  useEffect(() => {
    if (
      watch("grievanceRaiseDate") &&
      watch("grievanceId") &&
      watch("complaintStatusText") &&
      watch("deptName") &&
      watch("subDepartmentText") &&
      watch("complaintType") &&
      watch("complaintDescription")
    ) {
      dataObject = {
        grievanceRaiseDate: watch("grievanceRaiseDate")
          ? watch("grievanceRaiseDate")
          : "",
        grievanceId: watch("grievanceId") ? watch("grievanceId") : "",
        complaintStatusText: watch("complaintStatusText")
          ? watch("complaintStatusText")
          : "",
        deptName: watch("deptName") ? watch("deptName") : "",
        subDepartmentText: watch("subDepartmentText")
          ? watch("subDepartmentText")
          : "",
        complaintType: watch("complaintType") ? watch("complaintType") : "",
        complaintDescription: watch("complaintDescription")
          ? watch("complaintDescription")
          : "",
      };
    }
  }, [
    watch("grievanceRaiseDate"),
    watch("grievanceId"),
    watch("complaintStatusText"),
    watch("deptName"),
    watch("subDepartmentText"),
    watch("complaintType"),
    watch("complaintDescription"),
  ]);
  useEffect(() => {
    if (watch("departmentName")) {
      setValue("complaintTypeId", "");
      setValue("complaintSubTypeId", "");
      getComplaintTypes();
    } else {
      setcomplaintTypes([]);
    }
  }, [watch("departmentName")]);

  useEffect(() => {
    if (watch("departmentName") && watch("complaintTypeId")) {
      getComplaintSubType();
    } else {
      setComplaintSubTypes([]);
    }
  }, [watch("departmentName"), watch("complaintTypeId")]);



  // mainView
  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading ? (
        <CommonLoader />
      ) : (
        <div>
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
              <Grid
                container
                style={{
                  display: "flex",
                  alignItems: "center", // Center vertically
                  width: "100%",
                  height: "auto",
                  overflow: "auto",
                  color: "white",
                  fontSize: "18.72px",
                  borderRadius: 100,
                  fontWeight: 500,
                  background:
                    "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
                }}
              >
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
                    <FormattedLabel id="forwardGrievance" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "1rem",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    {/** GrievanceRiseDatee */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.grievanceRaiseDate}
                      >
                        <Controller
                          control={control}
                          name="grievanceRaiseDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled
                                inputFormat="DD/MM/YYYY H:mm:ss"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="grievanceRaiseDate" />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{}}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    {/** applicationNumber */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        InputLabelProps={{
                          shrink: watch("grievanceId") ? true : false,
                        }}
                        id="outlined-basic"
                        label={
                          language === "en"
                            ? "Complaint Number"
                            : "तक्रार क्र"
                        }
                        variant="standard"
                        {...register("grievanceId")}
                      />
                    </Grid>

                    {/** complaintStatus */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="outlined-basic"
                        InputLabelProps={{
                          shrink: watch("complaintStatusText") ? true : false,
                        }}
                        label={<FormattedLabel id="complaintStatusText" />}
                        {...register("complaintStatusText")}
                      />
                    </Grid>

                    {/** zone */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.zoneKey}
                      >
                        <InputLabel
                          shrink={watch("zoneKey") == null ? false : true}
                          id="demo-simple-select-standard-label"
                        >
                          <FormattedLabel id="zone" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              disabled
                              variant="standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Complaint Type"
                            >
                              {allZones &&
                                allZones?.map((allZones, index) => (
                                  <MenuItem key={index} value={allZones.id}>
                                    {language == "en"
                                      ? allZones?.zoneName
                                      : allZones?.zoneNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zoneKey"
                          control={control}
                          defaultValue={null}
                        />
                      </FormControl>
                    </Grid>

                    {/** ward */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.wardKey}
                      >
                        <InputLabel
                          shrink={watch("wardKey") == null ? false : true}
                          id="demo-simple-select-standard-label"
                        >
                          <FormattedLabel id="ward" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              variant="standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Complaint Type"
                            >
                              {allWards &&
                                allWards?.map((allWards, index) => (
                                  <MenuItem key={index} value={allWards.id}>
                                    {language == "en"
                                      ? allWards?.wardName
                                      : allWards?.wardNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="wardKey"
                          control={control}
                          defaultValue={null}
                        />
                      </FormControl>
                    </Grid>
                    {/** Area */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors?.areaKey}
                      >
                        <InputLabel
                          shrink={watch("areaKey") == null ? false : true}
                          id="demo-simple-select-standard-label"
                        >
                          <FormattedLabel id="area" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              disabled
                              variant="standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Complaint Type"
                            >
                              {areaId &&
                                areaId?.map((areaId, index) => (
                                  <MenuItem key={index} value={areaId.id}>
                                    {language == "en"
                                      ? areaId?.areaName
                                      : areaId?.areaNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="areaKey"
                          control={control}
                          defaultValue={null}
                        />
                      </FormControl>
                    </Grid>

                    {/** officeLocation */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        error={!!errors.officeLocation}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <InputLabel
                          shrink={
                            watch("officeLocation") == null ? false : true
                          }
                          id="demo-simple-select-standard-label"
                        >
                          {language == "en"
                            ? "Office Location"
                            : "कार्यालयाचे स्थान"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              disabled
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={
                                language == "en"
                                  ? "Office Location"
                                  : "कार्यालयाचे स्थान"
                              }
                            >
                              {OfficeLocationName &&
                                OfficeLocationName?.map(
                                  (officeLocationName, index) => (
                                    <MenuItem
                                      key={index}
                                      value={officeLocationName.id}
                                    >
                                      {language == "en"
                                        ? officeLocationName?.officeLocationName
                                        : officeLocationName?.officeLocationNameMar}
                                    </MenuItem>
                                  )
                                )}
                            </Select>
                          )}
                          name="officeLocation"
                          control={control}
                          defaultValue={null}
                        />
                      </FormControl>
                    </Grid>

                    {/** complaint Description */}
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField
                        disabled
                        label={<FormattedLabel id="complaintDescription" />}
                        multiline
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        InputLabelProps={{
                          shrink: watch("complaintDescription") ? true : false,
                        }}
                        id="standard-basic"
                        variant="standard"
                        {...register("complaintDescription")}
                      />
                    </Grid>

                    {/** complaintType */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="complaintType" />}
                        InputLabelProps={{
                          shrink: watch("complaintType") ? true : false,
                        }}
                        variant="standard"
                        {...register("complaintType")}
                      />
                    </Grid>

                    {/** DepartmentName */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.departmentName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="ForwadToDepartmentName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              autoFocus
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label={
                                <FormattedLabel id="departmentName" required />
                              }
                            >
                              {dependDept &&
                                dependDept.map((department, index) => (
                                  <MenuItem key={index} value={department.id}>
                                    {language === "en"
                                      ? department.department
                                      : department.departmentMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="departmentName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.departmentName
                            ? errors.departmentName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/** subDepartmentName */}
                    {subDepartments.length !== 0 ? (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.subDepartment}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="subDepartmentName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={
                                  <FormattedLabel id="subDepartmentName" />
                                }
                              >
                                {subDepartments &&
                                  subDepartments?.map(
                                    (subDepartment, index) => (
                                      <MenuItem
                                        key={index}
                                        value={subDepartment.id}
                                      >
                                        {language === "en"
                                          ? subDepartment.subDepartment
                                          : subDepartment.subDepartment}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="subDepartment"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.subDepartment
                              ? errors.subDepartment.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    ) : (
                      ""
                    )}

                    {/** complaintTypes */}
                    {complaintTypes?.length !== 0 ? (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.complaintTypeId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="complaintTypes" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                autoFocus
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label="Complaint Type"
                              >
                                {complaintTypes &&
                                  complaintTypes.map((complaintType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={complaintType.id}
                                    >
                                      {language == "en"
                                        ? complaintType.complaintTypeEn
                                        : complaintType?.complaintTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="complaintTypeId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.complaintTypeId
                              ? errors.complaintTypeId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    ) : (
                      ""
                    )}

                    {/** complaintSubtypes */}
                    {complaintSubTypes?.length !== 0 ? (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.complaintSubTypeId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="complaintSubTypes" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Sub-Complaint Type"
                              >
                                {complaintSubTypes &&
                                  complaintSubTypes.map(
                                    (complaintSubType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={complaintSubType.id}
                                      >
                                        {complaintSubType.complaintSubType}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="complaintSubTypeId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.complaintSubTypeId
                              ? errors.complaintSubTypeId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "5vh",
                      marginBottom: "5vh",
                    }}
                  >
                    <strong style={{ textDecorationColor: "red", fontSize:'20px' }}>
                      {language == "en"
                        ? " Uploaded Documents Section"
                        : " अपलोड केलेला दस्तऐवज विभाग"}
                    </strong>
                  </div>
                
                {document.length === 0 && deptDoc.length === 0 && (
                      <span
                        style={{
                          color: "red",
                          display: "flex",
                          textAlign:'center',
                          flexDirection: "column",
                        }}
                      >
                        {language == "en"
                          ? "NO DOCUMENTS TO SHOW HERE"
                          : "येथे दर्शविण्यासाठी कोणतेही दस्तऐवज नाहीत"}
                      </span>)}
                   

                      {document.length != 0 && (
                      <>
                        <Box>
                          <Grid
                            container
                            className={commonStyles.title}
                            style={{ marginBottom: "1rem", marginTop: "1rem" }}
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
                                <FormattedLabel id="citizenUploaded" />
                              </h3>
                            </Grid>
                          </Grid>
                        </Box>
                        <div>
                          <DataGrid
                            sx={{
                              overflowY: "scroll",
                              "& .MuiDataGrid-columnHeadersInner": {
                                backgroundColor: "#556CD6",
                                color: "white",
                              },

                              "& .MuiDataGrid-cell:hover": {
                              },
                            }}
                            autoHeight
                            disableSelectionOnClick
                            rows={document || []}
                            columns={documentCol}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                          />
                        </div>
                      </>
                    )}
                    {deptDoc.length != 0 && (
                      <>
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
                                <FormattedLabel id="deptUploaded" />
                              </h3>
                            </Grid>
                          </Grid>
                        </Box>
                        <div>
                          <DataGrid
                            sx={{
                              overflowY: "scroll",
                              marginTop: 2,
                              "& .MuiDataGrid-columnHeadersInner": {
                                backgroundColor: "#556CD6",
                                color: "white",
                              },

                              "& .MuiDataGrid-cell:hover": {
                              },
                            }}
                            autoHeight
                            disableSelectionOnClick
                            rows={deptDoc || []}
                            columns={documentCol}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                          />
                        </div>
                      </>
                    )}
                  {/** Replay */}
                  <Grid
                    container
                    sx={{
                      padding: "1rem",
                    }}
                  >
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        inputProps={{ maxLength: 1000 }}
                        label={<FormattedLabel id="reply" required />}
                        variant="standard"
                        multiline
                        {...register("reply")}
                        error={!!errors.reply}
                        helperText={errors?.reply ? errors.reply.message : null}
                      />
                    </Grid>
                  </Grid>
                  {/**Buttons */}
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      paddingBottom: "5vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="button"
                        variant="contained"
                        color="error"
                        startIcon={<ArrowBackIcon />}
                        // style={{ borderRadius: "20px" }}
                        size="small"
                        onClick={() => {
                          {
                            logedInUser === "departmentUser" &&
                              router.push({
                                pathname:
                                  "/grievanceMonitoring/dashboards/deptUserDashboard",
                              });
                          }
                          {
                            logedInUser === "citizenUser" &&
                              router.push({
                                pathname:
                                  "/grievanceMonitoring/dashboards/citizenUserDashboard",
                              });
                          }
                          {
                            logedInUser === "cfcUser" &&
                              router.push({
                                pathname:
                                  "/grievanceMonitoring/dashboards/cfcUserDashboard",
                              });
                          }
                        }}
                      >
                        <FormattedLabel id="backToDashboard" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        disabled={showForwrdGr}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<ForwardIcon />}
                        // style={{ borderRadius: "20px" }}
                        size="small"
                      >
                        <FormattedLabel id="forwardGrievance" />
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </div>
          </Paper>
        </div>
      )}
    </ThemeProvider>
  );
};
export default Index;
