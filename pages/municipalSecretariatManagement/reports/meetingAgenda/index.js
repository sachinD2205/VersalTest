import React, { useEffect, useState } from "react"
import router from "next/router"
import Head from "next/head"
import styles from "./view.module.css"

import URLs from "../../../../URLS/urls"
import { FormControl, FormHelperText, Paper, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { LocalizationProvider } from "@mui/x-date-pickers/node/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/node/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import moment from "moment"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Button from "@mui/material/Button"
import { Search, Visibility } from "@mui/icons-material"
import { DataGrid } from "@mui/x-data-grid"
import IconButton from "@mui/material/IconButton"
import axios from "axios"
import { useSelector } from "react-redux"
import sweetAlert from "sweetalert"
import { catchExceptionHandlingMethod } from "../../../../util/util"
const Index = () => {
  const meetingAgendaSchema = yup.object().shape({
    fromDate: yup.string().required("Please select Reservation"),
    toDate: yup.string().required("Please select Reservation"),
  })

  const language = useSelector((state) => state.labels.language)
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

  const {
    handleSubmit,
    // register,
    // setValue,
    // @ts-ignore
    // methods,
    // watch,
    // reset,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(meetingAgendaSchema),
  })

  const [table, setTable] = useState([])
  const [committeeName, setCommitteeName] = useState(null)

  useEffect(() => {
    //Get Committee
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAllForDropDown`)
      .then((res) => {
        console.log("Committee: ", res.data.committees)
        setCommitteeName(
          res.data.committees.map((j) => ({
            id: j.id,
            committeeNameEn: j.committeeName,
            committeeNameMr: j.committeeNameMr,
          }))
        )
      })
      .catch((error) => {
        // console.log("error: ", error)
        // sweetAlert({
        //   title: "ERROR!",
        //   text: `${error}`,
        //   icon: "error",
        //   buttons: {
        //     confirm: {
        //       text: "OK",
        //       visible: true,
        //       closeModal: true,
        //     },
        //   },
        //   dangerMode: true,
        // })
        callCatchMethod(error, language)
      })
  }, [])

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 80,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "committeeNameEn" : "committeeNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="committeeName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "agendaSubjectEn" : "agendaSubjectMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "agendaDescriptionEn" : "agendaDescriptionMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="description" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                console.log(params.row)
                router.push({
                  pathname:
                    "/municipalSecretariatManagement/reports/meetingAgenda/print",
                  query: { agendaNo: params.row.agendaNo },
                })
              }}
            >
              <Visibility sx={{ color: "#1976d2" }} />
            </IconButton>
          </>
        )
      },
    },
  ]

  const submit = (data) => {
    console.log("Data: ", data)

    axios
      .get(
        `${URLs.MSURL}/trnPrepareMeetingAgenda/getByFromDateAndToDateOrAgendaNo?fromDate=${data.fromDate}&toDate=${data.toDate}`
      )
      .then((res) => {
        if (res.data.prepareMeetingAgenda.length > 0) {
          setTable(
            res.data.prepareMeetingAgenda.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              agendaNo: j.agendaNo,
              committeeId: j.committeeId,
              committeeNameEn: committeeName.find(
                (obj) => obj["id"] === j.committeeId
              )["committeeNameEn"],
              committeeNameMr: committeeName.find(
                (obj) => obj["id"] === j.committeeId
              )["committeeNameMr"],
              meetingDate: j.meetingDate,
              karyakramPatrikaNo: j.karyakramPatrikaNo,
              coveringLetterSubject: j.coveringLetterSubject,
              coveringLetterSubjectMr: j.coveringLetterSubjectMr,
              agendaSubjectEn: j.agendaSubject,
              agendaSubjectMr: j.agendaSubjectMr,
              coveringLetterNote: j.coveringLetterNote,
              coveringLetterNoteMr: j.coveringLetterNoteMr,
              agendaDescriptionEn: j.agendaDescription,
              agendaDescriptionMr: j.agendaDescriptionMr,
              agendaOutwardDate: j.agendaOutwardDate,
              agendaOutwardNo: j.agendaOutwardNo,
              tip: j.tip,
              tipMr: j.tipMr,
              sabhavruttant: j.sabhavruttant,
              sabhavruttantMr: j.sabhavruttantMr,
              agendaSubjectDao: j.agendaSubjectDao,
              meetingSchedule: j.meetingSchedule,
            }))
          )
        } else {
          sweetAlert({
            title: "OOPS!",
            text: `No agenda found`,
            icon: "warning",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
            // dangerMode: true,
          })
        }
        console.log("Table: ", table)
      })
      .catch((error) => {
        // console.log("error: ", error)
        // sweetAlert({
        //   title: "ERROR!",
        //   text: `${error}`,
        //   icon: "error",
        //   buttons: {
        //     confirm: {
        //       text: "OK",
        //       visible: true,
        //       closeModal: true,
        //     },
        //   },
        //   dangerMode: true,
        // })
        callCatchMethod(error, language)
      })
  }

  return (
    <>
      <Head>
        <title>Reports - Meeting Agenda</title>
      </Head>
      <Paper className={styles.main}>
        <form onSubmit={handleSubmit(submit)}>
          <div className={styles.row}>
            <FormControl error={!!error.fromDate}>
              <Controller
                control={control}
                name="fromDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      label={
                        <span>
                          <FormattedLabel id="fromDate" required />
                        </span>
                      }
                      disabled={router.query.fromDate ? true : false}
                      value={
                        router.query.fromDate
                          ? router.query.fromDate
                          : field.value
                      }
                      onChange={(date) =>
                        field.onChange(
                          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "200px" }}
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
                {error?.fromDate ? error.fromDate.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.toDate}>
              <Controller
                control={control}
                name="toDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      label={
                        <span>
                          <FormattedLabel id="toDate" required />
                        </span>
                      }
                      disabled={router.query.toDate ? true : false}
                      value={
                        router.query.toDate ? router.query.toDate : field.value
                      }
                      onChange={(date) =>
                        field.onChange(
                          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "200px" }}
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
                {error?.toDate ? error.toDate.message : null}
              </FormHelperText>
            </FormControl>
            <Button variant="contained" type="submit" endIcon={<Search />}>
              <FormattedLabel id="search" />
            </Button>
          </div>
          <div className={styles.table} style={{ marginTop: "4%" }}>
            <DataGrid
              sx={{
                marginTop: "5vh",
                marginBottom: "3vh",
                "& .cellColor": {
                  backgroundColor: "#1976d2",
                  color: "white",
                },
              }}
              autoHeight
              rows={table}
              //@ts-ignore
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>
        </form>
      </Paper>
    </>
  )
}

export default Index
