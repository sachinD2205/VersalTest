import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
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
import sweetAlert from "sweetalert";
import styles from "./view.module.css";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";

function Index() {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu)
  );
  const [route, setRoute] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDepartment();
    getFacilityName();
    // getSportsBookingData();
  }, [facilityNames]);

  const getDepartment = () => {
    axios.get(`${urls.CfcURLMaster}/department/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((res) => {
      console.log("dept", res);
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        }))
      );
    });
  };
  const [facilityNames, setFacilityNames] = useState([]);
  const getFacilityName = () => {
    axios.get(`${urls.SPURL}/facilityName/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityNameMr: row.facilityNameMr,
          // facilityType: row.facilityType,
        }))
      );
    });
  };

  const getSportsBookingData = (
    fromDate,
    toDate,
    _pageSize = 10,
    _pageNo = 0
  ) => {
    console.log("fromDate, toDate", fromDate, toDate);
    setLoading(true);
    axios
      .get(`${urls.SPURL}/report/getDataBySports`, {
        params: {
          fromDate: moment(fromDate).format("YYYY-MM-DD"),
          toDate: moment(toDate).format("YYYY-MM-DD"),
        },
      },{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res, i) => {
        setLoading(false);
        console.log("fromTo", res);
        setDataSource(
          res?.data?.map((r, i) => {
            console.log("fromTo34", r);
            return { srNo: i + 1, ...r };
          })
        );

        if (res?.data?.length === 0) {
          toast("No Data Available", {
            type: "error",
          });
        }

        let result = res?.data;
        let _res = result?.map((r, index) => {
          return {
            ...r,

            id: r.id,
            srNo: _pageSize * _pageNo + index + 1,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            applicationNumber: r.applicationNumber,
            name: r.applicantName,
            bookingDate: r.bookingDate,
            // applicationDate: r.applicationDate
            //   ? moment(r.applicationDate).format("DD-MM-YYYY")
            //   : "Not Available",
            mobileNumber: r.mobileNumber,
            facilityName: facilityNames?.find(
              (obj) => obj?.id === r.facilityName
            )?.facilityName,
            fromBookingTime: moment(r.fromBookingTime).format("hh:mm A"),
            toBookingTime: r.toBookingTime,
          };
        });
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      }).catch((err) => {
        setData([]);
        setLoading(false);
        catchMethod(err);
      })
  };
  const catchMethod = (err) => {
    console.log("error ", err);
    if (err?.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server Is Unreachable Or May Be A Network Issue, Please Try After Sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err?.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized Access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      flex: 1,
      maxWidth: 60,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: "From Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: "To Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
  ];

  return (
    <>
     <>
        <BreadcrumbComponent />
      </>
    <Paper>
      <Grid
        container
        sx={{
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            onClick={() => {
              router.push("/sportsPortal/dashboard");
            }}
            variant="contained"
            color="primary"
          >
            {language === "en" ? "Back To home" : "मुखपृष्ठ"}
          </Button>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>
            {language === "en"
              ? "All Event Pending Details"
              : "सर्व कार्यक्रम प्रलंबित तपशील"}
          </h2>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            {language === "en" ? "Print" : "प्रत काढा"}
          </Button>
        </Grid>
      </Grid>

      <Box>
        {loading ? (
          <CommonLoader />
        ) : (
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <FormControl style={{ marginTop: 10 }}>
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            {" "}
                            {language === "en" ? "From Date" : "पासून"}
                          </span>
                        }
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        center
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
                  {/* {errors?.fromDate ? errors.fromDate.message : null} */}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <FormControl style={{ marginTop: 10 }}>
                <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            {" "}
                            {language === "en" ? "To Date" : "पर्यंत"}
                          </span>
                        }
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        center
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
                  {/* {errors?.toDate ? errors.toDate.message : null} */}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Box>

      <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="small"
          disabled={watch("fromDate") == null || watch("toDate") == null}
          onClick={() => {
            getSportsBookingData(watch("fromDate"), watch("toDate"));
          }}
        >
          {language === "en" ? "Search" : "शोधा"}
        </Button>
      </Grid>

      <Box sx={{ paddingTop: "10px" }}>
        <ComponentToPrint
          data={{
            dataSource,
            facilityNames,
            language,
            ...menu,
            route,
            departments,
          }}
          ref={componentRef}
        />
      </Box>
    </Paper>
    </>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div>
          <div>
            <Paper>
              <table className={styles.report}>
                <thead className={styles.head}>
                  {/* <tr>
                    <th colSpan={11}>
                      {this?.props?.data?.language === "en"
                        ? this.props.data.menuNameEng
                        : this.props.data.menuNameMr}
                    </th>
                  </tr> */}
                </thead>
                <tbody>
                  <tr>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
                    </th>
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Application Number"
                        : "अर्ज क्रमांक"}
                    </th> */}
                    {/* <th colSpan={1}>{this?.props?.data?.language === "en" ? "To Date" : "आजपर्यंत"}</th> */}
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Department"
                        : "विभाग"}
                    </th>
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Department Name" : "विभागाचे नाव"}
                    </th> */}
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "1 To 7 Day"
                        : "1 ते 7 दिवस"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "7 To 15 Day"
                        : "7 ते 15 दिवस"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "15 To 21 Day"
                        : "15 ते 21 दिवस"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "21 To 30 Day"
                        : "21 ते 30 दिवस"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "More Than 30 Days"
                        : "30 दिवसांपेक्षा जास्त"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Total Pending (A-B+C-D)"
                        : "एकूण प्रलंबित (A-B+C-D)"}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicationNumber
                              : r?.applicationNumber}
                          </td>
                          <td>
                            {}
                            {this?.props?.data?.language === "en"
                              ? r?.applicantName
                              : r?.applicantName}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.bookingDate
                              : r?.bookingDate}
                          </td>
                          {/* <td>
                            {this?.props?.data?.language === "en"
                              ? (r?.facilityName === this?.props?.data?.facilityNames?.facilityName).this
                                  ?.props?.data?.facilityNames
                              : r?.facilityName}
                          </td> */}
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.serviceName
                              : r?.serviceName}
                          </td>

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.fromDate
                              : r?.fromDate}
                          </td>

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.toDate
                              : r?.toDate}
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}
export default Index;
