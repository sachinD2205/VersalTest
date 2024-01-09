import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./goshwara.module.css";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import Loader from "../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  let router = useRouter();
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu)
  );
  const language = useSelector((state) => state.labels.language);
  const [route, setRoute] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  let totalPrice = 0;
  for (const item of tableData) {
    totalPrice += item?.total;
  }
  console.log("Total Price:", totalPrice);
  const token = useSelector((state) => state.user.user.token);

  const [loading, setLoading] = useState(false);

  // console.log("menuLabel",menuLabel);

  const {
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
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
  const componentRef = useRef();

  const [dataSource, setDataSource] = useState([]);

  const [magazineNewspapertypeList, setMagazineNewspapertypeList] = useState(
    []
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const getLibraryKeys = () => {
  //   axios
  //     .get(
  //       `${urls.LMSURL}/trnApplyForNewMembership/getAllByServiceId?serviceId=${85}`,

  //     )
  //     .then((r) => {
  //       setDataSource(
  //         r.data.trnApplyForNewMembershipList.map((row) => ({
  //           id: row.id,
  //           ...row
  //         })),
  //       )
  //     })
  // }

  const backToHomeButton = () => {
    router.push("/lms/dashboard");
  };

  const setMasterList = () => {
    setLoading(true);
    axios
      .get(`${urls.LMSURL}/magazineNewspaperType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        console.table("magazineNewspaperType/getAll", response.data);
        if (
          !response.data ||
          !response.data.magazineNewspaperTypeMasterDaoList ||
          response.data.magazineNewspaperTypeMasterDaoList.length === 0
        ) {
          throw new Error("Magazine/Newspaper entries not found");
        }
        setMagazineNewspapertypeList(
          response?.data?.magazineNewspaperTypeMasterDaoList
        );
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    if (
      (watch("fromDate") && watch("toDate"), watch("magazineNewspaperName"))
    ) {
      // console.log(
      //   "show list",
      //   moment(watch("fromDate")).format("DD/MM/YYYY"),
      //   moment(watch("toDate")).format("DD/MM/YYYY"),
      // );
      setLoading(true);
      axios
        .get(
          // `${urls.LMSURL}/libraryMembership/getAllByServiceId?serviceId=${85}`
          `${
            urls.LMSURL
          }/trnDailyMagazineNewsPaperEntry/getAllByFromDateAndToDateAndMagazineNewspaperTypeKey?fromDate=${moment(
            watch("fromDate")
          ).format("DD/MM/YYYY")}&toDate=${moment(watch("toDate")).format(
            "DD/MM/YYYY"
          )}&magazineNewspaperTypeKey=${watch("magazineNewspaperName")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          setLoading(false);
          let res = r?.data?.trnDailyMagazineNewsPaperEntryList;
          let tempCount = 0;
          for (const item of res) {
            tempCount += item?.total;
          }
          let temp = res?.map((evt, i) => {
            return {
              srNo: i + 1,
              magazineNewspaperTypeName: evt?.magazineNewspaperTypeName,
              price: evt?.price,
              quantity: evt?.quantity,
              total: evt?.total,
            };
          });
          // console.log("__temp", tempCount);
          setTotalCount(Number(tempCount) ?? 0);
          setTableData(temp ?? []);
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  }, [watch("fromDate"), watch("toDate"), watch("magazineNewspaperName")]);

  useEffect(() => {
    setMasterList();
  }, []);
  let tableColumns = [
    {
      field: "srNo",
      headerName: language === "en" ? "Sr.No" : "अ.क्र",
      width: 100,
    },
    {
      field: "magazineNewspaperTypeName",
      headerName:
        language === "en" ? "Magazine / Newspaper" : "मासिक / वर्तमानपत्र",
      width: 220,
    },
    {
      field: "price",
      headerName: language === "en" ? "Price" : "किंमत",
      width: 100,
    },
    {
      field: "quantity",
      headerName: language === "en" ? "Quantity" : "प्रमाण",
      width: 150,
    },
    {
      field: "total",
      headerName: language === "en" ? "Total " : "एकूण",
      width: 150,
    },
  ];
  return (
    <>
      <Paper
        sx={{
          padding: "5vh",
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <Box>
          <BreadcrumbComponent />
        </Box>
        <LmsHeader
          language={language}
          enName="Daily Event Magazine Newspaper Report"
          mrName="दैनिक कार्यक्रम मासिक वृत्तपत्र अहवाल"
        />
        {loading ? (
          <Loader />
        ) : (
          <>
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={2.4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <Button
                  onClick={backToHomeButton}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  {language === "en" ? "Back To home" : "मुखपृष्ठ"}
                </Button>
              </Grid>
              <Grid
                item
                xs={2.4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 14 }}>
                              {language === "en"
                                ? "From Date"
                                : "या तारखेपासून"}{" "}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) =>
                            field.onChange(moment(date).format("YYYY-MM-DD"))
                          }
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
                </FormControl>
              </Grid>
              <Grid
                item
                xs={2.4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <FormControl sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 14 }}>
                              {language === "en" ? "To Date" : "या तारखेपर्यंत"}
                            </span>
                          }
                          value={field.value}
                          minDate={watch("fromDate")}
                          maxDate={new Date()}
                          onChange={(date) =>
                            field.onChange(moment(date).format("YYYY-MM-DD"))
                          }
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
                </FormControl>
              </Grid>
              <Grid
                item
                xs={2.4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                // xl={5} lg={5} md={5} sm={12} xs={12}
              >
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ marginTop: 0 }}
                  error={!!errors.libraryType}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {
                      <span style={{ fontSize: 14 }}>
                        {language === "en"
                          ? "Magazine/Newspaper"
                          : "मासिक/वृत्तपत्र"}
                      </span>
                    }
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        // sx={{ width: "90%" }}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          console.log("education", value.target.value);
                        }}
                        label={
                          language === "en"
                            ? "Magazine/Newspaper"
                            : "मासिक/वृत्तपत्र"
                        }
                      >
                        {magazineNewspapertypeList &&
                          magazineNewspapertypeList?.map((lib, index) => (
                            <MenuItem key={index} value={lib.id}>
                              {language == "en"
                                ? lib?.magazineNewspaperTypeName
                                : lib?.magazineNewspaperTypeName}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="magazineNewspaperName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.education ? errors.education.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={2.4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ float: "right" }}
                  onClick={handlePrint}
                >
                  {language === "en" ? "Print" : "प्रत काढा"}
                </Button>
              </Grid>
            </Grid>

            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ReportLayout
                centerHeader
                centerData
                rows={tableData}
                columns={tableColumns}
                columnLength={7}
                componentRef={componentRef}
                showDates
                date={{
                  from: moment(watch("fromDate")).format("DD-MM-YYYY"),
                  to: moment(watch("toDate")).format("DD-MM-YYYY"),
                }}
                deptName={{
                  en: "Library Management System",
                  mr: "ग्रंथालय व्यवस्थापन प्रणाली",
                }}
                reportName={{
                  en: "Daily Event Magazine Newspaper Report",
                  mr: "दैनिक कार्यक्रम मासिक वृत्तपत्र अहवाल",
                }}
                extraRows={
                  <>
                    <tr>
                      <td
                        className={styles.tableData}
                        colSpan={4}
                        // colSpan={tableColumns?.length - 1}
                        style={{ textAlign: "right" }}
                      >
                        {language === "en" ? "Total" : "एकूण"}
                      </td>
                      <td
                        className={styles.tableData}
                        style={{ textAlign: "center" }}
                      >
                        {totalCount}
                      </td>
                    </tr>
                  </>
                }
              />
            </div>
          </>
        )}
      </Paper>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <tbody className={styles.report}>
          <tr>
            <th colSpan={1}>
              {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
            </th>
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Application No"
                : "अर्ज क्र"}
            </th>
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Application Date"
                : "अर्जाची तारीख"}
            </th>
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Applicant Name"
                : "अर्जदाराचे नाव"}
            </th>
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Membership No"
                : "सदस्यत्व क्रमांक"}
            </th>
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Membership Start Date"
                : "सदस्यत्व सुरू होण्याची तारीख"}
            </th>
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Membership End Date"
                : "सदस्यत्व समाप्ती तारीख"}
            </th>
          </tr>
          {this?.props?.data?.dataSource &&
            this?.props?.data?.dataSource?.map((r, i) => (
              <>
                <tr>
                  <td>{i + 1}</td>
                  <td>{r?.applicationNumber}</td>
                  <td>
                    {r.applicationDate
                      ? moment(r?.applicationDate).format("DD-MM-YYYY")
                      : "-"}
                  </td>
                  <td style={{ textAlign: "left", paddingLeft: "5vh" }}>
                    {r?.applicantName}
                  </td>
                  <td>{r?.membershipNo}</td>
                  <td>
                    {r.startDate
                      ? moment(r?.startDate).format("DD-MM-YYYY")
                      : "-"}
                  </td>
                  <td>
                    {r.endDate ? moment(r?.endDate).format("DD-MM-YYYY") : "-"}
                  </td>
                </tr>
              </>
            ))}
        </tbody>
      </>
    );
  }
}

export default Index;
