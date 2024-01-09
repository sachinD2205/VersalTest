import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Box,
  Slide,
  FormLabel,
  Checkbox,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import hutMemberSchema from "../../../../containers/schema/slumManagementSchema/hutMemberSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const methods = useForm({ resolver: yupResolver(hutMemberSchema) });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const [genderDetails, setGender] = useState([]);
  const [religionDetails, setReligion] = useState([]);
  const [titles, setTitles] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const router = useRouter();
  const [casteDetails, setCasteDetails] = useState();
  const [casteCategoryDetails, setCasteCategoryDetails] = useState();
  const [educationDetails, setEducationDetails] = useState([]);
  const [relationDetails, setRelationDetails] = useState([]);
  const [isHeadOfFamily, setIsCheckedheadOfFamily] = useState(false);
  const [isHandicap, setIsCheckedHandicap] = useState(false);
  const [isWidow, setIsCheckedWidow] = useState(false);

  useEffect(() => {
    getTitles();
    getGender();
    getReligion();
    getEducationDetails();
    getRelationDetails();
  }, []);

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      getHutMaster(router.query.id);
    }
  }, [router.query.id]);

  useEffect(() => {
    getHutMember();
    getCastCategory();
  }, []);

  useEffect(() => {
    if (
      watch("castCategoryKey") != undefined &&
      watch("castCategoryKey") != null &&
      watch("castCategoryKey") != ""
    ) {
      getCastFromReligion();
    }
  }, [watch("castCategoryKey")]);

  const validateHeadOfFamily = () => {
    let res =
      dataSource && dataSource.find((each) => each.headOfFamily === "Y");
    if (res && (btnSaveText === "Save" || btnSaveText === "Update")) {
      return true;
    } else {
      return false;
    }
  };

  const getGender = () => {
    axios
      .get(`${urls.SLUMURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setGender(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getCastCategory = () => {
    axios
      .get(`${urls.CFCURL}/castCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setCasteCategoryDetails(
          r.data.castCategory.map((row) => ({
            id: row.id,
            casteCategory: row.castCategory,
            casteCategoryMr: row.castCategoryMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };
  const getCastFromReligion = () => {
    axios
      .get(
        `${
          urls.CFCURL
        }/master/cast/getCastByCastCategory?casteCategoryId=${watch(
          "castCategoryKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((r) => {
        setCasteDetails(
          r.data.mCast.map((row) => ({
            id: row.id,
            cast: row.cast,
            castMr: row.castMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getEducationDetails = () => {
    axios
      .get(`${urls.SLUMURL}/mstEducationCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setEducationDetails(
          r.data.mstEducationCategoryList.map((row) => ({
            id: row.id,
            educationCategory: row.educationCategory,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getRelationDetails = () => {
    axios
      .get(`${urls.SLUMURL}/mstRelation/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setRelationDetails(
          r.data.mstRelationDao?.map((row) => ({
            id: row.id,
            relation: row.relation,
            relationMr: row.relationMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setTitles(
          r.data.title.map((row) => ({
            id: row.id,
            title: row.title,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getReligion = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setReligion(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getHutMember = (_pageSize = 10, _pageNo = 0) => {
    if (router.query.id != undefined) {
      setIsLoading(true);
      axios
        .get(
          `${urls.SLUMURL}/mstHutMembers/getHutMemberFromHutKey?id=${router.query.id}`,
          {
            params: {
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res, i) => {
          setIsLoading(false);
          let result = res.data.mstHutMembersList;
        
          setDataSource(result);
          setIsCheckedheadOfFamily(res.headOfFamily === "Y" ? true : false);
          setTotalElements(res.data.totalElements);
          setPageSize(res.data.pageSize);
          setPageNo(res.data.pageNo);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
    
      swal({
        title: language === "en" ? "Deactivate?" : "निष्क्रिय?",
        text:
          language === "en"
            ? "Are you sure you want to deactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
       
        if (willDelete === true) {
          setIsLoading(true);
          axios
            .post(`${urls.SLUMURL}/mstHutMembers/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              setIsLoading(false);
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                ).then((will) => {
                  if (will) {
                    getHutMember();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          setIsLoading(false);
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
    
      swal({
        text:
          language === "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        
        if (willDelete === true) {
          setIsLoading(true);
          axios
            .post(`${urls.SLUMURL}/mstHutMembers/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              setIsLoading(false);
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय झाले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                ).then((will) => {
                  if (will) {
                    getHutMember();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          setIsLoading(false);
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    }
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setIsCheckedheadOfFamily(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };

  const onSubmitForm = (formData) => {
    setIsLoading(true);
    const finalBodyForApi = {
      ...formData,
      hutKey: Number(router.query.id),
      dateOfBirth: formData.dateOfBirth
        ? moment(formData.dateOfBirth).format("YYYY-MM-DDT00:00:00")
        : null,
      headOfFamily: isHeadOfFamily === true ? "Y" : "N",
      relationKey: Number(formData.relationKey),
      religionKey: Number(formData.religionKey),
      title: Number(formData.title),
      casteKey: Number(formData.casteKey),
      castCategoryKey:Number(formData.castCategoryKey),
      educationKey: Number(formData.educationKey),
      genderKey: Number(formData.genderKey),
      age: Number(formData.age),
      isHandicap: isHandicap,
      isWidow: isWidow,
    };
    axios
      .post(`${urls.SLUMURL}/mstHutMembers/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          formData.id
            ? res.data.status === "DUPLICATE"
              ? sweetAlert(
                  language === "en"
                    ? "Not valid for ownership !"
                    : "मालकीसाठी वैध नाही!",
                  language === "en"
                    ? "User with this aadhaar number have already ownership!"
                    : "हा आधार क्रमांक असलेल्या वापरकर्त्याकडे आधीपासूनच मालकी आहे!",
                  "error",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
              : sweetAlert(
                  language === "en" ? "Updated!" : "अद्ययावत केले!",
                  language === "en"
                    ? "Record Updated Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
            : res.data.status === "DUPLICATE"
            ? sweetAlert(
                language === "en"
                  ? "Not valid for ownership !"
                  : "मालकीसाठी वैध नाही!",
                language === "en"
                  ? "User with this aadhaar number have already ownership!"
                  : "हा आधार क्रमांक असलेल्या वापरकर्त्याकडे आधीपासूनच मालकी आहे!",
                "error",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              )
            : sweetAlert(
                language === "en" ? "Saved!" : "जतन केले!",
                language === "en"
                  ? "Record Saved Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  getHutMember();
                  setButtonInputState(false);
                }
              });
          if (res.data.status != "DUPLICATE") {
            setIsOpenCollapse(false);
          }
          setEditButtonInputState(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getHutMaster = (id) => {
    if (id) {
      axios
        .get(`${urls.SLUMURL}/mstHut/getById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res, i) => {
          setValue("hutNo", res.data.hutNo);
          setValue("totalFamilyMembers", res.data.totalFamilyMembers);
          setValue("maleCount", res.data.maleCount);
          setValue("femaleCount", res.data.femaleCount);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const resetValuesExit = {
    hutKey: "",
    headOfFamily: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    aadharNo: "",
    mobileNo: "",
    age: "",
    genderKey: "",
    religionKey: "",
    casteKey: "",
    // subCasteKey: "",
    educationKey: "",
  };

  const cancellButton = () => {
    setIsCheckedheadOfFamily(false);
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    hutKey: "",
    headOfFamily: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    firstNameMr: "",
    middleNameMr: "",
    lastNameMr: "",
    aadharNo: "",
    mobileNo: "",
    age: "",
    genderKey: "",
    religionKey: "",
    casteKey: "",
    // subCasteKey: "",
    educationKey: "",
    relationKey:null,
    castCategoryKey:null,
    email:'',
    dateOfBirth:null,
    
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "firstName" : "firstNameMr",
      headerName: <FormattedLabel id="firstName" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },

    {
      field: language == "en" ? "middleName" : "middleNameMr",
      headerName: <FormattedLabel id="middleName" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },

    {
      field: language == "en" ? "lastName" : "lastNameMr",
      headerName: <FormattedLabel id="lastName" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "aadharNo",
      headerName: <FormattedLabel id="aadharNo" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
    },
    {
      field: "mobileNo",
      headerName: <FormattedLabel id="mobileNo" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
    },
    {
      field: "age",
      headerName: <FormattedLabel id="age" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "headOfFamily",
      headerName: <FormattedLabel id="headOfFamily" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setIsCheckedheadOfFamily(
                  params.row.headOfFamily === "Y" ? true : false
                );
                reset(params.row);
                params.row.isHandicap
                  ? setIsCheckedHandicap(true)
                  : setIsCheckedHandicap(false);
                params.row.isWidow
                  ? setIsCheckedWidow(true)
                  : setIsCheckedWidow(false);
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {/* <>
        <BreadcrumbComponent />
      </> */}
      {/* <div
        style={{
     
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,

        }}
      >
        <FormattedLabel id='hutMember' />
      </div> */}
      {isLoading && <CommonLoader />}
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
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="hutDetails" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              multiline
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "90%" }}
              label={<FormattedLabel id="hutNo" />}
              // @ts-ignore
              variant="standard"
              value={watch("hutNo")}
              InputLabelProps={{
                shrink: router.query.id || watch("hutNo") ? true : false,
              }}
              error={!!errors.hutNo}
              helperText={errors?.hutNo ? errors.hutNo.message : null}
            />
          </Grid>

          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              multiline
              disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              sx={{ width: "90%" }}
              label={<FormattedLabel id="totalFamilyMembers" />}
              // @ts-ignore
              value={watch("totalFamilyMembers")}
              InputLabelProps={{
                shrink:
                  router.query.id || watch("totalFamilyMembers") ? true : false,
              }}
              error={!!errors.totalFamilyMembers}
              helperText={
                errors?.totalFamilyMembers
                  ? errors.totalFamilyMembers.message
                  : null
              }
            />
          </Grid>

          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              multiline
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "90%" }}
              variant="standard"
              label={<FormattedLabel id="maleCount" />}
              // @ts-ignore
              value={watch("maleCount")}
              InputLabelProps={{
                shrink: router.query.id || watch("maleCount") ? true : false,
              }}
              error={!!errors.maleCount}
              helperText={errors?.maleCount ? errors.maleCount.message : null}
            />
          </Grid>

          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              multiline
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "90%" }}
              label={<FormattedLabel id="femaleCount" />}
              // @ts-ignore
              variant="standard"
              value={watch("femaleCount")}
              InputLabelProps={{
                shrink: router.query.id || watch("femaleCount") ? true : false,
              }}
              error={!!errors.femaleCount}
              helperText={
                errors?.femaleCount ? errors.femaleCount.message : null
              }
            />
          </Grid>
        </Grid>

        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={12}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="hutMember" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        {isOpenCollapse && (
          <FormProvider {...methods}>
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container spacing={2} style={{ padding: "1rem" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.title}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        // disabled={isDisabled}
                      >
                        <FormattedLabel id="title" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          >
                            {titles &&
                              titles.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {value?.title}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="title"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.title ? errors.title.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                      size="small"
                     sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="firstName" />}
                      variant="standard"
                      {...register("firstName")}
                      error={!!errors.firstName}
                      helperText={errors?.firstName ? errors.firstName.message : null}
                    /> */}
                    <Transliteration
                      variant={"standard"}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      _key={"firstName"}
                      labelName={"firstName"}
                      fieldName={"firstName"}
                      updateFieldName={"firstNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="firstName" required />}
                      error={!!errors.firstName}
                      helperText={
                        errors?.firstName ? errors.firstName.message : null
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                      size="small"
                     sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="middleName" />}
                      variant="standard"
                      {...register("middleName")}
                      error={!!errors.middleName}
                      helperText={
                        errors?.middleName ? errors.middleName.message : null
                      }
                    /> */}
                    <Transliteration
                      variant={"standard"}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      _key={"middleName"}
                      labelName={"middleName"}
                      fieldName={"middleName"}
                      updateFieldName={"middleNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="middleName" required />}
                      error={!!errors.middleName}
                      helperText={
                        errors?.middleName ? errors.middleName.message : null
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <TextField
                      size="small"
                     sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="lastName" />}
                      variant="standard"
                      {...register("lastName")}
                      error={!!errors.lastName}
                      helperText={
                        errors?.lastName ? errors.lastName.message : null
                      }
                    /> */}

                    <Transliteration
                      variant={"standard"}
                      _key={"lastName"}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelName={"lastName"}
                      fieldName={"lastName"}
                      updateFieldName={"lastNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="lastName" required />}
                      error={!!errors.lastName}
                      helperText={
                        errors?.lastName ? errors.lastName.message : null
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
                    }}
                  >
                    {/* <TextField
                      size="small"
                     sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="proposedOwnerFirstNameMr" />}
                      variant="standard"
                      {...register("firstNameMr")}
                      error={!!errors.firstNameMr}
                      helperText={errors?.firstNameMr ? errors.firstNameMr.message : null}
                    /> */}

                    <Transliteration
                      variant={"standard"}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      _key={"firstNameMr"}
                      labelName={"firstNameMr"}
                      fieldName={"firstNameMr"}
                      updateFieldName={"firstName"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={
                        <FormattedLabel
                          id="proposedOwnerFirstNameMr"
                          required
                        />
                      }
                      error={!!errors.firstNameMr}
                      helperText={
                        errors?.firstNameMr ? errors.firstNameMr.message : null
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
                    }}
                  >
                    {/* <TextField
                      size="small"
                     sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="proposedOwnerMiddleNameMr" />}
                      variant="standard"
                      {...register("middleNameMr")}
                      error={!!errors.middleNameMr}
                      helperText={
                        errors?.middleNameMr
                          ? errors.middleNameMr.message
                          : null
                      }
                    /> */}

                    <Transliteration
                      variant={"standard"}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      _key={"middleNameMr"}
                      labelName={"middleNameMr"}
                      fieldName={"middleNameMr"}
                      updateFieldName={"middleName"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={
                        <FormattedLabel
                          id="proposedOwnerMiddleNameMr"
                          required
                        />
                      }
                      error={!!errors.middleNameMr}
                      helperText={
                        errors?.middleNameMr
                          ? errors.middleNameMr.message
                          : null
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
                    }}
                  >
                    {/* <TextField
                      size="small"
                     sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="proposedOwnerLastNameMr" />}
                      variant="standard"
                      {...register("lastNameMr")}
                      error={!!errors.lastNameMr}
                      helperText={
                        errors?.lastNameMr ? errors.lastNameMr.message : null
                      }
                    /> */}

                    <Transliteration
                      variant={"standard"}
                      _key={"lastNameMr"}
                      labelName={"lastNameMr"}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      fieldName={"lastNameMr"}
                      updateFieldName={"lastName"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={
                        <FormattedLabel id="proposedOwnerLastNameMr" required />
                      }
                      error={!!errors.lastNameMr}
                      helperText={
                        errors?.lastNameMr ? errors.lastNameMr.message : null
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
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      inputProps={{ maxLength: 12 }}
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="aadharNo" />}
                      variant="standard"
                      {...register("aadharNo")}
                      error={!!errors.aadharNo}
                      helperText={
                        errors?.aadharNo ? errors.aadharNo.message : null
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
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC ID"
                      label={<FormattedLabel id="mobileNo" />}
                      variant="standard"
                      inputProps={{ maxLength: 10 }}
                      {...register("mobileNo")}
                      error={!!errors.mobileNo}
                      helperText={
                        errors?.mobileNo ? errors.mobileNo.message : null
                      }
                    />
                  </Grid>

                  {/* Date of Birth */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.dateOfBirth}
                    >
                      <Controller
                        control={control}
                        name="dateOfBirth"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              disabled={router?.query?.pageMode === "View"}
                              inputFormat="DD/MM/YYYY"
                              disableFuture
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="BirthDate" />}
                                </span>
                              }
                              value={field.value}
                              // onChange={(date) => field.onChange(date)}
                              onChange={(date) => {
                                const selectedDate = moment(date);
                                setValue(
                                  "age",
                                  moment().diff(selectedDate, "years") != "NaN"
                                    ? moment().diff(selectedDate, "years")
                                    : "-"
                                );
                                field.onChange(date);
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
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
                        {errors?.dateOfBirth
                          ? errors.dateOfBirth.message
                          : null}
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
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      type="number"
                      // label="CFC ID"
                      disabled={watch("dob")}
                      label={<FormattedLabel id="age" required />}
                      variant="standard"
                      {...register("age")}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink: watch("age"),
                        //true
                        // shrink:
                        //   (age != "" ? true : false) ||
                        //   (router.query.gisId ? true : false),
                      }}
                      // value={age}
                      // disabled
                      error={!!errors.age}
                      helperText={errors?.age ? errors.age.message : null}
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
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC ID"
                      label={<FormattedLabel id="email" />}
                      variant="standard"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors?.email ? errors.email.message : null}
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
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC ID"
                      label={<FormattedLabel id="occupation" />}
                      variant="standard"
                      {...register("occupation")}
                      error={!!errors.occupation}
                      helperText={
                        errors?.occupation ? errors.occupation.message : null
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
                    }}
                  >
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.genderKey}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        // disabled={isDisabled}
                      >
                        <FormattedLabel id="genderKey" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          >
                            {genderDetails &&
                              genderDetails.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {value?.gender}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="genderKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.genderKey ? errors.genderKey.message : null}
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
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.religionKey}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        // disabled={isDisabled}
                      >
                        <FormattedLabel id="religionKey" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {religionDetails &&
                              religionDetails.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {value?.religion}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="religionKey"
                        control={control}
                        defaultValue={null}
                      />
                      <FormHelperText>
                        {errors?.religionKey
                          ? errors.religionKey.message
                          : null}
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
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.castCategoryKey}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        // disabled={isDisabled}
                      >
                        <FormattedLabel id="castCategory" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {casteCategoryDetails &&
                              casteCategoryDetails.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {value?.casteCategory}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="castCategoryKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.castCategoryKey
                          ? errors.castCategoryKey.message
                          : null}
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
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.casteKey}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        // disabled={isDisabled}
                      >
                        <FormattedLabel id="casteKey" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {casteDetails &&
                              casteDetails.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {value?.cast}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="casteKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.casteKey ? errors.casteKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

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
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.subCasteKey}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        // disabled={isDisabled}
                      >
                        <FormattedLabel id="subCasteKey" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {subCastDetails &&
                              subCastDetails.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {value?.subCast}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="subCasteKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.subCasteKey
                          ? errors.subCasteKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
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
                    }}
                  >
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.educationKey}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        // disabled={isDisabled}
                      >
                        <FormattedLabel id="educationKey" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {educationDetails &&
                              educationDetails.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {value?.educationCategory}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="educationKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.educationKey
                          ? errors.educationKey.message
                          : null}
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
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.relationKey}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        // disabled={isDisabled}
                      >
                        <FormattedLabel id="relation" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {relationDetails &&
                              relationDetails.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {language == "en"
                                    ? value.relation
                                    : value?.relationMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="relationKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.relationKey
                          ? errors.relationKey.message
                          : null}
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
                    <FormLabel
                      id="demo-controlled-radio-buttons-group"
                      // style={{ minWidth: "230px" }}
                    >
                      <FormattedLabel id="headOfFamily" />
                      <Checkbox
                        value={isHeadOfFamily}
                        disabled={validateHeadOfFamily()}
                        checked={isHeadOfFamily}
                        onChange={() => {
                          setIsCheckedheadOfFamily(!isHeadOfFamily);
                          // if (!isHeadOfFamily && watch("aadharNo")) {
                          //   checkAdhar(watch("aadharNo"));
                          // }
                        }}
                        error={validateHeadOfFamily()}
                      />
                      <FormHelperText>
                        {validateHeadOfFamily() ? (
                          <p style={{ color: "red" }}>
                            Head of Family is already available
                          </p>
                        ) : null}
                      </FormHelperText>
                    </FormLabel>
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
                    {isHeadOfFamily ? (
                      <FormLabel
                        id="demo-controlled-radio-buttons-group"
                        // style={{ minWidth: "230px" }}
                      >
                        <FormattedLabel id="handicap" />
                        <Checkbox
                          value={isHandicap}
                          checked={isHandicap ? true : false}
                          onChange={(e) => {
                            setIsCheckedHandicap(e.target.checked);
                          }}
                        />
                      </FormLabel>
                    ) : (
                      <></>
                    )}
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
                    {isHeadOfFamily ? (
                      <FormLabel
                        id="demo-controlled-radio-buttons-group"
                        // style={{ minWidth: "230px" }}
                      >
                        <FormattedLabel id="widow" />
                        <Checkbox
                          value={isWidow}
                          checked={isWidow ? true : false}
                          onChange={(e) => {
                            setIsCheckedWidow(e.target.checked);
                          }}
                        />
                      </FormLabel>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ marginTop: 5 }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ marginTop: 5 }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      size="small"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ marginTop: 5 }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      size="small"
                      endIcon={<SaveIcon />}
                      // disabled={checkAdharNo === "DUPLICATE"}
                    >
                      {btnSaveText == "Save" ? (
                        <FormattedLabel id="save" />
                      ) : (
                        <FormattedLabel id="update" />
                      )}
                    </Button>{" "}
                  </Grid>
                </Grid>
                {/* <Divider /> */}
              </form>
            </Slide>
          </FormProvider>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              size="small"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setEditButtonInputState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
        </Grid>
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              // printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              // csvOptions: { disableToolbarButton: true },
            },
          }}
          autoHeight
          sx={{
            // marginLeft: 5,
            // marginRight: 5,
            // marginTop: 5,
            // marginBottom: 5,

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
          // rows={dataSource}
          // columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          density="compact"
          pagination
          paginationMode="server"
          rowCount={totalElements}
          rowsPerPageOptions={[5]}
          pageSize={pageSize}
          rows={dataSource}
          columns={columns}
          onPageChange={(_data) => {
            getHutMember(pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getHutMember(pageSize, _data);
          }}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
