import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import URLs from "../../../../URLS/urls";
import styles from "./petIncinerator.module.css";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  Paper,
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Clear, ExitToApp, Payment, Save, Search } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";
import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";
import Breadcrumb from "../../../../components/common/BreadcrumbComponent";
import Title from "../../../../containers/VMS_ReusableComponents/Title";
import {
  useGetToken,
  useApplicantType,
} from "../../../../containers/reuseableComponents/CustomHooks";

import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const applicantType = useApplicantType();

  const userToken = useGetToken();

  const isDeptUser = useSelector(
    // @ts-ignore
    (state) => state?.user?.user?.userDao?.deptUser
  );

  // @ts-ignore
  const userId = useSelector((state) => state.user.user.id);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [areaDropDown, setAreaDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);
  const [petAnimal, setPetAnimal] = useState([]);
  const [petBreeds, setPetBreeds] = useState([]);
  const [loader, setLoader] = useState(false);

  let petSchema = yup.object().shape({
    petAnimalKey: yup
      .number()
      .required(
        language === "en" ? "Please select an animal" : "कृपया एक प्राणी निवडा"
      )
      .typeError(
        language === "en" ? "Please select an animal" : "कृपया एक प्राणी निवडा"
      ),
    zoneKey: yup
      .number()
      .required(
        language === "en" ? "Please select a zone" : "कृपया एक झोन निवडा"
      )
      .typeError(
        language === "en" ? "Please select a zone" : "कृपया एक झोन निवडा"
      ),
    wardKey: yup
      .number()
      .required(
        language === "en" ? "Please select a ward" : "कृपया प्रभाग निवडा"
      )
      .typeError(
        language === "en" ? "Please select a ward" : "कृपया प्रभाग निवडा"
      ),
    areaKey: yup
      .number()
      .required(
        language === "en" ? "Please select a area" : "कृपया क्षेत्र निवडा"
      )
      .typeError(
        language === "en" ? "Please select a area" : "कृपया क्षेत्र निवडा"
      ),
    ownerName: yup
      .string()
      .required(
        language === "en"
          ? "Please enter owner's name"
          : "कृपया मालकाचे नाव प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? "Please enter owner's name"
          : "कृपया मालकाचे नाव प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z\u0900-\u097F\s]+$/,
        language === "en"
          ? "Must be only english or marathi characters"
          : "फक्त इंग्लिश किंवा मराठी शब्द "
      ),
    ownerAddress: yup
      .string()
      .required(
        language === "en"
          ? "Please enter owner's address"
          : "कृपया मालकाचा पत्ता प्रविष्ट करा"
      ),
    ownerEmailId: yup
      .string()
      .required(
        language === "en"
          ? "Please enter owner's email id"
          : "कृपया मालकाचा ईमेल आयडी प्रविष्ट करा"
      ),
    ownerMobileNo: yup
      .string()
      .matches(
        /^[6-9][0-9]+$/,
        language === "en" ? "Invalid mobile no." : "अवैध मोबाईल नंबर"
      )
      .required(
        language === "en"
          ? "Please enter owner's mobile no."
          : "कृपया मालकाचा मोबाईल नंबर प्रविष्ट करा"
      ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    //Get Area
    axios
      .get(`${URLs.CFCURL}/master/area/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setAreaDropDown(
          res.data.area.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            areaEn: j.areaName,
            areaMr: j.areaNameMr,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Zone
    axios
      .get(`${URLs.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setZoneDropDown(
          res.data.zone.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            zoneEn: j.zoneName,
            zoneMr: j.zoneNameMr,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Ward
    axios
      .get(`${URLs.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setWardDropDown(
          res.data.ward.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            wardEn: j.wardName,
            wardMr: j.wardNameMr,
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
        setPetAnimal(
          res.data.mstPetAnimalList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            nameEn: j.nameEn,
            nameMr: j.nameMr,
          }))
        );
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

    if (router.query.id) {
      setLoader(true);

      axios
        .get(`${URLs.VMS}/trnSmallPetIncineration/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          reset({ ...res.data });
          setApplicationStatus(res.data.applicationStatus);
          setLoader(false);
        })
        .catch((error) => {
          console.log("error: ", error);
          catchExceptionHandlingMethod(error, language);

          setLoader(false);
        });
    }
  }, []);

  const getPetData = () => {
    let licenseNo = watch("licenseNo");
    axios
      .post(
        `${URLs.VMS}/trnPetLicence/getByPetLicenceNo`,
        {
          petLicenceNo: licenseNo,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        reset({
          licenseNo: res.data.licenseNo,
          zoneKey: res.data.zoneKey,
          wardKey: res.data.wardKey,
          areaKey: res.data.areaKey,
          // ownerName: res.data.ownerName,
          ownerName:
            res.data.firstName +
            " " +
            res.data.middleName +
            " " +
            res.data.lastName,
          ownerAddress:
            res.data.addrFlatOrHouseNo +
            ", " +
            res.data.addrBuildingName +
            ", " +
            res.data.detailAddress,
          ownerEmailId: res.data.ownerEmailId,
          ownerMobileNo: res.data.ownerMobileNo,
          petAnimalKey: res.data.petAnimalKey,
          animalBreedKey: res.data.animalBreedKey,
          petName: res.data.petName,
          animalAge: res.data.animalAge,
          animalColor: res.data.animalColor,
          animalGender: res.data.animalGender,
        });
        setValue("licenseNo", res.data.petLicenceNo);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          catchExceptionHandlingMethod(error, language);
        } else {
          sweetAlert({
            title:
              language === "en"
                ? "Incorrect License No."
                : "चुकीचा परवाना क्रमांक",
            text:
              language === "en"
                ? "Details not found for the entered license no"
                : "प्रविष्ट केलेल्या परवाना क्रमांकासाठी तपशील आढळले नाहीत",
            icon: "warning",
            buttons: [
              language === "en" ? "Cancel" : "रद्द करा",
              language === "en" ? "Ok" : "ठीक आहे",
            ],
          });
        }
      });
  };

  const finalSubmit = (data) => {
    sweetAlert({
      title: language === "en" ? "Confirmation" : "पुष्टीकरण",
      text:
        language === "en"
          ? "Are you sure you want to submit the application ?"
          : "अर्ज सबमिट करू इच्छिता?",
      icon: "warning",
      buttons: [
        language === "en" ? "Cancel" : "रद्द करा",
        language === "en" ? "Save" : "जतन करा",
      ],
    }).then((ok) => {
      if (ok) {
        setLoader(true);
        axios
          .post(
            `${URLs.VMS}/trnSmallPetIncineration/save`,
            {
              ...data,
              createdUserId: userId,

              serviceId: 128,
              applicationStatus: "Application Submitted",
              applicantType,
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            setLoader(false);

            sweetAlert({
              title: language === "en" ? "Submitted" : "सादर केले",
              text:
                language === "en"
                  ? "Please move on to payment screen"
                  : "कृपया पेमेंट स्क्रीनवर जा",
              icon: "success",
              buttons: [
                language === "en" ? "Cancel" : "रद्द करा",
                language === "en" ? "Ok" : "ठीक आहे",
              ],
            }).then((ok) => {
              if (ok) {
                router.push(
                  isDeptUser
                    ? "/veterinaryManagementSystem/transactions/petIncinerator/clerk"
                    : "/dashboard"
                );
              }
            });
          })
          .catch((error) => {
            console.log("error: ", error);
            catchExceptionHandlingMethod(error, language);

            setLoader(false);
          });
      }
    });
  };
  return (
    <>
      <Head>
        <title>Pet Incinerator</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        {loader && <Loader />}

        <Title titleLabel={<FormattedLabel id="smallPetIncinerator" />} />

        <form onSubmit={handleSubmit(finalSubmit)}>
          {/* <div className={styles.subTitle}>Owner Details</div> */}
          <div className={styles.row}>
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="licenseNo" />}
              variant="standard"
              {...register("licenseNo")}
              InputLabelProps={{
                shrink: router.query.id || watch("licenseNo") ? true : false,
              }}
              error={!!error.licenseNo}
              helperText={error?.licenseNo ? error.licenseNo.message : null}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={router.query.id ? true : false}
                      sx={{ color: "#1976D2" }}
                      onClick={() => {
                        getPetData();
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={styles.row}>
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.zoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="zone" required />
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
                    label="zoneKey"
                  >
                    {zoneDropDown &&
                      zoneDropDown.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.zoneEn
                            : // @ts-ignore
                              value?.zoneMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="zoneKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.zoneKey ? error.zoneKey.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={router.query.pageMode == "view"}
              variant="standard"
              error={!!error.wardKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="ward" required />
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
                    label="wardKey"
                  >
                    {wardDropDown &&
                      wardDropDown.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.wardEn
                            : // @ts-ignore
                              value?.wardMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="wardKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.wardKey ? error.wardKey.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={router.query.pageMode == "view"}
              variant="standard"
              error={!!error.areaKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="area" required />
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
                    label="areaKey"
                  >
                    {areaDropDown &&
                      areaDropDown.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.areaEn
                            : // @ts-ignore
                              value?.areaMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="areaKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.areaKey ? error.areaKey.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <TextField
              disabled={router.query.pageMode == "view"}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="ownerName" required />}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerName"),
              }}
              variant="standard"
              {...register("ownerName")}
              error={!!error.ownerName}
              helperText={error?.ownerName ? error.ownerName.message : null}
            />

            <TextField
              disabled={router.query.pageMode == "view"}
              multiline
              sx={{ width: "250px" }}
              label={<FormattedLabel id="ownerAddress" required />}
              variant="standard"
              {...register("ownerAddress")}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerAddress"),
              }}
              error={!!error.ownerAddress}
              helperText={
                error?.ownerAddress ? error.ownerAddress.message : null
              }
            />

            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="emailId" required />}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerEmailId") ? true : false,
              }}
              variant="standard"
              {...register("ownerEmailId")}
              error={!!error.ownerEmailId}
              helperText={
                error?.ownerEmailId ? error.ownerEmailId.message : null
              }
            />
          </div>
          <div className={styles.row}>
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="mobileNo" required />}
              InputLabelProps={{
                shrink:
                  router.query.id || watch("ownerMobileNo") ? true : false,
              }}
              variant="standard"
              {...register("ownerMobileNo")}
              error={!!error.ownerMobileNo}
              helperText={
                error?.ownerMobileNo ? error.ownerMobileNo.message : null
              }
            />
          </div>
          <div className={styles.subTitle}>
            <FormattedLabel id="animalDetails" />
          </div>
          <div className={styles.row}>
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.petAnimalKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="petAnimal" />
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
                    label="petAnimalKey"
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === "en" ? obj.nameEn : obj.nameMr}
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

            <FormControl
              disabled={
                !watch("petAnimalKey") || router.query.pageMode == "view"
                  ? true
                  : false
              }
              variant="standard"
              error={!!error.animalBreedKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="animalBreed" />
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
                    label="animalBreedKey"
                  >
                    {petBreeds &&
                      petBreeds
                        .filter((obj) => {
                          return obj.petAnimalKey == watch("petAnimalKey");
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
                name="animalBreedKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.animalBreedKey ? error.animalBreedKey.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="petName" />}
              // disabled={router.query.id ? true : false}
              // @ts-ignore
              InputLabelProps={{
                shrink: router.query.id || watch("petName") ? true : false,
              }}
              variant="standard"
              {...register("petName")}
              error={!!error.petName}
              helperText={error?.petName ? error.petName.message : null}
            />
          </div>

          <div className={styles.row}>
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalAge" />}
              InputLabelProps={{
                shrink: router.query.id || watch("animalAge") ? true : false,
              }}
              variant="standard"
              {...register("animalAge")}
              error={!!error.animalAge}
              helperText={error?.animalAge ? error.animalAge.message : null}
            />
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalColor" />}
              // @ts-ignore
              InputLabelProps={{
                shrink: router.query.id || watch("animalColor") ? true : false,
              }}
              variant="standard"
              {...register("animalColor")}
              error={!!error.animalColor}
              helperText={error?.animalColor ? error.animalColor.message : null}
            />
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.animalGender}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="animalGender" />
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
                    label="animalGender"
                  >
                    <MenuItem key={1} value={"Male"}>
                      {language === "en" ? "Male" : "पुरुष"}
                    </MenuItem>
                    <MenuItem key={2} value={"Female"}>
                      {language === "en" ? "Female" : "स्त्री"}
                    </MenuItem>
                  </Select>
                )}
                name="animalGender"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.animalGender ? error.animalGender.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div className={styles.buttons}>
            {router.query.pageMode != "view" && (
              <Button
                variant="contained"
                type="submit"
                endIcon={<Save />}
                color="success"
              >
                <FormattedLabel id="save" />
              </Button>
            )}
            {applicationStatus == "Application Submitted" && (
              <Button
                variant="contained"
                endIcon={<Payment />}
                onClick={() =>
                  router.push({
                    pathname:
                      "/veterinaryManagementSystem/transactions/petIncinerator/paymentGateway",
                    query: { id: router.query.id },
                  })
                }
              >
                <FormattedLabel id="makePayment" />
              </Button>
            )}
            <Button
              variant="contained"
              endIcon={<ExitToApp />}
              onClick={() => router.back()}
              color="error"
            >
              <FormattedLabel id="exit" />
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default Index;
