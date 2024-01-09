import { ThemeProvider } from "@emotion/react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import styles from "../../../../components/marriageRegistration/board.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = (props) => {
  const [loader, setLoader] = useState(false);
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
  let appName = "MR";
  let serviceName = "M-RBR";
  let applicationFrom = "online";
  const user = useSelector((state) => state?.user.user);

  const methods = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(boardschema),
    mode: "onChange",
    // defaultValues: {
    //   id: null,
    //   wardKey: '',
    //   zoneKey: '',
    //   atitle: '',
    //   afName: '',
    //   amName: '',
    //   alName: '',
    //   afNameMr: '',
    //   amNameMr: '',
    //   alNameMr: '',

    //   aCflatBuildingNo: '',
    //   aCbuildingName: '',
    //   aCroadName: '',
    //   aCLandmark: '',
    //   aCCityName: '',
    //   aCPincode: '',

    //   aPflatBuildingNo: '',
    //   aPbuildingName: '',
    //   aProadName: '',
    //   aPLandmark: '',
    //   aPCityName: '',
    //   aPPincode: '',

    //   marriageBoardName: '',
    //   genderKey: '',
    //   bflatBuildingNo: '',
    //   bbuildingName: '',
    //   broadName: '',
    //   blandmark: '',
    //   bpincode: '',
    //   aadhaarNo: '',
    //   mobile: '',
    //   emailAddress: '',
    //   city: '',
    //   // validityOfMarriageBoardRegistration: null,
    //   remarks: '',
    //   serviceCharges: '',
    //   applicationAcceptanceCharges: '',
    //   applicationNumber: '',

    //   aCflatBuildingNoMr: '',
    //   aCbuildingNameMr: '',
    //   aCroadNameMr: '',
    //   aCLandmarkMr: '',
    //   aCCityNameMr: '',

    //   //marathi permanent

    //   aPflatBuildingNoMr: '',
    //   aPbuildingNameMr: '',
    //   aProadNameMr: '',
    //   aPLandmarkMr: '',
    //   aPCityNameMr: '',

    //   //marathi board

    //   marriageBoardNameMr: '',
    //   bflatBuildingNoMr: '',
    //   bbuildingNameMr: '',
    //   broadNameMr: '',
    //   blandmarkMr: '',
    //   cityMr: '',
    //   applicationNumber: '',
    // },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const router = useRouter();
  const [atitles, setatitles] = useState([]);

  useEffect(() => {
    console.log("props.data", props.data);
    reset(props.data);
  }, []);

  // OnSubmit Form
  const onSubmitForm = (data) => {
    console.log("jml ka", getValues("boardHeadPersonPhoto"));
  };

  //file upload

  const [fileName, setFileName] = useState(null);

  const language = useSelector((state) => state?.labels.language);
  // zones
  const [temp, setTemp] = useState();

  // genders
  const [genderKeys, setgenderKeys] = useState([]);

  // getgenderKeys
  const getgenderKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgenderKeys(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [document, setDocument] = useState([]);

  // getGAgeProofDocumentKey
  const getDocumentKey = () => {
    axios
      .get(`${urls.CFCURL}/master/serviceWiseChecklist/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setDocument(r.data.serviceWiseChecklist);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // console.log("areaKey333",watch("areaKey"));
  useEffect(() => {
    // getAreas();
    // getZoneKeys();
    // getWardKeys();
    getgenderKeys();
    getDocumentKey();
    getTitles();
    getTitleMr();
  }, [temp]);
  // const setWardZoneBasedOnArrray = () => {
  //   if (watch("areaKey") != null) {
  //     let anotherFind = areaNames?.find(
  //       (data) => data?.areaId == watch("areaKey"),
  //     );
  //     console.log("filteredArrayZone1212", anotherFind);
  //     setValue("zoneKey", anotherFind?.zoneId);
  //     setValue("wardKey", anotherFind?.wardId);
  //   } else {
  //     setValue("zoneKey", null);
  //     setValue("wardKey", null);
  //   }
  // };
  // console.log("areaNames", areaNames);
  useEffect(() => {
    // if (router.query.pageMode === 'EDIT' || router.query.pageMode === 'View') {
    //   reset(router.query)
    // }
    console.log("user123", user);
    setValue("atitle", user.title);
    setValue("afName", user.firstName);
    setValue("amName", user.middleName);
    setValue("alName", user.surname);
    setValue("afNameMr", user.firstNamemr);
    setValue("amNameMr", user.middleNamemr);
    setValue("alNameMr", user.surnamemr);
    setValue("genderKey", user.gender);
    setValue("emailAddress", user.emailID);
    setValue("mobile", user.mobile);

    setValue("aflatBuildingNo", user.cflatBuildingNo);
    setValue("abuildingName", user.cbuildingName);
    setValue("aroadName", user.croadName);
    setValue("alandmark", user.clandmark);
    setValue("apincode", user.cpinCode);
    setValue("acityName", user.cCity);
    setValue("astate", user.cState);

    setValue("aflatBuildingNoMr", user.cflatBuildingNoMr);
    setValue("abuildingNameMr", user.cbuildingNameMr);
    setValue("aroadNameMr", user.croadNameMr);
    setValue("alandmarkMr", user.clandmarkMr);
    setValue("acityNameMr", user.cCityMr);
    setValue("astateMr", user.cStateMr);
    setValue("aemail", user.emailID);
    setValue("amobileNo", user.mobile);
  }, [user]);

  const getTitles = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setatitles(
          r.data.title.map((row) => ({
            id: row.id,
            atitle: row.title,
            // titlemr: row.titlemr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const [TitleMrs, setTitleMrs] = useState([]);
  const getTitleMr = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setTitleMrs(
          r.data.title.map((row) => ({
            id: row.id,
            atitlemr: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const handleApply = () => {
    let bodyForApi = {
      ...props.data,
      trnApplicantId: props.data.id,
      serviceId: 14,
      id: null,
      numberOfCopies: 1,
      createdUserId: user.id,
    };
    axios
      .post(
        `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/saveMarraigeBoardCertificate`,
        bodyForApi,
        {
          // ...props.data,
          // trnApplicantId: props.data.id,
          // serviceId: 14,
          // id: null,
          // numberOfCopies: 1,
          // createdUserId: user.id,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
        // allvalues,
      )
      .then((res) => {
        console.log("res000", res);
        if (res.status == 201) {
          console.log("iddddddd", res?.data?.message?.split("$")[1]);
          let iddd = res?.data?.message?.split("$")[1];
          console.log("iddd", iddd);
          swal(
            language == "en" ? "Saved!" : "जतन केले!",
            language == "en"
              ? "Record Saved successfully!"
              : "रेकॉर्ड यशस्वीरित्या जतन केले!",
            "success",
          );
          // swal("Success!", "Record Saved successfully !", "success");
          router.push({
            pathname:
              "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/PaymentCollection",
            // '/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection',
            query: {
              ...props.data,
              id: iddd,
              serviceId: 14,
              applicationId: iddd,
              applicationSide: "Citizen",
            },
          });
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getById = (id) => {
    if (id != null && id != undefined && id != "") {
      axios
        .get(
          `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/getapplicantById?applicationId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((r) => {
          console.log("r.data", r.data);

          let oldAppId = r.data.trnApplicantId;

          console.log(oldAppId, "oldAppId");

          let certificateIssueDateTime;

          axios
            .get(
              `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${oldAppId}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            )
            .then((re) => {
              certificateIssueDateTime = re.data.certificateIssueDateTime;
              setValue("registrationDate", re.data.certificateIssueDateTime);
              console.log("re.data", re.data);
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });

          reset(r.data);

          setValue("registrationDate", certificateIssueDateTime);

          // setFlagSearch(true);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    console.log("router?.query?.pageMode", router?.query?.pageMode);
    getById(router?.query?.applicationId);
  }, [router?.query?.pageMode == "View"]);
  const [areaDropDown, setAreaDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);

  useEffect(() => {
    !router.query.id && getZones();

    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAlll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setAreaDropDown(
          res.data?.map((j) => ({
            id: j?.area,
            zone: j?.zoneId,
            ward: j?.wardId,
            area: j?.areaId,
            areaDisplayNameEn:
              j?.areaName + " - " + j?.zoneName + " - " + j?.wardName,
            areaDisplayNameMr:
              j?.areaNameMr + " - " + j?.zoneNameMr + " - " + j?.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Get Zone
    router.query.id &&
      axios
        .get(`${urls.CFCURL}/master/zone/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setZoneDropDown(
            res.data.zone.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              zoneEn: j.zoneName,
              zoneMr: j.zoneNameMr,
            })),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });

    //Get Ward
    // router.query.id &&
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setWardDropDown(
          res.data.ward.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            wardEn: j.wardName,
            wardMr: j.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  const getZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) =>
        setZoneDropDown(
          res.data.map((zones) => ({
            id: zones.zoneId,
            zoneEn: zones.zoneName,
            zoneMr: zones.zoneNameMr,
          })),
        ),
      )
      .catch((error) => {
        {
          language == "en"
            ? sweetAlert("Error!", "Something went wrong", "error")
            : sweetAlert("त्रुटी!", "काहीतरी चूक झाली", "त्रुटी");
        }
        setLoader(false);
      });
  };
  const getWards = (zoneId) => {
    setLoader(true);
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
        {
          params: { zoneId },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        setWardDropDown(
          res.data.map((wards) => ({
            id: wards.wardId,
            wardEn: wards.wardName,
            wardMr: wards.wardNameMr,
          })),
        );
        setLoader(false);
      })
      .catch((error) => {
        {
          language == "en"
            ? sweetAlert("Error!", "Something went wrong", "error")
            : sweetAlert("त्रुटी!", "काहीतरी चूक झाली", "त्रुटी");
        }
        setLoader(false);
      });
  };

  const getAreas = (zoneId, wardId) => {
    setLoader(true);
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId`,
        {
          params: { zoneId, wardId },

          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        setAreaDropDown(
          res.data.map((areas) => ({
            zone: areas?.zoneId,
            ward: areas?.wardId,
            area: areas?.areaId,
            id: areas?.areaId,
            areaDisplayNameEn:
              areas?.areaName +
              " - " +
              areas?.zoneName +
              " - " +
              areas?.wardName,
            areaDisplayNameMr:
              areas?.areaNamemr +
              " - " +
              areas?.zoneNameMr +
              " - " +
              areas?.wardNameMr,
          })),
        );
        setLoader(false);
      })
      .catch((error) => {
        {
          language == "en"
            ? sweetAlert("Error!", "Something went wrong", "error")
            : sweetAlert("त्रुटी!", "काहीतरी चूक झाली", "त्रुटी");
        }
        setLoader(false);
      });
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 2,
            marginRight: 2,
            marginTop: 1,
            marginBottom: 2,
            padding: 1,
            border: 1,
            borderColor: "grey.500",
          }}
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.small}>
                  {!props.onlyDoc && (
                    <>
                      {/* <Paper
                        style={{
                          backgroundColor: "RGB(240, 240, 240)",
                        }}
                      >
                        <div className={styles.wardZone}>
                          <div>
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors.zoneKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="zone" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    //sx={{ width: 230 }}
                                    disabled
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      console.log(
                                        "Zone Key: ",
                                        value.target.value,
                                      );
                                      setTemp(value.target.value);
                                    }}
                                    label="Zone Name  "
                                  >
                                    {zoneKeys &&
                                      zoneKeys.map((zoneKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={zoneKey.id}
                                        >
                                         

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
                                {errors?.zoneKey
                                  ? errors.zoneKey.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </div>
                          <div className={styles.wardZone}>
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors.wardKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="ward" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Ward Name  "
                                  >
                                    {wardKeys &&
                                      wardKeys.map((wardKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={wardKey.id}
                                        >
                                         
                                          {language == "en"
                                            ? wardKey?.wardName
                                            : wardKey?.wardNameMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="wardKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.wardKey
                                  ? errors.wardKey.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </div>
                        </div>
                      </Paper> */}
                      <Grid
                        container
                        // xs={12}
                        // sm={12}
                        // md={12}
                        // style={{
                        //   display: "flex",
                        //   justifyContent: "center",
                        //   alignItems: "center",
                        // }}
                      >
                        {/* <AreaWardZoneMapping /> */}
                        <Grid
                          container
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            //   display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 1 }}
                              error={!!errors.areaKey}
                              disabled
                            >
                              <Controller
                                render={({ field }) => (
                                  <Autocomplete
                                    variant="standard"
                                    disabled
                                    sx={{
                                      width: "250px",
                                      ".mui-style-178bwih-MuiFormControl-root-MuiTextField-root":
                                        { marginTop: 0 },
                                    }}
                                    id="demo-autocomplete-standard"
                                    options={areaDropDown || []} // Make sure areaDropDown is an array or provide a default empty array if it can be null/undefined
                                    value={
                                      areaDropDown.find(
                                        (option) => option.area === field.value,
                                      ) || null
                                    } // Find the corresponding option based on field value
                                    onChange={(_, value) => {
                                      field.onChange(value ? value.area : ""); // Update field value with the selected option's area
                                      let tempObjForZoneAndWard =
                                        areaDropDown?.find(
                                          (j) => j?.area === value?.area,
                                        );
                                      getWards(tempObjForZoneAndWard?.zone);
                                      setValue(
                                        "zoneKey",
                                        tempObjForZoneAndWard?.zone,
                                      );
                                      setValue(
                                        "wardKey",
                                        tempObjForZoneAndWard?.ward,
                                      );
                                    }}
                                    getOptionLabel={(option) =>
                                      language === "en"
                                        ? option.areaDisplayNameEn
                                        : option.areaDisplayNameMr
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="standard"
                                        label={
                                          language != "en" ? "जागा" : "Area"
                                        }
                                      />
                                    )}
                                  />
                                )}
                                name="areaKey"
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </div>
                        </Grid>
                        <Grid
                          container
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            // display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <FormControl
                              disabled
                              variant="standard"
                              // error={!!error.zoneKey}
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
                                    onChange={(value) => {
                                      field.onChange(value);
                                      !router.query.id &&
                                        getWards(value.target.value);
                                      !router.query.id &&
                                        setValue("wardKey", "");
                                      !router.query.id &&
                                        setValue("areaKey", "");
                                    }}
                                    label="zoneKey"
                                  >
                                    {zoneDropDown &&
                                      zoneDropDown.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            //@ts-ignore
                                            value?.id
                                          }
                                        >
                                          {language == "en"
                                            ? //@ts-ignore
                                              value?.zoneEn
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
                                {/* {error?.zoneKey ? error.zoneKey.message : null} */}
                              </FormHelperText>
                            </FormControl>
                          </div>
                        </Grid>
                        <Grid
                          container
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            // display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <FormControl
                              disabled
                              variant="standard"
                              // error={!!error.wardKey}
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
                                    onChange={(value) => {
                                      field.onChange(value);
                                      !router.query.id &&
                                        getAreas(
                                          watch("zoneKey"),
                                          value.target.value,
                                        );
                                    }}
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
                                {/* {error?.wardKey ? error.wardKey.message : null} */}
                              </FormHelperText>
                            </FormControl>
                          </div>
                        </Grid>
                        <Grid
                          container
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          xl={3}
                          style={{
                            // display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <FormControl
                              sx={{
                                width: "230px",
                                marginTop: "7px",
                              }}
                              variant="standard"
                              error={!!errors.isPersonOrgansation}
                            >
                              {/* <FormControl> */}
                              <InputLabel>
                                {language == "en"
                                  ? "Board Type"
                                  : "बोर्ड प्रकार"}
                              </InputLabel>
                              <Controller
                                name="isPersonOrgansation"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <Select {...field} disabled>
                                    <MenuItem value={"individual"}>
                                      {language == "en"
                                        ? "Individual"
                                        : "वैयक्तीक "}
                                    </MenuItem>
                                    <MenuItem value={"organisation"}>
                                      {language == "en"
                                        ? "Organisation"
                                        : "विश्वस्त संस्था  "}
                                    </MenuItem>
                                    {/* <MenuItem value="option3">Option 4</MenuItem> */}
                                  </Select>
                                )}
                              />
                              <FormHelperText>
                                {errors?.isPersonOrgansation
                                  ? errors.isPersonOrgansation.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </div>
                        </Grid>
                      </Grid>

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            {<FormattedLabel id="applicantName" />}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row}>
                        {/* <div>
                          <FormControl
                            variant="standard"
                            error={!!errors.atitle}
                            sx={{ marginTop: 2 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titleInenglish" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Title  "
                                  id="demo-simple-select-standard"
                                  labelId="id='demo-simple-select-standard-label'"
                                >
                                  {atitles &&
                                    atitles.map((atitle, index) => (
                                      <MenuItem key={index} value={atitle.id}>
                                        {atitle.atitle}
                                      
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="atitle"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.atitle ? errors.atitle.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}

                        <div>
                          <TextField
                            disabled
                            // disabled={router?.query?.disabled}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="firstName" required />}
                            // label="First Name *"
                            variant="standard"
                            {...register("afName")}
                            error={!!errors.afName}
                            helperText={
                              errors?.afName ? errors.afName.message : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Middle Name *"
                            label={<FormattedLabel id="middleName" required />}
                            variant="standard"
                            {...register("amName")}
                            error={!!errors.amName}
                            helperText={
                              errors?.amName ? errors.amName.message : null
                            }
                          />
                        </div>
                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Last Name *"
                            label={<FormattedLabel id="lastName" required />}
                            variant="standard"
                            {...register("alName")}
                            error={!!errors.alName}
                            helperText={
                              errors?.alName ? errors.alName.message : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row}>
                        {/* <div>
                          <FormControl
                            variant="standard"
                            error={!!errors.atitlemr}
                            sx={{ marginTop: 2 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titleInmarathi" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Title  "
                                  id="demo-simple-select-standard"
                                  labelId="id='demo-simple-select-standard-label'"
                                >
                                  {TitleMrs &&
                                    TitleMrs.map((atitlemr, index) => (
                                      <MenuItem key={index} value={atitlemr.id}>
                                        {atitlemr.atitlemr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="atitlemr"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.atitlemr
                                ? errors.atitlemr.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="प्रथम नावं *"
                            label={<FormattedLabel id="firstNamemr" required />}
                            // label=" Hello"
                            variant="standard"
                            {...register("afNameMr")}
                            error={!!errors.afNameMr}
                            helperText={
                              errors?.afNameMr ? errors.afNameMr.message : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Middle Name *"
                            label={
                              <FormattedLabel id="middleNamemr" required />
                            }
                            // label="मधले नावं *"
                            variant="standard"
                            {...register("amNameMr")}
                            error={!!errors.amNameMr}
                            helperText={
                              errors?.amNameMr ? errors.amNameMr.message : null
                            }
                          />
                        </div>
                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Last Name *"
                            label={<FormattedLabel id="lastNamemr" required />}
                            // label="आडनाव *"
                            variant="standard"
                            {...register("alNameMr")}
                            error={!!errors.alNameMr}
                            helperText={
                              errors?.alNameMr ? errors.alNameMr.message : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            {<FormattedLabel id="Addrees" />}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="flatBuildingNo" required />
                            }
                            variant="standard"
                            {...register("aflatBuildingNo")}
                            error={!!errors.aflatBuildingNo}
                            helperText={
                              errors?.aflatBuildingNo
                                ? errors.aflatBuildingNo.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                            variant="standard"
                            {...register("abuildingName")}
                            error={!!errors.abuildingName}
                            helperText={
                              errors?.abuildingName
                                ? errors.abuildingName.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            {...register("aroadName")}
                            error={!!errors.aroadName}
                            helperText={
                              errors?.aroadName
                                ? errors.aroadName.message
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            {...register("alandmark")}
                            error={!!errors.alandmark}
                            helperText={
                              errors?.alandmark
                                ? errors.alandmark.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            {...register("acityName")}
                            error={!!errors.acityName}
                            helperText={
                              errors?.acityName
                                ? errors.acityName.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="State" required />}
                            variant="standard"
                            {...register("astate")}
                            error={!!errors.astate}
                            helperText={
                              errors?.astate ? errors.astate.message : null
                            }
                          />
                        </div>
                      </div>

                      {/* marathi Adress */}

                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="flatBuildingNomr" required />
                            }
                            variant="standard"
                            //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                            //  value={pflatBuildingNo}
                            // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                            {...register("aflatBuildingNoMr")}
                            error={!!errors.aflatBuildingNoMr}
                            helperText={
                              errors?.aflatBuildingNoMr
                                ? errors.aflatBuildingNoMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingNamemr" required />
                            }
                            variant="standard"
                            {...register("abuildingNameMr")}
                            error={!!errors.abuildingNameMr}
                            helperText={
                              errors?.abuildingNameMr
                                ? errors.abuildingNameMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            {...register("aroadNameMr")}
                            error={!!errors.aroadNameMr}
                            helperText={
                              errors?.aroadNameMr
                                ? errors.aroadNameMr.message
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            {...register("alandmarkMr")}
                            error={!!errors.alandmarkMr}
                            helperText={
                              errors?.alandmarkMr
                                ? errors.alandmarkMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            {...register("acityNameMr")}
                            error={!!errors.acityNameMr}
                            helperText={
                              errors?.acityNameMr
                                ? errors.acityNameMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="statemr" required />}
                            variant="standard"
                            {...register("astateMr")}
                            error={!!errors.astateMr}
                            helperText={
                              errors?.astateMr ? errors.astateMr.message : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            disabled
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="pincode" required />}
                            variant="standard"
                            {...register("apincode")}
                            error={!!errors.apincode}
                            helperText={
                              errors?.apincode ? errors.apincode.message : null
                            }
                          />
                        </div>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("amobileNo")}
                            error={!!errors.amobileNo}
                            helperText={
                              errors?.amobileNo
                                ? errors.amobileNo.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("aemail")}
                            error={!!errors.aemail}
                            helperText={
                              errors?.aemail ? errors.aemail.message : null
                            }
                          />
                        </div>
                      </div>

                      {/* owner details */}

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            {language == "en"
                              ? " Owner Details :"
                              : "मालक तपशील:"}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        {/* <div>
                          <FormControl
                            variant="standard"
                            error={!!errors.otitle}
                            sx={{ marginTop: 2 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titleInenglish" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Title  "
                                  id="demo-simple-select-standard"
                                  labelId="id='demo-simple-select-standard-label'"
                                >
                                  {atitles &&
                                    atitles.map((atitle, index) => (
                                      <MenuItem key={index} value={atitle.id}>
                                        {atitle.atitle}
                                       
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="otitle"
                              control={control}
                              // defaultValue={null}
                            />
                            <FormHelperText>
                              {errors?.otitle ? errors.otitle.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            // disabled={router?.query?.disabled}
                            disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="firstName" required />}
                            // label="First Name *"
                            variant="standard"
                            {...register("ofName")}
                            error={!!errors.ofName}
                            helperText={
                              errors?.ofName ? errors.ofName.message : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Middle Name *"
                            label={<FormattedLabel id="middleName" required />}
                            variant="standard"
                            {...register("omName")}
                            error={!!errors.omName}
                            helperText={
                              errors?.omName ? errors.omName.message : null
                            }
                          />
                        </div>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Last Name *"
                            label={<FormattedLabel id="lastName" required />}
                            variant="standard"
                            {...register("olName")}
                            error={!!errors.olName}
                            helperText={
                              errors?.olName ? errors.olName.message : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row}>
                        {/* <div>
                          <FormControl
                            variant="standard"
                            error={!!errors.otitlemr}
                            sx={{ marginTop: 2 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titleInmarathi" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Title  "
                                  id="demo-simple-select-standard"
                                  labelId="id='demo-simple-select-standard-label'"
                                >
                                  {TitleMrs &&
                                    TitleMrs.map((atitlemr, index) => (
                                      <MenuItem key={index} value={atitlemr.id}>
                                        {atitlemr.atitlemr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="otitlemr"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.otitlemr
                                ? errors.otitlemr.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="प्रथम नावं *"
                            label={<FormattedLabel id="firstNamemr" required />}
                            // label=" Hello"
                            variant="standard"
                            {...register("ofNameMr")}
                            error={!!errors.ofNameMr}
                            helperText={
                              errors?.ofNameMr ? errors.ofNameMr.message : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Middle Name *"
                            label={
                              <FormattedLabel id="middleNamemr" required />
                            }
                            // label="मधले नावं *"
                            variant="standard"
                            {...register("omNameMr")}
                            error={!!errors.omNameMr}
                            helperText={
                              errors?.omNameMr ? errors.omNameMr.message : null
                            }
                          />
                        </div>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Last Name *"
                            label={<FormattedLabel id="lastNamemr" required />}
                            // label="आडनाव *"
                            variant="standard"
                            {...register("olNameMr")}
                            error={!!errors.olNameMr}
                            helperText={
                              errors?.olNameMr ? errors.olNameMr.message : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            {language == "en"
                              ? " Owner Address:"
                              : "मालकाचा पत्ता:"}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="flatBuildingNo" required />
                            }
                            variant="standard"
                            //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                            //  value={pflatBuildingNo}
                            // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                            {...register("oflatBuildingNo")}
                            error={!!errors.oflatBuildingNo}
                            helperText={
                              errors?.oflatBuildingNo
                                ? errors.oflatBuildingNo.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                            variant="standard"
                            {...register("obuildingName")}
                            error={!!errors.obuildingName}
                            helperText={
                              errors?.obuildingName
                                ? errors.obuildingName.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            {...register("oroadName")}
                            error={!!errors.oroadName}
                            helperText={
                              errors?.oroadName
                                ? errors.oroadName.message
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            {...register("olandmark")}
                            error={!!errors.olandmark}
                            helperText={
                              errors?.olandmark
                                ? errors.olandmark.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            {...register("ocityName")}
                            error={!!errors.ocityName}
                            helperText={
                              errors?.ocityName
                                ? errors.ocityName.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="State" required />}
                            variant="standard"
                            {...register("ostate")}
                            error={!!errors.ostate}
                            helperText={
                              errors?.ostate ? errors.ostate.message : null
                            }
                          />
                        </div>
                      </div>

                      {/* marathi Adress */}

                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="flatBuildingNomr" required />
                            }
                            // label="फ्लॅट नंबर"
                            variant="standard"
                            //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                            //  value={pflatBuildingNo}
                            // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                            {...register("oflatBuildingNoMr")}
                            error={!!errors.oflatBuildingNoMr}
                            helperText={
                              errors?.oflatBuildingNoMr
                                ? errors.oflatBuildingNoMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingNamemr" required />
                            }
                            // label="अपार्टमेंट नाव"
                            variant="standard"
                            {...register("obuildingNameMr")}
                            error={!!errors.obuildingNameMr}
                            helperText={
                              errors?.obuildingNameMr
                                ? errors.obuildingNameMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            {...register("oroadNameMr")}
                            error={!!errors.oroadNameMr}
                            helperText={
                              errors?.oroadNameMr
                                ? errors.oroadNameMr.message
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            {...register("olandmarkMr")}
                            error={!!errors.olandmarkMr}
                            helperText={
                              errors?.olandmarkMr
                                ? errors.olandmarkMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            {...register("ocityNameMr")}
                            error={!!errors.ocityNameMr}
                            helperText={
                              errors?.ocityNameMr
                                ? errors.ocityNameMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="statemr" required />}
                            variant="standard"
                            {...register("ostateMr")}
                            error={!!errors.ostateMr}
                            helperText={
                              errors?.ostateMr ? errors.ostateMr.message : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="pincode" required />}
                            variant="standard"
                            {...register("opincode")}
                            error={!!errors.opincode}
                            helperText={
                              errors?.opincode ? errors.opincode.message : null
                            }
                          />
                        </div>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("omobileNo")}
                            error={!!errors.omobileNo}
                            helperText={
                              errors?.omobileNo
                                ? errors.omobileNo.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("oemail")}
                            error={!!errors.oemail}
                            helperText={
                              errors?.oemail ? errors.oemail.message : null
                            }
                          />
                        </div>
                      </div>
                      {/* </Paper> */}
                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            {<FormattedLabel id="boardDetail" />}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row2}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardName" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("marriageBoardName")}
                            error={!!errors.marriageBoardName}
                            helperText={
                              errors?.marriageBoardName
                                ? errors.marriageBoardName.message
                                : null
                            }
                          />
                        </div>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardNamemr" required />}
                            // label="विवाह मंडळचे नाव "
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("marriageBoardNameMr")}
                            error={!!errors.marriageBoardNameMr}
                            helperText={
                              errors?.marriageBoardNameMr
                                ? errors.marriageBoardNameMr.message
                                : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="flatBuildingNo" required />
                            }
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("bflatBuildingNo")}
                            error={!!errors.bflatBuildingNo}
                            helperText={
                              errors?.bflatBuildingNo
                                ? errors.bflatBuildingNo.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("bbuildingName")}
                            error={!!errors.bbuildingName}
                            helperText={
                              errors?.bbuildingName
                                ? errors.bbuildingName.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("broadName")}
                            error={!!errors.broadName}
                            helperText={
                              errors?.broadName
                                ? errors.broadName.message
                                : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("blandmark")}
                            error={!!errors.blandmark}
                            helperText={
                              errors?.blandmark
                                ? errors.blandmark.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("city")}
                            error={!!errors.city}
                            helperText={
                              errors?.city ? errors.city.message : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="pincode" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("bpincode")}
                            error={!!errors.bpincode}
                            helperText={
                              errors?.bpincode ? errors.bpincode.message : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="flatBuildingNomr" required />
                            }
                            // label="फ्लॅट नंबर"
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("bflatBuildingNoMr")}
                            error={!!errors.bflatBuildingNoMr}
                            helperText={
                              errors?.bflatBuildingNoMr
                                ? errors.bflatBuildingNoMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingNamemr" required />
                            }
                            // label="अपार्टमेंट नाव"
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("bbuildingNameMr")}
                            error={!!errors.bbuildingNameMr}
                            helperText={
                              errors?.bbuildingNameMr
                                ? errors.bbuildingNameMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("broadNameMr")}
                            error={!!errors.broadNameMr}
                            helperText={
                              errors?.broadNameMr
                                ? errors.broadNameMr.message
                                : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("blandmarkMr")}
                            error={!!errors.blandmarkMr}
                            helperText={
                              errors?.blandmarkMr
                                ? errors.blandmarkMr.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("cityMr")}
                            error={!!errors.cityMr}
                            helperText={
                              errors?.cityMr ? errors.cityMr.message : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="AadharNo" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("aadhaarNo")}
                            error={!!errors.aadhaarNo}
                            helperText={
                              errors?.aadhaarNo
                                ? errors.aadhaarNo.message
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="bLatitude" />}
                            // label={"Latitude"}
                            variant="standard"
                            inputProps={{ maxLength: 10 }}
                            // value={pageType ? router.query.bLatitude  : ''}
                            disabled
                            {...register("blatitude")}
                            error={!!errors.blatitude}
                            helperText={
                              errors?.blatitude
                                ? errors.blatitude.message
                                : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="bLongitude" />}
                            // label={"Longitude"}
                            variant="standard"
                            //  value={pageType ? router.query.bLongitude  : ''}
                            disabled
                            {...register("blongitude")}
                            error={!!errors.blongitude}
                            helperText={
                              errors?.blongitude
                                ? errors.blongitude.message
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("mobile")}
                            error={!!errors.mobile}
                            helperText={
                              errors?.mobile ? errors.mobile.message : null
                            }
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("emailAddress")}
                            error={!!errors.emailAddress}
                            helperText={
                              errors?.emailAddress
                                ? errors.emailAddress.message
                                : null
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className={styles.btn}>
                    {router?.query?.pageMode != "View" ? (
                      <>
                        <div className={styles.btn1}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                            onClick={handleApply}
                          >
                            {<FormattedLabel id="apply" />}
                          </Button>{" "}
                        </div>

                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            // disabled={validateSearch()}

                            onClick={() => {
                              const textAlert =
                                language == "en"
                                  ? "Are you sure you want to exit this Record ? "
                                  : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
                              const title =
                                language == "en" ? "Exit ! " : "बाहेर पडा!";
                              swal({
                                title: title,
                                text: textAlert,
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  language == "en"
                                    ? sweetAlert({
                                        title: "Exit!",
                                        text: "Record is Successfully Exit!!",
                                        icon: "success",
                                        button: "Ok",
                                      })
                                    : sweetAlert({
                                        title: "बाहेर पडा!",
                                        text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                                        icon: "success",
                                        button: "Ok",
                                      });
                                  router.push(
                                    "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration",
                                  );

                                  //   swal("Record is Successfully Exit!", {
                                  //     icon: "success",
                                  //   });
                                  //   handleExit();
                                } else {
                                  language == "en"
                                    ? sweetAlert({
                                        title: "Cancel!",
                                        text: "Record is Successfully Cancel!!",
                                        icon: "success",
                                        button: "Ok",
                                      })
                                    : sweetAlert({
                                        title: "रद्द केले!",
                                        text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                                        icon: "success",
                                        button: "ओके",
                                      });
                                }
                              });
                            }}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                          {/* <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            // onClick={() => exitButton()}
                            onClick={() => {
                              swal({
                                title: "Exit?",
                                text: "Are you sure you want to exit this Record ? ",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  swal("Record is Successfully Exit!", {
                                    icon: "success",
                                  });
                                  router.push(
                                    `/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration`,
                                  );
                                } else {
                                  swal("Record is Safe");
                                }
                              });
                            }}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button> */}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            // onClick={() => exitButton()}
                            onClick={() => {
                              swal({
                                title: "Exit?",
                                text: "Are you sure you want to exit this Record ? ",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  swal("Record is Successfully Exit!", {
                                    icon: "success",
                                  });
                                  router.push(
                                    `/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration`,
                                  );
                                } else {
                                  swal("Record is Safe");
                                }
                              });
                            }}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
