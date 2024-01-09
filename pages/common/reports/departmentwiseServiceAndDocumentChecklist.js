import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/common/reports/listOfDepartment.module.css";
import Head from "next/head";
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
  TextField,
} from "@mui/material";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../containers/reuseableComponents/ReportLayout";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { Print, Search } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import axios from "axios";
import URLs from "../../../URLS/urls";
import urls from "../../../URLS/urls";
import schema from "../../../containers/schema/common/reports/departmentwiseServiceAndDocumentChecklistSchema";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const [table, setTable] = useState([]);
  const [petAnimal, setPetAnimal] = useState([
    { id: 1, nameEn: "", nameMr: "" },
  ]);
  const [petBreeds, setPetBreeds] = useState([
    { id: 1, breedNameEn: "", breedNameMr: "" },
  ]);
  const [departments, setDepartments] = useState([]);
  const [zones, setZones] = useState([]);

  const {
    watch,
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: watch("departmentType") + " Report",
  });

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr No" : "अनु क्र",
      width: 100,
    },
    // {
    //   field: "departmentName",
    //   headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
    //   width: 200,
    // },
    {
      field: "serviceName",
      headerName: language == "en" ? "Service Name" : "सेवा नाव",
      width: 300,
    },
    // {
    //   field: "serviceDurationInDays",
    //   headerName:
    //     language == "en"
    //       ? "Service Duration In Days"
    //       : "दिवसांमध्ये सेवा कालावधी",
    //   width: 200,
    // },
    // {
    //   field: "serviceFee",
    //   headerName: language == "en" ? "Service Fee" : "सेवा शुल्क",
    //   width: 200,
    // },
    {
      field: "documentChecklist",
      headerName: language == "en" ? "Document Checklist" : "दस्तऐवज चेकलिस्ट",
      width: 400,
    },
  ];

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
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
    getService();
  }, []);

  const getService = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        console.log("serviceservice", r);
        setServices(
          r.data.service.map((row) => ({
            id: row.id,
            serviceName: row.serviceName,
            serviceNameMr: row.serviceNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const finalSubmit = (data) => {
    setLoading(true);
    console.log("finalSubmit", watch("selectedServiceName"));
    axios
      .get(`${urls.CFCURL}/master/documentMaster/getDocumentByService`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          serviceId: watch("selectedServiceName"),
        },
      })
      .then((res) => {
        console.log("post", res);
        setLoading(false);
        setTable(
          res.data.documentMaster.length > 0
            ? res.data.documentMaster.map((j, i) => ({
                ...j,
                srNo: i + 1,
                documentChecklistMr: j.documentChecklistMr,
                documentChecklist: j.documentChecklistEn,
                serviceName: services?.find(
                  (obj) => obj?.id == watch("selectedServiceName")
                )?.serviceName,
              }))
            : []
        );

        res.data.documentMaster.length == 0 &&
          sweetAlert("Info", "No records found", "info");
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
      <Head>
        <title>Service Wise Document Checklist</title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="serviceWiseDocumentChecklist" />
        </div>
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={handleSubmit(finalSubmit)}>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      variant="outlined"
                      error={!!errors.selectedServiceName}
                      size="small"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="serviceName" />
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="Servive Name"
                        {...register("selectedServiceName")}
                        onChange={(e) => {
                          setValue("selectedServiceName", e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        value={watch("selectedServiceName")}
                      >
                        {/* <MenuItem value="All" key="none">
                    All
                  </MenuItem> */}
                        {services &&
                          services.map((department, index) => (
                            <MenuItem key={index} value={department.id}>
                              {department.serviceName}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>
                        {errors?.selectedServiceName
                          ? errors.selectedServiceName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <div
                  className={styles.centerDiv}
                  style={{ gap: 20, marginTop: 20 }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    endIcon={<Search />}
                    size="small"
                  >
                    <FormattedLabel id="search" />
                  </Button>
                  <Button
                    disabled={table.length == 0}
                    variant="contained"
                    onClick={handleToPrint}
                    endIcon={<Print />}
                    size="small"
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </div>

                {table.length > 0 && (
                  <div className={styles.centerDiv}>
                    <ReportLayout
                      centerHeader
                      showDates={watch("fromDate") && watch("toDate")}
                      date={{
                        from: moment(watch("fromDate")).format("DD-MM-YYYY"),
                        to: moment(watch("toDate")).format("DD-MM-YYYY"),
                      }}
                      style={{
                        marginTop: "5vh",
                        boxShadow: "0px 2px 10px 0px rgba(0,0,0,0.75)",
                      }}
                      componentRef={componentRef}
                      rows={table}
                      customReportName={{
                        en: "Service Wise Document Checklist",
                        mr: "सेवानिहाय दस्तऐवज चेकलिस्ट",
                      }}
                      columns={columns}
                    />
                  </div>
                )}
              </form>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
