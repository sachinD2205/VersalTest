import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Box,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Styles from "../MasterReport/Master.module.css";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
const SearchCreteriaReport = () => {
  const {
    control,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const language = useSelector((state) => state?.labels.language);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [events, setEvents] = useState([]);
  let user = useSelector((state) => state?.user?.user);
  const router = useRouter();
  const currDate = new Date();
  const setFormDefaultDate = moment("01/01/2022", "DD/MM/YYYY");
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // Department
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let data = res?.data?.department?.map((row) => ({
            id: row?.id,
            departmentEn: row?.department,
            departmentMr: row?.departmentMr,
          }));
          data.sort(sortByProperty("departmentEn"));
          setDepartments(data);
        } else {
        }
      })
      .catch((err) => {  cfcErrorCatchMethod(err,true);});
  };

  // subDepartment
  const getSubDepartmentBasedonDepartment = () => {
    axios
      .get(
        `${
          urls.CFCURL
        }/master/subDepartment/getBySubDepartment?department=${watch(
          "department"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let data = res?.data?.subDepartment?.map((r) => ({
            id: r.id,
            subDepartmentEn: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          }));
          data.sort(sortByProperty("subDepartmentEn"));
          setSubDepartments(data);
        } else {
        }
      })
      .catch((err) => {  cfcErrorCatchMethod(err,true);});
  };

  // getEvents
  const getEvents = () => {
    axios
      .get(`${urls.GM}/mediaMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((r) => {
        if (r?.status == "200" || r?.status == "201") {
          if (
            r?.data?.mediaMasterList != null &&
            r?.data?.mediaMasterList != undefined
          ) {
            let data = r?.data?.mediaMasterList?.map((res) => ({
              id: res?.id,
              eventNameEn: res?.mediaName,
              eventNameMr: res?.mediaNameMr,
            }));
            data.sort(sortByProperty("eventNameEn"));
            setEvents(data);
          }
        } else {
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err,false);
      });
  };

  //cancellButton
  const cancellButton = () => {
    setValue("department", null);
    setValue("lstSubDepartment", []);
    setValue("splevent", []);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("lastCommissionorDate", null);
    clearErrors();
    // categoryWiseData
    setValue("categoryWiseData", null);
    // pointwise
    setValue("pointWise", null);
    // ghoshwara
    setValue("PralabitData", null);
    setValue("EscalationPralabitData", null);
    // daywiseSelection
    setValue("DayWiseSelectionData", null);
    // dayWiseSelectionInDetail
    setValue("dayWiseDataInDetails", null);
    //searchButton
    setValue("searchButtonInputState", true);
    // Audited
    setValue("AuditData", null);
    setValue("ClickFiledNameEn", "");
    setValue("ClickFiledNameMr", "");
    // SarathiAudited
    setValue("SarathiAuditData", null);
    setValue("ClickFiledNameEn", "");
    setValue("ClickFiledNameMr", "");
    // chart
    setValue("CategoryWiseChartData", null);
    setValue("selectedDepartmentForChart", "");
  };

  useEffect(() => {
    getDepartment();
    getEvents();
  }, []);

  useEffect(() => {
    if (
      watch("department") != null &&
      watch("department") != "" &&
      watch("department") != undefined
    ) {
      getSubDepartmentBasedonDepartment();
    }
  }, [watch("department")]);


  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };

  // View
  return (
    <>
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
              {language == "en"
                ? "Commissioner Review Report"
                : "आयुक्तांचा आढावा अहवाल"}
            </h3>
          </Grid>
        </Grid>
      </Box>

      <Grid
        container
        className={Styles.Grid}
        sx={{
          marginTop: 1,
          marginBottom: 5,
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className={Styles.GridItem}
        >
          <FormControl style={{ marginTop: 0 }} error={!!errors?.fromDate}>
            <Controller
              disabled={!watch("searchButtonInputState")}
              name="fromDate"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    defaultValue={null}
                    maxDate={moment.now()}
                    disabled={!watch("searchButtonInputState")}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromDate" required />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                    }
                    selected={
                      field.value !== undefined
                        ? field.value
                        : setFormDefaultDate
                    }
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
            <FormHelperText>
              {errors?.fromDate ? errors?.fromDate?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className={Styles.GridItem}
        >
          <FormControl style={{ marginTop: 0 }} error={!!errors?.toDate}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    defaultValue={null}
                    maxDate={moment.now()}
                    minDate={watch("fromDate")}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="toDate" required />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                    }
                    selected={
                      field.value !== undefined && field.value !== null
                        ? field.value
                        : currDate
                    }
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
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className={Styles.GridItem}
        >
          <FormControl variant="standard" error={!!errors?.department}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="departmentName" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={!watch("searchButtonInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="departmentName" />}
                >
                  {departments &&
                    departments.map((department, index) => (
                      <MenuItem key={index} value={department?.id}>
                        {language == "en"
                          ? department?.departmentEn
                          : department?.departmentMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="department"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.department ? errors?.department?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className={Styles.GridItem}
        >
          <FormControl variant="standard" error={!!errors.lstSubDepartment}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="subDepartmentName" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={!watch("searchButtonInputState")}
                  label={<FormattedLabel id="subDepartmentName" />}
                  multiple
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  renderValue={(val) =>
                    watch("lstSubDepartment")
                      .map((j) => {
                        if (language == "en") {
                          return subDepartments?.find((obj) => obj?.id == j)
                            ?.subDepartmentEn;
                        } else {
                          return subDepartments?.find((obj) => obj?.id == j)
                            ?.subDepartmentMr;
                        }
                      })
                      .join(",")
                  }
                >
                  {subDepartments?.map((obj) => (
                    <MenuItem key={obj?.id} value={obj?.id}>
                      <Checkbox
                        checked={watch("lstSubDepartment")?.includes(obj?.id)}
                      />
                      <ListItemText
                        primary={
                          language == "en"
                            ? obj?.subDepartmentEn
                            : obj?.subDepartmentMr
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              )}
              name="lstSubDepartment"
              control={control}
              defaultValue={[]}
            />
            <FormHelperText>
              {errors?.lstSubDepartment
                ? errors?.lstSubDepartment?.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className={Styles.GridItem}
        >
          <FormControl variant="standard" error={!!errors.splevent}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="eventName" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={!watch("searchButtonInputState")}
                  label="Events"
                  multiple
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  renderValue={(val) =>
                    watch("splevent")
                      .map((j) => {
                        if (language == "en") {
                          return events.find((obj) => obj.id == j)?.eventNameEn;
                        } else {
                          return events.find((obj) => obj.id == j)?.eventNameMr;
                        }
                      })
                      .join(",")
                  }
                >
                  {events.map((obj) => (
                    <MenuItem key={obj.id} value={obj.id}>
                      <Checkbox
                        checked={watch("splevent")?.includes(obj?.id)}
                      />
                      <ListItemText
                        primary={
                          language == "en" ? obj.eventNameEn : obj.eventNameMr
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              )}
              name="splevent"
              control={control}
              defaultValue={[]}
            />
            <FormHelperText>
              {errors?.splevent ? errors?.splevent?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className={Styles.GridItem}
        >
          <FormControl
            style={{ marginTop: 0 }}
            error={!!errors?.lastCommissionorDate}
          >
            <Controller
              control={control}
              name="lastCommissionorDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    defaultValue={null}
                    maxDate={
                      watch("toDate") == null ? moment.now() : watch("toDate")
                    }
                    minDate={watch("fromDate")}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        {<FormattedLabel id="lastCommissionorDate" required />}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))
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
            <FormHelperText>
              {errors?.lastCommissionorDate
                ? errors?.lastCommissionorDate?.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      {/** Buttons  */}

      <Stack
        direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
        justifyContent="center"
        alignItems="center"
        paddingBottom="5"
        marginTop="5"
      >
        {watch("searchButtonInputState") == true ? (
          <>
            <Button
              type="submit"
              onClick={() => {
                console.log("ButtonName -- Pointwise");
                setValue("buttonName", "pointWise");
              }}
              variant="contained"
              color="success"
              endIcon={<SearchIcon />}
              size="small"
            >
              {language == "en" ? "Point Wise" : "मुद्यानुसार"}
            </Button>

            <Button
              type="submit"
              onClick={() => {
                console.log("ButtonName -- Pointwise");
                setValue("buttonName", "categoryWise");
              }}
              variant="contained"
              color="success"
              size="small"
              endIcon={<SearchIcon />}
            >
              {language == "en" ? "category wise" : "श्रेणीनुसार"}
            </Button>
          </>
        ) : (
          ""
        )}
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<ClearIcon />}
          onClick={() => cancellButton()}
        >
          <FormattedLabel id="clear" />
        </Button>
      </Stack>
    </>
  );
};

export default SearchCreteriaReport;
