import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import { useRouter } from "next/router";
import urls from "../../../URLS/urls";
import Form from "../../../pages/FireBrigadeSystem/transactions/firstAhawal/form";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

// import style from "../../../../../styles/fireBrigadeSystem/view.module.css";

import { useSelector } from "react-redux";

// http://localhost:4000/hawkerManagementSystem/transactions/components/FireDetails
const FireDetails = (props) => {
  const {
    control,
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();

  const router = useRouter();
  const userToken = useGetToken();

  const exitApp = () => {
    swal({
      title: "Are you sure you want to exit app?",
      text: "Once exit, you will not be able to recover data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // swal("Poof! Your imaginary file has been deleted!", {
        //   icon: "success",
        // });
        router.push({
          pathname: "/FireBrigadeSystem/transactions/finalAhawal",
        });
      } else {
        swal("Your data will be safe");
      }
    });
  };

  const [reason, setReason] = useState();
  const [showVardiOther, setShowVardiOther] = useState([]);
  const [showFireOther, setShowFireOther] = useState([]);
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState([]);
  const [vardiTypes, setVardiTypes] = useState();

  const [lossAmount, setLossAmount] = React.useState();
  const [insurrancePolicy, setInsurrancePolicy] = React.useState();
  const [fireEquipmentsAvailable, setFireEquipmentsAvailable] =
    React.useState();

  const language = useSelector((state) => state?.labels.language);

  const names = [
    { name: "Fire Extinguishers", id: 1 },
    { name: "Fire Alarm Systems", id: 2 },
    { name: "Smoke detector", id: 3 },
    { name: "Heat Detector", id: 4 },
  ];

  useEffect(() => {
    console.log("33333555", props?.props);

    // axios
    //   .get(
    //     `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${props?.props}`
    //   )
    //   .then((res) => {
    //     // if (r.status == 200) {
    //     console.log("332233", res?.data);
    //     methods.reset(res?.data);
    //   })
    //   .catch((err) => {
    //     console.log("errApplication", err);
    //   });

    let isloss = getValues("firstAhawal.isLossInAmount");
    setLossAmount(isloss == true ? "Yes" : "No");

    let idOfVardiType = getValues("vardiSlip.typeOfVardiId");
    setValue("vardiSlip.typeOfVardiId", idOfVardiType);

    // setLossAmount(isloss == true || isloss == "Yes" ? "Yes" : "No");

    let lossInAmount = getValues("firstAhawal.isLossInAmount");
    setLossAmount(lossInAmount !== null && lossInAmount == true ? "Yes" : "No");

    let insurance = getValues("firstAhawal.insurancePolicyApplicable");
    setInsurrancePolicy(insurance == true ? "Yes" : "No");

    let fireEquipments = getValues("firstAhawal.isFireEquipmentsAvailable");

    console.log("fireEquipments", fireEquipments);
    setFireEquipmentsAvailable(
      fireEquipments == true || fireEquipments == "Yes" ? "Yes" : "No"
    );
    setValue(
      "firstAhawal.isFireEquipmentsAvailable",
      fireEquipments == true ? "Yes" : "No"
    );

    let fireEquipment = getValues("firstAhawal.fireEquipments");

    const temp = fireEquipment?.toString()?.split(" ");
    console.log("result", temp);

    // // let temp = new Array();
    // // temp = fireEquipment && fireEquipment?.split(",");

    // const fire = temp?.map((f) => names.find((n) => n.id == f)?.name);

    // setValue("firstAhawal.fireEquipments", fire);
    // console.log("fire111111", fire);
  }, []);

  useEffect(() => {
    getPinCode();
    getVardiTypes();
    getFireReason();
    getSubVardiTypes();
    getUser();
  }, []);

  const [userLst, setUserLst] = useState([]);

  // get employee from cfc
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        // const filData = empFire.find((f) => f.fireStation == fireStation);
        // res?.data?.user?.filter((f) => f.id == empFire);
        console.log("userss", res?.data?.user);
        setUserLst(res?.data?.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [subVardiType, setSubVardiType] = useState();

  // get Vardi Types
  const getSubVardiTypes = () => {
    axios
      .get(
        `${urls.FbsURL}/transaction/subTypeOfVardi/getSubTypeOfVardiMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("sub", res?.data);
        setSubVardiType(res?.data);
      });
  };

  // get reason of fire
  const getFireReason = () => {
    axios
      .get(`${urls.FbsURL}/mstReasonOfFire/get`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setReason(res?.data);
      });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setVardiTypes(res?.data);
      });
  };

  // fetch pin code from cfc
  const getPinCode = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("pin", res?.data?.pinCode);
        setCrPinCodes(res?.data?.pinCode);
      })
      .catch((err) => console.log(err));
  };

  // useEffect(() => {
  //   if (router.query.pageMode == "Edit") {
  //     console.log("hello", router.query.informerName);
  //     setBtnSaveText("Update");

  //     // setValue("informerName", router.query.informerName);
  //     reset(router.query);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (router.query.pageMode === "Edit" || router.query.pageMode === "View") {
  //     console.log("222222", router.query);
  //     if (router?.query?.id) {
  //       axios
  //         .get(`${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${router?.query?.id}`)
  //         .then((res) => {
  //           // if (r.status == 200) {
  //           console.log("332233", res.data);
  //           reset(res?.data);
  //           setValue(
  //             "firstAhawal.insurancePolicyApplicable",
  //             res.data.firstAhawal.insurancePolicyApplicable == true ? "Yes" : "No",
  //           );
  // setLossAmount(
  //   res?.data?.firstAhawal?.isLossInAmount !== null &&
  //     res?.data?.firstAhawal?.isLossInAmount == true
  //     ? "Yes"
  //     : "No"
  // );
  //           setInsurrancePolicy(res.data.firstAhawal.insurancePolicyApplicable == true ? "Yes" : "No");
  //           setFireEquipmentsAvailable(res.data.firstAhawal.isFireEquipmentsAvailable == true ? "Yes" : "No");
  //           // }
  //         })
  //         .catch((err) => {
  //           console.log("errApplication", err);
  //         });
  //     }
  //   }
  // }, []);

  // Titles
  const [titles, setTitles] = useState([]);

  //
  const [crPincodes, setCrPinCodes] = useState([]);

  // getTitles
  // const getTitles = () => {
  //   axios
  //     .get(`${urls.CFCURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setTitles(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           title: row.title,
  //         }))
  //       );
  //     });
  // };

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  // const getGenders = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setGenders(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           gender: row.gender,
  //         }))
  //       );
  //     });
  // };

  // casts
  const [casts, setCasts] = useState([]);

  // getCasts
  // const getCasts = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setCasts(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           cast: row.cast,
  //         }))
  //       );
  //     });
  // };

  // Religions
  const [religions, setReligions] = useState([]);

  // getReligions
  // const getReligions = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setReligions(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           religion: row.religion,
  //         }))
  //       );
  //     });
  // };

  // subCasts
  const [subCasts, setSubCast] = useState([]);

  // getSubCast
  // const getSubCast = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setSubCast(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           subCast: row.subCast,
  //         }))
  //       );
  //     });
  // };

  // typeOfDisabilitys
  const [typeOfDisabilitys, setTypeOfDisability] = useState([]);

  // getTypeOfDisability
  // const getTypeOfDisability = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setTypeOfDisability(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           typeOfDisability: row.typeOfDisability,
  //         }))
  //       );
  //     });
  // };

  // useEffect
  // useEffect(() => {
  //   getTitles();
  //   getTypeOfDisability();
  //   getGenders();
  //   getCasts();
  //   getSubCast();
  //   getReligions();
  // }, []);

  return (
    <>
      <Form props={props?.props} />
      <br />
      <br />
      {/* <Grid container spacing={2} sx={{ paddingBottom: "0px" }}>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            className={styles.button}
            endIcon={<ExitToAppIcon />}
            onClick={exitApp}
          >
            {<FormattedLabel id="exit" />}
          </Button>
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            className={styles.button}
            endIcon={<ClearIcon />}
            onClick={() => cancellButton()}
          >
            {<FormattedLabel id="clear" />}
          </Button>
        </Grid>

      </Grid> */}
    </>
  );
};

export default FireDetails;

// Address
// House Number
// Buildig name
// Road name
// area
// city
// pincode
