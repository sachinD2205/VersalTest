import PendingActionsIcon from "@mui/icons-material/PendingActions"
import { EyeFilled } from "@ant-design/icons"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import moment from "moment"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useReactToPrint } from "react-to-print"
import urls from "../../../../URLS/urls"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })
  const [advertisementTypes, setadvertisementTypes] = useState([
    { id: 1, name: "Corrigendum", nameMr: "शुद्धीपत्र" },
    { id: 2, name: "New Tender", nameMr: "नवीन निविदा" },
  ])

  const [loading, setLoading] = useState(false)

  const componentRef = useRef()
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // })

  const language = useSelector((state) => state.labels.language)
  const router = useRouter()
  const user = useSelector((state) => state.user.user)

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

  // Get Table - Data
  const getAllTableData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "createDtTm",
    _sortDir = "asc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo, _sortBy, _sortDir)

    setLoading(true)
    axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 435,
        },
      })
      .then((r) => {
        // Find the minimum 'createDtTm' value among all objects
        if (r?.data?.trnNewsPublishRequestList) {
          const minDtTm = r?.data?.trnNewsPublishRequestList?.reduce(
            (min, obj) => {
              return obj.createDtTm < min ? obj.createDtTm : min
            },
            r?.data?.trnNewsPublishRequestList[0]?.createDtTm
          )

          console.log(":a2", minDtTm)

          let _ress = []

          _ress.push(
            ...r?.data?.trnNewsPublishRequestList?.map((r, i) => {
              return {
                ...r,
                srNo: i + 1 + _pageNo * _pageSize,
                // advertisementTypeName: advertisementTypes?.find((f) => f.id == r.advertisementType)?.name,
                // advertisementTypeNameMr: advertisementTypes?.find((f) => f.id == r.advertisementType)?.nameMr,
                newsPublishDate: moment(r?.newsPublishDate).format(
                  "DD-MM-YYYY"
                ),
                isEnabledEyeButton: r?.createDtTm === minDtTm,
                isFAEnabledEyeButton: authority?.includes(
                  "RELEASING_ORDER_ENTRY"
                )
                  ? true
                  : false,
              }
            })
          )

          setData({
            rows: _ress,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
            totalRows: r.data.totalElements,
          })
          setLoading(false)
        } else {
          setLoading(false)
          sweetAlert({
            title: "ERROR!",
            text: `${
              language == "en"
                ? "Sorry, No Data Found"
                : "क्षमस्व, कोणताही डेटा आढळला नाही"
            }`,
            icon: "error",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
            dangerMode: true,
          })
        }
      })
      .catch((error) => {
        console.log("error: ", error)
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    getAllTableData()
  }, [])

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log("body", body)
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewsPublishRequest/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getAllTableData()
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to Inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewsPublishRequest/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                // getPaymentRate();
                getAllTableData()
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    }
  }

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "left",
      headerAlign: "center",
      width: 80,
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: (
        <Tooltip title={<FormattedLabel id="departmentName" />}>
          <FormattedLabel id="departmentName" />
        </Tooltip>
      ),
      // minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
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
      field: "newsPublishRequestNo",
      headerName: (
        <Tooltip title={<FormattedLabel id="newsreqNumber" />}>
          <span className="csutable-cell-trucate">
            <FormattedLabel id="newsreqNumber" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.newsPublishRequestNo}>
          <span className="csutable-cell-trucate">
            {params.row.newsPublishRequestNo}
          </span>
        </Tooltip>
      ),
    },
    {
      field: language == "en" ? "typeOfNewsName" : "typeOfNewsNameMr",
      headerName: (
        <Tooltip title={<FormattedLabel id="newsTypeHeading" />}>
          <span className="csutable-cell-trucate">
            <FormattedLabel id="newsTypeHeading" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip
          title={
            language === "en"
              ? params.row.typeOfNewsName
              : params.row.typeOfNewsNameMr
          }
        >
          <span className="csutable-cell-trucate">
            {language === "en"
              ? params.row.typeOfNewsName
              : params.row.typeOfNewsNameMr}
          </span>
        </Tooltip>
      ),
    },

    // {
    //   field: "newsPublishDate",
    //   headerName: (
    //     <Tooltip title={<FormattedLabel id="newsFromDateTable" />}>
    //       <span className="csutable-cell-trucate">
    //         <FormattedLabel id="newsFromDateTable" />
    //       </span>
    //     </Tooltip>
    //   ),
    //   flex: 1,
    //   minWidth: 100,
    //   align: "left",
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <Tooltip
    //       title={moment(params.row.newsPublishDate).format("DD-MM-YYYY")}
    //     >
    //       <span className="csutable-cell-trucate">
    //         {moment(params.row.newsPublishDate).format("DD-MM-YYYY")}
    //       </span>
    //     </Tooltip>
    //   ),
    // },

    {
      field: "createDtTm",
      headerName: (
        <Tooltip title={<FormattedLabel id="newsFromDateTable" />}>
          <span className="csutable-cell-trucate">
            <FormattedLabel id="requestDate" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip
          title={moment(params.row.createDtTm).format("DD-MM-YYYY HH:mm:ss")}
        >
          <span className="csutable-cell-trucate">
            {moment(params.row.createDtTm).format("DD-MM-YYYY HH:mm:ss")}
          </span>
        </Tooltip>
      ),
    },

    {
      field: "newsPublishDate",
      headerName: <FormattedLabel id="publishDate" />,
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.newsPublishDate}>
          <span className="csutable-cell-trucate">
            {params.row.newsPublishDate}
          </span>
        </Tooltip>
      ),
    },

    {
      field:
        language == "en" ? "advertisementTypeName" : "advertisementTypeNameMr",
      headerName: (
        <Tooltip title={<FormattedLabel id="advertisementTypeHeading" />}>
          <span className="csutable-cell-trucate">
            <FormattedLabel id="advertisementTypeHeading" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip
          title={
            language === "en"
              ? params.row.advertisementTypeName
              : params.row.advertisementTypeNameMr
          }
        >
          <span className="csutable-cell-trucate">
            {language === "en"
              ? params.row.advertisementTypeName
              : params.row.advertisementTypeNameMr}
          </span>
        </Tooltip>
      ),
    },

    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      minWidth: 50,
      // minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.status}>
          <span className="csutable-cell-trucate">{params.row.status}</span>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      width: 200,
      align: "center",
      headerAlign: "center",
      // minWidth: 100,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {(authority?.includes("ADMIN") || authority?.includes("ENTRY")) && (
              <>
                {[
                  "DRAFTED",
                  "REVERT_BACK_TO_CONCERN_DEPT_USER",
                  "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_FINAL_AUTHORITY",
                  "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_PRO_DEPARTMENT",
                  "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_NRMS_CLERK",
                ].includes(params?.row?.status) && (
                  <Tooltip title={<FormattedLabel id="edit" />}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
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
                )}
              </>
            )}

            {authority?.includes("APPROVAL") &&
              !authority?.includes("FINAL_APPROVAL") &&
              !["DRAFTED", "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT"].includes(
                params?.row?.status
              ) && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
                      query: {
                        pageMode: "PROCESS",
                        id: params?.row?.id,
                      },
                    })
                  }}
                >
                  <Button
                    sx={{ width: "92px" }}
                    variant="contained"
                    endIcon={<PendingActionsIcon />}
                    size="small"
                  >
                    Action
                  </Button>
                </IconButton>
              )}

            {/* nr clk send mail btn */}
            {authority?.includes("SEND_TO_PUBLISH") &&
              ["FINAL_APPROVED"].includes(params?.row?.status) &&
              params?.row?.isFAEnabledEyeButton && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
                      query: {
                        pageMode: "PROCESS",
                        id: params?.row?.id,
                      },
                    })
                  }}
                >
                  <Button
                    sx={{ width: "92px" }}
                    variant="contained"
                    endIcon={<PendingActionsIcon />}
                    size="small"
                  >
                    Action
                  </Button>
                </IconButton>
              )}

            {/* Action of nr clk */}
            {authority?.includes("RELEASING_ORDER_ENTRY") &&
              ![
                "DRAFTED",
                "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
                "FINAL_APPROVED",
              ].includes(params?.row?.status) &&
              params?.row?.isEnabledEyeButton && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
                      query: {
                        pageMode: "PROCESS",
                        id: params?.row?.id,
                      },
                    })
                  }}
                >
                  <Button
                    sx={{ width: "92px" }}
                    variant="contained"
                    endIcon={<PendingActionsIcon />}
                    size="small"
                  >
                    Action
                  </Button>
                </IconButton>
              )}

            {/* ///////////////////// VIEW BUTTON OF NR CLK //////////////////// */}
            {(authority?.includes("RELEASING_ORDER_ENTRY") ||
              authority?.includes("SEND_TO_PUBLISH")) &&
              ![
                "DRAFTED",
                "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
                "FINAL_APPROVED",
              ].includes(params?.row?.status) &&
              (!params?.row?.isFAEnabledEyeButton ||
                !params?.row?.isEnabledEyeButton) && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
                      query: {
                        pageMode: "VIEW",
                        id: params?.row?.id,
                      },
                    })
                  }}
                >
                  <Button
                    sx={{ width: "92px" }}
                    variant="contained"
                    endIcon={<EyeFilled />}
                    size="small"
                  >
                    VIEW
                  </Button>
                </IconButton>
              )}

            {/* ///////////////////// VIEW BUTTON OF NR HOD //////////////////// */}
            {/* {(
              authority?.includes("FINAL_APPROVAL")) &&
              ![
                "DRAFTED",
                "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
                "FINAL_APPROVED",
              ].includes(params?.row?.status) &&
              (!params?.row?.isFAEnabledEyeButton ||
                !params?.row?.isEnabledEyeButton) && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
                      query: {
                        pageMode: "VIEW",
                        id: params?.row?.id,
                      },
                    });
                  }}
                >
                  <Button
                    sx={{ width: "92px" }}
                    variant="contained"
                    endIcon={<EyeFilled />}
                    size="small"
                  >
                    VIEW
                  </Button>
                </IconButton>
              )} */}

            {/* Action of nr nr hod */}
            {authority?.includes("FINAL_APPROVAL") &&
              !["DRAFTED", "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT"].includes(
                params?.row?.status
              ) &&
              params?.row?.isEnabledEyeButton && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
                      query: {
                        pageMode: "PROCESS",
                        id: params?.row?.id,
                      },
                    })
                  }}
                >
                  <Button
                    sx={{ width: "92px" }}
                    variant="contained"
                    endIcon={<PendingActionsIcon />}
                    size="small"
                  >
                    Action
                  </Button>
                </IconButton>
              )}

            {/* Action of nr nr hod */}
            {authority?.includes("ADMIN") &&
              !["DRAFTED", "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT"].includes(
                params?.row?.status
              ) && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
                      query: {
                        pageMode: "PROCESS",
                        id: params?.row?.id,
                      },
                    })
                  }}
                >
                  <Button
                    sx={{ width: "92px" }}
                    variant="contained"
                    endIcon={<PendingActionsIcon />}
                    size="small"
                  >
                    Action
                  </Button>
                </IconButton>
              )}

            {/* Action of nr nr hod */}
            {/* {(
              (authority?.includes("APPROVAL") &&
                authority?.includes("FINAL_APPROVAL"))) &&
              ["CREATED"].includes(
                params?.row?.status
              ) &&
               (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
                      query: {
                        pageMode: "PROCESS",
                        id: params?.row?.id,
                      },
                    });
                  }}
                >
                  <Button
                    sx={{ width: "92px" }}
                    variant="contained"
                    endIcon={<PendingActionsIcon />}
                    size="small"
                  >
                    Action
                  </Button>
                </IconButton>
              )} */}
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
            <FormattedLabel id="newsPublish" />
          </h2>
        </Box>
        <Divider />
        <Box
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 1,
          }}
        ></Box>
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
          {(authority?.includes("ADMIN") || authority?.includes("ENTRY")) && (
            <div>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                onClick={() => {
                  // reset({
                  //   ...resetValuesExit,
                  // });

                  // Removed terms and condition page | Client Requirements 16-10-2023
                  router.push({
                    pathname:
                      "/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create",
                  })
                }}
              >
                <FormattedLabel id="addNew" />
              </Button>
            </div>
          )}
        </div>

        <div>
          <Box
            sx={{
              height: 500,
              overflowX: "auto",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "60vh",
                }}
              >
                <Paper
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "white",
                    borderRadius: "50%",
                    padding: 8,
                  }}
                  elevation={8}
                >
                  <CircularProgress color="success" />
                </Paper>
              </div>
            ) : (
              <DataGrid
                rowHeight={70}
                getRowId={(row) => row.id}
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
                  getAllTableData(data.pageSize, _data)
                }}
                onPageSizeChange={(_data) => {
                  getAllTableData(_data, data.page)
                }}
              />
            )}
          </Box>
        </div>
      </Paper>
    </>
  )
}

export default Index
