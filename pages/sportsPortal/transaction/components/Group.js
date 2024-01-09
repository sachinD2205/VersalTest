import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
  Paper,
} from "@mui/material";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
// import styles from "../../newMarriageRegistration/view.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import URLS from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// witness
const Group = () => {
  const {
    control,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext();

  // genders
  const [gGenders, setGGenders] = useState([]);

  // getGGenders
  const getGGenders = () => {
    axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
      setGGenders(
        r.data.map((row) => ({
          id: row.id,
          gGender: row.gender,
        }))
      );
    });
  };

  // Titles
  const [titles, setTitles] = useState([]);
  // getTitles
  const getTitles = () => {
    axios.get(`${urls.BaseURL}/title/getAll`).then((r) => {
      setTitles(
        r.data.map((row) => ({
          id: row.id,
          title: row.title,
        }))
      );
    });
  };

  // // genders
  // const [gGenders, setGGenders] = useState([]);

  // // getGGenders
  // const getGGenders = () => {
  //   axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
  //     setGGenders(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         gGender: row.gender,
  //       })),
  //     );
  //   });
  // };

  // // genders
  // const [gGenders, setGGenders] = useState([]);

  // // getGGenders
  // const getGGenders = () => {
  //   axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
  //     setGGenders(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         gGender: row.gender,
  //       })),
  //     );
  //   });
  // };

  useEffect(() => {
    getGGenders();
    getTitles();
  }, []);

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "witnesses", // unique name for your Field Array
    }
  );

  const [witnessAddBtn, setWitnessAddBtn] = useState(false);
  // if (fields.length == 2) {
  //   setWitnessAddBtn(true);
  // }

  //  Append Function
  const appendFun = () => {
    append({
      witnessFName: "",
      witnessMName: "",
      witnessLName: "",
      gender: "",
      witnessAddressC: "",
      aadharNo: "",
      witnessMobileNo: "",
      emailAddress: "",
      witnessAge: "",
      witnessRelation: "",
      witnessDocumentKey: "",
    });
  };

  // Call Append In UseEffect - First Time Only
  useEffect(() => {
    if (getValues(`witnesses.length`) == 0) {
      appendFun();
    }
  }, []);

  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`witnesses.length`) >= 6) {
      setButtonValue(true);
    } else {
      appendFun();
      setButtonValue(false);
    }
  };

  return (
    <>
      {fields.map((witness, index) => {
        return (
          <div key={1}>
            <div
              className={styles.row}
              // style={{
              //   height: '7px',
              //   width: '200px',
              // }}
            >
              <div
                className={styles.details}
                style={{
                  marginRight: "820px",
                }}
              >
                <div
                  className={styles.h1Tag}
                  style={{
                    height: "40px",
                    width: "300px",
                  }}
                >
                  <h3
                    style={{
                      color: "white",
                      marginTop: "7px",
                    }}
                  >
                    {`Witness ${index + 1}`}
                  </h3>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <FormControl
                  variant="standard"
                  error={!!errors.title}
                  sx={{ marginTop: 2 }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="title" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Title *"
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
                    name="title"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.title ? errors.title.message : null}
                  </FormHelperText>
                </FormControl>
              </div>
              <div>
                <TextField
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessFName`)}
                  // error={!!errors.witnessFName}
                  // helperText={
                  //   errors?.witnessFName ? errors.witnessFName.message : null
                  // }
                />
              </div>
              <div>
                <TextField
                  autoFocus
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessMName`)}
                  // error={!!errors.witnessMName}
                  // helperText={
                  //   errors?.witnessMName ? errors.witnessMName.message : null
                  // }
                />
              </div>
              <div>
                <TextField
                  autoFocus
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessLName`)}
                  // error={!!errors.witnessLName}
                  // helperText={
                  //   errors?.witnessLName ? errors.witnessLName.message : null
                  // }
                />
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <FormControl
                  variant="standard"
                  sx={{ marginTop: 2 }}
                  error={!!errors.gGender}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="Gender" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Gender *"
                      >
                        {gGenders &&
                          gGenders.map((gGender, index) => (
                            <MenuItem key={index} value={gGender.id}>
                              {gGender.gGender}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="gGender"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.gGender ? errors.gGender.message : null}
                  </FormHelperText>
                </FormControl>
              </div>
              <div>
                <TextField
                  autoFocus
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="address" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessAddressC`)}
                  // error={!!errors.witnessAddressC}
                  // helperText={
                  //   errors?.witnessAddressC
                  //     ? errors.witnessAddressC.message
                  //     : null
                  // }
                />
              </div>
              <div>
                <TextField
                  autoFocus
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="AadharNo" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.aadharNo`)}
                  // error={!!errors.aadharNo}
                  // helperText={errors?.aadharNo ? errors.aadharNo.message : null}
                />
              </div>
              <div>
                <TextField
                  autoFocus
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessMobileNo`)}
                  // error={!!errors.witnessMobileNo}
                  // helperText={
                  //   errors?.witnessMobileNo
                  //     ? errors.witnessMobileNo.message
                  //     : null
                  // }
                />
              </div>
              {/* <div>
                  <TextField
                    autoFocus
                    sx={{ width: 230 }}
                    id="standard-basic"
                    label={<FormattedLabel id="phoneNo" />}
                    variant="standard"
                    key={witness.id}
                    {...register(`witnesses.${index}.witnessMobileNo`)}
                    // error={!!errors.witnessMobileNo}
                    // helperText={
                    //   errors?.witnessMobileNo
                    //     ? errors.witnessMobileNo.message
                    //     : null
                    // }
                  />
                </div> */}
            </div>

            <div className={styles.row} style={{ marginRight: "25%" }}>
              <div>
                <TextField
                  autoFocus
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="email" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.emailAddress`)}
                  // error={!!errors.emailAddress}
                  // helperText={
                  //   errors?.emailAddress ? errors.emailAddress.message : null
                  // }
                />
              </div>
              <div>
                <TextField
                  autoFocus
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="Age" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessAge`)}
                  // error={!!errors.witnessAge}
                  // helperText={
                  //   errors?.witnessAge ? errors.witnessAge.message : null
                  // }
                />
              </div>
              <div>
                <FormControl
                  variant="standard"
                  sx={{ marginTop: 2 }}
                  // error={!!errors.witnessRelation}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="wRelation" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="  Witness Relation *"
                      >
                        {/* {witnessRelations &&
                               witnessRelations.map((witnessRelation, index) => (
                                 <MenuItem key={index} value={witnessRelation.id}>
                                   {witnessRelation.witnessRelation}
                                 </MenuItem>
                               ))} */}

                        <MenuItem value="Brother">Brother</MenuItem>
                        <MenuItem value="Uncle">Uncle</MenuItem>
                      </Select>
                    )}
                    name={`witnesses.${index}.witnessRelation`}
                    key={witness.id}
                    control={control}
                    defaultValue=""
                  />
                  {/** 
                    
                      <FormHelperText>
                        {errors?.witnessRelation
                          ? errors.witnessRelation.message
                          : null}
                      </FormHelperText>
                    */}
                </FormControl>
              </div>
              {/* <div>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    error={!!errors.witnessDocumentKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="wDocument" />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 230 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="  Witness Document *"
                        >
                          {witnessDocumentKeys &&
                            witnessDocumentKeys.map(
                              (witnessDocumentKey, index) => (
                                <MenuItem
                                  key={index}
                                  value={witnessDocumentKey.id}
                                >
                                  {witnessDocumentKey.witnessDocumentKey}
                                </MenuItem>
                              ),
                            )}
  
                          <MenuItem value={1}>Pan Card</MenuItem>
                          <MenuItem value={2}>Aadhaar card</MenuItem>
                          <MenuItem value={3}>bonafide certificate</MenuItem>
                        </Select>
                      )}
                      name={`witnesses.${index}.witnessDocumentKey`}
                      key={witness.id}
                      control={control}
                      defaultValue=""
                    />
  
                    <FormHelperText>
                      {errors?.witnessDocumentKey
                        ? errors.witnessDocumentKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </div> */}
            </div>
          </div>
        );
      })}
      <div className={styles.row} style={{ marginTop: 50 }}>
        <Button
          disabled={btnValue}
          onClick={() => buttonValueSetFun()}
          variant="contained"
        >
          {<FormattedLabel id="witnessAdd" />}
        </Button>
      </div>
    </>
  );
};

export default Group;
