import { yupResolver } from "@hookform/resolvers/yup";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import ReceiptIcon from "@mui/icons-material/Receipt";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Tooltip,
  Typography,
  TextareaAutosize,
} from "@mui/material";
import Tipani from "../documents/tipani";
import Dakhala from "../documents/dakhala";
import Adesh from "../documents/adesh";
import Bill from "../documents/bill";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";

import Loader from "../../../../../containers/Layout/components/Loader";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import ScrutinyActions from "../../../../../components/ElectricBillingComponent/scrutinyActions";
import scrutinyActionSchema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/scrutinyActionSchema";
import CloseIcon from "@mui/icons-material/Close";
import UndoIcon from "@mui/icons-material/Undo";
import modalStyles from "../../../../../styles/ElectricBillingPayment_Styles/scutinyActions.module.css";
import { manageStatus } from "../../../../../components/ElectricBillingComponent/commonStatus/manageEnMr";
import BreadCrumb from "../../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(scrutinyActionSchema),
    mode: "onChange",
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "90%",
    minWidth: "60vh",
    overflow: "scroll",
    minHeight: "fit-content",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #fff",
    boxShadow: 24,
    p: 4,
  };

  const paymentStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "80%",
    width: "80%",
    overflow: "scroll",
    minHeight: "fit-content",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #fff",
    boxShadow: 24,
    p: 4,
  };

  const remarkStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "auto",
    width: "80%",
    overflow: "scroll",
    minHeight: "fit-content",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #fff",
    boxShadow: 24,
    p: 4,
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [commonObject, setCommonObject] = useState({
    zone: "",
    subDivision: "",
  });
  const [loading, setLoading] = useState(false);
  const [openTipani, setOpenTipani] = useState(false);
  const [openDakhala, setOpenDakhala] = useState(false);
  const [openAdesh, setOpenAdesh] = useState(false);
  const [openPaymentForm, setOpenPaymentForm] = useState(false);
  const [paymentDate, setPaymentDate] = useState(null);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [subDivisionDropDown, setSubDivisionDropDown] = useState([]);
  const [commonData, setCommonData] = useState({});
  const [dataSource, setDataSource] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [paymentId, setPaymentId] = useState();
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [selectedData, setSelectedData] = useState();
  const [modalforAprov, setmodalforAprov] = useState(false);
  const [openRemarkModal, setOpenRemarkModal] = useState(false);
  const [remarkId, setRemarkId] = useState();
  const [bank, setBank] = useState([]);
  const [branch, setBranch] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [statusAll, setStatus] = useState([]);
  const [pageSize, setPageSize] = useState(null);
  const [pageNo, setPageNo] = useState(null);
  const [openBill, setOpenBill] = useState(false);

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

  const language = useSelector((state) => state.labels.language);

  const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  let tableDataa = [];
  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];

  // function to open-close Tipani Modal
  const handleCloseTipani = () => {
    setOpenTipani(false);
  };

  // function to open-close Dakhala Modal
  const handleCloseDakhala = () => {
    setOpenDakhala(false);
  };

  // function to open-close Adesh Modal
  const handleCloseAdesh = () => {
    setOpenAdesh(false);
  };

  // function to open-close Bill Modal
  const handleCloseBill = () => {
    setOpenBill(false);
  };

  const handleClosePaymentForm = () => {
    setOpenPaymentForm(false);
  };

  useEffect(() => {
    if (remarkId) {
      let temp =
        dataSource &&
        dataSource?.trnBillGenerateList?.find((each) => each.id == remarkId);
      setValue("jrEngApprovalRemark", temp?.jrEngApprovalRemark);
      setValue("dyApprovalRemark", temp?.dyApprovalRemark);
      setValue("exApprovalRemark", temp?.exApprovalRemark);
      setValue("deptAccApprovalRemark", temp?.deptAccApprovalRemark);
      setValue("hoAccApprovalRemark", temp?.hoAccApprovalRemark);
    }
  }, [remarkId, dataSource]);

  useEffect(() => {
    // getAllGeneratedBillData();
    getCreatedBillData();
    getAllStatus();
    getZone();
    getBank();
    getSubDivision();
    getPaymentTypes();
  }, []);

  useEffect(() => {
    if (watch("paymentType")) {
      getPaymentModes(watch("paymentType"));
    }
  }, [watch("paymentType"), language]);

  useEffect(() => {
    if (paymentId) {
      let temp =
        dataSource &&
        dataSource?.trnBillGenerateList?.find((each) => each.id == paymentId);
      setValue("amountToBePaid", temp?.amountToBePaid);
      setValue("billedAmount", temp?.billedAmount);
    }
  }, [openPaymentForm, paymentId]);

  useEffect(() => {
    let _res = commonData;

    let zone, subDivision;

    if (zoneDropDown && subDivisionDropDown) {
      zone =
        zoneDropDown &&
        zoneDropDown.find((each) => each.id == _res?.zoneKey)?.zoneNameMr;
      subDivision =
        subDivisionDropDown &&
        subDivisionDropDown.find((each) => each.id == _res?.subDivisionKey)
          ?.subDivisionMr;

      setCommonObject({
        zone,
        subDivision,
      });
    }
  }, [commonData]);

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  //get Bank details
  const getBank = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`)
      .then((res) => {
        setBank(res.data.bank);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const handleBank = (e) => {
    setSelectedBank(e.target.value);
    let bankName = e.target.value;
    let branchNames = [];
    bank &&
      bank.map((eachBank) => {
        if (eachBank.bankName === e.target.value) {
          if (!branchNames.includes(eachBank.branchName)) {
            branchNames.push(eachBank);
          }
        }
      });
    setBranch(branchNames);
  };

  const getPaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`)
      .then((r) => {
        setPaymentTypes(
          r.data.paymentType.map((row) => ({
            id: row.id,
            paymentType: row.paymentType,
            paymentTypeMr: row.paymentTypeMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getPaymentModes = (id) => {
    axios
      .get(
        `${urls.CFCURL}/master/paymentMode/getAllByPaymentType?paymentType=${id}`
      )
      .then((r) => {
        setPaymentModes(
          r.data.paymentMode.map((row) => ({
            id: row.id,
            paymentMode: row.paymentMode,
            paymentModeMr: row.paymentModeMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Ward Name
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((res) => {
        let temp = res.data.zone;
        setZoneDropDown(temp);
        // let _res= temp.find((each)=> each.id == commonData?.zoneKey);
        // setCommonObject({...commonObject, zone: _res?.zoneNameMr});
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.mstSubDivisionList;
        setSubDivisionDropDown(temp);

        // let _res= temp.find((each)=> each.id == commonData?.subDivisionKey);
        // setCommonObject({...commonObject, subDivision: _res?.subDivisionMr});
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get all status
  const getAllStatus = () => {
    setLoading(true);
    if (loggedInUser === "citizenUser") {
      axios
        .get(`${urls.EBPSURL}/mstStatus/getAll`, {
          headers: {
            UserId: user.id,
          },
        })
        .then((res) => {
          setLoading(false);
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
    } else {
      axios
        .get(`${urls.EBPSURL}/mstStatus/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setLoading(false);
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
    }
  };

  // Get Table - Data

  const getCreatedBillData = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    setPageSize(_pageSize);
    setPageNo(_pageNo);
    axios
      .get(`${urls.EBPSURL}/trnBillGenerate/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        setLoading(false);
        let result = r.data;
        setDataSource(result);

        // if (authority && authority?.find((val) => val === "JUNIOR_ENGINEER")) {
        //   tableData1 = dataSource?.filter((data, index) => {
        //     return (
        //       data.status == 0 ||
        //       data.status == 1 ||
        //       data.status == 2 ||
        //       data.status == 11 ||
        //       data.status == 12 ||
        //       data.status == 25 ||
        //       data.status == 26 ||
        //       data.status == 8 ||
        //       data.status == 9 ||
        //       data.status == 10
        //     );
        //   });
        // }

        // if (authority && authority?.find((val) => val === "DEPUTY_ENGINEER")) {
        //   tableData2 = dataSource?.filter((data, index) => {
        //     return (
        //       data.status == 3 ||
        //       data.status == 4 ||
        //       data.status == 8 ||
        //       data.status == 9 ||
        //       data.status == 10
        //     );
        //   });
        // }

        // if (authority && authority?.find((val) => val === "EXECUTIVE_ENGINEER")) {
        //   tableData3 = dataSource?.filter((data, index) => {
        //     return (
        //       data.status == 5 ||
        //       data.status == 6 ||
        //       data.status == 8 ||
        //       data.status == 9 ||
        //       data.status == 10
        //     );
        //   });
        // }

        // if (authority && authority?.find((val) => val === "ACCOUNTANT")) {
        //   tableData4 = dataSource?.filter((data, index) => {
        //     return (
        //       data.status == 7 ||
        //       data.status == 8 ||
        //       data.status == 9 ||
        //       data.status == 10
        //     );
        //   });
        // }

        // tableDataa = [...tableData1, ...tableData2, ...tableData3, ...tableData4];
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (dataSource != null && dataSource != undefined) {
      setDataOnTable();
    }
  }, [dataSource, language, statusAll]);

  const setDataOnTable = () => {
    let dummyData = dataSource;
    let result = dataSource?.trnBillGenerateList;
    // if(pageNo != null && pageSize != null){
    let _res =
      result &&
      result?.map((r, i) => {
        return {
          activeFlag: r.activeFlag,
          id: r.id,
          srNo: i + 1 + dummyData?.pageNo * dummyData?.pageSize,
          consumerNo: r?.consumerNo,
          billNo: r?.applicationNo,
          billedAmount: r?.billedAmount,
          meterReadingKey: r?.id,
          newConnectionKey: r?.newConnectionKey,
          amountToBePaid: r?.amountToBePaid,
          statusCode: r?.status,
          tippaniGenrated: r?.tippaniGenrated,
          tippaniRejected: r?.tippaniRejected,
          dakhalaGenerated: r?.dakhalaGenerated,
          adeshGenerated: r?.adeshGenerated,
          formNo14: r?.formNo14,
          status: manageStatus(r.status, language, statusAll),
        };
      });
    setData({
      rows: _res,
      totalRows: dummyData?.totalElements,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: dummyData?.pageSize,
      page: dummyData?.pageNo,
    });
    // }
  };

  const onSubmitForm = (id, btnType) => {
    setLoading(true);
    let jrEngRole = authority?.find((val) => val === "JUNIOR_ENGINEER");
    let dyEngRole = authority?.find((val) => val === "DEPUTY_ENGINEER");
    let exEngRole = authority?.find((val) => val === "EXECUTIVE_ENGINEER");
    let deptAccRole = authority?.find((val) => val === "ACCOUNTANT");
    let hoAccRole = authority?.find((val) => val === "HEAD_ACCOUNTANT");

    let selectedObj =
      dataSource &&
      dataSource?.trnBillGenerateList?.find((each) => each?.id == id);

    let remarksObj = {
      jrEngApprovalRemark: jrEngRole
        ? watch("remark")
        : selectedObj?.jrEngApprovalRemark,
      dyApprovalRemark: dyEngRole
        ? watch("remark")
        : selectedObj?.dyApprovalRemark,
      exApprovalRemark: exEngRole
        ? watch("remark")
        : selectedObj?.exApprovalRemark,
      deptAccApprovalRemark: deptAccRole
        ? watch("remark")
        : selectedObj?.deptAccApprovalRemark,
      hoAccApprovalRemark: hoAccRole
        ? watch("remark")
        : selectedObj?.hoAccApprovalRemark,
    };

    let temp =
      dataSource &&
      dataSource?.trnBillGenerateList?.filter((each) => each?.id == id);

    if (btnType === "ACC_APPROVE") {
      let result =
        temp &&
        temp.map((each) => {
          return {
            ...each,
            ...remarksObj,
            isApproved: true,
            isComplete: null,
            isSentToMsecdl: null,
            tippaniGenrated: each?.tippaniGenrated,
            dakhalaGenerated: each?.dakhalaGenerated,
            adeshGenerated: each?.adeshGenerated,
            tippaniRejected: each?.tippaniRejected,
          };
        });

      let _data = {
        trnBillGenerateDao: result,
      };

      const tempData = axios
        .post(`${urls.EBPSURL}/trnBillGenerate/save/multiplBills`, _data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            let string = res.data.message;
            let string1 = string.split("[");
            let billNoStr = string1[1].split("]");

            sweetAlert(
              language == "en" ? "Approved!" : "मंजूर",
              language == "en"
                ? `Bill ${billNoStr[0]} Approved Successfully !!!`
                : `बिल ${billNoStr[0]} यशस्वीरित्या मंजूर झाले !!!`,
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            getCreatedBillData();
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else if (btnType === "REVERT") {
      let result =
        temp &&
        temp.map((each) => {
          return {
            ...each,
            ...remarksObj,
            isApproved: false,
            isComplete: null,
            isSentToMsecdl: null,
          };
        });

      let _data = {
        trnBillGenerateDao: result,
      };

      const tempData = axios
        .post(`${urls.EBPSURL}/trnBillGenerate/save/multiplBills`, _data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            handleClosePaymentForm();
            setLoading(false);
            let string = res.data.message;
            let string1 = string.split("[");
            let billNoStr = string1[1].split("]");
            sweetAlert(
              language == "en" ? "Revert!" : "पूर्ववत केले",
              language == "en"
                ? `Bill ${billNoStr[0]} Revert Back successfully !`
                : `बिल ${billNoStr[0]} यशस्वीरित्या परत आले!`,
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            getCreatedBillData();
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else if (btnType === "COMPLETE") {
      let result =
        temp &&
        temp.map((each) => {
          return {
            ...each,
            ...remarksObj,
            isApproved: null,
            isComplete: true,
            isSentToMsecdl: null,
          };
        });

      let _data = {
        trnBillGenerateDao: result,
      };

      const tempData = axios
        .post(`${urls.EBPSURL}/trnBillGenerate/save/multiplBills`, _data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            let string = res.data.message;
            let string1 = string.split("[");
            let billNoStr = string1[1].split("]");
            sweetAlert(
              language == "en" ? "Completed!" : "पूर्ण झाले!",
              language == "en"
                ? `Bill ${billNoStr[0]} Completed Successfully !`
                : `बिल ${billNoStr[0]} प्रक्रिया यशस्वीरित्या पूर्ण झाली!`,
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            getCreatedBillData();
            setmodalforAprov(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else if (btnType === "REJECT") {
      let result =
        temp &&
        temp.map((each) => {
          return {
            ...each,
            ...remarksObj,
            isApproved: false,
            isComplete: null,
            isSentToMsecdl: null,
            tippaniRejected: true,
          };
        });

      let _data = {
        trnBillGenerateDao: result,
      };

      const tempData = axios
        .post(`${urls.EBPSURL}/trnBillGenerate/save/multiplBills`, _data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            let string = res.data.message;
            let string1 = string.split("[");
            let billNoStr = string1[1].split("]");
            sweetAlert(
              language == "en" ? "Reject!" : "पूर्ण झाले!",
              language == "en"
                ? `Bill ${billNoStr[0]} Rejected Successfully !`
                : `बिल ${billNoStr[0]} यशस्वीरित्या नाकारली!`,
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            getCreatedBillData();
            setmodalforAprov(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const handleGenerateBill = (id) => {
    setLoading(true);
    let temp =
      dataSource &&
      dataSource?.trnBillGenerateList?.filter((each) => each.id == id);

    let result =
      temp &&
      temp.map((each) => {
        return {
          ...each,
          isApproved: true,
          isComplete: null,
          isSentToMsecdl: null,
          tippaniGenrated: each?.tippaniGenrated,
          dakhalaGenerated: each?.dakhalaGenerated,
          adeshGenerated: each?.adeshGenerated,
          formNo14: true,
          tippaniRejected: each?.tippaniRejected,
        };
      });

    let _data = {
      trnBillGenerateDao: result,
    };

    const tempData = axios
      .post(`${urls.EBPSURL}/trnBillGenerate/save/multiplBills`, _data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          setLoading(false);
          let string = res.data.message;
          let string1 = string.split("[");
          let billNoStr = string1[1].split("]");
          sweetAlert(
            language == "en" ? "Approved!" : "मंजूर",
            language == "en"
              ? `Bill ${billNoStr[0]} send to Executive Officer for Approval !!!`
              : `बिल ${billNoStr[0]} मंजुरीसाठी कार्यकारी अधिकाऱ्यांकडे पाठवले !!!`,
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
          getCreatedBillData();
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const handlePayment = (id) => {
    setLoading(true);
    let temp =
      dataSource &&
      dataSource?.trnBillGenerateList?.find((each) => each.id == id);
    let payload = {
      ...temp,
      isApproved: true,
      isComplete: null,
      isSentToMsecdl: null,
      paymentDate: watch("paymentDate"),
      transactionNo: watch("transactionNo"),
      ddNo: watch("ddNo"),
      ecsNo: watch("ecsNo"),
      ddDate: watch("ddDate"),
      chequeDate: watch("chequeDate"),
      paymentTypeKey: watch("paymentType"),
      paymentModeKey: watch("paymentMode"),
      checkNo: watch("checkNo"),
      bankBranchNameKey: selectedBranch,
      amountToBePaid: watch("amountToBePaid"),
      billedAmount: watch("billedAmount"),
      hoAccApprovalRemark: watch("remark"),
    };

    let result = [payload];

    let _data = {
      trnBillGenerateDao: result,
    };

    const tempData = axios
      .post(`${urls.EBPSURL}/trnBillGenerate/save/multiplBills`, _data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          setLoading(false);
          let string = res.data.message;
          let string1 = string.split("[");
          let billNoStr = string1[1].split("]");
          sweetAlert(
            language == "en" ? "Done!" : "झाले",
            language == "en"
              ? `Bill ${billNoStr[0]} Payment Done Successfully !!!`
              : `बिल  ${billNoStr[0]} पेमेंट यशस्वीरित्या पूर्ण झाले !!!`,
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
          handleClosePaymentForm();
          cancellButton();
          getCreatedBillData();
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const cancellButton = () => {
    setValue("paymentDate", null);
    setValue("transactionNo", "");
    setValue("paymentType", null);
    setValue("paymentMode", null);
    setValue("checkNo", "");
    setValue("ecsNo", null);
    setValue("ddNo", null);
    setValue("checkNo", "");
  };

  const columns = [
    //Sr No
    { field: "srNo", width: 70, headerName: <FormattedLabel id="srNo" /> },

    // billNo
    {
      field: "billNo",
      headerName: <FormattedLabel id="billNo" />,
      headerAlign: "center",
      align: "center",
      width: 150,
    },

    // billedAmount
    {
      field: "billedAmount",
      headerName: <FormattedLabel id="billedAmount" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // amountToBePaid
    {
      field: "amountToBePaid",
      headerName: <FormattedLabel id="amountToBePaid" />,
      headerAlign: "center",
      align: "center",
      width: 150,
    },

    // status
    {
      field: "status",
      width: 300,
      headerName: <FormattedLabel id="status" />,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.statusCode == 8 ? (
              <p style={{ color: "#4BB543" }}>{params.row.status}</p>
            ) : params.row.statusCode == 1 ||
              params.row.statusCode == 4 ||
              params.row.statusCode == 6 ||
              params.row.statusCode == 28 ||
              params.row.statusCode == 30 ? (
              <p style={{ color: "red" }}>{params.row.status}</p>
            ) : (params.row.statusCode == 26 || params.row.statusCode == 25) &&
              authority &&
              authority.find((val) => val === "JUNIOR_ENGINEER") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.statusCode == 3 &&
              authority &&
              authority.find((val) => val === "DEPUTY_ENGINEER") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.statusCode == 5 &&
              authority &&
              authority.find((val) => val === "EXECUTIVE_ENGINEER") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.statusCode == 7 &&
              authority &&
              authority.find((val) => val === "ACCOUNTANT") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : (params.row.statusCode == 27 || params.row.statusCode == 29) &&
              authority &&
              authority.find((val) => val === "HEAD_ACCOUNTANT") ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : (
              <p style={{ color: "orange" }}>{params.row.status}</p>
            )}
          </Box>
        );
      },
    },

    //Actions
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      minWidth: 650,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.statusCode !== 26 ? (
              params?.row?.tippaniGenrated &&
              params?.row?.dakhalaGenerated &&
              params?.row?.adeshGenerated ? (
                <>
                  <Tooltip title="View" sx={{ margin: "5px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setOpenTipani(true), setSelectedId(params.row.id);
                      }}
                    >
                      {" "}
                      <RemoveRedEyeIcon style={{ color: "#fff" }} />
                      <FormattedLabel id="tipani" />
                    </Button>
                  </Tooltip>

                  <Tooltip title="View" sx={{ margin: "5px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setOpenDakhala(true), setSelectedId(params.row.id);
                      }}
                    >
                      <RemoveRedEyeIcon style={{ color: "#fff" }} />{" "}
                      <FormattedLabel id="dakhala" />
                    </Button>
                  </Tooltip>

                  <Tooltip title="View" sx={{ margin: "5px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setOpenAdesh(true), setSelectedId(params.row.id);
                      }}
                    >
                      <RemoveRedEyeIcon style={{ color: "#fff" }} />{" "}
                      <FormattedLabel id="adesh" />
                    </Button>
                  </Tooltip>

                  {params.row.formNo14 ? (
                    <Tooltip
                      title="View"
                      sx={{ marginLeft: "5px", marginRight: "5px" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setOpenBill(true);
                          setSelectedId(params.row.id);
                        }}
                      >
                        <RemoveRedEyeIcon style={{ color: "#fff" }} />
                        <FormattedLabel id="BillForm" />
                      </Button>
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}

            {/* ----- status is: Waiting For MSEDCL ----- */}

            {authority?.find((val) => val == "JUNIOR_ENGINEER") &&
            params.row.statusCode == 2 ? (
              <Tooltip
                title="Send TO MSEDCL"
                sx={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    onSubmitForm(params.row.id, "MSEDCL");
                  }}
                >
                  <FormattedLabel id="sendToMsedcl" />
                </Button>
              </Tooltip>
            ) : (
              ""
            )}

            {/* ----- status is: Waiting For Jr Eng After payment ----- */}

            {authority?.find((val) => val == "JUNIOR_ENGINEER") &&
            params.row.statusCode == 25 ? (
              <Tooltip
                title="Complete"
                sx={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    // onSubmitForm(params.row.id, "COMPLETE");
                    setmodalforAprov(true);
                    setSelectedData(params.row);
                  }}
                >
                  <FormattedLabel id="complete" />
                </Button>
              </Tooltip>
            ) : (
              ""
            )}

            {/* ----- status is: Send back Jr Engineer after revert back ----- */}

            {authority?.find((val) => val == "JUNIOR_ENGINEER") &&
            params.row.statusCode == 1 ? (
              <Tooltip
                title="Reject"
                sx={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    // onSubmitForm(params.row.id, "REJECT");
                    setmodalforAprov(true);
                    setSelectedData(params.row);
                  }}
                >
                  <FormattedLabel id="reject" />
                </Button>
              </Tooltip>
            ) : (
              ""
            )}

            {/* ----- authority: Deputy Engineer, Executive Engineer, status is: send to Dy Engineer, send to ex Engineer ----- */}

            {(authority?.find((val) => val == "DEPUTY_ENGINEER") &&
              (params.row.statusCode == 3 || params.row.statusCode == 4)) ||
            (authority?.find((val) => val == "EXECUTIVE_ENGINEER") &&
              (params.row.statusCode == 5 || params.row.statusCode == 6)) ? (
              <>
                <ScrutinyActions
                  dataSource={params.row}
                  getAllBillData={getCreatedBillData}
                />
              </>
            ) : (
              ""
            )}

            {/* ----- authority: Accountant, status is: Waiting For payment ----- */}

            {authority?.find((val) => val == "ACCOUNTANT") &&
            (params.row.statusCode == 7 || params.row.statusCode == 28) ? (
              <>
                {/* <Tooltip
                  title="Generate"
                  sx={{ marginLeft: "5px", marginRight: "5px" }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setOpenBill(true);
                      setSelectedId(params.row.id);
                      handleGenerateBill(params.row.id);
                    }}
                  >
                    <ReceiptIcon style={{ color: "#fff" }} />
                    <FormattedLabel id="BillForm" />
                  </Button>
                </Tooltip> */}

                <ScrutinyActions
                  dataSource={params.row}
                  getAllBillData={getCreatedBillData}
                />
              </>
            ) : (
              ""
            )}

            {/* ----- authority: Head Accountant, status is: Send to head accountant ----- */}

            {authority?.find((val) => val == "HEAD_ACCOUNTANT") &&
            (params.row.statusCode == 27 || params.row.statusCode == 29) ? (
              <>
                <Tooltip
                  title="Payment"
                  sx={{ marginLeft: "5px", marginRight: "5px" }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      // onSubmitForm(params.row.id, "PAYMENT");
                      setOpenPaymentForm(true);
                      setPaymentId(params.row.id);
                    }}
                  >
                    <FormattedLabel id="payment" />
                  </Button>
                </Tooltip>
              </>
            ) : (
              ""
            )}
          </Box>
        );
      },
    },

    // Remarks
    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <Tooltip title="View" sx={{ margin: "5px" }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setOpenRemarkModal(true), setRemarkId(params.row.id);
                }}
              >
                <FormattedLabel id="viewRemarks" />
              </Button>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {loading ? (
        <CommonLoader />
      ) : (
        <>
          <Box>
            <div>
              <BreadCrumb />
            </div>
          </Box>
          <div>
            <FormProvider {...methods}>
              {/* Firts Row */}

              {/* search conneaction entry by consumer number */}

              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginBottom: "8px" }}
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
                      <FormattedLabel id="generatedBillDetails" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>

              <Grid container>
                <DataGrid
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
                  // columns={columns}
                  // pageSize={5}
                  // rowsPerPageOptions={[5]}
                  // checkboxSelection

                  density="compact"
                  // autoHeight={200}
                  // rowHeight={50}
                  pagination
                  paginationMode="server"
                  loading={data?.loading}
                  rowCount={data?.totalRows}
                  rowsPerPageOptions={data?.rowsPerPageOptions}
                  page={data?.page}
                  pageSize={data?.pageSize}
                  rows={data?.rows}
                  columns={columns}
                  onPageChange={(_data) => {
                    getCreatedBillData(data?.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    getCreatedBillData(_data, data?.page);
                  }}
                />
              </Grid>

              <Grid container>
                <Modal
                  open={openTipani}
                  onClose={handleCloseTipani}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Tipani
                      handleCloseTipani={handleCloseTipani}
                      selectedId={selectedId}
                      getCreatedBillData={getCreatedBillData}
                    />
                  </Box>
                </Modal>

                <Modal
                  open={openDakhala}
                  onClose={handleCloseDakhala}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Dakhala
                      handleCloseDakhala={handleCloseDakhala}
                      selectedId={selectedId}
                      getCreatedBillData={getCreatedBillData}
                    />
                  </Box>
                </Modal>

                <Modal
                  open={openAdesh}
                  onClose={handleCloseAdesh}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Adesh
                      handleCloseAdesh={handleCloseAdesh}
                      selectedId={selectedId}
                      getCreatedBillData={getCreatedBillData}
                    />
                  </Box>
                </Modal>

                <Modal
                  open={openBill}
                  onClose={handleCloseBill}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Bill
                      handleCloseTipani={handleCloseBill}
                      selectedId={selectedId}
                      getCreatedBillData={getCreatedBillData}
                    />
                  </Box>
                </Modal>

                <Modal
                  open={openPaymentForm}
                  onClose={handleClosePaymentForm}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={paymentStyle}>
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
                            <FormattedLabel id="paymentForNewConnection" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>

                    <Grid container sx={{ padding: "10px" }}>
                      {/* First Row */}

                      {/* payment type */}

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
                          marginTop: "20px",
                        }}
                      >
                        <FormControl
                          error={!!errors.paymentType}
                          sx={{ marginTop: 0 }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="paymentType" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: "230px" }}
                                // // dissabled={inputState}
                                variant="standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="paymentType" />}
                                id="demo-simple-select-standard"
                                labelId="id='demo-simple-select-standard-label'"
                              >
                                {paymentTypes &&
                                  paymentTypes.map((paymentType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={paymentType.id}
                                    >
                                      {language == "en"
                                        ? paymentType?.paymentType
                                        : paymentType?.paymentTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="paymentType"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
                      </Grid>

                      {/* payment mode */}

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
                          marginTop: "20px",
                        }}
                      >
                        <FormControl
                          error={!!errors.paymentMode}
                          sx={{ marginTop: 0 }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="paymentMode" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: "230px" }}
                                // // dissabled={inputState}
                                variant="standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="paymentMode" />}
                                id="demo-simple-select-standard"
                                labelId="id='demo-simple-select-standard-label'"
                              >
                                {paymentModes &&
                                  paymentModes.map((paymentMode, index) => (
                                    <MenuItem
                                      key={index}
                                      value={paymentMode.id}
                                    >
                                      {language == "en"
                                        ? paymentMode?.paymentMode
                                        : paymentMode?.paymentModeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="paymentMode"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
                      </Grid>

                      {/* Bank Name */}
                      {watch("paymentType") == 1 &&
                      (watch("paymentMode") == 29 ||
                        watch("paymentMode") == 1 ||
                        watch("paymentMode") == 30) ? (
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
                              marginTop: "20px",
                            }}
                          >
                            <FormControl
                              // variant="outlined"
                              variant="standard"
                              size="small"
                              sx={{ minWidth: "230px" }}
                              error={!!errors.bankBranchNameKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {/* Location Name */}
                                {<FormattedLabel id="bankName" />}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    value={selectedBank}
                                    onChange={handleBank}
                                    label={<FormattedLabel id="bankName" />}
                                    // InputLabelProps={{
                                    //   //true
                                    //   shrink:
                                    //     (watch("officeLocation") ? true : false) ||
                                    //     (router.query.officeLocation ? true : false),
                                    // }}
                                  >
                                    {bank &&
                                      bank.map((each, index) => (
                                        <MenuItem
                                          key={index}
                                          value={each.bankName}
                                        >
                                          {language == "en"
                                            ? each.bankName
                                            : each.bankNameMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="bankName"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.bankBranchNameKey
                                  ? errors.bankBranchNameKey.message
                                  : null}
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
                              marginTop: "20px",
                            }}
                          >
                            <FormControl
                              // variant="outlined"
                              variant="standard"
                              size="small"
                              sx={{ minWidth: "230px" }}
                              error={!!errors.bankBranchNameKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {/* Location Name */}
                                {<FormattedLabel id="branchName" />}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={selectedBranch}
                                    onChange={(e) =>
                                      setSelectedBranch(e.target.value)
                                    }
                                    label="Select Service"
                                  >
                                    {branch &&
                                      branch.map((each, index) => {
                                        return (
                                          <MenuItem key={index} value={each.id}>
                                            {language == "en"
                                              ? each.branchName
                                              : each.branchNameMr}
                                          </MenuItem>
                                        );
                                      })}
                                  </Select>
                                )}
                                name="bankBranchNameKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.bankBranchNameKey
                                  ? errors.bankBranchNameKey.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}

                      {/* Cheque date */}
                      {watch("paymentType") == 1 &&
                      watch("paymentMode") == 29 ? (
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
                            marginTop: "20px",
                          }}
                        >
                          <FormControl error={!!errors.chequeDate}>
                            <Controller
                              control={control}
                              sx={{ m: 1, minWidth: "75%" }}
                              name="chequeDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    label={<FormattedLabel id="chequeDate" />}
                                    inputFormat="DD/MM/YYYY"
                                    // @ts-ignore
                                    value={field.value}
                                    onChange={(date) => {
                                      field.onChange(
                                        moment(date, "YYYY-MM-DD").format(
                                          "YYYY-MM-DD"
                                        )
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
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
                              {errors?.chequeDate
                                ? errors.chequeDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : (
                        <></>
                      )}

                      {/* DD date */}
                      {watch("paymentType") == 1 &&
                      watch("paymentMode") == 1 ? (
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
                            marginTop: "20px",
                          }}
                        >
                          <FormControl error={!!errors.ddDate}>
                            <Controller
                              control={control}
                              sx={{ m: 1, minWidth: "75%" }}
                              name="ddDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    label={<FormattedLabel id="ddDate" />}
                                    inputFormat="DD/MM/YYYY"
                                    // @ts-ignore
                                    value={field.value}
                                    onChange={(date) => {
                                      field.onChange(
                                        moment(date, "YYYY-MM-DD").format(
                                          "YYYY-MM-DD"
                                        )
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
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
                              {errors?.ddDate ? errors.ddDate.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : (
                        <></>
                      )}

                      {/* Check No/UTR NO */}
                      {watch("paymentType") == 1 &&
                      watch("paymentMode") == 29 ? (
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
                            marginTop: "20px",
                          }}
                        >
                          <TextField
                            sx={{ minWidth: "230px" }}
                            name="checkNo"
                            id="standard-textarea"
                            label={<FormattedLabel id="checkNo" />}
                            variant="standard"
                            // value={checkNo}
                            {...register("checkNo")}
                            error={!!errors.checkNo}
                            helperText={
                              errors?.checkNo ? errors?.checkNo.message : null
                            }
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                          />
                        </Grid>
                      ) : (
                        <></>
                      )}

                      {/* DD NO */}
                      {watch("paymentType") == 1 &&
                      watch("paymentMode") == 1 ? (
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
                            marginTop: "20px",
                          }}
                        >
                          <TextField
                            sx={{ minWidth: "230px" }}
                            name="ddNo"
                            id="standard-textarea"
                            label={<FormattedLabel id="ddNo" />}
                            variant="standard"
                            // value={ddNo}
                            {...register("ddNo")}
                            error={!!errors.ddNo}
                            helperText={
                              errors?.ddNo ? errors?.ddNo.message : null
                            }
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                          />
                        </Grid>
                      ) : (
                        <></>
                      )}

                      {/* ECS NO */}
                      {watch("paymentType") == 1 &&
                      watch("paymentMode") == 30 ? (
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
                            marginTop: "20px",
                          }}
                        >
                          <TextField
                            sx={{ minWidth: "230px" }}
                            name="ecsNo"
                            id="standard-textarea"
                            label={<FormattedLabel id="ecsNo" />}
                            variant="standard"
                            // value={ecsNo}
                            {...register("ecsNo")}
                            error={!!errors.ecsNo}
                            helperText={
                              errors?.ecsNo ? errors?.ecsNo.message : null
                            }
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                          />
                        </Grid>
                      ) : (
                        <></>
                      )}

                      {/* Transaction NO : show only when payment type is ONLINE */}

                      {watch("paymentType") == 2 ? (
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
                            marginTop: "20px",
                          }}
                        >
                          <TextField
                            sx={{ minWidth: "230px" }}
                            name="transactionNo"
                            id="standard-textarea"
                            label={<FormattedLabel id="transactionNo" />}
                            variant="standard"
                            // value={transactionNo}
                            {...register("transactionNo")}
                            error={!!errors.transactionNo}
                            helperText={
                              errors?.transactionNo
                                ? errors?.transactionNo.message
                                : null
                            }
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                          />
                        </Grid>
                      ) : (
                        <></>
                      )}

                      {/* Payment Date*/}

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
                          marginTop: "40px",
                        }}
                      >
                        <FormControl error={!!errors.paymentDate}>
                          <Controller
                            control={control}
                            sx={{ m: 1, minWidth: "75%" }}
                            name="paymentDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  label={<FormattedLabel id="paymentDate" />}
                                  inputFormat="DD/MM/YYYY"
                                  // @ts-ignore
                                  value={field.value}
                                  onChange={(date) => {
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
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
                            {errors?.paymentDate
                              ? errors.paymentDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Amount to be paid */}

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
                          marginTop: "20px",
                        }}
                      >
                        <TextField
                          sx={{ minWidth: "230px" }}
                          disabled
                          name="amountToBePaid"
                          id="standard-textarea"
                          label={<FormattedLabel id="amountToBePaid" />}
                          variant="standard"
                          // value={amountToBePaid}
                          {...register("amountToBePaid")}
                          error={!!errors.amountToBePaid}
                          helperText={
                            errors?.amountToBePaid
                              ? errors?.amountToBePaid.message
                              : null
                          }
                          InputLabelProps={{
                            //true
                            shrink: watch("amountToBePaid") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Billed Amount */}

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
                          marginTop: "20px",
                        }}
                      >
                        <TextField
                          sx={{ minWidth: "230px" }}
                          disabled
                          name="billedAmount"
                          id="standard-textarea"
                          label={<FormattedLabel id="billedAmount" />}
                          variant="standard"
                          // value={billedAmount}
                          {...register("billedAmount")}
                          error={!!errors.billedAmount}
                          helperText={
                            errors?.billedAmount
                              ? errors?.billedAmount.message
                              : null
                          }
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>

                      {/* Remark */}

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
                          marginTop: "20px",
                        }}
                      >
                        <TextField
                          sx={{ m: 1, minWidth: "90%" }}
                          name="remark"
                          id="standard-textarea"
                          label={<FormattedLabel id="remark" />}
                          variant="outlined"
                          // value={remark}
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors?.remark.message : null
                          }
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>

                      {/* Button Row */}

                      <Grid container mt={5} border px={5}>
                        {/* Save ad Draft */}

                        <Grid
                          item
                          xl={3}
                          lg={3}
                          md={6}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              handlePayment(paymentId);
                            }}
                          >
                            {<FormattedLabel id="sendToJrEng" />}
                          </Button>
                        </Grid>

                        <Grid
                          item
                          xl={3}
                          lg={3}
                          md={6}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              onSubmitForm(paymentId, "REVERT");
                            }}
                          >
                            {<FormattedLabel id="revert" />}
                          </Button>
                        </Grid>

                        <Grid
                          item
                          xl={3}
                          lg={3}
                          md={6}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            onClick={cancellButton}
                            size="small"
                            variant="contained"
                          >
                            {<FormattedLabel id="clear" />}
                          </Button>
                        </Grid>

                        <Grid
                          item
                          xl={3}
                          lg={3}
                          md={6}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleClosePaymentForm()}
                          >
                            {<FormattedLabel id="back" />}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              </Grid>

              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <form {...methods} onSubmit={handleSubmit("remarks")}>
                  <div className={modalStyles.model}>
                    <Modal
                      open={modalforAprov}
                      //onClose={clerkApproved}
                      onCancel={() => {
                        setmodalforAprov(false);
                      }}
                    >
                      <div className={modalStyles.boxRemark}>
                        <div className={modalStyles.titlemodelremarkAprove}>
                          <Typography
                            className={modalStyles.titleOne}
                            variant="h6"
                            component="h2"
                            color="#f7f8fa"
                            style={{ marginLeft: "25px" }}
                          >
                            <FormattedLabel id="remarkModel" />
                            {/* Enter Remark on application */}
                          </Typography>

                          <IconButton>
                            <CloseIcon
                              onClick={() => {
                                setmodalforAprov(false);
                                setValue("remark", "");
                              }}
                            />
                          </IconButton>
                        </div>

                        <div
                          className={modalStyles.btndate}
                          style={{ marginLeft: "20%", marginRight: "20%" }}
                        >
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={4}
                            placeholder="Enter a Remarks"
                            style={{ width: "100%" }}
                            // onChange={(e) => {
                            //   setRemark(e.target.value)
                            // }}
                            // name="remark"
                            {...register("remark")}
                          />
                        </div>

                        {authority?.find((val) => val == "JUNIOR_ENGINEER") &&
                        selectedData?.statusCode == 1 ? (
                          <div className={modalStyles.btnappr}>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              endIcon={<UndoIcon />}
                              onClick={() => {
                                onSubmitForm(selectedData?.id, "REJECT");
                              }}
                            >
                              <FormattedLabel id="submit" />
                            </Button>
                          </div>
                        ) : authority?.find(
                            (val) => val == "JUNIOR_ENGINEER"
                          ) && selectedData?.statusCode == 25 ? (
                          <div className={modalStyles.btnappr}>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              endIcon={<UndoIcon />}
                              onClick={() => {
                                onSubmitForm(selectedData?.id, "COMPLETE");
                              }}
                            >
                              <FormattedLabel id="submit" />
                            </Button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Modal>
                  </div>
                </form>
              </Grid>

              <Modal
                open={openRemarkModal}
                onClose={() => {
                  setOpenRemarkModal(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={remarkStyle}>
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
                          <FormattedLabel id="remarksOfAllAuthorities" />
                        </h3>
                      </Grid>
                    </Grid>
                  </Box>

                  <Grid container sx={{ padding: "10px" }}>
                    {/* Deputy engineer Remark */}

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
                        marginTop: "20px",
                      }}
                    >
                      <TextField
                        disabled
                        multiline
                        sx={{ m: 1, minWidth: "50%" }}
                        name="remark"
                        id="standard-textarea"
                        label={<FormattedLabel id="dyEngRemark" />}
                        variant="outlined"
                        value={watch("dyApprovalRemark")}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors?.remark.message : null
                        }
                        InputLabelProps={{
                          //true
                          shrink: watch("dyApprovalRemark") ? true : false,
                        }}
                      />
                    </Grid>

                    {/* Executive engineer Remark */}

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
                        marginTop: "20px",
                      }}
                    >
                      <TextField
                        disabled
                        multiline
                        sx={{ m: 1, minWidth: "50%" }}
                        name="remark"
                        id="standard-textarea"
                        label={<FormattedLabel id="exEngRemark" />}
                        variant="outlined"
                        value={watch("exApprovalRemark")}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors?.remark.message : null
                        }
                        InputLabelProps={{
                          //true
                          shrink: watch("exApprovalRemark") ? true : false,
                        }}
                      />
                    </Grid>

                    {/* HO Accountant Remark */}

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
                        marginTop: "20px",
                      }}
                    >
                      <TextField
                        disabled
                        multiline
                        sx={{ m: 1, minWidth: "50%" }}
                        name="remark"
                        id="standard-textarea"
                        label={<FormattedLabel id="hoAccRemark" />}
                        variant="outlined"
                        value={watch("hoAccApprovalRemark")}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors?.remark.message : null
                        }
                        InputLabelProps={{
                          //true
                          shrink: watch("hoAccApprovalRemark") ? true : false,
                        }}
                      />
                    </Grid>

                    {/* Junior engineer Remark */}

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
                        marginTop: "20px",
                      }}
                    >
                      <TextField
                        disabled
                        multiline
                        sx={{ m: 1, minWidth: "50%" }}
                        name="remark"
                        id="standard-textarea"
                        label={<FormattedLabel id="jrEngRemark" />}
                        variant="outlined"
                        value={watch("jrEngApprovalRemark")}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors?.remark.message : null
                        }
                        InputLabelProps={{
                          //true
                          shrink: watch("jrEngApprovalRemark") ? true : false,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => {
                        setOpenRemarkModal(false),
                          setRemarkId(),
                          setValue("jrEngApprovalRemark", "");
                        setValue("dyApprovalRemark", "");
                        setValue("exApprovalRemark", "");
                        setValue("deptAccApprovalRemark", "");
                        setValue("hoAccApprovalRemark", "");
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Box>
              </Modal>
            </FormProvider>
          </div>
        </>
      )}
    </>
  );
};

export default Index;
