import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
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
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { default as React, useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert";
import ComponentToPrint from "../../../../components/security/ComponentToPrint";
import styles from "../../../../components/security/ComponentToPrint.module.css";
import { priorityList } from "../../../../components/security/contsants";
import UploadButtonThumbOP from "../../../../components/security/DocumentsUploadThumbOP";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/securityManagementSystemSchema/transactions/VisitorEntry";
import urls from "../../../../URLS/urls";
// import UploadButton from "../../../../components/fileUpload/UploadButton";
import UploadButton from "../../../../components/security/UploadButton";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function VisitorEntry() {
  const [priority, setPriority] = useState(priorityList[0].value);
  const router = useRouter();
  let appName = "SM";
  let serviceName = "SM-VE";
  // let pageMode = router?.query?.pageMode;
  let pageMode = "VISITOR ENTRY";

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   getValues,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  //   defaultValues: {
  //     visitorPhoto: null,
  //   },
  // });

  const theme = useTheme();

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema(language)),
    mode: "onChange",
    defaultValues: {
      visitorPhoto: null,
      priority: "Emergency Visit",
    },
  });
  const {
    control,
    register,
    reset,
    clearErrors,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const [isReady, setIsReady] = useState("none");

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   getValues,
  //   formState: { errors },
  // } = useFormContext();
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [matchingNames, setMatchingNames] = useState([]);
  const [rowId, setRowId] = useState("");
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [imageSrc, setImageSrc] = useState("");
  const [imageSrcPrint, setImageSrcPrint] = useState("");

  const [printData, setPrintData] = useState();
  const [searchEmpData, setSearchEmpData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [disabledData, setDisabledData] = useState();
  const [paramsData, setParamsData] = useState(false);
  const [totalInOut, setTotalInOut] = useState();
  const [nextEntryNumber, setNextEntryNumber] = useState();
  const [selectedModuleName, setSelectedModuleName] = useState([]);

  const [captureImageClicked, setCaptureImageClicked] = useState(true);
  const [uploadImageClicked, setUploadImageClicked] = useState(true);

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const [encryptedFileNameToSend, setEncryptedFileNameToSend] = useState();
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

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  let user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  const _handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedModuleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    let arr1 = departments
      ?.filter((item) =>
        typeof value === "string"
          ? value.split(",")
          : value.includes(item.department)
      )
      .map((item) => item.id);
    let _matchingNames = [];

    for (let i = 0; i < arr1.length; i++) {
      let idToMatch = arr1[i];

      for (let j = 0; j < departmentUsers.length; j++) {
        if (departmentUsers[j].department === idToMatch) {
          console.log("matchingElement", departmentUsers[j]);
          if (departmentUsers[j].designation == 2) {
            _matchingNames.push(departmentUsers[j]);
          }
        }
      }
    }

    console.log("_matchingNames", _matchingNames);
    setMatchingNames(_matchingNames);
  };

  useEffect(() => {
    console.log("matchingNames state", matchingNames);
  }, [matchingNames]);

  // useEffect(() => {
  //   setValue("inTime", new Date("2023-12-10"));
  // }, []);

  useEffect(() => {
    getDepartment();
    // getDepartmentUsers();
    getBasicUserDetails();
    // getNextEntryNumber();
    getZoneKeys();
    getBuildings();
    getWardKeys();
    getInOut();
  }, []);

  useEffect(() => {
    getDepartment();
    // getNextEntryNumber();
    getZoneKeys();
    getBuildings();
    getWardKeys();
    getInOut();
  }, [window.location.reload]);

  useEffect(() => {
    if (
      departmentUsers?.length > 0 &&
      wardKeys?.length > 0 &&
      zoneKeys?.length > 0 &&
      departments?.length > 0 &&
      buildings?.length > 0
    ) {
      getAllVisitors();
    }
    // getAllVisitors();
  }, [departmentUsers, wardKeys, zoneKeys, departments, buildings]);

  useEffect(() => {
    if (printData) {
      handlePrint();
    }
  }, [printData]);

  useEffect(() => {
    clearErrors("visitorPhoto");
  }, [watch("visitorPhoto")]);

  const getAllVisitors = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.SMURL}/trnVisitorEntryPass/getAll`, {
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
        console.log("res VE", r);
        setLoading(false);
        getNextEntryNumber();
        let result = r.data.trnVisitorEntryPassList;
        let count = 0;
        let _res = result?.map((r, i) => {
          // "2023-03-04T03:00:00.000+00:00"

          return {
            ...r,
            inTime: r.inTime
              ? moment(r.inTime).format("DD-MM-YYYY hh:mm A")
              : "Not Available",
            inTm: r.inTime,
            outTime: r.outTime
              ? moment(r.outTime).format("DD-MM-YYYY hh:mm A")
              : "Not Available",
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            visitorStatus: r.visitorStatus === "I" ? "In" : "Out",
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            depeart: r?.departmentKeysList,
            departmentName: r?.departmentKeysList
              ? JSON.parse(r?.departmentKeysList)
                  ?.map((val) => {
                    return departments?.find((obj) => {
                      return obj?.id == val && obj;
                    })?.department;
                  })
                  ?.toString()
              : "-",
            wardKey: r.wardKey
              ? wardKeys?.find((obj) => {
                  return obj?.id == r.wardKey;
                })?.wardName
              : "-",
            zoneKey: r.zoneKey
              ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              : "-",
            zone: r?.zoneKey,
            ward: r?.wardKey,
            // visitorPhoto: DecryptData(
            //   "passphraseaaaaaaaapreview",
            //   r?.visitorPhoto
            // ),
          };
        });
        setLoading(false);
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

  //buildings
  const [buildings, setBuildings] = useState([]);
  // get buildings
  const getBuildings = () => {
    axios
      .get(`${urls.SMURL}/mstBuildingMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("building master", r);
        let result = r.data.mstBuildingMasterList;
        setBuildings(result);
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

  // Ward Keys
  const [wardKeys, setWardKeys] = useState([]);
  // get Ward Keys
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

  const getInOut = () => {
    axios
      .get(`${urls.SMURL}/trnVisitorEntryPass/getTotalInOut`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("all check in", r);
        setTotalInOut(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const searchEmployeeDetails = async (mobileNo) => {
    await axios
      .get(
        `${urls.SMURL}/trnVisitorEntryPass/getByMobNo?mobileNo=${mobileNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        if (r.status == 200) {
          console.log("res emplo", r);

          r?.data?.trnVisitorEntryPassList?.length === 0 &&
            toast("Data Not Found !!!", {
              type: "error",
            }),
            setSearchEmpData(r?.data?.trnVisitorEntryPassList);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getNextEntryNumber = () => {
    axios
      .get(`${urls.SMURL}/trnVisitorEntryPass/getNextEntryNumber`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Nex Entry Number", r);
        setNextEntryNumber(r.data);
        setValue("visitorNumber", r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const [photo, setPhoto] = useState();

  const handleGetName = (e) => {
    console.log("e", e);
    setEncryptedFileNameToSend(e);
  };

  const handleUploadDocument = (path) => {
    console.log("path", path);
    setValue("visitorPhoto", path);
    clearErrors("visitorPhoto");
  };

  const onSubmitForm = (formData, btnType) => {
    console.log("formData", formData);
    setLoading(true);

    // Save - DB
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      console.log("save");
      _body = {
        // departmentKeys: formData?.departmentName,
        departmentKeys: departments
          ?.filter((item) => selectedModuleName.includes(item.department))
          .map((item) => item.id),
        // departmentKey: Number(formData?.departmentKey),
        subDepartmentKey: 2,
        // visitorPhoto: formData?.visitorPhoto,
        visitorPhoto: encryptedFileNameToSend,
        visitorName: formData?.visitorName,
        accompanyingPerson: formData?.accompanyingPerson,
        visitorNumber: formData?.visitorNumber,
        toWhomWantToMeet: formData?.toWhomWantToMeet,
        purpose: formData?.purpose,
        priority: formData?.priority,
        mobileNumber: formData?.mobileNumber,
        notoriousEntry: formData?.notoriousEntry ? "T" : "F",
        visitorStatus: formData?.visitorStatus,
        documentType: "Adhaar Card",
        departmentName: departments?.find(
          (obj) => obj?.id === formData?.departmentKey
        )?.department,
        // inTime: formData?.inTime.toISOString(),
        inTime: moment(formData?.inTime).format("YYYY-MM-DDTHH:mm:ss"),
        personalEquipments: formData.personalEquipments,
        visitorStatus: "I",
        zoneKey: Number(formData?.zoneKey),
        wardKey: Number(formData?.wardKey),
        buildingName: Number(formData?.buildingName),
        // aadharCardNo: formData?.aadhar_card_no,
        emailId: matchingNames.map((val) => val.email)?.join(","),
        hodName: matchingNames.map((val) => val.firstNameEn)?.join(","),
      };
    } else {
      _body = {
        id: formData?.id,
        departmentKeys: JSON.parse(formData?.departmentKeysList),
        // departmentKey: Number(formData?.departmentKey),
        subDepartmentKey: 2,
        visitorPhoto: formData?.visitorPhoto,
        visitorName: formData?.visitorName,
        accompanyingPerson: formData?.accompanyingPerson,
        visitorNumber: formData?.visitorNumber,
        toWhomWantToMeet: formData?.toWhomWantToMeet,
        purpose: formData?.purpose,
        priority: formData?.priority,
        mobileNumber: formData?.mobileNumber,
        notoriousEntry: formData?.notoriousEntry ? "T" : "F",
        documentType: "Adhaar Card",
        departmentName: departments?.find(
          (obj) => obj?.id === formData?.departmentKey
        )?.department,
        // inTime: formData?.inTime,
        inTime: moment(formData?.inTm).format("YYYY-MM-DDTHH:mm:ss"),
        outTime: moment(watch("outTime")).format("YYYY-MM-DDTHH:mm:ss"),
        personalEquipments: formData.personalEquipments,
        visitorStatus: "O",
        zoneKey: Number(formData?.zone),
        wardKey: Number(formData?.ward),
        buildingName: Number(formData?.buildingName),
        // aadharCardNo: formData?.aadhar_card_no,
        visitorEntryNumber: formData.visitorEntryNumber,
      };
    }

    console.log("_body", _body);

    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(
          `${urls.SMURL}/trnVisitorEntryPass/save`,
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
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            getAllVisitors();
            getInOut();
            exitButton();
            setLoading(false);
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
      var d = new Date(); // for now
      const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(
          `${urls.SMURL}/trnVisitorEntryPass/save`,
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
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            setFetchData(tempData);
            setIsOpenCollapse(false);
            setOpen(false);
            getAllVisitors();
            getInOut();
            exitButton();
            setLoading(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
  };

  const createColumn = () => {
    if (data?.rows[0]) {
      return Object?.keys(data?.rows[0]).map((row) => {
        return {
          field: row,
          headerName: row
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (str) {
              return str.toUpperCase();
            }),
          flex: 1,
        };
      });
    } else {
      return [];
    }
  };

  const handleOpen = (_data) => {
    console.log("_daya", _data);
    setOpen(true);
    setParamsData(_data);
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
        console.log("Filtered Wards", r);
        setWardKeys(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const handleClose = () => setOpen(false);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: "new document",
  });

  const resetValuesCancell = {
    visitorName: "",
    accompanyingPerson: "",
    visitorPhoto: "",
    // departmentName: "",
    toWhomWantToMeet: "",
    purpose: "",
    priority: "",
    mobileNumber: "",
    inTime: new Date(),
    outTime: new Date(),
    notoriousEntry: null,
    visitorStatus: "",
    personalEquipments: "",
    // aadhar_card_no: "",
    buildingName: null,
    // departmentName: null,
    zoneKey: null,
    wardKey: null,
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const TempPrinter = (props) => {
    return (
      <div className={styles.main} ref={props.toPrint}>
        <div
          style={{
            display: "flex",
            // width: "95vw",
            width: "80mm",
            flexDirection: "column",
            border: "1px solid gray",
            borderRadius: "20px",
            padding: "10px",
          }}
        >
          <Grid container sx={{ padding: "5px" }}>
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <img src="/logo.png" alt="" height="100vh" width="100vw" /> */}
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">पिंपरी चिंचवड महानगरपालिका</Typography>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <img
                src="/smartCityPCMC.png"
                alt=""
                height="100vh"
                width="100vw"
              /> */}
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "5px" }}>
            <Grid item xs={12}>
              <h2 className={styles.heading}>
                <b>प्रवेश पास</b>
              </h2>
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "5px" }}>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <Typography>
                वेळ आत :{" "}
                {moment(props?.data?.inTime, "DD-MM-YYYY hh:mm:ss").format(
                  "DD-MM-YYYY hh:mm:ss"
                )}
              </Typography>
            </Grid>
            {/* <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography>
                  दिनांक : {moment(props?.data?.inTime, "YYYY-MM-DD").format("DD-MM-YYYY")}
                </Typography>
              </Grid> */}

            {props?.data?.outTime !== "Not Available" && (
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <Typography>
                  वेळ बाहेर :{" "}
                  {moment(props?.data?.outTime, "DD-MM-YYYY hh:mm:ss").format(
                    "DD-MM-YYYY hh:mm:ss"
                  )}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Grid container>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/qrcode1.png" alt="" height="70vh" width="70vw" />
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {imageSrcPrint && (
                <img
                  src={imageSrcPrint}
                  alt="Image"
                  height="100vh"
                  width="150vw"
                />
              )}
              {/* <img
                src={`${urls.CFCURL}/file/preview?filePath=${props?.data?.visitorPhoto}`}
                alt="123"
                height="100vh"
                width="100vw"
              /> */}
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={9}>
              <Typography>
                1) अभ्यागत क्रमांक : {props?.data?.visitorEntryNumber}
              </Typography>
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={12}>
              <Typography>
                2) नागरिकाचे नाव श्री/श्रीमती : {props?.data?.visitorName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={12}>
              <Typography>
                3) सोबत आलेल्या व्यक्ती : {props?.data?.accompanyingPerson}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={12}>
              <Typography>
                4) कोणाला भेटायचे : {props?.data?.toWhomWantToMeet}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={12}>
              <Typography>
                5) भेटण्याचे कारण : {props?.data?.purpose}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={12}>
              <Typography>
                6) मोबाईल नंबर : {props?.data?.mobileNumber}
              </Typography>
            </Grid>
          </Grid>
          {/* <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={12}>
              <Typography>
                7) आधार क्रमांक / पॅन क्रमांक / मतदार ओळखपत्र क्रमांक /
                ड्रायव्हिंग लायसन्स क्रमांक : {props?.data?.aadharCardNo}
              </Typography>
            </Grid>
          </Grid> */}
          <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={12}>
              <Typography>
                7) विभागाचे नाव : {props?.data?.departmentName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={12}>
              <Typography>मनपा अधिकारी/कर्मचारी यांची स्वाक्षरी : </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid item xs={12}>
              <Typography>
                टीप : परत जाताना कृपया सुरक्षा विभागाकडे पास जमा करा{" "}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // flex: 0.6,
      headerAlign: "center",
      width: 60,
    },
    {
      hide: true,
      field: "visitorPhoto",
      headerName: <FormattedLabel id="visitorPhoto" />,
      // flex: 1,
      headerAlign: "center",
      width: 120,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "visitorName",
      headerName: <FormattedLabel id="visitorName" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "visitorEntryNumber",
      headerName: <FormattedLabel id="visitorEntryNumber" />,
      // flex: 1,
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      hide: false,
      field: "zoneKey",
      headerName: <FormattedLabel id="zone" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "wardKey",
      headerName: <FormattedLabel id="ward" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "departmentName",
      headerName: <FormattedLabel id="deptName" />,
      // flex: 1,
      // minWidth: 150,
      headerAlign: "center",
      // renderCell: (params) => (
      //   <Tooltip title={params.value}>
      //     <span className="csutable-cell-trucate">{params.value}</span>
      //   </Tooltip>
      // ),
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "toWhomWantToMeet",
      headerName: <FormattedLabel id="toWhomWantToMeet" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "purpose",
      headerName: <FormattedLabel id="purpose" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "priority",
      headerName: <FormattedLabel id="priority" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "mobileNumber",
      headerName: <FormattedLabel id="mobileNumber" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "inTime",
      headerName: <FormattedLabel id="inTime" />,
      // flex: 2,
      align: "center",
      headerAlign: "center",
      // renderCell: (params) => (
      //   <Tooltip title={params.value}>
      //     <span className="csutable-cell-trucate">{params.value}</span>
      //   </Tooltip>
      // ),
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "outTime",
      headerName: <FormattedLabel id="outTime" />,
      // flex: 2,
      align: "center",
      headerAlign: "center",
      // renderCell: (params) => (
      //   <Tooltip title={params.value}>
      //     <span className="csutable-cell-trucate">{params.value}</span>
      //   </Tooltip>
      // ),
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "notoriousEntry",
      headerName: <FormattedLabel id="notoriousEntry" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "visitorStatus",
      headerName: <FormattedLabel id="visitorStatus" />,
      // flex: 0.5,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "documentType",
      headerName: "Document Type",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      hide: true,
      field: "personalEquipments",
      headerName: <FormattedLabel id="personalEquipments" />,
      // flex: 0.5,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      // flex: 1,
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box>
            {(authority?.includes("HOD") || authority?.includes("ENTRY")) && (
              <>
                <Tooltip title={language == "en" ? "Print" : "प्रत"}>
                  <IconButton
                    // disabled={editButtonInputState}
                    onClick={async () => {
                      if (params?.row?.visitorPhoto != null) {
                        const DecryptPhoto = await DecryptData(
                          "passphraseaaaaaaaaupload",
                          params?.row?.visitorPhoto
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
                        setImageSrcPrint(imageUrl);
                      } else {
                        setImageSrcPrint("");
                      }
                      setPrintData(params.row);
                      // handlePrint();
                      setIsReady("none");
                    }}
                  >
                    <Paper style={{ display: isReady }}>
                      <ComponentToPrint ref={componentRef} data={printData} />
                      {/* <TempPrinter toPrint={componentRef} data={printData} /> */}
                      {/* <TempPrinter toPrint={componentRef} data={params.row} /> */}
                    </Paper>
                    <PrintIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                </Tooltip>

                {params.row.visitorStatus == "In" && (
                  <Tooltip title={language == "en" ? "Out" : "बाहेर"}>
                    <IconButton
                      onClick={() => {
                        handleOpen(params);
                      }}
                    >
                      <ExitToAppIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={language == "en" ? "View Form" : "फॉर्म पहा"}>
                  <IconButton
                    onClick={async () => {
                      console.log("openForm", params.row);

                      if (params?.row?.visitorPhoto != null) {
                        const DecryptPhoto = await DecryptData(
                          "passphraseaaaaaaaaupload",
                          params?.row?.visitorPhoto
                        );
                        const ciphertext = await EncryptData(
                          "passphraseaaaaaaapreview",
                          DecryptPhoto
                        );

                        console.log("test", DecryptPhoto, ciphertext);

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
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("dept", res);
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
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
        setDepartmentUsers(res?.data?.userList);
        setLoading(false);
      })
      ?.catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getDepartmentUsers = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Department Users", res.data.user);
        setDepartmentUsers(res?.data?.user);
      })
      ?.catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const handleCaptureImageClicked = (e) => {
    setCaptureImageClicked(e);
  };

  return (
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <Paper style={{ display: isReady }}>
            {/* <ComponentToPrint ref={componentRef} data={printData} /> */}
            {/* <TempPrinter toPrint={componentRef} data={printData} /> */}
            <TempPrinter toPrint={componentRef} data={printData} />
          </Paper>
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
                <FormattedLabel id="visitorInOutEntry" />
              </strong>
            </Typography>
          </Box>

          <Head>
            <title>Visitor-Entry</title>
          </Head>

          {isOpenCollapse ? (
            <>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <TextField
                        sx={{ width: "45%" }}
                        fullWidth
                        id="outlined-basic"
                        // label="Visitor Mobile No."
                        label={<FormattedLabel id="visitorMobileNo" />}
                        size="small"
                        variant="outlined"
                        {...register("searchEmployeeId")}
                        // error={errors.searchEmployeeId}
                        // helperText={errors.searchEmployeeId ? errors.searchEmployeeId.message : null}
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
                        disabled={!watch("searchEmployeeId")}
                        size="small"
                        onClick={() => {
                          searchEmployeeDetails(watch("searchEmployeeId"));
                        }}
                      >
                        <FormattedLabel id="searchVisitorDetails" />
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    {searchEmpData.length > 0 && (
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ width: "45%" }}
                          error={errors.buildingName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="visitorList" />
                          </InputLabel>
                          <Controller
                            name="visitor"
                            control={control}
                            defaultValue=""
                            render={({ field }) => {
                              return (
                                <Select
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    searchEmpData.map((item) => {
                                      if (item.id == value.target.value) {
                                        setValue(
                                          "visitorName",
                                          item?.visitorName
                                        );
                                        setValue(
                                          "accompanyingPerson",
                                          item?.accompanyingPerson
                                        );
                                        setValue(
                                          "toWhomWantToMeet",
                                          item?.toWhomWantToMeet
                                        );
                                        setValue(
                                          "mobileNumber",
                                          item?.mobileNumber
                                        );
                                        setValue("purpose", item?.purpose);
                                        setValue(
                                          "personalEquipments",
                                          item?.personalEquipments
                                        );
                                        setValue("priority", item?.priority);
                                        setValue("zoneKey", item?.zoneKey);
                                        setValue("wardKey", item?.wardKey);
                                        setValue("inTime", new Date());
                                        setValue(
                                          "buildingName",
                                          item?.buildingName
                                        );
                                        // setValue(
                                        //   "aadhar_card_no",
                                        //   item?.aadharCardNo
                                        // );
                                      }
                                    });
                                  }}
                                  fullWidth
                                  label="Visitor List"
                                >
                                  {searchEmpData?.map((item, i) => {
                                    return (
                                      <MenuItem key={i} value={item.id}>
                                        {item.visitorName}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              );
                            }}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {/* {errors?.buildingKey ? errors.buildingKey.message : null} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        // label="Visitor Number"
                        label={<FormattedLabel id="visitorNumber" required />}
                        size="small"
                        fullWidth
                        disabled
                        value={nextEntryNumber}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...register("visitorNumber")}
                        sx={{ width: "90%" }}
                        error={!!errors.visitorNumber}
                        helperText={
                          errors?.visitorNumber
                            ? errors.visitorNumber.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="visitorName" required />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("visitorName") ? true : false,
                        }}
                        {...register("visitorName")}
                        sx={{ width: "90%" }}
                        error={!!errors.visitorName}
                        helperText={
                          errors?.visitorName
                            ? errors.visitorName.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="accompanyingPerson" />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("accompanyingPerson") ? true : false,
                        }}
                        {...register("accompanyingPerson")}
                        sx={{ width: "90%" }}
                        // error={!!errors.visitorName}
                        // helperText={errors?.accompanyingPerson ? errors.accompanyingPerson.message : null}
                      />
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <FormControl
                        // required
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        // error={errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zoneName" />
                        </InputLabel>
                        <Controller
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // {...field}
                              value={field.value}
                              InputLabelProps={{
                                shrink: watch("zoneKey") ? true : false,
                              }}
                              onChange={(value) => {
                                field.onChange(value);
                                getFilterWards(value);
                              }}
                              fullWidth
                              label="Zone Name"
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
                        {/* <FormHelperText style={{ color: "red" }}>
                          {errors?.zoneKey ? errors.zoneKey.message : null}
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        // error={errors.wardKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="wardName" />
                        </InputLabel>
                        <Controller
                          defaultValue=""
                          name="wardKey"
                          control={control}
                          render={({ field }) => (
                            <Select
                              // {...field}
                              onChange={(value) => field.onChange(value)}
                              value={field.value}
                              fullWidth
                              InputLabelProps={{
                                shrink: watch("wardKey") ? true : false,
                              }}
                              label={<FormattedLabel id="wardName" />}
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
                        {/* <FormHelperText style={{ color: "red" }}>
                          {errors?.wardKey ? errors.wardKey.message : null}
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <FormControl fullWidth size="small" sx={{ width: "90%" }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="buildingName" />
                        </InputLabel>
                        <Controller
                          name="buildingName"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // {...field}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              fullWidth
                              InputLabelProps={{
                                shrink: watch("buildingName") ? true : false,
                              }}
                              label={<FormattedLabel id="buildingName" />}
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
                        {/* <FormHelperText style={{ color: "red" }}>
                          {errors?.buildingName ? errors.buildingName.message : null}
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      {/* <FormControl
                    fullWidth
                    size="small"
                    sx={{ width: "90%" }}
                    error={errors.departmentKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Department Name
                    </InputLabel>
                    <Controller
                      name="departmentKey"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Department Name"
                          value={field.value}
                          fullWidth
                          size="small"
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
                      {errors?.departmentKey
                        ? errors.departmentKey.message
                        : null}
                    </FormHelperText>
                  </FormControl> */}

                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        // error={errors.departmentKey}
                      >
                        {/* <Controller
                          name="departmentName"
                          control={control}
                          type="text"
                          defaultValue={[]}
                          render={({ field }) => (
                            <FormControl> */}
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="deptName" />}
                        </InputLabel>
                        <Select
                          size="small"
                          // {...field}
                          // value={field.value}
                          value={selectedModuleName}
                          onChange={_handleChange}
                          renderValue={(selected) => selected.join(", ")}
                          InputLabelProps={{
                            shrink: watch("departmentName") ? true : false,
                          }}
                          label={<FormattedLabel id="deptName" />}
                          multiple
                          defaultValue={[]}
                        >
                          {departments.map((age, i) => {
                            return (
                              <MenuItem value={age.department} key={i}>
                                <Checkbox
                                  checked={
                                    selectedModuleName.indexOf(age.department) >
                                    -1
                                  }
                                />
                                <ListItemText primary={age.department} />
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {/* </FormControl> */}
                        {/* )}
                        /> */}
                      </FormControl>
                      {console.log("selectedModuleName", selectedModuleName)}
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="toWhomWantToMeet" />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("toWhomWantToMeet") ? true : false,
                        }}
                        {...register("toWhomWantToMeet")}
                        sx={{ width: "90%" }}
                        // error={!!errors.toWhomWantToMeet}
                        // helperText={errors?.toWhomWantToMeet ? errors.toWhomWantToMeet.message : null}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl fullWidth size="small" sx={{ width: "90%" }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="priority" />
                        </InputLabel>
                        <Controller
                          name="priority"
                          control={control}
                          // defaultValue="Emergency Visit"
                          render={({ field }) => (
                            <Select
                              {...field}
                              // defaultValue="Emergency Visit"
                              label="Priority"
                              InputLabelProps={{
                                shrink: watch("priority") ? true : false,
                              }}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              {priorityList.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.label}>
                                    {item.label}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        {/* <FormHelperText>{errors?.priority ? errors.priority.message : null}</FormHelperText> */}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        {...register("mobileNumber")}
                        label={<FormattedLabel id="mobileNumber" required />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("mobileNumber") ? true : false,
                        }}
                        inputProps={{
                          maxLength: 10,
                        }}
                        // id="standard-basic"
                        // variant="standard"
                        id="outlined-basic"
                        variant="outlined"
                        sx={{
                          width: "90%",
                        }}
                        error={errors.mobileNumber}
                        helperText={
                          errors.mobileNumber
                            ? errors.mobileNumber.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        name="notoriousEntry"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            {...field}
                            control={<Checkbox />}
                            label={<FormattedLabel id="notoriousEntry" />}
                          />
                        )}
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
                      {uploadImageClicked && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <Typography>
                            <FormattedLabel id="visitorPhoto" required />
                          </Typography>
                          <Box
                            sx={{
                              border: "1px solid gray",
                              borderRadius: "5px",
                            }}
                            onClick={() => setCaptureImageClicked(false)}
                          >
                            <UploadButtonThumbOP
                              appName={appName}
                              fileName={"visitorPhoto.png"}
                              serviceName={serviceName}
                              fileDtl={getValues("visitorPhoto")}
                              fileKey={"visitorPhoto"}
                              showDel={
                                pageMode != "VISITOR ENTRY" ? false : true
                              }
                              handleCaptureImageClicked={
                                handleCaptureImageClicked
                              }
                              fileNameEncrypted={(path) => {
                                handleGetName(path);
                              }}
                            />
                            <FormHelperText error={errors.visitorPhoto}>
                              {errors?.visitorPhoto
                                ? errors.visitorPhoto.message
                                : null}
                            </FormHelperText>
                          </Box>
                        </Box>
                      )}
                      {captureImageClicked && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <Typography>
                            {<FormattedLabel id="orUploadPhoto" />}
                          </Typography>
                          <Box
                            sx={{
                              border: "1px solid gray",
                              borderRadius: "5px",
                            }}
                            onClick={() => setUploadImageClicked(false)}
                          >
                            <UploadButton
                              appName={appName}
                              serviceName={serviceName}
                              filePath={(path) => {
                                handleUploadDocument(path);
                              }}
                              fileName={
                                getValues("visitorPhoto.png") &&
                                "visitorPhoto.png"
                              }
                              fileNameEncrypted={(path) => {
                                handleGetName(path);
                              }}
                            />
                          </Box>
                        </Box>
                      )}

                      {/* <Controller
                  name="visitorPhoto"
                  control={control}
                  render={({ field }) => (
                    <Button variant="contained" component="label" size="small">
                      Upload
                      <input
                        {...field}
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                      />
                    </Button>
                  )}
                /> */}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="purpose" required />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("purpose") ? true : false,
                        }}
                        {...register("purpose")}
                        sx={{ width: "90%" }}
                        error={!!errors.purpose}
                        helperText={
                          errors?.purpose ? errors.purpose.message : null
                        }
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        name="aadhar_card_no"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={<FormattedLabel id="aadharNo" required />}
                            fullWidth
                            sx={{ width: "90%" }}
                            InputLabelProps={{
                              shrink: watch("aadhar_card_no") ? true : false,
                            }}
                            size="small"
                            error={errors.aadhar_card_no}
                            helperText={
                              errors.aadhar_card_no
                                ? errors.aadhar_card_no.message
                                : null
                            }
                          />
                        )}
                      />
                    </Grid> */}
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        control={control}
                        name="inTime"
                        defaultValue={new Date()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              {...field}
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  size="small"
                                  fullWidth
                                  sx={{ width: "90%" }}
                                  error={errors.inTime}
                                  helperText={
                                    errors?.inTime
                                      ? errors.inTime.message
                                      : null
                                  }
                                />
                              )}
                              label={
                                <FormattedLabel
                                  id="visitorInDateTime"
                                  required
                                />
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              disablePast
                              disableFuture
                              defaultValue={new Date()}
                              inputFormat="DD-MM-YYYY hh:mm:ss"
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    <Divider style={{ background: "black" }} variant="middle" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      sx={{ width: "95%" }}
                      fullWidth
                      id="outlined-basic"
                      label={<FormattedLabel id="personalEquipments" />}
                      size="small"
                      InputLabelProps={{
                        shrink: watch("personalEquipments") ? true : false,
                      }}
                      variant="outlined"
                      {...register("personalEquipments")}
                      error={!!errors.personalEquipments}
                      helperText={
                        errors?.personalEquipments
                          ? errors.personalEquipments.message
                          : null
                      }
                    />
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
                        {<FormattedLabel id="save" />}
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
                        onClick={() => {
                          setSelectedModuleName([]);
                          reset({
                            ...resetValuesCancell,
                          });
                        }}
                      >
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedModuleName([]);
                          setIsOpenCollapse(!isOpenCollapse);
                          exitButton();
                        }}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </>
          ) : (
            <>
              <Grid
                container
                sx={{
                  padding: "10px",
                  border: "1px solid gray",
                  borderRadius: "10px",
                }}
              >
                <Grid
                  xs={4}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    <FormattedLabel id="date" />{" "}
                    {`: ${moment(new Date()).format("DD-MM-YYYY")}`}
                  </Typography>
                </Grid>
                <Grid
                  xs={4}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "so",
                  }}
                >
                  <Typography>
                    <FormattedLabel id="totalIn" /> :{" "}
                    {totalInOut?.Values[0]["Total_in"]}
                  </Typography>
                </Grid>
                <Grid
                  xs={3}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "so",
                  }}
                >
                  <Typography>
                    <FormattedLabel id="totalOut" /> :{" "}
                    {totalInOut?.Values[0]["Total_out"]}
                  </Typography>
                </Grid>
                {(authority?.includes("HOD") ||
                  authority?.includes("ENTRY")) && (
                  <Grid item xs={1}>
                    <Button
                      variant="contained"
                      endIcon={<AddIcon />}
                      // type='primary'
                      // disabled={buttonInputState}
                      onClick={() => {
                        // reset({
                        //   ...resetValuesExit,
                        // });
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
                )}
              </Grid>

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

                density="compact"
                autoHeight={data.pageSize}
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
                  getAllVisitors(_data, data.page);
                }}
              />
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Box
                    sx={{
                      padding: "10px",
                    }}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        control={control}
                        name="outTime"
                        defaultValue={new Date()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              {...field}
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  size="small"
                                  fullWidth
                                  sx={{ width: "90%" }}
                                  error={errors.outTime}
                                  helperText={
                                    errors?.outTime
                                      ? errors.outTime.message
                                      : null
                                  }
                                />
                              )}
                              minTime={moment(paramsData.row.inTm)}
                              minDate={moment(paramsData.row.inTm)}
                              defaultValue={new Date()}
                              inputFormat="DD-MM-YYYY hh:mm:ss"
                              label={<FormattedLabel id="visitorOutDateTime" />}
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    {/* <Controller
                  control={control}
                  name="outTime"
                  defaultValue={new Date()}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        renderInput={(props) => (
                          <TextField {...props} size="small" fullWidth />
                        )}
                        label="Visitor Out Date Time"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                    </LocalizationProvider>
                  )}
                /> */}
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
                        onSubmitForm(paramsData.row, "Checkout");
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
                  <FormattedLabel id="visitorInOutEntry" />
                </DialogTitle>
                <Divider />
                <DialogContent>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="visitorNumber" required />}
                        size="small"
                        fullWidth
                        disabled
                        value={disabledData?.visitorEntryNumber}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="visitorName" required />}
                        size="small"
                        fullWidth
                        disabled
                        InputLabelProps={{
                          shrink: disabledData?.visitorName ? true : false,
                        }}
                        value={disabledData?.visitorName}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="accompanyingPerson" />}
                        size="small"
                        fullWidth
                        disabled
                        value={disabledData?.accompanyingPerson}
                        InputLabelProps={{
                          shrink: disabledData?.accompanyingPerson
                            ? true
                            : false,
                        }}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="zoneName" />}
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
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="wardName" />}
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
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <FormControl fullWidth size="small" sx={{ width: "90%" }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="buildingName" />
                        </InputLabel>
                        <Controller
                          name="buildingName"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              value={disabledData?.buildingName}
                              fullWidth
                              disabled
                              InputLabelProps={{
                                shrink: disabledData?.buildingName
                                  ? true
                                  : false,
                              }}
                              label={<FormattedLabel id="buildingName" />}
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
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="toWhomWantToMeet" />}
                        size="small"
                        disabled
                        value={disabledData?.toWhomWantToMeet}
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.toWhomWantToMeet ? true : false,
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
                          shrink: disabledData?.priority ? true : false,
                        }}
                        value={disabledData?.priority}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        label={<FormattedLabel id="mobileNumber" required />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.mobileNumber ? true : false,
                        }}
                        value={disabledData?.mobileNumber}
                        disabled
                        inputProps={{
                          maxLength: 10,
                        }}
                        id="outlined-basic"
                        variant="outlined"
                        sx={{
                          width: "90%",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        name="notoriousEntry"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            {...field}
                            disabled
                            control={
                              <Checkbox
                                checked={disabledData?.notoriousEntry == "T"}
                              />
                            }
                            label={<FormattedLabel id="notoriousEntry" />}
                          />
                        )}
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
                        src={`${urls.CFCURL}/file/preview?filePath=${disabledData?.visitorPhoto}`}
                        alt="123"
                        height="100vh"
                        width="150vw"
                      /> */}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="purpose" required />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.purpose ? true : false,
                        }}
                        disabled
                        value={disabledData?.purpose}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        label={<FormattedLabel id="aadharNo" required />}
                        fullWidth
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: disabledData?.aadharCardNo ? true : false,
                        }}
                        size="small"
                        disabled
                        value={disabledData?.aadharCardNo}
                      />
                    </Grid> */}
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          <FormattedLabel id="visitorInDateTime" required />
                        }
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.inTime ? true : false,
                        }}
                        disabled
                        value={disabledData?.inTime}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        sx={{ width: "95%" }}
                        fullWidth
                        id="outlined-basic"
                        label={<FormattedLabel id="personalEquipments" />}
                        size="small"
                        InputLabelProps={{
                          shrink: disabledData?.personalEquipments
                            ? true
                            : false,
                        }}
                        value={disabledData?.personalEquipments}
                        disabled
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    {disabledData?.outTime != "Not Available" && (
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label={
                            <FormattedLabel id="visitorOutDateTime" required />
                          }
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            shrink: disabledData?.outTime ? true : false,
                          }}
                          disabled
                          value={disabledData?.outTime}
                          sx={{ width: "90%" }}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container>
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
            </>
          )}
        </>
      )}
    </Paper>
  );
}

export default VisitorEntry;
