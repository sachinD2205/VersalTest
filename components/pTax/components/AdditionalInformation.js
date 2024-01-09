import { Add } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import styles from "../../../components/pTax/styles/AdditionalInformation.module.css";
import { useApplicantType, useGetLoggedInUserDetails, useGetToken, useLanguage } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";


/** Author - Sachin Durge */
// AdditionalInformation -
const AdditionalInformation = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    handleSubmit,
    clearErrors,
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

  const [bankNames, setBankNames] = useState([]);
  const [branchNames, setBranchName] = useState([]);
  const [units, setUnits] = useState([])
  const [usageTypes, setUsageTypes] = useState([])
  const [constructionTypes, setConstructionTypes] = useState([])
  const [electricityConnectionNames, setElectricityConnectionNames] = useState([{
    id: 1,
    electricityConnectionNameEng: "Elect En",
    electricityConnectionNameMr: "Elect Mar",
  }])

  const [waterConnectionTypesNames, setWaterConnectionTypesNames] = useState([{
    id: 1,
    waterConnectionTypeNameEng: "Water Type En",
    waterConnectionTypeNameMr: "Water Type Mar",
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

  // getBankNames
  const getBankNames = () => {

    const url = `${urls.CFCURL}/master/bank/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setBankNames(
          res?.data?.bank.map((j) => ({
            id: j.id,
            bankNameEng: j?.bankName,
            bankNameMr: j?.bankNameMr,
          }))
        )
      )
      .catch((error) => catchExceptionHandlingMethod(error, language));

  };

  // getConstructionTypes
  // const getConstructionTypes = () => {

  //   const url = `${urls.PTAXURL}/master/constructionType/getAll`;

  //   axios
  //     .get(url, {
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then((res) =>
  //       setConstructionTypes(
  //         res?.data?.constructionType?.map((j) => ({
  //           id: j?.id,
  //           constructionTypeEng: j?.constructionTypeName,
  //           constructionTypeMr: j?.constructionTypeNameMr,
  //         }))
  //       )
  //     )
  //     .catch((error) => callCatchMethod(error, language))

  // };



  //! waterConnnection Start ===============================================> 



  const waterConnectionInformationDetailReset = () => {
    setValue("waterConnectionTypeNameId", null);
    setValue("numberOfWaterConnection", "");
    setValue("diameter", "");
    setValue("socaityConnectionYesNoCheckBox", false);
    waterConnectionInformationDetailClear();
    setValue("addWaterConnectionInformationInputState", false);
    setValue("collapseWaterConnection", false);
  }

  const waterConnectionInformationDetailResetWithId = () => {
    setValue("waterConnectionInformationId", null)
    setValue("waterConnectionTypeNameId", null);
    setValue("numberOfWaterConnection", "");
    setValue("diameter", "");
    setValue("socaityConnectionYesNoCheckBox", false);
    waterConnectionInformationDetailClear();
  }

  const waterConnectioInformationGet = () => {
    const data = {
      id: watch("waterConnectionInformationId") != null && watch("waterConnectionInformationId") != undefined && watch("waterConnectionInformationId") != "" ? watch("waterConnectionInformationId") : null,
      waterConnectionTypeNameId: watch("waterConnectionTypeNameId"),
      numberOfWaterConnection: watch("numberOfWaterConnection"),
      diameter: watch("diameter"),
      socaityConnectionYesNoCheckBox: watch("socaityConnectionYesNoCheckBox"),
      activeFlag: "Y"
    }
    return data;
  }

  const waterConnectionInformationDetailClear = () => {
    //! clearErros 
    clearErrors("waterConnectionTypeNameId");
    clearErrors("numberOfWaterConnection");
    clearErrors("diameter");
    clearErrors("socaityConnectionYesNoCheckBox");
  }

  const multipleWaterConnectionInformationAddButton = () => {
    setValue("addWaterConnectionInformationInputState", true);
    setValue("collapseWaterConnection", true);
  }

  const waterConnectionExitButton = () => {
    setValue("addWaterConnectionInformationInputState", false);
    setValue("collapseWaterConnection", false);
    waterConnectionInformationDetailResetWithId()
  }

  const WaterConnectionInformationTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "socaityConnectionYesNoCheckBoxEng" : "socaityConnectionYesNoCheckBoxMr",
      headerName: <FormattedLabel id="societyWaterConnection" />,
      width: 276,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "waterConnectionTypeEng" : "waterConnectionTypeMr",
      headerName: <FormattedLabel id="waterConnectionType" />,
      description: <FormattedLabel id="waterConnectionType" />,
      width: 280,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "numberOfWaterConnection",
      headerName: <FormattedLabel id="noOfWaterConnections" />,
      description: <FormattedLabel id="noOfWaterConnections" />,
      width: 260,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "diameter",
      headerName: <FormattedLabel id="diameter" />,
      description: <FormattedLabel id="diameter" />,
      width: 250,
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
              disabled={
                (
                  (watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1)
                  || (watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1))
              }
              onClick={() => {
                editWaterConnectionDetails(record?.row)
                console.log("record", record?.row)
              }}
            >
              <EditIcon
                sx={{
                  color: (
                    (watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1)
                    || (watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1)) ? "gray" : "blue",
                }} />

            </IconButton >
            <IconButton
              disabled={

                ((watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1)
                  || (watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1))


              }
              onClick={() => {
                deleteWaterConnectionDetails(record?.row?.id)
                console.log("record", record?.row?.id)
              }}
            >
              <DeleteIcon sx={{
                color:

                  ((watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1)
                    || (watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1)
                  )
                    ? "gray" : "red",
              }} />
            </IconButton>
          </>
        );
      },
    },
  ];
  const addWaterConnectionInformationnTable = () => {

    const currentWaterConnectionInformationDetail = waterConnectioInformationGet();

    console.log(currentWaterConnectionInformationDetail, "dsfldskjfl32432")

    const allWaterConnectionnIformationDetail = null;
    if (watch("waterConnections") != null && watch("waterConnections") != undefined && watch("waterConnections").length != 0) {

      //! for update
      if (currentWaterConnectionInformationDetail?.id) {
        const withouUpdateObjectsWater = watch("waterConnections")?.filter(data => data?.id != currentWaterConnectionInformationDetail?.id);
        console.log("dsfdsf32432", withouUpdateObjectsWater)
        allWaterConnectionnIformationDetail = [...withouUpdateObjectsWater, currentWaterConnectionInformationDetail]
      }
      //! for new add with old
      else {
        allWaterConnectionnIformationDetail = [...watch("waterConnections"), currentWaterConnectionInformationDetail];
      }
    }
    //! for if already not added
    else {
      allWaterConnectionnIformationDetail = [currentWaterConnectionInformationDetail];
    }

    console.log("allWaterConnectionnIformationDetail", allWaterConnectionnIformationDetail)


    handleSubmit((data) => savePropertyRegistraction(data, allWaterConnectionnIformationDetail, "water"))();



  }

  const deleteWaterConnectionDetails = (holderId) => {

    const wantToDeleteWater = { ...watch("waterConnections")?.find(data => data?.id == holderId), activeFlag: "N" }

    const notWantDeleteWater = watch("waterConnections")?.filter(data => data?.id != holderId)

    const allWaterConnectionnIformationDetail = [...notWantDeleteWater, wantToDeleteWater]

    console.log("wantToDeleteWater", wantToDeleteWater, notWantDeleteWater)



    handleSubmit((data) => savePropertyRegistraction(data, allWaterConnectionnIformationDetail, "water"))();





  }

  const editWaterConnectionDetails = (waterConnections) => {
    multipleWaterConnectionInformationAddButton();
    setValue("waterConnectionInformationId", waterConnections?.id)
    setValue("waterConnectionTypeNameId", waterConnections?.waterConnectionTypeNameId);
    setValue("numberOfWaterConnection", waterConnections?.numberOfWaterConnection);
    setValue("diameter", waterConnections?.diameter);
    setValue("socaityConnectionYesNoCheckBox", waterConnections?.socaityConnectionYesNoCheckBox);
  }



  const waterConnectionDetailsTableDataSet = () => {
    console.log(watch("waterConnections"), "sdfdsfds");
    if (watch("waterConnections") != null && watch("waterConnections") != undefined && watch("waterConnections") != "" && watch("waterConnections").length != 0) {
      const withoutActiveFlagYWater = watch("waterConnections")?.filter(data => data?.activeFlag == "Y")?.map((OKData, index) => {
        return {
          srNo: index + 1,
          waterConnectionTypeEng: waterConnectionTypesNames?.find(data1 => data1?.id == OKData?.waterConnectionTypeNameId)?.waterConnectionTypeNameEng,
          waterConnectionTypeMr: waterConnectionTypesNames?.find(data1 => data1?.id == OKData?.waterConnectionTypeNameId)?.waterConnectionTypeNameMr,
          socaityConnectionYesNoCheckBoxEng: OKData?.socaityConnectionYesNoCheckBox == "true" || OKData?.socaityConnectionYesNoCheckBox == true || OKData?.socaityConnectionYesNoCheckBox == 1 ? "Yes" : "No",
          socaityConnectionYesNoCheckBoxMr: OKData?.socaityConnectionYesNoCheckBox == "true" || OKData?.socaityConnectionYesNoCheckBox == true || OKData?.socaityConnectionYesNoCheckBox == 1 ? "होय " : "नाही",





          ...OKData
        }
      })

      console.log(withoutActiveFlagYWater, "okbhava34234")
      setValue("waterConnectioinInformationDetailsTable", withoutActiveFlagYWater);
    } else {
      setValue("waterConnectioinInformationDetailsTable", []);
    }
  }

  //! ====================================> water Connection End 

  //! electricConnnection Start ===============================================> 


  const electricConnectionInformationDetailReset = () => {
    setValue("electricalConnectionTypeID", null);
    setValue("dateOfElectricalConnection", null);
    setValue("electricalConsumerNo", "");
    electricConnectionInformationDetailClear();
    setValue("addElectricConnectionInformationInputState", false);
    setValue("collapseElectricConnection", false);
  }

  const electricConnectionInformationDetailResetWithId = () => {
    setValue("electricConnectionInformationId", null)
    setValue("electricalConnectionTypeID", "");
    setValue("dateOfElectricalConnection", null);
    setValue("electricalConsumerNo", null);
    electricConnectionInformationDetailClear();
  }

  const electricConnectioInformationGet = () => {
    const data = {
      id: watch("electricConnectionInformationId") != null && watch("electricConnectionInformationId") != undefined && watch("electricConnectionInformationId") != "" ? watch("electricConnectionInformationId") : null,
      electricalConnectionTypeID: watch("electricalConnectionTypeID"),
      dateOfElectricalConnection: watch("dateOfElectricalConnection"),
      electricalConsumerNo: watch("electricalConsumerNo"),
      activeFlag: "Y"
    }
    return data;
  }

  const electricConnectionInformationDetailClear = () => {
    //! clearErros 
    clearErrors("electricalConnectionTypeID");
    clearErrors("dateOfElectricalConnection");
    clearErrors("electricalConsumerNo");
  }

  const multipleElectricConnectionInformationAddButton = () => {
    setValue("addElectricConnectionInformationInputState", true);
    setValue("collapseElectricConnection", true);
  }

  const electricConnectionExitButton = () => {
    setValue("addElectricConnectionInformationInputState", false);
    setValue("collapseElectricConnection", false);
    electricConnectionInformationDetailResetWithId()
  }

  const ElectricConnectionInformationTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 120,
      headerAlign: "center",
      align: "center",
    },

    {
      field: language == "en" ? "electricConnectionTypeEng" : "electricConnectionTypeMr",
      headerName: <FormattedLabel id="electricConnectionType" />,
      description: <FormattedLabel id="electricConnectionType" />,
      width: 345,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dateOfElectricalConnection1",
      headerName: <FormattedLabel id="dateOfElectricConnection" />,
      description: <FormattedLabel id="dateOfElectricConnection" />,
      width: 300,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "electricalConsumerNo",
      headerName: <FormattedLabel id="electricConsumerNo" />,
      description: <FormattedLabel id="electricConsumerNo" />,
      width: 400,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 140,
      sortable: false,
      hide: watch("disabledFieldInputState") == true || watch("disabledFieldInputState") == "true" || watch("disabledFieldInputState") == "1" ? true : false,
      // disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              disabled={
                ((watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1)
                  || (watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1))
              }
              onClick={() => {
                editElectricConnectionDetails(record?.row)
                console.log("record", record?.row)
              }}
            >
              <EditIcon
                sx={{
                  color:
                    ((watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1)
                      || (watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1))

                      ? "gray" : "blue",
                }} />

            </IconButton >
            <IconButton
              disabled={
                ((watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1)
                  || (watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1))

              }
              onClick={() => {
                deleteElectricConnectionDetails(record?.row?.id)
                console.log("record", record?.row?.id)
              }}
            >
              <DeleteIcon sx={{
                color:
                  ((watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1)
                    || (watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1))

                    ? "gray" : "red",
              }} />
            </IconButton>
          </>
        );
      },
    },
  ];
  const addElectricConnectionInformationnTable = () => {

    const currentElectricConnectionInformationDetail = electricConnectioInformationGet();

    console.log(currentElectricConnectionInformationDetail, "dsfldskjfl32432")

    const allElectricConnectionnIformationDetail = null;
    if (watch("electricConnections") != null && watch("electricConnections") != undefined && watch("electricConnections").length != 0) {

      //! for update
      if (currentElectricConnectionInformationDetail?.id) {
        const withouUpdateObjectsElectric = watch("electricConnections")?.filter(data => data?.id != currentElectricConnectionInformationDetail?.id);
        console.log("dsfdsf32432", withouUpdateObjectsElectric)
        allElectricConnectionnIformationDetail = [...withouUpdateObjectsElectric, currentElectricConnectionInformationDetail]
      }
      //! for new add with old
      else {
        allElectricConnectionnIformationDetail = [...watch("electricConnections"), currentElectricConnectionInformationDetail];
      }
    }
    //! for if already not added
    else {
      allElectricConnectionnIformationDetail = [currentElectricConnectionInformationDetail];
    }

    console.log("allElectricConnectionnIformationDetail", allElectricConnectionnIformationDetail)


    handleSubmit((data) => savePropertyRegistraction(data, allElectricConnectionnIformationDetail, "electric"))();


  }

  const deleteElectricConnectionDetails = (electricId) => {

    const wantToDeleteElectric = { ...watch("electricConnections")?.find(data => data?.id == electricId), activeFlag: "N" }

    const notWantDeleteElectric = watch("electricConnections")?.filter(data => data?.id != electricId)

    const allElectricConnectionnIformationDetail = [...notWantDeleteElectric, wantToDeleteElectric]

    console.log("wantToDeleteElectric", wantToDeleteElectric, notWantDeleteElectric)



    handleSubmit((data) => savePropertyRegistraction(data, allElectricConnectionnIformationDetail, "electric"))();




  }

  const editElectricConnectionDetails = (electricConnectionDetails) => {
    multipleElectricConnectionInformationAddButton();
    setValue("electricConnectionInformationId", electricConnectionDetails?.id)
    setValue("electricalConnectionTypeID", electricConnectionDetails?.electricalConnectionTypeID);
    setValue("dateOfElectricalConnection", electricConnectionDetails?.dateOfElectricalConnection);
    setValue("electricalConsumerNo", electricConnectionDetails?.electricalConsumerNo);
  }



  const electricConnectionDetailsTableDataSet = () => {
    console.log(watch("electricConnections"), "sdfdsfds");
    if (watch("electricConnections") != null && watch("electricConnections") != undefined && watch("electricConnections") != "" && watch("electricConnections").length != 0) {
      const withoutActiveFlagYElectric = watch("electricConnections")?.filter(data => data?.activeFlag == "Y")?.map((OKData, index) => {
        return {
          srNo: index + 1,
          electricConnectionTypeEng: electricityConnectionNames?.find(data1 => data1?.id == OKData?.electricalConnectionTypeID)?.electricityConnectionNameEng,
          electricConnectionTypeMr: electricityConnectionNames?.find(data1 => data1?.id == OKData?.electricalConnectionTypeID)?.electricityConnectionNameMr,
          dateOfElectricalConnection1: moment(OKData?.dateOfElectricalConnection, "YYYY-MM-DD").format("DD-MM-YYYY"),
          ...OKData
        }
      })

      console.log(withoutActiveFlagYElectric, "okbhava34234")
      setValue("electricConnectioinInformationDetailsTable", withoutActiveFlagYElectric);
    } else {
      setValue("electricConnectioinInformationDetailsTable", []);
    }
  }

  //! ====================================> electric Connection End 






  //!=========================> save 

  const savePropertyRegistraction = (data, payloadForSave, typeOfSaveWaterOrElectricConnection) => {
    const url = `${urls.PTAXURL}/transaction/property/saveV1`;
    let finalBodyForApi = null;



    if (typeOfSaveWaterOrElectricConnection == "water") {
      finalBodyForApi = {
        ...watch(),
        waterConnections: payloadForSave,
        status: watch("status") != null && watch("status") != undefined && watch("status") != "" ? watch("status") : "DRAFT",
        activeFlag: "Y",
        serviceId: 140,
        createdUserId: userID,
        applicantType: applicantType,
        id: watch("id") != null && watch("id") != undefined && watch("id") != null ? watch("id") : null,
      };
    } else if (typeOfSaveWaterOrElectricConnection == "electric") {
      finalBodyForApi = {
        ...watch(),
        electricConnections: payloadForSave,
        status: watch("status") != null && watch("status") != undefined && watch("status") != "" ? watch("status") : "DRAFT",
        activeFlag: "Y",
        serviceId: 140,
        createdUserId: userID,
        applicantType: applicantType,
        id: watch("id") != null && watch("id") != undefined && watch("id") != null ? watch("id") : null,
      };
    } else {
      finalBodyForApi = {
        ...watch(),
        // waterConnections: payloadForSave,
        status: watch("status") != null && watch("status") != undefined && watch("status") != "" ? watch("status") : "DRAFT",
        activeFlag: "Y",
        serviceId: 140,
        createdUserId: userID,
        applicantType: applicantType,
        id: watch("id") != null && watch("id") != undefined && watch("id") != null ? watch("id") : null,
      };
    }




    console.log(payloadForSave, "typeOfSaveWaterOrElectricConnection", typeOfSaveWaterOrElectricConnection, finalBodyForApi)

    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res) {
          console.log("response", res?.data?.message.split("@")[1]);
          const id = null;
          setValue("propertyRegistractionId", res?.data?.message.split("@")[1]);
          waterConnectionInformationDetailReset()
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  }

  //! useEffect -  ================================================>




  useEffect(() => {
    getBankNames();
    // getConstructionTypes();
  }, [])


  //! water
  useEffect(() => {
    waterConnectionDetailsTableDataSet();
  }, [watch("waterConnections")])

  //! electric
  useEffect(() => {
    electricConnectionDetailsTableDataSet();
  }, [watch("electricConnections")])


  useEffect(() => {
    console.log('3423432432432432432', watch("collapseElectricConnection"), watch("collapseWaterConnection"));
  }, [watch("collapseElectricConnection"), watch("collapseWaterConnection")])

  //! =======================>  view
  return (
    <div>

      {/** Header Start */}

      {/** Header End */}

      {/** Bank Details Start */}

      <div className={styles.DivOuter}>
        <div className={styles.Header}>
          <FormattedLabel id="bankDetails" />
        </div>
      </div>

      <Grid container className={styles.GridContainer}>
        {/** bank Name */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <FormControl
            disabled={watch("disabledFieldInputState")}
            variant="standard"
            sx={{ marginTop: 2 }}
            error={!!errors?.bankDetails?.bankNameId}
          >
            <InputLabel
              shrink={watch("bankDetails.bankNameId") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="bankName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="bankName" required />}
                >
                  {bankNames &&
                    bankNames?.map((bankName, index) => (
                      <MenuItem key={index} value={bankName?.id}>
                        {language == "en"
                          ? bankName?.bankNameEng
                          : bankName?.bankNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="bankDetails.bankNameId"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.bankDetails?.bankNameId ? errors?.bankDetails?.bankNameId?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/** branch Name */}
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
            label={<FormattedLabel id="branchName" required />}
            variant="standard"
            {...register("bankDetails.branchName")}
            error={!!errors?.bankDetails?.branchName}
            helperText={
              errors?.bankDetails?.branchName ? errors?.bankDetails?.branchName?.message : null
            }
          />
        </Grid>
        {/** account number */}
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
            inputProps={{ maxLength: 18 }}
            label={<FormattedLabel id="accountNo" required />}
            variant="standard"
            {...register("bankDetails.bankAccountNumber")}
            error={!!errors?.bankDetails?.bankAccountNumber}
            helperText={
              errors?.bankDetails?.bankAccountNumber ? errors?.bankDetails?.bankAccountNumber?.message : null
            }
          />
        </Grid>
        {/** isfc code no */}
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
            inputProps={{ maxLength: 11 }}
            label={<FormattedLabel id="ifscCode" required />}
            variant="standard"
            {...register("bankDetails.ifscCode")}
            error={!!errors?.bankDetails?.ifscCode}
            helperText={errors?.bankDetails?.ifscCode ? errors?.bankDetails?.ifscCode?.message : null}
          />
        </Grid>
        {/* only for responsive */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        ></Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        ></Grid>
      </Grid>
      {/** Bank Details End */}


      {/** Water Connection Start */}
      <div className={styles.DivOuter}>
        <div className={styles.Header}>
          <FormattedLabel id="waterConnections" />
        </div>
      </div>
      <div className={styles.waterConnectionInCase}>
        {<FormattedLabel id="inCaseOfWaterConnectionAvailable" />}
      </div>

      {(watch("collapseWaterConnection") == true || watch("collapseWaterConnection") == "true" || watch("collapseWaterConnection") == 1) && (
        <Slide
          direction="down"
          in={(watch("collapseWaterConnection") == true || watch("collapseWaterConnection") == "true" || watch("collapseWaterConnection") == 1)}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <Grid container className={styles.GridContainer}>
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
                  className={styles.socaityWaterConnectionCheckBox}
                  control={
                    <Controller
                      name="socaityConnectionYesNoCheckBox"
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
                            setValue("socaityConnectionYesNoCheckBox", e?.target?.checked);
                            clearErrors("socaityConnectionYesNoCheckBox");
                          }}
                        />
                      )}
                    />
                  }
                  label=<span className={styles.CheckBoxButtonSpan1}>
                    {<FormattedLabel id="societyWaterConnection" />}
                  </span>
                  labelPlacement="end"
                />
              </Grid>

              {/** waterConnectionType */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              >
                <FormControl error={!!errors?.waterConnectionTypeNameId} sx={{ marginTop: 2 }}>
                  <InputLabel
                    shrink={watch("waterConnectionTypeNameId") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    {<FormattedLabel id="waterConnectionType" reuired />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={watch("disabledFieldInputState")}
                        // autoFocus
                        value={field?.value}
                        onChange={(value) => field?.onChange(value)}
                        label={<FormattedLabel id="titleEn" required />}
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {waterConnectionTypesNames &&
                          waterConnectionTypesNames?.map((waterConnectionTypeName) => (
                            <MenuItem key={waterConnectionTypeName?.id + 1} value={waterConnectionTypeName?.id}>
                              {language == "en" ? waterConnectionTypeName?.waterConnectionTypeNameEng : waterConnectionTypeName?.waterConnectionTypeNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="waterConnectionTypeNameId"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.waterConnectionTypeNameId ? errors?.waterConnectionTypeNameId?.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/** noOfWaterConnections  */}
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
                  label={<FormattedLabel id="noOfWaterConnections" required />}
                  {...register("numberOfWaterConnection")}
                  error={!!errors?.numberOfWaterConnection}
                  helperText={
                    errors?.numberOfWaterConnection
                      ? errors?.numberOfWaterConnection?.message
                      : null
                  }
                />
              </Grid>

              {/** diameter  */}
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
                  label={<FormattedLabel id="diameter" required />}
                  {...register("diameter")}
                  error={!!errors?.diameter}
                  helperText={
                    errors?.diameter
                      ? errors?.diameter?.message
                      : null
                  }
                />
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
                onClick={() => addWaterConnectionInformationnTable()}
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
                onClick={() => waterConnectionInformationDetailReset()}
              >
                <FormattedLabel id="clear" />
              </Button>
              <Button
                className={styles.ButtonForMobileWidth}
                size="small"
                // disabled={watch("waterConnections") != null && watch("waterConnections") != undefined && watch("waterConnections") != "" && watch("waterConnections").length != 0 && watch("waterConnections").length != 0 ? false : true}
                variant="contained"
                color="error"
                endIcon={<ExitToAppIcon />}
                onClick={() => waterConnectionExitButton()}
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
            disabled={
              (watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1)

              || (watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1)

            }
            startIcon={<Add />}
            onClick={() => {
              multipleWaterConnectionInformationAddButton()
              // addWaterConnectionInformationnTable
            }}
          >
            <FormattedLabel id="buttonWaterConnection" />
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
            watch("waterConnectioinInformationDetailsTable") != null && watch("waterConnectioinInformationDetailsTable") != undefined && watch("waterConnectioinInformationDetailsTable").length != 0 && watch("waterConnectioinInformationDetailsTable") != "" ? watch("waterConnectioinInformationDetailsTable") : []
          }
          columns={WaterConnectionInformationTableColumns}
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

      {/** Water Connection End */}



      {/** Electric Connection Start */}
      <div className={styles.DivOuter}>
        <div className={styles.Header}>
          <FormattedLabel id="electricConnectionDetails" />
        </div>
      </div>
      <div className={styles.electricConnectionInCase}>
        {<FormattedLabel id="inCaseOfElectricConnectionAvailable" />}
      </div>

      {
        (watch("collapseElectricConnection") == true || watch("collapseElectricConnection") == "true" || watch("collapseElectricConnection") == 1) && (
          <Slide
            direction="down"
            in={(watch("collapseElectricConnection") == true || watch("collapseElectricConnection") == "true" || watch("collapseElectricConnection") == 1)}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <Grid container className={styles.GridContainer}>


                {/** electricConnectionType */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  className={styles.GridItemCenter}
                >
                  <FormControl error={!!errors?.electricalConnectionTypeID} sx={{ marginTop: 2 }}>
                    <InputLabel
                      shrink={watch("electricalConnectionTypeID") == null ? false : true}
                      id="demo-simple-select-standard-label"
                    >
                      {<FormattedLabel id="electricConnectionType" reuired />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled={watch("disabledFieldInputState")}
                          // autoFocus
                          value={field?.value}
                          onChange={(value) => field?.onChange(value)}
                          label={<FormattedLabel id="titleEn" required />}
                          id="demo-simple-select-standard"
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {electricityConnectionNames &&
                            electricityConnectionNames?.map((electricityConnectionName) => (
                              <MenuItem key={electricityConnectionName?.id + 1} value={electricityConnectionName?.id}>
                                {language == "en" ? electricityConnectionName?.electricityConnectionNameEng : electricityConnectionName?.electricityConnectionNameEng}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="electricalConnectionTypeID"
                      control={control}
                      defaultValue={null}
                    />
                    <FormHelperText>
                      {errors?.electricalConnectionTypeID ? errors?.electricalConnectionTypeID?.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/** dateOfElectricalConnection  */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  className={styles.GridItemCenter}
                >
                  <FormControl error={!!errors?.dateOfElectricalConnection} sx={{ marginTop: 0 }}>
                    <Controller
                      control={control}
                      name="dateOfElectricalConnection"
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
                                {<FormattedLabel id="dateOfElectricConnection" required />}
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
                      {errors?.dateOfElectricalConnection ? errors?.dateOfElectricalConnection?.message : null}
                    </FormHelperText>
                  </FormControl>


                </Grid>

                {/** electricalConsumerNo  */}
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
                    label={<FormattedLabel id="diameter" required />}
                    {...register("electricalConsumerNo")}
                    error={!!errors?.electricalConsumerNo}
                    helperText={
                      errors?.electricalConsumerNo
                        ? errors?.electricalConsumerNo?.message
                        : null
                    }
                  />
                  {/** Empty */}
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
                  onClick={() => addElectricConnectionInformationnTable()}
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
                  onClick={() => electricConnectionInformationDetailReset()}
                >
                  <FormattedLabel id="clear" />
                </Button>
                <Button
                  className={styles.ButtonForMobileWidth}
                  size="small"
                  // disabled={watch("electricConnections") != null && watch("electricConnections") != undefined && watch("electricConnections") != "" && watch("electricConnections").length != 0 && watch("electricConnections").length != 0 ? false : true}
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  onClick={() => electricConnectionExitButton()}
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
            disabled={

              (watch("addElectricConnectionInformationInputState") == true || watch("addElectricConnectionInformationInputState") == "true" || watch("addElectricConnectionInformationInputState") == 1)

              || (watch("addWaterConnectionInformationInputState") == true || watch("addWaterConnectionInformationInputState") == "true" || watch("addWaterConnectionInformationInputState") == 1)


            }
            startIcon={<Add />}
            onClick={() => {
              multipleElectricConnectionInformationAddButton()
              // addElectricConnectionInformationnTable
            }}
          >
            <FormattedLabel id="buttonElectricityConnection" />
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
            watch("electricConnectioinInformationDetailsTable") != null && watch("electricConnectioinInformationDetailsTable") != undefined && watch("electricConnectioinInformationDetailsTable").length != 0 && watch("electricConnectioinInformationDetailsTable") != "" ? watch("electricConnectioinInformationDetailsTable") : []
          }
          columns={ElectricConnectionInformationTableColumns}
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

      {/** Electric Connection End */}

    </div >
  );
};

export default AdditionalInformation;
