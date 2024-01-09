import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useState } from "react";
import theme from "../../../../../theme";
import * as yup from "yup";
import router from "next/router";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "../../renp.module.css";

import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { yupResolver } from "@hookform/resolvers/yup";

import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { roadExcavationCitizenSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import Loader from "../../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
const schema = {
  zoneId: yup.string().required("required"),
  wardId: yup.string().required("required"),
  roadId: yup.string().required("required"),
  locationOfExcavation: yup.string().required("required"),
  lengthOfRoad: yup.string().required("required"),
  widthOfRoad: yup.string().required("required"),
  depthOfRoad: yup.string().required("required"),
  excavationPattern: yup.string().required("required"),
};
let fieldArraySchema = yup.object().shape({
  excavationData: yup.array().of(yup.object().shape(schema)),
});

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(fieldArraySchema),
    defaultValues: {
      excavationData: [
        {
          zoneId: "",
          wardId: "",
          roadId: "",
          locationOfExcavation: "",
          lengthOfRoad: "",
          widthOfRoad: "",
          depthOfRoad: "",
          excavationPattern: "",
        },
      ],
    },
    // mode: "onSubmit",
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'excavationData',
  });

  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
  //   {
  //     control, // control props comes from useForm (optional: if you are using FormContext)
  //     name: "excavationData", // unique name for your Field Array
  //   }
  // );

  const [doc, setDoc] = useState();
  const [dataSource, setDataSource] = useState();
  const [actionJE, setactionJE] = useState();
  const [remarkJE, setremarkJE] = useState();

  const [zoneKeys, setZoneKeys] = useState([]);

  const [wardKeys, setWardKeys] = useState([]);

  // const [zoneWardKeys, setZoneWardKeys] = useState([])
  // index:null,value:[]
  const [zoneWardKeys, setZoneWardKeys] = useState([]);
  let arr = [];
  const [natureofExcavation, setnatureofExcavation] = useState([]);
  const [loadderState, setLoadderState] = useState(false);
  const [typeAamount, setTypeAamount] = useState();
  const [typeBamount, setTypeBamount] = useState();

  const language = useSelector((store) => store.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);
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
  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  // selected menu from drawer
  const userToken = useGetToken();
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  // console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  useEffect(() => {
    getSingleApplicationData(router.query.id);
  }, [router.query.id]);

  let typeOfPavementList = [
    { value: 1, lable: "Soil (Murum) road" },
    { value: 2, lable: "WBM Road" },
    { value: 3, lable: "BBM With MPM road" },
    { value: 4, lable: "BT Road (Full Crushed)" },
    { value: 5, lable: "Footpath" },
    { value: 6, lable: "Paving Blocks" },
  ];

  let typeOfServicesList = [
    { value: 1, lable: "OFC" },
    { value: 2, lable: "GAS Line" },
    { value: 3, lable: "Electricity Cable" },
    { value: 4, lable: "Drainage" },
    { value: 5, lable: "Water Line" },
    { value: 6, lable: "CCTV" },
    { value: 7, lable: "Other" },
  ];

  let applicantTypeList = [
    { value: 1, lable: "Central" },
    { value: 2, lable: "State" },
    { value: 3, lable: "Private" },
    { value: 4, lable: "Other" },
  ];

  let subApplicantCentralList = [
    { value: 1, lable: "Defence" },
    { value: 2, lable: "BSNL" },
    { value: 3, lable: "GAIL" },
    { value: 4, lable: "Other" },
  ];

  let subApplicantStateList = [
    { value: 1, lable: "Maha Metro" },
    { value: 2, lable: "MNGL (Maharashtra Natural GAS Ltd)" },
    { value: 3, lable: "MSEB (Maharashtra State Electricity Board)" },
    { value: 4, lable: "PCMC" },
  ];
  // let natureofExcavation = [
  //   { value: 1, lable: "Parallel" },
  //   { value: 2, lable: "Perpendicular" },
  //   { value: 3, lable: "Cross Cut" },
  // ];

  let typeOfBRTSRoadList = [
    { value: 1, lable: "Old Mumbai Pune(NH4) BRTS Road" },
    { value: 2, lable: "Wakad - Bhosari BRTS Road" },
    { value: 3, lable: "Aundh - Ravet BRTS Road" },
    { value: 4, lable: "Kalewadi - KSB Chowk - Chikhali BRTS Road" },
    { value: 5, lable: "Old Mumbai Pune(NH4) BRTS Road" },
    { value: 6, lable: "Aundh - Ravet BRTS Road" },
    { value: 7, lable: "Vishrantwadi - Alandi BRTS Road" },
  ];
  let depthOfRoadList = [
    { value: 1, lable: "0.6 to 0.9" },
    { value: 2, lable: "1.0 to 1.2" },
    { value: 3, lable: "1.3 to 1.5" },
    { value: 4, lable: "1.5 and Above" },
  ];
  let widthOfRoadList = [
    { value: 1, lable: "Below 18 meter" },
    // { value: 2, lable: "18 Meter" },
    { value: 3, lable: "18-30 meter" },
    { value: 4, lable: "30-45 meter" },
    { value: 5, lable: "Above 45 meter" },
  ];

  //get single application data
  const getSingleApplicationData = (id, _pageSize = 10, _pageNo = 0) => {
    if (router?.query?.pageMode == "Maintaince") {
      axios
        .get(`${urls.RENPURL}/nocPermissionForMaintenance/getById?id=${id}`,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          let result = r.data;
          console.log("sdfsdf",result);
          setDataSource(result);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else {
      if(id){
      axios
        .get(
          `${urls.RENPURL}/trnExcavationRoadCpmpletion/getDataById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          let result = r.data;

          setDataSource(result);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
      }
    }
  };
  console.log("dataSource", dataSource);

  //assigning value to fields
  useEffect(() => {
    let res = dataSource;

    setValue("activeFlag", res ? res?.activeFlag : "-");
    setValue("applicationDate", res ? res?.applicationDate : "-");
    setValue("serviceId", res ? res?.serviceId : "-");
    setValue("applicationNumber", res ? res?.applicationNumber : "-");
    setValue("isIndividualOrFirm", res ? res?.isIndividualOrFirm : "-");
    setValue("companyName", res ? res?.companyName : "-");
    setValue("companyNameMr", res ? res?.companyNameMr : "-");
    setValue("categoryOfRoad", res ? res?.categoryOfRoad : "-");
    setValue("firstName", res ? res?.firstName : "-");
    setValue("firstNameMr", res ? res?.firstNameMr : "-");
    setValue("middleName", res ? res?.middleName : "-");
    setValue("middleNameMr", res ? res?.middleNameMr : "-");
    setValue("lastName", res ? res?.lastName : "-");
    setValue("lastNameMr", res ? res?.lastNameMr : "-");
    setValue("mobileNo", res ? res?.mobileNo : "-");
    setValue("landlineNo", res ? res?.landlineNo : "-");
    setValue("emailAddress", res ? res?.emailAddress : "-");
    // setValue("mainScheme", res ? res?.mainScheme : "-");
    // setValue("subScheme", res ? res?.subScheme : "-");
    setValue("expectedPeriod", res ? res?.expectedPeriod : "-");
    setValue("scopeOfWork", res ? res?.scopeOfWork : "-");
    setValue("typeOfPavement", res ? res?.typeOfPavement : "-");
    setValue("typesOfServices", res ? res?.typesOfServices : "-");
    setValue("firmorIndividual", res ? res?.firmorIndividual : "-");
    setValue("applicantSubType", res ? res?.applicantSubType : "-");
    setValue("otherApplicantSubType", res ? res?.otherApplicantSubType : "-");
    setValue("natureOfExcavation", res ? res?.natureOfExcavation : "-");
    setValue("lengthOfRoad", res ? res?.lengthOfRoad : "-");
    setValue("widthOfRoad", res ? res?.widthOfRoad : "-");
    setValue("depthOfRoad", res ? res?.depthOfRoad : "-");
    setValue("nameOfBRTSRoad", res ? res?.nameOfBRTSRoad : "-");
    setValue("nonBRTSRoadWard", res ? res?.nonBRTSRoadWard : "-");
    setValue("nonBRTSRoadZone", res ? res?.nonBRTSRoadZone : "-");
    setValue("nonBRTSRoadLocationOfExcavation", res ? res?.nonBRTSRoadLocationOfExcavation : "-");
    // setValue("eligibleForSchemeYn", res ? res?.eligibleForSchemeYn : "-");
    setValue("startLatAndStartLng", res ? res?.startLatAndStartLng : "-");
    setValue("endLatAndEndLng", res ? res?.endLatAndEndLng : "-");
    setValue("taxReceipt", res ? res?.taxReceipt : "-");
    setValue("diggingMap", res ? res?.diggingMap : "-");
    setValue("otherDoc", res ? res?.otherDoc : "-");
    setValue("workOrderfromConcernDepartment", res ? res?.workOrderfromConcernDepartment : "-");
    setValue("lengthOfRoadMaintenance", res ? res?.lengthOfRoadMaintenance : "-");
    setValue("widthOfRoadMaintenance", res ? res?.widthOfRoadMaintenance : "-");
    setValue("natureOfExcavationMaintnance", res ? res?.natureOfExcavationMaintnance : "-");
    // setValue("locationSameAsPcmcOrderYn", res ? res?.locationSameAsPcmcOrderYn : null);
    // setValue("locationRemark", res ? res?.locationRemark : "-");
    // setValue("lengthSameAsPcmcOrderYn", res ? res?.lengthSameAsPcmcOrderYn : null);
    // setValue("lengthRemark", res ? res?.lengthRemark : "-");
    // setValue("depthSameAsPcmcOrderYn", res ? res?.depthSameAsPcmcOrderYn : null);
    // setValue("depthRemark", res ? res?.depthRemark : "-");
    // setValue("widthSameAsPcmcOrderYn", res ? res?.widthSameAsPcmcOrderYn : null);
    // setValue("widthRemark", res ? res?.widthRemark : "-");
    setValue("deputyEngineerRemark", res ? res?.deputyEngineerRemark : "-");
    setValue("excutiveEngineerRemark", res ? res?.excutiveEngineerRemark : "-");
    setValue("additionalCityEngineerRemark", res ? res?.additionalCityEngineerRemark : "-");
    setValue("additionalCommissionerRemark", res ? res?.additionalCommissionerRemark : "-");
    setValue("commissionerRemark", res ? res?.commissionerRemark : "-");
   
    setValue("previousWorkOrder", res ? res?.previousWorkOrder : "-");
    setValue("previouslyApprovedDiggingMap", res ? res?.previouslyApprovedDiggingMap : "-");
    setValue("underTaking", res ? res?.underTaking : "-");
    setValue("affidavit", res ? res?.affidavit : "-");
  }, [dataSource]);

  const [btnSaveText, setbtnSaveText] = useState("Save");
  const clearButton = () => {
    console.log("clear");
    reset({
      ...resetValuesClear,
    });
  };

  // Reset Values Clear

  // const handleUploadDocument = (path) => {
  //   console.log("handleUploadDocument", path);
  //   let temp = {
  //     documentPath: path,
  //     documentKey: 1,
  //     documentType: "",
  //     remark: "",
  //   };
  //   setDoc(temp);
  // };

  console.log(":nonBRTSRoadWard", watch("nonBRTSRoadWard"));
  let onSubmitFunc = (formData) => {
    console.log("formData11", formData)
    let body = {
      id: router.query.id,
      role: "SITE_VISIT",
      ...formData,
      trnSiteVisiteDao: {
        companyName: watch("companyName"),
        natureOfExcavationSite: watch("natureOfExcavationSite"),
        widthOfRoadSite: watch("widthOfRoadSite"),
        lengthOfRoadSite: watch("lengthOfRoadSite"),
        trnExcavationDetailsDao: formData.excavationData,
      },
    };
    let bodyMaintaince = {
      id: router.query.id,
      role: "SITE_VISIT",
      ...formData,
    };
    
    if (router?.query?.pageMode == "Maintaince") {
      console.log("formData22", body);
      setLoadderState(true)
      const tempData = axios
        .post(`${urls.RENPURL}/nocPermissionForMaintenance/saveApprove`, bodyMaintaince,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
            setLoadderState(false)
            {
              language === "en"
              ? sweetAlert(
                "Saved!",
                "Site Visit Saved successfully !",
                "success"
              )
              : sweetAlert(
                "जतन केले!",
                "साइट भेट यशस्वीरित्या जतन केली!",
                "यश"
              )
            }
            router.push(
              "/roadExcavation/transaction/roadExcavationMaintenance/roadExcavationDetailsMaintenance"
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else {
      setLoadderState(true)
      const tempData = axios
        .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/saveApprove`, body,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
            setLoadderState(false)
            sweetAlert(
              "Saved!",
              "Road Excevation Application Saved successfully !",
              "success"
            );
            router.push(
              "/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails"
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // console.log(watch("lengthOfRoad"));

  // get Id warIdd

  const getZoneKeys = () => {
    //setVaIdlues("setBackDrop", true);
    axios.get(`${urls.BaseURL}/zone/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // wards
  const getWardKeys = (index) => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      console.log("rrrrrrrr", r?.data?.zoneAndWardLevelMapping);
      setWardKeys(
        r?.data?.ward?.map((row) => ({
          id: row?.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    });
    // }
  };

  const getWardZoneKeys = (index) => {
    // if (getValues(`excavationData.${index}.zoneId`)) {
    console.log(
      "zoneee",
      getValues(`excavationData.${index}.zoneId`),
      "index",
      index
    );
    let zoneIdd = getValues(`excavationData.${index}.zoneId`);
    axios
      .get(
        `${urls.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${zoneIdd}`,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        console.log("rrrrrrrr", r.data);
        setZoneWardKeys([
          ...zoneWardKeys,
          {
            index: index,
            value: r?.data.map((row) => ({
              id: row?.id,
              // ward: row?.ward,
              // zone: row?.zone
              wardName: row.wardName,
              wardNameMr: row.wardNameMr,
            })),
          },
        ]);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };
  const getNatureOfExcavation = () => {
    axios.get(`${urls.RENPURL}/mstNatureOfExcavation/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      // console.log("mstNatureOfExcavation", r);
      let result = r.data.mstNatureOfExcavationDaoList;
      // console.log("mstNatureOfExcavation", result);
      setnatureofExcavation(result);
    })
    .catch((error) => {
      callCatchMethod(error, language);
    });
  };

  useEffect(() => {
    console.log("zoneWardKeys007", zoneWardKeys);
  }, [zoneWardKeys]);

  //filter wards based on zonekey
  // const zonekey = watch("zoneKey");

  // console.log("aaazoneKeys",zonekey)
  // useEffect(() => {

  //   // getWardKeys();
  // }, [zonekey]);

  console.log("zoneKeyssss", zoneKeys);
  console.log("wardKeyssss", wardKeys);

  useEffect(() => {
    getZoneKeys();
    getWardKeys();
    // getWardZoneKeys();
  }, []);

  useEffect(() => {
    getNatureOfExcavation();
  }, []);

  //get roadType
  const [roadType, setRoadType] = useState();
  const getRoadType = () => {
    axios
      .get(`${urls.RENPURL}/mstRoadType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        let result = r.data.mstRoadTypeList;
        setRoadType(result);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    getRoadType();
  }, []);
  console.log("roadType", roadType);

  let moreFields = [];


  //CSS for Table
  const tableStyle = {
    border: '1px solid black',
    width: "95%",
    marginLeft: "1vw",

  };

  const thStyle = {
    border: '1px solid black',
    // backgroundColor:"green"
  };
  const thStyleMain = {
    border: '1px solid black',
    backgroundColor: 'lightgray',
  };


  // ------------------------------------------calculation for type A & B start--------------------------
  const getTypeAAmount = () => {
    setLoadderState(true)
    let bodyA = {
      mstATypeChargesDaoList: watch("excavationData")
    }
    console.log("called111", bodyA);
    axios.post(`${urls.RENPURL}/mstRateCharge/getRateAgainst`, bodyA,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => {
        console.log("aaa", res?.data?.totalAmount);
        if (res.status == 201 || res.status == 200) {
          setTypeAamount(res?.data?.totalAmount)
          setLoadderState(false)
        }
      })
      .catch((error) => {
        setLoadderState(false)
        callCatchMethod(error, language);
      });
  }
  const getTypeBAmount = () => {
    setLoadderState(true)
    let bodyB = {
      mstBTypeCharge: {
        natureOfExcavation: watch("natureOfExcavationSite"),
        widthOfRoad: watch("widthOfRoadSite"),
        lengthOfRoad: watch("lengthOfRoadSite")
      }
    }


    console.log("called111", bodyB);
    axios.post(`${urls.RENPURL}/mstRateCharge/getRateAgainst`, bodyB,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => {
        console.log("bbb", res);
        if (res.status == 201 || res.status == 200) {
          setTypeBamount(res?.data?.totalAmount)
          setLoadderState(false)
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }
  // ------------------------------------------calculation for type A & B end----------------------------


  // view
  return (
    <ThemeProvider theme={theme}>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          style={{
            marginTop: "120px",
            marginBottom: "80px",
          }}
          elevation={2}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "98%",
                height: "auto",
                overflow: "auto",
                padding: "0.5%",
                color: "black",
                fontSize: 19,
                fontWeight: 500,
                // borderRadius: 100,
              }}
            >
              <strong className={styles.fancy_link1}>
                <FormattedLabel id="siteVisit" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {/* <Box
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          > */}
          <form onSubmit={handleSubmit(onSubmitFunc)}>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="applicationNumber"
                  name="applicationNumber"
                  label={<FormattedLabel id="applicationNumber" />}
                  variant="standard"
                  value={watch("applicationNumber")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("applicationNumber")
                        ? true
                        : false,
                  }}
                  error={!!errors.applicationNumber}
                  helperText={
                    errors?.applicationNumber
                      ? errors.applicationNumber.message
                      : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                  paddingLeft: "70px",
                }}
              >
                <div>
                  <Typography>Select</Typography>
                </div>
                <FormControl
                  flexDirection="row"
                  error={!!errors.isIndividualOrFirm}
                  style={{
                    paddingLeft: "80px",
                  }}
                  disabled
                >
                  <Controller
                    name="isIndividualOrFirm"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                      >
                        <FormControlLabel
                          value="Individual"
                          control={<Radio />}
                          label={<FormattedLabel id="individual" />}
                        />
                        <FormControlLabel
                          value="Firm"
                          control={<Radio />}
                          label={<FormattedLabel id="firm" />}
                        />
                      </RadioGroup>
                    )}
                  />
                  <FormHelperText>
                    {errors?.isIndividualOrFirm
                      ? errors.isIndividualOrFirm.message
                      : null}{" "}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="companyName"
                  name="companyName"
                  label={<FormattedLabel id="companyName" />}
                  variant="standard"
                  value={watch("companyName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("companyName") ? true : false,
                  }}
                  error={!!errors.companyName}
                  helperText={
                    errors?.companyName ? errors.companyName.message : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="companyNameMr"
                  name="companyNameMr"
                  label={<FormattedLabel id="companyNameMr" />}
                  variant="standard"
                  value={watch("companyNameMr")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("companyNameMr") ? true : false,
                  }}
                  error={!!errors.companyNameMr}
                  helperText={
                    errors?.companyNameMr ? errors.companyNameMr.message : null
                  }
                />

              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="firstName"
                  name="firstName"
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  value={watch("firstName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("firstName") ? true : false,
                  }}
                  error={!!errors.firstName}
                  helperText={
                    errors?.firstName ? errors.firstName.message : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="middleName"
                  name="middleName"
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  value={watch("middleName")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("middleName") ? true : false,
                  }}
                  error={!!errors.middleName}
                  helperText={
                    errors?.middleName ? errors.middleName.message : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lastName"
                  name="lastName"
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  value={watch("lastName")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("lastName") ? true : false,
                  }}
                  error={!!errors.lastName}
                  helperText={errors?.lastName ? errors.lastName.message : null}
                />
              </Grid>

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  sx={{ width: 250 }}
                  id="landlineNo"
                  name="landlineNo"
                  label={<FormattedLabel id="landLineNo" />}
                  variant="standard"
                  value={watch("landlineNo")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("landlineNo") ? true : false,
                  }}
                  error={!!errors.landlineNo}
                  helperText={
                    errors?.landlineNo ? errors.landlineNo.message : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="mobileNo"
                  name="mobileNo"
                  label={<FormattedLabel id="mobileNo" />}
                  // label="Mobile No."
                  // variant="outlined"
                  variant="standard"
                  value={watch("mobileNo")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("mobileNo") ? true : false,
                  }}
                  error={!!errors.mobileNo}
                  helperText={errors?.mobileNo ? errors.mobileNo.message : null}
                />
              </Grid>
              {/* //////////////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="emailAddress"
                  name="emailAddress"
                  label={<FormattedLabel id="emailAddress" />}
                  // label="emailAddress "
                  // variant="outlined"
                  variant="standard"
                  value={watch("emailAddress")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("emailAddress") ? true : false,
                  }}
                  error={!!errors.emailAddress}
                  helperText={
                    errors?.emailAddress ? errors.emailAddress.message : null
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                  paddingLeft: "70px",
                }}
              >
                <div>
                  <Typography>{language=="en"?"Category of Road":"रस्त्याची श्रेणी"}</Typography>
                </div>
                <FormControl
                  disabled
                  flexDirection="row"
                  error={!!errors.categoryOfRoad}
                >
                  <Controller
                    name="categoryOfRoad"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                      >
                        <FormControlLabel
                          value="BRTS Road"
                          control={<Radio />}
                          label={<FormattedLabel id="brtsRoad" />}
                        />
                        <FormControlLabel
                          value="Internal Road"
                          control={<Radio />}
                          label={<FormattedLabel id="internalRoad" />}
                        />
                      </RadioGroup>
                    )}
                  />
                  <FormHelperText>
                    {errors?.categoryOfRoad
                      ? errors.categoryOfRoad.message
                      : null}{" "}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {watch("categoryOfRoad") == "BRTS Road" && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled>
                      <InputLabel required error={!!errors.nameOfBRTSRoad}>
                      {language=="en"?"Name of BRTS Road":"बीआरटीएस रोडचे नाव"} 
                      </InputLabel>
                      <Controller
                        control={control}
                        name="nameOfBRTSRoad"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.nameOfBRTSRoad}
                          >
                            {typeOfBRTSRoadList &&
                              typeOfBRTSRoadList.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.lable}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.nameOfBRTSRoad}>
                        {/* {errors.nameOfBRTSRoad
                          ? labels.academicYearRequired
                          : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}
              {watch("categoryOfRoad") == "Internal Road" && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled>
                      <InputLabel required error={!!errors.nonBRTSRoadZone}>
                      {language=="en"?"Select Zone":"झोन निवडा"} 
                      </InputLabel>
                      <Controller
                        control={control}
                        name="nonBRTSRoadZone"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.nonBRTSRoadZone}
                          >
                            {zoneKeys &&
                              zoneKeys.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                  {type.zoneName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.nonBRTSRoadZone}>
                        {/* {errors.nonBRTSRoadZone
                          ? labels.academicYearRequired
                          : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled>
                      <InputLabel required error={!!errors.nonBRTSRoadWard}>
                      {language=="en"?"Select Ward":"प्रभाग निवडा"} 

                      </InputLabel>
                      <Controller
                        control={control}
                        name="nonBRTSRoadWard"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.nonBRTSRoadWard}
                          >
                            {zoneWardKeys &&
                              zoneWardKeys.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                  {type.wardName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.nonBRTSRoadWard}>
                        {/* {errors.nonBRTSRoadWard
                          ? labels.academicYearRequired
                          : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="nonBRTSRoadLocationOfExcavation"
                      name="nonBRTSRoadLocationOfExcavation"
                      // label={<FormattedLabel id="nonBRTSRoadLocationOfExcavation" />}
                      label="Location Of Excavation"
                      disabled
                      variant="standard"
                      {...register("nonBRTSRoadLocationOfExcavation")}
                      error={!!errors.nonBRTSRoadLocationOfExcavation}
                      helperText={
                        errors?.nonBRTSRoadLocationOfExcavation
                          ? errors.nonBRTSRoadLocationOfExcavation.message
                          : null
                      }
                    />
                  </Grid>
                </>
              )}

              {/* ///////////////////////////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <FormControl disabled>
                  <InputLabel required error={!!errors.typeOfPavement}>
                  {language=="en"?"Type Of Pavement":"फुटपाथचा प्रकार"} 

                  </InputLabel>
                  <Controller
                    control={control}
                    name="typeOfPavement"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        {...field}
                        error={!!errors.typeOfPavement}
                      >
                        {typeOfPavementList &&
                          typeOfPavementList.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.lable}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.typeOfPavement}>
                    {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <FormControl disabled>
                  <InputLabel required error={!!errors.typesOfServices}>
                  {language=="en"?"Type Of Service":"सेवेचा प्रकार"}  

                  </InputLabel>
                  <Controller
                    control={control}
                    name="typesOfServices"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        {...field}
                        error={!!errors.typesOfServices}
                      >
                        {typeOfServicesList &&
                          typeOfServicesList.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.lable}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.typesOfServices}>
                    {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {watch("typesOfServices") == 7 && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="otherTypesOfServices"
                      name="otherTypesOfServices"
                      disabled
                      // label={<FormattedLabel id="otherTypesOfServices" />}
                      label="Other type of service"
                      variant="standard"
                      {...register("otherTypesOfServices")}
                      error={!!errors.otherTypesOfServices}
                      helperText={
                        errors?.otherTypesOfServices
                          ? errors.otherTypesOfServices.message
                          : null
                      }
                    />
                  </Grid>
                </>
              )}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <FormControl disabled>
                  <InputLabel required error={!!errors.firmorIndividual}>
                  {language=="en"?"Applicant Type":"अर्जदाराचा प्रकार"}  

                  </InputLabel>
                  <Controller
                    control={control}
                    name="firmorIndividual"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        {...field}
                        error={!!errors.firmorIndividual}
                      >
                        {applicantTypeList &&
                          applicantTypeList.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.lable}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.firmorIndividual}>
                    {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {watch("firmorIndividual") == 1 && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled>
                      <InputLabel required error={!!errors.applicantSubType}>
                      {language=="en"?"Applicant Sub Type":"अर्जदार उपप्रकार"} 

                      </InputLabel>
                      <Controller
                        control={control}
                        name="applicantSubType"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.applicantSubType}
                          >
                            {subApplicantCentralList &&
                              subApplicantCentralList.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.lable}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.applicantSubType}>
                        {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}

              {watch("applicantSubType") == 4 && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="otherApplicantSubType"
                      name="otherApplicantSubType"
                      // label={<FormattedLabel id="otherApplicantSubType" />}
                      label="Other Applicant Sub Type"
                      variant="standard"
                      {...register("otherApplicantSubType")}
                      error={!!errors.otherApplicantSubType}
                      helperText={
                        errors?.otherApplicantSubType
                          ? errors.otherApplicantSubType.message
                          : null
                      }
                    />
                  </Grid>
                </>
              )}

              {watch("firmorIndividual") == 2 && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl disabled>
                      <InputLabel required error={!!errors.applicantSubType}>
                      {language=="en"?"Applicant Sub Type":"अर्जदार उपप्रकार"} 

                      </InputLabel>
                      <Controller
                        control={control}
                        name="applicantSubType"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.applicantSubType}
                          >
                            {subApplicantStateList &&
                              subApplicantStateList.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.lable}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.applicantSubType}>
                        {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}

              {watch("firmorIndividual") == 4 && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="applicantSubType"
                      name="applicantSubType"
                      // label={<FormattedLabel id="applicantSubType" />}
                      label="Other applicant type"
                      variant="standard"
                      {...register("applicantSubType")}
                      error={!!errors.applicantSubType}
                      helperText={
                        errors?.applicantSubType
                          ? errors.applicantSubType.message
                          : null
                      }
                    />
                  </Grid>
                </>
              )}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <FormControl disabled>
                  <InputLabel required error={!!errors.natureOfExcavation}>
                  {language=="en"?"Nature of Excavation":"उत्खननाचे स्वरूप"} 

                  </InputLabel>
                  <Controller
                    control={control}
                    name="natureOfExcavation"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        {...field}
                        error={!!errors.natureOfExcavation}
                      >
                        {natureofExcavation &&
                          natureofExcavation.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {language === "en" ? type.nameEng : type.nameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.natureOfExcavation}>
                    {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* /////////////////////////////////////////////////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lengthOfRoad"
                  name="lengthOfRoad"
                  disabled
                  // label={<FormattedLabel id="lengthOfRoad" />}
                  label="Length of Road to be excavation  (Meter)"
                  variant="standard"
                  {...register("lengthOfRoad")}
                  error={!!errors.lengthOfRoad}
                  helperText={
                    errors?.lengthOfRoad ? errors.lengthOfRoad.message : null
                  }
                />
                {/* <FormHelperText error={!!errors.natureofExcavation}>
                      {errors.natureofExcavation
                          ? "requried only numbers"
                          : null}
                    </FormHelperText> */}
              </Grid>
              {/* /////////////////////////////////////////////////////////////////////////////////////// */}
              {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="widthOfRoad"
                        name="widthOfRoad"
                        // label={<FormattedLabel id="widthOfRoad" />}
                        label="Width of Road to be excavation (Meter) "
                        variant="standard"
                        {...register("widthOfRoad")}
                        error={!!errors.widthOfRoad}
                        helperText={
                          errors?.widthOfRoad
                            ? errors.widthOfRoad.message
                            : null
                        }
                      />
                    </Grid> */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <FormControl disabled>
                  <InputLabel required error={!!errors.widthOfRoad}>
                    {language == "en"
                      ? "Width of Road to be excavation (Meter)"
                      : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="widthOfRoad"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        {...field}
                        error={!!errors.widthOfRoad}
                      >
                        {widthOfRoadList &&
                          widthOfRoadList.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.lable}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.widthOfRoad}>
                    {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* /////////////////////////////////////////////////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <FormControl disabled>
                  <InputLabel required error={!!errors.depthOfRoad}>
                  {language=="en"?"Depth Of Road":"रस्त्याची खोली"}

                  </InputLabel>
                  <Controller
                    control={control}
                    name="depthOfRoad"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        {...field}
                        error={!!errors.depthOfRoad}
                      >
                        {depthOfRoadList &&
                          depthOfRoadList.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.lable}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.depthOfRoad}>
                    {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            {/* /////////////////////////////////////////////////////////////////////////////////////// */}

            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              {/* ////////////////////////////////////////// */}

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  //
                  style={{ backgroundColor: "white", width: "250px" }}
                  // id="expectedPeriod"
                  name="expectedPeriod"
                  disabled
                  label={<FormattedLabel id="expectedPeriodInDays" />}
                  // label="Expected Period"
                  // label="Permit Period"
                  // variant="outlined"
                  variant="standard"
                  // value={watch("expectedPeriod")}
                  {...register("expectedPeriod")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("expectedPeriod") ? true : false,
                  }}
                  error={!!errors.expectedPeriod}
                  helperText={
                    errors?.expectedPeriod
                      ? errors.expectedPeriod.message
                      : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="scopeOfWork"
                  name="scopeOfWork"
                  disabled
                  label={<FormattedLabel id="scopeOfWork" />}
                  // label="Scope Of Work"
                  // variant="outlined"
                  variant="standard"
                  value={watch("scopeOfWork")}
                  // {...register("scopeOfWork")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("scopeOfWork") ? true : false,
                  }}
                  error={!!errors.scopeOfWork}
                  helperText={
                    errors?.scopeOfWork ? errors.scopeOfWork.message : null
                  }
                />
              </Grid>
            </Grid>

            {/* /////////////////////////////////////////////////////////////////////////////////////// */}

            {/* ////////////////////////////////////////// */}
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="startLatAndStartLng"
                  disabled
                  name="startLatAndStartLng"
                  label={<FormattedLabel id="startLatAndStartLng" />}
                  // label="START Latitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  value={watch("startLatAndStartLng")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("startLatAndStartLng")
                        ? true
                        : false,
                  }}
                  error={!!errors.startLatAndStartLng}
                  helperText={
                    errors?.startLatAndStartLng
                      ? errors.startLatAndStartLng.message
                      : null
                  }
                />
              </Grid>
              {/*///////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="endLatAndEndLng"
                  name="endLatAndEndLng"
                  disabled
                  label={<FormattedLabel id="endLatAndEndLng" />}
                  // label="END Latitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  value={watch("endLatAndEndLng")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("endLatAndEndLng")
                        ? true
                        : false,
                  }}
                  error={!!errors.endLatAndEndLng}
                  helperText={
                    errors?.endLatAndEndLng
                      ? errors.endLatAndEndLng.message
                      : null
                  }
                />
              </Grid>
              {/*///////////////////////////////////////// */}
            </Grid>

            {/* table */}
            {/* <h3><FormattedLabel id="addDocuments" /></h3>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><FormattedLabel id="srNo" /></TableCell>
                    <TableCell><FormattedLabel id="docName" /></TableCell>
                    <TableCell><FormattedLabel id="docType" /></TableCell>
                    <TableCell><FormattedLabel id="view" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSource
                    &&
                    dataSource.fileAttachementDao
                      .map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.fileName}</TableCell>
                          <TableCell>{row.extension}</TableCell>
                          <TableCell> <Tooltip title="View">
                            <a
                              href={`${urls.CFCURL}/file/preview?filePath=${row.filePath}`}
                              target='__blank'
                            >
                              <IconButton>
                                <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                              </IconButton>
                            </a>
                          </Tooltip></TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table> */}
            {/* <hr /> */}

            <Typography sx={{ marginLeft: "20px", marginTop: "20px" }}>
              <h2>
                <FormattedLabel id="excavationDetails" />
              </h2>
            </Typography>
{router.query.pageMode !="Maintaince" && <>
            <Typography sx={{ marginLeft: "20px", marginTop: "20px" }}>
              <h4><b>
                {language == "en" ? "Type A : Charges for road improvement" : "प्रकार अ: रस्ता पुर्ववत करण्यासाठीचे शुल्क"}
              </b>
              </h4>
            </Typography>
            <Grid>
            </Grid>

            {/* ***********************new Table start************** */}
            <div
              style={{
                overflowX: 'auto',
                //  background:"yellow",
                margin: "2vh 2vw"
              }}
            >
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}><FormattedLabel id="zone" /></th>
                    <th style={thStyle}><FormattedLabel id="ward" /></th>
                    <th style={thStyle}><FormattedLabel id="roadTypes" /></th>
                    <th style={thStyle}><FormattedLabel id="locationOfExcavation" /></th>
                    <th style={thStyle}><FormattedLabel id="lengthOfRoad" /></th>
                    <th style={thStyle}><FormattedLabel id="widthOfRoad" /></th>
                    <th style={thStyle}><FormattedLabel id="depthOfRoad" /></th>
                    <th style={thStyle}><FormattedLabel id="excavationPattern" /></th>
                    {router.query.pageMode != "View" && <th style={thStyle}>{language == "en" ? "Actions" : "क्रिया"}</th>}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((row, index) => (
                    <tr key={row.id}>
                      <td style={thStyle}>
                        <FormControl
                          // xs={12}
                          // sm={6}
                          // md={4}
                          style={{ marginLeft: "2vw" }}
                          error={!!errors?.excavationData?.[index]?.zoneId}
                        >
                          <InputLabel>
                            {" "}
                            <FormattedLabel id="zone" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="outlined"
                                // sx={{ width: 200 }}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value), getWardZoneKeys(index);
                                }}
                                // onChange={(value) =>
                                //   {
                                //     field.onChange(value)
                                //     getWardKeys(index)
                                //   }
                                // }

                                // name={`roadExcavation.[${index}].zoneId`}
                                // {...register(`excavationData.${index}.zoneId`)}

                                label="zone"
                                InputProps={{ style: { fontSize: 18 } }}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink:
                                    (watch("zonekey") ? true : false) ||
                                    (router.query.zonekey ? true : false),
                                }}
                              >
                                {zoneKeys &&
                                  zoneKeys.map((zonekey, index) => (
                                    <MenuItem key={index} value={zonekey.id}>
                                      {zonekey.zoneName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            // name="zoneKey"
                            name={`excavationData.${index}.zoneId`}
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.excavationData?.[index]?.zoneId
                              ? errors?.excavationData?.[index]?.zoneId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </td>
                      <td style={thStyle}>
                        <FormControl
                          // xs={12}
                          // sm={6}
                          // md={4}
                          style={{ marginLeft: "2vw" }}
                          error={!!errors?.excavationData?.[index]?.wardId}
                        >
                          <InputLabel>
                            <FormattedLabel id="ward" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // value={field.value}
                                onChange={(value) => field.onChange(value)}
                                // name={`excavationData.${index}.wardId`}
                                // {...register(`excavationData.${index}.wardId`)}
                                // sx={{ width: 200 }}
                                variant="outlined"
                              >
                                {console.log("zoneWardKeys++++", zoneWardKeys)}
                                {zoneWardKeys[index]?.value?.map((wbz, ind) => (
                                  <MenuItem key={ind} value={wbz?.id}>
                                    {wbz?.wardName}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                            name={`excavationData.${index}.wardId`}
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.excavationData?.[index]?.wardId
                              ? errors?.excavationData?.[index]?.wardId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </td>
                      <td style={thStyle}>
                        <FormControl
                          // xs={12}
                          // sm={6}
                          // md={4}
                          style={{ marginLeft: "2vw" }}
                          error={!!errors?.excavationData?.[index]?.roadId}
                        >
                          <InputLabel>
                            <FormattedLabel id="roadTypes" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                name={`excavationData.${index}.roadId`}
                                {...register(`excavationData.${index}.roadId`)}
                                // sx={{ width: 200 }}
                                variant="outlined"
                              >
                                {roadType &&
                                  roadType.map((road, index) => (
                                    <MenuItem key={index} value={road.id}>
                                      {road.roadTypeName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="RoadTypeId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.excavationData?.[index]?.roadId
                              ? errors?.excavationData?.[index]?.roadId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </td>
                      <td style={thStyle}>
                        <TextField
                          // style={{marginLeft:"1vw",marginRight:"1vw",marginBottom:"1vw"}}
                          style={{ margin: "1vw" }}
                          id="locationOfExcavationData"
                          name={`excavationData.${index}.locationOfExcavation`}
                          label={<FormattedLabel id="locationOfExcavation" />}
                          variant="outlined"
                          {...register(
                            `excavationData.${index}.locationOfExcavation`
                          )}
                          error={
                            !!errors?.excavationData?.[index]?.locationOfExcavation
                          }
                          helperText={
                            errors?.excavationData?.[index]?.locationOfExcavation
                              ? errors?.excavationData?.[index]?.locationOfExcavation
                                .message
                              : null
                          }
                        />
                      </td>
                      <td style={thStyle}>
                        <TextField
                          // style={{ backgroundColor: "white", width: "250px" }}
                          style={{ margin: "1vw" }}
                          id="lengthOfRoad"
                          name={`excavationData.${index}.lengthOfRoad`}
                          {...register(`excavationData.${index}.lengthOfRoad`)}
                          label={<FormattedLabel id="lengthOfRoad" />}
                          variant="outlined"
                          error={!!errors?.excavationData?.[index]?.lengthOfRoad}
                          helperText={
                            errors?.excavationData?.[index]?.lengthOfRoad
                              ? errors?.excavationData?.[index]?.lengthOfRoad.message
                              : null
                          }
                        />

                      </td>
                      <td style={thStyle}>
                        <TextField
                          // style={{ backgroundColor: "white", width: "250px" }}
                          style={{ margin: "1vw" }}
                          id="widthOfRoad"
                          name={`excavationData.${index}.widthOfRoad`}
                          label={<FormattedLabel id="widthOfRoad" />}
                          variant="outlined"
                          {...register(`excavationData.${index}.widthOfRoad`)}
                          error={!!errors?.excavationData?.[index]?.widthOfRoad}
                          helperText={
                            errors?.excavationData?.[index]?.widthOfRoad
                              ? errors?.excavationData?.[index]?.widthOfRoad.message
                              : null
                          }
                        />
                      </td>
                      <td style={thStyle}>

                        <TextField
                          // sx={{ width: 250 }}
                          style={{ margin: "1vw" }}
                          id="depthOfRoad"
                          name={`excavationData.${index}.depthOfRoad`}
                          label={<FormattedLabel id="depthOfRoad" />}
                          variant="outlined"
                          {...register(`excavationData.${index}.depthOfRoad`)}
                          error={!!errors?.excavationData?.[index]?.depthOfRoad}
                          helperText={
                            errors?.excavationData?.[index]?.depthOfRoad
                              ? errors?.excavationData?.[index]?.depthOfRoad.message
                              : null
                          }
                        />

                      </td>
                      <td style={thStyle}>
                        <TextField
                          // style={{ backgroundColor: "white", width: "250px" }}
                          style={{ margin: "1vw" }}
                          id="excavationPattern"
                          name={`excavationData.${index}.excavationPattern`}
                          label={<FormattedLabel id="excavationPattern" />}
                          variant="outlined"
                          {...register(`excavationData.${index}.excavationPattern`)}
                          error={!!errors?.excavationData?.[index]?.excavationPattern}
                          helperText={
                            errors?.excavationData?.[index]?.excavationPattern
                              ? errors?.excavationData?.[index]?.excavationPattern
                                .message
                              : null
                          }
                        />
                      </td>

                      {router.query.pageMode != "View" &&
                        <td style={thStyle}>
                          <Button
                            onClick={() => remove(index)}
                            variant="contained"
                            color="primary"
                          >
                            {language == "en" ? "Remove Row" : "पंक्ती काढा"}
                          </Button>
                        </td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {
              router?.query?.pageMode != "View" && <>
                <Grid container
                  spacing={2}
                  style={{
                    // padding: "10px",
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "left",
                    marginLeft: "2vw",
                  }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "left",
                      // marginTop: "20px",
                    }}
                  >
                    <Button onClick={() => append({ srNo: (fields.length + 1).toString() })} variant="contained" color="primary">
                      {language == "en" ? " Add Row" : "पंक्ती जोडा"}
                    </Button>

                    <Button onClick={() => getTypeAAmount()} variant="contained" color="primary" style={{ marginLeft: "2vw", }}>
                      {language == "en" ? "Calculate Amount" : "रक्कम मोजा"}
                    </Button></Grid>
                  {/* <div> */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "left",
                      // marginTop: "20px",
                    }}
                  >
                    {
                      typeAamount &&
                      <span><b>Type A : Charges for road improvement Amount: <span style={{ color: "red" }}>Rs. {typeAamount}</span> </b></span>
                    }
                  </Grid>
                </Grid>
                {/* </div> */}
              </>

            }


           
            {/* ***********************new Table End************** */}



            <Typography sx={{ marginLeft: "20px", marginTop: "7vh" }}>
              <h4><b>
                {language == "en" ? "Type B : Municipal Surcharge" : "प्रकार ब: मनपा अधिभार"}
              </b>
              </h4>
            </Typography>
            <div
              style={{
                overflowX: 'auto',
                //  background:"yellow",
                margin: "2vh 2vw"
              }}
            >
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{language == "en"
                      ? "Nature of Excavation"
                      : "उत्खननाचे स्वरूप"}</th>
                    <th style={thStyle}>{language == "en"
                      ? "Length of Road to be excavation (Meter)"
                      : "खोदाईच्या रस्त्याची लांबी (मीटर)"}</th>
                    <th style={thStyle}>{language == "en"
                      ? "Width of Road to be excavation (Meter)"
                      : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}</th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    <td style={thStyle}>
                      <FormControl style={{ margin: "1vw" }}>
                        <InputLabel required error={!!errors.natureOfExcavationSite}>
                          {language == "en"
                            ? "Nature of Excavation"
                            : "उत्खननाचे स्वरूप"}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="natureOfExcavationSite"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              variant="outlined"
                              {...field}
                              error={!!errors.natureOfExcavationSite}
                            >
                              {natureofExcavation &&
                                natureofExcavation.map((type) => (
                                  <MenuItem key={type.id} value={type.id}>
                                    {language === "en" ? type.nameEng : type.nameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.natureOfExcavationSite}>
                          {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                        </FormHelperText>
                      </FormControl></td>
                    <td style={thStyle}>
                      <TextField
                        // style={{ backgroundColor: "white", width: "250px" }}
                        id="lengthOfRoadSite"
                        style={{ margin: "1vw", width: "350px" }}
                        name={`lengthOfRoadSite`}
                        label={language == "en"
                          ? "Length of Road to be excavation (Meter)"
                          : "खोदाईच्या रस्त्याची लांबी (मीटर)"}
                        variant="outlined"
                        {...register(
                          `lengthOfRoadSite`
                        )}
                        error={
                          !!errors?.lengthOfRoadSite
                        }
                        helperText={
                          errors?.lengthOfRoadSite
                            ? errors?.lengthOfRoadSite
                              .message
                            : null
                        }
                      /></td>
                    <td style={thStyle}>
                      <TextField
                        // style={{ backgroundColor: "white", width: ./"250px" }}
                        id="widthOfRoadSite"
                        name={`widthOfRoadSite`}
                        label={language == "en"
                          ? "Width of Road to be excavation (Meter)"
                          : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}
                        variant="outlined"
                        {...register(
                          `widthOfRoadSite`
                        )}
                        style={{ margin: "1vw", width: "350px" }}
                        error={
                          !!errors?.widthOfRoadSite
                        }
                        helperText={
                          errors?.widthOfRoadSite
                            ? errors?.widthOfRoadSite
                              .message
                            : null
                        }
                      /></td>
                  </tr>
                </tbody></table>
            </div>
            <Grid container
              spacing={2}
              style={{
                // padding: "10px",
                display: "flex",
                justifyContent: "left",
                alignItems: "left",
                marginLeft: "2vw",
              }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                  // marginTop: "20px",
                }}
              >

                <Button onClick={() => getTypeBAmount()} variant="contained" color="primary" style={{ marginLeft: "2vw", }}>
                  {language == "en" ? "Calculate Amount" : "रक्कम मोजा"}
                </Button></Grid>
              {/* <div> */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                  // marginTop: "20px",
                }}
              >
                {
                  typeBamount &&
                  <span><b>{language=="en"?"Type B : Municipal Surcharge Amount:":"प्रकार बी : महापालिका अधिभार रक्कम:"}<span style={{ color: "red" }}>{language=="en"?"Rs.":"रु."}{typeBamount}</span> </b></span>
                }

              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >{
                (typeBamount && typeAamount) &&
                <b>{language=="en"?"Total Amount:":"एकूण रक्कम:"}<span style={{ color: "red" }}>Rs. {typeAamount + typeBamount}</span> </b>

              }
            </Grid>
            </>}
            {router.query.pageMode == "Maintaince" && <>
            <div
              style={{
                overflowX: 'auto',
                //  background:"yellow",
                margin: "2vh 2vw"
              }}
            >
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{language == "en"
                      ? "Nature of Excavation"
                      : "उत्खननाचे स्वरूप"}</th>
                    <th style={thStyle}>{language == "en"
                      ? "Length of Road to be excavation (Meter)"
                      : "खोदाईच्या रस्त्याची लांबी (मीटर)"}</th>
                    <th style={thStyle}>{language == "en"
                      ? "Width of Road to be excavation (Meter)"
                      : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}</th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    <td style={thStyle}>
                      <FormControl style={{ margin: "1vw" }}>
                        <InputLabel required error={!!errors.natureOfExcavationMaintnance}>
                          {language == "en"
                            ? "Nature of Excavation"
                            : "उत्खननाचे स्वरूप"}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="natureOfExcavationMaintnance"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              variant="outlined"
                              {...field}
                              error={!!errors.natureOfExcavationMaintnance}
                            >
                              {natureofExcavation &&
                                natureofExcavation.map((type) => (
                                  <MenuItem key={type.id} value={type.id}>
                                    {language === "en" ? type.nameEng : type.nameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.natureOfExcavationMaintnance}>
                          {/* {errors.typeOfPavement
                          ? labels.academicYearRequired
                          : null} */}
                        </FormHelperText>
                      </FormControl></td>
                    <td style={thStyle}>
                      <TextField
                        // style={{ backgroundColor: "white", width: "250px" }}
                        id="lengthOfRoadMaintenance"
                        style={{ margin: "1vw", width: "350px" }}
                        name={`lengthOfRoadMaintenance`}
                        label={language == "en"
                          ? "Length of Road to be excavation (Meter)"
                          : "खोदाईच्या रस्त्याची लांबी (मीटर)"}
                        variant="outlined"
                        {...register(
                          `lengthOfRoadMaintenance`
                        )}
                        error={
                          !!errors?.lengthOfRoadMaintenance
                        }
                        helperText={
                          errors?.lengthOfRoadMaintenance
                            ? errors?.lengthOfRoadMaintenance
                              .message
                            : null
                        }
                      /></td>
                    <td style={thStyle}>
                      <TextField
                        // style={{ backgroundColor: "white", width: ./"250px" }}
                        id="widthOfRoadMaintenance"
                        name={`widthOfRoadMaintenance`}
                        label={language == "en"
                          ? "Width of Road to be excavation (Meter)"
                          : "खोदाईच्या रस्त्याची रुंदी (मीटर)"}
                        variant="outlined"
                        {...register(
                          `widthOfRoadMaintenance`
                        )}
                        style={{ margin: "1vw", width: "350px" }}
                        error={
                          !!errors?.widthOfRoadMaintenance
                        }
                        helperText={
                          errors?.widthOfRoadMaintenance
                            ? errors?.widthOfRoadMaintenance
                              .message
                            : null
                        }
                      /></td>
                  </tr>
                </tbody></table>
            </div>
            </>}
            {/* ////////////////////////////////////////// */}

            <Grid
              container
              spacing={2}
              style={{
                // padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Grid item>
                <Button type="submit" variant="outlined">
                  <FormattedLabel id="save" />
                </Button>
              </Grid>
            </Grid>
            {/* //////////////////////////////////// */}
          </form>
          {/* </Box> */}
        </Paper>)}
    </ThemeProvider>
  );
};

export default Index;
