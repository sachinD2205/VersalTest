import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import URLS from "../../../../URLS/urls";
import { useSelector } from "react-redux";

const sportsBookingGroupDetailsDao = () => {
  const language = useSelector((state) => state?.labels.language);

  const {
    control,
    register,
    reset,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Titles
  const [titles, setTitles] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  // getTitles
  const getTitles = () => {
    axios.get(`${URLS.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
        }))
      );
    });
  };
  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (
      getValues(`sportsBookingGroupDetailsDao.length`) >=
      getValues("totalGroupMember")
    ) {
      setButtonValue(true);
    } else {
      appendFun();
      // reset();
      setButtonValue(false);
    }
  };

  const appendFun = () => {
    append({
      title: "",
      prState: "",
      prCityName: "",
      permanentAddress: "",
      crState: "",
      crCityName: "",
      currentAddress: "",
      emailAddress: "",
      aadharNo: "",
      mobile: "",
      age: "",
      applicantLastName: "",
      applicantMiddleName: "",
      applicantFirstName: "",
      dateOfBirth: null,
    });
  };

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "sportsBookingGroupDetailsDao", // unique name for your Field Array
    }
  );

  //useEffect
  useEffect(() => {
    if (getValues(`sportsBookingGroupDetailsDao.length`) == 0) {
      appendFun();
    }
  }, []);

  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        }))
      );
    });
  };
// title gender mapping
const filtredGender = (title,index)=>{ 
  console.log("3423423",title,index)
  
  if(genders.length!=0 &&title!= null &&title!=undefined&& title!=""){
    
    if(title == 1 || title == 6){
      let x=[genders.find((o)=>o.id==1 )]
      setValue(`sportsBookingGroupDetailsDao.${index}.gender`,x[0]?.id)
    }else if(title==2 || title==3){
      let x=[genders.find((o)=>o.id==2 )]
      setValue(`sportsBookingGroupDetailsDao.${index}.gender`,x[0]?.id)
    }else if(title==18){
      let x=[genders.find((o)=>o.id==3 )]
      setValue(`sportsBookingGroupDetailsDao.${index}.gender`,x[0]?.id)
    } 
  }
  
  
    
}
useEffect(()=>{
if(genders.length!=0){
  //  console.log("878",watch("title"))
  filtredGender()
} 
},[genders])
  // crPincodes
  const [crPincodes, setCrPinCodes] = useState([]);

  // getCrPinCodes
  const getCrPinCodes = () => {
    axios.get(`${URLS.CFCURL}/master/pinCode/getAll`).then((r) => {
      setCrPinCodes(
        r.data.pinCode.map((row) => ({
          id: row.id,
          crPincode: row.pinCode,
        }))
      );
    });
  };

  // useEffect
  useEffect(() => {
    getTitles();
    getGenders();
    getCrPinCodes();
  }, []);

  useEffect(()=> {

    console.log("sdfsdfs34234",watch(`sportsBookingGroupDetailsDao`));
  },[watch(`sportsBookingGroupDetailsDao`)])

  // view 
  return (
    <>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <strong>
          <FormattedLabel id="sportsBookingGroupDetailsDao" />
        </strong>
      </div>

      {fields.map((sportsBookingGroupDetailsDao, index) => {
        return (
          <>
            <div>
              <div className={styles.memberHeading}>
                <div>
                  <h3
                    style={{
                      color: "black",
                      marginTop: "7px",
                    }}
                  >
                    Member
                    {`: ${index + 1}`}
                  </h3>
                </div>
              </div>
              <div className={styles.newRowDelete}>
                <div className={styles.deleteButton}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<DeleteIcon />}
                    style={{
                      color: "white",
                      backgroundColor: "red",
                      height: "30px",
                    }}
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    {<FormattedLabel id="delete" />}
                  </Button>
                  {/* )} */}
                </div>
              </div>
            </div>
            <Grid
              container
              sx={{
                marginLeft: 5,
                marginTop: 1,
                marginBottom: 5,
                align: "center",
              }}
            >
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="title" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        autoFocus
                        value={field.value}
                        onChange={(value) => {
                          const targetValue=value?.target?.value;
                          // console.log("value34234",,)
                          filtredGender(targetValue,index)
                          field.onChange(value)

                        }}
                        label="Title *"
                        key={sportsBookingGroupDetailsDao.id}
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {titles &&
                          titles.map((title, index) => (
                            <MenuItem key={index} value={title.id}>
                              {title.title}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`sportsBookingGroupDetailsDao.${index}.title`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.title ? errors.title.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="firstName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(
                    `sportsBookingGroupDetailsDao.${index}.applicantFirstName`
                  )}
                  error={!!errors.applicantFirstName}
                  helperText={
                    errors?.applicantFirstName
                      ? errors.applicantFirstName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="middleName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(
                    `sportsBookingGroupDetailsDao.${index}.applicantMiddleName`
                  )}
                  error={!!errors.applicantMiddleName}
                  helperText={
                    errors?.applicantMiddleName
                      ? errors.applicantMiddleName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="lastName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(
                    `sportsBookingGroupDetailsDao.${index}.applicantLastName`
                  )}
                  error={!!errors.applicantLastName}
                  helperText={
                    errors?.applicantLastName
                      ? errors.applicantLastName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.gender} disabled>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="gender" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Gender *"
                      >
                        {genders &&
                          genders.map((gender, index) => (
                            <MenuItem key={index} value={gender.id}>
                              {language == "en"
                                ? gender?.gender
                                : gender?.genderMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`sportsBookingGroupDetailsDao.${index}.gender`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.gender ? errors.gender.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    defaultValue={null}
                    format="DD/MM/YYYY"
                    key={sportsBookingGroupDetailsDao.id}
                    {...register(
                      `sportsBookingGroupDetailsDao.${index}.dateOfBirth`
                    )}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              {<FormattedLabel id="dateOfBirth" />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                            let today = new Date();
                            let dob = new Date(date);
                            var age = today.getFullYear() - dob.getFullYear();
                            setValue(
                              `sportsBookingGroupDetailsDao.${index}.age`,
                              age
                            );
                          }}
                          selected={field.value}
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
                    {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  disabled
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  label="Age"
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(`sportsBookingGroupDetailsDao.${index}.age`)}
                  error={!!errors.age}
                  helperText={errors?.age ? errors.age.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="mobileNo" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(`sportsBookingGroupDetailsDao.${index}.mobile`)}
                  error={!!errors.mobile}
                  helperText={errors?.mobile ? errors.mobile.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="aadharNo" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(
                    `sportsBookingGroupDetailsDao.${index}.aadharNo`
                  )}
                  error={!!errors.aadharNo}
                  helperText={errors?.aadharNo ? errors.aadharNo.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="emailAddress" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(
                    `sportsBookingGroupDetailsDao.${index}.emailAddress`
                  )}
                  error={!!errors.emailAddress}
                  helperText={
                    errors?.emailAddress ? errors.emailAddress.message : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="currentAddress" />}
                  key={sportsBookingGroupDetailsDao.id}
                  // {...register('currentAddress')}
                  {...register(
                    `sportsBookingGroupDetailsDao.${index}.currentAddress`
                  )}
                  error={!!errors.currentAddress}
                  helperText={
                    errors?.currentAddress
                      ? errors.currentAddress.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  defaultValue={"Pimpri Chinchwad"}
                  label={<FormattedLabel id="cityName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(
                    `sportsBookingGroupDetailsDao.${index}.crCityName`
                  )}
                  error={!!errors.crCityName}
                  helperText={
                    errors?.crCityName ? errors.crCityName.message : null
                  }
                />
              </Grid>
            </Grid>
          </>
        );
      })}

      <div className={styles.row} style={{ marginTop: 50 }}>
        <Button
          disabled={btnValue}
          onClick={() => buttonValueSetFun()}
          variant="contained"
        >
          Add Member
        </Button>
      </div>
    </>
  );
};

export default sportsBookingGroupDetailsDao;
