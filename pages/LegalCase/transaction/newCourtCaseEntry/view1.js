import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  courtCaseDetailsSchema,
  courtCaseEntryAdvocateDetailsSchema,
} from "../../../../containers/schema/LegalCaseSchema/courtCaseEntrySchema";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import AdvocateDetails from "./AdvocateDetails";
import CaseDetails from "./CaseDetails";
import Documents from "./Documents";
import BillDetails from "./BillDetails";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { array } from "yup";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { saveAs } from "file-saver";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";
import { Visibility } from "@mui/icons-material";

// steps
function getSteps(pageMode) {
  console.log("newPageMode", pageMode);
  if (pageMode == "Add") {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="concernAdvocate" />,
      <FormattedLabel key={3} id="document" />,
    ];
  } else if ("View") {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="concernAdvocate" />,
      <FormattedLabel key={3} id="document" />,
      <FormattedLabel key={4} id="paymentDetails" />,
    ];
  } else {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="concernAdvocate" />,
      <FormattedLabel key={3} id="document" />,
      // <FormattedLabel key={4} id='caseFees' />,
      <FormattedLabel key={4} id="paymentDetails" />,
      // <FormattedLabel key={2} id='advocateDetails' />,
    ];
  }
}

// getStepContent
function getStepContent(step, pageMode, buttonInputStateNew) {
  console.log("6565", step, pageMode, buttonInputStateNew);
  if (pageMode == "Add") {
    if (step == "0") {
      return <CaseDetails />;
    } else if (step == "1") {
      return <AdvocateDetails />;
    } else if (step == "2") {
      console.log("yeda aahe ka ", buttonInputStateNew);
      return <Documents buttonInputStateNew={buttonInputStateNew} />;
    }
  } else if ("View") {
    if (step == "0") {
      return <CaseDetails />;
    } else if (step == "1") {
      return <AdvocateDetails />;
    } else if (step == "2") {
      return <Documents buttonInputStateNew={buttonInputStateNew} />;
    } else if (step == "3") {
      return <BillDetails />;
    }
  } else {
    if (step == "0") {
      return <CaseDetails />;
    } else if (step == "1") {
      return <AdvocateDetails />;
    } else if (step == "2") {
      return <Documents buttonInputStateNew={buttonInputStateNew} />;
    } else if (step == "3") {
      return <BillDetails />;
    }
  }
}

