import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import Transliteration from "../../../components/common/linguosol/transliteration";
import { NocTypes } from "../../../components/fireBrigadeSystem/NocTypes";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";

/** Sachin Durge */
// applicantDetails
const ApplicantDetails = ({ readOnly = false }) => {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state.labels.language);

  useEffect(() => {
    // if (router.query.pageMode === "View") {
    // if (router.query.pageMode === "Edit") {
    setValue("applicantDTLDao.applicantName", user.firstName);
    setValue("applicantDTLDao.applicantNameMr", user.firstNamemr);
    setValue("applicantDTLDao.applicantMiddleName", user.middleName);
    setValue("applicantDTLDao.applicantMiddleNameMr", user.middleNamemr);
    setValue("applicantDTLDao.applicantLastName", user.surname);
    setValue("applicantDTLDao.applicantLastNameMr", user.surnamemr);
    setValue("applicantDTLDao.applicantMobileNo", user.mobile);
    setValue("applicantDTLDao.applicantEmailId", user.emailID);
    // }
  }, [user]);

  useEffect(() => {
    console.log("234243", errors);
  }, [errors]);

  // view
  return (
    <>
      <Box
        sx={{
          margin: 1,
          padding: 2,
          // backgroundColor: "#F5F5F5",
        }}
        elevation={5}
      >
        {/* <Grid
          container
          sx={{ marginBottom: "2%" }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={styles.feildres}
        >
          <Grid item xs={4} className={styles.feildres}>
            <FormControl sx={{ width: "200%" }} error={!!errors.nocType}>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Select NOC Type
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.disabled}
                    sx={{ width: "100%" }}
                    // disabled={viewButtonInputState}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // setFirm(value.target.value);
                    }}
                    name="nocType"
                    fullWidth
                    size="small"
                    variant="standard"
                  >
                    <MenuItem value='76'>
                      Provisional Building NOC
                    </MenuItem>
                    <MenuItem value='46'>
                      Revised Provisional Building NOC
                    </MenuItem>
                    <MenuItem value='47'>
                      Final Provisional Building NOC
                    </MenuItem>
                  </Select>
                )}
                name="nocType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.nocType ? errors.nocType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid> */}
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={styles.feildres}
          spacing={4}
        >
          <Grid item xs={4} className={styles.feildres}>
            {/* <FormControl
              sx={{
                width: "100%",
              }}
              variant="standard"
              error={!!errors.nocType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Select NOC Type
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
                    label="nocType"
                  >
                    {NocTypes &&
                      NocTypes.map((nameOfUsage, index) => (
                        <MenuItem key={index} value={nameOfUsage.id}>
                          {language == "en"
                            ? nameOfUsage?.name
                            : nameOfUsage?.nameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="nocType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.nocType ? errors.nocType.message : null}
              </FormHelperText>
            </FormControl> */}

            {/* Iod Noc */}
            <TextField
              sx={{ width: "100%" }}
              id="standard-basic"
              label="NOC Type"
              variant="standard"
              defaultValue={"IOD NOC"}
              {...register("nocType")}
              disabled
              // error={!!errors?.applicantDTLDao?.applicantName}
              // disabled={router?.query?.disabled}
              // InputLabelProps={{
              //   shrink: watch("applicantDTLDao.applicantName") ? true : false,
              // }}
              // helperText={
              //   errors?.applicantDTLDao?.applicantName
              //     ? errors?.applicantDTLDao?.applicantName?.message
              //     : null
              // }
            />
          </Grid>
          <Grid item xs={4} className={styles.feildres}></Grid>
          <Grid item xs={4} className={styles.feildres}></Grid>
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
              sx={{ width: "100%" }}
              id="standard-basic"
              label={<FormattedLabel id="applicantNameEng" />}
              variant="standard"
              {...register("applicantDTLDao.applicantName")}
              error={!!errors?.applicantDTLDao?.applicantName}
              disabled={router?.query?.disabled}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantName") ? true : false,
              }}
              helperText={
                errors?.applicantDTLDao?.applicantName
                  ? errors?.applicantDTLDao?.applicantName?.message
                  : null
              }
            /> */}

            <Transliteration
              _key={"applicantDTLDao.applicantName"}
              labelName={"applicantDTLDao.applicantName"}
              fieldName={"applicantDTLDao.applicantName"}
              updateFieldName={"applicantDTLDao.applicantNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              variant="standard"
              label={<FormattedLabel id="applicantNameEng" required />}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantName") ? true : false,
              }}
              error={!!errors.applicantDTLDao?.applicantName}
              helperText={
                errors?.applicantDTLDao?.applicantName
                  ? errors.applicantDTLDao?.applicantName.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={4} className={styles.feildres}>
            {/* <TextField
              sx={{ width: "100%" }}
              id="standard-basic"
              label={<FormattedLabel id="applicantMiddleName" />}
              variant="standard"
              {...register("applicantDTLDao.applicantMiddleName")}
              error={!!errors?.applicantDTLDao?.applicantMiddleName}
              disabled={router?.query?.disabled}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantMiddleName")
                  ? true
                  : false,
              }}
              helperText={
                errors?.applicantDTLDao?.applicantMiddleName
                  ? errors.applicantDTLDao?.applicantMiddleName?.message
                  : null
              }
            /> */}

            <Transliteration
              _key={"applicantDTLDao.applicantMiddleName"}
              labelName={"applicantDTLDao.applicantMiddleName"}
              fieldName={"applicantDTLDao.applicantMiddleName"}
              updateFieldName={"applicantDTLDao.applicantMiddleNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              variant="standard"
              label={<FormattedLabel id="applicantMiddleName" required />}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantMiddleName")
                  ? true
                  : false,
              }}
              error={!!errors.applicantDTLDao?.applicantMiddleName}
              helperText={
                errors?.applicantDTLDao?.applicantMiddleName
                  ? errors.applicantDTLDao?.applicantMiddleName.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={4} className={styles.feildres}>
            {/* <TextField
              sx={{ width: "100%" }}
              id="standard-basic"
              label={<FormattedLabel id="applicantLastName" />}
              variant="standard"
              {...register("applicantDTLDao.applicantLastName")}
              error={!!errors?.applicantDTLDao?.applicantLastName}
              disabled={router?.query?.disabled}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantLastName")
                  ? true
                  : false,
              }}
              helperText={
                errors?.applicantDTLDao?.applicantLastName
                  ? errors?.applicantDTLDao?.applicantLastName?.message
                  : null
              }
            /> */}

            <Transliteration
              _key={"applicantDTLDao.applicantLastName"}
              labelName={"applicantDTLDao.applicantLastName"}
              fieldName={"applicantDTLDao.applicantLastName"}
              updateFieldName={"applicantDTLDao.applicantLastNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              variant="standard"
              label={<FormattedLabel id="applicantLastName" required />}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantLastName")
                  ? true
                  : false,
              }}
              error={!!errors.applicantDTLDao?.applicantLastName}
              helperText={
                errors?.applicantDTLDao?.applicantLastName
                  ? errors.applicantDTLDao?.applicantLastName.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={4} className={styles.feildres}>
            {/* <TextField
              id='standard-basic'
              label={<FormattedLabel id='applicantNameMr' />}
              variant='standard'
              {...register("applicantDTLDao.applicantNameMr")}
              error={!!errors?.applicantDTLDao?.applicantNameMr}
              disabled={router?.query?.disabled}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantNameMr") ? true : false,
              }}
              helperText={
                errors?.applicantDTLDao?.applicantNameMr
                  ? errors?.applicantDTLDao?.applicantNameMr?.message
                  : null
              }
            /> */}
            <Transliteration
              _key={"applicantDTLDao.applicantNameMr"}
              labelName={"applicantDTLDao.applicantNameMr"}
              fieldName={"applicantDTLDao.applicantNameMr"}
              updateFieldName={"applicantDTLDao.applicantName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              variant="standard"
              label={<FormattedLabel id="applicantNameMr" required />}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantNameMr") ? true : false,
              }}
              error={!!errors.applicantDTLDao?.applicantNameMr}
              helperText={
                errors?.applicantDTLDao?.applicantNameMr
                  ? errors.applicantDTLDao?.applicantNameMr.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={4} className={styles.feildres}>
            {/* <TextField
              sx={{ width: "80%" }}
              id='standard-basic'
              label={<FormattedLabel id='applicantMiddleNameMr' />}
              variant='standard'
              {...register("applicantDTLDao.applicantMiddleNameMr")}
              error={!!errors?.applicantDTLDao?.applicantMiddleNameMr}
              disabled={router?.query?.disabled}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantMiddleNameMr")
                  ? true
                  : false,
              }}
              helperText={
                errors?.applicantDTLDao?.applicantMiddleNameMr
                  ? errors?.applicantDTLDao?.applicantMiddleNameMr.message
                  : null
              }
            /> */}
            <Transliteration
              _key={"applicantDTLDao.applicantMiddleNameMr"}
              labelName={"applicantDTLDao.applicantMiddleNameMr"}
              fieldName={"applicantDTLDao.applicantMiddleNameMr"}
              updateFieldName={"applicantDTLDao.applicantMiddleName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              variant="standard"
              label={<FormattedLabel id="applicantMiddleNameMr" required />}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantMiddleNameMr")
                  ? true
                  : false,
              }}
              error={!!errors.applicantDTLDao?.applicantMiddleNameMr}
              helperText={
                errors?.applicantDTLDao?.applicantMiddleNameMr
                  ? errors.applicantDTLDao?.applicantMiddleNameMr.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={4} className={styles.feildres}>
            {/* <TextField
              sx={{ width: "80%" }}
              id='standard-basic'
              label={<FormattedLabel id='applicantLastNameMr' />}
              variant='standard'
              {...register("applicantDTLDao.applicantLastNameMr")}
              error={!!errors?.applicantDTLDao?.applicantLastNameMr}
              disabled={router?.query?.disabled}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantLastNameMr")
                  ? true
                  : false,
              }}
              helperText={
                errors?.applicantDTLDao?.applicantLastNameMr
                  ? errors?.applicantDTLDao?.applicantLastNameMr?.message
                  : null
              }
            /> */}
            <Transliteration
              _key={"applicantDTLDao.applicantLastNameMr"}
              labelName={"applicantDTLDao.applicantLastNameMr"}
              fieldName={"applicantDTLDao.applicantLastNameMr"}
              updateFieldName={"applicantDTLDao.applicantLastName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              variant="standard"
              label={<FormattedLabel id="applicantLastNameMr" required />}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantLastNameMr")
                  ? true
                  : false,
              }}
              error={!!errors.applicantDTLDao?.applicantLastNameMr}
              helperText={
                errors?.applicantDTLDao?.applicantLastNameMr
                  ? errors.applicantDTLDao?.applicantLastNameMr.message
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
              sx={{ width: "100%" }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNo" />}
              variant="standard"
              {...register("applicantDTLDao.applicantMobileNo")}
              error={!!errors?.applicantDTLDao?.applicantMobileNo}
              disabled={router?.query?.disabled}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantMobileNo")
                  ? true
                  : false,
              }}
              helperText={
                errors?.applicantDTLDao?.applicantMobileNo
                  ? errors?.applicantDTLDao?.applicantMobileNo?.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "100%" }}
              id="standard-basic"
              label={<FormattedLabel id="emailId" />}
              variant="standard"
              {...register("applicantDTLDao.applicantEmailId")}
              error={!!errors?.applicantDTLDao?.applicantEmailId}
              disabled={router?.query?.disabled}
              InputLabelProps={{
                shrink: watch("applicantDTLDao.applicantEmailId")
                  ? true
                  : false,
              }}
              helperText={
                errors?.applicantDTLDao?.applicantEmailId
                  ? errors?.applicantDTLDao?.applicantEmailId?.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} className={styles.feildres}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ApplicantDetails;
