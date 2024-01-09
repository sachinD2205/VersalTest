import { yupResolver } from "@hookform/resolvers/yup"
import CloseIcon from "@mui/icons-material/Close"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import ReportIcon from "@mui/icons-material/Report"
import SaveIcon from "@mui/icons-material/Save"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import UndoIcon from "@mui/icons-material/Undo"
import VisibilityIcon from "@mui/icons-material/Visibility"
import styles from "../../../../styles/newsRotationManagementSystem/[newMarriageRegistration]view.module.css"

import {
  Box,
  Button,
  CircularProgress,
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
} from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import axios from "axios"
import moment from "moment"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { default as swal } from "sweetalert"
import urls from "../../../../URLS/urls"
import NewsPaperDetails from "../../../../components/newsRotationManagementSystem/billSubmission/newsPaperDetails"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"

import { DataGrid } from "@mui/x-data-grid"
import { paymentDetailsSchema } from "../../../../containers/schema/newsRotationManagementSystem/BillSubmission"
import { catchExceptionHandlingMethod } from "../../../../util/util"
// import paymentDetailsSchema from "../../../../containers/schema/newsRotationManagementSystem/BillSubmission";
// import { EyeFilled } from "@ant-design/icons";

const Index = () => {
  const [validations, setValidations] = useState(paymentDetailsSchema)
  const [id, setId] = useState(null)

  // const [watchItemsMain, setWatchItemsMain] = useState(watch("prePaymentDetails"));
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   watch,
  //   getValues,
  //   setValue,
  //   setError,
  //   clearErrors,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(validations),
  //   mode: "onChange",
  // });
  // const [viewPrastav, setViewPrastav] = useState(false);
  // const [viewAadesh, setViewAadesh] = useState(false);
  // const [viewBudgetProvision, setViewBudgetProvision] = useState(false);
  // const [gpDisabled, setGpDisabled] = useState(true);
  // const [gaDisabled, setGaDisabled] = useState(false);
  // const [gbpDisabled, setGbpDisabled] = useState(true);
  //file attach
  // const [attachedFile, setAttachedFile] = useState("");
  // const [mainFiles, setMainFiles] = useState([]);
  // const [uploading, setUploading] = useState(false);
  // const [finalFiles, setFinalFiles] = useState([]);
  // const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  // const [requestNo, setRequestNo] = useState();
  // const [additionalFiles, setAdditionalFiles] = useState([]);
  // const [saveChiPattiDisabled, setSaveChiPattiDisabled] = useState(true);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(validations),
    mode: "onChange",
    defaultValues: { prePaymentDetails: [] },
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = methods

  const [modalforAprov, setmodalforAprov] = useState(false)
  const [modalforcalculation, setmodalforcalculation] = useState(false)
  const [department, setDepartment] = useState([])
  const [newsPaperAll, setNewsPaperAll] = useState([])
  const [newsPapersLength, setNewsPapersLength] = useState()
  const [btnSaveText, setBtnSaveText] = useState()
  const [methodology, setMethodology] = useState()
  const [prastavDtl, setPrastavDtl] = useState([])
  const [aadeshDtl, setAadeshDtl] = useState([])
  const [budgetBifercation, setBudgetBifercation] = useState([])
  const [newsPublishRequests, setNewsPublishRequests] = useState([])
  const [showrotationNumbers, setShowrotationNumbers] = useState(true)
  const [loadingState, setLoadingState] = useState(false)
  const language = useSelector((state) => state.labels.language)
  const router = useRouter()
  const user = useSelector((state) => state.user.user)
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  )
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer
  })?.roles
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer)
  console.log("authority", authority)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }
  const columnsOfPrastav = [
    {
      field: "srNo",
      headerName: language == "en" ? `Sr No` : `अ क्र`,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: language == "en" ? "newsPaperName" : "newsPaperNameMr",
      headerName: language == "en" ? `News Paper Name` : `वृत्तपत्राचे नाव`,
      minWidth: 100,
      flex: 3,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "billingStatus",
      headerName: language == "en" ? `Billing Status` : `बिलिंग स्थिती`,
      minWidth: 70,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.billingStatus == `Bill Submitted` ? (
              <div style={{ color: "green" }}>{params?.row?.billingStatus}</div>
            ) : (
              <div style={{ color: "red" }}>{params?.row?.billingStatus}</div>
            )}
          </>
        )
      },
    },
    {
      field: "standardFormatSize",
      headerName:
        language == "en" ? `Standard Format Size` : `मानक स्वरूप आकार`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "calculatedRate",
      headerName: language == "en" ? `Rate` : `दर`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalAmount",
      headerName: language == "en" ? `Total Amount` : `एकूण रक्कम`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ]

  const columnsOfAadesh = [
    {
      field: "srNo",
      headerName: language == "en" ? `Sr No` : `अ क्र`,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      flex: 0.5,
    },

    {
      field: language == "en" ? "newsPaperName" : "newsPaperNameMr",
      headerName: language == "en" ? `News Paper Name` : `वृत्तपत्राचे नाव`,
      minWidth: 100,
      flex: 1.5,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "agencyPublishedDate",
      headerName: language == "en" ? `Published Date` : `प्रकाशित दिनांक`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actualFormatSize",
      headerName: language == "en" ? `Actual Format Size` : `वास्तविक आकारमान`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "standardFormatSize",
      headerName: language == "en" ? `Standard Format Size` : `आकारमान`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "calculatedRate",
      headerName:
        language == "en" ? `Approved Rate per sq.cm` : `मंजूर दर प्र.चौ से.मी.`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalAmount",
      headerName: language == "en" ? `Total Amount` : `एकूण र.रू.`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalDeduction",
      headerName: language == "en" ? `Total Deduction Amount` : `वजा दंड र.रू.`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalTaxDeduction",
      headerName: language == "en" ? `Total TDS Amount` : `वजा टी.डी.एस र.रू.`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalNetAmount",
      headerName: language == "en" ? `Total Net Payable` : `निव्वळ देय र. रू.`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ]

  const columnsOfBudgetBifercation = [
    {
      field: "srNo",
      headerName: language == "en" ? `Sr No` : `अ क्र`,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
      flex: 0.5,
    },

    {
      field: language == "en" ? "newsPaperName" : "newsPaperNameMr",
      headerName: language == "en" ? `News Paper Name` : `वृत्तपत्राचे नाव`,
      minWidth: 100,
      flex: 3,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "billAmount",
      headerName: language == "en" ? `Bill Amount` : `बिलाची रक्कम`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "previousExpense",
      headerName: language == "en" ? `Previous Expenses` : `पूर्वीचा खर्च`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "expenseWithThisBill",
      headerName:
        language == "en"
          ? `Expense With This Bill`
          : `या बिलासह एकूण खर्च ४ + ५`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "remainingBudgetAmount",
      headerName: language == "en" ? `Remaining Amount` : `शिल्लक`,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ]

  // get Department Name
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDepartment(res.data.department)
        // console.log("res.data", r.data);
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  const getNewsPaperAll = () => {
    axios
      .get(`${urls.NRMS}/newspaperMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setNewsPaperAll(r?.data?.newspaperMasterList)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    console.log("prastavDetails: ", prastavDtl)
  }, [prastavDtl])

  const getAllEditTableData = (id) => {
    axios
      .get(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log(":aaaa", id, r?.data)
        reset(r.data)
        // let prePayDTLS=r?.data?.prePaymentDetails?.map((p,i)=>{
        //   return {
        //     srNo:i+1,
        //     ...p,
        //     disabled:p.isChecked
        //   }
        // });

        // setValue(`prePaymentDetails`, prePayDTLS);

        setId(r?.data?.id)

        if (r?.data?.status == "PRASTAV_GENERATED") {
          // setViewPrastav(true);
        } else if (r?.data?.status == "AADESH_GENERATED") {
          // setViewPrastav(true);
          // setViewAadesh(true);
        } else if (
          [
            "BUDGET_PROVISION_GENERATED",
            "CREATED",
            "DATA_PUSHED_TO_FICO_SAP",
            "REVERT_BACK_TO_DEPT_USER",
            "CORRECTED",
          ].includes(r?.data?.status)
        ) {
          // setViewPrastav(true);
          // setViewAadesh(true);
          // setViewBudgetProvision(true);

          let pDtl = r?.data?.prePaymentDetails?.map((record, indexx) => {
            return {
              srNo: indexx + 1,
              ...record,
            }
          })

          setPrastavDtl(pDtl)

          let preTotalAmount = 0
          let preTotalPenalty = 0
          let preTotalTDS = 0
          let preTotalNetAmount = 0

          r?.data?.prePaymentDetails?.map((record, indexx) => {
            preTotalAmount += record.totalAmount
            preTotalPenalty += record.totalDeduction
            preTotalTDS += record.totalTaxDeduction
            preTotalNetAmount += record.totalNetAmount
          })

          setValue("preTotalAmount", preTotalAmount)
          setValue("preTotalPenalty", preTotalPenalty)
          setValue("preTotalTDS", preTotalTDS)
          setValue("preTotalNetAmount", preTotalNetAmount)

          console.log(
            "All Fresh--->>>",
            preTotalAmount,
            preTotalPenalty,
            preTotalTDS,
            preTotalNetAmount
          )

          console.log(
            "All--->>>",
            preTotalAmount,
            preTotalPenalty,
            preTotalTDS,
            preTotalNetAmount
          )

          setAadeshDtl(
            r?.data?.paymentDetails
              ?.filter((obj) => obj.isChecked)
              .map((record, indexx) => {
                return {
                  srNo: indexx + 1,
                  ...record,
                  agencyPublishedDate: moment(
                    r?.data?.newsPublishRequestDao?.newsPublishDate
                  ).format("DD/MM/YYYY"),
                }
              })
          )

          setBudgetBifercation(
            r?.data?.budgetBifercationDaos
              ? r?.data?.budgetBifercationDaos?.map((record, indexx) => {
                  return {
                    srNo: indexx + 1,
                    ...record,
                  }
                })
              : []
          )
        }

        // setSelectedGroupId(r?.data?.rotationGroupKey);
        // setSelectedSubGroupId(r?.data?.rotationSubGroupKey);
        // setSelectedNewsPaperLevel(r?.data?.newsPaperLevel);
        // getRotationSubGroup(r?.data?.rotationGroupKey);
        // getLevel(r?.data?.rotationGroupKey, r?.data?.rotationSubGroupKey);
        // getNewsPaperOriginal(r?.data?.rotationGroupKey, r?.data?.rotationSubGroupKey, r?.data?.newsPaperLevel);
        // getStandardFormatSize(r?.data?.rotationGroupKey, r?.data?.rotationSubGroupKey, r?.data?.newsPaperLevel);

        if (r?.data?.attachmentDao != null) {
          let flag = false
          if (
            authority?.includes("ENTRY") &&
            (r?.data?.status == "DRAFTED" ||
              r?.data?.status == "REVERT_BACK_TO_DEPT_USER" ||
              r?.data?.status == "null") &&
            ["Edit", "Add"].includes(router?.query?.pageMode)
          ) {
            flag = true
          } else {
            flag = false
          }
          // setAuthorizedToUpload(flag);
          console.log("flag++++", flag)
          // setFinalFiles(
          //   r?.data?.attachmentDao.map((r, i) => {
          //     return {
          //       ...r,
          //       srNo: i + 1,
          //     };
          //   })
          // );
        }
        // let ggg = r?.data?.prePaymentDetails?.length > 0 ? r?.data?.prePaymentDetails : [];
        // console.log("newsPapersLength", ggg.length);
        // setValue("newsPapersLength", ggg.length);
        let prePaymentDetails = r?.data?.prePaymentDetails?.map((rr) => {
          return {
            ...rr,
            agencyPublishedDate:
              r?.data?.newsPublishRequestDao?.newsPublishDate,
            disabled: rr.isChecked,
          }
        })
        console.log("paymentDetails007", prePaymentDetails)
        let reqNo = r?.data?.newsPublishRequestDao?.newsPublishRequestNo
        console.log("reqNo007", reqNo)
        handleRequestNo(reqNo)
        setValue("prePaymentDetails", prePaymentDetails)
        console.log("paymentDetailsfromuseForm", getValues("prePaymentDetails"))
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  // useEffect(() => {
  // let flags = getValues("prePaymentDetails")?.map((record) => {
  //   if (
  //     typeof record.billNo != "undefined" &&
  //     record.billNo != null &&
  //     typeof record.billDate != "undefined" &&
  //     record.billDate != null
  //   )
  //     return true;
  //   else return false;
  // });
  // console.log("flags", flags);
  // if (flags.includes(true)) {
  //   console.log("flagssatisfied", flags);
  //   setGpDisabled(false);
  // }else{
  //   setGpDisabled(true);
  // }
  // }, [getValues("prePaymentDetails")]);

  const handleRequestNo = (value) => {
    setLoadingState(true)

    // setRequestNo(value);
    axios
      .get(
        `${urls.NRMS}/trnNewsPublishRequest/getDetailsByNewsPublishRequestNo?newsPublishRequestNo=${value}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((r) => {
        console.log("r.data", r.data)
        if (r.data) {
          setValue("newsPublishRequest", r?.data?.id)
          setValue("newsPublishRequestNo", r?.data?.newsPublishRequestNo)
          setValue("department", r?.data?.department)
          setValue("departmentName", r?.data?.departmentName)
          setValue("departmentNameMr", r?.data?.departmentNameMr)
          setValue("newsPublishDate", r?.data?.newsPublishDate)
          setValue(
            "newsAdvertisementSubject",
            r?.data?.newsAdvertisementSubject
          )
          setValue(
            "newsAdvertisementDescription",
            r?.data?.newsAdvertisementDescription
          )
          setValue("typeOfNews", r?.data?.typeOfNews)
          setValue("typeOfNewsName", r?.data?.typeOfNewsName)
          setValue("typeOfNewsNameMr", r?.data?.typeOfNewsNameMr)
          setValue("workCost", r?.data?.workCost)
          setValue("workName", r?.data?.workName)
          setValue("standardFormatSize", r?.data?.standardFormatSizeNM)
          setValue("workCost", r?.data?.workCost)
          setValue("workName", r?.data?.workName)
          setValue("rotationGroupKey", r?.data?.rotationGroupKey)
          setValue("rotationSubGroupKey", r?.data?.rotationSubGroupKey)
          setValue("newsPaperLevel", r?.data?.newsPaperLevel)
          setValue("newsPapers", r?.data?.newsPapers)
          setValue("newspapersLst", r?.data?.newspapersLst)
          // setValue("id", null);
          console.log("result", r.data)
          let ggg = r?.data?.newsPapers?.split(",")?.length
          console.log("newsPapersLength", ggg)
          setValue("newsPapersLength", ggg)
          setNewsPapersLength(ggg)
          // setGpDisabled(false);
        } else {
          console.log("Not Foundd")
          swal(
            language === "en"
              ? "News Not Published Yet...!!!"
              : "बातमी अजून प्रकाशित झालेली नाही...!!!"
          )
        }
        setLoadingState(false)
      })
      .catch((error) => {
        setLoadingState(false)
        callCatchMethod(error, language)
      })

    setShowrotationNumbers(false)
  }

  //
  // const cancellButton = () => {
  //   reset({
  //     ...resetValuesCancell,
  //     //
  //   });
  // };

  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
      //   width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      flex: 1,
      // width: 140,
    },
    language == "en"
      ? {
          headerName: "Uploaded By",
          field: "attachedNameEn",
          flex: 2,
          // width: 300,
        }
      : {
          headerName: "द्वारे अपलोड केले",
          field: "attachedNameMr",
          flex: 2,
          // width: 300,
        },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,
      // width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                  "_blank"
                )
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        )
      },
    },
  ]

  //view application remarks
  const remarks = async (props) => {
    let applicationId
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId
    } else if (router?.query?.id) {
      applicationId = router?.query?.id
    }

    console.log(
      "appid",
      applicationId,
      router?.query?.applicationId,
      router?.query?.id
    )

    const finalBody = {
      id: Number(applicationId),
      approveRemark:
        props == "APPROVE"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      rejectRemark:
        props == "REASSIGN"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,

      finalRejectionRemark:
        props == "REJECT"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      outwardNo: watch("outwardNo"),
      outwardDate: watch("outwardDate"),
    }

    // console.log("serviceId**-", serviceId);

    await axios
      .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          setmodalforAprov(false)
          swal(
            language === "en" ? "Saved!" : "जतन केले!",
            language === "en"
              ? "Record Saved successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन केले",
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          )
          router.push(
            `/newsRotationManagementSystem/transaction/newsPaperAgencybill`
          )
        }
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  // console.log("data.status === 6",data.status ==5)
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })

    router.push({
      pathname:
        "/newsRotationManagementSystem/transaction/newsPaperAgencybill/",
      query: {
        pageMode: "View",
      },
    })
  }

  const resetValuesCancell = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",
    newsAttachement: "",
  }

  const resetValuesExit = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",
    id: null,
    newsAttachement: "",
  }

  const onSubmitForm = (billData) => {
    // Save - DB
    let _body = {
      ...billData,
      methodology,
      financialYear: 5,
      // id: router?.query?.id,
      activeFlag: billData.activeFlag,
      // attachmentDao: finalFiles,
      isDraft: btnSaveText ? (btnSaveText == "DRAFT" ? true : false) : null,
      isCorrection: btnSaveText
        ? btnSaveText == "UPDATE"
          ? true
          : false
        : null,
    }

    // if (btnSaveText === "Save") {
    console.log("_body", _body)
    // alert("GG");

    let flagss = billData.prePaymentDetails.map((gg, ii) => {
      // if (!gg?.isChecked && gg?.standardFormatSize === 0) {
      if (!gg?.isChecked && gg?.standardFormatSize != 0) {
        console.log("not allowed", ii, gg.isChecked, gg.standardFormatSize)
        setError(`prePaymentDetails.${ii}.standardFormatSize`, {
          message: "standard Format Size Should Not be zero!",
        })
        return false
      } else {
        console.log("allowed", ii, gg.isChecked, gg.standardFormatSize)
        clearErrors(`prePaymentDetails.${ii}.standardFormatSize`)
        return true
      }
    })

    console.log("flagss", flagss)
    if (!flagss.includes(false)) {
      axios
        .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            serviceid: selectedMenuFromDrawer,
          },
        })
        .then((res) => {
          console.log("res---", res)
          if (res?.status == 201) {
            let iddd = res?.data?.status?.split("$$")?.[1]
            setId(iddd)
            if (["GP", "GA", "GBP"].includes(methodology)) {
              getAllEditTableData(iddd)
            } else {
              sweetAlert(
                language === "en" ? "Saved!" : "जतन केले!",
                language === "en"
                  ? "Record Saved successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              )
              router.push({
                pathname:
                  "/newsRotationManagementSystem/transaction/newsPaperAgencybill/",
                query: {
                  pageMode: "View",
                },
              })
            }
          }
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
      setmodalforcalculation(false)
    }
  }

  const handleSave = (billData) => {
    // Save - DB
    let _body = {
      ...billData,

      methodology,
      financialYear: 5,
      isDraft: btnSaveText ? (btnSaveText == "DRAFT" ? true : false) : null,
      isCorrection: btnSaveText
        ? btnSaveText == "UPDATE"
          ? true
          : false
        : null,
    }

    console.log("_body", _body)
    if (methodology == "GP") {
      let flagss = billData.prePaymentDetails.map((gg, ii) => {
        if (!gg?.isChecked && gg?.standardFormatSize != 0) {
          console.log("not allowed", ii, gg.isChecked, gg.standardFormatSize)
          setError(`prePaymentDetails.${ii}.standardFormatSize`, {
            message: "standard Format Size Should Not be zero!",
          })
          return false
        } else {
          console.log("allowed", ii, gg.isChecked, gg.standardFormatSize)
          clearErrors(`prePaymentDetails.${ii}.standardFormatSize`)
          return true
        }
      })

      console.log("flagss", flagss)
      if (!flagss.includes(false)) {
        axios
          .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              serviceid: selectedMenuFromDrawer,
            },
          })
          .then((res) => {
            console.log("res---", res)
            if (res?.status == 201) {
              let iddd = res?.data?.status?.split("$$")?.[1]
              setId(iddd)
              if (["GP"].includes(methodology) && !btnSaveText == "DRAFT") {
                getAllEditTableData(iddd)
                sweetAlert(
                  language === "en" ? "Generated!" : "व्युत्पन्न!",
                  language === "en"
                    ? "Prastav generated successfully !"
                    : "प्रस्तव यशस्वीरित्या निर्माण झाला",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
              } else {
                if (btnSaveText == "DRAFT") {
                  sweetAlert(
                    language === "en" ? "Drafted!" : "मसुदा तयार केला!",
                    language === "en"
                      ? "Record Drafted successfully !"
                      : "रेकॉर्ड मसुदा यशस्वीरित्या तयार केला",
                    "success",
                    { button: language === "en" ? "Ok" : "ठीक आहे" }
                  )
                } else {
                  sweetAlert(
                    language === "en" ? "Saved!" : "जतन केले!",
                    language === "en"
                      ? "Record Saved successfully !"
                      : "रेकॉर्ड यशस्वीरित्या जतन केले",
                    "success",
                    { button: language === "en" ? "Ok" : "ठीक आहे" }
                  )
                }

                router.push({
                  pathname:
                    "/newsRotationManagementSystem/transaction/newsPaperAgencybill/",
                  query: {
                    pageMode: "View",
                  },
                })
              }
            }
          })
          .catch((error) => {
            callCatchMethod(error, language)
          })
      }
    } else if (methodology == "GA") {
      axios
        .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            serviceid: selectedMenuFromDrawer,
          },
        })
        .then((res) => {
          console.log("res---", res)
          if (res?.status == 201) {
            let iddd = res?.data?.status?.split("$$")?.[1]
            setId(iddd)
            if (["GA", "GBP"].includes(methodology)) {
              getAllEditTableData(iddd)
            } else {
              sweetAlert(
                language === "en" ? "Saved!" : "जतन केले!",
                language === "en"
                  ? "Record Saved successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              )
              router.push({
                pathname:
                  "/newsRotationManagementSystem/transaction/newsPaperAgencybill/",
                query: {
                  pageMode: "View",
                },
              })
            }
          }
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    } else if (methodology == "GBP") {
      axios
        .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            serviceid: selectedMenuFromDrawer,
          },
        })
        .then((res) => {
          console.log("res---", res)
          if (res?.status == 201) {
            let iddd = res?.data?.status?.split("$$")?.[1]
            setId(iddd)
            if (["GA", "GBP"].includes(methodology)) {
              getAllEditTableData(iddd)
              // setSaveChiPattiDisabled(false);
            } else {
              sweetAlert(
                language === "en" ? "Saved!" : "जतन केले!",
                language === "en"
                  ? "Record Saved successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              )
              router.push({
                pathname:
                  "/newsRotationManagementSystem/transaction/newsPaperAgencybill/",
                query: {
                  pageMode: "View",
                },
              })
            }
          }
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    }
    setmodalforcalculation(false)
  }

  const handleGenerateAadesh = (id) => {
    setMethodology("GA")
    // let totalAmount = 0;
    // let totalPenalty = 0;
    // let totalTDS = 0;
    // let totalNetAmount = 0;

    // getValues("paymentDetails")?.map((record, indexx) => {
    //   totalAmount += record.totalAmount;
    //   totalPenalty += record.totalDeduction;
    //   totalTDS += record.totalTaxDeduction;
    //   totalNetAmount += record.totalNetAmount;
    // });

    // setValue("totalAmount", totalAmount);
    // setValue("totalPenalty", totalPenalty);
    // setValue("totalTDS", totalTDS);
    // setValue("totalNetAmount", totalNetAmount);

    // console.log(
    //   "All Fresh--->>>",
    //   totalAmount,
    //   totalPenalty,
    //   totalTDS,
    //   totalNetAmount
    // );
    if (getValues("status") == "PRASTAV_GENERATED") {
      axios
        .get(
          `${urls.NRMS}/trnNewspaperAgencyBillSubmission/getPaymentDetails?trnId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              serviceid: selectedMenuFromDrawer,
            },
          }
        )
        .then((res) => {
          if (res?.status == 200) {
            let resss = res?.data?.paymentDetails
              ?.filter((obj) => obj.isChecked)
              .map((o, i) => {
                return {
                  ...o,
                  srNo: i + 1,
                  agencyPublishedDate: moment(
                    getValues("newsPublishRequestDao.newsPublishDate")
                  ).format("DD/MM/YYYY"),
                }
              })
            setAadeshDtl(resss)
            setValue("paymentDetails", resss)
            setValue(
              "leastStandardFormatSize",
              res?.data?.leastStandardFormatSize
            )
            setValue("totalAmount", res?.data?.totalAmount)
            setValue("totalPenalty", res?.data?.totalPenalty)
            setValue("totalTDS", res?.data?.totalTDS)
            setValue("totalNetAmount", res?.data?.totalNetAmount)
          }
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    }
    setmodalforcalculation(true)
    // setmodalforcalculation(false);
  }

  const handleBudgetProvision = (id) => {
    setMethodology("GBP")

    if (getValues("status") == "AADESH_GENERATED") {
      axios
        .get(
          `${urls.NRMS}/trnNewspaperAgencyBillSubmission/getBudgetBifercationDaos?trnId=${id}&financialYear=5`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              serviceid: selectedMenuFromDrawer,
            },
          }
        )
        .then((res) => {
          if (res?.status == 200) {
            console.log("dataaa", res?.data)
            let resss = res?.data?.budgetBifercationDaos?.map((o, i) => {
              return {
                ...o,
                srNo: i + 1,
              }
            })

            setBudgetBifercation(resss)

            setValue("budgetBifercationDaos", resss)

            setValue(
              "budgetProvisionDaos.budgetProvision",
              res?.data?.budgetProvisionDaos?.budgetProvision
            )
            setValue(
              "budgetProvisionDaos.budgetProvisionValue",
              res?.data?.budgetProvisionDaos?.budgetProvisionValue
            )
            setValue(
              "budgetProvisionDaos.financialYear",
              res?.data?.budgetProvisionDaos?.financialYear
            )
            setValue(
              "budgetProvisionDaos.financialYearName",
              res?.data?.budgetProvisionDaos?.financialYearName
            )

            // setValue(
            //   "budgetProvision",
            //   res?.data?.budgetProvisionDaos?.budgetProvision
            // );
            // setValue(
            //   "budgetProvisionValue",
            //   res?.data?.budgetProvisionDaos?.budgetProvisionValue
            // );
            // setValue(
            //   "financialYear",
            //   res?.data?.budgetProvisionDaos?.financialYear
            // );
            setValue(
              "financialYearName",
              res?.data?.budgetProvisionDaos?.financialYearName
            )
            setValue(
              "financialYearNameMr",
              res?.data?.budgetProvisionDaos?.financialYearNameMr
            )
          }
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    }
    setmodalforcalculation(true)
    // setmodalforcalculation(false);
  }

  useEffect(() => {
    getNewsPaperAll()
  }, [])

  useEffect(() => {
    getDepartment()
    // console.log("user", user);
  }, [])

  useEffect(() => {
    if (router.query.id != undefined && router?.query?.pageMode != null) {
      getAllEditTableData(router?.query?.id)
      // setBtnSaveText("Update");
      console.log("hwllo", router.query.id)
    } else {
      // if (authority?.includes("ENTRY")) {
      //   setAuthorizedToUpload(true);
      // }
    }

    // setValue("prePaymentDetails", [])
  }, [router?.query?.id])

  useEffect(() => {
    console.log("errors**:", errors)
  }, [errors])

  useEffect(() => {
    if (router.query.id != undefined && router?.query?.pageMode != null) {
      getAllEditTableData(router.query.id)
      // setBtnSaveText("Update");
      console.log("hwllo", router.query.id)
    } else {
      // if (authority?.includes("ENTRY")) {
      //   setAuthorizedToUpload(true);
      // }
    }

    // setValue("prePaymentDetails", [])
  }, [])

  useEffect(() => {
    console.log("errors**:", errors)
  }, [errors])

  useEffect(() => {
    axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getRequestNumbers`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("res.data", res.data)
        setNewsPublishRequests(res.data)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }, [])

  useEffect(() => {
    console.log("watch(newsPublishRequestNo)", watch("newsPublishRequestNo"))
  }, [watch("newsPublishRequestNo")])

  // useEffect(() => {
  //   setFinalFiles([...mainFiles, ...additionalFiles]);
  // }, [mainFiles, additionalFiles]);

  useEffect(() => {
    console.log(":a2", prastavDtl)
  }, [prastavDtl])

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          // marginTop: "10px",
          // marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {/* <FormattedLabel id="newsPublish" /> */}
            {language == "en"
              ? "News Agency Bill Submission"
              : "वृत्तसंस्था बिल सबमिशन"}
          </h2>
        </Box>

        <Box
          sx={
            {
              // marginTop: 2,
              // marginLeft: 5,
              // marginRight: 5,
              // marginBottom: 5,
              // padding: 1,
              // border:1,
              // borderColor:'grey.500'
            }
          }
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid>
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
                    alignItems: "flex-end",
                  }}
                >
                  {showrotationNumbers && (
                    <>
                      <Grid item>
                        <FormControl variant="standard">
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="newsRotationReqN" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 350 }}
                                {...field}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value), setLoadingState(true)
                                  handleRequestNo(value.target.value)
                                }}
                              >
                                {newsPublishRequests?.map((npr, index) => (
                                  <MenuItem key={index} value={npr}>
                                    {npr}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                            name="requestNo"
                            control={control}
                            defaultValue={null}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {loadingState && (
                    <CircularProgress size={25} sx={{ marginLeft: 2 }} />
                  )}
                </Grid>

                <Grid
                  container
                  sx={
                    {
                      /* padding: "10px" */
                    }
                  }
                >
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      id="standard-textarea"
                      label={<FormattedLabel id="newsRotationRequestNumber" />}
                      sx={{ width: 300 }}
                      variant="standard"
                      {...register("newsPublishRequestNo")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl variant="standard" error={!!errors.department}>
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="departmentName" required />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled
                            sx={{ width: 300 }}
                            {...field}
                            value={field.value}
                            {...register("department")}
                            onChange={(value) => field.onChange(value)}
                          >
                            {department &&
                              department.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {language == "en"
                                    ? department?.department
                                    : department?.departmentMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="department"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.department ? errors.department.message : null}
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
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      style={{ marginTop: 10 }}
                      error={!!errors.newsPublishDate}
                    >
                      <Controller
                        control={control}
                        name="newsPublishDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="publishDate" />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  sx={{ width: 300 }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.newsPublishDate
                          ? errors.newsPublishDate.message
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
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "start",
                    }}
                  >
                    <TextField
                      disabled
                      id="standard-textarea"
                      label={<FormattedLabel id="advertisementType" />}
                      sx={{ width: 300 }}
                      multiline
                      variant="standard"
                      value={
                        language == "en"
                          ? watch("typeOfNewsName")
                          : watch("typeOfNewsNameMr")
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  {watch("workCost") != null && (
                    <>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          disabled
                          id="standard-textarea"
                          label={
                            language == "en" ? "Tender Name" : "टेंडरचे नाव"
                          }
                          sx={{ width: 300 }}
                          multiline
                          variant="standard"
                          value={watch("workName")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          disabled
                          id="standard-textarea"
                          label={
                            language == "en" ? "Tender Cost" : "टेंडर रक्कम"
                          }
                          sx={{ width: 300 }}
                          multiline
                          variant="standard"
                          value={watch("workCost")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  {watch("standardFormatSize") && (
                    <>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          disabled
                          value={watch("standardFormatSize")}
                          id="standard-textarea"
                          label={
                            language == "en"
                              ? "Standard Format Size"
                              : "मानक स्वरूप आकार"
                          }
                          sx={{ width: 300 }}
                          multiline
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      // disabled={router?.query?.pageMode === "View"}
                      id="standard-textarea"
                      label={<FormattedLabel id="newsSubject" />}
                      sx={{
                        width: "100%",
                        marginLeft: "60px",
                        marginRight: "60px",
                      }}
                      variant="standard"
                      {...register("newsAdvertisementSubject")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "start",
                    }}
                  >
                    <TextField
                      disabled
                      id="standard-textarea"
                      value={watch("newsAdvertisementDescription")}
                      label={<FormattedLabel id="newsDescription" />}
                      sx={{
                        width: "100%",
                        marginLeft: "60px",
                        marginRight: "60px",
                      }}
                      multiline
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>

                {newsPapersLength > 0 && (
                  <>
                    <Grid item xs={12}>
                      <NewsPaperDetails />
                    </Grid>
                  </>
                )}

                {/* <Box
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    background:
                      "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                  }}
                >
                  <h2> {<FormattedLabel id="newsAttachement" />}</h2>
                </Box> */}

                {/* Attachement */}
                {/* <Grid item xs={12}>
                  <FileTable
                    appName="NRMS" //Module Name
                    serviceName={"N-BS"} //Transaction Name
                    fileName={attachedFile} //State to attach file
                    filePath={setAttachedFile} // File state upadtion function
                    newFilesFn={setAdditionalFiles} // File data function
                    columns={_columns} //columns for the table
                    rows={finalFiles} //state to be displayed in table
                    uploading={setUploading}
                    authorizedToUpload={authorizedToUpload}
                    // showNoticeAttachment={router.query.showNoticeAttachment}
                  />
                </Grid> */}

                <Grid
                  container
                  spacing={0.5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                  }}
                >
                  <Grid item>
                    {getValues("prePaymentDetails")?.filter(
                      (x) => x.totalNetAmount >= 0
                    )?.length > 0 && (
                      <Button
                        // type="submit"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (
                            getValues("newspapersLst")?.length ==
                            getValues("prePaymentDetails")?.length
                          ) {
                            setPrastavDtl(
                              getValues("prePaymentDetails")?.map((rec, i) => ({
                                ...rec,
                                srNo: i + 1,
                                newsPaperName: newsPaperAll.find(
                                  (oo) => oo.id == rec.newsPaper
                                )?.newspaperName,
                                newsPaperNameMr: newsPaperAll.find(
                                  (oo) => oo.id == rec.newsPaper
                                )?.newspaperNameMr,
                                billingStatus: rec?.isChecked
                                  ? "Bill Submitted"
                                  : "Bill Not Submitted",
                              }))
                            )

                            let preTotalAmount = 0
                            let preTotalPenalty = 0
                            let preTotalTDS = 0
                            let preTotalNetAmount = 0

                            getValues("prePaymentDetails")?.map(
                              (record, indexx) => {
                                preTotalAmount += record.totalAmount
                                preTotalPenalty += record.totalDeduction
                                preTotalTDS += record.totalTaxDeduction
                                preTotalNetAmount += record.totalNetAmount
                              }
                            )

                            setValue("preTotalAmount", preTotalAmount)
                            setValue("preTotalPenalty", preTotalPenalty)
                            setValue("preTotalTDS", preTotalTDS)
                            setValue("preTotalNetAmount", preTotalNetAmount)

                            setMethodology("GP")
                            setmodalforcalculation(true)
                          } else {
                            swal(
                              language === "en" ? "Info!" : "माहिती",
                              language === "en"
                                ? "Please fill all news agency bills"
                                : "कृपया सर्व वृत्तसंस्थेची बिले भरा",
                              "info",
                              { button: language === "en" ? "Ok" : "ठीक आहे" }
                            )
                          }
                        }}
                      >
                        {[
                          "PRASTAV_GENERATED",
                          "AADESH_GENERATED",
                          "BUDGET_PROVISION_GENERATED",
                          "CREATED",
                          "DATA_PUSHED_TO_FICO_SAP",
                          "CORRECTED",
                        ].includes(getValues("status"))
                          ? language == "en"
                            ? "VIEW PRASTAV"
                            : "प्रस्ताव पहा"
                          : language == "en"
                          ? "Generate Prastav"
                          : "जनरेट प्रस्ताव"}
                      </Button>
                    )}
                  </Grid>

                  <Grid item>
                    {![null, undefined].includes(getValues("status")) && (
                      <>
                        <Button
                          disabled={[
                            null,
                            undefined,
                            "REVERT_BACK_TO_DEPT_USER",
                          ].includes(getValues("status"))}
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleGenerateAadesh(id)
                          }}
                        >
                          {[
                            "AADESH_GENERATED",
                            "BUDGET_PROVISION_GENERATED",
                            "CREATED",
                            "DATA_PUSHED_TO_FICO_SAP",
                            "CORRECTED",
                          ].includes(getValues("status"))
                            ? language == "en"
                              ? "VIEW Aadesh"
                              : "आदेश पहा"
                            : language == "en"
                            ? "Generate Aadesh"
                            : "जनरेट आदेश"}
                        </Button>
                      </>
                    )}
                  </Grid>

                  <Grid item>
                    {![null, undefined, "PRASTAV_GENERATED"].includes(
                      getValues("status")
                    ) && (
                      <>
                        <Button
                          disabled={[
                            null,
                            undefined,
                            "PRASTAV_GENERATED",
                            "REVERT_BACK_TO_DEPT_USER",
                          ].includes(getValues("status"))}
                          // type="submit"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleBudgetProvision(id)
                          }}
                        >
                          {[
                            "BUDGET_PROVISION_GENERATED",
                            "CREATED",
                            "DATA_PUSHED_TO_FICO_SAP",
                            "CORRECTED",
                          ].includes(getValues("status"))
                            ? language == "en"
                              ? "VIEW Budget Provision"
                              : "बजेट प्रोविझन पहा"
                            : language == "en"
                            ? "Generate Budget Provision"
                            : "जनरेट बजेट प्रोविझन"}
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={0.5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                  }}
                >
                  <Grid item>
                    {[
                      // "PRASTAV_GENERATED",
                      "AADESH_GENERATED",
                      "BUDGET_PROVISION_GENERATED",
                      "CREATED",
                      "DATA_PUSHED_TO_FICO_SAP",
                      "CORRECTED",
                    ].includes(getValues("status")) && (
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<VisibilityIcon />}
                        onClick={() => {
                          setMethodology("GP")
                          localStorage.setItem(
                            "newspaperAgencyBillSubmissionId",
                            id
                          )
                          localStorage.setItem(
                            "pageMode",
                            router?.query?.pageMode
                          )
                          router.push(
                            "/newsRotationManagementSystem/transaction/newsPaperAgencybill/prastav"
                          )
                        }}
                      >
                        {language == "en"
                          ? "Print Prastav"
                          : "प्रस्ताव प्रत काढा"}
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    {[
                      // "PRASTAV_GENERATED",
                      "AADESH_GENERATED",
                      "BUDGET_PROVISION_GENERATED",
                      "CREATED",
                      "DATA_PUSHED_TO_FICO_SAP",
                      "CORRECTED",
                    ].includes(getValues("status")) && (
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<VisibilityIcon />}
                        onClick={() => {
                          setMethodology("GA")
                          localStorage.setItem(
                            "newspaperAgencyBillSubmissionId",
                            id
                          )
                          localStorage.setItem(
                            "pageMode",
                            router?.query?.pageMode
                          )
                          router.push(
                            "/newsRotationManagementSystem/transaction/newsPaperAgencybill/aadesh"
                          )
                        }}
                      >
                        {language == "en" ? "Print AADESH" : "आदेश प्रत काढा"}
                      </Button>
                    )}
                  </Grid>

                  <Grid item>
                    {/* {!viewBudgetProvision ? (
                      <>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setMethodology("GBP"),
                              setSaveChiPattiDisabled(false);
                          }}
                        >
                          {language == "en"
                            ? "Generate Budget Provision"
                            : "जनरेट बजेट प्रोविझन"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          variant="contained"
                          color="primary"
                          endIcon={
                            <VisibilityIcon style={{ color: "#556CD6" }} />
                          }
                          onClick={() => {
                            setMethodology("GBP");
                            setmodalforcalculation(true);
                          }}
                        >
                          {language == "en"
                            ? "VIEW BUDGET PROVISION"
                            : "बजेट प्रोविझन पहा"}
                        </IconButton>
                      </>
                    )} */}
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                  }}
                >
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingTop: "10px",
                    }}
                  >
                    {(authority?.includes("APPROVAL") ||
                      authority?.includes("FINAL_APPROVAL")) &&
                      router.query.pageMode == "PROCESS" && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                              setmodalforAprov(true)
                            }}
                          >
                            <FormattedLabel id="actions" />
                          </Button>
                        </>
                      )}

                    {((authority?.includes("ENTRY") &&
                      router?.query?.pageMode == "Edit" &&
                      getValues("status") == "BUDGET_PROVISION_GENERATED") ||
                      (authority?.includes("ENTRY") &&
                        router?.query?.pageMode == "Add" &&
                        getValues("status") ==
                          "BUDGET_PROVISION_GENERATED")) && (
                      <>
                        <Button
                          // style={{ justifyContent: "flex-end" }}
                          variant="contained"
                          type="submit"
                          color="success"
                          endIcon={<SaveIcon />}
                          onClick={() => {
                            setBtnSaveText("CREATE"), setMethodology("")
                          }}
                        >
                          <FormattedLabel
                            id={
                              typeof getValues("status") != "undefined" &&
                              getValues("status") == "REVERT_BACK_TO_DEPT_USER"
                                ? "update"
                                : "finalSubmit"
                            }
                          />
                        </Button>
                      </>
                    )}
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      // marginTop: "10px",
                    }}
                  >
                    {/* NEW BUTTON SAVE AS DRAFT ADDED */}
                    {authority?.includes("ENTRY") &&
                      ["Edit", "Add"].includes(router?.query?.pageMode) &&
                      (typeof getValues("status") == "undefined" ||
                        getValues("status") == "null" ||
                        getValues("status") == "DRAFTED" ||
                        getValues("status") == "REVERT_BACK_TO_DEPT_USER") && (
                        <Button
                          disabled={watch("prePaymentDetails")?.length == 0}
                          variant="contained"
                          size="small"
                          onClick={() => {
                            // let count = 0;
                            // getValues(`prePaymentDetails`).forEach(
                            //   (j) => j.totalNetAmount < 0 && count++
                            // );
                            // if (count == 0) {
                            //   setBtnSaveText("DRAFT");
                            //   setMethodology("");
                            // } else {
                            //   sweetAlert(
                            //     "Warning!",
                            //     language == "en"
                            //       ? "Total Payable Should Be Greater Than Zero"
                            //       : "एकूण रक्कम शून्यापेक्षा जास्त असावी",
                            //     "warning"
                            //   );
                            // }
                            setBtnSaveText("DRAFT")
                            setMethodology("GP")
                            handleSave(getValues())
                          }}
                          // type="submit"
                          // onClick={buttonValueSetFun}
                        >
                          {language == "en"
                            ? "Save As Draft"
                            : "ड्राफ्ट म्हणून सेव्ह करा"}
                        </Button>
                      )}
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      paddingTop: "10px",
                      // marginLeft: "1",
                    }}
                  >
                    {/* EXIT BUTTON  */}
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* {authority?.includes("ENTRY") &&
                      ["Edit", "Add"].includes(router?.query?.pageMode) &&
                      (typeof getValues("status") == "undefined" ||
                        getValues("status") == "null" ||
                        getValues("status") == "DRAFTED") && (
                        <Button
                          // sx={{ marginRight: 8 }}
                          type="submit"
                          variant="contained"
                          color="primary"
                          endIcon={<SaveIcon />}
                          onClick={() => {
                            setBtnSaveText("DRAFT");
                            setMethodology("");
                          }}
                        >
                          {language == "en"
                            ? "Save As Draft"
                            : "तात्पुरते जतन करा"}
                        </Button>
              )} */}

              <div className={styles.model}>
                <Modal
                  open={modalforcalculation}
                  onCancel={() => {
                    setmodalforcalculation(false)
                  }}
                >
                  <Paper
                    elevation={8}
                    variant="outlined"
                    sx={{
                      border: 1,
                      borderColor: "grey.500",
                      marginLeft: "100px",
                      marginRight: "100px",
                      marginTop: "50px",
                      marginBottom: "50px",
                      padding: 1,
                    }}
                  >
                    <>
                      <Grid
                        container
                        style={{
                          margin: "0.5vh",
                          display: "flex",
                          justifyContent: "space-between",
                          background:
                            "linear-gradient(90deg, rgba(149, 29, 240, 0.91) 2%, rgb(9, 104, 247) 100%)",
                          // height: "500px",
                        }}
                      >
                        <Grid item xs={11}>
                          <Typography
                            marginLeft={2}
                            variant="h6"
                            component="h2"
                            color="#f7f8fa"
                          >
                            {["GP", "GA"].includes(methodology)
                              ? methodology == "GP"
                                ? language == "en"
                                  ? "Prastav"
                                  : "प्रस्ताव"
                                : methodology == "GA" && language == "en"
                                ? "Aadesh"
                                : "आदेश"
                              : methodology == "GBP" && language == "en"
                              ? "Budget Provision"
                              : "अंदाज पत्रकीय तरतूद"}
                          </Typography>
                        </Grid>

                        <Grid item xs={1}>
                          <IconButton
                            variant="h6"
                            component="h2"
                            color="#f7f8fa"
                          >
                            <CloseIcon
                              color="#f7f8fa"
                              onClick={() => setmodalforcalculation(false)}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>

                      {["GA", "GBP"].includes(methodology) && (
                        <>
                          <Grid
                            container
                            style={{
                              display: "flex",
                              margin: "2vh",
                              justifyContent: "space-between",
                            }}
                          >
                            {methodology == "GA" && (
                              <>
                                <Grid item xs={6}>
                                  <Typography variant="h6" component="h2">
                                    {language == "en"
                                      ? "Lowest Published Standard Format Size is:-"
                                      : "किमान जाहिरात आकारमान:-"}
                                    {getValues("leastStandardFormatSize")}
                                    {language == "en" ? "Sq.cm" : "चौ.सेमी"}
                                  </Typography>
                                </Grid>
                              </>
                            )}

                            {methodology == "GBP" && (
                              <>
                                <Grid item xs={6}>
                                  <Typography variant="h6" component="h2">
                                    {language == "en"
                                      ? "Annual Budget Provision Amount:-"
                                      : "मुळ अंदाज पत्रकीय तरतूद:-"}
                                    {getValues(
                                      "budgetProvisionDaos.budgetProvisionValue"
                                    )}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="h6" component="h2">
                                    {language == "en"
                                      ? "Financial Year:-"
                                      : "महसूल वर्ष:-"}
                                    {language == "en"
                                      ? getValues("financialYearName")
                                      : getValues("financialYearNameMr")}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </>
                      )}

                      <DataGrid
                        hideFooter
                        getRowId={(row) => row.srNo}
                        columns={
                          (methodology == "GP" && columnsOfPrastav) ||
                          (methodology == "GA" && columnsOfAadesh) ||
                          (methodology == "GBP" && columnsOfBudgetBifercation)
                        }
                        rows={
                          (methodology == "GP" && prastavDtl) ||
                          (methodology == "GA" && aadeshDtl) ||
                          (methodology == "GBP" && budgetBifercation)
                        }
                        autoHeight
                      />

                      {/* GP */}
                      {methodology == "GP" && (
                        <>
                          <Paper
                            elevation={8}
                            variant="outlined"
                            sx={{
                              border: 1,
                              borderColor: "grey.500",
                              marginLeft: "10px",
                              marginRight: "10px",
                              marginTop: "10px",
                              // marginBottom: "60px",
                              padding: 1,
                            }}
                          >
                            <Grid container>
                              <Grid
                                item
                                xl={3}
                                lg={3}
                                md={4}
                                sm={6}
                                xs={12}
                                p={1}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "start",
                                }}
                              >
                                <TextField
                                  disabled
                                  id="standard-textarea"
                                  label={
                                    language == "en"
                                      ? "Total Amount"
                                      : "एकूण रक्कम"
                                  }
                                  {...register("preTotalAmount")}
                                  sx={{ width: 230 }}
                                  multiline
                                  variant="standard"
                                  error={!!errors.preTotalAmount}
                                  helperText={
                                    errors?.preTotalAmount
                                      ? errors.preTotalAmount.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xl={3}
                                lg={3}
                                md={4}
                                sm={6}
                                xs={12}
                                p={1}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "start",
                                }}
                              >
                                <TextField
                                  disabled
                                  id="standard-textarea"
                                  label={
                                    language == "en"
                                      ? "Total Penalty"
                                      : "एकूण दंड"
                                  }
                                  {...register("preTotalPenalty")}
                                  sx={{ width: 230 }}
                                  multiline
                                  variant="standard"
                                  error={!!errors.preTotalPenalty}
                                  helperText={
                                    errors?.preTotalPenalty
                                      ? errors.preTotalPenalty.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xl={3}
                                lg={3}
                                md={4}
                                sm={6}
                                xs={12}
                                p={1}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "start",
                                }}
                              >
                                <TextField
                                  disabled
                                  id="standard-textarea"
                                  label={
                                    language == "en"
                                      ? "Total TDS"
                                      : "एकूण टी.डी.एस"
                                  }
                                  {...register("preTotalTDS")}
                                  sx={{ width: 230 }}
                                  multiline
                                  variant="standard"
                                  error={!!errors.preTotalTDS}
                                  helperText={
                                    errors?.preTotalTDS
                                      ? errors.preTotalTDS.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xl={3}
                                lg={3}
                                md={4}
                                sm={6}
                                xs={12}
                                p={1}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "start",
                                }}
                              >
                                <TextField
                                  disabled
                                  id="standard-textarea"
                                  label={
                                    language == "en"
                                      ? "Total Net Amount"
                                      : "एकूण देय रक्कम"
                                  }
                                  {...register("preTotalNetAmount")}
                                  sx={{ width: 230 }}
                                  multiline
                                  variant="standard"
                                  error={!!errors.preTotalNetAmount}
                                  helperText={
                                    errors?.preTotalNetAmount
                                      ? errors.preTotalNetAmount.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Paper>
                        </>
                      )}
                      {/* GA */}
                      {methodology == "GA" && (
                        <>
                          <Paper
                            elevation={8}
                            variant="outlined"
                            sx={{
                              border: 1,
                              borderColor: "grey.500",
                              marginLeft: "10px",
                              marginRight: "10px",
                              marginTop: "10px",
                              // marginBottom: "60px",
                              padding: 1,
                            }}
                          >
                            <Grid container>
                              <Grid
                                item
                                xl={3}
                                lg={3}
                                md={4}
                                sm={6}
                                xs={12}
                                p={1}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "start",
                                }}
                              >
                                <TextField
                                  disabled
                                  id="standard-textarea"
                                  label={
                                    language == "en"
                                      ? "Total Amount"
                                      : "एकूण रक्कम"
                                  }
                                  {...register("totalAmount")}
                                  sx={{ width: 230 }}
                                  multiline
                                  variant="standard"
                                  error={!!errors.totalAmount}
                                  helperText={
                                    errors?.totalAmount
                                      ? errors.totalAmount.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xl={3}
                                lg={3}
                                md={4}
                                sm={6}
                                xs={12}
                                p={1}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "start",
                                }}
                              >
                                <TextField
                                  disabled
                                  id="standard-textarea"
                                  label={
                                    language == "en"
                                      ? "Total Penalty"
                                      : "एकूण दंड"
                                  }
                                  {...register("totalPenalty")}
                                  sx={{ width: 230 }}
                                  multiline
                                  variant="standard"
                                  error={!!errors.totalPenalty}
                                  helperText={
                                    errors?.totalPenalty
                                      ? errors.totalPenalty.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xl={3}
                                lg={3}
                                md={4}
                                sm={6}
                                xs={12}
                                p={1}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "start",
                                }}
                              >
                                <TextField
                                  disabled
                                  id="standard-textarea"
                                  label={
                                    language == "en"
                                      ? "Total TDS"
                                      : "एकूण टी.डी.एस"
                                  }
                                  {...register("totalTDS")}
                                  sx={{ width: 230 }}
                                  multiline
                                  variant="standard"
                                  error={!!errors.totalTDS}
                                  helperText={
                                    errors?.totalTDS
                                      ? errors.totalTDS.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xl={3}
                                lg={3}
                                md={4}
                                sm={6}
                                xs={12}
                                p={1}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "start",
                                }}
                              >
                                <TextField
                                  disabled
                                  id="standard-textarea"
                                  label={
                                    language == "en"
                                      ? "Total Net Amount"
                                      : "एकूण देय रक्कम"
                                  }
                                  // value={approvalId}
                                  {...register("totalNetAmount")}
                                  sx={{ width: 230 }}
                                  multiline
                                  variant="standard"
                                  error={!!errors.totalNetAmount}
                                  helperText={
                                    errors?.totalNetAmount
                                      ? errors.totalNetAmount.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Paper>
                        </>
                      )}
                    </>

                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 12,
                        xl: 12,
                      }}
                      style={{ marginTop: "1vh", justifyContent: "center" }}
                      columns={16}
                    >
                      <Grid
                        item
                        style={{ marginTop: "4vh" }}
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                      >
                        {(methodology == "GP" &&
                          [
                            "PRASTAV_GENERATED",
                            "AADESH_GENERATED",
                            "BUDGET_PROVISION_GENERATED",
                            "CREATED",
                            "DATA_PUSHED_TO_FICO_SAP",
                            "CORRECTED",
                          ].includes(getValues("status"))) ||
                        (methodology == "GA" &&
                          [
                            "AADESH_GENERATED",
                            "BUDGET_PROVISION_GENERATED",
                            "CREATED",
                            "DATA_PUSHED_TO_FICO_SAP",
                            "CORRECTED",
                          ].includes(getValues("status"))) ||
                        (methodology == "GBP" &&
                          [
                            "BUDGET_PROVISION_GENERATED",
                            "CREATED",
                            "DATA_PUSHED_TO_FICO_SAP",
                            "CORRECTED",
                          ].includes(getValues("status"))) ? (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => setmodalforcalculation(false)}
                            >
                              {language == "en" ? "OK" : "ओके"}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              endIcon={<SaveIcon />}
                              onClick={() => handleSave(getValues())}
                            >
                              {<FormattedLabel id="save" />}
                            </Button>
                          </>
                        )}
                      </Grid>

                      <Grid
                        item
                        style={{ marginTop: "4vh" }}
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                      >
                        <Button
                          variant="contained"
                          onClick={() => {
                            swal({
                              title:
                                language === "en" ? "Exit?" : "बाहेर पडायचे?",
                              text:
                                language === "en"
                                  ? "Are you sure you want to exit this Record ? "
                                  : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?",
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                swal(
                                  language === "en"
                                    ? "Record is Successfully Exit!"
                                    : "रेकॉर्ड यशस्वीरित्या बाहेर पडा",
                                  {
                                    icon: "success",
                                  }
                                )
                                setmodalforcalculation(false)
                              } else {
                                swal(
                                  language === "en"
                                    ? "Record is Safe"
                                    : "रेकॉर्ड सुरक्षित आहे"
                                )
                              }
                            })
                          }}
                        >
                          <FormattedLabel id="exit" />
                          {/* exit */}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Modal>
              </div>

              {/* Approve/Rejection modal */}
              {/* <div className={styles.model}> */}
              <Modal
                open={modalforAprov}
                //onClose={clerkApproved}
                onCancel={() => {
                  setmodalforAprov(false)
                }}
                // autoHeight
              >
                <div
                  className={styles.boxRemark}
                  style={{ minHeight: "300px", overflowY: "scroll" }}
                >
                  <div className={styles.titlemodelremarkAprove}>
                    <Typography
                      className={styles.titleOne}
                      variant="h6"
                      component="h2"
                      color="#f7f8fa"
                      style={{ marginLeft: "25px" }}
                    >
                      <FormattedLabel id="remarkModel" />
                    </Typography>
                    <IconButton>
                      <CloseIcon
                        onClick={
                          () =>
                            setmodalforAprov(
                              false
                            ) /* router.push(`/newsRotationManagementSystem/transaction/newsPaperAgencybill`) */
                        }
                      />
                      <VisibilityIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </div>
                  <Grid
                    container
                    spacing={1}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      // marginLeft: "120px",
                    }}
                  >
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                        // marginLeft: "120px",
                      }}
                    >
                      <TextField
                        id="standard-textarea"
                        label={language == "en" ? "Outward No" : "जावक क्रमांक"}
                        sx={{ width: 300 }}
                        variant="standard"
                        {...register("outwardNo")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                        // marginLeft: "120px",
                      }}
                    >
                      <Controller
                        control={control}
                        name="outwardDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              // disabled
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {language == "en"
                                    ? "Outward Date"
                                    : "जावक दिनांक"}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  // sx={{ width: 300 }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <div
                    className={styles.btndate}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={4}
                      placeholder="Enter a Remarks"
                      style={{ width: 700 }}
                      // onChange={(e) => {
                      //   setRemark(e.target.value)
                      // }}
                      // name="remark"
                      {...register("remark")}
                    />
                  </div>

                  <div
                    className={styles.btnappr}
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      margin: "20px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      endIcon={<ThumbUpIcon />}
                      onClick={async () => {
                        remarks("APPROVE")
                        // setBtnSaveText('APPROVED')
                        // alert(serviceId)

                        {
                          router.push(
                            `/newsRotationManagementSystem/transaction/newsPaperAgencybill`
                          )
                        }
                      }}
                    >
                      <FormattedLabel id="APPROVE" />
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<UndoIcon />}
                      onClick={() => {
                        remarks("REASSIGN")

                        // alert(serviceId, 'REASSIGN')
                        // router.push(`/newsRotationManagementSystem/transaction/newsPaperAgencybill`);
                      }}
                    >
                      <FormattedLabel id="REASSIGN" />
                    </Button>
                    {router.query.role == "FINAL_APPROVAL" ? (
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ReportIcon />}
                        onClick={() => {
                          remarks("REJECT")
                        }}
                      >
                        <FormattedLabel id="reject" />
                      </Button>
                    ) : (
                      ""
                    )}
                    <Button
                      variant="contained"
                      endIcon={<CloseIcon />}
                      color="error"
                      onClick={() => {
                        // swal({
                        //     title: "Exit?",
                        //     text: "Are you sure you want to Close the window ? ",
                        //     icon: "warning",
                        //     buttons: true,
                        //     dangerMode: true,
                        // }).then((willDelete) => {
                        //     if (willDelete) {
                        //         swal("Modal Closed!", {
                        //             icon: "success",
                        //         });
                        setmodalforAprov(false)
                        //         // router.push(`/newsRotationManagementSystem/transaction/newsPaperAgencybill`);
                        //     } else {
                        //         swal("Modal Closed");
                        //     }
                        // });
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </div>
                </div>
              </Modal>
              {/* </div> */}
            </form>
          </FormProvider>
        </Box>
      </Paper>
    </>
  )
}

export default Index
