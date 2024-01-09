import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextareaAutosize,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import urls from "../../../../../URLS/urls";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProvisionalNoc from "../../../prints/provisionalFireNOC";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LoiCollectionComponent from "../../../../../components/fireBrigadeSystem/provisionalBuildingNoc/LoiCollectionComponent";
import LoiGenerationComponent from "../../../../../components/fireBrigadeSystem/provisionalBuildingNoc/LoiGenerationComponent";
import LoiGenerationRecipt from "../../../../../components/fireBrigadeSystem/provisionalBuildingNoc/LoiGenerationRecipt";
import SiteVisit from "../../../../../components/fireBrigadeSystem/provisionalBuildingNoc/SiteVisit";
import SiteVisitSchedule from "../../../../../components/fireBrigadeSystem/provisionalBuildingNoc/SiteVisitSchedule";
import VerificationAppplicationDetails from "../../../../../components/fireBrigadeSystem/provisionalBuildingNoc/VerificationAppplicationDetails";
import ApplicantDetails from "../../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/ApplicantDetails";
import BuildingDetails from "../../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/BuildingDetails";
import FormsDetails from "../../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/FormsDetails";
import OwnerDetail from "../../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/OwnerDetail";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import ProvisionalHistoryComponent from "../../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/ProvisionalHistoryComponent";
import theme from "../../../../../theme";
import MoneyIcon from "@mui/icons-material/Money";
// import NocTypes from "../nocTypes";
import {
  Services,
  BusinessTypes,
  NocTypes,
} from "../../../../../components/fireBrigadeSystem/NocTypes";
// import {Services,BusinessTypes,NocTypes} from "../../../pages/FireBrigadeSystem/transactions/provisionalBuildingNoc/NocTypes";
import moment from "moment";
import Loader from "../../../../../containers/Layout/components/Loader";
// import ApplicantDetails from "../../../../../components/fireBrigadeSystem/provisionalBuildingNoc/ApplicantDetails";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const language = useSelector((state) => state?.labels?.language);
  const userToken = useGetToken();

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
  });

  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;
  const router = useRouter();

  // role base
  const [authority, setAuthority] = useState();

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const user = useSelector((state) => state.user.user);

  const [newRole, setNewRole] = useState();

  const [applicationData, setApplicationData] = useState();
  const [tableData, setTableData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [dataSource, setDataSource] = useState([]);

  // // site Schedule Modal
  const [siteVisitScheduleModal, setSiteVisitScheduleModal] = useState(false);
  const siteVisitScheduleOpen = () => setSiteVisitScheduleModal(true);
  const siteVisitScheduleClose = () => setSiteVisitScheduleModal(false);

  // // site Visit Dailog
  const [siteVisitDailog, setSetVisitDailog] = useState();
  const siteVisitOpen = () => setSetVisitDailog(true);
  const siteVisitClose = () => setSetVisitDailog(false);

  // // Loi Generation Open
  const [loiGeneration, setLoiGeneration] = useState(false);
  const loiGenerationOpen = () => setLoiGeneration(true);
  const loiGenerationClose = () => setLoiGeneration(false);

  // // Loi Generation  Recipt
  const [loiGenerationRecipt, setLoiGenerationRecipt] = useState(false);
  const loiGenerationReciptOpen = () => setLoiGenerationRecipt(true);
  const loiGenerationReciptClose = () => setLoiGenerationRecipt(false);

  // loi Collection
  const [loiCollection, setLoiCollection] = useState(false);
  const loiCollectionOpen = () => setLoiCollection(true);
  const loiCollectionClose = () => setLoiCollection(false);

  // NOC Display
  const [hotelNocRecipt, setHotelRecipt] = useState(false);
  const hotelNOCOpen = () => setHotelRecipt(true);
  const hotelNOCClose = () => setHotelRecipt(false);

  const [hardCodeAuthority, setHardCodeAuthority] = useState();

  // // Verification AO Dialog
  const [verificationAoDailog, setVerificationAoDailog] = useState();
  const verificationAoOpne = () => setVerificationAoDailog(true);
  const verificationAoClose = () => setVerificationAoDailog(false);

  // // Verification SFO Dialog
  const [verificationSfoDailog, setVerificationSfoDailog] = useState();
  const verificationSfoOpne = () => setVerificationSfoDailog(true);
  const verificationSfoClose = () => setVerificationSfoDailog(false);

  // // Approve Remark Modal Close
  const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
  const approveRevertRemarkDailogOpen = () =>
    setApproveRevertRemarkDailog(true);
  const approveRevertRemarkDailogClose = () =>
    setApproveRevertRemarkDailog(false);

  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  const [loadderState, setLoadderState] = useState(false);

  // Get Table - Data
  const getProvisionalNoc = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoadderState(true);
    axios
      .get(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        setLoadderState(false);

        console.log("2312", resp);
        setDataSource(resp.data.provisionBuilding);
        // setTableData(resp.data.provisionBuilding);

        const res = resp?.data?.provisionBuilding?.map((j, i) => ({
          ...j,
          // srNo: i + 1,
          srNo: i + 1 + _pageNo * _pageSize,

          id: j.id,
          applicationNumber: j.applicationNumber,
          // applicationDate: moment(j?.applicationDate).format(
          //   "DD/MM/YYYY"
          // ),
          applicationDate: j.applicationDate,
          applicationDateCol: moment(j.applicationDate).format("DD-MM-YYYY"),
          applicantFullName:
            j.applicantDTLDao?.applicantName +
            " " +
            j.applicantDTLDao?.applicantMiddleName +
            " " +
            j.applicantDTLDao?.applicantLastName,
          applicationStatus: j.applicationStatus,
          nocTypeName: NocTypes.find((obj) => obj.id === j.nocType)?.name,
          activeFlag: j.activeFlag,
          status: j.activeFlag == "Y" ? "Active" : "Inactive",
        }));

        console.log("data ksa yetoy", res);
        setTableData({
          rows: res,
          totalRows: resp.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: resp.data.pageSize,
          page: resp.data.pageNo,
        });
      })
      .catch((Err) => console.log("err", Err));
  };

  const [disabledButtonApproved, setDisabledButtonApproved] = useState(false);

  const remarkFun = (data) => {
    setDisabledButtonApproved(true);
    let approveRemark;
    let rejectRemark;

    if (data == "Approve") {
      approveRemark = watch("verificationRemark");
    } else if (data == "Revert") {
      rejectRemark = watch("verificationRemark");
    }

    const finalBodyForApi = {
      approveRemark,
      rejectRemark,
      id: getValues("id"),
      desg: hardCodeAuthority,
      role: newRole,
    };
    console.log("finalBodyForApi", finalBodyForApi);
    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          setDisabledButtonApproved(false);

          router.push(
            "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny"
          );

          approveRevertRemarkDailogClose();
        } else if (res.status == 201) {
          router.push(
            "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny"
          );
          approveRevertRemarkDailogClose();
        }
      });
  };

  const sendApprovedNotify = () => {
    // Approve Button
    const approveButton = () => {
      documentPreviewDailogClose();
      sendApprovedNotify();
    };
  };

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      align: "center",
      // flex: 0.1,
      width: 10,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      description: "Application Number",
      width: 300,
    },
    {
      field: "applicationDateCol",
      headerName: <FormattedLabel id="applicationDate" />,
      description: "Application Date",
      width: 100,
    },
    {
      field: "nocTypeName",
      headerName: "NOC Type",
      description: "Service Type",
      width: 180,
    },
    {
      field: "applicantFullName",
      headerName: <FormattedLabel id="applicantName" />,
      description: "applicantName",
      width: 300,
    },
    // {
    //   field: "applicantFullName",
    //   headerName: <FormattedLabel id="applicantName" />,
    //   width: 300,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {language == "en"
    //           ? (params.row.applicantDTLDao?.applicantName != null
    //               ? params.row.applicantDTLDao?.applicantName + " "
    //               : "") +
    //             (params.row.applicantDTLDao?.applicantMiddleName != null
    //               ? params.row.applicantDTLDao?.applicantMiddleName + " "
    //               : "") +
    //             (params.row.applicantDTLDao?.applicantLastName != null
    //               ? params.row.applicantDTLDao?.applicantLastName + " "
    //               : "")
    //           : (params.row.applicantDTLDao?.applicantNameMr != null
    //               ? params.row.applicantDTLDao?.applicantNameMr + " "
    //               : "") +
    //             (params.row.applicantDTLDao?.applicantMiddleNameMr != null
    //               ? params.row.applicantDTLDao?.applicantMiddleNameMr + " "
    //               : "") +
    //             (params.row.applicantDTLDao?.applicantLastNameMr != null
    //               ? params.row.applicantDTLDao?.applicantLastNameMr + " "
    //               : "")}
    //       </>
    //     );
    //   },
    // },
    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="applicationStatus" />,
      width: 370,
    },
    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 490,

      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            {/* When Application status is draft */}
            {record?.row?.applicationStatus === "DRAFT" &&
              authority?.find((r) => r === "DEPT_CLERK" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    // sx={{ backgroundColor: "gray", color: "black" }}
                    variant="outlined"
                    size="small"

                    // onClick={() => {
                    //   // reset(record.row);
                    //   // setValue("attachmentss", record.row.attachments);
                    //   // setValue("serviceName", record.row.serviceId);
                    //   // setApplicationData(record.row);
                    //   // setNewRole("DOCUMENT_VERIFICATION");
                    //   // setHardCodeAuthority("DEPT_CLERK");
                    //   // verificationAoOpne();
                    //   // formPreviewDailogOpen();
                    // }}
                  >
                    {/* <FormattedLabel id="documentVerification" /> */}
                    Complete Your Application
                  </Button>
                </IconButton>
              )}

            {/**  Verification DEPT Cleark - Button */}
            {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
              authority?.find((r) => r === "DEPT_CLERK" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("attachmentss", record.row.attachments);
                      setValue("serviceName", record.row.serviceId);
                      setApplicationData(record.row);
                      setNewRole("DOCUMENT_VERIFICATION");
                      setHardCodeAuthority("DEPT_CLERK");
                      verificationAoOpne();
                      // formPreviewDailogOpen();
                    }}
                  >
                    {/* <FormattedLabel id="documentVerification" /> */}
                    {/* VERIFICARION CLERK */}
                    Document Verification
                  </Button>
                </IconButton>
              )}

            {record?.row?.applicationStatus ===
              "APPLICATION_SENT_TO_SUB_FIRE_OFFICER" &&
              authority?.find(
                (r) => r === "SUB_FIRE_OFFICER" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      console.log("11");
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      setApplicationData(record.row);
                      setNewRole("DOCUMENT_VERIFICATION");
                      setHardCodeAuthority("SUB_FIRE_OFFICER");
                      verificationSfoOpne();
                    }}
                  >
                    {/* VERIFICARION SFO */}
                    Application Approval
                  </Button>
                </IconButton>
              )}

            {/* {record?.row?.applicationStatus ==
              "DOCUMENT_VERIFICATION_COMPLETED" &&
              authority?.find(
                (r) => r === "SITE_SCHEDULED" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      siteVisitScheduleOpen();
                    }}
                  >
                    Site Visit Schedule
                  </Button>
                </IconButton>
              )} */}

            {/** Site Visit Schedule Button */}
            {record?.row?.applicationStatus ==
              "DOCUMENT_VERIFICATION_COMPLETED" &&
              authority?.find(
                (r) => r === "SITE_SCHEDULED" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    sx={{
                      backgroundColor: "#8E44AD",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#8E44AD",
                        color: "white",
                      },
                    }}
                    endIcon={<CalendarMonthIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      siteVisitScheduleOpen();
                      setNewRole("DOCUMENT_VERIFICATION");
                      setHardCodeAuthority("SUB_FIRE_OFFICER");
                      router.push({
                        pathname: "/common/masters/siteScheduleProvisional",
                        query: {
                          // btnSaveText: "Update",
                          // pageMode: "Edit",
                          ...record?.row,
                          // slipHandedOverTo: record.slipHandedOverTo,
                        },
                      });
                    }}
                  >
                    Site Visit Schedule
                  </Button>
                </IconButton>
              )}

            {/** Site Visit Button */}
            {record?.row?.applicationStatus == "SITE_VISIT_SCHEDULED" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      siteVisitOpen();
                      setNewRole("LOI_GENERATION");
                      setHardCodeAuthority("SUB_FIRE_OFFICER");
                    }}
                  >
                    Site Visit
                  </Button>
                </IconButton>
              )}

            {/** LOI Generation Button */}
            {record?.row?.applicationStatus === "SITE_VISIT_COMPLETED" &&
              authority?.find(
                (r) => r === "LOI_GENERATION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiGenerationOpen();
                      setNewRole("LOI_COLLECTION");
                      setHardCodeAuthority("SUB_FIRE_OFFICER");
                    }}
                  >
                    {/* LOI Generation */}
                    Payment Verification
                  </Button>
                </IconButton>
              )}
            {/* LOI Generation Recipt Button */}
            {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    sx={{
                      backgroundColor: "#AEB6BF",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "#AEB6BF",
                        color: "black",
                      },
                    }}
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiGenerationReciptOpen();
                    }}
                  >
                    LOI Generation Recipt
                  </Button>
                </IconButton>
              )}

            {/** LOI Collection Button */}
            {/* {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    endIcon={<MoneyIcon />}
                    sx={{
                      backgroundColor: "#4386B2",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#4386B2",
                        color: "white",
                      },
                    }}
                    variant='contained'
                    size='small'
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiCollectionOpen();
                    }}
                  >
                    Payment Collection
                  </Button>
                </IconButton>
              )} */}

            {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    endIcon={<MoneyIcon />}
                    sx={{
                      backgroundColor: "#4386B2",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#4386B2",
                        color: "white",
                      },
                    }}
                    variant="contained"
                    size="small"
                  >
                    Payment Pending
                  </Button>
                </IconButton>
              )}

            {/* Generate LOI  */}
            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    sx={{ backgroundColor: "green" }}
                    variant="contained"
                    endIcon={<ReceiptIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      hotelNOCOpen();
                    }}
                  >
                    Generate NOC
                  </Button>
                </IconButton>
              )}

            {/* NOC */}
            {/* {record?.row?.applicationStatus == "NOC_ISSUED_TO_CITIZEN" &&
              authority?.find((r) => r === "NOC_ISSUE" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      NOCOpen();
                      setNewRole("NOC_ISSUE");
                      setHardCodeAuthority("NOC_ISSUE");
                    }}
                  >
                    NOC
                  </Button>
                </IconButton>
              )} */}

            {/* //Approved by ACCOUNT_OFFICER */}
            {/* {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiCollectionOpen();
                      setNewRole("ACCOUNT_OFFICER");
                      setHardCodeAuthority("ACCOUNT_OFFICER");
                    }}
                  >
                    Approved
                  </Button>
                </IconButton>
              )} */}

            {/** Generate certificate */}
            {/* {record?.row?.applicationStatus == "NOC_ISSUE" &&
              authority?.find((r) => r === "NOC_ISSUE" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      openCertificate();
                    }}
                  >
                    ISSUE NOC
                  </Button>
                </IconButton>
              )} */}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("SachinUser", auth);
    console.log("shree", user);
  }, []);

  useEffect(() => {
    getProvisionalNoc();
    // getServiceNames();
  }, []);

  // view
  return (
    <>
      {loadderState && <Loader />}

      <div style={{ backgroundColor: "white" }}>
        <ToastContainer />
        <Paper
          elevation={5}
          sx={{
            backgroundColor: "#F5F5F5",
          }}
          component={Box}
        >
          <ThemeProvider theme={theme}>
            <FormProvider {...methods}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      marginTop: "2vh",
                    }}
                  >
                    <strong>
                      Building Fire NOC
                      {/* {<FormattedLabel id="addProvisionalBuildingNoc" />} */}
                    </strong>
                  </Typography>
                </Grid>
                <DataGrid
                  sx={{
                    backgroundColor: "white",
                    m: 2,
                    overflowY: "scroll",
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#0084ff",
                      color: "white",
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  //
                  autoHeight={tableData.pageSize}
                  density="compact"
                  pagination
                  paginationMode="server"
                  rows={tableData.rows}
                  columns={columns}
                  rowCount={tableData.totalRows}
                  pageSize={tableData?.pageSize}
                  rowsPerPageOptions={tableData?.rowsPerPageOptions}
                  onPageChange={(_data) => {
                    getProvisionalNoc(tableData?.pageSize, _data);
                  }}
                  onPageSizeChange={(d) => {
                    getProvisionalNoc(d, tableData?.page);
                  }}
                />
              </Grid>
              {console.log("tableData", tableData)}

              {/**  Verification AO */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={verificationAoDailog}
                onClose={() => {
                  verificationAoClose();
                }}
              >
                <CssBaseline />

                <ProvisionalHistoryComponent appId={getValues("id")} />
                <DialogTitle>
                  <b> {<FormattedLabel id="applicationDtlHeading" />}</b>
                </DialogTitle>

                {/* <DialogContent> */}
                <VerificationAppplicationDetails props={applicationData} />
                {/* </DialogContent> */}

                {/* history component for Clerk */}
                {/* <Grid>
                  <ProvisionalHistoryComponent appId={getValues("id")} />
                </Grid> */}

                <DialogTitle>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Stack
                      style={{ display: "flex", justifyContent: "center" }}
                      spacing={3}
                      direction={"row"}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        style={{ backgroundColor: "green" }}
                        onClick={() => {
                          approveRevertRemarkDailogOpen();
                        }}
                      >
                        Action
                      </Button>
                      <Button
                        size="small"
                        style={{ backgroundColor: "red" }}
                        variant="contained"
                        onClick={() => {
                          verificationAoClose();
                        }}
                      >
                        Exit
                      </Button>
                    </Stack>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/**  Verification AO */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={verificationSfoDailog}
                onClose={() => {
                  verificationSfoClose();
                }}
              >
                <DialogTitle>Basic Application Details</DialogTitle>
                <CssBaseline />

                <DialogContent>
                  <ProvisionalHistoryComponent appId={getValues("id")} />
                  <VerificationAppplicationDetails props={applicationData} />
                </DialogContent>

                {/*Provisional history component */}

                {/* <Grid>
                  <ProvisionalHistoryComponent appId={getValues("id")} />
                </Grid> */}

                <DialogTitle>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Stack
                      style={{ display: "flex", justifyContent: "center" }}
                      spacing={3}
                      direction={"row"}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        style={{ backgroundColor: "green" }}
                        onClick={() => approveRevertRemarkDailogOpen()}
                      >
                        Action
                      </Button>
                      <Button
                        size="small"
                        style={{ backgroundColor: "red" }}
                        variant="contained"
                        onClick={() => {
                          verificationAoClose();
                        }}
                      >
                        Exit
                      </Button>
                    </Stack>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** Site Visit Modal*/}
              {/* <Dialog
                fullWidth
                maxWidth={"lg"}
                open={siteVisitDailog}
                onClose={() => {
                  siteVisitClose();
                }}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      Site Visit
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "red", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            siteVisitClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <ApplicantDetails readOnly />
                  <OwnerDetail view />
                  <FormsDetails readOnly view />
                  <BuildingDetails view />
                  <SiteVisit
                    siteVisitDailogP={setSetVisitDailog}
                    appID={getValues("id")}
                  />
                </DialogContent>

                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        siteVisitClose();
                      }}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog> */}

              {/** Site Visit Modal*/}
              <Dialog
                // fullWidth
                maxWidth="6000px"
                maxHeight="6000px"
                // maxWidth='100px'
                open={siteVisitDailog}
                onClose={() => siteVisitClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      Site Visit
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          color: "black",

                          ":hover": {
                            bgcolor: "#3498DB", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                        onClick={() => {
                          siteVisitClose();
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  {/* <BasicApplicationDetails />
                  <HawkerDetails />
                  <AddressOfHawker />
                  <AadharAuthentication />
                  <PropertyAndWaterTaxes />
                  <AdditionalDetails /> */}
                  {/* <Form props={applicationData} /> */}
                  {/* Display Form Seperately */}

                  <Accordion
                    sx={{
                      margin: "40px",
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                    elevation={0}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography variant="subtitle">
                        Applicant Form Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* <Form props={{ ...applicationData, docPriview: true }} /> */}
                      <ApplicantDetails />
                      <OwnerDetail />
                      <FormsDetails />
                      <BuildingDetails />
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    sx={{
                      margin: "40px",
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                    elevation={0}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography variant="subtitle">Site Visit</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <SiteVisit
                        siteVisitDailogP={setSetVisitDailog}
                        appId={getValues("id")}
                      />
                    </AccordionDetails>
                  </Accordion>

                  {/*Provisional history component */}

                  {/* <Grid>
                  <ProvisionalHistoryComponent appId={getValues("id")} />
                </Grid> */}

                  {/* <DialogTitle>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Stack
                      style={{ display: "flex", justifyContent: "center" }}
                      spacing={3}
                      direction={"row"}
                    >
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "green" }}
                        onClick={() => {
                          approveRevertRemarkDailogOpen();
                        }}
                      >
                        Action
                      </Button>
                      <Button
                        style={{ backgroundColor: "red" }}
                        variant="contained"
                        onClick={() => {
                          verificationAoClose();
                        }}
                      >
                        Exit
                      </Button>
                    </Stack>
                  </Grid>
                </DialogTitle> */}
                </DialogContent>

                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => siteVisitClose()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** Site Visit Schedule Modal OK*/}
              <Modal
                open={siteVisitScheduleModal}
                onClose={() => {
                  siteVisitModalClose();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <Paper
                  sx={{
                    padding: 2,
                    height: "600px",
                    width: "500px",
                  }}
                  elevation={5}
                  component={Box}
                >
                  <CssBaseline />
                  <SiteVisitSchedule appID={getValues("id")} />
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => {
                          siteVisitScheduleClose();
                        }}
                      >
                        Exit
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Modal>

              {/** LOI Generation OK */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={loiGeneration}
                onClose={() => {
                  loiGenerationClose();
                }}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      LOI Generation
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "#B1DBEB", // theme.palette.primary.main
                            border: "1px solid black",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            loiGenerationClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <LoiGenerationComponent />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        loiGenerationClose();
                      }}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** LOI Generation  Recipt  OK */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={loiGenerationRecipt}
                onClose={() => {
                  loiGenerationReciptClose();
                }}
              >
                <CssBaseline />
                <DialogTitle>
                  <FormattedLabel id="loiPreview" />
                </DialogTitle>
                <DialogContent>
                  <LoiGenerationRecipt props={applicationData} />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        loiGenerationReciptClose();
                      }}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** LOI Collection Ok */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={loiCollection}
                onClose={() => loiCollectionClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      LOI Collection
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "red", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            loiCollectionClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <LoiCollectionComponent />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => loiCollectionClose()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** View All Form Preview Dailog  - OK */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={formPreviewDailog}
                onClose={() => formPreviewDailogClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      Preview
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "red", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            formPreviewDailogClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  {/* <PropertyTax /> */}
                  <ApplicantDetails readOnly />
                  <OwnerDetail view />
                  <FormsDetails readOnly view />
                  <BuildingDetails view />
                  {/* <BuildingUse view /> */}
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button onClick={formPreviewDailogClose}>Exit</Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/* NOC */}
              <Dialog
                fullWidth
                maxWidth={"xl"}
                open={hotelNocRecipt}
                onClose={() => hotelNOCClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  {/* <FormattedLabel id='viewCertificate' /> */}
                </DialogTitle>
                <DialogContent>
                  <ProvisionalNoc props={applicationData} />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {/* <Button
                      size='small'
                      variant='contained'
                      onClick={() => hotelNOCClose()}
                    >
                      Exit
                    </Button> */}
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** Approve Button   Preview Dailog  */}
              <Modal
                open={approveRevertRemarkDailog}
                onClose={() => {
                  approveRevertRemarkDailogClose();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <Paper
                  sx={{
                    padding: 2,
                    height: "400px",
                    width: "600px",
                  }}
                  elevation={5}
                  component={Box}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{ marginBottom: "30px", marginTop: "20px" }}
                        variant="h6"
                      >
                        Enter Remark for Application
                      </Typography>
                      <br />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextareaAutosize
                        style={{
                          width: "550px",
                          height: "200px",
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "30px",
                        }}
                        {...register("verificationRemark")}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Stack spacing={5} direction="row">
                        <Button
                          disabled={disabledButtonApproved}
                          size="small"
                          variant="contained"
                          // type='submit'
                          style={{ backgroundColor: "green" }}
                          onClick={() => {
                            remarkFun("Approve");
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            remarkFun("Revert");
                          }}
                        >
                          Revert
                        </Button>
                        <Button
                          size="small"
                          style={{ backgroundColor: "red" }}
                          onClick={approveRevertRemarkDailogClose}
                        >
                          Exit
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </Modal>
            </FormProvider>
          </ThemeProvider>
        </Paper>
      </div>
    </>
  );
};

export default Index;
