import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../../URLS/urls";
import schema from "../../../../../containers/schema/fireBrigadeSystem/emergencyServiceTransaction";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import FormattedLabel from "../../../../containers/FB_ReusableComponent/reusableComponents/FormattedLabel";
import { styled, useTheme } from "@mui/material/styles";
import moment from "moment";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function getStyles(name, personName2, theme) {
  return {
    fontWeight:
      personName2.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const bussinessTypes = [
//   {
//     value: 1,
//     name: "Hotel",
//     key: "hotelDTLDao",
//   },
//   {
//     value: 2,
//     name: "Hotel Lodgging",
//     key: "hoteLodggingDTLDao",
//   },
//   {
//     value: 3,
//     name: "Hotel Permitroom",
//     key: "hotelPermitroomDTLDao",
//   },
//   {
//     value: 4,
//     name: "Lodgging",
//     key: "lodggingDTLDao",
//   },
//   {
//     value: 5,
//     name: "Shaley Poshan Aahar",
//     key: "shaleyPoshanAaharDTLDao",
//   },
//   {
//     value: 6,
//     name: "Petrol Pump",
//     key: "petrolPumpDTLDao",
//   },
//   {
//     value: 7,
//     name: "Hospital",
//     key: "hospitalDTLDao",
//   },
//   {
//     value: 8,
//     name: "D-mart",
//     key: "dmartDTLDao",
//   },
//   {
//     value: 9,
//     name: "Cinema Hall",
//     key: "cinemaHallDTLDao",
//   },
//   {
//     value: 10,
//     name: "Company",
//     key: "companyDTLDao",
//   },
// ];

const Form = () => {
  const [personName2, setPersonName2] = React.useState([]);
  const [personName3, setPersonName3] = React.useState([]);
  const userToken = useGetToken();

  useEffect(() => {
    getBusinessType();
  }, []);

  const [bussinessTypes, setBussinessTypes] = useState();

  // Get Table - Data
  const getBusinessType = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBussinessTypes(res.data);
        console.log("0000", res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  console.log("bussinessTypes", bussinessTypes);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange3 = (event) => {
    const {
      target: { value },
    } = event;

    // fireStationName: personName3.toString(),
    // .toString(),
    // console.log("value222", value2);

    setPersonName3(
      // typeof value === "string"
      //   ? value.map((r) => fireStation.forEach((fire) => fire.fireStationName == r)?.id)
      //   : "-",
      // value2,
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  console.log("personName3", personName3);

  const handleChange2 = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName2(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const theme = useTheme();

  const language = useSelector((state) => state.labels.language);

  const token = useSelector((state) => state.user.user.token);

  // Exit button Routing
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [vardiTypes, setVardiTypes] = useState();
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState(null);
  const [showVardiOther, setShowVardiOther] = useState([]);
  // Fetch User From cfc User (Optional)

  // fire station multiselect
  const [selectedModuleName, setSelectedModuleName] = useState([]);

  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);

  const [shifts, setShift] = useState();

  useEffect(() => {
    getShiftData();
    getId();
  }, []);

  const [idState, setId] = useState();

  const getId = () => {
    axios
      .get(`${urls.FbsURL}/transaction/trnBussinessNOC/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        let _res = res?.data?.bussiness.map((r, i) => ({
          id: r.id,
        }));
        setId(_res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("ippp", idState);

  const getShiftData = () => {
    axios
      .get(`${urls.FbsURL}/employeeShiftMaster/getEmployeeShiftMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setShift(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const _handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedModuleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const _handleChangeEmp = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedEmployeeName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    getUser();
    getVardiTypes();
    getFireStationName();
    getPinCode();
    getSubVardiTypes();
    getEmpFire();
  }, []);

  // const getById = (appId) => {
  //   axios
  //     .get(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${appId}`
  //     )
  //     .then((res) => {
  //       // setValue("typeOfVardiId", res?.data?.typeOfVardiId);
  //       // reset(res.data.vardiSlip);
  //       setValue("id", res.data.id);
  //     });
  // };

  const [fireStation, setfireStation] = useState();

  // get fire station name
  const getFireStationName = () => {
    setOpen(true);
    axios
      .get(
        `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setOpen(false);
        // const filData = res?.data.find((f) => f.fireStation == empFire);
        // console.log("resss", filData);
        setfireStation(res?.data);
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
        console.log("vardi", res?.data);
        setVardiTypes(res?.data);
      });
  };

  const [subVardiType, setSubVardiType] = useState();

  // transaction/subTypeOfVardi/getSubTypeOfVardiMasterData
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Employee and fire station mapping
  const [empFire, setEmpFire] = useState();

  // transaction/subTypeOfVardi/getSubTypeOfVardiMasterData
  // get Vardi Types
  const getEmpFire = () => {
    axios
      .get(
        `${urls.FbsURL}/master/fireStationAndEmployeeDetailsMapping/getAll`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("sub6666", res?.data?.stationAndEmployeeDetailsMapping);
        setEmpFire(res?.data?.stationAndEmployeeDetailsMapping);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("showVardiOther", showVardiOther);

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);

    let FormattedTime = moment(fromData.vardiSlip.vardiTime, "HH:mm:ss").format(
      "HH:mm:ss"
    );

    let fireStationIds = personName3
      // ?.split(",")
      ?.map((uu) => fireStation.find((ff) => ff.fireStationName == uu).id);

    let employeeNameIds = personName2
      // .split(",")
      .map(
        (emp) =>
          userLst.find(
            (user) =>
              user.firstNameEn +
                " " +
                user.middleNameEn +
                " " +
                user.lastNameEn ==
              emp
          )?.id
      );

    console.log(
      "employeeNameIds",
      employeeNameIds.toString(),
      fireStationIds.toString()
    );
    const finalBody = {
      id: router?.query?.id ? router.query.id : null,
      // role: "CREATE_APPLICATION",
      // desg: "DEPT_CLERK",
      // pageMode: router.query.id ? null : "DRAFT",
      desg: "",

      dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
        "YYYY-MM-DDThh:mm:ss"
      ),
      vardiSlip: {
        ...fromData,
        desg: "",
        vardiTime: FormattedTime,

        id: router?.query?.vardiTypeId ? router.query.vardiTypeId : null,

        // fireStationName: selectedModuleName,
        fireStationName: fireStationIds.toString(),
        // .map((r) => fireStation.find((fire) => fire.fireStationName == r)?.id)
        // .toString(),

        // employeeName: selectedEmployeeName,

        employeeName: employeeNameIds.toString(),
        // .map(
        //   (r) =>
        //     userLst.find((user) => user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn == r)
        //       ?.id,
        // )
        // .toString(),
      },
    };

    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(
            `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
            finalBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              fromData.id
                ? // sweetAlert("Application Updated")
                  swal({
                    title: "Application Updated Successfully",
                    text: "Record updated....!!",
                    icon: "success",
                    button: "Ok",
                  })
                : // : swal("Application Created Successfully !",  icon: "success",);
                  swal({
                    title: "Application Created Successfully",
                    text: "application send to the sub fire officer",
                    icon: "success",
                    button: "Ok",
                  });
              router.back();
            }
          });
      }
    });
  };

  const [crPincodes, setCrPinCodes] = useState();

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

  const [filUser, setFilUser] = useState([]);

  let temp2 = [];
  useEffect(() => {
    console.log("personName3", personName3);

    // let temp = personName3.split(",").join();

    personName3.map((fStation) => {
      console.log("1fStation", fStation);
      empFire.forEach((mapping) => {
        console.log("1mapping", mapping.fireStation);
        let iddd = fireStation?.find(
          (fff) => fff?.fireStationName == fStation
        )?.id;
        console.log("iddd", iddd);
        console.log("2mapping", iddd == mapping.fireStation);
        if (iddd == mapping.fireStation) {
          console.log("mapping.user", mapping.user);
          temp2.push(mapping.user);
        }
      });
    });
    console.log("temp2222", temp2);
    let aa = [];
    console.log("userLst", userLst);
    temp2.map((fireEmp) => {
      userLst.forEach((user) => {
        console.log("fireEmp == user.id", fireEmp == user.id);
        if (fireEmp == user.id) {
          let a = {
            id: user.id,
            uname:
              user.firstNameEn +
              " " +
              user.middleNameEn +
              " " +
              user.lastNameEn,
          };
          aa.push(a);
          console.log("aala", a, fireEmp, user.id, user.firstNameEn);
        }
      });
    });
    setFilUser(aa);
    console.log("temp2", temp2, aa);
  }, [personName3]);

  console.log("filUser", filUser);

  const [userLst, setUserLst] = useState([]);

  // get employee from cfc
  const getUser = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setOpen(false);
        // const filData = empFire.find((f) => f.fireStation == fireStation);
        // res?.data?.user?.filter((f) => f.id == empFire);
        // console.log("filData", empFire);
        setUserLst(res?.data?.user);
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
      });
  };

  // Filter User
  // const getFilter = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/user/getAll`)
  //     .then((res) => {
  //       console.log("pin", res?.data);
  //       setFilUser(res?.data?.user);
  //     })
  //     .catch((err) => console.log(err));
  // };

  console.log("filUser", router?.query?.typeOfVardiId);

  useEffect(() => {
    console.log("router.query.pageMode", router.query.pageMode);
    if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
      setBtnSaveText("Update");

      reset(router.query);
      setShowVardiOther(router?.query?.typeOfVardiId);
      setValue("otherVardiType", router?.query?.otherVardiType);
      setSlipHandedOverTo(router.query.slipHandedOverTo);

      // setSelectedModuleName(router.query.fireStationName);

      setSelectedEmployeeName(router.query.employeeName);

      // setSelectedModuleName(
      //   selectedModuleName === "string"
      //     ? router.query.fireStationName

      //         // .split(",")
      //         .map((rec) => fireStation?.find((fire) => fire.id == rec)?.fireStationName)
      //     : value,
      // );

      setOpen(true);
      if (userLst.length > 0 && fireStation) {
        setPersonName3(
          // typeof router.query.fireStationName === "string"
          //   ? router.query.fireStationName.split(",")
          //   : router.query.fireStationName,
          typeof router.query.fireStationName === "string"
            ? router.query.fireStationName
                .split(",")
                .map(
                  (rec) =>
                    fireStation?.find((fire) => fire.id == rec)?.fireStationName
                )
            : "Not available"
        );

        setPersonName2(
          // typeof router.query.employeeName === "string"
          //   ? router.query.employeeName.split(",")
          //   : router.query.employeeName,

          typeof router.query.employeeName === "string" &&
            typeof router.query.employeeName != ""
            ? router.query.employeeName
                .split(",")
                .map(
                  (rec) => userLst?.find((user) => user.id == rec)?.firstNameEn
                )
            : "-"
        );
        setOpen(false);
      }

      // setValue("id", res.data.id);
      // getById(router.query.id);
    }
  }, [fireStation, userLst]);

  // useEffect(() => {
  //   setPersonName2(
  //     // typeof router.query.employeeName === "string"
  //     //   ? router.query.employeeName.split(",")
  //     //   : router.query.employeeName,

  //     typeof router.query.employeeName === "string"
  //       ? router.query.employeeName
  //           .split(",")
  //           .map((rec) => userLst?.find((user) => user.id == rec)?.firstNameEn)
  //       : router.query.employeeName,
  //   );
  // }, [userLst]);

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    informerName: "",
    informerNameMr: "",
    informerMiddleName: "",
    informerMiddleNameMr: "",
    informerLastName: "",
    informerLastNameMr: "",
    roadName: "",
    area: "",
    areaMr: "",
    city: "",
    cityMr: "",
    mailID: "",
    contactNumber: "",
    vardiPlace: "",
    vardiPlaceMr: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    slipHandedOverToMr: "",
    landmark: "",
    landmarkMr: "",
    vardiReceivedName: "",
    // dateAndTimeOfVardi: "",
    documentsUpload: "",
    fireStationName: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    informerName: "",
    informerMiddleName: "",
    informerLastName: "",
    roadName: "",
    area: "",
    city: "",
    contactNumber: "",
    vardiPlace: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    landmark: "",
    vardiReceivedName: "",
    // dateAndTimeOfVardi: "",
    documentsUpload: "",
    mailID: "",
    fireStationName: "",
  };

  let documentsUpload = null;

  let appName = "FBS";
  let serviceName = "M-MBR";
  let applicationFrom = "Web";

  // View
  return (
    <>
      <Box
        style={{
          marginLeft: "8%",
          marginRight: "8%",
          marginTop: "-2.5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          Loading....
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#AF1E96",
                }}
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname:
                        "/FireBrigadeSystem/transactions/businessNoc/citizen/form",
                    })
                  }
                />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "#AF1E96",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                <FormattedLabel id="nocTypes" />
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            // backgroundColor: "#F08080",
            // background: "rgb(252,0,254)",
            // background: linear-gradient(90deg, rgba(252,0,255,1) 0%, rgba(0,219,222,1) 100%);
            background:
              "linear-gradient(90deg, rgba(252,0,255,1) 0%, rgba(0,219,222,1) 100%)",
          }}
          elevation={5}
        >
          {console.log("bussinessTypes", bussinessTypes)}
          <Grid container spacing={4}>
            {bussinessTypes &&
              bussinessTypes?.map((val, index) => {
                const finalData = {
                  key: val?.remark,
                  typeOfBusiness: val.typeOfBusiness,
                  typeOfBusinessMr: val.typeOfBusinessMr,
                  idState: val.id,
                };

                return (
                  <Grid
                    item
                    xs={3}
                    sx={{
                      padding: "23px",
                      // position: "relative",
                    }}
                    // className={styles.content}
                    key={index}
                  >
                    <Item
                      style={{
                        // zIndex: "999",

                        // position: "relative",
                        // display: "flex",
                        // justifyContent: "center",
                        // alignItems: "center",
                        height: "100%",
                        padding: "15px 10px 15px 10px",
                        cursor: "pointer",
                        borderRadius: "15px",
                        boxShadow: "5px 5px 4px 1px #85929E",
                        // border: "2px solid white",
                        backgroundColor: "#EAEDED",
                        // background: "linear-Gradient(10deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 80% )",
                        // color: "white",
                      }}
                      sx={{
                        width: "200px",
                        boxShadow: "5px 5px",
                        ":hover": {
                          backgroundColor: "#D5DBDB",
                        },
                      }}
                      onClick={(e) => {
                        localStorage.setItem("key", val?.remark);
                        localStorage.setItem(
                          "typeOfBusiness",
                          val?.typeOfBusiness
                        );
                        localStorage.setItem(
                          "typeOfBusinessMr",
                          val?.typeOfBusinessMr
                        );
                        localStorage.setItem("idState", val?.id);
                        router.push({
                          pathname:
                            "/FireBrigadeSystem/transactions/businessNoc/citizen/form",
                          query: {
                            key: val?.remark,
                            typeOfBusiness: val.typeOfBusiness,
                            typeOfBusinessMr: val.typeOfBusinessMr,
                            idState: val.id,
                          },
                        });
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          // const record = params.row;
                          router.push({
                            pathname:
                              "/FireBrigadeSystem/transactions/businessNoc/citizen/form",
                            query: {
                              //   valName,
                              //   record,
                              //   key,
                              idState,

                              //   mode: "view",
                              //   pageMode: "View",
                            },
                          });
                        }}
                      >
                        <h6>
                          {language == "en"
                            ? val.typeOfBusiness
                            : typeOfBusinessMr}
                        </h6>
                      </IconButton>
                    </Item>
                  </Grid>
                );
              })}
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default Form;
