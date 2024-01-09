// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
//import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/billingCycleSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import * as yup from "yup";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  // define schema
  const schema = yup.object().shape({
    rateType: yup.string().required("Rate Type Name is required"),
    roadTypeKey: yup.string().when("rateType", {
      is: "A",
      then: yup.string().required("Road Type is Required")
    }),
    natureOfExcavation: yup.string().when("rateType", {
      is: "B",
      then: yup.string().required("Nature Of Excavation is Required")
    }),
    rate: yup.string().required("Rate is required"),
    lengthOfExcavationFrom: yup.string().when("rateType", {
      is: "B",
      then: yup.string().required("Starting length is Required")
    }),
    lengthOfExcavationTo: yup.string().when("rateType", {
      is: "B",
      then: yup.string().required("Ending length is Required")
    }),
    remarkEng: yup.string().required("Road Type Prefix is required"),
    remarkMr: yup
    .string()
    .matches( /^[\u0900-\u097F\d]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द')
    .required("टिप्पणी आवश्यक आहे !!!"),  });
    const methods =useForm({
      criteriaMode: "all",
      resolver: yupResolver(schema),
      mode: "onChange",
    });
    const {
      register,
      control,
      handleSubmit,
      // methods,
      reset,
      watch,
      formState: { errors },
    } = methods
    console.log("rateType",watch("rateType"));

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [natureOfExacavationArray, setnatureOfExacavationArray] = useState([]);
  const [roadTypeArray, setroadTypeArray] = useState([]);
  const router = useRouter();
  const userToken = useGetToken();
  const language = useSelector((state) => state.labels.language);
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
// console.log("d",language);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const rateType =[
    {
      rateTypeName:"A"
    },
    {
      rateTypeName:"B"
    }
  ]


  const getRoadType = () => {
    axios
      .get(`${urls.RENPURL}/mstRoadType/getAll`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("mstRoadTypeGetAll", r);
        let result = r.data.mstRoadTypeList;
        // console.log("mstRoadTypeGetAllresult", result);
        setroadTypeArray(result)

      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getNatureOfExcavation = () => {
    axios
      .get(`${urls.RENPURL}/mstNatureOfExcavation/getAll`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("mstNatureOfExcavation", r);
        let result = r.data.mstNatureOfExcavationDaoList;
        // console.log("mstNatureOfExcavation", result);
        setnatureOfExacavationArray(result)

      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
        // console.log("mstRoadTypeGetAllresult", roadTypeArray);
        // console.log("mstNatureOfExcavation", natureOfExacavationArray);

 

  // Get Table - Data
  const getRateCharge = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.RENPURL}/mstRateCharge/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
        
      })
      .then((r) => {
        console.log("mstRateCharge", r);
        let result = r.data.mstRateChargeDaoList;
        console.log("result2222", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            rateType:r.rateType,
            roadTypeKey:r.roadTypeKey,
            roadTypeNameEn:roadTypeArray?.find((data)=>data?.id == r?.roadTypeKey)?.roadTypeName ,
            roadTypeNameMr:roadTypeArray?.find((data)=> data?.id == r?.roadTypeKey)?.roadTypeNameMr ,
            natureOfExcavation:r.natureOfExcavation,
            natureOfExcavationEn:natureOfExacavationArray?.find((data)=>data?.id == r?.natureOfExcavation)?.nameEng,
            natureOfExcavationMr:natureOfExacavationArray?.find((data)=> data?.id == r?.natureOfExcavation)?.nameMr,
            rate:r.rate,
            lengthOfExcavationFrom:r.lengthOfExcavationFrom,
            lengthOfExcavationTo:r.lengthOfExcavationTo,
            remarkEng:r.remarkEng,
            remarkMr:r.remarkMr,
          };
        });

        console.log("_res12",_res)
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getRoadType();
    getNatureOfExcavation()
  }, []);

  console.log("rate",watch("rateType"));

  
  useEffect(() => {
    getRateCharge();
  }, [fetchData]);

  useEffect(() => {
    getRateCharge();
  }, [roadTypeArray,natureOfExacavationArray]);


  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios.post(`${urls.RENPURL}/mstRateCharge/save`, _body,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }).then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");

          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      const tempData = axios.post(`${urls.RENPURL}/mstRateCharge/save`, _body,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }).then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getRateCharge();
          // setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.RENPURL}/mstRateCharge/save`, body,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getRateCharge();
              // setButtonInputState(false);
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.RENPURL}/mstRateCharge/save`, body,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              // getPaymentRate();
              getRateCharge();
              // setButtonInputState(false);
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
rateType:"",
roadTypeKey:"",
natureOfExcavation:"",
rate:"",
lengthOfExcavationFrom:"",
lengthOfExcavationTo:"",
remarkEng:"",
remarkMr:""
  };

  // Reset Values Exit
  const resetValuesExit = {
    rateType:"",
roadTypeKey:"",
natureOfExcavation:"",
rate:"",
lengthOfExcavationFrom:"",
lengthOfExcavationTo:"",
remarkEng:"",
remarkMr:""
    // id: null,
  };
console.log("ds",language);
  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
    // { field: "courtNo", headerName: "Court No", flex: 1 },
    {
      
      field: "rateType",
      headerName: <FormattedLabel id="rateType" />,
      flex: 1,
    },
    {
      
      field: language == "en" ? "roadTypeNameEn" :"roadTypeNameMr" ,
      headerName: <FormattedLabel id="roadTypes" />,
      flex: 1,
    },
    {
      
      field: language == "en" ? "natureOfExcavationEn" :"natureOfExcavationMr" ,
      // field: "natureOfExcavation",
      headerName: <FormattedLabel id="natureOfExacavation" />,
      flex: 1,
    },
    {
      field: "lengthOfExcavationFrom",
      headerName: <FormattedLabel id="lengthOfExcavationFrom" />,
      flex: 1,
    },
    {
      field:"lengthOfExcavationTo",
      headerName: <FormattedLabel id="lengthOfExcavationTo" />,
      flex: 1,
    },
    {
      field:"rate",
      headerName: <FormattedLabel id="rate" />,
      flex: 1,
    },
    {
      field: language == "en" ? "remarkEng" : "remarkMr",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box >
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Row


  useEffect(()=> {
 console.log("roadTypeArrayData",data)
  },[roadTypeArray,data])

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "120px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="rateCharge" />
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <Grid container spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}>
                <Grid item xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                   <FormControl>
                  <InputLabel required error={!!errors.rateType}>
                  <FormattedLabel id="rateType" />
                  </InputLabel>
                  <Controller
                    control={control}
                    name="rateType"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                      style={{width:"230px"}}
                        variant="standard"
                        {...field}
                        error={!!errors.rateType}
                      >
                        {  rateType &&
                          rateType .map((type) => (
                            <MenuItem value={type.rateTypeName}>
                              {type.rateTypeName}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                   <FormHelperText error={!!errors.rateType}>
                        {errors.rateType
                            ? errors.rateType.message
                            : null}
                      </FormHelperText>
                 
                </FormControl>
                </Grid>

                  {
                    (watch("rateType")=="A") &&<><Grid item xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <FormControl>
                      <InputLabel required error={!!errors.roadTypeKey}>
                      <FormattedLabel id="roadTypes" />
                      
                      </InputLabel>
                      <Controller
                        control={control}
                        name="roadTypeKey"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                          style={{width:"230px"}}
                            variant="standard"
                            {...field}
                            error={!!errors.roadTypeKey}
                          >
                            {  roadTypeArray  &&
                              roadTypeArray  .map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                  {language === "en"? type.roadTypeName:type.roadTypeNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.roadTypeKey}>
                        {errors.roadTypeKey
                            ? errors.roadTypeKey.message
                            : null}
                      </FormHelperText>
                    </FormControl>
                    </Grid>
    </>
                  }


                {
                  (watch("rateType")=="B")&&<><Grid item xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                     <FormControl>
                    <InputLabel required error={!!errors.natureOfExcavation}>
                    <formattedLabel id="natureOfExacavation"/>
                    
                    </InputLabel>
                    <Controller
                      control={control}
                      name="natureOfExcavation"
                      rules={{ required: true }}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                        style={{width:"230px"}}
                          variant="standard"
                          {...field}
                          error={!!errors.natureOfExcavation}
                        >
                          {  natureOfExacavationArray &&
                            natureOfExacavationArray .map((type) => (
                              <MenuItem key={type.id} value={type.id}>
                                {language === "en"? type.nameEng:type.nameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                    <FormHelperText error={!!errors.natureOfExcavation}>
                        {errors.natureOfExcavation
                            ? errors.natureOfExcavation.message
                            : null}
                      </FormHelperText>
                  </FormControl>
                  </Grid>
                  <Grid item xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <TextField
                      label={<FormattedLabel id="lengthOfExcavationFrom" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("lengthOfExcavationFrom")}
                      error={!!errors.lengthOfExcavationFrom}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("lengthOfExcavationFrom") ? true : false) || (router.query.lengthOfExcavationFrom ? true : false),
                      }}
                      helperText={errors?.lengthOfExcavationFrom ? errors.lengthOfExcavationFrom.message : null}
                    />
                  </Grid> 
  
                  <Grid item xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <TextField
                      label={<FormattedLabel id="lengthOfExcavationTo" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("lengthOfExcavationTo")}
                      error={!!errors.lengthOfExcavationTo}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        // shrink:
                        //   (watch("lengthOfExcavationTo") ? true : false) ||
                        //   (router.query.lengthOfExcavationTo ? true : false),
                      }}
                      helperText={errors?.lengthOfExcavationTo ? errors.lengthOfExcavationTo.message : null}
                    />
                  </Grid></>
                }
                <Grid item xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <TextField
                    label={<FormattedLabel id="rate" />}
                    id="standard-basic"
                    variant="standard"
                    {...register("rate")}
                    error={!!errors.rate}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      // shrink:
                      //   (watch("rate") ? true : false) ||
                      //   (router.query.rate ? true : false),
                    }}
                    helperText={errors?.rate ? errors.rate.message : null}
                  />
                </Grid>

                <Grid item xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <Transliteration
                      style={{ backgroundColor: "white", margin: "250px" }}
                      _key={"remarkEng"}
                      labelName={"remarkEng"}
                      fieldName={"remarkEng"}
                      updateFieldName={"remarkMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="remarks" required />}
                      error={!!errors.remarkEng}
                      helperText={
                        errors?.remarkEng ? errors.remarkEng.message : null
                      }
                    />
                  {/* <TextField
                    label={<FormattedLabel id="remarks" />}
                    id="standard-basic"
                    variant="standard"
                    {...register("remarkEng")}
                    error={!!errors.remarkEng}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      // shrink: (watch("remarkEng") ? true : false) || (router.query.remarkEng ? true : false),
                    }}
                    helperText={errors?.remarkEng ? errors.remarkEng.message : null}
                  /> */}
                </Grid>
            

                <Grid item xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                   <Transliteration
                      style={{ backgroundColor: "white", margin: "250px" }}
                      _key={"remarkMr"}
                      labelName={"remarkMr"}
                      fieldName={"remarkMr"}
                      updateFieldName={"remarkEng"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="remarksMr" required />}
                      error={!!errors.remarkMr}
                      helperText={
                        errors?.remarkMr ? errors.remarkMr.message : null
                      }
                    />
                  {/* <TextField
                    label={<FormattedLabel id="remarksMr" />}
                    id="standard-basic"
                    variant="standard"
                    {...register("remarkMr")}
                    error={!!errors.remarkMr}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      // shrink: (watch("remarkMr") ? true : false) || (router.query.remarkMr ? true : false),
                    }}
                    helperText={errors?.remarkMr ? errors.remarkMr.message : null}
                  /> */}
                </Grid>

                

                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Grid item>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText === "Update" ? (
                        <FormattedLabel id="update" />
                      ) : (
                        <FormattedLabel id="save" />
                      )}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
                {/* </div> */}
              </Grid>
            </Slide>
          )}
        </form>
      </FormProvider>

      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          // type='primary'
          disabled={buttonInputState}
          onClick={() => {
            reset({
              ...resetValuesExit,
            });
            setEditButtonInputState(true);
            setDeleteButtonState(true);
            setBtnSaveText("Save");
            setButtonInputState(true);
            setSlideChecked(true);
            setIsOpenCollapse(!isOpenCollapse);
          }}
        >
          <FormattedLabel id="add" />
        </Button>
      </div>

      <DataGrid
        // disableColumnFilter
        // disableColumnSelector
        // disableToolbarButton
        // disableDensitySelector
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
        //checkboxSelection

        density="compact"
        // autoHeight={true}
        // rowHeight={50}
        pagination
        paginationMode="server"
        // loading={data.loading}
        rowCount={data.totalRows}
        rowsPerPageOptions={data.rowsPerPageOptions}
        page={data.page}
        pageSize={data.pageSize}
        rows={data.rows}
        columns={columns}
        onPageChange={(_data) => {
          getRateCharge(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getRateCharge(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
