// // /marriageRegistration/transactions/newMarriageRegistration/scrutiny/index.js
import BrushIcon from "@mui/icons-material/Brush";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, IconButton, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import Loader from "../../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

// Table _ MR
const Index = () => {
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
  let certificateIssued = [];
  let merged = [];
  const [loadderState, setLoadderState] = useState(true);
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [authority, setAuthority] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [newMarriageBoardData, setNewMarriageBoardData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  useEffect(() => {
    // AuthAndServicePorvider

    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find(
      (r) => r.id == selectedMenuFromDrawer,
    )?.serviceId;
    console.log("serviceId-<>", service);
    console.log("auth0000", auth);
    setAuthority(auth);
    setServiceId(service);
  }, []);
  //http://localhost:8090/mr/api/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}
  // Get Table - Data
  const getNewMarriageRegistractionDetails = (_pageSize = 10, _pageNo = 0) => {
    console.log("userToken", user.token);
    if (serviceId == 67) {
      axios
        .get(
          // `${urls.MR}/transaction/marriageBoardRegistration/getmarraigeBoardRegistrationDetails?serviceId=${serviceId}`,
          `${urls.MR}/transaction/applicant/paginationAgainsrService`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            params: {
              serviceId: serviceId,
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
          },
        )

        // .then((res) => {
        // setTableData(
        //   res.data.map((r, i) => {
        //     return {
        //       srNo: i + 1,
        //       ...r,
        //     }
        //   }),
        // )
        // })

        .then((resp) => {
          setNewMarriageBoardData({
            rows: resp.data.marraigeBoardRegistrationDao,
            totalRows: resp.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: resp.data.pageSize,
            page: resp.data.pageNo,
          });
          setLoadderState(false);
          if (
            authority.includes("DOCUMENT_CHECKLIST") ||
            authority.includes("ADMIN")
          ) {
            console.log("APPLICATION_CREATED");
            created = resp.data.marraigeBoardRegistrationDao.filter((data) =>
              ["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(
                data.applicationStatus,
              ),
            );
            // created = resp.data.marraigeBoardRegistrationDao.filter((data) => data.applicationStatus === "APPLICATION_CREATED");
          }

          // if (
          //   authority?.find(
          //     (r) =>
          //       r === 'APPOINTMENT_SCHEDULE' ||
          //       authority?.find((r) => r === 'ADMIN'),
          //   )
          // ) {
          //   console.log('APPOINTMENT_SCHEDULE')
          //   apptScheduled = resp.data.marraigeBoardRegistrationDao.filter(
          //     (data) => data.applicationStatus === 'APPLICATION_SENT_TO_SR_CLERK',
          //   )
          // }

          if (
            authority?.find(
              (r) =>
                r === "DOCUMENT_VERIFICATION" ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            console.log("DOCUMENT_VERIFICATION");
            clkVerified = resp.data.marraigeBoardRegistrationDao.filter(
              (data) =>
                [
                  "APPLICATION_SENT_TO_SR_CLERK",
                  "CMO_SENT_BACK_TO_SR_CLERK",
                  "CITIZEN_SEND_BACK_TO_SR_CLERK",
                ].includes(data.applicationStatus),
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "FINAL_APPROVAL" || authority?.find((r) => r === "ADMIN"),
            )
          ) {
            cmolaKonte = resp.data.marraigeBoardRegistrationDao.filter(
              (data) => data.applicationStatus === "APPLICATION_SENT_TO_CMO",
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "LOI_GENERATION" || authority?.find((r) => r === "ADMIN"),
            )
          ) {
            cmoVerified = resp.data.marraigeBoardRegistrationDao.filter(
              (data) => data.applicationStatus === "CMO_APPROVED",
            );
          }

          if (
            authority?.find(
              (r) => r === "CASHIER" || authority?.find((r) => r === "ADMIN"),
            )
          ) {
            cashier = resp.data.marraigeBoardRegistrationDao.filter(
              (data) => data.applicationStatus === "LOI_GENERATED",
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "CERTIFICATE_ISSUER" ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            loiGenerated = resp.data.marraigeBoardRegistrationDao.filter(
              (data) => data.applicationStatus === "PAYEMENT_SUCCESSFULL",
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "APPLY_DIGITAL_SIGNATURE" ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            certificateGenerated =
              resp.data.marraigeBoardRegistrationDao.filter(
                (data) => data.applicationStatus === "CERTIFICATE_GENERATED",
              );
          }

          if (
            authority?.find(
              (r) =>
                r === "DOWNLOAD_CERTIFCATE" ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            certificateIssued = resp.data.marraigeBoardRegistrationDao.filter(
              (data) => data.applicationStatus === "CERTIFICATE_ISSUED",
            );
          }

          merged = [
            ...created,
            ...checklist,
            // ...apptScheduled,
            ...clkVerified,
            ...cmolaKonte,
            ...cmoVerified,
            ...loiGenerated,
            ...cashier,
            ...paymentCollected,
            // ...certificateIssued,
            ...certificateGenerated,
            ...certificateIssued,
          ];

          console.log("created", created);
          console.log("checklist", checklist);
          // console.log('apptScheduled', apptScheduled)
          console.log("clkVerified", clkVerified);
          console.log("cmoVerified", cmoVerified);
          console.log("loiGenerated", loiGenerated);
          console.log("paymentCollected", paymentCollected);
          console.log("certificateGenerated", certificateGenerated);
          // console.log('certificateIssued', certificateIssued)

          setTableData(
            merged.map((r, i) => {
              return {
                srNo: i + 1,
                ...r,
              };
            }),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    console.log("authority", authority);
    getNewMarriageRegistractionDetails();
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
      ...record,
      role: "CERTIFICATE_ISSUER",
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
      .post(
        `${urls.MR}/transaction/marriageBoardRegistration/saveMarraigeBoardRegistrationApprove`,
        body,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          if (body.role === "LOI_GENERATION") {
            router.push({
              pathname:
                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
              query: {
                ...body,
              },
            });
          } else if (
            body.role === "CERTIFICATE_ISSUER" ||
            body.role === "APPLY_DIGITAL_SIGNATURE"
          ) {
            {
              body.serviceId == 14
                ? router.push({
                    pathname:
                      "/marriageRegistration/reports/boardcertificateui",
                    query: {
                      ...body,
                      certiMode: "renew",
                      // role: "CERTIFICATE_ISSUER",
                    },
                  })
                : router.push({
                    pathname:
                      "/marriageRegistration/reports/boardcertificateui",
                    query: {
                      ...body,
                      // role: "CERTIFICATE_ISSUER",
                    },
                  });
            }
          }
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
      minWidth: 70,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      minWidth: 260,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: language == "en" ? "marriageBoardName" : "marriageBoardNameMr",
      headerName: <FormattedLabel id="boardNameT" />,
      minWidth: 240,
      flex: 1,
      headerAlign: "center",
      // alignItems:"center"
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="ApplicantName" />,
      minWidth: 240,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="statusDetails" />,
      minWidth: 280,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      minWidth: 300,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("DOCUMENT_CHECKLIST") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          "/marriageRegistration/transactions/boardRegistrations/scrutiny/scrutiny",
                        query: {
                          disabled: true,
                          ...record.row,
                          role: "DOCUMENT_CHECKLIST",
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
                      {language == "en"
                        ? "DOCUMENT CHECKLIST"
                        : "दस्तऐवज चेकलिस्ट"}
                    </Button>
                  </IconButton>
                )}

              {[
                "APPLICATION_SENT_TO_SR_CLERK",
                "CMO_SENT_BACK_TO_SR_CLERK",
                "CITIZEN_SEND_BACK_TO_SR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                authority?.find(
                  (r) => r == "DOCUMENT_VERIFICATION" || r == "ADMIN",
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<CheckIcon />}
                        style={{
                          height: "30px",
                          width: "250px",
                        }}
                        onClick={() =>
                          router.push({
                            pathname: "scrutiny/scrutiny",
                            query: {
                              ...record.row,
                              role: "DOCUMENT_VERIFICATION",

                              pageHeader: "APPLICATION VERIFICATION",
                              // pageMode: 'Edit',
                              pageMode: "Check",
                              pageHeaderMr: "अर्ज पडताळणी",
                            },
                          })
                        }
                      >
                        {language == "en"
                          ? "DOCUMENT VERIFICATION"
                          : "दस्तऐवज पडताळणी"}
                      </Button>
                    </IconButton>
                  </>
                )}

              {record?.row?.applicationStatus === "APPLICATION_SENT_TO_CMO" &&
                authority?.find(
                  (r) => r === "FINAL_APPROVAL" || r === "ADMIN",
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<CheckIcon />}
                        style={{
                          height: "30px",
                          width: "300px",
                        }}
                        onClick={() =>
                          router.push({
                            pathname: "scrutiny/scrutiny",
                            query: {
                              ...record.row,
                              role: "FINAL_APPROVAL",
                              pageHeader: "FINAL APPROVAL",
                              // pageMode: 'Edit',
                              pageMode: "Check",
                              pageHeaderMr: "अर्ज पडताळणी",
                            },
                          })
                        }
                      >
                        {language == "en"
                          ? "CMO/ MARRIAGE REGISTRAR VERIFY"
                          : "सी एम ओ / विवाह निबंधक सत्यापित करा"}
                      </Button>
                    </IconButton>
                  </>
                )}

              {record?.row?.applicationStatus === "CMO_APPROVED" &&
                authority?.find(
                  (r) => r === "LOI_GENERATION" || r === "ADMIN",
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
                            "/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationComponent",
                          query: {
                            id: record.row.id,
                            serviceName: record.row.serviceId,

                            role: "LOI_GENERATION",
                          },
                        })
                      }
                    >
                      {language == "en" ? "GENERATE LOI" : "LOI व्युत्पन्न करा"}
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
                            "/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection",

                          query: {
                            ...record.row,
                            role: "CASHIER",
                          },
                        })
                      }
                    >
                      {language == "en" ? "COLLECT PAYMENT" : "पेमेंट गोळा करा"}
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" &&
                authority?.find(
                  (r) => r === "CERTIFICATE_ISSUER" || r === "ADMIN",
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
                      {language == "en"
                        ? "GENERATE CERTIFICATE"
                        : "प्रमाणपत्र व्युत्पन्न करा"}
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === "CERTIFICATE_GENERATED" &&
                authority?.find(
                  (r) => r === "APPLY_DIGITAL_SIGNATURE" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => issueCertificate1(record.row)}
                    >
                      {language == "en"
                        ? "APPLY DIGITAL SIGNATURE"
                        : "डिजिटल स्वाक्षरी लागू करा"}
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" && (
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
                          "/marriageRegistration/reports/boardcertificateui",
                        query: {
                          serviceId: record.row.serviceId,
                          applicationId: record.row.id,
                          certiMode: "renew",
                        },
                      })
                    }
                  >
                    {language == "en"
                      ? "DOWNLOAD CERTIFICATE"
                      : "प्रमाणपत्र डाउनलोड करा"}
                  </Button>
                </IconButton>
              )}
            </div>
          </>
        );
      },
    },
  ];
  useEffect(() => {}, [loadderState]);
  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      {loadderState ? (
        <Loader />
      ) : (
        // <div
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       height: "60vh", // Adjust itasper requirement.
        //     }}
        //   >
        //     <Paper
        //       style={{
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //         background: "white",
        //         borderRadius: "50%",
        //         padding: 8,
        //       }}
        //       elevation={8}
        //     >
        //       <CircularProgress color="success" />
        //     </Paper>
        //   </div>
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
                {<FormattedLabel id="boardtitle" />}
              </h2>
            </div>
          </div>

          <br />

          <DataGrid
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            rowHeight={70}
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
            // rows={tableData}
            columns={columns}
            // pageSize={7}
            // rowsPerPageOptions={[7]}

            pagination
            paginationMode="server"
            page={newMarriageBoardData?.page}
            rowCount={newMarriageBoardData?.totalRows}
            rowsPerPageOptions={newMarriageBoardData?.rowsPerPageOptions}
            pageSize={newMarriageBoardData?.pageSize}
            rows={newMarriageBoardData?.rows?.map((data, index) => {
              return {
                ...data,
                srNo: index + 1,
              };
            })}
            onPageChange={(_data) => {
              // getBusinesSubType(newMarriageBoardData?.pageSize, _data);
              getNewMarriageRegistractionDetails(
                newMarriageBoardData?.pageSize,
                _data,
              );
            }}
            onPageSizeChange={(_data) => {
              // getBusinesSubType(_data, newMarriageBoardData?.page);
              getNewMarriageRegistractionDetails(
                _data,
                newMarriageBoardData?.page,
              );
            }}
          />
        </Paper>
      )}
    </>
  );
};
export default Index;

