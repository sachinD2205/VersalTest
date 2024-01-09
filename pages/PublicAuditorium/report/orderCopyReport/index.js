import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import Paper from "@mui/material/Paper";
import CheckIcon from "@mui/icons-material/Check";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import { Box } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import styles from "../../../../styles/publicAuditorium/reports/[orderCopy].module.css";
import urls from "../../../../URLS/urls";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/publicAuditorium/reports/orderCopy";
import { yupResolver } from "@hookform/resolvers/yup";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

function OrderCopyReport() {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: "all",
    mode: "onChange",
  });

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu)
  );
  const [route, setRoute] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (event) => {
    console.log("eventevent", event);
    setSelectedOption(event.target.value);
  };

  const [data, setData] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);

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

  useEffect(() => {
    getAuditorium();
  }, []);

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe 4Au", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            ...row,
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const onSubmitFunc = (data) => {
    if (watch("applicationNumber")) {
      setLoading(true);
      axios
        .get(
          `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo`,
          {
            params: {
              applicationNo: watch("applicationNumber"),
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            setData(res?.data);
            setLoading(false);
          } else {
            setData([]);
            sweetAlert("Something Went Wrong!");
            setLoading(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setData([]);
          setLoading(false);
          callCatchMethod(err, language);
        });
    } else {
      sweetAlert({
        title: "Oops!",
        text: "Application number is required!",
        icon: "warning",
        // buttons: ["No", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setData([]);
    }
  };

  let resetValuesCancell = {
    applicationNumber: null,
  };

  let onCancel = () => {
    setSelectedOption(null),
      reset({
        ...resetValuesCancell,
      });
    router.push("/PublicAuditorium/dashboard");
  };

  const onClearFunc = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  return (
    <Paper>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <PabbmHeader
        language={language}
        enName="Order Copy Report"
        mrName="ऑर्डर प्रत अहवाल"
      />
      <form onSubmit={handleSubmit(onSubmitFunc)}>
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <Grid
              container
              sx={{
                padding: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "30%" }}
                size="small"
                id="outlined-basic"
                label={<FormattedLabel id="applicationNumber" />}
                variant="outlined"
                placeholder="2314064363"
                style={{ backgroundColor: "white" }}
                {...register(`applicationNumber`)}
                error={!!errors.applicationNumber}
                helperText={
                  errors?.applicationNumber
                    ? errors.applicationNumber.message
                    : null
                }
              />
            </Grid>
          )}
        </Box>
        <Grid
          container
          style={{
            padding: "10px",
          }}
        >
          <Grid
            item
            xs={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              variant="contained"
              color="primary"
              endIcon={<CleaningServicesIcon />}
              onClick={onClearFunc}
            >
              <FormattedLabel id="clear" />
            </Button>
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="success"
              endIcon={<RunningWithErrorsIcon />}
            >
              <FormattedLabel id="process" />
            </Button>
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper elevation={4} style={{ width: "auto" }}>
              <Button
                onClick={onCancel}
                size="small"
                variant="contained"
                color="error"
                endIcon={<ClearIcon />}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
      <div>
        {data.length !== 0 ? (
          <>
            <ComponentToPrint
              ref={componentRef}
              data={data}
              auditoriums={auditoriums}
            />
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Paper elevation={4} style={{ width: "auto" }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ size: "23px" }}
                    type="primary"
                    onClick={handlePrint}
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </Paper>
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Paper elevation={4} style={{ width: "auto" }}>
                  <Button
                    onClick={onCancel}
                    size="small"
                    variant="contained"
                    color="error"
                    endIcon={<ClearIcon />}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </>
        ) : (
          ""
        )}
      </div>
    </Paper>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    console.log("props", this.props);
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src="/logo.png" alt="" height="80vh" width="80vw" />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h2>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="80vh"
                  width="80vw"
                />
              </Grid>
            </Grid>
            <div>
              <h2 className={styles.heading}>
                <b>प्रेक्षागृह बुकिंग आदेश</b>
              </h2>
            </div>

            <div
              className={styles.two}
              style={{
                marginTop: "2vh",
                marginLeft: "5vh",
                marginRight: "5vh",
              }}
            >
              <div className={styles.date3}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "" }}>
                    {" "}
                    <b>एलओआय क्र : {}</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {this?.props?.data?.LoiNo
                        ? this?.props?.data?.LoiNo
                        : "-"}
                    </b>
                  </h4>
                </div>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "6vh" }}>
                    {" "}
                    <b>दिनांक :</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(this?.props?.data?.eventDate).format(
                          "DD-MM-YYYY"
                        )}
                    </b>{" "}
                    {/* <b>{router?.query?.appointmentDate}</b> */}
                  </h4>
                </div>
              </div>
              <div className={styles.date2}>
                <h4>अर्जाचा क्रमांक : </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.data?.applicationNumber}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>अर्ज दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " +
                      moment(this?.props?.data?.eventDate).format("DD-MM-YYYY")}
                  </b>{" "}
                  {/* {this?.props?.data?.applicationDate} */}
                </h4>
              </div>

              <p>
                <b>
                  <h3>प्रति,</h3>
                  <div className={styles.date2}>
                    <h3 style={{ marginLeft: "15px" }}>
                      {this?.props?.data?.applicantName}
                      <br></br>
                      {this?.props?.data?.applicantFlatHouseNo}
                      {" ,"}
                      {this?.props?.data?.applicantFlatBuildingName}
                      {" ,"}
                      {this?.props?.data?.applicantLandmark} {","}
                      {this?.props?.data?.applicantArea} {","}
                      {/* <br></br> */}
                      {this?.props?.data?.applicantCity} {","}
                      {this?.props?.data?.applicantState}
                      {","}
                      {this?.props?.data?.applicantPinCode}
                      {"."}
                    </h3>
                  </div>
                  <p>
                    <b>
                      <h3 style={{ paddingLeft: "10%", fontWeight: 900 }}>
                        विषय :- प्रेक्षागृह / नाट्यगृह बुकिंग
                      </h3>
                      <h3 style={{ paddingLeft: "10%" }}>
                        संदर्भ :- आपला अर्ज क्र{" "}
                        {this?.props?.data?.applicationNumber}, दिनांक -{" "}
                        {" " +
                          moment(this?.props?.data?.applicationDate).format(
                            "DD-MM-YYYY"
                          )}
                        ,
                      </h3>
                    </b>
                  </p>
                  महोदय/महोदया,
                  <br /> आपल्या वरील संदर्भीय अर्जान्वये केलेली अधिकृत पिंपरी
                  चिंचवड महापालिकेच्या सार्वजनिक प्रेक्षागृह / नाट्यगृह बुकिंग
                  ची विनंती यशस्वीरित्या मान्य झाली आहे.
                </b>
              </p>
              <div className={styles.date2}>
                <h4>कार्यक्रमाचे नाव:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>{this?.props?.data?.eventTitle}</b>
                </h4>
              </div>
              <div className={styles.date2}>
                <h4>प्रेक्षागृह / नाट्यगृह नाव:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {this?.props?.auditoriums.length > 0
                      ? this?.props?.auditoriums?.find((obj) => {
                          return obj?.id == this?.props?.data?.auditoriumId;
                        })?.auditoriumNameMr
                      : "-"}
                  </b>
                </h4>
              </div>
              {this?.props?.data?.timeSlotList &&
                JSON?.parse(this?.props?.data?.timeSlotList)?.map(
                  (val, index) => {
                    return (
                      <div
                        style={{ display: "flex", flexDirection: "row" }}
                        key={index}
                      >
                        <div className={styles.date2}>
                          <h4>कार्यक्रमाची तारीख:</h4>{" "}
                          <h4 style={{ marginLeft: "10px" }}>
                            <b>
                              {moment(val?.bookingDate).format("DD-MM-YYYY")}
                            </b>
                          </h4>
                          <h4 style={{ marginLeft: "10px" }}>
                            <b></b>
                          </h4>
                        </div>
                        <div className={styles.date2}>
                          <h4>कार्यक्रमाची वेळ:</h4>{" "}
                          <h4 style={{ marginLeft: "10px" }}>
                            <b>
                              {val?.fromTime} To {val?.toTime}
                            </b>
                          </h4>
                          <h4 style={{ marginLeft: "10px" }}>
                            <b></b>
                          </h4>
                        </div>
                        <div className={styles.date2}>
                          <h4>कार्यक्रमाचा दिवस:</h4>{" "}
                          <h4 style={{ marginLeft: "10px" }}>
                            <b>{moment(val?.bookingDate).format("dddd")}</b>
                          </h4>
                        </div>
                      </div>
                    );
                  }
                )}

              {/* <div className={styles.date2}>
                <h4>नियोजित तास:</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {
                      this?.props?.auditoriums?.find((obj) => {
                        return obj?.id == this?.props?.data?.auditoriumId;
                      })?.auditoriumNameMr
                    }
                  </b>
                </h4>
              </div> */}
              <div className={styles.date2}>
                <h4>दिनांक :</h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" " +
                      moment(this?.props?.data?.eventDate).format("DD-MM-YYYY")}
                  </b>
                </h4>
              </div>
              <p>
                <b>
                  टीप - सार्वजनिक प्रेक्षागृह बुकिंग पावती मध्ये काही त्रुटी
                  आढळल्यास सदर माहिती संबंधित कार्यालयास कळवण्यात यावी.
                  (पिं.चिं.मनपा हेल्पलाइन क्रमांक - 8888006666)
                </b>
              </p>

              <hr />

              <Grid container>
                <Grid
                  item
                  xs={4}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>
                    इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                  </h5>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <img src="/qrcode1.png" alt="" height="50vh" width="50vw" />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <img src="/barcode.png" alt="" height="35vh" width="60vw" />
                </Grid>
              </Grid>

              {/* <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                  <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                  <h5> महाराष्ट्र, भारत</h5>
                </div>
                <div className={styles.add1}>
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
                </div>
                <div className={styles.logo1}>
                  <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                </div>
                <div className={styles.logo1}>
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default OrderCopyReport;
