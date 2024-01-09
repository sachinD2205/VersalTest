import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useSelector } from "react-redux"
import Transliteration from "../../../components/common/linguosol/transliteration"
import { NocTypes } from "../../../components/fireBrigadeSystem/NocTypes"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import styles from "../../../styles/fireBrigadeSystem/view.module.css"

/** Sachin Durge */
// applicantDetails
const ApplicantDetails = ({ readOnly = false }) => {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext()
  const router = useRouter()
  const user = useSelector((state) => state?.user.user)
  const language = useSelector((state) => state.labels.language)

  const [disabledOrNot, setDisabledOrNot] = useState(false)

  useEffect(() => {
    // if (router.query.pageMode === "View") {
    // if (router.query.pageMode === "Edit") {
    setValue("applicantDTLDao.applicantName", user.firstName)
    setValue("applicantDTLDao.applicantNameMr", user.firstNamemr)
    setValue("applicantDTLDao.applicantMiddleName", user.middleName)
    setValue("applicantDTLDao.applicantMiddleNameMr", user.middleNamemr)
    setValue("applicantDTLDao.applicantLastName", user.surname)
    setValue("applicantDTLDao.applicantLastNameMr", user.surnamemr)
    setValue("applicantDTLDao.applicantMobileNo", user.mobile)
    setValue("applicantDTLDao.applicantEmailId", user.emailID)
    // }
  }, [user])

  useEffect(() => {
    if (router?.query?.disabled) {
      setDisabledOrNot(JSON.parse(router?.query?.disabled))
    }
  }, [router?.query])

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
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={styles.feildres}
          spacing={4}
        >
          <Grid item xs={4} className={styles.feildres}>
            <FormControl
              sx={{
                width: "100%",
              }}
              variant="standard"
              error={!!errors.nocType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="nameOfUsage" /> */}
                Select NOC Type
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    disabled={disabledOrNot}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
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
            </FormControl>
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
            <Transliteration
              _key={"applicantDTLDao.applicantName"}
              labelName={"applicantDTLDao.applicantName"}
              fieldName={"applicantDTLDao.applicantName"}
              updateFieldName={"applicantDTLDao.applicantNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              variant="standard"
              disabled={disabledOrNot}
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
            <Transliteration
              _key={"applicantDTLDao.applicantMiddleName"}
              labelName={"applicantDTLDao.applicantMiddleName"}
              fieldName={"applicantDTLDao.applicantMiddleName"}
              updateFieldName={"applicantDTLDao.applicantMiddleNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              variant="standard"
              disabled={disabledOrNot}
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
            <Transliteration
              _key={"applicantDTLDao.applicantLastName"}
              labelName={"applicantDTLDao.applicantLastName"}
              fieldName={"applicantDTLDao.applicantLastName"}
              updateFieldName={"applicantDTLDao.applicantLastNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              variant="standard"
              disabled={disabledOrNot}
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
            <Transliteration
              _key={"applicantDTLDao.applicantNameMr"}
              labelName={"applicantDTLDao.applicantNameMr"}
              fieldName={"applicantDTLDao.applicantNameMr"}
              updateFieldName={"applicantDTLDao.applicantName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              variant="standard"
              disabled={disabledOrNot}
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
            <Transliteration
              _key={"applicantDTLDao.applicantMiddleNameMr"}
              labelName={"applicantDTLDao.applicantMiddleNameMr"}
              fieldName={"applicantDTLDao.applicantMiddleNameMr"}
              updateFieldName={"applicantDTLDao.applicantMiddleName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              variant="standard"
              disabled={disabledOrNot}
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
            <Transliteration
              _key={"applicantDTLDao.applicantLastNameMr"}
              labelName={"applicantDTLDao.applicantLastNameMr"}
              fieldName={"applicantDTLDao.applicantLastNameMr"}
              updateFieldName={"applicantDTLDao.applicantLastName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              variant="standard"
              disabled={disabledOrNot}
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
              disabled={disabledOrNot}
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
              disabled={disabledOrNot}
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
  )
}

export default ApplicantDetails
