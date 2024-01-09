import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  ThemeProvider,
  FormControlLabel,
  Checkbox,
  Paper,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Visibility } from "@mui/icons-material";
import Loader from "../../../../containers/Layout/components/Loader/index";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const BachatGatCategory = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({});

  const router = useRouter();
  const loggedUser = localStorage.getItem("loggedInUser");
  const [statusVal, setStatusVal] = useState(null);
  const [zone, setZone] = useState([]);
  const [ward, setWard] = useState([]);
  const [area, setArea] = useState([]);
  const [gatCategory, setGatCategory] = useState([]);
  const [valueData, setValuesData] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [bankMaster, setBankMasters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memberList, setMemberData] = useState([]);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [bgRegId, setId] = useState();
  const language = useSelector((state) => state.labels.language);
  const [cancelReason, setCancelReason] = useState("");
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);
  const [searchType, setSearchType] = useState("applicationNo");
  const [searchValue, setSearchValue] = useState("");
  const [bachatgatNo, setBachatgatNo] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };
  // const headers1 = { Authorization: `Bearer ${user.token}` };

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
    const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
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
    setIsRemarksFilled(cancelReason);
  }, [cancelReason]);

  useEffect(() => {
    getCRAreaName();
    getZoneName();
    getWardNames();
    getBachatGatCategory();
    getBankMasters();
  }, []);

  useEffect(() => {
    if (valueData?.length != 0) {
      setDataOnForm();
    }
  }, [language, valueData]);

  // set reg no on ui
  useEffect(() => {
    // if (router.query.id != null && router.query.id != undefined) {
    setSearchValue(router.query.id);
    setValue("applicationNo", router.query.id);
    setValue("cancelDate", new Date());
    // }
    console.log("router.query.id ", router.query.id);
  }, [router.query.id]);

  const handleRemarkChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    switch (fieldName) {
      case "cancelReason":
        setCancelReason(fieldValue);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (searchType === "bachatgatNo") {
      setValue("application ", router.query.id);
    } else {
      router.query.id != null
        ? setSearchValue(router.query.id)
        : setSearchValue("");
      setBachatgatNo("");
    }
  });

  const handleSearchConnections = () => {
    const formattedSearchValue = watch("applicationNo").trim(); // Remove leading/trailing spaces
    setIsLoading(true);
    if (searchType === "applicationNo") {
      const url = `${urls.BSUPURL}/trnBachatgatRegistration/getByApplicationNo?applicationNo=${formattedSearchValue}`;

      axios
        .get(url, { headers: headers })
        .then((response) => {
          setIsLoading(false);

          setValuesData(response.data);
        })
        .catch((err) => {
          setIsLoading(false);
          setValuesData(null);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      const bbachatgatNo = bachatgatNo.trim();
      const url = `${urls.BSUPURL}/trnBachatgatRegistration/getByBachatGatNo?bachatGatNo=${bbachatgatNo}`;
      axios
        .get(url, { headers: headers })
        .then((response) => {
          setIsLoading(false);
          setValuesData(response.data);
        })
        .catch((err) => {
          setValuesData(null);
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

  // set data on form
  const setDataOnForm = () => {
    if (valueData != undefined) {
      const data = valueData;
      setId(data.id);
      setValue("areaKey", data.areaKey);
      setValue("zoneKey", data.zoneKey);
      setValue("wardKey", data.wardKey);
      setValue(
        "areaName",
        language == "en"
          ? area?.find((obj) => obj.id == data.areaKey)?.areaName
            ? area?.find((obj) => obj.id == data.areaKey)?.areaName
            : "-"
          : area?.find((obj) => obj.id == data.areaKey)?.areaNameMr
          ? area?.find((obj) => obj.id == data.areaKey)?.areaNameMr
          : "-"
      );
      setValue(
        "zoneName",
        language == "en"
          ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneName
            ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneName
            : "-"
          : zone?.find((obj) => obj.id == data.zoneKey)?.zoneNameMr
          ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneNameMr
          : "-"
      );
      setValue(
        "wardname",
        language == "en"
          ? ward?.find((obj) => obj.id == data.wardKey)?.wardName
            ? ward?.find((obj) => obj.id == data.wardKey)?.wardName
            : "-"
          : ward?.find((obj) => obj.id == data.wardKey)?.wardNameMr
          ? ward?.find((obj) => obj.id == data.wardKey)?.wardNameMr
          : "-"
      );
      setValue("geoCode", data.geoCode);
      setValue("bachatgatName", data.bachatgatName);
      setValue(
        "categoryKey",
        language == "en"
          ? gatCategory?.find((obj) => obj.id == data.categoryKey)
              ?.bgCategoryName
            ? gatCategory?.find((obj) => obj.id == data.categoryKey)
                ?.bgCategoryName
            : "-"
          : gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryMr
          ? gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryMr
          : "-"
      );
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
        "bankName",
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

      let res =
        data.trnBachatgatRegistrationMembersList &&
        data.trnBachatgatRegistrationMembersList.map((r, i) => {
          return {
            id: i + 1,
            fullName: r.fullName,
            address: r.address,
            designation: r.designation,
            aadharNumber: r.aadharNumber,
          };
        });
      setMemberData(res);

      let _res = [];
      _res =
        data.trnBachatgatRegistrationDocumentsList &&
        data.trnBachatgatRegistrationDocumentsList.map((r, i) => {
          return {
            id: i + 1,
            filenm:
              r.documentPath &&
              r.documentPath.split("/").pop().split("_").pop(),
            documentType: r.documentType,
            documentPath: r.documentPath,
          };
        });
      _res && setFetchDocuments([..._res]);
    }
  };

  // load zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, { headers: headers })
      .then((res) => {
        let temp = res.data.zone;
        setZone(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load ward
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, { headers: headers })
      .then((res) => {
        let temp = res.data.ward;
        setWard(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios
      .get(`${urls.CfcURLMaster}/area/getAll`, { headers: headers })
      .then((res) => {
        let temp = res.data.area;
        setArea(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load category
  const getBachatGatCategory = () => {
    axios
      .get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstBachatGatCategoryList;
        setGatCategory(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // load bank details
  const getBankMasters = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, { headers: headers })
      .then((r) => {
        setBankMasters(r.data.bank);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

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

  // save cancellation
  const onSubmitForm = (formData) => {
    setIsLoading(true);
    var forceFull = router.query.isForceful;

    const memberList = valueData?.trnBachatgatRegistrationMembersList?.map(
      (obj) => {
        return { ...obj, id: null, trnType: "BGCL" };
        // return obj;
      }
    );

    const docList = valueData.trnBachatgatRegistrationDocumentsList.map(
      (obj) => {
        return { ...obj, id: null, trnType: "BGCL" };
        // return obj;
      }
    );

    let body = [
      {
        ...valueData,
        isDraft: false,
        trnType: "BGCL",
        geoCode: valueData.geoCode,
        cancelReason: watch("cancelReason"),
        cancelDate: watch("cancelDate"),
        bgRegistrationKey: bgRegId,
        status: statusVal,
        trnBachatgatRegistrationMembersList: memberList,
        trnBachatgatRegistrationDocumentsList: docList,
        forcefullyCancelled: router.query.isForceful == "true" ? true : false,
        saSanghatakUserId: null,
        saSanghatakRemark: null,
        saSanghatakDate: null,
        deptClerkUserId: null,
        deptClerkRemark: null,
        deptClerkDate: null,
        asstCommissionerUserId: null,
        asstCommissionerRemark: null,
        asstCommissionerDate: null,
        deptyCommissionerUserId: null,
        deptyCommissionerRemark: null,
        deptyCommissionerDate: null,
        isApproved: false,
        isComplete: false,
        id: null,
      },
    ];
    const tempData = axios
      .post(`${urls.BSUPURL}/trnBachatgatCancellation/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            text:
              language === "en"
                ? ` Your bachatgat cancellation no is : ${
                    res.data.message.split("[")[1].split("]")[0]
                  }`
                : `तुमचे बचतगट रद्दीकरण क्र : ${
                    res.data.message.split("[")[1].split("]")[0]
                  }`,
            icon: "success",
            buttons: [
              language === "en" ? "View Acknowledgement" : "पावती पहा",
              language === "en" ? "Go To Dashboard" : "डॅशबोर्डवर जा",
            ],
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false,
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              {
                // router.push(
                //   "/BsupNagarvasthi/transaction/bachatGatCancellation"
                // );
                router.push("/dashboard");
              }
            } else {
              router.push({
                pathname: "/BsupNagarvasthi/transaction/acknowledgement",
                query: {
                  id: res.data.message.split("[")[1].split("]")[0],
                  trn: "C",
                },
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

  // Doc columns
  const columns2 = [
    {
      field: "documentPath",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      minWidth: 350,
      renderCell: (record) => {
        let naming = record.value
          ?.substring(record.value.lastIndexOf("__") + 2, record.value.length)
          .split(".")[0];
        return <div>{naming}</div>;
      },
    },
    {
      field: "fileType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      flex: 1,
    },

    {
      field: "Action",
      headerName: <FormattedLabel id="view" />,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
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
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
  ];

  // UI
  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
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
                <FormattedLabel id="bachatgatCancellation" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid container spacing={1} sx={{ padding: "1rem" }}>
              <Grid item xs={12} sm={12} md={2} xl={2} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={searchType === "applicationNo"}
                      onChange={() => setSearchType("applicationNo")}
                    />
                  }
                  label={<FormattedLabel id="applicationNo" />}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={2} xl={2} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={searchType === "bachatgatNo"}
                      onChange={() => setSearchType("bachatgatNo")}
                    />
                  }
                  label={<FormattedLabel id="bachatgatNo" />}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={10} xl={10}>
              {searchType === "applicationNo" && (
                <TextField
                  id="standard-textarea"
                  label={language == "en" ? "Application No." : "अर्ज क्र."}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  {...register("applicationNo")}
                  // disabled={router.query.id ? true : false}
                  value={watch("applicationNo")}
                  // onChange={(e) => setSearchValue(e.target.value)}
                  error={!!errors.applicationNo}
                  helperText={
                    errors?.applicationNo ? errors.applicationNo.message : null
                  }
                />
              )}

              {searchType === "bachatgatNo" && (
                <TextField
                  id="standard-textarea"
                  label={language == "en" ? "Bachatgat No." : "बचत गट क्र."}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  // disabled={router.query.id ? true : false}
                  value={bachatgatNo}
                  onChange={(e) => setBachatgatNo(e.target.value)}
                  error={!!errors.bachatgatNo}
                  helperText={
                    errors?.bachatgatNo ? errors.bachatgatNo.message : null
                  }
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={2} xl={2}>
              <Button
                variant="contained"
                // className={commonStyles.buttonApprve}
                size="small"
                onClick={handleSearchConnections}
              >
                <FormattedLabel id="search" />
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* area name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="area" />}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                {...register("areaName")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Zone Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                id="standard-basic"
                {...register("zoneName")}
                label={<FormattedLabel id="zoneNames" />}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                control={control}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Ward name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="wardname" />}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                {...register("wardname")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* gisgeo code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="gisgioCode" />}
                {...register("geoCode")}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* BachatGat FullName */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="bachatgatFullName" />}
                {...register("bachatgatName")}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Bachat Gat category */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bachatgatCat" />}
                variant="standard"
                disabled={true}
                {...register("categoryKey")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
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

            {/* Main gap  Bachat Gat Address*/}
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

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* BachatGat President first Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="presidentFirstName" />}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("presidentFirstName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* BachatGat President Middle Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="presidentFatherName" />}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("presidentMiddleName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/*  BachatGat President Surname */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="presidentLastName" />}
                  variant="standard"
                  disabled={true}
                  {...register("presidentLastName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Online ApBachat Gat Total Members Count Application No*/}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("totalMembersCount")}
                  label={<FormattedLabel id="totalCount" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Flat/BuildingNo */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("flatBuldingNo")}
                  label={<FormattedLabel id="flatBuildNo" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Building Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  {...register("buildingName")}
                  label={<FormattedLabel id="buildingNm" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Road Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="roadName" />}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("roadName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Landmarks */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="landmark" />}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  {...register("landmark")}
                  disabled={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Pin Code */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="pincode" />}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("pinCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
              {/* Applicant first name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantFirstName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantFirstName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Middle Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantMiddleName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantMiddleName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantLastName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantLastName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* landline */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="landlineNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("landlineNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Mobile No. */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("mobileNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Email Id */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="emailId" />}
                  variant="standard"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  {...register("emailId")}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="bankName" />}
                  variant="standard"
                  disabled={true}
                  {...register("bankName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Branch Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="branchName" />}
                  variant="standard"
                  disabled={true}
                  {...register("branchName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Saving Account No */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="accountNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("accountNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Saving Account Name */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="accountHolderName" />}
                  variant="standard"
                  disabled={true}
                  {...register("bankAccountFullName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Bank IFSC Code */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="bankIFSC" />}
                  variant="standard"
                  disabled={true}
                  {...register("ifscCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Bank MICR Code */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-basic"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="bankMICR" />}
                  variant="standard"
                  disabled={true}
                  {...register("micrCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
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

            {/* members show in table */}
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
              rowsPerPageOptions={[5]}
              density="standard"
              rows={memberList}
              columns={columns}
            />
            {/* Main gap  Required Documents*/}

            <Grid item xs={12}>
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginBottom: "10px" }}
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
              <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",
                  backgroundColor: "white",
                  "& .MuiDataGrid-virtualScrollerContent": {},
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                    marginTop: "17px",
                  },
                }}
                density="standard"
                rowsPerPageOptions={[5]}
                rows={fetchDocument}
                columns={columns2}
              />
            </>
            {/* <Grid container sx={{ padding: "10px" }}> */}

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
                      <FormattedLabel id="cancellationSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid container spacing={2} style={{ padding: "1rem" }}>
              {/* cancel reason */}
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  required
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="cancelReason" />}
                  id="standard-basic"
                  variant="standard"
                  {...register("cancelReason")}
                  value={cancelReason}
                  inputProps={{ maxLength: 1000 }}
                  multiline
                  onChange={(e) => handleRemarkChange(e, "cancelReason")}
                  error={!!errors.reason}
                  InputProps={{ style: { fontSize: 18 } }}
                  helperText={
                    errors?.cancelReason
                      ? "Cancel Reason is Required !!!"
                      : null
                  }
                />
              </Grid>

              {/* cancel date */}
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <FormControl
                  variant="standard"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.cancelDate}
                >
                  <Controller
                    control={control}
                    sx={{ width: "90%" }}
                    name="cancelDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={true}
                          variant="standard"
                          inputFormat="YYYY-MM-DD"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="cancelDate"></FormattedLabel>
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
                    {errors?.cancelDate ? errors?.cancelDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{}}
                type="submit"
                size="small"
                variant="contained"
                color="success"
                disabled={!isRemarksFilled}
                endIcon={<SaveIcon />}
              >
                <FormattedLabel id="save" />
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                size="small"
                variant="contained"
                color="error"
                endIcon={<ClearIcon />}
                onClick={() => {
                  router.push(
                    "/BsupNagarvasthi/transaction/bachatGatCancellation"
                  );
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Grid>
          </Grid>
          <Divider />
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategory;
