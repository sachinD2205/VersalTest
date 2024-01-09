import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import styles from "../../../../styles/LegalCase_Styles/parawiseReport.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import FileTable from "../../FileUpload/FileTableLcWithoutAddButton";
import { Visibility } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { toast, ToastContainer } from "react-toastify";
import UndoIcon from "@mui/icons-material/Undo";
import sweetAlert from "sweetalert";
import DeleteIcon from "@mui/icons-material/Delete";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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

const DigitalSignature = () => {
  const methods = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      parawiseTrnParawiseReportDaoLst: [
        {
          issueNo: "",
          paragraphWiseAanswerDraftOfIssues: "",
          paragraphWiseAanswerDraftOfIssuesMarathi: "",
        },
      ],
    },
  });

  const {
    getValues,
    setValue,
    control,
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [noticeId, setNoticeId] = React.useState(null);
  const router = useRouter();

  const [requisitionDate, setRequisitionDate] = React.useState(null);
  let pageType = false;
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [mode, setMode] = useState();
  const token = useSelector((state) => state.user.user.token);
  const [employeeList, setEmployeeList] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [authority, setAuthority] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [audienceSample, setAudienceSample] = useState(selectedNotice);
  const [noticeData, setNoticeData] = useState();
  const language = useSelector((state) => state.labels.language);
  // noticeData
  const [concerDeptList, setConcernDeptList] = useState([]);
  const [noticeHistoryList, setNoticeHistoryList] = useState([]);
  const [approveRejectRemarkMode, setApproveRejectRemarkMode] = useState("");
  const handleOpen = (approveRejectRemarkMode) => {
    setOpen(true);
    setApproveRejectRemarkMode(approveRejectRemarkMode);
  };
  const handleClose = () => setOpen(false);
  const [parawiseReportList, setParawiseReportList] = useState([]);
  const [open, setOpen] = useState(false);
  const selectedNotice = useSelector((state) => {
    console.log("selectedNotice", state.user.selectedNotice);
    return state.user.selectedNotice;
  });

  const [parawiseReportId, setParawiseReportId] = useState();
  const [parawiseReport, setParawiseReport] = useState();

  let user = useSelector((state) => state.user.user);

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

  //key={field.id}

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "parawiseReportDao", // unique name for your Field Array
    }
  );

  //
  // Determine the value based on the language
  const noticeReceivedValue =
    language === "english" ? "Your English Value" : "Your Marathi Value";
  //
  const onFinish = () => {};
  // userName
  // const getUserName = async () => {
  //   await axios
  //     .get(`${urls.CFCURL}/master/user/getAllOLD`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((r) => {
  //       if (r.status == 200) {
  //         console.log("res user", r);
  //         setEmployeeList(r.data.user);
  //       }
  //     })
  //     ?.catch((err) => {
  //       console.log("err", err);
  //       callCatchMethod(err, language);
  //     });
  // };

  // departments
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let ds = res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        }));

        console.log("ds", ds);
        setDepartments(ds);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // authority
  const getAuthority = () => {
    axios
      .get(`${urls.CFCURL}/master/employee/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Authority yetayt ka re: ", res.data);
        setAuthority(
          res.data.map((r, i) => ({
            id: r.id,
            firstName: r.firstName,
            middleName: r.middleName,
            lastName: r.lastName,
            department: r.department,
            departmentName: departments?.find((obj) => obj?.id === r.department)
              ?.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // ParawiseReport
  const getParawiseReport = (noticeIdPassed) => {
    let url = `${urls.LCMSURL}/parawiseReport/getByNoticeIdAndDeptId?noticeId=${noticeIdPassed}&deptId=${user?.userDao?.department}`;

    console.log("url", url);
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res parawiseReport", r);
        if (r.status == 200) {
          console.log("res office location", r);
          setParawiseReport(r.data);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Location
  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(r.data.officeLocation);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Notice Attachments
  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: <FormattedLabel id="action" />,
      headerName: "Action",
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,

                  "_blank"
                );
              }}
            >
              <Visibility />
            </IconButton>
          </>
        );
      },
    },
  ];

  // Notice Remark
  const _columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeSentDate",
      headerName: <FormattedLabel id="remarkDate" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeRecivedFromPerson",
      headerName: <FormattedLabel id="user" />,
      width: 250,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "department",
      headerName: <FormattedLabel id="deptName" />,
      // type: "number",
      width: 150,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  // concer Dept noticeAttachment
  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "locationNameEn" : "locationNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: <FormattedLabel id="subDepartment" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
  ];

  // parawiseRportColumns
  const parawiseRportColums = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "issueNo",
      headerName: <FormattedLabel id="issueNo" />,
      flex: 1,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAanswerDraftOfIssues",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAanswerDraftOfIssuesMarathi",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  // Parawise Response
  // const parawiseResponseColumn = [
  //   {
  //     headerName: <FormattedLabel id="srNo" />,
  //     field: "srNo",
  //     width: 100,
  //     align: "center",
  //     headerAlign: "center",
  //     renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
  //   },
  //   {
  //     headerName: "Parawise Remark English",
  //     field: "parawiseRemarkEnglish",
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     headerName: "Parawise Remark Marathi",
  //     field: "parawiseRemarkMarathi",
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  // ];

  useEffect(() => {
    getDepartments();
    getOfficeLocation();
    // getUserName();
    // getAuthority();
  }, []);

  useEffect(() => {
    // set NotifData only if departments is not null and not empty
    if (departments != null && departments.length > 0) {
      console.log("departments", departments);
      setNoticeData(selectedNotice);
    }
  }, [departments]);

  useEffect(() => {
    let clerkApprovalRemarkAfterParawise =
      noticeData?.clerkApprovalRemarkAfterParawise;
    console.log(
      "clerkApprovalRemarkAfterParawise",
      clerkApprovalRemarkAfterParawise
    );

    // check if clerkApprovalRemarkAfterParawise is not null
    if (clerkApprovalRemarkAfterParawise == null) {
      return;
    }

    // convert clerkApprovalRemarkAfterParawise to json array
    let _clerkApprovalRemarkAfterParawise = JSON.parse(
      clerkApprovalRemarkAfterParawise
    );
    console.log(
      "_clerkApprovalRemarkAfterParawise",
      _clerkApprovalRemarkAfterParawise
    );

    // iterate over _clerkApprovalRemarkAfterParawise
    remove();

    _clerkApprovalRemarkAfterParawise?.map((item, i) => {
      console.log("valjsonsagar", item);
      console.log("i", i);
      if (item.issueNo != null && item.issueNo != "") {
        // append to Fields
        append({
          departmentId: item.departmentId,
          // fetch departmentName from department id by refering to departmentList if departmentList is not null else assign "sagar"
          departmentName: departments?.find(
            (dept) => dept.id === item.departmentId
          )?.department,
          issueNo: item.issueNo,
          parawiseRemarkEnglish: item.parawiseRemarkEnglish,
          parawiseRemarkMarathi: item.parawiseRemarkMarathi,
          parawiseLegalClerkRemarkEnglish: item.parawiseLegalClerkRemarkEnglish,
          parawiseLegalClerkRemarkMarathi: item.parawiseLegalClerkRemarkMarathi,
        });
      }

      console.log("fields", fields);
    });
  }, [noticeData]);

  useEffect(() => {
    console.log("Notice DAta", noticeData);
    setValue(
      "noticeRecivedDate",
      moment(noticeData?.noticeRecivedDate).format("DD/MM/YYYY")
    );
    setValue("noticeDate", noticeData?.noticeDate);
    setValue("advocateAddressMr", noticeData?.advocateAddressMr);

    if (language == "en") {
      setValue(
        "noticeReceivedFromAdvocatePersonENMR",
        noticeData?.noticeReceivedFromAdvocatePerson
      );
    } else {
      setValue(
        "noticeReceivedFromAdvocatePersonENMR",
        noticeData?.noticeRecivedFromAdvocatePersonMr
      );
    }

    setValue(
      "noticeRecivedFromAdvocatePerson",
      noticeData?.noticeReceivedFromAdvocatePerson
    );
    setValue("requisitionDate", noticeData?.requisitionDate);
    // setValue(
    //   "noticeRecivedFromAdvocatePerson",
    //   noticeData?.noticeReceivedFromAdvocatePerson
    // );
    // noticeRecivedFromAdvocatePersonMr
    setValue(
      "noticeRecivedFromAdvocatePersonMr",
      noticeData?.noticeRecivedFromAdvocatePersonMr
    );
    setValue("noticeDetails", noticeData?.noticeDetails);
    setValue("inwardNo", noticeData?.inwardNo);

    // notice id
    setNoticeId(noticeData?.id);

    if (noticeId) {
      getParawiseReport(noticeData?.id);
    }

    // concernDept - Details
    let _ress = noticeData?.concernDeptUserList?.map((val, i) => {
      console.log("resd", val);
      return {
        srNo: i + 1,
        id: i,
        departmentNameEn: departments?.find(
          (obj) => obj?.id === val.departmentId
        )?.department,
        departmentNameMr: departments?.find(
          (obj) => obj?.id === val.departmentId
        )?.departmentMr,
        locationNameEn: officeLocationList?.find(
          (obj) => obj?.id === val.locationId
        )?.officeLocationName,
        locationNameMr: officeLocationList?.find(
          (obj) => obj?.id === val.locationId
        )?.officeLocationNameMar,
        departmentId: val?.departmentId,
        locationId: val?.locationId,
      };
    });
    setConcernDeptList(_ress);

    // Notice History
    let _noticeHisotry = noticeData?.noticeHisotry?.map((file, index) => {
      return {
        id: index,
        srNo: index + 1,
        remark: file.remark ? file.remark : "-",
        designation: file.designation ? file.designation : "Not Available",
        noticeRecivedFromPerson: employeeList.find(
          (obj) => obj.id === file.noticeRecivedFromPerson
        )?.firstNameEn
          ? employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)
              ?.firstNameEn
          : "Not Available",
        department: departments?.find(
          (obj) =>
            obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
        )?.department
          ? departments?.find(
              (obj) =>
                obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
            )?.department
          : "Not Available",
        noticeSentDate: file.noticeSentDate
          ? file.noticeSentDate
          : "Not Available",
      };
    });

    setNoticeHistoryList(_noticeHisotry);

    // Notice Attachment
    if (employeeList.length > 0 && departments.length > 0) {
      const noticeAttachment = [...selectedNotice.noticeAttachment];
      let _noticeAttachment = noticeAttachment.map((file, index) => {
        console.log("23", file);
        return {
          id: file.id ? file.id : "Not Available",
          srNo: file.id ? file.id : "Not Available",
          originalFileName: file.originalFileName
            ? file.originalFileName
            : "Not Available",
          extension: file.extension ? file.extension : "Not Available",
          attachedNameEn: file.attachedNameEn
            ? file.attachedNameEn
            : "Not Available",
          attachedNameMr: file.attachedNameMr
            ? file.attachedNameMr
            : "Not Available",
          filePath: file.filePath ? file.filePath : "-",
        };
      });
      _noticeAttachment !== null && setMainFiles([..._noticeAttachment]);
    }

    // Parawise Report
    let _parawiseReport = noticeData?.parawiseTrnParawiseReportDaoLst?.map(
      (val, i) => {
        console.log("resd", val);
        return {
          srNo: i + 1,
          id: i,
          paragraphWiseAanswerDraftOfIssues:
            val?.paragraphWiseAanswerDraftOfIssues,
          paragraphWiseAanswerDraftOfIssuesMarathi:
            val?.paragraphWiseAanswerDraftOfIssuesMarathi,
          issueNo: val?.issueNo,
        };
      }
    );
    setParawiseReportList(_parawiseReport);

    // add data in fields
  }, [officeLocationList, departments, employeeList, authority, noticeData]);

  useEffect(() => {
    console.log("parawiseReportList", parawiseReportList);
    console.log("concerDeptList", concerDeptList);
  }, [concerDeptList, noticeHistoryList, finalFiles, parawiseReportList]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  // for Reset
  useEffect(() => {
    if (router.query.pageMode == "Final") {
      console.log("Data------", router.query);
      setValue(
        "noticeReceivedFromAdvocatePerson",
        router.query.noticeReceivedFromAdvocatePerson
      );

      if (language == "en") {
        setValue(
          "noticeReceivedFromAdvocatePersonENMR",
          router?.query?.noticeReceivedFromAdvocatePerson
        );
      } else {
        setValue(
          "noticeReceivedFromAdvocatePersonENMR",
          router?.query?.noticeRecivedFromAdvocatePersonMr
        );
      }

      setValue(
        "noticeRecivedFromAdvocatePerson",
        router?.query?.noticeReceivedFromAdvocatePerson
      );
      setValue(
        "noticeRecivedFromAdvocatePersonMr",
        router?.query?.noticeRecivedFromAdvocatePersonMr
      );

      //

      if (language == "en") {
        setValue("advocateAddressNew", router?.query?.advocateAddress);
      } else {
        setValue("advocateAddressNew", router?.query?.advocateAddressMr);
      }

      //

      setValue("advocateAddress", router.query.advocateAddress);
      // advocateAddressMr
      setValue("advocateAddressMr", router.query.advocateAddressMr);

      setValue("clerkRemarkEn", router.query.clerkRemarkEn);
      setValue("noticeRecivedDate", router.query.noticeRecivedDate);

      // setValue("caseNumber", router.query.caseNumber);
      reset(router.query);

      if (noticeId) {
        getParawiseReport(noticeData?.id);
      }
    }
  }, []);

  // Save - DB
  const onSubmitForm = (Data) => {
    console.log("data", Data);
    // const opinionRequestDate = moment(Data.opinionRequestDate).format("DD-MM-YYYY");
    let body = {
      ...Data,
      opinionRequestDate,
      opinionAdvPanelList: selectedID.map((val) => {
        return {
          advocate: val,
        };
      }),

      // role: "OPINION_CREATE",
      status:
        buttonText === "saveAsDraft" ? "OPINION_DRAFT" : "OPINION_CREATED",
      sentToAdvocate: buttonText === "saveAsDraft" ? "N" : "Y",
      role:
        buttonText === "saveAsDraft"
          ? "OPINION_SAVE_AS_DRAFT"
          : "CREATE_OPINION",

      // role:
      //   Data.target.textContent === "Submit"
      //     ? "OPINION_CREATE"
      //     : "OPINION_DRAFT",

      reportAdvPanelList: selectedID1.map((val) => {
        return {
          advocate: val,
        };
      }),

      // id: null,
      //name
      id: router.query.pageMode == "Opinion" ? null : Data.id,

      // role :"OPINION_DRAFT"

      // role:"OPINION_SAVE_AS_DRAFT"
    };

    console.log("body", body);

    axios
      .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res123", res);
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/opinion`);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    if (language == "en") {
      setValue(
        "noticeReceivedFromAdvocatePersonENMR",
        watch("noticeRecivedFromAdvocatePerson")
      );
    } else {
      setValue(
        "noticeReceivedFromAdvocatePersonENMR",
        watch("noticeRecivedFromAdvocatePersonMr")
      );
    }
    console.log(
      "language324",
      language,
      watch("noticeRecivedFromAdvocatePersonMr"),
      watch("noticeRecivedFromAdvocatePerson")
    );
  }, [language]);
  //
  useEffect(() => {
    if (language == "en") {
      setValue("advocateAddressNew", watch("advocateAddress"));
    } else {
      setValue("advocateAddressNew", watch("advocateAddressMr"));
    }

    console.log(
      "language3",
      language,
      watch("advocateAddress"),
      watch("advocateAddressMr")
    );
  }, [language]);

  useEffect(() => {
    console.log("router?.query", router?.query);
  }, [router?.query]);

  // view
  return (
    <>
      {/* New Header */}

      <Grid
        container
        // style={{
        //   background:
        //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        // }}

        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#556CD6",
          // backgroundColor: "#1C39BB",
          height: "8vh",

          // #00308F
          // color: "white",

          fontSize: 19,
          // marginTop: 30,
          // marginBottom: "50px",
          // marginTop: ,
          // padding: 8,
          // paddingLeft: 30,
          // marginLeft: "50px",
          marginRight: "75px",
          borderRadius: 100,
          width: "90%",
          marginLeft: "4vw",
        }}
      >
        <IconButton>
          <ArrowBackIcon
            sx={{
              color: "white",
              marginBottom: "2vh",
            }}
            onClick={() => {
              router?.query?.noticeStatus
                ? router.push({
                    pathname: "/LegalCase/dashboard",
                    // query: { serviceId: router?.query?.serviceId },
                  })
                : router.back();
            }}
          />
        </IconButton>

        <Grid item xs={11}>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {" "}
            <FormattedLabel id="notice" />
          </h2>
        </Grid>
      </Grid>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmitForm)}>
          <Paper
            sx={{
              // margin: 3,
              borderRadius: ".8rem",
              border: "1px solid #e9ebed", // Add border to the Paper component
              // boxShadow: "-4px -6px #e9ebed", // If you want a boxShadow as well
              // background: "red",
              backgroundColor: "ButtonShadow",
              display: "flex",
              justifyContent: "center",
            }}
            elevation={5}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <Box
                  style={{
                    marginTop: "10px",
                    // backgroundColor: "black",
                  }}
                ></Box>

                <FormProvider {...methods}>
                  <Paper
                    style={{
                      width: "65%",
                      marginTop: "4vh",
                      // marginLeft: "15%",
                      // backgroundColor: "black ",
                      // display: "flex",
                      // justifyContent: "center",
                      borderRadius: ".8rem",
                      border: "1px solid #e9ebed",
                    }}
                  >
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                      <Box
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                        }}
                      >
                        {/* <Button
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            overflow: "hidden",
                            fontSize: "10px",
                            whiteSpace: "normal",
                            backgroundColor: "green",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#fff",
                              color: "#556CD6",
                            },
                          }}
                        >
                          Apply Digital Signature
                        </Button> */}
                      </Box>
                      <Grid
                        container
                        style={{
                          marginLeft: "50px",
                          marginTop: "40px",
                        }}
                      >
                        <Grid item xs={7}>
                          {/* <Typography>Notice Reply Draft.</Typography> */}
                        </Grid>
                        <Grid item xs={3}>
                          <Typography
                            style={{
                              fontSize: "16px",
                              // fontWeight: "bold",
                            }}
                          >
                            {/* PIMPRI CHINCHWAD MUNICIPAL CORPORATION, */}
                            {/* <FormattedLabel id="pIMPRICHINCHWADMUNICIPALCORPORATION" /> */}
                            पिंपरी चिंचवड महानगरपालिका,
                          </Typography>
                          <Typography
                            style={{
                              fontSize: "16px",
                              // fontWeight: "bold",
                            }}
                          >
                            {/* PIMPRI- 411018."" */}
                            {/* <FormattedLabel id="pIMPRI411018" /> */}
                            पिंपरी– ४११ ०१८,
                          </Typography>
                          <Typography></Typography>
                        </Grid>
                      </Grid>

                      {/* Date Picker */}
                      <Grid
                        container
                        style={{
                          marginLeft: "50px",
                        }}
                      >
                        <Grid item xs={7}></Grid>
                        <Grid
                          item
                          sx={{
                            marginTop: "5px",
                          }}
                          xs={0.6}
                        >
                          <Typography
                            style={{
                              fontSize: "16px",
                              // fontWeight: "bold",
                            }}
                          >
                            {/* <FormattedLabel id="date" /> -{" "} */}
                            दिनांक:-
                          </Typography>
                        </Grid>
                        <Grid item>
                          <TextField
                            sx={{
                              marginLeft: "15px",
                            }}
                            id="standard-textarea"
                            multiline
                            variant="standard"
                            // style={{ width: 200 }}
                            {...register("noticeRecivedDate")}
                            error={!!errors.noticeRecivedDate}
                            helperText={
                              errors?.noticeRecivedDate
                                ? errors.noticeRecivedDate.message
                                : null
                            }
                            InputProps={{
                              disableUnderline: true,
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid
                          item
                          sx={{
                            marginLeft: "100px",
                            // backgroundColor: "red",
                          }}
                          xs={4}
                        >
                          <Typography>
                            {/* To, */}
                            {/* <FormattedLabel id="to" /> */}
                            प्रति,
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box>
                        <Grid
                          container
                          sx={{
                            marginLeft: "100px",
                          }}
                        >
                          {/* textfield for Department Name */}

                          <Grid item>
                            <TextField
                              sx={{ width: 200 }}
                              id="standard-textarea"
                              variant="standard"
                              // style={{ width: 200 }}
                              {...register("noticeRecivedFromAdvocatePersonMr")}
                              InputProps={{
                                disableUnderline: true,
                                // style: { fontWeight: 'bold' },
                              }}
                              // value={
                              //   language === "en"
                              //     ? "noticeReceivedFromAdvocatePerson"
                              //     : "noticeRecivedFromAdvocatePersonMr"
                              // }
                            />
                          </Grid>
                        </Grid>

                        {/* for Advocate Address */}
                        <Grid
                          container
                          sx={{
                            marginLeft: "100px",
                          }}
                        >
                          <Grid
                            item
                            style={
                              {
                                // background: "red",
                              }
                            }
                            xl={3}
                            lg={3}
                          >
                            <TextField
                              fullWidth
                              // disabled
                              multiline
                              id="standard-textarea"
                              placeholder="Address"
                              variant="standard"
                              {...register("advocateAddressMr")}
                              InputProps={{
                                disableUnderline: true,
                              }}
                            />
                          </Grid>
                          <Grid item xl={3} lg={3}></Grid>
                        </Grid>

                        <Grid
                          container
                          sx={{
                            marginTop: "40px",
                          }}
                          spacing={1}
                        >
                          <Grid item xs={4}></Grid>

                          <Grid item xs={6}>
                            {/* <TextField
                              variant="standard"
                              id="myTextField"
                              InputProps={{
                                disableUnderline: true,
                              }}
                              fullWidth
                              {...register("opinionSubject")}
                            /> */}
                          </Grid>
                        </Grid>

                        {/* <Box
                           
                            height="100%"
                            flex={1}
                            flexDirection="column"
                            display="flex"
                            p={2}
                            padding="0px"
                            
                          > */}
                        {/* Response to notice Details */}

                        {/* Constant Format */}
                        <Grid container>
                          <Grid item xl={11} lg={11}>
                            <Typography
                              style={{
                                marginLeft: "95px",
                                fontWeight: 200,
                                textIndent: "50px",
                              }}
                            >
                              {"   "}
                              आपण आपले अशिल {`${router?.query?.clientNameMr} `}
                              यांचेवतीने दि.
                              {`${router?.query?.noticeRecivedDate}`} रोजी
                              दिलेली नोटीस या मनपास प्राप्त झाली आहे.
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          style={{
                            marginTop: "5vh",
                            padding: "1px",
                          }}
                        >
                          <Grid item xl={11} lg={11}>
                            <Typography
                              style={{
                                marginLeft: "95px",
                                fontWeight: 200,
                                textIndent: "50px",
                                lineHeight: "1.9", // Adjust the line height as needed
                                letterSpacing: "0.5px",
                              }}
                            >
                              {"   "}
                              प्रथमत: तुमच्या आशिलाद्वारे तुम्ही पाठविलेल्या
                              कायदेशीर नोटीसमधील मजकुर व त्यातील आशय हे तुमच्या
                              अशिलाने आपल्या स्वत:च्या सोईनुसार रुपांतरीत केलेला
                              आहे, जे वस्तुस्थितीशी निगडीत नाही. यापुढे विशेषत:
                              स्विकारलेल्या बाबी वगळता इतर सर्व मजकूर खरा व
                              बरोबर नसल्याने तो या मनपास मान्य अथवा कबुल नव्हता
                              व नाही. स्पष्टीकरणाच्या सुलभतेसाठी कोणतीही बाब
                              नाकारली गेली नाही तर ती आमच्याद्वारे स्विकारल्याचे
                              मानले जाऊ नये. सदर नोटीशीच्या अनुषंगाने
                              परिच्छेदनिहाय उत्तर पुढीलप्रमाणे आहे.
                            </Typography>
                          </Grid>
                        </Grid>
                        {fields.map((parawise, index) => {
                          return (
                            <>
                              <Grid
                                container
                                // className={styles.theme2}
                                // component={Box}
                                style={{ marginTop: 20 }}
                              >
                                <Grid item xs={0.1}></Grid>

                                <Grid item xs={0.1}></Grid>

                                <Grid item xs={0.2}></Grid>

                                <Grid item xs={0.3}></Grid>
                              </Grid>

                              {/* responses by legal clerk*/}
                              <Grid
                                container
                                className={styles.theme2}
                                component={Box}
                                style={{
                                  marginTop: 20,
                                  marginBottom: "20px",
                                  marginLeft: "80px",
                                }}
                              >
                                <Grid
                                  item
                                  xs={0.4}
                                  //  sx={{ display: "flex", justifyContent: "center" }}
                                >
                                  <TextField
                                    disabled
                                    variant="standard"
                                    InputProps={{ disableUnderline: true }}
                                    placeholder="Issue No"
                                    size="small"
                                    type="number"
                                    // oninput="auto_height(this)"
                                    {...register(
                                      `parawiseReportDao.${index}.issueNo`
                                    )}
                                  ></TextField>
                                </Grid>

                                <Grid item xs={0.1}></Grid>
                                {/* para for english */}
                                <Grid
                                  item
                                  xs={10}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <TextField // style={auto_height_style}
                                    disabled
                                    // rows="1"
                                    // style={{ width: 500 }}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Legal Clerk Response(In English)"
                                    variant="standard"
                                    InputProps={{ disableUnderline: true }}
                                    size="small"
                                    // oninput="auto_height(this)"
                                    {...register(
                                      `parawiseReportDao.${index}.parawiseLegalClerkRemarkEnglish`
                                    )}
                                  ></TextField>
                                </Grid>

                                <Grid item xs={0.3}></Grid>
                              </Grid>

                              {/* Grid for Marathi Remark */}
                              <Grid
                                container
                                className={styles.theme2}
                                component={Box}
                                style={{
                                  marginTop: 20,
                                  marginBottom: "20px",
                                  marginLeft: "80px",
                                }}
                              >
                                <Grid
                                  item
                                  xs={0.5}
                                  //  sx={{ display: "flex", justifyContent: "center" }}
                                ></Grid>

                                {/* para for Marathi */}
                                <Grid
                                  item
                                  xs={10}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <TextField // style={auto_height_style}
                                    disabled
                                    // rows="1"
                                    // style={{ width: 500 }}
                                    variant="standard"
                                    InputProps={{ disableUnderline: true }}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Legal Clerk Response(In Marathi)"
                                    size="small"
                                    // oninput="auto_height(this)"
                                    {...register(
                                      `parawiseReportDao.${index}.parawiseLegalClerkRemarkMarathi`
                                    )}
                                  ></TextField>
                                </Grid>
                              </Grid>
                            </>
                          );
                        })}
                        {/* </ThemeProvider> */}
                        {/* </Box> */}
                        {/* </Box> */}

                        {/* Digital sign Box */}
                        <Grid
                          container
                          style={{
                            marginTop: "20vh",
                          }}
                        >
                          <Grid item xl={7} lg={6}>
                            {" "}
                          </Grid>
                          <Grid item>
                            <Box
                              style={{
                                // background: "red",
                                width: "280px",
                                height: "100px",
                                border: "2px solid #000",
                                marginLeft: "100px",
                              }}
                            >
                              <h3
                                style={{
                                  marginLeft: "100px",
                                }}
                              >
                                {" "}
                                {/* HOD */}
                                <FormattedLabel id="hod" />
                              </h3>
                            </Box>
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          sx={{
                            marginTop: "20vh",
                          }}
                        >
                          <Grid item xs={8.5}></Grid>
                          <Grid
                            item
                            xs={3.5}
                            sx={{
                              marginBottom: "50px",
                            }}
                          >
                            {/* <h4>PIMPRI CHINCHWAD MUNICIPAL CORPORATION</h4> */}
                            <h3>
                              <FormattedLabel id="pIMPRICHINCHWADMUNICIPALCORPORATION" />
                            </h3>
                            {/* <h4>PIMPRI- 411018.</h4> */}
                            <h3>
                              <FormattedLabel id="pIMPRI411018" />
                            </h3>
                            <Typography></Typography>
                            {/* <Typography>जा.क्र.</Typography> */}
                          </Grid>
                        </Grid>

                        {/* </Box> */}
                      </Box>
                    </form>
                  </Paper>
                </FormProvider>
              </>
            )}
          </Paper>
          <Grid container>
            {/* <Grid item>
            <Button
                  type='primary'
                  variant='contained'
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    
                      
                      router.push({
                        pathname: "/LegalCase/transaction/Notice",
                      });
                  }}
                >
                  
                  <FormattedLabel id="back"/>
                </Button>
            </Grid> */}
          </Grid>
        </form>
      </FormProvider>
    </>
  );
};

export default DigitalSignature;
