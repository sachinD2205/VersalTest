import {
  Button,
  Grid,
  FormControl,
  TextField,
  ThemeProvider,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import theme from "../../../../../theme";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import { ExitToApp, Save } from "@mui/icons-material";
import moment from "moment";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import commonRoleId from "../../../../../components/SlumBillingManagementSystem/FileUpload/RoleId/commonRole";
import CompleteSiteVisitPage from "../completeScheduledSiteVisit/index";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
const Index = (props) => {
  const {
    register,
    watch,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });
  const [dataSource, setDataSource] = useState(null);
  const [hutData, setHutData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleList, setScheduleList] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  let loggedInUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    setDataSource(props.data);
    setHutData(props.hutData);
  }, [props]);

  useEffect(() => {
    if (dataSource != null) {
      let res = dataSource;
      setScheduleList(
        res?.trnVisitScheduleList.map((obj, index) => {
          return {
            id: index + 1,
            scheduledTimeText: obj.scheduledTimeText
              ? moment(obj.scheduledTimeText)?.format("DD-MM-YYYY HH:mm ")
              : "-",
          };
        })
      );
    }
  }, [dataSource]);

  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "scheduledTimeText",
      headerName: <FormattedLabel id="scheduleDateTime" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
  ];

  const callVisitSite = () => {
    let _body = {
      ...dataSource.trnVisitScheduleList[0],
      isRescheduled: dataSource.status === 2 ? false : true,
      referenceKey: router.query.id,
      scheduledDate:
        dataSource.status === 2
          ? moment(watch("scheduledTime")).format("YYYY-MM-DDTHH:mm:ss")
          : dataSource.trnVisitScheduleList[0].scheduledDate,
      scheduledTimeText:
        dataSource.status === 2
          ? moment(watch("scheduledTime")).format("YYYY-MM-DDTHH:mm:ss")
          : dataSource.trnVisitScheduleList[0].scheduledDate,
      rescheduleDate: watch("rescheduleTime")
        ? moment(watch("rescheduleTime")).format("YYYY-MM-DDTHH:mm:ss")
        : null,
      rescheduleTimeText: watch("rescheduleTime")
        ? moment(watch("rescheduleTime")).format("YYYY-MM-DDTHH:mm:ss")
        : null,

      slumKey: dataSource?.slumKey,
      hutNo: dataSource?.hutNo,
      length: hutData?.length,
      breadth: hutData?.breadth,
      height: hutData?.height,
      constructionTypeKey: hutData?.constructionTypeKey,
      usageTypeKey: hutData?.usageTypeKey,
      area: hutData?.areaOfHut,
    };
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnVisitSchedule/issuePhotopass/save`, _body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले!",
            text:
              dataSource?.status == 2
                ? language === "en"
                  ? `Site visit against ${dataSource.applicationNo} scheduled successfully !`
                  : ` साइट भेट ${dataSource.applicationNo} यशस्वीरित्या शेड्यूल केली!`
                : watch("isRescheduled") === "true"
                ? language === "en"
                  ? `Site visit against ${dataSource.applicationNo} rescheduled successfully !`
                  : ` साइट भेट ${dataSource.applicationNo} यशस्वीरित्या पुन्हा शेड्यूल केली!`
                : language === "en"
                ? `Site visit against ${dataSource.applicationNo} completed successfully !`
                : ` साइट भेट ${dataSource.applicationNo} यशस्वीरित्या पूर्ण केली!`,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false, // Prevent closing on click outside
          }).then((will) => {
            if (will) {
              router.push(
                "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
              );
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const checkAuth = () => {
    return authority.includes(commonRoleId.ROLE_CLERK) ? false : true;
  };

  return (
    // <ThemeProvider theme={theme}>
    <>
      {isLoading && <CommonLoader />}
      <Grid container spacing={2} sx={{ padding: "1rem" }}>
        {scheduleList.length != 0 && dataSource?.status != 2 && (
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <DataGrid
              autoHeight
              sx={{
                margin: "10px",
                overflowY: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              pageSize={10}
              density="standard"
              pagination={{ pageSizeOptions: [10, 20, 50, 100] }}
              rows={scheduleList}
              columns={columns}
            />
          </Grid>
        )}
        {dataSource?.status === 2 && (
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <Controller
              control={control}
              name="scheduledTime"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    disablePast
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        size="small"
                        fullWidth
                        sx={{
                          m: { xs: 0, md: 1 },
                          minWidth: "100%",
                        }}
                        error={error.scheduledTime}
                        helperText={
                          error?.scheduledTime
                            ? error.scheduledTime.message
                            : null
                        }
                      />
                    )}
                    label={<FormattedLabel id="scheduleDateTime" required />}
                    onChange={(date) => {
                      const formattedDate = moment(date).format("YYYY-MM-DD");
                      const formattedTime = moment(date).format("hh:mm:ss A");
                      field.onChange(`${formattedDate} ${formattedTime}`);
                    }}
                    value={
                      field.value
                        ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                        : null
                    }
                    defaultValue={null}
                    disabled={dataSource?.status == 15}
                    inputFormat="YYYY-MM-DD hh:mm:ss A"
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>
        )}

        {authority &&
          authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
          (dataSource?.status == 15 || dataSource?.status == 28) && (
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl flexDirection="row">
                <Controller
                  {...register("isRescheduled")}
                  name="isRescheduled"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      selected={field.value}
                      row
                      disabled={true}
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        {...register("isRescheduled")}
                        value={"true"}
                        control={<Radio />}
                        label={<FormattedLabel id="isRescheduled" />}
                        error={!!error.isRescheduled}
                        helperText={
                          error?.isRescheduled
                            ? error.isRescheduled.message
                            : null
                        }
                      />
                      <FormControlLabel
                        {...register("isRescheduled")}
                        value={"false"}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        control={<Radio />}
                        label={<FormattedLabel id="siteVisitDone" />}
                        error={!!error.isRescheduled}
                        helperText={
                          error?.isRescheduled
                            ? error.isRescheduled.message
                            : null
                        }
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          )}

        {/* rescheduled */}
        {watch("isRescheduled") == "true" && (
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <Controller
              control={control}
              name="rescheduleTime"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    disablePast
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        size="small"
                        fullWidth
                        sx={{
                          m: { xs: 0, md: 1 },
                          minWidth: "100%",
                        }}
                        error={error.rescheduleTime}
                        helperText={
                          error?.rescheduleTime
                            ? error.rescheduleTime.message
                            : null
                        }
                      />
                    )}
                    label={<FormattedLabel id="rescheduleDateTime" />}
                    onChange={(date) => {
                      const formattedDate = moment(date).format("YYYY-MM-DD");
                      const formattedTime = moment(date).format("hh:mm:ss A");
                      field.onChange(`${formattedDate} ${formattedTime}`);
                    }}
                    value={
                      field.value
                        ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                        : null
                    }
                    defaultValue={null}
                    disabled={dataSource?.status == 2}
                    inputFormat="YYYY-MM-DD hh:mm:ss A"
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>
        )}
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          {((watch("isRescheduled") === "false" &&
            authority &&
            authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
            (dataSource?.status === 15 || dataSource?.status == 28)) ||
            (dataSource?.status != 2 &&
              dataSource?.status != 15 &&
              dataSource?.status != 28)) && (
            <CompleteSiteVisitPage data={dataSource} />
          )}
        </Grid>
      </Grid>

      {loggedInUser === "departmentUser" &&
        (((watch("isRescheduled") === undefined ||
          watch("isRescheduled") === null ||
          watch("isRescheduled") === "true") &&
          (dataSource?.status === 2 ||
            dataSource?.status === 15 ||
            dataSource?.status === 28)) ||
          (dataSource?.status === 2 &&
            authority &&
            authority.find((val) => val === commonRoleId.ROLE_CLERK))) && (
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <>
              <Grid
                item
                xl={
                  watch("isRescheduled") === "true" || dataSource?.status === 2
                    ? 6
                    : 12
                }
                lg={
                  watch("isRescheduled") === "true" || dataSource?.status === 2
                    ? 6
                    : 12
                }
                md={
                  watch("isRescheduled") === "true" || dataSource?.status === 2
                    ? 6
                    : 12
                }
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  endIcon={<ExitToApp />}
                  onClick={() => {
                    if(loggedInUser==='citizenUser'){
                      router.push("/dashboard");
                    }else if(loggedInUser==='cfcUser'){
                      router.push("/CFC_Dashboard");
                    } else {
                      router.push(
                        `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`
                      );
                    }
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
              {(watch("isRescheduled") === "true" ||
                dataSource?.status === 2) && (
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  sx={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    color="success"
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={
                      dataSource?.status === 2
                        ? props.isOverduePayment ||
                          loggedInUser === "citizenUser" ||
                          loggedInUser === "cfcUser" ||
                          checkAuth() ||
                          !watch("scheduledTime")
                        : watch("isRescheduled") === "true"
                        ? !watch("rescheduleTime")
                        : false
                    }
                    onClick={() => {
                      callVisitSite();
                    }}
                    endIcon={<Save />}
                  >
                    {dataSource?.status === 2 ? (
                      <FormattedLabel id="scheduleSiteVisit" />
                    ) : watch("isRescheduled") === "true" ? (
                      <FormattedLabel id="reScheduleSiteVisit" />
                    ) : (
                      <FormattedLabel id="completeSiteVisit" />
                    )}
                  </Button>
                </Grid>
              )}
            </>
          </Grid>
        )}
    </>
    // </ThemeProvider>
  );
};

export default Index;
