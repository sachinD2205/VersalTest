import BrushIcon from "@mui/icons-material/Brush";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import styles from "../../../styles/lms/[dashboard].module.css";
import urls from "../../../URLS/urls";
import dynamic from "next/dynamic";
import Loader from "../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Main Component - Clerk
const Index = () => {
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [dataSource, setDataSource] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  const [nmrauthority, setNmrAuthority] = useState([]);
  const [mbrauthority, setMbrAuthority] = useState([]);
  const [mmcauthority, setMmcAuthority] = useState([]);
  const [mmbcauthority, setMmbcAuthority] = useState([]);
  const [rmcauthority, setRmcAuthority] = useState([]);
  const [rmbcauthority, setRmbcAuthority] = useState([]);

  const [pendingApplication, setPendingApplication] = useState([]);
  const [rejectedApplication, setRejectedApplication] = useState([]);
  const [approvedApplication, setApprovedApplication] = useState([]);
  const [totalApplication, setTotalApplication] = useState([]);
  const [totalMembers, setTotalMemebers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    let nmr = user?.menus?.find((r) => r.serviceId == 10)?.roles;
    let rmc = user?.menus?.find((r) => r.serviceId == 11)?.roles;
    let mmc = user?.menus?.find((r) => r.serviceId == 12)?.roles;
    let rmbc = user?.menus?.find((r) => r.serviceId == 14)?.roles;
    let mmbc = user?.menus?.find((r) => r.serviceId == 15)?.roles;
    let mbr = user?.menus?.find((r) => r.serviceId == 67)?.roles;
    console.log("nmr", nmr);
    console.log("rmc", rmc);
    console.log("mmc", mmc);
    console.log("rmbc", rmbc);
    console.log("mmbc", mmbc);
    console.log("mbr", mbr);
    setNmrAuthority(nmr);
    setRmcAuthority(rmc);
    setMmcAuthority(mmc);
    setRmbcAuthority(rmbc);
    setMmbcAuthority(mmbc);
    setMbrAuthority(mbr);
  }, [user?.menus]);

  //new marriage
  let nmrcreated = [];
  let apptScheduled = [];
  let nmrclkVerified = [];
  let nmrcmolaKonte = [];
  let nmrcmoVerified = [];
  let nmrloiGenerated = [];
  let nmrpaymentCollected = [];
  let nmrcertificateIssued = [];
  let nmrcertificateGenerated = [];

  //marriage board
  let mbrcreated = [];
  let mbrclkVerified = [];
  let mbrcmolaKonte = [];
  let mbrcmoVerified = [];
  let mbrloiGenerated = [];
  let mbrpaymentCollected = [];
  let mbrcertificateGenerated = [];
  let mbrcertificateIssued = [];

  //modification of marriage
  let mmccreated = [];
  let mmcclkVerified = [];
  let mmccmolaKonte = [];
  let mmccmoVerified = [];
  let mmcloiGenerated = [];
  let mmcpaymentCollected = [];
  let mmccertificateIssued = [];
  let mmccertificateGenerated = [];

  //modification of marriage board
  let mmbccreated = [];
  let mmbcclkVerified = [];
  let mmbccmolaKonte = [];
  let mmbccmoVerified = [];
  let mmbcloiGenerated = [];
  let mmbcpaymentCollected = [];
  let mmbccertificateIssued = [];
  let mmbccertificateGenerated = [];

  //reissue of marriage
  let rmcpaymentCollected = [];

  //renewal of marriage board
  let rmbcpaymentCollected = [];

  //finalUnsorted datasource
  let finalMerged = [];

  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getMyApplications = async () => {
    setLoading(true);
    console.log("user", user);
    axios
      .get(
        `${urls.LMSURL}/reportController/getTotalApplication?userKey=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        setLoading(false);
        setTotalApplication(
          resp?.data?.dashboardDaoList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
            };
          })
        );

        setDataSource(
          resp?.data?.dashboardDaoList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
            };
          })
        );
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });

    axios
      .get(
        `${urls.LMSURL}/reportController/getTotalApprovedApplication?userKey=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        setLoading(false);
        setApprovedApplication(
          resp?.data?.dashboardDaoList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
            };
          })
        );
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });

    axios
      .get(
        `${urls.LMSURL}/reportController/getTotalPendingApplication?userKey=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        setLoading(false);
        setPendingApplication(
          resp?.data?.dashboardDaoList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
            };
          })
        );
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });

    axios
      .get(
        `${urls.LMSURL}/reportController/getTotalMembersInLibrary?userKey=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        setLoading(false);
        setTotalMemebers(
          resp?.data?.dashboardDaoList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
            };
          })
        );
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getServiceName();
  }, []);

  useEffect(() => {
    getMyApplications();
  }, [serviceList]);

  // useEffect(() => {
  //   setTotalApplication(dataSource.length)
  //   setPendingApplication(dataSource.length)
  // }, [dataSource])

  // Columns
  const columns = [
    {
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      // headerName: "Sr No.",
      width: 90,
    },
    {
      field: "applicationNumber",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicationNo" />,
      // headerName: "Application No",
      width: 270,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="serviceName" />,
      // headerName: "Service Name",
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "applicationDate",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationDate" />,
      // headerName: "Application Date",
      // width: 220,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicantName" />,
      // headerName: "Application Name",
      width: 270,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      field: "applicationStatus",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicationStatus" />,
      // headerName: "Application Status",
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    // {
    //   field: 'actions',
    //   headerAlign: 'center',
    //   align: 'center',
    //   // headerName: <FormattedLabel id="actions" />,
    //   headerName: "Actions",
    //   width: 280,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (record) => {
    //     return (
    //       <>
    //         {record.row.serviceId == 10 && (
    //           <div className={styles.buttonRow}>
    //             {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //               (nmrauthority?.includes('DOCUMENT_CHECKLIST') ||
    //                 nmrauthority?.includes('ADMIN')) && (
    //                 <IconButton
    //                   onClick={() =>
    //                     router.push({
    //                       pathname:
    //                         '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny',
    //                       query: {
    //                         disabled: true,
    //                         applicationId: record.row.id,
    //                         serviceId: record.row.serviceId,
    //                         // ...record.row,
    //                         role: 'DOCUMENT_CHECKLIST',
    //                         pageMode: 'DOCUMENT CHECKLIST',
    //                         pageModeMr: 'कागदपत्र तपासणी',
    //                       },
    //                     })
    //                   }
    //                 >
    //                   <Button
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     variant="contained"
    //                     color="primary"
    //                   >
    //                     Document Checklist
    //                   </Button>
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus ===
    //               'APPLICATION_SENT_TO_SR_CLERK' &&
    //               (nmrauthority?.includes('APPOINTMENT_SCHEDULE') ||
    //                 nmrauthority?.includes('ADMIN')) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<EventIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     onClick={() =>
    //                       router.push({
    //                         pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slot`,
    //                         query: {
    //                           appId: record.row.id,
    //                           role: 'APPOINTMENT_SCHEDULE',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     Schedule
    //                   </Button>
    //                 </IconButton>
    //               )}
    //             {record?.row?.applicationStatus === 'APPOINTMENT_SCHEDULED' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //               ) && (
    //                 <>
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<CheckIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny',
    //                           query: {
    //                             ...record.row,
    //                             applicationId: record.row.id,
    //                             serviceId: record.row.serviceId,

    //                             role: 'DOCUMENT_VERIFICATION',
    //                             pageMode: 'APPLICATION VERIFICATION',
    //                             pageModeMr: 'अर्ज पडताळणी',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       Verify
    //                     </Button>
    //                   </IconButton>
    //                 </>
    //               )}

    //             {record?.row?.applicationStatus === 'APPLICATION_SENT_TO_CMO' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<CheckIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny',
    //                         query: {
    //                           ...record.row,
    //                           applicationId: record.row.id,
    //                           serviceId: record.row.serviceId,
    //                           role: 'FINAL_APPROVAL',
    //                           pageMode: 'FINAL VERIFICATION',
    //                           pageModeMr: 'अंतिम पडताळणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     CMO VERIFY
    //                   </Button>
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<BrushIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     //  color="success"
    //                     // onClick={() => viewLOI(record.row)}
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationComponent',
    //                         query: {
    //                           // ...record.row,
    //                           applicationId: record.row.id,
    //                           serviceId: record.row.serviceId,
    //                           // loiServicecharges: null,
    //                           role: 'LOI_GENERATION',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     GENERATE LOI
    //                   </Button>
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'CASHIER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<PaidIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/PaymentCollection',
    //                         query: {
    //                           ...record.row,
    //                           role: 'CASHIER',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     Collect Payment
    //                   </Button>
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   {/* <Buttonremarks */}
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     GENERATE CERTIFICATE
    //                   </Button>
    //                   {/* </Buttonremarks> */}
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'CERTIFICATE_ISSUED' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     DOWNLOAD CERTIFICATE
    //                   </Button>
    //                 </IconButton>
    //               )}
    //           </div>
    //         )}
    //         {record.row.serviceId == 11 && (
    //           <>
    //             {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //               rmcauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   {/* <Buttonremarks */}
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     GENERATE CERTIFICATE
    //                   </Button>
    //                   {/* </Buttonremarks> */}
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'CERTIFICATE_ISSUED' &&
    //               rmcauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     DOWNLOAD CERTIFICATE
    //                   </Button>
    //                 </IconButton>
    //               )}
    //           </>
    //         )}
    //         {record.row.serviceId == 12 && (
    //           <>
    //             <div className={styles.buttonRow}>
    //               {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //                 (mmcauthority?.includes('DOCUMENT_CHECKLIST') ||
    //                   mmcauthority?.includes('ADMIN')) && (
    //                   <IconButton
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny',
    //                         query: {
    //                           disabled: true,
    //                           ...record.row,
    //                           role: 'DOCUMENT_CHECKLIST',
    //                           pageHeader: 'DOCUMENT CHECKLIST',
    //                           pageMode: 'Edit',
    //                           pageHeaderMr: 'कागदपत्र तपासणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     <Button
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       variant="contained"
    //                       color="primary"
    //                     >
    //                       Document Checklist
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_SR_CLERK' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname:
    //                               '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny',
    //                             query: {
    //                               // ...record.row,
    //                               id: record.row.id,
    //                               serviceId: record.row.serviceId,
    //                               serviceName: record.row.serviceName,
    //                               serviceNameMr: record.row.serviceNameMr,
    //                               role: 'DOCUMENT_VERIFICATION',

    //                               pageHeader: 'APPLICATION VERIFICATION',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         DOCUMENT VERIFICATION
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_CMO' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname:
    //                               '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny',
    //                             query: {
    //                               id: record.row.id,
    //                               serviceId: record.row.serviceId,
    //                               serviceName: record.row.serviceName,
    //                               serviceNameMr: record.row.serviceNameMr,
    //                               role: 'FINAL_APPROVAL',
    //                               pageHeader: 'FINAL APPROVAL',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         CMO VERIFY
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<BrushIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       //  color="success"
    //                       // onClick={() => viewLOI(record.row)}
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationComponent',
    //                           query: {
    //                             // ...record.row,
    //                             id: record.row.id,
    //                             serviceId: record.row.serviceId,
    //                             serviceName: record.row.serviceName,
    //                             serviceNameMr: record.row.serviceNameMr,
    //                             // loiServicecharges: null,
    //                             role: 'LOI_GENERATION',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       GENERATE LOI
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'CASHIER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<PaidIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/PaymentCollection',

    //                           query: {
    //                             // ...record.row,
    //                             role: 'CASHIER',
    //                             applicationId: record.row.id,
    //                             serviceId: 12,
    //                           },
    //                         })
    //                       }
    //                     >
    //                       Collect Payment
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       style={{
    //                         height: 'px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() => issueCertificate(record.row)}
    //                     >
    //                       GENERATE CERTIFICATE
    //                     </Button>
    //                   </IconButton>
    //                 )}
    //             </div>
    //           </>
    //         )}
    //         {record.row.serviceId == 14 && (
    //           <>
    //             {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //               rmbcauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   {/* <Buttonremarks */}
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     GENERATE CERTIFICATE
    //                   </Button>
    //                   {/* </Buttonremarks> */}
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'CERTIFICATE_ISSUED' &&
    //               rmbcauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     DOWNLOAD CERTIFICATE
    //                   </Button>
    //                 </IconButton>
    //               )}
    //           </>
    //         )}
    //         {record.row.serviceId == 15 && (
    //           <>
    //             <div className={styles.buttonRow}>
    //               {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //                 (mmbcauthority?.includes('DOCUMENT_CHECKLIST') ||
    //                   mmbcauthority?.includes('ADMIN')) && (
    //                   <IconButton
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/scrutiny',
    //                         query: {
    //                           disabled: true,
    //                           ...record.row,
    //                           role: 'DOCUMENT_CHECKLIST',
    //                           pageHeader: 'DOCUMENT CHECKLIST',
    //                           pageMode: 'Edit',
    //                           pageHeaderMr: 'कागदपत्र तपासणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     <Button
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       variant="contained"
    //                       color="primary"
    //                     >
    //                       Document Checklist
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_SR_CLERK' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname: 'scrutiny/scrutiny',
    //                             query: {
    //                               ...record.row,
    //                               role: 'DOCUMENT_VERIFICATION',

    //                               pageHeader: 'APPLICATION VERIFICATION',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         DOCUMENT VERIFICATION
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_VERIFICATION_COMPLETED' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname: 'scrutiny/scrutiny',
    //                             query: {
    //                               ...record.row,
    //                               role: 'FINAL_APPROVAL',
    //                               pageHeader: 'FINAL APPROVAL',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         CMO VERIFY
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<BrushIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       //  color="success"
    //                       // onClick={() => viewLOI(record.row)}
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/LoiGenerationComponent',
    //                           query: {
    //                             // ...record.row,
    //                             id: record.row.id,
    //                             serviceName: record.row.serviceId,
    //                             // loiServicecharges: null,
    //                             role: 'LOI_GENERATION',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       GENERATE LOI
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'CASHIER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<PaidIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/PaymentCollection',

    //                           query: {
    //                             // ...record.row,
    //                             role: 'CASHIER',
    //                             applicationId: record.row.id,
    //                             serviceId: 15,
    //                           },
    //                         })
    //                       }
    //                     >
    //                       Collect Payment
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       style={{
    //                         height: 'px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() => issueCertificate(record.row)}
    //                     >
    //                       GENERATE CERTIFICATE
    //                     </Button>
    //                   </IconButton>
    //                 )}
    //             </div>
    //           </>
    //         )}
    //         {record.row.serviceId == 67 && (
    //           <>
    //             <div className={styles.buttonRow}>
    //               {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //                 (mbrauthority?.includes('DOCUMENT_CHECKLIST') ||
    //                   mbrauthority?.includes('ADMIN')) && (
    //                   <IconButton
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/boardRegistrations/scrutiny/scrutiny',
    //                         query: {
    //                           disabled: true,
    //                           ...record.row,
    //                           role: 'DOCUMENT_CHECKLIST',
    //                           pageHeader: 'DOCUMENT CHECKLIST',
    //                           pageMode: 'Edit',
    //                           pageHeaderMr: 'कागदपत्र तपासणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     <Button
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       variant="contained"
    //                       color="primary"
    //                     >
    //                       Document Checklist
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_SR_CLERK' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname: 'scrutiny/scrutiny',
    //                             query: {
    //                               ...record.row,
    //                               role: 'DOCUMENT_VERIFICATION',

    //                               pageHeader: 'APPLICATION VERIFICATION',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         DOCUMENT VERIFICATION
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_CMO' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname: 'scrutiny/scrutiny',
    //                             query: {
    //                               ...record.row,
    //                               role: 'FINAL_APPROVAL',
    //                               pageHeader: 'FINAL APPROVAL',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         CMO VERIFY
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<BrushIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationComponent',
    //                           query: {
    //                             id: record.row.id,
    //                             serviceName: record.row.serviceId,

    //                             role: 'LOI_GENERATION',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       GENERATE LOI
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'CASHIER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<PaidIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection',

    //                           query: {
    //                             ...record.row,
    //                             role: 'CASHIER',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       Collect Payment
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'CERTIFICATE_GENERATED' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       style={{
    //                         height: 'px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() => issueCertificate(record.row)}
    //                     >
    //                       GENERATE CERTIFICATE
    //                     </Button>
    //                   </IconButton>
    //                 )}
    //               {record?.row?.applicationStatus === 'CERTIFICATE_GENERATED' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       style={{
    //                         height: 'px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() => issueCertificate(record.row)}
    //                     >
    //                       APPLY DIGITAL SIGNATURE
    //                     </Button>
    //                   </IconButton>
    //                 )}
    //             </div>
    //           </>
    //         )}
    //       </>
    //     )
    //   },
    // },
  ];

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
            <Grid item xs={12}>
              <h2 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>
                  {language == "en"
                    ? "Library Management System Dashboard"
                    : "ग्रंथालय व्यवस्थापन प्रणाली डॅशबोर्ड"}
                </b>
              </h2>
            </Grid>
          </Grid>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Grid container>
                {/** Applications Tabs */}
                <Grid item xs={12}>
                  <Paper
                    sx={{ height: "auto" }}
                    component={Box}
                    p={2}
                    m={2}
                    squar="true"
                    elevation={5}
                    // sx={{ align: "center" }}
                  >
                    <div className={styles.test}>
                      {/** Total Application */}
                      <div
                        className={styles.one}
                        onClick={() => setDataSource(totalApplication)}
                      >
                        <div className={styles.icono}>
                          <WcIcon color="secondary" />
                        </div>
                        <br />
                        <div className={styles.icono}>
                          <strong align="center">
                            {language == "en"
                              ? "Total Application"
                              : "एकूण अर्ज"}
                          </strong>
                        </div>
                        <Typography
                          variant="h6"
                          align="center"
                          color="secondary"
                        >
                          {totalApplication?.length}
                        </Typography>
                      </div>

                      {/** Vertical Line */}
                      <div className={styles.jugaad}></div>

                      {/** Approved Application */}
                      <div
                        className={styles.one}
                        onClick={() => setDataSource(approvedApplication)}
                      >
                        <div className={styles.icono}>
                          <ThumbUpAltIcon color="success" />
                        </div>
                        <br />
                        <div className={styles.icono}>
                          <strong align="center">
                            {language == "en"
                              ? "Approved Application"
                              : "मंजूर अर्ज"}
                          </strong>
                        </div>
                        <Typography variant="h6" align="center" color="green">
                          {approvedApplication?.length}
                        </Typography>
                      </div>

                      {/** Vertical Line */}
                      <div className={styles.jugaad}></div>

                      {/** Pending Applications */}
                      <div
                        className={styles.one}
                        onClick={() => setDataSource(pendingApplication)}
                      >
                        <div className={styles.icono}>
                          <PendingActionsIcon color="warning" />
                        </div>
                        <br />
                        <div className={styles.icono}>
                          <strong align="center">
                            {language == "en"
                              ? "Pending Application"
                              : "प्रलंबित अर्ज"}
                          </strong>
                        </div>
                        <Typography variant="h6" align="center" color="orange">
                          {pendingApplication?.length}
                        </Typography>
                      </div>

                      {/** Vertical Line */}
                      <div className={styles.jugaad}></div>

                      {/** Rejected Application */}
                      <div
                        className={styles.one}
                        // onClick={() => clerkTabClick('REJECTED')}
                      >
                        <div className={styles.icono}>
                          {/* <CancelIcon color="error" /> */}
                          <WcIcon color="secondary" />
                        </div>
                        <br />
                        <div className={styles.icono}>
                          <strong align="center">
                            {language == "en"
                              ? "Total Members in Library"
                              : "ग्रंथालयातील एकूण सदस्य"}
                          </strong>
                        </div>
                        <Typography variant="h6" align="center" color="error">
                          {totalMembers?.length}
                        </Typography>
                      </div>
                      <div
                        className={styles.one}
                        // onClick={() => clerkTabClick('REJECTED')}
                      >
                        <Chart
                          options={{
                            chart: {
                              id: "basic-pie",
                            },
                            labels: [
                              "Pending Application",
                              "Approved Application",
                            ],
                            responsive: [
                              {
                                breakpoint: 480,
                                options: {
                                  chart: {
                                    width: 200,
                                  },
                                  legend: {
                                    position: "bottom",
                                  },
                                },
                              },
                            ],
                          }}
                          series={[
                            pendingApplication?.length,
                            approvedApplication?.length,
                          ]}
                          type="pie"
                          width={400}
                          height={120}
                        />
                      </div>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
              <Box
                style={{
                  backgroundColor: "white",
                  height: "auto",
                  width: "auto",
                  overflow: "auto",
                }}
              >
                <DataGrid
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  components={{ Toolbar: GridToolbar }}
                  getRowId={(row) => row.srNo}
                  sx={{
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3,
                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  autoHeight
                  scrollbarSize={17}
                  rows={dataSource}
                  columns={columns}
                  pageSize={7}
                  rowsPerPageOptions={[7]}
                />
              </Box>
            </>
          )}
        </Paper>
      </div>
    </>
  );
};

export default Index;
