import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import {
  CalendarPicker,
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import swal from "sweetalert";
// import Loader from "../../../containers/Layout/components/Loader";
import Loader from "../../../../../containers/Layout/components/Loader";
// import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import theme from "../../../../../theme";
// import styles from "../styles/siteVisitSchedule.module.css";
import styles from "../../../../../components/roadExcevation/styles/siteVisitScheduleJE.module.css";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

/** Author - Sahin Durge */
// Site Visit Schedule
const SiteVisitSchedule = (props) => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    handleSubmit,
    methods,
    formState: { errors },
  } = useForm({
    defaultValues: { tokenNo: "" },
  });
  // useField Array
  const { fields, append, remove } = useFieldArray({ name: "slotss", control });
  let applicationId = props?.appID;
  let serviceId = props?.serviceId;
  const router = useRouter();
  const [haveData, setHaveData] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [disabled, setdisabled] = useState(false);
  const [btnValue, setButtonValue] = useState(false);
  const [btnSaveText1, setBtnSaveText1] = useState("Save1");
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [appointmentBookModal, seteAppointmentBookModal] = useState(false);
  const [loadderState, setLoadderState] = useState(false);
  const [priviousIdMaintenace, setPriviousIdMaintenace] = useState();
  const [priviousIdFirstForm, setPriviousIdFirstForm] = useState();
  const [newDate, setNewDate] = useState();
  const userToken = useGetToken();
  // Appointment Modal
  const appointmentModalOpen = () => setAppointmentModal(true);
  const appointmentModalClose = () => setAppointmentModal(false);

  // Appointment Book Modal
  const appointmentBookModalOpen = () => seteAppointmentBookModal(true);
  const appointmentBookModalClose = () => seteAppointmentBookModal(false);

  //user info
  const user = useSelector((state) => state?.user.user);
  const response = useSelector((state) => {
    return state.user.usersDepartmentDashboardData;
  });
  const language = useSelector((store) => store.labels.language);
  // console.log("userInfo",response.userDao.firstNameEn);
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
  const jeName = response?.userDao?.firstNameEn
  const jeNumber = response?.userDao?.phoneNo
  // Button Input State
  const CustomizedCalendarPicker = styled(CalendarPicker)`
    & .css-1n2mv2k {
      display: 'flex',
      justifyContent: 'spaceAround',
      backgroundColor: 'red',
    }
    & mui-style-mvmu1r{
      display: 'flex',
      justifyContent: 'spaceAround',
      backgroundColor: 'red',
    }
  `;

  // Weekend Defined
  const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  // Append UI
  const appendUI = (id, fromTime, toTime, noOfSlots, slotDate) => {
    console.log("id", id);
    console.log(`sdf ${getValues(`slotss.length`)}`);
    console.log("fromTime,toTime", fromTime, toTime);
    console.log("slot Date", slotDate);
    append({
      id: id,
      fromTime: fromTime,
      toTime: toTime,
      noOfSlots: noOfSlots,
      slotDate: slotDate,
    });
  };

  // Button
  const buttonValueSetFun = () => {
    if (getValues(`slotss.length`) >= 7) {
      setButtonValue(true);
    } else {
      appendUI(null, null, null, "", null);
      setButtonValue(false);
    }
  };

  // Final Data
  // const onFinish = () => {
  //   setLoadderState(true);
  //   let slots = [];

  //   // Array - Updated Data
  //   let data = watch("slotss");
  //   console.log("data ", data);
  //   // let selectedDate = data.slotDate;
  //   // console.log("selectedDate", newDate);
  //   data?.forEach((data) => {
  //     slots.push({
  //       fromTime: moment(data.fromTime).format("HH:mm:ss"),
  //       toTime: moment(data.toTime).format("HH:mm:ss"),
  //       noOfSlots: data.noOfSlots,
  //      slotDate: watch("slotDate"),
  //     });
  //   });

  //   const reqBody = { slots: [...slots] };

  //   console.log("reqBody",reqBody)

  //   // Save
  //   console.log("save", btnSaveText);
  //   if (btnSaveText === "Save") {
  //     axios
  //       .post(`${urls.RENPURL}/mstSlot/save`, reqBody)
  //       .then((r) => {
  //         if (
  //           r?.status == 200 ||
  //           res?.status == 201 ||
  //           res?.status == "SUCCESS"
  //         ) {
  //           setLoadderState(false);
  //           swal("Slots!", "slot added successfully !", "success");

  //           if(router?.query?.pageMode == "Maintaince"){
  //             router.push(
  //               "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
  //             );
  //           } else{
  //             router.push(
  //               "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
  //             );
  //           }


  //           // console.log("res", r);
  //         } else {
  //           setLoadderState(false);
  //           ////
  //         }
  //       })
  //       .catch((errors) => {
  //         setLoadderState(false);
  //         //
  //       });
  //    }
  // };

  // getApplicationInfo for site visit data and Id for maintenace
  //   const getApplicationInfo =(id)=>{
  //     console.log("router?.query?.id",router?.query?.id);
  //     if(id){
  //     axios
  //     .get(`${urls.RENPURL}/nocPermissionForMaintenance/getById?id=${id}`, {
  //     }).then((r) => {
  //       let result = r?.data?.appointmentScheduleReschedule?.id;
  //       console.log("finalBodyMaintenance11", r?.data?.appointmentScheduleReschedule);
  //       setPriviousIdMaintenace(result)
  //       // setDataSource(result)
  //   //  
  //   })
  // }
  // }
  //getApplicationInfo for site visit data and Id for new form
  //   const getApplicationInfoForFirstForm =(id)=>{
  //     console.log("router?.query?.id",router?.query?.id);
  //     if(id){
  //     axios
  //     .get(`${urls.RENPURL}/trnExcavationRoadCpmpletion/getDataById?id=${id}`, {
  //     }).then((r) => {
  //       let result = r?.data?.appointmentScheduleReschedule?.id;
  //       console.log("appfor new",r?.data?.appointmentScheduleReschedule?.id);
  //       setPriviousIdFirstForm(result)
  //       // setDataSource(result)

  //   })
  // }
  // }
  // useEffect(()=>{
  // if(router?.query?.pageMode == "NewReschedule"){

  //   getApplicationInfoForFirstForm(router?.query?.id)
  // }else{

  //   getApplicationInfo(router?.query?.id)
  // }

  // },[router?.query?.id])


  // Get Slot
  // const getSlot = (selectedDate) => {
  //   setLoadderState(true);
  //   axios
  //     .get(`${urls.RENPURL}/mstSlot/getByDate?slotDate=${selectedDate}`)
  //     .then((r) => {
  //       if (
  //         r?.status == 200 ||
  //         res?.status == 201 ||
  //         res?.status == "SUCCESS"
  //       ) {
  //         setLoadderState(false);
  //         if (r?.data?.slots?.length != 0) {
  //           r?.data?.slots?.map((row) => {
  //             console.log("object23432", row);
  //             appendUI(
  //               row?.id,
  //               moment(row?.fromTime, "HH:mm:ss"),
  //               moment(row?.toTime, "HH:mm:ss") /* .format('hh:mm:ss A') */,
  //               row?.noOfSlots,
  //               row?.slotDate
  //             );
  //           });
  //           setHaveData(true);
  //         } else {
  //           appendUI(null, null, null, "", null);
  //         }
  //       } else {
  //         setLoadderState(false);
  //         //
  //       }
  //     })
  //     .catch((errors) => {
  //       setLoadderState(false);
  //       //
  //     });
  //   setLoadderState(false);
  // };

  // bookApptSubmit
  // const bookApptSubmit = (data) => {
  //   // setLoadderState(true);
  //   console.log("data 1212121", data);
  //   let tokenNo = getValues("tokenNo");

  //   // let finalBody;
  //   // let url = null;

  //   // issuance
  //  const finalBody = {
  //     ...data,
  //     tokenNo,
  //     // applicationId:applicationId,
  //     appointmentType: "S",
  //     jeNumber:jeNumber,
  //     jeName:jeName,
  //     maintenancId:null
  //     // slotDate:
  //   };
  //  const finalBodyMaintenance = {
  //     ...data,
  //     tokenNo,
  //     applicantId:null,
  //     applicationId:null,
  //     appointmentType: "S",
  //     jeNumber:jeNumber,
  //     jeName:jeName
  //     // slotDate:
  //   };
  //  const rescheduleBody = {
  //     ...data,
  //     tokenNo,
  //     applicantId:null,
  //     applicationId:null,
  //     appointmentType: "S",
  //     jeNumber:jeNumber,
  //     jeName:jeName,
  //     id:priviousIdMaintenace,
  //     activeFlag:"Y"
  //     // slotDate:
  //   };

  //  const NewRescheduleBody = {
  //     ...data,
  //     tokenNo,
  //   id:priviousIdFirstForm,

  //     // applicantId:null,
  //     // applicationId:null,
  //     maintenancId:null,
  //     appointmentType: "S",
  //     jeNumber:jeNumber,
  //     jeName:jeName,
  //     activeFlag:"Y"
  //     // slotDate:
  //   };

  //   if (router?.query?.pageMode == "Reschedule") {
  //     console.log("finalBodyMaintenance", rescheduleBody,priviousIdMaintenace);
  //     axios
  //       .post(`${urls.RENPURL}/nocPermissionForMaintenance/appointmentReschedule`, rescheduleBody)
  //       .then((res) => {
  //         if (
  //           res?.status == 200 ||
  //           res?.status == 201 ||
  //           res?.status == "SUCCESS"
  //         ) {
  //           setLoadderState(false);
  //           res?.data?.id
  //             ? sweetAlert("Slot !", "slot booked successfully", "success")
  //             : sweetAlert("Slot !", "slot booked successfully", "success");
  //             if(router?.query?.pageMode == "Maintaince"){
  //               router.push(
  //                 "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
  //               );
  //             } else{
  //               router.push(
  //                 "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
  //               );
  //             }
  //         } else {
  //           setLoadderState(false);
  //           //
  //         }
  //         seteAppointmentBookModal(false);
  //         setLoadderState(false);
  //       })
  //       .catch((errors) => {
  //         setLoadderState(false);
  //         //
  //       });
  //     }else if (router?.query?.pageMode == "Maintaince") {
  //   axios
  //     .post(`${urls.RENPURL}/mstSlot/bookNowMaintenanc`, finalBodyMaintenance)
  //     .then((res) => {
  //       if (
  //         res?.status == 200 ||
  //         res?.status == 201 ||
  //         res?.status == "SUCCESS"
  //       ) {
  //         setLoadderState(false);
  //         res?.data?.id
  //           ? sweetAlert("Slot !", "slot booked successfully", "success")
  //           : sweetAlert("Slot !", "slot booked successfully", "success");
  //           if(router?.query?.pageMode == "Maintaince"){
  //             router.push(
  //               "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
  //             );
  //           } else{
  //             router.push(
  //               "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
  //             );
  //           }
  //       } else {
  //         setLoadderState(false);
  //         //
  //       }
  //       seteAppointmentBookModal(false);
  //       setLoadderState(false);
  //     })
  //     .catch((errors) => {
  //       setLoadderState(false);
  //       //
  //     });
  //   }else if(router?.query?.pageMode == "NewReschedule"){
  //     console.log("NewRescheduleBody",NewRescheduleBody);
  //     axios
  //     .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/appointmentReschedule`, NewRescheduleBody)
  //     .then((res) => {
  //       if (
  //         res?.status == 200 ||
  //         res?.status == 201 ||
  //         res?.status == "SUCCESS"
  //       ) {
  //         setLoadderState(false);
  //         res?.data?.id
  //           ? sweetAlert("Slot !", "slot booked successfully", "success")
  //           : sweetAlert("Slot !", "slot booked successfully", "success");
  //           if(router?.query?.pageMode == "Maintaince"){
  //             router.push(
  //               "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
  //             );
  //           } else{
  //             router.push(
  //               "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
  //             );
  //           }
  //       } else {
  //         setLoadderState(false);
  //         //
  //       }
  //       seteAppointmentBookModal(false);
  //       setLoadderState(false);
  //     })
  //     .catch((errors) => {
  //       setLoadderState(false);
  //       //
  //     });

  //   }else{
  //     console.log("finalBody11",finalBody);
  //     axios
  //     .post(`${urls.RENPURL}/mstSlot/bookNow`, finalBody)
  //     .then((res) => {
  //       if (
  //         res?.status == 200 ||
  //         res?.status == 201 ||
  //         res?.status == "SUCCESS"
  //       ) {
  //         setLoadderState(false);
  //         res?.data?.id
  //           ? sweetAlert("Slot !", "slot booked successfully", "success")
  //           : sweetAlert("Slot !", "slot booked successfully", "success");
  //           if(router?.query?.pageMode == "Maintaince"){
  //             router.push(
  //               "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
  //             );
  //           } else{
  //             router.push(
  //               "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
  //             );
  //           }
  //       } else {
  //         setLoadderState(false);
  //         //
  //       }
  //       seteAppointmentBookModal(false);
  //       setLoadderState(false);
  //     })
  //     .catch((errors) => {
  //       setLoadderState(false);
  //       //
  //     });
  //   }
  //   setLoadderState(false);
  // };

  // useEffect(() => {
  //   console.log("props", props);
  // }, [props]);

  // useEffect(() => {
  //   console.log(" applicationId ", applicationId);
  // }, [applicationId]);

  // UseEffect
  // useEffect(() => {
  //   setdisabled(haveData);
  // }, [haveData]);

  // useEffect(() => {}, [loadderState]);

  //*****************Code in use******************* */

  const onSubmitForm = (data) => {
    console.log("pratiksha", data)
    let tokenNo = getValues("tokenNo");
    setLoadderState(true)
    // console.log("pratiksha", fromTime: moment(formData.srFromTime).format("HH:mm:ss"),
    // toTime: moment(formData.srToTime).format("HH:mm:ss"))
    const finalData = {
      siteVisitDate: data.siteVisitDate,
      fromTime: moment(data.fromTime).format("HH:mm:ss"),
      toTime: moment(data.toTime).format("HH:mm:ss"),
      jeNumber: jeNumber,
      jeName: jeName,
      tokenNo,
      applicationId: router.query.id,
      //     // applicationId:applicationId,
      appointmentType: "S",
      //     jeNumber:jeNumber,
      //     jeName:jeName,
      // maintenancId: null
    }
    const finalBodyMaintenance = {
          // ...data,
          siteVisitDate: data.siteVisitDate,
          fromTime: moment(data.fromTime).format("HH:mm:ss"),
          toTime: moment(data.toTime).format("HH:mm:ss"),
          tokenNo,
          maintenancId:router.query.id,
          // applicationId:null,
          appointmentType: "S",
          jeNumber:jeNumber,
          jeName:jeName
          // slotDate:
        }
    console.log("pratiksha11", finalData)
    if (router?.query?.pageMode == "Maintaince") {
      axios
        .post(`${urls.RENPURL}/mstSlot/bookNowMaintenanc`, finalBodyMaintenance,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (
            res?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setLoadderState(false);
            if (router?.query?.mode == "ReSchedule") {
              language == "en"
              ? sweetAlert("Appointment Rescheduled Successfully", "success")
              : sweetAlert( "भेटीची पुनर्नियुक्ती यशस्वीरित्या केली", "success");
              
            } else {
              language == "en"
              ? sweetAlert("Appointment Scheduled Successfully", "success")
              : sweetAlert( "नियोजित भेट यशस्वीरित्या", "success");
            }
            // if (router?.query?.pageMode == "Maintaince") {
              router.push(
                "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
              );
            // } else {
            //   router.push(
            //     "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
            //   );
            // }
          }
        }
        ).catch((error) => {
          setLoadderState(false);
          console.log("sdfsf", error?.response?.data?.status);
          let errormsg = error?.response?.data?.status?.error
          let errorFtime = moment(error?.response?.data?.status?.fromTime, "HH:mm:ss").format("hh:mm A");
          let errorTtime = moment(error?.response?.data?.status?.toTime, "HH:mm:ss").format("hh:mm A");
          if (errormsg == "already has schedule for given date and time") {
            language == "en"
              ? sweetAlert("OOPS !", `The site visit has been scheduled for selected time. Please try for another time.`)
              : sweetAlert("OOPS !", `साइट भेट निवडलेल्या वेळेसाठी शेड्यूल केली आहे. कृपया दुसर्‍या वेळेसाठी प्रयत्न करा.`)
          }
          callCatchMethod(error, language);
        });} else  {axios
            .post(`${urls.RENPURL}/mstSlot/bookNow`, finalData,{
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              if (
                res?.status == 200 ||
                res?.status == 201 ||
                res?.status == "SUCCESS"
              ) {
                setLoadderState(false);
                res?.data?.id
                  ? sweetAlert("Slot !", "slot booked successfully", "success")
                  : sweetAlert("Slot !", "slot booked successfully", "success");
                // if (router?.query?.pageMode == "Maintaince") {
                //   router.push(
                //     "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
                //   );
                // } else {
                  router.push(
                    "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
                  );
                // }
              } else {
                setLoadderState(false);
                //
              }
              seteAppointmentBookModal(false);
              setLoadderState(false);
            })
            .catch((error) => {
              setLoadderState(false);
              console.log("sdfsf", error?.response?.data?.status);
              let errormsg = error?.response?.data?.status?.error
              let errorFtime = moment(error?.response?.data?.status?.fromTime, "HH:mm:ss").format("hh:mm A");
              let errorTtime = moment(error?.response?.data?.status?.toTime, "HH:mm:ss").format("hh:mm A");
              if (errormsg == "already has schedule for given date and time") {
                language == "en"
                  ? sweetAlert("OOPS !", `The site visit has been scheduled for selected time. Please try for another time.`)
                  : sweetAlert("OOPS !", `साइट भेट निवडलेल्या वेळेसाठी शेड्यूल केली आहे. कृपया दुसर्‍या वेळेसाठी प्रयत्न करा.`)
              }
              callCatchMethod(error, language);
            });}
        }


