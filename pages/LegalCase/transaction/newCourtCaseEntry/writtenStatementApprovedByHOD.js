import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  TextareaAutosize,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import * as yup from 'yup'
import sweetAlert from "sweetalert";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { toast } from "react-toastify";
import { GridToolbar, GridViewStreamIcon } from "@mui/x-data-grid";
// import { wsApprovalByLegalHOD } from "../../../../../containers/schema/LegalCaseSchema/parawiseRequest";
import { saveAs } from "file-saver";

import { wsApprovalByLegalHOD } from "../../../../containers/schema/LegalCaseSchema/parawiseRequest";
import { yupResolver } from "@hookform/resolvers/yup";
import FileTable from "../../FileUploadByAnwar/FileTableWithoutRowIndex";
import { DataArray, Delete, Visibility } from "@mui/icons-material";

import Transliteration from "../../../../components/common/linguosol/transliteration";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import Loader from "../../../../containers/Layout/components/Loader";
// import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/LegalCaseSchema/approveOpinionSchema";
// import urls from "../../../../../URLS/urls";
import GoogleTranslationComponent from "../../../../components/common/linguosol/googleTranslation";
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
const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(wsApprovalByLegalHOD),
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    // methods,
    reset,
    getValues,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  // useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(wsApprovalByLegalHOD),
  //   mode: "onChange",
  // });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();

  const user = useSelector((state) => {
    return state.user.user;
  });

  const [dptData, setDptData] = useState([]);
  const [caseEntryData, setCaseEntryData] = useState();
  const [departments, setDepartments] = useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);

  const [tableDataForDocument, setTableDataForDocument] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // For Document Modal
  const [openModal, setOpenModal] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [deptId, setDeptId] = useState(null);
  const [dataToAttachInPayload, setdataToAttachInPayload] = useState(null);

  const [parawiseRequestByCaseEntry, setParawiseRequestByCaseEntry] = useState(
    []
  );

  // For Documente
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [NewCourtCaseEntryAttachmentList, setNewCourtCaseEntryAttachmentList] =
    useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [deleteButtonInputState, setDeleteButtonInputState] = useState(true);

  const [parawiseEntryData, setParawiseEntryData] = useState([]);
  const [applicableDepartments, setApplicableDepartments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [noticeNarDetails, setNoticeNarDetails] = useState("");

  const [showDocketSubDetailsModel, setShowDocketSubDetailsModel] =
    useState(false);

  const styleForModal = {
    position: "absolute",
    top: "20%",
    left: "20%",
    // transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const token = useSelector((state) => state.user.user.token);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // --------------------------Transaltion API--------------------------------
  const finalAssignedRemarkByLegalHodApi = (
    currentFieldInput,
    updateFieldName,
    languagetype
  ) => {
    //---------------------------------- old-----------------------------------------
    // let stringToSend = currentFieldInput;
    // const url = `https://noncoredev.pcmcindia.gov.in/backend/lc/lc/api/translator/translate`;
    // axios.post(url, { body: stringToSend }).then((res) => {
    //   if (res?.status == 200 || res?.status == 201) {
    //     let bodyResponse = JSON.parse(res?.data.text);
    //     console.log("titlepanelRemark", bodyResponse.body);
    //     setValue("caseDetailsMr", bodyResponse?.body);
    //   }
    // });

    // --------------------------------new by vishal--------------------------------------------------------

    if (currentFieldInput) {
      let _payL = {
        apiKey: "Alpesh",
        textToTranslate: currentFieldInput,
        languagetype: languagetype,
      };
      setLoading(true);
      axios
        // .post(`${urls.TRANSLATIONAPI}`, _payL)
        .post(`${urls.GOOGLETRANSLATIONAPI}`, _payL)
        .then((r) => {
          setLoading(false);
          if (r.status === 200 || r.status === 201) {
            console.log("_res", currentFieldInput, r);
            if (updateFieldName) {
              setValue(updateFieldName, r?.data);
              clearErrors(updateFieldName);
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          catchExceptionHandlingMethod(e, language);
        });
    } else {
      sweetAlert({
        title: language === "en" ? "Not Found !!" : "सापडले नाही !!",
        text:
          language === "en"
            ? "We do not received any input to translate !!"
            : "आम्हाला भाषांतर करण्यासाठी कोणतेही इनपुट मिळाले नाही !!",
        icon: "warning",
      });
    }
  };
  // -------------------------------------------------------------------------

  // officeLocation
  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setOfficeLocationList(r.data.officeLocation);
        } else {
          //
        }
      })
      .catch((err) => {
        console.log("err", err);
        //
      });
  };

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("2313", res);
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          }))
        );
      });
  };

  const getCaseEntryData = () => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router.query.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("getCaseEntryData", res.data);
        setCaseEntryData(res.data);
      });
  };

  const getDeptNameById = () => {
    axios
      .get(
        `${urls.LCMSURL}/parawiseRequest/getById?id=${router.query.paraReqId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("__res__res", res.data);
        let _res = res?.data?.trnParawiseListDao;
        setdataToAttachInPayload(res?.data);

        const transformedData = _res?.map((item, index) => {
          const filePaths = item?.parawiseRequestAttachmentList?.map(
            (attachment) => ({
              filePath: attachment?.filePath,
              FileName: attachment?.originalFileName,
            })
          );
          return {
            id: item.id,
            parawiseReqId: item.id,
            srNo: index + 1,

            locationNameEn: officeLocationList?.find(
              (obj) => obj?.id === item?.locationId
            )?.officeLocationName,
            locationNameMr: officeLocationList?.find(
              (obj) => obj?.id === item?.locationId
            )?.officeLocationNameMar,

            departmentId: item.departmentId,
            filePaths: filePaths,
            departmentNameEn: departments?.find(
              (obj) => obj.id == item?.departmentId
            )?.department,
            departmentNameMr: departments?.find(
              (obj) => obj.id == item?.departmentId
            )?.departmentMr,
          };
        });

        let _ParawiseRequestByCaseEntry = _res?.map((remark, ind) => {
          return {
            id: remark.id,
            parawiseReqId: remark.id,
            srNo: ind + 1,

            departmentId: remark.departmentId,
            departmentNameEn: departments?.find(
              (obj) => obj.id == remark?.departmentId
            )?.department,
            departmentNameMr: departments?.find(
              (obj) => obj.id == remark?.departmentId
            )?.departmentMr,
            consernDptHodRemark: remark?.consernDptHodRemark,
            consernDptHodRemarkMr: remark?.consernDptHodRemarkMr,
          };
        });
        // let finalTableData = [];
        // // Iterate res.data
        // _res?.map((item) => {
        //   // convert item.clerkRemarkEnglish to json array
        //   let clerkRemarkEnglishJson = JSON.parse(item.consernDptClerkRemark);

        //   // iterate clerkRemarkEnglishJson
        //   clerkRemarkEnglishJson?.map((clerkRemarkEnglishJsonItem) => {
        //     finalTableData?.push({
        //       id: item.id,
        //       departmentId: item.departmentId,
        //       // refer to departments list to get department name
        //       departmentName: departments.find(
        //         (dept) => dept.id == item.departmentId
        //       )?.department,
        //       issueNo: clerkRemarkEnglishJsonItem.issueNo,
        //       answerInEnglish: clerkRemarkEnglishJsonItem.answerInEnglish,
        //       answerInMarathi: clerkRemarkEnglishJsonItem.answerInMarathi,
        //     });

        //     // console.log("loopdata", watch("parawiseRequestDao").length);
        //   });
        // });
        let _dptClerkRemarks = res?.data?.advocateRemark
          ? JSON.parse(res?.data?.advocateRemark)
          : [];
        let _dpt = _res?.map((dpts, i) => {
          return {
            id: dpts?.departmentId,
            department: departments.find((dept) => dept.id == dpts.departmentId)
              ?.department,
            departmentMr: departments.find(
              (dept) => dept.id == dpts.departmentId
            )?.departmentMr,
          };
        });
        console.log("_dptClerkRemarks", _dptClerkRemarks);
        setParawiseEntryData(_dptClerkRemarks);
        setApplicableDepartments(_dpt ?? []);
        // ----------------------------------------------------------------------------------------------------

        // setTableData(transformedData ?? []);
        setTableDataForDocument(transformedData ?? []);
        setParawiseRequestByCaseEntry(_ParawiseRequestByCaseEntry ?? []);
        setValue("courtCaseNumber", res?.data?.courtCaseNumber);
        setValue("fillingDate", res?.data?.fillingDate);
        setValue(
          "parawiseReportRemarkClerk",
          res?.data?.parawiseReportRemarkClerk
        );
        setValue(
          "parawiseReportRemarkClerkMr",
          res?.data?.parawiseReportRemarkClerkMr
        );
        setValue("parawiseReportRemarkHod", res?.data?.hodRemarkEnglish);
        setValue("parawiseReportRemarkHodMr", res?.data?.hodRemarkMarathi);
      });
  };

  // useEffect(() => {
  //   // if (router?.query?.caseNumber || router?.query?.fillingDate) {
  //     // alert("aayaa")
  //     console.log("router.query", router.query);
  //     // setValue("courtCaseNumber", router.query.caseNumber);
  //     // setValue("fillingDate", router.query.fillingDate);

  //   // }
  // }, [router?.query]);

  // useEffect(() => {
  //   getCaseEntryData();
  //   getParawiseRequestByCaseEntryId();
  // }, [departments]);

  // useEffect(() => {
  //   console.log("dptData", dptData);
  //   console.log("caseEntryData", caseEntryData);

  //   // legal clerk
  //   setValue(
  //     "parawiseReportRemarkClerk",
  //     caseEntryData?.parawiseReportRemarkClerk
  //   );
  //   setValue(
  //     "parawiseReportRemarkClerkMr",
  //     caseEntryData?.parawiseReportRemarkClerkMr
  //   );
  //   // legal hod
  //   setValue("parawiseReportRemarkHod", caseEntryData?.parawiseReportRemarkHod);
  //   setValue(
  //     "parawiseReportRemarkHodMr",
  //     caseEntryData?.parawiseReportRemarkHodMr
  //   );
  //   // conc dpt clerk
  //   setValue("clerkRemarkEnglish", dptData?.clerkRemarkEnglish);
  //   setValue("clerkRemarkMarathi", dptData?.clerkRemarkMarathi);
  //   // conc dpt hod
  //   setValue("hodRemarkEnglish", dptData?.hodRemarkEnglish);
  //   setValue("hodRemarkMarathi", dptData?.hodRemarkMarathi);

  //   // lawyerRemarkMr
  //   setValue("lawyerRemarkEn", caseEntryData?.lawyerRemarkEn);
  //   setValue("lawyerRemarkMr", caseEntryData?.lawyerRemarkMr);

  //   // get lawyaer remark en

  //   // return if caseEntryData is null
  //   if (!caseEntryData) return;

  //   let lawyerRemarkEnString = caseEntryData?.lawyerRemarkEn;

  //   console.log("lawyerRemarkEnString", lawyerRemarkEnString);

  //   // COnvert it to json array
  //   let lawyerRemarkEnJson = JSON.parse(lawyerRemarkEnString);

  //   // Iterate lawyerRemarkEnJson
  //   let tableData = lawyerRemarkEnJson?.map((item, index) => {
  //     return {
  //       id: index + 1,
  //       ...item,
  //     };
  //   });

  //   setParawiseEntryData(tableData);
  // }, [dptData, caseEntryData]);

  // //useeffect
  // useEffect(() => {
  //   console.log("watch", watch("departmentName"));
  // }, [watch("departmentName")]);

  //   for modal Api
  const onFinish = (data) => {
    const _data = {
      ...data,
      pageMode: "APPROVE",
      // hodRemarkEnglish:"null",
      //   noticeAttachment: selectedNoticeAttachmentToSend,
      id: router.query.id,
      finalAssignedDepartmentId: watch("departmentName"),
      finalAssignedRemarkByLegalHod: "finalAssignedRemarkByLegalHod",
      finalAssignedRemarkByLegalHodMr: "finalAssignedRemarkByLegalHodMr",
    };

    console.log("body", _data);

    // axios
    //   .post(
    //     `${urls.LCMSURL}/transaction/newCourtCaseEntry/approveWrittenStatementByHod`,
    //     _data,
    //     {
    //       // headers: {
    //       //   Authorization: `Bearer ${token}`,
    //       // },
    //     }
    //   )
    //   .then((r) => {
    //     if (r.status == 201) {
    //       console.log("res save notice", r);
    //       swal("Record is Successfully Saved!", {
    //         icon: "success",
    //       });
    //       router.push({
    //         pathname: "/LegalCase/transaction/newCourtCaseEntry",
    //         query: { mode: "Create" },
    //       });
    //     } else {
    //       console.log("Login Failed ! Please Try Again !");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     toast("Failed ! Please Try Again !", {
    //       type: "error",
    //     });
    //   });
  };

  // const getParawiseRequestByCaseEntryId = () => {
  //   axios
  //     .get(
  //       `${urls.LCMSURL}/parawiseRequest/getParawiseRequestByCaseEntryId?caseEntryId=${router.query.id}`
  //     )
  //     .then((res) => {
  //       console.log("getParawiseRequestByCaseEntryId", res.data);

  //       // add a new field in res.data called departmentName
  //       // iterate res.data
  //       let var1 = res.data.map((item) => {
  //         // refer to departments list to get department name
  //         return {
  //           departmentNameNew: departments.find(
  //             (dept) => dept.id == item.departmentId
  //           )?.department,
  //           ...item,
  //         };
  //       });

  //       //setParawiseRequestByCaseEntry(res.data);

  //       setParawiseRequestByCaseEntry(var1);

  //       console.log("var1", var1);

  //       let finalTableData = [];
  //       // Iterate res.data
  //       res.data.map((item) => {
  //         // convert item.clerkRemarkEnglish to json array
  //         let id = item.id;
  //         let departmentId = item.departmentId;
  //         let clerkRemarkEnglishJson = JSON.parse(item.clerkRemarkEnglish);

  //         // iterate clerkRemarkEnglishJson
  //         clerkRemarkEnglishJson.map((clerkRemarkEnglishJsonItem) => {
  //           console.log(
  //             "clerkRemarkEnglishJsonItem",
  //             clerkRemarkEnglishJsonItem
  //           );
  //           console.log(
  //             "clerkRemarkEnglishJsonItem.issueNo",
  //             clerkRemarkEnglishJsonItem.issueNo
  //           );
  //           finalTableData.push({
  //             id: id,
  //             departmentId: departmentId,
  //             // refer to departments list to get department name
  //             departmentName: departments.find(
  //               (dept) => dept.id == departmentId
  //             )?.department,
  //             issueNo: clerkRemarkEnglishJsonItem.issueNo,
  //             answerInEnglish: clerkRemarkEnglishJsonItem.answerInEnglish,
  //             answerInMarathi: clerkRemarkEnglishJsonItem.answerInMarathi,
  //           });
  //         });
  //       });

  //       console.log("finalTableData", finalTableData);
  //       //setParawiseEntryData(finalTableData);

  //       // set applicableDepartments
  //       let depts = finalTableData.map((item) => {
  //         return {
  //           id: item.departmentId,
  //           department: departments.find((dept) => dept.id == item.departmentId)
  //             ?.department,
  //         };
  //       });

  //       // deduce duplicate departments
  //       depts = depts.filter(
  //         (item, index, self) =>
  //           index === self.findIndex((t) => t.id === item.id)
  //       );

  //       setApplicableDepartments(depts);
  //     });
  // };

  const columnsParaEntry = [
    {
      field: "departmentName",
      headerName: <FormattedLabel id="deptName" />,
      align: "center",
      headerAlign: "center",
      width: 250,
    },
    {
      field: "issueNo",
      headerName: <FormattedLabel id="issueNo" />,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "answerInEnglish",
      // align: "center",
      // headerAlign: "center",
      headerName: <FormattedLabel id="concernDepartmentClerkRemarkInEnglish" />,
      flex: 1,
      //

      renderCell: (params) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log(":a2", params?.row?.answerInEnglish);

              setNoticeNarDetails(params?.row?.answerInEnglish);
              setShowDocketSubDetailsModel(true);
            }}
          >
            <span>{params?.row?.answerInEnglish}</span>
          </div>
        </>
      ),

      //
    },
    {
      field: "writtenStatementInEnglish",
      // align: "center",
      // headerAlign: "center",
      flex: 1,

      headerName: <FormattedLabel id="writtenStatementInEnglish" />,
      renderCell: (params) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log(":a2", params?.row?.writtenStatementInEnglish);

              setNoticeNarDetails(params?.row?.writtenStatementInEnglish);
              setShowDocketSubDetailsModel(true);
            }}
          >
            <span>{params?.row?.writtenStatementInEnglish}</span>
          </div>
        </>
      ),

      // flex: 1,
    },
    {
      field: "answerInMarathi",
      // align: "center",
      // headerAlign: "center",
      // headerName: <FormattedLabel id="concernDepartmentClerkRemarkInMarathi" />,
      flex: 1,
      renderCell: (params) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log(":a2", params?.row?.answerInMarathi);

              setNoticeNarDetails(params?.row?.answerInMarathi);
              setShowDocketSubDetailsModel(true);
            }}
          >
            <span>{params?.row?.answerInMarathi}</span>
          </div>
        </>
      ),
    },
    {
      flex: 1,
      headerName: <FormattedLabel id="writtenStatementInMarathi" />,
      field: "writtenStatementInMarathi",
      // align: "center",
      // headerAlign: "center",
      renderCell: (params) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log(":a2", params?.row?.writtenStatementInMarathi);

              setNoticeNarDetails(params?.row?.writtenStatementInMarathi);
              setShowDocketSubDetailsModel(true);
            }}
          >
            <span>{params?.row?.writtenStatementInMarathi}</span>
          </div>
        </>
      ),
    },
  ];

  const columns = [
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: "Department",
      align: "center",
      headerAlign: "center",
      width: 220,
    },

    // // {
    // //   // field: "id",
    // //   headerName:"Legal Clerk Remark",
    // //   align: "center",
    // //   headerAlign: "center",
    // //   // width: 120,
    // // },

    // // {
    // //   // field: "id",
    // //   headerName:"Legal HOD Remark",
    // //   align: "center",
    // //   headerAlign: "center",
    // //   // width: 120,
    // // },

    // {
    //   field: "clerkRemarkEnglish",
    //   align: "center",
    //   headerAlign: "center",

    //   headerName: "Concern Department Clerk Remark in English",
    //   flex: 1,
    // },
    // {
    //   flex: 1,
    //   // headerName: "Concern Department Clerk Remark",
    //   headerName: "Concern Department Clerk Remark in Marathi",

    //   field: "clerkRemarkMarathi",
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      flex: 1,
      headerName: "Concern Department HOD Remark in English",

      field: "consernDptHodRemark",
      align: "center",
      headerAlign: "center",
    },
    {
      flex: 1,
      headerName: "Concern Department HOD Remark in Marathi",

      field: "consernDptHodRemark",
      align: "center",
      headerAlign: "center",
    },
  ];
  const _columns = [
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      // headerName: "Department",
      headerName: <FormattedLabel id="deptName" />,
      align: "center",
      headerAlign: "center",
      width: 220,
    },
    {
      flex: 1,
      // headerName: "Concern Department HOD Remark in English",
      headerName: <FormattedLabel id="concernDepartmentHODRemarkInEnglish" />,

      field: "consernDptHodRemark",
      // align: "center",
      // headerAlign: "center",

      renderCell: (params) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log(":a2", params?.row?.consernDptHodRemark);

              setNoticeNarDetails(params?.row?.consernDptHodRemark);
              setShowDocketSubDetailsModel(true);
            }}
          >
            <span>{params?.row?.consernDptHodRemark}</span>
          </div>
        </>
      ),
    },
    {
      flex: 1,
      // headerName: "Concern Department HOD Remark in Marathi",
      headerName: <FormattedLabel id="concernDepartmentHODRemarkInMarathi" />,

      field: "consernDptHodRemarkMr",
      // align: "center",
      // headerAlign: "center",
      renderCell: (params) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log(":a2", params?.row?.consernDptHodRemarkMr);

              setNoticeNarDetails(params?.row?.consernDptHodRemarkMr);
              setShowDocketSubDetailsModel(true);
            }}
          >
            <span>{params?.row?.consernDptHodRemarkMr}</span>
          </div>
        </>
      ),
    },
  ];

  // // NEW CODE By A.ANSARI
  // const getDeptNameById = () => {
  //   axios
  //     .get(
  //       `${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router.query.id}`
  //     )
  //     .then((res) => {
  //       console.log("res", res.data);
  //       let _res = res?.data?.parawiseRequestList;

  //       const transformedData = _res?.map((item, index) => {
  //         const filePaths = item?.parawiseRequestAttachmentList?.map(
  //           (attachment) => ({
  //             filePath: attachment?.filePath,
  //             FileName: attachment?.originalFileName,
  //           })
  //         );
  //         return {
  //           id: index,
  //           srNo: index + 1,
  //           departmentId: item.departmentId,
  //           filePaths: filePaths,
  //           departmentNameEn: departments?.find(
  //             (obj) => obj.id == item?.departmentId
  //           )?.department,
  //           departmentNameMr: departments?.find(
  //             (obj) => obj.id == item?.departmentId
  //           )?.departmentMr,
  //         };
  //       });

  //       setTableDataForDocument(transformedData);
  //     });
  // };

  const handleOpenModal = (rowData) => {
    setSelectedRowData(rowData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRowData(null);
    setModalOpen(false);
  };

  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Docs",
      headerName: <FormattedLabel id="viewPreviousDocs" />,
      headerAlign: "center",
      align: "center",
      width: 200,
      renderCell: (params) => {
        const rowData = params?.row; // Get the data of the current row
        console.log(":a1", rowData);

        return (
          rowData?.filePaths?.length !== 0 && (
            <Button
              size="small"
              variant="contained"
              onClick={() => handleOpenModal(rowData)}
            >
              {/* View */}
              <FormattedLabel id="view" />
            </Button>
          )
        );
      },
    },
  ];

  // useEffect(() => {
  //   if (departments?.length !== 0) {
  //     getDeptNameById();
  //   }
  // }, [departments]);

  // For Docuemnt Upload
  // Columns
  const columnsForDocuments = [
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      valueFormatter: (params) =>
        params?.value?.split(".")?.slice(0, -1)?.join("."),
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      width: 140,
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
      // width: 300,
    },
    {
      // field:
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      renderCell: (record) => {
        return (
          <>
            {/** viewButton */}
            <IconButton
              color="primary"
              onClick={() => {
                viewFile(record?.row?.filePath);
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record?.row?.filePath}`,
                //   "_blank"
                // );
                // {
                //   console.log(":a1", record);
                // }
              }}
            >
              <Visibility />
            </IconButton>
            {/** deleteButton */}
            {deleteButtonInputState && (
              <IconButton color="error" onClick={() => discard(record.row)}>
                {/* <IconButton
                color="error"
                onClick={() => console.log(":1bc", record.row)}
              > */}
                <Delete />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  const _docsCol = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "FileName",
      headerName: language === "en" ? "File Name" : "फाईलचे नाव",
      valueFormatter: (params) =>
        params?.value?.split(".")?.slice(0, -1)?.join("."),
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      // field:
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                viewFile(record?.row?.filePath);
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                //   "_blank"
                // );
              }}
            >
              <Visibility />
            </IconButton>
          </>
        );
      },
    },
  ];

  //view----------------------------------------------------------------
  const viewFile = (filePath) => {
    // alert("aaaya");
    console.log("filePath", filePath);

    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);

    const newFilePath = DecryptPhoto?.split(".").pop().toLowerCase();

    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

    if (newFilePath === "pdf") {
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          console.log(r?.data, "doccheck32423");
          setLoading(false);
          // if (response && response.data instanceof ArrayBuffer) {
          //   const pdfBlob = new Blob([response.data], {
          //     type: "application/pdf",
          //   });
          //   const pdfUrl = URL.createObjectURL(pdfBlob);

          //   const newTab = window.open();
          //   newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
          // } else {
          //   console.error("Invalid or missing data in the response");
          // }

          // New
          if (
            r?.data?.mimeType == "application/xlxs" ||
            r?.data?.mimeType == "text/csv" ||
            r?.data?.mimeType ==
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            const excelBase64 = r?.data?.fileName;

            const data = base64ToArrayBuffer(excelBase64);

            const excelBlob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            saveAs(excelBlob, "FileName.xlsx");
          } else {
            // alert("pdf elsesss");
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
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else if (newFilePath === "csv") {
      // alert("CSV");
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          console.log("Excel API Response:", response);
          console.log("Excel API Response Data:", response.data.fileName);

          const excelBase64 = response.data.fileName;

          const data = base64ToArrayBuffer(excelBase64);

          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(excelBlob, "NewDoc.csv");
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else if (newFilePath === "xlsx") {
      // alert("xlsx");
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          console.log("Excel API Response:", response);
          console.log("Excel API Response Data:", response.data.fileName);

          const excelBase64 = response.data.fileName;

          const data = base64ToArrayBuffer(excelBase64);

          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(excelBlob, "Spreadsheetml.xlsx");
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else {
      // alert("else");
      setLoading(true);
      const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          // alert("then");
          setLoading(false);
          console.log(
            "ImageApi21312",
            `data:image/png;base64,${r?.data?.fileName}`
          );
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          // alert("imageUrl");
          const newTab = window.open();
          // alert("window");
          // newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
          newTab.document.body.innerHTML = `<img src="${imageUrl}"/>`;
        })
        .catch((error) => {
          // alert("error");
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };
  // ------------------------------------------------------------------------

  // Delete
  const discard = async (props) => {
    const discardDecryptPhoto = DecryptData(
      "passphraseaaaaaaaaupload",
      props?.filePath
    );
    const discardFilePath = EncryptData(
      "passphraseaaaaaaadiscard",
      discardDecryptPhoto
    );

    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${discardFilePath}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              let attachement = JSON.parse(
                localStorage.getItem("NewCourtCaseEntryAttachmentList")
              )
                ?.filter((a) => a?.filePath != props.filePath)
                ?.map((a) => a);
              setAdditionalFiles(attachement);
              localStorage.removeItem("NewCourtCaseEntryAttachmentList");
              localStorage.setItem(
                "NewCourtCaseEntryAttachmentList",
                JSON.stringify(attachement)
              );
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          })
          .catch((err) => {
            console.log("err", err);
            callCatchMethod(err, language);
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  useEffect(() => {
    getOfficeLocation();
    getDepartments();
    if (
      localStorage.getItem("parawiseRequestAttachmentList") &&
      localStorage.getItem("parawiseRequestAttachmentList") !== null
    ) {
      setAdditionalFiles(
        JSON.parse(localStorage.getItem("parawiseRequestAttachmentList"))
      );
    } else if (localStorage.getItem("parawiseRequestAttachmentList") === "") {
      localStorage.removeItem("parawiseRequestAttachmentList");
    }
  }, []);

  useEffect(() => {
    if (additionalFiles?.length !== 0) {
      // alert("...mainFiles")
      setNewCourtCaseEntryAttachmentList([...mainFiles, ...additionalFiles]);
      localStorage.setItem(
        "parawiseRequestAttachmentList",
        JSON.stringify([...mainFiles, ...additionalFiles])
      );
    }
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("router?.query", router?.query);
    // console.log("dataToAttachInPayload", dataToAttachInPayload);
    if (
      router?.query?.paraReqId &&
      departments?.length > 0 &&
      officeLocationList?.length > 0
    ) {
      getDeptNameById();
    }
  }, [router?.query, departments, officeLocationList]);

  // Save DB

  const onSubmitForm = (Data) => {
    let getLocalDataToSend = localStorage.getItem(
      "parawiseRequestAttachmentList"
    )
      ? localStorage.getItem("parawiseRequestAttachmentList")
      : [];

    let setLocalDataToSend =
      getLocalDataToSend?.length !== 0 ? JSON.parse(getLocalDataToSend) : [];

    const _data = {
      ...caseEntryData,
      pageMode: "APPROVE",
      id: router.query.id,
      finalAssignedDepartmentId: watch("departmentName"),
      finalAssignedRemarkByLegalHod: watch("finalAssignedRemarkByLegalHod"),
      finalAssignedRemarkByLegalHodMr: watch("finalAssignedRemarkByLegalHodMr"),
      remark: watch("finalAssignedRemarkByLegalHod"),
      remarkMr: watch("finalAssignedRemarkByLegalHodMr"),
      updateUserId: user?.id,
      // ///////////////// NEWLY ADDED //////////////////
      newCourtCaseEntryAttachmentListForUpload:
        setLocalDataToSend?.length != 0 ||
        Object.keys(setLocalDataToSend).length != 0
          ? setLocalDataToSend.map((o) => ({
              id: null,
              parawiseRequestId: null,
              attachedDate: o.attachedDate,
              attacheDepartment: o.deptId,
              attacheDesignation: null,
              attachedNameMr: null,
              attachedNameEn: o.attachedNameEn,
              attachedBy: null,
              extension: o.extension,
              filePath: o.filePath,
              originalFileName: o.originalFileName,
              createdUserId: user.id,
              updateUserId: null,
            }))
          : [],
    };

    let _paraWiseInfoWithFile =
      setLocalDataToSend?.length != 0 ||
      Object.keys(setLocalDataToSend).length != 0
        ? setLocalDataToSend.map((o) => ({
            id: null,
            parawiseRequestId: null,
            attachedDate: o.attachedDate,
            attacheDepartment: o.deptId,
            attacheDesignation: null,
            attachedNameMr: null,
            attachedNameEn: o.attachedNameEn,
            attachedBy: null,
            extension: o.extension,
            filePath: o.filePath,
            originalFileName: o.originalFileName,
            createdUserId: user.id,
            updateUserId: null,
          }))
        : [];

    let _selectedDptData = dataToAttachInPayload?.trnParawiseListDao?.find(
      (obj) => obj?.departmentId == watch("departmentName")
    );

    let __body = {
      id: dataToAttachInPayload?.id,
      role: "HOD",
      action: "APPROVE",
      hodRemarkEnglish: watch("finalAssignedRemarkByLegalHod"),
      hodRemarkMarathi: watch("finalAssignedRemarkByLegalHodMr"),
      trnParawiseListDao: [
        {
          ..._selectedDptData,
          parawiseRequestAttachmentList: _paraWiseInfoWithFile ?? [],
        },
      ],
    };

    console.log("__body", __body);

    axios
      .post(
        // `${urls.LCMSURL}/transaction/newCourtCaseEntry/approveWrittenStatementByHod`,
        // _data,
        `${urls.LCMSURL}/parawiseRequest/saveApprove`,
        __body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        if (r.status == 201 || r.status == 200) {
          console.log("res save notice", r);
          swal(
            // "Record is Successfully Saved!",
            language === "en"
              ? "Record is Successfully Saved!"
              : "रेकॉर्ड यशस्वीरित्या जतन केले आहे!",
            {
              icon: "success",
            }
          );
          localStorage.removeItem("parawiseRequestAttachmentList");
          router.push({
            pathname: "/LegalCase/transaction/newCourtCaseEntry",
            query: { mode: "Create" },
          });
        } else {
          console.log("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
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
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  // paddingTop: "10px",

                  backgroundColor: "#556CD6",

                  color: "white",
                  fontSize: 19,
                  marginTop: 30,
                  marginBottom: 20,
                  // padding: 8,
                  height: "8vh",

                  paddingLeft: 30,
                  // marginLeft: "50px",
                  // marginRight: "75px",
                  borderRadius: 100,
                  width: "100%",

                  // background:
                  //   "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2
                  style={{
                    color: "white",
                  }}
                >
                  {" "}
                  <FormattedLabel id="writtenStatememtApprove" />
                  {/* Approval for Written Statement */}
                </h2>
              </Box>
              <Divider />

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    marginTop: 10,
                  }}
                ></div>

                {/* First Row */}
                <Grid container sx={{ padding: "10px" }}>
                  {/* court case no */}
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={6}
                    lg={4}
                    xl={2}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      fullWidth
                      sx={{ width: "90%" }}
                      autoFocus
                      disabled
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="courtCaseNumber" />}
                      variant="standard"
                      {...register("courtCaseNumber")}
                    />
                  </Grid>
                  {/* case date */}
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={6}
                    lg={4}
                    xl={2}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl fullWidth sx={{ width: "90%" }}>
                      <Controller
                        control={control}
                        name="fillingDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              disabled
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="caseDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  size="small"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
              {/* 2nd Row legal clerk remarks */}
              <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
                <Grid
                  item
                  xs={12}
                  xl={12}
                  md={12}
                  sm={12}
                  sx={
                    {
                      // display: "flex",
                      // justifyContent: "center",
                      // alignItems: "center",
                      // border:'solid red'
                    }
                  }
                >
                  <TextField
                    id="standard-textarea"
                    disabled
                    // label="Opinion"
                    // label={<FormattedLabel id="clerkRemarkEn" />}
                    label={<FormattedLabel id="legalDeptRemarkEn" />}
                    // placeholder="Opinion"
                    multiline
                    variant="standard"
                    fullWidth
                    {...register("parawiseReportRemarkClerk")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkClerk") ? true : false) ||
                        (router.query.parawiseReportRemarkClerk ? true : false),
                    }}
                    error={!!errors.clerkRemarkEn}
                    helperText={
                      errors?.clerkRemarkEn
                        ? errors.clerkRemarkEn.message
                        : null
                    }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  xl={12}
                  md={12}
                  sm={12}
                  sx={{
                    marginTop: "30px",
                    // display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                  }}
                >
                  <TextField
                    id="standard-textarea"
                    disabled
                    // label="Opinion"
                    // label={<FormattedLabel id="clerkRemarkMr" />}
                    label={<FormattedLabel id="legalDeptRemarkMr" />}
                    // placeholder="Opinion"
                    multiline
                    variant="standard"
                    fullWidth
                    // style={{ width: 1000 , marginTop:"30px"}}
                    {...register("parawiseReportRemarkClerkMr")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkClerkMr") ? true : false) ||
                        (router.query.parawiseReportRemarkClerkMr
                          ? true
                          : false),
                    }}
                    error={!!errors.clerkRemarkEn}
                    helperText={
                      errors?.clerkRemarkEn
                        ? errors.clerkRemarkEn.message
                        : null
                    }
                  />
                </Grid>
              </Grid>

              {/*legal HOD Remarks */}

              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  xl={12}
                  md={12}
                  sm={12}
                  sx={
                    {
                      // marginTop:"30px"
                      // display: "flex",
                      // justifyContent: "center",
                      // alignItems: "center",
                    }
                  }
                >
                  <TextField
                    id="standard-textarea"
                    disabled
                    // label={<FormattedLabel id="hodRemarksEn" />}
                    label={<FormattedLabel id="legalHODRemarkEn" />}
                    multiline
                    variant="standard"
                    fullWidth
                    {...register("parawiseReportRemarkHod")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkHod") ? true : false) ||
                        (router.query.parawiseReportRemarkHod ? true : false),
                    }}
                    error={!!errors.hodRemarkEn}
                    helperText={
                      errors?.hodRemarkEn ? errors.hodRemarkEn.message : null
                    }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  xl={12}
                  md={12}
                  sm={12}
                  sx={{
                    marginTop: "20px",
                    // display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                  }}
                >
                  <TextField
                    id="standard-textarea"
                    disabled
                    // label={<FormattedLabel id="hodRemarksMr" />}
                    label={<FormattedLabel id="legalHODRemarkMr" />}
                    multiline
                    variant="standard"
                    // style={{ width: 1000 }}
                    fullWidth
                    {...register("parawiseReportRemarkHodMr")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkHodMr") ? true : false) ||
                        (router.query.parawiseReportRemarkHodMr ? true : false),
                    }}
                    error={!!errors.hodRemarkMr}
                    helperText={
                      errors?.hodRemarkMr ? errors.hodRemarkMr.message : null
                    }
                  />
                </Grid>
              </Grid>

              {/* 2nd table Row */}
              <Grid container sx={{ padding: "10px" }} mt={5} mb={5}>
                <Grid
                  item
                  xs={12}
                  xl={12}
                  md={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  {/* <h1>Previously Uploaded Documents</h1> */}
                  <h1>
                    <FormattedLabel id="previouslyUploadedDocuments" />
                  </h1>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setOpenModal(true);
                      // setRowIndex(record.row.id)
                      // setDeptId(record.row.departmentId)
                    }}
                    sx={{ width: "auto", height: "30px" }}
                  >
                    {/* Add Document */}
                    <FormattedLabel id="addDocuments" />
                  </Button>
                </Grid>
                <Grid item xs={12} xl={12} md={12} sm={12} sx={{}}>
                  <DataGrid
                    sx={{
                      border: "1px solid",
                      borderColor: "blue",
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
                    density="compact"
                    autoHeight={true}
                    hideFooter={true}
                    pagination
                    paginationMode="server"
                    rows={tableDataForDocument}
                    columns={_col}
                    onPageChange={(_data) => {}}
                    onPageSizeChange={(_data) => {}}
                  />
                </Grid>
              </Grid>

              {/* Add a Table below representing parawiseRequestByCaseEntry */}
              <Grid container sx={{ padding: "10px" }}>
                {/* <h1>Department Clerk Parawise Remarks</h1> */}
                <h1>
                  <FormattedLabel id="departmentClerkParawiseRemarks" />
                </h1>
                <Grid item xs={12} xl={12} md={12} sm={12} sx={{}}>
                  <DataGrid
                    components={{ Toolbar: GridToolbar }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                        printOptions: { disableToolbarButton: true },
                      },
                    }}
                    autoHeight
                    sx={{
                      border: "1px solid",
                      borderColor: "blue",

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
                    density="compact"
                    pagination
                    paginationMode="server"
                    rowCount={data.totalRows}
                    rowsPerPageOptions={data.rowsPerPageOptions}
                    page={data.page}
                    pageSize={data.pageSize}
                    getRowId={(row) => row.srNo}
                    rows={
                      parawiseEntryData
                        ? parawiseEntryData?.map((d, i) => {
                            return {
                              ...d,
                              srNo: i + 1,
                            };
                          })
                        : []
                    }
                    columns={columnsParaEntry}
                    // onPageChange={(_data) => {
                    //   // getCaseType(data.pageSize, _data);
                    //   getAdvocate(data.pageSize, _data);
                    // }}
                    // onPageSizeChange={(_data) => {
                    //   console.log("222", _data);
                    //   // updateData("page", 1);
                    //   getAdvocate(_data, data.page);
                    // }}
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                {/* <h1>Department HOD Remarks</h1> */}
                <h1>
                  <FormattedLabel id="departmentHODRemarks" />
                </h1>
                <Grid item xs={12} xl={12} md={12} sm={12} sx={{}}>
                  <DataGrid
                    {...data}
                    // disableColumnFilter
                    // disableColumnSelector
                    // disableToolbarButton
                    // disableDensitySelector
                    components={{ Toolbar: GridToolbar }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                        printOptions: { disableToolbarButton: true },
                        // disableExport: true,
                        // disableToolbarButton: true,
                        // csvOptions: { disableToolbarButton: true },
                      },
                    }}
                    autoHeight
                    sx={{
                      // marginLeft: 5,
                      // marginRight: 5,
                      // marginTop: 5,
                      // marginBottom: 5,
                      border: "1px solid",
                      borderColor: "blue",

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
                    rows={parawiseRequestByCaseEntry}
                    columns={_columns}
                    // columns={[]}
                    // onPageChange={(_data) => {
                    //   // getCaseType(data.pageSize, _data);
                    //   getAdvocate(data.pageSize, _data);
                    // }}
                    // onPageSizeChange={(_data) => {
                    //   console.log("222", _data);
                    //   // updateData("page", 1);
                    //   getAdvocate(_data, data.page);
                    // }}
                  />
                </Grid>
              </Grid>

              {/* cons dpt clerk Remarks */}
              {/* 
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // marginTop:"30px"
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="clerkRemarkEn" />}
                multiline
                variant="standard"
                fullWidth
                {...register("clerkRemarkEnglish")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("clerkRemarkEnglish") ? true : false) ||
                    (router.query.clerkRemarkEnglish ? true : false),
                }}
                error={!!errors.clerkRemarkEn}
                helperText={errors?.clerkRemarkEn ? errors.clerkRemarkEn.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="clerkRemarkMr" />}
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("clerkRemarkMarathi")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("clerkRemarkMarathi") ? true : false) ||
                    (router.query.clerkRemarkMarathi ? true : false),
                }}
                error={!!errors.clerkRemarkMr}
                helperText={errors?.clerkRemarkMr ? errors.clerkRemarkMr.message : null}
              />
            </Grid>
          </Grid> }

          {/* cons dpt hod Remarks */}
              {/* <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // marginTop:"30px"
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="hodRemarksEn" />}
                multiline
                variant="standard"
                fullWidth
                {...register("hodRemarkEnglish")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("hodRemarkEnglish") ? true : false) ||
                    (router.query.hodRemarkEnglish ? true : false),
                }}
                error={!!errors.hodRemarksEn}
                helperText={errors?.hodRemarksEn ? errors.hodRemarksEn.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="hodRemarksMr" />}
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("hodRemarkMarathi")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("hodRemarkMarathi") ? true : false) ||
                    (router.query.clerkRemarkMarathi ? true : false),
                }}
                error={!!errors.hodRemarksMr}
                helperText={errors?.hodRemarksMr ? errors.hodRemarksMr.message : null}
              />
            </Grid>
          </Grid> */}
              {/* Advocate written statement
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // marginTop:"30px"
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="writtenStatememtEn" />}
                multiline
                variant="standard"
                fullWidth
                {...register("lawyerRemarkEn")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("lawyerRemarkEn") ? true : false) || (router.query.lawyerRemarkEn ? true : false),
                }}
                error={!!errors.writtenStatememtEn}
                helperText={errors?.writtenStatememtEn ? errors.writtenStatememtEn.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="writtenStatememtMr" />}
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("lawyerRemarkMr")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("lawyerRemarkMr") ? true : false) || (router.query.lawyerRemarkMr ? true : false),
                }}
                error={!!errors.writtenStatememtMr}
                helperText={errors?.writtenStatememtMr ? errors.writtenStatememtMr.message : null}
              />
            </Grid>
          </Grid> */}

              {/*  Department name */}
              <Grid
                container
                sx={{
                  marginTop: "10px",
                }}
              >
                <Grid
                  item
                  // xs={12}
                  xs={4}
                  // sm={5}
                  // md={5}
                  // lg={5}
                  // xl={5}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  // }}
                >
                  <FormControl
                    sx={{ marginTop: 2 }}
                    error={!!errors?.departmentName}
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="deptName" />
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="deptName" />}
                          // placeholder="Select Department Name"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // setSelectedDepartment(
                            //   value.target.value
                            // );
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {applicableDepartments.length > 0
                            ? applicableDepartments.map((dept, index) => {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={dept.id}
                                    style={{
                                      display: dept.department
                                        ? "flex"
                                        : "none",
                                    }}
                                  >
                                    {/* {user.department} */}

                                    {language == "en"
                                      ? dept?.department
                                      : dept?.departmentMr}
                                  </MenuItem>
                                );
                              })
                            : []}
                        </Select>
                      )}
                      name="departmentName"
                      // name="department"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.departmentName
                        ? errors?.departmentName?.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Final Approval Remark From Legal HOD */}

              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  xl={12}
                  md={12}
                  sm={12}
                  sx={{
                    marginTop: "5vh",
                  }}
                >
                  {/* <GoogleTranslationComponent
                    fieldName={"finalAssignedRemarkByLegalHod"}
                    updateFieldName={"finalAssignedRemarkByLegalHodMr"}
                    sourceLang={"en"}
                    targetLang={"mr"}
                    targetError={"finalAssignedRemarkByLegalHodMr"}
                    label="Final Approval Remark From Legal HOD (In English)"
                    error={!!errors.finalAssignedRemarkByLegalHod}
                    helperText={
                      errors?.finalAssignedRemarkByLegalHod
                        ? errors.finalAssignedRemarkByLegalHod.message
                        : null
                    }
                  /> */}
                  <TextField
                    sx={{
                      width: "88%",
                      marginTop: "5vh",
                    }}
                    id="standard-textarea"
                    // label={<FormattedLabel id="hodRemarksEn" />}
                    label="Final Approval Remark From Legal HOD (In English) *"
                    multiline
                    variant="standard"
                    fullWidth
                    {...register("finalAssignedRemarkByLegalHod")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("finalAssignedRemarkByLegalHod")
                          ? true
                          : false) ||
                        (router.query.finalAssignedRemarkByLegalHod
                          ? true
                          : false),
                    }}
                    error={!!errors.finalAssignedRemarkByLegalHod}
                    helperText={
                      errors?.finalAssignedRemarkByLegalHod
                        ? errors.finalAssignedRemarkByLegalHod.message
                        : null
                    }
                  />

                  {/*  Button For Translation */}
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "7vh",
                      marginLeft: "1vw",
                    }}
                    onClick={() =>
                      finalAssignedRemarkByLegalHodApi(
                        watch("finalAssignedRemarkByLegalHod"),
                        "finalAssignedRemarkByLegalHodMr",
                        "en"
                      )
                    }
                  >
                    <FormattedLabel id="mar" />
                  </Button>

                  {/* New Transliteration  */}

                  {/* <Transliteration
                  _key={"finalAssignedRemarkByLegalHod"}
                  labelName={"finalAssignedRemarkByLegalHod"}
                  fieldName={"finalAssignedRemarkByLegalHod"}
                  updateFieldName={"finalAssignedRemarkByLegalHodMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  // disabled={disabled}
                  label={
                    <FormattedLabel id="finalApprovalFromLCHODEn" required />
                  }
                  error={!!errors.finalAssignedRemarkByLegalHod}
                  helperText={
                    errors?.finalAssignedRemarkByLegalHod
                      ? errors.finalAssignedRemarkByLegalHod.message
                      : null
                  }
                  InputLabelProps={{
                    //true
                    shrink:
                      (watch("finalAssignedRemarkByLegalHod") ? true : false) ||
                      (router.query.finalAssignedRemarkByLegalHod
                        ? true
                        : false),
                  }}
                /> */}
                </Grid>

                <Grid
                  item
                  xs={12}
                  xl={12}
                  md={12}
                  sm={12}
                  sx={{
                    marginTop: "5vh",
                  }}
                >
                  {/* <GoogleTranslationComponent
                    fieldName={"finalAssignedRemarkByLegalHodMr"}
                    updateFieldName={"finalAssignedRemarkByLegalHod"}
                    sourceLang={"mr"}
                    targetLang={"en"}
                    targetError={"finalAssignedRemarkByLegalHod"}
                    label="Final Approval Remark From Legal HOD (In Marathi)"
                    error={!!errors.finalAssignedRemarkByLegalHodMr}
                    helperText={
                      errors?.finalAssignedRemarkByLegalHodMr
                        ? errors.finalAssignedRemarkByLegalHodMr.message
                        : null
                    }
                  /> */}
                  <TextField
                    sx={{
                      marginTop: "5vh",
                      width: "88%",
                    }}
                    id="standard-textarea"
                    label="Final Approval Remark From Legal HOD (In Marathi)"
                    multiline
                    variant="standard"
                    fullWidth
                    {...register("finalAssignedRemarkByLegalHodMr")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("finalAssignedRemarkByLegalHodMr")
                          ? true
                          : false) ||
                        (router.query.finalAssignedRemarkByLegalHodMr
                          ? true
                          : false),
                    }}
                    error={!!errors.finalAssignedRemarkByLegalHodMr}
                    helperText={
                      errors?.finalAssignedRemarkByLegalHodMr
                        ? errors.finalAssignedRemarkByLegalHodMr.message
                        : null
                    }
                  />
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "7vh",
                      marginLeft: "1vw",
                    }}
                    onClick={() =>
                      finalAssignedRemarkByLegalHodApi(
                        watch("finalAssignedRemarkByLegalHodMr"),
                        "finalAssignedRemarkByLegalHod",
                        "mr"
                      )
                    }
                  >
                    <FormattedLabel id="eng" />
                  </Button>

                  {/* New Transliteration  */}
                  {/* <Transliteration
                  _key={"finalAssignedRemarkByLegalHodMr"}
                  labelName={"finalAssignedRemarkByLegalHodMr"}
                  fieldName={"finalAssignedRemarkByLegalHodMr"}
                  updateFieldName={"finalAssignedRemarkByLegalHod"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  // disabled={disabled}
                  label={
                    <FormattedLabel id="finalApprovalFromLCHODMr" required />
                  }
                  error={!!errors.finalAssignedRemarkByLegalHodMr}
                  helperText={
                    errors?.finalAssignedRemarkByLegalHodMr
                      ? errors.finalAssignedRemarkByLegalHodMr.message
                      : null
                  }
                  InputLabelProps={{
                    //true
                    shrink:
                      (watch("finalAssignedRemarkByLegalHodMr")
                        ? true
                        : false) ||
                      (router.query.finalAssignedRemarkByLegalHodMr
                        ? true
                        : false),
                  }}
                /> */}
                </Grid>
              </Grid>

              {/* Button Row */}

              <Grid
                container
                mt={10}
                ml={5}
                mb={5}
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
                xs={12}
              >
                <Button
                  variant="contained"
                  size="small"
                  type="submit"
                  // onClick={() => setButtonText("Approve")}

                  sx={{ backgroundColor: "#00A65A" }}
                  name="Approve"
                  endIcon={<TaskAltIcon />}
                >
                  {/* Approve */}
                  <FormattedLabel id="approve" />
                </Button>
                {/* <Button
              variant="contained"
              size="small"
              //   type="submit"
              onClick={() => setButtonText("Reassign")}
              sx={{ backgroundColor: "#00A65A" }}
              name="Reassign"
              endIcon={<UndoIcon />}
            >
              <FormattedLabel id="reassign" />
            </Button> */}
                <Button
                  size="small"
                  variant="contained"
                  sx={{ backgroundColor: "#DD4B39" }}
                  endIcon={<CloseIcon />}
                  onClick={() => {
                    localStorage.removeItem("parawiseRequestAttachmentList");
                    router.push("/LegalCase/transaction/newCourtCaseEntry");
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>

              {/* ////////////////////////////////// */}
              {/* Modal */}
              <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                sx={{
                  padding: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                {/* <Box
                sx={{
                  width: "30%",
                  bgcolor: "white",
                  p: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  border: "2px solid black",
                  borderRadius: "20px",
                }}
              >
                {selectedRowData && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                      // flexDirection: "column",
                    }}
                  >
                    {selectedRowData?.filePaths.map((filePath, index) => (
                      <IconButton
                        key={index}
                        color="primary"
                        onClick={() => {
                          window.open(
                            `${urls.CFCURL}/file/preview?filePath=${filePath.filePath}`,
                            "_blank"
                          );
                        }}
                      >
                        <div
                          style={
                            {
                              // display: "flex",
                              // justifyContent: "center",
                              // alignItems: "center",
                              // flexWrap: "wrap",
                            }
                          }
                        >
                          <Button
                            variant="contained"
                            size="small"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "15px",
                              color: "black",
                            }}
                          >
                            {filePath?.FileName}
                          </Button>
                        </div>
                      </IconButton>
                    ))}
                  </div>
                )}

                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={handleCloseModal}
                  sx={{
                    marginTop: "20px",
                  }}
                >
                  Close
                </Button>
              </Box> */}
                <Box sx={styleForModal}>
                  <>
                    <div
                      style={{
                        // backgroundColor: "#0084ff",
                        backgroundColor: "#556CD6",

                        color: "white",
                        fontSize: 20,
                        marginTop: 30,
                        marginBottom: 20,
                        // padding: 8,
                        paddingLeft: 30,
                        // marginLeft: "50px",
                        marginRight: "75px",
                        borderRadius: 100,
                        width: "100%",
                        height: "5vh",
                      }}
                    >
                      <strong
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {/* All Previous Documents */}
                        <FormattedLabel id="allPreviousDocuments" />
                      </strong>
                    </div>
                    <DataGrid
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
                      density="compact"
                      getRowId={(row) => row.srNo}
                      autoHeight
                      scrollbarSize={17}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      // pagination
                      // paginationMode="server"
                      // hideFooter={true}
                      rows={
                        // []
                        selectedRowData?.filePaths?.map((data, i) => {
                          return {
                            ...data,
                            srNo: i + 1,
                          };
                        })
                      }
                      columns={_docsCol}
                      // onPageChange={(_data) => {}}
                      // onPageSizeChange={(_data) => {}}
                    />
                    <Grid
                      container
                      paddingTop={2}
                      justifyContent="center"
                      alignItems="center"
                      display="flex"
                    >
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={handleCloseModal}
                        sx={{
                          marginTop: "20px",
                        }}
                      >
                        <FormattedLabel id="submit" />
                      </Button>
                    </Grid>
                  </>
                </Box>
              </Modal>

              {/* /////////////////////////// */}
              {/* For Modal  */}
              <Modal
                open={openModal}
                sx={{
                  // padding: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    border: "5px",
                    background: "white",
                    // marginTop: "100px",
                    height: "auto",
                    width: "1000px",
                    // marginLeft: "200px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography>Document Upload</Typography>

                  {/** FileTableComponent **/}
                  <FileTable
                    appName="LCMS" //Module Name
                    serviceName={"L-Notice"} //Transaction Name
                    fileName={attachedFile} //State to attach file
                    filePath={setAttachedFile} // File state upadtion function
                    newFilesFn={setAdditionalFiles} // File data function
                    columns={columnsForDocuments} //columns for the table
                    rows={NewCourtCaseEntryAttachmentList} //state to be displayed in table
                    uploading={setUploading}
                    buttonInputStateNew={buttonInputStateNew}
                    rowIndex={rowIndex != null ? rowIndex : null}
                    deptId={deptId != null ? deptId : null}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => {
                        setOpenModal(false);
                        setRowIndex(null);
                        setDeptId(null);
                      }}
                      sx={{ width: "70px", marginBottom: "20px" }}
                    >
                      {language == "en" ? "close" : "बंद करा"}
                    </Button>
                  </div>
                </Box>
              </Modal>
            </Paper>
          </form>
          \
          <>
            <Modal
              open={showDocketSubDetailsModel}
              sx={{
                padding: 5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <Box
                sx={{
                  width: "50%",
                  bgcolor: "background.paper",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  border: "2px solid black",
                  borderRadius: 5,
                }}
              >
                <TextareaAutosize
                  disabled
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "15px",
                    resize: "none",
                    overflowY: "auto",
                    borderRadius: 20,
                    marginBottom: "20px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px whitesmoke",
                  }}
                  placeholder="Subject Details"
                  value={noticeNarDetails}
                  color="black"
                  minRows={5}
                  maxRows={8}
                />

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    setShowDocketSubDetailsModel(false),
                      setNoticeNarDetails("");
                  }}
                  sx={{ marginBottom: "20px" }}
                >
                  {language == "en" ? "close" : "बंद करा"}
                </Button>
              </Box>
            </Modal>
          </>
        </FormProvider>
      )}
    </>
  );
};

export default Index;
