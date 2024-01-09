import {
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  Box,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../../../masters/libraryCompetativeMaster/view.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "./schema";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import sweetAlert from "sweetalert";
import theme from "../../../../../theme";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { newBookRequestSchema } from "../../../../../components/lms/schema/newBookRequestSchema";
import Loader from "../../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../../components/lms/lmsHeader";

const Index = () => {
  const [btnSaveText, setBtnSaveText] = useState("save");
  const [id, setID] = useState();
  const [bookTypeData, setBookTypeData] = useState([]);
  const [bookClassifications, setBookClassification] = useState([]);
  const [bookSubTypeData, setBookSubType] = useState([]);
  const [languages, setLanguages] = useState([
    { id: 1, language: "English", label: "इंग्रजी" },
    { id: 2, language: "Marathi", label: "मराठी" },
    { id: 3, language: "Hindi", label: "हिंदी" },
    // { id: 1, language: "English" },
    // { id: 2, language: "Marathi" },
    // { id: 3, language: "Hindi" },
  ]);
  const [libraryKeys, setLibraryKeys] = useState([]);
  const router = useRouter();
  let applicationFrom = "Web";
  const user = useSelector((state) => state?.user.user);
  const [loading, setLoading] = useState(false);

  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(newBookRequestSchema),
    mode: "onChange",
  });

  useEffect(() => {
    getBookClassifications();
    getBookTypeData();
    getLibraryKeys();
    getZoneKeys();
  }, []);

  useEffect(() => {
    if (watch("zoneKey")) {
      getLibraryKeys();
    }
  }, [watch("zoneKey")]);

  const [zoneKeys, setZoneKeys] = useState([]);
  // getZoneKeys
  const getZoneKeys = () => {
    setLoading(true);
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((err) => {
        setLoading(false);
        swal(
          language === "en" ? "Error!" : "त्रुटी!",
          language === "en"
            ? "Somethings Wrong, Zones not Found!"
            : "काहीतरी चुकीचे आहे, झोन सापडले नाहीत!",
          "error"
        );
      });
  };

  const getLibraryKeys = () => {
    //setValues("setBackDrop", true);
    setLoading(true);
    axios
      .get(
        `${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${watch(
          "zoneKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        setLoading(false);
        setLibraryKeys(
          r.data.libraryMasterList.map((row) => ({
            id: row.id,
            // zoneName: row.zoneName,
            libraryName: row.libraryName,
            libraryNameMr: row.libraryNameMr,
          }))
        );
      })
      .catch((err) => {
        setLoading(false);
        swal(
          language === "en" ? "Error!" : "त्रुटी!",
          language === "en"
            ? "Somethings Wrong, Zones not Found!"
            : "काहीतरी चुकीचे आहे, झोन सापडले नाहीत!",
          "error"
        );
      });
  };

  useEffect(() => {
    if (watch("bookType")) {
      setLoading(true);
      axios
        .get(`${urls.LMSURL}/bookSubTypeMaster/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          setLoading(false);
          setBookSubType(
            r.data.bookSubTypeMasterList.map((r) => ({
              id: r.id,
              bookType: r.bookType,
              bookSubtype: r.bookSubtype,
            }))
          );
        })
        .catch((err) => setLoading(false));
    }
  }, [watch("bookType")]);

  const getBookClassifications = () => {
    setLoading(true);
    axios
      .get(`${urls.LMSURL}/bookClassificationMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        let result = r.data.bookClassificationList;
        console.log("result", result);

        setBookClassification(
          result.map((r, i) => {
            return {
              // r.data.map((r, i) => ({
              activeFlag: r.activeFlag,

              id: r.id,
              srNo: i + 1,
              bookClassification: r.bookClassification,

              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
          })
        );
      })
      .catch((err) => setLoading(false));
  };

  const getBookTypeData = () => {
    setLoading(true);
    axios
      .get(`${urls.LMSURL}/bookTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        setBookTypeData(
          r.data.bookTypeMasterList.map((r) => ({
            id: r.id,
            bookType: r.bookType,
          }))
        );
      });
  };

  const onSubmitForm = (formData) => {
    setLoading(true);
    let userType;
    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "departmentUser") {
      userType = 3;
    } else {
      userType = 2;
    }
    const finalBodyForApi = {
      ...formData,
      applicationFrom,
    };
    const _bookName = formData?.bookName;

    const bodyForApi = {
      ...formData,
      applicationFrom,
      serviceId: 84,
      createdUserId: user?.id,
      applicationStatus: "APPLICATION_CREATED",
      applicantType: userType,
    };

    console.log("bodyForApi", bodyForApi);
    axios
      .post(`${urls.LMSURL}/trnRequestBook/save`, bodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          setLoading(false);
          // swal("Saved!", "Record Saved successfully !", "success");
          // sweetAlert({
          //   title: language === "en" ? "Saved " : "जतन केले",
          //   text:
          //     language === "en"
          //       ? "Record saved successfully"
          //       : "रेकॉर्ड यशस्वीरित्या जतन केले",
          //   icon: "success",
          //   button: language === "en" ? "Ok" : "ठीक आहे",
          // });
          sweetAlert({
            title: language === "en" ? "Thank You !!" : "धन्यवाद !!",
            text:
              language === "en"
                ? `Your Request for ${_bookName} book has been submitted !!`
                : `${_bookName} या पुस्तकासाठी तुमची विनंती सबमिट केली गेली आहे !!`,
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
          // router.push("/dashboard");
          if (localStorage.getItem("loggedInUser") == "cfcUser") {
            router.push(`/CFC_Dashboard`);
          } else {
            router.push(`/dashboard`);
          }

          // let temp = res?.data?.message;
          // router.push({
          //   pathname: `/lms/transactions/newBookRequest/acknowledgmentReceipt`,
          //   query: {
          //     id: Number(temp.split(":")[1]),
          //   },
          // });
        }
      })
      .catch((err) => {
        setLoading(false);
        // swal("Error!", "Somethings Wrong Record not Saved!", "error");
        sweetAlert({
          title: language === "en" ? "Error !! " : "त्रुटी !!",
          text:
            language === "en"
              ? "Somethings Wrong !! Record not Saved!"
              : "काहीतरी त्रुटी !! रेकॉर्ड जतन केलेले नाही!",
          icon: "error",
          button: language === "en" ? "Ok" : "ठीक आहे",
        });
      });
    // Save - DB
    // axios
    //     .post(
    //         `${urls.LMSURL}/bookMaster/save`,
    //         finalBodyForApi
    //     )
    //     .then((res) => {
    //         if (res.status == 201) {
    //             formData.id
    //                 ? sweetAlert("Updated!", "Record Updated successfully !", "success")
    //                 : sweetAlert("Saved!", "Record Saved successfully !", "success");
    //             getTableData();
    //             // setButtonInputState(false);
    //             // setIsOpenCollapse(true);
    //             // setEditButtonInputState(false);
    //             // setDeleteButtonState(false);

    //             setButtonInputState(false);
    //             setSlideChecked(false);
    //             setIsOpenCollapse(false);
    //             setEditButtonInputState(false);
    //             setDeleteButtonState(false);
    //         }
    //     });
  };

  const exitButton = () => {
    sweetAlert({
      title: language === "en" ? "Exit ? " : "बाहेर पडायचे ?",
      text:
        language === "en"
          ? "Are you sure you want to exit this Record ? "
          : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ?",
      icon: "warning",
      buttons: {
        ok: language === "en" ? "Ok" : "ठीक आहे",
        cancel: language === "en" ? "Cancel" : "रद्द करा",
      },
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((will) => {
      if (will) {
        swal({
          text:
            language === "en"
              ? "Successfully Exited !"
              : "यशस्वीरित्या बाहेर पडलो !",
          icon: "success",
          button: language === "en" ? "Ok" : "ठीक आहे",
        });
        reset({
          ...resetValuesExit,
        });
        // router.push(`/dashboard`);
        if (localStorage.getItem("loggedInUser") == "cfcUser") {
          router.push(`/CFC_Dashboard`);
        } else {
          router.push(`/dashboard`);
        }
      } else {
        swal({
          text: language === "en" ? "Record is Safe " : "रेकॉर्ड सुरक्षित आहे",
          icon: "success",
          button: language === "en" ? "Ok" : "ठीक आहे",
        });
      }
    });
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    bookClassification: "",
    language: "",
    bookName: "",
    publication: "",
    author: "",
    bookEdition: "",
    bookType: "",
    bookSubType: "",
    libraryKey: "",
  };

  const resetValuesExit = {
    bookClassification: "",
    language: "",
    bookName: "",
    publication: "",
    author: "",
    bookEdition: "",
    bookType: "",
    bookSubType: "",
    libraryKey: "",
    id: null,
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <LmsHeader labelName="newBookRequest" />
          {loading ? (
            <Loader />
          ) : (
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                    style={{ justifyContent: "space-evenly", marginTop: "2vh" }}
                    columns={16}
                  >
                    {language == "en" ? (
                      <Typography
                        style={{
                          fontSize: "1em",
                          fontWeight: "800",
                          color: "red",
                        }}
                      >
                        *Note:- Please Check / Search Book First
                      </Typography>
                    ) : (
                      <Typography
                        style={{
                          fontSize: "1em",
                          fontWeight: "800",
                          color: "red",
                        }}
                      >
                        *नोंद:- कृपया अगोदर पुस्तक तपासा / शोधा
                      </Typography>
                    )}
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                    style={{ justifyContent: "center", marginTop: "1vh" }}
                    columns={16}
                  >
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          error={!!errors.zoneKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="zone" required />
                            {/* Zone */}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                //sx={{ width: 230 }}
                                // disabled={disable}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log("Zone Key: ", value.target.value);
                                  // setTemp(value.target.value)
                                }}
                                label="Zone Name  "
                              >
                                {zoneKeys &&
                                  zoneKeys.map((zoneKey, index) => (
                                    <MenuItem key={index} value={zoneKey.id}>
                                      {/*  {zoneKey.zoneKey} */}

                                      {language == "en"
                                        ? zoneKey?.zoneName
                                        : zoneKey?.zoneNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zoneKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zoneKey ? errors.zoneKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          error={!!errors.libraryKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="libraryCSC" required />}
                            {/* Library/Competitive Study Centre*/}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                //sx={{ width: 230 }}
                                // disabled={disable}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  // setTemp(value.target.value)
                                }}
                                // label="Library/Competitive Study Centre"
                                label={
                                  <FormattedLabel id="libraryCSC" required />
                                }
                              >
                                {libraryKeys &&
                                  libraryKeys.map((libraryKey, index) => (
                                    <MenuItem key={index} value={libraryKey.id}>
                                      {language == "en"
                                        ? libraryKey?.libraryName
                                        : libraryKey?.libraryNameMr}
                                      {/* {libraryKey?.libraryName} */}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="libraryKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.libraryKey
                              ? errors.libraryKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                    style={{ justifyContent: "center", marginTop: "1vh" }}
                    columns={16}
                  >
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      {/* <FormControl
                    variant="standard"
                    sx={{ m: 1, width: "100%" }}
                    error={!!errors.bookName}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Book Name *
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "100%" }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Book Name"
                        >
                          {bookTypeData &&
                            bookTypeData.map((bookName, index) => (
                              <MenuItem key={index} value={bookName.id}>
                                {bookName.bookName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="bookName"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.bookName ? errors.bookName.message : null}
                    </FormHelperText>
                  </FormControl> */}

                      <TextField
                        sx={{ m: 1, width: "100%" }}
                        id="standard-basic"
                        // label="Book Name"
                        label={<FormattedLabel id="bookName" required />}
                        variant="standard"
                        {...register("bookName")}
                        error={!!errors.bookName}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("bookName") ? true : false,
                          // ||(router.query.bookName ? true : false),
                        }}
                        helperText={
                          errors?.bookName ? errors.bookName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      {/* <FormControl
                    variant="standard"
                    sx={{ m: 1, width: "100%" }}
                    error={!!errors.publication}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Publication *
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "100%" }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Publication"
                        >
                          {bookTypeData &&
                            bookTypeData.map((publication, index) => (
                              <MenuItem
                                key={index}
                                value={publication.id}
                              >
                                {publication.publication}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="publication"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.publication
                        ? errors.publication.message
                        : null}
                    </FormHelperText>
                  </FormControl> */}
                      <TextField
                        sx={{ m: 1, width: "100%" }}
                        id="standard-basic"
                        // label="Publication"
                        label={<FormattedLabel id="publication" />}
                        variant="standard"
                        {...register("publication")}
                        error={!!errors.publication}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("publication") ? true : false,
                          // ||(router.query.publication ? true : false),
                        }}
                        helperText={
                          errors?.publication
                            ? errors.publication.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, width: "100%" }}
                        error={!!errors.language}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Language */}
                          {<FormattedLabel id="language" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label="Language"
                              label={<FormattedLabel id="language" />}
                            >
                              {languages &&
                                languages.map((lang, index) => (
                                  <MenuItem key={index} value={lang.id}>
                                    {language === "en"
                                      ? lang.language
                                      : lang?.label}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="language"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.language ? errors.language.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                    style={{ justifyContent: "center", marginTop: "1vh" }}
                    columns={16}
                  >
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, width: "100%" }}
                        error={!!errors.bookClassification}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Book Classification */}
                          {<FormattedLabel id="bookClassification" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label="Book Classification"
                              label={<FormattedLabel id="bookClassification" />}
                            >
                              {bookClassifications &&
                                bookClassifications.map(
                                  (bookClassification, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        bookClassification.bookClassification
                                      }
                                    >
                                      {bookClassification.bookClassification}
                                    </MenuItem>
                                  )
                                )}
                            </Select>
                          )}
                          name="bookClassification"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.bookClassification
                            ? errors.bookClassification.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, width: "100%" }}
                        error={!!errors.bookType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Book Type */}
                          {<FormattedLabel id="bookType" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label="Book Type"
                              label={<FormattedLabel id="bookType" />}
                            >
                              {bookTypeData &&
                                bookTypeData.map((bookType, index) => (
                                  <MenuItem
                                    key={index}
                                    value={bookType.bookType}
                                  >
                                    {bookType.bookType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="bookType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.bookType ? errors.bookType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, width: "100%" }}
                        error={!!errors.bookSubType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Book Sub Type */}
                          {<FormattedLabel id="bookSubType" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label="Book Sub Type"
                              label={<FormattedLabel id="bookSubType" />}
                            >
                              {bookSubTypeData &&
                                bookSubTypeData.map((bookSubType, index) => (
                                  <MenuItem
                                    key={index}
                                    value={bookSubType.bookSubtype}
                                  >
                                    {bookSubType.bookSubtype}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="bookSubType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.bookSubType
                            ? errors.bookSubType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                    style={{ justifyContent: "center", marginTop: "1vh" }}
                    columns={16}
                  >
                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <TextField
                        sx={{ m: 1, width: "100%" }}
                        id="standard-basic"
                        // label="Author"
                        label={<FormattedLabel id="author" />}
                        variant="standard"
                        {...register("author")}
                        error={!!errors.author}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("author") ? true : false,
                          // ||(router.query.author ? true : false),
                        }}
                        helperText={
                          errors?.author ? errors.author.message : null
                        }
                      />
                    </Grid>

                    <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                      <TextField
                        sx={{ m: 1, width: "100%" }}
                        id="standard-basic"
                        // label="Book Edition"
                        label={<FormattedLabel id="bookEdition" />}
                        variant="standard"
                        {...register("bookEdition")}
                        error={!!errors.bookEdition}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("bookEdition") ? true : false,
                          // ||(router.query.bookEdition ? true : false),
                        }}
                        helperText={
                          errors?.bookEdition
                            ? errors.bookEdition.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* <Grid
                container
                spacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                style={{ justifyContent: "center", marginTop: "1vh" }}
                columns={16}
              >
                
              </Grid> */}

                  <div className={styles.btn}>
                    <div className={styles.btn1}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        endIcon={<SaveIcon />}
                      >
                        {/* {btnSaveText} */}
                        {<FormattedLabel id={btnSaveText} />}
                      </Button>{" "}
                    </div>
                    <div className={styles.btn1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        {/* Clear */}
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </div>
                    <div className={styles.btn1}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        {/* Exit */}
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          )}
        </Paper>
      </ThemeProvider>
    </>
  );
};
export default Index;
