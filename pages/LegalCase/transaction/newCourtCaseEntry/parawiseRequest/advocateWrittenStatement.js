import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Autocomplete,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React, { useEffect, useState } from "react";
// import * as yup from 'yup'
import sweetAlert from "sweetalert";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import { saveAs } from "file-saver";
import moment from "moment";
import {
  Controller,
  useForm,
  useFieldArray,
  FormProvider,
} from "react-hook-form";
import { useSelector } from "react-redux";
import { GridToolbar, GridViewStreamIcon } from "@mui/x-data-grid";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/LegalCaseSchema/approveOpinionSchema";
import DeleteIcon from "@mui/icons-material/Delete";
import urls from "../../../../../URLS/urls";

import styles from "../../../../../styles/LegalCase_Styles/parawiseReport.module.css";

import { advocate1 } from "../../../../../containers/schema/LegalCaseSchema/parawiseRequest";
import { yupResolver } from "@hookform/resolvers/yup";
import FileTable from "../../../FileUploadByAnwar/FileTableWithoutRowIndex";
import { Delete, Visibility } from "@mui/icons-material";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import Loader from "../../../../../containers/Layout/components/Loader";
import GoogleTranslationComponent from "../../../../../components/common/linguosol/googleTranslation";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
// import {
//   DecryptData,
//   EncryptData,
// } from "../../../..../../../components/common/EncryptDecrypt";

import {
  DecryptData,
  EncryptData,
} from "../../../../../components/common/EncryptDecrypt";

