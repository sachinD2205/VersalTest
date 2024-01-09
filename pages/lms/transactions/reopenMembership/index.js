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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
// import styles from '../../../../styles/marrigeRegistration'
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";

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
    getAllLibraryByUser();
  }, []);

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
        // tempData = [];
        if (tempData?.length > 0) {
          setAllLibraries(tempData);
        } else {
          sweetAlert({
            title: language === "en" ? "Not Found !!" : "आढळले नाही !!",
            text:
              language === "en"
                ? "Data Not Found for current User !!"
                : "वर्तमान वापरकर्त्यासाठी डेटा आढळला नाही!!",
            icon: "info",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((er) => {
        setLoading(false);
        sweetAlert("Error", er?.message ?? "Something Went Wrong", "error");
      });
  };

  // Get Table - Data
  const getReopenMembershipDetails = () => {
    setLoading(true);
    setTableData([]);
    axios
      .get(
        // `${urls.LMSURL}/libraryMembership/getAllApplicationForReopen?librarianId=${user.id}`
        `${urls.LMSURL}/libraryMembership/getAllApplicationForReopen?libraryIds=${selectedLibraryIds}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        let tempData = res.data?.libraryMembershipList
          ?.sort((a, b) => b.id - a.id)
          ?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              applicationDate: r.applicationDate,
              startDate: r.startDate
                ? moment(r.startDate).format("DD-MM-YYYY")
                : "",
              endDate: r.endDate ? moment(r.endDate).format("DD-MM-YYYY") : "",
              applicantName: r.applicantName,
            };
          });
        // setTableData(tempData);
        if (tempData?.length > 0) {
          setTableData(tempData);
        } else {
          sweetAlert({
            title: language === "en" ? "Not Found !!" : "आढळले नाही !!",
            text:
              language === "en"
                ? "Data Not Found for Selected Library !!"
                : "निवडलेल्या ग्रंथालयासाठी डेटा आढळला नाही !!",
            icon: "info",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((er) => {
        setLoading(false);
        sweetAlert("Error", er?.message ?? "Something Went Wrong", "error");
      });
  };

  // useEffect(() => {
  //   console.log("authority", authority);
  //   getReopenMembershipDetails();
  // }, [authority, serviceId]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedLibraryIds(typeof value === "string" ? value.split(",") : value);
  };

  const handleReopen = (data) => {
    setLoading(true);
    console.log("dataaa", data);
    // let body = {
    //     ...data,
    //     isReopen: false,
    //     startDate: data.startDate ? moment(data.startDate).format('YYYY-MM-DD') : '',
    //     endDate: data.endDate ? moment(data.endDate).format('YYYY-MM-DD') : '',
    //     isReopenApprove: true,
    //     isReopenApplied: false,
    //     srNo: null
    // }
    let body = {
      id: data.id,
      isReopen: false,
      isReopenApprove: true,
      isReopenApplied: false,
      srNo: null,
    };
    axios
      .post(
        `${urls.LMSURL}/libraryMembership/reopenUpdate`,
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
          swal(
            language == "en" ? "Reopened!" : "पुन्हा उघडले!",
            language == "en"
              ? "Memebrship Re-opened Successfully!"
              : "सदस्यत्व यशस्वीरित्या उघडले!",
            "success"
          );
          // getReopenMembershipDetails();
        }
      })
      .catch((err) => {
        setLoading(false);
        swal(
          language == "en" ? "Error!" : "त्रुटी!",
          language == "en"
            ? "Somethings Wrong Membership not Re-opened!"
            : "काहीतरी चुकीचे आहे, सदस्यत्व पुन्हा उघडले नाही!",
          "error"
        );
      });
  };

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // headerName: "Sr No",
      // width: 70,
      flex: 1,
    },
    // {
    //     field: 'applicantName',
    //     headerName: <FormattedLabel id="applicationNo" />,
    //     // headerName: "Application No",
    //     width: 240,
    // },
    {
      field: "membershipNo",
      headerName: <FormattedLabel id="membershipNo" />,
      // headerName: "Application Date",
      // width: 150,
      flex: 1,
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
      // width: 240,
      flex: 1,
    },

    // {
    //     field: 'applicationStatus',
    //     headerName: <FormattedLabel id="applicationStatus" />,
    //     // headerName: "Application Status",
    //     width: 280,
    // },
    {
      field: "startDate",
      headerName: <FormattedLabel id="startDate" />,
      // headerName: "Membership Start Date",
      // width: 280,
      flex: 1,
    },
    {
      field: "endDate",
      headerName: <FormattedLabel id="endDate" />,
      // headerName: "Membership End Date",
      // width: 280,
      flex: 1,
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
              {(authority?.includes("DOCUMENT_CHECKLIST") ||
                authority?.includes("ADMIN") ||
                authority?.includes("LIBRARIAN")) && (
                <IconButton onClick={() => handleReopen(record.row)}>
                  <Button size="small" variant="contained" color="primary">
                    Reopen
                  </Button>
                </IconButton>
              )}
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
      })
      .catch((err) => setLoading(false));
  };

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
              {<FormattedLabel id="reopenMembership" />}
              
            </h2>
          </div>
        </div> */}
        <BreadcrumbComponent />
        <LmsHeader labelName="reopenMembership" />
        <Grid
          container
          style={{ padding: "10px" }}
          sx={{
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
                getReopenMembershipDetails();
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
              variant="contained"
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

        <br />

        {loading ? (
          <Loader />
        ) : (
          <>
            {tableData?.length > 0 ? (
              <DataGrid
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                components={{ Toolbar: GridToolbar }}
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
