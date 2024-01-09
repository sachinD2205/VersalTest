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

// Table _ MR
const Index = () => {
  let created = [];
  let checklist = [];
  let apptScheduled = [];
  let clkVerified = [];
  let cmolaKonte = [];
  let cmoVerified = [];
  let loiGenerated = [];
  let certificateDownload = [];
  let cashier = [];
  let paymentCollected = [];
  let certificateIssued = [];
  let merged = [];

  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [authority, setAuthority] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [loaderState, setLoaderState] = useState(false);
  const [newMarriageData, setNewMarriageData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  useEffect(() => {
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
    setLoaderState(true);
    if (serviceId)
      axios
      .get(
        // `${urls.MR}/transaction/applicant/getapplicantDetails?serviceId=${serviceId}`,
        `${urls.MR}/transaction/applicant/paginationAgainsrService`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            serviceId:serviceId,
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        },
      )
        .then((resp) => {
          setNewMarriageData({
            rows: resp.data.modOfMarBoardCertificateDao,
            totalRows: resp.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: resp.data.pageSize,
            page: resp.data.pageNo,
          });
          setLoaderState(false);
          if (
            authority.includes("DOCUMENT_CHECKLIST") ||
            authority.includes("ADMIN")
          ) {
            console.log("APPLICATION_CREATED");
            created = resp.data.modOfMarBoardCertificateDao.filter(
              (data) => data.applicationStatus === "APPLICATION_CREATED",
            );
          }

          // if (
          //   authority?.find(
          //     (r) => ["APPOINTMENT_SCHEDULE"].includes(r) || authority?.find((r) => r === "ADMIN"),
          //   )
          // ) {
          //   console.log("APPOINTMENT_SCHEDULE");
          //   clkVerified = resp.data.modOfMarBoardCertificateDao.filter((data) => data.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK");
          // }

          if (
            authority?.find(
              (r) =>
                r === "DOCUMENT_VERIFICATION" ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            console.log("DOCUMENT_VERIFICATION");
            apptScheduled = resp.data.modOfMarBoardCertificateDao.filter((data) =>
              [
                "APPLICATION_SENT_TO_SR_CLERK",
                "CMO_SENT_BACK_TO_SR_CLERK",
              ].includes(data.applicationStatus),
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "FINAL_APPROVAL" || authority?.find((r) => r === "ADMIN"),
            )
          ) {
            cmolaKonte = resp.data.modOfMarBoardCertificateDao.filter(
              (data) => data.applicationStatus === "APPLICATION_SENT_TO_CMO",
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "LOI_GENERATION" || authority?.find((r) => r === "ADMIN"),
            )
          ) {
            cmoVerified = resp.data.modOfMarBoardCertificateDao.filter(
              (data) => data.applicationStatus === "CMO_APPROVED",
            );
          }

          if (
            authority?.find(
              (r) => r === "CASHIER" || authority?.find((r) => r === "ADMIN"),
            )
          ) {
            cashier = resp.data.modOfMarBoardCertificateDao.filter(
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
            loiGenerated = resp.data.modOfMarBoardCertificateDao.filter(
              (data) => data.applicationStatus === "PAYEMENT_SUCCESSFULL",
            );
          }
          if (
            authority?.find(
              (r) =>
                r === "DOWNLOAD_CERTIFCATE" ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            certificateDownload = resp.data.modOfMarBoardCertificateDao.filter(
              (data) => data.applicationStatus === "CERTIFICATE_ISSUED",
            );
          }

          merged = [
            ...created,
            ...checklist,
            ...apptScheduled,
            ...clkVerified,
            ...cmolaKonte,
            ...cmoVerified,
            ...loiGenerated,
            ...certificateDownload,
            ...cashier,
            ...paymentCollected,
            ...certificateIssued,
          ];

          console.log("created", created);
          console.log("checklist", checklist);
          console.log("apptScheduled", apptScheduled);
          console.log("clkVerified", clkVerified);
          console.log("cmoVerified", cmoVerified);
          console.log("loiGenerated", loiGenerated);
          console.log("certificateDownload", certificateDownload);
          console.log("paymentCollected", paymentCollected);
          console.log("certificateIssued", certificateIssued);
          setTableData(
            merged.map((r, i) => {
              return {
                srNo: i + 1,
                ...r,
              };
            }),
          );
        });
  };

  useEffect(() => {
    console.log("authority", authority);
    getNewMarriageRegistractionDetails();
  }, [authority]);

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

  const saveApproval = (body) => {
    setLoaderState(true);
    axios
      .post(
        `${urls.MR}/transaction/modOfMarBoardCertificate/saveModOfMarBoardCertificateApprove`,
        body,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((response) => {
        setLoaderState(false);
        if (response.status === 200) {
          if (body.role === "LOI_GENERATION") {
            router.push({
              pathname:
                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
              query: {
                ...body,
              },
            });
          } else if (body.role === "CERTIFICATE_ISSUER") {
            router.push({
              pathname: "/marriageRegistration/reports/boardcertificateui",
              query: {
                // applicationId: record.row.id,
                serviceId: 15,
                applicationId: body.id,
                // ...body,
                // role: "CERTIFICATE_ISSUER",
              },
            });
          }
        }
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
      minWidth: 300,
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
      minWidth: 310,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {["APPLICATION_CREATED"].includes(
                record?.row?.applicationStatus,
              ) &&
                // {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
                (authority?.includes("DOCUMENT_CHECKLIST") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/scrutiny",
                        query: {
                          disabled: true,
                          ...record.row,
                          role: "DOCUMENT_CHECKLIST",
                          pageHeader: "DOCUMENT CHECKLIST",
                          pageMode: "View",
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
                "CMO_SENT_BACK_TO_SR_CLERK",
                "APPLICATION_SENT_TO_SR_CLERK",
                "APPOINTMENT_SCHEDULED",
              ].includes(record?.row?.applicationStatus) &&
                // {record?.row?.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK" &&
                authority?.find(
                  (r) => r === "DOCUMENT_VERIFICATION" || r === "ADMIN",
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
                              pageMode: "Edit",
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
              {["APPLICATION_SENT_TO_CMO"].includes(
                record?.row?.applicationStatus,
              ) &&
                // {record?.row?.applicationStatus === "APPLICATION_VERIFICATION_COMPLETED" &&
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
                              pageMode: "Edit",
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
                      //  color="success"
                      // onClick={() => viewLOI(record.row)}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/LoiGenerationComponent",
                          query: {
                            // ...record.row,
                            id: record.row.id,
                            serviceName: record.row.serviceId,
                            // loiServicecharges: null,
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
                            "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/PaymentCollection",

                          query: {
                            // ...record.row,
                            role: "CASHIER",
                            applicationId: record.row.id,
                            serviceId: 15,
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

              {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" &&
                authority?.find(
                  (r) => r === "DOWNLOAD_CERTIFICATE" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
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
                        ? " DOWNLOAD CERTIFICATE"
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

  return (
    <>
      {loaderState ? (
        <Loader />
      ) : (
        <>
          <Box>
            <BreadcrumbComponent />
          </Box>
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
                  {language == "en"
                    ? "Modification In Marriage Board Registration"
                    : "विवाह मंडळाच्या नोंदणीमध्ये बदल"}{" "}
                  {/* {<FormattedLabel id="boardtitle" />} */}
                  {/* Modification In Marriage Board Registration */}
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
            page={newMarriageData?.page}
            rowCount={newMarriageData?.totalRows}
            rowsPerPageOptions={newMarriageData?.rowsPerPageOptions}
            pageSize={newMarriageData?.pageSize}
            rows={newMarriageData?.rows?.map((data,index)=> {
              return{
                ...data,
                srNo:index+1
              }
            })}
            onPageChange={(_data) => {            
              getNewMarriageRegistractionDetails(newMarriageData?.pageSize, _data)
            }}
            onPageSizeChange={(_data) => {           
              getNewMarriageRegistractionDetails(_data, newMarriageData?.page)

            }}
            />
          </Paper>
        </>
      )}
    </>
  );
};
export default Index;
