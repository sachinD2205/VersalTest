import { EyeFilled } from "@ant-design/icons"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined"
import { useReactToPrint } from "react-to-print"
import { Box, Button, Divider, Paper, Tooltip } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { ApprovalRounded } from "@mui/icons-material"
import { useRouter } from "next/router"
import urls from "../../../../URLS/urls"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import Loader from "../../../../containers/Layout/components/Loader"
import moment from "moment"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const router = useRouter()
  const [ward, setWard] = useState([])
  const [department, setDepartment] = useState([])
  const [newsPaper, setNewsPaper] = useState([])
  const [advertisementType, setadvertisementType] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const language = useSelector((state) => state.labels.language)
  const user = useSelector((state) => state.user.user)
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  )
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer
  })?.roles
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
  // console.log("user", user);
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer)
  console.log("authority", authority)

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const getadvertisementType = () => {
    axios
      .get(`${urls.NRMS}/advertisementType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setadvertisementType(res.data.advertisementType)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getDepartment = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDepartment(res.data.department)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getWard = async () => {
    await axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setWard(res.data.ward)
        console.log("getZone.data", res.data.ward)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getNewsPaper = async () => {
    await axios
      .get(`${urls.NRMS}/newspaperMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setNewsPaper(r?.data?.newspaperMasterList)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getAllPressData = async (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo)
    setIsLoading(true)
    await axios
      .get(`${urls.NRMS}/trnPressNoteRequestApproval/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user?.token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((r) => {
        let response = r?.data?.trnPressNoteRequestApprovalList?.map(
          (row, index) => {
            return {
              ...row,
              srNo: index + r?.data?.pageSize * r?.data?.pageNo + 1,
              // wardName: ward.find((rec) => rec.id == row?.wardKey)?.wardName,
              // departmentName: department.find((rec) => rec.id == row?.departmentKey)?.department,
              // departmentNameMr: department.find((rec) => rec.id == row?.departmentKey)?.departmentMr,
              // newsPaperName: newsPaper.find((rec) => rec.id == row?.newsPaper)?.newspaperName,
              // newsPaperNameMr: newsPaper.find((rec) => rec.id == row?.newsPaper)?.newspaperNameMr,
              // wardNameMr: ward.find((rec) => rec.id == row?.wardKey)?.wardNameMr,
              // advertisementTypeName: advertisementType.find((rec) => rec.id == row?.advertisementType)?.advertisementType,
              // advertisementTypeNameMr: advertisementType.find((rec) => rec.id == row?.advertisementType)?.advertisementTypeMr,
            }
          }
        )
        console.log("response--->", response)
        setData({
          rows: response,
          totalRows: r?.data?.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r?.data?.pageSize,
          page: r?.data?.pageNo,
        })
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        callCatchMethod(error, language);

      })
  }

  // useEffect(() => {
  //   getWard();
  //   getDepartment();
  //   getNewsPaper();
  //   getadvertisementType();
  // }, []);

  useEffect(
    () => {
      // if (ward.length > 0 && department.length > 0 && newsPaper.length > 0) {
      // console.log("Get All Press Data Called....", ward.length, department.length, newsPaper.length);
      getAllPressData()
      // }
    },
    /* ward, department, newsPaper */
    []
  )

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log("body", body)
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Deleted!"
                    : "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
                  {
                    icon: "success",
                  }
                )
                // getAllPressData();
                setButtonInputState(false)
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे")
        }
      })
    } else {
      swal({
        title: language === "en" ? "Activate?" : "सक्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to Inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Deleted!"
                    : "रेकॉर्ड यशस्वीरित्या हटवले आहे",
                  {
                    icon: "success",
                  }
                )
                // getPaymentRate();
                getAllPressData()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे")
        }
      })
    }
  }

  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      field: "srNo",
      minWidth: 50,
      align: "center",
      headerAlign: "left",
    },

    {
      headerName: "Press Note Request Number",
      field: "pressNoteRequestNo",
      flex: 2,
      minWidth: 200,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Tooltip title={params.row.pressNoteRequestNo}>
          <span className="csutable-cell-trucate">
            {params.row.pressNoteRequestNo}
          </span>
        </Tooltip>
      ),
    },

    {
      field: "pressNoteReleaseDate",
      headerName: (
        <Tooltip title={<FormattedLabel id="pressNoteReleaseDate" />}>
          <span className="csutable-cell-trucate">
            <FormattedLabel id="pressNoteReleaseDate" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip
          title={moment(params.row.pressNoteReleaseDate).format("DD-MM-YYYY")}
        >
          <span className="csutable-cell-trucate">
            {moment(params.row.pressNoteReleaseDate).format("DD-MM-YYYY")}
          </span>
        </Tooltip>
      ),
    },

    {
      headerName: <FormattedLabel id="ward" />,
      field: language === "en" ? "wardName" : "wardNameMr",
      flex: 2,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      headerName: <FormattedLabel id="department" />,
      field: language === "en" ? "departmentName" : "departmentNameMr",
      flex: 2,
      minWidth: 150,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Tooltip
          title={
            language === "en"
              ? params.row.departmentName
              : params.row.departmentNameMr
          }
        >
          <span className="csutable-cell-trucate">
            {language === "en"
              ? params.row.departmentName
              : params.row.departmentNameMr}
          </span>
        </Tooltip>
      ),
    },

    {
      headerName: <FormattedLabel id="newsPaperName" />,
      field: language === "en" ? "newsPapersNames" : "newsPapersNamesMr",
      flex: 2,
      minWidth: 200,
      align: "left",
      headerAlign: "left",
    },
    // {
    //   headerName: <FormattedLabel id="advertisementType" />,
    //   field:
    //     language === "en" ? "advertisementTypeName" : "advertisementTypeNameMr",
    //   minWidth: 100,
    //   align: "left",
    //   headerAlign: "left",
    //   renderCell: (params) => (
    //     <Tooltip
    //       title={
    //         language === "en"
    //           ? params.row.advertisementTypeName
    //           : params.row.advertisementTypeNameMr
    //       }
    //     >
    //       <span className="csutable-cell-trucate">
    //         {language === "en"
    //           ? params.row.advertisementTypeName
    //           : params.row.advertisementTypeNameMr}
    //       </span>
    //     </Tooltip>
    //   ),
    // },
    {
      headerName: <FormattedLabel id="status" />,
      field: "status",
      flex: 2,
      minWidth: 200,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Tooltip
          title={language === "en" ? params.row.status : params.row.status}
        >
          <span className="csutable-cell-trucate">
            {language === "en" ? params.row.status : params.row.status}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      flex: 2,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      eaderAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {/* view button */}
            <Tooltip title="View">
              <IconButton
                onClick={() => {
                  router.push({
                    pathname:
                      "/newsRotationManagementSystem/transaction/pressNoteRelease/create",
                    query: {
                      pageMode: "View",
                      id: params.row.id,
                    },
                  })
                }}
              >
                <EyeFilled style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>

            {/* edit button */}
            {(authority?.includes("ENTRY") || authority?.includes("ADMIN")) &&
              params.row.status == "DRAFTED" && (
                <>
                  <Tooltip title="EDIT">
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/newsRotationManagementSystem/transaction/pressNoteRelease/create",
                          query: {
                            pageMode: "Edit",
                            id: params.row.id,
                          },
                        })
                      }}
                    >
                      <EditIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

            {(authority?.includes("ENTRY") || authority?.includes("ADMIN")) &&
              params.row.status == "REVERT_BACK_TO_CONCERN_DEPT_USER" && (
                <>
                  <Tooltip title="EDIT">
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/newsRotationManagementSystem/transaction/pressNoteRelease/create",
                          query: {
                            pageMode: "Edit",
                            id: params.row.id,
                          },
                        })
                      }}
                    >
                      <EditIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

            {/* process logic */}
            {(authority?.includes("APPROVAL") ||
              authority?.includes("RELEASING_ORDER_ENTRY") ||
              authority?.includes("FINAL_APPROVAL") ||
              authority?.includes("ENTRY")) &&
              params.row.status != "DRAFTED" &&
              params.row.status != "REVERT_BACK_TO_CONCERN_DEPT_USER" && (
                <>
                  <Tooltip title="APPROVE">
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/newsRotationManagementSystem/transaction/pressNoteRelease/create",
                          query: {
                            pageMode: "PROCESS",
                            id: params.row.id,
                          },
                        })
                      }}
                    >
                      <ApprovalRounded style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

            {/* press note release order print */}
            {(authority?.includes("ENTRY") ||
              authority?.includes("ADMIN") ||
              authority?.includes("FINAL_APPROVAL")) &&
              params.row.status == "RELEASING_ORDER_GENERATED" && (
                <>
                  <IconButton
                    onClick={() => {
                      {
                        handlePrint
                      }
                      router.push({
                        pathname:
                          "/newsRotationManagementSystem/transaction/releasingOrder/press",
                        query: {
                          pageMode: "View",
                          id: params.row.id,
                        },
                      })
                    }}
                  >
                    <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
                  </IconButton>

                  {/* <IconButton
                  onClick={() => {
                    { handlePrint }
                    const record = selectedObject;
                    router.push({
                      pathname:
                        '/newsRotationManagementSystem/report/PaperCuttingBook/pressCut',
                      query: {
                        pageMode: "View",
                        id: params.row.id
                      },
                    })
                  }}  >
                  <ForwardIcon style={{ color: "#556CD6" }} />
                </IconButton> */}
                </>
              )}
          </Box>
        )
      },
    },
  ]

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading ? (
        <Loader />
      ) : (
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
            <h2>
              <FormattedLabel id={"pressNoteReleaseHeading"} />

              {/* <FormattedLabel id="addHearing" /> */}
            </h2>
          </Box>

          <Divider />

          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: 10,
              marginRight: 40,
              marginBottom: 10,
            }}
          >
            {(authority?.includes("ENTRY") || authority?.includes("ADMIN")) && (
              <div>
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  onClick={() => {
                    router.push({
                      pathname:
                        "/newsRotationManagementSystem/transaction/pressNoteRelease/create",
                      query: {
                        pageMode: "Add",
                      },
                    })
                  }}
                >
                  <FormattedLabel id={"pressNoteRequestAddNew"} />
                </Button>
              </div>
            )}
          </div>

          <div>
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
                getAllPressData(data.pageSize, _data)
              }}
              onPageSizeChange={(_data) => {
                getAllPressData(_data, data.page)
              }}
            />
            {/* </Box> */}
          </div>
        </Paper>
      )}
    </>
  )
}

export default Index
