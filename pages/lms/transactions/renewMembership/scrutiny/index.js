import BrushIcon from "@mui/icons-material/Brush";
import CheckIcon from "@mui/icons-material/Check";
import PaidIcon from "@mui/icons-material/Paid";
import SearchIcon from "@mui/icons-material/Search";
import * as MuiIcons from "@mui/icons-material";
import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
// import styles from '../../../../styles/marrigeRegistration'
import urls from "../../../../../URLS/urls";
import Loader from "../../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";

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
  let language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [authority, setAuthority] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedLibraryIds, setSelectedLibraryIds] = useState([]);
  const [allLibraries, setAllLibraries] = useState([]);

  const tempData = [
    {
      id: 1,
      applicationNumber: 12,
      applicationDate: "19/02/2023",
      applicantName: "Sarthak",
      applicationStatus: "APPLICATION_CREATED",
      startDate: "19-02-2023",
      endDate: "29-03-2023",
      serviceName: "New Membership Registration",
      serviceId: 43,
    },
    {
      id: 2,
      applicationNumber: 13,
      applicationDate: "19/02/2023",
      applicantName: "Sarthak",
      applicationStatus: "APPLICATION_CREATED",
      startDate: "19-02-2023",
      endDate: "04-04-2023",
      serviceName: "New Book Request",
      serviceId: 44,
    },
  ];

  const getAllLibraryByUser = () => {
    setLoading(true);
    axios
      .get(
        `${urls.LMSURL}/libraryMaster/getAllLibraryByUserKey?userKey=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log("___libraryMasterList", res);
        let tempData =
          res?.data?.libraryMasterList
            ?.sort((a, b) => a?.id - b?.id)
            ?.map((r, i) => {
              return {
                id: r?.id,
                libraryName: r?.libraryName,
                libraryNameMr: r?.libraryNameMr,
                libraryType: r?.libraryType,
              };
            }) ?? [];
        tempData?.length > 0
          ? setAllLibraries(tempData)
          : sweetAlert({
              title: language === "en" ? "Not Found !!" : "आढळले नाही !!",
              text:
                language === "en"
                  ? "Data Not Found for current User !!"
                  : "वर्तमान वापरकर्त्यासाठी डेटा आढळला नाही!!",
              icon: "info",
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
      })
      .catch((er) => {
        setLoading(false);
        sweetAlert("Error", er?.message ?? "Something Went Wrong", "error");
      });
  };

  // Get Table - Data
  const getRenewalMembershipDetails = () => {
    setTableData([]);
    setLoading(true);
    console.log("userToken", user.token);
    axios
      .get(
        // `${urls.LMSURL}/trnRenewalOfMembership/getAllByServiceIdAndLibrarianId?serviceId=90&librarianId=${user.id}`
        `${urls.LMSURL}/trnRenewalOfMembership/getAllByServiceIdAndLibraryIds?serviceId=90&libraryIds=${selectedLibraryIds}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log(res, "reg123");
        let tempData = res.data.trnRenewalOfMembershipList
          ? res.data.trnRenewalOfMembershipList
              .sort((a, b) => b.id - a.id)
              .map((r, i) => {
                return {
                  srNo: i + 1,
                  ...r,
                  applicationDate: r.applicationDate
                    ? moment(r.applicationDate).format("DD-MM-YYYY")
                    : "",
                  startDate: r.startDate
                    ? moment(r.startDate).format("DD-MM-YYYY")
                    : "",
                  endDate: r.endDate
                    ? moment(r.endDate).format("DD-MM-YYYY")
                    : "",
                  applicantName: r.applicantName,
                };
              })
          : [];
        tempData?.length > 0
          ? setTableData(tempData ?? [])
          : sweetAlert({
              title: language === "en" ? "Not Found !!" : "आढळले नाही !!",
              text:
                language === "en"
                  ? "Data Not Found for Selected Library !!"
                  : "निवडलेल्या ग्रंथालयासाठी डेटा आढळला नाही !!",
              icon: "info",
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
        // setTableData(tempData);
      })
      .catch((er) => {
        setLoading(false);
        sweetAlert("Error", er?.message ?? "Something Went Wrong", "error");
      });
  };

  // useEffect(() => {
  //   console.log("authority", authority);
  //   getRenewalMembershipDetails();
  // }, [authority, serviceId]);

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
    {
      field: "startDate",
      headerName: <FormattedLabel id="startDate" />,
      // headerName: "Membership Start Date",
      width: 280,
    },
    {
      field: "endDate",
      headerName: <FormattedLabel id="endDate" />,
      // headerName: "Membership End Date",
      width: 280,
    },
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
              {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
                (authority?.includes("DOCUMENT_CHECKLIST") ||
                  authority?.includes("ADMIN") ||
                  authority?.includes("LIBRARIAN")) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          "/lms/transactions/renewMembership/scrutiny/scrutiny",
                        query: {
                          disabled: true,
                          ...record.row,
                          role: "RENEW_MEMBERSHIP",
                          pageHeader: "RENEW_MEMBERSHIP",
                          pageMode: "Check",
                          pageHeaderMr: "परतावा ठेव",
                        },
                      })
                    }
                  >
                    <Button size="small" variant="contained" color="primary">
                      Document Checklist
                    </Button>
                  </IconButton>
                )}
              {/* MEMBERSHIP_CREATED  */}
              {record?.row?.applicationStatus === "LIBRARIAN_APPROVED" &&
                authority?.find(
                  (r) =>
                    r === "LOI_GENERATION" || r === "ADMIN" || r === "LIBRARIAN"
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<BrushIcon />}
                      size="small"
                      onClick={() =>
                        router.push({
                          pathname:
                            "/lms/transactions/renewMembership/scrutiny/LoiGenerationComponent",
                          query: {
                            id: record.row.id,
                            serviceName: record.row.serviceId,

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
                authority?.find(
                  (r) => r === "CASHIER" || r === "ADMIN" || r === "LIBRARIAN"
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      // endIcon={<PaidIcon />}
                      size="small"
                      color="success"
                      onClick={() =>
                        router.push({
                          pathname:
                            "/lms/transactions/renewMembership/scrutiny/PaymentCollection",

                          query: {
                            ...record.row,
                            role: "CASHIER",
                          },
                        })
                      }
                    >
                      Collect Payment
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "PAYMENT_SUCCESSFUL" &&
                authority?.find(
                  (r) =>
                    r === "CERTIFICATE_ISSUER" ||
                    r === "ADMIN" ||
                    r === "LIBRARIAN"
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                      // onClick={
                      //   ()=>{
                      //     router.push({
                      //       pathname:
                      //         '/lms/transactions/newMembershipRegistration/scrutiny/IdCardOfLibraryMember',
                      //       query: {
                      //         ...record.row,
                      //         role: 'CERTIFICATE_ISSUER',
                      //       },
                      //     })
                      //   }
                      // }
                    >
                      ISSUE LIBRARY CARD
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

  const issueCertificate = (record) => {
    const finalBody = {
      id: Number(record.id),
      // ...record,
      // // role: 'CERTIFICATE_ISSUER',
      // serviceId: 85,
      // applicationStatus: 'ICARD_ISSUED',
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  const handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedLibraryIds(typeof value === "string" ? value.split(",") : value);
  };

  const saveApproval = (body) => {
    setLoading(true);
    axios
      .post(
        `${urls.LMSURL}/trnRenewalOfMembership/issueIdCard`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${user.token}`,
        //   },
        // },
      )
      .then((response) => {
        setLoading(false);
        if (response.status === 200 || response.status == 201) {
          // if (body.role === 'LOI_GENERATION') {
          //   router.push({
          //     pathname:
          //       '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi',
          //     query: {
          //       ...body,
          //     },
          //   })
          // } else if (
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
          router.push({
            pathname:
              "/lms/transactions/renewMembership/scrutiny/IdCardOfLibraryMember",
            query: {
              // ...record.row,
              id: body.id,
              // role: 'CERTIFICATE_ISSUER',
            },
          });
        }
      });
  };

  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find(
      (r) => r.id == selectedMenuFromDrawer
    )?.serviceId;
    console.log("serviceId-<>", service);
    console.log("auth0000", auth);
    setAuthority(auth);
    setServiceId(service);
    getAllLibraryByUser();
  }, []);

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
        {/* <div className={styles.detailsTABLE}>
          <div className={styles.h1TagTABLE}>
            <h2
              style={{
                fontSize: "20",
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="renewMembership" />}
            </h2>
          </div>
        </div> */}
        <BreadcrumbComponent />
        <LmsHeader labelName="renewMembershipDetails" />

        <br />
        <Grid
          container
          style={{ padding: "10px" }}
          sx={{
            // marginLeft: 3,
            // marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
          }}
        >
          <Grid
            item
            xl={3}
            lg={3}
            md={3}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "2",
            }}
          ></Grid>
          <Grid
            item
            xl={3}
            lg={3}
            md={3}
            sm={12}
            xs={12}
            // sx={{ display: "flex", justifyContent: "center" }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              fullWidth
              size="small"
              style={{
                //  width: "60%",
                backgroundColor: "white",
              }}
            >
              <InputLabel id="demo-simple-select-label">
                <FormattedLabel id="lib" />
              </InputLabel>
              <Select
                // sx={{ width: 350 }}
                style={{
                  height: "40px",
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                multiple
                value={selectedLibraryIds}
                // label={<FormattedLabel id="selectService" />}
                label={<FormattedLabel id="lib" />}
                onChange={handleChange}
                renderValue={(selected) =>
                  allLibraries
                    ?.filter((v) => selected.includes(v.id))
                    ?.map((v) =>
                      language === "en" ? v?.libraryName : v?.libraryNameMr
                    )
                    ?.join(", ")
                }
              >
                {allLibraries.length > 0
                  ? allLibraries.map((name, index) => {
                      console.log("name", name);
                      return (
                        <MenuItem key={name.id} value={name.id}>
                          <Checkbox
                            checked={selectedLibraryIds?.indexOf(name.id) > -1}
                          />
                          <ListItemText
                            primary={
                              language === "en"
                                ? name.libraryName
                                : name?.libraryNameMr
                            }
                          />
                        </MenuItem>
                      );
                    })
                  : []}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xl={1.5}
            lg={1.5}
            md={1.5}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "2",
            }}
          >
            <Button
              variant="contained"
              color="success"
              // size="small"
              endIcon={<SearchIcon />}
              disabled={selectedLibraryIds?.length > 0 ? false : true}
              onClick={() => {
                getRenewalMembershipDetails();
              }}
            >
              <FormattedLabel id="search" />
            </Button>
          </Grid>
          <Grid
            item
            xl={1.5}
            lg={1.5}
            md={1.5}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "2",
            }}
          >
            <Button
              // style={{ height: "40px", width: "110px", marginRight: "100px" }}
              // style={{ marginRight: "100px" }}
              variant="contained"
              // color="error"
              // size="small"
              endIcon={<MuiIcons.Clear />}
              onClick={() => {
                setSelectedLibraryIds([]);
                setTableData([]);
              }}
            >
              <FormattedLabel id="clear" />
            </Button>
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            md={3}
            sm={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "2",
            }}
          ></Grid>
        </Grid>

        {loading ? (
          <Loader />
        ) : (
          <>
            {tableData?.length > 0 ? (
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
            ) : (
              <></>
            )}
          </>
        )}
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};
export default Index;
