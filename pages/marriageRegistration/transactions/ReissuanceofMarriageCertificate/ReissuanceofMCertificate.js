import { Box, Button, IconButton, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// export default newRegistration

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
  const dispach = useDispatch();

  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [authority, setAuthority] = useState([]);
  const [serviceId, setServiceId] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [applicantTableData, setApplicantTableData] = useState([]);
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

  const getReissuanceofMCertificateDetails = (_pageSize = 10, _pageNo = 0) => {
    if (serviceId == 11) {
      axios
        .get(
          // `${urls.MR}/transaction/applicant/getapplicantDetails?serviceId=${serviceId}`,
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

        .then((res) => {
          setNewMarriageData({
            rows: res.data.reIssuanceOfMarriageDao,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          console.log("Reissue table", res.data);
          setTableData(
            res.data.reIssuanceOfMarriageDao.map((r, i) => {
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
    getReissuanceofMCertificateDetails();
  }, [authority]);

  // const issueCertificate = (record) => {
  //   const finalBody = {
  //     id: record.id,
  //     // serviceId: 11,
  //     role: "CERTIFICATE_ISSUER",
  //   };
  //   console.log("yetoy", record);
  //   saveApproval(finalBody);
  // };

  // // const applyDigitalSignature = (record) => {
  // //   const finalBody = {
  // //     id: Number(record.id),
  // //     ...record,
  // //     applicationId: record.id,
  // //     role: "APPLY_DIGITAL_SIGNATURE",
  // //   };
  // //   console.log("ads yetoy", record);
  // //   saveApproval(finalBody);
  // // };

  const saveApproval = (body) => {
    axios
      .post(`${urls.MR}/transaction/reIssuanceM/saveApplicationApprove`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 11,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (body.role === "APPLY_DIGITAL_SIGNATURE") {
            router.push({
              pathname: "/marriageRegistration/reports/marriageCertificateNew",
              query: {
                ...body,
                // role: "CERTIFICATE_ISSUER",
              },
            });
          }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const applyDigitalSignature = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      applicationId: record.id,
      role: "APPLY_DIGITAL_SIGNATURE",
    };
    console.log("ads yetoy", record);
    saveApproval(finalBody);
  };

  const issueCertificate = (record) => {
    const finalBody = {
      id: Number(record.id),
      serviceId: 11,
      role: "CERTIFICATE_ISSUER",
      // ...record,
      // applicationId: record.id,
    };
    console.log("re-issue1111", record);
    // console.log(record,"11111")

    axios
      .post(
        `${urls.MR}/transaction/reIssuanceM/saveApplicationApprove`,

        finalBody,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            serviceId: 11,
          },
        },
      )
      .then((res) => {
        console.log(res);
        // swal(
        //   language == "en" ? "Submitted!" : "सबमिट केले!!",
        //   language == "en"
        //     ? "The certificate was issued successfully !"
        //     : "प्रमाणपत्र यशस्वीरित्या जारी करण्यात आले !",
        //   "success",
        // );

        // swal("Submitted!", "Certificate Issued successfully !", "success");
        router.push({
          pathname: "/marriageRegistration/reports/marriageCertificateNew",
          query: {
            // ...body,
            id: record.id,
            serviceId: 11,
            // role: "CERTIFICATE_ISSUER",
          },
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
        router.back();
      });
    // .catch((err) => {
    //   swal(
    //     language == "en" ? "Error! " : "त्रुटी!",
    //     language == "en" ? "Somethings Wrong!" : "काहीतरी चूक आहे!",
    //     "error",
    //   );
    //   router.back();
    // });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 240,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 150,
      headerAlign: "center",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="ApplicantName" />,
      width: 240,
      headerAlign: "center",
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="statusDetails" />,
      width: 280,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 480,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
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
                            "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/PaymentCollection",
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

              {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" && (
                <IconButton>
                  <Button
                    variant="contained"
                    style={{
                      height: "px",
                      width: "200px",
                    }}
                    color="success"
                    onClick={() =>
                      router.push({
                        pathname:
                          "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/scrutiny",
                        query: {
                          ...record.row,
                          role: "DOCUMENT_VERIFICATION",
                        },
                      })
                    }
                  >
                    {language == "en"
                      ? "Verify Application"
                      : "अर्ज पडताळणी करा"}
                  </Button>
                </IconButton>
              )}

              {record?.row?.applicationStatus === "FINAL_APPROVED" && (
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
              {record?.row?.applicationStatus === "CERTIFICATE_GENERATED" && (
                <IconButton>
                  <Button
                    variant="contained"
                    style={{
                      height: "px",
                      width: "250px",
                    }}
                    color="success"
                    onClick={() => applyDigitalSignature(record.row)}
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
                    style={{
                      height: "px",
                      width: "250px",
                    }}
                    color="success"
                    onClick={() => issueCertificate(record.row)}
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

  return (
    <>
      <div>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <Paper
          sx={{
            marginLeft: 1,
            marginRight: 1,
            marginTop: 1,
            marginBottom: 10,
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
                {<FormattedLabel id="newRMItable" />}
              </h2>
            </div>
          </div>
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
              marginBottom: 15,
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
            // rows={
            //   tableData != null &&
            //   tableData != undefined &&
            //   tableData.length != "0"
            //     ? tableData
            //     : []
            // }
            columns={columns}
            // pageSize={5}
            // rowsPerPageOptions={[5]}
            pagination
            paginationMode="server"
            page={newMarriageData?.page}
            rowCount={newMarriageData?.totalRows}
            rowsPerPageOptions={newMarriageData?.rowsPerPageOptions}
            pageSize={newMarriageData?.pageSize}
            rows={newMarriageData?.rows?.map((data, index) => {
              return {
                ...data,
                srNo: index + 1,
              };
            })}
            onPageChange={(_data) => {
              getReissuanceofMCertificateDetails(
                newMarriageData?.pageSize,
                _data,
              );
            }}
            onPageSizeChange={(_data) => {
              getReissuanceofMCertificateDetails(_data, newMarriageData?.page);
            }}
          />
        </Paper>
      </div>
    </>
  );
};

export default Index;
