import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Select,
  Table,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmitForm = () => {};

  return (
    <>
      {/* ====================================My Application================================ */}

      <Box
        display="flex"
        justifyContent="center"
        // alignItems="center"
        backgroundColor="white"
        marginTop="2rem"
        // height="100px"
      >
        {/* <h5>Payment Receipt</h5> */}

        <div>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmitForm)}
              style={{
                marginBottom: "1rem",
                marginTop: "1rem",
              }}
            >
              <div className={styles.details}>
                <div className={styles.h1Tag}>
                  <h3
                    style={{
                      color: "white",
                      marginTop: "5px",
                      paddingLeft: 10,
                    }}
                  >
                    {<FormattedLabel id="myApplication" />}
                  </h3>
                </div>
              </div>

              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={6} className={styles.feildres}>
                  <FormattedLabel id="receiptNo" />: <span>011323</span>
                </Grid>
                <Grid item xs={6} className={styles.feildres}>
                  <FormattedLabel id="issueDate" />:{/* Issue Date: */}
                  <span>12/2/2022</span>
                </Grid>
                <Grid item xs={12} className={styles.feildres}>
                  <FormControl
                    variant="standard"
                    sx={{ width: "50%" }}
                    error={!!errors.crPincode}
                  >
                    <FormattedLabel id="selectService" />
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          style={{ display: "flex", justifyContent: "center" }}
                          onChange={(value) => field.onChange(value)}
                          // label="Select service"
                          // label={<FormattedLabel id="selectService" />}
                        >
                          {/* {crPincodes &&
                                crPincodes.map((crPincode, index) => (
                                  <MenuItem key={index} value={crPincode.id}>
                                    {crPincode.crPincode}
                                  </MenuItem>
                                ))} */}
                        </Select>
                      )}
                      name="pinCode"
                      control={control}
                      defaultValue=""
                    />
                    {/* <FormHelperText>
                      {errors?.pinCode ? errors.pinCode.message : null}
                    </FormHelperText> */}
                  </FormControl>
                </Grid>
                <Grid item xs={12} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    // label="Select Noc Number"
                    style={{ width: "43%" }}
                    label={<FormattedLabel id="selectNocNumber" />}
                    variant="standard"
                    {...register("bussinessAddress")}
                    // error={!!errors.bussinessAddress}
                    // helperText={
                    //   errors?.bussinessAddress
                    //     ? errors.bussinessAddress.message
                    //     : null
                    // }
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    className={styles.button}
                  >
                    <FormattedLabel id="search" />
                  </Button>
                </Grid>
                <Grid item xs={12} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    // label="Name of applicant"
                    style={{ width: "50%" }}
                    label={<FormattedLabel id="nameOfApplicant" />}
                    variant="standard"
                    {...register("typeOfBussiness")}
                    // error={!!errors.typeOfBussiness}
                    // helperText={
                    //   errors?.typeOfBussiness
                    //     ? errors.typeOfBussiness.message
                    //     : null
                    // }
                  />
                </Grid>
                <Grid item xs={12} className={styles.feildres}>
                  <TextField
                    id="standard-basic"
                    // label="Name of applicant"
                    style={{ width: "50%" }}
                    label={<FormattedLabel id="addressOfApplicant" />}
                    variant="standard"
                    {...register("typeOfBussiness")}
                    // error={!!errors.typeOfBussiness}
                    // helperText={
                    //   errors?.typeOfBussiness
                    //     ? errors.typeOfBussiness.message
                    //     : null
                    // }
                  />
                </Grid>
                {/* <Grid item xs={12} className={styles.feildres}></Grid> */}
              </Grid>

              <br />
              <br />

              <Grid container className={styles.feildres} spacing={2}>
                <Grid item>
                  <Button
                    type="submit"
                    size="small"
                    variant="outlined"
                    className={styles.button}
                  >
                    <FormattedLabel id="submit" />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </div>
      </Box>

      {/* =====================================All services==================================== */}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="white"
        marginTop="2rem"
        // height="100px"
      >
        <div>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmitForm)}
              style={{
                marginBottom: "1rem",
                marginTop: "1rem",
              }}
            >
              <div className={styles.details}>
                <div className={styles.h1Tag}>
                  <h3
                    style={{
                      color: "white",
                      marginTop: "5px",
                      paddingLeft: 10,
                    }}
                  >
                    {<FormattedLabel id="allServices" />}
                  </h3>
                </div>
              </div>

              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={6} className={styles.feildres}>
                  <FormControl
                    style={{ marginTop: 10 }}
                    // error={!!errors.fromDate}
                  >
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            required
                            inputFormat="DD/MM/YYYY"
                            label={<FormattedLabel id="fromDate" />}
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(
                                moment(date, "YYYY-MM-DD hh:mm:ss a").format(
                                  "YYYY-MM-DD hh:mm:ss a"
                                )
                              )
                            }
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
                    {/* <FormHelperText>
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText> */}
                  </FormControl>
                </Grid>
                <Grid item xs={6} className={styles.feildres}>
                  <FormControl
                    style={{ marginTop: 10 }}
                    error={!!errors.fromDate}
                  >
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            required
                            inputFormat="DD/MM/YYYY"
                            label={<FormattedLabel id="toDate" />}
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(
                                moment(date, "YYYY-MM-DD hh:mm:ss a").format(
                                  "YYYY-MM-DD hh:mm:ss a"
                                )
                              )
                            }
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
                    {/* <FormHelperText>
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText> */}
                  </FormControl>
                </Grid>
                <Grid item xs={10} className={styles.feildres}>
                  <FormControl
                    variant="standard"
                    sx={{ width: "50%" }}
                    error={!!errors.crPincode}
                  >
                    <FormattedLabel id="modeOfPayment" />
                    {/* Select service */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          style={{ display: "flex", justifyContent: "center" }}
                          onChange={(value) => field.onChange(value)}
                          label="Select service"
                          // label={<FormattedLabel id="" />}
                        >
                          {/* {crPincodes &&
                                crPincodes.map((crPincode, index) => (
                                  <MenuItem key={index} value={crPincode.id}>
                                    {crPincode.crPincode}
                                  </MenuItem>
                                ))} */}
                        </Select>
                      )}
                      name="pinCode"
                      control={control}
                      defaultValue=""
                    />
                    {/* <FormHelperText>
                      {errors?.pinCode ? errors.pinCode.message : null}
                    </FormHelperText> */}
                  </FormControl>
                </Grid>

                <Grid item xs={2} className={styles.feildres}></Grid>
              </Grid>

              <br />
              <br />

              <Grid container className={styles.feildres} spacing={2}>
                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    className={styles.button}
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    className={styles.button}
                  >
                    <FormattedLabel id="view" />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    className={styles.button}
                  >
                    <FormattedLabel id="reset" />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </div>
      </Box>

      {/* =====================================Geo Portal================================= */}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="white"
        marginTop="2rem"
        paddingTop="2rem"
        paddingBottom="2rem"
        // height="100px"
      >
        <Table
          sx={{ minWidth: 650, width: "75%", height: "40%" }}
          size="small"
          aria-label="a dense table"
          border="1"
          stickyHeader
        >
          <TableRow style={{ backgroundColor: "#7bb4e991" }}>
            <TableCell colspan="6" align="center">
              <b style={{ backgroundColor: "white", padding: "2.5px" }}>
                Pimpri Chinchwad Municipal Corporation
              </b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="6" align="center">
              <b>
                {" "}
                <FormattedLabel id="receiptCapital" />
              </b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="6" align="center">
              <b>
                <FormattedLabel id="fireDepartment" />
              </b>
            </TableCell>
          </TableRow>
          {/* <TableRow></TableRow> */}
          <TableRow>
            <TableCell width="200px">
              <b>
                <FormattedLabel id="receiptNo" />-{" "}
              </b>
            </TableCell>
            <TableCell width="200px">123555</TableCell>
            <TableCell>
              <b>
                <FormattedLabel id="nocNo" />-{" "}
              </b>
            </TableCell>
            <TableCell colspan="2"></TableCell>
          </TableRow>

          <TableRow>
            <TableCell colspan="3">
              <b>
                <FormattedLabel id="partyName" />-{" "}
              </b>
            </TableCell>
            <TableCell colspan="" width="100px">
              <FormattedLabel id="loiNo" />-{" "}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="3">
              <b>
                <FormattedLabel id="partyAddress" />-{" "}
              </b>
            </TableCell>
            <TableCell width="100px">
              <FormattedLabel id="loiDate" />-{" "}
            </TableCell>
            <TableCell> </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan="3"></TableCell>
            <TableCell colspan="2" align="center">
              <b>
                <FormattedLabel id="financialYear" />
              </b>
            </TableCell>
          </TableRow>
          <TableRow style={{ position: "relative" }}>
            <TableCell colspan="2" rowspan={3}>
              <span style={{ position: "absolute", top: "10px" }}>
                <FormattedLabel id="fireCertificate" />-{" "}
              </span>
            </TableCell>
            <TableCell colspan="1" align="end">
              50
            </TableCell>
            <TableCell colspan="2" align="center">
              2017-18
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="1"></TableCell>
            <TableCell colspan="2" align="center">
              <b>
                <FormattedLabel id="transactionId" />
              </b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="1"></TableCell>
            <TableCell colspan="2" align="center">
              123456
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="2" rowspan={1}>
              <span style={{ display: "flex", justifyContent: "end" }}>
                <FormattedLabel id="total" />{" "}
              </span>
            </TableCell>
            <TableCell colspan="1">50</TableCell>
            <TableCell colspan="2" align="center">
              <b>
                <FormattedLabel id="paymentType" />
              </b>
            </TableCell>
          </TableRow>
          <TableRow style={{ position: "relative" }}>
            <TableCell colspan="3" rowspan={3}>
              <div style={{ lineHeight: "25px" }}>
                <span style={{ position: "absolute", top: "10px" }}>
                  {" "}
                  <FormattedLabel id="amountInWord" />-<br />
                </span>
                <span>
                  {" "}
                  <FormattedLabel id="description" />-{" "}
                </span>
              </div>
            </TableCell>
            <TableCell colspan="2" align="center">
              online/offline
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="2" align="center">
              <b>
                <FormattedLabel id="onlinePayment" />
              </b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="2" align="center">
              <b>pcmc@gmail.com</b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="6">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <FormattedLabel id="printedBy" />:
                </span>
                <span>
                  <FormattedLabel id="dateAndTime" />
                  :-12/12/2022
                </span>
              </div>
            </TableCell>
          </TableRow>
        </Table>
      </Box>
    </>
  );
};

export default Index;
