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
  //       `${urls.LMSURL}/trnBookIssueReturn/getAll`,
  //     )
  //     .then((r) => {
  //       setDataSource(
  //         r.data.trnBookIssueReturnList.map((row) => ({
  //           id: row.id,
  //           ...row
  //         })),
  //       )
  //     })
  // }

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
          `${urls.LMSURL}/trnBookIssueReturn/bookIssued?fromDate=${moment(
            watch("fromDate")
          ).format("YYYY-MM-DD")}&toDate=${moment(watch("toDate")).format(
            "YYYY-MM-DD"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          console.log("3345", r);
          setLoading(false);
          let res = r?.data?.map((row, index) => ({
            ...row,
            srNo: index + 1,
            id: row.id,
            issuedAt: row.issuedAt
              ? moment(row?.issuedAt).format("DD-MM-YYYY")
              : "-",
            returnedAt: row.returnedAt
              ? moment(row?.returnedAt).format("DD-MM-YYYY")
              : "-",
            issueRemark: row.issueRemark ? row.issueRemark : "-",
            returnRemark: row.returnRemark ? row.returnRemark : "-",
          }));
          // let temp = res.filter((obj) =>
          //   (obj.issuedAt >= watch('fromDate') && obj.issuedAt <= watch('toDate')) || (obj.returnedAt >= watch('fromDate') && obj.returnedAt <= watch('toDate'))
          // )
          // console.log("show list", res, temp);

          setDataSource(res);
          setTableData(res);
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
      field: "membershipNo",
      headerName: language === "en" ? "Membership No" : "सदस्यत्व क्र",
      width: 150,
    },
    {
      field: "bookName",
      headerName: language === "en" ? "Book Name" : "पुस्तकाचे नाव",
      width: 200,
    },
    {
      field: "issuedAt",
      headerName: language === "en" ? "Issued At" : "मुद्दा जारी केले",
      width: 150,
    },
    {
      field: "returnedAt",
      headerName: language === "en" ? "Returned At" : "परत केले",
      width: 150,
    },
    {
      field: "issueRemark",
      headerName: language === "en" ? "Issue Remark" : "मुद्दा टिप्पणी",
      width: 150,
    },
    {
      field: "returnRemark",
      headerName: language === "en" ? "Return Remark" : "परत टिप्पणी",
      width: 150,
    },
  ];

  const backToHomeButton = () => {
    router.push("/lms/dashboard");
  };
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
          enName="Book Issue / Return Register"
          mrName="पुस्तक जारी / परत रजिस्टर"
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
                            <span style={{ fontSize: 14 }}>
                              {language === "en"
                                ? "From Date "
                                : "या तारखेपासून"}
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
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl>
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
                              {language === "en"
                                ? "To Date  "
                                : "या तारखेपर्यंत"}
                            </span>
                          }
                          minDate={watch("fromDate")}
                          maxDate={new Date()}
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
                columnLength={5}
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
                  en: "Book Issue/Return Register",
                  mr: "पुस्तक जारी/रिटर्न रजिस्टर",
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
                    <th colSpan={9}>
                      {
                        this?.props?.data?.language === 'en'
                          ? "Book Issue/Return Register"
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
                ? "Membership No"
                : "सदस्यत्व क्र"}
            </th>
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Book Name"
                : "पुस्तकाचे नाव"}
            </th>
            {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Library Member Name' : 'ग्रंथालय सदस्याचे नाव'}
                    </th> */}
            {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Librarian Remark' : 'ग्रंथपाल टिप्पणी'}
                    </th> */}
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Issued At"
                : "मुद्दा जारी केले"}
            </th>
            {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Issue Remark' : 'मुद्दा टिप्पणी'}
                    </th> */}

            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Returned At"
                : "परत केले"}
            </th>
            {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Return Remark' : 'परत टिप्पणी'}
                    </th> */}
            {/* <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Fine' : 'वाचनालयाचे नाव'}
                    </th> */}
          </tr>
          {this?.props?.data?.dataSource &&
            this?.props?.data?.dataSource?.map((r, i) => (
              <>
                <tr>
                  <td>{i + 1}</td>
                  <td>{r?.membershipNo}</td>
                  <td style={{ textAlign: "left", paddingLeft: "2vh" }}>
                    {/* {this?.props?.data?.language === 'en'
                              ? r?.applicationNo
                              : r?.libraryNameMr} */}
                    {r?.bookName}
                  </td>
                  {/* <td style={{textAlign:"left",paddingLeft:"2vh"}}>
                            {r?.libraryMemberName}
                          </td> */}
                  {/* <td>
                            {r?.librarianComment}
                          </td> */}
                  <td>
                    {/* {this?.props?.data?.language === 'en'
                              ? r?.address
                              : r?.addressMr} */}
                    {r.issuedAt
                      ? moment(r?.issuedAt).format("DD-MM-YYYY")
                      : "-"}
                  </td>
                  {/* <td>
                            {r?.issueRemark}
                          </td> */}
                  <td>
                    {r.returnedAt
                      ? moment(r?.returnedAt).format("DD-MM-YYYY")
                      : "-"}
                  </td>
                  {/* <td>
                            {r?.returnRemark}
                          </td> */}
                  {/* <td>
                            {r?.fine}
                          </td> */}
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