//http://localhost:4001/marriageRegistration/boardRegistrationsmui/boardRegistration
// import React, { useEffect, useState } from 'react'
// import styles from './view.module.css'
// import { useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import schema from './schema'
// import IconButton from '@mui/material/IconButton'
// import { Button, Paper, Typography } from '@mui/material'
// import { DataGrid } from '@mui/x-data-grid'
// import axios from 'axios'
// import moment from 'moment'
// import swal from 'sweetalert'
// import { useRouter } from 'next/router'
// import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'

// const index = () => {
//   const {
//     register,
//     control,
//     handleSubmit,
//     methods,
//     reset,
//     formState: { errors },
//   } = useForm({
//     criteriaMode: 'all',
//     resolver: yupResolver(schema),
//     mode: 'onChange',
//   })
//   const [btnSaveText, setBtnSaveText] = useState('Save')
//   const [dataSource, setDataSource] = useState([])
//   const [editButtonInputState, setEditButtonInputState] = useState(false)
//   const [deleteButtonInputState, setDeleteButtonState] = useState(false)

//   //
//   // const addressChange = (e) => {
//   //   console.log(e.target.checked)
//   //   if (e.target.checked) {
//   //     BoardForm.setFieldsValue({
//   //       pflatBuildingNo: BoardForm.getFieldValue('cflatBuildingNo'),
//   //       pbuildingName: BoardForm.getFieldValue('cbuildingName'),
//   //       proadName: BoardForm.getFieldValue('croadName'),
//   //       plandmark: BoardForm.getFieldValue('clandmark'),
//   //       pcity: BoardForm.getFieldValue('ccity'),
//   //       ppincode: BoardForm.getFieldValue('cpincode'),
//   //     })
//   //   }
//   // }

