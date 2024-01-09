import { ThemeProvider } from "@emotion/react";
import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import styles from "../../../../../components/marriageRegistration/board.module.css";
import UploadButton from "../../../../../components/marriageRegistration/DocumentsUploadMB";
import boardschema from "../../../../../components/marriageRegistration/schema/boardschema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import urls from "../../../../../URLS/urls";

const Index = (props) => {
  let appName = "SP";
  let serviceName = "M-MBR";
  let applicationFrom = "online";
  const user = useSelector((state) => state?.user.user);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(boardschema),
    mode: "onChange",
    defaultValues: {
      id: null,
    },
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
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const router = useRouter();
  const [atitles, setatitles] = useState([]);
  const [pageMode, setPageMode] = useState(null);

  const [disable, setDisable] = useState(false);

  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  useEffect(() => {
    console.log("disabled", router.query.pageMode);
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setPageMode(null);
      console.log("enabled", router.query.pageMode);
    } else if (router.query.pageMode == "Check") {
      setDisable(true);
      setPageMode(router.query.pageMode);
    } else {
      setPageMode(router.query.pageMode);
      console.log("disabled", router.query.pageMode);
    }
  }, []);
  let pageType = false;

  useEffect(() => {
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "DOCUMENT CHECKLIST" ||
      router.query.pageMode == "Check" ||
      router.query.pageMode == "DOCUMENT CHECKLIST"
    ) {
      // reset(router.query)
      axios
        .get(
          `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((resp) => {
          console.log("viewEditMode", resp.data);
          reset(resp.data);

          setValue("atitlemr", resp.data.atitle);
          setValue("atitlemr", resp.data.atitle);
          setTemp(resp.data.zoneKey);
          // setValue('wardKey',resp.data.wardKey)
        })
        .catch((err) => {
          swal("Error!", "Somethings Wrong Record not Found!", "error");
        });
      // setFieldsDiabled(true)
    }
  }, []);

  // OnSubmit Form
  const onSubmitForm = (data) => {
    // const validityOfMarriageBoardRegistration = moment(
    //   data.validityOfMarriageBoardRegistration,
    //   'YYYY-MM-DD',
    // ).format('YYYY-MM-DD')

    console.log("jml ka", getValues("boardHeadPersonPhoto"));

    const bodyForApi = {
      ...data,
      createdUserId: user?.id,
      applicationFrom,
      serviceCharges: null,
      serviceId: 67,
      // validityOfMarriageBoardRegistration,
    };
    console.log("Final Data: ", bodyForApi);

    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(
          `${urls.MR}/transaction/marriageBoardRegistration/saveMarraigeBoardRegistration`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          bodyForApi
          // allvalues,
        )
        .then((res) => {
          if (res.status == 201) {
            swal("Saved!", "Record Saved successfully !", "success");
            axios
              .get(
                `${urls.MR}/transaction/marriageBoardRegistration/getApplicationByCitizen?citzenNo=${user?.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((resp) => {
                console.log("Save123", resp.data[0]);
                router.push({
                  pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
                  query: {
                    serviceId: 67,
                    id: res?.data?.message?.split("$")[1],
                  },
                });
              })
              .catch((err) => {
                swal("Error!", "Somethings Wrong!", "error");
              });
          }
        })
        .catch((err) => {
          swal("Error!", "Somethings Wrong Record not Saved!", "error");
        });
    } else if (router.query.pageMode === "Edit") {
      axios
        .post(
          `${urls.MR}/transaction/marriageBoardRegistration/saveMarraigeBoardRegistration`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          bodyForApi
        )
        .then((res) => {
          if (res.status == 201) {
            swal("Updated!", "Record Updated successfully !", "success");
          }
          router.push(`/marriageRegistration/transactions/boardRegistrations`);
        })
        .catch((err) => {
          swal("Error!", "Somethings Wrong Record not Updated!", "error");
        });
    }
  };

  //get by id

  useEffect(() => {
    // if (router.query.pageMode == 'Edit' || router.query.pageMode == 'View') {
    if (router.query.pageMode !== "Add" || router.query.pageMode !== "Edit") {
      if (router?.query?.id) {
        axios
          .get(
            `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((resp) => {
            console.log("board data", resp.data);
            reset(resp.data);
          })
          .catch((err) => {
            swal("Error!", "Somethings Wrong Record not Found!", "error");
          });
      }
    }
  }, []);
  //file upload

  const [fileName, setFileName] = useState(null);

  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  // zones
  const [temp, setTemp] = useState();
  // const [tempData, setTempData] = useState(props.photos)

  const [zoneKeys, setZoneKeys] = useState([]);
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong Zones not Found!", "error");
      });
  };

  // wardKeys
  const [wardKeys, setWardKeys] = useState([]);

  // getWardKeys
  const getWardKeys = () => {
    if (temp) {
      axios
        .get(
          `${
            urls.CFCURL
          }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${temp}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          setWardKeys(
            r.data.map((row) => ({
              id: row.id,
              wardName: row.wardName,
              wardNameMr: row.wardNameMr,
            }))
          );
        })
        .catch((err) => {
          // swal('Error!', 'Somethings Wrong Wards not Found!', 'error')
        });
    }
  };

  useEffect(() => {
    if (temp) getWardKeys();
  }, [temp]);
  // genders
  const [genderKeys, setgenderKeys] = useState([]);

  // getgenderKeys
  const getgenderKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setgenderKeys(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          }))
        );
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong Gender keys not Found!", "error");
      });
  };

  // const [document, setDocument] = useState([])

  // // getGAgeProofDocumentKey
  // const getDocumentKey = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/serviceWiseChecklist/getAll`)
  //     .then((r) => {
  //       setDocument(r.data.serviceWiseChecklist)
  //     })
  //     .catch((err) => {
  //       swal('Error!', 'Somethings Wrong Document keys not Found!', 'error')
  //     })
  // }

  useEffect(() => {
    getZoneKeys();
    getWardKeys();
    getgenderKeys();
    // getDocumentKey()
    getTitles();
    getTitleMr();
  }, [temp]);

  useEffect(() => {
    // if (router.query.pageMode === 'EDIT' || router.query.pageMode === 'View') {
    //   reset(router.query)
    // }
    console.log("user123", user);
    setValue("atitle", user.title);
    setValue("atitlemr", user.title);
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
    setValue("acityName", user.ccity);
    // setValue('astate', user.cState)

    setValue("aflatBuildingNoMr", user.cflatBuildingNoMr);
    setValue("abuildingNameMr", user.cbuildingNameMr);
    setValue("aroadNameMr", user.croadNameMr);
    setValue("alandmarkMr", user.clandmarkMr);
    setValue("acityNameMr", user.ccityMr);
    // setValue('astateMr', user.cStateMr)
    setValue("aemail", user.emailID);
    setValue("amobileNo", user.mobile);
  }, [user]);

  const getTitles = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setatitles(
          r.data.title.map((row) => ({
            id: row.id,
            atitle: row.title,
            // titlemr: row.titlemr,
          }))
        );
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong Titles not Found!", "error");
      });
  };
  const [TitleMrs, setTitleMrs] = useState([]);
  const getTitleMr = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setTitleMrs(
          r.data.title.map((row) => ({
            id: row.id,
            atitlemr: row.titleMr,
          }))
        );
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong Titles not Found!", "error");
      });
  };

  // Address Change
  const addressChange = (e) => {
    if (e.target.checked) {
      console.log("otitle", getValues("atitle"));
      setValue("otitle", getValues("atitle"));
      console.log("otitle1", watch("otitle"));

      setValue("ofName", getValues("afName"));
      setValue("omName", getValues("amName"));
      setValue("olName", getValues("alName"));

      setValue("otitlemr", getValues("atitlemr"));
      setValue("ofNameMr", getValues("afNameMr"));
      setValue("omNameMr", getValues("amNameMr"));
      setValue("olNameMr", getValues("alNameMr"));

      setValue("oflatBuildingNo", getValues("aflatBuildingNo"));
      setValue("obuildingName", getValues("abuildingName"));
      setValue("oroadName", getValues("aroadName"));
      setValue("olandmark", getValues("alandmark"));
      setValue("ocityName", getValues("acityName"));
      setValue("ostate", getValues("astate"));
      setValue("opincode", getValues("apincode"));
      setValue("omobileNo", getValues("amobileNo"));
      setValue("oemail", getValues("aemail"));

      setValue("oflatBuildingNoMr", getValues("aflatBuildingNoMr"));
      setValue("obuildingNameMr", getValues("abuildingNameMr"));
      setValue("oroadNameMr", getValues("aroadNameMr"));
      setValue("olandmarkMr", getValues("alandmarkMr"));
      setValue("ocityNameMr", getValues("acityNameMr"));
      setValue("ostateMr", getValues("astateMr"));
      setTemp(true);
    } else {
      setValue("otitle", null);
      // setValue('otitle', null)
      setValue("ofName", "");
      setValue("omName", "");
      setValue("olName", "");

      setValue("otitlemr", "");
      setValue("ofNameMr", "");
      setValue("omNameMr", "");
      setValue("olNameMr", "");

      setValue("oflatBuildingNo", "");
      setValue("obuildingName", "");
      setValue("oroadName", "");
      setValue("olandmark", "");
      setValue("ocityName", "");
      setValue("ostate", "");
      setValue("opincode", "");
      setValue("omobileNo", "");
      setValue("oemail", "");

      setValue("oflatBuildingNoMr", "");
      setValue("obuildingNameMr", "");
      setValue("oroadNameMr", "");
      setValue("olandmarkMr", "");
      setValue("ocityNameMr", "");
      setValue("ostateMr", "");
      setTemp();
    }
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
                      <Paper
                        style={{
                          backgroundColor: "RGB(240, 240, 240)",
                        }}
                      >
                        <div
                          className={styles.wardZone}
                          style={{ alignItems: "center" }}
                        >
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
                                    disabled={disable}
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      console.log(
                                        "Zone Key: ",
                                        value.target.value
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
                                    disabled={disable}
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
                                          {/* {wardKey.wardKey} */}
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
                      </Paper>

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
                        <div>
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
                                  // disabled
                                  disabled={disable}
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
                                        {/* {language == 'en'
                                        ? atitle?.title
                                        : atitle?.titleMr} */}
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
                        </div>

                        <div>
                          <TextField
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            // disabled
                            disabled={disable}
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
                        <div>
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
                                  // disabled
                                  disabled={disable}
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
                        </div>

                        <div>
                          <TextField
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            // disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            defaultValue="Maharashtra"
                            //  disabled
                            disabled={disable}
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
                            disabled={disable}
                            sx={{ width: 250 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            defaultValue="महाराष्ट्र"
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // value={pageType ? router.query.mobile : ''}
                            // disabled={router.query.pageMode === 'View'}
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
                            disabled={disable}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            //  value={pageType ? router.query.emailAddress : ''}
                            // disabled={router.query.pageMode === 'View'}
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
                            {<FormattedLabel id="OwnerDetails" />}
                            {/* Owner Details : */}
                          </h3>
                        </div>
                      </div>

                      {!disable ? (
                        <div style={{ marginLeft: "25px" }}>
                          <FormControlLabel
                            // disabled={
                            //   getValues('addressCheckBoxB') ||
                            //   router?.query?.pageMode === 'View' ||
                            //   router?.query?.pageMode === 'Edit'
                            // }
                            control={<Checkbox />}
                            label=<Typography>
                              <b>
                                {" "}
                                <FormattedLabel id="OwnerChkeck" />
                              </b>
                            </Typography>
                            {...register("addressCheckBoxG")}
                            onChange={(e) => {
                              addressChange(e);
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <div className={styles.row}>
                        <div>
                          <FormControl
                            variant="standard"
                            error={!!errors.otitle}
                            sx={{ marginTop: 2 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="title1" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
                                  disabled={disable}
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
                                        {/* {language == 'en'
                                        ? otitle?.title
                                        : otitle?.titleMr} */}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="otitle"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.otitle ? errors.otitle.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            // disabled
                            disabled={disable}
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
                        <div>
                          <FormControl
                            variant="standard"
                            error={!!errors.otitlemr}
                            sx={{ marginTop: 2 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titlemr" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
                                  disabled={disable}
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
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            // disabled
                            disabled={disable}
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
                            {<FormattedLabel id="Owneraddress" />}
                            {/* Owner Address: */}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            disabled={disable}
                            defaultValue="Maharashtra"
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            //  disabled
                            disabled={disable}
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
                            disabled={disable}
                            defaultValue="महाराष्ट्र"
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
                            //  disabled
                            disabled={disable}
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
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // value={pageType ? router.query.mobile : ''}
                            // disabled={router.query.pageMode === 'View'}
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
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            //  value={pageType ? router.query.emailAddress : ''}
                            // disabled={router.query.pageMode === 'View'}
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
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardName" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
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
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardNamemr" required />}
                            // label="विवाह मंडळचे नाव "
                            variant="standard"
                            // value={pageType ? router.query.marriageBoardName : ''}
                            // disabled={router.query.pageMode === 'View'}
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
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="flatBuildingNo" required />
                            }
                            variant="standard"
                            //value={pageType ? router.query.flatBuildingNo : ''}
                            // disabled={router.query.pageMode === 'View'}
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
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                            variant="standard"
                            // value={pageType ? router.query.buildingName : ''}
                            // disabled={router.query.pageMode === 'View'}
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
                            disabled={disable}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            // value={pageType ? router.query.roadName : ''}
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
                            // value={pageType ? router.query.landmark : ''}
                            disabled={disable}
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
                            //   value={pageType ? router.query.city : ''}
                            disabled={disable}
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
                            //  value={pageType ? router.query.pincode : ''}
                            disabled={disable}
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
                            //value={pageType ? router.query.flatBuildingNo : ''}
                            disabled={disable}
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
                            // value={pageType ? router.query.buildingName : ''}
                            disabled={disable}
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
                            // value={pageType ? router.query.roadName : ''}
                            disabled={disable}
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
                            // value={pageType ? router.query.landmark : ''}
                            disabled={disable}
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
                            //   value={pageType ? router.query.city : ''}
                            disabled={disable}
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
                            // value={pageType ? router.query.aadhaarNo : ''}
                            disabled={disable}
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
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // value={pageType ? router.query.mobile : ''}
                            disabled={disable}
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
                            //  value={pageType ? router.query.emailAddress : ''}
                            disabled={disable}
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
                  {/* //doc start */}
                  {!props.preview && (
                    <>
                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            {/* Document Tab : */}
                            {<FormattedLabel id="document" />}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div style={{ marginTop: "20px" }}>
                          <Typography>pasport photo</Typography>
                          {/* <Typography> {<FormattedLabel id="boardheadphoto" required />}</Typography> */}

                          <UploadButton
                            error={!!errors?.boardHeadPersonPhoto}
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("boardHeadPersonPhoto")}
                            fileKey={"boardHeadPersonPhoto"}
                            showDel={pageMode ? false : true}
                          />
                          <FormHelperText
                            error={!!errors?.boardHeadPersonPhoto}
                          >
                            {errors?.boardHeadPersonPhoto
                              ? errors?.boardHeadPersonPhoto?.message
                              : null}
                          </FormHelperText>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                          <Typography>
                            {" "}
                            {<FormattedLabel id="adharcard" required />}
                          </Typography>

                          <UploadButton
                            error={!!errors?.aadharCard}
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("aadharCard")}
                            fileKey={"aadharCard"}
                            showDel={pageMode ? false : true}

                            // showDel={true}
                          />
                          <FormHelperText error={!!errors?.aadharCard}>
                            {errors?.aadharCard
                              ? errors?.aadharCard?.message
                              : null}
                          </FormHelperText>
                        </div>
                      </div>
                    </>
                  )}

                  {!props.preview && !props.onlyDoc && (
                    <>
                      <div className={styles.btn}>
                        {/* <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                            onClick={formPreviewDailogOpen}
                          >
                            preview
                          </Button>{" "}
                        </div> */}

                        <div className={styles.btn1}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {<FormattedLabel id="save" />}
                          </Button>{" "}
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            {<FormattedLabel id="clear" />}
                          </Button>
                        </div>
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
                                  router.push(`/dashboard`);
                                } else {
                                  swal("Record is Safe");
                                }
                              });
                            }}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  <>
                    {/** Dailog */}
                    {/* <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={formPreviewDailog}
                      onClose={() => formPreviewDailogClose()}
                    >
                      <CssBaseline />
                      <DialogTitle>
                        <Grid container>
                          <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                            Preview
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sm={2}
                            md={4}
                            lg={6}
                            xl={6}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <IconButton
                              aria-label="delete"
                              sx={{
                                marginLeft: "530px",
                                backgroundColor: "primary",
                                ":hover": {
                                  bgcolor: "red", // theme.palette.primary.main
                                  color: "white",
                                },
                              }}
                            >
                              <CloseIcon
                                sx={{
                                  color: "black",
                                }}
                                onClick={() => {
                                  formPreviewDailogClose();
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </DialogTitle>
                      <DialogContent>
                        <>
                          <ThemeProvider theme={theme}>
                            <FormProvider {...methods}>
                              <form>
                                <BoardRegistration preview={true} />
                              </form>
                            </FormProvider>
                          </ThemeProvider>
                        </>
                      </DialogContent>

                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            variant="contained"
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
                                  formPreviewDailogClose();
                                } else {
                                  swal("Record is Safe");
                                }
                              });
                            }}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog> */}
                  </>
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
