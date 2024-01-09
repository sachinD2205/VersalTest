import BrushIcon from "@mui/icons-material/Brush";
import CheckIcon from "@mui/icons-material/Check";
import PaidIcon from "@mui/icons-material/Paid";
import { Button, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
// import styles from '../../../../styles/marrigeRegistration'
import urls from "../../../../../URLS/urls";
import EventIcon from "@mui/icons-material/Event";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

// Table _ MR
const Index = () => {
  let created = [];
  let checklist = [];
  // let apptScheduled = []
  let clkVerified = [];
  let cmolaKonte = [];
  let cmoVerified = [];
  let loiGenerated = [];
  let cashier = [];
  let paymentCollected = [];
  // let certificateIssued = []
  let certificateGenerated = [];
  let merged = [];

  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [authority, setAuthority] = useState([]);
  const [serviceId, setServiceId] = useState(null);

  const userToken = useGetToken();
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
    // AuthAndServicePorvider

    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find(
      (r) => r.id == selectedMenuFromDrawer
    )?.serviceId;
    console.log("serviceId-<>", service);
    console.log("auth0000", auth);
    setAuthority(auth);
    setServiceId(service);
  }, []);

  const tempData = [
    {
      id: 1,
      applicationNumber: 32,
      applicationDate: "06/03/2023",
      applicantName: "Sarthak",
      applicationStatus: "APPLICATION_CREATED",
      // startDate: "19-02-2023",
      // endDate: "29-03-2023",
      serviceName: "Issuance of Industry License",
      serviceId: 8,
    },
    {
      id: 2,
      applicationNumber: 33,
      applicationDate: "05/03/2023",
      applicantName: "Sarthak",
      applicationStatus: "APPLICATION_CREATED",
      // startDate: "19-02-2023",
      // endDate: "04-04-2023",
      serviceName: "Issuance of Industry License",
      serviceId: 8,
    },
    {
      id: 3,
      applicationNumber: 13,
      applicationDate: "19/02/2023",
      applicantName: "Sarthak",
      applicationStatus: "SITE_VISITED",
      // startDate: "19-02-2023",
      // endDate: "04-04-2023",
      serviceName: "Issuance of Industry License",
      serviceId: 8,
    },
    {
      id: 4,
      applicationNumber: 13,
      applicationDate: "19/02/2023",
      applicantName: "Sarthak",
      applicationStatus: "LOI_GENERATED",
      // startDate: "19-02-2023",
      // endDate: "04-04-2023",
      serviceName: "Issuance of Industry License",
      serviceId: 8,
    },
  ];

  // Get Table - Data
  const getIssuanceOfIndustryDetails = () => {
    console.log("userToken", user.token);
    axios
      .get(
        `${urls.SSLM}/trnIssuanceOfIndustrialLicense/getByServiceId?serviceId=8`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res, "reg123");
        setTableData(
          res?.data?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              applicantName: r.firstName + " " + r.lastName,
              applicationDate: moment(r.applicationDate).format("DD-MM-YYYY"),
            };
          })
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //   .then((resp) => {
    //     if (
    //       authority.includes('DOCUMENT_CHECKLIST') ||
    //       authority.includes('ADMIN')
    //     ) {
    //       console.log('APPLICATION_CREATED')
    //       created = resp.data.filter(
    //         (data) => data.applicationStatus === 'APPLICATION_CREATED',
    //       )
    //     }

    //     // if (
    //     //   authority?.find(
    //     //     (r) =>
    //     //       r === 'APPOINTMENT_SCHEDULE' ||
    //     //       authority?.find((r) => r === 'ADMIN'),
    //     //   )
    //     // ) {
    //     //   console.log('APPOINTMENT_SCHEDULE')
    //     //   apptScheduled = resp.data.filter(
    //     //     (data) => data.applicationStatus === 'APPLICATION_SENT_TO_SR_CLERK',
    //     //   )
    //     // }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'DOCUMENT_VERIFICATION' ||
    //           authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       console.log('DOCUMENT_VERIFICATION')
    //       clkVerified = resp.data.filter(
    //         (data) => data.applicationStatus === 'APPLICATION_SENT_TO_SR_CLERK',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'FINAL_APPROVAL' || authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       cmolaKonte = resp.data.filter(
    //         (data) => data.applicationStatus === 'APPLICATION_SENT_TO_CMO',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'LOI_GENERATION' || authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       cmoVerified = resp.data.filter(
    //         (data) => data.applicationStatus === 'CMO_APPROVED',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) => r === 'CASHIER' || authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       cashier = resp.data.filter(
    //         (data) => data.applicationStatus === 'LOI_GENERATED',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'CERTIFICATE_ISSUER' ||
    //           authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       loiGenerated = resp.data.filter(
    //         (data) => data.applicationStatus === 'PAYEMENT_SUCCESSFULL',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'APPLY_DIGITAL_SIGNATURE' ||
    //           authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       certificateGenerated = resp.data.filter(
    //         (data) => data.applicationStatus === 'CERTIFICATE_GENERATED',
    //       )
    //     }

    //     merged = [
    //       ...created,
    //       ...checklist,
    //       // ...apptScheduled,
    //       ...clkVerified,
    //       ...cmolaKonte,
    //       ...cmoVerified,
    //       ...loiGenerated,
    //       ...cashier,
    //       ...paymentCollected,
    //       // ...certificateIssued,
    //       ...certificateGenerated,
    //     ]

    //     console.log('created', created)
    //     console.log('checklist', checklist)
    //     // console.log('apptScheduled', apptScheduled)
    //     console.log('clkVerified', clkVerified)
    //     console.log('cmoVerified', cmoVerified)
    //     console.log('loiGenerated', loiGenerated)
    //     console.log('paymentCollected', paymentCollected)
    //     console.log('certificateGenerated', certificateGenerated)
    //     // console.log('certificateIssued', certificateIssued)

    //   setTableData(
    //     merged.map((r, i) => {
    //       return {
    //         srNo: i + 1,
    //         ...r,
    //       }
    //     }),
    //   )
    // })
    // setTableData(
    //   tempData.map((r, i) => {
    //     return {
    //       srNo: i + 1,
    //       ...r,
    //     }
    //   }),
    // )
  };

  useEffect(() => {
    console.log("authority", authority);
    getIssuanceOfIndustryDetails();
  }, [authority, serviceId]);

  const viewLOI = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      role: "LOI_GENERATION",
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  const issueCertificate = (record) => {
    const finalBody = {
      id: Number(record.id),
      // ...record,
      role: "LICENSES_GENRATION",
      userId: user.id,
      trnLicenseDao: {
        action: "APPROVE",
      },
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  const issueCertificate1 = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      role: "APPLY_DIGITAL_SIGNATURE",
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  const saveApproval = (body) => {
    axios
      .post(`${urls.SSLM}/trnIssuanceOfIndustrialLicense/saveApprove`, body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status == 201) {
          // if (body.role === 'LOI_GENERATION') {
          router.push({
            pathname: "/skySignLicense/report/industryFinalCertificate",
            query: {
              ...body,
            },
          });
          // }
          // else if (
          //   body.role === 'CERTIFICATE_ISSUER' ||
          //   body.role === 'APPLY_DIGITAL_SIGNATURE'
          // ) {
          //   router.push({
          //     pathname: '/marriageRegistration/reports/boardcertificateui',
          //     query: {
          //       ...body,
          //       // role: "CERTIFICATE_ISSUER",
          //     },
          //   })
          // }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // headerName: "Sr No",
      width: 70,
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      // headerName: "Application No",
      width: 240,
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      // headerName: "Application Date",
      width: 150,
      // valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY'),
    },

    // {
    //   field: 'libraryName',
    //   // headerName: <FormattedLabel id="boardNameT" />,
    //   headerName: "library Name",
    //   width: 240,
    // },

    {
      field: "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      // headerName: "Applicant Name",
      width: 240,
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="applicationStatus" />,
      // headerName: "Application Status",
      width: 280,
    },
    // {
    //   field: 'startDate',
    //   // headerName: <FormattedLabel id="statusDetails" />,
    //   headerName: "Membership Start Date",
    //   width: 280,
    // },
    // {
    //   field: 'endDate',
    //   // headerName: <FormattedLabel id="statusDetails" />,
    //   headerName: "Membership End Date",
    //   width: 280,
    // },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      // headerName: "Actions",
      width: 280,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {record?.row?.applicationStatus === "APPLICATION_SUBMITTED" &&
                (authority?.includes("DOCUMENT_CHECKLIST") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          "/skySignLicense/transactions/issuanceOfIndustry/scrutiny/scrutiny",
                        query: {
                          disabled: true,
                          ...record.row,
                          role: "LICENSE INSPECTOR",
                          pageHeader: "DOCUMENT CHECKLIST",
                          pageMode: "Check",
                          pageHeaderMr: "कागदपत्र तपासणी",
                        },
                      })
                    }
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Document Checklist
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === "APPROVE_BY_LI" &&
                (authority?.includes("DOCUMENT_VERIFICATION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          "/skySignLicense/transactions/issuanceOfIndustry/scrutiny/scrutiny",
                        query: {
                          disabled: true,
                          ...record.row,
                          role: "OS",
                          pageHeader: "DOCUMENT CHECKLIST",
                          pageMode: "Check",
                          pageHeaderMr: "कागदपत्र तपासणी",
                        },
                      })
                    }
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      OS Verify
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "APPROVE_BY_OS" &&
                (authority?.includes("APPOINTMENT_SCHEDULE") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<EventIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname: `/skySignLicense/transactions/components/SiteVisitSchedule`,
                          query: {
                            appId: record.row.id,
                            role: "APPOINTMENT_SCHEDULE",
                            serviceId: 8,
                          },
                        })
                      }
                    >
                      Schedule
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === "APPOINTMENT_SCHEDULED" &&
                (authority?.includes("APPOINTMENT_SCHEDULE") ||
                  authority?.includes("DOCUMENT_CHECKLIST") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<EventIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname: `/skySignLicense/transactions/siteVisit`,
                          query: {
                            id: record.row.id,
                            role: "SITE_VISIT",
                            serviceId: 8,
                          },
                        })
                      }
                    >
                      SITE VISIT
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === "SITE_VISITED" &&
                (authority?.includes("LOI_GENERATION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          "/skySignLicense/transactions/issuanceOfIndustry/scrutiny/scrutiny",
                        query: {
                          disabled: true,
                          ...record.row,
                          role: "HOD",
                          pageHeader: "DOCUMENT CHECKLIST",
                          pageMode: "Check",
                          pageHeaderMr: "कागदपत्र तपासणी",
                        },
                      })
                    }
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      HOD Verify
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === "REVERT_BY_OS" &&
                (authority?.includes("DOCUMENT_CHECKLIST") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          "/skySignLicense/transactions/issuanceOfIndustry/scrutiny/scrutiny",
                        query: {
                          disabled: true,
                          ...record.row,
                          role: "LICENSE INSPECTOR",
                          pageHeader: "DOCUMENT CHECKLIST",
                          pageMode: "Check",
                          pageHeaderMr: "कागदपत्र तपासणी",
                        },
                      })
                    }
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Document Checklist
                    </Button>
                  </IconButton>
                )}
              {/* MEMBERSHIP_CREATED  */}
              {record?.row?.applicationStatus === "APPROVE_BY_HOD" &&
                authority?.find(
                  (r) => r === "LOI_GENERATION" || r === "ADMIN"
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<BrushIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/skySignLicense/transactions/issuanceOfIndustry/LoiGenerationComponent",
                          query: {
                            id: record.row.id,
                            serviceId: record.row.serviceId,
                            role: "LOI_GENERATION",
                          },
                        })
                      }
                    >
                      GENERATE LOI
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "LOI_GENERATED" &&
                authority?.find((r) => r === "CASHIER" || r === "ADMIN") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      // endIcon={<PaidIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() =>
                        router.push({
                          pathname:
                            "/skySignLicense/transactions/issuanceOfIndustry/PaymentCollection",

                          query: {
                            ...record.row,
                            role: "LOI_COLLECTION",
                          },
                        })
                      }
                    >
                      Collect Payment
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFUL" &&
                authority?.find(
                  (r) => r === "CERTIFICATE_ISSUER" || r === "ADMIN"
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                    >
                      GENERATE CERTIFICATE
                    </Button>
                  </IconButton>
                )}

              {/* {record?.row?.applicationStatus ===
                'APPLICATION_SENT_TO_SR_CLERK' &&
                authority?.find(
                  (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<CheckIcon />}
                        style={{
                          height: '30px',
                          width: '250px',
                        }}
                        onClick={() =>
                          router.push({
                            pathname: 'scrutiny/scrutiny',
                            query: {
                              ...record.row,
                              role: 'DOCUMENT_VERIFICATION',

                              pageHeader: 'APPLICATION VERIFICATION',
                              // pageMode: 'Edit',
                              pageMode: 'Check',
                              pageHeaderMr: 'अर्ज पडताळणी',
                            },
                          })
                        }
                      >
                        DOCUMENT VERIFICATION
                      </Button>
                    </IconButton>
                  </>
                )}

              {record?.row?.applicationStatus === 'APPLICATION_SENT_TO_CMO' &&
                authority?.find(
                  (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<CheckIcon />}
                        style={{
                          height: '30px',
                          width: '250px',
                        }}
                        onClick={() =>
                          router.push({
                            pathname: 'scrutiny/scrutiny',
                            query: {
                              ...record.row,
                              role: 'FINAL_APPROVAL',
                              pageHeader: 'FINAL APPROVAL',
                              // pageMode: 'Edit',
                              pageMode: 'Check',
                              pageHeaderMr: 'अर्ज पडताळणी',
                            },
                          })
                        }
                      >
                        CMO VERIFY
                      </Button>
                    </IconButton>
                  </>
                )}

              {record?.row?.applicationStatus === 'CMO_APPROVED' &&
                authority?.find(
                  (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<BrushIcon />}
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      onClick={() =>
                        router.push({
                          pathname:
                            '/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationComponent',
                          query: {
                            id: record.row.id,
                            serviceName: record.row.serviceId,

                            role: 'LOI_GENERATION',
                          },
                        })
                      }
                    >
                      GENERATE LOI
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === 'LOI_GENERATED' &&
                authority?.find((r) => r === 'CASHIER' || r === 'ADMIN') && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<PaidIcon />}
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      color="success"
                      onClick={() =>
                        router.push({
                          pathname:
                            '/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection',

                          query: {
                            ...record.row,
                            role: 'CASHIER',
                          },
                        })
                      }
                    >
                      Collect Payment
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
                authority?.find(
                  (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: 'px',
                        width: '250px',
                      }}
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                    >
                      GENERATE CERTIFICATE
                    </Button>
                  </IconButton>
                )} */}
              {/* {record?.row?.applicationStatus === 'CERTIFICATE_GENERATED' &&
                authority?.find(
                  (r) => r === 'APPLY_DIGITAL_SIGNATURE' || r === 'ADMIN',
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: 'px',
                        width: '250px',
                      }}
                      color="success"
                      onClick={() => issueCertificate1(record.row)}
                    >
                      APPLY DIGITAL SIGNATURE
                    </Button>
                  </IconButton>
                )} */}
            </div>
          </>
        );
      },
    },
  ];

  return (
    <>
      {/* <BasicLayout> */}
      <Paper
        sx={{
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
          marginBottom: 1,
          padding: 1,
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <br />
        <div className={styles.detailsTABLE}>
          <div className={styles.h1TagTABLE}>
            <h2
              style={{
                fontSize: "20",
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="industryLicense" />}
              {/* Issuance of Industry License */}
            </h2>
          </div>
        </div>

        <br />

        <DataGrid
          sx={{
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
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
          autoHeight
          scrollbarSize={17}
          rows={tableData}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};
export default Index;
