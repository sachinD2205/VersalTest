import { Box, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import Transliteration from "../../common/linguosol/transliteration";
import { yupResolver } from "@hookform/resolvers/yup";

// http://localhost:4000/hawkerManagementSystem/transactions/components/AdditionalDetails
const AdditionalDetails = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  // const methods = useForm({
  //   criteriaMode: "all",
  //   // resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   watch,
  //   getValues,
  //   formState: { errors },
  // } = methods;

  // const [value, setValue] = React.useState(new Date());
  const [valueDate, setValueDate] = React.useState(new Date());
  const [valueDateTime, setValueDateTime] = React.useState(new Date());
  const [valueDateTimeVardi, setValueDateTimeVardi] = React.useState(
    new Date()
  );

  const router = useRouter();

  // useEffect(() => {
  //   if (router.query.pageMode === "Edit" || router.query.pageMode === "View") {
  //     console.log("222222", router.query);
  //     if (router?.query?.id) {
  //       axios
  //         .get(`${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${router?.query?.id}`)
  //         .then((res) => {
  //           // if (r.status == 200) {
  //           console.log("332233", res.data);
  //           reset(res?.data);
  //         })
  //         .catch((err) => {
  //           console.log("errApplication", err);
  //         });
  //     }
  //   }
  // }, []);

  // finacialLoss
  // finacialLossMr
  // lossOfBuildingMaterial
  // lossOfBuildingMaterialMr
  // otherOutsideLoss
  // otherOutsideLossMr
  // actual
  // saveOfLoss
  // officerNameToReleaseVehicle
  // dateAndTimeOfVardi
  // totalTimeConsumedAtLocationInHrsAndMinutes

  return (
    <>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
        spacing={4}
      >
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="finacialLoss" />}
            variant="standard"
            {...register("finalAhawal.finacialLoss")}
            error={!!errors.finacialLoss}
            helperText={errors?.finacialLoss ? errors.finacialLoss.message : null}
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.finacialLoss"}
            labelName={<FormattedLabel id='finacialLoss' required />}
            fieldName={"finalAhawal.finacialLoss"}
            updateFieldName={"finalAhawal.finacialLossMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='finacialLoss' required />}
            error={!!errors.finacialLoss}
            helperText={
              errors?.finacialLoss ? errors.finacialLoss.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="lossOfBuildingMaterial" />}
            variant="standard"
            {...register("finalAhawal.lossOfBuildingMaterial")}
            error={!!errors.lossOfBuildingMaterial}
            helperText={errors?.lossOfBuildingMaterial ? errors.lossOfBuildingMaterial.message : null}
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.lossOfBuildingMaterial"}
            labelName={"finalAhawal.lossOfBuildingMaterial"}
            fieldName={"finalAhawal.lossOfBuildingMaterial"}
            updateFieldName={"finalAhawal.lossOfBuildingMaterialMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='lossOfBuildingMaterial' required />}
            error={!!errors.lossOfBuildingMaterial}
            helperText={
              errors?.lossOfBuildingMaterial
                ? errors.lossOfBuildingMaterial.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="otherOutsideLoss" />}
            variant="standard"
            {...register("finalAhawal.otherOutsideLoss")}
            error={!!errors.otherOutsideLoss}
            helperText={errors?.otherOutsideLoss ? errors.otherOutsideLoss.message : null}
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.otherOutsideLoss"}
            labelName={"finalAhawal.otherOutsideLoss"}
            fieldName={"finalAhawal.otherOutsideLoss"}
            updateFieldName={"finalAhawal.otherOutsideLossMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='otherOutsideLoss' required />}
            error={!!errors.otherOutsideLoss}
            helperText={
              errors?.otherOutsideLoss ? errors.otherOutsideLoss.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
            label={<FormattedLabel id='finacialLossMr' />}
            variant='standard'
            {...register("finalAhawal.finacialLossMr")}
            error={!!errors.finacialLossMr}
            helperText={
              errors?.finacialLossMr ? errors.finacialLossMr.message : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.finacialLossMr"}
            labelName={"finalAhawal.finacialLossMr"}
            fieldName={"finalAhawal.finacialLossMr"}
            updateFieldName={"finalAhawal.finacialLoss"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id='finacialLossMr' required />}
            error={!!errors.finacialLossMr}
            helperText={
              errors?.finacialLossMr ? errors.finacialLossMr.message : null
            }
            InputLabelProps={{
              shrink: true,
            }}
            // InputLabelProps={ shrink: "finalAhawal.finacialLossMr" ? true : false}
            // InputLabelProps={"finalAhawal.finacialLossMr"}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
            label={<FormattedLabel id='lossOfBuildingMaterialMr' />}
            variant='standard'
            {...register("finalAhawal.lossOfBuildingMaterialMr")}
            error={!!errors.lossOfBuildingMaterialMr}
            helperText={
              errors?.lossOfBuildingMaterialMr
                ? errors.lossOfBuildingMaterialMr.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.lossOfBuildingMaterialMr"}
            labelName={"finalAhawal.lossOfBuildingMaterialMr"}
            fieldName={"finalAhawal.lossOfBuildingMaterialMr"}
            updateFieldName={"finalAhawal.lossOfBuildingMaterial"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id='lossOfBuildingMaterialMr' required />}
            error={!!errors.lossOfBuildingMaterialMr}
            helperText={
              errors?.lossOfBuildingMaterialMr
                ? errors.lossOfBuildingMaterialMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
            label={<FormattedLabel id='otherOutsideLossMr' />}
            variant='standard'
            {...register("finalAhawal.otherOutsideLossMr")}
            error={!!errors.otherOutsideLossMr}
            helperText={
              errors?.otherOutsideLossMr
                ? errors.otherOutsideLossMr.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.otherOutsideLossMr"}
            labelName={"finalAhawal.otherOutsideLossMr"}
            fieldName={"finalAhawal.otherOutsideLossMr"}
            updateFieldName={"finalAhawal.otherOutsideLoss"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id='otherOutsideLossMr' required />}
            error={!!errors.otherOutsideLossMr}
            helperText={
              errors?.otherOutsideLossMr
                ? errors.otherOutsideLossMr.message
                : null
            }
          />
        </Grid>
      </Grid>
      <br />
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
        spacing={4}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            size='small'
            sx={{ width: "100%", backgroundColor: "white" }}
            variant='outlined'
            id='outlined-basic'
            label={<FormattedLabel id='actual' />}
            {...register("finalAhawal.actual")}
            error={!!errors.actual}
            helperText={errors?.actual ? errors.actual.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            size='small'
            sx={{ width: "100%", backgroundColor: "white" }}
            variant='outlined'
            id='outlined-basic'
            label={<FormattedLabel id='saveOfLoss' />}
            {...register("finalAhawal.saveOfLoss")}
            error={!!errors.saveOfLoss}
            helperText={errors?.saveOfLoss ? errors.saveOfLoss.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            size='small'
            sx={{ width: "100%", backgroundColor: "white" }}
            variant='outlined'
            id='outlined-basic'
            label={<FormattedLabel id='constructionLoss' />}
            {...register("finalAhawal.constructionLoss")}
            error={!!errors.constructionLoss}
            helperText={
              errors?.constructionLoss ? errors.constructionLoss.message : null
            }
          />
        </Grid>
        <Grid item xs={12} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
            label={<FormattedLabel id='fireLossInformationDetails' />}
            variant='standard'
            {...register("finalAhawal.fireLossInformationDetails")}
            error={!!errors.fireLossInformationDetails}
            helperText={
              errors?.fireLossInformationDetails
                ? errors.fireLossInformationDetails.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.fireLossInformationDetails"}
            labelName={"finalAhawal.fireLossInformationDetails"}
            fieldName={"finalAhawal.fireLossInformationDetails"}
            updateFieldName={"finalAhawal.fireLossInformationDetailsMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='fireLossInformationDetails' required />}
            error={!!errors.fireLossInformationDetails}
            helperText={
              errors?.fireLossInformationDetails
                ? errors.fireLossInformationDetails.message
                : null
            }
          />
        </Grid>
        <Grid item xs={12} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
            label={<FormattedLabel id='fireLossInformationDetailsMr' />}
            variant='standard'
            {...register("finalAhawal.fireLossInformationDetailsMr")}
            error={!!errors.fireLossInformationDetailsMr}
            helperText={
              errors?.fireLossInformationDetailsMr
                ? errors.fireLossInformationDetailsMr.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.fireLossInformationDetailsMr"}
            labelName={"finalAhawal.fireLossInformationDetailsMr"}
            fieldName={"finalAhawal.fireLossInformationDetailsMr"}
            updateFieldName={"finalAhawal.fireLossInformationDetails"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={
              <FormattedLabel id='fireLossInformationDetailsMr' required />
            }
            error={!!errors.fireLossInformationDetailsMr}
            helperText={
              errors?.fireLossInformationDetailsMr
                ? errors.fireLossInformationDetailsMr.message
                : null
            }
          />
        </Grid>
        {/* 
        <Grid item xs={4} sx={{ marginTop: "5%" }} className={styles.feildres}>
          <FormControl
            sx={{ width: "65%" }}
            error={!!errors.dateAndTimeOfVardi}
          >
            <Controller
              control={control}
              name="dateAndTimeOfVardi"
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
               
                  <DateTimePicker
                    renderInput={(props) => (
                       <TextField
  sx={{width: "80%"}} size="small" {...props} />
                    )}
                    label={<FormattedLabel id="dateAndTimeOfVardi" />}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                  />
                </LocalizationProvider>
              )}
            />

            <FormHelperText>
              {errors?.dateAndTimeOfVardi
                ? errors.dateAndTimeOfVardi.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={4} className={styles.feildres}>
          <FormControl
            style={{ marginTop: 10 }}
            error={!!errors.dateAndTimeOfVardi}
          >
            <Controller
              control={control}
              // defaultValue={moment(dateAndTimeOfVardi).format(
              //   "YYYY-DD-MMThh:mm:ss"
              // )}
              name="dateAndTimeOfVardi"
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    readOnly
                    label={<FormattedLabel id="dateAndTimeOfVardi" />}
                    value={field.value}
                    // onChange={(date) =>
                    //   field.onChange(
                    //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                    //   )
                    // }
                    //selected={field.value}
                    renderInput={(params) => (
                       <TextField
  sx={{width: "80%"}} size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.dateAndTimeOfVardi
                ? errors.dateAndTimeOfVardi.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={4} sx={{ marginTop: "5%" }} className={styles.feildres}>
          <FormControl sx={{ width: "65%" }} error={!!errors.vardiDispatchTime}>
            <Controller
              control={control}
              name="totalTimeConsumedAtLocationInHrsAndMinutes"
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <TimePicker
                    label={
                      <FormattedLabel id="totalTimeConsumedAtLocationInHrsAndMinutes" />
                    }
                    // label="Total Time Consumed at Location in Hrs and Minutes *"
                    value={field.value}
                    onChange={(time) => field.onChange(time)}
                    selected={field.value}
                    renderInput={(params) => (
                       <TextField
  sx={{width: "80%"}} size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.vardiDispatchTime
                ? errors.vehicleDispatchTime.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
      </Grid>

      {/* <div>
            <FormControl
              style={{ marginTop: 10 }}
              error={!!errors.dateAndTimeOfVardi}
            >
              <Controller
                control={control}
                name="dateAndTimeOfVardi"
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      renderInput={(props) =>  <TextField
  sx={{width: "80%"}} {...props} />}
                      label={<FormattedLabel id="dateAndTimeOfVardi" />}
                      value={field.value}
                      selected={field.value}
                      onChange={(date) =>
                        field.onChange(
                          moment(date).format("YYYY-MM-DD hh:mm:ss")
                          // moment(date).format("YYYY-MM-DDThh:mm:ss")
                        )
                      }
                    /> 
                    <DateTimePicker
                      renderInput={(props) =>  <TextField
  sx={{width: "80%"}} {...props} />}
                      label={<FormattedLabel id="dateAndTimeOfVardi" />}
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </LocalizationProvider>
                )}
              />

              <FormHelperText>
                {errors?.dateAndTimeOfVardi
                  ? errors.dateAndTimeOfVardi.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div> */}

      {/* <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={(props) =>  <TextField
  sx={{width: "80%"}} {...props} />}
                label="Vehicle Left at Location Date and Time"
                value={valueDateTimeVardi}
                onChange={(newValue) => {
                  setValueDateTimeVardi(newValue);
                }}
              />
            </LocalizationProvider>
          </div> */}

      <br />
      <br />
      <Box className={styles.tableHead}>
        <Box className={styles.feildHead}>
          {<FormattedLabel id='paymentDetails' />}
        </Box>
      </Box>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        spacing={4}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            
            id='standard-basic'
            variant='standard'
          
            label={<FormattedLabel id='firstName' />}
            {...register("finalAhawal.billPayerName")}
            error={!!errors.billPayerName}
            helperText={
              errors?.billPayerName ? errors.billPayerName.message : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayerName"}
            labelName={"finalAhawal.billPayerName"}
            fieldName={"finalAhawal.billPayerName"}
            updateFieldName={"finalAhawal.billPayerNameMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='firstName' required />}
            error={errors?.finalAhawal?.billPayerName}
            helperText={
              errors?.finalAhawal?.billPayerName
                ? errors?.finalAhawal?.billPayerName.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
          
            label={<FormattedLabel id='middleName' />}
            variant='standard'
            {...register("finalAhawal.billPayerMiddleName")}
            error={!!errors.billPayerMiddleName}
            helperText={
              errors?.billPayerMiddleName
                ? errors.billPayerMiddleName.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayerMiddleName"}
            labelName={"finalAhawal.billPayerMiddleName"}
            fieldName={"finalAhawal.billPayerMiddleName"}
            updateFieldName={"finalAhawal.billPayerMiddleNameMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='middleName' required />}
            error={errors?.finalAhawal?.billPayerMiddleName}
            helperText={
              errors?.finalAhawal?.billPayerMiddleName
                ? errors?.finalAhawal?.billPayerMiddleName.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
        
            label={<FormattedLabel id='lastName' />}
            variant='standard'
            {...register("finalAhawal.billPayerLastName")}
            error={!!errors.billPayerLastName}
            helperText={
              errors?.billPayerLastName
                ? errors.billPayerLastName.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayerLastName"}
            labelName={"finalAhawal.billPayerLastName"}
            fieldName={"finalAhawal.billPayerLastName"}
            updateFieldName={"finalAhawal.billPayerLastNameMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='lastName' required />}
            error={errors?.finalAhawal?.billPayerLastName}
            helperText={
              errors?.finalAhawal?.billPayerLastName
                ? errors?.finalAhawal?.billPayerLastName.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
        
            label={<FormattedLabel id='firstNameMr' />}
            variant='standard'
            {...register("finalAhawal.billPayerNameMr")}
            error={!!errors.billPayerNameMr}
            helperText={
              errors?.billPayerNameMr ? errors.billPayerNameMr.message : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayerNameMr"}
            labelName={"finalAhawal.billPayerNameMr"}
            fieldName={"finalAhawal.billPayerNameMr"}
            updateFieldName={"finalAhawal.billPayerName"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id='firstNameMr' required />}
            error={errors?.finalAhawal?.billPayerNameMr}
            helperText={
              errors?.finalAhawal?.billPayerNameMr
                ? errors?.finalAhawal?.billPayerNameMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
        
            label={<FormattedLabel id='middleNameMr' />}
            variant='standard'
            {...register("finalAhawal.billPayerMiddleMr")}
            error={!!errors.billPayerMiddleMr}
            helperText={
              errors?.billPayerMiddleMr
                ? errors.billPayerMiddleMr.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayerMiddleMr"}
            labelName={"finalAhawal.billPayerMiddleMr"}
            fieldName={"finalAhawal.billPayerMiddleMr"}
            updateFieldName={"finalAhawal.billPayerMiddle"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id='middleNameMr' required />}
            error={errors?.finalAhawal?.billPayerMiddleMr}
            helperText={
              errors?.finalAhawal?.billPayerMiddleMr
                ? errors?.finalAhawal?.billPayerMiddleMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
       
            label={<FormattedLabel id='lastNameMr' />}
            variant='standard'
            {...register("finalAhawal.billPayerLastNameMr")}
            error={!!errors.billPayerLastNameMr}
            helperText={
              errors?.billPayerLastNameMr
                ? errors.billPayerLastNameMr.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayerLastNameMr"}
            labelName={"finalAhawal.billPayerLastNameMr"}
            fieldName={"finalAhawal.billPayerLastNameMr"}
            updateFieldName={"finalAhawal.billPayerLastName"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id='lastNameMr' required />}
            error={errors?.finalAhawal?.billPayerLastNameMr}
            helperText={
              errors?.finalAhawal?.billPayerLastNameMr
                ? errors?.finalAhawal?.billPayerLastNameMr.message
                : null
            }
          />
        </Grid>
      </Grid>
      <br />

      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
        spacing={4}
      >
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
            label={<FormattedLabel id='area' />}
            variant='standard'
            {...register("finalAhawal.billPayeraddress")}
            error={!!errors.billPayeraddress}
            helperText={
              errors?.billPayeraddress ? errors.billPayeraddress.message : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayeraddress"}
            labelName={"finalAhawal.billPayeraddress"}
            fieldName={"finalAhawal.billPayeraddress"}
            updateFieldName={"finalAhawal.billPayeraddressMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='area' required />}
            error={errors?.finalAhawal?.billPayeraddress}
            helperText={
              errors?.finalAhawal?.billPayeraddress
                ? errors?.finalAhawal?.billPayeraddress.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
            label={<FormattedLabel id='city' />}
            variant='standard'
            {...register("finalAhawal.billPayerVillage")}
            error={!!errors.billPayerVillage}
            helperText={
              errors?.billPayerVillage ? errors.billPayerVillage.message : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayerVillage"}
            labelName={"finalAhawal.billPayerVillage"}
            fieldName={"finalAhawal.billPayerVillage"}
            updateFieldName={"finalAhawal.billPayerVillageMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='city' required />}
            error={errors?.finalAhawal?.billPayerVillage}
            helperText={
              errors?.finalAhawal?.billPayerVillage
                ? errors?.finalAhawal?.billPayerVillage.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            size='small'
            sx={{ width: "100%", backgroundColor: "white" }}
            id='outlined-basic'
            variant='outlined'
            label={<FormattedLabel id='contactNumber' />}
            {...register("finalAhawal.billPayerContact")}
            error={errors?.finalAhawal?.billPayerContact}
            helperText={
              errors?.finalAhawal?.billPayerContact
                ? errors?.finalAhawal?.billPayerContact.message
                : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
            label={<FormattedLabel id='areaMr' />}
            variant='standard'
            {...register("finalAhawal.billPayeraddressMr")}
            error={!!errors.billPayeraddressMr}
            helperText={
              errors?.billPayeraddressMr
                ? errors.billPayeraddressMr.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayeraddressMr"}
            labelName={"finalAhawal.billPayeraddressMr"}
            fieldName={"finalAhawal.billPayeraddressMr"}
            updateFieldName={"finalAhawal.billPayeraddress"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id='areaMr' required />}
            error={errors?.finalAhawal?.billPayeraddressMr}
            helperText={
              errors?.finalAhawal?.billPayeraddressMr
                ? errors?.finalAhawal?.billPayeraddressMr.message
                : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          {/* <TextField
            sx={{ width: "80%" }}
            id='standard-basic'
            label={<FormattedLabel id='cityMr' />}
            variant='standard'
            {...register("finalAhawal.billPayerVillageMr")}
            error={!!errors.billPayerVillageMr}
            helperText={
              errors?.billPayerVillageMr
                ? errors.billPayerVillageMr.message
                : null
            }
          /> */}
          <Transliteration
            variant={"outlined"}
            _key={"finalAhawal.billPayerVillageMr"}
            labelName={"finalAhawal.billPayerVillageMr"}
            fieldName={"finalAhawal.billPayerVillageMr"}
            updateFieldName={"finalAhawal.billPayerVillage"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id='cityMr' required />}
            error={errors?.finalAhawal?.billPayerVillageMr}
            helperText={
              errors?.finalAhawal?.billPayerVillageMr
                ? errors?.finalAhawal?.billPayerVillageMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            size='small'
            sx={{ width: "100%", backgroundColor: "white" }}
            id='outlined-basic'
            variant='outlined'
            label={<FormattedLabel id='email' />}
            {...register("finalAhawal.billPayerEmail")}
            error={errors?.finalAhawal?.billPayerEmail}
            helperText={
              errors?.finalAhawal?.billPayerEmail
                ? errors?.finalAhawal?.billPayerEmail.message
                : null
            }
          />
        </Grid>
      </Grid>
      <br />
      <br />

      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
        spacing={4}
      >
        <Grid item xs={4} className={styles.feildres}></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>
    </>
  );
};

export default AdditionalDetails;
