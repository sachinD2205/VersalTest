import { yupResolver } from "@hookform/resolvers/yup"
import CloseIcon from "@mui/icons-material/Close"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import ForwardIcon from "@mui/icons-material/Forward"
import NextPlanIcon from "@mui/icons-material/NextPlan"
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined"
import SaveIcon from "@mui/icons-material/Save"
import SendIcon from "@mui/icons-material/Send"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import UndoIcon from "@mui/icons-material/Undo"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import LoadingButton from "@mui/lab/LoadingButton"
import Loader from "../../../../containers/Layout/components/Loader"

import {
  Box,
  Button,
  Checkbox,
  FormControl,
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
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import sweetAlert from "sweetalert"
import urls from "../../../../URLS/urls"
import styles from "../../../../styles/newsRotationManagementSystem/[newMarriageRegistration]view.module.css"

import html2pdf from "html2pdf-jspdf2"
import { useReactToPrint } from "react-to-print"
import swal from "sweetalert"
import UploadButtonOP from "../../../../components/newsRotationManagementSystem/FileUpload/DocumentsUploadOP"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import schema from "../../../../containers/schema/newsRotationManagementSystem/transactions/newsAdvertisementRotation"
import ComponentToPrint from "../releasingOrder/ReleasingOrderComp"
import HistoryComponent from "../../../../components/newsRotationManagementSystem/HistoryComponent"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const [checked, setChecked] = useState(false)
  const [dataValidation, setDataValidation] = useState(schema(checked))
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
    defaultValues: {
      newsPapersLst: [],
      checked: false,
    },
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = methods

  useEffect(() => {
    console.log("errors", errors)
  }, [errors])

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  const [newsPaperLevelDisabled, setNewsPaperLevelDisabled] = useState(false)
  const [modalforAprov, setmodalforAprov] = useState(false)
  const [modalforAprov2, setmodalforAprov2] = useState(false)
  const [entryFieldsDisabled, setEntryFieldsDisabled] = useState(false)
  const language = useSelector((state) => state.labels.language)
  const token = useSelector((state) => state.user.user.token)
  const router = useRouter()
  const [releasingOrder, setReleasingOrder] = useState(null)
  const [releasingOrderNumber, setReleasingOrderNumber] = useState(null)
  const [advertisementTypes, setadvertisementTypes] = useState([
    // { id: 1, name: "Corrigendum", nameMr: "शुद्धीपत्र" },
    // { id: 2, name: "New Tender", nameMr: "नवीन निविदा" },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const [financialYears, setFinancialYears] = useState([])
  const [selectedYearId, setSelectedYearId] = useState("")
  const [previousRotationNumbers, setPreviousRotationNumbers] = useState([])
  const [newsTypss, setNewsTypss] = useState([])
  const [department, setDepartment] = useState([])
  const [btnSaveText, setBtnSaveText] = useState()
  const [rotationGroup, setRotationGroup] = useState([])
  const [rotationGroupId, setRotationGroupId] = useState("")
  const [rotationSubGroup, setRotationSubGroup] = useState([])
  const [levels, setLevels] = useState([])
  const [newsPaperOriginal, setNewsPaperOriginal] = useState([])
  const [selectedNewsPapers, setSelectedNewsPapers] = useState([])
  const [
    generateReleasingOrderButtonDisabled,
    setGenerateReleasingOrderButtonDisabled,
  ] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [selectedSubGroupId, setSelectedSubGroupId] = useState(null)
  const [selectedNewsPaperLevel, setSelectedNewsPaperLevel] = useState(null)
  const [data, setData] = useState()
  const [showDeleteButton, setShowDeleteButton] = useState(true)
  const [showSaveAsDraftButton, setShowSaveAsDraftButton] = useState(true)
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
  const componentRef = useRef()
  let appName = "NRMS"
  let serviceName = "N-NPR"
  let serviceId = (serviceId = user?.menus?.find(
    (m) => m?.id == selectedMenuFromDrawer
  )?.serviceId)
  const user = useSelector((state) => state.user.user)
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  )
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer
  })?.roles
  // console.log("user", user);
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer)
  console.log("authority", authority)
  const [zones, setZones] = useState([])

  const getAllEditTableData = async (id) => {
    setIsLoading(true)
    await axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        reset(r.data)
        setData(r.data)
        setShowDeleteButton(
          r?.data?.status == "DRAFTED" ||
            r?.data?.status ==
              "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_FINAL_AUTHORITY" ||
            r?.data?.status == "REVERT_BACK_TO_CONCERN_DEPT_USER"
            ? true
            : false
        )

        setShowSaveAsDraftButton(
          r?.data?.status ==
            "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_FINAL_AUTHORITY" ||
            r?.data?.status == "REVERT_BACK_TO_CONCERN_DEPT_USER" ||
            r?.data?.status == "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_NRMS_CLERK"
            ? false
            : true
        )

        // setShowDeleteButton(r?.data?.status == "DRAFTED" ? true : false);
        setChecked(
          r?.data?.isSpecialNotice != null ? r?.data?.isSpecialNotice : false
        )
        setSelectedYearId(r.data.financialYear)
        console.log("aalaaaaaaaa", r?.data)
        if (
          r?.data?.rotationGroupKey != null &&
          r?.data?.rotationSubGroupKey != null &&
          r?.data?.newsPaperLevel != null
        ) {
          setSelectedGroupId(r?.data?.rotationGroupKey)
          setSelectedSubGroupId(r?.data?.rotationSubGroupKey)
          setSelectedNewsPaperLevel(r?.data?.newsPaperLevel)
          // setSelectedNewsPaperLevel(3);
          getRotationSubGroup(r?.data?.rotationGroupKey)
          getNewsPaperLevel(r?.data?.newsPaperLevel)
          getNewsPaperOriginal(
            r?.data?.rotationGroupKey,
            r?.data?.rotationSubGroupKey,
            r?.data?.newsPaperLevel
          )

          // getLevel(r?.data?.rotationGroupKey, r?.data?.rotationSubGroupKey);
          // getStandardFormatSize(
          //   r?.data?.rotationGroupKey,
          //   r?.data?.rotationSubGroupKey,
          //   r?.data?.newsPaperLevel
          // );
        }

        console.log("isSpecialNotice", r?.data?.isSpecialNotice)
        if (r?.data?.isSpecialNotice) {
          setValue("rotationGroupKey", 5)
          setValue("rotationSubGroupKey", 2)
          setRotationGroupId(5)
          setSelectedGroupId(5)
          setSelectedSubGroupId(2)
          console.log("GroupKey:", getValues("rotationGroupKey"))
          handleRotationGroupChange(5)
        } else {
          setRotationGroupId(r?.data?.rotationGroupKey)
        }

        setIsLoading(false)

        // setSelectedNewsPapers(.filter((e) => nps.includes(e.id)).map((ee) => ee.newspaperName));
        // console.log("newsPapersssss", newsPapers);
        // let nps = r?.data?.newsPapers?.split(",");
        // console.log("newsPaperAllll", newsPaperAll);
        // if (r?.data?.attachments != null) {
        //   let flag = false;
        //   if (authority?.includes("ENTRY") && (r?.data?.status == "DRAFTED" || r?.data?.status == "null")) {
        //     flag = true;
        //   } else {
        //     flag = false;
        //   }

        //   setAuthorizedToUpload(flag);
        //   console.log("flag++++", flag);

        //   setFinalFiles(
        //     r?.data?.attachments.map((r, i) => {
        //       return {
        //         ...r,
        //         srNo: i + 1,
        //       };
        //     }),
        //   );
        // }
      })
      .catch((error) => {
        setIsLoading(false)
        callCatchMethod(error, language)
      })
  }
  // ------------------------------------------------------------------

  // get Zone Name
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setZones(res.data.zone)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  // get advertisementTypes
  const getadvertisementType = () => {
    axios
      .get(`${urls.NRMS}/advertisementType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setadvertisementTypes(res.data.advertisementType)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  const getFinancialYears = () => {
    axios
      .get(`${urls.CFCURL}/master/financialYearMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setFinancialYears(
          res?.data?.financialYear?.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  const getByDepartmentId = () => {
    let department =
      getValues("department") != "undefined" &&
      getValues("department") != null &&
      getValues("department") != ""
        ? getValues("department")
        : user?.userDao?.department
    console.log("the department is ", department)
    axios
      .get(
        `${urls.NRMS}/trnNewsPublishRequest/getByDepartmentId?departmentId=${department}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setPreviousRotationNumbers(res.data)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  // get typeofnews
  const getnewsType = () => {
    axios
      .get(`${urls.NRMS}/newsType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setNewsTypss(res.data.newsType)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

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

  const getNewsPaperLevel = (value) => {
    axios
      .get(`${urls.NRMS}/newsPaperLevel/getByRotationGroup?groupId=${value}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setLevels(res?.data)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  const getRotationGroup = () => {
    axios
      .get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log(
          "a:a",
          r.data.newspaperRotationGroupMasterList.map((row) => ({
            rotationGroupKey: row.rotationGroupKey,
          }))
        )
        setRotationGroup(
          r.data.newspaperRotationGroupMasterList.map((row) => ({
            id: row.id,
            rotationGroupName: row.rotationGroupName,
            rotationGroupNameMr: row.rotationGroupNameMr,
            groupId: row.groupId,
            rotationGroupKey: row.rotationGroupKey,
          }))
        )
        // console.log("res.data", r.data);
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  const getNewsPaperOriginal = async (
    selectedGroupId,
    selectedSubGroupId,
    value
  ) => {
    await axios
      .get(
        `${urls.NRMS}/newspaperMaster/getNewsPaperByNewsPaperLevelAndMuchMore?groupId=${selectedGroupId}&subGroupId=${selectedSubGroupId}&newsPaperLevel=${value}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((r) => {
        setNewsPaperOriginal(r.data)
        if (checked) {
          setSelectedNewsPapers([])
        } else {
          setSelectedNewsPapers(r?.data?.map((ee) => ee.newspaperNameMr))
        }
        return r.data
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
    // console.log("aala re", temp);
    // return temp
  }

  const handleRotationGroupChange = (value) => {
    setSelectedGroupId(value)
    getRotationSubGroup(value)
    getNewsPaperLevel(value)
  }

  const handleRotationSubGroupChange = (value) => {
    if (watch("rotationGroupKey") == 5) {
      setSelectedSubGroupId(2)
    } else {
      setSelectedSubGroupId(value)
    }
  }

  const handleNewsPaperLevelChange = (value) => {
    setSelectedNewsPaperLevel(value)
  }

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
    }

    console.log("serviceId**-", serviceId)
    setIsLoading(true)

    await axios
      .post(`${urls.NRMS}/trnNewsPublishRequest/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: `${selectedMenuFromDrawer}`,
        },
      })
      .then((response) => {
        setIsLoading(false)
        if (response.status === 201) {
          swal(
            language === "en" ? "Saved!" : "जतन केले!",
            language === "en"
              ? "Record Saved successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन केले",
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          )
          // router.back();

          router.push(
            `/newsRotationManagementSystem/transaction/newsAdvertisementRotation`
          )
        }
      })
      .catch((err) => {
        setIsLoading(false)
        callCatchMethod(error, language)
      })
  }

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  // const printHandler = () => {
  //   let opt = {
  //     margin: 1,
  //     filename: "final-bill.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2, useCORS: true },
  //     jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
  //   };

  //   const element = ReactDOMServer.renderToString(
  //     <ComponentToPrint
  //       selectedObject={{ ...data, language }}
  //       ref={componentRef}
  //     />
  //   );
  //   // console.log("ggggggg", html2pdf().set(opt).from(element));
  //   let base64str;
  //   html2pdf()
  //     .from(element)
  //     .toPdf()
  //     .set(opt)
  //     .output("datauristring")
  //     .then(function (pdfAsString) {
  //       // The PDF has been converted to a Data URI string and passed to this function.
  //       // Use pdfAsString however you like (send as email, etc)! For instance:
  //       console.log("pdfAsString", pdfAsString);
  //       var file = dataURLtoFile(pdfAsString, "final-bill.pdf");
  //       console.log(file);
  //       let formData = new FormData();
  //       formData.append("file", file);
  //       formData.append("appName", "NRMS");
  //       formData.append("serviceName", "N-BS");
  //       formData.append("fileName", "bill.pdf");
  //       axios.post(`${urls.CFCURL}/file/upload`, formData).then((r) => {
  //         setReleasingOrder(r.data.filePath);
  //         console.log("pathhhh", r.data.filePath);
  //         setValue("releasingOrder", r.data.filePath);
  //         return r.data.filePath;
  //       });
  //     });
  //   // .save();
  // };

  const pdfOptions = {
    margin: 10,
    filename: "output.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  }

  function blobToFile(blob, fileName) {
    const file = new File([blob], fileName, { type: blob.type })
    return file
  }

  const generateReleasingOrderNumberFromServer = async () => {
    if (getValues("financialYear")) {
      const res = await axios.get(
        `${
          urls.NRMS
        }/trnNewsPublishRequest/getRoNumber?financialYear=${getValues(
          "financialYear"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setValue("releasingOrderNumber", res.data)
      setReleasingOrderNumber(res.data)
    }
  }

  const saveToServer = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `AAA.pdf`,
    copyStyles: true,
    print: async (printIframe) => {
      const document = printIframe.contentDocument
      if (document) {
        const html = document.getElementsByTagName("html")[0]
        console.log(html)
        try {
          let worker = await html2pdf()
            .set(pdfOptions)
            .from(html)
            .toPdf()
            .output("blob")
            .then((data) => {
              return data
            })
          console.log("gggg::", worker)
          var file = blobToFile(worker, "releasing_order.pdf")
          console.log("file::", file)
          let formData = new FormData()
          formData.append("file", file)
          formData.append("appName", "NRMS")
          formData.append("serviceName", "N-BS")
          formData.append("fileName", "bill.pdf")
          axios
            .post(
              `${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            )
            .then((r) => {
              console.log("pathhhh", r.data.filePath)
              setReleasingOrder(r.data.filePath)
              console.log("pathhhh", r.data.filePath)
              setValue("releasingOrder", r.data.filePath)
              return r.data.filePath
            })
            .catch((error) => {
              callCatchMethod(error, language)
            })
        } catch (error) {
          console.log("error", error)
        }
      }
    },
  })

  // const pdfOptions = {
  //   margin: 10,
  //   filename: "output.pdf",
  //   image: { type: "jpeg", quality: 1 },
  //   html2canvas: { scale: 2, useCORS: true },
  //   jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  // };

  // const printHandler = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: `AAA.pdf`,
  //   copyStyles: true,
  //   print: async (printIframe) => {
  //     const document = printIframe.contentDocument;
  //     if (document) {
  //       const html = document.getElementsByTagName("html")[0];
  //       console.log(html);
  //       await html2pdf()
  //         .from(html)
  //         .set(pdfOptions)
  //         .then(function (pdfAsString) {
  //           // The PDF has been converted to a Data URI string and passed to this function.
  //           // Use pdfAsString however you like (send as email, etc)! For instance:
  //           console.log("pdfAsString", pdfAsString);
  //           var file = dataURLtoFile(pdfAsString, "final-bill.pdf");
  //           console.log(file);
  //           let formData = new FormData();
  //           formData.append("file", file);
  //           formData.append("appName", "NRMS");
  //           formData.append("serviceName", "N-BS");
  //           formData.append("fileName", "bill.pdf");
  //           axios.post(`${urls.CFCURL}/file/upload`, formData).then((r) => {
  //             setReleasingOrder(r.data.filePath);
  //             console.log("pathhhh", r.data.filePath);
  //             setValue("releasingOrder", r.data.filePath);
  //             return r.data.filePath;
  //           });
  //         });
  //       // .save()
  //     }
  //   },
  // });

  useEffect(() => {
    console.log("isLoading", isLoading)
  }, [isLoading])

  const releasingOrderGeneration = () => {
    // let releasingOrder=handlePrint;
    // let releasingOrder = printHandler();
    setLoading(true)
    console.log("releasingOrder:-->", releasingOrder)
    let applicationId
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId
    } else if (router?.query?.id) {
      applicationId = router?.query?.id
    }
    let nps = newsPaperOriginal
      .filter((r) => selectedNewsPapers?.includes(r.newspaperNameMr))
      .map((r) => r.id)
    let stringggg = nps.toString()
    console.log("nps.toString()", stringggg)
    console.log(
      "appid",
      applicationId,
      router?.query?.applicationId,
      router?.query?.id
    )
    console.log("serviceId**-", serviceId)
    const generateRO = {
      id: applicationId,
      // rotationGroupKey: getValues("rotationGroupKey"),
      rotationGroupKey: rotationGroupId ? rotationGroupId : null,
      // rotationSubGroupKey: getValues("rotationSubGroupKey"),
      rotationSubGroupKey: watch("rotationSubGroupKey"),
      newsPaperLevel: getValues("newsPaperLevel"),
      newsPapers: stringggg,
      standardFormatSizeNM: getValues("standardFormatSizeNM"),
      releasingOrder: releasingOrder,
      releasingOrderNumber: getValues("releasingOrderNumber"),
      approveRemark: "Approved",
      // newsPapers: getValues("newsPapers"),
      // standardFormatSize: getValues("standardFormatSize"),
    }

    console.log(":a1", generateRO)

    axios
      .post(`${urls.NRMS}/trnNewsPublishRequest/save`, generateRO, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: `${selectedMenuFromDrawer}`,
        },
      })
      .then((response) => {
        setIsLoading(false)
        if (response.status === 201) {
          router.push({
            pathname:
              "/newsRotationManagementSystem/transaction/releasingOrder/news",
            query: {
              pageMode: "View",
              id: applicationId,
              rotationGroupKey: rotationGroupId ? rotationGroupId : null,
              rotationSubGroupKey: selectedSubGroupId,
              newsPaperLevel: getValues("newsPaperLevel"),
              newsPapers: stringggg,
              standardFormatSizeNM: getValues("standardFormatSizeNM"),
              releasingOrder: releasingOrder,
              releasingOrderNumber: getValues("releasingOrderNumber"),
            },
          })
          // console.log("NRMS: success ", watch("releasingOrderNumber"));
        }
      })
      .catch((error) => {
        setIsLoading(false)
        callCatchMethod(error, language)
      })
    setLoading(false)
  }
  // console.log(
  //   "NRMS: trnNewsPublishRequestHistory 2",
  //   watch("trnNewsPublishRequestHistory")
  // );
  // --------------------------------------------------------------------------------------
  const sendNewsToPublish = async () => {
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

    console.log("serviceId**-", serviceId)

    const generateRO = {
      id: Number(applicationId),
      status: "FINAL_APPROVED",
    }
    setIsLoading(true)

    await axios
      .post(`${urls.NRMS}/trnNewsPublishRequest/save`, generateRO, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: `${selectedMenuFromDrawer}`,
        },
      })
      .then((response) => {
        setIsLoading(false)
        if (response.status === 201) {
          swal(
            language === "en"
              ? "Successfully Done!"
              : "यशस्वीरित्या पूर्ण झाले",
            language === "en"
              ? "SENT TO NEWS AGENCIES FOR PUBLISHMENT  !"
              : "वृत्तसंस्थांना प्रकाशनासाठी पाठवले",
            "success"
          )
          // router.back();
          router.push(
            `/newsRotationManagementSystem/transaction/newsAdvertisementRotation`
          )
        }
      })
      .catch((error) => {
        setIsLoading(false)
        callCatchMethod(error, language)
      })
  }

  const getRotationSubGroup = (value) => {
    axios
      .get(
        `${urls.NRMS}/newspaperRotationSubGroupMaster/getByGroupId?groupId=${value}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((r) => {
        setRotationSubGroup(r?.data?.newspaperRotationSubGroupMasterList)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    if (rotationSubGroup && router?.query?.pageMode == "PROCESS") {
      setValue("rotationSubGroupKey", rotationSubGroup[0]?.id)
    }
  }, [rotationSubGroup])

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    // router.back();

    router.push({
      pathname:
        "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/",
      // query: {
      //   pageMode: "View",
      // },
    })
  }

  const resetValuesCancell = {
    wardName: "",
    department: "",
    advertisementType: "",
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
    department: "",
    advertisementType: "",
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

  // const _columns = [
  //   {
  //     headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
  //     field: "srNo",
  //     flex: 0.2,
  //     //   width: 100,
  //     // flex: 1,
  //   },
  //   {
  //     headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
  //     field: "fileName",
  //     // File: "originalFileName",
  //     // width: 300,
  //     flex: 1,
  //   },
  //   {
  //     headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
  //     field: "extension",
  //     flex: 1,
  //     // width: 140,
  //   },
  //   language == "en"
  //     ? {
  //         headerName: "Uploaded By",
  //         field: "attachedNameEn",
  //         flex: 2,
  //         // width: 300,
  //       }
  //     : {
  //         headerName: "द्वारे अपलोड केले",
  //         field: "attachedNameMr",
  //         flex: 2,
  //         // width: 300,
  //       },
  //   {
  //     headerName: `${language == "en" ? "Action" : "क्रिया"}`,
  //     field: "Action",
  //     flex: 1,
  //     // width: 200,

  //     renderCell: (record) => {
  //       return (
  //         <>
  //           <IconButton
  //             color="primary"
  //             onClick={() => {
  //               window.open(
  //                 `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
  //                 "_blank"
  //               );
  //             }}
  //           >
  //             <VisibilityIcon />
  //           </IconButton>
  //         </>
  //       );
  //     },
  //   },
  // ];

  // const getStandardFormatSize = (
  //   selectedGroupId,
  //   selectedSubGroupId,
  //   selectedNewsPaperLevel
  // ) => {
  //   axios
  //     .get(
  //       `${urls.NRMS}/newsStandardFormatSizeMst/getAllByFilters?groupId=${selectedGroupId}&subGroupId=${selectedSubGroupId}&newsPaperLevel=${selectedNewsPaperLevel}`
  //     )
  //     .then((r) => {
  //       setStandardFormatSize(r?.data);
  //     });
  // };

  // get level
  // const getLevel = (selectedGroupId, value) => {
  //   axios
  //     .get(
  //       `${urls.NRMS}/newsPaperLevel/getByRotationSubGroup?groupId=${selectedGroupId}&subGroupId=${value}`
  //     )
  //     .then((res) => {
  //       console.log("res.data1npl", res.data);
  //       setLevels(res.data);
  //     });
  // };

  // const getZone = () => {
  //   axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
  //     setZone(res.data.zone);
  //     console.log("getZone.data", res.data);
  //   });
  // };

  // const getNewsPaperAll = () => {
  //   axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
  //     setNewsPaperAll(r?.data?.newspaperMasterList);
  //   });
  // };
  // const cancellButton = () => {
  //   reset({
  //     ...resetValuesCancell,
  //     // id,
  //   });
  // };

  //view application remarks

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    console.log("callllll", value)
    // setSelectedNewsPaper(event.target.value);
    setSelectedNewsPapers(typeof value === "string" ? value.split(",") : value)
  }

  // useEffect(() => {
  // if (router?.query?.id && router?.query?.pageMode != null) {
  //   getAllEditTableData(router.query.id);
  // } else {
  //   if (authority?.includes("ENTRY")) {
  //     setAuthorizedToUpload(true);
  //   }
  // }
  // }, [router.query.id]);

  // useEffect(() => {
  //   console.log("checked", checked);
  // }, [checked]);

  // useEffect(() => {
  //   getNewsPaperAll();
  // }, []);
  // useEffect(() => {
  //   setFinalFiles([...mainFiles, ...additionalFiles]);
  // }, [mainFiles, additionalFiles]);

  useEffect(() => {
    getZone()
    // getWard();
    getDepartment()
    getRotationGroup()
    getadvertisementType()
    getFinancialYears()
    getnewsType()

    if (router?.query?.pageMode == "PROCESS") {
      setEntryFieldsDisabled(true)
    }
  }, [])

  useEffect(() => {
    if (showDeleteButton) {
      console.log(":a3", showDeleteButton)
    }
  }, [showDeleteButton])

  useEffect(() => {
    if (!router?.query?.pageMode) {
      setValue("department", user?.userDao?.department)
    }
  }, [user])

  useEffect(() => {
    if (router?.query?.id) {
      // getZone()
      // // getWard();

      // getDepartment()
      // getRotationGroup()
      // getadvertisementType()
      // getFinancialYears()
      // getnewsType()

      if (router?.query?.id && router?.query?.pageMode != null) {
        getAllEditTableData(router.query.id)
      } else {
        // if (authority?.includes("ENTRY")) {
        //   // setAuthorizedToUpload(true);
        // }
      }

      if (router?.query?.pageMode == "PROCESS") {
        setEntryFieldsDisabled(true)
      }
    }
  }, [router.query])

  useEffect(() => {
    if (
      getValues("status") == "APPROVED" &&
      getValues("releasingOrder") == null
    ) {
      let subGroup = rotationSubGroup
        .filter((ff) => ff.curentRotationSubGroup)
        .map((ff) => ff.id)
      console.log("subGroup+:+", subGroup[0])
      console.log("getValuesStatus", getValues("status"))
      // setValue("rotationSubGroupKey", subGroup[0])
      handleRotationSubGroupChange(subGroup[0])
    }
  }, [rotationSubGroup])

  useEffect(() => {
    if (levels?.length >= 1) {
      setValue("newsPaperLevel", levels[0]?.id)
      handleNewsPaperLevelChange(levels[0]?.id)
      // setSelectedNewsPaperLevel(levels[0]?.id);
      setNewsPaperLevelDisabled(true)
    } else {
      setNewsPaperLevelDisabled(false)
      setValue("newsPaperLevel", null)
    }
  }, [levels])

  useEffect(() => {
    if (releasingOrderNumber !== null) {
      saveToServer()
    }
  }, [releasingOrderNumber])

  useEffect(() => {
    if (releasingOrder && releasingOrder != null) {
      releasingOrderGeneration()
    }
  }, [releasingOrder])

  useEffect(() => {
    if (newsPaperOriginal.length > 0 && getValues("newsPapers")) {
      let nps = getValues("newsPapers")
      let _newsPapres = getValues("newspapersLst")?.map(
        (d) => d?.newspaperAgencyNameMr
      )
      // setSelectedNewsPapers(
      //   newsPaperOriginal
      //     .filter((e) => nps.includes(e.id))
      //     .map((ee) => ee.newspaperNameMr)
      // );
      setSelectedNewsPapers(_newsPapres ? _newsPapres : [])
    }
  }, [newsPaperOriginal])

  useEffect(() => {
    if (
      authority?.includes("RELEASING_ORDER_ENTRY") &&
      watch("status") == "APPROVED" &&
      watch("rotationSubGroupKey") &&
      selectedNewsPaperLevel != null
    ) {
      getNewsPaperOriginal(
        watch("rotationGroupKey"),
        watch("rotationSubGroupKey"),
        selectedNewsPaperLevel
      )
    }
  }, [
    watch("rotationGroupKey"),
    watch("rotationSubGroupKey"),
    selectedSubGroupId,
    selectedNewsPaperLevel,
  ])
  // PREVIOUS CODE
  // useEffect(() => {
  //   if (
  //     authority?.includes("RELEASING_ORDER_ENTRY") &&
  //     watch("status") == "APPROVED" &&
  //     selectedSubGroupId != null &&
  //     selectedNewsPaperLevel != null
  //   ) {
  //     getNewsPaperOriginal(
  //       selectedGroupId,
  //       selectedSubGroupId,
  //       selectedNewsPaperLevel
  //     )
  //     // getStandardFormatSize(
  //     //   selectedGroupId,
  //     //   selectedSubGroupId,
  //     //   selectedNewsPaperLevel
  //     // );
  //   }
  // }, [selectedSubGroupId, selectedNewsPaperLevel])

  useEffect(() => {
    console.log("selectedNewsPapers", selectedNewsPapers)
    if (selectedNewsPapers?.length > 0) {
      let flag = false
      console.log("flag=false", flag)
      setGenerateReleasingOrderButtonDisabled(flag)
    }
  }, [selectedNewsPapers])

  useEffect(() => {
    if (watch("advertisementType") == 2) {
      getByDepartmentId()
    }
  }, [watch("advertisementType")])

  function getCurrentFinancialYear() {
    const today = new Date()
    const currentMonth = today.getMonth() + 1 // Adding 1 because getMonth() returns zero-based month

    let startYear, endYear
    if (currentMonth >= 4) {
      // Financial year starts from April
      startYear = today.getFullYear()
      endYear = startYear + 1
    } else {
      // Financial year starts from the previous year's April
      startYear = today.getFullYear() - 1
      endYear = startYear + 1
    }

    const financialYear = `${startYear}-${endYear.toString().slice(-2)}`

    return financialYear
  }

  // Get the current financial year when the component mounts
  useEffect(() => {
    if (financialYears?.length !== 0) {
      // console.log(
      //   ":a3",
      //   financialYears?.find((obj) => {
      //     return obj.financialYearEn == getFinancialYear() && obj?.id
      //   })?.id
      // )

      // Find the ID of the current financial year
      const currentYear = getCurrentFinancialYear()
      const currentYearData = financialYears.find(
        (item) => item.financialYearEn === currentYear
      )
      if (!router?.query?.pageMode && currentYearData) {
        setValue("financialYear", currentYearData.id)
        setSelectedYearId(currentYearData.id)
      }
    }
  }, [financialYears])

  // Function to handle dropdown value change
  const handleDropdownChange = (e) => {
    setSelectedYearId(e.target.value)
  }

  useEffect(() => {
    console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ", getValues("status"))
    if (
      !checked &&
      // getValues("status") !== "RELEASING_ORDER_GENERATED" &&
      // getValues("status") !== "FINAL_APPROVED"
      getValues("status") === "APPROVED"
    ) {
      if (watch("typeOfNews")) {
        switch (watch("typeOfNews")) {
          case 3:
            setRotationGroupId(3)
            setValue("rotationGroupKey", 3)
            handleRotationGroupChange(3)
            break
          case 2:
            setRotationGroupId(2)
            setValue("rotationGroupKey", 2)
            handleRotationGroupChange(2)
            break
          case 1:
            const num = watch("workCost")
            if (num && num <= 20000000) {
              setRotationGroupId(1)
              setValue("rotationGroupKey", 1)
              handleRotationGroupChange(1)
            } else if (num && num > 20000000 && num <= 70000000) {
              setRotationGroupId(2)
              setValue("rotationGroupKey", 2)
              handleRotationGroupChange(2)
            } else if (num && num > 70000000) {
              setRotationGroupId(4)
              setValue("rotationGroupKey", 4)
              handleRotationGroupChange(4)
            }
            break
          default:
            break
        }
      }
      // setRotationGroupId()
    }
  }, [watch("typeOfNews")])

  const onSubmitForm = (formData) => {
    console.log("btnSaveText++", btnSaveText)
    // Save - DB
    let _body = {
      ...formData,
      // attachments: finalFiles,
      financialYear: selectedYearId,
      activeFlag: formData.activeFlag,
      newsPublishDate: watch("newsPublishDate"),
      createdUserId: user?.id,
      isDraft: btnSaveText == "DRAFT" ? true : false,
      isCorrection: btnSaveText == "UPDATE" ? true : false,
      // department:
      //   typeof getValues("department") != "undefined" &&
      //   getValues("department") != null &&
      //   getValues("department") != ""
      //     ? getValues("department")
      //     : user?.userDao?.department,
      isSpecialNotice: checked,
    }
    // // ---------------------------------------------------------------------------------------------------------
    if (formData?.id) {
      sweetAlert({
        title: language === "en" ? "Are you sure?" : "तुला खात्री आहे?",
        text:
          language === "en"
            ? "If you clicked yes your request get saved, otherwise not!"
            : "तुम्ही होय क्लिक केल्यास तुमची विनंती सेव्ह होईल, अन्यथा नाही",
        icon: "warning",
        buttons: [
          language === "en" ? "Cancel" : "रद्द करा",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((will) => {
        if (will) {
          axios
            .post(`${urls.NRMS}/trnNewsPublishRequest/save`, _body, {
              headers: {
                Authorization: `Bearer ${token}`,
                serviceId: `${selectedMenuFromDrawer}`,
              },
            })
            .then((res) => {
              console.log("res---", res)
              if (res.status == 200 || res.status == 201) {
                sweetAlert(
                  language === "en" ? "Updated!" : "अपडेट केले!",
                  language === "en"
                    ? "Record Updated successfully!"
                    : "रेकॉर्ड यशस्वीरित्या अपडेट केले",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
                // router.back();
                router.push(
                  `/newsRotationManagementSystem/transaction/newsAdvertisementRotation`
                )
              }
            })
            .catch((error) => {
              callCatchMethod(error, language)
            })
        }
      })
    } else {
      sweetAlert({
        title: language === "en" ? "Are you sure?" : "तुला खात्री आहे?",
        text:
          language === "en"
            ? "If you clicked yes your request get saved, otherwise not!"
            : "तुम्ही होय क्लिक केल्यास तुमची विनंती सेव्ह होईल, अन्यथा नाही!",
        icon: "warning",
        buttons: [
          language === "en" ? "Cancel" : "रद्द करा",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((will) => {
        if (will) {
          setIsLoading(true)
          console.log("_body_body", _body)
          axios
            .post(`${urls.NRMS}/trnNewsPublishRequest/save`, _body, {
              headers: {
                Authorization: `Bearer ${token}`,
                serviceId: `${selectedMenuFromDrawer}`,
              },
            })
            .then((res) => {
              console.log("res---", res)
              setIsLoading(false)
              if (res.status == 200 || res.status == 201) {
                sweetAlert(
                  language === "en" ? "Saved!" : "जतन केले!",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
                router.push(
                  "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/"
                )
              }
            })
            .catch((error) => {
              setIsLoading(false)
              callCatchMethod(error, language)
            })
        }
      })
    }
    // // ---------------------------------------------------------------------------------------------------------
  }

  useEffect(() => {
    if (checked) {
      trigger("specialNotice")
    } else {
      clearErrors("specialNotice")
    }

    setValue("checked", checked)

    setDataValidation(schema(checked))
  }, [checked])

  return (
    <>
      <div style={{ display: "none" }}>
        <ComponentToPrint
          ref={componentRef}
          selectedObject={{ ...getValues(), language }}
        />
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Paper
            elevation={8}
            variant="outlined"
            sx={{
              border: 1,
              borderColor: "grey.500",
              marginLeft: "10px",
              marginRight: "10px",
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
              <h2>{<FormattedLabel id="newsPublish" />}</h2>
            </Box>

            <Box
              sx={{
                marginTop: 2,
              }}
            >
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      {/* ward  */}
                      {/* <Grid
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
                    }}
                  >
                    <FormControl variant="standard" error={!!errors.wardKey}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="ward" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 300 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Ward Name *"
                          >
                            {wardKeys &&
                              wardKeys.map((wardKey, index) => (
                                <MenuItem key={index} value={wardKey.id}>
                                  {language == "en" ? wardKey?.wardName : wardKey?.wardNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="wardKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
                    </FormControl>
                  </Grid> */}

                      {/* financialYear */}
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
                          size="small"
                          error={!!errors.financialYear}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="financialYear" required />}
                          </InputLabel>
                          <Select
                            disabled={entryFieldsDisabled}
                            id="financialYear"
                            value={selectedYearId}
                            onChange={handleDropdownChange}
                            sx={{
                              width: 300,
                            }}
                            name="financialYear"
                          >
                            {financialYears &&
                              financialYears?.map((financialYear) => (
                                <MenuItem
                                  key={financialYear.id}
                                  value={financialYear.id}
                                >
                                  {language == "en"
                                    ? financialYear?.financialYearEn
                                    : financialYear?.financialYearMr}
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText>
                            {errors?.financialYear
                              ? errors.financialYear.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Removed zone field | Client Requirements 16-10-2023 */}
                      {/* zone */}
                      {/* <Grid
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
                          error={!!errors.zoneKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="zone" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={entryFieldsDisabled}
                                sx={{ width: 300 }}
                                {...field}
                                value={field.value}
                                {...register("zoneKey")}
                                onChange={(value) => field.onChange(value)}
                              >
                                {zones &&
                                  zones.map((zone, index) => (
                                    <MenuItem key={index} value={zone.id}>
                                      {language == "en"
                                        ? zone?.zoneName
                                        : zone?.zoneNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zoneKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zoneKey ? errors.zoneKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}

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
                          error={!!errors.department}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="departmentName" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={
                                  !(
                                    authority?.includes(
                                      "RELEASING_ORDER_ENTRY"
                                    ) ||
                                    authority?.includes(
                                      "FINAL_APPROVAL"
                                    ) /* && !router?.query?.pageMode */ ||
                                    (!authority?.includes("ENTRY") &&
                                      !authority?.includes("APPROVAL") &&
                                      router?.query?.pageMode == "PROCESS")
                                  ) || entryFieldsDisabled
                                }
                                InputLabelProps={{
                                  shrink: true,
                                  // (watch("department") ? true : false) ||
                                  // (router?.query?.department ? true : false),
                                }}
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
                            defaultValue={""}
                          />
                          <FormHelperText>
                            {errors?.department
                              ? errors.department.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* advertisementType */}
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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.advertisementType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {
                              <FormattedLabel
                                id="advertisementTypeHeading"
                                required
                              />
                            }
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={entryFieldsDisabled}
                                sx={{ width: 300 }}
                                value={field.value}
                                {...register("advertisementType")}
                                // label={
                                //   <FormattedLabel id="advertisementTypeHeading" />
                                // }
                                onChange={(value) => {
                                  field.onChange(value)
                                  // if(e.target.value==1) {
                                  setValue("newsPublishDate", null)
                                  setValue("typeOfNews", "")
                                  setValue("workCost", null)
                                  setValue("workName", "")
                                  setValue("isSpecialNotice", null)
                                  setValue("newsAdvertisementSubject", "")
                                  setValue("newsAdvertisementDescription", "")
                                  setValue("previousRotationNumber", null)
                                  setValue(
                                    "trnNewsPublishRequestHistory",
                                    undefined
                                  )

                                  // }
                                }}
                              >
                                {advertisementTypes &&
                                  advertisementTypes.map(
                                    (advertisementType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={advertisementType.id}
                                      >
                                        {language == "en"
                                          ? advertisementType?.advertisementType
                                          : advertisementType?.advertisementType}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="advertisementType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.advertisementType
                              ? errors.advertisementType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* reference news rotation number */}
                      {watch("advertisementType") == "2" && (
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
                              alignItems: "center",
                            }}
                          >
                            <FormControl
                              variant="standard"
                              size="small"
                              error={!!errors.previousRotationNumber}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {
                                  <FormattedLabel
                                    id="previousRotationNumber"
                                    required
                                  />
                                }
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled={entryFieldsDisabled}
                                    sx={{ width: 300 }}
                                    value={field.value}
                                    {...register("previousRotationNumber")}
                                    label={
                                      <FormattedLabel id="previousRotationNumber" />
                                    }
                                    onChange={(value) => {
                                      field.onChange(value)

                                      {
                                        let selectedValue =
                                          previousRotationNumbers.find(
                                            (x) => x.id == value.target.value
                                          )
                                        setValue(
                                          "newsPublishDate",
                                          selectedValue.newsPublishDate
                                        )
                                        setValue(
                                          "typeOfNews",
                                          selectedValue.typeOfNews
                                        )
                                        setValue(
                                          "isSpecialNotice",
                                          selectedValue.isSpecialNotice
                                        )
                                        if (selectedValue.typeOfNews == 1) {
                                          setValue(
                                            "workCost",
                                            selectedValue.workCost
                                          )
                                          setValue(
                                            "workName",
                                            selectedValue.workName
                                          )
                                        }
                                        setValue(
                                          "newsAdvertisementSubject",
                                          selectedValue.newsAdvertisementSubject
                                        )
                                        setValue(
                                          "newsAdvertisementDescription",
                                          selectedValue.newsAdvertisementDescription
                                        )
                                        setValue(
                                          "trnNewsPublishRequestHistory",
                                          selectedValue.trnNewsPublishRequestHistory
                                        )
                                      }
                                    }}
                                  >
                                    {previousRotationNumbers &&
                                      previousRotationNumbers.map(
                                        (previousRotationNumber, index) => (
                                          <MenuItem
                                            key={index}
                                            value={previousRotationNumber.id}
                                          >
                                            {
                                              previousRotationNumber?.newsPublishRequestNo
                                            }
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="previousRotationNumber"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.previousRotationNumber
                                  ? errors.previousRotationNumber.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </>
                      )}

                      {/* publish date */}
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
                          {/* <Controller
                            control={control}
                            name="newsPublishDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled={entryFieldsDisabled}
                                  variant="standard"
                                  inputFormat="DD/MM/yyyy"
                                  // label={<FormattedLabel id="newsFromDate" />}
                                  label={
                                    <FormattedLabel
                                      id="newsFromDate"
                                      required
                                    />
                                  }
                                  value={field.value}
                                  minDate={new Date()}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DDThh:mm:ss")
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
                                      error={!!errors.newsPublishDate}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          /> */}
                          <Controller
                            control={control}
                            name="newsPublishDate"
                            rules={{ required: true }}
                            defaultValue={null}
                            render={({ field: { onChange, ...props } }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  minDate={new Date()}
                                  disabled={entryFieldsDisabled}
                                  label={
                                    <FormattedLabel
                                      id="newsFromDate"
                                      required
                                    />
                                  }
                                  variant="standard"
                                  inputFormat="DD/MM/YYYY"
                                  {...props}
                                  onChange={(date) =>
                                    onChange(moment(date).format("YYYY-MM-DD"))
                                  }
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      fullWidth
                                      sx={{ width: 300 }}
                                      size="small"
                                      error={!!errors.newsPublishDate}
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

                      {/* news type */}
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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.typeOfNews}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="newsTypes" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={entryFieldsDisabled}
                                // required
                                // disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                {...register("typeOfNews")}
                                label={<FormattedLabel id="newsTypes" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {/* <MenuItem value={"Crime"}>Crime</MenuItem>
                            <MenuItem value={"Tender"}>Tender</MenuItem> */}
                                {/* <MenuItem value={1}>Crime</MenuItem>
                            <MenuItem value={2}>Tender</MenuItem> */}

                                {newsTypss &&
                                  newsTypss.map((newsType, index) => (
                                    <MenuItem key={index} value={newsType.id}>
                                      {language == "en"
                                        ? newsType?.newsType
                                        : newsType?.newsTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="typeOfNews"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.typeOfNews
                              ? errors.typeOfNews.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {watch("typeOfNews") == 1 && (
                        <>
                          {/* work name */}
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
                              disabled={entryFieldsDisabled}
                              id="standard-textarea"
                              sx={{ width: 300 }}
                              label={<FormattedLabel id="tender" required />}
                              //   label="Work"
                              variant="standard"
                              {...register("workName")}
                              error={!!errors.workName}
                              helperText={
                                errors?.workName
                                  ? errors.workName.message
                                  : null
                              }
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("workName") ? true : false) ||
                                  (router.query.workName ? true : false),
                              }}
                            />
                          </Grid>

                          {/* work cost */}
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
                            {/* work cost */}
                            <TextField
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              type="number"
                              disabled={entryFieldsDisabled}
                              id="standard-textarea"
                              sx={{ width: 300 }}
                              label={
                                <FormattedLabel id="tenderCost" required />
                              }
                              //   label="Work"
                              // multiline
                              variant="standard"
                              {...register("workCost")}
                              error={!!errors.workCost}
                              helperText={
                                errors?.workCost
                                  ? errors.workCost.message
                                  : null
                              }
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("workCost") ? true : false) ||
                                  (router.query.workCost ? true : false),
                              }}
                            />
                          </Grid>
                        </>
                      )}
                      <Grid
                        xl={4}
                        lg={4}
                        md={4}
                        sm={4}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          // marginLeft: "1px",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox
                          sx={{
                            display: "flex",
                            marginLeft: "6vh",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onChange={(value) => setChecked(value.target.checked)}
                          checked={checked}
                          disabled={entryFieldsDisabled}
                        />
                        <Typography
                        // sx={{
                        //   display: "flex",
                        //   marginLeft: "3%",
                        //   // justifyContent: "center",
                        //   alignItems: "center",
                        // }}
                        >
                          {<FormattedLabel id="isSpecialNotice" />}
                        </Typography>
                      </Grid>

                      {/* news subject */}
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
                          marginLeft: "60px",
                          marginRight: "60px",
                        }}
                      >
                        <TextField
                          disabled={entryFieldsDisabled}
                          sx={{ width: "100%" }}
                          id="standard-textarea"
                          // value={inputData}
                          label={<FormattedLabel id="newsSubject" required />}
                          variant="standard"
                          multiline
                          {...register("newsAdvertisementSubject")}
                          error={!!errors.newsAdvertisementSubject}
                          helperText={
                            errors?.newsAdvertisementSubject
                              ? errors.newsAdvertisementSubject.message
                              : null
                          }
                          InputLabelProps={{
                            shrink:
                              (watch("newsAdvertisementSubject")
                                ? true
                                : false) ||
                              (router.query.newsAdvertisementSubject
                                ? true
                                : false),
                          }}
                        />
                      </Grid>

                      {/* news description */}
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
                          marginLeft: "60px",
                          marginRight: "60px",
                        }}
                      >
                        <TextField
                          disabled={entryFieldsDisabled}
                          sx={{ width: "100%" }}
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="newsDescription" required />
                          }
                          multiline
                          variant="standard"
                          {...register("newsAdvertisementDescription")}
                          error={!!errors.newsAdvertisementDescription}
                          helperText={
                            errors?.newsAdvertisementDescription
                              ? errors.newsAdvertisementDescription.message
                              : null
                          }
                          InputLabelProps={{
                            shrink:
                              (watch("newsAdvertisementDescription")
                                ? true
                                : false) ||
                              (router.query.newsAdvertisementDescription
                                ? true
                                : false),
                          }}
                        />
                      </Grid>

                      {(authority?.includes("ADMIN") ||
                        authority?.includes("RELEASING_ORDER_ENTRY") ||
                        authority?.includes("RELEASING_ORDER_APPROVAL") ||
                        authority?.includes("FINAL_APPROVAL")) &&
                        [
                          "APPROVED",
                          "RELEASING_ORDER_GENERATED",
                          "FINAL_APPROVED",
                          "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
                        ].includes(getValues("status")) &&
                        router?.query?.pageMode == "PROCESS" && (
                          <>
                            <Grid
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
                                size="small"
                                error={!!errors.rotationGroupKey}
                              >
                                <InputLabel
                                  shrink={
                                    watch("rotationGroupKey") &&
                                    watch("rotationGroupKey") != null
                                      ? true
                                      : false
                                  }
                                  id="demo-simple-select-standard-label"
                                >
                                  {<FormattedLabel id="groupName" required />}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled
                                      // disabled={
                                      //   router?.query?.pageMode === "View" ||
                                      //   [
                                      //     "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
                                      //     "FINAL_APPROVED",
                                      //     "RELEASING_ORDER_GENERATED",
                                      //   ].includes(getValues("status")) ||
                                      //   watch("isSpecialNotice") == true
                                      // }
                                      sx={{ minWidth: 300 }}
                                      labelId="demo-simple-select-standard-label"
                                      id="demo-simple-select-standard"
                                      {...field}
                                      value={rotationGroupId}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        setRotationGroupId(value.target.value)
                                        handleRotationGroupChange(
                                          value.target.value
                                        )
                                      }}
                                    >
                                      {rotationGroup &&
                                        rotationGroup.map(
                                          (rotationGroupName, index) => (
                                            <MenuItem
                                              key={index}
                                              value={rotationGroupName.id}
                                            >
                                              {language == "en"
                                                ? rotationGroupName.rotationGroupName
                                                : rotationGroupName.rotationGroupNameMr}
                                            </MenuItem>
                                          )
                                        )}
                                    </Select>
                                  )}
                                  name="rotationGroupKey"
                                  control={control}
                                  defaultValue={null}
                                />
                                <FormHelperText>
                                  {errors?.rotationGroupKey
                                    ? errors.rotationGroupKey.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid
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
                                size="small"
                                error={!!errors.rotationSubGroupKey}
                              >
                                <InputLabel
                                  shrink={
                                    (watch("rotationSubGroupKey") &&
                                      watch("rotationSubGroupKey") != null) ||
                                    watch("rotationGroupKey") == 5
                                      ? true
                                      : false
                                  }
                                  id="demo-simple-select-standard-label"
                                >
                                  {<FormattedLabel id="subGroup" required />}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled={entryFieldsDisabled}
                                      sx={{ minWidth: 300 }}
                                      labelId="demo-simple-select-standard-label"
                                      id="demo-simple-select-standard"
                                      {...field}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        handleRotationSubGroupChange(
                                          value.target.value
                                        )
                                      }}
                                    >
                                      {rotationSubGroup?.map((each, index) => {
                                        console.log("each", each)
                                        return (
                                          <MenuItem key={index} value={each.id}>
                                            {language == "en"
                                              ? each.rotationSubGroupName
                                              : each.rotationSubGroupNameMr}
                                          </MenuItem>
                                        )
                                      })}
                                    </Select>
                                  )}
                                  name="rotationSubGroupKey"
                                  control={control}
                                  defaultValue={null}
                                />
                                <FormHelperText>
                                  {errors?.rotationSubGroupKey
                                    ? errors.rotationSubGroupKey.message
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
                                alignItems: "center",
                              }}
                            >
                              <FormControl
                                variant="standard"
                                size="small"
                                error={!!errors.newsPaperLevel}
                              >
                                <InputLabel
                                  shrink={
                                    watch("newsPaperLevel") &&
                                    watch("newsPaperLevel") != null
                                      ? true
                                      : false
                                  }
                                  id="demo-simple-select-standard-label"
                                >
                                  {<FormattedLabel id="paperLevel" required />}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      // disabled={
                                      //   newsPaperLevelDisabled ||
                                      //   router?.query?.pageMode === "View"
                                      // }
                                      disabled={
                                        router?.query?.pageMode === "View" ||
                                        [
                                          "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
                                          "FINAL_APPROVED",
                                          "RELEASING_ORDER_GENERATED",
                                        ].includes(getValues("status"))
                                      }
                                      sx={{ width: 300 }}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        handleNewsPaperLevelChange(
                                          value.target.value
                                        )
                                      }}
                                    >
                                      {levels?.map((newsPaperLevel, index) => (
                                        <MenuItem
                                          key={index}
                                          value={newsPaperLevel.id}
                                        >
                                          {language == "en"
                                            ? newsPaperLevel?.newsPaperLevel
                                            : newsPaperLevel?.newsPaperLevelMr}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  )}
                                  name="newsPaperLevel"
                                  control={control}
                                  defaultValue={null}
                                />

                                <FormHelperText>
                                  {errors?.newsPaperLevel
                                    ? errors.newsPaperLevel.message
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
                                alignItems: "center",
                              }}
                            >
                              {/* Standard Format Size */}
                              <TextField
                                disabled={
                                  router?.query?.pageMode === "View" ||
                                  [
                                    "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
                                    "FINAL_APPROVED",
                                    "RELEASING_ORDER_GENERATED",
                                  ].includes(getValues("status"))
                                }
                                id="standard-textarea"
                                sx={{ width: 300 }}
                                label={<FormattedLabel id="formateSize" />}
                                //   label="Work"
                                multiline
                                variant="standard"
                                {...register("standardFormatSizeNM")}
                                error={!!errors.standardFormatSizeNM}
                                helperText={
                                  errors?.standardFormatSizeNM
                                    ? errors.standardFormatSizeNM.message
                                    : null
                                }
                                InputLabelProps={{
                                  //true
                                  shrink:
                                    (watch("standardFormatSizeNM")
                                      ? true
                                      : false) ||
                                    (router.query.standardFormatSizeNM
                                      ? true
                                      : false),
                                }}
                              />
                              {/* <FormControl
                            variant="standard"
                            size="small"
                            error={!!errors.standardFormatSize}
                          >
                            <InputLabel
                              shrink={
                                watch("standardFormatSize") != null
                                  ? true
                                  : false
                              }
                              id="demo-simple-select-standard-label"
                            >
                              {<FormattedLabel id="formateSize" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 300 }}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  label={<FormattedLabel id="paperLevel" />}
                                >
                                  {console.log("ssss", standardFormatSize)}
                                  {standardFormatSize?.map((each, index) => (
                                    <MenuItem key={index} value={each.id}>
                                      {each.standardFormatSize}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                              name="standardFormatSize"
                              control={control}
                              defaultValue={null}
                            />
                            <FormHelperText>
                              {errors?.standardFormatSize
                                ? errors.standardFormatSize.message
                                : null}
                            </FormHelperText>
                          </FormControl> */}
                            </Grid>

                            {/* news Paper */}
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
                              <FormControl
                                // variant="outlined"
                                variant="standard"
                                size="small"
                                // sx={{ m: 1, minWidth: 120 }}
                                error={!!errors.newsPaper}
                              >
                                <InputLabel
                                  InputLabelProps={{
                                    shrink: watch("newsPaper") ? true : false,
                                  }}
                                  id="demo-simple-select-standard-label"
                                >
                                  {
                                    <FormattedLabel
                                      id="newsPaperName"
                                      required
                                    />
                                  }
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      renderValue={(selected) =>
                                        selected.join(", ")
                                      }
                                      MenuProps={MenuProps}
                                      disabled={
                                        router?.query?.pageMode === "View" ||
                                        [
                                          "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
                                          "FINAL_APPROVED",
                                          "RELEASING_ORDER_GENERATED",
                                        ].includes(getValues("status"))
                                      }
                                      labelId="demo-multiple-checkbox-label"
                                      id="demo-multiple-checkbox"
                                      multiple
                                      multiline
                                      sx={{ width: 900 }}
                                      // value={field.value}
                                      value={selectedNewsPapers}
                                      onChange={
                                        // (value) => {
                                        handleChange
                                        // field.onChange(value);
                                        // }
                                      }
                                    >
                                      {newsPaperOriginal &&
                                        newsPaperOriginal.map(
                                          (newsPaper, index) => (
                                            <MenuItem
                                              key={newsPaper.id}
                                              value={newsPaper.newspaperNameMr}
                                            >
                                              <Checkbox
                                                checked={
                                                  selectedNewsPapers.indexOf(
                                                    newsPaper.newspaperNameMr
                                                  ) > -1
                                                }
                                              />
                                              <ListItemText
                                                primary={
                                                  newsPaper.newspaperNameMr
                                                }
                                              />
                                            </MenuItem>
                                            // <MenuItem key={index} value={newsPaper.id}>
                                            //   {language == "en" ? newsPaper.newspaperName : newsPaper.newspaperNameMr}
                                            // </MenuItem>
                                          )
                                        )}
                                    </Select>
                                  )}
                                  name="newsPaper"
                                  control={control}
                                  defaultValue={""}
                                />
                                <FormHelperText>
                                  {errors?.newsPaper
                                    ? errors.newsPaper.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </>
                        )}
                    </Grid>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        // paddingTop: "10px",
                        // paddingBottom: "10px",
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                      }}
                    >
                      <h2> {<FormattedLabel id="newsAttachement" />}</h2>
                    </Box>
                    <Typography
                      sx={{
                        marginTop: "1vh",
                        fontWeight: "1000",
                        fontSize: "13px",
                        color: "red",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {language == "en"
                        ? "Attachment size should be less than or equal to 15 MB(15720 kb)"
                        : "संलग्नक आकार 15 MB (15720 kb) पेक्षा कमी किंवा समान असावा"}
                    </Typography>
                    {/* Attachement */}
                    <Grid
                      container
                      style={{
                        marginTop: "1vh",
                      }}
                      spacing={3}
                    >
                      {/* docx news attachment */}
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12} p={1}>
                        <Typography>
                          {<FormattedLabel id="advirtiseMentInDocx" required />}{" "}
                          :{" "}
                        </Typography>
                      </Grid>
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12} p={1}>
                        <UploadButtonOP
                          error={!!errors?.advirtiseMentInDocx}
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("advirtiseMentInDocx")}
                          fileKey={"advirtiseMentInDocx"}
                          showDel={
                            router?.query?.pageMode == "Add" ? false : true
                          }
                          showDelBtn={showDeleteButton}
                        />
                        <FormHelperText error={!!errors?.advirtiseMentInDocx}>
                          {errors?.advirtiseMentInDocx
                            ? errors?.advirtiseMentInDocx?.message
                            : null}
                        </FormHelperText>
                      </Grid>

                      {/* pdf news attachment */}
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12} p={1}>
                        <Typography sx={{ marginTop: "12px" }}>
                          {<FormattedLabel id="advirtiseMentInPdf" required />}{" "}
                          :{" "}
                        </Typography>
                      </Grid>
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12} p={1}>
                        <UploadButtonOP
                          error={!!errors?.advirtiseMentInPdf}
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("advirtiseMentInPdf")}
                          fileKey={"advirtiseMentInPdf"}
                          showDel={
                            router?.query?.pageMode == "Add" ? false : true
                          }
                          showDelBtn={showDeleteButton}
                        />
                        <FormHelperText error={!!errors?.advirtiseMentInPdf}>
                          {errors?.advirtiseMentInPdf
                            ? errors?.advirtiseMentInPdf?.message
                            : null}
                        </FormHelperText>
                      </Grid>

                      {/* special Notice attachment */}
                      {checked && (
                        <>
                          <Grid item xl={6} lg={6} md={6} sm={12} xs={12} p={1}>
                            <Typography sx={{ marginTop: "12px" }}>
                              {<FormattedLabel id="specialNotice" />} :{" "}
                            </Typography>
                          </Grid>
                          <Grid item xl={6} lg={6} md={6} sm={12} xs={12} p={1}>
                            <UploadButtonOP
                              error={!!errors?.specialNotice}
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues("specialNotice")}
                              fileKey={"specialNotice"}
                              showDel={
                                router?.query?.pageMode == "Add" ? false : true
                              }
                              showDelBtn={showDeleteButton}
                            />
                            <FormHelperText error={!!errors?.specialNotice}>
                              {errors?.specialNotice
                                ? errors?.specialNotice?.message
                                : null}
                            </FormHelperText>
                          </Grid>
                        </>
                      )}
                    </Grid>

                    <Grid
                      container
                      spacing={5}
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        // paddingTop: "10px",
                        // marginTop: "50px",
                        // marginBottom: "20px",
                        padding: "20px",
                        alignItems: "baseline",
                      }}
                    >
                      {!router?.query?.pageMode ||
                      router?.query?.pageMode == "Edit" ? (
                        <>
                          {showSaveAsDraftButton && (
                            <Grid
                              item
                              sx={{ display: "flex", justifyContent: "center" }}
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                            >
                              <Button
                                type="submit"
                                onClick={() => setBtnSaveText("DRAFT")}
                                variant="contained"
                                color="success"
                                endIcon={<SaveIcon />}
                              >
                                {language == "en"
                                  ? "SAVE AS DRAFT"
                                  : "ड्राफ्ट करा"}
                              </Button>
                            </Grid>
                          )}

                          <Grid
                            item
                            sx={{ display: "flex", justifyContent: "center" }}
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                          >
                            <Button
                              // onClick={() => setBtnSaveText("CREATE")}
                              onClick={() => {
                                setBtnSaveText("CREATE")
                              }}
                              type="submit"
                              variant="contained"
                              color="success"
                              endIcon={<SendIcon />}
                            >
                              {language == "en" ? "Final Submit" : "जतन करा"}
                            </Button>
                          </Grid>

                          <Grid
                            item
                            sx={{ display: "flex", justifyContent: "center" }}
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                          >
                            <Button
                              endIcon={<ExitToAppIcon />}
                              variant="contained"
                              color="error"
                              onClick={() => {
                                exitButton(), setBtnSaveText("CREATE")
                              }}
                            >
                              <FormattedLabel id="exit" />
                            </Button>
                          </Grid>
                        </>
                      ) : (
                        <>
                          {/* <Grid
                        container
                        ml={5}
                        border
                        px={5}
                        // style={{
                        //   display: "flex",
                        //   justifyContent: "space-around",
                        //   paddingTop: "10px",
                        //   // marginTop: "10px",
                        // }}
                      > */}
                          {router?.query?.pageMode == "PROCESS" && (
                            <Grid
                              sx={{ display: "flex", justifyContent: "center" }}
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              xl={4}
                            >
                              {(authority?.includes("ADMIN") ||
                                authority?.includes("APPROVAL") ||
                                authority?.includes(
                                  "RELEASING_ORDER_APPROVAL"
                                ) ||
                                authority?.includes("FINAL_APPROVAL")) &&
                                (watch("status") ==
                                  "RELEASING_ORDER_GENERATED" ||
                                  watch("status") == "CREATED" ||
                                  watch("status") == "CORRECTED") && (
                                  <Button
                                    sx={{
                                      display: "flex",
                                      justifyContent:
                                        "center" /* marginRight: 8 */,
                                    }}
                                    variant="contained"
                                    endIcon={<NextPlanIcon />}
                                    color="success"
                                    onClick={() => {
                                      // alert(serviceId)
                                      setmodalforAprov(true)
                                    }}
                                  >
                                    <FormattedLabel id="actions" />
                                  </Button>
                                )}

                              {getValues("status") === "FINAL_APPROVED" &&
                                (authority?.includes("ADMIN") ||
                                  authority?.includes("SEND_TO_PUBLISH")) && (
                                  <Button
                                    endIcon={<ForwardIcon />}
                                    sx={{
                                      display: "flex",
                                      justifyContent:
                                        "center" /* marginRight: 8 */,
                                    }}
                                    variant="contained"
                                    color="success"
                                    onClick={() => {
                                      sendNewsToPublish()
                                    }}
                                  >
                                    Send to News Agencies
                                  </Button>
                                )}

                              {(authority?.includes("ADMIN") ||
                                authority?.includes("RELEASING_ORDER_ENTRY")) &&
                                getValues("status") === "APPROVED" && (
                                  <>
                                    <Button
                                      // loading={loading}
                                      disabled={
                                        generateReleasingOrderButtonDisabled
                                      }
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                      endIcon={<NoteAddOutlinedIcon />}
                                      onClick={() => {
                                        generateReleasingOrderNumberFromServer()
                                        setIsLoading(true)
                                        // saveToServer(),
                                      }}
                                      variant="contained"
                                      color="success"
                                    >
                                      Generate Releasing Order
                                    </Button>
                                  </>
                                )}
                            </Grid>
                          )}

                          <Grid
                            sx={{ display: "flex", justifyContent: "center" }}
                            item
                            xs={4}
                          >
                            {(authority?.includes("ADMIN") ||
                              authority?.includes("RELEASING_ORDER_ENTRY")) &&
                              getValues("status") === "APPROVED" && (
                                <Button
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                  endIcon={<ExitToAppIcon />}
                                  onClick={() => {
                                    setmodalforAprov2(true)
                                  }}
                                  variant="contained"
                                  color="primary"
                                >
                                  Revert
                                </Button>
                              )}

                            {getValues("status") ==
                              "RELEASING_ORDER_GENERATED" && (
                              <Tooltip
                                title={
                                  language == "en"
                                    ? "View Releasing Order"
                                    : "रिलीसिंग ऑर्डर पहा"
                                }
                              >
                                <Button
                                  // loading={loading}
                                  disabled={
                                    generateReleasingOrderButtonDisabled
                                  }
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                  onClick={() => {
                                    // {
                                    //   handlePrint;
                                    // }
                                    router.push({
                                      pathname:
                                        "/newsRotationManagementSystem/transaction/releasingOrder/news/",
                                      query: {
                                        pageMode: "View",
                                        id: getValues("id"),
                                      },
                                    })
                                  }}
                                  endIcon={
                                    <VisibilityIcon
                                      style={{ color: "white" }}
                                    />
                                  }
                                  variant="contained"
                                >
                                  VIEW REALEASING ORDER
                                </Button>
                              </Tooltip>
                            )}
                          </Grid>

                          <Grid
                            sx={{ display: "flex", justifyContent: "center" }}
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                          >
                            <Button
                              sx={{
                                display: "flex",
                                justifyContent: "center" /* marginRight: 8 */,
                              }}
                              width
                              variant="contained"
                              endIcon={<ExitToAppIcon />}
                              color="error"
                              onClick={() =>
                                // router.back()
                                router.push(
                                  `/newsRotationManagementSystem/transaction/newsAdvertisementRotation/`
                                )
                              }
                            >
                              Exit
                            </Button>
                          </Grid>
                          {/*  </Grid> */}
                        </>
                      )}
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>

            {/* Added History Component | Client Requirements 16-10-2023 */}
            {watch("trnNewsPublishRequestHistory") !== undefined && (
              <HistoryComponent
                tableData={watch("trnNewsPublishRequestHistory")}
              />
            )}
          </Paper>
          <form {...methods} onSubmit={handleSubmit("remarks")}>
            <div className={styles.model}>
              <Modal
                open={modalforAprov}
                //onClose={clerkApproved}
                onCancel={() => {
                  setmodalforAprov(false)
                }}
              >
                <div className={styles.boxRemark}>
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
                        onClick={() =>
                          // router.back()
                          router.push(
                            `/newsRotationManagementSystem/transaction/newsAdvertisementRotation`
                          )
                        }
                      />
                    </IconButton>
                  </div>

                  <div
                    className={styles.btndate}
                    style={{ marginLeft: "200px" }}
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

                  <div className={styles.btnappr}>
                    <Button
                      variant="contained"
                      color="success"
                      endIcon={<ThumbUpIcon />}
                      onClick={async () => {
                        remarks("APPROVE")
                        // setBtnSaveText('APPROVED')
                        // alert(serviceId)

                        // {
                        //   router.back();
                        // router.push(
                        //   `/newsRotationManagementSystem/transaction/newsAdvertisementRotation`
                        // );
                        // }
                      }}
                    >
                      <FormattedLabel id="APPROVE" />
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<UndoIcon />}
                      onClick={() => {
                        if (watch("remark")) {
                          remarks("REASSIGN")
                        } else {
                          swal(
                            language === "en"
                              ? "Please Enter Remark...!"
                              : "कृपया टिप्पणी प्रविष्ट करा."
                          )
                        }
                      }}
                    >
                      <FormattedLabel id="REASSIGN" />
                    </Button>
                    {router.query.role == "FINAL_APPROVAL" ? (
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<UndoIcon />}
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
                        swal({
                          title: language === "en" ? "Exit?" : "बाहेर पडा",
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
                            // router.back();
                            router.push(
                              `/newsRotationManagementSystem/transaction/newsAdvertisementRotation`
                            )
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
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </form>

          <form {...methods} onSubmit={handleSubmit("remarks")}>
            <div className={styles.model}>
              <Modal
                open={modalforAprov2}
                //onClose={clerkApproved}
                onCancel={() => {
                  setmodalforAprov2(false)
                }}
              >
                <div className={styles.boxRemark}>
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
                        onClick={() =>
                          // router.back()
                          router.push(
                            `/newsRotationManagementSystem/transaction/newsAdvertisementRotation`
                          )
                        }
                      />
                    </IconButton>
                  </div>

                  <div
                    className={styles.btndate}
                    style={{ marginLeft: "200px" }}
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

                  <div className={styles.btnappr}>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<UndoIcon />}
                      onClick={() => {
                        if (watch("remark")) {
                          remarks("REASSIGN")
                        } else {
                          swal(
                            language === "en"
                              ? "Please Enter Remark...!"
                              : "कृपया टिप्पणी प्रविष्ट करा"
                          )
                        }
                      }}
                    >
                      <FormattedLabel id="REASSIGN" />
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<CloseIcon />}
                      color="error"
                      onClick={() => {
                        swal({
                          title: language === "en" ? "Exit?" : "बाहेर पडा",
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
                            // router.back();
                            router.push(
                              `/newsRotationManagementSystem/transaction/newsAdvertisementRotation`
                            )
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
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </form>
        </>
      )}
    </>
  )
}

export default Index
