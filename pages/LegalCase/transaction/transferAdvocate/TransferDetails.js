import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "./view.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const TransferDetails = () => {
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const {
    register,
    control,
    handleSubmit,
    methods,
    getValues,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useFormContext();

  const [advocateNames, setAdvocateNames] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);

  // const { control, watch } = useForm();
  const transferFromAdvocate = watch("transferFromAdvocate");
  const transferToAdvocate = watch("transferToAdvocate");
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

  // For remarkApi
  // const remarkApi = (currentField) => {
  //   // let body = {
  //   //   ...currentField,
  //   // }
  //   let stringToSend = currentField;
  //   console.log("transalation", currentField);
  //   // const currentField = currentField;
  //   // const UpdatedField = UpdatedField;
  //   const url = `https://noncoredev.pcmcindia.gov.in/backend/lc/lc/api/translator/translate`;

  //   axios.post(url, { body: stringToSend }).then((res) => {
  //     if (res?.status == 200 || res?.status == 201) {
  //       let bodyResponse = JSON.parse(res?.data.text);
  //       console.log("resssss123", bodyResponse.body);
  //       setValue("remarkMr", bodyResponse?.body);
  //     }
  //   });
  // };

  // New

  const remarkApi = (currentFieldInput, updateFieldName, languagetype) => {
    //---------------------------------- old-----------------------------------------
    // let stringToSend = currentFieldInput;
    // const url = `https://noncoredev.pcmcindia.gov.in/backend/lc/lc/api/translator/translate`;
    // axios.post(url, { body: stringToSend }).then((res) => {
    //   if (res?.status == 200 || res?.status == 201) {
    //     let bodyResponse = JSON.parse(res?.data.text);
    //     console.log("titlepanelRemark", bodyResponse.body);
    //     setValue("caseDetailsMr", bodyResponse?.body);
    //   }
    // });

    // --------------------------------new by vishal--------------------------------------------------------

    if (currentFieldInput) {
      let _payL = {
        apiKey: "Alpesh",
        textToTranslate: currentFieldInput,
        languagetype: languagetype,
      };
      setLoading(true);
      axios
        // .post(`${urls.TRANSLATIONAPI}`, _payL)
        .post(`${urls.GOOGLETRANSLATIONAPI}`, _payL)
        .then((r) => {
          setLoading(false);
          if (r.status === 200 || r.status === 201) {
            console.log("_res", currentFieldInput, r);
            if (updateFieldName) {
              setValue(updateFieldName, r?.data);
              clearErrors(updateFieldName);
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          catchExceptionHandlingMethod(e, language);
        });
    } else {
      sweetAlert({
        title: language === "en" ? "Not Found !!" : "सापडले नाही !!",
        text:
          language === "en"
            ? "We do not received any input to translate !!"
            : "आम्हाला भाषांतर करण्यासाठी कोणतेही इनपुट मिळाले नाही !!",
        icon: "warning",
      });
    }
  };

  // getAdvocateName
  const getAdvocateName = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdvocateNames(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            advocateName: r.firstName + " " + r.middleName + " " + r.lastName,

            advocateNameMr:
              r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // dept
  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartmentNames(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            department: r.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // coutrt Names
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // useEffect(() => {
  //   getCourtName();
  // }, [departmentNames]);

  // useEffect(() => {

  // }, [courtNames]);

  useEffect(() => {
    getAdvocateName();
    getDepartmentName();
    getCourtName();
  }, []);

  useEffect(() => {
    if (
      router?.query?.pageMode == "Edit" ||
      router?.query?.pageMode == "View"
    ) {
      console.log("router?.query", router?.query);
      setValue("transferFromAdvocate", router?.query?.transferFromAdvocate);
      setValue("transferToAdvocate", Number(router?.query?.transferToAdvocate));
    }
  }, [router?.query]);

  // view
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ThemeProvider theme={theme}>
            <Grid container style={{ marginLeft: 70, padding: "10px" }}>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <FormControl
                  variant="standard"
                  sx={{ minWidth: 200, marginTop: "20px" }}
                  error={!!errors.transferFromAdvocate}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* <FormattedLabel id="advocateName" /> */}
                    Transfer From Advocate
                  </InputLabel>

                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled
                        //   sx={{ width: 500 }}
                        value={field.value}
                        // disabled={router?.query?.pageMode === "View"}
                        onChange={(value) => field.onChange(value)}
                        label=" Transfer From Advocate"
                      >
                        {advocateNames &&
                          advocateNames
                            .slice()
                            .sort((a, b) =>
                              a.advocateName.localeCompare(
                                b.advocateName,
                                undefined,
                                {
                                  numeric: true,
                                }
                              )
                            )
                            .map((advocateName, index) => (
                              <MenuItem
                                key={index}
                                // @ts-ignore
                                value={advocateName.id}
                              >
                                {/* @ts-ignore */}
                                {/* {title.title} */}
                                {language == "en"
                                  ? advocateName?.advocateName
                                  : advocateName?.advocateNameMr}
                              </MenuItem>
                            ))}
                      </Select>
                    )}
                    name="transferFromAdvocate"
                    control={control}
                    defaultValue=""
                  />
                </FormControl>
                <FormHelperText>
                  {errors?.transferFromAdvocate
                    ? errors.transferFromAdvocate.message
                    : null}
                </FormHelperText>
              </Grid>

              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                {/* <FormControl
              variant="standard"
              sx={{ minWidth: 190, marginTop: "20px" }}
              error={!!errors.transferToAdvocate}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Transfer To Advocate
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    //   sx={{ width: 500 }}
                    value={field.value}
                    disabled={router?.query?.pageMode === "View"}
                    onChange={(value) => field.onChange(value)}
                    label=" Transfer To Advocate"
                  >
                    {advocateNames &&
                      advocateNames
                        .slice()
                        .sort((a, b) =>
                          a.advocateName.localeCompare(
                            b.advocateName,
                            undefined,
                            {
                              numeric: true,
                            }
                          )
                        )
                        .map((advocateName, index) => (
                          <MenuItem
                            key={index}
                            // @ts-ignore
                            value={advocateName.id}
                          >
                            {/* @ts-ignore */}
                {/* {title.title} */}
                {/* {language == "en"
                              ? advocateName?.advocateName
                              : advocateName?.advocateNameMr}
                          </MenuItem> */}
                {/* ))} */}
                {/* </Select> */}
                {/* )} */}
                {/* name="transferToAdvocate" */}
                {/* //   control={control} */}
                {/* defaultValue="" */}
                {/* /> */}
                {/* </FormControl> */}

                {/* <FormHelperText>
              {errors?.transferToAdvocate
                ? errors.transferToAdvocate.message
                : null}
            </FormHelperText>  */}

                {/* Autocomplete */}
                <FormControl
                  variant="standard"
                  error={!!errors.transferToAdvocate}
                  sx={{ marginTop: 2 }}
                >
                  <Controller
                    name="transferToAdvocate"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        id="controllable-states-demo"
                        onChange={(event, newValue) => {
                          onChange(newValue ? newValue.id : null);
                        }}
                        value={
                          advocateNames?.find((data) => data?.id === value) ||
                          null
                        }
                        options={
                          advocateNames.length != 0
                            ? advocateNames?.filter(
                                (data) =>
                                  data?.id !=
                                  Number(watch("transferFromAdvocate"))
                              )
                            : []
                        }
                        getOptionLabel={(advocateName) =>
                          language == "en"
                            ? advocateName?.advocateName
                            : advocateName?.advocateNameMr
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              language == "en"
                                ? "Transfer To Advocate Name"
                                : "वकिलाच्या नावावर हस्तांतरित करा"
                            }
                          />
                        )}
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors?.transferToAdvocate
                      ? errors?.transferToAdvocate?.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <FormControl
                  style={{ backgroundColor: "white", marginTop: "2vh" }}
                  error={!!errors?.fromDate}
                >
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={router?.query?.pageMode === "View"}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="fromDate" />
                            </span>
                          }
                          value={field.value || null}
                          onChange={(date) => field.onChange(date)}
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
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.fromDate ? errors.fromDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* Remove To Date */}
              {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <FormControl
                  style={{ backgroundColor: "white", marginTop: 0 }}
                  error={!!errors?.toDate}
                >
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          minDate={watch("fromDate")}
                          disabled={
                            router?.query?.pageMode === "View" ||
                            !watch("fromDate")
                          }
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="toDate" />
                            </span>
                          }
                          value={field.value || null}
                          onChange={(date) => field.onChange(date)}
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
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.toDate ? errors.toDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}

              <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                <FormControl
                  style={{ backgroundColor: "white", marginTop: 0 }}
                  error={!!errors?.newAppearnceDate}
                >
                  <Controller
                    control={control}
                    name="newAppearnceDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          // minDate={watch("fromDate")}
                          disabled={router?.query?.pageMode === "View"}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              Select New (Appearance)Date
                            </span>
                          }
                          value={field.value || null}
                          onChange={(date) => field.onChange(date)}
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
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.newAppearnceDate
                      ? errors.newAppearnceDate.message
                      : null}
                  </FormHelperText>
                </FormControl>

                {/* <FormControl
              fullWidth
              style={{ marginTop: 10 }}
              // sx={{ width: "60%" }}
              // size="small"
              variant='standard'
              // error={errors?.newAppearnceDate}
            >
              <Controller
                control={control}
                name='newAppearnceDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='DD/MM/YYYY'
                      minDate={watch("fromDate")}
                      disabled={router?.query?.pageMode === "View"}
                      label={
                        <span style={{ fontSize: 16 }}>
                          Select New (Appearance)Date
                        </span>
                      }
                      // InputProps={{ style: { fontSize: 5 } }}
                      // InputLabelProps={{ style: { fontSize: 50 } }}
                      // size="small"
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      renderInput={(params) => (
                        <TextField
                          error={errors?.newAppearnceDate ? true : false}
                          disabled={router?.query?.pageMode === "View"}
                          variant='standard'
                          style={{ marginTop: 10 }}
                          // sx={{ width: "60%" }}
                          // InputLabelProps={{ style: { fontSize: 13 } }}
                          InputProps={{ style: { fontSize: 20 } }}
                          InputLabelProps={{ style: { fontSize: 13 } }}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.newAppearnceDate
                  ? errors?.newAppearnceDate?.message
                  : null}
              </FormHelperText>
            </FormControl> */}
              </Grid>

              {/* <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              // label="RemarksEn"
              label={<FormattedLabel id="remarksEn" />}
              maxRows={4}
              {...register("remark")}
              error={!!errors.remark}
              helperText={errors?.remark ? errors.remark.message : null}
            />
          </Grid>

          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              // label="RemarksMr"
              label={<FormattedLabel id="remarksMr" />}
              maxRows={4}
              {...register("remarkMr")}
              error={!!errors.remarkMr}
              helperText={errors?.remarkMr ? errors.remarkMr.message : null}
            />
          </Grid> */}
            </Grid>

            {/* For Remarks  in English*/}
            <Grid container style={{ marginLeft: 70, padding: "10px" }}>
              <Grid item xl={11} lg={11.2} md={11.2} sm={11.2} xs={11}>
                <TextField
                  // fullWidth
                  sx={{
                    width: "87%",
                  }}
                  disabled={router?.query?.pageMode === "View"}
                  // label="RemarksEn"
                  label={<FormattedLabel id="remarksEn" />}
                  // maxRows={4}
                  {...register("remark")}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}
                  InputLabelProps={{
                    shrink:
                      (watch("remark") ? true : false) ||
                      (router.query.remark ? true : false),
                  }}
                />

                {/*  Button For Translation */}
                <Button
                  // sx={{
                  //   marginTop: "6vh",
                  //   marginLeft: "1vw",
                  // }}
                  sx={{
                    marginTop: "40px",
                    marginLeft: "1vw",
                    height: "5vh",
                    width: "9vw",
                  }}
                  onClick={() => remarkApi(watch("remark"), "remarkMr", "en")}
                >
                  {/* Translate */}
                  <FormattedLabel id="mar" />
                </Button>
                {/* <Transliteration
              disabled={router?.query?.pageMode === "View"}
              _key={"remark"}
              labelName={"remark"}
              fieldName={"remark"}
              updateFieldName={"remarkMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="remarksEn" required />}
              error={!!errors.remark}
              helperText={errors?.remark ? errors.remark.message : null}
            /> */}
              </Grid>
            </Grid>
            {/* For Remarks  in Marathi*/}
            <Grid container style={{ marginLeft: 70, padding: "10px" }}>
              <Grid item xl={11.2} lg={11.2} md={11.2} sm={11.2} xs={11}>
                <TextField
                  sx={{
                    width: "87%",
                  }}
                  disabled={router?.query?.pageMode === "View"}
                  // label="RemarksMr"
                  label={<FormattedLabel id="remarksMr" />}
                  maxRows={4}
                  {...register("remarkMr")}
                  error={!!errors.remarkMr}
                  helperText={errors?.remarkMr ? errors.remarkMr.message : null}
                  InputLabelProps={{
                    shrink:
                      (watch("remarkMr") ? true : false) ||
                      (router.query.remarkMr ? true : false),
                  }}
                />

                <Button
                  // sx={{
                  //   marginTop: "6vh",
                  //   marginLeft: "1vw",
                  // }}
                  sx={{
                    marginTop: "40px",
                    marginLeft: "1vw",
                    height: "5vh",
                    width: "9vw",
                  }}
                  onClick={() => remarkApi(watch("remarkMr"), "remark", "mr")}
                >
                  {/* Translate */}
                  <FormattedLabel id="eng" />
                </Button>

                {/* <Transliteration
              disabled={router?.query?.pageMode === "View"}
              _key={"remarkMr"}
              labelName={"remarkMr"}
              fieldName={"remarkMr"}
              updateFieldName={"remark"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="remarksMr" required />}
              error={!!errors.remarkMr}
              helperText={errors?.remarkMr ? errors.remarkMr.message : null}
            /> */}
              </Grid>
            </Grid>
          </ThemeProvider>
        </>
      )}
    </>
  );
};

export default TransferDetails;
