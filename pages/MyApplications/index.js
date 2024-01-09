import { Payment, Pets } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import urls from "../../URLS/urls";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DraftsIcon from "@mui/icons-material/Drafts";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import { useForm } from "react-hook-form";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
const MyApplications = () => {
  const [dataSource, setDataSource] = useState([]);
  const [dataTotable, setDataToTable] = useState(null);
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  const [serviceList, setServiceList] = useState([]);
  const [rtiStatus, setRTIStatus] = useState([]);
  const [bsupStatus, setBSUPStatus] = useState([]);
  const [slumStatus, setSlumStatus] = useState([]);
  const [gmStatus, setGmStatus] = useState([]);
  const [newRole, setNewRole] = useState();
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const logedInUser = localStorage.getItem("loggedInUser");
  const [loading, setLoading] = useState(false);
  const headers = { Authorization: `Bearer ${user?.token}` };

  //  getServiceName
  const getServiceName = async () => {
    await axios

      .get(`${urls.CFCURL}/master/service/getAllServices`, {
        headers: headers,
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // getMyApplications
  const getMyApplications = async (
    _pageNo = 0,
    _pageSize = 10,
    _sortBy = "applicationDate",
    _sortDir = "Desc"
  ) => {
    setLoading(true);

    axios
      .get(
        `${urls.CFCURL}/transaction/citizen/myApplications?citizenId=${user?.id}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setDataToTable(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
      });
  };

  const setStausFilter = (statusId, applicationUniqueId) => {
    console.log("service id ", applicationUniqueId);
    if (applicationUniqueId === 17) {
      return language === "en"
        ? rtiStatus &&
            rtiStatus.find((obj) => obj.status === Number(statusId))?.statusTxt
        : rtiStatus &&
            rtiStatus.find((obj) => obj.status === Number(statusId))
              ?.statusTxtMr;
    } else if (applicationUniqueId === 23) {
      return language === "en"
        ? bsupStatus &&
            bsupStatus.find((obj) => obj.status === Number(statusId))?.statusTxt
        : bsupStatus &&
            bsupStatus.find((obj) => obj.status === Number(statusId))
              ?.statusTxtMr;
    } else if (applicationUniqueId === 18) {
      return language === "en"
        ? slumStatus &&
            slumStatus.find((obj) => obj.status === Number(statusId))?.statusTxt
        : slumStatus &&
            slumStatus.find((obj) => obj.status === Number(statusId))
              ?.statusTxtMr;
    } else if (applicationUniqueId == 9) {
      return language === "en"
        ? gmStatus &&
            gmStatus.find((obj) => obj.id === Number(statusId))?.statusTxt
        : gmStatus &&
            gmStatus.find((obj) => obj.id === Number(statusId))?.statusTxtMr;
    } else {
      return statusId;
    }
  };

  const getBsupStatus = () => {
    axios
      .get(`${urls.BSUPURL}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setBSUPStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      });
  };

  const getRTIStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setRTIStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      });
  };

  const getSlumStatus = () => {
    axios
      .get(`${urls.SLUMURL}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setSlumStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      });
  };

  const getGMStatus = () => {
    axios
      .get(`${urls.GM}/complaintStatusMaster/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setGmStatus(
          res.data?.complaintStatusMasterList?.map((r, i) => ({
            id: r.id,
            statusTxt: r.complaintStatus,
            statusTxtMr: r.complaintStatusMr,
            status: r.status,
          }))
        );
      });
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: language === "en" ? "Sr.No" : "अ.क्र",
      flex: 1,
      pinnable: false,
      minWidth: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "serviceName" : "serviceNameMr",
      headerName: language === "en" ? "Service Name" : "सेवेचे नाव",
      flex: 1,
      minWidth: 450,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: language === "en" ? "Application Number" : "अर्ज क्रमांक",
      flex: 1,
      minWidth: 300,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: language === "en" ? "Application Date" : "अर्जाचा दिनांक",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "applicationStatus",
      headerName: language === "en" ? "Status" : "स्थिती",
      minWidth: 500,
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "actions",
      headerName: language === "en" ? "Actions" : "कृती",
      minWidth: 1100,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {/* Fire Brigade Start */}
            {params?.row?.applicationUniqueId == 8 && (
              <>
                <Stack direction="row">
                  {params?.row?.applicationStatus === "DRAFT" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 76) {
                            router.push({
                              pathname:
                                "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
                              query: {
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "Edit",
                                disabled: false,
                              },
                            });
                          }
                        }}
                      >
                        <Tooltip
                          title={language === "en" ? "DRAFT" : "अर्ज पाहा"}
                        >
                          <Button color="primary">
                            <RemoveRedEyeIcon />
                          </Button>
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "APPLICATION_CREATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 76) {
                            router.push({
                              pathname:
                                "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
                              query: {
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"
                          }
                        >
                          <Button color="primary">
                            <RemoveRedEyeIcon />
                          </Button>
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "APPLICATION_CREATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/FireBrigadeSystem/prints/acknowledgmentReceiptmarathi",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "View ACKNOWLEDGMENT"
                            : "पोच पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {/* {params?.row?.applicationStatus === "PAYEMENT_SUCCESSFUL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/FireBrigadeSystem/prints/provisionalFireNOC",
                            query: {
                              ...params.row,
                              id: params.row.id,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "150px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "Provisional NOC" : "NOC"}
                        </Button>
                      </IconButton>
                    </div>
                  )} */}

                  {(params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" ||
                    params?.row?.applicationStatus ===
                      "APPOINTMENT_RESCHEDULED") && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW APPOINTMENT LETTER"
                            : "नियुक्ती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {/* {params?.row?.applicationStatus === "LOI_GENERATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW LOI"
                            : "स्वीकृती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )} */}

                  {params?.row?.applicationStatus == "LOI_GENERATED" && (
                    <IconButton>
                      <Button
                        // endIcon={<MoneyIcon />}
                        sx={{
                          backgroundColor: "#4386B2",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#4386B2",
                            color: "white",
                          },
                        }}
                        variant="contained"
                        size="small"
                        onClick={() => {
                          // setApplicationData(record.row);
                          // reset(record.row);
                          // setValue("serviceName", record.row.serviceId);
                          // loiCollectionOpen();
                          router.push({
                            pathname:
                              // "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny",
                              "/FireBrigadeSystem/transactions/provisionalBuildingNoc/loiCollectionComponent",
                            query: {
                              serviceId: params?.row?.serviceId,
                              // data: params?.row,
                              // btnSaveText: "Update",
                              pageMode: "LoiCollection",
                              ...params?.row,
                              // slipHandedOverTo: record.slipHandedOverTo,
                            },
                          });
                        }}
                      >
                        Payment Collection
                      </Button>
                    </IconButton>
                  )}

                  {params?.row?.applicationStatus ===
                    "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                                serviceId: params.row.serviceId,
                                id: params.row.id,
                              },
                            });
                          } else if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/Receipts/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "CERTIFICATE_ISSUED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if ([10, 11, 12].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/marriageCertificateNew",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                                // ...params.row,
                              },
                            });
                          }
                          // else if (params.row.serviceId == 12) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/marriageCertificate",
                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // } else if (params.row.serviceId == 11) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/marriageCertificate",
                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // }
                          else if (
                            [14, 15, 67].includes(params.row.serviceId)
                          ) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/boardcertificateui",

                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                                // ...params.row,
                              },
                            });
                          }
                          // else if (params.row.serviceId == 15) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/boardcertificateui",

                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // } else if (params.row.serviceId == 14) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/boardcertificateui",

                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW CERTIFICATE"
                            : "प्रमाणपत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {[
                    "SR_CLERK_SENT_BACK_TO_CITIZEN",
                    "APPLICATION_SENT_BACK_CITIZEN",
                  ].includes(params?.row?.applicationStatus) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",
                            query: {
                              ...params.row,
                              pageMode: "Edit",
                              // disabled: true,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "180px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "EDIT APPLICATION"
                            : "त्रुटी करा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "./common/masters/feedbackAndRating",
                            query: {
                              showData: JSON.stringify(params.row),
                              user: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Feedback & Rating"
                            : "अभिप्राय आणि मानांकन श्रेणी"}
                        </Button>
                      </IconButton>
                    </div>
                  }
                </Stack>
              </>
            )}
            {/* Fire Brigade End */}

            {/* Marriage Registration Start */}
            {params?.row?.applicationUniqueId == 2 && (
              <>
                <Stack direction="row">
                  <div
                    style={{ display: "flex", flexDirection: "row", gap: 10 }}
                  >
                    {params.row.serviceId == 10 && (
                      <>
                        {/** Draft*/}
                        {/* {params.row.applicationStatus == "DRAFT" && (
                          <>
                            <Button
                              style={{
                                height: "30px",
                                width: "100px",
                              }}
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                let url;

                                // issuance
                                if (params?.row?.serviceId == 10) {
                                  localStorage.setItem(
                                    "issuanceOfHawkerLicenseId",
                                    params?.row?.id,
                                  );
                                  url = `/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration`;
                                }

                                localStorage.setItem("Draft", "Draft");
                                router.push(url);
                              }}
                            >
                              Draft
                            </Button>
                          </>
                        )} */}

                        {params.row.applicationStatus == "DRAFT" ? (
                          <Button
                            style={{
                              height: "30px",
                              width: "90px",
                            }}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              router.push({
                                pathname: `/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration`,
                                query: {
                                  // disabled: false,
                                  ...params.row,
                                  pageMode: "Edit",
                                  draftId: params?.row?.id,
                                },
                              });
                            }}
                          >
                            Draft
                          </Button>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </div>
                  {![
                    "CERTIFICATE_ISSUED",
                    "CERTIFICATE_GENERATED",
                    "PAYEMENT_SUCCESSFULL",
                  ].includes(params?.row?.applicationStatus) && (
                    // {params?.row?.applicationStatus != "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 10) {
                            //  new marriage registration
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            //  marriage board registration
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                // pageMode: "View",
                                disabled: true,
                                // role: 'DOCUMENT_CHECKLIST',
                                pageHeader: "View Application",
                                pageMode: "Check",
                                pageHeaderMr: "अर्ज पहा",
                              },
                            });
                          } else if (params.row.serviceId == 11) {
                            // reissuance of marriage certificate

                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            // renewal of marriage board certificate

                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/citizen/modMarriageCertificate",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            // modification of marriage certificate
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            // modification of marriage certificate
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/citizen/ModBoardRegistration",
                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                                viewDocs: true,
                              },
                            });
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"
                          }
                        >
                          <Button
                            style={
                              {
                                // height: "30px",
                                // width: "200px",
                              }
                            }
                            // variant="contained"
                            color="primary"
                          >
                            <RemoveRedEyeIcon />
                            {/* {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"} */}
                          </Button>
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus !== "DRAFT" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/Receipts/acknowledgmentReceiptmarathi",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "View ACKNOWLEDGMENT"
                            : "पोच पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params.row.serviceId == 14 &&
                    params?.row?.applicationStatus ===
                      "APPLICATION_CREATED" && (
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/PaymentCollection",
                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "Pay" : "पैसे भरा"}
                        </Button>
                      </IconButton>
                    )}

                  {params.row.serviceId == 11 &&
                    params?.row?.applicationStatus ===
                      "APPLICATION_CREATED" && (
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/PaymentCollection",
                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "Pay" : "पैसे भरा"}
                        </Button>
                      </IconButton>
                    )}
                  {params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "220px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW APPOINTMENT LETTER"
                            : "नियुक्ती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/citizen/printForm",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "130px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "PRINT FORM" : "प्रत काढा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {["APPLICATION_CREATED"].includes(
                    params?.row?.applicationStatus &&
                      (params.row.serviceId == 67 ||
                        params.row.serviceId == 15 ||
                        params.row.serviceId == 14)
                  ) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardForm",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardForm",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardForm",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "Print Form" : "प्रिंट फॉर्म"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["APPLICATION_REJECTED"].includes(
                    params?.row?.applicationStatus
                  ) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardRejectionNote",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardRejectionNote",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardRejectionNote",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Rejection Note"
                            : "नकार देणारा आदेश"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["LOI_GENERATED"].includes(
                    params?.row?.applicationStatus
                  ) && (
                    <>
                      <>
                        <div className={styles.buttonRow}>
                          <IconButton
                            onClick={() => {
                              if (params.row.serviceId == 10) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 67) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 15) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 12) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              }
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW LOI"
                                : "स्वीकृती पत्र पाहा"}
                            </Button>
                          </IconButton>
                        </div>
                      </>

                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() => {
                            if (params.row.serviceId == 10) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 67) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 15) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 12) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 11) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 14) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            }
                          }}
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "200px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en" ? "Pay" : "पैसे भरा"}
                          </Button>
                        </IconButton>
                      </div>
                    </>
                  )}

                  {params?.row?.applicationStatus ===
                    "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                // ...params.row,
                                serviceId: params.row.serviceId,
                                id: params.row.id,
                              },
                            });
                          } else if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["CERTIFICATE_ISSUED", "CERTIFICATE_GENERATED"].includes(
                    params?.row?.applicationStatus
                  ) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if ([10, 11, 12].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/marriageCertificateNew",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                              },
                            });
                          } else if ([15, 67].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/boardcertificateui",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                              },
                            });
                          } else if ([14].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/boardcertificateui",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                                certiMode: "renew",
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW CERTIFICATE"
                            : "प्रमाणपत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {((![11, 14].includes(params?.row?.serviceId) &&
                    params?.row?.applicationStatus ===
                      "SR_CLERK_SENT_BACK_TO_CITIZEN") ||
                    params?.row?.applicationStatus ===
                      "APPLICATION_SENT_BACK_CITIZEN") && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                draftId: Number(params.row.id),
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/citizen/modMarriageCertificate",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/citizen/ModBoardRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "180px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "EDIT APPLICATION"
                            : "त्रुटी करा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus != "DRAFT" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "./common/masters/feedbackAndRating",
                            query: {
                              showData: JSON.stringify(params.row),
                              user: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Feedback & Rating"
                            : "अभिप्राय आणि मानांकन श्रेणी"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                </Stack>
              </>
            )}
            {/* Marriage Registration End */}

            {/* VMS Start */}
            {params?.row?.applicationUniqueId == 12 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {params.row.serviceId == 112 && (
                  <>
                    {/* <Button
                      variant='contained'
                      onClick={() => {
                        router.push({
                          pathname: `/veterinaryManagementSystem/transactions/petLicense/application/view`,
                          // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                          query: { id: params.row.id, pageMode: 'view' },
                        })
                      }}
                    >
                      View Application
                    </Button> */}

                    {params.row.applicationStatus === "Reassigned by Clerk" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/petLicense/application/view`,
                            query: { id: params.row.id, pageMode: "edit" },
                          });
                        }}
                      >
                        Edit Application
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/petLicense/application/view`,
                            // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                            query: { id: params.row.id, pageMode: "view" },
                          });
                        }}
                      >
                        {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "License Generated" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/petLicense/petLicense`,
                            query: { id: params.row.id },
                          });
                        }}
                        endIcon={<Pets />}
                      >
                        {language === "en" ? "View License" : "परवाना पहा"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "Approved by HOD" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/petLicense/paymentGateway`,
                            query: { id: params.row.id, amount: 75 },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                  </>
                )}
                {params.row.serviceId == 115 && (
                  <>
                    {/* <Button
                      variant='contained'
                      onClick={() => {
                        router.push({
                          pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
                          // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                          query: { id: params.row.id, pageMode: "view" },
                        });
                      }}>
                      View Application
                    </Button> */}
                    {params.row.applicationStatus === "Reassigned by Clerk" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
                            query: { id: params.row.id, pageMode: "edit" },
                          });
                        }}
                      >
                        Edit Application
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
                            // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                            query: { id: params.row.id, pageMode: "view" },
                          });
                        }}
                      >
                        {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "License Generated" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/petLicense`,
                            query: { id: params.row.id },
                          });
                        }}
                        endIcon={<Pets />}
                      >
                        {language === "en" ? "View License" : "परवाना पहा"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "Approved by HOD" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/paymentGateway`,
                            query: { id: params.row.id, amount: 50 },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                  </>
                )}
                {params.row.serviceId == 128 && (
                  <>
                    {params.row.applicationStatus ==
                      "Application Submitted" && (
                      <Button
                        variant="contained"
                        onClick={() =>
                          router.push({
                            pathname:
                              "/veterinaryManagementSystem/transactions/petIncinerator/paymentGateway",
                            query: { id: params.row.id },
                          })
                        }
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                  </>
                )}
                {
                  <div className={styles.buttonRow}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: "./common/masters/feedbackAndRating",
                          query: {
                            showData: JSON.stringify(params.row),
                            user: "Citizen",
                          },
                        });
                      }}
                    >
                      <Button size="small" variant="contained" color="primary">
                        {language === "en"
                          ? "Feedback & Rating"
                          : "अभिप्राय आणि मानांकन श्रेणी"}
                      </Button>
                    </IconButton>
                  </div>
                }
              </div>
            )}
            {/* VMS End */}

            {/* Library Start */}
            {params?.row?.applicationUniqueId == 13 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {params.row.serviceId == 85 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push({
                          pathname: `/lms/transactions/newMembershipRegistration/citizen/newMembershipRegistration`,
                          // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                          // query: { id: params.row.id, pageMode: "view" },
                          query: {
                            disabled: true,
                            // ...record.row,
                            ...params.row,
                            // role: 'DOCUMENT_CHECKLIST',
                            // pageHeader: 'DOCUMENT CHECKLIST',
                            pageMode: "Check",
                            formMode: "View",
                            // pageHeaderMr: 'कागदपत्र तपासणी',
                          },
                        });
                      }}
                    >
                      {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push({
                          pathname: `/lms/transactions/newMembershipRegistration/acknowledgmentReceipt`,
                          query: {
                            id: params?.row?.applicationId,
                            applicantType: 1,
                          },
                        });
                      }}
                    >
                      {language === "en"
                        ? "VIEW ACKNOWLEDGE RECIEPT"
                        : "पोचपावती पहा"}
                    </Button>
                    {((params.row.applicationStatus == "LOI_GENERATED" &&
                      params?.row?.col2 === "L") ||
                      (["LOI_GENERATED", "I_CARD_ISSUE"].includes(
                        params?.row?.applicationStatus
                      ) &&
                        params?.row?.col2 === "C" &&
                        params?.row?.col3 > "0")) && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          // params?.row?.col2 === "C" means libraryType &&
                          // params?.row?.col3 > "0" means remaining months of payment of type C
                          let _doublePay =
                            params?.row?.applicationStatus === "I_CARD_ISSUE" &&
                            params?.row?.col2 === "C" &&
                            params?.row?.col3 > "0"
                              ? true
                              : false;
                          //
                          router.push({
                            pathname:
                              "/lms/transactions/newMembershipRegistration/scrutiny/PaymentCollection",
                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                              doublePay: _doublePay,
                              libraryType: params?.row?.col2,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                    {/* {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/newMembershipRegistration/scrutiny/PaymentCollection",
                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )} */}
                    {params.row.applicationStatus == "I_CARD_ISSUE" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/newMembershipRegistration/scrutiny/IdCardOfLibraryMember",

                            query: {
                              // ...record.row,
                              // ...params.row,
                              id: params.row.id,
                              // role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {/* <FormattedLabel id="makePayment" /> */}
                        Library Card
                      </Button>
                    )}
                    {params.row.applicationStatus ==
                      "APPLICATION_SEND_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/newMembershipRegistration/citizen/newMembershipRegistration",

                            query: {
                              // ...record.row,
                              // ...params.row,
                              id: params.row.id,
                              // role: "CASHIER",
                              pageMode: "Edit",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {language === "en" ? "EDIT APPLICATION" : "त्रुटी करा"}
                        {/* Library Card */}
                      </Button>
                    )}
                  </>
                )}

                {params.row.serviceId == 90 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push({
                          pathname: `/lms/transactions/renewMembership/scrutiny/viewMembership`,
                          query: {
                            disabled: true,
                            // ...record.row,
                            // ...params.row,
                            id: params.row.id,
                            // role: 'DOCUMENT_CHECKLIST',
                            // pageHeader: 'DOCUMENT CHECKLIST',
                            // pageMode: "Check",
                            // pageHeaderMr: 'कागदपत्र तपासणी',
                            side: true,
                          },
                        });
                      }}
                    >
                      {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                    </Button>
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/renewMembership/scrutiny/PaymentCollection",

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                    {params.row.applicationStatus == "I_CARD_ISSUE" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/renewMembership/scrutiny/IdCardOfLibraryMember",

                            query: {
                              // ...record.row,
                              // ...params.row,
                              id: params.row.id,
                              // role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {/* <FormattedLabel id="makePayment" /> */}
                        Library Card
                      </Button>
                    )}
                    {params.row.applicationStatus ==
                      "APPLICATION_SEND_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/renewMembership/citizen/",

                            query: {
                              // ...record.row,
                              // ...params.row,
                              id: params.row.id,
                              // role: "CASHIER",
                              pageMode: "Edit",
                              applicationSide: "Citizen",
                              side: true,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {language === "en" ? "EDIT APPLICATION" : "त्रुटी करा"}
                        {/* Library Card */}
                      </Button>
                    )}
                  </>
                )}
                {
                  <div className={styles.buttonRow}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: "./common/masters/feedbackAndRating",
                          query: {
                            showData: JSON.stringify(params.row),
                            user: "Citizen",
                          },
                        });
                      }}
                    >
                      <Button size="small" variant="contained" color="primary">
                        {language === "en"
                          ? "Feedback & Rating"
                          : "अभिप्राय आणि मानांकन श्रेणी"}
                      </Button>
                    </IconButton>
                  </div>
                }
              </div>
            )}
            {/* Library End */}

            {/** Sport */}
            {params?.row?.applicationUniqueId == 6 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {params.row.serviceId == 68 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        localStorage.setItem("id", params?.row?.id);
                        localStorage.setItem(
                          "applicationRevertedToCititizen",
                          "false"
                        );

                        // router.push(`/sportsPortal/transaction/swimmingPoolM/citizen`);
                        router.push({
                          pathname:
                            "/sportsPortal/transaction/groundBookingNew/citizen/citizenForm1",
                          query: {
                            // id: params.row.id,
                            applicationNumber: params.row.applicationNumber,
                            pageMode: "Add",
                          },
                        });
                      }}
                    >
                      {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                    </Button>
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push(
                            `/sportsPortal/transaction/groundBookingNew/Pay`
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        {/* Pay */}
                        {language === "en" ? "Pay" : "पैसे भरा"}
                      </Button>
                    )}
                    {params.row.applicationStatus ==
                      "APPLICATION_VERIFICATION_COMPLETED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push(
                            `/sportsPortal/transaction/groundBookingNew/Pay`
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        {/* Pay */}
                        {language === "en" ? "Pay" : "पैसे भरा"}
                      </Button>
                    )}
                    {/* Edit Button (Ground Button) */}

                    {params.row.applicationStatus ==
                      "APPLICATION_SENT_BACK_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          let url;

                          if (params?.row?.serviceId == 68) {
                            localStorage.setItem("id", params?.row?.id);
                            url = `/sportsPortal/transaction/groundBookingNew/citizen`;
                          }

                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "true"
                          );
                          // router.push(url);
                          router.push({
                            pathname: url,
                            query: {
                              ...params.row,
                              pageMode: "Edit",
                              id: params.row.applicationId,
                            },
                          });
                        }}
                      >
                        Edit Application
                      </Button>
                    )}
                    {params.row.applicationStatus ==
                      "SPORTS_OFFICER_VERIFICATION_COMPLETED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          let url;

                          if (params?.row?.serviceId == 68) {
                            localStorage.setItem("id", params?.row?.id);
                            url = `/sportsPortal/transaction/groundBookingNew/scrutiny/SanctionLetter/sanctionLetterc`;
                          }

                          router.push({
                            pathname: url,
                            query: {
                              ...params.row,

                              id: params.row.applicationId,
                            },
                          });
                        }}
                      >
                        {language === "en"
                          ? "Sanction Letter ISSUANCE"
                          : "मंजूरी पत्र जारी"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        //   localStorage.setItem("id", params?.row?.id);
                        //   router.push(`/sportsPortal/transaction/groundBookingNew/Pay`);

                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "false"
                          );
                          router.push({
                            pathname:
                              "/sportsPortal/transaction/groundBookingNew/scrutiny/SanctionLetter/sanctionLetterc",
                            query: {
                              // ...body,
                              role: "LICENSE_ISSUANCE",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {/* Sanction Letter ISSUANCE */}
                        {language === "en"
                          ? "Sanction Letter ISSUANCE"
                          : "मंजूरी पत्र जारी"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "APPLICATION_CREATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/sportsPortal/transaction/components/acknowledgmentReceiptmarathi`,
                            query: {
                              Id: params?.row?.applicationId,
                              serviceId: 68,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {/* View Acknowldgement */}
                        {language === "en"
                          ? "View ACKNOWLEDGMENT"
                          : "पोच पावती पाहा"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push({
                            pathname:
                              "/sportsPortal/transaction/groundBookingNew/scrutiny/ServiceChargeRecipt",
                            query: {
                              applicationId: params.row.applicationId,
                              // pageMode: "Add",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {/* RECEIPT */}
                        {language === "en" ? "RECEIPT" : "पावती"}
                      </Button>
                    )}
                  </>
                )}

                {params.row.serviceId == 35 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        localStorage.setItem("id", params?.row?.id);
                        localStorage.setItem(
                          "applicationRevertedToCititizen",
                          "false"
                        );
                        // router.push(`/sportsPortal/transaction/swimmingPoolM/citizen`);
                        router.push({
                          pathname:
                            "/sportsPortal/transaction/swimmingPoolM/citizen",
                          query: {
                            // id: params.row.id,
                            // pageMode: "Add",
                            pageMode: "MyApplication",
                          },
                        });
                      }}
                    >
                      {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                    </Button>

                    {params.row.applicationStatus ==
                      "APPLICATION_SENT_BACK_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          let url;

                          if (params?.row?.serviceId == 35) {
                            localStorage.setItem("id", params?.row?.id);
                            url = `/sportsPortal/transaction/swimmingPoolM/citizen`;
                          }

                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "true"
                          );
                          // router.push(url);
                          router.push({
                            pathname: url,
                            query: {
                              ...params.row,
                              pageMode: "Edit",
                              id: params.row.applicationId,
                            },
                          });
                        }}
                      >
                        Edit Application
                      </Button>
                    )}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "false"
                          );
                          router.push(
                            `/sportsPortal/transaction/swimmingPoolM/card`
                          );
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {/* View I-Card */}
                        {language === "en" ? "View I-Card" : "आय-कार्ड पहा"}
                      </Button>
                    )}
                    {(params.row.applicationStatus == "LOI_GENERATED" ||
                      params.row.applicationStatus == "APPLICATION_SUBMITTED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_VERIFICATION_COMPLETED") && (
                      // {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "false"
                          );
                          router.push(
                            `/sportsPortal/transaction/swimmingPoolM/Pay`
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        {/* Pay */}
                        {language === "en" ? "Pay" : "पैसे भरा"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "APPLICATION_CREATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/sportsPortal/transaction/components/acknowledgmentReceiptSwimming`,
                            query: {
                              Id: params?.row?.applicationId,
                              serviceId: 35,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {/* View Acknowldgement */}
                        {language === "en"
                          ? "View Acknowldgement"
                          : "पावती पहा"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push({
                            pathname:
                              "/sportsPortal/transaction/swimmingPoolM/scrutiny/ServiceChargeRecipt",
                            query: {
                              applicationId: params.row.applicationId,
                              // pageMode: "Add",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {/* RECEIPT */}
                        {language === "en" ? "RECEIPT" : "पावती"}
                      </Button>
                    )}
                    {/* {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          console.log("675675", params.row.id);
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem("applicationRevertedToCititizen", "false");

                          router.push({
                            pathname: "/sportsPortal/transaction/swimmingPoolM/LoiReceipt",
                            query: {
                              id: params.row.id,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        LOI Receipt
                      </Button>
                    )} */}

                    {/* {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: "/sportsPortal/transaction/groundBookingNew/scrutiny/PaymentCollection",

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )} */}
                  </>
                )}

                {params.row.serviceId == 36 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        localStorage.setItem("id", params?.row?.id);
                        localStorage.setItem(
                          "applicationRevertedToCititizen",
                          "false"
                        );

                        router.push({
                          pathname:
                            "/sportsPortal/transaction/gymBooking/citizenView",
                          query: {
                            // id: params.row.id,
                            pageMode: "MyApplication",
                          },
                        });
                      }}
                    >
                      {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                    </Button>

                    {params.row.applicationStatus ==
                      "APPLICATION_SENT_BACK_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          let url;

                          if (params?.row?.serviceId == 36) {
                            localStorage.setItem("id", params?.row?.id);
                            url = `/sportsPortal/transaction/gymBooking/citizenView`;
                          }

                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "true"
                          );
                          // router.push(url);
                          router.push({
                            pathname: url,
                            query: {
                              ...params.row,
                              pageMode: "Edit",
                              id: params.row.applicationId,
                            },
                          });
                        }}
                      >
                        Edit Application
                      </Button>
                    )}
                    {(params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" ||
                      params.row.applicationStatus ==
                        "VERIFICATION_COMPLETED_FOR_GOV") && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "false"
                          );
                          router.push(
                            `/sportsPortal/transaction/gymBooking/card`
                          );
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {/* View I-Card */}
                        {language === "en" ? "View I-Card" : "आय-कार्ड पहा"}
                      </Button>
                    )}
                    {(params.row.applicationStatus == "LOI_GENERATED" ||
                      params.row.applicationStatus == "APPLICATION_SUBMITTED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_VERIFICATION_COMPLETED") && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push(
                            `/sportsPortal/transaction/gymBooking/Pay`
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        {/* Pay */}
                        {language === "en" ? "Pay" : "पैसे भरा"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "APPLICATION_CREATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/sportsPortal/transaction/components/acknowledgmentReceiptgym`,
                            query: {
                              Id: params?.row?.applicationId,
                              serviceId: 36,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {/* View Acknowldgement */}
                        {language === "en"
                          ? "View ACKNOWLEDGMENT"
                          : "पोच पावती पाहा"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push({
                            pathname:
                              "/sportsPortal/transaction/gymBooking/scrutiny/ServiceChargeRecipt",
                            query: {
                              applicationId: params.row.applicationId,
                              // pageMode: "Add",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        RECEIPT
                      </Button>
                    )}
                    {/* {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          console.log("675675", params.row.id);
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem("applicationRevertedToCititizen", "false");

                          router.push({
                            pathname: "/sportsPortal/transaction/swimmingPoolM/LoiReceipt",
                            query: {
                              id: params.row.id,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        LOI Receipt
                      </Button>
                    )} */}

                    {/* {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: "/sportsPortal/transaction/groundBookingNew/scrutiny/PaymentCollection",

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )} */}
                  </>
                )}

                {params.row.serviceId == 29 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        localStorage.setItem("id", params?.row?.id);
                        localStorage.setItem(
                          "applicationRevertedToCititizen",
                          "false"
                        );

                        // router.push(`/sportsPortal/transaction/swimmingPoolM/citizen`);
                        router.push({
                          pathname:
                            "/sportsPortal/transaction/sportBooking/citizen",
                          query: {
                            // id: params.row.id,
                            pageMode: "MyApplication",
                          },
                        });
                      }}
                    >
                      {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                    </Button>

                    {(params.row.applicationStatus == "APPLICATION_SUBMITTED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_VERIFICATION_COMPLETED") && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push(
                            `/sportsPortal/transaction/sportBooking/PaymentCollection`
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        {/* Pay */}
                        {language === "en" ? "Pay" : "पैसे भरा"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "APPLICATION_CREATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/sportsPortal/transaction/components/acknowledgementSportsBooking`,
                            query: {
                              Id: params?.row?.applicationId,
                              serviceId: 29,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {/* View Acknowldgement */}
                        {language === "en"
                          ? "View ACKNOWLEDGMENT"
                          : "पोच पावती पाहा"}
                      </Button>
                    )}
                    {(params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" ||
                      params.row.applicationStatus ==
                        "VERIFICATION_COMPLETED_FOR_GOV") && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);

                          router.push(
                            `/sportsPortal/transaction/sportBooking/SanctionLetter/sanctionLetterc`
                          );
                          // router.push(`/sportsPortal/transaction/sportBooking/Pay`);
                        }}
                        endIcon={<Payment />}
                      >
                        {/* View Sanction Letter */}
                        {language === "en"
                          ? "View Sanction Letter"
                          : "मंजुरी पत्र पहा"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/sportsPortal/transaction/sportBooking/ServiceChargeRecipt",
                            query: {
                              applicationId: params?.row?.applicationId,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {/* RECEIPT */}
                        {language === "en" ? "RECEIPT" : "पावती"}
                      </Button>
                    )}
                    {/* {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: "/sportsPortal/transaction/groundBookingNew/scrutiny/PaymentCollection",

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )} */}
                  </>
                )}

                {params.row.serviceId == 32 && (
                  <>
                    {/* {params.row.applicationStatus == "APPLICATION_CREATED" && ( */}
                    {(params.row.applicationStatus == "APPLICATION_CREATED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_SUBMITTED") && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            localStorage.setItem("id", params?.row?.id);
                            localStorage.setItem(
                              "applicationRevertedToCititizen",
                              "false"
                            );
                            router.push({
                              pathname:
                                "/sportsPortal/transaction/swimmingPool/citizenView",
                              query: {
                                // id: params.row.id,
                                pageMode: "Add",
                                pageModeNew: "View",
                              },
                            });

                            // router.push(`/sportsPortal/transaction/swimmingPool/citizenView`);
                          }}
                        >
                          {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                        </Button>
                        {/* <Button
                          variant="contained"
                          onClick={() => {
                            localStorage.setItem("id", params?.row?.id);
                            console.log("9887676546", params?.row?.id);
                            // router.push(
                            //   `/sportsPortal/transaction/swimmingPool/PaymentCollection2`
                            // );
                            router.push({
                              pathname:
                                "/sportsPortal/transaction/swimmingPool/PaymentCollection",
                              query: {
                                // bookingTimeId: _body.bookingTimeId,
                                id: params?.row?.id,
                                serviceId: 29,
                              },
                            });
                          }}
                          endIcon={<Payment />}
                        >
                          PAY
                        </Button> */}
                      </>
                    )}

                    {params.row.applicationStatus ==
                      "APPLICATION_SENT_BACK_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          let url;

                          if (params?.row?.serviceId == 32) {
                            localStorage.setItem("id", params?.row?.id);
                            url = `/sportsPortal/transaction/swimmingPool/citizenView`;
                            // url = `/sportsPortal/transaction/swimmingPoolM/citizen`;
                          }

                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "true"
                          );
                          // router.push(url);
                          router.push({
                            pathname: url,
                            query: {
                              ...params.row,
                              pageMode: "Edit",
                              id: params.row.applicationId,
                            },
                          });
                        }}
                      >
                        Edit Application
                      </Button>
                    )}
                    {/* {params.row.applicationStatus ==
                      "APPLICATION_VERIFICATION_COMPLETED" ||
                      (params.row.applicationStatus ==
                        "APPLICATION_SUBMITTED" && ( */}
                    {(params.row.applicationStatus == "APPLICATION_SUBMITTED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_VERIFICATION_COMPLETED") && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            localStorage.setItem("id", params?.row?.id);
                            // router.push(
                            //   `/sportsPortal/transaction/swimmingPool/PaymentCollection2`
                            // );
                            router.push({
                              pathname:
                                "/sportsPortal/transaction/swimmingPool/PaymentCollection",
                              query: {
                                // bookingTimeId: _body.bookingTimeId,
                                id: params?.row?.id,
                                serviceId: 29,
                              },
                            });
                          }}
                          endIcon={<Payment />}
                        >
                          {/* PAY */}
                          {language === "en" ? "Pay" : "पैसे भरा"}
                        </Button>
                      </>
                    )}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push({
                            pathname:
                              "/sportsPortal/transaction/swimmingPool/ServiceChargeRecipt",
                            query: {
                              applicationId: params.row.id,
                              // pageMode: "Add",
                            },
                          });

                          // router.push(
                          //   "/sportsPortal/transaction/swimmingPool/ServiceChargeRecipt"
                          // );
                          // router.push(`/sportsPortal/transaction/sportBooking/Pay`);
                        }}
                        // onClick={() => {
                        //   router.push({
                        //     pathname:
                        //       "/sportsPortal/transaction/swimmingPool/ServiceChargeRecipt",

                        //   });
                        // }}
                        endIcon={<Payment />}
                      >
                        {/* RECEIPT */}
                        {language === "en" ? "RECEIPT" : "पावती"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "APPLICATION_CREATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/sportsPortal/transaction/components/acknowledgmentReceiptSwimmingDaily`,
                            query: {
                              id: params?.row?.applicationId,
                              serviceId: 32,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {/* View Acknowldgement */}
                        {language === "en"
                          ? "View Acknowldgement"
                          : "पावती पहा"}
                      </Button>
                    )}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
                      params.row.serviceId == 32 && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            router.push({
                              pathname: `/sportsPortal/transaction/swimmingPoolM/card`,
                              query: {
                                id: params?.row?.applicationId,
                                serviceId: 32,
                              },
                            });
                          }}
                          endIcon={<VisibilityIcon />}
                        >
                          {/* View ICard */}
                          {language === "en" ? "I-Card" : "ओळखपत्र"}
                        </Button>
                      )}
                  </>
                )}
                {
                  <div className={styles.buttonRow}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: "./common/masters/feedbackAndRating",
                          query: {
                            showData: JSON.stringify(params.row),
                            user: "Citizen",
                          },
                        });
                      }}
                    >
                      <Button size="small" variant="contained" color="primary">
                        {language === "en"
                          ? "Feedback & Rating"
                          : "अभिप्राय आणि मानांकन श्रेणी"}
                      </Button>
                    </IconButton>
                  </div>
                }
              </div>
            )}
            {/** Sport End */}

            {/** Hawker */}
            {params?.row?.applicationUniqueId == 4 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {(params?.row?.serviceId == 24 ||
                  params?.row?.serviceId == 25 ||
                  params?.row?.serviceId == 26 ||
                  params?.row?.serviceId == 27) && (
                  <>
                    {/** Draft*/}
                    {params.row.applicationStatus == "DRAFT" && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            let url = ``;

                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id
                              );
                              url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id
                              );
                              url = `/streetVendorManagementSystem/transactions/renewalOfStreetVendorLicense`;
                            }
                            // cancellation
                            else if (params?.row?.serviceId == 27) {
                              localStorage.setItem(
                                "cancellationOfHawkerLicenseId",
                                params?.row?.id
                              );
                              url = `/streetVendorManagementSystem/transactions/cancellationOfStreetVendorLicense`;
                            }
                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id
                              );
                              url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                            }

                            localStorage.setItem("Draft", "Draft");
                            router.push(url);
                          }}
                        >
                          {language == "en" ? "Draft" : "ड्राफ्ट"}
                        </Button>
                      </>
                    )}

                    {/** View Application */}
                    {(params.row.applicationStatus == "APPLICATION_CREATED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_SENT_BACK_TO_DEPT_CLERK" ||
                      params.row.applicationStatus == "SITE_VISIT_COMPLETED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_SENT_BACK_TO_ADMIN_OFFICER" ||
                      params.row.applicationStatus ==
                        "APPLICATION_SENT_TO_WARD_OFFICER" ||
                      params.row.applicationStatus ==
                        "DEPT_CLERK_VERIFICATION_COMPLETED" ||
                      params.row.applicationStatus == "SITE_VISIT_SCHEDULED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_VERIFICATION_COMPLETED") && (
                      <>
                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            let url = ``;

                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id
                              );
                              url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id
                              );
                              url = `/streetVendorManagementSystem/transactions/renewalOfStreetVendorLicense`;
                            }
                            // cancellation
                            else if (params?.row?.serviceId == 27) {
                              localStorage.setItem(
                                "cancellationOfHawkerLicenseId",
                                params?.row?.id
                              );
                              url = `/streetVendorManagementSystem/transactions/cancellationOfStreetVendorLicense`;
                            }
                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id
                              );
                              url = `/streetVendorManagementSystem/transactions/transferOfStreetVendorLicense`;
                            }

                            localStorage.setItem(
                              "applicationRevertedToCititizen",
                              "true"
                            );
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseInputState",
                              "true"
                            );
                            router.push(url);
                          }}
                        >
                          {language == "en" ? "View Application" : "अर्ज पहा"}
                        </Button>

                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }
                            // cancellation
                            else if (params?.row?.serviceId == 27) {
                              localStorage.setItem(
                                "cancellationOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }
                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }

                            localStorage.setItem(
                              "applicationRevertedToCititizen",
                              "false"
                            );

                            router.push(
                              `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/AcknowledgementReceipt`
                            );
                          }}
                        >
                          {language == "en"
                            ? "Acknowledgement Receipt"
                            : "अर्जाची पावती"}
                        </Button>
                      </>
                    )}

                    {/** Edit Application */}
                    {params.row.applicationStatus ==
                      "APPLICATION_SENT_BACK_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          let url = ``;

                          // issuance
                          if (params?.row?.serviceId == 24) {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              params?.row?.id
                            );
                            url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                          }
                          // renewal
                          else if (params?.row?.serviceId == 25) {
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              params?.row?.id
                            );
                            url = `/streetVendorManagementSystem/transactions/renewalOfStreetVendorLicense`;
                          }
                          // cancellation
                          else if (params?.row?.serviceId == 27) {
                            localStorage.setItem(
                              "cancellationOfHawkerLicenseId",
                              params?.row?.id
                            );
                            url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                          }
                          // transfer
                          else if (params?.row?.serviceId == 26) {
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              params?.row?.id
                            );
                            url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                          }

                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "true"
                          );

                          router.push(url);
                        }}
                      >
                        {language == "en"
                          ? " Edit Application"
                          : "अर्ज संपादित करा"}
                      </Button>
                    )}

                    {/** LOI Recipte  */}
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          // issuance
                          if (params?.row?.serviceId == 24) {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }
                          // renewal
                          else if (params?.row?.serviceId == 25) {
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }
                          // cancellation
                          else if (params?.row?.serviceId == 27) {
                            localStorage.setItem(
                              "cancellationOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }
                          // transfer
                          else if (params?.row?.serviceId == 26) {
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }

                          router.push(
                            `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/LoiGenerationRecipt`
                          );
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {language == "en"
                          ? "Service Acceptance Letter"
                          : "सेवा स्वीकृती पत्र"}
                      </Button>
                    )}

                    {/** Payment Collection */}
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          // issuance
                          if (params?.row?.serviceId == 24) {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }
                          // renewal
                          else if (params?.row?.serviceId == 25) {
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }
                          // cancellation
                          else if (params?.row?.serviceId == 27) {
                            localStorage.setItem(
                              "cancellationOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }
                          // transfer
                          else if (params?.row?.serviceId == 26) {
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }

                          router.push({
                            pathname:
                              "/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollection",

                            query: {
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {language == "en"
                          ? "Payment Collection"
                          : "पेमेंट संकलन"}
                      </Button>
                    )}

                    {/** Payment Recipt */}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          // issuance
                          if (params?.row?.serviceId == 24) {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }
                          // renewal
                          else if (params?.row?.serviceId == 25) {
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }
                          // cancellation
                          else if (params?.row?.serviceId == 27) {
                            localStorage.setItem(
                              "cancellationOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }
                          // transfer
                          else if (params?.row?.serviceId == 26) {
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              params?.row?.id
                            );
                          }

                          router.push(
                            `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollectionRecipt`
                          );
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {language == "en"
                          ? "Payment Receipt"
                          : "पैसे भरल्याची पावती"}
                      </Button>
                    )}

                    {/** View Certificate */}
                    {(params.row.applicationStatus == "I_CARD_ISSUED" ||
                      params.row.applicationStatus == "CERTIFICATE_GENERATED" ||
                      params.row.applicationStatus == "I_CARD_GENERATED" ||
                      params.row.applicationStatus == "LICENSE_ISSUED") &&
                      (params?.row?.serviceId == 24 ||
                        params?.row?.serviceId == 25 ||
                        params?.row?.serviceId == 26) && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }

                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }

                            router.push(
                              `/streetVendorManagementSystem/components/Certificate`
                            );
                          }}
                          endIcon={<VisibilityIcon />}
                        >
                          {language == "en"
                            ? "View Certificate"
                            : "प्रमाणपत्र पहा"}
                        </Button>
                      )}

                    {/** View I Card */}
                    {(params.row.applicationStatus == "I_CARD_ISSUED" ||
                      params.row.applicationStatus == "I_CARD_GENERATED" ||
                      params.row.applicationStatus == "LICENSE_ISSUED") &&
                      (params?.row?.serviceId == 24 ||
                        params?.row?.serviceId == 25 ||
                        params?.row?.serviceId == 26) && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }

                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }

                            router.push(
                              `/streetVendorManagementSystem/components/IdentityCard`
                            );
                          }}
                          endIcon={<VisibilityIcon />}
                        >
                          {language == "en" ? "View ID Card" : "ओळखपत्र पहा"}
                        </Button>
                      )}

                    {/** view cancellation Letter */}
                    {params.row.applicationStatus == "LICENSE_CANCELLED" &&
                      params?.row?.serviceId == 27 && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            // cancellation
                            if (params?.row?.serviceId == 27) {
                              localStorage.setItem(
                                "cancellationOfHawkerLicenseId",
                                params?.row?.id
                              );
                            }
                            router.push(
                              `/streetVendorManagementSystem/transactions/cancellationOfStreetVendorLicense/LetterCancellationofHawkerLicense`
                            );
                          }}
                          endIcon={<VisibilityIcon />}
                        >
                          {" "}
                          {language == "en"
                            ? "cancel certificate"
                            : "प्रमाणपत्र रद्द करा"}
                        </Button>
                      )}
                    {params.row.applicationStatus != "DRAFT" && (
                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname: "./common/masters/feedbackAndRating",
                              query: {
                                showData: JSON.stringify(params.row),
                                user: "Citizen",
                              },
                            });
                          }}
                        >
                          <Button variant="contained" color="primary">
                            {language === "en"
                              ? "Feedback & Rating"
                              : "अभिप्राय आणि मानांकन श्रेणी"}
                          </Button>
                        </IconButton>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {/** Hawker End */}

            {/** Sky Sign Start */}
            {params?.row?.applicationUniqueId == 7 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {params.row.serviceId == 7 && (
                  <>
                    {params.row.applicationStatus == "APPLICATION_SUBMITTED" ||
                    params.row.applicationStatus == "APPROVE_BY_LI" ||
                    params.row.applicationStatus == "APPROVE_BY_OS" ||
                    params.row.applicationStatus == "APPOINTMENT_SCHEDULED" ||
                    params.row.applicationStatus == "SITE_VISITED" ||
                    params.row.applicationStatus == "APPROVE_BY_HOD" ||
                    params.row.applicationStatus == "LOI_GENERATED" ||
                    params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/transactions/components/ViewForm`,
                              // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                              // query: { id: params.row.id, pageMode: "view" },
                              query: {
                                disabled: true,
                                ...params.row,
                                pageMode: "Check",
                              },
                            });
                          }}
                        >
                          {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/report/acknowledgmentReceipt1`,
                              query: {
                                id: params.row.id,
                              },
                            });
                          }}
                        >
                          {language === "en"
                            ? "Acknowledgement Receipt"
                            : "पावती"}
                        </Button>
                      </>
                    ) : (
                      ""
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/LoiGenerationReciptmarathi`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 7,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {language === "en"
                          ? "Loi Receipt View"
                          : "Loi पावती पहा"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/PaymentCollection`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              role: "LOI_COLLECTION",
                              serviceId: 7,
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {language === "en" ? "Make Payment" : "पेमेंट करा"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/ServiceChargeRecipt`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 7,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        Payment Receipt
                      </Button>
                    )}

                    {params.row.applicationStatus == "LICENSE_GENRATED" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/report/businessCertificateReport`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        View Certificate
                      </Button>
                    ) : (
                      ""
                    )}

                    {params.row.applicationStatus == "DRAFT" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/`,
                            query: {
                              // disabled: false,
                              ...params.row,
                              pageMode: "Edit",
                            },
                          });
                        }}
                      >
                        Draft
                      </Button>
                    ) : (
                      ""
                    )}
                  </>
                )}
                {params.row.serviceId == 8 && (
                  <>
                    {params.row.applicationStatus == "APPLICATION_SUBMITTED" ||
                    params.row.applicationStatus == "APPROVE_BY_LI" ||
                    params.row.applicationStatus == "APPROVE_BY_OS" ||
                    params.row.applicationStatus == "APPOINTMENT_SCHEDULED" ||
                    params.row.applicationStatus == "SITE_VISITED" ||
                    params.row.applicationStatus == "APPROVE_BY_HOD" ||
                    params.row.applicationStatus == "LOI_GENERATED" ||
                    params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/transactions/components/ViewForm`,
                              // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                              // query: { id: params.row.id, pageMode: "view" },
                              query: {
                                disabled: true,
                                ...params.row,
                                pageMode: "Check",
                              },
                            });
                          }}
                        >
                          {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/report/acknowledgmentReceipt`,
                              query: {
                                id: params.row.id,
                              },
                            });
                          }}
                        >
                          {language === "en"
                            ? "Acknowledgement Receipt"
                            : "पावती"}
                        </Button>
                      </>
                    ) : (
                      ""
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfIndustry/LoiGenerationReciptmarathi`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 8,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {language === "en"
                          ? "Loi Receipt View"
                          : "Loi पावती पहा"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfIndustry/PaymentCollection`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              role: "LOI_COLLECTION",
                              serviceId: 8,
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {language === "en" ? "Make Payment" : "पेमेंट करा"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfIndustry/ServiceChargeRecipt`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 8,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        Payment Receipt
                      </Button>
                    )}

                    {params.row.applicationStatus == "LICENSE_GENRATED" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            // pathname: `/skySignLicense/report/industryCertificateReport`,
                            pathname: `/skySignLicense/report/industryFinalCertificate`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        View Certificate
                      </Button>
                    ) : (
                      ""
                    )}
                    {params.row.applicationStatus == "DRAFT" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfIndustry/`,
                            query: {
                              // disabled: false,
                              ...params.row,
                              pageMode: "Edit",
                            },
                          });
                        }}
                      >
                        Draft
                      </Button>
                    ) : (
                      ""
                    )}
                  </>
                )}
                {params.row.serviceId == 9 && (
                  <>
                    {params.row.applicationStatus == "APPLICATION_SUBMITTED" ||
                    params.row.applicationStatus == "APPROVE_BY_LI" ||
                    params.row.applicationStatus == "APPROVE_BY_OS" ||
                    params.row.applicationStatus == "APPOINTMENT_SCHEDULED" ||
                    params.row.applicationStatus == "SITE_VISITED" ||
                    params.row.applicationStatus == "APPROVE_BY_HOD" ||
                    params.row.applicationStatus == "LOI_GENERATED" ||
                    params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/transactions/components/ViewForm`,
                              // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                              // query: { id: params.row.id, pageMode: "view" },
                              query: {
                                disabled: true,
                                ...params.row,
                                pageMode: "Check",
                              },
                            });
                          }}
                        >
                          {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/report/acknowledgmentReceiptStore`,
                              query: {
                                id: params.row.id,
                              },
                            });
                          }}
                        >
                          {language === "en"
                            ? "Acknowledgement Receipt"
                            : "पावती"}
                        </Button>
                      </>
                    ) : (
                      ""
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceofStore/LoiGenerationReciptmarathi`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 9,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {language === "en"
                          ? "Loi Receipt View"
                          : "Loi पावती पहा"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceofStore/PaymentCollection`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              role: "LOI_COLLECTION",
                              serviceId: 9,
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {language === "en" ? "Make Payment" : "पेमेंट करा"}
                      </Button>
                    )}

                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceofStore/ServiceChargeRecipt`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 9,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        Payment Receipt
                      </Button>
                    )}

                    {params.row.applicationStatus == "LICENSE_GENRATED" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            // pathname: `/skySignLicense/report/storeCertificateReport`,
                            pathname: `/skySignLicense/report/storeFinalCertificate`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        View Certificate
                      </Button>
                    ) : (
                      ""
                    )}
                    {params.row.applicationStatus == "DRAFT" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceofStore/`,
                            query: {
                              // disabled: false,
                              ...params.row,
                              pageMode: "Edit",
                            },
                          });
                        }}
                      >
                        Draft
                      </Button>
                    ) : (
                      ""
                    )}
                  </>
                )}
                {params.row.applicationStatus != "DRAFT" && (
                  <div className={styles.buttonRow}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: "./common/masters/feedbackAndRating",
                          query: {
                            showData: JSON.stringify(params.row),
                            user: "Citizen",
                          },
                        });
                      }}
                    >
                      <Button size="small" variant="contained" color="primary">
                        {language === "en"
                          ? "Feedback & Rating"
                          : "अभिप्राय आणि मानांकन श्रेणी"}
                      </Button>
                    </IconButton>
                  </div>
                )}
              </div>
            )}
            {/** Sky Sign End */}

            {/* Public Auditorium Start*/}
            {params?.row?.applicationUniqueId == 16 && (
              <>
                <Stack direction="row">
                  {params?.row?.applicationStatus === "LOI_GENERATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "./PublicAuditorium/transaction/auditoriumBooking/PaymentCollection2",
                            query: {
                              data: JSON.stringify(params.row),
                              payment: "rent",
                              // ...params.row,
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "PAY" : "पेमेंट करा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus === "PAYMENT_SUCCESSFUL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "./PublicAuditorium/transaction/auditoriumBooking/bookedAcknowledgmentReceipt",
                            query: {
                              showData: JSON.stringify(params.row),
                              // ...params.row,
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Booking Order Copy"
                            : "बुकिंग आदेश प्रत"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus === "APPLICATION_DRAFT" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "./PublicAuditorium/transaction/auditoriumBooking/PaymentCollection2",
                            query: {
                              data: JSON.stringify(params.row),
                              payment: "deposit",
                              // ...params.row,
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "PAY DEPOSIT"
                            : "अनामत रक्कम भरा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus === "BILL_GENERATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "./PublicAuditorium/transaction/auditoriumBill/paymentCollection/PaymentCollection3",

                            query: {
                              data: JSON.stringify(params.row),
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Pay Extra Equipment Amount"
                            : "अतिरिक्त उपकरणे शुल्क भरा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus === "COMPLETED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "./PublicAuditorium/transaction/auditoriumBill/AuditoriumBillReceipt",

                            query: {
                              showData: JSON.stringify(params.row),
                              user: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Auditorium Bill Receipt"
                            : "प्रेक्षागृह / नाट्यगृह बिल पावती"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "./common/masters/feedbackAndRating",
                            query: {
                              showData: JSON.stringify(params.row),
                              user: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Feedback & Rating"
                            : "अभिप्राय आणि मानांकन श्रेणी"}
                        </Button>
                      </IconButton>
                    </div>
                  }
                </Stack>
              </>
            )}
            {/* Public Auditorium End*/}

            {/* Town Planning Start */}
            {params?.row?.applicationUniqueId == 3 && (
              <>
                <Stack direction="row">
                  {params?.row?.applicationStatus === "APPLICATION_CREATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 17) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/partPlan/citizen/partPlan",
                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 18) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/zoneCertificate/citizen/",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,

                                disabled: true,

                                pageHeader: "View Application",
                                pageMode: "View",
                                pageHeaderMr: "अर्ज पहा",
                              },
                            });
                          } else if (params.row.serviceId == 19) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/developmentPlanOpinion/citizen/developmentPlan",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 20) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/setBackCertificate/citizen",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 21) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/generationOfTDRFSINew/citizen",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"
                          }
                        >
                          <Button style={{}} color="primary">
                            <RemoveRedEyeIcon />
                          </Button>
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}
                  <div className={styles.buttonRow}>
                    <IconButton
                      onClick={() =>
                        router.push({
                          pathname:
                            "/townPlanning/Receipts/acknowledgmentReceiptmarathi",
                          query: {
                            ...params.row,
                          },
                        })
                      }
                    >
                      {!params?.row?.applicationStatus === "DRAFTED" && (
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "View ACKNOWLEDGMENT"
                            : "पोच पावती पाहा"}
                        </Button>
                      )}
                    </IconButton>
                  </div>

                  {params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW APPOINTMENT LETTER"
                            : "नियुक्ती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["LOI_GENERATED"].includes(
                    params?.row?.applicationStatus
                  ) && (
                    <>
                      <>
                        <div className={styles.buttonRow}>
                          <IconButton
                            onClick={() => {
                              if (params.row.serviceId == 10) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 67) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 15) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 12) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 20) {
                                router.push({
                                  pathname:
                                    "/townPlanning/transactions/setBackCertificate/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 18) {
                                router.push({
                                  pathname:
                                    "/townPlanning/transactions/zoneCertificate/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              }
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW LOI"
                                : "स्वीकृती पत्र पाहा"}
                            </Button>
                          </IconButton>
                        </div>
                      </>

                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() => {
                            if (params.row.serviceId == 10) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 67) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 15) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 12) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 11) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 14) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 20) {
                              router.push({
                                pathname:
                                  "/townPlanning/transactions/setBackCertificate/scrutiny/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            }
                          }}
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "200px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en" ? "Pay" : "पैसे भरा"}
                          </Button>
                        </IconButton>
                      </div>
                    </>
                  )}

                  {params?.row?.applicationStatus ===
                    "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                serviceId: params.row.serviceId,
                                id: params.row.id,
                              },
                            });
                          } else if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 20) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/setBackCertificate/scrutiny/ServiceChargeRecipt",
                              // "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 18) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/zoneCertificate/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["OUTPUT_VERIFIED"].includes(
                    params?.row?.applicationStatus
                  ) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if ([17].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/partPlan/scrutiny/partMapLetter",
                              // "/townPlanning/transactions/partPlan/scrutiny/partMapLetter",

                              query: {
                                pageMode: "View",
                                disabled: true,
                                applicationId: params.row.id,
                                // serviceId: record.row.serviceId,
                                serviceId: 20,
                                role: "OUTPUT_GENERATION",
                                pageHeader: "OUTPUT GENERATION",
                              },
                            });
                          }
                          if ([20].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/setBackCertificate/scrutiny/OutputGenrationLetter",
                              // "/townPlanning/transactions/partPlan/scrutiny/partMapLetter",

                              query: {
                                pageMode: "View",
                                disabled: true,
                                applicationId: params.row.id,
                                // serviceId: record.row.serviceId,
                                serviceId: 20,
                                role: "OUTPUT_GENERATION",
                                pageHeader: "OUTPUT GENERATION",
                              },
                            });
                          }
                          if ([18].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/zoneCertificate/scrutiny/OutputGenrationLetter",
                              // "/townPlanning/transactions/partPlan/scrutiny/partMapLetter",

                              query: {
                                pageMode: "View",
                                disabled: true,
                                applicationId: params.row.id,
                                // serviceId: record.row.serviceId,
                                serviceId: 18,
                                role: "OUTPUT_GENERATION",
                                pageHeader: "OUTPUT GENERATION",
                              },
                            });
                          } else if (
                            [14, 15, 67].includes(params.row.serviceId)
                          ) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/boardcertificateui",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW CERTIFICATE"
                            : "प्रमाणपत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {((![11, 14].includes(params?.row?.serviceId) &&
                    params?.row?.applicationStatus ===
                      "SR_CLERK_SENT_BACK_TO_CITIZEN") ||
                    params?.row?.applicationStatus ===
                      "APPLICATION_SENT_BACK_CITIZEN") && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/citizen/modMarriageCertificate",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/citizen/ModBoardRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "180px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "EDIT APPLICATION"
                            : "त्रुटी करा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params.row.applicationStatus == "DRAFTED" &&
                    params.row.serviceId == 21 && (
                      <Button
                        style={{
                          height: "30px",
                          width: "90px",
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          router.push({
                            pathname: `/townPlanning/transactions/generationOfTDRFSINew/citizen`,
                            query: {
                              // disabled: false,
                              ...params.row,
                              pageMode: "Edit",
                              draftId: params?.row?.id,
                            },
                          });
                        }}
                      >
                        DRAFT
                        {/* {language === "en"
                            ? "DRAFT"
                            : "प्रमाणपत्र पाहा"} */}
                      </Button>
                    )}
                  {params?.row?.applicationStatus === "OUTPUT_GENERATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 17) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/partPlan/scrutiny/partMapLetter",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 18) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/zoneCertificate/scrutiny/OutputGenrationLetter",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 20) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/setBackCertificate/scrutiny/OutputGenrationLetter",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "DOWNLOAD" : "डाउनलोड करा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus ===
                    "DOCUMENTS_REASSIGNED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 21) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/generationOfTDRFSINew/citizen/resubmitDocument",
                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "Edit",
                                disabled: true,
                              },
                            });
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            language === "en"
                              ? " RESUBMIT DOCUMENTS"
                              : "कागदपत्रे पुन्हा सबमिट करा"
                          }
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "200px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en"
                              ? " RESUBMIT DOCUMENTS"
                              : "कागदपत्रे पुन्हा सबमिट करा"}
                          </Button>
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}
                  {params.row.applicationStatus != "DRAFTED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "./common/masters/feedbackAndRating",
                            query: {
                              showData: JSON.stringify(params.row),
                              user: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Feedback & Rating"
                            : "अभिप्राय आणि मानांकन श्रेणी"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                </Stack>
              </>
            )}
            {/* Town Planning End */}

            {/* Road Excavation start */}
            {params?.row?.applicationUniqueId == 15 && (
              <>
                <Stack direction="row">
                  {params?.row?.applicationStatus === "APPLICATION_CREATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params?.row?.serviceId === 121) {
                            router.push({
                              pathname:
                                "/roadExcavation/transaction/roadExcevationForms/roadExcavationNocPermission",
                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else {
                            router.push({
                              pathname:
                                "/roadExcavation/transaction/roadExcavationMaintenance/viewFormJEMaintenance",
                              query: {
                                ...params.row,
                                id: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"
                          }
                        >
                          <Button style={{}} color="primary">
                            <RemoveRedEyeIcon />
                          </Button>
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}
                  {
                    params?.row?.applicationStatus === "NOC_GENRATED" && (
                      // (params?.row?.applicationStatus ===
                      //   "PAYEMENT_SUCCESSFUL" && (
                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() => {
                            if (params.row.serviceId == "121") {
                              router.push({
                                pathname:
                                  "/roadExcavation/transaction/documenstGeneration/NOC",
                                query: {
                                  id: params.row.id,
                                },
                              });
                            } else if (params.row.serviceId == "139") {
                              router.push({
                                pathname:
                                  "/roadExcavation/transaction/documenstGeneration/maintenanceNOC",
                                query: {
                                  id: params.row.id,
                                  serviceId: params.row.serviceId,
                                },
                              });
                            }
                          }}
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "200px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en" ? "NOC" : "एनओसी"}
                          </Button>
                        </IconButton>
                      </div>
                    )
                    // ))
                  }

                  {params?.row?.applicationStatus === "PAYEMENT_SUCCESSFUL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/roadExcavation/transaction/documenstGeneration/receipt",
                            query: {
                              id: params.row.id,
                              serviceId: params.row.serviceId,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {(params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" ||
                    params?.row?.applicationStatus ===
                      "APPOINTMENT_RESCHEDULED") && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/roadExcavation/transaction/documenstGeneration/appointmentRecipt",
                            query: {
                              ...params.row,
                              serviceId: params.row.serviceId,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Appointment RECEIPT"
                            : " साइट भेट पावती"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus ===
                    "APPROVE_BY_ADDITIONAL_COMMISSIONER" && (
                    <div className={styles.buttonRow}>
                      {/* <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              '/roadExcavation/transaction/roadExcevationForms/Fees',
                            // query: {
                            //   id: params.Row.id,
                            // },
                          })
                        }
                      > */}
                      {/* {console.log("params.Row.id",params?.row)}, */}
                      <Button
                        style={{
                          height: "30px",
                          width: "200px",
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (params.row.serviceId == "121") {
                            router.push({
                              pathname:
                                "/roadExcavation/transaction/roadExcevationForms/Fees",
                              query: {
                                id: params.row.id,
                                serviceId: params.row.serviceId,
                              },
                            });
                          } else if (params.row.serviceId == "139") {
                            router.push({
                              pathname:
                                "/roadExcavation/transaction/roadExcevationForms/maintenanceFees",
                              query: {
                                id: params.row.id,
                                serviceId: params.row.serviceId,
                              },
                            });
                          }
                        }}
                      >
                        {language === "en" ? "Pay" : "पैसे भरा"}
                      </Button>
                      {/* </IconButton> */}
                    </div>
                  )}
                  {(params?.row?.applicationStatus === "LOI_GENERATED" ||
                    params?.row?.applicationStatus ===
                      "APPROVE_BY_DEPUTY_ENGINEER" ||
                    params?.row?.applicationStatus ===
                      "APPROVE_BY_EXECUTIVE_ENGINEER" ||
                    params?.row?.applicationStatus ===
                      "APPROVE_BY_JOINT_CITY_ENGINEER" ||
                    params?.row?.applicationStatus ===
                      "APPROVE_BY_ADDITIONAL_COMMISSIONER") && (
                    <div className={styles.buttonRow}>
                      <Button
                        style={{
                          height: "30px",
                          width: "200px",
                          marginLeft: "20px",
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (params?.row?.serviceId === 121) {
                            router.push({
                              pathname:
                                "/roadExcavation/transaction/documenstGeneration/LOI",
                              query: {
                                id: params.row.id,
                              },
                            });
                          } else if (params?.row?.serviceId === 139) {
                            router.push({
                              pathname:
                                "/roadExcavation/transaction/documenstGeneration/maintenanceLOI",
                              query: {
                                id: params.row.id,
                                applicationNumber: params.row.applicationNumber,
                              },
                            });
                          }
                        }}
                      >
                        {language === "en" ? "Demand Note" : "मागणी नोंद"}
                      </Button>
                      {/* </IconButton> */}
                    </div>
                  )}

                  {params?.row?.applicationStatus ===
                    "REVERT_BY_JUNIOR_ENGINEER" && (
                    <div className={styles.buttonRow}>
                      <Button
                        style={{
                          height: "30px",
                          width: "100px",
                          marginLeft: "20px",
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          router.push({
                            pathname:
                              "/roadExcavation/transaction/roadExcevationForms/editForm",
                            query: {
                              id: params.row.id,
                            },
                          })
                        }
                      >
                        {/* <EditIcon style={{ color: "#556CD6" }} /> */}
                        {language == "en" ? "Edit" : "सुधारणे"}
                      </Button>
                    </div>
                  )}
                  {
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "./common/masters/feedbackAndRating",
                            query: {
                              showData: JSON.stringify(params.row),
                              user: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Feedback & Rating"
                            : "अभिप्राय आणि मानांकन श्रेणी"}
                        </Button>
                      </IconButton>
                    </div>
                  }
                </Stack>
              </>
            )}
            {/* Road Excavation end */}

            {/* { RTI applications} */}
            {params?.row?.applicationUniqueId === 17 && (
              <>
                {params?.row?.serviceId === 103 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" && (
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname:
                                "/RTIOnlineSystem/transactions/rtiApplication/ViewRTIApplication",
                              query: { id: params.row.id },
                            });
                          }}
                        >
                          <Tooltip
                            title={
                              language === "en"
                                ? "VIEW APPLICATION"
                                : "अर्ज पहा"
                            }
                          >
                            <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                          </Tooltip>
                        </IconButton>
                      )}

                      {params?.row?.statusId === "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/rtiApplication",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            {/* <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            > */}
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language == "en"
                                ? `GO TO APPLICATION FORM`
                                : "अर्ज फॉर्मवर जा"}
                            </Button>
                            {/* <DraftsIcon style={{ color: "#556CD6" }} /> */}
                            {/* </Tooltip> */}
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" &&
                        params?.row?.statusId != "2" && (
                          <>
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
                                  query: { id: params.row.applicationNumber },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language == "en"
                                    ? `Download Acknowldgement`
                                    : "पावती डाउनलोड करा"
                                }
                              >
                                <Button
                                  style={{
                                    height: "30px",
                                    width: "200px",
                                  }}
                                  variant="contained"
                                  color="primary"
                                >
                                  {language === "en"
                                    ? "VIEW ACKNOWLDGEMENT"
                                    : "पावती डाउनलोड करा"}
                                </Button>
                              </Tooltip>
                            </IconButton>
                            {params?.row?.col1 === false && (
                              <IconButton
                                onClick={() => {
                                  router.push({
                                    pathname:
                                      "/RTIOnlineSystem/transactions/receipt/serviceReceipt",
                                    query: { id: params.row.id, trnType: "ap" },
                                  });
                                }}
                              >
                                <Tooltip
                                  title={
                                    language == "en"
                                      ? `Download Payment Receipt`
                                      : "पेमेंट पावती डाउनलोड करा"
                                  }
                                >
                                  <Button
                                    style={{
                                      height: "30px",
                                      width: "230px",
                                    }}
                                    variant="contained"
                                    color="primary"
                                  >
                                    {language === "en"
                                      ? "DOWNLOAD PAYMENT RECEIPT"
                                      : "पेमेंट पावती डाउनलोड करा"}
                                  </Button>
                                </Tooltip>
                              </IconButton>
                            )}
                          </>
                        )}

                      {params?.row?.statusId === "4" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/acknowledgement/LoiGenerationRecipt",
                                query: { id: params.row.applicationNumber },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `View LOI` : "पावती पहा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en" ? `View LOI` : "पावती पहा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                      {params?.row?.statusId === "2" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/payment/PaymentCollection",
                                query: {
                                  id: params.row.applicationNumber,
                                  trnType: "ap",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `Make Payment` : "पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make Payment`
                                  : "पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.col2 && params?.row?.statusId != "4" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/receipt/serviceReceipt",
                                query: { id: params.row.id, trnType: "loi" },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `View LOI Receipt`
                                  : "LOI पावती पहा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `View LOI Receipt`
                                  : "LOI पावती पहा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </>
                )}
                {params?.row?.serviceId === 104 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" && (
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname:
                                "/RTIOnlineSystem/transactions/rtiAppeal/ViewRTIAppeal",
                              query: { id: params.row.applicationNumber },
                            });
                          }}
                        >
                          <Tooltip
                            title={
                              language === "en" ? "VIEW APPEAL" : "अर्ज पाहा"
                              // params?.row?.applicationUniqueId
                            }
                          >
                            <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                          </Tooltip>
                        </IconButton>
                      )}
                      {params?.row?.statusId === "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/rtiAppeal",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language == "en"
                                ? `GO TO APPLICATION FORM`
                                : "अर्ज फॉर्मवर जा"}
                            </Button>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "2" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/payment/PaymentCollection",
                                query: {
                                  id: params.row.applicationNumber,
                                  trnType: "apl",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `Make Payment` : "पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make Payment`
                                  : "पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" &&
                        params?.row?.statusId != "2" && (
                          <>
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                                  query: { id: params.row.applicationNumber },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language == "en"
                                    ? `Download Acknowldgement`
                                    : "पावती डाउनलोड करा"
                                }
                              >
                                <Button
                                  style={{
                                    height: "30px",
                                    width: "200px",
                                  }}
                                  variant="contained"
                                  color="primary"
                                >
                                  {language === "en"
                                    ? "VIEW ACKNOWLDGEMENT"
                                    : "पावती डाउनलोड करा"}
                                </Button>
                              </Tooltip>
                            </IconButton>

                            {params?.row?.col1 === false && (
                              <IconButton
                                onClick={() => {
                                  router.push({
                                    pathname:
                                      "/RTIOnlineSystem/transactions/receipt/serviceReceipt",
                                    query: {
                                      id: params.row.id,
                                      trnType: "apl",
                                    },
                                  });
                                }}
                              >
                                <Tooltip
                                  title={
                                    language == "en"
                                      ? `Download Payment Receipt`
                                      : "पेमेंट पावती डाउनलोड करा"
                                  }
                                >
                                  <Button
                                    style={{
                                      height: "30px",
                                      width: "230px",
                                    }}
                                    variant="contained"
                                    color="primary"
                                  >
                                    {language === "en"
                                      ? "DOWNLOAD PAYMENT RECEIPT"
                                      : "पेमेंट पावती डाउनलोड करा"}
                                  </Button>
                                </Tooltip>
                              </IconButton>
                            )}
                          </>
                        )}
                    </Stack>
                  </>
                )}
                {params?.row?.statusId != "0" && (
                  <div className={styles.buttonRow}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: "./common/masters/feedbackAndRating",
                          query: {
                            showData: JSON.stringify(params.row),
                            user: "Citizen",
                          },
                        });
                      }}
                    >
                      <Button size="small" variant="contained" color="primary">
                        {language === "en"
                          ? "Feedback & Rating"
                          : "अभिप्राय आणि मानांकन श्रेणी"}
                      </Button>
                    </IconButton>
                  </div>
                )}
              </>
            )}

            {/* BSUP Start */}
            {params?.row?.applicationUniqueId === 23 && (
              <>
                {/* Bachatgat registration */}
                {params?.row?.serviceId === 100 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" &&
                        params?.row?.statusId != "1" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "BsupNagarvasthi/transaction/bachatgatRegistration/view",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language === "en"
                                  ? "VIEW APPLICATION"
                                  : "अर्ज पहा"
                              }
                            >
                              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                            </Tooltip>
                          </IconButton>
                        )}

                      {/* {params?.row?.applicationStatus === "COMPLETE" && ( */}
                      {params?.row?.statusId === "10" && (
                        <>
                          {/* commented 3 transaction icons as per told by sandip sir on 24-08-2023*/}

                          {/* <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatRenewal/form",
                                query: { id: params.row.id },
                              });
                            }}>
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO RENEWATION FORM`
                                  : "नूतनीकरण फॉर्मवर जा"
                              }>
                              <AssignmentRoundedIcon
                                style={{ color: "#556CD6" }}
                              />
                            </Tooltip>
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatModification/form",
                                query: { id: params.row.id },
                              });
                            }}>
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO MODIFICATION FORM`
                                  : "फेरफार फॉर्मवर जा"
                              }>
                              <EditIcon style={{ color: "#556CD6" }} />
                            </Tooltip>
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatGatCancellation/form",
                                query: {
                                  id: params.row.applicationNumber,
                                  isForceful: false,
                                },
                              });
                            }}>
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO CANCELLATION FORM`
                                  : "रद्दीकरण फॉर्मवर जा"
                              }>
                              <CancelIcon style={{ color: "#556CD6" }} />
                            </Tooltip>
                          </IconButton> */}

                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatRegistrationCertificate",
                                query: {
                                  id: params.row.id,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Download Bachat Gat Certificate`
                                  : "बचत गट प्रमाणपत्र डाउनलोड करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "Download Certificate"
                                  : "सर्टिफिकेट डाउनलोड करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                      {/* )} */}

                      {params?.row?.statusId === "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatRegistration/form",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              {/* <DraftsIcon style={{ color: "#556CD6" }} /> */}
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "1" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatRegistration/edit",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Update Bachatgat Registration`
                                  : "बचतगट नोंदणी अपडेट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/acknowledgement",
                                query: {
                                  id: params.row.applicationNumber,
                                  trn: "R",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Download Acknowldgement`
                                  : "पावती डाउनलोड करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "VIEW ACKNOWLDGEMENT"
                                  : "पावती डाउनलोड करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </>
                )}

                {/* Bachatgat Modification */}
                {params?.row?.serviceId === 107 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" &&
                        params?.row?.statusId != "1" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "BsupNagarvasthi/transaction/bachatgatModification/view",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "फेरफार फॉर्मवर जा"
                              }
                            >
                              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                            </Tooltip>
                          </IconButton>
                        )}

                      {params?.row?.statusId === "10" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatModification/view",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `VIEW MODIFICATION`
                                  : "बदल पहा"
                              }
                            >
                              <EditIcon style={{ color: "#556CD6" }} />
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "1" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatModification/edit",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "फेरफार फॉर्मवर जा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "फेरफार फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/acknowledgement",
                                query: {
                                  id: params.row.applicationNumber,
                                  trn: "M",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Download Acknowldgement`
                                  : "पावती डाउनलोड करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "VIEW ACKNOWLDGEMENT"
                                  : "पावती डाउनलोड करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </>
                )}

                {/* Bachatgat Renewal */}
                {params?.row?.serviceId === 106 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" &&
                        params?.row?.statusId != "1" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "BsupNagarvasthi/transaction/bachatgatRenewal/view",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language === "en"
                                  ? "VIEW APPLICATION"
                                  : "अर्ज पहा"
                              }
                            >
                              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                            </Tooltip>
                          </IconButton>
                        )}

                      {params?.row?.statusId === "10" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatRenewal/view",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `VIEW APPLICATION`
                                  : "अर्ज पहा"
                              }
                            >
                              <AssignmentRoundedIcon
                                style={{ color: "#556CD6" }}
                              />
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatRenewal/form",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              {/* <DraftsIcon style={{ color: "#556CD6" }} /> */}
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "1" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatgatRenewal/edit",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/acknowledgement",
                                query: {
                                  id: params.row.applicationNumber,
                                  trn: "BRN",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Download Acknowldgement`
                                  : "पावती डाउनलोड करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "VIEW ACKNOWLDGEMENT"
                                  : "पावती डाउनलोड करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </>
                )}

                {/* Bachatgat Cancellation */}
                {params?.row?.serviceId === 105 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" && (
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname:
                                "BsupNagarvasthi/transaction/bachatGatCancellation/view",
                              query: { id: params.row.id },
                            });
                          }}
                        >
                          <Tooltip
                            title={
                              language === "en"
                                ? "VIEW APPLICATION"
                                : "अर्ज पहा"
                            }
                          >
                            <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                          </Tooltip>
                        </IconButton>
                      )}

                      {params?.row?.statusId === "10" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatGatCancellation/view",
                                query: { id: params.row.id, isForceful: false },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              <CancelIcon style={{ color: "#556CD6" }} />
                            </Tooltip>
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/acknowledgement",
                                query: {
                                  id: params.row.applicationNumber,
                                  trn: "C",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Download Acknowldgement`
                                  : "पावती डाउनलोड करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "VIEW ACKNOWLDGEMENT"
                                  : "पावती डाउनलोड करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatGatCancellation/form",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              {/* <DraftsIcon style={{ color: "#556CD6" }} /> */}
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "1" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/bachatGatCancellation/view",
                                query: { id: params.row.id, isEdit: true },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/acknowledgement",
                                query: {
                                  id: params.row.applicationNumber,
                                  trn: "C",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Download Acknowldgement`
                                  : "पावती डाउनलोड करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "VIEW ACKNOWLDGEMENT"
                                  : "पावती डाउनलोड करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </>
                )}

                {/* New Scheme Application */}
                {params?.row?.serviceId === 108 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" &&
                        params?.row?.statusId != "1" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "BsupNagarvasthi/transaction/newApplicationScheme/view",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language === "en"
                                  ? "VIEW APPLICATION"
                                  : "अर्ज पहा"
                              }
                            >
                              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                            </Tooltip>
                          </IconButton>
                        )}

                      {/* {params?.row?.statusId === '10' && (
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname:
                                '/BsupNagarvasthi/transaction/schemeApplicationRenewal/form',
                              query: {
                                id: params.row.id,
                              },
                            })
                          }}
                        >
                          <Tooltip title={`Renewation`}>
                            <AssignmentRoundedIcon
                              style={{ color: '#556CD6' }}
                            />
                          </Tooltip>
                        </IconButton>
                      )} */}

                      {params?.row?.statusId === "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/newApplicationScheme",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              {/* <DraftsIcon style={{ color: "#556CD6" }} /> */}
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "1" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/newApplicationScheme/edit",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/acknowledgement",
                                query: {
                                  id: params.row.applicationNumber,
                                  trn: "N",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Download Acknowldgement`
                                  : "पावती डाउनलोड करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "VIEW ACKNOWLDGEMENT"
                                  : "पावती डाउनलोड करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </>
                )}

                {/* Scheme Application Renewal */}
                {params?.row?.serviceId === 109 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" &&
                        params?.row?.statusId != "1" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "BsupNagarvasthi/transaction/schemeApplicationRenewal/view",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language === "en"
                                  ? "VIEW APPLICATION"
                                  : "अर्ज पहा"
                              }
                            >
                              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                            </Tooltip>
                          </IconButton>
                        )}

                      {params?.row?.statusId === "10" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/schemeApplicationRenewal/form",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              <AssignmentRoundedIcon
                                style={{ color: "#556CD6" }}
                              />
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/schemeApplicationRenewal/form",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              {/* <DraftsIcon style={{ color: "#556CD6" }} /> */}
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "1" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/schemeApplicationRenewal/edit",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO APPLICATION FORM"
                                  : "अर्ज फॉर्मवर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/BsupNagarvasthi/transaction/acknowledgement",
                                query: {
                                  id: params.row.applicationNumber,
                                  trn: "NR",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Download Acknowldgement`
                                  : "पावती डाउनलोड करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "VIEW ACKNOWLDGEMENT"
                                  : "पावती डाउनलोड करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </>
                )}

                {params?.row?.statusId != "0" && (
                  <div className={styles.buttonRow}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: "./common/masters/feedbackAndRating",
                          query: {
                            showData: JSON.stringify(params.row),
                            user: "Citizen",
                          },
                        });
                      }}
                    >
                      <Button size="small" variant="contained" color="primary">
                        {language === "en"
                          ? "Feedback & Rating"
                          : "अभिप्राय आणि मानांकन श्रेणी"}
                      </Button>
                    </IconButton>
                  </div>
                )}
              </>
            )}
            {/* BSUP End */}

            {/* GM start */}
            {params?.row?.applicationUniqueId === 9 && (
              <>
                <Stack direction="row">
                  {
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                          query: { id: params.row.applicationNumber },
                        });
                      }}
                    >
                      <Tooltip
                        title={
                          language === "en" ? "VIEW APPLICATION" : "अर्ज पहा"
                        }
                      >
                        <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                      </Tooltip>
                    </IconButton>
                  }
                  {
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "./common/masters/feedbackAndRating",
                            query: {
                              showData: JSON.stringify(params.row),
                              user: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Feedback & Rating"
                            : "अभिप्राय आणि मानांकन श्रेणी"}
                        </Button>
                      </IconButton>
                    </div>
                  }
                </Stack>
              </>
            )}
            {/* Gm End */}

            {/* Slum start */}
            {params?.row?.applicationUniqueId === 18 && (
              <>
                {/* hut transfer */}
                {params?.row?.serviceId === 123 && (
                  <Stack direction="row">
                    {
                      <>
                        {params?.row?.statusId != "0" &&
                          params?.row?.statusId != "23" &&
                          params.row.statusId != "1" && (
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/hutTransfer/viewAddHutDetails",
                                  query: { id: params.row.id },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language === "en"
                                    ? "VIEW APPLICATION"
                                    : "अर्ज पहा"
                                }
                              >
                                <RemoveRedEyeIcon
                                  style={{ color: "#556CD6" }}
                                />
                              </Tooltip>
                            </IconButton>
                          )}

                        {/* {params?.row?.statusId === "0" && (
                          <>
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails",
                                  query: { id: params.row.id },
                                });
                              }}
                            >
                              <DraftsIcon style={{ color: "#556CD6" }} />
                            </IconButton>
                          </>
                        )} */}
                        {params.row.statusId === "1" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails",
                                query: {
                                  id: params.row.id,
                                  isDraft: "f",
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? `GO TO APPLICATION FORM`
                                : "अर्ज फॉर्मवर जा"}
                            </Button>
                          </IconButton>
                        )}
                        {(params?.row?.statusId === "0" ||
                          params?.row?.statusId === "23") && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails",
                                query: {
                                  id: params.row.id,
                                  isDraft:
                                    params?.row?.statusId === "23" ? "f" : "t",
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en" ? "GO TO FORM" : "फॉर्म वर जा"}
                            </Button>
                          </IconButton>
                        )}

                        {params.row.statusId != "0" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/hutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW ACKNOWLDGEMENT"
                                : "पावती डाउनलोड करा"}
                            </Button>
                          </IconButton>
                        )}

                        {params.row.statusId === "13" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )}

                        {/*loi  receipt */}
                        {/* {params.row.statusId==='13' &&(
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `LOI Receipt` : "LOI पावती"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                               {language == "en" ? `LOI Receipt` : "LOI पावती"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )} */}
                      </>
                    }
                  </Stack>
                )}
                {/* NOC */}
                {params?.row?.serviceId === 129 && (
                  <Stack direction="row">
                    {
                      <>
                        {params?.row?.statusId != "1" &&
                          params?.row?.statusId != "0" && (
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/issuanceOfNoc/viewAddApplicantDetails",
                                  query: { id: params.row.id },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language === "en"
                                    ? "VIEW APPLICATION"
                                    : "अर्ज पहा"
                                }
                              >
                                <RemoveRedEyeIcon
                                  style={{ color: "#556CD6" }}
                                />
                              </Tooltip>
                            </IconButton>
                          )}

                        {params?.row?.statusId === "0" && (
                          <>
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/issuanceOfNoc/addApplicantDetails",
                                  query: { id: params.row.id },
                                });
                              }}
                            >
                              <DraftsIcon style={{ color: "#556CD6" }} />
                            </IconButton>
                          </>
                        )}

                        {params?.row?.statusId === "1" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/issuanceOfNoc/editAddApplicantNoc",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language === "en" ? "GO TO NOC" : "NOC वर जा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en" ? "GO TO NOC" : "NOC वर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )}

                        {params.row.statusId != "0" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfNoc",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW ACKNOWLDGEMENT"
                                : "पावती डाउनलोड करा"}
                            </Button>
                          </IconButton>
                        )}

                        {params.row.statusId === "13" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForNoc",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )}

                        {/*loi  receipt */}
                        {/* {params.row.statusId==='13' &&(
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `LOI Receipt` : "LOI पावती"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                               {language == "en" ? `LOI Receipt` : "LOI पावती"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )} */}
                      </>
                    }
                  </Stack>
                )}

                {/* Photopass */}
                {params?.row?.serviceId === 120 && (
                  <Stack direction="row">
                    {
                      <>
                        {params?.row?.statusId != "0" &&
                          params.row.statusId != 24 &&
                          params.row.statusId != "23" &&
                          params.row.statusId != "1" && (
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
                                  query: {
                                    id: params.row.id,
                                  },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language === "en"
                                    ? "VIEW APPLICATION"
                                    : "अर्ज पहा"
                                }
                              >
                                <RemoveRedEyeIcon
                                  style={{ color: "#556CD6" }}
                                />
                              </Tooltip>
                            </IconButton>
                          )}

                        {(params?.row?.statusId === "0" ||
                          params?.row?.statusId === "1" ||
                          params.row.statusId === "24") && (
                          <>
                            <IconButton
                              onClick={() => {
                                if (
                                  params.row.statusId === "1" ||
                                  params.row.statusId === "23" ||
                                  params.row.statusId === "24"
                                ) {
                                  router.push({
                                    pathname:
                                      "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/editApplicantDetails",
                                    query: {
                                      id: params.row.id,
                                    },
                                  });
                                } else {
                                  router.push({
                                    pathname:
                                      "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/addApplicantDetails",
                                    query: { id: params.row.id },
                                  });
                                }
                              }}
                            >
                              {/* <DraftsIcon style={{ color: "#556CD6" }} /> */}
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO FORM"
                                  : "फॉर्म वर जा"}
                              </Button>
                            </IconButton>
                          </>
                        )}
                        {params.row.statusId != "0" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfPhotopass",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW ACKNOWLDGEMENT"
                                : "पावती डाउनलोड करा"}
                            </Button>
                          </IconButton>
                        )}

                        {params.row.statusId === "13" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForPhotopass",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )}

                        {/*loi  receipt */}
                        {/* {params.row.statusId==='13' &&(
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `LOI Receipt` : "LOI पावती"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                               {language == "en" ? `LOI Receipt` : "LOI पावती"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )} */}
                      </>
                    }
                  </Stack>
                )}
                {params?.row?.statusId != "0" && (
                  <div className={styles.buttonRow}>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: "./common/masters/feedbackAndRating",
                          query: {
                            showData: JSON.stringify(params.row),
                            user: "Citizen",
                          },
                        });
                      }}
                    >
                      <Button size="small" variant="contained" color="primary">
                        {language === "en"
                          ? "Feedback & Rating"
                          : "अभिप्राय आणि मानांकन श्रेणी"}
                      </Button>
                    </IconButton>
                  </div>
                )}
              </>
            )}
            {/* Slum End */}

            {/** Property Start */}
            {params?.row?.applicationUniqueId == 10 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {params?.row?.serviceId == 140 && (
                  <>
                    {/** Draft*/}
                    {params?.row?.applicationStatus == "DRAFT" && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            let url = ``;

                            // propertyRegistration
                            if (params?.row?.serviceId == 140) {
                              localStorage.setItem(
                                "propertyRegistractionId",
                                params?.row?.id
                              );
                              url = `/propertyTax/transaction/propertyRegistration`;
                            }

                            router.push(url);
                          }}
                        >
                          {language == "en" ? "Draft" : "ड्राफ्ट"}
                        </Button>
                      </>
                    )}

                    {/** View Application */}
                    {params?.row?.applicationStatus ==
                      "APPLICATION_CREATED" && (
                      <>
                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            let url = ``;

                            // propertyRegistration
                            if (params?.row?.serviceId == 140) {
                              localStorage.setItem(
                                "propertyRegistractionId",
                                params?.row?.id
                              );
                              url = `/propertyTax/transaction/propertyRegistration`;
                            }

                            localStorage.setItem(
                              "applicationRevertedToCititizen",
                              "true"
                            );
                            localStorage.setItem(
                              "disabledFieldInputState",
                              "true"
                            );
                            router.push(url);
                          }}
                        >
                          {language == "en" ? "View Application" : "अर्ज पहा"}
                        </Button>

                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            const url = ``;

                            // propertyRegistration
                            if (params?.row?.serviceId == 140) {
                              localStorage.setItem(
                                "propertyRegistractionId",
                                params?.row?.id
                              );
                              url = `/propertyTax/transaction/propertyRegistration/AcknowledgementReceipt`;
                            }
                            router.push(url);
                          }}
                        >
                          {language == "en"
                            ? "Acknowledgement Receipt"
                            : "अर्जाची पावती"}
                        </Button>
                      </>
                    )}

                    {/** Edit Application */}
                    {params.row.applicationStatus ==
                      "APPLICATION_SENT_BACK_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          let url = ``;

                          // issuance
                          if (params?.row?.serviceId == 140) {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              params?.row?.id
                            );
                            url = `/propertyTax/transaction/propertyRegistration`;
                          }

                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "true"
                          );

                          router.push(url);
                        }}
                      >
                        {language == "en"
                          ? " Edit Application"
                          : "अर्ज संपादित करा"}
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
            {/** Property End */}
          </>
        );
      },
    },
  ];

  const removeLocalStorageItems = () => {
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("renewalOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("transferOfHawkerLicenseId");
    localStorage.removeItem("castOtherA");
    localStorage.removeItem("castCategoryOtherA");
    localStorage.removeItem("applicantTypeOtherA");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("disablityNameYN");
    localStorage.removeItem("QueryParamsData");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("DepartSideEditApplication");
    localStorage.removeItem("oldLicenseYNA");
    localStorage.removeItem("disablityNameYNA");
    localStorage.removeItem("voterNameYNA");
    localStorage.removeItem("sportsBookingAddMemberKey");
    localStorage.removeItem("sportsBookingKey");
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("renewalOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("transferOfHawkerLicenseId");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    localStorage.removeItem("DepartSideEditApplication");
    localStorage.removeItem("oldLicenseYNA");
    localStorage.removeItem("voterNameYNA");
    localStorage.removeItem("sportsBookingAddMemberKey");
    localStorage.removeItem("sportsBookingKey");
    localStorage.removeItem("castOtherA");
    localStorage.removeItem("castCategoryOtherA");
    localStorage.removeItem("applicantTypeOtherA");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("disablityNameYN");
    localStorage.removeItem("QueryParamsData");
    localStorage.removeItem("disablityNameYNA");
    localStorage.removeItem("GroundBookingId");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("propertyRegistractionId");
  };

  //!===================== useEffect
  useEffect(() => {
    removeLocalStorageItems();
    getServiceName();
    getRTIStatus();
    getBsupStatus();
    getSlumStatus();
    getGMStatus();
  }, []);

  useEffect(() => {
    getMyApplications();
  }, [serviceList && rtiStatus && bsupStatus && slumStatus]);

  useEffect(() => {
    if (dataTotable != null)
      setDataSource(
        dataTotable.map((r, i) => ({
          srNo: i + 1,
          ...r,
          id: r.applicationId,
          applicationDate: r.applicationDate === null ? "-" : r.applicationDate,
          serviceName: serviceList?.find((s) => s.id == r.serviceId)
            ?.serviceName,
          serviceNameMr: serviceList?.find((s) => s.id == r.serviceId)
            ?.serviceNameMr,
          statusId: r.applicationStatus,
          applicationStatus: setStausFilter(
            r.applicationStatus,
            r.applicationUniqueId
          ),
          clickTo: serviceList?.find((s) => s.id == r.serviceId)?.clickTo,
        }))
      );
  }, [dataTotable, language, serviceList]);

  //! ==================================== view
  return (
    <div>
      {loading ? (
        <Box
          sx={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Box
          style={{
            backgroundColor: "white",
            overflowX: "auto",
          }}
        >
          <DataGrid
            getRowId={(row) => row.srNo}
            rowHeight={100}
            sx={{
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
              overflowY: "scroll",
              overflowX: "scroll",

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
            rows={dataSource}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Box>
      )}
    </div>
  );
};

export default MyApplications;
