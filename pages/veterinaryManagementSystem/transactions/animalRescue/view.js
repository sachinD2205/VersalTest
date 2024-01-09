import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./animalRescue.module.css";

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
import Title from "../../../../containers/VMS_ReusableComponents/Title";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import sweetAlert from "sweetalert";
import URLs from "../../../../URLS/urls";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import { TimePicker } from "@mui/x-date-pickers";
import { Clear, ExitToApp, Save } from "@mui/icons-material";
import UploadButton from "../../../../containers/reuseableComponents/UploadButton";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const View = () => {
  const language = useSelector((state) => state?.labels?.language);

  const userToken = useGetToken();

  const [animalPhoto, setAnimalPhoto] = useState("");

  const [disableState, setDisableState] = useState(false);

  const [showButtons, setShowButtons] = useState(true);
  const [actionField, setActionField] = useState(false);
  const [remarkField, setRemarkField] = useState(false);

  const [loader, setLoader] = useState(false);

  const roles = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.menus?.find(
      (menu) =>
        menu.id == Number(localStorage.getItem("selectedMenuFromDrawer"))
    )
  )?.roles;

  const [dynamicSchema, setDynamicSchema] = useState({});

  const schema = yup.object().shape({
    ...dynamicSchema,
  });

  const {
    control,
    watch,
    reset,
    register,
    handleSubmit,
    getValues,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (
      (roles?.includes("ADMINISTRATIVE_OFFICER") &&
        ["APPROVE_BY_CURATOR", "REJECTED_BY_CURATOR"].includes(
          watch("applicationStatus")
        )) ||
      (roles?.includes("ENTRY") &&
        [
          "APPLICATION_CREATED",
          "APPROVE_BY_CURATOR",
          "REJECTED_BY_CURATOR",
        ].includes(watch("applicationStatus"))) ||
      (roles?.includes("APPROVAL") &&
        [
          "APPROVE_BY_CURATOR",
          "REVERT_BY_CURATOR",
          "REJECTED_BY_CURATOR",
        ].includes(watch("applicationStatus")))
    ) {
      setShowButtons(false);
    }

    //Disabling fields
    if (
      [
        "APPLICATION_CREATED",
        "APPROVE_BY_CURATOR",
        "REJECTED_BY_CURATOR",
      ].includes(watch("applicationStatus")) ||
      (roles?.includes("APPROVAL") &&
        ["REVERT_BY_CURATOR"].includes(watch("applicationStatus")))
    ) {
      setDisableState(true);
    }

    //Conditional rendering action field
    if (
      (roles?.includes("ADMINISTRATIVE_OFFICER") &&
        ["APPLICATION_CREATED"].includes(watch("applicationStatus"))) ||
      (roles?.includes("APPROVAL") &&
        ["APPLICATION_CREATED"].includes(watch("applicationStatus")))
    ) {
      setActionField(true);
    }

    //Conditional rendering remark field
    !!watch("applicationStatus") && setRemarkField(true);

    setDynamicSchema(
      roles?.includes("APPROVAL") ||
        (roles?.includes("ADMINISTRATIVE_OFFICER") &&
          ["APPLICATION_CREATED"].includes(watch("applicationStatus")))
        ? {
            action: yup
              .string()
              .required(
                language === "en"
                  ? "Please select an action."
                  : "कृपया एखादी क्रिया निवडा."
              )
              .typeError(
                language === "en"
                  ? "Please select an action."
                  : "कृपया एखादी क्रिया निवडा"
              ),
            curatorRemark: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter a remark."
                  : "कृपया एक शेरा प्रविष्ट करा."
              )
              .typeError(
                language === "en"
                  ? "Please enter a remark."
                  : "कृपया एक शेरा प्रविष्ट करा"
              ),
          }
        : {
            applicationDate: yup
              .date()
              .required(
                language === "en"
                  ? "Please select date of application"
                  : "कृपया अर्जाची तारीख निवडा"
              )
              .typeError(
                language === "en"
                  ? "Please select date of application"
                  : "कृपया अर्जाची तारीख निवडा"
              ),
            applicationTime: yup
              .string()
              .required(
                language === "en"
                  ? "Please select time of application"
                  : "कृपया अर्जाची वेळ निवडा"
              )
              .typeError(
                language === "en"
                  ? "Please select time of application"
                  : "कृपया अर्जाची वेळ निवडा"
              ),
            nameOfInformer: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter the name of informer"
                  : "कृपया नाव प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter the name of informer"
                  : "कृपया माहिती देणाऱ्याचे नाव टाका"
              ),
            addressOrLocationOfRescue: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter address or location of rescue"
                  : "कृपया पत्ता किंवा बचावाचे स्थान प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? "Please enter address or location of rescue"
                  : "कृपया पत्ता किंवा बचावाचे स्थान प्रविष्ट करा"
              ),
            contactNo: yup
              .number()
              .required(
                language === "en"
                  ? "Please enter valid contact no."
                  : "कृपया वैध संपर्क क्रमांक प्रविष्ट करा."
              )
              .typeError(
                language === "en"
                  ? "Please enter contact no."
                  : "कृपया संपर्क क्रमांक प्रविष्ट करा."
              ),
            rescuerName: yup
              .string()
              .required(
                language === "en"
                  ? `Please enter rescuer's name`
                  : "कृपया बचावकर्त्याचे नाव प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? `Please enter rescuer's name`
                  : "कृपया बचावकर्त्याचे नाव प्रविष्ट करा"
              ),

            mobileNo: yup
              .number()
              .required(
                language === "en"
                  ? "Please enter valid mobile no."
                  : "कृपया वैध मोबाईल क्रमांक प्रविष्ट करा."
              )
              .typeError(
                language === "en"
                  ? "Please enter mobile no."
                  : "कृपया मोबाईल क्रमांक प्रविष्ट करा."
              ),
            dateOfRescue: yup
              .date()
              .required(
                language === "en"
                  ? "Please select date of rescue"
                  : "कृपया बचावाची तारीख निवडा"
              )
              .typeError(
                language === "en"
                  ? "Please select date of rescue"
                  : "कृपया बचावाची तारीख निवडा"
              ),
            timeOfRescue: yup
              .string()
              .required(
                language === "en"
                  ? "Please select time of application"
                  : "कृपया अर्जाची वेळ निवडा"
              )
              .typeError(
                language === "en"
                  ? "Please select time of application"
                  : "कृपया अर्जाची वेळ निवडा"
              ),
            commonName: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter the common name."
                  : "कृपया सामान्य नाव प्रविष्ट करा."
              )
              .typeError(
                language === "en"
                  ? "Please enter the common name."
                  : "कृपया सामान्य नाव प्रविष्ट करा."
              ),
            scientificName: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter the scientific name."
                  : "कृपया वैज्ञानिक  नाव प्रविष्ट करा."
              )
              .typeError(
                language === "en"
                  ? "Please enter the scientific name."
                  : "कृपया वैज्ञानिक  नाव प्रविष्ट करा."
              ),
            age: yup
              .string()
              .required(
                language === "en"
                  ? "Please enter valid age."
                  : "कृपया वैध वय प्रविष्ट करा."
              )
              .typeError(
                language === "en"
                  ? "Please enter the age."
                  : "कृपया वय प्रविष्ट करा."
              ),
            sex: yup
              .string()
              .required(
                language === "en"
                  ? `Please enter sex`
                  : "कृपया लिंग प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? `Please enter sex`
                  : "कृपया लिंग प्रविष्ट करा"
              ),
            weight: yup
              .string()
              .required(
                language === "en"
                  ? `Please enter weight`
                  : "कृपया वजन  प्रविष्ट करा"
              )
              .typeError(
                language === "en"
                  ? `Please enter weight`
                  : "कृपया वजन  प्रविष्ट करा"
              ),
            conditionOnArrival: yup
              .string()
              .required(
                language === "en"
                  ? `Please specify condition on arrival`
                  : "कृपया आगमनाची अट निर्दिष्ट करा"
              )
              .typeError(
                language === "en"
                  ? `Please specify condition on arrival`
                  : "कृपया आगमनाची अट निर्दिष्ट करा"
              ),
            prognosis: yup
              .string()
              .required(
                language === "en"
                  ? `Please specify prognosis`
                  : "कृपया रोगनिदान निर्दिष्ट करा"
              )
              .typeError(
                language === "en"
                  ? `Please specify prognosis`
                  : "कृपया रोगनिदान निर्दिष्ट करा"
              ),
          }
    );
  }, [watch("applicationStatus"), language]);

  useEffect(() => {
    if (router.query.id) {
      setLoader(true);
      axios
        .get(`${URLs.VMS}/trnAnimalRescue/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          reset({
            ...res?.data,
            applicationTime:
              moment(new Date()).format("YYYY-MM-DD") +
              "T" +
              res?.data?.applicationTime,
            timeOfRescue:
              moment(new Date()).format("YYYY-MM-DD") +
              "T" +
              res?.data?.timeOfRescue,
          });
          setAnimalPhoto(res?.data?.animalPhoto);
          setLoader(false);
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language);
        });
    }
  }, []);

  const clearData = () => {
    if (
      roles?.includes("APPROVAL") ||
      (roles?.includes("ADMINISTRATIVE_OFFICER") &&
        ["APPLICATION_CREATED"].includes(watch("applicationStatus")))
    ) {
      reset({
        ...getValues(),
        action: "",
        curatorRemark: "",
      });
    } else {
      reset({
        ...getValues(),
        nameOfInformer: "",
        addressOrLocationOfRescue: "",
        contactNo: "",
        rescuerName: "",
        mobileNo: "",
        commonName: "",
        scientificName: "",
        age: "",
        sex: "",
        weight: "",
        conditionOnArrival: "",
        prognosis: "",
        applicationDate: null,
        applicationTime: null,
        dateOfRescue: null,
        timeOfRescue: null,
      });
      setAnimalPhoto("");
    }
  };

  const finalSubmit = (data) => {
    const isScrutiny =
      roles?.includes("APPROVAL") ||
      (roles?.includes("ADMINISTRATIVE_OFFICER") &&
        ["APPLICATION_CREATED"].includes(watch("applicationStatus")));

    const bodyForAPI = isScrutiny
      ? {
          id: watch("id"),
          action: data?.action,
          role: "CURATOR",
          curatorRemark: data?.curatorRemark,
        }
      : {
          ...data,
          applicationDate: moment(data?.applicationDate).format("YYYY-MM-DD"),
          applicationTime: moment(data?.applicationTime).format("HH:mm:ss"),
          dateOfRescue: moment(data?.dateOfRescue).format("YYYY-MM-DD"),
          timeOfRescue: moment(data?.timeOfRescue).format("HH:mm:ss"),
          animalPhoto,
        };

    if (!!animalPhoto) {
      sweetAlert({
        title: language == "en" ? "Confirmation" : "पुष्टी",
        text:
          language == "en"
            ? "Are you sure you want to save the data?"
            : "तुमची खात्री आहे की तुम्ही डेटा जतन करू इच्छिता",
        icon: "warning",
        buttons: ["Cancel", "Save"],
      }).then((ok) => {
        if (ok) {
          axios
            .post(
              `${URLs.VMS}/trnAnimalRescue/${
                isScrutiny ? "saveApprove" : "save"
              }`,
              bodyForAPI,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                sweetAlert(
                  "Saved",
                  bodyForAPI?.id
                    ? language == "en"
                      ? "Data updated successfully"
                      : "डेटा यशस्वीरित्या अपडेट केला"
                    : language == "en"
                    ? "Data saved successfully"
                    : "डेटा यशस्वीरित्या डेटा जतन केला",
                  "success"
                );
                router.push(
                  `/veterinaryManagementSystem/transactions/animalRescue`
                );
              }
            })
            .catch((error) => {
              catchExceptionHandlingMethod(error, language);
            });
        }
      });
    } else {
      sweetAlert({
        title: language == "en" ? "Warning" : "चेतावणी",
        text:
          language == "en" ? "Please upload an image" : "कृपया प्रतिमा जोडा",
        icon: "warning",
        buttons: ["Cancel", "Save"],
      });
    }
  };

  return (
    <>
      <Head>
        <title>Animal Rescue</title>
      </Head>
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id="animalRescue" />} />
        {loader && <Loader />}
        <form
          onSubmit={handleSubmit(finalSubmit)}
          style={{ padding: "0px 25px", marginTop: 20 }}
        >
          <Paper className={styles.container}>
            <div
              className={styles.wrapped}
              style={{ columnGap: 100, justifyContent: "flex-start" }}
            >
              <FormControl error={!!error.applicationDate}>
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name="applicationDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled={disableState}
                        disableFuture
                        inputFormat="dd/MM/yyyy"
                        label={<FormattedLabel id="date" required />}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 200 }}
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            error={!!error.applicationDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.applicationDate
                    ? error.applicationDate.message
                    : null}
                </FormHelperText>
              </FormControl>
              <FormControl error={!!error.applicationTime}>
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name="applicationTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        disabled={disableState}
                        label={<FormattedLabel id="time" required />}
                        value={field.value}
                        onChange={(time) => {
                          field.onChange(time);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            sx={{ width: 200 }}
                            error={!!error.applicationTime}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.applicationTime
                    ? error.applicationTime.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>
          </Paper>
          <Paper className={styles.container}>
            <div className={styles.subTitle}>
              <FormattedLabel id="rescuerInformation" />
            </div>

            <div className={styles.wrapped}>
              <TextField
                disabled={disableState}
                sx={{ width: 300 }}
                label={<FormattedLabel id="nameOfInformer" required />}
                variant="standard"
                {...register("nameOfInformer")}
                InputLabelProps={{ shrink: !!watch("nameOfInformer") }}
                error={!!error.nameOfInformer}
                helperText={
                  error?.nameOfInformer ? error.nameOfInformer.message : null
                }
              />
              <TextField
                sx={{
                  width: "100%",
                }}
                disabled={disableState}
                label={
                  <FormattedLabel id="addressOrLocationOfRescue" required />
                }
                variant="standard"
                {...register("addressOrLocationOfRescue")}
                InputLabelProps={{
                  shrink: !!watch("addressOrLocationOfRescue"),
                }}
                error={!!error.addressOrLocationOfRescue}
                helperText={
                  error?.addressOrLocationOfRescue
                    ? error.addressOrLocationOfRescue.message
                    : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: 300 }}
                label={<FormattedLabel id="contactNo" required />}
                variant="standard"
                {...register("contactNo")}
                InputLabelProps={{ shrink: !!watch("contactNo") }}
                error={!!error.contactNo}
                helperText={error?.contactNo ? error.contactNo.message : null}
              />
              <TextField
                disabled={disableState}
                sx={{ width: 300 }}
                label={<FormattedLabel id="rescuerName" required />}
                variant="standard"
                {...register("rescuerName")}
                InputLabelProps={{ shrink: !!watch("rescuerName") }}
                error={!!error.rescuerName}
                helperText={
                  error?.rescuerName ? error.rescuerName.message : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: 300 }}
                label={<FormattedLabel id="mobileNo" required />}
                variant="standard"
                {...register("mobileNo")}
                InputLabelProps={{ shrink: !!watch("mobileNo") }}
                error={!!error.mobileNo}
                helperText={error?.mobileNo ? error.mobileNo.message : null}
              />
              <FormControl error={!!error.dateOfRescue} sx={{ width: 300 }}>
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name="dateOfRescue"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled={disableState}
                        disableFuture
                        inputFormat="dd/MM/yyyy"
                        label={<FormattedLabel id="dateOfRescue" required />}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        renderInput={(params) => (
                          <TextField
                            // sx={{ width: '35vw' }}
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            error={!!error.dateOfRescue}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.dateOfRescue ? error.dateOfRescue.message : null}
                </FormHelperText>
              </FormControl>
              <FormControl error={!!error.timeOfRescue} sx={{ width: 300 }}>
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name="timeOfRescue"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        disabled={disableState}
                        label={<FormattedLabel id="timeOfRescue" required />}
                        value={field.value}
                        onChange={(time) => {
                          field.onChange(time);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            error={!!error.timeOfRescue}

                            // sx={{ width: '35vw' }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.timeOfRescue ? error.timeOfRescue.message : null}
                </FormHelperText>
              </FormControl>
              <div style={{ width: 300 }} />
            </div>
          </Paper>
          <Paper className={styles.container}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <b
                style={{
                  textTransform: "uppercase",
                  fontSize: "large",
                  marginBottom: 20,
                }}
              >
                <FormattedLabel id="officeCopy" />
              </b>
            </div>
            <div className={styles.subTitle}>
              <FormattedLabel id="informationOfRescuedAnimal" />
            </div>

            <div className={styles.wrapped}>
              <TextField
                disabled={disableState}
                sx={{ width: 300 }}
                label={<FormattedLabel id="commonName" required />}
                variant="standard"
                {...register("commonName")}
                InputLabelProps={{ shrink: !!watch("commonName") }}
                error={!!error.commonName}
                helperText={error?.commonName ? error.commonName.message : null}
              />
              <TextField
                disabled={disableState}
                sx={{ width: 300 }}
                label={<FormattedLabel id="scientificName" required />}
                variant="standard"
                {...register("scientificName")}
                InputLabelProps={{ shrink: !!watch("scientificName") }}
                error={!!error.scientificName}
                helperText={
                  error?.scientificName ? error.scientificName.message : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: 150 }}
                label={<FormattedLabel id="age" required />}
                variant="standard"
                {...register("age")}
                InputLabelProps={{ shrink: !!watch("age") }}
                error={!!error.age}
                helperText={error?.age ? error.age.message : null}
              />
              <TextField
                disabled={disableState}
                sx={{ width: 150 }}
                label={<FormattedLabel id="sex" required />}
                variant="standard"
                {...register("sex")}
                InputLabelProps={{ shrink: !!watch("sex") }}
                error={!!error.sex}
                helperText={error?.sex ? error.sex.message : null}
              />
              <TextField
                disabled={disableState}
                sx={{ width: 150 }}
                label={<FormattedLabel id="weight" required />}
                variant="standard"
                {...register("weight")}
                InputLabelProps={{ shrink: !!watch("weight") }}
                error={!!error.weight}
                helperText={error?.weight ? error.weight.message : null}
              />
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={<FormattedLabel id="conditionOnArrival" required />}
                variant="standard"
                {...register("conditionOnArrival")}
                InputLabelProps={{ shrink: !!watch("conditionOnArrival") }}
                error={!!error.conditionOnArrival}
                helperText={
                  error?.conditionOnArrival
                    ? error.conditionOnArrival.message
                    : null
                }
              />
              <TextField
                disabled={disableState}
                sx={{ width: "100%" }}
                label={<FormattedLabel id="prognosis" required />}
                variant="standard"
                {...register("prognosis")}
                InputLabelProps={{ shrink: !!watch("prognosis") }}
                error={!!error.prognosis}
                helperText={error?.prognosis ? error.prognosis.message : null}
              />

              <div>
                <UploadButton
                  appName="VMS"
                  serviceName="PetLicense"
                  label={<FormattedLabel id="animalPhoto" required />}
                  filePath={animalPhoto}
                  fileUpdater={setAnimalPhoto}
                  view={disableState}
                  readOnly={disableState}
                  onlyImage
                />
                <label style={{ color: "red" }}>
                  <FormattedLabel id="imageOnly" />
                </label>
              </div>
            </div>
          </Paper>
          {remarkField && (
            <Paper
              className={styles.container}
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                columnGap: 15,
              }}
            >
              {actionField && (
                <FormControl variant="standard" error={!!error.action}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="actions" />
                  </InputLabel>
                  {/* @ts-ignore */}
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: 200 }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // @ts-ignore
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="action"
                      >
                        {/* <MenuItem key={1} value={'approve'}>
                        {language === 'en' ? 'Approve' : 'मंजूर'}
                      </MenuItem>
                      <MenuItem key={3} value={'revert'}>
                        {language === 'en' ? 'Revert' : 'मागे'}
                      </MenuItem>
                      <MenuItem key={2} value={'reject'}>
                        {language === 'en' ? 'Reject' : 'नामंजूर'}
                      </MenuItem> */}
                        <MenuItem key={1} value={"APPROVE"}>
                          {language === "en" ? "Approve" : "मंजूर"}
                        </MenuItem>
                        <MenuItem key={3} value={"REVERT"}>
                          {language === "en" ? "Revert" : "मागे"}
                        </MenuItem>
                        <MenuItem key={2} value={"REJECTED"}>
                          {language === "en" ? "Reject" : "नामंजूर"}
                        </MenuItem>
                      </Select>
                    )}
                    name="action"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {error?.action ? error.action.message : null}
                  </FormHelperText>
                </FormControl>
              )}
              {remarkField && (
                <TextField
                  // disabled={!saveBttnState || disableState}
                  disabled={
                    !["APPLICATION_CREATED"].includes(
                      watch("applicationStatus")
                    ) || roles?.includes("ENTRY")
                  }
                  sx={{ width: actionField ? "75%" : "100%" }}
                  label={<FormattedLabel id="curatorRemark" required />}
                  variant="standard"
                  {...register("curatorRemark")}
                  InputLabelProps={{ shrink: !!watch("curatorRemark") }}
                  error={!!error.curatorRemark}
                  helperText={
                    error?.curatorRemark ? error.curatorRemark.message : null
                  }
                />
              )}
            </Paper>
          )}

          <div className={styles.buttons}>
            {/* {saveBttnState && (
              <Button
                variant='contained'
                endIcon={<Save />}
                color='success'
                type='submit'
              >
                <FormattedLabel id='save' />
              </Button>
            )}
            {clearBttnState && (
              <Button
                variant='outlined'
                endIcon={<Clear />}
                color='error'
                onClick={() => clearData()}
              >
                <FormattedLabel id='clear' />
              </Button>
            )} */}
            {showButtons && (
              <>
                <Button
                  variant="contained"
                  endIcon={<Save />}
                  color="success"
                  type="submit"
                >
                  <FormattedLabel id="save" />
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<Clear />}
                  color="error"
                  onClick={() => clearData()}
                >
                  <FormattedLabel id="clear" />
                </Button>
              </>
            )}
            <Button
              variant="contained"
              endIcon={<ExitToApp />}
              color="error"
              onClick={() => router.back()}
            >
              <FormattedLabel id="exit" />
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default View;
