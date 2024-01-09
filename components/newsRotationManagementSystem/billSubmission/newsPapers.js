//get penaltyIds for the current index; if length > 0 then setData(penaltyData), else original api call
//PenaltyData: amount to be displayed ONLY if penalty checked

import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import axios from "axios"
import moment from "moment"
import { useRouter } from "next/router"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { useSelector } from "react-redux"
import urls from "../../../URLS/urls"
import UploadButtonOP from "../../../components/newsRotationManagementSystem/FileUpload/DocumentsUploadOP"
import tableStyle from "./table.module.css"
import { toast } from "react-toastify"
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks"

// newspaper
const NewsPapers = () => {
  let appName = "NRMS"
  let serviceName = "N-BS"
  const language = useSelector((state) => state?.labels.language)
  const router = useRouter()
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext({})

  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  const userToken = useGetToken()

  // FOR BILL NOT SUBMITTED
  const [billNotSubmitCount, setBillNotSubmitCount] = useState(
    getValues("newspapersLst")?.length
  )
  const [billSubmitCount, setBillSubmitCount] = useState(0)
  const [billTotalCount, setBillTotalCount] = useState(
    getValues("newspapersLst")?.length
  )
  const [billNotSubmitChecked, setBillNotSubmitChecked] = useState(true)

  const { append } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "prePaymentDetails", // unique name for your Field Array
  })

  useEffect(() => {
    getValues(`prePaymentDetails`)?.[currentIndex - 1]?.totalNetAmount < 0 &&
      sweetAlert(
        "Warning!",
        language == "en"
          ? "Total Payable Should Be Greater Than Zero"
          : "एकूण रक्कम शून्यापेक्षा जास्त असावी",
        "warning"
      )
  }, [watch(`prePaymentDetails`)?.[currentIndex - 1]?.totalNetAmount])

  useEffect(() => {
    if (currentIndex > 0) {
      setSelectedRows(
        getValues("prePaymentDetails")[currentIndex - 1]?.penaltyIds ?? []
      )
      setData(
        getValues("prePaymentDetails")[currentIndex - 1]
          ?.trnPenaltyDeductionDaoList ?? []
      )
    }
  }, [currentIndex])

  useEffect(() => {
    openModal && fetchData()
  }, [openModal])

  useEffect(() => {
    let total = 0
    data?.forEach((item) => {
      if (selectedRows?.includes(item?.id) || router.query.pageMode != "Add") {
        total += item?.amount ? item?.amount : 0
      }
    })
    setTotalAmount(total)
  }, [selectedRows, data])

  useEffect(() => {
    handleStandardFormatSize(
      currentIndex - 1,
      watch(`prePaymentDetails.${currentIndex - 1}.standardFormatSize`)
    )
  }, [watch(`prePaymentDetails.${currentIndex - 1}.standardFormatSize`)])

  useEffect(() => {
    // const countForBillNotSubmit = getValues("prePaymentDetails")?.reduce(
    //   (acc, obj) => acc + (!obj.isChecked ? 1 : 0),
    //   0
    // );

    const countForBillSubmit = getValues("prePaymentDetails")?.reduce(
      (acc, obj) => acc + (obj.isChecked ? 1 : 0),
      0
    )
    setBillNotSubmitCount(
      getValues("newspapersLst")?.length - countForBillSubmit
    )
    setBillSubmitCount(countForBillSubmit)
    // setBillTotalCount(getValues("prePaymentDetails")?.length);
  }, [
    currentIndex,
    billNotSubmitChecked,
    getValues("prePaymentDetails")?.length,
  ])

  const handleModalOpen = () => setOpenModal(true)
  const handleModalClose = () => setOpenModal(false)
  const previousPapers = () => setCurrentIndex(currentIndex - 1)

  const fetchData = () => {
    // Simulated fetch function (replace with actual fetch call)
    axios
      .get(`${urls.NRMS}/mstPenaltyHeads/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setData(
          router.query.pageMode == "Add" || router.query.pageMode == "Edit"
            ? r?.data?.mstPenaltyHeads?.map((obj, index) => ({
                ...obj,
                times: 0,
                amount:
                  getValues(
                    `prePaymentDetails.${
                      currentIndex - 1
                    }.trnPenaltyDeductionDaoList.${index}.amount`
                  ) ?? 0,
                // amount: 0,
                isChecked: false,
              }))
            : getValues(
                `prePaymentDetails.${
                  currentIndex - 1
                }.trnPenaltyDeductionDaoList`
              )?.map((j) => ({
                ...j,
                pointDesc: r?.data?.mstPenaltyHeads?.find(
                  (obj) => obj.id == j.penaltyKey
                )?.pointDesc,
                pointDescMr: r?.data?.mstPenaltyHeads?.find(
                  (obj) => obj.id == j.penaltyKey
                )?.pointDescMr,
              }))
        )
      })
  }

  const handleChangeNewsPaper = (value, index) => {
    const body = {
      newsPaperGroupKey: getValues("rotationGroupKey"),
      newsPaperSubGroupKey: getValues("rotationSubGroupKey"),
      newsPaperLevel: getValues("newsPaperLevel"),
      newsPaperName: value,
      standardFormatSize: getValues("standardFormatSize"),
    }

    axios
      .post(`${urls.NRMS}/rateChargeMaster/getByInps`, body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        let rateOfNewsPaper = r?.data[0]?.amount ? r?.data[0]?.amount : 0
        setValue(`prePaymentDetails.${index}.calculatedRate`, rateOfNewsPaper)

        setValue(
          `prePaymentDetails.${index}.newsPaperName`,
          // r?.data[0]?.setNewsPaperNameTxt
          r?.data[0]?.newsPaperNameTxt
        )

        setValue(
          `prePaymentDetails.${index}.newsPaperNameMr`,
          // r?.data[0]?.setNewsPaperNameTxtMr
          r?.data[0]?.newsPaperNameTxtMr
        )

        setValue(
          `prePaymentDetails.${index}.agencyPublishedDate`,
          getValues("newsPublishDate")
        )
      })
  }

  const handleStandardFormatSize = (index, value) => {
    if (index >= 0) {
      let totalAmount =
        getValues(`prePaymentDetails.${index}.calculatedRate`) * value

      setValue(`prePaymentDetails.${index}.totalAmount`, totalAmount)

      let tds = Math.round(totalAmount * 0.02)

      setValue(`prePaymentDetails.${index}.totalTaxDeduction`, tds)

      setValue(
        `prePaymentDetails.${index}.totalNetAmount`,
        Number(
          totalAmount - watch(`prePaymentDetails.${index}.totalDeduction`) - tds
        )
      )

      let sumTotalNetAmount = 0
      let sumTotalAmount = 0
      let sumTotalTDS = 0
      let sumTotalPenalty = 0

      getValues("prePaymentDetails")?.map((r) => {
        sumTotalAmount += parseFloat(r.totalAmount)
        sumTotalTDS += parseFloat(r.totalTaxDeduction)
        sumTotalNetAmount += parseFloat(r.totalNetAmount)
      })

      setValue("totalAmount", sumTotalAmount)
      setValue("totalTDS", sumTotalTDS)
      setValue("totalNetAmount", sumTotalNetAmount)
    }
  }

  const handlePenaltyDeductions = (index, value) => {
    setValue(
      `prePaymentDetails.${index}.totalNetAmount`,
      getValues(`prePaymentDetails.${index}.totalAmount`) -
        getValues(`prePaymentDetails.${index}.totalTaxDeduction`) -
        value
    )
    if (value > 0) {
      setValue(
        `prePaymentDetails.${index}.remark`,
        "Penalty for " +
          selectedRows
            ?.map((j) => data.find((obj) => obj.id == j)?.pointDesc)
            .join(",")
      )
    } else {
      setValue(`prePaymentDetails.${index}.remark`, "")
    }

    let sumTotalNetAmount = 0
    let sumTotalPenalty = 0

    let allObjects = getValues("prePaymentDetails")

    allObjects.forEach((rr) => {
      sumTotalPenalty += Number(rr?.totalDeduction ?? 0)
      sumTotalNetAmount += Number(rr?.totalNetAmount ?? 0)
    })

    setValue("totalPenalty", sumTotalPenalty)
    setValue("totalNetAmount", sumTotalNetAmount)
  }

  const handleDescChange = (index, desc = "") => {
    const newData = [...data]
    newData[index].description = desc
    setData(newData)
  }

  const handleInputChange = (index, value = 0) => {
    const newData = [...data]
    newData[index].times =
      newData[index].isFixed || newData[index].pointDesc == "Other"
        ? 1
        : // : newData[index].amount / newData[index].rate
          Number(value)
    newData[index].amount = newData[index].isFixed
      ? newData[index].rate
      : value * newData[index].rate
    setData(newData)
  }
  const handleInputChangeForAmount = (index, value) => {
    const newData = [...data]
    newData[index].amount = Number(value)

    setData(newData)
    setTotalAmount(0)
  }

  const calculateTotalAmount = () => {
    if (currentIndex - 1 >= 0) {
      let total = 0
      data?.forEach((item) => {
        if (selectedRows?.includes(item.id)) {
          total += item.amount ? item.amount : 0
        }
      })

      setValue(
        `prePaymentDetails.${currentIndex - 1}.totalDeduction`,
        Number(total)
      )
      setValue(`prePaymentDetails.${currentIndex - 1}.penaltyIds`, selectedRows)

      setValue(
        `prePaymentDetails.${currentIndex - 1}.trnPenaltyDeductionDaoList`,
        data.map((j) => ({
          penaltyKey: j.id,
          isChecked: j.isChecked,
          times: j.times ?? 0,
          amount: j.amount,
          rate: j.rate,
          description: j.description ?? "",
        }))
      )
      handlePenaltyDeductions(currentIndex - 1, Number(total))
      handleModalClose()
    }
  }

  const saveAndNext = () => {
    setTotalAmount(0)
    setSelectedRows([]) // Cleared penalty deduction array of Ids for another newspaper's use

    console.log("Akkha: ", getValues("prePaymentDetails"))

    if (currentIndex <= getValues(`newspapersLst`)?.length) {
      if (
        router?.query?.pageMode == "Add" ||
        router?.query?.pageMode == "Edit"
      ) {
        // if (true) {
        //Data of newspaper from newsPaperLst
        const newsPaperObj = getValues("newspapersLst")?.[currentIndex]

        //User filled data of newspaper
        const actualObj = getValues(`prePaymentDetails`)?.[currentIndex]

        const {
          id,
          accountNo,
          activeFlag,
          address,
          addressMr,
          bank,
          branch,
          ifsc,
          newspaperName,
          newspaperNameMr,
          newspaperAgencyName,
          newspaperAgencyNameMr,
          newspaperKey,
          newspaperLevel,
          remark,
          rotationGroupKey,
          rotationGroupName,
          rotationSubGroupKey,
          rotationSubGroupName,
          emailId,
          createDtTm,
          contactNumber,
          ...restNewspaperObj
        } = newsPaperObj

        const tempData = {
          ...restNewspaperObj,

          newsPaper: id,
          isChecked: true,
          billAtachment: "",
          penaltyIds: [],
          trnPenaltyDeductionDaoList: [],
          length: 0,
          width: 0,
          standardFormatSize: 0,
          calculatedRate: 0,
          totalAmount: 0,
          totalTaxDeduction: 0,
          totalNetAmount: 0,
          ...actualObj,
        }

        if (currentIndex >= 0) {
          !!getValues(`prePaymentDetails`)[currentIndex]
            ? //Updates existing object in the array
              setValue(`prePaymentDetails[${currentIndex}]`, tempData)
            : //Adds new object in the array
              append(tempData)

          handleChangeNewsPaper(tempData?.newsPaper, currentIndex)
        }

        toast.success(
          currentIndex == 0
            ? "Papers Loads Successfully..."
            : "Record Saved Successfully..."
        )
      }
      setCurrentIndex(currentIndex + 1)
      setBillNotSubmitChecked(false)
    }
  }

  const renderRows = () => {
    return data?.map((item, index) => (
      <tr key={item?.id}>
        {(router.query.pageMode == "Add" ||
          router.query.pageMode == "Edit") && (
          <td
            style={{
              textAlign: "center",
              width: "100px !important",
            }}
          >
            <input
              style={{ cursor: "pointer", height: "15px", width: "15px" }}
              type="checkbox"
              checked={selectedRows?.includes(item?.id)}
              onChange={(e) => {
                selectedRows?.includes(item?.id)
                  ? setSelectedRows((prev) => prev.filter((j) => j != item?.id))
                  : // @ts-ignore
                    setSelectedRows((prev) => [...prev, item?.id])
                e.target.checked && handleInputChange(index)
              }}
            />
          </td>
        )}
        <td>{index + 1}</td>
        <td>{language == "en" ? item.pointDesc : item.pointDescMr}</td>
        {item.isFixed && item.pointDesc !== "Other" ? (
          <td>---</td>
        ) : item.pointDesc == "Other" ? (
          <td>
            {router.query.pageMode == "Add" ||
            router.query.pageMode == "Edit" ? (
              <input
                disabled={!selectedRows?.includes(item.id)}
                // defaultValue=''
                defaultValue={
                  getValues(
                    `prePaymentDetails.${
                      currentIndex - 1
                    }.trnPenaltyDeductionDaoList.${index}.description`
                  ) ?? ""
                }
                placeholder={
                  selectedRows?.includes(item.id)
                    ? language == "en"
                      ? "Enter penalty description"
                      : "दंडाचे वर्णन प्रविष्ट करा"
                    : language == "en"
                    ? "Select this penalty first"
                    : "प्रथम हा दंड निवडा"
                }
                className={tableStyle.table_Input}
                {...register(
                  `prePaymentDetails.${
                    currentIndex - 1
                  }.trnPenaltyDeductionDaoList.${index}.description`
                )}
                onChange={(e) => handleDescChange(index, e.target.value)}
              />
            ) : (
              getValues(
                `prePaymentDetails.${
                  currentIndex - 1
                }.trnPenaltyDeductionDaoList.${index}.description`
              ) ?? "---"
            )}
          </td>
        ) : (
          <td>
            {router.query.pageMode == "Add" ||
            router.query.pageMode == "Edit" ? (
              <input
                style={{
                  border: "1px solid black",
                  width: "200px",
                  textAlign: "center",
                }}
                disabled={!selectedRows?.includes(item.id)}
                placeholder={
                  selectedRows?.includes(item.id)
                    ? language == "en"
                      ? "No. of times"
                      : "किती वेळा"
                    : language == "en"
                    ? "Select this penalty first"
                    : "प्रथम हा दंड निवडा"
                }
                type="number"
                min={0}
                // defaultValue={0}
                defaultValue={
                  getValues(
                    `prePaymentDetails.${
                      currentIndex - 1
                    }.trnPenaltyDeductionDaoList.${index}.times`
                  ) ?? 0
                }
                className={tableStyle.table_Input}
                {...register(
                  `prePaymentDetails.${
                    currentIndex - 1
                  }.trnPenaltyDeductionDaoList.${index}.times`
                )}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ) : (
              getValues(
                `prePaymentDetails.${
                  currentIndex - 1
                }.trnPenaltyDeductionDaoList.${index}.times`
              ) ?? 0
            )}
          </td>
        )}

        <td>{item.pointDesc == "Other" ? "---" : item.rate}</td>
        {/* */}
        {item.pointDesc == "Other" ? (
          <td>
            {router.query.pageMode == "Add" ||
            router.query.pageMode == "Edit" ? (
              <input
                min={0}
                type="number"
                // disabled={!selectedRows?.has(item.id)}
                disabled={!selectedRows?.includes(item.id)}
                defaultValue={
                  getValues(
                    `prePaymentDetails.${
                      currentIndex - 1
                    }.trnPenaltyDeductionDaoList.${index}.amount`
                  ) ?? 0
                }
                placeholder={
                  selectedRows?.includes(item.id)
                    ? language == "en"
                      ? "Enter penalty amount"
                      : "दंडाची रक्कम प्रविष्ट करा"
                    : language == "en"
                    ? "Select this penalty first"
                    : "प्रथम हा दंड निवडा"
                }
                className={tableStyle.table_Input}
                onChange={(e) =>
                  handleInputChangeForAmount(index, e.target.value)
                }
              />
            ) : (
              getValues(
                `prePaymentDetails.${
                  currentIndex - 1
                }.trnPenaltyDeductionDaoList.${index}.amount`
              ) ?? 0
            )}
          </td>
        ) : (
          <td>{item.amount}</td>
        )}
      </tr>
    ))
  }

  // SAVE AS DRAFT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
  const onSubmitForm = (formData) => {
    // Save - DB
    let _body = {
      ...formData,
      // attachments: finalFiles,
      financialYear: selectedYearId,
      activeFlag: formData.activeFlag,
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

    if (formData?.id) {
      sweetAlert({
        title: "Are you sure?",
        text: "If you clicked yes your request get saved, otherwise not!",
        icon: "warning",
        buttons: ["Cancel", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((will) => {
        if (will) {
          axios
            .post(`${urls.NRMS}/trnNewsPublishRequest/save`, _body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
                serviceId: `${selectedMenuFromDrawer}`,
              },
            })
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
                router.back()
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                })
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                })
              }
            })
        }
      })
    } else {
      sweetAlert({
        title: "Are you sure?",
        text: "If you clicked yes your request get saved, otherwise not!",
        icon: "warning",
        buttons: ["Cancel", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((will) => {
        if (will) {
          axios
            .post(`${urls.NRMS}/trnNewsPublishRequest/save`, _body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
                serviceId: `${selectedMenuFromDrawer}`,
              },
            })
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                sweetAlert("Saved!", "Record Saved successfully !", "success")
                router.back()
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                })
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                })
              }
            })
        }
      })
    }
  }

  return (
    <>
      <Grid item xl={8} lg={8} md={8} sm={8} xs={8}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            margin: "10px 30px",
          }}
        >
          <strong style={{ color: "red" }}>
            {language == "en" ? "Bill Not Submitted:" : "बिल सबमिट केले नाही:"}{" "}
            {billNotSubmitCount}
          </strong>
          <strong style={{ color: "green" }}>
            {language == "en" ? "Bill Submitted:" : "बिल सादर केले:"}{" "}
            {billSubmitCount}
          </strong>
          <strong style={{ color: "blue" }}>
            {language == "en" ? "Total:" : "एकूण:"} {billTotalCount}
          </strong>
        </div>
      </Grid>
      {(router.query.pageMode == "Add" || router.query.pageMode == "Edit"
        ? getValues("newspapersLst")
        : getValues("prePaymentDetails")
      )?.map((newspaper, index) => {
        if (index + 1 == currentIndex) {
          return (
            <Paper
              key={index}
              elevation={8}
              variant="outlined"
              sx={{
                border: 1,
                borderColor: "grey.500",
                margin: "10px",
                marginBottom: "0px",
                padding: 1,
              }}
            >
              <Grid key={index}>
                <Grid container>
                  <Grid
                    item
                    sx={{
                      background:
                        "linear-gradient(90deg, rgb(7 110 230 / 91%) 2%, rgb(210 242 249) 100%)",
                      borderTopLeftRadius: "15px",
                      borderBottomLeftRadius: "15px",
                      marginLeft: "50px",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "250px",
                        padding: "8px",
                        paddingLeft: "15px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "white",
                          textShadow: "0px 2px 4px rgba(0,0,0,0.59)",
                        }}
                      >
                        {(language == "en" ? "News Paper" : "वृत्तपत्र") +
                          ": " +
                          // (index + 1)}
                          currentIndex}
                      </h3>
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid container sx={{ margin: "0.5vh" }}>
                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={3}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Controller
                            control={control}
                            name={`prePaymentDetails.${index}.isChecked`}
                            defaultValue={false}
                            render={({ field }) => (
                              <Checkbox
                                disabled={
                                  getValues("id") && getValues("id") != null
                                    ? watch("status") ==
                                      "REVERT_BACK_TO_DEPT_USER"
                                      ? false
                                      : watch(
                                          `prePaymentDetails.${index}.standardFormatSize`
                                        ) != 0 && getValues("id")
                                    : watch(
                                        `prePaymentDetails.${index}.standardFormatSize`
                                      ) != 0
                                  // (watch(
                                  //   `prePaymentDetails.${index}.standardFormatSize`
                                  // ) != 0
                                  //   ? true
                                  //   : false) || getValues("id")
                                }
                                sx={{ marginLeft: 5 }}
                                {...field}
                                checked={watch(
                                  `prePaymentDetails.${index}.isChecked`
                                )}
                                onChange={(e) => {
                                  !e.target.checked
                                    ? setValue(
                                        `prePaymentDetails.${index}.remark`,
                                        "Bill Not Submitted"
                                      )
                                    : setValue(
                                        `prePaymentDetails.${index}.remark`,
                                        ""
                                      )
                                  setValue(
                                    `prePaymentDetails.${index}.disabled`,
                                    !e.target.checked
                                  )
                                  setValue(
                                    `prePaymentDetails.${index}.isChecked`,
                                    e.target.checked
                                  )

                                  // setBillNotSubmitChecked(!e.target.checked)
                                  setBillNotSubmitChecked(!billNotSubmitChecked)
                                  // toast.success(
                                  //   e.target.checked == true
                                  //     ? `Bill Submitted!`
                                  //     : `Bill Not Submitted!`
                                  // )
                                  // setwatch(`prePaymentDetails.${index}.disabled`)(true);
                                }}
                              />
                            )}
                          />
                        }
                      />

                      <TextField
                        disabled={true}
                        sx={{ marginRight: 4, width: 230 }}
                        id="standard-basic"
                        multiline
                        value={
                          newspaper[
                            router.query.pageMode == "Add" ||
                            router.query.pageMode == "Edit"
                              ? language == "en"
                                ? "newspaperName"
                                : "newspaperNameMr"
                              : language == "en"
                              ? "newsPaperName"
                              : "newsPaperNameMr"
                          ]
                        }
                        label={language == "en" ? "News Paper" : "वृत्तपत्र"}
                        variant="standard"
                        key={newspaper.id}
                        InputLabelProps={{
                          shrink:
                            !!newspaper[
                              router.query.pageMode == "Add" ||
                              router.query.pageMode == "Edit"
                                ? language == "en"
                                  ? "newspaperName"
                                  : "newspaperNameMr"
                                : language == "en"
                                ? "newsPaperName"
                                : "newsPaperNameMr"
                            ],
                        }}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={3}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled={
                          getValues("id") && getValues("id") != null
                            ? watch("status") == "REVERT_BACK_TO_DEPT_USER"
                              ? false
                              : watch(`prePaymentDetails.${index}.disabled`) &&
                                getValues("id") &&
                                getValues("status") != "DRAFTED"
                            : watch(`prePaymentDetails.${index}.disabled`)

                          // watch(`prePaymentDetails.${index}.disabled`) ||
                          // getValues("id")
                        }
                        sx={{ width: 230 }}
                        id="standard-basic"
                        label={language == "en" ? "Bill No." : "बिल क्र"}
                        variant="standard"
                        key={newspaper.id}
                        {...register(`prePaymentDetails.${index}.billNo`)}
                        error={!!errors?.prePaymentDetails?.[index]?.billNo}
                        helperText={
                          errors?.prePaymentDetails?.[index]?.billNo
                            ? errors?.prePaymentDetails?.[index]?.billNo.message
                            : null
                        }
                        // onChange={(e) => {
                        //   handleValueChange(index, e.target.value)
                        //   //,handleValidate(index, e.target.value);
                        // }}
                        InputLabelProps={{
                          shrink: newspaper.shrink,
                        }}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={3}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors?.prePaymentDetails?.[index]?.billDate}
                      >
                        <Controller
                          control={control}
                          name="billDate"
                          defaultValue={null}
                          key={newspaper.id}
                          {...register(`prePaymentDetails.${index}.billDate`)}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                minDate={watch(
                                  `prePaymentDetails.${index}.agencyPublishedDate`
                                )}
                                disabled={
                                  getValues("id") && getValues("id") != null
                                    ? watch("status") ==
                                      "REVERT_BACK_TO_DEPT_USER"
                                      ? false
                                      : watch(
                                          `prePaymentDetails.${index}.disabled`
                                        ) &&
                                        getValues("id") &&
                                        getValues("status") != "DRAFTED"
                                    : watch(
                                        `prePaymentDetails.${index}.disabled`
                                      )
                                  // watch(
                                  //   `prePaymentDetails.${index}.disabled`
                                  // ) || getValues("id")
                                }
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span>
                                    {language == "en"
                                      ? "Bill Date"
                                      : "बिल दिनांक"}
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => {
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                  // handleValidate2(
                                  //   index,
                                  //   moment(date).format("YYYY-MM-DD")
                                  // );
                                }}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    error={
                                      !!errors?.prePaymentDetails?.[index]
                                        ?.billDate
                                    }
                                    sx={{ marginRight: 3, width: 230 }}
                                    {...params}
                                    size="small"
                                    fullWidth
                                    // onChange={(e) => {
                                    //   handleValueChange(index, e.target.value)
                                    // }}
                                    InputLabelProps={{
                                      shrink: newspaper.shrink,
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.prePaymentDetails?.[index]?.billDate
                            ? errors?.prePaymentDetails?.[index]?.billDate
                                .message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={3}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={
                          !!errors?.prePaymentDetails?.[index]
                            ?.agencyPublishedDate
                        }
                        sx={{ marginTop: 0 }}
                      >
                        <Controller
                          control={control}
                          name="agencyPublishedDate"
                          defaultValue={null}
                          key={newspaper.id}
                          {...register(
                            `prePaymentDetails.${index}.agencyPublishedDate`
                          )}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                minDate={watch("newsPublishDate")}
                                maxDate={watch(
                                  `prePaymentDetails.${index}.billDate`
                                )}
                                disabled={
                                  getValues("id") && getValues("id") != null
                                    ? watch(
                                        `prePaymentDetails.${index}.disabled`
                                      ) &&
                                      getValues("id") &&
                                      getValues("status") != "DRAFTED"
                                    : watch(
                                        `prePaymentDetails.${index}.disabled`
                                      )
                                  // watch(
                                  //   `prePaymentDetails.${index}.disabled`
                                  // ) || getValues("id")
                                }
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span>
                                    {language == "en"
                                      ? "Published Date"
                                      : "प्रकाशन दिनांक"}
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => {
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ marginRight: 3, width: 230 }}
                                    {...params}
                                    size="small"
                                    fullWidth
                                    // onChange={(e) =>
                                    //   handleValueChange(index, e.target.value)
                                    // }
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.prePaymentDetails?.[index]
                            ?.agencyPublishedDate
                            ? errors?.prePaymentDetails?.[index]
                                ?.agencyPublishedDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container sx={{ margin: "0.5vh" }}>
                    <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>
                      {/* 9cha */}
                      <Grid
                        container
                        xl={9}
                        lg={9}
                        md={9}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "5px",
                        }}
                      >
                        <Grid
                          container
                          sx={{
                            display: "flex",
                            // justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            // marginTop: "10px",
                            marginLeft: "40px",
                            gap: 4,
                          }}
                        >
                          {/* Length */}
                          <Grid
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              type="number"
                              disabled={
                                getValues("id") && getValues("id") != null
                                  ? watch("status") ==
                                    "REVERT_BACK_TO_DEPT_USER"
                                    ? false
                                    : watch(
                                        `prePaymentDetails.${index}.disabled`
                                      ) &&
                                      getValues("id") &&
                                      getValues("status") != "DRAFTED"
                                  : watch(`prePaymentDetails.${index}.disabled`)
                                // watch(`prePaymentDetails.${index}.disabled`) ||
                                // getValues("id")
                              }
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                language == "en"
                                  ? "Length(in cm)"
                                  : "लांबी(सेमी मध्ये)"
                              }
                              variant="standard"
                              key={newspaper.id}
                              {...register(
                                `prePaymentDetails.${index}.length`,
                                {
                                  valueAsNumber: true,
                                }
                              )}
                              onChange={(e) => {
                                setValue(
                                  `prePaymentDetails.${index}.standardFormatSize`,
                                  Number(
                                    getValues(
                                      `prePaymentDetails.${index}.width`
                                    )
                                  ) * Number(e.target.value)
                                )
                              }}
                              error={
                                !!errors?.prePaymentDetails?.[index]?.length
                              }
                              helperText={
                                errors?.prePaymentDetails?.[index]?.length
                                  ? errors?.prePaymentDetails?.[index]?.length
                                      .message
                                  : null
                              }
                            />
                          </Grid>

                          {/* WIDTH */}
                          <Grid
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              type="number"
                              disabled={
                                getValues("id") && getValues("id") != null
                                  ? watch("status") ==
                                    "REVERT_BACK_TO_DEPT_USER"
                                    ? false
                                    : watch(
                                        `prePaymentDetails.${index}.disabled`
                                      ) &&
                                      getValues("id") &&
                                      getValues("status") != "DRAFTED"
                                  : watch(`prePaymentDetails.${index}.disabled`)
                              }
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                language == "en"
                                  ? "Width(in cm)"
                                  : "रुंदी(सेमी मध्ये)"
                              }
                              variant="standard"
                              key={newspaper.id}
                              {...register(`prePaymentDetails.${index}.width`, {
                                valueAsNumber: true,
                              })}
                              onChange={(e) => {
                                setValue(
                                  `prePaymentDetails.${index}.standardFormatSize`,
                                  Number(
                                    getValues(
                                      `prePaymentDetails.${index}.length`
                                    )
                                  ) * Number(e.target.value)
                                )
                              }}
                              error={
                                !!errors?.prePaymentDetails?.[index]?.width
                              }
                              helperText={
                                errors?.prePaymentDetails?.[index]?.width
                                  ? errors?.prePaymentDetails?.[index]?.width
                                      .message
                                  : null
                              }
                            />
                          </Grid>

                          {/* SATNDARD FORMAT SIZE */}
                          <Grid
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              disabled
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                language == "en"
                                  ? "Standard Format Size(in Sq.cm)"
                                  : "मानक स्वरूप आकार(स्क़्वेअर सेमी मध्ये)"
                              }
                              variant="standard"
                              key={newspaper.id}
                              {...register(
                                `prePaymentDetails.${index}.standardFormatSize`
                              )}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              error={
                                !!errors?.prePaymentDetails?.[index]
                                  ?.standardFormatSize
                              }
                              helperText={
                                errors?.prePaymentDetails?.[index]
                                  ?.standardFormatSize
                                  ? errors?.prePaymentDetails?.[index]
                                      ?.standardFormatSize.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              disabled={true}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                language == "en"
                                  ? "Rate(per sq.cm in Rupees)"
                                  : "दर (प्र.से.मी रु. मध्ये)"
                              }
                              variant="standard"
                              key={newspaper.id}
                              {...register(
                                `prePaymentDetails.${index}.calculatedRate`
                              )}
                              // onChange={(e) =>
                              //   handleValueChange(index, e.target.value)
                              // }
                              error={
                                !!errors?.prePaymentDetails?.[index]
                                  ?.calculatedRate
                              }
                              helperText={
                                errors?.prePaymentDetails?.[index]
                                  ?.calculatedRate
                                  ? errors?.prePaymentDetails?.[index]
                                      ?.calculatedRate.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              disabled={true}
                              // onChange={(e) =>
                              //   handleValueChange(index, e.target.value)
                              // }
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                language == "en"
                                  ? "Total Amount(in Rupees)"
                                  : "एकूण रक्कम(रु. मध्ये)."
                              }
                              variant="standard"
                              key={newspaper.id}
                              {...register(
                                `prePaymentDetails.${index}.totalAmount`
                              )}
                              error={
                                !!errors?.prePaymentDetails?.[index]
                                  ?.totalAmount
                              }
                              helperText={
                                errors?.prePaymentDetails?.[index]?.totalAmount
                                  ? errors?.prePaymentDetails?.[index]
                                      ?.totalAmount.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              disabled={
                                // watch(`prePaymentDetails.${index}.disabled`) ||
                                // getValues("id")

                                getValues("id") && getValues("id") != null
                                  ? watch("status") ==
                                    "REVERT_BACK_TO_DEPT_USER"
                                    ? false
                                    : watch(
                                        `prePaymentDetails.${index}.disabled`
                                      ) &&
                                      getValues("id") &&
                                      getValues("status") != "DRAFTED"
                                  : watch(`prePaymentDetails.${index}.disabled`)
                              }
                              defaultValue={0}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                language == "en"
                                  ? "Penalty Deductions(in Rupees)"
                                  : "वजा दंड र (रु. मध्ये)"
                              }
                              variant="standard"
                              key={newspaper.id}
                              {...register(
                                `prePaymentDetails.${index}.totalDeduction`,
                                {
                                  valueAsNumber: true,
                                }
                              )}
                              InputLabelProps={{
                                // shrink: true,
                                shrink: !!String(
                                  getValues(
                                    `prePaymentDetails.${index}.totalDeduction`
                                  )
                                ),
                              }}
                              onClick={() =>
                                watch(
                                  `prePaymentDetails.${index}.totalAmount`
                                ) == 0
                                  ? sweetAlert(
                                      "Warning!",
                                      language == "en"
                                        ? "Total Amount Should Be Greater Than Zero"
                                        : "एकूण रक्कम शून्यापेक्षा जास्त असावी",
                                      "warning"
                                    )
                                  : handleModalOpen()
                              }
                              error={
                                !!errors?.agencyBillWiseRate?.[index]
                                  ?.totalDeduction
                              }
                              helperText={
                                errors?.prePaymentDetails?.[index]
                                  ?.totalDeduction
                                  ? errors?.totalDeduction?.[index]
                                      ?.totalDeduction.message
                                  : null
                              }
                            />
                          </Grid>

                          {/* MODAL CODE */}
                          {openModal && (
                            <Modal
                              open={openModal}
                              // onClose={handleModalClose}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div className={tableStyle.table_container}>
                                <h2
                                  style={{
                                    textAlign: "center",
                                    textTransform: "uppercase",
                                    marginTop: "15px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {language == "en"
                                    ? "Penalty Deductions"
                                    : "दंड वजावट"}
                                </h2>
                                <table
                                  className={tableStyle.table}
                                  style={{
                                    marginLeft: "20px",
                                    marginRight: "20px",
                                  }}
                                >
                                  <thead>
                                    <tr>
                                      {(router.query.pageMode == "Add" ||
                                        router.query.pageMode == "Edit") && (
                                        <th style={{ width: "75px" }}>
                                          <input
                                            style={{
                                              cursor: "pointer",
                                              height: "15px",
                                              width: "15px",
                                            }}
                                            type="checkbox"
                                            checked={
                                              selectedRows.length ===
                                              data.length
                                            }
                                            onChange={(e) =>
                                              setSelectedRows(
                                                e.target.checked
                                                  ? data?.map((j) => j.id)
                                                  : []
                                              )
                                            }
                                          />
                                        </th>
                                      )}
                                      <th style={{ width: "80px" }}>
                                        {language == "en" ? "SrNo." : "अ.क्र"}
                                      </th>
                                      <th style={{ width: "250px" }}>
                                        {language == "en"
                                          ? "Penalty Description"
                                          : "दंडाचे वर्णन"}
                                      </th>
                                      <th style={{ width: "250px" }}>
                                        {language == "en" ? "Details" : "तपशील"}
                                      </th>

                                      <th style={{ width: "100px" }}>
                                        {language == "en"
                                          ? "Rate(in Rupees)"
                                          : "दर(रु. मध्ये)"}
                                      </th>

                                      <th style={{ width: "100px" }}>
                                        {" "}
                                        {language == "en"
                                          ? "Penalty Amount(in Rupees)"
                                          : "दंड रक्कम (रु. मध्ये)"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {data?.length > 0 ? (
                                      renderRows()
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan={6}
                                          style={{
                                            fontSize: "16px",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {!!getValues(
                                            `prePaymentDetails.${
                                              currentIndex - 1
                                            }.trnPenaltyDeductionDaoList`
                                          )
                                            ? "Loading Data..."
                                            : " No Penalties for this newspaper"}
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                                <div
                                  className={tableStyle.table_Button}
                                  style={{ marginTop: "10px" }}
                                >
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => {
                                      calculateTotalAmount()
                                    }}
                                  >
                                    {language == "en"
                                      ? "Calculate Total & Save"
                                      : "एकूण गणना करा आणि बचत करा"}
                                  </Button>
                                  <Button
                                    sx={{ textAlign: "right" }}
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={handleModalClose}
                                  >
                                    {language == "en" ? "Close" : "बंद करा"}
                                  </Button>
                                </div>
                                <p
                                  className={tableStyle.table_Para}
                                  style={{
                                    marginLeft: "20px",
                                    // marginBottom: "20px",
                                  }}
                                >
                                  <b>
                                    {language == "en"
                                      ? "Total Amount(in Rupees):"
                                      : "एकूण रक्कम(रु. मध्ये):"}
                                    {totalAmount}
                                  </b>
                                </p>
                              </div>
                            </Modal>
                          )}

                          <Grid
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              disabled
                              // onChange={(e) =>
                              //   handleValueChange(index, e.target.value)
                              // }
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                language == "en"
                                  ? "TDS Deduction"
                                  : "वजा टीडीएस र रु."
                              }
                              variant="standard"
                              key={newspaper.id}
                              {...register(
                                `prePaymentDetails.${index}.totalTaxDeduction`
                              )}
                              error={
                                !!errors?.prePaymentDetails?.[index]
                                  ?.totalTaxDeduction
                              }
                              helperText={
                                errors?.prePaymentDetails?.[index]
                                  ?.totalTaxDeduction
                                  ? errors?.prePaymentDetails?.[index]
                                      ?.totalTaxDeduction.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              disabled={true}
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              // onChange={(e) =>
                              //   handleValueChange(index, e.target.value)
                              // }
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                language == "en"
                                  ? "Total Payable"
                                  : "निव्वळ देय र रु."
                              }
                              variant="standard"
                              key={newspaper.id}
                              {...register(
                                `prePaymentDetails.${index}.totalNetAmount`
                              )}
                              error={
                                !!errors?.prePaymentDetails?.[index]
                                  ?.totalNetAmount
                              }
                              helperText={
                                errors?.prePaymentDetails?.[index]
                                  ?.totalNetAmount
                                  ? errors?.prePaymentDetails?.[index]
                                      ?.totalNetAmount.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          ></Grid>
                        </Grid>
                      </Grid>

                      {/* 3 cha */}
                      <Grid
                        container
                        xl={3}
                        lg={3}
                        md={3}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 3,
                        }}
                      >
                        <TextField
                          minRows={2}
                          disabled={
                            getValues("id") && getValues("id") != null
                              ? watch(`prePaymentDetails.${index}.disabled`) &&
                                getValues("id") &&
                                getValues("status") != "DRAFTED"
                              : watch(`prePaymentDetails.${index}.disabled`)
                            // watch(`prePaymentDetails.${index}.disabled`) ||

                            // getValues("id")
                          }
                          multiline
                          sx={{
                            marginTop: 3,
                            width: 230,
                          }}
                          id="outlined-required"
                          label={language == "en" ? "Remark" : "शेरा."}
                          key={newspaper.id}
                          {...register(`prePaymentDetails.${index}.remark`)}
                          // onChange={(e) =>
                          //   handleValueChange(index, e.target.value)
                          // }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={!!errors?.prePaymentDetails?.[index]?.remark}
                          helperText={
                            errors?.prePaymentDetails?.[index]?.remark
                              ? errors?.prePaymentDetails?.[index]?.remark
                                  .message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        container
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          // padding: "10px",
                          // marginTop: "10px",
                        }}
                      >
                        {!watch(`prePaymentDetails.${index}.disabled`) && (
                          <>
                            <Typography
                              sx={{ /* fontSize: "0.7rem" ,*/ marginRight: 2 }}
                            >
                              {language == "en"
                                ? "Bill Attachment (in jpg/jpeg/png/pdf/docx/xlsx) :"
                                : "बिल दस्तऐवज (जेपीजी/जेपेग/पीएनजी/पीडीएफ/डॉक्स/एक्ष्क्ल मध्ये) :"}
                            </Typography>

                            <UploadButtonOP
                              error={
                                !!errors?.prePaymentDetails?.[index]
                                  ?.billAtachment
                              }
                              appName={appName}
                              serviceName={serviceName}
                              fileDtl={getValues(
                                `prePaymentDetails.${index}.billAtachment`
                              )}
                              fileKey={`prePaymentDetails[${index}].billAtachment`}
                              showDel={true}
                              showDelBtn={true}
                            />
                            <FormHelperText
                              error={
                                !!errors?.prePaymentDetails?.[index]
                                  ?.billAtachment
                              }
                            >
                              {errors?.prePaymentDetails?.[index]?.billAtachment
                                ? errors?.prePaymentDetails?.[index]
                                    ?.billAtachment?.message
                                : null}
                            </FormHelperText>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          )
        }
      })}
      {/* //////////////  Load Next Next Paper  //////////////// */}

      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 1,
          // alignSelf: "end",
          // // alignItems: "center",
          // marginTop: "20px",
          // marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "baseline",
            gap: 20,
          }}
        >
          {currentIndex != 0 && (
            <Button
              disabled={
                currentIndex <= getValues(`newsPapersLength`) ? false : true
              }
              variant="contained"
              size="small"
              type="button"
              onClick={previousPapers}
            >
              {language == "en" ? "previous paper" : "मागील पेपर"}
            </Button>
          )}

          {/* //////////////////////////////////////// */}
          <Button
            disabled={currentIndex >= getValues(`newsPapersLength`)}
            variant="contained"
            size="small"
            type="button"
            onClick={() => {
              if (currentIndex == 0) {
                saveAndNext()
              } else {
                console.log(
                  "isChecked::",
                  getValues(`prePaymentDetails`)?.[currentIndex - 1]?.isChecked,
                  ",amt::",
                  getValues(`prePaymentDetails`)?.[currentIndex - 1]
                    ?.totalNetAmount
                )
                console.log(
                  "gg::",
                  getValues(`prePaymentDetails`)?.[currentIndex - 1]
                    ?.isChecked &&
                    getValues(`prePaymentDetails`)?.[currentIndex - 1]
                      ?.totalNetAmount >= 0
                )
                // getValues(`prePaymentDetails`)?.[currentIndex - 1]?.isChecked &&
                getValues(`prePaymentDetails`)?.[currentIndex - 1]
                  ?.totalNetAmount >= 0
                  ? saveAndNext()
                  : sweetAlert(
                      "Warning!",
                      language == "en"
                        ? "Total Payable Should Be Greater Than Zero"
                        : "एकूण रक्कम शून्यापेक्षा जास्त असावी",
                      "warning"
                    )
              }
            }}
          >
            {currentIndex == 0
              ? language == "en"
                ? "Load Papers"
                : "वृत्तपत्रे लोड करा"
              : router.query.pageMode == "Add" ||
                router.query.pageMode == "Edit"
              ? "Save & Next"
              : "Next"}
          </Button>
        </div>
        {/* <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
        </Grid> */}
      </Grid>
    </>
  )
}

export default NewsPapers