// Main Component
const View = () => {
  const [dataValidation, setDataValidation] = useState(courtCaseDetailsSchema);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const userDepartment = useSelector(
    (state) => state?.user?.user?.userDao?.department
  );
  const methods = useForm({
    defaultValues: {
      courtName: "",
      caseMainType: "",
      subType: "",
      year: "",
      stampNo: "",
      fillingDate: null,
      filedBy: "",
      filedAgainst: "",
      caseDetails: "",
      // Advocate Details
      advocateName: "",
      opponentAdvocate: "",
      concernPerson: "",
      appearanceDate: null,
      department: "",
      courtName: "",
    },
    mode: "onChange",
    resolver: yupResolver(dataValidation),
    criteriaMode: "all",
  });
  const { register, reset, setValue, getValues, method, watch } = methods;
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);

  const [dataSource3, setDataSource3] = useState([]);
  const [ayeAnsari, setAyeAnsari] = useState([]);

  const [dataSource4, setDataSource4] = useState([]);

  const [dataSource5, setDataSource5] = useState([]);
  const [paraReqDetails, setParaReqDetails] = useState([]);

  const [dataSource6, setDataSource6] = useState([]);

  const [courtNames, setCourtNames] = useState([]);
  const [courtCaseNumbers, setcourtCaseNumbers] = useState([]);
  const [newCourtCaseEntry, setNewCourtCaseEntry] = useState();
  const [NewCourtCaseEntryAttachmentList, setNewCourtCaseEntryAttachmentList] =
    useState([]);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [pageMode, setPageMode] = useState("Add");
  const [noticeHistoryList, setNoticeHistoryList] = useState([]);

  const [caseDetailsList, setCaseDetailsList] = useState([]);
  const [caseDetailsListM, setCaseDetailsListM] = useState([]);

  const [noticeId, setNoticeId] = React.useState(null);

  const [caseId, setCaseId] = React.useState(null);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [modalOpen1, setModalOpen1] = useState(false);

  const [modalOpen2, setModalOpen2] = useState(false);

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [documentRows, setDocumentRows] = useState([]);

  const [documentRows1, setDocumentRows1] = useState([]);

  const [documentRows2, setDocumentRows2] = useState([]);

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const [loading, setLoading] = useState(false);

  //----------------------view-Remarks---------------------------------------------------------------
  const [displayRemarks, setDisplayRemarks] = useState({});
  const [remarksOpen, setRemarksOpen] = useState(false);
  const handleOpenRemarks = (params) => {
    // const { field, headerName } = params.colDef;
    console.log("Selected Field:", {
      headerName: params.colDef?.headerName,
      value: params?.value,
    });
    setDisplayRemarks({
      headerName: params?.colDef?.headerName ?? "",
      value: params?.value ?? "",
    });
    setRemarksOpen(true);
  };

  //view----------------------------------------------------------------
  // const viewFile = (filePath) => {
  //   console.log("filePath", filePath);
  //   if (filePath?.includes(".pdf")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/preview?filePath=${filePath}`;
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
  //         callCatchMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".csv")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

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
  //         callCatchMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".xlsx")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

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
  //         callCatchMethod(error, language);
  //       });
  //   } else {
  //     setLoading(true);
  //     const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
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
  //         callCatchMethod(error, language);
  //       });
  //   }
  // };

  const viewFile = (filePath) => {
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
      alert("CSV");
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

  const handleOpenModal = (rowData) => {
    console.log("rowData1", rowData);
    // setSelectedRowData(rowData);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    // setSelectedRowData(null);
    setModalOpen(false);
  };

  const handleOpenModal1 = (rowData) => {
    console.log("rowData1", rowData);
    // setSelectedRowData(rowData);
    setModalOpen1(true);
  };
  const handleCloseModal1 = () => {
    // setSelectedRowData(null);
    setModalOpen1(false);
  };

  const handleOpenModal2 = (rowData) => {
    console.log("rowData2", rowData);
    // setSelectedRowData(rowData);
    setModalOpen2(true);
  };
  const handleCloseModal2 = () => {
    // setSelectedRowData(null);
    setModalOpen2(false);
  };

  // useEffect(() => {
  //   console.log("dataSource6", dataSource6);
  //   if (dataSource6.length > 0) {
  //     setModalOpen2(true);
  //   }
  // }, [dataSource6]);

  //  courtNames
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
            // caseMainType: r.caseMainType,
            courtNameEn: r.courtName,
            courtNameMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // getOnlyUserNames excluding null values
  const getUserFullName = (firstName, middleName, lastName) => {
    let _fullName = [firstName, middleName, lastName]?.filter(
      (name) => name !== null
    );
    return _fullName.join(" ");
  };

  // getAllUsersList
  const getAllUsersList = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getUserBasicDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("sdfds", r?.data?.userList);
        setAllUsersList(
          r?.data?.userList?.map((u, i) => ({
            id: u.id,
            // userNameEn: `${u.firstNameEn} ${u.middleNameEn} ${u.lastNameEn}`,
            // userNameMr: `${u.firstNameMr} ${u.middleNameMr} ${u.lastNameMr}`,
            userNameEn: getUserFullName(
              u.firstNameEn,
              u.middleNameEn,
              u.lastNameEn
            ),
            userNameMr: getUserFullName(
              u.firstNameMr,
              u.middleNameMr,
              u.lastNameMr
            ),
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // // parawise details concern department
  // // -----------------------------------------------------------------------------------------------------------------
  // const getParawiseDetails = () => {
  //   if (router?.query?.caseId) {
  //     axios
  //       .get(
  //         `${urls.LCMSURL}/parawiseRequestHistory/getParawiseDetails?caseEntryId=${router?.query?.caseId}`
  //       )
  //       .then((res) => {
  //         console.log(
  //           "parawisedetails",
  //           res?.data?.trnParawiseRequestHistoryList
  //         );

  //         // let dataa = res?.data?.trnParawiseRequestHistoryList;

  //         // let dataToMap=dataa.map((r)=> ({
  //         //     srNo: i + 1,
  //         //     id: r.id,
  //         //     parawiseRequestId: r.parawiseRequestId,
  //         //     caseDate: moment(r.caseDate).format("YYYY-MM-DD"),
  //         //     createdUserId: r.createdUserId,
  //         //     issueNo:
  //         //       r.remark?.startsWith("[")
  //         //         ? JSON.parse(JSON.stringify(r.remark))[0].issueNo
  //         //         : null,
  //         //     remark: r.remark?.startsWith("[") ? JSON.parse(JSON.stringify(r.remark))?[0]?.answerInEnglish : r.remark,

  //         //     remarkMr: r.remarkMr?.startsWith("[")
  //         //       ? JSON.parse(JSON.stringify(r.remarkMr))?[0]?.answerInMarathi
  //         //       : r.remarkMr
  //         //   })
  //         // )
  //         // let hybridRemark=[];

  //         let gggg = [];
  //         res.data.trnParawiseRequestHistoryList
  //           ?.filter((x) => x?.remark?.startsWith("["))
  //           ?.map((r) =>
  //             JSON.parse(r.remark).map((mm) =>
  //               gggg.push({
  //                 ...r,
  //                 issueNo: mm.issueNo,
  //                 remark: mm.answerInEnglish,
  //                 remarkMr: mm.answerInMarathi,
  //               })
  //             )
  //           );

  //         console.log("gggg", gggg);
  //         // let rawData=...r
  //         // issueNo: JSON.parse(r.remark)[0].issueNo,
  //         // remark: JSON.parse(r.remark)[0].answerInEnglish,
  //         // remarkMr: JSON.parse(r.remarkMr)[0].answerInMarathi,

  //         let simpleRemark = res.data.trnParawiseRequestHistoryList
  //           ?.filter((gg) => !gg?.remark?.startsWith("["))
  //           ?.map((ggg) => ({
  //             ...ggg,
  //             issueNo: "-",
  //             remark: ggg.remark,
  //             remarkMr: ggg.remarkMr,
  //           }));

  //         let hybridRemark = [...gggg, ...simpleRemark];

  //         let temp = hybridRemark?.map((r, i) => ({
  //           ...r,
  //           srNo: i + 1,
  //           caseDate: moment(r.caseDate).format("YYYY-MM-DD"),
  //           createdUserId: allUsersList?.find(
  //             (obj) => obj?.id == r?.createdUserId
  //           )?.userNameEn,

  //           createdUserMr: allUsersList?.find(
  //             (obj) => obj?.id == r?.createdUserId
  //           )?.userNameMr,
  //         }));

  //         console.log("temp", temp);
  //         setDataSource(temp);
  //       });
  //   }
  // };
  // // -----------------------------------------------------------------------------------------------------------------

  // para Details Legal Clerk and HOD
  const getParaDetails = () => {
    if (router?.query?.caseId) {
      axios
        .get(
          // `${urls.LCMSURL}/parawiseRequestHistory/getParaRequests?caseEntryId=${router?.query?.caseId}`
          `${urls.LCMSURL}/transaction/newCourtCaseEntry/getByCaseID?id=${router?.query?.caseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        // .then((res) => {
        //   let temp1 = res.data.trnParawiseRequestHistoryList?.map((r, i) => ({
        //     srNo: i + 1,
        //     parawiseRequestId: r.parawiseRequestId,
        //     caseDate: moment(r.caseDate).format("YYYY-MM-DD"),
        //     // createdUserId: r.createdUserId,
        //     createdUserId: allUsersList?.find(
        //       (obj) => obj?.id == r?.createdUserId
        //     )?.userNameEn,

        //     createdUserMr: allUsersList?.find(
        //       (obj) => obj?.id == r?.createdUserId
        //     )?.createdUserMr,

        //     updateUserId: r.updateUserId,
        //     remark: r.remark,
        //     remarkMr: r.remarkMr,
        //     status: r.status,
        //   }));

        //   setDataSource1(temp1);
        // });
        .then((res) => {
          console.log(
            "trnParawiseRequestDao1",
            res?.data?.trnParawiseRequestDao1
          );
          //temp1 for para Req details- L clerk and Hod
          let temp1 = res?.data?.trnParawiseRequestDao1?.map((r, i) => ({
            srNo: i + 1,
            parawiseNumber: r?.parawiseNumber,
            parawiseCreatedDate: r?.parawiseCreatedDate,
            createdUserId: allUsersList?.find(
              (obj) => obj?.id == r?.createdUserId
            )?.userNameEn,

            createdUserMr: allUsersList?.find(
              (obj) => obj?.id == r?.createdUserId
            )?.createdUserMr,

            parawiseReportRemarkClerk: r?.parawiseReportRemarkClerk,
            parawiseReportRemarkClerkMr: r?.parawiseReportRemarkClerkMr,
            hodRemarkEnglish: r?.hodRemarkEnglish,
            hodRemarkMarathi: r?.hodRemarkMarathi,
            hodClearkAttAchment: r?.hodClearkAttAchment,
            status: r?.status,
          }));
          // conc dpt
          let _tempConcArr = [];
          res?.data?.trnParawiseRequestDao1?.map((r, i) => {
            let _data = r?.trnParawiseListDao?.map((g) => ({
              ...g,
              parawiseNumber: r?.parawiseNumber,
            }));
            return {
              trnParawiseListDao: _tempConcArr?.push(..._data),
            };
          });
          //final -->_updatedAllConcDptList
          // console.log("_tempConcArr", _tempConcArr);
          // ---------------------------------------------------------------------------------------
          let _updatedAllConcDptList = _tempConcArr
            ? _tempConcArr?.map((gg, i) => {
                let _consernDptClerkRemark = gg?.consernDptClerkRemark
                  ? JSON?.parse(gg?.consernDptClerkRemark)
                  : [];
                let concatenatedStatementEn = "";
                let concatenatedStatementMr = "";
                // for (const item of _consernDptClerkRemark) {
                //   concatenatedStatementEn += `${item?.answerInEnglish} `;
                //   concatenatedStatementMr += `${item?.answerInMarathi} `;
                // }
                _consernDptClerkRemark?.forEach((item, index) => {
                  let koma =
                    index + 1 === _consernDptClerkRemark?.length ? "" : ",";
                  concatenatedStatementEn += `${index + 1}. ${
                    item?.answerInEnglish
                  } ${koma} `;
                  concatenatedStatementMr += `${index + 1}. ${
                    item?.answerInMarathi
                  }${koma} `;
                });
                return {
                  srNo: i + 1,
                  dptId: gg?.departmentId,
                  consernDptClerkRemark: concatenatedStatementEn,
                  consernDptClerkRemarkMr: concatenatedStatementMr,
                  consernDptHodRemark: gg?.consernDptHodRemark,
                  consernDptHodRemarkMr: gg?.consernDptHodRemarkMr,
                  parawiseNumber: gg?.parawiseNumber,
                  concernDptClerkAndHodAttachement:
                    gg?.concernDptClerkAndHodAttachement,
                };
              })
            : [];
          console.log("_tempConcArr", _updatedAllConcDptList);
          // ------------------------------------------------------------------------------------------

          //temp2ForWS adv WS dtails
          let temp3ForWS = res?.data?.trnParawiseRequestDao1
            ?.filter((ob) => ob?.advocateRemark !== null)
            ?.map((r, i) => {
              let _a = r?.advocateRemark ? JSON?.parse(r?.advocateRemark) : [];
              let concatenatedStatementEn = "";
              let concatenatedStatementMr = "";
              // for (const item of _a) {
              //   concatenatedStatementEn += `${item?.writtenStatementInEnglish} `;
              //   concatenatedStatementMr += `${item?.writtenStatementInMarathi} `;
              // }
              _a?.forEach((item, index) => {
                concatenatedStatementEn += `${index + 1}. ${
                  item?.writtenStatementInEnglish
                },`;
                concatenatedStatementMr += `  ${index + 1}. ${
                  item?.writtenStatementInMarathi
                },`;
              });
              return {
                srNo: i + 1,
                parawiseNumber: r?.parawiseNumber,
                writtenStatementInEnglish: concatenatedStatementEn,
                writtenStatementInMarathi: concatenatedStatementMr,
                advocateAttAchment: r?.advocateAttAchment,
                returnStatementDate: r?.returnStatementDate,
                status: r?.status,
              };
            });
          // console.log("temp2ForWS", temp2ForWS);
          setDataSource1(temp1);
          // setDataSource(_updatedAllConcDptList);
          setDataSource(
            _updatedAllConcDptList?.length > 0
              ? (userDepartment == 3
                  ? _updatedAllConcDptList
                  : _updatedAllConcDptList?.filter(
                      (d) => d?.dptId == userDepartment
                    )
                )?.map((d, i) => ({
                  srNo: i + 1,
                  ...d,
                }))
              : []
          );
          setDataSource4(temp3ForWS);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  //get Vakalatnama
  const getVakalatnama = () => {
    if (router?.query?.caseId) {
      axios
        .get(
          `${urls.LCMSURL}/trnNewCourtCaseEntryHistory/getVakalatnamaDetails?caseEntryId=${router?.query?.caseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("DataCheck", allUsersList);
          let temp2 = res.data.newCourtCaseEntryHistory?.map((r, i) => ({
            srNo: i + 1,

            createDtTm: moment(r.createDtTm).format("DD-MM-YYYY"),
            vakalatnamaStatus: r.vakalatnamaStatus,
            createdUserId: r.createdUserId,

            createdUserIdEng: allUsersList?.find(
              (obj) => obj?.id == r?.createdUserId
            )?.userNameEn,

            createdUserIdMr: allUsersList?.find(
              (obj) => obj?.id == r?.createdUserId
            )?.userNameMr,
          }));

          setDataSource3(temp2);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  // get WS
  // const getWS = () => {
  //   if (router?.query?.caseId) {
  //     axios
  //       .get(
  //         `${urls.LCMSURL}/trnNewCourtCaseEntryHistory/getWrittenStatementDetails?caseEntryId=${router?.query?.caseId}`
  //       )
  //       .then((res) => {
  //         console.log("WSDetails", res?.data?.newCourtCaseEntryHistory);
  //         // let temp4 = res.data.newCourtCaseEntryHistory?.map((r, i) => ({
  //         //   srNo: i + 1,
  //         //   createDtTm: moment(r.createDtTm).format("DD-MM-YYYY"),

  //         //   remark: r.remark,
  //         //   remarkMr: r.remarkMr,

  //         //   caseStatus: r.caseStatus,

  //         // }))

  //         let ggg = [];
  //         res.data.newCourtCaseEntryHistory
  //           ?.filter((x) => x?.remark?.startsWith("["))
  //           ?.map((r) =>
  //             JSON.parse(r.remark).map((mm) =>
  //               ggg.push({
  //                 ...r,
  //                 issueNo: mm.issueNo,
  //                 remark: mm.answerInEnglish,
  //                 remarkMr: mm.answerInMarathi,
  //               })
  //             )
  //           );

  //         let simpleRemark = res.data.newCourtCaseEntryHistory
  //           ?.filter((gg) => !gg?.remark?.startsWith("["))
  //           ?.map((ggg) => ({
  //             ...ggg,
  //             issueNo: "-",
  //             remark: ggg.remark,
  //             remarkMr: ggg.remarkMr,
  //           }));

  //         let hybridRemark = [...ggg, ...simpleRemark];

  //         let temp = hybridRemark?.map((r, i) => ({
  //           ...r,
  //           srNo: i + 1,
  //           createDtTm: moment(r.createDtTm).format("YYYY-MM-DD"),
  //           createdUserId: allUsersList?.find(
  //             (obj) => obj?.id == r?.createdUserId
  //           )?.userNameEn,

  //           createdUserIdMr: allUsersList?.find(
  //             (obj) => obj?.id == r?.createdUserId
  //           )?.userNameMr,
  //         }));

  //         setDataSource4(temp);
  //       });
  //   }
  // };

  // get Hearing Details

  const getHearingDetails = () => {
    if (router?.query?.caseId) {
      axios
        .get(
          `${urls.LCMSURL}/trnsaction/addHearing/getAddHearingByCaseEntryId?caseEntryId=${router?.query?.caseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("heading_Data", res?.data);
          let temp5 = res.data.addHearing?.map((r, i) => ({
            srNo: i + 1,
            fillingDate: moment(r.fillingDate).format("DD-MM-YYYY"),
            // hearingDate
            hearingDate: moment(r.hearingDate).format("DD-MM-YYYY"),

            filedBy: r.filedBy,

            filedByMr: r.filedByMr,

            remark: r.remark,
            remarkMr: r.remarkMr,
            addHearingAttachment: r?.addHearingAttachment,
          }));

          setDataSource5(temp5);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  // get Parawise documents
  const parawiseDocuments = (row) => {
    console.log(":a1", row);
    // axios
    //   .get(
    //     `${urls.LCMSURL}/transaction/parawiseRequestAttachment/getParawiseAttachments?paraRequestId=${row.parawiseRequestId}&status=${row.status}`
    //   )
    //   .then((res) => {
    //     let temp5 = res.data.trnParawiseRequestAttachmentList?.map((r, i) => ({
    //       ...r,
    //       srNo: i + 1,
    //     }));
    //     setDataSource5(temp5);
    //   });

    let temp5 = row?.map((d, i) => ({
      ...d,
      srNo: i + 1,
      createdUserIdEn: allUsersList?.find((obj) => obj?.id == d?.createdUserId)
        ?.userNameEn,
      createdUserMr: allUsersList?.find((obj) => obj?.id == d?.createdUserId)
        ?.userNameMr,
    }));
    console.log(":temp5", temp5);

    setParaReqDetails(temp5 ?? []);
    handleOpenModal1();
  };
  const parawiseDocumentsForConcDpt = (row) => {
    console.log(":a1", row);
    let temp5 = row?.concernDptClerkAndHodAttachement?.map((d, i) => ({
      ...d,
      srNo: i + 1,
      createdUserIdEn: allUsersList?.find((obj) => obj?.id == d?.createdUserId)
        ?.userNameEn,
      createdUserMr: allUsersList?.find((obj) => obj?.id == d?.createdUserId)
        ?.userNameMr,
    }));
    console.log(":temp5", temp5);

    setParaReqDetails(temp5 ?? []);
    handleOpenModal1();
  };

  // get Ws Documents
  const wsDocuments = (row) => {
    // console.log("ppppa1", row);
    // axios
    //   .get(
    //     `${urls.LCMSURL}/transaction/newCourtCaseEntryAttachment/getCaseEntryAttachments?caseEntryId=${router?.query?.caseId}&status=${row.caseStatus}`
    //   )
    //   .then((res) => {
    //     let temp6 = res.data.trnNewCourtCaseEntryAttachmentList?.map(
    //       (r, i) => ({
    //         ...r,
    //         srNo: i + 1,
    //       })
    //     );

    //     setDataSource6(temp6);
    //   });

    let _temp = row?.advocateAttAchment?.map((d, i) => ({
      ...d,
      srNo: i + 1,
      createdUserIdEn: allUsersList?.find((obj) => obj?.id == d?.createdUserId)
        ?.userNameEn,
      createdUserMr: allUsersList?.find((obj) => obj?.id == d?.createdUserId)
        ?.userNameMr,
    }));

    // console.log("_temp", _temp);
    setDataSource6(_temp ?? []);
    handleOpenModal2();
  };

  useEffect(() => {
    console.log("Dataaaa", dataSource);
  }, [dataSource, dataSource1, dataSource3]);

  // Parawise Details Column
  const parawise_details_columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,

      align: "center",
      headerAlign: "center",
    },

    {
      field: "parawiseNumber",
      // headerName: <FormattedLabel id="user" />,
      headerName: <FormattedLabel id="parawiseRequestNo" />,
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "caseDate",
    //   // headerName: <FormattedLabel id="deptName" />,
    //   headerName: <FormattedLabel id="parawiseDate" />,
    //   // type: "number",
    //   width: 500,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // User Name
    // {
    //   // field: "createdUserId",
    //   field: language === "en" ? "createdUserId" : "createdUserMr",

    //   // createdUserMr
    //   // headerName: <FormattedLabel id="deptName" />,
    //   headerName: <FormattedLabel id="userName" />,
    //   // type: "number",
    //   width: 500,
    //   align: "center",
    //   headerAlign: "center",
    // },

    // issue no
    // {
    //   field: "issueNo",
    //   // headerName: <FormattedLabel id="deptName" />,
    //   headerName: "Issue No",
    //   // type: "number",
    //   width: 500,
    //   align: "center",
    //   headerAlign: "center",
    // },

    // Remark
    {
      field:
        language === "en" ? "consernDptClerkRemark" : "consernDptClerkRemarkMr",
      headerName:
        language === "en"
          ? "Concern Department Clerk Remark"
          : "संबंधित विभाग लिपिक टिप्पणी",
      // headerName: "Remark",
      // type: "number",
      width: 500,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field:
        language === "en" ? "consernDptHodRemark" : "consernDptHodRemarkMr",
      headerName:
        language === "en"
          ? "Concern Department Hod Remark"
          : "संबंधित विभाग एचओडी टिप्पणी",
      // headerName: "Remark",
      // type: "number",
      width: 500,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },

    // View Documents
    {
      field: "Docs",
      headerName: <FormattedLabel id="viewDocuments" />,
      width: 200,

      renderCell: (params) => {
        const rowData = params?.row; // Get the data of the current row
        console.log("params", params);
        return (
          // rowData?.filePaths?.length !== 0 && (
          <Button
            size="small"
            variant="contained"
            onClick={() => parawiseDocumentsForConcDpt(params?.row)}
          >
            {/* View */}
            <FormattedLabel id="view" />
          </Button>
          // )
        );
      },
    },
  ];

  // column for Para details
  const columnsParaDetails = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,

      align: "center",
      headerAlign: "center",
    },
    // parawiseRequestId
    // {
    //   field: "parawiseRequestId",
    //   headerName: "Parawise Request No",
    //   width: 150,

    //   align: "center",
    //   headerAlign: "center",
    // },
    // Para request date
    {
      field: "parawiseNumber",
      headerName: language === "en" ? "Parawise No" : "पॅरावाइज क्र",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: language === "en" ? "Parawise Status" : "पॅरावाइज स्थिती",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "parawiseCreatedDate",
      headerName: <FormattedLabel id="parawiseDate" />,
      width: 200,
      valueFormatter: (params) => moment(params?.value)?.format("DD/MM/YYYY"),
      align: "center",
      headerAlign: "center",
    },
    // User Nmae
    // {
    //   // field: "createdUserId",
    //   field: language === "en" ? "createdUserId" : "createdUserMr",

    //   headerName: <FormattedLabel id="userName" />,
    //   width: 150,

    //   align: "center",
    //   headerAlign: "center",
    // },
    // Remark
    // {
    //   field: "remark",
    //   headerName: <FormattedLabel id="remarksInEnglish" />,
    //   width: 350,

    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field:
        language === "en"
          ? "parawiseReportRemarkClerk"
          : "parawiseReportRemarkClerkMr",
      headerName:
        language === "en" ? "Legal Clerk Remark" : "कायदेशीर लिपिक टिप्पणी",
      width: 350,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },
    // Remark mr
    {
      field: language === "en" ? "hodRemarkEnglish" : "hodRemarkMarathi",

      headerName:
        language === "en" ? "Legal Hod Remark" : "कायदेशीर अधिकारी टिप्पणी",
      width: 350,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },

    //  view Documents
    {
      field: "Docs",
      headerName: <FormattedLabel id="viewDocuments" />,
      width: 200,

      renderCell: (params) => {
        const rowData = params?.row; // Get the data of the current row
        console.log("paramsTest", params);
        return (
          // rowData?.filePaths?.length !== 0 && (
          <Button
            size="small"
            variant="contained"
            onClick={() =>
              // viewFile(params?.row?.filePath)
              parawiseDocuments(params?.row?.hodClearkAttAchment)
            }
            // onClick={() => {
            //   let _docsData = rowData?.addHearingAttachment?.map((r, i) => {
            //     return {
            //       id: r?.id,
            //       srNo: i + 1,
            //       attachmentNameMr: r?.attachmentNameMr,
            //       filePath: r?.filePath,
            //     };
            //   });

            //   setDocumentRows(_docsData);
            //   handleOpenModal(rowData);
            // }}
          >
            {/* View */}
            <FormattedLabel id="view" />
          </Button>
          // )
        );
      },
    },
  ];

  // column for Vakalatnama
  const vakalatnama_columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 200,

      align: "center",
      headerAlign: "center",
    },
    // createDtTm
    {
      field: "createDtTm",
      headerName: <FormattedLabel id="date" />,
      width: 250,

      align: "center",
      headerAlign: "center",
    },
    // vakalatnamaStatus

    // user

    {
      field: language === "en" ? "createdUserIdEng" : "createdUserIdMr",
      // field: "createdUserId",
      headerName: <FormattedLabel id="userName" />,
      width: 250,

      align: "center",
      headerAlign: "center",
    },
    {
      field: "vakalatnamaStatus",
      headerName: <FormattedLabel id="status" />,
      width: 550,

      align: "center",
      headerAlign: "center",
    },

    {
      headerName: <FormattedLabel id="actions" />,
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => {
            console.log("row1111", router?.query?.caseId);
            return router.push({
              pathname:
                "/LegalCase/transaction/newCourtCaseEntry/printVakalatnama",

              query: {
                id: router?.query?.caseId,
              },
            });
          }}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  // column for WS
  const ws_columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 200,

      align: "center",
      headerAlign: "center",
    },
    // createDtTm
    {
      field: "returnStatementDate",
      headerName: <FormattedLabel id="date" />,
      width: 200,
      valueFormatter: (params) => moment(params?.value)?.format("DD/MM/YYYY"),
      align: "center",
      headerAlign: "center",
    },
    // remark
    {
      field: "writtenStatementInEnglish",
      headerName: <FormattedLabel id="remarksInEnglish" />,
      width: 550,

      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },
    // remarkMr
    {
      field: "writtenStatementInMarathi",
      headerName: <FormattedLabel id="remarksInMarathi" />,
      width: 550,

      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },
    // User Nmae
    // {
    //   // field: "createdUserId",
    //   field: language === "en" ? "createdUserId" : "createdUserMr",

    //   // createdUserIdMr
    //   headerName: <FormattedLabel id="userName" />,
    //   width: 150,

    //   align: "center",
    //   headerAlign: "center",
    // },

    // {
    //   field: "caseStatus",
    //   headerName: "Status",
    //   width: 550,

    //   align: "center",
    //   headerAlign: "center",
    // },

    // VIew Documents
    // View Documents
    {
      field: "Docs",
      headerName: <FormattedLabel id="viewDocuments" />,
      width: 200,

      renderCell: (params) => {
        const rowData = params?.row; // Get the data of the current row
        console.log("params", params);
        return (
          // rowData?.filePaths?.length !== 0 && (
          <Button
            size="small"
            variant="contained"
            onClick={() => wsDocuments(params?.row)}

            // }}
          >
            {/* View */}
            <FormattedLabel id="view" />
          </Button>
          // )
        );
      },
    },
  ];

  // column for Hearing Details
  const hearing_column = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 200,

      align: "center",
      headerAlign: "center",
    },
    // fillingDate
    {
      field: "fillingDate",
      // headerName: "Filling Date",
      // fillingDate
      headerName: <FormattedLabel id="fillingDate" />,

      width: 200,

      align: "center",
      headerAlign: "center",
    },
    // hearingDate
    {
      field: "hearingDate",
      headerName: <FormattedLabel id="hearingDate" />,
      width: 200,

      align: "center",
      headerAlign: "center",
    },
    // filedBy
    {
      field: "filedBy",
      headerName: <FormattedLabel id="filedByInEnglish" />,
      width: 200,

      align: "center",
      headerAlign: "center",
    },
    // filedByMr
    {
      field: "filedByMr",
      headerName: <FormattedLabel id="filedByInMarathi" />,
      width: 200,

      align: "center",
      headerAlign: "center",
    },
    // remark
    {
      field: "remark",
      headerName: <FormattedLabel id="remarksInEnglish" />,
      width: 200,

      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },
    // remarkMr
    {
      field: "remarkMr",
      headerName: <FormattedLabel id="remarksInMarathi" />,
      width: 200,

      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },
    // View Documents
    {
      field: "Docs",
      headerName: <FormattedLabel id="viewDocuments" />,
      width: 200,

      renderCell: (params) => {
        const rowData = params?.row; // Get the data of the current row
        console.log("params", params);
        return (
          // rowData?.filePaths?.length !== 0 && (
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              let _docsData = rowData?.addHearingAttachment?.map((r, i) => {
                return {
                  ...r,
                  id: r?.id,
                  srNo: i + 1,
                  attachmentNameMr: r?.attachmentNameMr,
                  filePath: r?.filePath,
                };
              });

              setDocumentRows(_docsData);
              handleOpenModal(rowData);
            }}
          >
            {/* View */}
            <FormattedLabel id="view" />
          </Button>
          // )
        );
      },
    },
  ];
  useEffect(() => {
    console.log("_docsData", documentRows);
  }, [documentRows, documentRows1, documentRows2]);

  const documentColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 200,

      align: "center",
      headerAlign: "center",
    },
    // attachmentNameMr
    {
      // attachmentNameMr
      // field: "attachmentNameEng",
      field: language === "en" ? "attachmentNameEng" : "attachmentNameMr",
      headerName: <FormattedLabel id="attachmentName" />,
      width: 200,

      align: "center",
      headerAlign: "center",
    },
    // View Documents
    {
      field: "filePath",
      headerName: <FormattedLabel id="viewDocuments" />,
      width: 200,

      renderCell: (params) => {
        const rowData = params?.row; // Get the data of the current row
        return (
          // rowData?.filePaths?.length !== 0 && (
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              viewFile(params?.row?.filePath);

              // console.log("record.row.filePath", params.row.filePath);
              // window.open(
              //   `${urls.CFCURL}/file/preview?filePath=${params.row.filePath}`,
              //   "_blank"
              // );
            }}
          >
            {/* View */}
            <FormattedLabel id="view" />
          </Button>
          // )
        );
      },
    },
  ];

  const documentColumns1 = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // width: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // attachmentNameMr
    {
      field: "originalFileName",
      headerName: language === "en" ? "Documents Name" : "दस्तऐवजाचे नाव",
      valueFormatter: (params) =>
        params?.value?.split(".")?.slice(0, -1)?.join("."),
      // width: 200,
      flex: 1,

      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: language === "en" ? "createdUserIdEn" : "createdUserMr",
    //   headerName: language === "en" ? "Attached By" : "द्वारे संलग्न",
    //   // width: 200,
    //   flex: 1,

    //   align: "center",
    //   headerAlign: "center",
    // },
    // View Documents
    {
      field: "filePath",
      headerName: language === "en" ? "View Documents" : "दस्तऐवज पहा",
      // width: 200,
      flex: 1,

      renderCell: (params) => {
        // const rowData = params?.row; // Get the data of the current row
        return (
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              viewFile(params?.row?.filePath);

              // console.log("record.row.filePath", params.row.filePath);
              // window.open(
              //   `${urls.CFCURL}/file/preview?filePath=${params.row.filePath}`,
              //   "_blank"
              // );
            }}
          >
            {language === "en" ? "View" : "पहा"}
          </Button>
          // )
        );
      },
    },
  ];

  const documentColumns2 = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // width: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // attachmentNameMr
    {
      field: "originalFileName",
      headerName: language === "en" ? "Documents Name" : "दस्तऐवजाचे नाव",
      // width: 200,
      flex: 1,
      valueFormatter: (params) =>
        params?.value?.split(".")?.slice(0, -1)?.join("."),
      align: "center",
      headerAlign: "center",
    },
    // View Documents
    {
      field: "filePath",
      headerName: "View Documents",
      // width: 200,
      flex: 1,
      renderCell: (params) => {
        const rowData = params?.row; // Get the data of the current row
        return (
          // rowData?.filePaths?.length !== 0 && (
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              viewFile(params?.row?.filePath);

              // console.log("record.row.filePath", params.row.filePath);
              // window.open(
              //   `${urls.CFCURL}/file/preview?filePath=${params.row.filePath}`,
              //   "_blank"
              // );
            }}
          >
            View
          </Button>
          // )
        );
      },
    },
  ];
  const steps = getSteps(localStorage.getItem("pageMode"));

  // handleNext
  const handleNext = (data) => {
    console.log("Data -------->", data);
    let paidAmountDate = null;
    setNewCourtCaseEntryAttachmentList(
      JSON.parse(localStorage.getItem("NewCourtCaseEntryAttachmentList"))
    );

    // finalBody
    const finalBody = {
      ...data,
      paidAmountDate,
      NewCourtCaseEntryAttachmentList: JSON.parse(
        localStorage.getItem("NewCourtCaseEntryAttachmentList")
      ),
    };

    if (activeStep == steps.length - 1) {
      axios
        .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/save`, finalBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            localStorage.removeItem("newCourtCaseEntry");
            localStorage.removeItem("NewCourtCaseEntryAttachmentList");
            localStorage.removeItem("buttonInputStateNew");
            localStorage.removeItem("pageMode");
            localStorage.removeItem("deleteButtonInputState");
            localStorage.removeItem("addButtonInputState");
            localStorage.removeItem("buttonInputState");
            localStorage.removeItem("btnInputStateDemandBill");
            localStorage.removeItem("disabledButtonInputState");
            localStorage.removeItem("trnDptLocationDao");
            localStorage.removeItem("billDetail");
            if (data.id) {
              sweetAlert(
                "Updated!",
                "Record Updated successfully !",
                "success"
              );
            } else {
              sweetAlert("Saved!", "Record Saved successfully !", "success");
            }
          }
          router.push(`/LegalCase/transaction/newCourtCaseEntry/`);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // handleBack
  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  useEffect(() => {
    setCaseId(router?.query?.caseId);
    setButtonInputStateNew(localStorage.getItem("buttonInputStateNew"));
    setPageMode(localStorage.getItem("pageMode"));
    setNewCourtCaseEntry(localStorage.getItem("newCourtCaseEntry"));
    setNewCourtCaseEntryAttachmentList(
      localStorage.getItem("NewCourtCaseEntryAttachmentList")
    );
    reset(JSON.parse(localStorage.getItem("newCourtCaseEntry")));
    getCourtName();
    getAllUsersList();
  }, []);

  useEffect(() => {
    if (activeStep == "0") {
      setDataValidation(courtCaseDetailsSchema);
    } else if (activeStep == "1") {
      setDataValidation(courtCaseEntryAdvocateDetailsSchema);
    }
  }, [activeStep]);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [
    dataSource,
    dataSource1,
    dataSource3,
    dataSource4,
    dataSource5,
    dataSource6,
  ]);

  useEffect(() => {
    if (router?.query?.caseId) {
      // getParawiseDetails();
      getParaDetails();
      getVakalatnama();
      // getWS();
      getHearingDetails();
    }
  }, [router?.query, allUsersList]);

  useEffect(() => {
    console.log("pageMode12121", pageMode);
  }, [pageMode]);

  // get Case Details
  const getCaseDetails = () => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCaseDetails?caseId=${router?.query?.caseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          // setNoticeHistoryList(r?.data)

          // hearingDate: moment(r.fillingDate).format("DD-MM-YYYY"),

          setCaseDetailsList(r?.data);
          // setPaymentCollectionReciptData(r?.data);
        } else {
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    if (router?.query?.caseId) {
      console.log("caseId", caseId);
      getCaseDetails();
    }
  }, [router?.query]);

  // view
  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
          paddingTop: 3,
          paddingBottom: 5,
        }}
      >
        {/* <marquee> */}
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            // paddingTop: "8px",

            // backgroundColor: "#0084ff",

            backgroundColor: "#556CD6",
            height: "8vh",
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
            <FormattedLabel id="newCourtCaseEntry" />
          </h2>
        </Box>

        <Stepper
          style={{
            marginTop: "50px",
          }}
          alternativeLabel
          activeStep={activeStep}
        >
          {steps.map((step, index) => {
            const labelProps = {};
            const stepProps = {};
            return (
              <Step {...stepProps} key={index}>
                <StepLabel {...labelProps}>{step}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <Typography variant="h3" align="center">
            Thank You
          </Typography>
        ) : (
          <>
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleNext)}>
                  {getStepContent(
                    activeStep,
                    localStorage.getItem("pageMode"),
                    buttonInputStateNew
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      ml: "40px",
                      mr: "40px",
                      pt: 2,
                    }}
                  >
                    <Button
                      disabled={activeStep === 0}
                      variant="contained"
                      onClick={() => previousStep()}
                    >
                      <FormattedLabel id="back" />
                    </Button>

                    <Box sx={{ flex: "1 auto" }} />

                    {/** SaveAndNext Button */}
                    <>
                      {activeStep != steps.length - 1 && (
                        <>
                          {localStorage.getItem("pageMode") !== "View" && (
                            <Button variant="contained" type="submit">
                              <FormattedLabel id="saveAndNext" />
                            </Button>
                          )}
                          {localStorage.getItem("pageMode") == "View" && (
                            <Button variant="contained" type="submit">
                              <FormattedLabel id="next" />
                            </Button>
                          )}
                        </>
                      )}

                      <Box sx={{ flex: "0.01 auto" }} />

                      {/* Exit Button */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          localStorage.removeItem("newCourtCaseEntry");
                          localStorage.removeItem("buttonInputStateNew");
                          localStorage.removeItem("pageMode");
                          localStorage.removeItem("deleteButtonInputState");
                          localStorage.removeItem("addButtonInputState");
                          localStorage.removeItem("buttonInputState");
                          localStorage.removeItem("btnInputStateDemandBill");
                          localStorage.removeItem("disabledButtonInputState");
                          localStorage.removeItem("trnDptLocationDao");
                          localStorage.removeItem("billDetail");
                          localStorage.removeItem(
                            "NewCourtCaseEntryAttachmentList"
                          );
                          router.push(
                            `/LegalCase/transaction/newCourtCaseEntry/`
                          );
                        }}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </>
                    <Grid item xl={0.5} lg={0.5}></Grid>
                    {/**  Finish Submit */}
                    <>
                      {localStorage.getItem("pageMode") !== "View" && (
                        <>
                          {activeStep == steps.length - 1 && (
                            <Button variant="contained" type="submit">
                              <FormattedLabel id="finish" />
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  </Box>
                </form>
              </FormProvider>
            </ThemeProvider>
          </>
        )}
      </Paper>

      {/* For Case Details */}

      {/* {isOpenCollapse && (
        <> */}
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
          paddingTop: 3,
          paddingBottom: 5,
        }}
      >
        {/* <div style={{ marginBottom: "5vh" }}>
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "65px",
              borderRadius: 100,
            }}
          >
            <strong>
              Case Details
            </strong>
          </div>
          <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
            <Grid item xs={12}>
              <DataGrid
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                autoHeight
                // rows={
                //   noticeHistoryList == [] || noticeHistoryList == undefined || noticeHistoryList == ""
                //     ? []
                //     : noticeHistoryList
                // }

                rows={
                  caseDetailsListM == [] || caseDetailsListM == undefined || caseDetailsListM == ""
                    ? []
                    : caseDetailsListM
                }
                columns={_columns}
                getRowId={(row) => row.srNo}
                pageSize={5}
                rowsPerPageOptions={[5]}
                //checkboxSelection
              />
            </Grid>
          </Grid>
        </div> */}

        {/* Table for Hearing Details */}
        <Grid
          container
          style={
            {
              // marginLeft:"10px"
            }
          }
        >
          <Grid item lg={12}>
            <Accordion elevation={0}>
              {/* title */}
              <AccordionSummary
                sx={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  textTransform: "uppercase",
                  border: "1px solid white",
                  // marginTop:"2px"
                  marginLeft: "12px",
                  // boxShadow:10
                }}
                elevation={10}
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                backgroundColor="#0070f3"
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {/* Hearing Details */}
                  <FormattedLabel id="hearingDetails" />
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    <DataGrid
                      disableColumnFilter
                      disableColumnSelector
                      disableDensitySelector
                      components={{ Toolbar: GridToolbar }}
                      autoHeight
                      rows={dataSource5}
                      columns={hearing_column}
                      getRowId={(row) => row.srNo}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      //checkboxSelection
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        {/* </Grid>  */}
        {/* Para Details  */}
        <Grid
          container
          style={{
            // marginLeft:"10px"
            marginTop: "3px",
          }}
        >
          <Grid item lg={12}>
            <Accordion elevation={0}>
              {/* title */}
              <AccordionSummary
                sx={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  textTransform: "uppercase",
                  border: "1px solid white",
                  // marginTop:"2px"
                  marginLeft: "12px",
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                backgroundColor="#0070f3"
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {/* Para Request Details */}
                  <FormattedLabel id="paraRequestDetails" />
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    <DataGrid
                      disableColumnFilter
                      disableColumnSelector
                      disableDensitySelector
                      components={{ Toolbar: GridToolbar }}
                      autoHeight
                      rows={dataSource1}
                      columns={columnsParaDetails}
                      getRowId={(row) => row.srNo}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      //checkboxSelection
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
        {/* Parawise details */}
        <Grid
          container
          style={{
            // marginLeft:"10px"
            marginTop: "3px",
          }}
        >
          <Grid item lg={12}>
            <Accordion elevation={0}>
              {/* title */}
              <AccordionSummary
                sx={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  textTransform: "uppercase",
                  border: "1px solid white",
                  // marginTop:"2px"
                  marginLeft: "12px",
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                backgroundColor="#0070f3"
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {/* Parawise Details */}
                  <FormattedLabel id="parawiseDetails" />
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    <DataGrid
                      disableColumnFilter
                      disableColumnSelector
                      disableDensitySelector
                      components={{ Toolbar: GridToolbar }}
                      autoHeight
                      rows={dataSource}
                      columns={parawise_details_columns}
                      getRowId={(row) => row.srNo}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      //checkboxSelection
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        {/* Written Statement process */}
        {/* <Grid container
        style={{
         
        }}
        >
        
          <Grid item
          lg={12}
          >
          <Accordion
         
          elevation={0}
        >
          
          <AccordionSummary
            sx={{
              backgroundColor: "#0084ff",
              color: "white",
              textTransform: "uppercase",
              border: "1px solid white",
             
            }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            backgroundColor="#0070f3"
          >
            <Typography variant="subtitle">written Statement process Details</Typography>
          </AccordionSummary>

          <AccordionDetails>
          <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
            <Grid item xs={12}>
              <DataGrid
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                autoHeight
              

                rows={
                  caseDetailsListM == [] || caseDetailsListM == undefined || caseDetailsListM == ""
                    ? []
                    : caseDetailsListM
                }
                columns={ws_details_columns}
                getRowId={(row) => row.srNo}
                pageSize={5}
                rowsPerPageOptions={[5]}
               
              />
            </Grid>
          </Grid>


          </AccordionDetails>

        </Accordion>
          </Grid>
        

        </Grid> */}

        <Grid
          container
          style={{
            // marginLeft:"10px"
            marginTop: "3px",
          }}
        >
          <Grid item lg={12}>
            <Accordion
              // sx={{
              //   margin: "40px",
              //   marginLeft: "6vh",
              //   marginRight: "5vh",
              //   marginTop: "2vh",
              //   marginBottom: "2vh",
              // }}
              elevation={0}
            >
              {/* title */}
              <AccordionSummary
                sx={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  textTransform: "uppercase",
                  border: "1px solid white",
                  // marginTop:"2px"
                  marginLeft: "12px",
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                backgroundColor="#0070f3"
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {/* Written Statement Process Details */}
                  <FormattedLabel id="writternStatementProcessDetails" />
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    <DataGrid
                      sx={
                        {
                          // marginLeft:"1px"
                          // border:"7px"
                        }
                      }
                      disableColumnFilter
                      disableColumnSelector
                      disableDensitySelector
                      components={{ Toolbar: GridToolbar }}
                      autoHeight
                      rows={dataSource4}
                      columns={ws_columns}
                      getRowId={(row) => row.srNo}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      //checkboxSelection
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        {/* Vakalatnama  */}
        <Grid
          container
          style={{
            // marginLeft:"10px"
            marginTop: "3px",
          }}
        >
          <Grid item lg={12}>
            <Accordion
              // sx={{
              //   margin: "40px",
              //   marginLeft: "6vh",
              //   marginRight: "5vh",
              //   marginTop: "2vh",
              //   marginBottom: "2vh",
              // }}
              elevation={0}
            >
              {/* title */}
              <AccordionSummary
                sx={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  textTransform: "uppercase",
                  border: "1px solid white",
                  // marginTop:"2px"
                  marginLeft: "12px",
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                backgroundColor="#0070f3"
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {/* Vakalatnama */}
                  <FormattedLabel id="vakalatnama" />
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    <DataGrid
                      sx={
                        {
                          // marginLeft:"1px"
                          // border:"7px"
                        }
                      }
                      disableColumnFilter
                      disableColumnSelector
                      disableDensitySelector
                      components={{ Toolbar: GridToolbar }}
                      autoHeight
                      rows={dataSource3}
                      columns={vakalatnama_columns}
                      getRowId={(row) => row.srNo}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      //checkboxSelection
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

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
          <Box
            sx={{
              width: "60%",
              height: "90%",
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
            {/* {selectedRowData && ( */}
            {/* <div 
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                // flexDirection: "column",
              }}
            > */}
            {documentRows && (
              <DataGrid
                sx={{
                  height: "50%",
                  width: "90%",
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                // components={{ Toolbar: GridToolbar }}
                // autoHeight
                rows={documentRows}
                columns={documentColumns}
                getRowId={(row) => row.srNo}
                pageSize={5}
                rowsPerPageOptions={[5]}
                //checkboxSelection
              />
            )}
            {/* </div> */}
            {/* )} */}
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={handleCloseModal}
              sx={{
                marginTop: "20px",
              }}
            >
              {/* Close */}
              <FormattedLabel id="close" />
            </Button>
          </Box>
        </Modal>

        {/* Modal for Parawise Details  */}

        <Modal
          open={modalOpen1}
          // onClose={handleCloseModal1}
          sx={{
            padding: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
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
                <strong style={{ display: "flex", justifyContent: "center" }}>
                  {language === "en" ? "Documents" : "दस्तऐवज"}
                </strong>
              </div>
              {documentRows1 && (
                <>
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
                    rows={paraReqDetails}
                    columns={documentColumns1}
                    // onPageChange={(_data) => {}}
                    // onPageSizeChange={(_data) => {}}
                  />
                </>
              )}
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
                  onClick={() => setModalOpen1(false)}
                  sx={{
                    marginTop: "20px",
                  }}
                >
                  {language === "en" ? "Close" : "बंद करा"}
                </Button>
              </Grid>
            </>
          </Box>
          {/* <Box
            sx={{
              width: "60%",
              height: "90%",
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
            {documentRows1 && (
              <DataGrid
                sx={{
                  height: "50%",
                  width: "90%",
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                // components={{ Toolbar: GridToolbar }}
                // autoHeight
                rows={dataSource5}
                columns={documentColumns1}
                getRowId={(row) => row.srNo}
                pageSize={5}
                rowsPerPageOptions={[5]}
                //checkboxSelection
              />
            )}
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => setModalOpen1(false)}
              sx={{
                marginTop: "20px",
              }}
            >
              Close
            </Button>
          </Box> */}
        </Modal>

        {/* Modal for Ws Documents  */}
        <Modal
          open={modalOpen2}
          onClose={handleCloseModal2}
          sx={{
            padding: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
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
                <strong style={{ display: "flex", justifyContent: "center" }}>
                  {language === "en" ? "Documents" : "दस्तऐवज"}
                </strong>
              </div>
              {documentRows2 && (
                <>
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
                    rows={dataSource6}
                    columns={documentColumns2}
                    // onPageChange={(_data) => {}}
                    // onPageSizeChange={(_data) => {}}
                  />
                </>
              )}
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
                  onClick={() => setModalOpen2(false)}
                  sx={{
                    marginTop: "20px",
                  }}
                >
                  {language === "en" ? "Close" : "बंद करा"}
                </Button>
              </Grid>
            </>
          </Box>
          {/* <Box
            sx={{
              width: "60%",
              height: "90%",
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
            {documentRows2 && (
              <DataGrid
                sx={{
                  height: "50%",
                  width: "90%",
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                rows={dataSource6}
                columns={documentColumns2}
                getRowId={(row) => row.srNo}
                pageSize={5}
                rowsPerPageOptions={[5]}
                //checkboxSelection
              />
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
        </Modal>
        {/* Modal for Ws remarks open  */}
        <Modal
          open={remarksOpen}
          onClose={() => {
            setRemarksOpen(false);
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 550,
              bgcolor: "white",
              boxShadow: 10,
              p: 2,
            }}
          >
            <Typography
              align="center"
              sx={{
                // fontWeight: "bolder",
                // fontSize: "large",
                // padding: 2,
                // border: "0.5px solid gray",
                textTransform: "capitalize",
              }}
            >
              {displayRemarks?.value}
            </Typography>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{ marginTop: "2vw" }}
                onClick={() => {
                  setRemarksOpen(false);
                }}
              >
                <FormattedLabel id="close" />
              </Button>
            </div>
          </Box>
        </Modal>
      </Paper>
      {/* </> */}
      {/* )
                    } */}
    </>
  );
};

export default View;
