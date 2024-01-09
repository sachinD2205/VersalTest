import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
import styles from "./report.module.css";
// import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import ReportLayout from "../NewReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";
// Religion wise count
const ReligionWiseCountReport = () => {
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
  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  );
  // let user = useSelector((state) => state.user.user);
  const [dataSource, setDataSource] = useState();
  const [route, setRoute] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
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
  const [religions, setReligions] = useState([]);
  const getReligions = () => {
    setLoaderState(true);
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setLoaderState(false);
        setReligions(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
            religionMr: row.religionMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };

  const [user, setUser] = React.useState([]);
  const handleChangeuser = (event) => {
    const {
      target: { value },
    } = event;
    setUser(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const [religionType, setreligionType] = React.useState([]);
  const handleChangereligionType = (event) => {
    const {
      target: { value },
    } = event;
    setreligionType(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const [selectReligions, setselectReligions] = React.useState([]);
  const handleChangeReligions = (event) => {
    const {
      target: { value },
    } = event;
    setselectReligions(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };
  console.log("oooooooooo", user, religionType, selectReligions);
  useEffect(() => {
    getReligions();
  }, []);

  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
      type: ["groom"],
      religionType: [watch("religionType")],
      religions: selectReligions
        // ?.split(",")
        ?.map((uu) => religions.find((ff) => ff.religion == uu).id),
    };
    console.log("pppppppp", body);
    axios
      .post(`${urls.MR}/reports/getReligionWiseCountReportDtlNew`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setDataSource(
          r?.data?.religionWiseCountReportDaos?.map((r, i) => {
            return { srNo: i + 1, ...r };
          }),
        );
        setShowTable(true);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  console.log("asdasdf", dataSource);
  return (
    <>
      {loaderState ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh", // Adjust itasper requirement.
          }}
        >
          <Paper
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "50%",
              padding: 8,
            }}
            elevation={8}
          >
            <CircularProgress color="success" />
          </Paper>
        </div>
      ) : (
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
            <div className={styles.detailsTABLE}>
              <div className={styles.h1TagTABLE}>
                <h2
                  style={{
                    fontSize: "20",
                    color: "white",
                    marginTop: "7px",
                  }}
                >
                  {language === "en" ? menu.menuNameEng : menu.menuNameMr}
                </h2>
              </div>
            </div>

            <div className={styles.searchFilter} styles={{ marginTop: "50px" }}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
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
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
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
                                {...params}
                                variant="standard"
                                size="small"
                                fullWidth
                                // InputLabelProps={{
                                //   style: {
                                //     fontSize: 12,
                                //     marginTop: 3,
                                //   },
                                // }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid
            item
            xs={12}
            sm={6}
            md={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
          <FormControl sx={{  width: 250 }}>
            <InputLabel id="demo-multiple-chip-label">Select User</InputLabel>
            <Select
      
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={user}
              onChange={handleChangeuser}
              input={<OutlinedInput id="select-multiple-chip" label="Fire Equipment" />}
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                  }}
                >
                  {selected.map((value) => (
                    <Chip sx={{ backgroundColor: "#AFDBEE" }} key={value} label={value} />
                  ))}
                </Box>
              )}
              // MenuProps={MenuProps}
            >
               <MenuItem value={"groom"}>{language=="en"?"Groom":"वर"}</MenuItem>
                  <MenuItem value={"bride"}>{language=="en"?"Bride":"वधू"}</MenuItem>
                  <MenuItem value={"priest"}>{language=="en"?"Priest":"पुजारी"}</MenuItem>
            </Select>
          </FormControl>
        </Grid>  */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <FormControl
                    variant="standard"
                    sx={{ marginLeft: 3, marginRight: 2, marginTop: "10px" }}
                    error={!!errors.religionType}
                  >
                    <InputLabel id="demo-simple-select-autowidth-label">
                      {language == "en" ? "Religion Type" : "धर्माचा प्रकार"}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          sx={{ width: 230 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          <MenuItem value={"birth"}>
                            {language == "en"
                              ? "Religion By Birth"
                              : "जन्माने धर्म"}
                          </MenuItem>
                          <MenuItem value={"adoption"}>
                            {language == "en"
                              ? "Religion By Adoption"
                              : "दत्तक घेऊन धर्म"}
                          </MenuItem>
                        </Select>
                      )}
                      name="religionType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.religionType
                        ? errors.religionType.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <FormControl sx={{ width: 250 }} variant="standard">
                    <InputLabel id="demo-simple-select-autowidth-label">
                      {language == "en" ? "Select Religion " : "धर्म प्रकार "}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      multiple
                      value={selectReligions}
                      // value={selectReligions && religions.find((item)=>selectReligions==item.id)?.religion}
                      onChange={handleChangeReligions}
                      input={
                        <OutlinedInput
                          id="select-multiple-chip"
                          label="Religion Type"
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {selected.map((value) => (
                            <Chip
                              sx={{ backgroundColor: "#AFDBEE" }}
                              key={value}
                              label={value}
                            />
                          ))}
                        </Box>
                      )}
                      // MenuProps={MenuProps}
                    >
                      {religions &&
                        religions.map((greligionByBirth, index) => (
                          <MenuItem
                            key={index}
                            value={greligionByBirth.religion}
                          >
                            {/* {greligionByBirth.greligionByBirth} */}

                            {language == "en"
                              ? greligionByBirth?.religion
                              : greligionByBirth?.religionMr}
                          </MenuItem>
                        ))}
                      {/* <MenuItem value={"birth"}>{language=="en"?"By Birth":"जन्माने"}</MenuItem> */}
                      {/* <MenuItem value={"adoption"}>{language=="en"?"By Adoption":"दत्तक घेऊन"}</MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "20px", marginTop: "10px" }}
                onClick={getApplicationDetail}
              >
                {language === "en" ? "Search" : "शोधा"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "20px", marginTop: "10px" }}
                // style={{ float: "right" }}
                onClick={handlePrint}
              >
                {language === "en" ? "Print" : "प्रत काढा"}
              </Button>
            </div>

            <br />
            {showTable && (
              <div style={{ marginLeft: "5%" }}>
                <ReportLayout
                  centerHeader
                  centerData
                  // rows={table}
                  // columns={columnsPetLicense}
                  columnLength={18}
                  componentRef={componentRef}
                  showDates
                  date={{
                    from: moment(watch("fromDate")).format("DD-MM-YYYY"),
                    to: moment(watch("toDate")).format("DD-MM-YYYY"),
                  }}
                  deptName={{
                    en: "Library Management System",
                    mr: "पशुवैद्यकीय व्यवस्थापन प्रणाली",
                  }}
                  reportName={{
                    en: "गोषवारा भाग १",
                    mr: "गोषवारा भाग १",
                  }}
                >
                  <ComponentToPrint
                    data={{ dataSource, language, ...menu, route, religions }}
                  />
                </ReportLayout>
              </div>
            )}
            {/* <div>


          <ComponentToPrint
            data={{ dataSource, language, ...menu, route }}
            ref={componentRef}
          />
        </div> */}
          </Paper>
        </>
      )}
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ paddingTop: "16px" }}>
          <div className="report">
            <Card>
              console.log();
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        {this?.props?.data?.language === "en"
                          ? "Religion Wise Count"
                          : "धर्मानुसार विवाह गणना"}
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Religion Name."
                        : "धर्माचे नाव"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Count of Marriage Registration"
                        : "विवाह नोंदणीचा गणना"}
                      {/* <b>Count of Marriage Registration</b> */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          {this?.props?.data?.language === "en" ? (
                            <td>
                              {
                                this?.props?.data?.religions.find(
                                  (item) => item.id == r?.religionKey,
                                ).religion
                              }
                            </td>
                          ) : (
                            <td>
                              {
                                this?.props?.data?.religions.find(
                                  (item) => item.id == r?.religionKey,
                                ).religionMr
                              }
                            </td>
                          )}
                          <td>{r?.religionWiseCount}</td>
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

export default ReligionWiseCountReport;
