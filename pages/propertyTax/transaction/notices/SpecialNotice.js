import {
  Paper,
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
  Switch,
  TextField,
  Typography,
  ThemeProvider,
} from "@mui/material"
import React from "react"
import { useForm, useFormContext } from "react-hook-form"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { makeStyles } from "@mui/styles"
import { LocalizationProvider } from "@mui/x-date-pickers"
import theme from "../../../../theme"

const useStyles = makeStyles((theme) => ({
  inputField: {
    width: "100%",
    margin: theme.spacing(1, 0),
  },
}))

//http://localhost:4000/propertyTax/transaction/notices/SpecialNotice
const SpecialNotice = () => {
  const classes = useStyles()
  const { register, handleSubmit } = useForm()

  return (
    <div>
      <h2>Special Notice</h2>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          {/* <form
            // onSubmit={methods.handleSubmit(handleNext)}
            onSubmit={() => {
              console.log(first);
            }}
            sx={{ marginTop: 10 }}
          >
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // label=<FormattedLabel id="nameOfBank" />
                variant="standard"
                // {...register("nameOfBank")}
                // error={!!errors.nameOfBank}
                // helperText={errors?.nameOfBank ? errors.nameOfBank.message : null}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              sx={{ marginTop: 2 }}
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  <FormattedLabel id="validateOTP" />
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="Yes"
                    // control={<Radio />}
                    // label=<FormattedLabel id="" />
                    name="disbality"
                    {
                      ...register("validateOTP")
                      // error={!!errors.validateO}TP}
                      // helperText={
                      //   errors?.validateOTP ? errors.validateOTP.message : null
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </form> */}

          <form>
            {/* 1) TextField */}
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
                <TextField
                  placeholder="Enter Your First Name"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  className={classes.inputField}
                  name="firstname"
                  inputRef={register}
                />
              </Grid>
              {/* 2) TextField */}
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  placeholder="Enter Your Last Name"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  className={classes.inputField}
                  name="lastname"
                  inputRef={register}
                />
              </Grid>

              {/* 3) TextField */}
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  placeholder="Enter Your E-mail Address"
                  label="E-mail"
                  variant="outlined"
                  fullWidth
                  className={classes.inputField}
                  name="email"
                  inputRef={register}
                />
              </Grid>

              {/* 4) TextField */}
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  placeholder="Enter Your Phone Number"
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  className={classes.inputField}
                  name="phone"
                  inputRef={register}
                />
              </Grid>
              {/* <LocalizationProvider>
              <DatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                label="Date of Admission"
                value={null}
                fullWidth
              /> */}

              {/* 4) Time Picker  */}
              {/* <KeyboardTimePicker
                margin="normal"
                label="Time of Admission"
                value={null}
                fullWidth
              /> */}
              {/* </LocalizationProvider> */}
              {/* Radio Buttons */}
              <FormControl className={classes.inputField}>
                <FormLabel>Choose Your Gender</FormLabel>
                <RadioGroup row name="gender">
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>

              {/* Select */}
              <FormControl fullWidth className={classes.inputField}>
                <InputLabel id="demo-simple-select-label">
                  Select Your Course
                </InputLabel>

                <Select>
                  <MenuItem value="">Choose your course</MenuItem>
                  <MenuItem value="Web Development">Web Development</MenuItem>
                  <MenuItem value="App Development">App Development</MenuItem>
                  <MenuItem value="UI/UX">UI/UX</MenuItem>
                </Select>
              </FormControl>

              {/*  Switch */}
              <FormControlLabel
                className={classes.inputField}
                control={<Switch />}
                label="Send me regular updates"
              />

              {/* Checkbox */}
              <FormControlLabel
                style={{ display: "block", marginBottom: 15 }}
                control={<Checkbox />}
                label="I aggree all terms and conditions"
              />

              <Button variant="contained" color="primary" type="submit">
                create new account
              </Button>
            </Grid>
          </form>
        </Paper>
      </ThemeProvider>
    </div>
  )
}

export default SpecialNotice
