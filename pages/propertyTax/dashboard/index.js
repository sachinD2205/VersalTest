// import { Paper } from '@mui/material'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import styles from "../../../components/pTax/styles/PropertyMainDashboard.module.css";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import Loader from '../../../containers/Layout/components/Loader';
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PeopleIcon from "@mui/icons-material/People";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextareaAutosize,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import theme from '../../../theme';
import urls from '../../../URLS/urls';
import axios from "axios"
import moment from "moment";
import { useGetLoggedInUserDetails, useGetSelectedMenuFromDrawer, useGetToken, useLanguage } from '../../../containers/reuseableComponents/CustomHooks';
import { catchExceptionHandlingMethod } from "../../../util/util"
import VerificationAppplicationDetails from '../../../components/pTax/components/VerificationAppplicationDetails';

const Index = () => {
  const language = useLanguage();
  const userToken = useGetToken();
  const user = useGetLoggedInUserDetails();
  const selectedMenuFromDrawer = useGetSelectedMenuFromDrawer();
  // Methods in useForm
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      loadderState: false,
      verificationDailog: false,
      viewFormDailog: false,
      viewDocumentDailog: false,
      approveRejectDailog: false,
    },
    // resolver: yupResolver(Schema),
  });
  // destructure values from methods
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
  // dataGrid
  const [finalTableData, setFinalTableData] = useState([]);
  const [applicationData, setApplicationData] = useState();
  const [pendingApplicationCount, setPendingApplicationCount] = useState(0);
  const [hardCodeAuthority, setHardCodeAuthority] = useState();
  const [siteVisitPreviewButtonInputState, setSiteVisitPreviewButtonInputState] = useState();
  const [rejectedApplicationCount, setRejectedApplicationCount] = useState(0);
  const [approvedApplicationCount, setApprovedApplicationCount] = useState(0);
  const [whichOne, setWhichOne] = useState("TOTAL");
  const [authority, setAuthority] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [i, setI] = useState(1);
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

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 100,
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNumber" />,
      description: <FormattedLabel id="applicationNumber" />,
      width: 290,
    },
    {
      field: "applicationDate1",
      headerName: <FormattedLabel id="applicationDate" />,
      description: <FormattedLabel id="applicationDate" />,
      width: 150,
    },

    {
      field: language === "en" ? "applicantName" : "applicantNameMr",

      headerName: <FormattedLabel id="applicantName" />,
      description: <FormattedLabel id="applicantName" />,
      width: 250,
    },

    {
      field: language === "en" ? "serviceNameEng" : "serviceNameMr",
      headerName: <FormattedLabel id="serviceName" />,
      description: <FormattedLabel id="serviceName" />,
      width: 320,
    },
    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 500,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        console.log("recordRow", record?.row)
        return (
          <>
            {/**  gatPramukhVerification*/}
            {(record?.row?.status === "APPLICATION_CREATED" ||
              record?.row?.status ===
              "APPLICATION_SENT_BACK_TO_DEPT_CLERK") &&
              authority?.find(
                (r) => r === "DEPT_CLERK_VERIFICATION" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => gatPramukhVerificationButton(record?.row, "GatPramukhVerification")}
                >
                  <Button variant="contained" size="small">
                    <FormattedLabel id="gatPramukhVerification" />
                  </Button>
                </IconButton>
              )}
          </>
        );
      },
    },

  ];

  const getPropertyTaxDashboardGetAll = () => {
    setValue("loadderState", true);

    const url = `${urls.PTAXURL}/transaction/property/getAllV1`;

    let tempStatues = [];

    // ward Officer
    if (authority?.includes("DEPT_CLERK_VERIFICATION")) {
      tempStatues?.push("APPLICATION_CREATED");
      tempStatues?.push("APPLICATION_SENT_BACK_TO_DEPT_CLERK");
    }

    //  site Visit Schedule
    if (authority?.includes("SITE_VISIT_SCHEDULE")) {
      tempStatues?.push("DEPT_CLERK_VERIFICATION_COMPLETED");
    }

    // site Visit
    if (authority?.includes("SITE_VISIT")) {
      tempStatues?.push("SITE_VISIT_SCHEDULED");
      tempStatues?.push("SITE_VISIT_RESCHEDULED");
    }

    // admin Officer
    if (authority?.includes("ADMIN_OFFICER")) {
      tempStatues?.push("SITE_VISIT_COMPLETED");
      tempStatues?.push("APPLICATION_SENT_TO_ADMIN_OFFICER");
      tempStatues?.push("APPLICATION_SENT_BACK_TO_ADMIN_OFFICER");
    }

    // ward Officer
    if (authority?.includes("WARD_OFFICER")) {
      tempStatues?.push("APPLICATION_SENT_TO_WARD_OFFICER");
    }

    //   loi Generation
    if (authority?.includes("LOI_GENERATION")) {
      tempStatues?.push("APPLICATION_VERIFICATION_COMPLETED");
    }

    // loi Preview
    if (authority?.includes("LOI_RECEIPT")) {
      tempStatues?.push("LOI_GENERATED");
    }
    // payment Collection
    if (authority?.includes("LOI_COLLECTION")) {
      tempStatues?.push("LOI_GENERATED");
    }

    //  payment Receipt
    if (authority?.includes("PAYMENT_RECEIPT")) {
      tempStatues?.push("PAYEMENT_SUCCESSFUL");
    }

    //  license Issuance
    if (authority?.includes("LICENSE_ISSUANCE")) {
      tempStatues?.push("PAYEMENT_SUCCESSFUL");
    }

    // license View
    if (authority?.includes("LICENSE_VIEW")) {
      tempStatues?.push("CERTIFICATE_GENERATED");
    }

    // iCard Issuance
    if (authority?.includes("I_CARD_ISSUANCE")) {
      tempStatues?.push("CERTIFICATE_GENERATED");
    }

    // iCard View
    if (authority?.includes("I_CARD_VIEW")) {
      tempStatues?.push("I_CARD_GENERATED");
    }

    // Admin
    if (authority?.includes("ADMIN")) {
      tempStatues?.push("APPLICATION_CREATED");
      tempStatues?.push("DEPT_CLERK_VERIFICATION_COMPLETED");
      tempStatues?.push("APPLICATION_SENT_BACK_TO_DEPT_CLERK");
      tempStatues?.push("SITE_VISIT_SCHEDULED");
      tempStatues?.push("SITE_VISIT_RESCHEDULED");
      tempStatues?.push("SITE_VISIT_COMPLETED");
      tempStatues?.push("CERTIFICATE_GENERATED");
      tempStatues?.push("I_CARD_GENERATED");
      tempStatues?.push("APPLICATION_SENT_TO_ADMIN_OFFICER");
      tempStatues?.push("APPLICATION_SENT_BACK_TO_ADMIN_OFFICER");
      tempStatues?.push("APPLICATION_SENT_TO_WARD_OFFICER");
      tempStatues?.push("APPLICATION_VERIFICATION_COMPLETED");
      tempStatues?.push("LOI_GENERATED");
      tempStatues?.push("PAYEMENT_SUCCESSFUL");
      tempStatues?.push("LICENSE_ISSUED");
      tempStatues?.push("I_CARD_ISSUED");
    }

    // body
    const body = {
      applicationStatuses: tempStatues,
    };

    console.log("applicationStatuses", body)

    if (
      true
      // tempStatues != null &&
      // tempStatues != undefined &&
      // tempStatues?.length != 0
    ) {
      setValue("loadderState", true);
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            whichOne: whichOne,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            if (r?.data != null && r?.data != undefined) {
              console.log("rdsfdsfdsf", r?.data)
              setValue("loadderState", true);
              finaDataFilter(r?.data);
            }
          }
        })
        .catch((error) => {
          setValue("loadderState", false);
          callCatchMethod(error, language);
        });
    } else {
      setValue("loadderState", false);
    }
  };

  const finaDataFilter = (tableData) => {
    if (
      tableData?.length >= 1 &&
      tableData != null &&
      tableData != undefined &&
      tableData != ""
    ) {
      const finalData = tableData?.sort((a, b) => b?.id - a?.id)?.map((data, index) => {
        console.log("Data34234", data)
        return {
          ...data,
          srNo: index + 1,
          applicantName: data?.applicantFullNameEng,
          applicantNameMr: data?.applicantFullNameMr,
          applicationDate1:
            moment(data?.applicationDate).format("DD-MM-YYYY") != "Invalid date"
              ? moment(data?.applicationDate).format("DD-MM-YYYY")
              : "-",
        };
      });

      setFinalTableData(finalData);
      setValue("loadderState", false);
    } else {
      setFinalTableData([]);
      setValue("loadderState", false);
    }
  };

  // onSubmit - mainForm
  const onSubmitForm = (data) => {
  };

  const getAuthorities = () => {
    console.log("user09=-=-=-=-=-=-=-=-", selectedMenuFromDrawer, user?.menus)
    let authority = user?.menus?.find((r) => {
      if (
        r?.id == selectedMenuFromDrawer ||
        r?.id == "200" ||
        r?.id == "276"
      ) {
        return r;
      }
    })?.roles;
    console.log("authority_Sachin", authority)
    setAuthority(authority);
  }

  const gatPramukhVerificationButton = (data, authority) => {

    const finalData = {
      serviceId: data?.serviceId,
      id: data?.id,
      clickedButtonAuthority: authority,
    }

    reset(finalData);













    // console.log("gatPramukhVerificationButton", data)
    // const finalData = {
    //   ...data,
    //   serviceName: data?.serviceId,
    //   serviceId: data?.serviceId,
    // };
    // reset(finalData);
    // setApplicationData(data);
    // setHardCodeAuthority("DEPT_CLERK_VERIFICATION");
    // setSiteVisitPreviewButtonInputState(false);
    // verificationOpne();
  }


  //! ================================================> useEffect

  useEffect(() => {
    getAuthorities();
  }, [])

  useEffect(() => {
    const authorityCount = authority != null && authority != undefined && authority != "" && authority.length >= 1;
    if (authorityCount) {
      console.log("count++++", i);
      setI((prevI) => prevI + 1)
      getPropertyTaxDashboardGetAll();
    }
  }, [authority])


  //! ======================================== > View <==================================
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div>
          <Paper elevation={5} className={styles.paper} component={Box}>
            {/** Dashboard Card  */}
            <div>
              <Paper
                className={styles.hearderPaper}
                component={Box}
                squar="true"
                elevation={5}
              >
                <Grid container>
                  {/** Applications Tabs */}
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className={styles.DashBoardHeader}>
                      {/* {<FormattedLabel id="hmsDashboard" />} */}
                      {language == "en" ? "Property Tax Dashboard" : "मालमत्ता कर डॅशबोर्ड"}
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Paper
                      className={styles.cardPaper}
                      squar="true"
                      component={Box}
                      elevation={5}
                    >
                      <div className={styles.test}>
                        <div className={styles.Approved}>
                          {/** Total Application */}
                          <div>
                            <Button
                              className={styles.Button1111}
                              onClick={() => {
                                // setWhichOne("TOTAL");
                              }}
                            >
                              <div className={styles.oneApplication}>
                                <div
                                  className={styles.HeaderIconStartText}
                                >
                                  <PeopleIcon color="secondary" />
                                </div>
                                <div
                                  className={styles.HeaderIconMiddleText}
                                >
                                  {/* {<FormattedLabel id="totalApplication" />} */}
                                  {language == "en" ? "Total Application" : "एकूण अर्ज"}
                                </div>
                                <div
                                  className={`${styles.HeaderIconEndText} ${styles.TotalApplicationColor}`}
                                >
                                  {language == "en" ? "Count" : "मोजा"}
                                </div>
                              </div>
                            </Button>
                          </div>
                          <div className={styles.Approved1}>
                            {/** Divider */}
                            <Divider
                              className={styles.Divider}
                              orientation="vertical"
                              variant="middle"
                              flexItem
                            />
                          </div>
                        </div>
                        <div className={styles.Approved}>
                          {/** Approved Application */}
                          <div>
                            <Button
                              onClick={() => {
                                // setWhichOne("APPROVED");
                              }}
                              className={styles.Button1111}
                            >
                              <div className={styles.oneApplication}>
                                <div
                                  className={styles.HeaderIconStartText}
                                >
                                  <ThumbUpAltIcon color="success" />
                                </div>

                                <div
                                  className={styles.HeaderIconMiddleText}
                                >
                                  {language == "en"
                                    ? "Approved Application"
                                    : "मंजूर अर्ज"}
                                </div>
                                <div
                                  className={`${styles.HeaderIconEndText} ${styles.ApprovedApplicationColor}`}
                                >
                                  {/* {approvedApplicationCount} */}
                                </div>
                              </div>
                            </Button>
                          </div>
                          {/** Vertical Line */}
                          <div className={styles.Approved1}>
                            <Divider
                              className={styles.Divider}
                              orientation="vertical"
                              variant="middle"
                              flexItem
                            />
                          </div>
                        </div>
                        <div className={styles.Approved}>
                          {/** Pending Applications */}
                          <div>
                            <Button
                              className={styles.Button1111}
                              onClick={() => {
                                // setWhichOne("INCOMING");
                              }}
                            >
                              <div className={styles.oneApplication}>
                                <div
                                  className={styles.HeaderIconStartText}
                                >
                                  <PendingActionsIcon color="warning" />
                                </div>
                                <div
                                  className={styles.HeaderIconMiddleText}
                                >
                                  {language == "en"
                                    ? "Pending Application"
                                    : "प्रलंबित अर्ज"}
                                </div>
                                <div
                                  className={`${styles.HeaderIconEndText} ${styles.PendingApplicationColor}`}
                                >
                                  {/* {pendingApplicationCount} */}
                                </div>
                              </div>
                            </Button>
                          </div>
                          {/** Vertical Line */}
                          <div className={styles.Approved1}>
                            <Divider
                              className={styles.Divider}
                              orientation="vertical"
                              variant="middle"
                              flexItem
                            />
                          </div>
                        </div>
                        <div className={styles.Approved}>
                          {/** Rejected Application */}
                          <div>
                            <Button
                              className={styles.Button1111}
                              onClick={() => {
                                // setWhichOne("REVERT");
                              }}
                            >
                              <div className={styles.oneApplication}>
                                <div
                                  className={styles.HeaderIconStartText}
                                >
                                  <CancelIcon color="error" />
                                </div>
                                <div
                                  className={styles.HeaderIconMiddleText}
                                >
                                  {language == "en"
                                    ? "Rejected Application"
                                    : "नाकारलेले अर्ज"}
                                </div>
                                <div
                                  className={`${styles.HeaderIconEndText} ${styles.RejectedApplicationColor}`}
                                >
                                  {/* {rejectedApplicationCount} */}
                                </div>
                              </div>
                            </Button>
                          </div>
                          {/** Vertical Line */}
                          <div className={styles.Approved1}>
                            <Divider
                              className={styles.Divider}
                              orientation="vertical"
                              variant="middle"
                              flexItem
                            />
                          </div>
                        </div>
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {/** DashBoard Table OK  */}
                <DataGrid
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      printOptions: { disableToolbarButton: true },
                      csvOptions: { disableToolbarButton: true },
                    },
                  }}
                  components={{ Toolbar: GridToolbar }}
                  sx={{
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
                  density="standard"
                  autoHeight={true}
                  getRowId={(row) => row.srNo}
                  rows={
                    finalTableData != undefined && finalTableData != null
                      ? finalTableData
                      : []
                  }
                  columns={columns}
                  pageSize={10}
                />
                {/** Verification Component */}
                <VerificationAppplicationDetails />
              </form>
            </FormProvider>
          </Paper>
        </div>
      )}
    </>
  )
}

export default Index