//   const router = useRouter()
//   const addNewRecord = () => {
//     router.push({
//       pathname: `/marriageRegistration/transactions/boardRegistrationsmui/boardRegistration`,
//       query: {
//         pageMode: 'Add',
//       },
//     })
//   }

//   // Get Table - Data
//   const getmarraigeBoardRegistrationDetails = () => {
//     axios
//       .get(
//         `http://localhost:8091/mr/api/transaction/marriageBoardRegistration/getmarraigeBoardRegistrationDetails`,
//       )
//       .then((res) => {
//         setDataSource(
//           res.data.map((j, i) => ({
//             id: j.id,
//             srNo: i + 1,
//             marriageBoardName: j.marriageBoardName,
//             gender: j.gender,
//             flatBuildingNo: j.flatBuildingNo,
//             buildingName: j.buildingName,
//             roadName: j.roadName,
//             landmark: j.landmark,
//             pincode: j.pincode,
//             aadhaarNo: j.aadhaarNo,
//             mobile: j.mobile,
//             emailAddress: j.emailAddress,
//             validityOfMarriageBoardRegistration: moment(
//               j.validityOfMarriageBoardRegistration,
//               'DD/MM/YYYY',
//             ).format('DD/MM/YYYY'),
//             remarks: j.remarks,
//             serviceCharges: j.serviceCharges,
//             applicationAcceptanceCharges: j.applicationAcceptanceCharges,
//             applicationNumber: j.applicationNumber,
//             applicantName: j.applicantName,
//             zoneName: zones,
//             city: j.city,
//             landlineNo: j.landlineNo,
//             documentList: j.documentList,

