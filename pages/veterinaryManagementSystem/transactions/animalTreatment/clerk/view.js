import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import URLs from "../../../../../URLS/urls";

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import styles from "../ipd.module.css";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { ExitToApp, Payment, Save } from "@mui/icons-material";
import moment from "moment";
import { useSelector } from "react-redux";
import UploadButton from "../../../../../containers/reuseableComponents/UploadButton";
import { sortByAsc } from "../../../../../containers/reuseableComponents/Sorter";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Breadcrumb from "../../../../../components/common/BreadcrumbComponent";
import Title from "../../../../../containers/VMS_ReusableComponents/Title";
import Loader from "../../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const View = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const userToken = useGetToken();

  const [ipdDropDown, setIpdDropDown] = useState([]);
  const [petAnimal, setPetAnimal] = useState([]);
  const [petBreeds, setPetBreeds] = useState([]);
  const [allData, setAllData] = useState({});
  // const [animalPhoto, setAnimalPhoto] = useState('')
  const [animalPhotoOne, setAnimalPhotoOne] = useState("");
  const [animalPhotoTwo, setAnimalPhotoTwo] = useState("");
  const [animalPhotoThree, setAnimalPhotoThree] = useState("");
  const [loader, setLoader] = useState(false);

  const animalTreatmentSchema = yup.object().shape({
    ipdKey: yup
      .number()
      .required()
      .typeError(
        language === "en" ? "Please select an IPD" : "कृपया एक IPD निवडा"
      ),
    complainerName: yup
      .string()
      .required(
        language === "en"
          ? "Please enter complainer's full name"
          : "कृपया तक्रारकर्त्याचे पूर्ण नाव प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z\u0900-\u097F\s]+$/,
        language === "en"
          ? "Must be only english or marathi characters"
          : "फक्त इंग्लिश किंवा मराठी शब्द "
      ),
    complainerAddress: yup
      .string()
      .required(
        language === "en"
          ? "Please enter complainer's address"
          : "कृपया तक्रारदाराचा पत्ता प्रविष्ट करा"
      ),
    complainerMobileNo: yup
      .string()
      .required(
        language === "en"
          ? `Please enter complainer's mobile number`
          : "कृपया तक्रारदाराचा मोबाईल नंबर टाका"
      )
      .matches(
        /^[6-9][0-9]+$/,
        language === "en" ? "Invalid mobile no." : "अवैध मोबाईल नंबर"
      )
      .min(
        10,
        language === "en"
          ? "Mobile Number must be of 10 digits"
          : "मोबाईल नंबर 10 अंकी असणे आवश्यक आहे"
      )
      .max(
        10,
        language === "en"
          ? "Mobile Number must be of 10 digits"
          : "मोबाईल नंबर 10 अंकी असणे आवश्यक आहे"
      ),
    animalName: yup
      .string()
      .required(
        language === "en" ? "Please select an animal" : "कृपया एक प्राणी निवडा"
      )
      .typeError(
        language === "en" ? "Please select an animal" : "कृपया एक प्राणी निवडा"
      ),
    animalSex: yup
      .string()
      .required(
        language === "en" ? "Please select a gender" : "कृपया लिंग निवडा"
      )
      .typeError(
        language === "en" ? "Please select a gender" : "कृपया लिंग निवडा"
      ),
    // animalSex: yup
    //   .string()
    //   .required('Please select a gender')
    //   .typeError('Please select a gender'),
    // animalSpeciesKey: yup
    //   .number()
    //   .required('Please select a breed')
    //   .typeError('Please select a breed'),
    // animalColour: yup
    //   .string()
    //   .required('Please enter the color')
    //   .typeError('Please enter the color'),
    // symptoms: yup.string().required().typeError('Please enter the symptoms'),
    pickupDate: yup
      .date()
      .typeError(
        language === "en"
          ? `Please select the date of pickup`
          : "कृपया पिकअपची तारीख निवडा"
      )
      .required(
        language === "en"
          ? `Please select the date of pickup`
          : "कृपया पिकअपची तारीख निवडा"
      ),
    reasonforPick: yup
      .string()
      .required(
        language === "en"
          ? "Please enter a reason for pickup"
          : "कृपया पिकअपचे कारण एंटर करा"
      ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(animalTreatmentSchema),
  });

  const today = new Date();
  const fiveDaysAgo = new Date();

  fiveDaysAgo.setDate(today.getDate() - 4);

  useEffect(() => {
    console.log("five days ago: ", fiveDaysAgo);
    if (!router.query.id) {
      setValue("receiptDate", moment(new Date()).format("YYYY-MM-DD"));
      setValue("narration", "IPD Registration");
    }

    //Get IPD
    axios
      .get(`${URLs.VMS}/mstIpd/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setIpdDropDown(
          res.data.mstIpdList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            ipdEn: j.ipdName,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetAnimal(() => {
          sortByAsc(res.data.mstPetAnimalList, "nameEn");
          return res.data.mstPetAnimalList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            nameEn: j.nameEn,
            nameMr: j.nameMr,
          }));
        });
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Pet Breeds
    axios
      .get(`${URLs.VMS}/mstAnimalBreed/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetBreeds(() => {
          sortByAsc(res.data.mstAnimalBreedList, "breedNameEn");
          return res.data.mstAnimalBreedList.map((j, i) => ({
            id: j.id,
            breedNameEn: j.breedNameEn,
            breedNameMr: j.breedNameMr,
            petAnimalKey: j.petAnimalKey,
          }));
        });
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    router.query.id &&
      axios
        .get(`${URLs.VMS}/trnAnimalTreatmentIpd/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          setAllData({ ...res.data });
          reset({ ...res.data });
          setAnimalPhotoOne(res.data.photoOne ?? "");
          setAnimalPhotoTwo(res.data.photoTwo ?? "");
          setAnimalPhotoThree(res.data.photoThree ?? "");
          setValue("nameType", res.data.volunteerName ? "volunteer" : "team");
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language);
        });
  }, []);

  const finalSubmit = (data) => {
    setLoader(true);

    const finalBody = {
      ...data,
      status: "Initiated",
      // animalPhoto,
      photoOne: animalPhotoOne,
      photoTwo: animalPhotoTwo,
      photoThree: animalPhotoThree,

      // activeFlag: "Y",
    };
    sweetAlert({
      title: language === "en" ? "Confirmation" : "पुष्टीकरण",
      text:
        language === "en"
          ? "Are you sure you want to submit the application ?"
          : "तुमची खात्री आहे की तुम्ही अर्ज सबमिट करू इच्छिता?",
      icon: "warning",
      buttons: [
        language === "en" ? "Cancel" : "रद्द करा",
        language === "en" ? "Save" : "जतन करा",
      ],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${URLs.VMS}/trnAnimalTreatmentIpd/save`, finalBody, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert(
                language === "en" ? "Success" : "यशस्वी झाले",
                language === "en"
                  ? "Patient record created successfully !"
                  : "पेशंटचे रेकॉर्ड यशस्वीरित्या तयार केले!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              );
              router.push(
                `/veterinaryManagementSystem/transactions/animalTreatment/clerk`
              );
            }
            setLoader(false);
          })
          .catch((error) => {
            catchExceptionHandlingMethod(error, language);
            setLoader(false);
          });
      } else {
        setLoader(false);
      }
    });
  };

  return (
    <>
      <Head>
        <title>Treating sick and injured animal through IPD</title>
      </Head>
      <Breadcrumb />
      <Paper className={styles.main}>
        {loader && <Loader />}

        <Title titleLabel={<FormattedLabel id="ipdHeading" />} />
        <form
          onSubmit={handleSubmit(finalSubmit)}
          style={{ padding: "5vh 3%" }}
        >
          <div className={styles.row}>
            <FormControl
              disabled={router.query.id ? true : false}
              variant="standard"
              error={!!error.ipdKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="ipdName" />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="IpdKey"
                  >
                    {ipdDropDown &&
                      ipdDropDown.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {/* {language === 'en' ? obj.ipdEn : obj.ipdMr} */}
                          {obj.ipdEn}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="ipdKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.ipdKey ? error.ipdKey.message : null}
              </FormHelperText>
            </FormControl>

            <TextField
              sx={{ width: 250 }}
              label={<FormattedLabel id="complainerName" />}
              disabled={router.query.id ? true : false}
              variant="standard"
              {...register("complainerName")}
              error={!!error.complainerName}
              InputLabelProps={{
                shrink:
                  router.query.id || watch("complainerName") ? true : false,
              }}
              helperText={
                error?.complainerName ? error.complainerName.message : null
              }
            />
            <TextField
              sx={{ width: 250 }}
              label={<FormattedLabel id="complainerAddress" />}
              disabled={router.query.id ? true : false}
              variant="standard"
              {...register("complainerAddress")}
              error={!!error.complainerAddress}
              InputLabelProps={{
                shrink:
                  router.query.id || watch("complainerAddress") ? true : false,
              }}
              helperText={
                error?.complainerAddress
                  ? error.complainerAddress.message
                  : null
              }
            />
            <TextField
              sx={{ width: 250 }}
              label={<FormattedLabel id="complainerMobileNo" />}
              disabled={router.query.id ? true : false}
              variant="standard"
              {...register("complainerMobileNo")}
              error={!!error.complainerMobileNo}
              InputLabelProps={{
                shrink:
                  router.query.id || watch("complainerMobileNo") ? true : false,
              }}
              helperText={
                error?.complainerMobileNo
                  ? error.complainerMobileNo.message
                  : null
              }
            />
          </div>

          <div className={styles.row}>
            {!router.query.id && (
              <FormControl
                disabled={router.query.id ? true : false}
                variant="standard"
                error={!!error.nameType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="teamOrVolunteer" />
                </InputLabel>
                {/* @ts-ignore */}
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: 250 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="nameType"
                    >
                      <MenuItem key={1} value={"team"}>
                        {language === "en" ? "Team" : "संघ"}
                      </MenuItem>
                      <MenuItem key={2} value={"volunteer"}>
                        {language === "en" ? "Volunteer" : "स्वयंसेवक"}
                      </MenuItem>
                    </Select>
                  )}
                  name="nameType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {error?.nameType ? error.nameType.message : null}
                </FormHelperText>
              </FormControl>
            )}
            {watch("nameType") ? (
              <>
                {watch("nameType") == "team" && (
                  <TextField
                    sx={{ width: 250 }}
                    label={<FormattedLabel id="teamName" />}
                    disabled={router.query.id ? true : false}
                    variant="standard"
                    {...register("ownerFullName")}
                    error={!!error.ownerFullName}
                    InputLabelProps={{
                      shrink:
                        router.query.id || watch("ownerFullName")
                          ? true
                          : false,
                    }}
                    helperText={
                      error?.ownerFullName ? error.ownerFullName.message : null
                    }
                  />
                )}
                {watch("nameType") == "volunteer" && (
                  <TextField
                    sx={{ width: 250 }}
                    label={<FormattedLabel id="volunteerName" />}
                    disabled={router.query.id ? true : false}
                    variant="standard"
                    {...register("volunteerName")}
                    error={!!error.volunteerName}
                    InputLabelProps={{
                      shrink:
                        router.query.id || watch("volunteerName")
                          ? true
                          : false,
                    }}
                    helperText={
                      error?.volunteerName ? error.volunteerName.message : null
                    }
                  />
                )}
              </>
            ) : (
              <div style={{ width: 250 }}></div>
            )}
            <div style={{ width: 250 }}></div>
            <div style={{ width: 250 }}></div>
          </div>

          <div className={styles.subTitle}>
            <FormattedLabel id="animalDetails" />
          </div>

          <div className={styles.row}>
            <FormControl
              disabled={router.query.id ? true : false}
              variant="standard"
              error={!!error.animalName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="petAnimal" />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue(
                        "animalSpeciesKey",
                        petBreeds
                          .filter((obj) => {
                            return obj.petAnimalKey == watch("animalName");
                          })
                          .find((obj) => obj.breedNameEn == "Non Descript")?.id
                      );
                    }}
                    label="animalName"
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === "en" ? obj.nameEn : obj.nameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="animalName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.animalName ? error.animalName.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              // disabled={router.query.id || !watch('animalName') ? true : false}
              disabled
              variant="standard"
              error={!!error.animalSpeciesKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="animalBreed" />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="animalSpeciesKey"
                  >
                    {petBreeds &&
                      petBreeds
                        .filter((obj) => {
                          return obj.petAnimalKey == watch("animalName");
                        })
                        .map((obj, index) => (
                          <MenuItem key={index} value={obj.id}>
                            {language === "en"
                              ? obj.breedNameEn
                              : obj.breedNameMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name="animalSpeciesKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.animalSpeciesKey
                  ? error.animalSpeciesKey.message
                  : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={router.query.id ? true : false}
              variant="standard"
              error={!!error.animalSex}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="animalGender" />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="animalSex"
                  >
                    <MenuItem key={1} value={"M"}>
                      {language === "en" ? "Male" : "पुरुष"}
                    </MenuItem>
                    <MenuItem key={2} value={"F"}>
                      {language === "en" ? "Female" : "स्त्री"}
                    </MenuItem>
                  </Select>
                )}
                name="animalSex"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.animalSex ? error.animalSex.message : null}
              </FormHelperText>
            </FormControl>
            {/* <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: 250 }}
              label={<FormattedLabel id="animalAge" />}
              // @ts-ignore
              variant="standard"
              {...register("animalAge")}
              error={!!error.animalAge}
              InputLabelProps={{
                shrink: router.query.id || watch("animalAge") ? true : false,
              }}
              helperText={error?.animalAge ? error.animalAge.message : null}
            /> */}
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: 250 }}
              label={<FormattedLabel id="animalColor" />}
              // @ts-ignore
              variant="standard"
              {...register("animalColour")}
              error={!!error.animalColour}
              InputLabelProps={{
                shrink: router.query.id || watch("animalColour") ? true : false,
              }}
              helperText={
                error?.animalColour ? error.animalColour.message : null
              }
            />
          </div>

          <div className={styles.row}>
            <div>
              <UploadButton
                appName="VMS"
                serviceName="PetLicense"
                // @ts-ignore
                label={<FormattedLabel id="animalPhotoOne" required />}
                filePath={animalPhotoOne}
                fileUpdater={setAnimalPhotoOne}
                view={router.query.id ? true : false}
                onlyImage
                readOnly={!!router.query.id}
              />
              <label style={{ color: "red" }}>
                <FormattedLabel id="imageOnly" />
              </label>
            </div>
            <div>
              <UploadButton
                appName="VMS"
                serviceName="PetLicense"
                // @ts-ignore
                label={<FormattedLabel id="animalPhotoTwo" required />}
                filePath={animalPhotoTwo}
                fileUpdater={setAnimalPhotoTwo}
                view={router.query.id ? true : false}
                onlyImage
                readOnly={!!router.query.id}
              />
              <label style={{ color: "red" }}>
                <FormattedLabel id="imageOnly" />
              </label>
            </div>
            <div>
              <UploadButton
                appName="VMS"
                serviceName="PetLicense"
                // @ts-ignore
                label={<FormattedLabel id="animalPhotoThree" required />}
                filePath={animalPhotoThree}
                fileUpdater={setAnimalPhotoThree}
                view={router.query.id ? true : false}
                onlyImage
                readOnly={!!router.query.id}
              />
              <label style={{ color: "red" }}>
                <FormattedLabel id="imageOnly" />
              </label>
            </div>
            <div style={{ width: 250 }}></div>
          </div>

          <div className={styles.row}>
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: 250 }}
              label={<FormattedLabel id="kennelNo" />}
              // @ts-ignore
              variant="standard"
              {...register("kennelNo")}
              error={!!error.kennelNo}
              InputLabelProps={{
                shrink: router.query.id || watch("kennelNo") ? true : false,
              }}
              helperText={error?.kennelNo ? error.kennelNo.message : null}
            />
          </div>

          <div className={styles.subTitle}>
            <FormattedLabel id="caseEntry" />
          </div>

          <div className={styles.row}>
            <FormControl error={!!error.pickupDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name="pickupDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      minDate={fiveDaysAgo}
                      disabled={!!router.query.id}
                      inputFormat="dd-MM-yyyy"
                      label={<FormattedLabel id="pickupDate" required />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 250 }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                          error={!!error.pickupDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.pickupDate ? error.pickupDate.message : null}
              </FormHelperText>
            </FormControl>
            <div style={{ width: "75%" }}>
              <span
                style={{
                  opacity: router.query.id ? 0.5 : 1,
                  // color: !!error.reasonforPick ? 'red' : 'black',
                }}
              >
                <FormattedLabel id="reasonForPickUp" required /> :
              </span>
              {/* @ts-ignore */}
              <TextareaAutosize
                style={{
                  opacity: router.query.id ? 0.5 : 1,
                  border: "1.5px solid grey",
                  // border: !!error.reasonforPick
                  //   ? '1.5px solid red'
                  //   : '1.5px solid grey',
                }}
                color="neutral"
                disabled={router.query.id ? true : false}
                minRows={3}
                maxRows={5}
                placeholder={
                  language === "en" ? "Reason For Picking Up" : "आणण्याचे कारण"
                }
                className={styles.bigText}
                {...register("reasonforPick")}
              />
            </div>
          </div>

          {/* <div className={styles.row}>
            <span style={{ opacity: router.query.id ? 0.5 : 1 }}>
              <FormattedLabel id='symptoms' /> :
            </span>
            <TextareaAutosize
              style={{ opacity: router.query.id ? 0.5 : 1 }}
              color='neutral'
              disabled={router.query.id ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={language === 'en' ? 'Symptoms' : 'लक्षणं'}
              className={styles.bigText}
              {...register('symptoms')}
            />
          </div> */}

          {/* @ts-ignore */}
          {allData?.dignosisDetails && (
            <div className={styles.row}>
              <span
                style={{
                  opacity:
                    // @ts-ignore
                    allData.status != "Initiated" ? 0.5 : 1,
                }}
              >
                <FormattedLabel id="diagnosisDetail" /> :
              </span>
              {/* @ts-ignore */}
              <TextareaAutosize
                color="neutral"
                // @ts-ignore
                style={{ opacity: allData.status != "Initiated" ? 0.5 : 1 }}
                // @ts-ignore
                disabled={allData.status != "Initiated" ? true : false}
                minRows={3}
                maxRows={5}
                placeholder={
                  language === "en" ? "Diagnosis Details" : "निदान तपशील"
                }
                className={styles.bigText}
                {...register("dignosisDetails")}
              />
            </div>
          )}

          {/* <div className={styles.subTitle}>
            <FormattedLabel id="payment" />
          </div> */}

          {/* <div className={styles.row}>
            <FormControl
              disabled={router.query.id ? true : false}
              variant="standard"
              error={!!error.paymentMode}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="paymentMode" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="paymentMode"
                  >
                    <MenuItem key={1} value={"online"}>
                      Online
                    </MenuItem>
                    <MenuItem key={2} value={"cash"}>
                      Cash
                    </MenuItem>
                  </Select>
                )}
                name="paymentMode"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{error?.paymentMode ? error.paymentMode.message : null}</FormHelperText>
            </FormControl>
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="payerName" />}
              // @ts-ignore
              variant="standard"
              {...register("payerName")}
              error={!!error.payerName}
              InputLabelProps={{
                shrink: router.query.id || watch("payerName") ? true : false,
              }}
              helperText={error?.payerName ? error.payerName.message : null}
            />
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="payerAddress" />}
              // @ts-ignore
              variant="standard"
              {...register("payerAddress")}
              error={!!error.payerAddress}
              InputLabelProps={{
                shrink: router.query.id || watch("payerAddress") ? true : false,
              }}
              helperText={error?.payerAddress ? error.payerAddress.message : null}
            />
          </div> */}
          {/* <div className={styles.row}>
            <FormControl disabled={router.query.id ? true : false} error={!!error.receiptDate}>
              <Controller
                control={control}
                name="receiptDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      // disabled={router.query.id ? true : false}
                      disabled
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="receiptDate" />}
                      // @ts-ignore
                      value={field.value}
                      // value={router.query.id ? field.value : new Date()}
                      onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "250px" }}
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
              <FormHelperText>{error?.receiptDate ? error.receiptDate.message : null}</FormHelperText>
            </FormControl>
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="narration" />}
              // @ts-ignore
              variant="standard"
              {...register("narration")}
              error={!!error.narration}
              InputLabelProps={{
                shrink: router.query.id || watch("narration") ? true : false,
              }}
              helperText={error?.narration ? error.narration.message : null}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="amount" />}
              value="Rs. 10"
              // @ts-ignore
              variant="standard"
            />
          </div> */}

          <div className={styles.buttons}>
            {/* {
              // @ts-ignore
              (allData.status == "Awaiting Payment" || allData.status == "Payment Successful") && (
                <Button
                  variant="contained"
                  endIcon={<Description />}
                  onClick={() => {
                    router.push({
                      pathname: `/veterinaryManagementSystem/transactions/prescription`,
                      query: { id: router.query.id, service: "ipd" },
                    });
                  }}
                >
                  <FormattedLabel id="prescription" />
                </Button>
              )
            } */}

            {!router.query.id && (
              <Button
                variant="contained"
                type="submit"
                color="success"
                endIcon={<Save />}
              >
                <FormattedLabel id="save" />
              </Button>
            )}

            {/* {router.query.id && (
              <Button
                variant='contained'
                endIcon={<Description />}
                onClick={() => {
                  router.push({
                    pathname:
                      '/veterinaryManagementSystem/transactions/casePaperReceipt',
                    query: { id: router.query.id, service: 'ipd' },
                  })
                }}
              >
                <FormattedLabel id='casePaperReceipt' />
              </Button>
            )} */}

            {
              // @ts-ignore
              allData.status === "Awaiting Payment" && (
                <Button
                  variant="contained"
                  onClick={() => {
                    router.push({
                      pathname: `/veterinaryManagementSystem/transactions/ipd/paymentGateway`,
                      query: { id: router.query.id },
                    });
                  }}
                  endIcon={<Payment />}
                >
                  <FormattedLabel id="makePayment" />
                </Button>
              )
            }

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                router.push(
                  `/veterinaryManagementSystem/transactions/animalTreatment/clerk`
                );
              }}
              endIcon={<ExitToApp />}
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
