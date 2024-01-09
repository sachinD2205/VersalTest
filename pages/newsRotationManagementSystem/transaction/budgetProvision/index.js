// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import EditIcon from "@mui/icons-material/Edit"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css"
import theme from "../../../../theme"
import VisibilityIcon from "@mui/icons-material/Visibility"
import axios from "axios"
import urls from "../../../../URLS/urls"
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import moment from "moment"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import FileTable from "../../../../components/newsRotationManagementSystem/FileUpload/FileTable"
import { yupResolver } from "@hookform/resolvers/yup"
import schema from "../../../../containers/schema/newsRotationManagementSystem/budgetProvision"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const BudgetProvision = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [fetchData, setFetchData] = useState(null)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [rotationGroup, setRotationGroup] = useState([])
  const [isDisabled, setIsDisabled] = useState(true)
  const router = useRouter()

  const [authorizedToUpload, setAuthorizedToUpload] = useState(true)

  const [departments, setDepartments] = useState([])
  const [eventManagements, setEventManagements] = useState([])
  const language = useSelector((state) => state.labels.language)

  const user = useSelector((state) => state.user.user)
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
  const [attachedFile, setAttachedFile] = useState("")
  const [additionalFiles, setAdditionalFiles] = useState([])
  const [mainFiles, setMainFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [finalFiles, setFinalFiles] = useState([])
  //eventManagementAttachments (attachment key)

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles])
  }, [mainFiles, additionalFiles])

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  useEffect(() => {
    getDepartment()
    getBudgetProvision()
  }, [])

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
    {
      field: "newspaperName",
      headerName: <FormattedLabel id="newsPaperName" />,
      flex: 1,
    },
    {
      field: "billAmount",
      headerName: <FormattedLabel id="billAmount" />,
      flex: 1,
    },
    {
      field: "billAppovalDate",
      headerName: <FormattedLabel id="billApprovalDate" />,
      flex: 1,
    },

    {
      field: "billAppovalOfficerName",
      headerName: <FormattedLabel id="billApprovalOfficerName" />,
      flex: 1,
    },
    {
      field: "billDescription",
      headerName: <FormattedLabel id="billDescription" />,
      flex: 1,
    },
    {
      field: "budgetAmountAfterCurrentBillPaymentDeduction",
      headerName: (
        <FormattedLabel id="budgetAmountAfterCurrentBillPaymentDeduction" />
      ),
      flex: 1,
    },
    {
      field: "budgetAmountAfterPriviousBillPaymentDeduction",
      headerName: (
        <FormattedLabel id="budgetAmountAfterPreviousBillPaymentDeduction" />
      ),
      flex: 1,
    },
    {
      field: "budgetProvision",
      headerName: <FormattedLabel id="budgetProvision" />,
      flex: 1,
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                // setButtonInputState(true);
                console.log(
                  "params.row: ",
                  params.row,
                  moment(params?.row?.billAppovalDate, "DD/MM/YYYY").format(
                    "YYYY-MM-DD"
                  )
                )
                reset(params.row)
                setValue(
                  "billAppovalDate",
                  moment(params?.row?.billAppovalDate, "DD/MM/YYYY").format(
                    "YYYY-MM-DD"
                  )
                )
                // hh:mm:ss a
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  const _columns = [
    // {
    //   headerName: "Sr.No",
    //   field: "srNo",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      // File: "originalFileName",
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
      field: "uploadedBy",
      flex: 1,
      // width: 300,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="Action" />,
      width: 200,
      // flex: 1,

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

  // get department
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDepartments(res.data.department)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // get EventManagement
  const getBudgetProvision = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.NRMS}/trnBudgetProvision/getAll`, {
        // .get(`http://192.168.68.145:9004/newsRotationManagementSystem/api/trnBudgetProvision/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let resp = res?.data?.trnBudgetProvisionList
        let _res = resp?.map((val, id) => {
          console.log("first", val.budgetProvision)
          return {
            activeFlag: val.activeFlag,
            srNo: id + 1 + _pageNo * _pageSize,
            billAmount: val.billAmount ? val.billAmount : "-",

            billAppovalDate: val.billAppovalDate
              ? moment(val.billAppovalDate).format("DD/MM/YYYY")
              : "-",
            id: val.id,
            billAppovalOfficerName: val.billAppovalOfficerName,
            // eventDate: val?.eventDate ? moment(val.eventDate).format("DD/MM/YYYY") : "-",
            billDescription: val?.billDescription ? val?.billDescription : "-",
            budgetAmountAfterCurrentBillPaymentDeduction:
              val.budgetAmountAfterCurrentBillPaymentDeduction,
            budgetAmountAfterPriviousBillPaymentDeduction:
              val.budgetAmountAfterPriviousBillPaymentDeduction,
            budgetProvision: val?.budgetProvision,
            newspaperName: val?.newspaperName,
            remark: val?.remark,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          }
        })
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        })

        setEventManagements(res?.data?.trnEventManagementList)
        console.log("eventManagement getAll", res)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // get EventManagement by Id
  const getEventManagementById = (id) => {
    axios
      .get(`${urls.NRMS}/trnEventManagement/getById`, {
        params: {
          id: id,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setEventManagements(res?.data?.trnEventManagementList)
        console.log("eventManagement by id", res)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    subGroupName: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    subGroupName: "",

    id: null,
  }

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setDeleteButtonState(false)
  }

  const onSubmitForm = (formData) => {
    // Save - DB
    let _body = {
      ...formData,
      billAppovalDate: moment(formData?.billAppovalDate).format("YYYY-MM-DD"),
      budgetProvisionAttachment: finalFiles,
      // eventTime: moment(formData?.eventTime).format("HH:mm:ss"),
    }

    if (btnSaveText === "Save") {
      console.log("_body", _body)
      axios
        .post(`${urls.NRMS}/trnBudgetProvision/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          // axios.post(`http://192.168.68.145:9004/newsRotationManagementSystem/api/trnBudgetProvision/save`, _body).then((res) => {
          console.log("res---", res)
          if (res.status == 201) {
            getBudgetProvision()
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            )
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    } else if (btnSaveText === "Update") {
      axios
        .post(`${urls.NRMS}/trnBudgetProvision/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log("res---", res)
          if (res.status == 201) {
            getBudgetProvision()
            sweetAlert(
              language === "en" ? "Updated!" : "अपडेट केले!",
              language === "en"
                ? "Record Updated successfully!"
                : "रेकॉर्ड यशस्वीरित्या अपडेट केले",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            )
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  }

  return (
    <ThemeProvider theme={theme}>
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
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="budgetProvision" />
          </h2>
        </Box>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <Grid container sx={{ padding: "10px" }}>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        fullWidth
                        sx={{ width: "80%" }}
                        label={<FormattedLabel id="budgetProvision" />}
                        id="standard-basic"
                        variant="standard"
                        // value={nextEventNumber}
                        {...register("budgetProvision")}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.budgetProvision}
                        InputProps={{ style: { fontSize: 18 } }}
                        helperText={
                          errors?.budgetProvision
                            ? errors.budgetProvision.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        fullWidth
                        sx={{ width: "80%" }}
                        label={<FormattedLabel id="billDescription" />}
                        id="standard-basic"
                        variant="standard"
                        {...register("billDescription")}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.billDescription}
                        InputProps={{ style: { fontSize: 18 } }}
                        helperText={
                          errors?.billDescription
                            ? errors.billDescription.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        fullWidth
                        sx={{ width: "80%" }}
                        label={<FormattedLabel id="newsPaperName" />}
                        id="standard-basic"
                        variant="standard"
                        {...register("newspaperName")}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.newspaperName}
                        InputProps={{ style: { fontSize: 18 } }}
                        helperText={
                          errors?.newspaperName
                            ? errors.newspaperName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        fullWidth
                        sx={{ width: "80%" }}
                        label={<FormattedLabel id="billAmount" />}
                        id="standard-basic"
                        variant="standard"
                        {...register("billAmount")}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.billAmount}
                        InputProps={{ style: { fontSize: 18 } }}
                        helperText={
                          errors?.billAmount ? errors.billAmount.message : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        fullWidth
                        sx={{ width: "80%" }}
                        label={
                          <FormattedLabel id="budgetAmountAfterPreviousBillPaymentDeduction" />
                        }
                        id="standard-basic"
                        variant="standard"
                        {...register(
                          "budgetAmountAfterPriviousBillPaymentDeduction"
                        )}
                        InputLabelProps={{ shrink: true }}
                        error={
                          !!errors.budgetAmountAfterPriviousBillPaymentDeduction
                        }
                        InputProps={{ style: { fontSize: 18 } }}
                        helperText={
                          errors?.budgetAmountAfterPriviousBillPaymentDeduction
                            ? errors
                                .budgetAmountAfterPriviousBillPaymentDeduction
                                .message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        fullWidth
                        sx={{ width: "80%" }}
                        label={
                          <FormattedLabel id="budgetAmountAfterCurrentBillPaymentDeduction" />
                        }
                        id="standard-basic"
                        variant="standard"
                        {...register(
                          "budgetAmountAfterCurrentBillPaymentDeduction"
                        )}
                        InputLabelProps={{ shrink: true }}
                        error={
                          !!errors.budgetAmountAfterCurrentBillPaymentDeduction
                        }
                        InputProps={{ style: { fontSize: 18 } }}
                        helperText={
                          errors?.budgetAmountAfterCurrentBillPaymentDeduction
                            ? errors
                                .budgetAmountAfterCurrentBillPaymentDeduction
                                .message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.billAppovalDate}
                        fullWidth
                        sx={{ width: "80%" }}
                      >
                        <Controller
                          control={control}
                          name="billAppovalDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                inputFormat="dd/MM/yyyy"
                                label={<FormattedLabel id="billApprovalDate" />}
                                value={field.value}
                                // @ts-ignore
                                //   value={applicationDetails.petBirthdate ?? field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date, "YYYY-MM-DD").format(
                                      "YYYY-MM-DD"
                                    )
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ width: "100%" }}
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
                          {errors?.billAppovalDate
                            ? errors.billAppovalDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        label={<FormattedLabel id="billApprovalOfficerName" />}
                        // label="Bill Approval Officer Name"
                        fullWidth
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        variant="standard"
                        {...register("billAppovalOfficerName")}
                        error={!!errors.billAppovalOfficerName}
                        InputProps={{ style: { fontSize: 18 } }}
                        helperText={
                          errors?.billAppovalOfficerName
                            ? errors.billAppovalOfficerName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        label={<FormattedLabel id="remark" />}
                        // label="Remark"
                        fullWidth
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        variant="standard"
                        {...register("remark")}
                        error={!!errors.remark}
                        InputProps={{ style: { fontSize: 18 } }}
                        helperText={
                          errors?.remark ? errors.remark.message : null
                        }
                      />
                    </Grid>
                  </Grid>

                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      width: "100%",
                      background:
                        "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                    }}
                  >
                    <h2>
                      <strong>
                        {language == "en" ? "Attachment" : "दस्तऐवज"}
                      </strong>
                    </h2>
                  </Box>

                  <Grid item xs={12}>
                    <FileTable
                      appName="NRMS" //Module Name
                      serviceName={"N-NPR"} //Transaction Name
                      fileName={attachedFile} //State to attach file
                      filePath={setAttachedFile} // File state upadtion function
                      newFilesFn={setAdditionalFiles} // File data function
                      columns={_columns} //columns for the table
                      rows={finalFiles} //state to be displayed in table
                      uploading={setUploading}
                      authorizedToUpload={authorizedToUpload}
                    />
                  </Grid>

                  <Grid
                    container
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    <Grid
                      item
                      xs={4}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText === <FormattedLabel id="update" /> ? (
                          <FormattedLabel id="update" />
                        ) : (
                          <FormattedLabel id="save" />
                        )}
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                  {/* </div> */}
                </Grid>
              </Slide>
            )}
          </form>
        </FormProvider>

        <div className={styles.addbtn}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            // type='primary'
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              })
              setEditButtonInputState(true)
              setDeleteButtonState(true)
              setBtnSaveText("Save")
              setButtonInputState(true)
              setSlideChecked(true)
              setIsOpenCollapse(!isOpenCollapse)
            }}
          >
            <FormattedLabel id="addNew" />
          </Button>
        </div>

        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          autoHeight
          sx={{
            // marginLeft: 5,
            // marginRight: 5,
            // marginTop: 5,
            // marginBottom: 5,

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
          // rows={dataSource}
          // columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          //checkboxSelection

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
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getData(data.pageSize, _data)
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data)
            // updateData("page", 1);
            getData(_data, data.page)
          }}
        />
      </Paper>
    </ThemeProvider>
  )
}

export default BudgetProvision