//             // cflatBuildingNo: j.cflatBuildingNo,
//             // cbuildingName: j.cbuildingName,
//             // croadName: j.croadName,
//             // clandmark: j.clandmark,
//             // cpincode: j.cpincode,
//             // ccity: j.ccity,
//             // pflatBuildingNo: j.pflatBuildingNo,
//             // pbuildingName: j.pbuildingName,
//             // proadName: j.proadName,
//             // plandmark: j.plandmark,
//             // ppincode: j.ppincode,
//             // pcity: j.pcity,
//             // zone: j.zone,
//             // ward: j.ward,
//             // zoneKey: j.zoneKey,
//             // wardKey: j.wardKey,
//             // applicationNumber: j.applicationNumber,
//             // registrationNumber: j.registrationNumber,
//             // status: j.status,
//           })),
//         )
//       })
//   }

//   // useEffect - Reload On update , delete ,Saved on refresh
//   useEffect(() => {
//     getmarraigeBoardRegistrationDetails()
//   }, [])

//   // OnSubmit Form
//   // const onSubmitForm = (fromData) => {
//   //   const validityOfMarriageBoardRegistration = moment(
//   //     Data.validityOfMarriageBoardRegistration,
//   //     'YYYY-MM-DD',
//   //   ).format('YYYY-MM-DD')
//   //   // Save - DB
//   //   if (btnSaveText === 'Save') {
//   //     axios
//   //       .post(
//   //         `http://localhost:8091/mr/api/transaction/marriageBoardRegistration/saveMarraigeBoardRegistration`,
//   //         fromData,
//   //       )
//   //       .then((res) => {
//   //         if (res.status == 201) {
//   //           swal('Saved!', 'Record Saved successfully !', 'success')
//   //           setButtonInputState(false)
//   //           setIsOpenCollapse(false)
//   //           getmarraigeBoardRegistrationDetails()
//   //           setEditButtonInputState(false)
//   //           setDeleteButtonState(false)
//   //         }
//   //       })
//   //   }
//   // }
//   ///set zone ward
//   const [zoneName, setZoneName] = useState(null)
//   const [wards, setWards] = useState([])
//   const [zones, setZones] = useState([])
//   //ward
//   const getWards = () => {
//     axios.get(`http://localhost:8090/cfc/api/master/ward/getAll`).then((r) => {
//       setWards(
//         r.data.ward.map((row) => ({
//           id: row.id,
//           wardName: row.wardName,
//         })),
//       )
//     })
//   }

