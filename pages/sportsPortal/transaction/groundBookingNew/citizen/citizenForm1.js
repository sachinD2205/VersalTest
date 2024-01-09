import {
  Button,
  Paper,
  ThemeProvider
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import Loader from "../../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import BookingDetail from "../../components/BookingDetail";
import EcsDetails from "../../components/EcsDetails";
import PersonalDetailsForSports from "../../components/PersonalDetailsForSports";
import FileTable from "../../components/fileTableSports/FileTable";
const Citizen1 = () => {
  const language = useSelector((state) => state?.labels.language);
  const userDao = useSelector((state) => state?.user?.user?.userDao);
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

  const router = useRouter();
  const [GroundBookingId, setGroundBookingId] = useState()
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

  // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  // handleNext
  const handleNext = () => {
  }

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

  ///! ===========================> useEffect <=================

  useEffect(() => {
    console.log("sdfsdfdcxv",GroundBookingId);
    if (GroundBookingId) {
      getByGroundBookingId();
    }
  }, [GroundBookingId]);

  useEffect(() => {
    if (
      localStorage.getItem("id") != null &&
      localStorage.getItem("id") != "" && localStorage.getItem("id") != undefined
    ) {
      setGroundBookingId(localStorage.getItem("id"));
    }
  }, []);


  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
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
                <div >
                  <h3>
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
                </div>
                <div
                  style={{
                    marginTop: 29,
                    display: "flex",
                    justifyContent: "space-around",
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
                  >
                    {<FormattedLabel id="back" />}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </Paper>
        </ThemeProvider>
      )}
    </>
  );
};

export default Citizen1;