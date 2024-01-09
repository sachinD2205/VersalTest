import { yupResolver } from "@hookform/resolvers/yup"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import {
  Button,
  Paper,
  Slide,
  TextField,
  Grid,
  Box,
  ThemeProvider,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextareaAutosize,
  Modal,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstCorporatorSchema"
import moment from "moment"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import swal from "sweetalert"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"
import styles from "../view.module.css"
import theme from "../../../../theme"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import Transliteration from "../../../../components/common/linguosol/transliteration"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const language = useSelector((store) => store.labels.language)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)

  const [dataValidation, setDataValidation] = useState(Schema(language))
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language, showErrorMessagesInModel)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }

  useEffect(() => {
    setDataValidation(Schema(language))
  }, [language])

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "all",
  })

  const {
    register,
    watch,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा")
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [loading, setLoading] = useState(false)
  const [loadingWard, setLoadingWard] = useState(false)
  const [loadingGenders, setLoadingGenders] = useState(false)
  const [loadingReligions, setLoadingReligions] = useState(false)
  const [loadingCaste, setLoadingCaste] = useState(false)
  const [loadingParty, setLoadingParty] = useState(false)
  const [loadingIdProof, setLoadingIdProof] = useState(false)
  const [loadingBanks, setLoadingBanks] = useState(false)

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const [allWards, setAllWards] = useState([])
  const [genders, setGenders] = useState([])
  const [religions, setReligions] = useState([])
  const [casteData, setCasteData] = useState([])
  const [partyNames, setPartyNames] = useState([])
  const [idProofsData, setIdProofsData] = useState([])
  const [bankNames, setBankNames] = useState([])
  const [bankBranchNames, setBankBranchNames] = useState([])

  const [nominatedCorpValue, setNominatedCorpValue] = useState(false)

  const [showErrorModel, setShowErrorModel] = useState(false)

  const [errorData, setErrorData] = useState([])

  const userToken = useGetToken()

  const showErrorMessagesInModel = (data) => {
    setErrorData(data)
    setShowErrorModel(true)
  }

  // Get Table - Data
  const getAllCorporatorsData = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true)
    axios
      .get(`${urls.MSURL}/mstDefineCorporators/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(";res", res)
        if (res?.status === 200 || res?.status === 201) {
          let result = res.data?.corporator
          let _res = result?.map((r, i) => {
            console.log("44", r)
            return {
              id: r.id,
              srNo: i + 1,
              nominatedCorporators: r.nominatedCorporators,
              nominatedCorpShow: r.nominatedCorporators == true ? "Yes" : "No",
              ward: r.ward,
              ward1: allWards?.find((obj) => obj.id === r.ward)?.wardName,
              electedWard: r.electedWard,
              firstName: r.firstName,
              firstNameMr: r.firstNameMr,
              middleName: r.middleName,
              middleNameMr: r.middleNameMr,
              lastName: r.lastName,
              lastNameMr: r.lastNameMr,
              gender: r.gender,
              gender1: genders?.find((obj) => obj.id === r.gender)?.genderEn,
              dateOfBirth: r.dateOfBirth,
              dateOfBirthShow: moment(r.dateOfBirth).format("DD-MM-YYYY"),
              religion: r.religion,
              religion1: religions?.find((obj) => obj.id === r.religion)
                ?.religionEn,
              caste: r.caste,
              caste1: casteData?.find((obj) => obj.id === r.caste)?.castEn,
              casteCertificateNo: r.casteCertificateNo,
              party: r.party,
              party1: partyNames?.find((obj) => obj.id === r.party)
                ?.partyNameEn,
              idProofCategory: r.idProofCategory,
              idProofCategory1: idProofsData?.find(
                (obj) => obj.id === r.idProofCategory
              )?.identificationProofDocumentEn,
              idProofNo: r.idProofNo,
              aadharNo: r.aadharNo,
              mobileNo: r.mobileNo,
              emailAddress: r.emailAddress,
              address: r.address,
              addressMr: r.addressMr,
              electedDate: r.electedDate,
              monthlyHonorariumAmount: r.monthlyHonorariumAmount,
              resignDate: r.resignDate,
              electedDateShow: moment(r.electedDate).format("DD-MM-YYYY"),
              resignDateShow: r?.resignDate
                ? moment(r.resignDate).format("DD-MM-YYYY")
                : "-",
              reason: r.reason,
              reasonMr: r.reasonMr,
              bankName: r.bankName,
              bankName1: bankNames?.find((obj) => obj.id === Number(r.bankName))
                ?.bankNameEn,
              branchName: r.branchName,
              branchName1: bankBranchNames?.find(
                (obj) => obj.id === Number(r.branchName)
              )?.branchNameEn,
              savingAccountNo: r.savingAccountNo,
              bankIfscCode: r.bankIfscCode,
              bankMicrCode: r.bankMicrCode,
              activeFlag: r.activeFlag,
            }
          })
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          })
          setLoading(false)
        } else {
          setData([])
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
      })
      .catch((error) => {
        // console.log("error", error)
        // if (!error.status) {
        //   console.log(":1000", error)
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)
        // } else {
        //   sweetAlert(error)
        //   setLoading(false)
        // }
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  // /////////////////// WARD API //////////////////
  const getAllWards = () => {
    setLoadingWard(true)
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllWards(
            res?.data?.ward?.map((r, i) => ({
              id: r.id,
              wardName: r.wardName,
              wardNameMr: r.wardNameMr,
            }))
          )
          setLoadingWard(false)
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          })
          setLoadingWard(false)
        }
      })
      .catch((error) => {
        // sweetAlert({
        //   title: "OOPS!",
        //   text: `${error3}`,
        //   icon: "error",
        //   dangerMode: true,
        //   closeOnClickOutside: false,
        // })
        setLoadingWard(false)
        callCatchMethod(error, language)
      })
  }

  ///////////////////////////////////////
  const getGender = () => {
    setLoadingGenders(true)
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setGenders(
            res?.data?.gender
              ?.sort((a, b) => {
                const nameA = a?.gender?.toLowerCase() // Convert names to lowercase for case-insensitive sorting
                const nameB = b?.gender?.toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
              })
              .map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                genderEn: r.gender,
                genderMr: r.genderMr,
              }))
          )
          setLoadingGenders(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingGenders(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoadingGenders(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingGenders(false)
        // }
        setLoadingGenders(false)
        callCatchMethod(error, language)
      })
  }
  ///////////////////////////////////////
  const getReligions = () => {
    setLoadingReligions(true)
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setReligions(
            res?.data?.religion
              ?.sort((a, b) => {
                const nameA = a?.religion?.toLowerCase() // Convert names to lowercase for case-insensitive sorting
                const nameB = b?.religion?.toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
              })
              .map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                religionEn: r.religion,
                religionMr: r.religionMr,
              }))
          )
          setLoadingReligions(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingReligions(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoadingReligions(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingReligions(false)
        // }
        setLoadingReligions(false)
        callCatchMethod(error, language)
      })
  }

  ///////////////////////////////////////
  const getCaste = () => {
    setLoadingCaste(true)
    axios
      .get(`${urls.CFCURL}/master/cast/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setCasteData(
            res?.data?.mCast?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              castEn: r.cast,
              castMr: r.castMr,
            }))
          )
          setLoadingCaste(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingCaste(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoadingCaste(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingCaste(false)
        // }
        setLoadingCaste(false)
        callCatchMethod(error, language)
      })
  }

  ///////////////////////////////////////
  const getPartys = () => {
    setLoadingParty(true)
    axios
      .get(`${urls.MSURL}/mstDefinePartyName/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setPartyNames(
            res?.data?.definePartyName
              ?.sort((a, b) => {
                const nameA = a?.partyName?.toLowerCase() // Convert names to lowercase for case-insensitive sorting
                const nameB = b?.partyName?.toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
              })
              .map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                partyNameEn: r.partyName,
                partyNameMr: r.partyNameMr,
              }))
          )
          setLoadingParty(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingParty(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoadingParty(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingParty(false)
        // }
        setLoadingParty(false)
        callCatchMethod(error, language)
      })
  }

  ///////////////////////////////////////
  const getIdProofs = () => {
    setLoadingIdProof(true)
    axios
      .get(`${urls.MSURL}/mstDefineIdentificationProof/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setIdProofsData(
            res?.data?.identificationProof
              ?.sort((a, b) => {
                const nameA = a?.identificationProofDocument?.toLowerCase() // Convert names to lowercase for case-insensitive sorting
                const nameB = b?.identificationProofDocument?.toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
              })
              .map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                identificationProofDocumentEn: r.identificationProofDocument,
                identificationProofDocumentMr: r.identificationProofDocumentMr,
              }))
          )
          setLoadingIdProof(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingIdProof(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoadingIdProof(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingIdProof(false)
        // }
        setLoadingIdProof(false)
        callCatchMethod(error, language)
      })
  }

  // ///////////////////////////////
  const getBanks = () => {
    setLoadingBanks(true)
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setBankNames(
            res?.data?.bank
              ?.sort((a, b) => {
                const nameA = a?.bankName?.toLowerCase() // Convert names to lowercase for case-insensitive sorting
                const nameB = b?.bankName?.toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
              })
              .map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                bankNameEn: r.bankName,
                bankNameMr: r.bankNameMr,
              }))
          )
          setLoadingBanks(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingBanks(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoadingBanks(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingBanks(false)
        // }
        setLoadingBanks(false)
        callCatchMethod(error, language)
      })
  }
  ////////////////////////////////////////////////

  const getBranches = () => {
    setLoadingBanks(true)
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setBankBranchNames(
            res?.data?.bank
              ?.sort((a, b) => {
                const nameA = a?.branchName?.toLowerCase() // Convert names to lowercase for case-insensitive sorting
                const nameB = b?.branchName?.toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
              })
              .map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                branchNameEn: r.branchName,
                branchNameMr: r.branchNameMr,
              }))
          )
          setLoadingBanks(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingBanks(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoadingBanks(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingBanks(false)
        // }
        setLoadingBanks(false)
        callCatchMethod(error, language)
      })
  }
  ////////////////////////////////////////////////

  useEffect(() => {
    if (
      allWards?.length != 0 &&
      genders?.length != 0 &&
      religions?.length != 0 &&
      casteData?.length != 0 &&
      partyNames?.length != 0 &&
      idProofsData?.length != 0 &&
      bankNames?.length != 0 &&
      bankBranchNames?.length != 0
    ) {
      getAllCorporatorsData()
    }
  }, [
    allWards,
    genders,
    religions,
    casteData,
    partyNames,
    idProofsData,
    bankNames,
    bankBranchNames,
  ])

  useEffect(() => {
    getAllWards()
    getGender()
    getReligions()
    getCaste()
    getPartys()
    getIdProofs()
    getBanks()
    getBranches()
  }, [])

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const dateOfBirth =
      formData?.dateOfBirth == null
        ? null
        : moment(formData?.dateOfBirth).format("YYYY-MM-DD")

    const electedDate =
      formData?.electedDate == null
        ? null
        : moment(formData?.electedDate).format("YYYY-MM-DD")

    const resignDate =
      formData?.resignDate == null
        ? null
        : moment(formData?.resignDate).format("YYYY-MM-DD")

    const finalBodyForApi = {
      ...formData,
      caste: Number(formData.caste),
      aadharNo: Number(formData.aadharNo),
      gender: Number(formData.gender),
      party: Number(formData.party),
      religion: Number(formData.religion),
      idProofCategory: Number(formData.idProofCategory),
      ward: Number(formData.ward),
      bankName: Number(formData.bankName),
      branchName: Number(formData.branchName),
      nominatedCorporators: nominatedCorpValue,
      dateOfBirth,
      resignDate,
      electedDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    console.log("420", finalBodyForApi)
    setLoading(true)
    axios
      .post(`${urls.MSURL}/mstDefineCorporators/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success")
          getAllCorporatorsData()
          setButtonInputState(false)
          setIsOpenCollapse(false)
          setEditButtonInputState(false)

          setLoading(false)
        }
      })
      .catch((error) => {
        // if (error.request.status == 500) {
        //   sweetAlert({
        //     title: "Error!",
        //     text: `Api failed with error status code 500`,
        //     icon: "error",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })

        //   getAllCorporatorsData()
        //   setButtonInputState(false)

        //   setLoading(false)
        // } else {
        //   sweetAlert({
        //     title: "Error!",
        //     text: `${error?.response?.data?.error}`,
        //     icon: "error",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)

        //   getAllCorporatorsData()
        //   setButtonInputState(false)
        // }
        // console.log("error", error);
        getAllCorporatorsData()
        setButtonInputState(false)
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("520", body)
        if (willDelete === true) {
          setLoading(true)
          axios
            .post(`${urls.MSURL}/mstDefineCorporators/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getAllCorporatorsData()
                setButtonInputState(false)
                setLoading(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getAllCorporatorsData()
              //   setButtonInputState(false)
              //   setLoading(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getAllCorporatorsData()
              //   setButtonInputState(false)
              //   setLoading(false)
              // }
              getAllCorporatorsData()
              setButtonInputState(false)
              setLoading(false)
              callCatchMethod(error, language)
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
          setButtonInputState(false)
          setLoading(false)
        }
      })
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // console.log("inn", willDelete);
        console.log("620", body)

        if (willDelete === true) {
          setLoading(true)
          axios
            .post(`${urls.MSURL}/mstDefineCorporators/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Recovered!", {
                  icon: "success",
                })
                getAllCorporatorsData()
                setButtonInputState(false)
                setLoading(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getAllCorporatorsData()
              //   setButtonInputState(false)
              //   setLoading(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getAllCorporatorsData()
              //   setButtonInputState(false)
              //   setLoading(false)
              // }
              getAllCorporatorsData()
              setButtonInputState(false)
              setLoading(false)
              callCatchMethod(error, language)
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
          setButtonInputState(false)
          setLoading(false)
        }
      })
    }
  }

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setNominatedCorpValue(false)
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
    setNominatedCorpValue(false)
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    firstName: "",
    firstNameMr: "",
    middleName: "",
    middleNameMr: "",
    lastName: "",
    lastNameMr: "",
    gender: "",
    dateOfBirth: null,
    religion: "",
    ward: "",
    caste: "",
    casteCertificateNo: "",
    party: "",
    idProofCategory: "",
    idProofNo: "",
    aadharNo: "",
    mobileNo: "",
    emailAddress: "",
    address: "",
    addressMr: "",
    electedDate: null,
    resignDate: null,
    reason: "",
    reasonMr: "",
    bankName: "",
    branchName: "",
    savingAccountNo: "",
    bankIfscCode: "",
    bankMicrCode: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    firstName: "",
    firstNameMr: "",
    middleName: "",
    middleNameMr: "",
    lastName: "",
    lastNameMr: "",
    gender: "",
    dateOfBirth: null,
    religion: "",
    ward: "",
    caste: "",
    casteCertificateNo: "",
    party: "",
    idProofCategory: "",
    idProofNo: "",
    aadharNo: "",
    mobileNo: "",
    emailAddress: "",
    address: "",
    addressMr: "",
    electedDate: null,
    resignDate: null,
    reason: "",
    reasonMr: "",
    bankName: "",
    branchName: "",
    savingAccountNo: "",
    bankIfscCode: "",
    bankMicrCode: "",
    id: null,
  }

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "nominatedCorpShow",
      headerName: <FormattedLabel id="nominatedCorporator" />,
      width: 150,
      headerAlign: "center",
    },
    {
      field: "ward1",
      headerName: <FormattedLabel id="wardName" />,
      // type: "number",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "firstName",
      // headerName: "First Name English",
      headerName: <FormattedLabel id="firstNameEn" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "middleName",
      // headerName: "Middle Name English",
      headerName: <FormattedLabel id="middleNameEn" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "lastname",
      // headerName: "Last Name English",
      headerName: <FormattedLabel id="lastNameEn" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "gender1",
      headerName: <FormattedLabel id="gender" />,
      width: 100,
      headerAlign: "center",
    },
    {
      field: "dateOfBirthShow",
      headerName: <FormattedLabel id="dateOfBirth" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "religion1",
      headerName: <FormattedLabel id="religion" />,
      width: 150,
      headerAlign: "center",
    },
    {
      field: "caste1",
      headerName: <FormattedLabel id="caste" />,
      width: 250,
      headerAlign: "center",
    },
    {
      field: "casteCertificateNo",
      headerName: <FormattedLabel id="casteCertificateNo" />,
      width: 150,
      headerAlign: "center",
    },
    {
      field: "party1",
      // headerName: "Party Name",
      headerName: <FormattedLabel id="partyName" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "idProofCategory1",
      // headerName: " Id Proof Category ",
      headerName: <FormattedLabel id="idProofCategory" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "idProofNo",
      // headerName: " Id Proof No ",
      headerName: <FormattedLabel id="idProofNo" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "aadharNo",
      // headerName: "Pan no",
      headerName: <FormattedLabel id="aadharNo" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "mobileNo",
      headerName: " Mobile No",
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "emailAddress",
      headerName: " Email Address ",
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "address",
      // headerName: " Address",
      headerName: <FormattedLabel id="address" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "addressMr",
      headerName: " Address Marathi",
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "electedDateShow",
      // headerName: " Elected Date",
      headerName: <FormattedLabel id="electedDate" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "resignDateShow",
      // headerName: " Resigned Date",
      headerName: <FormattedLabel id="resignDate" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reason",
      headerName: <FormattedLabel id="reason" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "bankName1",
      // headerName: " Bank Name",
      headerName: <FormattedLabel id="bankName" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "branchName1",
      // headerName: " Branch Name",
      headerName: <FormattedLabel id="branchName" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "bankMicrCode",
      // headerName: " MICR Code",
      headerName: <FormattedLabel id="bankMICRcode" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "savingAccountNo",
      // headerName: " Saving Account No",
      headerName: <FormattedLabel id="savingAccountNo" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "bankIfscCode",
      // headerName: "IFSC Code",
      headerName: <FormattedLabel id="bankIFSCcode" />,
      // type: "number",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log("params.row: ", params.row)
                reset(params.row)
                setNominatedCorpValue(params.row.nominatedCorporators)
              }}
            >
              {language == "en" ? (
                <Tooltip title={`EDIT THIS RECORD`}>
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip title={`हा रेकॉर्ड एडिट करा`}>
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              )}
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log("params.row: ", params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == "Y" ? (
                language == "en" ? (
                  <Tooltip title={`DE-ACTIVATE THIS RECORD`}>
                    <ToggleOnIcon
                      style={{ color: "green", fontSize: 30 }}
                      onClick={() => deleteById(params.id, "N")}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={`हा रेकॉर्ड डी-एक्टिव्हेट करा`}>
                    <ToggleOnIcon
                      style={{ color: "green", fontSize: 30 }}
                      onClick={() => deleteById(params.id, "N")}
                    />
                  </Tooltip>
                )
              ) : language == "en" ? (
                <Tooltip title={`ACTIVATE THIS RECORD`}>
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={`हा रेकॉर्ड सक्रिय करा`}>
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </div>
        )
      },
    },
  ]

  // Row

  const today = new Date()
  const maxDate = new Date(
    today.getFullYear() - 21,
    today.getMonth(),
    today.getDate()
  )

  useEffect(() => {
    if (!watch("resignDate")) {
      setValue("reason", "")
      setValue("reasonMr", "")
    }
  }, [watch("resignDate")])

  return (
    // <ThemeProvider theme={theme}>
    <div>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper className={styles.adjustForBread}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "white",
              fontSize: 19,
              fontWeight: 500,
              borderRadius: 100,
            }}
          >
            <strong>
              <FormattedLabel id="defineCorporator" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <Box
                        className={styles.details}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "30%",
                          height: "auto",
                          overflow: "auto",
                          padding: "0.1%",
                          color: "white",
                          fontSize: 15,
                          fontWeight: 350,
                          borderRadius: 100,
                          letterSpacing: "2px",
                        }}
                      >
                        <strong>
                          <FormattedLabel id="personalDetails" />
                        </strong>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}

                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      // justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        // justifyContent: "start",
                        marginLeft: "30px",
                        alignItems: "baseline",
                      }}
                    >
                      <FormControlLabel
                        // sx={{ width: "80%" }}
                        control={<Checkbox color="success" />}
                        label={<FormattedLabel id="nominatedCorporator" />}
                        checked={nominatedCorpValue}
                        onChange={(e) => {
                          console.log(":1000", e.target.checked)
                          setNominatedCorpValue(e.target.checked)
                        }}
                      />
                    </Grid>
                    {/* ///////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: "80%" }}>
                        <Transliteration
                          _key={"firstName"}
                          autoFocus={"autoFocus"}
                          fieldName={"firstName"}
                          updateFieldName={"firstNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="firstNameEn" required />}
                          error={!!errors.firstName}
                          targetError={"firstNameMr"}
                          helperText={
                            errors?.firstName ? errors?.firstName.message : null
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: "80%" }}>
                        <Transliteration
                          _key={"firstNameMr"}
                          fieldName={"firstNameMr"}
                          updateFieldName={"firstName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="firstNameMr" required />}
                          error={!!errors.firstNameMr}
                          targetError={"firstName"}
                          helperText={
                            errors?.firstNameMr
                              ? errors.firstNameMr.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                    {/* ///////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: "80%" }}>
                        <Transliteration
                          _key={"middleName"}
                          fieldName={"middleName"}
                          updateFieldName={"middleNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="middleNameEn" required />}
                          error={!!errors.middleName}
                          targetError={"middleNameMr"}
                          helperText={
                            errors?.middleName
                              ? errors?.middleName.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: "80%" }}>
                        <Transliteration
                          _key={"middleNameMr"}
                          fieldName={"middleNameMr"}
                          updateFieldName={"middleName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="middleNameMr" required />}
                          error={!!errors.middleNameMr}
                          targetError={"middleName"}
                          helperText={
                            errors?.middleNameMr
                              ? errors.middleNameMr.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                    {/* ///////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: "80%" }}>
                        <Transliteration
                          _key={"lastName"}
                          fieldName={"lastName"}
                          updateFieldName={"lastNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="lastNameEn" required />}
                          error={!!errors.lastName}
                          targetError={"lastNameMr"}
                          helperText={
                            errors?.lastName ? errors?.lastName.message : null
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: "80%" }}>
                        <Transliteration
                          _key={"lastNameMr"}
                          fieldName={"lastNameMr"}
                          updateFieldName={"lastName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="lastNameMr" required />}
                          error={!!errors.lastNameMr}
                          targetError={"lastNameMr"}
                          helperText={
                            errors?.lastNameMr
                              ? errors?.lastNameMr.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                    {/* ///////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white", width: "80%" }}
                        error={!!errors.dateOfBirth}
                      >
                        <Controller
                          control={control}
                          name="dateOfBirth"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disableFuture
                                maxDate={maxDate}
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="dateOfBirth" required />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    variant="standard"
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.dateOfBirth
                            ? errors.dateOfBirth.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* //////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      {loadingWard ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            width: "100%",
                          }}
                        >
                          <FormControl sx={{ width: "80%" }}>
                            <InputLabel>
                              <FormattedLabel id="wardName" required />
                            </InputLabel>
                            <Select variant="standard"></Select>
                          </FormControl>
                          <CircularProgress size={15} color="error" />
                        </div>
                      ) : (
                        <FormControl
                          error={!!errors.ward}
                          sx={{ width: "80%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="wardName" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                }}
                                label="Ward Name"
                              >
                                {allWards &&
                                  allWards?.map((allWards, index) => (
                                    <MenuItem key={index} value={allWards.id}>
                                      {language == "en"
                                        ? //@ts-ignore
                                          allWards?.wardName
                                        : // @ts-ignore
                                          allWards?.wardNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="ward"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.ward ? errors.ward.message : null}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Grid>

                    {/* //////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      {loadingGenders ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            width: "100%",
                          }}
                        >
                          <FormControl sx={{ width: "80%" }}>
                            <InputLabel>
                              <FormattedLabel id="gender" required />
                            </InputLabel>
                            <Select variant="standard"></Select>
                          </FormControl>
                          <CircularProgress size={15} color="error" />
                        </div>
                      ) : (
                        <FormControl
                          error={!!errors.gender}
                          sx={{ width: "80%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="gender" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                }}
                                label="Gender"
                              >
                                {genders &&
                                  genders?.map((gender, index) => (
                                    <MenuItem key={index} value={gender.id}>
                                      {language == "en"
                                        ? //@ts-ignore
                                          gender?.genderEn
                                        : // @ts-ignore
                                          gender?.genderMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="gender"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.gender ? errors.gender.message : null}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Grid>
                    {/* ////////////  religion  //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      {loadingReligions ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            width: "100%",
                          }}
                        >
                          <FormControl sx={{ width: "80%" }}>
                            <InputLabel>
                              <FormattedLabel id="religion" required />
                            </InputLabel>
                            <Select variant="standard"></Select>
                          </FormControl>
                          <CircularProgress size={15} color="error" />
                        </div>
                      ) : (
                        <FormControl
                          error={!!errors.religion}
                          sx={{ width: "80%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="religion" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                }}
                                label="religion"
                              >
                                {religions &&
                                  religions?.map((religion, index) => (
                                    <MenuItem key={index} value={religion.id}>
                                      {language == "en"
                                        ? //@ts-ignore
                                          religion?.religionEn
                                        : // @ts-ignore
                                          religion?.religionMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="religion"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.religion ? errors.religion.message : null}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Grid>
                    {/* ///////////   caste & caste cft no.  ///////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      {loadingCaste ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            width: "100%",
                          }}
                        >
                          <FormControl sx={{ width: "80%" }}>
                            <InputLabel>
                              <FormattedLabel id="caste" required />
                            </InputLabel>
                            <Select variant="standard"></Select>
                          </FormControl>
                          <CircularProgress size={15} color="error" />
                        </div>
                      ) : (
                        <FormControl
                          error={!!errors.caste}
                          sx={{ width: "80%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="caste" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                }}
                                label="caste"
                              >
                                {casteData &&
                                  casteData?.map((caste, index) => (
                                    <MenuItem key={index} value={caste.id}>
                                      {language == "en"
                                        ? //@ts-ignore
                                          caste?.castEn
                                        : // @ts-ignore
                                          caste?.castMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="caste"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.caste ? errors.caste.message : null}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        sx={{ width: "80%" }}
                        InputLabelProps={{
                          shrink: watch("casteCertificateNo") ? true : false,
                        }}
                        label={
                          <FormattedLabel id="casteCertificateNo" required />
                        }
                        variant="standard"
                        {...register("casteCertificateNo")}
                        error={!!errors.casteCertificateNo}
                        helperText={
                          errors?.casteCertificateNo
                            ? errors.casteCertificateNo.message
                            : null
                        }
                      />
                    </Grid>
                    {/* ////////////  partyName  //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      {loadingParty ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            width: "100%",
                          }}
                        >
                          <FormControl sx={{ width: "80%" }}>
                            <InputLabel>
                              <FormattedLabel id="partyName" required />
                            </InputLabel>
                            <Select variant="standard"></Select>
                          </FormControl>
                          <CircularProgress size={15} color="error" />
                        </div>
                      ) : (
                        <FormControl
                          error={!!errors.party}
                          sx={{ width: "80%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="partyName" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                }}
                                label="partyName"
                              >
                                {partyNames &&
                                  partyNames?.map((party, index) => (
                                    <MenuItem key={index} value={party.id}>
                                      {language == "en"
                                        ? //@ts-ignore
                                          party?.partyNameEn
                                        : // @ts-ignore
                                          party?.partyNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="party"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.party ? errors.party.message : null}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Grid>
                    {/* //////////// idProofCategory //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      {loadingIdProof ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            width: "100%",
                          }}
                        >
                          <FormControl sx={{ width: "80%" }}>
                            <InputLabel>
                              <FormattedLabel id="idProofCategory" required />
                            </InputLabel>
                            <Select variant="standard"></Select>
                          </FormControl>
                          <CircularProgress size={15} color="error" />
                        </div>
                      ) : (
                        <FormControl
                          error={!!errors.idProofCategory}
                          sx={{ width: "80%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="idProofCategory" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                }}
                                label="idProofCategory"
                              >
                                {idProofsData &&
                                  idProofsData?.map((idProof, index) => (
                                    <MenuItem key={index} value={idProof.id}>
                                      {language == "en"
                                        ? //@ts-ignore
                                          idProof?.identificationProofDocumentEn
                                        : // @ts-ignore
                                          idProof?.identificationProofDocumentMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="idProofCategory"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.idProofCategory
                              ? errors.idProofCategory.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        sx={{ width: "80%" }}
                        InputLabelProps={{
                          shrink: watch("idProofNo") ? true : false,
                        }}
                        label={<FormattedLabel id="idProofNo" required />}
                        variant="standard"
                        {...register("idProofNo")}
                        error={!!errors.idProofNo}
                        helperText={
                          errors?.idProofNo ? errors.idProofNo.message : null
                        }
                      />
                    </Grid>
                    {/* //////////// PAN NO //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        sx={{ width: "80%" }}
                        InputLabelProps={{
                          shrink: watch("aadharNo") ? true : false,
                        }}
                        label={<FormattedLabel id="aadharNo" required />}
                        variant="standard"
                        {...register("aadharNo")}
                        error={!!errors.aadharNo}
                        helperText={
                          errors?.aadharNo ? errors.aadharNo.message : null
                        }
                      />
                    </Grid>
                    {/* ///////////// MOB. NO /////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        inputProps={{
                          maxLength: 10,
                        }}
                        // type="number"
                        sx={{ width: "80%" }}
                        InputLabelProps={{
                          shrink: watch("mobileNo") ? true : false,
                        }}
                        label={<FormattedLabel id="mobileNo" required />}
                        variant="standard"
                        {...register("mobileNo")}
                        error={!!errors.mobileNo}
                        helperText={
                          errors?.mobileNo ? errors.mobileNo.message : null
                        }
                      />
                    </Grid>
                    {/* ///////////// EMAIL ID /////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        sx={{ width: "80%" }}
                        InputLabelProps={{
                          shrink: watch("emailAddress") ? true : false,
                        }}
                        label={<FormattedLabel id="emailAddress" required />}
                        variant="standard"
                        {...register("emailAddress")}
                        error={!!errors.emailAddress}
                        helperText={
                          errors?.emailAddress
                            ? errors.emailAddress.message
                            : null
                        }
                      />
                    </Grid>

                    {/* ////////////  ADDRESS ENGLISH //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "0% 3.5%",
                      }}
                    >
                      <Paper
                        elevation={1}
                        style={{
                          width: "100%",
                          // border: "1px solid black",
                        }}
                      >
                        {/* <span style={{ fontSize: "16px" }}>
                          {<FormattedLabel id="address" required />}
                        </span>
                        <TextareaAutosize
                          style={{ overflow: "auto" }}
                          placeholder={
                            language == "en"
                              ? "Address In English"
                              : "पत्ता इंग्लिश मधे"
                          }
                          className={styles.bigText}
                          {...register("address")}
                          error={!!errors.address}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.address ? errors.address.message : null}
                        </FormHelperText> */}
                        <Box sx={{ width: "100%" }}>
                          <Transliteration
                            _key={"address"}
                            fieldName={"address"}
                            updateFieldName={"addressMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={<FormattedLabel id="addressEn" required />}
                            error={!!errors.address}
                            targetError={"addressMr"}
                            helperText={
                              errors?.address ? errors?.address.message : null
                            }
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    {/* ////////////  ADDRESS MARATHI //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "0% 3.5%",
                      }}
                    >
                      <Paper elevation={1} style={{ width: "100%" }}>
                        <Box sx={{ width: "100%" }}>
                          <Transliteration
                            _key={"addressMr"}
                            fieldName={"addressMr"}
                            updateFieldName={"address"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={<FormattedLabel id="addressMr" required />}
                            error={!!errors.addressMr}
                            targetError={"address"}
                            helperText={
                              errors?.addressMr
                                ? errors?.addressMr.message
                                : null
                            }
                          />
                        </Box>
                      </Paper>
                    </Grid>

                    {/* ////////////  ELECTED DATE  //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white", width: "40%" }}
                        error={!!errors.electedDate}
                      >
                        <Controller
                          control={control}
                          name="electedDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disableFuture
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="electedDate" required />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    variant="standard"
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.electedDate
                            ? errors.electedDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* ////////////  RESIGN DATE  //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white", width: "40%" }}
                        error={!!errors.resignDate}
                      >
                        <Controller
                          control={control}
                          name="resignDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disableFuture
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="resignDate" />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    variant="standard"
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.resignDate
                            ? errors.resignDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* ////////////  REASON ENGLISH //////////// */}

                    {watch("resignDate") ? (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "left",
                          alignItems: "center",
                          flexDirection: "column",
                          margin: "0% 3.5%",
                        }}
                      >
                        <Paper elevation={1} style={{ width: "100%" }}>
                          <Box sx={{ width: "100%" }}>
                            <Transliteration
                              _key={"reason"}
                              fieldName={"reason"}
                              updateFieldName={"reasonMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              label={<FormattedLabel id="reasonEn" />}
                              error={!!errors.reason}
                              targetError={"reasonMr"}
                              helperText={
                                errors?.reason ? errors?.reason.message : null
                              }
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    ) : (
                      ""
                    )}

                    {/* ////////////  REASON MARATHI //////////// */}
                    {watch("resignDate") ? (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "left",
                          alignItems: "center",
                          flexDirection: "column",
                          margin: "0% 3.5%",
                        }}
                      >
                        <Paper elevation={1} style={{ width: "100%" }}>
                          <Box sx={{ width: "100%" }}>
                            <Transliteration
                              _key={"reasonMr"}
                              fieldName={"reasonMr"}
                              updateFieldName={"reason"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              label={<FormattedLabel id="reasonMr" />}
                              error={!!errors.reasonMr}
                              targetError={"reason"}
                              helperText={
                                errors?.reasonMr
                                  ? errors?.reasonMr.message
                                  : null
                              }
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    ) : (
                      ""
                    )}

                    {/* ////////////  BANK DETAILS HEDING  //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                        marginTop: "14px",
                      }}
                    >
                      <Box
                        className={styles.details}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "30%",
                          height: "auto",
                          overflow: "auto",
                          padding: "0.1%",
                          color: "white",
                          fontSize: 15,
                          fontWeight: 350,
                          borderRadius: 100,
                          letterSpacing: "2px",
                        }}
                      >
                        <strong>
                          <FormattedLabel id="bankDetails" />
                        </strong>
                      </Box>
                    </Grid>

                    {/* ////////////  BANK NAME  //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      {loadingBanks ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            width: "100%",
                          }}
                        >
                          <FormControl sx={{ width: "80%" }}>
                            <InputLabel>
                              <FormattedLabel id="bankName" required />
                            </InputLabel>
                            <Select variant="standard"></Select>
                          </FormControl>
                          <CircularProgress size={15} color="error" />
                        </div>
                      ) : (
                        <FormControl
                          error={!!errors.bankName}
                          sx={{ width: "80%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="bankName" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                }}
                                label="bankName"
                              >
                                {bankNames &&
                                  bankNames?.map((bankName, index) => (
                                    <MenuItem key={index} value={bankName.id}>
                                      {language == "en"
                                        ? //@ts-ignore
                                          bankName?.bankNameEn
                                        : // @ts-ignore
                                          bankName?.bankNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="bankName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.bankName ? errors.bankName.message : null}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Grid>

                    {/* ////////////  BRANCH NAME  //////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      {loadingBanks ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            width: "100%",
                          }}
                        >
                          <FormControl sx={{ width: "80%" }}>
                            <InputLabel>
                              <FormattedLabel id="branchName" required />
                            </InputLabel>
                            <Select
                              sx={{ width: "198px" }}
                              variant="standard"
                              multiple
                              fullWidth
                            ></Select>
                          </FormControl>
                          <CircularProgress size={15} color="error" />
                        </div>
                      ) : (
                        <FormControl
                          error={!!errors.branchName}
                          sx={{ width: "80%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="branchName" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                }}
                                label="branchName"
                              >
                                {bankBranchNames &&
                                  bankBranchNames?.map(
                                    (bankBranchName, index) => (
                                      <MenuItem
                                        key={index}
                                        value={bankBranchName.id}
                                      >
                                        {language == "en"
                                          ? //@ts-ignore
                                            bankBranchName?.branchNameEn
                                          : // @ts-ignore
                                            bankBranchName?.branchNameMr}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="branchName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.branchName
                              ? errors.branchName.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Grid>

                    {/* ///////////// SAVING ACCOUNT NO /////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        sx={{ width: "80%" }}
                        InputLabelProps={{
                          shrink: watch("savingAccountNo") ? true : false,
                        }}
                        label={<FormattedLabel id="savingAccountNo" required />}
                        variant="standard"
                        {...register("savingAccountNo")}
                        error={!!errors.savingAccountNo}
                        helperText={
                          errors?.savingAccountNo
                            ? errors.savingAccountNo.message
                            : null
                        }
                      />
                    </Grid>

                    {/* ///////////// bankIFSCcode /////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        sx={{ width: "80%" }}
                        InputLabelProps={{
                          shrink: watch("bankIfscCode") ? true : false,
                        }}
                        label={<FormattedLabel id="bankIFSCcode" required />}
                        variant="standard"
                        {...register("bankIfscCode")}
                        error={!!errors.bankIfscCode}
                        helperText={
                          errors?.bankIfscCode
                            ? errors.bankIfscCode.message
                            : null
                        }
                      />
                    </Grid>

                    {/* ///////////// bankMICRcode /////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        sx={{ width: "80%" }}
                        InputLabelProps={{
                          shrink: watch("bankMicrCode") ? true : false,
                        }}
                        label={<FormattedLabel id="bankMICRcode" required />}
                        variant="standard"
                        {...register("bankMicrCode")}
                        error={!!errors.bankMicrCode}
                        helperText={
                          errors?.bankMicrCode
                            ? errors.bankMicrCode.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* ///////////////////////////////////////// */}

                  <Grid
                    container
                    style={{
                      // padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={2}
                      sm={2}
                      md={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Paper
                        elevation={4}
                        style={{ margin: "30px", width: "auto" }}
                      >
                        <Button
                          size="small"
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {language === "en" ? btnSaveText : btnSaveTextMr}
                        </Button>
                      </Paper>
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      sm={2}
                      md={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Paper
                        elevation={4}
                        style={{ margin: "30px", width: "auto" }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Paper>
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      sm={2}
                      md={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Paper
                        elevation={4}
                        style={{ margin: "30px", width: "auto" }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <Grid
          container
          style={{ padding: "10px" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={9}></Grid>
          {!loading && (
            <Grid
              item
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  })
                  setEditButtonInputState(true)
                  setBtnSaveText("Save")
                  setBtnSaveTextMr("जतन करा")
                  setButtonInputState(true)
                  setSlideChecked(true)
                  setIsOpenCollapse(!isOpenCollapse)
                }}
              >
                {<FormattedLabel id="add" />}
              </Button>
            </Grid>
          )}
        </Grid>
        <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
          {loading ? (
            <Loader />
          ) : data.length !== 0 ? (
            <div style={{ width: "100%" }}>
              <DataGrid
                sx={{
                  overflowY: "scroll",
                  backgroundColor: "white",
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

                  // "& .MuiSvgIcon-root": {
                  //   color: "black", // change the color of the check mark here
                  // },
                }}
                // disableColumnFilter
                // disableColumnSelector
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 0 },
                    disableExport: true,
                    disableToolbarButton: false,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                density="compact"
                autoHeight={true}
                pagination
                paginationMode="server"
                rowCount={data?.totalRows}
                rowsPerPageOptions={data?.rowsPerPageOptions}
                page={data?.page}
                pageSize={data?.pageSize}
                rows={data?.rows}
                columns={columns}
                onPageChange={(_data) => {
                  getAllCorporatorsData(data?.pageSize, _data)
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data)

                  getAllCorporatorsData(_data, data?.page)
                }}
              />
            </div>
          ) : (
            ""
          )}
        </Box>

        {/* MODEL FOR ERROR SHOWING */}
        <Modal
          open={showErrorModel}
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
              background: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              border: "2px solid blue",
              borderRadius: 5,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 3)",
            }}
          >
            {errorData?.map((obj, ind) => {
              return (
                <TextField
                  // disabled={true}
                  sx={{
                    width: "90%",
                    padding: "10px",
                    borderRadius: 2,
                    "& .MuiInput-input": {
                      color: "red", // Set the text color to red
                    },
                    marginTop: "5px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  // label={<FormattedLabel id="" />}
                  label={`Error ${ind + 1}`}
                  variant="standard"
                  value={obj?.code}
                />
              )
            })}
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                setShowErrorModel(false)
              }}
              sx={{ margin: "5px 0px 2px 0px" }}
            >
              {language == "en" ? "close" : "बंद करा"}
            </Button>
          </Box>
        </Modal>
      </Paper>
    </div>
    // </ThemeProvider>
  )
}

export default Index