console.log("timedfgfs", watch("fromTime"), watch("toTime"));
      // View
      return (
        <>
          {/** Calender Picker */}
          {loadderState ? (
            <Loader />
          ) : (
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 10,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>
                      {<FormattedLabel id="siteVisitAppointmentSchedule" />}
                    </strong>
                  </div>
                  <Grid
                    container
                    columns={{ xs: 5, sm: 10, md: 12 }}
                    className={styles.feildres}
                    spacing={2}
                  >
                    <Grid item xs={5} className={styles.feildres}>
                      <FormControl
                        sx={{
                          marginTop: 0,
                          alignItems: "center",
                          // backgroundColor: "white",
                          width: "84%",
                        }}
                        error={!!errors.siteVisitDate}
                      >
                        <Controller
                          control={control}
                          name="siteVisitDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                // disabled={inputState}
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    {/* {<FormattedLabel id="visitDate" />} */}
                                    {language == "en"
                                      ? "Site Visit Date"
                                      : "क्षेत्र भेट देण्याची तारीख"
                                    }
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(moment(date).format("YYYY-MM-DD"))
                                }
                                selected={field.value}
                                center
                                shouldDisableDate={isWeekend}
                                minDate={new Date()}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.siteVisitDate ? errors.siteVisitDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      container
                      columns={{ xs: 5, sm: 10, md: 12 }}
                      className={styles.feildres}
                      spacing={2}
                    >
                      <Grid item xs={5} className={styles.feildres}>
                        <FormControl
                          sx={{
                            width: "84%",
                            alignItems: "center",
                          }}
                          error={!!errors.fromTime}
                        >
                          <Controller
                            // format="HH:mm:ss"

                            control={control}
                            name="fromTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={<FormattedLabel id="fromTime" />}
                                  value={field.value}
                                  onChange={(time) => field.onChange(time)}
                                  // onChange={(time) => {
                                  // moment(
                                  //   field.onChange(time),
                                  //   "HH:mm:ss a"
                                  // ).format("HH:mm:ss a");
                                  // }}
                                  selected={field.value}
                                  renderInput={(params) => (
                                    <TextField size="small" {...params} />
                                  )}
                                  defaultValue={null}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.fromTime ? errors.fromTime.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={5} className={styles.feildres}>
                        <FormControl
                          sx={{
                            width: "84%",
                            alignItems: "center",
                            // backgroundColor: "white" 
                          }}
                          error={!!errors.toTime}
                        >
                          <Controller
                            control={control}
                            name="toTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={<FormattedLabel id="toTime" />}
                                  value={field.value}
                                  onChange={(time) => field.onChange(time)}
                                  selected={field.value}
                                  renderInput={(params) => (
                                    <TextField size="small" {...params} />
                                  )}
                                  defaultValue={null}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.toTime ? errors.toTime.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid item xs={5} className={styles.feildres}>
                      <Button
                        type="submit"
                      //  size="small"
                      //  variant="outlined"
                      //  className={styles.button}
                      //  endIcon={<SaveIcon />}
                      >{language == "en" ? "Book Now" : "त्वरा करा"}</Button>
                    </Grid>
                    <Grid item xs={5} className={styles.feildres}>
                      <Button
                        onClick={() => { router.push("/roadExcavation/dashboard/siteVisitDashboard") }}
                      //  size="small"
                      //  variant="outlined"
                      //  className={styles.button}
                      //  endIcon={<SaveIcon />}
                      >{language == "en" ? "Go To Dashboard" : "डॅशबोर्ड"}</Button>
                    </Grid>
                    <Grid item xs={5} className={styles.feildres}>
                      <Button
                        onClick={() => { router.back() }}
                      //  size="small"
                      //  variant="outlined"
                      //  className={styles.button}
                      //  endIcon={<SaveIcon />}
                      >{language == "en" ? "Exit" : "बाहेर पडा"}</Button>
                    </Grid>
                  </Grid>

                </form></FormProvider>











              {/* ........................................... */}


            </ThemeProvider>
          )}
        </>
      );
    };

    export default SiteVisitSchedule;


