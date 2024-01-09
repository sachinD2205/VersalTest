import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import UploadButton1 from "../../../../components/fileUpload/UploadButton1";
import { IssuanceOfHawkerLicenseCitizenSchema } from "../../../../components/streetVendorManagementSystem/schema/issuanceOfHawkerLicenseSchema";
import theme from "../../../../theme";
import styles from "../../transaction/groundBookingNew/scrutiny/view.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import BookingDetailsSwimming from "../components/BookingDetailsSwimming";
import EcsDetails from "../components/EcsDetails";
import PersonalDetails from "../components/PersonalDetails";
import BookingDetailsGym from "../components/BookingDetailsGym";
import BookingPersonDetailsGym from "../components/BookingPersonDetailsGym";
import { BookingDetailSchema } from "../../../../containers/schema/sportsPortalSchema/gymSchema";
import FileTableVerification from "../components/fileTableSports/FileTableVerification";
import { useReactToPrint } from "react-to-print";
import { Print } from "@mui/icons-material";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import FileTable from "../components/fileTableSports/FileTable";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Citizen = () => {
  // askjldaskldjaskldjaklsjdkasjdklasjkl

  const printHandler = () => {
    let opt = {
      margin: 1,
      filename: "ApplicationForm.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };

    // const element = ReactDOMServer.renderToString(
    //   refToPrint.current
    //   // <ComponentToPrint datta={datta} ref={componentRef} />
    // );

    let base64str;
    html2pdf()
      .from(
        // element
        refToPrint.current
      )
      .toPdf()
      .set(opt)
      .output("datauristring")
      .save();
  };

  // askjldaskldjaskldjaklsjdkasjdklasjkl

  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(BookingDetailSchema),
  });

  // destructure values from methods
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: {},
  } = methods;

  const refToPrint = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => refToPrint.current,
    // @ts-ignore
    documentTitle: "Application Form",
  });

  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [loadderState, setLoadderState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setid] = useState();
  const [shrinkTemp, setShrinkTemp] = useState(false);
  const [panCard, setpanCard] = useState(null);
  const [idCard, setIdcard] = useState(null);
  const [aadharCard, setaadharCard] = useState(null);
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  const [applicationRevertedToCititizen, setApplicationRevertedToCititizen] =
    useState(false);
  const [
    applicationRevertedToCititizenNew,
    setApplicationRevertedToCititizenNew,
  ] = useState(true);
  let user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.user.token);
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

  const handleNext = (data) => {
    // let finalBodyForApi = {
    //   ...data,
    //   // pageMode: "APPLICATION_CREATED",
    // };
    let finalBodyForApi;
    if (
      router?.query?.applicationStatus === "APPLICATION_SENT_BACK_TO_CITIZEN"
    ) {
      finalBodyForApi = {
        ...data,
        pageMode: "APPLICATION_CREATED",
        applicationStatus: "APPLICATION_CREATED",
        attachmentList: watch("attachmentss") ?? [],
      };
    } else {
      finalBodyForApi = {
        ...data,
        // pageMode: "APPLICATION_CREATED",
      };
    }
    console.log("__finalBodyForApi", finalBodyForApi);

    // let url = `${urls.SPURL}/gymBooking/saveGymBooking`;
    let url = `${urls.SPURL}/gymBooking/editGymBoooking`;
    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "CITIZEN",
        },
      })
      .then((res) => {
        console.log("res?.stasdf", res);
        if (
          res?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setLoading(false);
          res?.data?.id
            ? sweetAlert("Updated!", res?.data?.message, "success")
            : sweetAlert("Submitted !", res?.data?.message, "success");
          if (localStorage.getItem("loggedInUser") == "departmentUser") {
            setLoadderState(false);
            router.push(`/streetVendorManagementSystem`);
          } else {
            setLoadderState(false);
            router.push(`/dashboard`);
          }
        } else {
          setLoadderState(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoadderState(false);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // const saveFunction = () => {
  //   const finalBodyForApi = {
  //     facilityType: getValues("facilityType"),
  //     applicantType: getValues("applicantType"),
  //     applicationStatus: "APPLICATION_CREATED",
  //     id: localStorage.getItem("id"),
  //     // activeFlag: "Y",
  //     // serviceId: 36,
  //     // createdUserId: user?.id,
  //   };

  //   console.log("Final Body mdhe ky yet ahe", finalBodyForApi);
  //   axios

  //     .post(`${urls.SPURL}/gymBooking/saveGymBooking`, finalBodyForApi, {
  //       headers: {
  //         role: "CITIZEN",
  //       },
  //     })
  //     .then((res) => {
  //       console.log("res?.stasdf", res);
  //       if (
  //         res?.status == 200 ||
  //         res?.status == 201 ||
  //         res?.status == "SUCCESS"
  //       ) {
  //         res?.data?.id
  //           ? sweetAlert("Submitted!", res?.data?.message, "success")
  //           : sweetAlert("Submitted !", res?.data?.message, "success");
  //         router.push("/dashboard");
  //       } else {
  //         setLoadderState(false);
  //         setLoading(false);
  //       }
  //     })
  //     .catch((err) => {
  //       setLoadderState(false);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   alert("hbjhbjh");
  //   // reset(router.query)
  //   axios
  //     .get(`${urls.SPURL}/gymBooking/getById?id=${router.query.id}`)
  //     .then((r) => {
  //       console.log("54332313456", r?.data);
  //       if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
  //         console.log("Data", r?.data);
  //         reset(r.data);
  //         if (
  //           localStorage.getItem("applicationRevertedToCititizen") == "true"
  //         ) {
  //           setValue("disabledFieldInputState", false);
  //         } else {
  //           setValue("disabledFieldInputState", true);
  //         }
  //         setShrinkTemp(true);
  //         setLoadderState(false);
  //       } else {
  //         setLoadderState(false);
  //         setShrinkTemp(true);
  //       }
  //     })
  //     .catch(() => {
  //       setLoadderState(false);
  //       setShrinkTemp(true);
  //     });
  // }, []);

  // Data
  const getData = () => {
    setLoadderState(true);
    if (id) {
      axios
        .get(`${urls.SPURL}/gymBooking/getById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          console.log("54332313456", r?.data);
          if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
            console.log("Data", r?.data);
            reset(r?.data);
            // setValue("id", id);
            if (
              r?.data?.applicationStatus === "APPLICATION_SENT_BACK_TO_CITIZEN"
            ) {
              setValue(
                "attachmentss",
                r?.data?.attachmentList?.sort((a, b) => a?.srNo - b?.srNo) ?? []
              );
            }
            if (
              localStorage.getItem("applicationRevertedToCititizen") == "true"
            ) {
              setValue("disabledFieldInputState", false);
            } else {
              setValue("disabledFieldInputState", true);
            }
            setShrinkTemp(true);
            setLoadderState(false);
          } else {
            setLoadderState(false);
            setShrinkTemp(true);
          }
        })
        .catch((error) => {
          setLoadderState(false);
          setShrinkTemp(true);
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    getData();
  }, [id]);
  useEffect(() => {
    console.log("__attachmentss", watch("attachmentss"));
  }, [watch("attachmentss")]);

  useEffect(() => {
    if (
      localStorage.getItem("id") != null ||
      localStorage.getItem("id") != ""
    ) {
      setid(localStorage.getItem("id"));
    }
    if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
      setApplicationRevertedToCititizen(true);
      setApplicationRevertedToCititizenNew(false);
      setValue("disabledFieldInputState", true);
    } else {
      setApplicationRevertedToCititizen(false);
      setApplicationRevertedToCititizenNew(true);
      setValue("disabledFieldInputState", false);
    }
  }, []);

  useEffect(() => {}, [watch("disabledFieldInputState")]);
  useEffect(() => {}, [
    setApplicationRevertedToCititizen,
    setApplicationRevertedToCititizen,
  ]);

  // view
  return (
    <>
      {shrinkTemp && (
        <div>
          <ThemeProvider theme={theme}>
            {loadderState ? (
              <Loader />
            ) : (
              <Paper
                square
                sx={{
                  // margin: 5,
                  padding: 1,
                  // paddingTop: 5,
                  paddingTop: 5,
                  paddingBottom: 5,
                  backgroundColor: "white",
                }}
                elevation={5}
              >
                <br /> <br />
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(handleNext)}
                    style={{ marginTop: 2 }}
                  >
                    <div ref={refToPrint}>
                      {router.query.pageMode === "Edit" && (
                        <>
                          <BookingDetailsGym />
                          <BookingPersonDetailsGym />
                          <FileTable forCitizen={true} />
                        </>
                      )}
                      {router.query.pageMode != "Edit" && (
                        <>
                          <BookingDetailsGym readOnly />
                          <BookingPersonDetailsGym readOnly />
                        </>
                      )}
                    </div>
                    {router.query.pageMode != "Edit" && (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            documentPreviewDailogOpen();
                          }}
                        >
                          {/* View Document */}
                          <FormattedLabel id="viewDocument" />
                        </Button>
                      </div>
                    )}

                    <div
                      style={{
                        // border: "2px solid black",
                        marginTop: 29,
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleToPrint}
                        endIcon={<Print />}
                      >
                        {/* Print */}
                        <FormattedLabel id="print" />
                      </Button>

                      <Button
                        onClick={() => {
                          localStorage.removeItem("id");
                          router.push("/dashboard");
                        }}
                        type="button"
                        size="small"
                        variant="contained"
                        color="primary"
                      >
                        {<FormattedLabel id="back" />}
                      </Button>

                      {/* <Button
                        variant="contained"
                        size="small"
                        sx={{ size: "23px" }}
                        onClick={() => {
                          console.log("Dhingana: ", refToPrint.current);
                          printHandler();
                        }}
                      >
                        Download
                      </Button> */}

                      {/* <div className={styles.documentBtn}> */}
                    </div>

                    {router.query.pageMode === "Edit" && (
                      <div className={styles.documentBtn}>
                        <Button type="submit">Save</Button>
                      </div>
                    )}
                  </form>
                  {/** Document Preview Dailog - OK */}
                  <Dialog
                    fullWidth
                    maxWidth={"xl"}
                    open={documentPreviewDialog}
                    onClose={() => {
                      documentPreviewDailogClose();
                    }}
                  >
                    <Paper sx={{ p: 2 }}>
                      <CssBaseline />
                      <DialogTitle>
                        <Grid container>
                          <Grid
                            item
                            xs={6}
                            sm={6}
                            lg={6}
                            xl={6}
                            md={6}
                            sx={{
                              display: "flex",
                              alignItem: "left",
                              justifyContent: "left",
                            }}
                          >
                            Document Preview
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sm={2}
                            md={4}
                            lg={6}
                            xl={6}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <IconButton
                              aria-label="delete"
                              sx={{
                                marginLeft: "530px",
                                backgroundColor: "primary",
                                ":hover": {
                                  bgcolor: "red",
                                  color: "white",
                                },
                              }}
                            >
                              <CloseIcon
                                sx={{
                                  color: "black",
                                }}
                                onClick={() => {
                                  documentPreviewDailogClose();
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </DialogTitle>
                      {/* <DialogContent
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TableContainer>
                          <Table>
                            <TableHead
                              stickyHeader={true}
                              sx={{
                                backgroundColor: "#1890ff",
                              }}
                            >
                              <TableRow>
                                <TableCell style={{ color: "white" }}>
                                  sr.no
                                </TableCell>
                                <TableCell style={{ color: "white" }}>
                                  <h3>Document Name</h3>
                                </TableCell>
                                <TableCell style={{ color: "white" }}>
                                  <h3>Mandatory</h3>
                                </TableCell>
                                <TableCell style={{ color: "white" }}>
                                  <h3>View Document</h3>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>1 </TableCell>
                                <TableCell>Photo</TableCell>
                                <TableCell>Required</TableCell>
                                <TableCell>
                                  <UploadButton1
                                    appName="SP"
                                    serviceName="SP-SPORTSBOOKING"
                                    filePath={setIdcard}
                                    fileName={getValues("passportPhoto")}
                                  />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2 </TableCell>
                                <TableCell>Aadhaar Card</TableCell>
                                <TableCell>Required</TableCell>
                                <TableCell>
                                  <UploadButton1
                                    appName="SP"
                                    serviceName="SP-SPORTSBOOKING"
                                    filePath={setaadharCard}
                                    fileName={getValues("aadharCard")}
                                  />
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell>3 </TableCell>
                                <TableCell>Pan Card </TableCell>
                                <TableCell>Not-Required</TableCell>
                                <TableCell>
                                  <UploadButton1
                                    appName="SP"
                                    serviceName="SP-SPORTSBOOKING"
                                    filePath={setpanCard}
                                    fileName={getValues("panCard")}
                                  />
                                </TableCell>
                              </TableRow>

                             
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </DialogContent> */}

                      <FileTableVerification />

                      <Grid container></Grid>
                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => {
                              documentPreviewDailogClose();
                            }}
                          >
                            Exit
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Paper>
                  </Dialog>
                </FormProvider>
              </Paper>
            )}
          </ThemeProvider>
        </div>
      )}
    </>
  );
};

export default Citizen;
