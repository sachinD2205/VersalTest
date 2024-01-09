import { Box, Button, IconButton, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import styles from "../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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
  }, [selectedMenuFromDrawer, user?.menus]);

  const getRenewalOfMBRDetails = (_pageSize = 10, _pageNo = 0) => {
    if (serviceId == 14) {
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
            rows: res.data.renewalOfMarriageBoardCertificateDao,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          console.log("Renewal table", res.data);
          setTableData(
            res.data.renewalOfMarriageBoardCertificateDao.map((r, i) => {
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
    getRenewalOfMBRDetails();
  }, [authority]);

  const issueCertificate = (record) => {
    let userType;

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "departmentUser") {
      userType = 3;
    } else localStorage.getItem("loggedInUser") == "cfcUser";
    {
      userType = 2;
    }
    const finalBody = {
      // applicationId: record.id,
      id: record.id,
      serviceId: 14,
      role: "CERTIFICATE_ISSUER",
      applicantType: userType,
    };

    axios
      .post(
        `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/saveRenewalOfMarriageBoardCertificateApprove`,
        finalBody,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        // swal(
        //   language == "en" ? "Submitted!" : "सबमिट केले!!",
        //   language == "en"
        //     ? "The certificate was issued successfully !"
        //     : "प्रमाणपत्र यशस्वीरित्या जारी करण्यात आले!",
        //   "success",
        // );
        // swal("Submitted!", "Certificate Issued successfully !", "success");
        router.push({
          pathname: "/marriageRegistration/reports/boardcertificateui",
          query: {
            // ...body,
            applicationId: record.id,
            serviceId: 14,
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
    //   // swal("Error!", "Somethings Wrong!", "error");
    //   router.back();
    // });
  };

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
      minWidth: 280,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" && (
                <IconButton>
                  {/* <Buttonremarks */}
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
                  {/* </Buttonremarks> */}
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
                    onClick={() => {
                      router.push({
                        pathname:
                          "/marriageRegistration/reports/boardcertificateui",
                        query: {
                          // // ...body,
                          applicationId: record?.row?.id,
                          serviceId: 14,
                          // // role: "CERTIFICATE_ISSUER",
                        },
                      });
                    }}
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
                {<FormattedLabel id="onlyRMBR" />}
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
            // rows={tableData}
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
              getRenewalOfMBRDetails(newMarriageData?.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getRenewalOfMBRDetails(_data, newMarriageData?.page);
            }}
          />
        </Paper>
      </div>
    </>
  );
};

export default Index;
