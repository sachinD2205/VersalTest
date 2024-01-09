import { Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/responseToNotice.module.css";

import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import schema from "./";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import { useEffect, useState } from "react";
import sweetAlert from "sweetalert";
import UploadButton from "../../FileUpload/UploadButton";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const View = () => {
  let attachedFile = null;
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
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();
  const [noticeDate, setNoticeDate] = useState(null);
  const [requisitionDate, setRequisitionDate] = useState(null);
  // const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [id, setId] = useState();
  let pageType = false;
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state.labels.language);

  if (router.query.pageMode === "Edit" || router.query.pageMode === "View") {
    pageType = true;
  }

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

  useEffect(() => {
    getDepartments();

    //
    if (router.query.pageMode === "Edit") {
      pageType = true;
      reset({
        noticeRecivedFromAdvocatePerson:
          router.query.noticeRecivedFromAdvocatePerson,
        noticeDate: router.query.noticeDate,
        department: router.query.department,
        noticeRecivedDate: router.query.noticeRecivedDate,
        requisitionDate: router.query.requisitionDate,
        // documentOriName: router.query.documentOriName,
      });
    }
  }, []);

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          res.data.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (Data) => {
    // let [Data.attachFile, ...Data]=Data;

    // let { attachFile, ...Data };
    // let attachFileJson = Data.attachFile;
    // let formData = new FormData();
    // formData.append("data", JSON.stringify(Data));
    // formData.delete("attachFile");
    // formData.append("attachFile", Data.attachFile);

    console.log("A..", Data);
    console.log("File..", attachedFile);
    const finalBodyForApi = {
      ...Data,
      attachedFile,
    };
    if (router.query.pageMode === "Add") {
      axios
        .post(`${urls.LCMSURL}/notice/saveTrnNotice`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            router.push(`/LegalCase/transaction/newNotice/`);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    } else if (router.query.pageMode === "Edit") {
      axios
        .post(
          `${urls.LCMSURL}/notice/saveTrnNotice`,
          finalBodyForApi,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          // validityOfMarriageBoardRegistration
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            router.push(`/LegalCase/transaction/newNotice/`);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }

    // axios
    //   .post(
    //     `http://localhost:8098/lc/api/notice/saveTrnNotice`,
    //     finalBodyForApi
    //   )
    //   .then((res) => {
    //     if (res.status == 201) {
    //       sweetAlert("Saved!", "Record Saved successfully !", "success");
    //       router.push(`/LegalCase/transaction/newNotice/`);
    //     }
    //   });
  };

  // convertBase 64

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // handleFile for Document
  const [doc1type, setdoc1type] = useState();
  const [document1, setDocument1] = useState();

  const handleFile1 = async (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios
      .post(`${urls.LCMSURL}/notice/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Responsess", r);
        if (r.status === 200) {
          // attachedFile...(Dio Field)
          attachedFile = r.data.filePath;
          console.log("Response", r.data);
          console.log("Res", attachedFile);
        } else {
          sweetAlert("Error");
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
    setValue("attachedFile", attachedFile);
    // if (labelName == advocate3) {
    //   setValue("attachedFile", attachedFile);
    // } else if (labelName == advocate1) {
    //   setValue("attachedFile", attachedFile);
    // } else if (labelName == advocate2) {
    //   setValue("attachedFile", attachedFile);
    // }
  };

  return (
    <>
      <BasicLayout>
        {/* materialUI */}
        <Card>
          <Grid container mt={2} ml={5} mb={5} border px={5} height={10}>
            <Grid item xs={5}></Grid>
            <Grid item xs={5.7}>
              <h2>Notice</h2>
            </Grid>
          </Grid>
        </Card>

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
                  {/* First Row */}
                  <div className={styles.row}>
                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.fromDate}
                      >
                        <Controller
                          control={control}
                          name="noticeDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Notice Date
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
                          {errors?.noticeDate
                            ? errors.noticeDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.noticeRecivedDate}
                      >
                        <Controller
                          control={control}
                          name="noticeRecivedDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Notice Received date
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
                          {errors?.noticeReceivedDate
                            ? errors.noticeReceivedDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div>
                      <TextField
                        autoFocus
                        sx={{ width: 250 }}
                        id="standard-basic"
                        label="Notice received from Advocate/Person"
                        variant="standard"
                        {...register("noticeRecivedFromAdvocatePerson")}
                        error={!!errors.noticeRecivedFromAdvocatePerson}
                        helperText={
                          errors?.noticeRecivedFromAdvocatePerson
                            ? errors.noticeRecivedFromAdvocatePerson.message
                            : null
                        }
                      />
                    </div>
                  </div>

                  {/* 2nd Row */}
                  <div className={styles.row}>
                    <div>
                      <FormControl variant="standard" sx={{ minWidth: 230 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Department Name
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              label="Department Name"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              {departments &&
                                departments.map((department, index) => (
                                  <MenuItem key={index} value={department.id}>
                                    {department.department}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="department"
                          control={control}
                          defaultValue=""
                        />
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.requisitionDate}
                      >
                        <Controller
                          control={control}
                          name="requisitionDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Requisition Date
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
                          {errors?.fromDate
                            ? errors.requisitionDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div className={styles.attachFile}>
                      <Typography>Attached file</Typography>
                      <UploadButton
                        Change={(e) => {
                          handleFile1(e);
                          // setValue("attachFile", e.target.files[0]);
                        }}
                      />
                    </div>
                  </div>

                  {/* Button Row */}
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
                        router.push(`/LegalCase/transaction/newNotice/`);
                      }}
                    >
                      Exit
                    </Button>
                  </div>

                  {/* <Grid container style={{ marginTop: 20 }}>
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
                          router.push(
                            `/LegalCase/transaction/notices/NoticeSendToDepartment/`
                          );
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