//   useEffect(() => {
//     getWards(), getZones()
//   }, [])
//   useEffect(() => {
//     console.log('DropDownWard', wards)
//     console.log('DropDownZone', zones)
//     wards.map((ward) => console.log('ward', ward.id))
//     zones.map((ward) => console.log('zone', ward.id))
//   }, [wards, zones])

//   //Zone

//   const getZoneName = () => {
//     setZoneName(
//       zones.map((row) => ({
//         zonePrefix: row.zonePrefix,
//       })),
//     )
//   }

//   const getZones = () => {
//     axios.get(`http://localhost:8090/cfc/api/master/zone/getAll`).then((r) => {
//       setZones(
//         r.data.zone.map((row) => ({
//           id: row.id,
//           zoneName: row.zoneName,
//           zonePrefix: row.zonePrefix,
//         })),
//       )
//     })
//   }
//   // Update Data Based On ID
//   const editRecord = (record) => {
//     router.push({
//       pathname: `/marriageRegistration/boardRegistrationsmui/boardRegistration`,
//       query: {
//         pageMode: 'Edit',
//         ...record,
//         id: record.id,
//       },
//     })
//   }

//   // view

//   const viewRecord = (record) => {
//     console.log('record value => ', record)
//     router.push({
//       pathname: `/marriageRegistration/boardRegistrationsmui/boardRegistration`,
//       query: {
//         pageMode: 'View',
//         ...record,
//       },
//     })
//   }

//   // Delete By ID

//   const deleteById = (value) => {
//     swal({
//       title: 'Delete?',
//       text: 'Are you sure you want to delete this Record ? ',
//       icon: 'warning',
//       buttons: true,
//       dangerMode: true,
//     }).then((willDelete) => {
//       if (willDelete) {
//         axios
//           .delete(
//             `http://localhost:8091/mr/api/transaction/marriageBoardRegistration//discardMarraigeBoardRegistration/${value}`,
//           )
//           .then((res) => {
//             if (res.status == 200) {
//               swal('Record is Successfully Deleted!', {
//                 icon: 'success',
//               })
//               getmarraigeBoardRegistrationDetails()
//             }
//           })
//       } else {
//         swal('Record is Safe')
//       }
//     })
//   }

//   // Reset Values Cancell
//   const resetValuesCancell = {
//     marriageBoardName: '',
//     gender: '',
//     flatBuildingNo: '',
//     buildingName: '',
//     roadName: '',
//     landmark: '',
//     pincode: '',
//     aadhaarNo: '',
//     mobile: '',
//     emailAddress: '',
//     validityOfMarriageBoardRegistration: null,
//     remarks: '',
//     serviceCharges: '',
//     applicationAcceptanceCharges: '',
//     applicationNumber: '',
//     applicantName: '',
//     cflatBuildingNo: '',
//     cbuildingName: '',
//     croadName: '',
//     clandmark: '',
//     cpincode: '',
//     ccity: '',
//     pflatBuildingNo: '',
//     pbuildingName: '',
//     proadName: '',
//     plandmark: '',
//     ppincode: '',
//     pcity: '',
//     zone: '',
//     ward: '',
//     zoneKey: '',
//     wardKey: '',
//     city: '',
//     applicationNumber: '',
//     registrationNumber: '',
//     status: '',
//     documentList: '',
//     landlineNo: '',
//   }

