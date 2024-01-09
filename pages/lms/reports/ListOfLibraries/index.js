import { Box, Button, FormControl, Paper, TextField } from "@mui/material";
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
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.user.token);

  // console.log("menuLabel",menuLabel);

  const {
    control,
    getValues,
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
  const [zoneKeys, setZoneKeys] = useState([]);
  const [tableData, setTableData] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    getZoneKeys();
  }, []);

  useEffect(() => {
    getLibraryKeys();
  }, [zoneKeys]);

  const getLibraryKeys = () => {
    setLoading(true);
    axios
      .get(`${urls.LMSURL}/libraryMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        let res = r.data.libraryMasterList
          .sort((a, b) => a.id - b.id)
          .map((row, index) => ({
            id: row.id,
            srNo: index + 1,
            zoneName: zoneKeys?.find((r, i) => row.zoneKey == r.id)?.zoneName,
            zoneNameMr: zoneKeys?.find((r, i) => row.zoneKey == r.id)
              ?.zoneNameMr,
            libraryName: row.libraryName,
            libraryNameMr: row.libraryNameMr,
            libraryType: row.libraryType,
          }));
        setDataSource(res);
        setTableData(res);
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            // zoneName: zoneKeys?.find((r, i) => row.zoneKey == r.id)?.zoneName,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   swal(
    //     language == "en" ? "Error!" : "त्रुटी!",
    //     language == "en"
    //       ? "Somethings Wrong, Zones not Found!"
    //       : "काहीतरी चुकीचे आहे, झोन सापडले नाहीत!",
    //     "error"
    //   );
    // });
  };

  const backToHomeButton = () => {
    router.push("/lms/dashboard");
  };

  let tableColumns = [
    {
      field: "srNo",
      headerName: language === "en" ? "Sr.No" : "अ.क्र",
      width: 100,
    },
    {
      field: language == "en" ? "zoneName" : "zoneNameMr",
      headerName: language === "en" ? "Zone" : "झोन",
      width: 200,
    },
    {
      field: language == "en" ? "libraryName" : "libraryNameMr",
      headerName:
        language === "en"
          ? "Library Name/Competitive Study Centre"
          : "वाचनालयाचे नाव",
      width: 250,
    },
    {
      field: "libraryType",
      headerName: language === "en" ? "Library Type" : "ग्रंथालय प्रकार",
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
          enName="List of Libraries/Competitive Study Centre"
          mrName="पिंपरी चिंचवड मधील वाचनालये"
        />
        <div style={{ padding: 10 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            {language === "en" ? "Print" : "प्रत काढा"}
          </Button>
          <Button
            onClick={backToHomeButton}
            variant="contained"
            size="small"
            color="primary"
          >
            {language === "en" ? "Back To home" : "मुखपृष्ठ"}
          </Button>
        </div>
        <br />
        {loading ? (
          <Loader />
        ) : (
          <>
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
                columnLength={4}
                componentRef={componentRef}
                // showDates
                // date={{ from: '01-06-2023', to: '30-06-2023' }}
                deptName={{
                  en: "Library Management System",
                  mr: "ग्रंथालय व्यवस्थापन प्रणाली",
                }}
                reportName={{
                  en: "List Of Libraries Report",
                  mr: "ग्रंथालयांची यादी अहवाल",
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
                          ? "List of Libraries"
                          : "पिंपरी चिंचवड मधील वाचनालये"
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
              {this?.props?.data?.language === "en" ? "Zone" : "झोन"}
            </th>
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Library Name/Competitive Study Centre"
                : "वाचनालयाचे नाव"}
            </th>
            <th colSpan={1}>
              {this?.props?.data?.language === "en"
                ? "Library Type"
                : "ग्रंथालय प्रकार"}
            </th>
          </tr>
          {this?.props?.data?.dataSource &&
            this?.props?.data?.dataSource?.map((r, i) => (
              <>
                <tr>
                  <td>{i + 1}</td>
                  <td style={{ textAlign: "left", paddingLeft: "5vh" }}>
                    {r?.zoneName}
                  </td>
                  <td style={{ textAlign: "left", paddingLeft: "5vh" }}>
                    {this?.props?.data?.language === "en"
                      ? r?.libraryName
                      : r?.libraryNameMr}
                  </td>
                  <td style={{ textAlign: "left", paddingLeft: "5vh" }}>
                    {r?.libraryType}
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
