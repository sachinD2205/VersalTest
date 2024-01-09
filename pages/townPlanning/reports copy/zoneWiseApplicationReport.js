import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "./report.module.css";

import {
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
} from "@mui/material";
// import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
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

// import URLs from '../../../URLS/urls'
import ReportLayout from "../../../containers/reuseableComponents/ReportLayout";
import urls from "../../../URLS/urls";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const componentRef = useRef(null);

  const [table, setTable] = useState([]);
  const [zoneKey, setZoneKey] = useState([]);

  const reportSchema = yup.object().shape({
    // petTypeKey: yup
    //   .number()
    //   .required('Please select an animal')
    //   .typeError('Please select an animal'),
    fromDate: yup
      .date()
      .typeError(`Please select a from Date`)
      .required(`Please select a from Date`),
    toDate: yup
      .date()
      .typeError(`Please select a to Date`)
      .required(`Please select a to Date`),
  });

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(reportSchema),
  });

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: "Road Exacavtion Application Report",
  });
  const getZoneKeys = () => {
    //setVaIdlues("setBackDrop", true);
    axios.get(`${urls.BaseURL}/zone/getAll`).then((r) => {
      console.log("ee", r.data.zone);
      setZoneKey(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        })),
      );
    });
  };
  useEffect(() => {
    getZoneKeys();
  }, []);
  console.log("zonekayssssss", zoneKey);
  const reportColumns = [
    {
      field: "srNo",
      formattedLabel: "srNo",
      width: 130,
    },
    {
      field: "applicationNumber",
      formattedLabel: "applicationNo",
      width: 120,
    },
    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      formattedLabel: "applicantName",
      width: 120,
    },
    {
      field: "applicationDate",
      formattedLabel: "applicationDate",
      width: 100,
    },
    {
      field: "serviceName",
      formattedLabel: "serviceName",
      width: 110,
    },
    {
      field: "applicationStatus",
      formattedLabel: "statusDetails",
      width: 110,
    },
  ];

  //have to add new api
  const finalSubmit = (data) => {
    let fromDate = moment(data.fromDate).format("DD-MM-YYYY");
    let toDate = moment(data.toDate).format("DD-MM-YYYY");

    console.log("ppppppppppp", data);
    axios
      .get(
        `${urls.TPURL}/dashboard/getZoneWiseApplicationReport?fromDate=${fromDate}&toDate=${toDate}&zoneId=${data?.zonekeys}`,
        {
          // params: {
          //   fromDate: moment(data.fromDate).format('YYYY-MM-DD'),
          //   toDate: moment(data.toDate).format('YYYY-MM-DD'),
          //   // petTypeKey: data.petTypeKey,
          // },
        },
      )
      .then((res) => {
        console.log("resultttt", res);
        setTable(
          //have to add path
          res.data?.dashboardDaoList?.length > 0
            ? res.data.dashboardDaoList.map((r, i) => ({
                srNo: i + 1,
                applicationNumber: r.applicationNumber,
                applicantName: r.applicantName,
                applicantNameMr: r.applicantNameMr,
                applicationDate: moment(r.applicationDate).format("DD-MM-YYYY"),
                applicationStatus: r.applicationStatus,
                serviceName: r.serviceName,
              }))
            : [],
        );
        res.data?.dashboardDaoList?.length == 0 &&
          sweetAlert("Info", "No records found", "info");
      })
      .catch((error) => {
        if (error.response.status == 400) {
          sweetAlert("Error", "Bad Request", "error");
        } else {
          sweetAlert("Error", "Something went wrong", "error");
        }
      });
  };
  return (
    <>
      <Head>
        <title>Application Report</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="applicationReport" />
        </div>
        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row}>
            <FormControl error={!!error.fromDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name="fromDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd-MM-yyyy"
                      label="From Date"
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "200px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.fromDate ? error.fromDate.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.toDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name="toDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd-MM-yyyy"
                      label="To Date"
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "200px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.toDate ? error.toDate.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl style={{ width: "250px" }}>
              <InputLabel required error={!!error.zonekeys}>
                Select Zone
              </InputLabel>
              <Controller
                control={control}
                name="zonekeys"
                rules={{ required: true }}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    variant="standard"
                    {...field}
                    error={!!error.zonekeys}
                  >
                    {zoneKey &&
                      zoneKey.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.zoneName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!error.zonekeys}>
                {/* {errors.zonekeys
                        ? labels.academicYearRequired
                        : null} */}
              </FormHelperText>
            </FormControl>
            <div style={{ display: "flex", gap: 20 }}>
              <Button variant="contained" type="submit" endIcon={<Search />}>
                {/* <FormattedLabel id='search' /> */}
                Search
              </Button>
              <Button
                variant="contained"
                onClick={handleToPrint}
                endIcon={<Print />}
              >
                Print
                {/* <FormattedLabel id='print' /> */}
              </Button>
            </div>
          </div>
        </form>
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
              // rows={[]}
              columns={reportColumns}
            />
          </div>
        )}
      </Paper>
    </>
  );
};

export default Index;
