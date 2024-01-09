import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/common/reports/listOfDepartment.module.css";
import Head from "next/head";
import {
  Button,
  FormControl,
  FormHelperText,
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

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(
      yup.object().shape({
        // departmentType: yup
        //   .string()
        //   .required("Please select a department")
        //   .typeError("Please select a department"),
        // petAnimalKey: yup
        //   .number()
        //   .required("Please select an animal")
        //   .typeError("Please select an animal"),
        // fromDate: yup
        //   .date()
        //   .typeError(`Please select a from Date`)
        //   .required(`Please select a from Date`),
        // toDate: yup
        //   .date()
        //   .typeError(`Please select a to Date`)
        //   .required(`Please select a to Date`),
      })
    ),
  });

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: watch("departmentType") + " Report",
  });

  useEffect(() => {
    getDepartment();
    getZone();
  }, []);

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            ...row,
            id: row.id,
            department: row.department,
            departmentMr: row.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setZones(res.data.zone);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr No" : "अनु क्र",
      width: 100,
    },
    {
      field: "departmentName",
      headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
      width: 900,
    },
    // {
    //   field: language == "en" ? "petAnimalEn" : "petAnimalMr",
    //   headerName: language == "en" ? "Pet Animal" : "पाळीव प्राणी",
    //   width: 90,
    // },
  ];

  const finalSubmit = (data) => {
    console.log("finalSubmit");
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("post", res);
        setTable(
          res.data.department.length > 0
            ? res.data.department.map((j, i) => ({
                ...j,
                srNo: i + 1,
                departmentName: j.department,
              }))
            : []
        );
        res.data.department.length == 0 &&
          sweetAlert("Info", "No records found", "info");
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  console.log("table", table);

  return (
    <>
      <Head>
        <title>List Of Department</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          {/* <FormattedLabel id="ipdOrOpdReport" /> */}
          List Of Department
        </div>
        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row}>
            <FormControl variant="standard" error={!!error.departmentType}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="departmentType" required /> */}
                Department Name
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="departmentType"
                  >
                    {departments &&
                      departments.map((department, index) => (
                        <MenuItem key={index} value={department.id}>
                          {language == "en"
                            ? department.department
                            : department.departmentMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="departmentType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.departmentType ? error.departmentType.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant="standard" error={!!error.departmentType}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="departmentType" required /> */}
                Department Id
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="departmentType"
                  >
                    {departments &&
                      departments.map((department, index) => (
                        <MenuItem key={index} value={department.id}>
                          {department.id}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="departmentType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.departmentType ? error.departmentType.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant="standard" error={!!error.petAnimalKey}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="petAnimal" required /> */}
                Zone Name
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="petAnimalKey"
                  >
                    {zones &&
                      zones.map((each, index) => (
                        <MenuItem key={index} value={each.id}>
                          {language == "en" ? each.zoneName : each.zoneNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="petAnimalKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.petAnimalKey ? error.petAnimalKey.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant="standard" error={!!error.petAnimalKey}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="petAnimal" required /> */}
                Zone Id
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="petAnimalKey"
                  >
                    {zones &&
                      zones.map((each, index) => (
                        <MenuItem key={index} value={each.id}>
                          {each.id}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="petAnimalKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.petAnimalKey ? error.petAnimalKey.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={styles.centerDiv} style={{ gap: 20, marginTop: 20 }}>
            <Button variant="contained" type="submit" endIcon={<Search />}>
              {/* <FormattedLabel id="search" /> */}
              Search
            </Button>
            <Button
              disabled={table.length == 0}
              variant="contained"
              onClick={handleToPrint}
              endIcon={<Print />}
            >
              {/* <FormattedLabel id="print" /> */}
              Print
            </Button>
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
              customReportName={{
                en: "List Of Department",
                mr: "विभागाची यादी",
              }}
              columns={columns}
            />
          </div>
        )}
      </Paper>
    </>
  );
};

export default Index;
