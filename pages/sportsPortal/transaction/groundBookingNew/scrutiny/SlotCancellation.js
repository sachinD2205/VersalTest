import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Stack,
  TextareaAutosize,
  Typography
} from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import axios from "axios";
import { useRouter } from "next/router.js";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import urls from "../../../../../URLS/urls.js";
import Loader from "../../../../../containers/Layout/components/Loader/index.js";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel.js";
import theme from "../../../../../theme.js";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import styles from "../../../transaction/sportBooking/PaymentCollection.module.css";
import BookingDetail from "../../components/BookingDetail.js";
import EcsDetails from "../../components/EcsDetails.js";
import PersonalDetailsForSports from "../../components/PersonalDetailsForSports.js";
import FileTable from "../../components/fileTableSports/FileTable";
import SlotCancellationTable from "./SlotCancellationTable.js";
import { Diversity2Outlined } from "@mui/icons-material";
import moment from "moment";
// Loi Generation
const SlotCancellation = (props) => {
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(IssuanceOfHawkerLicenseCitizenSchema),
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
    formState: { },
  } = methods;

  const [GroundBookingId, setGroundBookingId] = useState()
  const userDao = useSelector((state) => state?.user?.user?.userDao);
  const [loadderState, setLoadderState] = useState(false);
  const userToken = useGetToken();
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
  // Modal States
  const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
  const approveRevertRemarkDailogOpen = () =>
    setApproveRevertRemarkDailog(true);
  const approveRevertRemarkDailogClose = () =>
    setApproveRevertRemarkDailog(false);

  // getByGroundBookingId
  const getByGroundBookingId = () => {
    setLoadderState(true);
    axios
      .get(`${urls.SPURL}/groundBooking/getById?id=${GroundBookingId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {

          console.log("resdata54", res?.data);

          const data = {
            ...res?.data,
            disabledFieldInputState: true,
            bookingIds1: res?.data?.bookingIds1.split(",").map((data) => Number(data)),
            attachmentss: res?.data?.attachmentList,
          }
          console.log("data23432", data)
          reset(data);
          setLoadderState(false);
        } else {
          setLoadderState(false);
        }
      })
      .catch((error) => {

        setLoadderState(false);
        callCatchMethod(error, language);
      });
    ;

  }




  // Handle Next
  const handleNext = () => {
    const data = watch();
    console.log("dslf324324", watch())

    setLoadderState(true);
    console.log("DatSDFSDF", data, "dsfdsfdsfds", data?.groundBookingCancelledSlot);

    const groundSlotsLstTemp = data?.groundBookingCancelledSlot.filter(data => data?.checked == true);
    const groundSlotsLst = groundSlotsLstTemp.map(data => {
      return {
        id: data?.id,
        fromBookingTime: data?.fromBookingTime,
        toBookingTime: data?.toBookingTime,
        date: data?.fromDate != null && data?.fromDate != undefined && data?.fromDate != "" ? moment(data?.fromDate,"YYYY-MM-DD").format("YYYY-MM-DD") : null,
        fromDate: data?.fromDate != null && data?.fromDate != undefined && data?.fromDate != "" ? moment(data?.fromDate,"DD-MM-YYYY").format("YYYY-MM-DD") : null,
        toDate: data?.toDate != null && data?.toDate != undefined && data?.toDate != "" ? moment(data?.toDate,"YYYY-MM-DD").format("YYYY-MM-DD") : null,
        groundBookingKey: data?.groundBookingKey,
        bookingId: data?.bookingId,
        activeFlag: data?.activeFlag
      }

    });

    // onlyCancelledBookingId 
    // const groundBookingCancelledSlotId = groundBookingCancelledSlot?.map(data1 => Number(data1?.bookingId));



    const url = `${urls.SPURL}/groundBooking/cancelSlots`;




    const finalBodyForApi = {
      id: data?.id,
      groundSlotsLst: groundSlotsLst,
      clerkRejectRemark: data?.clerkRejectRemark,
    }

    console.log("finalBodyForApiCancellationSlot", finalBodyForApi)


    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {

          swal({
            title:
              language == "en"
                ? "Successfully"
                : "यशस्वीरित्या!",
            text: language == "en"
              ? "slot cancelled successfully"
              : "स्लॉट यशस्वीरित्या रद्द केला!",
            icon: "success",
            button: "ओके",
          });



          if (userDao?.cfcUser) {
            router.push("/CFC_Dashboard");
          } else if (userDao?.deptUser) {
            router.push("/sportsPortal/transaction/groundBookingNew/scrutiny");
          } else {
            router.push("/dashboard");
          }

          setLoadderState(false)

        } else {
          setLoadderState(false);
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });


    // setLoadderState(false);



  };

  //!======================= useEffect

  useEffect(() => {
    if (GroundBookingId) {
      setLoadderState(true);
      getByGroundBookingId();
    } else {
      setLoadderState(false);
    }
  }, [GroundBookingId]);

  useEffect(() => {
    if (
      localStorage.getItem("GroundBookingId") != null &&
      localStorage.getItem("GroundBookingId") != "" && localStorage.getItem("GroundBookingId") != undefined
    ) {
      setLoadderState(true);
      setGroundBookingId(localStorage.getItem("GroundBookingId"));
    } else {
      setLoadderState(false);
    }
  }, []);

  useEffect(() => {
    console.log("userDao32423", userDao)
  }, [userDao])


  // !================================ view
  return (
    <div>
      {loadderState ? (
        <Loader />
      ) : (
        <div>
          <Paper
            square
            sx={{
              padding: 1,
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
              >
                <ThemeProvider theme={theme}>
                  <div>
                    <div >
                      <h3 >
                        <center>
                          {language == "en" ? "Application Number : " : "अर्ज क्रमांक : "}
                          {watch("applicationNumber")}
                        </center>
                      </h3>
                      <BookingDetail readOnly />
                      <PersonalDetailsForSports readOnly />
                      <EcsDetails readOnly />
                      <div style={{ padding: "0vh 3vw 0vh 2vw" }}>
                        <FileTable key={2} serviceId={68} readOnly={true} />;
                      </div>
                      <SlotCancellationTable />
                    </div>
                    <div
                      style={{
                        marginTop: 29,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // margin: "0vh 2vw"
                      }}
                    >
                      <Button
                        onClick={() => {
                          localStorage.removeItem("GroundBookingId");
                          if (userDao?.cfcUser) {
                            router.push("/CFC_Dashboard");
                          } else if (userDao?.deptUser) {
                            router.push("/sportsPortal/transaction/groundBookingNew/scrutiny");
                          } else {
                            router.push("/dashboard");
                          }
                        }}
                        type="button"
                        variant="contained"
                        color="primary"
                        style={{ margin: "0vh 2vw" }}
                      >
                        {<FormattedLabel id="back" />}
                      </Button>
                      <Button
                        variant="contained"
                        type="button"
                        onClick={() => {
                          approveRevertRemarkDailogOpen()
                        }}
                      >
                        {<FormattedLabel id="action" />}
                      </Button>

                    </div>

                    {/** Approve Button   Preview Dailog  */}
                    <div>
                      <Modal
                        open={approveRevertRemarkDailog}
                        onClose={() => approveRevertRemarkDailogClose()}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 5,
                        }}
                      >
                        <Paper
                          sx={{
                            padding: 2,
                            height: "400px",
                            width: "600px",
                          }}
                          elevation={5}
                          component={Box}
                        >
                          <Grid container>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                style={{
                                  marginBottom: "30px",
                                  marginTop: "20px",
                                }}
                                variant="h6"
                              >
                                {
                                  <FormattedLabel id="enterRemarkForApplication" />
                                }
                              </Typography>
                              <br />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <TextareaAutosize
                                style={{
                                  width: "550px",
                                  height: "200px",
                                  display: "flex",
                                  justifyContent: "center",
                                  marginBottom: "30px",
                                }}
                                {...register("clerkRejectRemark")}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Stack spacing={5} direction="row">
                                <Button
                                  variant="contained"
                                  style={{ backgroundColor: "green" }}
                                  onClick={() =>
                                    handleNext(watch())
                                  }
                                >
                                  {<FormattedLabel id="submit" />}
                                </Button>
                                <Button
                                  style={{ backgroundColor: "red" }}
                                  type="button"
                                  onClick={() => {
                                    if (userDao?.cfcUser) {
                                      router.push("/CFC_Dashboard");
                                    } else if (userDao?.deptUser) {
                                      router.push("/sportsPortal/transaction/groundBookingNew/scrutiny");
                                    } else {
                                      router.push("/dashboard");
                                    }
                                  }
                                  }
                                >
                                  {<FormattedLabel id="exit" />}
                                </Button>

                              </Stack>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Modal >


                    </div>
                  </div>
                </ThemeProvider >
              </form >

            </FormProvider >
          </Paper >
        </div>
      )}
    </div>
  );
};

export default SlotCancellation;