const Index = () => {
  const user = useSelector((state) => {
    return state.user.user;
  });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(advocate1),
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    // methods,
    reset,
    getValues,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = methods;

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   getValues,
  //   setValue,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(advocate1),
  //   mode: "onChange",
  // });

  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [dptData, setDptData] = useState([]);
  const [caseEntryData, setCaseEntryData] = useState();
  const [buttonText, setButtonText] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);
  const [parawiseRequestByCaseEntry, setParawiseRequestByCaseEntry] = useState(
    []
  );
  const [parawiseEntryData, setParawiseEntryData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departments1, setDepartments1] = useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedRowData, setSelectedRowData] = useState(null);

  // For Document Modal
  const [openModal, setOpenModal] = useState(false);

  // For Reassign

  const [openModal1, setOpenModal1] = useState(false);

  const [rowIndex, setRowIndex] = useState(null);
  const [deptId, setDeptId] = useState(null);

  // For Documente
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [NewCourtCaseEntryAttachmentList, setNewCourtCaseEntryAttachmentList] =
    useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [deleteButtonInputState, setDeleteButtonInputState] = useState(true);
  const [dataToAttachInPayload, setdataToAttachInPayload] = useState(null);

  const [loading, setLoading] = useState(false);
  const [noticeNarDetails, setNoticeNarDetails] = useState("");
  const [showDocketSubDetailsModel, setShowDocketSubDetailsModel] =
    useState(false);
  const token = useSelector((state) => state.user.user.token);

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const [tempDepartment1, setTempDepartment1] = useState([]);

  const [approveRejectRemarkMode, setApproveRejectRemarkMode] = useState("");
  const [selected, setSelected] = useState([]);
  const handleSelect = (evt, value) => {
    const selectedIds = value.map((val) => val.id);
    setValue("advocateReassignedDeptId", selectedIds);
  };

  // const [buttonText, setButtonText] = useState();

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

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "parawiseRequestDao", // unique name for your Field Array
    }
  );

  const handleOpen = (approveRejectRemarkMode) => {
    setOpen(true);
    setApproveRejectRemarkMode(approveRejectRemarkMode);
  };

  const handleChange = (event, value) => {
    setSelected(value);
    // setSelectedID(value.map((item) => item.id));

    // setSelectedID(
    //   value.map((v) => advocateNames.find((o) => o.FullName === v).id)
    // );
  };

  const [translatedRemarks, setTranslatedRemarks] = useState({});

  // --------------------------Transaltion API--------------------------------
  const translateAdvRemarksApi = (
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

    // const translationResult = "Translated Value"; // Replace this with your actual translation logic

    // // Update the state with translated values
    // setTranslatedRemarks((prevTranslatedRemarks) => ({
    //   ...prevTranslatedRemarks,
    //   [params.row.id]: { [updateFieldName]: translationResult },
    // }));
  };
  // -------------------------------------------------------------------------

  const getCaseEntryData = () => {
    if (router?.query?.id) {
      axios
        .get(
          `${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("getCaseEntryData", res.data);
          setCaseEntryData(res?.data);
        });
    }
  };
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
  // departments
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          res?.data?.department.map((r, i) => ({
            id: r?.id,
            department: r?.department,
            departmentMr: r?.departmentMr,
          }))
        );
      });
  };

  const getParawiseRequestByCaseEntryId = () => {
    axios
      .get(
        `${urls.LCMSURL}/parawiseRequest/getParawiseRequestByCaseEntryId?caseEntryId=${router.query.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("getParawiseRequestByCaseEntryId", res.data);

        // add a new field in res.data called departmentName
        // iterate res.data
        let var1 = res.data.map((item) => {
          // refer to departments list to get department name
          console.log("departments1212", departments);
          return {
            departmentNameNew: departments.find(
              (dept) => dept.id == item.departmentId
            )?.department,
            ...item,
          };
        });

        console.log("var1", var1);

        let finalTableData = [];
        // Iterate res.data
        res.data.map((item) => {
          // convert item.clerkRemarkEnglish to json array
          let clerkRemarkEnglishJson = JSON.parse(item.clerkRemarkEnglish);

          // iterate clerkRemarkEnglishJson
          clerkRemarkEnglishJson?.map((clerkRemarkEnglishJsonItem) => {
            finalTableData?.push({
              id: item.id,
              departmentId: item.departmentId,
              // refer to departments list to get department name
              departmentName: departments.find(
                (dept) => dept.id == item.departmentId
              )?.department,
              issueNo: clerkRemarkEnglishJsonItem.issueNo,
              answerInEnglish: clerkRemarkEnglishJsonItem.answerInEnglish,
              answerInMarathi: clerkRemarkEnglishJsonItem.answerInMarathi,
            });

            console.log("loopdata", watch("parawiseRequestDao").length);

            // if (watch("parawiseRequestDao").length == 0) {
            append({
              departmentName: departments.find(
                (dept) => dept.id == item.departmentId
              )?.department,
              issueNo: clerkRemarkEnglishJsonItem.issueNo,
              answerInEnglish: clerkRemarkEnglishJsonItem.answerInEnglish,
              answerInMarathi: clerkRemarkEnglishJsonItem.answerInMarathi,
            });
            // }
          });
        });

        console.log("finalTableData", finalTableData);
        setParawiseEntryData(finalTableData);
      });
  };

  // // get Parawise from legal clerk
  // const getParawiseFromLegal = () => {
  //   axios
  //     .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAllBynewCourtCaseEntryId?caseEntryId=${router.query.id}`)
  //     .then((res) => {
  //       console.log("getParawiseRequestByCaseEntryId", res.data);
  //       setParawiseRequestByCaseEntry(res.data);
  //     });
  // };

  const getDptDataById = () => {
    if (router?.query?.departmentId) {
      axios
        .get(
          `${urls.LCMSURL}/parawiseRequest/getParawiseReportByDptId?dptId=${router.query.departmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          let departmentData = res?.data?.find(
            (item) =>
              item?.trnNewCourtCaseEntryDaoKey == router?.query?.caseEntryId
          );
          //   console.log("depardatagridtmentData", departmentData);
          setDptData(departmentData);
        });
    }
  };

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const columns1 = [
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Select
          style={{
            width: "100%",
            padding: "0 !important",
          }}
          value={params?.row?.action}
          onChange={() => {
            console.log("dsf34234", params, watch("RevertTableData"));

            const data = watch("RevertTableData")?.find(
              (data) => data?.id == params?.row?.id
            );
            const data1 = watch("RevertTableData")?.filter(
              (data) => data?.id != params?.row?.id
            );

            const data2 = {
              ...data,
              action: params?.row?.action == "APPROVE" ? "REASSIGN" : "APPROVE",
            };

            console.log("sdfsdf", data1, data2);
            const upDateObject = [...data1, data2];
            setValue("RevertTableData", upDateObject);
          }}
        >
          <MenuItem value="APPROVE">{"APPROVE"}</MenuItem>
          <MenuItem value="REASSIGN">{"REASSIGN"}</MenuItem>
        </Select>
      ),
    },
    {
      field: language == "en" ? "departmentNameEng" : "departmentNameMr",
      headerName: <FormattedLabel id="deptName" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "advocateReassignedRemarksEn",
      headerName: <FormattedLabel id="remarksEn" />,
      width: 400,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <TextField
          multiline
          style={{
            width: "100%",
          }}
          id="standard-basic"
          // inputProps={{ maxLength: 10 }}
          InputLabelProps={{ shrink: true }}
          label={<FormattedLabel id="mobile" required />}
          onChange={(e) => {
            console.log(
              "Text field value changed:",
              e.target.value,
              params?.row?.id
            );

            const data = watch("RevertTableData")?.find(
              (data) => data?.id == params?.row?.id
            );
            const data1 = watch("RevertTableData")?.filter(
              (data) => data?.id != params?.row?.id
            );
            const data2 = {
              ...data,
              advocateReassignedRemarksEn: e.target.value,
            };

            console.log("sdfsdf", data1, data2);
            const upDateObject = [...data1, data2];
            setValue("RevertTableData", upDateObject);
          }}
        />
      ),
    },
    {
      field: "change",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          {/* Eng Button */}
          <Button
            variant="contained"
            size="small"
            sx={{
              // marginTop: "10px",
              marginLeft: "1vw",
            }}
            onClick={() =>
              translateAdvRemarksApi(
                params?.row?.advocateReassignedRemarksEn, // Pass the English remarks
                "advocateReassignedRemarksMr",
                "en"
              )
            }
          >
            <FormattedLabel id="eng" />
          </Button>

          {/* Marathi */}
          <Button
            variant="contained"
            size="small"
            sx={{
              // marginTop: "1vh",
              marginLeft: "1vw",
            }}
            onClick={() =>
              translateAdvRemarksApi(
                params?.row?.advocateReassignedRemarksMr, // Pass the Marathi remarks
                "advocateReassignedRemarksEn",
                "mr"
              )
            }
          >
            <FormattedLabel id="mar" />
          </Button>

          {/* {translatedRemarks[params.row.id]?.advocateReassignedRemarksMr || ""} */}

          {/* <Button
            style={{
              width: "50%",
              padding: "0 !important",
              color: "blue",
            }}
          >
            Eng
          </Button> */}
        </>
      ),
    },
    {
      field: "advocateReassignedRemarksMr",
      headerName: <FormattedLabel id="remarksMr" />,
      width: 400,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <TextField
            multiline
            style={{
              width: "100%",
              padding: "0 !important",
            }}
            id="standard-basic"
            inputProps={{ maxLength: 10 }}
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="mobile" required />}
            onChange={(e) => {
              console.log(
                "Text field value changed:",
                e.target.value,
                params?.row?.id
              );

              const data = watch("RevertTableData")?.find(
                (data) => data?.id == params?.row?.id
              );
              const data1 = watch("RevertTableData")?.filter(
                (data) => data?.id != params?.row?.id
              );
              const data2 = {
                ...data,
                advocateReassignedRemarksMr: e.target.value,
              };

              console.log("sdfsdf", data1, data2);
              const upDateObject = [...data1, data2];
              setValue("RevertTableData", upDateObject);
            }}
          />
        </>
      ),
    },
  ];

  // const columns1 = [

  //   {
  //     field: "advocateReassignedRemarksEn",
  //     headerName: <FormattedLabel id="remarksEn" />,
  //     // flex: 1,
  //     // width: 260,
  //     flex: 1,

  //     headerAlign: "center",
  //     align: "center",
  //
  //   },
  //   //button

  //   {
  //     field: "advocateReassignedRemarksMr",
  //     headerName: <FormattedLabel id="remarksMr" />,
  //     // width: 260,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //     renderCell: (params) => (
  //       <>
  //         <TextField
  //           id="standard-basic"
  //           inputProps={{ maxLength: 10 }}
  //           InputLabelProps={{ shrink: true }}
  //           label={<FormattedLabel id="mobile" required />}
  //           onChange={(e) => {
  //             console.log(
  //               "Text field value changed:",
  //               e.target.value,
  //               params?.row?.id
  //             );

  //             const data = watch("RevertTableData")?.find(
  //               (data) => data?.id == params?.row?.id
  //             );
  //             const data1 = watch("RevertTableData")?.filter(
  //               (data) => data?.id != params?.row?.id
  //             );
  //             const data2 = {
  //               ...data,
  //               advocateReassignedRemarksMr: e.target.value,
  //             };

  //             console.log("sdfsdf", data1, data2);
  //             const upDateObject = [...data1, data2];
  //             setValue("RevertTableData", upDateObject);
  //           }}
  //         />
  //       </>
  //     ),
  //   },
  // ];

  const columns = [
    {
      // set filed as departmentName | derrive it from departments and departmentId
      field: "departmentNameEn",
      headerName: <FormattedLabel id="deptName" />,
      align: "center",
      headerAlign: "center",
      width: 220,
    },

    {
      flex: 1,
      headerName: <FormattedLabel id="concernDepartmentHODRemarkInEnglish" />,

      field: "consernDptHodRemark",
      align: "center",
      headerAlign: "center",

      //
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

      //
    },
    {
      flex: 1,
      headerName: <FormattedLabel id="concernDepartmentHODRemarkInMarathi" />,

      field: "consernDptHodRemarkMr",
      align: "center",
      headerAlign: "center",

      //

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

  const columnsParaEntry = [
    {
      field: "departmentName",
      headerName: "Department Name",
      align: "center",
      headerAlign: "center",
      width: 250,
    },
    {
      field: "issueNo",
      headerName: "Issue No",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "answerInEnglish",
      align: "center",
      headerAlign: "center",
      headerName: "Concern Department Clerk Remark in English",
      flex: 1,
    },
    {
      flex: 1,
      headerName: "Concern Department Clerk Remark in Marathi",
      field: "answerInMarathi",
      align: "center",
      headerAlign: "center",
    },
  ];

  useEffect(() => {
    getCaseEntryData();
    if (departments.length > 0) {
      getParawiseRequestByCaseEntryId();
    }
  }, [departments]);

  useEffect(() => {
    getDptDataById();
  }, [caseEntryData]);

  useEffect(() => {
    console.log("df234dfsdfsdf", watch("RevertTableData"));
  }, [watch("RevertTableData")]);

  // useEffect(() => {
  //   console.log("dptData", dptData);

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
  // }, [dptData, caseEntryData]);

  useEffect(() => {
    setValue("clerkRemarkEnglish", dptData?.clerkRemarkEnglish);
    setValue("clerkRemarkMarathi", dptData?.clerkRemarkMarathi);
    if (router.query.pageMode == "View") {
      setValue("hodRemarkEnglish", dptData?.hodRemarkEnglish);
      setValue("hodRemarkMarathi", dptData?.hodRemarkMarathi);
    }
  }, [dptData]);

  // NEW CODE By A.ANSARI
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

  //       setTableData(transformedData);
  //     });
  // };
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

        //! new

        const tttTestData = res?.data?.trnParawiseListDao?.map((data) => {
          return {
            ...data,
            action: "APPROVE",
            departmentNameEng: departments.find(
              (dept) => dept.id == data.departmentId
            )?.department,
            departmentNameMr: departments.find(
              (dept) => dept.id == data.departmentId
            )?.departmentMr,
          };
        });
        setValue("RevertTableData", tttTestData);
        console.log("tttTestData", tttTestData);

        const deptId = res?.data?.trnParawiseListDao?.map((data) => {
          return {
            departmentId: data?.departmentId,
          };
        });

        console.log("df3423423", deptId);

        const findDept = [];

        deptId?.map((data) => {
          const test = departments?.find(
            (newData) => newData?.id == data?.departmentId
          );

          const test1 = {
            ...test,
            id: data?.departmentId,
          };

          if (test1) {
            findDept.push(test1);
          }
        });

        console.log("sdfsdf32423423", findDept);

        setDepartments1(findDept);

        // ----------------------------------------------------------------------------------------------------
        // add a new field in res.data called departmentName
        // iterate res.data
        let var1 = _res?.map((item) => {
          // refer to departments list to get department name
          console.log("departments1212", departments);
          return {
            ...item,
            departmentNameNew: departments.find(
              (dept) => dept.id == item.departmentId
            )?.department,
          };
        });

        console.log("var1", var1);

        let finalTableData = [];
        // Iterate res.data
        _res?.map((item) => {
          // convert item.clerkRemarkEnglish to json array
          let clerkRemarkEnglishJson = JSON.parse(item.consernDptClerkRemark);

          // iterate clerkRemarkEnglishJson
          clerkRemarkEnglishJson?.map((clerkRemarkEnglishJsonItem) => {
            finalTableData?.push({
              id: item.id,
              departmentId: item.departmentId,
              // refer to departments list to get department name
              departmentName: departments.find(
                (dept) => dept.id == item.departmentId
              )?.department,
              issueNo: clerkRemarkEnglishJsonItem.issueNo,
              answerInEnglish: clerkRemarkEnglishJsonItem.answerInEnglish,
              answerInMarathi: clerkRemarkEnglishJsonItem.answerInMarathi,
            });

            console.log("loopdata", watch("parawiseRequestDao").length);

            // if (watch("parawiseRequestDao").length == 0) {
            //   append({
            //     departmentName: departments.find(
            //       (dept) => dept.id == item.departmentId
            //     )?.department,
            //     issueNo: clerkRemarkEnglishJsonItem.issueNo,
            //     answerInEnglish: clerkRemarkEnglishJsonItem.answerInEnglish,
            //     answerInMarathi: clerkRemarkEnglishJsonItem.answerInMarathi,
            //   });
            // }
          });
        });

        console.log("finalTableData", finalTableData);
        // setParawiseEntryData(finalTableData);
        setValue("parawiseRequestDao", finalTableData);
        // ----------------------------------------------------------------------------------------------------

        setTableData(transformedData ?? []);
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
      field: language === "en" ? "locationNameEn" : "locationNameMr",
      headerName: language === "en" ? "Location Name" : "स्थानाचे नाव",
      flex: 1,
      minWidth: 250,
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

        return (
          rowData?.filePaths?.length !== 0 && (
            <Button
              size="small"
              variant="contained"
              onClick={() => handleOpenModal(rowData)}
            >
              View
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
  // const viewFile = (filePath) => {
  //   console.log("filePath", filePath);

  //   //
  //   const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);

  //   const newFilePath = DecryptPhoto?.split(".").pop().toLowerCase();

  //   const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
  //   //
  //   if (filePath?.includes(".pdf")) {
  //     setLoading(true);
  //     // const url = `${urls.CFCURL}/file/preview?filePath=${filePath}`;

  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         responseType: "arraybuffer",
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         if (response && response.data instanceof ArrayBuffer) {
  //           const pdfBlob = new Blob([response.data], {
  //             type: "application/pdf",
  //           });
  //           const pdfUrl = URL.createObjectURL(pdfBlob);

  //           const newTab = window.open();
  //           newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
  //         } else {
  //           console.error("Invalid or missing data in the response");
  //         }
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".csv")) {
  //     setLoading(true);
  //     // const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         console.log("Excel API Response:", response);
  //         console.log("Excel API Response Data:", response.data.fileName);

  //         const excelBase64 = response.data.fileName;

  //         const data = base64ToArrayBuffer(excelBase64);

  //         const excelBlob = new Blob([data], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });

  //         saveAs(excelBlob, "NewDoc.csv");
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".xlsx")) {
  //     setLoading(true);
  //     // const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         console.log("Excel API Response:", response);
  //         console.log("Excel API Response Data:", response.data.fileName);

  //         const excelBase64 = response.data.fileName;

  //         const data = base64ToArrayBuffer(excelBase64);

  //         const excelBlob = new Blob([data], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });

  //         saveAs(excelBlob, "Vishaypatra.xlsx");
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //   } else {
  //     setLoading(true);
  //     // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((r) => {
  //         setLoading(false);
  //         console.log(
  //           "ImageApi21312",
  //           `data:image/png;base64,${r?.data?.fileName}`
  //         );
  //         const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
  //         const newTab = window.open();
  //         // newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
  //         newTab.document.body.innerHTML = `<img src="${imageUrl}" style="width: 100vw; height: 100vh; object-fit: scale-down ;" />`;
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //   }
  // };

  //

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
    console.log(":a2", props);
    swal({
      title: language == "en" ? "Delete ?" : "हटवा ?",
      text:
        language == "en"
          ? "Are you sure you want to delete the file ?"
          : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता ?",
      icon: "warning",
      buttons: true,
      buttons: [
        language == "en" ? "Cancel" : "रद्द करा",
        language == "en" ? "OK" : "ठीक आहे",
      ],
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
              let attachement =
                localStorage.getItem("parawiseRequestAttachmentList") &&
                JSON.parse(
                  localStorage.getItem("parawiseRequestAttachmentList")
                )
                  ?.filter((a) => a?.filePath != props.filePath)
                  ?.map((a) => a);

              setAdditionalFiles(attachement);
              setNewCourtCaseEntryAttachmentList(
                attachement ? attachement : []
              );

              localStorage.removeItem("parawiseRequestAttachmentList");

              localStorage.setItem(
                "parawiseRequestAttachmentList",
                attachement
              );
              swal(
                language == "en"
                  ? "File Deleted Successfully!"
                  : "फाइल यशस्वीरित्या हटवली!",
                { icon: "success" }
              );
            } else {
              swal("Something went wrong..!!!");
            }
          });
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

  const onSubmitForm = (Data1, ApproveRejectStatus) => {
    const Data = watch();

    console.log("Dataet32432432432432432", Data1, ApproveRejectStatus);

    let finalData = JSON.stringify(Data.parawiseRequestDao);

    let getLocalDataToSend = localStorage.getItem(
      "parawiseRequestAttachmentList"
    )
      ? localStorage.getItem("parawiseRequestAttachmentList")
      : [];

    let setLocalDataToSend =
      getLocalDataToSend?.length !== 0 ? JSON.parse(getLocalDataToSend) : [];

    console.log("data", Data);
    console.log("finalData", finalData);

    let body = {
      ...caseEntryData,
      id: caseEntryData?.id,
      updateUserId: user.id,

      lawyerRemarkEn: finalData,
      lawyerRemarkMr: finalData,
      remark: finalData,
      remarkMr: finalData,
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

    let _newParaWithDocs = dataToAttachInPayload?.trnParawiseListDao?.map(
      (dta) => {
        return {
          ...dta,
          id: dta.id,
          advocateRemark: finalData,
          advocateRemarkMr: finalData,
          parawiseRequestAttachmentList: _paraWiseInfoWithFile,
        };
      }
    );
    let _body = null;

    if (ApproveRejectStatus == "REASSIGN") {
      _body = {
        id: dataToAttachInPayload?.id,
        role: "ADVOCATE",
        // advocateReassignedRemarksMr: Data?.advocateReassignedRemarksMr,
        // advocateReassignedRemarksEn: Data?.advocateReassignedRemarksEn,
        // advocateReassignedDeptId: Data?.advocateReassignedDeptId,
        trnParawiseListDao: watch("RevertTableData"),
        action: ApproveRejectStatus,
      };
    } else if (ApproveRejectStatus == "APPROVE") {
      _body = {
        id: dataToAttachInPayload?.id,
        role: "ADVOCATE",
        remark: finalData,
        remarkMr: finalData,
        action: ApproveRejectStatus,
        trnParawiseListDao: _newParaWithDocs ?? [],
      };
    }

    console.log("body34230493204930", _body);
    axios
      .post(
        // `${urls.LCMSURL}/transaction/newCourtCaseEntry/createWrittenStatementByLawyer`,
        `${urls.LCMSURL}/parawiseRequest/saveApprove`,
        _body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("createWrittenStatementByLawyer", res);
        if (res.status == 201) {
          sweetAlert(
            // "Saved!",
            language === "en" ? "Saved!" : "जतन केले!",
            //  "Record Submitted successfully !",
            language === "en"
              ? "Record Submitted successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन केले!",
            "success"
          );
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
          localStorage.removeItem("parawiseRequestAttachmentList");
        } else if (res.status == 200) {
          sweetAlert(
            // "Updated!",
            language === "en" ? "Updated!" : "जतन केले!",
            //  "Record Updated successfully !",
            language === "en"
              ? "Record Updated successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन केले!",
            "success"
          );
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
          localStorage.removeItem("parawiseRequestAttachmentList");
        }
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
                  paddingTop: "3px",

                  backgroundColor: "#556CD6",
                  height: "9vh",
                  fontSize: 19,
                  marginRight: "75px",
                  borderRadius: 100,
                  width: "100%",
                }}
              >
                <h2
                  style={{
                    color: "white",
                  }}
                >
                  {" "}
                  <FormattedLabel id="advWrittenStatememt" />
                </h2>
              </Box>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    marginTop: 10,
                  }}
                ></div>

                {/* First Row */}
                <Grid container sx={{ padding: "10px", marginTop: "5vh" }}>
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

              {/* Grid for Department List */}
              {/* <Grid container sx={{ padding: "10px" }} mt={5} mb={5}>
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
              autoHeight={true}
              hideFooter={true}
              pagination
              paginationMode="server"
              rows={tableData}
              columns={_col}
              onPageChange={(_data) => {}}
              onPageSizeChange={(_data) => {}}
            />
          </Grid> */}

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

              {/* cons dpt clerk Remarks */}

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
          </Grid> */}

              {/* cons dpt hod Remarks
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

              {/* Add a Table below representing parawiseRequestByCaseEntry */}

              {/* <Grid container sx={{ padding: "10px" }}>
            <h1>Department Clerk Parawise Remarks</h1>
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
                rows={parawiseEntryData}
                columns={columnsParaEntry}
                onPageChange={(_data) => {
                  // getCaseType(data.pageSize, _data);
                  getAdvocate(data.pageSize, _data)
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data)
                  // updateData("page", 1);
                  getAdvocate(_data, data.page)
                }}
              />
            </Grid>
          </Grid> */}

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
                    rows={tableData}
                    columns={_col}
                    onPageChange={(_data) => {}}
                    onPageSizeChange={(_data) => {}}
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
                    columns={columns}
                    onPageChange={(_data) => {
                      // getCaseType(data.pageSize, _data);
                      getAdvocate(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getAdvocate(_data, data.page);
                    }}
                  />
                </Grid>
              </Grid>

              {/* <h1>Parawise Remark</h1> */}
              <h1>
                <FormattedLabel id="parawiseRemark" />
              </h1>

              <Box
                sx={{
                  border: "0.1rem outset black",
                  marginTop: "10px",
                }}
              >
                <Grid container className={styles.theme1}>
                  <Grid
                    item
                    xs={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h3>
                      <FormattedLabel id="pointNo" />
                    </h3>
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h3>
                      <FormattedLabel id="pointExp" />
                    </h3>
                  </Grid>
                </Grid>
                <Box
                  overflow="auto"
                  height={450}
                  flex={1}
                  flexDirection="column"
                  display="flex"
                  p={2}
                  padding="0px"
                  // sx={{
                  //   border: "0.2rem outset black",
                  //   marginTop:"10px"
                  // }}
                >
                  {fields.map((parawise, index) => {
                    return (
                      <>
                        <Grid
                          container
                          component={Box}
                          style={{ marginTop: 20 }}
                        >
                          <Grid item xs={0.1}></Grid>

                          <Grid
                            item
                            xs={1.5}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <TextField
                              disabled
                              placeholder="Issue No"
                              size="small"
                              type="number"
                              // oninput="auto_height(this)"
                              {...register(
                                `parawiseRequestDao.${index}.issueNo`
                              )}
                            />
                          </Grid>

                          <Grid item xs={0.2}></Grid>
                          {/* para for english */}
                          <Grid
                            item
                            xs={4.2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <TextField // style={auto_height_style}
                              disabled
                              // rows="1"
                              // style={{ width: 500 }}
                              style={{
                                // background:"red"

                                border: "1px  solid",
                              }}
                              fullWidth
                              multiline
                              rows={3}
                              placeholder="Paragraph Wise Answer Draft Of Issues(In English)"
                              size="small"
                              // oninput="auto_height(this)"
                              {...register(
                                `parawiseRequestDao.${index}.answerInEnglish`
                              )}
                            />
                          </Grid>

                          {/* <Grid item xs={0.3}></Grid> */}
                          <Grid item xs={1.4}></Grid>

                          {/* para for Marathi */}
                          <Grid
                            item
                            xs={4.1}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <TextField // style={auto_height_style}
                              disabled
                              // rows="1"
                              // style={{ width: 500 }}
                              style={{
                                // background:"red"

                                border: "1px  solid",
                              }}
                              fullWidth
                              multiline
                              rows={3}
                              placeholder="Paragraph Wise Answer Draft Of Issues(In Marathi)"
                              size="small"
                              // oninput="auto_height(this)"
                              {...register(
                                `parawiseRequestDao.${index}.answerInMarathi`
                              )}
                            />
                          </Grid>

                          <Grid item xs={0.4}></Grid>
                        </Grid>
                        <Grid
                          container
                          component={Box}
                          style={{ marginTop: 20 }}
                        >
                          <Grid item xs={1.6}></Grid>

                          <Grid item xs={0.2}></Grid>
                          {/* para for english */}
                          <Grid
                            item
                            xs={4.2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            {/* <GoogleTranslationComponent
                              forAdvParaRequest={true}
                              placeholder="Please Enter Written Statement Here (In English)"
                              fieldName={`parawiseRequestDao.${index}.writtenStatementInEnglish`}
                              updateFieldName={`parawiseRequestDao.${index}.writtenStatementInMarathi`}
                              sourceLang={"en"}
                              targetLang={"mr"}
                              targetError={`parawiseRequestDao.${index}.writtenStatementInMarathi`}
                              // label={<FormattedLabel id="opponentAdvocateEn" />}
                              error={
                                !!errors?.parawiseRequestDao?.[index]
                                  ?.writtenStatementInEnglish
                              }
                              helperText={
                                errors?.parawiseRequestDao?.[index]
                                  ?.writtenStatementInEnglish
                                  ? errors?.parawiseRequestDao?.[index]
                                      ?.writtenStatementInEnglish.message
                                  : null
                              }
                            /> */}
                            <TextField
                              style={{
                                backgroundColor: "LightGray",
                                border: "1px solid",
                              }}
                              fullWidth
                              multiline
                              rows={3}
                              placeholder="Please Enter Written Statement Here (In English)"
                              size="small"
                              {...register(
                                `parawiseRequestDao.${index}.writtenStatementInEnglish`
                              )}
                              key={parawise.id}
                              error={
                                !!errors?.parawiseRequestDao?.[index]
                                  ?.writtenStatementInEnglish
                              }
                              helperText={
                                errors?.parawiseRequestDao?.[index]
                                  ?.writtenStatementInEnglish
                                  ? errors?.parawiseRequestDao?.[index]
                                      ?.writtenStatementInEnglish.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xs={1.4}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                // marginTop: "1vh",
                                marginLeft: "1vw",
                              }}
                              onClick={() =>
                                translateAdvRemarksApi(
                                  watch(
                                    `parawiseRequestDao.${index}.writtenStatementInEnglish`
                                  ),
                                  `parawiseRequestDao.${index}.writtenStatementInMarathi`,
                                  "en"
                                )
                              }
                            >
                              <FormattedLabel id="mar" />
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                marginTop: "10px",
                                marginLeft: "1vw",
                              }}
                              onClick={() =>
                                translateAdvRemarksApi(
                                  watch(
                                    `parawiseRequestDao.${index}.writtenStatementInMarathi`
                                  ),
                                  `parawiseRequestDao.${index}.writtenStatementInEnglish`,
                                  "mr"
                                )
                              }
                            >
                              <FormattedLabel id="eng" />
                            </Button>
                          </Grid>
                          {/* <Grid item xs={0.2}></Grid> */}

                          {/* para for Marathi */}
                          <Grid
                            item
                            xs={4.2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            {/* <GoogleTranslationComponent
                              forAdvParaRequest={true}
                              placeholder="Please Enter Written Statement Here (In Marathi)"
                              fieldName={`parawiseRequestDao.${index}.writtenStatementInMarathi`}
                              updateFieldName={`parawiseRequestDao.${index}.writtenStatementInEnglish`}
                              sourceLang={"mr"}
                              targetLang={"en"}
                              targetError={`parawiseRequestDao.${index}.writtenStatementInEnglish`}
                              error={
                                !!errors?.parawiseRequestDao?.[index]
                                  ?.writtenStatementInMarathi
                              }
                              helperText={
                                errors?.parawiseRequestDao?.[index]
                                  ?.writtenStatementInMarathi
                                  ? errors?.parawiseRequestDao?.[index]
                                      ?.writtenStatementInMarathi.message
                                  : null
                              }
                            /> */}
                            <TextField
                              style={{
                                backgroundColor: "LightGray",
                                border: "1px solid",
                              }}
                              fullWidth
                              multiline
                              rows={3}
                              placeholder="Please Enter Written Statement Here (In Marathi)"
                              size="small"
                              {...register(
                                `parawiseRequestDao.${index}.writtenStatementInMarathi`
                              )}
                              key={parawise.id}
                              error={
                                !!errors?.parawiseRequestDao?.[index]
                                  ?.writtenStatementInMarathi
                              }
                              helperText={
                                errors?.parawiseRequestDao?.[index]
                                  ?.writtenStatementInMarathi
                                  ? errors?.parawiseRequestDao?.[index]
                                      ?.writtenStatementInMarathi.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid item xs={0.4}></Grid>
                        </Grid>
                      </>
                    );
                  })}
                  {/* </ThemeProvider> */}
                </Box>
              </Box>

              {/* Advocate written statement */}
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
                // disabled
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
                // disabled
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
                  onClick={() => {
                    handleSubmit((data) => onSubmitForm(data, "APPROVE"))();
                  }}
                  sx={{ backgroundColor: "#00A65A" }}
                  name="Approve"
                  endIcon={<TaskAltIcon />}
                >
                  <FormattedLabel id="submit" />
                </Button>

                {/* Rassign */}
                <Button
                  variant="contained"
                  type="button"
                  size="small"
                  onClick={() => {
                    setOpenModal1(true);
                  }}
                  sx={{ backgroundColor: "#00A65A" }}
                  name="Reassign"
                  endIcon={<UndoIcon />}
                >
                  <FormattedLabel id="reassign" />
                </Button>

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
                        backgroundColor: "#0084ff",
                        color: "white",
                        fontSize: 19,
                        marginTop: 30,
                        marginBottom: 20,
                        padding: 8,
                        paddingLeft: 30,
                        marginLeft: "50px",
                        marginRight: "75px",
                        borderRadius: 100,
                      }}
                    >
                      <strong
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        All Previous Documents
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
                      {/* {language == "en" ? "close" : "बंद करा"} */}
                      <FormattedLabel id="submit" />
                    </Button>
                  </div>
                </Box>
              </Modal>
            </Paper>

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

            {/* Modal For Rassign */}

            <Modal
              open={openModal1}
              sx={{
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
                  // height: "auto",
                  height: "70%",
                  width: "100%",
                  // display: "flex",
                  // justifyContent: "center",
                  // flexDirection: "column",

                  // textAlign: "center",
                }}
              >
                {/* <Grid
                  container
                  sx={{
                    marginTop: "10px",
                    marginLeft: "2vw",
                  }}
                >
                  <Grid
                    item
                    // xs={12}
                    xs={4}
                  >
                    {/* New  */}
                {/* <Autocomplete
                      sx={{ width: "350px" }}
                      multiple
                      id="checkboxes-tags-demo"
                      options={departments1}
                      disableCloseOnSelect
                      getOptionLabel={(option) =>
                        language === "en"
                          ? option.department
                              ?.split(" ")
                              .map((word) => word.charAt(0))
                              .join("")
                              .toUpperCase()
                          : option.departmentMr
                              ?.split(" ")
                              .map((word) => word.charAt(0))
                              .join(" ")
                      }
                      onChange={handleSelect}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            checked={selected}
                          />
                          {language === "en"
                            ? option.department
                            : option.departmentMr}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "320px", margin: 0 }}
                          variant="standard"
                          {...params}
                          label={<FormattedLabel id="departmentName" />}
                        />
                      )}
                    />
                  </Grid>
                // </Grid> */}
                {/* For Remarks */}
                {/* <Grid
                  container
                  sx={{
                    marginLeft: "2vw",
                    marginTop: "5vh",
                  }}
                >
                  <Grid item xs={12}>
                    <TextField
                      // fullWidth
                      sx={{
                        width: "70%",
                      }}
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      label={<FormattedLabel id="enterRemarkEn" />}
                      variant="standard"
                      {...register("advocateReassignedRemarksEn")}
                      // error={!!errors.inwardNo}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      sx={{
                        width: "70%",
                        marginTop: "4vw",
                      }}
                      InputLabelProps={{ shrink: true }}
                      id="standard-basic"
                      label={<FormattedLabel id="enterRemarkMr" />}
                      variant="standard"
                      {...register("advocateReassignedRemarksMr")}
                      // error={!!errors.inwardNo}
                    />
                  </Grid>
                </Grid> */}

                {/* Tabel  */}
                <div style={{ padding: "5vh" }}>
                  <DataGrid
                    // components={{ Toolbar: GridToolbar }}
                    // componentsProps={{
                    //   toolbar: {
                    //     showQuickFilter: false,
                    //     quickFilterProps: { debounceMs: 500 },
                    //   },
                    // }}
                    autoHeight
                    sx={{
                      marginTop: "5vh",
                      // width: "100%",

                      border: "1px solid rgb(128,128,128,0.5)",
                      boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.5)",

                      "& .cellColor": {
                        backgroundColor: "#125597",
                        color: "white",
                      },
                    }}
                    getRowId={(data) => data?.id}
                    density="compact"
                    // autoHeight={true}
                    // rowHeight={50}
                    pagination
                    paginationMode="server"
                    rows={
                      watch("RevertTableData") != null &&
                      watch("RevertTableData") != undefined &&
                      watch("RevertTableData").length >= 1
                        ? [...watch("RevertTableData")]?.sort(
                            (a, b) => a?.id - b?.id
                          )
                        : []
                    }
                    columns={columns1}
                    // onPageChange={(_data) => {
                    //   // getCaseType(data.pageSize, _data);
                    //   // getAddHearing(data.pageSize, _data);
                    // }}
                    hideFooter
                    // density="compact"
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                  />
                </div>

                {/* Button Row */}

                <Grid
                  container
                  sx={{
                    marginLeft: "2vw",
                    marginTop: "4vh",
                    justifyContent: "center",
                  }}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      // color="error"
                      size="small"
                      onClick={() => {
                        setOpenModal1(false);
                        onSubmitForm(data, "REASSIGN");
                        // handleSubmit((data) => onSubmitForm(data, "REASSIGN"))();
                      }}
                      sx={{ width: "70px", marginBottom: "20px" }}
                    >
                      <FormattedLabel id="submit" />
                    </Button>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: "#DD4B39" }}
                      endIcon={<CloseIcon />}
                      onClick={() => {
                        setOpenModal1(false);
                      }}
                    >
                      <FormattedLabel id="cancel" />
                    </Button>
                  </Grid>
                </Grid>

                {/* </div> */}
              </Box>
            </Modal>
          </form>
        </FormProvider>
      )}
    </>
  );
};

export default Index;
