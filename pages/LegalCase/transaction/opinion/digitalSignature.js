import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const DigitalSignature = () => {
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();

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

  useEffect(() => {
    console.log("router.query", router.query);
  }, []);

  // for Reset
  useEffect(() => {
    if (router.query.pageMode == "Final") {
      console.log("Data------", router.query);
      setValue("concenDeptName", router.query.concenDeptName);
      setValue("departmentMr", router.query.departmentMr);
      setValue("opinionSubject", router.query.opinionSubject);
      setValue("clerkRemarkEn", router.query.clerkRemarkEn);
      setValue("clerkRemarkMr", router.query.clerkRemarkMr);
      setValue("opinionRequestDate", router.query.opinionRequestDate);

      // setValue("caseNumber", router.query.caseNumber);
      reset(router.query);
    }
  }, []);

  // Save - DB
  const onSubmitForm = (Data) => {
    console.log("data", Data);
    const opinionRequestDate = moment(Data.opinionRequestDate).format(
      "YYYY-MM-DD"
    );
    let body = {
      ...Data,
      opinionRequestDate,
      opinionAdvPanelList: selectedID.map((val) => {
        return {
          advocate: val,
        };
      }),

      // role: "OPINION_CREATE",
      status:
        buttonText === "saveAsDraft" ? "OPINION_DRAFT" : "OPINION_CREATED",
      sentToAdvocate: buttonText === "saveAsDraft" ? "N" : "Y",
      role:
        buttonText === "saveAsDraft"
          ? "OPINION_SAVE_AS_DRAFT"
          : "CREATE_OPINION",

      // role:
      //   Data.target.textContent === "Submit"
      //     ? "OPINION_CREATE"
      //     : "OPINION_DRAFT",

      reportAdvPanelList: selectedID1.map((val) => {
        return {
          advocate: val,
        };
      }),

      // id: null,
      //name
      id: router.query.pageMode == "Opinion" ? null : Data.id,

      // role :"OPINION_DRAFT"

      // role:"OPINION_SAVE_AS_DRAFT"
    };

    console.log("body", body);

    axios
      .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res123", res);
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/opinion`);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  return (
    <form {...methods}>
      <Paper>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Box
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                cursor: "pointer",
                overflow: "hidden",
                fontSize: "10px",
                whiteSpace: "normal",
                backgroundColor: "green",
                color: "white",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#556CD6",
                },
              }}
            >
              Apply Digital Signature
            </Button>
          </Box>
          <Grid
            container
            sx={{
              marginLeft: "2vw",
            }}
          >
            <Grid style={{ marginLeft: "auto" }} item xs={4}>
              <Typography>
                {language === "en"
                  ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION"
                  : "पिंपरी-चिंचवड महानगरपालिका"}
              </Typography>
              <Typography>
                {language === "en" ? "PIMPRI" : "पिंपरी"}- 411018.
              </Typography>
              <Typography></Typography>
              {/* <Typography>जा.क्र.</Typography> */}
            </Grid>
          </Grid>

          {/* Date Picker */}
          <Grid container>
            <Grid item xs={8.3}></Grid>
            <Grid
              item
              sx={{
                marginTop: "5px",
                marginLeft: "-6px",
              }}
              xs={0.5}
            >
              <Typography>
                {language === "en" ? "Date" : "दिनांक"} -{" "}
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                //  disabled
                id="standard-textarea"
                // label="Department Name"
                // label={<FormattedLabel id="opinionSubject" />}

                placeholder="Department Name"
                multiline
                variant="standard"
                // style={{ width: 200 }}
                {...register("opinionRequestDate")}
                error={!!errors.opinionSubject}
                helperText={
                  errors?.opinionSubject ? errors.opinionSubject.message : null
                }
                // InputLabelProps={{
                //   //true
                //   shrink:
                //     (watch("opinionSubject") ? true : false) || (router.query.opinionSubject ? true : false),
                // }}

                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Grid>
          </Grid>

          <Grid
            container
            sx={{
              marginLeft: "2vw",
            }}
          >
            <Grid
              item
              sx={{
                marginLeft: "10px",
              }}
              xs={4}
            >
              <Typography>{language === "en" ? "To," : "प्रति,"}</Typography>
              <Typography
                style={{
                  marginLeft: "4px",
                }}
              >
                {language === "en" ? "HOD" : "एचओडी"}
              </Typography>
            </Grid>
          </Grid>

          <Box>
            <Grid
              container
              sx={{
                marginLeft: "36px",
              }}
            >
              {/* textfield for Department Name */}
              <Grid item>
                <TextField
                  sx={{ width: 200 }}
                  // disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  // label="Department Name"
                  // label={<FormattedLabel id="opinionSubject" />}

                  placeholder="Department Name"
                  variant="standard"
                  // style={{ width: 200 }}
                  {...register(
                    language === "en" ? "concenDeptName" : "departmentMr"
                  )}
                  error={!!errors.opinionSubject}
                  helperText={
                    errors?.opinionSubject
                      ? errors.opinionSubject.message
                      : null
                  }
                  InputProps={{
                    disableUnderline: true,
                    // style: { fontWeight: 'bold' },
                  }}

                  // disabled
                />
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                marginLeft: "42px",
              }}
            >
              <Grid item>
                <Typography
                  disabled
                  InputProps={{
                    style: { fontWeight: "bold" },
                  }}
                >
                  {language === "en"
                    ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION"
                    : "पिंपरी-चिंचवड महानगरपालिका"}
                </Typography>
                <Typography
                  disabled
                  InputProps={{
                    style: { fontWeight: "bold" },
                  }}
                >
                  {language === "en" ? "PIMPRI" : "पिंपरी"}- 411018.
                </Typography>
              </Grid>
            </Grid>

            {/* <Box>
            

              <TextField
                sx={{ width: 200 }}
                // disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                // label="Department Name"
                // label={<FormattedLabel id="opinionSubject" />}

                placeholder="Department Name"
               
                variant="standard"
                // style={{ width: 200 }}
                {...register("concenDeptName")}
                error={!!errors.opinionSubject}
                helperText={errors?.opinionSubject ? errors.opinionSubject.message : null}
                          
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box> */}
            {/* <Box>
             

              <Typography>PIMPRI CHINCHWAD MUNICIPAL CORPORATION</Typography>
              <Typography>PIMPRI- 411018.</Typography>
            </Box> */}

            {/* for Subject */}

            {/* EXP */}
            <Grid
              container
              sx={{
                marginTop: "40px",
                marginLeft: "200px",
              }}
              spacing={1}
            >
              <Grid item xs={3}></Grid>
              <Grid
                item
                sx={{
                  marginTop: "4px",
                }}
                xs={0.68}
              >
                <label
                  // disabled
                  htmlFor="myTextField"
                  style={{
                    fontWeight: "bold",
                    fontSize: "19px",
                  }}
                >
                  {/* <h3> */}
                  {language === "en" ? "Subject" : "विषय"}:{/* </h3> */}
                </label>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="standard"
                  id="myTextField"
                  //  disabled
                  InputProps={{
                    disableUnderline: true,
                    // style: { fontWeight: 'bold' },
                    style: {
                      fontWeight: "bold",
                      fontSize: "17px",
                      marginTop: "4px",
                    },
                  }}
                  fullWidth
                  {...register("opinionSubject")}
                />
              </Grid>
            </Grid>

            {/* for Details */}
            <Grid
              container
              spacing={1}
              sx={{
                marginTop: "30px",
                marginLeft: "2vw",
              }}
            >
              {/* <Grid item xs={3}></Grid> */}
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  // disabled
                  sx={{
                    // width: "600px",
                    width: "93%",
                  }}
                  multiline
                  variant="standard"
                  id="myTextField"
                  fullWidth
                  {...register(
                    language === "en" ? "clerkRemarkEn" : "clerkRemarkMr"
                  )}
                  //
                  InputProps={
                    {
                      // style: { fontWeight: 'bold' },
                    }
                  }
                ></TextField>
              </Grid>
            </Grid>
            {/* Box for Digital signature  */}
            <Grid
              container
              style={{
                marginTop: "20vh",
                marginLeft: "5vw",
              }}
            >
              <Grid item xl={7} lg={6}>
                {" "}
              </Grid>
              <Grid item>
                <Box
                  style={{
                    // background: "red",
                    width: "300px",
                    height: "150px",
                    border: "2px solid #000",
                    marginLeft: "220px",
                  }}
                >
                  <h3
                    style={{
                      marginLeft: "90px",
                    }}
                  >
                    {" "}
                    Digital Signature
                  </h3>
                </Box>
              </Grid>
            </Grid>

            <Grid
              container
              sx={{
                marginTop: "10vh",
              }}
            >
              <Grid item xs={8.5}></Grid>
              <Grid
                item
                xs={3.5}
                sx={{
                  marginBottom: "50px",
                }}
              >
                <h4>
                  {language === "en"
                    ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION"
                    : "पिंपरी-चिंचवड महानगरपालिका"}
                </h4>
                <h4>{language === "en" ? "PIMPRI" : "पिंपरी"}- 411018.</h4>
                <Typography></Typography>
                {/* <Typography>जा.क्र.</Typography> */}
              </Grid>
            </Grid>

            {/* </Box> */}
          </Box>
        </form>
      </Paper>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "6vh",
        }}
      >
        <Grid item>
          <Button
            sx={{
              background: "blue",
            }}
            // type="submit"
            onClick={() => router.push(`/LegalCase/transaction/opinion/`)}
          >
            <Typography
              sx={{
                color: "white",
              }}
            >
              Back
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DigitalSignature;
