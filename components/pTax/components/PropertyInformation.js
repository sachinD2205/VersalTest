import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../URLS/urls";
import { useGetToken, useLanguage, useGetLoggedInUserDetails, useApplicantType } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
import styles from "../../../components/pTax/styles/PropertyInformation.module.css"
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

/** Author - Sachin Durge */
// PropertyInformation -
const PropertyInformation = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    clearErrors,
    trigger,
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

  const [usageTypes, setUsageTypes] = useState([])
  const [constructionTypes, setConstructionTypes] = useState([])
  const [units, setUnits] = useState([{
    id: 1,
    unitsEng: "Sq.m",
    unitsMr: "चौ.मी",
  }, {
    id: 2,
    unitsEng: "Sq.feet",
    unitsMr: "चौ.फूट",
  }])


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

  // Titles
  const getUsageTypes = () => {

    const url = `${urls.PTAXURL}/master/usageType/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setUsageTypes(
          res?.data?.usageType?.map((j) => ({
            id: j?.id,
            usageTypeEng: j?.usageType,
            usageTypeMr: j?.usageTypeMr,
          }))
        )
      )
      .catch((error) => callCatchMethod(error, language))

  };

  // genders
  const getConstructionTypes = () => {

    const url = `${urls.PTAXURL}/master/constructionType/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setConstructionTypes(
          res?.data?.constructionType?.map((j) => ({
            id: j?.id,
            constructionTypeEng: j?.constructionTypeName,
            constructionTypeMr: j?.constructionTypeNameMr,
          }))
        )
      )
      .catch((error) => callCatchMethod(error, language))

  };

  // Address Change
  const buildingPermissionCheckBox = () => {

  }


  const propertyInformationDetailReset = () => {
    setValue("titleID", null);
    setValue("buildingPermission", false);
    setValue("usageType", null);
    setValue("constructionType", null);
    setValue("area", "");
    setValue("parking", null);
    setValue("parkingArea", "");
    setValue("totalArea", "");
    setValue("unit", null);
    setValue("assessmentDate", null);
    propertyInformationDetailClear();
    setValue("addPropertyInformationInputState", false);
    setValue("collapsePropertyInformation", false);
  }

  const propertyInformationDetailResetWithId = () => {
    setValue("propertyInformationId", null)
    setValue("buildingPermission", false);
    setValue("usageType", null);
    setValue("constructionType", null);
    setValue("area", "");
    setValue("parking", null);
    setValue("parkingArea", "");
    setValue("totalArea", "");
    setValue("unit", null);
    setValue("assessmentDate", null);
    propertyInformationDetailClear();

  }




  const propertyInformationGet = () => {

    const data = {
      id: watch("propertyInformationId") != null && watch("propertyInformationId") != undefined && watch("propertyInformationId") != "" ? watch("propertyInformationId") : null,
      buildingPermission: watch("buildingPermission"),
      usageType: watch("usageType"),
      constructionType: watch("constructionType"),
      area: watch("area"),
      parking: watch("parking"),
      parkingArea: watch("parkingArea"),
      totalArea: watch("totalArea"),
      unit: watch("unit"),
      assessmentDate: watch("assessmentDate"),
      activeFlag: "Y"
    }
    return data;
  }

  const propertyInformationDetailClear = () => {
    //! clearErros 
    clearErrors("buildingPermission");
    clearErrors("usageType");
    clearErrors("constructionType");
    clearErrors("area");
    clearErrors("parking");
    clearErrors("parkingArea");
    clearErrors("unit");
    clearErrors("assessmentDate");
  }


  const multiplePropertyInformationAddButton = () => {
    setValue("addPropertyInformationInputState", true);
    setValue("collapsePropertyInformation", true);
  }

  const exitButton = () => {
    setValue("addPropertyInformationInputState", false);
    setValue("collapsePropertyInformation", false);
    propertyInformationDetailResetWithId()
  }


  // const holderDetailsClearButton = () => {

  // setValue("titleID");
  // setValue("firstNameEng");
  // setValue("middleNameEng");
  // setValue("lastNameEng");
  // setValue("firstNameMr");
  // setValue("middleNameMr");
  // setValue("lastNameMr");
  // setValue("genderID");
  // setValue("mobile");
  // setValue("aadharNo");
  // setValue("emailID");

  // }


  const PropertyInformationTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "buildingPermissionYesNoEng" : "buildingPermissionYesNoMr",
      headerName: <FormattedLabel id="buildingPermission" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "usageTypeEng" : "usageTypeMr",
      headerName: <FormattedLabel id="usageType" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "constructionTypeEn" : "constructionTypeMr",
      headerName: <FormattedLabel id="constructionType" />,
      description: <FormattedLabel id="constructionType" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "area",
      headerName: <FormattedLabel id="area" />,
      description: <FormattedLabel id="area" />,
      width: 240,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "parkingAreaYesNoEng" : "parkingAreaYesNoMr",
      headerName: <FormattedLabel id="parkingArea" />,
      description: <FormattedLabel id="parkingArea" />,
      width: 240,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parkingArea1",
      headerName: <FormattedLabel id="parkingArea" />,
      description: <FormattedLabel id="parkingArea" />,
      width: 240,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalArea",
      headerName: <FormattedLabel id="totalArea" />,
      description: <FormattedLabel id="totalArea" />,
      width: 240,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "unitEng" : "unitMr",
      headerName: <FormattedLabel id="unit" />,
      description: <FormattedLabel id="unit" />,
      width: 240,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "assessmentDate1",
      headerName: <FormattedLabel id="assessmentDate" />,
      description: <FormattedLabel id="assessmentDate" />,
      width: 240,
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

              disabled={(watch("addPropertyInformationInputState") == true || watch("addPropertyInformationInputState") == "true" || watch("addPropertyInformationInputState") == 1)}
              onClick={() => {
                editHolderDetails(record?.row)
                console.log("record", record?.row)
              }}
            >
              <EditIcon
                sx={{
                  color: (watch("addPropertyInformationInputState") == true || watch("addPropertyInformationInputState") == "true" || watch("addPropertyInformationInputState") == 1) ? "gray" : "blue",
                }} />

            </IconButton >
            <IconButton
              disabled={(watch("addPropertyInformationInputState") == true || watch("addPropertyInformationInputState") == "true" || watch("addPropertyInformationInputState") == 1)}
              onClick={() => {
                deleteHolderDetails(record?.row?.id)
                console.log("record", record?.row?.id)
              }}
            >
              <DeleteIcon sx={{
                color: (watch("addPropertyInformationInputState") == true || watch("addPropertyInformationInputState") == "true" || watch("addPropertyInformationInputState") == 1) ? "gray" : "red",
              }} />

            </IconButton>




          </>
        );
      },
    },

  ];



  const addPropertyInformationnTable = () => {

    const currentPropertyInformationDetail = propertyInformationGet();

    console.log(currentPropertyInformationDetail, "dsfldskjfl32432")

    const allPropertyInformationDetail = null;
    if (watch("propertyDetails") != null && watch("propertyDetails") != undefined && watch("propertyDetails").length != 0) {

      //! for update
      if (currentPropertyInformationDetail?.id) {
        const withouUpdateObjects = watch("propertyDetails")?.filter(data => data?.id != currentPropertyInformationDetail?.id);
        console.log("dsfdsf32432", withouUpdateObjects)
        allPropertyInformationDetail = [...withouUpdateObjects, currentPropertyInformationDetail]
      }
      //! for new add with old
      else {
        allPropertyInformationDetail = [...watch("propertyDetails"), currentPropertyInformationDetail];
      }
    }
    //! for if already not added
    else {
      allPropertyInformationDetail = [currentPropertyInformationDetail];
    }

    console.log("allPropertyInformationDetail", allPropertyInformationDetail)

    handleSubmit((data) => savePropertyRegistraction(data, allPropertyInformationDetail))();
  }


  const savePropertyRegistraction = (data, allPropertyInformationDetail) => {
    const url = `${urls.PTAXURL}/transaction/property/saveV1`;

    const finalBodyApi = {
      ...watch(),
      propertyDetails: allPropertyInformationDetail,
      status: watch("status") != null && watch("status") != undefined && watch("status") != "" ? watch("status") : "DRAFT",
      activeFlag: "Y",
      serviceId: 140,
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
          propertyInformationDetailReset()
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  }



  const deleteHolderDetails = (waterId) => {

    const wantToDelete = { ...watch("propertyDetails")?.find(data => data?.id == waterId), activeFlag: "N" }

    const notWantDelete = watch("propertyDetails")?.filter(data => data?.id != waterId)

    const allPropertyInformationDetail = [...notWantDelete, wantToDelete]

    console.log("wantToDelete", wantToDelete, notWantDelete)

    handleSubmit((data) => savePropertyRegistraction(data, allPropertyInformationDetail))();


  }


  const editHolderDetails = (holderDetails) => {
    multiplePropertyInformationAddButton();
    setValue("propertyInformationId", holderDetails?.id)
    setValue("buildingPermission", holderDetails?.buildingPermission);
    setValue("usageType", holderDetails?.usageType);
    setValue("constructionType", holderDetails?.constructionType);
    setValue("area", holderDetails?.area);
    setValue("parking", holderDetails?.parking);
    setValue("parkingArea", holderDetails?.parkingArea);
    setValue("totalArea", holderDetails?.totalArea);
    setValue("unit", holderDetails?.unit);
    setValue("assessmentDate", holderDetails?.assessmentDate);

  }

  //! parkingRadioButton
  const parkingRadioButton = () => {
    setValue("parkingArea", "")
  }

  const calculateTotalArea = (area, parkingArea) => {
    let finalTotalArea = 0;
    let area1 = 0;
    let parkingArea1 = 0;

    //!  !isNaN(value) &&  !isNaN(parseFloat(value))
    console.log("3424234234", !isNaN(area))
    if (!isNaN(area)) {
      area1 = area;
    }

    if (!isNaN(parkingArea)) {
      parkingArea1 = parkingArea;
    }

    finalTotalArea = Number(area1) + Number(parkingArea1);

    setValue("totalArea", finalTotalArea)
    clearErrors("totalArea")
  }





  //! useEffect -  ================================================>

  useEffect(() => {
    calculateTotalArea(watch("area"), watch("parkingArea"))
  }, [watch("area"), watch("parkingArea")])


  useEffect(() => {
    getUsageTypes();
    getConstructionTypes();
  }, [])

  useEffect(() => {
    console.log(watch("propertyDetails"), "sdfdsfds");
    if (watch("propertyDetails") != null && watch("propertyDetails") != undefined && watch("propertyDetails") != "" && watch("propertyDetails").length != 0) {
      const withoutActiveFlagY = watch("propertyDetails")?.filter(data => data?.activeFlag == "Y")?.map((OKData, index) => {
        return {
          srNo: index + 1,
          buildingPermissionYesNoEng: OKData?.buildingPermission == "true" || OKData?.buildingPermission == true || OKData?.buildingPermission == 1 ? "Yes" : "No",
          buildingPermissionYesNoMr: OKData?.buildingPermission == "true" || OKData?.buildingPermission == true || OKData?.buildingPermission == 1 ? "होय " : "नाही",
          usageTypeEng: usageTypes?.find(data1 => data1?.id == OKData?.usageType)?.usageTypeEng,
          usageTypeMr: usageTypes?.find(data1 => data1?.id == OKData?.usageType)?.usageTypeMr,
          constructionTypeEn: constructionTypes?.find(data1 => data1?.id == OKData?.constructionType)?.constructionTypeEng,
          constructionTypeMr: constructionTypes?.find(data1 => data1?.id == OKData?.constructionType)?.constructionTypeMr,
          unitEng: units?.find(data1 => data1?.id == OKData?.unit)?.unitsEng,
          unitMr: units?.find(data1 => data1?.id == OKData?.unit)?.unitsMr,
          assessmentDate1: moment(OKData?.assessmentDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
          parkingAreaYesNoEng: OKData?.parking == "true" || OKData?.parking == true || OKData?.parking == 1 ? "Yes" : "No",
          parkingAreaYesNoMr: OKData?.parking == "true" || OKData?.parking == true || OKData?.parking == 1 ? "होय " : "नाही",
          parkingArea1: OKData?.parking == "true" || OKData?.parking == true || OKData?.parking == 1 ? OKData?.parkingArea : "-",
          ...OKData
        }
      })

      console.log(withoutActiveFlagY, "okbhava34234")
      setValue("propertyInformationDetailsTable", withoutActiveFlagY);
    } else {
      setValue("propertyInformationDetailsTable", []);
    }
  }, [watch("propertyDetails"), units, constructionTypes, usageTypes])


  useEffect(() => {
    console.log(watch("propertyInformationDetailsTable"), "ok_______________")
  }, [watch("propertyInformationDetailsTable")])


  //! =======================>  view
  return (
    <div>

      <div className={styles.DivOuter}>
        <div className={styles.Header}>
          <FormattedLabel id="propertyInformation" />
        </div>
      </div>





      {(watch("collapsePropertyInformation") == true || watch("collapsePropertyInformation") == "true" || watch("collapsePropertyInformation") == 1) && (
        <Slide
          direction="down"
          in={(watch("collapsePropertyInformation") == true || watch("collapsePropertyInformation") == "true" || watch("collapsePropertyInformation") == 1)}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <Grid container className={styles.GridContainer}>
              {/** Check Box */}
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
                      name="buildingPermission"
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
                            setValue("buildingPermission", e?.target?.checked);
                            clearErrors("buildingPermission");
                            buildingPermissionCheckBox(e);
                          }}
                        />
                      )}
                    />
                  }
                  label=<span className={styles.CheckBoxButtonSpan}>
                    {<FormattedLabel id="buildingPermission" />}
                  </span>
                  labelPlacement="end"
                />
              </Grid>

              {/** usageType */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <FormControl error={!!errors?.usageType} sx={{ marginTop: 2 }}>
                  <InputLabel
                    shrink={watch("usageType") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    {<FormattedLabel id="usageType" reuired />}
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
                        {usageTypes &&
                          usageTypes?.map((usageType) => (
                            <MenuItem key={usageType?.id + 1} value={usageType?.id}>
                              {language == "en" ? usageType?.usageTypeEng : usageType?.usageTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="usageType"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.usageType ? errors?.usageType?.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/** constructionType  */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <FormControl error={!!errors?.constructionType} sx={{ marginTop: 2 }}>
                  <InputLabel
                    shrink={watch("constructionType") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    {<FormattedLabel id="constructionType" reuired />}
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
                        {constructionTypes &&
                          constructionTypes?.map((constructionType) => (
                            <MenuItem key={constructionType?.id + 1} value={constructionType?.id}>
                              {language == "en" ? constructionType?.constructionTypeEng : constructionType?.constructionTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="constructionType"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.constructionType ? errors?.constructionType?.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/** Area  */}
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
                  // inputProps={{ inputMode: 'numbers' }}
                  label={<FormattedLabel id="area" required />}
                  {...register("area")}
                  error={!!errors?.area}
                  helperText={
                    errors?.area
                      ? errors?.area?.message
                      : null
                  }
                />
              </Grid>

              {/** Empty */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
              </Grid>



              {/** Check Box */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <FormControlLabel
                  className={styles.addressCheckBoxButton}
                  control={
                    <Controller
                      name="parking"
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
                            setValue("parking", e?.target?.checked);
                            clearErrors("parking");
                            parkingRadioButton(e);
                          }}
                        />
                      )}
                    />
                  }
                  label=<span className={styles.CheckBoxButtonSpan}>
                    {<FormattedLabel id="parking" />}
                  </span>
                  labelPlacement="end"
                />
              </Grid>

              {watch("parking") == true || watch("parking") == "1" ?
                < Grid
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
                    label={<FormattedLabel id="parkingArea" required />}
                    {...register("parkingArea")}
                    error={!!errors?.parkingArea}
                    helperText={
                      errors?.parkingArea
                        ? errors?.parkingArea?.message
                        : null
                    }
                  />
                </Grid>
                :
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  className={styles.GridItemCenter}
                >
                </Grid>}


              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >

              </Grid>

              {/** Total Area */}
              < Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <TextField
                  inputLablelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  label={<FormattedLabel id="totalArea" required />}
                  {...register("totalArea")}
                  error={!!errors?.totalArea}
                  helperText={
                    errors?.totalArea
                      ? errors?.totalArea?.message
                      : null
                  }
                />
              </Grid>


              {/** usageType */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <FormControl error={!!errors?.unit} sx={{ marginTop: 2 }}>
                  <InputLabel
                    shrink={watch("unit") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    {<FormattedLabel id="unit" required />}
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
                        {units &&
                          units?.map((unit) => (
                            <MenuItem key={unit?.id + 1} value={unit?.id}>
                              {language == "en" ? unit?.unitsEng : unit?.unitsMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="unit"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.unit ? errors?.unit?.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/** assessmentDate  */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <FormControl error={!!errors?.assessmentDate} sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="assessmentDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          // maxDate={moment(new Date())
                          //   .subtract(14, "years")
                          //   .calendar()}
                          // minDate={moment(new Date())
                          //   .subtract(100, "years")
                          //   .calendar()}
                          disabled={watch("disabledFieldInputState")}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16, marginTop: 2 }}>
                              {<FormattedLabel id="assessmentDate" required />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => {
                            field?.onChange(moment(date).format("YYYY-MM-DD"));

                          }}
                          selected={field?.value}
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
                    {errors?.assessmentDate ? errors?.assessmentDate?.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/** others  */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
              </Grid>






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
                onClick={() => addPropertyInformationnTable()}
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
                onClick={() => propertyInformationDetailReset()}
              >
                <FormattedLabel id="clear" />
              </Button>
              <Button
                className={styles.ButtonForMobileWidth}
                size="small"
                disabled={watch("propertyDetails") != null && watch("propertyDetails") != undefined && watch("propertyDetails") != "" && watch("propertyDetails").filter((data) => data?.activeFlag == "Y").length >= 1 ? false : true}
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
            disabled={(watch("addPropertyInformationInputState") == true || watch("addPropertyInformationInputState") == "true" || watch("addPropertyInformationInputState") == 1)}
            startIcon={<Add />}
            onClick={() => {
              multiplePropertyInformationAddButton()
              // addPropertyInformationnTable
            }}
          >
            <FormattedLabel id="addPropertyInformation" />
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
            watch("propertyInformationDetailsTable") != null && watch("propertyInformationDetailsTable") != undefined && watch("propertyInformationDetailsTable").length != 0 && watch("propertyInformationDetailsTable") != "" ? watch("propertyInformationDetailsTable") : []
          }
          columns={PropertyInformationTableColumns}
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

export default PropertyInformation;
