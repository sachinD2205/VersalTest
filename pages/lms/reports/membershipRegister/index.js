import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
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
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.user.token);

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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // useEffect(() => {
  //   getLibraryKeys()
  // }, [])

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

  useEffect(() => {
    if (watch("fromDate") && watch("toDate")) {
      setLoading(true);
      console.log("Inside", watch("fromDate"), watch("toDate"));

      // const finalBody = {
      //   fromDate: watch('fromDate'),
      //   toDate: watch('toDate')
      // }

      axios
        .get(
          `${urls.LMSURL}/libraryMembership/getAllByServiceId?serviceId=${85}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          setLoading(false);
          let res = r.data.libraryMembershipList.map((row, index) => ({
            id: row.id,
            srNo: index + 1,
            ...row,
          }));
          let temp = res.filter(
            (obj) =>
              obj.applicationDate >= watch("fromDate") &&
              obj.applicationDate <= watch("toDate")
          );
          console.log("show list", temp);

          setDataSource(temp);
          setTableData(
            temp?.map((val) => {
              return {
                ...val,
                startDate: val?.startDate
                  ? moment(val?.startDate).format("DD-MM-YYYY")
                  : "-",
                endDate: val?.endDate
                  ? moment(val?.endDate).format("DD-MM-YYYY")
                  : "-",
                applicationDate: val?.applicationDate
                  ? moment(val?.applicationDate).format("DD-MM-YYYY")
                  : "-",
              };
            })
          );
          // setTableData(temp);
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  }, [watch("fromDate"), watch("toDate")]);

  let tableColumns = [
    {
      field: "srNo",
      headerName: language === "en" ? "Sr.No" : "अ.क्र",
      width: 100,
    },
    {
      field: "applicationNumber",
      headerName: language === "en" ? "Application No" : "अर्ज क्र",
      width: 220,
    },
    {
      field: "applicationDate",
      headerName: language === "en" ? "Application Date" : "अर्जाची तारीख",
      width: 100,
    },
    {
      field: "applicantName",
      headerName: language === "en" ? "Applicant Name" : "अर्जदाराचे नाव",
      width: 150,
    },
    {
      field: "membershipNo",
      headerName: language === "en" ? "Membership No" : "अर्जदाराचे नाव",
      width: 150,
    },
    {
      field: "startDate",
      headerName:
        language === "en"
          ? "Membership Start Date"
          : "सदस्यत्व सुरू होण्याची तारीख",
      width: 100,
    },
    {
      field: "endDate",
      headerName:
        language === "en" ? "Membership End Date" : "सदस्यत्व समाप्ती तारीख",
      width: 100,
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
          enName="Membership Register"
          mrName="सदस्यत्व नोंदणी"
        />
        {loading ? (
          <Loader />
        ) : (
          <>
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
                xs={3}
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
                            <span style={{ fontSize: 14 }}>From Date </span>
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
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <FormControl sx={{ marginTop: 0, marginLeft: "10vh" }}>
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={<span style={{ fontSize: 14 }}>To Date </span>}
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
                xs={3}
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
              {/* <ComponentToPrint
            data={{ dataSource, language, ...menu, route }}
            ref={componentRef}
          /> */}
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
                  en: "Membership Report",
                  mr: "सदस्यत्व अहवाल",
                }}
              >
                {/* <ComponentToPrint
              data={{ dataSource, language, ...menu, route }}
            /> */}
              </ReportLayout>
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
        {/* <div>
          <div>
            <Paper>
              <table className={styles.report}> */}
        {/* <thead className={styles.head}>
                  <tr>
                    <th colSpan={8}>
                      {
                        this?.props?.data?.language === 'en'
                          ? "Membership Register"
                          : "सदस्यत्व नोंदणी"
                      }

                    </th>
                  </tr>
                </thead> */}
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
                  <td>
                    {/* {this?.props?.data?.language === 'en'
                              ? r?.applicationNo
                              : r?.libraryNameMr} */}
                    {r?.applicationNumber}
                  </td>
                  <td>
                    {/* {this?.props?.data?.language === 'en'
                              ? r?.address
                              : r?.addressMr} */}
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
        {/* </table>
            </Paper>
          </div>
        </div> */}
      </>
    );
  }
}

export default Index;
