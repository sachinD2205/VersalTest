import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../URLS/urls";
import { useGetToken, useLanguage, useGetLoggedInUserDetails, useApplicantType } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
import styles from "../../../components/pTax/styles/PropertyHolderDetails.module.css"
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import Translation from "../../streetVendorManagementSystem/components/Translation";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import { Add } from "@mui/icons-material";
import { useSelector } from "react-redux";

/** Author - Sachin Durge */
// PropertyHolderDetails -
const PropertyHolderDetails = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    trigger,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const language = useLanguage();
  const userToken = useGetToken();
  const applicantType = useApplicantType();
  const isDeptUser = useSelector(
    (state) => state?.user?.user?.userDao?.deptUser
  );
  const loggedInUserDetails = useGetLoggedInUserDetails();
  const userID = useSelector(
    (state) => state?.user?.user?.id
  );
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [hawkingZoneData, setHawkingZoneData] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [applicantOrCoApplicant1, setApplicantOrCoApplicant1] = useState(false)
  const [loggedInUserCheckBox1, setLoggedInUserCheckBox1] = useState(false)
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

  // Titles
  const getTitles = () => {
    const url = `${urls.CFCURL}/master/title/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setTitles(
            r.data.title.map((row) => ({
              id: row.id,
              title: row.title,
              titleMr: row.titleMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("titlesApiError", error);
      });
  };

  // genders
  const getGenders = () => {
    const url = `${urls.CFCURL}/master/gender/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setGenders(
            r?.data?.gender?.map((row) => ({
              id: row?.id,
              gender: row?.gender,
              genderMr: row?.genderMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("genderApiError", error);
      });
  };

  // serviceNames
  const getserviceNames = () => {
    const url = `${urls.CFCURL}/master/service/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setServiceNames(
            r?.data?.service?.map((row) => ({
              id: row?.id,
              serviceName: row?.serviceName,
              serviceNameMr: row?.serviceNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };


  // Address Change
  const userIsLoggedInOrNotCheckBox = (e) => {
    if (e?.target?.checked == true) {
      const { firstName, firstNamemr, middleName, middleNamemr, surname, surnamemr, mobile, emailID, dateOfBirth } = loggedInUserDetails;
      console.log("loggedInUserDetails", loggedInUserDetails)
      setValue("firstNameEng", firstName);
      setValue("middleNameEng", middleName);
      setValue("lastNameEng", surname);
      setValue("firstNameMr", firstNamemr);
      setValue("middleNameMr", middleNamemr);
      setValue("lastNameMr", surnamemr);
      setValue("mobile", mobile);
      setValue("emailID", emailID);
      setValue("aadharNo", "");
      setValue("genderID", null);
      setValue("titleID", null);
      setValue("dateOfBirth", dateOfBirth);
      // setValue("loggedInUserCheckBox", false);
      // setValue("applicantOrCoApplicant", false);

      //! Clear
      holderDetailsClear();
    } else {
      holderDetailsResetCheckBox();
      holderDetailsClear();
    }
  };


  const holderDetailsReset = () => {
    setValue("titleID", null);
    setValue("firstNameEng", "");
    setValue("middleNameEng", "");
    setValue("lastNameEng", "");
    setValue("firstNameMr", "");
    setValue("middleNameMr", "");
    setValue("lastNameMr", "");
    setValue("genderID", null);
    setValue("mobile", "");
    setValue("aadharNo", "");
    setValue("emailID", "");
    // check 
    setValue("loggedInUserCheckBox", false);
    setValue("applicantOrCoApplicant", false);
    setApplicantOrCoApplicant1(false);
    setLoggedInUserCheckBox1(false);
    holderDetailsClear();


  }

  const holderDetailsResetCheckBox = () => {
    setValue("titleID", null);
    setValue("firstNameEng", "");
    setValue("middleNameEng", "");
    setValue("lastNameEng", "");
    setValue("firstNameMr", "");
    setValue("middleNameMr", "");
    setValue("lastNameMr", "");
    setValue("genderID", null);
    setValue("mobile", "");
    setValue("aadharNo", "");
    setValue("emailID", "");
    // check 
    setValue("loggedInUserCheckBox", false);
    setValue("applicantOrCoApplicant", false);
    // setApplicantOrCoApplicant1(false);
    // setLoggedInUserCheckBox1(false);
    holderDetailsClear();


  }

  const holderDetailsResetWithId = () => {
    setValue("holderDetailId", null)
    setValue("titleID", null);
    setValue("firstNameEng", "");
    setValue("middleNameEng", "");
    setValue("lastNameEng", "");
    setValue("firstNameMr", "");
    setValue("middleNameMr", "");
    setValue("lastNameMr", "");
    setValue("genderID", null);
    setValue("mobile", "");
    setValue("aadharNo", "");
    setValue("emailID", "");
    // check 
    setValue("loggedInUserCheckBox", false);
    setValue("applicantOrCoApplicant", false);
    setApplicantOrCoApplicant1(false);
    setLoggedInUserCheckBox1(false);
    holderDetailsClear();
  }

  const holderDetailsGet = () => {

    const data = {
      id: watch("holderDetailId") != null && watch("holderDetailId") != undefined && watch("holderDetailId") != "" ? watch("holderDetailId") : null,
      titleID: watch("titleID"),
      firstNameEng: watch("firstNameEng"),
      middleNameEng: watch("middleNameEng"),
      lastNameEng: watch("lastNameEng"),
      firstNameMr: watch("firstNameMr"),
      middleNameMr: watch("middleNameMr"),
      lastNameMr: watch("lastNameMr"),
      genderID: watch("genderID"),
      mobile: watch("mobile"),
      aadharNo: watch("aadharNo"),
      emailID: watch("emailID"),
      loggedInUserCheckBox: watch("loggedInUserCheckBox") == true || watch("loggedInUserCheckBox") == "true" || watch("loggedInUserCheckBox") == "1" ? true : false,
      applicantOrCoApplicant: watch("applicantOrCoApplicant") == true || watch("applicantOrCoApplicant") == "true" || watch("applicantOrCoApplicant") == "1" ? true : false,
    }
    return data;
  }

  const holderDetailsClear = () => {
    //! clearErros 
    clearErrors("titleID");
    clearErrors("firstNameEng");
    clearErrors("middleNameEng");
    clearErrors("lastNameEng");
    clearErrors("firstNameMr");
    clearErrors("middleNameMr");
    clearErrors("lastNameMr");
    clearErrors("genderID");
    clearErrors("mobile");
    clearErrors("aadharNo");
    clearErrors("emailID");
  }

  const multipleHolderDetailsAddButton = () => {
    setValue("addHolderInputState", true);
    setValue("collapse", true);
    // checkApplicantOrNot();
  }

  const exitButton = () => {
    setValue("addHolderInputState", false);
    setValue("collapse", false);
    holderDetailsResetWithId()
  }

  const PropertyHolderMemberTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "holderFullNameEng" : "holderFullNameMr",
      headerName:
        <FormattedLabel id="fullNameEn" />
      ,
      description: <FormattedLabel id="fullNameEn" />
      ,
      width: 300,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "genderMr",
    //   headerName: <FormattedLabel id="gender" />,
    //   description: <FormattedLabel id="gender" />,
    //   width: 240,
    //   headerAlign: "center",
    //   align: "center",
    // },


    {
      field: "mobile",
      headerName: <FormattedLabel id="mobile" />,
      description: <FormattedLabel id="mobile" />,
      width: 220,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "emailID",
      headerName: <FormattedLabel id="email" />,
      description: <FormattedLabel id="email" />,
      width: 265,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "aadharNo",
      headerName: <FormattedLabel id="aadharNo" />,
      description: <FormattedLabel id="aadharNo" />,
      width: 280,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      hide: watch("disabledFieldInputState") == true || watch("disabledFieldInputState") == "true" || watch("disabledFieldInputState") == "1" ? true : false,
      // disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>

            <IconButton

              disabled={(watch("addHolderInputState") == true || watch("addHolderInputState") == "true" || watch("addHolderInputState") == 1)}
              onClick={() => {
                editHolderDetails(record?.row)
                console.log("record", record?.row?.id)
              }}
            >
              <EditIcon
                sx={{
                  color: (watch("addHolderInputState") == true || watch("addHolderInputState") == "true" || watch("addHolderInputState") == 1) ? "gray" : "blue",
                }} />

            </IconButton >
            <IconButton
              disabled={(watch("addHolderInputState") == true || watch("addHolderInputState") == "true" || watch("addHolderInputState") == 1)}
              onClick={() => {
                deleteHolderDetails(record?.row?.id)
                console.log("record", record?.row?.id)
              }}
            >
              <DeleteIcon sx={{
                color: (watch("addHolderInputState") == true || watch("addHolderInputState") == "true" || watch("addHolderInputState") == 1) == true ? "gray" : "red",
              }} />

            </IconButton>




          </>
        );
      },
    },

  ];



  const addHolderDetailsInTable = () => {

    const currentHolderDetail = holderDetailsGet();

    console.log(currentHolderDetail, "dsfldskjfl32432")

    const allHolderDetail = null;
    if (watch("propertyHoldersDetails") != null && watch("propertyHoldersDetails") != undefined && watch("propertyHoldersDetails").length != 0) {

      //! for update
      if (currentHolderDetail?.id) {
        const withouUpdateObjects = watch("propertyHoldersDetails")?.filter(data => data?.id != currentHolderDetail?.id);
        console.log("dsfdsf32432", withouUpdateObjects)
        allHolderDetail = [...withouUpdateObjects, currentHolderDetail]
      }
      //! for new add with old
      else {
        allHolderDetail = [...watch("propertyHoldersDetails"), currentHolderDetail];
      }
    }
    //! for if already not added
    else {
      allHolderDetail = [currentHolderDetail];
    }

    console.log("allHolderDetail", allHolderDetail)

    handleSubmit((data) => savePropertyRegistraction(data, allHolderDetail))();
  }


  const savePropertyRegistraction = (data, allHolderDetail) => {

    console.log("sdf2343242", data, allHolderDetail)

    const url = `${urls.PTAXURL}/transaction/property/saveV1`;

    // seriviceNames
    const serviceId = 140;
    const serviceNameEng = serviceNames.find((s) => s?.id == 140)
      ?.serviceName;
    const serviceNameMr = serviceNames.find((s) => s?.id == 140)
      ?.serviceNameMr;

    const finalBodyApi = {
      ...watch(),
      serviceNameEng,
      serviceNameMr,
      propertyHoldersDetails: allHolderDetail,
      status: watch("status") != null && watch("status") != undefined && watch("status") != "" ? watch("status") : "DRAFT",
      activeFlag: "Y",
      serviceId: serviceId,
      createdUserId: userID,
      applicantType: applicantType,
      id: watch("id") != null && watch("id") != undefined && watch("id") != null ? watch("id") : null,
    };



    axios
      .post(url, finalBodyApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res) {
          console.log("response", res?.data?.message.split("@")[1]);
          const id = null;
          setValue("propertyRegistractionId", res?.data?.message.split("@")[1]);
          holderDetailsReset()
          // multipleHolderDetailsAddButton1();
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));

  }



  const deleteHolderDetails = (holderId) => {

    const wantToDelete = { ...watch("propertyHoldersDetails")?.find(data => data?.id == holderId), activeFlag: "N" }

    const notWantDelete = watch("propertyHoldersDetails")?.filter(data => data?.id != holderId)

    const allHolderDetail = [...notWantDelete, wantToDelete]

    console.log("wantToDelete", wantToDelete, notWantDelete)

    handleSubmit((data) => savePropertyRegistraction(data, allHolderDetail))();
  }


  const editHolderDetails = (holderDetails) => {
    multipleHolderDetailsAddButton();
    console.log("holderDeatails3432423", holderDetails)

    setValue("holderDetailId", holderDetails?.id)
    setValue("firstNameEng", holderDetails?.firstNameEng);
    setValue("middleNameEng", holderDetails?.middleNameEng);
    setValue("lastNameEng", holderDetails?.lastNameEng);
    setValue("firstNameMr", holderDetails?.firstNameMr);
    setValue("middleNameMr", holderDetails?.middleNameMr);
    setValue("lastNameMr", holderDetails?.lastNameMr);
    setValue("mobile", holderDetails?.mobile);
    setValue("emailID", holderDetails?.emailID);
    setValue("aadharNo", holderDetails?.aadharNo);
    setValue("genderID", holderDetails?.genderID);
    setValue("titleID", holderDetails?.titleID);
    setValue("dateOfBirth", holderDetails?.dateOfBirth);

    setValue("loggedInUserCheckBox", holderDetails?.loggedInUserCheckBox == "true" || holderDetails?.loggedInUserCheckBox == true || holderDetails?.loggedInUserCheckBox == "1" ? true : false);

    setValue("applicantOrCoApplicant",
      holderDetails?.applicantOrCoApplicant == "true" || holderDetails?.applicantOrCoApplicant == true || holderDetails?.applicantOrCoApplicant == "1" ? true : false);

    setApplicantOrCoApplicant1(holderDetails?.applicantOrCoApplicant == "true" || holderDetails?.applicantOrCoApplicant == true || holderDetails?.applicantOrCoApplicant == "1" ? true : false)

    setLoggedInUserCheckBox1(holderDetails?.loggedInUserCheckBox == "true" || holderDetails?.loggedInUserCheckBox == true || holderDetails?.loggedInUserCheckBox == "1" ? true : false)

  }




  const propertyHolderTableDataSet = () => {

    console.log(watch("propertyHoldersDetails"), "sdfdsfds");

    if (watch("propertyHoldersDetails") != null && watch("propertyHoldersDetails") != undefined && watch("propertyHoldersDetails") != "" && watch("propertyHoldersDetails").length != 0) {

      const withoutActiveFlagY = watch("propertyHoldersDetails")?.filter(data => data?.activeFlag == "Y")?.map((OKData, index) => {

        return {
          srNo: index + 1,
          holderFullNameEng: OKData?.firstNameEng + " " + OKData?.middleNameEng + " " + OKData?.lastNameEng,
          holderFullNameMr: OKData?.firstNameMr + " " + OKData?.middleNameMr + " " + OKData?.lastNameMr,
          ...OKData
        }

      })

      setValue("propertyHoldersDetailsTable", withoutActiveFlagY);
    } else {
      setValue("propertyHoldersDetailsTable", []);
    }
  }

  const userIsApplicant = () => {

  }

  const checkApplicantOrNot = () => {

    const applicantTest = watch("propertyHoldersDetails")?.filter((data) => data?.activeFlag == "Y")?.find((data) => data?.applicantOrCoApplicant == true || data?.applicantOrCoApplicant == "true" || data?.applicantOrCoApplicant == "1");

    const applicantTestResult = applicantTest != undefined && applicantTest != null && applicantTest != "";

    const result = applicantTestResult === applicantOrCoApplicant1;

    console.log("5465465654654", applicantTestResult, applicantOrCoApplicant1, result)

    if (watch("holderDetailId") != null && watch("holderDetailId") != undefined && watch("holderDetailId") != "") {
      setValue("applicantOrCoApplicantMain", result);
    } else {
      setValue("applicantOrCoApplicantMain", !(applicantTest != undefined && applicantTest != null && applicantTest != ""));
    }

  }

  const checkApplicantIsLoggedInUserOrNot = () => {

    const applicantTest = watch("propertyHoldersDetails")?.filter((data) => data?.activeFlag == "Y")?.find((data) => data?.loggedInUserCheckBox == true || data?.loggedInUserCheckBox == "true" || data?.loggedInUserCheckBox == "1");

    const applicantTestResult = applicantTest != undefined && applicantTest != null && applicantTest != "";

    const result = applicantTestResult === loggedInUserCheckBox1;

    console.log("5465465654654LoogedInUser", applicantTestResult, loggedInUserCheckBox1, result, watch("holderDetailId"))

    if (watch("holderDetailId") != null && watch("holderDetailId") != undefined && watch("holderDetailId") != "") {
      setValue("loggedInUserCheckBoxMain", result);
    } else {
      setValue("loggedInUserCheckBoxMain", !(applicantTest != undefined && applicantTest != null && applicantTest != ""));
    }

  }


  //! useEffect -  ================================================>

  useEffect(() => {
    getserviceNames();
    getTitles();
    getGenders();
  }, [])





  useEffect(() => {
    propertyHolderTableDataSet();
  }, [watch("propertyHoldersDetails")])

  useEffect(() => {
    checkApplicantOrNot();
  }, [watch("propertyHoldersDetails"), applicantOrCoApplicant1, watch("collapse"), watch("holderDetailId")])

  useEffect(() => {
    checkApplicantIsLoggedInUserOrNot();
  }, [watch("propertyHoldersDetails"), loggedInUserCheckBox1, watch("collapse"), watch("holderDetailId")])

  //! =======================>  view
  return (
    <div>

      <div className={styles.DivOuter}>
        <div className={styles.Header}>
          <FormattedLabel id="propertyHolderDetails" />
        </div>
      </div>

      {(watch("collapse") == true || watch("collapse") == "true" || watch("collapse") == 1) && (
        <Slide
          direction="down"
          in={(watch("collapse") == true || watch("collapse") == "true" || watch("collapse") == 1)}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <div className={styles.Note}>
              *&nbsp;<FormattedLabel id="addMultiplePropertyHolders" />
            </div>

            <Grid container className={styles.GridContainer}>
              {/**loggedIN user  */}
              {(watch("loggedInUserCheckBoxMain") == true || watch("loggedInUserCheckBoxMain") == "true" || watch("loggedInUserCheckBoxMain") == "1")
                &&
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={styles.GridItemCenter}
                >
                  <FormControlLabel
                    className={styles.addressCheckBoxButton}
                    control={
                      <Controller
                        name="loggedInUserCheckBox"
                        control={control}
                        defaultValue={false}
                        render={({ field: { value, ref, ...field } }) => (
                          <Checkbox
                            disabled={watch("disabledFieldInputState")}
                            {...field}
                            inputRef={ref}
                            checked={!!value}
                            onChange={(e) => {
                              console.log("EtargetChekced", e?.target?.checked);
                              setValue("loggedInUserCheckBox", e?.target?.checked);
                              clearErrors("loggedInUserCheckBox");
                              userIsLoggedInOrNotCheckBox(e);
                            }}
                          />
                        )}
                      />
                    }
                    label=<span className={styles.CheckBoxButtonSpan}>
                      <FormattedLabel id="sameAsLoggedInUser" />
                    </span>
                    labelPlacement="end"
                  />
                </Grid>
              }
              {/** title  English*/}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <FormControl error={!!errors?.titleID} sx={{ marginTop: 2 }}>
                  <InputLabel
                    shrink={watch("titleID") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    {<FormattedLabel id="titleEn" reuired />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={watch("disabledFieldInputState")}
                        autoFocus
                        value={field?.value}
                        onChange={(value) => field?.onChange(value)}
                        label={<FormattedLabel id="titleEn" required />}
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {titles &&
                          titles?.map((title) => (
                            <MenuItem key={title?.id + 1} value={title?.id}>
                              {title?.title}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="titleID"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.titleID ? errors?.titleID?.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/** first Name English */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <Translation
                  labelName={"firstName"}
                  label={<FormattedLabel id="firstName" required />}
                  width={230}
                  disabled={watch("disabledFieldInputState")}
                  error={!!errors?.firstNameEng}
                  helperText={errors?.firstNameEng ? errors?.firstNameEng?.message : null}
                  key={"firstNameEng"}
                  fieldName={"firstNameEng"}
                  updateFieldName={"firstNameMr"}
                  sourceLang={"en-US"}
                  targetLang={"mr-IN"}
                />
              </Grid>
              {/** middle Name English*/}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >

                <Translation
                  labelName={"middleName"}
                  label={<FormattedLabel id="middleName" required />}
                  width={230}
                  disabled={watch("disabledFieldInputState")}
                  error={!!errors?.middleNameEng}
                  helperText={errors?.middleNameEng ? errors?.middleNameEng?.message : null}
                  key={"middleNameEng"}
                  fieldName={"middleNameEng"}
                  updateFieldName={"middleNameMr"}
                  sourceLang={"en-US"}
                  targetLang={"mr-IN"}
                />
              </Grid>
              {/** last Name  English*/}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <Translation
                  labelName={"lastName"}
                  label={<FormattedLabel id="lastName" required />}
                  width={230}
                  disabled={watch("disabledFieldInputState")}
                  error={!!errors?.lastNameEng}
                  helperText={errors?.lastNameEng ? errors?.lastNameEng?.message : null}
                  key={"lastNameEng"}
                  fieldName={"lastNameEng"}
                  updateFieldName={"lastNameMr"}
                  sourceLang={"en-US"}
                  targetLang={"mr-IN"}
                />
              </Grid>

              {/** title in Marathi */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <FormControl error={!!errors?.titleID} sx={{ marginTop: 2 }}>
                  <InputLabel
                    shrink={watch("titleID") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    {<FormattedLabel id="titleMr" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={watch("disabledFieldInputState")}
                        autoFocus
                        value={field?.value}
                        onChange={(value) => field?.onChange(value)}
                        label={<FormattedLabel id="titleMr" required />}
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {titles &&
                          titles?.map((title) => (
                            <MenuItem key={title?.id + 1} value={title?.id}>
                              {title?.titleMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="titleID"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.titleID ? errors?.titleID?.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/** first Name Marathi */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <Translation
                  labelName={"firstNameMr"}
                  label={<FormattedLabel id="firstNameMr" required />}
                  width={230}
                  disabled={watch("disabledFieldInputState")}
                  error={!!errors?.firstNameMr}
                  helperText={
                    errors?.firstNameMr ? errors?.firstNameMr?.message : null
                  }
                  key={"firstNameMr"}
                  fieldName={"firstNameMr"}
                  updateFieldName={"firstNameEng"}
                  sourceLang={"mr-IN"}
                  targetLang={"en-US"}
                />
              </Grid>

              {/** middle Name in Marathi */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >


                <Translation
                  labelName={"middleNameMr"}
                  label={<FormattedLabel id="middleNameMr" required />}
                  width={230}
                  disabled={watch("disabledFieldInputState")}
                  error={!!errors?.middleNameMr}
                  helperText={
                    errors?.middleNameMr ? errors?.middleNameMr?.message : null
                  }
                  key={"middleNameMr"}
                  fieldName={"middleNameMr"}
                  updateFieldName={"middleNameEng"}
                  sourceLang={"mr-IN"}
                  targetLang={"en-US"}
                />
              </Grid>
              {/** last Name Marathi */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >


                <Translation
                  labelName={"lastNameMr"}
                  label={<FormattedLabel id="lastNameMr" required />}
                  width={230}
                  disabled={watch("disabledFieldInputState")}
                  error={!!errors?.lastNameMr}
                  helperText={errors?.lastNameMr ? errors?.lastNameMr?.message : null}
                  key={"lastNameMr"}
                  fieldName={"lastNameMr"}
                  updateFieldName={"lastNameEng"}
                  sourceLang={"mr-IN"}
                  targetLang={"en-US"}
                />
              </Grid>

              {/** gender */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <FormControl sx={{ marginTop: 2 }} error={!!errors?.genderID}>
                  <InputLabel
                    shrink={watch("genderID") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    {<FormattedLabel id="gender" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={watch("disabledFieldInputState")}
                        value={field?.value}
                        onChange={(value) => field?.onChange(value)}
                        label={<FormattedLabel id="gender" required />}
                      >
                        {genders &&
                          genders?.map((gender) => (
                            <MenuItem key={gender?.id} value={gender?.id}>
                              {language == "en" ? gender?.gender : gender?.genderMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="genderID"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.genderID ? errors?.genderID?.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/** mobile */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <TextField
                  id="standard-basic"
                  inputProps={{ maxLength: 10 }}
                  InputLabelProps={{ shrink: true }}
                  disabled={watch("disabledFieldInputState")}
                  label={<FormattedLabel id="mobile" required />}
                  {...register("mobile")}
                  error={!!errors?.mobile}
                  helperText={errors?.mobile ? errors?.mobile?.message : null}
                />
              </Grid>
              {/** email Address */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <TextField
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  disabled={watch("disabledFieldInputState")}
                  label={<FormattedLabel id="emailAddress" required />}
                  {...register("emailID")}
                  error={!!errors?.emailID}
                  helperText={
                    errors?.emailID ? errors?.emailID?.message : null
                  }
                />
              </Grid>
              {/*** Aadharr Card Number */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <TextField
                  disabled={watch("disabledFieldInputState")}
                  id="standard-basic"
                  inputProps={{ maxLength: 12 }}
                  label={<FormattedLabel id="aadhaarNo" required />}
                  {...register("aadharNo")}
                  error={!!errors.aadharNo}
                  helperText={errors?.aadharNo ? errors?.aadharNo?.message : null}
                />
              </Grid>




              {/**  is applicant  */}

              {(watch("applicantOrCoApplicantMain") == true || watch("applicantOrCoApplicantMain") == "true" || watch("applicantOrCoApplicantMain") == "1")
                &&
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={styles.GridItemCenter}
                >
                  <FormControlLabel
                    style={{ marginLeft: "0px" }}
                    className={styles.addressCheckBoxButton}
                    control={
                      <Controller
                        name="applicantOrCoApplicant"
                        control={control}
                        defaultValue={false}
                        render={({ field: { value, ref, ...field } }) => (
                          <Checkbox
                            disabled={watch("disabledFieldInputState")}
                            {...field}
                            inputRef={ref}
                            checked={!!value}
                            onChange={(e) => {
                              console.log("EtargetChekced", e?.target?.checked);
                              setValue("applicantOrCoApplicant", e?.target?.checked);
                              clearErrors("applicantOrCoApplicant");
                              userIsApplicant(e);
                            }}
                          />
                        )}
                      />
                    }
                    label=<span className={styles.CheckBoxButtonSpan}>
                      <FormattedLabel id="applicantOrCoApplicantMainLabel" />
                    </span>
                    labelPlacement="start"
                  />
                </Grid>
              }


            </Grid>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
                md: "row",
                lg: "row",
                xl: "row",
              }}
              spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
              className={styles.ButtonStack}
            >

              <Button
                className={styles.ButtonForMobileWidth}
                size="small"
                // type="submit"
                variant="contained"
                color="success"
                onClick={() => addHolderDetailsInTable()}


                endIcon={<SaveIcon />}
              >

                <FormattedLabel id="save" />

              </Button>
              <Button
                className={styles.ButtonForMobileWidth}
                size="small"
                variant="contained"
                color="primary"
                endIcon={<ClearIcon />}
                onClick={() => holderDetailsReset()}
              >
                <FormattedLabel id="clear" />
              </Button>
              <Button
                className={styles.ButtonForMobileWidth}
                size="small"
                disabled={watch("propertyHoldersDetails") != null && watch("propertyHoldersDetails") != undefined && watch("propertyHoldersDetails") != "" && watch("propertyHoldersDetails").filter((data) => data?.activeFlag == "Y").length >= 1 ? false : true}
                variant="contained"
                color="error"
                endIcon={<ExitToAppIcon />}
                onClick={() => exitButton()}
              >
                <FormattedLabel id="exit" />
              </Button>

            </Stack>

          </div>
        </Slide>)
      }


      <div className={styles.addHolderDetailButton}>

        {!watch("disabledFieldInputState") ?
          <Button
            sx={{ borderRadius: 5 }}
            variant="contained"
            disabled={(watch("addHolderInputState") == true || watch("addHolderInputState") == "true" || watch("addHolderInputState") == 1)}
            startIcon={<Add />}
            onClick={() => {
              multipleHolderDetailsAddButton()
              // addHolderDetailsInTable
            }}
          >
            <FormattedLabel id="addHolderDetails" />
          </Button>
          : <>
          </>}
      </div>

      <div className={styles.DataGridDiv}>

        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: false,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: true },
            },
          }}
          // components={{ Toolbar: GridToolbar }}
          sx={{
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
          density="standard"
          autoHeight={true}
          getRowId={(row) => row?.srNo}
          rows={
            watch("propertyHoldersDetailsTable") != null && watch("propertyHoldersDetailsTable") != undefined && watch("propertyHoldersDetailsTable").length != 0 && watch("propertyHoldersDetailsTable") != "" ? watch("propertyHoldersDetailsTable") : []
          }
          columns={PropertyHolderMemberTableColumns}
          pageSize={10}
        // rowsPerPageOptions={[5, 10, 20, 50, 100]}
        // defaultSortModel={[
        //   {
        //     field: "applicationNumber",
        //     sort: "asc",
        //   },
        // ]}


        />

      </div>

    </div >
  );
};

export default PropertyHolderDetails;