//   // Reset Values Exit
//   const resetValuesExit = {
//     marriageBoardName: '',
//     gender: '',
//     flatBuildingNo: '',
//     buildingName: '',
//     roadName: '',
//     landmark: '',
//     pincode: '',
//     aadhaarNo: '',
//     mobile: '',
//     emailAddress: '',
//     validityOfMarriageBoardRegistration: null,
//     remarks: '',
//     serviceCharges: '',
//     applicationAcceptanceCharges: '',
//     applicationNumber: '',
//     applicantName: '',
//     cflatBuildingNo: '',
//     cbuildingName: '',
//     croadName: '',
//     clandmark: '',
//     cpincode: '',
//     ccity: '',
//     pflatBuildingNo: '',
//     pbuildingName: '',
//     proadName: '',
//     plandmark: '',
//     ppincode: '',
//     pcity: '',
//     zone: '',
//     ward: '',
//     zoneKey: '',
//     wardKey: '',
//     city: '',
//     landlineNo: '',
//     documentList: '',

//     applicationNumber: '',
//     registrationNumber: '',
//     status: '',
//   }

//   //file upload

//   const [fileName, setFileName] = useState(null)
//   const onChangeFn = (e) => {
//     // @ts-ignore
//     console.log('File name: ', e.target.files[0])
//     // @ts-ignore
//     setFileName(e.target.files[0].name)
//   }

//   // define colums table
//   const columns = [
//     {
//       field: 'srNo',
//       headerName: <FormattedLabel id="srNo" />,
//       width: 80,
//     },
//     {
//       field: 'applicationNumber',
//       headerName: 'Application Number',
//       width: 140,
//     },

//     {
//       field: 'marriageBoardName',
//       headerName: 'Marriage Board Name',

//       width: 180,
//     },

//     {
//       field: 'remarks',
//       headerName: 'Remarks',
//       width: 240,
//     },

//     {
//       field: 'applicationStatus',
//       headerName: 'Status',
//       width: 240,
//     },

//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 340,
//       sortable: false,
//       disableColumnMenu: true,
//       renderCell: (record) => {
//         return (
//           <>
//             <IconButton
//               disabled={editButtonInputState}
//               onClick={() => viewRecord(record.row)}
//             >
//               <Button
//                 style={{
//                   height: '30px',
//                   width: '65px',
//                 }}
//                 variant="contained"
//                 color="primary"
//               >
//                 View
//               </Button>
//             </IconButton>
//             <IconButton
//               disabled={editButtonInputState}
//               onClick={() => editRecord(record.row)}
//             >
//               <Button
//                 style={{
//                   height: '30px',
//                   width: '85px',
//                 }}
//                 variant="contained"
//                 color="primary"
//               >
//                 EDIT
//               </Button>
//             </IconButton>
//             <IconButton
//               disabled={deleteButtonInputState}
//               onClick={() => deleteById(record.id)}
//             >
//               <Button
//                 style={{
//                   height: '30px',
//                   width: '85px',
//                 }}
//                 variant="contained"
//                 color="error"
//               >
//                 delete
//               </Button>
//             </IconButton>
//           </>
//         )
//       },
//     },
//   ]

//   return (
//     <>
//       <div>
//         {/* <BasicLayout> */}
//         <Paper
//           sx={{
//             marginLeft: 2,
//             marginRight: 2,
//             marginTop: 1,
//             marginBottom: 2,
//             padding: 1,
//           }}
//         >
//           <br />
//           <div className={styles.titleM}>
//             <Typography variant="h4" display="block" gutterBottom>
//               <FormattedLabel id="boardtitle" />
//             </Typography>
//           </div>
//           <br />

//           <DataGrid
//             sx={{
//               marginLeft: 9,
//               marginRight: 5,
//               marginTop: 2,
//               marginBottom: 2,
//               overflowY: 'scroll',

//               '& .MuiDataGrid-virtualScrollerContent': {},
//               '& .MuiDataGrid-columnHeadersInner': {
//                 backgroundColor: '#556CD6',
//                 color: 'white',
//               },

//               '& .MuiDataGrid-cell:hover': {
//                 color: 'primary.main',
//               },
//             }}
//             density="compact"
//             autoHeight
//             scrollbarSize={17}
//             rows={dataSource}
//             columns={columns}
//             pageSize={10}
//             rowsPerPageOptions={[10]}
//           />
//         </Paper>
//         {/* </BasicLayout> */}
//       </div>
//     </>
//   )
// }

// export default index
