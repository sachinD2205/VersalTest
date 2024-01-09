import {
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import styles from "../report.module.css";

import { useRouter } from "next/router";
import ReportLayout from "../ReportLayout/NewReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";
const Index = () => {
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
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  );
  const [route, setRoute] = useState(null);
  const [dataSource, setDataSource] = useState();
  const router = useRouter();
  const {
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [zone, setZone] = useState();
  const [village, setVillage] = useState();
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };

  useEffect(() => {
    //Zone
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setZone(
          res.data.zone.map((j) => ({
            id: j.id,
            zoneEn: j.zoneName,
            zoneMr: j.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Village
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setVillage(
          res.data.village.map((j) => ({
            id: j.id,
            villageEn: j.villageName,
            villageMr: j.villageNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
    };

    // axios.post(`${urls.MR}/reports/getReportOfInterCast`, body).then((r) => {
    //   setDataSource(
    //     r.data.map((r, i) => {
    //       return { srNo: i + 1, ...r };
    //     }),
    //   );
    //   setShowTable(true);
    // }
    // );
  };

  // view
  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
        sx={{
          padding: "5vh",
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <div style={{ padding: 10 }}>
          <p>
            <center>
              <h1>
                {
                  language === "en"
                    ? menu.menuNameEng /* "Application Details Report" */
                    : menu.menuNameMr /* "अर्ज तपशील अहवाल" */
                }
              </h1>
            </center>
          </p>
        </div>

        <div className={styles.searchFilter}>
          <FormControl sx={{ marginTop: "2vh" }}>
            <Controller
              control={control}
              name="fromDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    maxDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 14 }}>
                        {language === "en" ? "From Date" : "तारखेपासून"}
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
                        variant="standard"
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
          <FormControl sx={{ marginTop: "2vh", marginLeft: "5vh" }}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    maxDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 14 }}>
                        {language === "en" ? "To Date" : "आजपर्यंत"}
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
                        variant="standard"
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

          <FormControl
            sx={{ marginLeft: 3, marginRight: 2, marginTop: "10px" }}
            // sx={{ width: "230px", marginTop: "2%" }}
            variant="standard"
            error={!!errors.villageName}
          >
            <InputLabel
              id="demo-simple-select-standard-label"
              //   disabled={router.query.villageName ? true : false}
            >
              {/* <FormattedLabel id="villageName" required /> */}
              By search
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ width: 230 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={
                    router.query.villageName
                      ? router.query.villageName
                      : field.value
                  }
                  onChange={(value) => field.onChange(value)}
                  label="villageName"
                >
                  {/* {village &&
                    village.map((value, index) => (
                      <MenuItem
                        key={index}
                        value={
                          // @ts-ignore
                          value?.id
                        }
                      >
                        {
                          // @ts-ignore
                          language === "en"
                            ? value?.villageEn
                            : value?.villageMr
                        }
                      </MenuItem>
                    ))} */}
                  <MenuItem>शिपाई</MenuItem>
                  <MenuItem>अधियांता</MenuItem>
                  <MenuItem>कनिष्ठ अभियंता</MenuItem>
                </Select>
              )}
              name="villageName"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.villageName ? errors.villageName.message : null}
            </FormHelperText>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "4px", marginTop: "20px" }}
            onClick={getApplicationDetail}
          >
            {language === "en" ? "Search" : "शोधा"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "4px", marginTop: "20px" }}
            onClick={handlePrint}
          >
            {language === "en" ? "Print" : "प्रत काढा"}
          </Button>
        </div>

        <br />

        {/* {showTable && ( */}
        <div style={{ marginLeft: "5%" }}>
          <ReportLayout
            centerHeader
            centerData
            columnLength={5}
            componentRef={componentRef}
            showDates
            date={{
              from: moment(watch("fromDate")).format("DD-MM-YYYY"),
              to: moment(watch("toDate")).format("DD-MM-YYYY"),
            }}
            // deptName={{
            //   en: "Marriage Registration",
            //   mr: "विवाह नोंदणी प्रणाली",
            // }}
            // reportName={{
            //   en: "Inter Cast Wise Report",
            //   mr: "अंतर जातीय विवाह अहवाल",
            // }}
          >
            <ComponentToPrint data={{ dataSource, language, ...menu, route }} />
          </ReportLayout>
        </div>
        {/* ) */}
        {/* } */}
      </Paper>
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: "13px" }}>
          <div className="report">
            <Card>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b></b>
                        {this?.props?.data?.language === "en"
                          ? "Village Wise Resrvation List "
                          : "विकास योजना आरक्षणाचा घोषवारा"}
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Junior Engineer"
                        : "कनिष्ठ अभियंता"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Total Application "
                        : "एकुण अर्ज"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Total Area"
                        : "एकुण क्षेत्रफळ (चौ .मी)"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Total D.R.C"
                        : "एकुण डी .आर .सी"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Area under Municipal Corporation (H.R.)"
                        : "मनपाच्या ताब्यातील क्षेत्र (हे .आर)"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Area Non-under Municipal Corporation (H.R.)"
                        : "मनपाच्या ताब्यात नसलेले क्षेत्र (हे .आर)"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {" "}
                            {" " +
                              moment(
                                r?.serviceCompletionDate,
                                "YYYY-MM-DD",
                              ).format("DD-MM-YYYY")}
                          </td>
                          <td>{r?.registrationNumber}</td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.gfName + " " + r?.gmName + " " + r?.glName
                              : r?.gfNameMr +
                                " " +
                                r?.gmNameMr +
                                " " +
                                r?.glNameMr}
                          </td>

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.bfName + " " + r?.bmName + " " + r?.blName
                              : r?.bfNameMr +
                                " " +
                                r?.bmNameMr +
                                " " +
                                r?.blNameMr}
                          </td>
                          <td>
                            {" "}
                            {" " +
                              moment(r?.marriageDate, "YYYY-MM-DD").format(
                                "DD-MM-YYYY",
                              )}
                          </td>

                          <td>{r?.greligionByBirthTxt}</td>
                          <td>{r?.breligionByBirthTxt}</td>

                          <td>{r?.greligionByAdoptionTxt}</td>
                          <td>{r?.breligionByAdoptionTxt}</td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </>
    );
  }
}
export default Index;
