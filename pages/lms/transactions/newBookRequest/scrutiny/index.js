import BrushIcon from "@mui/icons-material/Brush";
import CheckIcon from "@mui/icons-material/Check";
import PaidIcon from "@mui/icons-material/Paid";
import SearchIcon from "@mui/icons-material/Search";
import * as MuiIcons from "@mui/icons-material";
import {
  Box,
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
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
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

  const languages = [
    { id: 1, language: "English" },
    { id: 2, language: "Marathi" },
    { id: 3, language: "Hindi" },
  ];

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
  const getNewBookRequestDetails = () => {
    setTableData([]);
    setLoading(true);
    axios
      .get(
        // `${urls.LMSURL}/trnRequestBook/getAllByServiceIdAndLibrarianId?serviceId=84&librarianId=${user.id}`
        `${urls.LMSURL}/trnRequestBook/getAllByServiceIdAndLibraryIds?serviceId=84&libraryIds=${selectedLibraryIds}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log(res, "reg123");
        let tempData = res.data.trnRequestBookList
          ? res.data.trnRequestBookList
              ?.sort((a, b) => b.id - a.id)
              ?.map((r, i) => {
                return {
                  srNo: i + 1,
                  ...r,
                  applicationDate: moment(r.applicationDate).format(
                    "DD-MM-YYYY"
                  ),
                  language: languages.find(
                    (language) => r.language == language.id
                  )?.language,
                };
              })
          : [];
        // tempData = [];
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
    // axios
    //   .get(
    //     `${urls.MR}/transaction/marriageBoardRegistration/getmarraigeBoardRegistrationDetails?serviceId=${serviceId}`,
    //
    //     {
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //       },
    //     },
    //   )

    //   // .then((res) => {
    //   // setTableData(
    //   //   res.data.map((r, i) => {
    //   //     return {
    //   //       srNo: i + 1,
    //   //       ...r,
    //   //     }
    //   //   }),
    //   // )
    //   // })

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
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedLibraryIds(typeof value === "string" ? value.split(",") : value);
  };

  // useEffect(() => {
  //   console.log("authority", authority);
  //   getNewBookRequestDetails();
  // }, [authority, serviceId]);

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
    // axios
    //   .post(
    //     `${urls.MR}/transaction/marriageBoardRegistration/saveMarraigeBoardRegistrationApprove`,
    //     body,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //       },
    //     },
    //   )
    //   .then((response) => {
    //     if (response.status === 200) {
    //       if (body.role === 'LOI_GENERATION') {
    //         router.push({
    //           pathname:
    //             '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi',
    //           query: {
    //             ...body,
    //           },
    //         })
    //       } else if (
    //         body.role === 'CERTIFICATE_ISSUER' ||
    //         body.role === 'APPLY_DIGITAL_SIGNATURE'
    //       ) {
    //         router.push({
    //           pathname: '/marriageRegistration/reports/boardcertificateui',
    //           query: {
    //             ...body,
    //             // role: "CERTIFICATE_ISSUER",
    //           },
    //         })
    //       }
    //     }
    //   })
  };

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // headerName: "Sr No",
      flex: 1,
      // minWidth: 50,
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      // headerName: "Application No",
      flex: 1,
      // minWidth: 250,
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      // headerName: "Application Date",
      flex: 1,
      // minWidth: 150,
      // valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY'),
    },

    // {
    //   field: 'libraryName',
    //   // headerName: <FormattedLabel id="boardNameT" />,
    //   headerName: "library Name",
    //   width: 240,
    // },

    // {
    //   field: 'applicantName',
    //   // headerName: <FormattedLabel id="ApplicantName" />,
    //   headerName: "Applicant Name",
    //   width: 240,
    // },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="applicationStatus" />,
      // headerName: "Application Status",
      // width: 150,
      flex: 1,
    },
    {
      field: "bookName",
      headerName: <FormattedLabel id="bookName" />,
      // headerName: "Book Name",
      // width: 150,
      flex: 1,
    },
    {
      field: "bookClassification",
      headerName: <FormattedLabel id="bookClassification" />,
      // headerName: "Book Classification",
      // width: 150,
      flex: 1,
    },
    {
      field: "bookType",
      headerName: <FormattedLabel id="bookType" />,
      // headerName: "Book Type",
      // width: 150,
      flex: 1,
    },
    {
      field: "bookSubType",
      headerName: <FormattedLabel id="bookSubType" />,
      // headerName: "Book SubType",
      // width: 150,
      flex: 1,
    },
    {
      field: "bookEdition",
      headerName: <FormattedLabel id="bookEdition" />,
      // headerName: "Book Edition",
      // width: 100,
      flex: 1,
    },
    {
      field: "language",
      headerName: <FormattedLabel id="language" />,
      // headerName: "Language",
      // width: 100,
      flex: 1,
    },
    {
      field: "author",
      headerName: <FormattedLabel id="author" />,
      // headerName: "Author",
      // width: 100,
      flex: 1,
    },
    // {
    //   field: 'actions',
    //   // headerName: <FormattedLabel id="actions" />,
    //   headerName: "Actions",
    //   width: 280,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (record) => {
    //     return (
    //       <>
    //         <div className={styles.buttonRow}>
    //           {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //             (authority?.includes('DOCUMENT_CHECKLIST') ||
    //               authority?.includes('ADMIN')) && (
    //               <IconButton
    //                 onClick={() =>
    //                   router.push({
    //                     pathname:
    //                       '/lms/transactions/newMembershipRegistration/scrutiny/scrutiny',
    //                     query: {
    //                       disabled: true,
    //                       ...record.row,
    //                       role: 'DOCUMENT_CHECKLIST',
    //                       pageHeader: 'DOCUMENT CHECKLIST',
    //                       pageMode: 'Check',
    //                       pageHeaderMr: 'कागदपत्र तपासणी',
    //                     },
    //                   })
    //                 }
    //               >
    //                 <Button
    //                   style={{
    //                     height: '30px',
    //                     width: '250px',
    //                   }}
    //                   variant="contained"
    //                   color="primary"
    //                 >
    //                   Document Checklist
    //                 </Button>
    //               </IconButton>
    //             )}

    //           {/* {record?.row?.applicationStatus ===
    //             'APPLICATION_SENT_TO_SR_CLERK' &&
    //             authority?.find(
    //               (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //             ) && (
    //               <>
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
    //                         pathname: 'scrutiny/scrutiny',
    //                         query: {
    //                           ...record.row,
    //                           role: 'DOCUMENT_VERIFICATION',

    //                           pageHeader: 'APPLICATION VERIFICATION',
    //                           // pageMode: 'Edit',
    //                           pageMode: 'Check',
    //                           pageHeaderMr: 'अर्ज पडताळणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     DOCUMENT VERIFICATION
    //                   </Button>
    //                 </IconButton>
    //               </>
    //             )}

    //           {record?.row?.applicationStatus === 'APPLICATION_SENT_TO_CMO' &&
    //             authority?.find(
    //               (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //             ) && (
    //               <>
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
    //                         pathname: 'scrutiny/scrutiny',
    //                         query: {
    //                           ...record.row,
    //                           role: 'FINAL_APPROVAL',
    //                           pageHeader: 'FINAL APPROVAL',
    //                           // pageMode: 'Edit',
    //                           pageMode: 'Check',
    //                           pageHeaderMr: 'अर्ज पडताळणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     CMO VERIFY
    //                   </Button>
    //                 </IconButton>
    //               </>
    //             )}

    //           {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //             authority?.find(
    //               (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //             ) && (
    //               <IconButton>
    //                 <Button
    //                   variant="contained"
    //                   endIcon={<BrushIcon />}
    //                   style={{
    //                     height: '30px',
    //                     width: '250px',
    //                   }}
    //                   onClick={() =>
    //                     router.push({
    //                       pathname:
    //                         '/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationComponent',
    //                       query: {
    //                         id: record.row.id,
    //                         serviceName: record.row.serviceId,

    //                         role: 'LOI_GENERATION',
    //                       },
    //                     })
    //                   }
    //                 >
    //                   GENERATE LOI
    //                 </Button>
    //               </IconButton>
    //             )}

    //           {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //             authority?.find((r) => r === 'CASHIER' || r === 'ADMIN') && (
    //               <IconButton>
    //                 <Button
    //                   variant="contained"
    //                   endIcon={<PaidIcon />}
    //                   style={{
    //                     height: '30px',
    //                     width: '250px',
    //                   }}
    //                   color="success"
    //                   onClick={() =>
    //                     router.push({
    //                       pathname:
    //                         '/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection',

    //                       query: {
    //                         ...record.row,
    //                         role: 'CASHIER',
    //                       },
    //                     })
    //                   }
    //                 >
    //                   Collect Payment
    //                 </Button>
    //               </IconButton>
    //             )}

    //           {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //             authority?.find(
    //               (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //             ) && (
    //               <IconButton>
    //                 <Button
    //                   variant="contained"
    //                   style={{
    //                     height: 'px',
    //                     width: '250px',
    //                   }}
    //                   color="success"
    //                   onClick={() => issueCertificate(record.row)}
    //                 >
    //                   GENERATE CERTIFICATE
    //                 </Button>
    //               </IconButton>
    //             )} */}
    //           {/* {record?.row?.applicationStatus === 'CERTIFICATE_GENERATED' &&
    //             authority?.find(
    //               (r) => r === 'APPLY_DIGITAL_SIGNATURE' || r === 'ADMIN',
    //             ) && (
    //               <IconButton>
    //                 <Button
    //                   variant="contained"
    //                   style={{
    //                     height: 'px',
    //                     width: '250px',
    //                   }}
    //                   color="success"
    //                   onClick={() => issueCertificate1(record.row)}
    //                 >
    //                   APPLY DIGITAL SIGNATURE
    //                 </Button>
    //               </IconButton>
    //             )} */}
    //         </div>
    //       </>
    //     )
    //   },
    // },
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
        <Box>
          <BreadcrumbComponent />
        </Box>
        <LmsHeader labelName="newBookRequest" />
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
                getNewBookRequestDetails();
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
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    // printOptions: { disableToolbarButton: true },
                    // disableExport: true,
                    // disableToolbarButton: true,
                    // csvOptions: { disableToolbarButton: true },
                  },
                }}
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
