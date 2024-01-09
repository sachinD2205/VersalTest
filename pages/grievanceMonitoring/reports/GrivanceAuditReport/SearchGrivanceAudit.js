import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Box,
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
import Styles from "../GrivanceAuditReport/GrivanceAudit.module.css";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/** Sachin Durge */
// SearchGrivanceAudit
const SearchGrivanceAudit = () => {
  const {
    control,
    register,
    getValues,
    reset,
    setError,
    setValue,
    watch,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  let user = useSelector((state) => state?.user?.user);
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);

  // ! 🚩 Jay Shivaji  🚩  Jay Bhavani  🚩

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
          setDepartments(
            res?.data?.department?.map((row) => ({
              id: row?.id,
              departmentEn: row?.department,
              departmentMr: row?.departmentMr,
            }))
          );
        } else {
        }
      })
      .catch(() => {});
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
          setSubDepartments(
            res?.data?.subDepartment?.map((r) => ({
              id: r.id,
              subDepartmentEn: r.subDepartment,
              subDepartmentMr: r.subDepartmentMr,
            }))
          );
        } else {
        }
      })
      .catch((error) => {
        catchMethod(error)
      });
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
  //cancellButton
  const cancellButton = () => {
    setValue("department", null);
    setValue("subDepartmentlist", []);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("percentage", "");
    // GrievanceAuditData
    setValue("GrievanceAuditData", null);
    setValue("complaintIdList", null);
    setValue("reportTitle", "");
    clearErrors();
    setValue("searchInputState", true);
    // Second Screen
  };

  //exitButton
  const exitButton = () => {
    router.push(`/grievanceMonitoring/`);
  };

  // !   useEffect   ---------->

  useEffect(() => {
    getDepartment();
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
              {language == "en" ? "Grievance Audit" : "तक्रार लेखापरीक्षण"}
            </h3>
          </Grid>
        </Grid>
      </Box>

      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
          // paddingLeft: "50px",
          // align: "center",
        }}
        className={Styles.Grid}
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
              disabled={!watch("searchInputState")}
              name="fromDate"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled={!watch("searchInputState")}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromDate" />
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
                    disabled={!watch("searchInputState")}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="toDate" />
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
            <FormHelperText>
              {errors?.toDate ? errors?.toDate?.message : null}
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
          <FormControl variant="standard" error={!!errors?.department}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="departmentName" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={!watch("searchInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id="departmentName" />
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
          <FormControl variant="standard" error={!!errors.subDepartmentlist}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="subDepartmentName" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={!watch("searchInputState")}
                  label={<FormattedLabel id="subDepartmentName" />}
                  multiple
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  renderValue={(val) =>
                    watch("subDepartmentlist")
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
                        checked={watch("subDepartmentlist")?.includes(obj?.id)}
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
              name="subDepartmentlist"
              control={control}
              defaultValue={[]}
            />
            <FormHelperText>
              {errors?.subDepartmentlist
                ? errors?.subDepartmentlist?.message
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
          <TextField
            // sx={{ width: 250 }}
            disabled={!watch("searchInputState")}
            id="standard-basic"
            label={language == "en" ? "Percentage %" : "टक्केवारी %"}
            variant="standard"
            {...register("percentage")}
            error={!!errors.percentage}
            helperText={errors?.percentage ? errors.percentage.message : null}
          />
        </Grid>
      </Grid>

      {/** Buttons Start */}
      <Stack
        direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
        justifyContent="center"
        alignItems="center"
        paddingBottom="5"
        marginTop="5"
      >
        <>
          {watch("searchInputState") && (
            <>
              <Button
                type="submit"
                onClick={() => {
                  setValue("buttonName", "SubmitButton");
                }}
                variant="contained"
                color="success"
                endIcon={<SearchIcon />}
              >
                {language == "en" ? "Search" : "शोधा"}
              </Button>

              <Button
                variant="contained"
                color="primary"
                endIcon={<ClearIcon />}
                onClick={() => cancellButton()}
              >
                <FormattedLabel id="clear" />
              </Button>
              <Button
                variant="contained"
                color="error"
                endIcon={<ExitToAppIcon />}
                onClick={() => exitButton()}
              >
                <FormattedLabel id="exit" />
              </Button>
            </>
          )}
        </>
      </Stack>
      {/** Buttons End */}
    </>
  );
};

export default SearchGrivanceAudit;
