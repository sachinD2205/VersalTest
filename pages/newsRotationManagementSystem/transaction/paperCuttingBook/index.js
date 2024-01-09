import AddIcon from "@mui/icons-material/Add"
import PrintIcon from "@mui/icons-material/Print"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Box, Button, Divider, Paper, Tooltip } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import urls from "../../../../URLS/urls"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import Loader from "../../../../containers/Layout/components/Loader"
import moment from "moment"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  })
  const language = useSelector((state) => state.labels.language)
  const router = useRouter()
  const [tableData, setTableData] = useState()
  const [dataSource, setDataSource] = useState([])
  const [courtNames, setCourtNames] = useState([])
  const [advocateNames, setAdvocateNames] = useState([])
  const [id, setID] = useState()
  const [selectedObject, setSelectedObject] = useState()

  const [caseTypes, setCaseTypes] = useState([])
  const [caseStages, setCaseStages] = useState([])
  const [caseEntry, setCaseEntry] = useState([])
  const [allTabelData, setAllTabelData] = useState([])
  const [ward, setWard] = useState([])
  const [rotationGroup, setRotationGroup] = useState([])
  const [rotationSubGroup, setRotationSubGroup] = useState([])
  const [department, setDepartment] = useState([])
  const [parameterName, setParameterName] = useState([])
  const [newsPaper, setNewsPaper] = useState([])
  const [number, setNumber] = useState("")
  const [cutNews, setCutNews] = useState("")

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [fetchData, setFetchData] = useState(null)
  const { inputData, setInputData } = useState()

  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [buttonInputState, setButtonInputState] = useState()
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [priority, setPriority] = useState()
  const [date, setDate] = useState()
  const [selectedDate, setSelectedDate] = useState()
  const [pressNote, setPressNote] = useState()
  const [isLoading, setIsLoading] = useState(false)
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
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)

  // console.log("user", user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  )

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer)

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer
  })?.roles

  console.log("authority", authority)

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

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
        callCatchMethod(error, language);
      })
  }
  const getNewsPaper = () => {
    axios
      .get(`${urls.NRMS}/newspaperMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setNewsPaper(
          r?.data?.newspaperMasterList?.map((r, i) => ({
            id: r.id,
            // newspaperName: r.newspaperName,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  useEffect(() => {
    getAllPaperCuttingData()
    // getAllPressData();
  }, [])

  useEffect(() => {
    getNewsPaper()
    getDepartment()
  }, [])

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  let approvalId = router?.query?.id

  const getAllPaperCuttingData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo)
    setIsLoading(true)
    axios
      .get(`${urls.NRMS}/trnPaperCuttingBook/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 1102,
        },
      })
      .then((r) => {
        console.log(";rressss", r.data)
        let result = r.data.trnPaperCuttingBookList
        console.log("paperCut", result.trnPaperCuttingBookList)
        // let _res = result.map((r, i) => {
        let _res = result.map((r, i) => {
          console.log("4e433333", r)
          let str = r.publishedDate?.split("T")
          console.log("jj", str)
          let val = str && str[0]
          console.log("hh", val)

          // fields
          return {
            activeFlag: r.activeFlag,
            devisionKey: r.divisionKey,
            srNo: i + 1,
            id: r.id,
            attachement: r.attachement,
            departmentName: r.departmentName,
            newspaperName: r.newspaperName,
            newspaperNameMr: r.newspaperNameMr,
            publishedDate: val,
            sequenceNumber: r.sequenceNumber,
            heading: r.heading,

            description: r.description,
            pressHeading: r.pressHeading,
            pressDescription: r.pressDescrption,
          }
        })
        setDataSource([..._res])
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        })
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        callCatchMethod(error, language);

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

  const resetValuesCancell = {
    departmentName: "",
    newspaperName: "",
    publishedDate: "",
    sequenceNumber: "",
  }

  const resetValuesExit = {
    departmentName: "",
    newspaperName: "",
    sequenceNumber: "",
  }
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "left",
      headerAlign: "left",
      width: 50,
    },
    // {
    //   field: "newsPublishRequestNo",
    //   headerName: <FormattedLabel id="newsreqNumber" />,
    //   width: 50,
    //   flex: 1,
    //   align: "left",
    //   headerAlign: "left",
    // },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="departmentName" />,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "newspaperName",
      headerName: <FormattedLabel id="newsPaperName" />,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "publishedDate",
      headerName: <FormattedLabel id="publishDate" />,
      // width: 250,
      minWidth: 150,
      flex: 1,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Tooltip title={moment(params.row.publishedDate).format("DD-MM-YYYY")}>
          <span className="csutable-cell-trucate">
            {moment(params.row.publishedDate).format("DD-MM-YYYY")}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      headerAlign: "left",
      width: 200,
      align: "left",
      // minWidth: 100,
      eaderAlign: "left",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                // swal("Record Send Successfully", "success");
                router.push({
                  pathname:
                    "/newsRotationManagementSystem/transaction/paperCuttingBook/newsCut",
                  query: {
                    pageMode: "View",
                    id: params.row.id,
                  },
                })
              }}
            >
              <VisibilityIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {authority && authority?.includes("VIEW") ? (
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  const record = selectedObject
                  router.push({
                    pathname:
                      "/newsRotationManagementSystem/transaction/paperCuttingBook/paperCutingReport",
                    query: {
                      pageMode: "View",
                      id: params.row.id,
                    },
                  })
                }}
              >
                <PrintIcon style={{ color: "#556CD6" }} />
              </IconButton>
            ) : (
              <></>
            )}
          </Box>
        )
      },
    },
  ]

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <>
            <BreadcrumbComponent />
          </>
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
              <h2>{<FormattedLabel id="papercutting" />}</h2>
            </Box>
            <Divider />
            <Box
              sx={{
                marginTop: 2,
              }}
            >
              <Box></Box>
            </Box>
            <div
              // className={styles.addbtn}
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: 10,
                marginRight: 40,
                marginBottom: 10,
              }}
            ></div>

            <div
              // className={styles.addbtn}
              style={{
                display: "flex",
                justifyContent: "right",
                // marginTop: 10,
                marginRight: 40,
                marginBottom: 10,
              }}
            >
              {router?.query?.pageMode != "VIEW" &&
              authority?.includes("ENTRY") ? (
                <div>
                  <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    // type='primary'
                    disabled={buttonInputState}
                    onClick={() => {
                      reset({
                        ...resetValuesExit,
                      })
                      router.push({
                        pathname:
                          "/newsRotationManagementSystem/transaction/paperCuttingBook/newsCut",
                      })
                    }}
                  >
                    <FormattedLabel id="add" />
                  </Button>
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <Box
                sx={{
                  height: 500,
                  overflowX: "auto",
                }}
              >
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
                  rows={data.rows}
                  columns={columns}
                  onPageChange={(_data) => {
                    getAllPaperCuttingData(data.pageSize, _data)
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data)

                    getAllPaperCuttingData(_data, data.page)
                  }}
                />
              </Box>
            </div>
          </Paper>
        </>
      )}
    </>
  )
}

export default Index
