import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import React, { useRef  } from "react";
import styles from "./view.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { useSelector } from "react-redux";
import moment from "moment";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";


const index = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const router = useRouter();

  const printedBy = useSelector((state) =>
    state?.user?.user?.userDao
      ? language === "en"
        ? state?.user?.user?.userDao?.firstNameEn +
          " " +
          state?.user?.user?.userDao?.middleNameEn +
          " " +
          state?.user?.user?.userDao?.lastNameEn
        : state?.user?.user?.userDao?.firstNameMr +
          " " +
          state?.user?.user?.userDao?.middleNameMr +
          " " +
          state?.user?.user?.userDao?.lastNameMr
      : language === "en"
      ? state?.user?.user?.firstName +
        " " +
        state?.user?.user?.middleName +
        " " +
        state?.user?.user?.surname
      : state?.user?.user?.firstNamemr +
        " " +
        state?.user?.user?.middleNamemr +
        " " +
        state?.user?.user?.surnamemr
  );
  const reportName = useSelector((state) =>
    state?.user?.user?.menus?.find(
      (menu) =>
        menu.id == Number(localStorage.getItem("selectedMenuFromDrawer"))
    )
  );

  const deptName = useSelector((state) =>
    state?.user?.user?.applications?.find(
      (dept) => dept.id == state?.user?.selectedApplicationId
    )
  );

  const language = useSelector((store) => store.labels.language);
  const getYear = new Date().getFullYear(); // returns the current year
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: "A4",
    color: "color",
    documentTitle: language == "en" ? "Vivaran Patra_05" : "विवरण पत्र_०५",
  });

  const months = [
    { id: 1, monthEng: "January", monthMr: "जानेवारी" },
    { id: 2, monthEng: "February", monthMr: "फेब्रुवारी" },
    { id: 3, monthEng: "March", monthMr: "मार्च" },
    { id: 4, monthEng: "April", monthMr: "एप्रिल" },
    { id: 5, monthEng: "May", monthMr: "मे" },
    { id: 6, monthEng: "June", monthMr: "जून" },
    { id: 7, monthEng: "July", monthMr: "जुलै" },
    { id: 8, monthEng: "August", monthMr: "ऑगस्ट" },
    { id: 9, monthEng: "September", monthMr: "सप्टेंबर" },
    { id: 10, monthEng: "October", monthMr: "ऑक्टोबर" },
    { id: 11, monthEng: "November", monthMr: "नोव्हेंबर" },
    { id: 12, monthEng: "December", monthMr: "डिसेंबर" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <BreadcrumbComponent />
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="vivaranPatra05" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            style={{ margin: "10px", width: "80%", backgroundColor: "white" }}
          >
            <form>
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl error={!!errors.month}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="monthName" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          fullWidth
                          autoFocus
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label="Select Month"
                        >
                          {months &&
                            months.map((m, index) => (
                              <MenuItem key={index} value={m.id}>
                                {language === "en" ? m.monthEng : m.monthMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="month"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.month ? errors.month.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </Paper>
          {watch("month") ? (
            <Paper elevation={3} style={{ margin: "10px", width: "98%" }}>
              <Grid ref={componentRef}>
                {/* ---------- Header ---------- */}
                <div className={styles.one}>
                  <div className={styles.logo}>
                    <div>
                      <img
                        src="/smartCityPCMC.png"
                        alt=""
                        height="100vh"
                        width="100vw"
                      />
                    </div>
                  </div>
                  <div
                    className={styles.one}
                    styles={{
                      paddingTop: "15vh",
                      marginTop: "20vh",
                      display: "flex",
                    }}
                  >
                    <div className={styles.logo1} style={{ margin: "5px" }}>
                      <img src="/logo.png" alt="" height="50vh" width="50vw" />
                    </div>
                    <h1>
                      <b>
                        <FormattedLabel id="pimpariChinchwadMaha" />
                      </b>
                    </h1>
                  </div>
                  <div className={styles.logo1}>
                    <img
                      src="/RTIReceiptLogo.jpeg"
                      alt=""
                      height="100vh"
                      width="100vw"
                    />
                  </div>
                </div>

                {/* ------ Sub-Header 1 ----- */}
                <div className={styles.subHeader}>
                  <h3>
                    {language == "en" ? "Department Name" : "विभागाचे नाव"}:{" "}
                    <b>
                      {language == "en"
                        ? deptName?.applicationNameEng
                        : deptName?.applicationNameMr}
                    </b>
                  </h3>
                  <h3>
                    {language == "en" ? "Report Name" : "अहवालाचे नाव"}:{" "}
                    <b>
                      {language == "en"
                        ? reportName?.menuNameEng
                        : reportName?.menuNameMr}
                    </b>
                  </h3>
                </div>
                {/* -------------Report body ------------ */}
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>विवरण पत्र ०५</strong>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>कलम २५ (३) (च)</strong>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>
                        माहितीचा अधिकार अधिनियम, २००५ चा आशय व हेतू यांचे
                        कार्यान्वयन व अंमलबजावणी करण्यासाठी
                      </strong>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>
                        सार्वजनिक प्राधिकरणांकडून केलेले प्रयत्न दर्शविणा-या
                        गोष्टी
                      </strong>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={8}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>
                        (क्षेत्रीय कार्यालयातील व मंत्रालयातील प्रत्येक अपिलीय
                        प्राधिका-याने
                      </strong>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>
                        अनुक्रमे विभागप्रमुख / समन्वय कक्षाकडे दरमहा माहिती
                        पाठविण्यासंदर्भातील विवरणपत्र)
                      </strong>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>
                        <label>माहितीचा महिना :- </label>
                        {language == "en"
                          ? months.find((m) => m.id === watch("month"))
                              ?.monthEng
                          : months.find((m) => m.id === watch("month"))
                              ?.monthMr}

                        {language == "en" ? " " + 2023 : " " + "२०२3"}
                      </strong>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th className={styles.th}>
                              कार्यासनाचे नाव / कार्यासन क्रमांक
                            </th>
                            <th className={styles.th}>
                              माहितीचा अधिकार अधिनियम, २००५ चा आशय व हेतू यांचे
                              कार्यान्वयन व अंमलबजावणी करण्यासाठी सार्वजनिक
                              प्राधिकरणांकडून केलेले प्रयत्न
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className={styles.td}>१</td>
                            <td className={styles.td}>२</td>
                          </tr>
                          <tr>
                            <td className={styles.td}>
                              दर आठिड्याला विभाग प्रमुखच्या आढावा बैठकीत
                              प्रलंबित प्रकरणाबाबत आढावा घेण्यात येतो पिंपरी
                              चिंचवड महानगरपालिका पिंपरी ४११० ०१८
                            </td>
                            <td className={styles.td}>
                              दि. २६ जानेवारी २०१६ पासून माहितीचा अधिकार
                              अधिनियम, २००५ अंतर्गत पिंपरी चिंचवड महानगरपालिकेशी
                              संबंधित कामकाज आपले सरकार आरटीआय ऑनलाईन
                              वेबपपोर्टलशी संलग्न करणेत आले आहे. यामध्ये नागरिक
                              ऑनलाईन स्वरुपात अर्ज दाखल करू महानगरपालिका, शकतात.
                              याशिवाय ऑफलाईन स्वरुपात प्राप्त झालेले अर्ज देखील
                              या सॉफ्टवेअर मध्ये घेतले जात असलेने नागरीकांना SMS
                              व्दारे त्यांच्या अर्जाची सद्यस्थिती कळू शकते. तसेच
                              दर आठवडयाला विभाग प्रमुखांच्या आढावा बैठकित
                              प्रलंबित प्रकरणांबाबत आढावा घेणेत येतो.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={7}
                    md={7}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div></div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={4}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                      marginTop: "60px",
                    }}
                  >
                    <div>
                      <strong>
                        <strong style={{ fontSize: 15 }}>
                          माहिती व तंत्रज्ञान अधिकारी,
                        </strong>
                        <br /> नागरी सुविधा केंद्र,
                        <br /> पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८.
                      </strong>
                    </div>
                  </Grid>
                </Grid>

                {/* ---------Footer------------ */}

                <Grid style={{ marginLeft: "20px" }}>
                  <h3>
                    {language == "en" ? "Printed By" : "छापनार्याचे नाव"}:{" "}
                    <b>{printedBy}</b>
                  </h3>

                  <h3>
                    {language == "en"
                      ? "Print Date and Time"
                      : "छापतांना तारीख आणि वेळ"}
                    : <b>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</b>
                  </h3>
                </Grid>
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
                  marginBottom: "30px",
                }}
              >
                <Button
                  sx={{ width: "100px" }}
                  type="button"
                  variant="contained"
                  color="primary"
                  endIcon={<PrintIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={handleToPrint}
                >
                  <FormattedLabel id="print" />
                </Button>
              </Grid>
            </Paper>
          ) : (
            ""
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default index;
