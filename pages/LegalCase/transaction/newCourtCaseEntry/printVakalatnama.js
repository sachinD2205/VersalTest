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

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
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
import { useReactToPrint } from "react-to-print";
import { ExitToApp, Print } from "@mui/icons-material";
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

const Vakalatnama = () => {
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
    handleSubmit,
    formState: { errors },
  } = methods;
  const [noticeId, setNoticeId] = React.useState(null);
  const router = useRouter();

  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Vakalatnama",
    pageStyle: "A4",

    // onAfterPrint: () => alert('Print success'),
  });

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
  const [data, setData] = useState();
  const [courtNames, setCourtNames] = useState([]);

  const [advocateNames, setAdvocateNames] = useState([]);

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

  useEffect(() => {
    getDepartments();
    getOfficeLocation();
    getUserName();
    // getAuthority();
    getCourtName();
    // getAdvocateName()
  }, []);

  //key={field.id}

  // getByID
  useEffect(() => {
    if (router?.query?.id) {
      axios
        .get(
          `${urls.LCMSURL}/transaction/newCourtCaseEntry/getByIdV1?id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          console.log("data234234", r.data);
          setData(r?.data);
        })
        .catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  }, []);

  // getCourt Name
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      })
      .catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // getAdvocate Name

  // const getAdvocateName = () => {
  //   axios.get(`${urls.LCMSURL}/master/advocate/getById?id=${id}`).then((res) => {
  //     setAdvocateNames({...res.data})
  //     // city

  //     // setAdvocateNames(
  //     //   res.data.advocate.map((r, i) => ({
  //     //     id: r.id,
  //     //     advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
  //     //     advocateNameMr: r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
  //     //   })),
  //     // );
  //   });
  // };

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "parawiseReportDao", // unique name for your Field Array
    }
  );

  const onFinish = () => {};
  // userName
  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getUserBasicDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res userList", r);
          setEmployeeList(r.data.userList);
        }
      })
      .catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

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
    setValue("noticeRecivedDate", noticeData?.noticeRecivedDate);
    setValue("noticeDate", noticeData?.noticeDate);
    setValue(
      "noticeRecivedFromAdvocatePerson",
      noticeData?.noticeRecivedFromAdvocatePerson
    );
    setValue("requisitionDate", noticeData?.requisitionDate);
    setValue(
      "noticeRecivedFromAdvocatePerson",
      noticeData?.noticeReceivedFromAdvocatePerson
    );
    setValue(
      "noticeRecivedFromAdvocatePersonMr",
      noticeData?.noticeReceivedFromAdvocatePersonMr
    );
    setValue("noticeDetails", noticeData?.noticeDetails);
    setValue("inwardNo", noticeData?.inwardNo);

    // notice id
    setNoticeId(noticeData?.id);

    // getParawiseReport(noticeData?.id);

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
    console.log("Data------", router.query);
    // setValue("noticeReceivedFromAdvocatePerson", router.query.noticeReceivedFromAdvocatePerson);
    setValue("advocateName1", router.query.advocateName1);
    setValue("courtNameEn", router.query.courtNameEn);
    setValue("filedAgainst", router.query.filedAgainst);
    // filedBy
    setValue("filedBy", router.query.filedBy);

    // setValue("caseNumber", router.query.caseNumber);
    reset(router.query);

    // getParawiseReport(noticeData?.id);
  }, []);

  // Save - DB

  const onSubmitForm = () => {
    console.log("data1212", data);
    let caseId = data?.id;
    let filedAgainst = data?.filedAgainst;

    let body = {
      ...data,
      id: null,
      caseId: caseId,
      // filedAgainst:filedAgainst
    };

    console.log("body", body);
    axios
      .post(`${urls.LCMSURL}/vakalatnama/signVakalatnamaByLegalHod`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        } else if (res.status == 200) {
          sweetAlert("Updated!", "Record Updated successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // view
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid
          container
          style={{
            // backgroundColor: "red",
            display: "flex",
            justifyContent: "center",
            width: "90%",
            marginLeft: "5%",
          }}
          // style={{ display: "none" }}
        >
          <Paper
            style={{
              background: "white",
              border: "2px solid #000",
              width: "100%",

              // backgroundColor: "red",
              // height: "50%",
              // marginLeft: "10%",
              // marginRight: "10%",
            }}
            ref={componentRef}
          >
            {/* New Exp */}
            <div
              style={{
                // backgroundColor: "red",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <table
                style={{
                  //border: "2px solid black",
                  width: "90%",
                  alignItems: "center",
                  marginTop: "40px",
                  marginBottom: "40px",
                  marginLeft: "9%",
                  marginRight: "9%",
                  fontSize: "20px",
                }}
              >
                <tr
                  style={{
                    height: "50px",
                  }}
                >
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      fontWeight: "lighter",
                      fontSize: "35px",
                    }}
                  >
                    <FormattedLabel id="vakalatnama" />
                  </td>
                  <td></td>
                </tr>
                <tr
                  style={{
                    height: "80px",
                  }}
                >
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    IN THE COURT OF HON'BLE {data?.vCourtName}{" "}
                    {data?.vCourtAdrs}
                  </td>
                </tr>
                <tr
                  style={{
                    height: "20px",
                  }}
                >
                  <td colSpan={2} style={{ textAlign: "right" }}>
                    {`Case Number: ${data?.caseNoYear}`}
                  </td>
                </tr>
                <tr
                  style={{
                    height: "80px",
                  }}
                >
                  <td colSpan={2} style={{ textAlign: "right" }}>
                    {data?.vCaseMainType}, {data?.vCaseSubType}
                  </td>
                </tr>
                <tr
                  style={{
                    height: "60px",
                  }}
                >
                  <td style={{ textAlign: "left" }}>{data?.filedBy}</td>
                  <td style={{ textAlign: "right" }}>------Applicant</td>
                </tr>
                <tr
                  style={{
                    height: "50px",
                    // border: "2px solid red",
                  }}
                >
                  <td
                    style={{
                      // marginLeft: "90px",
                      paddingLeft: "20px",
                    }}
                  >
                    V/S
                  </td>
                </tr>
                <tr
                  style={{
                    height: "50px",
                  }}
                >
                  <td style={{ textAlign: "left" }}>{data?.filedAgainst}</td>
                  <td style={{ textAlign: "right" }}>------Opponent</td>
                </tr>
                <tr
                  style={{
                    height: "180px",
                  }}
                >
                  <td colSpan={2}>
                    <n></n>I, Chandrakant Indalkar, Legal Advisor, inhabitant of
                    the Pimpari Chinchwad Municipal Corporation {data?.vAdvName}{" "}
                    {data?.vAdvSanadNo} {data?.vAdvMobile} to appear and act for
                    me and on behalf of Pimpari Chinchwad Municipal Corporation
                    as my Advocate in the said matter.
                    <n></n>
                  </td>
                </tr>
                <tr
                  style={{
                    height: "50px",
                  }}
                >
                  <td colSpan={2}>
                    Witness my hand this ---------- day of ---------- 2023
                  </td>
                  <td></td>
                </tr>
                <tr
                  style={{
                    height: "70px",
                  }}
                >
                  <td>Witness ----------</td>
                </tr>
                <tr
                  style={{
                    height: "70px",
                  }}
                >
                  <td style={{ paddingLeft: "5vw" }}>ADVOCATE</td>
                </tr>
                <tr
                  style={{
                    height: "200px",
                  }}
                >
                  <td style={{ textAlign: "left" }}>Filed in Court on ----</td>
                  <td>
                    <Box
                      style={{
                        textAlign: "center",
                        width: "200px",
                        height: "120px",
                        border: "2px solid #000",
                        marginLeft: "49%",
                      }}
                    >
                      <h3> Digital Signature</h3>
                    </Box>
                  </td>
                </tr>
              </table>
            </div>
          </Paper>
        </Grid>

        {/* Print button  */}
        <Grid
          container
          style={{
            marginTop: "8px",
          }}
        >
          <Grid item lg={3.5}></Grid>

          {/* Approve Vakalatnama  */}

          {/* <Grid item>
            <Button variant="contained" type="submit">
              Approve
            </Button>
          </Grid> */}

          {/* Print Button */}

          <Grid item lg={2}>
            <Button
              variant="contained"
              endIcon={<Print />}
              onClick={handleToPrint}
            >
              {/* <FormattedLabel id="print" /> */}
              Print
            </Button>
          </Grid>

          {/* {Vakalatnama_status === "VAKALATNAMA_SIGNED_BY_LEGAL_HOD" && (
              <Grid item lg={2}>
                <Button
                  variant="contained"
                  endIcon={<Print />}
                  onClick={handleToPrint}
                >
                  Print
                </Button>
              </Grid>
            )} */}

          <Grid item lg={3}></Grid>

          {/* Cancel */}

          <Grid item lg={2}>
            <Button
              variant="contained"
              style={{
                background: "red",
              }}
              onClick={() => {
                router.push(`/LegalCase/transaction/newCourtCaseEntry/`);
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>

        {/* +++++++++ */}
      </form>
    </>
  );
};

export default Vakalatnama;
