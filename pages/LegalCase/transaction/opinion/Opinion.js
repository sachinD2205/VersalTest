import React from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";

import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import sweetAlert from "sweetalert";
import { catchExceptionHandlingMethod } from "../../../../util/util";

import {
  Card,
  Button,
  Checkbox,
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
  Paper,
  TextareaAutosize,
} from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/opinion.module.css";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import urls from "../../../URLS/urls";

const View = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const language = useSelector((state) => state.labels.language);

  const router = useRouter();
  const [opinionReceivedDate, setOpinionReceivedDate] = React.useState(null);
  const [searchDate, setSearchDate] = React.useState(null);
  const [finalDate, setFinalDate] = React.useState(null);
  // const [btnSaveText, setBtnSaveText] = useState("Save");
  const token = useSelector((state) => state.user.user.token);

  // const onSubmitForm = (fromData) => {};

  const [concenDeptNames, setconcenDeptName] = useState([]);

  // Handle cathch method to display Error sweetalert
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

  const getconcenDeptName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setconcenDeptName(
          r.data.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const [advocateNames, setadvocateName] = useState([]);

  const getadvocateName = () => {
    axios
      .get(`${urls.LCMSURL}/advocate/getAdvocateData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setadvocateName(
          r.data.map((row) => ({
            id: row.id,
            advocateName:
              row.firstName + " " + row.middleName + " " + row.lastName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getconcenDeptName();
    getadvocateName();
  }, []);

  // Save - DB
  const onSubmitForm = (Data) => {
    axios
      .post(`${urls.LCMSURL}/TrnOpinion/saveOpinion`, Data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(`/LegalCase/transaction/opinion/`);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
      <BasicLayout>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          <Grid container mt={2} ml={5} mb={5} border px={5} height={10}>
            <Grid item xs={5}></Grid>
            <Grid item xs={5.7}>
              <h2>Opinion</h2>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.small}>
                  <div className={styles.row}>
                    {/* First Row */}
                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.opinionRecivedDate}
                      >
                        <Controller
                          control={control}
                          name="opinionRecivedDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Opinion Received Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    // fullWidth
                                    sx={{ width: 230 }}
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
                          {errors?.opinionRecivedDate
                            ? errors.opinionRecivedDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.department}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Concen Dept. Name
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 230 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Concen Dept. Name"
                            >
                              {concenDeptNames &&
                                concenDeptNames.map((department, index) => (
                                  <MenuItem key={index} value={department.id}>
                                    {department.department}
                                  </MenuItem>
                                ))}
                              {/* {businessTypes &&
                              businessTypes.map((businessType, index) => (
                                <MenuItem key={index} value={businessType.id}>
                                  {businessType.businessType}
                                </MenuItem>
                              ))} */}
                            </Select>
                          )}
                          name="department"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.department
                            ? errors.department.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <TextareaAutosize
                        // aria-label="minimum height"
                        // minRows={3}
                        placeholder="Opinion Subject"
                        style={{ width: 250, height: 35, marginTop: 10 }}
                      />
                      {/* <TextField
                        //// required
                        sx={{ width: 230 }}
                        id="standard-basic"
                        label="Opinion Subject"
                        variant="standard"
                        {...register("opinionSubject")}
                        // InputProps={{ style: { fontSize: 15 } }}
                        // InputLabelProps={{ style: { fontSize: 14 } }}
                      /> */}
                    </div>
                  </div>
                  {/* 2nd Row */}
                  <div className={styles.row}>
                    <div>
                      <TextField
                        autoFocus
                        sx={{ width: 230 }}
                        id="standard-basic"
                        label="Opinion Summary(in short)"
                        variant="standard"
                        {...register("opinionSummary")}
                        // InputProps={{ style: { fontSize: 15 } }}
                        // InputLabelProps={{ style: { fontSize: 14 } }}
                        // {...register("businessSubTypePrefix")}
                        // error={!!errors.businessSubTypePrefix}
                        // helperText={
                        //   errors?.businessSubTypePrefix
                        //     ? errors.businessSubTypePrefix.message
                        //     : null
                        // }
                      />
                    </div>

                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.searchTitleRptDate}
                      >
                        <Controller
                          control={control}
                          name="searchTitleRptDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Search Title Report Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    // fullWidth
                                    sx={{ width: 230 }}
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 11,
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
                          {errors?.searchTitleRptDate
                            ? errors.searchTitleRptDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.advocateName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Advocate Name
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 230 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label="Concen Dept. Name"
                              InputProps={{ style: { fontSize: 15 } }}
                              InputLabelProps={{ style: { fontSize: 13 } }}
                            >
                              {advocateNames &&
                                advocateNames.map((advocateName, index) => (
                                  <MenuItem key={index} value={advocateName.id}>
                                    {advocateName.advocateName}
                                  </MenuItem>
                                ))}
                              {/* {businessTypes &&
                              businessTypes.map((businessType, index) => (
                                <MenuItem key={index} value={businessType.id}>
                                  {businessType.businessType}
                                </MenuItem>
                              ))} */}
                            </Select>
                          )}
                          name="advocateName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.advocateName
                            ? errors.advocateName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </div>

                  {/* 3rd Row */}
                  <div className={styles.row}>
                    <div>
                      <TextareaAutosize
                        // aria-label="minimum height"
                        minRows={3}
                        placeholder="Reminder status for Search Title Report"
                        style={{ width: 250, height: 40, marginTop: 10 }}
                        {...register("reminderStausForsea")}
                      />
                      {/* <TextField
                        autoFocus
                        sx={{ width: 250 }}
                        id="standard-basic"
                        label="Reminder status for Search Title Report"
                        variant="standard"
                        InputProps={{ style: { fontSize: 15 } }}
                        InputLabelProps={{ style: { fontSize: 13 } }}

                        // {...register("businessSubTypePrefix")}
                        // error={!!errors.businessSubTypePrefix}
                        // helperText={
                        //   errors?.businessSubTypePrefix
                        //     ? errors.businessSubTypePrefix.message
                        //     : null
                        // }
                      /> */}
                    </div>
                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.finalDraftDeliveryDate}
                      >
                        <Controller
                          control={control}
                          name="finalDraftDeliveryDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Final Draft DeliveryDate
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    // fullWidth
                                    sx={{ width: 230 }}
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
                        {/* <FormHelperText>
                          {errors?.finalDraftDeliveryDate ? errors.finalDraftDeliveryDate.message : null}
                        </FormHelperText> */}
                      </FormControl>
                    </div>
                    <div>
                      <TextareaAutosize
                        // aria-label="minimum height"
                        minRows={3}
                        placeholder="Legal Advisor Remarks"
                        style={{ width: 250, height: 40 }}
                        {...register("legalAdvisorRemarks")}
                      />
                      {/* <TextField
                        autoFocus
                        sx={{ width: 230 }}
                        id="standard-basic"
                        label="Legal Advisor Remarks"
                        variant="standard"
                        // {...register("businessSubTypePrefix")}
                        // error={!!errors.businessSubTypePrefix}
                        // helperText={
                        //   errors?.businessSubTypePrefix
                        //     ? errors.businessSubTypePrefix.message
                        //     : null
                        // }
                      /> */}
                    </div>
                  </div>
                  {/* 4th Row */}
                  <div className={styles.row}>
                    <div>
                      <label>Digital Signature</label>
                      <TextField
                        //// required
                        id="standard-basic"
                        //                     label="Upload
                        // Documents/Order "
                        variant="standard"
                        sx={{ width: 200 }}
                        type="file"
                        InputLabelProps={{ style: { fontSize: 10 } }}
                        InputProps={{ style: { fontSize: 12 } }}
                      />
                    </div>
                  </div>

                  {/* RowButton */}
                  <div className={styles.btn}>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      variant="outlined"
                      // color="success"
                      color="primary"
                      endIcon={<SaveIcon />}
                    >
                      Save
                      {/* {btnSaveText} */}
                    </Button>{" "}
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="outlined"
                      color="primary"
                      endIcon={<ClearIcon />}
                      // onClick={() => cancellButton()}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      // onClick={() => exitButton()}
                      onClick={() => {
                        router.push(`/LegalCase/transaction/opinion/`);
                      }}
                    >
                      Exit
                    </Button>
                  </div>
                  {/* <Grid container style={{ marginTop: 40 }}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={1}>
                      <Button variant="outlined" type="submit">
                        Save
                      </Button>
                    </Grid>

                    <Grid item xs={0.5}></Grid>

                    <Grid item xs={1}>
                      <Button variant="outlined">Reset</Button>
                    </Grid>
                    <Grid item xs={0.5}></Grid>

                    <Grid item xs={1}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          router.push(`/LegalCase/transaction/opinion/`);
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid> */}
                </div>
              </form>
            </FormProvider>
          </div>
        </Paper>
      </BasicLayout>
    </>
  );
};

export default View;
