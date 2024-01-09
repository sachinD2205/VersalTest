import DoneAllIcon from "@mui/icons-material/DoneAll";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextareaAutosize,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import urls from "../../../../../URLS/urls";
import Loader from "../../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import HistoryComponent from "../../components/HistoryComponent";
import VerificationGroundBooking from "../../components/VerificationGroundBooking";

const Index = () => {
  const language = useSelector((state) => state?.labels?.language);
  const userDao = useSelector((state) => state?.user?.user?.userDao);
  const userToken = useGetToken();
  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });
  // destructure values from methods
  const {
    setValue,
    watch,
    register,
    handleSubmit,
    getValues,
    control,
    reset,
    formState: { errors },
  } = methods;
  const router = useRouter();
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
  // role base
  const [authority, setAuthority] = useState();
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const user = useSelector((state) => state.user.user);
  const [loadderState, setLoadderState] = useState(false);
  useState(null);
  const [newRole, setNewRole] = useState();
  const [applicationData, setApplicationData] = useState();
  const [tableData, setTableData] = useState([]);
  const [hardCodeAuthority, setHardCodeAuthority] = useState();
  const [facilityName, setFacilityName] = useState();

  // Verification  Dialog
  const [verificationAoDailog, setVerificationAoDailog] = useState();
  const verificationAoOpne = () => {
    setVerificationAoDailog(true), setValue("verification", true);
  };
  const verificationAoClose = () => setVerificationAoDailog(false);

  // remarkFun
  const remarkFun = (data) => {
    setLoadderState(true);
    let approveRemark;
    let rejectRemark;

    if (data == "Approve") {
      approveRemark = watch("verificationRemark");

      // finalBodyForApi
      const finalBodyForApi = {
        approveRemark,
        rejectRemark,
        id: watch("id"),
        desg: hardCodeAuthority,
        role: newRole,
        serviceId: 68,
        emailAddress: watch("emailAddress"),
        // facilityName: 28,
        facilityName: watch("facilityName"),
        attachmentList: watch("attachmentList") ?? [],
      };

      console.log("finalBodyForApi", finalBodyForApi);

      // api
      axios
        .post(
          `${urls.SPURL}/groundBooking/saveApplicationApprove`,
          finalBodyForApi,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          setLoadderState(false);
          if (res.status == 200 || res.status == 201) {
            if (userDao?.cfcUser) {
              router.push("/CFC_Dashboard");
            } else if (userDao?.deptUser) {
              router.push(
                "/sportsPortal/transaction/groundBookingNew/scrutiny"
              );
            } else {
              router.push("/dashboard");
            }
          }
        })
        .catch((error) => {
          setValue("loadderState", false);
          callCatchMethod(error, language);
        });
    } else if (data == "Revert") {
      if (
        watch("verificationRemark") != "" &&
        watch("verificationRemark") != null &&
        watch("verificationRemark") != undefined
      ) {
        rejectRemark = watch("verificationRemark");

        // finalBodyForApi
        const finalBodyForApi = {
          approveRemark,
          rejectRemark,
          id: watch("id"),
          desg: hardCodeAuthority,
          role: newRole,
          serviceId: 68,
          emailAddress: watch("emailAddress"),
          // facilityName: 28,
          facilityName: watch("facilityName"),
          attachmentList: watch("attachmentList") ?? [],
        };
        console.log("__finalBodyForApi", finalBodyForApi);
        // api
        axios
          .post(
            `${urls.SPURL}/groundBooking/saveApplicationApprove`,
            finalBodyForApi,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            setLoadderState(false);
            if (res.status == 200 || res.status == 201) {
              if (userDao?.cfcUser) {
                router.push("/CFC_Dashboard");
              } else if (userDao?.deptUser) {
                router.push(
                  "/sportsPortal/transaction/groundBookingNew/scrutiny"
                );
              } else {
                router.push("/dashboard");
              }
            }
          })
          .catch((error) => {
            setValue("loadderState", false);
            callCatchMethod(error, language);
          });
      } else {
        setValue("loadderState", false);
        language == "en"
          ? toast.error("Remark is Required !!!", {
              position: toast.POSITION.TOP_RIGHT,
            })
          : toast.error("टिप्पणी आवश्यक आहे !!!", {
              position: toast.POSITION.TOP_RIGHT,
            });
      }
    }
  };

  // getAllGroundData
  const getAllGroundData = () => {
    setLoadderState(true);

    axios
      .get(`${urls.SPURL}/groundBooking/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        console.log("Ground data", resp);
        if (resp.status == 200) {
          setLoadderState(false);
          const data = resp?.data.groundBooking?.map((data, index) => {
            return {
              ...data,
              srNo: index + 1,
              applicantNameMr:
                data?.firstNameMr +
                " " +
                data?.middleNameMr +
                " " +
                data?.lastNameMr,
              bookingIds1:
                data?.bookingIds1 != null &&
                data?.bookingIds1 != undefined &&
                data?.bookingIds1 != ""
                  ? data?.bookingIds1.split(",").map((data) => Number(data))
                  : null,
              attachmentss: data?.attachmentList,
            };
          });

          setTableData(data);
          reset(data);
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 25,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      description: "Application Number",
      width: 240,
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      description: "Application Date",
      width: 120,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: "createDtTm",
      headerName: <FormattedLabel id="applicationTime" />,
      width: 120,
      valueFormatter: (params) => moment(params.value).format("hh:mm:ss A"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="applicantName" />,
      description: "Applicant Name",
      width: 260,
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="applicationStatus" />,
      width: 400,
    },

    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 410,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            {["APPLICATION_CREATED", "APPLICATION_SENT_BACK_TO_CLERK"].includes(
              record?.row?.applicationStatus
            ) &&
              authority?.find((r) => r == "CLERK" || r == "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      reset(record?.row);
                      setValue("serviceName", record?.row?.serviceId);
                      setValue(
                        "applicationNumber",
                        record?.row?.applicationNumber
                      );
                      setApplicationData(record?.row);
                      setNewRole("VERIFICATION");
                      setValue("approveBtnState", "DISABLE");
                      setHardCodeAuthority("CLERK");
                      verificationAoOpne();
                    }}
                  >
                    <FormattedLabel id="clerkVerification" />
                  </Button>
                </IconButton>
              )}

            {[
              "APPLICATION_SENT_TO_SUPERVISOR",
              "APPLICATION_SENT_BACK_TO_SUPERVISOR",
            ].includes(record?.row?.applicationStatus) &&
              authority?.find((r) => r === "SUPERVISOR" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record?.row);
                      setValue("serviceName", record?.row?.serviceId);
                      setApplicationData(record?.row);
                      setNewRole("VERIFICATION");
                      setFacilityName(watch("facilityName"));
                      setHardCodeAuthority("SUPERVISOR");
                      verificationAoOpne();
                    }}
                  >
                    <FormattedLabel id="sVerification" />
                  </Button>
                </IconButton>
              )}

            {[
              "APPLICATION_SENT_TO_SPORTS_OFFICER",
              "APPLICATION_SENT_BACK_TO_SPORTS_OFFICER",
            ].includes(record?.row?.applicationStatus) &&
              authority?.find(
                (r) => r === "SPORTS_OFFICER" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      reset(record?.row);
                      setValue("serviceName", record?.row?.serviceId);
                      setApplicationData(record?.row);
                      setFacilityName(watch("facilityName"));
                      setNewRole("VERIFICATION");
                      setHardCodeAuthority("SPORTS_OFFICER");
                      verificationAoOpne();
                    }}
                  >
                    <FormattedLabel id="sOVerification" />
                  </Button>
                </IconButton>
              )}

            {[
              "APPLICATION_SENT_TO_ADDITIONAL_COMMISHIONER",
              "APPLICATION_SENT_BACK_TO_ADDITIONAL_COMMISHIONER",
            ].includes(record?.row?.applicationStatus) &&
              authority?.find(
                (r) => r === "ADDITIONAL_COMMISHIONER" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      reset(record?.row);
                      setValue("serviceName", record?.row?.serviceId);
                      setApplicationData(record?.row);
                      setNewRole("VERIFICATION");
                      setFacilityName(watch("facilityName"));
                      setHardCodeAuthority("ADDITIONAL_COMMISHIONER");
                      verificationAoOpne();
                    }}
                  >
                    <FormattedLabel id="aCVerification" />
                  </Button>
                </IconButton>
              )}
            {["APPLICATION_SENT_TO_COMMISHIONER"].includes(
              record?.row?.applicationStatus
            ) &&
              authority?.find((r) => r === "COMMISHIONER" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      reset(record?.row);
                      setValue("serviceName", record?.row?.serviceId);
                      setApplicationData(record?.row);
                      setNewRole("VERIFICATION");
                      setFacilityName(watch("facilityName"));
                      setHardCodeAuthority("COMMISHIONER");
                      verificationAoOpne();
                    }}
                  >
                    <FormattedLabel id="vCommiCVerification" />
                  </Button>
                </IconButton>
              )}

            {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LICENSE_ISSUANCE" || r === "ADMIN"
              ) && (
                <div style={{ display: "flex", columnGap: 20 }}>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      reset(record?.row);
                      setValue("serviceName", record?.row?.serviceId);
                      setApplicationData(record?.row);
                      setNewRole("LICENSE_ISSUANCE");
                      router.push({
                        pathname:
                          "/sportsPortal/transaction/groundBookingNew/scrutiny/SanctionLetter/sanctionLetterc",
                        query: {
                          id: record.row.id,
                          role: "LICENSE_ISSUANCE",
                        },
                      });
                    }}
                  >
                    {/* Sanction Letter ISSUANCE */}
                    <FormattedLabel id="sLetter" />
                  </Button>

                  {/**  Slot Details */}
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      console.log("Bhava____AaheKaBarobrr", record?.row?.id);
                      localStorage.setItem("GroundBookingId", record?.row?.id);
                      router.push(
                        "/sportsPortal/transaction/groundBookingNew/scrutiny/SlotCancellation"
                      );
                    }}
                  >
                    <FormattedLabel id="cancellSlot" />
                  </Button>
                </div>
              )}
          </>
        );
      },
    },
  ];

  // onSubmitForm
  const onSubmitForm = (data) => {
    console.log("dsfldsj", data);
  };

  //!=====================================>  useEffects

  useEffect(() => {
    localStorage.removeItem("GroundBookingId");
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("SachinUser", auth, "user", user);
  }, []);

  useEffect(() => {
    getAllGroundData();
  }, [authority]);

  //! ===============================> view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div style={{ backgroundColor: "white" }}>
          <ToastContainer />
          <Paper
            elevation={5}
            sx={{
              padding: "2vh 2vw",
              backgroundColor: "#F5F5F5",
            }}
            component={Box}
          >
            <div style={{ padding: "2vh 2vw" }}>
              <DataGrid
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                autoHeight
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
                density="density"
                rows={
                  tableData != null && tableData != undefined && tableData != ""
                    ? tableData
                    : []
                }
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
              />
            </div>
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/** Verification Dailog  */}
                  <Dialog
                    fullWidth
                    maxWidth={"xl"}
                    open={verificationAoDailog}
                    onClose={() => {
                      verificationAoClose();
                    }}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <FormattedLabel id="basicApplicationDetails" />
                    </DialogTitle>
                    <DialogContent sx={{ overflow: "unset" }}>
                      <VerificationGroundBooking props={applicationData} />
                    </DialogContent>
                    <Grid>
                      <HistoryComponent id={watch("id")} />
                    </Grid>
                    <DialogTitle>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h6">
                          Enter Remark for Application
                        </Typography>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextareaAutosize
                            style={{
                              width: "90vw",
                              height: "50px",
                              display: "flex",
                              justifyContent: "center",
                              marginBottom: "30px",
                            }}
                            {...register("verificationRemark")}
                          />
                        </Grid>
                        <Stack
                          style={{ display: "flex", justifyContent: "center" }}
                          spacing={3}
                          direction={"row"}
                        >
                          {" "}
                          <Button
                            variant="contained"
                            color="success"
                            disabled={
                              watch("approveBtnState") == "DISABLE"
                                ? true
                                : false
                            }
                            onClick={() => {
                              remarkFun("Approve");
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              remarkFun("Revert");
                            }}
                          >
                            Revert
                          </Button>
                          <Button
                            style={{ backgroundColor: "red" }}
                            variant="contained"
                            onClick={() => {
                              verificationAoClose();
                            }}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Stack>
                      </Grid>
                    </DialogTitle>
                  </Dialog>
                </form>
              </FormProvider>
            </ThemeProvider>
          </Paper>
        </div>
      )}
    </>
  );
};

export default Index;
