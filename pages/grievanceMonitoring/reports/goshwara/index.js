import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Grid,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import styles from "./view.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import gmLabels from "../../../../containers/reuseableComponents/labels/modules/gmLabels";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useRouter } from "next/router";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Index = () => {
  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
  });
  const [data, setData] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedValuesOfDepartments, setSelectedValuesOfDepartments] =
    useState([]);
  const [departments, setDepartments] = useState([]);
  const [eventes, setEvents] = useState([1, 2, 3]);
  const [subDepartments, setSubDepartment] = useState([]);
  const [selectedValuesOfSubDept, setSelectedValuesOfSubDept] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState();
  const language = useSelector((store) => store.labels.language);

  const [labels, setLabels] = useState(gmLabels[language ?? "en"]);
  const userToken = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.token);
    return state?.user?.user?.token;
  });
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    setLabels(gmLabels[language ?? "en"]);
  }, [setLabels, language]);

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
    setSelectedValuesOfDepartments([]);
  };

  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
          departmentMr: row.departmentMr,
        }))
      );
    });
  };

  const getSubDepartments = () => {
    axios.get(`${urls.CFCURL}/master/subDepartment/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setSubDepartment(
        r.data.subDepartment.map((row) => ({
          id: row.id,
          subDepartmentName: row.subDepartment,
          subDepartmentNameMr: row.subDepartmentMr,
          department: row.department,
          departmentMr: row.departmentMr,
        }))
      );
    });
  };

  useEffect(() => {
    getDepartments();
    getSubDepartments();
  }, []);

  //////////////////////////////////

  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate")) {
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DDT") + "00:00:01";
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DDT") + "23:59:59";

      let apiBodyToSend = {
        lstDepartment:
          selectedValuesOfDepartments?.length > 0
            ? selectedValuesOfDepartments
            : [],
        lstSubDepartment:
          selectedValuesOfSubDept?.length > 0 ? selectedValuesOfSubDept : [],
        fromDate: sendFromDate,
        toDate: sendToDate,
      };

      ///////////////////////////////////////////
      setLoading(true);
      axios
        .post(
          `${urls.GM}/report/getReportDepartmentWiseComplaintStatusV4`,
          apiBodyToSend,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // srNo: i + 1,

                  departmentName: newFunctionForNullValues(
                    "en",
                    r.departmentName
                  ),
                  departmentNameMr: newFunctionForNullValues(
                    "mr",
                    r.departmentNameMr
                  ),

                  subDepartmentName: newFunctionForNullValues(
                    "en",
                    r.subDepartmentName
                  ),
                  subDepartmentNameMr: newFunctionForNullValues(
                    "mr",
                    r.subDepartmentNameMr
                  ),

                  totalOpenGriv: r.totalOpenGriv,
                  totalCloseGriv: r.totalCloseGriv,
                  totalGrievance: r.totalGrievance,
                  percentage: r.percentage,

                  ////////////////////NEWLY ADDED FIELDS////////////////
                  areaName: newFunctionForNullValues("en", r.areaName),
                  areaNameMr: newFunctionForNullValues("mr", r.areaNameMr),
                  wardName: newFunctionForNullValues("en", r.wardName),
                  wardNameMr: newFunctionForNullValues("mr", r.wardNameMr),
                  zoneName: newFunctionForNullValues("en", r.zoneName),
                  zoneNameMr: newFunctionForNullValues("mr", r.zoneNameMr),
                }))
              );
              setLoading(false);
            } else {
              setLoading(false);
              sweetAlert({
                title: language === "en" ? "OOPS!" : "क्षमस्व!",
                text:
                  language === "en"
                    ? "There is nothing to show you!"
                    : "माहिती उपलब्ध नाही",
                icon: "warning",
                // buttons: ["No", "Yes"],
                dangerMode: false,
                closeOnClickOutside: false,
              }).then((will)=>{
                if(will){
                  setData([]);
                }
              });
            }
          } else {
            setData([]);
            sweetAlert(
              language == "en"
                ? "Something Went To Wrong !"
                : "काहीतरी चूक झाली!"
            );
            setLoading(false);
          }
        })
        .catch((error) => {
          // if (!error.status) {
          //   sweetAlert({
          //     title:language === "en" ? "OOPS!" : "क्षमस्व!",
          //     text:
          //       language === "en"
          //         ? "Server is unreachable or may be a network issue, please try after sometime"
          //         : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
          //     icon: "warning",
          //     // buttons: ["No", "Yes"],
          //     dangerMode: false,
          //     closeOnClickOutside: false,
          //   });
          //   setData([]);
          //   setLoading(false);
          // } else {
            setData([]);
            // sweetAlert(error);
            setLoading(false);
            catchMethod(error)
          // }
        });
    } else {
      sweetAlert({
        title:language === "en" ? "OOPS!" : "क्षमस्व!",
        text:
          language === en
            ? "Both Dates Are Required!"
            : "दोन्ही तारखा आवश्यक आहेत!",
        icon: "warning",
        // buttons: ["No", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setData([]);
    }
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

  ///////////////////////////
  const newFunctionForNullValues = (lang, value) => {
    if (lang == "en") {
      return value ? value : "Not Available";
    } else {
      return value ? value : "उपलब्ध नाही";
    }
  };
  ///////////////////////////

  const columns = [
    {
      field: "id",
      // headerName: <FormattedLabel id="srNo" />,
      headerName: labels.srNo,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: labels.departmentName,
      minWidth: 250,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "subDepartmentName" : "subDepartmentNameMr",
      headerName: labels.subDepartmentName,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language === "en" ? "areaName" : "areaNameMr",
      headerName: <FormattedLabel id="areaName" />,
      headerName: labels.areaName,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language === "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="wardName" />,
      headerName: labels.wardName,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language === "en" ? "zoneName" : "zoneNameMr",
      headerName: <FormattedLabel id="zoneName" />,
      headerName: labels.zoneName,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "totalCloseGriv",
      headerName: <FormattedLabel id="totalCloseGriv" />,
      headerName: labels.totalCloseGriv,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalOpenGriv",
      headerName: <FormattedLabel id="totalOpenGriv" />,
      headerName: labels.totalOpenGriv,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalGrievance",
      headerName: <FormattedLabel id="totalGrievance" />,
      headerName: labels.totalGrievance,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "percentage",
      headerName: <FormattedLabel id="completionPercentage" />,
      headerName: labels.completionPercentage,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            {" "}
            {params?.row?.percentage ? params?.row?.percentage + "%" : ""}
          </div>
        );
      },
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    console.log(":generateCSVFile", data);

    const columnsCount = columns.length;
    const emptyRow = Array(columnsCount).fill("").join(",");
    const headerRow = columns.map((c) => c.headerName).join(",");

    const centerText = (text, length) => {
      const spaces = Math.floor(columnsCount / 2);
      const leftPadding = Array(Math.floor(columnsCount / 2))
        .fill("")
        .join(",");
      const rightPadding = Array(Math.floor(columnsCount / 4))
        .fill("")
        .join(",");
      return leftPadding + text + rightPadding;
      // return columnsCount + text + columnsCount
    };

    const maxLength = Math.max(
      "PIMPRI CHINCHWAD MUNICIPAL CORPORATION".length,
      `DATE : ${new Date()}`.length
    );

    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";

    const centeredText1 = centerText(engHeading);
    const reportName = centerText(labels.DepartmentComplaintStatus);

    const centeredText2 = centerText(
      language == "en"
        ? `DATE : From ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक : ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`,

      language == "en"
        ? `DATE : From ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`.length
        : `दिनांक : ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`
            .length

      // `दिनांक : ${moment(watch("fromDate")).format(
      //   "Do-MMM-YYYY"
      // )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्य्ंत`
      //   .length
    );

    const csv = [
      emptyRow,
      emptyRow,
      emptyRow,
      centeredText1,
      reportName,
      centeredText2,
      emptyRow,
      headerRow,
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download =
      language == "en"
        ? "Department Wise Pending Summary.csv"
        : "विभागनिहाय तक्रार सारांश.csv";
    downloadLink.click();
    // URL.revokeObjectURL(url)
  }

  //////////////////////////////////////////
  function generatePDF(data) {
    const columnsData = columns
      .map((c) => c.headerName)
      .map((obj) => obj?.props?.id);
    const rowsData = data.map((row) => columns.map((col) => row[col.field]));
    console.log(
      ":45",
      columns.map((c) => c.headerName).map((obj) => obj)
    );
    const doc = new jsPDF();
    doc.autoTable({
      head: [columnsData],
      body: rowsData,
    });
    doc.save("datagrid.pdf");
  }

  ///////////MULTI DEPRT//////

  const handleSelect = (evt, value) => {
    console.log(":values", value);
    const selectedIds = value.map((val) => val.id);

    setSelectedValuesOfDepartments(selectedIds);
  };

  const handleSelectForSubDept = (evt, value) => {
    const selectedIds = value.map((val) => val.id);
    setSelectedValuesOfSubDept(selectedIds);
  };

  const currDate = new Date();

  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
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
          <Grid
            container
            style={{
              display: "flex",
              alignItems: "center", // Center vertically
              alignItems: "center",
              width: "100%",
              height: "auto",
              overflow: "auto",
              color: "white",
              fontSize: "18.72px",
              borderRadius: 100,
              fontWeight: 500,
              background:
                "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
            }}
          >
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                  // marginBottom: "2vh",
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
                {language == "en" ? "Goshwara" : "गोश्‍वरा"}
              </h3>
            </Grid>
          </Grid>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitFunc)}>
            {/* ////////////////////////////// */}
            <Grid
              container
              spacing={2}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <table className={styles.mainTable}>
                <tbody>
                  <tr>
                    <th>Audited</th>
                    <th>Satisfactory</th>
                    <th>Not-Satisfactory</th>
                    <th>Can Not Audited </th>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: "4%", paddingTop: "2%" }}>
                      767898
                    </td>
                    <td style={{ paddingLeft: "7%", paddingTop: "2%" }}>345</td>
                    <td style={{ paddingLeft: "11%", paddingTop: "2%" }}>
                      678
                    </td>
                    <td style={{ paddingLeft: "13%", paddingTop: "2%" }}>
                      456
                    </td>
                  </tr>
                </tbody>
              </table>
            </Grid>
          </form>
        </Box>
      </Paper>

      <Paper
        style={{
          margin: "30px",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              border: "1px solid black",
            }}
          >
            <strong className={styles.fancy_link1}>Audit</strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitFunc)}>
            {/* ////////////////////////////// */}
            <Grid
              container
              spacing={2}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <table className={styles.mainTable}>
                <tbody>
                  <tr>
                    <th>Audited</th>
                    <th>Satisfactory</th>
                    <th>Not-Satisfactory</th>
                    <th>Can Not Audited </th>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: "4%", paddingTop: "2%" }}>
                      767898
                    </td>
                    <td style={{ paddingLeft: "7%", paddingTop: "2%" }}>345</td>
                    <td style={{ paddingLeft: "11%", paddingTop: "2%" }}>
                      678
                    </td>
                    <td style={{ paddingLeft: "13%", paddingTop: "2%" }}>
                      456
                    </td>
                  </tr>
                </tbody>
              </table>
            </Grid>
          </form>
        </Box>
      </Paper>

      <Paper
        style={{
          margin: "30px",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              border: "1px solid black",
            }}
          >
            <strong className={styles.fancy_link1}>Sarathi Audit</strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitFunc)}>
            {/* ////////////////////////////// */}
            <Grid
              container
              spacing={2}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <table className={styles.mainTable}>
                <tbody>
                  <tr>
                    <th>Audited</th>
                    <th>Satisfactory</th>
                    <th>Not-Satisfactory</th>
                    <th>Can Not Audited </th>
                  </tr>
                  <tr>
                    <td>767898</td>
                    <td>345</td>
                    <td>678</td>
                    <td>456</td>
                  </tr>
                </tbody>
              </table>
            </Grid>
          </form>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
