import PendingActionsIcon from "@mui/icons-material/PendingActions"
import { EyeFilled } from "@ant-design/icons"
import { ApprovalRounded } from "@mui/icons-material"
import ContentCutIcon from "@mui/icons-material/ContentCut"
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"
import EditIcon from "@mui/icons-material/Edit"
import NewspaperIcon from "@mui/icons-material/Newspaper"
import NoteAltIcon from "@mui/icons-material/NoteAlt"
import PrintIcon from "@mui/icons-material/Print"
import VisibilityIcon from "@mui/icons-material/Visibility"
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined"
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import urls from "../../../URLS/urls"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css"

import AssignmentIcon from "@mui/icons-material/Assignment"
import Logout from "@mui/icons-material/Logout"
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import Divider from "@mui/material/Divider"
import moment from "moment"
import { catchExceptionHandlingMethod } from "../../../util/util"

// Main Component - Clerk
const Index = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const router = useRouter()
  const [notification, setNotification] = useState()

  const [advertisementTypes, setadvertisementTypes] = useState([
    { id: 1, name: "Corrigendum", nameMr: "शुद्धीपत्र" },
    { id: 2, name: "New Tender", nameMr: "नवीन निविदा" },
  ])

  const user = useSelector((state) => state?.user.user)
  const language = useSelector((state) => state?.labels.language)
  const [authority, setAuthority] = useState([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 5,
    page: 1,
  })

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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData)
  }

  const approveRevertRemarkDailogOpen = () => {
    console.log("222222", watch("subject"), watch("body"))
    const finalBody = {
      subject: watch("subject"),
      body: watch("body"),
    }
    axios
      .post(
        // `${urls.NRMS}/prime/sendMail`,
        finalBody,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            // Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMDAxNDMiLCJpYXQiOjE2OTEwNjM5NTcsImV4cCI6MTY5MTA5OTk1N30.TjF0FlobVSmhO88HQjmbo81HXsoZLegO6oDKd7jcJ51YQ8H4lPCFpKDRWP-Ps2vS8TM8i69oLrKQx1oIzFVk8w`,
            serviceId: "435",
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          swal({
            title: "Email send Successfully",
            // text: "application send to the sub fire officer",
            icon: "success",
            button: "Ok",
          })
          router.back()
        }
      })
  }

  // get  Notifications
  const getNotification = () => {
    axios
      .post(`${urls.NRMS}/prime/getNotifications`, null, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          // Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMDAxNDMiLCJpYXQiOjE2OTEwNjM5NTcsImV4cCI6MTY5MTA5OTk1N30.TjF0FlobVSmhO88HQjmbo81HXsoZLegO6oDKd7jcJ51YQ8H4lPCFpKDRWP-Ps2vS8TM8i69oLrKQx1oIzFVk8w`,
          serviceId: "435",
        },
      })
      .then((res) => {
        console.log("notificationData", res?.data)

        setNotification(res?.data)
      })
      .catch((error) => {
        console.log("error: ", error)
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  const [dashboardType, setDashboardType] = useState({
    endPoint: "trnNewsPublishRequest",
    serviceId: 435,
  })

  const [columns, setColumns] = useState([
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
        <Tooltip title={params.row.createDtTm}>
          <span className="csutable-cell-trucate">{params.row.createDtTm}</span>
        </Tooltip>
      ),
    },
    {
      field: "newsPublishRequestNo",
      headerName: <FormattedLabel id="newsreqNumber" />,
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
      headerName: <FormattedLabel id="newsTypeHeading" />,
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
      headerName: <FormattedLabel id="advertisementTypeHeading" />,
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
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.status}>
            <span className="csutable-cell-trucate">{params.row.status}</span>
          </Tooltip>
        )
      },
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
            {authority?.includes("ADMIN") ||
              (authority?.includes("ENTRY") && (
                <>
                  {[
                    "DRAFTED",
                    "REVERT_BACK_TO_CONCERN_DEPT_USER",
                    "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_FINAL_AUTHORITY",
                    "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_PRO_DEPARTMENT",
                  ].includes(params?.row?.status) && (
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
                  )}
                </>
              ))}

            {(authority?.includes("ADMIN") ||
              (authority?.includes("APPROVAL") &&
                !authority?.includes("FINAL_APPROVAL"))) &&
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
            {(authority?.includes("ADMIN") ||
              authority?.includes("SEND_TO_PUBLISH")) &&
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
            {(authority?.includes("ADMIN") ||
              authority?.includes("RELEASING_ORDER_ENTRY")) &&
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
            {(authority?.includes("ADMIN") ||
              authority?.includes("RELEASING_ORDER_ENTRY") ||
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
            {/* {(authority?.includes("ADMIN") ||
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
            {(authority?.includes("ADMIN") ||
              authority?.includes("FINAL_APPROVAL")) &&
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
            {/* {(authority?.includes("ADMIN") ||
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
  ])

  const getMyApplications = (
    _endPoint = "trnNewsPublishRequest",
    _serviceId = 435,
    _pageSize = 5,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = _endPoint == "trnNewsPublishRequest" ? "asc" : "desc"
  ) => {
    console.log("authorityyyy", authority)
    setAuthority(
      user?.menus?.find((r) => {
        return r.id == _serviceId
      })?.roles
    )

    setLoading(true)
    axios
      .get(`${urls.NRMS}/${_endPoint}/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user?.token}`,
          serviceId: _serviceId,
        },
      })
      .then((resp) => {
        if (
          resp?.data?.trnNewsPublishRequestList ||
          resp?.data?.trnNewspaperAgencyBillSubmissionList ||
          resp?.data?.trnPressNoteRequestApprovalList ||
          resp?.data?.trnPaperCuttingBookList
        ) {
          let response = []
          console.log("resp: ", resp)
          if (_endPoint == "trnNewsPublishRequest") {
            // Find the minimum 'createDtTm' value among all objects
            const minDtTm = resp?.data?.trnNewsPublishRequestList?.reduce(
              (min, obj) => {
                return obj.createDtTm < min ? obj.createDtTm : min
              },
              resp?.data?.trnNewsPublishRequestList[0]?.createDtTm
            )

            response = resp?.data?.trnNewsPublishRequestList?.map((item, i) => {
              return {
                ...item,
                srNo: i + 1 + _pageNo * _pageSize,
                isEnabledEyeButton: item?.createDtTm === minDtTm,
                isFAEnabledEyeButton: authority?.includes(
                  "RELEASING_ORDER_ENTRY"
                )
                  ? true
                  : false,
              }
            })
          } else if (_endPoint == "trnNewspaperAgencyBillSubmission") {
            response = resp?.data?.trnNewspaperAgencyBillSubmissionList?.map(
              (item, i) => {
                return {
                  ...item,
                  srNo: i + 1 + _pageNo * _pageSize,
                  newsPublishDate: item?.newsPublishRequestDao?.newsPublishDate,
                  departmentName: item?.newsPublishRequestDao?.departmentName,
                  departmentNameMr:
                    item?.newsPublishRequestDao?.departmentNameMr,
                }
              }
            )
          } else if (_endPoint == "trnPressNoteRequestApproval") {
            response = resp?.data?.trnPressNoteRequestApprovalList?.map(
              (item, i) => {
                return { ...item, srNo: i + 1 + _pageNo * _pageSize }
              }
            )
          } else if (_endPoint == "trnPaperCuttingBook") {
            response = resp?.data?.trnPaperCuttingBookList?.map((item, i) => {
              return { ...item, srNo: i + 1 + _pageNo * _pageSize }
            })
          }
          setData({
            rows: response,
            totalRows: resp?.data?.totalElements,
            rowsPerPageOptions: [5, 10, 20, 50, 100],
            pageSize: resp?.data?.pageSize,
            page: resp?.data?.pageNo,
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
    localStorage.setItem("selectedMenuFromDrawer", 435)
    let roles = user?.menus?.find((r) => {
      return r.id == 435
    })?.roles
    console.log("roles", roles)
    setAuthority(roles)
  }, [])

  useEffect(() => {
    getNotification()
  }, [])

  useEffect(() => {
    if (dashboardType.endPoint == "trnNewsPublishRequest") {
      getMyApplications()
    }
  }, [columns])

  useEffect(() => {
    if (authority?.length > 0) {
      if (dashboardType?.endPoint == "trnNewsPublishRequest") {
        setColumns([
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
            headerName: <FormattedLabel id="newsreqNumber" />,
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
            headerName: <FormattedLabel id="newsTypeHeading" />,
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
                title={moment(params.row.createDtTm).format(
                  "DD-MM-YYYY HH:mm:ss"
                )}
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
              language == "en"
                ? "advertisementTypeName"
                : "advertisementTypeNameMr",
            headerName: <FormattedLabel id="advertisementTypeHeading" />,
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
            renderCell: (params) => {
              // On dashboard when status is "CREATED" show "PENDING" status | Client Requirements 16-10-2023
              return (
                <Tooltip title={params.row.status}>
                  <span className="csutable-cell-trucate">
                    {params.value.toLowerCase() === "created"
                      ? "Pending"
                      : capitalizeFirstLetter(params.value)}
                  </span>
                </Tooltip>
              )
            },
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
                  {authority?.includes("ADMIN") ||
                    (authority?.includes("ENTRY") && (
                      <>
                        {[
                          "DRAFTED",
                          "REVERT_BACK_TO_CONCERN_DEPT_USER",
                          "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_FINAL_AUTHORITY",
                          "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_PRO_DEPARTMENT",
                          "REVERT_BACK_TO_CONCERN_DEPT_USER_BY_NRMS_CLERK",
                        ].includes(params?.row?.status) && (
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
                        )}
                      </>
                    ))}

                  {(authority?.includes("ADMIN") ||
                    (authority?.includes("APPROVAL") &&
                      !authority?.includes("FINAL_APPROVAL"))) &&
                    ![
                      "DRAFTED",
                      "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
                    ].includes(params?.row?.status) && (
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
                  {(authority?.includes("ADMIN") ||
                    authority?.includes("SEND_TO_PUBLISH")) &&
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
                  {(authority?.includes("ADMIN") ||
                    authority?.includes("RELEASING_ORDER_ENTRY")) &&
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
                  {(authority?.includes("ADMIN") ||
                    authority?.includes("RELEASING_ORDER_ENTRY") ||
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
                  {/* {(authority?.includes("ADMIN") ||
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
                  {(authority?.includes("ADMIN") ||
                    authority?.includes("FINAL_APPROVAL")) &&
                    ![
                      "DRAFTED",
                      "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT",
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

                  {/* Action of nr nr hod */}
                  {/* {(authority?.includes("ADMIN") ||
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
        ])
      } else if (dashboardType.endPoint == "trnNewspaperAgencyBillSubmission") {
        setColumns([
          {
            field: "srNo",
            headerName: language == "en" ? "Sr No" : "अ.क्र",
            align: "center",
            headerAlign: "center",
            width: 80,
          },

          {
            field: "billNo",
            headerName: language == "en" ? "Bill No" : "बिल नं.",
            width: 100,
            flex: 1,
            align: "center",
            headerAlign: "center",
          },

          {
            field: language == "en" ? `departmentName` : `departmentNameMr`,
            headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
            width: 150,
            flex: 1,
            align: "center",
            headerAlign: "center",
          },

          {
            field: "newsPublishDate",
            headerName:
              language == "en"
                ? "News/Advertisement Publish Date"
                : "प्रकाशन दिनांक",
            width: 100,
            flex: 1,
            align: "center",
            headerAlign: "center",
          },

          {
            field: "totalAmount",
            headerName: language == "en" ? "Bill Amount" : "बिलाची रक्कम",
            width: 80,
            flex: 1,
            align: "center",
            headerAlign: "center",
          },

          {
            field: "status",
            headerName: language == "en" ? "Status" : "स्थिती",
            width: 100,
            flex: 1,
            align: "center",
            headerAlign: "center",
          },

          {
            field: "actions",
            headerName: language == "en" ? "Actions" : "कृती",
            width: 200,
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
              return (
                <Box>
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/newsRotationManagementSystem/transaction/newsPaperAgencybill/create/",
                        query: {
                          pageMode: "View",
                          id: params?.row?.id,
                        },
                      })
                    }}
                  >
                    <EyeFilled style={{ color: "#556CD6" }} />
                  </IconButton>
                  {/* {params.row.status == "DATA_PUSHED_TO_FICO_SAP" && (
                  <IconButton
                    onClick={() => {
                      localStorage.setItem(
                        "newspaperAgencyBillSubmissionId",
                        params?.row?.id
                      );
                      router.push(
                        "/newsRotationManagementSystem/transaction/releasingOrder/payment/"
                      );
                    }}
                  >
                    <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                )} */}

                  {authority?.includes("ENTRY") && (
                    <>
                      {[
                        "DRAFTED",
                        "REVERT_BACK_TO_DEPT_USER",
                        "PRASTAV_GENERATED",
                        "AADESH_GENERATED",
                        "BUDGET_PROVISION_GENERATED",
                      ].includes(params.row.status) && (
                        <Tooltip
                          title={language == "en" ? "Edit" : "सुधारणा करा"}
                        >
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/newsRotationManagementSystem/transaction/newsPaperAgencybill/create/",
                                query: {
                                  pageMode: "Edit",
                                  id: params?.row?.id,
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

                  {authority?.includes("FINAL_APPROVAL") &&
                    params.row.status != "DRAFTED" && (
                      <>
                        <Tooltip
                          title={language == "en" ? "APPROVE" : "मंजूर करा"}
                        >
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/newsRotationManagementSystem/transaction/newsPaperAgencybill/create",
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
                </Box>
              )
            },
          },
        ])
      } else if (dashboardType.endPoint == "trnPressNoteRequestApproval") {
        setColumns([
          {
            headerName: "Sr No",
            field: "srNo",
            minWidth: 80,
            flex: 1,
            align: "center",
            headerAlign: "center",
          },
          {
            headerName: "Press Note Request Number",
            field: "pressNoteRequestNo",
            minWidth: 200,
            flex: 2,
            align: "left",
            headerAlign: "center",
            renderCell: (params) => (
              <Tooltip title={params.row.pressNoteRequestNo}>
                <span className="csutable-cell-trucate">
                  {params.row.pressNoteRequestNo}
                </span>
              </Tooltip>
            ),
          },
          {
            headerName: <FormattedLabel id="ward" />,
            field: language === "en" ? "wardName" : "wardNameMr",
            minWidth: 100,
            flex: 1,

            align: "left",
            headerAlign: "center",
          },
          {
            headerName: <FormattedLabel id="department" />,
            field: language === "en" ? "departmentName" : "departmentNameMr",
            width: 150,
            flex: 2,

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
            headerName: <FormattedLabel id="newsPaperName" />,
            field: language === "en" ? "newsPapersNames" : "newsPapersNamesMr",
            minWidth: 200,
            flex: 2,

            align: "left",
            headerAlign: "center",
          },
          {
            headerName: <FormattedLabel id="advertisementType" />,
            field:
              language === "en"
                ? "advertisementTypeName"
                : "advertisementTypeNameMr",
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
            headerName: <FormattedLabel id="status" />,
            field: "status",
            minWidth: 200,
            flex: 1,

            align: "left",
            headerAlign: "center",
            renderCell: (params) => (
              <Tooltip
                title={
                  language === "en" ? params.row.status : params.row.status
                }
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
            minWidth: 200,
            align: "center",
            headerAlign: "center",
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
                  {(authority?.includes("ENTRY") ||
                    authority?.includes("ADMIN")) &&
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

                  {/* process logic */}
                  {(authority?.includes("APPROVAL") ||
                    authority?.includes("RELEASING_ORDER_ENTRY") ||
                    authority?.includes("FINAL_APPROVAL") ||
                    authority?.includes("ENTRY")) &&
                    params.row.status != "DRAFTED" && (
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
                            // {
                            //   handlePrint;
                            // }
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
                          <LocalPrintshopOutlinedIcon
                            style={{ color: "#556CD6" }}
                          />
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
        ])
      } else if (dashboardType.endPoint == "trnPaperCuttingBook") {
        setColumns([
          {
            field: "srNo",
            headerName: <FormattedLabel id="srNo" />,
            align: "center",
            headerAlign: "center",
            width: 80,
          },

          {
            field: "departmentName",
            headerName: <FormattedLabel id="departmentName" />,
            minWidth: 100,
            flex: 1,
            align: "left",
            headerAlign: "center",
          },

          {
            field: "newspaperName",
            headerName: <FormattedLabel id="newsPaperName" />,
            minWidth: 100,
            flex: 1,
            align: "left",
            headerAlign: "center",
          },

          {
            field: "publishedDate",
            headerName: <FormattedLabel id="publishDate" />,
            // width: 250,
            minWidth: 150,
            flex: 1,
            align: "left",
            headerAlign: "center",
          },

          {
            field: "actions",
            headerName: <FormattedLabel id="action" />,
            headerAlign: "center",
            width: 200,
            align: "left",
            // minWidth: 100,
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
              return (
                <Box>
                  <IconButton
                    // disabled={editButtonInputState}
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
                  {authority && authority.includes("VIEW") ? (
                    <IconButton
                      // disabled={editButtonInputState}
                      onClick={() => {
                        // const record = params.row;
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
        ])
      }
    }
  }, [authority, dashboardType])

  return (
    <>
      <div>
        <Paper
          component={Box}
          squar="true"
          elevation={5}
          m={1}
          pt={2}
          pb={2}
          pr={2}
          pl={4}
        >
          <Grid container>
            {/* {authority?.includes("RELEASING_ORDER_ENTRY") ||
              (authority?.includes("FINAL_APPROVAL") && (
            <> */}
            <Grid item xs={11}></Grid>
            <Grid item xs={1}>
              <React.Fragment>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Tooltip title="Notifications">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      {/* <Avatar sx={{ width: 32, height: 32 }}>N</Avatar> */}
                      {/* <CircleNotificationsIcon sx={{ width: 32, height: 32 }} /> */}
                      <NotificationsNoneIcon
                        sx={{
                          color: "#007FFF",
                          width: 32,
                          height: 32,
                          // border: "0.2px solid #007FFF",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{
                    horizontal: "right",
                    vertical: "top",
                  }}
                  anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    Notifications{" "}
                    <NotificationsActiveIcon
                      style={{ marginLeft: 5, color: "red" }}
                      fontSize="medium"
                    />
                  </MenuItem>

                  <Divider />
                  {/* <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <PersonAdd fontSize='small' />
                    </ListItemIcon>
                    Add another account
                  </MenuItem> */}

                  {notification &&
                    notification.map((n, index) => {
                      return (
                        <>
                          <MenuItem
                            key={index}
                            onClick={handleClose}
                            sx={{ width: "100%" }}
                          >
                            {console.log("...........", n)}{" "}
                            <Grid
                              container
                              spacing={1}
                              columns={{ xs: 12, sm: 12, md: 12 }}
                            >
                              <Grid item xs={0.8}>
                                <ListItemIcon>
                                  {/* {n.advertisementRequestNo} */}

                                  <AssignmentIcon
                                    style={{
                                      marginLeft: "-9px",
                                      color: "#007FFF",
                                    }}
                                    fontSize="medium"
                                  />
                                  {/* <Settings fontSize='small' /> */}
                                </ListItemIcon>
                              </Grid>
                              <Grid item xs={4.3}>
                                {n.advertisementRequestNo}
                              </Grid>
                              <Grid item xs={4}>
                                {language == "en"
                                  ? n.description
                                  : n.descriptionMr}
                              </Grid>
                              <Grid item xs={2}>
                                <Button
                                  key={index}
                                  sx={{
                                    marginLeft: 2,
                                    fontSize: 10,
                                  }}
                                  size="small"
                                  variant="outlined"
                                  onClick={() => {
                                    router.push({
                                      pathname:
                                        "/newsRotationManagementSystem/dashboard/sendMail",
                                      query: {
                                        ...n,
                                        newsPaper: JSON.stringify(n.newspapers),
                                      },
                                    })
                                  }}
                                >
                                  Send Mail
                                </Button>
                              </Grid>
                            </Grid>
                          </MenuItem>
                        </>
                      )
                    })}
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Logout
                        style={{ marginLeft: 3, color: "red" }}
                        fontSize="small"
                      />
                    </ListItemIcon>
                    Exit
                  </MenuItem>
                </Menu>
              </React.Fragment>
            </Grid>
            {/* </>
            ))} */}

            {/** Applications Tabs */}
            <Grid item xs={12}>
              <h3 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>
                  {language == "en"
                    ? "News Paper Advertisement System Dashboard"
                    : "वृत्तपत्र जाहिरात प्रणाली डॅशबोर्ड"}
                </b>
              </h3>
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{ height: "160px" }}
                component={Box}
                p={2}
                m={2}
                squar="true"
                elevation={5}
                // sx={{ align: "center" }}
              >
                <div className={styles.test}>
                  {/** Advertisement Rotation */}
                  <div
                    className={styles.one}
                    // onClick={() => clerkTabClick('TotalApplications')}
                  >
                    <div className={styles.icono}>
                      <NewspaperIcon color="secondary" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <Button
                        onClick={() => {
                          setDashboardType({
                            endPoint: "trnNewsPublishRequest",
                            serviceId: 435,
                          })
                          // no need to call again !! coz we call "getMyApplications()" in useEffect if dashboardType dependency
                          // getMyApplications("trnNewsPublishRequest", 435);
                        }}
                      >
                        <strong>
                          {language == "en"
                            ? "Advertisement Rotation"
                            : "बातमी/जाहिरातीचे रोटेशन"}
                        </strong>
                      </Button>
                    </div>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Press Note Release */}
                  <div className={styles.one}>
                    <div className={styles.icono}>
                      <NoteAltIcon color="error" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <Button
                        onClick={() => {
                          setDashboardType({
                            endPoint: "trnPressNoteRequestApproval",
                            serviceId: 1103,
                          }),
                            getMyApplications(
                              "trnPressNoteRequestApproval",
                              1103
                            )
                        }}
                      >
                        <strong>
                          {language == "en"
                            ? "Press Note Release"
                            : "प्रेस नोट रिलीझ"}
                        </strong>
                      </Button>
                    </div>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Paper Cutting Book */}
                  <div
                    className={styles.one}
                    // onClick={() => clerkTabClick('PENDING')}
                  >
                    <div className={styles.icono}>
                      <ContentCutIcon color="warning" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <Button
                        onClick={() => {
                          setDashboardType({
                            endPoint: "trnPaperCuttingBook",
                            serviceId: 1102,
                          }),
                            getMyApplications("trnPaperCuttingBook", 1102)
                        }}
                      >
                        <strong /* align="center" */>
                          {language == "en"
                            ? "Paper Cutting Book"
                            : "पेपर कटिंग बुक"}
                        </strong>
                      </Button>
                    </div>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** newsPaper Agency bill */}
                  <div className={styles.one}>
                    <div className={styles.icono}>
                      <CurrencyRupeeIcon color="success" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <Button
                        onClick={() => {
                          setDashboardType({
                            endPoint: "trnNewspaperAgencyBillSubmission",
                            serviceId: 1101,
                          }),
                            getMyApplications(
                              "trnNewspaperAgencyBillSubmission",
                              1101
                            )
                        }}
                      >
                        <strong /* align="center" */>
                          {language == "en"
                            ? "News Paper Agency Bill Submission"
                            : "न्यूजपेपर एजन्सी बिल सबमिशन"}
                        </strong>
                      </Button>
                    </div>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </div>

      <Box
        style={{
          backgroundColor: "white",
          height: "auto",
          width: "auto",
          overflow: "auto",
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
            // rowHeight={70}
            autoHeight
            getRowId={(row) => row?.srNo}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
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
            pagination
            paginationMode="server"
            rowCount={data?.totalRows}
            rowsPerPageOptions={data?.rowsPerPageOptions}
            page={data?.page}
            pageSize={data?.pageSize}
            rows={data?.rows ?? []}
            columns={columns}
            onPageChange={(_data) => {
              getMyApplications(
                dashboardType.endPoint,
                dashboardType.serviceId,
                data.pageSize,
                _data
              )
            }}
            onPageSizeChange={(_data) => {
              getMyApplications(
                dashboardType.endPoint,
                dashboardType.serviceId,
                _data,
                data.page
              )
            }}
          />
        )}
      </Box>
    </>
  )
}

export default Index
